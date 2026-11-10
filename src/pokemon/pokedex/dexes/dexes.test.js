/**
 * Verifies every dex in dexes_objects/ has the length recorded for it in
 * constants/DEX_LENGTHS.js.
 */

import dexMap from "./dexes_objects/00_dex_map.js";
import { DEX_LENGTHS_KEYS } from "../../constants/DEX_LENGTHS.js";

describe("Pokedex Length Validation", () => {
    test.each([...dexMap.keys()])(
        "%s has a DEX_LENGTHS_KEYS constant",
        (dexKey) => {
            expect(DEX_LENGTHS_KEYS).toHaveProperty(dexKey);
        },
    );

    test.each([...dexMap.entries()])(
        "%s matches its expected length",
        (dexKey, dexEntries) => {
            expect(dexEntries.length).toBe(DEX_LENGTHS_KEYS[dexKey]);
        },
    );
});
