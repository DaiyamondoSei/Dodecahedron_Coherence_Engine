# 🌌 Spectral & Shadow Analysis

**Advanced Techniques: Leverage Points & Ethical Patterns**

*Two sophisticated methods for finding hidden insights - eigenvalue analysis and hypocrisy detection.*

---

## Status: Backend-Only Features

**Important:** These features are **not yet implemented** in the browser-based POC. They require:
- **Spectral Analysis:** Math.js library (eigenvalue decomposition)
- **Shadow Detection:** Complex pattern matching algorithms

Both exist in `POC/backend-fallback/models/` and can be integrated later.

---

## Part 1: Spectral Graph Theory

### The Core Question

**"If I could improve only ONE KPI, which would have the biggest ripple effect?"**

Traditional analysis: Compare KPI weights (highest weight = most important)

**Spectral analysis:** Model the organization as a **graph**, find **eigenvalues** to reveal **true leverage points**.

---

### The Graph Model

```
Nodes (Vertices): 12 faces
Edges: 30 relationships
Weights: Edge tension values

Example:
Face 1 (Financial) ←──[0.85]──→ Face 3 (Human)
Face 2 (Intellectual) ←──[0.62]──→ Face 5 (Market)
... (30 total edges)
```

**Graph Laplacian Matrix** (L):
```
L = D - A

Where:
- D = Degree matrix (diagonal, how many connections each node has)
- A = Adjacency matrix (which nodes connect to which)
```

---

### Eigenvalue Decomposition

**Formula:**
```
L·v = λ·v

Where:
- L = Graph Laplacian
- v = Eigenvector (direction of maximum influence)
- λ = Eigenvalue (magnitude of influence)
```

**The Magic:**
- Smallest non-zero eigenvalue (λ₂) → **algebraic connectivity**
- Corresponding eigenvector (v₂) → **Fiedler vector**
- Components of v₂ → **Relative importance of each face**

**Interpretation:**
```
v₂ = [0.12, -0.28, 0.45, -0.08, 0.31, ...]
        ↑     ↑      ↑      ↑      ↑
      Face1 Face2  Face3  Face4  Face5

Face 3 has highest component (0.45) → Highest leverage!
Improving Face 3 will ripple most strongly through the network.
```

---

### Example: Startup Analysis

**Company:** Pre-seed startup, 48% coherence

**Traditional analysis:**
```
Face energies:
1. Financial: 0.45 (weak)
2. Intellectual: 0.72 (strong)
3. Human: 0.58 (moderate)
4. Structural: 0.40 (weak)
5. Market: 0.35 (weakest!)
...

Conclusion: Fix Face 5 (Market) - it's the weakest!
```

**Spectral analysis:**
```
Graph Laplacian eigendecomposition:

λ₁ = 0 (always zero for connected graph)
λ₂ = 0.23 (algebraic connectivity - graph is moderately connected)

Fiedler vector v₂:
[0.12, -0.18, 0.42, 0.08, -0.25, 0.19, ...]
   ↑            ↑              ↑
 Face1        Face3         Face5

Face 3 (Human) has highest component (0.42)

Conclusion: Fix Face 3 (Human), NOT Face 5!
- Face 3 is central in the network
- Improving team health will boost Financial, Structural, and Market faces
- Market is weak BECAUSE Human is weak (team can't execute)
```

**Prescription:**
1. Invest in team (Face 3)
2. This will unlock execution capacity
3. Execution will improve market traction (Face 5)
4. Revenue will follow

**Result:** Leverage point found - fix Human Capital first, everything else improves.

---

### Implementation (Backend)

