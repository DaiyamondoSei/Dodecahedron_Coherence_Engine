# 📐 Quannex Math Overview

**Quick Reference for Core Concepts**

*Start here if you're new to Quannex mathematics*

---

## Purpose of This Document

This is your **entry point** to understanding Quannex's mathematical framework. Think of it as the "map before the territory" - a high-level overview before diving into specific formulas.

**After reading this, explore:**
- [PENTAGRAM_ANALYSIS.md](PENTAGRAM_ANALYSIS.md) - How we calculate harmonic resonance
- [BREATH_DYNAMICS.md](BREATH_DYNAMICS.md) - The 6 breath axes and flow balance
- [OCTAVE_FRAMEWORK.md](OCTAVE_FRAMEWORK.md) - 7 developmental stages
- [FOUNDATION_PRINCIPLE.md](FOUNDATION_PRINCIPLE.md) - Why coherence ≠ promotion (critical insight!)
- [SPECTRAL_SHADOW.md](SPECTRAL_SHADOW.md) - Advanced analysis techniques

---

## The Core Question

**Traditional dashboards ask:** "How much?"
- How much revenue?
- How much growth?
- How much profit?

**Quannex asks:** "How well do parts work together?"
- Is revenue growth sustainable given team capacity?
- Is innovation balanced with operational stability?
- Are stated values aligned with actual behavior?

This is the shift from **magnitude** to **coherence**.

---

## Three Pillars of Coherence

```
Global Coherence = f(Individual Health, Relational Harmony, Structural Integrity)
                    ↓                    ↓                  ↓
                Face Energy         Edge Tension        Vertex Vortex
```

### 1. Individual Health (Face Energy)
**Question:** Is each organizational domain healthy on its own?

**Measures:**
- Each of 12 faces has 5 elemental KPIs
- Pentagram analysis finds harmony among elements
- Face energy = base health × harmonic boost

**See:** [PENTAGRAM_ANALYSIS.md](PENTAGRAM_ANALYSIS.md)

### 2. Relational Harmony (Edge Tension)
**Question:** Do domains work well together?

**Measures:**
- 30 edges connect the 12 faces
- Each edge has a relationship KPI
- Breath analysis checks for sustainable flow (6 axes)

**See:** [BREATH_DYNAMICS.md](BREATH_DYNAMICS.md)

### 3. Structural Integrity (Vertex Vortex)
**Question:** Where are the transformation leverage points?

**Measures:**
- 20 vertices where 3 faces meet
- Vortex potential based on face energy variance
- High variance = transformation opportunity

**See:** [OCTAVE_FRAMEWORK.md](OCTAVE_FRAMEWORK.md)

---

## Sacred Geometry Foundation

### Why the Dodecahedron?

The dodecahedron is the most complex Platonic solid:
- **12 pentagonal faces** → 12 organizational domains
- **30 edges** → 30 relationships
- **20 vertices** → 20 transformation points

### Why Pentagrams?

Each face is a **pentagon** (5 sides), which creates natural pentagram geometry:
- **5 elements**: Earth, Water, Fire, Air, Ether
- **5 KPIs** per face, one per element
- **Pentagram star** reveals harmonic relationships

### Why Golden Ratio (φ)?

```
φ = (1 + √5) / 2 ≈ 1.618033988749895
```

The golden ratio appears in:
- Natural growth patterns (spirals, flowers, DNA)
- Harmonic proportions (music, art)
- **Quannex tuning constants** (harmony rewards)

---

## KPI Normalization (Quick Reference)

All KPIs must be normalized to 0-1 scale before calculations.

### Type 1: ↑ Up is Better

**Examples:** Revenue, customer satisfaction, team morale

**Formula:**
```
         value - target_min
N(v) = ──────────────────────
        target_ideal - target_min

Capped: N(v) ∈ [0, 1]
```

**Quick Check:**
- At `target_min` → Score = 0.0
- At `target_ideal` → Score = 1.0
- Above `target_ideal` → Score = 1.0 (capped)

---

### Type 2: ↓ Down is Better

