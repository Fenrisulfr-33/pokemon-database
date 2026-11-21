/**
 * A stage is `[pokemonId]` or `[pokemonId, how]`; chains and branches are
 * arrays of stages, chains or branches (see README.md).
 */
function isStage(node) {
    return Array.isArray(node) && typeof node[0] === "number";
}

/**
 * Lists every pokemon id in an evolution entry's `evolution` field, in
 * the order they appear.
 * @param {Array} evolution - the entry's `evolution` array
 * @returns {Array<number>} pokemon and form ids
 */
function listChainPokemonIds(evolution) {
    if (isStage(evolution)) return [evolution[0]];
    if (!Array.isArray(evolution)) return [];
    return evolution.flatMap(listChainPokemonIds);
}

export { listChainPokemonIds };
