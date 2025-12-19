/**
 * ════════════════════════════════════════════════════════════════════════════
 * OCTAVE DNA - CENTRAL STATE REGISTRY
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Single source of truth for all Octave DNA visualization state.
 * Mutable state is centralized here to avoid scattered global variables.
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                        NOTES FOR FUTURE CLAUDE                          │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * WHY CENTRALIZED STATE:
 * The original monolithic file had 15+ global variables scattered throughout.
 * By centralizing state here, we:
 *   1. Know exactly what state exists
 *   2. Can reason about data flow
 *   3. Make debugging easier
 *   4. Enable future state management improvements
 *
 * STATE CATEGORIES:
 * ─────────────────────────────────────────────────────────────────────────
 * 1. THREE.js objects (scene, camera, renderer, controls)
 * 2. Configuration (CONFIG, DNA_HELICES, HELIX_COLORS)
 * 3. Data (facesData from Quannex engine)
 * 4. UI state (selectedHelix, animationRunning)
 * 5. DOM references (dnaGroup)
 *
 * NAVIGATION MAP:
 * ─────────────────────────────────────────────────────────────────────────
 * ├─ DEPENDS ON:
 * │  └─ js/constants/phi-harmonics.js (PHI constant for goldenRatio)
 * │
 * └─ USED BY:
 *    ├─ octave-dna-scene.js (reads/writes THREE.js objects)
 *    ├─ octave-dna-helix.js (reads CONFIG, DNA_HELICES)
 *    ├─ octave-dna-animation.js (reads/writes animationRunning)
 *    ├─ octave-dna-interaction.js (reads/writes selectedHelix)
 *    └─ octave-dna-main.js (coordinates all state)
 *
 * ════════════════════════════════════════════════════════════════════════════
 * @version 1.0.0 - Extracted from octave-dna.html monolith
 * @created 2025-12-19
 */

(function() {
    'use strict';

    // ════════════════════════════════════════════════════════════════════════
    // PHI INTEGRATION - Import from Single Source of Truth
    // ════════════════════════════════════════════════════════════════════════

    const PH = window.PhiHarmonics || {};
    const PHI = PH.PHI || 1.618033988749895;

    // ════════════════════════════════════════════════════════════════════════
    // CONFIGURATION - Visualization parameters
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Helix visualization configuration
     * These values control the geometry and appearance of DNA helixes
     */
    const CONFIG = Object.freeze({
        helixSpacing: 12,       // Distance between helix pairs
        helixHeight: 22,        // Total height of helix structure
        helixTurns: 4,          // Number of spiral turns
        strandRadius: 0.8,      // Radius of helix strand orbit
        tubeRadius: 0.18,       // Thickness of strand tubes
        segments: 150,          // Smoothness of curves
        goldenRatio: PHI,       // φ - from phi-harmonics.js
        maxOctaves: 7           // Total octave levels
    });

    /**
     * Default color palette for the 6 breath axes
     * Colors chosen for visual distinction and aesthetic harmony
     */
    const HELIX_COLORS = Object.freeze([
        0xff6b6b,  // Coral red
        0x4ecdc4,  // Teal
        0xffe66d,  // Golden yellow
        0x95e1d3,  // Mint green
        0xf38181,  // Salmon pink
        0xaa96da   // Lavender purple
    ]);

    /**
     * Fixed breath axis face pairings
     * These match breath-analyzer.js for consistency across views
     * Each axis pairs a "projection" face with a "reception" face
     */
    const FIXED_BREATH_AXES = Object.freeze([
        { id: 1, name: 'Resource Flow', projection: 11, reception: 1 },
        { id: 2, name: 'Substance & Story', projection: 7, reception: 2 },
        { id: 3, name: 'Being & Doing', projection: 8, reception: 3 },
        { id: 4, name: 'Form & Integrity', projection: 4, reception: 9 },
        { id: 5, name: 'Perception & Truth', projection: 5, reception: 10 },
        { id: 6, name: 'Network & Fortress', projection: 6, reception: 12 }
    ]);

    // ════════════════════════════════════════════════════════════════════════
    // MUTABLE STATE - Managed centrally
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Central state object
     * All mutable state is contained here for easy tracking
     */
    const state = {
        // THREE.js scene objects (initialized in scene-setup.js)
        scene: null,
        camera: null,
        renderer: null,
        controls: null,

        // DNA visualization
        dnaGroup: null,

        // Dynamic helix configuration (can be updated per company)
        dnaHelices: [...FIXED_BREATH_AXES.map((axis, index) => ({
            id: axis.id,
            name: axis.name,
            color: HELIX_COLORS[index],
            angle: (index * Math.PI * 2) / 6,
            faces: [axis.projection, axis.reception],
            names: [`Face ${axis.projection}`, `Face ${axis.reception}`],
            confidence: 'high',
            method: 'fixed',
            breathName: null,
            questions: []
        }))],

        // Data from Quannex engine
        facesData: [],

        // UI state
        selectedHelix: null,
        animationRunning: true,

        // Timestamp for auto-refresh
        lastKnownTimestamp: null
    };

    // ════════════════════════════════════════════════════════════════════════
    // STATE ACCESSORS - Safe getters and setters
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Get current state value
     * @param {string} key - State key
     * @returns {*} State value
     */
    function getState(key) {
        return state[key];
    }

    /**
     * Set state value
     * @param {string} key - State key
     * @param {*} value - New value
     */
    function setState(key, value) {
        if (key in state) {
            state[key] = value;
        } else {
            console.warn(`[OctaveDNAState] Unknown state key: ${key}`);
        }
    }

    /**
     * Get entire state snapshot (for debugging)
     * @returns {Object} Shallow copy of state
     */
    function getStateSnapshot() {
        return { ...state };
    }

    // ════════════════════════════════════════════════════════════════════════
    // BROWSER GLOBAL EXPORT
    // ════════════════════════════════════════════════════════════════════════

    if (typeof window !== 'undefined') {
        window.OctaveDNAState = {
            // Constants (immutable)
            CONFIG,
            HELIX_COLORS,
            FIXED_BREATH_AXES,
            PHI,

            // State accessors
            getState,
            setState,
            getStateSnapshot,

            // Direct state reference (use with care)
            _state: state
        };

        console.log('🧬 [OctaveDNA State] Centralized state registry loaded');
        console.log('   CONFIG: helixHeight=' + CONFIG.helixHeight + ', maxOctaves=' + CONFIG.maxOctaves);
    }

})();
