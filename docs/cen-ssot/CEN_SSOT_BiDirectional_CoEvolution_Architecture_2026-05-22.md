# CEN SSOT — Bi-Directional Co-Evolution Architecture

**Status:** Architectural design — drop-in-ready for W2 Sheet 09 build
**Authority:** Partnership-decided 2026-05-22 (session continuation); to be locked as #8.24 in Consolidation Map
**Author:** Opus orchestrator (in partnership with Deimantas)
**Date:** 2026-05-22

---

## The Problem

Current math chain is unidirectional:
```
5 element KPIs per face → Pentagramic Coherence → Face Energy E_f
                                                       ↓
                                              30 Edges + 20 Vertices
```

When CEN takes organizational action to improve an Edge KPI (e.g., E7-11 donations via brand-funding integration) or Vertex KPI (e.g., V13 SDG alignment in PVM), the action SHOULD affect the underlying face element values. But the math has no algebraic inverse — knowing `E_edge` and `E_A` lets you solve for `E_B`, but face energy alone doesn't specify which of its 5 elements changed.

**Result without explicit bi-directional architecture:** CEN sees diagnostic results (face energies, edge/vertex strengths) but has no canonical map of *how to act* — which specific element-level KPIs each edge/vertex action would touch.

---

## The Architecture — Elemental Influence Signatures

The mathematical forward chain stays pure (unidirectional, deterministic). The **intervention logic** becomes explicitly bidirectional through documented signatures.

### Edge KPI Elemental Signature

