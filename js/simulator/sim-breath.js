/**
 * ========================================
 * MODULE: sim-breath.js
 * ========================================
 *
 * Created for: Coherence Simulator modularization
 * Date: February 2026
 *
 * PURPOSE:
 * Displays the 6 breath axes as horizontal balance bars.
 * Each bar shows the ratio between its two opposing faces,
 * color-coded for balance status (green/amber/red).
 *
 * DEPENDENCIES:
 * - sim-state.js (SimState, SimStateHelpers)
 * - sim-engine.js (SimEngine.getBreathAnalysis)
 *
 * EXPORTS (to window/global):
 * - SimBreath: { init, update }
 *
 * NOTES FOR FUTURE CLAUDE:
 * ========================================
 * TWO DATA SOURCES:
 * 1. Real engine: Quannex.getBreathAnalysis() returns axis-level data
 *    with faceAEnergy and faceBEnergy per axis.
 * 2. Fallback: Calculates ratio directly from SimState.sliderValues
 *    using SimStateHelpers.sliderToEnergy() for 0-100 -> 0.0-1.0.
 *
 * BALANCE THRESHOLDS (phi-derived from phi-harmonics.js):
 * - Balanced:   0.8 <= ratio <= 1.2 (green checkmark)
 * - Imbalanced: 0.6 <= ratio < 0.8 or 1.2 < ratio <= 1.5 (amber tilde)
 * - Critical:   ratio < 0.6 or ratio > 1.5 (red exclamation)
 * The 0.8/1.2 range approximates 1/PHI to PHI (0.618... to 1.618...)
 * rounded to simpler thresholds for readability.
 *
 * DIVISION BY ZERO PROTECTION:
 * ratio = energyA / energyB is guarded by (energyB > 0) check.
 * When energyB = 0, ratio falls through to 0, showing critical status.
 * This is correct behavior: if one face has zero energy, the axis
 * is maximally imbalanced.
 *
 * BAR VISUALIZATION:
 * Each bar has a center line at 50% representing equilibrium.
 * Face A fills leftward from center, Face B fills rightward.
 * Width = energy * 50% (so full energy = half the bar).
 * Both at 50% energy = both bars touching the center = balanced.
 *
 * SHORT NAME MAP:
 * _shortName() truncates domain names for compact display in the
 * narrow breath panel (e.g., "Intellectual Capital" -> "Intellect").
 * Full names are available in the title tooltip on hover.
 * ========================================
 */
