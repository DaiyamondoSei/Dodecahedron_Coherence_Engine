/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SHADOW CARD RENDERER - Orchestration, Interactions & Animation
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Location: js/shadow/overlay/shadow-card-renderer.js
 * Extracted from: dodec-shadow-overlay.js (Phase 3B modularization)
 * Last Modified: December 22, 2025
 *
 * @module shadow-card-renderer
 * @author Deimantas & Claude (Co-created with consciousness and love)
 * @version 2.0.0 - Refactored to use shadow-card-templates.js for HTML generation
 *
 * ───────────────────────────────────────────────────────────────────────────────
 * NOTES FOR FUTURE CLAUDE
 * ───────────────────────────────────────────────────────────────────────────────
 *
 * Welcome! This module is the ORCHESTRATOR of shadow card rendering.
 *
 * WHY THIS MODULE EXISTS (Separation of Concerns):
 * ────────────────────────────────────────────────
 * Templates (shadow-card-templates.js) answer: WHAT HTML to generate
 * Renderer (THIS file) answers: WHEN to render, HOW to animate, WHO handles events
 *
 * This separation was introduced in v2.0 because:
 * 1. Rich card templates are 100+ lines - too much for one file
 * 2. Template changes shouldn't require touching event handlers
 * 3. Pure template functions are easier to test
 *
 * THE SOUL OF THIS CODE:
 * ──────────────────────
 * Rendering is the bridge between data and experience. This module
 * transforms shadow pattern data into living, interactive cards that
 * respond to user intent and guide exploration.
 *
 * CARD STRUCTURE (see shadow-card-templates.js for HTML details):
 * ───────────────────────────────────────────────────────────────
 *   ┌─────────────────────────────────────────────────────────────┐
 *   │ [⚠️] Title                      [SEVERITY] [See Gift] [▼]  │ ← Header
 *   ├─────────────────────────────────────────────────────────────┤
 *   │ THE SHADOW: narrative...                                    │ ← Summary
 *   ├─────────────────────────────────────────────────────────────┤
 *   │ [Face chips] [Evidence] [Prescriptions] [Navigate]         │ ← Details
 *   └─────────────────────────────────────────────────────────────┘
 *
 * INTERACTION HANDLERS:
 * ─────────────────────
 * | Handler | What It Does | Trigger |
 * |---------|--------------|---------|
 * | setupPerspectiveToggle | Shadow ↔ Gift | Toggle button click |
 * | setupExpandCollapse | Show/hide details | Header click |
 * | setupNavigateButton | Focus 3D on faces | Navigate button click |
 *
 * NAVIGATION MAP:
 * ───────────────
 *   js/shadow/overlay/
 *   └── shadow-card-renderer.js  ← YOU ARE HERE
 *            │
 *            ├─ IMPORTS FROM:
 *            │   ├─ shadow-state-manager.js (getCurrentShadows, getShadowState)
 *            │   └─ shadow-card-templates.js (createShadowCardHtml, createEmptyStateHtml)
 *            │
 *            └─ USED BY:
 *                ├─ shadow-overlay-controller.js (calls render on open)
 *                └─ shadow-source-toggle.js (calls render on source change)
 *
 * GOTCHAS & WARNINGS:
 * ───────────────────
 * ⚠️ Templates module must load BEFORE this module
 * ⚠️ State manager must load BEFORE this module
 * ⚠️ Don't mix template logic here - put HTML generation in templates module
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE WRAPPER (IIFE to avoid global scope pollution)
// ═══════════════════════════════════════════════════════════════════════════════
(function (global) {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════════════
    // DEPENDENCIES
    // ═══════════════════════════════════════════════════════════════════════════════

    /**
     * Get State Manager singleton for shadow data access.
     *
     * WHY: State manager is the single source of truth for shadow data.
     * We access it lazily to handle load order flexibility.
     *
     * @returns {Object} ShadowStateManager instance or fallback
     */
    const getStateManager = () => global.ShadowStateManager || {
        getCurrentShadows: () => [],
        getShadowState: () => ({ aiShadows: [] })
    };

    /**
     * Get Templates module for HTML generation.
     *
     * WHY: Templates were extracted to separate module in v2.0.
     * This keeps HTML generation separate from event handling.
     *
     * @returns {Object} ShadowCardTemplates instance or fallback
     */
    const getTemplates = () => global.ShadowCardTemplates || {
        createShadowCardHtml: (shadow) => `<div class="shadow-card">${shadow.name || 'Unknown'}</div>`,
        createEmptyStateHtml: () => '<div class="shadow-overlay-empty">No shadows</div>'
    };

    // ═══════════════════════════════════════════════════════════════════════════════
    // TEMPLATE DELEGATION
    // ═══════════════════════════════════════════════════════════════════════════════

    /**
     * HTML generation is delegated to shadow-card-templates.js
     *
     * WHY: Templates were extracted in v2.0 for cleaner separation of concerns.
     * This module focuses on ORCHESTRATION (when to render, how to animate,
     * who handles events), while templates handle GENERATION (what HTML to produce).
     *
     * SEE: js/shadow/overlay/shadow-card-templates.js for:
     *   - createShadowCardHtml(shadow)
     *   - createEmptyStateHtml(hasAIGenerated)
     *   - createFaceChip(faceId, energy)
     *   - formatPrescriptions(prescriptions)
     *   - etc.
     */

    // ═══════════════════════════════════════════════════════════════════════════════
    // CARD RENDERING
    // ═══════════════════════════════════════════════════════════════════════════════

    /**
     * Render shadow cards into the overlay content area.
     *
     * WHY: This is the main entry point for rendering. It orchestrates:
     * 1. Getting current shadow data from state manager
     * 2. Generating HTML via templates module
     * 3. Setting up all interactive behaviors
     *
     * @param {HTMLElement} containerElement - The container to render into
     * @param {Function} onCardClick - Callback when card is clicked (receives shadow)
     */
    function renderShadowCards(containerElement, onCardClick) {
        if (!containerElement) {
            Logger.warn('Shadow:CardRenderer', 'No container element provided');
            return;
        }

        const stateManager = getStateManager();
        const templates = getTemplates();
        const currentShadows = stateManager.getCurrentShadows();
        const shadowState = stateManager.getShadowState();

        // Empty state
        if (currentShadows.length === 0) {
            const hasAIGenerated = shadowState.aiShadows.length > 0;
            containerElement.innerHTML = templates.createEmptyStateHtml(hasAIGenerated);
            return;
        }

        // Render shadow cards using templates module
        const cardsHtml = currentShadows.map(shadow => templates.createShadowCardHtml(shadow)).join('');
        containerElement.innerHTML = cardsHtml;

        // Setup card interactions
        setupCardInteractions(containerElement, currentShadows, onCardClick);
    }

    /**
     * Setup all interactive behaviors on rendered cards.
     *
     * WHY: Cards need multiple interaction patterns:
     * 1. Perspective toggle (Shadow ↔ Gift)
     * 2. Expand/collapse details
     * 3. Navigate to 3D view
     * 4. Card click for general selection
     *
     * @param {HTMLElement} container - Container with rendered cards
     * @param {Array} shadows - Shadow data array
     * @param {Function} onCardClick - Callback for card clicks
     */
    function setupCardInteractions(container, shadows, onCardClick) {
        container.querySelectorAll('.shadow-card').forEach((card, index) => {
            const shadow = shadows[index];

            // Card click -> focus face in 3D view
            card.addEventListener('click', (e) => {
                // Don't trigger if clicking interactive elements
                if (e.target.closest('.shadow-card__toggle-perspective')) return;
                if (e.target.closest('.shadow-card__navigate-btn')) return;
                if (e.target.closest('.shadow-card__header')) return; // Header has its own handler

                if (onCardClick && typeof onCardClick === 'function') {
                    onCardClick(shadow);
                }
            });

            // Setup all interaction handlers
            setupPerspectiveToggle(card);
            setupExpandCollapse(card);
            setupNavigateButton(card, shadow);
        });
    }

    /**
     * Setup the Shadow/Gift perspective toggle on a card.
     *
     * WHY: Each shadow card has dual forms following Jungian psychology:
     * - The shadow (suppressed): The challenge, the problem
     * - The gift (integrated): The transformation, the opportunity
     *
     * This toggle lets users flip between perspectives.
     *
     * CRITICAL: Uses BEM class names (.shadow-card__suppressed) not
     * legacy names (.shadow-suppressed) - this fixes the toggle bug!
     *
     * @param {HTMLElement} card - The shadow card element
     */
    function setupPerspectiveToggle(card) {
        // Use BEM naming convention (fixes toggle bug!)
        const toggleBtn = card.querySelector('.shadow-card__toggle-perspective');
        const suppressedDiv = card.querySelector('.shadow-card__suppressed');
        const integratedDiv = card.querySelector('.shadow-card__integrated');

        if (!toggleBtn || !suppressedDiv || !integratedDiv) return;

        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isShowingShadow = suppressedDiv.classList.contains('active');

            if (isShowingShadow) {
                // Switch to Gift view
                suppressedDiv.classList.remove('active');
                integratedDiv.classList.add('active');
                toggleBtn.textContent = 'See Shadow';
                card.classList.add('showing-gift');
            } else {
                // Switch back to Shadow view
                integratedDiv.classList.remove('active');
                suppressedDiv.classList.add('active');
                toggleBtn.textContent = 'See Gift';
                card.classList.remove('showing-gift');
            }
        });
    }

    /**
     * Setup expand/collapse toggle on card header.
     *
     * WHY: Details are rich but potentially overwhelming. Progressive
     * disclosure lets users see summary first, then dive deeper.
     *
     * ACCESSIBILITY:
     * - Uses aria-expanded attribute
     * - Keyboard navigable (Enter/Space)
     * - Focus visible states (via CSS)
     *
     * @param {HTMLElement} card - The shadow card element
     */
    function setupExpandCollapse(card) {
        const header = card.querySelector('.shadow-card__header');
        const details = card.querySelector('.shadow-card__details');

        if (!header) return;

        header.addEventListener('click', (e) => {
            // Don't toggle if clicking the toggle-perspective button
            if (e.target.closest('.shadow-card__toggle-perspective')) return;

            const isExpanded = card.classList.toggle('expanded');
            header.setAttribute('aria-expanded', isExpanded);

            if (details) {
                details.setAttribute('aria-hidden', !isExpanded);
            }
        });

        // Keyboard accessibility
        header.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                // Don't trigger if focus is on the toggle button
                if (e.target.closest('.shadow-card__toggle-perspective')) return;

                e.preventDefault();
                header.click();
            }
        });
    }

    /**
     * Setup the "Focus in 3D" navigate button.
     *
     * WHY: Shadows are spatial - they exist between faces. The 3D view
     * reveals this relationship visually. This button bridges the
     * abstract (text) and the spatial (geometry).
     *
     * BEHAVIOR:
     * 1. Rotates dodecahedron to focus on first affected face
     * 2. Highlights all affected faces with red glow
     * 3. Closes overlay to reveal 3D view
     *
     * @param {HTMLElement} card - The shadow card element
     * @param {Object} shadow - The shadow data object
     */
    function setupNavigateButton(card, shadow) {
        const btn = card.querySelector('.shadow-card__navigate-btn');
        if (!btn) return;

        btn.addEventListener('click', (e) => {
            e.stopPropagation();

            const faceIds = shadow.involvedFaces || shadow.affectedFaces || [];
            if (faceIds.length === 0) {
                Logger.warn('Shadow:CardRenderer', 'No faces to navigate to');
                return;
            }

            // Access Quannex global for 3D control
            const quannex = global.Quannex || global.quannexEngine;
            if (quannex?.focusOnFace) {
                // Focus on first affected face
                quannex.focusOnFace(faceIds[0]);

                // Highlight all affected faces with red glow
                faceIds.forEach(id => {
                    quannex.highlightFace?.(id, { color: 0xff4444, duration: 2000 });
                });
            }

            // Close overlay to reveal 3D view
            const controller = global.ShadowOverlayController;
            controller?.close?.();
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // CARD TRANSITIONS
    // ═══════════════════════════════════════════════════════════════════════════════

    /**
     * Animate card transition when switching between shadow sources.
     *
     * WHY: When switching between Template and AI shadows, we want a
     * smooth visual transition rather than a jarring content swap.
     * This creates continuity and helps users understand the change.
     *
     * ANIMATION SEQUENCE:
     * 1. Fade out existing cards (200ms)
     * 2. Re-render with new source data
     * 3. Stagger fade-in new cards (50ms delay each)
     *
     * @param {HTMLElement} container - Container with cards
     * @param {Function} onCardClick - Callback for card clicks
     */
    function transitionCards(container, onCardClick) {
        if (!container) return;

        // Get all current cards
        const cards = container.querySelectorAll('.shadow-card');

        // Fade out existing cards
        cards.forEach(card => card.classList.add('transitioning'));

        // After fade out, re-render with new source
        setTimeout(() => {
            renderShadowCards(container, onCardClick);

            // Fade in new cards with stagger
            const newCards = container.querySelectorAll('.shadow-card');
            newCards.forEach((card, i) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(10px)';

                setTimeout(() => {
                    card.style.transition = 'all 0.3s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, i * 50); // Stagger animation for visual flow
            });
        }, 200);
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // EXPORTS
    // ═══════════════════════════════════════════════════════════════════════════════

    /**
     * Export to window for module integration.
     *
     * WHY: This module uses IIFE pattern (not ES modules) for browser
     * compatibility. Exporting to window.ShadowCardRenderer makes
     * it available to other shadow overlay modules.
     *
     * NOTE: HTML generation functions are now in ShadowCardTemplates.
     * This module focuses on orchestration and interaction handling.
     */
    global.ShadowCardRenderer = {
        // Rendering orchestration
        renderShadowCards,
        transitionCards,

        // Interaction handlers
        setupCardInteractions,
        setupPerspectiveToggle,
        setupExpandCollapse,
        setupNavigateButton
    };

    Logger.debug('Shadow:CardRenderer', 'Module loaded (v2.0 - using templates)');

})(typeof window !== 'undefined' ? window : this);
