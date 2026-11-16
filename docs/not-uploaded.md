# Not uploaded

Data in `src/pokemon/` that isn't its own Mongo collection, and how it
relates to the collections.

## `forms/`

Per-form pokemon documents, grouped by kind (`megas/`, `alolan/`,
`gigantamax/`...). Full forms have the same shape as
[national-dex](collections/national-dex.md); visual forms hold only what
differs from their base. Ids are the base number plus a two-digit
decimal (`479.01-heat-rotom.json`). See `src/pokemon/forms/README.md`.

Nothing uploads `forms/` yet; it will get its own upsert, separate from
`national-dex`.

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
