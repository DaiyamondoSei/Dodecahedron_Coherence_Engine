# AI System Architecture Guide

> *Last Updated: 2025-12-19*
> *For Future Claude navigating the js/ai/ subsystem*

---

## Overview

The `js/ai/` folder contains 30+ files implementing the AI-powered analysis subsystem. It handles:
- Story interpretation → Face mapping
- KPI extraction
- Octave determination
- Provider fallback for resilience

**Good News:** Key files have Gold-level internal documentation. This guide provides the architectural overview.

---

## Architecture at a Glance

```
┌─────────────────────────────────────────────────────────────────┐
│                        ENTRY POINT                              │
│                    js/ai/index.js                               │
│            Exports window.QuannexAI for browser                 │
└─────────────────────────┬───────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│     CORE      │ │   PROVIDERS   │ │    MAPPING    │
│               │ │               │ │               │
│ MappingContext│ │ FallbackChain │ │  FaceMapper   │
│ ValidationGate│ │ GeminiProvider│ │ KPIExtractor  │
│ NamePropagator│ │ OpenAIProvider│ │OctaveDeterminer│
│               │ │ OfflineProvider│ │               │
└───────────────┘ └───────────────┘ └───────────────┘
        │                 │                 │
        └─────────────────┼─────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│    TUNING     │ │   ADAPTERS    │ │      UI       │
│               │ │               │ │               │
│ ArchetypePresets│ │ ShadowAdapter │ │ APIKeyManager │
│ OctaveModifiers│ │ AIShadowAdapter│ │ ModeSelector  │
│               │ │               │ │ ArchetypeSelector│
└───────────────┘ └───────────────┘ └───────────────┘
```

---

## Self-Documented Files (Read These First)

These files have comprehensive Gold headers with "Notes for Future Claude":

| File | What It Documents |
|------|-------------------|
| `providers/fallback-chain.js` | 4-level fallback hierarchy, retry logic, demo safety |
| `core/mapping-context.js` | Singleton pattern, observer pattern, state management |

**Read their headers first** - they contain everything you need for deep understanding.

---

## Directory Structure

```
js/ai/
├── index.js                    # Master export, window.QuannexAI
├── core/
│   ├── index.js               # Core exports
│   ├── mapping-context.js     # ⭐ GOLD - Central state (singleton)
│   ├── validation-gate.js     # Validation rules
│   └── name-propagator.js     # Face→Edge→Vertex propagation
│
├── providers/
│   ├── index.js               # Provider exports
│   ├── fallback-chain.js      # ⭐ GOLD - Resilience orchestrator
│   ├── ai-provider.js         # Base provider interface
│   ├── gemini-provider.js     # Google Gemini integration
│   ├── openai-provider.js     # OpenAI integration
│   ├── offline-provider.js    # No-network fallback
│   └── provider-factory.js    # Provider creation
│
├── mapping/
│   ├── index.js               # Mapping exports
│   ├── face-mapper.js         # Story → Face analysis
│   ├── kpi-extractor.js       # Story → KPIs
│   └── octave-determiner.js   # Story → Octave level
│
├── adapters/
│   ├── index.js               # Adapter exports
│   ├── shadow-adapter.js      # Shadow detection integration
│   └── ai-shadow-adapter.js   # AI-enhanced shadow detection
│
├── tuning/
│   ├── index.js               # Tuning exports
│   ├── archetype-presets.js   # 4 organization archetypes
│   └── octave-modifiers.js    # Octave-specific adjustments
│
└── ui/
    ├── index.js               # UI exports
    ├── api-key-manager.js     # API key storage/validation
    ├── mode-selector.js       # Quick/Full mode toggle
    ├── archetype-selector.js  # Archetype picker
    ├── lens-pre-selector.js   # Strategic lens choice
    └── vocabulary-style-selector.js # Language style
```

---

## Key Concepts

### 1. MappingContext (Singleton)

The "Sacred Vessel" - central state for all face/edge/vertex mappings.

```javascript
// Always use getInstance(), never new MappingContext()
const context = MappingContext.getInstance();

// Get all faces
const faces = context.getAllFaces();

// Subscribe to changes (Observer pattern)
const unsubscribe = context.subscribe(event => {
    console.log(event.type, event.payload);
});
```

**Events:** `FACE_NAMED`, `ALL_FACES_UPDATED`, `MODE_CHANGED`, `ARCHETYPE_CHANGED`, etc.

**Persistence:** Automatically saves to `sessionStorage` (per-tab).

---

### 2. FallbackChain (Demo Resilience)

Ensures the system works regardless of API availability:

