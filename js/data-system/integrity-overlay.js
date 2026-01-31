/**
 * ════════════════════════════════════════════════════════════════════════════════
 * INTEGRITY OVERLAY - Detailed Data Quality Report Panel
 * ════════════════════════════════════════════════════════════════════════════════
 *
 * VERSION: 1.0.0
 * CREATED: 2025-12-26 by Claude Opus 4.5
 * VERIFICATION: ✅ Tested
 * COMPLEXITY: 🟡 Medium (DOM manipulation, event handling, card expansion)
 * DATA INTEGRITY: 🛡️ Protected (reads from DataValidator)
 *
 * ════════════════════════════════════════════════════════════════════════════════
 * NOTES FOR FUTURE CLAUDE
 * ════════════════════════════════════════════════════════════════════════════════
 *
 * WHAT THIS DOES:
 * ─────────────────────────────────────────────────────────────────────────────────
 * This overlay displays the full data integrity report from DataValidator.
 * It transforms the corruption log into a human-readable, actionable interface.
 *
 * When opened, it shows:
 * 1. SUMMARY HEADER - Total issue count, severity, and healthy/unhealthy status
 * 2. ISSUE CARDS - Expandable cards for each data substitution
 * 3. CIRCUIT BREAKER - Full-screen warning when >50% data is corrupted
 *
 * The overlay uses progressive disclosure:
 * - Summary always visible
 * - Issue cards collapsed by default
 * - Expand individual cards for details
 *
 * CIRCUIT BREAKER LOGIC:
 * ─────────────────────────────────────────────────────────────────────────────────
 * When corruption exceeds 50% threshold:
 * - Normal overlay is replaced with CRITICAL FAILURE mode
 * - User must acknowledge before proceeding
 * - This prevents trusting deeply corrupted data
 *
 * The threshold is configurable via CIRCUIT_BREAKER_THRESHOLD constant.
 * Default: 50% (if 6+ out of 12 faces have issues, or issue count > 30)
 *
 * NAVIGATION MAP:
 * ─────────────────────────────────────────────────────────────────────────────────
 * DEPENDS ON:
 * - DataValidator (window.DataValidator) → getCorruptionReport()
 * - IntegrityIndicator → getSeverity() for color mapping
 *
 * EXPORTS:
 * - IntegrityOverlay.init() → Initialize DOM and event listeners
 * - IntegrityOverlay.open() → Show the overlay
 * - IntegrityOverlay.close() → Hide the overlay
 * - IntegrityOverlay.updateFromReport(report) → Refresh content
 * - IntegrityOverlay.isOpen() → Check if overlay is visible
 *
 * USED BY:
 * - integrity-orchestrator.js → Calls open() on 'I' key press
 * - dodecahedron-3d.html → Initializes on page load
 *
 * EVENTS LISTENED:
 * - integrity:open-overlay → Opens the overlay
 * - keydown (ESC) → Closes the overlay
 *
 * EVENTS EMITTED:
 * - quannex:integrity-overlay-opened → When overlay opens
 * - quannex:integrity-overlay-closed → When overlay closes
 *
 * DESIGN PHILOSOPHY:
 * ─────────────────────────────────────────────────────────────────────────────────
 * This follows ALCOA+ pharmaceutical-grade data integrity principles:
 * - Attributable: Each issue shows WHAT data and WHERE
 * - Legible: Clear, readable presentation with expandable detail
 * - Contemporaneous: Timestamps show WHEN substitution occurred
 * - Original: Shows both original (corrupted) and substituted values
 * - Accurate: No interpretation, just facts about substitutions
 *
 * ════════════════════════════════════════════════════════════════════════════════
 */

