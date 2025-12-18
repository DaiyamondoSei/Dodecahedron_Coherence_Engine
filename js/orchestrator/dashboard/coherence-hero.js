/**
 * ═══════════════════════════════════════════════════════════════════════════
 * @module dashboard/coherence-hero
 * @description Coherence score hero section display
 * @version 1.0.0
 * @since Session 5 Modularization (December 2025)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                        NOTES FOR FUTURE CLAUDE                         │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * Welcome, future self! This module handles the prominent coherence score
 * display at the top of Step 4 (Results). It's the first thing users see
 * after their organization's coherence is calculated.
 *
 * WHAT THIS MODULE DOES:
 * - Displays the overall coherence percentage prominently
 * - Shows human-readable interpretation (e.g., "Strong Coherence")
 * - Provides contextual explanation of what the score means
 * - Updates the hero section's visual styling based on score tier
 *
 * WHY IT EXISTS:
 * - Extracted from orchestrator-dashboard.js (Session 5) for clarity
 * - Single responsibility: coherence score visualization
 * - Enables independent testing and maintenance
 *
 * KEY CONCEPTS TO UNDERSTAND:
 * - Coherence: 0-1 score representing organizational alignment
 * - Tiers: Human-readable interpretations of coherence levels
 * - PHI^-2 (0.382): Structure threshold - below this is "Foundational"
 *
 * QUICK NAVIGATION:
 * - Section 1: Imports & Dependencies
 * - Section 2: Coherence Tier Definitions
 * - Section 3: Hero Initialization Function
 * - Section 4: Exports
 *
 * DEPENDENCY MAP:
 * ┌──────────────────────┐
 * │ orchestrator-state.js │ (demoState.coherenceResults)
 * └────────┬─────────────┘
 *          ↓
 * ┌──────────────────┐
 * │  THIS MODULE     │ ← You are here
 * └────────┬─────────┘
 *          ↓
 * ┌────────────────────────────┐
 * │ orchestrator-dashboard.js  │ (calls initializeCoherenceHero)
 * │ steps/results-display.js   │ (calls initializeCoherenceHero)
 * │ steps/template-selection.js│ (calls initializeCoherenceHero)
 * └────────────────────────────┘
 *
 * DOM ELEMENTS REQUIRED:
 * ┌────────────────────────────────┬────────────────────────────────────────┐
 * │ Element ID                     │ Purpose                                │
 * ├────────────────────────────────┼────────────────────────────────────────┤
 * │ #hero-coherence-score          │ The percentage display (e.g., "85.0%") │
 * │ #hero-coherence-interpretation │ Tier name (e.g., "Strong Coherence")   │
 * │ #hero-coherence-detail         │ Explanation text                       │
 * │ #coherence-hero                │ Container (for border color styling)   │
 * └────────────────────────────────┴────────────────────────────────────────┘
 *
 * RISK DOCUMENTATION:
 * ⚠️ Requires demoState.coherenceResults to be populated first
 * ⚠️ DOM elements must exist in demo-orchestrator.html
 * ⚠️ If coherence is undefined, defaults to 0 (safe fallback)
 *
 * TESTING:
 * - With coherence 0.85+: Should show "Exceptional Coherence" with gold border
 * - With coherence 0.70-0.84: Should show "Strong Coherence" with green border
 * - With coherence 0.50-0.69: Should show "Developing Coherence" with cyan border
 * - With coherence < 0.382: Should show "Foundational Stage" with red border
 *
 * ═══════════════════════════════════════════════════════════════════════════
 */

