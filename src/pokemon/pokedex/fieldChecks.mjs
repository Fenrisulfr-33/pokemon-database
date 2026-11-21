import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const POKEDEX_DIR = path.dirname(fileURLToPath(import.meta.url));
const SCHEMA_PATH = path.join(POKEDEX_DIR, "schema.json");

const EV_STATS = ["hp", "atk", "def", "spatk", "spdef", "spd"];
const MIN_EV_YIELD = 1;
const MAX_EV_YIELD = 3;
const MIN_ABILITIES = 1;
const MAX_ABILITIES = 3;

function readValidTypes() {
    const schema = JSON.parse(fs.readFileSync(SCHEMA_PATH, "utf8"));
    return schema.definitions.type.enum;
}

const VALID_TYPES = readValidTypes();

function findInvalidEvKeys(entries) {
    return entries
        .map(({ _id, evs = {} }) => ({
            _id,
            keys: Object.keys(evs).filter((key) => !EV_STATS.includes(key)),
        }))
        .filter(({ keys }) => keys.length > 0);
}

function isValidEvYield(value) {
    return Number.isInteger(value)
        && value >= MIN_EV_YIELD
        && value <= MAX_EV_YIELD;
}

function findEvsOutOfRange(entries) {
    return entries
        .filter(({ evs = {} }) => !Object.values(evs).every(isValidEvYield))
        .map(({ _id, evs }) => ({ _id, evs }));
}

function findWrongTypeCount(entries) {
    return entries
        .filter(({ type }) => !Array.isArray(type)
            || type.length < 1
            || type.length > 2)
        .map(({ _id, type }) => ({ _id, type }));
}

function findInvalidTypes(entries) {
    return entries
        .filter(({ type = [] }) => !type.every(
            (typeName) => VALID_TYPES.includes(typeName)
        ))
        .map(({ _id, type }) => ({ _id, type }));
}

function findDuplicateTypes(entries) {
    return entries
        .filter(({ type = [] }) => new Set(type).size !== type.length)
        .map(({ _id, type }) => ({ _id, type }));
}

function findMissingAbilities(entries) {
    return entries
        .filter(({ abilities }) => !abilities
            || !Array.isArray(abilities.normal)
            || abilities.hidden === undefined)
        .map((entry) => entry._id);
}

function listAbilityIds(abilities) {
    const normalIds = abilities?.normal ?? [];
    const hiddenId = abilities?.hidden ?? null;
    return hiddenId === null ? normalIds : [...normalIds, hiddenId];
}

function findUnknownAbilities(entries, abilityEntries) {
    const knownIds = new Set(abilityEntries.map((ability) => ability._id));
    return entries
        .map(({ _id, abilities }) => ({
            _id,
            abilityIds: listAbilityIds(abilities)
                .filter((abilityId) => !knownIds.has(abilityId)),
        }))
        .filter(({ abilityIds }) => abilityIds.length > 0);
}

function findWrongAbilityCount(entries) {
    return entries
        .map(({ _id, abilities }) => ({
            _id,
            count: listAbilityIds(abilities).length,
        }))
        .filter(({ count }) => count < MIN_ABILITIES || count > MAX_ABILITIES);
}

export {
    findDuplicateTypes,
    findEvsOutOfRange,
    findInvalidEvKeys,
    findInvalidTypes,
    findMissingAbilities,
    findUnknownAbilities,
    findWrongAbilityCount,
    findWrongTypeCount,
};
