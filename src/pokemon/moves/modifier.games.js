import { loadMoves, loopAndRewriteFolder } from "#genericFunctions/files/index.js";
import { MOVES_GAMES_DIR } from "#helpers/paths.js";

/**
 * This file serves as a utility to modify files inside the moves/games directory.
 * It is meant to be run directly from the command line to update the data.
 *
 * Rewrites each game file into the shape documented in moves/GAMES.md:
 *   { pokemon_id, pokemon_name, game_key, moves: { <category>: [...] } }
 *
 * @Author Brendan Archer
 * @Date 2024-06-10
 * @Version 2.0.0
 */

// Older game files use retro-style move names (no space, old spelling, since
// renamed) that don't match the canonical name in moves/entries.
const LEGACY_MOVE_NAME_ALIASES = {
	"PoisonPowder": "Poison Powder",
	"SolarBeam": "Solar Beam",
	"BubbleBeam": "Bubble Beam",
	"Sand-Attack": "Sand Attack",
	"ThunderShock": "Thunder Shock",
	"DoubleSlap": "Double Slap",
	"Selfdestruct": "Self-Destruct",
	"SonicBoom": "Sonic Boom",
	"ViceGrip": "Vise Grip",
	"Vice Grip": "Vise Grip",
	"Hi Jump Kick": "High Jump Kick",
	"ThunderPunch": "Thunder Punch",
	"SmokeScreen": "Smokescreen",
	"Softboiled": "Soft-Boiled",
	"AncientPower": "Ancient Power",
	"DynamicPunch": "Dynamic Punch",
	"DragonBreath": "Dragon Breath",
	"Faint Attack": "Feint Attack",
	"ExtremeSpeed": "Extreme Speed",
	"GrassWhistle": "Grass Whistle",
	"FeatherDance": "Feather Dance",
	"SmellingSalt": "Smelling Salts",
};

// The extra field each category's move entries carry, and the raw source
// field on the existing data it's read from. Categories not listed here
// (egg, tutor, evolution, reminder, special-moves) get no extra field.
const EXTRA_FIELD_BY_CATEGORY = {
	"level-up": { field: "learned_at", source: "lvl", cast: Number },
	"hidden-machine": { field: "hm", source: "hm" },
	"technical-machine": { field: "tm", source: "tm" },
	"technical-record": { field: "tr", source: "tr" },
	"transfer-only": { field: "learned_method", source: "method" },
	"pre-evolution": { field: "learned_method", source: "method" },
	"special": { field: "learned_method", source: "method" },
};

const moveIdByName = new Map(loadMoves().map((move) => [move.name.english, move._id]));

/**
 * Derives the expected game key from a game file's name, e.g.
 * "17-lets-go-pikcahu-eevee.json" -> "lets-go-pikcahu-eevee"
 * @param {string} fileName
 * @returns {string}
 */
function getExpectedGameKey(fileName) {
	return fileName.replace(/^\d+-/, "").replace(/\.json$/, "");
}

/**
 * Looks up a move's _id by name, falling back to the legacy name alias table.
 * @param {string} name
 * @returns {number|undefined}
 */
function findMoveId(name) {
	const moveId = moveIdByName.get(name);
	if (moveId !== undefined) {
		return moveId;
	}
	const alias = LEGACY_MOVE_NAME_ALIASES[name];
	return alias ? moveIdByName.get(alias) : undefined;
}

/**
 * Builds a single move entry in the target shape: { move_id, move_name, ...extra }.
 * `move` may still be a plain name string (egg/tutor/etc in raw data) or an
 * object carrying category-specific fields (lvl, hm, tm, tr, method, _id).
 * @param {string|Object} move
 * @param {string} category
 * @param {string} fileName - for warning messages
 * @param {string} pokemonName - for warning messages
 * @returns {Object}
 */
function buildMoveEntry(move, category, fileName, pokemonName) {
	const name = typeof move === "string" ? move : move.name;
	const moveId = findMoveId(name);
	if (moveId === undefined) {
		console.warn(`Could not find move "${name}" (${fileName}, ${pokemonName}) in moves/entries`);
	}

	const entry = { move_id: moveId ?? null, move_name: name };

	const extra = EXTRA_FIELD_BY_CATEGORY[category];
	if (extra && typeof move === "object") {
		const rawValue = move[extra.source];
		entry[extra.field] = extra.cast ? extra.cast(rawValue) : rawValue;
	}

	return entry;
}

/**
 * Transforms one pokemon's raw game-file entry into the target shape.
 * @param {Object} pokemon - raw entry, keyed dynamically by game name
 * @param {string} expectedKey - the game key derived from the file name
 * @param {string} fileName - for warning messages
 * @returns {Object}
 */
function transformPokemon(pokemon, expectedKey, fileName) {
	const actualKey = Object.keys(pokemon).find((field) => field !== "id" && field !== "name");
	const learnset = (actualKey && pokemon[actualKey]) || {};

	const moves = Object.fromEntries(
		Object.entries(learnset).map(([category, moveList]) => [
			category,
			moveList.map((move) => buildMoveEntry(move, category, fileName, pokemon.name)),
		])
	);

	return {
		pokemon_id: pokemon.id,
		pokemon_name: pokemon.name,
		game_key: expectedKey,
		moves,
	};
}

function modifier() {
	loopAndRewriteFolder(MOVES_GAMES_DIR, (gameMoves, fileName) => {
		if (gameMoves[0]?.game_key) return;
		const expectedKey = getExpectedGameKey(fileName);
		return gameMoves.map((pokemon) => transformPokemon(pokemon, expectedKey, fileName));
	});
}

modifier();
