import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import {
    POKEAPI_FORM_DETAILS_DIR,
    POKEAPI_FORMS_DIR,
} from "#helpers/paths.js";
import { fetchData } from "../apiRequest.mjs";

function listPokeApiForms() {
    return fs.readdirSync(POKEAPI_FORMS_DIR)
        .filter((file) => file.endsWith(".json"))
        .map((file) => file.replace(/\.json$/, ""))
        .map((baseName) => ({
            id: Number(baseName.split("-")[0]),
            fileName: `${baseName}.json`,
        }));
}

function toDetails(pokemon, pokemonForm) {
    return {
        id: pokemon.id,
        name: pokemon.name,
        species: pokemon.species.name,
        baseExperience: pokemon.base_experience,
        formName: pokemonForm.form_name,
        isMega: pokemonForm.is_mega,
        isBattleOnly: pokemonForm.is_battle_only,
        versionGroup: pokemonForm.version_group.name,
        names: pokemonForm.names,
        formNames: pokemonForm.form_names,
    };
}

async function fetchDetails(pokemonId) {
    const pokemon = await fetchData(`pokemon/${pokemonId}`);
    const formName = pokemon.forms[0].name;
    const pokemonForm = await fetchData(`pokemon-form/${formName}`);
    return toDetails(pokemon, pokemonForm);
}

async function fetchFormDetails({ refresh = false } = {}) {
    fs.mkdirSync(POKEAPI_FORM_DETAILS_DIR, { recursive: true });
    let fetchedCount = 0;
    for (const form of listPokeApiForms()) {
        const target = path.join(POKEAPI_FORM_DETAILS_DIR, form.fileName);
        if (!refresh && fs.existsSync(target)) continue;
        const details = await fetchDetails(form.id);
        fs.writeFileSync(target, `${JSON.stringify(details, null, 4)}\n`);
        fetchedCount++;
    }
    console.log(`Fetched details for ${fetchedCount} forms.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const refresh = process.argv.includes("--refresh");
    fetchFormDetails({ refresh }).catch((error) => {
        console.error(error);
        process.exit(1);
    });
}

export { fetchFormDetails };
