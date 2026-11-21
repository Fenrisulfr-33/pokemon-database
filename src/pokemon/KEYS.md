# Keys

Short keys for games, dexes and move learn methods.
Game and move keys are unique across both tables, so they can share a
namespace. A dex key is either the key of the game it belongs to or a
new key that no game or move uses.

## Games

Each row is a single game (`gold`), a PokeAPI version group
(`gold-silver`), or games from the same group (`gold-silver-crystal`
style, e.g. `diamond-pearl-platinum`). Games from different groups are
never combined: `x` and `omega-ruby` get separate entries even when the
text is the same. Names are PokeAPI's. In code, use `GAME_KEYS` from
`constants/GAME_KEYS.js` (name → key); it has every row below.

`pokedexEntries` is how many entries in `src/pokemon/pokedex/entries`
use that key (counted 2026-11-20).

| Gen | Game                              | Key    | pokedexEntries |
| --- | --------------------------------- | ------ | -------------- |
| 1   | `red`                             | `re`   | 0              |
| 1   | `blue`                            | `bl`   | 0              |
| 1   | `green`                           | `gr`   | 0              |
| 1   | `red-blue`                        | `rb`   | 151            |
| 1   | `red-green-japan`                 | `rgjp` | 0              |
| 1   | `blue-japan`                      | `bljp` | 0              |
| 1   | `yellow`                          | `ye`   | 151            |
| 2   | `gold`                            | `go`   | 251            |
| 2   | `silver`                          | `si`   | 251            |
| 2   | `gold-silver`                     | `gs`   | 0              |
| 2   | `crystal`                         | `cr`   | 251            |
| 3   | `ruby`                            | `ru`   | 206            |
| 3   | `sapphire`                        | `sa`   | 206            |
| 3   | `ruby-sapphire`                   | `rs`   | 180            |
| 3   | `emerald`                         | `em`   | 386            |
| 3   | `ruby-sapphire-emerald`           | `rse`  | 0              |
| 3   | `firered`                         | `fr`   | 251            |
| 3   | `leafgreen`                       | `lg`   | 251            |
| 3   | `firered-leafgreen`               | `frlg` | 135            |
| 3   | `colosseum`                       | `co`   | 0              |
| 3   | `xd`                              | `xd`   | 0              |
| 4   | `diamond`                         | `di`   | 156            |
| 4   | `pearl`                           | `prl`  | 156            |
| 4   | `diamond-pearl`                   | `dp`   | 63             |
| 4   | `platinum`                        | `pt`   | 219            |
| 4   | `diamond-pearl-platinum`          | `dpp`  | 274            |
| 4   | `heartgold`                       | `hg`   | 258            |
| 4   | `soulsilver`                      | `ss`   | 258            |
| 4   | `heartgold-soulsilver`            | `hgss` | 235            |
| 5   | `black`                           | `bk`   | 156            |
| 5   | `white`                           | `wh`   | 156            |
| 5   | `black-white`                     | `bw`   | 493            |
| 5   | `black-2`                         | `bk2`  | 0              |
| 5   | `white-2`                         | `wh2`  | 0              |
| 5   | `black-2-white-2`                 | `b2w2` | 649            |
| 6   | `x`                               | `x`    | 721            |
| 6   | `y`                               | `y`    | 721            |
| 6   | `x-y`                             | `xy`   | 0              |
| 6   | `omega-ruby`                      | `or`   | 537            |
| 6   | `alpha-sapphire`                  | `as`   | 537            |
| 6   | `omega-ruby-alpha-sapphire`       | `oras` | 184            |
| 7   | `sun`                             | `su`   | 302            |
| 7   | `moon`                            | `mo`   | 302            |
| 7   | `sun-moon`                        | `sm`   | 0              |
| 7   | `ultra-sun`                       | `us`   | 403            |
| 7   | `ultra-moon`                      | `um`   | 403            |
| 7   | `ultra-sun-ultra-moon`            | `usum` | 0              |
| 7   | `lets-go-pikachu`                 | `lgp`  | 0              |
| 7   | `lets-go-eevee`                   | `lge`  | 0              |
| 7   | `lets-go-pikachu-lets-go-eevee`   | `lgpe` | 153            |
| 8   | `sword`                           | `sw`   | 611            |
| 8   | `shield`                          | `sh`   | 611            |
| 8   | `sword-shield`                    | `swsh` | 0              |
| 8   | `the-isle-of-armor`               | `ioa`  | 0              |
| 8   | `the-crown-tundra`                | `ct`   | 0              |
| 8   | `brilliant-diamond`               | `bd`   | 155            |
| 8   | `shining-pearl`                   | `shp`  | 155            |
| 8   | `brilliant-diamond-shining-pearl` | `bdsp` | 338            |
| 8   | `legends-arceus`                  | `la`   | 226            |
| 9   | `scarlet`                         | `sc`   | 664            |
| 9   | `violet`                          | `vi`   | 664            |
| 9   | `scarlet-violet`                  | `sv`   | 0              |
| 9   | `the-teal-mask`                   | `ttm`  | 0              |
| 9   | `the-indigo-disk`                 | `tid`  | 0              |
| 9   | `legends-za`                      | `za`   | 364            |
| 9   | `mega-dimension`                  | `md`   | 0              |
| 9   | `champions`                       | `ch`   | 0              |

