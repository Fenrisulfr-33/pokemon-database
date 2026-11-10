# Known issues

Results of checking every reference between the `entries/` folders
(2026-11-10). Nothing here was fixed.

## Links that hold

| Reference                                    | Checked | Broken |
| -------------------------------------------- | ------: | -----: |
| `national-dex.abilities.*.id` → `abilities`  | 2,596   | 0      |
| `abilities.pokemonWithAbility.*.id` → `national-dex` | 2,284 | 0 |
| `learnsets` moveId → `moves`                 | 649,566 | 0      |
| `learnsets._id` → `national-dex`             | 1,075   | 0      |

## `national-dex.evolution` is out of date

This field should be the `_id` of the evolution chain the pokemon is in.

- Of 855 pokemon that appear in a chain, only **145** have the right
  chain id. Many are close but shifted, e.g. Hitmonlee has `80` but is
  in chain `81`; Lickitung has `164` but is in chain `166`.
- **214** have `null`, including pokemon that are in a chain
  (Goldeen, Dipplin, Archaludon).
- **120** have `0`, which isn't a chain id.
- `evolutions/evolutionIdList.json` doesn't match either (292 of 1,025).

`evolutions/entries` looks like the reliable side. The field could be
rebuilt from it by finding the chain that contains each pokemon's id.

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
