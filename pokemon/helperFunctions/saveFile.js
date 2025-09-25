const fs = require("fs");

/**
 * This function is to save files after
 * @param {Array} data - the list of objects 
 * @param {String} outputFile - destination of save file
 * @param {boolean} sorted - if you want the file sorted
 * @param {String} listName - abilities, moves, pokemon, etc...
 * @param {Object} errors - helps get errors and passes them at the end 
 */
const saveFile = (data, outputFile, sorted, listName, errors) => {
  let dataJSON = data;
  if (sorted) {
    dataJSON = data.sort((a, b) => {
      if (a._id < b._id) {
        return -1;
      }
    });
  }
  // Format the save file in a proper JSON format
  const saveData = JSON.stringify(dataJSON, null, 2);
  // console.log(`${listName} length: ${dataJSON.length}`);
  console.log(`${listName} join errors: ${errors}`);

  fs.writeFile(`${outputFile}.json`, saveData, (error) => {
    error ? console.error(error) : null;
    console.log(`${outputFile}.json saved.`);
  });
};

module.exports = saveFile;
