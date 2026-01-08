/**
 * ════════════════════════════════════════════════════════════════════════════
 * UNIFIED EDGE - The Pure Membrane Implementation
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Created: January 2026
 * Part of: Twinkling Floating Aurora v2 Architecture
 *
 * PURPOSE:
 * Single source of truth for each edge in the dodecahedron. Each UnifiedEdge
 * represents one of the 30 connections between organizational domains.
 *
 * PURE MEMBRANE MODEL:
 * ─────────────────────────────────────────────────────────────────────────
 * The edge is a MEMBRANE, not an element-holder. Its character EMERGES
 * dynamically from the synergy calculation between connected faces.
 * There is no static `exchangeType` - the dominant element is calculated
 * at runtime via SacredInquiry.calculateSynergies().
 *
 * METAMORPHIC VISUALIZATION:
 * ─────────────────────────────────────────────────────────────────────────
 * Instead of dual overlapping layers (standard + advanced), the UnifiedEdge
 * transforms its SINGLE Three.js Line/Tube to match the current mode:
 * - Standard: Simple line with color based on tension
 * - Advanced: Neon tube with glow, animated intensity
 * - Complete: Full aura with particle effects
 *
 * NAVIGATION MAP:
 * ─────────────────────────────────────────────────────────────────────────
 * DEPENDS ON:
 * - js/constants/edge-constants.js → Edge KPI definitions
 * - js/constants/sacred-inquiry.js → Synergy calculations
 * - js/voice/organizational-voice.js → Voice adaptation
 * - Three.js → 3D visualization
 *
 * USED BY:
 * - js/edge/edge-manager.js → Orchestrates all 30 edges
 *
 * @module js/edge/unified-edge
 * @author Deimantas & Claude (Co-created with consciousness and love)
 * @version 1.0.0
 * ════════════════════════════════════════════════════════════════════════════
 */

