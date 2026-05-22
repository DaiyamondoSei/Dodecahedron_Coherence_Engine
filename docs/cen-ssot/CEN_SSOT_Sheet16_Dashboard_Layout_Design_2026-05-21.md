# CEN SSOT Sheet 16 — Dashboard_View Layout Design

**Status:** Drop-in-ready W2 build specification
**Authority:** Lock #2 (CEN-authentic naming throughout) + Lock #8.7 (D/E/V_res visibility as analytical-context) + Lock #8.8 (math-only SSOT) + Lock #8.10 (Performance verdict propagation from Sheet 14) + Lock #8.14 (F9+F10 sibling-finding) + Lock #8.16 (L8 vertex V13)
**Author:** Opus orchestrator, parallel to Sonnet's W0.6 v3 work
**Date:** 2026-05-21

---

## Purpose

Sheet 16 is the artifact's "face" — the canonical mathematical view a reader sees first when opening the SSOT xlsx. **Set as `wb.active` so the workbook opens here** (per Lock #2 + Sonnet's v2 sheet table notation).

Math-pure per Lock #8.8 — no academic narrative. Surfaces:
- The 12-face energy table at canonical O1 layer (with D/E/V_res as labeled analytical-context columns)
- The 6 breath axes with polarity readings + Axis 5 inversion callout
- The 3 sibling architectural findings (F9 + F10 + L8 vertex V13)
- The aggregate metrics (Global Coherence, Organizational Octave, AAG, BAB, Dissonance)
- Performance verdicts per face (from Sheet 14 Spectral)
- Three key findings callouts (F8 gap, F10 consensus, Axis 5 inversion)

---

## Cell-by-cell layout

Quannex brand palette: Deep Teal `#0D7377` headers, Quantum Purple `#8B5CF6` formula labels, Magenta Pink `#D946EF` alerts, Dark Navy `#0A0E1A` titles, Pale Yellow `#FFF8DC` editable, Light Blue `#E6F3FF` formula-derived, White labels, Gray `#E0E0E0` reference, traffic-light Red `#FFB6B6` Wall / Yellow `#FFFF66` Gate / Green `#90EE90` Membrane.

### Block A — Sheet header + brand identity (rows 1-4)

```
Row 1: [merged A1:K1] "CEN Spiral Dashboard — Canonical Mathematical View"  [Dark Navy bg, white bold 18pt]
Row 2: [merged A2:K2] "34 BSC KPIs → Pentagramic Coherence → 12 Faces × 3 Octaves (O1+O2+O3)"  [Deep Teal bg, white]
Row 3: [merged A3:K3] "First-octave canonical layer primary. O2+O3 supplementary. Math-only SSOT mirror."  [Deep Teal lighter shade, white italic]
Row 4: [merged A4:K4] "Version: 1.0 · Build date: =cen_ssot_build_date · Companion narrative: CEN_Coherence_Portrait.md (separate)"  [Gray, smaller]
```

### Block B — Aggregate metrics summary (rows 6-10) — THE HEADLINE NUMBERS

```
Row 6: [A6] "ORGANIZATIONAL COHERENCE METRICS (CANONICAL O1)"  [merged A6:K6, Deep Teal header]

Row 7:
  [A7] "Global Coherence"        [B7] = cen_global_coherence_o1  [conditional format by band]
  [C7] "Org Octave (Path 2)"     [D7] = cen_org_octave  [shows e.g., "O1 Survival"]
  [E7] "AAG_O1 (Wk8 canonical)"  [F7] = cen_aag_o1  [tooltip: "AAG = E_Aspiration/E_Actuality; <1 means actuality exceeds aspiration. CEN canonical AAG_O1 = 0.789."]
  [E7b] "AvG_O1 (strict-O1)"      [F7b] = cen_avg_o1 [tooltip: "AvG_O1 = |C_global_O1 − K_mean_60_O1| = |0.1299 − 0.0417| = 0.0882. Border of 'Aggregation distortion' band — signals architectural blindness (face rollup 3x O1 KPI mean)."]
  [G7] "BAB Score"               [H7] = cen_bab_score  [tooltip: ">1 = over-receiving; <1 = over-projecting"]
  [I7] "Dissonance Index"        [J7] = cen_dissonance_index
  [K7] "Dominant Mode"           [L7] = cen_dominant_mode

Row 8: Tooltips/interpretations under each metric (small italic)
  [B8] tooltip: "9 Wall + 3 Gate + 0 Membrane+. Severe O1 measurement compression."
  [D8] tooltip: "Foundation Principle path 2: geomean(face octaves) − spread penalty"
  [F8] tooltip: "AAG_O1=0.789 reflects F10 sibling-blindness at O1"
  [H8] tooltip: "Pre-s58 reading 1.25; recomputation pending W2"
  [J8] tooltip: "Higher = more spectral disagreement"
  [L8] tooltip: "Highest-magnitude non-DC eigenmode"
```

