const REGION_ALIASES = {
    alolan: "alola",
    galarian: "galar",
    hisuian: "hisui",
    paldean: "paldea",
};

const IGNORED_NAME_WORDS = new Set(["form", "color"]);

// Pokedex form entries whose key doesn't name the PokeAPI form, by _id.
const POKEDEX_FORM_OVERRIDES = {
    "19.1": 10091, "20.1": 10092, "128.1": 10250, "128.2": 10251,
    "128.3": 10252, "194.1": 10253, "555.1": 10017, "555.2": 10177,
    "555.3": 10178, "901.1": 10272, "916.1": 10254, "925.1": 10257,
    "931.1": 10260, "931.2": 10261, "931.3": 10262, "964.1": 10256,
    "978.1": 10258, "978.2": 10259, "982.1": 10255, "999.1": 10263,
    "1017.1": 10273, "1017.2": 10274, "1017.3": 10275,
};

function nameTokens(name) {
    return name.split("-")
        .filter((word) => !IGNORED_NAME_WORDS.has(word))
        .map((word) => REGION_ALIASES[word] ?? word)
        .sort()
        .join("-");
}

function findPokeApiFormName(dexForm, pokeApiForms) {
    const overrideId = POKEDEX_FORM_OVERRIDES[String(dexForm._id)];
    const tokens = nameTokens(dexForm.key);
    const match = overrideId
        ? pokeApiForms.find((form) => form.id === overrideId)
        : pokeApiForms.find((form) => nameTokens(form.name) === tokens);
    if (!match) {
        throw new Error(`No PokeAPI form for pokedex entry ${dexForm._id}`);
    }
    return match.name;
}

function findExistingForm(pokeApiName, existingForms) {
    const tokens = nameTokens(pokeApiName);
    return existingForms.find((form) => form.tokens === tokens);
}

export { findExistingForm, findPokeApiFormName, nameTokens };
