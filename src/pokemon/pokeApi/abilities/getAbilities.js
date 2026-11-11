import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { ABILITIES_ENTRIES_DIR } from "#helpers/paths.js";
import { GAME_KEYS } from "../../constants/GAME_KEYS.js";
import { fetchData } from "../apiRequest.mjs";
import { amountOfAbilities, generationKey } from "../CONSTANTS.mjs";

const OUTPUT_DIR = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "entries"
);

const LANGUAGE_KEYS = {
    "en": "english",
    "es": "spanish",
    "es-419": "latin-american-spanish",
    "it": "italian",
    "fr": "french",
    "de": "german",
    "cs": "czech",
    "pt-br": "brazilian-portuguese",
    "ja": "japanese",
    "ja-hrkt": "japanese-kana",
    "ja-kanji": "japanese-kanji",
    "roomaji": "romaji",
    "ko": "korean",
    "zh-hant": "traditional-chinese",
    "zh-hans": "simplified-chinese",
};

const LINK_MARKUP = /\[([^\]]*)\]\{[a-z-]+:([a-z0-9-]+)\}/g;

function languageKey(languageCode) {
    return LANGUAGE_KEYS[languageCode.toLowerCase()] ?? languageCode;
}

function cleanText(text) {
    return text
        .replace(LINK_MARKUP, (match, label, slug) =>
            label || slug.replace(/-/g, " ")
        )
        .replace(/[\n\f\r]+/g, " ")
        .trim();
}

function buildNames(names) {
    const namesByLanguage = {};
    for (const entry of names) {
        namesByLanguage[languageKey(entry.language.name)] = entry.name;
    }
    return namesByLanguage;
}

function buildEffect(effectEntries) {
    const english = effectEntries.find(
        (entry) => entry.language.name === "en"
    );
    if (!english) {
        return { shortEffect: "", full: "" };
    }
    return {
        shortEffect: cleanText(english.short_effect),
        full: cleanText(english.effect),
    };
}

function gameKey(versionGroup) {
    return GAME_KEYS[versionGroup] ?? versionGroup;
}

function addByLanguageAndGame(target, languageCode, versionGroup, text) {
    const language = languageKey(languageCode);
    target[language] ??= {};
    target[language][gameKey(versionGroup)] = cleanText(text);
}

function buildEffectChanges(effectChanges) {
    const changesByLanguage = {};
    for (const change of effectChanges) {
        for (const entry of change.effect_entries) {
            addByLanguageAndGame(
                changesByLanguage,
                entry.language.name,
                change.version_group.name,
                entry.effect
            );
        }
    }
    return changesByLanguage;
}

function buildFlavorText(flavorTextEntries) {
    const flavorTextByLanguage = {};
    for (const entry of flavorTextEntries) {
        addByLanguageAndGame(
            flavorTextByLanguage,
            entry.language.name,
            entry.version_group.name,
            entry.flavor_text
        );
    }
    return flavorTextByLanguage;
}

function findExistingEntry(abilityId) {
    const fileName = fs
        .readdirSync(ABILITIES_ENTRIES_DIR)
        .find((name) => name.startsWith(`${abilityId}-`));
    if (!fileName) {
        return null;
    }
    const filePath = path.join(ABILITIES_ENTRIES_DIR, fileName);
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function transformAbility(ability, existingEntry) {
    const entry = {
        _id: ability.id,
        key: ability.name,
        name: buildNames(ability.names),
        generation: generationKey[ability.generation.name],
        effect: buildEffect(ability.effect_entries),
        effectChanges: buildEffectChanges(ability.effect_changes),
        flavorText: buildFlavorText(ability.flavor_text_entries),
    };
    if (existingEntry?.pokemonWithAbility) {
        entry.pokemonWithAbility = existingEntry.pokemonWithAbility;
    }
    return entry;
}

function saveEntry(entry) {
    const filePath = path.join(OUTPUT_DIR, `${entry._id}-${entry.key}.json`);
    fs.writeFileSync(filePath, JSON.stringify(entry, null, 4) + "\n");
}

async function getAbilities() {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    for (let abilityId = 1; abilityId <= amountOfAbilities; abilityId++) {
        const ability = await fetchData(`ability/${abilityId}`);
        const entry = transformAbility(ability, findExistingEntry(abilityId));
        saveEntry(entry);
        console.log(`Saved ${entry._id}-${entry.key}.json`);
    }
}

getAbilities().catch((error) => {
    console.error("getAbilities failed:", error);
    process.exitCode = 1;
});
