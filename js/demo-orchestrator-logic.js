/**
 * ========================================
 * DEMO ORCHESTRATOR LOGIC
 * ========================================
 *
 * Main navigation and state management for the Demo Orchestrator flow.
 * This file is now a THIN FACADE after Phase 3 modularization.
 *
 * @module DemoOrchestratorLogic
 * @see {@link ../demo-orchestrator.html} - Main HTML entry point
 * @see {@link ../js/data-transformer.js} - Data transformation layer
 * @see {@link ../js/main.js} - Calculation engine
 *
 * ========================================
 * PHASE 3 MODULARIZATION SUMMARY
 * ========================================
 *
 * All functionality has been extracted to dedicated modules:
 *
 * js/orchestrator/orchestrator-state.js
 *   - demoState, re-entrancy guards, PHI thresholds
 *
 * js/orchestrator/orchestrator-session.js
 *   - SessionManager, 30-minute timeout, expiry warnings
 *
 * js/orchestrator/orchestrator-sync.js
 *   - CrossWindowSync, BroadcastChannel messaging
 *
 * js/orchestrator/orchestrator-navigation.js
 *   - initializeDemo(), goToStep(), updateProgress()
 *   - showValidationBlockDialog(), closeValidationModal()
 *
 * js/orchestrator/orchestrator-dashboard.js
 *   - OCTAVE_REFERENCE, initializeCoherenceHero()
 *   - initializeOctaveDashboard(), initializePortraitView()
 *
 * js/orchestrator/orchestrator-utils.js
 *   - identifyNervousEndpoints(), identifyHighestLeverageAction()
 *   - launchView(), exportReport(), saveConfiguration()
 *   - showLoading(), hideLoading()
 *
 * js/orchestrator/orchestrator-steps.js
 *   - selectCompanyTemplate(), startFreshManual(), startFreshAI()
 *   - populateFaceEditor(), completeStep1()
 *   - selectMode(), loadKPIMapper(), completeStep2()
 *   - runCalculation(), displayCalculationResults(), completeStep3()
 *
 * ========================================
 * CROSS-WINDOW EVENTS
 * ========================================
 *
 * This module sends/receives events via CrossWindowSync:
 *
 * OUTGOING:
 * - 'company-selected'    → Broadcast when company template chosen
 * - 'calculation-complete' → Broadcast when coherence calculated
 * - 'step-changed'        → Broadcast when navigation occurs
 *
 * INCOMING:
 * - 'data-loaded'         → From UnifiedDataLoader when company loaded
 * - 'octave-selected'     → From 3D visualization
 *
 * ========================================
 */

// ========================================
// SECTION 1: GLOBAL STATE & CONFIG
// ========================================
// EXTRACTED to js/orchestrator/orchestrator-state.js
// Exports: demoState, isSelectingCompanyTemplate(), setSelectingCompanyTemplate()
//          OCTAVE_COHERENCE_THRESHOLDS, OrchestratorPHI
// ========================================

// ========================================
// SECTION 2: SESSION MANAGEMENT
// ========================================
// EXTRACTED to js/orchestrator/orchestrator-session.js
// Exports: SessionManager
// ========================================

// ========================================
// SECTION 3: CROSS-WINDOW COMMUNICATION
// ========================================
// EXTRACTED to js/orchestrator/orchestrator-sync.js
// Exports: CrossWindowSync
// ========================================

// ========================================
// SECTION 4: INITIALIZATION
// ========================================
// EXTRACTED to js/orchestrator/orchestrator-navigation.js
// Exports: initializeDemo(), highlightTemplateOptions()
// ========================================

// ========================================
// SECTION 5: NAVIGATION & PROGRESS
// ========================================
// EXTRACTED to js/orchestrator/orchestrator-navigation.js
// Exports: goToStep(stepNumber), updateProgress()
// ========================================

// ========================================
// SECTION 6: VALIDATION DIALOGS
// ========================================
// EXTRACTED to js/orchestrator/orchestrator-navigation.js
// Exports: showValidationBlockDialog(), closeValidationModal(),
//          applyDefaultsAndProceed(), focusOnIncompleteFace()
// ========================================

