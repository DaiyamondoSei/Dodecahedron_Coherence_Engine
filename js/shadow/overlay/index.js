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
 * ✅ shadow-card-templates.js - COMPLETE (~450 lines - pure HTML generation)
 * ✅ shadow-card-renderer.js - COMPLETE (~415 lines - orchestration & events)
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
 *       ├── shadow-card-templates.js      ✅ (~450 lines) ← NEW v2.0
 *       ├── shadow-card-renderer.js       ✅ (~415 lines) ← REFACTORED v2.0
 *       ├── shadow-source-toggle.js       ✅ (~700 lines)
 *       ├── shadow-overlay-controller.js  ✅ (~280 lines)
 *       ├── shadow-event-handlers.js      ✅ (~230 lines)
 *       └── shadow-system-integration.js  ✅ (~280 lines)
 *
 *   js/dodec/
 *   └── dodec-shadow-overlay-orchestrator.js  (thin coordinator ~80 lines)
 *
 * TOTAL EXTRACTION: ~2,585 lines across 7 modules (v2.0)
 *
 * DEPENDENCY GRAPH (no circular dependencies):
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *                     ┌─────────────────────┐
 *                     │ shadow-state-manager │ (no deps)
 *                     └──────────┬──────────┘
 *                                │
 *               ┌────────────────┼────────────────────────────┐
 *               ▼                ▼                            │
 *     ┌─────────────────┐ ┌───────────────────┐               │
 *     │ card-templates  │ │  source-toggle    │               │
 *     │ (pure functions)│ └─────────┬─────────┘               │
 *     └────────┬────────┘           │                         │
 *              ▼                    │                         │
 *     ┌─────────────────┐           │              ┌──────────┴───────┐
 *     │  card-renderer  │◄──────────┘              │  event-handlers  │
 *     │ (orchestration) │                          └────────┬─────────┘
 *     └────────┬────────┘                                   │
 *              │                                            │
 *              └──────────────────┬─────────────────────────┘
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
 *   // HTML loads modules via script tags in order (CRITICAL: order matters!)
 *   <script src="../js/shadow/overlay/shadow-state-manager.js"></script>
 *   <script src="../js/shadow/overlay/shadow-card-templates.js"></script>  <!-- NEW v2.0 -->
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
        dependencies: [],
        description: 'Central state & sessionStorage persistence'
    },
    cardTemplates: {
        path: 'js/shadow/overlay/shadow-card-templates.js',
        status: 'complete',
        lines: 450,
        exports: 'window.ShadowCardTemplates',
        dependencies: [],
        description: 'Pure HTML generation functions (v2.0)'
    },
    cardRenderer: {
        path: 'js/shadow/overlay/shadow-card-renderer.js',
        status: 'complete',
        lines: 415,
        exports: 'window.ShadowCardRenderer',
        dependencies: ['stateManager', 'cardTemplates'],
        description: 'Orchestration, events & animation (v2.0)'
    },
    sourceToggle: {
        path: 'js/shadow/overlay/shadow-source-toggle.js',
        status: 'complete',
        lines: 700,
        exports: 'window.ShadowSourceToggle',
        dependencies: ['stateManager', 'cardRenderer'],
        description: 'Template/AI source switching UI'
    },
    overlayController: {
        path: 'js/shadow/overlay/shadow-overlay-controller.js',
        status: 'complete',
        lines: 280,
        exports: 'window.ShadowOverlayController',
        dependencies: ['stateManager', 'cardRenderer', 'sourceToggle'],
        description: 'Open/close/toggle overlay'
    },
    eventHandlers: {
        path: 'js/shadow/overlay/shadow-event-handlers.js',
        status: 'complete',
        lines: 230,
        exports: 'window.ShadowEventHandlers',
        dependencies: ['overlayController'],
        description: 'Keyboard & mouse event handlers'
    },
    systemIntegration: {
        path: 'js/shadow/overlay/shadow-system-integration.js',
        status: 'complete',
        lines: 280,
        exports: 'window.ShadowSystemIntegration',
        dependencies: ['stateManager', 'overlayController'],
        description: 'External hooks & panel integration'
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
        CardTemplates: window.ShadowCardTemplates,  // NEW v2.0
        CardRenderer: window.ShadowCardRenderer,
        SourceToggle: window.ShadowSourceToggle,
        OverlayController: window.ShadowOverlayController,
        EventHandlers: window.ShadowEventHandlers,
        SystemIntegration: window.ShadowSystemIntegration
    };

    // Calculate total lines
    const totalLines = Object.values(SHADOW_OVERLAY_MODULES)
        .reduce((sum, m) => sum + (m.lines || 0), 0);

    console.log('[ShadowOverlay/index] ✅ All 7 modules complete (v2.0)');
    console.log(`[ShadowOverlay/index] Total extraction: ${totalLines} lines`);
    console.log('[ShadowOverlay/index] Location: js/shadow/overlay/');
}
