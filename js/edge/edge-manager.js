/**
 * ════════════════════════════════════════════════════════════════════════════
 * EDGE MANAGER - Orchestrator for the 30 Unified Edges
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Created: January 2026
 * Part of: Twinkling Floating Aurora v2 Architecture
 *
 * PURPOSE:
 * Single orchestrator for all 30 edges of the dodecahedron. Manages creation,
 * updates, mode switching, and disposal of UnifiedEdge instances.
 *
 * ARCHITECTURE:
 * ─────────────────────────────────────────────────────────────────────────
 *   EdgeManager (singleton)
 *       └── UnifiedEdge[30] (one per edge)
 *           └── Three.js mesh (line/tube/particles)
 *
 * RESPONSIBILITIES:
 * ─────────────────────────────────────────────────────────────────────────
 * - Create and manage all 30 UnifiedEdge instances
 * - Handle mode switching (Standard → Advanced → Complete)
 * - Coordinate animation updates
 * - Provide edge lookup by ID, face pair, or health state
 * - Integrate with Sacred Inquiry for dynamic calculations
 *
 * NAVIGATION MAP:
 * ─────────────────────────────────────────────────────────────────────────
 * DEPENDS ON:
 * - js/edge/unified-edge.js → UnifiedEdge class
 * - js/constants/edge-constants.js → EDGE_KPI_LIBRARY
 * - js/constants/sacred-inquiry.js → Synergy calculations
 * - data/json/edge-tension.json → Tension data
 *
 * USED BY:
 * - js/dodec/dodec-interaction.js → Edge click handling
 * - js/advanced/visualization-manager.js → Mode switching
 *
 * @module js/edge/edge-manager
 * @author Deimantas & Claude (Co-created with consciousness and love)
 * @version 1.0.0
 * ════════════════════════════════════════════════════════════════════════════
 */

