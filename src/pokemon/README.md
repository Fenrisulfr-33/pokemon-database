# Pokemon data

---

## File structure 

```text
src/pokemon
├──[collection]/
|	├── entries/		# Documents that get uploaded into the collection
│   ├──  upsert.js 		# The upsert function for that specific collection
│   ├──  schema.json 	# The schema for the documents in the collection
│   ├──  README.md		# Any information needed/specific for this collection
│   ├──  validation.mjs	# A script to check all files in ./entries pass the schema.json
│   ├──  [helpers].js 	# Helper files to perform specific functions on the data in ./entries
```

```text
src/pokemon/
├── abilities/
│   ├── abilities.test.js
│   ├── entries/          # 307 individual ability JSON files (e.g. 1-stench.json)
│   └── upsert.js
├── competitive/
│   ├── competitive.schema.js
│   └── entries/          # 1 competitive-set JSON file (swampert.json)
├── helpers/
│   ├── CheckNationalPokedex.js
│   ├── fileUtils.js
│   ├── getAbilities.js   # getAbilities(): every ability in abilities/entries
│   ├── getMoves.js       # getMoves(): every move in moves/entries
│   ├── testHelpers.js    # shared test helpers (findDuplicates, toKey, ...)
│   ├── save.js
│   ├── save.test.js
│   └── upsertToMongo.js
├── moves/
│   ├── entries/          # 919 individual move JSON files (e.g. 1-pound.json)
│   ├── machines-records/
│   ├── CONTACT.md        # moves that make contact (sets contact: true)
│   ├── moves.test.js     # data checks on moves/entries
│   ├── moves.schema.test.js # schema rejects malformed moves
│   ├── README.md
│   ├── schema.json
│   ├── upsert.js
│   └── validation.mjs    # npm run moves:validate
├── pokedex/
│   ├── dexes/
│   │   ├── dexes_objects/   # 32 per-game/region dex JSON files (00_dex_map.js + 31 dex jsons)
│   │   ├── CONSTANTS.js
│   │   ├── README.md
│   │   └── dexes.test.js
│   ├── national/          # 1132 individual national Pokédex entry JSON files (e.g. 1-bulbasaur.json)
│   ├── thing/
│   │   └── NationalFolderDexContains.test.js
│   ├── AssignPokedexNumbers.js
│   ├── WritePokemonToFile.js
│   └── updateNationalPokedex.js
├── LoadNationalDex.js
├── UpsertNationalDex.js
├── createNewPokedex.js
├── games.txt
└── README.md
```

### Game order reference
This is MY master key for how the game numbering is stored for dexe entries, moves, etc...

```text
01-red-blue
02-yellow
03-gold-silver
04-crystal
05-ruby-sapphire
06-fire-red-leaf-green
07-emerald
08-diamond-pearl
09-platinum
10-heart-gold-soul-silver
11-black-white
12-black-2-white-2
13-x-y
14-omega-ruby-alpha-sapphire
15-sun-moon
16-ultra-sun-ultra-moon
17-lets-go-pikachu-lets-go-eevee
18-sword-shield
19-brilliant-diamond-shining-pearl
20-legends-arceus
21-scarlet-violet
22-legends-za

23-Champions ?????
```