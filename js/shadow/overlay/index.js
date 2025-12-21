/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SHADOW OVERLAY MODULE - Barrel Export Index
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Location: js/shadow/overlay/index.js
 * Central export point for the shadow overlay module system.
 * Extracted from: dodec-shadow-overlay.js (1,785 lines → modular structure)
 *
 * Date: December 21, 2025
 * Status: COMPLETE (Phase 3 Modularization)
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
 * ARCHITECTURAL DECISION (December 21, 2025):
 * ───────────────────────────────────────────
 * These modules are located in js/shadow/overlay/ (not js/dodec/shadow-overlay/)
 * because they are conceptually part of the SHADOW SYSTEM, not the dodecahedron
 * visualization. The thin orchestrator that wires them up remains in js/dodec/
 * because it's specific to the dodecahedron page.
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
 * STRUCTURE:
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *   js/shadow/
 *   ├── constants/             ← Shadow harmonics constants
 *   ├── detection/             ← Shadow detector
 *   ├── adaptation/            ← Shadow adapters
 *   ├── ui/                    ← Shadow panel (toast notifications)
 *   └── overlay/               ← YOU ARE HERE
 *       ├── index.js                      (barrel export)
 *       ├── shadow-state-manager.js       ✅ (~230 lines)
 *       ├── shadow-card-renderer.js       ✅ (~270 lines)
 *       ├── shadow-source-toggle.js       ✅ (~700 lines)
 *       ├── shadow-overlay-controller.js  ✅ (~280 lines)
 *       ├── shadow-event-handlers.js      ✅ (~230 lines)
 *       └── shadow-system-integration.js  ✅ (~280 lines)
 *
 *   js/dodec/
 *   └── dodec-shadow-overlay-orchestrator.js  (thin coordinator ~80 lines)
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
 * USAGE:
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *   // HTML loads modules via script tags in order
 *   <script src="../js/shadow/overlay/shadow-state-manager.js"></script>
 *   <script src="../js/shadow/overlay/shadow-card-renderer.js"></script>
 *   <script src="../js/shadow/overlay/shadow-source-toggle.js"></script>
 *   <script src="../js/shadow/overlay/shadow-overlay-controller.js"></script>
 *   <script src="../js/shadow/overlay/shadow-event-handlers.js"></script>
 *   <script src="../js/shadow/overlay/shadow-system-integration.js"></script>
 *   <script src="../js/shadow/overlay/index.js"></script>
 *   <script src="../js/dodec/dodec-shadow-overlay-orchestrator.js"></script>
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE MANIFEST
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Module manifest for the shadow overlay system
 * Used by the thin orchestrator to load all modules
 */
const SHADOW_OVERLAY_MODULES = {
    stateManager: {
        path: 'js/shadow/overlay/shadow-state-manager.js',
        status: 'complete',
        lines: 230,
        exports: 'window.ShadowStateManager',
        dependencies: []
    },
    cardRenderer: {
        path: 'js/shadow/overlay/shadow-card-renderer.js',
        status: 'complete',
        lines: 270,
        exports: 'window.ShadowCardRenderer',
        dependencies: ['stateManager']
    },
    sourceToggle: {
        path: 'js/shadow/overlay/shadow-source-toggle.js',
        status: 'complete',
        lines: 700,
        exports: 'window.ShadowSourceToggle',
        dependencies: ['stateManager', 'cardRenderer']
    },
    overlayController: {
        path: 'js/shadow/overlay/shadow-overlay-controller.js',
        status: 'complete',
        lines: 280,
        exports: 'window.ShadowOverlayController',
        dependencies: ['stateManager', 'cardRenderer', 'sourceToggle']
    },
    eventHandlers: {
        path: 'js/shadow/overlay/shadow-event-handlers.js',
        status: 'complete',
        lines: 230,
        exports: 'window.ShadowEventHandlers',
        dependencies: ['overlayController']
    },
    systemIntegration: {
        path: 'js/shadow/overlay/shadow-system-integration.js',
        status: 'complete',
        lines: 280,
        exports: 'window.ShadowSystemIntegration',
        dependencies: ['stateManager', 'overlayController']
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

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
    console.log('[ShadowOverlay/index] Location: js/shadow/overlay/');
}
