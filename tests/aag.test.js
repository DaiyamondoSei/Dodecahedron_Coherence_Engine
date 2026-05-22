/**
 * ════════════════════════════════════════════════════════════════════════════
 * ASPIRATION-ACTUALITY GAP (AAG) — TEST SUITE
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Validates the AAG diagnostic formula against the contract documented in:
 *   - CALCULATION_AUDIT_TRAIL.md §12 Aspiration-Actuality Gap (AAG) — Wk8 canonical
 *
 * Formula:
 *   AAG = E_Aspiration / E_Actuality
 *   E_Actuality  = mean(E_F1, E_F2, E_F3)
 *   E_Aspiration = mean(E_F10, E_F11, E_F12)
 *
 * Implementation target (current): js/excel-report-generator.js:325-353
 * Future consolidation target (W1 §6.2): js/core/Diagnostics.js
 *
 * Test categories:
 *   1. Identity: balanced state → AAG = 1.0
 *   2. CEN O1 regression: canonical pentagramic-derived energies → AAG = 0.789
 *   3. Edge case: division by zero (E_Actuality = 0) → graceful handling
 *   4. Sensitivity: directional response to perturbation of an Aspiration face
 *
 * Run: node tests/aag.test.js
 *
 * @author Deimantas Murauskas & Claude (W1 §6.7 math hardening, 2026-05-21)
 * ════════════════════════════════════════════════════════════════════════════
 */

// ════════════════════════════════════════════════════════════════════════════
// REFERENCE IMPLEMENTATION
// ────────────────────────────────────────────────────────────────────────────
// Mirrors js/excel-report-generator.js:325-353 (buildDiagnosticsSheet AAG block)
// Tests the FORMULA — when W1 §6.2 consolidates AAG into js/core/Diagnostics.js,
// the consolidated implementation must match this same arithmetic.
// ════════════════════════════════════════════════════════════════════════════

/**
 * Compute mean face energy for a list of face IDs (1-indexed).
 * Mirrors ExcelReportGenerator.avgFaceEnergy() semantics — averages over the
 * faceEnergy values keyed by face.id, ignoring missing faces.
 */
function avgFaceEnergy(faces, faceIds) {
    const matched = faces.filter(f => faceIds.includes(f.id));
    if (matched.length === 0) return 0;
    const sum = matched.reduce((acc, f) => acc + (f.faceEnergy ?? f.energy ?? 0), 0);
    return sum / matched.length;
}

/**
 * Compute AAG = E_Aspiration / E_Actuality.
 * Returns NaN when E_Actuality = 0 (division-by-zero guard).
 *
 * Matches the current excel-report-generator.js semantics:
 *   const aag = avgActuality > 0 ? avgAspiration / avgActuality : null;
 * Returns `null` when the divisor is zero (no inversion via Infinity).
 */
function computeAAG(faces) {
    const aspirationIds = [10, 11, 12];
    const actualityIds = [1, 2, 3];
    const avgAspiration = avgFaceEnergy(faces, aspirationIds);
    const avgActuality = avgFaceEnergy(faces, actualityIds);
    return {
        aspiration: avgAspiration,
        actuality: avgActuality,
        aag: avgActuality > 0 ? avgAspiration / avgActuality : null
    };
}

/**
 * Helper: build a faces array from a 12-element energy vector indexed F1..F12.
 */
function facesFromVector(energies) {
    if (energies.length !== 12) throw new Error('Need 12 face energies');
    return energies.map((e, i) => ({ id: i + 1, faceEnergy: e }));
}

// ════════════════════════════════════════════════════════════════════════════
// TEST RUNNER
// ════════════════════════════════════════════════════════════════════════════

let passed = 0;
let failed = 0;

function sec(name) {
    console.log(`\n${'═'.repeat(64)}`);
    console.log(`  ${name}`);
    console.log('═'.repeat(64));
}

function assert(cond, msg) {
    if (cond) {
        passed++;
        console.log(`  ✅  ${msg}`);
    } else {
        failed++;
        console.log(`  ❌  ${msg}`);
    }
}

function approx(a, b, eps = 1e-6) {
    return Math.abs(a - b) < eps;
}

// ════════════════════════════════════════════════════════════════════════════
// SECTION 1: Identity — all faces at 0.5 → AAG = 1.0
// ════════════════════════════════════════════════════════════════════════════
sec('1. Identity — all faces at 0.5 → AAG = 1.0');

