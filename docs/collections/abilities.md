# abilities

One document per ability. Source:
`src/pokemon/abilities/entries/{_id}-{key}.json` (314 files), built from
PokeAPI by `src/pokemon/pokeApi/abilities/getAbilities.js`.
Schema: `src/pokemon/abilities/schema.json`. `_id` is the PokeAPI id.

## Relations

| Field                                  | Points to          |
| -------------------------------------- | ------------------ |
| `pokemonWithAbility.{normal,hidden}[]` | `national-dex._id` |

The reverse link is `national-dex.abilities.{normal[],hidden}`.
`pokemonWithAbility` is built from it, so after changing a pokemon's
abilities run `node src/pokemon/abilities/updatePokemonWithAbility.js`
instead of editing ability files by hand. Lists include forms (decimal
ids) and are sorted by id. 308–314 have no `pokemonWithAbility` yet
(see `docs/known-issues.md`).

## Fields

| Field                | Type   | Notes                                       |
| -------------------- | ------ | ------------------------------------------- |
| `_id`                | number | PokeAPI ability id                          |
| `key`                | string | slug, e.g. `stench`                         |
| `name`               | object | `{language: name}`, `english` required      |
| `generation`         | number | generation introduced                       |
| `effect`             | object | `shortEffect`, `full` (English)             |
| `effectChanges`      | object | `{language: {gameKey: older effect text}}`  |
| `flavorText`         | object | `{language: {gameKey: in-game text}}`       |
| `pokemonWithAbility` | object | `normal`, `hidden`: pokedex ids             |

Language keys are listed in `src/pokemon/pokeApi/abilities/README.md`.
Game keys come from `GAME_KEYS` in `src/pokemon/constants/GAME_KEYS.js`.

## Example

```json
{
    "_id": 1,
    "key": "stench",
    "name": { "english": "Stench", "french": "Puanteur" },
    "generation": 3,
    "effect": {
        "shortEffect": "Has a 10% chance of making target Pokémon flinch...",
        "full": "This Pokémon's damaging moves have a 10% chance..."
    },
    "effectChanges": {
        "english": { "bw": "Has no effect in battle." }
    },
    "flavorText": {
        "english": { "rs": "Helps repel wild POKéMON." }
    },
    "pokemonWithAbility": {
        "normal": [88, 89, 434, 435, 568, 569],
        "hidden": [44, 109, 110]
    }
}
```
