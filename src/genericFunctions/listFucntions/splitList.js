/**
 * @Author Brendan Archer
 * @Date 2024-06-10
 * @version 1.0.0
 * @Description
 * Split a .json list into individual .json files for each entry.
 */

// The list you want to split goes here
// const list = require('./00-temdex.json');

const splitList = () => {
	const listArray = Object.values(list);
	const listLength = listArray.length;
	for (let i = 0; i < listLength; i++) {
		// Obtain the individual entry from the list
		const entry = listArray[i];

		// Get any variables for file naming

		// Create a file name for the individual entry
		// e.g. 00-filename.json

		// Write the individual entry to a new .json file
		//fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
	}
};

splitList();