(function (global) {
    'use strict';

    const S = global.SimState;

    const SimBreath = {

        /**
         * Build the breath axis panel in the DOM.
         * @param {HTMLElement} container - The breath panel container
         */
        init(container) {
            if (!container) return;

            const title = document.createElement('div');
            title.className = 'sim-impact-title';
            title.textContent = '\u2194\uFE0F Breath Axis Balance';
            container.appendChild(title);

            S.BREATH_AXES.forEach(axis => {
                const row = _buildAxisBar(axis);
                container.appendChild(row);
            });

            Logger.info('SimBreath', `Built ${S.BREATH_AXES.length} breath axis bars`);
        },

        /**
         * Update all breath axis bars with current data.
         */
        update() {
            const engineData = global.SimEngine?.getBreathAnalysis?.();

            S.BREATH_AXES.forEach(axis => {
                let ratioA, ratioB;

                if (engineData?.axes) {
                    // Try to find this axis in engine data
                    const axisData = engineData.axes.find(a => a.id === axis.id);
                    if (axisData) {
                        ratioA = axisData.faceAEnergy || 0.5;
                        ratioB = axisData.faceBEnergy || 0.5;
                    }
                }

                // Fallback: use slider values directly
                if (ratioA === undefined) {
                    ratioA = SimStateHelpers.sliderToEnergy(S.sliderValues[axis.faceA - 1]);
                    ratioB = SimStateHelpers.sliderToEnergy(S.sliderValues[axis.faceB - 1]);
                }

                _updateAxisBar(axis.id, ratioA, ratioB);
            });
        }
    };

    // ========================================
    // PRIVATE: DOM BUILDERS
    // ========================================

    function _buildAxisBar(axis) {
        const row = document.createElement('div');
        row.className = 'sim-breath-axis';
        row.id = `sim-breath-${axis.id}`;

        // Left face label
        const labelA = document.createElement('span');
        labelA.className = 'sim-breath-face-label';
        labelA.textContent = _shortName(axis.domainA);
        labelA.title = axis.domainA;

        // Bar container
        const barContainer = document.createElement('div');
        barContainer.className = 'sim-breath-bar-container';

        const fillA = document.createElement('div');
        fillA.className = 'sim-breath-bar-fill left';
        fillA.id = `sim-breath-fill-a-${axis.id}`;
        fillA.style.width = '25%';
        fillA.style.background = `var(--sim-face-${axis.faceA})`;

        const fillB = document.createElement('div');
        fillB.className = 'sim-breath-bar-fill right';
        fillB.id = `sim-breath-fill-b-${axis.id}`;
        fillB.style.width = '25%';
        fillB.style.background = `var(--sim-face-${axis.faceB})`;

        const center = document.createElement('div');
        center.className = 'sim-breath-bar-center';

        barContainer.appendChild(fillA);
        barContainer.appendChild(fillB);
        barContainer.appendChild(center);

        // Right face label
        const labelB = document.createElement('span');
        labelB.className = 'sim-breath-face-label';
        labelB.textContent = _shortName(axis.domainB);
        labelB.title = axis.domainB;

        // Status indicator
        const status = document.createElement('span');
        status.className = 'sim-breath-status balanced';
        status.id = `sim-breath-status-${axis.id}`;
        status.textContent = '\u2713';

        row.appendChild(labelA);
        row.appendChild(barContainer);
        row.appendChild(labelB);
        row.appendChild(status);

        return row;
    }

    function _updateAxisBar(axisId, energyA, energyB) {
        const fillA = document.getElementById(`sim-breath-fill-a-${axisId}`);
        const fillB = document.getElementById(`sim-breath-fill-b-${axisId}`);
        const statusEl = document.getElementById(`sim-breath-status-${axisId}`);

        if (!fillA || !fillB || !statusEl) return;

        // Width as percentage of half the bar (max 50%)
        fillA.style.width = Math.round(energyA * 50) + '%';
        fillB.style.width = Math.round(energyB * 50) + '%';

        // Calculate balance ratio
        const ratio = energyB > 0 ? energyA / energyB : 0;

        if (ratio >= 0.8 && ratio <= 1.2) {
            statusEl.textContent = '\u2713';
            statusEl.className = 'sim-breath-status balanced';
        } else if (ratio >= 0.6 && ratio <= 1.5) {
            statusEl.textContent = '\u223C';
            statusEl.className = 'sim-breath-status imbalanced';
        } else {
            statusEl.textContent = '!';
            statusEl.className = 'sim-breath-status critical';
        }
    }

    function _shortName(domain) {
        // Shorten domain names for compact display
        const map = {
            'Financial Capital': 'Financial',
            'Intellectual Capital': 'Intellect',
            'Human Capital': 'Human',
            'Structural Capital': 'Structure',
            'Market Resonance': 'Market',
            'Community & Partners': 'Community',
            'Brand & Reputation': 'Brand',
            'Core Operations': 'Operations',
            'Regenerative Flow': 'Regen',
            'Foundational Values': 'Values',
            'Funding Pipeline': 'Funding',
            'Risk & Resilience': 'Risk'
        };
        return map[domain] || domain;
    }

    global.SimBreath = SimBreath;

    Logger.info('SimBreath', 'Module loaded - Breath axis visualization ready');

})(typeof window !== 'undefined' ? window : this);
