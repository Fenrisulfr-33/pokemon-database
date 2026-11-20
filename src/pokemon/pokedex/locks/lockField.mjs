import readJsonDir from "#genericFunctions/files/readJsonDir.js";
import { POKEDEX_ENTRIES_DIR } from "#helpers/paths.js";
import { readLocks, writeSnapshot } from "#pokedex/locks/locks.mjs";

const field = process.argv[2];

if (!field || !(field in readLocks())) {
    console.error(`Usage: npm run pokedex:lock -- <field>`);
    console.error(`<field> must be a key in locks/locks.json.`);
    process.exit(1);
}

const pokedexEntries = readJsonDir(POKEDEX_ENTRIES_DIR);
const lockedCount = writeSnapshot(pokedexEntries, field);
console.log(`Locked ${field} for ${lockedCount} pokemon.`);
