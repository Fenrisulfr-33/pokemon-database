# Description

FormsTab is a folder where all the possible forms for a pokemon can exist if a pokemon has multiple forms.

FormsTabs/entries holds the data for a dropdown of the forms a pokemon can have, since pokemon can have multiple forms.

# Structure 

File naming should be `{_id}-{base_pokemon_name}.json`.

```text
src/pokemon/
|--formTabs/
	|--entries/					# pokemon that can have multiple forms get a formTab
	|--upsert.js 				# adds/replaced formsTabs to database for quick lookup on site
	|--schema.json 				# shape of each entry (npm run form-tabs:validate)
	|--validation.mjs 			# checks every entry against schema.json
	|--formTabs.test.js 		# data checks on formTabs/entries
```

# Purposes for data model

The `_id` is a reference to the base pokemon that can hold multiple forms. If a pokemon has multiple forms on the front end it should look for a `formsTab._id` that is the pokemons `_id` rounded down.

# Proposed change

1. remove `pokemonIds`, this is an outdated variable, it had something to do with lookup on the backend but it's not longer need with the logic above.
2. What is the purpose of the `key`? forms have a base but it's not something you can lookup you need to go to that page.