(function (global) {
    'use strict';

    // ════════════════════════════════════════════════════════════════════════════
    // SECTION 1: CONSTANTS
    // ════════════════════════════════════════════════════════════════════════════

    /**
     * Circuit breaker threshold - percentage of corruption that triggers lockdown
     * When more than this percentage of expected data is corrupted, show critical UI
     */
    const CIRCUIT_BREAKER_THRESHOLD = 0.5; // 50%

    /**
     * Expected data points for threshold calculation
     * 12 faces × (1 Ball + 5 Pillars) = 72 KPIs minimum
     */
    const EXPECTED_DATA_POINTS = 72;

    /**
     * Severity colors (matches css/data-integrity.css)
     */
    const SEVERITY_COLORS = {
        healthy: '#66ff99',
        minimal: '#ffd700',
        moderate: '#ffaa44',
        critical: '#ff8844'
    };

    /**
     * Severity labels for human display
     */
    const SEVERITY_LABELS = {
        healthy: 'Healthy',
        minimal: 'Minimal Issues',
        moderate: 'Moderate Issues',
        critical: 'Critical Issues'
    };

    // ════════════════════════════════════════════════════════════════════════════
    // SECTION 2: STATE
    // ════════════════════════════════════════════════════════════════════════════

    let overlayElement = null;
    let containerElement = null;  // The container inside the overlay for content
    let isInitialized = false;
    let isVisible = false;
    let currentReport = null;
    let boundKeyHandler = null;

    // ════════════════════════════════════════════════════════════════════════════
    // SECTION 3: LAZY DEPENDENCY RESOLUTION
    // ════════════════════════════════════════════════════════════════════════════

    /**
     * Get DataValidator lazily (may not be loaded when this module initializes)
     * @returns {Object|null} DataValidator or null
     */
    function getDataValidator() {
        return global.DataValidator || null;
    }

    /**
     * Get IntegrityIndicator lazily for severity calculation
     * @returns {Object|null} IntegrityIndicator or null
     */
    function getIndicator() {
        return global.IntegrityIndicator || null;
    }

    /**
     * Calculate severity from issue count
     * Falls back to local calculation if IntegrityIndicator not available
     *
     * @param {number} issueCount - Number of issues
     * @returns {string} Severity level
     */
    function getSeverity(issueCount) {
        const indicator = getIndicator();
        if (indicator?.getSeverity) {
            return indicator.getSeverity(issueCount);
        }
        // Fallback calculation
        if (issueCount === 0) return 'healthy';
        if (issueCount <= 2) return 'minimal';
        if (issueCount <= 5) return 'moderate';
        return 'critical';
    }

    // ════════════════════════════════════════════════════════════════════════════
    // SECTION 4: CIRCUIT BREAKER
    // ════════════════════════════════════════════════════════════════════════════

    /**
     * Check if corruption level triggers circuit breaker
     *
     * @param {Object} report - DataValidator corruption report
     * @returns {boolean} True if circuit breaker should activate
     */
    function shouldTriggerCircuitBreaker(report) {
        if (!report || report.issueCount === 0) return false;

        // Calculate corruption ratio
        const corruptionRatio = report.issueCount / EXPECTED_DATA_POINTS;

        // Also check for face-level catastrophe (more than half of faces affected)
        const affectedFaces = new Set();
        report.issues?.forEach(issue => {
            const faceMatch = issue.context?.match(/Face (\d+)/);
            if (faceMatch) {
                affectedFaces.add(faceMatch[1]);
            }
        });
        const faceCorruptionRatio = affectedFaces.size / 12;

        return corruptionRatio >= CIRCUIT_BREAKER_THRESHOLD ||
            faceCorruptionRatio >= CIRCUIT_BREAKER_THRESHOLD;
    }

    // ════════════════════════════════════════════════════════════════════════════
    // SECTION 5: HTML GENERATION
    // ════════════════════════════════════════════════════════════════════════════

    /**
     * Generate the overlay header HTML
     *
     * @param {Object} report - DataValidator corruption report
     * @returns {string} HTML string
     */
    function generateHeader(report) {
        const issueCount = report?.issueCount || 0;
        const severity = getSeverity(issueCount);
        const color = SEVERITY_COLORS[severity];
        const label = SEVERITY_LABELS[severity];

        return `
            <div class="integrity-overlay-header">
                <div class="integrity-overlay-title">
                    <div class="integrity-overlay-title-row">
                        <span class="integrity-overlay-icon" style="color: ${color}">🛡️</span>
                        <h2>Data Integrity Report</h2>
                    </div>
                    <div class="integrity-overlay-subtitle">Keyboard: Press I to toggle, ESC to close</div>
                </div>
                <button class="integrity-overlay-close" aria-label="Close overlay">×</button>
            </div>
        `;
    }

    /**
     * Generate the summary stats section
     *
     * @param {Object} report - DataValidator corruption report
     * @returns {string} HTML string
     */
    function generateSummary(report) {
        const issueCount = report?.issueCount || 0;
        const severity = getSeverity(issueCount);
        const color = SEVERITY_COLORS[severity];
        const label = SEVERITY_LABELS[severity];

        return `
            <div class="integrity-summary" data-severity="${severity}">
                <div class="integrity-stat">
                    <div class="integrity-stat-value" style="color: ${color}">${issueCount}</div>
                    <div class="integrity-stat-label">${issueCount === 1 ? 'Issue' : 'Issues'}</div>
                </div>
                <div class="integrity-stat">
                    <div class="integrity-stat-value" style="color: ${color}">${label}</div>
                    <div class="integrity-stat-label">Status</div>
                </div>
            </div>
        `;
    }

    /**
     * Generate HTML for a single issue card
     *
     * @param {Object} issue - Issue object from corruption report
     * @param {number} index - Card index for unique ID
     * @returns {string} HTML string
     */
    function generateIssueCard(issue, index) {
        const timestamp = issue.when ? new Date(issue.when).toLocaleTimeString() : 'Unknown';

        // Parse context for face information
        const faceMatch = issue.context?.match(/Face (\d+)/);
        const faceId = faceMatch ? faceMatch[1] : '?';

        // Determine card severity based on substitution magnitude
        const original = parseFloat(issue.original);
        const substituted = issue.substituted;
        const delta = Math.abs(substituted - (isNaN(original) ? 0 : original));
        const cardSeverity = delta > 0.3 ? 'critical' : delta > 0.1 ? 'moderate' : 'minimal';

        return `
            <div class="integrity-card" data-index="${index}" data-severity="${cardSeverity}">
                <div class="integrity-card__header" role="button" tabindex="0"
                     aria-expanded="false" aria-controls="integrity-card-${index}-content">
                    <div class="integrity-card__face-badge">F${faceId}</div>
                    <div class="integrity-card__context">${escapeHtml(issue.context)}</div>
                    <div class="integrity-card__chevron">▸</div>
                </div>
                <div class="integrity-card__content" id="integrity-card-${index}-content" hidden>
                    <div class="integrity-card__detail">
                        <span class="integrity-card__label">Original Value:</span>
                        <code class="integrity-card__value integrity-card__value--corrupted">${escapeHtml(issue.original)}</code>
                    </div>
                    <div class="integrity-card__detail">
                        <span class="integrity-card__label">Substituted With:</span>
                        <code class="integrity-card__value integrity-card__value--substituted">${substituted.toFixed(6)}</code>
                    </div>
                    <div class="integrity-card__detail">
                        <span class="integrity-card__label">Detected At:</span>
                        <span class="integrity-card__value">${timestamp}</span>
                    </div>
                    <div class="integrity-card__detail">
                        <span class="integrity-card__label">PHI Default Used:</span>
                        <span class="integrity-card__value">${getPHIConstantName(substituted)}</span>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Generate circuit breaker failure UI
     *
     * @param {Object} report - DataValidator corruption report
     * @returns {string} HTML string
     */
    function generateCircuitBreakerUI(report) {
        const issueCount = report?.issueCount || 0;
        const percentage = ((issueCount / EXPECTED_DATA_POINTS) * 100).toFixed(1);

        return `
            <div class="integrity-circuit-breaker">
                <div class="integrity-circuit-breaker__icon">⚠️</div>
                <h2 class="integrity-circuit-breaker__title">Data Integrity Failure</h2>
                <p class="integrity-circuit-breaker__message">
                    <strong>${percentage}%</strong> of expected data points are corrupted or missing.
                    <br>This exceeds the safety threshold of ${CIRCUIT_BREAKER_THRESHOLD * 100}%.
                </p>
                <div class="integrity-circuit-breaker__stats">
                    <div class="integrity-circuit-breaker__stat">
                        <span class="integrity-circuit-breaker__stat-value">${issueCount}</span>
                        <span class="integrity-circuit-breaker__stat-label">Issues</span>
                    </div>
                    <div class="integrity-circuit-breaker__stat">
                        <span class="integrity-circuit-breaker__stat-value">${EXPECTED_DATA_POINTS}</span>
                        <span class="integrity-circuit-breaker__stat-label">Expected</span>
                    </div>
                </div>
                <p class="integrity-circuit-breaker__warning">
                    The visualization is using PHI-derived defaults for corrupted values.
                    <br>Results should NOT be trusted for decision-making.
                </p>
                <button class="integrity-circuit-breaker__acknowledge">
                    I Understand — Show Report
                </button>
            </div>
        `;
    }

    /**
     * Generate full overlay content
     *
     * @param {Object} report - DataValidator corruption report
     * @param {boolean} bypassCircuitBreaker - Skip circuit breaker check
     * @returns {string} HTML string
     */
    function generateContent(report, bypassCircuitBreaker = false) {
        // Check circuit breaker
        if (!bypassCircuitBreaker && shouldTriggerCircuitBreaker(report)) {
            return generateCircuitBreakerUI(report);
        }

        // Start with header (outside scrollable content)
        let html = generateHeader(report);

        // Scrollable content area
        html += '<div class="integrity-overlay-content">';

        // Summary stats
        html += generateSummary(report);

        // Issue cards or healthy message
        if (!report || report.issueCount === 0) {
            html += `
                <div class="integrity-overlay-empty">
                    <div class="integrity-overlay-empty-icon">✓</div>
                    <h3>All Data Validated</h3>
                    <p>No substitutions were required during the last calculation.</p>
                </div>
            `;
        } else {
            // Sort issues by face ID for logical grouping
            const sortedIssues = [...(report.issues || [])].sort((a, b) => {
                const faceA = parseInt(a.context?.match(/Face (\d+)/)?.[1] || 0);
                const faceB = parseInt(b.context?.match(/Face (\d+)/)?.[1] || 0);
                return faceA - faceB;
            });

            sortedIssues.forEach((issue, index) => {
                html += generateIssueCard(issue, index);
            });
        }

        html += '</div>'; // Close .integrity-overlay-content

        // Footer with keyboard hints and timestamp
        html += `
            <div class="integrity-overlay-footer">
                <span class="integrity-overlay-hint"><span class="key-hint">I</span>Toggle</span>
                <span class="integrity-overlay-hint"><span class="key-hint">ESC</span>Close</span>
                <button class="integrity-overlay-refresh">↻ Refresh</button>
            </div>
        `;

        return html;
    }

    // ════════════════════════════════════════════════════════════════════════════
    // SECTION 6: UTILITY FUNCTIONS
    // ════════════════════════════════════════════════════════════════════════════

    /**
     * Escape HTML to prevent XSS
     *
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = String(text);
        return div.innerHTML;
    }

    /**
     * Get PHI constant name from substituted value
     *
     * @param {number} value - Substituted value
     * @returns {string} Constant name or "Custom"
     */
    function getPHIConstantName(value) {
        const PHI_2 = 0.381966011250105;
        const PHI_MIDPOINT = 0.5;
        const PHI_1 = 0.618033988749895;

        if (Math.abs(value - PHI_2) < 0.0001) return 'PHI_2 (φ⁻²)';
        if (Math.abs(value - PHI_MIDPOINT) < 0.0001) return 'PHI_MIDPOINT';
        if (Math.abs(value - PHI_1) < 0.0001) return 'PHI_1 (φ⁻¹)';
        return 'Custom Default';
    }

    // ════════════════════════════════════════════════════════════════════════════
    // SECTION 7: EVENT HANDLERS
    // ════════════════════════════════════════════════════════════════════════════

    /**
     * Handle keyboard events (ESC to close)
     *
     * @param {KeyboardEvent} event
     */
    function handleKeyDown(event) {
        if (event.key === 'Escape' && isVisible) {
            close();
            event.preventDefault();
        }
    }

    /**
     * Handle card expansion toggle
     *
     * @param {Event} event - Click or keypress event
     */
    function handleCardToggle(event) {
        const header = event.target.closest('.integrity-card__header');
        if (!header) return;

        const card = header.closest('.integrity-card');
        const content = card.querySelector('.integrity-card__content');
        const isExpanded = header.getAttribute('aria-expanded') === 'true';

        // Toggle expansion
        header.setAttribute('aria-expanded', !isExpanded);
        content.hidden = isExpanded;
        card.classList.toggle('expanded', !isExpanded);

        // Handle keyboard activation
        if (event.type === 'keydown' && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
        }
    }

    /**
     * Handle circuit breaker acknowledge button
     */
    function handleCircuitBreakerAcknowledge() {
        if (currentReport && containerElement) {
            containerElement.innerHTML = generateContent(currentReport, true);
            bindCardEvents();
        }
    }

    /**
     * Handle refresh button click
     */
    function handleRefresh() {
        const validator = getDataValidator();
        if (validator) {
            const report = validator.getCorruptionReport();
            updateFromReport(report);
        }
    }

    /**
     * Bind event listeners to card elements
     */
    function bindCardEvents() {
        if (!containerElement) return;

        // Card toggle handlers
        containerElement.querySelectorAll('.integrity-card__header').forEach(header => {
            header.addEventListener('click', handleCardToggle);
            header.addEventListener('keydown', handleCardToggle);
        });

        // Close button
        const closeBtn = containerElement.querySelector('.integrity-overlay-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', close);
        }

        // Refresh button
        const refreshBtn = containerElement.querySelector('.integrity-overlay-refresh');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', handleRefresh);
        }

        // Circuit breaker acknowledge
        const ackBtn = containerElement.querySelector('.integrity-circuit-breaker__acknowledge');
        if (ackBtn) {
            ackBtn.addEventListener('click', handleCircuitBreakerAcknowledge);
        }
    }

    // ════════════════════════════════════════════════════════════════════════════
    // SECTION 8: PUBLIC API
    // ════════════════════════════════════════════════════════════════════════════

    /**
     * Initialize the overlay
     *
     * @param {string} overlayId - ID of overlay element (default: 'integrityOverlay')
     */
    function init(overlayId = 'integrityOverlay') {
        overlayElement = document.getElementById(overlayId);

        if (!overlayElement) {
            Logger.warn('IntegrityOverlay', `Overlay #${overlayId} not found`);
            return;
        }

        // Get the container element inside the overlay (where content goes)
        containerElement = overlayElement.querySelector('.integrity-overlay-container');
        if (!containerElement) {
            Logger.warn('IntegrityOverlay', 'Container element not found inside overlay');
            return;
        }

        // Bind global keydown handler
        boundKeyHandler = handleKeyDown;
        document.addEventListener('keydown', boundKeyHandler);

        // Listen for open event from indicator
        document.addEventListener('integrity:open-overlay', () => {
            open();
        });

        isInitialized = true;
        Logger.info('IntegrityOverlay', 'Initialized');
    }

    /**
     * Open the overlay
     */
    function open() {
        if (!isInitialized || !overlayElement || !containerElement) {
            Logger.warn('IntegrityOverlay', 'Cannot open - not initialized');
            return;
        }

        // Get current report
        const validator = getDataValidator();
        if (validator) {
            currentReport = validator.getCorruptionReport();
        }

        // Generate content - inject into CONTAINER, not overlay
        // This preserves the backdrop and modal structure
        containerElement.innerHTML = generateContent(currentReport);
        bindCardEvents();

        // Show overlay
        overlayElement.classList.add('visible');
        overlayElement.removeAttribute('hidden');
        isVisible = true;

        // Emit event
        document.dispatchEvent(new CustomEvent('quannex:integrity-overlay-opened'));
        Logger.info('IntegrityOverlay', 'Opened');

        // Focus first interactive element for accessibility
        const firstButton = containerElement.querySelector('button');
        if (firstButton) {
            firstButton.focus();
        }
    }

    /**
     * Close the overlay
     */
    function close() {
        if (!overlayElement) return;

        overlayElement.classList.remove('visible');
        overlayElement.setAttribute('hidden', '');
        isVisible = false;

        // Emit event
        document.dispatchEvent(new CustomEvent('quannex:integrity-overlay-closed'));
        Logger.info('IntegrityOverlay', 'Closed');
    }

    /**
     * Update overlay content from report
     *
     * @param {Object} report - DataValidator corruption report
     */
    function updateFromReport(report) {
        currentReport = report;

        if (isVisible && containerElement) {
            containerElement.innerHTML = generateContent(report);
            bindCardEvents();
        }
    }

    /**
     * Check if overlay is currently visible
     *
     * @returns {boolean}
     */
    function isOpen() {
        return isVisible;
    }

    /**
     * Toggle overlay visibility
     */
    function toggle() {
        if (isVisible) {
            close();
        } else {
            open();
        }
    }

    /**
     * Cleanup resources
     */
    function cleanup() {
        if (boundKeyHandler) {
            document.removeEventListener('keydown', boundKeyHandler);
        }
        overlayElement = null;
        containerElement = null;
        isInitialized = false;
        isVisible = false;
        Logger.info('IntegrityOverlay', 'Cleaned up');
    }

    // ════════════════════════════════════════════════════════════════════════════
    // SECTION 9: EXPORTS
    // ════════════════════════════════════════════════════════════════════════════

    const IntegrityOverlay = {
        VERSION: '1.0.0',

        // Lifecycle
        init,
        cleanup,

        // API
        open,
        close,
        toggle,
        isOpen,
        updateFromReport,

        // Constants (for external use)
        CIRCUIT_BREAKER_THRESHOLD,
        EXPECTED_DATA_POINTS,
        SEVERITY_COLORS,
        SEVERITY_LABELS,

        // Utilities (for testing)
        shouldTriggerCircuitBreaker,
        getSeverity
    };

    // Export to window
    global.IntegrityOverlay = IntegrityOverlay;

    Logger.info('IntegrityOverlay', 'v1.0.0 loaded');

})(typeof window !== 'undefined' ? window : this);
