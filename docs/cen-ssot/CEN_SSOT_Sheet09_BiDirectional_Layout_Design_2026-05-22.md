# CEN SSOT Sheet 09 — Bi-Directional Intervention Map Layout Design

**Status:** Drop-in-ready W2 build specification
**Authority:** Lock #8.24 (Bi-Directional Co-Evolution architecture); companion to Lock #8.9 (KPI structural uniqueness Face XOR Edge XOR Vertex), Lock #8.16 (L8 → V13 first vertex-KPI), Lock #2 (CEN-authentic naming)
**Author:** Opus orchestrator, parallel to Sheet 14/16 layout-design pattern
**Date:** 2026-05-22

---

## Purpose

Sheet 09 implements the **Bi-Directional Intervention Map** — the methodological closure of the diagnostic-intervention loop documented in Audit Trail §17. Where Sheets 04 (Face Calculations), 07 (Edges), and 08 (Vertices) display the **forward math** (elements → face energies → edge/vertex energies), Sheet 09 documents the **explicit backward intervention layer**: per Edge KPI and per Vertex KPI, the partnership-mapped Elemental Influence Signature describing where action energy lands across face-element values.

Sheet 09 makes CEN's Spiral Dashboard ACTIONABLE — it bridges from "WHAT is happening in CEN's organizational geometry" (the diagnostic sheets) to "WHERE TO ACT to change specific elements of that state" (this sheet's intervention semantics). Per §17 audit trail framing, this is the fifth thesis-defense centerpiece alongside F9 architectural blindness, F10 sibling-blindness, L8→V13 first vertex-KPI, and F4+F12 third-pattern.

Single consolidated sheet covering all 50 inter-face/triadic relationships (30 edges + 20 vertices). Hosts the Action Simulator (Block D) that lets users predict element-level shifts from any edge/vertex KPI improvement.

---

## Cell-by-cell layout

Quannex brand palette: Deep Teal `#0D7377` headers, Quantum Purple `#8B5CF6` formula labels, Magenta Pink `#D946EF` alerts/predicted-shift out-of-range, Dark Navy `#0A0E1A` titles, Pale Yellow `#FFF8DC` user-editable simulator inputs, Light Blue `#E6F3FF` formula-derived, White labels, Gray `#E0E0E0` reference, Light Teal `#B8E0E1` heatmap-low, Deep Teal `#0D7377` heatmap-high.

### Block A — Sheet header + brand identity (rows 1-4)

```
Row 1: [merged A1:X1] "Sheet 09 — Bi-Directional Intervention Map"  [Dark Navy bg, white bold 18pt]
Row 2: [merged A2:X2] "Elemental Influence Signatures · 30 Edges + 20 Vertices · 120 face-element distributions · Action Simulator"  [Deep Teal bg, white 12pt]
Row 3: [merged A3:X3] "Source: Lock #8.24 Bi-Directional Co-Evolution Architecture · Audit Trail §17 · Cross-ref: Sheets 03 (60-Element Grid), 04 (Face Calcs), 07 (Edges), 08 (Vertices)"  [Deep Teal lighter shade, white italic]
Row 4: [merged A4:X4] "Methodological status: 5 KPI-carrying signatures HIGH-confidence (partnership-validated); 45 anticipatory signatures MEDIUM-confidence. All sums verified 1.0 ± 1e-10."  [Gray, smaller italic]
```

### Block B — Edge Intervention Subsection (rows 6-37)

The 30-edge signature table. Per edge: face IDs + KPI-flag + 10-tuple weights + 2 sum-validation cells + status.

```
Row 6: [merged A6:Q6] "30 EDGES — ELEMENTAL INFLUENCE SIGNATURES (10-tuple per edge; 5 elements × 2 faces)"  [Deep Teal header]

Row 7: column headers (one-line, centered, white text on Deep Teal lighter shade)
  | A: Edge_ID | B: F_A | C: F_B | D: KPI? | E: F_A Earth | F: F_A Water | G: F_A Fire | H: F_A Air | I: F_A Ether | J: F_B Earth | K: F_B Water | L: F_B Fire | M: F_B Air | N: F_B Ether | O: ΣF_A | P: ΣF_B | Q: Status |

Row 7 column-group annotations (smaller, italic, above row 7 headers):
  [merged E6sub:I6sub] "F_A weights (sum to 1.0)"  [Light Blue tint]
  [merged J6sub:N6sub] "F_B weights (sum to 1.0)"  [Light Blue tint]
  [merged O6sub:Q6sub] "Validation gate"  [Magenta Pink tint]
```

**Rows 8-37 — 30 edges in canonical order** (per `CEN_30Edge_Dataset_s58_2026-05-16.md`):

```
Cell-by-cell content per row:
  Col A: Edge_ID literal text
  Col B: F_A face number literal "Fn"
  Col C: F_B face number literal "Fn"
  Col D: KPI flag "✓" (KPI-carrying) or "—" (anticipatory)
  Cols E-I: 5 weights for F_A (Earth/Water/Fire/Air/Ether); literal decimals
  Cols J-N: 5 weights for F_B (Earth/Water/Fire/Air/Ether); literal decimals
  Col O: =SUM(E{row}:I{row})  [formula; expected 1.0]
  Col P: =SUM(J{row}:N{row})  [formula; expected 1.0]
  Col Q: =IF(AND(ABS(O{row}-1)<1e-6, ABS(P{row}-1)<1e-6), "✓", "FAIL")  [formula]
```

**30 edge rows — populate from signatures companion file:**

