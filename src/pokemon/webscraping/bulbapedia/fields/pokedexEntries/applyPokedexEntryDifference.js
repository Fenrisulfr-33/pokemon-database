import { gameKeyOrder } from "../../bulbapediaGames.js";

const ENTRY_INDENT = "        ";
const ENTRY_LINE = /^(\s*)\{ "([a-z0-9]+)": .*\}(,?)\r?$/;

function encodeEntry(gameKey, text) {
    return `"${gameKey}": ${JSON.stringify(text)}`;
}

function countOccurrences(fileText, searchText) {
    return fileText.split(searchText).length - 1;
}

function replaceEntryText(fileText, difference) {
    const oldEntry = encodeEntry(difference.gameKey, difference.ours);
    if (countOccurrences(fileText, oldEntry) !== 1) {
        throw new Error(`${difference.id}: current text not found once`);
    }
    return fileText.replace(oldEntry, () =>
        encodeEntry(difference.gameKey, difference.bulbapedia));
}

function isEntryLine(line) {
    return ENTRY_LINE.test(line ?? "");
}

function removeTrailingComma(line) {
    return line.replace(/\},(\r?)$/, "}$1");
}

function removeEntry(fileText, difference) {
    const lines = fileText.split("\n");
    const oldEntry = `{ ${encodeEntry(difference.gameKey, difference.ours)} }`;
    const lineIndex = lines.findIndex((line) =>
        isEntryLine(line) && line.includes(oldEntry));
    if (lineIndex === -1) {
        throw new Error(`${difference.id}: entry line not found`);
    }
    lines.splice(lineIndex, 1);
    const wasLastEntry = !isEntryLine(lines[lineIndex]);
    if (wasLastEntry && isEntryLine(lines[lineIndex - 1])) {
        lines[lineIndex - 1] = removeTrailingComma(lines[lineIndex - 1]);
    }
    return lines.join("\n");
}

function fillEmptyEntries(fileText, newLine, newlineStyle) {
    return fileText.replace("\"pokedexEntries\": []", () =>
        `"pokedexEntries": [${newlineStyle}${newLine}${newlineStyle}    ]`);
}

function entryOrder(line) {
    return gameKeyOrder(line.match(ENTRY_LINE)[2]);
}

/** After the last entry for an earlier game, else before the first. */
function findInsertIndex(lines, gameKey) {
    const newOrder = gameKeyOrder(gameKey);
    const entryIndexes = lines
        .map((line, index) => (isEntryLine(line) ? index : -1))
        .filter((index) => index !== -1);
    if (entryIndexes.length === 0) {
        return -1;
    }
    const earlierIndexes = entryIndexes
        .filter((index) => entryOrder(lines[index]) < newOrder);
    return earlierIndexes.length > 0 ? earlierIndexes.at(-1) + 1
        : entryIndexes[0];
}

function insertEntryLine(lines, insertIndex, newLine) {
    const previousLine = lines[insertIndex - 1] ?? "";
    const nextIsEntry = isEntryLine(lines[insertIndex]);
    if (isEntryLine(previousLine) && !nextIsEntry) {
        lines[insertIndex - 1] = previousLine.replace(/\}(\r?)$/, "},$1");
    }
    const lineEnding = previousLine.endsWith("\r") ? "\r" : "";
    lines.splice(insertIndex, 0,
        `${newLine}${nextIsEntry ? "," : ""}${lineEnding}`);
    return lines;
}

function addEntry(fileText, difference) {
    const newlineStyle = fileText.includes("\r\n") ? "\r\n" : "\n";
    const newLine = `${ENTRY_INDENT}{ ${encodeEntry(difference.gameKey,
        difference.bulbapedia)} }`;
    if (fileText.includes("\"pokedexEntries\": []")) {
        return fillEmptyEntries(fileText, newLine, newlineStyle);
    }
    const lines = fileText.split("\n");
    const insertIndex = findInsertIndex(lines, difference.gameKey);
    if (insertIndex === -1) {
        throw new Error(`${difference.id}: no pokedexEntries list found`);
    }
    return insertEntryLine(lines, insertIndex, newLine).join("\n");
}

const APPLY_BY_KIND = Object.freeze({
    wording: replaceEntryText,
    punctuation: replaceEntryText,
    form: replaceEntryText,
    extra: removeEntry,
    missing: addEntry,
});

/**
 * Applies one accepted difference to a pokedex file's text, changing
 * only the affected entry line and keeping the file's formatting.
 * @param {string} fileText - the file's current contents
 * @param {Object} difference - from findPokedexEntryDifferences
 * @returns {string} the new file contents
 */
export function applyPokedexEntryDifference(fileText, difference) {
    const applyChange = APPLY_BY_KIND[difference.kind];
    if (!applyChange) {
        throw new Error(`${difference.id}: "${difference.kind}" differences`
            + " must be fixed by hand");
    }
    return applyChange(fileText, difference);
}
