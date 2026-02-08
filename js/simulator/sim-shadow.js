/**
 * ========================================
 * MODULE: sim-shadow.js
 * ========================================
 *
 * Created for: Coherence Simulator modularization
 * Date: February 2026
 *
 * PURPOSE:
 * Displays detected shadow patterns from the Quannex engine.
 * Shows pattern names, severity indicators, and affected faces.
 * Falls back to heuristic detection when engine unavailable.
 *
 * DEPENDENCIES:
 * - sim-state.js (SimState)
 * - sim-engine.js (SimEngine.getShadowAnalysis)
 *
 * EXPORTS (to window/global):
 * - SimShadow: { init, update }
 *
 * NOTES FOR FUTURE CLAUDE:
 * ========================================
 * WHAT ARE SHADOW PATTERNS?
 * Shadow patterns are organizational dysfunction archetypes that emerge
 * when breath axis pairs fall into extreme imbalance. They map directly
 * to the 6 breath axes defined in kpi-constants.js (AXIS_OPPOSITIONS).
 *
 * TWO DATA SOURCES:
 * 1. Engine mode: Quannex.getShadowAnalysis() returns full analysis
 *    with pattern names, severity, and affected face indices.
 * 2. Mock/fallback mode: _renderHeuristicShadows() uses 4 hardcoded
 *    heuristic checks based on slider value thresholds.
 *
 * THE 4 HEURISTIC SHADOW PATTERNS (thesis-relevant):
 * ┌──────────────────────┬──────────────────┬────────────────────┬──────────┐
 * │ Pattern Name         │ High Face (>80%) │ Low Face (<40/50%) │ Severity │
 * ├──────────────────────┼──────────────────┼────────────────────┼──────────┤
 * │ Burnout Engine       │ F8 Operations[7] │ F3 Human[2] <50%   │ signif.  │
 * │ Innovation Theater   │ F2 Intellect[1]  │ F4 Structure[3]    │ moderate │
 * │ Values Drift         │ F5 Market[4]     │ F10 Values[9]      │ moderate │
 * │ Fortress Mentality   │ F12 Risk[11]     │ F6 Community[5]    │ moderate │
 * └──────────────────────┴──────────────────┴────────────────────┴──────────┘
 * Numbers in brackets are 0-based array indices (faceId - 1).
 *
 * WHY THESE THRESHOLDS?
 * - >80% threshold: Represents dominant over-investment in one pole
 * - <40% threshold (or <50% for Burnout): Represents neglect of the
 *   opposing pole. Burnout uses 50% because human capital depletion
 *   is more dangerous at moderate levels than other imbalances.
 * - These are heuristic approximations. The real engine uses phi-weighted
 *   spectral analysis for more nuanced detection.
 *
 * WHY ONLY 4 PATTERNS?
 * These correspond to the 4 most empirically documented organizational
 * dysfunction archetypes. The remaining 2 breath axes (Resource Flow
 * F1↔F11, Connection & Protection F6↔F12 partial) have less clear-cut
 * shadow signatures and are better captured by the engine's full analysis.
 *
 * SEVERITY LEVELS:
 * - significant: Active organizational harm (red dot, pulsing glow)
 * - moderate: Risk emerging, intervention recommended (amber dot)
 * - minor: Low-level concern (gray dot, used in engine mode only)
 *
 * RENDERING:
 * The panel shows either a list of detected shadows or a positive
 * "all clear" message. Each shadow item shows severity (dot color),
 * name, and which faces are affected. Hover tooltip shows the hint.
 * ========================================
 */
