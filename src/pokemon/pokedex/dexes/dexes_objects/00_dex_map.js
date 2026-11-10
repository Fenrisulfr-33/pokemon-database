import readJson from "../../../../genericFunctions/files/readJson.js";

// Keys match the names in constants/DEX_LENGTHS.js so each dex can be
// checked against its expected length.
const DEX_FILES = [
    ["RED_BLUE_YELLOW", "01-red-blue-yellow.json"],
    ["GOLD_SILVER_CRYSTAL", "02-gold-silver-crystal.json"],
    ["RUBY_SAPPHIRE_EMERALD", "03-ruby-sapphire-emerald.json"],
    ["FIRE_RED_LEAF_GREEN", "04-firered-leafgreen.json"],
    ["DIAMOND_PEARL", "05-diamond-pearl.json"],
    ["PLATINUM", "06-platinum.json"],
    ["HEARTGOLD_SOULSILVER", "07-heartgold-soulsilver.json"],
    ["BLACK_WHITE", "08-black-white.json"],
    ["BLACK2_WHITE2", "09-black2-white2.json"],
    ["X_Y_CENTRAL", "10-xy-central.json"],
    ["X_Y_COASTAL", "11-xy-coastal.json"],
    ["X_Y_MOUNTAIN", "12-xy-mountain.json"],
    ["OMEGA_RUBY_ALPHA_SAPPHIRE", "13-omega-ruby-alpha-sapphire.json"],
    ["SUN_MOON_ALOLA", "14-sun-moon-alola.json"],
    ["SUN_MOON_MELEMELE", "15-sun-moon-melemele.json"],
    ["SUN_MOON_AKALA", "16-sun-moon-akala.json"],
    ["SUN_MOON_ULAULA", "17-sun-moon-ulaula.json"],
    ["SUN_MOON_PONI", "18-sun-moon-poni.json"],
    ["ULTRA_SUN_ULTRA_MOON_ALOLA", "19-ultra-sun-ultra-moon-alola.json"],
    [
        "ULTRA_SUN_ULTRA_MOON_MELEMELE",
        "20-ultra-sun-ultra-moon-melemele.json",
    ],
    ["ULTRA_SUN_ULTRA_MOON_AKALA", "21-ultra-sun-ultra-moon-akala.json"],
    ["ULTRA_SUN_ULTRA_MOON_ULAULA", "22-ultra-sun-ultra-moon-ulaula.json"],
    ["ULTRA_SUN_ULTRA_MOON_PONI", "23-ultra-sun-ultra-moon-poni.json"],
    ["LETS_GO_PIKACHU_EEVEE", "24-lets-go-pikachu-lets-go-eevee.json"],
    ["SWORD_SHIELD", "25-sword-shield.json"],
    ["ISLE_OF_ARMOR", "26-isle-of-armor.json"],
    ["CROWN_TUNDRA", "27-crown-tundra.json"],
    ["LEGENDS_ARCEUS", "28-legends-arceus.json"],
    ["SCARLET_VIOLET", "29-scarlet-violet.json"],
    ["THE_TEAL_MASK", "30-teal-mask.json"],
    ["THE_INDIGO_DISK", "31-indigo-disk.json"],
    // TODO: add legends ZA once 32-legends-za.json is complete
    // TODO: add mega dimension
];

const dexMap = new Map(
    DEX_FILES.map(([dexKey, fileName]) => [
        dexKey,
        readJson(`./${fileName}`, import.meta.url),
    ]),
);

export default dexMap;
