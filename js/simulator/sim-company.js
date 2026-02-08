/**
 * ========================================
 * MODULE: sim-company.js
 * ========================================
 *
 * Created for: Coherence Simulator modularization
 * Date: February 2026
 *
 * PURPOSE:
 * Company selector dropdown and company switching logic.
 * Reads available companies from SimState.COMPANY_NAMES,
 * handles sessionStorage for cross-window persistence,
 * and triggers full re-initialization on company change.
 *
 * DEPENDENCIES:
 * - sim-state.js (SimState)
 *
 * EXPORTS (to window/global):
 * - SimCompany: { init, getCurrentCompanyId, switchCompany }
 *
 * NOTES FOR FUTURE CLAUDE:
 * ========================================
 * COMPANY SWITCH IS A FULL RE-INIT:
 * The company selector is a <select> dropdown in the status bar.
 * On change, it calls the onCompanyChange callback (wired by sim-main.js)
 * which triggers the FULL re-initialization cascade:
 *   1. SimEngine.initWithCompany(newId) - loads new company data
 *   2. SimControls.initFromEngine() - updates slider baselines
 *   3. SimBreath.update() + SimShadow.update() - refresh panels
 *   4. SimSync.broadcast() - notify 3D view
 *   5. SimScenarios reload from new localStorage key
 * This is ASYNC because engine init involves fetching company JSON.
 *
 * SESSIONSTORAGE:
 * Key: 'selectedCompanyId' (shared with dodecahedron-3d.html and others).
 * May be blocked in private browsing - falls back to S.currentCompanyId.
 * The try/catch around sessionStorage.getItem() handles this gracefully.
 *
 * AVAILABLE COMPANIES (from S.COMPANY_NAMES):
 * - quannex, nova-tech, zenith-solutions, apex-industries
 * Select option values must match these exact IDs (hyphenated).
 *
 * POSTMESSAGE LISTENER:
 * Preserved for iframe embedding compatibility. The orchestrator page
 * can embed simulator in an iframe and send { type: 'LOAD_COMPANY',
 * companyId: 'nova-tech' } to trigger a company switch externally.
 * ========================================
 */
(function (global) {
    'use strict';

    const S = global.SimState;

    let _selectElement = null;
    let _onCompanyChangeCallback = null;

    const SimCompany = {

        /**
         * Set callback to invoke when company changes.
         * @param {Function} fn - Receives companyId string
         */
        setOnChange(fn) {
            _onCompanyChangeCallback = fn;
        },

        /**
         * Build company selector dropdown and wire events.
         * @param {HTMLElement} container - Element to insert selector into
         */
        init(container) {
            if (!container) return;

            // Create select element
            _selectElement = document.createElement('select');
            _selectElement.className = 'sim-company-select';
            _selectElement.setAttribute('aria-label', 'Select company to simulate');

            // Populate options
            Object.keys(S.COMPANY_NAMES).forEach(id => {
                const option = document.createElement('option');
                option.value = id;
                option.textContent = S.COMPANY_NAMES[id];
                _selectElement.appendChild(option);
            });

            // Set current value
            const currentId = this.getCurrentCompanyId();
            _selectElement.value = currentId;

            // Wire change event
            _selectElement.addEventListener('change', (e) => {
                this.switchCompany(e.target.value);
            });

            container.appendChild(_selectElement);

            // Wire postMessage listener for iframe embedding
            global.addEventListener('message', (event) => {
                const { type, companyId } = event.data || {};
                if (type === 'LOAD_COMPANY' && companyId && companyId !== S.currentCompanyId) {
                    Logger.info('SimCompany', `Company change via postMessage: ${companyId}`);
                    this.switchCompany(companyId);
                }
            });

            Logger.info('SimCompany', `Selector built with ${Object.keys(S.COMPANY_NAMES).length} companies, current: ${currentId}`);
        },

        /**
         * Get the currently selected company ID.
         * @returns {string}
         */
        getCurrentCompanyId() {
            try {
                return sessionStorage.getItem('selectedCompanyId') || 'quannex';
            } catch (e) {
                // sessionStorage may be blocked in private browsing
                return S.currentCompanyId || 'quannex';
            }
        },

        /**
         * Switch to a different company. Triggers full re-initialization.
         * @param {string} companyId
         */
        switchCompany(companyId) {
            if (companyId === S.currentCompanyId) return;

            Logger.info('SimCompany', `Switching company: ${S.currentCompanyId} -> ${companyId}`);

            // Persist selection
            try {
                sessionStorage.setItem('selectedCompanyId', companyId);
            } catch (e) {
                Logger.warn('SimCompany', 'Could not write to sessionStorage');
            }

            // Update dropdown
            if (_selectElement) {
                _selectElement.value = companyId;
            }

            // Notify callback (sim-main.js handles the rest)
            if (_onCompanyChangeCallback) {
                _onCompanyChangeCallback(companyId);
            }
        }
    };

    global.SimCompany = SimCompany;

    Logger.info('SimCompany', 'Module loaded - Company selector ready');

})(typeof window !== 'undefined' ? window : this);
