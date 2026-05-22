# CEN SSOT Sheet 14 — Spectral_Analysis Layout Design

**Status:** Drop-in-ready W2 build specification
**Authority:** Lock #8.10 (Spectral Δ vector as core SSOT content)
**Author:** Opus orchestrator, parallel to Sonnet's Procedure C work
**Date:** 2026-05-21

---

## Purpose

Sheet 14 implements the spectral interpretive engine: dodecahedral Laplacian decomposition + modal amplitudes + Δ vector + Performance verdict + interpretive narrative per face. **Reveals which CEN domains are "literally not performing in their nature"** by quantifying the gap between current face energy and what the dodecahedral coherence calls for at each face.

This sheet is CORE SSOT content per Lock #8.10 (not peripheral). The Performance verdict column propagates to Sheet 16 Dashboard_View for at-a-glance diagnostic visibility.

---

## Cell-by-cell layout

Quannex brand palette: Deep Teal `#0D7377` (headers), Quantum Purple `#8B5CF6` (formula cells), Magenta Pink `#D946EF` (alerts/non-performing), Dark Navy `#0A0E1A` (titles), Pale Yellow `#FFF8DC` (editable), Light Blue `#E6F3FF` (formula-derived), White (labels), Gray `#E0E0E0` (reference).

### Block A — Sheet header (rows 1-3)

```
Row 1: [merged A1:L1] "Sheet 14 — Spectral Analysis"  [Dark Navy bg, white bold text]
Row 2: [merged A2:L2] "Laplacian eigenvalue decomposition · Modal amplitudes · Δ vector · Performance verdict per face"  [Deep Teal bg, white text]
Row 3: [merged A3:L3] "Source: Lock #8.10 · Cross-ref: audit trail §13 (to be added W1) · Engine: js/spectral-analyzer.js · Recomputed when canonical O1 face energies change"  [Gray, italic]
```

### Block B — Constants reference (rows 5-9)

```
Row 5: [A5] "Spectral constants" [Deep Teal header]
Row 6: [A6] "φ"        [B6] =PHI               [C6] tooltip: "Golden ratio = (1+√5)/2 ≈ 1.6180339887498948"
Row 7: [A7] "φ⁻¹"      [B7] =1/PHI             [C7] tooltip: "Pentagram self-similarity ratio; pentagram skip-pair α constant"
Row 8: [A8] "φ⁻²"      [B8] =1/PHI^2           [C8] tooltip: "Squared inverse golden ratio ≈ 0.382; φ-threshold base"
Row 9: [A9] "ε_threshold (Δ alignment)"  [B9] 0.05  [C9] tooltip: "Threshold for 'performing in nature' verdict: |Δ_f| < 0.05 → aligned"
```

### Block C — Laplacian matrix L (rows 11-23)

Dodecahedron face-adjacency graph Laplacian. 12×12 integer-valued. Visible as reference.

```
Row 11: [A11] "Laplacian L = D − A"  [merged through L11; Deep Teal header]
Row 12: [B12:M12]  "F1 F2 F3 F4 F5 F6 F7 F8 F9 F10 F11 F12"  [column labels, gray]
Rows 13-24: [A13:A24] "F1" through "F12" [row labels, gray]
           [B13:M24] integer matrix values per js/spectral-analyzer.js:110-124

Diagonal D_ii = 5 (each face has 5 neighbors on dodecahedron)
Off-diagonal A_ij = -1 if (i,j) ∈ canonical 30 edges; 0 otherwise

Tooltip on header (B12): "L_ii = degree = 5 for all faces. L_ij = -1 if faces i,j share an edge."
```

### Block D — Eigenvalue/Eigenvector matrices (rows 26-44)

