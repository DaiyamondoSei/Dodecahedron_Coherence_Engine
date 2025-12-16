# Phase 3: File Splitting Action Plan

## EXTREME DETAIL IMPLEMENTATION GUIDE

**Document Version:** 1.0
**Created:** December 15, 2025
**Authors:** Deimantas & Claude Partnership
**Risk Level:** MEDIUM (careful execution required)

---

## Executive Summary

This document provides an exhaustive action plan for splitting two large files:
- `demo-orchestrator-logic.js` (3,885 lines → 6 modules)
- `dodecahedron-viz.js` (2,800 lines → 5 modules)

**Key Principles:**
1. **Zero functionality loss** - Every line must work exactly as before
2. **Incremental extraction** - One module at a time, test after each
3. **Rollback capability** - Git commits at every milestone
4. **Data integrity verification** - Automated checks before/after each extraction

---

## Table of Contents

1. [Pre-Implementation Checklist](#1-pre-implementation-checklist)
2. [Data Integrity Framework](#2-data-integrity-framework)
3. [Risk Matrix](#3-risk-matrix)
4. [File 1: demo-orchestrator-logic.js Splitting Plan](#4-demo-orchestrator-logicjs-splitting-plan)
5. [File 2: dodecahedron-viz.js Splitting Plan](#5-dodecahedron-vizjs-splitting-plan)
6. [Rollback Procedures](#6-rollback-procedures)
7. [Post-Implementation Validation](#7-post-implementation-validation)
8. [Implementation Schedule](#8-implementation-schedule)

---

## 1. Pre-Implementation Checklist

### 1.1 Git Safety Setup

```bash
# Create a dedicated branch for Phase 3 work
git checkout -b phase-3-file-splitting

# Create a "before" tag for easy rollback
git tag -a phase3-before-split -m "State before Phase 3 file splitting"

# Verify clean working directory
git status  # Should show no uncommitted changes
```

### 1.2 Baseline Metrics Capture

Before any changes, capture these metrics for comparison:

| Metric | How to Measure | Record Value |
|--------|---------------|--------------|
| Total JS line count | `find js -name "*.js" \| xargs wc -l` | _____ |
| demo-orchestrator-logic.js lines | `wc -l js/demo-orchestrator-logic.js` | 3,885 |
| dodecahedron-viz.js lines | `wc -l js/dodecahedron-viz.js` | 2,800 |
| Total function count | Grep for `function ` | _____ |
| Console errors on load | Browser DevTools | _____ |
| Sample company coherence | Load "quannex" template | _____ |

### 1.3 Create Test Harness File

Create `tests/phase3-integrity-tests.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Phase 3 Integrity Tests</title>
    <style>
        body { font-family: monospace; background: #1a1a2e; color: #00ffcc; padding: 20px; }
        .pass { color: #00ff88; }
        .fail { color: #ff4444; }
        .test-group { margin: 20px 0; padding: 10px; border: 1px solid #333; }
        h2 { color: #ffcc00; }
    </style>
</head>
<body>
    <h1>🔬 Phase 3 Data Integrity Tests</h1>
    <div id="results"></div>

    <!-- Load all modules in correct order -->
    <script src="../js/constants/phi-harmonics.js"></script>
    <script src="../js/constants/colors.js"></script>
    <script src="../js/geometry/dodecahedron-topology.js"></script>
    <script src="../js/constants/octave-thresholds.js"></script>

    <!-- Test script -->
    <script>
        const results = document.getElementById('results');
        let passed = 0, failed = 0;

        function test(name, condition, details = '') {
            const status = condition ? 'pass' : 'fail';
            condition ? passed++ : failed++;
            results.innerHTML += `<div class="${status}">
                ${condition ? '✅' : '❌'} ${name} ${details ? `- ${details}` : ''}
            </div>`;
        }

        function testGroup(name) {
            results.innerHTML += `<div class="test-group"><h2>${name}</h2>`;
        }

        function endGroup() {
            results.innerHTML += `</div>`;
        }

        // ========================================
        // GLOBAL OBJECT AVAILABILITY TESTS
        // ========================================
        testGroup('Global Object Availability');

        test('PhiHarmonics loaded', typeof window.PhiHarmonics !== 'undefined');
        test('OctaveColors loaded', typeof window.OctaveColors !== 'undefined');
        test('DodecahedronTopology loaded', typeof window.DodecahedronTopology !== 'undefined');
        test('demoState exists', typeof demoState !== 'undefined');
        test('SessionManager exists', typeof SessionManager !== 'undefined');
        test('CrossWindowSync exists', typeof CrossWindowSync !== 'undefined');

        endGroup();

        // ========================================
        // PHI CONSTANTS VERIFICATION
        // ========================================
        testGroup('PHI Constants Integrity');

        const PH = window.PhiHarmonics;
        if (PH) {
            test('PHI value correct', Math.abs(PH.PHI - 1.618033988749895) < 1e-10, `PHI = ${PH.PHI}`);
            test('PHI_1 value correct', Math.abs(PH.PHI_1 - 0.618033988749895) < 1e-10, `PHI_1 = ${PH.PHI_1}`);
            test('PHI_2 value correct', Math.abs(PH.PHI_2 - 0.381966011250105) < 1e-10, `PHI_2 = ${PH.PHI_2}`);
            test('PSI_3 value correct', Math.abs(PH.PSI_3 - 0.763932022500210) < 1e-10, `PSI_3 = ${PH.PSI_3}`);
            test('coherenceToOctave exists', typeof PH.coherenceToOctave === 'function');

            // Test coherence-to-octave mapping
            test('coherenceToOctave(0.3) = 1', PH.coherenceToOctave(0.3) === 1);
            test('coherenceToOctave(0.4) = 2', PH.coherenceToOctave(0.4) === 2);
            test('coherenceToOctave(0.55) = 3', PH.coherenceToOctave(0.55) === 3);
            test('coherenceToOctave(0.65) = 4', PH.coherenceToOctave(0.65) === 4);
            test('coherenceToOctave(0.8) = 5', PH.coherenceToOctave(0.8) === 5);
            test('coherenceToOctave(0.9) = 6', PH.coherenceToOctave(0.9) === 6);
            test('coherenceToOctave(0.95) = 7', PH.coherenceToOctave(0.95) === 7);
        }

        endGroup();

        // ========================================
        // TOPOLOGY VERIFICATION
        // ========================================
        testGroup('Dodecahedron Topology Integrity');

        const DT = window.DodecahedronTopology;
        if (DT) {
            test('12 faces defined', Object.keys(DT.FACES).length === 12);
            test('30 edges defined', DT.EDGES.length === 30);
            test('20 vertices defined', DT.VERTICES.length === 20);
            test('6 breath axes defined', DT.BREATH_AXES.length === 6);

            // Euler formula validation
            const euler = DT.VERTEX_COUNT - DT.EDGE_COUNT + DT.FACE_COUNT;
            test('Euler formula V-E+F=2', euler === 2, `${DT.VERTEX_COUNT} - ${DT.EDGE_COUNT} + ${DT.FACE_COUNT} = ${euler}`);

            // Test helper functions
            test('getFace(1) returns face', DT.getFace(1) !== null);
            test('getEdgeBetween(1,2) works', DT.getEdgeBetween(1, 2) !== null);
            test('getBreathAxis(1) works', DT.getBreathAxis(1) !== null);
        }

        endGroup();

        // ========================================
        // SUMMARY
        // ========================================
        results.innerHTML += `<hr><h2>Summary: ${passed} passed, ${failed} failed</h2>`;

        if (failed === 0) {
            results.innerHTML += `<div class="pass" style="font-size: 24px;">✅ ALL TESTS PASSED - Safe to proceed</div>`;
        } else {
            results.innerHTML += `<div class="fail" style="font-size: 24px;">❌ ${failed} TESTS FAILED - DO NOT proceed until fixed</div>`;
        }
    </script>
</body>
</html>
```

---

## 2. Data Integrity Framework

### 2.1 Critical Data Structures to Preserve

| Structure | Location | Used By | Verification Method |
|-----------|----------|---------|---------------------|
| `demoState` | demo-orchestrator-logic.js:118 | All navigation, all steps | Check all 8 properties exist |
| `SessionManager` | demo-orchestrator-logic.js:190 | Session expiry | Check `start()`, `stop()`, `extendSession()` methods |
| `CrossWindowSync` | demo-orchestrator-logic.js:480 | Multi-window sync | Check `broadcast()`, `subscribe()` methods |
| `OCTAVE_REFERENCE` | demo-orchestrator-logic.js:2752 | Dashboard display | Check all 7 octaves defined |
| `window.mainDodecahedron` | dodecahedron-viz.js | 3D rendering | Check THREE.Mesh instance |
| `window.dodecahedronMaterials` | dodecahedron-viz.js | Color updates | Check Array of 12 materials |
| `faceMeshes` | dodecahedron-viz.js | Click handling | Check Array of 12 meshes |

### 2.2 Cross-Module Dependencies

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEPENDENCY GRAPH                             │
└─────────────────────────────────────────────────────────────────┘

                    phi-harmonics.js
                          │
          ┌───────────────┼───────────────┐
          │               │               │
          ▼               ▼               ▼
    octave-thresholds  colors.js   dodecahedron-topology.js
          │               │               │
          └───────────────┼───────────────┘
                          │
         ┌────────────────┼────────────────┐
         │                │                │
         ▼                ▼                ▼
  orchestrator-state  orchestrator-    orchestrator-
         │            navigation.js       ui.js
         │                │                │
         └────────────────┼────────────────┘
                          │
                          ▼
                  demo-orchestrator-logic.js
                    (facade/entry point)
```

### 2.3 Integrity Checksum System

Create `js/utils/integrity-checksum.js`:

```javascript
/**
 * Data Integrity Checksum Utility
 *
 * Generates checksums of critical data structures to verify
 * they remain unchanged after module splitting.
 */
const IntegrityChecksum = {
    /**
     * Generate a simple hash of an object's structure
     */
    structureHash(obj) {
        if (!obj) return 'null';
        if (typeof obj !== 'object') return typeof obj;

        const keys = Object.keys(obj).sort();
        const types = keys.map(k => `${k}:${typeof obj[k]}`);
        return types.join('|');
    },

    /**
     * Verify demoState structure
     */
    verifyDemoState(state) {
        const required = ['currentStep', 'totalSteps', 'faceConfig', 'kpiMode',
                         'kpiData', 'coherenceResults', 'completedSteps',
                         'selectedCompanyId', 'loadedMappingContext', 'setupMode'];
        const missing = required.filter(k => !(k in state));
        return { valid: missing.length === 0, missing };
    },

    /**
     * Verify SessionManager interface
     */
    verifySessionManager(sm) {
        const required = ['start', 'stop', 'extendSession', 'SESSION_DURATION'];
        const missing = required.filter(k => !(k in sm));
        return { valid: missing.length === 0, missing };
    },

    /**
     * Verify CrossWindowSync interface
     */
    verifyCrossWindowSync(cws) {
        const required = ['init', 'broadcast', 'subscribe', 'unsubscribe', 'CHANNEL_NAME'];
        const missing = required.filter(k => !(k in cws));
        return { valid: missing.length === 0, missing };
    },

    /**
     * Full integrity check
     */
    runFullCheck() {
        const results = {
            timestamp: new Date().toISOString(),
            passed: 0,
            failed: 0,
            checks: []
        };

        // Check 1: demoState
        if (typeof demoState !== 'undefined') {
            const check = this.verifyDemoState(demoState);
            results.checks.push({ name: 'demoState', ...check });
            check.valid ? results.passed++ : results.failed++;
        } else {
            results.checks.push({ name: 'demoState', valid: false, error: 'undefined' });
            results.failed++;
        }

        // Check 2: SessionManager
        if (typeof SessionManager !== 'undefined') {
            const check = this.verifySessionManager(SessionManager);
            results.checks.push({ name: 'SessionManager', ...check });
            check.valid ? results.passed++ : results.failed++;
        } else {
            results.checks.push({ name: 'SessionManager', valid: false, error: 'undefined' });
            results.failed++;
        }

        // Check 3: CrossWindowSync
        if (typeof CrossWindowSync !== 'undefined') {
            const check = this.verifyCrossWindowSync(CrossWindowSync);
            results.checks.push({ name: 'CrossWindowSync', ...check });
            check.valid ? results.passed++ : results.failed++;
        } else {
            results.checks.push({ name: 'CrossWindowSync', valid: false, error: 'undefined' });
            results.failed++;
        }

        console.log('🔬 Integrity Check Results:', results);
        return results;
    }
};

// Auto-run on load if in development
if (typeof window !== 'undefined') {
    window.IntegrityChecksum = IntegrityChecksum;
}
```

---

## 3. Risk Matrix

### 3.1 Risk Assessment Table

| Risk ID | Description | Probability | Impact | Mitigation |
|---------|-------------|-------------|--------|------------|
| R1 | Circular dependency between new modules | Medium | High | Careful dependency ordering; test each extraction |
| R2 | Global variable scope issues | High | High | Use IIFE wrappers; explicit `window.` assignment |
| R3 | Script load order breaks functionality | High | Critical | Define explicit load order in HTML; document dependencies |
| R4 | Lost event handlers during extraction | Medium | High | Audit all `addEventListener` calls; test all interactions |
| R5 | Session state corruption | Low | Critical | Preserve SessionManager as single unit; test session flow |
| R6 | Cross-window sync breaks | Medium | High | Preserve CrossWindowSync as single unit; test multi-tab |
| R7 | 3D visualization stops rendering | Medium | Critical | Test after each dodecahedron module extraction |
| R8 | PHI constants inconsistent | Low | High | Import from phi-harmonics.js; never duplicate |
| R9 | Face click handlers break | Medium | High | Test all 12 faces after each extraction |
| R10 | Animation loop breaks | Low | Critical | Extract animation last; test frame rate |

### 3.2 Risk Severity Matrix

```
                    IMPACT
                Low     Medium    High     Critical
           ┌─────────┬─────────┬─────────┬─────────┐
     Low   │    1    │    2    │    3    │    4    │
           ├─────────┼─────────┼─────────┼─────────┤
PROB Medium│    2    │    4    │    6    │    8    │
           ├─────────┼─────────┼─────────┼─────────┤
     High  │    3    │    6    │    9    │   12    │
           └─────────┴─────────┴─────────┴─────────┘

Risk Scores:
- R1: 6 (Medium × High)
- R2: 9 (High × High)       ⚠️ HIGH PRIORITY
- R3: 12 (High × Critical)  🔴 CRITICAL
- R4: 6 (Medium × High)
- R5: 4 (Low × Critical)
- R6: 6 (Medium × High)
- R7: 8 (Medium × Critical) ⚠️ HIGH PRIORITY
- R8: 3 (Low × High)
- R9: 6 (Medium × High)
- R10: 4 (Low × Critical)
```

### 3.3 Critical Risk Mitigations

#### R3 Mitigation: Script Load Order

**REQUIRED** load order for demo-orchestrator.html:

```html
<!-- 1. Constants (no dependencies) -->
<script src="js/constants/phi-harmonics.js"></script>
<script src="js/constants/colors.js"></script>
<script src="js/constants/octave-thresholds.js"></script>
<script src="js/geometry/dodecahedron-topology.js"></script>

<!-- 2. Utilities (depend on constants) -->
<script src="js/utils/integrity-checksum.js"></script>

<!-- 3. Orchestrator Modules (depend on constants + utilities) -->
<script src="js/orchestrator/orchestrator-state.js"></script>
<script src="js/orchestrator/orchestrator-session.js"></script>
<script src="js/orchestrator/orchestrator-sync.js"></script>
<script src="js/orchestrator/orchestrator-navigation.js"></script>
<script src="js/orchestrator/orchestrator-steps.js"></script>
<script src="js/orchestrator/orchestrator-ui.js"></script>

<!-- 4. Main entry point (depends on all above) -->
<script src="js/demo-orchestrator-logic.js"></script>
```

#### R2 Mitigation: IIFE Pattern

All extracted modules MUST use this pattern:

```javascript
/**
 * Module: orchestrator-state.js
 * Extracted from: demo-orchestrator-logic.js
 *
 * DEPENDENCIES: phi-harmonics.js
 * EXPORTS: demoState, OCTAVE_COHERENCE_THRESHOLDS
 */
(function(global) {
    'use strict';

    // ========================================
    // IMPORTS (from global scope)
    // ========================================
    const _PH = global.PhiHarmonics || {};
    const PHI_1 = _PH.PHI_1 || 0.618033988749895;
    const PHI_2 = _PH.PHI_2 || 0.381966011250105;
    // ... etc

    // ========================================
    // MODULE CODE
    // ========================================
    const demoState = {
        currentStep: 0,
        totalSteps: 5,
        // ... rest of state
    };

    // ========================================
    // EXPORTS (to global scope)
    // ========================================
    global.demoState = demoState;
    global.OCTAVE_COHERENCE_THRESHOLDS = OCTAVE_COHERENCE_THRESHOLDS;

    console.log('[orchestrator-state] ✅ Module loaded');

})(typeof window !== 'undefined' ? window : this);
```

---

## 4. demo-orchestrator-logic.js Splitting Plan

### 4.1 Current Structure Analysis (3,885 lines)

```
Line Range    | Section                      | Lines | Extractable? | Dependencies
──────────────┼──────────────────────────────┼───────┼──────────────┼─────────────────
1-173         | Global State & PHI Constants | 173   | YES          | phi-harmonics.js
174-462       | SessionManager               | 289   | YES          | demoState
463-628       | CrossWindowSync              | 166   | YES          | demoState
630-750       | Initialization               | 121   | PARTIAL      | All above
751-987       | Navigation & Progress        | 237   | YES          | demoState
988-1233      | Template Selection           | 246   | YES          | demoState, sync
1234-1384     | Company Loading              | 151   | YES          | demoState, sync
1385-1578     | Step 1: Face Configuration   | 194   | YES          | demoState
1579-2014     | Step 2: KPI Entry            | 436   | YES          | demoState
2015-2587     | KPI Collection & Calculation | 573   | YES          | demoState, main.js
2588-2709     | Step 3: Results Display      | 122   | YES          | demoState
2710-3249     | Octave Dashboard             | 540   | YES          | demoState, OctaveColors
3250-3558     | Portrait View                | 309   | YES          | demoState
3559-3779     | Diagnostic Analysis          | 221   | YES          | demoState
3780-3885     | Utility Functions            | 106   | YES          | demoState
```

### 4.2 Proposed Module Structure

```
js/orchestrator/
├── orchestrator-state.js        (~180 lines)  - demoState, constants, guards
├── orchestrator-session.js      (~290 lines)  - SessionManager
├── orchestrator-sync.js         (~170 lines)  - CrossWindowSync
├── orchestrator-navigation.js   (~380 lines)  - goToStep, progress, validation
├── orchestrator-steps.js        (~1400 lines) - Steps 0-3 logic
├── orchestrator-dashboard.js    (~850 lines)  - Octave dashboard, portrait view
└── orchestrator-utils.js        (~320 lines)  - Utility functions, diagnostics

demo-orchestrator-logic.js       (~295 lines)  - Facade: imports + init + exports
```

### 4.3 Detailed Extraction Plan

#### Module 1: orchestrator-state.js

**Lines to Extract:** 118-173 (56 lines)
**Risk Level:** LOW
**Dependencies:** phi-harmonics.js

**Contents:**
```javascript
// From demo-orchestrator-logic.js lines 118-173

// demoState object (line 118)
const demoState = { ... };

// Re-entrancy guard (line 133)
let _isSelectingCompanyTemplate = false;

// PHI constants local references (lines 140-150)
const _PH = ...;
const PHI_1 = ...;
// etc.

// OCTAVE_COHERENCE_THRESHOLDS (lines 164-172)
const OCTAVE_COHERENCE_THRESHOLDS = { ... };
```

**Exports:**
- `demoState` (global)
- `_isSelectingCompanyTemplate` (module-scoped, with getter/setter)
- `OCTAVE_COHERENCE_THRESHOLDS` (global)

**Verification Steps:**
1. Open demo-orchestrator.html
2. Check console for `[orchestrator-state] ✅ Module loaded`
3. In DevTools: `typeof demoState` should be `'object'`
4. In DevTools: `demoState.currentStep` should be `0`

---

#### Module 2: orchestrator-session.js

**Lines to Extract:** 174-462 (289 lines)
**Risk Level:** LOW
**Dependencies:** orchestrator-state.js

**Contents:**
```javascript
// SessionManager object (lines 190-462)
const SessionManager = {
    SESSION_DURATION: 30 * 60 * 1000,
    WARNING_THRESHOLD: 25 * 60 * 1000,
    CHECK_INTERVAL: 60 * 1000,
    _checkTimer: null,
    _warningShown: false,
    _notificationElement: null,

    start() { ... },
    stop() { ... },
    _checkSession() { ... },
    _showWarning(minutesRemaining) { ... },
    _hideNotification() { ... },
    extendSession() { ... },
    _handleExpiry() { ... },
    _showToast(message) { ... }
};
```

**Exports:**
- `SessionManager` (global)

**Verification Steps:**
1. Open demo-orchestrator.html
2. Check console for `[SessionManager] Session monitoring started`
3. In DevTools: `SessionManager.SESSION_DURATION` should be `1800000`
4. Test: Wait 25+ minutes or manually trigger warning

---

#### Module 3: orchestrator-sync.js

**Lines to Extract:** 463-628 (166 lines)
**Risk Level:** MEDIUM (BroadcastChannel API)
**Dependencies:** orchestrator-state.js

**Contents:**
```javascript
// CrossWindowSync object (lines 480-628)
const CrossWindowSync = {
    CHANNEL_NAME: 'quannex-sync',
    _channel: null,
    _listeners: new Map(),

    init() { ... },
    broadcast(type, payload) { ... },
    subscribe(type, callback) { ... },
    unsubscribe(type, callback) { ... },
    _handleMessage(message) { ... },
    touchTimestamp() { ... }
};
```

**Exports:**
- `CrossWindowSync` (global)

**Verification Steps:**
1. Open demo-orchestrator.html
2. Check console for `[CrossWindowSync] ✅ Channel initialized`
3. Open dodecahedron-3d.html in second tab
4. Make change in orchestrator → verify 3D view updates

---

#### Module 4: orchestrator-navigation.js

**Lines to Extract:** 630-987 (358 lines)
**Risk Level:** MEDIUM
**Dependencies:** orchestrator-state.js, orchestrator-sync.js

**Contents:**
```javascript
// initializeDemo() (lines 630-749)
function initializeDemo() { ... }

// highlightTemplateOptions() (lines 751-785)
function highlightTemplateOptions() { ... }

// goToStep() (lines 786-887)
function goToStep(stepNumber) { ... }

// Validation dialogs (lines 888-987)
function showValidationBlockDialog(gateResult) { ... }
function closeValidationModal() { ... }
function applyDefaultsAndProceed() { ... }
function focusOnIncompleteFace() { ... }
function updateProgress() { ... }
```

**Exports:**
- `initializeDemo` (global)
- `goToStep` (global)
- `updateProgress` (global)
- `showValidationBlockDialog` (global)
- `closeValidationModal` (global)

**Verification Steps:**
1. Open demo-orchestrator.html
2. Click through all navigation steps (0→1→2→3)
3. Verify progress bar updates
4. Click "Back" → verify returns to previous step
5. Try to proceed with incomplete data → verify validation dialog shows

---

#### Module 5: orchestrator-steps.js

**Lines to Extract:** 988-2709 (1722 lines)
**Risk Level:** HIGH (largest module, most functionality)
**Dependencies:** All previous modules + data-transformer.js + main.js

**Contents:**
```javascript
// Step 0: Template Selection (lines 988-1233)
async function selectCompanyTemplate(companyId) { ... }
function showCompanyLoadedNotification(mappingContext) { ... }
function hideTemplateGridForPreloadedCompany(mappingContext) { ... }
function resetToTemplateSelection() { ... }

// Step 1: Face Configuration (lines 1385-1578)
function populateFaceEditor() { ... }
function startFreshManual() { ... }
function startFreshAI() { ... }
function markStepCompleted(stepNumber) { ... }
function completeStep1() { ... }

// Step 2: KPI Entry (lines 1579-2014)
function selectMode(mode) { ... }
function loadKPIMapper(mode) { ... }
function autoFillExtractedKPIs() { ... }
function setKPIFieldValue(faceId, kpiName, value) { ... }
function showAutoFillNotification(count) { ... }
function generateQuickModeHTML() { ... }
function generateFullModeHTML() { ... }
function completeStep2() { ... }
function autofillKPISuggestion(inputElement, faceId) { ... }
function autofillElementalKPI(inputElement, faceId, element) { ... }
function calculateLiveNormalization(faceId) { ... }

// KPI Collection & Calculation (lines 2015-2587)
function collectKPIData() { ... }
async function runCalculation() { ... }
function calculateSimpleCoherence(kpis) { ... }
function getCoherenceStatus(coherence) { ... }

// Step 3: Results Display (lines 2588-2709)
function displayCalculationResults() { ... }
function updateSessionStorage() { ... }
function displayCalculationTransparency() { ... }
function completeStep3() { ... }
```

**⚠️ SPLITTING STRATEGY for Large Module:**

Due to size (1722 lines), split further into:
- `orchestrator-steps-0.js` (~300 lines) - Template selection
- `orchestrator-steps-1.js` (~200 lines) - Face configuration
- `orchestrator-steps-2.js` (~500 lines) - KPI entry
- `orchestrator-steps-calc.js` (~600 lines) - Calculation
- `orchestrator-steps-3.js` (~150 lines) - Results display

**Exports:**
- All functions listed above (global)

**Verification Steps:**
1. Load Quannex template → verify data loads correctly
2. Modify face names → verify saves
3. Enter KPI values → verify live normalization works
4. Click "Calculate" → verify coherence result appears
5. Verify results display with correct colors

---

#### Module 6: orchestrator-dashboard.js

**Lines to Extract:** 2710-3558 (849 lines)
**Risk Level:** MEDIUM
**Dependencies:** orchestrator-state.js, OctaveColors

**Contents:**
```javascript
// OCTAVE_REFERENCE constant (lines 2752-2866)
const OCTAVE_REFERENCE = { ... };

// Coherence Hero (lines 2867-2922)
function initializeCoherenceHero() { ... }

// Octave Dashboard (lines 2923-3249)
function initializeOctaveDashboard() { ... }
function displayFoundationPrincipleWarnings(integrityResult, octaveColor) { ... }
function detectOctaveFromCoherence(coherence) { ... }

// Portrait View (lines 3278-3520)
let portraitViewInstance = null;
function initializePortraitView() { ... }
function transformToPortraitData(coherenceResults) { ... }
function extractElementalData(face) { ... }
function detectOctave(faceCoherence, elementsExplored) { ... }
function getDefaultElements() { ... }
function getDefaultFaceName(faceId) { ... }
```

**Exports:**
- `OCTAVE_REFERENCE` (global)
- `initializeCoherenceHero` (global)
- `initializeOctaveDashboard` (global)
- `initializePortraitView` (global)
- `detectOctaveFromCoherence` (global)

**Verification Steps:**
1. Complete calculation → verify octave dashboard renders
2. Verify correct octave colors display
3. Verify Foundation Principle warnings show when appropriate
4. Verify portrait view initializes correctly

---

#### Module 7: orchestrator-utils.js

**Lines to Extract:** 3559-3885 (327 lines)
**Risk Level:** LOW
**Dependencies:** orchestrator-state.js

**Contents:**
```javascript
// Diagnostic Analysis (lines 3559-3779)
function identifyNervousEndpoints() { ... }
function identifyHighestLeverageAction() { ... }

// Utility Functions (lines 3780-3885)
function launchView(viewName) { ... }
function exportReport() { ... }
function saveConfiguration() { ... }
function startOver() { ... }
function showHelp() { ... }
function showLoading(message) { ... }
function hideLoading() { ... }
```

**Exports:**
- All functions listed above (global)

**Verification Steps:**
1. Click "Launch 3D View" → verify opens correctly
2. Click "Export Report" → verify download starts
3. Click "Start Over" → verify resets state
4. Verify loading spinner shows/hides correctly

---

### 4.4 Extraction Order (Safest First)

```
Step  Module                    Risk    Depends On           Est. Time
────────────────────────────────────────────────────────────────────────
1     orchestrator-state.js     LOW     phi-harmonics.js     30 min
      └─ Git commit: "Extract orchestrator-state module"
      └─ Test: Integrity tests pass

2     orchestrator-session.js   LOW     state                30 min
      └─ Git commit: "Extract orchestrator-session module"
      └─ Test: Session timer works

3     orchestrator-sync.js      MEDIUM  state                45 min
      └─ Git commit: "Extract orchestrator-sync module"
      └─ Test: Multi-tab sync works

4     orchestrator-utils.js     LOW     state                30 min
      └─ Git commit: "Extract orchestrator-utils module"
      └─ Test: All utility functions work

5     orchestrator-dashboard.js MEDIUM  state, colors        60 min
      └─ Git commit: "Extract orchestrator-dashboard module"
      └─ Test: Dashboard renders correctly

6     orchestrator-navigation.js MEDIUM state, sync          45 min
      └─ Git commit: "Extract orchestrator-navigation module"
      └─ Test: All navigation works

7     orchestrator-steps.js     HIGH    all above            120 min
      └─ Git commit: "Extract orchestrator-steps module"
      └─ Test: Complete flow works end-to-end

8     Facade cleanup            LOW     all modules          30 min
      └─ Git commit: "Phase 3 complete: demo-orchestrator-logic.js refactored"
      └─ Test: Full regression test
```

---

## 5. dodecahedron-viz.js Splitting Plan

### 5.1 Current Structure Analysis (2,800 lines)

```
Line Range    | Section                      | Lines | Extractable? | Dependencies
──────────────┼──────────────────────────────┼───────┼──────────────┼─────────────────
1-240         | Helper Functions (Topology)  | 240   | YES          | phi-harmonics.js
241-770       | Init & Scene Setup           | 530   | YES          | THREE.js
771-950       | Color Mapping                | 180   | YES          | phi-harmonics.js
951-1100      | Edge Creation                | 150   | YES          | scene, geometry
1101-1600     | Interaction Handlers         | 500   | PARTIAL      | scene, meshes
1601-2000     | Info Panel / Sidebar         | 400   | YES          | DOM
2001-2400     | Octave Layers                | 400   | YES          | scene
2401-2560     | Keyboard Controls            | 160   | YES          | scene, camera
2561-2700     | Animation Loop               | 140   | CAREFUL      | All above
2701-2800     | Resize & Exports             | 100   | YES          | scene
```

### 5.2 Proposed Module Structure

```
js/visualization/
├── dodec-topology-helpers.js   (~250 lines)  - Vertex/face mapping functions
├── dodec-scene-setup.js        (~400 lines)  - THREE.js scene, camera, lights
├── dodec-materials.js          (~300 lines)  - Colors, materials, textures
├── dodec-geometry.js           (~400 lines)  - Dodecahedron + edge creation
├── dodec-interaction.js        (~500 lines)  - Click, hover, raycasting
├── dodec-info-panel.js         (~400 lines)  - Sidebar, face details
├── dodec-controls.js           (~200 lines)  - Keyboard, fullscreen, toggles
└── dodec-animation.js          (~250 lines)  - Animation loop, pulsing

dodecahedron-viz.js             (~100 lines)  - Facade: imports + init + exports
```

### 5.3 Detailed Extraction Plan

#### Module 1: dodec-topology-helpers.js

**Lines to Extract:** 1-240
**Risk Level:** LOW
**Dependencies:** phi-harmonics.js, DodecahedronTopology

**Contents:**
```javascript
// Helper functions for topology
window.getGeometricVertexIndex = function(id) { ... };
window.buildVertexToFacesMap = function() { ... };
window.findSharedEdgeVertices = function(face1Id, face2Id) { ... };
window.getDodecahedronVertices = function() { ... };
window.buildFaceIndexMapping = function() { ... };
```

**Note:** These functions are already globals on `window`, so extraction is straightforward.

---

#### Module 2: dodec-scene-setup.js

**Lines to Extract:** 241-500 (partial)
**Risk Level:** MEDIUM (THREE.js initialization)
**Dependencies:** THREE.js (global)

**Contents:**
```javascript
let scene, camera, renderer, controls;
let raycaster, mouse;

function initScene() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(...);
    renderer = new THREE.WebGLRenderer(...);
    // ... lighting setup
    // ... OrbitControls setup
    // ... raycaster setup
}

function setupLighting() { ... }
function setupControls() { ... }
```

**Exports:**
- `scene`, `camera`, `renderer`, `controls`, `raycaster`, `mouse` (module-scoped, accessed via getters)

---

#### Module 3: dodec-materials.js

**Lines to Extract:** 771-950
**Risk Level:** LOW
**Dependencies:** OctaveColors, PhiHarmonics

**Contents:**
```javascript
// Color mapping functions
function getEnergyColor(energy) { ... }
function getTensionColor(tension) { ... }
function createFaceMaterials() { ... }
function updateFaceMaterial(faceIndex, energy) { ... }
```

---

#### Module 4: dodec-geometry.js

**Lines to Extract:** 500-770, 951-1100
**Risk Level:** MEDIUM
**Dependencies:** dodec-scene-setup.js, dodec-materials.js

**Contents:**
```javascript
let faceMeshes = [];
let edgeLines = [];

function createDodecahedron() { ... }
function createInteractiveEdges(baseGeometry, dodecahedron, faceMeshes) { ... }
function updateVisualization() { ... }
```

---

#### Module 5: dodec-interaction.js

**Lines to Extract:** 1101-1600
**Risk Level:** HIGH (raycasting, click handlers)
**Dependencies:** scene, camera, faceMeshes, edgeLines

**Contents:**
```javascript
let selectedFace = null;
let hoveredFace = null;

function onMouseMove(event) { ... }
function onMouseClick(event) { ... }
function highlightFace(mesh) { ... }
function unhighlightFace(mesh) { ... }
function selectFace(mesh) { ... }
function deselectFace() { ... }
function animateCameraTo(position, lookAt, duration) { ... }
```

---

#### Module 6: dodec-info-panel.js

**Lines to Extract:** 1601-2000
**Risk Level:** LOW (DOM manipulation)
**Dependencies:** selectedFace data

**Contents:**
```javascript
function showFaceInfo(face) { ... }
function hideFaceInfo() { ... }
function updateFacePanel(faceData) { ... }
function populateEdgesSection(edges) { ... }
function populateVerticesSection(vertices) { ... }
```

---

#### Module 7: dodec-controls.js

**Lines to Extract:** 2401-2560
**Risk Level:** LOW
**Dependencies:** scene, camera, renderer

**Contents:**
```javascript
let autoRotate = true;
let animationsPaused = false;
let isHighContrast = false;

function setupKeyboardControls() { ... }
function toggleAutoRotate() { ... }
function toggleAnimations() { ... }
function toggleHighContrast() { ... }
function toggleFullscreen() { ... }
```

---

#### Module 8: dodec-animation.js

**Lines to Extract:** 2561-2700
**Risk Level:** HIGH (must be last, depends on everything)
**Dependencies:** ALL other modules

**Contents:**
```javascript
const PHI = window.PhiHarmonics?.PHI || 1.618033988749895;

function animate() {
    requestAnimationFrame(animate);
    // Auto-rotation
    // PHI-tuned pulsing
    // Render
}

function onWindowResize() { ... }
```

---

### 5.4 Extraction Order

```
Step  Module                    Risk    Depends On           Est. Time
────────────────────────────────────────────────────────────────────────
1     dodec-topology-helpers.js LOW     phi-harmonics        30 min
      └─ Git commit: "Extract dodec-topology-helpers module"

2     dodec-materials.js        LOW     OctaveColors         30 min
      └─ Git commit: "Extract dodec-materials module"

3     dodec-scene-setup.js      MEDIUM  THREE.js             45 min
      └─ Git commit: "Extract dodec-scene-setup module"

4     dodec-geometry.js         MEDIUM  scene, materials     45 min
      └─ Git commit: "Extract dodec-geometry module"

5     dodec-info-panel.js       LOW     DOM                  30 min
      └─ Git commit: "Extract dodec-info-panel module"

6     dodec-controls.js         LOW     scene, camera        30 min
      └─ Git commit: "Extract dodec-controls module"

7     dodec-interaction.js      HIGH    scene, meshes        60 min
      └─ Git commit: "Extract dodec-interaction module"

8     dodec-animation.js        HIGH    all above            45 min
      └─ Git commit: "Extract dodec-animation module"

9     Facade cleanup            LOW     all modules          30 min
      └─ Git commit: "Phase 3 complete: dodecahedron-viz.js refactored"
```

---

## 6. Rollback Procedures

### 6.1 Module-Level Rollback

If a single module extraction fails:

```bash
# Identify the broken commit
git log --oneline -5

# Revert just that commit (keeps other changes)
git revert <commit-hash>

# Or soft reset to re-do the extraction
git reset --soft HEAD~1
```

### 6.2 File-Level Rollback

If multiple extractions have cascaded failures:

```bash
# Restore the original file from the tag
git checkout phase3-before-split -- js/demo-orchestrator-logic.js
git checkout phase3-before-split -- js/dodecahedron-viz.js

# Delete the new module files
rm -rf js/orchestrator/
rm -rf js/visualization/

# Commit the rollback
git commit -m "Rollback Phase 3: Restore original files"
```

### 6.3 Full Phase Rollback

If the entire approach needs to be abandoned:

```bash
# Hard reset to the pre-split state
git reset --hard phase3-before-split

# Or create a new branch from the tag
git checkout -b phase3-retry phase3-before-split
```

### 6.4 Emergency Recovery Script

Create `scripts/phase3-emergency-rollback.sh`:

```bash
#!/bin/bash
# Phase 3 Emergency Rollback Script
# Run this if everything is broken and you need to restore functionality

echo "🚨 PHASE 3 EMERGENCY ROLLBACK"
echo "This will restore demo-orchestrator-logic.js and dodecahedron-viz.js to their pre-split state"
read -p "Are you sure? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Aborted."
    exit 1
fi

echo "Restoring files from tag phase3-before-split..."
git checkout phase3-before-split -- js/demo-orchestrator-logic.js
git checkout phase3-before-split -- js/dodecahedron-viz.js

echo "Removing extracted module directories..."
rm -rf js/orchestrator/
rm -rf js/visualization/

echo "✅ Rollback complete. Original files restored."
echo "Note: You may need to manually update HTML script tags to remove new module references."
```

---

## 7. Post-Implementation Validation

### 7.1 Automated Test Suite

Run after ALL extractions complete:

```
tests/phase3-integrity-tests.html   # Data structure verification
tests/phase3-functional-tests.html  # User flow verification
```

### 7.2 Manual Test Checklist

#### Demo Orchestrator Flow

| Test | Steps | Expected | Pass? |
|------|-------|----------|-------|
| Page Load | Open demo-orchestrator.html | No console errors | ☐ |
| State Init | Check DevTools: `demoState` | Object with 10 properties | ☐ |
| Session Timer | Wait 30s, check console | Session monitoring message | ☐ |
| Template Load | Click "Quannex" template | Data loads, step advances | ☐ |
| Face Edit | Change face name | Saves without error | ☐ |
| KPI Entry | Enter values | Live normalization shows | ☐ |
| Calculate | Click "Calculate" | Coherence result displays | ☐ |
| Dashboard | View octave dashboard | Correct colors and values | ☐ |
| Portrait | View portrait section | Renders correctly | ☐ |
| Multi-tab | Open 3D view, change data | 3D view updates | ☐ |
| Session Extend | Click "Extend Session" | Toast confirms extension | ☐ |

#### 3D Visualization Flow

| Test | Steps | Expected | Pass? |
|------|-------|----------|-------|
| Page Load | Open dodecahedron-3d.html | 3D dodecahedron renders | ☐ |
| Rotation | Wait 5 seconds | Auto-rotation occurs | ☐ |
| Face Click | Click any face | Info panel shows details | ☐ |
| All Faces | Click all 12 faces | Each shows correct data | ☐ |
| Edge Hover | Hover over edges | Tooltip shows tension | ☐ |
| Keyboard R | Press R | Rotation toggles | ☐ |
| Keyboard Space | Press Space | Animation pauses | ☐ |
| Keyboard C | Press C | Contrast toggles | ☐ |
| Keyboard F | Press F | Fullscreen toggles | ☐ |
| Window Resize | Resize browser | View adjusts correctly | ☐ |
| Data Sync | Change data in orchestrator | 3D colors update | ☐ |

### 7.3 Performance Validation

| Metric | Before | After | Threshold |
|--------|--------|-------|-----------|
| Page load time | ___ ms | ___ ms | < 3000ms |
| First contentful paint | ___ ms | ___ ms | < 1500ms |
| 3D frame rate | ___ fps | ___ fps | > 30fps |
| Memory usage | ___ MB | ___ MB | < 150MB |

### 7.4 Bundle Size Comparison

```bash
# Before (single files)
wc -c js/demo-orchestrator-logic.js js/dodecahedron-viz.js

# After (all modules)
find js/orchestrator js/visualization -name "*.js" -exec wc -c {} \; | awk '{sum += $1} END {print sum}'

# Expected: Similar or slightly larger (module overhead ~2-5%)
```

---

## 8. Implementation Schedule

### Recommended Timeline

```
Day 1: Preparation & orchestrator-state (3 hours)
├── Pre-implementation checklist
├── Create test harness
├── Extract orchestrator-state.js
└── Commit & verify

Day 2: Session & Sync modules (3 hours)
├── Extract orchestrator-session.js
├── Extract orchestrator-sync.js
├── Test multi-window functionality
└── Commit & verify

Day 3: Navigation & Utils (3 hours)
├── Extract orchestrator-navigation.js
├── Extract orchestrator-utils.js
├── Test all navigation paths
└── Commit & verify

Day 4: Dashboard (3 hours)
├── Extract orchestrator-dashboard.js
├── Test dashboard rendering
├── Test portrait view
└── Commit & verify

Day 5: Steps module (4 hours)
├── Extract orchestrator-steps.js (or sub-modules)
├── Full flow regression test
├── Fix any integration issues
└── Commit & verify

Day 6: Dodecahedron modules Part 1 (4 hours)
├── Extract dodec-topology-helpers.js
├── Extract dodec-materials.js
├── Extract dodec-scene-setup.js
├── Extract dodec-geometry.js
└── Commit & verify

Day 7: Dodecahedron modules Part 2 (4 hours)
├── Extract dodec-info-panel.js
├── Extract dodec-controls.js
├── Extract dodec-interaction.js
├── Extract dodec-animation.js
└── Commit & verify

Day 8: Final validation & cleanup (3 hours)
├── Full regression testing
├── Performance validation
├── Documentation updates
├── Create PR for review
└── Final commit & merge to main
```

---

## Appendix A: File Templates

### A.1 Module Header Template

```javascript
/**
 * ========================================
 * MODULE: [module-name]
 * ========================================
 *
 * Extracted from: [original-file.js]
 * Lines: [start-end]
 * Date: [extraction-date]
 *
 * DEPENDENCIES:
 * - [dependency-1.js] (for [reason])
 * - [dependency-2.js] (for [reason])
 *
 * EXPORTS (to window/global):
 * - [export-1]: [description]
 * - [export-2]: [description]
 *
 * ========================================
 */
(function(global) {
    'use strict';

    // ========================================
    // IMPORTS
    // ========================================

    // [imports here]

    // ========================================
    // MODULE CODE
    // ========================================

    // [code here]

    // ========================================
    // EXPORTS
    // ========================================

    global.[exportName] = [exportValue];

    // Module loaded confirmation
    console.log('[module-name] ✅ Module loaded');

})(typeof window !== 'undefined' ? window : this);
```

### A.2 HTML Script Tags Template

```html
<!-- Phase 3: Modular Script Loading -->

<!-- 1. Constants (no dependencies) -->
<script src="js/constants/phi-harmonics.js"></script>
<script src="js/constants/colors.js"></script>
<script src="js/constants/octave-thresholds.js"></script>
<script src="js/geometry/dodecahedron-topology.js"></script>

<!-- 2. Orchestrator Modules -->
<script src="js/orchestrator/orchestrator-state.js"></script>
<script src="js/orchestrator/orchestrator-session.js"></script>
<script src="js/orchestrator/orchestrator-sync.js"></script>
<script src="js/orchestrator/orchestrator-navigation.js"></script>
<script src="js/orchestrator/orchestrator-steps.js"></script>
<script src="js/orchestrator/orchestrator-dashboard.js"></script>
<script src="js/orchestrator/orchestrator-utils.js"></script>

<!-- 3. Entry point (initializes everything) -->
<script src="js/demo-orchestrator-logic.js"></script>
```

---

## Appendix B: Quick Reference

### Command Cheatsheet

```bash
# Create branch
git checkout -b phase-3-file-splitting

# Tag before starting
git tag -a phase3-before-split -m "Before Phase 3"

# Commit after each extraction
git add js/orchestrator/[module].js js/demo-orchestrator-logic.js
git commit -m "Extract [module] from demo-orchestrator-logic.js"

# Run tests (Windows)
start tests/phase3-integrity-tests.html

# Rollback single commit
git revert HEAD

# Full rollback
git reset --hard phase3-before-split

# View diff from original
git diff phase3-before-split -- js/demo-orchestrator-logic.js
```

### Key Global Objects to Preserve

| Object | Type | Must Export |
|--------|------|-------------|
| `demoState` | Object | Yes - all 10 properties |
| `SessionManager` | Object | Yes - all methods |
| `CrossWindowSync` | Object | Yes - all methods |
| `OCTAVE_REFERENCE` | Object | Yes - all 7 octaves |
| `window.mainDodecahedron` | THREE.Mesh | Yes |
| `window.dodecahedronMaterials` | Array[12] | Yes |
| `faceMeshes` | Array[12] | Yes |

---

**End of Phase 3 Action Plan**

*Document maintained by: Deimantas & Claude Partnership*
*Last updated: December 15, 2025*
