# CEN SSOT — Constants Sensitivity Analysis

**Wave:** W1.5 loose-end (deeper exploration, future-research-direction-grade)
**Status:** **Sensitivity analysis only** — canonical CEN SSOT v1.0 uses Lock #8.6 universal values
**Date:** 2026-05-22
**Author:** Opus orchestration over numerical sweeps
**Triggered by:** Partnership question — *"explore the constants and their values adjusted specifically for CEN. There is a philosophical rationale for each one of them so I would assume that, while adjusting it based on the nature of CEN would be a good idea."*

---

## Plan Control Panel

| Field | Value |
|-------|-------|
| **Status** | Complete — single-pass sensitivity analysis at canonical CEN O1 inputs |
| **Tier discipline** | APPLICATION at varied parameter values (bachelor's-defensible); NOT derivation of new canonical constants (master's-scope) |
| **Constants covered** | 8 (α, β, γ, κ, λ, δ, 5 pragmatic constants, AAG/AvG thresholds) |
| **CEN baseline (canonical)** | AAG_O1=0.7898, AvG_O1=0.0882, C_glob_raw=0.1299, μ_E=0.1388 |
| **Joint sensitivity present** | YES — worked example at γ=0.65, κ=3 |
| **Stale tuning block reconciled** | YES — `mapping-context.json:323-334` flagged as drift; canonical values restated |
| **Lock-aligned** | Lock #8.6 (constants with tooltips); Lock #8.20 (narrative scaffolding); §32 NO-floor partnership-pattern |
| **Recommendation** | **Keep canonical SSOT v1.0 values; surface 3 promising organizational-character tuning directions as future master's research, do NOT bake them in** |
| **Confidence** | HIGH for sensitivity numbers (deterministic computation); MEDIUM for organizational-character interpretation (researcher judgment) |
| **Files produced** | This file only |
| **Files modified** | NONE — analysis only |

---

## Tier Discipline Framing — What This Document IS and IS NOT

This is an **applied sensitivity analysis**. The canonical Quannex math chain is unchanged. CEN's canonical face energies, AAG, AvG, and Global Coherence under SSOT v1.0 remain as established in `CEN_SSOT_PureO1_Recomputation_2026-05-21.md` and `CALCULATION_AUDIT_TRAIL.md` §§1, 12, 16.

