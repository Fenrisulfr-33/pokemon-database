# evolutions

One document per evolution chain. Source:
`src/pokemon/evolutions/entries/{_id}-{firstPokemon}.json` (340 files).
Schema: `src/pokemon/schemas/evolution.json`.

`_id` is a chain number, **not** a pokemon id. Chain `2` is the
Charmander line, chain `51` is Eevee and its eeveelutions.

## Relations

| Field                          | Points to          |
| ------------------------------ | ------------------ |
| first item of each stage tuple | `national-dex._id` |

The reverse link is `national-dex.evolution`, which holds the id of the
chain the pokemon appears in.

## Shape

`evolution` is an array of **lines**: the base line first, then any
alternate-form lines (e.g. regional variants). Each line is an array of
**stages** in order.

A stage is a tuple: `[id]` for the first pokemon in a line, or
`[id, how]` after that. `id` is a `national-dex._id`; name, types and
form come from the pokedex. When the line splits, the stage is an array
of options instead, and each option is a stage or its own continuing
line. See `src/pokemon/evolutions/README.md` for every chain type.

## Examples

A straight line:

```json
{
    "_id": 3,
    "generation": 1,
    "evolution": [
        [
            [7],
            [8, "Level 16"],
            [9, "Level 36"]
        ]
    ]
}
```

A split (Eevee, trimmed): the second stage is an array of options.

```json
{
    "_id": 51,
    "generation": 1,
    "evolution": [
        [
            [133],
            [
                [134, "Use Water Stone"],
                [135, "Use Thunder Stone"]
            ]
        ]
    ]
}
```