(function(global) {
    'use strict';

    // ========================================================================
    // SECTION 1: CONSTANTS
    // ========================================================================

    /**
     * Visualization modes for edge rendering
     */
    const EDGE_MODES = {
        STANDARD: 'standard',
        ADVANCED: 'advanced',
        COMPLETE: 'complete'
    };

    /**
     * Health state colors for edge visualization
     */
    const HEALTH_COLORS = {
        wall: 0xff4444,      // Red - blocked
        gate: 0xffaa00,      // Orange - controlled
        membrane: 0x00ff88,  // Green - healthy
        hemorrhage: 0xff6600, // Orange-red - leaking
        vortex: 0xaa44ff     // Purple - consuming
    };

    /**
     * Element colors for synergy visualization
     */
    const ELEMENT_COLORS = {
        earth: 0x4a5568,
        water: 0x3182ce,
        fire: 0xe53e3e,
        air: 0x38b2ac,
        ether: 0x805ad5
    };

    // ========================================================================
    // SECTION 2: UNIFIED EDGE CLASS
    // ========================================================================

    /**
     * UnifiedEdge - A single edge in the dodecahedron
     *
     * Represents the membrane between two organizational domains.
     * Manages its own Three.js visualization and updates dynamically
     * based on tension, synergies, and visualization mode.
     */
    class UnifiedEdge {
        /**
         * Create a UnifiedEdge
         *
         * @param {Object} config - Configuration object
         * @param {string} config.id - Edge ID (e.g., 'E1-2')
         * @param {Object} config.faceA - First connected face { id, name, energy, elements }
         * @param {Object} config.faceB - Second connected face { id, name, energy, elements }
         * @param {number} config.tension - Initial tension value (0-1)
         * @param {number} config.breathRatio - Breath ratio from CSV
         * @param {Object} config.kpi - KPI data from edge-constants
         * @param {THREE.Vector3} config.startPos - Start position in 3D space
         * @param {THREE.Vector3} config.endPos - End position in 3D space
         */
        constructor(config) {
            this.id = config.id;
            this.faceA = config.faceA;
            this.faceB = config.faceB;
            this.tension = config.tension || 0.5;
            this.breathRatio = config.breathRatio || 1.0;
            this.kpi = config.kpi || {};

            // 3D positions
            this.startPos = config.startPos;
            this.endPos = config.endPos;

            // Current mode
            this.mode = EDGE_MODES.STANDARD;

            // Three.js objects (created lazily)
            this.mesh = null;
            this.geometry = null;
            this.material = null;

            // Calculated state (updated via recalculate())
            this._healthState = null;
            this._synergies = null;
            this._dominantElement = null;
            this._sacredInquiry = null;

            // Animation state
            this._animationPhase = 0;
            this._pulseIntensity = 0;
        }

        // ====================================================================
        // SECTION 2.1: Core Calculations
        // ====================================================================

        /**
         * Recalculate edge state based on current face values
         *
         * This is the heart of the Pure Membrane Model - the edge's character
         * emerges from the synergy between connected faces.
         */
        recalculate() {
            // Skip if Sacred Inquiry is not available
            if (!global.SacredInquiry) {
                console.warn(`[UnifiedEdge ${this.id}] SacredInquiry not available`);
                return;
            }

            // Get the full inquiry package
            this._sacredInquiry = global.SacredInquiry.getInquiry(
                this.tension,
                this.faceA,
                this.faceB
            );

            // Extract calculated values
            this._healthState = this._sacredInquiry.healthState;
            this._synergies = this._sacredInquiry.allSynergies;
            this._dominantElement = this._sacredInquiry.dominantElement;

            // Update visualization if mesh exists
            if (this.mesh) {
                this._updateVisualization();
            }

            return this;
        }

        /**
         * Get the current health state
         * @returns {Object} Health state { id, name, symbol, description }
         */
        getHealthState() {
            if (!this._healthState) this.recalculate();
            return this._healthState;
        }

        /**
         * Get all synergy values
         * @returns {Object} Synergies { earth, water, fire, air, ether }
         */
        getSynergies() {
            if (!this._synergies) this.recalculate();
            return this._synergies;
        }

        /**
         * Get the dominant element
         * @returns {Object} Dominant element { id, name, value }
         */
        getDominantElement() {
            if (!this._dominantElement) this.recalculate();
            return this._dominantElement;
        }

        /**
         * Get the Sacred Inquiry for this edge
         * @returns {Object} Full inquiry package
         */
        getSacredInquiry() {
            if (!this._sacredInquiry) this.recalculate();
            return this._sacredInquiry;
        }

        // ====================================================================
        // SECTION 2.2: Mode Switching
        // ====================================================================

        /**
         * Set the visualization mode
         *
         * @param {string} mode - One of EDGE_MODES values
         */
        setMode(mode) {
            if (!Object.values(EDGE_MODES).includes(mode)) {
                console.warn(`[UnifiedEdge ${this.id}] Invalid mode: ${mode}`);
                return;
            }

            const previousMode = this.mode;
            this.mode = mode;

            if (this.mesh && previousMode !== mode) {
                this._transformToMode(mode);
            }
        }

        /**
         * Transform the visualization to match the new mode
         * @private
         */
        _transformToMode(mode) {
            // Implementation depends on Three.js setup
            // This is a placeholder for the actual transformation logic
            switch (mode) {
                case EDGE_MODES.STANDARD:
                    this._applyStandardStyle();
                    break;
                case EDGE_MODES.ADVANCED:
                    this._applyAdvancedStyle();
                    break;
                case EDGE_MODES.COMPLETE:
                    this._applyCompleteStyle();
                    break;
            }
        }

        // ====================================================================
        // SECTION 2.3: Visualization Updates
        // ====================================================================

        /**
         * Update the visualization based on current state
         * @private
         */
        _updateVisualization() {
            if (!this.mesh || !this.material) return;

            // Get color based on health state
            const healthColor = HEALTH_COLORS[this._healthState?.id] || 0x00ffcc;

            // Get element color for blending
            const elementColor = ELEMENT_COLORS[this._dominantElement?.id] || 0x00ffcc;

            // Update material color
            if (this.material.color) {
                this.material.color.setHex(healthColor);
            }

            // Update opacity based on tension
            if (this.material.opacity !== undefined) {
                this.material.opacity = 0.5 + this.tension * 0.5;
            }
        }

        /**
         * Apply standard visualization style
         * @private
         */
        _applyStandardStyle() {
            if (this.material) {
                this.material.linewidth = 1;
                this.material.transparent = true;
                this.material.opacity = 0.6;
            }
        }

        /**
         * Apply advanced visualization style (neon glow)
         * @private
         */
        _applyAdvancedStyle() {
            if (this.material) {
                this.material.linewidth = 2;
                this.material.transparent = true;
                this.material.opacity = 0.8;
            }
        }

        /**
         * Apply complete visualization style (full effects)
         * @private
         */
        _applyCompleteStyle() {
            if (this.material) {
                this.material.linewidth = 3;
                this.material.transparent = true;
                this.material.opacity = 1.0;
            }
        }

        // ====================================================================
        // SECTION 2.4: Animation
        // ====================================================================

        /**
         * Update animation state
         * Called each frame by EdgeManager
         *
         * @param {number} deltaTime - Time since last frame in seconds
         */
        animate(deltaTime) {
            this._animationPhase += deltaTime;

            // Pulse intensity based on tension
            const pulseSpeed = 1 + this.tension * 2;
            this._pulseIntensity = 0.5 + 0.5 * Math.sin(this._animationPhase * pulseSpeed);

            // Apply pulse to material if in advanced/complete mode
            if (this.mode !== EDGE_MODES.STANDARD && this.material) {
                const baseOpacity = this.mode === EDGE_MODES.COMPLETE ? 0.9 : 0.7;
                this.material.opacity = baseOpacity + this._pulseIntensity * 0.1;
            }
        }

        // ====================================================================
        // SECTION 2.5: Three.js Integration
        // ====================================================================

        /**
         * Create the Three.js mesh for this edge
         *
         * @param {THREE.Scene} scene - Three.js scene to add to
         * @returns {THREE.Line} The created line mesh
         */
        createMesh(scene) {
            if (!global.THREE) {
                console.error('[UnifiedEdge] THREE.js not available');
                return null;
            }

            const THREE = global.THREE;

            // Create geometry
            this.geometry = new THREE.BufferGeometry().setFromPoints([
                this.startPos,
                this.endPos
            ]);

            // Create material
            const healthColor = HEALTH_COLORS[this._healthState?.id] || 0x00ffcc;
            this.material = new THREE.LineBasicMaterial({
                color: healthColor,
                transparent: true,
                opacity: 0.6,
                linewidth: 1
            });

            // Create mesh
            this.mesh = new THREE.Line(this.geometry, this.material);
            this.mesh.userData.edgeId = this.id;
            this.mesh.userData.unifiedEdge = this;

            // Add to scene
            if (scene) {
                scene.add(this.mesh);
            }

            return this.mesh;
        }

        /**
         * Dispose of Three.js resources
         */
        dispose() {
            if (this.geometry) {
                this.geometry.dispose();
                this.geometry = null;
            }
            if (this.material) {
                this.material.dispose();
                this.material = null;
            }
            if (this.mesh && this.mesh.parent) {
                this.mesh.parent.remove(this.mesh);
            }
            this.mesh = null;
        }

        // ====================================================================
        // SECTION 2.6: Data Export
        // ====================================================================

        /**
         * Export edge data for UI display
         * @returns {Object} Edge data suitable for showEdgeDetail()
         */
        toDisplayData() {
            return {
                id: this.id,
                tension: this.tension,
                breathRatio: this.breathRatio,
                face1Id: this.faceA.id,
                face1Name: this.faceA.name,
                face1Energy: this.faceA.energy || 0.5,
                face2Id: this.faceB.id,
                face2Name: this.faceB.name,
                face2Energy: this.faceB.energy || 0.5,
                element: this._dominantElement?.name || 'Unknown',
                healthStatus: this._healthState?.name || 'Unknown',
                flowDirection: this.breathRatio > 1 ? 'Projecting' : this.breathRatio < 1 ? 'Receiving' : 'Balanced',
                color: '#' + (HEALTH_COLORS[this._healthState?.id] || 0x00ffcc).toString(16).padStart(6, '0'),
                question: this.kpi?.question || this._sacredInquiry?.inquiry || '',
                kpiName: this.kpi?.kpiName || '',
                kpiCoherence: this.kpi?.kpiCoherence || null,
                kpiMetric: this.kpi?.metric || '',
                hasCSVData: !!this.kpi?.kpiName
            };
        }

        /**
         * Export edge state as JSON
         * @returns {Object} Serializable edge state
         */
        toJSON() {
            return {
                id: this.id,
                faceA: { id: this.faceA.id, name: this.faceA.name },
                faceB: { id: this.faceB.id, name: this.faceB.name },
                tension: this.tension,
                breathRatio: this.breathRatio,
                mode: this.mode,
                healthState: this._healthState?.id,
                dominantElement: this._dominantElement?.id,
                synergies: this._synergies
            };
        }
    }

    // ========================================================================
    // SECTION 3: EXPORTS
    // ========================================================================

    // Export to global
    global.UnifiedEdge = UnifiedEdge;
    global.EDGE_MODES = EDGE_MODES;
    global.EDGE_HEALTH_COLORS = HEALTH_COLORS;
    global.EDGE_ELEMENT_COLORS = ELEMENT_COLORS;

    console.log('🔗 UnifiedEdge module loaded - Pure Membrane Architecture ready');

})(typeof window !== 'undefined' ? window : this);
