const CURLY_APOSTROPHE = "\u2019";

/** Lower-cases and evens out quotes and spacing; keeps all words. */
export function normalizeText(text) {
    return text
        .replace(/[\u2018\u2019]/g, "'")
        .replace(/[\u201c\u201d]/g, "\"")
        .replace(/\u00ad/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();
}

/** Letters and digits only, for spotting punctuation-only differences. */
export function loosenText(text) {
    return normalizeText(text).replace(/[^a-z0-9é]/g, "");
}

export function isSameText(firstText, secondText) {
    return normalizeText(firstText) === normalizeText(secondText);
}

export function matchesAnyVariant(ourText, variants) {
    return variants.some((variant) => isSameText(ourText, variant));
}

export function differsOnlyInPunctuation(ourText, variants) {
    const looseOurs = loosenText(ourText);
    return variants.some((variant) => loosenText(variant) === looseOurs);
}

/** Tokens match when they differ only in case or quote style. */
function isSameToken(firstToken, secondToken) {
    return tokenKey(firstToken) === tokenKey(secondToken);
}

function tokenKey(token) {
    return token
        .replace(/[\u2018\u2019]/g, "'")
        .replace(/[\u201c\u201d]/g, "\"")
        .toLowerCase();
}

function tokenize(text) {
    return text.match(/\S+|\s+/g) ?? [];
}

function buildCommonLengths(ourTokens, theirTokens) {
    const lengths = Array.from({ length: ourTokens.length + 1 },
        () => new Array(theirTokens.length + 1).fill(0));
    for (let ourIndex = ourTokens.length - 1; ourIndex >= 0; ourIndex -= 1) {
        for (let theirIndex = theirTokens.length - 1; theirIndex >= 0;
            theirIndex -= 1) {
            lengths[ourIndex][theirIndex] =
                isSameToken(ourTokens[ourIndex], theirTokens[theirIndex])
                    ? lengths[ourIndex + 1][theirIndex + 1] + 1
                    : Math.max(lengths[ourIndex + 1][theirIndex],
                        lengths[ourIndex][theirIndex + 1]);
        }
    }
    return lengths;
}

/**
 * Word-level diff of two texts.
 * @returns {Array<{ours: string, theirs: string, equal: boolean}>}
 */
export function diffWords(ourText, theirText) {
    const ourTokens = tokenize(ourText);
    const theirTokens = tokenize(theirText);
    const lengths = buildCommonLengths(ourTokens, theirTokens);
    const segments = [];
    let ourIndex = 0;
    let theirIndex = 0;
    while (ourIndex < ourTokens.length || theirIndex < theirTokens.length) {
        const ourToken = ourTokens[ourIndex] ?? null;
        const theirToken = theirTokens[theirIndex] ?? null;
        if (ourToken !== null && theirToken !== null
            && isSameToken(ourToken, theirToken)) {
            segments.push({ ours: ourToken, theirs: theirToken, equal: true });
            ourIndex += 1;
            theirIndex += 1;
        } else if (theirToken === null || (ourToken !== null
            && lengths[ourIndex + 1][theirIndex]
                >= lengths[ourIndex][theirIndex + 1])) {
            segments.push({ ours: ourToken, theirs: "", equal: false });
            ourIndex += 1;
        } else {
            segments.push({ ours: "", theirs: theirToken, equal: false });
            theirIndex += 1;
        }
    }
    return segments;
}

/** Shares of words two texts have in common, 0 to 1. */
export function similarity(firstText, secondText) {
    const segments = diffWords(firstText, secondText);
    const equalCount = segments.filter((segment) => segment.equal).length;
    return segments.length === 0 ? 1 : equalCount / segments.length;
}

export function pickClosestVariant(ourText, variants) {
    return variants.reduce((closest, variant) =>
        similarity(ourText, variant) > similarity(ourText, closest)
            ? variant : closest);
}

function isShouted(text) {
    return /[A-Z]{2}/.test(text) && text === text.toUpperCase();
}

function matchOurStyle(theirText, replacedText, usesCurlyApostrophes) {
    let styled = theirText;
    if (isShouted(replacedText)) {
        styled = styled.toUpperCase().replace(/É/g, "é");
    }
    return usesCurlyApostrophes ? styled.replace(/'/g, CURLY_APOSTROPHE)
        : styled;
}

/**
 * Bulbapedia's text written in our file's style: unchanged words keep
 * our casing (`POKéMON`) and changed words use our apostrophes.
 */
export function mergeIntoOurStyle(ourText, theirText) {
    const usesCurlyApostrophes = ourText.includes(CURLY_APOSTROPHE)
        || !ourText.includes("'");
    let replacedText = "";
    let merged = "";
    for (const segment of diffWords(ourText, theirText)) {
        if (segment.equal) {
            merged += segment.ours;
            replacedText = "";
        } else {
            replacedText += segment.ours;
            merged += matchOurStyle(segment.theirs, replacedText,
                usesCurlyApostrophes);
        }
    }
    return merged;
}
