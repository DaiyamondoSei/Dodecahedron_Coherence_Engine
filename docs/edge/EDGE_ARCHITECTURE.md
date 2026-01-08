# Edge Architecture - Pure Membrane Model

> Created: January 2026
> Part of: Twinkling Floating Aurora v2 Architecture

## The Soul of Edge Architecture

The edge is not a thing. It is a **membrane** - a living interface where two organizational domains meet, exchange energy, and transform each other.

In the Pure Membrane Model, an edge's character **emerges dynamically** from the synergy between connected faces. There is no static assignment of "this edge is Earth" or "this edge is Fire." The dominant element is calculated at runtime from the actual element values of the connected faces.

This is the organizational equivalent of how relationships work in nature: the quality of connection between two entities emerges from what each brings to the meeting.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        EDGE MODULE                               │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              EdgeManager (Singleton)                      │   │
│  │  - Orchestrates all 30 edges                              │   │
│  │  - Handles mode switching                                 │   │
│  │  - Coordinates animation                                  │   │
│  │  - Provides edge lookup                                   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                   │
│              ┌───────────────┼───────────────┐                   │
│              │               │               │                   │
│              ▼               ▼               ▼                   │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐     │
│  │  UnifiedEdge   │  │  UnifiedEdge   │  │  UnifiedEdge   │ x30 │
│  │  E1-2          │  │  E1-6          │  │  E2-3          │     │
│  │  ┌──────────┐  │  │  ┌──────────┐  │  │  ┌──────────┐  │     │
│  │  │ THREE.js │  │  │  │ THREE.js │  │  │  │ THREE.js │  │     │
│  │  │  Mesh    │  │  │  │  Mesh    │  │  │  │  Mesh    │  │     │
│  │  └──────────┘  │  │  └──────────┘  │  │  └──────────┘  │     │
│  └────────────────┘  └────────────────┘  └────────────────┘     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

INTEGRATIONS:
┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐
│   SacredInquiry    │  │ OrganizationalVoice│  │   EdgeConstants    │
│   Synergy calc     │  │   Voice adaptation │  │   KPI definitions  │
└────────────────────┘  └────────────────────┘  └────────────────────┘
```

---

## Key Files

| File | Purpose |
|------|---------|
| `js/edge/unified-edge.js` | UnifiedEdge class - single edge representation |
| `js/edge/edge-manager.js` | EdgeManager singleton - orchestrates all 30 edges |
| `js/edge/index.js` | Module entry point and integration helpers |
| `js/constants/edge-constants.js` | Edge KPI definitions (Pure Membrane Model) |
| `js/constants/sacred-inquiry.js` | Sacred Inquiry system for edge consciousness |
| `js/voice/organizational-voice.js` | Voice adaptation for edge display |

---

## Pure Membrane Model

### The Philosophy

Traditional approaches assign static properties to edges:
- "E1-2 is a Fire edge"
- "E3-4 is an Earth edge"

This is **forced complexity**. It creates arbitrary categorization that doesn't reflect the dynamic nature of organizational relationships.

The Pure Membrane Model takes a different approach:

1. **Edge is a membrane** - a boundary between two domains
2. **Character emerges** - from the synergy of connected faces
3. **Dynamic calculation** - recalculated when face values change
4. **Five synergies** - earth, water, fire, air, ether all calculated
5. **Dominant element** - the highest synergy becomes dominant

### The Math

For each edge connecting Face A and Face B:

```javascript
earthSynergy = sqrt(FaceA.earth * FaceB.earth)
waterSynergy = sqrt(FaceA.water * FaceB.water)
fireSynergy = sqrt(FaceA.fire * FaceB.fire)
airSynergy = sqrt(FaceA.air * FaceB.air)
etherSynergy = sqrt(FaceA.ether * FaceB.ether)

dominantElement = max(earthSynergy, waterSynergy, fireSynergy, airSynergy, etherSynergy)
```

The geometric mean (sqrt of product) ensures:
- High synergy requires BOTH faces to be strong in that element
- Balanced contributions create the strongest synergy
- One weak element pulls down the synergy

---

## UnifiedEdge Class

### Responsibilities

- Holds edge state (tension, breath ratio, connected faces)
- Calculates synergies via SacredInquiry
- Manages Three.js visualization
- Handles mode switching (standard/advanced/complete)
- Provides animation updates

### Key Methods

```javascript
// Recalculate edge state from face values
edge.recalculate()