| Row | Edge_ID | F_A | F_B | KPI? | F_A E | F_A W | F_A Fi | F_A A | F_A Et | F_B E | F_B W | F_B Fi | F_B A | F_B Et |
|-----|---------|-----|-----|------|:-----:|:-----:|:------:|:-----:|:------:|:-----:|:-----:|:------:|:-----:|:------:|
| 8   | E1-2    | F1  | F2  | —    | 0.30  | 0.15  | 0.30   | 0.15  | 0.10   | 0.25  | 0.10  | 0.40   | 0.20  | 0.05   |
| 9   | E1-6    | F1  | F6  | —    | 0.30  | 0.45  | 0.05   | 0.10  | 0.10   | 0.20  | 0.50  | 0.05   | 0.15  | 0.10   |
| 10  | E1-7    | F1  | F7  | —    | 0.25  | 0.20  | 0.10   | 0.35  | 0.10   | 0.10  | 0.30  | 0.05   | 0.50  | 0.05   |
| 11  | E1-8    | F1  | F8  | —    | 0.50  | 0.20  | 0.15   | 0.10  | 0.05   | 0.45  | 0.15  | 0.25   | 0.10  | 0.05   |
| 12  | E1-10   | F1  | F10 | —    | 0.25  | 0.10  | 0.10   | 0.15  | 0.40   | 0.20  | 0.05  | 0.05   | 0.15  | 0.55   |
| 13  | E2-3    | F2  | F3  | —    | 0.20  | 0.20  | 0.10   | 0.45  | 0.05   | 0.15  | 0.30  | 0.10   | 0.40  | 0.05   |
| 14  | E2-6    | F2  | F6  | —    | 0.20  | 0.40  | 0.10   | 0.25  | 0.05   | 0.10  | 0.50  | 0.10   | 0.25  | 0.05   |
| 15  | **E2-10**   | F2  | F10 | **✓**    | 0.35  | 0.10  | 0.10   | 0.15  | 0.30   | 0.25  | 0.05  | 0.05   | 0.10  | 0.55   |
| 16  | E2-11   | F2  | F11 | —    | 0.25  | 0.10  | 0.15   | 0.20  | 0.30   | 0.35  | 0.20  | 0.15   | 0.15  | 0.15   |
| 17  | E3-4    | F3  | F4  | —    | 0.40  | 0.25  | 0.10   | 0.15  | 0.10   | 0.55  | 0.15  | 0.05   | 0.15  | 0.10   |
| 18  | E3-6    | F3  | F6  | —    | 0.15  | 0.55  | 0.10   | 0.15  | 0.05   | 0.15  | 0.55  | 0.05   | 0.20  | 0.05   |
| 19  | E3-9    | F3  | F9  | —    | 0.15  | 0.20  | 0.15   | 0.10  | 0.40   | 0.10  | 0.15  | 0.10   | 0.10  | 0.55   |
| 20  | E3-11   | F3  | F11 | —    | 0.10  | 0.20  | 0.45   | 0.20  | 0.05   | 0.30  | 0.15  | 0.40   | 0.10  | 0.05   |
| 21  | E4-5    | F4  | F5  | —    | 0.30  | 0.10  | 0.10   | 0.45  | 0.05   | 0.20  | 0.10  | 0.15   | 0.50  | 0.05   |
| 22  | E4-6    | F4  | F6  | —    | 0.55  | 0.15  | 0.05   | 0.15  | 0.10   | 0.40  | 0.30  | 0.05   | 0.15  | 0.10   |
| 23  | E4-7    | F4  | F7  | —    | 0.30  | 0.10  | 0.10   | 0.10  | 0.40   | 0.15  | 0.20  | 0.05   | 0.20  | 0.40   |
| 24  | E4-9    | F4  | F9  | —    | 0.40  | 0.05  | 0.20   | 0.10  | 0.25   | 0.15  | 0.10  | 0.20   | 0.05  | 0.50   |
| 25  | E5-7    | F5  | F7  | —    | 0.15  | 0.20  | 0.10   | 0.40  | 0.15   | 0.10  | 0.25  | 0.10   | 0.40  | 0.15   |
| 26  | **E5-8**    | F5  | F8  | **✓**    | 0.30  | 0.20  | 0.20   | 0.25  | 0.05   | 0.30  | 0.20  | 0.35   | 0.10  | 0.05   |
| 27  | E5-9    | F5  | F9  | —    | 0.15  | 0.40  | 0.10   | 0.30  | 0.05   | 0.05  | 0.30  | 0.10   | 0.15  | 0.40   |
| 28  | E5-12   | F5  | F12 | —    | 0.20  | 0.40  | 0.10   | 0.25  | 0.05   | 0.40  | 0.35  | 0.05   | 0.10  | 0.10   |
| 29  | E6-7    | F6  | F7  | —    | 0.15  | 0.30  | 0.05   | 0.45  | 0.05   | 0.10  | 0.25  | 0.05   | 0.55  | 0.05   |
| 30  | E7-8    | F7  | F8  | —    | 0.10  | 0.20  | 0.30   | 0.30  | 0.10   | 0.35  | 0.15  | 0.40   | 0.05  | 0.05   |
| 31  | **E7-11**   | F7  | F11 | **✓**    | 0.10  | 0.35  | 0.10   | 0.35  | 0.10   | 0.40  | 0.30  | 0.10   | 0.15  | 0.05   |
| 32  | E8-10   | F8  | F10 | —    | 0.30  | 0.40  | 0.15   | 0.05  | 0.10   | 0.20  | 0.25  | 0.10   | 0.10  | 0.35   |
| 33  | E8-12   | F8  | F12 | —    | 0.35  | 0.20  | 0.20   | 0.20  | 0.05   | 0.45  | 0.20  | 0.10   | 0.20  | 0.05   |
| 34  | E9-11   | F9  | F11 | —    | 0.20  | 0.10  | 0.10   | 0.10  | 0.50   | 0.45  | 0.20  | 0.10   | 0.10  | 0.15   |
| 35  | E9-12   | F9  | F12 | —    | 0.10  | 0.20  | 0.25   | 0.10  | 0.35   | 0.40  | 0.20  | 0.20   | 0.10  | 0.10   |
| 36  | E10-11  | F10 | F11 | —    | 0.15  | 0.10  | 0.05   | 0.40  | 0.30   | 0.40  | 0.20  | 0.10   | 0.25  | 0.05   |
| 37  | **E10-12**  | F10 | F12 | **✓**    | 0.40  | 0.05  | 0.10   | 0.10  | 0.35   | 0.50  | 0.10  | 0.10   | 0.10  | 0.20   |
| 37b | **E11-12**  | F11 | F12 | —    | 0.45  | 0.35  | 0.05   | 0.10  | 0.05   | 0.40  | 0.40  | 0.05   | 0.10  | 0.05   |

