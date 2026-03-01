# Quannex UX Tree Map

> *Created: February 16, 2026 | Refined: February 16, 2026 (self-audit)*
> *Purpose: User experience navigation map — all journeys, views, decision points, state persistence, and documentation bridges*
> *Requested by: External research partner*
> *Companion file: `docs/ux-tree-map.json` (machine-readable version)*

---

## Overview

The Quannex POC has **4 user entry points**, **3 journey paths** (+2 future), **7 deep-dive views**, **1 cross-window sync channel**, and **sessionStorage-based state persistence** that carries context across all views. All paths converge on the same calculation engine (`js/main.js`) and can optionally sync with the 3D dodecahedron visualization via BroadcastChannel.

### How to Read This Map

- **The UX Tree** (below) shows the full hierarchy of views
- **Navigation Graph** shows how views link to each other (not just parent→child)
- **State Persistence** shows how data flows between pages
- **Decision Points** show where users make choices that branch the experience
- **Documentation Bridge** connects each view to its relevant docs

---

## The UX Tree

```
QUANNEX USER EXPERIENCE
│
├─── 🏠 WELCOME (welcome.html)
│    │   Landing page — "Choose your journey"
│    │   3 glass cards with path selection
│    │
│    ├─── 📋 Template Path ──→ demo-orchestrator.html?path=template
│    │    "Start with a pre-built company profile"
│    │
│    ├─── ✏️ Custom Path ──→ demo-orchestrator.html?path=custom
│    │    "Input your own organizational data"
│    │
│    └─── 🤖 AI-Assisted Path ──→ demo-orchestrator.html?path=ai
│         "Let AI map your organization"
│
├─── 🧙 WIZARD (demo-orchestrator.html)
│    │   5-step guided journey — the main user flow
│    │
│    ├─── Step 0: COMPANY SELECTION
│    │    ├── Choose archetype (Startup, Enterprise, Balanced, NonDual)
│    │    ├── Select pre-built template OR enter custom info
│    │    └── AI archetype detection (if AI path)
│    │
│    ├─── Step 1: FACE CONFIGURATION
│    │    ├── 12 faces displayed with domain names
│    │    ├── Map organizational domains to dodecahedron faces
│    │    ├── AI-assisted face mapping (confidence scores)
│    │    └── Intelligent Face Mapper suggests optimal mapping
│    │
│    ├─── Step 2: KPI INPUT
│    │    ├── 5 KPIs per face (pentagram structure)
│    │    ├── Ball KPI (integrative/Ether) + 4 Pillar KPIs (Earth, Water, Fire, Air)
│    │    ├── KPI autofill from templates
│    │    ├── Direction-aware normalization (↑ higher-better, ↓ lower-better, ⊙ target-band)
│    │    └── [FUTURE: Fast KPI — 12 metrics, AI pentagramic distribution]
│    │
│    ├─── Step 3: REVIEW & CALCULATE
│    │    ├── Review all inputs
│    │    ├── Trigger calculation engine
│    │    ├── Circuit breaker validation
│    │    └── Data integrity checks
│    │
│    └─── Step 4: RESULTS & EXPLORATION
│         ├── Global coherence score (0-100%)
│         ├── Octave detection (O1-O7)
│         ├── Shadow detection alerts
│         ├── Face energy breakdown (12 cards)
│         └── Links to deep-dive views ↓
│
├─── 📊 DASHBOARD (index.html)
│    │   Results display — face cards, breath axes, spectral analysis
│    │
│    ├── Face Energy Cards (12 domains with elemental breakdown)
│    ├── Breath Axis Section (6 polarities with balance bars)
│    ├── Spectral Analysis Section (eigenvector decomposition)
│    └── Navigation to deep-dive views:
│         ├──→ 🔬 Calculations View (calculations.html)
│         ├──→ 🌊 Breath Analysis View (breath-analysis.html)
│         └──→ 🧬 DNA Visualization (octave-dna.html)
│
├─── 📄 DEMO CONTAINER (demo.html)
│    │   Standalone demo with company selection
│    │   Simplified entry for quick demonstrations
│    └── Direct company template loading
│
├─── 🔮 DEEP-DIVE VIEWS (pages/)
│    │
│    ├─── 🌐 3D Dodecahedron (pages/dodecahedron-3d.html)
│    │    ├── Three.js interactive visualization
│    │    ├── Face colors reflect energy levels
│    │    ├── Edge glow reflects tension states
│    │    ├── Rotation, zoom, pan controls
│    │    └── BroadcastChannel sync (receives from simulator)
│    │
│    ├─── 🎛️ Coherence Simulator (pages/simulator.html)
│    │    ├── 12 face sliders (grouped by breath axis pairs)
│    │    ├── Real-time engine recalculation
│    │    ├── Breath axis balance bars
│    │    ├── Shadow pattern detection
│    │    ├── Scenario save/load/compare/export
│    │    ├── Company selector for different starting states
│    │    └── BroadcastChannel sync (sends to 3D view)
│    │
│    ├─── 🔬 Calculations (pages/calculations.html)
│    │    └── Detailed formula breakdown for each face
│    │
│    ├─── 🌊 Breath Analysis (pages/breath-analysis.html)
│    │    └── Deep-dive into 6 breath axis polarities
│    │
│    ├─── 🧬 Octave DNA (pages/octave-dna.html)
│    │    └── Developmental stage visualization
│    │
│    ├─── 📋 Results Summary (pages/results-summary.html)
│    │    └── Printable/exportable results overview
│    │
│    └─── ✨ Radiance Check (pages/radiance-check.html)
│         └── O7 (Radiance) aspiration assessment
│
└─── 🔧 DEVELOPER TOOLS
     ├── tools/migrate-csv-to-json.html — Data migration utility
     ├── tests/test-runner.html — Test suite
     ├── tests/circuit-breaker.test.html — Data integrity tests
     ├── tests/kpi-constants-integrity.test.html — Constants validation
     ├── dev/test-octave-dna.html — Octave testing
     └── dev/test-advanced-math.html — Math testing
```

