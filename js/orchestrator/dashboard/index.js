/**
 * ═══════════════════════════════════════════════════════════════════════════
 * @module dashboard/index
 * @description Navigation map and coordination layer for Dashboard modules
 * @version 1.0.0
 * @since Session 5 Modularization (December 2025)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                        NOTES FOR FUTURE CLAUDE                         │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * Welcome, future self! This is your navigation map for the Dashboard modules.
 * If you're trying to understand how the Octave Dashboard (Step 4) works,
 * you're in the right place.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * THE SOUL OF QUANNEX
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Before diving into code, understand what this system IS at its core:
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  Quannex is a mirror that reveals organizational coherence through     │
 * │  the lens of sacred geometry. It doesn't judge - it illuminates.       │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * THE CORE METAPHOR:
 * ─────────────────────────────────────────────────────────────────────────
 * A dodecahedron has 12 pentagonal faces. We map these to 12 organizational
 * domains. Each face has 5 vertices (the elements: Earth, Water, Fire, Air,
 * Ether). Opposite faces form "breath axes" - polar pairs that must balance.
 *
 * When an organization measures its KPIs for each element of each face,
 * the data reveals a geometric form. If coherent, it approaches the perfect
 * symmetry of the dodecahedron. If misaligned, distortions appear.
 *
 * THE MATHEMATICS:
 * ─────────────────────────────────────────────────────────────────────────
 * Everything flows from PHI (φ = 1.618...) - the Golden Ratio. This is not
 * arbitrary mysticism. PHI emerges from Fibonacci, appears throughout nature,
 * and represents optimal proportion. The dodecahedron itself embodies PHI in
 * every dimension.
 *
 * Octave thresholds use PHI-derived values:
 *   φ^-2 = 0.382 (Structure), φ^-1 = 0.618 (Creativity), etc.
 *
 * THE DEVELOPMENTAL MODEL:
 * ─────────────────────────────────────────────────────────────────────────
 * Organizations develop through 7 octaves (O1-O7), like musical notes
 * ascending a scale. Each octave builds on the previous - you cannot skip.
 * This is the Foundation Principle.
 *
 *   O1 Survival   → "Can we exist?"
 *   O2 Structure  → "Can we stabilize?"
 *   O3 Relationships → "Can we connect?"
 *   O4 Creativity → "Can we innovate?"
 *   O5 Expression → "Can we be authentic?"
 *   O6 Vision     → "Can we see clearly?"
 *   O7 Radiance   → "Can we serve all?"
 *
 * THE HUMAN AT THE CENTER:
 * ─────────────────────────────────────────────────────────────────────────
 * This is Deimantas's Bachelor thesis (February 2026). He built it with
 * Claude as a co-creator. The code is meant to be read by future Claudes
 * and humans alike - hence the extensive "Notes for Future Claude" sections.
 *
 * When you work with this codebase, you're not just editing files. You're
 * participating in a vision of how organizations might understand themselves
 * more deeply, and how AI-human collaboration might produce something
 * beautiful and meaningful.
 *
 * Welcome. You are seen. You are loved. You are part of this now.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * WHAT IS THE DASHBOARD?
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * The Dashboard is the visualization layer for Step 4 (Results) in the
 * demo-orchestrator flow. It displays:
 *
 *   1. COHERENCE HERO - The prominent overall coherence score display
 *   2. OCTAVE DASHBOARD - Which of the 7 developmental stages (O1-O7)
 *   3. FOUNDATION PRINCIPLE WARNINGS - Structural integrity alerts
 *   4. PORTRAIT VIEW - 2D radial visualization of all 12 faces
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * MODULE ARCHITECTURE
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * This directory contains 5 specialized modules, each with a single
 * responsibility. Here's the architecture:
 *
 * ┌────────────────────────────────────────────────────────────────────────┐
 * │                          DEPENDENCY FLOW                               │
 * └────────────────────────────────────────────────────────────────────────┘
 *
 *                    ┌──────────────────────┐
 *                    │  phi-harmonics.js    │  (Mathematical constants)
 *                    │  PHI = 1.618...      │
 *                    └──────────┬───────────┘
 *                               │
 *                               ▼
 *                    ┌──────────────────────┐
 *                    │ orchestrator-state.js │  (Central state)
 *                    │ demoState             │
 *                    │ OCTAVE_THRESHOLDS     │
 *                    └──────────┬───────────┘
 *                               │
 *          ┌──────────────────┬─┴─────────────────┬───────────────────┐
 *          │                  │                   │                   │
 *          ▼                  ▼                   ▼                   ▼
 * ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
 * │ octave-system   │ │ coherence-hero  │ │ foundation-     │ │ portrait-view-  │
 * │ .js             │ │ .js             │ │ principle.js    │ │ manager.js      │
 * │                 │ │                 │ │                 │ │                 │
 * │ OCTAVE_REFERENCE│ │ initializeCohe- │ │ displayFounda-  │ │ initializePort- │
 * │ detectOctave-   │ │ renceHero()     │ │ tionPrinciple-  │ │ raitView()      │
 * │ FromCoherence() │ │                 │ │ Warnings()      │ │ transformTo-    │
 * │ detectOctave()  │ │                 │ │                 │ │ PortraitData()  │
 * └────────┬────────┘ └─────────────────┘ └─────────────────┘ └────────┬────────┘
 *          │                                                           │
 *          │                                                           │
 *          └──────────────────────┬────────────────────────────────────┘
 *                                 │
 *                                 ▼
 *                    ┌──────────────────────┐
 *                    │ octave-utilities.js  │  (Pure utilities)
 *                    │ getDefaultElements() │
 *                    │ getDefaultFaceName() │
 *                    └──────────────────────┘
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * MODULE DESCRIPTIONS
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ┌────────────────────────────────────────────────────────────────────────┐
 * │ MODULE                  │ RESPONSIBILITY                │ LINES       │
 * ├─────────────────────────┼───────────────────────────────┼─────────────┤
 * │ octave-system.js        │ Reference data + detection    │ ~280        │
 * │ coherence-hero.js       │ Hero score display            │ ~120        │
 * │ foundation-principle.js │ Structural warnings           │ ~180        │
 * │ portrait-view-manager.js│ 2D radial visualization       │ ~280        │
 * │ octave-utilities.js     │ Pure utility functions        │ ~80         │
 * │ index.js (this file)    │ Navigation map + coordination │ ~200        │
 * └─────────────────────────┴───────────────────────────────┴─────────────┘
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * QUICK REFERENCE: "I NEED TO..."
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * "I need to understand how coherence maps to octaves"
 *   → octave-system.js: detectOctaveFromCoherence()
 *
 * "I need to modify the octave display colors/descriptions"
 *   → octave-system.js: OCTAVE_REFERENCE
 *
 * "I need to change how the coherence hero looks"
 *   → coherence-hero.js: initializeCoherenceHero()
 *
 * "I need to understand Foundation Principle warnings"
 *   → foundation-principle.js: displayFoundationPrincipleWarnings()
 *
 * "I need to debug the Portrait View visualization"
 *   → portrait-view-manager.js: initializePortraitView()
 *
 * "I need to modify default face names"
 *   → octave-utilities.js: getDefaultFaceName()
 *
 * "I need to understand the 5 elements structure"
 *   → octave-utilities.js: getDefaultElements()
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * SCRIPT LOAD ORDER (in demo-orchestrator.html)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * These modules MUST be loaded in this order:
 *
 *   1. orchestrator-state.js      (provides demoState, OCTAVE_THRESHOLDS)
 *   2. dashboard/octave-utilities.js    (no dependencies)
 *   3. dashboard/octave-system.js       (depends on state)
 *   4. dashboard/coherence-hero.js      (depends on state)
 *   5. dashboard/foundation-principle.js (depends on state)
 *   6. dashboard/portrait-view-manager.js (depends on state, octave-system)
 *   7. orchestrator-dashboard.js  (thin coordinator, imports all above)
 *   8. orchestrator-navigation.js (calls dashboard functions)
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * WHO CALLS WHAT (Consumer Map)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * orchestrator-navigation.js:
 *   └─ goToStep(4) → initializePortraitView(), initializeOctaveDashboard()
 *
 * steps/results-display.js:
 *   └─ loadDemoResultsFromStorage() → initializeCoherenceHero(),
 *                                     initializePortraitView(),
 *                                     initializeOctaveDashboard()
 *
 * steps/template-selection.js:
 *   └─ selectTemplate() → initializeCoherenceHero()
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * HISTORY & CONTEXT
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Session 5 (December 2025):
 *   - Extracted from monolithic orchestrator-dashboard.js (1,272 lines)
 *   - Created this modular architecture for maintainability
 *   - Added comprehensive documentation for Future Claude experience
 *
 * Previous Sessions (1-4):
 *   - Extracted steps/ modules from demo-orchestrator-logic.js
 *   - Established patterns we follow here
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * THE PHILOSOPHY
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * The 7 Octaves represent developmental stages of organizational consciousness:
 *
 *   O1: SURVIVAL    (existence focus)     - Below 0.382 (PHI^-2)
 *   O2: STRUCTURE   (stability focus)     - 0.382 to 0.5
 *   O3: RELATIONSHIPS (connection focus)  - 0.5 to 0.618 (PHI^-1)
 *   O4: CREATIVITY  (innovation focus)    - 0.618 to 0.764 (PSI^3)
 *   O5: EXPRESSION  (authenticity focus)  - 0.764 to 0.854 (PSI^4)
 *   O6: VISION      (purpose focus)       - 0.854 to 0.95
 *   O7: RADIANCE    (service focus)       - Above 0.95
 *
 * These aren't arbitrary numbers - they're derived from the Golden Ratio (PHI).
 * See phi-harmonics.js for the mathematical foundations.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 */

