# Sub-Relationship Chart: Discrepancy & Improvement Tracker

> *Identified during the deep codebase analysis for the Mathematical Interaction Map (2026-02-17)*

**Purpose:** Track discrepancies between documentation and code, missing features, and improvement opportunities discovered during the sub-relationship chart evolution.
**Status Key:** 🔴 Critical | 🟡 Important | 🟢 Enhancement | ✅ Resolved

---

## Discrepancies: Documentation vs. Code

### D1. Edge Model Duality: Two Systems, One Concept 🔴

**Discovered:** Two fundamentally different edge models coexist in the codebase.

**Model A — `js/core/Edge.js` (✅ UNIFIED February 26, 2026):**
```javascript
E_edge = √(E_faceA × E_faceB)  // geometric mean
// Health state via φ-derived boundaries: [φ⁻⁴, φ⁻², φ⁻¹, ψ₄]
```
- 5 states: Wall / Gate / Membrane / Hemorrhage / Vortex (φ-derived)
- Element preserved as metadata, does NOT modify energy value
- No elemental multipliers (eliminated)
- Now aligned with Model B (Pure Membrane Model)

**Model B — `js/edge/unified-edge.js` + `js/constants/sacred-inquiry.js` (the Pure Membrane Model):**
```javascript
E_edge = √(E_faceA × E_faceB)                    // geometric mean
healthState = getHealthState(tension)               // 5 states via tension ranges
synergy = √(FaceA.element × FaceB.element)          // per element
dominantElement = max(all 5 synergies)               // emergent
inquiry = INQUIRY_MATRIX[healthState:dominantElement] // 25-cell matrix
```
- 5 states: Wall / Gate / Membrane / Hemorrhage / Vortex
- Dynamic element emergence from geometric mean
- Element colors the *interpretation* (via Sacred Inquiry), not the *value*
- "Tension" maps to health states through continuous ranges

**Semantic inversion resolved:** Model A now uses geometric mean + φ-derived health states, same as Model B. Both agree: 0.9 = "Vortex" (intense transformation), Membrane [φ⁻², φ⁻¹] is the healthy zone.

**Unified Model (documented in SUB_RELATIONSHIP_CHART.md Section 2B):**
The chart now describes a unified 4-layer edge model:
1. **Edge Energy** = geometric mean (replaces threshold formula)
2. **Health State** = φ-derived boundaries: [φ⁻⁴, φ⁻², φ⁻¹, 1−φ⁻⁴] (replaces arbitrary 4-state system)
3. **Element Emergence** = geometric mean per element (replaces static assignment)
4. **Sacred Inquiry** = 25-cell matrix (already implemented)

**Action Required — Code Evolution Roadmap:**

| Step | File | Change | Effort |
|------|------|--------|--------|
| ~~1~~ | ~~`js/constants/sacred-inquiry.js`~~ | ~~Update health boundaries from [0.15, 0.35, 0.65, 0.85] to [φ⁻⁴, φ⁻², φ⁻¹, 1−φ⁻⁴]~~ | ✅ Done |
| ~~2~~ | ~~`js/core/Edge.js`~~ | ~~Replace `calculateTension()` with geometric mean formula~~ | ✅ Done |
| ~~3~~ | ~~`js/core/Edge.js`~~ | ~~Replace 4-state status with 5-state health mapping (φ-derived boundaries)~~ | ✅ Done |
| ~~4~~ | ~~`js/core/Edge.js`~~ | ~~Remove elemental multipliers (element kept as metadata)~~ | ✅ Done |
| 5 | `js/core/Edge.js` | Rename `tension` → `edgeEnergy` for semantic clarity | Medium (ripple) |
| ~~6~~ | ~~5 files~~ | ~~Update downstream tension thresholds (0.2/0.3/0.4/0.6/0.8) with φ-derived values~~ | ✅ Done |
| 7 | Tests | Verify edge calculations with known Apex Industries values | Low |

