import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";
import upsertEntries from "../helpers/upsertEntries.js";
import assignPokemonPokedexNumbers from "./AssignPokedexNumbers.js";
import schema from "./schema.json" with { type: "json" };
import readJsonDir from "#genericFunctions/files/readJsonDir.js";
import { POKEDEX_ENTRIES_DIR } from "../helpers/paths.js";

/**
 * Reads every pokemon JSON file in entries/ and parses it.
 * @returns {Array<Object>} pokemon documents
 */
async function run() {
	const pokemon = readJsonDir(POKEDEX_ENTRIES_DIR).map((mon) => {
		let updated = assignPokemonPokedexNumbers(mon);
		// moves (and gameDropDown, which was derived from them) now live in the
		// learnsets collection instead of on the pokemon document.
		// TODO: rebuild gameDropDown from pokedexNumber instead of moves.
		return updated;
	});

	await upsertEntries({
		environment: process.env.MONGO_ENV,
		dbName: `pokemon-${process.env.MONGO_ENV}`,
		collectionName: "national-dex",
		entries: pokemon,
		schema });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	run().catch((error) => {
		console.error(error);
		process.exit(1);
	});
}

export default run;
