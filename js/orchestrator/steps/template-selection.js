/**
 * ========================================
 * MODULE: template-selection.js
 * ========================================
 *
 * STEP 0 - TEMPLATE SELECTION & LOADING
 *
 * Handles the selection and loading of pre-built company templates.
 * Templates load face configuration, KPIs, coherence data, shadow
 * patterns, and tuning parameters.
 *
 * Extracted from: orchestrator-steps.js (lines 225-425)
 * Date: December 18, 2025
 *
 * ========================================
 * NOTES FOR FUTURE CLAUDE
 * ========================================
 *
 * 1. DATA FLOW:
 *    User clicks company card → selectCompanyTemplate(companyId) →
 *    Fetches mapping-context.json → Populates demoState → Initializes engine →
 *    Updates sessionStorage → Navigates to Step 1
 *
 * 2. OFFLINE SUPPORT:
 *    If fetch fails (file:// protocol or network error), falls back to
 *    CompanyTemplatesBundle.get(companyId) for offline-bundled templates.
 *
 * 3. RE-ENTRANCY GUARD:
 *    Uses isSelectingCompanyTemplate()/setSelectingCompanyTemplate() from
 *    orchestrator-navigation.js to prevent duplicate calls from rapid clicks.
 *
 * 4. DATA BRIDGE:
 *    After loading template data:
 *    A) DataTransformer.transform() converts UI format → Engine format
 *    B) Quannex.initWithCompany() initializes the calculation engine
 *    C) DataTransformer.transformResults() converts Engine → UI format
 *
 * 5. TUNING IMPORT:
 *    If the template has diagnostics.tuning, it's imported via
 *    Quannex.importTuning() to ensure coherence calculations match
 *    the stored perspective.
 *
 * 6. SESSION STORAGE SYNC:
 *    updateSessionStorage() is called immediately after loading to
 *    populate data for 3D view. This prevents race conditions if
 *    user opens 3D view before clicking "Launch Visualization".
 *
 * 7. DEPENDENCIES CALLED:
 *    - showCompanyLoadedNotification() [from template-display.js]
 *    - hideTemplateGridForPreloadedCompany() [from template-display.js]
 *    - populateFaceEditor() [from face-configuration.js]
 *    - updateSessionStorage() [from results-display.js]
 *    - initializeCoherenceHero() [from orchestrator-dashboard.js]
 *    - getCoherenceStatus() [from orchestrator-steps.js]
 *
 * 8. EVENTS EMITTED:
 *    STATE_UPDATE via CrossWindowSync.broadcast() to notify 3D views
 *
 * ========================================
 * DEPENDENCIES
 * ========================================
 * - js/orchestrator/orchestrator-state.js (demoState)
 * - js/orchestrator/orchestrator-navigation.js (goToStep, isSelectingCompanyTemplate, etc.)
 * - js/orchestrator/steps/template-display.js (showCompanyLoadedNotification, etc.)
 * - js/orchestrator/steps/face-configuration.js (populateFaceEditor)
 * - js/orchestrator/steps/results-display.js (updateSessionStorage)
 * - js/data-transformer.js (DataTransformer) [optional]
 * - js/main.js (Quannex engine) [optional]
 * - js/company-templates-bundle.js (CompanyTemplatesBundle) [fallback]
 *
 * ========================================
 * EXPORTS (to window/global)
 * ========================================
 * - selectCompanyTemplate(companyId)
 *
 * ========================================
 */
