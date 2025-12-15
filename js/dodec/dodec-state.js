/**
 * ========================================
 * MODULE: dodec-state.js
 * ========================================
 *
 * Created for: dodecahedron-viz.js modularization
 * Date: December 15, 2025
 *
 * PURPOSE:
 * Central state registry that replaces the closure-scoped variables
 * from the original initDodecahedron() function. All visualization
 * modules read from and write to this shared state object.
 *
 * DEPENDENCIES:
 * - js/constants/phi-harmonics.js (for PHI constants - optional fallback)
 *
 * EXPORTS (to window/global):
 * - DodecState: Main state object containing all shared variables
 *
 * NOTES FOR FUTURE CLAUDE:
 * ========================================
 * This module is the HEART of the modular architecture. It solves
 * the closure-sharing problem that makes extracting modules from
 * a single large function challenging.
 *
 * PATTERN:
 * Instead of: const scene = new THREE.Scene(); (closure-scoped)
 * We use:     DodecState.scene = new THREE.Scene(); (shared state)
 *
 * All other modules import DodecState as 'S' for brevity:
 *   const S = global.DodecState;
 *   S.scene.add(mesh);
 *
 * STATE CATEGORIES:
 * 1. THREE.js Core - scene, camera, renderer, controls, canvas
 * 2. Geometry - mainDodecahedron, faceMeshes[], edgeLines[], materials[]
 * 3. Interaction - raycaster, mouse, selectedFace, hoveredFace
 * 4. Mouse Tracking - positions, drag detection, interaction timeout
 * 5. Data - currentCompany, companyData
 * 6. UI Toggles - autoRotate, animationsPaused, showOctaveLayers
 * 7. Octave Layers - octaveLayerGroup, OCTAVE_COLORS
 * 8. Constants - PHI, DRAG_THRESHOLD, ELEMENT_COLORS
 *
 * IMPORTANT:
 * - Always check if state exists before using: if (!S) return;
 * - Initialize complex objects (THREE.js) ONLY in their respective modules
 * - Simple values and arrays are pre-initialized here
 * - OCTAVE_COLORS and ELEMENT_COLORS are constants, not mutable state
 *
 * ========================================
 */
