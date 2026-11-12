# Pokedex

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