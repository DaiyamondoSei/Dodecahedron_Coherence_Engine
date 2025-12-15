/**
 * ========================================
 * MODULE: dodec-main.js
 * ========================================
 *
 * Main initialization orchestrator for the modular dodecahedron visualization.
 * This module coordinates all other modules and establishes window exports.
 *
 * Date: December 15, 2025
 *
 * PURPOSE:
 * - Initialize all dodecahedron subsystems in correct order
 * - Set up window event listeners (resize, focus-face)
 * - Export global API for external access (dodecahedronViz, etc.)
 * - Verify all exports are properly registered
 *
 * DEPENDENCIES (load order critical):
 * 1. dodec-state.js - Central state registry
 * 2. dodec-topology.js - Vertex/face mapping
 * 3. dodec-materials.js - Colors and gradients
 * 4. dodec-scene.js - THREE.js infrastructure
 * 5. dodec-geometry.js - Mesh and edge creation
 * 6. dodec-data.js - Company data loading
 * 7. dodec-interaction.js - Mouse/keyboard handlers
 * 8. dodec-panels.js - Info panels
 * 9. dodec-controls.js - UI controls
 * 10. dodec-animation.js - Animation loop
 * 11. dodec-main.js - This file (orchestrator)
 *
 * EXPORTS (to window/global):
 * - initDodecahedron(): Main entry point
 * - dodecahedronViz: API object for external access
 * - refreshVisualization: Quick update function
 * - scene, camera, renderer: THREE.js core objects
 *
 * NOTES FOR FUTURE CLAUDE:
 * ========================================
 * INITIALIZATION SEQUENCE:
 * DOMContentLoaded triggers initDodecahedron() which runs:
 *
 * 1. THREE.js Check
 *    - Verify THREE is loaded before proceeding
 *
 * 2. Scene Setup (initScene)
 *    - Creates renderer, scene, camera, controls, lights
 *    - All stored in DodecState
 *
 * 3. Engine Loading (loadQuannexEngine)
 *    - Polls for window.Quannex (loaded by main.js)
 *    - May fail in iframe mode (check isInIframe)
 *
 * 4. Geometry Creation (createDodecahedron)
 *    - Creates 12-face mesh with materials
 *    - Creates 30 TubeGeometry edges
 *    - Runs topology face mapping
 *
 * 5. Interaction Setup (setupInteraction)
 *    - Raycaster for hover/click
 *    - Mouse event listeners
 *
 * 6. UI Controls (setupUIControls, setupKeyboardShortcuts)
 *    - Button handlers
 *    - 14 keyboard shortcuts
 *
 * 7. Initial Visualization (updateVisualization, updateStats)
 *    - Colors faces from engine data
 *    - Updates HUD with coherence percentage
 *
 * 8. Animation Start (startAnimation)
 *    - Begins render loop at 60fps
 *    - PHI-tuned pulsing effects
 *
 * 9. Window Exports
 *    - dodecahedronViz API object
 *    - refreshVisualization function
 *    - scene, camera, renderer globals
 *
 * EXTERNAL API (dodecahedronViz):
 * - switchCompany(id): Load different company
 * - updateVisualization(): Refresh all face colors
 * - highlightShadowFaces(ids, severity): Shadow highlighting
 * - clearShadowHighlights(): Remove highlights
 * - focusOnFace(id): Programmatic face focus
 * - getShadowPatterns(): Get current shadow data
 *
 * RESIZE HANDLING:
 * Window resize updates camera aspect and renderer size.
 * DodecState references are used for consistency.
 *
 * FOCUS-FACE EVENT:
 * Custom event allows external code (orchestrator) to trigger
 * camera animation and detail panel for a specific face.
 *
 * VERIFICATION:
 * Required exports are checked after setup. Missing exports
 * logged as errors for debugging.
 *
 * ========================================
 */
