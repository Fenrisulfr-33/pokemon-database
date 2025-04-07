const evoIdList = require("./evoIdList.json");
const saveFile = require("../helperFunctions/saveFile");
const errors = {};

const evoIdListNew = evoIdList.map((evo) => {
  if (evo.evolution !== null && evo.evolution > 118) {
    evo.evolution++;
  }
  return evo;
});

saveFile(evoIdListNew, `./evoIdList2`, false, "Evolution Id List", errors);
