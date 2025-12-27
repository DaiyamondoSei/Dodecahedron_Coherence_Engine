/**
 * Node.js Migration Script
 * Runs the CSV to JSON conversion and saves files directly to data/json/
 */

const fs = require('fs');
const path = require('path');

// Load the converter source
const converterPath = path.join(__dirname, '..', 'js', 'data-system', 'csv-to-json-converter.js');
const converterSource = fs.readFileSync(converterPath, 'utf8');

// Create a minimal browser-like environment
const window = {};
const document = {
    dispatchEvent: () => {}
};
const CustomEvent = function(name, options) {
    this.type = name;
    this.detail = options?.detail;
};

// Execute the converter module
eval(converterSource);

// Get the converter from global scope
const CSVToJSONConverter = window.CSVToJSONConverter;

// Paths
const dataDir = path.join(__dirname, '..', 'data');
const jsonDir = path.join(dataDir, 'json');

// Ensure json directory exists
if (!fs.existsSync(jsonDir)) {
    fs.mkdirSync(jsonDir, { recursive: true });
}

// CSV files to process
const csvFiles = [
    { type: 'kpi-database', file: 'CSV_KPI_Database.csv' },
    { type: 'edge-tension', file: 'CSV_Edge_tension_Map.csv' },
    { type: 'vortex-map', file: 'CSV_Vortex_Map.csv' },
    { type: 'breath-ratios', file: 'CSV_BREATH_RATIOS.csv' },
    { type: 'face-models', file: 'CSV_Face_Models.csv' },
    { type: 'dodeca-engine', file: 'CSV_Dodeca_Engine.csv' },
    { type: 'system-coherence', file: 'CSV_System_Coherence.csv' },
    { type: 'spiral-dashboard', file: 'CSV_SPIRAL_DASHBOARD.csv' }
];

console.log('Starting CSV to JSON migration...\n');

let totalRecords = 0;
let totalSubstitutions = 0;
let successCount = 0;

for (const { type, file } of csvFiles) {
    const csvPath = path.join(dataDir, file);

    if (!fs.existsSync(csvPath)) {
        console.log(`[SKIP] ${file} - not found`);
        continue;
    }

    try {
        const csvContent = fs.readFileSync(csvPath, 'utf8');
        const json = CSVToJSONConverter.convert(type, csvContent);

        // Save JSON file
        const jsonFilename = `${type}.json`;
        const jsonPath = path.join(jsonDir, jsonFilename);
        fs.writeFileSync(jsonPath, JSON.stringify(json, null, 2), 'utf8');

        const recordCount = json.$integrityReport?.totalRecords || 0;
        const subCount = json.$integrityReport?.substitutionCount || 0;

        totalRecords += recordCount;
        totalSubstitutions += subCount;
        successCount++;

        console.log(`[OK] ${file} -> ${jsonFilename} (${recordCount} records, ${subCount} substitutions)`);

    } catch (error) {
        console.log(`[ERROR] ${file}: ${error.message}`);
    }
}

console.log('\n--- Migration Complete ---');
console.log(`Files converted: ${successCount}/${csvFiles.length}`);
console.log(`Total records: ${totalRecords}`);
console.log(`Total substitutions: ${totalSubstitutions}`);
console.log(`Output directory: ${jsonDir}`);
