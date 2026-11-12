import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const MOVES_ENTRIES_DIR = path.join(__dirname, "../moves/entries");
const POKEDEX_ENTRIES_DIR = path.join(__dirname, "../pokedex/entries");
const ABILITIES_ENTRIES_DIR = path.join(__dirname, "../abilities/entries");
const EVOLUTIONS_ENTRIES_DIR = path.join(__dirname, "../evolutions/entries");
const FORM_TABS_ENTRIES_DIR = path.join(__dirname, "../formTabs/entries");
const LEARNSETS_ENTRIES_DIR = path.join(__dirname, "../learnsets/entries");
const FORMS_DIR = path.join(__dirname, "../forms");
const POKEAPI_DIR = path.join(__dirname, "../pokeApi");
const POKEAPI_POKEMON_DIR = path.join(POKEAPI_DIR, "pokemon");
const POKEAPI_FORMS_DIR = path.join(POKEAPI_DIR, "forms");
const POKEAPI_FORM_DETAILS_DIR = path.join(POKEAPI_DIR, "formDetails");
const POKEAPI_GENERATIONS_DIR = path.join(POKEAPI_DIR, "generations");

export { MOVES_ENTRIES_DIR, POKEDEX_ENTRIES_DIR,
	ABILITIES_ENTRIES_DIR, EVOLUTIONS_ENTRIES_DIR, FORM_TABS_ENTRIES_DIR,
	LEARNSETS_ENTRIES_DIR, FORMS_DIR, POKEAPI_POKEMON_DIR, POKEAPI_FORMS_DIR,
	POKEAPI_FORM_DETAILS_DIR, POKEAPI_GENERATIONS_DIR };
