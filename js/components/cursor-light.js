/**
 * ============================================================================
 * CURSOR-LIGHT.JS - Darkness & Light Reveal Engine
 * ============================================================================
 *
 * Purpose: Transforms a page into a pitch-black discovery experience.
 *          The cursor (or device tilt on mobile) becomes the sole light source.
 *          Content elements reveal themselves with slide-in animations
 *          as the light approaches them.
 *
 * Usage:
 *   CursorLight.init({
 *       scene: 'body',                    // element to darken
 *       revealSelector: '.light-reveal',  // elements to reveal on proximity
 *       revealDistance: 350               // px from cursor to trigger reveal
 *   });
 *
 * Requires: css/components/cursor-light.css loaded first
 *
 * Architecture:
 *   - Creates a .cursor-glow element (light halo following cursor)
 *   - Tracks mouse position (desktop) or device orientation (mobile)
 *   - Scans .light-reveal elements each frame for proximity
 *   - Toggles .light-reveal--visible class based on distance
 *   - CSS handles all transitions (opacity, transform)
 *
 * ============================================================================
 * NOTES FOR FUTURE CLAUDE
 * ============================================================================
 *
 * DESKTOP: mousemove drives cursor position.
 * MOBILE: DeviceOrientationEvent (gyroscope) maps tilt to a virtual cursor
 * position on screen. Beta (front/back tilt) maps to Y, Gamma (left/right
 * tilt) maps to X. Requires user permission on iOS (requestPermission).
 *
 * REVEAL LOGIC:
 * Elements are revealed when cursor is within revealDistance of their
 * bounding rect center. Once revealed, they STAY visible (one-way reveal).
 * This prevents flicker and creates the feeling of "discovering" content
 * permanently as you explore.
 *
 * The reveal is ONE-WAY by default: once visible, stays visible.
 * Set keepRevealed: false in config for two-way (hide when cursor leaves).
 *
 * PERFORMANCE:
 * - getBoundingClientRect() is called per element per frame. For pages with
 *   hundreds of .light-reveal elements, consider throttling or spatial hash.
 * - For the welcome page (< 20 elements), this is negligible.
 *
 * ============================================================================
 */

