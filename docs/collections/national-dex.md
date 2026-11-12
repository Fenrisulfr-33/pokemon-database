# national-dex

One document per pokemon and per form. Source:
`src/pokemon/pokedex/entries/{_id}-{key}.json` (1,132 files, 107 of them
forms with a decimal `_id`). Schema: `src/pokemon/pokedex/schema.json`.

## Relations

| Field                          | Points to          |
| ------------------------------ | ------------------ |
| `abilities.normal[]`, `abilities.hidden` | `abilities._id` |
| `evolution`                    | `evolutions._id`   |
| `_id`                          | `learnsets._id` (same id) |
| `_id`                          | `form-tabs.pokemonIds[]` when it has forms |
| `pokedexNumber.{game}`         | `dexNo` in `pokedex/dexes/dexes_objects/*.json` |

## Fields

| Field            | Type              | Notes                                    |
| ---------------- | ----------------- | ---------------------------------------- |
| `_id`            | number            | national dex number; decimal for forms   |
| `key`            | string            | slug, e.g. `charizard`, `alolan-marowak` |
| `name`           | object            | `english` plus 7 other languages         |
| `type`           | array             | 1-2 lowercase types, e.g. `["fire"]`     |
| `abilities`      | object            | `normal`: 1-2 ids in slot order; `hidden`: id or `null` |
| `baseStats`      | object            | `hp atk def spatk spdef spd total`       |
| `info`           | object            | `height` (dm), `weight` (hg) from PokeAPI |
| `gender`         | object            | `male`, `female` (number or `null`), `genderless` |
| `evolution`      | number \| null    | chain id; forms use the base chain      |
| `generation`     | number            |                                          |
| `evs`            | object            | only stats that give EVs, e.g. `{spatk: 3}` |
| `eggGroups`      | array             | strings                                  |
| `species`        | string            | e.g. `Flame Pokémon`                     |
| `catchRate`      | number \| null    |                                          |
| `baseFriendship` | number \| null    |                                          |
| `baseExp`        | number            | optional                                 |
| `growthRate`     | string \| null    |                                          |
| `eggCycles`      | number \| null    |                                          |
| `nameOrigin`     | object            | `{word: meaning}`                        |
| `pokedexEntries` | object            | `{formName: [{game, desc}]}`             |
| `pokedexNumber`  | object            | **added on upload**, `{game: dexNo}`     |

`info.height` and `info.weight` are PokeAPI units. Display formulas are
in `src/pokemon/pokedex/README.md`.

`pokedexNumber` is not stored in the files. `pokedex/upsert.js` runs
`AssignPokedexNumbers.js`, which looks the pokemon up by `pokemonId` in
each regional dex in `pokedex/dexes/dexes_objects/` and records its
`dexNo` per game.

## Example

```json
{
    "_id": 6,
    "key": "charizard",
    "name": { "english": "Charizard", "japanese": "リザードン" },
    "type": ["fire", "flying"],
    "abilities": { "normal": [66], "hidden": 94 },
    "baseStats": {
        "hp": 78, "atk": 84, "def": 78,
        "spatk": 109, "spdef": 85, "spd": 100, "total": 534
    },
    "evolution": 2,
    "generation": 1,
    "evs": { "spatk": 3 },
    "pokedexEntries": {
        "Charizard": [{ "game": "red-blue", "desc": "Spits fire..." }]
    }
}
```

(Trimmed; real documents have every field in the table.)
