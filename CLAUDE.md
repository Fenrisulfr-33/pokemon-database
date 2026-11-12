## Project
pokemon_database_tool — builds and curates Pokemon data as JSON files,
validates it, and uploads it to MongoDB for my Pokemon website (the
website lives in a separate repo).

## Stack
- Node 24, ES modules (`"type": "module"`)
- MongoDB (`mongodb` driver); dev / test / prod picked by `MONGO_ENV`
- ajv (JSON Schema draft-07) for validation
- Jest for tests
- axios + cheerio for scraping

## Structure
- `src/pokemon/<entity>/entries/` — one JSON file per record (pokedex,
  abilities, moves, evolutions, learnsets, formTabs, ...). This is the
  data that gets uploaded.
- `src/pokemon/<entity>/upsert.js` — pushes that entity to MongoDB
- `src/pokemon/<entity>/validation.mjs` — schema check for that entity
- `src/pokemon/<entity>/schema.json` — JSON Schema for that entity
- `src/pokemon/helpers/` — shared upsert / path helpers
- `src/genericFunctions/` — non-Pokemon-specific helpers
  (`schemaValidation.mjs` exports `validateEntries`)
- `src/pokemon/webscraping/`, `pokeApi/` — scripts that generate data
- `docs/` — collection docs (`docs/collections/`) and
  `docs/known-issues.md`
- Import aliases: `#helpers/*`, `#pokedex/*`, `#evolutions/*`, etc.
  (see `imports` in `package.json`)

## Commands
- Test: `npm test`
- Validate: `npm run pokedex:validate`, `npm run evolutions:validate`,
  `npm run moves:validate`
- Upload: `npm run upsert:<abilities|moves|pokemon|evolutions|all>`

## Verification
After every change:
1. `npm test` — some suites already fail; see `docs/known-issues.md`.
   Don't add new failures.
2. The `*:validate` script for any entity whose data changed.
3. Update any documentation pertaining to the change.

## Conventions
- Treat `src/pokemon/evolutions/entries` as the source of truth for
  evolution chains; `national-dex.evolution` is derived from it.
- Bulk data fixes: change only the field being fixed, keep each file's
  existing formatting, and confirm the diff is just that field.
- Record data problems you find (but don't fix) in
  `docs/known-issues.md`.
- Use 4-space indentation and prefer named exports.
- Keep lines at 80 characters or fewer.
- Keep functions under 30 lines, each with a single responsibility.
- Use descriptive variable names, never single characters.
- Follow Clean Code (Robert C. Martin).

## Don't
- Don't run upsert scripts against test or prod. Only run them as
  `MONGO_ENV=dev npm run upsert:...`, since `.env` may point elsewhere.
- Don't read, edit, or import from the top-level `/pokemon` folder. It's
  the dead pre-migration structure; use `src/pokemon/` instead.
- Don't work on `src/palworld` or `src/temtem` unless asked; Pokemon is
  the only active data set.
- Don't ask me to run `node -e '...'` commands.
