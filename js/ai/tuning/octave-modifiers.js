/**
 * ========================================
 * OCTAVE MODIFIERS - Adaptive Constants
 * ========================================
 *
 * Implements developmentally adaptive tuning constants.
 * Lower octaves = more forgiving (survival mode)
 * Higher octaves = more demanding (excellence mode)
 *
 * The philosophy:
 * An O1 (Survival) organization shouldn't be judged by O7 (Radiance) standards.
 * The system adapts its expectations to meet organizations where they are.
 *
 * @module OctaveModifiers
 * @version Sprint 2 - Task 21
 */

import { PHI } from './archetype-presets.js';

/**
 * OCTAVE KAPPA MODIFIERS
 *
 * KAPPA controls curvature tolerance - how much non-linearity is acceptable.
 * Lower octaves get more forgiving KAPPA (lower values = wider tolerance)
 * Higher octaves get stricter KAPPA (higher values = tighter standards)
 *
 * Modifier is multiplied with base KAPPA from archetype preset.
 */
const OCTAVE_KAPPA_MODIFIERS = {
    O1: 0.618,  // Very forgiving - survival focus
    O2: 0.764,  // Forgiving - building foundation
    O3: 0.854,  // Slightly forgiving - developing relationships
    O4: 1.0,    // Balanced - established creativity
    O5: 1.146,  // Slightly demanding - expressing value
    O6: 1.236,  // Demanding - strategic vision
    O7: 1.382   // Most demanding - industry leadership (PHI itself as multiplier)
};

/**
 * OCTAVE DELTA MODIFIERS
 *
 * DELTA controls shadow sensitivity - how much imbalances are penalized.
 * Lower octaves get gentler DELTA (less penalty for shadows)
 * Higher octaves get stricter DELTA (shadows matter more at mastery level)
 */
const OCTAVE_DELTA_MODIFIERS = {
    O1: 0.618,  // Gentler - shadows expected in survival
    O2: 0.764,
    O3: 0.854,
    O4: 1.0,
    O5: 1.0,
    O6: 1.146,
    O7: 1.236   // Stricter - radiant organizations should have fewer shadows
};

/**
 * OCTAVE GAMMA MODIFIERS
 *
 * GAMMA controls spectral bandwidth - variance tolerance.
 * Lower octaves get wider GAMMA (more variance allowed)
 * Higher octaves get tighter GAMMA (coherence expected)
 */
const OCTAVE_GAMMA_MODIFIERS = {
    O1: 1.236,  // Wide bandwidth - anything goes in survival
    O2: 1.146,
    O3: 1.0,
    O4: 1.0,
    O5: 0.854,
    O6: 0.764,
    O7: 0.618   // Tight bandwidth - coherence required at radiance
};

/**
 * Get modifier for a specific octave and parameter
 * @param {string} octave - Octave level (O1-O7)
 * @param {string} parameter - Parameter name (KAPPA, DELTA, GAMMA)
 * @returns {number} Modifier value
 */
function getOctaveModifier(octave, parameter) {
    const modifierMap = {
        KAPPA: OCTAVE_KAPPA_MODIFIERS,
        DELTA: OCTAVE_DELTA_MODIFIERS,
        GAMMA: OCTAVE_GAMMA_MODIFIERS
    };

    const map = modifierMap[parameter];
    if (!map) return 1.0;

    return map[octave] || 1.0;
}

/**
 * Apply octave modifiers to archetype presets
 * @param {Object} preset - Base archetype preset
 * @param {string} octave - Octave level (O1-O7)
 * @returns {Object} Modified preset
 */
function applyOctaveModifiers(preset, octave) {
    if (!preset || !octave) return preset;

    return {
        ...preset,
        KAPPA: preset.KAPPA * getOctaveModifier(octave, 'KAPPA'),
        DELTA: preset.DELTA * getOctaveModifier(octave, 'DELTA'),
        GAMMA: preset.GAMMA * getOctaveModifier(octave, 'GAMMA'),
        // ALPHA and BETA remain unchanged by octave
        ALPHA: preset.ALPHA,
        BETA: preset.BETA,
        _octaveModified: true,
        _octave: octave
    };
}

/**
 * Calculate adaptive constants for a specific face
 * @param {Object} preset - Base archetype preset
 * @param {string} faceOctave - Octave of the specific face
 * @param {string} orgOctave - Overall organizational octave
 * @returns {Object} Face-specific adaptive constants
 */
function calculateFaceConstants(preset, faceOctave, orgOctave) {
    // Weight: 70% face octave, 30% org octave
    const faceModKappa = getOctaveModifier(faceOctave, 'KAPPA') * 0.7;
    const orgModKappa = getOctaveModifier(orgOctave, 'KAPPA') * 0.3;

    const faceModDelta = getOctaveModifier(faceOctave, 'DELTA') * 0.7;
    const orgModDelta = getOctaveModifier(orgOctave, 'DELTA') * 0.3;

    const faceModGamma = getOctaveModifier(faceOctave, 'GAMMA') * 0.7;
    const orgModGamma = getOctaveModifier(orgOctave, 'GAMMA') * 0.3;

    return {
        ...preset,
        KAPPA: preset.KAPPA * (faceModKappa + orgModKappa),
        DELTA: preset.DELTA * (faceModDelta + orgModDelta),
        GAMMA: preset.GAMMA * (faceModGamma + orgModGamma),
        ALPHA: preset.ALPHA,
        BETA: preset.BETA,
        _faceAdapted: true,
        _faceOctave: faceOctave,
        _orgOctave: orgOctave
    };
}

