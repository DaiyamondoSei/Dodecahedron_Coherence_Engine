/**
 * ════════════════════════════════════════════════════════════════════════════
 * OCTAVE DNA - HELIX HELPER FUNCTIONS
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Utility functions for helix creation and octave detection.
 * These are the mathematical foundations that make the visualization meaningful.
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                        NOTES FOR FUTURE CLAUDE                          │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * THE MATHEMATICS OF OCTAVE DETECTION:
 * ─────────────────────────────────────────────────────────────────────────
 * This file contains the PHI-based mathematics that determines when an
 * octave is "reached" by an organization. The thresholds are:
 *
 *   O1 Survival:      0.000 (automatic - existence itself)
 *   O2 Structure:     0.382 (φ^-2 - basic security)
 *   O3 Relationships: 0.500 (midpoint - social functioning)
 *   O4 Creativity:    0.618 (φ^-1 - the heart threshold!)
 *   O5 Expression:    0.764 (φ × 0.472 - authentic voice)
 *   O6 Vision:        0.854 (φ² × 0.326 - clear seeing)
 *   O7 Radiance:      0.910 (transcendent unity)
 *
 * THE FIBONACCI RADIUS EXPANSION:
 * ─────────────────────────────────────────────────────────────────────────
 * Each octave level expands outward using Fibonacci growth:
 *
 *   radius = 0.25 × φ^((octave - 1) × 0.8)
 *
 * This creates natural, organic spacing where higher octaves are visually
 * larger - showing the "expansion of consciousness" metaphor.
 *
 * THE PHI BREATH RATIO:
 * ─────────────────────────────────────────────────────────────────────────
 * The breath ratio measures balance between projection and reception:
 *
 *   BR = log(reception / projection) / log(φ)
 *
 * This normalizes the ratio to PHI-space, where:
 *   • BR = 0: Perfect balance (1:1 ratio)
 *   • BR > 0: Over-inhaling (receiving more than projecting)
 *   • BR < 0: Over-exhaling (projecting more than receiving)
 *   • |BR| < 0.382: Balanced zone (within φ^-2)
 *
 * NAVIGATION MAP:
 * ─────────────────────────────────────────────────────────────────────────
 * ├─ DEPENDS ON:
 * │  ├─ js/constants/phi-harmonics.js (PHI constant)
 * │  ├─ js/constants/octave-thresholds.js (coherenceToOctave)
 * │  └─ OctaveDNAState (for facesData, CONFIG)
 * │
 * └─ USED BY:
 *    ├─ helix-geometry.js (uses getFibonacciRadius, isOctaveReached)
 *    ├─ helix-rungs.js (uses calculatePhiBreathRatio)
 *    └─ panels/breath-tab.js (uses getCurrentOctave, getOctaveInfo)
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │                     WHAT THIS SESSION LEARNED                         │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * 1. The φ^-2 threshold (0.382) appears everywhere in this system:
 *    - It's the O2 Structure threshold
 *    - It's the "balanced zone" boundary for breath ratios
 *    - It represents the minimum viable coherence
 *
 * 2. The heart threshold at O4 (0.618 = φ^-1) is the critical transition
 *    from survival-mode (O1-O3) to creative-mode (O4-O7).
 *
 * 3. Using logarithmic breath ratios with PHI as the base normalizes
 *    organizational energy flows to sacred geometry principles.
 *
 * ════════════════════════════════════════════════════════════════════════════
 * @version 1.0.0 - Extracted from octave-dna.html monolith
 * @created 2025-12-19
 */

