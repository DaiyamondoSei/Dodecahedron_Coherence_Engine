# 🌟 Quannex Demo System - Complete Guide

**Last Updated**: 2025-11-09
**Version**: 2.0 (Demo-Ready)
**Purpose**: Walk organizations through complete dodecahedral coherence analysis

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Demo Flow](#demo-flow)
3. [System Architecture](#system-architecture)
4. [File Structure](#file-structure)
5. [Step-by-Step Usage](#step-by-step-usage)
6. [Configuration Templates](#configuration-templates)
7. [Mathematical Framework](#mathematical-framework)
8. [Troubleshooting](#troubleshooting)

---

## Overview

The Quannex Demo System is an end-to-end organizational coherence analysis tool that:

1. **Defines** the 12 organizational faces (domains)
2. **Maps** KPIs to each face (12 or 60 metrics)
3. **Calculates** coherence using pentagram harmonic analysis
4. **Visualizes** results in 3D dodecahedral geometry
5. **Identifies** nervous endpoints and imbalances
6. **Recommends** specific interventions

### Key Innovation

Traditional dashboards measure **parts**. Quannex measures **coherence** - how well the parts work together as a living system.

---

## Demo Flow

```
┌─────────────────────────────────────────────────────────┐
│  STAGE 1: DEFINE THE DODECAHEDRON                       │
│  Duration: 5-10 minutes                                 │
│  ─────────────────────────────────────────────────────  │
│  • Choose template or create custom 12 faces           │
│  • Name each organizational domain                     │
│  • Visual: Dodecahedron builds as faces are defined    │
│  Output: Face configuration JSON                        │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  STAGE 2: MAP THE METRICS                               │
│  Duration: 10-30 minutes (depends on mode)              │
│  ─────────────────────────────────────────────────────  │
│  Quick Mode (12 KPIs):                                  │
│    • 1 primary KPI per face                             │
│    • Faster setup, less granularity                     │
│                                                          │
│  Full Mode (60 KPIs):                                   │
│    • 5 elemental KPIs per face                          │
│    • Earth, Water, Fire, Air, Ether dimensions          │
│    • Enables pentagram harmonic analysis                │
│                                                          │
│  Output: KPI dataset with values and targets            │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  STAGE 3: CALCULATE COHERENCE                           │
│  Duration: Instant (automated)                          │
│  ─────────────────────────────────────────────────────  │
│  For each face:                                         │
│    1. Normalize KPI scores (0-1 scale)                  │
│    2. Calculate pentagram harmonics                     │
│    3. Compute final face energy                         │
│                                                          │
│  For the system:                                        │
│    1. Global coherence (average of 12 faces)            │
│    2. Breath analysis (6 polarity axes)                 │
│    3. Edge tensions (30 relationships)                  │
│    4. Shadow detection (hypocrisy engines)              │
│                                                          │
│  Output: Complete coherence profile                     │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  STAGE 4: VISUALIZE & INTERPRET                         │
│  Duration: 15-30 minutes (presentation + Q&A)           │
│  ─────────────────────────────────────────────────────  │
│  View 1: 3D Dodecahedron                                │
│    • Color-coded faces (health gradient)                │
│    • Clickable for deep dive                            │
│    • Rotatable, zoomable                                │
│                                                          │
│  View 2: Calculation Transparency                       │
│    • Step-by-step math breakdown                        │
│    • Formula explanations                               │
│    • "Why this matters" context                         │
│                                                          │
│  View 3: Breath Analysis                                │
│    • 6 polarity axes visualization                      │
│    • Imbalance detection                                │
│    • Rebalancing recommendations                        │
│                                                          │
│  View 4: DNA Helix                                      │
│    • Octave progression view                            │
│    • Developmental stage analysis                       │
│    • Growth trajectory mapping                          │
│                                                          │
│  Output: Insights report + recommendations              │
└─────────────────────────────────────────────────────────┘
```

---

## System Architecture

### Component Hierarchy

```
demo-orchestrator.html (Main Shell)
├── js/face-wizard.js (Stage 1: Face Definition)
├── js/kpi-mapper.js (Stage 2: Metric Mapping)
├── js/main.js (Stage 3: Calculation Engine)
├── js/calculation-transparency.js (Math Visualization)
├── js/dodecahedron-viz.js (3D Visualization)
├── js/breath-analyzer.js (Breath Analysis)
├── js/company-loader.js (Data Management)
└── css/demo-styles.css (Unified Styling)
```

### Data Flow

```
User Input (Face Names + KPI Values)
         ↓
Face Configuration JSON
         ↓
Quannex Engine (main.js)
         ↓
Calculations (pentagram, breath, edges)
         ↓
State Object (global coherence + face details)
         ↓
Visualization Components (3D, charts, tables)
         ↓
Presenter View (insights + recommendations)
```

---

## File Structure

```
POC/
├── demo-orchestrator.html          # Main demo interface
├── DEMO_GUIDE.md                   # This file
├── MATH_REFERENCE.md               # Formula documentation
│
├── js/
│   ├── face-wizard.js              # Stage 1: Face definition
│   ├── kpi-mapper.js               # Stage 2: KPI mapping
│   ├── calculation-transparency.js # Math visualization
│   ├── main.js                     # Core calculation engine
│   ├── dodecahedron-viz.js         # 3D visualization
│   ├── breath-analyzer.js          # Breath polarity analysis
│   └── company-loader.js           # Multi-company management
│
├── data/
│   ├── face-templates.json         # Pre-built configurations
│   ├── kpi-suggestions.json        # Smart KPI recommendations
│   └── companies/                  # Sample company datasets
│
├── css/
│   └── demo-styles.css             # Unified styling
│
└── docs/
    ├── PRESENTER_SCRIPT.md         # Speech notes for demos
    └── FAQ.md                      # Common questions
```

---

## Step-by-Step Usage

### For Demo Presenters

#### Preparation (Before Meeting)

1. **Choose a template** that matches the organization:
   - Standard business? Use "Standard Business Model"
   - Startup? Use "Startup Framework"
   - Non-profit? Use "Non-Profit Model"
   - Complex org? Create custom

2. **Gather basic metrics** (at minimum):
   - 12 numbers representing health of 12 domains (0-100 scale)
   - Optional: Full 60 elemental KPIs for deeper analysis

3. **Set up environment**:
   ```bash
   cd POC
   # Option 1: Use Python server
   python -m http.server 8080

   # Option 2: Use Node server
   npx http-server -p 8080

   # Open: http://localhost:8080/demo-orchestrator.html
   ```

#### During Demo (30-45 minutes)

**Minutes 0-5: Introduction**
- Open `demo-orchestrator.html`
- Explain the problem: "Dashboards measure parts, not coherence"
- Show blank dodecahedron: "What if we mapped your org onto sacred geometry?"

**Minutes 5-15: Face Definition**
- Click "Define Faces" → Select template or create custom
- Walk through 12 domains: "These are your organizational faces"
- Visual feedback: Dodecahedron labels update in real-time

**Minutes 15-25: Metric Mapping**
- Choose Quick Mode (faster) or Full Mode (deeper)
- Enter metrics together with stakeholders
- Real-time calculation: Watch coherence score appear

**Minutes 25-35: Insights Review**
- Switch to 3D view: "Green = healthy, Red = critical"
- Click critical faces: "Here's what the math says..."
- Show calculation transparency: "This is how we got here"

**Minutes 35-45: Recommendations**
- Identify top 3 nervous endpoints
- Show simulation: "If we improve X, coherence goes from Y% to Z%"
- Export PDF report: "Here's your organizational DNA"

#### Post-Demo

- Save configuration: "Download Your Configuration"
- Share report: Email PDF with visualizations
- Schedule follow-up: "Let's track changes monthly"

---

## Configuration Templates

### Template 1: Standard Business Model

```json
{
  "name": "Standard Business Model",
  "description": "Traditional corporate structure",
  "faces": [
    {"id": 1, "name": "Financial Capital", "icon": "💰"},
    {"id": 2, "name": "Human Capital", "icon": "👥"},
    {"id": 3, "name": "Customer Experience", "icon": "❤️"},
    {"id": 4, "name": "Operations & Execution", "icon": "⚙️"},
    {"id": 5, "name": "Technology & Innovation", "icon": "💡"},
    {"id": 6, "name": "Brand & Reputation", "icon": "✨"},
    {"id": 7, "name": "Leadership & Governance", "icon": "👑"},
    {"id": 8, "name": "Strategy & Vision", "icon": "🎯"},
    {"id": 9, "name": "Partnerships & Ecosystem", "icon": "🤝"},
    {"id": 10, "name": "Risk & Compliance", "icon": "🛡️"},
    {"id": 11, "name": "Learning & Development", "icon": "📚"},
    {"id": 12, "name": "Sustainability & Impact", "icon": "🌍"}
  ]
}
```

### Template 2: Startup Framework

```json
{
  "name": "Startup Framework",
  "description": "Early-stage venture model",
  "faces": [
    {"id": 1, "name": "Product-Market Fit", "icon": "🎯"},
    {"id": 2, "name": "Funding & Runway", "icon": "💵"},
    {"id": 3, "name": "Team & Culture", "icon": "👥"},
    {"id": 4, "name": "Technology Stack", "icon": "⚡"},
    {"id": 5, "name": "Customer Acquisition", "icon": "📈"},
    {"id": 6, "name": "Revenue Model", "icon": "💰"},
    {"id": 7, "name": "Competitive Position", "icon": "🏆"},
    {"id": 8, "name": "Operational Efficiency", "icon": "⚙️"},
    {"id": 9, "name": "Founder Alignment", "icon": "🤝"},
    {"id": 10, "name": "Market Timing", "icon": "⏰"},
    {"id": 11, "name": "Scalability Potential", "icon": "🚀"},
    {"id": 12, "name": "Risk Management", "icon": "🛡️"}
  ]
}
```

### Template 3: Non-Profit Model

```json
{
  "name": "Non-Profit Model",
  "description": "Mission-driven organization",
  "faces": [
    {"id": 1, "name": "Mission Clarity", "icon": "🌟"},
    {"id": 2, "name": "Impact Measurement", "icon": "📊"},
    {"id": 3, "name": "Community Engagement", "icon": "🤝"},
    {"id": 4, "name": "Funding Diversity", "icon": "💰"},
    {"id": 5, "name": "Volunteer Capacity", "icon": "👥"},
    {"id": 6, "name": "Program Effectiveness", "icon": "✅"},
    {"id": 7, "name": "Board Governance", "icon": "👑"},
    {"id": 8, "name": "Stakeholder Trust", "icon": "❤️"},
    {"id": 9, "name": "Operational Sustainability", "icon": "♻️"},
    {"id": 10, "name": "Advocacy & Influence", "icon": "📣"},
    {"id": 11, "name": "Learning Culture", "icon": "📚"},
    {"id": 12, "name": "Financial Health", "icon": "💵"}
  ]
}
```

---

## Mathematical Framework

> **See [MATH_REFERENCE.md](MATH_REFERENCE.md) for complete formula documentation**

### Core Calculations (Summary)

1. **KPI Normalization**: Convert raw values to 0-1 scale
   - ↑ Direction: `(value - min) / (ideal - min)`
   - ↓ Direction: `1 - (value - min) / (max - min)`
   - Band: Plateau function with sweet spot

2. **Pentagram Harmonics**: Measure elemental cooperation
   - Star Pairs: `s_i = geometric_mean(k_a, k_b)`
   - Intersection Nodes: `p_i = (s_a + s_b) / 2`
   - Center Composite: `C = avg(p_1...p_5)`

3. **Face Energy**: Combined metric health
   - Base: `E_base = Σ(KPI_i × weight_i)`
   - Harmonic Bonus: `+30% max` based on pentagram alignment
   - Final: `E_face = E_base × (1 + harmonic_boost)`

4. **Global Coherence**: System-wide health
   - `GC = Σ(E_face_i) / 12`

5. **Breath Analysis**: Polarity balance
   - 6 axes: Being/Doing, Receiving/Giving, etc.
   - Ratio: `axis_ratio = sum_positive / sum_negative`
   - Ideal: 1.0 (perfect balance)

---

## Troubleshooting

### Issue: Dodecahedron not rendering

**Symptoms**: Black screen, no 3D geometry
**Causes**:
- Three.js not loaded
- Canvas element missing
- Incorrect face data

**Solutions**:
1. Check console for errors (F12)
2. Verify Three.js CDN is accessible
3. Ensure face configuration is valid JSON
4. Try refreshing with Ctrl+Shift+R

### Issue: Calculations seem wrong

**Symptoms**: Coherence scores don't match expectations
**Causes**:
- KPI values outside valid ranges
- Wrong normalization direction
- Missing weight values

**Solutions**:
1. Open calculation transparency view
2. Check each step of the formula
3. Verify KPI directions (↑/↓/Band)
4. Ensure target ranges are logical

### Issue: Face wizard won't save

**Symptoms**: Configuration doesn't persist
**Causes**:
- LocalStorage disabled
- JSON parse error
- Duplicate face names

**Solutions**:
1. Enable browser LocalStorage
2. Ensure all 12 faces have unique names
3. Check browser console for JSON errors
4. Try exporting to file instead

### Issue: Demo is slow/laggy

**Symptoms**: Animations stutter, interactions delayed
**Causes**:
- Large datasets
- Multiple visualizations running
- Browser resource limits

**Solutions**:
1. Close unnecessary browser tabs
2. Use Quick Mode (12 KPIs) instead of Full Mode
3. Disable auto-rotation on 3D view
4. Use modern browser (Chrome, Edge recommended)

---

## Performance Tips

- **For quick demos**: Use templates + Quick Mode (12 KPIs)
- **For deep analysis**: Custom faces + Full Mode (60 KPIs)
- **For presentations**: Enable fullscreen mode (F11)
- **For reports**: Export PDF after calculations complete

---

## Next Steps

After completing a demo:

1. **Save the configuration**: Download JSON for future sessions
2. **Export the report**: PDF with all visualizations
3. **Schedule follow-up**: Monthly check-ins to track changes
4. **Iterate on metrics**: Refine KPI selection based on insights
5. **Expand analysis**: Add more companies for benchmarking

---

## Support & Documentation

- **Mathematical Reference**: [MATH_REFERENCE.md](MATH_REFERENCE.md)
- **Presenter Script**: [docs/PRESENTER_SCRIPT.md](docs/PRESENTER_SCRIPT.md)
- **FAQ**: [docs/FAQ.md](docs/FAQ.md)
- **Main README**: [../README.md](../README.md)

---

**Built with**: Sacred Geometry • Systems Theory • Consciousness Evolution
**Version**: 2.0 Demo-Ready
**License**: Proprietary Research Tool
**Contact**: [Your contact info]
