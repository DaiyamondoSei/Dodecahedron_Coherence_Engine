/**
 * ========================================
 * MODULE: shadow-panel.js
 * ========================================
 *
 * SHADOW PANEL - The Conscience of the Organization
 *
 * Displays "Shadow Alerts" - hidden patterns, hypocrisies, and systemic risks.
 * Located in the bottom-right, distinct from the main dashboard.
 *
 * DESIGN PHILOSOPHY:
 * - "Dark Mode" aesthetic (Red/Black) - shadows are uncomfortable truths
 * - Slide-in animations for new alerts
 * - Interactive: Clicking an alert rotates the 3D camera to the affected area
 * - Dual-form: Each shadow has both "suppressed" and "integrated" (gift) views
 *
 * DEPENDENCIES:
 * - js/advanced/shadow-detector.js (provides shadow analysis data)
 * - js/ai/ai-shadow-adapter.js (optional, for AI-generated insights)
 * - window.Quannex, window.MappingContext (for face name resolution)
 *
 * EXPORTS:
 * - ShadowPanel (class)
 *
 * ========================================
 * NOTES FOR FUTURE CLAUDE
 * ========================================
 *
 * 1. THE 6 SHADOW ARCHETYPES:
 *    These come from shadow-detector.js, but displayed here:
 *    - Brittle Profit: Financial success without sustainability
 *    - Extractive Growth: Market success draining human capital
 *    - Siloed Excellence: Operations without cross-pollination
 *    - Innovation Theater: Creative claims without substance
 *    - Cult of Personality: Brand built on reputation, not values
 *    - Scattered Purpose: Values without operational alignment
 *
 * 2. DUAL-FORM TOGGLE (Key UX Feature):
 *    Each shadow card has two views:
 *    - "The Shadow" (suppressed): What's going wrong
 *    - "The Gift" (integrated): How to transform it
 *    Toggle button switches between views - helps reframe problems as opportunities.
 *
 * 3. SEVERITY LEVELS & COLORS:
 *    - critical: #ff4444 (bright red)
 *    - high: #ff8c00 (orange)
 *    - moderate: #ffcc00 (yellow)
 *    - low: #88cc88 (soft green)
 *
 * 4. EXPANDABLE DETAILS:
 *    Each card has a "▼" button that reveals:
 *    - Logic: Why this shadow was detected
 *    - Impacted Faces: Which faces are involved (clickable chips)
 *    - Prescription: Recommended actions
 *    - Metrics: Intensity score and coherence penalty
 *
 * 5. FACE CHIP INTERACTIONS:
 *    Clicking a face chip dispatches 'focus-face' event:
 *    window.dispatchEvent(new CustomEvent('focus-face', { detail: { faceId } }))
 *    This rotates the 3D dodecahedron to show that face.
 *
 * 6. AI ENHANCEMENT OPTION:
 *    Available for ALL users (Agent Council - December 2024):
 *    - Shows "Generate AI Analysis" button regardless of setup path
 *    - Calls window.AIShadowAdapter.generateAIShadowPatterns()
 *    - Adds AI-generated insights alongside pattern-based shadows
 *    - In demo mode, returns cached insights (no API calls)
 *
 * 7. FACE NAME RESOLUTION (Priority Order):
 *    1. MappingContext.getInstance().getFace(id).customName
 *    2. window.Quannex.getState().faces.find().customName
 *    3. Default face names (hardcoded fallback)
 *
 * 8. ACCESSIBILITY (ARIA):
 *    - role="article" on cards
 *    - aria-label describing pattern and severity
 *    - aria-pressed on toggle buttons
 *    - aria-expanded on details buttons
 *    - tabindex="0" for keyboard navigation
 *    - Enter/Space key handlers
 *
 * 9. CSS CLASS CONVENTION:
 *    Uses "shadow-card-mini" (not "shadow-card") to avoid CSS conflicts
 *    with shadow-overlay.css which uses the same class name.
 *
 * 10. INTEGRATION WITH 3D VIZ:
 *     focusOnShadow() dispatches 'focus-face' event
 *     The 3D visualizer (dodecahedron-viz.js) listens for this
 *     and rotates the camera to show the affected face.
 *
 * 11. TOAST QUEUE SYSTEM (Agent Council - December 2024):
 *     Philosophy: One toast at a time, prioritized by severity
 *     - Shadows sorted: critical > high > moderate > low
 *     - Auto-dismiss after 10 seconds (configurable via DISPLAY_DURATION)
 *     - Hover pauses countdown (visual via progress bar)
 *     - Queue indicator shows "+N more" when queue has items
 *     - Click opens full modal with focusOnShadow()
 *
 *     State properties:
 *     - this.queue: Array of pending shadows
 *     - this.currentToast: Currently displayed shadow
 *     - this.autoDismissTimer: setTimeout reference
 *     - this.isPaused: Whether hover has paused countdown
 *
 * 12. DEMO MODE (Per Chief Risk Manager):
 *     Enable via: localStorage.setItem('quannexDemoMode', 'true')
 *     Behavior:
 *     - Auto-dismiss is DISABLED (shadows stay until manual dismiss)
 *     - AI adapter returns cached insights (no API calls)
 *     - Essential for thesis defense reliability
 *
 * 13. LIFECYCLE MANAGEMENT:
 *     CRITICAL: Call destroy() on page unload!
 *     - Clears autoDismissTimer
 *     - Empties queue
 *     - Removes container content
 *
 * USED BY:
 * - dodecahedron-3d.html (bottom-right panel)
 * - Main dashboard views
 *
 * GOTCHAS:
 * - Container auto-creates if not found (appended to document.body)
 * - update() with empty array clears panel but shows AI option
 * - shadow.faceId can be single ID or array (involvedFaces)
 *
 * ========================================
 *
 * @module js/ui/shadow-panel
 * @author Deimantas Butrimas & Claude
 * @version 2.1 - Enhanced UI with expandable details
 * @version 2.2 - Sprint 7: AI enhancement deprecated, moved to shadow overlay toggle
 */

