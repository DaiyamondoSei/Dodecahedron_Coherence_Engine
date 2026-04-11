# 🗺️ Quannex POC - Complete File Structure Map

## 📁 Directory Overview

```
POC/
├── 🌐 HTML Pages (User-facing)
├── 🧠 JavaScript Modules (Logic)
│   └── js/constants/ (PHI thresholds - NEW)
├── 📊 Data Files (Sample data + archive)
├── 🏢 Companies (Multi-company support + mapping-context)
├── 🔧 Backend Fallback (Calculation engine)
├── 📐 Math Documentation (Rigorous formulas)
├── 🧠 .claude/ (Development context - 4 agent perspectives)
└── 📄 Documentation
```

---

## 🌐 HTML Pages - What Opens What

### **Entry Points** (Where users start)

#### 1. **welcome.html** ⭐ PRIMARY LANDING PAGE (Recommended)
**Purpose:** Glass card selection interface — the front door to Quannex
**What it does:**
- Darkness-to-light reveal experience (CursorLight system)
- 3 glass cards presenting journey choices:
  - Template Path → pre-built company profiles
  - Custom Path → manual organizational data input
  - AI-Assisted Path → AI-guided face mapping
- Links to demo-orchestrator.html with `?path=` parameter

**When to use:**
- New users exploring Quannex for the first time
- Client onboarding sessions
- Full guided journey demonstrations

**URL:** `http://localhost:8000/welcome.html`

---

#### 2. **demo.html** ⭐ QUICK DEMO (Thesis Defense / Presentations)
**Purpose:** Pre-loaded company showcase with tab-based visualization
**What it does:**
- Company selection modal (Quannex, Nova Tech, etc.)
- Hosts 4 visualization views as iframes:
  - Dashboard (index.html)
  - 3D Dodecahedron (dodecahedron-3d.html)
  - DNA Helix (octave-dna.html)
  - Simulator (simulator.html)
- Tab navigation between views
- Keyboard shortcuts (1-4, arrows)

**When to use:**
- Thesis defense (minimal clicks, pre-loaded data)
- Video demos and presentations
- Investor pitches
- Quick standalone showcase

**URL:** `http://localhost:8000/demo.html`

---

#### 3. **demo-orchestrator.html** — DATA INPUT WIZARD
**Purpose:** 5-step guided wizard for custom data entry
**What it does:**
- Step 0: Company selection (archetype, template, or custom)
- Step 1: Face configuration (12 organizational domains)
- Step 2: KPI input (Quick: 12 KPIs, Full: 60 KPIs)
- Step 3: Review & calculate
- Step 4: Results & exploration (navigate to deep-dive views)

**When to use:**
- Entering your own company data
- Demonstrating the full user journey
- Client onboarding sessions
- Showing extensibility

**URL:** `http://localhost:8000/demo-orchestrator.html`

**Key feature:** Has data transformation layer built in!

---

#### 4. **index.html** — Dashboard View
**Purpose:** Results dashboard (usually reached via wizard or embedded in demo.html)
**What it does:**
- Shows global coherence score
- Displays all 12 faces with energy levels
- Face-by-face KPI breakdown
- Color-coded health status
- Loads data from CSV or company-loader

**When to use:**
- As standalone dashboard for development
- Embedded in demo.html (iframe)
- Reached from wizard Step 4 results

**URL:** `http://localhost:8000/index.html`

---

### **Visualization Pages** (Usually embedded in demo.html)

#### 5. **dodecahedron-3d.html** - Interactive 3D Geometry
**Purpose:** Rotating 3D dodecahedron visualization
**What it does:**
- Three.js 3D rendering
- Face coloring by energy level
- Interactive rotation (mouse/touch)
- Real-time updates
- Sacred geometry representation

**Best for:** Visual impact, presentations, "wow factor"

---

#### 5. **octave-dna.html** - DNA Helix Visualization
**Purpose:** Shows organizational evolution through 7 octaves
**What it does:**
- Double helix animation
- Maps 7 developmental stages (O1-O7)
- Shows current octave position
- Visualizes aspiration vs actuality
- Animated transitions

**Best for:** Explaining organizational maturity, evolution path

**Modular Architecture:** See `js/octave-dna/` below for the refactored module structure.

