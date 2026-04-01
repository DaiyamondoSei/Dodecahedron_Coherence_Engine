/**
 * ════════════════════════════════════════════════════════════════════════════
 * QUANNEX DATA VALIDATOR — AUTOMATED TEST SUITE
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Purpose: Prove that the DataValidator module correctly detects corruption,
 *          substitutes PHI-derived defaults, and maintains a structured
 *          audit trail for thesis defense.
 *
 * Covers:
 *   1. Module loading and exports
 *   2. PHI-derived default values
 *   3. Corruption pattern detection
 *   4. Face 5 special case (defensive coherence)
 *   5. Structured audit trail
 *   6. Edge cases
 *
 * Run: node tests/data-validator.test.mjs
 *
 * @author Deimantas Murauskas & Claude
 * @date 2026-03-21
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// ═══════════════════════════════════════════════════════════════════════════
// SETUP — Logger shim (data-validator calls Logger.warn/debug at runtime)
// ═══════════════════════════════════════════════════════════════════════════

global.Logger = {
    info: () => {},
    debug: () => {},
    warn: () => {},
    error: () => {}
};

// Load the module under test
const DataValidator = require('../js/data-system/data-validator.js');

// ═══════════════════════════════════════════════════════════════════════════
// TEST RUNNER
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
        console.log(`  ✅  ${message} (${actual} ≈ ${expected})`);
    } else {
        failed++;
        console.log(`  ❌  FAIL: ${message}`);
        console.log(`       Expected: ${expected}, Got: ${actual}, Diff: ${diff}`);
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 1: Module Loading
// ═══════════════════════════════════════════════════════════════════════════

section('1. Module Loading');

assert(DataValidator !== null && DataValidator !== undefined,
    'DataValidator loads successfully');

assert(typeof DataValidator.validateNumber === 'function' &&
       typeof DataValidator.validateFaceEnergy === 'function' &&
       typeof DataValidator.validateKPIScore === 'function' &&
       typeof DataValidator.validateElementalCoherence === 'function' &&
       typeof DataValidator.calculateDefensiveCoherence === 'function' &&
       typeof DataValidator.isCorrupted === 'function',
    'Has all expected validation functions');

assert(typeof DataValidator.clearAuditTrail === 'function' &&
       typeof DataValidator.getLastAuditTrail === 'function',
    'Has audit trail functions (clearAuditTrail, getLastAuditTrail)');

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 2: PHI-Derived Default Values
// ═══════════════════════════════════════════════════════════════════════════

section('2. PHI-Derived Default Values');

const PHI = (1 + Math.sqrt(5)) / 2;
const PHI_1_expected = 1 / PHI;            // 0.618...
const PHI_2_expected = 1 / (PHI * PHI);    // 0.382...
const PHI_MID_expected = 0.5;
const tol = 0.001;

// Verify the constants themselves
assertApprox(DataValidator.PHI_2, PHI_2_expected, tol,
    'PHI_2 constant ≈ 0.382 (phi^-2)');
assertApprox(DataValidator.PHI_MIDPOINT, PHI_MID_expected, tol,
    'PHI_MIDPOINT constant ≈ 0.5');
assertApprox(DataValidator.PHI_1, PHI_1_expected, tol,
    'PHI_1 constant ≈ 0.618 (phi^-1)');

// Verify DEFAULTS object uses the right PHI values
assertApprox(DataValidator.DEFAULTS.faceEnergy, PHI_2_expected, tol,
    'DEFAULTS.faceEnergy = PHI_2 (0.382)');
assertApprox(DataValidator.DEFAULTS.localCoherence, PHI_2_expected, tol,
    'DEFAULTS.localCoherence = PHI_2 (0.382)');
assertApprox(DataValidator.DEFAULTS.kpiValue, PHI_1_expected, tol,
    'DEFAULTS.kpiValue = PHI_1 (0.618)');
assertApprox(DataValidator.DEFAULTS.kpiNormalized, PHI_MID_expected, tol,
    'DEFAULTS.kpiNormalized = PHI_MIDPOINT (0.5)');
assertApprox(DataValidator.DEFAULTS.edgeTension, PHI_2_expected, tol,
    'DEFAULTS.edgeTension = PHI_2 (0.382)');
assertApprox(DataValidator.DEFAULTS.vortexEnergy, PHI_MID_expected, tol,
    'DEFAULTS.vortexEnergy = PHI_MIDPOINT (0.5)');
assertApprox(DataValidator.DEFAULTS.elementalCoherence, PHI_MID_expected, tol,
    'DEFAULTS.elementalCoherence = PHI_MIDPOINT (0.5)');

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 3: Corruption Pattern Detection
// ═══════════════════════════════════════════════════════════════════════════

section('3. Corruption Pattern Detection');

// Always clear state before testing
DataValidator.clearAuditTrail();
DataValidator.clearLog();

const energyDefault = DataValidator.DEFAULTS.faceEnergy; // PHI_2

// null → default
assertApprox(DataValidator.validateNumber(null, 'test null', energyDefault),
    energyDefault, tol, 'null → default (PHI_2)');

// undefined → default
assertApprox(DataValidator.validateNumber(undefined, 'test undef', energyDefault),
    energyDefault, tol, 'undefined → default (PHI_2)');

// empty string → default
assertApprox(DataValidator.validateNumber('', 'test empty', energyDefault),
    energyDefault, tol, '"" (empty string) → default (PHI_2)');

// "Not Found" → default
assertApprox(DataValidator.validateNumber('Not Found', 'test notfound', energyDefault),
    energyDefault, tol, '"Not Found" → default (PHI_2)');

// "[object Object]" → default
assertApprox(DataValidator.validateNumber('[object Object]', 'test objstr', energyDefault),
    energyDefault, tol, '"[object Object]" → default (PHI_2)');

// NaN → default
assertApprox(DataValidator.validateNumber(NaN, 'test NaN', energyDefault),
    energyDefault, tol, 'NaN → default (PHI_2)');

// Infinity → default
assertApprox(DataValidator.validateNumber(Infinity, 'test Inf', energyDefault),
    energyDefault, tol, 'Infinity → default (PHI_2)');

// -Infinity → default
assertApprox(DataValidator.validateNumber(-Infinity, 'test -Inf', energyDefault),
    energyDefault, tol, '-Infinity → default (PHI_2)');

// Non-numeric string → default
assertApprox(DataValidator.validateNumber('abc', 'test abc', energyDefault),
    energyDefault, tol, '"abc" (non-numeric string) → default (PHI_2)');

// Boolean true → default (objects/booleans are corrupted)
assertApprox(DataValidator.validateNumber(true, 'test true', energyDefault),
    energyDefault, tol, 'true (boolean) → default (PHI_2)');

// Boolean false → default
assertApprox(DataValidator.validateNumber(false, 'test false', energyDefault),
    energyDefault, tol, 'false (boolean) → default (PHI_2)');

// Object → default
assertApprox(DataValidator.validateNumber({}, 'test object', energyDefault),
    energyDefault, tol, '{} (object) → default (PHI_2)');

// Array → default
assertApprox(DataValidator.validateNumber([3], 'test array', energyDefault),
    energyDefault, tol, '[3] (array) → default (PHI_2)');

// Valid numbers should pass through
assertApprox(DataValidator.validateNumber(0.5, 'test 0.5', energyDefault),
    0.5, tol, 'Valid 0.5 passes through');

assertApprox(DataValidator.validateNumber(0, 'test 0', energyDefault),
    0, tol, 'Valid 0 passes through');

assertApprox(DataValidator.validateNumber(1.0, 'test 1.0', energyDefault),
    1.0, tol, 'Valid 1.0 passes through');

assertApprox(DataValidator.validateNumber(0.382, 'test 0.382', energyDefault),
    0.382, tol, 'Valid 0.382 passes through');

// String numbers should parse correctly
assertApprox(DataValidator.validateNumber('0.75', 'test str 0.75', energyDefault),
    0.75, tol, 'String "0.75" parses to 0.75');

assertApprox(DataValidator.validateNumber('0', 'test str 0', energyDefault),
    0, tol, 'String "0" parses to 0');

// Negative numbers pass through (validateNumber doesn't clamp)
assertApprox(DataValidator.validateNumber(-0.5, 'test neg', energyDefault),
    -0.5, tol, 'Negative -0.5 passes through (validateNumber does not clamp)');

// Excel error patterns
assertApprox(DataValidator.validateNumber('#N/A', 'test #N/A', energyDefault),
    energyDefault, tol, '"#N/A" (Excel error) → default');

assertApprox(DataValidator.validateNumber('#REF!', 'test #REF!', energyDefault),
    energyDefault, tol, '"#REF!" (Excel error) → default');

assertApprox(DataValidator.validateNumber('#DIV/0!', 'test #DIV/0!', energyDefault),
    energyDefault, tol, '"#DIV/0!" (Excel error) → default');

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 4: Face 5 Special Case — Defensive Coherence
// ═══════════════════════════════════════════════════════════════════════════

section('4. Face 5 Special Case — Defensive Coherence');

// Standard calculation: Ball > 0
const standard = DataValidator.calculateDefensiveCoherence(0.5, 0.6, 0.6);
assert(standard.wasDefensive === false,
    'Standard case (Ball=0.5): wasDefensive = false');
assertApprox(standard.coherence, 0.6 * 0.5 + 0.4 * 0.6, tol,
    'Standard case: gamma*ball + (1-gamma)*pillars = 0.54');

// Defensive case: Ball = 0 but pillars > 0
const defensive = DataValidator.calculateDefensiveCoherence(0, 0.7, 0.6);
assert(defensive.wasDefensive === true,
    'Defensive case (Ball=0, Pillars=0.7): wasDefensive = true');
assert(defensive.coherence > 0,
    'Defensive case produces non-zero result');
assertApprox(defensive.coherence, 0.3 * 0 + 0.7 * 0.7, tol,
    'Defensive case: gamma=0.3 → 0.3*0 + 0.7*0.7 = 0.49');

// Both zero: standard path (pillarAvg === 0)
const bothZero = DataValidator.calculateDefensiveCoherence(0, 0, 0.6);
assert(bothZero.wasDefensive === false,
    'Both zero case: wasDefensive = false (pillarAvg=0 takes standard path)');
assertApprox(bothZero.coherence, 0, tol,
    'Both zero case: coherence = 0');

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 5: Structured Audit Trail
// ═══════════════════════════════════════════════════════════════════════════

section('5. Structured Audit Trail');

// clearAuditTrail resets to empty
DataValidator.clearAuditTrail();
const emptyTrail = DataValidator.getLastAuditTrail();
assert(Array.isArray(emptyTrail) && emptyTrail.length === 0,
    'clearAuditTrail() resets to empty array');

// Process corrupted data → audit trail has entries
DataValidator.clearAuditTrail();
DataValidator.validateNumber(null, 'Face 5 (Market Resonance) energy', DataValidator.DEFAULTS.faceEnergy);
const trail1 = DataValidator.getLastAuditTrail();
assert(trail1.length === 1,
    'After one corrupted value, audit trail has 1 entry');

// Entry has all required fields
const entry = trail1[0];
assert(entry.hasOwnProperty('faceId'),
    'Audit entry has faceId field');
assert(entry.hasOwnProperty('field'),
    'Audit entry has field field');
assert(entry.hasOwnProperty('originalValue'),
    'Audit entry has originalValue field');
assert(entry.hasOwnProperty('substitutedValue'),
    'Audit entry has substitutedValue field');
assert(entry.hasOwnProperty('reason'),
    'Audit entry has reason field');
assert(entry.hasOwnProperty('phiDerivation'),
    'Audit entry has phiDerivation field');

// Verify content of the audit entry
assert(entry.faceId === 5,
    'Audit entry faceId = 5 (parsed from context)');
assert(entry.field === 'energy',
    'Audit entry field = "energy" (parsed from context)');
assert(entry.originalValue === null,
    'Audit entry originalValue = null');
assertApprox(entry.substitutedValue, DataValidator.DEFAULTS.faceEnergy, tol,
    'Audit entry substitutedValue = PHI_2 (0.382)');
assert(typeof entry.reason === 'string' && entry.reason.length > 0,
    'Audit entry reason is non-empty string');
assert(typeof entry.phiDerivation === 'string' && entry.phiDerivation.includes('PHI'),
    'Audit entry phiDerivation references PHI constant');

// Multiple corruptions produce multiple entries
DataValidator.clearAuditTrail();
DataValidator.validateNumber(undefined, 'Face 1 energy', DataValidator.DEFAULTS.faceEnergy);
DataValidator.validateNumber('Not Found', 'Face 2 energy', DataValidator.DEFAULTS.faceEnergy);
DataValidator.validateNumber(NaN, 'Face 3 energy', DataValidator.DEFAULTS.faceEnergy);
const trail3 = DataValidator.getLastAuditTrail();
assert(trail3.length === 3,
    'Three corrupted values → 3 audit trail entries');

// Valid data produces no audit entries
DataValidator.clearAuditTrail();
DataValidator.validateNumber(0.75, 'Face 1 energy', DataValidator.DEFAULTS.faceEnergy);
DataValidator.validateNumber(0.5, 'Face 2 energy', DataValidator.DEFAULTS.faceEnergy);
const trailValid = DataValidator.getLastAuditTrail();
assert(trailValid.length === 0,
    'Valid data produces no audit trail entries');

// Reason field accuracy
DataValidator.clearAuditTrail();
DataValidator.validateNumber(null, 'Face 1 energy', DataValidator.DEFAULTS.faceEnergy);
assert(DataValidator.getLastAuditTrail()[0].reason === 'null',
    'Reason for null = "null"');

DataValidator.clearAuditTrail();
DataValidator.validateNumber(undefined, 'Face 1 energy', DataValidator.DEFAULTS.faceEnergy);
assert(DataValidator.getLastAuditTrail()[0].reason === 'undefined',
    'Reason for undefined = "undefined"');

DataValidator.clearAuditTrail();
DataValidator.validateNumber('', 'Face 1 energy', DataValidator.DEFAULTS.faceEnergy);
assert(DataValidator.getLastAuditTrail()[0].reason === 'empty string',
    'Reason for "" = "empty string"');

// phiDerivation for different defaults
DataValidator.clearAuditTrail();
DataValidator.validateNumber(null, 'KPI test on Face 1', DataValidator.DEFAULTS.kpiNormalized);
const kpiEntry = DataValidator.getLastAuditTrail()[0];
assert(kpiEntry.phiDerivation.includes('PHI_MIDPOINT'),
    'phiDerivation for kpiNormalized references PHI_MIDPOINT');

DataValidator.clearAuditTrail();
DataValidator.validateNumber(null, 'Face 1 energy', DataValidator.DEFAULTS.kpiValue);
const kpiValEntry = DataValidator.getLastAuditTrail()[0];
assert(kpiValEntry.phiDerivation.includes('PHI_1'),
    'phiDerivation for kpiValue references PHI_1');

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 6: Edge Cases
// ═══════════════════════════════════════════════════════════════════════════

section('6. Edge Cases');

DataValidator.clearAuditTrail();

// Very large number
assertApprox(DataValidator.validateNumber(1e15, 'test huge', energyDefault),
    1e15, 1, 'Very large number (1e15) passes through');

// Very small positive number
assertApprox(DataValidator.validateNumber(1e-15, 'test tiny', energyDefault),
    1e-15, 1e-14, 'Very small positive number (1e-15) passes through');

// Negative zero
const negZero = DataValidator.validateNumber(-0, 'test neg zero', energyDefault);
assert(negZero === 0 || Object.is(negZero, -0),
    'Negative zero passes through as numeric');

// Numbers at exact PHI boundaries
assertApprox(DataValidator.validateNumber(0.382, 'test phi boundary', energyDefault),
    0.382, tol, 'Value 0.382 (PHI_2 boundary) passes through');
assertApprox(DataValidator.validateNumber(0.618, 'test phi boundary', energyDefault),
    0.618, tol, 'Value 0.618 (PHI_1 boundary) passes through');

// validateFaceEnergy clamps out-of-range values
const clamped = DataValidator.validateFaceEnergy(1.5, 1, 'TestFace');
assertApprox(clamped, 1.0, tol,
    'validateFaceEnergy clamps 1.5 → 1.0');

const clampedNeg = DataValidator.validateFaceEnergy(-0.5, 1, 'TestFace');
assertApprox(clampedNeg, 0, tol,
    'validateFaceEnergy clamps -0.5 → 0');

// validateKPIScore clamps out-of-range
const kpiClamped = DataValidator.validateKPIScore(2.0, 'K1', 'TestKPI', 1);
assertApprox(kpiClamped, 1.0, tol,
    'validateKPIScore clamps 2.0 → 1.0');

// validateElementalCoherence special "Not Found" handling
DataValidator.clearAuditTrail();
const elemResult = DataValidator.validateElementalCoherence('Not Found', 'F10-Ether', 'V3');
assertApprox(elemResult, DataValidator.DEFAULTS.elementalCoherence, tol,
    'validateElementalCoherence: "Not Found" → PHI_MIDPOINT (0.5)');
assert(DataValidator.getLastAuditTrail().length === 1,
    'validateElementalCoherence "Not Found" creates audit entry');
assert(DataValidator.getLastAuditTrail()[0].field === 'elementalCoherence',
    'validateElementalCoherence: audit entry field = "elementalCoherence"');
assert(DataValidator.getLastAuditTrail()[0].faceId === 10,
    'validateElementalCoherence: audit entry faceId = 10 (from F10-Ether)');

// isCorrupted direct tests
assert(DataValidator.isCorrupted(null) === true, 'isCorrupted(null) = true');
assert(DataValidator.isCorrupted(undefined) === true, 'isCorrupted(undefined) = true');
assert(DataValidator.isCorrupted('') === true, 'isCorrupted("") = true');
assert(DataValidator.isCorrupted(0.5) === false, 'isCorrupted(0.5) = false');
assert(DataValidator.isCorrupted(NaN) === true, 'isCorrupted(NaN) = true');
assert(DataValidator.isCorrupted(Infinity) === true, 'isCorrupted(Infinity) = true');

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
    console.log('\n✨ All tests PASSED. Data integrity guardian verified.');
    process.exit(0);
}
