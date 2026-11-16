# Evolutions

1. [Schema](#1-schema)
2. [Chain types](#2-chain-types)
3. [How to use](#3-how-to-use)

This .md is for the evolutions entries held in the `./entries` section of
this folder.

This folder holds the evolution data objects for the evolution section of
each pokemon. Each evolution id is distinct for certain pokemon that exist
within that evolution chain. So the pokemon that can evolve or have evolved
from another pokemon make up a chain. The ids are unique.

## 1. Schema

The full schema is in [`schema.json`](./schema.json). Check entries
against it with `npm run evolutions:validate`.

Each entry has three required fields and nothing else:

- `_id` — integer, minimum 1, unique id of the evolution chain
- `generation` — integer, minimum 1, generation the base line was
  introduced in
- `evolution` — array of one or more chains. Index 0 is the base line;
  any further chains are alternate-form lines (e.g. a regional variant)

The chain structure is built from these definitions:

- `stage` — one pokemon: `[pokemon_id]` or `[pokemon_id, how]`.
  `pokemon_id` is the national-dex `_id`, or the `forms/` `_id` for a
  form (e.g. `19.01`); `how` is left out for the first stage of a chain
- `chain` — an ordered list of `stage`s and `branch`es
- `branch` — a split point. Each option is either a single `stage`
  (multiple chaining) or its own `chain` (multiple continuation chaining)

## 2. Chain types

Info for data represented in a chain is stored as `[pokemon_id]` if no
'how' exists, else `[pokemon_id, how]` if the data has a how. From the
previous model we dropped `form` since the `_id` will contain the form
name.

### 2.a Normal chain

This chain shows the evolution from left to right in a straight line and
is stored like such.

```json
{
    "_id": 1,
    "generation": 1,
    "evolution": [
        [
            [1],
            [2, "Level 16"],
            [3, "Level 32"]
        ]
    ]
}
```

Pokemon that start the evolution chain have no `how` because they start
the chain, so nothing comes before.

This is a list of a list. `[ [] ]`

### 2.b Alternate form chain

The alternate form chain is when two lines of the pokemon exist, so the
original chain, and then another chain which usually involves a region
variant.

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
            [19.01],
            [20.01, "Level 20, Nighttime"]
        ]
    ]
}
```

This is a list of two lists. `[ [], [] ]`

### 2.c Multiple chaining

Multiple chaining is when at a certain point in the base evolution chain
the choice it can evolve into can be multiple things.

```json
{
    "_id": 18,
    "generation": 1,
    "evolution": [
        [
            [43],
            [44, "Level 21"],
            [
                [45, "Use Leaf Stone"],
                [182, "Use Sun Stone"]
            ]
        ]
    ]
}
```

Multiple chaining allows gloom to turn into either `Vileplume` or
`Bellossom`. The multiple choices array is placed at the index where
multiple choices can occur. Any amount of choices can be present inside
the indexed array.

This is a list within a list with a list as an index. `[ [ x, y, [] ] ]`

### 2.d Alternate form Multiple chain

This is when both the original chain and the alternate chain can both
have multiple choices, building off the previous two.

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
            [79.01],
            [
                [80.02, "use Galarica Cuff"],
                [199.01, "use Galarica Wreath"]
            ]
        ]
    ]
}
```

In Alternate Multiple chaining we have the original `slowpoke` chain then
the `galarian slowpoke` chain. Each of these chains has multiple choices
to evolve slowpoke into either `slowbro` or `slowking`.

This is lists inside a list, with lists at the specified index for the
multiple choices. `[ [ x, y, [] ], [ x, y, [] ] ]`

### 2.e Multiple continuation chaining

Multiple continuation chaining is when the chain breaks into multiple
pokemon but each chain continues to go off in its own direction.

```json
{
    "_id": 101,
    "generation": 3,
    "evolution": [
        [
            [290],
            [
                [
                    [291, "Level 20"]
                ],
                [
                    [291, "Level 20, empty spot in party, Pokéball in bag"],
                    [292, "+"]
                ]
            ]
        ]
    ]
}
```

The first chain after the split only has one pokemon in it because that's
where its chain stops. However it can continue on as long as it wants.

This is lists inside a list, in a specific index of a list, inside
another list. `[ [ x [ [ y ], [ y, z ] ] ] ]`

## 3. How to use

### `national-dex.evolution` for pokemon not in a chain

This field is the `_id` of the evolution chain the pokemon is in, from
`evolutions/entries`. Pokemon in no chain use `null`

A form (decimal `_id`) that isn't in a chain itself uses the chain of
its base pokemon, `Math.floor(_id)`, so the site can show a Mega's base
line.
