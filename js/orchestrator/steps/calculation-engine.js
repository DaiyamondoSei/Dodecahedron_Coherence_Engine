/**
 * ========================================
 * MODULE: calculation-engine.js
 * ========================================
 *
 * STEP 3 - KPI COLLECTION & COHERENCE CALCULATION
 *
 * Handles collecting KPI data from forms, running coherence calculations
 * through the Quannex engine, and processing results.
 *
 * Extracted from: orchestrator-steps.js (lines 1507-1854)
 * Date: December 18, 2025
 *
 * ========================================
 * NOTES FOR FUTURE CLAUDE
 * ========================================
 *
 * 1. DATA FLOW:
 *    collectKPIData() → runCalculation() → displayCalculationResults()
 *
 *    A) collectKPIData():
 *       Reads DOM inputs by data-face-id/data-field attributes
 *       Returns array of KPI objects with normalized structure
 *
 *    B) runCalculation():
 *       1. DataTransformer.validate() - checks data integrity
 *       2. DataTransformer.transform() - converts UI → Engine format
 *       3. Quannex.initWithCompany() - runs calculation engine
 *       4. DataTransformer.transformResults() - converts Engine → UI format
 *       5. ShadowDetector.analyze() - detects organizational shadows
 *       6. displayCalculationResults() - shows results to user
 *
 *    C) calculateSimpleCoherence():
 *       Fallback calculation when Quannex engine is not loaded.
 *       Uses same normalization formulas as kpi-autofill.js.
 *
 * 2. KPI COLLECTION MODES:
 *    Quick Mode: Collects 12 KPIs (1 per face)
 *    - Uses data-face-id attribute only
 *
 *    Full Mode: Collects 60 KPIs (5 per face)
 *    - Uses data-face-id + data-element attributes
 *    - Elements: Earth, Water, Fire, Air, Ether
 *
 * 3. NORMALIZATION FORMULAS:
 *    Direction '↑' (Higher is better):
 *      normalized = (value - targetMin) / (targetIdeal - targetMin)
 *
 *    Direction '↓' (Lower is better):
 *      normalized = (targetMin - value) / (targetMin - targetIdeal)
 *
 *    Direction 'Band' (Sweet spot):
 *      midpoint = (targetMin + targetIdeal) / 2
 *      range = |targetIdeal - targetMin| / 2
 *      normalized = max(0, 1 - (|value - midpoint| / range))
 *
 * 4. COHERENCE STATUS THRESHOLDS:
 *    ≥90%: Radiant
 *    ≥80%: Excellent
 *    ≥70%: Healthy
 *    ≥60%: Moderate
 *    ≥50%: Fair
 *    ≥40%: Concerning
 *    ≥30%: Critical
 *    <30%: Crisis
 *
 * 5. SHADOW DETECTION:
 *    Only runs for custom data (not template data which has pre-defined shadows).
 *    Uses ShadowDetector class to identify organizational blind spots.
 *
 * 6. ERROR HANDLING:
 *    - If DataTransformer fails validation, throws descriptive error
 *    - If Quannex engine not loaded, falls back to calculateSimpleCoherence()
 *    - If ShadowDetector fails, logs warning and continues
 *
 * ========================================
 * DEPENDENCIES
 * ========================================
 * - js/orchestrator/orchestrator-state.js (demoState)
 * - js/orchestrator/orchestrator-navigation.js (showLoading, hideLoading)
 * - js/orchestrator/steps/results-display.js (displayCalculationResults)
 * - js/data-transformer.js (DataTransformer) [optional]
 * - js/main.js (quannexEngine) [optional]
 * - js/shadow-detector.js (ShadowDetector) [optional]
 *
 * ========================================
 * EXPORTS (to window/global)
 * ========================================
 * - collectKPIData()
 * - runCalculation()
 * - getCoherenceStatus(coherence)
 *
 * ========================================
 */
