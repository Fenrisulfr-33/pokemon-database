import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import readJsonDir from "#genericFunctions/files/readJsonDir.js";
import {
    ABILITIES_ENTRIES_DIR,
    FORMS_DIR,
    POKEDEX_ENTRIES_DIR,
} from "#helpers/paths.js";

const BLOCK_KEY = '"pokemonWithAbility":';

function readFormsWithAbilities() {
    return fs.readdirSync(FORMS_DIR, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .flatMap((folder) => readJsonDir(path.join(FORMS_DIR, folder.name)))
        .filter((form) => form.abilities !== undefined);
}

function readPokemonWithAbilities() {
    return [...readJsonDir(POKEDEX_ENTRIES_DIR), ...readFormsWithAbilities()];
}

function emptyLists() {
    return { normal: [], hidden: [] };
}

function addPokemon(listsByAbility, abilityId, slot, pokemonId) {
    if (!listsByAbility.has(abilityId)) {
        listsByAbility.set(abilityId, emptyLists());
    }
    listsByAbility.get(abilityId)[slot].push(pokemonId);
}

function buildPokemonWithAbility(pokedex) {
    const listsByAbility = new Map();
    const sortedPokedex = [...pokedex].sort(
        (first, second) => first._id - second._id
    );
    for (const pokemon of sortedPokedex) {
        const { normal, hidden } = pokemon.abilities;
        for (const abilityId of normal) {
            addPokemon(listsByAbility, abilityId, "normal", pokemon._id);
        }
        if (hidden !== null) {
            addPokemon(listsByAbility, hidden, "hidden", pokemon._id);
        }
    }
    return listsByAbility;
}

function findBlockEnd(text, openIndex) {
    let depth = 0;
    let inString = false;
    for (let index = openIndex; index < text.length; index++) {
        const character = text[index];
        if (inString) {
            if (character === "\\") index++;
            else if (character === '"') inString = false;
            continue;
        }
        if (character === '"') inString = true;
        if (character === "{") depth++;
        if (character === "}" && --depth === 0) return index + 1;
    }
    throw new Error("Unbalanced pokemonWithAbility block");
}

function formatIdList(ids, indent, newline) {
    if (ids.length === 0) return "[]";
    const itemIndent = indent.repeat(3);
    const items = ids.map((id) => `${itemIndent}${id}`).join(`,${newline}`);
    return `[${newline}${items}${newline}${indent.repeat(2)}]`;
}

function formatBlock(lists, indent, newline) {
    const innerIndent = indent + indent;
    const normal = formatIdList(lists.normal, indent, newline);
    const hidden = formatIdList(lists.hidden, indent, newline);
    return [
        "{",
        `${innerIndent}"normal": ${normal},`,
        `${innerIndent}"hidden": ${hidden}`,
        `${indent}}`,
    ].join(newline);
}

function replaceBlock(text, lists) {
    const keyIndex = text.indexOf(BLOCK_KEY);
    if (keyIndex === -1) throw new Error("No pokemonWithAbility key");
    const lineStart = text.lastIndexOf("\n", keyIndex) + 1;
    const indent = text.slice(lineStart, keyIndex);
    const newline = text.includes("\r\n") ? "\r\n" : "\n";
    const openIndex = text.indexOf("{", keyIndex);
    const closeIndex = findBlockEnd(text, openIndex);
    const block = formatBlock(lists, indent, newline);
    return text.slice(0, openIndex) + block + text.slice(closeIndex);
}

function appendBlock(text, lists) {
    const newline = text.includes("\r\n") ? "\r\n" : "\n";
    const indent = text.match(/^([ \t]+)"_id"/m)[1];
    const closeIndex = text.lastIndexOf("}");
    const body = text.slice(0, closeIndex).trimEnd();
    const block = formatBlock(lists, indent, newline);
    return `${body},${newline}${indent}${BLOCK_KEY} ${block}${newline}`
        + text.slice(closeIndex);
}

function updateAbilityFile(filePath, listsByAbility) {
    const text = fs.readFileSync(filePath, "utf8");
    const ability = JSON.parse(text);
    const lists = listsByAbility.get(ability._id);
    if (!ability.pokemonWithAbility && !lists) return false;
    const updatedText = ability.pokemonWithAbility
        ? replaceBlock(text, lists ?? emptyLists())
        : appendBlock(text, lists);
    if (updatedText === text) return false;
    fs.writeFileSync(filePath, updatedText);
    return true;
}

function abilityFilePaths() {
    return fs
        .readdirSync(ABILITIES_ENTRIES_DIR)
        .filter((fileName) => path.extname(fileName) === ".json")
        .map((fileName) => path.join(ABILITIES_ENTRIES_DIR, fileName));
}

function reportUnknownAbilities(listsByAbility, filePaths) {
    const knownIds = new Set(
        filePaths.map((filePath) => JSON.parse(
            fs.readFileSync(filePath, "utf8")
        )._id)
    );
    const unknownIds = [...listsByAbility.keys()]
        .filter((abilityId) => !knownIds.has(abilityId));
    if (unknownIds.length > 0) {
        console.warn(`No ability file for ids: ${unknownIds.join(", ")}`);
    }
}

function updatePokemonWithAbility() {
    const listsByAbility = buildPokemonWithAbility(readPokemonWithAbilities());
    const filePaths = abilityFilePaths();
    reportUnknownAbilities(listsByAbility, filePaths);
    const changedCount = filePaths.filter(
        (filePath) => updateAbilityFile(filePath, listsByAbility)
    ).length;
    console.log(
        `Updated ${changedCount} of ${filePaths.length} ability files`
    );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    updatePokemonWithAbility();
}

export {
    buildPokemonWithAbility,
    emptyLists,
    readPokemonWithAbilities,
    replaceBlock,
    updatePokemonWithAbility,
};