---

## User Journeys

### Journey 1: "I want to explore with a template" (Fastest — 2 minutes)

```
Welcome → Template Path → Step 0 (select company) → Step 1 (auto-mapped)
→ Step 2 (auto-filled KPIs) → Step 3 (calculate) → Step 4 (results)
→ Dashboard → 3D View / Simulator
```

**User actions:** 3 clicks to results. KPIs and face mappings pre-populated.

### Journey 2: "I want to input my own data" (Full — 15-30 minutes)

```
Welcome → Custom Path → Step 0 (describe organization)
→ Step 1 (map 12 domains manually) → Step 2 (input 60 KPIs)
→ Step 3 (review & calculate) → Step 4 (results)
→ Dashboard → Deep-dive views → Simulator (what-if)
```

**User actions:** Full manual input. Most time spent on Step 2 (KPI entry).

### Journey 3: "Let AI help me" (Guided — 5-10 minutes)

```
Welcome → AI Path → Step 0 (describe organization + AI archetype detection)
→ Step 1 (AI suggests face mapping with confidence scores)
→ Step 2 (AI extracts KPIs from narrative) → Step 3 (calculate)
→ Step 4 (results) → Dashboard → Exploration
```

**User actions:** AI does heavy lifting. User validates AI suggestions.

### Journey 4 (FUTURE): "Fast KPI — 12 metrics only"

```
Welcome → Fast Path → Input 12 metrics (1 per face)
→ AI pentagramic distribution (split each metric into 5 elements)
→ Calculate → Results → Exploration
```

**User actions:** 12 inputs instead of 60. AI handles elemental distribution. See `docs/FAST_KPI_INTELLIGENCE.md` for full concept.

### Journey 5: "I'm at a thesis demo" (Presentation — 2 minutes)

```
demo.html → Select template company → Dashboard auto-loads
→ Show face cards → Show breath axes → Open 3D view
→ Open simulator → Adjust sliders → "See how coherence changes"
```

