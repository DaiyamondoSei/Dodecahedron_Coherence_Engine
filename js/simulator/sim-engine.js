/**
 * ========================================
 * MODULE: sim-engine.js
 * ========================================
 *
 * Created for: Coherence Simulator modularization
 * Date: February 2026
 *
 * PURPOSE:
 * All interaction with the Quannex calculation engine. Handles engine
 * detection, company data loading, face energy updates, recalculation,
 * and impact calculation. Falls back to mock mode when engine unavailable.
 *
 * DEPENDENCIES:
 * - sim-state.js (SimState, SimStateHelpers)
 * - UnifiedDataLoader (ES module, injected via setLoader)
 * - window.Quannex (from js/main.js, loaded async)
 *
 * EXPORTS (to window/global):
 * - SimEngine: { init, setLoader, pushToEngine, calculateImpact,
 *                getBreathAnalysis, getShadowAnalysis, getSpectralAnalysis,
 *                initWithCompany, waitForEngine }
 *
 * NOTES FOR FUTURE CLAUDE:
 * ========================================
 * ES MODULE BRIDGE PATTERN:
 * UnifiedDataLoader is an ES module and can't be imported in an IIFE.
 * The bootstrap <script type="module"> in simulator.html creates the
 * instance and passes it via SimEngine.setLoader(new UnifiedDataLoader()).
 * This is the same pattern used by the existing simulator.html bootstrap.
 *
 * ENGINE DETECTION (waitForEngine):
 * main.js is an ES module, so window.Quannex appears asynchronously.
 * waitForEngine polls at 100ms intervals up to ENGINE_TIMEOUT_MS (5s).
 * It checks for both existence of window.Quannex AND that the
 * initWithCompany method is a function (not just a partial load).
 *
 * FACE ENERGY CONVERSION:
 * - Slider values: 0-100 (UI percentage, integer)
 * - Engine values: 0.0-1.0 (float) via updateFaceEnergy(arrayIndex, energy)
 * - Array indices: 0-based (Face 1 = index 0, Face 12 = index 11)
 * - Conversion: SimStateHelpers.sliderToEnergy(slider) = slider / 100
 *
 * MOCK MODE CALCULATIONS (thesis-relevant):
 * When engine unavailable, three fallback formulas approximate results:
 *
 * 1. _calculateImpactMock() - Global coherence:
 *    coherence = average(allSliders) / 100
 *    This is a linear approximation. Real engine uses phi-weighted
 *    spectral analysis producing non-linear results.
 *
 * 2. _calculateBalanceFallback() - Being/Doing balance:
 *    being = (F3_Human[2] + F9_Regen[8]) / 200
 *    doing = (F8_Operations[7] + F1_Financial[0]) / 200
 *    ratio = doing / being  (division-by-zero protected: returns 0)
 *    Balanced: 0.8 <= ratio <= 1.2 (phi-derived thresholds)
 *    These faces were chosen because F3+F9 represent the "being" pole
 *    (people + regeneration) while F8+F1 represent "doing" (operations
 *    + financial output) — the fundamental organizational tension.
 *
 * 3. _calculateShadowFallback(coherence) - Shadow summary:
 *    Only checks Burnout Engine (F8>80% && F3<50%) as the most common
 *    shadow pattern. Full shadow detection is in sim-shadow.js.
 *    coherence > 0.7 = "System Coherent", else "Minor Imbalances"
 *
 * BASELINE TRACKING:
 * S.baselineCoherence is captured once at company load (from engine
 * state). All impact calculations show delta from this baseline.
 * Mock mode uses 0.67 as default baseline (moderate health assumption).
 * ========================================
 */
