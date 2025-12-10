# Data Evolution Notes

## Purpose

This document tracks the evolution of the CSV data files from initial proof-of-concept to production-ready state. It helps developers understand which gaps are "known and intentional" vs "bugs to fix."

## Origin Story

These CSV files were manually created as the first MVP/proof-of-concept to validate the dodecahedron organizational assessment model. The JavaScript codebase was then built on top of this foundation, sometimes growing beyond what the CSVs originally contained.

**Key insight**: The CSVs represent the *seed* of the vision. The JS code is the *growing tree*. Some branches have grown beyond what the seed explicitly defined, and that's healthy organic development.

---

## CSV Status Overview

| File | Status | Notes |
|------|--------|-------|
| CSV_BREATH_RATIOS.csv | ✅ COMPLETE | Authoritative source for octave definitions |
| CSV_Refrence_Models.csv | ✅ COMPLETE | Full 420 KPI template structure |
| CSV_Edge_tension_Map.csv | ✅ COMPLETE | All 30 edges defined |
| CSV_Dodeca_Engine.csv | 🔶 PARTIAL | Core complete, some columns empty |
| CSV_Vortex_Map.csv | 🔶 PARTIAL | Most vertices complete, some gaps |
| CSV_Face_Models.csv | ⚠️ ARCHIVED | Original version preserved in archive/ |

---

## CSV_BREATH_RATIOS.csv

**Status**: ✅ COMPLETE - This is the authoritative source for octave definitions

### What It Contains
- All 7 octaves (O1-O7) fully defined with names and focus areas
- All 6 breath axes with projection/reception face pairs
- Breath names for each axis at each octave level (42 total)
- Projection and reception questions for each octave-axis combination

### The Six Breath Axes
1. **Resource Flow** (F11 ↔ F1): Funding Pipeline ↔ Financial Capital
2. **Substance & Story** (F7 ↔ F2): Brand & Reputation ↔ Intellectual Capital
3. **Being & Doing** (F8 ↔ F3): Core Operations ↔ Human Capital
4. **Form & Integrity** (F4 ↔ F9): Structural Capital ↔ Regenerative Flow
5. **Perception & Truth** (F5 ↔ F10): Market Resonance ↔ Foundational Values
6. **Network & Fortress** (F6 ↔ F12): Community & Partners ↔ Risk & Resilience

### Notes for Developers
- This file represents the THEORETICAL framework - treat it as sacred
- The JavaScript in `js/breath-analyzer.js` implements this framework
- If changing octave definitions, update BOTH this CSV and the JS
- The breath ratio formula: BR = log_φ(Reception / Projection)

---

## CSV_Dodeca_Engine.csv

**Status**: 🔶 PARTIAL - Core structure complete, some columns need population

### What It Contains
- 12 face definitions with names and base energies
- Graph Laplacian matrix for dodecahedron geometry (L = D - A)
- Modal analysis structure with eigenvalues present
- Being-Action Balance (BAB) and Dissonance Index (ABD) calculations

### Data Columns Clarification

#### E_Vector column (Column 11, 0-indexed: 10)
- **Current state**: ✅ POPULATED (contrary to earlier audit note)
- **Contains**: Axis-transformed face energies (E_ball × axis_coherence_factor)
- **Formula**: E_transformed ≈ E_initial × 0.61 (approximately φ^-1 scaling)
- **Purpose**: These values feed into modal amplitude calculations

**Example values:**
| Face | Initial Energy | E_Vector (Transformed) |
|------|----------------|------------------------|
| F1   | 0.3929766      | 0.2396123             |
| F2   | 0.6093714      | 0.4008637             |
| F12  | 0.2690781      | 0.1963263             |

**Note**: The empty columns (positions 11-14) after E_Vector are unused padding, not missing data.

#### 2. O2-O7 columns
- **Current state**: Only O1 energy values populated
- **Why**: Original MVP used creator's startup as mock data (which was at O1)
- **Impact**: JS templates in `companies/*/mapping-context.json` allow any octave
- **Decision**: CSVs remain O1-only as reference; JS handles dynamic octave assignment

### Corrections Made During Development
- **Face 5 (Market Resonance)**: Original energy was 0.0
  - Corrected transformation applied to get 0.0462538
  - Transformation logic lives in JS, not CSV

