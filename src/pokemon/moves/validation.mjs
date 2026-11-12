import validateEntries from "#genericFunctions/schemaValidation.mjs";
import { getMoves } from "#helpers/getMoves.js";
import schema from "./schema.json" with { type: "json" };

const failures = validateEntries(schema, getMoves());
if (failures.length > 0) process.exitCode = 1;
