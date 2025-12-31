# Company Templates Guide

**Teaching Examples for the Dodecahedron Model**

*Four organizations across the full O1-O7 lifecycle, demonstrating how the model captures organizational reality.*

---

## Purpose of Company Templates

The POC includes four fictional (but realistic) company templates that serve multiple purposes:

1. **Proof of Model Validity** - Demonstrates the dodecahedron model works across different organizational stages
2. **Teaching Tool** - Illustrates key concepts like the Aspiration-Actuality Gap, Death Spiral, and Organizational Debt
3. **Client Onboarding** - Provides reference points for assessing new organizations
4. **Thesis Defense** - Shows comprehensive, real-world-like data supporting the mathematical framework

Each company represents a different developmental stage and archetypal pattern.

---

## The Four Companies

| Company | Stage | Octave | Coherence | Key Pattern |
|---------|-------|--------|-----------|-------------|
| **Quannex** | Pre-seed | O1-O2 | ~24% | Aspiration-Actuality Gap |
| **Nova Tech** | Seed | O2-O3 | ~35% | Death Spiral (burnout) |
| **Zenith Solutions** | Growth | O3-O4 | ~58% | Organizational Debt |
| **Apex Industries** | Enterprise | O6-O7 | ~91% | Integrated Excellence |

---

## Company Profiles

### Quannex - The Visionary Startup

**File:** `companies/quannex/mapping-context.json`

**Profile:**
- **Stage:** Pre-seed AI startup
- **Octave:** O1-O2 (Survival/Structure)
- **Archetype:** `startup`
- **Dominant Breath:** The Breath of Viability

**The Story:**
Quannex is building an "Organizational DNA Visualization Platform" - essentially this very system. The founder has a transcendent vision (O7-level Foundational Values) but operates in survival mode (5-month runway, founder energy at 5.4/10).

**Key Pattern: Aspiration-Actuality Gap**
```
F10 Foundational Values: O3 (Strong values, deep integrity)
F9  Regenerative Flow:   O3 (High regenerative choices)
F2  Intellectual Capital: O2 (Strong thesis framework)

vs.

F5  Market Resonance:    O1 (Clarity score 1.3/5!)
F11 Funding Pipeline:    O1 (Dormant)
F3  Human Capital:       O1 (CRITICAL: Founder at 5.4/10 energy)
```

**Diagnostic Insight:** The founder holds O6-O7 vision but the organization structurally operates at O1. This creates **painful cognitive dissonance** but also **authentic motivation** - the gap is seen, acknowledged, and actively worked on.

**Use Case:** Demonstrates how the model captures the classic startup paradox of brilliant vision + survival reality.

---

### Nova Tech - The Burning Bright

**File:** `companies/nova-tech/mapping-context.json`

**Profile:**
- **Stage:** Seed-stage tech company
- **Octave:** O2-O3 (Structure/Relationships)
- **Archetype:** `seed`
- **Dominant Breath:** The Breath of Momentum

**The Story:**
Nova Tech has brilliant technical founders who've achieved product-market fit. They've raised seed funding and are scaling fast - perhaps too fast. The team is burning out, processes are breaking, and the founders are running on fumes.

**Key Pattern: Death Spiral**
```
F2  Intellectual Capital: O4 (Innovative product)
F5  Market Resonance:    O3 (Strong traction)

vs.

F3  Human Capital:       O2 (Scaling struggles, burnout starting)
F4  Structural Capital:  O2 (Processes breaking under load)
F9  Regenerative Flow:   O1 (No time for regeneration)
```

**Diagnostic Insight:** Nova Tech is **over-exhaling** - giving more than they're receiving. The breath axis shows unsustainable output without corresponding input. Classic "burn bright, burn out" pattern.

**Warning Signs:**
- High velocity metrics (good) + declining wellbeing metrics (bad)
- Strong external success + internal structural decay
- Revenue growth + technical debt accumulation

**Use Case:** Demonstrates how the model detects burnout patterns before they become catastrophic.

---

### Zenith Solutions - The Growing Pains

**File:** `companies/zenith-solutions/mapping-context.json`

**Profile:**
- **Stage:** Growth-stage SaaS company
- **Octave:** O3-O4 (Relationships/Creativity)
- **Archetype:** `growth`
- **Dominant Breath:** The Breath of Expression

**The Story:**
Zenith Solutions is a successful SaaS company with strong product-market fit and good funding. They're scaling their team and operations, but the organization is accumulating "organizational debt" - structural and process problems that compound over time.

**Key Pattern: Organizational Debt**
```
F2  Intellectual Capital: O4 (Innovative)
F5  Market Resonance:    O4 (Market traction)
F1  Financial Capital:   O3 (Good funding)

vs.

F8  Core Operations:     O2 (Processes breaking)
F9  Structural Capital:  O2 (Org debt accumulating)
F3  Human Capital:       O2 (Team scaling struggles)
F11 Community Impact:    O1 (Completely neglected!)
```