```
Level 1: Primary Provider (Gemini or OpenAI)     ← Best quality
Level 2: Secondary Provider (the other one)      ← Backup
Level 3: Offline Provider (semantic analysis)    ← No network
Level 4: Cached Demo Data                        ← Always works
```

**Key Method:** `executeWithFallback(operation, operationName)`

```javascript
const chain = new FallbackChain();
const result = await chain.analyzeStory(storyText, context);

// Result always includes _meta:
// {
//   provider: 'gemini' | 'openai' | 'offline' | 'cached_demo',
//   attempts: [...],
//   fallbackUsed: boolean
// }
```

---

### 3. Provider Architecture

All providers implement the same interface:

```javascript
class AIProvider {
    async analyzeStory(storyText, context) { }
    async generateStrategicLenses(storyText) { }
    async determineOctaves(faces, storyText) { }
    async extractKPIs(storyText, mode, octave) { }
    async suggestArchetype(storyText) { }
}
```

**Timeouts:**
- Gemini: 20-25 seconds
- OpenAI: 30 seconds
- Offline: 500ms (instant)

---

### 4. Two Modes

| Mode | KPIs | Purpose |
|------|------|---------|
| `quick` | 12 (1 per face) | Fast assessment |
| `full` | 60 (5 per face) | Comprehensive analysis |

---

### 5. Archetype System

Four organization archetypes with different tuning constants:

| Archetype | Focus | Use Case |
|-----------|-------|----------|
| `startup` | Growth, agility | Early-stage ventures |
| `enterprise` | Stability, process | Established companies |
| `balanced` | Harmony | General purpose |
| `nonDual` | Integration, wholeness | Advanced organizations |

Each archetype adjusts the 8 Greek tuning parameters (α, β, γ, δ, ε, ζ, η, κ).

---

## Usage Patterns

### Initialize AI System

```javascript
import { initializeAI } from './ai/index.js';

const { context, provider, apiKeyManager } = await initializeAI({
    apiKeyContainer: document.getElementById('api-key-container'),
    modeContainer: document.getElementById('mode-container'),
    onReady: (result) => console.log('AI Ready!'),
    onError: (err) => console.error('AI Error:', err)
});
```

### Analyze Story with Resilience

```javascript
import { FallbackChain } from './ai/providers/fallback-chain.js';

const chain = new FallbackChain({
    onProviderChange: (type, status) => {
        showSpinner(`Trying ${type}...`);
    },
    onFallback: (type, error) => {
        showWarning(`${type} failed, trying next...`);
    }
});

const result = await chain.analyzeStory(storyText, {
    lens: 'growth',
    vocabulary: 'professional'
});
```

### Full Analysis (Single Call)

```javascript
const analysis = await chain.performFullAnalysis(storyText, {
    mode: 'quick',
    octave: 'O2'
});

// Returns:
// {
//   faces: [...],
//   lenses: [...],
//   overallOctave: 'O2',
//   faceOctaves: [...],
//   kpis: [...],
//   financials: {...},
//   provider: 'gemini',
//   fallbackUsed: false
// }
```

---

## Storage Keys

API keys and preferences are stored in `localStorage`:

| Key | Value |
|-----|-------|
| `quannex_gemini_api_key` | Gemini API key |
| `quannex_openai_api_key` | OpenAI API key |
| `quannex_selected_provider` | `'gemini'` or `'openai'` |

State is stored in `sessionStorage`:

| Key | Value |
|-----|-------|
| `quannex_mapping_context` | Full MappingContext state |

---

## Gotchas

1. **Singleton Pattern:** Always use `MappingContext.getInstance()`, never `new MappingContext()`

2. **Face IDs:** 1-12 (not 0-11!)

3. **Edge IDs:** Strings like `"E1-2"` not numbers

4. **Vertex IDs:** Strings like `"V1"` not numbers

5. **Face Energy Aliases:** Different modules use different names:
   - `sentiment` (AI mapping)
   - `faceEnergy` (Backend Face.js)
   - `energy` (Visualization)

   Use `extractFaceEnergy(face)` utility to handle any format.

6. **sessionStorage is per-tab:** State doesn't sync across browser tabs

7. **Offline Provider Always Works:** It uses local semantic analysis, no network needed

---

## Related Documentation

- [SYSTEM_ARCHITECTURE.md](SYSTEM_ARCHITECTURE.md) - Overall system overview
- [DATA_FLOW_ARCHITECTURE.md](DATA_FLOW_ARCHITECTURE.md) - Data pipeline details
- `js/gemini-client.js` - Has Gold header with octave constraints

---

*This guide provides the architecture. For implementation details, read the Gold headers in the source files.*
