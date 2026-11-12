# PokeApi `moves`

The `https://pokeapi.co/api/v2/move/{id/name}` endpoint returns move data.
A sample response is in `src/pokemon/moves/README.md`.

### Building entries

`node src/pokemon/pokeApi/moves/getMoves.js` fetches moves 1 to
`amountOfMoves` (`CONSTANTS.mjs`), converts each one to the format in
`src/pokemon/moves/README.md`, and writes it to
`src/pokemon/pokeApi/moves/entries/{id}-{name}.json`. Files that
already exist are overwritten.

`contact` is copied from the matching file in
`src/pokemon/moves/entries/` (matched by id). PokeAPI has no contact
flag. Moves with no matching file get `null`. The values in
`moves/entries` come from `src/pokemon/moves/CONTACT.md`: moves listed
there are `true`, every other move is `false`.

### Field mapping

| Entry field          | PokeAPI source                                   |
| -------------------- | ------------------------------------------------ |
| `_id`                | `id`                                             |
| `key`                | `name`                                           |
| `name`               | every `names[]` item, keyed by language          |
| `type`               | `type.name`                                      |
| `category`           | `damage_class.name`                              |
| `contest`            | `contest_type.name`, or `null`                   |
| `pp`                 | `pp`                                             |
| `power`              | `power`                                          |
| `accuracy`           | `accuracy`                                       |
| `contact`            | not from PokeAPI (see above)                     |
| `generation`         | `generation.name` via `generationKey`            |
| `priority`           | `priority`                                       |
| `target`             | `target.name`                                    |
| `meta`               | `meta`, cleaned up (see below), or `null`        |
| `changes`            | every `past_values[]` item, keyed by game        |
| `effectChanges`      | every `effect_changes[].effect_entries[]`, keyed by language, then game |
| `flavorText`         | every `flavor_text_entries[]` item, keyed by language, then game |
| `effect.full`        | `effect_entries[]` where language is `en`, `effect` |
| `effect.shortEffect` | `effect_entries[]` where language is `en`, `short_effect` |

Language keys, game keys and text cleanup are the same as abilities
(see `src/pokemon/pokeApi/abilities/README.md`). Both scripts share them
through `src/pokemon/pokeApi/pokeApiFormat.js`.

### `meta`

`category` and `ailment` keep only their `name` (the `url` is dropped).
Every other field is copied as is, with its key in camelCase:

| Meta field      | PokeAPI source    |
| --------------- | ----------------- |
| `category`      | `category.name`   |
| `ailment`       | `ailment.name`    |
| `minHits`       | `min_hits`        |
| `maxHits`       | `max_hits`        |
| `minTurns`      | `min_turns`       |
| `maxTurns`      | `max_turns`       |
| `drain`         | `drain`           |
| `healing`       | `healing`         |
| `critRate`      | `crit_rate`       |
| `ailmentChance` | `ailment_chance`  |
| `flinchChance`  | `flinch_chance`   |
| `statChance`    | `stat_chance`     |

PokeAPI has no `meta` for 92 newer moves (gen 8 Legends Arceus and gen
9). Those get `meta: null`.

### `changes`

Each `past_values[]` item becomes `changes[<game>]`. It holds the
values the move had **before** that game, and only the ones that
changed. A past value with nothing set (every field `null`) is skipped.
`type` can be `unknown`, PokeAPI's name for the `???` type (Curse
before Black/White).

| Change field   | PokeAPI source                                    |
| -------------- | ------------------------------------------------- |
| `accuracy`     | `accuracy`, if not `null`                          |
| `power`        | `power`, if not `null`                             |
| `pp`           | `pp`, if not `null`                                |
| `effectChance` | `effect_chance`, if not `null`                     |
| `type`         | `type.name`, if `type` is set                      |
| `effect`       | `effect_entries` (same as `effect`), if not empty |

```json
"changes": {
    "bw": { "accuracy": 95, "power": 35 },
    "sm": { "power": 50 }
}
```

### `$effect_chance`

PokeAPI effect text can contain `$effect_chance`. It is replaced with
the move's `effect_chance` (for `changes[].effect`, the old
`effect_chance` if there is one).

### Dropped fields

`effect_chance` (used only to fill in effect text), `contest_combos`,
`contest_effect`, `super_contest_effect`, `stat_changes`,
`machines` and `learned_by_pokemon` are not stored.

### Schema

`src/pokemon/moves/schema.json` validates this shape. Run
`npm run moves:validate` after copying new entries into
`src/pokemon/moves/entries/`.
