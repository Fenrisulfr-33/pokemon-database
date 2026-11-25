import { readEntryVariants, stripWikiMarkup } from "./wikitextMarkup.js";
import {
    findTopLevelTemplates,
    readTemplate,
    splitTemplateParameters,
} from "./wikitextTemplates.js";

describe("findTopLevelTemplates", () => {
    test("keeps nested templates inside their parent", () => {
        const wikitext = "a {{Outer|x={{Inner|y}}}} b {{Second}}";
        expect(findTopLevelTemplates(wikitext))
            .toEqual(["Outer|x={{Inner|y}}", "Second"]);
    });
});

describe("splitTemplateParameters", () => {
    test("ignores pipes inside nested templates and links", () => {
        const body = "Dex/Entry1|v=Red|entry={{p|Mew}} [[A|b]]";
        expect(splitTemplateParameters(body))
            .toEqual(["Dex/Entry1", "v=Red", "entry={{p|Mew}} [[A|b]]"]);
    });
});

describe("readTemplate", () => {
    test("separates named and positional parameters", () => {
        const template = readTemplate("Dex/Form|Altered Forme|t=FFF");
        expect(template).toEqual({
            name: "Dex/Form",
            positional: ["Altered Forme"],
            named: { t: "FFF" },
        });
    });

    test("splits a named parameter on its first equals sign only", () => {
        expect(readTemplate("X|entry=a=b").named.entry).toBe("a=b");
    });
});

describe("stripWikiMarkup", () => {
    test.each([
        ["{{ScPkmn}} roasts", "Pokémon roasts"],
        ["a {{ScBall}}", "a Poké Ball"],
        ["{{OBP|Pokémon|species}} gather", "Pokémon gather"],
        ["{{wp|Kappa (folklore)|Kappa}}", "Kappa"],
        ["{{status|burn|burned}} foes", "burned foes"],
        ["{{tt|60 mph|100 km/h}}", "60 mph"],
        ["<sc>Pikachu</sc> sleeps", "Pikachu sleeps"],
        ["region of [[Hisui]], [[Hisui]]an", "region of Hisui, Hisuian"],
        ["the [[Ash's hat|hat]]", "the hat"],
        ["fight.{{tt|*|Only in HOME}}", "fight."],
        ["Froslass{{sic}} lives", "Froslass lives"],
        ["text <small>''(Version 1.0)''</small>", "text"],
        ["dash<!--U+2013 EN DASH in-game-->", "dash"],
    ])("turns %j into %j", (wikitext, plainText) => {
        expect(stripWikiMarkup(wikitext)).toBe(plainText);
    });
});

describe("readEntryVariants", () => {
    test("returns each <br>-separated reading", () => {
        const rawEntry = "Leaves. <small>''(Version 1.0)''</small><br>"
            + "Leaf. <small>''(Version 1.1)''</small>";
        expect(readEntryVariants(rawEntry)).toEqual(["Leaves.", "Leaf."]);
    });

    test("returns one reading per {{sup}} version choice", () => {
        const rawEntry = "from the{{sup/3|R}}/this{{sup/3|S}} host";
        expect(readEntryVariants(rawEntry))
            .toEqual(["from the host", "from this host"]);
    });

    test("handles a version choice of several words", () => {
        const rawEntry = "for lower-back{{sup/4|HG}}/lower back{{sup/4|SS}}"
            + " pain";
        expect(readEntryVariants(rawEntry))
            .toEqual(["for lower-back pain", "for lower back pain"]);
    });
});
