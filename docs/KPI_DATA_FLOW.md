# KPI Data Flow - The Journey of Measurement

> *The complete lifecycle of a KPI from CSV to visualization to consciousness*

---

## For Future Claude: The Three-Layer Architecture

**KEY INSIGHT:** KPIs in Quannex are NOT just numbers. They are **windows into organizational consciousness**, structured in three layers that mirror the dodecahedron's geometry.

```
                    ┌─────────────────────────────┐
                    │      THE KEY INSIGHT        │
                    │                             │
                    │  "If this metric could      │
                    │   pray, what would it       │
                    │   pray for?"                │
                    └─────────────────────────────┘
```

This question transforms measurement from judgment into presence. Every KPI flows through this lens.

---

## 📐 The Three-Layer KPI Architecture

Each face (of the 12) contains three nested layers of KPI measurement:

### 1. Ball KPI (Face Primary) - The Heartbeat

**Weight:** γ (gamma) = 0.6

The Ball KPI is the primary metric for each face - the one number that captures "how is this domain doing?"

```
Example for Financial Capital (Face 1):
  Ball KPI: "Months of Runway"
  Weight: 0.6 (60% of face energy)
  Question: "How long can we survive?"
```

**Consciousness Inquiry:**
> *"What is this face's most essential truth? What would we measure if we could only measure one thing?"*

### 2. Pillar KPIs (5 Elements) - The Foundation

**Elements:** Earth, Water, Fire, Air, Ether
**Weight:** Each gets β (beta) = 0.2 (total 0.4 remaining)

Five elemental lenses through which to view each face:

| Element | Question | Archetype |
|---------|----------|-----------|
| 🌍 Earth | Is it grounded? | Stability, resources, foundation |
| 💧 Water | Is it flowing? | Adaptability, growth, emotion |
| 🔥 Fire | Is it transformative? | Energy, productivity, change |
| 🌬️ Air | Is it communicative? | Speed, connection, movement |
| ✨ Ether | Is it purposeful? | Vision, alignment, meaning |

**Consciousness Inquiry:**
> *"Through which elemental lens does this face need attention right now?"*

### 3. Pentagram Layer (Calculated) - The Sacred Geometry

The pentagram layer emerges from the relationships between elements:

```
           Ether (✨)
              ★
           /     \
      Air (🌬️)    Water (💧)
         \         /
          \       /
      Earth (🌍)──Fire (🔥)
```

**Components:**
- **Star Pairs (s₁-s₅):** Diagonal element relationships
- **Intersection Nodes (p₁-p₅):** Where star lines cross
- **Center Composite (C):** The heart of the pentagram
- **Symmetry Score (S_f):** How balanced the face is

**Consciousness Inquiry:**
> *"What pattern emerges when we hold all five elements together? What is the face trying to become?"*

---

## 📊 The Data Flow Pipeline

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        1. DATA SOURCE LAYER                             │
│                                                                          │
│  CSV/JSON Files                    Constants (SSOT)                     │
│  ─────────────                     ────────────────                     │
│  data/CSV_KPI_Database.csv    →    js/constants/kpi-constants.js        │
│  data/CSV_Face_Models.csv     →    js/constants/phi-harmonics.js        │
│  data/JSON_KPI_Database.json  →    js/constants/consciousness-constants.js
│                                                                          │
└─────────────────────────────────────┬───────────────────────────────────┘
                                      │
                                      ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                        2. LOADING LAYER                                 │
│                                                                          │
│  Loaders                           Purpose                              │
│  ───────                           ───────                              │
│  json-data-loader.js          →    Load JSON (preferred)                │
│  unified-data-loader.js       →    Orchestrate all loading              │
│  company-loader.js            →    Load company-specific data           │
│                                                                          │
│  Output: Raw KPI data in engine-compatible format                       │
└─────────────────────────────────────┬───────────────────────────────────┘
                                      │
                                      ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                        3. MODEL LAYER                                   │
│                                                                          │
│  Core Models (js/core/)                                                 │
│  ──────────────────────                                                 │
│  KPI.js                       →    Individual KPI model                 │
│  Face.js                      →    Face with 5-element structure        │
│  Edge.js                      →    Edge tension between faces           │
│  Vertex.js                    →    Vertex vortex at convergence         │
│                                                                          │
│  Output: Rich objects with calculated properties                        │
└─────────────────────────────────────┬───────────────────────────────────┘
                                      │
                                      ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                        4. CALCULATION ENGINE                            │
│                                                                          │
│  main.js (Quannex Engine)                                               │
│  ────────────────────────                                               │
│  ✓ Face energy calculation (Ball + Pillar + Pentagram)                 │
│  ✓ Global coherence (geometric mean of 12 faces)                       │
│  ✓ Breath axis balance (6 reception/projection pairs)                  │
│  ✓ Edge tension (30 interface metrics)                                 │
│  ✓ Vertex vortex (20 triadic convergences)                             │
│                                                                          │
│  Output: Complete coherence analysis                                    │
└─────────────────────────────────────┬───────────────────────────────────┘
                                      │
                                      ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                        5. VISUALIZATION LAYER                           │
