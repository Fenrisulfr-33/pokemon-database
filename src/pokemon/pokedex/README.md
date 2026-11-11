# Pokedex

### Abilities

Current format

```json
"abilities": {
	"one": {
		"name": "Overgrow",
		"id": 65
	},
	"hidden": {
		"name": "Chlorophyll",
		"id": 34
	}
}
```

New format

```json
"abilities": {
	"normal": [65]
	"hidden": 34
}
```

```json
"abilities": {
	"normal": [11, 6],
	"hidden": 34
}
```

```json
"abilities": {
	"normal": [34],
	"hidden": null
}
```