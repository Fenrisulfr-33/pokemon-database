import { pokedexEntriesField } from "./pokedexEntries/pokedexEntriesField.js";

/**
 * Every field the Bulbapedia check supports, by field name. Each field
 * provides: fieldName, entriesDir, reportPath, locksPath (optional),
 * validateCommand, kindDescriptions,
 * findDifferences(record, fileName, wikitext) and
 * applyDifference(fileText, difference).
 */
export const BULBAPEDIA_FIELDS = Object.freeze({
    [pokedexEntriesField.fieldName]: pokedexEntriesField,
});

export function findBulbapediaField(fieldName) {
    const field = BULBAPEDIA_FIELDS[fieldName];
    if (!field) {
        const supported = Object.keys(BULBAPEDIA_FIELDS).join(", ");
        throw new Error(
            `Unknown field "${fieldName}". Supported: ${supported}`);
    }
    return field;
}
