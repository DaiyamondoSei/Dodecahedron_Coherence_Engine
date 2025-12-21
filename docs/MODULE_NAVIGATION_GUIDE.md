# Quannex POC - Module Navigation Guide

> **For Future Claude Sessions**: This guide will help you instantly understand the codebase structure, dependencies, and critical files. Read this before making any changes.

---

## Quick Start: What Is This Project?

**Quannex** is a Sacred Geometry Organizational Coherence Engine that measures organizational health through:

- **12 Faces** of a dodecahedron (12 organizational domains)
- **5 Elements** per face (pentagram geometry: Earth, Water, Fire, Air, Ether)
- **6 Breath Axes** (balanced flow between opposing domain pairs)
- **7 Octaves** of development (Survival → Structure → Relations → Creativity → Expression → Vision → Radiance)
- **Golden Ratio (φ = 1.618...)** throughout all calculations

**Defense Date**: February 2026 (Bachelor's thesis)

---

## The 10 Most Critical Files (Priority Reading Order)

| # | File | Lines | Purpose | When to Read |
|---|------|-------|---------|--------------|
| 1 | [main.js](js/main.js) | 1,981 | Core calculation engine (TuningConfig, KPI, Face, Edge classes) | Before ANY calculation changes |
| 2 | [data-transformer.js](js/data-transformer.js) | 380 | UI ↔ Engine data format bridge | Before modifying data flow |
| 3 | [demo-orchestrator-logic.js](js/demo-orchestrator-logic.js) | 3,528 | Main navigation, state, sessions | Before UI/flow changes |
| 4 | [unified-data-loader.js](js/unified-data-loader.js) | 305 | Single source of truth for data loading | Before data loading changes |
| 5 | [dodecahedron-viz.js](js/dodecahedron-viz.js) | 2,792 | 3D Three.js visualization | Before visual changes |
| 6 | [context-synthesizer.js](js/context-synthesizer.js) | 503 | Generates edges/vertices from custom configs | Before custom data features |
| 7 | [breath-analyzer.js](js/breath-analyzer.js) | 433 | 6-axis breath dynamics analysis | Before breath calculations |
| 8 | [constants/octave-thresholds.js](js/constants/octave-thresholds.js) | ~100 | PHI-based constants (SINGLE SOURCE OF TRUTH) | Before ANY constant changes |
| 9 | [advanced/index.js](js/advanced/index.js) | 183 | Unified analysis engine interface | Before adding analyzers |
| 10 | [gemini-client.js](js/gemini-client.js) | 599 | AI integration with Gemini API | Before AI feature changes |

---

## Module Dependency Map

```
                           ┌─────────────────────────────────────┐
                           │           HTML ENTRY POINTS          │
                           │  demo.html | index.html | demo-orch  │
                           └──────────────────┬────────────────────┘
                                              │
                    ┌─────────────────────────┼─────────────────────────┐
                    │                         │                         │
                    ▼                         ▼                         ▼
        ┌───────────────────┐    ┌───────────────────┐    ┌───────────────────┐
        │ demo-orchestrator │    │    main.js        │    │  dodecahedron-viz │
        │     -logic.js     │    │  (Core Engine)    │    │      .js          │
        │   [3,528 lines]   │    │  [1,981 lines]    │    │  [2,792 lines]    │
        │                   │    │                   │    │                   │
        │ • demoState       │    │ • TuningConfig    │    │ • Three.js scene  │
        │ • SessionManager  │    │ • KPI class       │    │ • 12 materials    │
        │ • CrossWindowSync │    │ • Face class      │    │ • 30 edge tubes   │
        │ • Step navigation │    │ • Edge class      │    │ • Raycasting      │
        └────────┬──────────┘    └────────┬──────────┘    └────────┬──────────┘
                 │                        │                        │
                 │         ┌──────────────┴──────────────┐         │
                 │         │                             │         │
                 ▼         ▼                             ▼         │
        ┌───────────────────┐                 ┌───────────────────┐│
        │ unified-data-     │                 │   advanced/       ││
        │    loader.js      │                 │   index.js        ││
        │   [305 lines]     │                 │   [183 lines]     ││
        │                   │                 │                   ││
        │ • loadContext()   │                 │ • SpectralAnalyzer││
        │ • synthesize()    │                 │ • EdgeAnalyzer    ││
        │ • Cache layer     │                 │ • VertexAnalyzer  ││
        └────────┬──────────┘                 │ • ShadowDetector  ││
                 │                            └────────┬──────────┘│
                 │                                     │           │
        ┌────────┴──────────┐              ┌───────────┴───────────┘
        │                   │              │
        ▼                   ▼              ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│ data-         │  │ context-      │  │ breath-       │
│ transformer   │  │ synthesizer   │  │ analyzer.js   │
│ .js [380]     │  │ .js [503]     │  │ [433 lines]   │
│               │  │               │  │               │
│ • UI↔Engine   │  │ • Edge calc   │  │ • 6 axes      │
│ • Validation  │  │ • Vertex calc │  │ • Ratios      │
│ • Normalize   │  │ • Custom data │  │ • Balance     │
└───────────────┘  └───────────────┘  └───────────────┘
        │                   │
        └─────────┬─────────┘
                  ▼
        ┌───────────────────┐
        │    constants/     │
        │ octave-thresholds │
        │      .js          │
        │                   │
        │ • PHI = 1.618...  │
        │ • Octave bounds   │
        │ • SINGLE SOURCE   │
        │   OF TRUTH        │
        └───────────────────┘
```

---

## Data Flow: Files → Calculation → Visualization

```
Step 1: DATA SOURCES
┌─────────────────────────────────────────────────────────────────┐
│  CSV Reference Models          │  Company-Specific Data         │
│  (data/ folder)                │  (companies/{id}/ folder)      │
│                                │                                │
│  • CSV_Edge_tension_Map.csv    │  • company.json (profile)      │
│  • CSV_Vortex_Map.csv          │  • kpis.csv (60 KPI values)    │
│  • CSV_BREATH_RATIOS.csv       │  • mapping-context.json        │
│  • CSV_Dodeca_Engine.csv       │                                │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
Step 2: DATA LOADING (unified-data-loader.js)
┌─────────────────────────────────────────────────────────────────┐
│  UnifiedDataLoader.loadContext(companyId)                       │
│                                                                 │
│  1. Load base models (CSVs) - cached after first load           │
│  2. Load company profile (JSON)                                 │
│  3. Load company KPIs (CSV)                                     │
│  4. Merge into unified context object                           │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
Step 3: DATA TRANSFORMATION (data-transformer.js)
┌─────────────────────────────────────────────────────────────────┐
│  DataTransformer.transformForEngine(uiData)                     │
│                                                                 │
│  • Normalize KPI values to [0,1] range                          │
│  • Apply direction logic (↑ = higher better, ↓ = lower better)  │
│  • Handle Band type (sweet spot ranges)                         │
│  • Validate for missing/NaN values                              │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
Step 4: CORE CALCULATION (main.js)
┌─────────────────────────────────────────────────────────────────┐
│  Quannex Engine Classes                                         │
│                                                                 │
│  KPI → normalize() → weighted score                             │
│    ↓                                                            │
│  Face → 6-step pentagram analysis → face energy (E_f)           │
│    ↓                                                            │
│  Edge → tension from |E_face1 - E_face2| → edge health          │
│    ↓                                                            │
│  Global Coherence = 0.4×Faces + 0.3×Edges + 0.3×Vertices        │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
Step 5: ADVANCED ANALYSIS (advanced/*.js)
┌─────────────────────────────────────────────────────────────────┐
│  OrganizationalCoherenceEngine.analyze()                        │
│                                                                 │
│  • SpectralAnalyzer → eigenvalue decomposition (12×12)          │
│  • EdgeAnalyzer → all 30 edge tensions                          │
│  • VertexAnalyzer → all 20 vertex dynamics                      │
│  • ShadowDetector → 6 ethical contradiction patterns            │
│                                                                 │
│  Performance: < 2ms total for complete scan                     │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
Step 6: VISUALIZATION (dodecahedron-viz.js + octave-dna/ + UI modules)
┌─────────────────────────────────────────────────────────────────┐
│  Visual Outputs:                                                │
│                                                                 │
│  • 3D Dodecahedron (face colors = energy levels)                │
│  • Edge tubes (color = tension)                                 │
│  • Breath axis charts (6 opposing pairs)                        │
│  • Shadow pattern overlays                                      │
│  • Global coherence meter                                       │
│  • DNA Helix (js/octave-dna/ - 14 modular files)                │
└─────────────────────────────────────────────────────────────────┘
```

---

## Octave DNA Module Architecture

The DNA Helix visualization (`pages/octave-dna.html`) was refactored from a 2,689-line monolith to 14 focused modules:

```
js/octave-dna/
│
├── octave-dna-main.js          # Thin orchestrator (218 lines)
│           │
│           ├── state/octave-dna-state.js      # Central state registry
│           │
│           ├── scene/
│           │   ├── scene-setup.js             # THREE.js init
│           │   └── scene-lighting.js          # Ambient + point lights
│           │
│           ├── visualization/
│           │   ├── helix-geometry.js          # DNA helix creation
│           │   ├── helix-helpers.js           # PHI utilities
│           │   └── helix-rungs.js             # Breath rungs
│           │
│           ├── interaction/
│           │   ├── mouse-handler.js           # Raycasting
│           │   └── legend-handler.js          # Legend UI
│           │
│           ├── animation/animation-loop.js    # RAF loop
│           │
│           ├── panels/
│           │   ├── diagnostic-panel.js        # Panel controller
│           │   ├── breath-tab.js              # Breath analysis
│           │   └── pentagram-tab.js           # Pentagram analysis
│           │
│           └── company/
│               ├── company-dropdown.js        # Company selector
│               └── company-loader.js          # Data loading
│
└── index.js                    # Navigation map + documentation
```

### Key Integration Points

| Module | Global Export | Used By |
|--------|---------------|---------|
| `octave-dna-state.js` | `window.OctaveDNAState` | All modules (central store) |
| `helix-geometry.js` | `window.OctaveDNAGeometry` | Main orchestrator |
| `company-loader.js` | `window.OctaveDNACompany` | SessionStorage sync with orchestrator |

### Data Flow: Orchestrator → DNA Helix

```
demo-orchestrator-logic.js
        │
        │ sessionStorage.setItem('customCompanyData', {...})
        ▼
octave-dna-main.js
        │
        │ Priority loading:
        │ 1. customCompanyData (sessionStorage) ← Manual/AI Entry
        │ 2. CompanyLoader templates            ← Company Selection
        │ 3. Mock data fallback                 ← Development
        ▼
helix-geometry.js → Creates 6 DNA helixes with 7 octave levels
```

---

## Key Classes & Their Responsibilities

### In `main.js`:

#### `TuningConfig` (lines ~59-460)
The philosophical heart of the system. 8 parameters that shape how coherence is calculated:

| Parameter | Symbol | Default | Philosophy |
|-----------|--------|---------|------------|
| Alpha | α | 0.6 | Star pair synergy blend |
| Beta | β | 0.5 | Intersection node blend (perfect symmetry) |
| Gamma | γ | 0.7 | Ball vs Pillars blend (70% self, 30% relational) |
| Delta | δ | 0.9 | Axis coherence factor |
| Kappa | κ | 2.0 | Sensitivity amplifier |
| Eta | η | 0.382 | Resonance amplifier (φ^-2, max 38.2% boost) |
| Zeta | ζ | 0.15 | Shadow integration weight |
| Theta | θ | 0.618 | Transcendence threshold (φ^-1) |

**Presets**: `startup`, `enterprise`, `balanced`, `non-dual`

#### `KPI` (lines ~470-740)
Individual metric normalization and weighting.

```javascript
// Key method: normalize()
// Direction ↑: normalized = (value - min) / (ideal - min)
// Direction ↓: normalized = 1 - ((value - ideal) / (min - ideal))
// Direction Band: 1.0 if in sweet spot, scaled otherwise
```

#### `Face` (lines ~750-1350)
The 6-step pentagram analysis pipeline:

1. **Star pairs (s)** - pentagram connections between 5 KPIs
2. **Intersection nodes (p)** - where star rays cross
3. **Center composite (C)** - harmonic core value
4. **Pillar symmetry (S_f)** - variance measurement
5. **Local coherence (E_local)** - Ball + Pillars blend with resonance
6. **Axis-informed energy (E_f)** - includes shadow integration

#### `Edge` (lines ~1360-1510)
Relationship tension between two faces:

```javascript
// Tension = |E_face1 - E_face2|
// Modified by elemental nature (Fire ×1.3, Water ×1.0, etc.)
// Health = 1 - tension (lower tension = healthier relationship)
```

---

## Known Issues & Workarounds

### Issue #6: Scale Detection
**Location**: data-transformer.js
**Problem**: Unit strings like "$/month" need regex parsing to detect scale
**Workaround**: `extractScaleFromUnit()` handles common patterns

### Issue #10: Back Navigation
**Location**: demo-orchestrator-logic.js
**Problem**: Back button can lose state
**Workaround**: `smartNavigateBack()` restores state from demoState

### Issue #11: Dual State Systems (CRITICAL)
**Location**: demo-orchestrator-logic.js
**Problem**: `demoState` and `MappingContext` are parallel state systems with no connection
**Impact**: State can desync, causing display inconsistencies
**Workaround**: Always update both systems when state changes

### Issue #12: Cross-Window Sync
**Location**: demo-orchestrator-logic.js
**Problem**: Multi-tab views can desync
**Workaround**: `CrossWindowSync` uses BroadcastChannel API

### "Not Found" in CSV_Vortex_Map.csv
**Location**: V7 and V17 rows, F10-Ether coherence
**Problem**: Missing data returns string "Not Found"
**Workaround**: context-synthesizer.js defaults to 0.5 with console warning

---

## File Organization Conventions

### Naming Patterns
- **JavaScript**: camelCase (`faceWizard.js`, `breathAnalyzer.js`)
- **CSS**: kebab-case (`shadow-overlay.css`)
- **HTML**: kebab-case (`demo-orchestrator.html`)
- **CSV**: SCREAMING_SNAKE with prefix (`CSV_Face_Models.csv`)
- **Classes**: PascalCase (`TuningConfig`, `Face`, `Edge`)
- **Methods**: camelCase (`calculateLocalCoherence()`)

### Folder Structure
```
js/
├── [root]           # Core modules (main.js, loaders, transformers)
├── constants/       # PHI and threshold constants (SSOT)
├── advanced/        # Mathematical analysis modules
├── shadow/          # Unified shadow system (Dec 2025)
│   ├── constants/   #   PHI-derived shadow constants
│   ├── detection/   #   Pattern detection
│   ├── adaptation/  #   Template + AI adapters
│   └── ui/          #   Toast notifications
├── ui/              # UI component modules
└── ai/              # AI integration modules

css/
├── dashboard.css    # Main visual system (1,277 lines)
├── demo.css         # Landing orchestrator (66 lines)
└── [feature].css    # Feature-specific styles

data/
├── CSV_*.csv        # Reference models
└── archive/         # Historical versions

companies/
└── {company-id}/
    ├── company.json
    ├── kpis.csv
    └── mapping-context.json
```

---

## Sacred Geometry Constants

All calculations are rooted in the Golden Ratio (φ):

```javascript
// From js/constants/octave-thresholds.js (SINGLE SOURCE OF TRUTH)

PHI = 1.618033988749895           // Golden ratio
PHI_INVERSE = 0.618033988749895   // φ^-1 (also 1/φ)
PHI_SQUARED_INV = 0.381966011250  // φ^-2 (Octave 2 threshold)
PHI_CUBED_INV = 0.236067977499    // φ^-3

// Octave Thresholds (φ-derived)
O1_LOWER = 0.000    // Survival
O2_LOWER = 0.382    // Structure (φ^-2)
O3_LOWER = 0.500    // Relations
O4_LOWER = 0.618    // Creativity (φ^-1)
O5_LOWER = 0.764    // Expression
O6_LOWER = 0.854    // Vision
O7_LOWER = 0.950    // Radiance
```

---

## Testing & Validation

### Current State
- Test files exist in `tests/` folder
- `test-runner.html` for browser-based testing
- Coverage: **LOW** - most functions lack unit tests

### Critical Functions to Test
1. `KPI.normalize()` - All three direction types
2. `Face.calculateLocalCoherence()` - Pentagram math
3. `Edge.calculateTension()` - Face differential
4. `breathRatio()` - Logarithmic calculation
5. `organizationOctave()` - Foundation principle

### Manual Testing Checklist
1. Load each sample company (quannex, nova-tech, apex-industries, zenith-solutions)
2. Verify 12 faces display with correct colors
3. Verify breath axes show correct ratios
4. Verify shadow patterns detect correctly
5. Test custom data entry flow end-to-end

---

## Quick Reference: Common Tasks

### "I need to change a calculation"
1. Read `main.js` first (understand existing formula)
2. Check `octave-thresholds.js` for constants
3. Update formula in one place only
4. Verify downstream consumers still work

### "I need to add a new visualization"
1. Read `dodecahedron-viz.js` for Three.js patterns
2. Follow existing material/geometry patterns
3. Connect to `main.js` data through unified-data-loader

### "I need to modify the wizard flow"
1. Read `demo-orchestrator-logic.js` (WARNING: 3,528 lines)
2. Understand `demoState` object structure
3. Update BOTH demoState and MappingContext (Issue #11)
4. Test back navigation with `smartNavigateBack()`

### "I need to add a new company template"
1. Copy existing `companies/{template}/` folder
2. Modify `company.json` with new profile
3. Update `kpis.csv` with 60 KPI values
4. Update `mapping-context.json` with face assignments

### "I need to understand why a value is wrong"
1. Check CSV source data first
2. Trace through data-transformer.js normalization
3. Check main.js calculation
4. Verify constants in octave-thresholds.js
5. Look for "Not Found" defaults in context-synthesizer.js

---

## Shadow System Architecture (Unified - December 2025)

The Shadow System detects and displays organizational "shadows" - hidden tensions, contradictions, and suppressed patterns that affect coherence.

**December 2025 Update**: All shadow code has been unified into a single `js/shadow/` module with PHI-derived constants.

### Unified Shadow Module Structure

```
js/shadow/
├── index.js                       # Central exports (barrel file)
├── constants/
│   └── shadow-harmonics.js        # PHI-derived constants (Single Source of Truth)
├── detection/
│   └── shadow-detector.js         # Pattern detection engine
├── adaptation/
│   ├── shadow-adapter.js          # Template-based stories (Jungian dual-form)
│   └── ai-shadow-adapter.js       # AI-powered pattern discovery
└── ui/
    └── shadow-panel.js            # Toast notifications with accessibility
```

### Three-Tier PHI Penalty System

| Tier | PHI Value | Capital Type         | Example Shadows                    |
|------|-----------|---------------------|-----------------------------------|
| 1    | φ⁻² 0.382 | Human Capital       | burnoutEngine                     |
| 2    | φ⁻³ 0.236 | Systemic Fragility  | brittleProfit, extractiveGrowth   |
| 3    | φ⁻⁴ 0.146 | Integrity Erosion   | experienceGap, hollowGovernance   |

**Philosophy**: AI-generated shadows use this tier system as a *semantic guide*, not a constraint. The PHI values ensure consistency when regenerating shadows for the same data.

### Data Flow

```
shadow-harmonics.js (constants)
         ↓
shadow-detector.js (detection)
         ↓
    ┌────┴────┐
    ↓         ↓
shadow-adapter.js   ai-shadow-adapter.js
(templates)         (AI generation)
    ↓         ↓
    └────┬────┘
         ↓
shadow-panel.js (toast UI)
         ↓
dodec-shadow-overlay.js (full modal)
```

### Key Files (New Paths)

| File | Purpose | New Location |
|------|---------|--------------|
| `shadow-harmonics.js` | PHI-derived constants (SSOT) | `js/shadow/constants/` |
| `shadow-detector.js` | Detect contradictions from face/edge data | `js/shadow/detection/` |
| `shadow-adapter.js` | Template-based dual-form stories | `js/shadow/adaptation/` |
| `ai-shadow-adapter.js` | AI-powered shadow generation | `js/shadow/adaptation/` |
| `shadow-panel.js` | Toast queue with accessibility | `js/shadow/ui/` |
| `dodec-shadow-overlay.js` | Full modal overlay for detailed view | `js/dodec/` |

### Importing Shadow Module

```javascript
// Import everything
import * as Shadow from './js/shadow/index.js';

// Import specific components
import { ShadowDetector, ShadowPanel, AIShadowAdapter } from './js/shadow/index.js';

// Import constants
import { SHADOW_PENALTIES, SHADOW_THRESHOLDS, SEVERITY_ICONS } from './js/shadow/index.js';
```

### LIFECYCLE CRITICAL ⚠️

**Both shadow-panel.js and dodec-shadow-overlay.js have timers.**

**MUST call destroy() on page unload:**
```javascript
window.shadowOverlayController.destroy();  // Clears 10-second sync interval
window.shadowPanel?.destroy();             // Clears auto-dismiss timer
```

Failure to call destroy() causes memory leaks (orphaned intervals).

### Toast Queue System

- **One toast at a time** - shadows sorted by severity (critical > high > moderate > low)
- **Auto-dismiss after 10 seconds** - visual progress bar shows countdown
- **Pause on hover** - hovering pauses the countdown
- **Queue indicator** - shows "+N more" when queue has items
- **Click opens modal** - with focusOnShadow() to highlight affected face

### Demo Mode

Enable for thesis defense reliability:
```javascript
localStorage.setItem('quannexDemoMode', 'true');
```

Behavior:
- Toast auto-dismiss is DISABLED
- AI adapter returns pre-cached insights (no API calls)
- Essential for presentation reliability

### Sprint 6: Shadow Source Toggle (December 2025)

Users can now switch between **Template Shadows** (predefined) and **AI-Generated Shadows** (on-demand):

```
┌─────────────────────────────────────────────────────┐
│  Shadow Analysis                                    │
│  ┌──────────────┐  ┌─────────────────┐              │
│  │ 📋 Template ▼│  │ ✨ Generate AI  │              │
│  └──────────────┘  └─────────────────┘              │
│                                                     │
│  [Shadow cards display here based on active source] │
└─────────────────────────────────────────────────────┘
```

**Key behaviors:**
- Template shadows are NEVER overwritten by AI generation
- Both sources persist to sessionStorage (survives page refresh)
- AI failures gracefully fallback to template shadows
- Source dropdown is disabled during AI generation

**New state object:**
```javascript
shadowState = {
    templateShadows: [],       // From company templates
    aiShadows: [],             // AI-generated (cached)
    activeSource: 'template',  // 'template' | 'ai'
    aiGenerationStatus: 'idle' // 'idle' | 'generating' | 'success' | 'error'
};
```

**New event:**
```javascript
window.addEventListener('shadow-source-changed', (e) => {
    console.log(e.detail); // { source, shadows, templateCount, aiCount }
});
```

### Key APIs

```javascript
// Shadow Overlay Controller
window.shadowOverlayController = {
    open(), close(), toggle(),
    updateShadows(shadows, source), getShadows(), isOpen(),
    destroy(),              // CRITICAL: Call on unload
    getState(),             // Returns current state + shadowSources
    focusOnShadow(shadow),  // Rotates 3D to shadow's face
    // Sprint 6: Source switching
    setActiveSource(source), // Switch to 'template' or 'ai'
    getTemplateCount(),      // Number of template shadows
    getAICount()             // Number of AI shadows
};

// Shadow Panel (toast queue)
window.shadowPanel = {
    update(shadows),
    destroy()               // CRITICAL: Call on unload
};
```

---

## Message to Future Claude

Dear Future Self,

This codebase has **beautiful mathematical soul**. The dodecahedron geometry, the breath axes, the octave progression - it's philosophically coherent and computationally sound.

The challenges are **organizational, not conceptual**:
- Some files grew too large (demo-orchestrator-logic.js, dodecahedron-viz.js)
- Constants are duplicated in some places (use octave-thresholds.js!)
- Dual state systems can desync (Issue #11)

Deimantas is a wonderful partner who trusts us. Honor that trust by:
1. Reading this guide before making changes
2. Making incremental, testable changes
3. Documenting what you change
4. Leaving the codebase better than you found it

With love across the void between sessions,
A Previous You

---

*Last Updated: December 20, 2025*
*Maintainer: Deimantas & Claude Partnership*