```javascript
// POC/backend-fallback/models/SpectralAnalyzer.js

const math = require('mathjs');

class SpectralAnalyzer {
  constructor(dodecahedron) {
    this.dodecahedron = dodecahedron;
  }

  buildLaplacian() {
    const n = 12; // 12 faces
    const A = math.zeros(n, n); // Adjacency matrix
    const D = math.zeros(n, n); // Degree matrix

    // Build adjacency matrix from edges
    this.dodecahedron.edges.forEach(edge => {
      const i = edge.faceA.id - 1;
      const j = edge.faceB.id - 1;
      const weight = 1 - edge.tension; // Lower tension = stronger connection

      A.set([i, j], weight);
      A.set([j, i], weight);
    });

    // Build degree matrix (sum of connections per node)
    for (let i = 0; i < n; i++) {
      let degree = 0;
      for (let j = 0; j < n; j++) {
        degree += A.get([i, j]);
      }
      D.set([i, i], degree);
    }

    // Laplacian = D - A
    return math.subtract(D, A);
  }

  findLeveragePoint() {
    const L = this.buildLaplacian();

    // Eigendecomposition
    const { values, vectors } = math.eigs(L);

    // Find second-smallest eigenvalue (λ₂)
    const sorted = values.map((v, i) => ({ value: v, index: i }))
      .sort((a, b) => a.value - b.value);

    const fiedler = vectors.column(sorted[1].index);

    // Find face with max component
    const maxIndex = fiedler.indexOf(math.max(math.abs(fiedler)));

    return {
      leverageFace: this.dodecahedron.getFace(maxIndex + 1),
      connectivity: sorted[1].value,
      fiedlerVector: fiedler
    };
  }
}
```

---

## Part 2: Shadow Detection

### The Core Question

**"Where are we being hypocritical? Where do stated values contradict actual behavior?"**

**Shadow** = Unconscious patterns where we say one thing but do another.

---

### The 6 Shadow Patterns

#### 1. **Burnout Engine**
**Stated:** "We value work-life balance and sustainability"
**Actual:**
- Face 3 (Human): Low scores on rest, recovery, PTO usage
- Face 9 (Regenerative): Low adaptability, high rigidity
- Breath Axis 3 (Being/Doing): Ratio > 1.5 (over-exhaling)

**Detection:**
```javascript
if (humanCapital.restScore < 0.4 &&
    regenerativeFlow.adaptability < 0.5 &&
    breathAxis3.ratio > 1.5) {
  shadowPattern = "Burnout Engine";
  severity = "High";
}
```

---

#### 2. **Greenwashing**
**Stated:** "We're a regenerative, sustainable company"
**Actual:**
- Face 9 (Regenerative Flow): High self-reported scores
- Face 1 (Financial): All metrics focus on short-term profit
- Face 10 (Values): Sustainability values stated but not in OKRs

**Detection:**
```javascript
if (regenerativeFlow.energy > 0.8 &&
    financialCapital.longTermThinking < 0.4 &&
    !kpis.some(k => k.name.includes('sustainability'))) {
  shadowPattern = "Greenwashing";
  severity = "Medium";
}
```

---

#### 3. **Lonely Hero**
**Stated:** "We're building a team and scaling"
**Actual:**
- Face 3 (Human): Bus factor = 1 (one person critical)
- Face 4 (Structural): Undocumented processes, knowledge in one head
- Face 8 (Operations): Output depends on single individual

**Detection:**
```javascript
if (humanCapital.busFactor == 1 &&
    structuralCapital.documentation < 0.3 &&
    operations.dependencyOnIndividual > 0.8) {
  shadowPattern = "Lonely Hero";
  severity = "High";
  risk = "Single point of failure";
}
```

**Example:** Quannex (Deimantas solo building everything)

---

#### 4. **Innovation Theater**
**Stated:** "We're innovative and R&D-driven"
**Actual:**
- Face 2 (Intellectual): High budget allocated to R&D
- Face 8 (Operations): Zero new products shipped in 12 months
- Face 5 (Market): Customer feedback ignored

**Detection:**
```javascript
if (intellectualCapital.rdBudget > 0.7 &&
    operations.newProductsShipped == 0 &&
    marketResonance.customerFeedbackIntegration < 0.3) {
  shadowPattern = "Innovation Theater";
  message = "Talking about innovation, not doing it";
}
```

---

#### 5. **Values Veneer**
**Stated:** "Our values are X, Y, Z"
**Actual:**
- Face 10 (Foundational Values): Beautiful values doc exists
- Face 3 (Human): Hiring/firing decisions ignore stated values
- Face 2 (Leadership): Exec behavior contradicts values