**Diagnostic Insight:** Zenith's product success (O4) is outpacing their organizational capability (O2). Like technical debt, organizational debt compounds - what's manageable at 20 people becomes catastrophic at 200.

**The Math:**
```
Geometric mean: ~2.3
Spread: 4 - 1 = 3 → Penalty: 0.5
Result: O2 (despite O4 product success!)
```

**Use Case:** Demonstrates how the Foundation Principle prevents false confidence - product success doesn't equal organizational maturity.

---

### Apex Industries - The Integrated Giant

**File:** `companies/apex-industries/mapping-context.json`

**Profile:**
- **Stage:** Public enterprise
- **Octave:** O6-O7 (Vision/Radiance)
- **Archetype:** `enterprise`
- **Dominant Breath:** The Breath of Legacy

**The Story:**
Apex Industries is a mature, values-driven enterprise that has achieved the rare state of integrated excellence. They're not just successful - they're regenerative. They've moved from taking to giving, from competing to elevating the entire ecosystem.

**Key Pattern: Integrated Excellence**
```
F9  Regenerative Flow:   O7 (100% carbon-negative!)
F2  Intellectual Capital: O7 (Knowledge as legacy)
F3  Human Capital:       O7 (Flourishing people)
F8  Core Operations:     O7 (Work as art)
F6  Community & Partners: O7 (Living ecosystem)

F1  Financial Capital:   O6 (Abundant resources)
F4  Structural Capital:  O6 (Evolved governance)
F5  Market Resonance:    O6 (Industry leadership)
```

**Diagnostic Insight:** Apex shows **minimal spread** (O6-O7 across all faces). This isn't luck - it's the result of decades of intentional development. They can authentically claim O6 because every face supports it.

**What Makes Them O7?**
- Carbon-negative operations (healing, not just not-harming)
- Knowledge sharing (elevating competitors)
- 92% employee mindfulness practice (flourishing, not just performing)
- 14 strategic partnerships creating ecosystem value

**Use Case:** Demonstrates what authentic high-octave operation looks like - not just high performance, but genuine service and regeneration.

---

## Understanding mapping-context.json

### File Structure

```json
{
  "companyId": "quannex",
  "displayName": "Quannex",
  "tagline": "Organizational DNA Visualization Platform",
  "octaveStage": "O1-O2",
  "dominantOctave": 1,
  "archetype": "startup",
  "dominantBreathName": "The Breath of Viability",
  "mode": "quick",

  "faces": [...],      // 12 face definitions
  "edges": [...],      // 30 edge definitions
  "vertices": [...],   // 20 vertex definitions
  "breathAxes": [...], // 6 breath axis definitions
  "shadowPatterns": [...] // 3-4 shadow patterns
}
```

### Faces Section

Each face represents one of the 12 organizational domains:

```json
{
  "id": 1,
  "baseName": "Financial Capital",
  "customName": "Seed Runway",         // Company-specific name
  "icon": "💰",
  "octave": 1,                         // O1-O7 developmental stage
  "tooltip": "Pre-seed focus on runway preservation",
  "sentiment": 0.24,                   // 0-1 coherence score
  "elements": {
    "earth": 0.45,                     // Elemental distribution
    "water": 0.20,                     // (5 elements per face)
    "fire": 0.30,
    "air": 0.25,
    "ether": 0.40
  }
}
```

**Key Fields:**
- `octave`: The developmental stage (1-7) for this domain
- `sentiment`: The coherence score (0-1) - how well the domain is functioning
- `elements`: The pentagram elemental distribution for harmonic analysis

### Edges Section

Each edge represents a relationship between two faces:

```json
{
  "id": "E1-2",
  "faceIds": [1, 2],
  "emergentName": "Innovation Funding Bridge",
  "elementalNature": "Fire",
  "theQuestion": "How does our capital transform into valuable knowledge?",
  "tension": 0.16
}
```

**Key Fields:**
- `emergentName`: What this relationship is called in this company's context
- `elementalNature`: The dominant element of this edge (Earth, Water, Fire, Air, Ether)
- `theQuestion`: The diagnostic question this edge answers
- `tension`: 0-1 score indicating stress in this relationship

### Vertices Section

Each vertex represents a triadic synergy point (3 faces meeting):

```json
{
  "id": "V1",
  "faceIds": [1, 2, 6],
  "vortexStrength": 0.62,
  "classification": "synergy_hub"
}
```

**Classifications:**
- `synergy_hub`: High strength, high coherence (leverage point for positive change)
- `hotspot`: High strength, low coherence (urgent attention needed)
- `neutral`: Moderate values
- `bermuda_triangle`: Low strength, low coherence (potential energy sink)

### Shadow Patterns Section

Shadows represent suppressed organizational dynamics:

```json
{
  "name": "Visionary Bypass",
  "description": "Brilliant ideas without execution capacity",
  "affectedFaces": [10, 9, 2],
  "severity": "moderate",
  "recommendation": "Ground vision in operational reality before expanding further"
}
```

