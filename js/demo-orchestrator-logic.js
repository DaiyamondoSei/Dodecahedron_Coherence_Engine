/**
 * ════════════════════════════════════════════════════════════════════════════════
 * DEMO ORCHESTRATOR LOGIC - NARRATIVE GUIDE TO THE MODULAR SYSTEM
 * ════════════════════════════════════════════════════════════════════════════════
 *
 * @file demo-orchestrator-logic.js
 * @description THIN FACADE - Navigation document for Demo Orchestrator
 *
 * This file is INTENTIONALLY empty of executable code. It serves as:
 * 1. Navigation map showing module extraction (35+ modules)
 * 2. User journey documentation (Steps 0-4)
 * 3. Architectural reference for Future Claude
 *
 * All actual implementation is in js/orchestrator/[module].js files.
 * This file can be loaded or skipped without affecting functionality.
 *
 * DO NOT add code here. If you need to add functionality, create a new
 * module in js/orchestrator/ and document it in the SECTIONS below.
 *
 * @author Deimantas Murauskas & Claude
 * @version 2.0.0 (Phase 3 Modularization + Phase 5 Documentation)
 * @see {@link ../demo-orchestrator.html} - Main HTML entry point
 * @see {@link ../docs/SYSTEM_ARCHITECTURE.md} - Unified system map
 *
 * ════════════════════════════════════════════════════════════════════════════════
 * NOTES FOR FUTURE CLAUDE - READ THIS FIRST
 * ════════════════════════════════════════════════════════════════════════════════
 *
 * 1. THIS FILE IS A NARRATIVE GUIDE - It contains 0 lines of executable code.
 *    All functionality lives in js/orchestrator/*.js modules.
 *
 * 2. LOADING ORDER MATTERS - The modules must load in this sequence:
 *    state → session → sync → utils → dashboard/* → dashboard → navigation → steps/* → event-handlers
 *    See demo-orchestrator.html for the actual script loading order.
 *
 * 3. ALL MODULES EXPORT TO window.* - NOT ES modules. This enables cross-module
 *    communication and is required for the browser-based architecture.
 *
 * 4. SESSION EXPIRES AFTER 30 MINUTES - SessionManager (orchestrator-session.js)
 *    tracks user activity. Warn users before expiry or save to file.
 *
 * 5. CROSS-WINDOW SYNC via BroadcastChannel - When demo-orchestrator.html updates
 *    demoState, index.html receives the update via orchestrator-sync.js.
 *
 * 6. VALIDATION GATE AT STEP 1→2 - Users CANNOT proceed to Step 2 until all 12
 *    faces are configured. Template flow bypasses this (auto-completes steps 1-3).
 *
 * 7. THREE ENTRY PATHS exist:
 *    - ?path=template → Step 0 (select from 4 demo companies)
 *    - ?path=custom   → Step 1 (manual face configuration)
 *    - ?path=ai       → Step 1 (AI Story Mode via Gemini)
 *
 * 8. MappingContext SYNCS with demoState - Sprint2 AI flow uses MappingContext
 *    which syncs bidirectionally with demoState for face/KPI data.
 *
 * 9. STEP 4 IS SPECIAL - It's the dashboard view (initializeOctaveDashboard),
 *    not a wizard step. It shows coherence hero, octave breakdown, and warnings.
 *
 * 10. FOUNDATION PRINCIPLE ENFORCED - High coherence at O1 = excellent survival,
 *     NOT promotion to O2. See octave-integrity-calculator.js for implementation.
 *
 * ════════════════════════════════════════════════════════════════════════════════
 * USER JOURNEY NAVIGATION MAP
 * ════════════════════════════════════════════════════════════════════════════════
 *
 *   ┌──────────────────────────────────────────────────────────────────────────┐
 *   │                              WELCOME PAGE                                 │
 *   │                     demo-orchestrator.html (initial)                     │
 *   └─────────────────────────────────┬────────────────────────────────────────┘
 *                                     │
 *              ┌──────────────────────┼──────────────────────┐
 *              │                      │                      │
 *              ▼                      ▼                      ▼
 *        ?path=template         ?path=custom           ?path=ai
 *              │                      │                      │
 *              ▼                      ▼                      ▼
 *   ┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐
 *   │    STEP 0        │   │    STEP 1        │   │    STEP 1        │
 *   │ Template Select  │   │  Face Config     │   │   AI Story       │
 *   │                  │   │  (manual entry)  │   │   (via Gemini)   │
 *   │ steps/template-  │   │ steps/face-      │   │ gemini-client.js │
 *   │ selection.js     │   │ configuration.js │   │                  │
 *   └────────┬─────────┘   └────────┬─────────┘   └────────┬─────────┘
 *            │                      │                      │
 *            │   [auto-completes    │                      │
 *            │    steps 1-3]        │                      │
 *            │                      │                      │
 *            ▼                      ▼                      ▼
 *   ┌─────────────────────────────────────────────────────────────────────────┐
 *   │                             STEP 2                                       │
 *   │                          KPI Entry                                       │
 *   │                                                                          │
 *   │    steps/kpi-entry.js (mode selection)                                  │
 *   │    steps/kpi-autofill.js (AI suggestions, live normalization)           │
 *   │                                                                          │
 *   │    Modes: Quick (1 KPI/face) | Full (5 KPIs/face)                       │
 *   └────────────────────────────────────┬────────────────────────────────────┘
 *                                        │
 *                                        ▼
 *   ┌─────────────────────────────────────────────────────────────────────────┐
 *   │                             STEP 3                                       │
 *   │                        Calculate & View                                  │
 *   │                                                                          │
 *   │    steps/calculation-engine.js (collectKPIData, runCalculation)         │
 *   │    steps/results-display.js (displayCalculationResults)                 │
 *   │                                                                          │
 *   │    Uses: main.js → DodecahedronEngine                                   │
 *   │          data-transformer.js → UI→Engine format conversion              │
 *   └────────────────────────────────────┬────────────────────────────────────┘
 *                                        │
 *                                        ▼
 *   ┌─────────────────────────────────────────────────────────────────────────┐
 *   │                             STEP 4                                       │
 *   │                         Octave Dashboard                                 │
 *   │                                                                          │
 *   │    orchestrator-dashboard.js (coordinator)                              │
 *   │    dashboard/coherence-hero.js (main coherence display)                 │
 *   │    dashboard/foundation-principle.js (warnings)                         │
 *   │    dashboard/portrait-view-manager.js (DNA helix view)                  │
 *   │                                                                          │
 *   │    Links to: index.html | dodecahedron-3d.html | breath-analysis.html   │
 *   └─────────────────────────────────────────────────────────────────────────┘
 *
 * ════════════════════════════════════════════════════════════════════════════════
 * MODULE EXTRACTION MAP - WHERE EACH FUNCTION LIVES
 * ════════════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 1: GLOBAL STATE & CONFIG
// ═══════════════════════════════════════════════════════════════════════════════
// EXTRACTED to: js/orchestrator/orchestrator-state.js (162 lines)
//
// EXPORTS:
//   window.demoState                        - Central state object
//   window.isSelectingCompanyTemplate()     - Re-entrancy guard
//   window.setSelectingCompanyTemplate(v)   - Guard setter
//   window.OCTAVE_COHERENCE_THRESHOLDS      - String-keyed thresholds
//   window.OCTAVE_COHERENCE_THRESHOLDS_NUMERIC - Numeric-keyed thresholds
//   window.OrchestratorPHI                  - PHI constant (1.618...)
//
// STATE STRUCTURE:
//   demoState = {
//     currentStep: 0,
//     path: 'template' | 'custom' | 'ai',
//     selectedCompany: null,
//     faceConfig: [],      // 12 face configurations
//     kpiMode: 'quick',    // 'quick' | 'full'
//     kpiData: [],         // Entered KPI values
//     calculationResult: null
//   }
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 2: SESSION MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════
// EXTRACTED to: js/orchestrator/orchestrator-session.js (325 lines)
//
// EXPORTS:
//   window.SessionManager                   - Singleton session manager
//
// KEY BEHAVIORS:
//   - Session expires after 30 minutes of inactivity
//   - Warns user 5 minutes before expiry
//   - Saves state to sessionStorage on activity
//   - Can restore from sessionStorage on page load
//
// USAGE:
//   SessionManager.touch()      // Reset timeout
//   SessionManager.save()       // Save current state
//   SessionManager.restore()    // Load saved state
//   SessionManager.clear()      // Reset session
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 3: CROSS-WINDOW COMMUNICATION
// ═══════════════════════════════════════════════════════════════════════════════
// EXTRACTED to: js/orchestrator/orchestrator-sync.js (201 lines)
//
// EXPORTS:
//   window.CrossWindowSync                  - BroadcastChannel wrapper
//
// EVENT TYPES (OUTGOING):
//   'company-selected'    → Sent when user picks a template company
//   'calculation-complete'→ Sent when coherence calculation finishes
//   'step-changed'        → Sent on navigation between steps
//   'demoState'           → Sent when demoState object changes
//
// EVENT TYPES (INCOMING):
//   'data-loaded'         → From UnifiedDataLoader when company loads
//   'octave-selected'     → From 3D visualization on octave click
//   'demoState'           → From other windows syncing state
//
// USAGE:
//   CrossWindowSync.broadcast('event-name', payload)
//   CrossWindowSync.subscribe('event-name', callback)
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 4: INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════════
// EXTRACTED to: js/orchestrator/orchestrator-navigation.js (503 lines)
//
// EXPORTS:
//   window.initializeDemo()                 - Main entry point
//   window.highlightTemplateOptions()       - UI highlight effect
//
// INITIALIZATION FLOW:
//   1. Check URL params for ?path=... and ?company=...
//   2. Restore session if available
//   3. Set up event listeners (delegated in event-handlers.js)
//   4. Navigate to appropriate step based on path/state
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 5: NAVIGATION & PROGRESS
// ═══════════════════════════════════════════════════════════════════════════════
// EXTRACTED to: js/orchestrator/orchestrator-navigation.js
//
// EXPORTS:
//   window.goToStep(stepNumber)             - Navigate to step 0-4
//   window.updateProgress()                 - Update progress bar UI
//
// NAVIGATION RULES:
//   - Step 0 → 1: Allowed always
//   - Step 1 → 2: BLOCKED unless all 12 faces configured (or template path)
//   - Step 2 → 3: Allowed after KPIs entered
//   - Step 3 → 4: Allowed after calculation complete
//   - Back navigation: Always allowed
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 6: VALIDATION DIALOGS
// ═══════════════════════════════════════════════════════════════════════════════
// EXTRACTED to: js/orchestrator/orchestrator-navigation.js
//
// EXPORTS:
//   window.showValidationBlockDialog()      - Modal for incomplete faces
//   window.closeValidationModal()           - Close modal
//   window.applyDefaultsAndProceed()        - Fill missing with defaults
//   window.focusOnIncompleteFace()          - Scroll to problem face
//
// VALIDATION GATE:
//   Before Step 1 → 2 transition, check:
//   - All 12 faces have names
//   - All 12 faces have octave assignments
//   - If not, show dialog with options:
//     a) Apply defaults (fill missing with sensible values)
//     b) Focus on incomplete (scroll to problem)
//     c) Cancel (stay on Step 1)
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 7: STEP 0 - TEMPLATE SELECTION
// ═══════════════════════════════════════════════════════════════════════════════
// EXTRACTED to: js/orchestrator/steps/template-selection.js
//
// EXPORTS:
//   window.selectCompanyTemplate(companyId) - Select demo company
//
// AVAILABLE TEMPLATES:
//   'quannex'           → O1-O2 Pre-seed (Aspiration-Actuality Gap)
//   'nova-tech'         → O2-O3 Seed (Death Spiral)
//   'zenith-solutions'  → O3-O4 Growth (Organizational Debt)
//   'apex-industries'   → O6-O7 Mature (Integrated Excellence)
//
// TEMPLATE FLOW:
//   1. User clicks template card
//   2. Load mapping-context.json from companies/[id]/
//   3. Auto-fill faceConfig with 12 faces
//   4. Auto-complete Steps 1-3 (bypass manual entry)
//   5. Jump directly to Step 4 (dashboard)
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 8: COMPANY LOADING HELPERS
// ═══════════════════════════════════════════════════════════════════════════════
// EXTRACTED to: js/orchestrator/steps/template-display.js
//
// EXPORTS:
//   window.showCompanyLoadedNotification(ctx)      - Toast notification
//   window.hideTemplateGridForPreloadedCompany(ctx)- Hide template UI
//   window.resetToTemplateSelection()              - Return to selection
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 9: STEP 1 - FACE CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════
// EXTRACTED to: js/orchestrator/steps/face-configuration.js
//
// EXPORTS:
//   window.populateFaceEditor()             - Generate face edit forms
//   window.completeStep1()                  - Validate and proceed
//   window.validateFaces()                  - Check all 12 configured
//   window.getFaceConfiguration()           - Get current faceConfig
//
// FACE CONFIGURATION STRUCTURE:
//   {
//     faceId: 1-12,
//     faceName: "Financial Capital",
//     octave: 1-7,
//     sentiment: 0.0-1.0,
//     elements: { earth, water, fire, air, ether }
//   }
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 10: STEP 2 - KPI ENTRY
// ═══════════════════════════════════════════════════════════════════════════════
// EXTRACTED to: js/orchestrator/steps/kpi-entry.js
//
// EXPORTS:
//   window.selectMode(mode)                 - 'quick' | 'full'
//   window.completeStep2()                  - Validate and proceed
//
// MODES:
//   - Quick Mode: 1 KPI per face (12 total) - fast entry
//   - Full Mode: 5 KPIs per face (60 total) - complete analysis
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 11: KPI AUTOFILL & NORMALIZATION
// ═══════════════════════════════════════════════════════════════════════════════
// EXTRACTED to: js/orchestrator/steps/kpi-autofill.js
//
// EXPORTS:
//   window.autofillKPISuggestion(input, faceId)         - AI-based suggestion
//   window.autofillElementalKPI(input, faceId, element) - Element-based value
//   window.calculateLiveNormalization(faceId)           - Real-time 0-1 score
//
// NORMALIZATION FORMULA:
//   For ↑ direction: normalized = (value - min) / (ideal - min)
//   For ↓ direction: normalized = (max - value) / (max - ideal)
//   For Band: normalized = 1 - |value - midpoint| / (range / 2)
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 12: STEP 3 - CALCULATION ENGINE
// ═══════════════════════════════════════════════════════════════════════════════
// EXTRACTED to: js/orchestrator/steps/calculation-engine.js
//
// EXPORTS:
//   window.collectKPIData()                 - Gather all KPI inputs
//   window.runCalculation()                 - Execute full calculation
//
// CALCULATION FLOW:
//   1. Collect KPI data from forms
//   2. Transform to engine format (data-transformer.js)
//   3. Initialize DodecahedronEngine (main.js)
//   4. Run pentagram analysis (5 elements per face)
//   5. Calculate face energies (12 faces)
//   6. Compute global coherence (weighted average)
//   7. Run breath analysis (6 axes)
//   8. Detect shadow patterns (6 ethical contradictions)
//   9. Return comprehensive result object
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 13: RESULTS DISPLAY
// ═══════════════════════════════════════════════════════════════════════════════
// EXTRACTED to: js/orchestrator/steps/results-display.js
//
// EXPORTS:
//   window.displayCalculationResults()      - Render results UI
//   window.updateSessionStorage()           - Persist for cross-window
//   window.displayCalculationTransparency() - Show formula breakdown
//   window.completeStep3()                  - Proceed to dashboard
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 14: OCTAVE DASHBOARD (STEP 4)
// ═══════════════════════════════════════════════════════════════════════════════
// EXTRACTED to: js/orchestrator/orchestrator-dashboard.js (394 lines, coordinator)
//
// DASHBOARD SUBMODULES (js/orchestrator/dashboard/):
//   octave-utilities.js       (pure utilities)
//   octave-system.js          (OCTAVE_REFERENCE, detection)
//   coherence-hero.js         (main coherence display)
//   foundation-principle.js   (warning displays)
//   portrait-view-manager.js  (DNA helix view)
//   index.js                  (documentation only)
//
// EXPORTS:
//   window.OCTAVE_REFERENCE                 - Octave metadata object
//   window.initializeCoherenceHero()        - Main coherence circle
//   window.initializeOctaveDashboard()      - Full dashboard init
//   window.displayFoundationPrincipleWarnings() - Show warnings
//   window.detectOctaveFromCoherence(c)     - Get octave from 0-1 value
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 15: PORTRAIT VIEW (DNA HELIX)
// ═══════════════════════════════════════════════════════════════════════════════
// EXTRACTED to: js/orchestrator/dashboard/portrait-view-manager.js
//
// EXPORTS:
//   window.initializePortraitView()         - Initialize DNA view
//   window.transformToPortraitData(state)   - Convert state to DNA format
//   window.extractElementalData(face)       - Get 5 elements from face
//   window.getDefaultElements()             - Fallback element values
//   window.getDefaultFaceName(id)           - Fallback face name
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 16: DIAGNOSTIC ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════════
// EXTRACTED to: js/orchestrator/orchestrator-utils.js (392 lines)
//
// EXPORTS:
//   window.identifyNervousEndpoints()       - Find weak points
//   window.identifyHighestLeverageAction()  - Find best intervention
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 17: UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════
// EXTRACTED to: js/orchestrator/orchestrator-utils.js
//
// EXPORTS:
//   window.launchView(viewName)             - Open visualization
//   window.exportReport()                   - Generate PDF/JSON report
//   window.saveConfiguration()              - Save state to file
//   window.startOver()                      - Reset all state
//   window.showHelp()                       - Show help modal
//   window.showLoading()                    - Show loading spinner
//   window.hideLoading()                    - Hide loading spinner
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * QUICK REFERENCE - COMMON QUESTIONS
 * ════════════════════════════════════════════════════════════════════════════════
 *
 * Q: How do I change the current step?
 * A: Use goToStep(n) from orchestrator-navigation.js (line 245)
 *
 * Q: Where is the demoState object?
 * A: orchestrator-state.js (line 45)
 *
 * Q: Why can't I proceed from Step 1 to Step 2?
 * A: Validation gate requires all 12 faces configured. Check showValidationBlockDialog()
 *
 * Q: How do cross-window updates work?
 * A: BroadcastChannel in orchestrator-sync.js. Subscribe with CrossWindowSync.subscribe()
 *
 * Q: Where is the calculation done?
 * A: steps/calculation-engine.js calls main.js → DodecahedronEngine
 *
 * Q: How do I add a new step module?
 * A: Create file in js/orchestrator/steps/, export to window.*, document here
 *
 * ════════════════════════════════════════════════════════════════════════════════
 * RISKS & RECOVERY
 * ════════════════════════════════════════════════════════════════════════════════
 *
 * RISK: Session expires mid-workflow
 * RECOVERY: SessionManager.save() on every state change; restore on page load
 *
 * RISK: Cross-window sync fails
 * SYMPTOMS: Dashboard shows stale data
 * RECOVERY: Manual refresh; check BroadcastChannel support in browser
 *
 * RISK: Validation gate blocks progress incorrectly
 * SYMPTOMS: "Configure all 12 faces" when faces are configured
 * RECOVERY: Check faceConfig array length and structure in console
 *
 * RISK: Template loading fails
 * SYMPTOMS: "Company not found" error
 * RECOVERY: Check companies/[id]/mapping-context.json exists and is valid JSON
 *
 * RISK: Calculation returns NaN/Infinity
 * SYMPTOMS: "NaN%" shown in results
 * RECOVERY: Check KPI values are numeric; check Target_Ideal > Target_Min
 *
 * ════════════════════════════════════════════════════════════════════════════════
 */

Logger.info('OrchestratorLogic', '✅ Demo Orchestrator Logic loaded (Phase 3: thin facade, Phase 5: Gold documentation)');
