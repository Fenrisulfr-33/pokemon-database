# evolutions

One document per evolution chain. Source:
`src/pokemon/evolutions/entries/{_id}-{firstPokemon}.json` (340 files).
Schema: `src/pokemon/schemas/evolution.json`.

`_id` is a chain number, **not** a pokemon id. Chain `2` is the
Charmander line, chain `51` is Eevee and its eeveelutions.

## Relations

| Field                     | Points to          |
| ------------------------- | ------------------ |
| `evolution[][].id`        | `national-dex._id` |

The reverse link is `national-dex.evolution`, which should hold the id
of the chain the pokemon appears in. Many are out of date; see
[known issues](../known-issues.md).

## Shape

`evolution` is an array of **branches**. Each branch is an array of
**stages** in order. A stage is either one pokemon object or, when the
line splits, an array of pokemon objects.

| Stage field | Type     | Notes                                    |
| ----------- | -------- | ---------------------------------------- |
| `id`        | number   | `national-dex._id`                       |
| `name`      | string   | display copy                             |
| `type`      | string[] | display copy                             |
| `how`       | string   | evolution condition; absent on the first stage |
| `form`      | string   | optional form label                      |

## Examples

A straight line:

```json
{
    "_id": 3,
    "generation": 1,
    "evolution": [[
        { "id": 7, "name": "Squirtle", "type": ["Water"] },
        { "id": 8, "name": "Wartortle", "type": ["Water"], "how": "Level 16" },
        { "id": 9, "name": "Blastoise", "type": ["Water"], "how": "Level 36" }
    ]]
}
```

A split (Eevee, trimmed): the second stage is an array.

```json
{
    "_id": 51,
    "generation": 1,
    "evolution": [[
        { "id": 133, "name": "Eevee", "type": ["Normal"] },
        [
            { "id": 134, "name": "Vaporeon", "type": ["Water"],
              "how": "Use Water Stone" },
            { "id": 135, "name": "Jolteon", "type": ["Electric"],
              "how": "Use Thunder Stone" }
        ]
    ]]
}
```
