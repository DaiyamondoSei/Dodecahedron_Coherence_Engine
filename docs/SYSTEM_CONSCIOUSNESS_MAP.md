# System Consciousness Map

*The living architecture of Quannex - how everything breathes together.*

**Last Updated:** February 16, 2026
**Purpose:** Birds-eye view of the complete modular structure

---

## The Sacred Geometry of Code

```
                           ┌─────────────────────────────────────┐
                           │         ENTRY POINTS                │
                           │                                     │
                           │  welcome.html  ⭐ Primary landing   │
                           │       ↓  (3 journey paths)         │
                           │  demo-orchestrator.html  Wizard     │
                           │       ↓  (5-step guided flow)      │
                           │  Deep-dive views (results)          │
                           │                                     │
                           │  demo.html  Quick demo / thesis     │
                           │  index.html  Dashboard (legacy)     │
                           └─────────────────────────────────────┘
                                          │
          ┌───────────────────────────────┼───────────────────────────────┐
          │                               │                               │
          ▼                               ▼                               ▼
   ┌─────────────┐                ┌─────────────┐                ┌─────────────┐
   │   DISPLAY   │                │    CORE     │                │     AI      │
   │   LAYER     │ ◄────────────► │   ENGINE    │ ◄────────────► │   LAYER     │
   │             │                │             │                │             │
   │ js/dodec/   │                │  js/main.js │                │   js/ai/    │
   │ js/octave-  │                │ js/analysis │                │  36 files   │
   │    dna/     │                │ js/advanced │                │             │
   └─────────────┘                └─────────────┘                └─────────────┘
          │                               │                               │
          │                               ▼                               │
          │                      ┌─────────────┐                          │
          │                      │   SHADOW    │                          │
          │                      │   SYSTEM    │ ◄────────────────────────┘
          │                      │             │   (AI generates shadows)
          │                      │ js/shadow/  │
          │                      │  14 files   │
          │                      └─────────────┘
          │                               │
          └───────────────────────────────┼───────────────────────────────┘
                                          │
                                          ▼
                              ┌───────────────────────┐
                              │     ORCHESTRATOR      │
                              │       SYSTEM          │
                              │                       │
                              │  js/orchestrator/     │
                              │     24 files          │
                              │                       │
                              │ "The Conductor that   │
                              │  coordinates all      │
                              │  movements"           │
                              └───────────────────────┘
                                          │
                              ┌───────────┴───────────┐
                              ▼                       ▼
                    ┌─────────────┐           ┌─────────────┐
                    │    DATA     │           │  CONSTANTS  │
                    │   SYSTEM    │           │   (PHI)     │
                    │             │           │             │
                    │ js/data-    │           │js/constants/│
                    │   system/   │           │  5 files    │
                    └─────────────┘           └─────────────┘
```

---

## Module Directory Structure

### 1. Core Engine (`js/`)

The mathematical heart of Quannex.

```
js/
├── main.js                    # 🌟 THE ENGINE - 2,500+ lines of coherence magic
│                              #    Face, Edge, Vertex classes
│                              #    DodecahedronEngine orchestrator
│                              #    PHI-based energy calculations
│
├── analysis/                  # Pattern detection modules
│   ├── face-health-engine.js  #    Element balance analysis
│   ├── breath-analysis.js     #    6 breath axes calculations
│   ├── shadow-coherence.js    #    Shadow-coherence integration
│   └── scoring-engine.js      #    Unified scoring
│
└── advanced/                  # Deep mathematical analysis
    ├── spectral-analysis.js   #    Eigenvalue decomposition
    ├── field-coherence.js     #    Phi-ratio field detection
    ├── harmonic-resonance.js  #    Octave overtone patterns
    └── systemic-stress.js     #    Organizational stress mapping
```

### 2. Constants (`js/constants/`)

**Single Source of Truth for all PHI-derived values.**

