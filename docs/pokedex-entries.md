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
| `pokedex/entries` files with 2 or more keys | 27 |
| `pokedex/entries` forms with no entries (of 107) | 22 |
| `pokedex/entries` base pokemon with no entries | 24 |
| `forms/` files with no entries (of 326) | 142 |
| ...of those, base file has other keys | 44 |

## `pokedex/entries` files with 2 or more keys

| File | Keys | Key names |
| --- | --- | --- |
| `25-pikachu.json` | 2 | Pikachu, Cap Pikachu |
| `412-burmy.json` | 3 | Plant Cloak, Sandy Cloak, Trash Cloak |
| `413-wormadam.json` | 3 | Plant Cloak, Sandy Cloak, Trash Cloak |
| `421-cherrim.json` | 3 | Cherrim, Overcast Form, Sunshine Form |
| `422-shellos.json` | 4 | Shellos, East Sea Form, West Sea Form, East Sea |
| `423-gastrodon.json` | 4 | Gastrodon, East Sea Form, West Sea Form, East Sea |
| `521-unfezant.json` | 3 | Unfezant, Female Unfezant, Male Unfezant |
| `550-basculin.json` | 2 | Basculin, Red-striped Form |
| `555-darmanitan.json` | 2 | Darmanitan, Standard Mode |
| `592-frillish.json` | 3 | Frillish, Female Frillish, Male Frillish |
| `593-jellicent.json` | 3 | Jellicent, Female Jellicent, Male Jellicent |
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
| `854-sinistea.json` | 2 | Antique Form, Phony Form |
| `855-polteageist.json` | 2 | Antique Form, Phony Form |
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
| `megas/500.01-mega-emboar.json` | Mega Emboar | — |
| `megas/530.01-mega-excadrill.json` | Mega Excadrill | — |
| `megas/531.01-mega-audino.json` | Mega Audino | — |
| `megas/545.01-mega-scolipede.json` | Mega Scolipede | — |
| `megas/560.01-mega-scrafty.json` | Mega Scrafty | — |
| `megas/604.01-mega-eelektross.json` | Mega Eelektross | — |
| `megas/609.01-mega-chandelure.json` | Mega Chandelure | — |
| `megas/623.01-mega-golurk.json` | Mega Golurk | — |
| `alternate/648.01-pirouette-meloetta.json` | Pirouette Meloetta | — |
| `megas/652.01-mega-chesnaught.json` | Mega Chesnaught | — |
| `megas/655.01-mega-delphox.json` | Mega Delphox | — |
| `alternate/658.01-battle-bond-greninja.json` | Battle Bond Greninja | — |
| `alternate/658.02-ash-greninja.json` | Ash’s Greninja | — |
| `megas/658.03-mega-greninja.json` | Mega Greninja | — |
| `megas/668.01-mega-pyroar.json` | Mega Pyroar | — |
| `alternate/670.01-eternal-floette.json` | Eternal Floette | Eternal Flower |
| `megas/670.02-mega-floette.json` | Mega Floette | Eternal Flower |
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
| `alternate/1017.01-wellspring-mask-ogerpon.json` | Wellspring Mask Ogerpon | — |
| `alternate/1017.02-hearthflame-mask-ogerpon.json` | Hearthflame Mask Ogerpon | — |
| `alternate/1017.03-cornerstone-mask-ogerpon.json` | Cornerstone Mask Ogerpon | — |
| `alternate/1024.01-terastal-terapagos.json` | Terastal Form Terapagos | — |
| `alternate/1024.02-stellar-terapagos.json` | Stellar Form Terapagos | — |
