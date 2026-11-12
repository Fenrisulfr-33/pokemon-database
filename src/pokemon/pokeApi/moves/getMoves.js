import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { MOVES_ENTRIES_DIR } from "#helpers/paths.js";
import { fetchData } from "../apiRequest.mjs";
import { amountOfMoves, generationKey } from "../CONSTANTS.mjs";
import {
    buildEffect,
    buildEffectChanges,
    buildFlavorText,
    buildNames,
    findExistingEntry,
    gameKey,
} from "../pokeApiFormat.js";

const OUTPUT_DIR = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "entries"
);

const EFFECT_CHANCE_PLACEHOLDER = /\$effect_chance/g;

const PAST_VALUE_FIELDS = {
    accuracy: "accuracy",
    power: "power",
    pp: "pp",
    effect_chance: "effectChance",
};

const META_FIELDS = {
    min_hits: "minHits",
    max_hits: "maxHits",
    min_turns: "minTurns",
    max_turns: "maxTurns",
    drain: "drain",
    healing: "healing",
    crit_rate: "critRate",
    ailment_chance: "ailmentChance",
    flinch_chance: "flinchChance",
    stat_chance: "statChance",
};

function resourceName(resource) {
    return resource?.name ?? null;
}

function buildMeta(meta) {
    if (!meta) return null;
    const entryMeta = {
        category: resourceName(meta.category),
        ailment: resourceName(meta.ailment),
    };
    for (const [apiField, entryField] of Object.entries(META_FIELDS)) {
        entryMeta[entryField] = meta[apiField];
    }
    return entryMeta;
}

function fillEffectChance(text, effectChance) {
    if (effectChance === null) return text;
    return text.replace(EFFECT_CHANCE_PLACEHOLDER, String(effectChance));
}

function buildMoveEffect(effectEntries, effectChance) {
    const effect = buildEffect(effectEntries);
    return {
        full: fillEffectChance(effect.full, effectChance),
        shortEffect: fillEffectChance(effect.shortEffect, effectChance),
    };
}

function buildPastValue(pastValue, effectChance) {
    const change = {};
    for (const [apiField, entryField] of Object.entries(PAST_VALUE_FIELDS)) {
        if (pastValue[apiField] !== null) {
            change[entryField] = pastValue[apiField];
        }
    }
    if (pastValue.type) change.type = pastValue.type.name;
    if (pastValue.effect_entries.length > 0) {
        change.effect = buildMoveEffect(
            pastValue.effect_entries,
            pastValue.effect_chance ?? effectChance
        );
    }
    return change;
}

function buildChanges(pastValues, effectChance) {
    const changesByGame = {};
    for (const pastValue of pastValues) {
        const change = buildPastValue(pastValue, effectChance);
        if (Object.keys(change).length === 0) continue;
        changesByGame[gameKey(pastValue.version_group.name)] = change;
    }
    return changesByGame;
}

function transformMove(move, existingEntry) {
    return {
        _id: move.id,
        key: move.name,
        name: buildNames(move.names),
        type: move.type.name,
        category: resourceName(move.damage_class),
        contest: resourceName(move.contest_type),
        pp: move.pp,
        power: move.power,
        accuracy: move.accuracy,
        contact: existingEntry?.contact ?? null,
        generation: generationKey[move.generation.name],
        priority: move.priority,
        target: move.target.name,
        meta: buildMeta(move.meta),
        changes: buildChanges(move.past_values, move.effect_chance),
        effectChanges: buildEffectChanges(move.effect_changes),
        flavorText: buildFlavorText(move.flavor_text_entries),
        effect: buildMoveEffect(move.effect_entries, move.effect_chance),
    };
}

function saveEntry(entry) {
    const filePath = path.join(OUTPUT_DIR, `${entry._id}-${entry.key}.json`);
    fs.writeFileSync(filePath, JSON.stringify(entry, null, 4) + "\n");
}

async function getMoves() {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    for (let moveId = 1; moveId <= amountOfMoves; moveId++) {
        const move = await fetchData(`move/${moveId}`);
        const entry = transformMove(
            move,
            findExistingEntry(MOVES_ENTRIES_DIR, moveId)
        );
        saveEntry(entry);
        console.log(`Saved ${entry._id}-${entry.key}.json`);
    }
}

getMoves().catch((error) => {
    console.error("getMoves failed:", error);
    process.exitCode = 1;
});
