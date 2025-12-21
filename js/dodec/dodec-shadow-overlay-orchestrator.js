/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SHADOW OVERLAY ORCHESTRATOR - Thin Coordinator for Modular Shadow System
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * REFACTORED: December 21, 2025
 * Original file: 1,785 lines → Now ~80 lines
 * Modules: 6 extracted modules totaling ~1,990 lines
 *
 * @module dodec-shadow-overlay-orchestrator
 * @author Deimantas & Claude (Co-created with consciousness and love)
 * @version 2.0.0 - Modularized version
 *
 * ───────────────────────────────────────────────────────────────────────────────
 * NOTES FOR FUTURE CLAUDE
 * ───────────────────────────────────────────────────────────────────────────────
 *
 * Welcome! This is now a THIN ORCHESTRATOR - just coordination, no logic.
 *
 * KEY INSIGHT: This file does THREE things:
 * 1. Initialize all modules in the correct order
 * 2. Wire up module dependencies
 * 3. Expose the public API (window.shadowOverlayController)
 *
 * MODULE LOADING ORDER (dependency-aware):
 * ────────────────────────────────────────
 *   1. shadow-state-manager.js     (foundation - no deps)
 *   2. shadow-card-renderer.js     (depends on state)
 *   3. shadow-source-toggle.js     (depends on state, cards)
 *   4. shadow-overlay-controller.js (depends on state, cards, toggle)
 *   5. shadow-event-handlers.js    (depends on controller)
 *   6. shadow-system-integration.js (depends on state, controller)
 *
 * BACKWARD COMPATIBILITY:
 * ───────────────────────
 * The public API (window.shadowOverlayController) is preserved.
 * Existing code that calls open(), close(), updateShadows() will work unchanged.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */
(function(global) {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════
    // MODULE REFERENCES
    // ═══════════════════════════════════════════════════════════════════════

    let shadowSourceToggle = null;

    // ═══════════════════════════════════════════════════════════════════════
    // INITIALIZATION
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Initialize the shadow overlay system
     * Coordinates all modules and wires up dependencies
     */
    function init() {
        // Get module references (loaded via script tags before this file)
        const StateManager = global.ShadowStateManager;
        const CardRenderer = global.ShadowCardRenderer;
        const SourceToggle = global.ShadowSourceToggle;
        const Controller = global.ShadowOverlayController;
        const EventHandlers = global.ShadowEventHandlers;
        const SystemIntegration = global.ShadowSystemIntegration;

        // Verify modules loaded
        if (!StateManager || !Controller) {
            console.error('[ShadowOverlay] Critical modules missing - check script load order');
            return;
        }

        // Initialize overlay controller with DOM references
        Controller.init({
            overlay: document.getElementById('shadowOverlay'),
            overlayContent: document.getElementById('shadowOverlayContent'),
            coherenceHud: document.getElementById('coherenceHud'),
            shadowCount: document.getElementById('shadowCount')
        });

        // Initialize source toggle (if container exists)
        const toggleContainer = document.getElementById('shadowSourceToggleContainer');
        if (toggleContainer && SourceToggle) {
            shadowSourceToggle = new SourceToggle(toggleContainer);
            Controller.setSourceToggle(shadowSourceToggle);
            console.log('[ShadowOverlay] 🔄 Source toggle initialized');
        }

        // Initialize event handlers
        if (EventHandlers) {
            EventHandlers.init({
                openButton: document.getElementById('openShadowOverlay'),
                closeButton: document.getElementById('closeShadowOverlay')
            });
        }

        // Initialize system integration (sync, events, shadow panel hook)
        if (SystemIntegration) {
            SystemIntegration.init({
                syncInterval: 10000,
                initialDelay: 2000
            });
        }

        console.log('[ShadowOverlay] 👁️ Shadow overlay system initialized (modular)');
        console.log('[ShadowOverlay] Press "S" to toggle shadow analysis overlay');
    }

    // ═══════════════════════════════════════════════════════════════════════
    // LIFECYCLE
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Cleanup all resources
     * CRITICAL: Call on page unload to prevent memory leaks
     */
    function destroy() {
        const Controller = global.ShadowOverlayController;
        const EventHandlers = global.ShadowEventHandlers;
        const SystemIntegration = global.ShadowSystemIntegration;
        const StateManager = global.ShadowStateManager;

        // Cleanup in reverse order
        if (SystemIntegration) SystemIntegration.cleanup();
        if (EventHandlers) EventHandlers.cleanup();
        if (Controller) Controller.cleanup();
        if (StateManager) StateManager.resetState();

        shadowSourceToggle = null;

        console.log('[ShadowOverlay] Destroyed - all resources cleaned up');
    }

    // ═══════════════════════════════════════════════════════════════════════
    // PUBLIC API (backward compatible)
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Public controller interface
     * Maintains backward compatibility with existing code
     */
    global.shadowOverlayController = {
        // Core operations (delegated to Controller)
        open: () => global.ShadowOverlayController?.open(),
        close: () => global.ShadowOverlayController?.close(),
        toggle: () => global.ShadowOverlayController?.toggle(),
        isOpen: () => global.ShadowOverlayController?.isOpen() || false,

        // Shadow updates (delegated to SystemIntegration)
        updateShadows: (shadows, source) =>
            global.ShadowSystemIntegration?.updateShadowIndicator(shadows, source),
        getShadows: () => global.ShadowStateManager?.getCurrentShadows() || [],

        // Focus functionality (delegated to Controller)
        focusOnShadow: (shadow) => global.ShadowOverlayController?.focusOnShadowFace(shadow),

        // Source management (delegated to StateManager)
        setActiveSource: (source) => global.ShadowStateManager?.setActiveSource(source),
        getTemplateCount: () => global.ShadowStateManager?.getTemplateCount() || 0,
        getAICount: () => global.ShadowStateManager?.getAICount() || 0,

        // State inspection
        getState: () => ({
            ...global.ShadowOverlayController?.getState(),
            currentShadows: global.ShadowStateManager?.getCurrentShadows() || [],
            syncIntervalActive: global.ShadowSystemIntegration?.isSyncActive() || false
        }),

        // Lifecycle
        destroy
    };

    // ═══════════════════════════════════════════════════════════════════════
    // AUTO-INITIALIZATION
    // ═══════════════════════════════════════════════════════════════════════

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})(typeof window !== 'undefined' ? window : this);
