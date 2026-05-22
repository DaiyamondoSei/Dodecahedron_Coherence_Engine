/**
 * ════════════════════════════════════════════════════════════════════════════
 * VERTEX ANALYZER (ADVANCED) — TEST SUITE
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Validates the advanced vertex measurements in js/advanced/vertex-analyzer.js
 * against the contract documented in:
 *   - CALCULATION_AUDIT_TRAIL.md §15 Advanced Vertex Extensions (staged 2026-05-21)
 *
 * Four advanced measurements tested:
 *   15.1 Vortex direction  = clamp([-1, +1], (mean(E_3) - 0.5) × 2)
 *   15.2 Vertex coherence  = clamp([0, 1], 1 - avgPairwiseDiff / 0.667)
 *   15.3 Chirality (current code; TODO: rename to SequenceConcavity per Lock #8.19)
 *        winding = (f2-f1)(f3-f2) - (f3-f1)(f2-f1)/2
 *        Sympy factored form: (f1-f2)(2f2-f1-f3) / 2
 *   15.4 Leverage point  = (strength > φ⁻¹) ∧ (coherence < φ⁻²)
 *
 * Module under test: js/advanced/vertex-analyzer.js (ES module, `export class`)
 *
 * Test categories:
 *   1. Vortex direction symmetry (±0.6 around μ=0.5)
 *   2. Vertex coherence (identical → 1.0; max spread → 0.0)
 *   3. Concavity (current chirality) sign behavior — empirical truth
 *   4. Leverage point detection — formula behavior
 *   5. CEN V13 regression — vortex strength = 0.0455 under canonical O1
 *
 * Run: node tests/vertex-analyzer.test.mjs
 *
 * @author Deimantas Murauskas & Claude (W1 §6.7 math hardening, 2026-05-21)
 * ════════════════════════════════════════════════════════════════════════════
 */

// Logger shim (vertex-analyzer calls Logger.warn at runtime)
globalThis.Logger = {
    info: () => {},
    debug: () => {},
    warn: () => {},
    error: () => {}
};

// Import the ES module under test
const { VertexAnalyzer } = await import('../js/advanced/vertex-analyzer.js');

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

// Helper: build 3-face array for vertex analyzer
function faces3(e1, e2, e3) {
    return [
        { id: 1, faceEnergy: e1 },
        { id: 2, faceEnergy: e2 },
        { id: 3, faceEnergy: e3 }
    ];
}

const analyzer = new VertexAnalyzer();
const PHI = (1 + Math.sqrt(5)) / 2;
const PHI_1 = 1 / PHI;          // 0.618
const PHI_2 = 1 / (PHI * PHI);  // 0.382

// ════════════════════════════════════════════════════════════════════════════
// SECTION 1: Vortex direction symmetry around μ=0.5
// ────────────────────────────────────────────────────────────────────────────
// direction = (μ - 0.5) × 2, clamped to [-1, +1]
// [0.8, 0.8, 0.8] → μ=0.8 → direction = +0.6
// [0.2, 0.2, 0.2] → μ=0.2 → direction = -0.6
// [0.5, 0.5, 0.5] → μ=0.5 → direction =  0.0
// ════════════════════════════════════════════════════════════════════════════
sec('1. Vortex direction — linear from midpoint, sign symmetric');

const dir_high = analyzer.calculateVortexDirection(faces3(0.8, 0.8, 0.8));
assert(approx(dir_high, +0.6, 1e-9),
    `direction([0.8, 0.8, 0.8]) = +0.6 (got ${dir_high.toFixed(6)})`);

const dir_low = analyzer.calculateVortexDirection(faces3(0.2, 0.2, 0.2));
assert(approx(dir_low, -0.6, 1e-9),
    `direction([0.2, 0.2, 0.2]) = -0.6 (got ${dir_low.toFixed(6)})`);

const dir_mid = analyzer.calculateVortexDirection(faces3(0.5, 0.5, 0.5));
assert(approx(dir_mid, 0.0, 1e-9),
    `direction([0.5, 0.5, 0.5]) = 0.0 (got ${dir_mid.toFixed(6)})`);

