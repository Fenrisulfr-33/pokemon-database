# abilities

One document per ability. Source:
`src/pokemon/abilities/entries/{_id}-{key}.json` (307 files).
Schema: `src/pokemon/abilities/schema.json`. `_id` is the PokeAPI id.

## Relations

| Field                                   | Points to          |
| --------------------------------------- | ------------------ |
| `pokemonWithAbility.{normal,hidden}[].id` | `national-dex._id` |

The reverse link is `national-dex.abilities.{one,two,hidden}.id`. Both
sides are stored, so adding an ability to a pokemon means editing both
files. `pokemonWithAbility` lists base pokemon only, never forms.

## Fields

| Field                | Type   | Notes                                   |
| -------------------- | ------ | --------------------------------------- |
| `_id`                | number | PokeAPI ability id                      |
| `key`                | string | slug, e.g. `stench`                     |
| `name`               | object | `english`                               |
| `generation`         | number | generation introduced                   |
| `effect`             | object | `shortEffect`, `full` (missing on 34)   |
| `description`        | object | `{versionGroup: flavor text}`           |
| `pokemonWithAbility` | object | `normal`, `hidden`: `[{name, id}]`      |

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
        "normal": [{ "name": "Grimer", "id": 88 }],
        "hidden": [{ "name": "Gloom", "id": 44 }]
    }
}
```
