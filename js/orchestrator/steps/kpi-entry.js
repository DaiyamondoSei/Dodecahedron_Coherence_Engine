/**
 * ========================================
 * MODULE: kpi-entry.js
 * ========================================
 *
 * STEP 2 - KPI ENTRY & MODE SELECTION
 *
 * Handles the KPI entry interface, mode selection (Quick/Full),
 * and KPI form generation with suggestions and autofill.
 *
 * Extracted from: orchestrator-steps.js (lines 846-1346)
 * Date: December 18, 2025
 *
 * ========================================
 * NOTES FOR FUTURE CLAUDE
 * ========================================
 *
 * 1. TWO KPI MODES:
 *    A) Quick Mode (12 KPIs):
 *       - One primary KPI per face
 *       - Uses Earth element by default
 *       - Faster setup for demos
 *
 *    B) Full Mode (60 KPIs):
 *       - Five elemental KPIs per face (Earth, Water, Fire, Air, Ether)
 *       - Complete pentagram analysis
 *       - Used for deep organizational analysis
 *
 * 2. HTML GENERATION:
 *    generateQuickModeHTML() and generateFullModeHTML() create the
 *    KPI entry forms dynamically. They include:
 *    - datalist suggestions from KPILibrary
 *    - Pre-filled values from template data (kpiByFaceId lookup)
 *    - Inline event handlers for autofill and normalization
 *
 * 3. INLINE EVENT HANDLERS (CRITICAL):
 *    The generated HTML contains onclick/onchange handlers that call:
 *    - autofillKPISuggestion(this, faceId) → from kpi-autofill.js
 *    - autofillElementalKPI(this, faceId, element) → from kpi-autofill.js
 *    - calculateLiveNormalization(faceId) → from kpi-autofill.js
 *
 *    IMPORTANT: kpi-autofill.js MUST load BEFORE kpi-entry.js!
 *
 * 4. DATA FLOW ON completeStep2():
 *    collectKPIData() [from calculation-engine.js] → demoState.kpiData →
 *    ContextSynthesizer (for custom flow) → markStepCompleted(2) →
 *    goToStep(3) → runCalculation()
 *
 * 5. CONTEXT SYNTHESIZER:
 *    For custom (non-template) flows, completeStep2() calls
 *    ContextSynthesizer.synthesizeCustomContext() to generate
 *    edges and vertices for 3D visualization.
 *
 * 6. AUTO-FILL NOTIFICATION:
 *    When AI story mode extracts KPIs, showAutoFillNotification()
 *    displays a banner indicating how many KPIs were pre-filled.
 *
 * 7. KPI LIBRARY INTEGRATION:
 *    - window.KPILibrary.getKPISuggestions(faceName, element)
 *    - window.KPILibrary.getUnitTypes()
 *    - window.KPILibrary.getElementalWisdom(element)
 *
 * ========================================
 * DEPENDENCIES
 * ========================================
 * - js/orchestrator/orchestrator-state.js (demoState)
 * - js/orchestrator/orchestrator-navigation.js (goToStep)
 * - js/orchestrator/steps/face-configuration.js (markStepCompleted)
 * - js/orchestrator/steps/kpi-autofill.js (autofillKPISuggestion, calculateLiveNormalization, etc.)
 * - js/orchestrator/steps/calculation-engine.js (collectKPIData, runCalculation)
 * - js/kpi-library.js (KPILibrary) [optional]
 * - js/context-synthesizer.js (ContextSynthesizer) [optional]
 *
 * ========================================
 * EXPORTS (to window/global)
 * ========================================
 * - selectMode(mode)
 * - completeStep2()
 *
 * ========================================
 */
