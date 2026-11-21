import { listChainPokemonIds } from "#evolutions/chainPokemonIds.mjs";

function hasChain(entry) {
    return entry.evolution !== null;
}

function findInvalidEvolutionValues(entries) {
    return entries
        .filter(({ evolution }) => evolution !== null
            && !Number.isInteger(evolution))
        .map(({ _id, evolution }) => ({ _id, evolution }));
}

function findEvolutionsOutOfRange(entries, evolutionEntries) {
    const evolutionIds = evolutionEntries.map((chain) => chain._id);
    const lowestId = Math.min(...evolutionIds);
    const highestId = Math.max(...evolutionIds);
    return entries
        .filter(hasChain)
        .filter(({ evolution }) => evolution < lowestId
            || evolution > highestId)
        .map(({ _id, evolution }) => ({ _id, evolution }));
}

function findMissingEvolutions(entries, evolutionEntries) {
    const evolutionIds = new Set(
        evolutionEntries.map((chain) => chain._id)
    );
    return entries
        .filter(hasChain)
        .filter(({ evolution }) => !evolutionIds.has(evolution))
        .map(({ _id, evolution }) => ({ _id, evolution }));
}

function findPokemonMissingFromChain(entries, evolutionEntries) {
    const pokemonIdsByChain = new Map(evolutionEntries.map((chain) => [
        chain._id,
        new Set(listChainPokemonIds(chain.evolution)),
    ]));
    return entries
        .filter(hasChain)
        .filter(({ _id, evolution }) => pokemonIdsByChain.has(evolution)
            && !pokemonIdsByChain.get(evolution).has(_id))
        .map(({ _id, evolution }) => ({ _id, evolution }));
}

export {
    findEvolutionsOutOfRange,
    findInvalidEvolutionValues,
    findMissingEvolutions,
    findPokemonMissingFromChain,
};
