/**
 * ════════════════════════════════════════════════════════════════════════════════
 * INTEGRITY INDICATOR - HUD Badge Component
 * ════════════════════════════════════════════════════════════════════════════════
 *
 * VERSION: 1.0.0
 * CREATED: 2025-12-26 by Claude Opus 4.5
 * VERIFICATION: ✅ Tested
 * COMPLEXITY: 🟢 Simple
 * DATA INTEGRITY: 🛡️ Protected (reads from DataValidator)
 *
 * ════════════════════════════════════════════════════════════════════════════════
 * NOTES FOR FUTURE CLAUDE
 * ════════════════════════════════════════════════════════════════════════════════
 *
 * WHAT THIS DOES:
 * ─────────────────────────────────────────────────────────────────────────────────
 * Displays a data integrity badge in the coherence HUD that shows:
 * - Issue count (number of data substitutions made)
 * - Severity color (healthy → minimal → moderate → critical)
 * - Notification dot when issues exist
 * - "Inspect" button to open detailed overlay
 *
 * The badge uses progressive disclosure - hidden by default, expands on hover.
 *
 * SEVERITY THRESHOLDS:
 * ─────────────────────────────────────────────────────────────────────────────────
 * - Healthy:  0 issues      → Green (#66ff99)
 * - Minimal:  1-2 issues    → Gold (#ffd700)
 * - Moderate: 3-5 issues    → Amber (#ffaa44)
 * - Critical: 6+ issues     → Orange (#ff8844)
 *
 * NAVIGATION MAP:
 * ─────────────────────────────────────────────────────────────────────────────────
 * DEPENDS ON:
 * - DataValidator (window.DataValidator) → getCorruptionReport()
 *
 * EXPORTS:
 * - IntegrityIndicator.init(containerId) → Initialize with DOM container
 * - IntegrityIndicator.updateFromReport(report) → Update display from report
 * - IntegrityIndicator.getSeverity(issueCount) → Get severity level
 *
 * USED BY:
 * - integrity-orchestrator.js → Calls updateFromReport after calculations
 * - dodecahedron-3d.html → Initializes on page load
 *
 * EVENTS LISTENED:
 * - quannex:data-integrity-updated → Auto-updates from report in event detail
 *
 * EVENTS EMITTED:
 * - integrity:open-overlay → When user clicks "Inspect" button
 *
 * ════════════════════════════════════════════════════════════════════════════════
 */

