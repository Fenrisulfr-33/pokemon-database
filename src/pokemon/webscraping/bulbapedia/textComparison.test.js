import { combineGameTexts } from "./bulbapediaGames.js";
import {
    differsOnlyInPunctuation,
    isSameText,
    mergeIntoOurStyle,
    pickClosestVariant,
} from "./textComparison.js";

describe("isSameText", () => {
    test("ignores case, curly apostrophes and repeated spaces", () => {
        expect(isSameText("POKéMON’s  tail", "Pokémon's tail")).toBe(true);
    });

    test("treats a different word as different", () => {
        expect(isSameText("its tails", "its tail")).toBe(false);
    });
});

describe("differsOnlyInPunctuation", () => {
    test("is true for a line-break hyphen", () => {
        expect(differsOnlyInPunctuation("kindhearted", ["kind-hearted"]))
            .toBe(true);
    });

    test("is false when a word changes", () => {
        expect(differsOnlyInPunctuation("ha waves", ["alpha waves"]))
            .toBe(false);
    });
});

describe("pickClosestVariant", () => {
    test("picks the reading with the most words in common", () => {
        const variants = ["Totally different text.", "It has a red tail."];
        expect(pickClosestVariant("It has a blue tail.", variants))
            .toBe("It has a red tail.");
    });
});

describe("mergeIntoOurStyle", () => {
    test("keeps our in-game capitals for unchanged words", () => {
        expect(mergeIntoOurStyle("This legendary Chinese POKEMON is",
            "This legendary Chinese Pokémon is"))
            .toBe("This legendary Chinese POKéMON is");
    });

    test("writes changed words with our curly apostrophes", () => {
        expect(mergeIntoOurStyle("It’s cold, so it", "It's cold out, so it"))
            .toBe("It’s cold out, so it");
    });

    test("fixes spacing even though spacing is ignored when comparing", () => {
        expect(mergeIntoOurStyle("blaz ing fur", "blazing fur"))
            .toBe("blazing fur");
    });

    test("returns Bulbapedia's text when nothing is shared", () => {
        expect(mergeIntoOurStyle("one two", "three four"))
            .toBe("three four");
    });
});

describe("combineGameTexts", () => {
    test("combines Diamond, Pearl and Platinum when all match", () => {
        const textByGame = new Map([["di", "A"], ["prl", "a"], ["pt", "A"]]);
        expect(combineGameTexts(textByGame, isSameText))
            .toEqual([["dpp", "A"]]);
    });

    test("keeps games separate when their texts differ", () => {
        const textByGame = new Map([["sh", "B"], ["sw", "A"]]);
        expect(combineGameTexts(textByGame, isSameText))
            .toEqual([["sw", "A"], ["sh", "B"]]);
    });

    test("combines the matching pair inside a partly matching group", () => {
        const textByGame = new Map([["di", "A"], ["prl", "A"], ["pt", "B"]]);
        expect(combineGameTexts(textByGame, isSameText))
            .toEqual([["dp", "A"], ["pt", "B"]]);
    });
});