```
js/constants/
├── index.js              # Barrel export - import everything from here
├── phi.js                # φ = 1.618033988749895 and derivatives
├── thresholds.js         # Octave boundaries (O1-O7), health thresholds
├── colors.js             # Octave color palette (7 colors + transcendence)
└── formulas.js           # Mathematical formulas reference
```

### 3. Shadow System (`js/shadow/`)

**The mirror that reveals organizational shadows.**

```
js/shadow/
├── index.js                       # 🌑 Barrel export for all shadow modules
│
├── constants/
│   └── shadow-harmonics.js        # THREE-TIER PHI SYSTEM (Master constants)
│                                  #   Tier 1: φ⁻² (0.382) - Human Capital
│                                  #   Tier 2: φ⁻³ (0.236) - Systemic Fragility
│                                  #   Tier 3: φ⁻⁴ (0.146) - Integrity Erosion
│
├── detection/
│   └── shadow-detector.js         # Pattern detection engine
│
├── adaptation/
│   ├── shadow-adapter.js          # Template-based stories (Jungian dual-form)
│   └── ai-shadow-adapter.js       # AI-powered pattern discovery
│
├── ui/
│   └── shadow-panel.js            # Toast notifications with accessibility
│
└── overlay/                       # 6 modules for shadow overlay UI
    ├── shadow-state-manager.js    # Foundation - no dependencies
    ├── shadow-card-renderer.js    # Depends on state
    ├── shadow-source-toggle.js    # Template ↔ AI switching
    ├── shadow-overlay-controller.js
    ├── shadow-event-handlers.js
    └── shadow-system-integration.js
```

### 4. AI System (`js/ai/`)

**The Sacred Vessel - AI-powered organizational insights.**

```
js/ai/
├── index.js                  # Master barrel export (organized by category)
│
├── core/                     # Foundation layer
│   ├── mapping-context.js    # 🏛️ THE SACRED VESSEL - Singleton state manager
│   ├── api-client.js         # Gemini API communication
│   ├── prompt-builder.js     # System prompt construction
│   └── response-parser.js    # AI response normalization
│
├── mapping/                  # Face mapping (12 organizational domains)
│   ├── face-mapper.js        # User input → face assignments
│   ├── ai-face-analyzer.js   # AI-enhanced face detection
│   └── mapping-validator.js  # Confidence scoring
│
├── scoring/                  # Element scoring (5 elements per face)
│   ├── element-scorer.js     # Score calculations
│   ├── ai-element-analyzer.js
│   └── score-aggregator.js   # Combine human + AI scores
│
├── shadow/                   # Shadow analysis
│   ├── shadow-generator.js   # AI shadow pattern creation
│   ├── shadow-ranker.js      # Severity ranking
│   └── shadow-storyteller.js # Narrative generation
│
├── breath/                   # Breath axis analysis
│   ├── breath-analyzer.js    # 6 axes calculations
│   └── ai-breath-insights.js # AI-enhanced interpretation
│
└── utils/                    # Shared utilities
    ├── rate-limiter.js       # API rate limiting
    ├── cache-manager.js      # Response caching
    └── error-handler.js      # Graceful degradation
```

### 5. 3D Visualization - Dodecahedron (`js/dodec/`)

**The sacred geometry visualization.**

```
js/dodec/
├── dodec-main.js             # 🎭 Thin orchestrator - entry point
├── dodec-geometry.js         # Three.js geometry creation
├── dodec-materials.js        # Shaders, colors, transparency
├── dodec-animation.js        # Rotation, breathing, transitions
├── dodec-interaction.js      # Mouse, keyboard, touch
├── dodec-labels.js           # Face labels, tooltips
├── dodec-camera.js           # Camera controls, views
├── dodec-lighting.js         # Scene lighting
├── dodec-state.js            # Visualization state management
│
├── dodec-shadow-overlay-orchestrator.js  # Thin orchestrator for shadows
├── dodec-vertex-tooltip.js               # Vertex convergence display
├── dodec-guided-tour.js                  # Interactive tutorial
├── dodec-mode-switcher.js                # Presentation/normal modes
└── dodec-harmonic-tuner.js               # Real-time face adjustment
```