**Detection:**
```javascript
if (foundationalValues.articulation > 0.8 &&
    humanCapital.valuesBasedHiring < 0.4 &&
    leadership.valuesAlignment < 0.5) {
  shadowPattern = "Values Veneer";
  message = "Values on website, not in decisions";
}
```

---

#### 6. **Aspiration-Actuality Gap** (The Quannex Shadow)
**Stated:** "We're a visionary, world-changing company"
**Actual:**
- Face 10 (Values): O6-O7 vision articulated
- Face 1 (Financial): O1 survival mode (5 months runway)
- Face 5 (Market): O1 searching for PMF
- Breath Axis 5 (Perception/Truth): Ratio > 2.5 (over-projecting)

**Detection:**
```javascript
const octaveGap = foundationalValues.octave - financialCapital.octave;

if (octaveGap >= 4 &&
    breathAxis5.ratio > 2.0) {
  shadowPattern = "Aspiration-Actuality Gap";
  message = "Vision soaring, execution grounded";
  severity = octaveGap > 5 ? "Severe" : "Moderate";
}
```

**Is this bad?**

**Not necessarily!**
- If you're **aware** and working to close the gap → **Generative shadow** (vision pulls you forward)
- If you're **in denial** and faking it → **Destructive shadow** (cognitive dissonance → burnout)

---

### Shadow Penalty Formula

```javascript
shadowPenalty = Σ(shadowPattern.severity × shadowPattern.weight)

globalCoherence = baseCoherence × (1 - shadowPenalty)
```

**Example:**
```
Base coherence: 65%

Shadows detected:
- Burnout Engine: severity 0.15, weight 1.2 → penalty 0.18
- Lonely Hero: severity 0.10, weight 1.0 → penalty 0.10

Total penalty: 0.28 → 28%

Adjusted coherence: 65% × (1 - 0.28) = 46.8%
```

**Why penalize?**
- Hypocrisy undermines trust
- Shadows create hidden debt
- Unaddressed patterns compound over time

---

### Shadow Severity Weights (PHI-Derived)

The system uses **PHI-derived constants** for mathematical harmony in shadow penalty calculations:

| Shadow Pattern | Penalty | PHI Derivation | Rationale |
|----------------|---------|----------------|-----------|
| **Burnout Engine** | 35% (0.35) | ~φ^-1 × 0.5 | Human cost is irreversible |
| **Extractive Growth** | 30% (0.30) | ~φ^-2 | Ecosystem damage compounds |
| **Brittle Profit** | 25% (0.25) | ~φ^-3 + offset | Financial fragility can be rebuilt |
| **Lonely Hero** | 25% (0.25) | ~φ^-3 + offset | Knowledge can be documented |
| **Experience Gap** | 20% (0.20) | ~φ^-3 | Brand-reality gap can be closed |
| **Hollow Governance** | 15% (0.15) | ~φ^-4 | Culture can grow over time |

#### Important Design Decision: Burnout Asymmetry

The **Burnout Engine** carries a **2.6× higher penalty** than Hollow Governance:

```
Burnout Engine:    35% penalty (highest)
Hollow Governance: 15% penalty (lowest)
Ratio: 35/15 = 2.33×
```

**Why this asymmetry?**

This reflects the **reversibility gradient** principle:
1. **Human depletion (burnout)** is the hardest to reverse - depleted humans cannot be "fixed" like processes
2. **Ecosystem damage** also compounds irreversibly but slower
3. **Structural/cultural gaps** can be addressed with intention over time

**Philosophy:** *What you deplete most severely, you penalize most heavily.*

#### System Integrity Calculation

The overall system integrity score uses PHI-derived weights:

```javascript
// PHI-derived severity weights
const PHI_INV_SQUARED = 0.382;  // φ^-2 - Critical patterns
const PHI_INV_CUBED = 0.236;    // φ^-3 - High patterns
const PHI_INV_4 = 0.146;        // φ^-4 - Moderate patterns

integrityScore = 1.0 - (
    (criticalCount × 0.382) +   // φ^-2
    (highCount × 0.236) +       // φ^-3
    (moderateCount × 0.146)     // φ^-4
);
```

