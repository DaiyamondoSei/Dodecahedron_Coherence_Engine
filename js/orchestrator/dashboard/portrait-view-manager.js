/**
 * ═══════════════════════════════════════════════════════════════════════════
 * @module dashboard/portrait-view-manager
 * @description 2D radial visualization management for the 12 faces
 * @version 1.0.0
 * @since Session 5 Modularization (December 2025)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                        NOTES FOR FUTURE CLAUDE                         │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * Welcome, future self! This module manages the Portrait View - a 2D radial
 * visualization showing all 12 faces of the organizational dodecahedron
 * arranged in a circle.
 *
 * WHAT THIS MODULE DOES:
 * - Initializes the PortraitView component (waits for async load)
 * - Transforms coherence data to Portrait View format
 * - Extracts elemental breakdown from face data
 * - Manages the portrait view instance lifecycle
 *
 * WHY IT EXISTS:
 * - Extracted from orchestrator-dashboard.js (Session 5) for clarity
 * - Single responsibility: 2D visualization management
 * - Enables independent testing and maintenance
 *
 * KEY CONCEPTS TO UNDERSTAND:
 * - Portrait View: 2D radial display of all 12 faces in a circle
 * - Each face shows: coherence level, target octave, elemental breakdown
 * - Elements: The 5 pentagram elements (Earth, Water, Fire, Air, Ether)
 * - Quick Mode: Single KPI per face, auto-assigned to Earth element
 *
 * QUICK NAVIGATION:
 * - Section 1: Imports & Dependencies
 * - Section 2: Module State
 * - Section 3: Initialization Function
 * - Section 4: Data Transformation Functions
 * - Section 5: Exports
 *
 * DEPENDENCY MAP:
 * ┌──────────────────────┐
 * │ orchestrator-state.js │ (demoState)
 * └────────┬─────────────┘
 *          ↓
 * ┌──────────────────────┐     ┌────────────────────────┐
 * │ octave-system.js     │────→│ detectOctave()         │
 * └──────────────────────┘     └────────────────────────┘
 *          ↓
 * ┌──────────────────────┐     ┌────────────────────────┐
 * │ octave-utilities.js  │────→│ getDefaultElements()   │
 * │                      │     │ getDefaultFaceName()   │
 * └──────────────────────┘     └────────────────────────┘
 *          ↓
 * ┌──────────────────┐
 * │  THIS MODULE     │ ← You are here
 * └────────┬─────────┘
 *          ↓
 * ┌────────────────────────┐
 * │ PortraitView           │ (external UI component)
 * │ (ui/portrait-view.js)  │
 * └────────────────────────┘
 *
 * DOM ELEMENTS REQUIRED:
 * ┌────────────────────────────┬─────────────────────────────────────────┐
 * │ Element ID                 │ Purpose                                 │
 * ├────────────────────────────┼─────────────────────────────────────────┤
 * │ #portrait-view-container   │ Container for the radial visualization  │
 * └────────────────────────────┴─────────────────────────────────────────┘
 *
 * RISK DOCUMENTATION:
 * ⚠️ PortraitView is loaded async - we poll for it (100ms intervals)
 * ⚠️ Requires coherenceResults.faces to be populated
 * ⚠️ Falls back to faceConfig if faces array is empty
 * ⚠️ Uses global detectOctave() from octave-system.js
 *
 * TESTING:
 * - With valid coherence data: Should render 12 faces in a circle
 * - With missing faces: Should create fallback data
 * - With Quick Mode data: Should assign single KPI to Earth element
 * - With full elemental data: Should show all 5 elements per face
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
    //   - global.PortraitView (from ui/portrait-view.js) - async loaded
    //   - global.detectOctave (from dashboard/octave-system.js)
    //   - global.getDefaultElements (from dashboard/octave-utilities.js)
    //   - global.getDefaultFaceName (from dashboard/octave-utilities.js)
    //   - global.getFaceOctaves (optional, from face-wizard.js)
    //   - global.getOverallOctave (optional, from face-wizard.js)
    //
    // ═══════════════════════════════════════════════════════════════════════

    // ═══════════════════════════════════════════════════════════════════════
    // SECTION 2: MODULE STATE
    // ═══════════════════════════════════════════════════════════════════════
    //
    // We maintain a single instance of the PortraitView component.
    // This is created once and updated as data changes.
    //
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Singleton instance of the PortraitView component
     * @type {PortraitView|null}
     * @private
     */
    let portraitViewInstance = null;

    // ═══════════════════════════════════════════════════════════════════════
    // SECTION 3: INITIALIZATION FUNCTION
    // ═══════════════════════════════════════════════════════════════════════
    //
    // PURPOSE: Initialize or update the Portrait View visualization
    //
    // CALL SITES:
    //   - orchestrator-navigation.js: goToStep(4)
    //   - steps/results-display.js: loadDemoResultsFromStorage()
    //
    // FLOW:
    //   1. Check for coherence data availability
    //   2. Create fallback face data if needed
    //   3. Wait for PortraitView module (async polling)
    //   4. Transform data to portrait format
    //   5. Create or update the PortraitView instance
    //
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Initialize Portrait View with current coherence data
     *
     * Creates or updates the 2D radial visualization showing all 12 faces.
     * Handles async loading of the PortraitView component gracefully.
     *
     * ┌─────────────────────────────────────────────────────────────────────┐
     * │ PHILOSOPHY: The Portrait View is a "snapshot from above" - looking │
     * │ down at the dodecahedron from the North Pole, seeing all 12 faces  │
     * │ arranged in a sacred circle. It shows the organization's coherence │
     * │ landscape at a glance.                                             │
     * └─────────────────────────────────────────────────────────────────────┘
     *
     * @returns {void}
     *
     * @example
     * // Called when navigating to Step 4 (Results)
     * initializePortraitView();
     *
     * @example
     * // Called when loading saved results
     * if (loadDemoResultsFromStorage()) {
     *     initializePortraitView();
     * }
     *
     * @risk Returns early if coherenceResults is missing
     * @risk Polls for PortraitView module (may delay rendering)
     *
     * @since Sprint 3 (original)
     * @since Session 5 Modularization (extracted)
     * @author Claude (with Deimantas)
     */
    function initializePortraitView() {
        const state = global.demoState;

        // ────────────────────────────────────────────────────────────────────
        // STEP 1: Validate state
        // ────────────────────────────────────────────────────────────────────
        if (!state || !state.coherenceResults) {
            console.warn('[portrait-view-manager] No coherence results available for Portrait View');
            return;
        }

        // ────────────────────────────────────────────────────────────────────
        // STEP 2: Ensure faces array exists (null-safe fallback)
        // ────────────────────────────────────────────────────────────────────
        // In some cases (e.g., template loading), coherenceResults may
        // exist but faces array may be empty. We create fallback data
        // from faceConfig if available.
        // ────────────────────────────────────────────────────────────────────
        if (!state.coherenceResults.faces || state.coherenceResults.faces.length === 0) {
            console.warn('[portrait-view-manager] No face data, creating fallback');
            if (state.faceConfig && state.faceConfig.faces) {
                state.coherenceResults.faces = state.faceConfig.faces.map(f => ({
                    id: f.id,
                    name: f.name,
                    energy: state.loadedMappingContext?.faces?.find(mf => mf.id === f.id)?.sentiment || 0.5,
                    kpis: []
                }));
            }
        }

        // ────────────────────────────────────────────────────────────────────
        // STEP 3: Wait for PortraitView module to be available
        // ────────────────────────────────────────────────────────────────────
        // PortraitView is an external module loaded via <script> tag.
        // It may not be available immediately, so we poll for it.
        // ────────────────────────────────────────────────────────────────────
        const waitForPortraitView = () => {
            if (typeof global.PortraitView === 'undefined') {
                console.log('[portrait-view-manager] Waiting for PortraitView module...');
                setTimeout(waitForPortraitView, 100);
                return;
            }

            console.log('[portrait-view-manager] Initializing Portrait View');

            // Transform coherence results to Portrait View format
            const portraitData = transformToPortraitData(state.coherenceResults);

            // Create or update the Portrait View
            if (!portraitViewInstance) {
                portraitViewInstance = new global.PortraitView('portrait-view-container', {
                    size: 380,
                    showLabels: true,
                    interactive: true
                });
            }

            portraitViewInstance.update(portraitData);
            console.log('[portrait-view-manager] Portrait View updated');
        };

        waitForPortraitView();
    }

    // ═══════════════════════════════════════════════════════════════════════
    // SECTION 4: DATA TRANSFORMATION FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════════
    //
    // PURPOSE: Convert internal data structures to PortraitView format
    //
    // FUNCTIONS:
    //   - transformToPortraitData(): Main transformation
    //   - extractElementalData(): Extract 5 elements from face data
    //
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Transform coherence results to Portrait View data format
     *
     * Converts the internal coherence data structure to the format
     * expected by the PortraitView visualization component.
     *
     * ┌─────────────────────────────────────────────────────────────────────┐
     * │ PHILOSOPHY: Each face is a domain of organizational life. The      │
     * │ Portrait View shows how these 12 domains relate to each other -    │
     * │ their relative coherence, their elemental depth, their warnings.   │
     * └─────────────────────────────────────────────────────────────────────┘
     *
     * @param {Object} coherenceResults - The coherence results from calculation
     * @param {number} coherenceResults.globalCoherence - Overall coherence (0-1)
     * @param {Array} coherenceResults.faces - Array of face objects
     *
     * @returns {Object} Portrait View compatible data structure:
     *   - overallCoherence: {number} Global coherence score
     *   - octave: {string} Overall octave (e.g., 'O3')
     *   - faces: {Object} Object keyed by face ID with face data
     *
     * @example
     * const portraitData = transformToPortraitData(demoState.coherenceResults);
     * portraitView.update(portraitData);
     *
     * @risk Uses getDefaultFaceName/getDefaultElements from octave-utilities.js
     * @risk Uses detectOctave from octave-system.js
     *
     * @since Sprint 3 (original)
     * @since Session 5 Modularization (extracted)
     * @author Claude (with Deimantas)
     */
    function transformToPortraitData(coherenceResults) {
        const faces = {};

        // ────────────────────────────────────────────────────────────────────
        // STEP 1: Get face-level octaves if available from face-wizard
        // ────────────────────────────────────────────────────────────────────
        let faceOctavesMap = {};
        if (typeof global.getFaceOctaves === 'function') {
            faceOctavesMap = global.getFaceOctaves();
        }

        // ────────────────────────────────────────────────────────────────────
        // STEP 2: Detect overall octave
        // ────────────────────────────────────────────────────────────────────
        let overallOctave = 'O3';
        if (typeof global.getOverallOctave === 'function') {
            overallOctave = global.getOverallOctave() || 'O3';
        } else if (Object.keys(faceOctavesMap).length > 0) {
            // Fallback: get from face octaves map
            const octaveValues = Object.values(faceOctavesMap).map(f => f.octave || 'O3');
            overallOctave = octaveValues[0] || 'O3';
        }

        // ────────────────────────────────────────────────────────────────────
        // STEP 3: Transform each face
        // ────────────────────────────────────────────────────────────────────
        coherenceResults.faces.forEach(face => {
            // Extract elemental breakdown if available
            const elements = extractElementalData(face);

            // Get face coherence
            const faceCoherence = face.energy || face.faceEnergy || 0.5;

            // Detect operational octave based on coherence AND elemental engagement
            // Uses detectOctave from octave-system.js
            const octaveInfo = global.detectOctave ?
                global.detectOctave(faceCoherence, elements) :
                { detected: 'O3', effective: 'O3', limitedBy: null, exploredCount: 0, coherenceBased: 'O3' };

            // Get face-specific octave or use detected
            const faceOctaveInfo = faceOctavesMap[face.id];
            const faceOctave = faceOctaveInfo?.octave || face.targetOctave || octaveInfo.effective;

            faces[face.id] = {
                name: face.name || global.getDefaultFaceName?.(face.id) || `Face ${face.id}`,
                coherence: faceCoherence,
                targetOctave: faceOctave,
                octaveInfo: octaveInfo,  // Include full octave detection info
                elements: elements,
                kpis: face.kpis || [],
                warnings: []
            };

            // ────────────────────────────────────────────────────────────────
            // STEP 4: Add warnings for low coherence
            // ────────────────────────────────────────────────────────────────
            // PHI^-2 = 0.381966... is the Structure threshold
            if (faceCoherence < 0.382) {
                faces[face.id].warnings.push('Critical: coherence below phi^2 threshold');
            } else if (faceCoherence < 0.5) {
                faces[face.id].warnings.push('Attention needed: developing coherence');
            }

            // Add warning if octave is limited by elemental coverage
            if (octaveInfo.limitedBy === 'elemental_coverage') {
                faces[face.id].warnings.push(`Octave limited: explore more elements to unlock ${octaveInfo.coherenceBased}`);
            }
        });

        // ────────────────────────────────────────────────────────────────────
        // STEP 5: Ensure all 12 faces exist (fill missing with defaults)
        // ────────────────────────────────────────────────────────────────────
        for (let i = 1; i <= 12; i++) {
            if (!faces[i]) {
                const defaultElements = global.getDefaultElements ?
                    global.getDefaultElements() :
                    { earth: { value: 0 }, water: { value: 0 }, fire: { value: 0 }, air: { value: 0 }, ether: { value: 0 } };
                const defaultName = global.getDefaultFaceName ?
                    global.getDefaultFaceName(i) :
                    `Face ${i}`;

                faces[i] = {
                    name: defaultName,
                    coherence: 0,
                    targetOctave: overallOctave,
                    elements: defaultElements,
                    kpis: [],
                    warnings: ['No data available']
                };
            }
        }

        return {
            overallCoherence: coherenceResults.globalCoherence || 0.5,
            octave: overallOctave,
            faces: faces
        };
    }

    /**
     * Extract elemental breakdown from face data
     *
     * Extracts or constructs the 5-element breakdown for a face.
     * Handles both explicit elemental data and Quick Mode fallbacks.
     *
     * ┌─────────────────────────────────────────────────────────────────────┐
     * │ PHILOSOPHY: The 5 elements represent different ways of engaging    │
     * │ with a domain. A face with only Earth explored is stable but       │
     * │ limited. A face with all 5 elements explored has full expression.  │
     * └─────────────────────────────────────────────────────────────────────┘
     *
     * The 5 elements (pentagram):
     *   - Earth (Foundation): Is it grounded?
     *   - Water (Flow): Is it flowing?
     *   - Fire (Energy): Is there action?
     *   - Air (Communication): Is it clear?
     *   - Ether (Purpose): Is it aligned?
     *
     * @param {Object} face - Face data object
     * @param {Object} [face.elements] - Explicit elemental data (if available)
     * @param {Array} [face.kpis] - KPIs that may have element tags
     * @param {number} [face.energy] - Overall face energy (for Quick Mode)
     *
     * @returns {Object} Elemental breakdown with values and exploration status
     *   Each element has: { value, label, explored, question, kpiName? }
     *
     * @example
     * // Full elemental data
     * const elements = extractElementalData(faceWithKpis);
     * // Returns { earth: { value: 0.8, explored: true, ... }, ... }
     *
     * @example
     * // Quick Mode - single KPI assigned to Earth
     * const elements = extractElementalData(quickModeFace);
     * // Returns { earth: { value: 0.7, explored: true }, water: { explored: false }, ... }
     *
     * @risk Returns unexplored elements for faces without KPI data
     *
     * @since Sprint 3 (original)
     * @since Session 5 Modularization (extracted)
     * @author Claude (with Deimantas)
     */
    function extractElementalData(face) {
        // If face has explicit elemental data, use it
        if (face.elements) return face.elements;

        // ────────────────────────────────────────────────────────────────────
        // Default: all elements unexplored (Quick Mode starts here)
        // ────────────────────────────────────────────────────────────────────
        const elements = {
            earth: { value: null, label: 'Foundation', explored: false, question: 'Is it grounded?' },
            water: { value: null, label: 'Flow', explored: false, question: 'Is it flowing?' },
            fire: { value: null, label: 'Energy', explored: false, question: 'Is there action?' },
            air: { value: null, label: 'Communication', explored: false, question: 'Is it clear?' },
            ether: { value: null, label: 'Purpose', explored: false, question: 'Is it aligned?' }
        };

        if (face.kpis && face.kpis.length > 0) {
            // ────────────────────────────────────────────────────────────────
            // Try to extract from elemental KPIs
            // ────────────────────────────────────────────────────────────────
            const elementalKpis = {
                earth: face.kpis.filter(k => k.element === 'earth' || k.element === 'Earth'),
                water: face.kpis.filter(k => k.element === 'water' || k.element === 'Water'),
                fire: face.kpis.filter(k => k.element === 'fire' || k.element === 'Fire'),
                air: face.kpis.filter(k => k.element === 'air' || k.element === 'Air'),
                ether: face.kpis.filter(k => k.element === 'ether' || k.element === 'Ether')
            };

            Object.keys(elementalKpis).forEach(element => {
                const kpis = elementalKpis[element];
                if (kpis.length > 0) {
                    const avgScore = kpis.reduce((sum, k) => sum + (k.normalizedScore || 0.5), 0) / kpis.length;
                    elements[element] = {
                        value: avgScore,
                        label: kpis[0]?.label || kpis[0]?.name || element,
                        explored: true,
                        kpiName: kpis[0]?.name,
                        question: elements[element].question
                    };
                }
            });

            // ────────────────────────────────────────────────────────────────
            // Quick Mode fallback
            // ────────────────────────────────────────────────────────────────
            // If no element tags exist but face has KPIs, assign all to Earth.
            // This handles the Quick Mode scenario where users enter a single
            // KPI without specifying which element it belongs to.
            // ────────────────────────────────────────────────────────────────
            const hasElementTags = Object.values(elementalKpis).some(arr => arr.length > 0);
            if (!hasElementTags && face.kpis.length > 0) {
                // In Quick Mode, the single KPI represents Earth element
                const kpi = face.kpis[0];
                const score = kpi.normalizedScore || kpi.coherence || face.energy || 0.5;
                elements.earth = {
                    value: score,
                    label: kpi.name || 'Foundation',
                    explored: true,
                    kpiName: kpi.name,
                    question: 'Is it grounded?'
                };
            }
        }

        return elements;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // SECTION 5: EXPORTS
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
    // │ initializePortraitView     │ Initialize/update the Portrait View     │
    // │ transformToPortraitData    │ Transform coherence data to PV format   │
    // │ extractElementalData       │ Extract 5-element breakdown from face   │
    // └────────────────────────────┴─────────────────────────────────────────┘
    //
    // BACKWARD COMPATIBILITY:
    // These functions were previously in orchestrator-dashboard.js
    // This export maintains the same API for existing consumers.
    //
    // ═══════════════════════════════════════════════════════════════════════

    // Export to global scope (browser)
    global.initializePortraitView = initializePortraitView;
    global.transformToPortraitData = transformToPortraitData;
    global.extractElementalData = extractElementalData;

    // CommonJS export (Node.js/testing)
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = {
            initializePortraitView,
            transformToPortraitData,
            extractElementalData
        };
    }

    console.log('[dashboard/portrait-view-manager] Module loaded - 2D visualization ready');

})(typeof window !== 'undefined' ? window : this);
