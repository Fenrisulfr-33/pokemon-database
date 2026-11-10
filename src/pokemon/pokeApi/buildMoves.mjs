import { fetchData } from './APIrequest.mjs';
import { amountOfMoves } from './CONSTANTS.mjs';
import { transformMoveData, saveJsonFile } from './helpers.mjs';

const endpoint = "move/";
const saveFolder = './moves';
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
async function buildMoves() {
	console.log("Building moves...");
	// get all available keys whenever update occurs
	const availableKeys = new Set();

	// Go through each generation, fetch the data, modify, save
	for (let move = 1; move <= amountOfMoves; move++) {
		const data = await fetchData(endpoint + move);
		// Comment out once all keys acquired
		for (const key of Object.keys(data)) {
			availableKeys.add(key);
		}

		// transform data
		const transformedData = transformMoveData(data);

		const saveFile = `${saveFolder}/${move}-${data.name}.json`;
		// Here you would save transformedData to your database or file system
		saveJsonFile(saveFile, transformedData);
	}
	console.log("Available keys:", Array.from(availableKeys));
}

async function run() {
	await buildMoves();
}

run().catch((error) => {
	console.error("Build moves error:", error);
});