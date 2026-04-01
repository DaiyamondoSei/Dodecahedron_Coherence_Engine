/**
 * ========================================
 * MODULE: orchestrator-state.js
 * ========================================
 *
 * Extracted from: demo-orchestrator-logic.js
 * Original lines: 118-173
 * Date: December 15, 2025
 *
 * PURPOSE:
 * Central state management for the Demo Orchestrator.
 * Contains the global demoState object and PHI-based constants.
 *
 * DEPENDENCIES:
 * - js/constants/phi-harmonics.js (for PHI values)
 *
 * EXPORTS (to window/global):
 * - demoState: Main application state object
 * - isSelectingCompanyTemplate(): Getter for re-entrancy guard
 * - setSelectingCompanyTemplate(val): Setter for re-entrancy guard
 * - OCTAVE_COHERENCE_THRESHOLDS: PHI-derived octave boundaries
 *
 * ========================================
 */
(function (global) {
    'use strict';

    // ========================================
    // IMPORTS
    // ========================================

    // PHI constants from phi-harmonics.js (SSOT)
    const _PH = global.PhiHarmonics || {};

    // PHI Powers (φ^-n): Decreasing sequence toward 0
    const PHI_1 = _PH.PHI_1 || 0.618033988749895;           // φ^-1 ≈ 0.618
    const PHI_2 = _PH.PHI_2 || 0.381966011250105;           // φ^-2 ≈ 0.382
    const PHI_3 = _PH.PHI_3 || 0.2360679774997896;          // φ^-3 ≈ 0.236
    const PHI_4 = _PH.PHI_4 || 0.1458980337503153;          // φ^-4 ≈ 0.146

    // PSI Values (complements): PSI_n = 1 - φ^-n
    const PSI_3 = _PH.PSI_3 || 0.763932022500210;           // 1 - φ^-3 ≈ 0.764
    const PSI_4 = _PH.PSI_4 || 0.8541019662496847;          // 1 - φ^-4 ≈ 0.854
    const PSI_5 = _PH.PSI_5 || 0.909830056250526;           // 1 - φ^-5 ≈ 0.910

    // ========================================
    // GLOBAL STATE
    // ========================================

    /**
     * Main application state for the Demo Orchestrator
     *
     * @property {number} currentStep - Current wizard step (0-5)
     * @property {number} totalSteps - Total steps in the wizard
     * @property {Object|null} faceConfig - Custom face name mappings
     * @property {string|null} kpiMode - 'quick' or 'full' KPI entry mode
     * @property {Object|null} kpiData - Entered KPI values
     * @property {Object|null} coherenceResults - Calculation results
     * @property {Array} completedSteps - Array of completed step numbers
     * @property {string|null} selectedCompanyId - Selected company template ID
     * @property {Object|null} loadedMappingContext - AI mapping context
     * @property {string} setupMode - 'manual' or 'ai-assisted'
     */
    const demoState = {
        currentStep: 0,
        totalSteps: 5, // Includes Step 0
        faceConfig: null,
        kpiMode: null, // 'quick' or 'full'
        kpiData: null,
        coherenceResults: null,
        completedSteps: [],
        selectedCompanyId: null, // Track which company template is selected
        loadedMappingContext: null, // Store the loaded mapping context
        setupMode: 'manual' // Phase 5: Track setup mode for AI integration ('manual' | 'ai-assisted')
    };

    // ========================================
    // RE-ENTRANCY GUARD
    // ========================================

    /**
     * Re-entrancy guard to prevent infinite loop when clicking company cards
     * (Fix for event handler loop bug observed during testing)
     *
     * @private
     */
    let _isSelectingCompanyTemplate = false;

    /**
     * Check if we're currently in the process of selecting a company template
     * @returns {boolean}
     */
    function isSelectingCompanyTemplate() {
        return _isSelectingCompanyTemplate;
    }

    /**
     * Set the company template selection state
     * @param {boolean} value
     */
    function setSelectingCompanyTemplate(value) {
        _isSelectingCompanyTemplate = value;
    }

    // ========================================
    // PHI-BASED OCTAVE THRESHOLDS
    // ========================================

    /**
     * PHI-based octave thresholds for coherence detection
     *
     * Maps the 7 octaves of organizational development:
     * - O1 (Survival): 0.0 baseline
     * - O2 (Structure): φ^-2 ≈ 0.382
     * - O3 (Relationships): 0.5 (mathematical midpoint)
     * - O4 (Creativity): φ^-1 ≈ 0.618 (Golden Ratio)
     * - O5 (Expression): Ψ³ ≈ 0.764
     * - O6 (Vision): Ψ⁴ ≈ 0.854
     * - O7 (Radiance): PSI_5 ≈ 0.910
     *
     * @constant
     */
    const OCTAVE_COHERENCE_THRESHOLDS = {
        O1: 0.0,        // Survival - just existing
        O2: PHI_2,      // Structure - φ^-2 ≈ 0.382
        O3: 0.5,        // Relationships - midpoint
        O4: PHI_1,      // Creativity - φ^-1 ≈ 0.618 (Golden Ratio)
        O5: PSI_3,      // Expression - Ψ³ ≈ 0.764
        O6: PSI_4,      // Vision - Ψ⁴ ≈ 0.854
        O7: PSI_5       // Radiance - Ψ⁵ ≈ 0.910
    };

    // Also export numeric-keyed version for compatibility
    const OCTAVE_COHERENCE_THRESHOLDS_NUMERIC = {
        1: 0.0,         // O1 Survival
        2: PHI_2,       // O2 Structure
        3: 0.5,         // O3 Relationships
        4: PHI_1,       // O4 Creativity
        5: PSI_3,       // O5 Expression
        6: PSI_4,       // O6 Vision
        7: PSI_5        // O7 Radiance
    };

    // ========================================
    // EXPORTS
    // ========================================

    global.demoState = demoState;
    global.isSelectingCompanyTemplate = isSelectingCompanyTemplate;
    global.setSelectingCompanyTemplate = setSelectingCompanyTemplate;
    global.OCTAVE_COHERENCE_THRESHOLDS = OCTAVE_COHERENCE_THRESHOLDS;
    global.OCTAVE_COHERENCE_THRESHOLDS_NUMERIC = OCTAVE_COHERENCE_THRESHOLDS_NUMERIC;

    // Also export the local PHI values for any module that needs them
    global.OrchestratorPHI = {
        PHI_1, PHI_2, PHI_3, PHI_4,
        PSI_3, PSI_4, PSI_5
    };

    Logger.info('OrchestratorState', 'Module loaded');

})(typeof window !== 'undefined' ? window : this);