(function (global) {
    'use strict';

    // ========================================================================
    // SECTION 1: EDGE MANAGER CLASS
    // ========================================================================

    /**
     * EdgeManager - Orchestrator for all dodecahedron edges
     *
     * Singleton pattern - access via EdgeManager.getInstance()
     */
    class EdgeManager {
        /**
         * Private constructor - use getInstance()
         */
        constructor() {
            if (EdgeManager._instance) {
                throw new Error('EdgeManager is a singleton. Use EdgeManager.getInstance()');
            }

            // Edge storage
            this._edges = new Map(); // id -> UnifiedEdge
            this._edgesByFacePair = new Map(); // "faceA-faceB" -> UnifiedEdge

            // Current mode
            this._currentMode = 'standard';

            // Animation state
            this._isAnimating = false;
            this._lastFrameTime = 0;

            // Scene reference
            this._scene = null;

            // Initialization state
            this._initialized = false;
        }

        /**
         * Get the singleton instance
         * @returns {EdgeManager}
         */
        static getInstance() {
            if (!EdgeManager._instance) {
                EdgeManager._instance = new EdgeManager();
            }
            return EdgeManager._instance;
        }

        // ====================================================================
        // SECTION 2: INITIALIZATION
        // ====================================================================

        /**
         * Initialize the EdgeManager with edge data
         *
         * @param {Object} options - Initialization options
         * @param {THREE.Scene} options.scene - Three.js scene for visualization
         * @param {Array} options.faces - Face data array from Quannex state
         * @param {Object} options.edgeTensionData - Edge tension JSON data
         * @param {Object} options.edgeKPILibrary - Edge KPI definitions
         * @param {Array} options.edgePositions - Array of {id, start, end} positions
         */
        initialize(options = {}) {
            if (this._initialized) {
                Logger.warn('EdgeManager', 'Already initialized. Call reset() first.');
                return this;
            }

            const {
                scene,
                faces = [],
                edgeTensionData = {},
                edgeKPILibrary = {},
                edgePositions = []
            } = options;

            this._scene = scene;

            // Get edge tension data
            const tensions = edgeTensionData.edges || [];

            // Get edge KPI library
            const kpiLibrary = edgeKPILibrary || global.EdgeConstants?.EDGE_KPI_LIBRARY || {};

            // Create UnifiedEdge instances
            tensions.forEach((edgeData, index) => {
                const edgeId = edgeData.id;
                const kpi = kpiLibrary[edgeId] || {};

                // Find face data
                const faceA = this._buildFaceObject(edgeData.faceA, faces);
                const faceB = this._buildFaceObject(edgeData.faceB, faces);

                // Find position data
                const posData = edgePositions.find(p => p.id === edgeId) || {};

                // Create UnifiedEdge
                const edge = new global.UnifiedEdge({
                    id: edgeId,
                    faceA,
                    faceB,
                    tension: edgeData.computed?.tension || 0.5,
                    breathRatio: edgeData.computed?.breathRatio || 1.0,
                    kpi: {
                        ...kpi,
                        kpiName: edgeData.kpi?.name || kpi.kpiName,
                        kpiCoherence: edgeData.computed?.kpiCoherence,
                        metric: edgeData.kpi?.metric || kpi.metric,
                        question: edgeData.philosophy?.question || kpi.question
                    },
                    startPos: posData.start,
                    endPos: posData.end
                });

                // Calculate initial state
                edge.recalculate();

                // Store in maps
                this._edges.set(edgeId, edge);
                this._edgesByFacePair.set(this._facePairKey(faceA.id, faceB.id), edge);
            });

            this._initialized = true;
            Logger.info('EdgeManager', `Initialized with ${this._edges.size} edges`);

            return this;
        }

        /**
         * Build a face object for edge creation
         * @private
         */
        _buildFaceObject(faceData, faces) {
            const faceId = faceData?.id || 1;
            const faceName = faceData?.name || `Face ${faceId}`;

            // Try to find detailed face data
            const detailedFace = faces.find(f => f.id === faceId || f.faceNumber === faceId);

            return {
                id: faceId,
                name: faceName,
                energy: faceData?.energy || detailedFace?.energy || 0.5,
                earth: detailedFace?.elements?.earth || 0.5,
                water: detailedFace?.elements?.water || 0.5,
                fire: detailedFace?.elements?.fire || 0.5,
                air: detailedFace?.elements?.air || 0.5,
                ether: detailedFace?.elements?.ether || 0.5
            };
        }

        /**
         * Generate a consistent key for face pairs
         * @private
         */
        _facePairKey(faceA, faceB) {
            const [min, max] = [faceA, faceB].sort((a, b) => a - b);
            return `${min}-${max}`;
        }

        // ====================================================================
        // SECTION 3: EDGE ACCESS
        // ====================================================================

        /**
         * Get an edge by ID
         * @param {string} edgeId - Edge ID (e.g., 'E1-2')
         * @returns {UnifiedEdge|null}
         */
        getEdge(edgeId) {
            return this._edges.get(edgeId) || null;
        }

        /**
         * Get edge between two faces
         * @param {number} faceA - First face ID
         * @param {number} faceB - Second face ID
         * @returns {UnifiedEdge|null}
         */
        getEdgeBetweenFaces(faceA, faceB) {
            return this._edgesByFacePair.get(this._facePairKey(faceA, faceB)) || null;
        }

        /**
         * Get all edges connected to a face
         * @param {number} faceId - Face ID (1-12)
         * @returns {Array<UnifiedEdge>}
         */
        getEdgesForFace(faceId) {
            return Array.from(this._edges.values()).filter(
                edge => edge.faceA.id === faceId || edge.faceB.id === faceId
            );
        }

        /**
         * Get all edges with a specific health state
         * @param {string} healthStateId - Health state ID (wall, gate, membrane, etc.)
         * @returns {Array<UnifiedEdge>}
         */
        getEdgesByHealthState(healthStateId) {
            return Array.from(this._edges.values()).filter(
                edge => edge.getHealthState()?.id === healthStateId
            );
        }

        /**
         * Get all edges with a specific dominant element
         * @param {string} elementId - Element ID (earth, water, fire, air, ether)
         * @returns {Array<UnifiedEdge>}
         */
        getEdgesByDominantElement(elementId) {
            return Array.from(this._edges.values()).filter(
                edge => edge.getDominantElement()?.id === elementId
            );
        }

        /**
         * Get all edges
         * @returns {Array<UnifiedEdge>}
         */
        getAllEdges() {
            return Array.from(this._edges.values());
        }

        /**
         * Get edge count
         * @returns {number}
         */
        getEdgeCount() {
            return this._edges.size;
        }

        // ====================================================================
        // SECTION 4: MODE MANAGEMENT
        // ====================================================================

        /**
         * Set visualization mode for all edges
         * @param {string} mode - 'standard', 'advanced', or 'complete'
         */
        setMode(mode) {
            if (this._currentMode === mode) return;

            this._currentMode = mode;

            // Update all edges
            this._edges.forEach(edge => {
                edge.setMode(mode);
            });

            Logger.debug('EdgeManager', `Mode changed to: ${mode}`);
        }

        /**
         * Get current visualization mode
         * @returns {string}
         */
        getMode() {
            return this._currentMode;
        }

        // ====================================================================
        // SECTION 5: UPDATES & ANIMATION
        // ====================================================================

        /**
         * Recalculate all edge states
         * Call this when face values change
         */
        recalculateAll() {
            this._edges.forEach(edge => {
                edge.recalculate();
            });
        }

        /**
         * Update a specific edge's tension value
         * @param {string} edgeId - Edge ID
         * @param {number} tension - New tension value (0-1)
         */
        updateEdgeTension(edgeId, tension) {
            const edge = this._edges.get(edgeId);
            if (edge) {
                edge.tension = tension;
                edge.recalculate();
            }
        }

        /**
         * Start animation loop
         */
        startAnimation() {
            if (this._isAnimating) return;

            this._isAnimating = true;
            this._lastFrameTime = performance.now();
            this._animate();
        }

        /**
         * Stop animation loop
         */
        stopAnimation() {
            this._isAnimating = false;
        }

        /**
         * Animation loop
         * @private
         */
        _animate() {
            if (!this._isAnimating) return;

            const now = performance.now();
            const deltaTime = (now - this._lastFrameTime) / 1000;
            this._lastFrameTime = now;

            // Update all edges
            this._edges.forEach(edge => {
                edge.animate(deltaTime);
            });

            // Schedule next frame
            requestAnimationFrame(() => this._animate());
        }

        // ====================================================================
        // SECTION 6: VISUALIZATION
        // ====================================================================

        /**
         * Create all edge meshes
         * @param {THREE.Scene} scene - Scene to add meshes to
         */
        createAllMeshes(scene) {
            this._scene = scene || this._scene;

            if (!this._scene) {
                Logger.error('EdgeManager', 'No scene provided for mesh creation');
                return;
            }

            this._edges.forEach(edge => {
                if (edge.startPos && edge.endPos) {
                    edge.createMesh(this._scene);
                }
            });
        }

        /**
         * Dispose all edge meshes
         */
        disposeAllMeshes() {
            this._edges.forEach(edge => {
                edge.dispose();
            });
        }

        // ====================================================================
        // SECTION 7: STATISTICS & REPORTING
        // ====================================================================

        /**
         * Get health state distribution
         * @returns {Object} Counts by health state
         */
        getHealthStateDistribution() {
            const distribution = {
                wall: 0,
                gate: 0,
                membrane: 0,
                hemorrhage: 0,
                vortex: 0
            };

            this._edges.forEach(edge => {
                const state = edge.getHealthState()?.id;
                if (state && distribution[state] !== undefined) {
                    distribution[state]++;
                }
            });

            return distribution;
        }

        /**
         * Get dominant element distribution
         * @returns {Object} Counts by element
         */
        getDominantElementDistribution() {
            const distribution = {
                earth: 0,
                water: 0,
                fire: 0,
                air: 0,
                ether: 0
            };

            this._edges.forEach(edge => {
                const element = edge.getDominantElement()?.id;
                if (element && distribution[element] !== undefined) {
                    distribution[element]++;
                }
            });

            return distribution;
        }

        /**
         * Get average tension
         * @returns {number}
         */
        getAverageTension() {
            if (this._edges.size === 0) return 0;

            let total = 0;
            this._edges.forEach(edge => {
                total += edge.tension;
            });

            return total / this._edges.size;
        }

        /**
         * Get edges sorted by tension
         * @param {boolean} descending - Sort in descending order
         * @returns {Array<UnifiedEdge>}
         */
        getEdgesSortedByTension(descending = true) {
            const edges = Array.from(this._edges.values());
            return edges.sort((a, b) => descending
                ? b.tension - a.tension
                : a.tension - b.tension
            );
        }

        // ====================================================================
        // SECTION 8: CLEANUP
        // ====================================================================

        /**
         * Reset the EdgeManager
         * Disposes all edges and clears state
         */
        reset() {
            this.stopAnimation();
            this.disposeAllMeshes();
            this._edges.clear();
            this._edgesByFacePair.clear();
            this._currentMode = 'standard';
            this._initialized = false;

            Logger.info('EdgeManager', 'Reset complete');
        }

        /**
         * Export all edges as JSON
         * @returns {Array<Object>}
         */
        toJSON() {
            return Array.from(this._edges.values()).map(edge => edge.toJSON());
        }
    }

    // Singleton instance holder
    EdgeManager._instance = null;

    // ========================================================================
    // SECTION 9: EXPORTS
    // ========================================================================

    global.EdgeManager = EdgeManager;

    Logger.info('EdgeManager', 'EdgeManager module loaded - Orchestrating 30 pure membranes');

})(typeof window !== 'undefined' ? window : this);