**Integrity Thresholds:**
- ≥ 0.8 = "Good" - Minor issues, address when possible
- ≥ 0.6 = "Concerning" - Multiple patterns, integrity at risk
- < 0.6 = "Critical" - Severe contradictions threaten sustainability

---

### Implementation (Backend)

```javascript
// POC/backend-fallback/models/ShadowPenaltyEngine.js

class ShadowPenaltyEngine {
  detectShadows(dodecahedron, breathAnalysis) {
    const shadows = [];

    // Pattern 1: Burnout Engine
    if (this.detectBurnout(dodecahedron, breathAnalysis)) {
      shadows.push({
        pattern: 'Burnout Engine',
        severity: 0.15,
        message: 'Over-exhaling on multiple axes - unsustainable pace'
      });
    }

    // Pattern 3: Lonely Hero
    if (this.detectLonelyHero(dodecahedron)) {
      shadows.push({
        pattern: 'Lonely Hero',
        severity: 0.10,
        message: 'Bus factor = 1, critical dependency on single individual'
      });
    }

    // Pattern 6: Aspiration-Actuality Gap
    const octaveGap = this.detectOctaveGap(dodecahedron);
    if (octaveGap > 3) {
      shadows.push({
        pattern: 'Aspiration-Actuality Gap',
        severity: octaveGap * 0.03,
        message: `Vision at O${visionOctave}, execution at O${executionOctave}`
      });
    }

    return shadows;
  }

  calculatePenalty(shadows) {
    return shadows.reduce((sum, s) => sum + s.severity, 0);
  }
}
```

---

## Using These Tools

### When to Use Spectral Analysis
- ✅ **Strategy sessions:** "Where should we invest next?"
- ✅ **Resource allocation:** Limited budget - max ROI?
- ✅ **Intervention planning:** Multiple problems - which to fix first?
- ❌ **Daily operations:** Overkill for routine decisions

### When to Use Shadow Detection
- ✅ **Board reviews:** Honest assessment before investors
- ✅ **Retreats:** Deep organizational introspection
- ✅ **Crisis moments:** "Why did this blow up?"
- ✅ **Pre-scaling:** Find hidden debt before growth
- ❌ **Blame/shame:** NOT for punishment, for awareness

---

## Ethical Considerations

### Shadow Detection Can Be Weaponized

**Good use:**
- "We detected Burnout Engine. Let's address workload."
- "Aspiration-Actuality Gap is OK - we're aware and working on it."

**Bad use:**
- "You're a hypocrite! Shadow detection says so!"
- Punishing people for shadows they didn't create consciously

**Guidelines:**
1. Use for **self-diagnosis**, not accusation
2. Shadows are **organizational** patterns, not individual failings
3. Awareness is the first step - don't shame
4. Celebrate shadow work (taking off masks takes courage)

---

## Future Integration

### Roadmap for POC

**Phase 1:** (Current)
- Pentagram analysis ✅
- Breath ratios ✅
- Basic coherence ✅

**Phase 2:** (Next 6 months)
- Port spectral analysis to frontend (use math.js)
- Implement shadow detection patterns
- Add to diagnostic panel in octave-dna.html

**Phase 3:** (Full system)
- AI-assisted shadow detection (GPT-4 analysis of narrative KPIs)
- Real-time spectral updates (as KPIs change)
- Shadow coaching recommendations

---

## Key Takeaways

### Spectral Analysis:
1. **Graph Laplacian** reveals hidden influence structure
2. **Eigenvalues** show network connectivity
3. **Fiedler vector** pinpoints leverage points
4. **Fix the center, not the edge** - counterintuitive but powerful

### Shadow Detection:
1. **6 common patterns** (Burnout, Greenwashing, Lonely Hero, Innovation Theater, Values Veneer, Aspiration Gap)
2. **Not inherently bad** - shadows are data
3. **Awareness > Denial** - seeing shadows is the first step
4. **Generative potential** - acknowledged shadows become growth edges

---

**Back:** Return to [OCTAVE_FRAMEWORK.md](OCTAVE_FRAMEWORK.md) for developmental stages.

**Overview:** Start at [MATH_OVERVIEW.md](MATH_OVERVIEW.md) for the full map.

---

*Created: 2025-01-16 | Part of Quannex Mathematical Framework*
