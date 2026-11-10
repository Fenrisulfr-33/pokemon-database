# Evolutions

This .md is for the evolutions entries held in the `./entries` section of this folder.

This folder holds the evolution data objects for the evolution section of each pokemon. Each evolution id is distinct for certain pokemon that exist within that evolution chain. So the pokemon that can evolve or have evolved from another pokemon make up a chain. The ids are unique.

## Schema

The schema is a work in progress since the chain types has now been established but the current iteration of the schema is as follows.

```js
{
	"$schema": "http://json-schema.org/draft-07/schema#",
		"title": "PokemonEvolutionEntry",
			"type": "object",
				"properties": {
		"_id": {
			"type": "integer"
		},
		"generation": {
			"type": "integer"
		},
		"evolution": {
			"type": "array",
				"items": {
				"type": "object",
					"properties": {
					"id": {
						"type": "number"
					},
					"name": {
						"type": "string"
					},
					"type": {
						"type": "array",
						"items": {
							"type": "string"
						}
					}
				},
				"required": ["id", "name", "type"],
					"additionalProperties": false
			}
		}
	},
	"required": ["_id", "generation", "evolution"],
		"additionalProperties": false
}
```
TODO: make the final schema for the evolution entries now that all possible combinations have been observed.

## Chain types

Info for data represented in a chain is stored as `[pokemon_id]` if no 'how' exists, else `[pokemon_id, how]` if the data has a how. From the previous model we dropped `form` since the `_id` will contain the form name.

### Normal chain

This chain shows the evolution from left to right in a straight line and is stored like such.

```json
{
    "_id": 0,
    "generation": 0,
    "evolution": [
        [
			[1], 
			[2, "Level 16"], 
			[3, "Level 32"]
		]
    ]
}

```

pokemon that start the evolution chain have no `how` key because they start the chain, so nothing comes before.

This is a list of a list. `[ [] ]`

### Alternate form chain

The alternate form chain is when two lines of the pokemon exist, so the original chain, and then another chain which usually involves a region variant.

```json
{
    "_id": 7,
    "generation": 1,
    "evolution": [
        [
			[19], 
			[20, "Level 20"]
		],
		[
			[19.1], 
			[20.1, "Level 20, Nighttime"]
		]
    ]
}
```

Notice how the alternate forms takes on another key called `form`, this is to display the form name even though the pokemon name stays the same. 

This is a list of two lists. `[ [], [] ]`

### Multiple chaining

Multiple chaining is when at a certain point in the base evolution chain the choice it can evolve into can be multiple things.

```json
{
    "_id": 18,
    "generation": 1,
    "evolution": [
        [
			[43],
			[44, "Level 21"]
			[
				[45, "Use Leaf Stone"],
				[182, "Use Sun Stone"]
			]
		]
    ]
}
```

Multiple chaining allows gloom to turn into either `Vileplume` or `Bellossom`. The multiple choices array is place at the index where multiple choices can occur. Any amount of choices can be present inside the indexed array.

This is a list within a list with a list as an index. `[ [ x, y, [] ] ]`

### Alternate form Multiple chain

This is when both the original chain and the alternate chain can both have multiple choices, building off the previous two.

```json
{
    "_id": 33,
    "generation": 1,
    "evolution": [
        [
			[79], 
			[
				[80, "Level 37"], 
				[199, "Trade holding King's Rock"]
			]
		],
		[
			[79.1], 
			[
				[80.1, "use Galarica Cuff"], 
				[199.1, "use Galarica Wreath"]
			]
		]
    ]
}
```

In Alternate Multiple chaining we have the original `slowpoke` chain then the `galarian slowpoke` chain. Each of these chains has multiple choices to evolve slowpoke into either `slowbro` or `slowking`

This is lists inside a list, with lists at the specificed index for the multiple choices. `[ [ x, y, [] ], [ x, y, [] ] ]`

### Multiple continuation chaining

Multiple continuation chaining is when the chain breaks into multiple pokemon but each chain continues to go off in its own direction.

```json
{
    "_id": 101,
    "generation": 3,
    "evolution": [
		[[290], 
			[
				[291, "Level 20"], 
				[
					[291, "Level 20, empty spot in party, Pokéball in bag"], 
					[292, "+"]
				]
			]
		]
    ]
}
```

The first chain after the split only has one pokemon in it because that's where it's chain stops. However it can continue on as long as it wants.

This is lists inside a list, in a specific index of a list, inside another list. `[ [ x [ [ y ], [ y, z ] ] ] ]`