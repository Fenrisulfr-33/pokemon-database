import fs from "fs";
import path from "path";

import readJsonDir from "#genericFunctions/files/readJsonDir.js";
import {
    ABILITIES_ENTRIES_DIR,
    EVOLUTIONS_ENTRIES_DIR,
    FORMS_DIR,
    POKEAPI_FORM_DETAILS_DIR,
    POKEAPI_FORMS_DIR,
    POKEAPI_GENERATIONS_DIR,
    POKEAPI_POKEMON_DIR,
    POKEDEX_ENTRIES_DIR,
} from "#helpers/paths.js";
import { findPokeApiFormName, nameTokens } from "./formMatching.js";

function readJsonFile(filePath) {
    try {
        return JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch (error) {
        throw new Error(`Can't read ${filePath}: ${error.message}`);
    }
}

function nameFromFile(fileName) {
    return fileName.replace(/\.json$/, "").replace(/^[\d.]+-/, "");
}

function listPokeApiFiles(directory) {
    return fs.readdirSync(directory)
        .filter((file) => file.endsWith(".json"))
        .map((file) => ({
            id: Number(file.split("-")[0]),
            name: nameFromFile(file),
            filePath: path.join(directory, file),
        }));
}

function loadAbilityIds() {
    const abilities = readJsonDir(ABILITIES_ENTRIES_DIR);
    return new Map(abilities.map((ability) => [ability.key, ability._id]));
}

function loadGenerations() {
    const generationByVersionGroup = new Map();
    for (const generation of readJsonDir(POKEAPI_GENERATIONS_DIR)) {
        for (const versionGroup of generation.version_groups) {
            generationByVersionGroup.set(versionGroup, generation._id);
        }
    }
    return generationByVersionGroup;
}

function addChainMembers(node, chainId, chainByPokemonId) {
    if (!Array.isArray(node)) return;
    if (typeof node[0] === "number") {
        chainByPokemonId.set(node[0], chainId);
        return;
    }
    node.forEach((child) => addChainMembers(child, chainId, chainByPokemonId));
}

function loadEvolutionChains() {
    const chainByPokemonId = new Map();
    for (const chain of readJsonDir(EVOLUTIONS_ENTRIES_DIR)) {
        addChainMembers(chain.evolution, chain._id, chainByPokemonId);
    }
    return chainByPokemonId;
}

function listFormFiles() {
    return fs.readdirSync(FORMS_DIR, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .flatMap((folder) => fs.readdirSync(path.join(FORMS_DIR, folder.name))
            .filter((file) => file.endsWith(".json"))
            .map((file) => path.join(FORMS_DIR, folder.name, file)));
}

function loadExistingForms() {
    return listFormFiles().map((filePath) => ({
        folder: path.basename(path.dirname(filePath)),
        filePath,
        tokens: nameTokens(nameFromFile(path.basename(filePath))),
        data: readJsonFile(filePath),
    }));
}

function loadPokedex(pokeApiForms) {
    const entries = readJsonDir(POKEDEX_ENTRIES_DIR);
    const baseById = new Map();
    const dexFormByApiName = new Map();
    for (const entry of entries) {
        if (Number.isInteger(entry._id)) {
            baseById.set(entry._id, entry);
            continue;
        }
        const apiName = findPokeApiFormName(entry, pokeApiForms);
        dexFormByApiName.set(apiName, entry);
    }
    return { baseById, dexFormByApiName };
}

function loadFormDetails() {
    return readJsonDir(POKEAPI_FORM_DETAILS_DIR)
        .sort((first, second) => first.id - second.id);
}

function loadSources() {
    const pokeApiForms = listPokeApiFiles(POKEAPI_FORMS_DIR);
    return {
        pokeApiForms,
        pokeApiPokemon: listPokeApiFiles(POKEAPI_POKEMON_DIR),
        formDetails: loadFormDetails(),
        abilityIds: loadAbilityIds(),
        generationByVersionGroup: loadGenerations(),
        chainByPokemonId: loadEvolutionChains(),
        existingForms: loadExistingForms(),
        ...loadPokedex(pokeApiForms),
    };
}

export { listFormFiles, loadSources, readJsonFile };
