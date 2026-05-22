/**
 * ════════════════════════════════════════════════════════════════════════════════
 * DIAGNOSTICS.JS - CANONICAL POC DIAGNOSTIC METRICS
 * ════════════════════════════════════════════════════════════════════════════════
 *
 * Single source of truth for organization-level diagnostic computations that
 * operate on face energies. Created W1 §6.2 (2026-05-21) to consolidate the
 * AAG (Aspiration-Actuality Gap) implementation that previously lived in
 * three view-layer files. Per Lock #8.15 + CALCULATION_AUDIT_TRAIL.md §12.
 *
 * @module js/core/Diagnostics
 * @see {@link ../../docs/math/CALCULATION_AUDIT_TRAIL.md} §12 AAG canonical
 * @see {@link ../../tests/aag.test.js} - AAG diagnostic test suite (13 tests)
 *
 * ════════════════════════════════════════════════════════════════════════════════
 * NAVIGATION MAP - WHAT THIS FILE CONNECTS TO
 * ════════════════════════════════════════════════════════════════════════════════
 *
 * DEPENDS ON:
 *   - Nothing. Pure functions over face-energy data. No PhiHarmonics, no Logger,
 *     no Three.js, no DOM. Loadable in browser AND Node (CommonJS-compatible).
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
    // Future: getApparentGranularGap (W2 task per audit trail §16)
    // ────────────────────────────────────────────────────────────────────────────

    const Diagnostics = {
        getAspirationActualityGap: getAspirationActualityGap,
        // Internal helper exposed for downstream code that needs the same averaging
        // semantics (e.g., excel-report-generator's other face-group sheets).
        avgFaceEnergy: avgFaceEnergy,
        // Constants exposed for documentation/inspection
        ACTUALITY_FACE_IDS: ACTUALITY_FACE_IDS,
        ASPIRATION_FACE_IDS: ASPIRATION_FACE_IDS
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
