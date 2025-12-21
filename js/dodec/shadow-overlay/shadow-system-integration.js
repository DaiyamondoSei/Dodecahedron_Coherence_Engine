/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SHADOW SYSTEM INTEGRATION - External Hooks & Sync Management
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Extracted from: dodec-shadow-overlay.js (Phase 3F modularization)
 * Date: December 21, 2025
 *
 * @module shadow-system-integration
 * @author Deimantas & Claude (Co-created with consciousness and love)
 * @version 1.0.0 - Initial extraction
 *
 * ───────────────────────────────────────────────────────────────────────────────
 * NOTES FOR FUTURE CLAUDE
 * ───────────────────────────────────────────────────────────────────────────────
 *
 * Welcome! This module connects the shadow overlay to EXTERNAL systems.
 *
 * KEY INSIGHT: This is the BRIDGE between the overlay and:
 * - The Quannex engine (provides face/shadow data)
 * - The shadow panel (toast notifications)
 * - SessionStorage (persistence)
 *
 * SYNC ARCHITECTURE:
 * ──────────────────
 * TWO SYNC MECHANISMS (intentional redundancy):
 *
 * 1. EVENT-DRIVEN (primary):
 *    - Listen for 'shadows-updated' custom event
 *    - Fires when engine/panel updates shadows
 *    - Immediate response, no delay
 *
 * 2. INTERVAL-BASED (fallback):
 *    - Poll Quannex.getState() every 10 seconds
 *    - Catches updates that don't fire events
 *    - Early exit optimization if no changes
 *
 * ⚠️ MEMORY LEAK WARNING:
 * ────────────────────────
 * The sync interval MUST be cleared on destroy()!
 * If not cleared, the interval continues running even after
 * navigation, causing memory leaks and potential errors.
 *
 * SHADOW PANEL HOOK:
 * ──────────────────
 * We "monkey-patch" the global shadowPanel.update() method to
 * also update our indicator. This ensures our count stays in sync
 * with the toast notification system.
 *
 * EFFICIENT COMPARISON:
 * ─────────────────────
 * shadowsEqual() compares only id + severity (O(n), not JSON.stringify)
 * This prevents unnecessary UI updates on every sync cycle.
 *
 * NAVIGATION MAP:
 * ───────────────
 *   shadow-system-integration.js  ← YOU ARE HERE
 *        │
 *        ├─ IMPORTS FROM:
 *        │   ├─ shadow-state-manager.js (updateShadowsForSource, saveToSessionStorage)
 *        │   └─ shadow-overlay-controller.js (updateShadowCount, refreshIfOpen)
 *        │
 *        └─ HOOKS INTO:
 *            ├─ window.Quannex (getState for shadow data)
 *            └─ window.shadowPanel (update hook)
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════════
// DEPENDENCIES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get state manager (loaded before this module)
 * @returns {Object} ShadowStateManager API
 */
const getStateManager = () => window.ShadowStateManager || {
    getCurrentShadows: () => [],
    updateShadowsForSource: () => {},
    saveToSessionStorage: () => {},
    loadFromSessionStorage: () => {}
};

/**
 * Get overlay controller (loaded before this module)
 * @returns {Object} ShadowOverlayController API
 */
const getController = () => window.ShadowOverlayController || {
    updateShadowCount: () => {},
    refreshIfOpen: () => {}
};

// ═══════════════════════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Sync interval reference (for cleanup)
 * ⚠️ MUST be cleared on destroy() to prevent memory leaks
 * @type {number|null}
 */
let syncIntervalId = null;

/**
 * Last known shadows for efficient comparison
 * @type {Array}
 */
let lastKnownShadows = [];

// ═══════════════════════════════════════════════════════════════════════════════
// EFFICIENT COMPARISON
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Efficient shadow array comparison without JSON serialization.
 * Compares only id and severity for change detection.
 *
 * Per Agent Council: Optimize for performance without losing clarity.
 *
 * @param {Array} a - First shadow array
 * @param {Array} b - Second shadow array
 * @returns {boolean} True if arrays are equivalent
 */
