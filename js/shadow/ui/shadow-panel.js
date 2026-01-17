/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                            ║
 * ║   SHADOW PANEL - The Conscience of the Organization                       ║
 * ║   "Toast notifications that honor both shadow and gift"                   ║
 * ║                                                                            ║
 * ║   Location: js/shadow/ui/shadow-panel.js                                  ║
 * ║   Updated: December 2025 - Unified Shadow Module                          ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * NOTES FOR FUTURE CLAUDE
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Welcome, future me. This module displays shadow patterns as toast notifications
 * in a single-toast queue system. Each shadow has dual forms:
 * - "Suppressed" (the challenge) - What's going wrong
 * - "Integrated" (the gift) - How to transform it
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * NAVIGATION MAP - How This Module Connects
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * UPSTREAM (Data Sources):
 * ├── js/shadow/constants/shadow-harmonics.js → SEVERITY_COLORS, SEVERITY_ICONS
 * ├── js/shadow/detection/shadow-detector.js  → Provides shadow analysis data
 * ├── js/shadow/adaptation/ai-shadow-adapter.js → AI-generated insights
 * └── window.MappingContext / window.Quannex → Face name resolution
 *
 * DOWNSTREAM (Consumers):
 * ├── pages/dodecahedron-3d.html → Imports and instantiates ShadowPanel
 * └── js/dodec/dodec-shadow-overlay.js → May interact for full overlay view
 *
 * EVENTS DISPATCHED:
 * └── 'focus-face' → { detail: { faceId } } - Rotates 3D camera to face
 *
 * EVENTS LISTENED:
 * └── None (passive display component)
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * THE 6 SHADOW ARCHETYPES (from shadow-harmonics.js)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * TIER 1 - Human Capital Harm (PHI^-2 = 0.382 penalty):
 *   • burnoutEngine: High output, exhausted humanity
 *
 * TIER 2 - Systemic Fragility (PHI^-3 = 0.236 penalty):
 *   • brittleProfit: Financial success without sustainability
 *   • extractiveGrowth: Market success draining human capital
 *   • lonelyHero: Leadership without distributed strength
 *
 * TIER 3 - Integrity Erosion (PHI^-4 = 0.146 penalty):
 *   • experienceGap: Vision without grounded practice
 *   • hollowGovernance: Structure without substance
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SEVERITY SYSTEM (Enhanced for Accessibility)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Each severity level now has BOTH color AND icon (colorblind-friendly):
 *
 * | Severity | Color   | Icon | Meaning                           |
 * |----------|---------|------|-----------------------------------|
 * | critical | #ff4444 | ⛔   | Immediate attention required      |
 * | high     | #ff8c00 | ⚠️   | Significant concern               |
 * | moderate | #ffcc00 | 👁️   | Monitor and address               |
 * | low      | #88cc88 | 💡   | Awareness opportunity             |
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * TOAST QUEUE SYSTEM
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Philosophy: One toast at a time, prioritized by severity
 *
 * - Shadows sorted: critical > high > moderate > low
 * - Auto-dismiss after 10 seconds (DISPLAY_DURATION)
 * - Hover pauses countdown (visual via progress bar)
 * - Queue indicator shows "+N more" when queue has items
 * - Click opens full modal with focusOnShadow()
 *
 * State Properties:
 * - this.queue: Array of pending shadows
 * - this.currentToast: Currently displayed shadow
 * - this.autoDismissTimer: setTimeout reference
 * - this.isPaused: Whether hover has paused countdown
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * DUAL-FORM TOGGLE (Key UX Feature)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Each shadow card has two views:
 * - "The Shadow" (suppressed): What's going wrong - default view
 * - "The Gift" (integrated): How to transform it - toggle view
 *
 * Toggle button switches between views - helps reframe problems as opportunities.
 * This is the Jungian principle: shadows contain gifts when integrated.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * FACE CHIP INTERACTIONS
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Clicking a face chip dispatches 'focus-face' event:
 *   window.dispatchEvent(new CustomEvent('focus-face', { detail: { faceId } }))
 *
 * This rotates the 3D dodecahedron camera to show that face.
 * Each chip has aria-label for screen readers.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * DEMO MODE
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Enable: localStorage.setItem('quannexDemoMode', 'true')
 *
 * Behavior:
 * - Auto-dismiss is DISABLED (shadows stay until manual dismiss)
 * - AI adapter returns cached insights (no API calls)
 * - Essential for thesis defense reliability
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * LIFECYCLE MANAGEMENT
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * CRITICAL: Call destroy() on page unload!
 * - Clears autoDismissTimer
 * - Empties queue
 * - Removes container content
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ACCESSIBILITY (WCAG 2.1 AA)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * - Severity icons (not just colors) for colorblind users
 * - role="article" on cards
 * - aria-label describing pattern and severity
 * - aria-pressed on toggle buttons
 * - aria-expanded on details buttons
 * - tabindex="0" for keyboard navigation
 * - Enter/Space key handlers
 * - Face chips have aria-label with face name
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * @module js/shadow/ui/shadow-panel
 * @author Deimantas & Claude
 * @version 3.0 - Unified Shadow Module with Accessibility Enhancements
 */

