# Pokedex

The pokedex is a list of all base form pokemon by their national dex id. This folder serves as a place to solidify that all data here is accurate up until a next game releases. Ideally the information once confirmed accurate will receive a `rule` that it cannot be modified with clear explination as to why that information should be changed. E.G. once all `nameOrigins` have been checked against `pokemonDB` and match, this field should never be edited.

The `rules` will says what fields have been verified and set to `final`. Then things can only be added for new games but previous things cannot.

## Acquisitions 

In `dexes/acquisition` lives jsons that hold information about pokemon that can be obtained by other means. This can include transferring from bank, home, post-game areas, etc. These lists, if not in any of the associated games dexes, exempt a pokemon from needing a `pokedexEntry` for that associated game.	

### Locked fields

`locks/locks.json` lists the fields that are verified and locked, with
the source they were checked against. Each locked field has a snapshot,
`locks/<field>.json`, of its value for every pokemon at lock time.
`locks/locks.test.js` fails if an existing pokemon's value no longer
matches its snapshot. Pokemon added later aren't checked.

To lock a new field, add it to `locks.json` and run
`npm run pokedex:lock -- <field>`. To change a locked value on purpose,
edit the entry and re-run the same command; the snapshot diff shows
the change.

### Height formula

```js
function formatHeight(decimeters) {
    const meters = (decimeters / 10).toFixed(1);
    const totalInches = Math.round(decimeters * 10 / 2.54);
    const feet = Math.floor(totalInches / 12);
    const inches = String(totalInches % 12).padStart(2, '0');
    return `${meters} m (${feet}′${inches}″)`;
}
```

`7` → `0.7 m (2′04″)`, `17` → `1.7 m (5′07″)`

Round the total inches before splitting into feet and inches, otherwise
`3` (11.8 in) comes out as `0′12″` instead of `1′00″`.

### Weight formula

```js
function formatWeight(hectograms) {
    const kilograms = (hectograms / 10).toFixed(1);
    const pounds = (Math.round(hectograms / 10 * 2.20462 * 10) / 10)
        .toFixed(1);
    return `${kilograms} kg (${pounds} lbs)`;
}
```

`68` → `6.8 kg (15.0 lbs)`, `905` → `90.5 kg (199.5 lbs)`

### nameOrigin

A list of `[word, meaning]` pairs, in display order, matching
[pokemondb's name origins](https://pokemondb.net/etymology). Quotes
inside a meaning use straight single quotes (`'`).

```json
    "nameOrigin": [
        ["mirai", "Japanese for 'future'"],
        ["-don", "common dinosaur suffix, from the Greek for 'tooth'"]
    ],
```

### pokedexEntries

A list of `{ gameKey: description }` objects, one per game, using the
game keys in `src/pokemon/KEYS.md`. Each file holds only its own
pokemon's entries; other forms' entries live in their `forms/` files.

```json
    "pokedexEntries": [
        { "sc": "Much remains unknown about this creature. It resembles Cyclizar, but it is far more ruthless and powerful." },
        { "vi": "This seems to be the Iron Serpent mentioned in an old book. The Iron Serpent is said to have turned the land to ash with its lightning." }
    ]
```
