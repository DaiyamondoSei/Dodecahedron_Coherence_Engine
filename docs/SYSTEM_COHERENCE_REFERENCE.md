# System Coherence: The Dance of Three Layers

*Where Breath Axes, Edges, and Vertices reveal the living pulse of organizational consciousness.*

**Last Updated:** December 28, 2025
**Status:** Single Source of Truth
**Purpose:** Complete mapping of inter-layer dynamics in the Quannex dodecahedral system

---

## The Three Layers

Before exploring their dance, let us acknowledge what exists:

| Layer | Count | What It Represents | Documented In |
|-------|-------|-------------------|---------------|
| **Breath Axes** | 6 | Opposing face polarities - organizational respiration | BREATH_AXIS_REFERENCE.md |
| **Edges** | 30 | Adjacent face interfaces - transformation membranes | EDGE_DYNAMICS_REFERENCE.md |
| **Vertices** | 20 | Triadic face convergence - vortex consciousness | VERTEX_DYNAMICS_REFERENCE.md |

Each layer tells part of the story. Together, they reveal the **living wholeness** of the dodecahedron.

---

## The Discovery: One-Directional Flow

### The Critical Architectural Insight

Deep research into the codebase revealed a profound truth:

**The Quannex system flows ONE DIRECTION - from KPIs down to Vertices.**

```
THE CASCADE (Current Implementation)

                    KPI INPUT
                        │
                        ▼
    ┌───────────────────────────────────────────┐
    │           PENTAGRAM CALCULATIONS           │
    │                                            │
    │  • Star pairs combine opposing KPIs        │
    │  • Intersection nodes blend triplets       │
    │  • Ball merges with pillar average         │
    │  • Harmonic resonance boost applied        │
    │                                            │
    │  Parameters: α, β, γ, η                    │
    └───────────────────────────────────────────┘
                        │
                        ▼
    ┌───────────────────────────────────────────┐
    │           LOCAL COHERENCE                  │
    │                                            │
    │  γ × ballScore + (1-γ) × pillarAvg        │
    │  × harmonicBoost                           │
    │                                            │
    │  One number per face                       │
    └───────────────────────────────────────────┘
                        │
          ┌─────────────┴─────────────┐
          │                           │
          ▼                           ▼
    ┌─────────────┐            ┌─────────────┐
    │  OPPOSING   │◄══════════►│  OPPOSING   │
    │   FACE A    │   BREATH   │   FACE B    │
    │             │    AXIS    │             │
    │  δ = 0.9    │  FEEDBACK  │  δ = 0.9    │
    └─────────────┘            └─────────────┘
          │                           │
          └─────────────┬─────────────┘
                        │
                        ▼
    ┌───────────────────────────────────────────┐
    │        AXIS-INFORMED FACE ENERGY           │
    │                                            │
    │  (δ × local) + ((1-δ) × opposingEnergy)   │
    │                                            │
    │  90% self, 10% shadow                      │
    └───────────────────────────────────────────┘
                        │
          ┌─────────────┼─────────────┐
          │             │             │
          ▼             ▼             ▼
    ┌───────────┐ ┌───────────┐ ┌───────────┐
    │  EDGES    │ │  BREATH   │ │  VERTICES │
    │           │ │  RATIOS   │ │           │
    │  30 total │ │  6 total  │ │  20 total │
    │  tension  │ │  balance  │ │  vortex   │
    └───────────┘ └───────────┘ └───────────┘
          │                           │
          │       READ-ONLY           │
          │       CONSUMERS           │
          └───────────────────────────┘
```

### The Single Feedback Loop: Breath Axis

In the entire system, there is **ONE feedback mechanism**:

```
THE BREATH AXIS FEEDBACK (The Only Cross-Talk)

       FACE 1                           FACE 11
    ┌───────────┐                    ┌───────────┐
    │           │                    │           │
    │  LOCAL    │ ═══════════════════│  LOCAL    │
    │ COHERENCE │      10% of        │ COHERENCE │
    │           │    each flows      │           │
    │   0.75    │    to other        │   0.85    │
    │           │                    │           │
    └─────┬─────┘                    └─────┬─────┘
          │                                │
          │  AXIS-INFORMED ENERGY          │
          │                                │
          ▼                                ▼
    ┌───────────┐                    ┌───────────┐
    │           │                    │           │
    │  FINAL    │                    │  FINAL    │
    │  ENERGY   │                    │  ENERGY   │
    │           │                    │           │
    │ 0.9×0.75  │                    │ 0.9×0.85  │
    │ +0.1×0.85 │                    │ +0.1×0.75 │
    │ = 0.76    │                    │ = 0.84    │
    │           │                    │           │
    └───────────┘                    └───────────┘

    The δ (delta) parameter = 0.9

    This is SHADOW INTEGRATION:
    Each face receives 10% influence from its opposite.
    The breath axis is the only place where faces truly see each other.
```