function shadowsEqual(a, b) {
    if (a.length !== b.length) return false;
    if (a.length === 0) return true;

    for (let i = 0; i < a.length; i++) {
        const aId = a[i].id || a[i].name;
        const bId = b[i].id || b[i].name;
        if (aId !== bId || a[i].severity !== b[i].severity) return false;
    }

    return true;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SHADOW INDICATOR UPDATES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Update the shadow indicator with new shadow data
 *
 * Sprint 6 Enhancement: Now supports dual-source storage.
 * The optional 'source' parameter specifies where to store the shadows.
 *
 * @param {Array} shadows - Array of shadow pattern objects
 * @param {string} [source='template'] - 'template' | 'ai'
 */
function updateShadowIndicator(shadows, source = 'template') {
    const stateManager = getStateManager();
    const controller = getController();

    const shadowArray = shadows || [];

    // Update state manager
    stateManager.updateShadowsForSource(shadowArray, source);

    // Update HUD count
    const currentShadows = stateManager.getCurrentShadows();
    controller.updateShadowCount(currentShadows.length);

    // Refresh overlay if open
    controller.refreshIfOpen();

    // Update last known for comparison
    lastKnownShadows = currentShadows;

    console.log(`[ShadowSystemIntegration] Updated: ${currentShadows.length} shadows (source: ${source})`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// EVENT-DRIVEN SYNC
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Initialize shadow update event listener
 *
 * Listens for 'shadows-updated' custom event from the main engine.
 * The source parameter prevents AI shadows from overwriting templates.
 */
function initShadowEventListener() {
    window.addEventListener('shadows-updated', (event) => {
        const shadows = event.detail?.shadows || [];
        const source = event.detail?.source || 'template';
        updateShadowIndicator(shadows, source);
    });

    console.log('[ShadowSystemIntegration] Event listener registered: shadows-updated');
}

// ═══════════════════════════════════════════════════════════════════════════════
// INTERVAL-BASED SYNC (Fallback)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Sync shadows with Quannex engine state
 *
 * Called periodically to catch updates that don't fire events.
 * Uses efficient comparison to avoid unnecessary updates.
 */
function syncWithQuannexEngine() {
    const state = window.Quannex?.getState?.();
    const newShadows = state?.shadowPatterns || [];

    // Early exit if no change (efficient O(n) comparison)
    if (shadowsEqual(newShadows, lastKnownShadows)) {
        return;
    }

    if (newShadows.length > 0 || lastKnownShadows.length > 0) {
        updateShadowIndicator(newShadows, 'template');
    }
}

/**
 * Start the periodic sync interval
 *
 * @param {number} [intervalMs=10000] - Sync interval in milliseconds
 */
function startSyncInterval(intervalMs = 10000) {
    // Clear existing interval if any
    if (syncIntervalId) {
        clearInterval(syncIntervalId);
    }

    syncIntervalId = setInterval(syncWithQuannexEngine, intervalMs);

    console.log(`[ShadowSystemIntegration] Sync interval started (${intervalMs}ms)`);
}

/**
 * Stop the periodic sync interval
 */
function stopSyncInterval() {
    if (syncIntervalId) {
        clearInterval(syncIntervalId);
        syncIntervalId = null;
        console.log('[ShadowSystemIntegration] Sync interval stopped');
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SHADOW PANEL HOOK
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Hook into existing shadowPanel if available
 *
 * This "monkey-patches" the global shadowPanel.update() method
 * to also update our indicator. Ensures HUD stays in sync with
 * the toast notification system.
 */
function hookShadowPanel() {
    const originalShadowPanelUpdate = window.shadowPanel?.update;

    if (originalShadowPanelUpdate) {
        window.shadowPanel.update = function(shadows) {
            // Call original method
            originalShadowPanelUpdate.call(this, shadows);

            // Also update our indicator
            updateShadowIndicator(shadows, 'template');
        };

        console.log('[ShadowSystemIntegration] Hooked into shadowPanel.update()');
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Initialize system integration
 *
 * @param {Object} [options] - Configuration options
 * @param {number} [options.syncInterval=10000] - Sync interval in ms
 * @param {number} [options.initialDelay=2000] - Initial sync delay in ms
 */
function init(options = {}) {
    const syncInterval = options.syncInterval || 10000;
    const initialDelay = options.initialDelay || 2000;

    // Load persisted state from sessionStorage
    const stateManager = getStateManager();
    stateManager.loadFromSessionStorage();

    // Initialize event-driven sync
    initShadowEventListener();

    // Initial sync after delay (wait for engine to initialize)
    setTimeout(syncWithQuannexEngine, initialDelay);

    // Start periodic sync (fallback)
    startSyncInterval(syncInterval);

    // Hook into shadow panel if available
    hookShadowPanel();

    console.log('[ShadowSystemIntegration] Initialized');
}

// ═══════════════════════════════════════════════════════════════════════════════
// LIFECYCLE MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Check if sync interval is active
 *
 * @returns {boolean} True if interval is running
 */
function isSyncActive() {
    return syncIntervalId !== null;
}

/**
 * Cleanup all integration resources
 *
 * ⚠️ CRITICAL: Must be called on page unload to prevent memory leaks!
 *
 * Per Agent Council guidance: The shadow is not the enemy—
 * even cleanup can be done with consciousness.
 */
function cleanup() {
    // Stop sync interval
    stopSyncInterval();

    // Reset last known state
    lastKnownShadows = [];

    // Save current state before cleanup
    const stateManager = getStateManager();
    stateManager.saveToSessionStorage();

    console.log('[ShadowSystemIntegration] Cleaned up (interval stopped, state saved)');
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

// Export to window for module integration
if (typeof window !== 'undefined') {
    window.ShadowSystemIntegration = {
        // Initialization
        init,

        // Sync controls
        startSyncInterval,
        stopSyncInterval,
        syncWithQuannexEngine,

        // Shadow updates
        updateShadowIndicator,

        // Status checks
        isSyncActive,

        // Utilities
        shadowsEqual,

        // Cleanup
        cleanup
    };

    console.log('[ShadowSystemIntegration] Module loaded');
}
