import readJsonDir from "#genericFunctions/files/readJsonDir.js";
import validateEntries from "#genericFunctions/schemaValidation.mjs";
import { GROWTH_RATE_ENTRIES_DIR } from "#helpers/paths.js";
import {
    findDuplicates,
    findMissingIds,
    listJsonFileNames,
    toKey,
} from "#helpers/testHelpers.js";
import {
    buildPokemonByGrowthRate,
    readPokemonWithGrowthRates,
} from "./updatePokemonWithGrowthRate.js";
import schema from "./schema.json" with { type: "json" };

const CONTROL_CHARACTERS = /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/;

const growthRates = readJsonDir(GROWTH_RATE_ENTRIES_DIR);
const pokemonWithGrowthRates = readPokemonWithGrowthRates();

function findGrowthRates(isBroken) {
    return growthRates
        .filter(isBroken)
        .map((growthRate) => `${growthRate._id}-${growthRate.key}`);
}

function levelsAreInOrder(growthRate) {
    return growthRate.levels.every(({ level }, index) => level === index + 1);
}

function experienceAlwaysRises(growthRate) {
    return growthRate.levels.every(({ experience }, index) =>
        index === 0 || experience > growthRate.levels[index - 1].experience
    );
}

describe("growth-rate", () => {
    test("file names follow {_id}-{key}.json, with no extra files", () => {
        const expected = growthRates.map(
            (growthRate) => `${growthRate._id}-${growthRate.key}.json`
        );
        const actual = listJsonFileNames(GROWTH_RATE_ENTRIES_DIR);
        expect(actual.sort()).toEqual(expected.sort());
    });

    test("every entry passes schema validation", () => {
        const failures = validateEntries(schema, growthRates);
        expect(failures.map((failure) => failure.entry._id)).toEqual([]);
    });

    test("ids are unique", () => {
        const ids = growthRates.map((growthRate) => growthRate._id);
        expect(findDuplicates(ids)).toEqual([]);
    });

    test("ids run from 1 to the highest id with no gaps", () => {
        const ids = growthRates.map((growthRate) => growthRate._id);
        expect(findMissingIds(ids)).toEqual([]);
    });

    test("keys are the english name without special characters", () => {
        const broken = findGrowthRates(
            (growthRate) => growthRate.key !== toKey(growthRate.name.english)
        );
        expect(broken).toEqual([]);
    });

    test("formulas have no control characters from bad escapes", () => {
        const broken = findGrowthRates(
            (growthRate) => CONTROL_CHARACTERS.test(growthRate.formula)
        );
        expect(broken).toEqual([]);
    });

    test("levels run from 1 to 100 in order", () => {
        expect(findGrowthRates((rate) => !levelsAreInOrder(rate))).toEqual([]);
    });

    test("level 1 needs 0 experience", () => {
        const broken = findGrowthRates(
            (growthRate) => growthRate.levels[0].experience !== 0
        );
        expect(broken).toEqual([]);
    });

    test("experience rises with every level", () => {
        const broken = findGrowthRates((rate) => !experienceAlwaysRises(rate));
        expect(broken).toEqual([]);
    });

    test("every pokemon growthRate has a growth-rate entry", () => {
        const ids = new Set(growthRates.map((growthRate) => growthRate._id));
        const unknown = pokemonWithGrowthRates
            .filter((pokemon) => !ids.has(pokemon.growthRate))
            .map((pokemon) => pokemon._id);
        expect(unknown).toEqual([]);
    });

    test("pokemon lists match the pokedex and forms, lowest id first", () => {
        const expected = buildPokemonByGrowthRate(pokemonWithGrowthRates);
        const broken = findGrowthRates((growthRate) =>
            growthRate.pokemon.join() !==
                (expected.get(growthRate._id) ?? []).join()
        );
        expect(broken).toEqual([]);
    });
});