### Block C — The 12-Face Energy Table (rows 12-25) — THE PRIMARY VIEW

This IS the dashboard. Per Lock #8.7 Option β: canonical E_f primary; D/E/V_res as labeled analytical-context columns.

```
Row 12: [merged A12:L12] "TWELVE FACES — CANONICAL O1 ENERGY VIEW (CEN-AUTHENTIC NAMES)"  [Deep Teal header]

Row 13: header row
| A: Face | B: CEN-Authentic Cluster Name | C: IIRF/Mirror Anchor | D: E_f O1 (canonical) | E: Band | F: D (context) | G: E (context) | H: V_res_post (researcher context) | I: Performance Verdict | J: KPIs (O1/O2/O3) | K: Notes |

Rows 14-25: 12 face rows. Per-face cell contents:

F1: [A14] "F1"
    [B14] "Three-Pillar Sustainability"
    [C14] "IIRF Financial Capital"
    [D14] = cen_f1_e_local_o1  [light blue formula bg; value 0.2563 expected]
    [E14] = band lookup against φ-thresholds  [conditional format: Wall=red / Gate=yellow / Membrane=green]
    [F14] = D_norm value 6 [gray italic, "(analytical context only)" header above]
    [G14] = E_norm value 1 [gray italic]
    [H14] = V_res_post value 2 [gray italic]
    [I14] = cen_f1_performance_verdict  [reads from Sheet 14; conditional format Magenta if Under, Purple if Over]
    [J14] = "1/4/0"  [count of KPIs in O1/O2/O3 layers]
    [K14] = "Foundation Gate; revenue stream measurement"

F2: "F2" / "Programs Engine" / "IIRF Intellectual Capital" / 0.1192 / Wall / 8 / 7 / 5 / =verdict / "0/3/1" / "Knowledge depth; O1 silent"
F3: "F3" / "Team & Energy" / "IIRF Human Capital" / 0.1192 / Wall / 7 / 3 / 4 / =verdict / "1/2/0" / "Founder dyad asymmetry"
F4: "F4" / "Operational Discipline" / "IIRF Manufactured Capital" / 0.1349 / Wall / 7 / 2 / 2 / =verdict / "3/2/0" / "Structural vacuum (Esther's term)"
F5: "F5" / "Coaching Market Fit" / "Mirror Market Resonance" / 0.1349 / Wall / 3 / 1 / 2 / =verdict / "1/1/1" / "Hidden Oracle external pole"
F6: "F6" / "Membership Belonging" / "IIRF Social & Relationship Capital" / 0.1523 / Gate / 3 / 4 / 4 / =verdict / "1/2/1" / "Emerging community network"
F7: "F7" / "Field Voice" / "Mirror Brand & Reputation" / 0.1192 / Wall / 7 / 3 / 3 / =verdict / "0/1/0" / "NPS unmeasured (operational gap)"
F8: "F8" / "Field-Shaping Aspiration" / "Mirror Core Operations" / 0.1192 / Wall / 7 / 1 / 2 / =verdict / "0/1/0" / "6-pt co-founder gap (largest)"
F9: "F9" / "Ecological Embedding" / "IIRF Natural Capital" / 0.1192 / Wall / 6 / 5 / 8 / =verdict / "0/0/0" / "ARCHITECTURAL BLINDNESS (zero BSC KPIs)"  [F9 row magenta-tinted alert background]
F10: "F10" / "Conscious-Leadership Identity" / "Mirror Foundational Values" / 0.1192 / Wall / 10 / 9 / 8 / =verdict / "0/1/0" / "SIBLING BLINDNESS at O1 (only O2 KPIs)"  [F10 row magenta-tinted alert background]
F11: "F11" / "Funding Inflow" / "Mirror Funding Pipeline" / 0.1192 / Wall / 6 / 4 / 2 / =verdict / "0/1/0" / "Dormant pipeline"
F12: "F12" / "Compliance & Continuity" / "Mirror Risk & Resilience" / 0.1523 / Gate / 3 / 1 / 3 / =verdict / "1/0/0" / "GDPR + crisis baseline only"
```

### Block D — Header annotations explaining analytical-context columns (rows 11 above header)