```
Row 26: [A26] "Eigenvalues λ_m"  [Deep Teal header]
Row 27: [A27:L27] eigenvalues for modes 1-12
        Mode 1 (DC):     λ = 0
        Modes 2-4:       λ = 5 - √5 ≈ 2.7639
        Modes 5-9:       λ = 6
        Modes 10-12:     λ = 5 + √5 ≈ 7.2361

Row 28: [A28:L28] φ-derivation tooltips per cell
        Tooltip mode 1: "DC offset (equal-energy mode); ⟂ all other modes"
        Tooltips modes 2-4: "5−√5 = 2(3−φ); global-tilt frequencies; φ-connected"
        Tooltips modes 5-9: "Mid-frequency; cluster patterns of 3-5 adjacent faces"
        Tooltips modes 10-12: "5+√5 = 2(2+φ); fine-grained local dissonance frequencies; φ-connected"

Row 30: [A30] "Eigenvector matrix U (orthonormal)"  [Deep Teal]
Row 31: [B31:M31] "Mode 1" through "Mode 12"
Rows 32-43: [A32:A43] "F1" through "F12"; [B32:M43] eigenvector matrix per js/spectral-analyzer.js:140-154

Row 44: [A44] "Orthogonality check"  [B44] =MMULT(TRANSPOSE(U),U) should = identity to 1e-10
        Tooltip: "Verifies U^T·U ≈ I; numerical integrity guarantee for spectral decomposition"
```

### Block E — CEN face energy inputs (rows 46-58)

```
Row 46: [A46] "CEN face energies (O1 canonical)"  [Deep Teal header]
Row 47: [B47:M47] "F1 F2 F3 F4 F5 F6 F7 F8 F9 F10 F11 F12" labels

Row 48: [A48] "E_f (O1)" 
        [B48:M48] = named range references: =cen_f1_e_local_o1, =cen_f2_e_local_o1, ..., =cen_f12_e_local_o1
        (these named ranges defined in Sheet 04 Face_Calculations after pentagramic computation)

Row 49: [A49] "Breath-axis nature (P=projection / R=reception)"
        [B49:M49] static values (per v0.3 SSOT):
        F1=R, F2=R, F3=R, F4=P, F5=P, F6=P, F7=P, F8=P, F9=R, F10=R, F11=P, F12=R

Row 50: [A50] "Axis pair"
        [B50:M50] "Ax1" "Ax2" "Ax3" "Ax4" "Ax3" "Ax6" "Ax2" "Ax3" "Ax4" "Ax5" "Ax1" "Ax6"
        (axis assignments: 1=Resource Flow F1↔F11; 2=Substance&Story F2↔F7; 3=Being&Doing F3↔F8; 4=Form&Integrity F9↔F4; 5=Perception&Truth F10↔F5; 6=Network&Fortress F12↔F6)
```

### Block F — Modal amplitudes a = U^T · E (rows 52-54)

```
Row 52: [A52] "Modal amplitudes a_m = U^T · E"  [Deep Teal header]
Row 53: [B53:M53] "Mode 1" through "Mode 12"
Row 54: [B54] = SUMPRODUCT(transpose(U column for mode 1), B48:M48)
        ... (one cell per mode; formulas compute the spectral projection)
Row 54 tooltips: "|a_dom| identifies the dominant non-DC mode"

Row 55: [A55] "Dominant mode (m* = argmax|a_m| for m > 1)"
        [B55] = INDEX(B53:M53, MATCH(MAX(ABS(C54:M54)), ABS(C54:M54), 0)+1)
        Tooltip: "Excludes Mode 1 (DC) per analytical convention; identifies the highest-magnitude spectral component"

Row 56: [A56] "Multi-mode threshold (0.1 · |a_dom|)"
        [B56] = 0.1 * MAX(ABS(C54:M54))
```

### Block G — Δ vector computation (rows 58-72)

```
Row 58: [A58] "Δ_f single-mode correction (Δ_f = -U_{f, m*} · a_{m*})"  [Deep Teal]
Row 59: [B59:M59] one formula per face, using INDEX into U matrix at dominant mode column

Row 61: [A61] "Δ_f multi-mode correction (sum of all modes with |a_m| ≥ threshold)"
Row 62: [B62:M62] one formula per face, summing -U_{f,m}·a_m for qualifying modes

Row 64: [A64] "Magnitude |Δ_f| (multi-mode)"
Row 65: [B65:M65] =ABS for each Δ_f
```

### Block H — Performance verdict per face (rows 67-81 — THE CORE INTERPRETIVE LAYER)

