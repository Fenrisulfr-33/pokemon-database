---
name: bulbapedia
description: Check pokemon data against Bulbapedia, our #1 source, and
  record every difference (missing data and mismatches) in the field's
  differences.md table for the user to accept or reject, then apply the
  accepted rows. Use when the user asks to check, verify, compare,
  fill in or cross-reference data with Bulbapedia, mentions a
  differences.md, or asks to apply decisions from one. Ships with
  `pokedexEntries`; also covers adding a new field to the checker.
---

# Bulbapedia check

Bulbapedia is our most reliable source. The check exists to **fill in
missing data and catch mismatches with what we already have**, but the
user decides every change. So:

- **Never edit entry data straight from Bulbapedia.** Everything,
  including missing values, goes to `differences.md` first.
- Only apply rows the user marked `accept` (in the file, or by telling
  you which rows; then write `accept` into those rows yourself).
- Don't apply locked fields (`src/pokemon/pokedex/locks/locks.json`).
  `bulbapedia:apply` refuses them; don't work around it.

Code: `src/pokemon/webscraping/bulbapedia/` (see its `README.md`).

## Supported fields

| Field            | Entries checked                            | Report                               |
| ---------------- | ------------------------------------------ | ------------------------------------ |
| `pokedexEntries` | `src/pokemon/pokedex/entries` (base forms) | `src/pokemon/pokedex/differences.md` |

For any other field, see "Adding a field" below. Ask the user before
building one.

## Checking

1. `npm run bulbapedia:check -- <field>`
    - Pages are cached in `src/pokemon/webscraping/bulbapedia/.cache/`
      (git-ignored). Add `--refresh` to re-download every page, e.g.
      after a new game's data lands on Bulbapedia. A full download is
      about 21 requests of 50 pages, ~1 minute.
    - It rewrites `differences.md` and keeps any existing
      `accept`/`reject` decisions by row ID (`<file>/<gameKey>`).
2. Read the report and summarise it for the user: counts per kind, and
   the rows that look like real errors versus Bulbapedia quirks. Point
   out anything that looks like a parser problem rather than a data
   problem (see "Known quirks"); fix the parser if so and re-run.
3. Give the user the report's path and let them decide. Don't apply
   anything in the same turn unless they already said which rows.

### Kinds (pokedexEntries)

| Kind          | Meaning                                            | Accepting does                                                               |
| ------------- | -------------------------------------------------- | ---------------------------------------------------------------------------- |
| `wording`     | Different words                                    | Writes Bulbapedia's text in our casing and apostrophe style                  |
| `punctuation` | Only spacing, hyphens, dashes, quotes (own table)  | Same as wording                                                              |
| `missing`     | Bulbapedia has a game we don't                     | Adds the entry, combining games with identical text (`dp`, `dpp`, `bw`, ...) |
| `extra`       | We have a game Bulbapedia lacks for the base form  | Removes the line                                                             |
| `form`        | Our text is another form's entry (note says which) | Replaces with Bulbapedia's first-listed form; usually reject                 |
| `split`       | A combined key's games differ on Bulbapedia        | Nothing; split the key by hand                                               |

## Applying

1. `npm run bulbapedia:apply -- <field>`. It changes only the affected
   lines, keeps each file's line endings, checks the JSON parses, then
   re-runs the check, so applied rows drop out of the report.
2. Do the CLAUDE.md verification: `npm test` (compare against the
   failures in `docs/known-issues.md`; add none), the field's
   validate script, then confirm `git diff` touches only that field.
3. Some accepted changes break other checks. Example: removing the
   Deoxys `fr`/`lg`/`em` or Ursaluna `sc`/`vi` "extra" entries fails
   `pokedex.test.js` ("pokemon in a game's dex have a pokedexEntry"),
   because the test expects the base file to cover every dex game. If
   that happens, restore those entries and tell the user; don't edit
   the test without asking.
4. Record anything left unresolved in `docs/known-issues.md`.

## Known quirks

- Bulbapedia sometimes lists a non-default form first (Zygarde 10%
  Forme, Maushold Family of Three). These show as `form` rows; ours
  are correct.
- Bulbapedia keeps in-game line-break artefacts (`small- bodied`,
  `high- speed`). Since Bulbapedia is the source, those are applied
  as written when accepted.
- Stadium, Stadium 2 and Pokopia entries are ignored (no game keys).
  A Bulbapedia game name the parser doesn't know is skipped; add it
  to `bulbapediaGames.js` and its key to `KEYS.md`/`GAME_KEYS.js`.
- Paradox names with hyphens in our data (`Roaring-Moon`) are looked
  up again with spaces.

## Adding a field

1. Ask the user which Bulbapedia section is the source and how
   mismatches should be described.
2. Create `fields/<field>/` with a parser, `find<Field>Differences`
   and `apply<Field>Difference`, following `fields/pokedexEntries/`.
   Each difference needs `id`, `file`, `pokemon`, `gameKey` (or another
   short label), `kind`, `ours`, `bulbapedia`, `note` and `canApply`.
   Use kind `punctuation` for formatting-only text differences so they
   land in the second table.
3. Add a `<field>Field.js` definition (entriesDir, reportPath next to
   that entity's `entries/` folder, locksPath, validateCommand,
   kindDescriptions) and register it in `fields/index.js`.
4. Write Jest tests next to the code (parser, differences, apply), then
   run the check and review the report with the user before applying.
5. Add the field to the table above and to the folder's `README.md`.
