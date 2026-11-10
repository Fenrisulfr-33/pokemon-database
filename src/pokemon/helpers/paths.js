import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const MOVES_ENTRIES_DIR = path.join(__dirname, "../moves/entries");
const POKEDEX_ENTRIES_DIR = path.join(__dirname, "../pokedex/entries");
const ABILITIES_ENTRIES_DIR = path.join(__dirname, "../abilities/entries");
const EVOLUTIONS_ENTRIES_DIR = path.join(__dirname, "../evolutions/entries");
const FORM_TABS_ENTRIES_DIR = path.join(__dirname, "../formTabs/entries");
const LEARNSETS_ENTRIES_DIR = path.join(__dirname, "../learnsets/entries");

export { MOVES_ENTRIES_DIR, POKEDEX_ENTRIES_DIR,
	ABILITIES_ENTRIES_DIR, EVOLUTIONS_ENTRIES_DIR, FORM_TABS_ENTRIES_DIR,
	LEARNSETS_ENTRIES_DIR };
