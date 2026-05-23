/**
 * ════════════════════════════════════════════════════════════════════════════
 * APPARENT vs GRANULAR GAP (AvG) — TEST SUITE
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Validates the AvG diagnostic formula against the contract documented in:
 *   - CALCULATION_AUDIT_TRAIL.md §16 Apparent vs Granular Gap (AvG)
 *
 * Formula:
 *   AvG = |C_global − K_mean_60|
 *   C_global_raw = μ_E × (1 − λ · CV_E)   [pre-amplifier raw, NOT post-κ]
 *   K_mean_60    = arithmetic mean of all 60 element-level KPI values
 *                  (silent cells zero-filled per canonical zeroEnergy rule)
 *
 * λ = φ⁻³ ≈ 0.2361 (canonical Quannex tuning, audit trail §1)
 *
 * Implementation target: js/core/Diagnostics.js (W2 Session A, Lock #8.26)
 *
 * Scope distinction (audit trail §16): AvG_O1 vs AvG_all answer different
 * questions and MUST carry explicit scope labels.
 *
 * Test categories:
 *   1. Identity: all faces + all KPIs at 0.5 → AvG = 0
 *   2. CEN AvG_O1 regression: canonical strict-O1 → 0.0882 (Aggregation distortion border)
 *   3. CEN AvG_all regression: canonical all-octave → 0.0184 (Faithful aggregation)
 *   4. Pre-amplifier choice: verify raw NOT post-κ
 *   5. φ-derived band classification at boundaries
 *   6. Edge cases: empty faces, empty KPIs, all-zero, all-equal (CV=0)
 *   7. Real Diagnostics module integration: load + invoke + compare to reference
 *
 * Run: node tests/avg.test.js
 *
 * @author Deimantas Murauskas & Claude (W2 Session A, 2026-05-23)
 * ════════════════════════════════════════════════════════════════════════════
 */

// ════════════════════════════════════════════════════════════════════════════
// REFERENCE IMPLEMENTATION
// ────────────────────────────────────────────────────────────────────────────
// Mirrors js/core/Diagnostics.js getApparentGranularGap() — this is the
// test contract. The consolidated Diagnostics implementation MUST match
// this same arithmetic (Section 7 of this file loads the real module and
// verifies the contract).
// ════════════════════════════════════════════════════════════════════════════

const PHI_REF = (1 + Math.sqrt(5)) / 2;
const LAMBDA_REF = 1 / (PHI_REF * PHI_REF * PHI_REF);  // φ⁻³

const BAND_FAITHFUL_MAX_REF   = 1 / Math.pow(PHI_REF, 6);  // φ⁻⁶ ≈ 0.0557
const BAND_MINOR_MAX_REF      = 1 / Math.pow(PHI_REF, 5);  // φ⁻⁵ ≈ 0.0902
const BAND_DISTORTION_MAX_REF = 1 / Math.pow(PHI_REF, 4);  // φ⁻⁴ ≈ 0.1459

/**
 * Reference: compute C_global pre-amplifier raw from face energies.
 */
function computeCGlobalRawRef(values) {
    if (!Array.isArray(values) || values.length === 0) {
        return { muE: 0, sigmaE: 0, cvE: 0, cGlobal: 0 };
    }
    const n = values.length;
    const muE = values.reduce((a, v) => a + v, 0) / n;
    if (muE === 0) return { muE: 0, sigmaE: 0, cvE: 0, cGlobal: 0 };
    const variance = values.reduce((a, v) => a + (v - muE) * (v - muE), 0) / n;
    const sigmaE = Math.sqrt(variance);
    const cvE = sigmaE / muE;
    const cGlobal = muE * (1 - LAMBDA_REF * cvE);
    return { muE, sigmaE, cvE, cGlobal };
}

/**
 * Reference: classify AvG into φ-derived bands.
 */
