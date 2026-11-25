# Bulbapedia check

Compares our data with Bulbapedia, our most reliable source, and writes
the differences to a `differences.md` next to each entity's `entries/`
folder. It never edits data by itself: the user marks rows `accept` or
`reject`, and `bulbapedia:apply` applies the accepted ones.

```sh
npm run bulbapedia:check -- pokedexEntries            # write the report
npm run bulbapedia:check -- pokedexEntries --refresh  # re-download pages
npm run bulbapedia:apply -- pokedexEntries            # apply accepted rows
```

The Claude skill in `.claude/skills/bulbapedia/SKILL.md` has the full
workflow, the meaning of each kind, and how to add a field.

## Fields

| Field | Entries | Report |
| --- | --- | --- |
| `pokedexEntries` | `src/pokemon/pokedex/entries` | `src/pokemon/pokedex/differences.md` |

## Files

| File | Job |
| --- | --- |
| `checkBulbapedia.js`, `applyBulbapediaDifferences.js` | npm script entry points |
| `bulbapediaCheck.js` | Runs a check or apply for one field |
| `bulbapediaPages.js` | Downloads species pages through the MediaWiki API (50 per request, cached in `.cache/`) |
| `bulbapediaGames.js` | Bulbapedia game names → game keys; combined keys (`dpp`, `bw`, ...) |
| `wikitextTemplates.js` | Finds `{{templates}}` and their parameters |
| `wikitextMarkup.js` | Wikitext → plain text; entry readings split by `<br>` and `{{sup}}` |
| `textComparison.js` | Case/quote-insensitive comparison, word diff, merging in our style |
| `differencesReport.js` | Renders `differences.md` and reads its decisions back |
| `fields/` | One folder per supported field, registered in `fields/index.js` |

## pokedexEntries

Reads the "Pokédex entries" section of `<Name> (Pokémon)`. Only the
base form counts: entries after a `{{Dex/Form}}` label are other forms,
except a generation's first label when it isn't a regional, Mega,
Gigantamax, Totem, Primal, Cap or Bloodmoon form (Cherrim's Overcast
Form, Giratina's Altered Forme). Other forms' entries are kept to
explain `form` and `extra` rows.

Text matches when it differs only in case, curly vs straight quotes and
repeated spaces. Where Bulbapedia shows several readings (game
revisions, English vs Japanese, per-version words), matching any of
them counts.
