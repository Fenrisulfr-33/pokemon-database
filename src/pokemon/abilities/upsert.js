import { fileURLToPath } from "url";
import dotenv from "dotenv";
import upsertEntries from "../helpers/upsertEntries.js";
import schema from "./schema.json" with { type: "json" };
import { getAbilities } from "#helpers/getAbilities.js";
import { ABILITIES_ENTRIES_DIR } from "#helpers/paths.js";

dotenv.config();

/**
 * Reads every ability JSON file in entries/ and parses it.
 * @returns {Array<Object>} ability documents
 */
async function run() {
	const abilities = getAbilities();
	console.log(`Loaded ${abilities.length} abilities from ${ABILITIES_ENTRIES_DIR}`);
	await upsertEntries({
		environment: process.env.MONGO_ENV,
		dbName: `pokemon-${process.env.MONGO_ENV}`,
		collectionName: "abilities",
		entries: abilities,
		schema
	});
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	run().catch((error) => {
		console.error(error);
		process.exit(1);
	});
}

export default run;