(function (global) {
    'use strict';

    // ========================================
    // MODE SELECTION
    // ========================================

    /**
     * Select KPI entry mode (Quick or Full).
     *
     * Quick Mode: 12 KPIs (1 per face)
     * Full Mode: 60 KPIs (5 elements × 12 faces)
     *
     * @param {string} mode - 'quick' or 'full'
     */
    function selectMode(mode) {
        const demoState = global.demoState;

        demoState.kpiMode = mode;

        // Update UI
        document.getElementById('modeQuick').classList.remove('btn-primary');
        document.getElementById('modeFull').classList.remove('btn-primary');
        document.getElementById('modeQuick').classList.add('btn-secondary');
        document.getElementById('modeFull').classList.add('btn-secondary');

        if (mode === 'quick') {
            document.getElementById('modeQuick').classList.remove('btn-secondary');
            document.getElementById('modeQuick').classList.add('btn-primary');
        } else {
            document.getElementById('modeFull').classList.remove('btn-secondary');
            document.getElementById('modeFull').classList.add('btn-primary');
        }

        // Sprint 2: Sync mode to MappingContext if available
        if (window.Sprint2 && window.Sprint2.mappingContext) {
            try {
                window.Sprint2.mappingContext.setMode(mode);
                Logger.info('OrchestratorSteps', '✅ Synced mode to MappingContext:', mode);
            } catch (err) {
                Logger.warn('OrchestratorSteps', '⚠️ Mode sync failed:', err.message);
            }
        }

        // Load KPI mapper
        loadKPIMapper(mode);

        // Enable next button
        document.getElementById('step2NextBtn').disabled = false;

        Logger.info('OrchestratorSteps', `✅ KPI mode selected: ${mode}`);
    }

    // ========================================
    // KPI MAPPER LOADING
    // ========================================

    /**
     * Load KPI mapper interface based on mode.
     *
     * @param {string} mode - 'quick' or 'full'
     */
    function loadKPIMapper(mode) {
        const section = document.getElementById('kpiMapperSection');
        section.style.display = 'block';

        if (mode === 'quick') {
            section.innerHTML = generateQuickModeHTML();
        } else {
            section.innerHTML = generateFullModeHTML();
        }

        // Sprint 2: Auto-fill with extracted KPIs from AI story analysis
        if (typeof global.autoFillExtractedKPIs === 'function') {
            global.autoFillExtractedKPIs();
        }

        // Session 2 Enhancement: Calculate normalization preview for all faces
        // This shows live health indicators for pre-filled template data
        setTimeout(() => {
            if (typeof global.calculateAllNormalizations === 'function') {
                global.calculateAllNormalizations();
            }
        }, 100);
    }

    // ========================================
    // KPI AUTO-FILL HELPERS
    // ========================================

    /**
     * Helper to set a KPI field value.
     *
     * @param {number} faceId - Face ID (1-12)
     * @param {string} kpiName - KPI name to set
     * @param {number|string} value - Value to set
     */
    function setKPIFieldValue(faceId, kpiName, value) {
        const nameInput = document.querySelector(`input[data-face-id="${faceId}"][data-field="kpiName"]`);
        const valueInput = document.querySelector(`input[data-face-id="${faceId}"][data-field="value"]`);

        if (nameInput && !nameInput.value) {
            nameInput.value = kpiName;
            nameInput.style.borderColor = 'rgba(0, 255, 204, 0.5)';
        }

        if (valueInput && !valueInput.value && value) {
            const numValue = typeof value === 'number' ? value : parseFloat(value);
            if (!isNaN(numValue)) {
                valueInput.value = numValue;
                valueInput.style.borderColor = 'rgba(0, 255, 204, 0.5)';
            }
        }
    }

    /**
     * Show notification that KPIs were auto-filled.
     *
     * @param {number} count - Number of KPIs auto-filled
     */
    function showAutoFillNotification(count) {
        const section = document.getElementById('kpiMapperSection');
        if (!section || count === 0) return;

        // Add notification banner at the top
        const existing = document.getElementById('autoFillNotification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.id = 'autoFillNotification';
        notification.innerHTML = `
            <div style="background: rgba(0, 255, 204, 0.15); border: 1px solid rgba(0, 255, 204, 0.4);
                        border-radius: 8px; padding: 12px 16px; margin-bottom: 20px;
                        display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 24px;">🤖</span>
                <div>
                    <div style="font-weight: 600; color: #00ffcc; font-size: 14px;">
                        AI Pre-filled ${count} KPIs from your story
                    </div>
                    <div style="font-size: 12px; color: rgba(255,255,255,0.6);">
                        Highlighted fields contain extracted data. Review and adjust as needed.
                    </div>
                </div>
            </div>
        `;
        section.insertBefore(notification, section.firstChild);
    }

    // ========================================
    // HTML GENERATION - QUICK MODE
    // ========================================

    /**
     * Generate Quick Mode HTML (12 KPIs).
     *
     * Creates one KPI input row per face with:
     * - KPI name with datalist suggestions
     * - Current value input
     * - Unit selector
     * - Target min/ideal inputs
     * - Direction selector
     * - Live normalization preview
     *
     * @returns {string} HTML string
     */
    function generateQuickModeHTML() {
        const demoState = global.demoState;

        // Defensive check: ensure face configuration exists
        if (!demoState.faceConfig || !demoState.faceConfig.faces) {
            Logger.error('OrchestratorSteps', '[KPIMapper] No face configuration available');
            return '<p style="color: #ff6b6b; text-align: center; padding: 40px;">Please complete Step 1 (Define Faces) first.</p>';
        }

        const units = window.KPILibrary ? window.KPILibrary.getUnitTypes() : [];

        // Create KPI lookup by faceId for pre-filling template data
        const kpiByFaceId = {};
        if (demoState.kpiData && demoState.kpiData.length > 0) {
            demoState.kpiData.forEach(kpi => {
                kpiByFaceId[kpi.faceId] = kpi;
            });
            Logger.info('OrchestratorSteps', '[KPIMapper] Pre-filling with template KPIs:', Object.keys(kpiByFaceId).length);
        }

        let html = '<div style="margin: 30px 0;">';
        html += '<h3 style="font-size: 16px; margin-bottom: 20px; color: rgba(255, 255, 255, 0.8);">Quick Mode: 1 KPI per Face</h3>';
        html += '<div style="display: grid; gap: 20px;">';

        demoState.faceConfig.faces.forEach(face => {
            // Get pre-loaded KPI data for this face (from template)
            const preFilledKPI = kpiByFaceId[face.id];

            // Get KPI suggestions for this face (Earth element by default for quick mode)
            const suggestions = window.KPILibrary ? window.KPILibrary.getKPISuggestions(face.name, 'Earth') : [];
            const datalistId = `kpi-suggestions-${face.id}`;

            html += `
                <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 20px;">
                    <div style="font-size: 14px; font-weight: 600; margin-bottom: 15px; color: #00ffcc;">
                        Face ${face.id}: ${face.name}
                    </div>

                    <!-- Main KPI input row -->
                    <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 12px; margin-bottom: 12px;">
                        <div>
                            <label style="font-size: 11px; color: rgba(255, 255, 255, 0.6); display: block; margin-bottom: 5px;">
                                KPI Name
                            </label>
                            <input
                                type="text"
                                class="face-input"
                                list="${datalistId}"
                                placeholder="Start typing..."
                                data-face-id="${face.id}"
                                data-field="kpiName"
                                value="${preFilledKPI?.name || ''}"
                                onchange="autofillKPISuggestion(this, ${face.id})"
                                oninput="this.setAttribute('data-current-value', this.value)"
                            />
                            <datalist id="${datalistId}">
                                ${suggestions.map(s => `<option value="${s.name}" data-unit="${s.unit}" data-min="${s.targetMin}" data-ideal="${s.targetIdeal}">${s.description}</option>`).join('')}
                            </datalist>
                        </div>
                        <div>
                            <label style="font-size: 11px; color: rgba(255, 255, 255, 0.6); display: block; margin-bottom: 5px;">
                                Current Value
                            </label>
                            <input
                                type="number"
                                class="face-input"
                                placeholder="0"
                                data-face-id="${face.id}"
                                data-field="value"
                                value="${preFilledKPI?.value !== undefined ? preFilledKPI.value : ''}"
                                step="any"
                                oninput="calculateLiveNormalization(${face.id})"
                            />
                        </div>
                        <div>
                            <label style="font-size: 11px; color: rgba(255, 255, 255, 0.6); display: block; margin-bottom: 5px;">
                                Unit
                            </label>
                            <select
                                class="face-input"
                                data-face-id="${face.id}"
                                data-field="unit"
                                style="cursor: pointer; font-size: 12px;"
                            >
                                ${units.map(u => `<option value="${u.value}" ${preFilledKPI?.unit === u.value ? 'selected' : ''}>${u.symbol || u.label}</option>`).join('')}
                            </select>
                        </div>
                    </div>

                    <!-- Target ranges row -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px;">
                        <div>
                            <label style="font-size: 11px; color: rgba(255, 255, 255, 0.6); display: block; margin-bottom: 5px;">
                                Target Min
                            </label>
                            <input
                                type="number"
                                class="face-input"
                                placeholder="0"
                                data-face-id="${face.id}"
                                data-field="targetMin"
                                value="${preFilledKPI?.targetMin !== undefined ? preFilledKPI.targetMin : ''}"
                                step="any"
                                oninput="calculateLiveNormalization(${face.id})"
                            />
                        </div>
                        <div>
                            <label style="font-size: 11px; color: rgba(255, 255, 255, 0.6); display: block; margin-bottom: 5px;">
                                Target Ideal
                            </label>
                            <input
                                type="number"
                                class="face-input"
                                placeholder="100"
                                data-face-id="${face.id}"
                                data-field="targetIdeal"
                                value="${preFilledKPI?.targetIdeal !== undefined ? preFilledKPI.targetIdeal : ''}"
                                step="any"
                                oninput="calculateLiveNormalization(${face.id})"
                            />
                        </div>
                        <div>
                            <label style="font-size: 11px; color: rgba(255, 255, 255, 0.6); display: block; margin-bottom: 5px;">
                                Direction
                            </label>
                            <select
                                class="face-input"
                                data-face-id="${face.id}"
                                data-field="direction"
                                style="cursor: pointer; font-size: 12px;"
                                onchange="calculateLiveNormalization(${face.id})"
                            >
                                <option value="↑" ${preFilledKPI?.direction === '↑' || !preFilledKPI ? 'selected' : ''}>↑ Higher</option>
                                <option value="↓" ${preFilledKPI?.direction === '↓' ? 'selected' : ''}>↓ Lower</option>
                                <option value="Band" ${preFilledKPI?.direction === 'Band' ? 'selected' : ''}>⊟ Sweet spot</option>
                            </select>
                        </div>
                    </div>

                    <!-- Live normalization preview -->
                    <div id="normalization-preview-${face.id}" style="margin-top: 12px; padding: 8px; background: rgba(0, 0, 0, 0.2); border-radius: 6px; font-size: 11px; color: rgba(255, 255, 255, 0.7); display: none;">
                        <span style="color: rgba(0, 255, 204, 0.8);">→ Normalized:</span>
                        <span id="norm-value-${face.id}" style="font-weight: 600; color: #00ffcc;">--</span>
                        <span style="opacity: 0.6;">(This value goes to calculation)</span>
                    </div>
                </div>
            `;
        });

        html += '</div></div>';
        return html;
    }

    // ========================================
    // HTML GENERATION - FULL MODE
    // ========================================

    /**
     * Generate Full Mode HTML (60 KPIs).
     *
     * Creates five elemental KPI inputs per face:
     * - Earth (Foundation/Structure)
     * - Water (Flow/Adaptability)
     * - Fire (Energy/Action)
     * - Air (Communication/Connection)
     * - Ether (Purpose/Vision)
     *
     * @returns {string} HTML string
     */
    function generateFullModeHTML() {
        const demoState = global.demoState;
        const elements = ['Earth', 'Water', 'Fire', 'Air', 'Ether'];
        const units = window.KPILibrary ? window.KPILibrary.getUnitTypes() : [];

        let html = '<div style="margin: 30px 0;">';
        html += '<h3 style="font-size: 16px; margin-bottom: 20px; color: rgba(255, 255, 255, 0.8);">Full Mode: 5 Elemental KPIs per Face</h3>';

        demoState.faceConfig.faces.forEach(face => {
            html += `
                <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                    <div style="font-size: 16px; font-weight: 600; margin-bottom: 20px; color: #00ffcc;">
                        Face ${face.id}: ${face.name}
                    </div>
            `;

            elements.forEach(element => {
                // Get elemental wisdom
                const wisdom = window.KPILibrary ? window.KPILibrary.getElementalWisdom(element) : { icon: '✨', subtitle: element, description: '' };

                // Get KPI suggestions for this element
                const suggestions = window.KPILibrary ? window.KPILibrary.getKPISuggestions(face.name, element) : [];
                const datalistId = `kpi-suggestions-${face.id}-${element}`;

                html += `
                    <div style="background: rgba(0, 0, 0, 0.2); border-radius: 6px; padding: 15px; margin-bottom: 15px; position: relative;">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
                            <span style="font-size: 12px; font-weight: 600; color: rgba(255, 255, 255, 0.9);">
                                ${wisdom.icon} ${element}
                            </span>
                            <span style="font-size: 10px; color: rgba(255, 255, 255, 0.6);">
                                (${wisdom.subtitle})
                            </span>
                            <span class="elemental-tooltip" style="cursor: help; font-size: 11px; color: rgba(0, 255, 204, 0.7);" title="${wisdom.description}">ℹ️</span>
                        </div>
                        <div style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr; gap: 10px;">
                            <input
                                type="text"
                                class="face-input"
                                list="${datalistId}"
                                placeholder="KPI name"
                                data-face-id="${face.id}"
                                data-element="${element}"
                                data-field="kpiName"
                                style="font-size: 12px;"
                                onchange="autofillElementalKPI(this, ${face.id}, '${element}')"
                            />
                            <datalist id="${datalistId}">
                                ${suggestions.map(s => `<option value="${s.name}" data-unit="${s.unit}" data-min="${s.targetMin}" data-ideal="${s.targetIdeal}">${s.description}</option>`).join('')}
                            </datalist>

                            <input
                                type="number"
                                class="face-input"
                                placeholder="Value"
                                data-face-id="${face.id}"
                                data-element="${element}"
                                data-field="value"
                                style="font-size: 12px;"
                                step="any"
                            />

                            <select
                                class="face-input"
                                data-face-id="${face.id}"
                                data-element="${element}"
                                data-field="unit"
                                style="cursor: pointer; font-size: 11px;"
                            >
                                ${units.map(u => `<option value="${u.value}">${u.symbol || u.label.substring(0, 8)}</option>`).join('')}
                            </select>

                            <input
                                type="number"
                                class="face-input"
                                placeholder="Min"
                                data-face-id="${face.id}"
                                data-element="${element}"
                                data-field="targetMin"
                                style="font-size: 12px;"
                                step="any"
                            />

                            <input
                                type="number"
                                class="face-input"
                                placeholder="Ideal"
                                data-face-id="${face.id}"
                                data-element="${element}"
                                data-field="targetIdeal"
                                style="font-size: 12px;"
                                step="any"
                            />
                        </div>
                    </div>
                `;
            });

            html += '</div>';
        });

        html += '</div>';
        return html;
    }

    // ========================================
    // STEP COMPLETION
    // ========================================

    /**
     * Complete Step 2: KPI Mapping.
     *
     * Collects KPI data from form, synthesizes context for custom flows,
     * and navigates to Step 3 (Calculate).
     */
    function completeStep2() {
        const demoState = global.demoState;
        const goToStep = global.goToStep;
        const collectKPIData = global.collectKPIData;
        const runCalculation = global.runCalculation;
        const markStepCompleted = global.markStepCompleted;

        // Collect KPI data from form
        demoState.kpiData = collectKPIData();

        // Validate
        if (!demoState.kpiData || demoState.kpiData.length === 0) {
            alert('Please enter at least one KPI');
            return;
        }

        // NEW: Generate edges/vertices for custom flow using Context Synthesizer
        // This ensures the 3D visualization has complete data for non-template flows
        if (!demoState.loadedMappingContext && demoState.faceConfig) {
            Logger.info('OrchestratorSteps', '🔮 Custom flow detected - synthesizing edges and vertices...');

            // Check if Context Synthesizer is available
            if (window.ContextSynthesizer && typeof window.ContextSynthesizer.synthesizeCustomContext === 'function') {
                try {
                    const synthesizedContext = window.ContextSynthesizer.synthesizeCustomContext(
                        demoState.faceConfig,
                        demoState.kpiData
                    );

                    if (synthesizedContext) {
                        demoState.loadedMappingContext = synthesizedContext;
                        Logger.info('OrchestratorSteps', '✅ Context Synthesizer generated:',
                            synthesizedContext.edges?.length || 0, 'edges,',
                            synthesizedContext.vertices?.length || 0, 'vertices');
                    }
                } catch (error) {
                    Logger.error('OrchestratorSteps', '⚠️ Context Synthesizer failed:', error);
                    // Continue anyway - visualization will work without edges
                }
            } else {
                Logger.warn('OrchestratorSteps', '⚠️ Context Synthesizer not loaded - 3D view may lack edge data');
            }
        }

        // Mark completed
        markStepCompleted(2);

        Logger.info('OrchestratorSteps', '✅ Step 2 completed:', demoState.kpiData);

        // Go to calculation
        goToStep(3);

        // Auto-run calculation
        runCalculation();
    }

    // ========================================
    // EXPORTS
    // ========================================

    global.selectMode = selectMode;
    global.completeStep2 = completeStep2;

    // Internal helpers exposed for AI story mode integration
    global.setKPIFieldValue = setKPIFieldValue;
    global.showAutoFillNotification = showAutoFillNotification;

    Logger.debug('OrchestratorSteps', '[kpi-entry] Module loaded');

})(typeof window !== 'undefined' ? window : this);
