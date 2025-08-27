const evolutionIdList = require("./evolutionIdList.json");
const saveFile = require("../helperFunctions/saveFile");
const errors = {}; // the save file function requires an empty object to return errors
// TODO: Look into the savefile() and make it so the functions doesn't require a new empty object to be passed in.

/**
 * This function is mean to modify the evolutionIdList to fix
 * any issues found during testing that will take too much time
 * to fix manually
 * 
 * List of edits history
 * - Evolution Ids over the number 118 increased by one,
 *    this was because a evolution chain was missed during 
 *    initial creation of the list and everything needed to be moved up.
 */
const evolutionIdListModifier = evolutionIdList.map((evo) => {
  // if (evo.evolution !== null && evo.evolution > 118) {
  //   evo.evolution++;
  // }
  return evo;
});

saveFile(evolutionIdListModifier, `./evolutionIdListNew`, false, "Evolution Id List", errors);