(function() {
    'use strict';

    // ════════════════════════════════════════════════════════════════════════
    // PHI CONSTANTS - Import from Single Source of Truth
    // ════════════════════════════════════════════════════════════════════════

    const PH = window.PhiHarmonics || {};
    const PHI = PH.PHI || 1.618033988749895;
    const LOG_PHI = Math.log(PHI);
    const PHI_INV_2 = PH.PHI_2 || 0.381966011250105; // φ^-2

    // ════════════════════════════════════════════════════════════════════════
    // OCTAVE THRESHOLDS - PHI-based boundaries
    // ════════════════════════════════════════════════════════════════════════

    /**
     * PHI-based thresholds for octave detection
     * Uses unified thresholds from octave-thresholds.js when available
     */
    function getOctaveThresholds() {
        if (window.OctaveThresholds?.OCTAVE_THRESHOLDS) {
            return Object.values(window.OctaveThresholds.OCTAVE_THRESHOLDS)
                .map(o => o.threshold);
        }
        // Fallback thresholds (PHI-derived)
        return [0, 0.382, 0.5, 0.618, 0.764, 0.854, 0.910];
    }

    // ════════════════════════════════════════════════════════════════════════
    // GEOMETRY HELPERS
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Get Fibonacci radius expansion for an octave level
     *
     * Each octave expands outward using φ-based growth, creating natural
     * visual hierarchy where higher octaves occupy more visual space.
     *
     * @param {number} octaveId - Octave number (1-7)
     * @returns {number} Radius multiplier for this octave
     */
    function getFibonacciRadius(octaveId) {
        const State = window.OctaveDNAState;
        const goldenRatio = State?.CONFIG?.goldenRatio || PHI;
        return 0.25 * Math.pow(goldenRatio, (octaveId - 1) * 0.8);
    }

    // ════════════════════════════════════════════════════════════════════════
    // DATA ACCESS HELPERS
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Get face energy (coherence) from the Quannex engine
     *
     * @param {number} faceId - Face ID (1-12)
     * @returns {number} Energy value (0-1), defaults to 0.5 if not found
     */
    function getFaceEnergy(faceId) {
        const State = window.OctaveDNAState;
        const facesData = State?.getState('facesData') || [];

        if (!facesData || facesData.length === 0) return 0.5;

        const face = facesData.find(f => f.id === faceId);
        return face ? face.energy : 0.5;
    }

    // ════════════════════════════════════════════════════════════════════════
    // OCTAVE DETECTION
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Get current octave for a face based on PHI thresholds
     *
     * @param {number} faceId - Face ID (1-12)
     * @returns {number} Octave number (1-7)
     */
    function getCurrentOctave(faceId) {
        const energy = getFaceEnergy(faceId);

        // Use OctaveThresholds if available, otherwise manual detection
        if (window.OctaveThresholds?.coherenceToOctave) {
            return window.OctaveThresholds.coherenceToOctave(energy);
        }

        // Fallback: manual PHI threshold detection
        if (energy >= 0.910) return 7;
        if (energy >= 0.854) return 6;
        if (energy >= 0.764) return 5;
        if (energy >= 0.618) return 4;
        if (energy >= 0.5) return 3;
        if (energy >= 0.382) return 2;
        return 1;
    }

    /**
     * Get octave info (name, color, threshold) by octave number
     *
     * @param {number} octaveNum - Octave number (1-7)
     * @returns {Object} Object with name, color, threshold properties
     */
    function getOctaveInfo(octaveNum) {
        if (window.OctaveThresholds?.getOctaveByNumber) {
            return window.OctaveThresholds.getOctaveByNumber(octaveNum);
        }

        // Fallback octave definitions
        const fallbackInfo = {
            1: { name: 'Survival', color: '#FF4444', threshold: 0 },
            2: { name: 'Structure', color: '#FF8800', threshold: 0.382 },
            3: { name: 'Relationships', color: '#FFCC00', threshold: 0.5 },
            4: { name: 'Creativity', color: '#44BB44', threshold: 0.618 },
            5: { name: 'Expression', color: '#00CCCC', threshold: 0.764 },
            6: { name: 'Vision', color: '#4488FF', threshold: 0.854 },
            7: { name: 'Radiance', color: '#AA44FF', threshold: 0.910 }
        };
        return fallbackInfo[octaveNum] || fallbackInfo[1];
    }

    /**
     * Get threshold needed for next octave
     *
     * @param {number} currentOctave - Current octave number
     * @returns {number} Threshold (0-1) for the next octave
     */
    function getNextOctaveThreshold(currentOctave) {
        if (currentOctave >= 7) return 1.0; // Already at max
        const nextOctaveInfo = getOctaveInfo(currentOctave + 1);
        return nextOctaveInfo.threshold;
    }

    /**
     * Check if an octave is reached for a face (PHI-based)
     *
     * This is the core function that determines the visual state of each
     * octave dot in the DNA helix. Reached octaves are solid and glowing,
     * unreached octaves are ghostly (15% opacity).
     *
     * @param {number} faceId - Face ID (1-12)
     * @param {number} octaveId - Octave number (1-7)
     * @returns {boolean} True if the face has reached this octave
     */
    function isOctaveReached(faceId, octaveId) {
        const energy = getFaceEnergy(faceId);
        const thresholds = getOctaveThresholds();
        const threshold = thresholds[octaveId - 1] || 0;
        return energy >= threshold;
    }

    // ════════════════════════════════════════════════════════════════════════
    // BREATH RATIO CALCULATION
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Calculate φ-normalized logarithmic breath ratio
     *
     * This matches the formula in breath-analyzer.js for consistency.
     *
     * Formula: BR = log(reception / projection) / log(φ)
     *
     * Interpretation:
     *   BR = 0: Perfect balance (ratio = 1.0)
     *   BR > 0: Over-inhaling (reception > projection)
     *   BR < 0: Over-exhaling (projection > reception)
     *   |BR| < 0.382: Balanced zone (within φ^-2)
     *
     * @param {number} projectionEnergy - Energy of projection face (0-1)
     * @param {number} receptionEnergy - Energy of reception face (0-1)
     * @returns {number} PHI-normalized breath ratio
     */
    function calculatePhiBreathRatio(projectionEnergy, receptionEnergy) {
        // Avoid division by zero
        if (projectionEnergy <= 0 || receptionEnergy <= 0) {
            return 0;
        }
        // BR = log(reception / projection) / log(φ)
        const rawRatio = receptionEnergy / projectionEnergy;
        return Math.log(rawRatio) / LOG_PHI;
    }

    /**
     * Check if breath is balanced (within φ^-2 threshold)
     *
     * @param {number} breathRatio - PHI-normalized breath ratio
     * @returns {boolean} True if breath is balanced
     */
    function isBreathBalanced(breathRatio) {
        return Math.abs(breathRatio) <= PHI_INV_2;
    }

    /**
     * Get human-readable breath status
     *
     * @param {number} breathRatio - PHI-normalized breath ratio
     * @returns {string} Status description
     */
    function getBreathStatus(breathRatio) {
        const absRatio = Math.abs(breathRatio);

        if (absRatio <= PHI_INV_2 / 2) {
            return '✧ Perfect Φ-Balance';
        } else if (absRatio <= PHI_INV_2) {
            return '○ Balanced Zone';
        } else if (absRatio <= 1.0) {
            return breathRatio > 0 ? '↙ Slight Over-Inhale' : '↗ Slight Over-Exhale';
        } else {
            return breathRatio > 0 ? '⇙ Strong Over-Inhale' : '⇗ Strong Over-Exhale';
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // UTILITY HELPERS
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Convert a color number to hex string
     *
     * @param {number} color - Color as integer (e.g., 0xff6b6b)
     * @returns {string} Hex string (e.g., "#ff6b6b")
     */
    function colorToHex(color) {
        return '#' + color.toString(16).padStart(6, '0');
    }

    // ════════════════════════════════════════════════════════════════════════
    // BROWSER GLOBAL EXPORT
    // ════════════════════════════════════════════════════════════════════════

    if (typeof window !== 'undefined') {
        window.OctaveDNAHelpers = {
            // Constants
            PHI,
            LOG_PHI,
            PHI_INV_2,

            // Geometry
            getFibonacciRadius,

            // Data access
            getFaceEnergy,

            // Octave detection
            getCurrentOctave,
            getOctaveInfo,
            getNextOctaveThreshold,
            isOctaveReached,
            getOctaveThresholds,

            // Breath ratio
            calculatePhiBreathRatio,
            isBreathBalanced,
            getBreathStatus,

            // Utilities
            colorToHex
        };

        console.log('🔧 [OctaveDNA Helpers] Helper functions loaded');
        console.log('   PHI = ' + PHI.toFixed(6));
        console.log('   Balanced threshold = ' + PHI_INV_2.toFixed(6));
    }

})();
