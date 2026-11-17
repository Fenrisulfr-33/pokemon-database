import validateEntries from "#genericFunctions/schemaValidation.mjs";
import readJsonDir from "#genericFunctions/files/readJsonDir.js";
import { LEARNSETS_ENTRIES_DIR } from "#helpers/paths.js";
import schema from "./schema.json" with { type: "json" };

const learnsets = readJsonDir(LEARNSETS_ENTRIES_DIR);
const failures = validateEntries(schema, learnsets);
if (failures.length > 0) process.exitCode = 1;
