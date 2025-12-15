/**
 * PentagramOverlay - Sacred Geometry Visualization
 *
 * Renders pentagram analysis with golden ratio (φ = 1.618) proportions
 * Visualizes 5 elemental pillars, star pairs, intersection nodes, and center composite
 *
 * Integration with PentagramAnalyzer.js mathematics
 */

class PentagramOverlay {
    constructor() {
        // Single source: js/constants/phi-harmonics.js
        const PH = (typeof window !== 'undefined' && window.PhiHarmonics) || {};
        this.PHI = PH.PHI || 1.618033988749895; // Golden ratio
        this.FIBONACCI_SEQUENCE = PH.FIBONACCI || [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144];

        // Element colors (5 pillars)
        this.ELEMENT_COLORS = {
            earth: '#8B4513',   // Earth - Brown
            water: '#4169E1',   // Water - Royal Blue
            fire: '#FF4500',    // Fire - Orange Red
            air: '#87CEEB',     // Air - Sky Blue
            ether: '#9370DB'    // Ether - Purple
        };

        this.canvas = null;
        this.ctx = null;
        this.animationFrame = null;
        this.currentTime = 0;
    }

    /**
     * Initialize pentagram canvas within a container
     */
    initialize(containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('Pentagram container not found:', containerId);
            return false;
        }

        // Create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'pentagramCanvas';
        this.canvas.width = 600;
        this.canvas.height = 600;
        this.ctx = this.canvas.getContext('2d');

        // Clear and append
        container.innerHTML = '';
        container.appendChild(this.canvas);

