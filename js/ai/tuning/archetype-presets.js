/**
 * ========================================
 * ARCHETYPE TUNING PRESETS - PHI-Only Constants
 * ========================================
 *
 * Defines tuning presets for the 5 organizational archetypes.
 * ALL VALUES ARE PHI-DERIVED per project constraint.
 *
 * Available PHI-derived values:
 * - phi^-4 = 0.146 (Minimal threshold)
 * - phi^-3 = 0.236 (Variance penalty lambda)
 * - phi^-2 = 0.382 (Low/receptive)
 * - phi^-1 = 0.618 (High/creative, Golden ratio)
 * - PHI_HIGH = 0.764 (1 - phi^-3, mastery threshold)
 * - PHI_MASTERY = 0.854 (phi^-1 + phi^-3, near maximum)
 *
 * The 5 Tuning Parameters:
 * - ALPHA: Geometric weight (vertex/face balance)
 * - BETA: Social cohesion factor (relationship strength)
 * - GAMMA: Spectral bandwidth (variance tolerance)
 * - DELTA: Shadow weight (penalty for imbalances)
 * - KAPPA: Curvature constant (adaptive tolerance)
 *
 * @module ArchetypePresets
 * @version Sprint 2 - Task 20
 */

// PHI-DERIVED CONSTANTS (Sacred Geometry Foundation)
const PHI = {
    NEG_4: 0.146,    // phi^-4 - Minimal
    NEG_3: 0.236,    // phi^-3 - Low
    NEG_2: 0.382,    // phi^-2 - Moderate-Low
    NEG_1: 0.618,    // phi^-1 - Golden Ratio
    HIGH: 0.764,     // 1 - phi^-3 - High (additive PHI harmonic)
    MASTERY: 0.854   // phi^-1 + phi^-3 - Very High (additive PHI harmonic)
};

/**
 * LIFECYCLE ARCHETYPE PRESETS (From Master Plan)
 *
 * These represent organizational lifecycle stages with specific PHI-derived
 * tuning constants. These are the CANONICAL presets from the master plan.
 *
 * Per Master Plan specification:
 * - startup: { α: 0.764, β: 0.618, γ: 0.382, δ: 0.854, κ: 0.382 }
 * - scaleUp: { α: 0.618, β: 0.618, γ: 0.618, δ: 0.764, κ: 0.618 }
 * - enterprise: { α: 0.382, β: 0.382, γ: 0.764, δ: 0.382, κ: 0.618 }
 * - nonprofit: { α: 0.618, β: 0.764, γ: 0.618, δ: 0.618, κ: 0.764 }
 * - family: { α: 0.854, β: 0.618, γ: 0.236, δ: 0.236, κ: 0.854 }
 */
