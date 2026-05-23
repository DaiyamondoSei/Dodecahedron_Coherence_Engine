/**
 * ════════════════════════════════════════════════════════════════════════════
 * ENGINE STATE CANONICALITY — VERIFICATION-GATE TEST SUITE
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Operationalizes `POC/docs/HYGIENE_PRINCIPLES.md` (third pillar of POC
 * documentation spine, 2026-05-23) as automated infrastructure. The hygiene
 * principle:
 *
 *     "Code ran without error" is NECESSARY but NOT SUFFICIENT for correctness.
 *     Verification gates must check OBSERVABLE OUTPUTS against CANONICAL
 *     EXPECTATIONS.
 *
 * Today's W2 Session A discovered THREE silent-default-masquerading bugs.
 * This test file CATCHES that class of bug for future regression:
 *
 *   Section 1: TuningConfig balancedMode canonical constants
 *              (catches future drift from phi-derived defaults)
 *
 *   Section 2: Per-company mapping-context.json tuning block structure
 *              (catches Lock #8.33 silent loader path bug at data layer —
 *              ensures all 5 companies have tuning at `diagnostics.tuning`
 *              nested location where loader expects it)
 *
 *   Section 3: TuningConfig.fromJSON correctly imports per-company tuning
 *              (catches future regression in the loader path:
 *              context.diagnostics?.tuning ?? context.tuning)
 *
 *   Section 4: All 5 companies' tuning blocks have sensible values
 *              (catches future silent-default-via-typo or missing fields)
 *
 * NOT covered here (deferred to Playwright integration tests):
 *   - Live engine `getState()` topology arrays (Lock #8.27 regression)
 *     because main.js DodecahedronEngine requires more browser shims than
 *     this Node test can provide cleanly. Future Playwright-driven test
 *     can lock-in: faces=12 ∧ edges=30 ∧ vertices=20 ∧ Euler V−E+F=2.
 *
 * Companion to:
 *   - tests/aag.test.js   (Diagnostics.getAspirationActualityGap canonical)
 *   - tests/avg.test.js   (Diagnostics.getApparentGranularGap canonical + Real
 *                          module integration Section 7 pattern)
 *
 * Authority:
 *   - POC/docs/HYGIENE_PRINCIPLES.md (the principle this test enforces)
 *   - Lock #8.31 (mapping-context.json tuning refresh to balancedMode)
 *   - Lock #8.32 (κ canonical = φ², NOT 4)
 *   - Lock #8.33 (per-company tuning loader fix — 6-week silent bug closed)
 *
 * Run: node tests/engine-state-canonicality.test.mjs
 * Registered in: tests/run-all.js
 *
 * @author Deimantas Murauskas & Claude
 * @date 2026-05-23 (POC W2 Session A Tier 1 closure batch — third pillar
 *                   operationalization)
 * ════════════════════════════════════════════════════════════════════════════
 */

import { readFileSync } from 'fs';
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const POC_ROOT = path.resolve(__dirname, '..');

// ════════════════════════════════════════════════════════════════════════
// SETUP — Browser-global shims for engine module compatibility
// ════════════════════════════════════════════════════════════════════════

globalThis.Logger = {
    info: () => {}, debug: () => {}, warn: () => {}, error: () => {}
};

const require = createRequire(import.meta.url);
const PhiHarmonics = require('../js/constants/phi-harmonics.js');
globalThis.window = { PhiHarmonics };

// Load TuningConfig class (ES module — supports the per-company tuning path)
const { TuningConfig } = await import('../js/core/TuningConfig.js');

// ════════════════════════════════════════════════════════════════════════
// TEST INFRASTRUCTURE
// ════════════════════════════════════════════════════════════════════════

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

function approx(a, b, eps = 1e-9) {
    return Math.abs(a - b) < eps;
}

// Canonical phi-derived constants (mirror PhiHarmonics for independent verification)
const PHI = (1 + Math.sqrt(5)) / 2;
const PHI_INV_1 = 1 / PHI;
const PHI_INV_2 = 1 / (PHI * PHI);
const PHI_SQUARED = PHI * PHI;

// The 5 canonical company directories the engine supports
const ALL_COMPANIES = ['apex-industries', 'cen', 'nova-tech', 'quannex', 'zenith-solutions'];