```
Row 11: [merged F11:H11] "(Analytical context only — multi-scorer face-level perceptions; NOT canonical math inputs. See Coherence Portrait Appendix A1.)"  [Gray italic, small]
```

### Block E — Band distribution summary (row 27)

```
Row 27: 
  [A27] "Band distribution (O1 canonical):"
  [B27] = COUNTIF(E14:E25, "Wall") & " Wall + " & COUNTIF(E14:E25, "Gate") & " Gate + " & COUNTIF(E14:E25, "Membrane") & " Membrane+"
  [Under S58 researcher normalization (default): "9 Wall + 3 Gate + 0 Membrane+"]
  [Under STRICT §1.3 "Absent"→0 normalization: "11 Wall + 1 Gate + 0 Membrane+" — F4 and F12 drop to floor; only F1 retains Gate]
  [Tooltip explains: normalization choice affects band assignment; canonical S58 reading is primary; STRICT reading flagged as alternative diagnostic under thesis lens]
```

### Block F — Six Breath Axes table (rows 29-36)

```
Row 29: [merged A29:H29] "SIX BREATH AXES — POLARITY READINGS"  [Deep Teal header]

Row 30: header
| A: Axis | B: Name | C: Projection Face | D: Reception Face | E: D | F: E | G: V_res_post | H: Pattern |

Rows 31-36: 6 axes

Axis 1 Resource Flow:    F11 projects → F1 receives | D=-2 | E=-1 | V_res=-2 | "Near-consensus contraction"
Axis 2 Substance & Story: F7 projects → F2 receives | D=+1 | E=-1 | V_res=-2 | "2-vs-1 pattern (D outlier)"
Axis 3 Being & Doing:    F8 projects → F3 receives | D=-1 | E=-1 | V_res=-2 | "Aligned compression"
Axis 4 Form & Integrity: F4 projects → F9 receives | D=0  | E=+2 | V_res=+2 | "2-vs-1 (D outlier balanced)"
Axis 5 Perception & Truth: F5 projects → F10 receives | D=-2 | E=+2 | V_res=+2 | "FULL POLARITY INVERSION"  [magenta-tinted alert row]
Axis 6 Network & Fortress: F6 projects → F12 receives | D=-1 | E=-1 | V_res=-1 | "Consensus outward-flow"
```

### Block G — Three key findings callouts (rows 38-44) — THE ARCHITECTURAL HIGHLIGHTS

