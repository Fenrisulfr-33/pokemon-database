import validateEntries from "#genericFunctions/schemaValidation.mjs";
import readJsonDir from "#genericFunctions/files/readJsonDir.js";
import { EGG_GROUP_ENTRIES_DIR } from "#helpers/paths.js";
import schema from "./schema.json" with { type: "json" };

const eggGroups = readJsonDir(EGG_GROUP_ENTRIES_DIR);
const failures = validateEntries(schema, eggGroups);
if (failures.length > 0) process.exitCode = 1;
