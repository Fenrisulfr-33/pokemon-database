import { fileURLToPath } from 'url';
import path from 'path';
import validateEntries from '../../genericFunctions/schemaValidation.mjs';
import schema from './schema.json' with { type: 'json' };
import readJsonDir from '../../genericFunctions/files/readJsonDir.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const entriesDir = path.join(__dirname, 'entries');

const entries = readJsonDir(entriesDir);

validateEntries(schema, entries);