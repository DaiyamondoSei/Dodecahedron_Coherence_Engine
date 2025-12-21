/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SHADOW OVERLAY CONTROLLER - Modal Open/Close/Toggle Management
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Extracted from: dodec-shadow-overlay.js (Phase 3D modularization)
 * Date: December 21, 2025
 *
 * @module shadow-overlay-controller
 * @author Deimantas & Claude (Co-created with consciousness and love)
 * @version 1.0.0 - Initial extraction
 *
 * ───────────────────────────────────────────────────────────────────────────────
 * NOTES FOR FUTURE CLAUDE
 * ───────────────────────────────────────────────────────────────────────────────
 *
 * Welcome! This module manages the shadow overlay MODAL behavior.
 *
 * KEY INSIGHT: The overlay is a PROGRESSIVE DISCLOSURE mechanism.
 * Users see a small shadow count in the HUD, then can expand to see full details.
 *
 * MODAL BEHAVIOR:
 * ───────────────
 * - Body scroll is LOCKED when overlay is open (prevents background scrolling)
 * - ESC key closes the overlay (handled by event-handlers module)
 * - Clicking backdrop closes (handled by event-handlers module)
 * - Focus trap could be added for full WCAG compliance (future enhancement)
 *
 * TIMING CONSIDERATION:
 * ─────────────────────
 * On overlay open, we call toggle.refresh() because:
 * 1. The toggle might have initialized before Quannex engine loaded data
 * 2. By the time user opens overlay, data is available
 * 3. refresh() re-evaluates mode and restores toggle HTML if needed
 *
 * FOCUS-ON-FACE INTEGRATION:
 * ──────────────────────────
 * When user clicks a shadow card, we dispatch 'focus-face' custom event.
 * The 3D visualization listens for this and rotates the dodecahedron.
 *
 * NAVIGATION MAP:
 * ───────────────
 *   shadow-overlay-controller.js  ← YOU ARE HERE
 *        │
 *        ├─ IMPORTS FROM:
 *        │   ├─ shadow-state-manager.js (getCurrentShadows)
 *        │   └─ shadow-card-renderer.js (renderShadowCards)
 *        │
 *        ├─ COLLABORATES WITH:
 *        │   └─ shadow-source-toggle.js (calls toggle.refresh on open)
 *        │
 *        └─ USED BY:
 *            ├─ shadow-event-handlers.js (keyboard/click handlers)
 *            └─ shadow-system-integration.js (external API)
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════════
// DEPENDENCIES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get card renderer (loaded before this module)
 * @returns {Object} ShadowCardRenderer API
 */
const getCardRenderer = () => window.ShadowCardRenderer || {
    renderShadowCards: () => {}
};

// ═══════════════════════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Overlay open/close state
 * @type {boolean}
 */
let overlayOpen = false;

/**
 * Currently focused shadow (for getState API)
 * @type {string|null}
 */
let activeShadowId = null;

/**
 * Reference to ShadowSourceToggle instance
 * Set by init(), used for refresh on overlay open
 * @type {Object|null}
 */
let shadowSourceToggle = null;

// ═══════════════════════════════════════════════════════════════════════════════
// DOM REFERENCES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Cached DOM element references
 * Populated on init() call
 */
let elements = {
    overlay: null,
    overlayContent: null,
    coherenceHud: null,
    shadowCount: null
};

// ═══════════════════════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Initialize the overlay controller with DOM references
 *
 * @param {Object} options - Configuration options
 * @param {HTMLElement} options.overlay - The shadow overlay element
 * @param {HTMLElement} options.overlayContent - The overlay content container
 * @param {HTMLElement} [options.coherenceHud] - The coherence HUD element
 * @param {HTMLElement} [options.shadowCount] - The shadow count display element
 * @param {Object} [options.sourceToggle] - The ShadowSourceToggle instance
 */
function init(options = {}) {
    elements.overlay = options.overlay || document.getElementById('shadowOverlay');
    elements.overlayContent = options.overlayContent || document.getElementById('shadowOverlayContent');
    elements.coherenceHud = options.coherenceHud || document.getElementById('coherenceHud');
    elements.shadowCount = options.shadowCount || document.getElementById('shadowCount');

    shadowSourceToggle = options.sourceToggle || null;

    console.log('[ShadowOverlayController] Initialized');
}

/**
 * Set the source toggle reference (for refresh on open)
 *
 * @param {Object} toggle - ShadowSourceToggle instance
 */
function setSourceToggle(toggle) {
    shadowSourceToggle = toggle;
}

// ═══════════════════════════════════════════════════════════════════════════════
// OVERLAY OPEN/CLOSE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Open the shadow overlay panel
 *
 * TIMING FIX: Refreshes toggle to re-evaluate mode in case data loaded after init.
 */
