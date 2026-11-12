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

## Moves with no effect text

Moves 827–919 (generation 8 Legends Arceus and generation 9) have empty
`effect.full` and `effect.shortEffect`. PokeAPI has no English effect
text for them yet. The schema allows empty strings here.

## Move changes PokeAPI can't describe

For 12 moves (Teleport, Struggle, Perish Song, Nature Power, Howl, ...)
PokeAPI lists a past value for a game with every field `null`. Whatever
changed (probably the target) isn't in PokeAPI. These empty entries
were removed from `changes`, and `getMoves.js` skips them.

## Move data from PokeAPI

These came from PokeAPI and were not fixed:

- `power: 0` instead of `null` on 16 status moves (829 Power Shift,
  837 Victory Dance, 842 Shelter, 849, 850, 852, 858, 863, 867, 868,
  880–883, 908, 913) and on Hard Press (912), whose power varies.
- `effectChanges` for games from before the move existed. Most are an
  English `gs` change ("Hits Pokémon under the effects of Dig and
  Fly.") on Shadow Punch (325), Aerial Ace (332), Magical Leaf (345),
  Shock Wave (351), Aura Sphere (396), Magnet Bomb (443), Smart Strike
  (684) and False Surrender (793). The others are Steamroller (537,
  `gs`), Psychic Fangs (706, `bw`) and Freezing Glare (821, `dp`).
- `CONTACT.md` writes "Let's Snuggle Forever" with `'`; PokeAPI uses
  `’`. The tests treat them as the same.

## Moves with no `meta`

PokeAPI returns `meta: null` for 92 moves: 24 from generation 8 (mostly
Legends Arceus, such as `dire-claw` and `stone-axe`) and 68 from
generation 9 (such as `upper-hand` and `malignant-chain`).
`pokeApi/moves/getMoves.js` writes `meta: null` for them.

## Hyphen line breaks in flavor text

Older PokeAPI flavor text splits hyphenated words across lines
(`full-\nbody`). Turning line breaks into spaces leaves `full- body` in
the move and ability entries. It isn't removed automatically because
some line-ending hyphens may belong to the text.

## Missing schema checks

`learnsets` and `form-tabs` have no schema, so bad data uploads without
an error.

## Failing tests

6 of 8 test suites fail (`npm test`):

- `moves/moves.test.js`, 3 of 20 tests (see "Move data from PokeAPI"
  below):
  - status moves have no power: 16 generation 9 status moves have
    `power: 0` instead of `null`.
  - damaging moves use null for variable power: Hard Press (912) has
    `power: 0`.
  - no game key before the move's generation: 11 moves have
    `effectChanges` for games from before they existed.

- `abilities/abilities.test.js`, 2 of 11 tests:
  - english names: "As One" is used by both 266 and 267.
  - `pokemonWithAbility`: 308–314 have no field (see below).

- `_test/evolution-id-list.test.mjs` reads `_test/evolution-id-list.json`,
  which doesn't exist.
- `pokedex/pokedex.test.js` fails with `pokedex is not defined`.
- `pokedex/dexes/archer-dexes.test.js`: the Legends ZA dex has 145
  entries instead of 232, and isn't in `dexNo` order.
- `pokedex/dexes/dexes.test.js`: `ULTRA_SUN_ULTRA_MOON_MELEMELE` has
  149 entries instead of 150.

## Abilities with no pokemon

Battle Bond, Power Construct, Neuroforce, both As One entries and Embody
Aspect (303) have empty `pokemonWithAbility` lists. The forms that have
them (Ash-Greninja, Zygarde, Ultra Necrozma, the Calyrex riders, the
Terastallized Ogerpon forms) are in `forms/` or missing, but not in
`pokedex/entries`.

308–314 (Piercing Drill, Dragonize, Mega Sol, Spicy Spray, Eelevate,
Fire Mane, Aura Guard) have no `pokemonWithAbility` at all, and no
pokedex entry uses them. `updatePokemonWithAbility.js` throws
`No pokemonWithAbility key` on these files, so it can't be run until
they have the field.

`updatePokemonWithAbility.js` and `pokeApi/abilities/getAbilities.js`
both write each list on one line, but the current ability files have
one id per line, so the first run of either one reformats every file.
