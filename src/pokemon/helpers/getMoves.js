import readJsonDir from "#genericFunctions/files/readJsonDir.js";
import { MOVES_ENTRIES_DIR } from "#helpers/paths.js";

function getMoves() {
    return readJsonDir(MOVES_ENTRIES_DIR);
}

export { getMoves };