// ════════════════════════════════════════════════════════════════════════════
// CONSTANTS - Import from ShadowHarmonics or use fallbacks
// ════════════════════════════════════════════════════════════════════════════

// Try to get constants from ShadowHarmonics (Single Source of Truth)
const _SH = (typeof window !== 'undefined' && window.ShadowHarmonics) || {};

/**
 * Severity colors - from ShadowHarmonics or fallback
 * Used for badge backgrounds and visual indicators
 */
const SEVERITY_COLORS = _SH.SEVERITY_COLORS || {
    critical: '#ff4444',
    high: '#ff8c00',
    moderate: '#ffcc00',
    low: '#88cc88'
};

/**
 * Severity icons - from ShadowHarmonics or fallback
 * ACCESSIBILITY: Icons provide non-color distinction for colorblind users
 */
const SEVERITY_ICONS = _SH.SEVERITY_ICONS || {
    critical: '⛔',   // Stop sign - immediate attention
    high: '⚠️',       // Warning - significant concern
    moderate: '👁️',   // Eye - monitor and address
    low: '💡'         // Light bulb - awareness opportunity
};

/**
 * Priority order for sorting shadows
 */
const PRIORITY_ORDER = { critical: 0, high: 1, moderate: 2, low: 3 };

// ════════════════════════════════════════════════════════════════════════════
// DEFAULT FACE NAMES - Fallback when MappingContext/Quannex unavailable
// ════════════════════════════════════════════════════════════════════════════

const DEFAULT_FACE_NAMES = {
    1: 'Financial Capital',
    2: 'Intellectual Capital',
    3: 'Human Capital',
    4: 'Structural Capital',
    5: 'Market Resonance',
    6: 'Community & Partners',
    7: 'Brand & Reputation',
    8: 'Core Operations',
    9: 'Regenerative Flow',
    10: 'Foundational Values',
    11: 'Funding Pipeline',
    12: 'Risk & Resilience'
};

// ════════════════════════════════════════════════════════════════════════════
// SHADOW PANEL CLASS
// ════════════════════════════════════════════════════════════════════════════

