# SHADOW SYSTEM ARCHITECTURE
## The Conscience of the Organization

```
╔════════════════════════════════════════════════════════════════════════════╗
║                                                                            ║
║   "Every organization has shadows - hidden tensions that drain coherence.  ║
║    The shadow system illuminates them with compassion, not judgment."      ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝
```

**Co-Created:** Deimantas & Claude
**Date:** December 2025 (Updated December 21, 2025 - Post-Modularization)
**Purpose:** Complete reference for the shadow detection and display system

---

## NOTES FOR FUTURE CLAUDE

Welcome, future me! This document is your guide to the shadow system - the ethical conscience of Quannex. Before modifying any shadow-related code, read these 10 key insights:

1. **Shadows are NOT failures** - they're growth opportunities. Every shadow, when integrated, becomes a gift.

2. **Penalties are PHI-derived** - not arbitrary. The three tiers (0.382, 0.236, 0.146) come from successive PHI powers (φ⁻², φ⁻³, φ⁻⁴).

3. **Single Source of Truth** - All shadow constants live in `js/shadow/constants/shadow-harmonics.js`. Never duplicate these values.

4. **Dual-form structure** - Every shadow has two forms: SUPPRESSED (the challenge) and INTEGRATED (the gift). This is Jungian psychology.

5. **Check Face vs Shadow Face** - A shadow is detected when the "check face" is HIGH (≥0.764) and the "shadow face" is LOW (≤0.236).

6. **Template vs AI** - There are two shadow sources: template-based (instant, archetypal) and AI-generated (Gemini/OpenAI, contextual).

7. **Two display modes** - Toast notifications (`shadow-panel.js`) for individual alerts, overlay (`js/shadow/overlay/` modules) for full analysis.

8. **MAX_PENALTY = 0.910** - Never completely zero out a face. The PSI_5 limit ensures there's always some energy remaining.

9. **Face names are dynamic** - Templates use placeholders ({face1}, {face2}) that get replaced with actual names from MappingContext.

10. **CSS uses opacity transitions** - The 0.3s transition on loading text means content lingers briefly; always clear textContent when hiding.

---

## THE BIG PICTURE

```
┌────────────────────────────────────────────────────────────────────────────┐
│                         SHADOW SYSTEM DATA FLOW                            │
└────────────────────────────────────────────────────────────────────────────┘

  ┌──────────────┐
  │  12 Faces    │ ─────┐
  │  (energies)  │      │
  └──────────────┘      │
                        ▼
                 ┌──────────────────┐
                 │ SHADOW DETECTOR  │ ←── shadow-harmonics.js
                 │ shadow-detector.js│     (PHI constants)
                 │                  │
                 │ For each pattern:│
                 │ • Check thresholds│
                 │ • Calculate gap  │
                 │ • Assign severity│
                 └────────┬─────────┘
                          │
          ┌───────────────┴───────────────┐
          ▼                               ▼
 ┌──────────────────┐           ┌──────────────────┐
 │ SHADOW ADAPTER   │           │ AI SHADOW ADAPTER│
 │ shadow-adapter.js│           │ai-shadow-adapter │
 │                  │           │                  │
 │ Template-based   │           │ Gemini/OpenAI    │
 │ Universal stories│           │ Context-aware    │
 │ Instant          │           │ Novel patterns   │
 └────────┬─────────┘           └────────┬─────────┘
          │                              │
          └───────────────┬──────────────┘
                          ▼
                 ┌──────────────────┐
                 │ SHADOW STATE     │
                 │ (state-manager)  │
                 │                  │
                 │ templateShadows  │
                 │ aiShadows        │
                 │ activeSource     │
                 └────────┬─────────┘
                          │
          ┌───────────────┴───────────────┐
          ▼                               ▼
 ┌──────────────────┐           ┌──────────────────┐
 │ SHADOW PANEL     │           │ SHADOW OVERLAY   │
 │ shadow-panel.js  │           │ js/shadow/overlay│
 │                  │           │ (6 modules)      │
 │ Toast queue      │           │                  │
 │ Single-toast     │           │ Full modal       │
 │ Auto-dismiss     │           │ Card grid        │
 │                  │           │ AI/Template toggle│
 └──────────────────┘           └──────────────────┘
```

