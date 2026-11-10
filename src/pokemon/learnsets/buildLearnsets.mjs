import fs from "fs";
import path from "path";
import {
    MOVES_GAMES_DIR,
    POKEDEX_ENTRIES_DIR,
    LEARNSETS_ENTRIES_DIR,
} from "#helpers/paths.js";
import readJsonDir from "#genericFunctions/files/readJsonDir.js";

const GAME_KEYS = {
    "red-blue": "rb",
    "yellow": "ye",
    "gold-silver": "gs",
    "crystal": "cr",
    "ruby-sapphire": "rs",
    "fire-red-leaf-green": "frlg",
    "emerald": "em",
    "diamond-pearl": "dp",
    "platinum": "pt",
    "heart-gold-soul-silver": "hgss",
    "black-white": "bw",
    "black-2-white-2": "b2w2",
    "x-y": "xy",
    "omega-ruby-alpha-sapphire": "oras",
    "sun-moon": "sm",
    "ultra-sun-ultra-moon": "usum",
    "lets-go-pikachu-eevee": "lgpe",
    "sword-shield": "swsh",
    "brilliant-diamond-shining-pearl": "bdsp",
    "legends-arceus": "la",
    "scarlet-violet": "sv",
    "legends-za": "za",
};

const LEARNED_METHOD_KEYS = {
    "Level up": "lv",
    "TM": "tm",
    "HM": "hm",
    "Move tutor": "tu",
    "Breeding": "eg",
    "Evolution": "ev",
    "Pre-evolution": "pe",
    "Special": "sp",
};

const SPECIAL_METHOD_KEYS = {
    "From Zygarde Cube": "zc",
    "Breed Pikachu/Raichu holding Light Ball": "lbe",
    "On form change": "fc",
};

const MOVE_ONLY_METHODS = {
    "egg": "eg",
    "tutor": "tu",
    "evolution": "ev",
    "reminder": "rm",
    "special-moves": "spm",
};

const TRANSFER_PATTERN = /^Generation (\d+) — (.+)$/;

function lookup(table, key, label) {
    if (!(key in table)) {
        throw new Error(`Unknown ${label}: "${key}"`);
    }
    return table[key];
}

function toLevelUp(move) {
    if (move.learned_at === null) {
        return ["ev", [move.move_id]];
    }
    return ["lv", [move.learned_at, move.move_id]];
}

function toTransferOnly(move) {
    const match = move.learned_method.match(TRANSFER_PATTERN);
    if (!match) {
        throw new Error(`Bad transfer method: "${move.learned_method}"`);
    }
    const [, generation, method] = match;
    const methodKey = lookup(LEARNED_METHOD_KEYS, method, "learned_method");
    return ["to", [Number(generation), methodKey, move.move_id]];
}

function toSpecial(move) {
    const splitKey = SPECIAL_METHOD_KEYS[move.learned_method];
    if (splitKey) {
        return [splitKey, [move.move_id]];
    }
    return ["sp", [move.learned_method, move.move_id]];
}

function toPreEvolution(move) {
    const methodKey = lookup(
        LEARNED_METHOD_KEYS,
        move.learned_method,
        "learned_method",
    );
    return ["pe", [methodKey, move.move_id]];
}

const CONVERTERS = {
    "level-up": toLevelUp,
    "technical-machine": (move) => ["tm", [move.tm, move.move_id]],
    "hidden-machine": (move) => ["hm", [move.hm, move.move_id]],
    "technical-record": (move) => ["tr", [move.tr, move.move_id]],
    "pre-evolution": toPreEvolution,
    "transfer-only": toTransferOnly,
    "special": toSpecial,
};

function convertMove(method, move) {
    if (method in MOVE_ONLY_METHODS) {
        return [MOVE_ONLY_METHODS[method], [move.move_id]];
    }
    return lookup(CONVERTERS, method, "learn method")(move);
}

function convertGameMoves(moves) {
    const game = {};
    for (const [method, list] of Object.entries(moves)) {
        for (const move of list) {
            const [key, tuple] = convertMove(method, move);
            game[key] ??= [];
            game[key].push(tuple);
        }
    }
    return game;
}

function buildLearnsetsById(gameFiles) {
    const learnsets = new Map();
    for (const entries of gameFiles) {
        for (const { pokemon_id, pokemon_name, game_key, moves } of entries) {
            const gameKey = lookup(GAME_KEYS, game_key, "game_key");
            if (!learnsets.has(pokemon_id)) {
                learnsets.set(pokemon_id, { name: pokemon_name, doc: {} });
            }
            learnsets.get(pokemon_id).doc[gameKey] = convertGameMoves(moves);
        }
    }
    return learnsets;
}

function readPokedexFileNames() {
    const fileNames = new Map();
    for (const file of fs.readdirSync(POKEDEX_ENTRIES_DIR)) {
        const id = Number(file.split("-")[0]);
        fileNames.set(id, path.basename(file, ".json"));
    }
    return fileNames;
}

function stringifyLearnset(learnset) {
    const json = JSON.stringify(learnset, null, 4);
    return json.replace(/\[\s+([^[\]{}]*?)\s+\]/g, (_match, inner) =>
        `[${inner.split(/,\s+/).join(", ")}]`);
}

function writeLearnsets(learnsets) {
    const pokedexFileNames = readPokedexFileNames();
    fs.mkdirSync(LEARNSETS_ENTRIES_DIR, { recursive: true });
    for (const [id, { name, doc }] of learnsets) {
        const fileName = pokedexFileNames.get(id) ?? `${id}-${name}`;
        const filePath = path.join(LEARNSETS_ENTRIES_DIR, `${fileName}.json`);
        const learnset = { _id: id, ...doc };
        fs.writeFileSync(filePath, `${stringifyLearnset(learnset)}\n`);
    }
}

function main() {
    const learnsets = buildLearnsetsById(readJsonDir(MOVES_GAMES_DIR));
    writeLearnsets(learnsets);
    console.log(`Wrote ${learnsets.size} learnsets.`);
}

main();
