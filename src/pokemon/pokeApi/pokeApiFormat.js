import fs from "fs";
import path from "path";

import { GAME_KEYS } from "../constants/GAME_KEYS.js";

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
const SOFT_HYPHEN_BREAK = /­[\n\f\r]+/g;
const LINE_BREAKS = /[\n\f\r]+/g;

function languageKey(languageCode) {
    return LANGUAGE_KEYS[languageCode.toLowerCase()] ?? languageCode;
}

function gameKey(versionGroup) {
    return GAME_KEYS[versionGroup] ?? versionGroup;
}

function cleanText(text) {
    return text
        .replace(LINK_MARKUP, (match, label, slug) =>
            label || slug.replace(/-/g, " ")
        )
        .replace(SOFT_HYPHEN_BREAK, "")
        .replace(LINE_BREAKS, " ")
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

function findExistingEntry(entriesDir, entryId) {
    const fileName = fs
        .readdirSync(entriesDir)
        .find((name) => name.startsWith(`${entryId}-`));
    if (!fileName) {
        return null;
    }
    const filePath = path.join(entriesDir, fileName);
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

export {
    buildEffect,
    buildEffectChanges,
    buildFlavorText,
    buildNames,
    cleanText,
    findExistingEntry,
    gameKey,
    languageKey,
};
