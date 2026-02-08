/**
 * ========================================
 * MODULE: sim-state.js
 * ========================================
 *
 * Created for: Coherence Simulator modularization
 * Date: February 2026
 *
 * PURPOSE:
 * Central state registry for the Coherence Simulator. All simulator
 * modules read from and write to this shared state object.
 * This is the FIRST simulator module loaded.
 *
 * DEPENDENCIES:
 * - js/constants/phi-harmonics.js (for PHI constant)
 * - js/constants/kpi-constants.js (for AXIS_OPPOSITIONS, DOMAIN_NAMES, FACE_OPPOSITES)
 *
 * EXPORTS (to window/global):
 * - SimState: Main state object containing all shared variables
 *
 * NOTES FOR FUTURE CLAUDE:
 * ========================================
 * This module mirrors the pattern from dodec-state.js but for the simulator.
 *
 * PATTERN:
 * All other sim modules import SimState as 'S' for brevity:
 *   const S = global.SimState;
 *   S.sliderValues[0] = 75;
 *
 * STATE CATEGORIES:
 * 1. Face Definitions - The 12 faces, read from KpiConstants at init
 * 2. Breath Axes - The 6 axis pairs, read from KpiConstants at init
 * 3. Slider State - Current values (0-100), baseline snapshot
 * 4. Engine State - Ready flag, baseline coherence, company ID
 * 5. DOM References - Populated by sim-controls.js and others
 * 6. Scenarios - Save/load data
 * 7. Sync - BroadcastChannel state
 *
 * IMPORTANT:
 * - Face IDs are 1-based (matching SSOT), array indices are 0-based
 * - sliderValues uses 0-100 range (UI%), converted to 0.0-1.0 for engine
 * - FACE_DEFINITIONS and BREATH_AXES are populated at init() time,
 *   not at script load time, because KpiConstants may load async
 *
 * ========================================
 */
