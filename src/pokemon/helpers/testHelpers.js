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

export {
    findDuplicates,
    findGenderedNotSummingTo100,
    findGenderedWithNullRatio,
    findGenderlessWithRatio,
    findMissingIds,
    listJsonFileNames,
    toKey,
};