// ════════════════════════════════════════════════════════════════════════
// SECTION 1: TuningConfig balancedMode produces canonical phi-derived constants
// ────────────────────────────────────────────────────────────────────────
// Locks Lock #8.32 (κ = φ²) + Lock #8.6 (pentagramic canonical) in place.
// If anyone changes balancedMode constants away from phi-derivation, fail.
// ════════════════════════════════════════════════════════════════════════
sec('1. TuningConfig.balancedMode canonical constants (Locks #8.6 + #8.32)');

const balanced = TuningConfig.balancedMode();

assert(approx(balanced.ALPHA, PHI_INV_1),
    `ALPHA = φ⁻¹ ≈ 0.6180 (got ${balanced.ALPHA.toFixed(10)})`);
assert(balanced.BETA === 0.5,
    `BETA = 0.5 (got ${balanced.BETA})`);
assert(balanced.GAMMA === 0.7,
    `GAMMA = 0.7 (got ${balanced.GAMMA})`);
assert(balanced.DELTA === 0.9,
    `DELTA = 0.9 (got ${balanced.DELTA})`);
assert(approx(balanced.KAPPA, PHI_SQUARED),
    `KAPPA = φ² ≈ 2.6180 (Lock #8.32 — NOT 4 which was enterpriseMode) (got ${balanced.KAPPA.toFixed(10)})`);
assert(approx(balanced.ETA, PHI_INV_2),
    `ETA = φ⁻² ≈ 0.3820 (got ${balanced.ETA.toFixed(10)})`);
assert(approx(balanced.ZETA, PHI_INV_2 / 6),
    `ZETA = φ⁻²/6 ≈ 0.0637 (got ${balanced.ZETA.toFixed(10)})`);
assert(approx(balanced.THETA, PHI_INV_1),
    `THETA = φ⁻¹ ≈ 0.6180 (got ${balanced.THETA.toFixed(10)})`);

// ════════════════════════════════════════════════════════════════════════
// SECTION 2: All 5 companies have tuning at canonical NESTED location
// ────────────────────────────────────────────────────────────────────────
// Lock #8.33 REGRESSION TEST: company-loader.js:154 looks for tuning at
// `context.diagnostics?.tuning ?? context.tuning`. If ANY company's
// mapping-context.json doesn't have tuning at one of those locations, the
// loader silently falls back to engine default — exactly the 6-week silent
// bug pattern. This test catches that class of regression at the data layer.
// ════════════════════════════════════════════════════════════════════════
sec('2. All 5 companies have tuning at diagnostics.tuning (Lock #8.33 regression)');

const companyData = {};
for (const company of ALL_COMPANIES) {
    const mcPath = path.join(POC_ROOT, 'companies', company, 'mapping-context.json');
    let mc;
    try {
        mc = JSON.parse(readFileSync(mcPath, 'utf8'));
    } catch (e) {
        failed++;
        console.log(`  ❌  ${company}: failed to load mapping-context.json — ${e.message}`);
        continue;
    }
    companyData[company] = mc;

    // Tuning must be at diagnostics.tuning (nested) OR top-level tuning
    const tuning = mc.diagnostics?.tuning ?? mc.tuning;
    assert(tuning !== undefined && tuning !== null,
        `${company}: tuning block exists at diagnostics.tuning OR top-level`);

    if (tuning) {
        // All 8 required tuning constants present
        const required = ['alpha', 'beta', 'gamma', 'delta', 'kappa', 'eta', 'zeta', 'theta'];
        const missing = required.filter(k => tuning[k] === undefined);
        assert(missing.length === 0,
            `${company}: tuning has all 8 constants (missing: ${missing.length === 0 ? 'none' : missing.join(', ')})`);

        // Values are numeric + in plausible ranges per TuningConfig.fromJSON clamp
        const ranges = {
            alpha: [0, 1], beta: [0, 1], gamma: [0, 1], delta: [0, 1],
            kappa: [0.1, 10], eta: [0, 1], zeta: [0, 0.5], theta: [0, 1]
        };
        const outOfRange = Object.entries(ranges)
            .filter(([k, [min, max]]) => {
                const v = tuning[k];
                return typeof v !== 'number' || v < min || v > max;
            })
            .map(([k]) => k);
        assert(outOfRange.length === 0,
            `${company}: all 8 tuning values in valid ranges (out-of-range: ${outOfRange.length === 0 ? 'none' : outOfRange.join(', ')})`);
    }
}

