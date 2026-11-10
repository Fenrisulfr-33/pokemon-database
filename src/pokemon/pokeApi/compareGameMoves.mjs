/**
 * One-off audit script: compare my curated per-game learnset files
 * (src/pokemon/moves/games/NN-*.json) against the scraped PokeAPI
 * pokemon learnsets (src/pokemon/pokeApi/pokemon/*.json).
 *
 * For each game and each pokemon it reports:
 *   - moves PokeAPI lists that mine is missing
 *   - moves mine lists that PokeAPI does not have
 *   - level-up level mismatches for moves present in both
 *
 * Matching is done on a normalised move name (lowercase, alphanumerics
 * only) so "PoisonPowder" == "poison-powder". Learn methods are bucketed
 * so my technical-machine / hidden-machine / technical-record all map to
 * PokeAPI's "machine", and my "evolution" maps to a level-up at level 0.
 *
 * Writes a full report to compareGameMoves.report.txt and prints a
 * summary table.
 */
import { readFileSync, writeFileSync, readdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const here = dirname(fileURLToPath(import.meta.url));
const myGamesDir = join(here, "..", "moves", "games");
const apiPokemonDir = join(here, "pokemon");
const reportPath = join(here, "compareGameMoves.report.txt");

// my game_key -> PokeAPI version_group name
const gameKeyToVersionGroup = {
    "red-blue": "red-blue",
    "yellow": "yellow",
    "gold-silver": "gold-silver",
    "crystal": "crystal",
    "ruby-sapphire": "ruby-sapphire",
    "fire-red-leaf-green": "firered-leafgreen",
    "emerald": "emerald",
    "diamond-pearl": "diamond-pearl",
    "platinum": "platinum",
    "heart-gold-soul-silver": "heartgold-soulsilver",
    "black-white": "black-white",
    "black-2-white-2": "black-2-white-2",
    "x-y": "x-y",
    "omega-ruby-alpha-sapphire": "omega-ruby-alpha-sapphire",
    "sun-moon": "sun-moon",
    "ultra-sun-ultra-moon": "ultra-sun-ultra-moon",
    "lets-go-pikachu-eevee": "lets-go-pikachu-lets-go-eevee",
    "sword-shield": "sword-shield",
    "brilliant-diamond-shining-pearl": "brilliant-diamond-shining-pearl",
    "legends-arceus": "legends-arceus",
    "scarlet-violet": "scarlet-violet",
    "legends-za": null,
};

// my method key -> comparison bucket
const methodBucket = {
    "level-up": "level-up",
    "evolution": "level-up",
    "technical-machine": "machine",
    "hidden-machine": "machine",
    "technical-record": "machine",
    "egg": "egg",
    "tutor": "tutor",
};
// my-only method keys with no clean PokeAPI equivalent - tracked apart
const myOnlyMethods = new Set([
    "pre-evolution",
    "special",
    "special-moves",
    "transfer-only",
    "reminder",
]);

// PokeAPI method -> comparison bucket
const apiMethodBucket = {
    "level-up": "level-up",
    "machine": "machine",
    "egg": "egg",
    "tutor": "tutor",
};

// Moves my data still stores under a pre-Gen-6 name. Keyed by the
// normalised old name, value is the normalised current PokeAPI name.
const renameAlias = {
    faintattack: "feintattack",
    hijumpkick: "highjumpkick",
    smellingsalts: "smellingsalt",
    vicegrip: "visegrip",
    conversion2: "conversion2",
};

function normaliseName(name) {
    const base = String(name).toLowerCase().replace(/[^a-z0-9]/g, "");
    return renameAlias[base] ?? base;
}

function loadApiPokemonIndex() {
    const index = new Map();
    for (const file of readdirSync(apiPokemonDir)) {
        if (!file.endsWith(".json")) continue;
        const id = Number.parseInt(file.split("-")[0], 10);
        if (Number.isNaN(id)) continue;
        index.set(id, join(apiPokemonDir, file));
    }
    return index;
}

/**
 * Build { bucket -> Map(normName -> {display, level}) } for one pokemon
 * in one version group from the PokeAPI file.
 */
function apiLearnset(apiData, versionGroup) {
    const buckets = { "level-up": new Map(), machine: new Map(),
        egg: new Map(), tutor: new Map() };
    for (const entry of apiData.moves) {
        for (const detail of entry.version_group_details) {
            if (detail.version_group !== versionGroup) continue;
            const bucket = apiMethodBucket[detail.move_learn_method];
            if (!bucket) continue;
            const key = normaliseName(entry.move);
            const prev = buckets[bucket].get(key);
            const level = detail.level_learned_at;
            if (!prev || level < prev.level) {
                buckets[bucket].set(key, { display: entry.move, level });
            }
        }
    }
    return buckets;
}

/**
 * Build the same shape from one of my per-game entries.
 */
function myLearnset(entry) {
    const buckets = { "level-up": new Map(), machine: new Map(),
        egg: new Map(), tutor: new Map() };
    const otherMethods = new Map();
    for (const [method, moves] of Object.entries(entry.moves)) {
        const bucket = methodBucket[method];
        for (const move of moves) {
            const key = normaliseName(move.move_name);
            if (!bucket) {
                if (myOnlyMethods.has(method)) {
                    otherMethods.set(key, { display: move.move_name, method });
                }
                continue;
            }
            const level = method === "evolution"
                ? 0
                : (typeof move.learned_at === "number" ? move.learned_at : 0);
            const prev = buckets[bucket].get(key);
            if (!prev || level < prev.level) {
                buckets[bucket].set(key, { display: move.move_name, level });
            }
        }
    }
    return { buckets, otherMethods };
}

function unionKeys(bucketObj) {
    const all = new Set();
    for (const map of Object.values(bucketObj)) {
        for (const key of map.keys()) all.add(key);
    }
    return all;
}

function display(bucketObj, key) {
    for (const map of Object.values(bucketObj)) {
        if (map.has(key)) return map.get(key).display;
    }
    return key;
}

const apiIndex = loadApiPokemonIndex();
const lines = [];
const summary = [];

const myFiles = readdirSync(myGamesDir)
    .filter((file) => /^\d+-.*\.json$/.test(file))
    .sort();

for (const file of myFiles) {
    const myData = JSON.parse(readFileSync(join(myGamesDir, file), "utf8"));
    const gameKey = myData[0]?.game_key;
    const versionGroup = gameKeyToVersionGroup[gameKey];

    lines.push("");
    lines.push("=".repeat(72));
    lines.push(`${file}   game_key=${gameKey}   -> version_group=${versionGroup}`);
    lines.push("=".repeat(72));

    if (!versionGroup) {
        lines.push("  No PokeAPI version group for this game - skipped.");
        summary.push({ file, gameKey, pokemon: myData.length,
            missing: "-", extra: "-", levelMismatch: "-", note: "no PokeAPI data" });
        continue;
    }

    let comparedPokemon = 0;
    let notInApi = 0;
    let totalMissing = 0;
    let totalExtra = 0;
    let totalLevelMismatch = 0;

    for (const entry of myData) {
        const apiPath = apiIndex.get(entry.pokemon_id);
        if (!apiPath) {
            notInApi++;
            lines.push(`\n#${entry.pokemon_id} ${entry.pokemon_name}: no PokeAPI pokemon file`);
            continue;
        }
        const apiData = JSON.parse(readFileSync(apiPath, "utf8"));
        const apiBuckets = apiLearnset(apiData, versionGroup);
        const { buckets: myBuckets, otherMethods } = myLearnset(entry);

        const apiUnion = unionKeys(apiBuckets);
        const myUnion = unionKeys(myBuckets);

        if (apiUnion.size === 0) {
            // PokeAPI has no learnset for this pokemon in this game
            lines.push(`\n#${entry.pokemon_id} ${entry.pokemon_name}: PokeAPI has no ${versionGroup} learnset (mine has ${myUnion.size})`);
            continue;
        }
        comparedPokemon++;

        const missing = [...apiUnion].filter((key) => !myUnion.has(key)
            && !otherMethods.has(key));
        const extra = [...myUnion].filter((key) => !apiUnion.has(key));
        const levelMismatch = [];
        for (const key of myBuckets["level-up"].keys()) {
            if (!apiBuckets["level-up"].has(key)) continue;
            const mine = myBuckets["level-up"].get(key).level;
            const theirs = apiBuckets["level-up"].get(key).level;
            const bothStartLevel = mine <= 1 && theirs <= 1;
            if (mine !== theirs && !bothStartLevel) {
                levelMismatch.push({ key, mine, theirs,
                    name: myBuckets["level-up"].get(key).display });
            }
        }

        if (!missing.length && !extra.length && !levelMismatch.length) continue;

        totalMissing += missing.length;
        totalExtra += extra.length;
        totalLevelMismatch += levelMismatch.length;

        lines.push(`\n#${entry.pokemon_id} ${entry.pokemon_name}`);
        if (missing.length) {
            lines.push(`  missing in mine (${missing.length}): ` +
                missing.map((key) => display(apiBuckets, key)).sort().join(", "));
        }
        if (extra.length) {
            lines.push(`  extra in mine  (${extra.length}): ` +
                extra.map((key) => display(myBuckets, key)).sort().join(", "));
        }
        for (const mm of levelMismatch) {
            lines.push(`  level-up mismatch: ${mm.name} mine=L${mm.mine} api=L${mm.theirs}`);
        }
    }

    summary.push({ file, gameKey, pokemon: myData.length,
        compared: comparedPokemon, noApi: notInApi,
        missing: totalMissing, extra: totalExtra,
        levelMismatch: totalLevelMismatch });
}

const summaryLines = [];
summaryLines.push("");
summaryLines.push("SUMMARY  (missing = in PokeAPI, absent from mine; " +
    "extra = in mine, absent from PokeAPI)");
summaryLines.push("-".repeat(90));
summaryLines.push(
    "file".padEnd(38) + "pkmn".padStart(6) + "cmp".padStart(6) +
    "noApi".padStart(7) + "missing".padStart(9) + "extra".padStart(8) +
    "lvlDiff".padStart(9));
for (const row of summary) {
    summaryLines.push(
        row.file.padEnd(38) +
        String(row.pokemon).padStart(6) +
        String(row.compared ?? "-").padStart(6) +
        String(row.noApi ?? "-").padStart(7) +
        String(row.missing).padStart(9) +
        String(row.extra).padStart(8) +
        String(row.levelMismatch).padStart(9));
}

const report = summaryLines.join("\n") + "\n\n" + lines.join("\n") + "\n";
writeFileSync(reportPath, report, "utf8");
console.log(summaryLines.join("\n"));
console.log(`\nFull per-pokemon report written to:\n  ${reportPath}`);