**Examples:** Turnover rate, cost per acquisition, error rate

**Formula:**
```
              value - target_min
N(v) = 1 - ──────────────────────
            absolute_max - target_min

Capped: N(v) ∈ [0, 1]
```

**Quick Check:**
- At `target_min` → Score = 1.0 (ideal - as low as possible)
- At `absolute_max` → Score = 0.0 (worst case)

---

### Type 3: Band (Sweet Spot)

**Examples:** Meeting frequency, work-life balance, inventory levels

**Formula:**
```
Inside plateau [healthy_min, healthy_max]:
    N(v) = 1.0

Below plateau [target_min, healthy_min):
             value - target_min
    N(v) = ──────────────────────
            healthy_min - target_min

Above plateau (healthy_max, absolute_max]:
                  value - healthy_max
    N(v) = 1 - ──────────────────────
                absolute_max - healthy_max

Capped: N(v) ∈ [0, 1]
```

**Quick Check:**
- Too low → Score increases toward 1.0
- In sweet spot → Score = 1.0
- Too high → Score decreases toward 0.0

**Example: Meeting Hours Per Week**
```
target_min = 0 hours (no meetings at all)
healthy_min = 4 hours (minimum needed)
healthy_max = 8 hours (maximum before overhead)
absolute_max = 20 hours (all meetings, no work!)

Value = 6 hours → N(6) = 1.0 (perfect, in plateau)
Value = 2 hours → N(2) = 0.5 (below minimum, only halfway)
Value = 15 hours → N(15) = 0.58 (too many, performance drops)
```

---

## The Calculation Flow

Here's how data becomes coherence:

```
1. Load Raw KPIs (60 total: 5 per face × 12 faces)
   ↓
2. Normalize Each KPI → Score ∈ [0, 1]
   ↓
3. Group by Face (12 groups of 5)
   ↓
4. Pentagram Analysis → Find Harmonic Resonance
   ↓
5. Face Energy = Weighted Average × (1 + Harmonic Boost)
   ↓
6. Breath Analysis → Check 6 Axes for Balance
   ↓
7. Edge Tension = Relationship Health
   ↓
8. Vertex Vortex = Transformation Potential
   ↓
9. Global Coherence = Weighted(Faces, Edges, Vertices)
```

**See [PENTAGRAM_ANALYSIS.md](PENTAGRAM_ANALYSIS.md) for step-by-step walkthrough**

---

## Key Formulas (One-Page Cheat Sheet)

### Face Energy
```
E_face = E_base × (1 + α × R_harmonic)

Where:
- E_base = Weighted average of 5 KPIs
- R_harmonic = Pentagram resonance score ∈ [0, 1]
- α = 0.3 (30% boost for perfect harmony)
```

### Pentagram Harmonic Resonance
```
R_harmonic = 1 - (variance / max_variance)

Where variance is calculated from pentagram star pair distances
```

### Global Coherence
```
C_global = 0.4 × AvgFaceEnergy +
           0.3 × AvgEdgeHealth +
           0.3 × AvgVertexCoherence
```

### Breath Ratio (6 Axes)
```
Ratio = Energy(Projection) / Energy(Reception)

Balanced: 0.8 ≤ Ratio ≤ 1.2
Over-exhaling: Ratio > 1.2 (burnout risk)
Over-inhaling: Ratio < 0.8 (stagnation risk)
```

### PHI-Based Octave Thresholds
```
coherence < 0.382 (φ⁻²)  → O1 Survival
0.382 ≤ c < 0.500        → O2 Structure
0.500 ≤ c < 0.618 (φ⁻¹)  → O3 Relationships
0.618 ≤ c < 0.764        → O4 Creativity
0.764 ≤ c < 0.854        → O5 Expression
0.854 ≤ c < 0.950        → O6 Vision
coherence ≥ 0.950        → O7 Radiance

Where: φ = 1.618033988749895 (Golden Ratio)
```

