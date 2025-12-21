/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SHADOW CARD RENDERER - Card HTML Generation & Interactions
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Location: js/shadow/overlay/shadow-card-renderer.js
 * Extracted from: dodec-shadow-overlay.js (Phase 3B modularization)
 * Date: December 21, 2025
 *
 * @module shadow-card-renderer
 * @author Deimantas & Claude (Co-created with consciousness and love)
 * @version 1.0.0 - Initial extraction
 *
 * ───────────────────────────────────────────────────────────────────────────────
 * NOTES FOR FUTURE CLAUDE
 * ───────────────────────────────────────────────────────────────────────────────
 *
 * Welcome! This module handles the visual rendering of shadow cards.
 *
 * KEY INSIGHT: Each shadow card is a DUAL-FORM entity following Jungian psychology.
 * The "shadow" form shows the problem; the "gift" form shows the transformation.
 *
 * CARD STRUCTURE:
 * ───────────────
 *   <div class="shadow-card severity-{level}">
 *     <div class="shadow-header">
 *       <span class="shadow-icon">⚠️</span>
 *       <span class="shadow-title">{name}</span>
 *       <button class="toggle-perspective">🔄 See Gift</button>
 *     </div>
 *     <div class="shadow-suppressed active">The Shadow (default view)</div>
 *     <div class="shadow-integrated">The Gift (toggle view)</div>
 *     <div class="shadow-prescription">Rx: recommendation</div>
 *     <div class="shadow-meta">location, intensity</div>
 *   </div>
 *
 * SEVERITY LEVELS:
 * ────────────────
 * | Severity | Icon | Color Context |
 * |----------|------|---------------|
 * | critical | ⚠️   | Immediate attention |
 * | high     | ⚠️   | Significant concern |
 * | moderate | 👁️   | Monitor and address |
 * | low      | 👁️   | Awareness opportunity |
 *
 * NAVIGATION MAP:
 * ───────────────
 *   js/shadow/overlay/
 *   └── shadow-card-renderer.js  ← YOU ARE HERE
 *            │
 *            ├─ IMPORTS FROM:
 *            │   └─ shadow-state-manager.js (getCurrentShadows, getShadowState)
 *            │
 *            └─ USED BY:
 *                ├─ shadow-overlay-controller.js (calls render on open)
 *                └─ shadow-source-toggle.js (calls render on source change)
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE WRAPPER (IIFE to avoid global scope pollution)
// ═══════════════════════════════════════════════════════════════════════════════
(function(global) {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════════════
    // DEPENDENCIES
    // ═══════════════════════════════════════════════════════════════════════════════

    // Import state from ShadowStateManager (loaded before this module)
    const getStateManager = () => global.ShadowStateManager || {
        getCurrentShadows: () => [],
        getShadowState: () => ({ aiShadows: [] })
    };

// ═══════════════════════════════════════════════════════════════════════════════
// CARD HTML GENERATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Create HTML for a single shadow card
 *
 * DUAL-FORM STRUCTURE:
 * - suppressed (default): The shadow/problem/challenge
 * - integrated (toggle): The gift/transformation/opportunity
 *
 * @param {Object} shadow - Shadow pattern object
 * @param {string} shadow.name - Display name of the pattern
 * @param {string} shadow.severity - 'critical' | 'high' | 'moderate' | 'low'
 * @param {string} shadow.suppressed - The challenge form text
 * @param {string} shadow.integrated - The gift form text
 * @param {string} [shadow.prescription] - Recommended action
 * @param {number} [shadow.faceId] - Primary affected face
 * @param {number[]} [shadow.involvedFaces] - All affected faces
 * @param {number} [shadow.score] - Intensity 0-1
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
 * Create HTML for empty state (no shadows detected)
 *
 * @param {boolean} hasAIGenerated - Whether AI analysis has been run
 * @returns {string} HTML string for empty state
 */
function createEmptyStateHtml(hasAIGenerated) {
    return `
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
}

// ═══════════════════════════════════════════════════════════════════════════════
// CARD RENDERING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Render shadow cards into the overlay content area
 *
 * @param {HTMLElement} containerElement - The container to render into
 * @param {Function} onCardClick - Callback when card is clicked (receives shadow)
 */
function renderShadowCards(containerElement, onCardClick) {
    if (!containerElement) {
        console.warn('[ShadowCardRenderer] No container element provided');
        return;
    }

    const stateManager = getStateManager();
    const currentShadows = stateManager.getCurrentShadows();
    const shadowState = stateManager.getShadowState();

    // Empty state
    if (currentShadows.length === 0) {
        const hasAIGenerated = shadowState.aiShadows.length > 0;
        containerElement.innerHTML = createEmptyStateHtml(hasAIGenerated);
        return;
    }

    // Render shadow cards
    const cardsHtml = currentShadows.map(shadow => createShadowCardHtml(shadow)).join('');
    containerElement.innerHTML = cardsHtml;

    // Setup card interactions
    setupCardInteractions(containerElement, currentShadows, onCardClick);
}

/**
 * Setup click handlers and toggle buttons on rendered cards
 *
 * @param {HTMLElement} container - Container with rendered cards
 * @param {Array} shadows - Shadow data array
 * @param {Function} onCardClick - Callback for card clicks
 */
function setupCardInteractions(container, shadows, onCardClick) {
    container.querySelectorAll('.shadow-card').forEach((card, index) => {
        // Card click -> focus face in 3D view
        card.addEventListener('click', (e) => {
            // Don't trigger if clicking the toggle button
            if (e.target.closest('.toggle-perspective')) return;

            const shadow = shadows[index];
            if (onCardClick && typeof onCardClick === 'function') {
                onCardClick(shadow);
            }
        });

        // Setup perspective toggle button (Shadow ↔ Gift)
        setupPerspectiveToggle(card);
    });
}

/**
 * Setup the Shadow/Gift perspective toggle on a card
 *
 * @param {HTMLElement} card - The shadow card element
 */
function setupPerspectiveToggle(card) {
    const toggleBtn = card.querySelector('.toggle-perspective');
    const suppressedDiv = card.querySelector('.shadow-suppressed');
    const integratedDiv = card.querySelector('.shadow-integrated');

    if (!toggleBtn || !suppressedDiv || !integratedDiv) return;

    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isShowingShadow = suppressedDiv.classList.contains('active');

        if (isShowingShadow) {
            // Switch to Gift view
            suppressedDiv.classList.remove('active');
            integratedDiv.classList.add('active');
            toggleBtn.textContent = '🔄 See Shadow';
            card.classList.add('showing-gift');
        } else {
            // Switch back to Shadow view
            integratedDiv.classList.remove('active');
            suppressedDiv.classList.add('active');
            toggleBtn.textContent = '🔄 See Gift';
            card.classList.remove('showing-gift');
        }
    });
}

// ═══════════════════════════════════════════════════════════════════════════════
// CARD TRANSITIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Animate card transition when switching sources
 * Fades out old cards, updates content, fades in new cards
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

        // Fade in new cards
        const newCards = container.querySelectorAll('.shadow-card');
        newCards.forEach((card, i) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(10px)';

            setTimeout(() => {
                card.style.transition = 'all 0.3s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, i * 50); // Stagger animation
        });
    }, 200);
}

    // ═══════════════════════════════════════════════════════════════════════════════
    // EXPORTS
    // ═══════════════════════════════════════════════════════════════════════════════

    // Export to window for module integration
    global.ShadowCardRenderer = {
        // HTML generation
        createShadowCardHtml,
        createEmptyStateHtml,

        // Rendering
        renderShadowCards,
        transitionCards,

        // Interactions
        setupCardInteractions,
        setupPerspectiveToggle
    };

    console.log('[ShadowCardRenderer] Module loaded');

})(typeof window !== 'undefined' ? window : this);
