# Known issues

Results of checking every reference between the `entries/` folders.

Whenever a known issue is fixed, commit and remove the section that known-issue related too.

## Links that hold

| Reference                                    | Checked | Broken |
| -------------------------------------------- | ------: | -----: |
| `national-dex` + `forms/` abilities → `abilities` | 2,790 | 0  |
| `abilities.pokemonWithAbility` ids → `national-dex` + `forms/` | 2,790 | 0 |
| `learnsets` moveId → `moves`                 | 649,566 | 0      |
| `learnsets._id` → `national-dex` + `forms/`  | 1,075   | 0      |

## Forms aren't uploaded yet

Form ids in `evolutions`, `form-tabs`, `learnsets` and
`abilities.pokemonWithAbility` are `forms/` ids. `forms/` has no upsert
yet, so in Mongo those ids have no pokemon document.

## Forms without a learnset

203 of the 253 full forms have no `learnsets` document. Every base
pokemon has one.

## Moves with no effect text

Moves 827–919 (generation 8 Legends Arceus and generation 9) have empty
`effect.full` and `effect.shortEffect`. PokeAPI has no English effect
text for them yet. The schema allows empty strings here.

## Move data from PokeAPI

These came from PokeAPI and were not fixed:

- `power: 0` instead of `null` on Hard Press (912), whose power
  varies. (The 16 status moves with `power: 0` were fixed 2026-11-16.)
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

5 of 10 test suites fail (`npm test`):

- `moves/moves.test.js`, 2 of 20 tests (see "Move data from PokeAPI"
  above):
  - damaging moves use null for variable power: Hard Press (912) has
    `power: 0`.
  - no game key before the move's generation: 11 moves have
    `effectChanges` for games from before they existed.

- `abilities/abilities.test.js`, 1 of 11 tests: english names, "As One"
  is used by both 266 and 267.

- `_test/evolution-id-list.test.mjs` reads `_test/evolution-id-list.json`,
  which doesn't exist.
- `pokedex/dexes/archer-dexes.test.js`: the Legends ZA dex has 145
  entries instead of 232, and isn't in `dexNo` order.
- `pokedex/dexes/dexes.test.js`: `ULTRA_SUN_ULTRA_MOON_MELEMELE` has
  149 entries instead of 150.

## Abilities with no pokemon

Embody Aspect (303) has empty `pokemonWithAbility` lists. The
Terastallized Ogerpon forms that have it aren't in `forms/`.

## Pokedex entries filed under the wrong form

`forms/paldean/128.03-paldea-aqua-breed-tauros.json` has its
`pokedexEntries` under "Blaze Breed".

## Form files (`src/pokemon/forms`)

Rebuilt from PokeAPI on 2026-11-12. Problems found:

- **No abilities** (`normal: []`, `hidden: null`): Mega Heatran (485.01),
  Mega Darkrai (491.01), Mega Zygarde (718.05), Mega Magearna (801.02,
  801.03), Mega Zeraora (807.01), Mega Tatsugiri (978.03–978.05).
  PokeAPI has no abilities for them yet.
- **Eternamax Eternatus** (890.01) has `weight: 0`; the games show none.
- **English names made up**: PokeAPI has none for the Koraidon builds
  (1007.01–1007.04) or Miraidon modes (1008.01–1008.04), so they're
  "Limited Build Koraidon", "Drive Mode Miraidon", etc.
- **No `baseExp`**: Mega Scovillain, Mega Glimmora, the 3 Tatsugiri Megas
  and Mega Baxcalibur.
- **Empty `pokedexEntries`**: 134 forms (64 Megas, 10 Totems, 2
  Gigantamax and 58 others such as the Deoxys, Rotom, Minior and Ogerpon
  forms). PokeAPI has no form-specific entries. Full list in
  `docs/pokedex-entries.md`.
- **Female forms** (Meowstic, Indeedee, Oinkologne, Female Mega
  Meowstic) are `0` / `100`; Female Basculegion is `null` / `null`
  because base 902 has no gender data.
- **Male Meowstic is female-only**: base Meowstic (`678-meowstic.json`,
  the male form) and Male Mega Meowstic (678.02) are `0` / `100`.
- **Base pokemon gaps that forms copied**: Ogerpon (1017) has
  `eggGroups: []`.

## Cosmetic and visual forms

Added 2026-11-12 (`forms/cosmetic/`, 227 files). Not fixed:

- **Entry keys left in base files**: Alcremie (869) has entries by cream
  (`Vanilla Cream Flavor`...), but its forms are cream + sweet pairs, so
  nothing matched. Wormadam's `Sandy Cloak` / `Trash Cloak` and
  Floette's `Eternal Flower` belong to full forms (413.01, 413.02,
  670.01) whose files have no entries yet.
- **No English form names in PokeAPI** for Mothim, Scatterbug and
  Spewpa, so their keys and tabs use PokeAPI's slug (`sandy-mothim`,
  tab `Sandy`).
- **Arceus's "???" form** isn't included; its type `unknown` isn't in
  the schema.
- **Super Size Pumpkaboo and Gourgeist** (710.03, 711.03) count as
  visual because their stats equal the base entries, but in the games the
  sizes have different stats, so 710/711 may hold the wrong numbers.
- **Minior Meteor colours** (774.01–774.06, Orange to Violet Meteor)
  are visual files for forms that don't exist: Minior has one Meteor
  Form (the base, 774) and seven Core colours (774.07–774.13). The
  colour files come from PokeAPI and aren't in the Minior form tab.
