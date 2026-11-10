import { fetchData } from './APIrequest.mjs';
import { transformPokemonData, saveJsonFile } from './helpers.mjs';

const endpoint = "pokemon/";
const saveFolder = './forms';
/**
 * Moves have the following keys as of the time of this build.
 * _id
 * name
 * accuracy
 * effect_chance
 * pp
 * priority
 * power
 * type
 * generation
 * names
 * effect_entries
 * effect_changes
 * flavor_text_entries
 * damage_class
 * target
 * pokemon - pokemon that learn the move, doesn't specifically indicate how they learn it, or what game
 */
async function buildForms() {
	console.log("Building pokemon...");
	// get all available keys whenever update occurs
	const availableKeys = new Set();

	// Go through each generation, fetch the data, modify, save
	for (let pokemon = 10001; pokemon <= 10326; pokemon++) {
		const data = await fetchData(endpoint + pokemon);
		// Comment out once all keys acquired
		for (const key of Object.keys(data)) {
			availableKeys.add(key);
		}

		// transform data
		const transformedData = transformPokemonData(data);

		const saveFile = `${saveFolder}/${pokemon}-${data.name}.json`;
		// Here you would save transformedData to your database or file system
		saveJsonFile(saveFile, transformedData);
	}
	console.log("Available keys:", Array.from(availableKeys));
}

async function run() {
	await buildForms();
}

run().catch((error) => {
	console.error("Build forms error:", error);
});