**Common Shadow Patterns:**
- **Visionary Bypass**: Ideas outpace execution
- **Competence Trap**: Excellence in one area blinds to other needs
- **Scaling Delusion**: Growth metrics mask structural decay
- **Burnout Denial**: High performance hiding unsustainability

---

## Using Templates for Client Onboarding

### Step 1: Identify Closest Match

Start by identifying which template most resembles the client:

| If the client is... | Start with... |
|---------------------|---------------|
| Early-stage, vision-heavy | Quannex template |
| Fast-growing, scaling | Nova Tech template |
| Established, facing growing pains | Zenith template |
| Mature, seeking next level | Apex template |

### Step 2: Customize Face Names

Use the template's face structure but customize names:

```
Template: "Financial Capital"
Client variant: "Investment Portfolio" (for a fund)
Client variant: "Donor Relations" (for a nonprofit)
Client variant: "Resource Allocation" (for a government agency)
```

### Step 3: Adjust Octave Assignments

Based on client discovery, adjust each face's octave:

1. Interview stakeholders about each domain
2. Compare to template descriptions
3. Assign O1-O7 based on evidence, not aspiration

### Step 4: Calculate and Interpret

Use the octave-integrity-calculator to generate:
- Organizational octave
- Spread penalty
- Warnings and recommendations

---

## Creating Your Own Template

### Required Data

To create a new company template, you need:

1. **12 Face Assessments**
   - Custom name for each face
   - Octave assignment (O1-O7)
   - Sentiment score (0-1)
   - Elemental distribution (5 values, sum ~2.0)

2. **30 Edge Definitions**
   - Generated automatically from topology
   - Or manually with custom names/questions

3. **20 Vertex Classifications**
   - Generated from face configurations
   - Or manually classified

4. **Shadow Patterns**
   - 3-4 patterns identified from analysis
   - Include affected faces and recommendations

### Template Skeleton

```json
{
  "companyId": "your-company",
  "displayName": "Your Company Name",
  "tagline": "Your company tagline",
  "octaveStage": "O?-O?",
  "dominantOctave": 1,
  "archetype": "startup|seed|growth|mature|enterprise",
  "mode": "quick",

  "faces": [
    // 12 face objects
  ],

  "edges": [
    // 30 edge objects (can use context-synthesizer to generate)
  ],

  "vertices": [
    // 20 vertex objects (can use context-synthesizer to generate)
  ],

  "shadowPatterns": [
    {
      "name": "Pattern Name",
      "description": "What this pattern represents",
      "severity": "low|moderate|high|critical",
      "recommendation": "What to do about it"
    }
  ]
}
```

---

## Quick Reference: Octave Characteristics

| Octave | Name | Core Question | Template Example |
|--------|------|---------------|------------------|
| **O1** | Survival | Do we have it? | Quannex F5 (Market Resonance) |
| **O2** | Structure | Is it organized? | Nova Tech F4 (Structural Capital) |
| **O3** | Relationships | Are we connected? | Zenith F1 (Financial Capital) |
| **O4** | Creativity | Can we innovate? | Zenith F2 (Intellectual Capital) |
| **O5** | Expression | Are we authentic? | - |
| **O6** | Vision | Do we serve purpose? | Apex F1 (Financial Capital) |
| **O7** | Radiance | Are we a gift? | Apex F9 (Regenerative Flow) |

---

## Files Location

```
companies/
├── quannex/
│   ├── company.json          (Legacy profile)
│   ├── kpis.csv              (KPI values)
│   └── mapping-context.json  (Full mapping - USE THIS)
├── nova-tech/
│   └── mapping-context.json
├── zenith-solutions/
│   └── mapping-context.json
└── apex-industries/
    └── mapping-context.json
```

---

## For Thesis Defense

These templates demonstrate:

1. **Model Validity Across Lifecycle** - Same framework works for pre-seed (Quannex) through enterprise (Apex)

2. **Diagnostic Power** - Each template reveals a distinct organizational pattern that traditional metrics would miss

3. **Foundation Principle in Action** - See how geometric mean + spread penalty correctly constrains Zenith despite strong product metrics

4. **Practical Application** - Not just theory - templates show how to apply the model to real organizational assessment

**Recommended Presentation:**
1. Show Quannex (startup struggles) → Apex (integrated excellence)
2. Highlight the octave progression across companies
3. Demonstrate how shadow patterns emerge from face configurations
4. Show breath axis imbalances and their implications

---

**Next:** See [FOUNDATION_PRINCIPLE.md](math/FOUNDATION_PRINCIPLE.md) for the mathematical basis of octave calculation.

**Back:** Return to [FILE_STRUCTURE_MAP.md](FILE_STRUCTURE_MAP.md) for codebase navigation.

---

*Created: 2025-12-09*
*Part of Quannex POC Documentation*
*Co-created by: Deimantas Murauskas & Claude*
