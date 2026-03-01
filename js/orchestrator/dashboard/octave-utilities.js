/**
 * ═══════════════════════════════════════════════════════════════════════════
 * @module dashboard/octave-utilities
 * @description Pure utility functions for default values and structures
 * @version 1.0.0
 * @since Session 5 Modularization (December 2025)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                        NOTES FOR FUTURE CLAUDE                         │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * Welcome, future self! This module contains pure utility functions with
 * NO external dependencies. These are safe to use anywhere without worrying
 * about load order or state.
 *
 * WHAT THIS MODULE DOES:
 * - Provides default elemental structure (5 elements of the pentagram)
 * - Provides default face names (12 faces of the dodecahedron)
 *
 * WHY IT EXISTS:
 * - Extracted from orchestrator-dashboard.js (Session 5)
 * - Contains pure functions that don't depend on state
 * - Used by portrait-view-manager.js for fallback values
 *
 * KEY CONCEPTS:
 * - 5 Elements: Earth, Water, Fire, Air, Ether (pentagram geometry)
 * - 12 Faces: Organizational domains of the dodecahedron
 *
 * QUICK NAVIGATION:
 * - Section 1: Default Elements Structure
 * - Section 2: Default Face Names
 * - Section 3: Exports
 *
 * DEPENDENCY MAP:
 * ┌──────────────────────┐
 * │ (no dependencies)    │
 * └──────────────────────┘
 *          ▲
 *          │ used by
 * ┌────────┴─────────────┐
 * │ portrait-view-manager│
 * │ .js                  │
 * └──────────────────────┘
 *
 * TESTING:
 * - getDefaultElements() should return object with earth, water, fire, air, ether
 * - getDefaultFaceName(1) should return 'Financial Capital'
 * - getDefaultFaceName(99) should return 'Face 99'
 *
 * ═══════════════════════════════════════════════════════════════════════════
 */