const CursorLight = (function () {
    'use strict';

    // ========================================================================
    // CONFIGURATION
    // ========================================================================

    var CONFIG = {
        revealDistance: 350,         // px from cursor to trigger element reveal
        keepRevealed: true,         // once visible, stay visible (one-way)
        glowSize: 500,             // px diameter of cursor glow halo
        gyroSensitivity: 8,        // multiplier for gyroscope tilt-to-px conversion
    };

    // ========================================================================
    // STATE
    // ========================================================================

    var glowElement = null;
    var revealElements = [];
    var isInitialized = false;
    var animationFrameId = null;
    var isRunning = false;
    var useGyroscope = false;

    // Light source position (screen coordinates)
    var light = { x: -9999, y: -9999 };

    // ========================================================================
    // INITIALIZATION
    // ========================================================================

    /**
     * Initialize the cursor light system.
     * @param {Object} options - Configuration overrides
     */
    function init(options) {
        if (isInitialized) return API;

        if (options) {
            if (options.revealDistance) CONFIG.revealDistance = options.revealDistance;
            if (options.keepRevealed !== undefined) CONFIG.keepRevealed = options.keepRevealed;
            if (options.glowSize) CONFIG.glowSize = options.glowSize;
        }

        // Apply scene class to body
        document.body.classList.add('cursor-light-scene');

        // Create the glow halo element
        createGlowElement();

        // Collect all revealable elements
        collectRevealElements(options && options.revealSelector || '.light-reveal');

        // Detect input method and bind handlers
        if (isTouchDevice()) {
            initGyroscope();
        } else {
            initMouseTracking();
        }

        // Start animation loop
        startAnimation();

        isInitialized = true;
        log('info', 'Initialized with ' + revealElements.length + ' reveal elements');

        return API;
    }

    // ========================================================================
    // GLOW ELEMENT
    // ========================================================================

    function createGlowElement() {
        glowElement = document.createElement('div');
        glowElement.className = 'cursor-glow';
        glowElement.style.width = CONFIG.glowSize + 'px';
        glowElement.style.height = CONFIG.glowSize + 'px';
        document.body.appendChild(glowElement);
    }

    // ========================================================================
    // REVEAL ELEMENTS
    // ========================================================================

    function collectRevealElements(selector) {
        var elements = document.querySelectorAll(selector);
        revealElements = [];
        for (var i = 0; i < elements.length; i++) {
            revealElements.push({
                element: elements[i],
                revealed: false,
                centerX: 0,
                centerY: 0,
            });
        }
    }

    // ========================================================================
    // MOUSE TRACKING (Desktop)
    // ========================================================================

    function initMouseTracking() {
        document.addEventListener('mousemove', function (e) {
            light.x = e.clientX;
            light.y = e.clientY;

            // Activate glow on first mouse move
            if (glowElement && !glowElement.classList.contains('cursor-glow--active')) {
                glowElement.classList.add('cursor-glow--active');
            }
        });

        document.addEventListener('mouseleave', function () {
            light.x = -9999;
            light.y = -9999;
        });
    }

    // ========================================================================
    // GYROSCOPE TRACKING (Mobile)
    // ========================================================================

    function initGyroscope() {
        useGyroscope = true;

        // iOS requires explicit permission request
        if (typeof DeviceOrientationEvent !== 'undefined' &&
            typeof DeviceOrientationEvent.requestPermission === 'function') {

            // Need a user gesture to request. Add a one-time touch handler.
            document.addEventListener('touchstart', function requestGyro() {
                DeviceOrientationEvent.requestPermission()
                    .then(function (state) {
                        if (state === 'granted') {
                            bindGyroscope();
                            // Activate glow
                            if (glowElement) {
                                glowElement.classList.add('cursor-glow--active');
                            }
                        }
                    })
                    .catch(function (err) {
                        log('warn', 'Gyroscope permission denied: ' + err);
                    });

                document.removeEventListener('touchstart', requestGyro);
            }, { once: true });

        } else {
            // Non-iOS: bind directly
            bindGyroscope();
            if (glowElement) {
                glowElement.classList.add('cursor-glow--active');
            }
        }

        // Also support touch drag as fallback
        document.addEventListener('touchmove', function (e) {
            if (e.touches.length > 0) {
                light.x = e.touches[0].clientX;
                light.y = e.touches[0].clientY;
            }
        });
    }

    function bindGyroscope() {
        window.addEventListener('deviceorientation', function (e) {
            // Beta: front/back tilt (-180 to 180), map to Y
            // Gamma: left/right tilt (-90 to 90), map to X
            var beta = e.beta || 0;   // front/back
            var gamma = e.gamma || 0; // left/right

            var viewW = window.innerWidth;
            var viewH = window.innerHeight;

            // Map tilt to screen position (centered)
            light.x = (viewW / 2) + (gamma * CONFIG.gyroSensitivity);
            light.y = (viewH / 2) + ((beta - 45) * CONFIG.gyroSensitivity); // offset: natural hold ~45°
        });
    }

    // ========================================================================
    // ANIMATION LOOP
    // ========================================================================

    function startAnimation() {
        if (isRunning) return;
        isRunning = true;
        animationFrameId = requestAnimationFrame(animate);
    }

    function animate() {
        // Move the glow halo to cursor position
        if (glowElement && light.x > -9000) {
            glowElement.style.transform =
                'translate(' + (light.x - CONFIG.glowSize / 2) + 'px, ' +
                (light.y - CONFIG.glowSize / 2) + 'px)';
        }

        // Check proximity for each reveal element
        for (var i = 0; i < revealElements.length; i++) {
            updateRevealElement(revealElements[i]);
        }

        if (isRunning) {
            animationFrameId = requestAnimationFrame(animate);
        }
    }

    /**
     * Check if cursor is close enough to reveal an element.
     */
    function updateRevealElement(item) {
        // Skip if already permanently revealed
        if (CONFIG.keepRevealed && item.revealed) return;

        var el = item.element;
        var rect = el.getBoundingClientRect();

        // Element center
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;

        // Distance from light to element center
        var dx = light.x - cx;
        var dy = light.y - cy;
        var distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < CONFIG.revealDistance) {
            if (!item.revealed) {
                el.classList.add('light-reveal--visible');
                item.revealed = true;
            }
        } else if (!CONFIG.keepRevealed) {
            // Two-way mode: hide when cursor moves away
            if (item.revealed) {
                el.classList.remove('light-reveal--visible');
                item.revealed = false;
            }
        }
    }

    // ========================================================================
    // UTILITIES
    // ========================================================================

    function isTouchDevice() {
        return ('ontouchstart' in window) ||
               (navigator.maxTouchPoints > 0) ||
               (navigator.msMaxTouchPoints > 0);
    }

    function log(level, message) {
        if (typeof Logger !== 'undefined' && Logger[level]) {
            Logger[level]('CursorLight', message);
        } else {
            console[level]('[CursorLight] ' + message);
        }
    }

    // ========================================================================
    // CLEANUP
    // ========================================================================

    function destroy() {
        isRunning = false;
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }

        document.body.classList.remove('cursor-light-scene');

        if (glowElement && glowElement.parentNode) {
            glowElement.parentNode.removeChild(glowElement);
            glowElement = null;
        }

        for (var i = 0; i < revealElements.length; i++) {
            revealElements[i].element.classList.remove('light-reveal--visible');
        }

        revealElements = [];
        isInitialized = false;

        log('info', 'Destroyed');
    }

    // ========================================================================
    // PUBLIC API
    // ========================================================================

    var API = {
        init: init,
        destroy: destroy,

        /** Get current light position */
        getLight: function () { return { x: light.x, y: light.y }; },

        /** Check if using gyroscope */
        isGyroscope: function () { return useGyroscope; },

        /** Manually reveal all elements (skip discovery) */
        revealAll: function () {
            for (var i = 0; i < revealElements.length; i++) {
                revealElements[i].element.classList.add('light-reveal--visible');
                revealElements[i].revealed = true;
            }
        },

        /** Update config at runtime */
        setConfig: function (overrides) {
            Object.assign(CONFIG, overrides);
        },
    };

    return API;

})();

// Export for ES modules if supported
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CursorLight;
}
