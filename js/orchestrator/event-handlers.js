/* ============================================================================
 * ORCHESTRATOR EVENT HANDLERS
 * ============================================================================
 *
 * Purpose:     Centralized event delegation for demo-orchestrator.html
 * Parent:      demo-orchestrator.html
 * Depends:     Window globals from orchestrator-logic.js, orchestrator-utils.js
 *
 * Architecture:
 *   This module implements event delegation pattern, replacing 33 inline
 *   onclick handlers with a single document-level listener. This improves:
 *   - Maintainability: All handlers in one searchable location
 *   - Performance: Single listener vs 33 individual handlers
 *   - Testability: Handler functions can be unit tested
 *   - Separation: HTML contains no JavaScript
 *
 * Data Attributes:
 *   data-action="action-name"  → Maps to handler function
 *   data-step="0-4"            → Step number for navigation
 *   data-company="id"          → Company template ID
 *   data-template="id"         → Face template ID
 *   data-mode="quick|full"     → Analysis mode
 *   data-view="id"             → Explore view ID
 *
 * Action Registry (33 actions):
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │ Navigation (6)                                                       │
 *   │   go-to-step         → goToStep(step)                               │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │ Journey Selection (6)                                               │
 *   │   select-company     → selectCompanyTemplate(company)               │
 *   │   start-fresh-manual → startFreshManual()                           │
 *   │   start-fresh-ai     → startFreshAI()                               │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │ Template Selection (6)                                              │
 *   │   select-template    → selectTemplate(template)                     │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │ Mode Selection (2)                                                  │
 *   │   select-mode        → selectMode(mode)                             │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │ Step Actions (4)                                                    │
 *   │   analyze-story      → analyzeStory()                               │
 *   │   complete-step-1    → completeStep1()                              │
 *   │   complete-step-2    → completeStep2()                              │
 *   │   complete-step-3    → completeStep3()                              │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │ Explore Views (5)                                                   │
 *   │   launch-view        → launchView(view)                             │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │ Final Actions (4)                                                   │
 *   │   export-report      → exportReport()                               │
 *   │   save-configuration → saveConfiguration()                          │
 *   │   start-over         → startOver()                                  │
 *   │   show-help          → showHelp()                                   │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 * Usage in HTML:
 *   BEFORE: <button onclick="goToStep(2)">Step 2</button>
 *   AFTER:  <button data-action="go-to-step" data-step="2">Step 2</button>
 *
 * @version Phase 4 - HTML Cleanup
 * @created 2025-01 (modularization refactor)
 * ============================================================================
 */


// ============================================================================
// ACTION HANDLERS
// ============================================================================

/**
 * Action handler registry
 * Maps data-action values to their handler functions
 *
 * Each handler receives the clicked element and extracts any needed
 * data attributes to pass to the underlying global function.
 */
const ACTION_HANDLERS = {
    // ─────────────────────────────────────────────────────────────────────
    // Navigation Actions
    // ─────────────────────────────────────────────────────────────────────

    'go-to-step': (element) => {
        const step = parseInt(element.dataset.step, 10);
        if (!isNaN(step) && typeof window.goToStep === 'function') {
            window.goToStep(step);
        }
    },

    // ─────────────────────────────────────────────────────────────────────
    // Journey Selection Actions (Step 0)
    // ─────────────────────────────────────────────────────────────────────

    'select-company': (element) => {
        const company = element.dataset.company;
        if (company && typeof window.selectCompanyTemplate === 'function') {
            window.selectCompanyTemplate(company);
        }
    },

    'start-fresh-manual': () => {
        if (typeof window.startFreshManual === 'function') {
            window.startFreshManual();
        }
    },

    'start-fresh-ai': () => {
        if (typeof window.startFreshAI === 'function') {
            window.startFreshAI();
        }
    },

    // ─────────────────────────────────────────────────────────────────────
    // Template Selection Actions (Step 1)
    // ─────────────────────────────────────────────────────────────────────

    'select-template': (element) => {
        const template = element.dataset.template;
        if (template && typeof window.selectTemplate === 'function') {
            window.selectTemplate(template);
        }
    },

    // ─────────────────────────────────────────────────────────────────────
    // Mode Selection Actions (Step 2)
    // ─────────────────────────────────────────────────────────────────────

    'select-mode': (element) => {
        const mode = element.dataset.mode;
        if (mode && typeof window.selectMode === 'function') {
            window.selectMode(mode);
        }
    },

    // ─────────────────────────────────────────────────────────────────────
    // Step Completion Actions
    // ─────────────────────────────────────────────────────────────────────

    'analyze-story': () => {
        if (typeof window.analyzeStory === 'function') {
            window.analyzeStory();
        }
    },

    'complete-step-1': () => {
        if (typeof window.completeStep1 === 'function') {
            window.completeStep1();
        }
    },

    'complete-step-2': () => {
        if (typeof window.completeStep2 === 'function') {
            window.completeStep2();
        }
    },

    'complete-step-3': () => {
        if (typeof window.completeStep3 === 'function') {
            window.completeStep3();
        }
    },

    // ─────────────────────────────────────────────────────────────────────
    // Explore View Actions (Step 4)
    // ─────────────────────────────────────────────────────────────────────

    'launch-view': (element) => {
        const view = element.dataset.view;
        if (view && typeof window.launchView === 'function') {
            window.launchView(view);
        }
    },

    // ─────────────────────────────────────────────────────────────────────
    // Final Actions (Step 4)
    // ─────────────────────────────────────────────────────────────────────

    'export-report': () => {
        if (typeof window.exportReport === 'function') {
            window.exportReport();
        }
    },

    'save-configuration': () => {
        if (typeof window.saveConfiguration === 'function') {
            window.saveConfiguration();
        }
    },

    'start-over': () => {
        if (typeof window.startOver === 'function') {
            window.startOver();
        }
    },

    'show-help': () => {
        if (typeof window.showHelp === 'function') {
            window.showHelp();
        }
    }
};


// ============================================================================
// EVENT DELEGATION
// ============================================================================

/**
 * Find the closest element with a data-action attribute
 * Traverses up the DOM tree from the click target
 *
 * @param {HTMLElement} target - The clicked element
 * @returns {HTMLElement|null} - Element with data-action or null
 */
function findActionElement(target) {
    return target.closest('[data-action]');
}


/**
 * Main click handler using event delegation
 *
 * @param {MouseEvent} event - The click event
 */
function handleClick(event) {
    const actionElement = findActionElement(event.target);

    if (!actionElement) {
        return; // No action element found, let event bubble normally
    }

    const action = actionElement.dataset.action;
    const handler = ACTION_HANDLERS[action];

    if (handler) {
        // Prevent default for buttons/links with actions
        if (actionElement.tagName === 'BUTTON' || actionElement.tagName === 'A') {
            event.preventDefault();
        }

        // Execute the handler
        handler(actionElement);
    } else {
        console.warn(`[event-handlers] Unknown action: "${action}"`);
    }
}


// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize event delegation system
 * Called automatically on DOMContentLoaded
 */
function initEventHandlers() {
    document.addEventListener('click', handleClick);
    console.log('✅ Event delegation system initialized (33 handlers)');
}


// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEventHandlers);
} else {
    // DOM already loaded
    initEventHandlers();
}


// ============================================================================
// EXPORTS (for testing and debugging)
// ============================================================================

export { ACTION_HANDLERS, handleClick, initEventHandlers };
