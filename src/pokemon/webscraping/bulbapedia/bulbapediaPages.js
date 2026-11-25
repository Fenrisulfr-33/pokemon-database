import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import axios from "axios";

const API_URL = "https://bulbapedia.bulbagarden.net/w/api.php";
const USER_AGENT = "pokemon-data-checker/1.0";
const PAGES_PER_REQUEST = 50;
const PAUSE_BETWEEN_REQUESTS_MS = 2000;
const CACHE_DIR = path.join(
    path.dirname(fileURLToPath(import.meta.url)), ".cache");

/** Bulbapedia species page titles to try, in order, for a pokemon. */
export function pageTitlesFor(englishName) {
    const titles = [`${englishName} (Pokémon)`];
    if (englishName.includes("-")) {
        titles.push(`${englishName.replaceAll("-", " ")} (Pokémon)`);
    }
    return titles;
}

function cachePathFor(fileName) {
    return path.join(CACHE_DIR, fileName.replace(/\.json$/, ".wikitext"));
}

function readCachedWikitext(fileName) {
    const cachePath = cachePathFor(fileName);
    return fs.existsSync(cachePath) ? fs.readFileSync(cachePath, "utf8")
        : null;
}

function writeCachedWikitext(fileName, wikitext) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    fs.writeFileSync(cachePathFor(fileName), wikitext, "utf8");
}

function pause(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function requestPages(titles) {
    const response = await axios.get(API_URL, {
        headers: { "User-Agent": USER_AGENT },
        params: {
            action: "query", prop: "revisions", rvprop: "content",
            rvslots: "main", titles: titles.join("|"), redirects: 1,
            format: "json", formatversion: 2,
        },
        timeout: 60000,
    });
    return response.data.query;
}

/** Follows normalisation and redirects back to the requested titles. */
function mapContentsToTitles(query, titles) {
    const finalTitleFor = new Map(titles.map((title) => [title, title]));
    for (const step of [query.normalized ?? [], query.redirects ?? []]) {
        for (const { from, to } of step) {
            for (const [requested, current] of finalTitleFor) {
                if (current === from) {
                    finalTitleFor.set(requested, to);
                }
            }
        }
    }
    const pagesByTitle = new Map(query.pages.map((page) => [page.title, page]));
    const contents = new Map();
    for (const [requested, finalTitle] of finalTitleFor) {
        const page = pagesByTitle.get(finalTitle);
        if (page?.revisions) {
            contents.set(requested, page.revisions[0].slots.main.content);
        }
    }
    return contents;
}

async function fetchTitles(titles) {
    const contents = new Map();
    for (let start = 0; start < titles.length; start += PAGES_PER_REQUEST) {
        const batch = titles.slice(start, start + PAGES_PER_REQUEST);
        const batchContents = mapContentsToTitles(
            await requestPages(batch), batch);
        batchContents.forEach((wikitext, title) =>
            contents.set(title, wikitext));
        console.log(`Fetched ${start + batch.length}/${titles.length} pages`);
        await pause(PAUSE_BETWEEN_REQUESTS_MS);
    }
    return contents;
}

async function fetchMissingPages(records, attempt) {
    const titleToFile = new Map();
    for (const { fileName, record } of records) {
        const title = pageTitlesFor(record.name.english)[attempt];
        if (title) {
            titleToFile.set(title, fileName);
        }
    }
    const contents = await fetchTitles([...titleToFile.keys()]);
    contents.forEach((wikitext, title) =>
        writeCachedWikitext(titleToFile.get(title), wikitext));
}

/**
 * Loads each record's Bulbapedia species page, from the local cache
 * when present. `refresh` re-downloads every page.
 * @param {Array<{fileName: string, record: Object}>} records
 * @param {{refresh?: boolean}} options
 * @returns {Promise<{pages: Map<string, string>, notFound: string[]}>}
 *   file name → wikitext, and files whose page wasn't found
 */
export async function loadBulbapediaPages(records, { refresh = false } = {}) {
    const isNotCached = ({ fileName }) =>
        readCachedWikitext(fileName) === null;
    const firstTry = refresh ? records : records.filter(isNotCached);
    if (firstTry.length > 0) {
        await fetchMissingPages(firstTry, 0);
    }
    const secondTry = records.filter(isNotCached);
    if (secondTry.length > 0) {
        await fetchMissingPages(secondTry, 1);
    }
    const pages = new Map();
    const notFound = [];
    for (const { fileName } of records) {
        const wikitext = readCachedWikitext(fileName);
        wikitext === null ? notFound.push(fileName)
            : pages.set(fileName, wikitext);
    }
    return { pages, notFound };
}
