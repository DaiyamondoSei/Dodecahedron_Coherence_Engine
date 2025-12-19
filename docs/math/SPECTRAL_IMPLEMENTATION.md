# Spectral Analysis Implementation

> *How the Graph Laplacian Reveals Organizational Coherence*
> *For Thesis Defense: February 2026*

---

## Overview

Spectral analysis transforms organizational data into a "frequency domain" that reveals hidden patterns of coherence and dissonance. This document explains the mathematical implementation.

---

## The Core Insight

Organizations are not just collections of metrics - they are **connected systems**. The dodecahedron's topology (which faces share edges) determines how imbalances propagate.

Spectral analysis asks: "Given this connectivity pattern, what are the natural vibration modes of the system?"

---

## Mathematical Foundation

### Step 1: The Graph Laplacian (L)

The Graph Laplacian encodes connectivity:

```
L = D - A
```

Where:
- **D** = Degree matrix (diagonal: how many neighbors each face has)
- **A** = Adjacency matrix (1 if faces share an edge, 0 otherwise)

For the dodecahedron:
- Each face has exactly 5 neighbors
- D has 5 on every diagonal entry
- L[i][j] = -1 if faces i and j share an edge

**The 12×12 Laplacian Matrix:**

```
     Face:  1   2   3   4   5   6   7   8   9  10  11  12
         ┌────────────────────────────────────────────────┐
Face 1   │  5  -1   0   0  -1  -1   0  -1  -1   0   0   0 │
Face 2   │ -1   5  -1   0   0  -1   0   0  -1  -1   0   0 │
Face 3   │  0  -1   5  -1   0  -1   0   0   0  -1  -1   0 │
Face 4   │  0   0  -1   5  -1  -1  -1   0   0   0  -1   0 │
Face 5   │ -1   0   0  -1   5  -1  -1  -1   0   0   0   0 │
Face 6   │ -1  -1  -1  -1  -1   5   0   0   0   0   0   0 │
Face 7   │  0   0   0  -1  -1   0   5  -1   0   0  -1  -1 │
Face 8   │ -1   0   0   0  -1   0  -1   5  -1   0   0  -1 │
Face 9   │ -1  -1   0   0   0   0   0  -1   5  -1   0  -1 │
Face 10  │  0  -1  -1   0   0   0   0   0  -1   5  -1  -1 │
Face 11  │  0   0  -1  -1   0   0  -1   0   0  -1   5  -1 │
Face 12  │  0   0   0   0   0   0  -1  -1  -1  -1  -1   5 │
         └────────────────────────────────────────────────┘
```

---

### Step 2: Eigenvalue Decomposition

Solving the eigenvalue equation:

```
L × u = λ × u
```

Yields:
- **12 eigenvalues (λ)** - the "frequencies" of vibration modes
- **12 eigenvectors (u)** - the "shapes" of each mode

**Dodecahedron Eigenvalues:**

| Mode | Eigenvalue (λ) | Interpretation |
|------|----------------|----------------|
| 1 | 0.000 | DC Offset (average) - skip this |
| 2-4 | 2.394 | **Global patterns** - whole-system imbalance |
| 5-7 | 5.584 | **Regional patterns** - clusters of faces |
| 8-9 | 6.854 | **Local oscillations** - adjacent face differences |
| 10-12 | 8.146 | **Fine-grained** - subtle dissonance |

**Key Property:** The dodecahedron has degenerate eigenvalues (multiplicity 3 for most modes) due to its high symmetry. This means multiple independent vibration patterns exist at each frequency.

---

### Step 3: Modal Amplitude Calculation

Given a vector of face energies **E** = [E₁, E₂, ..., E₁₂], we project onto each mode:

```
aᵢ = uᵢᵀ × E
```

Where:
- **aᵢ** = modal amplitude (how much mode i contributes to current state)
- **uᵢ** = i-th eigenvector (column of U matrix)
- **E** = face energy vector

**Interpretation:**
- Large |aᵢ| means this mode is strongly present
- Positive aᵢ means energy aligns with eigenvector direction
- Negative aᵢ means energy opposes eigenvector direction

---

### Step 4: Dominant Mode Identification

Skip Mode 1 (DC offset - just the average) and find:

```
dominant mode = argmax(|aᵢ|) for i > 1
```

