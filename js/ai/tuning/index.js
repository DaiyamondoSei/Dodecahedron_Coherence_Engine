/**
 * ========================================
 * AI TUNING - Module Index
 * ========================================
 *
 * Central export for all tuning-related functionality.
 *
 * @module AITuning
 * @version Sprint 2 - Tasks 20-21
 */

// Archetype Presets - PHI-only constants
export {
    ARCHETYPE_PRESETS,
    PHI,
    getArchetypePreset,
    getPresetComparison,
    getDominantParameter,
    validatePresets,
    createBlendedPreset,
    snapToPhiValue
} from './archetype-presets.js';

// Octave Modifiers - Adaptive constants
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
} from './octave-modifiers.js';
