import { fetchData } from './APIrequest.mjs';
import { transformPokemonMoves, saveJsonFile } from './helpers.mjs';

const endpoint = "pokemon/";
const saveFolder = './pokemon_moves';
/**
 * 
 */
async function buildPokemonMoves() {
	console.log("Building pokemon...");
	// get all available keys whenever update occurs
	const availableKeys = new Set();

	// Go through each generation, fetch the data, modify, save
	for (let pokemon = 1; pokemon <= 1; pokemon++) {
		const data = await fetchData(endpoint + pokemon);
		// Comment out once all keys acquired
		for (const key of Object.keys(data)) {
			availableKeys.add(key);
		}

		// transform data
		const transformedData = transformPokemonMoves(data);

		const saveFile = `${saveFolder}/${pokemon}-${data.name}.json`;
		// Here you would save transformedData to your database or file system
		saveJsonFile(saveFile, transformedData);
	}
	console.log("Available keys:", Array.from(availableKeys));
}

async function run() {
	await buildPokemonMoves();
}

run().catch((error) => {
	console.error("Build pokemon error:", error);
});