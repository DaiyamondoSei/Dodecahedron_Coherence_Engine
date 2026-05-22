/**
 * ════════════════════════════════════════════════════════════════════════════
 * EDGE ANALYZER (ADVANCED FORMULA) — TEST SUITE
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Validates the advanced edge formula in js/advanced/edge-analyzer.js against
 * the contract documented in:
 *   - CALCULATION_AUDIT_TRAIL.md §14 Advanced Edge Formula (staged 2026-05-21)
 *
 * Formula (per audit trail §14):
 *   T_norm        = |E_A − E_B| / (E_A + E_B + ε)
 *   T_edgeHealth  = 1 − edgeKPI.normalizedScore  (or 0.5 default when no KPI)
 *   T_base        = 0.6 × T_norm + 0.4 × T_edgeHealth
 *   T_final       = clamp([0, 1], T_base × elementMultiplier)
 *   elementMultiplier ∈ {Fire 1.3, Air 1.1, Ether 1.0, Water 0.9, Earth 0.8}
 *
 *   BR_log = log(E_B / E_A) / log(φ)   clamped to [−2, +2]
 *
 * Module under test: js/advanced/edge-analyzer.js (ES module, `export class`)
 *
 * Test categories:
 *   1. Identity: T(0.5, 0.5, 'Ether', null) → 0.2
 *   2. Max imbalance: T(1.0, 0.0, 'Ether', null) → 0.8
 *   3. Element scaling: clamped Fire/Earth ratio ≈ 1.5625
 *   4. BR antisymmetry: BR(A,B) = -BR(B,A)
 *   5. BR golden anchor: BR(φx, x) = +1
 *   6. CEN regression: spot-check 3 edges
 *
 * Run: node tests/edge-analyzer.test.mjs
 *
 * @author Deimantas Murauskas & Claude (W1 §6.7 math hardening, 2026-05-21)
 * ════════════════════════════════════════════════════════════════════════════
 */

// Logger shim (edge-analyzer calls Logger.warn at load time)
globalThis.Logger = {
    info: () => {},
    debug: () => {},
    warn: () => {},
    error: () => {}
};

// Import the ES module under test
const { EdgeAnalyzer } = await import('../js/advanced/edge-analyzer.js');

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

// Helper: build a face object the analyzer expects
function face(energy) {
    return { faceEnergy: energy };
}

const PHI = (1 + Math.sqrt(5)) / 2;

const analyzer = new EdgeAnalyzer();

// ════════════════════════════════════════════════════════════════════════════
// SECTION 1: Identity — T(0.5, 0.5, 'Ether', null) → 0.2
// ────────────────────────────────────────────────────────────────────────────
// T_norm = 0 / 1 = 0
// T_edgeHealth = 1 − 0.5 = 0.5  (defaulted; no KPI)
// T_base = 0.6 × 0 + 0.4 × 0.5 = 0.2
// T_final = clamp([0,1], 0.2 × 1.0) = 0.2
// ════════════════════════════════════════════════════════════════════════════
sec('1. Identity — T(0.5, 0.5, "Ether", null) = 0.2');

const t_identity = analyzer.calculateTension(face(0.5), face(0.5), 'Ether', null);
assert(approx(t_identity, 0.2, 1e-9),
    `T_identity = 0.2 (got ${t_identity.toFixed(8)})`);

// Also identity with different element should still equal 0.2 × multiplier (no imbalance)
const t_identity_fire = analyzer.calculateTension(face(0.5), face(0.5), 'Fire', null);
assert(approx(t_identity_fire, 0.2 * 1.3, 1e-9),
    `T(0.5, 0.5, "Fire", null) = 0.2 × 1.3 = ${(0.2 * 1.3).toFixed(4)} (got ${t_identity_fire.toFixed(8)})`);

// ════════════════════════════════════════════════════════════════════════════
// SECTION 2: Max imbalance — T(1.0, 0.0, 'Ether', null) → 0.8
// ────────────────────────────────────────────────────────────────────────────
// T_norm ≈ 1.0 (within ε of 1)
// T_edgeHealth = 0.5
// T_base = 0.6 × 1 + 0.4 × 0.5 = 0.8
// T_final = clamp([0,1], 0.8 × 1.0) = 0.8
// ════════════════════════════════════════════════════════════════════════════
sec('2. Max imbalance — T(1.0, 0.0, "Ether", null) = 0.8');

const t_max = analyzer.calculateTension(face(1.0), face(0.0), 'Ether', null);
assert(approx(t_max, 0.8, 1e-9),
    `T_max(1.0, 0.0, "Ether") = 0.8 (got ${t_max.toFixed(8)})`);

