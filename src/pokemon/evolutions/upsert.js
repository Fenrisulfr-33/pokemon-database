import { fileURLToPath } from "url";
import dotenv from "dotenv";
import upsertEntries from "../helpers/upsertEntries.js";
import schema from "./schema.json" with { type: "json" };
import readJsonDir from "#genericFunctions/files/readJsonDir.js";
import { EVOLUTIONS_ENTRIES_DIR } from "#helpers/paths.js";

dotenv.config();

/**
 * Reads every evolution JSON file in entries/ and parses it.
 * @returns {Array<Object>} evolution documents
 */
async function run() {
	const entries = readJsonDir(EVOLUTIONS_ENTRIES_DIR);
	console.log(`Loaded ${entries.length} entries from ${EVOLUTIONS_ENTRIES_DIR}`);
	await upsertEntries({ 
		environment: process.env.MONGO_ENV,
		dbName: `pokemon-${process.env.MONGO_ENV}`,
		collectionName: "evolutions",
		entries: entries,
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