```
Row 67: [A67] "PERFORMANCE VERDICT PER FACE"  [merged A67:L67, Magenta Pink header — emphasis]
Row 68: [A68] "Face_ID" | [B68] "Δ_f" | [C68] "Sign" | [D68] "Nature (P/R)" | [E68] "Performance verdict" | [F68] "Interpretive narrative"

Rows 69-80 — 12 faces, each row:
  [A] = Face_ID (F1...F12)
  [B] = =B62  (multi-mode Δ for this face)
  [C] = SIGN of Δ ("+" / "−" / "≈0")
  [D] = nature lookup from row 49
  [E] = Performance verdict formula:
        =IF(ABS(B69)<$B$9, "Performing in nature",
          IF(B69>0, 
             IF(D69="P", "Under-energized as Projector", "Under-energized as Receiver"),
             IF(D69="P", "Over-energized as Projector", "Over-energized as Receiver")))
  [F] = Interpretive narrative — see narrative templates below

Conditional formatting on column E:
  "Performing in nature" → Light blue background
  "Under-energized as P" or "Under-energized as R" → Magenta pink background
  "Over-energized as P" or "Over-energized as R" → Quantum purple background

Row 81: [A81] "Aggregate verdict count"
        [B81] = COUNTIF(E69:E80, "*Performing*")  "Aligned: " & B81
        [C81] = COUNTIF(E69:E80, "*Under-energized*") "Under: " & C81
        [D81] = COUNTIF(E69:E80, "*Over-energized*") "Over: " & D81
```

### Block I — Interpretive narrative templates (rows 83-95)

Per face, a one-line narrative explaining what shift the Δ result implies:

```
Row 83: [A83] "Narrative templates"  [Deep Teal]
Row 84: F1 Financial Capital: "If Under-energized as Receiver: revenue not being absorbed/retained at survival level. If Over-energized: hoarding capital instead of letting it flow."
Row 85: F2 Intellectual Capital: "If Under-energized as Receiver: knowledge not being absorbed. If Over-energized: ideas accumulating without manifestation."
...continue for F3-F12 with face-specific projection/reception nature...

These narratives populate column F of rows 69-80 dynamically via INDEX/MATCH against row 84-95.
```

### Block J — BAB Score + Dissonance Index (rows 97-101)

```
Row 97: [A97] "BAB Score (Being-Action Balance)"
        [B97] = AVERAGE of E_f for reception-pole faces / AVERAGE of E_f for projection-pole faces
        Tooltip: "Ratio of mean reception energy to mean projection energy. >1.0 means CEN is over-receiving relative to projecting (hoarding); <1.0 means over-projecting relative to receiving (depleting)."

Row 98: Compare to CEN diagnostics block (mapping-context.json beingActionBalance=1.25)
        [B98] tooltip: "mapping-context.json:317 records 1.25 BUT likely narrative scaffolding (same pattern as dominantMode — see Lock #8.20). Canonical engine recomputation (Sonnet A 2026-05-21) produces 1.136. Sheet 14 uses 1.136 as canonical."

Row 100: [A100] "Dissonance Index"
         [B100] = SUMPRODUCT(B65:M65, B48:M48) / SUM(B65:M65)
         Tooltip: "Weighted dissonance: Σ|Δ_f|·E_f / Σ|Δ_f|. Higher = more spectral disagreement weighted by face energy."

Row 101: Compare to mapping-context.json:318 reading 0.38 (likely narrative scaffolding per Lock #8.20). Canonical engine recomputation = 0.178. Sheet 14 uses 0.178 as canonical.
```

### Block K — Audit trail crosslinks (rows 103-110)

```
Row 103: [A103] "Audit trail crosslinks"  [Gray reference]
Row 104: "L matrix construction" → js/spectral-analyzer.js:110-124 + audit trail §13.1
Row 105: "Eigenvalues" → audit trail §13.1 (5-√5 = 2(3-φ); 5+√5 = 2(2+φ))
Row 106: "Modal amplitudes" → js/spectral-analyzer.js:209-230
Row 107: "Dominant mode" → js/spectral-analyzer.js:239-253
Row 108: "Δ vector (single-mode)" → js/spectral-analyzer.js:263-281
Row 109: "Δ vector (multi-mode, threshold 0.1)" → js/spectral-analyzer.js:291-323
Row 110: "BAB + dissonance" → js/spectral-analyzer.js:333-403
```