(function (global) {
    'use strict';

    // ========================================
    // CONSTANTS FROM SSOT
    // ========================================

    const _PH = global.PhiHarmonics || {};
    const PHI = _PH.PHI || 1.618033988749895;

    // ========================================
    // FACE ICON MAP
    // ========================================
    // Unicode icons for each face (used in slider cards)

    const FACE_ICONS = {
        1: '\uD83D\uDCB0',  // Financial Capital
        2: '\uD83D\uDCA1',  // Intellectual Capital
        3: '\uD83D\uDC65',  // Human Capital
        4: '\uD83C\uDFDB\uFE0F',  // Structural Capital
        5: '\uD83D\uDCCA',  // Market Resonance
        6: '\uD83E\uDD1D',  // Community & Partners
        7: '\u2B50',        // Brand & Reputation
        8: '\u2699\uFE0F',  // Core Operations
        9: '\u267B\uFE0F',  // Regenerative Flow
        10: '\uD83C\uDFAF', // Foundational Values
        11: '\uD83D\uDC8E', // Funding Pipeline
        12: '\uD83D\uDEE1\uFE0F'  // Risk & Resilience
    };

    // ========================================
    // CENTRAL STATE REGISTRY
    // ========================================

    const SimState = {

        // ========================================
        // FACE DEFINITIONS (populated by init())
        // ========================================
        // 12 entries: { faceId, arrayIndex, name, icon, partnerId }
        // Built from KpiConstants.DOMAIN_NAMES + KpiConstants.FACE_OPPOSITES
        FACE_DEFINITIONS: [],

        // ========================================
        // BREATH AXES (populated by init())
        // ========================================
        // 6 entries from KpiConstants.AXIS_OPPOSITIONS
        // { id, name, faceA, faceB, tension, question }
        BREATH_AXES: [],

        // ========================================
        // SLIDER STATE
        // ========================================
        // 12 values, index 0 = Face 1, index 11 = Face 12
        // Range: 0-100 (UI percentage)

        /** @type {number[]} - Current slider values (0-100) */
        sliderValues: new Array(12).fill(50),

        /** @type {number[]} - Baseline values snapshot at company load (0-100) */
        baselineValues: new Array(12).fill(50),

        // ========================================
        // ENGINE STATE
        // ========================================

        /** @type {boolean} - Whether Quannex engine is connected and ready */
        engineReady: false,

        /** @type {number} - Baseline global coherence at company load (0-1) */
        baselineCoherence: 0,

        /** @type {string|null} - Currently loaded company ID */
        currentCompanyId: null,

        /** @type {boolean} - Whether running in mock mode (no engine) */
        mockMode: false,

        // ========================================
        // DOM REFERENCES (populated by modules)
        // ========================================

        /** @type {Object} - Slider DOM elements by faceId */
        sliders: {},

        /** @type {Object} - Value display DOM elements by faceId */
        valueDisplays: {},

        /** @type {Object} - Panel container elements */
        panels: {
            impact: null,
            breath: null,
            shadow: null,
            scenarios: null
        },

        /** @type {Object} - Status bar elements */
        statusElements: {
            company: null,
            baseline: null,
            engine: null
        },

        // ========================================
        // SCENARIO STATE
        // ========================================

        /** @type {Array} - Saved scenarios for current company */
        savedScenarios: [],

        // ========================================
        // SYNC STATE
        // ========================================

        /** @type {boolean} - Whether BroadcastChannel sync is enabled */
        syncEnabled: true,

        /** @type {BroadcastChannel|null} - Active broadcast channel */
        broadcastChannel: null,

        // ========================================
        // CONSTANTS
        // ========================================

        /** @type {number} - Golden Ratio */
        PHI: PHI,

        /** @type {number} - Debounce delay for engine updates (ms) */
        DEBOUNCE_MS: 100,

        /** @type {number} - Engine wait timeout (ms) */
        ENGINE_TIMEOUT_MS: 5000,

        /** @type {Object} - Company display names */
        COMPANY_NAMES: {
            'quannex': 'Quannex AI',
            'nova-tech': 'NovaTech Solutions',
            'zenith-solutions': 'Zenith Global',
            'apex-industries': 'Apex Industries'
        },

        /** @type {Object} - Face icons by faceId */
        FACE_ICONS: FACE_ICONS
    };

    // ========================================
    // INITIALIZATION
    // ========================================
    // Populates FACE_DEFINITIONS and BREATH_AXES from KpiConstants.
    // Called by sim-main.js during startup, after kpi-constants.js has loaded.

    /**
     * Initialize face definitions and breath axes from KpiConstants SSOT.
     * Must be called before any module that reads FACE_DEFINITIONS or BREATH_AXES.
     */
    function initFromConstants() {
        const KC = global.KpiConstants;

        if (!KC) {
            Logger.warn('SimState', 'KpiConstants not loaded - using hardcoded fallback');
            _initFallback();
            return;
        }

        // Build FACE_DEFINITIONS from DOMAIN_NAMES + FACE_OPPOSITES
        SimState.FACE_DEFINITIONS = [];
        const domainNames = KC.DOMAIN_NAMES || {};
        const faceOpposites = KC.FACE_OPPOSITES || {};

        for (let faceId = 1; faceId <= 12; faceId++) {
            SimState.FACE_DEFINITIONS.push({
                faceId: faceId,
                arrayIndex: faceId - 1,
                name: domainNames[faceId] || `Face ${faceId}`,
                icon: FACE_ICONS[faceId] || '',
                partnerId: faceOpposites[faceId] || null
            });
        }

        // Build BREATH_AXES from AXIS_OPPOSITIONS
        SimState.BREATH_AXES = [];
        const axes = KC.AXIS_OPPOSITIONS || {};

        Object.keys(axes).sort().forEach(key => {
            const axis = axes[key];
            SimState.BREATH_AXES.push({
                id: axis.id,
                name: axis.name,
                faceA: axis.faceA,
                faceB: axis.faceB,
                domainA: axis.domainA,
                domainB: axis.domainB,
                tension: axis.tension,
                question: axis.question
            });
        });

        Logger.info('SimState', `Initialized ${SimState.FACE_DEFINITIONS.length} faces and ${SimState.BREATH_AXES.length} breath axes from KpiConstants`);
    }

    /**
     * Fallback initialization if KpiConstants isn't available.
     * Uses hardcoded values matching the SSOT.
     */
    function _initFallback() {
        const names = [
            'Financial Capital', 'Intellectual Capital', 'Human Capital',
            'Structural Capital', 'Market Resonance', 'Community & Partners',
            'Brand & Reputation', 'Core Operations', 'Regenerative Flow',
            'Foundational Values', 'Funding Pipeline', 'Risk & Resilience'
        ];
        const opposites = { 1:11, 2:7, 3:8, 4:9, 5:10, 6:12, 7:2, 8:3, 9:4, 10:5, 11:1, 12:6 };

        SimState.FACE_DEFINITIONS = names.map((name, i) => ({
            faceId: i + 1,
            arrayIndex: i,
            name: name,
            icon: FACE_ICONS[i + 1] || '',
            partnerId: opposites[i + 1]
        }));

        SimState.BREATH_AXES = [
            { id: 'resourceFlow',        name: 'Resource Flow',          faceA: 1, faceB: 11, domainA: 'Financial Capital',    domainB: 'Funding Pipeline',     tension: 'Earning vs raising capital',            question: 'Are we financially self-sustaining or funding-dependent?' },
            { id: 'knowledgeFlow',        name: 'Knowledge Flow',         faceA: 2, faceB: 7,  domainA: 'Intellectual Capital',  domainB: 'Brand & Reputation',   tension: 'Internal knowing vs external perception', question: 'Does our reputation reflect our true knowledge?' },
            { id: 'beingDoing',           name: 'Being & Doing',          faceA: 3, faceB: 8,  domainA: 'Human Capital',         domainB: 'Core Operations',      tension: 'Who we are vs what we do',              question: 'Are we burning out our people?' },
            { id: 'structureAdaptation',  name: 'Structure & Adaptation', faceA: 4, faceB: 9,  domainA: 'Structural Capital',    domainB: 'Regenerative Flow',    tension: 'Stability vs renewal',                  question: 'Are our structures enabling or blocking regeneration?' },
            { id: 'internalExternal',     name: 'Internal & External',    faceA: 5, faceB: 10, domainA: 'Market Resonance',      domainB: 'Foundational Values',  tension: 'Market demands vs core values',         question: 'Are we compromising values for market success?' },
            { id: 'connectionProtection', name: 'Connection & Protection',faceA: 6, faceB: 12, domainA: 'Community & Partners',  domainB: 'Risk & Resilience',    tension: 'Openness vs protection',                question: 'Are partnerships increasing or decreasing our vulnerability?' }
        ];

        Logger.info('SimState', 'Initialized from hardcoded fallback (KpiConstants unavailable)');
    }

    /**
     * Reset slider values to baseline (undo all changes)
     */
    function resetToBaseline() {
        SimState.sliderValues = [...SimState.baselineValues];
        Logger.info('SimState', 'Slider values reset to baseline');
    }

    /**
     * Convert slider value (0-100) to engine energy (0.0-1.0)
     * @param {number} sliderValue - Value from 0 to 100
     * @returns {number} Energy from 0.0 to 1.0
     */
    function sliderToEnergy(sliderValue) {
        return Math.max(0, Math.min(1, sliderValue / 100));
    }

    /**
     * Convert engine energy (0.0-1.0) to slider value (0-100)
     * @param {number} energy - Value from 0.0 to 1.0
     * @returns {number} Slider value from 0 to 100
     */
    function energyToSlider(energy) {
        return Math.round(Math.max(0, Math.min(100, energy * 100)));
    }

    // ========================================
    // EXPORTS
    // ========================================

    global.SimState = SimState;

    global.SimStateHelpers = {
        initFromConstants,
        resetToBaseline,
        sliderToEnergy,
        energyToSlider
    };

    Logger.info('SimState', 'Module loaded - Central state registry ready');

})(typeof window !== 'undefined' ? window : this);
