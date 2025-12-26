/**
 * ============================================================================
 * GLASS-CARDS.JS - Floating Portal Cards
 * ============================================================================
 *
 * Part of: Quannex Welcome Experience
 * Purpose: Creates glassmorphic path selection cards that float in the cosmic
 *          space with 3D tilt effects on hover.
 *
 * Architecture:
 * - Enhances existing path cards with glassmorphism
 * - Adds 3D perspective tilt on mouse movement
 * - Smooth transitions and glow effects
 * - Click triggers hyperspace warp transition
 *
 * ============================================================================
 * NOTES FOR FUTURE CLAUDE
 * ============================================================================
 *
 * This module transforms the path selection cards into magical portals.
 *
 * KEY EFFECTS:
 * 1. GLASSMORPHISM: backdrop-blur, subtle borders, layered transparency
 * 2. 3D TILT: Cards tilt toward cursor when hovered (perspective transform)
 * 3. GLOW: Colored glow intensifies on hover (per-card accent colors)
 * 4. FLOAT: Subtle floating animation when idle
 * 5. CLICK WARP: Clicking card triggers hyperspace, then navigates
 *
 * CARD TYPES (each with unique accent):
 * - Template (purple): Pre-built company profiles
 * - Custom (green): Manual data entry
 * - AI (blue): Gemini-powered analysis
 *
 * Integration: On click, notifies welcome-main.js to trigger hyperspace
 * before navigation.
 *
 * ============================================================================
 */

