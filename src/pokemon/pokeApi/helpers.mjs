import { writeFile, readFile } from 'fs';
import { games_order } from './CONSTANTS.mjs';


function saveJsonFile(filePath, data) {
	const jsonString = JSON.stringify(data, null, 4);
	writeFile(filePath, jsonString, 'utf8', (err) => {
		if (err) {
			console.error("Error writing file:", err);
		} else {
			console.log(`File successfully saved at ${filePath}`);
		}
	});
}

function readJsonFile(filePath) {
	return new Promise((resolve, reject) => {
		readFile(filePath, 'utf8', (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(JSON.parse(data));
			}
		});
	});
}

async function fetchAdditionalData(url, name) {
	try {
		const response = await fetch(url);
		return await response.json();
	} catch (error) {
		console.error(`Error fetching ${name} data:`, error);
		throw error;
	}
}

/**
 * Removes url key from the API response data and keeps only the names
 * @param {Array} data API response data containing name and language objects
 * @returns {Array} Cleaned data containing only the names and languages
 */
function cleanData(data) {
	return data.map(item => item.name);
}

/**
 * 
 * @param {Array} data 
 * @returns {Array} Cleaned data containing only the names and languages
 */
function cleanName(data) {
	return data.map(item => ({
		language: item.language.name,
		name: item.name
	}));
}

function cleanDescription(data) {
	return data.map(item => ({
		language: item.language.name,
		description: item.description
	}));
}

function cleanPokemonEntries(data) {
	return data.map(item => ({
		entry_number: item.entry_number,
		pokemon_species: item.pokemon_species.name
	}));
}

function cleanEffectEntries(data) {
	return data.map(item => ({
		language: item.language.name,
		effect: item.effect,
		short_effect: item.short_effect
	}));
}

function cleanEffectChangesEntries(data) {
	return data.map(item => ({
		language: item.language.name,
		effect: item.effect,
	}));
}

function cleanEffectChanges(data) {
	return data.map(item => ({
		game: item.version_group.name,
		effect_entries: cleanEffectChangesEntries(item.effect_entries),
	}));
}

function cleanPokemonData(data) {
	return data.map(item => ({
		is_hidden: item.is_hidden,
		slot: item.slot,
		pokemon: item.pokemon.name, // this is lowercase? key
	}));
}

/**
 * Used for the pokemon/{id or name} endpoint
 * pokemon.abilities
 * 
 * @param {Array} data Array of ability objects from the API response
 * @returns {Array} Cleaned data containing only the relevant ability information
 */
function cleanPokemonAbilities(data) {
	return data.map(item => ({
		ability: item.ability.name,
		is_hidden: item.is_hidden,
		slot: item.slot
	}));
}

/**
 * Used for the pokemon/{id or name} endpoint
 * pokemon.past_abilities
 * 
 * @param {Array} data Array of past ability objects from the API response
 * @returns {Array} Cleaned data containing only the relevant past ability information
 */
function cleanPokemonPastAbilities(data) {
	return data.map(item => ({
		generation: item.generation.name,
		abilities: item.abilities.map(ability => ({
			ability: ability.ability,
			is_hidden: ability.is_hidden,
			slot: ability.slot
		}))
	}));
}

function cleanPokemonGameIndices(data) {
	return data.map(item => ({
		game_index: item.game_index,
		version: item.version.name
	}));
}

function cleanPokemonTypes(data) {
	return data.map(item => ({
		slot: item.slot,
		type: item.type.name
	}));
}


/**
 * 
 * @param {*} data 
 * @returns 
 */
function cleanPokemonMovesVersionGroupDetails(data) {
	return data.map(detail => ({
		level_learned_at: detail.level_learned_at,
		move_learn_method: detail.move_learn_method.name,
		version_group: detail.version_group.name,
		order: detail.order,
	}));
}


/**
 * 
 * @param {*} data 
 * @returns 
 */
