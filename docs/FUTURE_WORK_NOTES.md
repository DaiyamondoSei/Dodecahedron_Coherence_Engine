# Future Work Notes

*Observations preserved for future sessions to prevent context loss.*

---

## 1. Thin Orchestrator Pattern Consistency

**Observation Date:** December 27, 2025
**Session Context:** Comprehensive documentation review (12 phases)

### The Pattern

The **Thin Orchestrator Pattern** is beautifully implemented in several files:
- `js/dodec/dodec-shadow-overlay-orchestrator.js` - Pure coordination, ~80 lines
- `js/orchestrator/steps/index.js` - Navigation map with Q&A section
- `js/welcome/welcome-main.js` - Module initialization only

### The Inconsistency

Some older files mix coordination with implementation logic. A future session could:

1. **Audit all orchestrators** - Identify which ones have logic that should be extracted
2. **Apply the pattern consistently** - Orchestrators should ONLY:
   - Initialize modules in correct order
   - Wire up dependencies
   - Expose public API
3. **Document the pattern** - Create `ORCHESTRATOR_PATTERN.md` as authoritative reference

### Files to Review

```
js/dodec/dodec-main.js          - Check if truly thin
js/orchestrator/flow-engine.js  - May contain extractable logic
js/ai/index.js                  - Barrel export, probably fine
```

### Why This Matters

Thin orchestrators are:
- Easier to understand (just coordination, no logic)
- Easier to test (logic lives in focused modules)
- Self-documenting (the imports tell the story)

---

## 2. Sprint Naming Cleanup

**Observation Date:** December 27, 2025

### The Issue

CSS and JS files contain scattered sprint references:
- "Sprint 3.5", "Sprint 5.5", "Sprint 7", "Sprint 9.2"
- No central sprint history document
- Creates confusion for future readers

### Recommended Action

Rather than reconstructing sprint history, **clean up the references**:
1. Replace sprint numbers with descriptive feature names
2. Keep version numbers where meaningful
3. Remove sprint references that add no value

### Example Transformation

```css
/* BEFORE */
/* Sprint 9.2: Staggered card entrance */

/* AFTER */
/* Staggered card entrance animation - cards cascade with PHI-timed delays */
```

---

## 3. Other Observations

*(Add future observations here)*

---

*This file serves as a bridge between sessions. When context is compressed, these insights survive.*
