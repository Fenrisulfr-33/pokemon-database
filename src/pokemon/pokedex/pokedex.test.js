import readJsonDir from "#genericFunctions/files/readJsonDir.js";
import { POKEDEX_ENTRIES_DIR } from "#helpers/paths.js";
import {
    findGenderedNotSummingTo100,
    findGenderedWithNullRatio,
    findGenderlessWithRatio,
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