(function(global) {
    'use strict';

    // ========================================
    // PHI CONSTANTS (from phi-harmonics.js SSOT)
    // ========================================

    const _PH = global.PhiHarmonics || {};
    const PHI = _PH.PHI || 1.618033988749895;
    const PHI_1 = _PH.PHI_1 || 0.618033988749895;  // PHI^-1

    // ========================================
    // CENTRAL STATE REGISTRY
    // ========================================
    //
    // This object replaces ALL closure-scoped variables from
    // the original initDodecahedron() function (lines 243-2798).
    //
    // Modules write to this state during initialization,
    // and read from it during runtime operations.
    //
    // ========================================

    const DodecState = {

        // ========================================
        // THREE.JS CORE OBJECTS
        // ========================================
        // Initialized by: dodec-scene.js
        // Used by: All modules for rendering

        /** @type {HTMLCanvasElement|null} - Canvas element for WebGL */
        canvas: null,

        /** @type {THREE.WebGLRenderer|null} - Main WebGL renderer */
        renderer: null,

        /** @type {THREE.Scene|null} - Main 3D scene */
        scene: null,

        /** @type {THREE.PerspectiveCamera|null} - Main camera */
        camera: null,

        /** @type {THREE.OrbitControls|null} - Camera orbit controls */
        controls: null,

        // ========================================
        // GEOMETRY OBJECTS
        // ========================================
        // Initialized by: dodec-geometry.js
        // Used by: dodec-interaction.js, dodec-animation.js, dodec-panels.js

        /** @type {THREE.Mesh|null} - Main visible dodecahedron mesh */
        mainDodecahedron: null,

        /** @type {THREE.Material[]} - Array of 12 face materials */
        materials: [],

        /** @type {THREE.Mesh[]} - Array of 12 clickable face meshes */
        faceMeshes: [],

        /** @type {THREE.Mesh[]} - Array of 30 edge tube meshes */
        edgeLines: [],

        /** @type {THREE.Vector3[]|null} - Cached geometric vertex positions */
        cachedGeometricVertices: null,

        // ========================================
        // INTERACTION STATE
        // ========================================
        // Initialized by: dodec-interaction.js
        // Used by: dodec-interaction.js, dodec-animation.js

        /** @type {THREE.Raycaster|null} - For mouse picking */
        raycaster: null,

        /** @type {THREE.Vector2|null} - Normalized mouse position */
        mouse: null,

        /** @type {THREE.Mesh|null} - Currently selected face mesh */
        selectedFace: null,

        /** @type {THREE.Mesh|null} - Currently hovered face mesh */
        hoveredFace: null,

        /** @type {boolean} - Whether camera is animating to a face */
        isCameraAnimating: false,

        // ========================================
        // MOUSE TRACKING STATE
        // ========================================
        // Initialized by: dodec-interaction.js
        // Used by: dodec-interaction.js (click vs drag detection)

        /** @type {boolean} - Whether user is currently interacting */
        isUserInteracting: false,

        /** @type {number|null} - Timeout ID for interaction end */
        interactionTimeout: null,

        /** @type {{x: number, y: number}} - Mouse position at drag start */
        mouseStartPosition: { x: 0, y: 0 },

        /** @type {{x: number, y: number}} - Current mouse position */
        currentMousePosition: { x: 0, y: 0 },

        /** @type {boolean} - Whether user is dragging with OrbitControls */
        isDraggingWithOrbit: false,

        // ========================================
        // DATA STATE
        // ========================================
        // Managed by: dodec-data.js
        // Used by: dodec-data.js, dodec-panels.js, dodec-controls.js

        /** @type {string} - Current company ID (e.g., 'quannex', 'techflow') */
        currentCompany: 'quannex',

        /** @type {Object|null} - Loaded company state from Quannex engine */
        companyData: null,

        // ========================================
        // UI TOGGLE STATE
        // ========================================
        // Modified by: dodec-controls.js (keyboard shortcuts)
        // Read by: dodec-animation.js

        /** @type {boolean} - Auto-rotation enabled */
        autoRotate: false,

        /** @type {boolean} - All animations paused */
        animationsPaused: false,

        /** @type {boolean} - Octave layers visible */
        showOctaveLayers: false,

        // ========================================
        // OCTAVE LAYERS
        // ========================================
        // Initialized by: dodec-scene.js
        // Used by: dodec-scene.js, dodec-animation.js

        /** @type {THREE.Group|null} - Group containing 7 octave shells */
        octaveLayerGroup: null,

        /** @type {number[]} - Hex colors for 7 octave levels */
        OCTAVE_COLORS: [
            0xff3333,  // O1 - Survival (Red)
            0xff9933,  // O2 - Security (Orange)
            0xffff33,  // O3 - Power (Yellow)
            0x33ff33,  // O4 - Connection (Green)
            0x33ffff,  // O5 - Expression (Cyan)
            0x3333ff,  // O6 - Vision (Indigo)
            0xff33ff   // O7 - Transcendence (Violet)
        ],

        // ========================================
        // CONSTANTS
        // ========================================
        // These are immutable configuration values

        /** @type {number} - Golden Ratio from phi-harmonics.js */
        PHI: PHI,

        /** @type {number} - Golden Ratio inverse */
        PHI_1: PHI_1,

        /** @type {number} - Minimum pixels to consider a drag */
        DRAG_THRESHOLD: 5,

        /** @type {Object} - Element colors for edge tooltips */
        ELEMENT_COLORS: {
            'Earth': '#8B4513',   // SaddleBrown
            'Water': '#4169E1',   // RoyalBlue
            'Fire': '#FF4500',    // OrangeRed
            'Air': '#87CEEB',     // SkyBlue
            'Ether': '#9370DB'    // MediumPurple
        }
    };

    // ========================================
    // DEFENSIVE ACCESSORS (Optional)
    // ========================================
    //
    // These getter functions provide safety checks for critical state.
    // Use when null access would cause hard-to-debug errors.
    //
    // ========================================

    /**
     * Get scene safely, logging warning if not initialized
     * @returns {THREE.Scene|null}
     */
    function getScene() {
        if (!DodecState.scene) {
            console.warn('[dodec-state] Scene not yet initialized');
        }
        return DodecState.scene;
    }

    /**
     * Get camera safely, logging warning if not initialized
     * @returns {THREE.PerspectiveCamera|null}
     */
    function getCamera() {
        if (!DodecState.camera) {
            console.warn('[dodec-state] Camera not yet initialized');
        }
        return DodecState.camera;
    }

    /**
     * Get renderer safely, logging warning if not initialized
     * @returns {THREE.WebGLRenderer|null}
     */
    function getRenderer() {
        if (!DodecState.renderer) {
            console.warn('[dodec-state] Renderer not yet initialized');
        }
        return DodecState.renderer;
    }

    /**
     * Check if visualization is fully initialized
     * @returns {boolean}
     */
    function isInitialized() {
        return !!(
            DodecState.scene &&
            DodecState.camera &&
            DodecState.renderer &&
            DodecState.mainDodecahedron
        );
    }

    /**
     * Reset all state to initial values (useful for testing)
     */
    function resetState() {
        DodecState.canvas = null;
        DodecState.renderer = null;
        DodecState.scene = null;
        DodecState.camera = null;
        DodecState.controls = null;
        DodecState.mainDodecahedron = null;
        DodecState.materials = [];
        DodecState.faceMeshes = [];
        DodecState.edgeLines = [];
        DodecState.cachedGeometricVertices = null;
        DodecState.raycaster = null;
        DodecState.mouse = null;
        DodecState.selectedFace = null;
        DodecState.hoveredFace = null;
        DodecState.isCameraAnimating = false;
        DodecState.isUserInteracting = false;
        DodecState.interactionTimeout = null;
        DodecState.mouseStartPosition = { x: 0, y: 0 };
        DodecState.currentMousePosition = { x: 0, y: 0 };
        DodecState.isDraggingWithOrbit = false;
        DodecState.currentCompany = 'quannex';
        DodecState.companyData = null;
        DodecState.autoRotate = false;
        DodecState.animationsPaused = false;
        DodecState.showOctaveLayers = false;
        DodecState.octaveLayerGroup = null;
        console.log('[dodec-state] State reset complete');
    }

    // ========================================
    // EXPORTS
    // ========================================

    // Main state object
    global.DodecState = DodecState;

    // Optional helper functions
    global.DodecStateHelpers = {
        getScene,
        getCamera,
        getRenderer,
        isInitialized,
        resetState
    };

    console.log('[dodec-state] Module loaded - Central state registry ready');
    console.log('[dodec-state] PHI constant:', DodecState.PHI);

})(typeof window !== 'undefined' ? window : this);
