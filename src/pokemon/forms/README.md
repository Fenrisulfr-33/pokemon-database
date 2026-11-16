# Description

Forms folder has subfolders with different forms a pokemon can have and the data that makes them different

# Structure 

```text
src/pokemon/
|--forms/
    |--alolan/      # Alolan regional forms
    |--alternate/   # battle/species forms (Deoxys, Giratina, Ogerpon...)
    |--cosmetic/    # looks-only forms (Burmy cloaks, Unown, Vivillon...)
    |--galarian/    # Galarian regional forms
    |--gigantamax/  # Gigantamax forms
    |--hisuian/     # Hisuian regional forms
    |--megas/       # Mega Evolutions, including Legends Z-A megas
    |--paldean/     # Paldean regional forms (Tauros breeds, Wooper)
    |--pikachu/     # Pikachu caps, cosplay and partner forms
    |--primal/      # Primal Reversions
    |--rotom/       # Rotom appliance forms
    |--totem/       # Totem pokemon (USUM)
```

Files are named `{_id}-{form}-{pokemonName}.json`, e.g.
`6.01-mega-x-charizard.json`. `key` is the file name without the id.
There are 553 files: every form PokeAPI lists as its own pokemon (326),
plus 227 cosmetic forms PokeAPI lists under one pokemon (in
`pokeApi/cosmeticForms/`). Arceus's "???" form is skipped, because
`unknown` isn't a schema type.

# Goals

Forms can differ slightly or massively, I would like to find a way where a form if is only slightly different only has the differences from the main and copies everything else from the original and add/removes the differences.

## Forms

Form files should be the `{_id}-{form}-{pokemonName}.json`

PokeApi data, i'm skeptible about data I recieved from scraping pokemondb, the moves listed require a tab change and sometimes forms have moves in games there weren't in bc it pulls from the original pokemon, the forms I want to make for my database should purely contain their moves, meaning if moves from a game previous to when they were created, like mega-venusaur having moves from gen1 when mega venusaur didn't come out until gen 6, means they shouldn't be there. 

forms should have all the same keys as the pokemon schema, or possible called pokedex schema in the pokedex/ folder. 

Form data from pokeApi might be better but also might require a manual review from myself in the future

### Ids

`_id` is the base pokemon's id plus a two-digit form number, in PokeAPI
order: Charizard is `6.01` Mega X, `6.02` Mega Y, `6.03` Gigantamax.
Two digits leave room for pokemon with more than 9 forms. Because `_id`
is a number, the tenth form `25.10` is stored as `25.1` (only Pikachu
and Minior have 10 or more forms). The file name keeps `25.10`.

`pokedex/entries` holds base pokemon only. Every collection that refers
to a form (`evolutions`, `formTabs`, `learnsets`,
`abilities.pokemonWithAbility`) uses its `forms/` id.

### Visual and full forms

A form is **visual** when its `type`, `abilities`, `baseStats` and `evs`
match its base pokemon (`Math.floor(_id)`), or when it's a cosmetic
form. Visual files hold only `_id`, `key`, `visual: true`, the fields
that differ from the base, and their own `pokedexEntries`:

```json
{
    "_id": 412.01,
    "key": "sandy-cloak-burmy",
    "visual": true,
    "pokedexEntries": { "Sandy Cloak": [ ... ] }
}
```

Arceus and Silvally types are cosmetic forms but also carry `type`.
Gigantamax forms carry `name`, `info` and `generation`. 300 forms are
visual: the 227 cosmetic ones, plus the Gigantamax, Totem, Pikachu cap
and costume forms and a few others.

Forms that really change (Megas, Deoxys, regional forms...) are **full**
documents with every pokedex schema key and no `visual` field.

When forms are uploaded, the plan is to merge each visual form as
`{ ...base, ...form }`, add a `changes` list of the fields that differ,
and set `visual: false` on full forms. Mongo would then always hold
complete documents, and the site can use `visual` and `changes` to know
how much to update on a tab click.

### Where each field comes from

Full forms have every pokedex schema key and pass `pokedex/schema.json`.
Visual forms pass it once merged with their base. Cosmetic forms copy
the base pokemon, except `type` (from PokeAPI's form) and
`pokedexEntries`.

| Field | Source |
| ----- | ------ |
| `type`, `abilities`, `baseStats`, `info`, `evs` | `pokeApi/forms/entries/` |
| `name`, `generation`, `baseExp` | PokeAPI `pokemon-form` and `pokemon` |
| `eggGroups`, `species`, `catchRate`, `baseFriendship`, `growthRate`, `eggCycles`, `nameOrigin`, `gender` | the form's current file, else the base pokemon |
| `pokedexEntries` | the form's current file, else `{}` |
| `evolution` | the form's current file, else the base pokemon's chain |

`name` only has English, French, German and Japanese, because those are
the languages PokeAPI has for forms.

### Rebuilding

The scripts are in `src/pokemon/pokeApi/formEntries/`.

1. `npm run forms:fetch` first downloads every form PokeAPI lists as its
   own pokemon (ids 10001–10326) into `pokeApi/forms/entries/`. That
   folder isn't kept in the repo; it only exists for a rebuild. Next it
   saves each form's names, game and base experience into
   `pokeApi/formDetails/`, skipping forms that already have a file. Last
   it fetches every pokemon's form list again and saves the cosmetic
   forms into `pokeApi/cosmeticForms/`. That step makes about 1,600
   requests and takes a few minutes.
2. `npm run forms:build` rewrites every file in this folder from those
   sources and prints the forms still missing data.
3. Delete `pokeApi/forms/entries/` once the build looks right.

Edits to species fields and `pokedexEntries` in these files are kept,
because the current file is read first. Edits to battle fields (`type`,
`abilities`, `baseStats`, `info`, `evs`) are replaced by PokeAPI's.

Moves aren't stored here. PokeAPI's form moves are already limited to the
form's own games (Mega Venusaur's start at X/Y), so they can go into
`learnsets` as they are.