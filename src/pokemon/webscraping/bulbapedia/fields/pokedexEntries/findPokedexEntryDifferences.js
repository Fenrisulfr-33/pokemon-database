import { combineGameTexts, expandGameKey } from "../../bulbapediaGames.js";
import {
    differsOnlyInPunctuation,
    isSameText,
    matchesAnyVariant,
    mergeIntoOurStyle,
    pickClosestVariant,
} from "../../textComparison.js";
import { parsePokedexEntries } from "./parsePokedexEntries.js";

function listOurEntries(record) {
    return (record.pokedexEntries ?? []).flatMap(Object.entries);
}

function describeSplit(ourText, games, closestTexts) {
    const gameTexts = games.map((gameKey, index) =>
        `${gameKey}: ${closestTexts[index]}`);
    return { kind: "split", ours: ourText, bulbapedia: gameTexts.join(" / ") };
}

function describeChange(ourText, mismatchedVariants, closestText) {
    const punctuationOnly = mismatchedVariants.every((variants) =>
        differsOnlyInPunctuation(ourText, variants));
    return {
        kind: punctuationOnly ? "punctuation" : "wording",
        ours: ourText,
        bulbapedia: mergeIntoOurStyle(ourText, closestText),
    };
}

/** The label of another form whose entry is exactly our text. */
function findMatchingFormLabel(ourText, games, otherForms) {
    for (const game of games) {
        const match = (otherForms.get(game) ?? []).find((form) =>
            matchesAnyVariant(ourText, form.variants));
        if (match) {
            return match.label;
        }
    }
    return null;
}

function describeExtra(gameKey, ourText, otherForms) {
    const formLabel = findMatchingFormLabel(ourText, expandGameKey(gameKey),
        otherForms);
    const note = formLabel ? `Matches Bulbapedia's "${formLabel}" entry`
        : null;
    return { gameKey, kind: "extra", ours: ourText, bulbapedia: null, note };
}

function describeOtherForm(formLabel, baseLabel) {
    return `Ours is Bulbapedia's "${formLabel}" entry; this is its`
        + ` "${baseLabel ?? "base"}" entry`;
}

/**
 * Compares one of our entries with Bulbapedia's text for every game its
 * key covers. Returns null when they match.
 */
function compareOurEntry(gameKey, ourText, bulbapedia) {
    const bulbapediaEntries = bulbapedia.entries;
    const games = expandGameKey(gameKey)
        .filter((game) => bulbapediaEntries.has(game));
    if (games.length === 0) {
        return describeExtra(gameKey, ourText, bulbapedia.otherForms);
    }
    const mismatchedVariants = games
        .map((game) => bulbapediaEntries.get(game))
        .filter((variants) => !matchesAnyVariant(ourText, variants));
    if (mismatchedVariants.length === 0) {
        return null;
    }
    const closestTexts = games.map((game) =>
        pickClosestVariant(ourText, bulbapediaEntries.get(game)));
    const sameAcrossGames = closestTexts.every((text) =>
        isSameText(text, closestTexts[0]));
    const description = sameAcrossGames
        ? describeChange(ourText, mismatchedVariants, closestTexts[0])
        : describeSplit(ourText, games, closestTexts);
    return { gameKey, ...description,
        ...describeFormMatch(ourText, games, bulbapedia) };
}

/** Marks a difference whose text is another form's Bulbapedia entry. */
function describeFormMatch(ourText, games, bulbapedia) {
    const formLabel = findMatchingFormLabel(ourText, games,
        bulbapedia.otherForms);
    if (!formLabel) {
        return {};
    }
    const baseLabel = bulbapedia.entryLabels.get(games[0]);
    return { kind: "form", note: describeOtherForm(formLabel, baseLabel) };
}

function findMissingEntries(bulbapediaEntries, coveredGames) {
    const missingTexts = new Map();
    for (const [game, variants] of bulbapediaEntries) {
        if (!coveredGames.has(game) && variants.length > 0) {
            missingTexts.set(game, variants[0]);
        }
    }
    return combineGameTexts(missingTexts, isSameText)
        .map(([gameKey, text]) =>
            ({ gameKey, kind: "missing", ours: null, bulbapedia: text }));
}

/**
 * Every difference between a pokedex file's pokedexEntries and the base
 * form entries on its Bulbapedia page.
 * @param {Object} record - parsed pokedex entry file
 * @param {string} fileName - e.g. `6-charizard.json`
 * @param {string} wikitext - the Bulbapedia species page
 * @returns {Array<Object>} differences, each with id, file, pokemon,
 *   gameKey, kind, ours, bulbapedia, canApply and an optional note
 */
export function findPokedexEntryDifferences(record, fileName, wikitext) {
    const bulbapedia = parsePokedexEntries(wikitext);
    const coveredGames = new Set();
    const differences = [];
    for (const [gameKey, ourText] of listOurEntries(record)) {
        expandGameKey(gameKey).forEach((game) => coveredGames.add(game));
        const difference =
            compareOurEntry(gameKey, ourText, bulbapedia);
        if (difference) {
            differences.push(difference);
        }
    }
    differences.push(
        ...findMissingEntries(bulbapedia.entries, coveredGames));
    const fileStem = fileName.replace(/\.json$/, "");
    return differences.map((difference) => ({
        id: `${fileStem}/${difference.gameKey}`,
        file: fileName,
        pokemon: record.name.english,
        note: null,
        ...difference,
        canApply: difference.kind !== "split",
    }));
}