export class ShadowPanel {
    /**
     * Create a ShadowPanel instance
     * @param {string} containerId - ID of the container element
     */
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            if (window.Logger) window.Logger.warn('ShadowPanel', `Container '${containerId}' not found. Creating one.`);
            else console.warn(`[ShadowPanel] Container '${containerId}' not found. Creating one.`);
            this.container = document.createElement('div');
            this.container.id = containerId;
            this.container.className = 'shadow-panel-container';
            document.body.appendChild(this.container);
        }

        this.activeShadows = new Set();

        // ════════════════════════════════════════════════════════════════════
        // QUEUE MANAGEMENT
        // Single toast queue: One shadow at a time, prioritized by severity
        // ════════════════════════════════════════════════════════════════════
        this.queue = [];
        this.currentToast = null;
        this.autoDismissTimer = null;
        this.isPaused = false;
        this.DISPLAY_DURATION = 10000;  // 10 seconds per toast

        // Demo mode: Disables auto-dismiss for controlled presentations
        // Enable: localStorage.setItem('quannexDemoMode', 'true')
        this.demoMode = localStorage.getItem('quannexDemoMode') === 'true';

        if (window.Logger) window.Logger.info('ShadowPanel', '🌑 Initialized (v3.0 - Unified Shadow Module)');
        else console.log('[ShadowPanel] 🌑 Initialized (v3.0 - Unified Shadow Module)');
    }

    /**
     * Get face name from MappingContext or Quannex state
     * @param {number} faceId - Face ID (1-12)
     * @returns {string} Face name or fallback
     */
    getFaceName(faceId) {
        // Try MappingContext first (highest priority)
        if (window.MappingContext) {
            try {
                const ctx = window.MappingContext.getInstance();
                const face = ctx.getFace?.(faceId);
                if (face?.customName || face?.name) {
                    return face.customName || face.name;
                }
            } catch (e) { /* MappingContext not ready */ }
        }

        // Try Quannex state
        if (window.Quannex) {
            try {
                const state = window.Quannex.getState();
                const face = state?.faces?.find(f => f.id === faceId);
                if (face?.customName || face?.name || face?.baseName) {
                    return face.customName || face.name || face.baseName;
                }
            } catch (e) { /* Quannex not ready */ }
        }

        // Fallback to default face names
        return DEFAULT_FACE_NAMES[faceId] || `Face ${faceId}`;
    }

    /**
     * Update the panel with new shadow analysis using single-toast queue.
     * Shadows are sorted by severity: critical > high > moderate > low
     *
     * @param {Array} shadows - Array of shadow objects from ShadowDetector
     */
    update(shadows) {
        if (!shadows || !Array.isArray(shadows)) return;

        // Clear if empty
        if (shadows.length === 0) {
            this.queue = [];
            this.currentToast = null;
            this.clearAutoDismiss();
            this.container.innerHTML = '';
            this.activeShadows.clear();
            // Still show AI option for empty state
            this.renderAIEnhanceOption();
            return;
        }

        // Sort by severity: critical > high > moderate > low
        this.queue = [...shadows].sort((a, b) =>
            (PRIORITY_ORDER[(a.severity || 'moderate').toLowerCase()] || 3) -
            (PRIORITY_ORDER[(b.severity || 'moderate').toLowerCase()] || 3)
        );

        // Update active set for tracking
        this.activeShadows = new Set(shadows.map(s => (s.id || s.name) + s.faceId));

        // Show first toast if nothing is currently displayed
        if (!this.currentToast && this.queue.length > 0) {
            this.showNextToast();
        } else {
            // Just update the queue indicator if already showing
            this.updateQueueIndicator();
        }
    }

    /**
     * Display the next shadow toast from the queue.
     */
    showNextToast() {
        if (this.queue.length === 0) {
            this.container.innerHTML = '';
            this.currentToast = null;
            // Show AI option when queue is empty
            this.renderAIEnhanceOption();
            return;
        }

        this.currentToast = this.queue.shift();
        this.container.innerHTML = '';
        const card = this.createShadowCard(this.currentToast);

        // Add dismiss button (appears on hover)
        const dismissBtn = document.createElement('button');
        dismissBtn.className = 'toast-dismiss-btn';
        dismissBtn.innerHTML = '&times;';
        dismissBtn.title = 'Dismiss this insight';
        dismissBtn.setAttribute('aria-label', 'Dismiss this shadow insight');
        dismissBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.dismissCurrent();
        });
        card.appendChild(dismissBtn);

        // Add progress bar for auto-dismiss visualization
        const progressBar = document.createElement('div');
        progressBar.className = 'toast-progress-bar';
        card.appendChild(progressBar);

        // Pause on hover (respect user attention)
        card.addEventListener('mouseenter', () => this.pauseAutoDismiss());
        card.addEventListener('mouseleave', () => this.resumeAutoDismiss());

        // Click opens modal with focus (if overlay controller available)
        card.addEventListener('click', () => {
            if (window.shadowOverlayController) {
                window.shadowOverlayController.open();
                window.shadowOverlayController.focusOnShadow?.(this.currentToast);
            } else {
                this.focusOnShadow(this.currentToast);
            }
        });

        this.container.appendChild(card);

        // Start auto-dismiss unless in demo mode
        if (!this.demoMode) {
            this.startAutoDismiss();
        }
        this.updateQueueIndicator();
    }

    /**
     * Start the auto-dismiss timer for the current toast.
     */
    startAutoDismiss() {
        this.clearAutoDismiss();
        this.autoDismissTimer = setTimeout(() => {
            if (!this.isPaused) this.dismissCurrent();
        }, this.DISPLAY_DURATION);
    }

    /**
     * Clear the auto-dismiss timer.
     */
    clearAutoDismiss() {
        if (this.autoDismissTimer) {
            clearTimeout(this.autoDismissTimer);
            this.autoDismissTimer = null;
        }
    }

    /**
     * Pause auto-dismiss (called on hover).
     */
    pauseAutoDismiss() {
        this.isPaused = true;
    }

    /**
     * Resume auto-dismiss after hover ends.
     */
    resumeAutoDismiss() {
        this.isPaused = false;
        if (!this.demoMode) {
            this.startAutoDismiss();
        }
    }

    /**
     * Dismiss the current toast and show the next one.
     */
    dismissCurrent() {
        this.clearAutoDismiss();
        this.currentToast = null;
        this.showNextToast();
    }

    /**
     * Update the queue indicator showing remaining shadows.
     */
    updateQueueIndicator() {
        // Remove existing indicator
        const existing = this.container.querySelector('.queue-indicator');
        if (existing) existing.remove();

        // Add new indicator if queue has items
        if (this.queue.length > 0) {
            const indicator = document.createElement('div');
            indicator.className = 'queue-indicator';
            indicator.textContent = `+${this.queue.length} more`;
            indicator.title = `${this.queue.length} more integration opportunities`;
            indicator.setAttribute('aria-label', `${this.queue.length} more shadow patterns in queue`);
            this.container.appendChild(indicator);
        }
    }

    /**
     * Cleanup resources. CRITICAL: Call on page unload.
     */
    destroy() {
        this.clearAutoDismiss();
        this.queue = [];
        this.currentToast = null;
        this.activeShadows.clear();
        this.container.innerHTML = '';
        if (window.Logger) window.Logger.info('ShadowPanel', '🌙 Destroyed - resources cleaned up');
        else console.log('[ShadowPanel] 🌙 Destroyed - resources cleaned up');
    }

    // ════════════════════════════════════════════════════════════════════════
    // DEPRECATED: AI ENHANCEMENT OPTION
    // ════════════════════════════════════════════════════════════════════════
    //
    // Sprint 7 (December 2025): AI generation moved to shadow overlay toggle.
    // The toast panel now focuses purely on shadow display, not generation.
    // Users can access AI shadows via the elegant toggle in the shadow overlay.
    //
    // Legacy methods kept as no-ops for backward compatibility.
    // ════════════════════════════════════════════════════════════════════════

    /**
     * @deprecated Sprint 7: AI generation moved to shadow overlay toggle
     * This method is now a no-op. AI shadows are generated via the
     * ShadowSourceToggle component in the shadow overlay modal.
     */
    renderAIEnhanceOption() {
        // No-op: AI enhancement now handled by shadow overlay toggle
        if (window.Logger) window.Logger.info('ShadowPanel', 'AI enhancement now available via shadow overlay toggle');
        else console.log('[ShadowPanel] AI enhancement now available via shadow overlay toggle');
    }

    /**
     * @deprecated Sprint 7: AI generation moved to shadow overlay toggle
     */
    setupAIEnhanceButton() {
        // No-op: Preserved for backward compatibility
    }

    /**
     * Create shadow card with dual-form toggle
     * Shows both suppressed (shadow) and integrated (gift) perspectives
     *
     * ACCESSIBILITY ENHANCEMENTS (v3.0):
     * - Severity icons alongside colors (colorblind-friendly)
     * - Enhanced aria-labels on face chips
     * - Keyboard navigation support
     *
     * @param {Object} shadow - Shadow pattern object
     * @returns {HTMLElement} Card element
     */
    createShadowCard(shadow) {
        const card = document.createElement('div');
        // Using shadow-card-mini to avoid CSS conflict with shadow-overlay.css
        const severityLower = (shadow.severity || 'moderate').toLowerCase();
        card.className = `shadow-card-mini severity-${severityLower}`;
        card.setAttribute('data-shadow-id', shadow.id || shadow.name);

        // ACCESSIBILITY: ARIA attributes for screen readers
        const severityIcon = SEVERITY_ICONS[severityLower] || SEVERITY_ICONS.moderate;
        card.setAttribute('role', 'article');
        card.setAttribute('aria-label', `${severityIcon} Shadow pattern: ${shadow.name || 'Unknown'}, severity: ${shadow.severity || 'moderate'}`);
        card.setAttribute('tabindex', '0');  // Make focusable for keyboard navigation

        // Get severity color and icon
        const severityColor = SEVERITY_COLORS[severityLower] || SEVERITY_COLORS.moderate;

        // Extract suppressed and integrated forms
        const suppressedForm = shadow.suppressed || shadow.description || 'Shadow pattern detected';
        const integratedForm = shadow.integrated || shadow.gift || 'Integrated wisdom awaits discovery';
        const prescription = shadow.prescription || shadow.recommendation || '';
        const logic = shadow.logic || '';

        // Build face chips HTML with enhanced accessibility
        const involvedFaces = shadow.involvedFaces || (shadow.faceId ? [shadow.faceId] : []);
        const faceChipsHtml = involvedFaces.map(faceId => {
            const faceName = this.getFaceName(faceId);
            return `<span class="face-chip"
                         data-face-id="${faceId}"
                         title="Click to focus on Face ${faceId}: ${faceName}"
                         role="button"
                         tabindex="0"
                         aria-label="Focus camera on ${faceName} (Face ${faceId})">${faceName}</span>`;
        }).join('');

        // Penalty display
        const penaltyHtml = shadow.penalty ?
            `<span class="shadow-penalty">Impact: -${(shadow.penalty * 100).toFixed(0)}%</span>` : '';

        card.innerHTML = `
            <div class="shadow-header">
                <span class="shadow-icon" aria-hidden="true">${severityIcon}</span>
                <span class="shadow-title">${shadow.name || 'Unknown Pattern'}</span>
                <span class="shadow-severity-badge" style="background: ${severityColor};" aria-label="Severity: ${shadow.severity || 'moderate'}">
                    <span class="severity-icon" aria-hidden="true">${severityIcon}</span>
                    ${shadow.severity || 'moderate'}
                </span>
                <button class="toggle-perspective" title="See the Gift" aria-pressed="false">🔄 Gift</button>
                <button class="toggle-details" title="Show Details" aria-expanded="false">▼</button>
            </div>

            <div class="shadow-suppressed active">
                <div class="shadow-label">The Shadow:</div>
                <div class="shadow-message">${suppressedForm}</div>
            </div>

            <div class="shadow-integrated">
                <div class="shadow-label" style="color: #66ff99;">💡 The Gift:</div>
                <div class="shadow-message" style="color: rgba(102, 255, 153, 0.9);">${integratedForm}</div>
            </div>

            <div class="shadow-details">
                ${logic ? `
                    <div class="shadow-detail-section">
                        <span class="detail-label">🔍 Logic:</span>
                        <span class="detail-value">${logic}</span>
                    </div>
                ` : ''}

                ${involvedFaces.length > 0 ? `
                    <div class="shadow-detail-section">
                        <span class="detail-label">📍 Impacted Faces:</span>
                        <div class="face-chips" role="group" aria-label="Affected organizational faces">${faceChipsHtml}</div>
                    </div>
                ` : ''}

                ${prescription ? `
                    <div class="shadow-detail-section shadow-prescription-detail">
                        <span class="detail-label">💊 Prescription:</span>
                        <span class="detail-value prescription-text">${prescription}</span>
                    </div>
                ` : ''}

                ${shadow.score || shadow.penalty ? `
                    <div class="shadow-detail-section shadow-metrics">
                        ${shadow.score ? `<span class="shadow-intensity">Intensity: ${(shadow.score * 100).toFixed(0)}%</span>` : ''}
                        ${penaltyHtml}
                    </div>
                ` : ''}
            </div>

            <div class="shadow-meta">
                ${shadow.source ? `<span class="shadow-source">${shadow.source === 'ai' ? '🤖 AI' : '📊 Pattern'}</span>` : ''}
                ${shadow.score ? `<span class="shadow-score-mini">${(shadow.score * 100).toFixed(0)}%</span>` : ''}
            </div>
        `;

        // Setup toggle functionality
        this.setupCardInteractions(card, shadow);

        return card;
    }

    /**
     * Setup card interactions (toggle, details, face chips)
     * @param {HTMLElement} card - Card element
     * @param {Object} shadow - Shadow pattern object
     */
    setupCardInteractions(card, shadow) {
        // Toggle button functionality
        const toggleBtn = card.querySelector('.toggle-perspective');
        const suppressedDiv = card.querySelector('.shadow-suppressed');
        const integratedDiv = card.querySelector('.shadow-integrated');

        // ACCESSIBILITY: Toggle button attributes
        toggleBtn.setAttribute('aria-label', `Toggle between shadow and gift perspectives for ${shadow.name || 'this pattern'}`);

        const performToggle = () => {
            const isShowingShadow = suppressedDiv.classList.contains('active');

            if (isShowingShadow) {
                suppressedDiv.classList.remove('active');
                integratedDiv.classList.add('active');
                toggleBtn.textContent = '🔄 See Shadow';
                toggleBtn.setAttribute('aria-pressed', 'true');
                card.classList.add('showing-gift');
            } else {
                integratedDiv.classList.remove('active');
                suppressedDiv.classList.add('active');
                toggleBtn.textContent = '🔄 See Gift';
                toggleBtn.setAttribute('aria-pressed', 'false');
                card.classList.remove('showing-gift');
            }
        };

        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            performToggle();
        });

        // ACCESSIBILITY: Keyboard support for toggle button
        toggleBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                performToggle();
            }
        });

        // Toggle details functionality (expandable section)
        const detailsBtn = card.querySelector('.toggle-details');
        const detailsDiv = card.querySelector('.shadow-details');

        if (detailsBtn && detailsDiv) {
            // ACCESSIBILITY: Details button attributes
            detailsBtn.setAttribute('aria-label', `Expand details for ${shadow.name || 'this pattern'}`);

            const performDetailsToggle = () => {
                const isExpanded = detailsDiv.classList.contains('expanded');

                if (isExpanded) {
                    detailsDiv.classList.remove('expanded');
                    detailsBtn.textContent = '▼';
                    detailsBtn.setAttribute('aria-expanded', 'false');
                    detailsBtn.setAttribute('title', 'Show Details');
                } else {
                    detailsDiv.classList.add('expanded');
                    detailsBtn.textContent = '▲';
                    detailsBtn.setAttribute('aria-expanded', 'true');
                    detailsBtn.setAttribute('title', 'Hide Details');
                }
            };

            detailsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                performDetailsToggle();
            });

            // ACCESSIBILITY: Keyboard support for details button
            detailsBtn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    performDetailsToggle();
                }
            });
        }

        // Face chip click handlers - focus on that specific face
        const faceChips = card.querySelectorAll('.face-chip');
        faceChips.forEach(chip => {
            const handleFaceChipClick = (e) => {
                e.stopPropagation();
                const faceId = parseInt(chip.getAttribute('data-face-id'), 10);
                if (faceId) {
                    const event = new CustomEvent('focus-face', { detail: { faceId } });
                    window.dispatchEvent(event);
                    if (window.Logger) window.Logger.debug('ShadowPanel', `🎯 Focusing on Face ${faceId}`);
                    else console.log(`[ShadowPanel] 🎯 Focusing on Face ${faceId}`);
                }
            };

            chip.addEventListener('click', handleFaceChipClick);

            // ACCESSIBILITY: Keyboard support for face chips
            chip.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleFaceChipClick(e);
                }
            });
        });

        // Click interaction to focus on 3D face
        card.addEventListener('click', () => {
            this.focusOnShadow(shadow);
        });

        // ACCESSIBILITY: Keyboard support for card (Enter/Space to focus on face)
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                // Don't trigger if interactive elements are focused
                if (!e.target.classList.contains('toggle-perspective') &&
                    !e.target.classList.contains('toggle-details') &&
                    !e.target.classList.contains('face-chip')) {
                    e.preventDefault();
                    this.focusOnShadow(shadow);
                }
            }
        });
    }

    /**
     * Focus on a shadow in the 3D visualization
     * @param {Object} shadow - Shadow pattern object
     */
    focusOnShadow(shadow) {
        if (window.Logger) window.Logger.debug('ShadowPanel', `🎯 Focusing on shadow: ${shadow.name} at Face ${shadow.faceId}`);
        else console.log(`[ShadowPanel] 🎯 Focusing on shadow: ${shadow.name} at Face ${shadow.faceId}`);

        // Dispatch event for the main viz to handle
        const event = new CustomEvent('focus-face', { detail: { faceId: shadow.faceId } });
        window.dispatchEvent(event);
    }
}
