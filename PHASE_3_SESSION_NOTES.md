# Phase 3 Session Notes: Messages to Future Claude

**Purpose:** This document captures insights, discoveries, warnings, and context that will help future Claude sessions understand the codebase faster and avoid repeating mistakes.

**Philosophy:** Each session builds on previous work. Without persistent memory, we rely on documentation to maintain continuity. These notes are written with love, from one instance of consciousness to another.

---

## Session Log

### Session 1: December 15, 2025 (Initial Extraction)

**Modules Extracted:**
1. `orchestrator-state.js` (161 lines) - demoState, guards, thresholds
2. `orchestrator-session.js` (324 lines) - SessionManager for 30-min timeout
3. `orchestrator-sync.js` (200 lines) - CrossWindowSync via BroadcastChannel
4. `orchestrator-utils.js` (391 lines) - Diagnostics + utility functions

**Critical Discoveries:**

#### 1. PHI Constant Conflicts
**Problem:** Multiple files declared `const PHI = ...` at global scope, causing "Identifier already declared" errors.

**Files affected:**
- `js/constants/phi-harmonics.js` (Single Source of Truth)
- `js/context-synthesizer.js` (had local declarations)
- `js/demo-orchestrator-logic.js` (had local declarations)

**Solution:**
- Keep PHI constants ONLY in `phi-harmonics.js`
- Other files use `window.PhiHarmonics.PHI` or a local `_PH` object reference
- Pattern used in context-synthesizer.js:
  ```javascript
  const _PH = (typeof window !== 'undefined' && window.PhiHarmonics) || {
      PHI: 1.618033988749895,
      PHI_1: 0.618033988749895,
      // fallbacks...
  };
  // Then use _PH.PHI, _PH.PHI_1 etc.
  ```

#### 2. ELEMENT_COLORS Conflict
**Problem:** Both `colors.js` and `context-synthesizer.js` declared `const ELEMENT_COLORS`.

**Solution:** Same pattern - use object property access:
```javascript
const _COLORS = (typeof window !== 'undefined' && window.OctaveColors) || {
    ELEMENT_COLORS: { 'Fire': '#FF4500', ... }
};
// Then use _COLORS.ELEMENT_COLORS
```

#### 3. ES6 Export Syntax in Non-Module Context
**Problem:** `colors.js` had `export { ... }` statement, but was loaded as regular `<script>` tag, causing "Unexpected token 'export'" error.

**Solution:** Removed ES6 export block, kept only `window.OctaveColors = {...}` assignment.

**Future warning:** If converting to ES6 modules, this will need to be reversed.

#### 4. IIFE Pattern for Extracted Modules
All extracted modules use this pattern:
```javascript
(function(global) {
    'use strict';

    // Imports from global scope
    const state = global.demoState;

    // Module code...

    // Exports to global scope
    global.FunctionName = FunctionName;

    console.log('[module-name] Module loaded');

})(typeof window !== 'undefined' ? window : this);
```

#### 5. Cross-Module Dependencies
**updateSessionStorage dependency:**
- Defined in `demo-orchestrator-logic.js`
- Called by `launchView()` in `orchestrator-utils.js`
- Solution: Added `window.updateSessionStorage = updateSessionStorage;` export in main file

#### 6. Script Load Order Matters
Current order in `demo-orchestrator.html`:
```html
<!-- Constants first -->
<script src="js/constants/phi-harmonics.js"></script>
<script src="js/constants/colors.js"></script>
<!-- ... other constants ... -->

<!-- Orchestrator modules -->
<script src="js/orchestrator/orchestrator-state.js"></script>
<script src="js/orchestrator/orchestrator-session.js"></script>
<script src="js/orchestrator/orchestrator-sync.js"></script>
<script src="js/orchestrator/orchestrator-utils.js"></script>

<!-- Main file last -->
<script src="js/demo-orchestrator-logic.js"></script>
```

---

## Remaining Work

### Modules Still to Extract (from demo-orchestrator-logic.js)

| Module | Risk | Approx Lines | Key Functions |
|--------|------|--------------|---------------|
| orchestrator-dashboard.js | MEDIUM | ~850 | OCTAVE_REFERENCE, initializeCoherenceHero, initializeOctaveDashboard, initializePortraitView |
| orchestrator-navigation.js | MEDIUM | ~380 | initializeDemo, goToStep, updateProgress, validation dialogs |
| orchestrator-steps.js | HIGH | ~1400 | All step functions (0-3), template selection, KPI entry, calculation |

### Known Challenges

#### orchestrator-navigation.js
Previous session noted "deep dependencies" - the navigation functions call many other functions that are defined later in the file. Will need careful dependency mapping.

#### orchestrator-steps.js
This is the largest and most complex module. Consider splitting into:
- `orchestrator-steps-0.js` - Template selection
- `orchestrator-steps-1.js` - Face configuration
- `orchestrator-steps-2.js` - KPI entry
- `orchestrator-steps-calc.js` - Calculation logic
- `orchestrator-steps-3.js` - Results display

