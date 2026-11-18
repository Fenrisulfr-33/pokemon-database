import { fileURLToPath } from "url";
import dotenv from "dotenv";
import upsertEntries from "../helpers/upsertEntries.js";
import schema from "./schema.json" with { type: "json" };
import readJsonDir from "#genericFunctions/files/readJsonDir.js";
import { GROWTH_RATE_ENTRIES_DIR } from "#helpers/paths.js";

dotenv.config();

async function run() {
	const growthRates = readJsonDir(GROWTH_RATE_ENTRIES_DIR);
	console.log(
		`Loaded ${growthRates.length} growth rates from ${GROWTH_RATE_ENTRIES_DIR}`
	);
	await upsertEntries({
		environment: process.env.MONGO_ENV,
		dbName: `pokemon-${process.env.MONGO_ENV}`,
		collectionName: "growth-rates",
		entries: growthRates,
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