**Why this matters for thesis defense:** Steps 1-4 eliminated the core arbitrary constants. Step 6 extended φ-derived boundaries to ALL downstream consumers (5 files, ~15 threshold sites). From Edge.js through edge-analyzer.js through panels/tooltips/materials to AI interpretation — every edge classification now uses φ⁻⁴/φ⁻²/φ⁻¹/ψ₄. "Why these thresholds?" → "Because φ." Remaining Steps 5 and 7 are naming/verification, not mathematical.

---

### D2. Vertex Panel Not Fully Implemented 🔴

**Documentation claims:** Clicking a vertex opens a detail panel.
**Reality:** Only tooltips appear for vertices. No full detail panel like faces have.

**Missing Implementation:**
- No `showVertexDetail()` equivalent to `showFaceDetail()`
- No DOM elements for vertex panels (`#vertexDetailPanel` doesn't exist)
- Vertex data IS computed (3-face convergence, vortex strength, spiral direction)
- Only tooltip display exists in `dodec-tooltips.js`

**Impact:** External partner may expect vertex click interaction. The Sub-Relationship Chart documents what SHOULD happen, not what currently does.

**Action Required:** Implement vertex detail panel in `js/dodec/dodec-panels.js` (mirrors face panel pattern)

---

### D3. Shadow Detection Uses Hardcoded Thresholds, Not Greek Parameters 🟡

**Expected:** Shadow detection should use the 8 Greek parameters (especially δ for shadow integration).
**Reality:** Shadow patterns in the simulator (`sim-scenarios.js`) use hardcoded threshold rules:
```javascript
condition: (e8, e3) => e8 > 0.75 && e3 < 0.40  // Burnout Engine
```

**Impact:** Changing the tuning template (Startup → Enterprise) does NOT change shadow detection sensitivity. The δ parameter affects axis-informed energy but NOT shadow pattern triggering.

**Action Required:** Consider making shadow thresholds parameterized by tuning template.

---

### D4. Spectral Analysis Eigenvectors Are Precomputed 🟢

**Documentation implies:** Dynamic eigenmode calculation.
**Reality:** The Laplacian matrix and eigenvectors are hardcoded in `js/spectral-analyzer.js` (lines 101-133).

**This is correct behavior** — the dodecahedron topology is fixed, so eigenvalues/eigenvectors never change. Only the modal amplitudes (projection of face energies onto eigenvectors) are dynamic.

**Action:** No change needed. Document this as intentional.

---

### D5. Vertex-Edge Topology Inconsistency ✅

**RECONCILED (March 2, 2026) — VERTICES now mathematically derived from EDGES.**

**Discovery:** The 30 EDGES in `dodecahedron-topology.js` and `CSV_Edge_tension_Map.csv` are **identical** (same 30 face pairs). The discrepancy was that 14 of 20 VERTICES referenced face triads where not all three pairs were actual edges. For example, old V2=[1,5,6] required edges E1-5 and E5-6, which don't exist.

**Root cause:** The CSV_Vortex_Map vertex triads were authored using a different dodecahedron face labeling than the edge data. Both are valid dodecahedra, but mixing vertices from one with edges from another is topologically inconsistent.

**Fix applied:**
- Mathematically derived all 20 correct vertices from the 30 EDGES (find all triples (a,b,c) where edges a-b, a-c, b-c all exist)
- Updated `dodecahedron-topology.js` VERTICES (14 of 20 changed)
- Updated `vertex-analyzer.js` fallback definitions
- Added `validateVertexEdgeConsistency()` — runs on page load, will catch any future inconsistency

**Remaining:** CSV_Vortex_Map.csv and vortex-map.json retain old vertex triads (Apex Industries sample data). These are historical and will be regenerated when new organizational data is loaded. Also, vortex-map.json has a separate bug: face IDs are always 1,2,3 regardless of actual vertex — the JSON generator needs fixing.

**Impact:** Vertex calculations now use topologically correct face triads. Every vertex's three faces are genuinely adjacent (share edges with organizational questions and elements).

---

## Missing Features (Identified During Analysis)

### M1. No Unified Relationship View 🔴

**Gap:** There is no single view that shows ALL relationships at once — edges are scattered across face detail panels, vertices appear only as tooltips.

**Proposed:** Build `pages/relationship-explorer.html` — an interactive artifact where the co-founder can navigate the complete sub-relationship network.

**Data availability:** All 128+ relationships are already computed by the engine. This is a UI/visualization task only.

---

### M2. No Manipulation Path Documentation 🟡

**Gap:** No documentation existed showing "change X → Y cascades."

**Action:** ✅ Added Section 5 ("Manipulation Paths") to evolved SUB_RELATIONSHIP_CHART.md with a concrete Human Capital Crisis scenario.

---

### M3. No Worked Examples with Real Numbers 🟡

**Gap:** Original chart described structure but never showed actual calculations with concrete numbers.

**Action:** ✅ Added Section 4 ("Worked Example: Apex Industries") with full calculation traces for Face, Edge, Vertex, Breath Axis, and Global Coherence.

---

### M4. No Edge-Level Recommendations 🟢

**Gap:** The system generates face-level leverage actions and shadow patterns, but does NOT generate edge-specific recommendations like "fix this interface between domains."

**Impact:** When a user clicks an edge and sees high tension, there's no actionable recommendation — only a sacred question.

**Proposed:** Add edge-level insight generation (possibly AI-assisted) that provides specific interface improvement suggestions.

---

### M5. No Temporal/Change Tracking 🟢

**Gap:** No before/after comparison. No trend tracking over time. Each calculation is a snapshot.

**Impact:** Users cannot see "last month our coherence was 78%, now it's 94%."

**Proposed:** Store coherence snapshots in localStorage or backend, show trend lines.

---

### M6. No Direct Edge/Vertex Navigation from Dashboard 🟢

**Gap:** The main dashboard (index.html) only shows face cards. Users must enter the 3D view to click edges or vertices.

**Impact:** The richest relationship data (edges, vertices) requires the most advanced view. A simpler entry point would improve accessibility.

**Proposed:** Add edge tension list and vertex convergence summary to the dashboard.

---

## Points of Improvement for Mathematical Rigor

### R1. Harmonic Resonance Formula Uses Double-Counting ✅

**RESOLVED (March 1, 2026) — Intentional, documented in code.**

**In `js/core/Face.js`:** The harmonic resonance iterates 5 vertices × 2 connections = 10 directed pairs, then divides by 10. Each unique pentagram edge is counted exactly twice. Mathematically: `(2 × Σ_unique) / 10 = Σ_unique / 5` — identical to averaging 5 unique edges.

**Code already has explanatory comments** (Face.js lines 361-363): "5 vertices * 2 connections each = 10, but each edge counted twice = 5 unique edges. We count all 10 for consistency with original formula."

**Impact:** Zero. Math is provably correct. Changing iteration pattern would risk introducing bugs with no benefit.

---

### R2. Global Coherence Rescaling 🟢

**The S-curve (κ=2.0) compresses the operational range.** At κ=2.0:
- Floor: S(0.0) = 0.269
- Ceiling: S(1.0) = 0.731
- Operational range: 0.462

**The system rescales** this back to 0–1, but this means small differences in raw coherence get amplified. A raw change from 0.60 to 0.65 maps to a larger visible change than from 0.40 to 0.45.

**Impact:** Users may perceive the score as non-linear. This is intentional (the S-curve rewards coherence above 50% and penalizes below), but worth documenting for the thesis defense.

---

### R3. Tuning Template vs. Archetype Preset Overlap ✅

**RESOLVED (March 1, 2026) — Documented as intentional two-layer architecture.**

**Two separate systems serving different subsystems:**
1. **Layer 1 — `js/core/TuningConfig.js`** — 8 Greek params (α,β,γ,δ,κ,η,ζ,θ) for the calculation engine. KAPPA range: 1.0–6.0. Used by Face.js, DodecahedronEngine, main.js.
2. **Layer 2 — `js/ai/tuning/archetype-presets.js`** — 5 params (ALPHA,BETA,GAMMA,DELTA,KAPPA) for AI interpretation. KAPPA range: 0–1 (all φ-derived). Used by MappingContext, ArchetypeSelector, AI modules.

**Why the same names have different values:** These are not the same parameters — they serve different mathematical functions in different subsystems. TuningConfig KAPPA controls S-curve steepness for coherence calculation; archetype-presets KAPPA controls curvature for AI narrative generation.

**Documentation added:** Header comment in `archetype-presets.js` now explains the two-layer relationship with explicit cross-references.

---

## Arbitrariness Elimination Map (φ-Purification)

*Identified during systematic confrontation of SUB_RELATIONSHIP_CHART against all documentation and code (February 2026)*

### A1. Vertex System — 6 Arbitrary Constants ✅

**RESOLVED (February 26, 2026) — φ-purified in code across 5 files:**
- `js/core/Vertex.js` — formula, isLeveragePoint, status thresholds
- `js/advanced/vertex-analyzer.js` — strength formula, getVortexType, isLeveragePoint, narrative
- `backend-fallback/models/Vertex.js` — formula, vortexType, isLeveragePoint
- `js/constants/vertex-constants.js` — classifyVertex(), VERTEX_CLASSIFICATIONS criteria
- `js/advanced/visualization-manager.js` — color breakpoint aligned with φ⁻²

| Constant | Was | Now | File(s) |
|----------|-----|-----|---------|
| Variance weight | 0.7 | **φ⁻¹ = 0.618** | Vertex.js, vertex-analyzer.js, backend Vertex.js |
| Mean weight | 0.3 | **φ⁻² = 0.382** | Vertex.js, vertex-analyzer.js, backend Vertex.js |
| Dormant threshold | 0.3 | **φ⁻² = 0.382** | All 5 files |
| Direction threshold | 0.3 | **φ⁻² = 0.382** | All 5 files |
| Leverage strength | 0.7 | **φ⁻¹ = 0.618** | All 5 files |
| Leverage coherence | 0.5 | **φ⁻² = 0.382** | All 5 files |
| Coherence health (4 thresholds) | 0.8/0.6/0.4/0.2 | **ψ₄/φ⁻¹/φ⁻²/φ⁻³** | vertex-analyzer.js, backend Vertex.js |
| Narrative coherence (2 thresholds) | 0.4/0.8 | **φ⁻²/φ⁻¹** | vertex-analyzer.js |

---

### A2. Breath Health Thresholds — 3 Arbitrary Constants ✅

**RESOLVED (February 26, 2026) — φ-purified in code across 4 files:**
- `js/breath-analyzer.js` — canonical: overall status thresholds
- `backend-fallback/models/BreathAnalyzer.js` — backend fallback: overall status thresholds
- `pages/breath-analysis.html` — breath page: color mapping
- `index.html` — dashboard: color mapping

| Constant | Was | Now | File(s) |
|----------|-----|-----|---------|
| Excellent threshold | 0.8 | **ψ₄ = 1−φ⁻⁴ = 0.854** | All 4 files |
| Good threshold | 0.6 | **φ⁻¹ = 0.618** | All 4 files |
| Concerning threshold | 0.4 | **φ⁻² = 0.382** | All 4 files |

---

### A3. Breath Balance Threshold — 1 Arbitrary Constant 🟡

| File | Current | Purpose | φ-Derived | Note |
|------|---------|---------|-----------|------|
| `breath-analyzer.js` | 0.3 (chart) | Balanced breath boundary | **φ⁻² = 0.382** | Code already uses φ⁻² in "normal mode" |

---

### A4. Edge Elemental Multipliers — 5 Arbitrary Constants ✅

**RESOLVED (February 26, 2026) — Eliminated by D1 Steps 2-4.**
`js/core/Edge.js` now uses geometric mean formula. Element is metadata only — does not modify edge energy. Sacred Inquiry handles interpretation (5 health states × 5 elements = 25 inquiry patterns).

| Constant | Was | Now | Resolution |
|----------|-----|-----|-----------|
| Fire multiplier | 1.3 | **Removed** | Geometric mean replaces threshold formula |
| Water multiplier | 0.9 | **Removed** | Element colors interpretation, not value |
| Earth multiplier | 0.8 | **Removed** | Sacred Inquiry handles meaning |
| Air multiplier | 1.1 | **Removed** | Dynamic element emergence in unified-edge |
| Ether multiplier | 1.0 | **Removed** | Was already neutral |

---

### A5. Tuning Template KAPPAs — 4 Arbitrary Constants ✅

**RESOLVED (March 1, 2026) — All 4 KAPPA values φ-derived in `js/core/TuningConfig.js`:**

| Template | Was | Now | Derivation |
|----------|-----|-----|------------|
| Balanced (default) | 2.0 | **φ² = 2.618** | `PHI_HARMONICS.PHI_SQUARED` — balanced responsiveness |
| Startup | 1.5 | **φ = 1.618** | `(1 + Math.sqrt(5)) / 2` — gentle, forgiving |
| Enterprise | 4.0 | **φ³ = 4.236** | `Math.pow(phi, 3)` — sharp, reactive |
| NonDual | 3.0 | **φ² = 2.618** | `phi * phi` — balanced, same as default |

**S-curve operational ranges at φ-derived KAPPA values:**
- κ=φ: S-curve barely bends — nearly linear response (gentle startup growth)
- κ=φ²: Classic sigmoid — meaningful differentiation above/below midpoint
- κ=φ³: Sharp step — strong reward for high coherence, strong penalty for low

---

### A6. Spectral Analysis Thresholds — 5 Arbitrary Constants 🟢

| File | Current | Purpose | φ-Derived Alternative |
|------|---------|---------|----------------------|
| `spectral-analyzer.js:433` | 2.5 | Global imbalance eigenvalue | Align with actual eigenvalue 2.394 |
| `spectral-analyzer.js:435` | 6.0 | Regional pattern eigenvalue | Align with actual eigenvalue 5.584 |
| `spectral-analyzer.js:437` | 7.0 | Local oscillation eigenvalue | Align with actual eigenvalue 6.854 |
| `spectral-analyzer.js:474` | 120% | Over-inhaling percentage | **φ × 100 = 161.8%** |
| `spectral-analyzer.js:475` | 80% | Over-exhaling percentage | **φ⁻¹ × 100 = 61.8%** |

---

### A7. γ (Gamma) Default Value — 1 Discrepancy ✅

**CALCULATION_AUDIT_TRAIL said γ default = 0.6; code uses 0.7.**
**Action:** ✅ Fixed in CALCULATION_AUDIT_TRAIL (February 2026). The 0.6 value was the Startup template, not the default.

---

### A8. Breath Ratio Formula — 3 Conflicting Formulas ✅

Four documents used different breath ratio formulas:

| Source | Formula | Status |
|--------|---------|--------|
| `js/breath-analyzer.js` | `BR = ln(R/P) / ln(φ)` | **CANONICAL (SSOT)** |
| `docs/SUB_RELATIONSHIP_CHART.md` | `BR = ln(R/P) / ln(φ)` | ✅ Aligned |
| `docs/BREATH_AXIS_REFERENCE.md` | `BR = ln(R/P) / ln(φ)` | ✅ **Updated March 1, 2026** |
| `docs/math/CALCULATION_AUDIT_TRAIL.md` | `E_A / (E_A + E_B)` | ⚠️ Different concept (proportion, not ratio) |

**Resolved:** BREATH_AXIS_REFERENCE updated with canonical log-φ formula, φ-derived anchor points, and breath tension definition.

---

### A9. Edge Health Classification — 3 Conflicting Systems ✅

| Source | States | Boundaries | Status |
|--------|--------|-----------|--------|
| `js/core/Edge.js` | 5: Wall/Gate/Membrane/Hemorrhage/Vortex | φ⁻⁴, φ⁻², φ⁻¹, 1−φ⁻⁴ | ✅ **Unified** (February 26, 2026) |
| `js/advanced/edge-analyzer.js` | 5: Flowing/Stable/Stressed/Strained/Breaking | φ⁻⁴, φ⁻², φ⁻¹, 1−φ⁻⁴ | ✅ **φ-derived** (February 26, 2026) |
| `js/constants/sacred-inquiry.js` | 5: Wall/Gate/Membrane/Hemorrhage/Vortex | φ⁻⁴, φ⁻², φ⁻¹, 1−φ⁻⁴ | ✅ **φ-derived** (February 26, 2026) |
| `docs/EDGE_DYNAMICS_REFERENCE.md` | 5: Wall/Gate/Membrane/Hemorrhage/Vortex | φ⁻⁴, φ⁻², φ⁻¹, 1−φ⁻⁴ | ✅ **Updated March 1, 2026** |
| **Unified Model** | 5: Wall/Gate/Membrane/Hemorrhage/Vortex | φ⁻⁴, φ⁻², φ⁻¹, 1−φ⁻⁴ | ✅ **CANONICAL** (documented in chart) |

**Fully resolved.** All code AND documentation now use the unified φ-derived model. Legacy vocabulary moved to collapsible historical reference section in EDGE_DYNAMICS_REFERENCE.md.

---

### Summary: Arbitrariness Score

| Category | Originally | Remaining | Status |
|----------|-----------|-----------|--------|
| Edge system (D1 + A4 + A9) | 12 | **0** | ✅ **All 12 φ-purified in code** (Feb 26): D1 Steps 1-4 done, A4 multipliers eliminated, A9 is documentation only |
| Vertex system (A1) | 12 | **0** | ✅ **All 12 φ-purified in code** (Feb 26): 6 original + 4 coherence health + 2 narrative |
| Breath system (A2 + A3 + A8) | 7 | **1** | ✅ A2 done, A8 done (March 1, 2026). Remaining: A3 balance threshold (chart-only) |
| Tuning KAPPAs (A5) | 4 | **0** | ✅ **All 4 φ-derived** (March 1, 2026): φ/φ²/φ³ progression in TuningConfig.js |
| Spectral analysis (A6) | 5 | 5 | Align with actual eigenvalues + φ |
| Gamma discrepancy (A7) | 1 | **0** | ✅ Fixed |
| **Total** | **41** | **6** | **35 eliminated, 6 remaining** |

**Backend thresholds (not counted above, separate system):**
- `backend-fallback/models/Edge.js`: `healthStatus` (0.2/0.4/0.6/0.8), `getTensionColor()` (0.3/0.6) — 6 constants
- `backend-fallback/models/Dodecahedron.js`: `stressedEdges` filter (0.6) — 1 constant
- These use a different semantic model (tension = stress, KPI-weighted) and are candidates for future φ-alignment if the backend adopts the geometric mean model.

---

## Priority Matrix

| ID | Severity | Effort | Impact | Recommendation |
|----|----------|--------|--------|----------------|
| D1 | 🟡 Steps 5+7 | Low | Low | **Math unified (Steps 1-4 ✅), downstream aligned (Step 6 ✅). Remaining: rename tension→edgeEnergy (Step 5), verify Apex values (Step 7)** |
| A1 | ✅ Resolved | — | — | **Vertex system φ-purified: 6 constants → φ⁻¹/φ⁻² partition (5 code files updated)** |
| A8 | ✅ Resolved | — | — | **Breath formula unified: BREATH_AXIS_REFERENCE updated to canonical log-φ (March 1, 2026)** |
| A9 | ✅ Resolved | — | — | **Edge vocabulary unified: EDGE_DYNAMICS_REFERENCE updated, legacy moved to historical section (March 1, 2026)** |
| D2 | 🔴 Critical | Medium | High | Build vertex detail panels before thesis defense |
| M1 | 🔴 Critical | High | High | Build relationship explorer as interactive artifact |
| A4 | ✅ Resolved | — | — | **Elemental multipliers eliminated: geometric mean formula, element as metadata only** |
| A2 | ✅ Resolved | — | — | **Breath health φ-purified: 3 thresholds → ψ₄/φ⁻¹/φ⁻² (4 files updated)** |
| A5 | ✅ Resolved | — | — | **Tuning KAPPAs φ-derived: φ/φ²/φ³ progression (March 1, 2026)** |
| D3 | 🟡 Important | Low | Medium | Parameterize shadow thresholds by tuning template |
| D5 | ✅ Resolved | — | — | **Topology reconciled: VERTICES derived from EDGES, 14/20 fixed, consistency validator added (March 2, 2026)** |
| R3 | ✅ Resolved | — | — | **Two-layer architecture documented: TuningConfig (engine) vs archetype-presets (AI) (March 1, 2026)** |
| R1 | ✅ Resolved | — | — | **Harmonic resonance math proven correct: 10/10 = 5/5 (March 1, 2026)** |
| A6 | 🟢 Enhancement | Low | Medium | φ-derive spectral analysis thresholds |
| M4 | 🟢 Enhancement | Medium | Medium | Add edge-level recommendations |
| M5 | 🟢 Enhancement | High | Medium | Add temporal tracking |
| M6 | 🟢 Enhancement | Medium | Medium | Add edge/vertex navigation to dashboard |
| R2 | 🟢 Enhancement | Low | Low | Document S-curve rescaling for thesis |
| A7 | ✅ Resolved | — | — | γ default fixed in CALCULATION_AUDIT_TRAIL (0.6 → 0.7) |

---

*Tracked by Claude during deep codebase analysis | February 17, 2026*
*Updated February 19, 2026 — D1 escalated to Critical: edge model duality discovered, unified φ-derived model designed.*
*Updated February 24, 2026 — Full confrontation analysis: added Arbitrariness Elimination Map (A1-A9), 34 arbitrary constants identified, all φ-derived alternatives documented. Fixed γ discrepancy (A7). Added reconciliation notes to EDGE_DYNAMICS_REFERENCE (A9). Unified breath formula declaration (A8).*
*Updated February 26, 2026 — **φ-purification in actual code:** A1 (vertex system, 12 constants across 5 files), D1 Steps 1-4 (edge system unified: geometric mean + φ-derived health states + multipliers eliminated), A2 (breath health thresholds, 3 constants across 4 files), A4 (elemental multipliers eliminated). Arbitrary count: 40 → 12 (70% eliminated). All φ values reference PhiHarmonics SSOT with inline fallback. Tests updated.*
*Updated February 26, 2026 (session 2) — **D1 Step 6: downstream threshold alignment.** 5 files updated with φ-derived boundaries: `dodec-tooltips.js` (4 sites), `dodec-panels.js` (4 sites), `dodec-materials.js` (getTensionColor), `ai-edge-interpreter.js` (generateEdgeSummary), `edge-analyzer.js` (getHealthStatus + getTensionColor + getTensionStats + generateNarrative). All hardcoded 0.2/0.3/0.4/0.6/0.8 thresholds replaced with φ⁻⁴/φ⁻²/φ⁻¹/ψ₄. Full edge pipeline now speaks pure φ from core to visualization.*
*Updated March 1, 2026 — **Deep discrepancy resolution session:** D5 (dual topology audit: CSV vs EDGES documented with full analysis), R1 (harmonic resonance proven correct, marked resolved), A5 (4 KAPPA values φ-derived: φ/φ²/φ³ in TuningConfig.js), R3 (two-layer architecture documented in archetype-presets.js). Added 16 test cases for vortex direction, coherence, leverage points, and breath ratio. Arbitrary count: 40→41 (A5 had 4, not 3) → 6 remaining (85% eliminated).*
*Updated March 2, 2026 — **D5 topology reconciliation:** Discovered CSV_Edge_tension_Map and topology.js EDGES are identical (same 30 edges). The discrepancy was only in VERTICES — 14/20 referenced face triads with non-existent edges. Mathematically derived all 20 correct vertices from the 30 EDGES. Added `validateVertexEdgeConsistency()` to catch future inconsistencies at load time. Also found vortex-map.json has buggy face ID mapping (always uses 1,2,3).*
*Companion to: `docs/SUB_RELATIONSHIP_CHART.md` (evolved)*
