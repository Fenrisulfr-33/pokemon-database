# Description

Forms folder has subfolders with different forms a pokemon can have and the data that makes them different

# Structure 

```text
src/pokemon/
|--forms/
    |--alolan/      # Alolan regional forms
    |--alternate/   # battle/species forms (Deoxys, Giratina, Ogerpon...)
    |--galarian/    # Galarian regional forms
    |--gigantamax/  # Gigantamax forms
    |--hisuian/     # Hisuian regional forms
    |--megas/       # Mega Evolutions (workInProgress/ = Legends Z-A megas)
    |--paldean/     # Paldean regional forms (Tauros breeds, Wooper)
    |--pikachu/     # Pikachu caps, cosplay and partner forms
    |--primal/      # Primal Reversions
    |--rotom/       # Rotom appliance forms
    |--totem/       # Totem pokemon (USUM)
```

Files are named `{_id}-{pokeapi-form-name}.json`, where `_id` is the base
pokemon's id with a decimal suffix (e.g. `479.1-rotom-heat.json`). Every
alternate form PokeAPI lists (`pokeApi/forms/`) has a file here.

# Goals

Forms can differ slightly or massively, I would like to find a way where a form if is only slightly different only has the differences from the main and copies everything else from the original and add/removes the differences.