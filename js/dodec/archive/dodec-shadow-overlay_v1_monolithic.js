/**
 * ════════════════════════════════════════════════════════════════════════════
 * MODULE: dodec-shadow-overlay.js
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Created for: dodecahedron-3d.html modularization (Phase 3)
 * Date: December 17, 2025
 *
 * @module dodec-shadow-overlay
 * @author Deimantas & Claude (Co-created with consciousness and love)
 * @version 1.0.0 - Initial extraction from dodecahedron-3d.html
 * @version 1.1.0 - Sprint 6: Shadow Source Toggle (December 2025)
 * @version 1.2.0 - Sprint 7: UX Redesign - Elegant Toggle Switch (December 2025)
 *
 * PURPOSE:
 * Shadow Overlay Controller - Progressive Disclosure System for organizational
 * "shadow patterns" (hidden tensions, suppressed dynamics). This integrates
 * shadow awareness into the coherence HUD with elegant reveal mechanics.
 *
 * FEATURES:
 * - Shadow indicator in coherence HUD (pulsing when shadows detected)
 * - Full-screen overlay for detailed shadow card viewing
 * - Shadow/Gift toggle (shadow = tension, gift = integrated wisdom)
 * - AI-powered shadow pattern generation via Gemini/OpenAI
 * - Click-to-focus: clicking a shadow card focuses the 3D view on that face
 *
 * DEPENDENCIES:
 * - HTML elements: #coherenceHud, #shadowIndicator, #shadowCount,
 *   #openShadowOverlay, #shadowOverlay, #closeShadowOverlay, #shadowOverlayContent
 * - CSS: css/dodec/dodec-overlays.css (shadow-overlay styles)
 * - Optional: window.Quannex.getState() for face data
 * - Optional: window.getGeminiProvider, window.getOpenAIProvider for AI
 * - Optional: window.AIShadowAdapter for AI shadow generation
 *
 * EXPORTS (to window/global):
 * - window.shadowOverlayController: {
 *     open(), close(), toggle(),
 *     updateShadows(shadows, source), getShadows(), isOpen(),
 *     destroy(), getState(), focusOnShadow(shadow),  // Added Dec 2024
 *     setActiveSource(source), getTemplateCount(), getAICount()  // Sprint 6
 *   }
 *
 * HTML STRUCTURE EXPECTED:
 * <div class="coherence-hud" id="coherenceHud">
 *   <div class="coherence-shadow-indicator" id="shadowIndicator">
 *     <span id="shadowCount">0</span> Shadows
 *     <button id="openShadowOverlay">View All →</button>
 *   </div>
 * </div>
 * <div class="shadow-overlay" id="shadowOverlay">
 *   <div class="shadow-overlay-backdrop"></div>
 *   <div class="shadow-overlay-panel">
 *     <button id="closeShadowOverlay">×</button>
 *     <div id="shadowOverlayContent"></div>
 *   </div>
 * </div>
 *
 * NOTES FOR FUTURE CLAUDE:
 * ════════════════════════════════════════════════════════════════════════════
 * This module implements the "shadow work" concept from organizational psychology:
 *
 * 1. SHADOW PATTERNS:
 *    Each shadow has: { name, severity, suppressed, integrated, prescription,
 *                       faceId, involvedFaces, score }
 *    - suppressed: The hidden tension (the "shadow")
 *    - integrated: The wisdom gained when shadow is acknowledged (the "gift")
 *
 * 2. PROGRESSIVE DISCLOSURE:
 *    - Shadow count shown in HUD (subtle awareness)
 *    - Click "View All" for full overlay
 *    - Shadow/Gift toggle per card (psychological reframe)
 *
 * 3. AI INTEGRATION:
 *    - Supports Gemini and OpenAI providers
 *    - Uses AIShadowAdapter to generate contextual shadow patterns
 *    - API keys stored in localStorage (user's browser only)
 *
 * 4. KEYBOARD SHORTCUTS:
 *    - S: Toggle shadow overlay (when not typing)
 *    - ESC: Close overlay
 *
 * 5. EVENT INTEGRATION:
 *    - Listens for 'shadows-updated' custom event
 *    - Dispatches 'focus-face' event when clicking shadow cards
 *    - Hooks into window.shadowPanel if available
 *
 * 6. LIFECYCLE CRITICAL (Agent Council - December 2024):
 *    ⚠️ WARNING: Memory leak without destroy()!
 *    - syncIntervalId: 10-second interval for shadow sync
 *    - MUST call destroy() on page unload to clear interval
 *    - destroy() also closes overlay and clears shadow state
 *    Example: window.shadowOverlayController.destroy();
 *
 * 7. PERFORMANCE OPTIMIZATION:
 *    - shadowsEqual(): O(n) comparison replaces JSON.stringify
 *    - Only compares id and severity (sufficient for UI updates)
 *    - Prevents unnecessary re-renders on every sync cycle
 *
 * 8. NEW APIs (December 2024):
 *    - getState(): Returns { overlayOpen, currentShadows, selectedShadow,
 *                           shadowCount, syncIntervalActive, hasShadows }
 *    - focusOnShadow(shadow): Rotates 3D view to shadow's face
 *    - destroy(): Cleans up interval and closes overlay
 *
 * 9. AI AVAILABLE FOR ALL PATHS:
 *    - AI section now shown for ALL users (manual, AI-assisted, demo)
 *    - Demo mode (localStorage.quannexDemoMode) uses cached insights
 *
 * 10. SPRINT 6: SHADOW SOURCE TOGGLE (December 2025):
 *    ═══════════════════════════════════════════════════════════════════════
 *    Major enhancement: Users can now switch between two shadow sources:
 *
 *    a) SHADOW STATE OBJECT:
 *       shadowState = {
 *           templateShadows: [],       // From company templates (preserved)
 *           aiShadows: [],             // AI-generated (cached)
 *           activeSource: 'template',  // 'template' | 'ai'
 *           aiGenerationStatus: 'idle' // 'idle' | 'generating' | 'success' | 'error'
 *       }
 *
 *    b) DATA INTEGRITY GUARANTEES:
 *       - Template shadows NEVER overwritten by AI generation
 *       - Both sources persist to sessionStorage (survives refresh)
 *       - Switching sources is just a reference change - no data loss
 *       - AI failures gracefully fallback to template shadows
 *
 *    c) NEW UI ELEMENTS:
 *       - Source dropdown in overlay header (#shadowSourceSelect)
 *       - AI controls bar with persistent generate button (#generateAIShadowsBtn)
 *       - Status indicator for AI generation (#aiGenerationStatus)
 *
 *    d) NEW EVENTS:
 *       - 'shadow-source-changed': Dispatched when source switches
 *         detail: { source, shadows, templateCount, aiCount }
 *
 *    e) NEW APIs:
 *       - setActiveSource(source): Programmatic source switching
 *       - getTemplateCount(): Number of template shadows
 *       - getAICount(): Number of AI shadows
 *
 *    f) SESSIONSSTORAGE STRUCTURE (backward compatible):
 *       customCompanyData.shadowPatterns  // Legacy: active shadows
 *       customCompanyData.shadowSources   // New: { template, ai, activeSource }
 *    ═══════════════════════════════════════════════════════════════════════
 *
 * SHADOW CARD STRUCTURE:
 * <div class="shadow-card severity-{low|moderate|high|critical}">
 *   <div class="shadow-header">icon, title, toggle button</div>
 *   <div class="shadow-suppressed active">The Shadow</div>
 *   <div class="shadow-integrated">The Gift</div>
 *   <div class="shadow-prescription">Rx: recommendation</div>
 *   <div class="shadow-meta">location, intensity</div>
 * </div>
 *
 * ════════════════════════════════════════════════════════════════════════════
 */