```
Row 38: [merged A38:K38] "THREE KEY FINDINGS — STRUCTURAL ARCHITECTURE"  [Magenta Pink header, emphasis]

Row 39: 
  [A39] "1. F9 Architectural Blindness"  
  [B39] "Ecological Embedding has ZERO BSC KPIs at any octave. BSC's 4-perspective framework has no native slot for Natural Capital process-measurement. CEN-clean E_f=0.1192 (Wall logistic floor) vs V_res_post=0.80 → Δ=−0.681 (largest face delta). Mechanism: ARCHITECTURAL ABSENCE. Fix path: instrument extension."
  [Magenta Pink callout background]

Row 40:
  [A40] "2. F10 Sibling Architectural Blindness at O1"
  [B40] "Foundational Values has 2 BSC KPIs but BOTH are O2-priority (I9, L8). At O1 layer, F10 has zero measurement infrastructure → Wall floor 0.1192. Mechanism: UNDER-INVESTMENT at O1 octave. Fix path: re-tag I9/L8 to O1 OR add new O1-tagged values KPI."
  [Magenta Pink callout background]

Row 40b:
  [A40b] "2b. F4 + F12 Third Sibling Pattern (under STRICT normalization)"
  [B40b] "F4 Structural and F12 Resilience also collapse to logistic floor 0.1192 when KPIs scored as actually 'Absent' rather than s58-researcher-normalized. Mechanism: UNDER-DEVELOPMENT at O1 (KPIs named at O1 priority but currently at value 0). Fix path: implement existing KPIs (do the work). Three-way categorical distinction: F9 (architectural absence) / F10 (under-investment) / F4+F12 (under-development)."
  [Magenta Pink callout background — lighter shade for conditional finding]

Row 41:
  [A41] "3. L8 → Vertex V13 (first vertex-KPI in CEN dataset)"
  [B41] "BSC.L8 SDG alignment in PVM placed at Vertex V13 (F4 Structural ∩ F9 Regenerative ∩ F10 Values = 'Structure-Regeneration-Values'). Procedure C question-match 10/10. Activates the previously-empty vertex architectural slot. Validates Face-XOR-Edge-XOR-Vertex framework with empirical CEN data."
  [Quantum Purple callout background — emergence/structural breakthrough]

Row 41b:
  [A41b] "4. V13 Vortex Strength = 0.0455 (V13 paradox)"
  [B41b] "L8's vertex V13 home computes vortex strength=0.0455, coherence=1.000 (artifact: all 3 faces at same logistic floor), direction=−0.762. 'Harmonious' label misfires — this is coherence-of-shared-absence, not coherence-of-presence. Honest disclosure required."
  [Light gray callout — analytical context]

Row 41c:
  [A41c] "5. CHIRALITY → SEQUENCE CONCAVITY relabel (Lock #8.19)"
  [B41c] "Sympy verification proved Quannex's chirality formula simplifies to (f1−f2)(2·f2−f1−f3)/2 — NOT rotational winding (no cyclic symmetry, no antisymmetry under reversal). Measures sequence concavity at f2. Code rename pending: calculateChirality → calculateSequenceConcavity."
  [Quantum Purple callout — methodological refinement]

Row 41d:
  [A41d] "6. DOMINANTMODE template field is NARRATIVE, not engine output (Lock #8.20)"
  [B41d] "mapping-context.json:319 records dominantMode=10 but engine produces dominantMode=5 (CEN at O1). The template field is hand-authored pointer to spotlight FACE number (F10), not spectral eigenvalue index. Naming collision with engine. Same likely for BAB=1.25 (engine: 1.136) and dissonance=0.38 (engine: 0.178)."
  [Quantum Purple callout — methodological refinement]

Row 43: [merged A43:K43] "THREE CEN-SPECIFIC FINDINGS (Coherence Portrait centerpieces)"  [Deep Teal subheader]

Row 44:
  [A44] "F8 Core Operations co-founder gap = 6 points (D=7, E=1)"
  [B44] "Largest gap in dataset. Spiral Dashboard surfaces this fragmentation as first-order finding; BSC did not."

Row 45:
  [A45] "F10 Foundational Values near-consensus (D=10, E=9)"
  [B45] "Rare alignment. Values are real in CEN's day-to-day reality, not aspirational. Shared ground for hard conversations."

Row 46:
  [A46] "Axis 5 Perception & Truth full polarity inversion (D=−2, E=+2, V_res=+2)"
  [B46] "Co-founders navigate by different compasses on the F5↔F10 axis. Dialogue intervention, not score-lifting."
```

### Block H — Integrity attestation footer (rows 48-54)

```
Row 48: [merged A48:K48] "INTEGRITY ATTESTATION"  [Deep Teal header]

Row 49: "This Sheet 16 reflects only the O1 canonical layer. O2 + O3 supplementary readings in Sheets 13 (Diagnostics) + 14 (Spectral) + 11 (Octave Detection)."

Row 50: "Methodology: Quannex Coherence Audit Protocol v1.1. 34 BSC KPIs → Songbook v2.1 60-element mapping → Pentagramic Coherence Formula (α=φ⁻¹, β=0.5, γ=0.7, κ=4) → 12 face energies. Procedure C (question-derived clustering) for placement."

Row 51: "Data freshness: Phase 2 frozen 2026-04-07. Companion narrative: CEN_Coherence_Portrait.md (April 2026 delivery)."

Row 52: "Honest disclosures: Phase 2 four-vector data uses researcher normalization (documented in Sheet 03 Source Basis column). Wk8 Quannex-self AAG=0.761 is BDQ workspace data (not CEN); cross-reference only in Sheet 20."

Row 53: "Cross-reference architecture:"
        Sheet 0a Naming Translation · Sheet 13 AAG+AvG Diagnostics · Sheet 14 Spectral Analysis · Sheet 15 Provenance Chain · Sheet 17 Audit Trail Crosslinks · Sheet 20 Cross-Workspace References

Row 54: "Architectural locks applied: Locks #8.1-8.17 per Consolidation Map 2026-05-21."
```

---

## Named ranges defined on this sheet

This sheet primarily DISPLAYS data; minimal new named ranges:
- `cen_dashboard_band_distribution` — B27 (text summary)
- `cen_dashboard_build_date` — row 4 build timestamp

The sheet READS extensively from:
- Sheet 04: `cen_f<n>_e_local_o1` (12 face energies)
- Sheet 11: `cen_org_octave`, `cen_octave_path1`, `cen_octave_path2`
- Sheet 13: `cen_aag_o1`
- Sheet 14: `cen_bab_score`, `cen_dissonance_index`, `cen_dominant_mode`, `cen_performance_verdicts` (per-face)
- Sheet 12: `cen_global_coherence_o1`
- Sheet 10: breath axis polarity readings per scorer
- Sheet 02: D/E/V_res_post values per face

