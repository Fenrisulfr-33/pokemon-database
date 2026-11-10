# Not uploaded

Data in `src/pokemon/` that isn't its own Mongo collection, and how it
relates to the collections.

## `forms/`

Per-form pokemon documents, grouped by kind (`megas/`, `alolan/`,
`gigantamax/`...). They have the same shape as
[national-dex](collections/national-dex.md) and use decimal ids
(`479.1-rotom-heat.json`).

Nothing uploads `forms/` yet. Today, forms reach Mongo only through the
decimal files in `pokedex/entries`. Ids are shared, so a form file and
its `pokedex/entries` copy describe the same `national-dex` document.

## `pokedex/dexes/dexes_objects/`

One file per regional dex: `[{ dexNo, pokemonId }]`.

- `pokemonId` → `national-dex._id`
- Read at upload time to build `national-dex.pokedexNumber`.
- Lengths are checked against `constants/DEX_LENGTHS.js` by
  `dexes.test.js`.

## `competitive/`

Sample sets, `_id` = `national-dex._id`. Not uploaded. Unlike the other
data it refers to things by **key**, not id:

| Field      | Refers to                   |
| ---------- | --------------------------- |
| `_id`      | `national-dex._id`          |
| `key`      | `national-dex.key`          |
| `moves[]`  | `moves.key`                 |
| `ability`  | `abilities.key`             |
| `heldItem` | item key (`items/items.json`) |

## `pokedexEntries/`

Empty placeholder folder (`entries/` and an empty `README.md`).

## Other folders

- `pokeApi/`: raw PokeAPI downloads used to build or check entries.
- `webscraping/`: scrapers that produced some of the source data.
- `constants/`: shared constants (dex lengths, learn methods).
- `schemas/`: JSON schemas checked before upload.