function classifyBandRef(avg) {
    if (avg < BAND_FAITHFUL_MAX_REF)   return 'faithful';
    if (avg < BAND_MINOR_MAX_REF)      return 'minor_compression';
    if (avg < BAND_DISTORTION_MAX_REF) return 'aggregation_distortion';
    return 'severe_distortion';
}

/**
 * Reference: compute AvG from face energies + KPI grid.
 */
function computeAvGRef(faceEnergies, kpiGrid) {
    const values = Array.isArray(faceEnergies)
        ? faceEnergies.map(f => f.faceEnergy ?? f.energy ?? (typeof f === 'number' ? f : 0))
        : Object.values(faceEnergies || {}).filter(v => typeof v === 'number');
    const cg = computeCGlobalRawRef(values);
    const kpiValid = Array.isArray(kpiGrid)
        ? kpiGrid.filter(v => v != null && typeof v === 'number')
        : [];
    const kMean60 = kpiValid.length > 0
        ? kpiValid.reduce((a, v) => a + v, 0) / kpiValid.length
        : 0;
    const avg = values.length === 0 ? null : Math.abs(cg.cGlobal - kMean60);
    return {
        avg,
        cGlobal: cg.cGlobal,
        kMean60,
        muE: cg.muE,
        sigmaE: cg.sigmaE,
        cvE: cg.cvE,
        band: avg === null ? null : classifyBandRef(avg)
    };
}

/**
 * Helper: build a faces array from a 12-element energy vector indexed F1..F12.
 */
function facesFromVector(energies) {
    if (energies.length !== 12) throw new Error('Need 12 face energies');
    return energies.map((e, i) => ({ id: i + 1, faceEnergy: e }));
}

/**
 * Helper: build a 60-element KPI grid with N non-zero cells summing to a
 * target value (rest zero-filled per canonical zeroEnergy rule).
 */
