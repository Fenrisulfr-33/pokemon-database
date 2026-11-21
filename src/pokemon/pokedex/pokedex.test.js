import readJsonDir from "#genericFunctions/files/readJsonDir.js";
import {
    LEARNSETS_ENTRIES_DIR,
    POKEDEX_ENTRIES_DIR,
} from "#helpers/paths.js";
import {
    findDexGamesWithoutEntry,
    findLearnsetGamesWithoutAcquisition,
} from "#pokedex/entryCoverage.mjs";
import {
    findBlankSpecies,
    findEmptyEggGroups,
    findEmptyEvs,
    findEmptyField,
    findGenderedNotSummingTo100,
    findGenderedWithNullRatio,
    findGenderlessWithRatio,
    findNameOriginBlankMeanings,
    findNullEggGroups,
} from "#helpers/testHelpers.js";

const pokedexEntries = readJsonDir(POKEDEX_ENTRIES_DIR);

describe("pokedex gender", () => {
    test("pokemon that aren't genderless have no null male or female", () => {
        expect(findGenderedWithNullRatio(pokedexEntries)).toEqual([]);
    });

    test("male and female add up to 100 when not genderless", () => {
        expect(findGenderedNotSummingTo100(pokedexEntries)).toEqual([]);
    });

    test("genderless pokemon have null male and female", () => {
        expect(findGenderlessWithRatio(pokedexEntries)).toEqual([]);
    });
});

// pokedex evs
	// Test that each pokemon has evs defined

	// test that evs keys are valid

	// test that evs values are between 1-3

// pokedex type 
	// Test that each pokemon has one or two types

	// Test that each pokemon has valid types (no null or undefined)

	// Test that each pokemon has valid type combinations (no duplicates, correct number of types)

// pokedex abilities
	// Test that each pokemon has abilities defined

	// Test that each pokemon has valid abilities (no null or undefined)

	// Test that each pokemon has the correct number of abilities (1-3)

describe("pokedex required data", () => {
    test("evs is not empty", () => {
        expect(findEmptyEvs(pokedexEntries)).toEqual([]);
    });

    test("eggGroups is not empty", () => {
        expect(findEmptyEggGroups(pokedexEntries)).toEqual([]);
    });

    test("eggGroups contains no null", () => {
        expect(findNullEggGroups(pokedexEntries)).toEqual([]);
    });

    test("species is not null or empty", () => {
        expect(findBlankSpecies(pokedexEntries)).toEqual([]);
    });

    test.each([
        "nameOrigin", "pokedexEntries", "growthRate",
        "catchRate", "baseFriendship", "eggCycles",
    ])("%s is not empty", (field) => {
        expect(findEmptyField(pokedexEntries, field)).toEqual([]);
    });

    test.skip("name.korean is not empty", () => {
        const names = pokedexEntries.map(({ _id, name }) => ({
            _id,
            korean: name.korean,
        }));
        expect(findEmptyField(names, "korean")).toEqual([]);
    });

    test("nameOrigin words all have a meaning", () => {
        expect(findNameOriginBlankMeanings(pokedexEntries)).toEqual([]);
    });
});

describe("pokedex entries by game", () => {
    test("pokemon in a game's dex have a pokedexEntry for it", () => {
        expect(findDexGamesWithoutEntry(pokedexEntries)).toEqual([]);
    });

    test("pokemon with a learnset for a game have an entry or acquisition",
        () => {
            const learnsets = readJsonDir(LEARNSETS_ENTRIES_DIR);
            expect(
                findLearnsetGamesWithoutAcquisition(pokedexEntries, learnsets)
            ).toEqual([]);
        });
});

// Test that the amount of files in the entries folder is equal to 1025
// TODO: remove forms from entries, we will make an upsert forms function
test('Pokedex Length', () => {
  expect(pokedexEntries.length).toBe(1025);
});

// TODO: Test the files match the schema, and that the files have the right keys
// test('Pokedex models have all keys', () => {
//   expect(pokedex).toHaveLength(1093);
// });

// TODO: Test that files match the _id key values inside the associated file

// TODO: Test for evolution keys match the evolution keys in the evolution file, 
// and that the evolution file has all the right keys

// TODO: Make a test to make sure every pokemon ability has the right key.