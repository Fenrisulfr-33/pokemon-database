import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import readJsonDir from "#genericFunctions/files/readJsonDir.js";
import {
    FORMS_DIR,
    GROWTH_RATE_ENTRIES_DIR,
    POKEDEX_ENTRIES_DIR,
} from "#helpers/paths.js";

const POKEMON_BLOCK = /"pokemon": \[[^\]]*\]/;

function readFormsWithGrowthRates() {
    return fs.readdirSync(FORMS_DIR, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .flatMap((folder) => readJsonDir(path.join(FORMS_DIR, folder.name)))
        .filter((form) => form.growthRate !== undefined);
}

function readPokemonWithGrowthRates() {
    return [...readJsonDir(POKEDEX_ENTRIES_DIR), ...readFormsWithGrowthRates()];
}

function buildPokemonByGrowthRate(pokedex) {
    const idsByGrowthRate = new Map();
    for (const pokemon of pokedex) {
        if (!idsByGrowthRate.has(pokemon.growthRate)) {
            idsByGrowthRate.set(pokemon.growthRate, []);
        }
        idsByGrowthRate.get(pokemon.growthRate).push(pokemon._id);
    }
    for (const ids of idsByGrowthRate.values()) {
        ids.sort((first, second) => first - second);
    }
    return idsByGrowthRate;
}

function formatIdList(ids, indent, newline) {
    if (ids.length === 0) return "[]";
    const items = ids.map((id) => `${indent}${indent}${id}`);
    return `[${newline}${items.join(`,${newline}`)}${newline}${indent}]`;
}

function replacePokemonBlock(text, ids) {
    if (!POKEMON_BLOCK.test(text)) throw new Error("No pokemon array");
    const newline = text.includes("\r\n") ? "\r\n" : "\n";
    const indent = text.match(/^([ \t]+)"key"/m)[1];
    const block = `"pokemon": ${formatIdList(ids, indent, newline)}`;
    return text
        .replace(/^[ \t]+"pokemon":/m, `${indent}"pokemon":`)
        .replace(POKEMON_BLOCK, block);
}

function updateGrowthRateFile(filePath, idsByGrowthRate) {
    const text = fs.readFileSync(filePath, "utf8");
    const growthRate = JSON.parse(text);
    const ids = idsByGrowthRate.get(growthRate._id) ?? [];
    const updatedText = replacePokemonBlock(text, ids);
    if (updatedText === text) return false;
    fs.writeFileSync(filePath, updatedText);
    return true;
}

function growthRateFilePaths() {
    return fs.readdirSync(GROWTH_RATE_ENTRIES_DIR)
        .filter((fileName) => path.extname(fileName) === ".json")
        .map((fileName) => path.join(GROWTH_RATE_ENTRIES_DIR, fileName));
}

function updatePokemonWithGrowthRate() {
    const idsByGrowthRate = buildPokemonByGrowthRate(
        readPokemonWithGrowthRates()
    );
    const filePaths = growthRateFilePaths();
    const changedCount = filePaths.filter(
        (filePath) => updateGrowthRateFile(filePath, idsByGrowthRate)
    ).length;
    console.log(
        `Updated ${changedCount} of ${filePaths.length} growth rate files`
    );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    updatePokemonWithGrowthRate();
}

export {
    buildPokemonByGrowthRate,
    readPokemonWithGrowthRates,
    replacePokemonBlock,
    updatePokemonWithGrowthRate,
};