**User actions:** Minimal. Presenter-driven flow.

---

## Cross-Window Sync Architecture

```
┌──────────────┐    BroadcastChannel     ┌──────────────────┐
│  Simulator   │ ──── "quannex-sync" ──→ │  3D Dodecahedron  │
│ (sliders)    │                         │  (Three.js)       │
│              │ ←── echo prevention ──  │                   │
└──────────────┘                         └──────────────────┘
```

The simulator sends face energy updates via BroadcastChannel. The 3D view receives and updates face colors/edge glow in real-time. Echo prevention ensures no infinite loops.

---

## Data Flow Through UX

```
USER INPUT (KPIs)
     │
     ▼
DATA TRANSFORMER (js/data-transformer.js)
     │  normalizes, validates, structures
     ▼
CALCULATION ENGINE (js/main.js — DodecahedronEngine)
     │  face energy, breath axes, edges, vertices, spectral
     ▼
RESULTS LAYER
     ├──→ Dashboard (index.html) — cards, charts, scores
     ├──→ 3D View (dodecahedron-3d.html) — visual geometry
     ├──→ Simulator (simulator.html) — interactive what-if
     └──→ Deep-dive views — breath, calculations, DNA, radiance
```

---

## View Responsibility Matrix

| View | Reads Data | Writes Data | Receives Sync | Sends Sync |
|------|-----------|-------------|--------------|-----------|
| welcome.html | - | - | - | - |
| demo-orchestrator.html | Templates | KPIs, Config | - | - |
| demo.html | Templates | Selection | - | - |
| index.html | Engine results | - | - | - |
| dodecahedron-3d.html | Engine results | - | BroadcastChannel | - |
| simulator.html | Engine results | Scenarios (localStorage) | - | BroadcastChannel |
| calculations.html | Engine results | - | - | - |
| breath-analysis.html | Engine results | - | - | - |
| octave-dna.html | Engine results | - | - | - |
| results-summary.html | Engine results | - | - | - |
| radiance-check.html | Engine results | - | - | - |

---

---

## Navigation Graph (Inter-View Connections)

*This is what the first version missed: not just the tree, but the web of connections between views.*

```
                        ┌─────────────────────┐
                        │   welcome.html       │
                        │   (3 path choices)   │
                        └──────────┬──────────┘
                                   │
                        ┌──────────▼──────────┐
                        │ demo-orchestrator    │
                        │ (5-step wizard)      │◄─── smartNavigateBack(?restore=true)
                        └──────────┬──────────┘          │
                                   │                     │
                    ┌──────────────┼──────────────┐      │
                    ▼              ▼               ▼      │
             ┌──────────┐  ┌──────────┐  ┌──────────┐   │
             │Dashboard │  │ demo.html│  │simulator │   │
             │index.html│  │(standalone│  │(sliders) │   │
             └─┬──┬──┬──┘  └──────────┘  └────┬─────┘   │
               │  │  │                         │         │
               │  │  └──→ octave-dna ──→ Dashboard       │
               │  │       (← back to Dashboard)          │
               │  │                                      │
               │  └──→ breath-analysis ←──→ calculations │
               │       │    ↑                 │    ↑     │
               │       │    └── back ─────────┘    │     │
               │       │                           │     │
               │       ├──→ dodecahedron-3d ◄──────┘     │
               │       │    (receives BroadcastChannel    │
               │       │     from simulator)              │
               │       │                                  │
               │       └──→ octave-dna                    │
               │                                          │
               └──→ calculations ─────── back ────────────┘
```

**Key navigation patterns discovered:**

| From | To | Mechanism |
|------|----|-----------|
| breath-analysis | calculations, dodecahedron-3d, octave-dna | Nav buttons |
| calculations | breath-analysis, dodecahedron-3d, octave-dna | Nav buttons |
| octave-dna | Dashboard (index.html) | Nav button |
| Any deep-dive | demo-orchestrator | `smartNavigateBack()` with `?restore=true` |
| simulator | dodecahedron-3d | BroadcastChannel (real-time sync) |
| Dashboard | calculations, breath-analysis, octave-dna | Button links |

