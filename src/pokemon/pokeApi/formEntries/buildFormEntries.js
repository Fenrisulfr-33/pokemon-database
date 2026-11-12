import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { FORMS_DIR } from "#helpers/paths.js";
import {
    buildAbilities,
    buildBaseStats,
    buildEvs,
    buildGender,
    buildName,
    buildTypes,
    folderForForm,
    formKey,
    orderFields,
    titleCase,
} from "./formFields.js";
import { buildCosmeticForms } from "./cosmeticForms.js";
import { findExistingForm } from "./formMatching.js";
import { listFormFiles, loadSources, readJsonFile } from "./formSources.js";
import { hasBaseBattleFields, toVisualDocument } from "./visualForms.js";

const SPECIES_FIELDS = [
    "eggGroups", "species", "catchRate", "baseFriendship", "growthRate",
    "eggCycles", "nameOrigin", "gender",
];

const PRIMITIVE = String.raw`(?:"[^"\n]*"|-?\d+(?:\.\d+)?|null)`;
const PRIMITIVE_ARRAY = new RegExp(
    String.raw`\[\s*(${PRIMITIVE}(?:,\s*${PRIMITIVE})*)\s*\]`,
    "g"
);

function firstDefined(field, ...sources) {
    const source = sources.find((item) => item?.[field] !== undefined);
    return source?.[field];
}

function speciesIdFor(details, sources) {
    for (const [pokemonId, entry] of sources.baseById) {
        if (entry.key === details.species) return pokemonId;
    }
    const pokemon = sources.pokeApiPokemon.find((file) =>
        file.name === details.species
        || file.name.startsWith(`${details.species}-`));
    if (!pokemon) throw new Error(`No species id for ${details.name}`);
    return pokemon.id;
}

function findFormSources(details, sources, speciesId) {
    const pokeApiFile = sources.pokeApiForms.find(
        (form) => form.id === details.id
    );
    return {
        pokeApiForm: readJsonFile(pokeApiFile.filePath),
        baseEntry: sources.baseById.get(speciesId),
        dexForm: sources.dexFormByApiName.get(details.name),
        existingForm: findExistingForm(details.name, sources.existingForms),
    };
}

function englishFallback(found, key) {
    const existingEnglish = found.existingForm?.data.name?.english;
    const baseEnglish = found.baseEntry.name.english;
    if (existingEnglish && existingEnglish !== baseEnglish) {
        return existingEnglish;
    }
    return titleCase(key);
}

function evolutionFor(found, chainByPokemonId) {
    return chainByPokemonId.get(found.dexForm?._id)
        ?? found.existingForm?.data.evolution
        ?? found.dexForm?.evolution
        ?? found.baseEntry.evolution;
}

function speciesFields(found) {
    const formData = [found.existingForm?.data, found.dexForm];
    const fields = {};
    for (const field of SPECIES_FIELDS) {
        fields[field] = firstDefined(field, ...formData, found.baseEntry);
    }
    fields.gender = buildGender(fields.gender);
    fields.pokedexEntries = firstDefined("pokedexEntries", ...formData) ?? {};
    return fields;
}

function battleFields(found, abilityIds) {
    return {
        type: buildTypes(found.pokeApiForm),
        abilities: buildAbilities(found.pokeApiForm, abilityIds),
        baseStats: buildBaseStats(found.pokeApiForm),
        info: {
            height: found.pokeApiForm.height,
            weight: found.pokeApiForm.weight,
        },
        evs: buildEvs(found.pokeApiForm),
    };
}

function buildFormDocument(details, found, identity, sources) {
    const formData = [found.existingForm?.data, found.dexForm];
    return orderFields({
        _id: Number(`${identity.speciesId}.${identity.formNumber}`),
        key: identity.key,
        name: buildName(details, englishFallback(found, identity.key)),
        ...battleFields(found, sources.abilityIds),
        ...speciesFields(found),
        evolution: evolutionFor(found, sources.chainByPokemonId),
        generation: sources.generationByVersionGroup.get(details.versionGroup),
        baseExp: details.baseExperience
            ?? firstDefined("baseExp", ...formData)
            ?? undefined,
    });
}

function buildForm(details, sources, formCounts) {
    const speciesId = speciesIdFor(details, sources);
    const count = (formCounts.get(speciesId) ?? 0) + 1;
    formCounts.set(speciesId, count);
    const identity = {
        speciesId,
        formNumber: String(count).padStart(2, "0"),
        key: formKey(details),
    };
    const found = findFormSources(details, sources, speciesId);
    const document = buildFormDocument(details, found, identity, sources);
    return {
        folder: folderForForm(details, found.existingForm),
        fileName: `${speciesId}.${identity.formNumber}-${identity.key}.json`,
        document: hasBaseBattleFields(document, found.baseEntry)
            ? toVisualDocument(document, found.baseEntry)
            : document,
        hasEnglishName: details.names.some(
            (entry) => entry.language.name === "en"
        ),
    };
}

function formatJson(document) {
    const json = JSON.stringify(document, null, 4);
    const inlined = json.replace(PRIMITIVE_ARRAY, (match, items) =>
        `[${items.split(/,\s*/).join(", ")}]`);
    return `${inlined}\n`;
}

function writeForms(forms) {
    listFormFiles().forEach((filePath) => fs.rmSync(filePath));
    for (const form of forms) {
        const folder = path.join(FORMS_DIR, form.folder);
        fs.mkdirSync(folder, { recursive: true });
        const target = path.join(folder, form.fileName);
        fs.writeFileSync(target, formatJson(form.document));
    }
}

function listKeys(forms, isMissing) {
    return forms.filter(isMissing).map((form) => form.document.key);
}

function printReport(forms) {
    const fullForms = forms.filter((form) => !form.document.visual);
    const report = {
        "Forms written": forms.length,
        "Visual forms (differences only)": forms.length - fullForms.length,
        "No English name in PokeAPI": listKeys(
            forms, (form) => !form.hasEnglishName),
        "No abilities": listKeys(
            fullForms, (form) => !form.document.abilities.normal.length),
        "No baseExp": listKeys(
            fullForms, (form) => form.document.baseExp === undefined),
        "Empty pokedexEntries": listKeys(forms, (form) =>
            !Object.keys(form.document.pokedexEntries).length).length,
    };
    console.log(JSON.stringify(report, null, 4));
}

function buildFormEntries() {
    const sources = loadSources();
    const formCounts = new Map();
    const battleForms = sources.formDetails.map(
        (details) => buildForm(details, sources, formCounts)
    );
    const forms = [
        ...battleForms,
        ...buildCosmeticForms(sources, formCounts),
    ];
    writeForms(forms);
    printReport(forms);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    try {
        buildFormEntries();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

export { buildFormEntries };