// Sign symmetry: direction(x, x, x) + direction(1-x, 1-x, 1-x) = 0
const dir_x = analyzer.calculateVortexDirection(faces3(0.7, 0.7, 0.7));
const dir_1x = analyzer.calculateVortexDirection(faces3(0.3, 0.3, 0.3));
assert(approx(dir_x + dir_1x, 0, 1e-9),
    `direction(x, x, x) + direction(1-x, 1-x, 1-x) = 0 (got ${(dir_x + dir_1x).toExponential(2)})`);

// ════════════════════════════════════════════════════════════════════════════
// SECTION 2: Vertex coherence — identical → 1.0; max spread → 0.0
// ────────────────────────────────────────────────────────────────────────────
// coherence = 1 - avg_pairwise_diff / 0.667
//   Identical faces → all pairwise diffs = 0 → coherence = 1.0
//   [0, 0.5, 1] → diffs = [0.5, 0.5, 1.0] → avg = 2/3 ≈ 0.667 → coherence ≈ 0
// ════════════════════════════════════════════════════════════════════════════
sec('2. Vertex coherence — identical = 1.0, max spread ≈ 0');

const coh_identical = analyzer.calculateCoherence(faces3(0.5, 0.5, 0.5));
assert(approx(coh_identical, 1.0, 1e-9),
    `coherence([0.5, 0.5, 0.5]) = 1.0 (got ${coh_identical.toFixed(6)})`);

const coh_spread = analyzer.calculateCoherence(faces3(0, 0.5, 1.0));
// avg_diff = (0.5 + 0.5 + 1.0)/3 = 0.6667; 0.6667 / 0.667 ≈ 0.9995; coh ≈ 5e-4
// The "0.667" normalizer is a rounded 2/3 (per audit Honest Disclosure §15 #3) —
// so coherence for [0, 0.5, 1] sits just slightly above 0 (not exactly 0).
assert(coh_spread < 5e-3,
    `coherence([0, 0.5, 1.0]) ≈ 0 within float-precision of 0.667 normalizer (got ${coh_spread.toFixed(6)})`);

// Identical (but non-0.5) → still 1.0
const coh_identical_nonmid = analyzer.calculateCoherence(faces3(0.3, 0.3, 0.3));
assert(approx(coh_identical_nonmid, 1.0, 1e-9),
    `coherence([0.3, 0.3, 0.3]) = 1.0 (identical, coherence is shape-invariant; got ${coh_identical_nonmid.toFixed(6)})`);

// ════════════════════════════════════════════════════════════════════════════
// SECTION 3: Concavity (currently named chirality) — empirical sign behavior
// ────────────────────────────────────────────────────────────────────────────
// TODO: when chirality → SequenceConcavity rename lands (Lock #8.19), update
// method-name reference here.
//
// Formula: winding = (f2-f1)(f3-f2) - (f3-f1)(f2-f1)/2
// Sympy factored form: (f1-f2)(2f2-f1-f3)/2  (per audit trail §15)
//
// Empirical truth (verified 2026-05-21 via direct numerical evaluation):
//   Ascending arithmetic [0.1, 0.5, 0.9]  → winding = 0    → 'neutral'
//   Descending arithmetic [0.9, 0.5, 0.1] → winding = 0    → 'neutral'  (NOT chirality!)
//   Peak at f2 [0.5, 1.0, 0.5]            → winding < 0    → 'clockwise'
//   Trough at f2 [0.5, 0.0, 0.5]          → winding < 0    → 'clockwise'  (SAME sign as peak!)
//
// The audit trail §15 table at lines 139-140 lists peak = -0.16 and trough =
// +0.16, but direct numerical evaluation shows BOTH give -0.16. The formula
// only distinguishes "non-arithmetic configuration" from "arithmetic" — it
// does NOT distinguish peak from trough by sign. This is the load-bearing
// finding from §15: the formula is "meaningful but mislabeled" — it detects
// concavity-vs-arithmetic, not signed concavity direction.
// ════════════════════════════════════════════════════════════════════════════
sec('3. Concavity (chirality) — neutral on arithmetic, non-neutral on peak/trough');

