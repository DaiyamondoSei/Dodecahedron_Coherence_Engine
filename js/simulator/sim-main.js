/**
 * ========================================
 * MODULE: sim-main.js
 * ========================================
 *
 * Main initialization orchestrator for the Coherence Simulator.
 * This module coordinates all other sim modules and runs the startup sequence.
 *
 * Created for: Coherence Simulator modularization
 * Date: February 2026
 *
 * PURPOSE:
 * - Initialize all simulator subsystems in correct order
 * - Wire cross-module callbacks (slider -> engine -> sync)
 * - Export public SimulatorAPI for external access
 * - Handle the full initialization lifecycle
 *
 * DEPENDENCIES (load order critical):
 * 1. sim-state.js      - Central state registry
 * 2. sim-company.js     - Company selector
 * 3. sim-controls.js    - 12 face sliders
 * 4. sim-engine.js      - Quannex engine integration
 * 5. sim-breath.js      - Breath axis visualization
 * 6. sim-shadow.js      - Shadow detection
 * 7. sim-sync.js        - BroadcastChannel
 * 8. sim-scenarios.js   - Save/load scenarios
 * 9. sim-main.js        - THIS FILE (orchestrator)
 *
 * EXPORTS (to window/global):
 * - SimMain: { start }
 * - SimulatorAPI: Public API for external access
 *
 * NOTES FOR FUTURE CLAUDE:
 * ========================================
 * INITIALIZATION SEQUENCE:
 * The start() method is called by the ES module bootstrap in simulator.html
 * AFTER UnifiedDataLoader has been injected into SimEngine.
 *
 * 1. SimStateHelpers.initFromConstants() - Populate faces/axes from SSOT
 * 2. Gather DOM references - status bar, panel containers
 * 3. SimCompany.init() - Build selector, detect current company
 * 4. SimControls.init() - Build 12 slider cards
 * 5. SimEngine.init() - Connect to engine, load company data
 * 6. SimControls.initFromEngine() - Set sliders from engine state
 * 7. SimBreath.init() - Build breath panel
 * 8. SimShadow.init() - Build shadow panel
 * 9. SimSync.init() - Setup BroadcastChannel
 * 10. SimScenarios.init() - Load saved scenarios
 * 11. Wire callbacks - slider change -> engine -> sync -> panels
 * 12. Initial panel update
 *
 * ERROR HANDLING:
 * If any phase fails, subsequent phases still attempt to run.
 * The simulator degrades gracefully rather than failing entirely.
 *
 * COMPANY SWITCH FLOW:
 * SimCompany change -> SimEngine.initWithCompany() ->
 * SimControls.initFromEngine() -> all panels update
 * ========================================
 */
