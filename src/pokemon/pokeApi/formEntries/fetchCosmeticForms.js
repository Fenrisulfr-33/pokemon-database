import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import {
    POKEAPI_COSMETIC_FORMS_DIR,
    POKEAPI_FORMS_DIR,
    POKEAPI_POKEMON_DIR,
} from "#helpers/paths.js";
import { fetchData } from "../apiRequest.mjs";

function listPokemonIds() {
    return [POKEAPI_POKEMON_DIR, POKEAPI_FORMS_DIR]
        .flatMap((directory) => fs.readdirSync(directory))
        .filter((file) => file.endsWith(".json"))
        .map((file) => Number(file.split("-")[0]))
        .sort((first, second) => first - second);
}

function toCosmeticForm(pokemon, pokemonForm) {
    return {
        id: pokemonForm.id,
        name: pokemonForm.name,
        pokemonId: pokemon.id,
        pokemonName: pokemon.name,
        species: pokemon.species.name,
        isDefault: pokemonForm.is_default,
        formName: pokemonForm.form_name,
        formOrder: pokemonForm.form_order,
        types: pokemonForm.types.map((entry) => entry.type.name),
        versionGroup: pokemonForm.version_group.name,
        names: pokemonForm.names,
        formNames: pokemonForm.form_names,
    };
}

function saveCosmeticForm(cosmeticForm) {
    const fileName = `${cosmeticForm.id}-${cosmeticForm.name}.json`;
    const target = path.join(POKEAPI_COSMETIC_FORMS_DIR, fileName);
    fs.writeFileSync(target, `${JSON.stringify(cosmeticForm, null, 4)}\n`);
}

async function fetchFormsOf(pokemonId) {
    const pokemon = await fetchData(`pokemon/${pokemonId}`);
    if (pokemon.forms.length < 2) return 0;
    for (const form of pokemon.forms) {
        const pokemonForm = await fetchData(`pokemon-form/${form.name}`);
        saveCosmeticForm(toCosmeticForm(pokemon, pokemonForm));
    }
    return pokemon.forms.length;
}

async function fetchCosmeticForms() {
    fs.rmSync(POKEAPI_COSMETIC_FORMS_DIR, { recursive: true, force: true });
    fs.mkdirSync(POKEAPI_COSMETIC_FORMS_DIR, { recursive: true });
    let savedCount = 0;
    for (const pokemonId of listPokemonIds()) {
        savedCount += await fetchFormsOf(pokemonId);
    }
    console.log(`Saved ${savedCount} forms of pokemon with cosmetic forms.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    fetchCosmeticForms().catch((error) => {
        console.error(error);
        process.exit(1);
    });
}

export { fetchCosmeticForms };
