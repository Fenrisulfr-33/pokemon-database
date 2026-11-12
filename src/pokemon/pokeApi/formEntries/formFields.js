const NAME_LANGUAGES = {
    en: "english",
    fr: "french",
    de: "german",
    ja: "japanese",
};

const STAT_KEYS = {
    "hp": "hp",
    "attack": "atk",
    "defense": "def",
    "special-attack": "spatk",
    "special-defense": "spdef",
    "speed": "spd",
};

const FOLDER_BY_NAME_WORD = [
    ["mega", "megas"],
    ["primal", "primal"],
    ["gmax", "gigantamax"],
    ["totem", "totem"],
    ["hisui", "hisuian"],
    ["alola", "alolan"],
    ["galar", "galarian"],
    ["paldea", "paldean"],
];

const FOLDER_BY_SPECIES = { pikachu: "pikachu", rotom: "rotom" };

function formKey(details) {
    const prefix = `${details.species}-`;
    const formWords = details.name.slice(prefix.length);
    if (!details.name.startsWith(prefix) || !formWords) {
        throw new Error(`Can't split form name ${details.name}`);
    }
    return `${formWords}-${details.species}`;
}

function folderForForm(details, existingForm) {
    if (existingForm) return existingForm.folder;
    const nameWords = details.name.split("-");
    const rule = FOLDER_BY_NAME_WORD.find(([word]) => nameWords.includes(word));
    if (rule) return rule[1];
    return FOLDER_BY_SPECIES[details.species] ?? "alternate";
}

function titleCase(slug) {
    return slug.split("-")
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(" ");
}

function buildName(details, fallbackEnglish) {
    const name = {};
    for (const entry of details.names) {
        const languageKey = NAME_LANGUAGES[entry.language.name];
        if (languageKey) name[languageKey] = entry.name;
    }
    const kana = details.names.find(
        (entry) => entry.language.name === "ja-hrkt"
    );
    if (!name.japanese && kana) name.japanese = kana.name;
    return { english: name.english ?? fallbackEnglish, ...name };
}

function abilityIdFor(abilityKey, abilityIds) {
    const abilityId = abilityIds.get(abilityKey);
    if (!abilityId) throw new Error(`Unknown ability ${abilityKey}`);
    return abilityId;
}

function buildAbilities(pokeApiForm, abilityIds) {
    const bySlot = [...pokeApiForm.abilities]
        .sort((first, second) => first.slot - second.slot);
    const hidden = bySlot.find((ability) => ability.is_hidden);
    return {
        normal: bySlot
            .filter((ability) => !ability.is_hidden)
            .map((ability) => abilityIdFor(ability.ability, abilityIds)),
        hidden: hidden ? abilityIdFor(hidden.ability, abilityIds) : null,
    };
}

function buildTypes(pokeApiForm) {
    return [...pokeApiForm.types]
        .sort((first, second) => first.slot - second.slot)
        .map((entry) => entry.type);
}

function buildBaseStats(pokeApiForm) {
    const baseStats = {};
    for (const stat of pokeApiForm.stats) {
        baseStats[STAT_KEYS[stat.stat]] = stat.base_stat;
    }
    const values = Object.values(baseStats);
    baseStats.total = values.reduce((sum, value) => sum + value, 0);
    return baseStats;
}

function buildEvs(pokeApiForm) {
    const evs = {};
    for (const effort of pokeApiForm.effort_values) {
        if (effort.effort > 0) evs[STAT_KEYS[effort.stat]] = effort.effort;
    }
    return evs;
}

function toGenderPercent(value) {
    if (typeof value === "number" || value === null) return value;
    if (value === "") return null;
    return Number(value.replace("%", ""));
}

function buildGender(gender) {
    return {
        male: toGenderPercent(gender.male),
        female: toGenderPercent(gender.female),
        genderless: gender.genderless,
    };
}

export {
    buildAbilities,
    buildBaseStats,
    buildEvs,
    buildGender,
    buildName,
    buildTypes,
    folderForForm,
    formKey,
    titleCase,
};