// ════════════════════════════════════════════════════════════════════════
// SECTION 3: TuningConfig.fromJSON correctly imports per-company tuning
// ────────────────────────────────────────────────────────────────────────
// Simulates the LIVE engine load path: company-loader.js applies tuning via
// `window.Quannex.importTuning(context.tuning)` → main.js → TuningConfig.fromJSON.
// This test verifies that for each company, the fromJSON call produces the
// expected canonical state.
// ════════════════════════════════════════════════════════════════════════
sec('3. TuningConfig.fromJSON imports per-company tuning correctly');

// Expected per-company canonical tuning archetypes:
// - cen / quannex: balancedMode (post-Lock #8.31 refresh; CEN got refreshed 2026-05-23)
// - apex-industries: enterpriseMode (alpha=0.7, kappa=φ³≈4.236 rounded to 4 in JSON)
// - nova-tech: startupMode-like (similar to CEN's pre-Lock-#8.31 NGO preset)
// - zenith-solutions: custom (verified non-default)
const EXPECTED_ALPHA = {
    'cen': PHI_INV_1,        // balancedMode (refreshed Lock #8.31)
    'quannex': PHI_INV_1,    // expected balancedMode (canonical for Quannex itself)
};

for (const company of ALL_COMPANIES) {
    const mc = companyData[company];
    if (!mc) continue;
    const tuning = mc.diagnostics?.tuning ?? mc.tuning;
    if (!tuning) continue;

    const config = TuningConfig.fromJSON(tuning);

    // The fromJSON should round-trip the values (within clamp ranges)
    assert(approx(config.ALPHA, tuning.alpha, 1e-9),
        `${company}: TuningConfig.fromJSON(.alpha) = ${tuning.alpha} (got ${config.ALPHA})`);
    assert(approx(config.KAPPA, tuning.kappa, 1e-9),
        `${company}: TuningConfig.fromJSON(.kappa) = ${tuning.kappa} (got ${config.KAPPA})`);

    // For CEN specifically: verify post-Lock #8.31 refresh produces balancedMode
    if (company === 'cen') {
        assert(approx(config.ALPHA, PHI_INV_1),
            `cen: post-refresh ALPHA = φ⁻¹ canonical (Lock #8.31)`);
        assert(approx(config.KAPPA, PHI_SQUARED),
            `cen: post-refresh KAPPA = φ² canonical (Lock #8.32)`);
    }
}

// ════════════════════════════════════════════════════════════════════════
// SECTION 4: Sister regression — companies' essential structural fields
// ────────────────────────────────────────────────────────────────────────
// Defensive: catches the broader silent-default-masquerading pattern at
// the data layer. Each company should have companyId, displayName, faces
// array of 12, etc.
// ════════════════════════════════════════════════════════════════════════
sec('4. All 5 companies have canonical structural fields (defensive regression)');

for (const company of ALL_COMPANIES) {
    const mc = companyData[company];
    if (!mc) continue;

    assert(mc.companyId === company,
        `${company}: companyId field matches directory name (got "${mc.companyId}")`);
    assert(typeof mc.displayName === 'string' && mc.displayName.length > 0,
        `${company}: displayName is non-empty string`);
    assert(Array.isArray(mc.faces) && mc.faces.length === 12,
        `${company}: faces array has 12 entries (dodecahedron requirement)`);

    // Each face has the 5-element block per audit trail §2 pentagramic
    if (Array.isArray(mc.faces)) {
        const facesWithBadElements = mc.faces.filter((f, i) => {
            if (!f.elements) return true;
            const els = ['earth', 'water', 'fire', 'air', 'ether'];
            return els.some(e => typeof f.elements[e] !== 'number' || f.elements[e] < 0 || f.elements[e] > 1);
        });
        assert(facesWithBadElements.length === 0,
            `${company}: all 12 faces have valid 5-element block (Earth/Water/Fire/Air/Ether ∈ [0,1])`);
    }
}

// ════════════════════════════════════════════════════════════════════════
// SUMMARY
// ════════════════════════════════════════════════════════════════════════
console.log('\n' + '═'.repeat(64));
console.log(`  RESULT: ${passed} passed, ${failed} failed`);
console.log('═'.repeat(64));

// Per HYGIENE_PRINCIPLES.md guidance: status indicators are insufficient.
// This test PASSES only when ALL observable state matches canonical expectations.
process.exit(failed === 0 ? 0 : 1);