(function (global) {
    'use strict';

    // ========================================
    // KPI DATA COLLECTION
    // ========================================

    /**
     * Collect KPI data from form.
     *
     * Reads all inputs with data-face-id/data-field attributes and
     * builds structured KPI objects. Supports both Quick Mode (12 KPIs)
     * and Full Mode (60 KPIs).
     *
     * @returns {Array<Object>} Array of KPI objects with:
     *   - faceId: Face number (1-12)
     *   - faceName: Face display name
     *   - id: Unique KPI ID (e.g., "F1_K1")
     *   - name: KPI name from input
     *   - value: Numeric value (defaults to 0)
     *   - unit: Unit string
     *   - direction: '↑' | '↓' | 'Band'
     *   - targetMin: Minimum target value
     *   - targetIdeal: Ideal target value
     *   - element: 'Earth' | 'Water' | 'Fire' | 'Air' | 'Ether'
     */
    function collectKPIData() {
        const demoState = global.demoState;
        const kpis = [];

        Logger.info('OrchestratorSteps', '📊 Collecting KPI data...');
        Logger.debug('OrchestratorSteps', '   Mode:', demoState.kpiMode);
        Logger.debug('OrchestratorSteps', '   Faces:', demoState.faceConfig.faces.length);

        if (demoState.kpiMode === 'quick') {
            // Collect 12 KPIs (one per face)
            demoState.faceConfig.faces.forEach(face => {
                const inputs = document.querySelectorAll(`[data-face-id="${face.id}"]`);
                const kpiData = {};

                inputs.forEach(input => {
                    const field = input.getAttribute('data-field');
                    // Check both value and data-current-value (in case of datalist issues)
                    const currentValue = input.getAttribute('data-current-value') || input.value;
                    kpiData[field] = field === 'kpiName' ? currentValue.trim() : input.value;

                    // Debug: Show what we're capturing
                    if (field === 'kpiName') {
                        Logger.debug('OrchestratorSteps', `      🔍 Input value: "${input.value}", data-current-value: "${input.getAttribute('data-current-value')}"`);
                    }
                });

                Logger.debug('OrchestratorSteps', `   Face ${face.id} (${face.name}):`, kpiData);

                // Only require kpiName - value defaults to 0 if empty
                if (kpiData.kpiName && kpiData.kpiName.length > 0) {
                    const kpiEntry = {
                        faceId: face.id,
                        faceName: face.name,
                        id: `F${face.id}_K1`,
                        name: kpiData.kpiName,
                        value: parseFloat(kpiData.value) || 0,
                        unit: kpiData.unit || 'number',
                        direction: kpiData.direction || '↑',
                        targetMin: parseFloat(kpiData.targetMin) || 0,
                        targetIdeal: parseFloat(kpiData.targetIdeal) || 100,
                        element: 'Earth' // Default for quick mode
                    };
                    kpis.push(kpiEntry);
                    Logger.info('OrchestratorSteps', `      ✅ Added KPI:`, kpiEntry);
                } else {
                    Logger.warn('OrchestratorSteps', `      ⚠️ Skipped (no KPI name entered for this face)`);
                }
            });
        } else {
            // Collect 60 KPIs (5 per face)
            const elements = ['Earth', 'Water', 'Fire', 'Air', 'Ether'];

            demoState.faceConfig.faces.forEach(face => {
                elements.forEach((element, eIndex) => {
                    const inputs = document.querySelectorAll(`[data-face-id="${face.id}"][data-element="${element}"]`);
                    const kpiData = {};

                    inputs.forEach(input => {
                        const field = input.getAttribute('data-field');
                        kpiData[field] = input.value;
                    });

                    // Only require kpiName - value defaults to 0 if empty
                    if (kpiData.kpiName) {
                        const kpiEntry = {
                            faceId: face.id,
                            faceName: face.name,
                            id: `F${face.id}_K${eIndex + 1}`,
                            name: kpiData.kpiName,
                            value: parseFloat(kpiData.value) || 0,
                            unit: kpiData.unit || 'number',
                            direction: '↑',
                            targetMin: parseFloat(kpiData.targetMin) || 0,
                            targetIdeal: parseFloat(kpiData.targetIdeal) || 100,
                            element: element
                        };
                        kpis.push(kpiEntry);
                        Logger.info('OrchestratorSteps', `      ✅ Added ${element} KPI:`, kpiEntry);
                    }
                });
            });
        }

        Logger.info('OrchestratorSteps', `📊 Total KPIs collected: ${kpis.length}`);

        // Validation feedback: warn if no KPIs collected
        if (kpis.length === 0) {
            Logger.warn('OrchestratorSteps', '[collectKPIData] No KPIs collected - check if form was rendered');
            alert('Please enter at least one KPI with a name before proceeding.');
        }

        return kpis;
    }

    // ========================================
    // COHERENCE CALCULATION
    // ========================================

    /**
     * Run coherence calculation.
     *
     * Orchestrates the full calculation pipeline:
     * 1. Validate data with DataTransformer
     * 2. Transform UI data to Engine format
     * 3. Run Quannex engine (or fallback)
     * 4. Transform results back to UI format
     * 5. Run shadow detection for custom data
     * 6. Display results
     *
     * @async
     */
    async function runCalculation() {
        const demoState = global.demoState;
        const showLoading = global.showLoading;
        const hideLoading = global.hideLoading;
        const displayCalculationResults = global.displayCalculationResults;

        showLoading('Calculating coherence...');

        // Simulate calculation delay for UX
        await new Promise(resolve => setTimeout(resolve, 1500));

        try {
            Logger.info('OrchestratorSteps', '🔬 Running calculation...');

            // ========================================
            // 🔄 TRANSFORMATION LAYER
            // ========================================
            let companyData;

            if (typeof window.DataTransformer !== 'undefined') {
                Logger.info('OrchestratorSteps', '   🔄 Using Data Transformation Layer');

                // Prepare data for transformation
                const demoData = {
                    faceConfig: demoState.faceConfig,
                    kpiMode: demoState.kpiMode,
                    kpiData: demoState.kpiData
                };

                // Validate before transforming
                const validation = window.DataTransformer.validate(demoData);
                Logger.debug('OrchestratorSteps', '   📋 Validation:', validation);

                if (!validation.valid) {
                    throw new Error(`Data validation failed: ${validation.errors.join(', ')}`);
                }

                if (validation.warnings.length > 0) {
                    Logger.warn('OrchestratorSteps', '   ⚠️ Warnings:', validation.warnings);
                }

                // Transform to engine format
                companyData = window.DataTransformer.transform(demoData);
                Logger.info('OrchestratorSteps', '   ✅ Data transformed successfully');
            } else {
                Logger.warn('OrchestratorSteps', '   ⚠️ DataTransformer not loaded - using raw format');

                // Fallback: Use raw format (may cause issues)
                companyData = {
                    name: demoState.faceConfig.templateName,
                    kpis: demoState.kpiData
                };
            }

            Logger.debug('OrchestratorSteps', '   Company name:', companyData.name);
            Logger.debug('OrchestratorSteps', '   KPIs count:', companyData.kpis.length);
            Logger.debug('OrchestratorSteps', '   Sample KPI:', companyData.kpis[0]);

            // ========================================
            // 🧮 CALCULATION ENGINE
            // ========================================
            if (typeof window.quannexEngine !== 'undefined') {
                Logger.info('OrchestratorSteps', '   ✅ Using Quannex Engine');

                // Use real engine
                await window.quannexEngine.initializeWithCompany(companyData);
                const engineState = window.quannexEngine.getState();

                Logger.info('OrchestratorSteps', '   ✅ Engine calculation complete');

                // Transform results back to UI format
                if (typeof window.DataTransformer !== 'undefined') {
                    demoState.coherenceResults = window.DataTransformer.transformResults(engineState);
                } else {
                    demoState.coherenceResults = engineState;
                }

                Logger.info('OrchestratorSteps', '   ✅ Results ready for display:', demoState.coherenceResults);
            } else {
                Logger.warn('OrchestratorSteps', '   ⚠️ Quannex Engine not loaded - using fallback calculation');

                // Fallback: Simple calculation (works with UI format)
                demoState.coherenceResults = calculateSimpleCoherence(demoState.kpiData);

                Logger.info('OrchestratorSteps', '   ✅ Fallback calculation completed:', demoState.coherenceResults);
            }

            // ========================================
            // 👁️ SHADOW DETECTION (for custom path)
            // ========================================
            if (!demoState.loadedMappingContext?.shadowPatterns?.length) {
                if (typeof window.ShadowDetector !== 'undefined' && demoState.coherenceResults?.faces) {
                    Logger.info('OrchestratorSteps', '   👁️ Running shadow detection for custom data...');
                    try {
                        const detector = new window.ShadowDetector();

                        // Prepare faces with energy values for ShadowDetector
                        const facesForDetector = demoState.coherenceResults.faces.map(face => ({
                            id: face.id,
                            name: face.name || face.customName || `Face ${face.id}`,
                            faceEnergy: face.energy || face.faceEnergy || 0
                        }));

                        // Run shadow analysis
                        const shadowAnalysis = detector.analyze(facesForDetector, demoState.kpiData);

                        if (shadowAnalysis.detectedPatterns?.length > 0) {
                            demoState.shadowPatterns = shadowAnalysis.detectedPatterns;
                            Logger.info('OrchestratorSteps', `   ✅ Detected ${shadowAnalysis.detectedPatterns.length} shadow patterns:`,
                                shadowAnalysis.detectedPatterns.map(p => p.name));
                        } else {
                            Logger.info('OrchestratorSteps', '   ℹ️ No shadow patterns detected in custom data');
                            demoState.shadowPatterns = [];
                        }
                    } catch (e) {
                        Logger.warn('OrchestratorSteps', '   ⚠️ Shadow detection failed:', e);
                        demoState.shadowPatterns = [];
                    }
                } else {
                    Logger.debug('OrchestratorSteps', '   ℹ️ ShadowDetector not available or no face data');
                    demoState.shadowPatterns = [];
                }
            } else {
                Logger.info('OrchestratorSteps', '   ✅ Using template shadow patterns');
            }

            // Display results
            displayCalculationResults();

            hideLoading();
        } catch (error) {
            Logger.error('OrchestratorSteps', '❌ Calculation failed:', error);
            Logger.debug('OrchestratorSteps', '   Error details:', error.message);
            Logger.debug('OrchestratorSteps', '   Stack:', error.stack);
            hideLoading();
            alert(`Calculation failed: ${error.message}\n\nPlease check console for details.`);
        }
    }

    // ========================================
    // FALLBACK CALCULATION
    // ========================================

    /**
     * Simple coherence calculation (fallback).
     *
     * Used when Quannex engine is not loaded. Calculates face energies
     * by averaging normalized KPI scores, then global coherence by
     * averaging face energies.
     *
     * @param {Array<Object>} kpis - Array of KPI objects
     * @returns {Object} Coherence results with:
     *   - globalCoherence: Number (0-1)
     *   - coherenceStatus: String label
     *   - faces: Array of face objects with energy values
     */
    function calculateSimpleCoherence(kpis) {
        Logger.info('OrchestratorSteps', '🧮 Starting simple coherence calculation...');
        Logger.debug('OrchestratorSteps', '   Input KPIs:', kpis.length);

        const faceEnergies = {};

        // Group KPIs by face
        kpis.forEach(kpi => {
            if (!faceEnergies[kpi.faceId]) {
                faceEnergies[kpi.faceId] = {
                    id: kpi.faceId,
                    name: kpi.faceName,
                    kpis: [],
                    energy: 0
                };
            }

            // Normalize KPI based on direction
            let normalized = 0;

            if (kpi.direction === '↑') {
                // Higher is better
                normalized = (kpi.value - kpi.targetMin) / (kpi.targetIdeal - kpi.targetMin);
            } else if (kpi.direction === '↓') {
                // Lower is better
                normalized = (kpi.targetMin - kpi.value) / (kpi.targetMin - kpi.targetIdeal);
            } else if (kpi.direction === 'Band') {
                // Sweet spot (band target)
                const midpoint = (kpi.targetMin + kpi.targetIdeal) / 2;
                const range = Math.abs(kpi.targetIdeal - kpi.targetMin) / 2;
                const distance = Math.abs(kpi.value - midpoint);
                normalized = Math.max(0, 1 - (distance / range));
            }

            const score = Math.max(0, Math.min(1, normalized));

            Logger.debug('OrchestratorSteps', `   KPI: ${kpi.name} = ${kpi.value} → ${(score * 100).toFixed(1)}%`);

            faceEnergies[kpi.faceId].kpis.push({
                ...kpi,
                normalizedScore: score
            });
        });

        // Calculate face energies
        Object.values(faceEnergies).forEach(face => {
            if (face.kpis.length > 0) {
                const avgScore = face.kpis.reduce((sum, kpi) => sum + kpi.normalizedScore, 0) / face.kpis.length;
                face.energy = avgScore;
                Logger.debug('OrchestratorSteps', `   Face ${face.id} (${face.name}): ${face.kpis.length} KPIs → ${(face.energy * 100).toFixed(1)}%`);
            } else {
                face.energy = 0;
                Logger.debug('OrchestratorSteps', `   Face ${face.id} (${face.name}): No KPIs → 0%`);
            }
        });

        // Calculate global coherence
        const faces = Object.values(faceEnergies);
        const globalCoherence = faces.length > 0
            ? faces.reduce((sum, face) => sum + face.energy, 0) / faces.length
            : 0;

        Logger.info('OrchestratorSteps', `🧮 Calculation complete:`);
        Logger.info('OrchestratorSteps', `   Global Coherence: ${(globalCoherence * 100).toFixed(1)}%`);
        Logger.info('OrchestratorSteps', `   Status: ${getCoherenceStatus(globalCoherence)}`);

        return {
            globalCoherence: globalCoherence,
            coherenceStatus: getCoherenceStatus(globalCoherence),
            faces: faces
        };
    }

    // ========================================
    // COHERENCE STATUS
    // ========================================

    /**
     * Get coherence status label.
     *
     * Maps numeric coherence value to descriptive label based on
     * octave-inspired thresholds.
     *
     * @param {number} coherence - Coherence value (0-1)
     * @returns {string} Status label
     */
    function getCoherenceStatus(coherence) {
        if (coherence >= 0.9) return 'Radiant';
        if (coherence >= 0.8) return 'Excellent';
        if (coherence >= 0.7) return 'Healthy';
        if (coherence >= 0.6) return 'Moderate';
        if (coherence >= 0.5) return 'Fair';
        if (coherence >= 0.4) return 'Concerning';
        if (coherence >= 0.3) return 'Critical';
        return 'Crisis';
    }

    // ========================================
    // EXPORTS
    // ========================================

    global.collectKPIData = collectKPIData;
    global.runCalculation = runCalculation;
    global.getCoherenceStatus = getCoherenceStatus;

    Logger.debug('OrchestratorSteps', '[calculation-engine] Module loaded');

})(typeof window !== 'undefined' ? window : this);