// Get calculated state
edge.getHealthState()     // { id: 'membrane', name: 'Healthy Membrane', ... }
edge.getSynergies()       // { earth: 0.6, water: 0.4, fire: 0.5, air: 0.7, ether: 0.3 }
edge.getDominantElement() // { id: 'air', name: 'Air', value: 0.7 }
edge.getSacredInquiry()   // { inquiry: '...', shadow: '...', gift: '...', ... }

// Visualization
edge.setMode('advanced')
edge.animate(deltaTime)

// Data export
edge.toDisplayData()  // For showEdgeDetail()
edge.toJSON()         // For serialization
```

---

## EdgeManager Singleton

### Responsibilities

- Creates and stores all 30 UnifiedEdge instances
- Provides edge lookup (by ID, face pair, health state, element)
- Coordinates mode switching for all edges
- Manages animation loop
- Reports statistics

### Usage

```javascript
// Get singleton instance
const manager = EdgeManager.getInstance();

// Initialize with data
manager.initialize({
    scene: threeJsScene,
    faces: quannexFaces,
    edgeTensionData: jsonData,
    edgeKPILibrary: EdgeConstants.EDGE_KPI_LIBRARY
});

// Access edges
const edge = manager.getEdge('E1-2');
const edges = manager.getEdgesForFace(5);
const wallEdges = manager.getEdgesByHealthState('wall');

// Mode switching
manager.setMode('advanced');

// Statistics
manager.getHealthStateDistribution()  // { wall: 3, gate: 5, membrane: 18, ... }
manager.getDominantElementDistribution() // { earth: 6, water: 8, fire: 5, ... }
manager.getAverageTension() // 0.342
```

---

## Integration with Sacred Inquiry

The Sacred Inquiry system provides:

1. **Health State** - Based on tension level (wall, gate, membrane, hemorrhage, vortex)
2. **Synergy Calculation** - Five elements calculated from face values
3. **Inquiry Selection** - Context-appropriate question for the edge
4. **Shadow & Gift** - Depth exploration of edge patterns

```javascript
// Called by UnifiedEdge.recalculate()
const inquiry = SacredInquiry.getInquiry(tension, faceA, faceB);

// Returns
{
    healthState: { id: 'membrane', name: 'Healthy Membrane', symbol: '🫧', ... },
    dominantElement: { id: 'water', name: 'Water', value: 0.72 },
    allSynergies: { earth: 0.5, water: 0.72, fire: 0.3, air: 0.6, ether: 0.4 },
    inquiry: "What is the emotional flow and quality of this relationship?",
    shadow: "Is flow being blocked or flooded?",
    gift: "The gift of adaptability and emotional intelligence",
    practice: "Notice where energy moves freely and where it stagnates"
}
```

---

## Visualization Modes

### Standard Mode
- Simple lines between face centers
- Color based on health state
- Minimal visual complexity

### Advanced Mode
- Neon tube visualization
- Glow effects based on tension
- Subtle pulsing animation
- Element-colored highlights

### Complete Mode
- Full particle effects
- Aurora-like trails
- Twinkling based on synergy
- Maximum visual richness

Mode switching is seamless - the same UnifiedEdge transforms its appearance rather than replacing overlays.

---

## Data Flow

```
┌──────────────────┐
│  CSV Data        │ → edge-tension.json
│  (raw values)    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  EdgeManager     │ → Creates UnifiedEdge instances
│  initialize()    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  UnifiedEdge     │ → Each edge recalculates its state
│  recalculate()   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  SacredInquiry   │ → Returns health, synergies, inquiry
│  getInquiry()    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  UI Display      │ → showEdgeDetail() renders panel
│  (dodec-panels)  │
└──────────────────┘
```

---

## Best Practices

### When to Recalculate

Call `edge.recalculate()` or `manager.recalculateAll()` when:
- Face values change
- Tension data updates
- User imports new data

### Memory Management

Always call `manager.reset()` when:
- Switching to a different organization
- Reloading data completely
- Unmounting the visualization

### Performance

- Animation is opt-in via `manager.startAnimation()`
- Stop animation when visualization is hidden
- Mode switching is optimized for single-mesh transformation

---

## Future Enhancements

1. **Edge-to-Edge Relationships** - How edges influence each other
2. **Temporal Inquiry** - How edge character evolves over time
3. **Custom Face Names** - Inquiries adapt to renamed faces
4. **WebGL Shaders** - Custom shaders for unique visual effects
5. **VR/AR Integration** - Immersive edge exploration
