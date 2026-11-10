const generations = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const generationKey = {
	"generation-i": 1,
	"generation-ii": 2,
	"generation-iii": 3,
	"generation-iv": 4,
	"generation-v": 5,
	"generation-vi": 6,
	"generation-vii": 7,
	"generation-viii": 8,
	"generation-ix": 9,
}

const knownLanguages = [
	"ja-hrkt", // japanese (kana)
	"ko", // korean?
	"zh-hant", // traditional chinese
	"fr", // french
	"de", // german
	"en", // english
	"es", // spanish
	"it", // italian
	"ja", // japanese
	"zh-hans", // simplified chinese
	"es-419" // Latin American Spanish
]

const languageMap = {
	"ja-hrkt": "Japanese (Kana)",
	"ko": "Korean",
	"zh-hant": "Traditional Chinese",
	"fr": "French",
	"de": "German",
	"en": "English",
	"es": "Spanish",
	"it": "Italian",
	"ja": "Japanese",
	"zh-hans": "Simplified Chinese",
	"es-419": "Latin American Spanish"
};

const amountOfPokemon = 1025; // as of the time of this 
const amountOfPokemonForms = 325 // This starts at 10001 - 10336
const amountOfPokedexes = 36; // 10 doesn't exist?

const amountOfAbilities = 314; // as of the time of this build
const amountOfMoves = 919; // as of the time of this build

const games_order = [
	'red-blue',
	'yellow', 
	'gold-silver', 
	'crystal', 
	'ruby-sapphire', 
	'emerald', 
	'firered-leafgreen', 
	'diamond-pearl', 
	'platinum', 
	'heartgold-soulsilver', 
	'black-white', 
	'colosseum', 
	'xd',
	'black-2-white-2', 
	'x-y', 
	'omega-ruby-alpha-sapphire', 
	'sun-moon', 
	'ultra-sun-ultra-moon', 
	'lets-go-pikachu-lets-go-eevee', 
	'sword-shield', 
	'the-isle-of-armor',
	'the-crown-tundra',
	'brilliant-diamond-shining-pearl', 
	'legends-arceus', 
	'scarlet-violet',
	'the-teal-mask',
	'the-indigo-disk',
	'red-green-japan',
	'blue-japan',
	'legends-za',
	'mega-dimension',
	'champions'
];

const pokedexes = [];

export {
	generations,
	generationKey,
	knownLanguages,
	languageMap,
	amountOfPokemon,
	amountOfPokedexes,
	amountOfAbilities,
	amountOfMoves,
	games_order,
	pokedexes
};