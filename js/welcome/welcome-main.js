/**
 * ============================================================================
 * WELCOME-MAIN.JS - The Cosmic Orchestrator
 * ============================================================================
 *
 * Part of: Quannex Welcome Experience
 * Purpose: Orchestrates all welcome page modules into a unified cosmic
 *          experience. This is the conductor of the symphony.
 *
 * Architecture:
 * - Initializes all modules in correct order
 * - Coordinates mouse events across modules
 * - Manages the unified animation loop
 * - Handles hyperspace transitions
 *
 * ============================================================================
 * NOTES FOR FUTURE CLAUDE
 * ============================================================================
 *
 * This is the CENTRAL COORDINATOR. When debugging the welcome experience,
 * start here.
 *
 * MODULE INITIALIZATION ORDER:
 * 1. Starfield (creates cosmic canvas background)
 * 2. ConstellationDodecahedron (creates sacred geometry centerpiece)
 * 3. GlassCards (enhances path selection cards)
 * 4. Hyperspace (prepares transition effects)
 *
 * MOUSE COORDINATION:
 * All modules respond to mouse movement. This orchestrator captures mouse
 * events once and distributes normalized coordinates to all modules,
 * ensuring synchronized parallax and interaction effects.
 *
 * DEPENDENCIES:
 * - Three.js (loaded before this script)
 * - starfield.js
 * - constellation-dodecahedron.js
 * - glass-cards.js
 * - hyperspace.js
 *
 * The HTML file should load scripts in this order, or use a bundler.
 *
 * ============================================================================
 */

