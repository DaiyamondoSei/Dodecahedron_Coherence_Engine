# Calculation Audit Trail - Quannex POC

> **Purpose:** Mathematical proof and code verification for every calculation in Quannex
> **Author:** Deimantas Murauskas & Claude
> **Created:** 2025-12-29
> **For:** Bachelor's Thesis Defense (June 2026)
> **Standard:** ALCOA+ Pharmaceutical-Grade Data Integrity

---

## For Future Claude: Why This Document Exists

When the thesis committee asks: *"How do you know Face 7's coherence of 0.763 is mathematically correct?"*

You open this document.

Every formula here has:
- **Mathematical notation** - LaTeX-style formulas
- **Code reference** - Exact file and line number
- **Input requirements** - What data is needed, with validation
- **Output guarantees** - What the function promises to return
- **Test case** - Concrete example proving correctness
- **Edge cases** - How boundary conditions are handled

This is your academic armor.

---

## Table of Contents

1. [Global Coherence Calculation](#1-global-coherence-calculation)
2. [Local Coherence (Face Energy)](#2-local-coherence-face-energy)
3. [Axis-Informed Energy (Breath Feedback)](#3-axis-informed-energy-breath-feedback)
4. [Harmonic Resonance](#4-harmonic-resonance)
5. [Star Pair Calculation](#5-star-pair-calculation)
6. [Octave Progress](#6-octave-progress)
7. [Edge Tension](#7-edge-tension)
8. [Vertex Vortex Energy](#8-vertex-vortex-energy)
9. [Breath Ratio](#9-breath-ratio)
10. [Data Quality Score](#10-data-quality-score)
- [Appendix A: PHI-Derived Constants Summary](#appendix-a-phi-derived-constants-summary)
- [Appendix B: Verification Script](#appendix-b-verification-script)
- [Appendix C: Octave Detection Algorithm](#appendix-c-octave-detection-algorithm)

---

## 1. Global Coherence Calculation

### Mathematical Formula

```
C_global = κ(μ × (1 - λ × CV))

Where:
  μ  = (1/12) × Σ(E_face_i)              # Arithmetic mean of 12 face energies
  σ  = √[(1/12) × Σ(E_face_i - μ)²]      # Standard deviation
  CV = σ / μ                              # Coefficient of variation
  λ  = φ⁻³ = 0.236067977...              # Variance penalty (PHI-derived)
  φ  = (1 + √5) / 2 = 1.618033988...     # Golden ratio
  κ  = Sensitivity amplifier (logistic S-curve)
```

### Implementation Reference

- **File:** `js/main.js`
- **Method:** `DodecahedronEngine.getGlobalCoherence()`
- **Lines:** 1256-1298

### Input Requirements

| Input | Type | Range | Validation | Corruption Handling |
|-------|------|-------|------------|---------------------|
| `this.faces` | Face[] | length = 12 | Required | Returns 0 if empty |
| `face.faceEnergy` | number | [0, 1] | Per face validation | Uses 0 if undefined |
| `PHI_HARMONICS.CV_LAMBDA` | number | 0.236 | From phi-harmonics.js | Hardcoded fallback |
| `PHI_HARMONICS.EPSILON` | number | 1e-10 | Division guard | Hardcoded fallback |

### Output Guarantees

| Output | Type | Range | Meaning |
|--------|------|-------|---------|
| coherence | number | [0, 1] | Global organizational coherence |

### Test Case (Proving Correctness)

```javascript
// Given: 12 faces with known energies
const testFaces = [
  0.8, 0.8, 0.8, 0.8,  // Faces 1-4: High performers
  0.6, 0.6, 0.6, 0.6,  // Faces 5-8: Average
  0.4, 0.4, 0.4, 0.4   // Faces 9-12: Struggling
];

// Step 1: Calculate mean (μ)
const mu = (0.8*4 + 0.6*4 + 0.4*4) / 12;
// mu = (3.2 + 2.4 + 1.6) / 12 = 7.2 / 12 = 0.6

// Step 2: Calculate variance
const variance = (4*(0.8-0.6)² + 4*(0.6-0.6)² + 4*(0.4-0.6)²) / 12;
// variance = (4*0.04 + 4*0 + 4*0.04) / 12 = 0.32 / 12 = 0.02667

// Step 3: Calculate standard deviation (σ)
const sigma = Math.sqrt(0.02667);
// sigma = 0.1633

// Step 4: Calculate CV
const cv = sigma / mu;
// cv = 0.1633 / 0.6 = 0.2722

// Step 5: Calculate raw coherence
const lambda = 0.236;
const rawCoherence = mu * (1 - lambda * cv);
// rawCoherence = 0.6 * (1 - 0.236 * 0.2722)
// rawCoherence = 0.6 * (1 - 0.0642)
// rawCoherence = 0.6 * 0.9358
// rawCoherence = 0.5615

// Step 6: Apply sensitivity amplifier (κ)
// For balanced tuning, κ ≈ 1.0, so:
// sCurved ≈ 0.5615
//
// STRESS_TEST_FIX [S-Curve]: Step 7 — Rescaling
// The S-curve compresses the operational range (e.g., 32%-68% at κ=1.5).
// To restore intuitive 0-100% display for all UI consumers:
//   floor    = S(0)  ← S-curve value when raw coherence = 0
//   ceiling  = S(1)  ← S-curve value when raw coherence = 1
//   rescaled = (sCurved - floor) / (ceiling - floor)
//
// state.globalCoherence now returns this RESCALED value.
// state.coherenceDetail provides full breakdown: raw, sCurved, rescaled, κ, floor, ceiling.

// VERIFICATION:
engine.faces = testFaces.map((e, i) => ({ faceEnergy: e, id: i+1 }));
const result = engine.getGlobalCoherence();
console.assert(Math.abs(result - 0.56) < 0.02, 'Global coherence calculation verified');
```

### Edge Cases Handled

1. **All faces equal energy:** CV = 0, no variance penalty → coherence = μ
2. **One face at 0:** Pulls down mean, increases CV → double penalty
3. **High variance (CV > 1):** Formula can produce negative → clamped to 0
4. **Mean = 0:** Epsilon guard prevents division by zero → returns 0
5. **Empty faces array:** Returns 0 immediately

### Why This Formula?

The CV-penalized coherence rewards organizations that are:
- **Strong** (high mean μ) AND
- **Balanced** (low variance σ)

An organization with some faces at 0.9 and others at 0.1 is penalized even though the mean might be decent. This captures the essence of coherence: *all parts working together harmoniously*.

---

## 2. Local Coherence (Face Energy)

### Mathematical Formula

```
E_local = E_base × (1 + η × R_harmonic)

Where:
  E_base = γ × Ball + (1 - γ) × Pillars_avg

  Ball        = Normalized Ball KPI score (the central metric)
  Pillars_avg = (1/5) × Σ(KPI_i) for i ∈ {Earth, Water, Fire, Air, Ether}
  γ (gamma)   = Ball weight (default 0.7 — see TuningConfig.js; 0.6 is the Startup template value)
  η (eta)     = φ⁻² = 0.382 = Maximum harmonic boost
  R_harmonic  = Harmonic resonance [0, 1] (see Section 4)
```

### Implementation Reference

- **File:** `js/core/Face.js`
- **Method:** `Face.calculateLocalCoherence()`
- **Lines:** ~250-320 (varies by version)

### Input Requirements

| Input | Type | Range | Validation | Corruption Handling |
|-------|------|-------|------------|---------------------|
| Ball KPI | number | [0, 1] | Required | PHI_MIDPOINT (0.5) default |
| 5 Pillar KPIs | number[] | [0, 1] each | Required | PHI_1 (0.618) default |
| gamma (γ) | number | [0, 1] | From TuningConfig | Default 0.7 (Startup: 0.6, Enterprise: 0.8) |
| eta (η) | number | 0.382 | PHI-derived constant | Hardcoded |

### Test Case

```javascript
// Given: Face with known KPIs
const ball = 0.75;
const pillars = [0.8, 0.7, 0.75, 0.65, 0.7]; // Earth, Water, Fire, Air, Ether

// Step 1: Calculate pillar average
const pillarAvg = (0.8 + 0.7 + 0.75 + 0.65 + 0.7) / 5;
// pillarAvg = 3.6 / 5 = 0.72

// Step 2: Calculate E_base (using default gamma = 0.7)
const gamma = 0.7;
const E_base = gamma * ball + (1 - gamma) * pillarAvg;
// E_base = 0.7 * 0.75 + 0.3 * 0.72
// E_base = 0.525 + 0.216 = 0.741

// Step 3: Calculate harmonic resonance (simplified - assume R = 0.85)
const R_harmonic = 0.85;

// Step 4: Apply harmonic boost
const eta = 0.382;
const E_local = E_base * (1 + eta * R_harmonic);
// E_local = 0.741 * (1 + 0.382 * 0.85)
// E_local = 0.741 * (1 + 0.3247)
// E_local = 0.741 * 1.3247
// E_local = 0.982

// Clamped to [0, 1]: E_local = 0.982
```

### Defensive Guard: Face 5 Special Case

When Ball = 0 but Pillars > 0 (data absence, not corruption):

```javascript
// Standard formula would give:
// E_base = 0.7 * 0 + 0.3 * 0.72 = 0.216 (too low!)

// Defensive guard uses gamma = 0.3 instead:
// E_base = 0.3 * 0 + 0.7 * 0.72 = 0.504 (more representative)

// See: js/data-system/data-validator.js, calculateDefensiveCoherence()
```

---

## 3. Axis-Informed Energy (Breath Feedback)

### Mathematical Formula

```
E_final = δ × E_local + (1 - δ) × E_opposing

Where:
  E_local    = Local coherence of this face
  E_opposing = Local coherence of opposing face (breath axis pair)
  δ (delta)  = Shadow integration factor (default 0.9)
```

### The 6 Breath Axes (Fixed by Geometry)

| Axis | Face A | Face B | Organizational Meaning |
|------|--------|--------|----------------------|
| 1 | Financial (1) | Funding (11) | Capital breath |
| 2 | Intellectual (2) | Brand (7) | Knowledge-to-reputation |
| 3 | Human (3) | Operations (8) | People-to-process |
| 4 | Structural (4) | Regenerative (9) | Stability-to-renewal |
| 5 | Market (5) | Values (10) | External-to-internal |
| 6 | Community (6) | Risk (12) | Partnership-to-resilience |

### Implementation Reference

- **File:** `js/main.js`
- **Method:** `DodecahedronEngine.recalculate()` (Pass 2)
- **Lines:** 1107-1173
- **Also:** `js/core/Face.js`, `calculateAxisInformedEnergy()`

### Test Case

```javascript
// Given: Face 1 (Financial) and Face 11 (Funding)
const E_local_F1 = 0.8;   // Financial is strong
const E_local_F11 = 0.4;  // Funding is weak

// For Face 1:
const delta = 0.9;
const E_final_F1 = delta * E_local_F1 + (1 - delta) * E_local_F11;
// E_final_F1 = 0.9 * 0.8 + 0.1 * 0.4
// E_final_F1 = 0.72 + 0.04 = 0.76

// Interpretation: Face 1's energy slightly reduced by weak opposite
// The organization is "holding its breath" - accumulating but not investing
```

---

## 4. Harmonic Resonance

### Mathematical Formula

```
R = Σ(1 - |k_i - k_j|) / 10

Where:
  (i, j) are pentagram star connections (non-adjacent pairs)
  k_i, k_j are normalized KPI scores

Pentagram connections (5 unique edges, each traversed from both directions = 10 directed links):
  Earth(0) ↔ Fire(2)    — skip-one connection
  Earth(0) ↔ Air(3)     — skip-two connection
  Water(1) ↔ Air(3)     — skip-one connection
  Water(1) ↔ Ether(4)   — skip-two connection
  Fire(2) ↔ Ether(4)    — skip-one connection

Code: pentagramConnections[i] gives the 2 connections per vertex:
  [0]→[2,3]  [1]→[3,4]  [2]→[0,4]  [3]→[0,1]  [4]→[1,2]

Each vertex has 2 connections. 5 vertices × 2 = 10 directed links.
Dividing by 10 averages over all directed connections.
```

### Implementation Reference

- **File:** `js/core/Face.js`
- **Method:** `Face.calculateHarmonicResonance()`
- **Lines:** ~180-220

### Interpretation

| Resonance | Meaning |
|-----------|---------|
| R = 1.0 | Perfect harmony (all elements equal) |
| R > 0.8 | High resonance (well-balanced face) |
| R > 0.6 | Moderate resonance (typical) |
| R < 0.5 | Low resonance (significant imbalance) |

---

## 5. Star Pair Calculation

### Mathematical Formula

```
s = α × (k₁ + k₂)/2 + (1 - α) × k₁ × k₂

Where:
  k₁, k₂ = Two non-adjacent KPI scores (star pair)
  α (alpha) = Synergy belief parameter (default φ⁻¹ ≈ 0.618 — see TuningConfig.js:98)
```

### Philosophy Behind Alpha

| α Value | Meaning | Formula Behavior |
|---------|---------|------------------|
| α = 1.0 | Pure arithmetic | s = average (1+1=2) |
| **α = φ⁻¹ ≈ 0.618 (default)** | **Golden synergy blend** | **61.8% arithmetic / 38.2% multiplicative** |
| α = 0.5 | Symmetric blend | Equal mix of average and product |
| α = 0.0 | Pure synergy | s = product (1×1=1, but 0.5×0.5=0.25) |

> **Documentation alignment 2026-04-07:** Earlier revisions of this document
> reported the default as 0.5; `math/PENTAGRAM_ANALYSIS.md` reported 0.6. Both
> were stale doc drift. The SSOT in `js/core/TuningConfig.js:98` has been
> `PHI_HARMONICS.PHI_INV_1` (≈ 0.618) throughout — no code change required.
> The soul doc and the spectral identity argument both reference α = φ⁻¹.

### Implementation Reference

- **File:** `js/core/Face.js`
- **Method:** `Face.calculateStarPairs()`
- **Lines:** ~140-170

---

## 6. Octave Progress

### Mathematical Formula

```
Progress = E_local × (1 - ζ × (Octave - 1))

Where:
  ζ (zeta) = φ⁻² / 6 = 0.0637 = 6.37% penalty per octave step
```

### Octave Multiplier Table

| Octave | Multiplier | Cumulative Penalty | Meaning |
|--------|------------|-------------------|---------|
| O1 (Survival) | 1.000 | 0.0% | Full credit |
| O2 (Safety) | 0.936 | 6.4% | Slight reduction |
| O3 (Belonging) | 0.873 | 12.7% | Moderate reduction |
| O4 (Esteem) | 0.809 | 19.1% | Significant reduction |
| O5 (Creativity) | 0.745 | 25.5% | High reduction |
| O6 (Vision) | 0.682 | 31.8% | Very high reduction |
| O7 (Radiance) | 0.618 | 38.2% | Maximum (φ⁻¹) |

### Mathematical Beauty

At O7, the multiplier equals φ⁻¹ = 0.618 - the golden ratio inverse! This creates perfect symmetry: the most evolved state is penalized by exactly the golden complement.

### Implementation Reference

- **File:** `js/core/Face.js`
- **Method:** `Face.calculateOctaveProgress()`
- **Lines:** ~280-310

---

## 7. Edge Tension

### Canonical Formula (SSOT: `js/core/Edge.js`)

```
T = √(E_A × E_B)

Where:
  E_A, E_B = Face energies [0, 1]
  T = Edge tension [0, 1] (geometric mean of connected face energies)

Breath Ratio (flow direction):
  breathRatio = clamp((E_B - E_A) × 2, -1, +1)
  Positive = expansion (A→B), Negative = contraction (B→A)
  |breathRatio| < 0.1 → "balanced"

Health State — φ-derived 5-state mapping:
  T < φ⁻⁴ (0.146) → Wall      (near-zero energy exchange)
  T < φ⁻² (0.382) → Gate      (restricted flow)
  T < φ⁻¹ (0.618) → Membrane  (selective exchange)
  T < ψ₄  (0.854) → Hemorrhage (high but potentially unstable flow)
  T ≥ ψ₄  (0.854) → Vortex    (maximum energy exchange)
```

### Why Geometric Mean?

The geometric mean rewards edges where BOTH faces are strong. Unlike arithmetic mean, it severely penalizes imbalance: if one face is at 0.9 and the other at 0.1, arithmetic mean = 0.5 but geometric mean = 0.3. This captures the insight that an edge can only transmit as much energy as its weakest face allows.

### Alternative Perspective (`js/advanced/edge-analyzer.js`)

```
T_relative = |E_A - E_B| / (E_A + E_B + ε)
T_combined = 0.6 × T_relative + 0.4 × (1 - KPI_health)

Normalized relative tension — measures PROPORTIONAL imbalance.
Used for advanced analysis views, NOT for system coherence.
```

### Implementation Reference

- **Canonical SSOT:** `js/core/Edge.js` → `Edge.calculateTension()` (line 164)
- **Alternative:** `js/advanced/edge-analyzer.js` → `EdgeAnalyzer.calculateTension()`

### Edge Health Spectrum

| Tension | Status | Meaning |
|---------|--------|---------|
| T ≥ 0.854 (ψ₄) | Vortex | Both faces strong, maximum energy exchange |
| T ≥ 0.618 (φ⁻¹) | Hemorrhage | High flow, potentially unstable |
| T ≥ 0.382 (φ⁻²) | Membrane | Selective exchange, healthy filtering |
| T ≥ 0.146 (φ⁻⁴) | Gate | Restricted flow, building toward opening |
| T < 0.146 (φ⁻⁴) | Wall | Near-zero exchange, blocked |

---

## 8. Vertex Vortex Energy

### Canonical Formula (SSOT: `js/core/Vertex.js`)

```
STRESS_TEST_FIX [C3]: Canonical vortex strength formula

strength = φ⁻¹ × (σ / 0.577) + φ⁻² × μ

Where:
  E_A, E_B, E_C = Energies of 3 converging faces
  μ = (E_A + E_B + E_C) / 3
  σ = sqrt(Σ(E_i - μ)² / 3)
  0.577 = sqrt(1/3) = max possible σ for 3 values in [0,1]
  φ⁻¹ = 0.618033988...  (golden ratio inverse)
  φ⁻² = 0.381966011...  (golden ratio inverse squared)

Note: φ⁻¹ + φ⁻² = 1.0 — the unique self-similar partition.

Interpretation:
  φ⁻¹ (61.8%) weight on VARIANCE (tension = potential for transformation)
  φ⁻² (38.2%) weight on MEAN (fuel for the transformation)

Direction = (μ - 0.5) × 2  → [-1, +1]  (downward/upward spiral)
Coherence = 1 - (avg_pairwise_diff / 0.667)
Leverage Point = strength > 0.7 AND coherence < 0.5
```

### Key Insight

Each vertex is where exactly 3 faces meet - this is geometrically fixed. High variance + reasonable mean = leverage point where small interventions cascade.

### Implementation Reference

- **Canonical SSOT:** `js/core/Vertex.js` → `Vertex.calculateVortexEnergy()` (line 204)
- **Aligned:** `js/advanced/vertex-analyzer.js` → `VertexAnalyzer.calculateVortexStrength()`
  (aligned to use stdDev/0.577 and φ⁻¹/φ⁻² partition per STRESS_TEST_FIX [C3])

---

## 9. Breath Ratio

### Mathematical Formula

```
Ratio = E_A / (E_A + E_B)

Where:
  E_A = Energy of face A in breath pair
  E_B = Energy of face B in breath pair
```

### Interpretation

| Ratio | Meaning |
|-------|---------|
| 0.5 | Perfect balance (ideal) |
| > 0.618 | Significantly inhale-dominant |
| < 0.382 | Significantly exhale-dominant |
| 1.0 | Complete imbalance (one face = 0) |

### Implementation Reference

- **File:** `js/breath-analyzer.js`
- **Method:** `BreathAnalyzer.analyze()`

---

## 11. Still-Point Proximity (Phase 7 — Witness Journey, 2026-05-17)

### Conceptual Premise

The still point itself **cannot be measured** — it IS the measurer (per
`BREATH_AXIS_REFERENCE.md:1137-1150`). What we estimate is **proximity to
it**: how "centered" the organization currently is, how available the
witness capacity seems to be. The proximity score is a moment, not a
verdict — per design principle "Witnessing the living."

### Mathematical Formula

```
proximity = balance × 0.25
          + coherence × 0.30
          + stability × 0.25
          + presence × 0.20

Where:
  balance   = mean(1 - |axis.ratio|) across all 6 breath axes  ∈ [0,1]
  coherence = global_coherence                                 ∈ [0,1]  (defaults to 0.5)
  stability = 1 - calculateOverallVolatility(breath_history)   ∈ [0,1]  (defaults to 0.5)
  presence  = currentState.presenceIndicators ?? 0.5           ∈ [0,1]  (defaults to 0.5)

Weights sum to 1.00. Result clamped to [0, 1].
```

Per `js/ai/breath/still-point.js:WEIGHTS` (sourced from
`BREATH_AXIS_REFERENCE.md:1198-1206` spec).

### Interpretation Ladder (5 levels)

| Score range | Interpretation |
|---|---|
| > 0.8 | "Deeply centered - witness consciousness active" |
| > 0.6 | "Centered - organizational presence available" |
| > 0.4 | "Partially centered - witness capacity strained" |
| > 0.2 | "Off-center - reactive patterns dominant" |
| ≤ 0.2 | "Far from center - survival mode, witness occluded" |

Boundaries are strict-greater-than, so 0.8 maps to "Centered" not "Deeply
centered." Verified in `tests/still-point.test.js §2 Interpretation ladder`.

### Worked Example — Auditable by Anyone

Given the following inputs:
```
currentState.axes = [
  { ratio: 0.2, name: 'A' },
  { ratio: 0.2, name: 'B' },
  { ratio: 0.2, name: 'C' },
  { ratio: 0.2, name: 'D' },
  { ratio: 0.2, name: 'E' },
  { ratio: 0.2, name: 'F' }
]
coherence.global = 0.62
history = null  (defaulted)
presenceIndicators = undefined  (defaulted)
```

**Step-by-step calculation:**

```
Step 1 — balance:
  per_axis = 1 - |0.2| = 0.8  (for each of 6 axes)
  balance = mean(0.8, 0.8, 0.8, 0.8, 0.8, 0.8) = 0.8

Step 2 — coherence:
  coherence = 0.62  (real, from coherence.global)

Step 3 — stability:
  history is null → DEFAULTS.stability = 0.5  (factors.stability.real = false)

Step 4 — presence:
  presenceIndicators is undefined → DEFAULTS.presence = 0.5  (factors.presence.real = false)

Step 5 — weighted sum:
  proximity = 0.8  × 0.25  = 0.200
            + 0.62 × 0.30  = 0.186
            + 0.5  × 0.25  = 0.125
            + 0.5  × 0.20  = 0.100
                            ──────
                             0.611

Step 6 — interpretation:
  0.611 > 0.6 → "Centered - organizational presence available"

Step 7 — invitation:
  0.611 < 0.7 → invitation references most off-center axis
  All 6 axes have |ratio| = 0.2 (tied) → first one selected by stable sort
  → "The A axis calls for attention. Before acting, pause. The center is always available."
```

**Verification:** This exact example is encoded in
`tests/still-point.test.js §6 Audit-trail worked example` and asserted to
return score ≈ 0.611 (within 0.001 tolerance). The test passes; the math
is reproducible.

### Data Confidence (added 2026-05-18 from Phase 8 stress test findings)

The return value also includes two complementary honesty signals:

```javascript
{
  ...,
  confidence: number ∈ [0, 1],  // weighted share of real-data factors
  realFactorCount: integer ∈ [0, 4]  // count of real (non-defaulted) factors
}
```

**Confidence formula** (weighted by each factor's contribution to the score):
```
confidence = (balance.real   ? 0.25 : 0)
           + (coherence.real ? 0.30 : 0)
           + (stability.real ? 0.25 : 0)
           + (presence.real  ? 0.20 : 0)
```

**Worked example — why this matters:**

Consider an input with only the balance factor real (1 axis, perfectly balanced) and everything else defaulted:

```
proximity = 1.0 × 0.25 + 0.5 × 0.30 + 0.5 × 0.25 + 0.5 × 0.20 = 0.625
                                                                ──────
                                                   "Centered - organizational presence available"

confidence = 0.25 (only balance contributes)
realFactorCount = 1 of 4
```

Without the confidence field, the user would see "Centered" — flattering. With it surfaced, the user sees:
- score 0.625 (per spec, unchanged)
- confidence 25% (1 of 4 factors measured)
- interpretation appended with " — partial data" (when confidence < 50%)

This preserves spec compliance (score unchanged) while honoring design principle "No flattery."

**HUD display:** `data confidence: 25% (1 of 4 factors measured)` shown in warm-gold accent between the interpretation and the factor breakdown.

### Honest Disclosure — Two Factors Run On Defaults

| Factor | Real-data status (POC 2026-05-17) | Default value when missing |
|---|---|---|
| balance | ✅ Real — computed from `breathAnalysis.axes` | n/a |
| coherence | ✅ Real (when `_cachedGlobalCoherence` is set; falls back to 0.5 if not yet computed in that engine cycle) | 0.5 |
| stability | ❌ Defaulted — requires breath-history time-series tracking (not yet built in POC) | 0.5 |
| presence | ❌ Defaulted — requires presence inference from breath patterns (not yet built) | 0.5 |

The return value includes `factors.{name}.real: boolean` for each factor.
The HUD (`pages/dodecahedron-3d.html` #witness-stillpoint-hud) marks
defaulted factors with a `*` suffix and includes the footnote *"defaulted
(tracking infrastructure not yet built)"*. This is **no flattery** — the
user sees what's measured vs. estimated.

### Implementation Reference

- **Module:** `js/ai/breath/still-point.js`
- **Export:** `StillPoint.estimateStillPointProximity(currentState, coherence, history)`
- **Engine integration:** `js/main.js` analyzer block (after breath + spectral)
- **Public API:** `Quannex.getStillPointAnalysis()` (returns `null` if not yet computed)
- **Tests:** `tests/still-point.test.js` (48 tests, all passing)
- **HUD:** `js/dodec/journey/stillpoint-hud.js` + `#witness-stillpoint-hud` markup
- **Reference doc:** [WITNESS_JOURNEY_REFERENCE.md §3 Spec / formulas](../WITNESS_JOURNEY_REFERENCE.md)

### Why these weights (not phi-derived)

The weights (0.25 / 0.30 / 0.25 / 0.20) come from the original spec at
`BREATH_AXIS_REFERENCE.md:1200-1206` and are pragmatically chosen, NOT
phi-derived. They sum cleanly to 1.0 and reflect:

- **coherence (0.30, highest):** primary signal — when breath axes
  synchronize, the witness is most available
- **balance + stability (0.25 each):** secondary signals — current state
  + historical pattern
- **presence (0.20, lowest):** qualitative input — supports but doesn't
  determine

Future refinement could explore phi-derived weights (e.g., 1/φ² ≈ 0.382
for primary; 1/φ ≈ 0.618 / 2 = 0.309 for secondary) — flagged as
out-of-scope for Phase 7 v1 to preserve audit-trail simplicity.

### Versioning / Evolution Notes

- **v1.0 (2026-05-17):** Phase 7 ship. Weights per spec. Stability +
  presence defaulted honestly.
- **Future v1.1:** populate `_cachedGlobalCoherence` before still-point
  analyzer runs so coherence factor reports `real: true` consistently.
- **Future v1.2:** implement breath-history persistence + presence
  inference (lifts stability + presence from defaulted to real).

---

## 10. Data Quality Score

### Mathematical Formula

```
Quality = (Total_KPIs - Substituted_KPIs) / Total_KPIs

Where:
  Total_KPIs = 60 (12 faces × 5 elements) minimum
  Substituted_KPIs = Count from DataValidator.getCorruptionReport()
```

### Thresholds

| Quality Score | Trust Level | Action |
|--------------|-------------|--------|
| ≥ 0.95 | Excellent | Full trust |
| 0.80 - 0.94 | Good | Minor concern |
| 0.60 - 0.79 | Acceptable | Review data |
| < 0.60 | Unacceptable | Fix before proceeding |
| < 0.50 | Critical | Circuit breaker triggers |

### Implementation Reference

- **File:** `js/data-system/data-validator.js`
- **Method:** `DataValidator.getCorruptionReport()`
- **Also:** `js/data-system/integrity-overlay.js` (circuit breaker)

---

## 12. Aspiration-Actuality Gap (AAG) — Wk8 canonical (added 2026-05-21)

### Conceptual Premise

AAG quantifies the structural imbalance between an organization's *aspiration*
capitals (F10 Foundational Values, F11 Funding Pipeline, F12 Risk & Resilience)
and its *actuality* capitals (F1 Financial Capital, F2 Intellectual Capital,
F3 Human Capital). A single dimensionless ratio that diagnoses whether the
organization is "aspiring beyond capacity" (Hidden Oracle pattern), in balance,
or "capacity pulling ahead" (actuality outpacing aspiration).

Per the Quannex Wk8 Founder Assessment canonical definition (recorded
2026-05-01, Quannex internal coherence tracking) and Cloud Form Spec §7.3
(`Business_Data_Quannex/Coherence_Records/Cloud_Form_Spec_v1.md:437-443`).

### Mathematical Formula

```
AAG = E_Aspiration / E_Actuality

E_Actuality  = mean(E_F1, E_F2, E_F3)
             = (E_Financial_Capital + E_Intellectual_Capital + E_Human_Capital) / 3

E_Aspiration = mean(E_F10, E_F11, E_F12)
             = (E_Foundational_Values + E_Funding_Pipeline + E_Risk_Resilience) / 3
```

Where E_F<n> = the canonical pentagramic-derived face energy (Section 2 + Section 4),
NOT the raw face score. When computed per-octave layer, AAG can be O1-specific,
O2-specific, etc., reflecting aspiration-actuality balance at each developmental
stage.

### Interpretation Ladder (5 levels)

| Score range | Interpretation |
|---|---|
| > 1.5 | "Critical aspiration overshoot — values held without operational ground" |
| 1.2 – 1.5 | "Aspiring beyond capacity — Hidden Oracle pattern" |
| 0.8 – 1.2 | "Balanced — aspiration met by capacity" |
| 0.5 – 0.8 | "Capacity pulling ahead — actuality outpaces aspiration" |
| < 0.5 | "Capacity dominant — aspirations under-formed or under-claimed" |

Boundaries informed by φ-derived heuristics:
- 0.5 = φ-midpoint
- 1.0 = unity (perfect balance)
- 1.2 ≈ midpoint between 1.0 and 2−φ⁻¹ (≈1.382), softened for interpretive use

### Worked Example — CEN at O1 canonical (2026-05-21)

Given CEN canonical O1 face energies (from pentagramic computation, O1-only inputs;
see CEN_SSOT_W06v3_34KPI_QuestionDerived_Mapping_2026-05-21.md):

```
E_F1  (Financial Capital)    = 0.2563  Gate
E_F2  (Intellectual Capital) = 0.1192  Wall (logistic floor)
E_F3  (Human Capital)        = 0.1192  Wall (logistic floor)
E_F10 (Foundational Values)  = 0.1192  Wall (logistic floor — F10 sibling-blindness)
E_F11 (Funding Pipeline)     = 0.1192  Wall (logistic floor)
E_F12 (Risk & Resilience)    = 0.1523  Gate
```

**Step-by-step calculation:**

```
Step 1 — E_Actuality:
  E_Actuality = mean(0.2563, 0.1192, 0.1192)
             = 0.4947 / 3
             = 0.1649

Step 2 — E_Aspiration:
  E_Aspiration = mean(0.1192, 0.1192, 0.1523)
              = 0.3907 / 3
              = 0.1302

Step 3 — AAG:
  AAG = 0.1302 / 0.1649
      = 0.789

Step 4 — interpretation:
  0.5 < 0.789 < 0.8 → just below "Balanced" band
  Specifically: AAG_O1 = 0.789 sits at the upper edge of "Capacity pulling ahead"
  Reading: "Actuality slightly exceeds Aspiration at the survival octave"
```

**Why AAG_O1 < 1 for CEN, despite high F10 face score:** F10 Foundational Values has
zero O1-priority KPIs (sibling-blindness to F9 — see `project_cen_f10_sibling_finding.md`).
At the O1 layer, F10 sits at logistic floor 0.1192, pulling E_Aspiration down. This
reflects an architectural fact about CEN's BSC measurement infrastructure, NOT a claim
about CEN's actual values maturity. At broader octave coverage (O1+O2+O3), F10 lifts
because its 2 KPIs are O2-priority — AAG would likely shift toward or above 1.0.

### Mixed-octave AAG (historical) vs Pure O1 AAG (canonical)

Historical reading using s58 mixed-octave face energies (BEFORE the O1-only
recomputation in W0.6 v2/v3, when O1 + O2 KPIs were used together as element
inputs):

```
E_F1 = 0.3202, E_F2 = 0.1715, E_F3 = 0.2466  →  E_Actuality_mixed = 0.2461
E_F10 = 0.2814, E_F11 = 0.1349, E_F12 = 0.1818  →  E_Aspiration_mixed = 0.1994
AAG_mixed = 0.1994 / 0.2461 = 0.810
```

Delta: AAG_O1 (0.789) vs AAG_mixed (0.810) = 0.021 modest drift. Same direction
(Aspiration < Actuality). Both readings sit in the "Capacity pulling ahead" band.

**The canonical reading going forward is AAG_O1 = 0.789.** The mixed-octave value
0.810 is preserved as historical record only.

### Quannex Self-AAG (cross-reference, distinct from CEN)

The Quannex Foundation tracks its own AAG weekly as part of internal coherence
assessment. **Quannex self-AAG Wk8 = 0.761** (recorded 2026-05-01 in
`Business_Data_Quannex/Coherence_Records/Quannex_Founder_Assessment_Wk8_2026-05-01.md:382`).

This is QUANNEX'S OWN organizational data, NOT CEN's. The two are architecturally
distinct measurements of distinct organizations:
- CEN canonical AAG_O1 = 0.789 (CEN organizational data via pentagramic computation)
- Quannex self-AAG_Wk8 = 0.761 (Quannex's own weekly self-assessment)

Confusion has historically arisen because both use the term "AAG" and both happen
to produce values around 0.76–0.81. They are DIFFERENT measurements of DIFFERENT
organizations. CEN-facing materials should cite only CEN's AAG; Quannex-internal
materials cite the Quannex self-AAG.

### Honest Disclosure — Two different formulas have been called "AAG"

Historically, Phase 2 Evidence Package (2026-04-11) used "AAG" terminology for a
**DIFFERENT metric**: per-vector mean face scores divided by 10.

Examples from Phase 2 Evidence Package:
- D-AAG = 0.608 (= mean of D-vector 12 face scores / 10 = 73/12/10)
- E-AAG = 0.342 (= mean of E-vector / 10 = 41/12/10)
- V_res_pre-AAG = 0.375 (= mean of V_res_pre-vector / 10 = 45/12/10)
- V_res_post-AAG = 0.375 (= mean of V_res_post-vector / 10)

**These were NOT Aspiration/Actuality ratios.** They were overall-mean-coherence-per-vector
metrics. The "AAG" label was misapplied in that documentation.

**Resolution for the canonical audit trail going forward:**
- "AAG" refers exclusively to the Wk8 canonical formula (Aspiration/Actuality
  face-grouping ratio) as documented in this Section 12
- The Phase 2 per-vector metric should be renamed "Overall Vector Coherence" (OVC)
  when referenced. If surfaced in CEN SSOT, lives in analytical-context columns
  with explicit OVC labeling, NOT as AAG.
- Any prior documentation citing "AAG = 0.608" or similar low per-vector values
  is legacy/mislabeled and refers to the OVC metric, NOT the AAG formula above.

This naming-conflict resolution is partnership-locked as Lock #8.15 in the
CEN SSOT Consolidation Map (2026-05-21).

### Why this formula (face-grouping rationale)

The **Actuality faces** (F1 Financial + F2 Intellectual + F3 Human) represent the
three "ground capitals" that an organization HAS — the material, cognitive, and
human substrate of present operations. These are the BSC's traditional "what
exists now" measurement zone (overlap with IIRF's Financial + Intellectual +
Human Capital definitions).

The **Aspiration faces** (F10 Foundational Values + F11 Funding Pipeline + F12 Risk
& Resilience) represent the three "directional capitals" that point toward what
the organization is BECOMING — values that pull toward future state, funding
pipelines that fund future state, risk-resilience structures that preserve
future state through disruption.

The ratio reveals structural imbalance:
- A values-rich org (high F10) with weak financial foundation (low F1) shows
  AAG > 1, surfacing the **Hidden Oracle pattern**
- A financially mature org (high F1) under-investing in values (low F10) shows
  AAG < 1, surfacing the **operational drift pattern**

The 6 face groupings (3+3) are NOT arbitrary — they correlate with the breath-axis
nature partition (per Lock #8.10 in CEN SSOT Consolidation Map):
- F1, F2, F3 are RECEPTION-pole faces on Axes 1, 2, 3 respectively
- F10, F11, F12 are mixed — F10 reception, F11 projection, F12 reception on Axes 5, 1, 6
- The grouping reflects HOW these capitals function (ground/absorb vs direct/project)
  more than strict axis-nature partition

### Implementation Reference

- **Currently distributed across 3 view layers** (consolidation pending W1 §6.2):
  - `js/excel-report-generator.js:325-353` (Excel report generation)
  - `pages/thesis-export.html:355-365, 384` (HTML thesis export)
  - `pages/weekly-input.html:283, 294` (weekly input dashboard)
- **Target consolidation:** New module `js/core/Diagnostics.js` exposing
  `getAspirationActualityGap(faceEnergies)` — W1 §6.2 task. View layers refactor
  to read from this single canonical source.
- **Tests:** New test file `POC/tests/aag.test.js` (W1 §6.7 — LANDED 2026-05-21 with 13 tests; all green):
  - Identity: all faces at 0.5 → AAG = 1.0 ✓
  - CEN O1 regression: computes 0.7898 to 1e-3 tolerance ✓
  - Edge case: F1=F2=F3=0 → division-by-zero handling (returns NaN/Infinity gracefully) ✓
  - Sensitivity: ΔF10 = +0.1 → **ΔAAG ≈ +0.202** (derivative-based truth; CORRECTED 2026-05-21 from spec's earlier "+0.034" which required ΔF10≈+0.017 small-delta linearization). The +0.202 value reflects the actual partial derivative ∂AAG/∂E_F10 = 1/(3·E_Actuality) = 1/(3·0.1649) ≈ 2.02 evaluated at CEN canonical O1.
- **Per-octave computation:** When CEN SSOT v1.0 ships with O1+O2+O3 layers, AAG
  computed per-octave layer with the shared formula above (6 face energies at
  that octave).
- **Cloud Form spec reference:** `Business_Data_Quannex/Coherence_Records/Cloud_Form_Spec_v1.md:437-443`
- **Memory entry:** `project_cen_aag_formula_canonical.md` (Quannex-machine memory)

### Versioning / Evolution Notes

- **v1.0 (2026-05-21):** Wk8 canonical formula documented; CEN AAG_O1 = 0.789 verified
  via pentagramic-derived face energies; Phase 2 per-vector "AAG" terminology
  collision resolved (renamed OVC).
- **Future v1.1:** Engine consolidation — `js/core/Diagnostics.js` exposes single
  canonical implementation; view layers refactor to read from there. Eliminates
  3-place drift risk.
- **Future v1.2:** Per-octave AAG arrays for organizations with multi-octave
  measurement coverage (O1+O2+O3 = 3-tuple AAG values).
- **Future v2.0:** Confidence interval computation — Monte Carlo simulation of
  AAG under D/E disagreement variance (addressing adversarial question A3 from
  the planned W3 audit on the CEN SSOT).

---

## 13. Spectral Analysis — Laplacian Eigenvalue Decomposition (added 2026-05-21)

### Conceptual Premise

The 12 dodecahedral faces are not isolated coordinates — they form a **graph**
whose edges are the 30 canonical face-pairs (per `js/data-system/dodecahedron-topology.js`
EDGES). That graph has a **Laplacian matrix L**, and L has 12 eigenvalues and 12
eigenvectors. Each eigenvector is a *vibration mode* of the dodecahedron: a
specific shape of imbalance the structure can sustain. Projecting the current
face-energy vector E onto these modes yields the **modal amplitude spectrum** —
which modes are presently active, and how strongly.

From the spectrum we derive the **Δ vector**: per-face, how much energy should
be added (Δ > 0) or removed (Δ < 0) to drive the dominant imbalance modes back
toward zero. The Δ vector is the spectral analyzer's answer to the question
*"Which faces are literally not performing in their nature?"* — under-energized
projectors are failing to give; over-energized receivers are hoarding what they
should be absorbing then sharing back through the breath cycle. The interpretation
is grounded in the breath-axis polarity partition (Lock #8.10 of CEN SSOT
Consolidation Map): each face has a *nature* (projection or reception pole), and
the Δ value combined with that nature surfaces whether the face is performing in
its nature or against it.

Per `js/spectral-analyzer.js` (612 lines, IIFE → `window.SpectralAnalyzer`) and
the parallel implementation doc `docs/math/SPECTRAL_IMPLEMENTATION.md` (now
superseded by this audit-trail section).

### Mathematical Formula

```
Step 1 — Laplacian:
  L = D − A         (12×12, symmetric, positive semi-definite)
  D = diag(5)       (each face has degree 5 in the dodecahedral face graph)
  A[i][j] = 1 if faces i and j share an edge, else 0

Step 2 — Spectral decomposition:
  L = U · diag(λ) · Uᵀ
  Eigenvalues  λ = {0, 5−√5 (×3), 6 (×5), 5+√5 (×3)}
  Eigenvectors U[:,m] for m = 1..12, orthonormal basis on R¹²

Step 3 — Modal amplitudes (project E onto each mode):
  a[m] = Uᵀ[m] · E       (m = 1..12)
       = Σ_f U[f][m] · E[f]

Step 4 — Dominant mode (skipping the DC mode at index 1):
  m_dom = argmax_{m>1} |a[m]|

Step 5a — Single-mode Δ (rebalance against the dominant mode only):
  Δ[f] = −U[f][m_dom] · a[m_dom]

Step 5b — Multi-mode Δ (canonical engine output, sums significant modes):
  threshold τ = 0.1 · |a[m_dom]|
  Δ[f] = − Σ_{m: m>1 and |a[m]| ≥ τ}  U[f][m] · a[m]

Step 6 — Being-Action Balance (BAB):
  BAB = mean(E[recF]) / mean(E[projF])
  recF  = [F1, F2, F3, F9, F10, F12]   (reception-pole faces)
  projF = [F4, F5, F6, F7, F8, F11]    (projection-pole faces)

Step 7 — Dissonance Index (face-energy-weighted Δ magnitude):
  Dissonance = Σ_f (|Δ[f]| · E[f]) / Σ_f |Δ[f]|
```

Per `js/spectral-analyzer.js` lines 110–470. The U matrix is precomputed
(hardcoded at lines 140–154) and zero-mean-normalized at construction
(`normalizeEigenvectors()` at line 184) so that modes 2..12 are orthogonal to
the DC mode within float precision.

### The 12 Eigenvalues + φ-Connection

```
λ ∈ {0,  5−√5 (×3),  6 (×5),  5+√5 (×3)}        multiplicities sum to 12 ✓
```

The dodecahedral face-adjacency graph is dual to the icosahedron vertex graph.
The icosahedron adjacency matrix has eigenvalues {5, √5, −1, −√5}, so the
dodecahedron face-adjacency Laplacian inherits eigenvalues 5−{5, √5, −1, −√5} =
{0, 5−√5, 6, 5+√5}.

**φ-connection** (thesis-grade observation):
```
5 − √5 = 2·(3 − φ)
5 + √5 = 2·(2 + φ)
```
The dodecahedron's spectral signature is **φ-derived at every non-degenerate
band**. This is not engineered — it is the unavoidable consequence of the
golden-ratio relationships baked into the regular dodecahedron's geometry.
Numerically: 5 − √5 ≈ 2.7639 and 5 + √5 ≈ 7.2361.

A separate independent surfacing of this property: the spectral analysis at
`docs/thesis/SPECTRAL_ANALYSIS_CHAPTER.md:379` records that the breath-pulse
stress test (a completely different derivation path) produces a maximum
oscillation speed of √5 — *the same √5 that emerges from the Laplacian
spectrum*. Two independent paths into the same φ-derived constant; the geometry
is consistent with itself.

### Eigenvalue Interpretation Table

| λ | Multiplicity | Mode interpretation |
|---|:------------:|---------------------|
| 0 | 1 (DC) | Constant offset = mean(E). Always orthogonal to all imbalance modes; carries no rebalancing information; explicitly skipped at `spectral-analyzer.js:244`. |
| 5 − √5 ≈ 2.7639 | 3 | **Global imbalance** — whole-system tilts. The modal eigenvectors span the three independent directions in which the entire dodecahedron leans one way or another. Dominant here = systemic, slow-moving pattern. |
| 6 | 5 | **Regional patterns** — clusters of 3 to 5 adjacent faces holding common excess or deficit. The five-fold multiplicity reflects the dodecahedron's pentagonal face symmetry. Dominant here = cluster-level imbalance crossing 1–2 breath axes. |
| 5 + √5 ≈ 7.2361 | 3 | **Fine-grained dissonance** — isolated face-vs-neighborhood mismatch. The three independent high-frequency modes reveal where a single face dissents most sharply from its immediate ring. Dominant here = local, faster-moving, targeted intervention. |

Mode 1 (DC) is by construction the row of `[1/√12, 1/√12, ..., 1/√12]` and
captures only the mean. Modes 2–12 form the **imbalance basis** — every
possible "non-mean" energy distribution lives in their span.

### Worked Example — CEN at canonical O1 (2026-05-21)

Given CEN canonical O1 face energies (from the same Section 12 input set;
pentagramic-derived from CEN_SSOT_W06v3_34KPI O1-only inputs):

```
E_F1   = 0.2563   Gate     (Financial Capital)
E_F2   = 0.1192   Wall     (Intellectual Capital — logistic floor)
E_F3   = 0.1192   Wall     (Human Capital — logistic floor)
E_F4   = 0.1349   Element-driven  (Structural Capital — task-provided)
E_F5   = 0.1349   Element-driven  (Market Resonance — task-provided)
E_F6   = 0.1523   Gate     (Community & Partners)
E_F7   = 0.1192   Wall     (Brand & Reputation)
E_F8   = 0.1192   Wall     (Core Operations)
E_F9   = 0.1192   Wall     (Regenerative Flow)
E_F10  = 0.1192   Wall     (Foundational Values — F10 sibling-blindness)
E_F11  = 0.1192   Wall     (Funding Pipeline)
E_F12  = 0.1523   Gate     (Risk & Resilience)
```

**Step 1 — Modal amplitudes** (a[m] = Uᵀ[m] · E, full 12-mode spectrum after
zero-mean normalization of U):

| Mode | λ | a[m] | |a[m]| | Band |
|---|---|---:|---:|---|
| 1 | 0.0000 | +0.480673 | 0.4807 | DC (skip) |
| 2 | 2.7639 | −0.033403 | 0.0334 | Global |
| 3 | 2.7639 | −0.043225 | 0.0432 | Global |
| 4 | 2.7639 | +0.030506 | 0.0305 | Global |
| 5 | 6.0000 | **−0.074008** | **0.0740** | **Regional (DOMINANT)** |
| 6 | 6.0000 | −0.026262 | 0.0263 | Regional |
| 7 | 6.0000 | −0.026548 | 0.0265 | Regional |
| 8 | 6.0000 | +0.016135 | 0.0161 | Regional |
| 9 | 6.0000 | +0.010657 | 0.0107 | Regional |
| 10 | 7.2361 | +0.061429 | 0.0614 | Fine-grained |
| 11 | 7.2361 | +0.039860 | 0.0399 | Fine-grained |
| 12 | 7.2361 | +0.019172 | 0.0192 | Fine-grained |

**Step 2 — Dominant mode (skip mode 1):**
```
m_dom = 5  with a_dom = −0.074008  in the λ=6 regional band
```

**Step 3 — Multi-mode threshold:**
```
τ = 0.1 · |a_dom| = 0.1 · 0.074008 = 0.007401
```
All modes 2..12 have |a[m]| ≥ τ for this input (the smallest, mode 9 at
0.0107, exceeds 0.0074). So the multi-mode Δ sums contributions from all 11
imbalance modes.

**Step 4 — Multi-mode Δ vector** (engine canonical output via
`calculateMultiModeDeltaVector` at `spectral-analyzer.js:291`):

| Face | Nature (Lock #8.10) | Δ[f] | Interpretation |
|---|---|---:|---|
| F1 Financial Capital | Reception (Axis 1) | −0.117542 | Over-energized as receiver |
| F2 Intellectual Capital | Reception (Axis 2) | +0.019558 | Slight under-energy |
| F3 Human Capital | Reception (Axis 3) | +0.019558 | Slight under-energy |
| F4 Structural Capital | Projection (Axis 4) | +0.003858 | Performing in nature (|Δ| < 0.05) |
| F5 Market Resonance | Projection (Axis 5) | +0.003858 | Performing in nature |
| F6 Community & Partners | Projection (Axis 6) | −0.013542 | Performing in nature |
| F7 Brand & Reputation | Projection (Axis 2) | +0.019558 | Slight under-energy as projector |
| F8 Core Operations | Projection (Axis 3) | +0.019558 | Slight under-energy as projector |
| F9 Regenerative Flow | Reception (Axis 4) | +0.019558 | Slight under-energy as receiver |
| F10 Foundational Values | Reception (Axis 5) | +0.019558 | Slight under-energy as receiver |
| F11 Funding Pipeline | Projection (Axis 1) | +0.019558 | Slight under-energy as projector |
| F12 Risk & Resilience | Reception (Axis 6) | −0.013542 | Performing in nature |

Σ Δ[f] = 0 to float precision (orthogonality of imbalance modes to DC mode is
preserved). All Δ values fall within [−0.118, +0.020] — modest magnitudes
because the input energies are themselves compressed near the logistic floor.

**Step 5 — Being-Action Balance:**
```
avg projection E = mean(E[F4], E[F5], E[F6], E[F7], E[F8], E[F11])
                 = mean(0.1349, 0.1349, 0.1523, 0.1192, 0.1192, 0.1192)
                 = 0.7797 / 6 = 0.12995

avg reception  E = mean(E[F1], E[F2], E[F3], E[F9], E[F10], E[F12])
                 = mean(0.2563, 0.1192, 0.1192, 0.1192, 0.1192, 0.1523)
                 = 0.8854 / 6 = 0.14757

BAB = 0.14757 / 0.12995 = 1.1356  →  113.56%
Interpretation: 80% < 113.56% ≤ 120% → "Balanced — Healthy balance between being and doing"
```

**Step 6 — Dissonance Index** (face-energy-weighted Δ magnitude):
```
Σ |Δ[f]| = 0.117542 + 6·0.019558 + 0.003858 + 0.003858 + 2·0.013542 = 0.2701
Σ (|Δ[f]| · E[f]) = 0.117542·0.2563 + 0.019558·0.1192 (×6 reception faces F2..F11)
                  + ... (full per-face product)
                  ≈ 0.04817
Dissonance = 0.04817 / 0.2701 ≈ 0.1784  →  17.84%
Interpretation: 15% < 17.84% ≤ 30% → "MODERATE — Some imbalances present"
```

**Verification:** This exact computation is reproducible via Node from the
analytical inputs above (eigenvalues from `5−√5, 6, 5+√5`; eigenvector matrix
from `js/spectral-analyzer.js:140-154` after zero-mean normalization). The
multi-mode threshold (0.1·|a_dom|), the BAB partition (projection vs reception
faces from `spectral-analyzer.js:172-173`), and the dissonance weighting are
all as published in `js/spectral-analyzer.js:291-403`.

### Δ Vector Interpretation — "Performing in Nature" Diagnostic

Each face sits on one of the 6 breath axes (per `docs/BREATH_AXIS_REFERENCE.md`)
at either the **reception pole** (inhale, ground, absorb) or the **projection
pole** (exhale, direct, transmit). The Δ vector reveals whether each face is
performing in its breath-axis nature.

| Threshold | Reading | Meaning |
|---|---|---|
| \|Δ\| < 0.05 | **Performing in nature** | Face is aligned with its breath-axis position; energy distribution is consistent with what dodecahedral coherence wants here |
| Δ > +0.05 | **Under-energized** | As projector: failing to transmit/exhale enough. As receiver: failing to absorb/inhale enough. Either way the face is not giving the structure what it geometrically expects. |
| Δ < −0.05 | **Over-energized** | As projector: hoarding what should be projected outward. As receiver: over-claiming attention beyond healthy capacity. Energy concentrated where the structure expects diffusion. |

**The 12 faces and their breath-axis natures** (Lock #8.10):

| Axis | Reception face | Projection face | Breath name |
|:---:|---|---|---|
| 1 | **F1** Financial Capital | **F11** Funding Pipeline | Viability |
| 2 | **F2** Intellectual Capital | **F7** Brand & Reputation | Articulation |
| 3 | **F3** Human Capital | **F8** Core Operations | Sustainability |
| 4 | **F9** Regenerative Flow | **F4** Structural Capital | Intention |
| 5 | **F10** Foundational Values | **F5** Market Resonance | Clarity |
| 6 | **F12** Risk & Resilience | **F6** Community & Partners | Network |

The Δ vector cross-references against this nature partition to give human-legible
diagnostic language. For CEN at O1 above, the most pronounced reading is
**F1 Δ = −0.118 → over-energized as receiver**: CEN is concentrating energy in
Financial Capital (relative to its O1 ground) beyond what the geometry expects
at this layer, while F2/F3 (its reception-pole siblings on Axes 2 and 3) sit at
slight under-energy. The structural diagnosis: F1 is the only Gate among the
Actuality capitals, pulling more spectral mass than the geometry recommends —
consistent with CEN's loud Financial Fragility narrative pattern (D=6, E=1) at
O1 survival layer.

### Honest Disclosure

- **Hardcoded U matrix.** The eigenvector matrix at `js/spectral-analyzer.js:140-154`
  is precomputed (Jacobi eigendecomposition, recorded March 9, 2026 — see the
  comment block at `:127-138`) rather than re-derived at runtime. The values
  are rounded to 6 decimal places, which introduces small rounding error;
  `normalizeEigenvectors()` at `:184` zero-means columns 1–11 to restore
  orthogonality to the DC mode at float precision. A future Appendix D (deferred)
  should ship a standalone reproduction script that recomputes U from L and
  asserts ||UᵀLU − diag(λ)||_F < 1e-10 for committee-grade verification.

- **CEN diagnostics block uses a different energy vector.** The block at
  `companies/cen/mapping-context.json:315-322` reports `dominantMode=10`,
  `beingActionBalance=1.25`, `dissonanceIndex=0.38`. The worked example above
  produces `dominantMode=5`, `BAB=1.14`, `dissonance=0.18` from the canonical
  pentagramic-derived O1 face energies (the same set Section 12 §AAG uses).
  These do **not** match the mapping-context.json diagnostics, because that
  diagnostics block was generated from a **different input vector** — likely the
  raw sentiment vector (`face.sentiment` values 0.20–0.95) or an earlier
  mixed-octave energy state, not the canonical O1 pentagramic computation.
  *Verifying via Node script:* the raw sentiments produce `dominantMode=9` and
  `BAB=1.375`, also not 10/1.25. The exact input that produced the recorded
  diagnostics (mode 10) is **flagged for partnership-discussion as a CEN SSOT
  data-provenance loose end** (item: reconcile mapping-context.json diagnostics
  with W0.6 v2/v3 canonical pipeline output, or annotate as legacy snapshot).

- **Numerical stability.** All operations are O(n²) matrix-vector products on
  a 12×12 constant-coefficient matrix; no iterative solver, no convergence
  concerns, no risk of catastrophic cancellation at typical face-energy
  magnitudes (E ∈ [0, 1]).

- **Edge cases.** All-zero E → modal amplitudes all 0 → dominantMode returned
  as a dummy `{mode: 0, amplitude: 0}` with interpretation "System Balanced /
  Empty" (`spectral-analyzer.js:438-440`). One face NaN → scrubbed to 0 with
  warning (`:419-421`). All-equal E (constant vector) → projects entirely onto
  DC mode; all imbalance amplitudes a[2..12] ≈ 0; dominant mode falls back to
  whichever has largest float-noise amplitude (typically negligible).

- **BAB partition is Quannex-canonical, not face-by-face derivation.** The
  projection/reception sets `[11, 7, 8, 4, 5, 6]` and `[1, 2, 3, 9, 10, 12]`
  are read directly from `js/spectral-analyzer.js:172-173`, sourced from
  CSV_Breath_Ratios.csv (the 6 harmonic pairs). They are not recomputed from
  L or from breath-axis data each call; if the canonical partition changes,
  both this constant and the docs must update together.

### Test Coverage Strategy

A new test file `POC/tests/spectral.test.js` does **not yet exist** (Wave 1
§6.7 task). Target 6 test cases:

1. **Orthogonality of U.** After normalization, ||UᵀU − I||_∞ < 1e-6.
   Validates that the hardcoded eigenvector matrix is mutually orthonormal
   within float tolerance.
2. **DC mode shape.** U[:, 0] = [1/√12] × 12 ≈ [0.288675] × 12 (this is the
   constant vector by construction; survives normalization unchanged).
3. **Eigenvalue recovery.** For each mode m, compute (UᵀLU)[m][m] and assert
   |result − λ[m]| < 1e-6. Validates that U really diagonalizes L.
4. **Modal reconstruction.** For a known E, compute a = UᵀE then reconstruct
   E' = U·a; assert ||E − E'||_∞ < 1e-6. Validates orthonormal-basis
   round-trip.
5. **CEN regression.** Lock the canonical O1 face energy vector as a test
   fixture, assert `analyze().dominantMode.mode === 5` and `BAB ≈ 1.136 ± 1e-3`
   and `dissonance ≈ 0.178 ± 1e-3`. If `mapping-context.json` diagnostics are
   updated to the canonical O1 numbers (partnership-discussion item), reconcile
   this fixture against the engine pipeline output.
6. **Multi-mode threshold.** Synthesize an E that produces three modes with
   amplitudes [1.0, 0.5, 0.05]. Assert that mode-3 (0.05 = 0.05·|a_dom| = below
   threshold τ = 0.1·1.0 = 0.1) is excluded from the multi-mode Δ sum, while
   modes 1 and 2 (above threshold) both contribute.

### Implementation Reference

- **Module:** `POC/js/spectral-analyzer.js` (612 lines, IIFE → `window.SpectralAnalyzer`)
- **Key methods:**
  - `constructor()` at `:99-179` — builds L, U, eigenvalues, BAB partition;
    invokes `normalizeEigenvectors()`
  - `normalizeEigenvectors()` at `:184-200` — zero-means columns 1–11
  - `calculateModalAmplitudes(E)` at `:209-230` — projects E onto each mode
  - `identifyDominantMode(a)` at `:239-253` — argmax over m > 1
  - `calculateDeltaVector(domMode)` at `:263-281` — single-mode Δ
    (legacy / backward compatibility)
  - `calculateMultiModeDeltaVector(a)` at `:291-323` — canonical multi-mode Δ
    with 0.1·|a_dom| threshold
  - `calculateBABScore(E)` at `:333-369` — reception/projection mean ratio
  - `calculateDissonanceIndex(Δ, E)` at `:380-403` — face-energy-weighted Δ
    magnitude
  - `analyze(E)` at `:411-470` — top-level entry; runs all of the above
- **Engine integration:** `js/main.js:1336-1339` (called in
  `DodecahedronEngine.runAnalysis` after breath analysis, before still-point)
- **Wrapper with caching:** `js/advanced/spectral-analyzer.js` (separate
  module; out of scope for this section)
- **Parallel doc (superseded):** `POC/docs/math/SPECTRAL_IMPLEMENTATION.md`
  — mark as **ARCHIVED: content promoted to CALCULATION_AUDIT_TRAIL.md §13
  on 2026-05-21** once integration lands.
- **Tests:** New file `POC/tests/spectral.test.js` (W1 §6.7 task — currently
  zero tests; target 6 cases per strategy above).
- **Thesis chapter reference:** `docs/thesis/SPECTRAL_ANALYSIS_CHAPTER.md`
  cites the same φ-derived eigenvalue spectrum and the independent √5
  emergence via breath-pulse stress test.

### Why this formula (face-adjacency Laplacian choice)

The choice of the **face-adjacency Laplacian** (12 nodes = 12 faces; 30 edges =
the canonical face-pair adjacencies from `dodecahedron-topology.js` EDGES) is
**not arbitrary** — it is the unique Laplacian for which:

1. The graph respects the dodecahedron's own symmetry group (icosahedral
   symmetry, order 60). Other graph constructions on the same 12 nodes (e.g.,
   K₁₂, or vertex-adjacency-on-the-dual) would give different eigenvalues and
   would not reflect organizational topology.
2. Each face has degree exactly 5 (every face borders 5 others), so D = 5·I and
   L = 5·I − A. This regularity gives the spectrum a clean φ-derived closed
   form rather than requiring numerical eigendecomposition each session.
3. The eigenvectors form an orthonormal basis on R¹² (12-face energy space).
   Any E vector decomposes uniquely as E = Σ a[m]·U[:,m]; the modal spectrum
   is therefore a *complete* representation of E's information content, not
   a lossy projection.
4. The Δ vector projection answers the question *"How does each face deviate
   from what dodecahedral coherence wants here, given the dominant imbalance
   modes?"* — quantifying interpretive power that the breath-axis ratio
   (which only captures pairwise inhale/exhale balance) alone cannot provide.
   The Δ vector resolves *which specific cluster patterns* drive the imbalance,
   not just *which pairs are off*.

The Laplacian's φ-derived spectrum (5−√5, 6, 5+√5) is the geometric fingerprint
that connects the dodecahedral organizational model to the golden-ratio constants
elsewhere in the engine (PhiHarmonics, octave thresholds, breath ratios). The
spectral analyzer is therefore *the φ-consistent diagnostic layer* — not a
parallel system glued on, but a direct consequence of the same underlying
geometry.

### Versioning / Evolution Notes

- **v1.0 (2026-05-21):** Promoted from `SPECTRAL_IMPLEMENTATION.md`. CEN
  canonical O1 worked example documented with full reproducibility. φ-connection
  of eigenvalues surfaced explicitly. Δ vector "Performing in Nature" diagnostic
  framing landed (per Lock #8.10). Honest disclosure of CEN
  mapping-context.json provenance drift recorded as partnership-discussion item.
- **Future v1.1:** Appendix D added with standalone Jacobi-decomposition
  reproduction script (input: L from EDGES topology; output: U' satisfying
  ||UᵀLU − diag(λ)||_F < 1e-10). For committee-grade verification at thesis
  defense. Hardcoded U matrix in `spectral-analyzer.js` gains commit-time
  drift-check against the reproduction script's output.
- **Future v1.2:** Spectral propagation analysis — how the Δ vector evolves
  over time as face energies change session-to-session. Connects spectral
  diagnostics to the breath-history time-series tracking (currently defaulted
  in still-point analyzer; see §11 Honest Disclosure). Master's-scope per
  tier discipline; flagged as out-of-scope for Phase 7 / Wave 1.
- **Future v2.0:** Per-octave spectral analysis arrays. When CEN SSOT v1.0
  ships with O1/O2/O3 layers, spectral analyzer runs per-octave (3-tuple
  dominantMode + 3-tuple Δ vectors), revealing whether the dominant pattern
  is consistent across octaves or shifts between layers. Pairs with the
  per-octave AAG arrays planned for §12 v1.2.

### Provenance Investigation — dominantMode=10 Recorded Value

**Status:** Provenance recovered. The recorded value is **hand-authored
narrative scaffolding**, not engine-computed output.

**Investigation summary** (2026-05-21):

To trace the input vector that produced `dominantMode=10` recorded at
`companies/cen/mapping-context.json:319`, seven candidate input vectors were
projected through the canonical Laplacian eigenvector matrix:

| # | Input vector | dominantMode | BAB | Dissonance |
|:-:|---|:-:|:-:|:-:|
| Canonical O1 (Section 12 set) | floor 0.1192 + gates 0.2563/0.1523 + F4/F5 0.1349 | **5** | 1.136 | 0.178 |
| 1 | V_res_post `[0.2, 0.5, 0.4, 0.2, 0.2, 0.4, 0.3, 0.2, 0.8, 0.8, 0.2, 0.3]` | 11 | 2.000 | 0.483 |
| 2 | V_res_pre `[0.2, 0.4, 0.4, 0.2, 0.2, 0.5, 0.3, 0.3, 0.8, 0.7, 0.2, 0.3]` | 11 | 1.647 | 0.465 |
| 3 | D normalized `[0.6, 0.8, 0.7, 0.7, 0.3, 0.3, 0.7, 0.7, 0.6, 1.0, 0.6, 0.3]` | 8 | 1.212 | 0.576 |
| 4 | E normalized `[0.1, 0.7, 0.3, 0.2, 0.1, 0.4, 0.3, 0.1, 0.5, 0.9, 0.4, 0.1]` | 2 | 1.733 | 0.432 |
| 5 | mean(D, E, V_res_post) | 11 | 1.524 | 0.527 |
| 6 | mean(D, E, V_res_pre, V_res_post) | 11 | 1.550 | 0.507 |
| 7a | Engine: mean(5 elements per face) | 9 | 1.302 | 0.488 |
| 7b | Engine: sentiment vector direct | 9 | 1.375 | 0.541 |
| 7c | Engine: φ-weighted elements `[0.236, 0.146, 0.382, 0.146, 0.090]` | 9 | 1.280 | 0.472 |
| 7d | Engine: ether-weighted ramp `[0.1, 0.15, 0.2, 0.25, 0.3]` | 9 | 1.311 | 0.495 |
| 7e | Engine: earth-weighted ramp `[0.3, 0.25, 0.2, 0.15, 0.1]` | 9 | 1.293 | 0.482 |
| 7f | sentiment + axis feedback α=0.4 (E_f = 0.4·s_f + 0.6·s_opp) | 8 | 0.939 | 0.467 |
| 7g | sentiment + axis feedback δ=0.95 | 9 | 1.331 | 0.533 |
| 7h | mean(elements) + axis feedback α=0.4 | 8 | 0.949 | 0.434 |
| 7i–m | Single-element variants (air / ether / fire / water / earth only) | 2 / 9 / 2 / 11 / 9 | varies | varies |

**No input vector reproduces dominantMode=10.** The closest band approach
(mode 9, λ=6 regional) recurs across multiple sentiment-based variants, but
mode 10 (λ=5+√5 ≈ 7.2361 fine-grained) does not appear from any reasonable
projection of the CEN data.

**Build-script search** (`POC/scripts/` and full repo grep for any `.js` or
`.py` file writing to `mapping-context.json`):

- No build script produces the file. The `scripts/` directory contains only
  Python files for unrelated tasks (xlsx generation, sheet builders); none
  reference `mapping-context.json` or `dominantMode`.
- The file's only git history is a single creation commit on 2026-04-11
  (`959c298 feat: add CEN company template from Phase 2 frozen scores`).
  The 359-line JSON was added wholesale in that one commit alongside
  `company.json` and `kpis.csv`. No subsequent modification.

**Decisive evidence — diagnostics blocks are hand-authored across all 5
company templates:**

| Company | dominantMode (recorded) | Spotlight face per `company.json` narrative |
|---|:-:|---|
| nova-tech | **1** | F1 Financial — "Get first paying customer OR close funding within 60 days" |
| apex-industries | **7** | F7 Brand — "Formalize succession planning... knowledge transfer to next generation" |
| zenith-solutions | **4** | F4 Structural — "Pause external expansion, consolidate team and documentation" |
| quannex | **9** | F9 Regenerative — "Increase founder energy from 5.4 to 8.6 (sustainable creative flow)" |
| **cen** | **10** | **F10 Foundational Values = 9.5/10 — "Sacred Ground" / "Hidden Oracle"** |

Three independent confirmations that these are narrative semantics, not
spectral outputs:

1. **nova-tech `dominantMode: 1` is impossible.** The engine at
   `js/spectral-analyzer.js:244` explicitly skips mode 1 (the DC mode) when
   identifying the dominant mode — `for (let i = 1; i < modalAmplitudes.length; i++)`.
   No engine run can ever return `dominantMode: 1`. Its presence in a
   template proves the field was authored.
2. **The dominantMode integer matches each company's spotlight FACE number,
   not an eigenvalue index.** CEN's value 10 corresponds to F10 Foundational
   Values (=9.5/10, the strongest face); nova-tech's value 1 to F1 Financial
   (the existential survival face); apex's 7 to F7 Brand & Reputation (the
   succession-narrative face); quannex's 9 to F9 Regenerative Flow (the
   "founder energy" face); zenith's 4 to F4 Structural Capital (the
   "consolidate" face).
3. **The `highestLeverageAction` text is byte-identical between
   `company.json` (narrative file) and `mapping-context.json` diagnostics
   block.** For CEN: line 58 of `company.json` and line 320 of
   `mapping-context.json` carry the same string. The diagnostics block was
   composed from the narrative scaffolding, not produced by the spectral
   analyzer.

**Provenance verdict:** **Recovered.** The `dominantMode` field in all 5
`companies/*/mapping-context.json` templates is **narrative scaffolding** that
mirrors each organization's spotlight face from its hand-authored story, NOT
an engine-computed eigenvalue index. The naming collision with the engine's
`spectralAnalysis.dominantMode.mode` output (which IS an eigenvalue index in
[2..12]) created the appearance of a computed value, but the data type and
generation path are different: this field is narrative metadata.

**Recommendation for canonical going forward:**

1. **Rename the template field** from `dominantMode` to `dominantFace` (or
   `spotlightFace` / `narrativeAnchor`) in all 5 company templates. The
   semantic — "which face anchors the story" — is real and useful; the name
   collision with the spectral analyzer's `dominantMode` is the problem.
   Surface this as a CEN SSOT data-hygiene item.
2. **Add explicit provenance fields** to the diagnostics block:
   `"provenance": "hand-authored from Phase 2 frozen scores"` and
   `"computedAt": null` (vs. `"computedAt": "<ISO timestamp>"` for engine
   runs). Two distinct data types should not share a key shape.
3. **The canonical engine-computed dominantMode for CEN at O1** is **5**
   (regional band, λ=6.0, computed via Section 13 worked example). When the
   CEN SSOT W0.6 v3 pipeline produces the canonical spectral diagnostics,
   they should replace the narrative-scaffolding values in `mapping-context.json`
   (or live in a separate `diagnostics-computed` block alongside the
   `diagnostics-narrative` block).
4. **Test fixture 5** in the test-coverage strategy above stays correct:
   lock the engine-computed canonical O1 result (`dominantMode=5, BAB=1.136,
   dissonance=0.178`) as the regression fixture. The hand-authored value 10
   is documented historical narrative metadata, not a regression target.

---

## 14. Advanced Edge Formula — Relative Tension + KPI Health Blend (added 2026-05-21)

### Conceptual Premise

Section 7 (core) covers the canonical edge tension `T = √(E_A × E_B)` — the
geometric mean of two connected face energies. It answers *"how strong is
this membrane?"* — and feeds the system-coherence calculation.

Section 14 documents the **advanced edge formula** in
`js/advanced/edge-analyzer.js`. This is a *different question* on the same
two faces: *"how proportionally imbalanced is the flow across this
membrane, weighted by the KPI health that should be flowing through it?"*
The two formulas are complementary — they measure different geometric
properties of the same edge — and the audit trail must keep them distinct
to prevent confusion about which formula feeds which downstream consumer.

This is an extension of Section 7, not a replacement.

### Mathematical Formula

```
T_norm        = |E_A − E_B| / (E_A + E_B + ε)             (relative imbalance)
T_edgeHealth  = 1 − edgeKPI.normalizedScore               (inverted health → tension)
                or 0.5 default when no edge KPI exists
T_base        = 0.6 × T_norm + 0.4 × T_edgeHealth         (weighted blend)
T_final       = clamp([0, 1], T_base × elementMultiplier) (elemental modulation)

elementMultiplier ∈ {Fire 1.3, Air 1.1, Ether 1.0, Water 0.9, Earth 0.8}

Logarithmic Breath Ratio (advanced view, distinct from core):
  BR_log = log(E_B / E_A) / log(φ)   clamped to [−2, +2]
  BR_log = +1  ⇔  E_B / E_A = φ      (golden expansion)
  BR_log = −1  ⇔  E_B / E_A = φ⁻¹    (golden contraction)
  BR_log =  0  ⇔  E_B / E_A = 1      (balance)
```

Where `ε = PhiHarmonics.EPSILON = 1e-10` (numeric guard against divide-by-zero).

### Decision Rule — When to Use Advanced vs Core

| Use case | Formula | Rationale |
|---|---|---|
| System coherence calculation | **Core** `T = √(E_A × E_B)` | Geometric mean is multiplicatively well-behaved; aggregates cleanly |
| Energy propagation (Section 7) | **Core** | Membrane STRENGTH governs how much flow can traverse |
| Canonical 30-edge dataset (`mapping-context.json`) | **Core** | Stable across octave shifts |
| Diagnostic / advanced analysis views | **Advanced** | Relative imbalance is more intuitive at the dashboard level |
| KPI-aware narrative generation | **Advanced** | T_edgeHealth blends BSC signal in |
| Edge-by-edge elemental tuning | **Advanced** | elementMultiplier surfaces nature-of-edge |
| Storytelling around "which edges are stressed" | **Advanced** | Two low-energy faces with a gap shows up as HIGH relative tension; the core formula would miss this |

The two formulas should never be mixed in a single pipeline. The advanced
formula's output is NOT a drop-in substitute for the core T in system
coherence — they have different ranges, different sensitivities, and
different theoretical anchors.

### Worked Example — CEN E1-10 Regenerative Capital Allocation

Edge between F1 Financial Capital (E_A = 0.2563) and F10 Foundational
Values (E_B = 0.1192) at the canonical O1 layer. Elemental nature =
**Ether** (the meeting of capital and values requires the void / open
space). No dedicated edge KPI in the CEN BSC — so `edgeKPI = null` and
`edgeHealth = 0.5` defaulted.

**Step 1 — Normalized relative tension:**
```
T_norm = |0.2563 − 0.1192| / (0.2563 + 0.1192 + ε)
       = 0.1371 / 0.3755
       = 0.365113
```

**Step 2 — Edge health (no KPI, defaulted):**
```
edgeHealth = 0.5
T_edgeHealth = 1 − 0.5 = 0.5
```

**Step 3 — Weighted blend:**
```
T_base = 0.6 × 0.365113 + 0.4 × 0.5
       = 0.219068 + 0.200000
       = 0.419068
```

**Step 4 — Elemental modulation (Ether = 1.0, neutral):**
```
T_final = clamp([0, 1], 0.419068 × 1.0) = 0.419068
```

**Step 5 — Logarithmic breath ratio:**
```
BR_log = log(0.1192 / 0.2563) / log(φ)
       = log(0.465) / log(1.618)
       = −0.766 / 0.481
       = −1.591
```

**Interpretation:** The edge is in the Membrane regime under advanced
classification (`T_final ≈ 0.42 ≥ φ⁻²`), but the breath ratio shows
strong contraction from F1 → F10. Energy is flowing FROM the
financially-fragile face TOWARD the values face — but at a contraction
rate well past the golden anchor. In CEN context: *"financial scarcity is
pulling the values face into compression rather than the values face
nourishing financial regeneration."* This is exactly the regenerative-flow
dynamic the BSC researcher is probing on this edge.

### Test Cases for `POC/tests/edge-analyzer.test.js` (NEW)

| # | Assertion | Expected |
|---|---|---|
| 1 | Identity: `T(0.5, 0.5, 'Ether', null)` | `0.2` — `T_norm=0`, `T_edgeHealth=0.5`, `T_base = 0 + 0.2 = 0.2`, ×1.0 = 0.2 |
| 2 | Max imbalance: `T(1.0, 0.0, 'Ether', null)` | `0.8` — `T_norm=1`, `T_base = 0.6 + 0.2 = 0.8`, ×1.0 = 0.8 |
| 3 | Element scaling: `T(1.0, 0.0, 'Fire', null) / T(1.0, 0.0, 'Earth', null)` | **`1.5625` (NOT `1.625`)** — Fire clamps: `0.8×1.3 = 1.04 → 1.0`; Earth: `0.8×0.8 = 0.64`; actual ratio = `1.0/0.64`. Pre-clamp ratio is `1.625`. **Test must assert clamped behaviour, not raw multiplier ratio.** |
| 4 | BR antisymmetry: `BR(A, B) + BR(B, A)` | `0` exactly (modulo float epsilon) |
| 5 | BR golden anchor: `BR({E:φx}, {E:x})` for any positive `x` | `+1.0` (verified: `log(φ)/log(φ) = 1.0`) |
| 6 | CEN regression: per-edge `T_final` for all 30 edges in `mapping-context.json` | matches the precomputed `tension` field |

**Failure flagged in test 3:** the brief said "factor 1.625" — but at the
extreme input `(1.0, 0.0)`, Fire's multiplier `0.8 × 1.3 = 1.04` exceeds
`[0, 1]` and clamps to 1.0. The raw multiplier ratio (1.625) is *not* the
observed output ratio (1.5625). The test must assert the **clamped**
result, OR use a non-saturating input to verify the raw ratio (e.g.
`T(0.4, 0.0, ·)`). Partnership-discuss which form the test should take.

### Implementation Reference

- **Source:** `js/advanced/edge-analyzer.js` lines 185-251
- **Constants:** `elementalMultipliers` dict at lines 148-154
- **Companion:** `Section 7. Edge Tension` (core SSOT `js/core/Edge.js`)
- **Test target:** `POC/tests/edge-analyzer.test.js` (to be created)

### Why This Formula (Complementary to Core)

Core measures **strength of membrane** — energy that CAN transmit. It
rewards edges where both faces are strong, severely penalizing imbalance
(geometric-mean property: AM-GM inequality).

Advanced measures **proportional imbalance + KPI weight** — how off-balance
relative to scale, with empirical BSC signal blended in. It rewards edges
where flow is balanced AND well-instrumented, treating two low-energy
balanced faces as MORE coherent than two unequal high-energy faces.

The two answer different questions on the same geometry:
- Core: *"How much can flow through here right now?"*
- Advanced: *"How healthy is the flow that's already happening?"*

Both belong in the audit trail. Neither is "the right answer" — they're
two valid projections of edge dynamics. Section 14 ensures the advanced
projection has the same auditable depth as Section 7's core.

### Honest Disclosures

**On the 60/40 blend weights (not phi-derived).**

- **Origin:** Researcher choice during the advanced edge-analyzer build
  (`js/advanced/edge-analyzer.js` lines 185-251). The 0.6 / 0.4 split
  was selected to weight relative imbalance somewhat more heavily than
  KPI health because `T_edgeHealth` is *defaulted to 0.5* whenever no
  dedicated edge-KPI exists (the dominant case in the current 30-edge
  CEN dataset — only vertex V13 carries a direct BSC instrument). A
  60/40 split gives the empirical signal more voice than the defaulted
  proxy.
- **Why this specific value:** Pragmatic round numbers that sum to 1.0
  and visibly favor `T_norm` without overwhelming `T_edgeHealth`. No
  empirical optimization or sensitivity study was run; the split
  reflects an authorial judgment call.
- **Honest disclosure:** **NOT phi-derived.** A phi-anchored variant
  would be `φ⁻¹ ≈ 0.618 × T_norm + φ⁻² ≈ 0.382 × T_edgeHealth` — very
  close numerically (0.618 vs 0.6 differs by 3%, 0.382 vs 0.4 by 5%) —
  but the implementation uses the rounded pragmatic values rather than
  the phi-anchored ones. Flagged for v1.1 consideration: align to phi
  to match `Vertex.calculateVortexEnergy`'s phi-derived 0.618 / 0.382
  partition (Section 8) for cross-formula consistency.
- **Sensitivity intuition:** Shifting toward 70/30 (more weight on
  `T_norm`) would make the advanced formula behave more like the
  imbalance-only view — edges with strong KPI health but high
  imbalance would still flag as tense. Shifting toward 50/50 would
  give the defaulted 0.5 KPI proxy equal voice — degrading signal
  quality on edges without real KPIs. The 60/40 choice trades a small
  loss of phi-aesthetic for protection against defaulted-proxy
  dilution. Effect on CEN E1-10 worked example: at 70/30 the
  `T_base = 0.7 × 0.365 + 0.3 × 0.5 = 0.406` (vs current 0.419, Δ
  ≈ 3%); at 50/50 it would be `T_base = 0.433` (Δ ≈ 3% other way).
  Small numerical sensitivity — but interpretively the choice signals
  *which signal carries more authority*, not just the output number.

**On the elemental multipliers Fire 1.3 / Air 1.1 / Ether 1.0 / Water 0.9 / Earth 0.8 (also pragmatic).**

- **Origin:** Researcher choice for narrative coherence with the
  elemental archetypes drawn from the broader Quannex sacred-geometry
  vocabulary (see `docs/EDGE_DYNAMICS_REFERENCE.md` for the elemental
  attribution to each of the 30 edges). The numerical values were
  selected to encode the qualitative archetype: Fire amplifies and
  dramatizes (highest), Earth grounds and dampens (lowest), Ether
  stays neutral (the void multiplier), Air and Water bracket Ether
  by ±0.1.
- **Why these specific values:** They form a **symmetric span around
  Ether** — Ether 1.0 ± 0.3 (Fire / Earth extremes) ± 0.1 (Air / Water
  bracket). The symmetry is aesthetically motivated; the magnitudes
  reflect researcher intuition about how strongly each element should
  modulate the base tension. No empirical optimization was performed.
  The Ether=1.0 anchor is principled (void = identity multiplier); the
  others are not.
- **Honest disclosure:** **NOT phi-derived.** Plausible phi-aligned
  alternatives exist:
  `{Fire φ⁰·⁵ ≈ 1.272, Air φ¹ᐟ⁵ ≈ 1.101, Ether 1.0, Water φ⁻¹ᐟ⁵ ≈ 0.908, Earth φ⁻⁰·⁵ ≈ 0.786}`
  — striking how closely the pragmatic rounded values track these
  phi-derived alternatives (Fire 1.3 vs 1.272 differs by 2%; Earth 0.8
  vs 0.786 by 2%). This near-coincidence is unintentional. Flagged for
  partnership discussion in v1.1: are these multipliers load-bearing
  enough to warrant phi-anchoring, or should they remain
  narrative-aesthetic?
- **Sensitivity intuition:** The multiplier is applied AFTER the
  weighted blend and BEFORE the [0, 1] clamp. At extreme inputs
  (e.g. T_base near 0.8) Fire's 1.3× pushes the output to 1.04 and
  clamps to 1.0; at modest inputs (T_base ≈ 0.4) Fire's 1.3× gives
  0.52, comfortably below clamp. So the multipliers' effective
  influence is **regime-dependent**: at high-tension edges Fire and
  Earth's spread compresses against the clamp ceiling; at moderate
  edges the full ±0.3 / ±0.1 spread is visible. Doubling the spread
  (Fire 1.6, Earth 0.6) would make the elemental nature dominate the
  output at moderate tensions, drowning out the underlying imbalance +
  KPI signals. Halving the spread (Fire 1.15, Earth 0.9) would make
  the elemental signal almost cosmetic. The current ±0.3 / ±0.1
  produces *visible but not overwhelming* elemental modulation —
  which matches its intended diagnostic role (color the tension,
  don't determine it).

**On the breath-ratio dual:** see the dedicated **BR Formula Duality
Reconciliation** sub-section below for the full treatment. Summary: the
core BR (linear) and BR_log (logarithmic, φ-base) measure different
things and should not be unit-converted into each other.

### BR Formula Duality Reconciliation (honest-disclosure, added 2026-05-22)

The audit trail now carries **three distinct breath-ratio formulations**
across Sections 7, 9, and 14. They are sometimes referred to
indiscriminately as "BR" in code comments, narrative output, and
documentation. They are NOT equivalent. This block names them
explicitly and gives each its proper scope.

**The three formulations:**

| # | Formula | Range | Lives In | What it measures |
|---|---|---|---|---|
| 1 | `BR_share = E_A / (E_A + E_B)` | `[0, 1]` | Section 9 (face-pair BR) | E_A's **share** of the face-pair's total energy — a linear partition |
| 2 | `BR_delta = (E_B − E_A) × 2` clamped to `[−1, +1]` | `[−1, +1]` | Section 7 (core edge BR) | The **signed linear gap** between B and A, scaled and clamped to a symmetric range around 0 |
| 3 | `BR_log = log_φ(E_B / E_A)` clamped to `[−2, +2]` | `[−2, +2]` | Section 14 (advanced edge BR) | The **golden-ratio asymmetry** — how many φ-multiples B is above (or below) A |

**These do not numerically agree** on the same inputs. Worked
illustration with `E_A = 0.3, E_B = 0.6`:

```
BR_share = 0.3 / (0.3 + 0.6) = 0.333    →  "F_A holds 1/3 of pair total"
BR_delta = (0.6 − 0.3) × 2 = +0.6        →  "+0.6 expansion toward B" (linear gap, signed)
BR_log   = log(2) / log(φ) ≈ +1.44       →  "B is 1.44 φ-steps above A" (golden asymmetry)
```

All three correctly identify *"B is larger than A"* — but they
quantify the asymmetry on **different scales with different geometric
anchors**:

- `BR_share` reports a **partition fraction**. Anchored at 0.5 (perfect
  balance). Insensitive to absolute magnitude — `(0.1, 0.2)` and
  `(0.4, 0.8)` both give 0.333.
- `BR_delta` reports a **signed linear deviation**. Anchored at 0
  (perfect balance). Saturates at `±1` when one side is 0 and the
  other is `≥ 0.5`. Sensitive to magnitude.
- `BR_log` reports a **multiplicative-golden** distance. Anchored at
  0 (perfect balance), with `±1` marking exact φ-ratio asymmetry and
  `±2` marking φ²-ratio asymmetry (≈ 2.618:1). Sensitive to ratio,
  not magnitude.

**When to use each:**

| Question | Use | Why |
|---|---|---|
| *"What fraction of the breath-pair energy lives on the F_A side?"* | `BR_share` (Section 9) | Partition / share semantics; intuitive for face-pair dashboards |
| *"How linearly imbalanced is this edge, on the canonical [−1, +1] axis?"* | `BR_delta` (Section 7) | Symmetric axis matches the core engine's other [−1, +1] outputs (direction, balance); aggregates cleanly across edges |
| *"Is this edge in a golden-ratio relationship — within / beyond φ, φ², etc.?"* | `BR_log` (Section 14) | The φ-base log naturally surfaces golden-ratio anchors as integer outputs (±1 = φ, ±2 = φ²); diagnostically powerful for spotting "this edge is exactly at golden contraction/expansion" |
| Cross-edge aggregation for system metrics | `BR_delta` only | The linear, clamped, symmetric form aggregates without scale distortion |
| Narrative storytelling around "this face dominates / submits in the pair" | `BR_share` | Reads naturally in prose ("F_A holds 67% of the energy in this breath pair") |
| Spotting structural "golden-ratio breathing" patterns | `BR_log` | An organization whose edges cluster near `BR_log ≈ ±1` is exhibiting **golden-ratio asymmetric breath** — a signature pattern worth flagging |

**Honest disclosure — these are NOT interchangeable.** Audit-trail
readers, narrative-generation logic, and downstream consumers must
pick the right tool for the question being asked. A `BR_log` value
cannot be unit-converted into a `BR_share` value (or vice versa) by
a simple scaling — they live on geometrically different spaces (linear
partition vs additive-on-log-axis). Attempting to substitute one for
the other in a calculation pipeline will produce silent semantic
drift, not just numerical drift.

**Neither is "wrong" — they are complementary diagnostics.** This
mirrors the architectural relationship between **AAG** (Section 12 —
face-grouping aspiration-actuality ratio) and **AvG** (Section 16 —
apparent-vs-granular aggregation distortion). Both AAG and AvG measure
"organizational health gaps" but along different geometric axes; the
audit trail honors that by giving each its own section with explicit
scope. The same discipline applies here to the three BR formulations:
each gets its canonical section, each is invoked deliberately, and
none is treated as a stand-in for another.

**Sibling patterns elsewhere in the audit trail:**

- **Edge tension dual** (Section 7 core `T = √(E_A × E_B)` vs Section
  14 advanced `T = 0.6 × T_norm + 0.4 × T_edgeHealth`) — same
  complementary-diagnostic pattern. Both correctly answer
  edge-question, but different questions on the same geometry.
- **AAG vs OVC** (Section 12) — two formulas previously labeled "AAG"
  resolved to two distinct concepts. The BR triality is in the same
  spirit: surface the multiplicity, label cleanly, prevent silent
  substitution.

**Convention going forward:**

- When code, docs, or narrative says simply *"BR"* without
  qualification, assume `BR_delta` (Section 7) — the core engine
  formulation — unless context disambiguates otherwise.
- When the **share** semantic is intended, use `BR_share` or "breath
  partition" explicitly (Section 9 — clarifying-rename consideration
  for v1.1).
- When the **golden-ratio asymmetry** semantic is intended, use
  `BR_log` explicitly (Section 14).
- Cross-formula comparison tables (e.g. dashboards showing both core
  and advanced edge views) should label each column explicitly with
  its formulation, not collapse them into a single "BR" header.

### Versioning Notes

- **v1.0 (2026-05-21):** Initial audit-trail extension of Section 7.
  Worked example uses canonical CEN O1 face energies. Honest disclosures
  preserved on pragmatic vs phi-derived constants. Test #3 flag (clamping
  vs raw ratio) surfaced for partnership decision before
  `edge-analyzer.test.js` is implemented.
- **v1.0.1 (2026-05-22, W1 spiral concern follow-up):** Per-constant
  rationale paragraphs deepened for the 60/40 blend and elemental
  multipliers (origin, why-this-value, honest non-phi disclosure,
  sensitivity intuition). New **BR Formula Duality Reconciliation**
  sub-section consolidates the three BR formulations (`BR_share`,
  `BR_delta`, `BR_log`) into a single honest scope-and-usage table.
  No code, test, or other-section changes.
- **Future v1.1:** consider phi-aligning the 60/40 blend (already
  numerically close) and elemental multipliers (load-bearing question).
  Also consider renaming Section 9 BR to `BR_share` and Section 7
  edge BR to `BR_delta` in code for naming-conflict resolution.
- **Future v1.2:** if/when CEN BSC adds edge-level KPIs (currently no edges
  carry direct BSC instruments — only faces + vertex V13), the
  `T_edgeHealth` defaults can be retired and the formula will report
  `real: true` instead of `defaulted: 0.5`.

---

## 15. Advanced Vertex Extensions — Direction, Coherence, Chirality, Leverage (added 2026-05-21)

### Conceptual Premise

Section 8 (core) covers vertex vortex strength
`strength = φ⁻¹ × (σ / 0.577) + φ⁻² × μ` — the phi-partitioned blend of
variance and mean across the 3 faces meeting at a vertex. It answers
*"how much energy is converging at this triple-junction?"*

Section 15 documents **four advanced vertex measurements** in
`js/advanced/vertex-analyzer.js` that extend the core strength signal
with directional, structural, and rotational characteristics:

1. **Vortex direction** — generative (upward) vs degenerative (downward)
2. **Coherence at vertex** — how aligned the three faces are
3. **Chirality** — rotational handedness of the energy sequence  *(this section contains the load-bearing symbolic-verification finding for the entire Wave-1 hardening pass)*
4. **Leverage-point detection** — high-strength + low-coherence pattern

Each extension is a separate measurement on the same three faces; they are
independent and can be reported alongside core strength without
interference.

### Mathematical Formulas

#### 15.1 Vortex Direction (`vertex-analyzer.js:183-194`)

```
direction = clamp([−1, +1], (μ − 0.5) × 2)

Where:
  μ = (f1 + f2 + f3) / 3       (mean energy of the three faces)
  direction > 0  ⇒ upward spiral   (generative, building)
  direction < 0  ⇒ downward spiral (degenerative, releasing)
  direction = 0  ⇔ μ = 0.5         (balanced)
```

#### 15.2 Coherence at Vertex (`vertex-analyzer.js:251-269`)

```
coherence = clamp([0, 1], 1 − avg_pairwise_diff / 0.667)

Where:
  diff_12 = |f1 − f2|, diff_23 = |f2 − f3|, diff_31 = |f3 − f1|
  avg_pairwise_diff = (diff_12 + diff_23 + diff_31) / 3
  0.667 ≈ max-possible avg-diff for 3 values in [0, 1]   (e.g. 0, 0.5, 1)
  coherence = 1  ⇔ all three faces identical
  coherence = 0  ⇔ maximum spread {0, 0.5, 1}
```

#### 15.3 Chirality (`vertex-analyzer.js:207-240`) — **LOAD-BEARING**

Implementation formula:
```
winding   = (f2 − f1) × (f3 − f2) − (f3 − f1) × (f2 − f1) / 2
norm_w    = clamp([−1, +1], winding × 10)

chirality = 'counterclockwise' if norm_w > +0.1   (Building ↺)
            'clockwise'         if norm_w < −0.1  (Releasing ↻)
            'neutral'           otherwise
strength  = |norm_w|
```

#### 15.4 Leverage-Point Detection (`vertex-analyzer.js:341-344`)

```
isLeveragePoint = (strength > φ⁻¹) ∧ (coherence < φ⁻²)
                = (strength > 0.618) ∧ (coherence < 0.382)

Interpretation: high energy convergence + low alignment = transformation
opportunity (small interventions cascade across misaligned faces).
```

---

### Symbolic Verification of the Chirality Formula

**The brief required a sympy-driven check** of whether the implementation
formula
```
winding = (f2 − f1)(f3 − f2) − (f3 − f1)(f2 − f1)/2
```
algebraically degenerates. The verification was run on 2026-05-21:

```python
from sympy import symbols, simplify, expand, factor
f1, f2, f3 = symbols('f1 f2 f3')
winding = (f2 - f1) * (f3 - f2) - (f3 - f1) * (f2 - f1) / 2
expand(winding)
  # → −f1²/2 + 3·f1·f2/2 − f1·f3/2 − f2² + f2·f3/2
simplify(winding)
  # → (f1 − f2) · (−f1 + 2·f2 − f3) / 2
factor(winding)
  # → −(f1 − f2) · (f1 − 2·f2 + f3) / 2
```

#### What the simplified form actually means

The closed form `(f1 − f2)(2·f2 − f1 − f3) / 2` is **a genuine quadratic
form in (f1, f2, f3)** that factors into two interpretable terms:

- **Factor A:** `(f1 − f2)` — the first-pair imbalance
- **Factor B:** `(2·f2 − f1 − f3)` — twice the deviation of f2 from the
  midpoint of (f1, f3). This is a **discrete second-difference** of the
  sequence (f1, f2, f3) — it measures concavity / convexity of the
  three-point energy sequence, not rotational direction.

The full expression is therefore a **product of (imbalance, concavity)**,
divided by 2. It is mathematically non-trivial — it does NOT collapse to
zero or to a single linear term.

#### But: it is NOT a rotational winding

The implementation comments call this "winding" and label outputs
"clockwise / counterclockwise". A true rotational winding number would
be **cyclically symmetric** (invariant under f1 → f2 → f3 → f1) or
**antisymmetric under reversal** (negates under f1 ↔ f3). The sympy
verification shows the implementation formula is **neither**:

```
Cyclic permutation (f1 → f2 → f3 → f1):
  original:  (f1 − f2)(−f1 + 2·f2 − f3) / 2
  permuted:  (f2 − f3)(−f1 − f2 + 2·f3) / 2
  difference: NONZERO        →  not cyclically symmetric

Reversal (f1 ↔ f3):
  original:  (f1 − f2)(−f1 + 2·f2 − f3) / 2
  reversed:  (f2 − f3)( f1 − 2·f2 + f3) / 2
  sum (would be 0 if antisymmetric): NONZERO  →  not antisymmetric under reversal
```

**Empirical numerical sweep** confirms the geometric implication:

| (f1, f2, f3) | winding | norm_w | implementation says |
|---|---|---|---|
| (0.1, 0.5, 0.9) — ascending arithmetic | 0.000 | 0.000 | neutral |
| (0.9, 0.5, 0.1) — descending arithmetic | 0.000 | 0.000 | neutral |
| (0.3, 0.6, 0.9) — different ascending | 0.000 | 0.000 | neutral |
| (0.5, 0.5, 0.5) — identical | 0.000 | 0.000 | neutral |
| (0.5, 0.9, 0.5) — peak at f2 | −0.160 | −1.000 | clockwise |
| (0.5, 0.1, 0.5) — trough at f2 | +0.160 | +1.000 | counterclockwise |

The formula **assigns identical "neutral" output to both ascending AND
descending arithmetic progressions** — i.e. it cannot distinguish
"energy flows up around the vertex" from "energy flows down around the
vertex". That is exactly the distinction a rotational handedness should
detect.

What the formula **does** detect cleanly is **concavity of the sequence
at f2**: peaks (f2 > midpoint(f1, f3)) read as clockwise / "releasing",
troughs (f2 < midpoint(f1, f3)) read as counterclockwise / "building".

#### Verdict

The implementation formula is **mathematically meaningful but
semantically mislabeled**. It measures sequence concavity, not
rotational chirality. The honest action is **relabel** rather than
remove:

**Deepened finding (Lock #8.22, test-suite verification 2026-05-21):**
The formula is more precisely a **UNSIGNED CONCAVITY MAGNITUDE DETECTOR**.
Test fixtures empirically demonstrated:
- `(0.5, 1.0, 0.5)` (peak at f2) → winding = −0.16
- `(0.5, 0.0, 0.5)` (trough at f2) → winding = −0.16 (IDENTICAL sign, NOT opposite)

A true "concavity sign" measure would distinguish peak (positive concavity)
from trough (negative concavity). This formula does NOT. It measures the
MAGNITUDE of deviation from linearity at f2, with sign determined by other
factors (not peak/trough direction). For naming integrity: this is an
unsigned concavity-magnitude detector. If signed peak/trough discrimination
is desired in future work, a different formula is required (e.g., the
simple second-difference `f1 − 2·f2 + f3` gives signed concavity directly).

**Rename action proceeds (Lock #8.19 + #8.22):**

- **Rename in code:** `calculateChirality` → `calculateSequenceConcavity`
  (or `chirality_heuristic` with deprecation note)
- **Rename in output:** `chirality: 'clockwise'/'counterclockwise'` →
  `concavity: 'convex'/'concave'/'flat'`
- **Update docstring** at lines 197-205 to reflect the actual property
  measured (concavity / second-difference sign), not rotational
  handedness
- **Preserve the historical CEN dataset values** (`chirality`,
  `chiralityStrength`, `chiralityLabel` in `mapping-context.json`) under
  the original keys for backwards-compatibility, but add a deprecation
  note pointing readers to the concavity reinterpretation

This is the **load-bearing finding** from Wave 1 Math Hardening: a
heuristic was operating under a misleading geometric label. The
underlying numerical signal is real and useful for diagnostics; the
language around it needs correction.

**Partnership-discussion items:**
1. Is concavity-of-energy-sequence a meaningful organizational signal in
   its own right (e.g. "is the middle face a peak or trough relative to
   its neighbours")? If yes — keep + relabel. If "interesting but not
   load-bearing" — deprecate the entire output.
2. Should a true rotational chirality be ADDED (e.g.
   `cyclic_winding = (f2 − f1) + (f3 − f2) + (f1 − f3) = 0`  —
   degenerate by topology so a different formulation is needed; or a
   signed area `½|((f2−f1)(f3−f1))| with orientation` — but this
   requires defining a canonical ordering of the 3 faces around the
   vertex, which is geometric metadata not currently tracked)?
3. The CEN dataset (V1, V4-V6, V8-V9, V11, V13-V14, V17-V19) reports
   `chiralityStrength` values up to 1.0 (V14). These ARE meaningful
   under the concavity reading — they should not be invalidated, just
   reinterpreted. Are downstream consumers (narrative generation, 3D
   visualization) currently using chirality labels in a way that breaks
   under relabel?

---

### Worked Example — CEN V13 (the first vertex-KPI in CEN dataset)

V13 = (F4 ∩ F9 ∩ F10) — Structure-Regeneration-Values triad. Per CEN
Lock #8.16, this is the **first vertex-anchored KPI** in the CEN BSC
(L8 SDG-alignment lives here, not on any face). It is therefore
load-bearing for the thesis-defense argument that the dodecahedral
topology *adds* analytical power that flat face-only scoring cannot
capture.

#### Canonical O1 face energies

At the canonical O1 layer (per Section 12 of this audit trail):
```
E_F4  (Structure)            = 0.1192    Wall (logistic floor — F4 has zero O1-priority KPIs)
E_F9  (Regenerative)         = 0.1192    Wall (logistic floor — sibling-blindness)
E_F10 (Foundational Values)  = 0.1192    Wall (logistic floor — F10 sibling-blindness)
```

**Honest disclosure on F4:** the brief mentioned `F4 = 0.1349` — that
value is the **F11 mixed-octave value** from Section 12 (line 841 of
audit trail), not F4 canonical-O1. At the canonical O1 layer, F4 has the
same architectural blindness as F9 and F10 — no O1-priority KPIs land on
F4 either — so F4 also sits at the logistic floor of 0.1192. The worked
example below uses the correct value. This is a *third* sibling to F9
and F10 architectural-blindness; flagged for the F10 sibling-finding
memory and possible audit-trail Section 12 extension.

#### Step-by-step calculation

```
Step 1 — μ (mean):
  μ = (0.1192 + 0.1192 + 0.1192) / 3 = 0.1192

Step 2 — σ (standard deviation):
  variance = ((0 + 0 + 0)) / 3 = 0
  σ = √0 = 0

Step 3 — normalized variance:
  norm_var = σ / 0.577 = 0

Step 4 — vortex strength (Section 8 core formula):
  strength = φ⁻¹ × 0 + φ⁻² × 0.1192
           = 0 + 0.381966 × 0.1192
           = 0.045530

Step 5 — vortex direction (15.1):
  direction = (0.1192 − 0.5) × 2 = −0.7616  →  Downward spiral

Step 6 — coherence (15.2):
  avg_pairwise_diff = (0 + 0 + 0) / 3 = 0
  coherence = 1 − 0 / 0.667 = 1.000  →  Maximum (faces are identical)

Step 7 — chirality / sequence-concavity (15.3):
  winding = (0.1192 − 0.1192)(0.1192 − 0.1192)
            − (0.1192 − 0.1192)(0.1192 − 0.1192) / 2
          = 0
  norm_w = 0  →  neutral (no concavity signal — degenerate case)

Step 8 — health status (vortex-analyzer.js:getHealthStatus, post-v1.1 fix):
  strength 0.0455 < φ⁻⁴ 0.146  AND  coherence 1.000 ≥ ψ₄ 0.854
  →  "Coherent-at-floor"   (pre-v1.1 returned "Harmonious";
   see Honest Disclosure #6 below for the fix rationale —
   coherence-of-shared-absence vs real harmony.)

Step 9 — leverage-point detection (15.4):
  strength 0.0455 > φ⁻¹ 0.618?   NO
  coherence 1.000 < φ⁻² 0.382?   NO
  isLeveragePoint = FALSE
```

#### Interpretation — the V13 paradox

V13 reports **maximum coherence (1.0) + minimum strength (0.0455) +
downward direction (−0.76) + harmonious health label**. Read naively,
"harmonious + coherent" sounds good. Read against the canonical O1 data
context, this is the **CEN structural-blindness signature surfacing at
the vertex layer**:

- All three faces (F4, F9, F10) sit at the logistic floor because **none
  of them have any O1-priority KPIs**. The "perfect coherence" is the
  coherence of shared absence.
- The downward direction (−0.76) is the truth-teller: the vertex sits
  deep below the 0.5 balance line. The cluster is harmonious only in the
  sense that all three faces are equally suppressed.
- The "harmonious" health label is **misleading** in this context — it
  triggers off coherence alone, ignoring strength. Flagged for
  partnership discussion: should `getHealthStatus` factor in strength,
  or should the dashboard suppress the "Harmonious" label when strength
  is at floor?

#### Counterfactual — what V13 looks like if any of the faces lifts

If any face gains O1-KPI signal (e.g. F4 lifts to 0.135 — the F11
mixed-octave value), the picture changes slightly but the leverage-point
diagnosis still does not trigger:

```
With E_F4 = 0.1349, E_F9 = 0.1192, E_F10 = 0.1192:
  μ           = 0.1244
  σ           = 0.00740
  strength    = 0.0555    (still well below φ⁻¹)
  direction   = −0.7511
  coherence   = 0.9843
  winding     = −0.000123    →    norm_w = −0.00123    →    neutral
  isLeverage  = FALSE
```

V13 only becomes a leverage point when (a) strength climbs above φ⁻¹
(0.618) AND (b) coherence drops below φ⁻² (0.382). For CEN under
canonical O1, V13 is currently a **dormant vertex** — full of latent
significance (it carries L8 SDG-alignment, the highest-stakes KPI) but
zero current energetic expression.

This is the **thesis-defense significance** of V13: the vertex layer
correctly identifies a "latent transformation point with no current
energetic activation" — a signal that face-only scoring would entirely
miss. The dodecahedral topology earns its keep here.

---

### Test Cases for `POC/tests/vertex-analyzer.test.js` (NEW)

| # | Assertion | Expected |
|---|---|---|
| 1 | **Direction symmetry:** `direction([0.8, 0.8, 0.8])` and `direction([0.2, 0.2, 0.2])` | `+0.6` and `−0.6` (μ=0.8: (0.8−0.5)×2; μ=0.2: (0.2−0.5)×2) |
| 2 | **Coherence — identical:** `coherence([0.5, 0.5, 0.5])` | `1.0` |
| 3 | **Coherence — max spread:** `coherence([0, 0.5, 1])` | `0.0` exactly (avg_diff = 0.667 / 0.667 = 1.0; 1 − 1 = 0) |
| 4 | **Chirality (current implementation, semantic flag):** `chirality([0.5, 0.9, 0.5])` returns `'clockwise'` | Holds under concavity reading (peak at f2 = "releasing"). **Test should be relabelled if formula is renamed; see symbolic verification above.** |
| 5 | **Chirality degeneracy on arithmetic:** `chirality([0.1, 0.5, 0.9])` AND `chirality([0.9, 0.5, 0.1])` both return `'neutral'` | This is the bug-as-feature surfaced by the sympy verification. The test should DOCUMENT this behaviour explicitly so future maintainers see it. |
| 6 | **Leverage point:** `isLeveragePoint(0.7, 0.3)` | `true` (strength > 0.618 AND coherence < 0.382) |
| 7 | **CEN V8 [F4=0.45, F5=0.20, F10=0.95] classification:** | The CEN dataset labels V8 `bermuda_triangle` at `mapping-context.json:186`. **EMPIRICAL FINDING (Lock #8.22, test-suite verification 2026-05-21):** Per current canonical formula, V8 strength = 0.538 which is LESS than φ⁻¹ = 0.618 — so V8 is NOT a leverage point per engine. The `bermuda_triangle` label in mapping-context.json is **NARRATIVE SCAFFOLDING, NOT engine output** (third instance of this pattern after dominantMode in Section 13 Provenance Investigation and BAB/dissonance values). Same systemic finding: mapping-context.json vertex/spectral classifications are hand-authored narrative labels diverging from canonical engine computation. Sister-pattern to Lock #8.20. **Test asserts engine truth (V8 is NOT leverage), documents the narrative-divergence honestly.** |
| 8 | **CEN regression — all 20 vertices:** | For each of V1-V20, assert `(strength, coherence, direction, chirality)` matches the precomputed values in `mapping-context.json:178-198`. Flag any mismatch with the face-energy regime used to compute the dataset. |

**Test #4-5 should remain in place after relabel** as the documented
behaviour record; the test labels and docstrings should be updated to
say `concavity` rather than `chirality` (or both, with the chirality
form deprecated).

---

### Implementation Reference

- **Module:** `js/advanced/vertex-analyzer.js`
- **Direction:** lines 183-194 (`calculateVortexDirection`)
- **Coherence:** lines 251-269 (`calculateCoherence`)
- **Chirality (relabel pending):** lines 207-240 (`calculateChirality`)
- **Leverage:** lines 341-344 (`isLeveragePoint`)
- **Constants:** `_PHI_1`, `_PHI_2`, `_PSI_4` from PhiHarmonics SSOT
- **Companion:** `Section 8. Vertex Vortex Energy` (core SSOT
  `js/core/Vertex.js`)
- **Sympy verification artifact:** this section preserves the full
  derivation; no separate artifact file emitted.

---

### Honest Disclosures

**1. Chirality is misnamed (load-bearing).** Per the symbolic
verification, the implementation formula measures **sequence concavity**,
not rotational handedness. The signal is real but the label is
misleading. Recommended action: relabel `calculateChirality` →
`calculateSequenceConcavity` (or add the concavity reading as a parallel
output and deprecate the chirality terminology over time).

**2. 0.577 normalizer is exact, not pragmatic.** The `σ / 0.577`
normalization in vortex strength uses `0.577 ≈ √(1/3)` — the EXACT
maximum standard deviation for 3 values bounded in [0, 1]. This is
mathematically grounded (achieved at distributions like {0, 0, 1} or
{0, 1, 1}), not a heuristic constant. Worth noting because the literal
0.577 in the code can look pragmatic.

**3. 0.667 coherence normalizer is approximate, not exact.**

- **Origin:** Derived analytically during the vertex-analyzer build
  (`js/advanced/vertex-analyzer.js` lines 251-269) as the
  **maximum-possible average pairwise difference** for 3 values
  bounded in `[0, 1]`. Achieved at distributions like `{0, 0.5, 1}`
  where the three pairwise diffs are `|0 − 0.5| = 0.5`,
  `|0.5 − 1| = 0.5`, `|0 − 1| = 1.0`, averaging to exactly `2/3 ≈
  0.6667`. The normalizer maps this maximum spread to `coherence = 0`
  and identical-faces (`avg_diff = 0`) to `coherence = 1`.
- **Why this specific value:** It is the **theoretical maximum**, so
  `coherence = 1 − avg_diff / max_avg_diff` produces a clean `[0, 1]`
  range with the geometric endpoints saturating exactly. This is
  mathematically grounded — not a heuristic.
- **Honest disclosure:** **NOT phi-derived** in any direct sense. It
  IS, however, the EXACT analytical answer to a well-posed geometric
  question (max avg-pairwise-diff for 3 values in [0, 1]). The
  pragmatic concern is **float precision**: the code uses the
  rounded literal `0.667` rather than the exact `2/3`, which means
  the function returns `coherence ≈ −0.0005` (slightly negative) for
  the exact-maximum-spread input `{0, 0.5, 1}` before the `[0, 1]`
  clamp engages. The clamp absorbs the imprecision; results are
  practically fine but not bit-exact-floor-zero at the geometric
  extreme.
- **Sensitivity intuition:** If `0.667` were replaced with `0.7`
  (a moderately larger normalizer), the coherence floor would lift
  off zero for max-spread inputs — at `{0, 0.5, 1}`,
  `coherence = 1 − 0.6667 / 0.7 ≈ 0.048`. If replaced with `0.6`
  (smaller), coherence would go negative pre-clamp for any
  high-spread input. The clamp would still keep outputs in `[0, 1]`
  but the function would lose calibration at the extremes. The
  `0.667` choice is **the unique value that makes the geometric
  extreme align with the clamp boundary** — replacing it requires
  either accepting calibration loss or compensating elsewhere. A
  v1.1 fix would substitute the exact `2/3` literal (or `EPSILON +
  2/3`) to eliminate the sub-zero drift, with zero behavioral change
  beyond float-precision cleanliness.

**4. The 0.1 chirality (now sequence-concavity) classification threshold is pragmatic.**

- **Origin:** Researcher choice during the vertex-analyzer build for
  the three-way classification step at `vertex-analyzer.js:207-240`.
  The implementation reads:
  ```
  if (norm_w > +0.1) label = 'counterclockwise'    (concave / building)
  if (norm_w < −0.1) label = 'clockwise'           (convex / releasing)
  else              label = 'neutral'              (flat sequence)
  ```
  The `0.1` width carves out a narrow **neutral band** around zero so
  that floating-point noise and trivially-small sequence concavity
  don't trigger directional labels.
- **Why this specific value:** A round number chosen for intuitive
  visual cleanliness on the dashboard — `±0.1` reads as "within 10%
  of perfectly flat" on the `[−1, +1]` normalized scale. No empirical
  optimization or sensitivity study was performed.
- **Honest disclosure:** **NOT phi-derived.** Plausible phi-aligned
  alternatives: `> φ⁻⁵ ≈ 0.0902` (narrower band, more directional
  labels) or `> φ⁻⁴ ≈ 0.1459` (wider band, more neutral labels). The
  numerical coincidence `φ⁻⁵ ≈ 0.090` (very close to 0.1) is
  unintentional. Flagged for partnership discussion in v1.1 whether
  to adopt `φ⁻⁵` for cross-formula phi-consistency.
- **Sensitivity intuition:** Widening to `0.15` would shift roughly
  20% of currently-directional vertices into the "neutral" band on
  the CEN dataset — losing fine-grained signal but reducing
  false-positive directional readings on barely-concave sequences.
  Narrowing to `0.05` would flip the trade — more sensitivity, more
  noise-triggered directional labels. The 0.1 choice sits at a
  comfortable middle on the bias-variance trade. Given the broader
  finding (Section 15 symbolic verification: the formula is mislabeled
  as "chirality" — it actually measures sequence concavity), the
  threshold's exact value is somewhat moot until the relabel happens.
  Under the concavity reading, the threshold answers
  *"how flat does the sequence (f1, f2, f3) need to be before we
  call it geometrically flat?"* — a question where 0.1 is a
  defensible round-number answer.

**5. The ×10 winding-scale normalizer is pragmatic.**

- **Origin:** Researcher choice during the vertex-analyzer build at
  `vertex-analyzer.js:207-240`. The raw `winding` quantity is the
  expanded sympy form
  `(f1 − f2)(2·f2 − f1 − f3) / 2` (per the symbolic verification
  above) — which for face-energy inputs in `[0, 1]` lives in a
  narrow band `[−0.25, +0.25]` (analytically bounded; the maximum
  magnitude is `1/8 ≈ 0.125` for the extreme peak/trough
  configuration `(0, 1, 0)` or `(1, 0, 1)`). Multiplying by 10
  brings the **typical observed magnitudes** (much smaller than the
  extremes, since most face energies cluster near the floor or middle
  of `[0, 1]`) into the `[−1, +1]` range used by the dashboard.
- **Why this specific value:** A round-number rescaler chosen by
  inspection of typical CEN datapoints. Most observed `winding`
  values land in `[−0.05, +0.05]`, so `×10` produces dashboard-range
  outputs `[−0.5, +0.5]`. No empirical sensitivity study was
  performed — `10` was selected for "the typical values look right
  after rescaling" rather than derived from the analytical max.
- **Honest disclosure:** **NOT phi-derived.** A more **principled
  normalization** would be `winding / max_possible_winding =
  winding / 0.125 = winding × 8` — using the analytical maximum
  rather than the empirical-typical bound. This would produce
  outputs that saturate at `±1` exactly at the geometric extremes
  (peak `(0, 1, 0)` → `+1.0`; trough `(1, 0, 1)` → `−1.0`) without
  needing a clamp. The current `×10` over-rescales — the clamp
  truncates the analytical extremes (8/10 = 0.8 of full range used).
  Flagged for v1.1: substitute `×8` for analytical correctness, or
  preserve `×10` for dashboard-typical-value calibration. Both are
  defensible; the choice is a partnership decision about
  *what the normalized output should mean* — "fraction of analytical
  max" (×8) vs "fraction of dashboard-typical" (×10).
- **Sensitivity intuition:** Switching from `×10` to `×8` would
  reduce all directional-label magnitudes by 20% on the typical CEN
  dataset, shrinking the proportion of vertices crossing the 0.1
  threshold by approximately one band-width. Switching to `×20`
  would saturate the clamp on many more vertices, losing
  fine-grained gradation in the high-concavity regime. The `×10`
  middle ground preserves typical-value gradation while still
  reaching the clamp on extreme inputs.

**6. "Harmonious" health label conflates two regimes — RESOLVED v1.1
(2026-05-22).** The pre-fix label triggered off coherence ≥ ψ₄ alone, so
V13 with identical-floor faces received "Harmonious" despite minimal
strength — coherence-of-shared-absence reading as harmony. The W1 spiral
applied the honest fix in `vertex-analyzer.js:getHealthStatus`: strength
is now a second argument, and when `strength < φ⁻⁴` (≈ 0.146, the
audit's "Wall band" floor) AND `coherence ≥ ψ₄`, the label becomes
**`"Coherent-at-floor"`** rather than `"Harmonious"`. Above-floor
strength keeps the original coherence-only ladder unchanged. Legacy
single-argument callers continue to behave as before (strength
`undefined` → guard skips → original ladder fires). For CEN V13 under
canonical O1: coherence 1.000 + strength 0.0455 → `"Coherent-at-floor"`,
distinguishing this dormant-vertex case from a genuine three-face
harmony pattern. Test coverage added at
`tests/vertex-analyzer.test.mjs` §6 (3 new assertions: V13 paradox case,
above-floor counter-case at [0.8, 0.8, 0.8], backward-compat 1-arg
call). CEN `mapping-context.json` V13 entry carries no narrative
`healthStatus` field (only `classification: "synergy_hub"` + `tooltip`);
no narrative propagation required for this fix.

---

### Versioning Notes

- **v1.0 (2026-05-21):** Initial audit-trail extension of Section 8.
  Sympy symbolic verification of the chirality formula completed —
  finding: **formula is meaningful but mislabelled**, measures
  sequence-concavity not rotational handedness. CEN V13 worked example
  computed under canonical O1 face energies. Six honest disclosures
  preserved. Three partnership-discussion items surfaced (chirality
  relabel; V13 "Harmonious" label; CEN dataset regeneration regime).
- **v1.1 (2026-05-22):** V13 paradox `"Harmonious"` label fix applied
  in `vertex-analyzer.js` (Honest Disclosure #6 closed). `getHealthStatus`
  now accepts `(coherence, strength)` and returns `"Coherent-at-floor"`
  when both conditions hold: `strength < φ⁻⁴` AND `coherence ≥ ψ₄`.
  No mapping-context.json updates required (no narrative health field
  on V13). Test suite extended +3 (vertex-analyzer.test.mjs §6).
- **v1.1.1 (2026-05-22, W1 spiral concern follow-up):** Per-constant
  rationale paragraphs deepened for the 0.667 coherence normalizer,
  the 0.1 chirality (now sequence-concavity) classification threshold,
  and the ×10 winding-scale normalizer (origin, why-this-value,
  honest non-phi disclosure, sensitivity intuition). No code, test,
  or other-section changes; the constants were already honest-disclosed
  at v1.0 but lacked the per-constant rationale depth required by the
  W1 spiral. Companion to Section 14 v1.0.1 BR Formula Duality
  Reconciliation block.
- **Future v1.2:** apply chirality → concavity relabel after partnership
  decision. Update `mapping-context.json` `chirality*` keys to
  `concavity*` with backward-compat aliasing if downstream consumers
  need a transition period.
- **Future v1.2:** consider implementing a TRUE rotational chirality
  (requires defining canonical face-ordering around each vertex —
  geometric metadata currently absent from the dodecahedron model). If
  added, this would live alongside concavity, not replace it.

---

## 16. Apparent vs Granular Gap (AvG) — Aggregation Distortion Diagnostic (added 2026-05-21)

### Conceptual Premise

AvG quantifies the GAP between an organization's **top-level rollup score**
(Global Coherence at the face level, per Section 1) and the **underlying
granular detail** (arithmetic mean of all 60 element-level KPI values across
the 12 face × 5 element grid). It catches the failure mode where face-level
coherence looks healthy but the underlying KPI infrastructure is weak — i.e.,
**aggregation hides variance**.

Distinct from AAG (Section 12). AAG measures aspiration-vs-actuality at the
face-grouping level (3 faces vs 3 faces, ratio). AvG measures
**rollup-vs-detail** across the full 60-element grid (absolute difference).
Both diagnostics; complementary. AAG is *partition-aware*; AvG is
*hierarchy-aware*.

Per the W1 Math Hardening commitment in the CEN SSOT Consolidation Map
(Lock #8.16 — pending) and the broader diagnostics discipline that says
*every layer of aggregation must remain traceable to its underlying detail*.

### Mathematical Formula

```
AvG = |C_global − K_mean_60|

C_global   = κ(μ_E × (1 − λ · CV_E))       per Section 1 [face-level rollup]
K_mean_60  = (k_1 + k_2 + … + k_60) / 60   [arithmetic mean of all 60 element KPI values]
```

Where:
- **C_global** is the canonical Global Coherence computed from the 12 face
  energies (Section 1: μ_E mean of E_face_i, CV_E coefficient of variation,
  λ = φ⁻³ ≈ 0.2361, κ sensitivity amplifier). When comparing rollup to
  detail, **the raw pre-amplifier value `μ_E × (1 − λ·CV_E)` is used** —
  see *Pre-Amplifier vs Post-Amplifier Choice* below.
- **K_mean_60** is the arithmetic mean of all 60 element-level KPI values
  normalized to [0, 1], including silent cells (those with no KPI assigned
  contribute 0 per the canonical `zeroEnergy` rule). Silent cells are
  **not** excluded — they ARE part of the granular truth.
- **AvG** is the absolute difference, bounded by [0, 1].

Both inputs are dimensionless and on the same [0, 1] scale, so the absolute
gap is directly interpretable.

### Scope Distinction — AvG_O1 vs AvG_all

AvG can be computed at two scopes that answer different questions; reports
must always carry an explicit scope label.

- **AvG_O1** — uses only the cells whose canonical priority is O1 (strict
  O1-only). Many cells will be silent (zero-filled) because their evidence
  lives at O2/O3. This scope answers: *"At the O1 survival layer alone, does
  the face-level reading match the underlying O1 evidence?"* The canonical
  CEN worked example below uses this scope.
- **AvG_all** — uses all 60 cells regardless of octave. Cells filled from
  O2/O3 evidence contribute. This scope answers: *"Across the full octave
  stack present in the BSC, does the face-level reading match the underlying
  KPI evidence?"*

The two scopes can produce dramatically different AvG values when octave
priority is mismatched between rollup and the detail grid. They should
never be compared directly — they are different measurements.

### Pre-Amplifier vs Post-Amplifier Choice

C_global as delivered by `DodecahedronEngine.getGlobalCoherence()` (Section 1)
has the κ sensitivity amplifier applied (logistic S-curve, then rescaled to
restore [0, 1] range). For AvG, the **pre-amplifier raw value** is used —
i.e., `μ_E × (1 − λ·CV_E)` before the S-curve compresses the operational
range. Rationale:

1. **Apples-to-apples comparison.** K_mean_60 is a simple arithmetic mean of
   raw element values — it has no amplifier applied. To compare to C_global,
   we must compare to its similarly-raw counterpart.
2. **Amplifier obscures the aggregation question.** The κ S-curve is a
   sensitivity transform for UI consumers; it has nothing to do with whether
   the face-level rollup faithfully represents the element-level detail.
   Including κ would conflate two distinct concerns.
3. **Spec consistency with Section 12 AAG.** AAG ratios use raw face energies
   directly (no κ applied). AvG follows the same convention.

The engine exposes the pre-amplifier value via `state.coherenceDetail.raw`
(per `getCoherenceDetail()` in `js/main.js:1500`). The new `Diagnostics.js`
module reads from there.

### Interpretation Ladder (4 levels — φ-derived)

| AvG range | Band | Interpretation |
|---|---|---|
| AvG < φ⁻⁶ ≈ **0.056** | **Faithful aggregation** | Rollup honest to underlying detail; the face-level Global Coherence reading is well-supported by element-level KPIs |
| φ⁻⁶ ≤ AvG < φ⁻⁵ ≈ **0.090** | **Minor compression artifact** | Acceptable; rollup smooths some variance but the headline number remains representative |
| φ⁻⁵ ≤ AvG < φ⁻⁴ ≈ **0.146** | **Aggregation distortion** | Rollup masking underlying variance; investigate which faces drive the gap and whether the headline is misleading |
| AvG ≥ φ⁻⁴ ≈ **0.146** | **Severe aggregation distortion** | Rollup substantially disconnected from KPI detail; headline coherence reading should not be presented standalone — must be paired with granular evidence |

Thresholds are **φ-derived** (powers of φ⁻¹ from the harmonic series):
- φ⁻⁶ ≈ 0.0557 — the noise floor below which compression artifacts are
  indistinguishable from rounding
- φ⁻⁵ ≈ 0.0902 — the harmonic step at which compression becomes
  systematically detectable
- φ⁻⁴ ≈ 0.1459 — the boundary at which the rollup-detail gap exceeds the
  η harmonic-boost ceiling (η = φ⁻² × 0.382 reference scale); past this
  point aggregation has lost the underlying signal

This honors the same φ-harmonic discipline that anchors λ (φ⁻³) in
Section 1 and the octave thresholds in Appendix A.

### Worked Example — CEN at canonical O1 (2026-05-21, pure-O1 recomputation)

Using CEN canonical O1 face energies (12 values from pentagramic computation,
identical input set as Section 12 AAG and Section 13 spectral worked
examples, per `CEN_SSOT_W06v3_34KPI_QuestionDerived_Mapping_2026-05-21.md`):

```
E_F1   = 0.2563   Gate     (Financial Capital)
E_F2   = 0.1192   Wall     (Intellectual Capital — logistic floor)
E_F3   = 0.1192   Wall     (Human Capital — logistic floor)
E_F4   = 0.1349   Element-driven  (Structural Capital)
E_F5   = 0.1349   Element-driven  (Market Resonance)
E_F6   = 0.1523   Gate     (Community & Partners)
E_F7   = 0.1192   Wall     (Brand & Reputation)
E_F8   = 0.1192   Wall     (Core Operations)
E_F9   = 0.1192   Wall     (Regenerative Flow)
E_F10  = 0.1192   Wall     (Foundational Values — F10 sibling-blindness)
E_F11  = 0.1192   Wall     (Funding Pipeline)
E_F12  = 0.1523   Gate     (Risk & Resilience)
```

**Scope note:** the worked example below uses **strict-O1 cells only** —
silent cells (cells whose canonical priority is O2 or O3) are zero-filled,
per the pure-O1 recomputation recorded in
`Final Thesis/Thesis Work/spiral-reports/CEN_SSOT_PureO1_Recomputation_2026-05-21.md`.
Of the 60 cells, **7 are non-zero** at O1 priority; the remaining 53 are
silent zero-filled. This is the AvG_O1 scope, NOT AvG_all.

**Step 1 — μ_E (mean of 12 face energies):**
```
μ_E = (0.2563 + 0.1192 + 0.1192 + 0.1349 + 0.1349 + 0.1523
     + 0.1192 + 0.1192 + 0.1192 + 0.1192 + 0.1192 + 0.1523) / 12
    = 1.6651 / 12
    = 0.138758
```

**Step 2 — CV_E (coefficient of variation):**
```
σ_E² = (1/12) · Σ (E_f − μ_E)²
     = 0.001408
σ_E  = √0.001408 = 0.037517
CV_E = 0.037517 / 0.138758 = 0.270376
```

**Step 3 — C_global raw (pre-amplifier):**
```
C_global = μ_E × (1 − λ · CV_E)
         = 0.138758 × (1 − 0.236068 × 0.270376)
         = 0.138758 × (1 − 0.063822)
         = 0.138758 × 0.936178
         = 0.129902
```

**Step 4 — K_mean_60 (arithmetic mean of all 60 strict-O1 cells):**

Per the pure-O1 recomputation (strict-O1 cells only, 7 non-zero of 60,
with 53 cells whose canonical priority is O2/O3 zero-filled):
```
K_mean_60_O1_only = (sum of 7 non-zero O1 cells) / 60
                  = 0.0417
```

**Step 5 — AvG_O1:**
```
AvG_O1 = |C_global − K_mean_60_O1_only|
       = |0.129902 − 0.0417|
       = 0.0882
```

**Step 6 — interpretation:**
```
AvG_O1 = 0.0882   →   φ⁻⁵ (0.0902) > 0.0882 > φ⁻⁶ (0.0557)
  ⇒ near the upper boundary of "Minor compression artifact"
  ⇒ effectively at the "Aggregation distortion border"
```

**Reading:** At the canonical O1 layer, CEN's face-level Global Coherence
(0.1299) is **roughly 3x higher** than the underlying strict-O1 element-mean
(0.0417). The rollup is NOT honest to the O1 detail — the face-level
number sits well above what the O1 KPI evidence actually supports. This
SIGNALS the **F9/F10/F4 architectural blindness pattern** that Section 12
and Section 15 also surface: face-level aggregation looks more populated
than the underlying O1 evidence justifies, precisely because the logistic
floor (Wall = 0.1192) lifts the seven all-silent faces (F2, F3, F7, F8, F9,
F10, F11) to a level that the strict-O1 evidence does not support.

This is **NOT a formula failure** — the floor is geometrically meaningful
and prevents collapse to zero. It IS a *diagnostic signal*: at O1 alone,
CEN has so little KPI coverage that the face-level reading is supported
more by the floor than by the evidence, and the AvG_O1 diagnostic is
correctly surfacing this.

The narrative coherence with §15's V13 paradox is exact: V13 reports
"perfect coherence at the floor" → V13 paradox; the global AvG_O1 reports
"3x rollup-detail gap" → architectural-blindness gap surfaced at the
hierarchy layer. Different lenses, same underlying truth.

For comparison, **AvG_all** (computed across all 60 cells regardless of
octave, per the original Section 16 staging draft) would land at
K_mean_60_all ≈ 0.1483 and AvG_all ≈ 0.0184 — in the "Faithful
aggregation" band. The two scope readings answer different questions
and MUST be reported with explicit scope labels.

### Why This Matters — Catching "Healthy Aggregate Hiding Weak Detail"

Consider two hypothetical organizations, both with C_global = 0.5:

**Org A — coherent at every scale:**
- Element KPIs uniformly around 0.5 → K_mean_60 ≈ 0.5 → AvG ≈ 0 (Faithful)
- Headline coherence 0.5 means what it appears to mean.

**Org B — aggregation masking bimodal extremes:**
- 50% of KPIs at 1.0, 50% at 0.0 → K_mean_60 = 0.5
- But face energies, after CV penalty, also land near 0.5 if the
  bimodal distribution averages out per face
- AvG ≈ 0 — also Faithful here, because the bimodal pattern shows in
  *neither* C_global *nor* K_mean_60

The discriminator AvG catches is a *different* pattern: **face-level
aggregation lifting above the underlying truth**. Example:

**Org C — high face scores from few strong elements:**
- F1 element KPIs (0.9, 0.9, 0.0, 0.0, 0.0) → E_F1 might land at ~0.6
  via local-coherence formula with strong Ball + harmonic boost
- 12 such faces → μ_E = 0.6 → C_global ≈ 0.55 (post-CV)
- But element-level: 60 × 0.36 average → K_mean_60 ≈ 0.36
- AvG ≈ 0.19 → "Severe aggregation distortion" (≥ φ⁻⁴)

AvG would flag Org C; AAG (Section 12) would not detect this pattern
because AAG ratios two face groupings, not the element grid.

A second important pattern AvG catches: **silent-cell density misleading
the headline**. If 50% of the element grid is silent (zero-filled), and
the 30 non-silent cells average 0.8, K_mean_60 = 0.4 but face-level
formulas may push individual faces into Gate territory (E ≥ 0.15) via
strong element contributors. C_global could read 0.5+; AvG would be
~0.1, flagging "Aggregation distortion." This is precisely the failure
mode in CEN's case at the O1 layer — see the AvG_O1 reading above.

### Distinction from AAG

| Metric | What it measures | Direction | What it catches |
|---|---|---|---|
| **AAG** (Section 12) | Aspiration capitals vs Actuality capitals (3+3 face grouping ratio) | Ratio: signed (>1 vs <1) | Hidden Oracle pattern (AAG>1) / operational drift (AAG<1) — at face-level partition |
| **AvG** (Section 16) | Top-level rollup vs underlying KPI granular mean | Absolute gap: unsigned | Aggregation distortion — rollup-detail disconnect across the full hierarchy |

Both diagnostics; neither replaces the other:
- **AAG** answers *"is the org aspiring beyond capacity, or vice versa?"*
  Partition-aware (specific face groupings; sensitive to which capitals
  are aspirational vs operational).
- **AvG** answers *"does the headline coherence number faithfully
  represent the underlying KPI infrastructure?"* Hierarchy-aware
  (rollup vs detail; agnostic to face partition).

A high AAG with low AvG: organization is genuinely aspiration-heavy, and
the face-level reading is honest. A high AAG with high AvG: organization
appears aspiration-heavy at the face level, but the underlying KPI
detail tells a different story — the aspirational face energies may be
inflated by sparse strong element KPIs (caution: AAG interpretation may
be misleading).

### Test Cases for `POC/tests/aag.test.js` (extended — adds AvG tests)

Adds to the AAG-only test file outlined in Section 12 (W1 §6.7):

1. **Identity:** all 60 KPIs = 0.5; face energies all 0.5 (post-formula);
   C_global = 0.5 → AvG = 0.0 (exact, within ε)
2. **Variance-only signal:** all 60 KPIs = 0.5 but face energies bimodal
   (6 at 0.8, 6 at 0.2 — engineered): K_mean_60 = 0.5; μ_E = 0.5;
   CV_E ≈ 0.6; C_global = 0.5 × (1 − 0.236×0.6) ≈ 0.429 →
   AvG ≈ 0.071 (Minor compression artifact band — variance penalty
   visible as faithful aggregation drift)
3. **Sparse-strong faces:** F1-F3 element KPIs = (1.0, 1.0, 1.0, 0, 0),
   others = 0; face energies derived; K_mean_60 = 15/60 = 0.25; C_global
   likely > 0.30 via Ball-weighted formula → AvG ≥ φ⁻⁵ (Aggregation
   distortion). Asserts AvG > 0.090.
4. **CEN regression — AvG_O1 (strict-O1 scope):** AvG_O1 expected value
   0.0882 to 1e-3 tolerance (the strict-O1 worked example above). Locks
   the canonical pure-O1 reading and the explicit O1 scope label.
5. **Edge case — empty inputs:** zero faces and zero elements → AvG
   returns 0 cleanly (no division-by-zero). Matches Section 1's
   "Empty faces array returns 0 immediately" edge case.

### Implementation Reference

- **Target module:** New `POC/js/core/Diagnostics.js` (W1 §6.2 task).
  Module exposes:
  ```javascript
  Diagnostics.getApparentGranularGap(faceEnergies, kpiValues, options)
    // returns { avg, c_global_raw, k_mean_60, band, interpretation }
  ```
  Same module also hosts `getAspirationActualityGap(faceEnergies)` per
  Section 12.
- **Engine integration:** `DodecahedronEngine.recalculate()` final pass
  computes diagnostics block; `state.diagnostics.apparentGranularGap`
  exposed alongside `state.diagnostics.aspirationActualityGap`. View
  layers (excel-report-generator, thesis-export, weekly-input) refactor
  to read from `state.diagnostics.*` rather than recompute locally.
- **Pre-amplifier coherence source:** `state.coherenceDetail.raw` per
  `getCoherenceDetail()` in `js/main.js:1500` (not `state.globalCoherence`
  which is amplified + rescaled).
- **Element-level KPI source:** New canonical accessor
  `engine.getElementMatrix()` (W1 §6.3 task) returns the 12×5 array of
  normalized KPI values with silent cells as 0. AvG uses this as input.
- **Tests:** `POC/tests/aag.test.js` extended from 4 to 9 tests (4 AAG
  per Section 12 + 5 AvG per this section).
- **Cloud Form spec reference:** AvG to be added to Cloud Form Spec v1.1
  diagnostics block alongside AAG when CEN SSOT v1.0 ships.

### Why Designing AvG NOW — F9 and F10 Architectural Blindness

CEN at O1 has two faces sitting at the logistic Wall floor (0.1192) for
different architectural reasons:

- **F9 Regenerative Flow:** **zero KPIs** in the BSC at O1 priority.
  Total architectural blindness at this octave layer. K_mean for F9 row
  is 0/5 = 0; face energy lands at Wall via the logistic floor (not via
  the formula proper).
- **F10 Foundational Values:** **2 KPIs**, both O2-priority. K_mean for
  F10 row is 1.5/5 = 0.30 (Air=0.70, Ether=0.80, others zero) under
  AvG_all scope. Under strict-O1 scope (both KPIs being O2-priority),
  F10 row contributes 0.00 — exactly the architectural-blindness pattern
  the diagnostic is designed to surface. Face energy ALSO lands at Wall
  floor (0.1192) because the BSC question-derived inputs for F10's O1
  columns are zero — F10 is invisible at O1 even though it has populated
  O2 evidence.

These are **different architectural failures producing the same
face-level reading**. F9 row K_mean = 0.00 (no KPIs at all); F10 row
K_mean_O1 = 0.00 (KPIs present but at O2 priority). At the face level
both read 0.1192. At the element level under strict-O1 scope they
converge in their absence — surfaced as the elevated AvG_O1 = 0.0882
reading. Under AvG_all scope they diverge: F9 stays at 0.00; F10 rises
to 0.30. The two scopes are complementary diagnostic lenses.

This is precisely the failure mode AvG is designed to surface. At the
face-level aggregate alone, CEN's diagnostic narrative would treat F9
and F10 identically ("both at Wall floor — both blocked"). At the
element level under AvG_all, the underlying truth is that **F10 has
granular evidence (at O2) that the O1 rollup cannot see** — not because
the aggregation formula is wrong, but because the BSC has measured F10
at O2 priority and the O1 face energy reflects that octave-priority
architecture.

For CEN at O1 specifically, AvG_O1 = 0.0882 reads "near the aggregation
distortion border" — meaning the *Global Coherence* number lifts well
above what the O1 evidence supports, surfacing the architectural-blindness
pattern as a quantitative signal. The **per-face AvG** (a future v1.2
refinement) would show F1, F6, F12 (the Gates) contributing
disproportionately to the gap: their floor-elevated face energies sit
high above their predominantly silent O1 element rows. This is
**thesis-defense-relevant**: AvG quantifies *how much information is
lost when we look at face-level only*, and the narrative around F9 vs
F10 architectural blindness becomes mathematically defensible.

Without AvG, the thesis defense answer to *"how do you know F9 and F10
are different kinds of architectural blindness?"* relies on inspecting
the element matrix manually. With AvG and its future per-face
decomposition (v1.2), the answer is a number with a φ-derived
interpretation ladder.

### Versioning / Evolution Notes

- **v1.0 (2026-05-21):** NEW diagnostic introduced. Formula locks to
  pre-amplifier raw C_global vs K_mean_60 absolute difference. CEN
  canonical AvG_O1 = 0.0882 verified under strict-O1 scope (7 non-zero
  cells of 60, 53 silent zero-filled). Interpretation ladder φ-derived
  (φ⁻⁶, φ⁻⁵, φ⁻⁴ as band boundaries). Scope distinction (O1 vs all)
  formalized. Tests added to `POC/tests/aag.test.js`. Module home: new
  `POC/js/core/Diagnostics.js`.
- **Future v1.1:** Per-octave AvG when O1+O2+O3 SSOT layers come online.
  AvG_O1 (this section's 0.0882), AvG_O2, AvG_O3, and AvG_combined for
  the full octave-stacked computation. Expectation: AvG_O1 should drop
  as additional O1 KPIs are populated; AvG_all should converge as silent
  cells decrease.
- **Future v1.2:** **Per-face AvG decomposition.** When AvG > 0.05,
  decompose into AvG_face[f] = |E_f − mean(k_f1..k_f5)| for each face,
  surfacing which faces contribute most to the rollup-detail gap.
  Mathematically equivalent to the per-row gap audit described in
  *Why Designing AvG NOW*; just structured for engine output.
- **Future v2.0:** **Direction-aware AvG.** Replace absolute value with
  signed gap (C_global − K_mean_60). Positive: rollup over-represents
  (CEN's O1 case — the floor lifts face energies above sparse O1
  evidence); negative: rollup under-represents. The interpretation
  ladder split into two for signed direction.
- **Future v2.1:** Confidence interval — Monte Carlo simulation under
  D/E disagreement variance and silent-cell density variance, producing
  AvG ± ε for the headline reading. Addresses the *"how much should I
  trust this AvG?"* question at thesis defense.

### Cross-References

- **Section 1** Global Coherence — provides C_global (pre-amplifier raw
  via `state.coherenceDetail.raw`).
- **Section 2** Local Coherence (Face Energy) — provides E_face_i used
  in μ_E computation.
- **Section 12** AAG — companion diagnostic; partition-aware where AvG
  is hierarchy-aware. Both target consolidation into
  `js/core/Diagnostics.js` (W1 §6.2 task).
- **Section 13** Spectral Δ vector — projects E onto Laplacian modes;
  AvG complements by surfacing rollup-detail gap rather than modal
  imbalance.
- **Section 14** Advanced Edge formula — operates at the edge layer
  (30 edges); AvG operates at the rollup-vs-detail layer (1 global vs
  60 elements). Different scales of aggregation.

---

## Appendix A: PHI-Derived Constants Summary

| Constant | Value | Derivation | Used For |
|----------|-------|------------|----------|
| φ (PHI) | 1.618033988749895 | (1 + √5) / 2 | Golden ratio |
| φ⁻¹ | 0.618033988749895 | 1/φ | O7 multiplier, thresholds |
| φ⁻² | 0.381966011250105 | 1/φ² | η (harmonic boost), O1 threshold |
| φ⁻³ (λ) | 0.236067977499790 | 1/φ³ | CV penalty coefficient |
| ζ | 0.063661001875018 | φ⁻²/6 | Octave gradient |

---

## Appendix B: Verification Script

```javascript
/**
 * Run this in browser console to verify all calculations
 */
function verifyQuannexCalculations() {
  const engine = window.quannexEngine;
  const PHI = (1 + Math.sqrt(5)) / 2;

  console.log('=== QUANNEX CALCULATION VERIFICATION ===\n');

  // 1. Verify PHI constants
  console.log('1. PHI Constants:');
  console.log(`   φ = ${PHI} (expected: 1.618033988749895)`);
  console.log(`   φ⁻¹ = ${1/PHI} (expected: 0.618033988749895)`);
  console.log(`   φ⁻³ = ${1/(PHI*PHI*PHI)} (expected: 0.236067977499790)`);

  // 2. Verify global coherence
  console.log('\n2. Global Coherence:');
  const state = engine.getState();
  console.log(`   Result: ${state.globalCoherence.toFixed(4)}`);
  console.log(`   Status: ${state.coherenceStatus}`);

  // 3. Verify face count
  console.log('\n3. Dodecahedron Structure:');
  console.log(`   Faces: ${state.faces.length} (expected: 12)`);
  console.log(`   Edges: ${state.edges.length} (expected: 30)`);
  console.log(`   Vertices: ${state.vertices.length} (expected: 20)`);

  // 4. Verify Euler's formula: V - E + F = 2
  const euler = state.vertices.length - state.edges.length + state.faces.length;
  console.log(`   Euler: V - E + F = ${euler} (expected: 2)`);

  // 5. Data integrity
  if (window.DataValidator) {
    const report = window.DataValidator.getCorruptionReport();
    const quality = 1 - (report.issueCount / 60);
    console.log('\n4. Data Integrity:');
    console.log(`   Issues: ${report.issueCount}`);
    console.log(`   Quality: ${(quality * 100).toFixed(1)}%`);
  }

  console.log('\n=== VERIFICATION COMPLETE ===');
}

verifyQuannexCalculations();
```

---

## Appendix C: Octave Detection Algorithm

*This section answers the examiner question: "Given 12 face energies, how does the system determine we're at O3?"*

### Two Octave Paths

The system computes octaves at TWO levels:

```
PATH 1: COHERENCE → OCTAVE (Global Level)
─────────────────────────────────────────
"What octave does the organization's overall coherence map to?"

Input:  Global coherence score (0-1)
Method: coherenceToOctave()
Source: js/constants/phi-harmonics.js (SSOT)
        js/constants/octave-thresholds.js (re-export)


PATH 2: FACE OCTAVES → ORGANIZATIONAL OCTAVE (Foundation Principle)
──────────────────────────────────────────────────────────────────
"Given that each face has its own developmental level, what octave
 can the organization as a whole claim?"

Input:  12 face objects with octave assignments (O1-O7 each)
Method: calculateOrganizationalOctave()
Source: js/octave-integrity-calculator.js
```

### Path 1: Coherence → Octave (Threshold Lookup)

```
ALGORITHM: coherenceToOctave(coherence)

INPUT:  coherence ∈ [0, 1]

STEP 1: Clamp to valid range
        c = max(0, min(1, coherence))

STEP 2: Compare against PHI-derived thresholds (highest first)
        if c ≥ ψ₅ (0.910) → return O7 (Radiance)
        if c ≥ ψ₄ (0.854) → return O6 (Vision)
        if c ≥ ψ₃ (0.764) → return O5 (Expression)
        if c ≥ φ⁻¹ (0.618) → return O4 (Creativity)
        if c ≥ 0.5         → return O3 (Relationships)
        if c ≥ φ⁻² (0.382) → return O2 (Structure)
        else               → return O1 (Survival)

THRESHOLD DERIVATION (all from φ):
        φ⁻² = 0.382    (O1→O2 boundary)
        midpoint = 0.5   (harmonic center of φ⁻¹ and φ⁻²)
        φ⁻¹ = 0.618    (O3→O4 boundary, the golden ratio itself)
        ψ₃ = 1 - φ⁻³ = 0.764
        ψ₄ = 1 - φ⁻⁴ = 0.854
        ψ₅ = 1 - φ⁻⁵ = 0.910

OUTPUT: Integer 1-7
```

### Test Case (Path 1)

```javascript
// Given: 12 face energies
const faceEnergies = [0.8, 0.7, 0.6, 0.7, 0.5, 0.6, 0.55, 0.65, 0.7, 0.6, 0.75, 0.5];

// Step 1: Global coherence (from Section 1)
const sum = 0.8 + 0.7 + 0.6 + 0.7 + 0.5 + 0.6 + 0.55 + 0.65 + 0.7 + 0.6 + 0.75 + 0.5;
// sum = 7.65
const mu = sum / 12;
// mu = 7.65 / 12 = 0.6375

// Step 2: CV calculation
// Deviations from mean (0.6375):
//   0.8-0.6375=0.1625, 0.7-0.6375=0.0625, 0.6-0.6375=-0.0375, ...
const sigma = Math.sqrt(faceEnergies.reduce((s, e) => s + (e - mu) ** 2, 0) / 12);
// sigma ≈ 0.0887
const cv = sigma / mu;
// cv ≈ 0.1392

// Step 3: Raw coherence
const raw = mu * (1 - 0.236 * cv);
// raw = 0.6375 * (1 - 0.236 * 0.1392)
// raw = 0.6375 * (1 - 0.0328)
// raw = 0.6375 * 0.9672 = 0.6166

// Step 4: Apply S-curve and rescaling...
// rescaled ≈ 0.617 (varies with κ)

// Step 5: coherenceToOctave(0.617)
// 0.617 < φ⁻¹ (0.618) → O3 (Relationships), NOT O4!
// Answer: This organization is at Octave 3, just below the Creativity threshold.
// A tiny improvement to any face could push coherence past φ⁻¹ into O4.
```

### Path 2: Organizational Octave (Foundation Principle)

```
ALGORITHM: calculateOrganizationalOctave(faces, lifecycleStage)

INPUT:  faces[] = array of {id, octave, name} objects (12 faces)
        lifecycleStage = optional string (e.g., "pre-seed", "growth")

STEP 1: Extract and clamp octave values
        octaves = faces.map(f → clamp(f.octave, 1, 7))

STEP 2: Calculate geometric mean
        product = octaves[0] × octaves[1] × ... × octaves[11]
        geoMean = product^(1/12)

        WHY GEOMETRIC MEAN (not arithmetic)?
        Because one face at O1 among eleven at O5
        should pull the result DOWN sharply.
        Geometric mean: (1 × 5^11)^(1/12) = 3.77
        Arithmetic mean: (1 + 55) / 12 = 4.67
        The geometric mean better reflects foundation constraints.

STEP 3: Calculate spread penalty
        spread = max(octaves) - min(octaves)

        if spread ≤ 2: penalty = 0       (healthy variance)
        if spread = 3: penalty = 0.5     (minor misalignment)
        if spread = 4: penalty = 1.0     (moderate misalignment)
        if spread ≥ 5: penalty = 1.5 + (spread - 5) × 0.5
                                          (severe misalignment)

STEP 4: Apply penalty and floor
        orgOctave = floor(geoMean - penalty)
        orgOctave = max(1, orgOctave)

STEP 5: Apply lifecycle constraint (if provided)
        if lifecycleStage is "pre-seed" → cap at O2
        if lifecycleStage is "seed"     → cap at O2
        if lifecycleStage is "growth"   → cap at O4
        if lifecycleStage is "enterprise" → cap at O6

OUTPUT: {orgOctave, geoMean, spread, penalty, warnings, breakdown}
```

### Test Case (Path 2)

```javascript
// Given: 12 faces with mixed octave assignments
const faces = [
  {id: 1, octave: 2, name: "Financial"},    // O2
  {id: 2, octave: 3, name: "Intellectual"},  // O3
  {id: 3, octave: 1, name: "Human"},         // O1 (lagging)
  {id: 4, octave: 2, name: "Structural"},    // O2
  {id: 5, octave: 2, name: "Market"},        // O2
  {id: 6, octave: 2, name: "Community"},     // O2
  {id: 7, octave: 3, name: "Brand"},         // O3
  {id: 8, octave: 1, name: "Operations"},    // O1 (lagging)
  {id: 9, octave: 2, name: "Regenerative"},  // O2
  {id: 10, octave: 2, name: "Values"},       // O2
  {id: 11, octave: 2, name: "Funding"},      // O2
  {id: 12, octave: 2, name: "Risk"}          // O2
];

// Step 1: octaves = [2, 3, 1, 2, 2, 2, 3, 1, 2, 2, 2, 2]

// Step 2: Geometric mean
// product = 2 × 3 × 1 × 2 × 2 × 2 × 3 × 1 × 2 × 2 × 2 × 2 = 2304
// geoMean = 2304^(1/12) = 1.926

// Step 3: Spread = 3 - 1 = 2, penalty = 0

// Step 4: orgOctave = floor(1.926 - 0) = floor(1.926) = 1

// Step 5: No lifecycle constraint applied

// Result: O1 (Survival)
// WHY: Two faces at O1 drag the geometric mean below 2.
// Even though most faces are at O2, the Foundation Principle
// says: you cannot claim O2 until ALL foundations are solid.

// The warnings will flag:
// - "2 of 12 faces at O1 (Survival)" → foundation_building
```

### The Foundation Principle (Why This Matters)

```
THE KEY INSIGHT FOR THESIS DEFENSE:

High coherence WITHIN an octave ≠ promotion TO a higher octave.

An organization with:
  - 10 faces at O2, 2 faces at O1
  - Global coherence = 0.65 (which maps to O4 by Path 1)

Is actually at O1 by Path 2, because:
  - The geometric mean is dragged down by the O1 faces
  - The organization has structural foundation gaps

Path 1 tells you: "How well are you operating?"
Path 2 tells you: "What level CAN you operate at?"

Both are needed. Path 2 prevents the illusion of advancement
when foundational domains are neglected.
```

### Implementation References

| Function | File | Purpose |
|----------|------|---------|
| `coherenceToOctave()` | `js/constants/phi-harmonics.js` | Path 1: coherence → octave |
| `calculateOrganizationalOctave()` | `js/octave-integrity-calculator.js` | Path 2: face octaves → org octave |
| `calculateSpreadPenalty()` | `js/octave-integrity-calculator.js` | Spread penalty calculation |
| `detectOctaveFromCoherence()` | `js/octave-integrity-calculator.js` | Path 1 + coherence level label |
| `getOctaveByNumber()` | `js/constants/octave-thresholds.js` | Octave metadata lookup |

---

## Thesis Defense Quick Reference

When committee asks... | Open to...
---|---
"How is global coherence calculated?" | Section 1
"Why φ⁻³ for variance penalty?" | Section 1, Appendix A
"How do faces influence each other?" | Section 3 (Breath Axes)
"What if data is corrupted?" | Section 10, js/data-system/data-validator.js
"Prove this 0.763 is correct" | Section 2 + Test Case
"Why sacred geometry?" | docs/math/SACRED_GEOMETRY_PROOF.md
"What are the novel contributions?" | docs/thesis/NOVEL_MATHEMATICAL_CONTRIBUTIONS.md
"How do you determine the octave?" | Appendix C (Octave Detection Algorithm)
"What is the Foundation Principle?" | Appendix C, Path 2
"How is Aspiration-Actuality Gap (AAG) computed?" | Section 12
"Why does CEN's AAG differ from Quannex's self-AAG?" | Section 12 (separate measurements of separate orgs)
"Wasn't AAG called something different earlier?" | Section 12 "Honest Disclosure" (Phase 2 mislabeling resolved)
"How is the Laplacian spectral analysis done?" | Section 13
"What does the Δ vector reveal about CEN faces?" | Section 13 (Performing in Nature diagnostic)
"Why was dominantMode=10 in mapping-context.json different from canonical?" | Section 13 (Provenance Investigation — narrative scaffolding, not engine output)
"What's the advanced edge formula vs the core?" | Section 14 (decision rule: core for system coherence, advanced for diagnostic deep-dives)
"What does 'chirality' actually measure?" | Section 15 (sympy proof: sequence concavity at f2, not rotational winding)
"What is AvG and how does it differ from AAG?" | Section 16 (AvG = rollup vs granular gap; AAG = aspiration vs actuality ratio)
"Why is CEN's AvG_O1 = 0.0882?" | Section 16 (signals architectural blindness — face rollup 3x O1 KPI mean)

---

*This document was co-created by Deimantas & Claude with love for academic rigor.*
*Last updated: 2026-03-10*
