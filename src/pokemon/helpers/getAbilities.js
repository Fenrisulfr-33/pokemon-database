import readJsonDir from "#genericFunctions/files/readJsonDir.js";
import { ABILITIES_ENTRIES_DIR } from "#helpers/paths.js";

function getAbilities() {
    return readJsonDir(ABILITIES_ENTRIES_DIR);
}

export { getAbilities };