const LIFECYCLE_PRESETS = {
    /**
     * STARTUP - Pre-seed to seed stage
     * Octave: O1-O2 (Survival → Structure)
     * Tight coupling, volatile, fast change
     */
    startup: {
        ALPHA: PHI.HIGH,      // 0.764 (Ψ³) - Tight coupling (small team synergy)
        BETA: PHI.NEG_1,      // 0.618 (φ⁻¹) - Creative resonance
        GAMMA: PHI.NEG_2,     // 0.382 (φ⁻²) - Slow damping (volatile, emotional)
        DELTA: PHI.MASTERY,   // 0.854 (Ψ⁴) - Very fast change (pivot quickly)
        KAPPA: PHI.NEG_2,     // 0.382 (φ⁻²) - Local entanglement (intimate)

        // Metadata
        stage: 'O1-O2',
        description: 'Pre-seed/Seed: Survival mode, tight team, fast pivots',
        emphasis: 'agility-intimacy'
    },

    /**
     * SCALE-UP - Seed to Series A
     * Octave: O2-O3 (Structure → Relationships)
     * Growing, systematizing, moderate everything
     */
    scaleUp: {
        ALPHA: PHI.NEG_1,     // 0.618 (φ⁻¹) - Moderate coupling
        BETA: PHI.NEG_1,      // 0.618 (φ⁻¹) - Moderate resonance
        GAMMA: PHI.NEG_1,     // 0.618 (φ⁻¹) - Moderate damping
        DELTA: PHI.HIGH,      // 0.764 (Ψ³) - Fast change (still agile)
        KAPPA: PHI.NEG_1,     // 0.618 (φ⁻¹) - Growing network

        stage: 'O2-O3',
        description: 'Scale-up: Systematizing growth, building structure',
        emphasis: 'balanced-growth'
    },

    /**
     * ENTERPRISE - Mature organization
     * Octave: O4-O5 (Creativity → Expression)
     * Loose coupling, bureaucratic, slow change
     */
    enterprise: {
        ALPHA: PHI.NEG_2,     // 0.382 (φ⁻²) - Loose coupling (silos)
        BETA: PHI.NEG_2,      // 0.382 (φ⁻²) - Low resonance (bureaucratic)
        GAMMA: PHI.HIGH,      // 0.764 (Ψ³) - Fast damping (stable, risk-averse)
        DELTA: PHI.NEG_2,     // 0.382 (φ⁻²) - Slow change (inertia)
        KAPPA: PHI.NEG_1,     // 0.618 (φ⁻¹) - Moderate network

        stage: 'O4-O5',
        description: 'Enterprise: Established systems, optimizing efficiency',
        emphasis: 'stability-efficiency'
    },

    /**
     * NON-PROFIT - Mission-driven organization
     * Octave: O3-O4 (Relationships → Creativity)
     * Values-driven, networked, coalition-based
     */
    nonprofit: {
        ALPHA: PHI.NEG_1,     // 0.618 (φ⁻¹) - Moderate coupling
        BETA: PHI.HIGH,       // 0.764 (Ψ³) - High resonance (values-driven)
        GAMMA: PHI.NEG_1,     // 0.618 (φ⁻¹) - Moderate damping
        DELTA: PHI.NEG_1,     // 0.618 (φ⁻¹) - Moderate change
        KAPPA: PHI.HIGH,      // 0.764 (Ψ³) - Networked (coalition-based)

        stage: 'O3-O4',
        description: 'Non-profit: Mission-driven, stakeholder-focused',
        emphasis: 'mission-alignment'
    },

    /**
     * FAMILY - Family-owned business
     * Octave: O5-O6 (Expression → Vision)
     * Very tight coupling, tradition, deep history
     */
    family: {
        ALPHA: PHI.MASTERY,   // 0.854 (Ψ⁴) - Very tight coupling (personal)
        BETA: PHI.NEG_1,      // 0.618 (φ⁻¹) - Moderate resonance
        GAMMA: PHI.NEG_3,     // 0.236 (φ⁻³) - Very slow damping (grudges linger)
        DELTA: PHI.NEG_3,     // 0.236 (φ⁻³) - Very slow change (tradition)
        KAPPA: PHI.MASTERY,   // 0.854 (Ψ⁴) - Deep entanglement (generations)

        stage: 'O5-O6',
        description: 'Family: Generational, tradition-bound, deeply personal',
        emphasis: 'legacy-continuity'
    }
};

/**
 * BEHAVIORAL ARCHETYPE PRESETS
 *
 * Each archetype has a unique tuning signature that emphasizes
 * different aspects of organizational coherence.
 * These represent organizational personalities/styles.
 */
