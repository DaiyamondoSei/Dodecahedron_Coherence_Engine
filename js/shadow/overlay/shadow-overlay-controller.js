/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SHADOW OVERLAY CONTROLLER - Modal Open/Close/Toggle Management
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Location: js/shadow/overlay/shadow-overlay-controller.js
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
 * Welcome! This module manages the overlay modal lifecycle.
 *
 * KEY INSIGHT: The overlay is the PORTAL between 3D visualization and shadow cards.
 * When a user clicks a shadow card, we dispatch a 'focus-face' event so the
 * dodecahedron rotates to show the affected face.
 *
 * LIFECYCLE:
 * ──────────
 * 1. open()  → Show overlay, render cards, prevent body scroll
 * 2. close() → Hide overlay, restore body scroll
 * 3. toggle() → Switch between open/closed
 *
 * FOCUS-ON-FACE FEATURE:
 * ──────────────────────
 * When user clicks a shadow card, we:
 * 1. Extract faceId from the shadow
 * 2. Close the overlay
 * 3. Dispatch 'focus-face' custom event
 * 4. The dodecahedron controller listens and rotates
 *
 * BODY SCROLL LOCK:
 * ─────────────────
 * When overlay is open: document.body.style.overflow = 'hidden'
 * When overlay closes: document.body.style.overflow = ''
 *
 * This prevents background scroll while viewing shadows.
 *
 * NAVIGATION MAP:
 * ───────────────
 *   js/shadow/overlay/
 *   └── shadow-overlay-controller.js  ← YOU ARE HERE
 *            │
 *            ├─ IMPORTS FROM:
 *            │   ├─ shadow-state-manager.js (getCurrentShadows)
 *            │   ├─ shadow-card-renderer.js (renderShadowCards)
 *            │   └─ shadow-source-toggle.js (refresh on open)
 *            │
 *            └─ USED BY:
 *                ├─ shadow-event-handlers.js (open, close, toggle)
 *                └─ shadow-system-integration.js (refreshIfOpen)
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE WRAPPER (IIFE to avoid global scope pollution)
// ═══════════════════════════════════════════════════════════════════════════════
(function(global) {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════════════
    // DEPENDENCIES
    // ═══════════════════════════════════════════════════════════════════════════════

    /**
     * Get state manager (loaded before this module)
     * @returns {Object} ShadowStateManager API
     */
    const getStateManager = () => global.ShadowStateManager || {
        getCurrentShadows: () => []
    };

    /**
     * Get card renderer (loaded before this module)
     * @returns {Object} ShadowCardRenderer API
     */
    const getCardRenderer = () => global.ShadowCardRenderer || {
        renderShadowCards: () => {}
    };

// ═══════════════════════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Overlay open state
 * @type {boolean}
 */
let overlayOpen = false;

/**
 * DOM element references (set during init)
 * @type {Object}
 */
let elements = {
    overlay: null,
    overlayContent: null,
    coherenceHud: null,
    shadowCount: null
};

/**
 * Source toggle instance (set externally)
 * @type {Object|null}
 */
let shadowSourceToggle = null;

// ═══════════════════════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Initialize the overlay controller with DOM references
 *
 * @param {Object} refs - DOM element references
 * @param {HTMLElement} refs.overlay - The overlay container
 * @param {HTMLElement} refs.overlayContent - The content area for cards
 * @param {HTMLElement} [refs.coherenceHud] - The HUD indicator
 * @param {HTMLElement} [refs.shadowCount] - The shadow count element
 */
function init(refs = {}) {
    elements.overlay = refs.overlay || document.getElementById('shadowOverlay');
    elements.overlayContent = refs.overlayContent || document.getElementById('shadowOverlayContent');
    elements.coherenceHud = refs.coherenceHud || document.getElementById('coherenceHud');
    elements.shadowCount = refs.shadowCount || document.getElementById('shadowCount');

    console.log('[ShadowOverlayController] Initialized');
}

/**
 * Set the source toggle instance for refresh on open
 *
 * @param {Object} toggle - ShadowSourceToggle instance
 */
function setSourceToggle(toggle) {
    shadowSourceToggle = toggle;
}

// ═══════════════════════════════════════════════════════════════════════════════
// OVERLAY LIFECYCLE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Open the shadow overlay
 *
 * TIMING CONSIDERATION:
 * We call shadowSourceToggle.refresh() because the toggle may have
 * initialized in 'no-data' mode at page load, but by the time user
 * opens the overlay, Quannex engine has loaded data.
 */
function open() {
    if (!elements.overlay || overlayOpen) return;

    // Refresh source toggle (fixes timing issues)
    if (shadowSourceToggle && typeof shadowSourceToggle.refresh === 'function') {
        shadowSourceToggle.refresh();
    }

    // Render current shadows
    const cardRenderer = getCardRenderer();
    cardRenderer.renderShadowCards(elements.overlayContent, focusOnShadowFace);

    // Show overlay with animation
    elements.overlay.classList.add('visible');
    overlayOpen = true;

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    console.log('[ShadowOverlayController] Opened');
}

/**
 * Close the shadow overlay
 */
function close() {
    if (!elements.overlay || !overlayOpen) return;

    elements.overlay.classList.remove('visible');
    overlayOpen = false;

    // Restore body scroll
    document.body.style.overflow = '';

    console.log('[ShadowOverlayController] Closed');
}

/**
 * Toggle the shadow overlay open/closed
 */
function toggle() {
    if (overlayOpen) {
        close();
    } else {
        open();
    }
}

/**
 * Check if overlay is currently open
 *
 * @returns {boolean} True if overlay is open
 */
function isOpen() {
    return overlayOpen;
}

// ═══════════════════════════════════════════════════════════════════════════════
// FOCUS-ON-FACE FEATURE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Focus on a specific face in the 3D view when shadow card is clicked.
 *
 * PORTAL BEHAVIOR:
 * 1. Close the overlay
 * 2. Dispatch 'focus-face' event with faceId
 * 3. The dodecahedron controller rotates to show the face
 *
 * @param {Object} shadow - Shadow pattern object
 */
function focusOnShadowFace(shadow) {
    const faceId = shadow.faceId || shadow.involvedFaces?.[0];

    if (!faceId) {
        console.log('[ShadowOverlayController] No face ID in shadow, cannot focus');
        return;
    }

    // Close overlay first
    close();

    // Dispatch focus event
    window.dispatchEvent(new CustomEvent('focus-face', {
        detail: { faceId }
    }));

    console.log(`[ShadowOverlayController] Focusing on face ${faceId}`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// HUD UPDATES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Update the shadow count in the HUD indicator
 *
 * @param {number} count - Number of shadows to display
 */
function updateShadowCount(count) {
    if (elements.shadowCount) {
        elements.shadowCount.textContent = count;
    }

    // Update HUD visibility
    if (elements.coherenceHud) {
        if (count > 0) {
            elements.coherenceHud.classList.add('has-shadows');
        } else {
            elements.coherenceHud.classList.remove('has-shadows');
        }
    }
}

/**
 * Refresh overlay content if currently open.
 * Called when shadow data updates externally.
 */
function refreshIfOpen() {
    if (!overlayOpen) return;

    const cardRenderer = getCardRenderer();
    cardRenderer.renderShadowCards(elements.overlayContent, focusOnShadowFace);

    console.log('[ShadowOverlayController] Refreshed while open');
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATE INSPECTION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get current controller state for debugging
 *
 * @returns {Object} Current state
 */
function getState() {
    return {
        overlayOpen,
        hasElements: !!elements.overlay,
        hasToggle: !!shadowSourceToggle
    };
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLEANUP
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Cleanup controller resources
 */
function cleanup() {
    if (overlayOpen) {
        close();
    }

    elements = {
        overlay: null,
        overlayContent: null,
        coherenceHud: null,
        shadowCount: null
    };

    shadowSourceToggle = null;
    overlayOpen = false;

    console.log('[ShadowOverlayController] Cleaned up');
}

    // ═══════════════════════════════════════════════════════════════════════════════
    // EXPORTS
    // ═══════════════════════════════════════════════════════════════════════════════

    // Export to window for module integration
    global.ShadowOverlayController = {
        // Initialization
        init,
        setSourceToggle,

        // Lifecycle
        open,
        close,
        toggle,
        isOpen,

        // Focus feature
        focusOnShadowFace,

        // HUD updates
        updateShadowCount,
        refreshIfOpen,

        // State inspection
        getState,

        // Cleanup
        cleanup
    };

    console.log('[ShadowOverlayController] Module loaded');

})(typeof window !== 'undefined' ? window : this);