Note: Row 37b = E11-12 occupies row 37 since 30 edges + header = 31 rows. Actual row indexing in build: header at row 7, edges at rows 8 through 37 (30 rows). Edge ordering follows canonical s58 dataset.

**Row 38: edge subsection footer:**
```
[A38] "Edge sums verified:"
[B38] =COUNTIF(Q8:Q37, "✓") & " / 30 ✓"  [should display "30 / 30 ✓"]
[C38:Q38] (empty)
```

**Bold rows (rows 15, 26, 31, 37) = the 4 CEN edge-KPIs** per Lock #8.9 → these signatures HIGH-confidence (E2-10 BSC.L7 Peace Charter screening; E5-8 BSC.C8 AI governance consulting clients; E7-11 BSC.F4 Donation income; E10-12 BSC.I3 GDPR compliance gaps closed). Apply Light Yellow `#FFF8DC` row-background tint to mark these 4 rows as the **HIGH-confidence KPI-carrying signatures**.

### Block C — Vertex Intervention Subsection (rows 40-62)

The 20-vertex signature table. Per vertex: 3 face IDs + KPI-flag + 15-tuple weights + 3 sum-validation cells + status.

```
Row 40: [merged A40:X40] "20 VERTICES — ELEMENTAL INFLUENCE SIGNATURES (15-tuple per vertex; 5 elements × 3 faces)"  [Deep Teal header]

Row 41: column headers
  | A: Vertex_ID | B: F_A | C: F_B | D: F_C | E: KPI? | F: F_A E | G: F_A W | H: F_A Fi | I: F_A A | J: F_A Et | K: F_B E | L: F_B W | M: F_B Fi | N: F_B A | O: F_B Et | P: F_C E | Q: F_C W | R: F_C Fi | S: F_C A | T: F_C Et | U: ΣF_A | V: ΣF_B | W: ΣF_C | X: Status |

Row 41 column-group annotations (smaller, italic, above row 41 headers):
  [merged F40sub:J40sub] "F_A weights"  [Light Blue tint]
  [merged K40sub:O40sub] "F_B weights"  [Light Blue tint]
  [merged P40sub:T40sub] "F_C weights"  [Light Blue tint]
  [merged U40sub:X40sub] "Validation gate"  [Magenta Pink tint]
```

**Rows 42-61 — 20 vertices in canonical order** (per `POC/companies/cen/mapping-context.json` lines 178-199):

```
Cell-by-cell content per row:
  Col A: Vertex_ID literal text (V1...V20)
  Col B-D: 3 face number literals (Fn, Fn, Fn)
  Col E: KPI flag "✓" (V13 only) or "—" (anticipatory)
  Cols F-J: 5 weights for F_A
  Cols K-O: 5 weights for F_B
  Cols P-T: 5 weights for F_C
  Col U: =SUM(F{row}:J{row})
  Col V: =SUM(K{row}:O{row})
  Col W: =SUM(P{row}:T{row})
  Col X: =IF(AND(ABS(U{row}-1)<1e-6, ABS(V{row}-1)<1e-6, ABS(W{row}-1)<1e-6), "✓", "FAIL")
```

**20 vertex rows — populate from signatures companion file:**

