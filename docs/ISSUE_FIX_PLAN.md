# Issue Fix Plan - January 31, 2026

> Generated from comprehensive testing session
> Status: **AUDITED** - Ready for implementation
>
> **See also**: [ISSUE_FIX_AUDIT.md](ISSUE_FIX_AUDIT.md) - 5-Why analysis, pattern analysis, and Gold Standard documentation recommendations

---

## Executive Summary

Testing revealed **9 issues** across the application. Root cause analysis is complete for all critical and medium issues. This document provides the fix plan.

---

## Critical Issues (Must Fix)

### Issue #8: Logger Not Defined in octave-dna.html

**Status**: Root cause identified
**Severity**: CRITICAL - Page completely broken
**Location**: `pages/octave-dna.html`

**Root Cause**:
The Logger utility script (`js/utils/logger.js`) is NOT loaded in `octave-dna.html`. This causes `ReferenceError: Logger is not defined` across 15+ modules.

**Evidence**:
- `dodecahedron-3d.html` loads Logger at line 525 (works correctly)
- `octave-dna.html` never loads Logger (broken)

**Fix**:
Add Logger script as the FIRST script (after Three.js) in `pages/octave-dna.html`:

```html
<!-- After Three.js, BEFORE any other scripts -->
<!-- ════════════════════════════════════════════════════════════════════════
     LOGGER UTILITY - Centralized Logging Control
     Must load early to capture initialization logs from other modules
     ════════════════════════════════════════════════════════════════════════ -->
<script src="../js/utils/logger.js"></script>
```

**Insert at**: Line 171 (after Three.js OrbitControls, before phi-harmonics.js)

---

### Issue #9: BREATH_AXES Redeclaration

**Status**: Root cause identified
**Severity**: CRITICAL - Contributes to page failure
**Location**: Multiple files defining the same constant

**Root Cause**:
`BREATH_AXES` is declared in multiple files, causing `Identifier 'BREATH_AXES' has already been declared`.

**Fix**:
Audit all files that declare `BREATH_AXES` and ensure it's defined once in a single-source-of-truth location (likely `phi-harmonics.js` or a dedicated constants file), then import from there.

**Declarations Found** (4 conflicting):
1. `js/constants/phi-harmonics.js:420` → `const BREATH_AXES = 6;` (number)
2. `js/face-to-breath-mapper.js:15` → `const BREATH_AXES = [...]` (array)
3. `js/geometry/dodecahedron-topology.js:175` → `const BREATH_AXES = [...]` (array)
4. `js/ai/octave-reference-library.js:81` → `const BREATH_AXES = [...]` (array)

**Fix Strategy**:
1. Keep the array definition in `phi-harmonics.js` as SSOT (rename the count to `BREATH_AXIS_COUNT`)
2. Update other files to import from `phi-harmonics.js` or use `PhiHarmonics.BREATH_AXES`
3. Remove duplicate declarations

---

## Medium Issues

### Issue #2: JavaScript Syntax Error - Orphaned else if

**Status**: Root cause identified
**Severity**: MEDIUM - May cause runtime errors
**Location**: `js/orchestrator/orchestrator-dashboard.js:218`

**Root Cause**:
Line 218 has an **extra closing brace `}`** that closes the parent function prematurely, orphaning the `else if` at line 222.

**Current Code (broken)**:
```javascript
// Line 217:     }
// Line 218:     }        // <-- EXTRA BRACE - REMOVE THIS
// Line 219:     // ────────────────
// Line 220:     // FALLBACK...
// Line 221:     // ────────────────
// Line 222:     else if (!state.loadedMappingContext && state.coherenceResults) {
```

**Fix**:
Delete line 218 (the extra `}`).

---

### Issue #6: initializeOctaveDashboard Not a Function

**Status**: Root cause identified
**Severity**: MEDIUM - Dashboard initialization may fail
**Location**: Called from `event-handlers.js:242`, defined in `orchestrator-dashboard.js`

**Root Cause**:
The syntax error in Issue #2 may prevent `orchestrator-dashboard.js` from fully executing, which means `initializeOctaveDashboard` never gets exported to global scope.