(function (global) {
    'use strict';

    const S = global.SimState;

    const SimMain = {

        /**
         * Run the full initialization sequence.
         * Called by the ES module bootstrap after loader injection.
         */
        async start() {
            Logger.info('SimMain', '\uD83D\uDE80 Coherence Simulator v3.0 - Full Vision');
            Logger.info('SimMain', 'Starting initialization sequence...');

            try {
                // Phase 1: Initialize constants from SSOT
                Logger.info('SimMain', '[1/12] Initializing constants from KpiConstants...');
                SimStateHelpers.initFromConstants();

                // Phase 2: Gather DOM references
                Logger.info('SimMain', '[2/12] Gathering DOM references...');
                _gatherDOMReferences();

                // Phase 3: Company selector
                Logger.info('SimMain', '[3/12] Building company selector...');
                const companySelectorContainer = document.getElementById('sim-company-container');
                SimCompany.init(companySelectorContainer);
                SimCompany.setOnChange(async (companyId) => {
                    await _handleCompanySwitch(companyId);
                });

                // Phase 4: Build slider controls
                Logger.info('SimMain', '[4/12] Building 12 face slider controls...');
                const controlsArea = document.querySelector('.sim-controls-area');
                SimControls.init(controlsArea);

                // Phase 5: Connect engine
                Logger.info('SimMain', '[5/12] Connecting to Quannex engine...');
                const engineConnected = await SimEngine.init();

                // Phase 6: Initialize sliders from engine state
                Logger.info('SimMain', '[6/12] Initializing sliders from engine state...');
                if (engineConnected && global.Quannex) {
                    const state = global.Quannex.getState();
                    if (state) SimControls.initFromEngine(state);
                }

                // Phase 7: Breath panel
                Logger.info('SimMain', '[7/12] Building breath axis panel...');
                const breathPanel = document.getElementById('sim-breath-panel');
                SimBreath.init(breathPanel);

                // Phase 8: Shadow panel
                Logger.info('SimMain', '[8/12] Building shadow detection panel...');
                const shadowPanel = document.getElementById('sim-shadow-panel');
                SimShadow.init(shadowPanel);

                // Phase 9: BroadcastChannel sync
                Logger.info('SimMain', '[9/12] Setting up cross-window sync...');
                SimSync.init();

                // Phase 10: Scenarios
                Logger.info('SimMain', '[10/12] Loading saved scenarios...');
                const scenariosArea = document.querySelector('.sim-scenarios-area');
                SimScenarios.init(scenariosArea);

                // Phase 11: Wire cross-module callbacks
                Logger.info('SimMain', '[11/12] Wiring cross-module callbacks...');
                SimControls.setOnChange(() => {
                    SimEngine.pushToEngine();
                    SimBreath.update();
                    SimShadow.update();
                    SimSync.broadcast();
                });

                // Phase 12: Initial panel update
                Logger.info('SimMain', '[12/12] Running initial panel update...');
                SimEngine.calculateImpact();
                SimBreath.update();
                SimShadow.update();

                Logger.info('SimMain', '\u2705 Coherence Simulator fully initialized!');
                Logger.info('SimMain', `Company: ${S.COMPANY_NAMES[S.currentCompanyId] || S.currentCompanyId}`);
                Logger.info('SimMain', `Mode: ${S.mockMode ? 'Demo (mock)' : 'Live Engine'}`);
                Logger.info('SimMain', `Baseline coherence: ${Math.round(S.baselineCoherence * 100)}%`);

            } catch (error) {
                Logger.error('SimMain', 'Initialization error:', error);
            }
        }
    };

    // ========================================
    // PRIVATE HELPERS
    // ========================================

    function _gatherDOMReferences() {
        S.statusElements.company = document.getElementById('sim-current-company');
        S.statusElements.baseline = document.getElementById('sim-baseline-coherence');
        S.statusElements.engine = document.getElementById('sim-engine-status');

        S.panels.impact = document.getElementById('sim-impact-panel');
        S.panels.breath = document.getElementById('sim-breath-panel');
        S.panels.shadow = document.getElementById('sim-shadow-panel');
    }

    async function _handleCompanySwitch(companyId) {
        Logger.info('SimMain', `Company switch: ${companyId}`);

        // Re-initialize engine with new company
        const connected = await SimEngine.initWithCompany(companyId);

        // Re-initialize sliders
        if (connected && global.Quannex) {
            const state = global.Quannex.getState();
            if (state) SimControls.initFromEngine(state);
        } else {
            // Reset to defaults in mock mode
            for (let i = 1; i <= 12; i++) {
                SimControls.updateSlider(i, 50);
            }
        }

        // Reload scenarios for new company
        SimScenarios._loadFromStorage();
        SimScenarios._render();

        // Update all panels
        SimEngine.calculateImpact();
        SimBreath.update();
        SimShadow.update();
        SimSync.broadcast();
    }

    // ========================================
    // PUBLIC API (for external access)
    // ========================================

    global.SimulatorAPI = {
        getState: () => ({
            companyId: S.currentCompanyId,
            engineReady: S.engineReady,
            mockMode: S.mockMode,
            baselineCoherence: S.baselineCoherence,
            sliderValues: [...S.sliderValues],
            baselineValues: [...S.baselineValues]
        }),
        resetToBaseline: () => SimControls.resetAll(),
        saveScenario: (name) => SimScenarios.save(name),
        toggleSync: () => SimSync.toggle(),
        switchCompany: (id) => SimCompany.switchCompany(id)
    };

    // ========================================
    // EXPORTS
    // ========================================

    global.SimMain = SimMain;

    Logger.info('SimMain', 'Module loaded - Orchestrator ready (awaiting start())');

})(typeof window !== 'undefined' ? window : this);