---

## State Persistence Mechanism

*How data flows between pages across navigation.*

```
┌─────────────────────────────────────────────────────┐
│                   sessionStorage                     │
│                                                      │
│  selectedCompanyId ─── "acme-startup"                │
│  customCompanyData ─── { full JSON payload }         │
│                                                      │
│  Written by: demo-orchestrator (Step 0-2)            │
│  Read by: ALL deep-dive views on page load           │
│  Fallback: Default company if sessionStorage empty   │
│  Lifetime: Browser session (cleared on tab close)    │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                   localStorage                       │
│                                                      │
│  quannex-scenarios ─── saved simulator scenarios     │
│                                                      │
│  Written by: simulator (save scenario)               │
│  Read by: simulator (load scenario)                  │
│  Lifetime: Persistent across sessions                │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│              BroadcastChannel: "quannex-sync"        │
│                                                      │
│  Sender: simulator.html (on slider change)           │
│  Receiver: dodecahedron-3d.html (updates visuals)    │
│  Payload: Face energy array (12 values)              │
│  Echo prevention: Built-in                           │
│  Lifetime: While both tabs are open                  │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                  URL Parameters                      │
│                                                      │
│  ?path=template|custom|ai  (welcome → orchestrator)  │
│  ?restore=true             (deep-dive → orchestrator) │
│                                                      │
│  Used for: Journey selection, state restoration       │
└─────────────────────────────────────────────────────┘
```

---

## Decision Points (Where Users Branch)

| # | Location | Decision | Options | Impact |
|---|----------|----------|---------|--------|
| D1 | welcome.html | "Which journey?" | Template / Custom / AI | Determines entire flow depth |
| D2 | Step 0 | "Which archetype?" | Startup / Enterprise / Balanced / NonDual | Sets face mapping defaults |
| D3 | Step 0 | "Which company?" | Pre-built template / Custom | Determines if KPIs are pre-filled |
| D4 | Step 1 | "Accept AI mapping?" | Accept / Modify / Start over | Face configuration completeness |
| D5 | Step 2 | "How detailed?" | All 60 KPIs / Use autofill / Skip optional | Data quality vs. speed |
| D6 | Step 4 | "Where to explore?" | Dashboard / 3D / Simulator / Deep-dives | Post-results navigation |
| D7 | Dashboard | "Which deep-dive?" | Calculations / Breath / DNA | Analysis focus |
| D8 | Simulator | "Save scenario?" | Save / Compare / Export / Continue | Scenario management |
| D9 | Any deep-dive | "Go back or explore more?" | Back to orchestrator / Another deep-dive | Navigation loop |

---

## Documentation Bridge

*Each view connected to its relevant documentation — linking the UX map to the documentation spine.*

