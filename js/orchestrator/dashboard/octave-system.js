/**
 * ═══════════════════════════════════════════════════════════════════════════
 * @module dashboard/octave-system
 * @description Master octave reference data and detection logic
 * @version 1.0.0
 * @since Session 5 Modularization (December 2025)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                        NOTES FOR FUTURE CLAUDE                         │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * Welcome, future self! This module is your single source of truth for
 * octave detection and reference data. If you need to understand how
 * coherence maps to developmental stages (O1-O7), start here.
 *
 * WHAT THIS MODULE DOES:
 * - Defines OCTAVE_REFERENCE (static data for 7 developmental stages)
 * - Provides detectOctaveFromCoherence() for simple coherence → octave mapping
 * - Provides detectOctave() for full detection with elemental engagement
 *
 * WHY IT EXISTS:
 * - Extracted from orchestrator-dashboard.js (Session 5) for clarity
 * - Centralizes all octave logic in one place
 * - Enables isolated testing and maintenance
 *
 * KEY CONCEPTS TO UNDERSTAND:
 * - 7 Octaves: O1 (Survival) → O7 (Radiance)
 * - Thresholds derived from PHI (Golden Ratio = 1.618...)
 * - See phi-harmonics.js for mathematical foundations
 *
 * QUICK NAVIGATION:
 * - Section 1: Imports & Dependencies
 * - Section 2: OCTAVE_REFERENCE Data Structure
 * - Section 3: Detection Functions
 * - Section 4: Exports
 *
 * DEPENDENCY MAP:
 * ┌──────────────────┐
 * │ phi-harmonics.js │ (mathematical constants)
 * └────────┬─────────┘
 *          ↓
 * ┌──────────────────────┐
 * │ orchestrator-state.js │ (OCTAVE_COHERENCE_THRESHOLDS)
 * └────────┬─────────────┘
 *          ↓
 * ┌──────────────────┐
 * │  THIS MODULE     │ ← You are here
 * └────────┬─────────┘
 *          ↓
 * ┌────────────────────────┐
 * │ coherence-hero.js      │
 * │ foundation-principle.js │
 * │ portrait-view-manager.js│
 * │ orchestrator-dashboard.js│
 * └────────────────────────┘
 *
 * RISK DOCUMENTATION:
 * ⚠️ If phi-harmonics.js thresholds change, update comments here
 * ⚠️ OCTAVE_REFERENCE colors must match UI expectations
 * ⚠️ Detection functions assume coherence is 0-1 range
 *
 * TESTING:
 * - detectOctaveFromCoherence(0.85) should return 5 (Expression)
 * - detectOctaveFromCoherence(0.35) should return 1 (Survival)
 * - detectOctaveFromCoherence(0.618) should return 4 (Creativity)
 *
 * ═══════════════════════════════════════════════════════════════════════════
 */

