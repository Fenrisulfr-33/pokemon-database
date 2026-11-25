const OPENERS = new Set(["{{", "[["]);
const CLOSERS = new Set(["}}", "]]"]);

/**
 * Returns the body (text between `{{` and `}}`) of every top-level
 * template, in page order. Nested templates stay inside their parent.
 * @param {string} wikitext
 * @returns {string[]}
 */
export function findTopLevelTemplates(wikitext) {
    const templateBodies = [];
    let depth = 0;
    let bodyStart = 0;
    for (let position = 0; position < wikitext.length - 1; position += 1) {
        const pair = wikitext.slice(position, position + 2);
        if (pair === "{{") {
            if (depth === 0) {
                bodyStart = position + 2;
            }
            depth += 1;
            position += 1;
        } else if (pair === "}}" && depth > 0) {
            depth -= 1;
            if (depth === 0) {
                templateBodies.push(wikitext.slice(bodyStart, position));
            }
            position += 1;
        }
    }
    return templateBodies;
}

/**
 * Splits a template body on `|`, ignoring pipes inside nested templates
 * and links.
 * @param {string} templateBody
 * @returns {string[]} the template name followed by its parameters
 */
export function splitTemplateParameters(templateBody) {
    const parameters = [];
    let depth = 0;
    let current = "";
    for (let position = 0; position < templateBody.length; position += 1) {
        const pair = templateBody.slice(position, position + 2);
        if (OPENERS.has(pair) || CLOSERS.has(pair)) {
            depth += OPENERS.has(pair) ? 1 : -1;
            current += pair;
            position += 1;
        } else if (templateBody[position] === "|" && depth === 0) {
            parameters.push(current);
            current = "";
        } else {
            current += templateBody[position];
        }
    }
    parameters.push(current);
    return parameters;
}

/**
 * Parses a template body into its name and `key=value` parameters.
 * @param {string} templateBody
 * @returns {{name: string, positional: string[], named: Object}}
 */
export function readTemplate(templateBody) {
    const [name, ...parameters] = splitTemplateParameters(templateBody);
    const positional = [];
    const named = {};
    for (const parameter of parameters) {
        const separator = parameter.indexOf("=");
        if (separator === -1) {
            positional.push(parameter.trim());
        } else {
            named[parameter.slice(0, separator).trim()] =
                parameter.slice(separator + 1);
        }
    }
    return { name: name.trim(), positional, named };
}
