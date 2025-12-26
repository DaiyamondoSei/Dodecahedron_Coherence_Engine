/**
 * ============================================================================
 * STARFIELD.JS - The Cosmic Canvas
 * ============================================================================
 *
 * Part of: Quannex Welcome Experience
 * Purpose: Creates an infinite starfield background that responds to mouse
 *          movement, creating the sense of floating through space.
 *
 * Architecture:
 * - Uses HTML5 Canvas for performance (thousands of stars)
 * - Three layers of stars at different depths (parallax)
 * - Mouse-responsive movement with smooth easing
 * - Optional hyperspace warp effect for transitions
 *
 * ============================================================================
 * NOTES FOR FUTURE CLAUDE
 * ============================================================================
 *
 * This module creates the foundational cosmic atmosphere. Key concepts:
 *
 * 1. STAR LAYERS: Three depth layers create parallax (far=slow, near=fast)
 * 2. MOUSE RESPONSE: Stars drift opposite to mouse movement (parallax feel)
 * 3. HYPERSPACE: When activated, stars streak toward center (warp effect)
 * 4. TWINKLING: Random opacity fluctuation for organic feel
 *
 * The starfield sits BEHIND the Three.js dodecahedron canvas (z-index: -1)
 * Both respond to the same mouse coordinates for unified interaction.
 *
 * Color: Uses Quannex teal (#00ffcc) for brightest stars, white for others
 *
 * ============================================================================
 */

