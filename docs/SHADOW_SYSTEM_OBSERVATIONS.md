# Shadow System Observations & Enhancement Opportunities

**Date:** December 21, 2025
**Session:** Shadow System Enhancement (Tracks 1-4)
**Purpose:** Track discrepancies, inconsistencies, and potential improvements discovered during modularization

---

## Observations During This Session

### 1. Inconsistency: Duplicate Shadow Panel Files

**Finding:** There are TWO shadow-panel.js files:
- `js/shadow/ui/shadow-panel.js` (in the shadow module)
- `js/ui/shadow-panel.js` (in general UI folder)

**Concern:** Potential for divergence if both are modified independently.

**Recommendation:** Consolidate to single location (`js/shadow/ui/shadow-panel.js`) and deprecate the other.

---

### 2. Mathematical Enhancement: Tier Boundaries

**Current State:** The three-tier system uses:
- Tier 1: φ⁻² = 0.382
- Tier 2: φ⁻³ = 0.236
- Tier 3: φ⁻⁴ = 0.146

**Observation:** These are penalties, but there's no explicit BOUNDARY between tiers for AI classification.

**Enhancement Opportunity:** Define explicit tier boundaries for AI shadow classification:
```javascript
TIER_BOUNDARIES: {
    TIER_1_MIN: PHI_2,           // 0.382+ is Tier 1 (Human Capital)
    TIER_2_RANGE: [PHI_4, PHI_2], // 0.146 - 0.382 is Tier 2 (Systemic)
    TIER_3_MAX: PHI_4            // <0.146 is Tier 3 (Integrity)
}
```

This would help AI-generated shadows automatically find their tier based on penalty severity.

---

### 3. Philosophical Consideration: Missing "Universal" Source

**Current State:** `activeSource` can be 'template' or 'ai'.

**Observation:** There's a `mode === 'custom-data'` check that sets status text to "universal patterns" but the source system doesn't reflect this.

**Enhancement Opportunity:** Consider adding 'universal' as a third source type for custom company data that doesn't match any template.

---

### 4. Inconsistency: Event Naming

**Finding:** Events use inconsistent naming:
- `'shadows-updated'` (hyphen)
- `'shadow-source-changed'` (hyphen)
- `'focus-face'` (hyphen)

**But also:**
- `aiGenerationStatus` (camelCase property)

**Recommendation:** Standardize on one convention. Suggest: kebab-case for events, camelCase for properties (current pattern seems intentional).

---

### 5. Technical Debt: Legacy `shadowPatterns` Field

**Current State:** sessionStorage stores both:
- `shadowPatterns` (legacy, for backward compatibility)
- `shadowSources` (new, for dual-source)

**Observation:** This creates maintenance overhead. Every save must update both fields.

**Future Task:** After sufficient time has passed, remove `shadowPatterns` legacy support (document migration path first).

---

### 6. Missing Feature: Shadow Priority in AI Generation

**Current State:** AI shadows are generated and cached, but there's no priority sorting.

**Enhancement Opportunity:** Sort AI shadows by:
1. Tier (Tier 1 first - most severe)
2. Gap size (larger gaps first)
3. Confidence score (if AI provides one)

This would ensure the most critical shadows are displayed first.

---

### 7. Potential Bug: Race Condition in AI Generation

**Location:** `generateAIShadows()` in ShadowSourceToggle

**Concern:** If user clicks AI toggle rapidly:
1. First click starts generation (status = 'generating')
2. Second click while first is still running

**Current Mitigation:** None visible - could queue multiple generations.

**Recommendation:** Add guard:
```javascript
if (shadowState.aiGenerationStatus === 'generating') {
    console.log('[ShadowSourceToggle] Generation already in progress');
    return;
}
```

---

### 8. Documentation Gap: Face ID Mapping

**Finding:** Shadows reference faces by ID, but there's no clear documentation of which face ID maps to which domain.

**Enhancement Opportunity:** Add to SHADOW_SYSTEM_ARCHITECTURE.md:
```
FACE ID MAPPING:
1  = Governance
2  = Human Capital
3  = Culture
...
12 = ???
```

---

### 9. CSS Transition Flash (Fixed in Track 4)

**Issue:** Loading text with opacity transition could flash during refresh.

**Resolution:** Added `this.loadingText.textContent = ''` in finally block.

**General Pattern:** When using CSS opacity transitions for visibility, ALWAYS clear content when hiding to prevent flash during DOM operations.

---

### 10. Getter-Only Properties Pattern (Fixed in Track 1)

**Issue:** `Object.assign()` tried to set computed getters (`normalizedScore`, `isComplete`).

**Resolution:** Use selective property assignment with explicit writable property lists.

**General Pattern:** When restoring object state from storage:
1. Identify which properties are computed (getters)
2. Create explicit list of writable properties
3. Only assign writable properties

---

## Future Enhancement Ideas

### A. Shadow Correlation Analysis
- Detect when multiple shadows are related
- Example: burnoutEngine + extractiveGrowth often appear together
- Could provide deeper insight about root causes

### B. Temporal Shadow Tracking
- Track how shadows change over time
- Store historical shadow data
- Show "Shadow trends" graph

### C. Shadow-to-Breath Mapping
- Shadows affect specific breath axes
- Visualize which breath axes are impacted by active shadows

### D. Prescription Validation
- Track which prescriptions were followed
- Measure if shadow intensity decreased
- Feedback loop for AI improvement

---

## Modularization Completion Notes (Track 3)

### Structure Achievement

**Original:** 1,785 lines in `js/dodec/dodec-shadow-overlay.js`
**After:** 6 modules in `js/shadow/overlay/` totaling ~1,990 lines
**Plus:** Thin orchestrator in `js/dodec/dodec-shadow-overlay-orchestrator.js` (~80 lines)

| Module | Lines | Responsibility |
|--------|-------|---------------|
| shadow-state-manager.js | ~230 | State & sessionStorage persistence |
| shadow-card-renderer.js | ~270 | Card HTML generation & interactions |
| shadow-source-toggle.js | ~700 | AI/Template toggle with tooltips |
| shadow-overlay-controller.js | ~280 | Modal open/close/toggle |
| shadow-event-handlers.js | ~230 | Keyboard/mouse event binding |
| shadow-system-integration.js | ~280 | Quannex sync, interval, shadow panel hook |

### Dependency Graph (Verified No Circular Dependencies)

```
ShadowStateManager (foundation - no deps)
       │
       ├──> ShadowCardRenderer
       │           │
       ├──> ShadowSourceToggle ────┐
       │                           │
       └──> ShadowOverlayController <──┘
                   │
       ┌───────────┴───────────┐
       │                       │
ShadowEventHandlers    ShadowSystemIntegration
```

### Future Enhancement: Module Loading

Currently modules load via `<script>` tags in order. Future enhancement could:
1. Convert to ES6 modules with `import`/`export`
2. Use dynamic `import()` for code splitting
3. Add module bundler (Vite/Rollup) for production builds

---

*Last updated: December 21, 2025*
*Session: refactor/shadow-system-enhancement branch*
*Modularization: COMPLETE*
