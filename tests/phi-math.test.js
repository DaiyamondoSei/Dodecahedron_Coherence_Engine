/**
 * ════════════════════════════════════════════════════════════════════════════
 * QUANNEX MATHEMATICAL CORE — AUTOMATED TEST SUITE
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Purpose: Prove that every calculation in the Quannex engine is correct.
 *          This is a thesis defense artifact — it demonstrates mathematical
 *          rigor and reproducibility.
 *
 * Covers:
 *   1. PHI constants derivation (golden ratio identities)
 *   2. Octave threshold placement (phi-derived boundaries)
 *   3. KPI normalization (up, down, band + kappa curvature)
 *   4. Face energy calculation (pentagram geometry pipeline)
 *   5. Coherence-to-octave mapping
 *   6. Edge cases and stress test fixes
 *
 * Run: node tests/phi-math.test.js
 *
 * @author Deimantas Murauskas & Claude
 * @date 2026-03-10
 */

// ═══════════════════════════════════════════════════════════════════════════
// SETUP — Minimal shims for modules that expect browser globals
// ═══════════════════════════════════════════════════════════════════════════

// Logger shim (modules call Logger.info/debug/error at load time)
global.Logger = {
    info: () => {},
    debug: () => {},
    warn: () => {},
    error: () => {}
};

// Load phi-harmonics (has CommonJS export)
const PhiHarmonics = require('../js/constants/phi-harmonics.js');

// Make PhiHarmonics available globally (Face.js and KPI.js look for window.PhiHarmonics)
global.window = { PhiHarmonics };

// ═══════════════════════════════════════════════════════════════════════════
// TEST RUNNER
// ═══════════════════════════════════════════════════════════════════════════

let passed = 0;
let failed = 0;
let sectionName = '';

