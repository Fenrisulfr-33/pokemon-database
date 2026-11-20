This folder is used to create and update pokemon pokedexes in respect to their games.

**The order of each file must be in DEX NUMERICAL order, NOT National No.**

---

TODO: Dexes_numbers is redundant, also the dexes_objects now has conflicting data since I discovered discrepancies, therefore we should just delete dexes_numbers

TODO: Once dexes_objects has been verified, combine dexes that are exactly the same into one, red-blue yellow into red-blue-yellow, etc...

| Game | Done/Not | Human Verification | Claude Verification |
| - | - | - | - |
| Red, Blue, & Yellow | Done | Done | - |
| Sun & Moon - Alola | Done | Done | - |


- [ ] Sun & Moon - Alola 

---

1. The number list form of dexes `dexes_numbers` contains basic .json files of an array that has the pokemons National No. in the index + 1 of where it lies in the dex. This folder also contains a map of all the dexes for export, `00_dex_map.js`.

```
    [
        ...,
        125,
        126,
        34,
        35,
        36,
        ...
    ]
```

2. The object list form of dexes `dexes_objects` contains basic .json files of an array that has pokemon National No. in the object key `pokemonId` and the key `dexNo` of where it lies in the dex. This folder also contains a map of all the dexes for export,. `00_dex_map.js`.

```
  ...,
  {
    "dexNo": 4,
    "pokemonId": 620
  },
  {
    "dexNo": 5,
    "pokemonId": 335
  },
  ...
```

3. `transformDexNumToDexObj.js` is the main file that converts the number array dexes into the obj array dexes.
   - _Note:_ I was going to put a check to see if the file already exists to stop it from making one every time, however if I needed to make changes to old ones this would ignore the changes. So instead it will change every time for now.
   - TODO: Triple verify the numbered lists dexes. Then append code to `transformDexNumToDexObj.js` to only add new dexes.
   - TODO: Should I reformat the key indicator to be `_id` for the core sorting of the list, and then that way the save file can always sort by that lists key `_id` of the respective list.


4. `acquisition/` holds lists of pokemon that are in a game but are only
   obtained one way, so they have no `pokedexEntries` for that game. The
   data check skips them for those games.

```json
{
    "method": "transfer",
    "games": ["us", "um"],
    "description": "Pokemon only obtainable by transferring through ...",
    "pokemon": [29, 30, 31]
}
```