---

#### 5a. **js/octave-dna/** - DNA Helix Modules (14 files)

```
js/octave-dna/
├── index.js                    # Navigation map for Future Claude
├── octave-dna-main.js          # Thin orchestrator (218 lines)
├── README.md                   # Comprehensive module documentation
│
├── state/
│   └── octave-dna-state.js     # Central state registry
│
├── scene/
│   ├── scene-setup.js          # THREE.js camera, renderer, fog
│   └── scene-lighting.js       # Ambient + 3 point lights
│
├── visualization/
│   ├── helix-geometry.js       # DNA helix creation (PHI-normalized)
│   ├── helix-helpers.js        # Octave detection, color utilities
│   └── helix-rungs.js          # Breath rungs between strands
│
├── interaction/
│   ├── mouse-handler.js        # Raycasting & click handling
│   └── legend-handler.js       # Legend clicks & tooltips
│
├── animation/
│   └── animation-loop.js       # RAF loop & resize handling
│
├── panels/
│   ├── diagnostic-panel.js     # Panel visibility & tabs
│   ├── breath-tab.js           # Breath ratio analysis
│   └── pentagram-tab.js        # 5-element pentagram analysis
│
└── company/
    ├── company-dropdown.js     # Company selector UI
    └── company-loader.js       # Data loading & sessionStorage sync
```

**Key Features:**
- PHI constants imported from `phi-harmonics.js` (Single Source of Truth)
- Each module exports to `window.OctaveDNA*` namespace
- Self-documenting with "Notes for Future Claude" headers
- Reduced from 2,689-line monolith to 218-line orchestrator (92% reduction)

---

#### 5b. **js/shadow/overlay/** - Shadow Overlay Modules (7 files) - NEW Dec 21, 2025

```
js/shadow/overlay/
├── index.js                      # Barrel export + module manifest
├── shadow-state-manager.js       # State & sessionStorage persistence
├── shadow-card-renderer.js       # Card HTML generation (dual-form)
├── shadow-source-toggle.js       # AI/Template toggle class (~700 lines)
├── shadow-overlay-controller.js  # Modal open/close/toggle lifecycle
├── shadow-event-handlers.js      # Keyboard (S, ESC) & mouse events
└── shadow-system-integration.js  # Quannex sync & shadow panel hook

js/dodec/
└── dodec-shadow-overlay-orchestrator.js  # Page-specific wiring (~80 lines)
```

**Key Features:**
- Modularized from 1,785-line monolith to 6 focused modules (~1,990 lines total)
- Each module wrapped in IIFE to prevent global scope pollution
- Exports to `window.ShadowStateManager`, `window.ShadowCardRenderer`, etc.
- Unified namespace via `window.ShadowOverlay`
- No circular dependencies (state-manager has no deps, others depend on it)
- Self-documenting with "Notes for Future Claude" headers

**Dependency Graph:**
```
shadow-state-manager (no deps)
        │
   ┌────┼────┐
   ▼    ▼    ▼
card   src   event
render toggle handlers
   └────┼────┘
        ▼
   controller
        ▼
   sys-integration
```

---

#### 6. **simulator.html** - Full Vision Coherence Simulator
**Purpose:** Interactive what-if analysis for all 12 dodecahedron faces
**What it does:**
- 12 face energy sliders grouped in 6 breath axis pairs
- Real-time Quannex engine integration (coherence recalculation on every change)
- Breath axis balance visualization (6 polarity bars)
- Shadow pattern detection (heuristic + engine-based)
- BroadcastChannel sync for live 3D dodecahedron feedback
- Company selector with data reload
- Scenario save/load/compare/export

**Architecture:** Modular (9 JS + 7 CSS files, thin HTML shell)
```
js/simulator/
├── sim-state.js          # Central state registry (reads KpiConstants SSOT)
├── sim-controls.js       # 12 face sliders in 6 breath axis pairs
├── sim-engine.js         # Quannex engine integration + mock fallback
├── sim-company.js        # Company selector dropdown
├── sim-breath.js         # Breath axis balance bars
├── sim-shadow.js         # Shadow pattern detection display
├── sim-sync.js           # BroadcastChannel cross-window sync
├── sim-scenarios.js      # Save/load/compare/export scenarios
└── sim-main.js           # Orchestrator (12-phase init sequence)

css/simulator/
├── sim-main.css          # @import orchestrator
├── sim-base.css          # CSS variables, reset
├── sim-layout.css        # Grid layout, responsive
├── sim-controls.css      # Slider cards, per-face colors
├── sim-panels.css        # Impact, breath, shadow panels
├── sim-scenarios.css     # Scenario cards, toolbar
└── sim-animations.css    # Keyframes, utility classes
```

