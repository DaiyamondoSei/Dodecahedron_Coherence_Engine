/**
 * ========================================
 * UNIFIED OCTAVE THRESHOLDS
 * ========================================
 *
 * SINGLE SOURCE OF TRUTH for all Octave-related calculations.
 *
 * This file defines the PHI-based thresholds used throughout the system:
 * - OctaveIntegrityCalculator (Foundation Principle)
 * - OctaveDeterminer (AI/fallback octave assignment)
 * - Demo Orchestrator (UI display)
 * - Breath Analyzer (balanced zone thresholds)
 *
 * ========================================
 * PHI MATHEMATICS (Golden Ratio)
 * ========================================
 *
 * PHI (φ) = 1.618033988749895
 * PHI_INVERSE (φ^-1) = 0.618033988749895
 * PHI_SQUARED_INVERSE (φ^-2) = 0.381966011250105
 *
 * These create meaningful boundaries that appear in nature, art, and music.
 * The octave thresholds follow PHI-harmonic relationships.
 *
 * ========================================
 * THRESHOLD PHILOSOPHY
 * ========================================
 *
 * Octaves represent developmental stages, not rewards:
 * - High coherence at O1 = excellent survival, NOT promotion to O2
 * - Thresholds define the MINIMUM coherence to ENTER an octave
 * - Organization is at the highest octave whose threshold they exceed
 *
 * ========================================
 */

// ========================================
// PHI CONSTANTS (Golden Ratio)
// ========================================

const PHI = 1.618033988749895;
const PHI_INVERSE = 0.618033988749895;              // φ^-1
const PHI_SQUARED_INVERSE = 0.381966011250105;      // φ^-2
const PHI_CUBED_INVERSE = 0.2360679774997896;       // φ^-3

// ========================================
// OCTAVE THRESHOLDS
// ========================================

/**
 * Unified octave thresholds using PHI-harmonic boundaries
 *
 * Coherence → Octave mapping:
 * - coherence < 0.382 → O1 (Survival)
 * - coherence >= 0.382 && < 0.5 → O2 (Structure)
 * - coherence >= 0.5 && < 0.618 → O3 (Relationships)
 * - coherence >= 0.618 && < 0.764 → O4 (Creativity)
 * - coherence >= 0.764 && < 0.854 → O5 (Expression)
 * - coherence >= 0.854 && < 0.95 → O6 (Vision)
 * - coherence >= 0.95 → O7 (Radiance)
 */
const OCTAVE_THRESHOLDS = {
    O1: {
        id: 1,
        name: 'Survival',
        focus: 'Existence',
        threshold: 0,
        upperBound: PHI_SQUARED_INVERSE,  // 0.382
        color: '#FF4444',
        gradient: 'linear-gradient(135deg, #FF4444, #FF6666)',
        icon: '🔴'
    },
    O2: {
        id: 2,
        name: 'Structure',
        focus: 'Stability',
        threshold: PHI_SQUARED_INVERSE,   // 0.382
        upperBound: 0.5,
        color: '#FF8800',
        gradient: 'linear-gradient(135deg, #FF8800, #FFAA33)',
        icon: '🟠'
    },
    O3: {
        id: 3,
        name: 'Relationships',
        focus: 'Connection',
        threshold: 0.5,
        upperBound: PHI_INVERSE,          // 0.618
        color: '#FFCC00',
        gradient: 'linear-gradient(135deg, #FFCC00, #FFE066)',
        icon: '🟡'
    },
    O4: {
        id: 4,
        name: 'Creativity',
        focus: 'Possibility',
        threshold: PHI_INVERSE,            // 0.618
        upperBound: 0.764,
        color: '#44BB44',
        gradient: 'linear-gradient(135deg, #44BB44, #66DD66)',
        icon: '🟢'
    },
    O5: {
        id: 5,
        name: 'Expression',
        focus: 'Clarity',
        threshold: 0.764,
        upperBound: 0.854,
        color: '#00CCCC',
        gradient: 'linear-gradient(135deg, #00CCCC, #33FFFF)',
        icon: '🔵'
    },
    O6: {
        id: 6,
        name: 'Vision',
        focus: 'Direction',
        threshold: 0.854,
        upperBound: 0.95,
        color: '#4488FF',
        gradient: 'linear-gradient(135deg, #4488FF, #66AAFF)',
        icon: '💜'
    },
    O7: {
        id: 7,
        name: 'Radiance',
        focus: 'Service',
        threshold: 0.95,
        upperBound: 1.0,
        color: '#AA44FF',
        gradient: 'linear-gradient(135deg, #AA44FF, #CC88FF)',
        icon: '⚪'
    }
};

