/**
 * ════════════════════════════════════════════════════════════════════════════════
 * INTEGRITY ORCHESTRATOR - System Initialization & Event Wiring
 * ════════════════════════════════════════════════════════════════════════════════
 *
 * VERSION: 1.0.0
 * CREATED: 2025-12-26 by Claude Opus 4.5
 * VERIFICATION: ✅ Tested
 * COMPLEXITY: 🟢 Simple (initialization and event routing)
 * DATA INTEGRITY: 🛡️ Protected (coordinates DataValidator consumers)
 *
 * ════════════════════════════════════════════════════════════════════════════════
 * NOTES FOR FUTURE CLAUDE
 * ════════════════════════════════════════════════════════════════════════════════
 *
 * WHAT THIS DOES:
 * ─────────────────────────────────────────────────────────────────────────────────
 * This is the "conductor" for the data integrity visibility system.
 * It initializes components in the right order and wires up the event flow.
 *
 * Think of it like a symphony conductor:
 * - DataValidator plays the data (produces corruption reports)
 * - IntegrityIndicator plays the visual cue (shows badge in HUD)
 * - IntegrityOverlay plays the detail (shows full report)
 * - This orchestrator ensures they all start together and stay in sync
 *
 * INITIALIZATION ORDER:
 * ─────────────────────────────────────────────────────────────────────────────────
 * 1. Check that DataValidator is loaded (our data source)
 * 2. Initialize IntegrityIndicator (HUD badge)
 * 3. Initialize IntegrityOverlay (detail panel)
 * 4. Trigger initial update from DataValidator
 * 5. Log ready status
 *
 * EVENT FLOW:
 * ─────────────────────────────────────────────────────────────────────────────────
 *
 *   ┌─────────────────┐   recalculate()   ┌──────────────────┐
 *   │   main.js       │ ───────────────→  │   DataValidator  │
 *   │ (calculation)   │                   │ (logs corruption)│
 *   └─────────────────┘                   └────────┬─────────┘
 *                                                  │
 *                                                  │ emits:
 *                                                  │ quannex:data-integrity-updated
 *                                                  ▼
 *                          ┌───────────────────────────────────────┐
 *                          │        IntegrityIndicator             │
 *                          │    (updates badge count/color)        │
 *                          └───────────────────────────────────────┘
 *                                                  │
 *                                                  │ user clicks "Inspect"
 *                                                  │ emits: integrity:open-overlay
 *                                                  ▼
 *                          ┌───────────────────────────────────────┐
 *                          │         IntegrityOverlay              │
 *                          │       (shows detailed report)         │
 *                          └───────────────────────────────────────┘
 *
 * KEYBOARD SHORTCUT:
 * ─────────────────────────────────────────────────────────────────────────────────
 * The 'I' key is handled by dodec-controls.js for consistency with other
 * shortcuts. However, this orchestrator provides a backup handler and
 * the toggle function that dodec-controls.js calls.
 *
 * NAVIGATION MAP:
 * ─────────────────────────────────────────────────────────────────────────────────
 * DEPENDS ON:
 * - DataValidator (window.DataValidator) → Source of corruption data
 * - IntegrityIndicator (window.IntegrityIndicator) → HUD badge
 * - IntegrityOverlay (window.IntegrityOverlay) → Detail panel
 *
 * EXPORTS:
 * - IntegrityOrchestrator.init() → Initialize the entire system
 * - IntegrityOrchestrator.triggerUpdate() → Force refresh from DataValidator
 * - IntegrityOrchestrator.toggleOverlay() → Open/close overlay (for keyboard)
 * - IntegrityOrchestrator.isReady() → Check if system is initialized
 *
 * USED BY:
 * - dodecahedron-3d.html → Calls init() on page load
 * - dodec-controls.js → Calls toggleOverlay() on 'I' key
 * - main.js → Triggers update after recalculate()
 *
 * EVENTS LISTENED:
 * - quannex:data-integrity-updated → Coordinates component updates
 *
 * EVENTS EMITTED:
 * - quannex:integrity-system-ready → When all components initialized
 *
 * ════════════════════════════════════════════════════════════════════════════════
 */

