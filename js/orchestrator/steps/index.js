/**
 * ========================================
 * ORCHESTRATOR STEPS - MODULE INDEX
 * ========================================
 *
 * NAVIGATION MAP FOR FUTURE CLAUDE
 *
 * This file serves as documentation and quick reference for the
 * modularized orchestrator steps system. It was created during
 * the refactoring of orchestrator-steps.js (2,050 lines) into
 * 7 smaller, focused modules.
 *
 * Refactoring Date: December 18, 2025
 * Original File: js/orchestrator/orchestrator-steps.js
 *
 * ========================================
 * MODULE DEPENDENCY GRAPH
 * ========================================
 *
 *   orchestrator-state.js (demoState)
 *          │
 *          ▼
 *   orchestrator-navigation.js (goToStep, showLoading, etc.)
 *          │
 *          ├──────────────────────────────────────────┐
 *          ▼                                          ▼
 *   template-display.js                    face-configuration.js
 *   (notifications, reset)                 (markStepCompleted)
 *          │                                          │
 *          ▼                                          ▼
 *   template-selection.js ◄───────────────► kpi-autofill.js
 *   (selectCompanyTemplate)                 (autofillKPISuggestion)
 *                                                     │
 *                                                     ▼
 *                                            kpi-entry.js
 *                                            (selectMode, completeStep2)
 *                                                     │
 *                                                     ▼
 *                                            calculation-engine.js
 *                                            (collectKPIData, runCalculation)
 *                                                     │
 *                                                     ▼
 *                                            results-display.js
 *                                            (updateSessionStorage, completeStep3)
 *
 * ========================================
 * QUICK REFERENCE: WHERE IS X?
 * ========================================
 *
 * Q: Where is the template loading logic?
 * A: template-selection.js → selectCompanyTemplate()
 *
 * Q: Where is the face editor populated?
 * A: face-configuration.js → populateFaceEditor()
 *
 * Q: Where are KPI suggestions autofilled?
 * A: kpi-autofill.js → autofillKPISuggestion(), autofillElementalKPI()
 *
 * Q: Where is the normalization calculation?
 * A: kpi-autofill.js → calculateLiveNormalization()
 *
 * Q: Where is the KPI form HTML generated?
 * A: kpi-entry.js → generateQuickModeHTML(), generateFullModeHTML()
 *
 * Q: Where is the coherence calculation triggered?
 * A: calculation-engine.js → runCalculation()
 *
 * Q: Where is sessionStorage updated for 3D view?
 * A: results-display.js → updateSessionStorage()
 *
 * Q: Where is the "reset to template" button handled?
 * A: template-display.js → resetToTemplateSelection()
 *
 * Q: Where is the company loaded notification shown?
 * A: template-display.js → showCompanyLoadedNotification()
 *
 * Q: Where is the coherence status (Radiant, Excellent, etc.)?
 * A: calculation-engine.js → getCoherenceStatus()
 *
 * ========================================
 * MODULE OVERVIEW
 * ========================================
 *
 * 1. template-display.js (~160 lines)
 *    PURPOSE: UI notifications and template grid management
 *    STEP: 0 (Choose Journey) - visual feedback
 *    EXPORTS:
 *      - showCompanyLoadedNotification(mappingContext)
 *      - hideTemplateGridForPreloadedCompany(mappingContext)
 *      - resetToTemplateSelection()
 *
 * 2. template-selection.js (~290 lines)
 *    PURPOSE: Load pre-built company templates
 *    STEP: 0 (Choose Journey)
 *    EXPORTS:
 *      - selectCompanyTemplate(companyId)
 *    FEATURES:
 *      - Online fetch with offline fallback
 *      - Data Bridge to Quannex engine
 *      - Shadow pattern importing
 *      - Re-entrancy guard
 *
 * 3. face-configuration.js (~290 lines)
 *    PURPOSE: Face editor and Step 1 completion
 *    STEP: 1 (Define Faces)
 *    EXPORTS:
 *      - populateFaceEditor()
 *      - startFreshManual()
 *      - startFreshAI()
 *      - markStepCompleted(stepNumber)
 *      - completeStep1()
 *      - validateFaces()
 *      - getFaceConfiguration()
 *    FEATURES:
 *      - Validation gate (Sprint 2)
 *      - MappingContext sync
 *
 * 4. kpi-autofill.js (~250 lines)
 *    PURPOSE: KPI suggestions and normalization preview
 *    STEP: 2 (Map Metrics) - autofill logic
 *    EXPORTS:
 *      - autofillKPISuggestion(inputElement, faceId)
 *      - autofillElementalKPI(inputElement, faceId, element)
 *      - calculateLiveNormalization(faceId)
 *      - calculateAllNormalizations()
 *      - autoFillExtractedKPIs()
 *    FEATURES:
 *      - Datalist option matching
 *      - Direction-aware normalization (↑, ↓, Band)
 *      - Live health indicator preview
 *
 * 5. kpi-entry.js (~500 lines)
 *    PURPOSE: KPI entry forms and mode selection
 *    STEP: 2 (Map Metrics) - main interface
 *    EXPORTS:
 *      - selectMode(mode)
 *      - completeStep2()
 *      - setKPIFieldValue(faceId, name, value)
 *      - showAutoFillNotification(count)
 *    FEATURES:
 *      - Quick Mode (12 KPIs)
 *      - Full Mode (60 KPIs)
 *      - Context Synthesizer integration
 *      - Dynamic HTML generation
 *
 * 6. calculation-engine.js (~420 lines)
 *    PURPOSE: KPI collection and coherence calculation
 *    STEP: 3 (Calculate)
 *    EXPORTS:
 *      - collectKPIData()
 *      - runCalculation()
 *      - getCoherenceStatus(coherence)
 *    FEATURES:
 *      - DataTransformer pipeline
 *      - Quannex engine integration
 *      - Simple coherence fallback
 *      - Shadow detection
 *
 * 7. results-display.js (~180 lines)
 *    PURPOSE: Results display and sessionStorage sync
 *    STEP: 3 (Calculate) - output
 *    EXPORTS:
 *      - displayCalculationResults(coherenceResults)
 *      - updateSessionStorage()
 *      - completeStep3()
 *    FEATURES:
 *      - CrossWindowSync broadcast
 *      - 3D view data preparation
 *      - Tuning export
 *
 * ========================================
 * LOAD ORDER (CRITICAL)
 * ========================================
 *
 * The modules MUST load in this order in HTML:
 *
 * 1. orchestrator-steps.js (original - provides base functions)
 * 2. template-display.js (no dependencies on other steps)
 * 3. results-display.js (no dependencies on other steps)
 * 4. face-configuration.js (provides markStepCompleted)
 * 5. kpi-autofill.js (provides autofill functions)
 * 6. template-selection.js (calls template-display functions)
 * 7. calculation-engine.js (calls results-display functions)
 * 8. kpi-entry.js (generates HTML that calls kpi-autofill)
 *
 * Sub-modules OVERRIDE functions from orchestrator-steps.js.
 * Last definition wins in JavaScript.
 *
 * ========================================
 * INLINE EVENT HANDLERS (7 FUNCTIONS)
 * ========================================
 *
 * These functions are called from inline onclick/onchange in generated HTML:
 *
 * 1. resetToTemplateSelection() - template-display.js
 * 2. autofillKPISuggestion(this, faceId) - kpi-autofill.js
 * 3. autofillElementalKPI(this, faceId, element) - kpi-autofill.js
 * 4. calculateLiveNormalization(faceId) - kpi-autofill.js (×4 uses)
 *
 * All must be exported to window/global.
 *
 * ========================================
 * EXTERNAL DEPENDENCIES
 * ========================================
 *
 * REQUIRED:
 * - js/orchestrator/orchestrator-state.js (demoState)
 * - js/orchestrator/orchestrator-navigation.js (goToStep, etc.)
 *
 * OPTIONAL (graceful degradation):
 * - js/main.js (Quannex engine)
 * - js/data-transformer.js (DataTransformer)
 * - js/kpi-library.js (KPILibrary)
 * - js/context-synthesizer.js (ContextSynthesizer)
 * - js/shadow-detector.js (ShadowDetector)
 * - js/company-templates-bundle.js (CompanyTemplatesBundle)
 *
 * ========================================
 * DATA CONTRACTS
 * ========================================
 *
 * sessionStorage['customCompanyData']:
 *   - id, name, description
 *   - kpis, faceConfig, coherenceResults
 *   - breathAxes, edges, vertices
 *   - dominantOctave, tuning, shadowPatterns
 *   - isCustomData, timestamp
 *
 * sessionStorage['selectedCompanyId']:
 *   - 'custom' for user-generated data
 *
 * CrossWindowSync channel: 'quannex-sync'
 *   - Message type: 'STATE_UPDATE'
 *   - Payload: { customCompanyData, demoState }
 *
 * ========================================
 */

// This file is documentation-only.
// All exports are handled by individual modules.

Logger.info('OrchestratorSteps', 'Navigation map loaded');
Logger.info('OrchestratorSteps', 'Modules: template-display, template-selection, face-configuration, kpi-autofill, kpi-entry, calculation-engine, results-display');
