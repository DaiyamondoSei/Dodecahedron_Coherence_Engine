/**
 * ════════════════════════════════════════════════════════════════════════════
 * BREATH AXES - CANONICAL BREATH AXIS PAIRS
 * ════════════════════════════════════════════════════════════════════════════
 *
 * SINGLE SOURCE OF TRUTH for the 6 breath axis pairs of the dodecahedron.
 *
 * Each axis connects two opposing faces. In a regular dodecahedron centered
 * at the origin, opposite faces have centers that are exactly antipodal
 * (pointing in opposite directions).
 *
 * The numbering {1↔11, 2↔7, 3↔8, 4↔9, 5↔10, 6↔12} follows the standard
 * dodecahedron face labeling used in crystallography and sacred geometry.
 *
 *   Axis 1: Face 1 (Financial)   ↔ Face 11 (Funding)       — Resource breath
 *   Axis 2: Face 2 (Intellectual) ↔ Face 7 (Brand)         — Knowledge-to-identity breath
 *   Axis 3: Face 3 (Human)       ↔ Face 8 (Operations)     — People-to-process breath
 *   Axis 4: Face 4 (Structural)  ↔ Face 9 (Regenerative)   — Stability-to-renewal breath
 *   Axis 5: Face 5 (Market)      ↔ Face 10 (Values)        — External-to-internal breath
 *   Axis 6: Face 6 (Community)   ↔ Face 12 (Risk)          — Partnership-to-resilience breath
 *
 * @module js/constants/breath-axes
 * @see {@link ../../docs/BREATH_AXIS_REFERENCE.md}
 * @see {@link ../../math/BREATH_DYNAMICS.md}
 */

// ════════════════════════════════════════════════════════════════════════════
// BREATH AXIS PAIRS (Face ID → Opposing Face ID)
// ════════════════════════════════════════════════════════════════════════════

/**
 * Canonical mapping of each face to its opposing face.
 * Bidirectional: includes both directions (1→11 and 11→1).
 *
 * @constant {Object<number, number>}
 */
const BREATH_AXIS_MAP = Object.freeze({
    1: 11, 11: 1,   // Financial ↔ Funding
    2: 7,  7: 2,    // Intellectual ↔ Brand
    3: 8,  8: 3,    // Human ↔ Operations
    4: 9,  9: 4,    // Structural ↔ Regenerative
    5: 10, 10: 5,   // Market ↔ Values
    6: 12, 12: 6    // Community ↔ Risk
});

/**
 * The 6 breath axis pairs as an array of [faceA, faceB] tuples.
 * Useful for iteration when you need each axis exactly once.
 *
 * @constant {Array<[number, number]>}
 */
const BREATH_AXIS_PAIRS = Object.freeze([
    [1, 11],  // Financial ↔ Funding
    [2, 7],   // Intellectual ↔ Brand
    [3, 8],   // Human ↔ Operations
    [4, 9],   // Structural ↔ Regenerative
    [5, 10],  // Market ↔ Values
    [6, 12]   // Community ↔ Risk
]);

/**
 * Total number of breath axes in the dodecahedron.
 * @constant {number}
 */
const BREATH_AXIS_COUNT = 6;

// ════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════════════════

// Window global (matches phi-harmonics.js pattern — NO top-level export to avoid
// SyntaxError if ever loaded as non-module <script> tag)
if (typeof window !== 'undefined') {
    window.BreathAxes = {
        BREATH_AXIS_MAP,
        BREATH_AXIS_PAIRS,
        BREATH_AXIS_COUNT
    };
}

// CommonJS export (for Node.js testing)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BREATH_AXIS_MAP, BREATH_AXIS_PAIRS, BREATH_AXIS_COUNT };
}
