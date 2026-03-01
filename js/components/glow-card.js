/**
 * ============================================================================
 * GLOW-CARD.JS - Inner Light Interactive Engine
 * ============================================================================
 *
 * Purpose: Brings glow cards to life with mouse-reactive behavior.
 *          Handles proximity detection, edge glow positioning, rainbow color
 *          cycling with phi-ratio breathing, neon flowing border animation,
 *          and 3D tilt effects.
 *
 * Usage:
 *   GlowCard.init('.glow-card');           // Enhance all matching elements
 *   GlowCard.enhance(singleElement);       // Enhance one element
 *   GlowCard.destroy();                    // Clean up everything
 *
 * Requires: css/components/glow-card.css loaded first
 *
 * Architecture:
 *   - Self-contained mouse tracking (no external coordinator needed)
 *   - Single requestAnimationFrame loop for all cards
 *   - CSS custom properties bridge: JS writes, CSS reads
 *   - Phi-ratio breathing rhythm for organic color cycling
 *
 * ============================================================================
 * NOTES FOR FUTURE CLAUDE
 * ============================================================================
 *
 * This is a REUSABLE COMPONENT. It knows nothing about welcome.html,
 * hyperspace, warp effects, or any page-specific behavior.
 *
 * HOW THE ANIMATION WORKS:
 * 1. A single rAF loop runs continuously when cards exist
 * 2. Each frame: advance global hue (rainbow), update breath phase
 * 3. For each card: measure mouse distance, calculate intensity + position
 * 4. Write CSS custom properties to each card element
 * 5. CSS handles all the visual rendering via those properties
 *
 * THE PHI BREATHING:
 * The rainbow color cycle speed oscillates using a sine wave whose period
 * is derived from the golden ratio (phi = 1.618...). This creates an
 * organic, living rhythm:
 *   - Fastest: ~3 seconds per full spectrum cycle
 *   - Slowest: ~8 seconds per full spectrum cycle
 *   - Breath period: ~13 seconds (8 * phi) for one in-out cycle
 * The effect: colors sometimes rush, sometimes drift. Never mechanical.
 *
 * EDGE GLOW POSITIONING:
 * When mouse is OUTSIDE the card: glow center = nearest point on card
 * boundary (clamp mouse coords to card rect). This naturally creates edge
 * glow on the side facing the cursor.
 * When mouse is INSIDE: glow center = cursor position within the card.
 * Transition between states is smoothed via lerp.
 *
 * ============================================================================
 */