const ARCHETYPE_PRESETS = {
    /**
     * THE BUILDER
     * Emphasizes: Structure, execution, tangible outcomes
     * Tuning: High GAMMA/DELTA for structural integrity
     */
    Builder: {
        ALPHA: PHI.NEG_1,  // 0.618 - Balanced vertex weight
        BETA: PHI.NEG_2,   // 0.382 - Lower social emphasis (structure over relationships)
        GAMMA: PHI.HIGH,  // 0.764 - High bandwidth (tolerates variation in building)
        DELTA: PHI.MASTERY,  // 0.854 - High shadow sensitivity (catches structural flaws)
        KAPPA: PHI.NEG_1,  // 0.618 - Standard curvature

        // Metadata
        emphasis: 'structural-integrity',
        description: 'Optimized for building reliable systems with high flaw detection'
    },

    /**
     * THE NURTURER
     * Emphasizes: Relationships, sustainable growth, team care
     * Tuning: High BETA for social cohesion
     */
    Nurturer: {
        ALPHA: PHI.NEG_2,  // 0.382 - Lower vertex emphasis (faces over convergence)
        BETA: PHI.NEG_1,   // 0.618 - High social cohesion
        GAMMA: PHI.NEG_1,  // 0.618 - Moderate bandwidth (flexible but bounded)
        DELTA: PHI.HIGH,  // 0.764 - High but not extreme shadow sensitivity
        KAPPA: PHI.NEG_2,  // 0.382 - Gentler curvature (forgiving)

        emphasis: 'relational-harmony',
        description: 'Optimized for team development and sustainable culture'
    },

    /**
     * THE INNOVATOR
     * Emphasizes: Creativity, experimentation, disruption
     * Tuning: High ALPHA/KAPPA for creative curvature
     */
    Innovator: {
        ALPHA: PHI.HIGH,  // 0.764 - High vertex emphasis (values emergence)
        BETA: PHI.NEG_1,   // 0.618 - Balanced social (needs collaboration for innovation)
        GAMMA: PHI.NEG_1,  // 0.618 - Moderate bandwidth (some chaos is good)
        DELTA: PHI.NEG_1,  // 0.618 - Moderate shadow (doesn't over-punish experiments)
        KAPPA: PHI.HIGH,  // 0.764 - High curvature (embraces non-linearity)

        emphasis: 'creative-emergence',
        description: 'Optimized for breakthrough innovation and experimentation'
    },

    /**
     * THE GUARDIAN
     * Emphasizes: Protection, preservation, stability
     * Tuning: High GAMMA/DELTA for defensive stability
     */
    Guardian: {
        ALPHA: PHI.NEG_2,  // 0.382 - Lower vertex (focuses on known quantities)
        BETA: PHI.NEG_2,   // 0.382 - Moderate social (trusted networks only)
        GAMMA: PHI.MASTERY,  // 0.854 - Very high bandwidth (catches all anomalies)
        DELTA: PHI.MASTERY,  // 0.854 - Very high shadow (zero tolerance for risks)
        KAPPA: PHI.NEG_3,  // 0.236 - Low curvature (conservative, predictable)

        emphasis: 'defensive-stability',
        description: 'Optimized for risk management and asset protection'
    },

    /**
     * THE CONNECTOR
     * Emphasizes: Ecosystems, partnerships, integration
     * Tuning: High BETA for network resonance
     */
    Connector: {
        ALPHA: PHI.NEG_1,  // 0.618 - Balanced vertex (values synergies)
        BETA: PHI.HIGH,   // 0.764 - Very high social cohesion
        GAMMA: PHI.NEG_2,  // 0.382 - Lower bandwidth (selective about connections)
        DELTA: PHI.NEG_1,  // 0.618 - Moderate shadow (aware but not paranoid)
        KAPPA: PHI.NEG_1,  // 0.618 - Standard curvature (adaptive)

        emphasis: 'network-resonance',
        description: 'Optimized for partnership development and ecosystem building'
    }
};

/**
 * Get tuning preset for an archetype
 * @param {string} archetypeId - Archetype identifier
 * @returns {Object|null} Tuning constants or null if not found
 */
function getArchetypePreset(archetypeId) {
    return ARCHETYPE_PRESETS[archetypeId] || null;
}

/**
 * Get all preset values as a comparison table
 * @returns {Object} Comparison data
 */
function getPresetComparison() {
    const parameters = ['ALPHA', 'BETA', 'GAMMA', 'DELTA', 'KAPPA'];
    const comparison = {};

    parameters.forEach(param => {
        comparison[param] = {};
        Object.keys(ARCHETYPE_PRESETS).forEach(archetype => {
            comparison[param][archetype] = ARCHETYPE_PRESETS[archetype][param];
        });
    });

    return comparison;
}

/**
 * Get the dominant parameter for an archetype
 * @param {string} archetypeId - Archetype identifier
 * @returns {Object|null} Dominant parameter info
 */
function getDominantParameter(archetypeId) {
    const preset = ARCHETYPE_PRESETS[archetypeId];
    if (!preset) return null;

    const params = ['ALPHA', 'BETA', 'GAMMA', 'DELTA', 'KAPPA'];
    let dominant = { name: null, value: 0 };

    params.forEach(param => {
        if (preset[param] > dominant.value) {
            dominant = { name: param, value: preset[param] };
        }
    });

    return dominant;
}