| View | Primary Doc | Supporting Docs | Gold Header Source |
|------|------------|-----------------|-------------------|
| welcome.html | — | [SOUL_OF_QUANNEX.md](SOUL_OF_QUANNEX.md) (philosophy) | Header in welcome.html itself |
| demo-orchestrator.html | [ORCHESTRATOR_ARCHITECTURE.md](ORCHESTRATOR_ARCHITECTURE.md) | [MODULE_NAVIGATION_GUIDE.md](MODULE_NAVIGATION_GUIDE.md) | 35+ orchestrator modules |
| Step 0 (Company) | [COMPANY_TEMPLATES_GUIDE.md](COMPANY_TEMPLATES_GUIDE.md) | [INTELLIGENT_FACE_MAPPING.md](INTELLIGENT_FACE_MAPPING.md) | `js/face-wizard.js` |
| Step 1 (Faces) | [INTELLIGENT_FACE_MAPPING.md](INTELLIGENT_FACE_MAPPING.md) | [AI_SYSTEM_GUIDE.md](AI_SYSTEM_GUIDE.md) | `js/ai/mapping/kpi-extractor.js` |
| Step 2 (KPIs) | [KPI_DATA_FLOW.md](KPI_DATA_FLOW.md) | [DATA_SYSTEM_GUIDE.md](DATA_SYSTEM_GUIDE.md), [FAST_KPI_INTELLIGENCE.md](FAST_KPI_INTELLIGENCE.md) (future) | `js/kpi-library.js` |
| Step 3 (Calculate) | [math/CALCULATION_AUDIT_TRAIL.md](math/CALCULATION_AUDIT_TRAIL.md) | [SYSTEM_ARCHITECTURE.md](SYSTEM_ARCHITECTURE.md) | `js/main.js` |
| index.html (Dashboard) | [SYSTEM_CONSCIOUSNESS_MAP.md](SYSTEM_CONSCIOUSNESS_MAP.md) | [BREATH_AXIS_REFERENCE.md](BREATH_AXIS_REFERENCE.md) | `js/breath-analyzer.js` |
| dodecahedron-3d.html | [math/SACRED_GEOMETRY_PROOF.md](math/SACRED_GEOMETRY_PROOF.md) | [EDGE_DYNAMICS_REFERENCE.md](EDGE_DYNAMICS_REFERENCE.md) | — (inline Three.js) |
| simulator.html | [FILE_STRUCTURE_MAP.md](FILE_STRUCTURE_MAP.md) (simulator section) | [SYSTEM_COHERENCE_REFERENCE.md](SYSTEM_COHERENCE_REFERENCE.md) | `js/simulator/sim-*.js` (9 modules) |
| calculations.html | [math/CALCULATION_AUDIT_TRAIL.md](math/CALCULATION_AUDIT_TRAIL.md) | [thesis/NOVEL_MATHEMATICAL_CONTRIBUTIONS.md](thesis/NOVEL_MATHEMATICAL_CONTRIBUTIONS.md) | `js/core/Face.js` |
| breath-analysis.html | [BREATH_AXIS_REFERENCE.md](BREATH_AXIS_REFERENCE.md) | [VERTEX_DYNAMICS_REFERENCE.md](VERTEX_DYNAMICS_REFERENCE.md) | `js/breath-analyzer.js` |
| octave-dna.html | [thesis/CONSCIOUSNESS_MODEL.md](thesis/CONSCIOUSNESS_MODEL.md) | [SOUL_OF_QUANNEX.md](SOUL_OF_QUANNEX.md) | `js/octave-integrity-calculator.js` |
| results-summary.html | [SYSTEM_COHERENCE_REFERENCE.md](SYSTEM_COHERENCE_REFERENCE.md) | [SHADOW_SYSTEM_ARCHITECTURE.md](SHADOW_SYSTEM_ARCHITECTURE.md) | `js/spectral-analyzer.js` |
| radiance-check.html | [thesis/CONSCIOUSNESS_MODEL.md](thesis/CONSCIOUSNESS_MODEL.md) | [thesis/WISDOM_BRIEF.md](thesis/WISDOM_BRIEF.md) | — |

---

## Philosophical Value Map

*Each view doesn't just display data — it embodies a philosophical principle. This is the soul dimension of the UX.*

