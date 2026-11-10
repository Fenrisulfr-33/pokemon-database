import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
// import addEvolutionObjectToPokemon from './helperFunctions/addEvolutionObjectToPokemon.js';
// import assignEvolutionKeys from './helperFunctions/assignEvolutionKeys.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

const pokemonPath = path.join(__dirname, "./pokemon-data/pokedex");

/**
 * Read all files from a directory and process them
 * @param {string} directoryPath - Path to directory containing files
 * @param {function} processingFunction - Optional function to process each file (receives fileData and fileName)
 * @returns {array} Array of file contents (processed or raw)
 */
function FilesAsArrayList(directoryPath, processingFunction) {
    const files = [];

    fs.readdirSync(directoryPath).forEach(function (file) {
        const fullPath = path.join(directoryPath, file);
        const fileData = require(fullPath);
        
        if (processingFunction) {
            const processedData = processingFunction(fileData, file);
            files.push(processedData);
        } else {
            files.push(fileData);
        }
    });

    return files;
}

/**
 * Read all JSON files from a directory, process them, and update them in place
 * @param {string} directoryPath - Path to directory containing JSON files
 * @param {function} processingFunction - Function to process each file (receives fileData and fileName, returns updated data)
 * @returns {object} Object with count of processed files and any errors
 */
function UpdateFilesInPlace(directoryPath, processingFunction) {
    let processedCount = 0;
    const errors = [];

    fs.readdirSync(directoryPath).forEach(function (file) {
        try {
            const fullPath = path.join(directoryPath, file);
            
            // Skip non-JSON files
            if (path.extname(file) !== '.json') {
                return;
            }

            // Read the JSON file
            const fileData = require(fullPath);
            
            // Process the data
            const updatedData = processingFunction(fileData, file);
            
            // Write back to the same file
            fs.writeFileSync(fullPath, JSON.stringify(updatedData, null, 2), 'utf8');
            
            processedCount++;
            console.log(`✓ Updated: ${file}`);
            
        } catch (error) {
            errors.push({ file, error: error.message });
            console.error(`✗ Error processing ${file}:`, error.message);
        }
    });

    return {
        processed: processedCount,
        errors: errors.length > 0 ? errors : null
    };
}

const errors = {};

export {
    FilesAsArrayList,
    UpdateFilesInPlace
};