function cleanPokemonMoves(data) {
	return data.map(item => ({
		move: item.move.name,
		version_group_details: cleanPokemonMovesVersionGroupDetails(item.version_group_details)
	}));
}

function cleanPokemonStats(data) {
	return data.map(item => ({
		base_stat: item.base_stat,
		stat: item.stat.name
	}));
}

function convertPokemonStatsToEffortValues(data) {
	return data.map(item => ({
		stat: item.stat.name,
		effort: item.effort
	}));
}

function cleanPokemonHeldItems(data) {
	return data.map(item => ({
		item: item.item.name,
		version_details: item.version_details.map(detail => ({
			rarity: detail.rarity,
			version: detail.version.name
		}))
	}));
}

function cleanPokemonEggGroups(data) {
	return data.map(item => ({
		egg_group: item.name
	}));
}

function cleanPokemonPokedexNumbers(data) {
	return data.map(item => ({
		entry_number: item.entry_number,
		pokedex: item.pokedex.name
	}));
}

function cleanFlavorText(data) {
	return data.map(item => ({
		language: item.language.name,
		flavor_text: item.flavor_text
	}));
}

function cleanPokemonFlavorTextEntries(data) {
	return data.map(item => ({
		flavor_text: item.flavor_text,
		language: item.language.name,
		version: item.version.name
	}));
}

function getPokemonSpecies(data) {
	return {
		gender_rate: data.gender_rate,
		capture_rate: data.capture_rate,
		base_happiness: data.base_happiness,
		is_baby: data.is_baby,
		is_legendary: data.is_legendary,
		is_mythical: data.is_mythical,
		hatch_counter: data.hatch_counter,
		has_gender_differences: data.has_gender_differences,
		forms_switchable: data.forms_switchable,
		growth_rate: data.growth_rate.name,
		pokedex_numbers: cleanPokemonPokedexNumbers(data.pokedex_numbers),
		egg_groups: cleanPokemonEggGroups(data.egg_groups),
		flavor_text_entries: cleanPokemonFlavorTextEntries(data.flavor_text_entries),

	};
}

/**
 * The API provides weight in hectograms, so divide by 10 to get kilograms
 * 
 * @param {Integer} weight Weight in hectograms
 * @returns {Double} Weight in kilograms
 */
function convertWeightIntoKilograms(weight) {
	return weight / 10;
}

/**
 * The API provides weight in hectograms, so divide by 10 and multiply by 2.20462 to get pounds
 * Round the the nearest 1 decimal
 * 
 * @param {Integer} weight Weight in hectograms
 * @returns {Double} Weight in pounds
 */
function convertWeightIntoPounds(weight) {
	return Math.round((weight / 10 * 2.20462) * 10) / 10;
}

/**
 * The API provides height in decimeters, multiple by 10 to get centimeters,
 * then divide by 100 to get meters
 * 
 * @param {Integer} height Height in decimeters
 * @returns {Double} Height in meters
 */
function convertHeightIntoMeters(height) {
	return height * 10 / 100;
}

/**
 * The API provides height in decimeters, convert it to feet and inches
 * 
 * @param {Integer} height Height in decimeters
 * @returns {Object} Height in feet and inches
 */
function convertHeightIntoFeetInches(height) {
	const totalInches = height * 10 / 2.54; // convert decimeters to inches
	const feet = Math.floor(totalInches / 12);
	const inches = Math.round(totalInches % 12);
	return { feet, inches };
}



/**
 * Used for ./buildGenerations.mjs
 * 
 * @param {Object} data API response data for a generation
 * @returns {Object} Transformed generation data
 */
function transformGenerationData(data) {
	return {
		_id: data.id,
		name: data.name,
		abilities: cleanData(data.abilities),
		main_region: data.main_region.name,
		moves: cleanData(data.moves),
		names: cleanName(data.names),
		pokemon_species: cleanData(data.pokemon_species),
		types: cleanData(data.types),
		version_groups: cleanData(data.version_groups)
	};
}