const Starfield = (function() {
    'use strict';

    // ========================================================================
    // CONFIGURATION
    // ========================================================================

    const CONFIG = {
        // Star counts per layer (back to front)
        layers: [
            { count: 400, speed: 0.2, size: { min: 0.5, max: 1.0 }, opacity: 0.3 },
            { count: 200, speed: 0.5, size: { min: 1.0, max: 1.5 }, opacity: 0.5 },
            { count: 100, speed: 1.0, size: { min: 1.5, max: 2.5 }, opacity: 0.8 }
        ],

        // Colors
        colors: {
            background: '#0a0a1a',
            starDefault: '#ffffff',
            starAccent: '#00ffcc',      // Quannex teal
            accentProbability: 0.08     // 8% of stars get accent color
        },

        // Mouse interaction
        mouse: {
            influence: 0.15,            // How much mouse affects star movement
            easing: 0.05                // Smoothness of mouse response
        },

        // Twinkling
        twinkle: {
            speed: 0.02,
            intensity: 0.3              // Max opacity variation
        },

        // Hyperspace warp
        hyperspace: {
            speedMultiplier: 50,        // How fast stars move in warp
            streakLength: 20,           // Length of star streaks
            duration: 1500              // Warp duration in ms
        }
    };

    // ========================================================================
    // STATE
    // ========================================================================

    let canvas = null;
    let ctx = null;
    let stars = [];
    let animationId = null;
    let isRunning = false;
    let isHyperspace = false;
    let hyperspaceStartTime = 0;

    // Mouse state with easing
    const mouse = {
        target: { x: 0, y: 0 },
        current: { x: 0, y: 0 }
    };

    // Viewport dimensions
    let width = 0;
    let height = 0;

    // ========================================================================
    // STAR CLASS
    // ========================================================================

    /**
     * Individual star with position, velocity, and visual properties
     */
    class Star {
        constructor(layerConfig, layerIndex) {
            this.layer = layerIndex;
            this.config = layerConfig;
            this.reset(true);
        }

        /**
         * Reset star to random position
         * @param {boolean} randomizeAll - If true, randomize everything including twinkle phase
         */
        reset(randomizeAll = false) {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.baseX = this.x;
            this.baseY = this.y;

            // Size within layer's range
            const sizeRange = this.config.size.max - this.config.size.min;
            this.size = this.config.size.min + Math.random() * sizeRange;

            // Color (some stars get accent color)
            this.isAccent = Math.random() < CONFIG.colors.accentProbability;
            this.color = this.isAccent ? CONFIG.colors.starAccent : CONFIG.colors.starDefault;

            // Twinkling state
            if (randomizeAll) {
                this.twinklePhase = Math.random() * Math.PI * 2;
                this.twinkleSpeed = CONFIG.twinkle.speed * (0.5 + Math.random());
            }

            // Base opacity from layer config
            this.baseOpacity = this.config.opacity * (0.7 + Math.random() * 0.3);
        }

        /**
         * Update star position and visual state
         * @param {number} deltaTime - Time since last frame
         */
        update(deltaTime) {
            // Twinkling
            this.twinklePhase += this.twinkleSpeed;
            const twinkle = Math.sin(this.twinklePhase) * CONFIG.twinkle.intensity;
            this.opacity = Math.max(0.1, this.baseOpacity + twinkle);

            if (isHyperspace) {
                // Hyperspace: stars streak toward/away from center
                this.updateHyperspace(deltaTime);
            } else {
                // Normal: gentle drift with mouse parallax
                this.updateNormal(deltaTime);
            }
        }

        /**
         * Normal movement with mouse parallax
         */
        updateNormal(deltaTime) {
            const speed = this.config.speed;

            // Mouse parallax (stars move opposite to mouse)
            const parallaxX = mouse.current.x * CONFIG.mouse.influence * speed * 100;
            const parallaxY = mouse.current.y * CONFIG.mouse.influence * speed * 100;

            // Apply parallax to base position
            this.x = this.baseX - parallaxX;
            this.y = this.baseY - parallaxY;

            // Slow drift
            this.baseY += speed * 0.1;

            // Wrap around screen
            if (this.baseY > height + 10) {
                this.baseY = -10;
                this.baseX = Math.random() * width;
            }
            if (this.x < -50) this.x += width + 100;
            if (this.x > width + 50) this.x -= width + 100;
            if (this.y < -50) this.y += height + 100;
            if (this.y > height + 50) this.y -= height + 100;
        }

        /**
         * Hyperspace warp movement
         */
        updateHyperspace(deltaTime) {
            const centerX = width / 2;
            const centerY = height / 2;

            // Direction from center
            const dx = this.x - centerX;
            const dy = this.y - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 0) {
                // Move away from center at warp speed
                const speed = CONFIG.hyperspace.speedMultiplier * this.config.speed;
                this.x += (dx / distance) * speed;
                this.y += (dy / distance) * speed;

                // Reset if off screen
                if (this.x < -50 || this.x > width + 50 ||
                    this.y < -50 || this.y > height + 50) {
                    // Respawn near center
                    const angle = Math.random() * Math.PI * 2;
                    const dist = Math.random() * 50;
                    this.x = centerX + Math.cos(angle) * dist;
                    this.y = centerY + Math.sin(angle) * dist;
                    this.baseX = this.x;
                    this.baseY = this.y;
                }
            }
        }

        /**
         * Draw the star
         */
        draw() {
            ctx.beginPath();

            if (isHyperspace && this.config.speed > 0.3) {
                // Draw as streak in hyperspace
                const centerX = width / 2;
                const centerY = height / 2;
                const dx = this.x - centerX;
                const dy = this.y - centerY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance > 0) {
                    const streakLength = CONFIG.hyperspace.streakLength * this.config.speed;
                    const endX = this.x + (dx / distance) * streakLength;
                    const endY = this.y + (dy / distance) * streakLength;

                    ctx.moveTo(this.x, this.y);
                    ctx.lineTo(endX, endY);
                    ctx.strokeStyle = this.color;
                    ctx.globalAlpha = this.opacity;
                    ctx.lineWidth = this.size * 0.5;
                    ctx.stroke();
                }
            } else {
                // Draw as circle
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.opacity;
                ctx.fill();
            }

            ctx.globalAlpha = 1;
        }
    }

    // ========================================================================
    // INITIALIZATION
    // ========================================================================

    /**
     * Initialize the starfield
     * @param {string} containerId - ID of container element (canvas will be created inside)
     * @returns {Object} Public API
     */
    function init(containerId = 'starfield-container') {
        // Create canvas if container exists
        const container = document.getElementById(containerId);
        if (!container) {
            console.warn(`[Starfield] Container #${containerId} not found. Creating one.`);
            createDefaultContainer(containerId);
        }

        createCanvas(containerId);
        createStars();
        setupEventListeners();

        return API;
    }

    /**
     * Create default container if none exists
     */
    function createDefaultContainer(id) {
        const container = document.createElement('div');
        container.id = id;
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            pointer-events: none;
        `;
        document.body.insertBefore(container, document.body.firstChild);
    }

    /**
     * Create and setup the canvas element
     */
    function createCanvas(containerId) {
        const container = document.getElementById(containerId);

        canvas = document.createElement('canvas');
        canvas.id = 'starfield-canvas';
        canvas.style.cssText = `
            display: block;
            width: 100%;
            height: 100%;
        `;

        container.appendChild(canvas);
        ctx = canvas.getContext('2d');

        resizeCanvas();
    }

    /**
     * Handle canvas resizing
     */
    function resizeCanvas() {
        const dpr = window.devicePixelRatio || 1;
        width = window.innerWidth;
        height = window.innerHeight;

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        // Reposition stars on resize
        stars.forEach(star => {
            star.baseX = (star.baseX / star._oldWidth || 1) * width;
            star.baseY = (star.baseY / star._oldHeight || 1) * height;
            star._oldWidth = width;
            star._oldHeight = height;
        });
    }

    /**
     * Create all star objects
     */
    function createStars() {
        stars = [];

        CONFIG.layers.forEach((layerConfig, layerIndex) => {
            for (let i = 0; i < layerConfig.count; i++) {
                const star = new Star(layerConfig, layerIndex);
                star._oldWidth = width;
                star._oldHeight = height;
                stars.push(star);
            }
        });
    }

    // ========================================================================
    // EVENT HANDLING
    // ========================================================================

    /**
     * Setup all event listeners
     */
    function setupEventListeners() {
        window.addEventListener('resize', handleResize);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseleave', handleMouseLeave);
    }

    function handleResize() {
        resizeCanvas();
    }

    function handleMouseMove(e) {
        // Normalize to -1 to 1 range
        mouse.target.x = (e.clientX / width - 0.5) * 2;
        mouse.target.y = (e.clientY / height - 0.5) * 2;
    }

    function handleMouseLeave() {
        mouse.target.x = 0;
        mouse.target.y = 0;
    }

    // ========================================================================
    // ANIMATION LOOP
    // ========================================================================

    let lastTime = 0;

    /**
     * Main animation loop
     */
    function animate(currentTime) {
        if (!isRunning) return;

        const deltaTime = currentTime - lastTime;
        lastTime = currentTime;

        // Update mouse with easing
        mouse.current.x += (mouse.target.x - mouse.current.x) * CONFIG.mouse.easing;
        mouse.current.y += (mouse.target.y - mouse.current.y) * CONFIG.mouse.easing;

        // Check hyperspace timeout
        if (isHyperspace && currentTime - hyperspaceStartTime > CONFIG.hyperspace.duration) {
            isHyperspace = false;
        }

        // Clear canvas
        ctx.fillStyle = CONFIG.colors.background;
        ctx.fillRect(0, 0, width, height);

        // Update and draw stars
        stars.forEach(star => {
            star.update(deltaTime);
            star.draw();
        });

        animationId = requestAnimationFrame(animate);
    }

    // ========================================================================
    // PUBLIC API
    // ========================================================================

    const API = {
        /**
         * Start the starfield animation
         */
        start() {
            if (isRunning) return;
            isRunning = true;
            lastTime = performance.now();
            animationId = requestAnimationFrame(animate);
            console.log('[Starfield] Started');
        },

        /**
         * Stop the starfield animation
         */
        stop() {
            isRunning = false;
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
            console.log('[Starfield] Stopped');
        },

        /**
         * Trigger hyperspace warp effect
         * @param {Function} callback - Called when warp completes
         */
        warp(callback) {
            isHyperspace = true;
            hyperspaceStartTime = performance.now();
            console.log('[Starfield] Hyperspace engaged!');

            if (callback) {
                setTimeout(callback, CONFIG.hyperspace.duration);
            }
        },

        /**
         * Update mouse position externally (for coordination with Three.js)
         * @param {number} x - Normalized x (-1 to 1)
         * @param {number} y - Normalized y (-1 to 1)
         */
        setMouse(x, y) {
            mouse.target.x = x;
            mouse.target.y = y;
        },

        /**
         * Check if starfield is running
         */
        isRunning() {
            return isRunning;
        },

        /**
         * Get configuration (for debugging)
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
    module.exports = Starfield;
}