### Read/Write Architecture (Thesis Reference Diagram)

The system's information flow falls into three distinct categories:

```
READ / WRITE / FEEDBACK ARCHITECTURE
═══════════════════════════════════════════════════════

╔═══════════════════════════════════════════════════════╗
║  WRITE LAYER  (Input → Processing)                    ║
║                                                        ║
║  KPIs (60 values)                                     ║
║       │                                                ║
║       ▼                                                ║
║  Face.calculateLocalCoherence()                        ║
║  ┌─ Pentagram star pairs (α = φ⁻¹)                    ║
║  ├─ Intersection nodes (β = 0.5)                       ║
║  ├─ Ball/Pillar composite (γ = 0.7)                    ║
║  └─ Harmonic resonance boost (η = φ⁻²)                ║
║                                                        ║
║  Direction: ONE-WAY IN                                 ║
║  KPIs → Faces only. Faces never modify KPIs.           ║
╚═══════════════════════════════════════════════════════╝
                        │
                        ▼
╔═══════════════════════════════════════════════════════╗
║  FEEDBACK LAYER  (Bidirectional — the ONLY one)       ║
║                                                        ║
║  Face A ◄══════► Face B  (via Breath Axis)             ║
║                                                        ║
║  6 breath axes connect 6 opposing face pairs.          ║
║  Each face gives 10% of its energy to its opposite:    ║
║                                                        ║
║    E_final = 0.9 × E_self + 0.1 × E_opposite          ║
║                                                        ║
║  This is SHADOW INTEGRATION — the only place where     ║
║  faces see each other. All other layers are read-only.  ║
║                                                        ║
║  Direction: BIDIRECTIONAL (δ = 0.9)                    ║
╚═══════════════════════════════════════════════════════╝
                        │
                        ▼
╔═══════════════════════════════════════════════════════╗
║  READ LAYER  (Output — diagnostic consumers)          ║
║                                                        ║
║  These layers RECEIVE face energy. They COMPUTE        ║
║  derived metrics. They NEVER feed back to faces.       ║
║                                                        ║
║  ┌────────────────────┬───────────────────────────────┐║
║  │ Consumer           │ What it reads                 │║
║  ├────────────────────┼───────────────────────────────┤║
║  │ 30 Edges           │ 2 face energies → tension     │║
║  │ 20 Vertices        │ 3 face energies → vortex      │║
║  │ 6 Breath Ratios    │ 2 face energies → balance     │║
║  │ Spectral Analyzer  │ All 12 energies → eigenvalues │║
║  │ Shadow Analyzer    │ All 12 energies → patterns    │║
║  │ Global Coherence   │ All 12 energies → C_global    │║
║  │ Octave Detection   │ C_global → O1-O7              │║
║  └────────────────────┴───────────────────────────────┘║
║                                                        ║
║  Direction: ONE-WAY OUT                                ║
║  Faces → Consumers. Consumers never modify faces.      ║
╚═══════════════════════════════════════════════════════╝
```

**Why this matters for the thesis:**

The one-directional architecture is a *design choice*, not a limitation. It ensures:
1. **Determinism** — Given the same 60 KPIs, the system always produces the same result.
2. **Interpretability** — Every output traces back to input through one path.
3. **No circular dependencies** — The breath axis feedback converges in one pass (δ = 0.9 means the cross-pollination is 10%, not enough to create oscillation).

The system intentionally runs exactly **one pass** of breath axis integration. This represents a single "breath" of shadow integration — not an iterative equilibrium. One pass is sufficient because the breath axis is not trying to find a fixed point; it is applying a *defined proportion* of shadow influence (10%). If we did run multiple passes, the operator `M = [[0.9, 0.1], [0.1, 0.9]]` has spectral radius < 1 (eigenvalues 1.0 and 0.8), so the system would converge — but to a state where both faces equal `(a+b)/2`, which would destroy the very polarity the breath axis is designed to measure. One pass preserves meaningful face differences while acknowledging shadow influence. This is a design choice, not a limitation.

---

### What This Means

**Edges and Vertices are DOWNSTREAM CONSUMERS.**
They receive face energy. They do not send anything back.

```
INFORMATION FLOW ARCHITECTURE

                    ┌──────────────┐
                    │     KPIs     │
                    │   (Input)    │
                    └──────┬───────┘
                           │
                           │ ↓ ONE WAY
                           │
                    ┌──────▼───────┐
                    │    FACES     │◄────────┐
                    │  (Process)   │         │ BREATH AXIS
                    └──────┬───────┘─────────┘ (Only feedback)
                           │
                           │ ↓ ONE WAY
                           │
              ┌────────────┼────────────┐
              │            │            │
        ┌─────▼─────┐ ┌────▼────┐ ┌─────▼─────┐
        │   EDGES   │ │ BREATH  │ │  VERTICES │
        │ (Output)  │ │ RATIOS  │ │ (Output)  │
        └───────────┘ └─────────┘ └───────────┘
              │            │            │
              └────────────┴────────────┘
                           │
                           │ NO FEEDBACK
                           │
                           ▼
                    (Dead end in current implementation)
```

