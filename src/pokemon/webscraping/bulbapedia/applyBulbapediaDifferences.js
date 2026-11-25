import { applyAcceptedDifferences } from "./bulbapediaCheck.js";

/**
 * Usage: npm run bulbapedia:apply -- <field>
 * Applies rows marked `accept` in the field's differences.md.
 */
async function main() {
    const [fieldName] = process.argv.slice(2);
    if (!fieldName) {
        throw new Error("Usage: npm run bulbapedia:apply -- <field>");
    }
    const { applied, failed } = await applyAcceptedDifferences(fieldName);
    console.log(`Applied ${applied.length} rows`);
    applied.forEach((id) => console.log(`  ${id}`));
    if (failed.length > 0) {
        console.log(`Failed ${failed.length} rows (left as accept):`);
        failed.forEach((message) => console.log(`  ${message}`));
        process.exitCode = 1;
    }
}

main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
});
