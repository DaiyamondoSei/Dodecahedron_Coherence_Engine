/**
 * ========================================
 * UNIFIED OCTAVE THRESHOLDS
 * ========================================
 *
 * BACKWARD COMPATIBILITY WRAPPER
 *
 * This file now re-exports from phi-harmonics.js which is the
 * SINGLE SOURCE OF TRUTH for all PHI-derived constants.
 *
 * @see {@link ./phi-harmonics.js} - THE SSOT for all PHI constants
 * @see {@link ../../docs/thesis/CONSCIOUSNESS_MODEL.md} - Why 7 octaves of development
 *
 * All octave thresholds are now FULLY PHI-DERIVED:
 * - No arbitrary numbers
 * - Everything flows from the Golden Ratio (φ)
 *
 * ========================================
 * USAGE
 * ========================================
 *
 * For new code, prefer importing from phi-harmonics.js directly:
 *   const { PHI, PSI_5, coherenceToOctave } = window.PhiHarmonics;
 *
 * This file exists for backward compatibility with existing code
 * that imports from OctaveThresholds.
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
 * PHI-DERIVED THRESHOLDS (v2.0)
 * ========================================
 *
 * Coherence → Octave mapping (ALL values derived from φ):
 *
 *   O1: [0, φ⁻²)         = [0, 0.382)       Survival
 *   O2: [φ⁻², midpoint)  = [0.382, 0.500)  Structure
 *   O3: [midpoint, φ⁻¹)  = [0.500, 0.618)  Relationships
 *   O4: [φ⁻¹, ψ₃)        = [0.618, 0.764)  Creativity
 *   O5: [ψ₃, ψ₄)         = [0.764, 0.854)  Expression
 *   O6: [ψ₄, ψ₅)         = [0.854, 0.910)  Vision
 *   O7: [ψ₅, 1.0]        = [0.910, 1.000]  Radiance
 *
 * Where:
 *   φ⁻¹ = 0.618 (PHI inverse)
 *   φ⁻² = 0.382 (PHI squared inverse)
 *   midpoint = (φ⁻¹ + φ⁻²) / 2 = 0.5 (harmonic center)
 *   ψ₃ = 1 - φ⁻³ = 0.764 (PSI_3)
 *   ψ₄ = 1 - φ⁻⁴ = 0.854 (PSI_4)
 *   ψ₅ = 1 - φ⁻⁵ = 0.910 (PSI_5)
 *
 * ========================================
 */

// ========================================
// WAIT FOR PHI-HARMONICS TO LOAD
// ========================================

/**
 * This file depends on phi-harmonics.js being loaded first.
 * In HTML, ensure the script order is:
 *   <script src="js/constants/phi-harmonics.js"></script>
 *   <script src="js/constants/octave-thresholds.js"></script>
 */

