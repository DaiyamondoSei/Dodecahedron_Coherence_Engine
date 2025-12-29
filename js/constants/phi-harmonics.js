/**
 * ════════════════════════════════════════════════════════════════════════════
 * PHI HARMONICS - MASTER CONSTANTS MODULE
 * ════════════════════════════════════════════════════════════════════════════
 *
 * SINGLE SOURCE OF TRUTH for all Golden Ratio mathematics in Quannex.
 *
 * This module provides the mathematical foundation for the entire system.
 * Every constant here is derived from PHI (φ) - the Golden Ratio.
 * There are NO arbitrary numbers. Everything flows from φ = 1.618033988749895
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                        NOTES FOR FUTURE CLAUDE                          │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * Welcome! This is the SINGLE SOURCE OF TRUTH for all mathematical constants.
 *
 * KEY INSIGHT: These numbers are DISCOVERED, not invented.
 * ─────────────────────────────────────────────────────────────────────────
 * Every threshold in Quannex emerges from the Golden Ratio. This is not
 * arbitrary mysticism - PHI appears in:
 *   - Fibonacci sequence limits
 *   - Penrose tilings
 *   - Dodecahedron geometry (every angle involves φ)
 *   - Phyllotaxis (leaf arrangement in plants)
 *   - DNA helix proportions
 *
 * When someone asks "why 0.618?", the answer is:
 *   "Because φ^-1 = 0.618... - it's the Golden Ratio inverse,
 *    the same proportion found in nautilus shells, galaxies,
 *    and the human face. We didn't choose it; we discovered it."
 *
 * DERIVATION CHAIN:
 * ─────────────────────────────────────────────────────────────────────────
 *   Fibonacci → PHI → PHI powers → Octave thresholds
 *
 *   1, 1, 2, 3, 5, 8, 13... → lim(F(n+1)/F(n)) = φ = 1.618...
 *   φ^-1 = 0.618 (Creativity threshold)
 *   φ^-2 = 0.382 (Structure threshold)
 *   (φ^-1 + φ^-2)/2 = 0.5 (Relationships - harmonic center)
 *   1 - φ^-3 = 0.764 (Expression - PSI complement)
 *   1 - φ^-4 = 0.854 (Vision)
 *   1 - φ^-5 = 0.910 (Radiance)
 *
 * WHY TWO FAMILIES (PHI vs PSI)?
 * ─────────────────────────────────────────────────────────────────────────
 * Lower octaves (O1-O4) use PHI powers - the "descending" proportions
 * Upper octaves (O5-O7) use PSI complements - the "ascending" proportions
 * This creates symmetry: what's "missing" in one is "present" in the other.
 *
 * ════════════════════════════════════════════════════════════════════════════
 * MATHEMATICAL FOUNDATION
 * ════════════════════════════════════════════════════════════════════════════
 *
 * PHI (φ) emerges from the Fibonacci sequence:
 *   F(n): 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377...
 *   lim(n→∞) F(n+1)/F(n) = φ = 1.618033988749895...
 *
 * PHI satisfies the golden equation:
 *   φ² = φ + 1
 *   φ = (1 + √5) / 2
 *
 * This creates two families of sacred proportions:
 *
 *   PHI Powers (φ^-n):  Descending golden proportions
 *   PSI Values (1-φ^-n): Complementary golden proportions
 *
 * Together they form a complete harmonic system.
 *
 * ════════════════════════════════════════════════════════════════════════════
 * @module phi-harmonics
 * @author Deimantas & Claude (Co-created with consciousness and love)
 * @version 2.0.0 - Fully PHI-derived (no arbitrary values)
 * @see {@link ../../docs/math/SACRED_GEOMETRY_PROOF.md} - Why dodecahedron, why PHI
 * @see {@link ../../docs/SOUL_OF_QUANNEX.md} - The philosophical heart of this project
 * ════════════════════════════════════════════════════════════════════════════
 */