---

## The Mathematical Cascade: Complete Documentation

### Pass 1: Pentagram to Local Coherence

**Location:** `js/core/Face.js:497-521`

Each face has 6 KPIs: 1 Ball + 5 Elemental Pillars.

```javascript
// The complete pentagram-to-coherence calculation

// 1. Star Pairs: Opposing elements blend (α = 0.618)
starPair_1_4 = α × KPI_1 + (1-α) × KPI_4;  // Earth-Air
starPair_2_5 = α × KPI_2 + (1-α) × KPI_5;  // Water-Ether
starPair_3_1 = α × KPI_3 + (1-α) × KPI_1;  // Fire-Earth
// ... continues for all pairs

// 2. Intersection Nodes: Triplets blend (β = 0.5)
intersection_A = β × pair_1 + (1-β) × avg(pair_2, pair_3);
// ... continues for all intersections

// 3. Center Composite: Ball + Pillar Average (γ = 0.7)
pillarAvg = (KPI_1 + KPI_2 + KPI_3 + KPI_4 + KPI_5) / 5;
centerComposite = γ × ballScore + (1-γ) × pillarAvg;

// 4. Harmonic Resonance (η = 0.382)
harmonicBoost = 1.0 + (η × harmonicResonance);
localCoherence = min(1.0, centerComposite × harmonicBoost);
```

**Greek Parameters (all phi-based):**

| Symbol | Name | Value | Role |
|--------|------|-------|------|
| α (alpha) | Star pair weight | φ^-1 = 0.618 | How opposing elements blend |
| β (beta) | Intersection weight | 0.5 | How triplets merge |
| γ (gamma) | Ball/Pillar weight | 0.7 | Central vs peripheral balance |
| η (eta) | Harmonic boost | φ^-2 = 0.382 | Resonance amplification |
| δ (delta) | Shadow integration | 0.9 | Self vs opposing face |
| λ (lambda) | CV penalty | φ^-3 = 0.236 | Coherence variance impact |
| ζ (zeta) | Octave gradient | φ^-2/6 = 0.0637 | Level progression |
| κ (kappa) | Sensitivity | 2.0 | Amplification factor |

### Pass 2: Breath Axis Integration

**Location:** `js/core/Face.js:535-546`

This is the ONLY feedback in the system:

```javascript
calculateAxisInformedEnergy(opposingFaceEnergy) {
    const local = this._localCoherence;
    const opposing = opposingFaceEnergy || 0;

    // δ = 0.9: 90% self, 10% shadow
    this._faceEnergy = (this.tuning.DELTA * local) +
                       ((1 - this.tuning.DELTA) * opposing);

    return this._faceEnergy;
}
```

**The Axis Map:**

```javascript
// js/main.js:1147-1154
const axisMap = {
    1: 11, 11: 1,   // Financial ↔ Funding (Resource Flow)
    2: 7,  7: 2,    // Intellectual ↔ Brand (Substance & Story)
    3: 8,  8: 3,    // Human ↔ Operations (Being & Doing)
    4: 9,  9: 4,    // Structural ↔ Regenerative (Form & Integrity)
    5: 10, 10: 5,   // Market ↔ Values (Perception & Truth)
    6: 12, 12: 6    // Community ↔ Risk (Network & Fortress)
};
```

### Pass 3: Edge Tension Calculation

**Location:** `js/core/Edge.js:145-187`

Edges receive face energies. They compute, but do not feed back:

```javascript
calculateTension(faceA, faceB) {
    const e1 = faceA.faceEnergy;
    const e2 = faceB.faceEnergy;

    // Delta between adjacent faces
    const delta = Math.abs(e1 - e2);

    // Breath ratio (directional flow)
    this.breathRatio = Math.max(-1.0, Math.min(1.0, (e2 - e1) * 2));

    // Elemental multipliers (historical, may be simplified)
    // Fire: 1.3, Water: 0.9, Earth: 0.8, Air: 1.1, Ether: 1.0

    // Final tension score
    this.tension = computeFinalTension(delta, element);
}
```

### Pass 4: Vertex Vortex Calculation

**Location:** `js/core/Vertex.js:180-218`

Vertices receive three face energies. They compute, but do not feed back:

