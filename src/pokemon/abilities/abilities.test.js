import fs from "fs";
import path from "path";
import readJsonDir from "#genericFunctions/files/readJsonDir.js";
import validateEntries from "#genericFunctions/schemaValidation.mjs";
import { getAbilities } from "#helpers/getAbilities.js";
import {
    ABILITIES_ENTRIES_DIR,
    POKEDEX_ENTRIES_DIR,
} from "#helpers/paths.js";
import { GAME_KEYS } from "../constants/GAME_KEYS.js";
import { buildPokemonWithAbility } from "./updatePokemonWithAbility.js";
import schema from "./schema.json" with { type: "json" };

const TEXT_BY_GAME_FIELDS = ["flavorText", "effectChanges"];

function listJsonFileNames(directory) {
    return fs
        .readdirSync(directory)
        .filter((fileName) => path.extname(fileName) === ".json");
}

function toKey(englishName) {
    return englishName
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, "")
        .trim()
        .replace(/ +/g, "-");
}

function findDuplicates(values) {
    const seen = new Set();
    const duplicates = [];
    for (const value of values) {
        if (seen.has(value)) duplicates.push(value);
        seen.add(value);
    }
    return duplicates;
}

function listGameKeys(ability) {
    const gameKeys = [];
    for (const field of TEXT_BY_GAME_FIELDS) {
        for (const textByGame of Object.values(ability[field] ?? {})) {
            gameKeys.push(...Object.keys(textByGame));
        }
    }
    return gameKeys;
}

function listAbilityIds(pokemon) {
    const { normal, hidden } = pokemon.abilities;
    return hidden === null ? normal : [...normal, hidden];
}

const abilities = getAbilities();
const pokedex = readJsonDir(POKEDEX_ENTRIES_DIR);

describe("abilities", () => {
    test("file names follow {_id}-{key}.json", () => {
        const fileNames = new Set(listJsonFileNames(ABILITIES_ENTRIES_DIR));
        const missing = [];
        for (const ability of abilities) {
            const expected = `${ability._id}-${ability.key}.json`;
            if (!fileNames.has(expected)) missing.push(expected);
        }
        expect(missing).toEqual([]);
    });

    test("every entry passes schema validation", () => {
        const failures = validateEntries(schema, abilities);
        expect(failures.map((failure) => failure.entry._id)).toEqual([]);
    });

	/**
	 * Exception for abilities 266, 267, "As One", this ability has the same
	 * name for two different forms.
	 */
    test("keys are the english name without special characters", () => {
		const exceptions = new Set([266, 267]);
        const mismatches = [];
        for (const ability of abilities) {
            const expected = toKey(ability.name.english);
            if (!exceptions.has(ability._id) && ability.key !== expected) {
                mismatches.push(`${ability._id}: ${ability.key} → ${expected}`);
            }
        }
        expect(mismatches).toEqual([]);
    });

    test("english names are unique", () => {
        const names = abilities.map((ability) => ability.name.english);
        expect(findDuplicates(names)).toEqual([]);
    });

    test("ids are unique", () => {
        const ids = abilities.map((ability) => ability._id);
        expect(findDuplicates(ids)).toEqual([]);
    });

    test("keys are unique", () => {
        const keys = abilities.map((ability) => ability.key);
        expect(findDuplicates(keys)).toEqual([]);
    });

    test("ids run from 1 to the highest id with no gaps", () => {
        const ids = new Set(abilities.map((ability) => ability._id));
        const highestId = Math.max(...ids);
        const missingIds = [];
        for (let abilityId = 1; abilityId <= highestId; abilityId++) {
            if (!ids.has(abilityId)) missingIds.push(abilityId);
        }
        expect(missingIds).toEqual([]);
    });

    test("game keys in text fields are known games", () => {
        const knownGameKeys = new Set(Object.values(GAME_KEYS));
        const unknownGameKeys = new Set();
        for (const ability of abilities) {
            for (const gameKey of listGameKeys(ability)) {
                if (!knownGameKeys.has(gameKey)) unknownGameKeys.add(gameKey);
            }
        }
        expect([...unknownGameKeys]).toEqual([]);
    });

    test("every pokedex ability id has an ability entry", () => {
        const knownIds = new Set(abilities.map((ability) => ability._id));
        const unknownIds = [];
        for (const pokemon of pokedex) {
            for (const abilityId of listAbilityIds(pokemon)) {
                if (!knownIds.has(abilityId)) {
                    unknownIds.push(`${pokemon._id}: ${abilityId}`);
                }
            }
        }
        expect(unknownIds).toEqual([]);
    });

    test("hidden ability is not also a normal ability", () => {
        const overlaps = [];
        for (const pokemon of pokedex) {
            const { normal, hidden } = pokemon.abilities;
            if (normal.includes(hidden)) overlaps.push(pokemon._id);
        }
        expect(overlaps).toEqual([]);
    });

    test("pokemonWithAbility matches pokedex/entries", () => {
        const expectedLists = buildPokemonWithAbility(pokedex);
        const mismatches = [];
        for (const ability of abilities) {
            const expected = expectedLists.get(ability._id)
                ?? { normal: [], hidden: [] };
            const actual = ability.pokemonWithAbility;
            if (JSON.stringify(actual) !== JSON.stringify(expected)) {
                mismatches.push(ability._id);
            }
        }
        expect(mismatches).toEqual([]);
    });
});