### Block L — O2 + O3 supplementary layers (rows 112+)

```
Row 112: [A112] "O2 supplementary spectral analysis"  [merged, Deep Teal]
Row 113-145: Repeat Blocks E-J for O2 face energies (read from cen_f1_e_local_o2 etc.)

Row 147: [A147] "O3 supplementary spectral analysis"  [merged]
Row 148-180: Same for O3 face energies
```

---

## Named ranges defined on this sheet

- `cen_spectral_modes_vec` — row 54 B54:M54 (12-element modal amplitudes vector)
- `cen_bab_score` — B97
- `cen_dissonance_index` — B100
- `cen_dominant_mode` — B55
- `cen_delta_corrections_vec` — row 62 B62:M62 (12-element multi-mode Δ vector)
- `cen_performance_verdicts` — E69:E80 (12-cell text array)

These propagate to Sheet 16 Dashboard_View for at-a-glance display.

---

## Build dependencies

Sheet 14 cannot be built until:
1. Sheet 01 Assumptions_Constants exists (φ named range)
2. Sheet 06 Breath_Feedback_Pass2 OR Sheet 04 Face_Calculations exists (cen_f<n>_e_local_o1 named ranges)
3. Canonical 30-edge list is finalized (for L matrix construction)
4. Canonical breath-axis projection/reception assignments are confirmed (per v0.3 SSOT — locked in Lock #8.10)

Build order in W2: Sheet 14 comes AFTER Sheets 01-06 (depends on face energies) and BEFORE Sheet 16 Dashboard_View (which reads from Sheet 14's named ranges).

---

## Verification checks (W2 acceptance criteria)

After Sheet 14 build:

1. **Orthogonality** — Cell at row 44 shows U^T·U deviation < 1e-10 from identity
2. **Eigenvalue recovery** — manual spot-check: (U^T·L·U)_ii = λ_i for at least 3 modes
3. **Modal decomposition reconstructs E** — sum(U_im · a_m) ≈ E_f to 1e-6 per face
4. **CEN regression test** — Canonical engine dominantMode for CEN at O1 = **5** (regional band, λ=6.0) per Sonnet A's recomputation 2026-05-21. **CORRECTED:** mapping-context.json:319 records dominantMode=10 BUT that field is narrative scaffolding (pointer to spotlight face F10), NOT engine spectral output — see Lock #8.20. Sheet 14 test asserts engine output = 5.
5. **Performance verdict spans all 3 states** — at least one face in each (Performing / Under / Over). If all 12 are "Performing," likely a formula bug.
6. **Dashboard_View propagation** — Sheet 16 reads `cen_performance_verdicts` and displays per-face verdict

---

## Honest disclosure for SSOT users

This sheet's interpretive power depends on the dodecahedron geometric model. The Δ vector reveals what the dodecahedral coherence "wants" from each face — but the dodecahedral model itself is a Quannex methodological choice (not a universal organizational truth). The verdict "F8 under-energized as Projector" reads accurately only if you accept the dodecahedral model's claim that F8 Core Operations belongs at the projection pole of Axis 3 Being & Doing.

This is bachelor's-defensible per tier discipline: applying the model is defensible; deriving the model's choice of P/R assignments is master's-scope (deferred to future engagement).

---

## Cross-references

- Lock #8.10 (Consolidation Map §6.5)
- POC `js/spectral-analyzer.js` (full implementation)
- POC `docs/math/SPECTRAL_IMPLEMENTATION.md` (existing implementation doc to be promoted to audit trail §13 in W1)
- Sheet 16 Dashboard_View design (subsequent design doc — surfaces Performance verdicts at-a-glance)
- §27 Orchestrator pattern: this design doc itself is W2 prep delegated from Opus orchestration during Sonnet's Procedure C work