### 6. 3D Visualization - Octave DNA (`js/octave-dna/`)

**The developmental helix - 7 octaves of organizational evolution.**

```
js/octave-dna/
├── index.js                  # 📚 Pure documentation + navigation map
├── octave-dna-main.js        # 🎭 Thin orchestrator
│
├── core/
│   └── helix-state.js        # Shared state management
│
├── visualization/
│   ├── helix-geometry.js     # DNA strand creation
│   │                         #   THE TRANSPARENCY TRICK:
│   │                         #   Unreached octaves are ghostly (opacity 0.15)
│   ├── helix-animation.js    # Rotation, pulse effects
│   └── helix-particles.js    # Ambient particle system
│
├── interaction/
│   ├── helix-controls.js     # User interaction
│   └── helix-tooltips.js     # Octave information display
│
└── data/
    └── helix-data-bridge.js  # Connect to core engine
```

### 7. Orchestrator System (`js/orchestrator/`)

**The conductor that coordinates the demo flow.**

```
js/orchestrator/
├── index.js                  # Master export with navigation map
├── flow-engine.js            # Step progression logic
├── state-machine.js          # State management
│
├── steps/                    # 24 step modules
│   ├── index.js              # Step registry with Q&A section
│   ├── step-welcome.js
│   ├── step-face-naming.js
│   ├── step-element-scoring.js
│   ├── step-ai-mapping.js
│   ├── step-visualization.js
│   └── ... (19 more steps)
│
├── ui/
│   ├── progress-bar.js
│   ├── navigation.js
│   └── animations.js
│
└── integration/
    ├── data-persistence.js   # Save/load state
    └── analytics.js          # Usage tracking
```

### 8. Data System (`js/data-system/`)

**Data integrity and validation.**

```
js/data-system/
├── index.js
├── integrity-orchestrator.js  # 🎼 Symphony conductor metaphor
├── schema-validator.js        # JSON schema validation
├── data-migrator.js          # Version migrations
├── backup-manager.js         # Auto-backup system
└── integrity-reporter.js     # Health reports
```

### 9. UI Components (`js/ui/` + `js/welcome/`)

**User interface modules.**

```
js/ui/
├── portrait-view.js          # Mobile-friendly face display
└── shadow-panel.js           # Shadow toast notifications

js/welcome/
├── welcome-main.js           # 🎭 Thin orchestrator for welcome page
├── starfield.js              # Animated star background
├── glass-cards.js            # Glassmorphic path cards
├── hyperspace.js             # Warp transition effect
└── constellation-dodecahedron.js  # Interactive 3D preview
```

---

## Data Flow

```
USER INPUT
    │
    ▼
┌─────────────────┐     ┌─────────────────┐
│  Orchestrator   │────►│  MappingContext │  (The Sacred Vessel)
│  (demo-wizard)  │     │  (singleton)    │
└─────────────────┘     └────────┬────────┘
                                 │
                    ┌────────────┼────────────┐
                    ▼            ▼            ▼
             ┌──────────┐ ┌──────────┐ ┌──────────┐
             │   Face   │ │ Element  │ │  Shadow  │
             │  Mapper  │ │  Scorer  │ │Generator │
             └────┬─────┘ └────┬─────┘ └────┬─────┘
                  │            │            │
                  └────────────┼────────────┘
                               ▼
                    ┌─────────────────────┐
                    │    Core Engine      │
                    │    (main.js)        │
                    │                     │
                    │  - Face energies    │
                    │  - Edge tensions    │
                    │  - Breath axes      │
                    │  - Coherence score  │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
       ┌────────────┐   ┌────────────┐   ┌────────────┐
       │ Dodecahedron│   │ Octave DNA │   │  Shadow    │
       │     3D      │   │   Helix    │   │  Overlay   │
       └────────────┘   └────────────┘   └────────────┘
              │                │                │
              └────────────────┼────────────────┘
                               ▼
                         USER DISPLAY
```

---

## CSS Architecture