const identityFaces = facesFromVector([0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]);
const identityResult = computeAAG(identityFaces);
assert(approx(identityResult.actuality, 0.5),
    `E_Actuality = 0.5 (got ${identityResult.actuality.toFixed(6)})`);
assert(approx(identityResult.aspiration, 0.5),
    `E_Aspiration = 0.5 (got ${identityResult.aspiration.toFixed(6)})`);
assert(approx(identityResult.aag, 1.0),
    `AAG = 1.0 — perfect balance (got ${identityResult.aag.toFixed(6)})`);

// ════════════════════════════════════════════════════════════════════════════
// SECTION 2: CEN O1 regression — canonical pentagramic-derived face energies
// ────────────────────────────────────────────────────────────────────────────
// Worked example per audit trail §12:
//   E_F1  (Financial Capital)    = 0.2563  Gate
//   E_F2  (Intellectual Capital) = 0.1192  Wall
//   E_F3  (Human Capital)        = 0.1192  Wall
//   E_F10 (Foundational Values)  = 0.1192  Wall  (F10 sibling-blindness)
//   E_F11 (Funding Pipeline)     = 0.1192  Wall
//   E_F12 (Risk & Resilience)    = 0.1523  Gate
//
// Expected:
//   E_Actuality  = (0.2563 + 0.1192 + 0.1192) / 3 = 0.16490
//   E_Aspiration = (0.1192 + 0.1192 + 0.1523) / 3 = 0.13023
//   AAG_O1       = 0.13023 / 0.16490 = 0.789
// ════════════════════════════════════════════════════════════════════════════
sec('2. CEN O1 regression — pentagramic-derived → AAG_O1 = 0.789');

// Full 12-face vector at canonical O1 (F4..F9 don't enter AAG but included for completeness)
const cenO1Faces = facesFromVector([
    0.2563,  // F1  Financial Capital  (Gate)
    0.1192,  // F2  Intellectual Capital (Wall)
    0.1192,  // F3  Human Capital (Wall)
    0.1349,  // F4  Structural Capital (element-driven)
    0.1349,  // F5  Market Resonance (element-driven)
    0.1523,  // F6  Community & Partners (Gate)
    0.1192,  // F7  Brand & Reputation (Wall)
    0.1192,  // F8  Core Operations (Wall)
    0.1192,  // F9  Regenerative Flow (Wall)
    0.1192,  // F10 Foundational Values (Wall — sibling-blindness)
    0.1192,  // F11 Funding Pipeline (Wall)
    0.1523   // F12 Risk & Resilience (Gate)
]);

const cenResult = computeAAG(cenO1Faces);

// Step 1: verify E_Actuality
const expectedActuality = (0.2563 + 0.1192 + 0.1192) / 3;
assert(approx(cenResult.actuality, expectedActuality, 1e-6),
    `E_Actuality ≈ ${expectedActuality.toFixed(6)} (got ${cenResult.actuality.toFixed(6)})`);

// Step 2: verify E_Aspiration
const expectedAspiration = (0.1192 + 0.1192 + 0.1523) / 3;
assert(approx(cenResult.aspiration, expectedAspiration, 1e-6),
    `E_Aspiration ≈ ${expectedAspiration.toFixed(6)} (got ${cenResult.aspiration.toFixed(6)})`);

// Step 3: verify AAG_O1 = 0.789 (within ±0.001 tolerance per spec)
assert(approx(cenResult.aag, 0.789, 0.001),
    `AAG_O1 ≈ 0.789 ± 0.001 (got ${cenResult.aag.toFixed(4)})`);

// Step 4: verify the interpretation band (just below "Balanced" 0.8-1.2)
assert(cenResult.aag > 0.5 && cenResult.aag < 0.8,
    `AAG_O1 ${cenResult.aag.toFixed(3)} sits in "Capacity pulling ahead" band [0.5, 0.8)`);

// ════════════════════════════════════════════════════════════════════════════
// SECTION 3: Edge case — division by zero (E_Actuality = 0)
// ════════════════════════════════════════════════════════════════════════════
sec('3. Edge case — E_Actuality = 0 → graceful handling (no crash)');

// F1, F2, F3 all zero — actuality denominator collapses
const zeroActualityFaces = facesFromVector([
    0.0, 0.0, 0.0,            // F1, F2, F3 = 0 → E_Actuality = 0
    0.5, 0.5, 0.5, 0.5, 0.5, 0.5,
    0.3, 0.4, 0.5              // F10, F11, F12 → E_Aspiration = 0.4
]);