(function (global) {
    'use strict';

    const S = global.SimState;

    let _contentContainer = null;

    const SimShadow = {

        /**
         * Build the shadow detection panel.
         * @param {HTMLElement} container - The shadow panel container
         */
        init(container) {
            if (!container) return;

            const title = document.createElement('div');
            title.className = 'sim-impact-title';
            title.textContent = '\uD83D\uDC41\uFE0F Shadow Pattern Detection';
            container.appendChild(title);

            _contentContainer = document.createElement('div');
            _contentContainer.id = 'sim-shadow-content';
            container.appendChild(_contentContainer);

            // Show initial state
            _showClear();

            Logger.info('SimShadow', 'Shadow panel built');
        },

        /**
         * Update shadow display with current analysis.
         */
        update() {
            if (!_contentContainer) return;

            const engineShadows = global.SimEngine?.getShadowAnalysis?.();

            if (engineShadows?.patterns?.length > 0) {
                _renderEngineShadows(engineShadows.patterns);
            } else {
                // Fallback: heuristic shadow detection
                _renderHeuristicShadows();
            }
        }
    };

    // ========================================
    // PRIVATE: RENDERING
    // ========================================

    function _renderEngineShadows(patterns) {
        const active = patterns.filter(p => p.detected || p.severity === 'significant' || p.severity === 'moderate');

        if (active.length === 0) {
            _showClear();
            return;
        }

        _contentContainer.innerHTML = '';

        active.forEach(pattern => {
            const item = document.createElement('div');
            item.className = 'sim-shadow-item';

            const severity = document.createElement('span');
            severity.className = `sim-shadow-severity ${pattern.severity || 'minor'}`;

            const name = document.createElement('span');
            name.className = 'sim-shadow-name';
            name.textContent = pattern.name || 'Unknown Shadow';

            const faces = document.createElement('span');
            faces.className = 'sim-shadow-faces';
            if (pattern.affectedFaces) {
                faces.textContent = pattern.affectedFaces.map(f => `F${f}`).join(', ');
            }

            item.appendChild(severity);
            item.appendChild(name);
            item.appendChild(faces);
            _contentContainer.appendChild(item);
        });
    }

    function _renderHeuristicShadows() {
        const detected = [];

        // Burnout Engine: Operations (F8/idx7) > 80% && Human (F3/idx2) < 50%
        if (S.sliderValues[7] > 80 && S.sliderValues[2] < 50) {
            detected.push({
                name: 'Burnout Engine',
                severity: 'significant',
                faces: [3, 8],
                hint: 'Increase Human Capital or reduce Operations'
            });
        }

        // Innovation Theater: Intellectual (F2/idx1) > 80% && Structural (F4/idx3) < 40%
        if (S.sliderValues[1] > 80 && S.sliderValues[3] < 40) {
            detected.push({
                name: 'Innovation Theater',
                severity: 'moderate',
                faces: [2, 4],
                hint: 'Build structural capacity to support intellectual output'
            });
        }

        // Values Drift: Market (F5/idx4) > 80% && Values (F10/idx9) < 40%
        if (S.sliderValues[4] > 80 && S.sliderValues[9] < 40) {
            detected.push({
                name: 'Values Drift',
                severity: 'moderate',
                faces: [5, 10],
                hint: 'Strengthen foundational values to anchor market strategy'
            });
        }

        // Fortress Mentality: Risk (F12/idx11) > 80% && Community (F6/idx5) < 40%
        if (S.sliderValues[11] > 80 && S.sliderValues[5] < 40) {
            detected.push({
                name: 'Fortress Mentality',
                severity: 'moderate',
                faces: [6, 12],
                hint: 'Open to partnerships while maintaining protection'
            });
        }

        if (detected.length === 0) {
            _showClear();
            return;
        }

        _contentContainer.innerHTML = '';
        detected.forEach(shadow => {
            const item = document.createElement('div');
            item.className = 'sim-shadow-item';

            const severity = document.createElement('span');
            severity.className = `sim-shadow-severity ${shadow.severity}`;

            const name = document.createElement('span');
            name.className = 'sim-shadow-name';
            name.textContent = shadow.name;
            name.title = shadow.hint;

            const faces = document.createElement('span');
            faces.className = 'sim-shadow-faces';
            faces.textContent = shadow.faces.map(f => `F${f}`).join(', ');

            item.appendChild(severity);
            item.appendChild(name);
            item.appendChild(faces);
            _contentContainer.appendChild(item);
        });
    }

    function _showClear() {
        if (!_contentContainer) return;
        _contentContainer.innerHTML = '<div class="sim-shadow-clear">\u2705 No Shadow Patterns Detected</div>';
    }

    global.SimShadow = SimShadow;

    Logger.info('SimShadow', 'Module loaded - Shadow detection ready');

})(typeof window !== 'undefined' ? window : this);