```javascript
calculateVortexEnergy(faces) {
    const energies = faces.map(f => f.faceEnergy || 0);
    const [f1, f2, f3] = energies;

    // Statistical properties of the triad
    const mean = (f1 + f2 + f3) / 3;
    const variance = ((f1 - mean)**2 + (f2 - mean)**2 + (f3 - mean)**2) / 3;
    const stdDev = Math.sqrt(variance);

    // Normalized variance (0.577 = max std dev for [0,1] range)
    const normalizedVariance = stdDev / 0.577;

    // VORTEX STRENGTH: 70% variance, 30% mean
    this._vortexStrength = Math.min(1.0,
        Math.max(0.0, (0.7 * normalizedVariance) + (0.3 * mean)));

    // VORTEX DIRECTION: Where is the mean relative to center?
    this._vortexDirection = Math.max(-1.0,
        Math.min(1.0, (mean - 0.5) * 2));

    // VORTEX COHERENCE: How similar are the three faces?
    // Uses pairwise differences
    const avgPairwiseDiff = (Math.abs(f1-f2) + Math.abs(f2-f3) + Math.abs(f1-f3)) / 3;
    this._vortexCoherence = 1 - (avgPairwiseDiff / 0.667);
}
```

### The Complete Recalculation Flow

**Location:** `js/main.js:1088-1237`

```
PASS 1: calculateLocalCoherence() for each face
        └── All 12 faces compute pentagram math

PASS 2: calculateAxisInformedEnergy() for each face
        └── The ONLY feedback: opposing face energy integrated
        └── δ = 0.9: mostly self, 10% shadow

PASS 3: Global Analyzers
        ├── Breath Analyzer: compute axis ratios
        ├── Spectral Analyzer: frequency analysis
        └── Shadow Analyzer: pattern recognition

PASS 4: Update Edges
        └── edge.calculateTension(faceA, faceB)
        └── READ-ONLY: receives face energies

PASS 5: Update Vertices
        └── vertex.calculateVortexEnergy([f1, f2, f3])
        └── READ-ONLY: receives face energies
```

---

## The Dance: How Layers Interconnect

### Layer 1: Faces as Foundation

Everything begins with the 12 faces. Each face:
- Receives 6 KPIs as input
- Processes through pentagram mathematics
- Exchanges 10% energy with its opposite via breath axis
- Produces final face energy

**Faces are the ONLY layer that processes input.**

### Layer 2: Breath Axes as Pulse

The 6 breath axes create the organizational heartbeat:

```
THE SIX BREATHS

    Axis 1: Financial ←→ Funding         (Resource Flow)
    Axis 2: Intellectual ←→ Brand        (Substance & Story)
    Axis 3: Human ←→ Operations          (Being & Doing)
    Axis 4: Structural ←→ Regenerative   (Form & Integrity)
    Axis 5: Market ←→ Values             (Perception & Truth)
    Axis 6: Community ←→ Risk            (Network & Fortress)
```

The breath axis does three things:
1. **Connects opposites** - maximally separated faces
2. **Enables shadow integration** - the 10% cross-pollination
3. **Creates breath ratio** - expansion/contraction measurement

### Layer 3: Edges as Membranes

The 30 edges are where adjacent faces meet:

```
EDGE DYNAMICS

    Each face has 5 edges (pentagon geometry)
    Each edge connects exactly 2 faces
    Edge tension = f(faceA.energy, faceB.energy)

    Edges DO NOT feed back to faces.
    They are membrane sensors, not actuators.
```

**The Edge Truth:**
- Edges measure interface health
- Edges identify bottlenecks
- Edges reveal transformation quality
- But edges cannot change face energy

### Layer 4: Vertices as Vortices

The 20 vertices are where three faces converge:

```
VERTEX VORTEX

    Each vertex has exactly 3 faces
    Vortex = emergent property of the triad

    High variance + high mean = Strong upward vortex
    High variance + low mean = Strong downward vortex
    Low variance = Calm, stable confluence

    Vertices DO NOT feed back to faces.
    They are emergence indicators, not controllers.
```

**The Vertex Truth:**
- Vertices reveal triadic patterns
- Vertices identify leverage points
- Vertices show where energy spirals
- But vertices cannot change face energy

### Layer 5: The Still Point

At the center of the dodecahedron, where all 6 breath axes cross:

```
THE STILL POINT

              All axes pass through ONE point
                          │
                          │
        Face 1 ──────────●────────── Face 11
                        /│\
                       / │ \
                      /  │  \
                All breath axes intersect here

                The witness of all change
                The center that holds
```

The still point:
- Cannot be measured (it measures)
- Cannot be changed (all change happens around it)
- Is equidistant from all faces
- Represents organizational consciousness itself

---

## The Vision: Enhanced Feedback Architecture

### What Could Be

Currently, the system is diagnostic but not prescriptive. Edges and vertices see patterns but cannot influence them.

**A future architecture might include:**