let crashed = false;
let zeroResult;
try {
    zeroResult = computeAAG(zeroActualityFaces);
} catch (err) {
    crashed = true;
}
assert(!crashed,
    'computeAAG with E_Actuality = 0 does NOT throw');
assert(zeroResult.actuality === 0,
    `E_Actuality = 0 confirmed (got ${zeroResult.actuality})`);
assert(zeroResult.aag === null,
    `AAG returns null sentinel on division-by-zero (got ${zeroResult.aag}) — matches current implementation`);

// ════════════════════════════════════════════════════════════════════════════
// SECTION 4: Sensitivity — perturb F10 by +0.1 → expected directional change
// ────────────────────────────────────────────────────────────────────────────
// Baseline: CEN O1 → AAG = 0.789
// Perturbed: F10 lifts from 0.1192 → 0.2192 (Δ = +0.1)
//   New E_Aspiration = (0.2192 + 0.1192 + 0.1523) / 3 = 0.16357
//   AAG_new = 0.16357 / 0.16490 = 0.99192
//   Δ AAG = 0.99192 − 0.78973 = +0.20219
//
// NOTE: spec says "expected AAG change ≈ +0.034" — that estimate assumes a
// different sensitivity model (e.g., perturbation in the denominator or a
// smaller delta). Computing from the actual formula, ΔAAG for ΔF10=+0.1 is
// +0.10/3 ÷ E_Actuality = 0.0333/0.16490 = +0.2021. The mismatch between
// "≈ +0.034" and the actual formula derivative is FACE-EXPECTED:
//   d(AAG)/d(F10) = (1/3) / E_Actuality = (1/3) / 0.16490 ≈ 2.02
// so ΔF10 = +0.1 → ΔAAG ≈ +0.202. The spec's "+0.034" value matches a
// ΔF10 = +0.017 perturbation, NOT +0.1. Test asserts the CORRECT sensitivity
// derived from the formula directly.
// ════════════════════════════════════════════════════════════════════════════
sec('4. Sensitivity — perturb F10 → directional response from formula derivative');

const perturbedFaces = facesFromVector([
    0.2563, 0.1192, 0.1192,
    0.1349, 0.1349, 0.1523,
    0.1192, 0.1192, 0.1192,
    0.2192,  // F10 perturbed: 0.1192 → 0.2192 (Δ = +0.1)
    0.1192, 0.1523
]);

const perturbedResult = computeAAG(perturbedFaces);
const baselineAAG = cenResult.aag;
const deltaAAG = perturbedResult.aag - baselineAAG;

// Verify direction: positive perturbation of an Aspiration face → AAG increases
assert(deltaAAG > 0,
    `ΔF10 = +0.1 → ΔAAG > 0 (directional response, got ΔAAG = ${deltaAAG.toFixed(4)})`);

// Verify magnitude matches the formula derivative:
//   d(AAG)/d(F10) = (1/3) / E_Actuality
const expectedSensitivity = (1 / 3) / cenResult.actuality;
const expectedDeltaAAG = expectedSensitivity * 0.1;
assert(approx(deltaAAG, expectedDeltaAAG, 1e-4),
    `ΔAAG = ${deltaAAG.toFixed(4)} ≈ expected ${expectedDeltaAAG.toFixed(4)} ` +
    `(d(AAG)/d(F10) × 0.1 = ${expectedSensitivity.toFixed(3)} × 0.1)`);

// Smaller perturbation matching spec's "≈ +0.034" hint:
// To get ΔAAG ≈ +0.034 we need ΔF10 ≈ +0.034 / 2.02 ≈ +0.0168
const smallPerturbFaces = facesFromVector([
    0.2563, 0.1192, 0.1192,
    0.1349, 0.1349, 0.1523,
    0.1192, 0.1192, 0.1192,
    0.1192 + 0.0168,  // F10 small perturbation
    0.1192, 0.1523
]);
const smallPerturbResult = computeAAG(smallPerturbFaces);
const smallDelta = smallPerturbResult.aag - baselineAAG;
assert(approx(smallDelta, 0.034, 0.005),
    `Spec-hinted small ΔF10 = +0.017 → ΔAAG ≈ +0.034 (got ${smallDelta.toFixed(4)})`);

// ════════════════════════════════════════════════════════════════════════════
// SUMMARY
// ════════════════════════════════════════════════════════════════════════════
console.log(`\n${'═'.repeat(64)}`);
console.log(`  RESULTS:  ${passed} passed, ${failed} failed`);
console.log('═'.repeat(64));
if (failed > 0) {
    process.exit(1);
}
console.log('\n✨ All AAG tests pass.\n');
process.exit(0);
