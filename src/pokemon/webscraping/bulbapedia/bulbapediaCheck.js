import fs from "fs";
import path from "path";

import { loadBulbapediaPages } from "./bulbapediaPages.js";
import {
    readDecisionsFile,
    renderDifferencesReport,
} from "./differencesReport.js";
import { findBulbapediaField } from "./fields/index.js";

function loadRecords(entriesDir) {
    return fs.readdirSync(entriesDir)
        .filter((fileName) => fileName.endsWith(".json"))
        .sort((first, second) => parseFloat(first) - parseFloat(second))
        .map((fileName) => {
            const filePath = path.join(entriesDir, fileName);
            const record = JSON.parse(fs.readFileSync(filePath, "utf8"));
            return { fileName, filePath, record };
        });
}

function findAllDifferences(field, records, pages) {
    return records
        .filter(({ fileName }) => pages.has(fileName))
        .flatMap(({ fileName, record }) =>
            field.findDifferences(record, fileName, pages.get(fileName)));
}

async function compareWithBulbapedia(field, refresh) {
    const records = loadRecords(field.entriesDir);
    const { pages, notFound } = await loadBulbapediaPages(records, { refresh });
    const differences = findAllDifferences(field, records, pages);
    return { records, differences, notFound };
}

function writeReport(field, comparison) {
    const report = renderDifferencesReport({
        field,
        differences: comparison.differences,
        decisions: readDecisionsFile(field.reportPath),
        checkedCount: comparison.records.length,
        notFound: comparison.notFound,
        date: new Date().toISOString().slice(0, 10),
    });
    fs.writeFileSync(field.reportPath, report, "utf8");
}

/**
 * Compares a field with Bulbapedia and writes the field's
 * differences.md. Never edits entry files.
 * @param {string} fieldName - e.g. `pokedexEntries`
 * @param {{refresh?: boolean}} options - refresh re-downloads pages
 * @returns {Promise<Object>} counts by kind, report path, pages not found
 */
export async function runBulbapediaCheck(fieldName, { refresh = false } = {}) {
    const field = findBulbapediaField(fieldName);
    const comparison = await compareWithBulbapedia(field, refresh);
    writeReport(field, comparison);
    const countsByKind = {};
    for (const { kind } of comparison.differences) {
        countsByKind[kind] = (countsByKind[kind] ?? 0) + 1;
    }
    return {
        reportPath: field.reportPath,
        countsByKind,
        notFound: comparison.notFound,
    };
}

function applyToFile(field, filePath, fileDifferences) {
    let fileText = fs.readFileSync(filePath, "utf8");
    for (const difference of fileDifferences) {
        fileText = field.applyDifference(fileText, difference);
    }
    JSON.parse(fileText);
    fs.writeFileSync(filePath, fileText, "utf8");
}

/** Locked fields (see pokedex/locks/locks.json) are only edited by hand. */
function refuseLockedField(field) {
    if (!field.locksPath || !fs.existsSync(field.locksPath)) {
        return;
    }
    const locks = JSON.parse(fs.readFileSync(field.locksPath, "utf8"));
    if (Object.hasOwn(locks, field.fieldName)) {
        throw new Error(`${field.fieldName} is locked in ${field.locksPath};`
            + " apply locked fields only when asked, by hand.");
    }
}

function groupByFile(differences) {
    const differencesByFile = new Map();
    for (const difference of differences) {
        const fileDifferences = differencesByFile.get(difference.file) ?? [];
        differencesByFile.set(difference.file,
            [...fileDifferences, difference]);
    }
    return differencesByFile;
}

/**
 * Applies the rows marked `accept` in differences.md, then re-runs the
 * check so the report only lists what is still different.
 * @param {string} fieldName
 * @returns {Promise<{applied: string[], failed: string[]}>} row ids
 */
export async function applyAcceptedDifferences(fieldName) {
    const field = findBulbapediaField(fieldName);
    refuseLockedField(field);
    const decisions = readDecisionsFile(field.reportPath);
    const { differences } = await compareWithBulbapedia(field, false);
    const accepted = differences.filter((difference) =>
        decisions.get(difference.id) === "accept");
    const applied = [];
    const failed = [];
    for (const [fileName, fileDifferences] of groupByFile(accepted)) {
        const ids = fileDifferences.map((difference) => difference.id);
        try {
            applyToFile(field, path.join(field.entriesDir, fileName),
                fileDifferences);
            applied.push(...ids);
        } catch (error) {
            failed.push(...ids.map((id) => `${id}: ${error.message}`));
        }
    }
    await runBulbapediaCheck(fieldName);
    return { applied, failed };
}