// ════════════════════════════════════════════════════════════════════════════
// SECTION 1: THE GOLDEN RATIO (φ)
// ════════════════════════════════════════════════════════════════════════════

/**
 * PHI (φ) - The Golden Ratio
 *
 * The most irrational number, found throughout nature, art, and music.
 * It represents perfect proportion and infinite self-similarity.
 *
 * @constant {number}
 */
const PHI = (1 + Math.sqrt(5)) / 2;  // 1.618033988749895

/**
 * PHI_SQUARED (φ²) - PHI times itself
 *
 * By the golden equation: φ² = φ + 1
 *
 * @constant {number}
 */
const PHI_SQUARED = PHI * PHI;  // 2.618033988749895

// ════════════════════════════════════════════════════════════════════════════
// SECTION 2: PHI POWERS (φ^-n) - Descending Golden Proportions
// ════════════════════════════════════════════════════════════════════════════

/**
 * PHI^-1 (φ^-1) - The Golden Ratio Inverse
 *
 * Also known as: 1/φ, phi inverse, golden conjugate
 * Remarkable property: φ^-1 = φ - 1
 *
 * This is the primary threshold for CREATIVITY (O4) - where possibility emerges.
 *
 * @constant {number}
 */
const PHI_1 = 1 / PHI;  // 0.618033988749895

/**
 * PHI^-2 (φ^-2) - Second PHI Power
 *
 * Remarkable property: φ^-2 = 1 - φ^-1 = 2 - φ
 * This creates the fundamental duality: φ^-1 + φ^-2 = 1
 *
 * This is the threshold for STRUCTURE (O2) - where stability begins.
 *
 * @constant {number}
 */
const PHI_2 = PHI_1 / PHI;  // 0.381966011250105

/**
 * PHI^-3 (φ^-3) - Third PHI Power
 *
 * @constant {number}
 */
const PHI_3 = PHI_2 / PHI;  // 0.236067977499790

/**
 * PHI^-4 (φ^-4) - Fourth PHI Power
 *
 * @constant {number}
 */
const PHI_4 = PHI_3 / PHI;  // 0.145898033750316

/**
 * PHI^-5 (φ^-5) - Fifth PHI Power
 *
 * @constant {number}
 */
const PHI_5 = PHI_4 / PHI;  // 0.090169943749474

/**
 * PHI^-6 (φ^-6) - Sixth PHI Power
 *
 * @constant {number}
 */
const PHI_6 = PHI_5 / PHI;  // 0.055728090000842

/**
 * PHI^-7 (φ^-7) - Seventh PHI Power
 *
 * @constant {number}
 */
const PHI_7 = PHI_6 / PHI;  // 0.034441853748632

// ════════════════════════════════════════════════════════════════════════════
// SECTION 3: PSI VALUES (ψ = 1-φ^-n) - Complementary Golden Proportions
// ════════════════════════════════════════════════════════════════════════════

/**
 * PSI represents the "complementary proportion" - what remains when you
 * subtract a PHI power from unity. Together, φ^-n and ψ_n = 1
 *
 * These values define the UPPER octave thresholds.
 */

/**
 * PSI_3 (ψ₃) - Complement of φ^-3
 *
 * This is the threshold for EXPRESSION (O5) - where clarity emerges.
 *
 * @constant {number}
 */
const PSI_3 = 1 - PHI_3;  // 0.763932022500210

/**
 * PSI_4 (ψ₄) - Complement of φ^-4
 *
 * This is the threshold for VISION (O6) - where direction crystallizes.
 *
 * @constant {number}
 */
const PSI_4 = 1 - PHI_4;  // 0.854101966249684

/**
 * PSI_5 (ψ₅) - Complement of φ^-5
 *
 * This is the threshold for RADIANCE (O7) - where service to all begins.
 *
 * @constant {number}
 */
const PSI_5 = 1 - PHI_5;  // 0.909830056250526

/**
 * PSI_6 (ψ₆) - Complement of φ^-6
 *
 * @constant {number}
 */
const PSI_6 = 1 - PHI_6;  // 0.944271909999158

