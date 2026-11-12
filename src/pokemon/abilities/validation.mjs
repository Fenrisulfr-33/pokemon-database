import validateEntries from '../../genericFunctions/schemaValidation.mjs';
import schema from './schema.json' with { type: 'json' };
import { getAbilities } from '../helpers/getAbilities.js';

validateEntries(schema, getAbilities());