(function(global) {
    'use strict';

    // ========================================
    // IMPORTS
    // ========================================

    const S = global.DodecState;
    if (!S) {
        console.error('[dodec-main] DodecState not loaded!');
        return;
    }

    // ========================================
    // SECTION: Main Initialization
    // ========================================
    //
    // Entry point that coordinates all subsystems.
    // Called automatically on DOMContentLoaded.
    //
    // ========================================

    /**
     * Main initialization function
     *
     * Orchestrates all subsystems in correct order.
     * This is the async entry point for the visualization.
     */
    async function initDodecahedron() {
        console.log('🔷 Initializing 3D Dodecahedron Visualization (Modular)...');

        // ========================================
        // PHASE 1: Prerequisites Check
        // ========================================

        if (typeof THREE === 'undefined') {
            console.error('❌ THREE.js not loaded! Aborting initialization.');
            return;
        }

        if (typeof THREE.OrbitControls === 'undefined') {
            console.error('❌ THREE.OrbitControls not loaded! Aborting initialization.');
            return;
        }

        console.log('✅ THREE.js and OrbitControls detected');

        // Check for iframe mode (affects some features)
        const isInIframe = global.self !== global.top;
        if (isInIframe) {
            console.log('📌 Running in iframe mode');
        }

        // ========================================
        // PHASE 2: Scene Infrastructure
        // ========================================

        if (typeof global.initScene === 'function') {
            global.initScene();
            console.log('✅ Scene initialized');
        } else {
            console.error('❌ initScene not found! Is dodec-scene.js loaded?');
            return;
        }

        // ========================================
        // PHASE 3: Load Quannex Engine
        // ========================================

        let engineLoaded = false;
        if (typeof global.loadQuannexEngine === 'function') {
            engineLoaded = await global.loadQuannexEngine();
            if (engineLoaded) {
                console.log('✅ Quannex engine loaded');
            } else {
                console.warn('⚠️ Quannex engine not available - visualization will use defaults');
            }
        } else {
            console.warn('⚠️ loadQuannexEngine not found! Is dodec-data.js loaded?');
        }

        // ========================================
        // PHASE 4: Create Geometry
        // ========================================

        if (typeof global.createDodecahedron === 'function') {
            global.createDodecahedron();
            console.log('✅ Dodecahedron geometry created');
        } else {
            console.error('❌ createDodecahedron not found! Is dodec-geometry.js loaded?');
            return;
        }

        // ========================================
        // PHASE 5: Setup Interaction
        // ========================================

        if (typeof global.setupInteraction === 'function') {
            global.setupInteraction();
            console.log('✅ Interaction handlers registered');
        } else {
            console.warn('⚠️ setupInteraction not found! Is dodec-interaction.js loaded?');
        }

        // ========================================
        // PHASE 6: Setup UI Controls
        // ========================================

        if (typeof global.setupUIControls === 'function') {
            global.setupUIControls();
            console.log('✅ UI controls initialized');
        } else {
            console.warn('⚠️ setupUIControls not found! Is dodec-controls.js loaded?');
        }

        if (typeof global.setupKeyboardShortcuts === 'function') {
            global.setupKeyboardShortcuts();
            console.log('✅ Keyboard shortcuts registered');
        } else {
            console.warn('⚠️ setupKeyboardShortcuts not found! Is dodec-controls.js loaded?');
        }

        // ========================================
        // PHASE 7: Initial Visualization
        // ========================================

        if (typeof global.updateVisualization === 'function') {
            global.updateVisualization();
            console.log('✅ Initial visualization updated');
        }

        if (typeof global.updateEdgeData === 'function') {
            global.updateEdgeData();
            console.log('✅ Edge data updated');
        }

        if (typeof global.updateStats === 'function') {
            global.updateStats();
            console.log('✅ Stats HUD updated');
        }

        // ========================================
        // PHASE 8: Start Animation
        // ========================================

        if (typeof global.startAnimation === 'function') {
            global.startAnimation();
            console.log('✅ Animation loop started');
        } else {
            console.warn('⚠️ startAnimation not found! Is dodec-animation.js loaded?');
        }

        // ========================================
        // PHASE 9: Hide Loading Indicator
        // ========================================

        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }

        // ========================================
        // PHASE 10: Setup Window Exports
        // ========================================

        setupWindowExports();
        setupWindowEventListeners();
        verifyExports();

        console.log('✅ 3D Dodecahedron initialized successfully!');
    }

    // ========================================
    // SECTION: Window Exports
    // ========================================
    //
    // Establishes global API for external access.
    // Preserves original dodecahedron-viz.js interface.
    //
    // ========================================

    /**
     * Setup all window exports for external access
     *
     * Creates the dodecahedronViz API object and exposes
     * core THREE.js objects for debugging and integration.
     */
    function setupWindowExports() {
        // ========================================
        // Core THREE.js Exports
        // ========================================

        global.scene = S.scene;
        global.camera = S.camera;
        global.renderer = S.renderer;

        // ========================================
        // Main API Object
        // ========================================

        global.dodecahedronViz = {
            // Core references
            scene: S.scene,
            camera: S.camera,
            faceMeshes: S.faceMeshes,
            companyData: S.companyData,

            // Company switching
            switchCompany: global.switchCompany,

            // Visualization updates
            updateVisualization: global.updateVisualization,

            // Shadow highlighting
            highlightShadowFaces: global.highlightShadowFaces,
            clearShadowHighlights: global.clearShadowHighlights,

            // Shadow data access
            getShadowPatterns: function() {
                const state = global.Quannex?.getState?.() || global.quannexEngine?.getState?.();
                return state?.shadowPatterns || [];
            },

            // Programmatic face focus
            focusOnFace: function(faceId) {
                global.dispatchEvent(new CustomEvent('focus-face', { detail: { faceId } }));
            }
        };

        // ========================================
        // Convenience Functions
        // ========================================

        /**
         * Refresh all visualization data
         * Used by parent window communication (BroadcastChannel)
         */
        global.refreshVisualization = function() {
            if (global.updateVisualization) global.updateVisualization();
            if (global.updateEdgeData) global.updateEdgeData();
            if (global.updateStats) global.updateStats();
            console.log('✅ Visualization refreshed (faces + edges)');
        };

        console.log('[dodec-main] Window exports configured');
    }

    // ========================================
    // SECTION: Window Event Listeners
    // ========================================
    //
    // Handles resize and custom events for external integration.
    //
    // ========================================

    /**
     * Setup window event listeners
     *
     * Handles resize for camera/renderer updates and
     * custom focus-face event for external integration.
     */
    function setupWindowEventListeners() {
        // ========================================
        // RESIZE HANDLER
        // ========================================

        global.addEventListener('resize', function() {
            if (S.camera && S.renderer) {
                S.camera.aspect = global.innerWidth / global.innerHeight;
                S.camera.updateProjectionMatrix();
                S.renderer.setSize(global.innerWidth, global.innerHeight);
            }
        });

        // ========================================
        // FOCUS-FACE CUSTOM EVENT
        // ========================================
        // Allows orchestrator to trigger face focus programmatically

        global.addEventListener('focus-face', function(event) {
            const faceId = event.detail?.faceId;
            if (!faceId) {
                console.warn('[dodec-main] focus-face event missing faceId');
                return;
            }

            console.log(`[dodec-main] Focus-face event received for Face ${faceId}`);

            // Find the target face mesh
            const targetFaceIndex = S.faceMeshes.findIndex(
                mesh => mesh.userData.faceId === faceId
            );

            if (targetFaceIndex === -1) {
                console.warn(`[dodec-main] Face ${faceId} not found in faceMeshes`);
                return;
            }

            // Animate camera to face (if function available)
            if (typeof global.getCameraPositionForFace === 'function' &&
                typeof global.animateCameraTo === 'function') {
                const { position, lookAt } = global.getCameraPositionForFace(targetFaceIndex);
                global.animateCameraTo(position, lookAt, 800);
            }

            // Show detail panel
            const selectedFace = S.faceMeshes[targetFaceIndex].userData.faceData;
            if (selectedFace && typeof global.showFaceDetail === 'function') {
                global.showFaceDetail(selectedFace);
            }
        });

        console.log('[dodec-main] Window event listeners registered');
    }

    // ========================================
    // SECTION: Export Verification
    // ========================================
    //
    // Validates that all required exports are present.
    // Helps catch module loading issues early.
    //
    // ========================================

    /**
     * Verify all required exports are present
     *
     * Logs warnings for missing exports to aid debugging.
     */
    function verifyExports() {
        const REQUIRED_EXPORTS = [
            'scene',
            'camera',
            'renderer',
            'mainDodecahedron',
            'dodecahedronMaterials',
            'dodecahedronViz',
            'refreshVisualization'
        ];

        const missing = [];
        REQUIRED_EXPORTS.forEach(name => {
            if (typeof global[name] === 'undefined') {
                missing.push(name);
            }
        });

        if (missing.length > 0) {
            console.warn('[dodec-main] Missing exports:', missing.join(', '));
        } else {
            console.log('[dodec-main] All required exports verified ✓');
        }
    }

    // ========================================
    // EXPORTS
    // ========================================

    global.initDodecahedron = initDodecahedron;

    // ========================================
    // AUTO-INITIALIZATION
    // ========================================
    // Register DOMContentLoaded listener for automatic startup

    document.addEventListener('DOMContentLoaded', function() {
        initDodecahedron();
    });

    console.log('[dodec-main] Module loaded - Initialization orchestrator ready');
    console.log('[dodec-main] Will auto-initialize on DOMContentLoaded');

})(typeof window !== 'undefined' ? window : this);