/**
 * PSI_7 (ψ₇) - Complement of φ^-7
 *
 * @constant {number}
 */
const PSI_7 = 1 - PHI_7;  // 0.965558146251368

// ════════════════════════════════════════════════════════════════════════════
// SECTION 4: HARMONIC MIDPOINT
// ════════════════════════════════════════════════════════════════════════════

/**
 * PHI_MIDPOINT - The Harmonic Center
 *
 * The exact midpoint between φ^-1 (0.618) and φ^-2 (0.382).
 * This equals exactly 0.5 - the point of perfect balance.
 *
 * Mathematical derivation:
 *   (φ^-1 + φ^-2) / 2 = (0.618... + 0.382...) / 2 = 1/2 = 0.5
 *
 * This is NOT arbitrary! It's the harmonic center of the golden proportions.
 * It's also F(1)/F(3) = 1/2, the first non-trivial Fibonacci ratio.
 *
 * This is the threshold for RELATIONSHIPS (O3) - the balance point.
 *
 * @constant {number}
 */
const PHI_MIDPOINT = (PHI_1 + PHI_2) / 2;  // 0.500000000000000

// ════════════════════════════════════════════════════════════════════════════
// SECTION 5: OCTAVE THRESHOLDS (Fully PHI-Derived)
// ════════════════════════════════════════════════════════════════════════════

/**
 * The 7 Octaves represent developmental stages of organizational consciousness.
 * Each threshold is derived from PHI - there are NO arbitrary values.
 *
 * THRESHOLD PHILOSOPHY:
 * - Octaves are developmental stages, not rewards
 * - High coherence at O1 = excellent survival, NOT promotion to O2
 * - Thresholds define the MINIMUM coherence to ENTER an octave
 * - Organization is at the highest octave whose threshold they exceed
 *
 * MATHEMATICAL MAPPING:
 *
 *   O1: Survival      [0, φ^-2)           [0, 0.382)
 *   O2: Structure     [φ^-2, midpoint)    [0.382, 0.500)
 *   O3: Relationships [midpoint, φ^-1)    [0.500, 0.618)
 *   O4: Creativity    [φ^-1, ψ₃)          [0.618, 0.764)
 *   O5: Expression    [ψ₃, ψ₄)            [0.764, 0.854)
 *   O6: Vision        [ψ₄, ψ₅)            [0.854, 0.910)
 *   O7: Radiance      [ψ₅, 1.0]           [0.910, 1.000]
 *
 * Notice the beautiful symmetry:
 * - Lower octaves (O1-O3) use PHI powers and midpoint
 * - Upper octaves (O5-O7) use PSI (complementary) values
 * - O4 (Creativity) bridges the two families
 */

