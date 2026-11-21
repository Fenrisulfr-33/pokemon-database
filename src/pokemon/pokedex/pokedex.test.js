import readJsonDir from "#genericFunctions/files/readJsonDir.js";
import {
    ABILITIES_ENTRIES_DIR,
    EVOLUTIONS_ENTRIES_DIR,
    LEARNSETS_ENTRIES_DIR,
    POKEDEX_ENTRIES_DIR,
} from "#helpers/paths.js";
import {
    findDexGamesWithoutEntry,
    findLearnsetGamesWithoutAcquisition,
} from "#pokedex/entryCoverage.mjs";
import {
    findEvolutionsOutOfRange,
    findInvalidEvolutionValues,
    findMissingEvolutions,
    findPokemonMissingFromChain,
} from "#pokedex/evolutionChecks.mjs";
import {
    findDuplicateTypes,
    findEvsOutOfRange,
    findInvalidEvKeys,
    findInvalidTypes,
    findMissingAbilities,
    findUnknownAbilities,
    findWrongAbilityCount,
    findWrongTypeCount,
} from "#pokedex/fieldChecks.mjs";
import {
    findBlankSpecies,
    findEmptyEggGroups,
    findEmptyEvs,
    findEmptyField,
    findGenderedNotSummingTo100,
    findGenderedWithNullRatio,
    findGenderlessWithRatio,
    findMisnamedFiles,
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

describe("pokedex evs", () => {
    test("every pokemon has evs defined", () => {
        expect(findEmptyEvs(pokedexEntries)).toEqual([]);
    });

    test("evs keys are valid stat names", () => {
        expect(findInvalidEvKeys(pokedexEntries)).toEqual([]);
    });

    test("evs values are between 1 and 3", () => {
        expect(findEvsOutOfRange(pokedexEntries)).toEqual([]);
    });
});

describe("pokedex type", () => {
    test("every pokemon has one or two types", () => {
        expect(findWrongTypeCount(pokedexEntries)).toEqual([]);
    });

    test("every type is a valid type name", () => {
        expect(findInvalidTypes(pokedexEntries)).toEqual([]);
    });

    test("no pokemon lists the same type twice", () => {
        expect(findDuplicateTypes(pokedexEntries)).toEqual([]);
    });
});

describe("pokedex abilities", () => {
    test("every pokemon has normal and hidden abilities defined", () => {
        expect(findMissingAbilities(pokedexEntries)).toEqual([]);
    });

    test("every ability id exists in abilities entries", () => {
        const abilityEntries = readJsonDir(ABILITIES_ENTRIES_DIR);
        expect(
            findUnknownAbilities(pokedexEntries, abilityEntries)
        ).toEqual([]);
    });

    test("every pokemon has between 1 and 3 abilities", () => {
        expect(findWrongAbilityCount(pokedexEntries)).toEqual([]);
    });
});

describe("pokedex required data", () => {
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

test('Pokedex Length', () => {
  expect(pokedexEntries.length).toBe(1025);
});

test("file names follow {_id}-{key}.json", () => {
    const buildFileName = (entry) => `${entry._id}-${entry.key}.json`;
    expect(findMisnamedFiles(POKEDEX_ENTRIES_DIR, buildFileName)).toEqual([]);
});

describe("pokedex evolution", () => {
    const evolutionEntries = readJsonDir(EVOLUTIONS_ENTRIES_DIR);

    test("evolution is an integer or null", () => {
        expect(findInvalidEvolutionValues(pokedexEntries)).toEqual([]);
    });

    test("evolution is within the range of evolution ids", () => {
        expect(
            findEvolutionsOutOfRange(pokedexEntries, evolutionEntries)
        ).toEqual([]);
    });

    test("evolution points to an existing evolution chain", () => {
        expect(
            findMissingEvolutions(pokedexEntries, evolutionEntries)
        ).toEqual([]);
    });

    test("pokemon is in the evolution chain it points to", () => {
        expect(
            findPokemonMissingFromChain(pokedexEntries, evolutionEntries)
        ).toEqual([]);
    });
});