// Ascending arithmetic → neutral
const chir_asc = analyzer.calculateSequenceConcavity(faces3(0.1, 0.5, 0.9));
assert(chir_asc.sequenceConcavity === 'neutral',
    `chirality([0.1, 0.5, 0.9]) = 'neutral' (ascending arithmetic, winding=0) — got '${chir_asc.sequenceConcavity}'`);

// Descending arithmetic → ALSO neutral (proves formula is NOT chirality)
const chir_desc = analyzer.calculateSequenceConcavity(faces3(0.9, 0.5, 0.1));
assert(chir_desc.sequenceConcavity === 'neutral',
    `chirality([0.9, 0.5, 0.1]) = 'neutral' (descending arithmetic, winding=0) — formula is NOT rotational chirality, IS concavity at f2 — got '${chir_desc.sequenceConcavity}'`);

// Peak at f2 → non-neutral (formula registers concavity break)
const chir_peak = analyzer.calculateSequenceConcavity(faces3(0.5, 1.0, 0.5));
assert(chir_peak.sequenceConcavity !== 'neutral',
    `chirality([0.5, 1.0, 0.5]) ≠ 'neutral' (peak at f2 → concavity detected) — got '${chir_peak.sequenceConcavity}'`);

// Trough at f2 → also non-neutral, AND empirically SAME sign as peak
// (audit table 139-140 is incorrect; both give clockwise/-0.16-magnitude)
const chir_trough = analyzer.calculateSequenceConcavity(faces3(0.5, 0.0, 0.5));
assert(chir_trough.sequenceConcavity !== 'neutral',
    `chirality([0.5, 0.0, 0.5]) ≠ 'neutral' (trough at f2 → concavity detected) — got '${chir_trough.sequenceConcavity}'`);

// Both peak AND trough give same chirality sign — confirms formula is
// concavity-detector, not signed-handedness
assert(chir_peak.sequenceConcavity === chir_trough.sequenceConcavity,
    `chirality(peak) === chirality(trough) = '${chir_peak.sequenceConcavity}' — confirms formula does NOT distinguish peak from trough by sign`);

// Identical faces → neutral
const chir_flat = analyzer.calculateSequenceConcavity(faces3(0.5, 0.5, 0.5));
assert(chir_flat.sequenceConcavity === 'neutral',
    `chirality([0.5, 0.5, 0.5]) = 'neutral' (flat — no concavity) — got '${chir_flat.sequenceConcavity}'`);

// ════════════════════════════════════════════════════════════════════════════
// SECTION 4: Leverage point — formula behavior
// ────────────────────────────────────────────────────────────────────────────
// Formula: isLeveragePoint = (strength > φ⁻¹ ≈ 0.618) ∧ (coherence < φ⁻² ≈ 0.382)
//
// Spec brief mentions V8 with [F4=0.45, F5=0.20, F10=0.95]. Computing through
// the formula:
//   μ = 0.5333, σ = 0.3118, normVar = 0.5403
//   strength = 0.618 × 0.5403 + 0.382 × 0.5333 = 0.5376
//   coherence = 1 - 1.5/3/0.667 = 0.2504
//   Leverage check: strength 0.5376 > 0.618? NO  → V8 is NOT a leverage point by formula
//
// The V8 'bermuda_triangle' label in mapping-context.json:186 is narrative
// scaffolding (vortexStrength=0.28 there is also hand-authored, per the same
// pattern as Section 13's dominantMode=10 finding). The label and the formula
// classification do NOT agree on this input.
//
// We test what the FORMULA does, and document the mapping-context divergence.
// ════════════════════════════════════════════════════════════════════════════
sec('4. Leverage point — formula behavior + V8 input check');

// Pure formula check: high strength + low coherence → leverage
const lev_clear = analyzer.isLeveragePoint(0.7, 0.3);
assert(lev_clear === true,
    `isLeveragePoint(strength=0.7, coh=0.3) = true (both thresholds met)`);

// Just-below strength → NOT leverage
const lev_below_s = analyzer.isLeveragePoint(0.6, 0.3);
assert(lev_below_s === false,
    `isLeveragePoint(strength=0.6, coh=0.3) = false (strength < φ⁻¹ = 0.618)`);

