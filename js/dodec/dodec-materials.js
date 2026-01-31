/**
 * ========================================
 * MODULE: dodec-materials.js
 * ========================================
 *
 * Extracted from: dodecahedron-viz.js
 * Original lines: 483-494, 776-808
 * Date: December 15, 2025
 *
 * PURPOSE:
 * Color constants and energy-to-color mapping functions for the
 * dodecahedron visualization. Provides consistent visual language
 * for representing organizational health and elemental nature.
 *
 * DEPENDENCIES:
 * - THREE.js (for THREE.Color)
 * - dodec-state.js (for DodecState - optional, for constants reference)
 *
 * EXPORTS (to window/global):
 * - ELEMENT_COLORS: Object mapping element names to hex colors
 * - getEnergyColor(energy): Returns THREE.Color based on energy level
 * - getTensionColor(tension): Returns color for edge tension (future use)
 *
 * NOTES FOR FUTURE CLAUDE:
 * ========================================
 * COLOR PHILOSOPHY:
 * The color system uses a traffic-light metaphor:
 * - Green (0.7-1.0): Healthy, thriving domains
 * - Yellow/Orange (0.4-0.7): Warning, needs attention
 * - Red (0.0-0.4): Critical, requires immediate action
 *
 * MINIMUM VISIBILITY:
 * Even 0% energy faces have 5% minimum brightness to ensure
 * they remain visible. Crisis domains should be seen, not hidden.
 *
 * ELEMENT COLORS:
 * The 5 elements follow traditional color associations:
 * - Earth: Brown (grounding, stability)
 * - Water: Blue (flow, adaptability)
 * - Fire: Orange-Red (action, transformation)
 * - Air: Light Blue (thought, communication)
 * - Ether: Purple (spirit, integration)
 *
 * THREE.js Color.lerpColors() is used for smooth gradients
 * within each health range for visual appeal.
 *
 * ========================================
 */
(function (global) {
    'use strict';

    // ========================================
    // SECTION: Element Color Constants
    // ========================================
    //
    // Colors for the 5 elements in the sacred geometry system.
    // Used in edge tooltips and element balance displays.
    //
    // ========================================

    /**
     * Color mapping for the 5 elements
     *
     * These colors appear in:
     * - Edge tooltips (showing elemental nature of relationship)
     * - Element balance displays in face detail panels
     * - Pentagram visualization
     *
     * @constant {Object<string, string>}
     */
    const ELEMENT_COLORS = {
        'Earth': '#8B4513',   // SaddleBrown - grounding, material
        'Water': '#4169E1',   // RoyalBlue - flow, emotion
        'Fire': '#FF4500',    // OrangeRed - action, will
        'Air': '#87CEEB',     // SkyBlue - thought, intellect
        'Ether': '#9370DB'    // MediumPurple - spirit, integration
    };

    // ========================================
    // SECTION: Energy Color Mapping
    // ========================================
    //
    // Maps face energy (0.0-1.0) to visual colors.
    // Uses gradient interpolation for smooth transitions.
    //
    // ========================================

    /**
     * Get THREE.Color based on face energy level
     *
     * Energy ranges and their colors:
     * - 0.7-1.0: Healthy green gradient (00ff88 → 00ffcc)
     * - 0.4-0.7: Warning yellow/orange gradient (ff6600 → ffcc00)
     * - 0.0-0.4: Critical red gradient (882222 → ff6666)
     *
     * A minimum brightness of 5% ensures even 0% energy faces
     * remain visible for user awareness.
     *
     * @param {number} energy - Energy level from 0.0 to 1.0
     * @returns {THREE.Color} Color object for the energy level
     */
    function getEnergyColor(energy) {
        // Ensure minimum energy for visibility (even 0% faces are visible)
        const minEnergy = 0.05; // Minimum 5% brightness
        const adjustedEnergy = Math.max(energy, minEnergy);

        if (energy >= 0.7) {
            // Healthy: Green gradient
            return new THREE.Color().lerpColors(
                new THREE.Color(0x00ff88),  // Bright green
                new THREE.Color(0x00ffcc),  // Cyan-green
                (energy - 0.7) / 0.3
            );
        } else if (energy >= 0.4) {
            // Warning: Yellow/Orange gradient
            return new THREE.Color().lerpColors(
                new THREE.Color(0xff6600),  // Orange
                new THREE.Color(0xffcc00),  // Yellow
                (energy - 0.4) / 0.3
            );
        } else {
            // Critical: Bright red gradient with minimum brightness
            // Map 0-40% to a visible red range (never completely black)
            const minRed = 0x882222; // Minimum visible red (darker but still visible)
            const maxRed = 0xff6666; // Bright red

            return new THREE.Color().lerpColors(
                new THREE.Color(minRed),
                new THREE.Color(maxRed),
                adjustedEnergy / 0.4
            );
        }
    }

    /**
     * Get color for edge tension visualization
     *
     * Tension represents the relationship health between two faces.
     * Lower tension = healthier relationship = greener color.
     * Higher tension = strained relationship = redder color.
     *
     * @param {number} tension - Tension level from 0.0 to 1.0
     * @returns {THREE.Color} Color object for the tension level
     */
    function getTensionColor(tension) {
        // Invert: low tension (good) = green, high tension (bad) = red
        if (tension <= 0.3) {
            // Low tension: Healthy cyan-green
            return new THREE.Color().lerpColors(
                new THREE.Color(0x00ffcc),
                new THREE.Color(0x00ff88),
                tension / 0.3
            );
        } else if (tension <= 0.6) {
            // Medium tension: Yellow-orange warning
            return new THREE.Color().lerpColors(
                new THREE.Color(0xffcc00),
                new THREE.Color(0xff9900),
                (tension - 0.3) / 0.3
            );
        } else {
            // High tension: Orange to red critical
            return new THREE.Color().lerpColors(
                new THREE.Color(0xff6600),
                new THREE.Color(0xff3333),
                (tension - 0.6) / 0.4
            );
        }
    }

    /**
     * Get hex string for an element (for CSS use)
     *
     * @param {string} element - Element name (Earth, Water, Fire, Air, Ether)
     * @returns {string} Hex color string (e.g., '#8B4513')
     */
    function getElementColorHex(element) {
        return ELEMENT_COLORS[element] || '#888888';
    }

    /**
     * Get THREE.Color for an element
     *
     * @param {string} element - Element name
     * @returns {THREE.Color} Color object for the element
     */
    function getElementColor(element) {
        const hex = ELEMENT_COLORS[element] || '#888888';
        return new THREE.Color(hex);
    }

    // ========================================
    // EXPORTS
    // ========================================

    // Constants
    global.ELEMENT_COLORS = ELEMENT_COLORS;

    // Functions
    global.getEnergyColor = getEnergyColor;
    global.getTensionColor = getTensionColor;
    global.getElementColorHex = getElementColorHex;
    global.getElementColor = getElementColor;

    // Also store in DodecState for consistency (if available)
    const S = global.DodecState;
    if (S) {
        S.ELEMENT_COLORS = ELEMENT_COLORS;
    }

    Logger.info('Materials', 'Module loaded - Color mapping ready');
    Logger.debug('Materials', 'Element colors:', Object.keys(ELEMENT_COLORS).join(', '));

})(typeof window !== 'undefined' ? window : this);
