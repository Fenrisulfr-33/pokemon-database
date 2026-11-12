# Moves

old format

```json
{
    "_id": 1,
    "key": "pound",
    "name": {
        "english": "Pound",
        "japanese": "はたく",
        "chinese": "拍击",
        "korean": "막치기",
        "german": "Destructor",
        "french": "Klaps",
        "italian": "Pound",
        "spanish": "Botta"
    },
    "type": "Normal",
    "category": "Physical",
    "contest": "Tough",
    "pp": 35,
    "power": 40,
    "accuracy": 100,
    "contact": null,
    "generation": 1,
    "target": "selected-pokemon",
    "changes": [],
    "description": {
        "gold-silver": "Pounds with fore­\nlegs or tail.",
        "crystal": "Pounds with fore­\nlegs or tail.",
        "ruby-sapphire": "Pounds the foe with\nforelegs or tail.",
        "emerald": "Pounds the foe with\nforelegs or tail.",
        "firered-leafgreen": "A physical attack\ndelivered with a\nlong tail or a\nforeleg, etc.",
        "diamond-pearl": "The foe is physically\npounded with a long\ntail or a foreleg,\netc.\n",
        "platinum": "The foe is physically\npounded with a long\ntail or a foreleg,\netc.\n",
        "heartgold-soulsilver": "The foe is physically\npounded with a long\ntail or a foreleg,\netc.\n",
        "black-white": "The target is physically pounded with\na long tail or a foreleg, etc.",
        "black-2-white-2": "The target is physically pounded with\na long tail or a foreleg, etc.",
        "x-y": "The target is physically pounded with\na long tail, a foreleg, or the like.",
        "omega-ruby-alpha-sapphire": "The target is physically pounded with\na long tail, a foreleg, or the like.",
        "sun-moon": "The target is physically pounded with a long tail, a\nforeleg, or the like.",
        "ultra-sun-ultra-moon": "The target is physically pounded with a long tail, a\nforeleg, or the like.",
        "lets-go-pikachu-lets-go-eevee": "The target is physically pounded with a long tail, a\nforeleg, or the like.",
        "sword-shield": "The target is physically pounded with a long tail, a\nforeleg, or the like."
    },
    "effect": {
        "full": "Inflicts regular damage.",
        "shortEffect": "Inflicts regular damage with no additional effect."
    },
    "priority": 0
}
```

pokeApi data

```json
{
    "id": 1,
    "name": "pound",
    "accuracy": 100,
    "effect_chance": null,
    "pp": 35,
    "priority": 0,
    "power": 40,
    "contest_combos": {
        "normal": {
            "use_before": [
                {
                    "name": "double-slap",
                    "url": "https://pokeapi.co/api/v2/move/3/"
                },
                {
                    "name": "headbutt",
                    "url": "https://pokeapi.co/api/v2/move/29/"
                },
                {
                    "name": "feint-attack",
                    "url": "https://pokeapi.co/api/v2/move/185/"
                }
            ],
            "use_after": null
        },
        "super": {
            "use_before": null,
            "use_after": null
        }
    },
    "contest_type": {
        "name": "tough",
        "url": "https://pokeapi.co/api/v2/contest-type/5/"
    },
    "contest_effect": {
        "url": "https://pokeapi.co/api/v2/contest-effect/1/"
    },
    "damage_class": {
        "name": "physical",
        "url": "https://pokeapi.co/api/v2/move-damage-class/2/"
    },
    "effect_entries": [
        {
            "effect": "Inflicts [regular damage]{mechanic:regular-damage}.",
            "short_effect": "Inflicts regular damage with no additional effect.",
            "language": {
                "name": "en",
                "url": "https://pokeapi.co/api/v2/language/9/"
            }
        }
    ],
    "effect_changes": [],
    "generation": {
        "name": "generation-i",
        "url": "https://pokeapi.co/api/v2/generation/1/"
    },
    "meta": {
        "ailment": {
            "name": "none",
            "url": "https://pokeapi.co/api/v2/move-ailment/0/"
        },
        "category": {
            "name": "damage",
            "url": "https://pokeapi.co/api/v2/move-category/0/"
        },
        "min_hits": null,
        "max_hits": null,
        "min_turns": null,
        "max_turns": null,
        "drain": 0,
        "healing": 0,
        "crit_rate": 0,
        "ailment_chance": 0,
        "flinch_chance": 0,
        "stat_chance": 0
    },
    "names": [
        {
            "name": "Pound",
            "language": {
                "name": "en",
                "url": "https://pokeapi.co/api/v2/language/9/"
            }
        }
    ],
    "past_values": [],
    "stat_changes": [],
    "super_contest_effect": {
        "url": "https://pokeapi.co/api/v2/super-contest-effect/5/"
    },
    "target": {
        "name": "selected-pokemon",
        "url": "https://pokeapi.co/api/v2/move-target/10/"
    },
    "type": {
        "name": "normal",
        "url": "https://pokeapi.co/api/v2/type/1/"
    },
    "learned_by_pokemon": [
        {
            "name": "clefairy",
            "url": "https://pokeapi.co/api/v2/pokemon/35/"
        }
    ],
    "flavor_text_entries": [
        {
            "flavor_text": "Pounds with fore­\nlegs or tail.",
            "language": {
                "url": "https://pokeapi.co/api/v2/language/9/",
                "name": "en"
            },
            "version_group": {
                "url": "https://pokeapi.co/api/v2/version-group/3/",
                "name": "gold-silver"
            }
        }
    ]
}
```

new format

Built by `src/pokemon/pokeApi/moves/getMoves.js`. See
`src/pokemon/pokeApi/moves/README.md` for how each field is built.

```json
{
    "_id": 33,
    "key": "tackle",
    "name": {
        "english": "Tackle",
        "japanese": "たいあたり",
        "simplified-chinese": "撞击",
        "latin-american-spanish": "Tacleada"
    },
    "type": "normal",
    "category": "physical",
    "contest": "tough",
    "pp": 35,
    "power": 40,
    "accuracy": 100,
    "contact": null,
    "generation": 1,
    "priority": 0,
    "target": "selected-pokemon",
    "meta": {
        "category": "damage",
        "ailment": "none",
        "minHits": null,
        "maxHits": null,
        "minTurns": null,
        "maxTurns": null,
        "drain": 0,
        "healing": 0,
        "critRate": 0,
        "ailmentChance": 0,
        "flinchChance": 0,
        "statChance": 0
    },
    "changes": {
        "bw": { "accuracy": 95, "power": 35 },
        "sm": { "power": 50 }
    },
    "effectChanges": {},
    "flavorText": {
        "english": {
            "gs": "A full-body charge attack.",
            "cr": "A full-body charge attack."
        }
    },
    "effect": {
        "full": "Inflicts regular damage.",
        "shortEffect": "Inflicts regular damage with no additional effect."
    }
}
```

- `type`, `category` and `contest` are lowercase, as PokeAPI sends them.
- `meta` is PokeAPI's `meta`, with `category` and `ailment` reduced to
  their names and the keys in camelCase. It is `null` when PokeAPI has
  no meta for the move.
- `description` is replaced by `flavorText`, keyed by language and then
  game, the same as abilities.
- `name` keeps every language, using the abilities language keys.
- `contact` is `true` for the moves listed in `CONTACT.md` and `false`
  for all others.
- `changes` is keyed by game. Each value holds the stats the move had
  **before** that game. Tackle had 95 accuracy and 35 power until
  Black/White, then 50 power until Sun/Moon.