// Just-above coherence → NOT leverage
const lev_above_c = analyzer.isLeveragePoint(0.7, 0.4);
assert(lev_above_c === false,
    `isLeveragePoint(strength=0.7, coh=0.4) = false (coh ≥ φ⁻² = 0.382)`);

// V8 with [F4=0.45, F5=0.20, F10=0.95] — verify the formula output for these inputs
const v8_faces = faces3(0.45, 0.20, 0.95);
const v8_strength = analyzer.calculateVortexStrength(v8_faces);
const v8_coherence = analyzer.calculateCoherence(v8_faces);
const v8_isLev = analyzer.isLeveragePoint(v8_strength, v8_coherence);

assert(approx(v8_strength, 0.5376, 5e-3),
    `V8 [0.45, 0.20, 0.95] strength ≈ 0.538 (got ${v8_strength.toFixed(4)})`);
assert(approx(v8_coherence, 0.2504, 5e-3),
    `V8 [0.45, 0.20, 0.95] coherence ≈ 0.250 (got ${v8_coherence.toFixed(4)})`);
assert(v8_isLev === false,
    `V8 with [0.45, 0.20, 0.95] does NOT meet leverage threshold by formula (strength 0.538 < φ⁻¹ 0.618). The 'bermuda_triangle' label in mapping-context.json:186 is narrative scaffolding — same pattern as §13 dominantMode=10 finding.`);

// Inputs that DO trigger leverage: max-spread giving high strength + ≈0 coherence
// [1.0, 0.0, 0.5] gives: μ=0.5, σ=0.408, normVar=0.707
//   strength = 0.618×0.707 + 0.382×0.5 = 0.437 + 0.191 = 0.628 > φ⁻¹
//   diffs = [1.0, 0.5, 0.5] → avg = 2/3 → coh ≈ 0
const lev_faces = faces3(1.0, 0.0, 0.5);
const lev_s = analyzer.calculateVortexStrength(lev_faces);
const lev_c = analyzer.calculateCoherence(lev_faces);
const lev_real = analyzer.isLeveragePoint(lev_s, lev_c);
assert(lev_real === true,
    `[1.0, 0.0, 0.5] triggers leverage point (strength=${lev_s.toFixed(3)} > 0.618, coh=${lev_c.toFixed(3)} < 0.382)`);

// ════════════════════════════════════════════════════════════════════════════
// SECTION 5: CEN V13 regression under canonical O1 face energies
// ────────────────────────────────────────────────────────────────────────────
// V13 = (F4, F9, F10) — Structure-Regeneration-Values triad. Per audit §15:
//   At canonical O1: F4 = F9 = F10 = 0.1192 (all at logistic floor)
//   strength    = φ⁻¹ × 0 + φ⁻² × 0.1192 = 0.04553
//   coherence   = 1.000 (all equal)
//   direction   = (0.1192 - 0.5) × 2 = -0.7616
//   chirality   = neutral (all equal → winding = 0)
//   leverage    = false (strength 0.0455 < φ⁻¹ 0.618)
// ════════════════════════════════════════════════════════════════════════════
sec('5. CEN V13 regression — canonical O1 (all faces at logistic floor 0.1192)');

const v13_faces = faces3(0.1192, 0.1192, 0.1192);
const v13_strength = analyzer.calculateVortexStrength(v13_faces);
const v13_direction = analyzer.calculateVortexDirection(v13_faces);
const v13_coherence = analyzer.calculateCoherence(v13_faces);
const v13_chir = analyzer.calculateSequenceConcavity(v13_faces);
const v13_lev = analyzer.isLeveragePoint(v13_strength, v13_coherence);

assert(approx(v13_strength, 0.04553, 1e-4),
    `V13 vortex strength ≈ 0.0455 (got ${v13_strength.toFixed(5)})`);

assert(approx(v13_direction, -0.7616, 1e-4),
    `V13 direction ≈ -0.7616 (downward — all faces below 0.5; got ${v13_direction.toFixed(5)})`);

assert(approx(v13_coherence, 1.0, 1e-9),
    `V13 coherence = 1.000 (all-equal artifact; got ${v13_coherence.toFixed(6)})`);

