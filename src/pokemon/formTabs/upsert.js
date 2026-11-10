import { fileURLToPath } from "url";
import dotenv from "dotenv";
import upsertEntries from "../helpers/upsertEntries.js";
import readJsonDir from "#genericFunctions/files/readJsonDir.js";
import { FORM_TABS_ENTRIES_DIR } from "#helpers/paths.js";

dotenv.config();

/**
 * Reads every form tab JSON file in entries/ and parses it.
 * @returns {Array<Object>} form tab documents
 */
const loadFormTabs = () => readJsonDir(FORM_TABS_ENTRIES_DIR);

async function run() {
	const formTabs = loadFormTabs();
	console.log(`Loaded ${formTabs.length} form tabs from ${FORM_TABS_ENTRIES_DIR}`);
	await upsertEntries({ 
		environment: process.env.MONGO_ENV, 
		dbName: `pokemon-${process.env.MONGO_ENV}`, 
		collectionName: "form-tabs", 
		entries: formTabs });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	run().catch((error) => {
		console.error(error);
		process.exit(1);
	});
}

export default run;