**Dependency Graph:**
```
sim-state (no deps - loaded first)
     │
  ┌──┼──────────┐
  ▼  ▼          ▼
company controls engine
  │      │       │
  └──┬───┘   ┌──┘
     ▼       ▼
   breath  shadow  sync  scenarios
     └───────┼───────┘
             ▼
          sim-main (orchestrator - loaded last)
```

**Status:** Fully implemented (February 2026)

---

## 🧠 JavaScript Modules - The Brain

### **Core Engine**

#### `js/main.js` ⭐ CALCULATION ENGINE
**The mathematical heart of Quannex**
```javascript
Contains:
- KPI class (normalization logic)
- Face class (pentagram analysis, harmonic resonance)
- Edge class (tension calculation)
- Vertex class (vortex dynamics)
- DodecahedronEngine (orchestrator)
- window.Quannex API (public interface)
```

**What it does:**
1. Loads CSV or JSON data
2. Creates 12 Face objects with 60 KPIs
3. Calculates face energies (pentagram harmonics)
4. Computes global coherence
5. Analyzes breath dynamics
6. Exposes results via `window.Quannex.getState()`

**Used by:** index.html, demo.html (in iframes)

---

### **Data Management**

#### `js/company-loader.js` - Multi-Company Support
**What it does:**
- Loads company profiles from `/companies/` folder
- Manages 5 company templates:
  - Quannex (founder self-assessment)
  - CEN — Conscious Enterprises Network (first external client, April 2026)
  - Nova Tech
  - Zenith Solutions
  - Apex Industries
- Parses `company.json` + `kpis.csv`
- Switches between datasets
- Exposes `window.CompanyLoader` API

**Used by:** demo.html (company selection modal)

---

#### `js/data-transformer.js` ⭐ NEW!
**The bridge between UI and Engine**
```javascript
Transforms:
  UI format (demo-orchestrator)
    ↓
  Engine format (main.js)
```

**What it does:**
- Converts property names (faceId → Face_ID)
- Validates data structure
- Ensures type safety
- Provides error messages
- Reverse transforms results for display

**Used by:** demo-orchestrator.html

---

### **UI Components**

#### `js/face-wizard.js` - Template System
**What it does:**
- Provides pre-built organizational templates:
  - Standard Business Model
  - Startup Framework
  - Non-Profit Model
- Manages face name selection
- Face customization UI

**Used by:** demo-orchestrator.html (Step 1)

---

#### `js/kpi-library.js` - KPI Suggestions
**What it does:**
- 100+ pre-defined KPI suggestions
- Organized by face type + element
- Auto-fill targets (min, ideal)
- Unit suggestions (%, $, count)
- Elemental wisdom (Earth, Water, Fire, Air, Ether)

**Used by:** demo-orchestrator.html (Step 2)

---

#### `js/demo-orchestrator-logic.js` - Wizard Logic
**What it does:**
- Step navigation (1→2→3→4)
- Progress tracking
- Form validation
- Data collection
- Calls data-transformer
- Calls calculation engine
- Results display

**Used by:** demo-orchestrator.html

---

### **Analysis Modules**

#### `js/breath-analyzer.js` - Breath Dynamics
**What it does:**
- Analyzes 6 polarity axes:
  1. Financial ↔ Funding
  2. Intellectual ↔ Brand
  3. Human ↔ Operations
  4. Regenerative ↔ Structural
  5. Values ↔ Market
  6. Risk ↔ Community
- Detects over-inhaling (receiving)
- Detects under-exhaling (giving)
- Calculates being-action balance

**Used by:** main.js (automatic analysis)

---

### **Constants & Thresholds** (NEW - December 2025)