For each of the 30 canonical edges (especially the 4 carrying actual CEN KPI values per Lock #8.9: E7-11, E2-10, E10-12, E5-8), declare a 10-tuple weight:

```
EdgeSignature(E_AB) = {
  F_A: {Earth: w_AE, Water: w_AW, Fire: w_AF, Air: w_AA, Ether: w_AEt},
  F_B: {Earth: w_BE, Water: w_BW, Fire: w_BF, Air: w_BA, Ether: w_BEt}
}

Normalization: weights per face sum to 1.0 (∑w_A = 1.0; ∑w_B = 1.0)
Interpretation: probability distribution of where the action lands across that face's elements
```

**Worked example — Edge E7-11 (Brand ↔ Funding) carrying BSC.F4 Donation income:**

| Side | Earth | Water | Fire | Air | Ether |
|---|:---:|:---:|:---:|:---:|:---:|
| **F7 Brand** | 0.10 | 0.35 | 0.10 | 0.35 | 0.10 |
| **F11 Funding** | 0.40 | 0.30 | 0.10 | 0.15 | 0.05 |

**Reading:** When CEN takes action on donations, the improvement predominantly touches:
- **F7 Brand:** Water (donor relationships, reputation circulation) + Air (public visibility, brand communication)
- **F11 Funding:** Earth (material revenue base) + Water (revenue circulation rhythm)

### Vertex KPI Elemental Signature

For each of the 20 canonical vertices (especially V13 carrying BSC.L8 SDG alignment per Lock #8.16), declare a 15-tuple weight:

```
VertexSignature(V_ABC) = {
  F_A: {Earth, Water, Fire, Air, Ether} weights summing to 1.0,
  F_B: {Earth, Water, Fire, Air, Ether} weights summing to 1.0,
  F_C: {Earth, Water, Fire, Air, Ether} weights summing to 1.0
}
```

**Worked example — Vertex V13 (F4 ∩ F9 ∩ F10) carrying BSC.L8 SDG alignment in PVM:**

| Face | Earth | Water | Fire | Air | Ether |
|---|:---:|:---:|:---:|:---:|:---:|
| **F4 Structural** | 0.45 | 0.10 | 0.05 | 0.10 | 0.30 |
| **F9 Regenerative** | 0.20 | 0.10 | 0.05 | 0.10 | 0.55 |
| **F10 Values** | 0.05 | 0.05 | 0.05 | 0.35 | 0.50 |

**Reading:** When CEN adds an SDG statement to PVM, the improvement touches:
- **F4 Structural:** Earth (codification structure of PVM document) + Ether (governance meaning of alignment)
- **F9 Regenerative:** Ether (ecological commitment articulation) — heavy ether emphasis
- **F10 Values:** Air (vision communication via PVM) + Ether (deep values integration)

### Update Mechanics

When CEN improves an Edge/Vertex KPI by **Δ_value** (a Δ-units change in the underlying KPI value):

```
For edge E_AB with action of magnitude Δ on the edge KPI:
  For each element e in {Earth, Water, Fire, Air, Ether}:
    F_A.k_e += Δ · w_A_e · scaling_factor
    F_B.k_e += Δ · w_B_e · scaling_factor

scaling_factor = configurable constant (default 1.0) translating
                  edge-KPI Δ-units into element-KPI Δ-units
```

For vertex similar but across 3 faces.

The next pentagramic computation re-derives face energies from updated elements. Edge/vertex values recompute. **Closed-loop forward math, partnership-mapped backward intervention.**

---

## Why This Is Mathematically and Methodologically Defensible

1. **Forward math remains pure** — Pentagramic formula (§4-5 audit trail), edge geometric mean (§7), vertex vortex (§8) all unchanged. No engine modifications to the canonical calculation chain.

2. **Intervention logic is documented** — Elemental Influence Signatures are a canonical methodological artifact. Researcher judgment, partnership-validated, transparent. Same epistemological status as the Songbook v2.1 element-tagging (which assigns each KPI to a face-element coordinate — analogous).

3. **Bi-directionality is explicit, not algebraic** — Anyone questioning "how does improving Edge E7-11 affect Face F7?" reads the signature. No hidden cascade.

4. **CEN gets actionable intelligence** — The SSOT becomes both a DIAGNOSTIC tool (current state via forward derivation) AND an INTERVENTION map (action targeting via signatures).

5. **Sensitivity-testable** — Different signature weightings produce different predicted element shifts. CEN can run "if we improve E7-11 by 0.1, what happens to F7 Water?" simulations.

6. **Thesis-defense gold** — *"The Spiral Dashboard is a bi-directional instrument: forward calculation reveals organizational state; backward elemental signatures map intervention targets. The BSC offers only the diagnostic half — it tells you WHAT is happening but not WHERE TO ACT to change it. The Spiral architecture closes that loop."*

---

## SSOT Implementation — Sheet 09

**Sheet 09: Bi-Directional Intervention Map**

Single consolidated sheet covering all 50 inter-face/triadic relationships (30 edges + 20 vertices).

### Structure

**Block A — Header (rows 1-3):**
```
Row 1: "Sheet 09 — Bi-Directional Intervention Map (Elemental Influence Signatures)"
Row 2: "30 Edges + 20 Vertices · Per-face 5-element weight distributions · Action-to-element propagation"
Row 3: "Source: Lock #8.24 · Cross-ref: Sheets 07 (Edges) + 08 (Vertices) + 03 (60-Element Grid)"
```

**Block B — Edge Intervention Subsection (rows 5-37):**

Per edge (30 rows + header):

| Edge_ID | F_A | F_B | KPI assigned? | F_A Earth | F_A Water | F_A Fire | F_A Air | F_A Ether | F_B Earth | F_B Water | F_B Fire | F_B Air | F_B Ether | Sum F_A | Sum F_B |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|

Sum cells (formula `=SUM(...)`) verify each face's weights sum to 1.0 (validation gate).

**Block C — Vertex Intervention Subsection (rows 40-62):**

Per vertex (20 rows + header):

| Vertex_ID | F_A | F_B | F_C | KPI assigned? | F_A Earth | ... (×5) | F_B Earth | ... (×5) | F_C Earth | ... (×5) | Sum F_A | Sum F_B | Sum F_C |

**Block D — Action Simulator (rows 65-75):**

Interactive: user enters edge or vertex ID + Δ (action magnitude), formula computes predicted element shifts across 2 or 3 faces. Cells named `simulator_edge_id`, `simulator_delta`, etc.

**Block E — Honest Disclosure (rows 78-85):**

The signatures are RESEARCHER JUDGMENT, partnership-validated. Different researchers might assign different weights. The methodology requires:
- Transparency (signature values visible in this sheet)
- Reproducibility (rationale per edge/vertex documented in a companion file)
- Sensitivity testing (vary signatures and observe predicted-shift sensitivity)

### Build dependencies

Sheet 09 builds AFTER:
- Sheet 03 (60-Element Grid)
- Sheet 04 (Face Calculations)
- Sheet 07 (Edges with energy/tension)
- Sheet 08 (Vertices)

Sheet 09 reads from Sheets 07 + 08 (which edges/vertices have KPI values) and writes its own intervention-map weights. Connects back to Sheet 03 via the Action Simulator (Block D).

---

## Methodological Process for Deriving Signatures

For each Edge/Vertex KPI:

1. **Read the KPI description** (what does this specifically measure for CEN?)
2. **Read the two/three connected faces** in CEN-authentic naming (what organizational dimensions are they?)
3. **For each connected face, ask:** "When CEN takes action on this KPI, which of the 5 elements (Earth/Water/Fire/Air/Ether) does the action MOST DIRECTLY touch?"
4. **Distribute weight** (e.g., heavy emphasis on one element = 0.5, medium = 0.3, light = 0.1, none = 0) — must sum to 1.0 per face
5. **Cross-validate against breath-axis nature** — if the edge crosses an axis (e.g., E7-11 is Axis 1 Resource Flow), check if signature aligns with projection/reception pole semantics
6. **Document rationale** — one sentence per face explaining the weight distribution

For the 4 CEN edge-KPIs (E7-11, E2-10, E10-12, E5-8) and 1 vertex-KPI (V13), this is detailed work. For the other 26 edges + 19 vertices (which currently carry NO CEN KPI value, just conceptual KPI names), signatures are still useful as ANTICIPATORY intervention maps — "if CEN later adds a KPI here, this is how it would distribute."

---

## Sensitivity considerations

The signature choice affects:
- Predicted element-shift magnitudes for any given action
- Therefore predicted face-energy changes
- Therefore predicted downstream edge/vertex/AAG/AvG changes
- Therefore predicted dashboard band classifications post-action

**To mitigate over-fitting to specific signature choices:**
- Use weighted distributions that distribute meaningfully (don't put 1.0 on one element)
- Validate via partnership review with CEN founders
- Run sensitivity analysis: vary signatures by ±10% and observe predicted-shift change
- Acceptance criterion: predicted shifts directionally stable under ±10% signature variance

---

## Thesis-defense framing

Position this in Chapter 5:

> *"The Spiral Dashboard architecture is **bi-directional**. Forward computation (Pentagramic → Face → Edge/Vertex) is mathematical derivation — deterministic, reproducible, auditable per CALCULATION_AUDIT_TRAIL.md Sections 1-16. Backward intervention (Edge/Vertex KPI improvement → Element shifts) is explicit methodological mapping — the Elemental Influence Signature per inter-face/triadic relationship.*
> 
> *The BSC offers only the forward direction (KPI values diagnose state). It has no canonical map of how to act because its 4-perspective causal arrows are uni-directional aggregations without compositional structure. The Spiral Dashboard's bi-directional architecture closes the diagnostic-intervention loop: any organization using the Spiral knows not only WHAT its state is but WHERE TO ACT to change specific elements of that state.*
> 
> *For CEN: the F8 Core Operations gap (D=7/E=1, |Δ|=6 — flagship finding) becomes actionable through the Bi-Directional map. Improving E7-11 donations (the closest edge bridging the operational dimension via Brand-Funding integration) propagates predicted element shifts in F7 Brand and F11 Funding per the signature. CEN sees not just 'F8 is low' but 'here are the specific elemental movements that follow from each available action.'"*

This becomes a **fifth thesis-defense centerpiece finding** alongside:
1. F9 architectural blindness
2. F10 sibling-blindness at O1
3. L8 → Vertex V13 (first vertex-KPI in CEN)
4. F4 + F12 third-pattern sibling-blindness (under-development)
5. **NEW: Bi-Directional Co-Evolution architecture (diagnostic + intervention loop)**

---

## Memory entry needed

`project_cen_ssot_bidirectional_architecture.md` — durable cross-session anchor.

---

## Cross-references

- Lock #8.5 (data pipeline) — the forward chain this complements
- Lock #8.9 (KPI structural uniqueness — face XOR edge XOR vertex)
- Lock #8.10 (Spectral Δ vector core content)
- Lock #8.16 (L8 → V13 first vertex-KPI)
- Audit trail §4-5 (Pentagramic + Star Pairs — the forward formula)
- Audit trail §7 (Edge Tension core formula)
- Audit trail §8 (Vertex Vortex core formula)
- Audit trail §14-15 (Advanced edge + vertex extensions)
- Sheet 14 Spectral_Analysis (Performance verdict — current state)
- Sheet 16 Dashboard_View (where intervention map outputs surface)

---

*Architecture locked 2026-05-22. Ready for: (a) Lock #8.24 in Consolidation Map; (b) memory entry; (c) Sonnet-delegable signature drafting for 30 edges + 20 vertices for CEN; (d) Sheet 09 build in W2 sequence; (e) audit trail Section 17 documentation.*
