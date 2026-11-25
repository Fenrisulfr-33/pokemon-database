/** Templates whose first parameter is the text shown on the page. */
const SHOW_FIRST_PARAMETER = /\{\{(?:tt|OBP)\|([^{}|]*)\|[^{}]*\}\}/g;
/** Any other template with parameters shows its last parameter. */
const SHOW_LAST_PARAMETER = /\{\{[^{}|]*\|(?:[^{}|]*\|)*([^{}|]*)\}\}/g;
const PARAMETERLESS_TEMPLATE = /\{\{([^{}|]*)\}\}/g;
const FOOTNOTE_TEMPLATE = /\{\{tt\|\*\|[^{}]*\}\}/g;
const NO_TEXT_TEMPLATES = /\{\{(?:sic|sup\/\d\|[^{}]*)\}\}/g;
const PIPED_LINK = /\[\[[^\]|]*\|([^\]]*)\]\]/g;
const PLAIN_LINK = /\[\[([^\]]*)\]\]/g;
const LINE_BREAK = /<br\s*\/?>/;
/** `the{{sup/3|R}}/this{{sup/3|S}}`: one word per version. */
const VERSION_CHOICE =
    /(\S*)\{\{sup\/\d\|[^}]*\}\}\/(.*?)\{\{sup\/\d\|[^}]*\}\}/g;

const TEMPLATE_TEXT = Object.freeze({
    "{{ScPkmn}}": "Pokémon",
    "{{ScBall}}": "Poké Ball",
});

function showFirstCapture(match, captured) {
    return captured;
}

function removeComments(text) {
    return text.replace(/<!--[\s\S]*?-->/g, "");
}

function removeHtml(text) {
    return text
        .replace(/<small>[\s\S]*?<\/small>/g, "")
        .replace(/<\/?[a-z]+[^>]*>/g, "");
}

function replaceTemplatesWithText(text) {
    let current = text.replace(FOOTNOTE_TEMPLATE, "")
        .replace(NO_TEXT_TEMPLATES, "");
    let previous = null;
    while (previous !== current) {
        previous = current;
        for (const [template, shownText] of Object.entries(TEMPLATE_TEXT)) {
            current = current.split(template).join(shownText);
        }
        current = current
            .replace(SHOW_FIRST_PARAMETER, showFirstCapture)
            .replace(SHOW_LAST_PARAMETER, showFirstCapture)
            .replace(PARAMETERLESS_TEMPLATE, showFirstCapture);
    }
    return current;
}

function replaceLinksWithText(text) {
    return text
        .replace(PIPED_LINK, showFirstCapture)
        .replace(PLAIN_LINK, showFirstCapture);
}

/**
 * Turns Bulbapedia wikitext into the plain text shown on the page.
 * @param {string} wikitext
 * @returns {string}
 */
export function stripWikiMarkup(wikitext) {
    const withoutHtml = removeHtml(removeComments(wikitext));
    const plainText = replaceLinksWithText(
        replaceTemplatesWithText(withoutHtml),
    );
    return plainText.replace(/''/g, "").replace(/\*/g, "").trim();
}

function expandVersionChoices(entryPart) {
    if (!entryPart.match(VERSION_CHOICE)) {
        return [entryPart];
    }
    return [
        entryPart.replace(VERSION_CHOICE, (match, firstChoice) =>
            firstChoice),
        entryPart.replace(VERSION_CHOICE, (match, firstChoice, secondChoice) =>
            secondChoice),
    ];
}

/**
 * Every reading of one Bulbapedia entry. Entries can hold several texts
 * split by `<br>` (game revisions, English vs Japanese) and per-version
 * words marked with `{{sup/...}}`.
 * @param {string} rawEntry - the `entry=` parameter's wikitext
 * @returns {string[]} plain-text readings, never empty strings
 */
export function readEntryVariants(rawEntry) {
    return removeComments(rawEntry)
        .split(LINE_BREAK)
        .flatMap(expandVersionChoices)
        .map(stripWikiMarkup)
        .filter((variant) => variant.length > 0);
}
