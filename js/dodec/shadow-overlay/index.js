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
 * ✅ shadow-state-manager.js - COMPLETE (~230 lines - state & persistence)
 * ✅ shadow-card-renderer.js - COMPLETE (~270 lines - card HTML generation)
 * ✅ shadow-source-toggle.js - COMPLETE (~700 lines - ShadowSourceToggle class)
 * ✅ shadow-overlay-controller.js - COMPLETE (~280 lines - open/close/toggle)
 * ✅ shadow-event-handlers.js - COMPLETE (~230 lines - keyboard/mouse events)
 * ✅ shadow-system-integration.js - COMPLETE (~280 lines - external hooks)
 *
 * PLANNED STRUCTURE:
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *   js/dodec/
 *   ├── shadow-overlay/
 *   │   ├── index.js                      (YOU ARE HERE - barrel export)
 *   │   ├── shadow-state-manager.js       ✅ (~230 lines - state & persistence)
 *   │   ├── shadow-card-renderer.js       ✅ (~270 lines - card HTML generation)
 *   │   ├── shadow-source-toggle.js       ✅ (~700 lines - ShadowSourceToggle class)
 *   │   ├── shadow-overlay-controller.js  ✅ (~280 lines - open/close/toggle)
 *   │   ├── shadow-event-handlers.js      ✅ (~230 lines - keyboard/mouse events)
 *   │   └── shadow-system-integration.js  ✅ (~280 lines - external hooks)
 *   │
 *   └── dodec-shadow-overlay.js           (thin orchestrator ~80 lines)
 *
 * TOTAL EXTRACTION: ~1,990 lines across 6 modules
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
        lines: 230,
        exports: 'window.ShadowStateManager',
        dependencies: []
    },
    cardRenderer: {
        path: './shadow-overlay/shadow-card-renderer.js',
        status: 'complete',
        lines: 270,
        exports: 'window.ShadowCardRenderer',
        dependencies: ['stateManager']
    },
    sourceToggle: {
        path: './shadow-overlay/shadow-source-toggle.js',
        status: 'complete',
        lines: 700,
        exports: 'window.ShadowSourceToggle',
        dependencies: ['stateManager', 'cardRenderer']
    },
    overlayController: {
        path: './shadow-overlay/shadow-overlay-controller.js',
        status: 'complete',
        lines: 280,
        exports: 'window.ShadowOverlayController',
        dependencies: ['stateManager', 'cardRenderer', 'sourceToggle']
    },
    eventHandlers: {
        path: './shadow-overlay/shadow-event-handlers.js',
        status: 'complete',
        lines: 230,
        exports: 'window.ShadowEventHandlers',
        dependencies: ['overlayController']
    },
    systemIntegration: {
        path: './shadow-overlay/shadow-system-integration.js',
        status: 'complete',
        lines: 280,
        exports: 'window.ShadowSystemIntegration',
        dependencies: ['stateManager', 'overlayController']
    }
};

// Export to window for introspection
if (typeof window !== 'undefined') {
    window.SHADOW_OVERLAY_MODULES = SHADOW_OVERLAY_MODULES;

    // Re-export all modules for convenience
    window.ShadowOverlay = {
        modules: SHADOW_OVERLAY_MODULES,
        StateManager: window.ShadowStateManager,
        CardRenderer: window.ShadowCardRenderer,
        SourceToggle: window.ShadowSourceToggle,
        OverlayController: window.ShadowOverlayController,
        EventHandlers: window.ShadowEventHandlers,
        SystemIntegration: window.ShadowSystemIntegration
    };

    // Calculate total lines
    const totalLines = Object.values(SHADOW_OVERLAY_MODULES)
        .reduce((sum, m) => sum + (m.lines || 0), 0);

    console.log('[ShadowOverlay/index] ✅ All 6 modules complete');
    console.log(`[ShadowOverlay/index] Total extraction: ${totalLines} lines`);
}
