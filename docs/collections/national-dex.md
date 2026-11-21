# national-dex

One document per base pokemon. Source:
`src/pokemon/pokedex/entries/{_id}-{key}.json` (1,025 files). Schema:
`src/pokemon/pokedex/schema.json`. Forms are in `src/pokemon/forms/` (see
`src/pokemon/forms/README.md`).

`pokedex/pokedex.test.js` checks that file names match `{_id}-{key}`,
and that `evolution` is an integer or null that points to an existing
chain containing the pokemon.

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
| `_id`            | number            | national dex number                      |
| `key`            | string            | slug, e.g. `charizard`, `mr-mime`        |
| `name`           | object            | `english` plus 7 other languages         |
| `type`           | array             | 1-2 lowercase types, e.g. `["fire"]`     |
| `abilities`      | object            | `normal`: 1-2 ids in slot order; `hidden`: id or `null` |
| `baseStats`      | object            | `hp atk def spatk spdef spd total`       |
| `info`           | object            | `height` (dm), `weight` (hg) from PokeAPI |
| `gender`         | object            | `male`, `female` (number or `null`), `genderless` |
| `evolution`      | number \| null    | chain id                                 |
| `generation`     | number            |                                          |
| `evs`            | object            | only stats that give EVs, e.g. `{spatk: 3}` |
| `eggGroups`      | array             | `egg-groups._id`s, e.g. `[1, 7]`         |
| `species`        | string            | e.g. `Flame Pokémon`                     |
| `catchRate`      | number \| null    |                                          |
| `baseFriendship` | number \| null    |                                          |
| `baseExp`        | number            | optional                                 |
| `growthRate`     | integer           | `growth-rates._id` (1 Slow, 2 Medium Slow, 3 Medium Fast, 4 Fast, 5 Erratic, 6 Fluctuating) |
| `eggCycles`      | number \| null    |                                          |
| `nameOrigin`     | array             | `[[word, meaning]]`                      |
| `pokedexEntries` | array             | `[{gameKey: desc}]`                      |
| `pokedexNumber`  | object            | **added on upload**, `{game: dexNo}`     |

Each `pokedexEntries` key is a game key from
[`KEYS.md`](../../src/pokemon/KEYS.md): a single game (`go`), a
version group (`rb`), or games from the same group (`dpp`). Games from
different groups get separate entries, even when the text is the same
(`x` and `or`).

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
    "pokedexEntries": [
        { "rb": "Spits fire..." }
    ]
}
```

(Trimmed; real documents have every field in the table.)