#### `js/constants/octave-thresholds.js` ⭐ SINGLE SOURCE OF TRUTH
**What it does:**
- Defines PHI-based octave thresholds (0.382, 0.5, 0.618, 0.764, 0.854, 0.95)
- Exports lifecycle constraints (pre-seed max O2, enterprise max O6)
- Provides helper functions: `coherenceToOctave()`, `getOctaveByNumber()`
- Used by all octave-related calculations across the system

**Key Constants:**
```javascript
PHI = 1.618033988749895
PHI_INVERSE = 0.618       // φ^-1
PHI_SQUARED_INVERSE = 0.382  // φ^-2
```

**Used by:** main.js, octave-integrity-calculator.js, demo-orchestrator-logic.js

---

### **Advanced Calculation Modules** (NEW - December 2025)

#### `js/octave-integrity-calculator.js` ⭐ FOUNDATION PRINCIPLE
**What it does:**
- Implements the Foundation Principle: "High coherence at O1 ≠ promotion to O2"
- Calculates organizational octave from face octaves
- Applies spread penalty for structural misalignment
- Enforces lifecycle constraints

**Key Formula:**
```
Org Octave = floor(geometric_mean(face_octaves) - spread_penalty)
```

**Used by:** demo-orchestrator-logic.js, company analysis

---

#### `js/context-synthesizer.js` - Edge/Vertex Generation
**What it does:**
- Unifies template and custom data flows
- Generates 30 edges from 12 faces (topology)
- Generates 20 vertices from faces (triadic synergy)
- Applies elemental harmony matrix (PHI-based modifiers)
- Handles known data gaps defensively (F10-Ether defaults)

**Used by:** demo-orchestrator-logic.js, company-loader.js

---

#### `js/company-templates-bundle.js` - Offline Fallback
**What it does:**
- Embedded minimal templates for 4 companies
- Fallback API when modules fail on file:// protocol
- Contains: faces, edges, vertices, breathAxes, shadowPatterns
- Enables demo to work without network

**Used by:** demo.html (offline mode)

---

### **UI Enhancement Modules** (NEW - December 2025)

#### `js/harmonic-tuner-tooltips.js` - Parameter Education
**What it does:**
- Rich tooltips for 8 tuning parameters (α, β, γ, δ, κ, η, ζ, θ)
- Educational descriptions with optimal ranges
- PHI-based timing (382ms show delay)
- Effects and warnings for each parameter

**Used by:** harmonic-tuner.js

---

#### `js/dna-preview-mini.js` - Breath Axis Animation
**What it does:**
- Canvas-based DNA helix animation
- Renders double helix for breath axis visualization
- Phase 2 enhancement for face detail panels
- Animates with PHI-based timing
- Colors: Cyan (reception), Magenta (projection)

**Used by:** index.html (face detail panels)

---

## 📊 Data Files

### **Sample Data (CSV)**

#### `data/CSV_KPI_DATABASE.csv`
- Master KPI definitions
- Default values for testing
- Used by index.html when no company selected

#### `data/CSV_FACE_MODELS.csv`
- Face definitions
- Edge mappings
- Vertex configurations

#### Other CSV files:
- `CSV_BREATH_RATIOS.csv` - Breath analysis config
- `CSV_EDGE_TENSION_MAP.csv` - Edge definitions
- `CSV_VORTEX_MAP.csv` - Vertex (20 points)
- `CSV_SYSTEM_COHERENCE.csv` - Global coherence thresholds

---

### **Company Data (JSON + CSV)** (Enhanced December 2025)

```
companies/
├── cen/                   ★ FIRST EXTERNAL CLIENT (April 2026)
│   ├── company.json       (CEN metadata, 12 faces, co-founder story)
│   ├── kpis.csv           (60 KPIs from D+E average of frozen Phase 2 scores)
│   └── mapping-context.json (Full topology: 12F, 41E, 20V, 6 axes, 4 shadows)
├── quannex/
│   ├── company.json       (Profile, story, challenges)
│   ├── kpis.csv           (60 KPI values)
│   └── mapping-context.json ⭐ (Full mapping: faces, edges, vertices, shadows)
├── nova-tech/
│   ├── company.json
│   ├── kpis.csv
│   └── mapping-context.json
├── zenith-solutions/
│   ├── company.json
│   ├── kpis.csv
│   └── mapping-context.json
└── apex-industries/
    ├── company.json
    ├── kpis.csv
    └── mapping-context.json
```

