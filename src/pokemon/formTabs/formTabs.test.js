import fs from "fs";
import path from "path";

import readJsonDir from "#genericFunctions/files/readJsonDir.js";
import validateEntries from "#genericFunctions/schemaValidation.mjs";
import {
    FORM_TABS_ENTRIES_DIR,
    FORMS_DIR,
    POKEDEX_ENTRIES_DIR,
} from "#helpers/paths.js";
import { findDuplicates, listJsonFileNames } from "#helpers/testHelpers.js";
import schema from "./schema.json" with { type: "json" };

function readFormEntries() {
    return fs.readdirSync(FORMS_DIR, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .flatMap((folder) => readJsonDir(path.join(FORMS_DIR, folder.name)));
}

const formTabs = readJsonDir(FORM_TABS_ENTRIES_DIR);
const pokedex = readJsonDir(POKEDEX_ENTRIES_DIR);
const pokedexKeys = new Map(pokedex.map((pokemon) => [pokemon._id, pokemon.key]));
const knownIds = new Set(
    [...pokedex, ...readFormEntries()].map((pokemon) => pokemon._id)
);

function listTabIds(formTab) {
    return formTab.tab.map((tab) => tab.id);
}

function findFormTabs(isBroken) {
    return formTabs
        .filter(isBroken)
        .map((formTab) => `${formTab._id}-${formTab.key}`);
}

describe("form-tabs", () => {
    test("file names follow {_id}-{key}.json, with no extra files", () => {
        const expected = formTabs.map(
            (formTab) => `${formTab._id}-${formTab.key}.json`
        );
        const actual = listJsonFileNames(FORM_TABS_ENTRIES_DIR);
        expect(actual.sort()).toEqual(expected.sort());
    });

    test("every entry passes schema validation", () => {
        const failures = validateEntries(schema, formTabs);
        expect(failures.map((failure) => failure.entry._id)).toEqual([]);
    });

    test("ids are unique", () => {
        const ids = formTabs.map((formTab) => formTab._id);
        expect(findDuplicates(ids)).toEqual([]);
    });

    test("_id is the first pokemonId", () => {
        const broken = findFormTabs(
            (formTab) => formTab._id !== formTab.pokemonIds[0]
        );
        expect(broken).toEqual([]);
    });

    test("tab ids match pokemonIds in order", () => {
        const broken = findFormTabs(
            (formTab) => listTabIds(formTab).join() !== formTab.pokemonIds.join()
        );
        expect(broken).toEqual([]);
    });

    test("tab ids are unique within an entry", () => {
        const broken = findFormTabs(
            (formTab) => findDuplicates(listTabIds(formTab)).length > 0
        );
        expect(broken).toEqual([]);
    });

    test("every tab id is the base pokemon or one of its forms", () => {
        const broken = findFormTabs((formTab) =>
            listTabIds(formTab).some((id) => Math.floor(id) !== formTab._id)
        );
        expect(broken).toEqual([]);
    });

    test("every tab id has a national-dex or forms entry", () => {
        const broken = findFormTabs((formTab) =>
            listTabIds(formTab).some((id) => !knownIds.has(id))
        );
        expect(broken).toEqual([]);
    });

    test("key matches the national-dex key", () => {
        const broken = findFormTabs(
            (formTab) => formTab.key !== pokedexKeys.get(formTab._id)
        );
        expect(broken).toEqual([]);
    });
});