---

## Build dependencies

Sheet 16 cannot be fully populated until:
1. Sheets 04, 06, 10, 11, 12, 13, 14 all exist with their named ranges defined
2. CEN raw inputs (Sheet 02) are populated with the 4-vector data (D, E, V_res_pre, V_res_post)
3. The 12 CEN-authentic cluster names + IIRF/Mirror anchors are in the Naming Translation table (Sheet 0a)

Build Sheet 16 LAST in the W2 sequence (after all computational sheets are stable). Set `wb.active = wb['Dashboard_View']` at the end of build.

---

## Conditional formatting rules

| Cell range | Condition | Format |
|------------|-----------|--------|
| D14:D25 (E_f values) | < 0.146 | Red `#FFB6B6` (Wall) |
| D14:D25 | 0.146-0.382 | Yellow `#FFFF66` (Gate) |
| D14:D25 | 0.382-0.618 | Green `#90EE90` (Membrane) |
| D14:D25 | 0.618-0.854 | Light Blue `#A8D8F0` (Hemorrhage) |
| D14:D25 | ≥ 0.854 | Purple `#D9C2F0` (Vortex) |
| I14:I25 (Performance verdict) | Contains "Under-energized" | Magenta Pink `#D946EF` |
| I14:I25 | Contains "Over-energized" | Quantum Purple `#8B5CF6` |
| I14:I25 | Contains "Performing in nature" | Light Blue `#E6F3FF` |
| Row 22 (F9), Row 23 (F10) | Always | Magenta-tinted alert row (architectural blindness emphasis) |
| Row 35 (Axis 5) | Always | Magenta-tinted alert row (polarity inversion emphasis) |
| F14:H25 (D/E/V_res columns) | Always | Gray `#E0E0E0` background (analytical-context labeled) |

---

## Verification checks (W2 acceptance criteria)

1. **Visual rendering verification:** Open xlsx in Excel; Sheet 16 is the active sheet on file-open.
2. **Band coloring verification:** F1=Gate(yellow), F2=Wall(red), …, F12=Gate(yellow). Visual check matches expected band distribution 9 Wall + 3 Gate + 0 Membrane+.
3. **Three findings callouts visible** with appropriate emphasis colors.
4. **Cross-sheet reads:** All formulas in Block B (aggregate metrics row 7) resolve to numbers, not #REF errors.
5. **Performance verdicts span all 3 states** across the 12 faces. If all "Performing," likely Sheet 14 formula bug; investigate before SSOT release.
6. **D/E/V_res columns clearly labeled as analytical-context only** with the Row 11 header annotation visible above the data.

---

## Honest disclosure for SSOT users (what Sheet 16 does NOT show)

- **O2 and O3 face energies:** Not on Sheet 16 (which is O1-canonical primary). See Sheets 13 (per-octave AAG), 14 (per-octave spectral), 11 (per-octave detection). The O1-only choice is a deliberate primacy decision for the canonical layer; O2+O3 are supplementary architecturally.
- **Procedure A (CEN-cluster) vs Procedure B (s58 canonical) historical reasoning:** Resolved by Procedure C (question-derived clustering). The clutter of historical placement reasoning lives in Sheet 15 Provenance Chain, not here.
- **Per-vector "AAG" (Phase 2 mislabeling):** NOT shown here. Per Lock #8.15 — the Phase 2 "AAG" is per-vector mean coherence (renamed OVC), surfaces in analytical-context if at all, NOT on this canonical math view.
- **Edge + Vertex KPIs:** Not on Sheet 16 directly. See Sheet 07 (Edges) + Sheet 09 (Vertices including L8 at V13). Sheet 16 is face-centric primary view.
- **34-KPI per-cluster occupancy:** Surface count only in column J ("KPIs (O1/O2/O3)"). Full detail in Sheet 03 (60-element grid).

---

## Cross-references

- Lock #2 — CEN-authentic naming throughout
- Lock #8.7 — D/E/V_res as labeled analytical-context columns (Option β)
- Lock #8.8 — Math-only SSOT
- Lock #8.10 — Performance verdict propagation from Sheet 14
- Lock #8.14 — F9+F10 sibling-finding callouts (Rows 39-40)
- Lock #8.16 — L8 vertex V13 callout (Row 41)
- Lock #8.15 — AAG canonical (Wk8 formula)
- Sheet 14 Spectral_Analysis layout design (companion doc)
- Coherence Portrait `CEN_Coherence_Portrait.md` — narrative companion (NOT replaced by SSOT)