#### The Four Teaching Examples

| Company | Stage | Octave | Key Pattern | Use For |
|---------|-------|--------|-------------|---------|
| **Quannex** | Pre-seed | O1-O2 | Aspiration-Actuality Gap | Startup with vision |
| **Nova Tech** | Seed | O2-O3 | Death Spiral (burnout) | Resource exhaustion |
| **Zenith Solutions** | Growth | O3-O4 | Organizational Debt | Scaling challenges |
| **Apex Industries** | Enterprise | O6-O7 | Integrated Excellence | Mature organization |

#### mapping-context.json Structure (NEW)

```json
{
  "faces": [
    {
      "id": "F1",
      "name": "Financial Capital",
      "octave": 1,
      "sentiment": 0.45,
      "elements": { "Earth": 0.3, "Water": 0.5, ... }
    }
  ],
  "edges": [
    {
      "id": "E1",
      "faces": ["F1", "F2"],
      "tension": 0.35,
      "elementalNature": "Earth-Water"
    }
  ],
  "vertices": [
    {
      "id": "V1",
      "faces": ["F1", "F2", "F3"],
      "vortexStrength": 0.62,
      "classification": "synergy_hub"
    }
  ],
  "shadowPatterns": [
    {
      "name": "Visionary Bypass",
      "description": "Brilliant ideas without execution capacity"
    }
  ]
}
```

**See:** [COMPANY_TEMPLATES_GUIDE.md](COMPANY_TEMPLATES_GUIDE.md) for complete documentation.

**Legacy Format (still supported):**
```json
// company.json
{
  "id": "quannex",
  "name": "Quannex",
  "tagline": "...",
  "stage": "Pre-Seed",
  "octaveProfile": { ... },
  "challenges": [ ... ],
  "strengths": [ ... ]
}
```

```csv
# kpis.csv
KPI_ID,KPI_Name,Value,Weight,Direction,Target_Min,Target_Ideal,...
F1_E1,Monthly Runway,5.3,1.0,↑,3,6,...
```

---

## 🔧 Backend Fallback

**Purpose:** Node.js calculation engine (alternative to browser-based main.js)

```
backend-fallback/
├── models/
│   ├── Dodecahedron.js      (Main orchestrator)
│   ├── Face.js              (Face logic)
│   ├── KPI.js               (KPI normalization)
│   ├── Edge.js              (Edge tension)
│   ├── Vertex.js            (Vortex dynamics)
│   ├── PentagramAnalyzer.js (Harmonic resonance)
│   ├── ShadowPenaltyEngine.js (Ethical patterns)
│   ├── BreathAnalyzer.js    (Breath dynamics)
│   └── SpectralAnalyzer.js  (Eigenvalue analysis)
├── data/
│   └── sampleData.js        (Test data)
└── utils/
    └── OctaveCSVParser.js   (CSV parsing)
```

**Used by:** Could be used for server-side processing (not currently active)

---

## 📄 Documentation

### Core Docs
- `README.md` - Project overview & quick start
- `DOCUMENTATION_INDEX.md` - Master index of all docs
- `DEMO_GUIDE.md` - Complete feature walkthrough
- `FILE_STRUCTURE_MAP.md` ⭐ THIS FILE
- `DATA_FLOW_ARCHITECTURE.md` - Data pipeline explanation
- `INTEGRATION_GUIDE.md` - Custom data integration
- `COMPANY_TEMPLATES_GUIDE.md` ⭐ NEW - Teaching examples guide

### Math Docs (in `/math/`)
- `MATH_OVERVIEW.md` - Start here for mathematical framework
- `PENTAGRAM_ANALYSIS.md` - Elemental harmony calculations
- `BREATH_DYNAMICS.md` - 6 breath axes analysis
- `OCTAVE_FRAMEWORK.md` - 7 developmental stages + Foundation Principle
- `FOUNDATION_PRINCIPLE.md` ⭐ NEW - Coherence ≠ Promotion deep dive
- `SPECTRAL_SHADOW.md` - Advanced spectral/shadow analysis