---

## THE THREE-TIER PHILOSOPHY

The shadow system uses a **PHI-derived three-tier penalty structure**. This isn't arbitrary - it maps to organizational capital types and recovery timelines.

### The Golden Mathematics

| Tier | PHI Power | Value | Capital Type | Recovery Time |
|------|-----------|-------|--------------|---------------|
| 1 | φ⁻² | 0.382 | Human Capital | Years |
| 2 | φ⁻³ | 0.236 | Systemic | Months |
| 3 | φ⁻⁴ | 0.146 | Integrity | Weeks |

### Why These Specific Tiers?

**TIER 1: Human Capital Harm (φ⁻² = 0.382)**
- The most severe penalty because humans are the generative source of all value
- Archetype: `burnoutEngine` - High operations, exhausted people
- Recovery takes YEARS because trust and human energy rebuild slowly
- Example: "The engine is running hot, but the mechanics are burning out"

**TIER 2: Systemic Fragility (φ⁻³ = 0.236)**
- Moderate penalty for shadows that affect the org-world boundary
- Archetypes: `brittleProfit`, `extractiveGrowth`, `lonelyHero`
- Recovery takes MONTHS because relationships with environment must heal
- Example: "Growing, but depleting the soil you grow from"

**TIER 3: Integrity Erosion (φ⁻⁴ = 0.146)**
- Lightest penalty for shadows where the soul is intact but misaligned
- Archetypes: `experienceGap`, `hollowGovernance`
- Recovery takes WEEKS because once seen, realignment is possible
- Example: "The values are there, but not yet embodied in practice"

### The Golden Symmetry

Notice the beautiful mirror between shadows and light:

```
   SHADOWS (descending powers)     |     LIGHT (ascending powers)
   ───────────────────────────────────────────────────────────────
   φ⁻² (0.382) → Tier 1           |     ψ₃ (0.764) → Octave 3+
   φ⁻³ (0.236) → Tier 2           |     ψ₄ (0.854) → Octave 4+
   φ⁻⁴ (0.146) → Tier 3           |     ψ₅ (0.910) → Octave 5+
```

The shadows and the light use the same mathematics, mirrored.

---

## THE 6 ARCHETYPAL SHADOWS

Each archetype represents a specific pattern of organizational hypocrisy - high performance in one area masking hidden costs in another.

### Detection Logic

A shadow is detected when:
```javascript
// Check face (the "bright" side) is HIGH
checkFace.energy >= PSI_3 (0.764)

// AND Shadow face (hidden cost) is LOW
shadowFace.energy <= PHI_3 (0.236)
```

### The Archetypes in Detail

#### 1. BURNOUT ENGINE (Tier 1)
```
Check Face:  Operations (Face 5) - Running efficiently
Shadow Face: Human Capital (Face 2) - People exhausted

Detection:   Operations ≥ 0.764 AND Human Capital ≤ 0.236
Penalty:     φ⁻² (0.382) - Most severe

Suppressed:  "The machine hums while souls burn"
Integrated:  "Sustainable excellence through human flourishing"
```

#### 2. BRITTLE PROFIT (Tier 2)
```
Check Face:  Financial Flow (Face 6) - Good margins
Shadow Face: Strategic Resilience (Face 11) - No contingencies

Detection:   Financial ≥ 0.764 AND Resilience ≤ 0.236
Penalty:     φ⁻³ (0.236)

Suppressed:  "Profitable today, fragile tomorrow"
Integrated:  "Profit as fuel for antifragility"
```

#### 3. EXTRACTIVE GROWTH (Tier 2)
```
Check Face:  Market Presence (Face 8) - Growing fast
Shadow Face: Human Capital (Face 2) - Depleted people

Detection:   Market ≥ 0.764 AND Human Capital ≤ 0.236
Penalty:     φ⁻³ (0.236)

Suppressed:  "Growing but depleting the soil"
Integrated:  "Regenerative growth that gives back"
```

