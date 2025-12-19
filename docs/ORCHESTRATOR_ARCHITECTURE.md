# Orchestrator Architecture Guide

> *Last Updated: 2025-12-19*
> *For Future Claude navigating the js/orchestrator/ subsystem*

---

## Overview

The `js/orchestrator/` folder contains ~25 files implementing the Demo Orchestrator wizard system. It handles:
- 4-step wizard flow (Template → Faces → KPIs → Results)
- Dashboard visualization (Coherence Hero, Octave Display, Portrait View)
- Cross-window synchronization with 3D visualizations
- Session state management

**Good News:** Key files have comprehensive internal documentation with "Notes for Future Claude" sections. This guide provides the architectural overview.

---

## Architecture at a Glance

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          ENTRY POINT                                     │
│                     demo-orchestrator.html                               │
│                 Loads all scripts in dependency order                    │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
        ▼                       ▼                       ▼
┌───────────────────┐ ┌───────────────────┐ ┌───────────────────┐
│      STATE        │ │      STEPS        │ │    DASHBOARD      │
│                   │ │                   │ │                   │
│ orchestrator-     │ │ steps/            │ │ dashboard/        │
│ state.js          │ │ ├── index.js      │ │ ├── index.js      │
│                   │ │ ├── template-*    │ │ ├── octave-system │
│ demoState         │ │ ├── face-config   │ │ ├── coherence-hero│
│ OCTAVE_THRESHOLDS │ │ ├── kpi-entry     │ │ ├── foundation-*  │
│                   │ │ └── results-*     │ │ └── portrait-*    │
└───────────────────┘ └───────────────────┘ └───────────────────┘
        │                       │                       │
        └───────────────────────┼───────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        SYNCHRONIZATION                                   │
│                     orchestrator-sync.js                                 │
│               BroadcastChannel: 'quannex-sync'                           │
│        Syncs state to 3D views (dodecahedron-3d.html, etc.)             │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Self-Documented Files (Read These First)

These files have comprehensive Gold headers with "Notes for Future Claude":

| File | What It Documents |
|------|-------------------|
| `dashboard/index.js` | Soul of Quannex, module architecture, philosophy |
| `orchestrator-dashboard.js` | Session 5 modularization, script load order, rollback |
| `steps/index.js` | Module dependency graph, "Where is X?" reference |

**Read their headers first** - they contain everything you need for deep understanding.

---

## Directory Structure

```
js/orchestrator/
├── orchestrator-state.js          # Central state (demoState)
├── orchestrator-sync.js           # Cross-window BroadcastChannel
├── orchestrator-navigation.js     # Step navigation (goToStep)
├── orchestrator-session.js        # Session management
├── orchestrator-dashboard.js      # Dashboard coordinator (thin)
├── orchestrator-utils.js          # Utility functions
├── event-handlers.js              # DOM event handlers
├── sprint2-init.js                # Sprint 2 initialization
│
├── steps/
│   ├── index.js                   # ⭐ GOLD - Navigation map
│   ├── template-display.js        # Step 0: Template grid UI
│   ├── template-selection.js      # Step 0: Company template loading
│   ├── face-configuration.js      # Step 1: Face editor
│   ├── kpi-autofill.js            # Step 2: KPI suggestions
│   ├── kpi-entry.js               # Step 2: KPI form generation
│   ├── calculation-engine.js      # Step 3: Coherence calculation
│   └── results-display.js         # Step 3: Results & storage
│
├── dashboard/
│   ├── index.js                   # ⭐ GOLD - Soul + architecture
│   ├── octave-system.js           # OCTAVE_REFERENCE data
│   ├── octave-utilities.js        # Pure utility functions
│   ├── coherence-hero.js          # Hero score display
│   ├── foundation-principle.js    # Structural warnings
│   └── portrait-view-manager.js   # 2D radial visualization
│
└── archive/
    └── orchestrator-dashboard-pre-session5.js  # Pre-modularization backup
```

---

## Key Concepts

### 1. DemoState (Central State)

The single source of truth for wizard state.

```javascript
const demoState = {
    currentStep: 0,             // Current wizard step (0-5)
    faceConfig: null,           // Face name mappings (12 faces)
    kpiMode: null,              // 'quick' (12 KPIs) or 'full' (60 KPIs)
    kpiData: null,              // Entered KPI values
    coherenceResults: null,     // Calculation results
    completedSteps: [],         // Array of completed step numbers
    selectedCompanyId: null,    // Template ID or 'custom'
    loadedMappingContext: null, // AI mapping context
    setupMode: 'manual'         // 'manual' or 'ai-assisted'
};
```

**Location:** `orchestrator-state.js`

---

