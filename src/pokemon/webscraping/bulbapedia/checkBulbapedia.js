import { runBulbapediaCheck } from "./bulbapediaCheck.js";

/**
 * Usage: npm run bulbapedia:check -- <field> [--refresh]
 * Writes the field's differences.md; never edits entry files.
 */
async function main() {
    const [fieldName, ...flags] = process.argv.slice(2);
    if (!fieldName) {
        throw new Error(
            "Usage: npm run bulbapedia:check -- <field> [--refresh]");
    }
    const summary = await runBulbapediaCheck(fieldName, {
        refresh: flags.includes("--refresh"),
    });
    console.log(`Differences by kind: ${JSON.stringify(summary.countsByKind)}`);
    if (summary.notFound.length > 0) {
        console.log(`Pages not found: ${summary.notFound.join(", ")}`);
    }
    console.log(`Report: ${summary.reportPath}`);
}

main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
});
