import {
    gameKeyForBulbapediaName,
    isIgnoredBulbapediaGame,
} from "../../bulbapediaGames.js";
import { readEntryVariants } from "../../wikitextMarkup.js";
import {
    findTopLevelTemplates,
    readTemplate,
} from "../../wikitextTemplates.js";

/**
 * Form labels that never name the default form. Any other label that
 * is the first `Dex/Form` in a generation (Overcast Form, Altered
 * Forme, Midday Form, ...) is treated as the base form.
 */
const ALTERNATE_FORM_LABEL = new RegExp([
    "Alolan", "Galarian", "Hisuian", "Paldean", "Gigantamax", "Mega",
    "Totem", "Primal", "Cap", "Bloodmoon",
].join("|"), "i");

const VERSION_PARAMETERS = ["v", "v2", "v3", "v4"];

function findEntriesSection(wikitext) {
    const sectionStart = wikitext.indexOf("{{Dex/Header");
    if (sectionStart === -1) {
        return "";
    }
    const sectionEnd = wikitext.indexOf("{{Dex/Footer}}", sectionStart);
    return wikitext.slice(sectionStart, sectionEnd);
}

function startGeneration(state) {
    state.mode = "base";
    state.formLabel = null;
    state.formSeenInGeneration = false;
    state.gamesInGeneration = new Set();
}

function startForm(state, formLabel) {
    const isDefaultForm = !state.formSeenInGeneration
        && !ALTERNATE_FORM_LABEL.test(formLabel);
    state.mode = isDefaultForm ? "fill" : "skip";
    state.formLabel = formLabel;
    state.formSeenInGeneration = true;
}

function recordGameEntry(state, bulbapediaGame, rawEntry) {
    const gameKey = gameKeyForBulbapediaName(bulbapediaGame);
    if (!gameKey) {
        if (!isIgnoredBulbapediaGame(bulbapediaGame)) {
            state.unknownGames.add(bulbapediaGame);
        }
        return;
    }
    const variants = readEntryVariants(rawEntry);
    const isBaseEntry = state.mode === "base" || (state.mode === "fill"
        && !state.gamesInGeneration.has(gameKey));
    if (!isBaseEntry) {
        recordOtherFormEntry(state, gameKey, variants);
        return;
    }
    state.gamesInGeneration.add(gameKey);
    state.entries.set(gameKey, variants);
    state.entryLabels.set(gameKey, state.formLabel);
}

function recordOtherFormEntry(state, gameKey, variants) {
    const otherForms = state.otherForms.get(gameKey) ?? [];
    otherForms.push({ label: state.formLabel, variants });
    state.otherForms.set(gameKey, otherForms);
}

function recordEntryTemplate(state, template) {
    for (const parameter of VERSION_PARAMETERS) {
        const bulbapediaGame = (template.named[parameter] ?? "").trim();
        if (bulbapediaGame) {
            recordGameEntry(state, bulbapediaGame,
                template.named.entry ?? "");
        }
    }
}

function handleTemplate(state, template) {
    if (template.name.startsWith("Dex/Gen")) {
        startGeneration(state);
    } else if (template.name === "Dex/Form") {
        startForm(state, template.positional[0] ?? "");
    } else if (template.name.startsWith("Dex/Entry")) {
        recordEntryTemplate(state, template);
    }
}

/**
 * Reads the base form's Pokédex entries from a species page.
 * @param {string} wikitext - the full species page wikitext
 * @returns {Object} entries: single game key → every reading of the
 *   base form's entry; entryLabels: game key → the `Dex/Form` label the
 *   base entry came from (null when unlabelled); otherForms: game key →
 *   [{label, variants}] for every other form; unknownGames: Bulbapedia
 *   game names this parser doesn't know
 */
export function parsePokedexEntries(wikitext) {
    const state = {
        entries: new Map(),
        entryLabels: new Map(),
        otherForms: new Map(),
        unknownGames: new Set(),
    };
    startGeneration(state);
    for (const templateBody of findTopLevelTemplates(
        findEntriesSection(wikitext))) {
        handleTemplate(state, readTemplate(templateBody));
    }
    const { entries, entryLabels, otherForms, unknownGames } = state;
    return { entries, entryLabels, otherForms, unknownGames };
}
