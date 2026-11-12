import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import readJsonDir from "#genericFunctions/files/readJsonDir.js";
import validateEntries from "#genericFunctions/schemaValidation.mjs";
import { getMoves } from "#helpers/getMoves.js";
import {
    LEARNSETS_ENTRIES_DIR,
    MOVES_ENTRIES_DIR,
} from "#helpers/paths.js";
import {
    findDuplicates,
    findMissingIds,
    listJsonFileNames,
    toKey,
} from "#helpers/testHelpers.js";
import { GAME_GENERATIONS } from "../constants/GAME_GENERATIONS.js";
import { GAME_KEYS } from "../constants/GAME_KEYS.js";
import schema from "./schema.json" with { type: "json" };

const CONTACT_FILE = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "CONTACT.md"
);

/** PokeAPI keeps the old "Vice Grip" spelling in the key. */
const KEY_EXCEPTIONS = { 11: "vice-grip" };

/** Generation 8 (Legends Arceus) and 9 moves have no meta in PokeAPI. */
const FIRST_GENERATION_WITHOUT_META = 8;

const DIRTY_TEXT_PATTERNS = {
    "line break": /[\n\r\f]/,
    "soft hyphen": /­/,
    "link markup": /\]\{/,
    "effect chance placeholder": /\$effect_chance/,
    "leading or trailing space": /^\s|\s$/,
};

/** Z-moves have a physical and a special entry with the same name. */
function isCategoryVariant(move) {
    return move.key.endsWith(`--${move.category}`);
}

function expectedKey(move) {
    if (KEY_EXCEPTIONS[move._id]) return KEY_EXCEPTIONS[move._id];
    const key = toKey(move.name.english);
    return isCategoryVariant(move) ? `${key}--${move.category}` : key;
}

function uniqueName(move) {
    const name = move.name.english;
    return isCategoryVariant(move) ? `${name} (${move.category})` : name;
}

function listTextGameKeys(move) {
    return [move.flavorText, move.effectChanges].flatMap((textByLanguage) =>
        Object.values(textByLanguage).flatMap(Object.keys)
    );
}

function listGameKeys(move) {
    return [...listTextGameKeys(move), ...Object.keys(move.changes)];
}

function listEffectTexts(effect) {
    return [effect.full, effect.shortEffect].filter(Boolean);
}

function listTexts(move) {
    const changeEffects = Object.values(move.changes)
        .filter((change) => change.effect)
        .flatMap((change) => listEffectTexts(change.effect));
    const textsByGame = [move.flavorText, move.effectChanges]
        .flatMap(Object.values)
        .flatMap(Object.values);
    return [...listEffectTexts(move.effect), ...changeEffects, ...textsByGame];
}

/** PokeAPI names use ’ where CONTACT.md uses ' (Let’s Snuggle Forever). */
function normalizeApostrophes(name) {
    return name.replace(/’/g, "'");
}

function readContactNames() {
    const rows = fs.readFileSync(CONTACT_FILE, "utf8").split(/\r?\n/);
    return rows
        .filter((row) => row.startsWith("|"))
        .map((row) => normalizeApostrophes(row.split("|")[1].trim()))
        .filter((name) => name !== "Move" && !/^-+$/.test(name));
}

function contactName(move) {
    return normalizeApostrophes(move.name.english);
}

function listLearnsetMoveIds(learnset) {
    const references = [];
    for (const [gameKey, methods] of Object.entries(learnset)) {
        if (gameKey === "_id") continue;
        for (const [method, rows] of Object.entries(methods)) {
            for (const row of rows) {
                references.push({ gameKey, method, moveId: row.at(-1) });
            }
        }
    }
    return references;
}

function listTextProblems(text) {
    return Object.entries(DIRTY_TEXT_PATTERNS)
        .filter(([, pattern]) => pattern.test(text))
        .map(([problem]) => problem);
}

function isRangeValid(minimum, maximum) {
    if (minimum === null || maximum === null) return minimum === maximum;
    return minimum <= maximum;
}

function listInvalidRanges(meta) {
    const ranges = {
        hits: [meta.minHits, meta.maxHits],
        turns: [meta.minTurns, meta.maxTurns],
    };
    return Object.entries(ranges)
        .filter(([, [minimum, maximum]]) => !isRangeValid(minimum, maximum))
        .map(([range]) => range);
}

const moves = getMoves();
const contactNamesOfMoves = new Set(moves.map(contactName));