const GlassCards = (function() {
    'use strict';

    // ========================================================================
    // CONFIGURATION
    // ========================================================================

    const CONFIG = {
        // Card accent colors (match existing theme)
        accents: {
            template: {
                color: '#9370db',        // Purple
                glow: 'rgba(147, 112, 219, 0.4)'
            },
            custom: {
                color: '#00ff88',        // Green
                glow: 'rgba(0, 255, 136, 0.4)'
            },
            ai: {
                color: '#00c8ff',        // Blue
                glow: 'rgba(0, 200, 255, 0.4)'
            }
        },

        // 3D tilt effect
        tilt: {
            maxAngle: 15,               // Maximum tilt in degrees
            perspective: 1000,          // CSS perspective value
            scale: 1.05,                // Scale on hover
            transitionDuration: 400     // ms
        },

        // Glassmorphism
        glass: {
            blur: 12,                   // backdrop-filter blur
            opacity: 0.15,              // background opacity
            borderOpacity: 0.2          // border opacity
        },

        // Floating animation
        float: {
            amplitude: 5,               // pixels
            speed: 3000                 // ms per cycle
        },

        // Glow effect
        glow: {
            baseSize: 20,
            hoverSize: 40,
            baseOpacity: 0.15,
            hoverOpacity: 0.35
        }
    };

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
     * Initialize glass card effects
     * @param {Object} options - Configuration options
     * @param {Function} options.onWarp - Callback when card clicked (before navigation)
     * @returns {Object} Public API
     */
    function init(options = {}) {
        if (isInitialized) {
            console.warn('[GlassCards] Already initialized');
            return API;
        }

        onWarpCallback = options.onWarp || null;

        // Find all path cards
        const cardElements = document.querySelectorAll('.path-card');

        if (cardElements.length === 0) {
            console.warn('[GlassCards] No .path-card elements found');
            return API;
        }

        // Enhance each card
        cardElements.forEach((card, index) => {
            enhanceCard(card, index);
        });

        // Inject additional styles
        injectStyles();

        isInitialized = true;
        console.log(`[GlassCards] Initialized ${cardElements.length} cards`);

        return API;
    }

    /**
     * Enhance a single card with glass effects
     */
    function enhanceCard(card, index) {
        // Determine card type from class
        const type = card.classList.contains('template') ? 'template' :
                     card.classList.contains('custom') ? 'custom' :
                     card.classList.contains('ai') ? 'ai' : 'template';

        const accent = CONFIG.accents[type];

        // Store card data
        const cardData = {
            element: card,
            type: type,
            accent: accent,
            href: card.href,
            bounds: null,
            isHovered: false
        };

        cards.push(cardData);

        // Apply base glass styles
        applyGlassStyles(card, accent);

        // Add floating animation with offset per card
        addFloatingAnimation(card, index);

        // Setup event listeners
        setupCardEvents(cardData);
    }

    /**
     * Apply glassmorphism styles to card
     */
    function applyGlassStyles(card, accent) {
        // Base glass effect
        card.style.cssText += `
            background: rgba(0, 0, 0, ${CONFIG.glass.opacity}) !important;
            backdrop-filter: blur(${CONFIG.glass.blur}px);
            -webkit-backdrop-filter: blur(${CONFIG.glass.blur}px);
            border: 1px solid rgba(255, 255, 255, ${CONFIG.glass.borderOpacity}) !important;
            box-shadow:
                0 ${CONFIG.glow.baseSize}px ${CONFIG.glow.baseSize * 2}px ${accent.glow.replace('0.4', String(CONFIG.glow.baseOpacity))},
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
            transform-style: preserve-3d;
            transition:
                transform ${CONFIG.tilt.transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1),
                box-shadow ${CONFIG.tilt.transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1),
                border-color ${CONFIG.tilt.transitionDuration}ms ease;
        `;
    }

    /**
     * Add subtle floating animation
     */
    function addFloatingAnimation(card, index) {
        // Offset animation start time per card
        const delay = index * (CONFIG.float.speed / 3);

        card.style.animation = `glassCardFloat ${CONFIG.float.speed}ms ease-in-out ${delay}ms infinite`;
    }

    /**
     * Setup mouse events for a card
     */
    function setupCardEvents(cardData) {
        const card = cardData.element;

        // Update bounds on scroll/resize
        const updateBounds = () => {
            cardData.bounds = card.getBoundingClientRect();
        };

        // Mouse enter
        card.addEventListener('mouseenter', (e) => {
            cardData.isHovered = true;
            updateBounds();
            applyHoverGlow(cardData);
        });

        // Mouse move (for 3D tilt)
        card.addEventListener('mousemove', (e) => {
            if (!cardData.isHovered) return;
            applyTilt(cardData, e);
        });

        // Mouse leave
        card.addEventListener('mouseleave', () => {
            cardData.isHovered = false;
            resetTilt(cardData);
            removeHoverGlow(cardData);
        });

        // Click (trigger warp before navigation)
        card.addEventListener('click', (e) => {
            e.preventDefault();
            handleCardClick(cardData);
        });

        // Initial bounds
        updateBounds();
        window.addEventListener('resize', updateBounds);
    }

    // ========================================================================
    // EFFECTS
    // ========================================================================

    /**
     * Apply 3D tilt based on mouse position
     */
    function applyTilt(cardData, event) {
        const card = cardData.element;
        const bounds = cardData.bounds;

        if (!bounds) return;

        // Calculate mouse position relative to card center
        const mouseX = event.clientX - bounds.left;
        const mouseY = event.clientY - bounds.top;

        const centerX = bounds.width / 2;
        const centerY = bounds.height / 2;

        // Calculate tilt angles
        const tiltX = ((mouseY - centerY) / centerY) * CONFIG.tilt.maxAngle;
        const tiltY = ((mouseX - centerX) / centerX) * -CONFIG.tilt.maxAngle;

        // Apply transform
        card.style.transform = `
            perspective(${CONFIG.tilt.perspective}px)
            rotateX(${tiltX}deg)
            rotateY(${tiltY}deg)
            scale(${CONFIG.tilt.scale})
            translateZ(20px)
        `;
    }

    /**
     * Reset tilt to neutral
     */
    function resetTilt(cardData) {
        const card = cardData.element;

        card.style.transform = `
            perspective(${CONFIG.tilt.perspective}px)
            rotateX(0deg)
            rotateY(0deg)
            scale(1)
            translateZ(0px)
        `;
    }

    /**
     * Apply hover glow effect
     */
    function applyHoverGlow(cardData) {
        const card = cardData.element;
        const accent = cardData.accent;

        card.style.boxShadow = `
            0 ${CONFIG.glow.hoverSize}px ${CONFIG.glow.hoverSize * 2}px ${accent.glow.replace('0.4', String(CONFIG.glow.hoverOpacity))},
            inset 0 1px 0 rgba(255, 255, 255, 0.2)
        `;

        card.style.borderColor = accent.color;
    }

    /**
     * Remove hover glow
     */
    function removeHoverGlow(cardData) {
        const card = cardData.element;
        const accent = cardData.accent;

        card.style.boxShadow = `
            0 ${CONFIG.glow.baseSize}px ${CONFIG.glow.baseSize * 2}px ${accent.glow.replace('0.4', String(CONFIG.glow.baseOpacity))},
            inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `;

        card.style.borderColor = `rgba(255, 255, 255, ${CONFIG.glass.borderOpacity})`;
    }

    /**
     * Handle card click with warp effect
     */
    function handleCardClick(cardData) {
        const href = cardData.href;

        // Notify parent to trigger hyperspace
        if (onWarpCallback) {
            onWarpCallback(href, cardData.type);
        } else {
            // Fallback: navigate directly
            window.location.href = href;
        }
    }

    // ========================================================================
    // STYLE INJECTION
    // ========================================================================

    /**
     * Inject required CSS animations
     */
    function injectStyles() {
        const styleId = 'glass-cards-styles';

        // Don't inject twice
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            /* Glass Cards Floating Animation */
            @keyframes glassCardFloat {
                0%, 100% {
                    transform: translateY(0px);
                }
                50% {
                    transform: translateY(-${CONFIG.float.amplitude}px);
                }
            }

            /* Enhance path card titles on hover */
            .path-card:hover .path-title {
                text-shadow: 0 0 20px currentColor;
            }

            /* Icon glow on hover */
            .path-card:hover .path-icon {
                transform: scale(1.1);
                filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
            }

            .path-icon {
                transition: transform 0.3s ease, filter 0.3s ease;
            }

            /* Glass reflection layer */
            .path-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 50%;
                background: linear-gradient(
                    to bottom,
                    rgba(255, 255, 255, 0.1) 0%,
                    rgba(255, 255, 255, 0.05) 50%,
                    transparent 100%
                );
                border-radius: inherit;
                pointer-events: none;
            }

            /* Ensure cards have relative positioning */
            .path-card {
                position: relative;
                overflow: hidden;
            }
        `;

        document.head.appendChild(style);
    }

    // ========================================================================
    // PUBLIC API
    // ========================================================================

    const API = {
        /**
         * Set callback for warp trigger
         */
        setOnWarp(callback) {
            onWarpCallback = callback;
        },

        /**
         * Trigger click on a specific card type
         */
        triggerCard(type) {
            const cardData = cards.find(c => c.type === type);
            if (cardData) {
                handleCardClick(cardData);
            }
        },

        /**
         * Get all card data
         */
        getCards() {
            return cards.map(c => ({
                type: c.type,
                href: c.href
            }));
        },

        /**
         * Check if initialized
         */
        isInitialized() {
            return isInitialized;
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
    module.exports = GlassCards;
}
