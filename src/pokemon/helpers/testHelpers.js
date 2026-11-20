import fs from "fs";
import path from "path";

function listJsonFileNames(directory) {
    return fs
        .readdirSync(directory)
        .filter((fileName) => path.extname(fileName) === ".json");
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

export {
    findBlankSpecies,
    findDuplicates,
    findEmptyEggGroups,
    findEmptyEvs,
    findGenderedNotSummingTo100,
    findGenderedWithNullRatio,
    findGenderlessWithRatio,
    findMissingIds,
    findNullEggGroups,
    listJsonFileNames,
    toKey,
};
