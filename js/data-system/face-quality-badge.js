/**
 * ════════════════════════════════════════════════════════════════════════════════
 * FACE QUALITY BADGE - Per-Face Data Integrity Indicators
 * ════════════════════════════════════════════════════════════════════════════════
 *
 * VERSION: 1.0.0
 * CREATED: 2025-12-26 by Claude Opus 4.5
 * VERIFICATION: ✅ Tested
 * COMPLEXITY: 🟢 Simple (data transformation and display)
 * DATA INTEGRITY: 🛡️ Protected (reads from DataValidator)
 *
 * ════════════════════════════════════════════════════════════════════════════════
 * NOTES FOR FUTURE CLAUDE
 * ════════════════════════════════════════════════════════════════════════════════
 *
 * WHAT THIS DOES:
 * ─────────────────────────────────────────────────────────────────────────────────
 * This module provides per-face quality indicators. Each of the 12 dodecahedron
 * faces gets a badge showing its data quality status:
 *
 *   ✓ (green)  = All KPIs valid - no substitutions
 *   ⚠ (yellow) = Some substitutions - data partially compromised
 *   ⛔ (red)    = Critical issues - multiple substitutions on this face
 *
 * WHY PER-FACE GRANULARITY MATTERS:
 * ─────────────────────────────────────────────────────────────────────────────────
 * A global "3 issues" count doesn't tell the whole story. Consider:
 *
 *   Scenario A: 3 issues spread across 3 faces → each face 67% reliable
 *   Scenario B: 3 issues all on Face 5 → Face 5 is 40% reliable, others 100%
 *
 * Scenario B is actually BETTER for organizational coherence analysis because
 * 11/12 faces are trustworthy. Per-face badges surface this distinction.
 *
 * BADGE THRESHOLDS:
 * ─────────────────────────────────────────────────────────────────────────────────
 * These thresholds are PHI-derived for consistency with the integrity system:
 *
 *   Healthy (✓): 0 issues on this face
 *   Warning (⚠): 1-2 issues (up to φ^-2 of 5 KPIs = ~2 issues)
 *   Critical (⛔): 3+ issues (more than φ^-2 of face's KPIs)
 *
 * Each face has 1 Ball KPI + 5 Pillar KPIs = 6 data points.
 * PHI^-2 (0.382) × 6 ≈ 2.3, so 3+ issues exceeds the PHI threshold.
 *
 * ════════════════════════════════════════════════════════════════════════════════
 * NAVIGATION MAP
 * ════════════════════════════════════════════════════════════════════════════════
 *
 * DEPENDS ON:
 * - DataValidator (window.DataValidator) → getCorruptionReport()
 *
 * EXPORTS:
 * - FaceQualityBadge.init() → Initialize (call once on page load)
 * - FaceQualityBadge.getQualityMap() → Returns Map<faceId, {status, issueCount}>
 * - FaceQualityBadge.getFaceStatus(faceId) → Get single face's quality
 * - FaceQualityBadge.getBadgeHTML(faceId) → Get HTML for badge element
 * - FaceQualityBadge.updateFromReport(report) → Update from integrity report
 *
 * USED BY:
 * - dodec-geometry.js → Could show badges in 3D (future enhancement)
 * - dodec-panels.js → Shows badge in face detail panel
 * - index.html → Could show face quality grid (Phase B)
 * - integrity-orchestrator.js → Triggers update after recalculation
 *
 * EVENTS LISTENED:
 * - quannex:data-integrity-updated → Updates face quality map
 *
 * EVENTS EMITTED:
 * - quannex:face-quality-updated → When face quality map changes
 *
 * ════════════════════════════════════════════════════════════════════════════════
 * VISUAL DESIGN
 * ════════════════════════════════════════════════════════════════════════════════
 *
 * Badge design follows the gold/amber theme from data-integrity.css:
 *
 * ┌─────┐  ┌─────┐  ┌─────┐
 * │  ✓  │  │  ⚠  │  │  ⛔  │
 * │ F1  │  │ F5  │  │ F9  │
 * └─────┘  └─────┘  └─────┘
 *  green   yellow    red
 *
 * Colors:
 * - Healthy:  #66ff99 (bright green - matches integrity-indicator)
 * - Warning:  #ffd700 (gold - matches minimal severity)
 * - Critical: #ff8844 (orange-amber - matches critical severity)
 *
 * ════════════════════════════════════════════════════════════════════════════════
 */