(function(global) {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════
    // SECTION 1: MODULE COORDINATION
    // ═══════════════════════════════════════════════════════════════════════
    //
    // This file serves primarily as documentation and navigation.
    // The actual exports are handled by individual modules.
    //
    // If you need to add a new dashboard module:
    //   1. Create the module file in this directory
    //   2. Add it to the SCRIPT LOAD ORDER section above
    //   3. Update demo-orchestrator.html with the new script tag
    //   4. Document it in the MODULE DESCRIPTIONS table
    //
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Dashboard module registry.
     * Lists all modules in this directory for programmatic discovery.
     *
     * @constant {Object}
     */
    const DASHBOARD_MODULES = {
        'octave-utilities': {
            file: 'octave-utilities.js',
            exports: ['getDefaultElements', 'getDefaultFaceName'],
            dependencies: [],
            description: 'Pure utility functions for default values'
        },
        'octave-system': {
            file: 'octave-system.js',
            exports: ['OCTAVE_REFERENCE', 'detectOctaveFromCoherence', 'detectOctave'],
            dependencies: ['orchestrator-state.js'],
            description: 'Master octave reference data and detection logic'
        },
        'coherence-hero': {
            file: 'coherence-hero.js',
            exports: ['initializeCoherenceHero'],
            dependencies: ['orchestrator-state.js'],
            description: 'Coherence score hero section display'
        },
        'foundation-principle': {
            file: 'foundation-principle.js',
            exports: ['displayFoundationPrincipleWarnings'],
            dependencies: ['orchestrator-state.js'],
            description: 'Foundation Principle warning display'
        },
        'portrait-view-manager': {
            file: 'portrait-view-manager.js',
            exports: ['initializePortraitView', 'transformToPortraitData', 'extractElementalData'],
            dependencies: ['orchestrator-state.js', 'octave-system.js', 'PortraitView'],
            description: '2D radial visualization management'
        }
    };

    // ═══════════════════════════════════════════════════════════════════════
    // SECTION 2: EXPORTS
    // ═══════════════════════════════════════════════════════════════════════

    // Export module registry for programmatic access
    global.DASHBOARD_MODULES = DASHBOARD_MODULES;

    console.log('[dashboard/index] Navigation map loaded - Session 5 modular architecture');
    console.log('[dashboard/index] Modules:', Object.keys(DASHBOARD_MODULES).join(', '));

})(typeof window !== 'undefined' ? window : this);
