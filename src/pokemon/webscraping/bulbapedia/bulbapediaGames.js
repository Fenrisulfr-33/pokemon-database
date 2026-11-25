import { GAME_KEYS } from "../../constants/GAME_KEYS.js";

/** Bulbapedia's game names (the `v=` parameter) → PokeAPI game names. */
const BULBAPEDIA_TO_POKEAPI_GAME = Object.freeze({
    "Red": "red",
    "Blue": "blue",
    "Yellow": "yellow",
    "Gold": "gold",
    "Silver": "silver",
    "Crystal": "crystal",
    "Ruby": "ruby",
    "Sapphire": "sapphire",
    "Emerald": "emerald",
    "FireRed": "firered",
    "LeafGreen": "leafgreen",
    "Diamond": "diamond",
    "Pearl": "pearl",
    "Platinum": "platinum",
    "HeartGold": "heartgold",
    "SoulSilver": "soulsilver",
    "Black": "black",
    "White": "white",
    "Black 2": "black-2",
    "White 2": "white-2",
    "X": "x",
    "Y": "y",
    "Omega Ruby": "omega-ruby",
    "Alpha Sapphire": "alpha-sapphire",
    "Sun": "sun",
    "Moon": "moon",
    "Ultra Sun": "ultra-sun",
    "Ultra Moon": "ultra-moon",
    "Let's Go Pikachu": "lets-go-pikachu",
    "Let's Go Eevee": "lets-go-eevee",
    "Sword": "sword",
    "Shield": "shield",
    "Brilliant Diamond": "brilliant-diamond",
    "Shining Pearl": "shining-pearl",
    "Legends: Arceus": "legends-arceus",
    "Scarlet": "scarlet",
    "Violet": "violet",
    "Legends: Z-A": "legends-za",
});

/** Games Bulbapedia lists that have no game key in KEYS.md. */
const IGNORED_BULBAPEDIA_GAMES = Object.freeze(
    new Set(["Stadium", "Stadium 2", "Pokopia"]),
);

/**
 * Combined keys used in pokedexEntries when every game in the group has
 * the same text. Largest groups first, so `dpp` wins over `dp`.
 */
const COMBINED_GAME_KEYS = Object.freeze({
    dpp: ["di", "prl", "pt"],
    rb: ["re", "bl"],
    rs: ["ru", "sa"],
    frlg: ["fr", "lg"],
    dp: ["di", "prl"],
    hgss: ["hg", "ss"],
    bw: ["bk", "wh"],
    b2w2: ["bk2", "wh2"],
    oras: ["or", "as"],
    lgpe: ["lgp", "lge"],
    bdsp: ["bd", "shp"],
});

const GAME_KEY_ORDER = Object.values(GAME_KEYS);

export function gameKeyForBulbapediaName(bulbapediaName) {
    const pokeApiName = BULBAPEDIA_TO_POKEAPI_GAME[bulbapediaName];
    return pokeApiName ? GAME_KEYS[pokeApiName] : null;
}

export function isIgnoredBulbapediaGame(bulbapediaName) {
    return IGNORED_BULBAPEDIA_GAMES.has(bulbapediaName);
}

export function expandGameKey(gameKey) {
    return COMBINED_GAME_KEYS[gameKey] ?? [gameKey];
}

/** Sort position of a game key, using its first game for combined keys. */
export function gameKeyOrder(gameKey) {
    return GAME_KEY_ORDER.indexOf(expandGameKey(gameKey)[0]);
}

function isCombinable(gameKeys, textByGame, usedGames, sameText) {
    if (!gameKeys.every((gameKey) => textByGame.has(gameKey))) {
        return false;
    }
    if (gameKeys.some((gameKey) => usedGames.has(gameKey))) {
        return false;
    }
    const firstText = textByGame.get(gameKeys[0]);
    return gameKeys.every((gameKey) =>
        sameText(textByGame.get(gameKey), firstText));
}

/**
 * Groups single-game texts into pokedexEntries keys, combining games
 * whose texts match (`di` + `prl` + `pt` → `dpp`).
 * @param {Map<string, string>} textByGame - single game key → text
 * @param {(first: string, second: string) => boolean} sameText
 * @returns {Array<[string, string]>} [gameKey, text] pairs in game order
 */
export function combineGameTexts(textByGame, sameText) {
    const usedGames = new Set();
    const combinedEntries = [];
    for (const [combinedKey, gameKeys] of Object.entries(COMBINED_GAME_KEYS)) {
        if (isCombinable(gameKeys, textByGame, usedGames, sameText)) {
            gameKeys.forEach((gameKey) => usedGames.add(gameKey));
            combinedEntries.push([combinedKey, textByGame.get(gameKeys[0])]);
        }
    }
    for (const [gameKey, text] of textByGame) {
        if (!usedGames.has(gameKey)) {
            combinedEntries.push([gameKey, text]);
        }
    }
    return combinedEntries.sort((firstEntry, secondEntry) =>
        gameKeyOrder(firstEntry[0]) - gameKeyOrder(secondEntry[0]));
}
