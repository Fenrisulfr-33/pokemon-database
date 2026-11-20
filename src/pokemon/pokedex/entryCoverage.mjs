import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import readJsonDir from "#genericFunctions/files/readJsonDir.js";

const POKEDEX_DIR = path.dirname(fileURLToPath(import.meta.url));
const ACQUISITION_DIR = path.join(POKEDEX_DIR, "dexes", "acquisition");
const DEXES_DIR = path.join(POKEDEX_DIR, "dexes", "dexes_objects");

const GAMES_BY_DEX_FILE = {
    "01-red-blue-yellow.json": ["re", "bl", "ye"],
    "02-gold-silver-crystal.json": ["go", "si", "cr"],
    "03-ruby-sapphire-emerald.json": ["ru", "sa", "em"],
    "04-firered-leafgreen.json": ["fr", "lg"],
    "05-diamond-pearl.json": ["di", "prl"],
    "06-platinum.json": ["pt"],
    "07-heartgold-soulsilver.json": ["hg", "ss"],
    "08-black-white.json": ["bk", "wh"],
    "09-black2-white2.json": ["bk2", "wh2"],
    "10-xy-central.json": ["x", "y"],
    "11-xy-coastal.json": ["x", "y"],
    "12-xy-mountain.json": ["x", "y"],
    "13-omega-ruby-alpha-sapphire.json": ["or", "as"],
    "14-sun-moon-alola.json": ["su", "mo"],
    "19-ultra-sun-ultra-moon-alola.json": ["us", "um"],
    "24-lets-go-pikachu-lets-go-eevee.json": ["lgp", "lge"],
    "25-sword-shield.json": ["sw", "sh"],
    "26-isle-of-armor.json": ["sw", "sh"],
    "27-crown-tundra.json": ["sw", "sh"],
    "28-legends-arceus.json": ["la"],
    "29-scarlet-violet.json": ["sc", "vi"],
    "30-teal-mask.json": ["sc", "vi"],
    "31-indigo-disk.json": ["sc", "vi"],
    "32-legends-za.json": ["za"],
};

export const GAMES_BY_LEARNSET_KEY = {
    rb: ["re", "bl"], ye: ["ye"], gs: ["go", "si"], cr: ["cr"],
    rs: ["ru", "sa"], em: ["em"], frlg: ["fr", "lg"],
    dp: ["di", "prl"], pt: ["pt"], hgss: ["hg", "ss"],
    bw: ["bk", "wh"], b2w2: ["bk2", "wh2"],
    xy: ["x", "y"], oras: ["or", "as"],
    sm: ["su", "mo"], usum: ["us", "um"], lgpe: ["lgp", "lge"],
    swsh: ["sw", "sh"], bdsp: ["bd", "shp"],
    la: ["la"], sv: ["sc", "vi"], za: ["za"],
};

const GAMES_BY_ENTRY_KEY = {
    ...GAMES_BY_LEARNSET_KEY,
    rse: ["ru", "sa", "em"],
    dpp: ["di", "prl", "pt"],
};

function readDexIds(fileName) {
    const dex = JSON.parse(
        fs.readFileSync(path.join(DEXES_DIR, fileName), "utf8")
    );
    return dex.map(({ pokemonId }) => pokemonId);
}

function addAll(map, key, values) {
    map.set(key, [...(map.get(key) ?? []), ...values]);
}

export function readDexIdsByGame() {
    const dexIdsByGame = new Map();
    for (const [fileName, games] of Object.entries(GAMES_BY_DEX_FILE)) {
        const dexIds = readDexIds(fileName);
        games.forEach((game) => addAll(dexIdsByGame, game, dexIds));
    }
    return dexIdsByGame;
}

export function readNoEntryGamesById() {
    const noEntryGamesById = new Map();
    for (const { games, noEntryPokemon = [] } of readJsonDir(ACQUISITION_DIR)) {
        noEntryPokemon.forEach((pokemonId) =>
            addAll(noEntryGamesById, pokemonId, games));
    }
    return noEntryGamesById;
}

function listEntryGames(pokemon) {
    return (pokemon.pokedexEntries ?? [])
        .flatMap(Object.keys)
        .flatMap((entryKey) => GAMES_BY_ENTRY_KEY[entryKey] ?? [entryKey]);
}

export function listDexGamesWithoutEntry(pokemon, dexIdsByGame) {
    const entryGames = new Set(listEntryGames(pokemon));
    return [...dexIdsByGame]
        .filter(([game, dexIds]) =>
            dexIds.includes(pokemon._id) && !entryGames.has(game))
        .map(([game]) => game);
}

export function listLearnsetGamesWithoutAcquisition(
    pokemon, learnset, noEntryGamesById
) {
    const coveredGames = new Set([
        ...listEntryGames(pokemon),
        ...(noEntryGamesById.get(pokemon._id) ?? []),
    ]);
    return Object.keys(learnset ?? {})
        .flatMap((learnsetKey) => GAMES_BY_LEARNSET_KEY[learnsetKey] ?? [])
        .filter((game) => !coveredGames.has(game));
}

export function groupGames(games) {
    const gameSet = new Set(games);
    return Object.entries(GAMES_BY_LEARNSET_KEY).flatMap(([key, group]) => {
        const present = group.filter((game) => gameSet.has(game));
        const isWholeGroup = present.length === group.length;
        return group.length > 1 && isWholeGroup ? [key] : present;
    });
}

function collectGamesByPokemon(pokedex, listGames) {
    return pokedex
        .map((pokemon) => ({
            _id: pokemon._id,
            games: groupGames(listGames(pokemon)),
        }))
        .filter(({ games }) => games.length > 0);
}

export function findDexGamesWithoutEntry(pokedex) {
    const dexIdsByGame = readDexIdsByGame();
    return collectGamesByPokemon(pokedex, (pokemon) =>
        listDexGamesWithoutEntry(pokemon, dexIdsByGame));
}

export function findLearnsetGamesWithoutAcquisition(pokedex, learnsets) {
    const noEntryGamesById = readNoEntryGamesById();
    const learnsetsById = new Map(
        learnsets.map((learnset) => [learnset._id, learnset])
    );
    return collectGamesByPokemon(pokedex, (pokemon) =>
        listLearnsetGamesWithoutAcquisition(
            pokemon, learnsetsById.get(pokemon._id), noEntryGamesById
        ));
}
