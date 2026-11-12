# moves

One document per move. Source:
`src/pokemon/moves/entries/{_id}-{key}.json` (919 files).
Schema: `src/pokemon/moves/schema.json`. `_id` is the PokeAPI id.

## Relations

Moves don't point anywhere. They are referenced by:

| From                                | Field              |
| ----------------------------------- | ------------------ |
| `learnsets.{game}.{method}[][last]` | `moves._id`        |
| `competitive` (not uploaded)        | `moves.key`        |

There is no list of pokemon on a move. To find who learns a move, search
`learnsets` for tuples ending in the move's `_id`.

## Fields

| Field           | Type           | Notes                                       |
| --------------- | -------------- | ------------------------------------------- |
| `_id`           | number         | PokeAPI move id                             |
| `key`           | string         | slug, e.g. `pound`                          |
| `name`          | object         | every PokeAPI language; `english` required  |
| `type`          | string         | lowercase, e.g. `normal`                    |
| `category`      | string         | `physical`, `special` or `status`           |
| `contest`       | string \| null | `cool`, `beauty`, `cute`, `smart`, `tough`  |
| `pp`            | number         |                                             |
| `power`         | number \| null | `null` for variable or no power             |
| `accuracy`      | number \| null | `null` for moves that never miss            |
| `contact`       | boolean        | `true` for moves in `moves/CONTACT.md`      |
| `generation`    | number         | generation introduced                       |
| `priority`      | number         | -7 to 5                                     |
| `target`        | string         | PokeAPI target slug, e.g. `selected-pokemon`|
| `meta`          | object \| null | PokeAPI meta; `null` for 92 gen 8–9 moves   |
| `changes`       | object         | `{game: values before that game}`           |
| `effectChanges` | object         | `{language: {game: older effect text}}`     |
| `flavorText`    | object         | `{language: {game: in-game text}}`          |
| `effect`        | object         | `full`, `shortEffect` (English)             |

Game keys come from `src/pokemon/constants/GAME_KEYS.js`. The format is
built by `src/pokemon/pokeApi/moves/getMoves.js`; see
`src/pokemon/moves/README.md`.

## Example

```json
{
    "_id": 33,
    "key": "tackle",
    "name": { "english": "Tackle", "japanese": "たいあたり" },
    "type": "normal",
    "category": "physical",
    "contest": "tough",
    "pp": 35,
    "power": 40,
    "accuracy": 100,
    "contact": true,
    "generation": 1,
    "priority": 0,
    "target": "selected-pokemon",
    "meta": {
        "category": "damage",
        "ailment": "none",
        "minHits": null,
        "maxHits": null,
        "minTurns": null,
        "maxTurns": null,
        "drain": 0,
        "healing": 0,
        "critRate": 0,
        "ailmentChance": 0,
        "flinchChance": 0,
        "statChance": 0
    },
    "changes": {
        "bw": { "accuracy": 95, "power": 35 },
        "sm": { "power": 50 }
    },
    "effectChanges": {},
    "flavorText": {
        "english": { "gs": "A full-body charge attack." }
    },
    "effect": {
        "full": "Inflicts regular damage.",
        "shortEffect": "Inflicts regular damage with no additional effect."
    }
}
```

## Tests

`moves/moves.test.js` checks the entries (file names, unique ids, keys
and names, game keys, learnset references, `CONTACT.md`, power and
`meta`). `moves/moves.schema.test.js` checks that the schema rejects
malformed entries.
