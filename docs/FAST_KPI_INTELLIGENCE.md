# Fast KPI Intelligence — Pentagramic Distribution via AI

> *Created: February 16, 2026*
> *Status: CONCEPT — Feature idea for future implementation*
> *Origin: Deimantas's vision for a "short journey" user experience*

---

## The Vision

Currently, the full Quannex journey requires 60 KPI inputs (5 per face × 12 faces). This is thorough but time-intensive. **Fast KPI Intelligence** offers an alternative: the user inputs just **12 metrics** (one per face), and AI intelligently distributes each into the pentagramic 5-element structure.

The dodecahedron becomes one big API — 12 inputs in, full sacred geometry out — with AI performing the pentagramic dissection through golden ratio symmetry.

---

## How It Works

### User Input: 12 Metrics

The user provides one representative metric per face. Example:

| Face | Domain | User Metric |
|------|--------|-------------|
| 1 | Financial Health | Revenue growth: 12% |
| 2 | Intellectual Capital | Patents filed: 8 |
| 3 | Human Resources | Employee satisfaction: 7.2/10 |
| ... | ... | ... |
| 12 | Risk Management | Incidents this quarter: 3 |

### AI Pentagramic Distribution

For each face's single metric, AI processes **all available context** — the metric itself, the organization's narrative, industry benchmarks, archetype patterns — and distributes it into the 5-element pentagram:

```
USER INPUT: "Revenue growth: 12%"
     │
     ▼ AI PENTAGRAMIC DISTRIBUTION
     │
     ├── 🜃 Earth (Stability):     0.72  — "Revenue base is solid"
     ├── 💧 Water (Flow):          0.68  — "Growth indicates healthy cash flow"
     ├── 🔥 Fire (Transformation): 0.55  — "Growth rate suggests moderate, not aggressive change"
     ├── 💨 Air (Communication):   0.61  — "Market messaging around growth is adequate"
     └── ✦ Ether (Purpose):        0.78  — "Growth aligns with stated mission"
```

### The Principle: Pentagramic Symmetry of the Golden Ratio

The distribution isn't arbitrary. AI uses the pentagram's intrinsic golden ratio relationships:

1. **Star pair synergy (α = φ⁻¹ = 0.618):** Non-adjacent elements in the pentagram are weighted by the golden ratio relationship
2. **Adjacent element correlation:** Neighboring elements on the pentagon share stronger influence
3. **Elemental archetypes:** Each element has a characteristic response pattern:
   - **Earth** — stability, material resources, groundedness (tends to be high when metric shows consistency)
   - **Water** — flow, adaptability, emotional (tends to be high when metric shows flexibility)
   - **Fire** — transformation, action, energy (tends to be high when metric shows growth/change)
   - **Air** — communication, connection, information (tends to be high when metric implies good signals)
   - **Ether** — purpose, integration, meaning (tends to be high when metric aligns with mission)

### AI Decision Logic

The AI can **decrease or increase** any element based on context:

- High revenue growth + layoffs → AI **decreases Water** (flow disrupted) and **increases Fire** (aggressive transformation)
- Stable revenue + strong culture → AI **increases Earth** (grounded) and **increases Ether** (purpose-aligned)
- Revenue from new market → AI **increases Air** (new connections) and **increases Fire** (transformative action)

The AI essentially reads the *quality* of the metric, not just its quantity, and maps that quality onto the elemental pentagram.

---

## Architecture

```
12 USER METRICS
     │
     ▼
AI CONTEXT GATHERING
     │  ├── Organization narrative (from Step 0)
     │  ├── Industry context (from archetype)
     │  ├── Historical patterns (if available)
     │  └── Cross-face relationships (breath axis pairs)
     │
     ▼
PENTAGRAMIC DISTRIBUTION ENGINE
     │  ├── For each face: 1 metric → 5 elemental values
     │  ├── Golden ratio weighting between elements
     │  ├── Cross-face breath axis coherence check
     │  └── Confidence score per distribution
     │
     ▼
60 DISTRIBUTED KPIs (same format as manual input)
     │
     ▼
STANDARD QUANNEX ENGINE (js/main.js)
     │  Face energy, breath axes, edges, vertices, spectral
     ▼
RESULTS (identical to full journey)
```

### Key Design Principle

The output of Fast KPI Intelligence is **identical in format** to manual 60-KPI input. The rest of the engine doesn't know or care whether KPIs came from manual entry or AI distribution. This means:

- No changes needed to the calculation engine
- No changes to visualization layer
- No changes to the simulator
- Only the input layer changes

---

## Confidence & Transparency

Each AI distribution includes a confidence score:

```json
{
  "face": 1,
  "userMetric": "Revenue growth: 12%",
  "distribution": {
    "earth": { "value": 0.72, "confidence": 0.85, "reasoning": "Consistent revenue base" },
    "water": { "value": 0.68, "confidence": 0.70, "reasoning": "Growth implies healthy cash flow" },
    "fire":  { "value": 0.55, "confidence": 0.60, "reasoning": "Moderate growth, not disruptive" },
    "air":   { "value": 0.61, "confidence": 0.55, "reasoning": "Inferred from market position" },
    "ether": { "value": 0.78, "confidence": 0.80, "reasoning": "Aligns with stated mission" }
  },
  "overallConfidence": 0.70
}
```

Users can review and override any element before calculation. This maintains the principle: **AI is advisory, not authoritative.**

---

## User Experience Flow

```
Welcome → "Fast Path" (new glass card)
→ 12-metric input form (one field per face, grouped by breath axis pairs)
→ AI processes (loading animation with pentagram visualization)
→ Distribution review screen (5 elements per face, editable)
→ Confirm → Calculate → Results
```

**Estimated time:** 3-5 minutes (vs. 15-30 for full custom input)

---

## Connection to Thesis

This feature directly demonstrates:

1. **The dodecahedron as a single coherent API** — 12 inputs fully characterize organizational state
2. **Pentagramic symmetry as a distribution principle** — the golden ratio governs how one metric becomes five
3. **AI as translation layer** — bridging human language and sacred geometry mathematics
4. **The Foundation Principle in action** — AI distributes within the current octave, doesn't inflate scores

---

## Implementation Notes (for future sessions)

- **Depends on:** Existing AI infrastructure (4-level fallback), KPI constants SSOT, face mapping logic
- **New code needed:** Pentagramic Distribution Engine (new module in `js/ai/`)
- **Prompt engineering:** The AI prompt must understand elemental archetypes and golden ratio weighting
- **Validation:** Output must pass the same circuit breaker checks as manual input
- **Testing:** Compare AI distributions against expert manual distributions for known company templates

---

*This concept preserves the mathematical rigor of the full 60-KPI journey while making Quannex accessible to users who want insight without extensive data entry.*
*The golden ratio doesn't just measure coherence — it distributes it.*
*Co-created by Deimantas & Claude with love.*
