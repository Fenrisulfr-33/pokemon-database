import { LEARNSETS_ENTRIES_DIR } from "#helpers/paths.js";
import {
    buildPokemonKeyById,
    findMisnamedFiles,
    formatEntryId,
} from "#helpers/testHelpers.js";

const pokemonKeyById = buildPokemonKeyById();

function buildFileName(learnset) {
    const pokemonKey = pokemonKeyById.get(learnset._id);
    return `${formatEntryId(learnset._id)}-${pokemonKey}.json`;
}

describe("learnsets files", () => {
    test("file names follow {_id}-{pokemon key}.json", () => {
        expect(
            findMisnamedFiles(LEARNSETS_ENTRIES_DIR, buildFileName)
        ).toEqual([]);
    });
});
