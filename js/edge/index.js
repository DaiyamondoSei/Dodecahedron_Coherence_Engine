/**
 * ════════════════════════════════════════════════════════════════════════════
 * EDGE MODULE INDEX - Pure Membrane Architecture Entry Point
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Created: January 2026
 * Part of: Twinkling Floating Aurora v2 Architecture
 *
 * PURPOSE:
 * Entry point for the Edge module. Exports all edge-related functionality
 * for use by the rest of the application.
 *
 * LOAD ORDER:
 * ─────────────────────────────────────────────────────────────────────────
 * 1. unified-edge.js - Must be loaded first (defines UnifiedEdge class)
 * 2. edge-manager.js - Depends on UnifiedEdge
 * 3. index.js - Aggregates exports (this file)
 *
 * HTML SCRIPT LOADING:
 * ─────────────────────────────────────────────────────────────────────────
 * <script src="../js/edge/unified-edge.js"></script>
 * <script src="../js/edge/edge-manager.js"></script>
 * <script src="../js/edge/index.js"></script>
 *
 * EXPORTS:
 * ─────────────────────────────────────────────────────────────────────────
 * - UnifiedEdge: Class representing a single edge
 * - EdgeManager: Singleton orchestrating all 30 edges
 * - EDGE_MODES: Visualization mode constants
 * - EDGE_HEALTH_COLORS: Color constants for health states
 * - EDGE_ELEMENT_COLORS: Color constants for elements
 *
 * @module js/edge
 * @author Deimantas & Claude (Co-created with consciousness and love)
 * @version 1.0.0
 * ════════════════════════════════════════════════════════════════════════════
 */

(function(global) {
    'use strict';

    // ========================================================================
    // SECTION 1: VALIDATION
    // ========================================================================

    // Verify dependencies are loaded
    if (!global.UnifiedEdge) {
        console.error('[Edge Module] UnifiedEdge not loaded. Load unified-edge.js first.');
    }

    if (!global.EdgeManager) {
        console.error('[Edge Module] EdgeManager not loaded. Load edge-manager.js first.');
    }

    // ========================================================================
    // SECTION 2: MODULE NAMESPACE
    // ========================================================================

    /**
     * Edge Module namespace
     * Provides convenient access to all edge-related exports
     */
    const EdgeModule = {
        // Classes
        UnifiedEdge: global.UnifiedEdge,
        EdgeManager: global.EdgeManager,

        // Constants
        MODES: global.EDGE_MODES,
        HEALTH_COLORS: global.EDGE_HEALTH_COLORS,
        ELEMENT_COLORS: global.EDGE_ELEMENT_COLORS,

        // Convenience methods
        /**
         * Get the EdgeManager singleton
         * @returns {EdgeManager}
         */
        getManager: function() {
            return global.EdgeManager.getInstance();
        },

        /**
         * Create an edge instance
         * @param {Object} config - Edge configuration
         * @returns {UnifiedEdge}
         */
        createEdge: function(config) {
            return new global.UnifiedEdge(config);
        },

        /**
         * Module version
         */
        version: '1.0.0',

        /**
         * Module creation date
         */
        created: 'January 2026'
    };

    // ========================================================================
    // SECTION 3: INTEGRATION HELPERS
    // ========================================================================

    /**
     * Initialize edge system with Quannex data
     *
     * Convenience function to set up the EdgeManager with data from
     * the existing Quannex state and JSON files.
     *
     * @param {Object} options - Options
     * @param {THREE.Scene} options.scene - Three.js scene
     * @returns {EdgeManager}
     */
    EdgeModule.initializeWithQuannex = function(options = {}) {
        const manager = EdgeModule.getManager();

        // Get data from global state
        const faces = global.Quannex?.state?.faces ||
                      global.advancedAnalysisResults?.faces ||
                      [];

        const edgeTensionData = global.Quannex?.edgeTensionData ||
                                global.advancedAnalysisResults?.edgeTension ||
                                {};

        const edgeKPILibrary = global.EdgeConstants?.EDGE_KPI_LIBRARY || {};

        // Initialize
        manager.initialize({
            scene: options.scene,
            faces,
            edgeTensionData,
            edgeKPILibrary,
            edgePositions: options.edgePositions || []
        });

        return manager;
    };

    /**
     * Quick edge lookup
     *
     * @param {string} edgeId - Edge ID (e.g., 'E1-2')
     * @returns {Object|null} Edge display data or null
     */
    EdgeModule.getEdgeData = function(edgeId) {
        const manager = EdgeModule.getManager();
        const edge = manager.getEdge(edgeId);
        return edge ? edge.toDisplayData() : null;
    };

    /**
     * Get Sacred Inquiry for an edge
     *
     * @param {string} edgeId - Edge ID
     * @returns {Object|null} Sacred Inquiry data or null
     */
    EdgeModule.getEdgeInquiry = function(edgeId) {
        const manager = EdgeModule.getManager();
        const edge = manager.getEdge(edgeId);
        return edge ? edge.getSacredInquiry() : null;
    };

    // ========================================================================
    // SECTION 4: EXPORTS
    // ========================================================================

    // Export module namespace
    global.EdgeModule = EdgeModule;

    // Log successful load
    console.log('🔗 Edge Module loaded - Pure Membrane Architecture complete');
    console.log('   Exports: EdgeModule, UnifiedEdge, EdgeManager');
    console.log('   Usage: EdgeModule.getManager().initialize({ scene, ... })');

})(typeof window !== 'undefined' ? window : this);