(function (global) {
    'use strict';

    const S = global.SimState;

    // Private state
    let _loader = null;

    // ========================================
    // PUBLIC API
    // ========================================

    const SimEngine = {

        /**
         * Set the UnifiedDataLoader instance (injected from ES module bootstrap).
         * @param {UnifiedDataLoader} loader
         */
        setLoader(loader) {
            _loader = loader;
            Logger.info('SimEngine', 'UnifiedDataLoader injected');
        },

        /**
         * Initialize the engine: wait for Quannex, load company data.
         * Updates SimState flags and status display.
         * @returns {Promise<boolean>} true if engine connected, false if mock mode
         */
        async init() {
            const companyId = sessionStorage.getItem('selectedCompanyId') || 'quannex';
            return await this.initWithCompany(companyId);
        },

        /**
         * Initialize (or re-initialize) with a specific company.
         * @param {string} companyId
         * @returns {Promise<boolean>} true if engine connected
         */
        async initWithCompany(companyId) {
            S.currentCompanyId = companyId;

            _updateStatus('Loading...', 'warning');
            _updateCompanyDisplay(companyId);

            try {
                await this.waitForEngine(S.ENGINE_TIMEOUT_MS);

                if (!_loader) {
                    throw new Error('UnifiedDataLoader not injected');
                }

                Logger.info('SimEngine', `Loading company data: ${companyId}`);
                const context = await _loader.loadContext(companyId);

                if (!context) {
                    throw new Error('Failed to load context for ' + companyId);
                }

                // Initialize engine with company data
                await global.Quannex.initWithCompany({
                    ...context.company,
                    faceConfig: { faces: context.faces },
                    kpis: context.kpis,
                    shadowPatterns: context.shadowPatterns || []
                });

                // Capture baseline
                const state = global.Quannex.getState();
                S.baselineCoherence = state.globalCoherence || 0;
                S.engineReady = true;
                S.mockMode = false;

                _updateStatus('Ready', 'success');
                _updateBaseline(S.baselineCoherence);

                Logger.info('SimEngine', `Engine ready. Baseline coherence: ${Math.round(S.baselineCoherence * 100)}%`);
                return true;

            } catch (error) {
                Logger.warn('SimEngine', 'Engine unavailable, entering mock mode:', error.message);
                S.engineReady = false;
                S.mockMode = true;
                S.baselineCoherence = 0.67; // Reasonable default

                _updateStatus('Demo Mode', 'warning');
                _updateBaseline(S.baselineCoherence);

                return false;
            }
        },

        /**
         * Wait for window.Quannex to become available.
         * @param {number} timeout - Max wait in ms
         * @returns {Promise<void>}
         */
        waitForEngine(timeout) {
            return new Promise((resolve, reject) => {
                const startTime = Date.now();

                function check() {
                    if (global.Quannex && typeof global.Quannex.initWithCompany === 'function') {
                        Logger.info('SimEngine', 'Quannex engine detected');
                        resolve();
                    } else if (Date.now() - startTime > timeout) {
                        reject(new Error('Quannex engine not available after ' + timeout + 'ms'));
                    } else {
                        setTimeout(check, 100);
                    }
                }

                check();
            });
        },

        /**
         * Push current slider values to the Quannex engine and recalculate.
         * Called on debounced slider change.
         */
        pushToEngine() {
            if (S.mockMode) {
                this.calculateImpact();
                return;
            }

            if (!S.engineReady || !global.Quannex) return;

            try {
                // Update each face energy
                S.FACE_DEFINITIONS.forEach(def => {
                    const energy = SimStateHelpers.sliderToEnergy(S.sliderValues[def.arrayIndex]);
                    if (global.Quannex.updateFaceEnergy) {
                        global.Quannex.updateFaceEnergy(def.arrayIndex, energy);
                    }
                });

                // Trigger recalculation
                if (global.Quannex.recalculate) {
                    global.Quannex.recalculate();
                }

                this.calculateImpact();

            } catch (error) {
                Logger.error('SimEngine', 'Error pushing to engine:', error);
            }
        },

        /**
         * Calculate and display impact metrics.
         * Uses real engine if available, mock calculation otherwise.
         */
        calculateImpact() {
            if (S.mockMode) {
                _calculateImpactMock();
                return;
            }

            try {
                const state = global.Quannex.getState();
                const currentCoherence = state.globalCoherence || 0;
                const delta = Math.round((currentCoherence - S.baselineCoherence) * 100);
                const deltaStr = delta >= 0 ? `+${delta}` : `${delta}`;

                // Global coherence
                _setImpactValue('global',
                    `${Math.round(S.baselineCoherence * 100)}% \u2192 ${Math.round(currentCoherence * 100)}% (${deltaStr}%)`,
                    delta >= 0 ? 'positive' : 'negative'
                );

                // Being/Doing balance from spectral
                const spectral = this.getSpectralAnalysis();
                if (spectral?.diagnostics?.beingActionBalance) {
                    const bab = spectral.diagnostics.beingActionBalance;
                    const score = bab.score || 1.0;
                    const status = score > 1.2 ? 'Over-Inhaling' : score < 0.8 ? 'Over-Exhaling' : 'Balanced';
                    _setImpactValue('balance',
                        `${score.toFixed(2)} (${status})`,
                        status === 'Balanced' ? 'positive' : 'negative'
                    );
                } else {
                    _calculateBalanceFallback();
                }

                // Shadow detection
                const shadows = this.getShadowAnalysis();
                if (shadows?.patterns?.length > 0) {
                    const active = shadows.patterns.filter(p => p.detected || p.severity === 'significant');
                    if (active.length > 0) {
                        _setImpactValue('shadow',
                            `\u26A0\uFE0F ${active[0].name || 'Shadow Detected'}`,
                            'negative'
                        );
                    } else {
                        _setImpactValue('shadow', '\u2705 No Active Shadows', 'positive');
                    }
                } else {
                    _calculateShadowFallback(currentCoherence);
                }

            } catch (error) {
                Logger.error('SimEngine', 'Error calculating impact:', error);
                _calculateImpactMock();
            }
        },

        /**
         * Get breath analysis from engine.
         * @returns {Object|null}
         */
        getBreathAnalysis() {
            if (S.mockMode || !global.Quannex?.getBreathAnalysis) return null;
            try {
                return global.Quannex.getBreathAnalysis();
            } catch (e) {
                return null;
            }
        },

        /**
         * Get shadow analysis from engine.
         * @returns {Object|null}
         */
        getShadowAnalysis() {
            if (S.mockMode || !global.Quannex?.getShadowAnalysis) return null;
            try {
                return global.Quannex.getShadowAnalysis();
            } catch (e) {
                return null;
            }
        },

        /**
         * Get spectral analysis from engine.
         * @returns {Object|null}
         */
        getSpectralAnalysis() {
            if (S.mockMode || !global.Quannex?.getSpectralAnalysis) return null;
            try {
                return global.Quannex.getSpectralAnalysis();
            } catch (e) {
                return null;
            }
        }
    };

    // ========================================
    // PRIVATE: MOCK CALCULATIONS
    // ========================================

    function _calculateImpactMock() {
        const avg = S.sliderValues.reduce((sum, v) => sum + v, 0) / 12;
        const mockCoherence = avg / 100;
        const baselinePercent = Math.round(S.baselineCoherence * 100);
        const currentPercent = Math.round(mockCoherence * 100);
        const delta = currentPercent - baselinePercent;
        const deltaStr = delta >= 0 ? `+${delta}` : `${delta}`;

        _setImpactValue('global',
            `${baselinePercent}% \u2192 ${currentPercent}% (${deltaStr}%)`,
            delta >= 0 ? 'positive' : 'negative'
        );

        _calculateBalanceFallback();
        _calculateShadowFallback(mockCoherence);
    }

    function _calculateBalanceFallback() {
        // Being = Human(F3) + Regen(F9), Doing = Operations(F8) + Financial(F1)
        const being = (S.sliderValues[2] + S.sliderValues[8]) / 200;
        const doing = (S.sliderValues[7] + S.sliderValues[0]) / 200;
        const balance = being > 0 ? doing / being : 0;
        const status = (balance > 0.8 && balance < 1.2) ? 'Balanced' : 'Needs Work';

        _setImpactValue('balance',
            `${balance.toFixed(2)} (${status})`,
            status === 'Balanced' ? 'positive' : 'negative'
        );
    }

    function _calculateShadowFallback(coherence) {
        // Simple heuristic: high operations + low human = burnout risk
        if (S.sliderValues[7] > 80 && S.sliderValues[2] < 50) {
            _setImpactValue('shadow', '\u26A0\uFE0F Burnout Engine Risk', 'negative');
        } else if (coherence > 0.7) {
            _setImpactValue('shadow', '\u2705 System Coherent', 'positive');
        } else {
            _setImpactValue('shadow', '\u25EF Minor Imbalances', 'neutral');
        }
    }

    // ========================================
    // PRIVATE: DOM HELPERS
    // ========================================

    function _setImpactValue(metric, text, className) {
        const el = document.getElementById(`sim-impact-${metric}`);
        if (el) {
            el.textContent = text;
            el.className = `sim-impact-value ${className}`;
        }
    }

    function _updateStatus(text, className) {
        if (S.statusElements.engine) {
            S.statusElements.engine.textContent = text;
            S.statusElements.engine.className = `sim-status-value ${className}`;
        }
    }

    function _updateCompanyDisplay(companyId) {
        const name = S.COMPANY_NAMES[companyId] || companyId;
        if (S.statusElements.company) {
            S.statusElements.company.textContent = name;
        }

        // Update subtitle
        const subtitle = document.querySelector('.sim-subtitle');
        if (subtitle) {
            subtitle.textContent = `Interactive What-If Analysis \u2022 ${name}`;
        }
    }

    function _updateBaseline(coherence) {
        if (S.statusElements.baseline) {
            S.statusElements.baseline.textContent = Math.round(coherence * 100) + '%';
        }
    }

    // ========================================
    // EXPORTS
    // ========================================

    global.SimEngine = SimEngine;

    Logger.info('SimEngine', 'Module loaded - Engine integration ready');

})(typeof window !== 'undefined' ? window : this);