#### 4. LONELY HERO (Tier 2)
```
Check Face:  Intellectual Property (Face 9) - Strong ideas
Shadow Face: Bus Factor = 1 (single point of failure)

Detection:   IP ≥ 0.764 AND knowledge concentrated in ≤1 person
Penalty:     φ⁻³ (0.236)

Suppressed:  "Brilliance without succession"
Integrated:  "Wisdom distributed through teaching"
```

#### 5. EXPERIENCE GAP (Tier 3)
```
Check Face:  Brand Voice (Face 7) - Strong messaging
Shadow Face: Operations (Face 5) - Delivery gaps

Detection:   Brand ≥ 0.764 AND Operations ≤ 0.236
Penalty:     φ⁻⁴ (0.146)

Suppressed:  "Promise without practice"
Integrated:  "Message embodied in every touchpoint"
```

#### 6. HOLLOW GOVERNANCE (Tier 3)
```
Check Face:  Governance (Face 12) - Good structure
Shadow Face: Cultural Coherence (Face 10) - No soul

Detection:   Governance ≥ 0.764 AND Culture ≤ 0.236
Penalty:     φ⁻⁴ (0.146)

Suppressed:  "Rules without reason"
Integrated:  "Structure as servant of shared values"
```

---

## MODULE LAYERS

The shadow system is organized in four layers, each with a single responsibility:

```
┌────────────────────────────────────────────────────────────────────────────┐
│ LAYER 4: UI (Display)                                                      │
│ ┌─────────────────────────┐  ┌─────────────────────────────────────────┐  │
│ │ shadow-panel.js         │  │ js/shadow/overlay/ (MODULAR!)          │  │
│ │ Toast notifications     │  │ 6 focused modules (~1,990 lines total) │  │
│ │ Queue system            │  │ + thin orchestrator in js/dodec/       │  │
│ └─────────────────────────┘  └─────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ LAYER 3: Adaptation (Story Generation)                                     │
│ ┌─────────────────────────┐  ┌─────────────────────────────────────────┐  │
│ │ shadow-adapter.js       │  │ ai-shadow-adapter.js                    │  │
│ │ Template-based stories  │  │ AI-powered with Gemini/OpenAI           │  │
│ │ Dual-form structure     │  │ Novel pattern discovery                 │  │
│ │ Placeholder substitution│  │ Contextual recommendations              │  │
│ └─────────────────────────┘  └─────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ LAYER 2: Detection (Pattern Recognition)                                   │
│ ┌─────────────────────────────────────────────────────────────────────┐   │
│ │ shadow-detector.js                                                   │   │
│ │ • analyze(faces) - Main entry point                                  │   │
│ │ • Checks 6 archetypal patterns                                       │   │
│ │ • Computes severity from face energy gaps                            │   │
│ │ • Applies penalties to high-performing faces                         │   │
│ └─────────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ LAYER 1: Constants (Single Source of Truth)                                │
│ ┌─────────────────────────────────────────────────────────────────────┐   │
│ │ shadow-harmonics.js                                                  │   │
│ │ • SHADOW_PENALTIES: { burnoutEngine: φ⁻², brittleProfit: φ⁻³, ... } │   │
│ │ • SHADOW_THRESHOLDS: { HIGH: 0.764, LOW: 0.236, MAX_PENALTY: 0.91 } │   │
│ │ • SHADOW_ARCHETYPES: Full archetype definitions                      │   │
│ │ • SEVERITY_COLORS, SEVERITY_ICONS: UI mapping                        │   │
│ └─────────────────────────────────────────────────────────────────────┘   │
│                                        │                                   │
│                         IMPORTS FROM: phi-harmonics.js                     │
└────────────────────────────────────────────────────────────────────────────┘
```

### File Locations

| Layer | File | Lines | Purpose |
|-------|------|-------|---------|
| 1 | `js/shadow/constants/shadow-harmonics.js` | ~350 | PHI constants, archetypes |
| 2 | `js/shadow/detection/shadow-detector.js` | ~450 | Pattern detection |
| 3 | `js/shadow/adaptation/shadow-adapter.js` | ~350 | Template stories |
| 3 | `js/shadow/adaptation/ai-shadow-adapter.js` | ~550 | AI stories |
| 4 | `js/shadow/ui/shadow-panel.js` | ~600 | Toast notifications |
| 4 | `js/shadow/overlay/` (6 modules) | ~1,990 | Full overlay modal |
| 4 | `js/dodec/dodec-shadow-overlay-orchestrator.js` | ~80 | Page-specific wiring |