const WelcomeExperience = (function() {
    'use strict';

    // ========================================================================
    // MODULE REFERENCES
    // ========================================================================

    let modules = {
        starfield: null,
        dodecahedron: null,
        glassCards: null,
        hyperspace: null
    };

    // ========================================================================
    // STATE
    // ========================================================================

    let isInitialized = false;
    let isRunning = false;

    // Unified mouse state
    const mouse = {
        x: 0,       // Normalized -1 to 1
        y: 0
    };

    // ========================================================================
    // INITIALIZATION
    // ========================================================================

    /**
     * Initialize the complete welcome experience
     * @returns {Object} Public API
     */
    function init() {
        if (isInitialized) {
            console.warn('[WelcomeExperience] Already initialized');
            return API;
        }

        console.log('[WelcomeExperience] Initializing cosmic experience...');

        // Initialize modules in order
        initStarfield();
        initDodecahedron();
        initGlassCards();
        initHyperspace();

        // Setup unified mouse tracking
        setupMouseTracking();

        // Start all animations
        start();

        isInitialized = true;
        console.log('[WelcomeExperience] Cosmic experience ready!');

        return API;
    }

    /**
     * Initialize starfield background
     */
    function initStarfield() {
        if (typeof Starfield === 'undefined') {
            console.warn('[WelcomeExperience] Starfield module not loaded');
            return;
        }

        modules.starfield = Starfield.init('starfield-container');
        console.log('[WelcomeExperience] Starfield initialized');
    }

    /**
     * Initialize constellation dodecahedron
     */
    function initDodecahedron() {
        if (typeof ConstellationDodecahedron === 'undefined') {
            console.warn('[WelcomeExperience] ConstellationDodecahedron module not loaded');
            return;
        }

        modules.dodecahedron = ConstellationDodecahedron.init('dodecahedron-canvas');
        console.log('[WelcomeExperience] Dodecahedron initialized');
    }

    /**
     * Initialize glass cards
     */
    function initGlassCards() {
        if (typeof GlassCards === 'undefined') {
            console.warn('[WelcomeExperience] GlassCards module not loaded');
            return;
        }

        modules.glassCards = GlassCards.init({
            onWarp: handleCardWarp
        });
        console.log('[WelcomeExperience] Glass cards initialized');
    }

    /**
     * Initialize hyperspace transition
     */
    function initHyperspace() {
        if (typeof Hyperspace === 'undefined') {
            console.warn('[WelcomeExperience] Hyperspace module not loaded');
            return;
        }

        modules.hyperspace = Hyperspace.init({
            starfield: modules.starfield,
            dodecahedron: modules.dodecahedron
        });
        console.log('[WelcomeExperience] Hyperspace initialized');
    }

    // ========================================================================
    // MOUSE COORDINATION
    // ========================================================================

    /**
     * Setup unified mouse tracking
     */
    function setupMouseTracking() {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseleave', handleMouseLeave);
    }

    /**
     * Handle mouse movement - distribute to all modules
     */
    function handleMouseMove(e) {
        // Normalize to -1 to 1 range
        mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
        mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;

        // Distribute to modules (they handle their own smoothing)
        if (modules.starfield && modules.starfield.setMouse) {
            modules.starfield.setMouse(mouse.x, mouse.y);
        }

        if (modules.dodecahedron && modules.dodecahedron.setMouse) {
            modules.dodecahedron.setMouse(mouse.x, mouse.y);
        }
    }

    /**
     * Handle mouse leaving window
     */
    function handleMouseLeave() {
        mouse.x = 0;
        mouse.y = 0;

        if (modules.starfield && modules.starfield.setMouse) {
            modules.starfield.setMouse(0, 0);
        }

        if (modules.dodecahedron && modules.dodecahedron.setMouse) {
            modules.dodecahedron.setMouse(0, 0);
        }
    }

    // ========================================================================
    // WARP HANDLING
    // ========================================================================

    /**
     * Handle card click - trigger hyperspace transition
     * @param {string} destination - URL to navigate to
     * @param {string} cardType - Type of card clicked
     */
    function handleCardWarp(destination, cardType) {
        console.log(`[WelcomeExperience] Warp requested to: ${destination} (${cardType})`);

        if (modules.hyperspace) {
            modules.hyperspace.engage(destination, cardType);
        } else {
            // Fallback: direct navigation
            window.location.href = destination;
        }
    }

    // ========================================================================
    // ANIMATION CONTROL
    // ========================================================================

    /**
     * Start all animations
     */
    function start() {
        if (isRunning) return;
        isRunning = true;

        if (modules.starfield && modules.starfield.start) {
            modules.starfield.start();
        }

        if (modules.dodecahedron && modules.dodecahedron.start) {
            modules.dodecahedron.start();
        }

        console.log('[WelcomeExperience] Animations started');
    }

    /**
     * Stop all animations
     */
    function stop() {
        if (!isRunning) return;
        isRunning = false;

        if (modules.starfield && modules.starfield.stop) {
            modules.starfield.stop();
        }

        if (modules.dodecahedron && modules.dodecahedron.stop) {
            modules.dodecahedron.stop();
        }

        console.log('[WelcomeExperience] Animations stopped');
    }

    // ========================================================================
    // PUBLIC API
    // ========================================================================

    const API = {
        /**
         * Start the experience
         */
        start,

        /**
         * Stop the experience
         */
        stop,

        /**
         * Trigger hyperspace to a destination
         */
        warpTo(destination) {
            handleCardWarp(destination, 'manual');
        },

        /**
         * Get module references (for debugging)
         */
        getModules() {
            return { ...modules };
        },

        /**
         * Get current mouse position
         */
        getMouse() {
            return { ...mouse };
        },

        /**
         * Check if initialized
         */
        isInitialized() {
            return isInitialized;
        },

        /**
         * Check if running
         */
        isRunning() {
            return isRunning;
        }
    };

    // ========================================================================
    // AUTO-INITIALIZATION
    // ========================================================================

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM already loaded, initialize after a tick to ensure all scripts loaded
        setTimeout(init, 0);
    }

    // ========================================================================
    // EXPORTS
    // ========================================================================

    return API;

})();

// Export for ES modules if supported
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WelcomeExperience;
}
