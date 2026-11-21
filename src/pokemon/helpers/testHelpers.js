import fs from "fs";
import path from "path";

import readJsonDir from "#genericFunctions/files/readJsonDir.js";
import { FORMS_DIR, POKEDEX_ENTRIES_DIR } from "./paths.js";

/** Holds pokedexEntries waiting for a form file; ids repeat base ids. */
const FORMS_HOLDING_FOLDER = "needs-pokemon-file";

function listJsonFileNames(directory) {
    return fs
        .readdirSync(directory)
        .filter((fileName) => path.extname(fileName) === ".json");
}

function formatEntryId(entryId) {
    return Number.isInteger(entryId) ? String(entryId) : entryId.toFixed(2);
}

function readJsonFile(filePath) {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function findMisnamedFiles(directory, buildFileName) {
    return listJsonFileNames(directory)
        .map((fileName) => ({
            fileName,
            expected: buildFileName(
                readJsonFile(path.join(directory, fileName))
            ),
        }))
        .filter(({ fileName, expected }) => fileName !== expected);
}

function listFormFolders() {
    return fs.readdirSync(FORMS_DIR, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .filter((folder) => folder.name !== FORMS_HOLDING_FOLDER)
        .map((folder) => path.join(FORMS_DIR, folder.name));
}

function buildPokemonKeyById() {
    const pokemonAndForms = [
        ...readJsonDir(POKEDEX_ENTRIES_DIR),
        ...listFormFolders().flatMap(readJsonDir),
    ];
    return new Map(pokemonAndForms.map((entry) => [entry._id, entry.key]));
}

function toKey(englishName) {
    return englishName
        .toLowerCase()
        .replace(/,/g, " ")
        .replace(/[^a-z0-9 -]/g, "")
        .trim()
        .replace(/ +/g, "-");
}

function findDuplicates(values) {
    const seen = new Set();
    const duplicates = [];
    for (const value of values) {
        if (seen.has(value)) duplicates.push(value);
        seen.add(value);
    }
    return duplicates;
}

function findMissingIds(ids) {
    const idSet = new Set(ids);
    const highestId = Math.max(...idSet);
    const missingIds = [];
    for (let entryId = 1; entryId <= highestId; entryId++) {
        if (!idSet.has(entryId)) missingIds.push(entryId);
    }
    return missingIds;
}

function findGenderedWithNullRatio(entries) {
    return entries
        .filter(({ gender }) => !gender.genderless)
        .filter(({ gender }) => gender.male === null || gender.female === null)
        .map((entry) => entry._id);
}

function findGenderedNotSummingTo100(entries) {
    return entries
        .filter(({ gender }) => !gender.genderless)
        .filter(({ gender }) => gender.male + gender.female !== 100)
        .map((entry) => entry._id);
}

function findGenderlessWithRatio(entries) {
    return entries
        .filter(({ gender }) => gender.genderless)
        .filter(({ gender }) => gender.male !== null || gender.female !== null)
        .map((entry) => entry._id);
}

function findEmptyEvs(entries) {
    return entries
        .filter(({ evs }) => !evs || Object.keys(evs).length === 0)
        .map((entry) => entry._id);
}

function findEmptyEggGroups(entries) {
    return entries
        .filter(({ eggGroups }) => !eggGroups || eggGroups.length === 0)
        .map((entry) => entry._id);
}

function findNullEggGroups(entries) {
    return entries
        .filter(({ eggGroups }) => eggGroups?.includes(null))
        .map((entry) => entry._id);
}

function findBlankSpecies(entries) {
    return entries
        .filter(({ species }) => species === null || species === "")
        .map((entry) => entry._id);
}

function isEmpty(value) {
    if (value === null || value === undefined || value === "") return true;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === "object") return Object.keys(value).length === 0;
    return false;
}

function findEmptyField(entries, field) {
    return entries
        .filter((entry) => isEmpty(entry[field]))
        .map((entry) => entry._id);
}

function findNameOriginBlankMeanings(entries) {
    return entries
        .map(({ _id, nameOrigin = [] }) => ({
            _id,
            words: nameOrigin
                .filter(([, meaning]) => meaning === "")
                .map(([word]) => word),
        }))
        .filter(({ words }) => words.length > 0);
}

export {
    buildPokemonKeyById,
    findBlankSpecies,
    findEmptyField,
    findNameOriginBlankMeanings,
    findDuplicates,
    findEmptyEggGroups,
    findEmptyEvs,
    findGenderedNotSummingTo100,
    findGenderedWithNullRatio,
    findGenderlessWithRatio,
    findMisnamedFiles,
    findMissingIds,
    findNullEggGroups,
    formatEntryId,
    listFormFolders,
    listJsonFileNames,
    toKey,
};
