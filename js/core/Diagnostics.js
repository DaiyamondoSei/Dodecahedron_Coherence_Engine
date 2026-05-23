/**
 * ════════════════════════════════════════════════════════════════════════════════
 * DIAGNOSTICS.JS - CANONICAL POC DIAGNOSTIC METRICS
 * ════════════════════════════════════════════════════════════════════════════════
 *
 * Single source of truth for organization-level diagnostic computations that
 * operate on face energies and the 60-element KPI grid. Created W1 §6.2
 * (2026-05-21) to consolidate the AAG (Aspiration-Actuality Gap) implementation
 * that previously lived in three view-layer files. Extended W2 Session A
 * (2026-05-23) with AvG (Apparent vs Granular Gap) per Lock #8.26 + audit
 * trail §16. Per Lock #8.15 + CALCULATION_AUDIT_TRAIL.md §§12 + 16.
 *
 * @module js/core/Diagnostics
 * @see {@link ../../docs/math/CALCULATION_AUDIT_TRAIL.md} §12 AAG canonical, §16 AvG canonical
 * @see {@link ../../tests/aag.test.js} - AAG diagnostic test suite (13 tests)
 * @see {@link ../../tests/avg.test.js} - AvG diagnostic test suite (added W2 Session A)
 *
 * ════════════════════════════════════════════════════════════════════════════════
 * NAVIGATION MAP - WHAT THIS FILE CONNECTS TO
 * ════════════════════════════════════════════════════════════════════════════════
 *
 * DEPENDS ON:
 *   - Nothing. Pure functions over face-energy + KPI-grid data. No PhiHarmonics,
 *     no Logger, no Three.js, no DOM. Loadable in browser AND Node
 *     (CommonJS-compatible). PHI computed inline to preserve zero-deps.
 *
 * EXPORTS:
 *   - module.exports.Diagnostics (Node / CommonJS require)
 *   - global.Diagnostics / window.Diagnostics (browser script tag)
 *
 * USED BY (after W1 §6.2 consolidation):
 *   - js/excel-report-generator.js (buildDiagnosticsSheet)
 *   - js/excel-measurement-parser.js (computeDerivedValues)
 *   - pages/thesis-export.html (renderDiagnostics)
 *   - pages/weekly-input.html (indirect — receives AAG from parser)
 *   - pages/calculations.html (indirect — uses ExcelReportGenerator)
 *   - scripts/_build_cen_ssot_xlsx.py (W2 Sheet 13 — reads AAG + AvG canonical)
 *
 * ════════════════════════════════════════════════════════════════════════════════
 * AAG FORMULA - WHERE IT COMES FROM
 * ════════════════════════════════════════════════════════════════════════════════
 *
 *   AAG = E_Aspiration / E_Actuality
 *
 *   E_Actuality  = mean(E_F1, E_F2, E_F3)
 *                   F1  Financial Capital
 *                   F2  Intellectual Capital
 *                   F3  Human Capital
 *
 *   E_Aspiration = mean(E_F10, E_F11, E_F12)
 *                   F10 Foundational Values
 *                   F11 Funding Pipeline
 *                   F12 Risk & Resilience
 *
 *   Where E_Fn = canonical pentagramic-derived face energy (audit trail §2 + §4),
 *   NOT raw face score.
 *
 *   Division-by-zero handling: returns null sentinel for `aag` when
 *   E_Actuality === 0 (matches pre-consolidation excel-report-generator semantics
 *   and the contract enforced by aag.test.js Section 3).
 *
 * ════════════════════════════════════════════════════════════════════════════════
 * FUTURE EXTENSIONS
 * ════════════════════════════════════════════════════════════════════════════════
 *
 *   W2: getApparentGranularGap (AvG) — CALCULATION_AUDIT_TRAIL.md §16
 *   Other organization-level diagnostics that operate over face energies
 *   should be added here rather than re-implemented in view layers.
 *
 * ════════════════════════════════════════════════════════════════════════════════
 */