function kpiGridFromSparse(nonZeroCount, totalSum) {
    const grid = new Array(60).fill(0);
    if (nonZeroCount === 0) return grid;
    const perCell = totalSum / nonZeroCount;
    for (let i = 0; i < nonZeroCount; i++) grid[i] = perCell;
    return grid;
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
// SECTION 1: Identity — all faces at 0.5, all 60 KPIs at 0.5 → AvG = 0
// ────────────────────────────────────────────────────────────────────────────
// μ_E = 0.5, σ_E = 0 (all equal), CV_E = 0 → C_global = 0.5 × (1 − 0) = 0.5
// K_mean_60 = 0.5 (all cells at 0.5)
// AvG = |0.5 − 0.5| = 0  →  "faithful" band
// ════════════════════════════════════════════════════════════════════════════
sec('1. Identity — uniform faces + uniform KPIs → AvG = 0');

const identityFaces = facesFromVector(new Array(12).fill(0.5));
const identityGrid = new Array(60).fill(0.5);
const identityResult = computeAvGRef(identityFaces, identityGrid);

assert(approx(identityResult.muE, 0.5),
    `μ_E = 0.5 (got ${identityResult.muE.toFixed(6)})`);
assert(approx(identityResult.cvE, 0),
    `CV_E = 0 — uniform faces (got ${identityResult.cvE.toFixed(6)})`);
assert(approx(identityResult.cGlobal, 0.5),
    `C_global_raw = 0.5 — no CV penalty (got ${identityResult.cGlobal.toFixed(6)})`);
assert(approx(identityResult.kMean60, 0.5),
    `K_mean_60 = 0.5 (got ${identityResult.kMean60.toFixed(6)})`);
assert(approx(identityResult.avg, 0),
    `AvG = 0 — perfect aggregation honesty (got ${identityResult.avg.toFixed(6)})`);
assert(identityResult.band === 'faithful',
    `band = "faithful" (got "${identityResult.band}")`);

// ════════════════════════════════════════════════════════════════════════════
// SECTION 2: CEN AvG_O1 regression — strict-O1 scope, canonical pentagramic
// ────────────────────────────────────────────────────────────────────────────
// Worked example per audit trail §16:
//   μ_E = 0.138758, σ_E = 0.037517, CV_E = 0.270376
//   C_global_raw = 0.138758 × (1 − 0.236068 × 0.270376) = 0.129902
//   K_mean_60_O1_only = 0.0417 (7 non-zero cells of 60)
//   AvG_O1 = |0.129902 − 0.0417| = 0.0882
//   Band: "minor_compression" → near the upper boundary of "aggregation_distortion"
//   (0.0882 < φ⁻⁵ ≈ 0.0902)
// ════════════════════════════════════════════════════════════════════════════
sec('2. CEN AvG_O1 — canonical pure-O1 → 0.0882 ("Aggregation distortion border")');

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
const cenO1Grid = kpiGridFromSparse(7, 0.0417 * 60);  // 7 cells summing to 2.502 → K_mean_60 = 0.0417
const cenO1Result = computeAvGRef(cenO1Faces, cenO1Grid);

assert(approx(cenO1Result.muE, 0.138758, 1e-5),
    `μ_E ≈ 0.138758 (got ${cenO1Result.muE.toFixed(6)})`);
assert(approx(cenO1Result.sigmaE, 0.037517, 1e-5),
    `σ_E ≈ 0.037517 (got ${cenO1Result.sigmaE.toFixed(6)})`);
assert(approx(cenO1Result.cvE, 0.270376, 1e-5),
    `CV_E ≈ 0.270376 (got ${cenO1Result.cvE.toFixed(6)})`);
assert(approx(cenO1Result.cGlobal, 0.129902, 1e-4),
    `C_global_raw ≈ 0.129902 (got ${cenO1Result.cGlobal.toFixed(6)})`);
assert(approx(cenO1Result.kMean60, 0.0417, 1e-4),
    `K_mean_60_O1 ≈ 0.0417 (got ${cenO1Result.kMean60.toFixed(6)})`);
assert(approx(cenO1Result.avg, 0.0882, 1e-3),
    `AvG_O1 ≈ 0.0882 ± 0.001 (got ${cenO1Result.avg.toFixed(4)})`);
assert(cenO1Result.band === 'minor_compression',
    `band = "minor_compression" — 0.0882 < φ⁻⁵ ≈ 0.0902 (got "${cenO1Result.band}")`);

// ════════════════════════════════════════════════════════════════════════════
// SECTION 3: CEN AvG_all regression — all-octave scope
// ────────────────────────────────────────────────────────────────────────────
// Same face energies; K_mean_60_all = 0.1483 (60-cell mean with O2/O3 evidence)
// AvG_all = |0.129902 − 0.1483| = 0.0184
// Band: "faithful" (0.0184 < φ⁻⁶ ≈ 0.0557)
// Demonstrates: same face energies, DIFFERENT scope → categorically different
// readings. MUST carry scope label per §16.
// ════════════════════════════════════════════════════════════════════════════
sec('3. CEN AvG_all — all-octave scope → 0.0184 ("Faithful aggregation")');

const cenAllGrid = new Array(60).fill(0.1483);  // all-octave mean
const cenAllResult = computeAvGRef(cenO1Faces, cenAllGrid);

assert(approx(cenAllResult.cGlobal, 0.129902, 1e-4),
    `C_global_raw unchanged ≈ 0.129902 (got ${cenAllResult.cGlobal.toFixed(6)})`);
assert(approx(cenAllResult.kMean60, 0.1483, 1e-4),
    `K_mean_60_all ≈ 0.1483 (got ${cenAllResult.kMean60.toFixed(6)})`);
assert(approx(cenAllResult.avg, 0.0184, 1e-3),
    `AvG_all ≈ 0.0184 ± 0.001 (got ${cenAllResult.avg.toFixed(4)})`);
assert(cenAllResult.band === 'faithful',
    `band = "faithful" — 0.0184 < φ⁻⁶ ≈ 0.0557 (got "${cenAllResult.band}")`);
// Scope distinction proof
assert(cenO1Result.avg > 4 * cenAllResult.avg,
    `AvG_O1 (${cenO1Result.avg.toFixed(4)}) > 4× AvG_all (${cenAllResult.avg.toFixed(4)}) — DIFFERENT questions, scope label mandatory`);

// ════════════════════════════════════════════════════════════════════════════
// SECTION 4: Pre-amplifier choice — verify raw NOT post-κ
// ────────────────────────────────────────────────────────────────────────────
// Per audit trail §16 "Pre-Amplifier vs Post-Amplifier Choice": C_global as
// used in AvG is the PRE-amplifier raw value (μ_E × (1 − λ·CV_E)), NOT the
// post-κ logistic-amplified value. Rationale: apples-to-apples with K_mean_60
// which has no amplifier; amplifier obscures the aggregation question.
//
// Test: construct face energies where the post-κ value would differ
// substantially from the pre-amplifier raw, verify we get the raw value.
// μ_E=0.5, all-equal → cGlobal_raw = 0.5; cGlobal_post_kappa would be ≈ 0.99
// (κ=4 logistic amplifier saturates near boundary).
// ════════════════════════════════════════════════════════════════════════════
sec('4. Pre-amplifier raw — NOT post-κ amplified');

const uniformHigh = computeAvGRef(facesFromVector(new Array(12).fill(0.5)), new Array(60).fill(0));
assert(approx(uniformHigh.cGlobal, 0.5, 1e-6),
    `C_global = 0.5 (raw, pre-amplifier); NOT post-κ saturated value ≈ 0.99 (got ${uniformHigh.cGlobal.toFixed(6)})`);
assert(uniformHigh.cGlobal < 0.99,
    `C_global < 0.99 confirms raw not post-κ (got ${uniformHigh.cGlobal.toFixed(6)})`);

// ════════════════════════════════════════════════════════════════════════════
// SECTION 5: φ-derived band classification at boundaries
// ────────────────────────────────────────────────────────────────────────────
// Bands per audit trail §16:
//   avg < 0.0557 (φ⁻⁶)        → "faithful"
//   0.0557 ≤ avg < 0.0902 (φ⁻⁵) → "minor_compression"
//   0.0902 ≤ avg < 0.1459 (φ⁻⁴) → "aggregation_distortion"
//   avg ≥ 0.1459              → "severe_distortion"
// ════════════════════════════════════════════════════════════════════════════
sec('5. φ-derived band classification at boundary values');

assert(classifyBandRef(0.0500) === 'faithful',
    `avg=0.0500 < φ⁻⁶ → "faithful" (got "${classifyBandRef(0.0500)}")`);
assert(classifyBandRef(0.0700) === 'minor_compression',
    `avg=0.0700 in [φ⁻⁶, φ⁻⁵) → "minor_compression" (got "${classifyBandRef(0.0700)}")`);
assert(classifyBandRef(0.1100) === 'aggregation_distortion',
    `avg=0.1100 in [φ⁻⁵, φ⁻⁴) → "aggregation_distortion" (got "${classifyBandRef(0.1100)}")`);
assert(classifyBandRef(0.2000) === 'severe_distortion',
    `avg=0.2000 ≥ φ⁻⁴ → "severe_distortion" (got "${classifyBandRef(0.2000)}")`);

// ════════════════════════════════════════════════════════════════════════════
// SECTION 6: Edge cases
// ════════════════════════════════════════════════════════════════════════════
sec('6. Edge cases — empty inputs, all-zero, all-equal');

// Empty face energies → avg = null
const emptyFacesResult = computeAvGRef([], new Array(60).fill(0.5));
assert(emptyFacesResult.avg === null,
    `Empty face energies → avg = null (got ${emptyFacesResult.avg})`);

// Empty KPI grid → kMean60 = 0 (matches "all cells silent")
const emptyKpiResult = computeAvGRef(facesFromVector(new Array(12).fill(0.3)), []);
assert(approx(emptyKpiResult.kMean60, 0),
    `Empty KPI grid → kMean60 = 0 (got ${emptyKpiResult.kMean60.toFixed(6)})`);
assert(approx(emptyKpiResult.avg, emptyKpiResult.cGlobal),
    `Empty KPI → AvG = |cGlobal − 0| = cGlobal (got ${emptyKpiResult.avg.toFixed(6)})`);

// All-zero face energies → cGlobal = 0; AvG reduces to kMean60 magnitude
const zeroFacesResult = computeAvGRef(facesFromVector(new Array(12).fill(0)), new Array(60).fill(0.2));
assert(approx(zeroFacesResult.cGlobal, 0),
    `All-zero faces → cGlobal = 0 (got ${zeroFacesResult.cGlobal.toFixed(6)})`);
assert(approx(zeroFacesResult.avg, 0.2),
    `All-zero faces + kMean60=0.2 → AvG = 0.2 (got ${zeroFacesResult.avg.toFixed(6)})`);

// ════════════════════════════════════════════════════════════════════════════
// SECTION 7: Real Diagnostics module integration
// ────────────────────────────────────────────────────────────────────────────
// Load js/core/Diagnostics.js and verify the consolidated implementation
// matches the reference. This binds the test contract to the actual engine
// canonical implementation.
// ════════════════════════════════════════════════════════════════════════════
sec('7. Real Diagnostics module — load + invoke + verify against reference');

const path = require('path');
const Diagnostics = require(path.join(__dirname, '..', 'js', 'core', 'Diagnostics.js'));

assert(typeof Diagnostics.getApparentGranularGap === 'function',
    `Diagnostics.getApparentGranularGap exported`);
assert(approx(Diagnostics.PHI, PHI_REF),
    `Diagnostics.PHI matches reference (got ${Diagnostics.PHI.toFixed(10)})`);
assert(approx(Diagnostics.LAMBDA, LAMBDA_REF),
    `Diagnostics.LAMBDA = φ⁻³ matches reference (got ${Diagnostics.LAMBDA.toFixed(10)})`);

// Run CEN AvG_O1 through the real module
const realCenO1 = Diagnostics.getApparentGranularGap(cenO1Faces, cenO1Grid, { scope: 'O1' });
assert(approx(realCenO1.avg, cenO1Result.avg, 1e-6),
    `Real module AvG_O1 matches reference (real=${realCenO1.avg.toFixed(6)}, ref=${cenO1Result.avg.toFixed(6)})`);
assert(realCenO1.scope === 'O1',
    `Scope label propagated: "O1" (got "${realCenO1.scope}")`);
assert(realCenO1.band === 'minor_compression',
    `Real module band = "minor_compression" (got "${realCenO1.band}")`);
assert(realCenO1.nFaces === 12,
    `nFaces = 12 (got ${realCenO1.nFaces})`);
assert(realCenO1.nKpiCells === 60,
    `nKpiCells = 60 (got ${realCenO1.nKpiCells})`);

// Run CEN AvG_all through the real module
const realCenAll = Diagnostics.getApparentGranularGap(cenO1Faces, cenAllGrid, { scope: 'all' });
assert(approx(realCenAll.avg, cenAllResult.avg, 1e-6),
    `Real module AvG_all matches reference (real=${realCenAll.avg.toFixed(6)}, ref=${cenAllResult.avg.toFixed(6)})`);
assert(realCenAll.scope === 'all',
    `Scope label propagated: "all" (got "${realCenAll.scope}")`);
assert(realCenAll.band === 'faithful',
    `Real module band = "faithful" (got "${realCenAll.band}")`);

// ════════════════════════════════════════════════════════════════════════════
// SUMMARY
// ════════════════════════════════════════════════════════════════════════════
console.log('\n' + '═'.repeat(64));
console.log(`  RESULT: ${passed} passed, ${failed} failed`);
console.log('═'.repeat(64));
process.exit(failed === 0 ? 0 : 1);