(function() {
    'use strict';

    // Check if PhiHarmonics is available
    const checkPhiHarmonics = () => {
        if (typeof window !== 'undefined' && window.PhiHarmonics) {
            return window.PhiHarmonics;
        }
        return null;
    };

    // Get PhiHarmonics or create fallback
    const PH = checkPhiHarmonics();

    if (!PH) {
        Logger.warn('OctaveThresholds', 'PhiHarmonics not loaded. Using inline constants (not recommended).');
        Logger.warn('OctaveThresholds', 'Please ensure phi-harmonics.js is loaded before octave-thresholds.js');

        // Fallback inline constants (only if phi-harmonics.js not loaded)
        const PHI = (1 + Math.sqrt(5)) / 2;
        const PHI_1 = 1 / PHI;
        const PHI_2 = PHI_1 / PHI;
        const PHI_3 = PHI_2 / PHI;
        const PHI_4 = PHI_3 / PHI;
        const PHI_5 = PHI_4 / PHI;
        const PSI_3 = 1 - PHI_3;
        const PSI_4 = 1 - PHI_4;
        const PSI_5 = 1 - PHI_5;
        const PHI_MIDPOINT = (PHI_1 + PHI_2) / 2;

        // Export fallback
        if (typeof window !== 'undefined') {
            window.OctaveThresholds = createExports(
                PHI, PHI_1, PHI_2, PHI_3,
                PSI_3, PSI_4, PSI_5, PHI_MIDPOINT
            );
        }
        return;
    }

    // ========================================
    // RE-EXPORT FROM PHI-HARMONICS
    // ========================================

    // Legacy constant aliases
    const PHI = PH.PHI;
    const PHI_INVERSE = PH.PHI_1;
    const PHI_SQUARED_INVERSE = PH.PHI_2;
    const PHI_CUBED_INVERSE = PH.PHI_3;

    // Browser global export (backward compatible interface)
    if (typeof window !== 'undefined') {
        window.OctaveThresholds = {
            // Constants (legacy names for backward compatibility)
            PHI: PH.PHI,
            PHI_INVERSE: PH.PHI_1,
            PHI_SQUARED_INVERSE: PH.PHI_2,
            PHI_CUBED_INVERSE: PH.PHI_3,

            // NEW: Direct access to PSI values
            PSI_3: PH.PSI_3,
            PSI_4: PH.PSI_4,
            PSI_5: PH.PSI_5,
            PHI_MIDPOINT: PH.PHI_MIDPOINT,

            // Definitions (from PhiHarmonics)
            OCTAVE_THRESHOLDS: PH.OCTAVE_THRESHOLDS,
            LIFECYCLE_CONSTRAINTS: PH.LIFECYCLE_CONSTRAINTS,
            OCTAVE_KAPPA_MODIFIERS: PH.OCTAVE_KAPPA_MODIFIERS,
            SPREAD_PENALTIES: PH.SPREAD_PENALTIES,

            // Helper functions (from PhiHarmonics)
            coherenceToOctave: PH.coherenceToOctave,
            getOctaveByNumber: PH.getOctaveByNumber,
            getOctaveByKey: PH.getOctaveByKey,
            calculateSpreadPenalty: PH.calculateSpreadPenalty,
            getLifecycleConstraint: PH.getLifecycleConstraint,

            // NEW: Direct access to master module
            PhiHarmonics: PH
        };

        Logger.info('OctaveThresholds', 'Loaded (via PhiHarmonics)');
        Logger.info('OctaveThresholds', 'Fully phi-derived: O1(0) O2(phi^-2) O3(1/2) O4(phi^-1) O5(psi3) O6(psi4) O7(psi5)');
        Logger.info('OctaveThresholds', 'Values: 0  0.382  0.5  0.618  0.764  0.854  0.910');
    }

    // CommonJS export (for Node.js testing)
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = {
            PHI: PH.PHI,
            PHI_INVERSE: PH.PHI_1,
            PHI_SQUARED_INVERSE: PH.PHI_2,
            PHI_CUBED_INVERSE: PH.PHI_3,
            PSI_3: PH.PSI_3,
            PSI_4: PH.PSI_4,
            PSI_5: PH.PSI_5,
            PHI_MIDPOINT: PH.PHI_MIDPOINT,
            OCTAVE_THRESHOLDS: PH.OCTAVE_THRESHOLDS,
            LIFECYCLE_CONSTRAINTS: PH.LIFECYCLE_CONSTRAINTS,
            OCTAVE_KAPPA_MODIFIERS: PH.OCTAVE_KAPPA_MODIFIERS,
            SPREAD_PENALTIES: PH.SPREAD_PENALTIES,
            coherenceToOctave: PH.coherenceToOctave,
            getOctaveByNumber: PH.getOctaveByNumber,
            getOctaveByKey: PH.getOctaveByKey,
            calculateSpreadPenalty: PH.calculateSpreadPenalty,
            getLifecycleConstraint: PH.getLifecycleConstraint
        };
    }

    // ========================================
    // FALLBACK EXPORT CREATOR
    // ========================================

    function createExports(PHI, PHI_1, PHI_2, PHI_3, PSI_3, PSI_4, PSI_5, PHI_MIDPOINT) {
        const OCTAVE_THRESHOLDS = {
            O1: { id: 1, name: 'Survival', focus: 'Existence', threshold: 0, upperBound: PHI_2, color: '#FF4444', gradient: 'linear-gradient(135deg, #FF4444, #FF6666)', icon: '🔴' },
            O2: { id: 2, name: 'Structure', focus: 'Stability', threshold: PHI_2, upperBound: PHI_MIDPOINT, color: '#FF8800', gradient: 'linear-gradient(135deg, #FF8800, #FFAA33)', icon: '🟠' },
            O3: { id: 3, name: 'Relationships', focus: 'Connection', threshold: PHI_MIDPOINT, upperBound: PHI_1, color: '#FFCC00', gradient: 'linear-gradient(135deg, #FFCC00, #FFE066)', icon: '🟡' },
            O4: { id: 4, name: 'Creativity', focus: 'Possibility', threshold: PHI_1, upperBound: PSI_3, color: '#44BB44', gradient: 'linear-gradient(135deg, #44BB44, #66DD66)', icon: '🟢' },
            O5: { id: 5, name: 'Expression', focus: 'Clarity', threshold: PSI_3, upperBound: PSI_4, color: '#00CCCC', gradient: 'linear-gradient(135deg, #00CCCC, #33FFFF)', icon: '🔵' },
            O6: { id: 6, name: 'Vision', focus: 'Direction', threshold: PSI_4, upperBound: PSI_5, color: '#4488FF', gradient: 'linear-gradient(135deg, #4488FF, #66AAFF)', icon: '💜' },
            O7: { id: 7, name: 'Radiance', focus: 'Service', threshold: PSI_5, upperBound: 1.0, color: '#AA44FF', gradient: 'linear-gradient(135deg, #AA44FF, #CC88FF)', icon: '⚪' }
        };

        const coherenceToOctave = (coherence) => {
            const c = Math.max(0, Math.min(1, coherence));
            if (c >= PSI_5) return 7;
            if (c >= PSI_4) return 6;
            if (c >= PSI_3) return 5;
            if (c >= PHI_1) return 4;
            if (c >= PHI_MIDPOINT) return 3;
            if (c >= PHI_2) return 2;
            return 1;
        };

        return {
            PHI, PHI_INVERSE: PHI_1, PHI_SQUARED_INVERSE: PHI_2, PHI_CUBED_INVERSE: PHI_3,
            PSI_3, PSI_4, PSI_5, PHI_MIDPOINT,
            OCTAVE_THRESHOLDS,
            coherenceToOctave,
            getOctaveByNumber: (n) => OCTAVE_THRESHOLDS[`O${Math.max(1, Math.min(7, n))}`],
            getOctaveByKey: (k) => OCTAVE_THRESHOLDS[k] || OCTAVE_THRESHOLDS.O1
        };
    }

})();
