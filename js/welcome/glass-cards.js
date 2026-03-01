/**
 * ============================================================================
 * GLASS-CARDS.JS - Welcome Page Card Behavior
 * ============================================================================
 *
 * Purpose: Welcome-page-specific card behavior. Handles click events that
 *          trigger hyperspace warp transitions before navigation.
 *
 * Visual effects are delegated to the GlowCard component
 * (js/components/glow-card.js + css/components/glow-card.css).
 *
 * Architecture:
 *   - Finds path cards on the welcome page
 *   - Initializes GlowCard for visual effects (glow, tilt, rainbow)
 *   - Adds click handlers that trigger hyperspace warp before navigation
 *   - Prevents default link behavior during warp animation
 *
 * Dependencies:
 *   - GlowCard (js/components/glow-card.js) - must be loaded first
 *   - Logger (js/utils/logger.js) - optional
 *
 * ============================================================================
 * NOTES FOR FUTURE CLAUDE
 * ============================================================================
 *
 * This file used to contain all visual effects (glassmorphism, 3D tilt,
 * floating animation, glow). Those were extracted into the reusable
 * GlowCard component. This file now ONLY handles welcome-page behavior:
 *
 * 1. Find .path-card elements
 * 2. Initialize GlowCard on them (visual layer)
 * 3. Intercept clicks to trigger hyperspace warp
 * 4. Navigate after warp completes
 *
 * If you need to change how the cards LOOK, edit glow-card.css/glow-card.js.
 * If you need to change what happens when cards are CLICKED, edit this file.
 *
 * ============================================================================
 */

const GlassCards = (function () {
    'use strict';

    // ========================================================================
    // STATE
    // ========================================================================

    let cards = [];
    let isInitialized = false;
    let onWarpCallback = null;

    // ========================================================================
    // INITIALIZATION
    // ========================================================================

    /**
     * Initialize welcome page card behavior.
     * @param {Object} options
     * @param {Function} options.onWarp - Callback when card clicked (before navigation)
     * @returns {Object} Public API
     */
    function init(options) {
        if (isInitialized) {
            log('warn', 'Already initialized');
            return API;
        }

        options = options || {};
        onWarpCallback = options.onWarp || null;

        // Find all path cards
        var cardElements = document.querySelectorAll('.path-card');

        if (cardElements.length === 0) {
            log('warn', 'No .path-card elements found');
            return API;
        }

        // Initialize GlowCard component for visual effects
        if (typeof GlowCard !== 'undefined') {
            GlowCard.init('.path-card');
            log('info', 'GlowCard visual layer initialized');
        } else {
            log('warn', 'GlowCard component not loaded - cards will have no visual effects');
        }

        // Setup click handlers on each card
        cardElements.forEach(function (card) {
            var type = card.classList.contains('template') ? 'template' :
                       card.classList.contains('custom') ? 'custom' :
                       card.classList.contains('ai') ? 'ai' : 'template';

            var cardData = {
                element: card,
                type: type,
                href: card.href
            };

            cards.push(cardData);

            card.addEventListener('click', function (e) {
                e.preventDefault();
                handleCardClick(cardData);
            });
        });

        isInitialized = true;
        log('info', 'Initialized ' + cards.length + ' card behaviors');

        return API;
    }

    // ========================================================================
    // CLICK HANDLING
    // ========================================================================

    /**
     * Handle card click - trigger warp before navigation.
     */
    function handleCardClick(cardData) {
        if (onWarpCallback) {
            onWarpCallback(cardData.href, cardData.type);
        } else {
            window.location.href = cardData.href;
        }
    }

    // ========================================================================
    // UTILITIES
    // ========================================================================

    function log(level, message) {
        if (typeof Logger !== 'undefined' && Logger[level]) {
            Logger[level]('GlassCards', message);
        }
    }

    // ========================================================================
    // PUBLIC API
    // ========================================================================

    var API = {
        setOnWarp: function (callback) {
            onWarpCallback = callback;
        },

        triggerCard: function (type) {
            var cardData = cards.find(function (c) { return c.type === type; });
            if (cardData) handleCardClick(cardData);
        },

        getCards: function () {
            return cards.map(function (c) {
                return { type: c.type, href: c.href };
            });
        },

        isInitialized: function () {
            return isInitialized;
        }
    };

    // ========================================================================
    // EXPORTS
    // ========================================================================

    return { init: init, ...API };

})();

// Export for ES modules if supported
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GlassCards;
}