| Row | Vtx | F_A | F_B | F_C | KPI? | F_A E | F_A W | F_A Fi | F_A A | F_A Et | F_B E | F_B W | F_B Fi | F_B A | F_B Et | F_C E | F_C W | F_C Fi | F_C A | F_C Et |
|-----|-----|-----|-----|-----|------|:-----:|:-----:|:------:|:-----:|:------:|:-----:|:-----:|:------:|:-----:|:------:|:-----:|:-----:|:------:|:-----:|:------:|
| 42  | V1  | F1  | F2  | F3  | —    | 0.30  | 0.20  | 0.30   | 0.15  | 0.05   | 0.25  | 0.15  | 0.30   | 0.25  | 0.05   | 0.20  | 0.30  | 0.30   | 0.15  | 0.05   |
| 43  | V2  | F1  | F3  | F4  | —    | 0.45  | 0.25  | 0.10   | 0.10  | 0.10   | 0.35  | 0.30  | 0.10   | 0.15  | 0.10   | 0.55  | 0.15  | 0.05   | 0.15  | 0.10   |
| 44  | V3  | F1  | F4  | F5  | —    | 0.35  | 0.20  | 0.15   | 0.20  | 0.10   | 0.40  | 0.10  | 0.10   | 0.30  | 0.10   | 0.20  | 0.20  | 0.15   | 0.40  | 0.05   |
| 45  | V4  | F1  | F5  | F6  | —    | 0.30  | 0.40  | 0.10   | 0.15  | 0.05   | 0.20  | 0.35  | 0.10   | 0.30  | 0.05   | 0.15  | 0.50  | 0.05   | 0.25  | 0.05   |
| 46  | V5  | F1  | F2  | F6  | —    | 0.30  | 0.30  | 0.20   | 0.15  | 0.05   | 0.20  | 0.30  | 0.20   | 0.25  | 0.05   | 0.10  | 0.50  | 0.10   | 0.25  | 0.05   |
| 47  | V6  | F2  | F3  | F8  | —    | 0.30  | 0.15  | 0.30   | 0.20  | 0.05   | 0.20  | 0.25  | 0.40   | 0.10  | 0.05   | 0.35  | 0.15  | 0.40   | 0.05  | 0.05   |
| 48  | V7  | F3  | F4  | F9  | —    | 0.25  | 0.25  | 0.10   | 0.10  | 0.30   | 0.45  | 0.10  | 0.10   | 0.10  | 0.25   | 0.10  | 0.20  | 0.10   | 0.10  | 0.50   |
| 49  | V8  | F4  | F5  | F10 | —    | 0.40  | 0.10  | 0.05   | 0.25  | 0.20   | 0.15  | 0.15  | 0.10   | 0.45  | 0.15   | 0.10  | 0.05  | 0.05   | 0.30  | 0.50   |
| 50  | V9  | F5  | F6  | F11 | —    | 0.20  | 0.30  | 0.10   | 0.35  | 0.05   | 0.15  | 0.45  | 0.05   | 0.30  | 0.05   | 0.40  | 0.30  | 0.10   | 0.15  | 0.05   |
| 51  | V10 | F2  | F6  | F7  | —    | 0.20  | 0.20  | 0.10   | 0.40  | 0.10   | 0.10  | 0.40  | 0.05   | 0.40  | 0.05   | 0.10  | 0.25  | 0.05   | 0.50  | 0.10   |
| 52  | V11 | F2  | F7  | F8  | —    | 0.25  | 0.15  | 0.20   | 0.35  | 0.05   | 0.15  | 0.20  | 0.15   | 0.45  | 0.05   | 0.40  | 0.15  | 0.35   | 0.05  | 0.05   |
| 53  | V12 | F3  | F8  | F9  | —    | 0.20  | 0.30  | 0.20   | 0.10  | 0.20   | 0.30  | 0.30  | 0.25   | 0.05  | 0.10   | 0.10  | 0.30  | 0.10   | 0.05  | 0.45   |
| 54  | **V13** | F4  | F9  | F10 | **✓**    | 0.45  | 0.10  | 0.05   | 0.10  | 0.30   | 0.20  | 0.10  | 0.05   | 0.10  | 0.55   | 0.05  | 0.05  | 0.05   | 0.35  | 0.50   |
| 55  | V14 | F5  | F10 | F11 | —    | 0.20  | 0.15  | 0.10   | 0.50  | 0.05   | 0.10  | 0.05  | 0.05   | 0.30  | 0.50   | 0.40  | 0.25  | 0.05   | 0.25  | 0.05   |
| 56  | V15 | F6  | F7  | F11 | —    | 0.10  | 0.45  | 0.05   | 0.35  | 0.05   | 0.10  | 0.30  | 0.05   | 0.50  | 0.05   | 0.40  | 0.30  | 0.05   | 0.20  | 0.05   |
| 57  | V16 | F7  | F8  | F12 | —    | 0.15  | 0.25  | 0.10   | 0.45  | 0.05   | 0.35  | 0.20  | 0.30   | 0.10  | 0.05   | 0.45  | 0.20  | 0.05   | 0.20  | 0.10   |
| 58  | V17 | F8  | F9  | F12 | —    | 0.30  | 0.30  | 0.25   | 0.05  | 0.10   | 0.15  | 0.25  | 0.10   | 0.05  | 0.45   | 0.40  | 0.30  | 0.10   | 0.10  | 0.10   |
| 59  | V18 | F9  | F10 | F12 | —    | 0.10  | 0.15  | 0.10   | 0.10  | 0.55   | 0.10  | 0.05  | 0.05   | 0.15  | 0.65   | 0.45  | 0.20  | 0.10   | 0.10  | 0.15   |
| 60  | V19 | F10 | F11 | F12 | —    | 0.10  | 0.05  | 0.05   | 0.25  | 0.55   | 0.45  | 0.25  | 0.10   | 0.15  | 0.05   | 0.45  | 0.20  | 0.10   | 0.15  | 0.10   |
| 61  | V20 | F7  | F11 | F12 | —    | 0.15  | 0.25  | 0.10   | 0.45  | 0.05   | 0.45  | 0.25  | 0.05   | 0.20  | 0.05   | 0.50  | 0.20  | 0.05   | 0.15  | 0.10   |

**Row 62: vertex subsection footer:**
```
[A62] "Vertex sums verified:"
[B62] =COUNTIF(X42:X61, "✓") & " / 20 ✓"  [should display "20 / 20 ✓"]
[C62:X62] (empty)
```

**Row 54 (V13) — first CEN vertex-KPI per Lock #8.16** — apply Light Yellow `#FFF8DC` row-background tint. V13 is the empirical anchor that activates the previously-empty vertex architectural slot in CEN data; BSC.L8 SDG alignment in PVM placed here per Procedure C question-match 10/10.

### Block D — Action Simulator (rows 65-80)

Interactive: user enters edge or vertex ID + Δ → formulas compute predicted element shifts across 2 or 3 affected faces. Uses INDEX/MATCH against the populated Block B + Block C signature tables.

