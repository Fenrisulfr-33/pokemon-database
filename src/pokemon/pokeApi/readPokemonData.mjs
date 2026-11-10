import { readJsonFile } from './helpers.mjs';

async function testBulbasaur() {
	const pokemon = await readJsonFile('./pokemon/1-bulbasaur.json');
	
	// show total amount of moves, compare to current DB
	console.log(`Total moves for Bulbasaur: ${pokemon.moves.length}`);

	const games = {}

	pokemon.moves.forEach((move) => {
		move.version_group_details.forEach((detail) => {
			const versionGroup = detail.version_group;
			if (!games[versionGroup]) {
				games[versionGroup] = {};
			}
			if (!games[versionGroup][detail.move_learn_method]) {
				games[versionGroup][detail.move_learn_method] = [];
			}

			const moveObject = {
				
			}
			games[versionGroup][detail.move_learn_method].push(move.move);
		});
		// console.log(`Move: ${move.move.name}`);
	});

	const originalObj = { b: 2, a: 1 }; // 'c' is missing
const specificOrder = ['a', 'b', 'c'];

const orderedObj = Object.fromEntries(
  specificOrder
    .filter(key => key in originalObj) // Only keep keys that exist
    .map(key => [key, originalObj[key]])
);

	// console.log(Object.keys(games));
	for (const versionGroup in games) {
		for (const method in games[versionGroup]) {
			console.log(`Version group: ${versionGroup}, Method: ${method}, Moves: ${games[versionGroup][method].length}`);
		}
	}
}

testBulbasaur();