/**
 * Get developmental stage description
 * @param {string} octave - Octave level
 * @returns {Object} Stage description
 */
function getStageDescription(octave) {
    const stages = {
        O1: {
            name: 'Survival',
            tolerance: 'Maximum forgiveness',
            focus: 'Keeping the lights on',
            advice: 'Focus on immediate viability. Shadows are expected.'
        },
        O2: {
            name: 'Structure',
            tolerance: 'High forgiveness',
            focus: 'Building foundation',
            advice: 'Establish basic systems. Some chaos is normal.'
        },
        O3: {
            name: 'Relationships',
            tolerance: 'Moderate forgiveness',
            focus: 'Growing your tribe',
            advice: 'Invest in connections. Teams are forming.'
        },
        O4: {
            name: 'Creativity',
            tolerance: 'Balanced expectations',
            focus: 'Expressing unique value',
            advice: 'Find your voice. Differentiation matters.'
        },
        O5: {
            name: 'Expression',
            tolerance: 'Moderate demands',
            focus: 'Being heard',
            advice: 'Amplify your signal. Coherence strengthens.'
        },
        O6: {
            name: 'Vision',
            tolerance: 'High demands',
            focus: 'Seeing what comes next',
            advice: 'Lead with foresight. Shadows need attention.'
        },
        O7: {
            name: 'Radiance',
            tolerance: 'Excellence expected',
            focus: 'Industry leadership',
            advice: 'You set the standard. Full coherence matters.'
        }
    };

    return stages[octave] || stages.O4;
}

/**
 * Get modifier explanation for UI display
 * @param {string} octave - Octave level
 * @returns {Object} Explanation for display
 */
function getModifierExplanation(octave) {
    const kappaModifier = getOctaveModifier(octave, 'KAPPA');
    const deltaModifier = getOctaveModifier(octave, 'DELTA');
    const gammaModifier = getOctaveModifier(octave, 'GAMMA');

    const stage = getStageDescription(octave);

    let toleranceLevel;
    if (kappaModifier < 0.85) toleranceLevel = 'Very Forgiving';
    else if (kappaModifier < 1.0) toleranceLevel = 'Forgiving';
    else if (kappaModifier === 1.0) toleranceLevel = 'Balanced';
    else if (kappaModifier < 1.2) toleranceLevel = 'Demanding';
    else toleranceLevel = 'Very Demanding';

    return {
        octave,
        stageName: stage.name,
        toleranceLevel,
        modifiers: {
            KAPPA: { value: kappaModifier, effect: kappaModifier < 1 ? 'Wider tolerance' : 'Stricter standards' },
            DELTA: { value: deltaModifier, effect: deltaModifier < 1 ? 'Gentler on shadows' : 'Shadows matter more' },
            GAMMA: { value: gammaModifier, effect: gammaModifier > 1 ? 'More variance allowed' : 'Coherence expected' }
        },
        advice: stage.advice
    };
}

/**
 * Calculate coherence thresholds adjusted for octave
 * @param {string} octave - Octave level
 * @returns {Object} Adjusted thresholds
 */
function getOctaveThresholds(octave) {
    const baseThresholds = {
        excellent: 0.764,    // psi^3 - Mastery
        good: 0.618,         // phi^-1 - Golden
        acceptable: 0.382,   // phi^-2 - Moderate
        concerning: 0.236    // phi^-3 - Low
    };

    const modifier = getOctaveModifier(octave, 'KAPPA');

    // Higher octaves have higher thresholds
    // Lower octaves have lower thresholds
    if (modifier < 1) {
        // Lower expectations for lower octaves
        return {
            excellent: baseThresholds.excellent * modifier,
            good: baseThresholds.good * modifier,
            acceptable: baseThresholds.acceptable * modifier,
            concerning: baseThresholds.concerning * modifier
        };
    } else {
        // Higher expectations, but scale differently
        const boost = (modifier - 1) * 0.5; // Half effect for higher
        return {
            excellent: Math.min(0.95, baseThresholds.excellent + boost * 0.1),
            good: baseThresholds.good + boost * 0.05,
            acceptable: baseThresholds.acceptable,
            concerning: baseThresholds.concerning
        };
    }
}

// ========================================
// EXPORTS
// ========================================

export {
    OCTAVE_KAPPA_MODIFIERS,
    OCTAVE_DELTA_MODIFIERS,
    OCTAVE_GAMMA_MODIFIERS,
    getOctaveModifier,
    applyOctaveModifiers,
    calculateFaceConstants,
    getStageDescription,
    getModifierExplanation,
    getOctaveThresholds
};

// Export for browser global
if (typeof window !== 'undefined') {
    window.OctaveModifiers = {
        KAPPA: OCTAVE_KAPPA_MODIFIERS,
        DELTA: OCTAVE_DELTA_MODIFIERS,
        GAMMA: OCTAVE_GAMMA_MODIFIERS,
        getModifier: getOctaveModifier,
        apply: applyOctaveModifiers,
        getExplanation: getModifierExplanation
    };
}
