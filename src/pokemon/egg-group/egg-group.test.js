import fs from "fs";
import path from "path";

import readJsonDir from "#genericFunctions/files/readJsonDir.js";
import validateEntries from "#genericFunctions/schemaValidation.mjs";
import {
    EGG_GROUP_ENTRIES_DIR,
    FORMS_DIR,
    POKEDEX_ENTRIES_DIR,
} from "#helpers/paths.js";
import {
    findDuplicates,
    findMissingIds,
    listJsonFileNames,
    toKey,
} from "#helpers/testHelpers.js";
import schema from "./schema.json" with { type: "json" };

const eggGroups = readJsonDir(EGG_GROUP_ENTRIES_DIR);
const pokedex = readJsonDir(POKEDEX_ENTRIES_DIR);

function readForms() {
    return fs.readdirSync(FORMS_DIR, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .flatMap((folder) => readJsonDir(path.join(FORMS_DIR, folder.name)));
}

function findPokemonWithUnknownEggGroups(pokemonList) {
    const ids = new Set(eggGroups.map((eggGroup) => eggGroup._id));
    return pokemonList
        .filter(({ eggGroups: groupIds }) => groupIds !== undefined)
        .filter(({ eggGroups: groupIds }) => groupIds.some(
            (groupId) => groupId !== null && !ids.has(groupId)
        ))
        .map((pokemon) => pokemon._id);
}

describe("egg-group", () => {
    test("file names follow {_id}-{key}.json, with no extra files", () => {
        const expected = eggGroups.map(
            (eggGroup) => `${eggGroup._id}-${eggGroup.key}.json`
        );
        const actual = listJsonFileNames(EGG_GROUP_ENTRIES_DIR);
        expect(actual.sort()).toEqual(expected.sort());
    });

    test("every entry passes schema validation", () => {
        const failures = validateEntries(schema, eggGroups);
        expect(failures.map((failure) => failure.entry._id)).toEqual([]);
    });

    test("ids are unique", () => {
        const ids = eggGroups.map((eggGroup) => eggGroup._id);
        expect(findDuplicates(ids)).toEqual([]);
    });

    test("ids run from 1 to the highest id with no gaps", () => {
        const ids = eggGroups.map((eggGroup) => eggGroup._id);
        expect(findMissingIds(ids)).toEqual([]);
    });

    test("keys are the english name without special characters", () => {
        const broken = eggGroups
            .filter((eggGroup) => eggGroup.key !== toKey(eggGroup.name.english))
            .map((eggGroup) => eggGroup._id);
        expect(broken).toEqual([]);
    });

    test("pokemon lists are sorted lowest id first", () => {
        const broken = eggGroups
            .filter((eggGroup) => eggGroup.pokemon.some(
                (pokemonId, index) =>
                    index > 0 && pokemonId < eggGroup.pokemon[index - 1]
            ))
            .map((eggGroup) => eggGroup._id);
        expect(broken).toEqual([]);
    });

    test("every pokemon id is in the pokedex", () => {
        const pokedexIds = new Set(pokedex.map((pokemon) => pokemon._id));
        const unknown = eggGroups
            .flatMap((eggGroup) => eggGroup.pokemon)
            .filter((pokemonId) => !pokedexIds.has(pokemonId));
        expect(unknown).toEqual([]);
    });

    test("every pokedex and form eggGroups id has an entry", () => {
        const pokemonList = [...pokedex, ...readForms()];
        expect(findPokemonWithUnknownEggGroups(pokemonList)).toEqual([]);
    });
});