The dominant mode tells us the **primary pattern of imbalance**:
- Low-frequency dominant → Global, systemic issue
- High-frequency dominant → Local, targeted issue

---

### Step 5: Delta Vector Calculation

The delta vector prescribes rebalancing:

```
Δ = -u_dominant × a_dominant
```

For each face:
- **Δᵢ > 0** → Face needs MORE energy
- **Δᵢ < 0** → Face has EXCESS energy
- **Δᵢ ≈ 0** → Face is balanced

This is the mathematical "prescription" for organizational healing.

---

## Diagnostic Metrics

### Being-Action Balance (BAB) Score

Organizations oscillate between **Being** (receiving, planning, regeneration) and **Action** (executing, projecting, expending).

The six breath axes define projection/reception poles:
- **Projection Faces:** 4, 5, 6, 7, 8, 11 (Action/Exhale)
- **Reception Faces:** 1, 2, 3, 9, 10, 12 (Being/Inhale)

```
BAB = (Average Reception Energy / Average Projection Energy) × 100%
```

**Interpretation:**
- BAB > 120% = Over-inhaling (too much planning, not enough action)
- BAB < 80% = Over-exhaling (burnout risk, no regeneration)
- BAB ≈ 100% = Healthy balance

---

### Dissonance Index

Measures total systemic imbalance:

```
Dissonance = Σ(|Δᵢ| × Eᵢ) / Σ|Δᵢ|
```

Weighted by energy because imbalance matters more in high-energy faces.

**Interpretation:**
- > 30% = HIGH - Significant systemic issues
- 15-30% = MODERATE - Some imbalances
- 5-15% = LOW - Minor issues
- < 5% = MINIMAL - Highly coherent

---

## Why This Works

### Physical Intuition

Imagine the dodecahedron as a physical structure with springs connecting adjacent faces. Each face has a "mass" proportional to its energy.

The eigenvalues are the natural frequencies at which this structure vibrates. The eigenvectors describe the shape of each vibration mode.

When the organization is "disturbed" (some faces have more energy than others), it vibrates in these natural modes. The spectral analysis identifies which mode is dominant and prescribes how to restore equilibrium.

### Mathematical Guarantee

The Graph Laplacian is:
- **Symmetric** → Real eigenvalues
- **Positive semi-definite** → Non-negative eigenvalues
- **Zero row/column sums** → λ₁ = 0 always (DC mode)

The second eigenvalue (λ₂ = 2.394, the "Fiedler value") measures how easily the graph can be split in two. For the dodecahedron, this relatively high value indicates strong connectivity - the system resists partition.

---

## Implementation Notes

### Computational Complexity

The analysis is O(n) where n = 12 faces:
- Matrix-vector multiply: 12×12 = 144 ops
- Dot products: 12×12 = 144 ops
- Total: ~300 operations per analysis

The eigenvalue decomposition is precomputed (the U matrix is hardcoded). No runtime matrix inversion needed.

### Eigenvector Normalization

The hardcoded U matrix values have small rounding errors. We normalize on construction:

```javascript
// For each mode (skipping DC):
for (let col = 1; col < 12; col++) {
    const mean = sum(U[*][col]) / 12;
    for (let row = 0; row < 12; row++) {
        U[row][col] -= mean;  // Center to remove DC component
    }
}
```

This ensures eigenvectors are orthogonal to the DC mode.

---

## Connection to Coherence

The spectral analysis outputs feed into global coherence:

1. **Face energies** → Calculated from pentagram analysis
2. **Modal amplitudes** → Spectral decomposition
3. **Dissonance index** → Coherence penalty
4. **Global coherence** = Base coherence × (1 - Dissonance penalty)

High dissonance reduces coherence. The system rewards balance.

---

## Future Research Directions

1. **Dynamic Analysis** - Track modal evolution over time
2. **Intervention Planning** - Optimize delta vector for resource constraints
3. **Sensitivity Analysis** - Which faces have highest leverage?
4. **Multi-Scale Analysis** - Combine face, edge, and vertex spectra

---

## References

- Chung, Fan R. K. *Spectral Graph Theory* (1997)
- Fiedler, Miroslav. "Algebraic connectivity of graphs" (1973)
- Newman, Mark. *Networks: An Introduction* (2010)

---

*This document explains the implementation. For philosophical grounding, see WISDOM_BRIEF.md. For code details, see js/spectral-analyzer.js header.*