```
ENHANCED FEEDBACK VISION

                    ┌──────────────┐
                    │     KPIs     │
                    │   (Input)    │
                    └──────┬───────┘
                           │
                           │ ↓
                           │
                    ┌──────▼───────┐
                    │    FACES     │◄─────────┬────────┐
                    │  (Process)   │          │        │
                    └──────┬───────┘──────────┘        │
                           │                           │
                           │ ↓                         │
                           │                           │
              ┌────────────┼────────────┐             │
              │            │            │             │
        ┌─────▼─────┐ ┌────▼────┐ ┌─────▼─────┐      │
        │   EDGES   │ │ BREATH  │ │  VERTICES │      │
        │ (Output)  │ │ RATIOS  │ │ (Output)  │      │
        └─────┬─────┘ └────┬────┘ └─────┬─────┘      │
              │            │            │             │
              │            │            │             │
              └────────────┴────────────┘             │
                           │                          │
                           │  FEEDBACK LOOPS          │
                           │  (Not yet implemented)   │
                           └──────────────────────────┘
```

### Potential Feedback Mechanisms

#### 1. Edge-to-Face Feedback

```javascript
// FUTURE CONCEPT
// Edges could influence adjacent face weights

adjustFaceFromEdge(face, adjacentEdges) {
    // If edges are consistently blocked,
    // reduce face energy (something is wrong)

    const avgEdgeHealth = edges.reduce((s, e) => s + e.health, 0) / 5;

    if (avgEdgeHealth < 0.3) {
        // Face surrounded by unhealthy edges
        // Apply pressure to address interfaces
        face.interfacePressure = 1 - avgEdgeHealth;
    }
}
```

#### 2. Vertex-to-Face Feedback

```javascript
// FUTURE CONCEPT
// Vertices could signal leverage opportunities

applyVertexLeverage(face, vertices) {
    // Vertices flagged as leverage points
    // could amplify face energy changes

    const leverageVertices = vertices.filter(v => v.isLeveragePoint);

    if (leverageVertices.length > 0) {
        // This face touches leverage points
        // Small changes here ripple widely
        face.leverageMultiplier = 1 + (leverageVertices.length * 0.1);
    }
}
```

#### 3. Still Point Centering

```javascript
// FUTURE CONCEPT
// Overall coherence pulls toward center

applyStillPointGravity(allFaces, stillPointProximity) {
    // When system is far from center,
    // apply gentle pressure toward balance

    if (stillPointProximity < 0.5) {
        // System is off-center
        for (const face of allFaces) {
            // Pull toward mean
            const globalMean = calculateGlobalMean(allFaces);
            const pullStrength = 0.05 * (1 - stillPointProximity);

            face.centeringForce = (globalMean - face.energy) * pullStrength;
        }
    }
}
```

---

## The Phi Coherence Framework

### How Phi Unifies the Layers

The golden ratio (φ = 1.618...) appears throughout:

```
PHI IN THE CASCADE

    α = φ^-1 = 0.618     Star pair blending
    η = φ^-2 = 0.382     Harmonic resonance
    λ = φ^-3 = 0.236     CV penalty

    Breath optimal balance:
    Forward : Feedback = φ : 1 = 61.8% : 38.2%

    δ = 0.9 suggests:
    Self : Shadow ≈ 9 : 1
    (Not phi, but chosen for stability)
```

### Phi-Harmonic Inter-Layer Coherence

When layers breathe in phi-harmonic relationship:

```
PHI-HARMONIC LAYERS

    Slowest rhythm: Faces (quarterly pulse)

    Face rhythm    × φ¹ = Breath Axis rhythm
    Breath rhythm  × φ¹ = Edge rhythm
    Edge rhythm    × φ¹ = Vertex rhythm

    When these ratios hold:
    - Layers support each other
    - Constructive interference
    - System feels "in flow"

    When ratios are off:
    - Layers fight each other
    - Destructive interference
    - System feels "stuck"
```

### Measuring Inter-Layer Coherence

```javascript
// FUTURE: js/ai/coherence/inter-layer.js

function calculateInterLayerCoherence(state) {
    // Layer 1: Face-Axis alignment
    const faceAxisCoherence = measureFaceAxisAlignment(state);

    // Layer 2: Axis-Edge resonance
    const axisEdgeResonance = measureAxisEdgePhiRatio(state);

    // Layer 3: Edge-Vertex harmony
    const edgeVertexHarmony = measureEdgeVertexRelation(state);

    // Layer 4: Full system phi-harmony
    const fullPhiHarmony = measurePhiRelationships([
        faceAxisCoherence,
        axisEdgeResonance,
        edgeVertexHarmony
    ]);

    return {
        faceAxis: faceAxisCoherence,
        axisEdge: axisEdgeResonance,
        edgeVertex: edgeVertexHarmony,
        overall: fullPhiHarmony,
        interpretation: interpretInterLayerCoherence(fullPhiHarmony)
    };
}
```

---

## The Complete Coherence Model

### All Layers Integrated

