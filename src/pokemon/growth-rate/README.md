# Growth Rates

One file per growth rate, `entries/{_id}-{key}.json`. Uploaded to the
`growth-rates` collection. Names by language come from PokeAPI; PokeAPI
calls Medium Fast "medium".

## Fields

- `_id` - unique to the growth rate; `growthRate` in `pokedex/entries`
  and `forms/` points here
- `key` - english name in lowercase (`medium-fast`)
- `name` - name by language
- `formula` - LaTeX formula for the experience needed at level x
- `levels` - `{ level, experience }` for levels 1 to 100
- `pokemon` - `_id`s of every pokemon and form with this growth rate,
  lowest first. Don't edit by hand; run
  `npm run growth-rate:update-pokemon` after changing a `growthRate`.

## Commands

- `npm run growth-rate:validate` - schema check
- `npm run growth-rate:update-pokemon` - rebuild the `pokemon` arrays
- `MONGO_ENV=dev npm run upsert:growth-rate` - upload