### 2. Four-Step Wizard Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│  STEP 0                STEP 1              STEP 2              STEP 3   │
│  Choose Journey        Define Faces        Map Metrics         Results  │
│                                                                         │
│  ┌───────────┐        ┌───────────┐       ┌───────────┐      ┌────────┐│
│  │ Template  │   →    │   Face    │   →   │    KPI    │  →   │Dashboard││
│  │ Selection │        │  Editor   │       │   Entry   │      │  View  ││
│  └───────────┘        └───────────┘       └───────────┘      └────────┘│
│                                                                         │
│  template-            face-               kpi-entry.js       orchestrator│
│  selection.js         configuration.js    kpi-autofill.js    -dashboard.js│
└─────────────────────────────────────────────────────────────────────────┘
```

**Navigation:** `goToStep(n)` in `orchestrator-navigation.js`

---

### 3. Dashboard Modules (Session 5 Modularization)

Original 1,272-line file split into focused modules:

| Module | Lines | Responsibility |
|--------|-------|----------------|
| `octave-system.js` | ~280 | OCTAVE_REFERENCE data, detection |
| `coherence-hero.js` | ~120 | Hero score display |
| `foundation-principle.js` | ~180 | Structural warnings |
| `portrait-view-manager.js` | ~280 | 2D radial visualization |
| `octave-utilities.js` | ~80 | Pure utility functions |
| `orchestrator-dashboard.js` | ~120 | Thin coordinator |

**Why Modularize?**
- Single responsibility per module
- Easier navigation for Future Claude
- Isolated testing and maintenance

---

### 4. Cross-Window Synchronization

The BroadcastChannel API syncs state between windows.

```javascript
// orchestrator-sync.js
const CrossWindowSync = {
    CHANNEL_NAME: 'quannex-sync',

    broadcast(type, payload) {
        // Sends to all windows on same origin
    },

    on(type, callback) {
        // Listen for messages from other windows
    }
};
```

**Message Types:**
- `STATE_UPDATE` - Full state broadcast
- `STATE_SYNC` - Periodic sync
- `STATE_REQUEST` - View asking for current state
- `FACES_CHANGED` - Face configuration changed

**Flow:**
```
demo-orchestrator.html  ──broadcast──►  dodecahedron-3d.html
demo-orchestrator.html  ──broadcast──►  octave-dna.html
demo-orchestrator.html  ◄──request───  (any view on open)
```

---

### 5. Session Storage Contract

Data stored in `sessionStorage` for 3D views to read:

```javascript
// sessionStorage keys
'customCompanyData': {
    id: string,
    name: string,
    description: string,
    kpis: Array,
    faceConfig: Object,
    coherenceResults: Object,
    breathAxes: Array,
    edges: Array,
    vertices: Array,
    dominantOctave: number,
    tuning: Object,
    shadowPatterns: Array,
    isCustomData: boolean,
    timestamp: number
}

'selectedCompanyId': string  // 'custom' or template ID
```

**Location:** `results-display.js` → `updateSessionStorage()`

---

### 6. Script Load Order (Critical!)

Scripts MUST load in this order in `demo-orchestrator.html`:

```
1. orchestrator-state.js           ← Hard dependency (demoState)
2. dashboard/octave-utilities.js   ← Pure utilities (no deps)
3. dashboard/octave-system.js      ← Depends on state
4. dashboard/coherence-hero.js     ← Depends on state
5. dashboard/foundation-principle.js ← Depends on state
6. dashboard/portrait-view-manager.js ← Depends on state, octave-system
7. orchestrator-dashboard.js       ← Coordinator
8. steps/*.js                      ← Step modules
9. orchestrator-navigation.js      ← Calls dashboard functions
```

---

## Quick Reference: "I Need To..."

| Question | Look Here |
|----------|-----------|
| "Where is template loading?" | `steps/template-selection.js` |
| "Where is face editor?" | `steps/face-configuration.js` |
| "Where is KPI form generated?" | `steps/kpi-entry.js` |
| "Where is calculation triggered?" | `steps/calculation-engine.js` |
| "Where is sessionStorage updated?" | `steps/results-display.js` |
| "Where is octave detection?" | `dashboard/octave-system.js` |
| "Where is coherence hero?" | `dashboard/coherence-hero.js` |
| "Where is Foundation Principle?" | `dashboard/foundation-principle.js` |
| "Where is Portrait View?" | `dashboard/portrait-view-manager.js` |
| "Where is cross-window sync?" | `orchestrator-sync.js` |

---

## PHI-Based Octave Thresholds

The 7 octaves use Golden Ratio-derived boundaries:

```javascript
OCTAVE_COHERENCE_THRESHOLDS = {
    O1: 0.0,     // Survival - just existing
    O2: 0.382,   // Structure - φ^-2
    O3: 0.5,     // Relationships - midpoint
    O4: 0.618,   // Creativity - φ^-1 (Golden Ratio)
    O5: 0.764,   // Expression - Ψ³
    O6: 0.854,   // Vision - Ψ⁴
    O7: 0.95     // Radiance - near unity
};
```

**Location:** `orchestrator-state.js`

---

## Rollback Procedure

If something breaks after Session 5 modularization:

1. Restore from archive:
   ```
   js/orchestrator/archive/orchestrator-dashboard-pre-session5.js
   ```

2. Update `demo-orchestrator.html` to load single file instead of modules

---

## Gotchas

1. **Script Order Matters:** Dashboard modules must load before orchestrator-dashboard.js

2. **Re-entrancy Guard:** `isSelectingCompanyTemplate()` prevents infinite loops on company card clicks

3. **Global Exports:** All functions called from inline HTML (`onclick`, `onchange`) must be on `window`

4. **sessionStorage is per-tab:** State doesn't sync across browser tabs (use CrossWindowSync for that)

5. **Foundation Principle:** Uses `OctaveIntegrityCalculator` from main.js - can't skip octaves

---

## Related Documentation

- [SYSTEM_ARCHITECTURE.md](SYSTEM_ARCHITECTURE.md) - Overall system overview
- [DATA_FLOW_ARCHITECTURE.md](DATA_FLOW_ARCHITECTURE.md) - Data pipeline details
- `dashboard/index.js` - Has Gold header with "Soul of Quannex" philosophy

---

*This guide provides the architecture. For implementation details, read the Gold headers in the source files.*
