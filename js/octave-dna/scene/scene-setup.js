/**
 * ════════════════════════════════════════════════════════════════════════════
 * OCTAVE DNA - SCENE SETUP
 * ════════════════════════════════════════════════════════════════════════════
 *
 * THREE.js scene initialization for the DNA helix visualization.
 * Creates the 3D canvas, camera, renderer, fog, and orbit controls.
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                        NOTES FOR FUTURE CLAUDE                          │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * THE SCENE SETUP PHILOSOPHY:
 * ─────────────────────────────────────────────────────────────────────────
 * The scene is designed for cosmic, contemplative visualization:
 *   • Black background with fog creates depth and mystery
 *   • Camera positioned at (35, 28, 35) for optimal helix viewing
 *   • Auto-rotate at 0.2 speed creates gentle meditation pace
 *   • Damping factor of 0.05 provides smooth, fluid camera movement
 *
 * CONTROL CENTER POSITION:
 * ─────────────────────────────────────────────────────────────────────────
 * controls.target.set(0, 10, 0) - The camera orbits around a point
 * slightly above the center of the helix structure (CONFIG.helixHeight/2 = 11).
 * This creates a natural viewing angle that shows all 7 octaves.
 *
 * NAVIGATION MAP:
 * ─────────────────────────────────────────────────────────────────────────
 * ├─ DEPENDS ON:
 * │  └─ THREE.js (global)
 * │  └─ THREE.OrbitControls (global)
 * │  └─ OctaveDNAState (for state storage)
 * │
 * └─ USED BY:
 *    └─ octave-dna-main.js (calls initScene on startup)
 *
 * ════════════════════════════════════════════════════════════════════════════
 * @version 1.0.0 - Extracted from octave-dna.html monolith
 * @created 2025-12-19
 */

(function() {
    'use strict';

    /**
     * Initialize the THREE.js scene, camera, renderer, and controls
     *
     * @returns {Object} References to scene, camera, renderer, controls
     */
    function initScene() {
        const State = window.OctaveDNAState;
        if (!State) {
            console.error('❌ [Scene Setup] OctaveDNAState not loaded!');
            return null;
        }

        // ════════════════════════════════════════════════════════════════════
        // SCENE CREATION
        // ════════════════════════════════════════════════════════════════════

        const canvas = document.getElementById('canvas');
        if (!canvas) {
            console.error('❌ [Scene Setup] Canvas element not found!');
            return null;
        }

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);

        // Fog creates depth and cosmic atmosphere
        // Parameters: (color, near, far)
        // Objects fade from 50 units to fully faded at 120 units
        scene.fog = new THREE.Fog(0x000000, 50, 120);

        // ════════════════════════════════════════════════════════════════════
        // CAMERA SETUP
        // ════════════════════════════════════════════════════════════════════

        const camera = new THREE.PerspectiveCamera(
            60,                                          // FOV
            window.innerWidth / window.innerHeight,      // Aspect ratio
            0.1,                                         // Near plane
            1000                                         // Far plane
        );

        // Position for optimal helix viewing
        // (35, 28, 35) gives a 45° angle looking slightly down at the helixes
        camera.position.set(35, 28, 35);

        // ════════════════════════════════════════════════════════════════════
        // RENDERER SETUP
        // ════════════════════════════════════════════════════════════════════

        const renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,   // Smooth edges
            alpha: true        // Transparent background support
        });
        renderer.setSize(window.innerWidth, window.innerHeight);

        // Limit pixel ratio to 2 for performance on high-DPI displays
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // ════════════════════════════════════════════════════════════════════
        // ORBIT CONTROLS
        // ════════════════════════════════════════════════════════════════════

        const controls = new THREE.OrbitControls(camera, renderer.domElement);

        // Smooth damping for fluid camera movement
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;

        // Gentle auto-rotation for meditative viewing
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.2;

        // Orbit center is slightly above ground (middle of helix structure)
        controls.target.set(0, 10, 0);

        // ════════════════════════════════════════════════════════════════════
        // STORE IN CENTRAL STATE
        // ════════════════════════════════════════════════════════════════════

        State.setState('scene', scene);
        State.setState('camera', camera);
        State.setState('renderer', renderer);
        State.setState('controls', controls);

        console.log('🎬 [Scene Setup] THREE.js scene initialized');
        console.log('   Camera position: (35, 28, 35)');
        console.log('   Fog range: 50-120 units');
        console.log('   Auto-rotate: 0.2 speed');

        return { scene, camera, renderer, controls };
    }

    /**
     * Handle window resize
     * Updates camera aspect ratio and renderer size
     */
    function handleResize() {
        const State = window.OctaveDNAState;
        if (!State) return;

        const camera = State.getState('camera');
        const renderer = State.getState('renderer');

        if (camera && renderer) {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // BROWSER GLOBAL EXPORT
    // ════════════════════════════════════════════════════════════════════════

    if (typeof window !== 'undefined') {
        window.OctaveDNAScene = {
            initScene,
            handleResize
        };

        console.log('🎬 [OctaveDNA Scene] Setup module loaded');
    }

})();