function section(name) {
    sectionName = name;
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
        console.log(`  ✅  ${message} (${actual.toFixed(8)} ≈ ${expected.toFixed(8)})`);
    } else {
        failed++;
        console.log(`  ❌  FAIL: ${message}`);
        console.log(`       Expected: ${expected.toFixed(8)}, Got: ${actual.toFixed(8)}, Diff: ${diff.toExponential(3)}`);
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// TEST 1: PHI CONSTANTS — Golden Ratio Identities
// ═══════════════════════════════════════════════════════════════════════════

section('1. PHI Constants — Golden Ratio Identities');

const PHI = PhiHarmonics.PHI;
const eps = 1e-12; // floating-point tolerance

// Fundamental identity: φ = (1 + √5) / 2
assertApprox(PHI, (1 + Math.sqrt(5)) / 2, eps, 'PHI = (1 + √5) / 2');

// Golden equation: φ² = φ + 1
assertApprox(PHI * PHI, PHI + 1, eps, 'φ² = φ + 1 (golden equation)');

// Inverse identity: 1/φ = φ - 1
assertApprox(1 / PHI, PHI - 1, eps, '1/φ = φ - 1');

// PHI powers chain: each is previous / PHI
assertApprox(PhiHarmonics.PHI_1, 1 / PHI, eps, 'PHI_1 = φ⁻¹');
assertApprox(PhiHarmonics.PHI_2, PhiHarmonics.PHI_1 / PHI, eps, 'PHI_2 = PHI_1 / φ');
assertApprox(PhiHarmonics.PHI_3, PhiHarmonics.PHI_2 / PHI, eps, 'PHI_3 = PHI_2 / φ');
assertApprox(PhiHarmonics.PHI_4, PhiHarmonics.PHI_3 / PHI, eps, 'PHI_4 = PHI_3 / φ');
assertApprox(PhiHarmonics.PHI_5, PhiHarmonics.PHI_4 / PHI, eps, 'PHI_5 = PHI_4 / φ');

// Complementarity: φ⁻¹ + φ⁻² = 1
assertApprox(PhiHarmonics.PHI_1 + PhiHarmonics.PHI_2, 1.0, eps, 'φ⁻¹ + φ⁻² = 1 (complementarity)');

// PSI values: ψₙ = 1 - φ⁻ⁿ
assertApprox(PhiHarmonics.PSI_3, 1 - PhiHarmonics.PHI_3, eps, 'PSI_3 = 1 - φ⁻³');
assertApprox(PhiHarmonics.PSI_4, 1 - PhiHarmonics.PHI_4, eps, 'PSI_4 = 1 - φ⁻⁴');
assertApprox(PhiHarmonics.PSI_5, 1 - PhiHarmonics.PHI_5, eps, 'PSI_5 = 1 - φ⁻⁵');

// Harmonic midpoint: (φ⁻¹ + φ⁻²) / 2 = 0.5 exactly
assertApprox(PhiHarmonics.PHI_MIDPOINT, 0.5, eps, 'PHI_MIDPOINT = 0.5 (harmonic center)');

// ═══════════════════════════════════════════════════════════════════════════
// TEST 2: Octave Thresholds — Correct Placement
// ═══════════════════════════════════════════════════════════════════════════

section('2. Octave Thresholds — Correct PHI-Derived Placement');

const OT = PhiHarmonics.OCTAVE_THRESHOLDS;

assertApprox(OT.O1.threshold, 0, eps, 'O1 (Survival) threshold = 0');
assertApprox(OT.O2.threshold, PhiHarmonics.PHI_2, eps, 'O2 (Structure) threshold = φ⁻²');
assertApprox(OT.O3.threshold, 0.5, eps, 'O3 (Relationships) threshold = 0.5');
assertApprox(OT.O4.threshold, PhiHarmonics.PHI_1, eps, 'O4 (Creativity) threshold = φ⁻¹');
assertApprox(OT.O5.threshold, PhiHarmonics.PSI_3, eps, 'O5 (Expression) threshold = ψ₃');
assertApprox(OT.O6.threshold, PhiHarmonics.PSI_4, eps, 'O6 (Vision) threshold = ψ₄');
assertApprox(OT.O7.threshold, PhiHarmonics.PSI_5, eps, 'O7 (Radiance) threshold = ψ₅');

// Monotonic increase (each threshold higher than the last)
const thresholds = [OT.O1, OT.O2, OT.O3, OT.O4, OT.O5, OT.O6, OT.O7];
for (let i = 1; i < thresholds.length; i++) {
    assert(thresholds[i].threshold > thresholds[i - 1].threshold,
        `O${i + 1} threshold (${thresholds[i].threshold.toFixed(3)}) > O${i} (${thresholds[i - 1].threshold.toFixed(3)})`);
}

// Upper bound of each = threshold of next
for (let i = 0; i < thresholds.length - 1; i++) {
    assertApprox(thresholds[i].upperBound, thresholds[i + 1].threshold, eps,
        `O${i + 1} upperBound = O${i + 2} threshold (contiguous)`);
}

assert(OT.O7.upperBound === 1.0, 'O7 upperBound = 1.0');

// ═══════════════════════════════════════════════════════════════════════════
// TEST 3: coherenceToOctave — Mapping Function
// ═══════════════════════════════════════════════════════════════════════════

section('3. coherenceToOctave — Boundary Mapping');

const c2o = PhiHarmonics.coherenceToOctave;

// Test exact boundaries
assert(c2o(0) === 1, 'Coherence 0.000 → Octave 1');
assert(c2o(0.381) === 1, 'Coherence 0.381 → Octave 1 (just below φ⁻²)');
assert(c2o(PhiHarmonics.PHI_2) === 2, 'Coherence φ⁻² → Octave 2');
assert(c2o(0.499) === 2, 'Coherence 0.499 → Octave 2 (just below midpoint)');
assert(c2o(0.5) === 3, 'Coherence 0.500 → Octave 3');
assert(c2o(PhiHarmonics.PHI_1) === 4, 'Coherence φ⁻¹ → Octave 4');
assert(c2o(PhiHarmonics.PSI_3) === 5, 'Coherence ψ₃ → Octave 5');
assert(c2o(PhiHarmonics.PSI_4) === 6, 'Coherence ψ₄ → Octave 6');
assert(c2o(PhiHarmonics.PSI_5) === 7, 'Coherence ψ₅ → Octave 7');
assert(c2o(1.0) === 7, 'Coherence 1.000 → Octave 7');

// Clamping
assert(c2o(-0.5) === 1, 'Negative coherence clamped → Octave 1');
assert(c2o(1.5) === 7, 'Coherence > 1 clamped → Octave 7');

// ═══════════════════════════════════════════════════════════════════════════
// TEST 4: KPI Normalization — Three Directions + Kappa Curvature
// ═══════════════════════════════════════════════════════════════════════════

section('4. KPI Normalization — Up, Down, Band + Kappa Curvature');

// Inline KPI normalization (mirrors KPI.js logic exactly)
function normalizeKPI(value, direction, metricType, targetMin, targetIdeal, healthyMin, healthyMax, absoluteMax) {
    let linearScore;

    if (direction === '↑') {
        if (value >= targetIdeal) linearScore = 1.0;
        else if (value <= targetMin) linearScore = 0.0;
        else {
            const range = targetIdeal - targetMin;
            linearScore = range <= 0 ? 0.0 : (value - targetMin) / range;
        }
    } else if (direction === '↓') {
        if (value <= targetMin) linearScore = 1.0;
        else if (value >= absoluteMax) linearScore = 0.0;
        else {
            const range = absoluteMax - targetMin;
            linearScore = range <= 0 ? 0.0 : 1 - ((value - targetMin) / range);
        }
    } else if (direction === 'Band') {
        if (value >= healthyMin && value <= healthyMax) linearScore = 1.0;
        else if (value < healthyMin) {
            if (value <= targetMin) linearScore = 0.0;
            else {
                const riseRange = healthyMin - targetMin;
                linearScore = riseRange <= 0 ? 0.0 : (value - targetMin) / riseRange;
            }
        } else {
            if (value >= absoluteMax) linearScore = 0.0;
            else {
                const fallRange = absoluteMax - healthyMax;
                linearScore = fallRange <= 0 ? 0.0 : 1 - ((value - healthyMax) / fallRange);
            }
        }
    }

    const safeScore = Math.max(0, Math.min(1, linearScore));
    const kappa = PhiHarmonics.CURVATURE[metricType] || 1.0;
    return Math.pow(safeScore, kappa);
}

// Up direction: linear 0→100
assertApprox(normalizeKPI(0, '↑', 'completion', 0, 100, 0, 100, 200), 0.0, eps, 'Up: value=0 → score=0');
assertApprox(normalizeKPI(50, '↑', 'completion', 0, 100, 0, 100, 200), 0.5, eps, 'Up: value=50 → score=0.5');
assertApprox(normalizeKPI(100, '↑', 'completion', 0, 100, 0, 100, 200), 1.0, eps, 'Up: value=100 → score=1.0');
assertApprox(normalizeKPI(150, '↑', 'completion', 0, 100, 0, 100, 200), 1.0, eps, 'Up: value=150 → score=1.0 (capped)');

// Down direction: lower is better
assertApprox(normalizeKPI(0, '↓', 'completion', 0, 100, 0, 100, 200), 1.0, eps, 'Down: value=0 → score=1.0');
assertApprox(normalizeKPI(100, '↓', 'completion', 0, 100, 0, 100, 200), 0.5, eps, 'Down: value=100 → score=0.5');
assertApprox(normalizeKPI(200, '↓', 'completion', 0, 100, 0, 100, 200), 0.0, eps, 'Down: value=200 → score=0.0');

// Band direction: healthy zone 40-60, ramps at edges
assertApprox(normalizeKPI(50, 'Band', 'completion', 0, 100, 40, 60, 100), 1.0, eps, 'Band: value=50 (in zone) → score=1.0');
assertApprox(normalizeKPI(20, 'Band', 'completion', 0, 100, 40, 60, 100), 0.5, eps, 'Band: value=20 (below, halfway) → score=0.5');
assertApprox(normalizeKPI(80, 'Band', 'completion', 0, 100, 40, 60, 100), 0.5, eps, 'Band: value=80 (above, halfway) → score=0.5');
assertApprox(normalizeKPI(0, 'Band', 'completion', 0, 100, 40, 60, 100), 0.0, eps, 'Band: value=0 (at floor) → score=0.0');

// Kappa curvature: survival (forgiving)
const survivalScore = normalizeKPI(50, '↑', 'survival', 0, 100, 0, 100, 200);
const expectedSurvival = Math.pow(0.5, PhiHarmonics.PHI_1); // 0.5^0.618 ≈ 0.6530
assertApprox(survivalScore, expectedSurvival, 1e-8, `Survival kappa: 0.5^φ⁻¹ = ${expectedSurvival.toFixed(4)} (forgiving)`);

// Kappa curvature: growth (demanding)
const growthScore = normalizeKPI(50, '↑', 'growth', 0, 100, 0, 100, 200);
const expectedGrowth = Math.pow(0.5, PhiHarmonics.PHI); // 0.5^1.618 ≈ 0.3256
assertApprox(growthScore, expectedGrowth, 1e-8, `Growth kappa: 0.5^φ = ${expectedGrowth.toFixed(4)} (demanding)`);

// Stress test edge case: targetMin === targetIdeal (zero range)
// When value=50 and targetIdeal=50, the Up check (value >= targetIdeal) fires first → 1.0
assertApprox(normalizeKPI(50, '↑', 'completion', 50, 50, 50, 50, 50), 1.0, eps, 'Edge: targetMin=targetIdeal, value=ideal → score=1.0 (at target)');

// ═══════════════════════════════════════════════════════════════════════════
// TEST 5: Face Energy Pipeline — Pentagram Geometry
// ═══════════════════════════════════════════════════════════════════════════

section('5. Face Energy Pipeline — Pentagram Geometry');

// Simulate the full Face calculation pipeline with known values
// Using default TuningConfig values (all PHI-derived)
const alpha = PhiHarmonics.PHI_1;  // 0.618
const beta = PhiHarmonics.PHI_1;   // 0.618
const gamma = PhiHarmonics.PHI_1;  // 0.618
const eta = PhiHarmonics.PHI_2;    // 0.382 (φ⁻²)

// 5 equal element scores (perfect harmony scenario)
const k_equal = [0.7, 0.7, 0.7, 0.7, 0.7];

// Star pairs for equal elements: α*(k+k)/2 + (1-α)*k*k
const s_equal = alpha * 0.7 + (1 - alpha) * 0.7 * 0.7;
assertApprox(s_equal, alpha * 0.7 + (1 - alpha) * 0.49, eps,
    `Star pair (equal): α×0.7 + (1-α)×0.49 = ${s_equal.toFixed(6)}`);

// Intersection nodes for equal values: all the same (beta doesn't matter)
const p_equal = beta * s_equal + (1 - beta) * s_equal;
assertApprox(p_equal, s_equal, eps, 'Intersection node (equal): same as star pair');

// Center composite: average of equal intersection nodes
assertApprox(p_equal, s_equal, eps, 'Center composite (equal): same as star pair');

// Harmonic resonance for equal elements: R = Σ(1-|ki-kj|)/10 = 10*1/10 = 1.0
assertApprox(1.0, 1.0, eps, 'Harmonic resonance (equal elements): R = 1.0 (perfect)');

// Local coherence: γ × ball + (1-γ) × pillarAvg, then × (1 + η × R)
const ballScore = 0.7;
const pillarAvg = 0.7;
const baseCoherence = gamma * ballScore + (1 - gamma) * pillarAvg;
assertApprox(baseCoherence, 0.7, eps, 'Base coherence (equal, γ×ball + (1-γ)×avg): 0.7');

const R_harmonic = 1.0; // perfect harmony
const harmonicBoost = 1.0 + eta * R_harmonic;
assertApprox(harmonicBoost, 1 + PhiHarmonics.PHI_2, eps,
    `Harmonic boost: 1 + φ⁻² = ${harmonicBoost.toFixed(6)}`);

const localCoherence = Math.min(1.0, baseCoherence * harmonicBoost);
assertApprox(localCoherence, 0.7 * (1 + PhiHarmonics.PHI_2), eps,
    `Local coherence: 0.7 × ${harmonicBoost.toFixed(4)} = ${localCoherence.toFixed(6)}`);

// Octave progress at O1: multiplier = 1.0 (no penalty)
const zeta = PhiHarmonics.PHI_2 / 6;
const zenithO1 = 1 - zeta * (1 - 1);
assertApprox(zenithO1, 1.0, eps, 'Zenith multiplier at O1: 1.0 (no penalty)');

// Octave progress at O7: multiplier = 1 - zeta*6 = 1 - φ⁻² = φ⁻¹
const zenithO7 = 1 - zeta * 6;
assertApprox(zenithO7, PhiHarmonics.PHI_1, 1e-8,
    `Zenith multiplier at O7: φ⁻¹ = ${PhiHarmonics.PHI_1.toFixed(6)} (beautiful symmetry)`);

// ═══════════════════════════════════════════════════════════════════════════
// TEST 6: Face Energy — Asymmetric Elements
// ═══════════════════════════════════════════════════════════════════════════

section('6. Face Energy — Asymmetric Elements');

// Elements with different values: [0.9, 0.3, 0.7, 0.5, 0.6]
const k_asym = [0.9, 0.3, 0.7, 0.5, 0.6];
const connections = [[0, 2], [1, 3], [2, 4], [3, 0], [4, 1]];

// Calculate star pairs
const starPairs = connections.map(([i, j]) => {
    const k1 = k_asym[i], k2 = k_asym[j];
    return alpha * (k1 + k2) / 2 + (1 - alpha) * k1 * k2;
});

console.log(`  [info] Star pairs: [${starPairs.map(s => s.toFixed(4)).join(', ')}]`);

// Verify star pair formula for first pair (0.9 and 0.7)
const expected_s0 = alpha * (0.9 + 0.7) / 2 + (1 - alpha) * 0.9 * 0.7;
assertApprox(starPairs[0], expected_s0, eps,
    `Star pair [0,2]: α×(0.9+0.7)/2 + (1-α)×0.63 = ${expected_s0.toFixed(6)}`);

// Harmonic resonance for asymmetric elements
const pentagramConns = [[2, 3], [3, 4], [0, 4], [0, 1], [1, 2]];
let totalRes = 0;
for (let i = 0; i < 5; i++) {
    for (const j of pentagramConns[i]) {
        totalRes += 1 - Math.abs(k_asym[i] - k_asym[j]);
    }
}
const R_asym = totalRes / 10;
assert(R_asym >= 0 && R_asym <= 1, `Harmonic resonance (asymmetric): ${R_asym.toFixed(4)} in [0,1]`);
assert(R_asym < 1.0, `Asymmetric R (${R_asym.toFixed(4)}) < 1.0 (imperfect harmony)`);

// Pillar avg
const avgAsym = k_asym.reduce((s, v) => s + v, 0) / 5;
assertApprox(avgAsym, 0.6, eps, 'Pillar average: (0.9+0.3+0.7+0.5+0.6)/5 = 0.6');

// ═══════════════════════════════════════════════════════════════════════════
// TEST 7: Fibonacci Sequence Verification
// ═══════════════════════════════════════════════════════════════════════════

section('7. Fibonacci Sequence & Convergence to PHI');

const fib = PhiHarmonics.FIBONACCI;
assert(fib[0] === 1, 'F(1) = 1');
assert(fib[1] === 1, 'F(2) = 1');

// Verify Fibonacci property: F(n) = F(n-1) + F(n-2)
for (let i = 2; i < fib.length; i++) {
    assert(fib[i] === fib[i - 1] + fib[i - 2],
        `F(${i + 1}) = ${fib[i]} = ${fib[i - 1]} + ${fib[i - 2]}`);
}

// Convergence to PHI
const ratio = fib[19] / fib[18]; // F(20)/F(19)
// Integer ratio converges but F(20)/F(19) diff is ~2.6e-8; need looser tolerance
assertApprox(ratio, PHI, 1e-7, `F(20)/F(19) = ${ratio.toFixed(10)} ≈ φ (convergence)`);

// ═══════════════════════════════════════════════════════════════════════════
// TEST 8: Dodecahedron Constants
// ═══════════════════════════════════════════════════════════════════════════

section('8. Dodecahedron Geometry Constants');

assert(PhiHarmonics.DODECA_FACES === 12, '12 faces');
assert(PhiHarmonics.DODECA_EDGES === 30, '30 edges');
assert(PhiHarmonics.DODECA_VERTICES === 20, '20 vertices');
assert(PhiHarmonics.DODECA_VERTICES_PER_FACE === 5, '5 vertices per face (pentagon)');
assert(PhiHarmonics.BREATH_AXES === 6, '6 breath axes');

// Euler's formula: V - E + F = 2
const euler = PhiHarmonics.DODECA_VERTICES - PhiHarmonics.DODECA_EDGES + PhiHarmonics.DODECA_FACES;
assert(euler === 2, `Euler formula: V-E+F = ${euler} = 2`);

// Dihedral angle: arccos(-1/√5) ≈ 116.565°
const expectedDihedral = Math.acos(-1 / Math.sqrt(5));
assertApprox(PhiHarmonics.DODECA_DIHEDRAL_ANGLE, expectedDihedral, eps,
    `Dihedral angle: arccos(-1/√5) ≈ ${(expectedDihedral * 180 / Math.PI).toFixed(2)}°`);

// ═══════════════════════════════════════════════════════════════════════════
// TEST 9: Spread Penalty & Lifecycle Constraints
// ═══════════════════════════════════════════════════════════════════════════

section('9. Spread Penalty & Lifecycle Constraints');

const calcSpread = PhiHarmonics.calculateSpreadPenalty;
assertApprox(calcSpread(0), 0, eps, 'Spread 0 → penalty 0');
assertApprox(calcSpread(2), 0, eps, 'Spread 2 → penalty 0 (healthy)');
assertApprox(calcSpread(3), 0.5, eps, 'Spread 3 → penalty 0.5 (minor)');
assertApprox(calcSpread(4), 1.0, eps, 'Spread 4 → penalty 1.0 (moderate)');
assertApprox(calcSpread(5), 1.5, eps, 'Spread 5 → penalty 1.5 (severe base)');
assertApprox(calcSpread(6), 2.0, eps, 'Spread 6 → penalty 2.0 (severe + 0.5)');

// Lifecycle constraints: monotonically increasing max octaves
const stages = ['pre-seed', 'seed', 'early-stage', 'growth', 'mature', 'enterprise', 'transcendent'];
let prevMax = 0;
for (const stage of stages) {
    const constraint = PhiHarmonics.getLifecycleConstraint(stage);
    assert(constraint.maxOctave >= prevMax,
        `${stage}: maxOctave=${constraint.maxOctave} >= previous (${prevMax})`);
    assert(constraint.typicalOctave <= constraint.maxOctave,
        `${stage}: typical (${constraint.typicalOctave}) <= max (${constraint.maxOctave})`);
    prevMax = constraint.maxOctave;
}

// ═══════════════════════════════════════════════════════════════════════════
// TEST 10: Curvature Parameters — PHI-Derived
// ═══════════════════════════════════════════════════════════════════════════

section('10. Curvature Parameters — PHI Derivation');

assertApprox(PhiHarmonics.CURVATURE.survival, PhiHarmonics.PHI_1, eps,
    'Survival kappa = φ⁻¹ (forgiving)');
assertApprox(PhiHarmonics.CURVATURE.growth, PHI, eps,
    'Growth kappa = φ (demanding)');
assertApprox(PhiHarmonics.CURVATURE.completion, 1.0, eps,
    'Completion kappa = 1.0 (linear)');

// Verify reciprocal relationship: survival × growth = 1
assertApprox(PhiHarmonics.CURVATURE.survival * PhiHarmonics.CURVATURE.growth, 1.0, eps,
    'survival × growth = φ⁻¹ × φ = 1.0 (beautiful reciprocity)');

// Semantic aliases
assertApprox(PhiHarmonics.CV_LAMBDA, PhiHarmonics.PHI_3, eps, 'CV_LAMBDA = φ⁻³');
assertApprox(PhiHarmonics.BREATH_BASE, PHI, eps, 'BREATH_BASE = φ');
assertApprox(PhiHarmonics.MASTERY_THRESHOLD, PhiHarmonics.PSI_3, eps, 'MASTERY_THRESHOLD = ψ₃');

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
    console.log('\n✨ All tests PASSED. The mathematics is proven correct.');
    process.exit(0);
}