const GlowCard = (function () {
    'use strict';

    // ========================================================================
    // CONSTANTS
    // ========================================================================

    const PHI = 1.618033988749895;

    // ========================================================================
    // CONFIGURATION
    // ========================================================================

    const CONFIG = {
        proximity: {
            activationDistance: 300,     // px from card edge to start glow
        },

        tilt: {
            maxAngle: 12,               // degrees (slightly less than original 15)
            perspective: 1000,          // CSS perspective value
            scale: 1.04,               // scale on hover
        },

        rainbow: {
            minCycleTime: 3000,         // ms for fastest full-spectrum cycle
            maxCycleTime: 8000,         // ms for slowest full-spectrum cycle
            breathPeriod: 8000 * PHI,   // ~12,944ms for one in-out breath
        },

        border: {
            revolutionTime: 2500,       // ms for one full border revolution
        },

        smoothing: {
            intensity: 0.08,            // lerp factor for glow intensity
            position: 0.06,             // lerp factor for glow position
            tilt: 0.10,                 // lerp factor for tilt angles
        },
    };

    // ========================================================================
    // STATE
    // ========================================================================

    const cards = [];
    let animationFrameId = null;
    let isRunning = false;
    let lastTimestamp = 0;

    // Global animation state (shared across all cards)
    let globalHue = 0;
    let breathPhase = 0;
    let borderAngle = 0;

    // Mouse position (absolute screen coordinates)
    const mouse = { x: -9999, y: -9999 };

    // ========================================================================
    // INITIALIZATION
    // ========================================================================

    /**
     * Initialize glow effect on all elements matching selector.
     * @param {string} selector - CSS selector for target elements
     * @returns {Object} Public API
     */
    function init(selector) {
        const elements = document.querySelectorAll(selector || '.glow-card');

        if (elements.length === 0) {
            log('warn', 'No elements found for selector: ' + selector);
            return API;
        }

        elements.forEach(function (el) {
            enhance(el);
        });

        // Start global mouse tracking
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseleave', onMouseLeave);

        // Start animation loop
        startAnimation();

        log('info', 'Initialized ' + cards.length + ' glow cards');
        return API;
    }

    /**
     * Enhance a single element with glow card behavior.
     * @param {HTMLElement} element - The element to enhance
     * @returns {Object} Card data reference
     */
    function enhance(element) {
        // Ensure the CSS class is applied
        element.classList.add('glow-card');

        var cardData = {
            element: element,
            // Current animated values (smoothed)
            intensity: 0,
            glowX: 50,
            glowY: 50,
            tiltX: 0,
            tiltY: 0,
            currentScale: 1,
            // Target values (raw, before smoothing)
            targetIntensity: 0,
            targetGlowX: 50,
            targetGlowY: 50,
            targetTiltX: 0,
            targetTiltY: 0,
            targetScale: 1,
        };

        cards.push(cardData);

        // Start animation if not running
        if (!isRunning) {
            startAnimation();
        }

        return cardData;
    }

    // ========================================================================
    // MOUSE TRACKING
    // ========================================================================

    function onMouseMove(e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    }

    function onMouseLeave() {
        mouse.x = -9999;
        mouse.y = -9999;
    }

    // ========================================================================
    // ANIMATION LOOP
    // ========================================================================

    function startAnimation() {
        if (isRunning) return;
        isRunning = true;
        lastTimestamp = performance.now();
        animationFrameId = requestAnimationFrame(animate);
    }

    function stopAnimation() {
        if (!isRunning) return;
        isRunning = false;
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    }

    /**
     * Main animation frame - updates all cards
     */
    function animate(timestamp) {
        var dt = timestamp - lastTimestamp;
        lastTimestamp = timestamp;

        // Clamp dt to avoid huge jumps when tab was inactive
        if (dt > 100) dt = 16;

        // --- Global rainbow update ---
        updateRainbow(dt);

        // --- Per-card update ---
        for (var i = 0; i < cards.length; i++) {
            updateCardTargets(cards[i]);
            smoothCardValues(cards[i], dt);
            applyCardStyles(cards[i]);
        }

        if (isRunning) {
            animationFrameId = requestAnimationFrame(animate);
        }
    }

    // ========================================================================
    // RAINBOW BREATHING
    // ========================================================================

    /**
     * Advance global animations: rainbow hue + neon border angle.
     * Rainbow speed oscillates with phi-ratio breathing.
     * Border rotates at a steady pace (electricity doesn't breathe).
     */
    function updateRainbow(dt) {
        // Advance breath phase
        breathPhase += (dt / CONFIG.rainbow.breathPeriod) * Math.PI * 2;

        // Calculate current breath position (0 to 1, sinusoidal)
        var breathFactor = (Math.sin(breathPhase) + 1) / 2;

        // Interpolate cycle time between fast and slow
        var currentCycleTime = CONFIG.rainbow.minCycleTime +
            breathFactor * (CONFIG.rainbow.maxCycleTime - CONFIG.rainbow.minCycleTime);

        // Advance hue based on current speed
        globalHue = (globalHue + (dt / currentCycleTime) * 360) % 360;

        // Advance border angle at steady rate (electricity flow)
        borderAngle = (borderAngle + (dt / CONFIG.border.revolutionTime) * 360) % 360;
    }

    // ========================================================================
    // PER-CARD CALCULATIONS
    // ========================================================================

    /**
     * Calculate raw target values for a card based on mouse position.
     */
    function updateCardTargets(cardData) {
        var el = cardData.element;
        var rect = el.getBoundingClientRect();

        // --- Distance from mouse to card ---
        var distX = Math.max(rect.left - mouse.x, 0, mouse.x - rect.right);
        var distY = Math.max(rect.top - mouse.y, 0, mouse.y - rect.bottom);
        var distance = Math.sqrt(distX * distX + distY * distY);

        var isInside = mouse.x >= rect.left && mouse.x <= rect.right &&
                       mouse.y >= rect.top && mouse.y <= rect.bottom;

        // --- Intensity ---
        if (isInside) {
            cardData.targetIntensity = 1;
        } else if (distance < CONFIG.proximity.activationDistance) {
            var raw = 1 - (distance / CONFIG.proximity.activationDistance);
            cardData.targetIntensity = raw * raw; // quadratic ease
        } else {
            cardData.targetIntensity = 0;
        }

        // --- Glow position (nearest point on card boundary, or cursor if inside) ---
        if (isInside || distance < CONFIG.proximity.activationDistance) {
            var nearX = clamp(mouse.x, rect.left, rect.right) - rect.left;
            var nearY = clamp(mouse.y, rect.top, rect.bottom) - rect.top;

            cardData.targetGlowX = (nearX / rect.width) * 100;
            cardData.targetGlowY = (nearY / rect.height) * 100;
        }
        // else: keep last known position (graceful fade-out)

        // --- 3D tilt ---
        if (isInside) {
            var centerX = rect.width / 2;
            var centerY = rect.height / 2;
            var mouseRelX = mouse.x - rect.left;
            var mouseRelY = mouse.y - rect.top;

            cardData.targetTiltX = ((mouseRelY - centerY) / centerY) * CONFIG.tilt.maxAngle;
            cardData.targetTiltY = ((mouseRelX - centerX) / centerX) * -CONFIG.tilt.maxAngle;
            cardData.targetScale = CONFIG.tilt.scale;
        } else {
            cardData.targetTiltX = 0;
            cardData.targetTiltY = 0;
            cardData.targetScale = 1;
        }
    }

    /**
     * Smooth card values toward targets using lerp.
     */
    function smoothCardValues(cardData, dt) {
        // Time-adjusted lerp factor (frame-rate independent)
        var timeFactor = Math.min(dt / 16, 3); // normalize to ~60fps

        cardData.intensity = lerp(
            cardData.intensity,
            cardData.targetIntensity,
            CONFIG.smoothing.intensity * timeFactor
        );

        cardData.glowX = lerp(
            cardData.glowX,
            cardData.targetGlowX,
            CONFIG.smoothing.position * timeFactor
        );

        cardData.glowY = lerp(
            cardData.glowY,
            cardData.targetGlowY,
            CONFIG.smoothing.position * timeFactor
        );

        cardData.tiltX = lerp(
            cardData.tiltX,
            cardData.targetTiltX,
            CONFIG.smoothing.tilt * timeFactor
        );

        cardData.tiltY = lerp(
            cardData.tiltY,
            cardData.targetTiltY,
            CONFIG.smoothing.tilt * timeFactor
        );

        cardData.currentScale = lerp(
            cardData.currentScale,
            cardData.targetScale,
            CONFIG.smoothing.tilt * timeFactor
        );

        // Snap to zero when very close (avoid sub-pixel rendering waste)
        if (cardData.intensity < 0.001) cardData.intensity = 0;
    }

    /**
     * Write CSS custom properties and transform to card element.
     */
    function applyCardStyles(cardData) {
        var el = cardData.element;
        var style = el.style;

        // CSS custom properties (read by glow-card.css)
        style.setProperty('--glow-hue', globalHue.toFixed(1));
        style.setProperty('--glow-intensity', cardData.intensity.toFixed(4));
        style.setProperty('--glow-x', cardData.glowX.toFixed(1) + '%');
        style.setProperty('--glow-y', cardData.glowY.toFixed(1) + '%');
        style.setProperty('--border-angle', borderAngle.toFixed(1) + 'deg');

        // 3D transform (applied directly for performance)
        style.transform =
            'perspective(' + CONFIG.tilt.perspective + 'px) ' +
            'rotateX(' + cardData.tiltX.toFixed(2) + 'deg) ' +
            'rotateY(' + cardData.tiltY.toFixed(2) + 'deg) ' +
            'scale(' + cardData.currentScale.toFixed(4) + ')';
    }

    // ========================================================================
    // UTILITIES
    // ========================================================================

    function lerp(current, target, factor) {
        return current + (target - current) * factor;
    }

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    function log(level, message) {
        if (typeof Logger !== 'undefined' && Logger[level]) {
            Logger[level]('GlowCard', message);
        } else {
            console[level]('[GlowCard] ' + message);
        }
    }

    // ========================================================================
    // CLEANUP
    // ========================================================================

    /**
     * Remove all glow card effects and event listeners.
     */
    function destroy() {
        stopAnimation();

        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseleave', onMouseLeave);

        for (var i = 0; i < cards.length; i++) {
            var el = cards[i].element;
            el.style.removeProperty('--glow-hue');
            el.style.removeProperty('--glow-intensity');
            el.style.removeProperty('--glow-x');
            el.style.removeProperty('--glow-y');
            el.style.transform = '';
        }

        cards.length = 0;
        log('info', 'Destroyed all glow cards');
    }

    // ========================================================================
    // PUBLIC API
    // ========================================================================

    var API = {
        init: init,
        enhance: enhance,
        destroy: destroy,

        /** Get current global hue (0-360) */
        getHue: function () { return globalHue; },

        /** Get current breath phase */
        getBreathPhase: function () { return breathPhase; },

        /** Get number of active cards */
        getCardCount: function () { return cards.length; },

        /** Update configuration at runtime */
        setConfig: function (overrides) {
            if (overrides.proximity) Object.assign(CONFIG.proximity, overrides.proximity);
            if (overrides.tilt) Object.assign(CONFIG.tilt, overrides.tilt);
            if (overrides.rainbow) Object.assign(CONFIG.rainbow, overrides.rainbow);
            if (overrides.smoothing) Object.assign(CONFIG.smoothing, overrides.smoothing);
        },

        /** Pause/resume animation */
        pause: function () { stopAnimation(); },
        resume: function () { startAnimation(); },
    };

    // ========================================================================
    // EXPORTS
    // ========================================================================

    return API;

})();

// Export for ES modules if supported
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GlowCard;
}
