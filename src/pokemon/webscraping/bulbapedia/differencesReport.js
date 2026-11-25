import fs from "fs";

const TABLE_HEADER = [
    "| ID | Pokemon | Game | Kind | Ours | Bulbapedia | Decision |",
    "| --- | --- | --- | --- | --- | --- | --- |",
];
const DECISIONS = new Set(["accept", "reject"]);
const UNESCAPED_PIPE = /(?<!\\)\|/;

function escapeCell(text) {
    return (text ?? "—").replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
}

function withNote(difference) {
    if (!difference.note) {
        return difference.bulbapedia;
    }
    const noteText = `*${difference.note}*`;
    return difference.bulbapedia ? `${noteText}: ${difference.bulbapedia}`
        : noteText;
}

function renderRow(difference, decisions) {
    const cells = [
        `\`${difference.id}\``, difference.pokemon,
        `\`${difference.gameKey}\``, difference.kind,
        difference.ours, withNote(difference),
        decisions.get(difference.id) ?? "",
    ];
    return `| ${cells.map(escapeCell).join(" | ")} |`;
}

function renderTable(title, differences, decisions) {
    const heading = `## ${title} (${differences.length})`;
    if (differences.length === 0) {
        return [heading, "", "None."];
    }
    const rows = differences.map((difference) =>
        renderRow(difference, decisions));
    return [heading, "", ...TABLE_HEADER, ...rows];
}

function renderIntroduction(field, checkedCount, date) {
    const command = `npm run bulbapedia:check -- ${field.fieldName}`;
    return [
        `# Bulbapedia differences: \`${field.fieldName}\``,
        "",
        `Checked ${checkedCount} files against Bulbapedia on ${date}`,
        `(\`${command}\`). Nothing here has been applied yet.`,
        "",
        "Set **Decision** to `accept` or `reject`, then run",
        `\`npm run bulbapedia:apply -- ${field.fieldName}\` to apply the`,
        "accepted rows. Decisions are kept when the check is re-run.",
        "",
        "| Kind | Meaning |",
        "| --- | --- |",
        ...Object.entries(field.kindDescriptions)
            .map(([kind, meaning]) => `| ${kind} | ${meaning} |`),
    ];
}

function renderNotFound(notFound) {
    if (notFound.length === 0) {
        return [];
    }
    return ["", "## Bulbapedia pages not found", "",
        ...notFound.map((fileName) => `- \`${fileName}\``)];
}

/**
 * Builds differences.md. Punctuation-only differences get their own
 * table so the main table holds real wording and data changes.
 * @param {Object} report - field, differences, decisions (id → decision),
 *   checkedCount, notFound and date
 * @returns {string}
 */
export function renderDifferencesReport(report) {
    const { field, differences, decisions, checkedCount, notFound, date }
        = report;
    const isPunctuation = (difference) => difference.kind === "punctuation";
    return [
        ...renderIntroduction(field, checkedCount, date),
        "",
        ...renderTable("Differences",
            differences.filter((difference) => !isPunctuation(difference)),
            decisions),
        "",
        ...renderTable("Spacing and punctuation",
            differences.filter(isPunctuation), decisions),
        ...renderNotFound(notFound),
        "",
    ].join("\n");
}

function readRowDecision(line) {
    const cells = line.split(UNESCAPED_PIPE).map((cell) => cell.trim());
    const idMatch = cells[1]?.match(/^`(.+)`$/);
    const decision = cells.at(-2)?.toLowerCase();
    return idMatch && DECISIONS.has(decision) ? [idMatch[1], decision] : null;
}

/**
 * Reads the Decision column of a differences.md.
 * @param {string} markdown
 * @returns {Map<string, string>} row id → `accept` or `reject`
 */
export function readDecisions(markdown) {
    const decisions = new Map();
    for (const line of markdown.split(/\r?\n/)) {
        const rowDecision = line.startsWith("| `") ? readRowDecision(line)
            : null;
        if (rowDecision) {
            decisions.set(...rowDecision);
        }
    }
    return decisions;
}

export function readDecisionsFile(reportPath) {
    return fs.existsSync(reportPath)
        ? readDecisions(fs.readFileSync(reportPath, "utf8"))
        : new Map();
}
