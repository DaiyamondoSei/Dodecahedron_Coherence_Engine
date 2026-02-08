/**
 * ========================================
 * MODULE: sim-controls.js
 * ========================================
 *
 * Created for: Coherence Simulator modularization
 * Date: February 2026
 *
 * PURPOSE:
 * Builds and manages the 12 face slider controls arranged in
 * 6 breath axis pairs. Handles slider input events, debouncing,
 * value display, and delta-from-baseline indicators.
 *
 * DEPENDENCIES:
 * - sim-state.js (SimState, SimStateHelpers)
 *
 * EXPORTS (to window/global):
 * - SimControls: { init, initFromEngine, resetAll, updateSlider, getValues }
 *
 * NOTES FOR FUTURE CLAUDE:
 * ========================================
 * LAYOUT PATTERN:
 * The slider layout is 6 rows of 2 (breath axis pairs).
 * Each row shows: [Face A slider] [Axis label] [Face B slider]
 * DOM order follows breath axis pairs, NOT sequential face IDs:
 * Row 1: F1, F11  Row 2: F2, F7  Row 3: F3, F8
 * Row 4: F4, F9   Row 5: F5, F10 Row 6: F6, F12
 *
 * SLIDER VALUES:
 * HTML range inputs with values 0-100 (UI percentage).
 * On change, they update SimState.sliderValues[arrayIndex] and call
 * the engine update callback (set by sim-engine.js via setOnChange).
 *
 * DEBOUNCE STRATEGY:
 * Slider 'input' events fire continuously during drag (~60fps).
 * The DOM value display updates IMMEDIATELY (no debounce) for snappy UX.
 * The engine recalculation is DEBOUNCED at S.DEBOUNCE_MS (100ms) to
 * prevent thrashing the Quannex engine with rapid slider movements.
 * This separation (instant DOM + debounced engine) is intentional.
 *
 * DELTA INDICATORS:
 * Each slider shows a delta value (+/-%) comparing current position to
 * the baseline captured at company load. This helps users see at a
 * glance how far they've deviated from the original state.
 * Delta uses faceId - 1 for arrayIndex conversion (1-based to 0-based).
 *
 * ANIMATION REFLOW TRICK (line ~283):
 * To re-trigger the CSS pulse animation on each value change:
 *   valueEl.classList.remove('sim-value-changed');
 *   void valueEl.offsetWidth;  // force browser reflow
 *   valueEl.classList.add('sim-value-changed');
 * Without the offsetWidth read, the browser optimizes away the remove+add
 * and the animation doesn't replay.
 *
 * DOM is built dynamically from SimState.FACE_DEFINITIONS and
 * SimState.BREATH_AXES (sourced from kpi-constants.js SSOT), so it
 * automatically adapts if face names or axis topology change.
 *
 * ACCESSIBILITY:
 * - Each slider has aria-label with face name (e.g., "Financial Capital energy level")
 * - aria-valuemin="0", aria-valuemax="100", aria-valuenow updated on input
 * - tabindex for keyboard navigation (inherited from range input)
 * ========================================
 */