describe("moves", () => {
    test("file names follow {_id}-{key}.json, with no extra files", () => {
        const expected = moves.map((move) => `${move._id}-${move.key}.json`);
        const actual = listJsonFileNames(MOVES_ENTRIES_DIR);
        expect(actual.sort()).toEqual(expected.sort());
    });

    test("every entry passes schema validation", () => {
        const failures = validateEntries(schema, moves);
        expect(failures.map((failure) => failure.entry._id)).toEqual([]);
    });

    test("keys are the english name without special characters", () => {
        const mismatches = moves
            .filter((move) => move.key !== expectedKey(move))
            .map((move) => `${move._id}: ${move.key} → ${expectedKey(move)}`);
        expect(mismatches).toEqual([]);
    });

    test("english names are unique, apart from Z-move variants", () => {
        expect(findDuplicates(moves.map(uniqueName))).toEqual([]);
    });

    test("ids are unique", () => {
        expect(findDuplicates(moves.map((move) => move._id))).toEqual([]);
    });

    test("keys are unique", () => {
        expect(findDuplicates(moves.map((move) => move.key))).toEqual([]);
    });

    test("ids run from 1 to the highest id with no gaps", () => {
        expect(findMissingIds(moves.map((move) => move._id))).toEqual([]);
    });

    test("game keys in text fields and changes are known games", () => {
        const knownGameKeys = new Set(Object.values(GAME_KEYS));
        const unknownGameKeys = new Set(
            moves.flatMap(listGameKeys).filter((key) => !knownGameKeys.has(key))
        );
        expect([...unknownGameKeys]).toEqual([]);
    });

    test("every game key has a generation", () => {
        const missing = Object.values(GAME_KEYS)
            .filter((gameKey) => !GAME_GENERATIONS[gameKey]);
        expect(missing).toEqual([]);
    });

    test("no game key is from before the move's generation", () => {
        const tooEarly = new Set();
        for (const move of moves) {
            for (const gameKey of listGameKeys(move)) {
                if (GAME_GENERATIONS[gameKey] < move.generation) {
                    tooEarly.add(`${move._id}-${move.key}: ${gameKey}`);
                }
            }
        }
        expect([...tooEarly]).toEqual([]);
    });

    test("every learnset move id has a move entry", () => {
        const knownIds = new Set(moves.map((move) => move._id));
        const unknown = [];
        for (const learnset of readJsonDir(LEARNSETS_ENTRIES_DIR)) {
            for (const reference of listLearnsetMoveIds(learnset)) {
                if (knownIds.has(reference.moveId)) continue;
                const { gameKey, method, moveId } = reference;
                unknown.push(`${learnset._id} ${gameKey}.${method}: ${moveId}`);
            }
        }
        expect(unknown).toEqual([]);
    });

    test("text has no PokeAPI markup or line breaks", () => {
        const dirty = new Set();
        for (const move of moves) {
            for (const problem of listTexts(move).flatMap(listTextProblems)) {
                dirty.add(`${move.key}: ${problem}`);
            }
        }
        expect([...dirty]).toEqual([]);
    });

    test("effect has both texts or neither", () => {
        const halfEmpty = moves
            .filter((move) => !move.effect.full !== !move.effect.shortEffect)
            .map((move) => move._id);
        expect(halfEmpty).toEqual([]);
    });
});

describe("moves power", () => {
    test("status moves have no power", () => {
        const withPower = moves
            .filter((move) => move.category === "status")
            .filter((move) => move.power !== null)
            .map((move) => `${move._id}-${move.key}: ${move.power}`);
        expect(withPower).toEqual([]);
    });

    test("damaging moves use null, not 0, for variable power", () => {
        const zeroPower = moves
            .filter((move) => move.category !== "status")
            .filter((move) => move.power === 0)
            .map((move) => `${move._id}-${move.key}`);
        expect(zeroPower).toEqual([]);
    });
});

describe("moves contact", () => {
    const contactNames = readContactNames();

    test("CONTACT.md has no duplicate moves", () => {
        expect(findDuplicates(contactNames)).toEqual([]);
    });

    test("every CONTACT.md move is a move entry", () => {
        const unknown = contactNames
            .filter((name) => !contactNamesOfMoves.has(name));
        expect(unknown).toEqual([]);
    });

    test("contact is true only for CONTACT.md moves", () => {
        const listed = new Set(contactNames);
        const mismatches = moves
            .filter((move) => move.contact !== listed.has(contactName(move)))
            .map((move) => `${move._id}-${move.key}: ${move.contact}`);
        expect(mismatches).toEqual([]);
    });

    test("status moves never make contact", () => {
        const statusContact = moves
            .filter((move) => move.contact && move.category === "status")
            .map((move) => move.key);
        expect(statusContact).toEqual([]);
    });
});

describe("moves meta", () => {
    test("meta is only missing for generation 8+ moves", () => {
        const missing = moves
            .filter((move) => move.meta === null)
            .filter((move) => move.generation < FIRST_GENERATION_WITHOUT_META)
            .map((move) => move.key);
        expect(missing).toEqual([]);
    });

    test("hit and turn ranges are both set or both null, min <= max", () => {
        const invalid = moves
            .filter((move) => move.meta)
            .flatMap((move) => listInvalidRanges(move.meta)
                .map((range) => `${move.key} ${range}`));
        expect(invalid).toEqual([]);
    });
});
