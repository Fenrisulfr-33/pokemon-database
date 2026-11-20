import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import readJsonDir from "#genericFunctions/files/readJsonDir.js";
import {
    LEARNSETS_ENTRIES_DIR,
    POKEDEX_ENTRIES_DIR,
} from "#helpers/paths.js";

const POKEDEX_DIR = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_FILE = path.join(POKEDEX_DIR, "DATA_CHECK.md");
const ACQUISITION_DIR = path.join(POKEDEX_DIR, "dexes", "acquisition");
const DEXES_DIR = path.join(POKEDEX_DIR, "dexes", "dexes_objects");

const DEX_FILES_BY_GAME_GROUP = [
    [["su", "mo"], ["14-sun-moon-alola.json"]],
    [["us", "um"], ["19-ultra-sun-ultra-moon-alola.json"]],
    [["sw", "sh"], [
        "25-sword-shield.json", "26-isle-of-armor.json",
        "27-crown-tundra.json",
    ]],
    [["sc", "vi"], [
        "29-scarlet-violet.json", "30-teal-mask.json",
        "31-indigo-disk.json",
    ]],
];

const GAMES_BY_LEARNSET_KEY = {
    rb: ["re", "bl"], ye: ["ye"], gs: ["go", "si"], cr: ["cr"],
    rs: ["ru", "sa"], em: ["em"], frlg: ["fr", "lg"],
    dp: ["di", "prl"], pt: ["pt"], hgss: ["hg", "ss"],
    bw: ["bk", "wh"], b2w2: ["bk2", "wh2"],
    xy: ["x", "y"], oras: ["or", "as"],
    sm: ["su", "mo"], usum: ["us", "um"], lgpe: ["lgp", "lge"],
    swsh: ["sw", "sh"], bdsp: ["bd", "shp"],
    la: ["la"], sv: ["sc", "vi"], za: ["za"],
};

const COMBINED_GAMES = {
    ...GAMES_BY_LEARNSET_KEY,
    rse: ["ru", "sa", "em"],
    dpp: ["di", "prl", "pt"],
};

const OTHER_FIELDS = [
    "evs", "growthRate", "eggGroups", "species",
    "catchRate", "baseFriendship", "eggCycles",
];

function isEmpty(value) {
    if (value === null || value === undefined || value === "") return true;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === "object") return Object.keys(value).length === 0;
    return false;
}

function readDexIds(fileNames) {
    const dexIds = fileNames.flatMap((fileName) => {
        const filePath = path.join(DEXES_DIR, fileName);
        const dex = JSON.parse(fs.readFileSync(filePath, "utf8"));
        return dex.map(({ pokemonId }) => pokemonId);
    });
    return new Set(dexIds);
}

function readDexIdsByGame() {
    const dexIdsByGame = new Map();
    for (const [games, fileNames] of DEX_FILES_BY_GAME_GROUP) {
        const dexIds = readDexIds(fileNames);
        games.forEach((game) => dexIdsByGame.set(game, dexIds));
    }
    return dexIdsByGame;
}

function readNoEntryGames() {
    const dexIdsByGame = readDexIdsByGame();
    const noEntryGamesById = new Map();
    for (const { games, pokemon } of readJsonDir(ACQUISITION_DIR)) {
        for (const pokemonId of pokemon) {
            const outsideDex = games.filter(
                (game) => !dexIdsByGame.get(game)?.has(pokemonId)
            );
            const listed = noEntryGamesById.get(pokemonId) ?? [];
            noEntryGamesById.set(pokemonId, [...listed, ...outsideDex]);
        }
    }
    return noEntryGamesById;
}

function listCoveredGames(pokemon, noEntryGamesById) {
    const entryGames = pokemon.pokedexEntries
        .flatMap(Object.keys)
        .flatMap((gameKey) => COMBINED_GAMES[gameKey] ?? [gameKey]);
    return [...entryGames, ...(noEntryGamesById.get(pokemon._id) ?? [])];
}

function describeMissingGames(learnset, pokemon, noEntryGamesById) {
    const covered = new Set(listCoveredGames(pokemon, noEntryGamesById));
    return Object.keys(learnset ?? {})
        .filter((learnsetKey) => GAMES_BY_LEARNSET_KEY[learnsetKey])
        .flatMap((learnsetKey) => {
            const games = GAMES_BY_LEARNSET_KEY[learnsetKey];
            const missing = games.filter((game) => !covered.has(game));
            const allMissing = missing.length === games.length;
            return allMissing && games.length > 1 ? [learnsetKey] : missing;
        });
}

