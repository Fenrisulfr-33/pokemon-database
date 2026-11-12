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

This field is the `_id` of the evolution chain the pokemon is in, from
`evolutions/entries`. Pokemon in no chain use `null` (the 37 that had
`0` were set to `null` on 2026-11-12).

A form (decimal `_id`) that isn't in a chain itself uses the chain of
its base pokemon, `Math.floor(_id)`, so the site can show a Mega's base
line. Set on 2026-11-12 for 30 forms; 25 Megas from Mega Gyarados on had
stale ids one or two below the right chain.

Galarian Farfetch'd (83.1) and Galarian Corsola (222.1) have their own
chains (298, 297), so they keep those.

Corsola (222) is in no chain and had `296` (Grookey's line); it was set
to `null` on 2026-11-12.

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

## Pokedex height and weight changed by the PokeAPI switch

On 2026-11-12 `info.height` and `info.weight` were replaced with PokeAPI
numbers. For 1,089 of 1,132 pokemon the old display string matched. The
43 below changed. Most old values were from another form (Hoopa had
Hoopa Unbound's, Wishiwashi had School Form's, Growlithe had Hisuian
Growlithe's), so PokeAPI is right for them. Two look wrong in PokeAPI:

- `901.1-ursaluna` (Bloodmoon): PokeAPI gives normal Ursaluna's numbers.
  The old 2.7 m, 333.0 kg was right.
- `999.1-gimmighoul` (Roaming): PokeAPI says 1.0 kg; the old 0.1 kg was
  right.

| File               | Old               | PokeAPI          |
| ------------------ | ----------------- | ---------------- |
| `1011-dripplin`    | 0.4 m, 4.4 kg     | 0.4 m, 9.7 kg    |
| `1014-okidogi`     | 1.8 m, 92 kg      | 1.8 m, 92.2 kg   |
| `1018-archaludon`  | 1.2 m, 39.8 kg    | 2.0 m, 60.0 kg   |
| `215-sneasel`      | 0.9 m, 27.0 kg    | 0.9 m, 28.0 kg   |
| `483-dialga`       | 7.0 m, 850.0 kg   | 5.4 m, 683.0 kg  |
| `484-palkia`       | 6.3 m, 660.0 kg   | 4.2 m, 336.0 kg  |
| `487-giratina`     | 6.9 m, 650.0 kg   | 4.5 m, 750.0 kg  |
| `492-shaymin`      | 0.4 m, 5.2 kg     | 0.2 m, 2.1 kg    |
| `503-samurott`     | 1.5 m, 58.2 kg    | 1.5 m, 94.6 kg   |
| `549-lilligant`    | 1.2 m, 19.2 kg    | 1.1 m, 16.3 kg   |
| `555-darmanitan`   | 1.7 m, 120.0 kg   | 1.3 m, 92.9 kg   |
| `571-zoroark`      | 1.6 m, 73.0 kg    | 1.6 m, 81.1 kg   |
| `58-growlithe`     | 0.8 m, 22.7 kg    | 0.7 m, 19.0 kg   |
| `59-arcanine`      | 2.0 m, 168.0 kg   | 1.9 m, 155.0 kg  |
| `628-braviary`     | 1.7 m, 43.4 kg    | 1.5 m, 41.0 kg   |
| `641-tornadus`     | 1.4 m, 63.0 kg    | 1.5 m, 63.0 kg   |
| `642-thundurus`    | 3.0 m, 61.0 kg    | 1.5 m, 61.0 kg   |
| `645-landorus`     | 1.3 m, 68.0 kg    | 1.5 m, 68.0 kg   |
| `646-kyurem`       | 3.6 m, 325.0 kg   | 3.0 m, 325.0 kg  |
| `705-sliggoo`      | 0.7 m, 68.5 kg    | 0.8 m, 17.5 kg   |
| `706-goodra`       | 1.7 m, 334.1 kg   | 2.0 m, 150.5 kg  |
| `710-pumpkaboo`    | 0.8 m, 15.0 kg    | 0.4 m, 5.0 kg    |
| `711-gourgeist`    | 1.7 m, 39.0 kg    | 0.9 m, 12.5 kg   |
| `713-avalugg`      | 1.4 m, 262.4 kg   | 2.0 m, 505.0 kg  |
| `718-zygarde`      | 4.5 m, 610.0 kg   | 5.0 m, 305.0 kg  |
| `720-hoopa`        | 6.5 m, 490.0 kg   | 0.5 m, 9.0 kg    |
| `724-decidueye`    | 1.6 m, 37.0 kg    | 1.6 m, 36.6 kg   |
| `746-wishiwashi`   | 8.2 m, 78.6 kg    | 0.2 m, 0.3 kg    |
| `774-minior`       | 0.3 m, 0.3 kg     | 0.3 m, 40.0 kg   |
| `800-necrozma`     | 7.5 m, 230.0 kg   | 2.4 m, 230.0 kg  |
| `858-hatterene`    | 2.1 m, 5.0 kg     | 2.1 m, 5.1 kg    |
| `890-eternatus`    | 100.0 m, blank    | 20.0 m, 950.0 kg |
| `898-calyrex`      | 2.4 m, 53.6 kg    | 1.1 m, 7.7 kg    |
| `899-wyrdeer`      | blank             | 1.8 m, 95.1 kg   |
| `900-kleavor`      | blank             | 1.8 m, 89.0 kg   |
| `901-ursaluna`     | blank             | 2.4 m, 290.0 kg  |
| `901.1-ursaluna`   | 2.7 m, 333.0 kg   | 2.4 m, 290.0 kg  |
| `902-basculegion`  | blank             | 3.0 m, 110.0 kg  |
| `903-sneasler`     | blank             | 1.3 m, 43.0 kg   |
| `904-overqwil`     | blank             | 2.5 m, 60.5 kg   |
| `905-enamorus`     | blank             | 1.6 m, 48.0 kg   |
| `982-dudunsparce`  | 4.5 m, 47.4 kg    | 3.6 m, 39.2 kg   |
| `999.1-gimmighoul` | 0.1 m, 0.1 kg     | 0.1 m, 1.0 kg    |

`pokeApi/helpers.mjs` `convertHeightIntoFeetInches` rounds only the
leftover inches, so 3 dm gives 0′12″ instead of 1′00″. The README
formula rounds the total inches first.

## Pokedex types that disagree with PokeAPI

- `254.1-mega-sceptile`: `grass`, should be `grass`, `dragon`
- `334.1-mega-altaria`: `dragon`, `flying`, should be `dragon`, `fairy`
- `1017.3-ogerpon-cornerstone-mask`: `grass`, should be `grass`, `rock`

## Pokedex gender with `null` that isn't genderless

Blank gender values became `null`. These 16 aren't genderless, so the
`null` is missing data:

- `null` male, `100` female: Ogerpon (1017, 1017.1–1017.3), Archaludon
  (1018). Archaludon should be 50 / 50.
- `100` male, `null` female: Okidogi (1014), Munkidori (1015),
  Fezandipiti (1016), Bloodmoon Ursaluna (901.1)
- both `null`: Wyrdeer (899), Kleavor (900), Ursaluna (901), Basculegion
  (902), Sneasler (903), Overqwil (904), Enamorus (905)

## Pokedex entries filed under the wrong form

`128.3-tauros.json` (Aqua Breed) has its `pokedexEntries` under
"Blaze Breed".

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
- **Form tab ids**: the 28 new tabs use `#.01` ids, the other 93 use
  `#.1`.