// ========================================
// SECTION 7: STEP 0 - TEMPLATE SELECTION
// ========================================
// EXTRACTED to js/orchestrator/orchestrator-steps.js
// Exports: selectCompanyTemplate(companyId), startFreshManual(), startFreshAI(),
//          markStepCompleted(stepNumber)
// ========================================

// ========================================
// SECTION 8: COMPANY LOADING
// ========================================
// EXTRACTED to js/orchestrator/orchestrator-steps.js
// Exports: showCompanyLoadedNotification(mappingContext),
//          hideTemplateGridForPreloadedCompany(mappingContext),
//          resetToTemplateSelection()
// ========================================

// ========================================
// SECTION 9: STEP 1 - FACE CONFIGURATION
// ========================================
// EXTRACTED to js/orchestrator/orchestrator-steps.js
// Exports: populateFaceEditor(), completeStep1(),
//          validateFaces(), getFaceConfiguration()
// ========================================

// ========================================
// SECTION 10: STEP 2 - KPI ENTRY
// ========================================
// EXTRACTED to js/orchestrator/orchestrator-steps.js
// Exports: selectMode(mode), loadKPIMapper(mode), autoFillExtractedKPIs(),
//          setKPIFieldValue(faceId, kpiName, value), showAutoFillNotification(count),
//          generateQuickModeHTML(), generateFullModeHTML(),
//          autofillKPISuggestion(inputElement, faceId),
//          autofillElementalKPI(inputElement, faceId, element),
//          calculateLiveNormalization(faceId), completeStep2()
// ========================================

// ========================================
// SECTION 11: KPI COLLECTION & CALCULATION
// ========================================
// EXTRACTED to js/orchestrator/orchestrator-steps.js
// Exports: collectKPIData(), runCalculation(),
//          calculateSimpleCoherence(kpis), getCoherenceStatus(coherence)
// ========================================

// ========================================
// SECTION 12: STEP 3 - RESULTS DISPLAY
// ========================================
// EXTRACTED to js/orchestrator/orchestrator-steps.js
// Exports: displayCalculationResults(), updateSessionStorage(),
//          displayCalculationTransparency(), completeStep3()
// ========================================

// ========================================
// SECTION 13: OCTAVE DASHBOARD
// ========================================
// EXTRACTED to js/orchestrator/orchestrator-dashboard.js
// Exports: OCTAVE_REFERENCE, initializeCoherenceHero(),
//          initializeOctaveDashboard(), displayFoundationPrincipleWarnings(),
//          detectOctaveFromCoherence()
// ========================================

// ========================================
// SECTION 14: PORTRAIT VIEW
// ========================================
// EXTRACTED to js/orchestrator/orchestrator-dashboard.js
// Exports: initializePortraitView(), transformToPortraitData(),
//          extractElementalData(), detectOctave(), getDefaultElements(),
//          getDefaultFaceName()
// ========================================

// ========================================
// SECTION 15: DIAGNOSTIC ANALYSIS
// ========================================
// EXTRACTED to js/orchestrator/orchestrator-utils.js
// Exports: identifyNervousEndpoints(), identifyHighestLeverageAction()
// ========================================

// ========================================
// SECTION 16: UTILITY FUNCTIONS
// ========================================
// EXTRACTED to js/orchestrator/orchestrator-utils.js
// Exports: launchView(), exportReport(), saveConfiguration(),
//          startOver(), showHelp(), showLoading(), hideLoading()
// ========================================

// ========================================
// WINDOW EXPORTS
// ========================================
//
// All public API exports are now handled by the extracted modules.
// Each module exports its functions to window.* automatically.
//
// See:
// - orchestrator-state.js     → demoState, guards, thresholds
// - orchestrator-session.js   → SessionManager
// - orchestrator-sync.js      → CrossWindowSync
// - orchestrator-navigation.js → goToStep, showValidationBlockDialog, etc.
// - orchestrator-dashboard.js → OCTAVE_REFERENCE, initializeCoherenceHero, etc.
// - orchestrator-utils.js     → launchView, showLoading, etc.
// - orchestrator-steps.js     → selectCompanyTemplate, completeStep1, etc.
//
// ========================================

// ========================================
// INITIALIZATION
// ========================================
// The DOMContentLoaded listener is in orchestrator-navigation.js
// which calls initializeDemo() when the page loads.
// ========================================

console.log('✅ Demo Orchestrator Logic loaded (Phase 3: thin facade)');