export class ShadowPanel {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.warn(`ShadowPanel container '${containerId}' not found. Creating one.`);
            this.container = document.createElement('div');
            this.container.id = containerId;
            this.container.className = 'shadow-panel-container';
            document.body.appendChild(this.container);
        }

        this.activeShadows = new Set();

        // ════════════════════════════════════════════════════════════════════
        // QUEUE MANAGEMENT (per Agent Council - December 2024)
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
    }

    /**
     * Get face name from MappingContext or Quannex state
     * @param {number} faceId - Face ID
     * @returns {string} Face name or fallback
     */
    getFaceName(faceId) {
        // Try MappingContext first
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
        const defaultFaceNames = {
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

        return defaultFaceNames[faceId] || `Face ${faceId}`;
    }

    /**
     * Update the panel with new shadow analysis using single-toast queue.
     * Per Agent Council: One toast at a time, prioritized by severity.
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
        const priorityOrder = { critical: 0, high: 1, moderate: 2, low: 3 };
        this.queue = [...shadows].sort((a, b) =>
            (priorityOrder[(a.severity || 'moderate').toLowerCase()] || 3) -
            (priorityOrder[(b.severity || 'moderate').toLowerCase()] || 3)
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
     * Per HeartMath: Uses invitational language, not alerting.
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

        // Add progress bar
        const progressBar = document.createElement('div');
        progressBar.className = 'toast-progress-bar';
        card.appendChild(progressBar);

        // Pause on hover (per HeartMath: respect user attention)
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
            this.container.appendChild(indicator);
        }
    }

    /**
     * Cleanup resources. CRITICAL: Call on page unload.
     * Per Agent Council: Lifecycle management prevents memory leaks.
     */
    destroy() {
        this.clearAutoDismiss();
        this.queue = [];
        this.currentToast = null;
        this.activeShadows.clear();
        this.container.innerHTML = '';
        console.log('[ShadowPanel] 🌙 Destroyed - resources cleaned up');
    }

    // ════════════════════════════════════════════════════════════════════════
    // DEPRECATED: AI ENHANCEMENT OPTION
    // ════════════════════════════════════════════════════════════════════════
    //
    // Sprint 7 (December 2025): AI generation moved to modal overlay toggle.
    // The toast panel now focuses purely on shadow display, not generation.
    // Users can access AI shadows via the elegant toggle in the shadow overlay.
    //
    // Legacy method kept as no-op for backward compatibility.
    // ════════════════════════════════════════════════════════════════════════

    /**
     * @deprecated Sprint 7: AI generation moved to shadow overlay toggle
     * This method is now a no-op. AI shadows are generated via the
     * ShadowSourceToggle component in the shadow overlay modal.
     */
    renderAIEnhanceOption() {
        // No-op: AI enhancement now handled by shadow overlay toggle
        // Sprint 7: Users access AI via the elegant toggle in the modal
        console.log('[ShadowPanel] AI enhancement now available via shadow overlay toggle');
    }

    /**
     * @deprecated Sprint 7: AI generation moved to shadow overlay toggle
     */
    setupAIEnhanceButton() {
        // No-op: Preserved for backward compatibility
    }

    /**
     * Sprint 4 Task 27: Create shadow card with dual-form toggle
     * Shows both suppressed (shadow) and integrated (gift) perspectives
     * Phase 3 Enhanced: Expandable details, face chips, severity badge, penalty display
     */
    createShadowCard(shadow) {
        const card = document.createElement('div');
        // Using shadow-card-mini to avoid CSS conflict with shadow-overlay.css
        card.className = `shadow-card-mini severity-${(shadow.severity || 'moderate').toLowerCase()}`;
        card.setAttribute('data-shadow-id', shadow.id || shadow.name);

        // ACCESSIBILITY: ARIA attributes for screen readers
        card.setAttribute('role', 'article');
        card.setAttribute('aria-label', `Shadow pattern: ${shadow.name || 'Unknown'}, severity: ${shadow.severity || 'moderate'}`);
        card.setAttribute('tabindex', '0');  // Make focusable for keyboard navigation

        // Icon based on severity
        const severityLower = (shadow.severity || 'moderate').toLowerCase();
        const icon = severityLower === 'critical' || severityLower === 'high' ? '⚠️' : '👁️';

        // Severity badge color
        const severityColors = {
            critical: '#ff4444',
            high: '#ff8c00',
            moderate: '#ffcc00',
            low: '#88cc88'
        };
        const severityColor = severityColors[severityLower] || severityColors.moderate;

        // Extract suppressed and integrated forms (from mapping-context pattern)
        const suppressedForm = shadow.suppressed || shadow.description || 'Shadow pattern detected';
        const integratedForm = shadow.integrated || shadow.gift || 'Integrated wisdom awaits discovery';
        const prescription = shadow.prescription || shadow.recommendation || '';
        const logic = shadow.logic || '';

        // Build face chips HTML
        const involvedFaces = shadow.involvedFaces || (shadow.faceId ? [shadow.faceId] : []);
        const faceChipsHtml = involvedFaces.map(faceId => {
            const faceName = this.getFaceName(faceId);
            return `<span class="face-chip" data-face-id="${faceId}" title="Face ${faceId}: ${faceName}">${faceName}</span>`;
        }).join('');

        // Penalty display
        const penaltyHtml = shadow.penalty ?
            `<span class="shadow-penalty">Impact: -${(shadow.penalty * 100).toFixed(0)}%</span>` : '';

        card.innerHTML = `
            <div class="shadow-header">
                <span class="shadow-icon">${icon}</span>
                <span class="shadow-title">${shadow.name || 'Unknown Pattern'}</span>
                <span class="shadow-severity-badge" style="background: ${severityColor};">${shadow.severity || 'moderate'}</span>
                <button class="toggle-perspective" title="See the Gift">🔄 Gift</button>
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
                        <div class="face-chips">${faceChipsHtml}</div>
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

        // Toggle button functionality
        const toggleBtn = card.querySelector('.toggle-perspective');
        const suppressedDiv = card.querySelector('.shadow-suppressed');
        const integratedDiv = card.querySelector('.shadow-integrated');

        // ACCESSIBILITY: Toggle button attributes
        toggleBtn.setAttribute('aria-pressed', 'false');
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
            chip.addEventListener('click', (e) => {
                e.stopPropagation();
                const faceId = parseInt(chip.getAttribute('data-face-id'), 10);
                if (faceId) {
                    const event = new CustomEvent('focus-face', { detail: { faceId } });
                    window.dispatchEvent(event);
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
                // Don't trigger if toggle buttons are focused
                if (e.target !== toggleBtn && e.target !== detailsBtn) {
                    e.preventDefault();
                    this.focusOnShadow(shadow);
                }
            }
        });

        return card;
    }

    focusOnShadow(shadow) {
        console.log(`Focusing on shadow: ${shadow.name} at Face ${shadow.faceId}`);

        // Rotate camera to face
        if (window.dodecahedronViz && window.dodecahedronViz.camera) {
            // We need a helper to rotate to face. 
            // dodecahedron-viz.js has 'rotateToFace' but it might not be exposed directly.
            // But we have 'faceMeshes'.

            // Dispatch event for the main viz to handle
            const event = new CustomEvent('focus-face', { detail: { faceId: shadow.faceId } });
            window.dispatchEvent(event);
        }
    }
}
