# form-tabs

One document per pokemon that has more than one form. It drives the form
switcher (tab bar) on the website. Source:
`src/pokemon/formTabs/entries/{_id}-{key}.json` (93 files). No schema.

Uploaded with `node src/pokemon/formTabs/upsert.js`; it is not part of
`npm run upsert:all` and has no npm script.

## Relations

| Field          | Points to          |
| -------------- | ------------------ |
| `_id`          | `national-dex._id` of the base form |
| `pokemonIds[]` | `national-dex._id` of each form     |
| `tab[].id`     | `national-dex._id` of each form     |

`_id` always equals `pokemonIds[0]`. Every pokemon in `pokemonIds` can
use this document to draw its tab bar.

Form tabs are written by hand. Adding a form to `forms/` or
`pokedex/entries` does not update them (a goal in
`formTabs/README.md`).

## Fields

| Field        | Type     | Notes                                |
| ------------ | -------- | ------------------------------------ |
| `_id`        | number   | base pokemon id                      |
| `key`        | string   | base pokemon key                     |
| `pokemonIds` | number[] | every form, base first               |
| `tab`        | array    | `[{id, name}]`: tab label per form   |

## Example

```json
{
    "_id": 1017,
    "pokemonIds": [1017, 1017.1, 1017.2, 1017.3],
    "key": "ogrepon",
    "tab": [
        { "id": 1017, "name": "Teal Mask" },
        { "id": 1017.1, "name": "Wellspring Mask" },
        { "id": 1017.2, "name": "Hearthflame Mask" },
        { "id": 1017.3, "name": "Cornerstone Mask" }
    ]
}
```