### Organizational Octave (Foundation Principle)
```
Org_Octave = floor(GeometricMean(face_octaves) - SpreadPenalty)

GeometricMean = (∏ face_octaves)^(1/12)

SpreadPenalty:
  spread ≤ 2: 0
  spread = 3: 0.5
  spread = 4: 1.0
  spread ≥ 5: 1.5 + (spread - 5) × 0.5

Clamped: 1 ≤ Org_Octave ≤ LifecycleMax
```

**Key Insight:** High coherence at O1 = excellent survival, NOT promotion to O2.
See [FOUNDATION_PRINCIPLE.md](FOUNDATION_PRINCIPLE.md) for the full treatment.

---

## What Makes This Different?

### Traditional OKRs/KPIs:
- Linear thinking (more is better)
- Isolated metrics (revenue vs. team health are separate)
- No relational awareness (doesn't detect harmony vs. discord)

### Quannex Coherence:
- **Non-linear rewards** (extreme variance penalized via pentagram)
- **Relational intelligence** (edges measure how well domains connect)
- **Harmonic thinking** (5 elements must thrive together)
- **Sustainable flow** (breath analysis prevents burnout)

---

## Philosophy Encoded in Math

Every formula carries philosophical meaning:

### Variance Penalties → "Harmony Over Power"
```
Perfect pentagram (all 5 elements equal) → Maximum resonance boost
Unbalanced pentagram (one dominant) → Resonance penalty
```

**Why?** Sustainable organizations grow all parts together, not just one function.

### Breath Ratios → "Sustainable Rhythm"
```
Balanced inhale/exhale → Healthy flow
Over-exhaling → Burnout, depletion
Over-inhaling → Stagnation, accumulation
```

**Why?** Organizations are living systems that need rest, integration, and cyclical flow.

### Golden Ratio Tuning → "Natural Growth"
```
α (harmonic boost) = 0.3 ≈ φ/5
γ (blending constant) = 0.7 ≈ 1 - φ/5
```

**Why?** Nature uses φ for sustainable, beautiful growth. We mirror that.

---

## Common Questions

### Q: Why 5 elements per face?
**A:** Pentagon geometry. Each face is a 5-sided pentagon, creating natural pentagram star patterns. Also maps to classical elements (Earth, Water, Fire, Air, Ether) from wisdom traditions.

### Q: Why penalize variance?
**A:** Real organizational health requires **balance**. A company with amazing marketing but failing operations will collapse. Pentagram math encodes "all elements must thrive together."

### Q: What's the minimum data needed?
**A:**
- **Quick mode:** 12 KPIs (1 per face, no pentagram analysis)
- **Full mode:** 60 KPIs (5 per face, full harmonic analysis)

### Q: Can I use this with my existing KPIs?
**A:** Yes! Map your KPIs to the 12 faces and 5 elements. The [demo-orchestrator.html](../demo-orchestrator.html) wizard helps with this.

---

## Next Steps

**To understand the core math:**
1. Read this overview (you just did! ✅)
2. Read [PENTAGRAM_ANALYSIS.md](PENTAGRAM_ANALYSIS.md) - The heart of harmonic calculation
3. Read [BREATH_DYNAMICS.md](BREATH_DYNAMICS.md) - Flow and balance
4. Read [OCTAVE_FRAMEWORK.md](OCTAVE_FRAMEWORK.md) for developmental progression
5. **Essential:** [FOUNDATION_PRINCIPLE.md](FOUNDATION_PRINCIPLE.md) - Why coherence ≠ promotion
6. Advanced: [SPECTRAL_SHADOW.md](SPECTRAL_SHADOW.md) for leverage points and ethics

**To see it in action:**
1. Open [../DEMO.html](../DEMO.html)
2. Load "Quannex" company
3. Look at calculations while reading formulas
4. It will click! 💡

---

**Questions?** See [../DEMO_GUIDE.md](../DEMO_GUIDE.md) for walkthroughs

**Ready for deep dive?** Continue to [PENTAGRAM_ANALYSIS.md](PENTAGRAM_ANALYSIS.md)

---

*Created: 2025-01-16 | Updated: 2025-12-09 | Part of Quannex Mathematical Framework*
