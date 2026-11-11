import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import readJsonDir from "#genericFunctions/files/readJsonDir.js";
import {
    ABILITIES_ENTRIES_DIR,
    POKEDEX_ENTRIES_DIR,
} from "#helpers/paths.js";

const BLOCK_KEY = '"pokemonWithAbility":';

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

function formatBlock(lists, indent, newline) {
    const innerIndent = indent + indent;
    return [
        "{",
        `${innerIndent}"normal": [${lists.normal.join(", ")}],`,
        `${innerIndent}"hidden": [${lists.hidden.join(", ")}]`,
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

function updateAbilityFile(filePath, listsByAbility) {
    const text = fs.readFileSync(filePath, "utf8");
    const ability = JSON.parse(text);
    const lists = listsByAbility.get(ability._id) ?? emptyLists();
    const updatedText = replaceBlock(text, lists);
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
    const listsByAbility = buildPokemonWithAbility(
        readJsonDir(POKEDEX_ENTRIES_DIR)
    );
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

export { buildPokemonWithAbility, updatePokemonWithAbility };