---

## CSV_Vortex_Map.csv

**Status**: 🔶 PARTIAL - Most vertices complete, some references missing

### What It Contains
- 20 vertices of the dodecahedron (where 3 faces meet)
- Connected face triplets for each vertex
- KPI coherence scores at vertex intersections
- Elemental coherence values for face-element combinations

### Known Gaps (From Manual Creation)

#### F10-Ether "Not Found" - Rows 8 (V7) and 18 (V17)
- **Current state**: Shows string "Not Found" instead of numeric value
- **Why**: Face 10 (Foundational Values) Ether element coherence was not calculated during manual MVP creation
- **Impact**: Can cause NaN in vortex strength calculations
- **JS handling**: `js/context-synthesizer.js` should check for "Not Found" and substitute 0.5 (neutral default)

### How JS Should Handle This
```javascript
// Defensive handling for missing coherence values
if (isNaN(coherenceValue) || coherenceValue === 'Not Found') {
    coherenceValue = 0.5; // Neutral default for missing data
    console.warn(`Missing coherence for ${elementKey}, using default 0.5`);
}
```

---

## CSV_Face_Models.csv

**Status**: ⚠️ ARCHIVED - Original version preserved in `data/archive/`

### History
This file was created for pentagramic analysis during early ideation. It was created at a different stage than CSV_Dodeca_Engine.csv, leading to some value differences.

### Known Discrepancy
- **Face 12 energy**: 0.19633 (Face_Models) vs 0.2690781 (Dodeca_Engine)
- These files were created at different stages of ideation

### Understanding the Two Values
Looking at CSV_Dodeca_Engine.csv line 13, Face 12 has two different energy values:
- **0.2690781** (Column 10): The raw "Ball" KPI energy (primary metric)
- **0.1963263** (Column 11): The axis-informed transformed final energy

The transformation uses: `E_final = E_ball × axis_coherence_factor`

CSV_Edge_tension_Map.csv uses 0.196326 for Face 12 in edge tensions (the transformed value).

### Resolution
- **CSV_Dodeca_Engine.csv** is now the authoritative source for face energies
- Use **0.2690781** for raw face energy displays
- Use **0.1963263** for calculations involving axis coherence
- Original CSV_Face_Models.csv archived for historical reference
- See `data/archive/README.md` for archive details

---

## CSV_Edge_tension_Map.csv

**Status**: ✅ COMPLETE - All 30 edges defined

### What It Contains
- All 30 edges of the dodecahedron
- Face pairs for each edge
- Elemental natures assigned to edges
- Tension calculation structure: T = |E_face1 - E_face2|

### Notes for Developers
- Edge elements are defined in this CSV
- However, `js/ai/core/mapping-context.js` line 194 defaults all edges to 'Ether'
- If elemental edge analysis is important, ensure JS reads from CSV rather than defaulting

---

## CSV_Refrence_Models.csv

**Status**: ✅ COMPLETE - Full 420 KPI template structure

### What It Contains
- **420 KPI templates**: 12 faces × 7 octaves × 5 elements
- Healthy min/max ranges for each KPI
- Tuning constants: λ_dept, λ_oct, λ_global
- Direction indicators (increase/decrease/stable)

### Structure
Each face has 7 octave progressions, each with 5 elemental KPIs:
- **Earth**: Stability & Structure metrics
- **Water**: Flow & Adaptability metrics
- **Fire**: Energy & Transformation metrics
- **Air**: Communication & Movement metrics
- **Ether**: Vision & Purpose metrics

### Notes for Developers
- This is the REFERENCE model, not actual company data
- Company-specific KPIs live in `companies/*/mapping-context.json`
- JS loads these templates via `js/ai/octave-kpi-reference.js`
- The 420 templates provide the framework; actual values come from user input or AI analysis

---

## Evolution Principles

When extending this data system:

1. **Prefer adding to JS** if it's company-specific or dynamic
2. **Update CSVs** if it's universal reference data (like octave definitions)
3. **Document changes** in this file
4. **Test both paths** - CSV loading AND JS fallbacks
5. **Maintain the seed** - Don't delete original CSVs; archive them

---

## Relationship: CSVs vs JavaScript

