/**
 * DNA Preview Mini - Canvas-based DNA Helix Animation
 * Phase 2 Enhancement: Embedded breath axis visualization in face detail panel
 *
 * Renders a simplified double helix representing the breath axis between
 * a reception face and its projection partner.
 */

class DNAPreviewMini {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.warn('DNA Preview: Canvas not found:', canvasId);
            return;
        }
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        // Animation state
        this.animationId = null;
        this.time = 0;
        this.isRunning = false;

        // DNA helix parameters
        this.PHI = 1.618033988749895;
        this.helixAmplitude = 25;
        this.helixFrequency = 0.02;
        this.connectionCount = 8;

        // Colors
        this.receptionColor = '#00ffcc';  // Cyan - inhale
        this.projectionColor = '#ff00ff'; // Magenta - exhale
        this.connectionColor = 'rgba(255, 255, 255, 0.3)';

        // Breath data (set via setBreathData)
        this.breathRatio = 1.0;
        this.isBalanced = true;
        this.receptionEnergy = 0.5;
        this.projectionEnergy = 0.5;
    }

    /**
     * Set the breath axis data for visualization
     */
    setBreathData(data) {
        if (!data) return;

        this.breathRatio = data.ratio || 1.0;
        this.isBalanced = Math.abs(this.breathRatio - 1.0) < 0.2;
        this.receptionEnergy = data.receptionEnergy || 0.5;
        this.projectionEnergy = data.projectionEnergy || 0.5;

        // Adjust helix amplitude based on imbalance
        const imbalance = Math.abs(this.breathRatio - 1.0);
        this.helixAmplitude = 25 + imbalance * 15;
    }

    /**
     * Start the animation loop
     */
    start() {
        if (this.isRunning || !this.canvas) return;
        this.isRunning = true;
        this.animate();
    }

    /**
     * Stop the animation loop
     */
    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    /**
     * Main animation loop
     */
    animate() {
        if (!this.isRunning) return;

        this.time += 0.016; // ~60fps
        this.draw();

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    /**
     * Draw the DNA helix
     */
    draw() {
        const ctx = this.ctx;
        const w = this.width;
        const h = this.height;
        const centerY = h / 2;

        // Clear canvas with gradient background
        const bgGradient = ctx.createLinearGradient(0, 0, w, h);
        bgGradient.addColorStop(0, 'rgba(0, 20, 30, 0.9)');
        bgGradient.addColorStop(1, 'rgba(20, 0, 30, 0.9)');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, w, h);

        // Calculate phase offset based on breath ratio
        const phaseOffset = this.time * this.PHI;

        // Draw connection rungs first (behind strands)
        ctx.strokeStyle = this.connectionColor;
        ctx.lineWidth = 1;

        for (let i = 0; i < this.connectionCount; i++) {
            const x = (w / (this.connectionCount + 1)) * (i + 1);
            const phase1 = x * this.helixFrequency + phaseOffset;
            const phase2 = phase1 + Math.PI;

            const y1 = centerY + Math.sin(phase1) * this.helixAmplitude;
            const y2 = centerY + Math.sin(phase2) * this.helixAmplitude;

            ctx.beginPath();
            ctx.moveTo(x, y1);
            ctx.lineTo(x, y2);
            ctx.stroke();

            // Draw node circles on connections
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.beginPath();
            ctx.arc(x, (y1 + y2) / 2, 2, 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw reception strand (cyan) - top helix
        this.drawHelixStrand(
            phaseOffset,
            this.receptionColor,
            this.receptionEnergy
        );

        // Draw projection strand (magenta) - bottom helix (PI offset)
        this.drawHelixStrand(
            phaseOffset + Math.PI,
            this.projectionColor,
            this.projectionEnergy
        );

        // Draw flow indicators
        this.drawFlowArrows();
    }

    /**
     * Draw a single helix strand
     */
    drawHelixStrand(phaseOffset, color, energy) {
        const ctx = this.ctx;
        const w = this.width;
        const h = this.height;
        const centerY = h / 2;

        // Create gradient for strand
        const gradient = ctx.createLinearGradient(0, 0, w, 0);
        gradient.addColorStop(0, color + '80');
        gradient.addColorStop(0.5, color);
        gradient.addColorStop(1, color + '80');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 3 + energy * 2;
        ctx.lineCap = 'round';

        ctx.beginPath();

        for (let x = 0; x <= w; x += 2) {
            const phase = x * this.helixFrequency + phaseOffset;
            const y = centerY + Math.sin(phase) * this.helixAmplitude;

            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }

        ctx.stroke();

        // Add glow effect
        ctx.shadowColor = color;
        ctx.shadowBlur = 10 * energy;
        ctx.stroke();
        ctx.shadowBlur = 0;
    }

    /**
     * Draw flow direction arrows
     */
    drawFlowArrows() {
        const ctx = this.ctx;
        const w = this.width;
        const h = this.height;

        // Arrow on left side (reception/inhale)
        ctx.fillStyle = this.receptionColor + '80';
        ctx.beginPath();
        ctx.moveTo(5, h/2 - 5);
        ctx.lineTo(15, h/2);
        ctx.lineTo(5, h/2 + 5);
        ctx.closePath();
        ctx.fill();

        // Arrow on right side (projection/exhale)
        ctx.fillStyle = this.projectionColor + '80';
        ctx.beginPath();
        ctx.moveTo(w - 5, h/2 - 5);
        ctx.lineTo(w - 15, h/2);
        ctx.lineTo(w - 5, h/2 + 5);
        ctx.closePath();
        ctx.fill();
    }

    /**
     * Cleanup
     */
    destroy() {
        this.stop();
        this.canvas = null;
        this.ctx = null;
    }
}

// Global instance for the face detail panel
let dnaPreviewInstance = null;

/**
 * Initialize or update the DNA preview with breath axis data
 */
function initDNAPreview(breathData) {
    if (!dnaPreviewInstance) {
        dnaPreviewInstance = new DNAPreviewMini('dnaPreviewCanvas');
    }

    if (breathData) {
        dnaPreviewInstance.setBreathData(breathData);
    }

    dnaPreviewInstance.start();
    return dnaPreviewInstance;
}

/**
 * Stop the DNA preview animation (call when panel closes)
 */
function stopDNAPreview() {
    if (dnaPreviewInstance) {
        dnaPreviewInstance.stop();
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DNAPreviewMini, initDNAPreview, stopDNAPreview };
}

// Make available globally
window.DNAPreviewMini = DNAPreviewMini;
window.initDNAPreview = initDNAPreview;
window.stopDNAPreview = stopDNAPreview;
