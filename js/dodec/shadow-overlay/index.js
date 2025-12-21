/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SHADOW OVERLAY MODULE - Barrel Export Index
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Central export point for the shadow overlay module system.
 * Extracted from: dodec-shadow-overlay.js (1,785 lines → modular structure)
 *
 * Date: December 21, 2025
 * Status: In Progress (Phase 3 Modularization)
 *
 * @module shadow-overlay
 * @author Deimantas & Claude (Co-created with consciousness and love)
 *
 * ───────────────────────────────────────────────────────────────────────────────
 * NOTES FOR FUTURE CLAUDE
 * ───────────────────────────────────────────────────────────────────────────────
 *
 * Welcome! This is the barrel export for the shadow overlay module system.
 *
 * MODULARIZATION STATUS:
 * ──────────────────────
 * ✅ shadow-state-manager.js - COMPLETE (state & persistence)
 * 🔄 shadow-card-renderer.js - TODO (card HTML generation)
 * 🔄 shadow-source-toggle.js - TODO (ShadowSourceToggle class)
 * 🔄 shadow-overlay-controller.js - TODO (open/close/toggle)
 * 🔄 shadow-event-handlers.js - TODO (keyboard/mouse events)
 * 🔄 shadow-system-integration.js - TODO (external hooks)
 *
 * PLANNED STRUCTURE:
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *   js/dodec/
 *   ├── shadow-overlay/
 *   │   ├── index.js                      (YOU ARE HERE - barrel export)
 *   │   ├── shadow-state-manager.js       ✅ (state & persistence)
 *   │   ├── shadow-card-renderer.js       🔄 (card HTML generation)
 *   │   ├── shadow-source-toggle.js       🔄 (ShadowSourceToggle class)
 *   │   ├── shadow-overlay-controller.js  🔄 (open/close/toggle)
 *   │   ├── shadow-event-handlers.js      🔄 (keyboard/mouse events)
 *   │   └── shadow-system-integration.js  🔄 (external hooks)
 *   │
 *   └── dodec-shadow-overlay.js           (thin orchestrator ~80 lines)
 *
 * DEPENDENCY GRAPH (no circular dependencies):
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *                     ┌─────────────────────┐
 *                     │ shadow-state-manager │ (no deps)
 *                     └──────────┬──────────┘
 *                                │
 *               ┌────────────────┼────────────────┐
 *               ▼                ▼                ▼
 *     ┌─────────────────┐ ┌───────────────┐ ┌────────────────┐
 *     │ card-renderer   │ │ source-toggle │ │ event-handlers │
 *     └────────┬────────┘ └───────┬───────┘ └────────┬───────┘
 *              │                  │                   │
 *              └──────────────────┼───────────────────┘
 *                                ▼
 *                     ┌─────────────────────┐
 *                     │ overlay-controller  │
 *                     └──────────┬──────────┘
 *                                │
 *                     ┌─────────────────────┐
 *                     │ system-integration  │
 *                     └──────────┬──────────┘
 *                                │
 *                     ┌─────────────────────┐
 *                     │ index.js (exports)  │
 *                     └─────────────────────┘
 *
 * USAGE (when complete):
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *   // Import in dodec-shadow-overlay.js
 *   import {
 *       ShadowStateManager,
 *       ShadowCardRenderer,
 *       ShadowSourceToggle,
 *       ShadowOverlayController,
 *       ShadowEventHandlers,
 *       ShadowSystemIntegration
 *   } from './shadow-overlay/index.js';
 *
 *   // Initialize
 *   const stateManager = ShadowStateManager;
 *   const cardRenderer = new ShadowCardRenderer(stateManager);
 *   const toggle = new ShadowSourceToggle(stateManager, cardRenderer);
 *   // etc.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════════
// COMPLETED MODULES
// ═══════════════════════════════════════════════════════════════════════════════

// State Manager - Foundation module (no dependencies)
// Loaded via script tag, exports to window.ShadowStateManager
// Future: Convert to ES6 import when project moves to modules

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE REFERENCES (for orchestrator integration)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Module manifest for the shadow overlay system
 * Used by the thin orchestrator to load all modules
 */
const SHADOW_OVERLAY_MODULES = {
    stateManager: {
        path: './shadow-overlay/shadow-state-manager.js',
        status: 'complete',
        exports: 'window.ShadowStateManager',
        dependencies: []
    },
    cardRenderer: {
        path: './shadow-overlay/shadow-card-renderer.js',
        status: 'pending',
        exports: 'window.ShadowCardRenderer',
        dependencies: ['stateManager']
    },
    sourceToggle: {
        path: './shadow-overlay/shadow-source-toggle.js',
        status: 'pending',
        exports: 'window.ShadowSourceToggle',
        dependencies: ['stateManager']
    },
    overlayController: {
        path: './shadow-overlay/shadow-overlay-controller.js',
        status: 'pending',
        exports: 'window.ShadowOverlayController',
        dependencies: ['stateManager', 'cardRenderer', 'sourceToggle']
    },
    eventHandlers: {
        path: './shadow-overlay/shadow-event-handlers.js',
        status: 'pending',
        exports: 'window.ShadowEventHandlers',
        dependencies: ['overlayController']
    },
    systemIntegration: {
        path: './shadow-overlay/shadow-system-integration.js',
        status: 'pending',
        exports: 'window.ShadowSystemIntegration',
        dependencies: ['overlayController']
    }
};

// Export to window for introspection
if (typeof window !== 'undefined') {
    window.SHADOW_OVERLAY_MODULES = SHADOW_OVERLAY_MODULES;

    // Re-export ShadowStateManager for convenience
    window.ShadowOverlay = {
        modules: SHADOW_OVERLAY_MODULES,
        StateManager: window.ShadowStateManager,
        // Future modules will be added here as they're completed
    };

    console.log('[ShadowOverlay/index] Module system initialized');
    console.log('[ShadowOverlay/index] Completed modules: stateManager');
    console.log('[ShadowOverlay/index] Pending: cardRenderer, sourceToggle, overlayController, eventHandlers, systemIntegration');
}