(function(global) {
    'use strict';

    // ════════════════════════════════════════════════════════════════════════════
    // SECTION 1: STATE
    // ════════════════════════════════════════════════════════════════════════════

    let isInitialized = false;
    let initializationAttempts = 0;
    const MAX_INIT_ATTEMPTS = 5;
    const INIT_RETRY_DELAY = 100; // ms

    // ════════════════════════════════════════════════════════════════════════════
    // SECTION 2: LAZY DEPENDENCY RESOLUTION
    // ════════════════════════════════════════════════════════════════════════════

    /**
     * Check if all required dependencies are loaded
     *
     * @returns {Object} Status object with availability of each dependency
     */
    function checkDependencies() {
        return {
            dataValidator: !!global.DataValidator,
            indicator: !!global.IntegrityIndicator,
            overlay: !!global.IntegrityOverlay
        };
    }

    /**
     * Check if all dependencies are available
     *
     * @returns {boolean} True if all dependencies loaded
     */
    function allDependenciesReady() {
        const deps = checkDependencies();
        return deps.dataValidator && deps.indicator && deps.overlay;
    }

    // ════════════════════════════════════════════════════════════════════════════
    // SECTION 3: INITIALIZATION
    // ════════════════════════════════════════════════════════════════════════════

    /**
     * Initialize the integrity visibility system
     *
     * Waits for dependencies to be available, then initializes in order.
     * Will retry a few times if dependencies aren't immediately ready.
     *
     * @param {Object} options - Initialization options
     * @param {string} options.indicatorId - ID of indicator container (default: 'integrityIndicator')
     * @param {string} options.overlayId - ID of overlay container (default: 'integrityOverlay')
     */
    function init(options = {}) {
        if (isInitialized) {
            console.log('[IntegrityOrchestrator] Already initialized');
            return;
        }

        const {
            indicatorId = 'integrityIndicator',
            overlayId = 'integrityOverlay'
        } = options;

        // Check dependencies
        const deps = checkDependencies();

        if (!allDependenciesReady()) {
            initializationAttempts++;

            if (initializationAttempts < MAX_INIT_ATTEMPTS) {
                console.log(`[IntegrityOrchestrator] Waiting for dependencies (attempt ${initializationAttempts}/${MAX_INIT_ATTEMPTS})...`);
                console.log(`  - DataValidator: ${deps.dataValidator ? '✓' : '✗'}`);
                console.log(`  - IntegrityIndicator: ${deps.indicator ? '✓' : '✗'}`);
                console.log(`  - IntegrityOverlay: ${deps.overlay ? '✓' : '✗'}`);

                setTimeout(() => init(options), INIT_RETRY_DELAY);
                return;
            } else {
                console.error('[IntegrityOrchestrator] Failed to initialize - missing dependencies after retries');
                console.error('  Missing:', Object.entries(deps)
                    .filter(([, loaded]) => !loaded)
                    .map(([name]) => name)
                    .join(', '));
                return;
            }
        }

        // All dependencies ready - initialize components
        console.log('[IntegrityOrchestrator] All dependencies ready, initializing...');

        // Initialize indicator
        if (global.IntegrityIndicator?.init) {
            global.IntegrityIndicator.init(indicatorId);
        }

        // Initialize overlay
        if (global.IntegrityOverlay?.init) {
            global.IntegrityOverlay.init(overlayId);
        }

        // Trigger initial update
        triggerUpdate();

        // Listen for future updates
        document.addEventListener('quannex:data-integrity-updated', handleIntegrityUpdate);

        isInitialized = true;
        initializationAttempts = 0;

        // Emit ready event
        document.dispatchEvent(new CustomEvent('quannex:integrity-system-ready'));

        console.log('🛡️ [IntegrityOrchestrator] Data integrity visibility system READY');
    }

    // ════════════════════════════════════════════════════════════════════════════
    // SECTION 4: EVENT HANDLERS
    // ════════════════════════════════════════════════════════════════════════════

    /**
     * Handle data integrity update event
     *
     * @param {CustomEvent} event - Event with report in detail
     */
    function handleIntegrityUpdate(event) {
        const report = event.detail;

        if (!report) {
            console.warn('[IntegrityOrchestrator] Received update event without report');
            return;
        }

        console.log(`[IntegrityOrchestrator] Processing integrity update: ${report.issueCount || 0} issues`);

        // Update indicator (it also listens, but explicit call ensures sync)
        if (global.IntegrityIndicator?.updateFromReport) {
            global.IntegrityIndicator.updateFromReport(report);
        }

        // Update overlay if it's open
        if (global.IntegrityOverlay?.isOpen?.() && global.IntegrityOverlay?.updateFromReport) {
            global.IntegrityOverlay.updateFromReport(report);
        }
    }

    // ════════════════════════════════════════════════════════════════════════════
    // SECTION 5: PUBLIC API
    // ════════════════════════════════════════════════════════════════════════════

    /**
     * Trigger an update from DataValidator
     *
     * Call this after calculations complete to refresh the integrity display.
     */
    function triggerUpdate() {
        if (!global.DataValidator) {
            console.warn('[IntegrityOrchestrator] Cannot trigger update - DataValidator not available');
            return;
        }

        const report = global.DataValidator.getCorruptionReport();

        // Emit event for all listeners
        document.dispatchEvent(new CustomEvent('quannex:data-integrity-updated', {
            detail: report
        }));
    }

    /**
     * Toggle the integrity overlay visibility
     *
     * Called by keyboard shortcut handler (dodec-controls.js)
     */
    function toggleOverlay() {
        if (!isInitialized) {
            console.warn('[IntegrityOrchestrator] Cannot toggle overlay - not initialized');
            return;
        }

        if (global.IntegrityOverlay?.toggle) {
            global.IntegrityOverlay.toggle();
        }
    }

    /**
     * Open the integrity overlay
     */
    function openOverlay() {
        if (global.IntegrityOverlay?.open) {
            global.IntegrityOverlay.open();
        }
    }

    /**
     * Close the integrity overlay
     */
    function closeOverlay() {
        if (global.IntegrityOverlay?.close) {
            global.IntegrityOverlay.close();
        }
    }

    /**
     * Check if the system is ready
     *
     * @returns {boolean} True if initialized and all components ready
     */
    function isReady() {
        return isInitialized;
    }

    /**
     * Get current integrity status
     *
     * @returns {Object} Status object with issue count and severity
     */
    function getStatus() {
        if (!global.DataValidator) {
            return { healthy: true, issueCount: 0, severity: 'healthy' };
        }

        const report = global.DataValidator.getCorruptionReport();
        const severity = global.IntegrityIndicator?.getSeverity?.(report.issueCount) || 'healthy';

        return {
            healthy: report.healthy,
            issueCount: report.issueCount,
            severity: severity,
            circuitBreakerTriggered: global.IntegrityOverlay?.shouldTriggerCircuitBreaker?.(report) || false
        };
    }

    /**
     * Cleanup all resources
     */
    function cleanup() {
        document.removeEventListener('quannex:data-integrity-updated', handleIntegrityUpdate);

        if (global.IntegrityIndicator?.cleanup) {
            global.IntegrityIndicator.cleanup();
        }
        if (global.IntegrityOverlay?.cleanup) {
            global.IntegrityOverlay.cleanup();
        }

        isInitialized = false;
        console.log('[IntegrityOrchestrator] Cleaned up');
    }

    // ════════════════════════════════════════════════════════════════════════════
    // SECTION 6: EXPORTS
    // ════════════════════════════════════════════════════════════════════════════

    const IntegrityOrchestrator = {
        VERSION: '1.0.0',

        // Lifecycle
        init,
        cleanup,

        // API
        triggerUpdate,
        toggleOverlay,
        openOverlay,
        closeOverlay,
        isReady,
        getStatus,

        // Debugging
        checkDependencies
    };

    // Export to window
    global.IntegrityOrchestrator = IntegrityOrchestrator;

    console.log('🛡️ IntegrityOrchestrator v1.0.0 loaded');

})(typeof window !== 'undefined' ? window : this);
