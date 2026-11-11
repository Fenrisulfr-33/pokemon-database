import validateEntries from '../../genericFunctions/schemaValidation.mjs';
import schema from './schema.json' with { type: 'json' };
import readJsonDir from '../../genericFunctions/files/readJsonDir.js';
import { ABILITIES_ENTRIES_DIR } from '../helpers/paths.js';

const entries = readJsonDir(ABILITIES_ENTRIES_DIR);

validateEntries(schema, entries);
