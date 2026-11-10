# learnsets

The moves each pokemon can learn, by game and learn method. Source:
`src/pokemon/learnsets/entries/{_id}-{key}.json` (1,075 files).
Uploaded by `npm run upsert:moves` after the moves collection. No schema.

This is the join between pokemon and moves: it stores only ids, and the
server fills in move details from `moves`.

## Relations

| Field                         | Points to          |
| ----------------------------- | ------------------ |
| `_id`                         | `national-dex._id` (same id, 1:1) |
| last value of every tuple     | `moves._id`        |

## Shape

```text
{
    _id: pokemonId,
    <gameKey>: {
        <methodKey>: [ [ ...extra info, moveId ], ... ]
    }
}
```

- `gameKey`: `rb ye gs cr rs em frlg dp pt hgss bw b2w2 xy oras sm usum
  lgpe swsh bdsp la sv za` (from `KEYS.md`). Games the pokemon isn't in
  are left out.
- `methodKey`: how the move is learned. Empty methods are left out.
- `moveId` is **always the last value** in a tuple.

| Key   | Method               | Tuple                             |
| ----- | -------------------- | --------------------------------- |
| `lv`  | level-up             | `[level, moveId]`                 |
| `tm`  | technical machine    | `[tmNumber, moveId]`              |
| `hm`  | hidden machine       | `[hmNumber, moveId]`              |
| `tr`  | technical record     | `[trNumber, moveId]`              |
| `eg`  | egg                  | `[moveId]`                        |
| `tu`  | tutor                | `[moveId]`                        |
| `ev`  | evolution            | `[moveId]`                        |
| `rm`  | reminder             | `[moveId]`                        |
| `spm` | special moves (LGPE) | `[moveId]`                        |
| `pe`  | pre-evolution        | `[methodKey, moveId]`             |
| `to`  | transfer only        | `[generation, methodKey, moveId]` |
| `sp`  | special / event      | `[note, moveId]`                  |
| `zc`  | Zygarde Cube         | `[moveId]`                        |
| `lbe` | Light Ball breeding  | `[moveId]`                        |
| `fc`  | on form change       | `[moveId]`                        |

The full method reference (which games use which keys, where the data
came from) is in
[`src/pokemon/learnsets/README.md`](../../src/pokemon/learnsets/README.md).

## Example

```json
{
    "_id": 1,
    "rb": {
        "lv": [[1, 45], [1, 33], [7, 73], [13, 22]],
        "hm": [[1, 15]],
        "tm": [[3, 14], [6, 92]]
    }
}
```

Bulbasaur learns move `45` (Growl) at level 1 in Red/Blue, and TM03
gives it move `14` (Swords Dance).
