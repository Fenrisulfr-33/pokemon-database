import readJsonDir from "#genericFunctions/files/readJsonDir.js";
import { POKEAPI_COSMETIC_FORMS_DIR } from "#helpers/paths.js";
import { toVisualDocument } from "./visualForms.js";

const COSMETIC_FOLDER = "cosmetic";

// Arceus's "???" form has a type the pokedex schema doesn't allow.
const SKIPPED_TYPES = new Set(["unknown"]);

function englishName(names) {
    const english = names.find((entry) => entry.language.name === "en");
    return english?.name ?? "";
}

function slugify(text) {
    return text.normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

function cosmeticKey(cosmeticForm) {
    const formWords = slugify(englishName(cosmeticForm.formNames))
        || cosmeticForm.formName;
    return `${formWords}-${cosmeticForm.species}`;
}

function byPokemonThenFormOrder(first, second) {
    return first.pokemonId - second.pokemonId
        || first.formOrder - second.formOrder;
}

function loadCosmeticForms() {
    return readJsonDir(POKEAPI_COSMETIC_FORMS_DIR)
        .filter((cosmeticForm) => !cosmeticForm.isDefault)
        .filter((cosmeticForm) =>
            !cosmeticForm.types.some((type) => SKIPPED_TYPES.has(type)))
        .sort(byPokemonThenFormOrder);
}

function buildCosmeticDocument(baseEntry, cosmeticForm, identity, existing) {
    const fullDocument = {
        ...baseEntry,
        _id: identity.id,
        key: identity.key,
        type: cosmeticForm.types,
        pokedexEntries: existing?.data.pokedexEntries ?? {},
    };
    return toVisualDocument(fullDocument, baseEntry);
}

function buildCosmeticForm(cosmeticForm, sources, formCounts) {
    const speciesId = cosmeticForm.pokemonId;
    const count = (formCounts.get(speciesId) ?? 0) + 1;
    formCounts.set(speciesId, count);
    const formNumber = String(count).padStart(2, "0");
    const key = cosmeticKey(cosmeticForm);
    const identity = { id: Number(`${speciesId}.${formNumber}`), key };
    const existing = sources.existingForms.find(
        (form) => form.data.key === key
    );
    const baseEntry = sources.baseById.get(speciesId);
    return {
        folder: COSMETIC_FOLDER,
        fileName: `${speciesId}.${formNumber}-${key}.json`,
        document: buildCosmeticDocument(
            baseEntry, cosmeticForm, identity, existing),
        hasEnglishName: true,
    };
}

function buildCosmeticForms(sources, formCounts) {
    return loadCosmeticForms().map((cosmeticForm) =>
        buildCosmeticForm(cosmeticForm, sources, formCounts));
}

export { buildCosmeticForms, englishName };