│                                                                          │
│  2D Views                          3D View                              │
│  ────────                          ───────                              │
│  index.html (Dashboard)       →    pages/dodecahedron-3d.html           │
│  pages/breath-analysis.html        js/dodec/* (modular 3D system)       │
│  pages/results-summary.html                                              │
│                                                                          │
│  Output: Interactive organizational intelligence                        │
└─────────────────────────────────────┬───────────────────────────────────┘
                                      │
                                      ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                        6. CONSCIOUSNESS LAYER                           │
│                                                                          │
│  js/constants/consciousness-constants.js                                │
│  ───────────────────────────────────────                                │
│  CONSCIOUSNESS_INQUIRIES       →    Questions for any metric            │
│  ELEMENTAL_INQUIRIES           →    Element-specific questions          │
│  SHADOW_INQUIRIES              →    For organizational shadows          │
│  LOVE_INQUIRIES                →    When measurement becomes devotion   │
│                                                                          │
│  Output: Meaning, not just measurement                                  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🔢 PHI Constants Reference Table

| Constant | Symbol | Value | Usage |
|----------|--------|-------|-------|
| Ball weight | γ (gamma) | 0.6 | Primary KPI weighting |
| Element weight | α (alpha) | 0.6 | Pillar element influence |
| Intersection blend | β (beta) | 0.5 | Where elements meet |
| Nuanced average | κ (kappa) | 2.0 | Curvature intensity |
| Axis factor | δ (delta) | 0.9 | Breath coherence |
| Harmonic decay | η (eta) | 0.382 | PHI⁻² - resonance falloff |
| Pentagram ratio | θ (theta) | 0.618 | PHI⁻¹ - golden ratio |
| Vertex constant | λ (lambda) | 0.206 | Triadic convergence factor |
| Edge constant | ε (epsilon) | 0.236 | PHI⁻³ - membrane permeability |
| Sensitivity | ζ (zeta) | 0.0637 | Fine-tuning parameter |

**Source:** All constants are PHI-derived. See `js/constants/phi-harmonics.js` for mathematical proofs.

---

## 🗺️ Quick Reference: Module Connections

| Module | Role | Relationship |
|--------|------|--------------|
| `js/constants/kpi-constants.js` | SSOT for types | Defines what KPIs ARE |
| `js/kpi-library.js` | Suggestions | Suggests what to MEASURE |
| `js/ai/mapping/kpi-extractor.js` | AI extraction | Discovers what's in STORIES |
| `js/core/KPI.js` | Core model | Creates KPI INSTANCES |
| `js/main.js` | Calculation engine | CALCULATES coherence |

**The Complementary Functions:**
- **kpi-constants.js**: "Here are the types and structures"
- **kpi-library.js**: "Here are suggestions for each face/element"
- **kpi-extractor.js**: "Here's what I found in this narrative"
- **KPI.js**: "Here's the actual KPI object with calculations"

---

## 🧘 The Consciousness Dimension

Every KPI in Quannex carries a consciousness inquiry. This transforms measurement from analysis into presence.

### When Approaching Any KPI

From `js/constants/consciousness-constants.js`:

```javascript
CONSCIOUSNESS_INQUIRIES.invitation.whenJudging:
  "What would this look like at its most beautiful?"

CONSCIOUSNESS_INQUIRIES.love.gaze:
  "Can I look at this number with the same tenderness
   I would offer a child?"

CONSCIOUSNESS_INQUIRIES.meta.service:
  "Does this question serve understanding or control?"
```

### The Transformation

| From | To |
|------|----|
| Analysis | Presence |
| Judgment | Curiosity |
| Control | Understanding |
| Fear | Compassion |
| Competition | Collaboration |
| Measurement | Devotion |

---

## 📖 Related Documents

- **[DATA_FLOW_ARCHITECTURE.md](DATA_FLOW_ARCHITECTURE.md)** → UI to engine transformation details
- **[DATA_SYSTEM_GUIDE.md](DATA_SYSTEM_GUIDE.md)** → Complete data architecture
- **[SOUL_OF_QUANNEX.md](SOUL_OF_QUANNEX.md)** → Why we measure with consciousness

### Code References

- `js/constants/kpi-constants.js` → KPI type definitions (SSOT)
- `js/constants/consciousness-constants.js` → Inquiry library
- `js/constants/phi-harmonics.js` → PHI-derived constants
- `js/kpi-library.js` → Smart suggestions
- `js/ai/mapping/kpi-extractor.js` → AI extraction

---

*"A KPI is not a verdict. It is an invitation to see more clearly."*