**Fix**:
Fixing Issue #2 should resolve this issue as well. After fix, verify the function is correctly exported at line 386.

---

### Issue #7: Coherence Mismatch (39.6% vs 15%)

**Status**: Root cause identified
**Severity**: MEDIUM - Confusing UX
**Location**: `js/ui/portrait-view.js` vs `js/orchestrator/dashboard/coherence-hero.js`

**Root Cause**:
Two different calculation methods are used:

| Component | Calculation Method | Result |
|-----------|-------------------|--------|
| Hero | Direct `globalCoherence` from engine | 39.6% |
| Portrait | Geometric mean of face scores | ~15% |

When many faces have low coherence (< 10%), the geometric mean produces a much lower overall number than the arithmetic mean or direct calculation.

**Fix Options**:

**Option A (Recommended)**: Make Portrait use the same `globalCoherence` value as Hero:
```javascript
// In portrait-view.js, line 526-530, change:
overallCoherence: data.overallCoherence || data.globalCoherence || 0.5

// And pass globalCoherence from the coherenceResults instead of recalculating
```

**Option B**: Add a label explaining the different calculations:
- Hero: "Overall Coherence"
- Portrait: "Geometric Coherence"

---

## Minor Issues

### Issue #1: Missing favicon.ico

**Severity**: LOW - 404 in console, no functional impact
**Location**: Project root

**Fix**:
Add a `favicon.ico` file to the project root, or add this to HTML `<head>`:
```html
<link rel="icon" href="data:,">  <!-- Suppress 404 -->
```

---

### Issue #3: Welcome Page Animation Instability

**Severity**: LOW - Click automation difficult, human users unaffected
**Location**: `welcome.html` card hover animations

**Root Cause**:
CSS animations on card hover make elements "not stable" for automated clicking.

**Fix**:
No fix needed for users. For test automation, use direct navigation or add `will-change: transform` to card CSS.

---

### Issue #4: Placeholder Face Name "Unknown Name"

**Severity**: LOW - Template data quality
**Location**: Nova Tech template, Face 7

**Fix**:
Update `companies/nova-tech/mapping-context.json` to give Face 7 a proper name like "Brand Awareness" or "Market Presence".

---

### Issue #5: Semantic Inversion in Nova Tech Data

**Severity**: LOW - Template data logic
**Location**: Nova Tech template, Face 12

**Problem**:
"Single Point of Failure Count" has:
- Direction: ↑ Higher (should be ↓ Lower)
- Target Ideal: 100 (should be 0)

More failures should be BAD, not good.

**Fix**:
Update the Nova Tech template data to flip the direction and target.

---

## Warning (Self-Healing)

### W1: Shadow Panel Container Auto-Created

**Severity**: INFO - Self-heals, no user impact
**Location**: `dodecahedron-3d.html`

**Message**: `[Shadow:Panel] Container 'shadow-panel-container' not found. Creating one.`

**No fix needed** - the code handles this gracefully by creating the container.

---

## Implementation Priority

| Priority | Issue | Effort | Impact |
|----------|-------|--------|--------|
| 1 | #8 Logger in octave-dna.html | 5 min | DNA Helix page works |
| 2 | #2 Syntax error (extra brace) | 2 min | Dashboard functions work |
| 3 | #9 BREATH_AXES redeclaration | 15 min | Clean console, stability |
| 4 | #7 Coherence mismatch | 10 min | Consistent UX |
| 5 | #1 Favicon | 2 min | Clean console |
| 6 | #4, #5 Template data | 5 min | Better demo experience |

**Total Estimated Effort**: ~40 minutes

---

## Verification Checklist

After fixes, verify:

- [ ] `pages/octave-dna.html` loads without Logger errors
- [ ] DNA Helix visualization renders correctly
- [ ] Demo orchestrator loads without syntax errors
- [ ] Step 4 dashboard initializes correctly
- [ ] Portrait coherence matches Hero coherence
- [ ] No favicon 404 in console
- [ ] Nova Tech Face 7 has proper name
- [ ] Nova Tech Face 12 has correct direction

---

*Co-created by Deimantas & Claude - January 31, 2026*