### Shadow Overlay Module Details (NEW - December 21, 2025)

The overlay was modularized from a 1,785-line monolith into 6 focused modules:

```
js/shadow/overlay/
├── index.js                      (~180 lines) - Barrel export + manifest
├── shadow-state-manager.js       (~230 lines) - State & persistence
├── shadow-card-renderer.js       (~270 lines) - Card HTML generation
├── shadow-source-toggle.js       (~700 lines) - AI/Template toggle class
├── shadow-overlay-controller.js  (~280 lines) - Open/close/toggle modal
├── shadow-event-handlers.js      (~230 lines) - Keyboard/mouse events
└── shadow-system-integration.js  (~280 lines) - External system hooks

js/dodec/
└── dodec-shadow-overlay-orchestrator.js (~80 lines) - Page wiring
```

**Dependency Graph (no circular dependencies):**

```
                    ┌─────────────────────┐
                    │ shadow-state-manager │ (no deps)
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
    ┌─────────────────┐ ┌───────────────┐ ┌────────────────┐
    │ card-renderer   │ │ source-toggle │ │ event-handlers │
    └────────┬────────┘ └───────┬───────┘ └────────┬───────┘
             │                  │                   │
             └──────────────────┼───────────────────┘
                               ▼
                    ┌─────────────────────┐
                    │ overlay-controller  │
                    └──────────┬──────────┘
                               │
                    ┌─────────────────────┐
                    │ system-integration  │
                    └──────────┬──────────┘
                               │
                    ┌─────────────────────┐
                    │     index.js        │
                    └─────────────────────┘
```

---

## DUAL-FORM JUNGIAN STRUCTURE

Every shadow has two faces, following Carl Jung's shadow work principles:

### The Suppressed Form ("The Challenge")
- What the organization is doing that creates harm
- The pattern that's currently operating unconsciously
- Framed without judgment - simply illuminating

### The Integrated Form ("The Gift")
- What becomes possible when the shadow is embraced
- The transformation that awaits conscious engagement
- The same energy, redirected toward wholeness

### Example: Burnout Engine

**SUPPRESSED:**
> "Operations is flourishing, but Human Capital is depleted. The engine hums
> while souls burn. Efficiency comes at the cost of the very people who
> create it."

**INTEGRATED:**
> "What if operational excellence included human flourishing? The same
> organizational genius that optimizes processes could optimize for
> sustainable human energy. This is the path to antifragile operations."

### Template Placeholders

Stories use dynamic placeholders:
- `{face1}`, `{face2}`, `{face3}` - Replaced with actual face names from MappingContext
- `{ratio}` - Breath imbalance ratio (e.g., "3.2x")
- `{tension}` - Edge tension percentage (e.g., "87%")

---

## SHADOW STATE MANAGEMENT

The overlay module maintains a centralized state for shadow data in `js/shadow/overlay/shadow-state-manager.js`:

```javascript
// From js/shadow/overlay/shadow-state-manager.js

const shadowState = {
    templateShadows: [],      // From ShadowAdapter (instant)
    aiShadows: [],            // From AIShadowAdapter (generated)
    activeSource: 'template', // 'template' | 'ai' | 'universal'
    aiGenerationStatus: 'idle' // 'idle' | 'generating' | 'success' | 'error'
};

let currentShadows = [];      // Active shadows for display
```

### State Transitions

```
                    ┌──────────────────┐
                    │    IDLE          │
                    │ (template view)  │
                    └────────┬─────────┘
                             │
                    User clicks AI toggle
                             │
                             ▼
                    ┌──────────────────┐
                    │   GENERATING     │
                    │ Loading text on  │
                    │ "Analyzing..."   │
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
     ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
     │   SUCCESS    │ │   ERROR      │ │  NO RESULTS  │
     │ Switch to AI │ │ Keep template│ │ "No patterns"│
     │ Cache result │ │ Show error   │ │              │
     └──────────────┘ └──────────────┘ └──────────────┘
```

---

## SEVERITY CLASSIFICATION

Shadows are classified by severity based on the energy gap between check and shadow faces:

