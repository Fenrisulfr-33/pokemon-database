import { applyPokedexEntryDifference } from "./applyPokedexEntryDifference.js";
import { findPokedexEntryDifferences } from "./findPokedexEntryDifferences.js";
import { parsePokedexEntries } from "./parsePokedexEntries.js";

const SPECIES_PAGE = [
    "===Pokédex entries===",
    "{{Dex/Header|type=Normal}}",
    "{{Dex/Gen/1|gen=I|reg1=Kanto}}",
    "{{Dex/Entry2|v=Red|v2=Blue|entry=Bites {{ScPkmn}} hard.}}",
    "{{Dex/Entry1|v=Stadium|entry=Not a keyed game.}}",
    "|}",
    "{{Dex/Gen/1|gen=VII|reg1=Alola}}",
    "{{Dex/Entry1|v=Sun|entry=Base sun text.}}",
    "{{Dex/Form|Alolan Form}}",
    "{{Dex/Entry1|v=Sun|entry=Alolan sun text.}}",
    "{{Dex/Gen/1|gen=VIII|reg1=Galar}}",
    "{{Dex/Form|Midday Form}}",
    "{{Dex/Entry1|v=Sword|entry=Midday sword text.}}",
    "{{Dex/Form|Midnight Form}}",
    "{{Dex/Entry1|v=Sword|entry=Midnight sword text.}}",
    "{{Dex/Footer}}",
    "{{Availability/Entry1|v=Sun|area=Not an entry}}",
].join("\n");

function recordWith(pokedexEntries) {
    return { name: { english: "Testmon" }, pokedexEntries };
}

function differencesFor(pokedexEntries) {
    return findPokedexEntryDifferences(recordWith(pokedexEntries),
        "1-testmon.json", SPECIES_PAGE);
}

describe("parsePokedexEntries", () => {
    const parsed = parsePokedexEntries(SPECIES_PAGE);

    test("reads only the base form's entries for keyed games", () => {
        expect(Object.fromEntries(parsed.entries)).toEqual({
            re: ["Bites Pokémon hard."],
            bl: ["Bites Pokémon hard."],
            su: ["Base sun text."],
            sw: ["Midday sword text."],
        });
    });

    test("treats a generation's first named form as the default", () => {
        expect(parsed.entryLabels.get("sw")).toBe("Midday Form");
    });

    test("keeps other forms' entries with their labels", () => {
        expect(parsed.otherForms.get("su")).toEqual(
            [{ label: "Alolan Form", variants: ["Alolan sun text."] }]);
    });
});

describe("findPokedexEntryDifferences", () => {
    const matchingEntries = [
        { rb: "BITES POKéMON HARD." },
        { su: "Base sun text." },
        { sw: "Midday sword text." },
    ];

    test("finds nothing when every entry matches", () => {
        expect(differencesFor(matchingEntries)).toEqual([]);
    });

    test("reports a changed word as wording in our style", () => {
        const [difference] = differencesFor([
            { rb: "BITES POKéMON SOFTLY." }, ...matchingEntries.slice(1),
        ]);
        expect(difference).toMatchObject({ id: "1-testmon/rb",
            kind: "wording", bulbapedia: "BITES POKéMON HARD." });
    });

    test("reports a missing game with a combined key", () => {
        const [difference] = differencesFor(matchingEntries.slice(1));
        expect(difference).toMatchObject({ gameKey: "rb", kind: "missing",
            bulbapedia: "Bites Pokémon hard." });
    });

    test("reports another form's text as kind form", () => {
        const [difference] = differencesFor([
            ...matchingEntries.slice(0, 2), { sw: "Midnight sword text." },
        ]);
        expect(difference.kind).toBe("form");
    });

    test("reports an entry for a game Bulbapedia lacks as extra", () => {
        const [difference] = differencesFor([
            ...matchingEntries, { za: "Unknown text." },
        ]);
        expect(difference).toMatchObject({ gameKey: "za", kind: "extra" });
    });

    test("can't apply a combined key whose games differ", () => {
        const page = SPECIES_PAGE.replace(
            "{{Dex/Entry2|v=Red|v2=Blue|entry=Bites {{ScPkmn}} hard.}}",
            "{{Dex/Entry1|v=Red|entry=Red.}}{{Dex/Entry1|v=Blue|entry=Blue.}}");
        const [difference] = findPokedexEntryDifferences(
            recordWith(matchingEntries), "1-testmon.json", page);
        expect(difference).toMatchObject({ kind: "split", canApply: false });
    });
});

const FILE_TEXT = [
    "{",
    "    \"pokedexEntries\": [",
    "        { \"rb\": \"Old.\" },",
    "        { \"sw\": \"Sword.\" }",
    "    ]",
    "}",
].join("\r\n");

function apply(kind, gameKey, ours, bulbapedia) {
    return applyPokedexEntryDifference(FILE_TEXT,
        { id: `x/${gameKey}`, kind, gameKey, ours, bulbapedia });
}

describe("applyPokedexEntryDifference", () => {
    test("replaces only the entry's text", () => {
        expect(apply("wording", "rb", "Old.", "New."))
            .toBe(FILE_TEXT.replace("Old.", "New."));
    });

    test("removes the last entry and its predecessor's comma", () => {
        expect(JSON.parse(apply("extra", "sw", "Sword.", null)))
            .toEqual({ pokedexEntries: [{ rb: "Old." }] });
    });

    test("removes the first entry and keeps valid JSON", () => {
        expect(JSON.parse(apply("extra", "rb", "Old.", null)))
            .toEqual({ pokedexEntries: [{ sw: "Sword." }] });
    });

    test("inserts a missing entry in game order", () => {
        expect(JSON.parse(apply("missing", "su", null, "Sun.")))
            .toEqual({ pokedexEntries:
                [{ rb: "Old." }, { su: "Sun." }, { sw: "Sword." }] });
    });

    test("keeps the file's CRLF line endings", () => {
        const newText = apply("missing", "za", null, "Z-A.");
        expect(newText.split("\n").every((line, index, lines) =>
            index === lines.length - 1 || line.endsWith("\r"))).toBe(true);
    });

    test("fills an empty pokedexEntries list", () => {
        const newText = applyPokedexEntryDifference(
            "{\n    \"pokedexEntries\": []\n}",
            { id: "x/rb", kind: "missing", gameKey: "rb", bulbapedia: "A." });
        expect(JSON.parse(newText)).toEqual({ pokedexEntries: [{ rb: "A." }] });
    });

    test("refuses split differences", () => {
        expect(() => apply("split", "rb", "Old.", "a / b")).toThrow("by hand");
    });
});
