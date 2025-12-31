/**
 * ============================================================================
 * JSON REGENERATION SCRIPT
 * ============================================================================
 *
 * Runs the CSV-to-JSON converter to regenerate enhanced JSON files.
 *
 * Usage: node scripts/regenerate-json.js
 *
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');

// Create a mock window/global for the browser-based converter
global.window = global;
global.console = console;

// Load the converter
const converterPath = path.join(__dirname, '..', 'js', 'data-system', 'csv-to-json-converter.js');
require(converterPath);

const CSVToJSONConverter = global.CSVToJSONConverter;

if (!CSVToJSONConverter) {
    console.error('❌ Failed to load CSVToJSONConverter');
    process.exit(1);
}

console.log('\n🔄 JSON Regeneration Script');
console.log('='.repeat(50));

// Paths
const dataDir = path.join(__dirname, '..', 'data');
const csvDir = dataDir;
const jsonDir = path.join(dataDir, 'json');

// Ensure json directory exists
if (!fs.existsSync(jsonDir)) {
    fs.mkdirSync(jsonDir, { recursive: true });
}

// Map of JSON type to CSV filename
const conversions = [
    { type: 'dodeca-engine', csvFile: 'CSV_Dodeca_Engine.csv' },
    { type: 'face-models', csvFile: 'CSV_Face_Models.csv' }
];

console.log(`\n📂 Data directory: ${dataDir}`);
console.log(`📂 JSON output: ${jsonDir}\n`);

let successCount = 0;
let errorCount = 0;

for (const { type, csvFile } of conversions) {
    const csvPath = path.join(csvDir, csvFile);
    const jsonPath = path.join(jsonDir, `${type}.json`);

    console.log(`\n📄 Converting ${type}...`);
    console.log(`   CSV: ${csvFile}`);

    try {
        // Check if CSV exists
        if (!fs.existsSync(csvPath)) {
            throw new Error(`CSV file not found: ${csvPath}`);
        }

        // Read CSV content
        const csvContent = fs.readFileSync(csvPath, 'utf8');
        console.log(`   Read ${csvContent.length} bytes from CSV`);

        // Convert
        const jsonData = CSVToJSONConverter.convert(type, csvContent);

        // Write JSON
        const jsonString = JSON.stringify(jsonData, null, 2);
        fs.writeFileSync(jsonPath, jsonString, 'utf8');

        console.log(`   ✅ Generated ${type}.json (${jsonString.length} bytes)`);

        // Show summary
        if (jsonData.$integrityReport) {
            const report = jsonData.$integrityReport;
            console.log(`   📊 Integrity: ${report.overallStatus || 'N/A'}`);
        }

        successCount++;

    } catch (error) {
        console.error(`   ❌ Error: ${error.message}`);
        errorCount++;
    }
}

console.log('\n' + '='.repeat(50));
console.log(`📈 Results: ${successCount} succeeded, ${errorCount} failed`);
console.log('='.repeat(50) + '\n');

process.exit(errorCount > 0 ? 1 : 0);