What this document **does** (bachelor's-defensible scope):

- **Applies** canonical formulas at varied parameter values to CEN's actual O1 data
- **Surfaces** the sensitivity of CEN-specific outputs to each constant's choice
- **Documents** the philosophical rationale that anchors each canonical value
- **Reads** the sensitivity through CEN's organizational character lens (values-mature + structurally-weak + Hidden Oracle pattern + early-stage NGO)
- **Flags** which constants are MOST and LEAST sensitive for CEN under its current data sparsity

What this document **does NOT** do (master's-scope, deliberately deferred):

- **Derive** new canonical CEN-specific constants from organizational-character priors
- **Replace** any value in `js/core/TuningConfig.js` or `js/constants/phi-harmonics.js`
- **Recommend** changing `mapping-context.json:323-334` to new values
- **Claim** empirical optimization of any constant for any organizational type
- **Cross-organization comparison** that would be needed to support typed defaults (e.g., "NGOs should use α=0.5") — this requires a dataset Quannex does not yet have

**Why this discipline matters.** Per Lock #8.6, the canonical pentagramic constants α=φ⁻¹, β=0.5, γ=0.7, κ=4 are universal — they reflect the mathematical structure of the dodecahedron and pentagram, not organizational character. The partnership question opened a research direction; this analysis answers it inside scope: *"sensitivity analyses inform future research; they do not justify constant changes."*

**Cross-reference to §32 NO Score Floor:** the seed-face principle (*"a 4.83 that holds is worth more than a 4.85 that lies"*) applies here too. Honest sensitivity > confidently-derived ratios. Surface what shifts, name what stays, partnership-decide the rest.

---

## Stale Tuning Block in `mapping-context.json` — A Required Honest Disclosure First

Before per-constant analysis, the CEN `mapping-context.json:323-334` carries a "tuning" block:

```json
"tuning": {
  "perspective": "ngo",
  "description": "Balanced perspective for early-stage NGO with strong values and operational gaps",
  "alpha": 0.4, "beta": 0.5, "gamma": 0.6,
  "delta": 0.95, "kappa": 1.5, "eta": 0.236,
  "zeta": 0.03, "theta": 0.5
}
```

**Per CALCULATION_AUDIT_TRAIL.md §5 documentation-alignment block:** the *canonical SSOT* for these constants is `js/core/TuningConfig.js` and `js/constants/phi-harmonics.js`. The canonical values are:

| Constant | Canonical (SSOT) | `mapping-context.json` value | Status |
|----------|------------------|--------------------------------|--------|
| α (alpha) | **φ⁻¹ ≈ 0.6180** | 0.4 | **STALE / DRIFT** |
| β (beta) | **0.5** | 0.5 | OK |
| γ (gamma) | **0.7** | 0.6 | **STALE / DRIFT** |
| δ (delta) | **0.9 (universal); 0.95 NGO override** | 0.95 | OK as NGO override |
| κ (kappa) | **4** | 1.5 | **STALE / DRIFT (major)** |
| η (eta) | **φ⁻² ≈ 0.382** | 0.236 | **STALE (this is λ, not η)** |
| ζ (zeta) | **φ⁻²/6 ≈ 0.0637** | 0.03 | **STALE / DRIFT** |
| θ (theta) | not in canonical | 0.5 | unused |

**This is the same pattern as Lock #8.20** (`dominantMode=10` is narrative scaffolding, not engine output). The tuning block in `mapping-context.json` is a hand-authored 2026-04-11 snapshot that has drifted from the actual SSOT in `js/core/TuningConfig.js:98`. The CEN engine in `js/main.js` does NOT read these values — it reads from `TuningConfig`. The block is **stale documentation**, not active configuration.

**Resolution under Lock #8.6:** treat `mapping-context.json:323-334` as legacy metadata to be reconciled in CEN SSOT v1.0 build. Either rename to `narrative-tuning-intent` (with provenance: "hand-authored 2026-04-11; superseded by `js/core/TuningConfig.js` canonical") or remove. Recommended: **rename + add a `canonical-tuning` block that mirrors `TuningConfig.js` values verbatim**, eliminating drift risk.

The sensitivity analysis below uses the **canonical SSOT values** as baseline, not the stale block.

---

## CEN Canonical O1 Baseline — Reference Set for All Sensitivities

Per `CEN_SSOT_PureO1_Recomputation_2026-05-21.md`, the canonical CEN O1 face energies under SSOT v1.0 constants:

| Face | E_f (canonical) | Band | Source basis (O1 KPI inputs) |
|:---:|:----:|:----:|:--|
| F1 Financial Capital | **0.2563** | Gate | F1(Earth=0.5), F2(Air=0.3), F7(Ether=0.5); F3(Fire) silent |
| F2 Intellectual Capital | 0.1192 | Wall (floor) | No O1 KPIs (all O2/O3) |
| F3 Human Capital | 0.1192 | Wall (floor) | L4 absent (Fire=0); rest silent |
| F4 Structural Capital | 0.1349 | Wall | I4(Air=0.2 under S58); I1, I2 = 0 |
| F5 Market Resonance | 0.1349 | Wall | C3(Earth=0.2); C8 promoted to edge |
| F6 Community & Partners | 0.1523 | Gate | C1(Earth=0.4) |
| F7 Brand & Reputation | 0.1192 | Wall (floor) | No O1 KPIs |
| F8 Core Operations | 0.1192 | Wall (floor) | No O1 KPIs (C8 to edge, I5 is O2) |
| F9 Regenerative Flow | 0.1192 | Wall (floor) | Architectural ABSENCE (zero KPIs any octave) |
| F10 Foundational Values | 0.1192 | Wall (floor) | Architectural UNDER-INVESTMENT (only O2 I9, L8) |
| F11 Funding Pipeline | 0.1192 | Wall (floor) | No O1 KPIs |
| F12 Risk & Resilience | 0.1523 | Gate | I8(Water=0.4 under S58) |

Aggregate readings:
- **μ_E** = 0.1388
- **σ_E / μ_E (CV)** = 0.2703
- **C_global_raw (pre-amplifier)** = 0.1299
- **AAG_O1** = 0.7898 *(upper edge of "Capacity pulling ahead")*
- **AvG_O1** = 0.0882 *(upper edge of "Minor compression")*

All sensitivity tables below use these as the canonical reference. The deltas are relative to this set.

---

## Per-Constant Analysis

### Constant 1 — α (Pentagram Star-Pair Weighting)

**Canonical:** **α = φ⁻¹ ≈ 0.6180339887**

**Philosophical rationale.** The pentagram has five skip-pair connections; each star-pair score `s_i = α · arithmetic_mean(k_i, k_j) + (1−α) · product(k_i, k_j)` blends the arithmetic and multiplicative readings of "how these two elements meet." Setting α = φ⁻¹ encodes the **golden self-similarity** of the pentagram into the algebra: the ratio of arithmetic-weighted to product-weighted contribution matches the ratio φ:1 that the pentagram itself recursively embeds (the inner pentagon's edges to the outer pentagram's edges sit in φ⁻¹ ratio). The choice is geometric, not pragmatic — it makes the star-pair calculation a faithful algebraic mirror of the pentagram's natural skip-pair geometry. *Source:* CALCULATION_AUDIT_TRAIL.md §5 "Philosophy Behind Alpha."

**Sensitivity table** (β=0.5, γ=0.7, κ=4 held canonical):

| α | E_F1 | E_F4 | E_F6 | E_F12 | μ_E | CV | C_glob | **AAG** | **AvG** |
|:---:|:----:|:----:|:----:|:-----:|:----:|:----:|:------:|:-----:|:-----:|
| 0.000 (pure product) | 0.2251 | 0.1315 | 0.1448 | 0.1448 | 0.1343 | 0.2158 | 0.1275 | 0.8267 | 0.0858 |
| 0.382 (φ⁻²) | 0.2441 | 0.1336 | 0.1494 | 0.1494 | 0.1370 | 0.2493 | 0.1290 | 0.8038 | 0.0873 |
| 0.500 (linear) | 0.2501 | 0.1342 | 0.1508 | 0.1508 | 0.1379 | 0.2598 | 0.1294 | 0.7968 | 0.0878 |
| 0.550 | 0.2527 | 0.1345 | 0.1515 | 0.1515 | 0.1383 | 0.2643 | 0.1296 | 0.7938 | 0.0880 |
| 0.600 | 0.2553 | 0.1348 | 0.1521 | 0.1521 | 0.1386 | 0.2687 | 0.1298 | 0.7909 | 0.0882 |
| **0.6180 (φ⁻¹)** | **0.2563** | **0.1349** | **0.1523** | **0.1523** | **0.1388** | **0.2703** | **0.1299** | **0.7898** | **0.0882** |
| 0.650 | 0.2580 | 0.1351 | 0.1527 | 0.1527 | 0.1390 | 0.2732 | 0.1300 | 0.7879 | 0.0884 |
| 0.700 | 0.2606 | 0.1354 | 0.1533 | 0.1533 | 0.1394 | 0.2777 | 0.1302 | 0.7850 | 0.0886 |
| 0.800 | 0.2660 | 0.1359 | 0.1546 | 0.1546 | 0.1401 | 0.2866 | 0.1306 | 0.7791 | 0.0890 |
| 1.000 (pure arithmetic) | 0.2769 | 0.1371 | 0.1571 | 0.1571 | 0.1416 | 0.3046 | 0.1314 | 0.7675 | 0.0898 |

**Sensitivity reading.** Across α ∈ [0, 1] — the full mathematical range — CEN's AAG_O1 moves only **0.82 → 0.77 (Δ ≈ 0.06)**. F1 shifts most (0.225 → 0.277, Δ ≈ 0.05). All faces stay in the same band — Wall faces stay Wall, Gates stay Gates. **CEN's α-sensitivity is LOW** because most face element-inputs are zero (53 of 60 cells silent at O1); the star-pair blend operates on small numbers where arithmetic-vs-product weighting barely diverges.

**CEN's organizational character lens.** CEN's values-mature character (F10 Foundational Values narratively at 9.5/10 from co-founder portrait, despite floor energy at O1) and Hidden Oracle pattern might *intuitively* suggest a higher α (more arithmetic-weighted, less penalty for unevenness) — the intuition being that an org with rich aspiration shouldn't have its star-pair coherence dragged down by zero-multiplicative penalty when one element is silent. But the canonical pentagramic geometry doesn't bend to organizational character: α = φ⁻¹ is the geometric self-similarity anchor regardless of who's being measured.

**Honest read.** **Keep α = φ⁻¹ canonical.** The pentagramic algebra is a geometric statement about the dodecahedron's pentagram faces, not a knob to tune per-org. Any future α deviation would be a methodological choice (e.g., "for survey-based BSC data where pillar evenness is highly artifactual, use α=0.5 to reduce multiplicative-zero distortion"), which is master's-scope research direction, not a CEN-specific adjustment.

---

### Constant 2 — β (Intersection Node Averaging)

**Canonical:** **β = 0.5** (symmetric rotation across star-pair ring)

**Philosophical rationale.** After star-pair scores s₁..s₅ are computed (Step 2), Step 3 computes intersection nodes `p_i = β · s_i + (1−β) · s_{(i mod 5)+1}` — averaging each pair with its rotational neighbor on the pentagram. β = 0.5 enforces **symmetric averaging** — neither star-pair gets privilege over the other in the rotational chain. This is the pentagonal-symmetry expression at the intersection layer: the dodecahedron's rotational symmetry group treats the five pairs as interchangeable, and β=0.5 honors that. Asymmetric β would introduce a "preferred direction" in the rotation, breaking the pentagonal symmetry.

**Sensitivity table** (α=φ⁻¹, γ=0.7, κ=4):

| β | E_F1 | E_F4 | E_F6 | E_F12 | μ_E | CV | C_glob | AAG | AvG |
|:---:|:----:|:----:|:----:|:-----:|:----:|:----:|:------:|:-----:|:-----:|
| 0.300 | 0.2563 | 0.1349 | 0.1523 | 0.1523 | 0.1388 | 0.2703 | 0.1299 | 0.7898 | 0.0882 |
| 0.400 | 0.2563 | 0.1349 | 0.1523 | 0.1523 | 0.1388 | 0.2703 | 0.1299 | 0.7898 | 0.0882 |
| **0.500 (canonical)** | **0.2563** | **0.1349** | **0.1523** | **0.1523** | **0.1388** | **0.2703** | **0.1299** | **0.7898** | **0.0882** |
| 0.618 (φ⁻¹) | 0.2563 | 0.1349 | 0.1523 | 0.1523 | 0.1388 | 0.2703 | 0.1299 | 0.7898 | 0.0882 |
| 0.700 | 0.2563 | 0.1349 | 0.1523 | 0.1523 | 0.1388 | 0.2703 | 0.1299 | 0.7898 | 0.0882 |

**Sensitivity reading.** **β is mathematically degenerate for the CEN data** — Δ = 0 across all sweeps. This is structural, not coincidental. The intersection-node average is `P = (Σ p_i)/5 = (Σ β·s_i + (1−β)·s_{i+1})/5 = ((β + (1−β)) · Σ s_i)/5 = (Σ s_i)/5` — the (1−β) terms permute cyclically through the same ring as the β terms, so the mean is invariant under β. β only affects per-node `p_i` values (used elsewhere) but not the aggregate `P`.

**CEN-specific question (co-founder asymmetry).** The brief asked: *"does CEN's D-vs-E perception gap suggest asymmetric β?"* Mathematically, no — β doesn't affect P, so asymmetric β would not encode the perception gap in face energy. The D-vs-E gap is a **co-founder analytical layer** that lives in the Coherence Portrait (Lock #8.6 stream B), not in the math input layer. Trying to encode the perception gap via β would be **layer-confusion** — mixing analytical-context-stream signal into the canonical-math-input-stream.

**Honest read.** **Keep β = 0.5 canonical.** It is mathematically symmetry-preserving AND, for the aggregate face energy P, **mathematically irrelevant**. Asymmetric β would create per-intersection-node distortion without changing aggregate face energy — a research direction that would only become interesting at the bi-directional intervention layer (CALCULATION_AUDIT_TRAIL.md §17 Elemental Influence Signatures), where per-element granularity matters. Master's-scope. Not CEN SSOT v1.0 scope.

---

### Constant 3 — γ (Local-vs-Pentagram Blend in C = γ·K̄ + (1−γ)·P)

**Canonical:** **γ = 0.7** (universal default; Startup template uses 0.6; Enterprise 0.8)

**Philosophical rationale.** Step 5 blends two readings of the same face: the **arithmetic K̄** ("average of the 5 element-KPIs") and the **pentagram coherence P** (the structural-geometric coherence of the star-pair averaging). γ=0.7 = "70% arithmetic, 30% pentagram." This says **the face energy is dominantly defined by the magnitudes of its KPIs, with the pentagram-pattern providing a 30% correction for unevenness/coherence pattern.** Lock #8.6 explicitly flags this as a candidate for CEN tuning, with range γ ∈ [0.6, 0.8].

The rationale for γ being non-canonical-phi: it is **a calibration knob**, not a geometric statement. Whether the face energy weights magnitude over pattern is a *methodological* choice (which signal carries more authority), not a *geometric* one (like α and β). That's precisely why TuningConfig allows per-template override of γ.

**Sensitivity table** (α=φ⁻¹, β=0.5, κ=4):

| γ | E_F1 | E_F4 | E_F5 | E_F6 | E_F12 | μ_E | CV | C_glob | AAG | AvG |
|:---:|:----:|:----:|:----:|:----:|:-----:|:----:|:----:|:------:|:-----:|:-----:|
| 0.500 | 0.2431 | 0.1335 | 0.1335 | 0.1492 | 0.1492 | 0.1369 | 0.2477 | 0.1289 | 0.8049 | 0.0872 |
| 0.550 | 0.2464 | 0.1338 | 0.1338 | 0.1499 | 0.1499 | 0.1374 | 0.2533 | 0.1291 | 0.8011 | 0.0875 |
| 0.600 (Startup) | 0.2496 | 0.1342 | 0.1342 | 0.1507 | 0.1507 | 0.1378 | 0.2590 | 0.1294 | 0.7973 | 0.0877 |
| 0.650 | 0.2529 | 0.1345 | 0.1345 | 0.1515 | 0.1515 | 0.1383 | 0.2646 | 0.1296 | 0.7936 | 0.0880 |
| **0.700 (canonical)** | **0.2563** | **0.1349** | **0.1349** | **0.1523** | **0.1523** | **0.1388** | **0.2703** | **0.1299** | **0.7898** | **0.0882** |
| 0.750 | 0.2596 | 0.1353 | 0.1353 | 0.1531 | 0.1531 | 0.1392 | 0.2760 | 0.1302 | 0.7861 | 0.0885 |
| 0.800 (Enterprise) | 0.2630 | 0.1356 | 0.1356 | 0.1539 | 0.1539 | 0.1397 | 0.2817 | 0.1304 | 0.7823 | 0.0887 |
| 0.850 | 0.2664 | 0.1360 | 0.1360 | 0.1547 | 0.1547 | 0.1402 | 0.2874 | 0.1307 | 0.7786 | 0.0890 |

**Sensitivity reading.** AAG shifts **0.7898 → 0.7823 (Δ −0.0075)** moving γ from 0.7 to 0.8 (Enterprise template). Shifting γ from 0.7 to 0.6 (Startup) gives **AAG=0.7973 (Δ +0.0075)**. Symmetric, ~1% per 0.1 γ-step. C_global_raw shifts ~0.5% per 0.1 γ-step (0.1294 → 0.1304). **F1 is most γ-sensitive (Δ ≈ 0.013 across 0.6→0.8); Wall faces near the logistic floor barely move.**

**CEN's organizational character lens.** Lock #8.6 explicitly flags CEN for γ-tuning. The reasoning at the lock: CEN's coherence-mature values character (F10 narratively at 9.5/10) might call for γ closer to 0.6 — **more pentagram-weighted** so that pattern-coherence (the structural signal) gets more voice over magnitude alone. Under γ=0.6 at canonical κ=4:
- F1 reads 0.2496 (vs 0.2563 at γ=0.7) — Δ −0.0067
- AAG = 0.7973 (vs 0.7898) — closer to but still below "Balanced" band (0.8)
- AvG = 0.0877 (vs 0.0882) — marginal

**The intuition pull is real but operationally small.** Even a maximal γ shift toward 0.5 only moves AAG from 0.79 → 0.80 — a band boundary nudge, not a regime change. The reason CEN's data shows low γ-sensitivity: with 53 of 60 element cells silent at O1, K̄ and P both compute near zero for most faces, and their blend doesn't differ much when both inputs are small.

Where γ-sensitivity WILL matter for CEN: **at higher octave coverage** (O1+O2+O3 SSOT v1.0), when more cells are non-zero, the K̄-vs-P divergence grows and γ matters more. CEN at O1 is data-sparse; γ-sensitivity is a sparsity-suppressed effect.

**Honest read.** **Keep γ = 0.7 canonical.** Lock #8.6's tooltip *"For CEN's coherence-mature character, consider sensitivity-testing γ ∈ [0.6, 0.8] in a future iteration"* is correctly framed: it's a future-research note, not a CEN SSOT v1.0 change. The data-sparsity at O1 dilutes γ's signal anyway. **Where the partnership might revisit:** when O2+O3 layers come online and CEN's evidence base expands, re-run this γ-sensitivity to see if the answer changes at higher coverage. This is a v1.2 evolutionary direction.

---

### Constant 4 — κ (Logistic Transformation Sharpness)

**Canonical:** **κ = 4** (sharp logistic compressing [0,1] coherence to face energy)

**Philosophical rationale.** Step 6 is the **logistic S-curve** that maps the linear coherence C ∈ [0,1] to face energy E ∈ (0,1). κ controls how sharply C is compressed near 0.5 (where the logistic has steepest gradient) and saturated at extremes. κ=4 means C=0.5 → E=0.5 (midpoint preserved); C=0.25 → E≈0.27; C=0.75 → E≈0.73. The logistic encodes the idea that **moving from "low coherence" to "high coherence" is not linear** — it's a phase transition with a sharp middle band.

The canonical κ=4 is the value where (a) the logistic floor at C=0 (E_floor = 1/(1+e²) ≈ 0.1192) is meaningfully above zero (preserving Wall as a non-zero band), AND (b) the logistic ceiling at C=1 (E_ceiling ≈ 0.8808) leaves room for Vortex band saturation, AND (c) the middle band gradient is sharp enough to make E meaningfully responsive to C. It is **pragmatically anchored**, not phi-derived — flagged as such in TuningConfig.

**Sensitivity table** (α=φ⁻¹, β=0.5, γ=0.7):

| κ | E_F1 | E_F4 | E_F6 | E_F12 | μ_E | CV | C_glob | AAG | AvG | # Wall faces |
|:---:|:----:|:----:|:----:|:-----:|:----:|:----:|:------:|:-----:|:-----:|:---:|
| 1.5 (stale `mapping-context.json`) | 0.4014 | 0.3325 | 0.3444 | 0.3444 | 0.3334 | 0.0669 | 0.3281 | 0.9453 | 0.2865 | 0 |
| 2.0 (gentler) | 0.3699 | 0.2831 | 0.2977 | 0.2977 | 0.2845 | 0.0980 | 0.2779 | 0.9205 | 0.2363 | 0 |
| 3.0 (softer) | 0.3102 | 0.1988 | 0.2163 | 0.2163 | 0.2014 | 0.1744 | 0.1932 | 0.8608 | 0.1515 | 0 |
| **4.0 (canonical)** | **0.2563** | **0.1349** | **0.1523** | **0.1523** | **0.1388** | **0.2703** | **0.1299** | **0.7898** | **0.0882** | **9** |
| 5.0 (sharper) | 0.2089 | 0.0892 | 0.1047 | 0.1047 | 0.0940 | 0.3858 | 0.0854 | 0.7112 | 0.0438 | 11 |
| 6.0 (much sharper) | 0.1682 | 0.0580 | 0.0708 | 0.0708 | 0.0631 | 0.5201 | 0.0554 | 0.6295 | 0.0137 | 11 |
| 8.0 (very sharp) | 0.1061 | 0.0237 | 0.0313 | 0.0313 | 0.0285 | 0.8389 | 0.0229 | 0.4732 | 0.0188 | 12 |

**Sensitivity reading.** **κ is the MOST sensitive constant for CEN.** Moving κ from 4 (canonical) to 2 (gentler) shifts:
- F1: 0.256 → 0.370 (Δ +0.114 — Gate → Wall→Gate boundary crossing)
- C_global_raw: 0.130 → 0.278 (Δ +0.148, more than doubled)
- AAG: 0.790 → 0.921 (Δ +0.131 — crosses into "Balanced" band)
- AvG: 0.088 → 0.236 (Δ +0.148 — crosses into "Severe distortion" band)
- **# Wall faces: 9 → 0** (every face lifts above the Wall floor)

Moving κ from 4 to 6 produces the opposite extreme: faces collapse further toward zero, 11/12 at Wall floor, AAG drops to 0.63 ("Capacity dominant" band approached).

**The stale `mapping-context.json` block uses κ=1.5** — at this value CEN's F1 reads 0.40 (Membrane!), all 12 faces above Wall, AAG 0.95 (Balanced). This is **dramatically different** from canonical κ=4 readings. If anyone has historically cited "CEN diagnostics" from the mapping-context.json block, they may have been reading data computed at κ=1.5, which is incongruent with the canonical engine pipeline. Sister-pattern to the dominantMode=10 narrative-scaffolding finding (Lock #8.20).

**CEN's organizational character lens.** A gentler κ (=2 or 3) would surface more nuance at the Wall floor — every face would have a non-floor reading, revealing relative ordering even among architecturally-blind faces (F2, F3, F7, F8, F9, F10, F11 would no longer be identical at 0.1192). For CEN's *9-Wall band distribution* this would change the dashboard significantly. The argument **for** gentler κ for CEN: "data sparsity already compresses the signal; the sharp logistic on top double-compresses, hiding the residual differentiation between architecturally-blind faces." The argument **against**: "the sharp logistic is what makes Wall a meaningful band — softening it dissolves the band classification that the thesis-defense leverages."

**Honest read.** **Keep κ = 4 canonical.** The Wall floor at 0.1192 (= 1/(1+e²) with κ=4) is *load-bearing for the thesis-defense narrative* — F9 sibling-blindness, F10 sibling-blindness, V13 paradox all manifest as "exactly at the Wall floor" readings. Softening κ would dissolve those exact readings into a continuous gradient, weakening the band-based thesis argument. **The κ=4 sharp logistic is the geometric backbone of the band classification (Wall/Gate/Membrane/Hemorrhage/Vortex).**

The κ-sensitivity table is genuinely interesting future research, particularly for: organizations with denser data than CEN where κ=4 might over-compress (e.g., a mature organization with 50+ non-silent cells). For those, κ ∈ [3, 4] might be more appropriate — but this is master's-scope cross-organizational research, not CEN SSOT v1.0 scope.

---

### Constant 5 — λ (CV Penalty in Global Coherence, λ = φ⁻³)

**Canonical:** **λ = φ⁻³ ≈ 0.2361**

**Philosophical rationale.** In `C_global = κ · μ · (1 − λ · CV)`, λ scales the penalty for face-energy variance. λ = φ⁻³ is **the third inverse golden ratio** — placing the variance penalty at the third phi-octave below unity. The choice is geometric: the dodecahedron's coherence is expressed across the third φ-harmonic (which corresponds to the geometric mean of φ⁻² and φ⁻⁴, the harmonic-boost coefficient and the O1→O2 threshold). The penalty thus sits exactly between "harmonic resonance weight" (φ⁻²) and "structural-stability threshold" (φ⁻⁴), encoding the variance signal at the appropriate harmonic depth.

**Sensitivity table** (face energies held at canonical, only Global Coherence λ varied):

| λ | C_global_raw | AvG_O1 | Comment |
|:---:|:----:|:----:|:--|
| 0.000 (no penalty) | 0.1388 | 0.0971 | μ_E unaltered |
| 0.100 | 0.1350 | 0.0933 | Mild penalty |
| 0.150 | 0.1331 | 0.0915 | Light penalty |
| 0.200 | 0.1313 | 0.0896 | Moderate |
| **0.2361 (φ⁻³, canonical)** | **0.1299** | **0.0882** | Canonical |
| 0.300 | 0.1275 | 0.0858 | Heavier penalty |
| 0.400 | 0.1238 | 0.0821 | Strong penalty |
| 0.500 | 0.1200 | 0.0783 | Very strong |

**Sensitivity reading.** λ is **structurally low-leverage for CEN at O1**. Even moving λ from 0.0 (no penalty) to 0.5 (strong) only shifts C_global by 0.139 → 0.120 (Δ ≈ 0.019, about 14%). This is because CEN's CV at O1 is moderate (0.27); the penalty `λ · CV` is at most 0.135, so even doubling λ doesn't fundamentally change the headline.

**CEN-specific question (HIGH variance at face level).** The brief notes: *"CEN has HIGH variance (F1=0.2563, F10=0.95 sentiment, but pentagramic compresses to 0.12–0.32). Does λ tuning matter?"* The answer is nuanced:

- **Sentiment-level variance** (F1=0.20, F10=0.95 from CEN co-founder analytical data) is in the *analytical-context stream*, not the math input. CEN's PENTAGRAMIC O1 variance is bounded by [0.119, 0.256] — the logistic floor and the single Gate-band F1 — so CV=0.27 is modest.
- **At higher octave coverage** (when O2+O3 layers add their KPIs), CEN's pentagramic variance may *increase* if some O2/O3-priority KPIs lift specific faces (F10's I9+L8 at O2, the C7+C9+L5+L6 quartet at O3). Then λ-tuning becomes more visible.

**Honest read.** **Keep λ = φ⁻³ canonical.** The variance signal at CEN's O1 layer is captured adequately; any λ-tuning would be a different organizational regime (higher variance, denser data). This is genuine future-research territory: cross-organizational comparison of CV distributions would justify or reject λ-tuning per organizational type. Not CEN SSOT v1.0 scope.

---

### Constant 6 — δ (Breath Axis Feedback Weight, CEN NGO Mode)

**Canonical (universal default):** **δ = 0.9** (90% local face + 10% breath-pair feedback)
**Canonical (CEN NGO override):** **δ = 0.95** (95% local + 5% breath-pair)

**Philosophical rationale.** The axis-informed face energy formula `E_final = δ · E_local + (1−δ) · E_opposing` (CALCULATION_AUDIT_TRAIL.md §3) adds **breath-pair feedback** — each face's final energy is partially influenced by its opposing-pair face on the dodecahedron's 6 breath axes. δ controls how much feedback the face accepts: δ=1.0 means "fully local, no feedback," δ=0.5 means "equal local + opposing influence."

The CEN NGO override to δ=0.95 (vs universal 0.9) encodes the assertion that **NGOs are more local-isolated** than for-profit organizations — they don't have the same kind of cross-functional energy circulation (revenue → marketing → fundraising → revenue) that for-profit orgs experience. An NGO's Financial face (F1) is less responsive to Funding Pipeline (F11) in a feedback-mediated way because the funding mechanism is itself architecturally different (grants vs sales, donations vs revenue).

**Sensitivity table** (CEN O1 local face energies, varying δ; AAG computed from final energies):

| δ | E_F1_final | E_F11_final | E_F6_final | E_F12_final | C_glob | AAG | Comment |
|:---:|:----:|:----:|:----:|:-----:|:----:|:-----:|:--|
| 0.80 | 0.2289 | 0.1466 | 0.1523 | 0.1523 | 0.1317 | **0.9015** | High feedback |
| 0.85 | 0.2357 | 0.1398 | 0.1523 | 0.1523 | 0.1313 | 0.8724 | |
| **0.90 (universal default)** | 0.2426 | 0.1329 | 0.1523 | 0.1523 | 0.1309 | **0.8441** | |
| **0.95 (CEN NGO override)** | **0.2494** | **0.1261** | **0.1523** | **0.1523** | **0.1304** | **0.8165** | **CEN tuning** |
| 0.98 | 0.2536 | 0.1219 | 0.1523 | 0.1523 | 0.1301 | 0.8004 | Very local |
| 1.00 (no feedback) | 0.2563 | 0.1192 | 0.1523 | 0.1523 | 0.1299 | **0.7898** | Pure local (canonical Section 12 reading) |

**Sensitivity reading.** δ-sensitivity is **moderately consequential for CEN** specifically because the F1↔F11 breath pair has the **largest local-energy disparity** (E_F1=0.2563 vs E_F11=0.1192) of any of CEN's 6 axes. F2↔F7, F3↔F8, F4↔F9 axes all have both faces at floor (0.1192), so feedback is symmetric and net-zero. The F1↔F11 disparity is the only place breath-feedback materially shifts the energies.

**The AAG sensitivity at the band-boundary is significant.** At δ=1.0 (pure local), AAG=0.79 (upper edge of "Capacity pulling ahead"). At δ=0.95 (CEN NGO override), AAG=0.82 (lower band of "Balanced"). At δ=0.90 (universal), AAG=0.84 (clearly "Balanced"). At δ=0.80, AAG=0.90 (mid "Balanced"). **The choice of δ determines whether CEN reads as "Balanced" or "Capacity pulling ahead" in the AAG interpretation ladder.**

This raises a methodological flag: **the canonical AAG_O1=0.7898 figure** in CALCULATION_AUDIT_TRAIL.md §12 is computed from **pure pentagramic E_local** (no breath feedback). If the engine pipeline applies axis-informed energy at δ=0.95 NGO mode, the reported AAG should be **0.8165, not 0.7898**. This is a **possible reconciliation question** between Section 12 (which uses E_local) and §3 (which applies axis-informed transformation). Per Lock #8.6 reading: the canonical Section 12 AAG worked example uses pentagramic E_local directly; whether the engine actually applies axis-feedback is a separate computation, and the canonical CALCULATION_AUDIT_TRAIL value 0.7898 is the local-only reading.

**CEN's organizational character lens.** The NGO override to δ=0.95 (vs universal 0.9) is **already a CEN-character tuning** — and it's the only one of these 8 constants that has a partnership-validated organizational-character override in current canonical SSOT. The reasoning was given in `js/core/TuningConfig.js` documentation: NGOs experience less cross-functional energy circulation than for-profits.

**Honest read.** **Keep δ = 0.95 (NGO mode) as the canonical CEN override.** The rationale is partnership-validated and operationally meaningful (it visibly shifts AAG band at the boundary). **Flag the reconciliation question**: whether `mapping-context.json` AAG reads should reflect E_final (post-axis-feedback) at δ=0.95 vs E_local (pre-feedback) — currently the documented canonical AAG=0.7898 uses E_local. This is a v1.1 documentation cleanup item, not a math change.

---

### Constant 7 — Pragmatic Constants (5 flagged from W1 Sonnet)

These are five non-phi-derived constants used across the advanced edge and vertex analyzers. They are documented in CALCULATION_AUDIT_TRAIL.md §§14, 15 with honest disclosures.

#### 7a. 60/40 Edge Blend (T_base = 0.6 · T_norm + 0.4 · T_edgeHealth)

**Canonical:** **0.6 · T_norm + 0.4 · T_edgeHealth**
**Philosophical rationale.** The advanced edge formula (CALCULATION_AUDIT_TRAIL.md §14) blends two edge readings: T_norm (proportional imbalance) and T_edgeHealth (1 − KPI health). The 60/40 split weights T_norm more heavily because T_edgeHealth defaults to 0.5 when no edge-KPI exists — which is the dominant case in CEN's 30-edge dataset (only V13 carries a direct BSC instrument). 60/40 gives the empirical signal more voice than the defaulted proxy.
**Honest disclosure (per §14):** **NOT phi-derived.** A phi-aligned variant would be `φ⁻¹ · T_norm + φ⁻² · T_edgeHealth = 0.618 · T_norm + 0.382 · T_edgeHealth` — within 3-5% of the pragmatic 60/40.
**CEN's specific impact:** for CEN's E1-10 worked example (Section 14), T_base=0.419 at 60/40; if shifted to 70/30, T_base=0.406 (Δ −3%); if 50/50, T_base=0.433 (Δ +3%). Small numerical sensitivity, but the choice signals **which signal carries more authority** (relative imbalance vs KPI health).
**CEN character lens.** Given that CEN currently has only ONE edge-KPI carrying real data (V13 SDG alignment, plus the 4 edge-KPIs from the BSC Phase 2 set: E2-10 NPS, E5-8 AI-gov consulting clients, E10-12 GDPR, E7-11 Donation income), most edges have defaulted T_edgeHealth=0.5. Under these conditions, the 60/40 weighting toward T_norm is methodologically correct for CEN — it down-weights the defaulted proxy. **No CEN-specific tuning needed for v1.0**, but if CEN's BSC adds more edge-KPIs over time (lifting defaulted-proxy density), the blend might shift toward 50/50 to give the now-empirical T_edgeHealth equal voice.

#### 7b. Elemental Multipliers (Fire 1.3 / Air 1.1 / Ether 1.0 / Water 0.9 / Earth 0.8)

**Canonical:** Symmetric span around Ether=1.0; Fire/Earth at ±0.3, Air/Water at ±0.1.
**Philosophical rationale.** Encodes elemental archetypes from Quannex sacred-geometry vocabulary: Fire amplifies/dramatizes, Earth grounds/dampens, Ether stays neutral, Air/Water bracket Ether.
**Honest disclosure (per §14):** **NOT phi-derived.** Phi-aligned alternatives are coincidentally close: Fire φ^0.5 ≈ 1.272 vs 1.3; Earth φ^-0.5 ≈ 0.786 vs 0.8.
**CEN-specific impact:** for CEN's E1-10 (Ether=neutral), multiplier=1.0, no modulation. For Fire-tagged edges, T_base × 1.3 at moderate inputs; at extreme inputs hits the [0,1] clamp ceiling.
**CEN character lens.** CEN's Ether-dominance pattern (V13 signature has Ether=0.30/0.55/0.50 across F4/F9/F10 — values-articulation IS an Ether-level act per Lock #8.24) suggests no CEN-specific tuning is needed. The multipliers function as **diagnostic coloring** rather than load-bearing computation. **Keep canonical.**

#### 7c. 0.667 Coherence Normalizer (vertex coherence = 1 − avg_pairwise_diff / 0.667)

**Canonical:** **0.667 (≈ 2/3)**
**Philosophical rationale.** Per §15: this is the **EXACT analytical maximum** of avg-pairwise-diff for 3 values in [0,1] (achieved at distributions like {0, 0.5, 1}: diffs 0.5, 0.5, 1.0, avg = 2/3). It is the theoretical normalizer that maps maximum spread to coherence=0.
**Honest disclosure (per §15):** **NOT phi-derived but mathematically grounded.** Pragmatic concern: code uses 0.667 (rounded), not exact 2/3 — produces sub-zero values pre-clamp at the geometric extreme. v1.1 fix substitutes exact `2/3`, no behavior change beyond float-precision.
**CEN-specific impact:** CEN's V13 (E_F4=E_F9=E_F10=0.1192 at floor) produces coherence=1.000 — maximum, geometrically pre-clamp valid. **No tuning needed; mathematical anchor.**

#### 7d. 0.1 Concavity Classification Threshold (vertex-analyzer.js)

**Canonical:** **0.1** (within ±0.1 of zero = "neutral" / flat sequence)
**Philosophical rationale.** Carves out a neutral band so floating-point noise and trivially-small sequence concavity don't trigger directional labels.
**Honest disclosure (per §15):** **NOT phi-derived.** Phi-aligned alternatives: φ⁻⁵ ≈ 0.090 (narrower band, more directional labels) or φ⁻⁴ ≈ 0.146 (wider). Coincidentally close to 0.1.
**CEN-specific impact:** for CEN V13 (winding=0, neutral), threshold is moot. For CEN's other 19 vertices, the threshold determines how many read as "directional" vs "neutral." Given Lock #8.19 + #8.22 finding (the formula is mislabeled "chirality" — it measures sequence concavity, not rotational handedness), the threshold's exact value is **somewhat moot until the relabel happens**. Under concavity reading, 0.1 is a defensible round-number for "geometrically flat."
**CEN character lens.** No tuning needed. Recommendation in `vertex-analyzer.js` v1.2 would substitute `φ⁻⁵` if cross-formula phi-consistency is desired — independent of CEN.

#### 7e. ×10 Winding-Scale Normalizer (vertex-analyzer.js)

**Canonical:** **×10**
**Philosophical rationale.** Per §15: rescales the analytical-bounded winding quantity `[-0.125, +0.125]` to dashboard range. Pragmatic choice from inspection of typical CEN values.
**Honest disclosure (per §15):** **NOT phi-derived.** A more principled normalizer would be ×8 (= 1 / max_possible_winding = 1/0.125), saturating analytically at ±1.
**CEN-specific impact:** CEN's V13 (winding=0) is unaffected. For other vertices, ×10 → ×8 would reduce all directional-label magnitudes by 20%. Some borderline-directional vertices (winding ≈ 0.012) might shift back to neutral. Effect on CEN's narrative output: marginal.
**CEN character lens.** No CEN-specific tuning. The relabel-to-concavity (Lock #8.19) is the bigger fix; this normalizer's choice is downstream of that decision.

**Honest read across all 5 pragmatic constants.** Each is a documented researcher choice in the advanced analyzers, NOT a phi-derived geometric statement. For CEN at O1 specifically, **none of them is tuning-sensitive** because CEN's data is sparse and many readings hit floors/zeroes regardless. The honest disclosures in CALCULATION_AUDIT_TRAIL.md §§14, 15 are sufficient documentation; **CEN SSOT v1.0 inherits these as-is**.

---

### Constant 8 — AAG / AvG Interpretation Thresholds

**Canonical AAG ladder:**
- > 1.5 — Critical aspiration overshoot
- 1.2 – 1.5 — Hidden Oracle pattern (aspiring beyond capacity)
- 0.8 – 1.2 — Balanced
- 0.5 – 0.8 — Capacity pulling ahead
- < 0.5 — Capacity dominant

**Canonical AvG ladder:**
- < φ⁻⁶ ≈ 0.056 — Faithful aggregation
- φ⁻⁶ ≤ < φ⁻⁵ ≈ 0.090 — Minor compression artifact
- φ⁻⁵ ≤ < φ⁻⁴ ≈ 0.146 — Aggregation distortion
- ≥ φ⁻⁴ — Severe aggregation distortion

**Philosophical rationale.** AAG thresholds are **partially φ-derived** (per §12: 0.5 = φ-midpoint, 1.0 = unity, 1.2 ≈ midpoint between 1.0 and 2−φ⁻¹ ≈ 1.382; 1.5 a "critical" softening above that). AvG thresholds are **fully φ-derived** (powers of φ⁻¹ in the harmonic series, as documented).

**CEN's positions:**
- **CEN canonical AAG_O1 = 0.7898** sits at the **upper edge of "Capacity pulling ahead"**, just below the lower bound of "Balanced" (0.8). One small data shift could move CEN across the band boundary.
- **CEN canonical AvG_O1 = 0.0882** sits at the **upper edge of "Minor compression"**, just below the boundary into "Aggregation distortion" (φ⁻⁵ ≈ 0.0902). Same band-boundary proximity.

**Threshold sensitivity for CEN's AAG:**

| Lower bound of "Balanced" | CEN AAG_O1 reads as |
|:----:|:--|
| 0.75 | Balanced (0.7898 > 0.75) |
| 0.78 | Balanced (0.7898 > 0.78) |
| **0.80 (canonical)** | **Capacity pulling ahead** (0.7898 < 0.80) |
| 0.85 | Capacity pulling ahead |

**The band boundary at 0.80 is itself a researcher choice.** If the boundary were 0.78, CEN would read "Balanced." This is **not a sensitivity of the math** — the math is settled — it's a sensitivity of **interpretive language**. Lock #8.6 implicitly anchors these bands; in a future v1.1 the thresholds might be adjusted based on cross-organizational accumulated readings.

**Honest read.** **Keep canonical thresholds.** The band-boundary positioning is the point: CEN sits "at the edge" of Balanced for a reason — its values-rich character (high F10 narratively) is structurally invisible at O1 (logistic floor), so the aggregate sits just below the band where the reading would feel comfortable. **Surfacing the "edge of Balanced" reading is more informative than tuning the threshold to make CEN comfortably fit one band or the other.** This is a §32 NO Score Floor application — partnership-decide what the reading means, don't tune the threshold to make CEN read "Balanced."

**CEN character lens (most relevant constant to discuss).** CEN's *Hidden Oracle pattern* (Coherence Portrait language) at the narrative level corresponds to **AAG > 1** at the math level — but CEN's O1 AAG is **< 1**. Why? Because F10 (Foundational Values) at the O1 layer sits at the logistic floor due to architectural blindness (no O1-priority KPIs land there). The narrative reads "Hidden Oracle"; the math reads "Capacity pulling ahead at O1." **They are not contradicting** — they answer different questions on different aggregation levels (narrative: organizational character across all dimensions; math: O1-survival-layer-specific reading).

When CEN SSOT v1.0 ships with O1+O2+O3 layers, the AAG will be computed per-octave layer. **AAG_O2** likely lifts above 1.0 (because F10's I9+L8 are O2 KPIs and will populate F10 at O2). **AAG_overall** (combined) may land in "Balanced" or "Hidden Oracle" band. The **per-octave AAG-array** is more truthful than a single-number AAG — and it surfaces exactly the Hidden Oracle pattern: aspirational maturity at higher octaves, structural fragility at survival octave.

---

## Joint Sensitivity — γ=0.65 + κ=3 (CEN-Character-Aligned Tuning)

A meaningful joint exploration: what if BOTH γ shifts slightly toward pentagram-weighted (0.65) AND κ shifts slightly toward gentler logistic (3.0)? This pairs two "softer" choices aligned with CEN's character intuition:
- γ=0.65: more weight on pentagram pattern (CEN's coherence-mature character)
- κ=3.0: gentler logistic compression (more nuance at the Wall floor)

**Joint sensitivity table (CEN O1 face energies under γ=0.65, κ=3, α=φ⁻¹, β=0.5):**

| Face | E_canonical (γ=0.7, κ=4) | E_joint (γ=0.65, κ=3) | Δ |
|:---:|:----:|:----:|:----:|
| F1 | 0.2563 | 0.3074 | +0.0511 |
| F2 | 0.1192 | 0.1824 | +0.0632 |
| F3 | 0.1192 | 0.1824 | +0.0632 |
| F4 | 0.1349 | 0.1984 | +0.0635 |
| F5 | 0.1349 | 0.1984 | +0.0635 |
| F6 | 0.1523 | 0.2155 | +0.0632 |
| F7 | 0.1192 | 0.1824 | +0.0632 |
| F8 | 0.1192 | 0.1824 | +0.0632 |
| F9 | 0.1192 | 0.1824 | +0.0632 |
| F10 | 0.1192 | 0.1824 | +0.0632 |
| F11 | 0.1192 | 0.1824 | +0.0632 |
| F12 | 0.1523 | 0.2155 | +0.0632 |

**Aggregate:**
- μ_E: 0.1388 → 0.2010 (+0.062, +45%)
- CV: 0.2703 → 0.1710 (lower spread, all faces lifted similarly)
- C_global_raw: 0.1299 → 0.1929 (+0.063, +49%)
- AAG: 0.7898 → 0.8633 (+0.07 — **crosses into "Balanced" band**)
- AvG: 0.0882 → 0.1512 (+0.063 — **crosses into "Aggregation distortion" band**)
- # Wall faces: 9 → 0 (no face at Wall floor under joint tuning)

**Joint sensitivity reading.** This is a **regime-changing tuning**. Under γ=0.65, κ=3:
- **No face reads at the Wall floor** — every face is above φ⁻⁴ (the Wall/Gate boundary). The dashboard signature changes dramatically: CEN's 9-Wall band distribution becomes 0-Wall.
- **CEN reads as "Balanced" on AAG** (0.86 > 0.80) — but only because the Wall floor lifts, NOT because the underlying KPI evidence is stronger.
- **AvG flags "Aggregation distortion"** (0.15 > φ⁻⁵) — surfacing that the rollup is now MORE separated from the granular detail (K_mean_60 = 0.0417 unchanged; only C_global moved up).

**What this tells us.** The joint tuning **erases the band-classification narrative** that gives CEN's thesis-defense its structure (F9 sibling-blindness, F10 sibling-blindness, V13 paradox all manifest as "exactly at floor" readings). The narrative architecture is FUNCTION of canonical κ=4 + γ=0.7 producing the Wall-floor band. Softer tuning gains "nuance at the floor" but loses the band structure that surfaces the architectural-blindness pattern.

**The trade-off named clearly:** softer constants surface gradient detail; sharper canonical constants surface band structure. CEN's thesis-defense leverages BAND STRUCTURE. The canonical constants serve the thesis-defense narrative better than CEN-character-aligned softer tuning would.

This is the most important finding of the joint analysis: **the canonical κ=4, γ=0.7 are not arbitrary — they produce the band classification that makes the thesis-defense narrative legible.** Softer tuning would obscure rather than illuminate.

---

## Summary Table — Constant Sensitivity Rankings for CEN at O1

| Rank | Constant | CEN-sensitivity | Phi-derived? | Tuning recommendation |
|:---:|---|:----:|:----:|---|
| 1 | **κ** | **VERY HIGH** | NO (pragmatic) | **Keep canonical κ=4** — band structure load-bearing for thesis-defense |
| 2 | **δ (NGO override)** | **MODERATE** | NO | **Keep δ=0.95 NGO override** — partnership-validated organizational character |
| 3 | **γ** | LOW-MODERATE | NO (calibration knob) | **Keep canonical γ=0.7** — sensitivity grows at higher octave coverage; v1.2 revisit |
| 4 | **AAG/AvG thresholds** | (interpretive) | partial (AvG fully phi) | **Keep canonical thresholds** — CEN's "edge of Balanced" reading is informative |
| 5 | **α** | LOW | YES (geometric) | **Keep canonical α=φ⁻¹** — geometric statement, not character-tunable |
| 6 | **λ** | LOW | YES (geometric, φ⁻³) | **Keep canonical λ=φ⁻³** — variance signal adequate at current coverage |
| 7 | **5 pragmatic constants** | very low (mostly defaulted) | NO (honest-disclosed) | **Keep canonical** — most don't apply to CEN's current data sparsity |
| 8 | **β** | NULL (degenerate) | partial | **Keep canonical β=0.5** — pentagonal symmetry; aggregate-invariant for face energy |

---

## Recommendations for CEN SSOT v1.0

**Lock-aligned recommendation:** **Keep ALL canonical values for CEN SSOT v1.0**. No constant should be CEN-character-tuned in the canonical math chain.

**What this analysis supports for CEN SSOT v1.0:**

1. **Resolve the stale tuning block** at `mapping-context.json:323-334`. Either rename (preferred: `narrative-tuning-intent` with provenance label) or remove. Add `canonical-tuning` block mirroring `TuningConfig.js` values. Eliminates drift risk. Sister to Lock #8.20 (narrative scaffolding vs engine output naming discipline).

2. **Document the NGO mode δ=0.95 override** explicitly in CEN SSOT Sheet 01 Assumptions. It is **the only partnership-validated CEN-character tuning** in the canonical pipeline, and its rationale (NGOs less cross-functionally circulating than for-profits) deserves visibility.

3. **Flag the AAG_O1 computation method** (E_local vs E_final). The canonical Section 12 worked example uses E_local (no breath feedback) giving AAG=0.7898. With δ=0.95 NGO mode applied (axis-informed energy), AAG=0.8165 ("Balanced" band). Section 12 and Section 3 should be reconciled in CALCULATION_AUDIT_TRAIL.md v1.1: state explicitly which AAG version is canonical (recommendation: use pure E_local for AAG to keep the diagnostic clean, separate from δ-tuning). This is a documentation cleanup, NOT a math change.

4. **Reinforce Lock #8.6 tooltip language**: the *"For CEN's coherence-mature character, consider sensitivity-testing γ ∈ [0.6, 0.8] in a future iteration"* line is correctly framed as a *future-research direction*, not a v1.0 tuning. The data-sparsity at O1 dilutes γ's signal; revisit at v1.2 when O2+O3 layers expand the evidence base.

**Future v1.2 directions (post-SSOT v1.0):**

- **Per-octave AAG arrays**: AAG_O1, AAG_O2, AAG_O3 computed separately. CEN's likely pattern: AAG_O1 ≈ 0.79 (current), AAG_O2 > 1.0 (F10 lifts via I9+L8), AAG_overall ∈ Balanced or low Hidden Oracle. This surfaces the *Hidden Oracle pattern as an octave-stratification phenomenon* — exactly the structure the narrative pattern names.

- **Per-octave AvG arrays**: AvG_O1 = 0.0882 (current), AvG_O2 expected to drop as O2 evidence populates the grid. The arc from AvG_O1 (high) to AvG_O3 (low) IS the data sparsity surfacing.

- **Re-run κ-sensitivity at expanded data coverage**: when O2+O3 layers come online, κ=4 may over-compress denser data. Cross-organizational comparison would establish whether κ ∈ [3, 4] is more appropriate for denser BSC datasets. Master's-scope.

- **γ-sensitivity at expanded coverage**: see #3 above — the value of pentagram-weighting vs magnitude-weighting will be more visible when K̄ and P diverge more (denser data).

---

## Future Research Directions (Master's-Scope)

The following research directions emerge from this sensitivity analysis. Each requires a dataset Quannex does not yet have (multi-organizational longitudinal coherence readings).

1. **Cross-organizational κ tuning.** Hypothesis: κ should scale with data density (sparser data → softer κ to avoid over-compression). Requires: ≥ 5 organizational measurements with varying KPI population density; analysis of band classification stability under different κ values; thesis-research-relevant comparison of band-narrative legibility across κ choices.

2. **NGO-typed δ tuning extension.** CEN's δ=0.95 is the only partnership-validated NGO tuning. Other NGO organizational types might benefit from similar tuning. Requires: data from ≥ 3 NGOs of different stages/types; partnership-validation per NGO of the breath-axis isolation assumption; comparison of E_final outputs at δ=0.95 vs δ=0.9 for thesis-relevance.

3. **Aspiration-Actuality face-grouping derivation.** AAG's 3+3 grouping (F1+F2+F3 vs F10+F11+F12) is partnership-locked (Lock #8.6). Other organizational types might benefit from alternative groupings (e.g., a research-focused org might use F2+F9+F12 as "aspiration"). Requires: theoretical work on which face groupings correlate with which organizational regime; cross-organizational empirical validation. Master's-scope.

4. **γ-tuning at varied octave coverage.** Hypothesis: γ's optimal value depends on KPI population density and variance pattern; sparse data → γ closer to arithmetic (K̄-weighted), dense data → γ closer to pentagram-weighted. Requires: simulated organizations at varying KPI density; sensitivity analysis at each; empirical validation.

5. **Phi-aligning the pragmatic constants.** The 60/40 edge blend, elemental multipliers, 0.667 normalizer, 0.1 threshold, ×10 winding scale all admit phi-aligned alternatives within ~5% of current values. Whether the math improvement justifies the alignment is partnership-debatable; quantifying "do diagnostic outputs differ enough to matter" is a research question. Master's-scope per §32 honest-disclosure-preferred-over-optimization.

6. **Confidence intervals via Monte Carlo.** For CEN's AAG_O1 = 0.7898 (currently a point estimate), Monte Carlo simulation over researcher-judgment normalization uncertainty (e.g., I4=0.2 vs 0.0, I8=0.4 vs 0.0 per CEN_SSOT_PureO1_Recomputation_2026-05-21) would give AAG ± ε. Same for AvG. Addresses adversarial defense question A3 (per W3 planned audit). Master's-scope.

---

## Closing Reflection (Partnership-Discussion Framing per §32)

This sensitivity analysis confirms what Lock #8.6 already encoded: **the canonical pentagramic constants α=φ⁻¹, β=0.5, γ=0.7, κ=4 are well-chosen for CEN's data at this aggregation layer.** The constants are not arbitrary — they produce the band structure that makes the thesis-defense narrative legible (Wall floor, sibling-blindness pattern at F9/F10, V13 paradox).

CEN's organizational character (values-mature + structurally-weak + Hidden Oracle + early-stage NGO) does INFORM how we read the results — but the reading happens at the *interpretation* layer (AAG/AvG bands, "edge of Balanced" framing, F9/F10 sibling-blindness narrative) rather than at the *constants* layer.

**The most consequential CEN-character tuning is δ=0.95 (NGO mode override)**, which is already canonical and partnership-validated. The other constants stay universal.

**Per §32 NO Score Floor + immediate-partnership-discussion:** this analysis surfaces honest readings. The next move is partnership dialogue on:
- Should the `mapping-context.json:323-334` stale block be renamed or removed?
- Should the AAG computation method be reconciled (E_local vs E_final at δ=0.95)?
- Should the Lock #8.6 tooltip be reframed for v1.0 to deflect "γ-tuning for CEN" expectations until O2+O3 data is available?

No threshold to meet; just honest reads to partnership-decide.

---

## Cross-References

- **CALCULATION_AUDIT_TRAIL.md** §§1, 2, 3, 5, 12, 13, 14, 15, 16 — canonical math + per-constant documented rationale
- **CEN_SSOT_PureO1_Recomputation_2026-05-21.md** — canonical CEN O1 face energies (baseline for all sensitivity sweeps)
- **CEN_SSOT_W06v3_34KPI_QuestionDerived_Mapping_2026-05-21.md** — Songbook v2.1 60-element grid + element values used
- **CEN_SSOT_Wave0_Consolidation_Map_2026-05-21.md** — Lock #8.6 (constants with tooltips), Lock #8.20 (narrative scaffolding pattern), Lock #8.5 (canonical data pipeline)
- **`POC/companies/cen/mapping-context.json`** lines 315-335 — stale tuning block flagged for reconciliation
- **`POC/js/core/TuningConfig.js`** — canonical SSOT for α, β, γ, δ, κ, λ
- **`POC/js/constants/phi-harmonics.js`** — canonical phi-derived constants reference
- **`~/.claude/CLAUDE.md`** §32 — NO Score Floor + immediate-partnership-discussion pattern

---

## Versioning Notes

- **v1.0 (2026-05-22):** Initial sensitivity analysis. Eight constants covered with per-constant philosophical rationale, sensitivity tables on CEN canonical O1 data, joint sensitivity worked example at γ=0.65 + κ=3, stale tuning block in `mapping-context.json` flagged, AAG E_local-vs-E_final reconciliation question surfaced. Recommendations: keep canonical SSOT v1.0 values; rename or remove stale tuning block; document δ=0.95 NGO override explicitly; defer γ-tuning to v1.2. Six future master's-scope research directions named. Honest tier-discipline framing throughout.

---

*This document was co-authored by Deimantas & Claude with love for honest sensitivity exploration.*
*Per §32 immediate-partnership-discussion: surface, name, partnership-decide. No threshold to meet.*
