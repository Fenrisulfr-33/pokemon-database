# Known issues

Results of checking every reference between the `entries/` folders
(2026-11-10). Nothing here was fixed.

## Links that hold

| Reference                                    | Checked | Broken |
| -------------------------------------------- | ------: | -----: |
| `national-dex.abilities` ids → `abilities`   | 2,596   | 0      |
| `abilities.pokemonWithAbility` ids → `national-dex` | 2,284 | 0 |
| `learnsets` moveId → `moves`                 | 649,566 | 0      |
| `learnsets._id` → `national-dex`             | 1,075   | 0      |

## `national-dex.evolution` for pokemon not in a chain

This field should be the `_id` of the evolution chain the pokemon is in.
Every pokemon that is in a chain now has the right id (rebuilt from
`evolutions/entries` on 2026-11-10).

The 274 pokemon that aren't in any chain have no consistent value:

- **200** have `null`
- **37** have `0`
- **37** have a chain id even though no chain contains them

These should all use one value, probably `null`.

## `evolutions` ids missing from `national-dex`

21 ids inside chains have no pokemon document, mostly Hisuian forms:
`58.1`, `59.1`, `100.1`, `157.1`, `215.1`, `503.1`, `549.1`, `570.1`...
These forms now have files in `forms/hisuian/`, but they are not in
`pokedex/entries`, so they aren't uploaded.

## `form-tabs` ids missing from `national-dex`

- `898.1` and `898.2` (Calyrex riders) appear in `pokemonIds` and `tab`.
- `562.2` and `618.2` appear in `tab`.

## Pokemon without a learnset

57 `national-dex` documents (mostly forms) have no `learnsets` document.

## `moves.contact` mixes types

Values found: `null` (844), `"No"` (56), `false` (14), `true` (6).
It should probably be a boolean.

## Missing schema checks

`learnsets` and `form-tabs` have no schema, so bad data uploads without
an error.

## Failing tests

4 of 6 test suites fail (`npm test`):

- `_test/evolution-id-list.test.mjs` reads `_test/evolution-id-list.json`,
  which doesn't exist.
- `pokedex/pokedex.test.js` fails with `pokedex is not defined`.
- `pokedex/dexes/archer-dexes.test.js`: the Legends ZA dex has 145
  entries instead of 232, and isn't in `dexNo` order.
- `pokedex/dexes/dexes.test.js`: `ULTRA_SUN_ULTRA_MOON_MELEMELE` has
  149 entries instead of 150.

## `abilities` entries fail their schema

41 of 307 ability files fail `abilities/schema.json`, so
`npm run upsert:abilities` refuses to upload:

- 33 are missing `effect.shortEffect`.
- 7 have an empty `effect.full` or `effect.shortEffect`.
- `263-dragon’s-maw.json` has `key` `dragon’s-maw`; the curly
  apostrophe doesn't match the key pattern.

There's no `abilities:validate` script to catch this earlier.

## Abilities with no pokemon

Battle Bond, Power Construct, Neuroforce and both As One entries have
empty `pokemonWithAbility` lists. The forms that have them
(Ash-Greninja, Zygarde, Ultra Necrozma, the Calyrex riders) are in
`forms/` but not in `pokedex/entries`.
