import { listChainPokemonIds } from "#evolutions/chainPokemonIds.mjs";
import { EVOLUTIONS_ENTRIES_DIR } from "#helpers/paths.js";
import {
    buildPokemonKeyById,
    findMisnamedFiles,
} from "#helpers/testHelpers.js";

const ID_DIGITS = 3;
const pokemonKeyById = buildPokemonKeyById();

/** Named after the first pokemon in the chain, e.g. 001-bulbasaur.json. */
function buildFileName(chain) {
    const [firstPokemonId] = listChainPokemonIds(chain.evolution);
    const paddedId = String(chain._id).padStart(ID_DIGITS, "0");
    return `${paddedId}-${pokemonKeyById.get(firstPokemonId)}.json`;
}

describe("evolutions files", () => {
    test("file names follow {padded _id}-{first pokemon key}.json", () => {
        expect(
            findMisnamedFiles(EVOLUTIONS_ENTRIES_DIR, buildFileName)
        ).toEqual([]);
    });
});