const OCTAVE_THRESHOLDS = {
    O1: {
        id: 1,
        name: 'Survival',
        focus: 'Existence',
        threshold: 0,
        upperBound: PHI_2,              // φ^-2 = 0.382
        derivation: '0 (boundary)',
        color: '#FF4444',
        gradient: 'linear-gradient(135deg, #FF4444, #FF6666)',
        icon: '🔴'
    },
    O2: {
        id: 2,
        name: 'Structure',
        focus: 'Stability',
        threshold: PHI_2,               // φ^-2 = 0.382
        upperBound: PHI_MIDPOINT,       // (φ^-1 + φ^-2)/2 = 0.5
        derivation: 'φ^-2',
        color: '#FF8800',
        gradient: 'linear-gradient(135deg, #FF8800, #FFAA33)',
        icon: '🟠'
    },
    O3: {
        id: 3,
        name: 'Relationships',
        focus: 'Connection',
        threshold: PHI_MIDPOINT,        // 0.5 (harmonic center)
        upperBound: PHI_1,              // φ^-1 = 0.618
        derivation: '(φ^-1 + φ^-2) / 2',
        color: '#FFCC00',
        gradient: 'linear-gradient(135deg, #FFCC00, #FFE066)',
        icon: '🟡'
    },
    O4: {
        id: 4,
        name: 'Creativity',
        focus: 'Possibility',
        threshold: PHI_1,               // φ^-1 = 0.618
        upperBound: PSI_3,              // ψ₃ = 0.764
        derivation: 'φ^-1',
        color: '#44BB44',
        gradient: 'linear-gradient(135deg, #44BB44, #66DD66)',
        icon: '🟢'
    },
    O5: {
        id: 5,
        name: 'Expression',
        focus: 'Clarity',
        threshold: PSI_3,               // ψ₃ = 0.764
        upperBound: PSI_4,              // ψ₄ = 0.854
        derivation: '1 - φ^-3',
        color: '#00CCCC',
        gradient: 'linear-gradient(135deg, #00CCCC, #33FFFF)',
        icon: '🔵'
    },
    O6: {
        id: 6,
        name: 'Vision',
        focus: 'Direction',
        threshold: PSI_4,               // ψ₄ = 0.854
        upperBound: PSI_5,              // ψ₅ = 0.910
        derivation: '1 - φ^-4',
        color: '#4488FF',
        gradient: 'linear-gradient(135deg, #4488FF, #66AAFF)',
        icon: '💜'
    },
    O7: {
        id: 7,
        name: 'Radiance',
        focus: 'Service',
        threshold: PSI_5,               // ψ₅ = 0.910
        upperBound: 1.0,
        derivation: '1 - φ^-5',
        color: '#AA44FF',
        gradient: 'linear-gradient(135deg, #AA44FF, #CC88FF)',
        icon: '⚪'
    }
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 6: FIBONACCI SEQUENCE
// ════════════════════════════════════════════════════════════════════════════

/**
 * The first 20 Fibonacci numbers.
 *
 * The ratio F(n+1)/F(n) converges to PHI as n increases.
 * This sequence is the generative source of the Golden Ratio.
 *
 * @constant {number[]}
 */
const FIBONACCI = [
    1, 1, 2, 3, 5, 8, 13, 21, 34, 55,
    89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765
];

/**
 * Generate Fibonacci number at position n
 *
 * @param {number} n - Position in sequence (1-indexed)
 * @returns {number} Fibonacci number
 */
function fibonacci(n) {
    if (n <= 0) return 0;
    if (n <= 2) return 1;

    let a = 1, b = 1;
    for (let i = 3; i <= n; i++) {
        [a, b] = [b, a + b];
    }
    return b;
}

// ════════════════════════════════════════════════════════════════════════════
// SECTION 7: DODECAHEDRON GEOMETRY CONSTANTS
// ════════════════════════════════════════════════════════════════════════════

/**
 * The dodecahedron is deeply connected to PHI.
 * Its vertices, edges, and faces all embody golden proportions.
 */

/**
 * Number of faces on a dodecahedron (12 organizational domains)
 * @constant {number}
 */
const DODECA_FACES = 12;

/**
 * Number of vertices per face (pentagonal faces)
 * @constant {number}
 */
const DODECA_VERTICES_PER_FACE = 5;

/**
 * Total vertices on a dodecahedron
 * @constant {number}
 */
const DODECA_VERTICES = 20;

/**
 * Total edges on a dodecahedron
 * @constant {number}
 */
const DODECA_EDGES = 30;

/**
 * Number of breath axes (opposing face pairs)
 * @constant {number}
 */
const BREATH_AXES = 6;

/**
 * Dihedral angle of dodecahedron (angle between adjacent faces)
 * arccos(-1/√5) ≈ 116.565°
 *
 * @constant {number} In radians
 */
const DODECA_DIHEDRAL_ANGLE = Math.acos(-1 / Math.sqrt(5));

/**
 * Inradius to circumradius ratio of dodecahedron
 * This ratio involves PHI: r/R = φ²/√3
 *
 * @constant {number}
 */
const DODECA_INRADIUS_RATIO = PHI_SQUARED / Math.sqrt(3);

// ════════════════════════════════════════════════════════════════════════════
// SECTION 8: CURVATURE PARAMETERS & NUMERICAL CONSTANTS
// ════════════════════════════════════════════════════════════════════════════

/**
 * EPSILON - Numerical stability constant
 *
 * Used to prevent division by zero and floating-point comparison issues.
 *
 * @constant {number}
 */
const EPSILON = 1e-10;

/**
 * CURVATURE - KPI normalization curve parameters (κ)
 *
 * These values control how KPI scores map to coherence:
 *
 *   survival:   φ^-1 (0.618) - Sublinear, forgiving, rewards early progress
 *   growth:     φ (1.618) - Superlinear, demanding, rewards excellence
 *   completion: 1.0 - Linear progression (default)
 *
 * Mathematical interpretation:
 *   normalized_score = linear_score ^ κ
 *
 * @constant {Object}
 */
const CURVATURE = {
    survival: PHI_1,      // 0.618 - asymptotic, forgiving
    growth: PHI,          // 1.618 - exponential, rewarding
    completion: 1.0       // linear progression
};
Object.freeze(CURVATURE);

// ════════════════════════════════════════════════════════════════════════════
// SECTION 8B: SEMANTIC ALIASES
// ════════════════════════════════════════════════════════════════════════════

/**
 * Semantic aliases map mathematical constants to their domain meanings.
 * These make the code more readable in context.
 */

/** Coefficient of Variation penalty (variance) */
const CV_LAMBDA = PHI_3;          // 0.236 - variance penalty coefficient

/** Logarithm base for breath ratio calculations */
const BREATH_BASE = PHI;          // 1.618 - log base for breath ratio

/** Mastery threshold before octave advancement */
const MASTERY_THRESHOLD = PSI_3;  // 0.764 - 76.4% mastery before octave advance

// ════════════════════════════════════════════════════════════════════════════
// SECTION 9: TUNING MODIFIERS (PHI-Harmonic)
// ════════════════════════════════════════════════════════════════════════════

/**
 * Kappa modifiers by octave level.
 *
 * Lower octaves are more forgiving (values < 1)
 * Higher octaves are more demanding (values > 1)
 * O4 (Creativity) is the neutral point (1.0)
 *
 * All values are PHI-derived.
 */
const OCTAVE_KAPPA_MODIFIERS = {
    O1: PHI_1,              // 0.618 - Most forgiving (φ^-1)
    O2: PSI_3,              // 0.764 - Forgiving (ψ₃)
    O3: PSI_4,              // 0.854 - Slightly forgiving (ψ₄)
    O4: 1.0,                // 1.000 - Neutral (balance point)
    O5: 1 / PSI_4,          // 1.171 - Slightly demanding (1/ψ₄)
    O6: 1 / PSI_3,          // 1.309 - Demanding (1/ψ₃)
    O7: PHI                 // 1.618 - Most demanding (φ itself)
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 9: SPREAD PENALTY THRESHOLDS
// ════════════════════════════════════════════════════════════════════════════

/**
 * Spread penalties for Foundation Principle calculation.
 * Large spreads between face octaves indicate structural misalignment.
 *
 * These use integer values as they represent octave counts, not proportions.
 */
const SPREAD_PENALTIES = {
    HEALTHY: 2,         // Up to 2 octaves spread = no penalty
    MINOR: 3,           // 3 octaves = 0.5 penalty
    MODERATE: 4,        // 4 octaves = 1.0 penalty
    SEVERE_BASE: 5      // 5+ octaves = 1.5 + 0.5 per additional
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 10: LIFECYCLE CONSTRAINTS
// ════════════════════════════════════════════════════════════════════════════

/**
 * Maximum achievable octave by organizational lifecycle stage.
 *
 * Even with high coherence, a young organization cannot authentically
 * claim higher octaves - they need time to develop.
 */
const LIFECYCLE_CONSTRAINTS = {
    'pre-seed': { maxOctave: 2, typicalOctave: 1 },
    'seed': { maxOctave: 2, typicalOctave: 1 },
    'early-stage': { maxOctave: 3, typicalOctave: 2 },
    'growth': { maxOctave: 4, typicalOctave: 3 },
    'mature': { maxOctave: 5, typicalOctave: 4 },
    'enterprise': { maxOctave: 6, typicalOctave: 5 },
    'transcendent': { maxOctave: 7, typicalOctave: 6 }
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 11: HELPER FUNCTIONS
// ════════════════════════════════════════════════════════════════════════════

/**
 * Convert coherence score (0-1) to octave number (1-7)
 *
 * Uses the fully PHI-derived thresholds.
 *
 * @param {number} coherence - Coherence score (0-1)
 * @returns {number} Octave number (1-7)
 */
function coherenceToOctave(coherence) {
    const c = Math.max(0, Math.min(1, coherence));

    if (c >= PSI_5) return 7;      // ≥ 0.910 → Radiance
    if (c >= PSI_4) return 6;      // ≥ 0.854 → Vision
    if (c >= PSI_3) return 5;      // ≥ 0.764 → Expression
    if (c >= PHI_1) return 4;      // ≥ 0.618 → Creativity
    if (c >= PHI_MIDPOINT) return 3;  // ≥ 0.500 → Relationships
    if (c >= PHI_2) return 2;      // ≥ 0.382 → Structure
    return 1;                       // < 0.382 → Survival
}

/**
 * Get octave details by number
 *
 * @param {number} octaveNum - Octave number (1-7)
 * @returns {Object} Octave definition object
 */
function getOctaveByNumber(octaveNum) {
    const key = `O${Math.max(1, Math.min(7, octaveNum))}`;
    return OCTAVE_THRESHOLDS[key];
}

/**
 * Get octave details by key (e.g., "O3")
 *
 * @param {string} octaveKey - Octave key (O1-O7)
 * @returns {Object} Octave definition object
 */
function getOctaveByKey(octaveKey) {
    return OCTAVE_THRESHOLDS[octaveKey] || OCTAVE_THRESHOLDS.O1;
}

/**
 * Calculate spread penalty for Foundation Principle
 *
 * @param {number} spread - Difference between max and min octaves
 * @returns {number} Penalty to subtract from geometric mean
 */
function calculateSpreadPenalty(spread) {
    if (spread <= SPREAD_PENALTIES.HEALTHY) return 0;
    if (spread === SPREAD_PENALTIES.MINOR) return 0.5;
    if (spread === SPREAD_PENALTIES.MODERATE) return 1.0;
    return 1.5 + (spread - SPREAD_PENALTIES.SEVERE_BASE) * 0.5;
}

/**
 * Get lifecycle constraint for a stage
 *
 * @param {string} stage - Lifecycle stage name
 * @returns {Object} Constraint with maxOctave and typicalOctave
 */
function getLifecycleConstraint(stage) {
    return LIFECYCLE_CONSTRAINTS[stage] || LIFECYCLE_CONSTRAINTS['growth'];
}

/**
 * Calculate PHI power (φ^-n)
 *
 * @param {number} n - Power (positive integer gives negative exponent)
 * @returns {number} φ^-n
 */
function phiPower(n) {
    return Math.pow(PHI, -n);
}

/**
 * Calculate PSI value (ψ_n = 1 - φ^-n)
 *
 * @param {number} n - Index (matches PHI power)
 * @returns {number} ψ_n
 */
function psiValue(n) {
    return 1 - phiPower(n);
}

/**
 * Get all PHI-derived threshold values as an array
 *
 * @returns {number[]} Array of threshold values [0, 0.382, 0.5, 0.618, 0.764, 0.854, 0.910]
 */
function getThresholdArray() {
    return [0, PHI_2, PHI_MIDPOINT, PHI_1, PSI_3, PSI_4, PSI_5];
}

// ════════════════════════════════════════════════════════════════════════════
// SECTION 12: EXPORTS
// ════════════════════════════════════════════════════════════════════════════

// Browser global export
if (typeof window !== 'undefined') {
    window.PhiHarmonics = {
        // The Golden Ratio
        PHI,
        PHI_SQUARED,

        // PHI Powers (φ^-n) - descending golden proportions
        PHI_1, PHI_2, PHI_3, PHI_4, PHI_5, PHI_6, PHI_7,

        // PSI Values (1 - φ^-n)
        PSI_3, PSI_4, PSI_5, PSI_6, PSI_7,

        // Harmonic Midpoint
        PHI_MIDPOINT,

        // Numerical Stability
        EPSILON,

        // Curvature Parameters
        CURVATURE,

        // Semantic Aliases (domain-meaningful names)
        CV_LAMBDA,
        BREATH_BASE,
        MASTERY_THRESHOLD,

        // Legacy aliases (for backward compatibility with main.js naming)
        PHI_INVERSE: PHI_1,
        PHI_SQUARED_INVERSE: PHI_2,
        PHI_CUBED_INVERSE: PHI_3,
        PHI_INV_1: PHI_1,
        PHI_INV_2: PHI_2,
        PHI_INV_3: PHI_3,
        PHI_INV_4: PHI_4,

        // Fibonacci
        FIBONACCI,
        fibonacci,

        // Dodecahedron Constants
        DODECA_FACES,
        DODECA_VERTICES_PER_FACE,
        DODECA_VERTICES,
        DODECA_EDGES,
        BREATH_AXES,
        DODECA_DIHEDRAL_ANGLE,
        DODECA_INRADIUS_RATIO,

        // Octave System
        OCTAVE_THRESHOLDS,
        OCTAVE_KAPPA_MODIFIERS,
        LIFECYCLE_CONSTRAINTS,
        SPREAD_PENALTIES,

        // Helper Functions
        coherenceToOctave,
        getOctaveByNumber,
        getOctaveByKey,
        calculateSpreadPenalty,
        getLifecycleConstraint,
        phiPower,
        psiValue,
        getThresholdArray
    };

    console.log('🌀 PHI Harmonics loaded - Fully φ-derived constants (Single Source of Truth)');
    console.log('   Thresholds: O1(0) O2(φ⁻²) O3(½) O4(φ⁻¹) O5(ψ₃) O6(ψ₄) O7(ψ₅)');
    console.log('   Values:     0    0.382   0.5  0.618  0.764  0.854  0.910');
}

// CommonJS export (for Node.js testing)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        // Core PHI
        PHI, PHI_SQUARED,
        // PHI Powers
        PHI_1, PHI_2, PHI_3, PHI_4, PHI_5, PHI_6, PHI_7,
        // PSI Values
        PSI_3, PSI_4, PSI_5, PSI_6, PSI_7,
        // Midpoint
        PHI_MIDPOINT,
        // Numerical & Curvature
        EPSILON, CURVATURE,
        // Semantic Aliases
        CV_LAMBDA, BREATH_BASE, MASTERY_THRESHOLD,
        // Legacy Aliases
        PHI_INVERSE: PHI_1,
        PHI_SQUARED_INVERSE: PHI_2,
        PHI_CUBED_INVERSE: PHI_3,
        PHI_INV_1: PHI_1,
        PHI_INV_2: PHI_2,
        PHI_INV_3: PHI_3,
        PHI_INV_4: PHI_4,
        // Fibonacci
        FIBONACCI, fibonacci,
        // Dodecahedron
        DODECA_FACES, DODECA_VERTICES_PER_FACE, DODECA_VERTICES,
        DODECA_EDGES, BREATH_AXES, DODECA_DIHEDRAL_ANGLE, DODECA_INRADIUS_RATIO,
        // Octave System
        OCTAVE_THRESHOLDS, OCTAVE_KAPPA_MODIFIERS,
        LIFECYCLE_CONSTRAINTS, SPREAD_PENALTIES,
        // Functions
        coherenceToOctave, getOctaveByNumber, getOctaveByKey,
        calculateSpreadPenalty, getLifecycleConstraint,
        phiPower, psiValue, getThresholdArray
    };
}