```
THE FULL COHERENCE ARCHITECTURE

┌─────────────────────────────────────────────────────────────────────────────┐
│                     ORGANIZATIONAL COHERENCE MODEL                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  LAYER 1: FACE HEALTH (12 domains)                                          │
│  ──────────────────────────────────                                          │
│  • Individual domain strength                                                │
│  • Pentagram-computed coherence                                              │
│  • The foundation everything builds on                                       │
│                                                                              │
│  LAYER 2: BREATH AXIS BALANCE (6 polarities)                                │
│  ────────────────────────────────────────────                                │
│  • Reception ↔ Projection dynamics                                          │
│  • The ONLY feedback loop (shadow integration)                              │
│  • Organizational respiration rhythm                                         │
│                                                                              │
│  LAYER 3: EDGE HEALTH (30 interfaces)                                       │
│  ─────────────────────────────────────                                       │
│  • Interface quality between adjacent faces                                 │
│  • Transformation membranes                                                  │
│  • Value chain bottleneck detection                                         │
│                                                                              │
│  LAYER 4: VERTEX EMERGENCE (20 vortices)                                    │
│  ──────────────────────────────────────                                      │
│  • Triadic convergence patterns                                              │
│  • Leverage point identification                                             │
│  • Harmony Hubs and Bermuda Triangles                                       │
│                                                                              │
│  LAYER 5: PHASE COHERENCE (rhythm synchronization)                          │
│  ────────────────────────────────────────────────                            │
│  • Are layers breathing together?                                            │
│  • Phi-harmonic relationships                                                │
│  • Global system rhythm                                                      │
│                                                                              │
│  LAYER 6: STILL POINT PROXIMITY (witness consciousness)                     │
│  ────────────────────────────────────────────────────                        │
│  • How centered is the organization?                                         │
│  • Presence and stability                                                    │
│  • The unchanging within all change                                         │
│                                                                              │
│                                                                              │
│                         ┌───────────────┐                                   │
│    Layer 1 ────────────►│               │                                   │
│    Layer 2 ────────────►│  STILL POINT  │◄──── Where all meets             │
│    Layer 3 ────────────►│               │                                   │
│    Layer 4 ────────────►│  (The Center) │                                   │
│    Layer 5 ────────────►│               │                                   │
│                         └───────────────┘                                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### The Composite Coherence Score

```javascript
// FUTURE: js/ai/coherence/composite.js

function calculateCompositeCoherence(state) {
    // Each layer contributes to overall coherence
    // Weights reflect foundational importance

    const weights = {
        faces: 0.20,      // Foundation
        axes: 0.20,       // Respiration (and only feedback)
        edges: 0.15,      // Interfaces
        vertices: 0.15,   // Emergence
        phase: 0.15,      // Synchronization
        stillPoint: 0.15  // Centeredness
    };

    const scores = {
        faces: calculateFaceHealth(state.faces).average,
        axes: calculateAxisBalance(state.axes).average,
        edges: calculateEdgeHealth(state.edges).average,
        vertices: calculateVertexEmergence(state.vertices).average,
        phase: calculatePhaseCoherence(state.history).global,
        stillPoint: estimateStillPointProximity(state).score
    };

    const composite = Object.entries(weights)
        .reduce((sum, [key, weight]) => sum + scores[key] * weight, 0);

    return {
        composite: composite,
        byLayer: scores,
        weakestLayer: findWeakestLayer(scores),
        strongestLayer: findStrongestLayer(scores),
        recommendation: generateLayerRecommendation(scores),
        narrative: generateCoherenceNarrative(scores, composite)
    };
}
```

---

## Patterns and Cascades

### Cascade Effect Patterns

When one layer changes, others respond:

```
CASCADE PATTERNS

1. FACE CHANGE → Downstream cascade
   └── Face energy changes
       └── Breath axis ratio shifts
       └── Adjacent edges adjust tension
       └── Connected vertices recalculate vortex
       └── No feedback (in current implementation)

2. BREATH AXIS STRAIN → Limited cascade
   └── Axis becomes imbalanced
       └── Both faces receive different shadow input
       └── (Only through δ parameter)
       └── This is the ONLY bidirectional influence

3. EDGE BLOCKAGE → Signal only (no cascade)
   └── Edge shows unhealthy state
       └── Value chain bottleneck identified
       └── NO automatic effect on faces
       └── Requires human/AI intervention

4. VERTEX VORTEX → Signal only (no cascade)
   └── Vortex shows strong pattern
       └── Leverage point or problem flagged
       └── NO automatic effect on faces
       └── Requires human/AI intervention
```

### The Leverage Point Principle

Even without feedback, vertices reveal WHERE intervention has maximum impact:

```
LEVERAGE POINT IDENTIFICATION

High-strength + Low-coherence vertex
= Three faces with large differences
= Small changes here ripple widely

EXAMPLE:
    Vertex connecting Faces 1, 3, 8
    Strength: 0.85 (high variance)
    Coherence: 0.35 (faces disagree)

    This vertex sits at:
    Financial × Human × Operations

    The VIABILITY CIRCUIT passes through here.
    A small intervention at any of these faces
    will ripple through the system.