function transformPokedexData(data) {
	return {
		_id: data.id,
		name: data.name,
		is_main_series: data.is_main_series,
		descriptions: cleanDescription(data.descriptions),
		names: cleanName(data.names),
		pokemon_entries: cleanPokemonEntries(data.pokemon_entries),
		region: data.region ? data.region.name : null,
		version_groups: cleanData(data.version_groups)
	};
}

function transformAbilityData(data) {
	return {
		_id: data.id,
		name: data.name, // key?
		generation: data.generation.name,
		names: cleanName(data.names),
		effect_entries: cleanEffectEntries(data.effect_entries),
		effect_changes: cleanEffectChanges(data.effect_changes),
		// flavor_text_entries
		pokemon: cleanPokemonData(data.pokemon)
	}
}

function transformMoveData(data) {
	return {
		_id: data.id,
		name: data.name,
		accuracy: data.accuracy,
		effect_chance: data.effect_chance,
		pp: data.pp,
		priority: data.priority,
		power: data.power,
		type: data.type.name,
		generation: data.generation.name,
		names: cleanName(data.names),
		effect_entries: cleanEffectEntries(data.effect_entries),
		effect_changes: cleanEffectChanges(data.effect_changes),
		flavor_text_entries: cleanFlavorText(data.flavor_text_entries),
		damage_class: data.damage_class.name,
		target: data.target.name,
		pokemon: cleanData(data.learned_by_pokemon)
	};
}

function transformPokemonData(data) {
	// Fetch pokemon-species data
	const pokemonSpeciesData = fetchAdditionalData(`https://pokeapi.co/api/v2/pokemon-species/${data.id}/`, 'Species').then(res => res.json());


	return {
		_id: data.id,
		name: data.name,
		is_default: data.is_default,
		order: data.order,
		height: data.height,
		weight: data.weight,
		types: cleanPokemonTypes(data.types),
		abilities: cleanPokemonAbilities(data.abilities),
		past_abilities: cleanPokemonPastAbilities(data.past_abilities),
		// forms - need more info
		game_indices: cleanPokemonGameIndices(data.game_indices),
		stats: cleanPokemonStats(data.stats),
		effort_values: convertPokemonStatsToEffortValues(data.stats),
		held_items: cleanPokemonHeldItems(data.held_items),
		// species - species name only, maybe need to check another endpoint
		// sprites - revisit
		// cries - revisit
		// past_stats - revisit
		moves: cleanPokemonMoves(data.moves),
	};
}


function cleanPokemonMovesAndFormat(moves) {
	const games = {};
	moves.forEach((move) => {
		move.version_group_details.forEach((detail) => {
			const versionGroup = detail.version_group.name;
			const learnMethod = detail.move_learn_method.name;
			if (!games[versionGroup]) {
				games[versionGroup] = {};
			}
			if (!games[versionGroup][learnMethod]) {
				games[versionGroup][learnMethod] = [];
			}
			const moveObject = {
				name: move.move.name
			};
			if (learnMethod === 'level-up') {
				moveObject.level = detail.level_learned_at;
			}
			games[versionGroup][learnMethod].push(moveObject);
		});
	});
	return sortGamesOrder(games);
}

function sortGamesOrder(games) {
	return Object.fromEntries(
		games_order
			.filter(key => key in games) // Only keep keys that exist
			.map(key => [key, games[key]])
	);
}

function transformPokemonMoves(data) {
	return {
		_id: data.id,
		key: data.name,
		moves: cleanPokemonMovesAndFormat(data.moves)
	};
}

export {
	transformGenerationData,
	transformPokedexData,
	transformAbilityData,
	transformMoveData,
	transformPokemonData,
	transformPokemonMoves,
	saveJsonFile,
	readJsonFile
};