(function(global) {
    'use strict';

    // ════════════════════════════════════════════════════════════════════════════
    // SECTION 1: CONSTANTS
    // ════════════════════════════════════════════════════════════════════════════

    /**
     * PHI-Derived Thresholds
     *
     * Each face has 6 data points (1 Ball + 5 Pillars).
     * PHI^-2 (0.382) × 6 ≈ 2.3 → threshold at 3
     */
    const FACE_KPIS = 6;  // 1 Ball + 5 Pillars per face
    const PHI_2 = 0.381966011250105;  // φ^-2

    /**
     * Issue thresholds for badge status
     * These are PHI-derived: critical threshold = ceil(PHI_2 × FACE_KPIS)
     */
    const THRESHOLDS = {
        healthy: 0,                         // No issues
        warning: Math.ceil(PHI_2 * FACE_KPIS) - 1,  // 1-2 issues
        critical: Math.ceil(PHI_2 * FACE_KPIS)      // 3+ issues
    };

    /**
     * Badge display configuration
     */
    const BADGE_CONFIG = {
        healthy: {
            icon: '✓',
            label: 'Valid',
            color: '#66ff99',
            cssClass: 'face-quality-healthy'
        },
        warning: {
            icon: '⚠',
            label: 'Warning',
            color: '#ffd700',
            cssClass: 'face-quality-warning'
        },
        critical: {
            icon: '⛔',
            label: 'Critical',
            color: '#ff8844',
            cssClass: 'face-quality-critical'
        }
    };

    /**
     * Total number of faces in dodecahedron
     */
    const TOTAL_FACES = 12;

    // ════════════════════════════════════════════════════════════════════════════
    // SECTION 2: STATE
    // ════════════════════════════════════════════════════════════════════════════

    /**
     * Map of face IDs to their quality status
     * @type {Map<number, {status: string, issueCount: number, issues: Array}>}
     */
    let faceQualityMap = new Map();

    /**
     * Initialization flag
     */
    let isInitialized = false;

    // ════════════════════════════════════════════════════════════════════════════
    // SECTION 3: LAZY DEPENDENCY RESOLUTION
    // ════════════════════════════════════════════════════════════════════════════

    /**
     * Get DataValidator lazily
     * @returns {Object|null} DataValidator or null
     */
    function getDataValidator() {
        return global.DataValidator || null;
    }

    // ════════════════════════════════════════════════════════════════════════════
    // SECTION 4: CORE LOGIC
    // ════════════════════════════════════════════════════════════════════════════

    /**
     * Extract face ID from corruption log context string
     *
     * Context strings look like: "Face 5 (Market Resonance) energy" or
     * "KPI F5.2 (Market Share) on Face 5"
     *
     * @param {string} context - Context string from corruption log
     * @returns {number|null} Face ID or null if not found
     */
    function extractFaceId(context) {
        if (!context) return null;

        // Try to match "Face X" pattern (X is 1-12)
        const match = context.match(/Face\s*(\d+)/i);
        if (match) {
            const faceId = parseInt(match[1], 10);
            if (faceId >= 1 && faceId <= TOTAL_FACES) {
                return faceId;
            }
        }

        return null;
    }

    /**
     * Determine quality status based on issue count
     *
     * @param {number} issueCount - Number of issues for this face
     * @returns {string} Status: 'healthy', 'warning', or 'critical'
     */
    function getStatusFromCount(issueCount) {
        if (issueCount <= THRESHOLDS.healthy) return 'healthy';
        if (issueCount <= THRESHOLDS.warning) return 'warning';
        return 'critical';
    }

    /**
     * Build face quality map from corruption report
     *
     * @param {Object} report - DataValidator corruption report
     * @returns {Map<number, Object>} Face quality map
     */
    function buildQualityMap(report) {
        const qualityMap = new Map();

        // Initialize all 12 faces as healthy
        for (let faceId = 1; faceId <= TOTAL_FACES; faceId++) {
            qualityMap.set(faceId, {
                status: 'healthy',
                issueCount: 0,
                issues: []
            });
        }

        // If no report or no issues, return all healthy
        if (!report || !report.issues || report.issues.length === 0) {
            return qualityMap;
        }

        // Group issues by face
        report.issues.forEach(issue => {
            const faceId = extractFaceId(issue.context);
            if (faceId !== null) {
                const faceData = qualityMap.get(faceId);
                faceData.issueCount++;
                faceData.issues.push(issue);
            }
        });

        // Update status based on issue counts
        qualityMap.forEach((data, faceId) => {
            data.status = getStatusFromCount(data.issueCount);
        });

        return qualityMap;
    }

    // ════════════════════════════════════════════════════════════════════════════
    // SECTION 5: HTML GENERATION
    // ════════════════════════════════════════════════════════════════════════════

    /**
     * Generate HTML for a single face quality badge
     *
     * @param {number} faceId - Face ID (1-12)
     * @param {Object} options - Display options
     * @param {boolean} options.showLabel - Show text label (default: false)
     * @param {boolean} options.showFaceId - Show face ID (default: true)
     * @param {string} options.size - Size: 'small', 'medium', 'large' (default: 'small')
     * @returns {string} HTML string
     */
    function generateBadgeHTML(faceId, options = {}) {
        const {
            showLabel = false,
            showFaceId = true,
            size = 'small'
        } = options;

        const quality = faceQualityMap.get(faceId) || { status: 'healthy', issueCount: 0 };
        const config = BADGE_CONFIG[quality.status];

        const labelHtml = showLabel ? `<span class="face-badge__label">${config.label}</span>` : '';
        const faceIdHtml = showFaceId ? `<span class="face-badge__id">F${faceId}</span>` : '';
        const countHtml = quality.issueCount > 0 ?
            `<span class="face-badge__count">${quality.issueCount}</span>` : '';

        return `
            <div class="face-quality-badge face-quality-badge--${size} ${config.cssClass}"
                 data-face-id="${faceId}"
                 data-status="${quality.status}"
                 data-issue-count="${quality.issueCount}"
                 title="Face ${faceId}: ${config.label} (${quality.issueCount} issues)"
                 style="--badge-color: ${config.color}">
                <span class="face-badge__icon">${config.icon}</span>
                ${faceIdHtml}
                ${countHtml}
                ${labelHtml}
            </div>
        `.trim();
    }

    /**
     * Generate HTML for all 12 face badges in a grid
     *
     * @param {Object} options - Display options (passed to generateBadgeHTML)
     * @returns {string} HTML string
     */
    function generateAllBadgesHTML(options = {}) {
        let html = '<div class="face-quality-grid">';

        for (let faceId = 1; faceId <= TOTAL_FACES; faceId++) {
            html += generateBadgeHTML(faceId, options);
        }

        html += '</div>';
        return html;
    }

    /**
     * Generate a compact summary of face quality
     *
     * @returns {string} HTML string
     */
    function generateSummaryHTML() {
        let healthyCount = 0;
        let warningCount = 0;
        let criticalCount = 0;

        faceQualityMap.forEach(data => {
            if (data.status === 'healthy') healthyCount++;
            else if (data.status === 'warning') warningCount++;
            else if (data.status === 'critical') criticalCount++;
        });

        return `
            <div class="face-quality-summary">
                <span class="face-quality-summary__item face-quality-summary__healthy">
                    <span class="face-quality-summary__icon">✓</span>
                    <span class="face-quality-summary__count">${healthyCount}</span>
                </span>
                <span class="face-quality-summary__item face-quality-summary__warning">
                    <span class="face-quality-summary__icon">⚠</span>
                    <span class="face-quality-summary__count">${warningCount}</span>
                </span>
                <span class="face-quality-summary__item face-quality-summary__critical">
                    <span class="face-quality-summary__icon">⛔</span>
                    <span class="face-quality-summary__count">${criticalCount}</span>
                </span>
            </div>
        `.trim();
    }

    // ════════════════════════════════════════════════════════════════════════════
    // SECTION 6: EVENT HANDLERS
    // ════════════════════════════════════════════════════════════════════════════

    /**
     * Handle data integrity update event
     *
     * @param {CustomEvent} event - Event with report in detail
     */
    function handleIntegrityUpdate(event) {
        const report = event.detail;
        updateFromReport(report);
    }

    // ════════════════════════════════════════════════════════════════════════════
    // SECTION 7: PUBLIC API
    // ════════════════════════════════════════════════════════════════════════════

    /**
     * Initialize the face quality badge system
     */
    function init() {
        if (isInitialized) {
            console.log('[FaceQualityBadge] Already initialized');
            return;
        }

        // Initialize quality map with all healthy faces
        faceQualityMap = buildQualityMap(null);

        // Listen for integrity updates
        document.addEventListener('quannex:data-integrity-updated', handleIntegrityUpdate);

        // Initial update from DataValidator if available
        const validator = getDataValidator();
        if (validator) {
            const report = validator.getCorruptionReport();
            faceQualityMap = buildQualityMap(report);
        }

        isInitialized = true;
        console.log('[FaceQualityBadge] Initialized with 12 faces');
    }

    /**
     * Update face quality map from a corruption report
     *
     * @param {Object} report - DataValidator corruption report
     */
    function updateFromReport(report) {
        faceQualityMap = buildQualityMap(report);

        // Emit update event
        document.dispatchEvent(new CustomEvent('quannex:face-quality-updated', {
            detail: {
                qualityMap: faceQualityMap,
                summary: getSummary()
            }
        }));

        console.log('[FaceQualityBadge] Updated from report');
    }

    /**
     * Get the full quality map
     *
     * @returns {Map<number, Object>} Map of faceId to quality data
     */
    function getQualityMap() {
        return new Map(faceQualityMap);  // Return copy to prevent mutation
    }

    /**
     * Get quality status for a single face
     *
     * @param {number} faceId - Face ID (1-12)
     * @returns {Object} Quality data: {status, issueCount, issues}
     */
    function getFaceStatus(faceId) {
        return faceQualityMap.get(faceId) || { status: 'healthy', issueCount: 0, issues: [] };
    }

    /**
     * Get badge HTML for a single face
     *
     * @param {number} faceId - Face ID (1-12)
     * @param {Object} options - Display options
     * @returns {string} HTML string
     */
    function getBadgeHTML(faceId, options = {}) {
        return generateBadgeHTML(faceId, options);
    }

    /**
     * Get badge HTML for all faces
     *
     * @param {Object} options - Display options
     * @returns {string} HTML string
     */
    function getAllBadgesHTML(options = {}) {
        return generateAllBadgesHTML(options);
    }

    /**
     * Get summary HTML
     *
     * @returns {string} HTML string
     */
    function getSummaryHTML() {
        return generateSummaryHTML();
    }

    /**
     * Get summary statistics
     *
     * @returns {Object} Summary: {healthy, warning, critical, total}
     */
    function getSummary() {
        let healthy = 0, warning = 0, critical = 0;

        faceQualityMap.forEach(data => {
            if (data.status === 'healthy') healthy++;
            else if (data.status === 'warning') warning++;
            else critical++;
        });

        return { healthy, warning, critical, total: TOTAL_FACES };
    }

    /**
     * Check if all faces are healthy
     *
     * @returns {boolean} True if all 12 faces have no issues
     */
    function isAllHealthy() {
        for (const [, data] of faceQualityMap) {
            if (data.status !== 'healthy') return false;
        }
        return true;
    }

    /**
     * Get faces with issues
     *
     * @returns {Array<number>} Array of face IDs with issues
     */
    function getFacesWithIssues() {
        const faces = [];
        faceQualityMap.forEach((data, faceId) => {
            if (data.issueCount > 0) faces.push(faceId);
        });
        return faces;
    }

    /**
     * Cleanup resources
     */
    function cleanup() {
        document.removeEventListener('quannex:data-integrity-updated', handleIntegrityUpdate);
        faceQualityMap.clear();
        isInitialized = false;
        console.log('[FaceQualityBadge] Cleaned up');
    }

    // ════════════════════════════════════════════════════════════════════════════
    // SECTION 8: EXPORTS
    // ════════════════════════════════════════════════════════════════════════════

    const FaceQualityBadge = {
        VERSION: '1.0.0',

        // Lifecycle
        init,
        cleanup,

        // Data API
        getQualityMap,
        getFaceStatus,
        getSummary,
        isAllHealthy,
        getFacesWithIssues,
        updateFromReport,

        // HTML Generation
        getBadgeHTML,
        getAllBadgesHTML,
        getSummaryHTML,

        // Constants (for external use)
        THRESHOLDS,
        BADGE_CONFIG,
        TOTAL_FACES
    };

    // Export to window
    global.FaceQualityBadge = FaceQualityBadge;

    console.log('🏷️ FaceQualityBadge v1.0.0 loaded');

})(typeof window !== 'undefined' ? window : this);
