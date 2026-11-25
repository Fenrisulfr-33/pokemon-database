import path from "path";

import { POKEDEX_ENTRIES_DIR } from "#helpers/paths.js";
import { applyPokedexEntryDifference } from "./applyPokedexEntryDifference.js";
import { findPokedexEntryDifferences } from "./findPokedexEntryDifferences.js";

/** Bulbapedia check for `pokedexEntries` in `src/pokemon/pokedex`. */
export const pokedexEntriesField = Object.freeze({
    fieldName: "pokedexEntries",
    entriesDir: POKEDEX_ENTRIES_DIR,
    reportPath: path.join(POKEDEX_ENTRIES_DIR, "..", "differences.md"),
    locksPath: path.join(POKEDEX_ENTRIES_DIR, "..", "locks", "locks.json"),
    validateCommand: "npm run pokedex:validate",
    kindDescriptions: Object.freeze({
        wording: "Bulbapedia's text has different words; accepting"
            + " writes it in our casing and apostrophe style.",
        punctuation: "Only spacing, hyphens, dashes or quotes differ.",
        missing: "Bulbapedia has an entry for this game and we don't;"
            + " accepting adds it.",
        extra: "We have an entry Bulbapedia doesn't list for the base"
            + " form (often a form's entry); accepting removes it.",
        form: "Our text is Bulbapedia's entry for another form (see"
            + " the note). Usually Bulbapedia lists a different default"
            + " form first; reject if ours is the right form.",
        split: "Our combined key covers games whose Bulbapedia texts"
            + " differ; split the key by hand.",
    }),
    findDifferences: findPokedexEntryDifferences,
    applyDifference: applyPokedexEntryDifference,
});