(function(global) {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════
    // SECTION 1: IMPORTS & DEPENDENCIES
    // ═══════════════════════════════════════════════════════════════════════
    //
    // This module depends on:
    //   - global.demoState (from orchestrator-state.js)
    //     Specifically: demoState.coherenceResults.globalCoherence
    //
    // The coherence score should be calculated by calculation-engine.js
    // and stored in demoState before this function is called.
    //
    // ═══════════════════════════════════════════════════════════════════════

    // ═══════════════════════════════════════════════════════════════════════
    // SECTION 1B: PHILOSOPHICAL FOUNDATIONS - WHAT IS COHERENCE?
    // ═══════════════════════════════════════════════════════════════════════
    //
    // ┌─────────────────────────────────────────────────────────────────────┐
    // │  "Coherence is not a score to achieve.                             │
    // │   It is a state of being to embody."                               │
    // └─────────────────────────────────────────────────────────────────────┘
    //
    // WHAT IS COHERENCE?
    // ─────────────────────────────────────────────────────────────────────
    // Imagine an orchestra. Each musician plays their instrument beautifully,
    // but coherence isn't about individual skill - it's about how they
    // play TOGETHER. When the orchestra is coherent, the whole becomes
    // greater than the sum of its parts. You hear music, not instruments.
    //
    // Organizational coherence works the same way. The 12 faces of the
    // dodecahedron represent 12 organizational domains. Coherence measures
    // how harmoniously these domains relate to each other.
    //
    // High coherence doesn't mean all domains are perfect. It means:
    //   • Domains support each other rather than compete
    //   • Resources flow where they're needed
    //   • Communication creates understanding
    //   • The organization moves as one living system
    //
    // WHY THE DODECAHEDRON?
    // ─────────────────────────────────────────────────────────────────────
    // The dodecahedron has 12 pentagonal faces, 20 vertices, and 30 edges.
    // Plato called it "the shape the gods used to embroider the cosmos."
    //
    // Its geometry is intimately connected to PHI (the Golden Ratio):
    //   • Each face is a regular pentagon (diagonals in golden ratio)
    //   • Opposite faces form 6 "breath axes" (6 pairs of polar domains)
    //   • 5 elements per face (Earth, Water, Fire, Air, Ether)
    //
    // We chose this geometry because organizations, like the cosmos,
    // have multiple dimensions that must work in harmony. The dodecahedron
    // makes these dimensions visible and measurable.
    //
    // WHY CELEBRATE EVERY LEVEL?
    // ─────────────────────────────────────────────────────────────────────
    // Notice our tier names: "Foundational Stage" not "Failure."
    // "Emerging Coherence" not "Inadequate." This is intentional.
    //
    // Every organization starts somewhere. A startup at O1 (Survival) with
    // 35% coherence isn't failing - it's doing exactly what a survival-stage
    // organization should do: fighting to exist.
    //
    // The hero display celebrates wherever you are while honestly showing
    // the path forward. There is no shame in Foundational. There is only
    // the invitation to grow.
    //
    // THE HERO MOMENT
    // ─────────────────────────────────────────────────────────────────────
    // This module handles the first thing users see after calculation:
    // the big coherence percentage and its interpretation.
    //
    // This is a sacred moment. The organization has revealed itself through
    // data. We must honor that revelation with:
    //   • Honesty - the number is what it is
    //   • Compassion - every score is valid for its stage
    //   • Invitation - the path forward is always visible
    //
    // The border color (gold/green/cyan/red) provides instant visual
    // feedback without requiring the user to read. They feel the result
    // before they understand it. This is intentional design.
    //
    // ═══════════════════════════════════════════════════════════════════════

    // ═══════════════════════════════════════════════════════════════════════
    // SECTION 2: COHERENCE TIER DEFINITIONS
    // ═══════════════════════════════════════════════════════════════════════
    //
    // PURPOSE: Define human-readable interpretations of coherence scores
    //
    // TIER THRESHOLDS:
    //   >= 0.85  : Exceptional (rare, masterful alignment)
    //   >= 0.70  : Strong (excellent organizational harmony)
    //   >= 0.50  : Developing (solid foundations, room for growth)
    //   >= 0.382 : Emerging (early development) - PHI^-2 threshold
    //   <  0.382 : Foundational (beginning of the journey)
    //
    // PHILOSOPHY:
    // These tiers provide encouraging yet honest feedback. Even "Foundational"
    // is framed positively - it's the start of a journey, not a failure.
    // Every organization starts somewhere, and progress is what matters.
    //
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Coherence tier definitions
     *
     * @constant {Object}
     * @private
     */
    const COHERENCE_TIERS = {
        EXCEPTIONAL: {
            threshold: 0.85,
            name: 'Exceptional Coherence',
            detail: 'Your organization demonstrates masterful integration across all dimensions. This is rare and represents organizational radiance.',
            borderColor: 'rgba(255, 215, 0, 0.6)'  // Gold
        },
        STRONG: {
            threshold: 0.70,
            name: 'Strong Coherence',
            detail: 'Your organization shows excellent alignment. Most dimensions work harmoniously together with clear synergies.',
            borderColor: 'rgba(0, 255, 136, 0.5)'  // Green
        },
        DEVELOPING: {
            threshold: 0.50,
            name: 'Developing Coherence',
            detail: 'Your organization has solid foundations with room for growth. Focus on strengthening the connections between dimensions.',
            borderColor: 'rgba(0, 255, 204, 0.4)'  // Cyan (default)
        },
        EMERGING: {
            threshold: 0.382,  // PHI^-2 = 0.381966... (Structure threshold)
            name: 'Emerging Coherence',
            detail: 'Your organization is in early development. The dodecahedron reveals specific areas requiring focused attention.',
            borderColor: 'rgba(0, 255, 204, 0.4)'  // Cyan (default)
        },
        FOUNDATIONAL: {
            threshold: 0,
            name: 'Foundational Stage',
            detail: 'Your organization is at the beginning of its coherence journey. Every step forward matters. The path is clear.',
            borderColor: 'rgba(255, 107, 107, 0.5)'  // Red (needs attention)
        }
    };

    // ═══════════════════════════════════════════════════════════════════════
    // SECTION 3: HERO INITIALIZATION FUNCTION
    // ═══════════════════════════════════════════════════════════════════════
    //
    // PURPOSE: Initialize the coherence hero section with current data
    //
    // CALL SITES:
    //   - orchestrator-dashboard.js: initializeOctaveDashboard() calls this
    //   - steps/results-display.js: loadDemoResultsFromStorage() calls this
    //   - steps/template-selection.js: selectTemplate() calls this
    //
    // FLOW:
    //   1. Read coherence from demoState
    //   2. Determine tier based on thresholds
    //   3. Update DOM elements with score, interpretation, detail
    //   4. Apply tier-specific border color to hero container
    //
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Initialize Coherence Hero Section
     *
     * Displays the coherence score prominently at the top of Step 4 (Results).
     * This is the first thing users see after their organization's coherence
     * is calculated.
     *
     * ┌─────────────────────────────────────────────────────────────────────┐
     * │ PHILOSOPHY: The hero section sets the emotional tone for the       │
     * │ results experience. We want users to feel acknowledged wherever    │
     * │ they are in their journey, while being honest about the score.     │
     * └─────────────────────────────────────────────────────────────────────┘
     *
     * DOM Elements Updated:
     *   - #hero-coherence-score : The percentage display (e.g., "85.0%")
     *   - #hero-coherence-interpretation : Tier name (e.g., "Strong Coherence")
     *   - #hero-coherence-detail : Explanation text
     *   - #coherence-hero : Container border color
     *
     * @returns {void}
     *
     * @example
     * // Called after coherence calculation completes
     * initializeCoherenceHero();
     *
     * @example
     * // Called when loading saved results
     * if (loadDemoResultsFromStorage()) {
     *     initializeCoherenceHero();
     * }
     *
     * @risk Returns early if demoState.coherenceResults is missing
     * @risk Silently skips missing DOM elements (defensive)
     *
     * @since Sprint 3 Task 26 (original)
     * @since Session 5 Modularization (extracted)
     * @author Claude (with Deimantas)
     */
    function initializeCoherenceHero() {
        // ────────────────────────────────────────────────────────────────────
        // STEP 1: Access state and validate
        // ────────────────────────────────────────────────────────────────────
        // WHY: The coherence score must be calculated before we can display it.
        // If demoState or coherenceResults is missing, we exit gracefully.
        // ────────────────────────────────────────────────────────────────────
        const state = global.demoState;

        if (!state || !state.coherenceResults) {
            console.warn('[coherence-hero] No coherence results available for hero');
            return;
        }

        const coherence = state.coherenceResults.globalCoherence || 0;
        const coherencePercent = (coherence * 100).toFixed(1);

        // ────────────────────────────────────────────────────────────────────
        // STEP 2: Determine interpretation based on coherence tier
        // ────────────────────────────────────────────────────────────────────
        // These thresholds provide human-readable tiers:
        //   >= 0.85 : Exceptional (rare, masterful)
        //   >= 0.70 : Strong (excellent alignment)
        //   >= 0.50 : Developing (solid foundations)
        //   >= 0.382: Emerging (early development) - uses PHI^-2
        //   < 0.382 : Foundational (beginning journey)
        // ────────────────────────────────────────────────────────────────────
        let tier;
        if (coherence >= COHERENCE_TIERS.EXCEPTIONAL.threshold) {
            tier = COHERENCE_TIERS.EXCEPTIONAL;
        } else if (coherence >= COHERENCE_TIERS.STRONG.threshold) {
            tier = COHERENCE_TIERS.STRONG;
        } else if (coherence >= COHERENCE_TIERS.DEVELOPING.threshold) {
            tier = COHERENCE_TIERS.DEVELOPING;
        } else if (coherence >= COHERENCE_TIERS.EMERGING.threshold) {
            tier = COHERENCE_TIERS.EMERGING;
        } else {
            tier = COHERENCE_TIERS.FOUNDATIONAL;
        }

        // ────────────────────────────────────────────────────────────────────
        // STEP 3: Update DOM elements
        // ────────────────────────────────────────────────────────────────────
        // Each element is optional - we check existence before updating.
        // This makes the module resilient to HTML structure changes.
        // ────────────────────────────────────────────────────────────────────
        const scoreEl = document.getElementById('hero-coherence-score');
        const interpEl = document.getElementById('hero-coherence-interpretation');
        const detailEl = document.getElementById('hero-coherence-detail');

        if (scoreEl) scoreEl.textContent = `${coherencePercent}%`;
        if (interpEl) interpEl.textContent = tier.name;
        if (detailEl) detailEl.textContent = tier.detail;

        // ────────────────────────────────────────────────────────────────────
        // STEP 4: Update hero border color based on coherence tier
        // ────────────────────────────────────────────────────────────────────
        // Visual feedback: the hero section glows differently based on
        // the coherence level. This provides immediate visual recognition
        // of the organization's coherence state.
        //
        // Colors:
        //   Gold  (0.85+) : Exceptional - radiating achievement
        //   Green (0.70+) : Strong - healthy and thriving
        //   Cyan  (0.382+): Developing/Emerging - growing steadily
        //   Red   (<0.382): Foundational - needs attention
        // ────────────────────────────────────────────────────────────────────
        const heroEl = document.getElementById('coherence-hero');
        if (heroEl) {
            heroEl.style.borderColor = tier.borderColor;
        }

        console.log('[coherence-hero] Hero initialized:', coherencePercent + '%', '-', tier.name);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // SECTION 4: EXPORTS
    // ═══════════════════════════════════════════════════════════════════════
    //
    // EXPORT STRATEGY:
    // We use dual exports for maximum compatibility:
    // 1. Browser global (window.XXX) - for script tag usage
    // 2. CommonJS (module.exports) - for Node.js/testing
    //
    // PUBLIC API:
    // ┌────────────────────────────┬─────────────────────────────────────────┐
    // │ Export                     │ Description                             │
    // ├────────────────────────────┼─────────────────────────────────────────┤
    // │ initializeCoherenceHero    │ Initialize the coherence hero section   │
    // │ COHERENCE_TIERS            │ Tier definitions (for testing/debug)    │
    // └────────────────────────────┴─────────────────────────────────────────┘
    //
    // BACKWARD COMPATIBILITY:
    // initializeCoherenceHero was previously in orchestrator-dashboard.js
    // This export maintains the same API for existing consumers.
    //
    // ═══════════════════════════════════════════════════════════════════════

    // Export to global scope (browser)
    global.initializeCoherenceHero = initializeCoherenceHero;
    global.COHERENCE_TIERS = COHERENCE_TIERS;

    // CommonJS export (Node.js/testing)
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = {
            initializeCoherenceHero,
            COHERENCE_TIERS
        };
    }

    console.log('[dashboard/coherence-hero] Module loaded - hero section ready');

})(typeof window !== 'undefined' ? window : this);