(function(global) {
    'use strict';

    // ════════════════════════════════════════════════════════════════════════
    // DOM ELEMENTS
    // ════════════════════════════════════════════════════════════════════════

    const coherenceHud = document.getElementById('coherenceHud');
    const shadowIndicator = document.getElementById('shadowIndicator');
    const shadowCount = document.getElementById('shadowCount');
    const openShadowOverlayBtn = document.getElementById('openShadowOverlay');
    const shadowOverlay = document.getElementById('shadowOverlay');
    const closeShadowOverlayBtn = document.getElementById('closeShadowOverlay');
    const shadowOverlayContent = document.getElementById('shadowOverlayContent');
    const shadowOverlayBackdrop = shadowOverlay?.querySelector('.shadow-overlay-backdrop');

    // ════════════════════════════════════════════════════════════════════════
    // STATE
    // ════════════════════════════════════════════════════════════════════════

    let currentShadows = [];
    let overlayOpen = false;
    let syncIntervalId = null;  // LIFECYCLE: Track interval for cleanup
    let activeShadowId = null;  // Currently focused shadow (for getState)

    // ════════════════════════════════════════════════════════════════════════
    // SHADOW SOURCE STATE (Sprint 6 - Shadow System Enhancement)
    // ════════════════════════════════════════════════════════════════════════
    //
    // NOTES FOR FUTURE CLAUDE:
    // This state object manages two independent shadow sources:
    // 1. templateShadows - Predefined shadows from company templates (immutable)
    // 2. aiShadows - On-demand AI-generated shadows (cached)
    //
    // The activeSource determines which array is displayed. Users can switch
    // freely between sources without data loss. Both sources persist to
    // sessionStorage for page refresh survival.
    //
    // Key behaviors:
    // - Switching sources never mutates either array
    // - AI failures gracefully fall back to template shadows
    // - Source dropdown is disabled during AI generation
    // - The 'shadow-source-changed' event notifies other listeners
    //
    // ════════════════════════════════════════════════════════════════════════
    let shadowState = {
        templateShadows: [],       // Original shadows from company template (preserved)
        aiShadows: [],             // AI-generated shadows (cached between switches)
        activeSource: 'template',  // 'template' | 'ai' - which source is displayed
        aiGenerationStatus: 'idle' // 'idle' | 'generating' | 'success' | 'error'
    };

    // ════════════════════════════════════════════════════════════════════════
    // SHADOW DATA MANAGEMENT
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Update the shadow count and indicator visibility
     * Called whenever shadow patterns change
     *
     * Sprint 6 Enhancement: Now supports dual-source storage.
     * The optional 'source' parameter specifies where to store the shadows.
     * Default is 'template' for backward compatibility with existing callers.
     *
     * @param {Array} shadows - Array of shadow pattern objects
     * @param {string} source - 'template' | 'ai' (default: 'template')
     */
    function updateShadowIndicator(shadows, source = 'template') {
        const shadowArray = shadows || [];

        // Store in appropriate source bucket
        if (source === 'template') {
            shadowState.templateShadows = shadowArray;
        } else if (source === 'ai') {
            shadowState.aiShadows = shadowArray;
        }

        // CRITICAL: currentShadows always reflects the active source
        // This ensures all existing code that reads currentShadows continues to work
        currentShadows = shadowState.activeSource === 'template'
            ? shadowState.templateShadows
            : shadowState.aiShadows;

        const count = currentShadows.length;

        // Update count display
        if (shadowCount) {
            shadowCount.textContent = count;
        }

        // Update source dropdown count if it exists
        updateSourceDropdownCount();

        // Add/remove .has-shadows class for pulsing indicator
        if (coherenceHud) {
            if (count > 0) {
                coherenceHud.classList.add('has-shadows');
            } else {
                coherenceHud.classList.remove('has-shadows');
            }
        }

        console.log(`[ShadowOverlay] Updated indicator: ${count} shadows (source: ${source}, active: ${shadowState.activeSource})`);
    }

    /**
     * Update the source dropdown count badge
     * Shows count for the currently active source
     */
    function updateSourceDropdownCount() {
        const countSpan = document.getElementById('shadowSourceCount');
        if (countSpan) {
            countSpan.textContent = `(${currentShadows.length})`;
        }
    }

    /**
     * Render shadow cards into the overlay content area
     */
    function renderShadowCards() {
        if (!shadowOverlayContent) return;

        // Empty state - with AI enhance option for ALL paths
        // ════════════════════════════════════════════════════════════════════════
        // EMPTY STATE HANDLING
        // ════════════════════════════════════════════════════════════════════════
        //
        // Sprint 7 (December 2025): Simplified empty state UI.
        // AI generation is now handled by the toggle above - no inline buttons.
        // Users see a clean message directing them to use the toggle for AI.
        //
        // ════════════════════════════════════════════════════════════════════════
        if (currentShadows.length === 0) {
            const hasAIGenerated = shadowState.aiShadows.length > 0;

            shadowOverlayContent.innerHTML = `
                <div class="shadow-overlay-empty">
                    <div class="shadow-overlay-empty-icon">✨</div>
                    <h3>No Shadow Patterns Detected</h3>
                    <p>The organization shows strong coherence with no hidden tensions.</p>
                    ${!hasAIGenerated ? `
                        <p class="empty-state-hint">
                            💡 Try switching to <strong>AI</strong> mode above for deeper pattern discovery
                        </p>
                    ` : `
                        <p class="empty-state-hint">
                            ✅ AI analysis complete - no additional patterns found
                        </p>
                    `}
                </div>
            `;
            return;
        }

        // Render shadow cards
        const cardsHtml = currentShadows.map(shadow => createShadowCardHtml(shadow)).join('');
        shadowOverlayContent.innerHTML = cardsHtml;

        // Add click handlers to cards for focus-face functionality
        shadowOverlayContent.querySelectorAll('.shadow-card').forEach((card, index) => {
            card.addEventListener('click', (e) => {
                // Don't trigger if clicking the toggle button
                if (e.target.closest('.toggle-perspective')) return;

                const shadow = currentShadows[index];
                focusOnShadowFace(shadow);
            });

            // Setup toggle button
            const toggleBtn = card.querySelector('.toggle-perspective');
            const suppressedDiv = card.querySelector('.shadow-suppressed');
            const integratedDiv = card.querySelector('.shadow-integrated');

            if (toggleBtn && suppressedDiv && integratedDiv) {
                toggleBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const isShowingShadow = suppressedDiv.classList.contains('active');

                    if (isShowingShadow) {
                        suppressedDiv.classList.remove('active');
                        integratedDiv.classList.add('active');
                        toggleBtn.textContent = '🔄 See Shadow';
                        card.classList.add('showing-gift');
                    } else {
                        integratedDiv.classList.remove('active');
                        suppressedDiv.classList.add('active');
                        toggleBtn.textContent = '🔄 See Gift';
                        card.classList.remove('showing-gift');
                    }
                });
            }
        });
    }

    // ════════════════════════════════════════════════════════════════════════
    // AI SHADOW ANALYSIS HANDLERS
    // ════════════════════════════════════════════════════════════════════════

    // ════════════════════════════════════════════════════════════════════════
    // DEPRECATED: OLD OVERLAY AI HANDLERS (Sprint 5/6)
    // ════════════════════════════════════════════════════════════════════════
    //
    // Sprint 7 (December 2025): These handlers were for the old inline
    // AI enhancement buttons in the empty state. Now deprecated.
    // AI generation is handled by ShadowSourceToggle.generateAIShadows().
    //
    // ════════════════════════════════════════════════════════════════════════

    /**
     * @deprecated Sprint 7: Old AI handlers replaced by ShadowSourceToggle
     * This was for the inline API key input and generate button.
     * Now a no-op - kept for backward compatibility.
     */
    function setupOverlayAIHandlers() {
        // No-op: Sprint 7 removed inline AI enhancement UI
        console.log('[ShadowOverlay] setupOverlayAIHandlers deprecated - use toggle');
    }

    /**
     * @deprecated Sprint 7: Replaced by ShadowSourceToggle.generateAIShadows()
     * Old function for inline button AI generation. Now a no-op.
     * @param {HTMLButtonElement} btn - Unused
     */
    async function generateAIShadows(btn) {
        console.log('[ShadowOverlay] generateAIShadows deprecated - use ShadowSourceToggle');
    }

    /**
     * @deprecated Sprint 7: Replaced by ShadowSourceToggle.generateAIShadows()
     * Old function for persistent bar button. Now a no-op.
     * @param {HTMLButtonElement} btn - Unused
     */
    async function generateAIShadowsFromPersistentButton(btn) {
        console.log('[ShadowOverlay] generateAIShadowsFromPersistentButton deprecated');
    }

    /**
     * Create HTML for a single shadow card
     * @param {Object} shadow - Shadow pattern object
     * @returns {string} HTML string for the shadow card
     */
    function createShadowCardHtml(shadow) {
        const severityLower = (shadow.severity || 'moderate').toLowerCase();
        const icon = severityLower === 'critical' || severityLower === 'high' ? '⚠️' : '👁️';

        const suppressedForm = shadow.suppressed || shadow.description || 'Shadow pattern detected';
        const integratedForm = shadow.integrated || shadow.gift || 'Integrated wisdom awaits discovery';
        const prescription = shadow.prescription || shadow.recommendation || '';

        return `
            <div class="shadow-card severity-${severityLower}" data-shadow-id="${shadow.id || shadow.name}">
                <div class="shadow-header">
                    <span class="shadow-icon">${icon}</span>
                    <span class="shadow-title">${shadow.name || 'Unknown Pattern'}</span>
                    <button class="toggle-perspective" title="See the Gift">🔄 See Gift</button>
                </div>

                <div class="shadow-suppressed active">
                    <div class="shadow-label">The Shadow:</div>
                    <div class="shadow-message">${suppressedForm}</div>
                </div>

                <div class="shadow-integrated">
                    <div class="shadow-label" style="color: #66ff99;">💡 The Gift:</div>
                    <div class="shadow-message" style="color: rgba(102, 255, 153, 0.9);">${integratedForm}</div>
                </div>

                ${prescription ? `
                    <div class="shadow-prescription">
                        <span style="color: #00ffcc; font-weight: 600;">Rx:</span> ${prescription}
                    </div>
                ` : ''}

                <div class="shadow-meta">
                    ${shadow.faceId ? `<span class="shadow-location">Face ${shadow.faceId}</span>` : ''}
                    ${shadow.involvedFaces ? `<span class="shadow-location">Faces: ${shadow.involvedFaces.join(', ')}</span>` : ''}
                    ${shadow.score ? `<span class="shadow-score">Intensity: ${(shadow.score * 100).toFixed(0)}%</span>` : ''}
                </div>
            </div>
        `;
    }

    /**
     * Focus on a shadow's affected face in the 3D view
     * @param {Object} shadow - Shadow pattern object
     */
    function focusOnShadowFace(shadow) {
        const faceId = shadow.faceId || (shadow.involvedFaces && shadow.involvedFaces[0]);

        if (faceId) {
            console.log(`[ShadowOverlay] Focusing on face ${faceId} for shadow: ${shadow.name}`);

            // Dispatch focus-face event (listened by dodecahedron-viz.js)
            global.dispatchEvent(new CustomEvent('focus-face', {
                detail: { faceId: faceId }
            }));

            // Close overlay after focusing
            closeShadowOverlay();
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // SHADOW SOURCE TOGGLE (Sprint 7 - UX Redesign)
    // ════════════════════════════════════════════════════════════════════════
    //
    // ╔════════════════════════════════════════════════════════════════════════════╗
    // ║                                                                            ║
    // ║   SHADOW SOURCE TOGGLE - The Day/Night Switch Component                   ║
    // ║   "One toggle to rule them all, one toggle to find them"                  ║
    // ║                                                                            ║
    // ║   Location: js/dodec/dodec-shadow-overlay.js                              ║
    // ║   Created: December 2025                                                   ║
    // ║                                                                            ║
    // ╚════════════════════════════════════════════════════════════════════════════╝
    //
    // ═══════════════════════════════════════════════════════════════════════════════
    // NOTES FOR FUTURE CLAUDE
    // ═══════════════════════════════════════════════════════════════════════════════
    //
    // Welcome, future me. This class handles the elegant toggle between shadow sources.
    //
    // ─────────────────────────────────────────────────────────────────────────────
    // WHAT THIS DOES
    // ─────────────────────────────────────────────────────────────────────────────
    //
    // The ShadowSourceToggle is a stateful UI component that:
    // 1. Detects what kind of data the user entered (template company vs custom)
    // 2. Adapts its appearance based on that context
    // 3. Manages transitions between Template/Universal shadows and AI shadows
    // 4. Caches AI results to prevent redundant API calls
    //
    // ─────────────────────────────────────────────────────────────────────────────
    // THE THREE MODES
    // ─────────────────────────────────────────────────────────────────────────────
    //
    // | Mode              | When                        | Toggle Shows          |
    // |-------------------|-----------------------------|-----------------------|
    // | template-company  | User selected a template    | Template ⟷ AI        |
    // | custom-data       | Manual or AI-generated data | Universal ⟷ AI       |
    // | no-data           | No faces data available     | Graceful message      |
    //
    // ─────────────────────────────────────────────────────────────────────────────
    // DATA INTEGRITY INVARIANTS
    // ─────────────────────────────────────────────────────────────────────────────
    //
    // INVARIANT 1: activeSource is NEVER undefined
    //   - Always one of: 'template' | 'ai' | 'universal'
    //   - Validated in switchSource() before any state change
    //
    // INVARIANT 2: AI shadows are cached, never re-fetched
    //   - Once aiGenerationStatus = 'success', we use cached aiShadows
    //   - Prevents redundant Gemini API calls
    //
    // INVARIANT 3: Mode determination is pure
    //   - determineMode() returns same output for same Quannex state
    //   - No side effects, no external dependencies beyond window.Quannex
    //
    // ─────────────────────────────────────────────────────────────────────────────
    // CONNECTING FILES
    // ─────────────────────────────────────────────────────────────────────────────
    //
    // UPSTREAM (feeds data to us):
    // ├── js/shadow/detection/shadow-detector.js → Provides template shadows
    // ├── js/shadow/adaptation/ai-shadow-adapter.js → Generates AI shadows
    // └── window.Quannex.getState() → Provides face data and company context
    //
    // DOWNSTREAM (we feed data to):
    // └── renderShadowCards() → Displays the shadow cards in overlay
    //
    // ═══════════════════════════════════════════════════════════════════════════════
    //
    // UNIVERSAL BASELINE SHADOWS (for custom data mode)
    // ─────────────────────────────────────────────────────────────────────────────
    // When users enter custom data (not template), these universal patterns
    // provide baseline shadow analysis that applies to ANY organization.
    //
    const UNIVERSAL_SHADOWS = [
        {
            id: 'dataCompleteness',
            name: 'Data Completeness',
            description: 'Evaluates whether all organizational faces have sufficient data',
            suppressed: 'Some organizational domains have sparse or missing data, creating blind spots in coherence analysis.',
            integrated: 'Acknowledging data gaps is the first step toward comprehensive organizational awareness.',
            prescription: 'Review faces with low values and consider what information might be missing.',
            severity: 'info',
            penalty: 0.1,  // Minimal penalty - informational
            source: 'universal',
            universalCheck: (faces) => {
                const emptyFaces = faces.filter(f => !f.value || f.value < 10).length;
                return emptyFaces > 3;  // Triggers if more than 3 faces are sparse
            }
        },
        {
            id: 'balanceDistribution',
            name: 'Balance Distribution',
            description: 'Checks if coherence is heavily skewed toward certain domains',
            suppressed: 'Organizational energy may be concentrated in specific areas while others are neglected.',
            integrated: 'Intentional focus is healthy; unconscious neglect creates fragility.',
            prescription: 'Examine faces with extreme high or low values and assess if the distribution is intentional.',
            severity: 'warning',
            penalty: 0.146,  // PHI-4 tier (φ⁻⁴)
            source: 'universal',
            universalCheck: (faces) => {
                const values = faces.map(f => f.value || 0);
                const max = Math.max(...values);
                const min = Math.min(...values);
                return (max - min) > 60;  // More than 60% spread
            }
        }
    ];

    /**
     * Toggle component reference (singleton pattern)
     * @type {ShadowSourceToggle|null}
     */
    let shadowSourceToggle = null;

    /**
     * ═══════════════════════════════════════════════════════════════════════════
     * SHADOW SOURCE TOGGLE CLASS
     * ═══════════════════════════════════════════════════════════════════════════
     *
     * @class ShadowSourceToggle
     * @description Elegant toggle switch for shadow source selection with adaptive UI
     */
    /**
     * Sprint 8: Tooltip content for smart guidance
     * Phi-timed delay: φ² × 1000 ≈ 382ms
     */
    const TOGGLE_TOOLTIPS = {
        template: {
            title: '📋 Template Analysis',
            description: 'Pre-computed shadow patterns based on your KPI data',
            hint: 'Fast • Consistent • Universal patterns'
        },
        ai: {
            title: '✨ AI Analysis',
            description: 'Fresh insights generated by AI based on your specific company data',
            hint: 'Dynamic • Contextual • Unique to your situation'
        }
    };
    const PHI_SQUARED_MS = 382; // φ² × 1000 for tooltip delay

    class ShadowSourceToggle {
        /**
         * Initialize the toggle component with DOM references and default state.
         *
         * @param {HTMLElement} container - The .shadow-toggle-wrapper element (Sprint 8)
         */
        constructor(container) {
            // ═══════════════════════════════════════════════════════════════════
            // DOM REFERENCES - Cached for performance
            // ═══════════════════════════════════════════════════════════════════

            this.container = container;
            this.toggle = container?.querySelector('.shadow-source-toggle');
            this.tooltip = container?.querySelector('.shadow-toggle-tooltip');
            this.tooltipTitle = container?.querySelector('.tooltip-title');
            this.tooltipDescription = container?.querySelector('.tooltip-description');
            this.tooltipHint = container?.querySelector('.tooltip-hint');
            this.loadingText = container?.querySelector('.shadow-toggle-loading-text');
            this.cardsContainer = document.querySelector('.shadow-overlay-content');

            // Tooltip timing state
            this.tooltipShowTimeout = null;
            this.tooltipHideTimeout = null;

            if (!this.container) {
                console.warn('[ShadowSourceToggle] Container not found - toggle disabled');
                return;
            }

            // ═══════════════════════════════════════════════════════════════════
            // DETERMINE MODE AND RENDER
            // ═══════════════════════════════════════════════════════════════════

            this.mode = this.determineMode();
            this.renderForMode();
            this.bindEvents();
            this.bindTooltipEvents();
            this.showFirstUseHint();

            console.log(`[ShadowSourceToggle] 🔄 Initialized in ${this.mode} mode`);
        }

        // ═══════════════════════════════════════════════════════════════════════
        // MODE DETECTION - Determines UI adaptation
        // ═══════════════════════════════════════════════════════════════════════

        /**
         * Detect the data source context to determine toggle mode.
         *
         * @returns {Object} Data source information
         */
        detectDataSource() {
            const state = global.Quannex?.getState?.();
            const stored = sessionStorage.getItem('customCompanyData');
            let storedData = null;

            try {
                storedData = stored ? JSON.parse(stored) : null;
            } catch (e) {
                // Ignore parse errors
            }

            return {
                hasTemplateCompany: !!(storedData?.companyName && storedData?.isTemplate),
                hasCustomData: !!(state?.faces?.length > 0) && !(storedData?.isTemplate),
                faceCount: state?.faces?.length || 0,
                dataSource: storedData?.dataSource || 'unknown'
            };
        }

        /**
         * Determine which UI mode to use based on data context.
         *
         * PURE FUNCTION: Same input → same output.
         *
         * @returns {('template-company'|'custom-data'|'no-data')} The detected mode
         */
        determineMode() {
            const source = this.detectDataSource();

            if (source.faceCount === 0) {
                return 'no-data';
            }
            if (source.hasTemplateCompany) {
                return 'template-company';
            }
            if (source.hasCustomData) {
                return 'custom-data';
            }
            return 'template-company';  // Default fallback
        }

        /**
         * Render the toggle according to the detected mode.
         */
        renderForMode() {
            switch (this.mode) {
                case 'no-data':
                    this.renderNoDataState();
                    break;
                case 'custom-data':
                    this.renderCustomDataMode();
                    break;
                case 'template-company':
                default:
                    this.renderNormalToggle();
                    break;
            }
        }

        /**
         * Refresh the toggle by re-evaluating mode.
         * Called when overlay opens to handle timing issues where toggle
         * initialized before Quannex engine loaded data.
         *
         * TIMING FIX: The toggle may initialize in 'no-data' mode at page load,
         * but by the time the user opens the overlay, data is available.
         */
        refresh() {
            const newMode = this.determineMode();

            // If mode hasn't changed, just update the status
            if (newMode === this.mode) {
                this.updateVisualState();
                return;
            }

            console.log(`[ShadowSourceToggle] 🔄 Mode changed: ${this.mode} → ${newMode}`);
            this.mode = newMode;

            // If transitioning OUT of no-data mode, restore toggle HTML first
            if (!this.toggle && newMode !== 'no-data') {
                this.restoreToggleHTML();
            }

            this.renderForMode();

            // Re-bind events if toggle was restored
            if (this.toggle) {
                this.bindEvents();
            }
        }

        /**
         * Restore the toggle HTML structure after it was replaced by no-data state.
         * Sprint 8: Now uses compact structure with tooltip.
         */
        restoreToggleHTML() {
            this.container.innerHTML = `
                <span class="shadow-toggle-label">Viewing:</span>
                <div class="shadow-source-toggle shadow-source-toggle--compact" id="shadowSourceToggle"
                     role="switch" aria-checked="false" tabindex="0"
                     aria-label="Switch between template and AI shadow analysis">
                    <span class="toggle-option toggle-option--template active" data-tooltip="template">
                        <span class="toggle-icon">📋</span>
                    </span>
                    <div class="toggle-track">
                        <div class="toggle-thumb">
                            <div class="toggle-thumb-glow"></div>
                        </div>
                    </div>
                    <span class="toggle-option toggle-option--ai" data-tooltip="ai">
                        <span class="toggle-icon">✨</span>
                    </span>
                </div>
                <div class="shadow-toggle-tooltip" id="shadowToggleTooltip" role="tooltip" aria-hidden="true">
                    <div class="tooltip-title" id="tooltipTitle">📋 Template Analysis</div>
                    <div class="tooltip-description" id="tooltipDescription">Pre-computed shadow patterns based on your KPI data</div>
                    <div class="tooltip-hint" id="tooltipHint">Fast • Consistent • Universal patterns</div>
                </div>
                <span class="shadow-toggle-loading-text" id="shadowToggleLoadingText" aria-live="polite"></span>
            `;

            // Re-cache DOM references
            this.toggle = this.container.querySelector('.shadow-source-toggle');
            this.tooltip = this.container.querySelector('.shadow-toggle-tooltip');
            this.tooltipTitle = this.container.querySelector('.tooltip-title');
            this.tooltipDescription = this.container.querySelector('.tooltip-description');
            this.tooltipHint = this.container.querySelector('.tooltip-hint');
            this.loadingText = this.container.querySelector('.shadow-toggle-loading-text');

            // Re-bind tooltip events
            this.bindTooltipEvents();

            console.log('[ShadowSourceToggle] Toggle HTML restored (compact with tooltip)');
        }

        /**
         * Render normal toggle for template company mode.
         * Sprint 8: Compact mode - no text labels, tooltip explains.
         */
        renderNormalToggle() {
            // Sprint 8: Text labels hidden in compact mode, tooltip handles explanation
            // Update tooltip to show template context
            if (this.tooltipDescription) {
                this.tooltipDescription.textContent = TOGGLE_TOOLTIPS.template.description;
            }

            // Set initial toggle position
            this.updateVisualState();

            console.log(`[ShadowSourceToggle] Template mode: ${shadowState.templateShadows.length} patterns`);
        }

        /**
         * Render toggle for custom data mode (manual/AI entry).
         * Sprint 8: Compact mode with "Universal" context in tooltip.
         */
        renderCustomDataMode() {
            // Sprint 8: Update tooltip for custom data context
            if (this.tooltipDescription) {
                this.tooltipDescription.textContent = 'Universal patterns for your custom data';
            }

            // Add visual indicator
            this.container.classList.add('custom-data-mode');

            // Load universal baseline shadows
            const faces = global.Quannex?.getState?.()?.faces || [];
            const universalShadows = UNIVERSAL_SHADOWS
                .filter(shadow => shadow.universalCheck(faces))
                .map(shadow => ({ ...shadow }));

            // If no template shadows exist, use universal
            if (shadowState.templateShadows.length === 0) {
                shadowState.templateShadows = universalShadows;
                currentShadows = universalShadows;
            }

            // Default to AI for custom data (template patterns don't apply)
            if (shadowState.aiShadows.length > 0) {
                shadowState.activeSource = 'ai';
                currentShadows = shadowState.aiShadows;
            }

            // Update toggle position
            this.updateVisualState();

            console.log('[ShadowSourceToggle] Custom data mode: AI analysis recommended');
        }

        /**
         * Render graceful no-data state when faces array is empty.
         * Clears DOM references since innerHTML is replaced.
         */
        renderNoDataState() {
            this.container.innerHTML = `
                <div class="shadow-no-data">
                    <span class="no-data-icon">⚠️</span>
                    <span class="no-data-text">No shadow data available</span>
                    <span class="no-data-hint">Return to demo to enter company data</span>
                </div>
            `;

            // Clear stale DOM references (important for refresh() detection)
            this.toggle = null;
            this.statusText = null;
        }

        // ═══════════════════════════════════════════════════════════════════════
        // EVENT BINDING - Keyboard & Mouse Accessibility
        // ═══════════════════════════════════════════════════════════════════════

        /**
         * Bind click and keyboard events for the toggle.
         * Implements WCAG 2.1 keyboard accessibility requirements.
         */
        bindEvents() {
            if (!this.toggle) return;  // Guard for no-data mode
            if (this.toggle.dataset.eventsBound) return;  // Prevent double-binding

            // Mouse click
            this.toggle.addEventListener('click', () => this.handleToggle());

            // Keyboard: Enter and Space activate the toggle (WCAG requirement)
            this.toggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleToggle();
                }
            });

            // Mark as bound
            this.toggle.dataset.eventsBound = 'true';
        }

        // ═══════════════════════════════════════════════════════════════════════
        // TOOLTIP HANDLING - Sprint 8 Smart Guidance
        // ═══════════════════════════════════════════════════════════════════════

        /**
         * Bind tooltip show/hide events with phi-timed delay.
         * Shows contextual help based on which option is being hovered.
         */
        bindTooltipEvents() {
            if (!this.toggle || !this.tooltip) return;

            // Detect which option is being hovered
            const templateOption = this.toggle.querySelector('.toggle-option--template');
            const aiOption = this.toggle.querySelector('.toggle-option--ai');

            // Template option hover
            if (templateOption) {
                templateOption.addEventListener('mouseenter', () => this.showTooltip('template'));
                templateOption.addEventListener('mouseleave', () => this.hideTooltip());
            }

            // AI option hover
            if (aiOption) {
                aiOption.addEventListener('mouseenter', () => this.showTooltip('ai'));
                aiOption.addEventListener('mouseleave', () => this.hideTooltip());
            }

            // Track hover (show current active state tooltip)
            const track = this.toggle.querySelector('.toggle-track');
            if (track) {
                track.addEventListener('mouseenter', () => {
                    const currentSource = shadowState.activeSource === 'ai' ? 'ai' : 'template';
                    this.showTooltip(currentSource);
                });
                track.addEventListener('mouseleave', () => this.hideTooltip());
            }
        }

        /**
         * Show tooltip with phi-timed delay (382ms).
         * Updates content based on the source type.
         *
         * @param {('template'|'ai')} source - Which tooltip content to show
         */
        showTooltip(source) {
            // Clear any pending hide
            if (this.tooltipHideTimeout) {
                clearTimeout(this.tooltipHideTimeout);
                this.tooltipHideTimeout = null;
            }

            // Phi-timed delay before showing
            this.tooltipShowTimeout = setTimeout(() => {
                const content = TOGGLE_TOOLTIPS[source];
                if (content && this.tooltip) {
                    // Update content
                    if (this.tooltipTitle) this.tooltipTitle.textContent = content.title;
                    if (this.tooltipDescription) this.tooltipDescription.textContent = content.description;
                    if (this.tooltipHint) this.tooltipHint.textContent = content.hint;

                    // Show with CSS class (for JS-controlled timing)
                    this.tooltip.classList.add('visible');
                    this.tooltip.setAttribute('aria-hidden', 'false');
                }
            }, PHI_SQUARED_MS);
        }

        /**
         * Hide tooltip with brief delay (prevents flicker on quick movements).
         */
        hideTooltip() {
            // Clear any pending show
            if (this.tooltipShowTimeout) {
                clearTimeout(this.tooltipShowTimeout);
                this.tooltipShowTimeout = null;
            }

            // Brief delay before hiding (prevents flicker)
            this.tooltipHideTimeout = setTimeout(() => {
                if (this.tooltip) {
                    this.tooltip.classList.remove('visible');
                    this.tooltip.setAttribute('aria-hidden', 'true');
                }
            }, 100);
        }

        // ═══════════════════════════════════════════════════════════════════════
        // FIRST-USE HINT - Sprint 8 Discoverability
        // ═══════════════════════════════════════════════════════════════════════

        /**
         * Show a subtle pulse animation on first use to draw attention.
         * Remembers in localStorage to only show once.
         */
        showFirstUseHint() {
            if (!this.toggle) return;

            const STORAGE_KEY = 'quannex_shadowToggleSeen';

            if (!localStorage.getItem(STORAGE_KEY)) {
                // Add pulse animation
                this.toggle.classList.add('first-use-pulse');

                // Remove after animation completes (2 cycles × 1.5s = 3s)
                setTimeout(() => {
                    this.toggle.classList.remove('first-use-pulse');
                    localStorage.setItem(STORAGE_KEY, 'true');
                }, 3000);

                console.log('[ShadowSourceToggle] ✨ First-use hint shown');
            }
        }

        // ═══════════════════════════════════════════════════════════════════════
        // TOGGLE HANDLER - The Core Interaction Logic
        // ═══════════════════════════════════════════════════════════════════════

        /**
         * Handle toggle interaction - switches between sources.
         *
         * LOGIC FLOW:
         * 1. If already generating → do nothing (prevent double-clicks)
         * 2. If switching TO AI and AI not yet generated → generate first
         * 3. Otherwise → just switch the view
         *
         * @async
         * @returns {Promise<void>}
         */
        async handleToggle() {
            // GUARD: Prevent multiple clicks during generation
            if (shadowState.aiGenerationStatus === 'generating') {
                console.log('[ShadowSourceToggle] Toggle blocked - generation in progress');
                return;
            }

            const currentSource = shadowState.activeSource;
            const switchingToAI = currentSource === 'template' || currentSource === 'universal';

            if (switchingToAI && shadowState.aiShadows.length === 0) {
                // First time switching to AI - need to generate
                await this.generateAIShadows();
            } else {
                // Just switch views
                const newSource = switchingToAI ? 'ai' : 'template';
                this.switchSource(newSource);
            }
        }

        // ═══════════════════════════════════════════════════════════════════════
        // AI GENERATION - Gemini API Integration
        // ═══════════════════════════════════════════════════════════════════════

        /**
         * Generate AI shadow patterns using the AIShadowAdapter.
         *
         * INVARIANT ENFORCEMENT:
         * - Once aiShadows has data, we NEVER re-generate (use cached)
         * - aiShadows are cached in shadowState for the session
         *
         * @async
         * @returns {Promise<void>}
         */
        async generateAIShadows() {
            // ─────────────────────────────────────────────────────────────────
            // SET LOADING STATE
            // ─────────────────────────────────────────────────────────────────
            shadowState.aiGenerationStatus = 'generating';
            this.toggle?.classList.add('generating');
            this.updateStatus('Generating AI insights...');

            // Show loading text
            if (this.loadingText) {
                this.loadingText.textContent = 'Analyzing your organization...';
                this.loadingText.classList.add('visible');
                console.log('[ShadowSourceToggle] Loading text shown');
            }

            // Hide the "Generate" badge during generation
            const badge = this.toggle?.querySelector('.toggle-badge--generate');
            if (badge) badge.style.display = 'none';

            try {
                // Use existing generateAIShadowsFromPersistentButton logic
                // but simplified for toggle context
                const geminiKey = localStorage.getItem('quannex_gemini_api_key');
                const openaiKey = localStorage.getItem('quannex_openai_api_key');
                const preferredProvider = localStorage.getItem('quannex_preferred_provider') || 'gemini';

                if (!geminiKey && !openaiKey) {
                    throw new Error('Please configure an API key first');
                }

                const state = global.Quannex?.getState?.();
                if (!state || !state.faces || state.faces.length === 0) {
                    throw new Error('No face data available for AI analysis');
                }

                // Create provider
                let provider = null;

                if (preferredProvider === 'gemini' && geminiKey && global.getGeminiProvider) {
                    provider = await global.getGeminiProvider(geminiKey);
                } else if (preferredProvider === 'openai' && openaiKey && global.getOpenAIProvider) {
                    provider = await global.getOpenAIProvider(openaiKey);
                } else if (geminiKey && global.getGeminiProvider) {
                    provider = await global.getGeminiProvider(geminiKey);
                } else if (openaiKey && global.getOpenAIProvider) {
                    provider = await global.getOpenAIProvider(openaiKey);
                }

                if (!provider || provider.name === 'OfflineProvider') {
                    throw new Error('AI provider unavailable');
                }

                // Generate shadows
                const aiAdapter = new global.AIShadowAdapter({ provider });
                const aiShadows = await aiAdapter.generateAIShadowPatterns(
                    state.faces,
                    {
                        companyName: state.companyName || 'Organization',
                        context: state
                    }
                );

                if (aiShadows && aiShadows.length > 0) {
                    // Mark as AI-generated
                    aiShadows.forEach(s => s.source = 'ai');

                    // Cache in shadowState
                    shadowState.aiShadows = aiShadows;
                    shadowState.aiGenerationStatus = 'success';

                    // Show ready celebration
                    this.toggle?.classList.add('ai-ready');

                    console.log(`[ShadowSourceToggle] ✨ Generated ${aiShadows.length} AI shadow patterns`);

                    // Switch to AI view
                    this.switchSource('ai');

                    // Dispatch event with source to prevent overwriting template shadows
                    global.dispatchEvent(new CustomEvent('shadows-updated', {
                        detail: { shadows: aiShadows, source: 'ai' }
                    }));

                    saveToSessionStorage();
                } else {
                    shadowState.aiGenerationStatus = 'success';
                    this.updateStatus('✅ No hidden patterns found');
                }

            } catch (error) {
                // ─────────────────────────────────────────────────────────────
                // ERROR HANDLING - Graceful degradation
                // ─────────────────────────────────────────────────────────────
                console.error('[ShadowSourceToggle] AI generation failed:', error);

                shadowState.aiGenerationStatus = 'error';

                // User-friendly error message
                const message = error.message.includes('API') || error.message.includes('key')
                    ? 'AI unavailable - check API key'
                    : 'AI generation failed - using templates';

                this.updateStatus(message);

                // Show the badge again
                if (badge) badge.style.display = '';

            } finally {
                // ─────────────────────────────────────────────────────────────
                // CLEANUP - Always hide loading state (Sprint 9 bugfix)
                // ─────────────────────────────────────────────────────────────
                // Using finally ensures loading text is hidden regardless of:
                // - Success with results
                // - Success with no results
                // - Any exception thrown during generation
                this.toggle?.classList.remove('generating');
                if (this.loadingText) {
                    this.loadingText.classList.remove('visible');
                    // Clear text content to prevent flash during rerender/refresh
                    // (opacity transition means text lingers briefly; clearing prevents any flash)
                    this.loadingText.textContent = '';
                    console.log('[ShadowSourceToggle] Loading text hidden (finally block)');
                }
            }
        }

        // ═══════════════════════════════════════════════════════════════════════
        // SOURCE SWITCHING - View Transitions
        // ═══════════════════════════════════════════════════════════════════════

        /**
         * Switch the active shadow source and update UI accordingly.
         *
         * DATA INTEGRITY:
         * - Validates newSource before accepting
         * - Updates ARIA attributes for screen readers
         * - Triggers smooth card transition
         *
         * @param {('template'|'ai'|'universal')} newSource - The source to switch to
         */
        switchSource(newSource) {
            // ─────────────────────────────────────────────────────────────────
            // VALIDATE SOURCE (INVARIANT: source is never undefined)
            // ─────────────────────────────────────────────────────────────────
            const validSources = ['template', 'ai', 'universal'];
            if (!validSources.includes(newSource)) {
                console.error(`[ShadowSourceToggle] Invalid source: ${newSource}, falling back to 'template'`);
                newSource = 'template';
            }

            shadowState.activeSource = newSource;
            shadowState.aiGenerationStatus = shadowState.aiGenerationStatus === 'generating' ? 'idle' : shadowState.aiGenerationStatus;
            this.toggle?.classList.remove('generating');

            // ─────────────────────────────────────────────────────────────────
            // UPDATE CURRENT SHADOWS
            // ─────────────────────────────────────────────────────────────────
            currentShadows = newSource === 'ai'
                ? shadowState.aiShadows
                : shadowState.templateShadows;

            // ─────────────────────────────────────────────────────────────────
            // UPDATE VISUAL STATE
            // ─────────────────────────────────────────────────────────────────
            this.updateVisualState();

            // ─────────────────────────────────────────────────────────────────
            // TRANSITION CARDS WITH ANIMATION
            // ─────────────────────────────────────────────────────────────────
            this.transitionCards();

            // ─────────────────────────────────────────────────────────────────
            // UPDATE STATUS TEXT
            // ─────────────────────────────────────────────────────────────────
            if (newSource === 'ai') {
                const count = shadowState.aiShadows.length;
                this.updateStatus(`${count} AI-discovered patterns`);
            } else if (this.mode === 'custom-data') {
                const count = shadowState.templateShadows.length;
                this.updateStatus(`${count} universal patterns`);
            } else {
                const count = shadowState.templateShadows.length;
                this.updateStatus(`${count} patterns from archetypal library`);
            }

            // ─────────────────────────────────────────────────────────────────
            // DISPATCH EVENT
            // ─────────────────────────────────────────────────────────────────
            global.dispatchEvent(new CustomEvent('shadow-source-changed', {
                detail: {
                    source: newSource,
                    shadows: currentShadows,
                    templateCount: shadowState.templateShadows.length,
                    aiCount: shadowState.aiShadows.length
                }
            }));

            console.log(`[ShadowSourceToggle] Switched to ${newSource} (${currentShadows.length} shadows)`);
        }

        /**
         * Update the visual state of the toggle (aria, classes, position).
         */
        updateVisualState() {
            if (!this.toggle) return;

            const isAI = shadowState.activeSource === 'ai';

            // Update ARIA for accessibility
            this.toggle.setAttribute('aria-checked', isAI);

            // Update option active states
            const templateOption = this.toggle.querySelector('.toggle-option--template');
            const aiOption = this.toggle.querySelector('.toggle-option--ai');

            if (templateOption) {
                templateOption.classList.toggle('active', !isAI);
            }
            if (aiOption) {
                aiOption.classList.toggle('active', isAI);
            }

            // Hide generate badge if AI already generated
            if (shadowState.aiShadows.length > 0) {
                this.toggle.classList.add('ai-ready');
            }
        }

        // ═══════════════════════════════════════════════════════════════════════
        // CARD TRANSITIONS - Smooth Visual Updates
        // ═══════════════════════════════════════════════════════════════════════

        /**
         * Smoothly transition between shadow card sets.
         * Uses CSS opacity transition for elegant fade effect.
         */
        transitionCards() {
            const cardsContainer = document.querySelector('.shadow-overlay-content');
            if (!cardsContainer) {
                // Just render directly
                renderShadowCards();
                return;
            }

            // Start fade out
            cardsContainer.classList.add('transitioning');

            // After fade out completes, swap content and fade in
            setTimeout(() => {
                renderShadowCards();
                cardsContainer.classList.remove('transitioning');
            }, 300);  // Match CSS transition duration
        }

        /**
         * Update the status text below the toggle.
         *
         * @param {string} text - Status message to display
         */
        updateStatus(text) {
            if (this.statusText) {
                this.statusText.textContent = text;
            }
        }

        // NOTE: refresh() method defined earlier (line ~691) handles timing issues
        // and restores toggle HTML when transitioning from no-data mode.
    }

    // ════════════════════════════════════════════════════════════════════════
    // LEGACY SOURCE SWITCHING (Deprecated but maintained for compatibility)
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Handle source change from the dropdown (DEPRECATED - use toggle)
     * @param {string} newSource - 'template' | 'ai'
     * @deprecated Use ShadowSourceToggle instead
     */
    function handleSourceChange(newSource) {
        // If toggle exists, delegate to it
        if (shadowSourceToggle) {
            shadowSourceToggle.switchSource(newSource);
            return;
        }

        // Legacy fallback for old dropdown
        if (shadowState.aiGenerationStatus === 'generating') {
            console.log('[ShadowOverlay] Blocked source switch - AI generation in progress');
            updateSourceDropdown();
            return;
        }

        if (shadowState.activeSource === newSource) {
            return;
        }

        console.log(`[ShadowOverlay] Switching source: ${shadowState.activeSource} → ${newSource}`);

        shadowState.activeSource = newSource;
        currentShadows = newSource === 'template'
            ? shadowState.templateShadows
            : shadowState.aiShadows;

        updateSourceDropdown();
        updateSourceDropdownCount();
        renderShadowCards();
        saveToSessionStorage();

        global.dispatchEvent(new CustomEvent('shadow-source-changed', {
            detail: {
                source: newSource,
                shadows: currentShadows,
                templateCount: shadowState.templateShadows.length,
                aiCount: shadowState.aiShadows.length
            }
        }));

        console.log(`[ShadowOverlay] Now showing ${currentShadows.length} ${newSource} shadows`);
    }

    /**
     * Update the source dropdown to reflect current state (DEPRECATED)
     * @deprecated Use ShadowSourceToggle instead
     */
    function updateSourceDropdown() {
        // Legacy: Update old dropdown if it exists
        const sourceSelect = document.getElementById('shadowSourceSelect');
        if (sourceSelect) {
            sourceSelect.value = shadowState.activeSource;
            sourceSelect.disabled = shadowState.aiGenerationStatus === 'generating';
        }

        // New: Update toggle if it exists
        if (shadowSourceToggle) {
            shadowSourceToggle.updateVisualState();
        }
    }

    /**
     * Save shadow sources to sessionStorage for persistence
     * Maintains backward compatibility with existing shadowPatterns field
     */
    function saveToSessionStorage() {
        try {
            const stored = sessionStorage.getItem('customCompanyData');
            if (!stored) return;

            const data = JSON.parse(stored);

            // Preserve existing shadowPatterns for backward compatibility
            // (based on active source for legacy code)
            data.shadowPatterns = currentShadows;

            // Add new shadowSources field for dual-source management
            data.shadowSources = {
                template: shadowState.templateShadows,
                ai: shadowState.aiShadows,
                activeSource: shadowState.activeSource
            };

            sessionStorage.setItem('customCompanyData', JSON.stringify(data));
            console.log('[ShadowOverlay] Saved shadow sources to sessionStorage');
        } catch (e) {
            console.warn('[ShadowOverlay] Failed to save to sessionStorage:', e);
        }
    }

    /**
     * Load shadow sources from sessionStorage on init
     * Handles both new format (shadowSources) and legacy format (shadowPatterns)
     */
    function loadFromSessionStorage() {
        try {
            const stored = sessionStorage.getItem('customCompanyData');
            if (!stored) return;

            const data = JSON.parse(stored);

            // Prefer new shadowSources format if available
            if (data.shadowSources) {
                shadowState.templateShadows = data.shadowSources.template || [];
                shadowState.aiShadows = data.shadowSources.ai || [];
                shadowState.activeSource = data.shadowSources.activeSource || 'template';
                console.log('[ShadowOverlay] Loaded shadow sources from sessionStorage');
            }
            // Fall back to legacy shadowPatterns (treat as template)
            else if (data.shadowPatterns) {
                shadowState.templateShadows = data.shadowPatterns;
                shadowState.activeSource = 'template';
                console.log('[ShadowOverlay] Loaded legacy shadowPatterns as template');
            }

            // Update currentShadows based on active source
            currentShadows = shadowState.activeSource === 'template'
                ? shadowState.templateShadows
                : shadowState.aiShadows;

        } catch (e) {
            console.warn('[ShadowOverlay] Failed to load from sessionStorage:', e);
        }
    }

    /**
     * Show a temporary status message in the AI controls bar
     * @param {string} message - Message to display
     * @param {string} type - 'info' | 'success' | 'error'
     */
    function showTemporaryStatus(message, type = 'info') {
        const statusEl = document.getElementById('aiGenerationStatus');
        if (statusEl) {
            statusEl.textContent = message;
            statusEl.className = `ai-status ai-status-${type}`;

            // Clear after 5 seconds
            setTimeout(() => {
                if (statusEl.textContent === message) {
                    statusEl.textContent = '';
                    statusEl.className = 'ai-status';
                }
            }, 5000);
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // OVERLAY OPEN/CLOSE
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Open the shadow overlay panel
     */
    function openShadowOverlay() {
        if (!shadowOverlay || overlayOpen) return;

        // TIMING FIX: Refresh toggle to re-evaluate mode in case data loaded after init
        if (shadowSourceToggle) {
            shadowSourceToggle.refresh();
        }

        renderShadowCards();
        shadowOverlay.classList.add('visible');
        overlayOpen = true;

        // Prevent body scroll while overlay is open
        document.body.style.overflow = 'hidden';

        console.log('[ShadowOverlay] Opened');
    }

    /**
     * Close the shadow overlay panel
     */
    function closeShadowOverlay() {
        if (!shadowOverlay || !overlayOpen) return;

        shadowOverlay.classList.remove('visible');
        overlayOpen = false;

        // Restore body scroll
        document.body.style.overflow = '';

        console.log('[ShadowOverlay] Closed');
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

    // ════════════════════════════════════════════════════════════════════════
    // EVENT LISTENERS
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Initialize all event listeners
     */
    function initEventListeners() {
        // Open button click
        if (openShadowOverlayBtn) {
            openShadowOverlayBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                openShadowOverlay();
            });
        }

        // Close button click
        if (closeShadowOverlayBtn) {
            closeShadowOverlayBtn.addEventListener('click', closeShadowOverlay);
        }

        // Click on backdrop to close
        if (shadowOverlayBackdrop) {
            shadowOverlayBackdrop.addEventListener('click', closeShadowOverlay);
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // ESC to close overlay
            if (e.key === 'Escape' && overlayOpen) {
                closeShadowOverlay();
                return;
            }

            // 'S' to toggle shadow overlay (when not typing in an input)
            if (e.key === 's' || e.key === 'S') {
                const activeElement = document.activeElement;
                const isTyping = activeElement && (
                    activeElement.tagName === 'INPUT' ||
                    activeElement.tagName === 'TEXTAREA' ||
                    activeElement.contentEditable === 'true'
                );

                if (!isTyping) {
                    e.preventDefault();
                    toggleShadowOverlay();
                }
            }
        });

        // Sprint 6: Source dropdown change handler
        const sourceSelect = document.getElementById('shadowSourceSelect');
        if (sourceSelect) {
            sourceSelect.addEventListener('change', (e) => {
                handleSourceChange(e.target.value);
            });
        }

        // Sprint 6: Persistent AI generate button
        const persistentAIBtn = document.getElementById('generateAIShadowsBtn');
        if (persistentAIBtn) {
            persistentAIBtn.addEventListener('click', async () => {
                await generateAIShadowsFromPersistentButton(persistentAIBtn);
            });
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // INTEGRATION WITH SHADOW SYSTEM
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Listen for shadow pattern updates from the main engine
     * The engine/shadow panel will dispatch this event when shadows change
     *
     * IMPORTANT: The source parameter prevents AI shadows from overwriting
     * template shadows. Without it, all shadows default to 'template' source.
     * (Sprint 9.1 bugfix)
     */
    function initShadowIntegration() {
        global.addEventListener('shadows-updated', (event) => {
            const shadows = event.detail?.shadows || [];
            const source = event.detail?.source || 'template';
            updateShadowIndicator(shadows, source);
        });
    }

    /**
     * Efficient shadow comparison without JSON serialization.
     * Compares only id and severity for change detection.
     * Per Agent Council: Optimize for performance without losing clarity.
     *
     * @param {Array} a - First shadow array
     * @param {Array} b - Second shadow array
     * @returns {boolean} True if arrays are equivalent
     */
    function shadowsEqual(a, b) {
        if (a.length !== b.length) return false;
        if (a.length === 0) return true;
        for (let i = 0; i < a.length; i++) {
            const aId = a[i].id || a[i].name;
            const bId = b[i].id || b[i].name;
            if (aId !== bId || a[i].severity !== b[i].severity) return false;
        }
        return true;
    }

    /**
     * Hook into the existing shadow panel update mechanism
     * Watches for changes to the global shadow state
     * Optimized: Early exit if shadows haven't changed (using efficient comparison)
     */
    function syncWithShadowPanel() {
        // Check Quannex state for shadow patterns
        const state = global.Quannex?.getState?.();
        const newShadows = state?.shadowPatterns || [];

        // Early exit if no change (using efficient O(n) comparison, not JSON.stringify)
        if (shadowsEqual(newShadows, currentShadows)) {
            return;
        }

        if (newShadows.length > 0 || currentShadows.length > 0) {
            updateShadowIndicator(newShadows);
        }
    }

    /**
     * Hook into existing shadowPanel if available
     */
    function hookShadowPanel() {
        const originalShadowPanelUpdate = global.shadowPanel?.update;
        if (originalShadowPanelUpdate) {
            global.shadowPanel.update = function(shadows) {
                originalShadowPanelUpdate.call(this, shadows);
                updateShadowIndicator(shadows);
            };
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // INITIALIZATION
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Initialize the shadow overlay controller
     */
    function init() {
        initEventListeners();
        initShadowIntegration();

        // Sprint 6: Load persisted shadow sources from sessionStorage
        loadFromSessionStorage();

        // Sprint 7: Initialize the new toggle component
        const toggleContainer = document.getElementById('shadowSourceToggleContainer');
        if (toggleContainer) {
            shadowSourceToggle = new ShadowSourceToggle(toggleContainer);
            console.log('[ShadowOverlay] 🔄 Shadow source toggle initialized');
        } else {
            // Fallback: Use legacy dropdown if toggle not in DOM
            updateSourceDropdown();
            updateSourceDropdownCount();
            console.log('[ShadowOverlay] Using legacy dropdown (toggle container not found)');
        }

        // Initial sync after a delay (waiting for engine to initialize)
        setTimeout(syncWithShadowPanel, 2000);

        // Fallback periodic sync every 10 seconds (primary: event-driven via shadows-updated)
        // LIFECYCLE: Store reference for cleanup in destroy()
        syncIntervalId = setInterval(syncWithShadowPanel, 10000);

        // Hook into shadowPanel if available
        hookShadowPanel();

        console.log('[ShadowOverlay] 👁️ Shadow overlay controller initialized');
        console.log('[ShadowOverlay] Press "S" to toggle shadow analysis overlay');
        console.log(`[ShadowOverlay] Shadow sources: ${shadowState.templateShadows.length} template, ${shadowState.aiShadows.length} AI, active: ${shadowState.activeSource}`);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ════════════════════════════════════════════════════════════════════════
    // LIFECYCLE MANAGEMENT
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Cleanup resources and stop background processes.
     * CRITICAL: Call this on page unload to prevent memory leaks.
     *
     * Per Agent Council guidance: The shadow is not the enemy—
     * even cleanup can be done with consciousness.
     */
    function destroy() {
        if (syncIntervalId) {
            clearInterval(syncIntervalId);
            syncIntervalId = null;
        }
        if (overlayOpen) closeShadowOverlay();
        currentShadows = [];
        activeShadowId = null;
        console.log('[ShadowOverlay] 🌙 Destroyed - resources cleaned up with grace');
    }

    /**
     * Get current overlay state for debugging and integration.
     * Per Sacred Tech Architect: Expose state for transparency.
     *
     * Sprint 6: Enhanced with shadowState information
     *
     * @returns {Object} Current state snapshot
     */
    function getState() {
        return {
            overlayOpen,
            currentShadows: [...currentShadows],
            selectedShadow: activeShadowId
                ? currentShadows.find(s => (s.id || s.name) === activeShadowId)
                : null,
            shadowCount: currentShadows.length,
            syncIntervalActive: syncIntervalId !== null,
            hasShadows: currentShadows.length > 0,
            // Sprint 6: Shadow source state
            shadowSources: {
                templateCount: shadowState.templateShadows.length,
                aiCount: shadowState.aiShadows.length,
                activeSource: shadowState.activeSource,
                aiGenerationStatus: shadowState.aiGenerationStatus
            }
        };
    }

    // ════════════════════════════════════════════════════════════════════════
    // EXPORTS
    // ════════════════════════════════════════════════════════════════════════

    // Expose API for external access
    global.shadowOverlayController = {
        open: openShadowOverlay,
        close: closeShadowOverlay,
        toggle: toggleShadowOverlay,
        updateShadows: updateShadowIndicator,
        getShadows: () => currentShadows,
        isOpen: () => overlayOpen,
        // New APIs (per Agent Council - December 2024)
        destroy: destroy,
        getState: getState,
        focusOnShadow: focusOnShadowFace,
        // Sprint 6: Source switching APIs
        setActiveSource: handleSourceChange,
        getTemplateCount: () => shadowState.templateShadows.length,
        getAICount: () => shadowState.aiShadows.length,
        // Sprint 7: Toggle component access
        refreshToggle: () => shadowSourceToggle?.refresh(),
        getToggle: () => shadowSourceToggle,
        renderShadowCards: renderShadowCards
    };

})(typeof window !== 'undefined' ? window : this);
