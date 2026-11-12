import { isDeepStrictEqual } from "util";

import { orderFields } from "./formFields.js";

const BATTLE_FIELDS = ["type", "abilities", "baseStats", "evs"];
const ALWAYS_KEPT = new Set(["_id", "key", "pokedexEntries"]);

function hasBaseBattleFields(document, baseEntry) {
    return BATTLE_FIELDS.every((field) =>
        isDeepStrictEqual(document[field], baseEntry[field]));
}

function toVisualDocument(document, baseEntry) {
    const differences = Object.entries(document).filter(([field, value]) =>
        ALWAYS_KEPT.has(field) || !isDeepStrictEqual(value, baseEntry[field]));
    return orderFields({ ...Object.fromEntries(differences), visual: true });
}

export { hasBaseBattleFields, toVisualDocument };