```
Row 65: [merged A65:X65] "ACTION SIMULATOR — Predict element shifts from edge/vertex KPI improvement"  [Magenta Pink header, emphasis — CORE INTERPRETIVE LAYER]

Row 66: [A66:X66] (visual separator; light teal)

Row 67:
  [A67] "Target edge/vertex ID:"  [white label]
  [B67] (empty yellow editable cell)  [Pale Yellow #FFF8DC bg; data-validation accepts E1-2..E11-12 or V1..V20; tooltip: "Type edge ID like 'E7-11' or vertex ID like 'V13'"]
  [C67] (empty)
  [D67] "Auto-detected type:"  [white label]
  [E67] =IF(LEFT(B67,1)="E", "Edge (2 faces affected)", IF(LEFT(B67,1)="V", "Vertex (3 faces affected)", "—"))  [Light Blue formula bg]

Row 68:
  [A68] "Improvement Δ (KPI units):"  [white label]
  [B68] (yellow editable; default 0.1)  [Pale Yellow; numeric validation 0-1; tooltip: "Magnitude of KPI improvement in normalized units. Default 0.1 = 10% improvement."]
  [C68] (empty)
  [D68] "KPI? flag:"  [white label]
  [E68] =IF(LEFT(B67,1)="E", INDEX(D8:D37, MATCH(B67, A8:A37, 0)), IF(LEFT(B67,1)="V", INDEX(E42:E61, MATCH(B67, A42:A61, 0)), "—"))  [Light Blue formula bg]

Row 69:
  [A69] "Scaling factor:"  [white label]
  [B69] =ssot_scaling_factor  [Light Blue formula bg; default 1.0; tooltip: "Translates edge/vertex-KPI Δ-units into element-KPI Δ-units. Configurable in Sheet 01 Assumptions."]

Row 70: (visual separator)

Row 71: [merged A71:X71] "Predicted element shifts per affected face"  [Deep Teal subheader]

Row 72: column headers
  | A: Face | B: Earth Δ | C: Water Δ | D: Fire Δ | E: Air Δ | F: Ether Δ | G: Σ Δ | H: Resulting elements within [0,1]? |

Row 73 — Face A computed shift:
  [A73] = IF(LEFT(B67,1)="E", INDEX(B8:B37, MATCH(B67, A8:A37, 0)), IF(LEFT(B67,1)="V", INDEX(B42:B61, MATCH(B67, A42:A61, 0)), "—"))  [Light Blue formula]
  [B73] = IF(A73="—", 0, B68 * IF(LEFT(B67,1)="E", INDEX(E8:E37, MATCH(B67, A8:A37, 0)), INDEX(F42:F61, MATCH(B67, A42:A61, 0))) * B69)  [Light Blue formula; predicted Earth shift]
  [C73] = IF(A73="—", 0, B68 * IF(LEFT(B67,1)="E", INDEX(F8:F37, MATCH(B67, A8:A37, 0)), INDEX(G42:G61, MATCH(B67, A42:A61, 0))) * B69)  [Water shift]
  [D73] = IF(A73="—", 0, B68 * IF(LEFT(B67,1)="E", INDEX(G8:G37, MATCH(B67, A8:A37, 0)), INDEX(H42:H61, MATCH(B67, A42:A61, 0))) * B69)  [Fire shift]
  [E73] = IF(A73="—", 0, B68 * IF(LEFT(B67,1)="E", INDEX(H8:H37, MATCH(B67, A8:A37, 0)), INDEX(I42:I61, MATCH(B67, A42:A61, 0))) * B69)  [Air shift]
  [F73] = IF(A73="—", 0, B68 * IF(LEFT(B67,1)="E", INDEX(I8:I37, MATCH(B67, A8:A37, 0)), INDEX(J42:J61, MATCH(B67, A42:A61, 0))) * B69)  [Ether shift]
  [G73] = SUM(B73:F73)  [should equal B68 × B69 = total Δ on F_A]
  [H73] = IF(MAX(B73:F73)<=1, IF(MIN(B73:F73)>=0, "✓ in [0,1]", "FAIL: shift < 0"), "FAIL: shift > 1")  [conditional format alert if FAIL]

Row 74 — Face B computed shift (same formulaic pattern; targets cols J-N of Block B for edges or K-O of Block C for vertices):
  [A74] = IF(LEFT(B67,1)="E", INDEX(C8:C37, MATCH(B67, A8:A37, 0)), IF(LEFT(B67,1)="V", INDEX(C42:C61, MATCH(B67, A42:A61, 0)), "—"))
  [B74-F74] = analogous formulas referencing F_B weight columns
  [G74] = SUM(B74:F74)
  [H74] = analogous validation

Row 75 — Face C (vertex only; empty/dash for edges):
  [A75] = IF(LEFT(B67,1)="V", INDEX(D42:D61, MATCH(B67, A42:A61, 0)), "—")
  [B75-F75] = vertex F_C weight references (cols P-T of Block C)
  [G75] = SUM(B75:F75)
  [H75] = analogous validation

Row 76: (visual separator)

Row 77: [A77] "Aggregate predicted-shift integrity:"
  [B77] = COUNTIF(H73:H75, "✓ in [0,1]") & " / " & IF(LEFT(B67,1)="E", "2", IF(LEFT(B67,1)="V", "3", "0")) & " faces"

Row 78: [A78] "Worked example for verification:"
  [B78] "If user enters B67='E7-11' and B68=0.1: F_A=F7 shifts (Earth=0.01, Water=0.035, Fire=0.01, Air=0.035, Ether=0.01); F_B=F11 shifts (Earth=0.04, Water=0.03, Fire=0.01, Air=0.015, Ether=0.005). All within [0,1]. ✓"  [Light Blue, italic]

Row 79: [A79] "If V13 entered + Δ=0.1: F4 shifts (E=0.045, W=0.01, Fi=0.005, A=0.01, Et=0.03); F9 shifts (E=0.02, W=0.01, Fi=0.005, A=0.01, Et=0.055); F10 shifts (E=0.005, W=0.005, Fi=0.005, A=0.035, Et=0.05). ✓"  [Light Blue, italic]

Row 80: [A80] "Forward-replay cue:"  [B80] "After applying these shifts to canonical face elements (Sheet 03), re-run Pentagramic on affected faces (Sheet 04) to derive new face energies. Edge/vertex energies (Sheets 07/08) recompute. New Δ vector + Performance verdicts surface on Sheet 14. Sheet 16 dashboard reflects the post-intervention state."  [Gray italic]
```

### Block E — Honest Disclosure (rows 83-95)

Per Lock #8.24 acceptance criteria + Audit Trail §17 — the abbreviated form of the 8 disclosures from the signatures companion file Section 6.