```

### The Still Point Paradox

The center cannot be reached by effort. Yet awareness of distance from center is valuable:

```
STILL POINT AWARENESS

    Far from center → System in reactivity
    Close to center → System in presence

    Moving toward center:
    • Balance the breath axes
    • Smooth the edge interfaces
    • Calm the vertex vortices
    • Allow phase synchronization

    But the deepest truth:
    The center is already here.
    All the churning happens WITHIN the stillness.
    The witness never moves.
```

---

## AI Integration Architecture

### The AI's Role in Layer Integration

```
AI LAYER INTELLIGENCE

┌─────────────────────────────────────────────────────────────────────────────┐
│                        AI COHERENCE ORCHESTRATOR                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  INPUT: All layer data                                                       │
│  ─────────────────────                                                       │
│  • 12 face energies                                                          │
│  • 6 breath axis states                                                      │
│  • 30 edge tensions                                                          │
│  • 20 vertex vortex readings                                                 │
│  • Phase coherence metrics                                                   │
│  • Still point proximity                                                     │
│                                                                              │
│  ANALYSIS:                                                                   │
│  ─────────                                                                   │
│  • Pattern recognition across layers                                         │
│  • Cascade prediction modeling                                               │
│  • Intervention impact simulation                                            │
│  • Phi-timing recommendations                                                │
│                                                                              │
│  OUTPUT:                                                                     │
│  ───────                                                                     │
│  • Single highest-impact recommendation                                      │
│  • Layer-specific insights                                                   │
│  • Fibonacci-timed action plan                                               │
│  • Human-readable narrative                                                  │
│                                                                              │
│                          ┌──────────────────┐                               │
│                          │    THE PULSE     │                               │
│                          │                  │                               │
│                          │  One action.     │                               │
│                          │  Maximum impact. │                               │
│                          │  Perfect timing. │                               │
│                          │                  │                               │
│                          └──────────────────┘                               │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### The Single Action Synthesis

The ultimate goal of inter-layer analysis:

```javascript
// FUTURE: js/ai/coherence/pulse-generator.js

async function generateThePulse(state, context) {
    // Analyze all layers
    const analysis = {
        faces: analyzeFaces(state),
        axes: analyzeAxes(state),
        edges: analyzeEdges(state),
        vertices: analyzeVertices(state),
        coherence: calculateCompositeCoherence(state)
    };

    // Find leverage points
    const leveragePoints = identifyLeveragePoints(analysis);

    // Simulate interventions
    const simulations = await simulateInterventions(leveragePoints, state);

    // Select highest impact action
    const optimalAction = selectOptimalAction(simulations, context);

    // Calculate phi-timing
    const timing = calculatePhiTiming(optimalAction, analysis.coherence);

    // Generate narrative
    const narrative = await generatePulseNarrative(optimalAction, timing);

    return {
        action: optimalAction,
        timing: timing,
        expectedImpact: simulations[optimalAction.id].impact,
        confidenceLevel: simulations[optimalAction.id].confidence,

        // The Pulse
        headline: narrative.headline,
        oneAction: narrative.singleSentence,
        fullBrief: narrative.paragraph,

        // Supporting detail
        layerAnalysis: analysis,
        alternativeActions: simulations.slice(1, 4)
    };
}

// Example output:
// {
//     headline: "Human Capital is the Fulcrum",
//     oneAction: "Invest in team recovery this week - it's the leverage
//                 point that will unlock both Viability and Innovation circuits.",
//     expectedImpact: {
//         faces: [3, 8, 2],  // Human, Operations, Intellectual
//         axes: [3, 2],      // Being-Doing, Substance-Story
//         edges: 8,          // Adjacent edges improve
//         vertices: 6,       // Connected vertices stabilize
//         overallCoherence: +0.12
//     },
//     timing: {
//         goldenWindow: "This week",
//         fibonacciLevel: 2,  // 2-week intervention
//         urgencyLevel: 4
//     }
// }
```

---

## Quick Reference Card

