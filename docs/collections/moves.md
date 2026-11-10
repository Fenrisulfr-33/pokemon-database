# moves

One document per move. Source:
`src/pokemon/moves/entries/{_id}-{key}.json` (920 files).
Schema: `src/pokemon/moves/schema.json`. `_id` is the PokeAPI id.

## Relations

Moves don't point anywhere. They are referenced by:

| From                                | Field              |
| ----------------------------------- | ------------------ |
| `learnsets.{game}.{method}[][last]` | `moves._id`        |
| `competitive` (not uploaded)        | `moves.key`        |

There is no list of pokemon on a move. To find who learns a move, search
`learnsets` for tuples ending in the move's `_id`.

## Fields

| Field         | Type           | Notes                                       |
| ------------- | -------------- | ------------------------------------------- |
| `_id`         | number         | PokeAPI move id                             |
| `key`         | string         | slug, e.g. `pound`                          |
| `name`        | object         | `english` plus 7 other languages            |
| `type`        | string         | e.g. `Normal` (single string, unlike pokemon) |
| `category`    | string         | `Physical`, `Special` or `Status`           |
| `contest`     | string \| null | contest condition, e.g. `Tough`             |
| `pp`          | number \| null |                                             |
| `power`       | number \| null |                                             |
| `accuracy`    | number \| null |                                             |
| `priority`    | number         |                                             |
| `contact`     | mixed          | see [known issues](../known-issues.md)      |
| `generation`  | number         | generation introduced                       |
| `target`      | string         | PokeAPI target slug, e.g. `selected-pokemon`|
| `changes`     | array          | currently empty on every move               |
| `description` | object         | `{versionGroup: flavor text}`               |
| `effect`      | object         | `full`, `shortEffect`                       |

## Example

```json
{
    "_id": 1,
    "key": "pound",
    "name": { "english": "Pound", "japanese": "はたく" },
    "type": "Normal",
    "category": "Physical",
    "contest": "Tough",
    "pp": 35,
    "power": 40,
    "accuracy": 100,
    "contact": null,
    "generation": 1,
    "target": "selected-pokemon",
    "changes": [],
    "description": { "gold-silver": "Pounds with forelegs or tail." },
    "effect": {
        "full": "Inflicts regular damage.",
        "shortEffect": "Inflicts regular damage with no additional effect."
    },
    "priority": 0
}
```
