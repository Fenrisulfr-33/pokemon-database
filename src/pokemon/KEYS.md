# Keys

Short keys for games (PokeAPI version groups) and move learn methods.
Every key is unique across both tables, so they can share a namespace.

## Games

Ordered to match `games_order` in `pokeApi/CONSTANTS.mjs`. In code, use
`GAME_KEYS` from `constants/GAME_KEYS.js` (version group → key).

| Gen | Version group                     | Key    |
| --- | --------------------------------- | ------ |
| 1   | `red-blue`                        | `rb`   |
| 1   | `yellow`                          | `ye`   |
| 2   | `gold-silver`                     | `gs`   |
| 2   | `crystal`                         | `cr`   |
| 3   | `ruby-sapphire`                   | `rs`   |
| 3   | `emerald`                         | `em`   |
| 3   | `firered-leafgreen`               | `frlg` |
| 4   | `diamond-pearl`                   | `dp`   |
| 4   | `platinum`                        | `pt`   |
| 4   | `heartgold-soulsilver`            | `hgss` |
| 5   | `black-white`                     | `bw`   |
| 3   | `colosseum`                       | `co`   |
| 3   | `xd`                              | `xd`   |
| 5   | `black-2-white-2`                 | `b2w2` |
| 6   | `x-y`                             | `xy`   |
| 6   | `omega-ruby-alpha-sapphire`       | `oras` |
| 7   | `sun-moon`                        | `sm`   |
| 7   | `ultra-sun-ultra-moon`            | `usum` |
| 7   | `lets-go-pikachu-lets-go-eevee`   | `lgpe` |
| 8   | `sword-shield`                    | `swsh` |
| 8   | `the-isle-of-armor`               | `ioa`  |
| 8   | `the-crown-tundra`                | `ct`   |
| 8   | `brilliant-diamond-shining-pearl` | `bdsp` |
| 8   | `legends-arceus`                  | `la`   |
| 9   | `scarlet-violet`                  | `sv`   |
| 9   | `the-teal-mask`                   | `ttm`  |
| 9   | `the-indigo-disk`                 | `tid`  |
| 1   | `red-green-japan`                 | `rgjp` |
| 1   | `blue-japan`                      | `bljp` |
| 9   | `legends-za`                      | `za`   |
| 9   | `mega-dimension`                  | `md`   |
| 9   | `champions`                       | `ch`   |

`the-teal-mask` uses `ttm` (not `tm`) so it doesn't collide with
technical machines.

## Move learn methods

Collected from `moves/games/*.json`, `legends-za-moves.json` and the
PokeAPI `move_learn_method` values in `pokeApi/pokemon/*.json`.

Source: **G** = game files, **P** = PokeAPI.

| Learn method              | Key   | Src | Notes                          |
| ------------------------- | ----- | --- | ------------------------------ |
| `level-up`                | `lv`  | G P | All games                      |
| `technical-machine`       | `tm`  | G   | All games except LA            |
| `hidden-machine`          | `hm`  | G   | Gen 1–6                        |
| `technical-record`        | `tr`  | G   | SwSh only                      |
| `machine`                 | `mc`  | P   | PokeAPI's TM + HM + TR         |
| `egg`                     | `eg`  | G P | Gen 2+, not LGPE/LA/ZA         |
| `tutor`                   | `tu`  | G P | Move tutors                    |
| `evolution`               | `ev`  | G   | Learned on evolving, SM+       |
| `pre-evolution`           | `pe`  | G   | Only via a pre-evolution, ≤USUM |
| `reminder`                | `rm`  | G   | Move reminder, SV and ZA       |
| `transfer-only`           | `to`  | G   | Only from older games, DP–USUM |
| `special`                 | `sp`  | G   | Events, Pokewalker, PBR, etc.  |
| `special-moves`           | `spm` | G   | LGPE's version of `special`    |
| `train`                   | `trn` | P   | Champions                      |
| `form-change`             | `fc`  | P   | Learned on form change (Rotom) |
| `zygarde-cube`            | `zc`  | P   | Zygarde Cube moves             |
| `light-ball-egg`          | `lbe` | P   | Volt Tackle via Light Ball     |
| `stadium-surfing-pikachu` | `ssp` | P   | Stadium Surfing Pikachu        |
| `xd-purification`         | `xdp` | P   | XD purification                |
| `xd-shadow`               | `xds` | P   | XD Shadow moves (no data yet)  |
| `colosseum-purification`  | `cop` | P   | Colosseum (no data yet)        |