### Novel Research
- `NOVEL_MATHEMATICAL_CONTRIBUTIONS.md` ⭐ - 4 breakthrough frameworks
- `COMPLETE_SYSTEM_GUIDE.md` ⭐ - Full technical implementation

---

## 🧠 Claude Development Context (.claude/)

**Purpose:** Focused agent perspectives and documentation templates

```
.claude/
├── agents/
│   ├── chief-risk-manager.md          (Risk analysis & resilience)
│   ├── dodecahedron-consciousness-architect.md (Sacred geometry & harmonics)
│   ├── heartmath-universal-bridge.md  (Translation & accessibility)
│   └── sacred-tech-architect.md       (Architecture & technical vision)
├── DOCUMENTATION_TEMPLATE.md     (Templates for consistent docs)
├── mcp.json                      (MCP server configuration)
└── settings.local.json           (Local project settings)
```

**What it is:**
- 4 focused agent perspectives for specialized guidance
- Documentation templates for code consistency
- Development workflow support

**When to use:**
- Risk assessment & mitigation → Chief Risk Manager
- Sacred geometry & PHI mathematics → Dodecahedron Consciousness Architect
- Making complex ideas accessible → HeartMath Universal Bridge
- Architecture & system design → Sacred Tech Architect

**Note:** Agent docs are for development process, not end-user features.

---

## 🎯 Which File to Use When

### **For New Users / Full Experience**
→ `welcome.html` ⭐ (glass card landing → choose journey → wizard → results)

### **For Video Demos / Thesis Defense**
→ `demo.html` (pre-loaded companies → instant visualization)

### **For Custom Data Entry**
→ `welcome.html` or `demo-orchestrator.html` directly (wizard interface)

### **For Development/Testing**
→ `index.html` (standalone dashboard)

### **For 3D Showcase**
→ `dodecahedron-3d.html` (standalone 3D)

### **For Academic Presentation**
→ `demo.html` + `math/CALCULATION_AUDIT_TRAIL.md` (visual + theory)

---

## 🔄 Data Flow Paths

### **Path 0: Welcome Journey** ⭐ (Recommended for new users)
```
User opens welcome.html
  ↓
Chooses journey path (Template / Custom / AI)
  ↓
Redirects to demo-orchestrator.html?path=template|custom|ai
  ↓
5-step wizard (company → faces → KPIs → calculate → results)
  ↓
Results navigate to deep-dive views:
  - Dashboard (index.html)
  - 3D Dodecahedron (dodecahedron-3d.html)
  - Simulator (simulator.html)
  - Breath Analysis (breath-analysis.html)
  - Calculations (calculations.html)
```

### **Path 1: Pre-loaded Company Demo** (Thesis defense / presentations)
```
User opens demo.html
  ↓
Clicks "Try Sample Companies"
  ↓
Selects "Quannex"
  ↓
company-loader.js loads:
  - companies/quannex/company.json
  - companies/quannex/kpis.csv
  ↓
Passes to main.js (in iframe)
  ↓
main.js creates DodecahedronEngine
  ↓
Calculates coherence
  ↓
Renders in index.html (dashboard iframe)
  ↓
User can switch tabs to see:
  - 3D view (dodecahedron-3d.html)
  - DNA helix (octave-dna.html)
  - Simulator (simulator.html)
```

### **Path 2: Custom Data Wizard** (Direct wizard access)
```
User opens demo-orchestrator.html
  ↓
Step 0: Company selection (archetype, template, or custom)
  ↓
Step 1: Face configuration (12 organizational domains)
  ↓
Step 2: Enters KPI values (12 or 60)
  ↓
Clicks "Calculate"
  ↓
demo-orchestrator-logic.js collects data
  ↓
data-transformer.js validates + converts format
  ↓
main.js (loaded in page) runs calculation
  ↓
Step 3: Shows coherence score + breakdown
  ↓
Step 4: Links to visualizations
```

### **Path 3: Direct Dashboard (Legacy)**
```
User opens index.html directly
  ↓
main.js loads data/CSV_KPI_DATABASE.csv
  ↓
Creates default company
  ↓
Shows dashboard
```

---

## 🎨 Naming Convention