(function (global) {
    'use strict';

    // ════════════════════════════════════════════════════════════════════════════
    // SECTION 1: CONSTANTS
    // ════════════════════════════════════════════════════════════════════════════

    /**
     * Severity thresholds based on issue count
     * Uses PHI-inspired progression: 0, 2, 5 (roughly φ² spacing)
     */
    const SEVERITY_THRESHOLDS = {
        HEALTHY: 0,      // No issues
        MINIMAL: 2,      // 1-2 issues
        MODERATE: 5,     // 3-5 issues
        CRITICAL: 6      // 6+ issues
    };

    /**
     * Icons for each severity level
     */
    const SEVERITY_ICONS = {
        healthy: '✓',
        minimal: '◐',
        moderate: '◑',
        critical: '⚠'
    };

    // ════════════════════════════════════════════════════════════════════════════
    // SECTION 2: STATE
    // ════════════════════════════════════════════════════════════════════════════

    let containerElement = null;
    let countElement = null;
    let iconElement = null;
    let buttonElement = null;
    let isInitialized = false;

    // ════════════════════════════════════════════════════════════════════════════
    // SECTION 3: SEVERITY CALCULATION
    // ════════════════════════════════════════════════════════════════════════════

    /**
     * Determine severity level from issue count
     *
     * @param {number} issueCount - Number of data integrity issues
     * @returns {string} Severity level: 'healthy', 'minimal', 'moderate', 'critical'
     */
    function getSeverity(issueCount) {
        if (issueCount === 0) return 'healthy';
        if (issueCount <= SEVERITY_THRESHOLDS.MINIMAL) return 'minimal';
        if (issueCount <= SEVERITY_THRESHOLDS.MODERATE) return 'moderate';
        return 'critical';
    }

    // ════════════════════════════════════════════════════════════════════════════
    // SECTION 4: DOM UPDATES
    // ════════════════════════════════════════════════════════════════════════════

    /**
     * Update the indicator display from a corruption report
     *
     * @param {Object} report - DataValidator corruption report
     * @param {boolean} report.healthy - True if no issues
     * @param {number} report.issueCount - Number of issues
     * @param {Array} report.issues - Array of issue details
     */
    function updateFromReport(report) {
        if (!isInitialized) {
            Logger.warn('IntegrityIndicator', 'Not initialized, cannot update');
            return;
        }

        const issueCount = report?.issueCount || 0;
        const severity = getSeverity(issueCount);

        // Update count display
        if (countElement) {
            countElement.textContent = issueCount;

            // Remove all severity classes and add current one
            countElement.classList.remove(
                'severity-healthy',
                'severity-minimal',
                'severity-moderate',
                'severity-critical'
            );
            countElement.classList.add(`severity-${severity}`);
        }

        // Update icon
        if (iconElement) {
            iconElement.textContent = SEVERITY_ICONS[severity];
        }

        // Update HUD notification dot
        const hud = document.getElementById('coherenceHud');
        if (hud) {
            if (issueCount > 0) {
                hud.classList.add('has-integrity-issues');
            } else {
                hud.classList.remove('has-integrity-issues');
            }
        }

        // Update button text based on count
        if (buttonElement) {
            buttonElement.textContent = issueCount > 0
                ? `View ${issueCount} Issue${issueCount !== 1 ? 's' : ''} →`
                : 'View Report →';
        }

        Logger.debug('IntegrityIndicator', `Updated: ${issueCount} issues (${severity})`);
    }

    /**
     * Handle click on the inspect button
     */
    function handleInspectClick() {
        // Emit event for overlay to listen to
        document.dispatchEvent(new CustomEvent('integrity:open-overlay'));
        Logger.debug('IntegrityIndicator', 'Opening overlay...');
    }

    // ════════════════════════════════════════════════════════════════════════════
    // SECTION 5: INITIALIZATION
    // ════════════════════════════════════════════════════════════════════════════

    /**
     * Initialize the integrity indicator
     *
     * @param {string} containerId - ID of the container element (default: 'integrityIndicator')
     */
    function init(containerId = 'integrityIndicator') {
        containerElement = document.getElementById(containerId);

        if (!containerElement) {
            Logger.warn('IntegrityIndicator', `Container #${containerId} not found`);
            return;
        }

        // Get child elements
        countElement = document.getElementById('integrityCount');
        iconElement = containerElement.querySelector('.integrity-indicator-icon');
        buttonElement = document.getElementById('openIntegrityOverlay');

        // Bind button click
        if (buttonElement) {
            buttonElement.addEventListener('click', handleInspectClick);
        }

        // Listen for data integrity updates
        document.addEventListener('quannex:data-integrity-updated', (event) => {
            if (event.detail) {
                updateFromReport(event.detail);
            }
        });

        isInitialized = true;
        Logger.info('IntegrityIndicator', 'Initialized');

        // Initial update from DataValidator if available
        if (global.DataValidator) {
            const report = global.DataValidator.getCorruptionReport();
            updateFromReport(report);
        }
    }

    /**
     * Cleanup resources
     */
    function cleanup() {
        if (buttonElement) {
            buttonElement.removeEventListener('click', handleInspectClick);
        }
        isInitialized = false;
        Logger.info('IntegrityIndicator', 'Cleaned up');
    }

    // ════════════════════════════════════════════════════════════════════════════
    // SECTION 6: EXPORTS
    // ════════════════════════════════════════════════════════════════════════════

    const IntegrityIndicator = {
        VERSION: '1.0.0',

        // Lifecycle
        init,
        cleanup,

        // API
        updateFromReport,
        getSeverity,

        // Constants (for external use)
        SEVERITY_THRESHOLDS,
        SEVERITY_ICONS
    };

    // Export to window
    global.IntegrityIndicator = IntegrityIndicator;

    Logger.info('IntegrityIndicator', 'v1.0.0 loaded');

})(typeof window !== 'undefined' ? window : this);
