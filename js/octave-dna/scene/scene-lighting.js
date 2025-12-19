/**
 * ════════════════════════════════════════════════════════════════════════════
 * OCTAVE DNA - SCENE LIGHTING
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Creates the elegant lighting setup for the DNA helix visualization.
 * The lighting creates depth, warmth, and cosmic atmosphere.
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                        NOTES FOR FUTURE CLAUDE                          │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * THE LIGHTING PHILOSOPHY:
 * ─────────────────────────────────────────────────────────────────────────
 * Four lights work together to create depth and drama:
 *
 *   1. AMBIENT LIGHT (0.4 intensity)
 *      - Soft base illumination so nothing is pure black
 *      - White color for neutral base
 *
 *   2. POINT LIGHT 1 - Cyan-green (0x00ffcc)
 *      - Position: (25, 20, 25) - upper right front
 *      - Creates the distinctive teal glow on DNA helixes
 *      - Intensity 1.0 - the dominant light source
 *
 *   3. POINT LIGHT 2 - Magenta (0xff00ff)
 *      - Position: (-25, 15, -25) - lower left back
 *      - Creates color contrast and depth perception
 *      - Intensity 0.6 - secondary accent
 *
 *   4. TOP LIGHT - White
 *      - Position: (0, 40, 0) - directly above
 *      - Creates highlights on top of octave spheres
 *      - Intensity 0.8 - important for O7 Radiance visibility
 *
 * LIGHT RANGE:
 * ─────────────────────────────────────────────────────────────────────────
 * All point lights have a range of 100 units, which covers the entire
 * helix structure (helixSpacing of 12, helixHeight of 22).
 *
 * NAVIGATION MAP:
 * ─────────────────────────────────────────────────────────────────────────
 * ├─ DEPENDS ON:
 * │  └─ THREE.js (global)
 * │  └─ OctaveDNAState.getState('scene')
 * │
 * └─ USED BY:
 *    └─ octave-dna-main.js (calls initLighting after scene setup)
 *
 * ════════════════════════════════════════════════════════════════════════════
 * @version 1.0.0 - Extracted from octave-dna.html monolith
 * @created 2025-12-19
 */

(function() {
    'use strict';

    /**
     * Initialize the scene lighting
     * Creates ambient and point lights for the DNA visualization
     *
     * @returns {Object} References to all light objects
     */
    function initLighting() {
        const State = window.OctaveDNAState;
        if (!State) {
            console.error('❌ [Lighting] OctaveDNAState not loaded!');
            return null;
        }

        const scene = State.getState('scene');
        if (!scene) {
            console.error('❌ [Lighting] Scene not initialized!');
            return null;
        }

        // ════════════════════════════════════════════════════════════════════
        // AMBIENT LIGHT - Soft base illumination
        // ════════════════════════════════════════════════════════════════════

        const ambientLight = new THREE.AmbientLight(
            0xffffff,  // White color
            0.4        // 40% intensity - subtle base
        );

        // ════════════════════════════════════════════════════════════════════
        // POINT LIGHT 1 - Cyan-green accent (dominant)
        // ════════════════════════════════════════════════════════════════════

        const pointLight1 = new THREE.PointLight(
            0x00ffcc,  // Cyan-green (matches the project's accent color)
            1.0,       // Full intensity
            100        // Range of 100 units
        );
        pointLight1.position.set(25, 20, 25);  // Upper right front

        // ════════════════════════════════════════════════════════════════════
        // POINT LIGHT 2 - Magenta accent (secondary)
        // ════════════════════════════════════════════════════════════════════

        const pointLight2 = new THREE.PointLight(
            0xff00ff,  // Magenta - complementary contrast
            0.6,       // 60% intensity
            100        // Range of 100 units
        );
        pointLight2.position.set(-25, 15, -25);  // Lower left back

        // ════════════════════════════════════════════════════════════════════
        // TOP LIGHT - White highlight for octave markers
        // ════════════════════════════════════════════════════════════════════

        const topLight = new THREE.PointLight(
            0xffffff,  // Pure white
            0.8,       // 80% intensity
            100        // Range of 100 units
        );
        topLight.position.set(0, 40, 0);  // Directly above

        // ════════════════════════════════════════════════════════════════════
        // ADD ALL LIGHTS TO SCENE
        // ════════════════════════════════════════════════════════════════════

        scene.add(ambientLight, pointLight1, pointLight2, topLight);

        console.log('💡 [Lighting] Scene lighting initialized');
        console.log('   Ambient: white @ 0.4');
        console.log('   Point 1: cyan-green @ 1.0 (25, 20, 25)');
        console.log('   Point 2: magenta @ 0.6 (-25, 15, -25)');
        console.log('   Top: white @ 0.8 (0, 40, 0)');

        return {
            ambientLight,
            pointLight1,
            pointLight2,
            topLight
        };
    }

    // ════════════════════════════════════════════════════════════════════════
    // BROWSER GLOBAL EXPORT
    // ════════════════════════════════════════════════════════════════════════

    if (typeof window !== 'undefined') {
        window.OctaveDNALighting = {
            initLighting
        };

        console.log('💡 [OctaveDNA Lighting] Module loaded');
    }

})();
