/**
 * ════════════════════════════════════════════════════════════════════════════
 * OCTAVE DNA - ANIMATION LOOP
 * ════════════════════════════════════════════════════════════════════════════
 *
 * The render loop that keeps the visualization alive.
 * Handles requestAnimationFrame, controls update, and window resize.
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                        NOTES FOR FUTURE CLAUDE                          │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * THE ANIMATION LOOP:
 * ─────────────────────────────────────────────────────────────────────────
 * requestAnimationFrame creates a smooth 60fps render loop:
 *
 *   function animate() {
 *       requestAnimationFrame(animate);  // Schedule next frame
 *       controls.update();                // Update orbit controls
 *       renderer.render(scene, camera);   // Render the scene
 *   }
 *
 * CONTROLS UPDATE:
 * ─────────────────────────────────────────────────────────────────────────
 * OrbitControls has several features that require per-frame updates:
 *   • Damping (smooth camera deceleration)
 *   • Auto-rotate (gentle spinning)
 *
 * If animationRunning is false, controls.update() is skipped but
 * rendering continues - this allows pausing the auto-rotation while
 * still showing the scene.
 *
 * WINDOW RESIZE:
 * ─────────────────────────────────────────────────────────────────────────
 * On resize, we must:
 *   1. Update camera aspect ratio
 *   2. Update camera projection matrix
 *   3. Update renderer size
 *
 * This ensures the visualization fills the viewport correctly.
 *
 * NAVIGATION MAP:
 * ─────────────────────────────────────────────────────────────────────────
 * ├─ DEPENDS ON:
 * │  └─ OctaveDNAState (scene, camera, renderer, controls, animationRunning)
 * │
 * └─ USED BY:
 *    └─ octave-dna-main.js (calls startAnimation on init)
 *
 * ════════════════════════════════════════════════════════════════════════════
 * @version 1.0.0 - Extracted from octave-dna.html monolith
 * @created 2025-12-19
 */

(function () {
    'use strict';

    // Animation frame ID for cleanup
    let animationFrameId = null;

    // ════════════════════════════════════════════════════════════════════════
    // ANIMATION LOOP
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Main animation loop
     *
     * Runs continuously at ~60fps (or display refresh rate).
     * Updates orbit controls and renders the scene.
     */
    function animate() {
        // Schedule next frame
        animationFrameId = requestAnimationFrame(animate);

        const State = window.OctaveDNAState;
        if (!State) return;

        const controls = State.getState('controls');
        const renderer = State.getState('renderer');
        const scene = State.getState('scene');
        const camera = State.getState('camera');
        const animationRunning = State.getState('animationRunning');

        // Update controls (damping, auto-rotate) if animation is running
        if (controls && animationRunning !== false) {
            controls.update();
        }

        // Render the scene
        if (renderer && scene && camera) {
            renderer.render(scene, camera);
        }
    }

    /**
     * Start the animation loop
     */
    function startAnimation() {
        if (animationFrameId === null) {
            Logger.debug('OctaveDNA', 'Starting render loop');
            animate();
        }
    }

    /**
     * Stop the animation loop
     */
    function stopAnimation() {
        if (animationFrameId !== null) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
            Logger.debug('OctaveDNA', 'Render loop stopped');
        }
    }

    /**
     * Pause/resume the animation (controls update only, rendering continues)
     */
    function toggleAnimation() {
        const State = window.OctaveDNAState;
        if (!State) return;

        const current = State.getState('animationRunning');
        State.setState('animationRunning', !current);

        Logger.info('OctaveDNA', `${current ? 'Paused' : 'Resumed'} animation loop`);
    }

    /**
     * Check if animation is running
     * @returns {boolean}
     */
    function isAnimating() {
        return animationFrameId !== null;
    }

    // ════════════════════════════════════════════════════════════════════════
    // WINDOW RESIZE HANDLER
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Handle window resize
     *
     * Updates camera aspect ratio and renderer size to match new window dimensions.
     */
    function handleResize() {
        const State = window.OctaveDNAState;
        if (!State) return;

        const camera = State.getState('camera');
        const renderer = State.getState('renderer');

        if (camera) {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        }

        if (renderer) {
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }

    /**
     * Attach resize event listener
     */
    function initResizeHandler() {
        window.addEventListener('resize', handleResize);
        Logger.debug('OctaveDNA', 'Resize handler attached');
    }

    /**
     * Remove resize event listener
     */
    function removeResizeHandler() {
        window.removeEventListener('resize', handleResize);
    }

    // ════════════════════════════════════════════════════════════════════════
    // AUTO-ROTATE CONTROL
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Toggle auto-rotate on orbit controls
     */
    function toggleAutoRotate() {
        const State = window.OctaveDNAState;
        if (!State) return;

        const controls = State.getState('controls');
        if (controls) {
            controls.autoRotate = !controls.autoRotate;
            Logger.info('OctaveDNA', `Auto-rotate: ${controls.autoRotate ? 'ON' : 'OFF'}`);
        }
    }

    /**
     * Set auto-rotate speed
     * @param {number} speed - Rotation speed (default is 0.2)
     */
    function setAutoRotateSpeed(speed) {
        const State = window.OctaveDNAState;
        if (!State) return;

        const controls = State.getState('controls');
        if (controls) {
            controls.autoRotateSpeed = speed;
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // BROWSER GLOBAL EXPORT
    // ════════════════════════════════════════════════════════════════════════

    if (typeof window !== 'undefined') {
        window.OctaveDNAAnimation = {
            // Core loop
            animate,
            startAnimation,
            stopAnimation,
            toggleAnimation,
            isAnimating,

            // Resize
            handleResize,
            initResizeHandler,
            removeResizeHandler,

            // Auto-rotate
            toggleAutoRotate,
            setAutoRotateSpeed
        };

        Logger.debug('OctaveDNA', 'Animation loop module loaded');
    }

})();
