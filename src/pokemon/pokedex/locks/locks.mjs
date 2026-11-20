import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const LOCKS_DIR = path.dirname(fileURLToPath(import.meta.url));
const LOCKS_FILE = path.join(LOCKS_DIR, "locks.json");

function readLocks() {
    return JSON.parse(fs.readFileSync(LOCKS_FILE, "utf8"));
}

function snapshotPath(field) {
    return path.join(LOCKS_DIR, `${field}.json`);
}

function readSnapshot(field) {
    return JSON.parse(fs.readFileSync(snapshotPath(field), "utf8"));
}

function buildSnapshot(pokedexEntries, field) {
    const sortedEntries = [...pokedexEntries]
        .sort((first, second) => first._id - second._id);
    return Object.fromEntries(
        sortedEntries.map((pokemon) => [pokemon._id, pokemon[field]])
    );
}

function formatSnapshot(snapshot) {
    const lines = Object.entries(snapshot).map(([pokemonId, value]) =>
        `    ${JSON.stringify(pokemonId)}: ${JSON.stringify(value)}`);
    return `{\n${lines.join(",\n")}\n}\n`;
}

function writeSnapshot(pokedexEntries, field) {
    const snapshot = buildSnapshot(pokedexEntries, field);
    fs.writeFileSync(snapshotPath(field), formatSnapshot(snapshot));
    return Object.keys(snapshot).length;
}

function findChangedLockedValues(pokedexEntries, field, snapshot) {
    return pokedexEntries
        .filter((pokemon) => pokemon._id in snapshot)
        .filter((pokemon) => JSON.stringify(pokemon[field])
            !== JSON.stringify(snapshot[pokemon._id]))
        .map((pokemon) => `${pokemon._id} ${pokemon.key}`);
}

export {
    findChangedLockedValues,
    readLocks,
    readSnapshot,
    writeSnapshot,
};