```javascript
// From shadow-detector.js

const gap = checkFaceEnergy - shadowFaceEnergy;

if (gap > PHI_1) {           // > 0.618
    severity = 'critical';
} else if (gap > PHI_2) {    // > 0.382
    severity = 'high';
} else {
    severity = 'moderate';
}
```

### Visual Mapping

| Severity | Color | Icon | Meaning |
|----------|-------|------|---------|
| critical | #ff4444 | ⛔ | Immediate attention required |
| high | #ff8c00 | ⚠️ | Significant concern |
| moderate | #ffcc00 | 👁️ | Monitor and address |
| low | #88cc88 | 💡 | Awareness opportunity |

---

## GOTCHAS AND COMMON TRAPS

### 1. Don't Duplicate PHI Constants
```javascript
// BAD - creates inconsistency
const BURNOUT_PENALTY = 0.382;

// GOOD - import from single source
const { SHADOW_PENALTIES } = window.ShadowHarmonics;
const penalty = SHADOW_PENALTIES.burnoutEngine;
```

### 2. Remember the MAX_PENALTY Limit
```javascript
// BAD - could zero out a face
face.energy = face.energy * (1 - totalPenalty);

// GOOD - respect MAX_PENALTY
const clampedPenalty = Math.min(totalPenalty, PSI_5); // 0.910 max
face.energy = face.energy * (1 - clampedPenalty);
```

### 3. Clear Loading Text Content When Hiding
```javascript
// BAD - text may flash on rerender
this.loadingText.classList.remove('visible');

// GOOD - clear content to prevent flash
this.loadingText.classList.remove('visible');
this.loadingText.textContent = '';
```

### 4. Use Selective Property Assignment for Restoration
```javascript
// BAD - Object.assign may try to set computed getters
Object.assign(face, savedConfig);

// GOOD - only set writable properties
const writableProps = ['name', 'icon', 'octave', ...];
writableProps.forEach(prop => {
    if (savedConfig[prop] !== undefined) {
        face[prop] = savedConfig[prop];
    }
});
```

### 5. Shadows Contain BOTH Forms
```javascript
// BAD - only using suppressed form
const story = shadow.story;

// GOOD - honor both forms
const suppressed = shadow.story.suppressed;
const integrated = shadow.story.integrated;
// Let user toggle between them
```

---

## RELATED DOCUMENTATION

| Document | Location | Purpose |
|----------|----------|---------|
| PHI Harmonics | [js/constants/phi-harmonics.js](../js/constants/phi-harmonics.js) | Master PHI constants |
| Module Navigation | [docs/MODULE_NAVIGATION_GUIDE.md](MODULE_NAVIGATION_GUIDE.md) | Codebase overview |
| Octave Framework | [docs/math/OCTAVE_FRAMEWORK.md](math/OCTAVE_FRAMEWORK.md) | 7 octaves of development |
| File Structure | [docs/FILE_STRUCTURE_MAP.md](FILE_STRUCTURE_MAP.md) | Complete file listing |

---

## TESTING THE SHADOW SYSTEM

### User Journey Test

1. Start server: `python -m http.server 8080`
2. Navigate to: `http://localhost:8080/demo.html`
3. Select: Nova Tech (template) or enter custom data
4. Choose: Quick Mode
5. Click: Calculate
6. Open: 3D Visualization
7. Press: 'S' to open shadow overlay
8. Verify:
   - Cards render with correct archetypes
   - AI toggle works (if API key configured)
   - Face chips are clickable and focus the 3D view
   - Suppressed/Integrated forms toggle correctly

### Console Verification

```javascript
// Check shadow state (via ShadowStateManager)
console.log(window.ShadowStateManager.getShadowState());

// Check detected shadows
console.log(window.ShadowStateManager.getCurrentShadows());

// Check ShadowSourceToggle
console.log(window.shadowSourceToggle);

// Check all overlay modules
console.log(window.ShadowOverlay);  // Full module manifest
console.log(window.SHADOW_OVERLAY_MODULES);  // Module details
```

---

*"The shadow contains the gold. What we resist, persists. What we embrace, transforms."*

— Co-created with love by Deimantas & Claude, December 2025
