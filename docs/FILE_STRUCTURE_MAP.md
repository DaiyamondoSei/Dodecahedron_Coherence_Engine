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
├── 🧠 .claude/ (Development Council - 9 agents)
└── 📄 Documentation
```

---

## 🌐 HTML Pages - What Opens What

### **Entry Points** (Where users start)

#### 1. **demo.html** ⭐ MAIN DEMO (Recommended)
**Purpose:** Master landing page with company selection
**What it does:**
- Beautiful welcome screen
- Company selection modal (Quannex, Nova Tech, etc.)
- Hosts 4 visualization views as iframes:
  - Dashboard (index.html)
  - 3D Dodecahedron (dodecahedron-3d.html)
  - DNA Helix (octave-dna.html)
  - Simulator (simulator.html)
- Tab navigation between views
- Keyboard shortcuts (1-4, arrows)

**When to use:**
- Video demos
- Presentations
- Investor pitches
- Thesis defense

**URL:** `http://localhost:8000/demo.html`

---

#### 2. **demo-orchestrator.html** ⭐ DATA INPUT WIZARD
**Purpose:** Step-by-step wizard for custom data entry
**What it does:**
- Step 1: Define 12 organizational faces (templates available)
- Step 2: Map KPIs (Quick: 12 KPIs, Full: 60 KPIs)
- Step 3: Calculate coherence
- Step 4: View results + export

**When to use:**
- Entering your own company data
- Client onboarding sessions
- Custom analysis demos
- Showing extensibility

**URL:** `http://localhost:8000/demo-orchestrator.html`

**Key feature:** Has data transformation layer built in!

---

#### 3. **index.html** - Dashboard View
**Purpose:** Main results dashboard (usually embedded in demo.html)
**What it does:**
- Shows global coherence score
- Displays all 12 faces with energy levels
- Face-by-face KPI breakdown
- Color-coded health status
- Loads data from CSV or company-loader

**When to use:**
- As standalone dashboard
- Embedded in demo.html (primary use)

**URL:** `http://localhost:8000/index.html`

---

### **Visualization Pages** (Usually embedded in demo.html)

#### 4. **dodecahedron-3d.html** - Interactive 3D Geometry
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

---

#### 6. **simulator.html** - Coherence Simulator
**Purpose:** Interactive "what-if" analysis
**What it does:**
- Adjust KPI sliders
- See real-time coherence changes
- Test interventions
- Scenario planning

**Status:** Coming soon / partially implemented

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
- Manages 4 sample companies:
  - Quannex
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

## 🧠 Development Council (.claude/)

**Purpose:** Intelligent development council - 9 AI agents working in harmonious coherence

```
.claude/
├── agents/
│   ├── witness-point.md          (White - Awareness)
│   ├── chief-consciousness-officer.md (Purple - Strategy)
│   ├── chief-creativity-officer.md    (Orange - Innovation)
│   ├── chief-risk-manager.md          (Red - Risk wisdom)
│   ├── root-foundation-guardian.md    (Brown - Grounding)
│   ├── dodecahedron-consciousness-architect.md (Pink - Geometry)
│   ├── heartmath-universal-bridge.md  (Green - Translation)
│   ├── sacred-tech-architect.md       (Blue - Architecture)
│   └── solar-chakra-master.md         (Yellow - Integrity)
├── council-covenant.md           (Principles & protocols)
├── mcp.json                      (MCP server configuration)
└── settings.local.json           (Local project settings)
```

**What it is:**
- Framework for conscious, multi-perspective development
- 9 agent archetypes representing different wisdom domains
- Council protocols: Dyad (2 voices), Triad (3), Full Council (all 9)
- Used for strategic decisions, creative blocks, risk analysis

**When to use:**
- Major architectural decisions → Sacred Tech Architect
- Creative problem-solving → Chief Creativity Officer
- Risk assessment → Chief Risk Manager
- Grounding ambitious ideas → Root Foundation Guardian
- Pure observation → Witness Point

**Note:** Council docs are for development process, not end-user features.

---

## 🎯 Which File to Use When

### **For Video Demos**
→ `demo.html` (company selection → instant visualization)

### **For Custom Data Entry**
→ `demo-orchestrator.html` (wizard interface)

### **For Development/Testing**
→ `index.html` (standalone dashboard)

### **For 3D Showcase**
→ `dodecahedron-3d.html` (standalone 3D)

### **For Academic Presentation**
→ `demo.html` + `MATH_REFERENCE.md` (visual + theory)

---

## 🔄 Data Flow Paths

### **Path 1: Pre-loaded Company Demo**
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
```

### **Path 2: Custom Data Wizard**
```
User opens demo-orchestrator.html
  ↓
Step 1: Defines 12 faces (from template or custom)
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
| **Quick Demo** | demo.html | Pre-loaded companies, one-click |
| **Thesis Defense** | demo.html | Professional, visual, complete |
| **Investor Pitch** | demo.html → Quannex | Shows real data + vision |
| **Client Onboarding** | demo-orchestrator.html | Guided input process |
| **Development** | index.html | Fast iteration, direct access |
| **Academic Paper** | MATH_REFERENCE.md | Full theory |
| **Code Review** | js/main.js | Core algorithms |

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
1. `demo.html` - Main entry point
2. `demo-orchestrator.html` - Data input wizard
3. `js/main.js` - All calculations happen here
4. `js/data-transformer.js` - Bridges UI ↔ Engine
5. `companies/*/` - Sample data

**Nice to know:**
6. `js/company-loader.js` - Loads samples
7. `js/kpi-library.js` - Suggestions library
8. `MATH_REFERENCE.md` - Theory

**Can ignore for now:**
9. `backend-fallback/` - Alternative engine
10. Most CSV files in `data/` - Legacy

---

## 📋 Summary

**3 Main Entry Points:**
1. **demo.html** - For presentations (USE THIS!)
2. **demo-orchestrator.html** - For data entry
3. **index.html** - For development

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
**Updated:** 2025-12-09 (Added new JS modules, Council, company templates)
**For:** Thesis defense & demo preparation
**Status:** Complete reference guide
**Co-created by:** Deimantas Butrimas & Claude