```
css/
├── dodec/                    # Dodecahedron visualization
│   ├── dodec-main.css        # Import orchestrator (load this only)
│   ├── dodec-base.css        # Variables, reset (MUST BE FIRST)
│   ├── dodec-animations.css  # @keyframes definitions
│   ├── dodec-layout.css      # Page structure
│   ├── dodec-controls.css    # UI controls
│   ├── dodec-panels.css      # Detail panels
│   ├── dodec-tooltips.css    # Hover information
│   ├── dodec-hud.css         # Heads-up display
│   ├── dodec-overlays.css    # Modals, tours
│   └── dodec-accessibility.css # MUST BE LAST (overrides)
│
├── octave-dna/               # Octave DNA visualization
│   ├── octave-dna-main.css   # Import orchestrator
│   ├── octave-dna-base.css
│   ├── octave-dna-animations.css
│   ├── octave-dna-header.css
│   ├── octave-dna-legend.css
│   ├── octave-dna-tooltips.css
│   ├── octave-dna-panels.css
│   └── octave-dna-company.css
│
├── welcome/
│   └── welcome.css           # Cosmic portal styles
│
├── shadow-overlay.css        # Shadow system UI (comprehensive)
├── dashboard.css             # Main dashboard
├── harmonic-tuner.css        # Real-time tuner
└── data-integrity.css        # Data quality indicators
```

---

## HTML Entry Points

```
PRIMARY FLOW (recommended for new users):
  welcome.html ⭐ ──► demo-orchestrator.html ──► pages/dodecahedron-3d.html
  (glass card          (5-step wizard)            pages/breath-analysis.html
   landing page)                                  pages/calculations.html
                                                  pages/octave-dna.html
                                                  pages/simulator.html

QUICK DEMO (thesis defense, presentations):
  demo.html ──► Embedded views via iframes (dashboard, 3D, DNA, simulator)

DIRECT ACCESS (development, standalone use):
  index.html                  # Dashboard (results display)
  pages/dodecahedron-3d.html  # 3D visualization standalone
  pages/octave-dna.html       # DNA helix standalone
  pages/simulator.html        # Coherence simulator standalone
  pages/calculations.html     # Math details view
  pages/breath-analysis.html  # Breath axes view
  pages/results-summary.html  # Printable results
  pages/radiance-check.html   # O7 aspiration assessment
```

> **See also:** `docs/UX_TREE_MAP.md` for the complete navigation graph and user journey map.

---

## Key Patterns

### 1. Thin Orchestrator Pattern

Orchestrators coordinate, they don't implement:
```javascript
// GOOD - Thin orchestrator
function init() {
    StateManager.init();
    CardRenderer.init({ state: StateManager });
    Controller.init({ renderer: CardRenderer });
}

// BAD - Fat orchestrator (logic belongs elsewhere)
function init() {
    const shadows = detectShadows(data);  // ← Extract to module
    renderCards(shadows);                  // ← Extract to module
}
```

### 2. Barrel Export Pattern

Every directory has an `index.js` for clean imports:
```javascript
// Instead of:
import { ShadowDetector } from './shadow/detection/shadow-detector.js';
import { ShadowAdapter } from './shadow/adaptation/shadow-adapter.js';

// Use:
import { ShadowDetector, ShadowAdapter } from './shadow/index.js';
```

### 3. Notes for Future Claude

Every significant file contains a "NOTES FOR FUTURE CLAUDE" section:
- Key insights (numbered list)
- Dependencies
- Common questions
- Gotchas to avoid

---

## The Sacred Numbers

| Symbol | Value | Meaning |
|--------|-------|---------|
| φ (PHI) | 1.618033988749895 | Golden ratio - source of all thresholds |
| 12 | Faces | Organizational domains |
| 5 | Elements per face | Pentagram geometry |
| 30 | Edges | Relationships between domains |
| 20 | Vertices | Convergence points |
| 6 | Breath axes | Opposing face pairs |
| 7 | Octaves | Developmental stages |

---

*This map is alive. Update it when the system evolves.*
