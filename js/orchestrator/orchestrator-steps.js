/**
 * ============================================================================
 * 🧙‍♂️ QUANNEX ORCHESTRATOR - WIZARD LOGIC (STEPS 0-3)
 * ============================================================================
 * 
 * This module handles the core 4-step user journey of the Quannex demo:
 * 1. Template Selection / Manual Entry / AI Story (Step 0)
 * 2. Face Configuration (Step 1)
 * 3. KPI Entry & Mapping (Step 2)
 * 4. Calculation & Transformation (Step 3)
 * 
 * It coordinates with the Data Transformation Layer and Quannex Engine
 * to produce the coherent state used in the visualization.
 * 
 * namespace: OrchestratorSteps
 * dependencies: orchestrator-state.js, orchestrator-utils.js, logger.js
 * ============================================================================
 */
 * NOTES FOR FUTURE CLAUDE
    * ========================================
 *
 * 1. THE 4 - STEP WIZARD ARCHITECTURE:
 *    ┌─────────────────────────────────────────────────────────────────┐
 *    │ STEP 0: Template Selection                                      │
 *    │         - selectCompanyTemplate() → Pre - fills all data          │
 *    │         - startFreshManual() → Empty faces, user fills          │
 *    │         - startFreshAI() → Story - based AI extraction            │
 *    ├─────────────────────────────────────────────────────────────────┤
 *    │ STEP 1: Face Configuration                                      │
 *    │         - populateFaceEditor() → Shows 12 face name inputs      │
 *    │         - completeStep1() → Validates & syncs to MappingContext │
 *    ├─────────────────────────────────────────────────────────────────┤
 *    │ STEP 2: KPI Entry                                               │
 *    │         - selectMode('quick' | 'full') → 12 vs 60 KPIs            │
 *    │         - generateQuickModeHTML() / generateFullModeHTML()      │
 *    │         - completeStep2() → Collects & validates KPIs           │
 *    ├─────────────────────────────────────────────────────────────────┤
 *    │ STEP 3: Calculation & Results                                   │
 *    │         - runCalculation() → Transforms → Engine → Display      │
 *    │         - completeStep3() → Initializes dashboards              │
 *    └─────────────────────────────────────────────────────────────────┘
 *
 * 2. TEMPLATE VS CUSTOM FLOW:
 * This file handles TWO fundamentally different user paths:
 *
 * A) TEMPLATE FLOW(selectCompanyTemplate):
 * - Loads mapping - context.json from companies / { id } / folder
    * - Pre - fills faces, KPIs, octaves, shadow patterns
        * - Marks ALL steps complete(0, 1, 2, 3) immediately
            * - User can review and modify but data is ready
                *
 * B) CUSTOM FLOW(startFreshManual / startFreshAI):
 * - User enters faces manually OR via AI story extraction
    * - User enters KPIs one by one
        * - Steps must be completed sequentially
            * - ContextSynthesizer generates edges / vertices at Step 2
                *
 * WHY THIS MATTERS: Template flow skips validation gates because
    * data is pre - verified.Custom flow must pass Sprint 2 validation.
 *
 * 3. THE DATA BRIDGE PATTERN:
 * Demo Orchestrator UI → DataTransformer → Quannex Engine
    *
 * Line ~1495 - 1565: The runCalculation() function orchestrates this:
 * 1. DataTransformer.validate(demoData) - Check data integrity
    * 2. DataTransformer.transform(demoData) - Convert UI → Engine format
        * 3. Quannex.initWithCompany(engineData) - Run sacred geometry math
            * 4. DataTransformer.transformResults(engineState) - Convert back to UI
                *
 * FALLBACK: If Quannex engine not loaded, calculateSimpleCoherence()
    * does basic(value - min) / (ideal - min) normalization.
 *
 * 4. SESSION STORAGE SYNC(Critical for 3D View):
 * The updateSessionStorage() function at line ~1757 is CRUCIAL.
 * It writes to sessionStorage so 3D dodecahedron view can read:
 * - customCompanyData: All faces, KPIs, coherence results
    * - edges: For 30 edge visualization
        * - shadowPatterns: For shadow overlay display
            * - tuning: For consistent coherence perspective
                *
 * Also broadcasts via CrossWindowSync for live updates.
 *
 * 5. KPI NORMALIZATION FORMULA:
 * Line ~1327 - 1339: calculateLiveNormalization()
    *
 * Direction '↑'(Higher is better):
 * normalized = (value - targetMin) / (targetIdeal - targetMin)
    *
 * Direction '↓'(Lower is better):
 * normalized = (targetMin - value) / (targetMin - targetIdeal)
    *
 * Direction 'Band'(Sweet spot):
 * midpoint = (targetMin + targetIdeal) / 2
    * range = | targetIdeal - targetMin | / 2
        * normalized = max(0, 1 - (| value - midpoint | / range))
            *
 * Result clamped to[0, 1] and displayed as percentage.
 *
 * 6. RE - ENTRANCY GUARDS:
 * Line ~96 - 100: selectCompanyTemplate uses isSelectingCompanyTemplate()
    * This prevents double - clicks from loading a template twice.
 * ALWAYS check / reset in finally { } block to avoid deadlock.
 *
 * 7. OFFLINE BUNDLE FALLBACK:
 * Line ~120 - 126: If server fetch fails(file:// protocol, no server),
 * falls back to window.CompanyTemplatesBundle(pre - bundled JSON).
 * This ensures thesis demo works without HTTP server.
 *
 * 8. SHADOW DETECTION INTEGRATION:
 * Line ~1571 - 1605: For custom flow(no template shadows):
 * - ShadowDetector.analyze(faces, kpis) runs after calculation
    * - Detected patterns stored in demoState.shadowPatterns
    * - Template flow uses pre - defined shadowPatterns from JSON
    *
 * 9. THE IIFE PATTERN:
 * This file uses(function (global) { ... })(window)
    * - All functions are private by default
 * - Only functions explicitly assigned to`global.X` are public
    * - Line ~1884 - 1907 shows the export list
    *
 * 10. QUICK VS FULL MODE:
 * Quick Mode: 12 KPIs(1 per face, Earth element assumed)
    * Full Mode: 60 KPIs(5 per face, one for each element)
 *
 * Elements: Earth(Physical), Water(Emotional), Fire(Action),
 * Air(Communication), Ether(Purpose)
    *
 * 11. VALIDATION GATE BYPASS:
 * Line ~613 - 630: Template flow sets completedSteps = [0, 1, 2, 3]
    * This causes completeStep1() to skip Sprint 2 validation.
 * Custom flow MUST pass window.Sprint2.canProceed() checks.
 *
 * ========================================
 * USED BY
    * ========================================
 * - demo - orchestrator.html: Main demo wizard page
    * - orchestrator - navigation.js: Calls goToStep() after completions
        * - dodecahedron - 3d.html: Reads sessionStorage data written here
            * - portrait - view.js: Reads faces from coherenceResults
                *
 * ========================================
 * GOTCHAS FOR FUTURE CLAUDE
    * ========================================
 * - Don't forget to call updateSessionStorage() after any data change
    * or 3D view will show stale data
        * - Template flow skips validation - don't add validation there
            * - The collectKPIData() function uses data - face - id attributes,
 * not input IDs - selector must match HTML generation
    * - Empty KPI values default to 0, not null - this is intentional
        * - faceEnergy vs energy: Some code uses one, some uses other
            * (backwards compatibility). Check both: face.energy || face.faceEnergy
                * - Quick mode always uses Earth element for elemental calculations
                    *
 * ========================================
 * DEPENDENCIES
    * ========================================
 * - js / orchestrator / orchestrator - state.js(demoState, guards)
        * - js / orchestrator / orchestrator - utils.js(showLoading, hideLoading)
        * - js / orchestrator / orchestrator - navigation.js(goToStep)
        * - js / orchestrator / orchestrator - dashboard.js(dashboard initialization)
        * - js / orchestrator / orchestrator - session.js(SessionManager)
        * - js / orchestrator / orchestrator - sync.js(CrossWindowSync)
        *
 * ========================================
 * EXPORTS(to window / global)
    * ========================================
 * Template selection:
 * - selectCompanyTemplate(companyId)
    * - startFreshManual()
    * - startFreshAI()
    * - resetToTemplateSelection()
    *
 * Step completion:
 * - completeStep1()
    * - selectMode(mode)
    * - completeStep2()
    * - completeStep3()
    *
 * KPI helpers:
 * - autofillKPISuggestion(inputElement, faceId)
    * - autofillElementalKPI(inputElement, faceId, element)
    * - calculateLiveNormalization(faceId)
    *
 * Session storage:
 * - updateSessionStorage()
    *
 * ========================================
 */
    (function (global) {
        'use strict';

        // ========================================
        // IMPORTS (from global scope)
        // ========================================
        // These modules must be loaded before this one:
        // - orchestrator-state.js → demoState, isSelectingCompanyTemplate, setSelectingCompanyTemplate
        // - orchestrator-utils.js → showLoading, hideLoading, identifyNervousEndpoints
        // - orchestrator-navigation.js → goToStep, showValidationBlockDialog
        // - orchestrator-dashboard.js → initializeCoherenceHero, initializeOctaveDashboard, initializePortraitView
        // - orchestrator-session.js → SessionManager
        // - orchestrator-sync.js → CrossWindowSync

        // ========================================
        // SECTION 7: STEP 0 - TEMPLATE SELECTION
        // ========================================
        //
        // Functions for selecting pre-built company templates.
        // Templates load face configuration, KPIs, and coherence data.
        //
        // Key functions:
        //   - selectCompanyTemplate(companyId)
        //   - startFreshManual()
        //   - startFreshAI()
        //   - markStepCompleted(stepNumber)
        //
        // Events emitted: 'company-selected'
        // ========================================

        /**
         * Select a pre-filled company template.
         * Loads the mapping-context.json and pre-fills all steps.
         *
         * @async
         * @param {string} companyId - Company template ID (e.g., 'techstartup')
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

            // Re-entrancy guard: prevent duplicate calls from rapid clicks or event bubbling
            if (isSelectingCompanyTemplate()) {
                Logger.info('OrchestratorSteps', `Ignoring duplicate call for: ${companyId}`);
                return;
            }
            setSelectingCompanyTemplate(true);

            Logger.info('OrchestratorSteps', `Selecting company template: ${companyId}`);
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
                    Logger.info('OrchestratorSteps', `Loaded mapping context from server for ${mappingContext.displayName}`);
                } catch (fetchError) {
                    // Fallback to bundled templates for offline/file:// protocol support
                    Logger.warn('OrchestratorSteps', `Fetch failed (${fetchError.message}), trying offline bundle...`);

                    if (window.CompanyTemplatesBundle && window.CompanyTemplatesBundle.has(companyId)) {
                        mappingContext = window.CompanyTemplatesBundle.get(companyId);
                        Logger.info('OrchestratorSteps', `Loaded mapping context from offline bundle for ${mappingContext.displayName}`);
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
                        Logger.info('OrchestratorSteps', 'Synced to Sprint2 MappingContext');
                    } catch (err) {
                        Logger.warn('OrchestratorSteps', 'Sprint2 sync failed', err.message);
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
                            Logger.info('OrchestratorSteps', `Added ${mappingContext.shadowPatterns.length} shadow patterns to engine data`);
                        }

                        if (typeof window.Quannex !== 'undefined') {
                            // Apply tuning parameters from template (if available)
                            // This ensures coherence calculations match the stored perspective
                            if (mappingContext.diagnostics?.tuning) {
                                const tuning = mappingContext.diagnostics.tuning;
                                Logger.info('OrchestratorSteps', `Applying ${tuning.perspective} perspective from template`);
                                window.Quannex.importTuning(tuning);
                            }

                            await window.Quannex.initWithCompany(engineData);
                            Logger.info('OrchestratorSteps', 'Engine initialized with template data');

                            const engineState = window.Quannex.getState();
                            if (engineState && engineState.globalCoherence !== undefined) {
                                demoState.coherenceResults = window.DataTransformer.transformResults(engineState);
                            }
                        }
                    }
                } catch (bridgeError) {
                    Logger.warn('OrchestratorSteps', 'Engine initialization skipped', bridgeError.message);
                    // Continue with fallback data - visualization will use pre-calculated sentiments
                }

                // Trigger hero update for template-loaded data
                if (demoState.coherenceResults && demoState.coherenceResults.globalCoherence) {
                    setTimeout(() => {
                        if (typeof global.initializeCoherenceHero === 'function') {
                            global.initializeCoherenceHero();
                        }
                    }, 200);
                }

                // Ensure sessionStorage is populated immediately for 3D view
                // (Risk Manager: prevents race condition if user opens 3D before clicking launchView)
                updateSessionStorage();
                Logger.info('OrchestratorSteps', 'SessionStorage populated with edges/vertices for 3D view');

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
                Logger.error('OrchestratorSteps', 'Failed to load company template', error);
                hideLoading();
                alert(`Failed to load ${companyId} template: ${error.message}`);
            } finally {
                // Always reset the re-entrancy guard
                setSelectingCompanyTemplate(false);
            }
        }

        // ========================================
        // SECTION 8: COMPANY LOADING & DISPLAY
        // ========================================
        //
        // Functions for displaying loaded company data and managing
        // template grid visibility.
        //
        // Key functions:
        //   - showCompanyLoadedNotification(mappingContext)
        //   - hideTemplateGridForPreloadedCompany(mappingContext)
        //   - resetToTemplateSelection()
        //
        // ========================================

        /**
         * Show notification that company data was loaded.
         *
         * @param {Object} mappingContext - Loaded company mapping context
         */
        function showCompanyLoadedNotification(mappingContext) {
            const notification = document.createElement('div');
            notification.id = 'company-loaded-notification';
            notification.innerHTML = `
            <div style="position: fixed; top: 100px; right: 20px; z-index: 2000;
                        background: rgba(0, 255, 204, 0.15); border: 1px solid rgba(0, 255, 204, 0.4);
                        border-radius: 12px; padding: 20px; max-width: 350px;
                        animation: slideIn 0.5s ease;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <span style="font-size: 32px;">${mappingContext.faces[0]?.icon || '🏢'}</span>
                    <div>
                        <div style="font-weight: 600; color: #00ffcc; font-size: 16px;">
                            ${mappingContext.displayName} Loaded
                        </div>
                        <div style="font-size: 12px; color: rgba(255,255,255,0.7); margin-top: 4px;">
                            ${mappingContext.octaveStage} • ${mappingContext.archetype}
                        </div>
                        <div style="font-size: 11px; color: rgba(255,255,255,0.5); margin-top: 4px; font-style: italic;">
                            "${mappingContext.dominantBreathName}"
                        </div>
                    </div>
                </div>
                <div style="margin-top: 12px; font-size: 11px; color: rgba(255,255,255,0.6);">
                    ✅ All 12 faces pre-configured<br>
                    ✅ KPIs and metrics loaded<br>
                    ✅ Ready to explore the journey
                </div>
            </div>
        `;
            document.body.appendChild(notification);

            // Remove after 5 seconds
            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transition = 'opacity 0.5s ease';
                setTimeout(() => notification.remove(), 500);
            }, 5000);
        }

        /**
         * Hide template grid when company data is pre-loaded
         * This prevents users from accidentally clicking generic templates
         * which would overwrite the custom company face names
         */
        function hideTemplateGridForPreloadedCompany(mappingContext) {
            const templateGrid = document.querySelector('.template-grid');
            const step1Content = document.getElementById('step1');

            if (!templateGrid || !step1Content) return;

            // Hide the template grid
            templateGrid.style.display = 'none';

            // Hide the "Select a Template" header
            const templateHeader = step1Content.querySelector('h3');
            if (templateHeader && templateHeader.textContent.includes('Select a Template')) {
                templateHeader.style.display = 'none';
            }

            // Add a "company loaded" banner at the top of Step 1
            const existingBanner = document.getElementById('company-preloaded-banner');
            if (existingBanner) existingBanner.remove();

            const banner = document.createElement('div');
            banner.id = 'company-preloaded-banner';
            banner.innerHTML = `
            <div style="background: linear-gradient(135deg, rgba(0, 255, 204, 0.15), rgba(147, 112, 219, 0.15));
                        border: 1px solid rgba(0, 255, 204, 0.3); border-radius: 12px; padding: 20px;
                        margin-bottom: 20px; display: flex; align-items: center; gap: 15px;">
                <div style="font-size: 40px;">${mappingContext.faces[0]?.icon || '🏢'}</div>
                <div style="flex: 1;">
                    <div style="font-size: 18px; font-weight: 600; color: #00ffcc;">
                        ${mappingContext.displayName} Template Loaded
                    </div>
                    <div style="font-size: 13px; color: rgba(255,255,255,0.7); margin-top: 4px;">
                        ${mappingContext.octaveStage} • ${mappingContext.archetype} • 12 custom faces pre-configured
                    </div>
                    <div style="font-size: 12px; color: rgba(255,255,255,0.5); margin-top: 8px; font-style: italic;">
                        Review the faces below and click "Next" when ready
                    </div>
                </div>
                <button onclick="resetToTemplateSelection()"
                        style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
                               border-radius: 8px; padding: 8px 16px; color: rgba(255,255,255,0.7);
                               cursor: pointer; font-size: 12px; transition: all 0.3s;">
                    Choose Different Template
                </button>
            </div>
        `;

            // Insert banner before the info-box
            const infoBox = step1Content.querySelector('.info-box');
            if (infoBox) {
                infoBox.parentNode.insertBefore(banner, infoBox);
            }

            Logger.info('OrchestratorSteps', 'Template grid hidden for pre-loaded company');
        }

        /**
         * Reset to template selection (when user wants to choose a different template)
         */
        function resetToTemplateSelection() {
            const demoState = global.demoState;

            // Show the template grid again
            const templateGrid = document.querySelector('.template-grid');
            if (templateGrid) templateGrid.style.display = 'grid';

            // Show the "Select a Template" header
            const step1Content = document.getElementById('step1');
            const templateHeader = step1Content?.querySelector('h3');
            if (templateHeader) templateHeader.style.display = 'block';

            // Remove the preloaded banner
            const banner = document.getElementById('company-preloaded-banner');
            if (banner) banner.remove();

            // Clear company data
            demoState.selectedCompanyId = null;
            demoState.loadedMappingContext = null;
            demoState.faceConfig = null;
            demoState.kpiData = [];
            demoState.coherenceResults = null;
            demoState.completedSteps = [0];

            // Clear face editor
            const faceEditorSection = document.getElementById('faceEditorSection');
            if (faceEditorSection) faceEditorSection.style.display = 'none';

            Logger.info('OrchestratorSteps', 'Reset to template selection');
        }

        // ========================================
        // SECTION 9: STEP 1 - FACE CONFIGURATION
        // ========================================
        //
        // Functions for managing face editor UI and Step 1 completion.
        //
        // Key functions:
        //   - populateFaceEditor()
        //   - startFreshManual()
        //   - startFreshAI()
        //   - completeStep1()
        //
        // ========================================

        /**
         * Populate the face editor with pre-loaded data.
         */
        function populateFaceEditor() {
            const demoState = global.demoState;

            if (!demoState.faceConfig) return;

            // Generate face grid HTML
            const faceGrid = document.getElementById('faceGrid');
            if (!faceGrid) return;

            let html = '';
            demoState.faceConfig.faces.forEach(face => {
                html += `
                <div class="face-item" style="background: rgba(0, 255, 204, 0.1); border-color: rgba(0, 255, 204, 0.3);">
                    <span class="face-number">${face.id}</span>
                    <input
                        type="text"
                        class="face-input"
                        id="face-input-${face.id}"
                        value="${face.name}"
                        placeholder="Face ${face.id} name"
                        data-face-id="${face.id}"
                        style="border-color: rgba(0, 255, 204, 0.5);"
                    />
                    <span style="font-size: 11px; color: rgba(255,255,255,0.5); margin-left: 8px;">
                        O${face.octave || '?'}
                    </span>
                </div>
            `;
            });

            faceGrid.innerHTML = html;

            // Show the face editor section
            const editorSection = document.getElementById('faceEditorSection');
            if (editorSection) {
                editorSection.style.display = 'block';
            }

            // Enable the Next button
            const nextBtn = document.getElementById('step1NextBtn');
            if (nextBtn) {
                nextBtn.disabled = false;
            }

            Logger.info('OrchestratorSteps', 'Face editor populated with pre-loaded data');
        }

        /**
         * Start fresh with manual setup
         */
        function startFreshManual() {
            const demoState = global.demoState;
            const goToStep = global.goToStep;

            Logger.info('OrchestratorSteps', 'Starting fresh manual session');

            // Mark step 0 as complete
            markStepCompleted(0);

            // Clear any loaded company data
            demoState.selectedCompanyId = null;
            demoState.loadedMappingContext = null;

            // Phase 5: Track setup mode for AI integration
            demoState.setupMode = 'manual';
            sessionStorage.setItem('quannex-setup-mode', 'manual');

            // Navigate to step 1
            goToStep(1);
        }

        /**
         * Start fresh with AI story mode
         */
        function startFreshAI() {
            const demoState = global.demoState;
            const goToStep = global.goToStep;

            Logger.info('OrchestratorSteps', 'Starting fresh AI session');

            // Mark step 0 as complete
            markStepCompleted(0);

            // Clear any loaded company data
            demoState.selectedCompanyId = null;
            demoState.loadedMappingContext = null;

            // Phase 5: Track setup mode for AI integration
            demoState.setupMode = 'ai-assisted';
            sessionStorage.setItem('quannex-setup-mode', 'ai-assisted');

            // Navigate to step 1
            goToStep(1);

            // Select the AI Story template
            setTimeout(() => {
                if (typeof selectTemplate === 'function') {
                    selectTemplate('story');
                }
            }, 100);
        }

        /**
         * Mark step as completed
         */
        function markStepCompleted(stepNumber) {
            const demoState = global.demoState;

            if (!demoState.completedSteps.includes(stepNumber)) {
                demoState.completedSteps.push(stepNumber);
            }

            // Update UI
            const stepButton = document.querySelector(`[data-step="${stepNumber}"]`);
            if (stepButton) {
                stepButton.classList.add('completed');
            }
        }

        /**
         * Complete Step 1: Face Definition
         */
        function completeStep1() {
            const demoState = global.demoState;
            const goToStep = global.goToStep;
            const showValidationBlockDialog = global.showValidationBlockDialog;

            // Validate faces (local check)
            const validation = validateFaces();

            if (!validation.valid) {
                alert(validation.message);
                return;
            }

            // Save configuration first
            demoState.faceConfig = getFaceConfiguration();

            // Sprint 2 FIX: Sync faces to MappingContext BEFORE validation check
            if (window.Sprint2 && window.Sprint2.mappingContext) {
                try {
                    const facesConfig = demoState.faceConfig.faces.map(face => ({
                        id: face.id,
                        name: face.name,
                        icon: face.icon || '',
                        source: 'user'
                    }));
                    window.Sprint2.mappingContext.setAllFaces(facesConfig);
                    Logger.info('OrchestratorSteps', 'Synced faces to MappingContext');
                } catch (err) {
                    Logger.warn('OrchestratorSteps', 'MappingContext sync failed', err.message);
                }
            }

            // Sprint 2 FIX: Now check validation gate with updated data
            // EXCEPTION: Skip validation for template flow (all steps already marked complete)
            if (window.Sprint2 && window.Sprint2.validationGate) {
                const isTemplateFlow = demoState.completedSteps.includes(1) &&
                    demoState.completedSteps.includes(2) &&
                    demoState.completedSteps.includes(3);

                if (!isTemplateFlow) {
                    const gateResult = window.Sprint2.canProceed();
                    Logger.debug('OrchestratorSteps', 'Validation Gate:', gateResult);

                    // Block if validation fails - show empowering dialog
                    if (!gateResult.canProceed) {
                        showValidationBlockDialog(gateResult);
                        return; // Block navigation
                    }
                } else {
                    Logger.info('OrchestratorSteps', 'Validation Gate: Skipped (template flow)');
                }
            }

            // Mark completed
            markStepCompleted(1);

            // Show success
            Logger.info('OrchestratorSteps', 'Step 1 completed:', demoState.faceConfig);

            // Go to next step
            goToStep(2);
        }

        /**
         * Validate faces before completing Step 1
         */
        function validateFaces() {
            const inputs = document.querySelectorAll('.face-input[data-face-id]');
            let valid = true;
            let message = '';

            inputs.forEach(input => {
                if (!input.value || input.value.trim() === '') {
                    valid = false;
                    message = 'Please name all 12 faces before proceeding.';
                }
            });

            return { valid, message };
        }

        /**
         * Get face configuration from form
         */
        function getFaceConfiguration() {
            const demoState = global.demoState;
            const faces = [];

            // Use data-face-id selector (consistent with validateFaces and FaceWizard)
            for (let i = 1; i <= 12; i++) {
                const input = document.querySelector(`.face-input[data-face-id="${i}"]`);
                faces.push({
                    id: i,
                    name: input ? input.value.trim() : `Face ${i}`,
                    icon: '',
                    octave: demoState.faceConfig?.faces?.[i - 1]?.octave || 1
                });
            }

            return {
                templateName: demoState.faceConfig?.templateName || 'Custom Configuration',
                faces: faces
            };
        }

        // ========================================
        // SECTION 10: STEP 2 - KPI ENTRY
        // ========================================
        //
        // Functions for KPI mode selection, mapper interface generation,
        // and KPI data auto-fill from AI story analysis.
        //
        // Key functions:
        //   - selectMode(mode)
        //   - loadKPIMapper(mode)
        //   - generateQuickModeHTML()
        //   - generateFullModeHTML()
        //   - autoFillExtractedKPIs()
        //   - autofillKPISuggestion(input, faceId)
        //   - calculateLiveNormalization(faceId)
        //
        // ========================================

        /**
         * Select KPI mode (quick = 1 KPI/face, full = 5 KPIs/face).
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
                    Logger.info('OrchestratorSteps', `Synced mode to MappingContext: ${mode}`);
                } catch (err) {
                    Logger.warn('OrchestratorSteps', 'Mode sync failed', err.message);
                }
            }

            // Load KPI mapper
            loadKPIMapper(mode);

            // Enable next button
            document.getElementById('step2NextBtn').disabled = false;

            Logger.info('OrchestratorSteps', `KPI mode selected: ${mode}`);
        }

        /**
         * Load KPI mapper interface
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
            autoFillExtractedKPIs();

            // Session 2 Enhancement: Calculate normalization preview for all faces
            // This shows live health indicators for pre-filled template data
            setTimeout(() => {
                if (typeof calculateAllNormalizations === 'function') {
                    calculateAllNormalizations();
                }
            }, 100);
        }

        /**
         * Auto-fill KPI fields with AI-extracted data
         */
        function autoFillExtractedKPIs() {
            // Check if we have extracted KPIs from story analysis
            const extractedKPIs = window.getExtractedKPIs ? window.getExtractedKPIs() : [];
            const financials = window.getExtractedFinancials ? window.getExtractedFinancials() : {};

            if (extractedKPIs.length === 0 && Object.keys(financials).length === 0) {
                Logger.info('OrchestratorSteps', 'No extracted KPIs to auto-fill');
                return;
            }

            Logger.info('OrchestratorSteps', `Auto-filling ${extractedKPIs.length} extracted KPIs...`);

            // Fill KPIs by face
            extractedKPIs.forEach(kpi => {
                const faceId = kpi.faceId;

                // Find the input fields for this face
                const nameInput = document.querySelector(`input[data-face-id="${faceId}"][data-field="kpiName"]`);
                const valueInput = document.querySelector(`input[data-face-id="${faceId}"][data-field="value"]`);

                if (nameInput && kpi.name) {
                    nameInput.value = kpi.name;
                    nameInput.style.borderColor = 'rgba(0, 255, 204, 0.5)';
                }

                if (valueInput && kpi.value !== undefined && kpi.value !== null) {
                    // Extract numeric value from string or use directly if already a number
                    let numValue;
                    if (typeof kpi.value === 'number') {
                        numValue = kpi.value;
                    } else {
                        numValue = parseFloat(String(kpi.value).replace(/[^0-9.-]/g, ''));
                    }

                    if (!isNaN(numValue)) {
                        valueInput.value = numValue;
                        valueInput.style.borderColor = 'rgba(0, 255, 204, 0.5)';

                        // Trigger normalization calculation
                        if (typeof calculateLiveNormalization === 'function') {
                            calculateLiveNormalization(faceId);
                        }
                    }
                }
            });

            // Also apply direct financial extractions as fallback
            if (financials.revenue?.value) {
                setKPIFieldValue(1, 'Revenue', financials.revenue.value);
            }
            if (financials.teamSize?.value) {
                setKPIFieldValue(3, 'Team Size', financials.teamSize.value);
            }
            if (financials.customers?.value) {
                setKPIFieldValue(5, 'Customer Count', financials.customers.value);
            }
            if (financials.runway?.value) {
                setKPIFieldValue(11, 'Runway', financials.runway.value);
            }

            // Show confirmation message
            showAutoFillNotification(extractedKPIs.length);
        }

        /**
         * Helper to set a KPI field value
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
         * Show notification that KPIs were auto-filled
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

        /**
         * Generate Quick Mode HTML (12 KPIs) - ENHANCED with better layout
         */
        function generateQuickModeHTML() {
            const demoState = global.demoState;

            // Defensive check: ensure face configuration exists
            if (!demoState.faceConfig || !demoState.faceConfig.faces) {
                Logger.error('OrchestratorSteps', 'No face configuration available');
                return '<p style="color: #ff6b6b; text-align: center; padding: 40px;">Please complete Step 1 (Define Faces) first.</p>';
            }

            const units = window.KPILibrary ? window.KPILibrary.getUnitTypes() : [];

            // Create KPI lookup by faceId for pre-filling template data
            const kpiByFaceId = {};
            if (demoState.kpiData && demoState.kpiData.length > 0) {
                demoState.kpiData.forEach(kpi => {
                    kpiByFaceId[kpi.faceId] = kpi;
                });
                Logger.info('OrchestratorSteps', 'Pre-filling with template KPIs', Object.keys(kpiByFaceId).length);
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

        /**
         * Generate Full Mode HTML (60 KPIs) - ENHANCED with tooltips, units, and suggestions
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

        /**
         * Complete Step 2: KPI Mapping
         */
        function completeStep2() {
            const demoState = global.demoState;
            const goToStep = global.goToStep;

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
                Logger.info('OrchestratorSteps', 'Custom flow detected - synthesizing edges and vertices...');

                // Check if Context Synthesizer is available
                if (window.ContextSynthesizer && typeof window.ContextSynthesizer.synthesizeCustomContext === 'function') {
                    try {
                        const synthesizedContext = window.ContextSynthesizer.synthesizeCustomContext(
                            demoState.faceConfig,
                            demoState.kpiData
                        );

                        if (synthesizedContext) {
                            demoState.loadedMappingContext = synthesizedContext;
                            Logger.info('OrchestratorSteps', `Context Synthesizer generated: ${synthesizedContext.edges?.length || 0} edges, ${synthesizedContext.vertices?.length || 0} vertices`);
                        }
                    } catch (error) {
                        Logger.error('OrchestratorSteps', 'Context Synthesizer failed', error);
                        // Continue anyway - visualization will work without edges
                    }
                } else {
                    Logger.warn('OrchestratorSteps', 'Context Synthesizer not loaded - 3D view may lack edge data');
                }
            }

            // Mark completed
            markStepCompleted(2);

            Logger.info('OrchestratorSteps', 'Step 2 completed', demoState.kpiData);

            // Go to calculation
            goToStep(3);

            // Auto-run calculation
            runCalculation();
        }

        /**
         * Autofill KPI suggestion (Quick Mode)
         */
        function autofillKPISuggestion(inputElement, faceId) {
            const kpiName = inputElement.value.trim();
            const datalistOptions = inputElement.list?.options;

            Logger.debug('OrchestratorSteps', `Autofill triggered for Face ${faceId}, KPI name: "${kpiName}"`);

            if (!kpiName) {
                Logger.debug('OrchestratorSteps', 'No KPI name entered');
                return;
            }

            if (!datalistOptions) {
                Logger.debug('OrchestratorSteps', 'No datalist options found');
                return;
            }

            // Ensure the input value is set (sometimes datalist doesn't persist)
            inputElement.value = kpiName;
            inputElement.setAttribute('value', kpiName);

            // Find matching option
            let matched = false;
            for (let option of datalistOptions) {
                if (option.value === kpiName) {
                    // Autofill unit, min, and ideal if available
                    const faceInputs = document.querySelectorAll(`[data-face-id="${faceId}"]`);

                    faceInputs.forEach(input => {
                        const field = input.getAttribute('data-field');

                        if (field === 'unit' && option.dataset.unit) {
                            input.value = option.dataset.unit;
                        }
                        if (field === 'targetMin' && option.dataset.min && !input.value) {
                            input.value = option.dataset.min;
                        }
                        if (field === 'targetIdeal' && option.dataset.ideal && !input.value) {
                            input.value = option.dataset.ideal;
                        }
                    });

                    matched = true;
                    Logger.info('OrchestratorSteps', `Autofilled KPI: ${kpiName}`);
                    break;
                }
            }

            if (!matched) {
                Logger.debug('OrchestratorSteps', `No matching suggestion found (custom KPI: "${kpiName}")`);
            }

            // Trigger live normalization after autofill
            setTimeout(() => calculateLiveNormalization(faceId), 100);
        }

        /**
         * Autofill elemental KPI suggestion (Full Mode)
         */
        function autofillElementalKPI(inputElement, faceId, element) {
            const kpiName = inputElement.value;
            const datalistOptions = inputElement.list?.options;

            if (!datalistOptions) return;

            // Find matching option
            for (let option of datalistOptions) {
                if (option.value === kpiName) {
                    // Autofill unit, min, and ideal if available
                    const faceInputs = document.querySelectorAll(`[data-face-id="${faceId}"][data-element="${element}"]`);

                    faceInputs.forEach(input => {
                        const field = input.getAttribute('data-field');

                        if (field === 'unit' && option.dataset.unit) {
                            input.value = option.dataset.unit;
                        }
                        if (field === 'targetMin' && option.dataset.min && !input.value) {
                            input.value = option.dataset.min;
                        }
                        if (field === 'targetIdeal' && option.dataset.ideal && !input.value) {
                            input.value = option.dataset.ideal;
                        }
                    });

                    Logger.info('OrchestratorSteps', `Autofilled ${element} KPI: ${kpiName}`);
                    break;
                }
            }
        }

        /**
         * Calculate live normalization for a KPI (Quick Mode)
         */
        function calculateLiveNormalization(faceId) {
            // Get all inputs for this face
            const inputs = document.querySelectorAll(`[data-face-id="${faceId}"]`);
            const kpiData = {};

            inputs.forEach(input => {
                const field = input.getAttribute('data-field');
                kpiData[field] = input.value;
            });

            // Get values
            const value = parseFloat(kpiData.value);
            const targetMin = parseFloat(kpiData.targetMin);
            const targetIdeal = parseFloat(kpiData.targetIdeal);
            const direction = kpiData.direction || '↑';

            // Show/hide preview
            const previewDiv = document.getElementById(`normalization-preview-${faceId}`);
            const normValueSpan = document.getElementById(`norm-value-${faceId}`);

            // Only show if we have all required values
            if (isNaN(value) || isNaN(targetMin) || isNaN(targetIdeal)) {
                previewDiv.style.display = 'none';
                return;
            }

            // Calculate normalized score based on direction
            let normalized = 0;

            if (direction === '↑') {
                // Higher is better
                normalized = (value - targetMin) / (targetIdeal - targetMin);
            } else if (direction === '↓') {
                // Lower is better
                normalized = (targetMin - value) / (targetMin - targetIdeal);
            } else if (direction === 'Band') {
                // Sweet spot (band target)
                const midpoint = (targetMin + targetIdeal) / 2;
                const range = Math.abs(targetIdeal - targetMin) / 2;
                const distance = Math.abs(value - midpoint);
                normalized = Math.max(0, 1 - (distance / range));
            }

            // Clamp between 0 and 1
            normalized = Math.max(0, Math.min(1, normalized));

            // Display
            const percentage = (normalized * 100).toFixed(1);
            normValueSpan.textContent = `${percentage}%`;

            // Color code
            if (normalized >= 0.7) {
                normValueSpan.style.color = '#00ff88';
            } else if (normalized >= 0.4) {
                normValueSpan.style.color = '#ffcc00';
            } else {
                normValueSpan.style.color = '#ff6666';
            }

            previewDiv.style.display = 'block';
        }

        // ========================================
        // SECTION 11: KPI COLLECTION & CALCULATION
        // ========================================
        //
        // Functions for collecting KPI data from forms, running coherence
        // calculations, and processing results through the Quannex engine.
        //
        // Key functions:
        //   - collectKPIData()
        //   - runCalculation()
        //   - calculateSimpleCoherence(kpis)  [fallback]
        //   - getCoherenceStatus(coherence)
        //
        // Events emitted: 'calculation-complete'
        // ========================================

        /**
         * Collect KPI data from form.
         * Enhanced with units and defaults to 0 for empty values.
         *
         * @returns {Array<Object>} Array of KPI objects
         */
        function collectKPIData() {
            const demoState = global.demoState;
            const kpis = [];

            Logger.info('OrchestratorSteps', 'Collecting KPI data...');
            Logger.debug('OrchestratorSteps', `Mode: ${demoState.kpiMode}`);
            Logger.debug('OrchestratorSteps', `Faces: ${demoState.faceConfig.faces.length}`);

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
                            Logger.debug('OrchestratorSteps', `Input value: "${input.value}", data-current-value: "${input.getAttribute('data-current-value')}"`);
                        }
                    });

                    Logger.debug('OrchestratorSteps', `Face ${face.id} (${face.name}):`, kpiData);

                    // Only require kpiName - value defaults to 0 if empty
                    if (kpiData.kpiName && kpiData.kpiName.length > 0) {
                        const kpiEntry = {
                            faceId: face.id,
                            faceName: face.name,
                            id: `F${face.id}_K1`,
                            name: kpiData.kpiName,
                            value: parseFloat(kpiData.value) || 0, // ✅ Default to 0
                            unit: kpiData.unit || 'number',
                            direction: kpiData.direction || '↑',
                            targetMin: parseFloat(kpiData.targetMin) || 0,
                            targetIdeal: parseFloat(kpiData.targetIdeal) || 100,
                            element: 'Earth' // Default for quick mode
                        };
                        kpis.push(kpiEntry);
                        Logger.debug('OrchestratorSteps', 'Added KPI', kpiEntry);
                    } else {
                        Logger.debug('OrchestratorSteps', 'Skipped (no KPI name entered for this face)');
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
                                value: parseFloat(kpiData.value) || 0, // ✅ Default to 0
                                unit: kpiData.unit || 'number',
                                direction: '↑',
                                targetMin: parseFloat(kpiData.targetMin) || 0,
                                targetIdeal: parseFloat(kpiData.targetIdeal) || 100,
                                element: element
                            };
                            kpis.push(kpiEntry);
                            Logger.debug('OrchestratorSteps', `Added ${element} KPI`, kpiEntry);
                        }
                    });
                });
            }

            Logger.info('OrchestratorSteps', `Total KPIs collected: ${kpis.length}`);

            // Validation feedback: warn if no KPIs collected
            if (kpis.length === 0) {
                Logger.warn('OrchestratorSteps', 'No KPIs collected - check if form was rendered');
                alert('Please enter at least one KPI with a name before proceeding.');
            }

            return kpis;
        }

        /**
         * Run coherence calculation
         */
        async function runCalculation() {
            const demoState = global.demoState;
            const showLoading = global.showLoading;
            const hideLoading = global.hideLoading;

            showLoading('Calculating coherence...');

            // Simulate calculation delay for UX
            await new Promise(resolve => setTimeout(resolve, 1500));

            try {
                Logger.info('OrchestratorSteps', 'Running calculation...');

                // ========================================
                // 🔄 TRANSFORMATION LAYER
                // ========================================
                // Transform UI data to Engine format using DataTransformer
                let companyData;

                if (typeof window.DataTransformer !== 'undefined') {
                    Logger.info('OrchestratorSteps', 'Using Data Transformation Layer');

                    // Prepare data for transformation
                    const demoData = {
                        faceConfig: demoState.faceConfig,
                        kpiMode: demoState.kpiMode,
                        kpiData: demoState.kpiData
                    };

                    // Validate before transforming
                    const validation = window.DataTransformer.validate(demoData);
                    Logger.debug('OrchestratorSteps', 'Validation', validation);

                    if (!validation.valid) {
                        throw new Error(`Data validation failed: ${validation.errors.join(', ')}`);
                    }

                    if (validation.warnings.length > 0) {
                        Logger.warn('OrchestratorSteps', 'Validation warnings', validation.warnings);
                    }

                    // Transform to engine format
                    companyData = window.DataTransformer.transform(demoData);
                    Logger.info('OrchestratorSteps', 'Data transformed successfully');
                } else {
                    Logger.warn('OrchestratorSteps', 'DataTransformer not loaded - using raw format');

                    // Fallback: Use raw format (may cause issues)
                    companyData = {
                        name: demoState.faceConfig.templateName,
                        kpis: demoState.kpiData
                    };
                }

                Logger.debug('OrchestratorSteps', 'Company name', companyData.name);
                Logger.debug('OrchestratorSteps', 'KPIs count', companyData.kpis.length);

                // ========================================
                // 🧮 CALCULATION ENGINE
                // ========================================
                // Check if Quannex engine is loaded
                if (typeof window.quannexEngine !== 'undefined') {
                    Logger.info('OrchestratorSteps', 'Using Quannex Engine');

                    // Use real engine
                    await window.quannexEngine.initializeWithCompany(companyData);
                    const engineState = window.quannexEngine.getState();

                    Logger.info('OrchestratorSteps', 'Engine calculation complete');

                    // Transform results back to UI format
                    if (typeof window.DataTransformer !== 'undefined') {
                        demoState.coherenceResults = window.DataTransformer.transformResults(engineState);
                    } else {
                        demoState.coherenceResults = engineState;
                    }

                    Logger.info('OrchestratorSteps', 'Results ready for display', demoState.coherenceResults);
                } else {
                    Logger.warn('OrchestratorSteps', 'Quannex Engine not loaded - using fallback calculation');

                    // Fallback: Simple calculation (works with UI format)
                    demoState.coherenceResults = calculateSimpleCoherence(demoState.kpiData);

                    Logger.info('OrchestratorSteps', 'Fallback calculation completed', demoState.coherenceResults);
                }

                // ========================================
                // 👁️ SHADOW DETECTION (for custom path)
                // ========================================
                // Only run if we don't already have shadow patterns from a template
                if (!demoState.loadedMappingContext?.shadowPatterns?.length) {
                    if (typeof window.ShadowDetector !== 'undefined' && demoState.coherenceResults?.faces) {
                        Logger.info('OrchestratorSteps', 'Running shadow detection for custom data...');
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
                                Logger.info('OrchestratorSteps', `Detected ${shadowAnalysis.detectedPatterns.length} shadow patterns`,
                                    shadowAnalysis.detectedPatterns.map(p => p.name));
                            } else {
                                Logger.info('OrchestratorSteps', 'No shadow patterns detected in custom data');
                                demoState.shadowPatterns = [];
                            }
                        } catch (e) {
                            Logger.warn('OrchestratorSteps', 'Shadow detection failed', e);
                            demoState.shadowPatterns = [];
                        }
                    } else {
                        Logger.debug('OrchestratorSteps', 'ShadowDetector not available or no face data');
                        demoState.shadowPatterns = [];
                    }
                } else {
                    Logger.info('OrchestratorSteps', 'Using template shadow patterns');
                }

                // Display results
                displayCalculationResults();

                hideLoading();
            } catch (error) {
                Logger.error('OrchestratorSteps', 'Calculation failed', error);
                Logger.error('OrchestratorSteps', 'Error details', error.message);
                hideLoading();
                alert(`Calculation failed: ${error.message}\n\nPlease check console for details.`);
            }
        }

        /**
         * Simple coherence calculation (fallback)
         */
        function calculateSimpleCoherence(kpis) {
            Logger.info('OrchestratorSteps', 'Starting simple coherence calculation...');
            Logger.debug('OrchestratorSteps', `Input KPIs: ${kpis.length}`);

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

                Logger.debug('OrchestratorSteps', `KPI: ${kpi.name} = ${kpi.value} → ${(score * 100).toFixed(1)}%`);

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
                    Logger.debug('OrchestratorSteps', `Face ${face.id} (${face.name}): ${face.kpis.length} KPIs → ${(face.energy * 100).toFixed(1)}%`);
                } else {
                    face.energy = 0;
                    Logger.debug('OrchestratorSteps', `Face ${face.id} (${face.name}): No KPIs → 0%`);
                }
            });

            // Calculate global coherence
            const faces = Object.values(faceEnergies);
            const globalCoherence = faces.length > 0
                ? faces.reduce((sum, face) => sum + face.energy, 0) / faces.length
                : 0;

            Logger.info('OrchestratorSteps', 'Calculation complete');
            Logger.info('OrchestratorSteps', `Global Coherence: ${(globalCoherence * 100).toFixed(1)}%`);
            Logger.info('OrchestratorSteps', `Status: ${getCoherenceStatus(globalCoherence)}`);

            return {
                globalCoherence: globalCoherence,
                coherenceStatus: getCoherenceStatus(globalCoherence),
                faces: faces
            };
        }

        /**
         * Get coherence status label
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
        // SECTION 12: STEP 3 - RESULTS DISPLAY
        // ========================================
        //
        // Functions for displaying coherence results, calculation
        // transparency breakdown, and session storage updates.
        //
        // Key functions:
        //   - displayCalculationResults()
        //   - updateSessionStorage()
        //   - displayCalculationTransparency()
        //   - completeStep3()
        //
        // Cross-window: Updates sessionStorage and broadcasts STATE_UPDATE
        // ========================================

        /**
         * Display calculation results.
         * Shows global coherence score and triggers breakdown display.
         */
        function displayCalculationResults() {
            const demoState = global.demoState;
            const identifyNervousEndpoints = global.identifyNervousEndpoints;

            const resultDiv = document.getElementById('calculationResult');
            const scoreDiv = document.getElementById('coherenceScore');

            const coherence = demoState.coherenceResults.globalCoherence;
            const status = demoState.coherenceResults.coherenceStatus;

            scoreDiv.textContent = `Global Coherence: ${(coherence * 100).toFixed(1)}% (${status})`;
            resultDiv.style.display = 'block';

            // Show calculation breakdown
            displayCalculationTransparency();

            // Identify nervous endpoints
            identifyNervousEndpoints();

            // 🔧 FIX: Update sessionStorage immediately after calculation
            // This allows users to recalculate and see updates in already-open 3D views
            updateSessionStorage();
        }

        /**
         * Update sessionStorage with latest data
         */
        function updateSessionStorage() {
            const demoState = global.demoState;
            const SessionManager = global.SessionManager;
            const CrossWindowSync = global.CrossWindowSync;

            if (demoState.kpiData && demoState.kpiData.length > 0) {
                // Get actual company name from loaded template or face config
                const companyName = demoState.loadedMappingContext?.displayName
                    || demoState.faceConfig?.templateName
                    || 'Custom Analysis';

                const customCompanyData = {
                    id: 'custom',
                    name: companyName,
                    description: 'User-generated data from Orchestrator',
                    kpis: demoState.kpiData,
                    faceConfig: demoState.faceConfig,
                    coherenceResults: demoState.coherenceResults,
                    breathAxes: demoState.loadedMappingContext?.breathAxes || null, // Sprint 3 Task 27: Include breath data
                    edges: demoState.loadedMappingContext?.edges || null, // Sprint 3 Task 28: Include edge data for 3D hover
                    dominantOctave: demoState.loadedMappingContext?.dominantOctave || 1,
                    tuning: demoState.loadedMappingContext?.diagnostics?.tuning || null, // Tuning perspective for consistent calculation
                    // Shadow system - use detected patterns for custom path, or template patterns if available
                    shadowPatterns: demoState.shadowPatterns?.length > 0
                        ? demoState.shadowPatterns
                        : (demoState.loadedMappingContext?.shadowPatterns || []),
                    isCustomData: true,
                    timestamp: new Date().toISOString() // Fresh timestamp on each update
                };

                sessionStorage.setItem('customCompanyData', JSON.stringify(customCompanyData));
                sessionStorage.setItem('selectedCompanyId', 'custom');
                Logger.info('OrchestratorSteps', 'Updated sessionStorage with latest data', { timestamp: customCompanyData.timestamp });

                // Dispatch shadows-updated event for Shadow Overlay Controller (reduces polling dependency)
                if (customCompanyData.shadowPatterns) {
                    window.dispatchEvent(new CustomEvent('shadows-updated', {
                        detail: { shadows: customCompanyData.shadowPatterns }
                    }));
                    Logger.debug('OrchestratorSteps', 'shadows-updated event dispatched');
                }

                // Ensure session monitoring is active
                if (SessionManager && !SessionManager._checkTimer) {
                    SessionManager.start();
                }

                // Issue #12: Broadcast state change to other windows (3D views, etc.)
                if (CrossWindowSync) {
                    CrossWindowSync.broadcast('STATE_UPDATE', {
                        customCompanyData,
                        demoState: {
                            currentStep: demoState.currentStep,
                            faceConfig: demoState.faceConfig,
                            coherenceResults: demoState.coherenceResults
                        }
                    });
                }
            }
        }

        /**
         * Display calculation transparency
         */
        function displayCalculationTransparency() {
            const demoState = global.demoState;
            const section = document.getElementById('calculationTransparency');

            let html = '<div style="margin-top: 30px;">';
            html += '<h3 style="font-size: 16px; margin-bottom: 20px; color: rgba(255, 255, 255, 0.8);">Calculation Breakdown</h3>';

            demoState.coherenceResults.faces.forEach(face => {
                const energy = face.energy || face.faceEnergy || 0;
                const percentage = (energy * 100).toFixed(1);
                const color = energy >= 0.7 ? '#00ff88' : energy >= 0.4 ? '#ffcc00' : '#ff6666';

                html += `
                <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 15px; margin-bottom: 15px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <div style="font-size: 14px; font-weight: 600; color: #fff;">Face ${face.id}: ${face.name}</div>
                            <div style="font-size: 11px; color: rgba(255, 255, 255, 0.6); margin-top: 5px;">
                                ${face.kpis ? face.kpis.length : 0} KPIs analyzed
                            </div>
                        </div>
                        <div style="font-size: 24px; font-weight: 600; color: ${color};">
                            ${percentage}%
                        </div>
                    </div>
                    <div style="margin-top: 10px; height: 6px; background: rgba(0, 0, 0, 0.3); border-radius: 3px; overflow: hidden;">
                        <div style="width: ${percentage}%; height: 100%; background: ${color}; transition: width 0.5s ease;"></div>
                    </div>
                </div>
            `;
            });

            html += '</div>';
            section.innerHTML = html;
        }

        /**
         * Complete Step 3: Calculation
         */
        function completeStep3() {
            const goToStep = global.goToStep;
            const initializeCoherenceHero = global.initializeCoherenceHero;
            const initializePortraitView = global.initializePortraitView;
            const initializeOctaveDashboard = global.initializeOctaveDashboard;

            markStepCompleted(3);
            goToStep(4);

            // Initialize Coherence Hero when entering Step 4 (Sprint 3 Task 26)
            initializeCoherenceHero();

            // Initialize Portrait View when entering Step 4
            initializePortraitView();

            // Initialize Octave Dashboard when entering Step 4 (Sprint 3 Task 30)
            initializeOctaveDashboard();
        }

        // ========================================
        // EXPORTS
        // ========================================

        // Template selection
        global.selectCompanyTemplate = selectCompanyTemplate;
        global.startFreshManual = startFreshManual;
        global.startFreshAI = startFreshAI;
        global.resetToTemplateSelection = resetToTemplateSelection;

        // Step completion
        global.markStepCompleted = markStepCompleted;
        global.completeStep1 = completeStep1;
        global.selectMode = selectMode;
        global.completeStep2 = completeStep2;
        global.completeStep3 = completeStep3;

        // KPI helpers (called from HTML onclick)
        global.autofillKPISuggestion = autofillKPISuggestion;
        global.autofillElementalKPI = autofillElementalKPI;
        global.calculateLiveNormalization = calculateLiveNormalization;

        // Session storage
        global.updateSessionStorage = updateSessionStorage;

        // Internal helpers exposed for testing/debugging
        global.collectKPIData = collectKPIData;
        global.runCalculation = runCalculation;
        global.getCoherenceStatus = getCoherenceStatus;

        Logger.info('OrchestratorSteps', 'Module loaded');

    })(typeof window !== 'undefined' ? window : this);