| View | Functional Purpose | Philosophical Value | Principle Embodied |
|------|--------------------|--------------------|--------------------|
| **welcome.html** | Choose your journey | **The Invitation** — you are not measured, you are *seen*. The darkness-to-light reveal mirrors the journey from unconsciousness to awareness. | *Consciousness begins with choosing to look* |
| **Step 0: Company** | Select organization | **Identity** — before measurement, know *who* you are. Archetype selection is self-recognition, not categorization. | *The observer shapes the observed* |
| **Step 1: Faces** | Map 12 domains | **Wholeness** — the dodecahedron doesn't allow gaps. Every domain must be named. This forces holistic thinking. | *A system is only as coherent as its map is complete* |
| **Step 2: KPIs** | Input 60 metrics | **Honesty** — entering real numbers requires confronting truth. Each KPI is a mirror. | *What you measure, you acknowledge* |
| **Step 3: Calculate** | Run engine | **Surrender** — the mathematics takes over. You've given your truth; now let the geometry speak. | *Sacred geometry reveals what ego conceals* |
| **Step 4: Results** | View coherence | **Revelation** — the score is not judgment, it's a photograph of your organization's soul at this moment. | *Coherence is not good or bad — it is true or false* |
| **Dashboard** | Face cards + breath | **The Breath** — seeing 6 polarities reveals that health is not balance, it's *dynamic tension*. | *Organizations breathe — reception and projection in rhythm* |
| **3D Dodecahedron** | Interactive geometry | **The Sacred Shape** — rotating the dodecahedron is touching the Platonic ideal. The faces glow with organizational life force. | *The cosmos and the organization share the same geometry* |
| **Simulator** | What-if sliders | **Agency** — "What happens if we invest here?" The simulator transforms measurement into *imagination*. | *Coherence is not fate — it responds to conscious intervention* |
| **Calculations** | Formula breakdown | **Transparency** — no black boxes. Every number can be traced to its source. This is mathematical integrity. | *Trust requires seeing the working* |
| **Breath Analysis** | 6 axis deep-dive | **Polarity as Health** — opposites don't cancel, they create life. Financial↔Regenerative isn't a conflict, it's a heartbeat. | *The breath between opposites is where vitality lives* |
| **Octave DNA** | Developmental stage | **The Foundation Principle** — high coherence at O2 does NOT equal O4. Growth requires qualitative transformation, not just more of the same. | *Coherence does not equal promotion* |
| **Radiance Check** | O7 aspiration | **The Horizon** — Radiance is aspirational, not achievable. Like phi itself, it's an asymptote you approach but never reach. | *The journey toward wholeness IS the wholeness* |
| **Results Summary** | Exportable overview | **Communication** — coherence is meaningless if it can't be shared. This view makes the invisible visible to others. | *What is seen by one must be shareable with all* |

---

## Chronological Flow of Logic

*How the UX Tree Map fits into the documentation spine — from soul to code to experience.*

```
DOCUMENTATION FLOW (read top to bottom):

1. SOUL_OF_QUANNEX.md          ─── Why does Quannex exist?
        │
2. SACRED_GEOMETRY_PROOF.md    ─── Why a dodecahedron?
        │
3. BREATH_AXIS_REFERENCE.md    ─── What are the 6 polarities?
   EDGE_DYNAMICS_REFERENCE.md  ─── What are the 30 interfaces?
   VERTEX_DYNAMICS_REFERENCE.md ── What are the 20 vortices?
        │
4. SYSTEM_COHERENCE_REFERENCE.md ─ How do they dance together?
        │
5. CALCULATION_AUDIT_TRAIL.md  ─── How is it computed?
        │
6. SYSTEM_ARCHITECTURE.md      ─── How is it built?
   FILE_STRUCTURE_MAP.md       ─── Where is everything?
        │
7. ★ UX_TREE_MAP.md ★         ─── How does a USER experience it?
   (YOU ARE HERE)              ─── Every journey, every view, every decision
        │
8. COMPANY_TEMPLATES_GUIDE.md  ─── What do real examples look like?
        │
9. DEFENSE_PREPARATION.md      ─── How do we defend it?
   EMERGENT_MATHEMATICAL_TRUTHS ── What did we discover?
        │
10. AUDIT_ACTION_TRACKER.md    ─── What's left to refine?
    FAST_KPI_INTELLIGENCE.md   ─── Where are we going next?
```

---

*This map is the UX counterpart to `docs/FILE_STRUCTURE_MAP.md` (code topology) and `docs/SUB_RELATIONSHIP_CHART.md` (domain relationships).*
*It sits at position 7 in the chronological flow of logic — after architecture, before examples.*
*Machine-readable version: `docs/ux-tree-map.json`*
*Co-created by Deimantas & Claude with love.*