`the-teal-mask` uses `ttm` (not `tm`) so it doesn't collide with
technical machines.

`shining-pearl` uses `shp` (not `sp`) so it doesn't collide with
`special`.

## Dexes

One key per regional dex in `pokedex/dexes/dexes_objects`. A dex used
by one version group reuses that group's game key (`dp`, `swsh`). A
dex shared by several groups (`red-blue-yellow`) or covering one area
of a game (`x-y-central`, `sun-moon-melemele`) gets its own key. In code, use
`DEXES_KEYS` from `constants/DEXES_KEYS.js` (dex name → key).

| Dex                               | Key       |
| --------------------------------- | --------- |
| `red-blue-yellow`                 | `rby`     |
| `gold-silver-crystal`             | `gsc`     |
| `ruby-sapphire-emerald`           | `rse`     |
| `firered-leafgreen`               | `frlg`    |
| `diamond-pearl`                   | `dp`      |
| `platinum`                        | `pt`      |
| `heartgold-soulsilver`            | `hgss`    |
| `black-white`                     | `bw`      |
| `black-2-white-2`                 | `b2w2`    |
| `x-y-central`                     | `xycen`   |
| `x-y-coastal`                     | `xycoa`   |
| `x-y-mountain`                    | `xymou`   |
| `omega-ruby-alpha-sapphire`       | `oras`    |
| `sun-moon-alola`                  | `sm`      |
| `sun-moon-melemele`               | `smmel`   |
| `sun-moon-akala`                  | `smaka`   |
| `sun-moon-ulaula`                 | `smula`   |
| `sun-moon-poni`                   | `smpon`   |
| `ultra-sun-ultra-moon-alola`      | `usum`    |
| `ultra-sun-ultra-moon-melemele`   | `usummel` |
| `ultra-sun-ultra-moon-akala`      | `usumaka` |
| `ultra-sun-ultra-moon-ulaula`     | `usumula` |
| `ultra-sun-ultra-moon-poni`       | `usumpon` |
| `lets-go-pikachu-lets-go-eevee`   | `lgpe`    |
| `sword-shield`                    | `swsh`    |
| `isle-of-armor`                   | `ioa`     |
| `crown-tundra`                    | `ct`      |
| `brilliant-diamond-shining-pearl` | `bdsp`    |
| `legends-arceus`                  | `la`      |
| `scarlet-violet`                  | `sv`      |
| `the-teal-mask`                   | `ttm`     |
| `the-indigo-disk`                 | `tid`     |
| `legends-za`                      | `za`      |
| `mega-dimension`                  | `md`      |

## Move learn methods

Collected from `moves/games/*.json`, `legends-za-moves.json` and the
PokeAPI `move_learn_method` values in `pokeApi/pokemon/*.json`.

Source: **G** = game files, **P** = PokeAPI.

| Learn method              | Key   | Src | Notes                           |
| ------------------------- | ----- | --- | ------------------------------- |
| `level-up`                | `lv`  | G P | All games                       |
| `technical-machine`       | `tm`  | G   | All games except LA             |
| `hidden-machine`          | `hm`  | G   | Gen 1–6                         |
| `technical-record`        | `tr`  | G   | SwSh only                       |
| `machine`                 | `mc`  | P   | PokeAPI's TM + HM + TR          |
| `egg`                     | `eg`  | G P | Gen 2+, not LGPE/LA/ZA          |
| `tutor`                   | `tu`  | G P | Move tutors                     |
| `evolution`               | `ev`  | G   | Learned on evolving, SM+        |
| `pre-evolution`           | `pe`  | G   | Only via a pre-evolution, ≤USUM |
| `reminder`                | `rm`  | G   | Move reminder, SV and ZA        |
| `transfer-only`           | `to`  | G   | Only from older games, DP–USUM  |
| `special`                 | `sp`  | G   | Events, Pokewalker, PBR, etc.   |
| `special-moves`           | `spm` | G   | LGPE's version of `special`     |
| `train`                   | `trn` | P   | Champions                       |
| `form-change`             | `fc`  | P   | Learned on form change (Rotom)  |
| `zygarde-cube`            | `zc`  | P   | Zygarde Cube moves              |
| `light-ball-egg`          | `lbe` | P   | Volt Tackle via Light Ball      |
| `stadium-surfing-pikachu` | `ssp` | P   | Stadium Surfing Pikachu         |
| `xd-purification`         | `xdp` | P   | XD purification                 |
| `xd-shadow`               | `xds` | P   | XD Shadow moves (no data yet)   |
| `colosseum-purification`  | `cop` | P   | Colosseum (no data yet)         |
