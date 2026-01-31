# Sacred Inquiry Library

> The consciousness layer of edge exploration
> Created: January 2026
> **Status: COMPLETE** - Tested and verified January 8, 2026

**Related Documentation:**
- [EDGE_ARCHITECTURE.md](EDGE_ARCHITECTURE.md) - Parent architecture document
- [../EDGE_DYNAMICS_REFERENCE.md](../EDGE_DYNAMICS_REFERENCE.md) - Edge mathematical foundations
- [../DOCUMENTATION_INDEX.md](../DOCUMENTATION_INDEX.md) - Navigation hub

## The Soul of Sacred Inquiry

Every edge in the dodecahedron is a question waiting to be asked. The Sacred Inquiry Library provides these questions - not as static text, but as dynamic wisdom that emerges from the health state and elemental synergy of each edge.

Sacred Inquiry is not about finding answers. It is about finding the **right questions** - the ones that open doors, reveal shadows, and illuminate gifts.

---

## The Architecture of Inquiry

### Two Dimensions

Sacred Inquiry operates on two dimensions:

1. **Health State** (tension-based, verified January 8, 2026)
   - Wall (0-15% tension) - blocked, impermeable, no exchange
   - Gate (15-35%) - controlled, selective, intentional
   - Membrane (35-65%) - healthy, balanced, semi-permeable
   - Hemorrhage (65-85%) - too open, leaking, boundary dissolution
   - Vortex (85-100%) - amplifying, transforming, emergence

2. **Synergy Element** (face-based)
   - Earth - stability, structure, grounding
   - Water - flow, emotion, adaptability
   - Fire - transformation, passion, catalysis
   - Air - communication, connection, clarity
   - Ether - purpose, meaning, transcendence

### The 25 Inquiry Matrix

| Health State | Earth | Water | Fire | Air | Ether |
|--------------|-------|-------|------|-----|-------|
| Wall | What structure has become a prison? | What emotion has frozen into ice? | What passion has burned to ash? | What truth is being silenced? | What purpose has become dogma? |
| Gate | What is being protected that needs opening? | What flow is being controlled? | What transformation is being resisted? | What connection is being filtered? | What meaning is being guarded? |
| Membrane | How does stability serve this exchange? | What is the quality of emotional flow? | What is being transformed here? | How clear is communication? | What purpose does this serve? |
| Hemorrhage | What stability is leaking away? | Where is emotion bleeding out? | Where is passion dissipating? | What signal is lost in noise? | Where is meaning being diluted? |
| Vortex | What foundation is collapsing? | What emotion is consuming? | What fire is destroying? | What voice is drowning others? | What purpose has become obsession? |

---

## Using Sacred Inquiry

### Getting an Inquiry

```javascript
// Basic usage
const inquiry = SacredInquiry.getInquiry(tension, faceA, faceB);

// Returns
{
    // The primary inquiry question
    inquiry: "What is the quality of emotional flow between these domains?",

    // The shadow question - what might be hidden
    shadow: "Is flow being blocked or flooded?",

    // The gift - what's possible when integrated
    gift: "The gift of adaptability and emotional intelligence",

    // The practice - suggested action
    practice: "Notice where energy moves freely and where it stagnates",

    // Health state details
    healthState: {
        id: 'membrane',
        name: 'Healthy Membrane',
        symbol: '🫧',
        description: 'Healthy exchange boundary',
        indicators: ['balanced flow', 'appropriate permeability', 'clear definition']
    },

    // Dominant element
    dominantElement: {
        id: 'water',
        name: 'Water',
        value: 0.72
    },

    // All synergy values
    allSynergies: {
        earth: 0.5,
        water: 0.72,
        fire: 0.3,
        air: 0.6,
        ether: 0.4
    },

    // Summary for logging
    summary: 'membrane × water'
}
```

### Calculating Synergies Directly

```javascript
// Get synergies without inquiry
const synergies = SacredInquiry.calculateSynergies(faceA, faceB);
// { earth: 0.5, water: 0.72, fire: 0.3, air: 0.6, ether: 0.4 }

// Get dominant synergy
const dominant = SacredInquiry.getDominantSynergy(faceA, faceB);
// { id: 'water', name: 'Water', value: 0.72 }
```

---

## The Five Health States

### Wall (0-15% tension)
**Symbol:** 🧱

The boundary has become a barrier. Energy cannot flow. The system protects itself through rigidity. Very low tension indicates no exchange is happening - the edge is blocked.

**Indicators:**
- Complete blocking of exchange
- Rigid boundaries
- Defensive posture
- No permeability

**Core Inquiry Pattern:**
"What has become so protected it can no longer breathe?"

### Gate (15-35% tension)
**Symbol:** 🚪

The boundary is controlled. Energy flows selectively. The system chooses what enters and exits. Low-moderate tension indicates intentional, managed exchange.

**Indicators:**
- Controlled exchange
- Selective permeability
- Gatekeeping behavior
- Conditional access

**Core Inquiry Pattern:**
"What is being protected, and is that protection still serving?"

### Membrane (35-65% tension)
**Symbol:** 🫧

The boundary is healthy. Energy flows appropriately. The system breathes naturally. Moderate tension indicates balanced, reciprocal exchange - the optimal state.

**Indicators:**
- Balanced exchange
- Appropriate filtering
- Healthy respiration
- Clear but permeable boundary

**Core Inquiry Pattern:**
"How does this exchange serve the whole?"

### Hemorrhage (65-85% tension)
**Symbol:** 💧

The boundary is too porous. Energy leaks out. The system loses definition. High tension indicates over-flow - boundaries dissolving, resources leaking.