(function(global) {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════
    // SECTION 1: DEFAULT ELEMENTS STRUCTURE
    // ═══════════════════════════════════════════════════════════════════════
    //
    // PURPOSE: Provides the default structure for the 5 elemental dimensions
    //
    // THE 5 ELEMENTS (Pentagram Geometry):
    // Each face of the dodecahedron is measured across 5 elemental dimensions:
    //
    //   ┌─────────┐
    //   │  ETHER  │  (Purpose/Spirit - highest element)
    //   └────┬────┘
    //        │
    //   ┌────┴────┐
    //   │   AIR   │  (Communication/Clarity)
    //   └────┬────┘
    //        │
    //   ┌────┴────┐
    //   │  FIRE   │  (Energy/Action)
    //   └────┬────┘
    //        │
    //   ┌────┴────┐
    //   │  WATER  │  (Flow/Adaptation)
    //   └────┬────┘
    //        │
    //   ┌────┴────┐
    //   │  EARTH  │  (Foundation/Grounding - base element)
    //   └─────────┘
    //
    // PHILOSOPHY:
    // An organization must have strong Earth (foundations) before it can
    // truly express Ether (purpose). This mirrors the Foundation Principle.
    //
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Get default elements structure
     *
     * Used when no elemental data is available for a face.
     * Returns a structure where all elements are at baseline (0).
     *
     * ┌─────────────────────────────────────────────────────────────────────┐
     * │ PHILOSOPHY: Elements represent different dimensions of coherence.  │
     * │ A face with only Earth explored is stable but limited. A face with │
     * │ all 5 elements explored has full expression potential.             │
     * └─────────────────────────────────────────────────────────────────────┘
     *
     * @returns {Object} Default elemental structure with all values at 0
     *   - earth: { value: 0, label: 'Foundation' }
     *   - water: { value: 0, label: 'Flow' }
     *   - fire: { value: 0, label: 'Energy' }
     *   - air: { value: 0, label: 'Communication' }
     *   - ether: { value: 0, label: 'Purpose' }
     *
     * @example
     * const elements = getDefaultElements();
     * console.log(elements.earth.label); // 'Foundation'
     *
     * @example
     * // Used as fallback when face has no elemental data
     * const faceElements = face.elements || getDefaultElements();
     *
     * @risk None - pure function with no side effects
     *
     * @since Session 5 Modularization
     * @author Claude (with Deimantas)
     */
    function getDefaultElements() {
        return {
            earth: { value: 0, label: 'Foundation' },
            water: { value: 0, label: 'Flow' },
            fire: { value: 0, label: 'Energy' },
            air: { value: 0, label: 'Communication' },
            ether: { value: 0, label: 'Purpose' }
        };
    }

    // ═══════════════════════════════════════════════════════════════════════
    // SECTION 2: DEFAULT FACE NAMES
    // ═══════════════════════════════════════════════════════════════════════
    //
    // PURPOSE: Provides human-readable names for the 12 faces of the
    // organizational dodecahedron.
    //
    // THE 12 FACES (Dodecahedron Geometry):
    // These represent the 12 organizational domains that together form
    // a complete picture of organizational coherence.
    //
    //   Face 1:  Financial Capital      - Money and financial health
    //   Face 2:  Intellectual Capital   - Knowledge and IP
    //   Face 3:  Human Capital          - People and culture
    //   Face 4:  Structural Capital     - Systems and processes
    //   Face 5:  Market Resonance       - Product-market fit
    //   Face 6:  Community & Partners   - External relationships
    //   Face 7:  Brand & Reputation     - Public perception
    //   Face 8:  Core Operations        - Daily execution
    //   Face 9:  Regenerative Flow      - Sustainability
    //   Face 10: Foundational Values    - Ethics and principles
    //   Face 11: Funding Pipeline       - Future capital
    //   Face 12: Risk & Resilience      - Adaptability
    //
    // PHILOSOPHY:
    // These 12 faces form 6 opposing pairs (breath axes) that represent
    // the flow of energy through the organization. See breath-analyzer.js.
    //
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Default face names for the 12 organizational domains
     *
     * @constant {Object}
     * @private
     */
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

    /**
     * Get default face name for a given face ID
     *
     * Used when face name is not provided in data.
     * Returns the standard organizational domain name for faces 1-12,
     * or a generic "Face N" for any other ID.
     *
     * ┌─────────────────────────────────────────────────────────────────────┐
     * │ PHILOSOPHY: The 12 faces represent a complete organizational model.│
     * │ Together they form the dodecahedron - the sacred geometry shape    │
     * │ that best represents wholeness and coherence.                      │
     * └─────────────────────────────────────────────────────────────────────┘
     *
     * @param {number} faceId - Face ID (1-12 for standard faces)
     * @returns {string} Default face name
     *
     * @example
     * getDefaultFaceName(1)  // Returns 'Financial Capital'
     * getDefaultFaceName(7)  // Returns 'Brand & Reputation'
     * getDefaultFaceName(99) // Returns 'Face 99'
     *
     * @example
     * // Used as fallback when face name is missing
     * const faceName = face.name || getDefaultFaceName(face.id);
     *
     * @risk Returns generic 'Face N' for unknown IDs - graceful degradation
     *
     * @since Session 5 Modularization
     * @author Claude (with Deimantas)
     */
    function getDefaultFaceName(faceId) {
        return DEFAULT_FACE_NAMES[faceId] || `Face ${faceId}`;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // SECTION 3: EXPORTS
    // ═══════════════════════════════════════════════════════════════════════
    //
    // EXPORT STRATEGY:
    // We use dual exports for maximum compatibility:
    // 1. Browser global (window.XXX) - for script tag usage
    // 2. CommonJS (module.exports) - for Node.js/testing
    //
    // PUBLIC API:
    // ┌────────────────────────┬─────────────────────────────────────────────┐
    // │ Export                 │ Description                                 │
    // ├────────────────────────┼─────────────────────────────────────────────┤
    // │ getDefaultElements     │ Returns default 5-element structure         │
    // │ getDefaultFaceName     │ Returns default name for face 1-12          │
    // │ DEFAULT_FACE_NAMES     │ Raw object of face ID → name mappings       │
    // └────────────────────────┴─────────────────────────────────────────────┘
    //
    // BACKWARD COMPATIBILITY:
    // These exports maintain the same API as orchestrator-dashboard.js
    // No breaking changes for existing consumers.
    //
    // ═══════════════════════════════════════════════════════════════════════

    // Export to global scope (browser)
    global.getDefaultElements = getDefaultElements;
    global.getDefaultFaceName = getDefaultFaceName;
    global.DEFAULT_FACE_NAMES = DEFAULT_FACE_NAMES;

    // CommonJS export (Node.js/testing)
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = {
            getDefaultElements,
            getDefaultFaceName,
            DEFAULT_FACE_NAMES
        };
    }

    Logger.info('OctaveUtilities', 'Module loaded - utility functions ready');

})(typeof window !== 'undefined' ? window : this);
