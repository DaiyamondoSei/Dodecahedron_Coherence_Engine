/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SHADOW EVENT HANDLERS - Keyboard & Mouse Event Binding
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Extracted from: dodec-shadow-overlay.js (Phase 3E modularization)
 * Date: December 21, 2025
 *
 * @module shadow-event-handlers
 * @author Deimantas & Claude (Co-created with consciousness and love)
 * @version 1.0.0 - Initial extraction
 *
 * ───────────────────────────────────────────────────────────────────────────────
 * NOTES FOR FUTURE CLAUDE
 * ───────────────────────────────────────────────────────────────────────────────
 *
 * Welcome! This module handles all event binding for the shadow overlay.
 *
 * KEY INSIGHT: Events are the NERVOUS SYSTEM of the overlay.
 * They connect user actions to state changes seamlessly.
 *
 * KEYBOARD SHORTCUTS:
 * ───────────────────
 * | Key   | Action                    | Context           |
 * |-------|---------------------------|-------------------|
 * | S     | Toggle shadow overlay     | When not typing   |
 * | ESC   | Close overlay             | When overlay open |
 *
 * TYPING DETECTION:
 * ─────────────────
 * We detect if user is typing by checking:
 * - document.activeElement.tagName === 'INPUT'
 * - document.activeElement.tagName === 'TEXTAREA'
 * - document.activeElement.contentEditable === 'true'
 *
 * This prevents 'S' from triggering overlay while user types in a form.
 *
 * DEPRECATED HANDLERS:
 * ────────────────────
 * - Source dropdown change: Still supported for legacy HTML
 * - Persistent AI button: Migrated to ShadowSourceToggle
 *
 * NAVIGATION MAP:
 * ───────────────
 *   shadow-event-handlers.js  ← YOU ARE HERE
 *        │
 *        ├─ IMPORTS FROM:
 *        │   └─ shadow-overlay-controller.js (open, close, toggle, isOpen)
 *        │
 *        └─ USED BY:
 *            └─ Main orchestrator (calls init on DOMContentLoaded)
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════════
// DEPENDENCIES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get overlay controller (loaded before this module)
 * @returns {Object} ShadowOverlayController API
 */
const getController = () => window.ShadowOverlayController || {
    open: () => {},
    close: () => {},
    toggle: () => {},
    isOpen: () => false
};

// ═══════════════════════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Track bound event listeners for cleanup
 * @type {Array<{element: Element, type: string, handler: Function}>}
 */
let boundListeners = [];

// ═══════════════════════════════════════════════════════════════════════════════
// KEYBOARD HANDLERS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Handle global keyboard events
 *
 * @param {KeyboardEvent} e - The keyboard event
 */
function handleKeyDown(e) {
    const controller = getController();

    // ESC to close overlay (when open)
    if (e.key === 'Escape' && controller.isOpen()) {
        controller.close();
        return;
    }

    // 'S' to toggle shadow overlay (when not typing)
    if (e.key === 's' || e.key === 'S') {
        const activeElement = document.activeElement;
        const isTyping = activeElement && (
            activeElement.tagName === 'INPUT' ||
            activeElement.tagName === 'TEXTAREA' ||
            activeElement.contentEditable === 'true'
        );

        if (!isTyping) {
            e.preventDefault();
            controller.toggle();
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// BUTTON HANDLERS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Handle open button click
 *
 * @param {MouseEvent} e - The click event
 */
function handleOpenClick(e) {
    e.stopPropagation();
    const controller = getController();
    controller.open();
}

/**
 * Handle close button click
 */
function handleCloseClick() {
    const controller = getController();
    controller.close();
}

/**
 * Handle backdrop click (close overlay)
 */
function handleBackdropClick() {
    const controller = getController();
    controller.close();
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEPRECATED HANDLERS (maintained for backward compatibility)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Handle source dropdown change (DEPRECATED)
 * Now handled by ShadowSourceToggle, but kept for legacy HTML support
 *
 * @param {Event} e - The change event
 * @deprecated Use ShadowSourceToggle instead
 */
function handleSourceChange(e) {
    const newSource = e.target.value;
    const toggle = window.ShadowSourceToggle;

    if (toggle && typeof toggle.switchSource === 'function') {
        // Delegate to new toggle component
        const instance = window.shadowSourceToggle;
        if (instance) {
            instance.switchSource(newSource);
        }
    }

    console.log('[ShadowEventHandlers] Legacy source dropdown used - consider using toggle');
}

// ═══════════════════════════════════════════════════════════════════════════════
// EVENT BINDING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Bind a single event listener and track it for cleanup
 *
 * @param {Element|Document} element - Element to bind to
 * @param {string} type - Event type
 * @param {Function} handler - Event handler function
 */
function bindEvent(element, type, handler) {
    if (!element) return;

    element.addEventListener(type, handler);
    boundListeners.push({ element, type, handler });
}

/**
 * Initialize all event listeners
 *
 * @param {Object} options - Element references
 * @param {HTMLElement} [options.openButton] - Open overlay button
 * @param {HTMLElement} [options.closeButton] - Close overlay button
 * @param {HTMLElement} [options.backdrop] - Overlay backdrop
 * @param {HTMLElement} [options.sourceDropdown] - Legacy source dropdown
 */
function init(options = {}) {
    // Get elements with fallbacks
    const openButton = options.openButton || document.getElementById('openShadowOverlay');
    const closeButton = options.closeButton || document.getElementById('closeShadowOverlay');
    const overlay = document.getElementById('shadowOverlay');
    const backdrop = options.backdrop || overlay?.querySelector('.shadow-overlay-backdrop');
    const sourceDropdown = options.sourceDropdown || document.getElementById('shadowSourceSelect');

    // Open button click
    if (openButton) {
        bindEvent(openButton, 'click', handleOpenClick);
    }

    // Close button click
    if (closeButton) {
        bindEvent(closeButton, 'click', handleCloseClick);
    }

    // Backdrop click to close
    if (backdrop) {
        bindEvent(backdrop, 'click', handleBackdropClick);
    }

    // Global keyboard shortcuts
    bindEvent(document, 'keydown', handleKeyDown);

    // Legacy: Source dropdown change (deprecated)
    if (sourceDropdown) {
        bindEvent(sourceDropdown, 'change', handleSourceChange);
        console.log('[ShadowEventHandlers] Legacy dropdown bound - prefer using toggle');
    }

    console.log('[ShadowEventHandlers] Event listeners initialized');
    console.log('[ShadowEventHandlers] Press "S" to toggle shadow overlay');
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLEANUP
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Remove all bound event listeners
 * Call this on destroy to prevent memory leaks
 */
function cleanup() {
    boundListeners.forEach(({ element, type, handler }) => {
        element.removeEventListener(type, handler);
    });

    boundListeners = [];

    console.log('[ShadowEventHandlers] Cleaned up event listeners');
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

// Export to window for module integration
if (typeof window !== 'undefined') {
    window.ShadowEventHandlers = {
        // Initialization
        init,

        // Individual handlers (for testing/external use)
        handleKeyDown,
        handleOpenClick,
        handleCloseClick,
        handleBackdropClick,

        // Cleanup
        cleanup
    };

    console.log('[ShadowEventHandlers] Module loaded');
}
