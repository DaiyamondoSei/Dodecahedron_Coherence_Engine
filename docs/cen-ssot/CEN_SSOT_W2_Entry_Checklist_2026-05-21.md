# CEN SSOT — Wave 2 Entry Checklist

**Wave:** W2 (xlsx SSOT Build)
**Purpose:** Drop-in-ready entry point when W1 closes and W2 begins
**Date:** 2026-05-21
**Authority:** Lock #8.1 (Path (c) Hybrid build), Lock #8.7 (geometric verification), plan §7

---

## Pre-W2 readiness verification

Before starting W2 build, confirm ALL items below:

### Architectural inputs locked
- [ ] 23 architectural locks captured in Consolidation Map §6.5
- [ ] All 5 W1 audit-trail sections integrated into `POC/docs/math/CALCULATION_AUDIT_TRAIL.md` (§12-16)
- [ ] 437 tests passing baseline (`node POC/tests/run-all.js`)
- [ ] `POC/js/core/Diagnostics.js` canonical AAG implementation in place (Lock #8.15 + §6.2)
- [ ] Chirality → sequenceConcavity rename complete across all 5 company JSONs + vertex-analyzer.js + tests (Lock #8.19)
- [ ] §6.6 F8 provenance template landed (or explicitly deferred with annotation)

### Design specs ready
- [ ] Sheet 14 Spectral_Analysis layout: `Final Thesis/.../spiral-reports/CEN_SSOT_Sheet14_Spectral_Layout_Design_2026-05-21.md`
- [ ] Sheet 16 Dashboard_View layout: `Final Thesis/.../spiral-reports/CEN_SSOT_Sheet16_Dashboard_Layout_Design_2026-05-21.md`
- [ ] v3 KPI mapping (29 face + 4 edge + 1 vertex): `Final Thesis/.../spiral-reports/CEN_SSOT_W06v3_34KPI_QuestionDerived_Mapping_2026-05-21.md`
- [ ] Pure-O1 recomputation: `Final Thesis/.../spiral-reports/CEN_SSOT_PureO1_Recomputation_2026-05-21.md`
- [ ] v0.1 vortex correction diagnosis: `Final Thesis/.../spiral-reports/CEN_v0.1_Vortex_Correction_Diagnosis_2026-05-21.md`

### CEN canonical data
- [ ] CEN canonical O1 face energies confirmed: F1=0.2563 / F6+F12=0.1523 / F4+F5=0.1349 / others=0.1192 (Wall floor); under STRICT: F4+F12 also drop to floor
- [ ] CEN canonical AAG_O1 = 0.789
- [ ] CEN canonical AvG_O1 = 0.0882 (border of "Aggregation distortion" — signals architectural blindness)
- [ ] CEN canonical Spectral: dominantMode=5, BAB=1.136, dissonance=0.178
- [ ] CEN canonical L8 → Vertex V13 (first vertex-KPI)
- [ ] 4 edge-KPIs: BSC.F4→E7-11, BSC.L7→E2-10, BSC.I3→E10-12, BSC.C8→E5-8

---

## W2 build sequence (per plan §7 — Path (c) Hybrid)

### Step W2.0 — Pre-build verification
- [ ] Read this checklist + Sheet 14 + Sheet 16 design docs end-to-end
- [ ] Run `node POC/tests/run-all.js` → 437 passing baseline
- [ ] Verify CEN canonical metrics one more time via direct engine call (sanity check)

### Step W2.1 — Geometric verification (Lock #8.7)
- [ ] Launch local dev server: `npx http-server POC -p 8000`
- [ ] Use Playwright MCP (per §34 empowerment-amplifier): load `pages/dodecahedron-3d.html?company=cen`
- [ ] Screenshot the rendered dodecahedron
- [ ] Programmatically verify: 30 edge IDs match s58 canonical list; 20 vertex IDs match canonical V1-V20; face count = 12
- [ ] Hard gate — geometric pristine accuracy is non-negotiable before any sheet build

### Step W2.2 — Build script scaffold
- [ ] Create `POC/scripts/_build_cen_ssot_xlsx.py` (Python via openpyxl)
- [ ] Architecture per plan §7.E:
  - `--init` mode: build from scratch
  - `--update` mode: refresh from POC engine output
  - `--validate` mode: formula validator only
- [ ] Atomic write via `_staging.xlsx` file (NOT `.tmp` — openpyxl rejects)
- [ ] Idempotent — running twice produces identical output
- [ ] Handle merged-cell + insert_rows safely (per §29 gotchas)

### Step W2.3 — Build sheets in dependency order

Per Lock #8.1 Path (c) Hybrid: rebuild fresh with §33 cascading-formula architecture. v0.1 SpiralDashboard.xlsx is CONTENT reference; structure built fresh.

Build order (each step depends on prior sheets via named ranges):

1. **Sheet 00 Cover_Provenance** — version, integrity attestation, methodology summary, signature
2. **Sheet 0a Naming_Translation** — POC canonical ↔ IIRF universal capital ↔ CEN-authentic mapping table
3. **Sheet 01 Assumptions_Constants** — φ, α=φ⁻¹, β=0.5, γ=0.7, κ=4, λ=φ⁻³, ε_threshold, all named ranges
4. **Sheet 02 CEN_Raw_Inputs** — 34 BSC KPIs + 4-vector face scores (D, E, V_res_pre, V_res_post) — input layer
5. **Sheet 03 Normalization_60Element_Grid** — 12 × 5 × 3 octaves = 180 cells; KPI placements per v3 Procedure C; silent cells zero-filled per zeroEnergy
6. **Sheet 04 Face_Calculations** — pentagramic formula applied per face per octave; uses Diagnostics.js-equivalent formulas in cells
7. **Sheet 05 Star_Pairs** — pentagram skip pairs per face
8. **Sheet 06 Breath_Feedback_Pass2** — axis-informed energy (§3 audit trail)
9. **Sheet 07 Edges** — 30 canonical edges with Edge Energy + Tension + Advanced relative formula (3 parallel columns per Lock #8.5)
10. **Sheet 08 Vertices** — 20 vertices with vortex strength + direction + sequence concavity (renamed!) + leverage detection
11. **Sheet 09 Vertex_KPIs + Bi-Directional Intervention Map** — explicit vertex-KPI subsection (V13 = L8 SDG alignment first vertex-KPI for CEN) + per-Edge 10-tuple Elemental Influence Signatures (30 edges) + per-Vertex 15-tuple Signatures (20 vertices) + Action Simulator block per Lock #8.24. See `Final Thesis/.../spiral-reports/CEN_SSOT_BiDirectional_CoEvolution_Architecture_2026-05-22.md` for design.
12. **Sheet 10 Breath_Axes** — 6 breath axes with polarity scores (D + E + V_res_post per axis) + Axis 5 inversion callout
13. **Sheet 11 Octave_Detection** — both paths + Foundation Principle (per audit trail Appendix C)
14. **Sheet 12 Global_Coherence** — κ·μ·(1-λ·CV) of 12 face energies
15. **Sheet 13 Diagnostics_AAG_AvG** — canonical AAG_O1=0.789 + AvG_O1=0.0882; honest disclosure per audit trail §12 + §16
16. **Sheet 14 Spectral_Analysis** — per Sheet 14 design doc; Δ vector → Performance verdict per face
17. **Sheet 15 Face_Provenance** — F8 provenance template embedded (from §6.6) + provenance trace template for other faces
18. **Sheet 16 Dashboard_View** — per Sheet 16 design doc; set `wb.active` on file-open
19. **Sheet 17 Audit_Trail_Crosslinks** — pointer to `POC/docs/math/CALCULATION_AUDIT_TRAIL.md` sections per cell type
20. **Sheet 18 Adversarial_Findings** — Wave 3 work goes here; placeholder for W2
21. **Sheet 19 Test_Coverage_Matrix** — links Sheet cells → POC test file/case

### Step W2.4 — Formula validator
- [ ] Create `POC/scripts/_validate_cen_ssot_formulas.py` (mirror BDQ Finance_Control_Panel validator)
- [ ] Check: balanced parens, all named ranges referenced exist, no circular refs, no #REF/#NAME/#DIV/0 errors
- [ ] Target: 0 issues

### Step W2.5 — POC engine cross-verification
- [ ] Python script: read CEN raw inputs from `companies/cen/company.json` + `mapping-context.json`
- [ ] Invoke POC engine via Node (headless mode if available, else re-implement in Python)
- [ ] Read xlsx via `openpyxl.load_workbook(p, data_only=True)` to get computed values
- [ ] Compare every named range value to engine output, tolerance 1e-6
- [ ] Report mismatches; partnership-decide on any drift

### Step W2.6 — Visual verification (Playwright)
- [ ] Playwright MCP: load `dodecahedron-3d.html?company=cen`
- [ ] Screenshot the Dashboard_View sheet (via Excel COM or LibreOffice headless)
- [ ] Side-by-side comparison: live web visualization vs xlsx Dashboard_View
- [ ] Numerical consistency check

### Step W2.7 — Wave 2 spiral + partnership discussion
- [ ] Run honest 12-face spiral on xlsx artifact
- [ ] Surface substantive observations (face-by-face)
- [ ] Partnership-decide: lock W2 + enter W3 adversarial pass?

---

## MVP fallback option (per plan §5.5)

If full W2 scope (~32h) infeasible due to time pressure:

**MVP SSOT v0.5** (deliverable after slim build):
- Sheets 00, 0a, 01-06, 11-12, 13 (AAG only, not AvG), 16 Dashboard_View, 17 Audit_Trail_Crosslinks
- 11 audited calculations live
- §13-16 advanced diagnostics deferred to v1.0
- Honest disclosure: "MVP SSOT v0.5 — full v1.0 with advanced diagnostics in progress"
- Effort: ~14h

Decision gate at W2.0: partnership-decide MVP-first or straight-to-full-v1.0.

---

## Critical references (read these during W2)

| Doc | Path | Use |
|---|---|---|
| Plan | `~/.claude/plans/hello-can-you-please-linked-sundae.md` | §5.7 Locks summary, §7 W2 build detail, §11 Risk Register |
| Consolidation Map | `Final Thesis/Thesis Work/spiral-reports/CEN_SSOT_Wave0_Consolidation_Map_2026-05-21.md` | All 23 architectural locks + Section 0 TL;DR |
| Audit Trail | `POC/docs/math/CALCULATION_AUDIT_TRAIL.md` | Sections 1-16 (full math chain); Thesis Defense Quick Reference table |
| Sheet 14 Design | `Final Thesis/.../spiral-reports/CEN_SSOT_Sheet14_Spectral_Layout_Design_2026-05-21.md` | Sheet 14 implementation spec |
| Sheet 16 Design | `Final Thesis/.../spiral-reports/CEN_SSOT_Sheet16_Dashboard_Layout_Design_2026-05-21.md` | Sheet 16 implementation spec |
| v3 Mapping | `Final Thesis/.../spiral-reports/CEN_SSOT_W06v3_34KPI_QuestionDerived_Mapping_2026-05-21.md` | 34 KPI placements (29 face + 4 edge + 1 vertex) |
| Pure-O1 Recomputation | `Final Thesis/.../spiral-reports/CEN_SSOT_PureO1_Recomputation_2026-05-21.md` | Canonical face energies + sibling-blindness three-way distinction |
| Vortex Correction | `Final Thesis/.../spiral-reports/CEN_v0.1_Vortex_Correction_Diagnosis_2026-05-21.md` | What NOT to inherit from v0.1 in Path (c) build |

---

## Honest disclosures for W2

- **F4 + F12 third-sibling pattern is conditional** on strict-O1 normalization. v3 mapping reports canonical S58 values (F4=0.1349, F12=0.1523 — slightly above Wall). Strict-O1 puts them at floor. Sheet 16 displays BOTH readings transparently (per Lock #8.22).
- **Researcher normalization is a methodological choice** documented per Lock #8.9 + audit trail §15. Each element value's normalization rationale should be cell-commented in Sheet 03.
- **mapping-context.json contains narrative-scaffolding fields** (dominantMode, BAB, dissonance, V8 bermuda_triangle label) — per Lock #8.20 + #8.22. The xlsx pulls values from the CANONICAL ENGINE (via Diagnostics.js + spectral-analyzer.js), NOT from the narrative fields. Add "computedAt" provenance metadata to distinguish.
- **AvG_O1 = 0.0882** is the strict-O1 scope; AvG_all = 0.0184 is the all-octave scope. Sheet 13 must label which scope each value uses.

---

## Empowerment tools (Lock #8.34)

For W2:
- **Playwright MCP** — for geometric verification (Lock #8.7) + visual dashboard cross-check (W2.6)
- **openpyxl** — Python xlsx manipulation
- **xlsx skill** — for build patterns + named-ranges schema
- **quannex-branding skill** — for PDF auto-generation at W4

Surface explicitly when reaching for each.

---

## W2 closure gates

W2 closes when:
- [ ] All 21 sheets built + populated
- [ ] Formula validator: 0 issues
- [ ] POC engine cross-verification: all values match to 1e-6
- [ ] Playwright visual check passes
- [ ] Wave 2 spiral honestly run
- [ ] Partnership-discussion completed

Then W3 (Adversarial Pass) begins.

---

**Status:** Drop-in-ready for W2 start. Update this checklist at each W2 step completion.