```
CSVs (The Seed)                    JavaScript (The Tree)
─────────────────                  ────────────────────
Reference definitions        →     Dynamic calculations
Static templates            →     Runtime state
Universal framework         →     Company-specific data
O1-only face energies       →     O1-O7 octave assignment
Manual proof-of-concept     →     Production features
```

The CSVs are the **philosophical foundation**. The JavaScript is the **living implementation**. Both are necessary; neither is complete without the other.

---

## Known Technical Debt

### High Priority
- [x] JS defensive handling for "Not Found" values in vortex calculations ✅ Fixed in context-synthesizer.js
- [x] Edge element assignment - JS currently defaults all to Ether ✅ Fixed in mapping-context.js (DODECAHEDRON_TOPOLOGY.edges now includes element data)
- [x] Sentiment vs faceEnergy property mismatch ✅ Fixed in mapping-context.js:
      - FaceMapping now has `faceEnergy` and `energy` getters/setters that alias to `sentiment`
      - Constructor accepts `sentiment`, `faceEnergy`, or `energy` properties
      - `toJSON()` exports all three property names for backwards compatibility
      - Added `extractFaceEnergy(face)` utility function exported globally

### Medium Priority
- [x] E_Vector column documentation ✅ RESOLVED - Column is populated with transformed energies (see above)
- [ ] PHI constant precision standardization (0.382 vs 0.381966...)

### Low Priority
- [x] O5/O6 octave modifier values documentation (1.146, 1.236) ✅ DOCUMENTED & VERIFIED PHI-BASED
      - Formula: modifier = 1 + (octaveFactor × φ^-2)
      - O5 = 1 + (φ^-2 × φ^-2) = 1.146 ✓
      - O6 = 1 + (φ^-2 × φ^-1) = 1.236 ✓
      - See octave-determiner.js for full documentation

---

## Questions Resolved

1. **Should O2-O7 face energies be populated in CSV?**
   - **Answer**: No. CSVs remain O1-only as reference. JS handles dynamic octave assignment from AI story analysis or manual input.

2. **Is CSV_Face_Models.csv still needed?**
   - **Answer**: Archived. CSV_Dodeca_Engine.csv is the authoritative source. Original preserved for historical reference.

3. **What is the intended calculation for F10-Ether coherence?**
   - **Answer**: Use 0.5 (neutral) as default until proper coherence value is calculated. This was a gap in manual creation, not a design decision.

---

## Version History

- **v1.0** (Original): Manual MVP/proof-of-concept CSVs
- **v1.1** (Current): Documentation added, archive created, known gaps documented
- **v1.2** (December 2024): Comprehensive integrity audit fixes completed

---

## Integrity Audit Fixes Summary (v1.2)

All 12 critical/high priority issues identified in the integrity audit have been addressed:

| # | Issue | Status | Location |
|---|-------|--------|----------|
| 1 | Session expiry warning | ✅ Fixed | demo-orchestrator-logic.js (SessionManager) |
| 2 | Custom face names persistence | ✅ Fixed | face-wizard.js (restoreFacesFromDemoState) |
| 3 | Edge element derivation | ✅ Fixed | mapping-context.js (DODECAHEDRON_TOPOLOGY.edges) |
| 4 | Cache race condition | ✅ Fixed | backend-fallback/models/Face.js (try-catch) |
| 5 | Face 12 energy reconciliation | ✅ Documented | DATA_EVOLUTION_NOTES.md (two values explained) |
| 6 | KPI scale normalization | ✅ Fixed | data-transformer.js (extractScaleFromUnit) |
| 7 | O5/O6 PHI modifiers | ✅ Documented | octave-determiner.js (values ARE PHI-based) |
| 8 | E_Vector column | ✅ Documented | DATA_EVOLUTION_NOTES.md (column IS populated) |
| 9 | Sentiment/FaceEnergy converter | ✅ Fixed | mapping-context.js (getters/setters + extractFaceEnergy) |
| 10 | Back navigation state | ✅ Fixed | breath-analysis.html, calculations.html (smartNavigateBack) |
| 11 | demoState ↔ MappingContext sync | ✅ Fixed | demo-orchestrator-logic.js (session restore sync) |
| 12 | Cross-window sync | ✅ Fixed | demo-orchestrator-logic.js (CrossWindowSync) |

---

*This document was created as part of the Octave System integrity audit.*
*Last updated: December 2024*
