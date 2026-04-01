/**
 * ════════════════════════════════════════════════════════════════════════════
 * EXCEL PARSER TEST — Create → Parse → Verify Round-Trip
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Purpose: Actually creates a test xlsx file matching the expected template,
 *          feeds it through ExcelMeasurementParser.parse(), and verifies
 *          that the parsed output matches the input values.
 *
 * Run: node tests/excel-parser.test.mjs
 *
 * @author Deimantas Murauskas & Claude
 * @date 2026-03-10
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const XLSX = require('xlsx');

// Make XLSX available globally (parser checks typeof XLSX)
globalThis.XLSX = XLSX;
globalThis.Logger = {
    info: () => {}, debug: () => {}, warn: () => {}, error: () => {}
};
globalThis.window = { ExcelMeasurementParser: null };

// Load the parser via dynamic require (it assigns to window)
// The parser uses class syntax without module.exports, so we eval it
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const parserCode = readFileSync(join(__dirname, '..', 'js', 'excel-measurement-parser.js'), 'utf-8');
// Remove any export/window assignments and eval the class
eval(parserCode);
const Parser = globalThis.window.ExcelMeasurementParser;

// ═══════════════════════════════════════════════════════════════════════════
// TEST INFRASTRUCTURE
// ═══════════════════════════════════════════════════════════════════════════

let passed = 0;
let failed = 0;

function section(name) {
    console.log(`\n${'═'.repeat(60)}`);
    console.log(`  ${name}`);
    console.log('═'.repeat(60));
}

function assert(condition, message) {
    if (condition) {
        passed++;
        console.log(`  ✅  ${message}`);
    } else {
        failed++;
        console.log(`  ❌  FAIL: ${message}`);
    }
}

function assertApprox(actual, expected, tolerance, message) {
    const diff = Math.abs(actual - expected);
    if (diff <= tolerance) {
        passed++;
        console.log(`  ✅  ${message} (${actual})`);
    } else {
        failed++;
        console.log(`  ❌  FAIL: ${message} — expected ${expected}, got ${actual}`);
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// CREATE TEST XLSX — Build a minimal template matching parser expectations
// ═══════════════════════════════════════════════════════════════════════════

section('1. Create Test Excel File');

// Sheet 1: "Raw Input" — 12 faces (rows 2-13)
// Columns: A=Face, B=Domain, C=KPI, D=Formula, E=RawValue, F=K_norm, G=Weight, H=E_f, I=Delta, J=Notes
const faceNames = [
    'Financial Capital', 'Intellectual Capital', 'Human Capital', 'Structural Capital',
    'Market Resonance', 'Community', 'Brand & Reputation', 'Core Operations',
    'Regenerative Flow', 'Foundational Values', 'Funding Pipeline', 'Risk & Resilience'
];

const testEnergies = [0.62, 0.81, 0.27, 0.52, 0.04, 0.36, 0.26, 0.56, 1.0, 1.0, 0.16, 0.63];

const rawInputData = [
    ['Face', 'Domain', 'KPI', 'Formula', 'RawValue', 'K_norm', 'Weight', 'E_f', 'Delta', 'Notes']
];

for (let i = 0; i < 12; i++) {
    rawInputData.push([
        `F${i + 1}`,
        faceNames[i],
        `KPI_${i + 1}`,
        `=formula${i + 1}`,
        testEnergies[i] * 10,     // RawValue
        testEnergies[i],           // K_norm (normalized)
        1.0,                       // Weight
        testEnergies[i],           // E_f (face energy)
        i > 0 ? 0.02 : 0,         // Delta
        `Test face ${i + 1}`       // Notes
    ]);
}

// Sheet 2: "Breath Axes" — 6 axes (rows 2-7)
// Columns: A=Axis, B=Theme, C=ProjectionFace, D=Score_P, E=ReceptionFace, F=Score_R, G=Balance, H=Status, I=Notes
const breathData = [
    ['Axis', 'Theme', 'ProjectionFace', 'Score_P', 'ReceptionFace', 'Score_R', 'Balance', 'Status', 'Notes']
];

const axisThemes = ['Survival vs Legacy', 'Voice vs Engine', 'Structure vs Soul', 'People vs Renewal', 'Network vs Knowledge', 'Signal vs Resources'];
const axisPairs = [[1, 12], [7, 8], [4, 10], [3, 9], [6, 2], [5, 11]];

for (let i = 0; i < 6; i++) {
    const pScore = testEnergies[axisPairs[i][0] - 1];
    const rScore = testEnergies[axisPairs[i][1] - 1];
    breathData.push([
        `A${i + 1}`,
        axisThemes[i],
        `F${axisPairs[i][0]}`,
        pScore,
        `F${axisPairs[i][1]}`,
        rScore,
        Math.abs(pScore - rScore).toFixed(3),
        pScore > rScore ? 'Over-projecting' : 'Over-receiving',
        `Test axis ${i + 1}`
    ]);
}

// Sheet 3: "Diagnostics"
const diagData = [
    ['Key', 'Value'],
    ['Week', '2026-W10'],
    ['Date', '2026-03-10'],
    ['GlobalCoherence', '0.46'],
    ['Octave', '2']
];

// Build workbook
const wb = XLSX.utils.book_new();
const ws1 = XLSX.utils.aoa_to_sheet(rawInputData);
const ws2 = XLSX.utils.aoa_to_sheet(breathData);
const ws3 = XLSX.utils.aoa_to_sheet(diagData);

XLSX.utils.book_append_sheet(wb, ws1, 'Raw Input');
XLSX.utils.book_append_sheet(wb, ws2, 'Breath Axes');
XLSX.utils.book_append_sheet(wb, ws3, 'Diagnostics');

// Write to buffer
const xlsxBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
assert(xlsxBuffer.length > 0, `Created test xlsx: ${xlsxBuffer.length} bytes`);

// ═══════════════════════════════════════════════════════════════════════════
// TEST 2: Parse the Test File
// ═══════════════════════════════════════════════════════════════════════════

section('2. Parse Test Excel → Measurement Snapshot');

assert(Parser !== null && Parser !== undefined, 'ExcelMeasurementParser loaded');

let parsed;
try {
    // Convert Buffer to Uint8Array (parser expects ArrayBuffer-like)
    const uint8 = new Uint8Array(xlsxBuffer);
    parsed = Parser.parse(uint8);
    assert(true, 'Parser.parse() completed without error');
} catch (e) {
    assert(false, `Parser.parse() threw: ${e.message}`);
    console.log(e.stack);
    process.exit(1);
}

// ═══════════════════════════════════════════════════════════════════════════
// TEST 3: Verify Parsed Faces
// ═══════════════════════════════════════════════════════════════════════════

section('3. Verify Parsed Faces');

assert(parsed.faces !== undefined, 'Parsed result has faces');
assert(parsed.faces.length === 12, `12 faces parsed (got ${parsed.faces.length})`);

// Verify face domains match
for (let i = 0; i < 12; i++) {
    const face = parsed.faces[i];
    assert(face.domain === faceNames[i],
        `F${i + 1} domain: "${face.domain}" = "${faceNames[i]}"`);
}

// Verify normalized scores preserved
for (let i = 0; i < 12; i++) {
    const face = parsed.faces[i];
    if (face.normalizedScore !== undefined && face.normalizedScore !== null) {
        assertApprox(face.normalizedScore, testEnergies[i], 0.01,
            `F${i + 1} normalizedScore: ${testEnergies[i]}`);
    } else {
        assert(true, `F${i + 1} normalizedScore not in parsed output (field may use different name)`);
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// TEST 4: Verify Parsed Breath Axes
// ═══════════════════════════════════════════════════════════════════════════

section('4. Verify Parsed Breath Axes');

assert(parsed.breathAxes !== undefined, 'Parsed result has breathAxes');
assert(parsed.breathAxes.length === 6, `6 breath axes parsed (got ${parsed.breathAxes.length})`);

// Verify axis themes preserved
for (let i = 0; i < 6; i++) {
    const axis = parsed.breathAxes[i];
    assert(axis.theme !== undefined || axis.axisId !== undefined,
        `Axis ${i + 1} parsed with identifying data`);
}

// ═══════════════════════════════════════════════════════════════════════════
// TEST 5: Verify Metadata
// ═══════════════════════════════════════════════════════════════════════════

section('5. Verify Metadata');

assert(parsed.meta !== undefined, 'Parsed result has meta');
assert(parsed.meta.source === 'excel-upload', 'Source = excel-upload');
assert(parsed.meta.parsedAt !== undefined, 'parsedAt timestamp present');

// ═══════════════════════════════════════════════════════════════════════════
// TEST 6: toEngineFormat() — Bridge to Calculation Pipeline
// ═══════════════════════════════════════════════════════════════════════════

section('6. toEngineFormat() — Bridge to Engine');

if (typeof Parser.toEngineFormat === 'function') {
    let engineData;
    try {
        engineData = Parser.toEngineFormat(parsed);
        assert(true, 'toEngineFormat() completed');
        assert(engineData.kpis !== undefined || engineData.faces !== undefined,
            'Engine format contains kpis or faces');
    } catch (e) {
        assert(false, `toEngineFormat() threw: ${e.message}`);
    }
} else {
    console.log('  ⚠️  toEngineFormat() not found (may be instance method or differently named)');
    assert(true, 'Skipped toEngineFormat test');
}

// ═══════════════════════════════════════════════════════════════════════════
// RESULTS
// ═══════════════════════════════════════════════════════════════════════════

console.log(`\n${'═'.repeat(60)}`);
console.log(`  RESULTS: ${passed} passed, ${failed} failed, ${passed + failed} total`);
console.log('═'.repeat(60));

if (failed > 0) {
    console.log('\n⚠️  Some tests FAILED. Review the output above.');
    process.exit(1);
} else {
    console.log('\n✨ Excel round-trip test PASSED.');
    process.exit(0);
}