// Symmetric in faces (|E_A − E_B| is order-invariant)
const t_max_swap = analyzer.calculateTension(face(0.0), face(1.0), 'Ether', null);
assert(approx(t_max, t_max_swap, 1e-9),
    `T(1.0, 0.0, ...) = T(0.0, 1.0, ...) — order-invariant (got ${t_max_swap.toFixed(8)})`);

// ════════════════════════════════════════════════════════════════════════════
// SECTION 3: Element scaling — Fire vs Earth at saturation (clamp aware)
// ────────────────────────────────────────────────────────────────────────────
// Per audit trail §14 Test #3 note:
//   T(1.0, 0.0, 'Fire',  null) → pre-clamp 0.8 × 1.3 = 1.04 → CLAMPED to 1.0
//   T(1.0, 0.0, 'Earth', null) → 0.8 × 0.8 = 0.64 (no clamp)
//   Ratio (clamped) = 1.0 / 0.64 = 1.5625  (NOT pre-clamp 1.625)
// Test asserts CLAMPED ratio per audit trail's clamp-aware finding.
// ════════════════════════════════════════════════════════════════════════════
sec('3. Element scaling — Fire (clamped) / Earth ratio = 1.5625');

const t_fire_sat = analyzer.calculateTension(face(1.0), face(0.0), 'Fire', null);
const t_earth_sat = analyzer.calculateTension(face(1.0), face(0.0), 'Earth', null);

assert(approx(t_fire_sat, 1.0, 1e-9),
    `T(1.0, 0.0, "Fire") clamps to 1.0 (pre-clamp 0.8×1.3 = 1.04; got ${t_fire_sat.toFixed(6)})`);

assert(approx(t_earth_sat, 0.64, 1e-9),
    `T(1.0, 0.0, "Earth") = 0.64 (0.8×0.8; got ${t_earth_sat.toFixed(6)})`);

const ratio_sat = t_fire_sat / t_earth_sat;
assert(approx(ratio_sat, 1.5625, 1e-6),
    `Clamped Fire/Earth ratio = 1.5625 (got ${ratio_sat.toFixed(6)})`);

// Sanity check: non-saturating ratio reveals the raw 1.625 multiplier ratio
// At T(0.4, 0.0, ...):
//   T_norm = 0.4/0.4 = 1.0  (still saturated for relative diff)
// So use T(0.4, 0.1, ...) where T_norm < 1 and no clamping occurs:
//   T_norm = 0.3/0.5 = 0.6
//   T_base = 0.6 × 0.6 + 0.4 × 0.5 = 0.36 + 0.2 = 0.56
//   Fire:  0.56 × 1.3 = 0.728 (no clamp)
//   Earth: 0.56 × 0.8 = 0.448
//   Ratio: 0.728 / 0.448 = 1.625 (raw multiplier ratio)
const t_fire_unsat = analyzer.calculateTension(face(0.4), face(0.1), 'Fire', null);
const t_earth_unsat = analyzer.calculateTension(face(0.4), face(0.1), 'Earth', null);
const ratio_unsat = t_fire_unsat / t_earth_unsat;
assert(approx(ratio_unsat, 1.625, 1e-6),
    `Non-saturating Fire/Earth ratio = 1.625 (raw multiplier ratio, got ${ratio_unsat.toFixed(6)})`);

// ════════════════════════════════════════════════════════════════════════════
// SECTION 4: BR antisymmetry — BR(A,B) = -BR(B,A)
// ────────────────────────────────────────────────────────────────────────────
// log_φ(E_B/E_A) = -log_φ(E_A/E_B)
// Test: face1 = 0.6, face2 = 0.3 → BR = log_φ(0.5)
//       face1 = 0.3, face2 = 0.6 → BR = log_φ(2.0)
//       Sum should be 0 to float epsilon.
// ════════════════════════════════════════════════════════════════════════════
sec('4. BR antisymmetry — BR(A,B) + BR(B,A) = 0');

const br_ab = analyzer.calculateBreathRatio(face(0.6), face(0.3));
const br_ba = analyzer.calculateBreathRatio(face(0.3), face(0.6));

assert(approx(br_ab + br_ba, 0, 1e-9),
    `BR(0.6, 0.3) + BR(0.3, 0.6) = ${(br_ab + br_ba).toExponential(2)} ≈ 0`);

