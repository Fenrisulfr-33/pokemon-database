import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import readJsonDir from "#genericFunctions/files/readJsonDir.js";
import {
    buildPokemonWithAbility,
    emptyLists,
    replaceBlock,
} from "#abilities/updatePokemonWithAbility.js";
import {
    ABILITIES_ENTRIES_DIR,
    POKEDEX_ENTRIES_DIR,
} from "#helpers/paths.js";
import { fetchData } from "../apiRequest.mjs";
import { amountOfAbilities, generationKey } from "../CONSTANTS.mjs";
import {
    buildEffect,
    buildEffectChanges,
    buildFlavorText,
    buildNames,
    findExistingEntry,
} from "../pokeApiFormat.js";

const OUTPUT_DIR = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "entries"
);

function pickPokemonWithAbility(abilityId, existingEntry, listsByAbility) {
    const lists = listsByAbility.get(abilityId);
    if (lists) return lists;
    if (existingEntry?.pokemonWithAbility) return emptyLists();
    return null;
}

function transformAbility(ability, existingEntry, listsByAbility) {
    const entry = {
        _id: ability.id,
        key: ability.name,
        name: buildNames(ability.names),
        generation: generationKey[ability.generation.name],
        effect: buildEffect(ability.effect_entries),
        effectChanges: buildEffectChanges(ability.effect_changes),
        flavorText: buildFlavorText(ability.flavor_text_entries),
    };
    const lists = pickPokemonWithAbility(
        ability.id,
        existingEntry,
        listsByAbility
    );
    if (lists) entry.pokemonWithAbility = lists;
    return entry;
}

function formatEntry(entry) {
    const text = JSON.stringify(entry, null, 4) + "\n";
    if (!entry.pokemonWithAbility) return text;
    return replaceBlock(text, entry.pokemonWithAbility);
}

function saveEntry(entry) {
    const filePath = path.join(OUTPUT_DIR, `${entry._id}-${entry.key}.json`);
    fs.writeFileSync(filePath, formatEntry(entry));
}

async function getAbilities() {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    const listsByAbility = buildPokemonWithAbility(
        readJsonDir(POKEDEX_ENTRIES_DIR)
    );
    for (let abilityId = 1; abilityId <= amountOfAbilities; abilityId++) {
        const ability = await fetchData(`ability/${abilityId}`);
        const entry = transformAbility(
            ability,
            findExistingEntry(ABILITIES_ENTRIES_DIR, abilityId),
            listsByAbility
        );
        saveEntry(entry);
        console.log(`Saved ${entry._id}-${entry.key}.json`);
    }
}

getAbilities().catch((error) => {
    console.error("getAbilities failed:", error);
    process.exitCode = 1;
});