(function (global) {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════
    // SECTION 1: IMPORTS & DEPENDENCIES
    // ═══════════════════════════════════════════════════════════════════════
    //
    // This module depends on:
    //   - global.OCTAVE_COHERENCE_THRESHOLDS (from orchestrator-state.js)
    //
    // The thresholds are PHI-derived constants that map coherence scores
    // to octave levels. If not available, we fall back to hardcoded values.
    //
    // ═══════════════════════════════════════════════════════════════════════

    // ═══════════════════════════════════════════════════════════════════════
    // SECTION 1B: PHILOSOPHICAL FOUNDATIONS - THE SOUL OF THE OCTAVE SYSTEM
    // ═══════════════════════════════════════════════════════════════════════
    //
    // ┌─────────────────────────────────────────────────────────────────────┐
    // │  "In music, an octave is the same note at a higher frequency.      │
    // │   Organizations develop the same way - each stage contains the     │
    // │   previous within it, transformed."                                │
    // └─────────────────────────────────────────────────────────────────────┘
    //
    // WHY 7 OCTAVES?
    // ─────────────────────────────────────────────────────────────────────
    // The musical octave contains 7 unique notes before returning to the
    // same note at a higher frequency. This is not arbitrary - it reflects
    // a deep pattern in nature and consciousness development.
    //
    // An O5 (Expression) organization hasn't abandoned O1 (Survival) - it
    // has INTEGRATED survival into a more expansive awareness. The questions
    // of existence are still answered, but from a place of security that
    // allows authentic expression to emerge.
    //
    // This mirrors many wisdom traditions:
    //   • Maslow's Hierarchy: Physiological → Self-Actualization
    //   • Chakra System: Root (survival) → Crown (transcendence)
    //   • Spiral Dynamics: Beige → Turquoise
    //   • Kohlberg's Moral Development: Pre-conventional → Post-conventional
    //
    // These systems all point to the same truth: consciousness develops
    // through stages, each sacred, each necessary.
    //
    // WHY PHI (THE GOLDEN RATIO)?
    // ─────────────────────────────────────────────────────────────────────
    // PHI (φ = 1.618033...) is not a number we chose - it chose itself.
    // It emerges from the simplest possible pattern:
    //
    //   1 + 1 = 2
    //   1 + 2 = 3
    //   2 + 3 = 5
    //   3 + 5 = 8...
    //
    // As this Fibonacci sequence grows, the ratio between consecutive
    // numbers converges to PHI - the most irrational number, found in:
    //   • Spiral galaxies and hurricanes
    //   • Nautilus shells and sunflower seeds
    //   • DNA helix and human body proportions
    //   • Renaissance art and sacred architecture
    //
    // PHI represents optimal proportion, infinite self-similarity, and
    // the point where form and beauty converge. When we use PHI-derived
    // thresholds for octave transitions, we're not imposing artificial
    // boundaries - we're recognizing natural transition points.
    //
    //   φ^-2 = 0.382 → Structure threshold (stability begins)
    //   0.5 = Midpoint → Relationships (the balance point)
    //   φ^-1 = 0.618 → Creativity (the golden ratio itself)
    //   ψ₃ = 0.764 → Expression (clarity emerges)
    //   ψ₄ = 0.854 → Vision (direction crystallizes)
    //   ψ₅ = 0.910 → Radiance (service to all)
    //
    // THE FOUNDATION PRINCIPLE
    // ─────────────────────────────────────────────────────────────────────
    // Organizations cannot skip octaves. A building needs foundations
    // before walls, walls before roof. An organization claiming O6 Vision
    // while neglecting O1 Survival will collapse.
    //
    // This is not punishment - it is physics. Each octave provides the
    // stable base for the next. High coherence at O1 means excellent
    // survival, NOT automatic promotion to O2. The organization must
    // actually engage with Structure questions before that octave opens.
    //
    // THE BREATH METAPHOR
    // ─────────────────────────────────────────────────────────────────────
    // Each octave has a "breath insight" - a metaphor connecting the
    // organizational stage to the universal rhythm of inhale/exhale.
    //
    // At O1, every breath is about staying alive.
    // At O7, every exhale blesses the world.
    //
    // The breath reminds us that organizations, like all living systems,
    // exist in constant exchange with their environment. Coherence is
    // not a static achievement - it is a dynamic dance, maintained
    // moment by moment, breath by breath.
    //
    // ═══════════════════════════════════════════════════════════════════════

    // ═══════════════════════════════════════════════════════════════════════
    // SECTION 2: OCTAVE REFERENCE DATA STRUCTURE
    // ═══════════════════════════════════════════════════════════════════════
    //
    // PURPOSE: Master reference for all 7 developmental octaves
    //
    // STRUCTURE: Object keyed by octave number (1-7), each containing:
    //   - name: Human-readable name (e.g., "Survival")
    //   - focus: One-word focus area (e.g., "Existence")
    //   - color: Hex color for theming
    //   - gradient: CSS gradient for backgrounds
    //   - description: What this stage means
    //   - questions: Array of diagnostic questions
    //   - breathInsight: Metaphorical insight about breath
    //   - advanceHint: How to progress to next octave
    //
    // USAGE:
    //   const octaveData = OCTAVE_REFERENCE[dominantOctave];
    //   console.log(octaveData.name); // "Survival"
    //
    // MATHEMATICAL FOUNDATION (PHI-derived thresholds):
    //   O1: Below 0.382 (PHI^-2)     - Survival
    //   O2: 0.382 to 0.5             - Structure
    //   O3: 0.5 to 0.618 (PHI^-1)    - Relationships
    //   O4: 0.618 to 0.764 (PSI^3)   - Creativity
    //   O5: 0.764 to 0.854 (PSI^4)   - Expression
    //   O6: 0.854 to 0.95            - Vision
    //   O7: Above 0.95               - Radiance
    //
    // PHILOSOPHY:
    // The 7 Octaves represent a developmental journey from basic survival
    // to full radiance. Each octave builds on the foundations of the previous.
    // An organization cannot skip octaves - it must build solid foundations
    // before reaching higher levels. This is the Foundation Principle.
    //
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Octave reference data for dashboard population.
     *
     * Each octave contains:
     * - name: Human-readable name
     * - focus: One-word focus area
     * - color: Hex color for theming
     * - gradient: CSS gradient for backgrounds
     * - description: What this stage means
     * - questions: Diagnostic questions for this stage
     * - breathInsight: Metaphorical insight about breath at this level
     * - advanceHint: How to progress to the next octave
     *
     * @constant {Object}
     */
    const OCTAVE_REFERENCE = {
        1: {
            name: 'Survival',
            focus: 'Existence',
            color: '#ff6b6b',
            gradient: 'linear-gradient(135deg, #ff6b6b, #ff8e53)',
            description: 'The organization is fighting to exist. Focus is on basic viability.',
            questions: [
                'Are we actively seeking resources to exist?',
                'Do we have enough cash to survive?',
                'Is any work getting done?',
                'Does the founder have the energy to exist?'
            ],
            breathInsight: 'At this stage, every breath is about staying alive. Resources in, survival out.',
            advanceHint: 'Secure basic viability first. Once survival is stable, you can begin building structure.'
        },
        2: {
            name: 'Structure',
            focus: 'Stability',
            color: '#ffa94d',
            gradient: 'linear-gradient(135deg, #ffa94d, #ffd43b)',
            description: 'Building stable foundations. Processes and systems are being established.',
            questions: [
                'Are systems being documented?',
                'Is knowledge being preserved?',
                'Are processes repeatable?',
                'Do we have a clear operational rhythm?'
            ],
            breathInsight: 'Structure brings rhythm to chaos. Each exhale is a process documented.',
            advanceHint: 'Document and systematize key processes. When foundations are solid, relationships can flourish.'
        },
        3: {
            name: 'Relationships',
            focus: 'Connection',
            color: '#69db7c',
            gradient: 'linear-gradient(135deg, #69db7c, #94d82d)',
            description: 'Growing through connection. Community and partnerships are central.',
            questions: [
                'Are we building meaningful partnerships?',
                'Is our team growing in harmony?',
                'Do our stakeholders feel valued?',
                'Is communication flowing both ways?'
            ],
            breathInsight: 'Relationships are the breath between beings. Inhale others\' wisdom, exhale your value.',
            advanceHint: 'Deepen key relationships. When connections are strong, creativity emerges naturally.'
        },
        4: {
            name: 'Creativity',
            focus: 'Innovation',
            color: '#4dabf7',
            gradient: 'linear-gradient(135deg, #4dabf7, #748ffc)',
            description: 'Innovation flourishes. New ideas emerge and are welcomed.',
            questions: [
                'Is experimentation encouraged?',
                'Do people feel safe to propose new ideas?',
                'Are we solving problems creatively?',
                'Is there space for play and exploration?'
            ],
            breathInsight: 'Creativity is the breath of new possibility. Let go of what was to create what can be.',
            advanceHint: 'Foster innovation culture. When creativity flows freely, authentic expression becomes possible.'
        },
        5: {
            name: 'Expression',
            focus: 'Authenticity',
            color: '#a78bfa',
            gradient: 'linear-gradient(135deg, #a78bfa, #f472b6)',
            description: 'Authentic voice emerging. The organization expresses its unique identity.',
            questions: [
                'Is our brand voice distinctive and true?',
                'Do our actions match our stated values?',
                'Are we communicating our unique perspective?',
                'Is there coherence between inner and outer?'
            ],
            breathInsight: 'Expression is truth made visible. Each exhale shares your authentic essence.',
            advanceHint: 'Refine authentic expression. When you speak your truth fully, vision crystallizes.'
        },
        6: {
            name: 'Vision',
            focus: 'Purpose',
            color: '#da77f2',
            gradient: 'linear-gradient(135deg, #da77f2, #f06595)',
            description: 'Clear sight of purpose. Strategic vision guides all decisions.',
            questions: [
                'Is our long-term vision crystal clear?',
                'Does everyone understand the "why"?',
                'Are we seeing patterns others miss?',
                'Is our strategy aligned with deeper purpose?'
            ],
            breathInsight: 'Vision is the breath of the future. Inhale possibility, exhale direction.',
            advanceHint: 'Clarify and embody the vision. When vision is lived fully, radiance emerges.'
        },
        7: {
            name: 'Radiance',
            focus: 'Service',
            color: '#ffd43b',
            gradient: 'linear-gradient(135deg, #ffd43b, #ffe066)',
            description: 'Full coherence achieved. The organization serves something greater than itself.',
            questions: [
                'Are we serving the greater good?',
                'Is our impact regenerative?',
                'Do we uplift those we touch?',
                'Is there joy in our work?'
            ],
            breathInsight: 'Radiance is the breath of service. Every exhale blesses the world.',
            advanceHint: 'Radiance is the culmination. Maintain coherence while expanding your service to the world.'
        }
    };

    // ═══════════════════════════════════════════════════════════════════════
    // SECTION 3: DETECTION FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════════
    //
    // These functions map coherence scores to octave levels.
    //
    // We provide two detection functions:
    //   1. detectOctaveFromCoherence() - Simple version, just coherence score
    //   2. detectOctave() - Full version with elemental engagement cap
    //
    // The elemental engagement cap means:
    // - If you only explore 1 element, max octave is O3
    // - If you explore all 5 elements, max octave is O7
    //
    // This prevents gaming the system by only measuring easy dimensions.
    //
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Detect octave from coherence score (simple version)
     *
     * Uses PHI-derived thresholds from OCTAVE_COHERENCE_THRESHOLDS.
     * This is the basic version used when we only have a coherence
     * score and no elemental engagement data.
     *
     * ┌─────────────────────────────────────────────────────────────────────┐
     * │ PHILOSOPHY: Octaves represent developmental stages, not rewards.   │
     * │ A score doesn't "earn" an octave - it reveals which level of       │
     * │ questions the organization is naturally engaging with.             │
     * └─────────────────────────────────────────────────────────────────────┘
     *
     * Threshold values (from orchestrator-state.js):
     *   O7: 0.95     (Radiance)
     *   O6: ~0.854   (Vision, PSI^4)
     *   O5: ~0.764   (Expression, PSI^3)
     *   O4: ~0.618   (Creativity, PHI^-1)
     *   O3: 0.5      (Relationships)
     *   O2: ~0.382   (Structure, PHI^-2)
     *   O1: below 0.382 (Survival)
     *
     * @param {number} coherence - Coherence score between 0 and 1
     * @returns {number} Octave number (1-7)
     *
     * @example
     * detectOctaveFromCoherence(0.85) // Returns 5 (Expression)
     *
     * @example
     * detectOctaveFromCoherence(0.35) // Returns 1 (Survival)
     *
     * @example
     * detectOctaveFromCoherence(0.618) // Returns 4 (Creativity)
     *
     * @see phi-harmonics.js for threshold derivations
     *
     * @risk Returns O1 (Survival) for invalid inputs - graceful degradation
     * @risk Depends on OCTAVE_COHERENCE_THRESHOLDS being loaded first
     *
     * @since Session 5 Modularization
     * @author Claude (with Deimantas)
     */
    function detectOctaveFromCoherence(coherence) {
        const thresholds = global.OCTAVE_COHERENCE_THRESHOLDS;

        // ────────────────────────────────────────────────────────────────────
        // Defensive check: If thresholds not loaded, use hardcoded values
        // ────────────────────────────────────────────────────────────────────
        // WHY: The orchestrator-state.js should always load first, but
        // if something goes wrong, we fall back to known PHI values.
        // ────────────────────────────────────────────────────────────────────
        if (!thresholds) {
            Logger.warn('OrchestratorDash', '[octave-system] OCTAVE_COHERENCE_THRESHOLDS not found, using defaults');
            // PHI^-2 = 0.381966..., PHI^-1 = 0.618033..., etc.
            if (coherence >= 0.95) return 7;   // Radiance
            if (coherence >= 0.854) return 6;  // Vision (PSI^4)
            if (coherence >= 0.764) return 5;  // Expression (PSI^3)
            if (coherence >= 0.618) return 4;  // Creativity (PHI^-1)
            if (coherence >= 0.5) return 3;    // Relationships
            if (coherence >= 0.382) return 2;  // Structure (PHI^-2)
            return 1;                           // Survival
        }

        // Use centralized PHI-derived thresholds
        if (coherence >= thresholds.O7) return 7;  // 0.95 - Radiance
        if (coherence >= thresholds.O6) return 6;  // PSI^4 ~ 0.854 - Vision
        if (coherence >= thresholds.O5) return 5;  // PSI^3 ~ 0.764 - Expression
        if (coherence >= thresholds.O4) return 4;  // PHI^-1 ~ 0.618 - Creativity
        if (coherence >= thresholds.O3) return 3;  // 0.5 - Relationships
        if (coherence >= thresholds.O2) return 2;  // PHI^-2 ~ 0.382 - Structure
        return 1;  // O1 - Survival
    }

    /**
     * Detect operational octave based on coherence and engaged elements
     *
     * This is the full detection function that considers both coherence score
     * AND how many of the 5 elements have been explored.
     *
     * ┌─────────────────────────────────────────────────────────────────────┐
     * │ PHILOSOPHY: Octave isn't a reward - it's recognition of which      │
     * │ level questions are being engaged. You can't claim O7 Radiance     │
     * │ if you're only engaging with Earth element questions.              │
     * └─────────────────────────────────────────────────────────────────────┘
     *
     * Elemental engagement cap:
     *   1 element explored = max O3
     *   2 elements explored = max O4
     *   3 elements explored = max O5
     *   4 elements explored = max O6
     *   5 elements explored = max O7 (no cap)
     *
     * @param {number} faceCoherence - Face coherence score (0-1)
     * @param {Object} elementsExplored - Elemental data with exploration status
     *   Each element should have an 'explored' boolean property
     *
     * @returns {Object} Octave detection result with:
     *   - detected: Base octave from coherence score ('O1'-'O7')
     *   - effective: Actual octave after elemental engagement cap
     *   - limitedBy: 'elemental_coverage' if capped, null otherwise
     *   - exploredCount: Number of explored elements (0-5)
     *   - coherenceBased: Same as detected (for reference)
     *
     * @example
     * const result = detectOctave(0.9, { earth: { explored: true }, water: { explored: true } });
     * // coherence 0.9 = O6 (Vision)
     * // but only 2 elements explored = max O4
     * // result.detected = 'O6', result.effective = 'O4', result.limitedBy = 'elemental_coverage'
     *
     * @risk Returns O1 for invalid inputs - graceful degradation
     *
     * @since Session 5 Modularization
     * @author Claude (with Deimantas)
     */
    function detectOctave(faceCoherence, elementsExplored) {
        // ────────────────────────────────────────────────────────────────────
        // STEP 1: Count how many elements have been explored
        // ────────────────────────────────────────────────────────────────────
        const exploredCount = Object.values(elementsExplored || {})
            .filter(e => e && e.explored).length;

        // ────────────────────────────────────────────────────────────────────
        // STEP 2: Use centralized PHI-based coherence thresholds
        // ────────────────────────────────────────────────────────────────────
        const thresholds = global.OCTAVE_COHERENCE_THRESHOLDS || {
            O7: 0.95, O6: 0.854, O5: 0.764, O4: 0.618, O3: 0.5, O2: 0.382
        };

        // Base octave from coherence score
        let detectedOctave = 'O1';
        if (faceCoherence >= thresholds.O7) detectedOctave = 'O7';       // Radiance
        else if (faceCoherence >= thresholds.O6) detectedOctave = 'O6'; // Vision
        else if (faceCoherence >= thresholds.O5) detectedOctave = 'O5'; // Expression
        else if (faceCoherence >= thresholds.O4) detectedOctave = 'O4'; // Creativity
        else if (faceCoherence >= thresholds.O3) detectedOctave = 'O3'; // Relationships
        else if (faceCoherence >= thresholds.O2) detectedOctave = 'O2'; // Structure

        // ────────────────────────────────────────────────────────────────────
        // STEP 3: Apply elemental engagement cap
        // ────────────────────────────────────────────────────────────────────
        // Philosophy: Full elemental engagement (5/5) allows full octave expression
        // Partial engagement caps the effective octave:
        //   1 element = max O3, 2 = max O4, 3 = max O5, 4 = max O6, 5 = max O7
        // ────────────────────────────────────────────────────────────────────
        const octaveOrder = ['O1', 'O2', 'O3', 'O4', 'O5', 'O6', 'O7'];
        const maxOctaveByEngagement = Math.min(exploredCount + 2, 7);
        const detectedIndex = octaveOrder.indexOf(detectedOctave);
        const effectiveIndex = Math.min(detectedIndex, maxOctaveByEngagement - 1);

        return {
            detected: detectedOctave,
            effective: octaveOrder[effectiveIndex],
            limitedBy: effectiveIndex < detectedIndex ? 'elemental_coverage' : null,
            exploredCount: exploredCount,
            coherenceBased: detectedOctave
        };
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
    // │ OCTAVE_REFERENCE           │ Static data for 7 octaves               │
    // │ detectOctaveFromCoherence  │ Simple coherence → octave mapping       │
    // │ detectOctave               │ Full detection with elemental cap       │
    // └────────────────────────────┴─────────────────────────────────────────┘
    //
    // BACKWARD COMPATIBILITY:
    // These exports maintain the same API as orchestrator-dashboard.js
    // No breaking changes for existing consumers.
    //
    // ═══════════════════════════════════════════════════════════════════════

    // Export to global scope (browser)
    global.OCTAVE_REFERENCE = OCTAVE_REFERENCE;
    global.detectOctaveFromCoherence = detectOctaveFromCoherence;
    global.detectOctave = detectOctave;

    // CommonJS export (Node.js/testing)
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = {
            OCTAVE_REFERENCE,
            detectOctaveFromCoherence,
            detectOctave
        };
    }

    Logger.debug('OrchestratorDash', '[dashboard/octave-system] Module loaded - 7 octaves ready (O1-O7)');

})(typeof window !== 'undefined' ? window : this);
