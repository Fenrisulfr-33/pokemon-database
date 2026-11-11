# PokeApi `abilities`

The `https://pokeapi.co/api/v2/ability/{id/name}` endpoint returns ability data

### Building entries

`node src/pokemon/pokeApi/abilities/getAbilities.js` fetches abilities
1 to `amountOfAbilities` (`CONSTANTS.mjs`), converts each one to the
target format below, and writes it to
`src/pokemon/pokeApi/abilities/entries/{id}-{name}.json`. Files that
already exist are overwritten.

`pokemonWithAbility` is copied from the matching file in
`src/pokemon/abilities/entries/` (matched by id). Abilities with no
matching file are written without it.

### Template for return data
```json
{
  "id": 1,
  "name": "stench",
  "is_main_series": true,
  "generation": {
    "name": "generation-iii",
    "url": "https://pokeapi.co/api/v2/generation/3/"
  },
  "names": [
    {
      "name": "Stench",
      "language": {
        "name": "en",
        "url": "https://pokeapi.co/api/v2/language/9/"
      }
    }
  ],
  "effect_entries": [
    {
      "effect": "This Pokémon's damaging moves have a 10% chance to make the target [flinch]{mechanic:flinch} with each hit if they do not already cause flinching as a secondary effect.\n\nThis ability does not stack with a held item.\n\nOverworld: The wild encounter rate is halved while this Pokémon is first in the party.",
      "short_effect": "Has a 10% chance of making target Pokémon [flinch]{mechanic:flinch} with each hit.",
      "language": {
        "name": "en",
        "url": "https://pokeapi.co/api/v2/language/9/"
      }
    }
  ],
  "effect_changes": [
    {
      "version_group": {
        "name": "black-white",
        "url": "https://pokeapi.co/api/v2/version-group/11/"
      },
      "effect_entries": [
        {
          "effect": "Has no effect in battle.",
          "language": {
            "name": "en",
            "url": "https://pokeapi.co/api/v2/language/9/"
          }
        }
      ]
    }
  ],
  "flavor_text_entries": [
    {
      "flavor_text": "è‡­ãã¦ã€€ç›¸æ‰‹ãŒ\nã²ã‚‹ã‚€ã€€ã“ã¨ãŒã‚ã‚‹ã€‚",
      "language": {
        "name": "ja-kanji",
        "url": "https://pokeapi.co/api/v2/language/11/"
      },
      "version_group": {
        "name": "x-y",
        "url": "https://pokeapi.co/api/v2/version-group/15/"
      }
    }
  ],
  "pokemon": [
    {
      "is_hidden": true,
      "slot": 3,
      "pokemon": {
        "name": "gloom",
        "url": "https://pokeapi.co/api/v2/pokemon/44/"
      }
    }
  ]
}
```

### Target format

The response should be turned into the shape used by
`src/pokemon/abilities/entries/`. Built from the sample response above:

```json
{
  "_id": 1,
  "key": "stench",
  "name": {
    "english": "Stench"
  },
  "generation": 3,
  "effect": {
    "shortEffect": "Has a 10% chance of making target Pokémon flinch with each hit.",
    "full": "This Pokémon's damaging moves have a 10% chance to make the target flinch with each hit if they do not already cause flinching as a secondary effect. This ability does not stack with a held item. Overworld: The wild encounter rate is halved while this Pokémon is first in the party."
  },
  "effectChanges": {
    "english": {
      "bw": "Has no effect in battle."
    }
  },
  "flavorText": {
    "japanese-kanji": {
      "xy": "臭くて　相手が ひるむ　ことがある。"
    }
  },
  "pokemonWithAbility": {
    "normal": [88, 89, 434, 435, 568, 569],
    "hidden": [44, 109, 110]
  }
}
```

The sample's `flavor_text` is mis-encoded (UTF-8 read as Windows-1252).
The output above shows the decoded text.

### Field mapping

| Entry field          | PokeAPI source                                  |
| -------------------- | ----------------------------------------------- |
| `_id`                | `id`                                            |
| `key`                | `name`                                          |
| `name`               | every `names[]` item, keyed by language         |
| `generation`         | `generation.name` via `generationKey`           |
| `effect.shortEffect` | `effect_entries[]` where language is `en`, `short_effect` |
| `effect.full`        | `effect_entries[]` where language is `en`, `effect` |
| `effectChanges`      | every `effect_changes[].effect_entries[]`, keyed by language, then game |
| `flavorText`         | every `flavor_text_entries[]` item, keyed by language, then game |
| `pokemonWithAbility` | not taken from PokeAPI (see below)              |

- `name`: each `names[]` item becomes `name[<language>] = item.name`.
- `effectChanges`: each entry becomes
  `effectChanges[<language>][<game>] = entry.effect`.
- `flavorText`: each entry becomes
  `flavorText[<language>][<game>] = entry.flavor_text`.

Every language in the response is kept. Only `name.english` is required.

`<game>` is the short key for `version_group.name` from `GAME_KEYS` in
`src/pokemon/constants/GAME_KEYS.js` (`sword-shield` → `swsh`). A
version group that isn't in `GAME_KEYS` is stored under its full name.

### Language keys

| PokeAPI code | Entry key                |
| ------------ | ------------------------ |
| `en`         | `english`                |
| `es`         | `spanish`                |
| `es-419`     | `latin-american-spanish` |
| `it`         | `italian`                |
| `fr`         | `french`                 |
| `de`         | `german`                 |
| `cs`         | `czech`                  |
| `pt-br`      | `brazilian-portuguese`   |
| `ja`         | `japanese`               |
| `ja-hrkt`    | `japanese-kana`          |
| `ja-kanji`   | `japanese-kanji`         |
| `roomaji`    | `romaji`                 |
| `ko`         | `korean`                 |
| `zh-hant`    | `traditional-chinese`    |
| `zh-hans`    | `simplified-chinese`     |

A code that isn't in this table is stored under the code itself, so no
language is lost.

### Text cleanup

- Effect text uses PokeAPI link markup such as
  `[flinch]{mechanic:flinch}`. Keep only the label (`flinch`). If the
  label is empty (`[]{type:fire}`), use the slug instead, with hyphens
  turned into spaces.
- Change `\n`, `\n\n` and `\f` in effect and flavor text to single
  spaces.

### Dropped fields

- `is_main_series` is not stored.
- `pokemon` is not used. `pokemonWithAbility` is built from
  `pokedex/entries` by `abilities/updatePokemonWithAbility.js`. PokeAPI
  form ids (10001+) don't match the decimal-suffix form ids used in the
  pokedex.

### Schema

`src/pokemon/abilities/schema.json` validates this shape:
`effectChanges` and `flavorText` are both
`{ <language>: { <game>: string } }`, and `description` was removed.
