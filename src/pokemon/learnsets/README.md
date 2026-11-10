# Learnsets

Learnsets is a collection that stores all the moves a pokemon can learn by game. 

#### Structure
- Learnsets stores method learned and `moveId`, data is later extracted from the moves collection on the server.
- The keys come from the `KEYS.md`
- The data orginally came from `moves/games/{id-gameName}.json`, which was
  converted once by `buildLearnsets.mjs`. Both were removed afterwards, so
  `entries/` is now the source of truth and is edited directly.
- Currently no tests, as data has to be checked manually/interpreted from pokeAPI, then manually verified differences.

## Data Model

TODO: for egg moves, in the future we could find the compatible parent list, make it a endpoint that takes in the pokemonId and maybe the move in question and the first value would become a link to that reference, then followed by the `moveId`.

Every method is an array of tuples, and `moveId` is always the **last**
value in a tuple. Anything before it is extra info for that method.
Methods with no moves are left out of the game object.

| Key   | Source key          | Tuple                           |
| ----- | ------------------- | ------------------------------- |
| `lv`  | `level-up`          | `[level, moveId]`               |
| `tm`  | `technical-machine` | `[tmNumber, moveId]`            |
| `hm`  | `hidden-machine`    | `[hmNumber, moveId]`            |
| `tr`  | `technical-record`  | `[trNumber, moveId]`            |
| `eg`  | `egg`               | `[moveId]`                      |
| `tu`  | `tutor`             | `[moveId]`                      |
| `ev`  | `evolution`         | `[moveId]`                      |
| `rm`  | `reminder`          | `[moveId]`                      |
| `spm` | `special-moves`     | `[moveId]`                      |
| `pe`  | `pre-evolution`     | `[methodKey, moveId]`           |
| `to`  | `transfer-only`     | `[generation, methodKey, moveId]` |
| `sp`  | `special`           | `[note, moveId]`                |
| `zc`  | `special` (split)   | `[moveId]`                      |
| `lbe` | `special` (split)   | `[moveId]`                      |
| `fc`  | `special` (split)   | `[moveId]`                      |

### Field mapping

| Source field     | Becomes                                  |
| ---------------- | ---------------------------------------- |
| `move_id`        | `moveId`                                 |
| `move_name`      | dropped, comes from the moves collection |
| `learned_at`     | `level`                                  |
| `tm` / `hm`/`tr` | `tmNumber` / `hmNumber` / `trNumber`     |
| `learned_method` | `methodKey`, `generation` or `note`      |

### Methods by game

| Key   | Games                                          |
| ----- | ---------------------------------------------- |
| `lv`  | All games                                      |
| `tm`  | All games except LA                            |
| `hm`  | RB through ORAS                                |
| `tr`  | SwSh                                           |
| `eg`  | GS onward, except LGPE, LA, ZA                 |
| `tu`  | Crystal, FRLG through LA (not RS or SV/ZA)     |
| `ev`  | SM onward, except LA                           |
| `rm`  | SV, ZA                                         |
| `spm` | LGPE                                           |
| `pe`  | RB through USUM                                |
| `to`  | DP through USUM                                |
| `sp`  | RS through USUM (not B2W2)                     |

### `learned_method` → `methodKey`

Used by `pe` and `to`. For `to`, the `Generation N — ` prefix becomes
the `generation` number.

| `learned_method` | `methodKey` |
| ---------------- | ----------- |
| `Level up`       | `lv`        |
| `TM`             | `tm`        |
| `HM`             | `hm`        |
| `Move tutor`     | `tu`        |
| `Breeding`       | `eg`        |
| `Evolution`      | `ev`        |
| `Pre-evolution`  | `pe`        |
| `Special`        | `sp`        |

Example: `"Generation 3 — Move tutor"` → `[3, "tu", 34]`.

### Splitting `special`

Three `special` values are real learn methods, so they get their own key
instead of a note:

| `learned_method`                          | Key   |
| ----------------------------------------- | ----- |
| `From Zygarde Cube`                       | `zc`  |
| `Breed Pikachu/Raichu holding Light Ball` | `lbe` |
| `On form change`                          | `fc`  |

Everything else in `special` is an event or a form-specific move, and
the original text is kept as the `note`, e.g.
`["Various events", 19]`, `["Cosplay Pikachu - Belle", 34]`.

### Example

`rb` is real Bulbasaur data; `usum` uses made-up values to show every
tuple shape.

```json
{
    "_id": 1,
    "rb": {
        "lv": [[1, 45], [1, 33], [7, 73], [13, 22]],
        "tm": [[3, 14]],
        "hm": [[1, 15]]
    },
    "usum": {
        "lv": [[1, 33], [3, 45]],
        "eg": [[204]],
        "pe": [["lv", 81]],
        "to": [[3, "tu", 34], [1, "tm", 14]],
        "sp": [["Various events", 19]]
    }
}
```

### Known data issues

To fix in the source files before (or during) the transform:

- **SV `tm: 0` Mega Punch**: 5 entries in `21-scarlet-violet.json` have
  Mega Punch as TM 0. Mega Punch isn't in SV, so these are likely bad
  data copied from SwSh.
- **LA `learned_at: null`**: 26 level-up entries in
  `20-legends-arceus.json` have no level.
- **SwSh `tm: 0` / `tr: 0`** are valid (TM00 Mega Punch, TR00 Swords
  Dance), so `0` must not be treated as "missing".

### Fixes that need to happen


### Fixed data issues

- **SV `tm: 0` Mega Punch**: removed the 5 entries as I cannot find any data online that suggests Mega Punch was ever a learnable tm.
- **LA `learned_at: null`**: appears to be that those moves are learned on evolution, of the first 5 cases I saw it was that kadabra learns confusion when abra evolves, gyarados learsn water pulse when magikarp evolves, and vaporeon learns bubbles when eevee evolves, so lets just move these too `ev`.