// Specific values: BR(0.6, 0.3) = log_φ(0.5) = log(0.5)/log(φ) ≈ -1.4404
const br_expected = Math.log(0.5 / 0.6) / Math.log(PHI);  // tiny epsilon from safeA/safeB
const br_simple = Math.log(0.5) / Math.log(PHI);
assert(approx(br_ab, br_simple, 1e-3),
    `BR(0.6, 0.3) ≈ log_φ(0.5) = ${br_simple.toFixed(4)} (got ${br_ab.toFixed(4)})`);

// ════════════════════════════════════════════════════════════════════════════
// SECTION 5: BR golden anchor — BR(φx, x) = +1 exactly
// ────────────────────────────────────────────────────────────────────────────
// face1.energy = x, face2.energy = φ·x
// BR = log_φ(φx / x) = log_φ(φ) = 1.0 for any x > 0
// ════════════════════════════════════════════════════════════════════════════
sec('5. BR golden anchor — BR(x, φx) = +1.0');

// Try several values of x
const xValues = [0.1, 0.3, 0.5, 0.618];
for (const x of xValues) {
    const br = analyzer.calculateBreathRatio(face(x), face(PHI * x));
    assert(approx(br, 1.0, 1e-3),
        `BR(${x}, φ·${x} = ${(PHI * x).toFixed(4)}) ≈ +1.0 (got ${br.toFixed(6)})`);
}

// Negative golden anchor: BR(φx, x) = -1
const br_neg_anchor = analyzer.calculateBreathRatio(face(0.5 * PHI), face(0.5));
assert(approx(br_neg_anchor, -1.0, 1e-3),
    `BR(φx, x) = -1.0 (got ${br_neg_anchor.toFixed(6)}) — golden contraction`);

// ════════════════════════════════════════════════════════════════════════════
// SECTION 6: CEN regression — spot-check 3 canonical edges at O1 face energies
// ────────────────────────────────────────────────────────────────────────────
// Using canonical O1 face energies and the advanced formula:
//
// E1-10 (F1=0.2563, F10=0.1192, Ether=1.0):
//   T_norm = |0.2563-0.1192|/(0.2563+0.1192+ε) = 0.1371/0.3755 = 0.365113
//   T_base = 0.6 × 0.365113 + 0.4 × 0.5 = 0.419068
//   T_final = 0.419068 × 1.0 = 0.4191
//   Matches §14 worked example exactly.
//
// E1-2 (F1=0.2563, F2=0.1192, Fire=1.3):
//   T_norm = 0.365113 (same as E1-10 — same energies, different element)
//   T_base = 0.419068
//   T_final = 0.419068 × 1.3 = 0.54479
//
// E10-12 (F10=0.1192, F12=0.1523, Fire=1.3):
//   T_norm = |0.1192-0.1523|/(0.1192+0.1523) = 0.0331/0.2715 = 0.121915
//   T_base = 0.6 × 0.121915 + 0.4 × 0.5 = 0.273149
//   T_final = 0.273149 × 1.3 = 0.35509
// ════════════════════════════════════════════════════════════════════════════
sec('6. CEN regression — 3 canonical edges at canonical O1 energies');

// E1-10 (Ether)
const t_e1_10 = analyzer.calculateTension(face(0.2563), face(0.1192), 'Ether', null);
assert(approx(t_e1_10, 0.41907, 1e-4),
    `E1-10 T_final = 0.4191 (F1=0.2563, F10=0.1192, Ether) — got ${t_e1_10.toFixed(5)}`);

// E1-2 (Fire)
const t_e1_2 = analyzer.calculateTension(face(0.2563), face(0.1192), 'Fire', null);
assert(approx(t_e1_2, 0.54479, 1e-4),
    `E1-2 T_final ≈ 0.5448 (F1=0.2563, F2=0.1192, Fire) — got ${t_e1_2.toFixed(5)}`);

// E10-12 (Fire)
const t_e10_12 = analyzer.calculateTension(face(0.1192), face(0.1523), 'Fire', null);
assert(approx(t_e10_12, 0.35509, 1e-4),
    `E10-12 T_final ≈ 0.3551 (F10=0.1192, F12=0.1523, Fire) — got ${t_e10_12.toFixed(5)}`);

// ════════════════════════════════════════════════════════════════════════════
// SUMMARY
// ════════════════════════════════════════════════════════════════════════════
console.log(`\n${'═'.repeat(64)}`);
console.log(`  RESULTS:  ${passed} passed, ${failed} failed`);
console.log('═'.repeat(64));
if (failed > 0) {
    process.exit(1);
}
console.log('\n✨ All edge analyzer tests pass.\n');
process.exit(0);
