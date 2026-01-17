/**
 * ============================================================================
 * HYPERSPACE.JS - The Warp Transition
 * ============================================================================
 *
 * Part of: Quannex Welcome Experience
 * Purpose: Coordinates the hyperspace warp effect when transitioning from
 *          welcome page to the demo orchestrator.
 *
 * Architecture:
 * - Orchestrates multiple visual effects during transition
 * - Starfield warp (stars streak outward)
 * - Dodecahedron dissolve (constellation scatters)
 * - Screen flash and fade to white
 * - Smooth navigation after effect completes
 *
 * ============================================================================
 * NOTES FOR FUTURE CLAUDE
 * ============================================================================
 *
 * This module creates the magical moment of "entering" Quannex.
 *
 * TRANSITION SEQUENCE:
 * 1. User clicks a path card
 * 2. Glass card pulses with glow
 * 3. Starfield enters hyperspace mode (stars streak)
 * 4. Dodecahedron vertices scatter outward
 * 5. Screen flashes white briefly
 * 6. Fade to white overlay
 * 7. Navigate to destination
 *
 * TIMING (all in ms):
 * - Card pulse: 0-200
 * - Stars warp: 200-1500
 * - Dodecahedron dissolve: 200-1200
 * - Screen flash: 1200-1400
 * - Fade complete: 1500
 * - Navigate: 1600
 *
 * The whole effect takes ~1.6 seconds - long enough to feel magical,
 * short enough to not frustrate.
 *
 * ============================================================================
 */

const Hyperspace = (function () {
    'use strict';

    // ========================================================================
    // CONFIGURATION
    // ========================================================================

    const CONFIG = {
        // Timing (ms)
        timing: {
            cardPulse: 200,
            warpStart: 200,
            warpDuration: 1300,
            dissolveStart: 200,
            dissolveDuration: 1000,
            flashStart: 1200,
            flashDuration: 200,
            fadeStart: 1300,
            fadeDuration: 300,
            navigateDelay: 1600
        },

        // Visual
        flash: {
            color: 'rgba(0, 255, 204, 0.8)',    // Quannex teal flash
            peakOpacity: 0.6
        },

        fade: {
            color: '#0a0a1a'                     // Dark fade (matching bg)
        }
    };

    // ========================================================================
    // STATE
    // ========================================================================

    let isTransitioning = false;
    let overlayElement = null;
    let flashElement = null;

    // Module references (set during init)
    let starfieldModule = null;
    let dodecahedronModule = null;

    // ========================================================================
    // INITIALIZATION
    // ========================================================================

    /**
     * Initialize hyperspace transition system
     * @param {Object} modules - References to other modules
     * @param {Object} modules.starfield - Starfield module
     * @param {Object} modules.dodecahedron - ConstellationDodecahedron module
     * @returns {Object} Public API
     */
    function init(modules = {}) {
        starfieldModule = modules.starfield || null;
        dodecahedronModule = modules.dodecahedron || null;

        createOverlayElements();

        Logger.info('Hyperspace', 'Initialized');
        return API;
    }

    /**
     * Create overlay elements for flash and fade effects
     */
    function createOverlayElements() {
        // Flash overlay (brief teal flash)
        flashElement = document.createElement('div');
        flashElement.id = 'hyperspace-flash';
        flashElement.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: ${CONFIG.flash.color};
            opacity: 0;
            pointer-events: none;
            z-index: 9998;
            transition: opacity ${CONFIG.timing.flashDuration}ms ease-out;
        `;
        document.body.appendChild(flashElement);

        // Fade overlay (dark fade out)
        overlayElement = document.createElement('div');
        overlayElement.id = 'hyperspace-overlay';
        overlayElement.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: ${CONFIG.fade.color};
            opacity: 0;
            pointer-events: none;
            z-index: 9999;
            transition: opacity ${CONFIG.timing.fadeDuration}ms ease-in;
        `;
        document.body.appendChild(overlayElement);
    }

    // ========================================================================
    // TRANSITION SEQUENCE
    // ========================================================================

    /**
     * Trigger the hyperspace transition
     * @param {string} destination - URL to navigate to after transition
     * @param {string} cardType - Type of card clicked (for potential customization)
     * @returns {Promise} Resolves when transition completes
     */
    function engage(destination, cardType = 'default') {
        if (isTransitioning) {
            Logger.warn('Hyperspace', 'Already transitioning');
            return Promise.resolve();
        }

        isTransitioning = true;
        Logger.info('Hyperspace', `Engaging warp to: ${destination}`);

        return new Promise((resolve) => {
            // Start the sequence
            const startTime = performance.now();

            // 1. Trigger starfield warp
            setTimeout(() => {
                if (starfieldModule && starfieldModule.warp) {
                    starfieldModule.warp();
                }
            }, CONFIG.timing.warpStart);

            // 2. Trigger dodecahedron dissolve
            setTimeout(() => {
                if (dodecahedronModule && dodecahedronModule.dissolve) {
                    dodecahedronModule.dissolve();
                }
            }, CONFIG.timing.dissolveStart);

            // 3. Flash effect
            setTimeout(() => {
                triggerFlash();
            }, CONFIG.timing.flashStart);

            // 4. Fade to black
            setTimeout(() => {
                triggerFade();
            }, CONFIG.timing.fadeStart);

            // 5. Navigate after transition completes
            setTimeout(() => {
                isTransitioning = false;

                if (destination) {
                    window.location.href = destination;
                }

                resolve();
            }, CONFIG.timing.navigateDelay);
        });
    }

    /**
     * Trigger the teal flash effect
     */
    function triggerFlash() {
        flashElement.style.opacity = CONFIG.flash.peakOpacity;

        setTimeout(() => {
            flashElement.style.opacity = 0;
        }, CONFIG.timing.flashDuration / 2);
    }

    /**
     * Trigger the fade to dark overlay
     */
    function triggerFade() {
        overlayElement.style.opacity = 1;
    }

    /**
     * Reset the transition state (for back navigation)
     */
    function reset() {
        isTransitioning = false;
        overlayElement.style.opacity = 0;
        flashElement.style.opacity = 0;
    }

    // ========================================================================
    // PUBLIC API
    // ========================================================================

    const API = {
        /**
         * Engage hyperspace transition
         * @param {string} destination - URL to navigate to
         * @param {string} cardType - Type of card clicked
         */
        engage,

        /**
         * Reset transition state
         */
        reset,

        /**
         * Check if currently transitioning
         */
        isTransitioning() {
            return isTransitioning;
        },

        /**
         * Update module references
         */
        setModules(modules) {
            if (modules.starfield) starfieldModule = modules.starfield;
            if (modules.dodecahedron) dodecahedronModule = modules.dodecahedron;
        },

        /**
         * Get configuration
         */
        getConfig() {
            return { ...CONFIG };
        }
    };

    // ========================================================================
    // EXPORTS
    // ========================================================================

    return { init, ...API };

})();

// Export for ES modules if supported
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Hyperspace;
}