function listMissingNameOrigin(pokemon) {
    if (pokemon.nameOrigin.length === 0) return ["nameOrigin"];
    const words = pokemon.nameOrigin
        .filter(([, meaning]) => meaning === "")
        .map(([word]) => word);
    return words.length ? [`nameOrigin meaning: ${words.join(", ")}`] : [];
}

function listMissing(pokemon, learnset, noEntryGamesById) {
    const missing = listMissingNameOrigin(pokemon);
    if (isEmpty(pokemon.pokedexEntries)) missing.push("pokedexEntries");
    const games = describeMissingGames(learnset, pokemon, noEntryGamesById);
    if (games.length) missing.push(`pokedexEntries games: ${games.join(", ")}`);
    if (pokemon.eggGroups?.includes(null)) missing.push("eggGroups null");
    const fields = OTHER_FIELDS.filter((field) => isEmpty(pokemon[field]));
    return [...missing, ...fields];
}

function buildRows(pokedex, learnsetsById) {
    const noEntryGamesById = readNoEntryGames();
    return pokedex
        .sort((first, second) => first._id - second._id)
        .map((pokemon) => ({
            pokemon,
            missing: listMissing(
                pokemon,
                learnsetsById.get(pokemon._id),
                noEntryGamesById
            ),
        }))
        .filter(({ missing }) => missing.length > 0);
}

function countBy(rows, label) {
    return rows.filter(({ missing }) =>
        missing.some((item) => item === label || item.startsWith(`${label}:`))
    ).length;
}

function renderSummary(rows, pokedex) {
    const labels = [
        "nameOrigin", "nameOrigin meaning", "pokedexEntries",
        "pokedexEntries games", "eggGroups null", ...OTHER_FIELDS,
    ];
    const noKorean = pokedex.filter((pokemon) => isEmpty(pokemon.name.korean));
    const lines = labels.map(
        (label) => `| ${label} | ${countBy(rows, label)} |`
    );
    lines.push(`| name.korean | ${noKorean.length} |`);
    return ["| Missing | Pokemon |", "| --- | ---: |", ...lines].join("\n");
}

function renderTable(rows) {
    const lines = rows.map(({ pokemon, missing }) =>
        `| ${pokemon._id} | ${pokemon.name.english} | ${missing.join("; ")} |`
    );
    return ["| _id | Name | Missing |", "| ---: | --- | --- |", ...lines]
        .join("\n");
}

function renderDocument(rows, pokedex) {
    return `# Pokedex data check

Generated by \`npm run pokedex:data-check\` from \`pokedex/entries\`.
Don't edit by hand; fix the entry files and run it again.

- **nameOrigin**: empty list. **nameOrigin meaning**: words with an
  empty meaning.
- **pokedexEntries games**: games in the pokemon's learnset with no
  entry, as \`KEYS.md\` keys. A group key (\`swsh\`) means both games
  are missing. Pokemon in a \`dexes/acquisition\` list aren't checked
  for that list's \`games\`, unless they're in that game's dex in
  \`dexes/dexes_objects\`: a pokemon in the dex needs an entry.
- **eggGroups null**: \`eggGroups\` has a \`null\` in it.
- \`name.korean\` is only in the summary: it's missing for most pokemon.
- \`gender\`, \`abilities.hidden\` and \`evolution\` can be null on
  purpose, so they aren't checked.

## Summary

${renderSummary(rows, pokedex)}

## By pokemon

${renderTable(rows)}
`;
}

export function writeDataCheck() {
    const pokedex = readJsonDir(POKEDEX_ENTRIES_DIR);
    const learnsetsById = new Map(
        readJsonDir(LEARNSETS_ENTRIES_DIR).map((learnset) =>
            [learnset._id, learnset])
    );
    const rows = buildRows(pokedex, learnsetsById);
    fs.writeFileSync(OUTPUT_FILE, renderDocument(rows, pokedex));
    console.log(`${rows.length} pokemon with missing data → ${OUTPUT_FILE}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) writeDataCheck();
