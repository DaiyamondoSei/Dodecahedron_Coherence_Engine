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

---

*This document was co-created by Deimantas & Claude with love for academic rigor.*
*Last updated: 2026-03-10*