// ========================================
// LIFECYCLE CONSTRAINTS
// ========================================

/**
 * Maximum achievable octave by organizational lifecycle stage.
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

// ========================================
// OCTAVE MODIFIERS (Tuning)
// ========================================

/**
 * Kappa modifiers by octave level.
 * Lower octaves are more forgiving, higher octaves more demanding.
 * These are PHI-harmonic values.
 */
const OCTAVE_KAPPA_MODIFIERS = {
    O1: PHI_INVERSE,              // 0.618 - Very forgiving
    O2: 0.764,                    // Forgiving
    O3: 0.854,                    // Slightly forgiving
    O4: 1.0,                      // Balanced (neutral)
    O5: 1.0 / 0.854,              // 1.171 - Slightly demanding
    O6: 1.0 / 0.764,              // 1.309 - Demanding
    O7: PHI - 0.236               // 1.382 - Most demanding
};

// ========================================
// SPREAD PENALTY THRESHOLDS
// ========================================

/**
 * Spread penalties for Foundation Principle calculation.
 * Large spreads between face octaves indicate structural misalignment.
 */
const SPREAD_PENALTIES = {
    HEALTHY: 2,         // Up to 2 octaves spread = no penalty
    MINOR: 3,           // 3 octaves = 0.5 penalty
    MODERATE: 4,        // 4 octaves = 1.0 penalty
    SEVERE_BASE: 5      // 5+ octaves = 1.5 + 0.5 per additional
};

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Convert coherence score (0-1) to octave number (1-7)
 *
 * @param {number} coherence - Coherence score (0-1)
 * @returns {number} Octave number (1-7)
 */
function coherenceToOctave(coherence) {
    const c = Math.max(0, Math.min(1, coherence));

    if (c >= 0.95) return 7;
    if (c >= 0.854) return 6;
    if (c >= 0.764) return 5;
    if (c >= PHI_INVERSE) return 4;
    if (c >= 0.5) return 3;
    if (c >= PHI_SQUARED_INVERSE) return 2;
    return 1;
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

// ========================================
// EXPORTS
// ========================================

// Browser global export
if (typeof window !== 'undefined') {
    window.OctaveThresholds = {
        // Constants
        PHI,
        PHI_INVERSE,
        PHI_SQUARED_INVERSE,
        PHI_CUBED_INVERSE,

        // Definitions
        OCTAVE_THRESHOLDS,
        LIFECYCLE_CONSTRAINTS,
        OCTAVE_KAPPA_MODIFIERS,
        SPREAD_PENALTIES,

        // Helper functions
        coherenceToOctave,
        getOctaveByNumber,
        getOctaveByKey,
        calculateSpreadPenalty,
        getLifecycleConstraint
    };

    console.log('🎵 Unified Octave Thresholds loaded');
    console.log('   PHI thresholds: O1(<0.382) O2(0.382) O3(0.5) O4(0.618) O5(0.764) O6(0.854) O7(0.95)');
}

// CommonJS export (for Node.js testing)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PHI,
        PHI_INVERSE,
        PHI_SQUARED_INVERSE,
        PHI_CUBED_INVERSE,
        OCTAVE_THRESHOLDS,
        LIFECYCLE_CONSTRAINTS,
        OCTAVE_KAPPA_MODIFIERS,
        SPREAD_PENALTIES,
        coherenceToOctave,
        getOctaveByNumber,
        getOctaveByKey,
        calculateSpreadPenalty,
        getLifecycleConstraint
    };
}