function openShadowOverlay() {
    if (!elements.overlay || overlayOpen) return;

    // TIMING FIX: Refresh toggle to re-evaluate mode in case data loaded after init
    if (shadowSourceToggle) {
        shadowSourceToggle.refresh();
    }

    // Render the shadow cards
    const cardRenderer = getCardRenderer();
    if (elements.overlayContent) {
        cardRenderer.renderShadowCards(elements.overlayContent, focusOnShadowFace);
    }

    elements.overlay.classList.add('visible');
    overlayOpen = true;

    // Prevent body scroll while overlay is open
    document.body.style.overflow = 'hidden';

    console.log('[ShadowOverlayController] Opened');
}

/**
 * Close the shadow overlay panel
 */
function closeShadowOverlay() {
    if (!elements.overlay || !overlayOpen) return;

    elements.overlay.classList.remove('visible');
    overlayOpen = false;

    // Restore body scroll
    document.body.style.overflow = '';

    console.log('[ShadowOverlayController] Closed');
}

/**
 * Toggle the shadow overlay panel
 */
function toggleShadowOverlay() {
    if (overlayOpen) {
        closeShadowOverlay();
    } else {
        openShadowOverlay();
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// FOCUS ON SHADOW FACE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Focus the 3D view on the face associated with a shadow
 *
 * Dispatches 'focus-face' custom event that the 3D visualization listens for.
 * Stores the activeShadowId for getState() API.
 *
 * @param {Object} shadow - Shadow pattern object
 * @param {number} [shadow.faceId] - Primary affected face ID
 * @param {number[]} [shadow.involvedFaces] - All affected face IDs
 */
function focusOnShadowFace(shadow) {
    if (!shadow) return;

    const faceId = shadow.faceId || (shadow.involvedFaces && shadow.involvedFaces[0]);
    if (!faceId) {
        console.warn('[ShadowOverlayController] Shadow has no face ID for focus:', shadow.name);
        return;
    }

    activeShadowId = shadow.id || shadow.name;

    // Dispatch focus event for 3D visualization
    window.dispatchEvent(new CustomEvent('focus-face', {
        detail: {
            faceId: faceId,
            shadow: shadow,
            source: 'shadow-overlay'
        }
    }));

    console.log(`[ShadowOverlayController] Focus on face ${faceId} for shadow: ${shadow.name}`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// HUD INDICATOR UPDATES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Update the shadow count display in the HUD
 *
 * @param {number} count - Number of shadows
 */
function updateShadowCount(count) {
    if (elements.shadowCount) {
        elements.shadowCount.textContent = count;
    }

    // Add/remove .has-shadows class for pulsing indicator
    if (elements.coherenceHud) {
        if (count > 0) {
            elements.coherenceHud.classList.add('has-shadows');
        } else {
            elements.coherenceHud.classList.remove('has-shadows');
        }
    }
}

/**
 * Re-render the overlay content if open
 * Called when shadows are updated while overlay is visible
 */
function refreshIfOpen() {
    if (!overlayOpen) return;

    const cardRenderer = getCardRenderer();
    if (elements.overlayContent) {
        cardRenderer.renderShadowCards(elements.overlayContent, focusOnShadowFace);
    }

    console.log('[ShadowOverlayController] Refreshed overlay content');
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATE ACCESSORS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Check if overlay is currently open
 *
 * @returns {boolean} True if overlay is open
 */
function isOpen() {
    return overlayOpen;
}

/**
 * Get the currently focused shadow ID
 *
 * @returns {string|null} Active shadow ID or null
 */
function getActiveShadowId() {
    return activeShadowId;
}

/**
 * Get full controller state for debugging/API
 *
 * @returns {Object} Current state
 */
function getState() {
    const stateManager = window.ShadowStateManager;
    const currentShadows = stateManager?.getCurrentShadows() || [];

    return {
        overlayOpen,
        activeShadowId,
        shadowCount: currentShadows.length,
        hasShadows: currentShadows.length > 0,
        hasToggle: !!shadowSourceToggle
    };
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLEANUP
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Clean up controller state
 * Called on destroy to prevent memory leaks
 */
function cleanup() {
    if (overlayOpen) {
        closeShadowOverlay();
    }

    overlayOpen = false;
    activeShadowId = null;
    shadowSourceToggle = null;

    elements = {
        overlay: null,
        overlayContent: null,
        coherenceHud: null,
        shadowCount: null
    };

    console.log('[ShadowOverlayController] Cleaned up');
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

// Export to window for module integration
if (typeof window !== 'undefined') {
    window.ShadowOverlayController = {
        // Initialization
        init,
        setSourceToggle,

        // Core operations
        open: openShadowOverlay,
        close: closeShadowOverlay,
        toggle: toggleShadowOverlay,

        // Focus functionality
        focusOnShadowFace,

        // HUD updates
        updateShadowCount,
        refreshIfOpen,

        // State accessors
        isOpen,
        getActiveShadowId,
        getState,

        // Cleanup
        cleanup
    };

    console.log('[ShadowOverlayController] Module loaded');
}