(function(global) {
    'use strict';

    // ========================================
    // TEMPLATE SELECTION
    // ========================================

    /**
     * Select a pre-filled company template.
     *
     * Loads the mapping-context.json and pre-fills all steps with
     * face configuration, KPI data, and coherence results.
     *
     * Supports both online (fetch) and offline (bundled) template loading.
     *
     * @async
     * @param {string} companyId - Company template ID (e.g., 'zenith-solutions')
     * @fires BroadcastChannel~company-selected
     * @see {@link ./companies/[id]/mapping-context.json}
     */
    async function selectCompanyTemplate(companyId) {
        const demoState = global.demoState;
        const isSelectingCompanyTemplate = global.isSelectingCompanyTemplate;
        const setSelectingCompanyTemplate = global.setSelectingCompanyTemplate;
        const showLoading = global.showLoading;
        const hideLoading = global.hideLoading;
        const goToStep = global.goToStep;
        const getCoherenceStatus = global.getCoherenceStatus;
        const updateSessionStorage = global.updateSessionStorage;
        const showCompanyLoadedNotification = global.showCompanyLoadedNotification;
        const hideTemplateGridForPreloadedCompany = global.hideTemplateGridForPreloadedCompany;
        const populateFaceEditor = global.populateFaceEditor;
        const initializeCoherenceHero = global.initializeCoherenceHero;

        // Re-entrancy guard: prevent duplicate calls from rapid clicks or event bubbling
        if (isSelectingCompanyTemplate()) {
            console.log(`[selectCompanyTemplate] Ignoring duplicate call for: ${companyId}`);
            return;
        }
        setSelectingCompanyTemplate(true);

        console.log(`🏢 Selecting company template: ${companyId}`);
        showLoading('Loading organizational DNA...');

        try {
            let mappingContext;

            // Try to fetch from server first
            try {
                const response = await fetch(`companies/${companyId}/mapping-context.json`);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                mappingContext = await response.json();
                console.log(`✅ Loaded mapping context from server for ${mappingContext.displayName}`);
            } catch (fetchError) {
                // Fallback to bundled templates for offline/file:// protocol support
                console.warn(`⚠️ Fetch failed (${fetchError.message}), trying offline bundle...`);

                if (window.CompanyTemplatesBundle && window.CompanyTemplatesBundle.has(companyId)) {
                    mappingContext = window.CompanyTemplatesBundle.get(companyId);
                    console.log(`✅ Loaded mapping context from offline bundle for ${mappingContext.displayName}`);
                } else {
                    throw new Error(`Template not found: ${companyId} (offline bundle not available)`);
                }
            }

            // Store in state
            demoState.selectedCompanyId = companyId;
            demoState.loadedMappingContext = mappingContext;

            // Phase 5: Template selection is manual mode (pre-configured)
            demoState.setupMode = 'manual';
            sessionStorage.setItem('quannex-setup-mode', 'manual');

            // Pre-fill face configuration
            demoState.faceConfig = {
                templateName: mappingContext.displayName,
                faces: mappingContext.faces.map(face => ({
                    id: face.id,
                    name: face.customName || face.baseName,
                    icon: face.icon || '',
                    octave: face.octave,
                    tooltip: face.tooltip,
                    sentiment: face.sentiment
                }))
            };

            // Pre-fill KPI data
            demoState.kpiMode = mappingContext.mode || 'quick';
            demoState.kpiData = [];

            // Transform KPIs from mapping context
            Object.keys(mappingContext.kpis || {}).forEach(faceKey => {
                const faceId = parseInt(faceKey.replace('face', ''));
                const faceKpis = mappingContext.kpis[faceKey];
                const face = mappingContext.faces.find(f => f.id === faceId);

                faceKpis.forEach((kpi, index) => {
                    demoState.kpiData.push({
                        faceId: faceId,
                        faceName: face ? (face.customName || face.baseName) : `Face ${faceId}`,
                        id: kpi.id,
                        name: kpi.name,
                        value: kpi.value,
                        unit: kpi.unit || 'number',
                        direction: '↑',
                        targetMin: 0,
                        targetIdeal: kpi.target || 100,
                        element: 'Earth'
                    });
                });
            });

            // Pre-calculate coherence from face sentiments
            const avgCoherence = mappingContext.diagnostics?.globalCoherence ||
                (mappingContext.faces.reduce((sum, f) => sum + (f.sentiment || 0.5), 0) / mappingContext.faces.length);

            demoState.coherenceResults = {
                globalCoherence: avgCoherence,
                coherenceStatus: getCoherenceStatus(avgCoherence),
                faces: mappingContext.faces.map(f => ({
                    id: f.id,
                    name: f.customName || f.baseName,
                    faceEnergy: f.sentiment,  // Primary property for 3D viz
                    energy: f.sentiment,       // Backwards compatibility
                    kpis: []
                }))
            };

            // Mark steps as completed since data is pre-loaded
            demoState.completedSteps = [0, 1, 2, 3];

            // Sync to Sprint 2 MappingContext if available
            if (window.Sprint2 && window.Sprint2.mappingContext) {
                try {
                    const facesConfig = demoState.faceConfig.faces.map(face => ({
                        id: face.id,
                        name: face.name,
                        icon: face.icon || '',
                        source: 'template'
                    }));
                    window.Sprint2.mappingContext.setAllFaces(facesConfig);
                    console.log('✅ Synced to Sprint2 MappingContext');
                } catch (err) {
                    console.warn('⚠️ Sprint2 sync failed:', err.message);
                }
            }

            // ============================================================
            // DATA BRIDGE: Initialize Quannex Engine with template data
            // ============================================================
            try {
                if (typeof window.DataTransformer !== 'undefined' && demoState.kpiData && demoState.kpiData.length > 0) {
                    const engineData = window.DataTransformer.transform({
                        faceConfig: demoState.faceConfig,
                        kpiMode: demoState.kpiMode || 'quick',
                        kpiData: demoState.kpiData
                    });

                    // Add shadowPatterns from mappingContext to engineData
                    if (mappingContext.shadowPatterns && mappingContext.shadowPatterns.length > 0) {
                        engineData.shadowPatterns = mappingContext.shadowPatterns;
                        console.log(`[DataBridge] Added ${mappingContext.shadowPatterns.length} shadow patterns to engine data`);
                    }

                    if (typeof window.Quannex !== 'undefined') {
                        // Apply tuning parameters from template (if available)
                        // This ensures coherence calculations match the stored perspective
                        if (mappingContext.diagnostics?.tuning) {
                            const tuning = mappingContext.diagnostics.tuning;
                            console.log(`[Tuning] Applying ${tuning.perspective} perspective from template`);
                            window.Quannex.importTuning(tuning);
                        }

                        await window.Quannex.initWithCompany(engineData);
                        console.log('[DataBridge] Engine initialized with template data');

                        const engineState = window.Quannex.getState();
                        if (engineState && engineState.globalCoherence !== undefined) {
                            demoState.coherenceResults = window.DataTransformer.transformResults(engineState);
                        }
                    }
                }
            } catch (bridgeError) {
                console.warn('[DataBridge] Engine initialization skipped:', bridgeError.message);
                // Continue with fallback data - visualization will use pre-calculated sentiments
            }

            // Trigger hero update for template-loaded data
            if (demoState.coherenceResults && demoState.coherenceResults.globalCoherence) {
                setTimeout(() => {
                    if (typeof initializeCoherenceHero === 'function') {
                        initializeCoherenceHero();
                    }
                }, 200);
            }

            // Ensure sessionStorage is populated immediately for 3D view
            // (Risk Manager: prevents race condition if user opens 3D before clicking launchView)
            updateSessionStorage();
            console.log('[Template] ✅ SessionStorage populated with edges/vertices for 3D view');

            hideLoading();

            // Show success notification
            showCompanyLoadedNotification(mappingContext);

            // Navigate to Step 1 (Face Configuration) - data is pre-filled
            goToStep(1);

            // Pre-populate the face editor
            populateFaceEditor();

            // Hide the template grid to prevent users from accidentally clicking generic templates
            // which would overwrite the custom company face names
            hideTemplateGridForPreloadedCompany(mappingContext);

        } catch (error) {
            console.error('❌ Failed to load company template:', error);
            hideLoading();
            alert(`Failed to load ${companyId} template: ${error.message}`);
        } finally {
            // Always reset the re-entrancy guard
            setSelectingCompanyTemplate(false);
        }
    }

    // ========================================
    // EXPORTS
    // ========================================

    global.selectCompanyTemplate = selectCompanyTemplate;

    console.log('[template-selection] Module loaded');

})(typeof window !== 'undefined' ? window : this);