(function (global) {
    'use strict';

    // ────────────────────────────────────────────────────────────────────────────
    // Face-group definitions (1-indexed, matching Face.id convention)
    // ────────────────────────────────────────────────────────────────────────────
    const ACTUALITY_FACE_IDS = [1, 2, 3];        // F1, F2, F3
    const ASPIRATION_FACE_IDS = [10, 11, 12];    // F10, F11, F12

    /**
     * Internal helper: compute mean face energy for a list of face IDs.
     *
     * Accepts EITHER:
     *   - Array of Face-like objects with { id, faceEnergy } or { id, energy }
     *   - Plain object map keyed by face ID (1..12) with numeric values
     *
     * Matches ExcelReportGenerator.avgFaceEnergy() and excel-measurement-parser
     * semantics: ignores missing faces, returns 0 for empty matched set.
     *
     * @param {Array|Object} faceEnergies - face data (array or id-keyed map)
     * @param {Array<number>} faceIds - face IDs to average over
     * @returns {number} mean energy (0 when no matched faces)
     */
    function avgFaceEnergy(faceEnergies, faceIds) {
        let matched = [];
        if (Array.isArray(faceEnergies)) {
            // Face-like array: filter by id, extract faceEnergy with fallbacks
            matched = faceEnergies
                .filter(f => f && faceIds.includes(f.id))
                .map(f => f.faceEnergy ?? f.energy ?? 0);
        } else if (faceEnergies && typeof faceEnergies === 'object') {
            // Id-keyed map: lookup by id, skip null/undefined
            matched = faceIds
                .map(id => faceEnergies[id])
                .filter(e => e != null);
        }
        if (matched.length === 0) return 0;
        const sum = matched.reduce((acc, v) => acc + v, 0);
        return sum / matched.length;
    }

    /**
     * Compute Aspiration-Actuality Gap (AAG) — canonical Quannex formula.
     *
     * AAG = E_Aspiration / E_Actuality
     *   E_Actuality  = mean(E_F1, E_F2, E_F3)   [Financial + Intellectual + Human]
     *   E_Aspiration = mean(E_F10, E_F11, E_F12) [Values + Funding + Risk]
     *
     * Returns null sentinel for `aag` if E_Actuality === 0 (division-by-zero
     * guard — matches pre-consolidation behavior and aag.test.js Section 3).
     *
     * @param {Array|Object} faceEnergies - Face[] array or face-id-keyed map
     * @returns {{aag: (number|null), eActuality: number, eAspiration: number}}
     */
    function getAspirationActualityGap(faceEnergies) {
        const eActuality = avgFaceEnergy(faceEnergies, ACTUALITY_FACE_IDS);
        const eAspiration = avgFaceEnergy(faceEnergies, ASPIRATION_FACE_IDS);
        const aag = eActuality > 0 ? eAspiration / eActuality : null;
        return {
            aag: aag,
            eActuality: eActuality,
            eAspiration: eAspiration
        };
    }

    // ────────────────────────────────────────────────────────────────────────────
    // AvG (Apparent vs Granular Gap) — canonical per audit trail §16
    // Added W2 Session A (2026-05-23) per Lock #8.26.
    // ────────────────────────────────────────────────────────────────────────────

    // PHI computed inline to preserve zero-dependency contract of this module.
    // Matches PhiHarmonics.PHI in browser context but does NOT import it
    // (Diagnostics.js must be loadable in any environment, including bare Node).
    const PHI = (1 + Math.sqrt(5)) / 2;            // 1.6180339887498949
    const LAMBDA = 1 / (PHI * PHI * PHI);          // φ⁻³ ≈ 0.2360679774997897

    // AvG interpretation thresholds — φ-derived, per audit trail §16
    // Interpretation Ladder. Computed inline (not from PhiHarmonics) for the
    // same zero-deps reason.
    const AVG_BAND_FAITHFUL_MAX        = 1 / Math.pow(PHI, 6);  // φ⁻⁶ ≈ 0.0557
    const AVG_BAND_MINOR_MAX           = 1 / Math.pow(PHI, 5);  // φ⁻⁵ ≈ 0.0902
    const AVG_BAND_DISTORTION_MAX      = 1 / Math.pow(PHI, 4);  // φ⁻⁴ ≈ 0.1459

    /**
     * Internal helper: compute C_global pre-amplifier raw value per audit
     * trail §1 + §16.
     *
     *   C_global_raw = μ_E × (1 − λ · CV_E)
     *
     * Where:
     *   μ_E    = mean of face energies
     *   σ_E    = standard deviation of face energies (population, divisor N)
     *   CV_E   = σ_E / μ_E  (coefficient of variation; undefined when μ_E = 0)
     *   λ      = φ⁻³ ≈ 0.2361 (canonical Quannex tuning)
     *
     * This is the PRE-amplifier value (no κ S-curve applied). Used for AvG
     * because K_mean_60 has no amplifier; the comparison must be raw-vs-raw.
     * See audit trail §16 "Pre-Amplifier vs Post-Amplifier Choice".
     *
     * @param {Array<number>} values - flat array of face energy values
     * @returns {{muE: number, sigmaE: number, cvE: number, cGlobal: number}}
     */
    function computeCGlobalRaw(values) {
        if (!Array.isArray(values) || values.length === 0) {
            return { muE: 0, sigmaE: 0, cvE: 0, cGlobal: 0 };
        }
        const n = values.length;
        const sum = values.reduce((a, v) => a + v, 0);
        const muE = sum / n;
        if (muE === 0) {
            return { muE: 0, sigmaE: 0, cvE: 0, cGlobal: 0 };
        }
        const variance = values.reduce((a, v) => a + (v - muE) * (v - muE), 0) / n;
        const sigmaE = Math.sqrt(variance);
        const cvE = sigmaE / muE;
        const cGlobal = muE * (1 - LAMBDA * cvE);
        return { muE: muE, sigmaE: sigmaE, cvE: cvE, cGlobal: cGlobal };
    }

    /**
     * Internal helper: extract a flat numeric array from face-energy data.
     * Mirrors avgFaceEnergy() input flexibility (Face[] array OR id-keyed map).
     * Unlike avgFaceEnergy() this returns ALL face values (no faceIds filter).
     *
     * @param {Array|Object} faceEnergies - face data (array or id-keyed map)
     * @returns {Array<number>} flat array of energy values; empty when no faces
     */
    function extractAllFaceEnergies(faceEnergies) {
        if (Array.isArray(faceEnergies)) {
            return faceEnergies
                .filter(f => f && (f.faceEnergy != null || f.energy != null))
                .map(f => f.faceEnergy ?? f.energy ?? 0);
        }
        if (faceEnergies && typeof faceEnergies === 'object') {
            return Object.values(faceEnergies)
                .filter(v => v != null && typeof v === 'number');
        }
        return [];
    }

    /**
     * Internal helper: classify AvG magnitude into one of 4 φ-derived bands.
     * Per audit trail §16 Interpretation Ladder.
     *
     * @param {number} avg - the absolute |C_global − K_mean_60| value
     * @returns {string} band identifier
     */
    function classifyAvGBand(avg) {
        if (avg < AVG_BAND_FAITHFUL_MAX)   return 'faithful';
        if (avg < AVG_BAND_MINOR_MAX)      return 'minor_compression';
        if (avg < AVG_BAND_DISTORTION_MAX) return 'aggregation_distortion';
        return 'severe_distortion';
    }

    /**
     * Compute Apparent vs Granular Gap (AvG) — canonical Quannex aggregation
     * distortion diagnostic. Per Lock #8.26 + audit trail §16.
     *
     *   AvG = |C_global − K_mean_60|
     *
     *   C_global_raw  = μ_E × (1 − λ · CV_E)              [Section 1 pre-amplifier]
     *   K_mean_60     = arithmetic mean of all KPI grid values
     *                   (silent cells are zero-filled per canonical zeroEnergy rule;
     *                    they ARE part of the granular truth, NOT excluded)
     *
     * Catches the failure mode where face-level coherence looks healthy but
     * the underlying KPI infrastructure is weak. The rollup vs detail gap is
     * a *hierarchy-aware* diagnostic (complement to AAG which is partition-aware).
     *
     * SCOPE DISTINCTION (audit trail §16): AvG can be computed at two scopes
     * answering different questions:
     *   - 'O1'  : strict-O1 cells only (silent cells from O2/O3 contribute 0)
     *   - 'all' : all 60 cells regardless of canonical priority
     *   - 'custom': caller-defined grid (e.g. 30-element pilot, 100-element scaled)
     * The scope MUST be propagated to display; never substitute one for another.
     *
     * EDGE CASES:
     *   - Empty face energies → returns avg = null
     *   - Empty KPI grid → K_mean_60 = 0 (matches "all cells silent" semantics)
     *   - μ_E = 0 → C_global = 0; AvG reduces to K_mean_60 magnitude
     *   - Non-numeric or null KPI values are filtered out (NOT zero-filled here —
     *     caller is responsible for zero-filling silent cells before invocation,
     *     matching the canonical zeroEnergy rule from §16)
     *
     * @param {Array|Object} faceEnergies - Face[] array or face-id-keyed map
     * @param {Array<number>} kpiGridValues - flat array of element-level KPI
     *        values normalized to [0, 1]; canonical CEN scope is 60 (12 faces ×
     *        5 elements). Silent cells must be zero-filled by caller.
     * @param {Object} [options] - optional configuration
     * @param {string} [options.scope='custom'] - scope label propagated to result
     * @returns {{
     *   avg: (number|null),
     *   cGlobal: number,
     *   kMean60: number,
     *   muE: number,
     *   sigmaE: number,
     *   cvE: number,
     *   band: (string|null),
     *   scope: string,
     *   nFaces: number,
     *   nKpiCells: number
     * }}
     */
    function getApparentGranularGap(faceEnergies, kpiGridValues, options) {
        const opts = options || {};
        const scope = opts.scope || 'custom';

        const faceValues = extractAllFaceEnergies(faceEnergies);
        const cgRaw = computeCGlobalRaw(faceValues);

        // K_mean_60: arithmetic mean of provided KPI grid values
        // Silent cells must be zero-filled by caller before invocation per
        // canonical zeroEnergy rule. We filter out null/undefined defensively
        // but treat 0 as a legitimate value (a silent cell IS evidence of
        // absence).
        const kpiValid = Array.isArray(kpiGridValues)
            ? kpiGridValues.filter(v => v != null && typeof v === 'number')
            : [];
        const kMean60 = kpiValid.length > 0
            ? kpiValid.reduce((a, v) => a + v, 0) / kpiValid.length
            : 0;

        // If no face energies, AvG is undefined — return null sentinel
        const avg = faceValues.length === 0
            ? null
            : Math.abs(cgRaw.cGlobal - kMean60);

        const band = avg === null ? null : classifyAvGBand(avg);

        return {
            avg: avg,
            cGlobal: cgRaw.cGlobal,
            kMean60: kMean60,
            muE: cgRaw.muE,
            sigmaE: cgRaw.sigmaE,
            cvE: cgRaw.cvE,
            band: band,
            scope: scope,
            nFaces: faceValues.length,
            nKpiCells: kpiValid.length
        };
    }

    const Diagnostics = {
        getAspirationActualityGap: getAspirationActualityGap,
        getApparentGranularGap: getApparentGranularGap,
        // Internal helper exposed for downstream code that needs the same averaging
        // semantics (e.g., excel-report-generator's other face-group sheets).
        avgFaceEnergy: avgFaceEnergy,
        // AvG internal helpers exposed for cross-verify + Excel-sheet inspection
        computeCGlobalRaw: computeCGlobalRaw,
        classifyAvGBand: classifyAvGBand,
        // Constants exposed for documentation/inspection
        ACTUALITY_FACE_IDS: ACTUALITY_FACE_IDS,
        ASPIRATION_FACE_IDS: ASPIRATION_FACE_IDS,
        PHI: PHI,
        LAMBDA: LAMBDA,
        AVG_BAND_FAITHFUL_MAX: AVG_BAND_FAITHFUL_MAX,
        AVG_BAND_MINOR_MAX: AVG_BAND_MINOR_MAX,
        AVG_BAND_DISTORTION_MAX: AVG_BAND_DISTORTION_MAX
    };

    // ────────────────────────────────────────────────────────────────────────────
    // Dual export: Node (CommonJS) + browser (window global)
    // ────────────────────────────────────────────────────────────────────────────
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Diagnostics;
    } else {
        global.Diagnostics = Diagnostics;
    }
})(typeof window !== 'undefined' ? window : globalThis);