(function (global) {
    'use strict';

    const S = global.SimState;

    // Private state
    let _debounceTimer = null;
    let _onChangeCallback = null;

    // ========================================
    // PUBLIC API
    // ========================================

    const SimControls = {

        /**
         * Set the callback to invoke when any slider changes.
         * Called by sim-engine.js to wire up engine updates.
         * @param {Function} fn - Callback receiving no arguments
         */
        setOnChange(fn) {
            _onChangeCallback = fn;
        },

        /**
         * Build all 12 slider cards in the DOM.
         * Requires SimState.FACE_DEFINITIONS and BREATH_AXES to be populated.
         * @param {HTMLElement} container - The .sim-controls-area element
         */
        init(container) {
            if (!container) {
                Logger.error('SimControls', 'No container element provided');
                return;
            }

            if (S.BREATH_AXES.length === 0) {
                Logger.error('SimControls', 'BREATH_AXES not populated - call SimStateHelpers.initFromConstants() first');
                return;
            }

            // Section title
            const title = document.createElement('div');
            title.className = 'sim-section-title';
            title.textContent = 'FACE ENERGY CONTROLS';
            container.appendChild(title);

            // Build 6 breath axis rows
            S.BREATH_AXES.forEach((axis, i) => {
                const row = _buildAxisRow(axis, i);
                container.appendChild(row);
            });

            // Reset button
            const resetBtn = document.createElement('button');
            resetBtn.className = 'sim-reset-btn';
            resetBtn.innerHTML = '\u21BA Reset to Baseline';
            resetBtn.setAttribute('aria-label', 'Reset all sliders to baseline values');
            resetBtn.addEventListener('click', () => this.resetAll());
            container.appendChild(resetBtn);

            Logger.info('SimControls', `Built ${S.BREATH_AXES.length} axis rows with ${Object.keys(S.sliders).length} sliders`);
        },

        /**
         * Initialize slider positions from engine state.
         * Called after engine loads company data.
         * @param {Object} engineState - From Quannex.getState()
         */
        initFromEngine(engineState) {
            const faces = engineState.faces || [];

            S.FACE_DEFINITIONS.forEach(def => {
                const face = faces[def.arrayIndex];
                const energy = face ? (face.faceEnergy ?? face.energy ?? 0.5) : 0.5;
                const sliderVal = SimStateHelpers.energyToSlider(energy);

                S.sliderValues[def.arrayIndex] = sliderVal;
                S.baselineValues[def.arrayIndex] = sliderVal;

                // Update DOM
                if (S.sliders[def.faceId]) {
                    S.sliders[def.faceId].value = sliderVal;
                    S.sliders[def.faceId].setAttribute('aria-valuenow', sliderVal);
                }
                if (S.valueDisplays[def.faceId]) {
                    S.valueDisplays[def.faceId].textContent = sliderVal + '%';
                }

                // Reset delta display
                _updateDelta(def.faceId);
            });

            Logger.info('SimControls', 'Sliders initialized from engine state');
        },

        /**
         * Reset all sliders to their baseline values.
         */
        resetAll() {
            SimStateHelpers.resetToBaseline();

            S.FACE_DEFINITIONS.forEach(def => {
                const val = S.sliderValues[def.arrayIndex];
                if (S.sliders[def.faceId]) {
                    S.sliders[def.faceId].value = val;
                    S.sliders[def.faceId].setAttribute('aria-valuenow', val);
                }
                if (S.valueDisplays[def.faceId]) {
                    S.valueDisplays[def.faceId].textContent = val + '%';
                }
                _updateDelta(def.faceId);
            });

            // Trigger engine update
            if (_onChangeCallback) _onChangeCallback();

            Logger.info('SimControls', 'All sliders reset to baseline');
        },

        /**
         * Programmatically update a single slider (e.g., from scenario load).
         * @param {number} faceId - 1-based face ID
         * @param {number} value - 0-100 slider value
         */
        updateSlider(faceId, value) {
            const clamped = Math.max(0, Math.min(100, Math.round(value)));
            const arrayIndex = faceId - 1;

            S.sliderValues[arrayIndex] = clamped;

            if (S.sliders[faceId]) {
                S.sliders[faceId].value = clamped;
                S.sliders[faceId].setAttribute('aria-valuenow', clamped);
            }
            if (S.valueDisplays[faceId]) {
                S.valueDisplays[faceId].textContent = clamped + '%';
            }
            _updateDelta(faceId);
        },

        /**
         * Get all current slider values.
         * @returns {number[]} Array of 12 values (0-100)
         */
        getValues() {
            return [...S.sliderValues];
        }
    };

    // ========================================
    // PRIVATE: DOM BUILDERS
    // ========================================

    /**
     * Build a single breath axis row with 2 face sliders.
     */
    function _buildAxisRow(axis, index) {
        const row = document.createElement('div');
        row.className = 'sim-axis-row';
        row.style.animationDelay = (index * 0.08) + 's';

        // Face A slider (left)
        const faceA = S.FACE_DEFINITIONS.find(d => d.faceId === axis.faceA);
        const cardA = _buildFaceCard(faceA, 'reception');

        // Axis label (center)
        const axisLabel = document.createElement('div');
        axisLabel.className = 'sim-axis-label';
        axisLabel.innerHTML = `
            <span class="sim-axis-icon">\u21C4</span>
            <span class="sim-axis-name">${axis.name}</span>
        `;
        axisLabel.title = axis.tension;

        // Face B slider (right)
        const faceB = S.FACE_DEFINITIONS.find(d => d.faceId === axis.faceB);
        const cardB = _buildFaceCard(faceB, 'projection');

        row.appendChild(cardA);
        row.appendChild(axisLabel);
        row.appendChild(cardB);

        return row;
    }

    /**
     * Build a single face slider card.
     */
    function _buildFaceCard(faceDef, role) {
        if (!faceDef) return document.createElement('div');

        const card = document.createElement('div');
        card.className = 'sim-face-card';
        card.setAttribute('data-face', faceDef.faceId);
        card.setAttribute('data-role', role);

        // Header row: name + value
        const header = document.createElement('div');
        header.className = 'sim-face-card-header';

        const nameEl = document.createElement('span');
        nameEl.className = 'sim-face-name';
        nameEl.innerHTML = `
            <span class="sim-face-index">F${faceDef.faceId}</span>
            ${faceDef.icon} ${faceDef.name}
        `;

        const valueWrapper = document.createElement('span');
        const valueEl = document.createElement('span');
        valueEl.className = 'sim-face-value';
        valueEl.id = `sim-value-${faceDef.faceId}`;
        valueEl.textContent = S.sliderValues[faceDef.arrayIndex] + '%';

        const deltaEl = document.createElement('span');
        deltaEl.className = 'sim-face-delta neutral';
        deltaEl.id = `sim-delta-${faceDef.faceId}`;
        deltaEl.textContent = '';

        valueWrapper.appendChild(valueEl);
        valueWrapper.appendChild(deltaEl);

        header.appendChild(nameEl);
        header.appendChild(valueWrapper);

        // Slider input
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.className = 'sim-slider';
        slider.id = `sim-slider-${faceDef.faceId}`;
        slider.min = '0';
        slider.max = '100';
        slider.value = S.sliderValues[faceDef.arrayIndex];
        slider.setAttribute('aria-label', `${faceDef.name} energy level`);
        slider.setAttribute('aria-valuemin', '0');
        slider.setAttribute('aria-valuemax', '100');
        slider.setAttribute('aria-valuenow', S.sliderValues[faceDef.arrayIndex]);

        // Wire event
        slider.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            S.sliderValues[faceDef.arrayIndex] = val;
            valueEl.textContent = val + '%';
            slider.setAttribute('aria-valuenow', val);

            // Pulse animation on value
            valueEl.classList.remove('sim-value-changed');
            void valueEl.offsetWidth; // force reflow
            valueEl.classList.add('sim-value-changed');

            _updateDelta(faceDef.faceId);

            // Debounced engine update
            clearTimeout(_debounceTimer);
            _debounceTimer = setTimeout(() => {
                if (_onChangeCallback) _onChangeCallback();
            }, S.DEBOUNCE_MS);
        });

        // Store DOM references in state
        S.sliders[faceDef.faceId] = slider;
        S.valueDisplays[faceDef.faceId] = valueEl;

        card.appendChild(header);
        card.appendChild(slider);

        return card;
    }

    /**
     * Update the delta indicator for a face slider.
     */
    function _updateDelta(faceId) {
        const deltaEl = document.getElementById(`sim-delta-${faceId}`);
        if (!deltaEl) return;

        const arrayIndex = faceId - 1;
        const current = S.sliderValues[arrayIndex];
        const baseline = S.baselineValues[arrayIndex];
        const delta = current - baseline;

        if (delta === 0) {
            deltaEl.textContent = '';
            deltaEl.className = 'sim-face-delta neutral';
        } else if (delta > 0) {
            deltaEl.textContent = ` +${delta}`;
            deltaEl.className = 'sim-face-delta positive';
        } else {
            deltaEl.textContent = ` ${delta}`;
            deltaEl.className = 'sim-face-delta negative';
        }
    }

    // ========================================
    // EXPORTS
    // ========================================

    global.SimControls = SimControls;

    Logger.info('SimControls', 'Module loaded - 12 face slider controls ready');

})(typeof window !== 'undefined' ? window : this);