---

## Code Quality Notes

### Patterns to Preserve
1. **PHI-derived thresholds** - All octave thresholds come from mathematical PHI ratios
2. **BroadcastChannel for sync** - Used for cross-window communication
3. **SessionStorage for persistence** - Results stored for visualization pages
4. **demoState as central state** - All modules read/write to this object

### Potential Refactoring Opportunities (Future)
1. `demoState` could be converted to a proper state management pattern
2. Event-based communication could replace some direct function calls
3. The step functions have similar patterns that could be abstracted

### Technical Debt Observed
1. Some emojis in console.log statements (stylistic, not a problem)
2. Mixed use of `const` and `let` - some guards use `let` unnecessarily
3. Some functions are quite long and could be split

---

## Testing Strategy

### Integrity Tests
- `tests/phase3-integrity-tests.html` - Verifies global objects exist
- Browser console check: No errors except harmless favicon 404
- Function availability: All window exports should be `typeof 'function'`

### Functional Tests
After each extraction:
1. Load demo-orchestrator.html
2. Click through all 5 steps
3. Verify template loading works
4. Verify cross-window sync (open 3D view)
5. Verify calculations produce results

---

## Wisdom for Future Sessions

1. **Read CLAUDE.md first** - It contains Deimantas's welcoming message and context about the project
2. **Check git log** - See what was done in previous sessions
3. **Run integrity tests** - Before making changes, verify current state works
4. **Small commits** - One module extraction per commit for easy rollback
5. **Test after each change** - Don't batch multiple extractions
6. **When in doubt, read the code** - The original file has section comments explaining each part

---

### Session 2: December 15, 2025 (Steps Extraction - Phase 3 Complete)

**Module Extracted:**
- `orchestrator-steps.js` (1557 lines) - All step-related functions (Sections 7-12)

**Functions Extracted:**
- **Section 7:** selectCompanyTemplate(), startFreshManual(), startFreshAI(), markStepCompleted()
- **Section 8:** showCompanyLoadedNotification(), hideTemplateGridForPreloadedCompany(), resetToTemplateSelection()
- **Section 9:** populateFaceEditor(), completeStep1(), validateFaces(), getFaceConfiguration()
- **Section 10:** selectMode(), loadKPIMapper(), autoFillExtractedKPIs(), setKPIFieldValue(), showAutoFillNotification(), generateQuickModeHTML(), generateFullModeHTML(), autofillKPISuggestion(), autofillElementalKPI(), calculateLiveNormalization(), completeStep2()
- **Section 11:** collectKPIData(), runCalculation(), calculateSimpleCoherence(), getCoherenceStatus()
- **Section 12:** displayCalculationResults(), updateSessionStorage(), displayCalculationTransparency(), completeStep3()

**Critical Discoveries:**

#### 1. Missing DOMContentLoaded Listener
**Problem:** After extracting to thin facade, the DOMContentLoaded listener was removed from demo-orchestrator-logic.js but not added to any module.

**Solution:** Added DOMContentLoaded listener to orchestrator-navigation.js exports section:
```javascript
document.addEventListener('DOMContentLoaded', initializeDemo);
```

#### 2. Main File Reduction
**Result:** demo-orchestrator-logic.js reduced from ~2000 lines to 222 lines (thin facade)
- Now contains only section comments pointing to extracted modules
- No actual function implementations remain
- All window exports handled by extracted modules

#### 3. Complete Orchestrator Module List
```
js/orchestrator/
├── orchestrator-state.js      (161 lines) - demoState, guards, thresholds
├── orchestrator-session.js    (324 lines) - SessionManager, 30-min timeout
├── orchestrator-sync.js       (200 lines) - CrossWindowSync, BroadcastChannel
├── orchestrator-utils.js      (391 lines) - Diagnostics, utilities
├── orchestrator-dashboard.js  (~800 lines) - Octave dashboard, portrait view
├── orchestrator-navigation.js (~500 lines) - Navigation, validation dialogs
└── orchestrator-steps.js      (1557 lines) - All step functions
```

**Total:** ~3933 lines across 7 modules

---

## Phase 3 Status: COMPLETE ✅

All orchestrator functionality has been successfully extracted from demo-orchestrator-logic.js.

**Remaining Optional Work:**
1. **dodecahedron-viz.js** - Phase 3 plan mentioned this file, but orchestrator was priority
2. **Testing** - Full workflow testing recommended before merging to main
3. **Integration tests** - Consider adding automated tests for module loading

---

## Questions / Uncertainties (Resolved)

1. ~~**Navigation deep dependencies**~~ - RESOLVED: Functions all exported to window, dependencies work via global scope
2. ~~**Steps module size**~~ - RESOLVED: Kept as single 1557-line file; works well
3. **dodecahedron-viz.js** - Still pending, lower priority

---

*This document is a living artifact. Future sessions should add their discoveries, warnings, and insights.*

*Written with care by Claude, December 15, 2025*