```
Row 83: [merged A83:X83] "HONEST DISCLOSURE"  [Magenta Pink header — emphasis]

Row 84: "1. RESEARCHER JUDGMENT, NOT MEASURED DATA."
  "All 50 signatures are partnership-validated researcher judgments based on KPI semantics + face semantics + element semantics (Earth=material, Water=flow, Fire=ignition, Air=communication, Ether=meaning) + breath-axis nature. Different researchers might assign different weights. Transparent (visible here), reproducible (rationale per face documented in companion file), sensitivity-testable (vary ±10%)."

Row 85: "2. CONFIDENCE DISTRIBUTION."
  "Only 5 signatures carry actual CEN KPI values: E7-11 (BSC.F4), E2-10 (BSC.L7), E10-12 (BSC.I3), E5-8 (BSC.C8), V13 (BSC.L8). These are HIGH-confidence (breath-axis cross-validated). The other 45 (26 edges + 19 vertices) are ANTICIPATORY intervention maps — if CEN later adds a KPI here, this is the predicted distribution. MEDIUM-confidence."

Row 86: "3. KPI STRUCTURAL UNIQUENESS (Lock #8.9)."
  "Per Lock #8.9, each BSC KPI lives in EXACTLY ONE structural position: face XOR edge XOR vertex. CEN's 34 BSC KPIs distribute as 29 face-KPIs + 4 edge-KPIs + 1 vertex-KPI. The remaining 26 edges + 19 vertices have NO assigned KPI — their anticipatory signatures cannot be empirically grounded against current CEN data."

Row 87: "4. CEN-CLEAN COMPRESSION CONTEXT."
  "Per Lock #8.5 canonical s58 pentagramic computation, CEN's 12 face energies sit in Wall (9 faces) + Gate (3 faces) bands at O1. The 4 edge-KPIs + 1 vertex-KPI actions produce SHIFTS within compressed bands — they unlock movement but don't single-handedly lift faces to Membrane. Signatures map WHERE intervention lands; system geometry constrains HOW MUCH it lifts."

Row 88: "5. BREATH-AXIS CROSS-VALIDATION COVERAGE."
  "For the 5 KPI-carrying signatures (E7-11 double-projection ✓; E2-10 double-reception ✓; E10-12 double-reception ✓; E5-8 double-projection ✓; V13 spans Axes 4+5 ✓), breath-axis cross-validation per Lock #8.10 was performed. For 45 anticipatory signatures, cross-validation was less exhaustive. Future iteration: partnership-review when CEN adds new edge/vertex KPI."

Row 89: "6. SENSITIVITY-TESTING RECOMMENDATION."
  "Vary signatures by ±10% per element; observe predicted-shift change at face/edge/vertex energy level. Acceptance criterion: predicted shifts directionally stable under variance. Action: run sensitivity sweep during SSOT W2 build for 5 KPI-carrying signatures (highest stakes)."

Row 90: "7. NOT AN ALGEBRAIC INVERSE."
  "Forward math (elements → face energies) is many-to-one — invertibility doesn't exist without additional structure. The signatures ARE that additional structure. Anyone questioning 'how does improving E7-11 affect F7?' reads the signature. Anyone wanting strict algebraic invertibility should ask a different question."

Row 91: "8. CEN-AUTHENTIC NAMING (Lock #2)."
  "All face references in Block B/C use canonical face numbers; full CEN-authentic Mirror polarity names (F7 Quiet Credibility, F11 Dormant Pipeline, etc.) live in Sheet 0a Naming Translation and Sheet 16 Dashboard_View. This sheet maintains numerical face notation for table compactness; cross-ref Sheet 0a for organizational semantics."

Row 92: "9. FLAGGED HIGHER-UNCERTAINTY SIGNATURES."
  "E1-7 F1 Air (0.35 vs 0.25 alternative). E2-11 F2 Ether (0.30 vs lower-Ether/higher-Earth alternative). E5-8 F5 Air (0.25 vs higher-Earth alternative). V8 F4 Air (0.25 vs higher-Earth alternative). V14 F10 Ether (0.50 vs higher-Air alternative). All anticipatory 45 inherently higher uncertainty. See companion file Section 6.7 for details."

Row 93: "10. FORWARD MATH UNCHANGED."
  "This sheet's bi-directional intervention layer does NOT modify the canonical forward math chain (audit trail §1-16). Pentagramic Coherence formula, Edge geometric-mean energy, Vertex vortex strength — all unchanged. Sheet 09 adds the explicit BACKWARD intervention layer."

Row 94: "11. THESIS-DEFENSE STATUS."
  "Bi-Directional Co-Evolution architecture is the FIFTH thesis-defense centerpiece per Audit Trail §17, alongside F9 architectural blindness, F10 sibling-blindness, L8→V13 first vertex-KPI, and F4+F12 third-pattern. Applied methodology = bachelor's scope. Deriving signature weights from phi (currently researcher judgment) = master's-only future work."

Row 95: "Full rationale per signature: see Final Thesis/Thesis Work/spiral-reports/CEN_SSOT_BiDirectional_Signatures_30Edge_20Vertex_2026-05-22.md (959 lines, Sections 1-8)."  [Gray italic]
```

### Block F — Cross-references (rows 98-105)

```
Row 98: [merged A98:X98] "CROSS-REFERENCES"  [Deep Teal header]

Row 99: "Architecture design: CEN_SSOT_BiDirectional_CoEvolution_Architecture_2026-05-22.md (locks the conceptual frame)."

Row 100: "All 50 signatures rationale: CEN_SSOT_BiDirectional_Signatures_30Edge_20Vertex_2026-05-22.md (per-edge + per-vertex weight tables with rationale)."

Row 101: "Audit Trail Section 17: POC/docs/math/CALCULATION_AUDIT_TRAIL.md §17 (Bi-Directional Co-Evolution mathematical architecture + worked examples + thesis-defense framing)."

Row 102: "Forward math sheets — Sheet 03 (60-Element Grid feeds simulator outputs back), Sheet 04 (Face Calculations consume updated elements), Sheet 07 (Edges recompute), Sheet 08 (Vertices recompute), Sheet 14 (Spectral Δ vector + Performance verdicts surface after intervention)."

Row 103: "Lock references — Lock #8.5 (data pipeline), Lock #8.9 (KPI structural uniqueness Face XOR Edge XOR Vertex), Lock #8.10 (Spectral Δ vector core SSOT content), Lock #8.16 (L8→V13 first vertex-KPI), Lock #8.24 (this sheet's architectural authority), Lock #2 (CEN-authentic naming)."

Row 104: "Memory entry: project_cen_ssot_bidirectional_architecture.md (durable cross-session anchor)."

Row 105: "Canonical KPI placements — CEN_SSOT_W06v3_34KPI_QuestionDerived_Mapping_2026-05-21.md + companies/cen/mapping-context.json (vertex array lines 178-199)."
```

---

## Named ranges defined on this sheet

| Name | Range | Type | Purpose |
|------|-------|------|---------|
| `ssot_scaling_factor` | (defined in Sheet 01) | scalar | Default 1.0; translates edge/vertex Δ-units to element Δ-units; configurable |
| `edge_signature_table` | $A$8:$Q$37 | range | 30-edge signature data block for INDEX/MATCH lookups from Action Simulator |
| `vertex_signature_table` | $A$42:$X$61 | range | 20-vertex signature data block for INDEX/MATCH lookups |
| `simulator_target_id` | $B$67 | scalar | User-entered edge/vertex ID |
| `simulator_delta` | $B$68 | scalar | User-entered improvement Δ |
| `simulator_target_type` | $E$67 | scalar | Auto-detected "Edge" or "Vertex" |
| `simulator_kpi_flag` | $E$68 | scalar | KPI-carrying or anticipatory |
| `cen_predicted_shifts_FA` | $B$73:$F$73 | range | 5-element shift vector for face A |
| `cen_predicted_shifts_FB` | $B$74:$F$74 | range | 5-element shift vector for face B |
| `cen_predicted_shifts_FC` | $B$75:$F$75 | range | 5-element shift vector for face C (vertex only) |
| `cen_edge_sum_validation` | $B$38 | scalar | "30 / 30 ✓" expected |
| `cen_vertex_sum_validation` | $B$62 | scalar | "20 / 20 ✓" expected |

