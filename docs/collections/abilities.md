# abilities

One document per ability. Source:
`src/pokemon/abilities/entries/{_id}-{key}.json` (307 files).
Schema: `src/pokemon/abilities/schema.json`. `_id` is the PokeAPI id.

## Relations

| Field                                   | Points to          |
| --------------------------------------- | ------------------ |
| `pokemonWithAbility.{normal,hidden}[]`    | `national-dex._id` |

The reverse link is `national-dex.abilities.{normal[],hidden}`.
`pokemonWithAbility` is built from it, so after changing a pokemon's
abilities run `node src/pokemon/abilities/updatePokemonWithAbility.js`
instead of editing ability files by hand. Lists include forms (decimal
ids) and are sorted by id.

## Fields

| Field                | Type   | Notes                                   |
| -------------------- | ------ | --------------------------------------- |
| `_id`                | number | PokeAPI ability id                      |
| `key`                | string | slug, e.g. `stench`                     |
| `name`               | object | `english`                               |
| `generation`         | number | generation introduced                   |
| `effect`             | object | `shortEffect`, `full` (missing on 34)   |
| `description`        | object | `{versionGroup: flavor text}`           |
| `pokemonWithAbility` | object | `normal`, `hidden`: pokedex ids         |

## Example

```json
{
    "_id": 1,
    "key": "stench",
    "name": { "english": "Stench" },
    "generation": 3,
    "effect": {
        "shortEffect": "Has a 10% chance of making target Pokémon flinch...",
        "full": "This Pokémon's damaging moves have a 10% chance..."
    },
    "description": { "ruby-sapphire": "Helps repel wild POKéMON." },
    "pokemonWithAbility": {
        "normal": [88, 89, 434, 435, 568, 569],
        "hidden": [44, 109, 110]
    }
}
```
