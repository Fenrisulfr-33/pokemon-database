# Pokedex entries

The state of `pokedexEntries` in `src/pokemon/pokedex/entries` and
`src/pokemon/forms` (checked 2026-11-12).

`pokedexEntries` is keyed by display name. Base pokemon files used to
hold some forms' entries under a second key as well (e.g. `Hisuian
Growlithe` in `58-growlithe.json`). On 2026-11-12 every entry that was
in both a base file and a form file was kept in one place only:

- A form's entry stays in the form's file and was removed from the base
  file (96 keys from 76 base files).
- The base's own entry stays in the base file and was removed from the
  form (12 form files): Zen Mode Darmanitan's `Darmanitan` (both
  copies), Three-Segment Dudunsparce's `Two-segment Form` (both
  copies), and the 6 Meteor Minior colors, Totem Disguised Mimikyu and
  50% Power Construct Zygarde, which only had a copy of the base entry.

For Zygarde, Minior, Mimikyu and Dudunsparce the base's own key is a
form name (`50% Forme`, `Meteor Form`, `Disguised Form`,
`Two-segment Form`), so those keys stayed in the base file.

## Summary

| Check | Count |
| --- | --- |
| `pokedex/entries` files with 2 or more keys | 24 |
| `pokedex/entries` forms with no entries (of 107) | 22 |
| `pokedex/entries` base pokemon with no entries | 24 |
| `forms/` files with no entries (of 553) | 360 |
| ...of those, base file has other keys | 131 |

## `pokedex/entries` files with 2 or more keys

| File | Keys | Key names |
| --- | --- | --- |
| `25-pikachu.json` | 2 | Pikachu, Cap Pikachu |
| `413-wormadam.json` | 3 | Plant Cloak, Sandy Cloak, Trash Cloak |
| `421-cherrim.json` | 2 | Cherrim, Overcast Form |
| `422-shellos.json` | 2 | Shellos, West Sea |
| `423-gastrodon.json` | 2 | Gastrodon, West Sea |
| `521-unfezant.json` | 3 | Unfezant, Female Unfezant, Male Unfezant |
| `550-basculin.json` | 2 | Basculin, Red-striped Form |
| `555-darmanitan.json` | 2 | Darmanitan, Standard Mode |
| `592-frillish.json` | 2 | Frillish, Male Frillish |
| `593-jellicent.json` | 2 | Jellicent, Male Jellicent |
| `647-keldeo.json` | 2 | Keldeo, Ordinary Form |
| `670-floette.json` | 2 | Floette, Eternal Flower |
| `678-meowstic.json` | 2 | Meowstic, Male |
| `681-aegislash.json` | 2 | Aegislash, Shield Forme |
| `710-pumpkaboo.json` | 5 | Pumpkaboo, Average Size, Small Size, Large Size, Super Size |
| `711-gourgeist.json` | 5 | Gourgeist, Average Size, Small Size, Large Size, Super Size |
| `741-oricorio.json` | 2 | Baile Style, Pa'u Style |
| `773-silvally.json` | 2 | Silvally, Memory Form |
| `774-minior.json` | 2 | Meteor Form, Core Form |
| `800-necrozma.json` | 3 | Necrozma, Dusk Mane Necrozma, Dawn Wings Necrozma |
| `869-alcremie.json` | 9 | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `875-eiscue.json` | 2 | Ice Face, Noice Face |
| `888-zacian.json` | 2 | Crowned Sword, Hero Of Many Battles |
| `889-zamazenta.json` | 2 | Crowned Shield, Hero Of Many Battles |

Things to look at:

- `422-shellos` and `423-gastrodon` have both `East Sea Form` and
  `East Sea`.
- `678-meowstic` and `876-indeedee` have a `Male` key; their
  `Female` entries are now only in the female form files.

## `pokedex/entries` forms with no entries

| File | Name |
| --- | --- |
| `208.1-mega-steelix.json` | Mega Steelix |
| `254.1-mega-sceptile.json` | Mega Sceptile |
| `257.1-mega-blaziken.json` | Mega Blaziken |
| `260.1-mega-swampert.json` | Mega Swampert |
| `282.1-mega-gardevoir.json` | Mega Gardevoir |
| `306.1-mega-aggron.json` | Mega Aggron |
| `308.1-mega-medicham.json` | Mega Medicham |
| `323.1-mega-camerupt.json` | Mega Camerupt |
| `334.1-mega-altaria.json` | Mega Altaria |
| `380.1-mega-latias.json` | Mega Latias |
| `381.1-mega-latios.json` | Mega Latios |
| `382.1-primal-kyogre.json` | Primal Kyogre |
| `383.1-primal-groudon.json` | Primal Groudon |
| `384.1-mega-rayquaza.json` | Mega Rayquaza |
| `460.1-mega-abomasnow.json` | Mega Abomasnow |
| `475.1-mega-gallade.json` | Mega Gallade |
| `531.1-mega-audino.json` | Mega Audino |
| `719.1-mega-diancie.json` | Mega Diancie |
| `901.1-ursaluna.json` | Ursaluna |
| `1017.1-ogerpon-wellspring-mask.json` | Ogerpon |
| `1017.2-ogerpon-hearthflame-mask.json` | Ogerpon |
| `1017.3-ogerpon-cornerstone-mask.json` | Ogerpon |

## `pokedex/entries` base pokemon with no entries

| File | Name |
| --- | --- |
| `899-wyrdeer.json` | Wyrdeer |
| `900-kleavor.json` | Kleavor |
| `901-ursaluna.json` | Ursaluna |
| `902-basculegion.json` | Basculegion |
| `903-sneasler.json` | Sneasler |
| `904-overqwil.json` | Overqwil |
| `905-enamorus.json` | Enamorus |
| `1009-walking-wake.json` | Walking Wake |
| `1010-iron-leaves.json` | Iron Leaves |
| `1011-dripplin.json` | Dipplin |
| `1012-poltchageist.json` | Poltchageist |
| `1013-sinistcha.json` | Sinistcha |
| `1014-okidogi.json` | Okidogi |
| `1015-monkidori.json` | Munkidori |
| `1016-fezandipiti.json` | Fezandipiti |
| `1017-ogerpon.json` | Ogerpon |
| `1018-archaludon.json` | Archaludon |
| `1019-hydrapple.json` | Hydrapple |
| `1020-gouging-fire.json` | Gouging Fire |
| `1021-raging-bolt.json` | Raging Bolt |
| `1022-iron-boulder.json` | Iron Boulder |
| `1023-iron-crown.json` | Iron Crown |
| `1024-terapagos.json` | Terapagos |
| `1025-pecharunt.json` | Pecharunt |

## `forms/` files with no entries

"Base file has" lists the base pokemon's other keys, where this form's
entries may already be.

| File | Name | Base file has |
| --- | --- | --- |
| `gigantamax/3.02-gmax-venusaur.json` | Gigantamax Venusaur | — |
| `gigantamax/9.02-gmax-blastoise.json` | Gigantamax Blastoise | — |
| `totem/20.02-totem-alola-raticate.json` | Totem Alolan Raticate | — |
| `pikachu/25.01-rock-star-pikachu.json` | Pikachu Rock Star | Cap Pikachu |
| `pikachu/25.02-belle-pikachu.json` | Pikachu Belle | Cap Pikachu |
| `pikachu/25.03-pop-star-pikachu.json` | Pikachu Pop Star | Cap Pikachu |
| `pikachu/25.04-phd-pikachu.json` | Pikachu Ph.D. | Cap Pikachu |
| `pikachu/25.05-libre-pikachu.json` | Pikachu Libre | Cap Pikachu |
| `pikachu/25.06-cosplay-pikachu.json` | Cosplay Pikachu | Cap Pikachu |
| `pikachu/25.14-starter-pikachu.json` | Partner Pikachu | Cap Pikachu |
| `megas/26.02-mega-x-raichu.json` | Mega Raichu X | — |
| `megas/26.03-mega-y-raichu.json` | Mega Raichu Y | — |
| `megas/36.01-mega-clefable.json` | Mega Clefable | — |
| `megas/71.01-mega-victreebel.json` | Mega Victreebel | — |
| `totem/105.02-totem-marowak.json` | Totem Alolan Marowak | — |
| `megas/121.01-mega-starmie.json` | Mega Starmie | — |
| `alternate/133.01-starter-eevee.json` | Partner Eevee | — |
| `megas/149.01-mega-dragonite.json` | Mega Dragonite | — |
| `megas/154.01-mega-meganium.json` | Mega Meganium | — |
| `megas/160.01-mega-feraligatr.json` | Mega Feraligatr | — |
| `cosmetic/172.01-spiky-eared-pichu.json` | Pichu | — |
| `cosmetic/201.01-b-unown.json` | Unown | — |
| `cosmetic/201.02-c-unown.json` | Unown | — |
| `cosmetic/201.03-d-unown.json` | Unown | — |
| `cosmetic/201.04-e-unown.json` | Unown | — |
| `cosmetic/201.05-f-unown.json` | Unown | — |
| `cosmetic/201.06-g-unown.json` | Unown | — |
| `cosmetic/201.07-h-unown.json` | Unown | — |
| `cosmetic/201.08-i-unown.json` | Unown | — |
| `cosmetic/201.09-j-unown.json` | Unown | — |
| `cosmetic/201.10-k-unown.json` | Unown | — |
| `cosmetic/201.11-l-unown.json` | Unown | — |
| `cosmetic/201.12-m-unown.json` | Unown | — |
| `cosmetic/201.13-n-unown.json` | Unown | — |
| `cosmetic/201.14-o-unown.json` | Unown | — |
| `cosmetic/201.15-p-unown.json` | Unown | — |
| `cosmetic/201.16-q-unown.json` | Unown | — |
| `cosmetic/201.17-r-unown.json` | Unown | — |
| `cosmetic/201.18-s-unown.json` | Unown | — |
| `cosmetic/201.19-t-unown.json` | Unown | — |
| `cosmetic/201.20-u-unown.json` | Unown | — |
| `cosmetic/201.21-v-unown.json` | Unown | — |
| `cosmetic/201.22-w-unown.json` | Unown | — |
| `cosmetic/201.23-x-unown.json` | Unown | — |
| `cosmetic/201.24-y-unown.json` | Unown | — |
| `cosmetic/201.25-z-unown.json` | Unown | — |
| `cosmetic/201.26-exclamation-unown.json` | Unown | — |
| `cosmetic/201.27-question-unown.json` | Unown | — |
| `megas/208.01-mega-steelix.json` | Mega Steelix | — |
| `megas/227.01-mega-skarmory.json` | Mega Skarmory | — |
| `megas/254.01-mega-sceptile.json` | Mega Sceptile | — |
| `megas/257.01-mega-blaziken.json` | Mega Blaziken | — |
| `megas/260.01-mega-swampert.json` | Mega Swampert | — |
| `megas/282.01-mega-gardevoir.json` | Mega Gardevoir | — |
| `megas/306.01-mega-aggron.json` | Mega Aggron | — |
| `megas/308.01-mega-medicham.json` | Mega Medicham | — |
| `megas/323.01-mega-camerupt.json` | Mega Camerupt | — |
| `megas/334.01-mega-altaria.json` | Mega Altaria | — |
| `megas/358.01-mega-chimecho.json` | Mega Chimecho | — |
| `megas/359.02-mega-z-absol.json` | Mega Absol Z | — |
| `megas/380.01-mega-latias.json` | Mega Latias | — |
| `megas/381.01-mega-latios.json` | Mega Latios | — |
| `primal/382.01-primal-kyogre.json` | Primal Kyogre | — |
| `primal/383.01-primal-groudon.json` | Primal Groudon | — |
| `megas/384.01-mega-rayquaza.json` | Mega Rayquaza | — |
| `alternate/386.01-attack-deoxys.json` | Attack Deoxys | — |
| `alternate/386.02-defense-deoxys.json` | Defense Deoxys | — |
| `alternate/386.03-speed-deoxys.json` | Speed Deoxys | — |
| `megas/398.01-mega-staraptor.json` | Mega Staraptor | — |
| `alternate/413.01-sandy-wormadam.json` | Sandy Wormadam | Plant Cloak, Sandy Cloak, Trash Cloak |
| `alternate/413.02-trash-wormadam.json` | Trash Wormadam | Plant Cloak, Sandy Cloak, Trash Cloak |
| `cosmetic/414.01-sandy-mothim.json` | Mothim | — |
| `cosmetic/414.02-trash-mothim.json` | Mothim | — |
| `megas/445.02-mega-z-garchomp.json` | Mega Garchomp Z | — |
| `megas/448.02-mega-z-lucario.json` | Mega Lucario Z | — |
| `megas/460.01-mega-abomasnow.json` | Mega Abomasnow | — |
| `megas/475.01-mega-gallade.json` | Mega Gallade | — |
| `megas/478.01-mega-froslass.json` | Mega Froslass | — |
| `rotom/479.01-heat-rotom.json` | Heat Rotom | — |
| `rotom/479.02-wash-rotom.json` | Wash Rotom | — |
| `rotom/479.03-frost-rotom.json` | Frost Rotom | — |
| `rotom/479.04-fan-rotom.json` | Fan Rotom | — |
| `rotom/479.05-mow-rotom.json` | Mow Rotom | — |
| `megas/485.01-mega-heatran.json` | Mega Heatran | — |
| `megas/491.01-mega-darkrai.json` | Mega Darkrai | — |
| `cosmetic/493.01-fighting-type-arceus.json` | Arceus | — |
| `cosmetic/493.02-flying-type-arceus.json` | Arceus | — |
| `cosmetic/493.03-poison-type-arceus.json` | Arceus | — |
| `cosmetic/493.04-ground-type-arceus.json` | Arceus | — |
| `cosmetic/493.05-rock-type-arceus.json` | Arceus | — |
| `cosmetic/493.06-bug-type-arceus.json` | Arceus | — |
| `cosmetic/493.07-ghost-type-arceus.json` | Arceus | — |
| `cosmetic/493.08-steel-type-arceus.json` | Arceus | — |
| `cosmetic/493.09-fire-type-arceus.json` | Arceus | — |
| `cosmetic/493.10-water-type-arceus.json` | Arceus | — |
| `cosmetic/493.11-grass-type-arceus.json` | Arceus | — |
| `cosmetic/493.12-electric-type-arceus.json` | Arceus | — |
| `cosmetic/493.13-psychic-type-arceus.json` | Arceus | — |
| `cosmetic/493.14-ice-type-arceus.json` | Arceus | — |
| `cosmetic/493.15-dragon-type-arceus.json` | Arceus | — |
| `cosmetic/493.16-dark-type-arceus.json` | Arceus | — |
| `cosmetic/493.17-fairy-type-arceus.json` | Arceus | — |
| `megas/500.01-mega-emboar.json` | Mega Emboar | — |
| `megas/530.01-mega-excadrill.json` | Mega Excadrill | — |
| `megas/531.01-mega-audino.json` | Mega Audino | — |
| `megas/545.01-mega-scolipede.json` | Mega Scolipede | — |
| `megas/560.01-mega-scrafty.json` | Mega Scrafty | — |
| `cosmetic/585.01-summer-form-deerling.json` | Deerling | — |
| `cosmetic/585.02-autumn-form-deerling.json` | Deerling | — |
| `cosmetic/585.03-winter-form-deerling.json` | Deerling | — |
| `cosmetic/586.01-summer-form-sawsbuck.json` | Sawsbuck | — |
| `cosmetic/586.02-autumn-form-sawsbuck.json` | Sawsbuck | — |
| `cosmetic/586.03-winter-form-sawsbuck.json` | Sawsbuck | — |
| `megas/604.01-mega-eelektross.json` | Mega Eelektross | — |
| `megas/609.01-mega-chandelure.json` | Mega Chandelure | — |
| `megas/623.01-mega-golurk.json` | Mega Golurk | — |
| `alternate/648.01-pirouette-meloetta.json` | Pirouette Meloetta | — |
| `cosmetic/649.01-douse-drive-genesect.json` | Genesect | — |
| `cosmetic/649.02-shock-drive-genesect.json` | Genesect | — |
| `cosmetic/649.03-burn-drive-genesect.json` | Genesect | — |
| `cosmetic/649.04-chill-drive-genesect.json` | Genesect | — |
| `megas/652.01-mega-chesnaught.json` | Mega Chesnaught | — |
| `megas/655.01-mega-delphox.json` | Mega Delphox | — |
| `alternate/658.01-battle-bond-greninja.json` | Battle Bond Greninja | — |
| `alternate/658.02-ash-greninja.json` | Ash’s Greninja | — |
| `megas/658.03-mega-greninja.json` | Mega Greninja | — |
| `cosmetic/664.01-polar-scatterbug.json` | Scatterbug | — |
| `cosmetic/664.02-tundra-scatterbug.json` | Scatterbug | — |
| `cosmetic/664.03-continental-scatterbug.json` | Scatterbug | — |
| `cosmetic/664.04-garden-scatterbug.json` | Scatterbug | — |
| `cosmetic/664.05-elegant-scatterbug.json` | Scatterbug | — |
| `cosmetic/664.06-meadow-scatterbug.json` | Scatterbug | — |
| `cosmetic/664.07-modern-scatterbug.json` | Scatterbug | — |
| `cosmetic/664.08-marine-scatterbug.json` | Scatterbug | — |
| `cosmetic/664.09-archipelago-scatterbug.json` | Scatterbug | — |
| `cosmetic/664.10-high-plains-scatterbug.json` | Scatterbug | — |
| `cosmetic/664.11-sandstorm-scatterbug.json` | Scatterbug | — |
| `cosmetic/664.12-river-scatterbug.json` | Scatterbug | — |
| `cosmetic/664.13-monsoon-scatterbug.json` | Scatterbug | — |
| `cosmetic/664.14-savanna-scatterbug.json` | Scatterbug | — |
| `cosmetic/664.15-sun-scatterbug.json` | Scatterbug | — |
| `cosmetic/664.16-ocean-scatterbug.json` | Scatterbug | — |
| `cosmetic/664.17-jungle-scatterbug.json` | Scatterbug | — |
| `cosmetic/664.18-fancy-scatterbug.json` | Scatterbug | — |
| `cosmetic/664.19-poke-ball-scatterbug.json` | Scatterbug | — |
| `cosmetic/665.01-polar-spewpa.json` | Spewpa | — |
| `cosmetic/665.02-tundra-spewpa.json` | Spewpa | — |
| `cosmetic/665.03-continental-spewpa.json` | Spewpa | — |
| `cosmetic/665.04-garden-spewpa.json` | Spewpa | — |
| `cosmetic/665.05-elegant-spewpa.json` | Spewpa | — |
| `cosmetic/665.06-meadow-spewpa.json` | Spewpa | — |
| `cosmetic/665.07-modern-spewpa.json` | Spewpa | — |
| `cosmetic/665.08-marine-spewpa.json` | Spewpa | — |
| `cosmetic/665.09-archipelago-spewpa.json` | Spewpa | — |
| `cosmetic/665.10-high-plains-spewpa.json` | Spewpa | — |
| `cosmetic/665.11-sandstorm-spewpa.json` | Spewpa | — |
| `cosmetic/665.12-river-spewpa.json` | Spewpa | — |
| `cosmetic/665.13-monsoon-spewpa.json` | Spewpa | — |
| `cosmetic/665.14-savanna-spewpa.json` | Spewpa | — |
| `cosmetic/665.15-sun-spewpa.json` | Spewpa | — |
| `cosmetic/665.16-ocean-spewpa.json` | Spewpa | — |
| `cosmetic/665.17-jungle-spewpa.json` | Spewpa | — |
| `cosmetic/665.18-fancy-spewpa.json` | Spewpa | — |
| `cosmetic/665.19-poke-ball-spewpa.json` | Spewpa | — |
| `cosmetic/666.01-icy-snow-pattern-vivillon.json` | Vivillon | — |
| `cosmetic/666.02-polar-pattern-vivillon.json` | Vivillon | — |
| `cosmetic/666.03-tundra-pattern-vivillon.json` | Vivillon | — |
| `cosmetic/666.04-continental-pattern-vivillon.json` | Vivillon | — |
| `cosmetic/666.05-garden-pattern-vivillon.json` | Vivillon | — |
| `cosmetic/666.06-elegant-pattern-vivillon.json` | Vivillon | — |
| `cosmetic/666.07-modern-pattern-vivillon.json` | Vivillon | — |
| `cosmetic/666.08-marine-pattern-vivillon.json` | Vivillon | — |
| `cosmetic/666.09-archipelago-pattern-vivillon.json` | Vivillon | — |
| `cosmetic/666.10-high-plains-pattern-vivillon.json` | Vivillon | — |
| `cosmetic/666.11-sandstorm-pattern-vivillon.json` | Vivillon | — |
| `cosmetic/666.12-river-pattern-vivillon.json` | Vivillon | — |
| `cosmetic/666.13-monsoon-pattern-vivillon.json` | Vivillon | — |
| `cosmetic/666.14-savanna-pattern-vivillon.json` | Vivillon | — |
| `cosmetic/666.15-sun-pattern-vivillon.json` | Vivillon | — |
| `cosmetic/666.16-ocean-pattern-vivillon.json` | Vivillon | — |
| `cosmetic/666.17-jungle-pattern-vivillon.json` | Vivillon | — |
| `cosmetic/666.18-fancy-pattern-vivillon.json` | Vivillon | — |
| `cosmetic/666.19-poke-ball-pattern-vivillon.json` | Vivillon | — |
| `megas/668.01-mega-pyroar.json` | Mega Pyroar | — |
| `cosmetic/668.02-female-pyroar.json` | Pyroar | — |
| `cosmetic/669.01-yellow-flower-flabebe.json` | Flabébé | Flabebe |
| `cosmetic/669.02-orange-flower-flabebe.json` | Flabébé | Flabebe |
| `cosmetic/669.03-blue-flower-flabebe.json` | Flabébé | Flabebe |
| `cosmetic/669.04-white-flower-flabebe.json` | Flabébé | Flabebe |
| `alternate/670.01-eternal-floette.json` | Eternal Floette | Eternal Flower |
| `megas/670.02-mega-floette.json` | Mega Floette | Eternal Flower |
| `cosmetic/670.03-yellow-flower-floette.json` | Floette | Eternal Flower |
| `cosmetic/670.04-orange-flower-floette.json` | Floette | Eternal Flower |
| `cosmetic/670.05-blue-flower-floette.json` | Floette | Eternal Flower |
| `cosmetic/670.06-white-flower-floette.json` | Floette | Eternal Flower |
| `cosmetic/671.01-yellow-flower-florges.json` | Florges | — |
| `cosmetic/671.02-orange-flower-florges.json` | Florges | — |
| `cosmetic/671.03-blue-flower-florges.json` | Florges | — |
| `cosmetic/671.04-white-flower-florges.json` | Florges | — |
| `cosmetic/676.01-heart-trim-furfrou.json` | Furfrou | — |
| `cosmetic/676.02-star-trim-furfrou.json` | Furfrou | — |
| `cosmetic/676.03-diamond-trim-furfrou.json` | Furfrou | — |
| `cosmetic/676.04-debutante-trim-furfrou.json` | Furfrou | — |
| `cosmetic/676.05-matron-trim-furfrou.json` | Furfrou | — |
| `cosmetic/676.06-dandy-trim-furfrou.json` | Furfrou | — |
| `cosmetic/676.07-la-reine-trim-furfrou.json` | Furfrou | — |
| `cosmetic/676.08-kabuki-trim-furfrou.json` | Furfrou | — |
| `cosmetic/676.09-pharaoh-trim-furfrou.json` | Furfrou | — |
| `megas/678.02-male-mega-meowstic.json` | Mega Meowstic | Male |
| `megas/678.03-female-mega-meowstic.json` | Mega Meowstic | Male |
| `megas/687.01-mega-malamar.json` | Mega Malamar | — |
| `megas/691.01-mega-dragalge.json` | Mega Dragalge | — |
| `megas/701.01-mega-hawlucha.json` | Mega Hawlucha | — |
| `alternate/710.01-small-pumpkaboo.json` | Small Pumpkaboo | Average Size, Small Size, Large Size, Super Size |
| `alternate/710.02-large-pumpkaboo.json` | Large Pumpkaboo | Average Size, Small Size, Large Size, Super Size |
| `alternate/710.03-super-pumpkaboo.json` | Super Pumpkaboo | Average Size, Small Size, Large Size, Super Size |
| `alternate/711.01-small-gourgeist.json` | Small Gourgeist | Average Size, Small Size, Large Size, Super Size |
| `alternate/711.02-large-gourgeist.json` | Large Gourgeist | Average Size, Small Size, Large Size, Super Size |
| `alternate/711.03-super-gourgeist.json` | Super Gourgeist | Average Size, Small Size, Large Size, Super Size |
| `cosmetic/716.01-active-mode-xerneas.json` | Xerneas | — |
| `alternate/718.02-50-power-construct-zygarde.json` | 50% Zygarde | 50% Forme |
| `megas/718.05-mega-zygarde.json` | Mega Zygarde | 50% Forme |
| `megas/719.01-mega-diancie.json` | Mega Diancie | — |
| `alternate/720.01-unbound-hoopa.json` | Hoopa Unbound | — |
| `totem/735.01-totem-gumshoos.json` | Totem Gumshoos | — |
| `totem/738.01-totem-vikavolt.json` | Totem Vikavolt | — |
| `megas/740.01-mega-crabominable.json` | Mega Crabominable | — |
| `alternate/741.02-pau-oricorio.json` | Pa’u Oricorio | Baile Style, Pa'u Style |
| `totem/743.01-totem-ribombee.json` | Totem Ribombee | — |
| `totem/752.01-totem-araquanid.json` | Totem Araquanid | — |
| `totem/754.01-totem-lurantis.json` | Totem Lurantis | — |
| `totem/758.01-totem-salazzle.json` | Totem Salazzle | — |
| `megas/768.01-mega-golisopod.json` | Mega Golisopod | — |
| `cosmetic/773.01-type-fighting-silvally.json` | Silvally | Memory Form |
| `cosmetic/773.02-type-flying-silvally.json` | Silvally | Memory Form |
| `cosmetic/773.03-type-poison-silvally.json` | Silvally | Memory Form |
| `cosmetic/773.04-type-ground-silvally.json` | Silvally | Memory Form |
| `cosmetic/773.05-type-rock-silvally.json` | Silvally | Memory Form |
| `cosmetic/773.06-type-bug-silvally.json` | Silvally | Memory Form |
| `cosmetic/773.07-type-ghost-silvally.json` | Silvally | Memory Form |
| `cosmetic/773.08-type-steel-silvally.json` | Silvally | Memory Form |
| `cosmetic/773.09-type-fire-silvally.json` | Silvally | Memory Form |
| `cosmetic/773.10-type-water-silvally.json` | Silvally | Memory Form |
| `cosmetic/773.11-type-grass-silvally.json` | Silvally | Memory Form |
| `cosmetic/773.12-type-electric-silvally.json` | Silvally | Memory Form |
| `cosmetic/773.13-type-psychic-silvally.json` | Silvally | Memory Form |
| `cosmetic/773.14-type-ice-silvally.json` | Silvally | Memory Form |
| `cosmetic/773.15-type-dragon-silvally.json` | Silvally | Memory Form |
| `cosmetic/773.16-type-dark-silvally.json` | Silvally | Memory Form |
| `cosmetic/773.17-type-fairy-silvally.json` | Silvally | Memory Form |
| `alternate/774.01-orange-meteor-minior.json` | Orange Meteor Minior | Meteor Form, Core Form |
| `alternate/774.02-yellow-meteor-minior.json` | Yellow Meteor Minior | Meteor Form, Core Form |
| `alternate/774.03-green-meteor-minior.json` | Green Meteor Minior | Meteor Form, Core Form |
| `alternate/774.04-blue-meteor-minior.json` | Blue Meteor Minior | Meteor Form, Core Form |
| `alternate/774.05-indigo-meteor-minior.json` | Indigo Meteor Minior | Meteor Form, Core Form |
| `alternate/774.06-violet-meteor-minior.json` | Violet Meteor Minior | Meteor Form, Core Form |
| `alternate/774.07-red-minior.json` | Red Core Minior | Meteor Form, Core Form |
| `alternate/774.08-orange-minior.json` | Orange Core Minior | Meteor Form, Core Form |
| `alternate/774.09-yellow-minior.json` | Yellow Core Minior | Meteor Form, Core Form |
| `alternate/774.10-green-minior.json` | Green Core Minior | Meteor Form, Core Form |
| `alternate/774.11-blue-minior.json` | Blue Core Minior | Meteor Form, Core Form |
| `alternate/774.12-indigo-minior.json` | Indigo Core Minior | Meteor Form, Core Form |
| `alternate/774.13-violet-minior.json` | Violet Core Minior | Meteor Form, Core Form |
| `totem/777.01-totem-togedemaru.json` | Totem Togedemaru | — |
| `totem/778.02-totem-disguised-mimikyu.json` | Totem Disguised Mimikyu | Disguised Form |
| `megas/780.01-mega-drampa.json` | Mega Drampa | — |
| `totem/784.01-totem-kommo-o.json` | Totem Kommo-o | — |
| `alternate/800.01-dusk-necrozma.json` | Dusk Necrozma | Dusk Mane Necrozma, Dawn Wings Necrozma |
| `alternate/800.02-dawn-necrozma.json` | Dawn Necrozma | Dusk Mane Necrozma, Dawn Wings Necrozma |
| `megas/801.02-mega-magearna.json` | Mega Magearna | — |
| `megas/801.03-original-mega-magearna.json` | Mega Original Magearna | — |
| `megas/807.01-mega-zeraora.json` | Mega Zeraora | — |
| `cosmetic/869.02-ruby-cream-strawberry-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.03-matcha-cream-strawberry-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.04-mint-cream-strawberry-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.05-lemon-cream-strawberry-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.06-salted-cream-strawberry-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.07-ruby-swirl-strawberry-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.08-caramel-swirl-strawberry-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.09-rainbow-swirl-strawberry-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.10-vanilla-cream-berry-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.11-ruby-cream-berry-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.12-matcha-cream-berry-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.13-mint-cream-berry-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.14-lemon-cream-berry-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.15-salted-cream-berry-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.16-ruby-swirl-berry-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.17-caramel-swirl-berry-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.18-rainbow-swirl-berry-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.19-vanilla-cream-love-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.20-ruby-cream-love-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.21-matcha-cream-love-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.22-mint-cream-love-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.23-lemon-cream-love-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.24-salted-cream-love-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.25-ruby-swirl-love-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.26-caramel-swirl-love-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.27-rainbow-swirl-love-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.28-vanilla-cream-star-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.29-ruby-cream-star-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.30-matcha-cream-star-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.31-mint-cream-star-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.32-lemon-cream-star-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.33-salted-cream-star-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.34-ruby-swirl-star-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.35-caramel-swirl-star-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.36-rainbow-swirl-star-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.37-vanilla-cream-clover-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.38-ruby-cream-clover-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.39-matcha-cream-clover-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.40-mint-cream-clover-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.41-lemon-cream-clover-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.42-salted-cream-clover-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.43-ruby-swirl-clover-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.44-caramel-swirl-clover-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.45-rainbow-swirl-clover-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.46-vanilla-cream-flower-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.47-ruby-cream-flower-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.48-matcha-cream-flower-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.49-mint-cream-flower-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.50-lemon-cream-flower-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.51-salted-cream-flower-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.52-ruby-swirl-flower-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.53-caramel-swirl-flower-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.54-rainbow-swirl-flower-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.55-vanilla-cream-ribbon-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.56-ruby-cream-ribbon-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.57-matcha-cream-ribbon-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.58-mint-cream-ribbon-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.59-lemon-cream-ribbon-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.60-salted-cream-ribbon-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.61-ruby-swirl-ribbon-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.62-caramel-swirl-ribbon-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `cosmetic/869.63-rainbow-swirl-ribbon-sweet-alcremie.json` | Alcremie | Caramel Swirl Flavor, Vanilla Cream Flavor, Lemon Cream Flavor, Matcha Cream Flavor, Salted Cream Flavor, Mint Cream Flavor, Rainbow Swirl Flavor, Ruby Swirl Flavor, Ruby Cream Flavor |
| `megas/870.01-mega-falinks.json` | Mega Falinks | — |
| `alternate/875.01-noice-eiscue.json` | Noice Eiscue | Ice Face, Noice Face |
| `alternate/888.01-crowned-zacian.json` | Crowned Zacian | Crowned Sword, Hero Of Many Battles |
| `alternate/889.01-crowned-zamazenta.json` | Crowned Zamazenta | Crowned Shield, Hero Of Many Battles |
| `alternate/901.01-bloodmoon-ursaluna.json` | Bloodmoon Ursaluna | — |
| `alternate/902.01-female-basculegion.json` | Female Basculegion | — |
| `alternate/905.01-therian-enamorus.json` | Therian Enamorus | — |
| `megas/952.01-mega-scovillain.json` | Mega Scovillain | — |
| `megas/970.01-mega-glimmora.json` | Mega Glimmora | — |
| `megas/978.03-curly-mega-tatsugiri.json` | Mega Curly Tatsugiri | Curly Form |
| `megas/978.04-droopy-mega-tatsugiri.json` | Mega Droopy Tatsugiri | Curly Form |
| `megas/978.05-stretchy-mega-tatsugiri.json` | Mega Stretchy Tatsugiri | Curly Form |
| `megas/998.01-mega-baxcalibur.json` | Mega Baxcalibur | — |
| `alternate/1007.02-sprinting-build-koraidon.json` | Sprinting Build Koraidon | — |
| `alternate/1007.03-swimming-build-koraidon.json` | Swimming Build Koraidon | — |
| `alternate/1007.04-gliding-build-koraidon.json` | Gliding Build Koraidon | — |
| `alternate/1008.02-drive-mode-miraidon.json` | Drive Mode Miraidon | — |
| `alternate/1008.03-aquatic-mode-miraidon.json` | Aquatic Mode Miraidon | — |
| `alternate/1008.04-glide-mode-miraidon.json` | Glide Mode Miraidon | — |
| `cosmetic/1012.01-artisan-form-poltchageist.json` | Poltchageist | — |
| `cosmetic/1013.01-masterpiece-form-sinistcha.json` | Sinistcha | — |
| `alternate/1017.01-wellspring-mask-ogerpon.json` | Wellspring Mask Ogerpon | — |
| `alternate/1017.02-hearthflame-mask-ogerpon.json` | Hearthflame Mask Ogerpon | — |
| `alternate/1017.03-cornerstone-mask-ogerpon.json` | Cornerstone Mask Ogerpon | — |
| `alternate/1024.01-terastal-terapagos.json` | Terastal Form Terapagos | — |
| `alternate/1024.02-stellar-terapagos.json` | Stellar Form Terapagos | — |