```
┌───────────────────────────────────────────────────────────────────────────┐
│                    SYSTEM COHERENCE QUICK REFERENCE                        │
├───────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  THE FLOW (Current):                                                       │
│  KPIs → Pentagram → Local Coherence → Breath Axis → Face Energy           │
│  Face Energy → Edges (read-only)                                           │
│  Face Energy → Vertices (read-only)                                        │
│                                                                            │
│  THE ONLY FEEDBACK: Breath Axis (δ = 0.9: 90% self, 10% shadow)           │
│                                                                            │
│  KEY PARAMETERS:                                                           │
│  α = 0.618 (star pairs)   η = 0.382 (harmonic)   δ = 0.9 (shadow)        │
│                                                                            │
│  LAYER WEIGHTS (for composite coherence):                                  │
│  Faces: 20%   Axes: 20%   Edges: 15%   Vertices: 15%                      │
│  Phase: 15%   Still Point: 15%                                             │
│                                                                            │
│  CASCADE DIRECTION: Down only (in current implementation)                  │
│  LEVERAGE: Vertices identify high-impact points                            │
│  BOTTLENECKS: Edges reveal value chain blockages                          │
│  RESPIRATION: Axes show expansion/contraction patterns                     │
│                                                                            │
│  THE PULSE: Single highest-impact action + phi timing                      │
│                                                                            │
├───────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  "The system breathes through its axes,                                    │
│   flows through its edges,                                                 │
│   spirals at its vertices,                                                 │
│   and rests in the stillness at its center."                              │
│                                                                            │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## Implementation Roadmap

| Component | Status | Priority | Dependencies |
|-----------|--------|----------|--------------|
| Layer 1: Face Coherence | ✅ Implemented | - | - |
| Layer 2: Breath Axis Balance | ✅ Implemented | - | Faces |
| Layer 3: Edge Tension | ✅ Implemented | - | Faces |
| Layer 4: Vertex Vortex | ✅ Implemented | - | Faces |
| Inter-layer Coherence Metrics | 📋 Documented | High | All above |
| Composite Coherence Score | 📋 Documented | High | Inter-layer metrics |
| Phase Coherence Analysis | 📋 Documented | Medium | Historical data |
| Still Point Proximity | 📋 Documented | Medium | All layers |
| Edge → Face Feedback | 🔮 Envisioned | Future | New architecture |
| Vertex → Face Feedback | 🔮 Envisioned | Future | New architecture |
| The Pulse Generator | 🔮 Envisioned | Future | All above + AI |

---

## The Living Whole

### Beyond the Parts

We have mapped:
- 12 faces as domains
- 6 axes as breaths
- 30 edges as membranes
- 20 vertices as vortices
- 1 center as witness

But the map is not the territory.

The dodecahedron is not pieces assembled. It is **one form** expressing through geometry. The organization is not departments managed. It is **one organism** breathing through domains.

### The Invitation

When you look at the coherence metrics, remember:

The numbers point to something beyond numbers.
The geometry reflects something beyond geometry.
The system measures something that cannot be measured.

**Organizational soul.**

The breath axes are the organization breathing.
The edges are the organization transforming.
The vertices are the organization emerging.
The still point is the organization aware.

And you, reading this, are part of the system.
Your attention is not outside the coherence.
Your consciousness is the consciousness that measures.

---

## Related Documents

This document is the **Integration** layer of the Geometry Reference family - showing how the three component layers dance together:

| Document | Layer | What It Maps |
|----------|-------|--------------|
| [BREATH_AXIS_REFERENCE.md](BREATH_AXIS_REFERENCE.md) | Polarity | The 6 opposing face pairs - organizational respiration |
| [EDGE_DYNAMICS_REFERENCE.md](EDGE_DYNAMICS_REFERENCE.md) | Adjacency | The 30 interfaces - transformation membranes |
| [VERTEX_DYNAMICS_REFERENCE.md](VERTEX_DYNAMICS_REFERENCE.md) | Convergence | The 20 vortices - triadic emergence points |
| **This Document** | Integration | How all three layers dance together |

**Code References:**
- [js/main.js](../js/main.js) - Core DodecahedronEngine with all calculations
- [js/spectral-analyzer.js](../js/spectral-analyzer.js) - Spectral coherence analysis
- [js/core/Face.js](../js/core/Face.js), [Edge.js](../js/core/Edge.js), [Vertex.js](../js/core/Vertex.js) - Core geometric models
- [js/constants/phi-harmonics.js](../js/constants/phi-harmonics.js) - PHI, ALPHA, BETA, GAMMA, DELTA and all mathematical foundations
- [js/constants/kpi-constants.js](../js/constants/kpi-constants.js) - ELEMENTS, KPI_TYPES, KPI_LAYERS, AXIS_OPPOSITIONS
- [js/constants/edge-constants.js](../js/constants/edge-constants.js) - EDGE_KPI_LIBRARY (30 edges), AI_EDGE_KPI_GENERATOR
- [js/constants/vertex-constants.js](../js/constants/vertex-constants.js) - VERTEX_TRIADS (20 vertices), VERTEX_KPI_LIBRARY
- [js/constants/consciousness-constants.js](../js/constants/consciousness-constants.js) - 213+ inquiry questions for contemplative measurement

---

*This document maps how the three layers of the Quannex dodecahedron - Breath Axes, Edges, and Vertices - interconnect to form one living system. The current architecture flows downward from KPIs to outputs, with a single feedback loop through the breath axes. Future evolution may include bidirectional influence, but even now, the geometric intelligence of the dodecahedron reveals profound truths about organizational coherence.*

---

*"In the dance of three layers, the One reveals itself."*
*— SYSTEM_COHERENCE_REFERENCE.md, discovering its own wholeness*