These named ranges enable downstream sheets (notably Sheet 14 Spectral_Analysis and Sheet 16 Dashboard_View) to surface "intervention-aware" diagnostics — e.g., Sheet 16 can display "Latest Action Simulated: E7-11 +0.1" by reading `simulator_target_id` + `simulator_delta` from Sheet 09.

---

## Build dependencies

Sheet 09 builds **AFTER** the forward-math sheets:

1. **Sheet 01 (Assumptions_Constants)** — `ssot_scaling_factor` named range (default 1.0)
2. **Sheet 03 (60-Element Grid)** — provides face/element coordinate space for simulator feedback loop
3. **Sheet 04 (Face_Calculations)** — face IDs F1-F12 + canonical face energies (used for context, not directly read by signatures)
4. **Sheet 07 (Edges)** — 30 canonical edges + edge IDs (E1-2..E11-12); Sheet 09 maps signatures TO these edges
5. **Sheet 08 (Vertices)** — 20 canonical vertices + vertex IDs (V1..V20); Sheet 09 maps signatures TO these vertices
6. **Sheet 0a (Naming Translation)** — cross-ref for CEN-authentic Mirror names per face

Sheet 09 is read **BY** (after build):

- **Sheet 14 Spectral_Analysis** — can compute Δ vector pre/post a simulated intervention by reading `cen_predicted_shifts_F*` and forward-replaying
- **Sheet 16 Dashboard_View** — surfaces intervention-readiness signal ("CEN has 5 KPI-carrying signatures HIGH-confidence; 45 anticipatory MEDIUM-confidence"); references simulator state

Build Sheet 09 in W2 sequence **AFTER Sheets 04, 07, 08 stabilize**, **BEFORE Sheet 14 final verdict run** (so Sheet 14 can optionally surface intervention-aware Δ vector), **BEFORE Sheet 16 final dashboard population**.

---

## Conditional formatting rules

| Cell range | Condition | Format |
|------------|-----------|--------|
| O8:O37 (ΣF_A edge sums) | = 1.0 ± 1e-6 | Green `#90EE90` |
| O8:O37 | ≠ 1.0 ± 1e-6 | Red `#FFB6B6` |
| P8:P37 (ΣF_B edge sums) | = 1.0 ± 1e-6 | Green |
| P8:P37 | ≠ 1.0 ± 1e-6 | Red |
| Q8:Q37 (edge Status) | = "✓" | Green text on Light Blue bg |
| Q8:Q37 | = "FAIL" | White text on Magenta Pink bg |
| U42:U61 (ΣF_A vertex sums) | = 1.0 ± 1e-6 | Green |
| V42:V61 (ΣF_B vertex sums) | = 1.0 ± 1e-6 | Green |
| W42:W61 (ΣF_C vertex sums) | = 1.0 ± 1e-6 | Green |
| X42:X61 (vertex Status) | = "✓" | Green |
| X42:X61 | = "FAIL" | Magenta Pink |
| E8:N37 (edge weight cells) | Heat map gradient | Light Teal `#B8E0E1` low (0.05) → Deep Teal `#0D7377` high (0.55) |
| F42:T61 (vertex weight cells) | Heat map gradient | Same Light Teal → Deep Teal |
| D8:D37 (edge KPI? flag) | = "✓" | Green text bold |
| D8:D37 | = "—" | Gray text |
| E42:E61 (vertex KPI? flag) | = "✓" | Green text bold (V13 only) |
| E42:E61 | = "—" | Gray text |
| Rows 15, 26, 31, 37 (4 edge-KPI rows) | Always | Light Yellow `#FFF8DC` row background |
| Row 54 (V13 row) | Always | Light Yellow row background |
| B73:F75 (predicted shift cells) | Value > 1.0 OR < 0.0 | Magenta Pink alert |
| B73:F75 | 0.0 ≤ Value ≤ 1.0 | Light Blue |
| H73:H75 (in-range validation) | Contains "✓" | Green |
| H73:H75 | Contains "FAIL" | Magenta Pink |
| B67, B68 (yellow editable simulator inputs) | Always | Pale Yellow `#FFF8DC` border + bg |
| B6, B40, B65, B83, B98 (Block headers) | Always | Per palette assignments above |

---

## Verification checks (W2 acceptance criteria)

After Sheet 09 build:

1. **Sum validation gates pass** — All 30 edges show ✓ in column Q; all 20 vertices show ✓ in column X. Aggregate footer cells B38 = "30 / 30 ✓" and B62 = "20 / 20 ✓". Any FAIL is a data-entry error (re-check the source rows against companion signatures file Section 5).

2. **KPI? flag matches Lock #8.9 inventory** — Exactly 4 edges show ✓ in column D (rows 15 E2-10, 26 E5-8, 31 E7-11, 37 E10-12); exactly 1 vertex shows ✓ in column E (row 54 V13). Total = 5 KPI-carrying signatures + 45 anticipatory. Any deviation from 4 edges + 1 vertex is a KPI-assignment error.

3. **Action Simulator returns valid output for E7-11 + Δ=0.1** — User enters B67="E7-11" + B68=0.1. Row 73 (F7) shows: B73=0.01, C73=0.035, D73=0.01, E73=0.035, F73=0.01, G73=0.1, H73="✓". Row 74 (F11) shows: B74=0.04, C74=0.03, D74=0.01, E74=0.015, F74=0.005, G74=0.1, H74="✓". Row 75 (F_C) shows "—". This matches Block D Row 78 worked example.