/**
 * Validate that all presets use only PHI-derived values
 * @returns {Object} Validation result
 */
function validatePresets() {
    const validValues = Object.values(PHI);
    const issues = [];

    Object.entries(ARCHETYPE_PRESETS).forEach(([archetype, preset]) => {
        ['ALPHA', 'BETA', 'GAMMA', 'DELTA', 'KAPPA'].forEach(param => {
            const value = preset[param];
            if (!validValues.includes(value)) {
                issues.push({
                    archetype,
                    param,
                    value,
                    message: `Value ${value} is not a PHI-derived constant`
                });
            }
        });
    });

    return {
        valid: issues.length === 0,
        issues
    };
}

/**
 * Create a blended preset from multiple archetypes
 * @param {Object} weights - Archetype weights (e.g., { Builder: 0.6, Guardian: 0.4 })
 * @returns {Object} Blended preset
 */
function createBlendedPreset(weights) {
    const params = ['ALPHA', 'BETA', 'GAMMA', 'DELTA', 'KAPPA'];
    const blended = {};

    // Normalize weights
    const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
    const normalizedWeights = {};
    Object.entries(weights).forEach(([arch, weight]) => {
        normalizedWeights[arch] = weight / totalWeight;
    });

    // Calculate blended values
    params.forEach(param => {
        let value = 0;
        Object.entries(normalizedWeights).forEach(([archetype, weight]) => {
            if (ARCHETYPE_PRESETS[archetype]) {
                value += ARCHETYPE_PRESETS[archetype][param] * weight;
            }
        });

        // Snap to nearest PHI value
        blended[param] = snapToPhiValue(value);
    });

    blended.isBlended = true;
    blended.sourceWeights = weights;

    return blended;
}

/**
 * Snap a value to the nearest PHI-derived constant
 * @param {number} value - Value to snap
 * @returns {number} Nearest PHI value
 */
function snapToPhiValue(value) {
    const phiValues = Object.values(PHI).sort((a, b) => a - b);
    let closest = phiValues[0];
    let minDiff = Math.abs(value - closest);

    phiValues.forEach(phi => {
        const diff = Math.abs(value - phi);
        if (diff < minDiff) {
            minDiff = diff;
            closest = phi;
        }
    });

    return closest;
}

/**
 * Get lifecycle preset for an organizational stage
 * @param {string} lifecycleId - Lifecycle identifier (startup, scaleUp, enterprise, nonprofit, family)
 * @returns {Object|null} Tuning constants or null if not found
 */
function getLifecyclePreset(lifecycleId) {
    return LIFECYCLE_PRESETS[lifecycleId] || null;
}

/**
 * Get all lifecycle presets for UI rendering
 * @returns {Array} Array of lifecycle preset objects with metadata
 */
function getAllLifecyclePresets() {
    return Object.entries(LIFECYCLE_PRESETS).map(([id, preset]) => ({
        id,
        name: id.charAt(0).toUpperCase() + id.slice(1).replace(/([A-Z])/g, ' $1'),
        ...preset
    }));
}

/**
 * Combined preset getter (checks both behavioral and lifecycle)
 * @param {string} presetId - Preset identifier
 * @returns {Object|null} Tuning constants or null if not found
 */
function getPreset(presetId) {
    return ARCHETYPE_PRESETS[presetId] || LIFECYCLE_PRESETS[presetId] || null;
}

// ========================================
// EXPORTS
// ========================================

export {
    ARCHETYPE_PRESETS,
    LIFECYCLE_PRESETS,
    PHI,
    getArchetypePreset,
    getLifecyclePreset,
    getAllLifecyclePresets,
    getPreset,
    getPresetComparison,
    getDominantParameter,
    validatePresets,
    createBlendedPreset,
    snapToPhiValue
};

// Export for browser global
if (typeof window !== 'undefined') {
    window.ARCHETYPE_PRESETS = ARCHETYPE_PRESETS;
    window.LIFECYCLE_PRESETS = LIFECYCLE_PRESETS;
    window.PHI_CONSTANTS = PHI;
}
