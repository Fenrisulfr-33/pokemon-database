# Description

FormsTab is a folder where all the possible forms for a pokemon can exist if a pokemon has multiple forms.

# Structure 

```text
src/pokemon/
|--formTabs/
	|--entries/	# pokemon that can have multiple forms get a formTab
	|--upsert.js # adds/replaced formsTabs to database for quick lookup on site
```

# Goals

Forms folder and formsTabs folder should be connected in some way where when forms get added or updated, the formsTab gets updated. 
Example: If I add a `18.01-<pokemon_name>` file inside forms folder that meets schema validation it will create if not exist a `18-<pokemon_name>` formsTab, or if already exists add to it. 