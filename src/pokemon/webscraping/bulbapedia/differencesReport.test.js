import { readDecisions, renderDifferencesReport } from "./differencesReport.js";

const FIELD = {
    fieldName: "pokedexEntries",
    kindDescriptions: { wording: "Words differ.", punctuation: "Spacing." },
};

function difference(id, kind, ours, bulbapedia) {
    return { id, pokemon: "Testmon", gameKey: id.split("/")[1], kind, ours,
        bulbapedia, note: null };
}

function render(differences, decisions = new Map()) {
    return renderDifferencesReport({ field: FIELD, differences, decisions,
        checkedCount: 1, notFound: [], date: "2026-11-24" });
}

describe("renderDifferencesReport", () => {
    test("puts punctuation-only rows in their own table", () => {
        const markdown = render([
            difference("1-a/rb", "wording", "x", "y"),
            difference("1-a/sw", "punctuation", "a-b", "a- b"),
        ]);
        const punctuationSection = markdown.split("## Spacing")[1];
        expect(punctuationSection).toContain("`1-a/sw`");
    });

    test("escapes pipes inside entry text", () => {
        const markdown = render([difference("1-a/rb", "wording", "a|b", "c")]);
        expect(markdown).toContain("a\\|b");
    });
});

describe("readDecisions", () => {
    test("reads back the decisions a report was rendered with", () => {
        const decisions = new Map([["1-a/rb", "accept"], ["1-a/sw", "reject"]]);
        const markdown = render([
            difference("1-a/rb", "wording", "x|y", "z"),
            difference("1-a/sw", "punctuation", "a", "b"),
        ], decisions);
        expect(readDecisions(markdown)).toEqual(decisions);
    });

    test("ignores blank and unknown decisions", () => {
        const markdown = "| `1-a/rb` | A | `rb` | wording | x | y |  |\n"
            + "| `1-a/sw` | A | `sw` | wording | x | y | maybe |";
        expect(readDecisions(markdown).size).toBe(0);
    });

    test("accepts decisions typed in capitals", () => {
        const markdown = "| `1-a/rb` | A | `rb` | wording | x | y | Accept |";
        expect(readDecisions(markdown).get("1-a/rb")).toBe("accept");
    });
});