### Why so many "index" and "demo" files?

**Historical context:**
1. `index.html` - Originally the only page (now dashboard component)
2. `demo.html` - Added later as landing page wrapper
3. `demo-orchestrator.html` - Added for guided data entry

**Better naming would be:**
- `index.html` → `dashboard.html` ❌ (but index is web convention)
- `demo.html` → `landing.html` or `main.html`
- `demo-orchestrator.html` → `wizard.html`

**Why we keep current names:**
- `index.html` is web standard for default page
- Changing breaks existing bookmarks/links
- Internal consistency maintained

---

## 🚀 Recommended Entry Points by Use Case

| Use Case | File | Why |
|----------|------|-----|
| **New User / Full Journey** | welcome.html ⭐ | Glass card landing, choose your path |
| **Quick Demo** | demo.html | Pre-loaded companies, one-click |
| **Thesis Defense** | demo.html | Professional, visual, minimal clicks |
| **Investor Pitch** | demo.html → Quannex | Shows real data + vision |
| **Client Onboarding** | welcome.html → wizard | Full guided journey |
| **Custom Data Entry** | demo-orchestrator.html | Direct wizard access |
| **Development** | index.html | Fast iteration, direct access |
| **Academic Paper** | math/CALCULATION_AUDIT_TRAIL.md | Full theory |
| **Code Review** | js/main.js | Core algorithms |

> **See also:** `docs/UX_TREE_MAP.md` for the complete navigation graph, user journeys, and decision points.

---

## 🎓 For Your Thesis

**Include this architecture diagram:**

```
┌─────────────────────────────────────────────┐
│         User Interface Layer                │
│  (demo.html, demo-orchestrator.html)        │
└──────────────┬──────────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────────┐
│      Data Transformation Layer              │
│  (data-transformer.js, context-synthesizer) │
└──────────────┬──────────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────────┐
│       Constants Layer (NEW)                 │
│  (octave-thresholds.js - PHI mathematics)   │
└──────────────┬──────────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────────┐
│       Calculation Engine Layer              │
│  (main.js: Dodecahedron, Faces, KPIs)       │
│  (octave-integrity-calculator.js)           │
└──────────────┬──────────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────────┐
│      Visualization Layer                    │
│  (index.html, dodecahedron-3d.html, etc.)   │
│  (dna-preview-mini.js, harmonic-tuner.js)   │
└─────────────────────────────────────────────┘
```

---

## 🔑 Key Files Cheat Sheet

**Must understand:**
1. `welcome.html` - Primary landing page (glass card journey selection)
2. `demo.html` - Quick demo / thesis defense entry
3. `demo-orchestrator.html` - Data input wizard (5-step guided flow)
4. `js/main.js` - All calculations happen here
5. `js/data-transformer.js` - Bridges UI ↔ Engine
6. `companies/*/` - Company data (5 templates: quannex, cen, nova-tech, apex-industries, zenith-solutions)

**Nice to know:**
6. `js/company-loader.js` - Loads samples
7. `js/kpi-library.js` - Suggestions library
8. `math/CALCULATION_AUDIT_TRAIL.md` - Theory & audit trail

**Can ignore for now:**
9. `backend-fallback/` - Alternative engine
10. Most CSV files in `data/` - Legacy

---

## 📋 Summary

**4 Entry Points (standardized):**
1. **welcome.html** ⭐ - Primary landing page (new users, full journey)
2. **demo.html** - Quick demo / thesis defense (pre-loaded companies)
3. **demo-orchestrator.html** - Data input wizard (custom analysis)
4. **index.html** - Dashboard (development, standalone results)

**Core Engine:**
- **js/main.js** - All math happens here

**Bridge:**
- **js/data-transformer.js** - Connects UI to engine

**Visualizations:**
- **index.html** (dashboard)
- **dodecahedron-3d.html** (3D)
- **octave-dna.html** (DNA)

**Everything else:** Supporting files, data, docs

---

**Created:** 2025-11-10
**Updated:** 2026-02-16 (Entry points standardized: welcome.html as primary, demo.html for quick demos)
**For:** Thesis defense & demo preparation
**Status:** Complete reference guide
**Co-created by:** Deimantas Murauskas & Claude
