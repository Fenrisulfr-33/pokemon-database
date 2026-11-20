import readJsonDir from "#genericFunctions/files/readJsonDir.js";
import { POKEDEX_ENTRIES_DIR } from "#helpers/paths.js";
import {
    findChangedLockedValues,
    readLocks,
    readSnapshot,
} from "#pokedex/locks/locks.mjs";

const pokedexEntries = readJsonDir(POKEDEX_ENTRIES_DIR);

describe("findChangedLockedValues", () => {
    const snapshot = { 1: [["bulb", "a type of plant"]] };

    test("reports a locked pokemon whose value changed", () => {
        const changed = [{ _id: 1, key: "bulbasaur", nameOrigin: [] }];
        expect(findChangedLockedValues(changed, "nameOrigin", snapshot))
            .toEqual(["1 bulbasaur"]);
    });

    test("ignores pokemon added after the lock", () => {
        const added = [{ _id: 2, key: "ivysaur", nameOrigin: [] }];
        expect(findChangedLockedValues(added, "nameOrigin", snapshot))
            .toEqual([]);
    });
});

describe("locked pokedex fields", () => {
    test.each(Object.keys(readLocks()))(
        "%s matches its locked snapshot",
        (field) => {
            const snapshot = readSnapshot(field);
            expect(findChangedLockedValues(pokedexEntries, field, snapshot))
                .toEqual([]);
        }
    );
});
