/**
 * ========================================
 * MODULE: sim-scenarios.js
 * ========================================
 *
 * Created for: Coherence Simulator modularization
 * Date: February 2026
 *
 * PURPOSE:
 * Save, load, compare, and export simulator scenarios.
 * Each scenario captures all 12 slider values plus coherence score.
 * Stored in localStorage per company.
 *
 * DEPENDENCIES:
 * - sim-state.js (SimState, SimStateHelpers)
 * - sim-controls.js (SimControls.updateSlider)
 *
 * EXPORTS (to window/global):
 * - SimScenarios: { init, save, load, remove, compare, exportJSON, getAll }
 *
 * NOTES FOR FUTURE CLAUDE:
 * ========================================
 * Storage key: `quannex-sim-scenarios-{companyId}`
 *
 * Scenario format:
 * {
 *   name: "My Scenario",
 *   companyId: "nova-tech",
 *   timestamp: 1707350400000,
 *   sliderValues: [50, 60, ...12 values],
 *   coherence: 0.73
 * }
 *
 * localStorage can fill up. The save() method catches QuotaExceededError
 * and shows a user-friendly message.
 *
 * Scenarios from other companies or with fewer/more than 12 values
 * are handled gracefully with padding or truncation.
 * ========================================
 */
(function (global) {
    'use strict';

    const S = global.SimState;

    let _container = null;
    let _rowContainer = null;

    const SimScenarios = {

        /**
         * Build the scenarios panel.
         * @param {HTMLElement} container - The scenarios area container
         */
        init(container) {
            if (!container) return;

            _container = container;

            // Toolbar
            const toolbar = document.createElement('div');
            toolbar.className = 'sim-scenarios-toolbar';

            const title = document.createElement('div');
            title.className = 'sim-section-title';
            title.textContent = 'SAVED SCENARIOS';
            title.style.marginBottom = '0';

            const actions = document.createElement('div');
            actions.className = 'sim-scenarios-actions';

            const saveBtn = document.createElement('button');
            saveBtn.className = 'sim-btn sim-btn--primary';
            saveBtn.textContent = '\uD83D\uDCBE Save Current';
            saveBtn.addEventListener('click', () => this._promptSave());

            const exportBtn = document.createElement('button');
            exportBtn.className = 'sim-btn';
            exportBtn.textContent = '\uD83D\uDCCB Export JSON';
            exportBtn.addEventListener('click', () => this.exportJSON());

            actions.appendChild(saveBtn);
            actions.appendChild(exportBtn);

            toolbar.appendChild(title);
            toolbar.appendChild(actions);
            container.appendChild(toolbar);

            // Scenario cards row
            _rowContainer = document.createElement('div');
            _rowContainer.className = 'sim-scenarios-row';
            _rowContainer.id = 'sim-scenarios-row';
            container.appendChild(_rowContainer);

            // Load existing scenarios
            this._loadFromStorage();
            this._render();

            Logger.info('SimScenarios', `Loaded ${S.savedScenarios.length} scenarios`);
        },

        /**
         * Save current state as a named scenario.
         * @param {string} name
         * @returns {boolean} true if saved successfully
         */
        save(name) {
            const scenario = {
                name: name || `Scenario ${S.savedScenarios.length + 1}`,
                companyId: S.currentCompanyId,
                timestamp: Date.now(),
                sliderValues: [...S.sliderValues],
                coherence: _getCurrentCoherence()
            };

            S.savedScenarios.push(scenario);

            if (!this._saveToStorage()) {
                // Storage failed - remove the scenario we just added
                S.savedScenarios.pop();
                return false;
            }

            this._render();
            Logger.info('SimScenarios', `Saved scenario: ${scenario.name}`);
            return true;
        },

        /**
         * Load a scenario by index.
         * @param {number} index
         */
        load(index) {
            const scenario = S.savedScenarios[index];
            if (!scenario) return;

            // Restore slider values (pad/truncate to 12)
            const values = scenario.sliderValues || [];
            for (let i = 0; i < 12; i++) {
                const val = (i < values.length) ? values[i] : 50;
                global.SimControls.updateSlider(i + 1, val);
            }

            // Trigger engine update
            if (global.SimEngine?.pushToEngine) {
                global.SimEngine.pushToEngine();
            }

            Logger.info('SimScenarios', `Loaded scenario: ${scenario.name}`);
        },

        /**
         * Remove a scenario by index.
         * @param {number} index
         */
        remove(index) {
            if (index < 0 || index >= S.savedScenarios.length) return;
            const removed = S.savedScenarios.splice(index, 1);
            this._saveToStorage();
            this._render();
            Logger.info('SimScenarios', `Removed scenario: ${removed[0]?.name}`);
        },

        /**
         * Export all scenarios as JSON to clipboard.
         * @returns {string} The JSON string (also copied to clipboard)
         */
        async exportJSON() {
            const data = {
                exported: new Date().toISOString(),
                companyId: S.currentCompanyId,
                scenarios: S.savedScenarios
            };

            const json = JSON.stringify(data, null, 2);

            try {
                await navigator.clipboard.writeText(json);
                Logger.info('SimScenarios', 'Scenarios copied to clipboard');
                // Brief visual feedback
                const btn = _container?.querySelector('.sim-btn:last-child');
                if (btn) {
                    const orig = btn.textContent;
                    btn.textContent = '\u2705 Copied!';
                    setTimeout(() => { btn.textContent = orig; }, 1500);
                }
            } catch (e) {
                Logger.warn('SimScenarios', 'Clipboard write failed:', e);
            }

            return json;
        },

        /**
         * Get all saved scenarios.
         * @returns {Array}
         */
        getAll() {
            return [...S.savedScenarios];
        },

        // ========================================
        // PRIVATE METHODS
        // ========================================

        _promptSave() {
            const name = prompt('Scenario name:', `Scenario ${S.savedScenarios.length + 1}`);
            if (name !== null && name.trim()) {
                this.save(name.trim());
            }
        },

        _loadFromStorage() {
            try {
                const key = `quannex-sim-scenarios-${S.currentCompanyId || 'quannex'}`;
                const stored = localStorage.getItem(key);
                if (stored) {
                    S.savedScenarios = JSON.parse(stored);
                    // Validate
                    if (!Array.isArray(S.savedScenarios)) {
                        S.savedScenarios = [];
                    }
                } else {
                    S.savedScenarios = [];
                }
            } catch (e) {
                Logger.warn('SimScenarios', 'Failed to load from localStorage:', e);
                S.savedScenarios = [];
            }
        },

        _saveToStorage() {
            try {
                const key = `quannex-sim-scenarios-${S.currentCompanyId || 'quannex'}`;
                localStorage.setItem(key, JSON.stringify(S.savedScenarios));
                return true;
            } catch (e) {
                if (e.name === 'QuotaExceededError') {
                    Logger.error('SimScenarios', 'Storage full - delete an old scenario first');
                    alert('Storage is full. Please delete an old scenario before saving a new one.');
                } else {
                    Logger.warn('SimScenarios', 'Failed to save to localStorage:', e);
                }
                return false;
            }
        },

        _render() {
            if (!_rowContainer) return;

            if (S.savedScenarios.length === 0) {
                _rowContainer.innerHTML = '<div class="sim-scenarios-empty">No saved scenarios yet. Click "Save Current" to capture your first scenario.</div>';
                return;
            }

            _rowContainer.innerHTML = '';

            S.savedScenarios.forEach((scenario, index) => {
                const card = document.createElement('div');
                card.className = 'sim-scenario-card';
                card.setAttribute('data-index', index);

                // Name
                const name = document.createElement('div');
                name.className = 'sim-scenario-name';
                name.textContent = scenario.name;

                // Date
                const date = document.createElement('div');
                date.className = 'sim-scenario-date';
                date.textContent = new Date(scenario.timestamp).toLocaleDateString();

                // Coherence
                const coherence = document.createElement('div');
                coherence.className = 'sim-scenario-coherence';
                coherence.textContent = Math.round((scenario.coherence || 0) * 100) + '%';

                // Mini bar chart
                const bars = document.createElement('div');
                bars.className = 'sim-scenario-bars';
                (scenario.sliderValues || []).forEach((val, i) => {
                    const bar = document.createElement('div');
                    bar.className = 'sim-scenario-bar';
                    bar.style.height = Math.max(2, val * 0.2) + 'px';
                    bar.style.background = `var(--sim-face-${i + 1})`;
                    bars.appendChild(bar);
                });

                card.appendChild(name);
                card.appendChild(date);
                card.appendChild(coherence);
                card.appendChild(bars);

                // Click to load
                card.addEventListener('click', () => this.load(index));

                // Right-click to delete
                card.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    if (confirm(`Delete scenario "${scenario.name}"?`)) {
                        this.remove(index);
                    }
                });

                _rowContainer.appendChild(card);
            });
        }
    };

    function _getCurrentCoherence() {
        if (!S.mockMode && global.Quannex?.getState) {
            try {
                return global.Quannex.getState().globalCoherence || 0;
            } catch (e) {
                return S.baselineCoherence;
            }
        }
        return S.sliderValues.reduce((sum, v) => sum + v, 0) / 1200;
    }

    global.SimScenarios = SimScenarios;

    Logger.info('SimScenarios', 'Module loaded - Scenario save/compare ready');

})(typeof window !== 'undefined' ? window : this);