        return true;
    }

    /**
     * Render pentagram analysis with animation
     *
     * @param {Object} analysis - Output from PentagramAnalyzer
     * @param {Object} helix - DNA helix metadata
     */
    render(analysis, helix) {
        if (!this.ctx) {
            console.error('Canvas not initialized');
            return;
        }

        // Start animation loop
        const animate = (timestamp) => {
            this.currentTime = timestamp;
            this.drawPentagram(analysis, helix);
            this.animationFrame = requestAnimationFrame(animate);
        };

        // Cancel previous animation if running
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }

        animate(0);
    }

    /**
     * Stop animation
     */
    stop() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }

    /**
     * Draw complete pentagram visualization
     */
    drawPentagram(analysis, helix) {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Background glow
        this.drawBackgroundGlow(centerX, centerY);

        // Calculate pentagon vertices (5 pillars)
        const radius = 200; // Base radius scaled by φ
        const vertices = this.calculatePentagonVertices(centerX, centerY, radius);

        // Draw star pairs (energy beams connecting non-adjacent vertices)
        this.drawStarPairs(vertices, analysis.starPairs, helix.color);

        // Draw intersection nodes
        this.drawIntersectionNodes(vertices, analysis.intersectionNodes, helix.color);

        // Draw pentagon outline
        this.drawPentagon(vertices, helix.color);

        // Draw pillars (5 elemental vertices)
        this.drawPillars(vertices, analysis.pillarValues, helix);

        // Draw center composite (harmonic core)
        this.drawCenterComposite(centerX, centerY, analysis.centerComposite, helix.color);

        // Draw labels and metrics
        this.drawMetrics(analysis, helix);
    }

    /**
     * Calculate pentagon vertices using golden ratio proportions
     */
    calculatePentagonVertices(centerX, centerY, baseRadius) {
        const vertices = [];
        const angleOffset = -Math.PI / 2; // Start at top

        for (let i = 0; i < 5; i++) {
            const angle = angleOffset + (2 * Math.PI * i) / 5;

            // Use golden ratio for radius variation (φ-scaled)
            const radius = baseRadius * Math.pow(this.PHI, 0.1);

            vertices.push({
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle),
                angle: angle
            });
        }

        return vertices;
    }

    /**
     * Draw background glow with pulsing animation
     */
    drawBackgroundGlow(centerX, centerY) {
        const ctx = this.ctx;
        const pulse = Math.sin(this.currentTime / 1000) * 0.2 + 0.8;

        const gradient = ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, 300 * pulse
        );
        gradient.addColorStop(0, 'rgba(0, 255, 204, 0.1)');
        gradient.addColorStop(0.5, 'rgba(255, 0, 255, 0.05)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Draw pentagon outline
     */
    drawPentagon(vertices, color) {
        const ctx = this.ctx;

        ctx.beginPath();
        ctx.moveTo(vertices[0].x, vertices[0].y);
        for (let i = 1; i < vertices.length; i++) {
            ctx.lineTo(vertices[i].x, vertices[i].y);
        }
        ctx.closePath();

        ctx.strokeStyle = color + '66'; // 40% opacity
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    /**
     * Draw star pairs (pentagram energy beams)
     * Connects non-adjacent vertices: 0→2, 1→3, 2→4, 3→0, 4→1
     */
    drawStarPairs(vertices, starPairs, baseColor) {
        const ctx = this.ctx;
        const connections = [
            [0, 2], [1, 3], [2, 4], [3, 0], [4, 1]
        ];

        connections.forEach((conn, index) => {
            const [v1, v2] = conn;
            const strength = starPairs[index];

            // Pulsing animation based on Fibonacci timing
            const fibIndex = index % this.FIBONACCI_SEQUENCE.length;
            const period = this.FIBONACCI_SEQUENCE[fibIndex] * 200;
            const pulse = Math.sin(this.currentTime / period) * 0.3 + 0.7;

            // Draw energy beam
            const gradient = ctx.createLinearGradient(
                vertices[v1].x, vertices[v1].y,
                vertices[v2].x, vertices[v2].y
            );

            const alpha = strength * pulse * 0.8;
            gradient.addColorStop(0, this.hexToRGBA(baseColor, alpha));
            gradient.addColorStop(0.5, this.hexToRGBA('#ffff00', alpha * 1.2));
            gradient.addColorStop(1, this.hexToRGBA(baseColor, alpha));

            ctx.beginPath();
            ctx.moveTo(vertices[v1].x, vertices[v1].y);
            ctx.lineTo(vertices[v2].x, vertices[v2].y);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 3 * strength * pulse;
            ctx.shadowBlur = 15 * strength * pulse;
            ctx.shadowColor = baseColor;
            ctx.stroke();
            ctx.shadowBlur = 0;
        });
    }

    /**
     * Draw intersection nodes (where star pairs meet)
     * These are calculated as the geometric intersections
     */
    drawIntersectionNodes(vertices, intersectionNodes, baseColor) {
        const ctx = this.ctx;

        // For visual simplicity, place intersection nodes at midpoints
        // between adjacent vertices (approximation for visualization)
        const nodePairs = [
            [0, 1], [1, 2], [2, 3], [3, 4], [4, 0]
        ];

        nodePairs.forEach((pair, index) => {
            const [v1, v2] = pair;
            const nodeStrength = intersectionNodes[index];

            // Calculate intersection point (midpoint for visual clarity)
            const x = (vertices[v1].x + vertices[v2].x) / 2;
            const y = (vertices[v1].y + vertices[v2].y) / 2;

            // Pulsing animation
            const pulse = Math.sin(this.currentTime / 800 + index) * 0.2 + 0.8;
            const radius = 8 * nodeStrength * pulse;

            // Draw node
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
            gradient.addColorStop(0, this.hexToRGBA(baseColor, 0.9));
            gradient.addColorStop(0.7, this.hexToRGBA('#ff00ff', 0.6));
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();

            // Outer ring
            ctx.strokeStyle = this.hexToRGBA(baseColor, 0.8);
            ctx.lineWidth = 1.5;
            ctx.stroke();
        });
    }

    /**
     * Draw 5 elemental pillars at vertices
     */
    drawPillars(vertices, pillarValues, helix) {
        const ctx = this.ctx;
        const elements = ['earth', 'water', 'fire', 'air', 'ether'];
        const elementSymbols = ['🜃', '💧', '🔥', '💨', '🜀'];
        const elementNames = ['Earth', 'Water', 'Fire', 'Air', 'Ether'];

        vertices.forEach((vertex, index) => {
            const element = elements[index];
            const value = pillarValues[index];
            const color = this.ELEMENT_COLORS[element];

            // Pulsing based on pillar strength
            const pulse = Math.sin(this.currentTime / 1000 + index * Math.PI / 2.5) * 0.15 + 0.85;
            const radius = (20 + value * 30) * pulse;

            // Outer glow
            const glowGradient = ctx.createRadialGradient(
                vertex.x, vertex.y, 0,
                vertex.x, vertex.y, radius * 1.5
            );
            glowGradient.addColorStop(0, this.hexToRGBA(color, value * 0.8));
            glowGradient.addColorStop(0.6, this.hexToRGBA(color, value * 0.4));
            glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.beginPath();
            ctx.arc(vertex.x, vertex.y, radius * 1.5, 0, Math.PI * 2);
            ctx.fillStyle = glowGradient;
            ctx.fill();

            // Inner pillar orb
            const orbGradient = ctx.createRadialGradient(
                vertex.x - radius * 0.3, vertex.y - radius * 0.3, 0,
                vertex.x, vertex.y, radius
            );
            orbGradient.addColorStop(0, this.hexToRGBA('#ffffff', 0.9));
            orbGradient.addColorStop(0.4, this.hexToRGBA(color, 0.9));
            orbGradient.addColorStop(1, this.hexToRGBA(color, 0.7));

            ctx.beginPath();
            ctx.arc(vertex.x, vertex.y, radius, 0, Math.PI * 2);
            ctx.fillStyle = orbGradient;
            ctx.fill();

            // Border ring
            ctx.strokeStyle = this.hexToRGBA('#ffffff', 0.8);
            ctx.lineWidth = 2;
            ctx.stroke();

            // Element symbol (emoji)
            ctx.font = `${radius * 0.8}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.fillText(elementSymbols[index], vertex.x, vertex.y);

            // Element name and value label
            const labelY = vertex.y > this.canvas.height / 2 ? vertex.y + radius + 25 : vertex.y - radius - 15;

            ctx.font = 'bold 12px Arial';
            ctx.fillStyle = color;
            ctx.fillText(elementNames[index], vertex.x, labelY);

            ctx.font = '11px Arial';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fillText(`${(value * 100).toFixed(0)}%`, vertex.x, labelY + 14);
        });
    }

    /**
     * Draw center composite (harmonic core)
     */
    drawCenterComposite(x, y, compositeValue, baseColor) {
        const ctx = this.ctx;

        // Pulsing animation with golden ratio timing
        const pulse = Math.sin(this.currentTime / (1000 / this.PHI)) * 0.25 + 0.75;
        const baseRadius = 35;
        const radius = baseRadius * compositeValue * pulse;

        // Multi-layer glow
        for (let i = 3; i > 0; i--) {
            const layerRadius = radius * (1 + i * 0.3);
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, layerRadius);

            gradient.addColorStop(0, this.hexToRGBA(baseColor, 0.8 / i));
            gradient.addColorStop(0.5, this.hexToRGBA('#ffff00', 0.4 / i));
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.beginPath();
            ctx.arc(x, y, layerRadius, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
        }

        // Core orb
        const coreGradient = ctx.createRadialGradient(
            x - radius * 0.4, y - radius * 0.4, 0,
            x, y, radius
        );
        coreGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        coreGradient.addColorStop(0.3, this.hexToRGBA(baseColor, 1));
        coreGradient.addColorStop(1, this.hexToRGBA(baseColor, 0.8));

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = coreGradient;
        ctx.fill();

        // Rotating golden rings (φ-proportioned)
        const ringCount = 3;
        for (let i = 0; i < ringCount; i++) {
            const ringRadius = radius * Math.pow(this.PHI, i * 0.5);
            const rotation = (this.currentTime / (2000 * (i + 1))) % (2 * Math.PI);

            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation);

            ctx.strokeStyle = this.hexToRGBA('#ffff00', 0.6 - i * 0.15);
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(0, 0, ringRadius, 0, Math.PI * 1.5);
            ctx.stroke();

            ctx.restore();
        }

        // Center label
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillText('C', x, y - 2);

        // Value below
        ctx.font = '11px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        ctx.fillText(`${(compositeValue * 100).toFixed(0)}%`, x, y + radius + 20);
    }

    /**
     * Draw metrics and analysis text
     */
    drawMetrics(analysis, helix) {
        const ctx = this.ctx;
        const padding = 20;
        const lineHeight = 18;
        let y = padding;

        // Semi-transparent background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, this.canvas.width, 100);

        // Title
        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = helix.color || '#00ffcc';
        ctx.textAlign = 'left';
        ctx.fillText(`⭐ ${helix.name} - Pentagram Analysis`, padding, y + lineHeight);
        y += lineHeight * 1.8;

        // Metrics
        ctx.font = '12px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';

        const metrics = [
            `Self Coherence (Ball): ${(analysis.ballValue * 100).toFixed(1)}%`,
            `Relational Coherence (Pillars): ${(analysis.nuancedAvgPillarHealth * 100).toFixed(1)}%`,
            `Structural Integrity (Symmetry): ${(analysis.pillarSymmetry * 100).toFixed(1)}%`,
            `Local Coherence (φ-Blended): ${(analysis.localCoherence * 100).toFixed(1)}%`
        ];

        metrics.forEach(metric => {
            ctx.fillText(metric, padding, y + lineHeight);
            y += lineHeight;
        });

        // Golden ratio indicator
        ctx.font = 'italic 11px Arial';
        ctx.fillStyle = 'rgba(255, 215, 0, 0.8)';
        ctx.textAlign = 'right';
        ctx.fillText(`φ = ${this.PHI.toFixed(6)} (Golden Ratio)`, this.canvas.width - padding, this.canvas.height - padding);
    }

    /**
     * Helper: Convert hex color to RGBA
     */
    hexToRGBA(hex, alpha = 1) {
        // Handle both #RRGGBB and 0xRRGGBB formats
        let hexValue = hex;
        if (typeof hex === 'number') {
            hexValue = '#' + hex.toString(16).padStart(6, '0');
        }

        const r = parseInt(hexValue.slice(1, 3), 16);
        const g = parseInt(hexValue.slice(3, 5), 16);
        const b = parseInt(hexValue.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
}

// Export as global
window.PentagramOverlay = PentagramOverlay;
