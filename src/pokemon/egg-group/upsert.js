import { fileURLToPath } from "url";

import dotenv from "dotenv";

import upsertEntries from "../helpers/upsertEntries.js";
import readJsonDir from "#genericFunctions/files/readJsonDir.js";
import { EGG_GROUP_ENTRIES_DIR } from "#helpers/paths.js";
import schema from "./schema.json" with { type: "json" };

dotenv.config();

async function run() {
    const eggGroups = readJsonDir(EGG_GROUP_ENTRIES_DIR);
    console.log(
        `Loaded ${eggGroups.length} egg groups from ${EGG_GROUP_ENTRIES_DIR}`
    );
    await upsertEntries({
        environment: process.env.MONGO_ENV,
        dbName: `pokemon-${process.env.MONGO_ENV}`,
        collectionName: "egg-groups",
        entries: eggGroups,
        schema
    });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    run().catch((error) => {
        console.error(error);
        process.exit(1);
    });
}

export default run;