assert(v13_chir.sequenceConcavity === 'neutral',
    `V13 chirality = 'neutral' (all-equal → winding=0; got '${v13_chir.sequenceConcavity}')`);

assert(v13_lev === false,
    `V13 is NOT a leverage point (strength 0.0455 << φ⁻¹ 0.618 — "dormant vertex" per audit §15)`);

// ════════════════════════════════════════════════════════════════════════════
// SECTION 6: V13 paradox fix — "Coherent-at-floor" health label
// ────────────────────────────────────────────────────────────────────────────
// Health label logic (vertex-analyzer.js:291-322) now factors in strength
// alongside coherence. Per audit §15 Honest Disclosure #6 + W1 spiral 2026-05-22:
//
// Before fix: getHealthStatus(coherence) → "Harmonious" when coherence ≥ ψ₄ alone.
//   For CEN V13 (F4=F9=F10=0.1192 at logistic floor): coherence=1.0, strength=0.0455.
//   → returns "Harmonious" → misfires. This is "coherence-of-shared-absence".
//
// After fix: getHealthStatus(coherence, strength) — if strength < φ⁻⁴ (0.146)
//   AND coherence ≥ ψ₄, label becomes "Coherent-at-floor" instead of "Harmonious".
//   Above the Wall floor, ladder is unchanged (Harmonious / Balanced / Unstable
//   / Chaotic / Critical based on coherence alone).
//
// Backwards-compat: single-arg call getHealthStatus(coherence) — strength is
// undefined, guard skips, ladder behaves as before. Legacy consumers unaffected.
// ════════════════════════════════════════════════════════════════════════════
sec('6. V13 paradox fix — Coherent-at-floor disambiguates shared-absence');

// V13 at canonical O1 (F4=F9=F10=0.1192): coherence=1.0 + strength≈0.0455
// → must NOT label "Harmonious"; must label "Coherent-at-floor"
const v13_health = analyzer.getHealthStatus(v13_coherence, v13_strength);
assert(v13_health === 'Coherent-at-floor',
    `V13 (coh=1.0, strength=${v13_strength.toFixed(4)}) labelled 'Coherent-at-floor', NOT 'Harmonious' (coherence-of-shared-absence — got '${v13_health}')`);

assert(v13_health !== 'Harmonious',
    `V13 health label is NOT 'Harmonious' (audit §15 paradox fix — high coherence + floor strength is shared-absence, not harmony)`);

// Counter-case: when strength is genuinely high AND coherence is high,
// the label remains "Harmonious" (the fix targets ONLY the floor case)
// Inputs chosen so strength clears φ⁻⁴ (0.146) by safe margin while keeping
// coherence near 1.0. Three identical faces at 0.8: μ=0.8, σ=0,
// strength = φ⁻² × 0.8 = 0.3056 > 0.146; coherence = 1.0.
const real_harmony_faces = faces3(0.8, 0.8, 0.8);
const real_strength = analyzer.calculateVortexStrength(real_harmony_faces);
const real_coherence = analyzer.calculateCoherence(real_harmony_faces);
const real_health = analyzer.getHealthStatus(real_coherence, real_strength);
assert(real_health === 'Harmonious',
    `[0.8, 0.8, 0.8] (coh=1.0, strength=${real_strength.toFixed(4)} > φ⁻⁴) IS 'Harmonious' (high coherence above Wall floor — got '${real_health}')`);

// Backwards-compat: legacy single-arg call should behave as before
// (returns 'Harmonious' at high coherence with no strength info)
const legacy_health = analyzer.getHealthStatus(1.0);
assert(legacy_health === 'Harmonious',
    `Legacy 1-arg call getHealthStatus(1.0) returns 'Harmonious' (strength undefined, guard skips — got '${legacy_health}')`);

// ════════════════════════════════════════════════════════════════════════════
// SUMMARY
// ════════════════════════════════════════════════════════════════════════════
console.log(`\n${'═'.repeat(64)}`);
console.log(`  RESULTS:  ${passed} passed, ${failed} failed`);
console.log('═'.repeat(64));
if (failed > 0) {
    process.exit(1);
}
console.log('\n✨ All vertex analyzer tests pass.\n');
process.exit(0);