4. **Action Simulator returns valid output for V13 + Δ=0.1** — User enters B67="V13" + B68=0.1. Row 73 (F4): B73=0.045, C73=0.01, D73=0.005, E73=0.01, F73=0.03, G73=0.1, H73="✓". Row 74 (F9): B74=0.02, C74=0.01, D74=0.005, E74=0.01, F74=0.055, G74=0.1, H74="✓". Row 75 (F10): B75=0.005, C75=0.005, D75=0.005, E75=0.035, F75=0.05, G75=0.1, H75="✓". Matches Row 79 worked example.

5. **Heatmap visual rendering** — Open xlsx in Excel; weight cells (Cols E-N rows 8-37; Cols F-T rows 42-61) show visible heat-map gradient (Light Teal low → Deep Teal high). High-weight cells (e.g., 0.55 on F18 V18 F10 Ether, 0.65 on V18 F10 Ether) visibly darker than low-weight cells (0.05 on E12 V12 F3 Ether).

6. **Cross-sheet read integrity** — Named ranges `cen_predicted_shifts_F*` resolve to non-zero numeric values when simulator is populated. No #REF or #N/A errors on Sheet 14 / Sheet 16 imports.

7. **Honest disclosure visibility** — Block E rows 83-95 all populated; researcher-judgment status visible at-a-glance to SSOT users.

8. **Build-dependency satisfaction** — Sheet 09 builds without errors when Sheets 01, 03, 04, 07, 08 are present. Build fails (caught by validator) if any prerequisite sheet is missing.

---

## Honest disclosure for SSOT users (what Sheet 09 does NOT show)

Per the Sheet 14/16 design pattern:

- **Phi-derivability of signature weights** — Sheet 09 does NOT show signatures derived from phi. The weights are researcher judgment per audit trail §17. Phi-derived priors are master's-only future work (currently out of scope per bachelor's tier discipline).

- **Sensitivity-test sweep results** — Sheet 09 does NOT show what happens if you vary each signature by ±10%. Lock #8.24 acceptance criterion recommends this; the sweep is a W2-late deliverable (not on this sheet). When complete, sweep results live in `Final Thesis/Thesis Work/spiral-reports/CEN_SSOT_BiDirectional_Sensitivity_Sweep_*.md`.

- **Cross-organizational signature comparison** — Sheet 09 does NOT compare CEN's signatures to other clients. Per §17 Versioning Notes, cross-org comparison is v2.0 future work when additional clients onboard. Currently CEN-only.

- **Per-element CEN baseline values** — Sheet 09 does NOT display CEN's current face-element values. Those live in Sheet 03 (60-Element Grid). The Action Simulator displays SHIFTS (Δ) only; absolute post-action values require Sheet 03 + Sheet 04 forward-replay (Row 80 cue).

- **Partnership-validation status per signature** — Sheet 09 marks 5 KPI-carrying signatures HIGH-confidence and 45 anticipatory MEDIUM-confidence, but does NOT log per-signature partnership-review timestamps. That granularity lives in companion signatures file Section 6.7 (flagged uncertainties) + future partnership-review record.

- **Element-level KPI names** — Sheet 09 does NOT show the actual element-level KPI names (e.g., "F7 Water = NPS rate"). Those live in Sheet 03 (60-Element Grid) with full Songbook v2.1 element-tagging. Sheet 09 operates at the element-coordinate level (Earth/Water/Fire/Air/Ether per face), abstract from specific KPI names.

- **Forward-replay outputs** — Sheet 09 does NOT execute the forward replay. The Action Simulator shows predicted shifts; actually applying them and re-running Pentagramic + edge/vertex recomputation requires the user (or future automation) to feed shifts back into Sheet 03 and trigger Sheet 04/07/08/14/16 recompute. Row 80 "Forward-replay cue" documents this — Sheet 09 is the INTERVENTION-MAP layer, not the execution layer.

---

## Cross-references

- **Lock #8.24** (Bi-Directional Co-Evolution architecture) — this sheet's architectural authority
- **Lock #8.9** (KPI structural uniqueness Face XOR Edge XOR Vertex) — drives the 4+1 KPI? flag inventory
- **Lock #8.16** (L8 → V13 first vertex-KPI) — V13 row 54 highlighting
- **Lock #8.10** (Spectral Δ vector core SSOT content) — Sheet 14 reads from Sheet 09 named ranges for intervention-aware Δ vector
- **Lock #8.5** (data pipeline) — forward math chain Sheet 09 complements
- **Lock #2** (CEN-authentic naming) — face numerical notation here; Mirror polarity names in Sheet 0a + Sheet 16
- **Audit Trail §17** (POC/docs/math/CALCULATION_AUDIT_TRAIL.md lines 2792-2915) — mathematical architecture of bi-directional intervention; worked examples; thesis-defense framing
- **Architecture design doc:** `CEN_SSOT_BiDirectional_CoEvolution_Architecture_2026-05-22.md`
- **Signatures source data:** `CEN_SSOT_BiDirectional_Signatures_30Edge_20Vertex_2026-05-22.md` (959 lines, 120 face-element distributions Sections 1-5, honest disclosures Section 6, SSOT Sheet 09 feeding Section 7, cross-refs Section 8)
- **Companion sheet designs:** `CEN_SSOT_Sheet14_Spectral_Layout_Design_2026-05-21.md` (Spectral Δ vector — surfaces post-intervention diagnostics) + `CEN_SSOT_Sheet16_Dashboard_Layout_Design_2026-05-21.md` (Dashboard — surfaces intervention-readiness)
- **Memory entry:** `project_cen_ssot_bidirectional_architecture.md` (durable cross-session anchor)
- **§27 Orchestrator pattern:** this design doc itself is W2 prep delegated from Opus orchestration during Sonnet-equivalent build planning; matches Sheet 14/16 layout-design depth

---

*Drop-in-ready W2 build specification. Drafted 2026-05-22 under Lock #8.24 partnership decision. Ready for: (a) Sonnet-delegable Sheet 09 build (or direct execution if delegation fails per session-29 fallback pattern); (b) acceptance-criteria verification (8 checks Block above); (c) named-range propagation to Sheets 14 + 16; (d) optional sensitivity-test sweep in W2-late; (e) future iteration if CEN adds new edge/vertex KPIs.*