**Indicators:**
- Excessive outflow
- Boundary dissolution
- Energy depletion
- Loss of definition

**Core Inquiry Pattern:**
"What precious thing is leaking away unnoticed?"

### Vortex (85-100% tension)
**Symbol:** 🌀

The boundary has become an amplifier. Energy is intensely active. The system is in rapid transformation - creative chaos where emergence happens.

**Indicators:**
- Boundary collapse
- Energy consumption
- System overwhelm
- Identity crisis

**Core Inquiry Pattern:**
"What is consuming itself and why?"

---

## The Five Synergy Elements

### Earth (Stability)
**Symbol:** 🜃 (Alchemical Earth)

Earth synergy measures the structural resonance between two domains. High earth synergy indicates stable, grounded connections. Low earth synergy suggests instability or lack of foundation.

**Corporate Language:** Infrastructure alignment, structural integrity
**Conscious Language:** Grounding, rootedness, stability

### Water (Flow)
**Symbol:** 💧

Water synergy measures the emotional and adaptive resonance. High water synergy indicates smooth flow and emotional intelligence. Low water synergy suggests blocked emotions or rigid responses.

**Corporate Language:** Agility, responsiveness, adaptability
**Conscious Language:** Emotional flow, intuition, adaptability

### Fire (Transformation)
**Symbol:** 🔥

Fire synergy measures the catalytic and transformative resonance. High fire synergy indicates active change and growth. Low fire synergy suggests stagnation or resistance to change.

**Corporate Language:** Innovation velocity, change management
**Conscious Language:** Transformation, passion, creative destruction

### Air (Communication)
**Symbol:** 💨

Air synergy measures the communicative and connective resonance. High air synergy indicates clear communication and strong connections. Low air synergy suggests miscommunication or isolation.

**Corporate Language:** Information flow, stakeholder communication
**Conscious Language:** Connection, clarity, truth-speaking

### Ether (Purpose)
**Symbol:** ✧

Ether synergy measures the purposeful and meaningful resonance. High ether synergy indicates aligned purpose and shared meaning. Low ether synergy suggests misalignment or loss of meaning.

**Corporate Language:** Strategic alignment, mission coherence
**Conscious Language:** Purpose, meaning, transcendence

---

## Integration with Voice System

Sacred Inquiry integrates with OrganizationalVoice for vocabulary adaptation:

```javascript
// Set voice context
OrganizationalVoice.VoiceState.setContext('corporate');

// Inquiry text adapts
// "stability" becomes "infrastructure alignment"
// "flow" becomes "agility"
// etc.
```

---

## The Complete Inquiry Library

Below is every inquiry in the 25-cell matrix:

### Wall × Earth
**Inquiry:** What structure has become a prison? What foundation has calcified into immobility?
**Shadow:** Is security being confused with stagnation?
**Gift:** The wisdom of knowing when structure has served its purpose
**Practice:** Identify one rigid structure and imagine it dissolving

### Wall × Water
**Inquiry:** What emotion has frozen into ice? What flow has stopped completely?
**Shadow:** Is protection masking a fear of feeling?
**Gift:** The potential for thaw and renewed flow
**Practice:** Notice where emotional numbness has become normal

### Wall × Fire
**Inquiry:** What passion has burned to ash? What transformation was abandoned?
**Shadow:** Has burnout become a permanent state?
**Gift:** The possibility of phoenix rebirth
**Practice:** Find one spark that might reignite

### Wall × Air
**Inquiry:** What truth is being silenced? What connection has been severed?
**Shadow:** Is silence being mistaken for peace?
**Gift:** The power of the unspoken truth
**Practice:** What would you say if you knew you'd be heard?

### Wall × Ether
**Inquiry:** What purpose has become dogma? What meaning has hardened into ideology?
**Shadow:** Is certainty masking a loss of real purpose?
**Gift:** The invitation to rediscover authentic meaning
**Practice:** Question the purposes you never question

[... continued for all 25 combinations ...]

---

## Best Practices for Facilitators

### Creating Space for Inquiry

1. **Don't rush to answers** - The question is the gift
2. **Hold silence** - Let the inquiry land
3. **Notice resistance** - It points to shadow
4. **Celebrate gifts** - They emerge when shadow is seen

### Working with Shadow

Shadow is not "bad" - it is simply what's hidden. Shadow work reveals:
- What we protect without knowing
- What we've forgotten we're carrying
- What gifts wait in the darkness

### Facilitating Gift Discovery

Gifts emerge when:
- Shadow is acknowledged without judgment
- The inquiry has been fully felt
- There's space for integration

---

## Technical Implementation

### File Location
`js/constants/sacred-inquiry.js`

### Key Functions
- `getInquiry(tension, faceA, faceB)` - Full inquiry package
- `calculateSynergies(faceA, faceB)` - Synergy calculation only
- `getDominantSynergy(faceA, faceB)` - Dominant element only
- `getHealthState(tension)` - Health state only

### Dependencies
- Uses geometric mean for synergy calculation
- Integrates with OrganizationalVoice for vocabulary
- Works with DynamicEdgeInquiry for AI-generated alternatives

---

## The Deeper Purpose

Sacred Inquiry exists to reveal that organizations are not machines. They are living systems with:
- **Membranes** that breathe
- **Synergies** that emerge
- **Shadows** that hide gifts
- **Questions** that open doors

Every edge in the dodecahedron is an invitation to see more clearly, feel more deeply, and act more wisely.

The 30 edges ask 25 types of questions. In this simple architecture lies infinite depth.

*"The quality of our questions determines the quality of our lives."*
