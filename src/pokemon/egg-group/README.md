# Egg Groups

One file per egg group, `entries/{_id}-{key}.json`. Uploaded to the
`egg-groups` collection. Everything comes from PokeAPI `egg-group/{id}`.
PokeAPI's own keys differ from the english names (`humanshape` is
Human-Like, `plant` is Grass, `ground` is Field, `indeterminate` is
Amorphous, `no-eggs` is Undiscovered); `key` follows the english name.

## Fields

- `_id` - PokeAPI egg-group id; `eggGroups` in `pokedex/entries` and
  `forms/` points here
- `key` - english name in lowercase (`water-1`)
- `name` - name by language
- `pokemon` - national-dex `_id`s from PokeAPI `pokemon_species`, lowest
  first. Base species only, no forms.

## Commands

- `npm run egg-group:validate` - schema check
- `MONGO_ENV=dev npm run upsert:egg-group` - upload
