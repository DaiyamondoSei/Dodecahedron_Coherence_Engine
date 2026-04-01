# 🔗 Quannex Demo Integration Guide

**How the Demo System Connects to the Existing Codebase**

---

## Quick Start

### Running the Demo

```bash
# From the POC folder
cd POC

# Start a local server (choose one):
python -m http.server 8080
# OR
npx http-server -p 8080

# Open in browser:
http://localhost:8080/demo-orchestrator.html
```

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│  NEW: demo-orchestrator.html                            │
│  Main entry point for guided demo flow                  │
└───────────────┬─────────────────────────────────────────┘
                │
                ├──► js/face-wizard.js (NEW)
                │    └─► Template selection & face definition
                │
                ├──► js/demo-orchestrator-logic.js (NEW)
                │    └─► Navigation & state management
                │
                ├──► js/main.js (EXISTING)
                │    └─► Core Quannex calculation engine
                │
                ├──► js/dodecahedron-viz.js (EXISTING)
                │    └─► 3D visualization
                │
                ├──► js/breath-analyzer.js (EXISTING)
                │    └─► Breath polarity analysis
                │
                └──► js/company-loader.js (EXISTING)
                     └─► Multi-company data management
```

---

## File Relationships

### New Files (Demo System)

| File | Purpose | Dependencies |
|------|---------|--------------|
| `demo-orchestrator.html` | Main demo shell | face-wizard.js, demo-orchestrator-logic.js |
| `js/face-wizard.js` | Face template selection | None (standalone) |
| `js/demo-orchestrator-logic.js` | Navigation & state | face-wizard.js, main.js (optional) |
| `DEMO_GUIDE.md` | User documentation | None |
| `math/CALCULATION_AUDIT_TRAIL.md` | Formula documentation & audit trail | None |
| `INTEGRATION_GUIDE.md` | This file | None |

### Existing Files (Quannex Engine)

| File | Purpose | Used By Demo |
|------|---------|--------------|
| `js/main.js` | Core calculation engine | ✅ Yes (optional fallback) |
| `js/dodecahedron-viz.js` | 3D visualization | ✅ Yes (launched from Step 4) |
| `js/breath-analyzer.js` | Breath analysis | ✅ Yes (via main.js) |
| `js/company-loader.js` | Multi-company loader | ✅ Yes (data structure) |
| `index.html` | Original dashboard | ✅ Yes (launched from Step 4) |
| `octave-dna.html` | DNA helix view | ✅ Yes (launched from Step 4) |
| `demo.html` | Multi-view navigator | ⚠️ Overlapping functionality |

---

## Data Flow

### 1. Face Definition (Step 1)

```javascript
// User selects template
selectTemplate('business')
  ↓
// face-wizard.js loads template
currentFaces = FACE_TEMPLATES['business'].faces
  ↓
// User customizes names (optional)
updateFaceName(1, 'Financial Capital')
  ↓
// Configuration saved to state
demoState.faceConfig = {
  template: 'business',
  faces: [...]
}
```

### 2. KPI Mapping (Step 2)

```javascript
// User selects mode
selectMode('quick') or selectMode('full')
  ↓
// demo-orchestrator-logic.js renders form
generateQuickModeHTML() or generateFullModeHTML()
  ↓
// User enters KPI data
<input data-face-id="1" data-field="kpiName" value="Revenue Growth" />
  ↓
// Data collected on submit
demoState.kpiData = collectKPIData()
  ↓
// Structure:
{
  faceId: 1,
  name: 'Revenue Growth',
  value: 15,
  direction: '↑',
  targetMin: 0,
  targetIdeal: 25,
  element: 'Earth'
}
```

### 3. Calculation (Step 3)

```javascript
// runCalculation() triggered
companyData = {
  name: demoState.faceConfig.templateName,
  kpis: demoState.kpiData
}
  ↓
// Check if Quannex engine loaded
if (window.quannexEngine) {
  // Use real engine
  await window.quannexEngine.initializeWithCompany(companyData)
  results = window.quannexEngine.getState()
} else {
  // Fallback to simple calculation
  results = calculateSimpleCoherence(kpis)
}
  ↓
// Results stored
demoState.coherenceResults = {
  globalCoherence: 0.67,
  coherenceStatus: 'Moderate',
  faces: [...]
}
```

### 4. Visualization (Step 4)

```javascript
// User clicks visualization button
launchView('dodecahedron')
  ↓
// Opens existing visualization in new tab
window.open('dodecahedron-3d.html', '_blank')
  ↓
// Visualization loads demo data
// (requires integration - see below)
```

---

## Integration Points

### Option A: Standalone Mode (Current)

**Status**: ✅ Fully functional

The demo orchestrator works independently with a fallback calculation engine.

**Pros**:
- No dependencies on backend
- Works offline
- Fast and simple

**Cons**:
- Doesn't use full Quannex engine features
- Separate from existing visualizations

**Use case**: Quick demos, initial presentations

---

### Option B: Integrated Mode (Recommended)

**Status**: ⚠️ Requires connection layer

Connect the demo to existing Quannex engine and visualizations.

**Implementation**:

#### 1. Load Quannex Engine

In `demo-orchestrator.html`, add before closing `</body>`:

```html
<!-- Load Quannex Engine -->
<script src="js/breath-analyzer.js"></script>
<script type="module" src="js/main.js"></script>
<script type="module" src="js/company-loader.js"></script>
```

#### 2. Wait for Engine to Load

In `demo-orchestrator-logic.js`, update `runCalculation()`:

```javascript
async function runCalculation() {
    showLoading('Calculating coherence...');

    // Wait for Quannex engine to be ready
    let attempts = 0;
    while (!window.quannexEngine && attempts < 50) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
    }

    if (!window.quannexEngine) {
        console.warn('⚠️ Quannex engine not loaded, using fallback');
        demoState.coherenceResults = calculateSimpleCoherence(demoState.kpiData);
    } else {
        // Use real engine
        const companyData = {
            name: demoState.faceConfig.templateName,
            kpis: demoState.kpiData
        };

        await window.quannexEngine.initializeWithCompany(companyData);
        demoState.coherenceResults = window.quannexEngine.getState();
    }

    displayCalculationResults();
    hideLoading();
}
```

#### 3. Pass Data to Visualizations

Create a shared data layer using `localStorage`:

```javascript
// In demo-orchestrator-logic.js
function saveToSharedState() {
    localStorage.setItem('quannexDemoData', JSON.stringify({
        faceConfig: demoState.faceConfig,
        kpiData: demoState.kpiData,
        coherenceResults: demoState.coherenceResults,
        timestamp: Date.now()
    }));
}

// Call before launching views
function launchView(viewName) {
    saveToSharedState();
    const url = viewUrls[viewName];
    window.open(url, '_blank');
}
```

Then in `dodecahedron-viz.js`, `index.html`, etc.:

```javascript
// Check for demo data
const demoData = localStorage.getItem('quannexDemoData');
if (demoData) {
    const parsed = JSON.parse(demoData);
    // Use parsed.coherenceResults to populate visualization
    loadDemoData(parsed);
}
```

---

## Migration Path

### Phase 1: Standalone Demo (Current State)
✅ **Completed**
- Demo orchestrator works independently
- Fallback calculations
- Manual navigation to visualizations

### Phase 2: Engine Integration
🔨 **Recommended Next**
- Load existing Quannex engine
- Use real pentagram analysis
- Pass data to visualizations via localStorage

**Effort**: 2-3 hours

### Phase 3: Seamless Navigation
🚀 **Future Enhancement**
- Embed visualizations in demo (iframes or components)
- Real-time updates across views
- Unified state management

**Effort**: 1-2 days

### Phase 4: Full Feature Parity
✨ **Long-term Goal**
- All features from `index.html`, `octave-dna.html`, etc. available in demo
- Unified navigation
- Single source of truth

**Effort**: 1 week

---

## Configuration Files

### Face Templates

Templates are defined in `js/face-wizard.js`:

```javascript
const FACE_TEMPLATES = {
    business: { ... },
    startup: { ... },
    nonprofit: { ... },
    custom: { ... }
}
```

**To add a new template**:

1. Edit `js/face-wizard.js`
2. Add to `FACE_TEMPLATES` object:

```javascript
mytemplate: {
    name: "My Custom Template",
    faces: [
        { id: 1, name: "Domain 1", icon: "🔷" },
        { id: 2, name: "Domain 2", icon: "🔶" },
        // ... 12 total
    ]
}
```

3. Add template card to `demo-orchestrator.html`:

```html
<div class="template-card" onclick="selectTemplate('mytemplate')" id="template-mytemplate">
    <div class="template-header">
        <span class="template-icon">🎨</span>
        <span class="template-name">My Custom Template</span>
    </div>
    <div class="template-description">
        Description here
    </div>
    <div class="template-faces">
        Includes: Domain 1, Domain 2, ...
    </div>
</div>
```

---

## Customization Guide

### Changing Colors

Edit `demo-orchestrator.html` `<style>` section:

```css
/* Primary accent color */
--accent-color: #00ffcc; /* Cyan/teal */

/* Change to purple */
--accent-color: #8a2be2;
```

Replace all instances of `#00ffcc` with your color.

### Adding More Steps

1. Update `demoState.totalSteps` in `demo-orchestrator-logic.js`:

```javascript
const demoState = {
    totalSteps: 5, // was 4
    ...
}
```

2. Add step button in `demo-orchestrator.html`:

```html
<button class="step-button" data-step="5" onclick="goToStep(5)">
    <span class="step-number">5</span>
    Export
</button>
```

3. Add step content:

```html
<div class="step-content" id="step5">
    <!-- Your content here -->
</div>
```

4. Add completion function in `demo-orchestrator-logic.js`:

```javascript
function completeStep5() {
    markStepCompleted(5);
    // Your logic
}
```

---

## Troubleshooting

### Issue: "Quannex engine not loaded"

**Cause**: `main.js` not imported correctly

**Fix**: Add to `demo-orchestrator.html`:

```html
<script src="js/breath-analyzer.js"></script>
<script type="module" src="js/main.js"></script>
```

---

### Issue: Calculations don't match Excel

**Cause**: Using fallback calculator instead of real engine

**Fix**: Verify engine loaded:

```javascript
console.log('Engine loaded:', typeof window.quannexEngine !== 'undefined');
```

If false, check script imports.

---

### Issue: Visualizations don't show demo data

**Cause**: Data not passed between pages

**Fix**: Implement `localStorage` bridge (see "Pass Data to Visualizations" above)

---

## Testing Checklist

Before presenting to an organization:

- [ ] All 4 steps navigate correctly
- [ ] Template selection works
- [ ] Face names can be customized
- [ ] KPI forms render correctly
- [ ] Calculations complete without errors
- [ ] Results display properly
- [ ] Visualizations launch
- [ ] Configuration exports as JSON
- [ ] "Start Over" button resets state
- [ ] Help guide opens
- [ ] Progress bar updates
- [ ] Mobile responsive (optional)

---

## Using Company Templates (NEW - December 2025)

### Pre-Built Company Examples

Four company templates are available in `companies/*/mapping-context.json`:

| Company | Stage | Pattern | Best For |
|---------|-------|---------|----------|
| **Quannex** | Pre-seed (O1-O2) | Aspiration-Actuality Gap | Demonstrating startup challenges |
| **Nova Tech** | Seed (O2-O3) | Death Spiral (burnout) | Showing resource exhaustion |
| **Zenith Solutions** | Growth (O3-O4) | Organizational Debt | Illustrating scaling problems |
| **Apex Industries** | Enterprise (O6-O7) | Integrated Excellence | Showcasing mature organization |

### Loading Company Data

```javascript
// Via company-loader.js
await CompanyLoader.loadCompany('quannex');

// OR via company-templates-bundle.js (offline)
const template = window.CompanyTemplates.get('quannex');
```

### Using Templates for Client Onboarding

1. **Identify closest match**: Which template resembles your client?
2. **Clone the template**: Copy `mapping-context.json` to a new company folder
3. **Customize**: Adjust face names, octaves, and sentiment values
4. **Load**: Use `company-loader.js` with the new company ID

### Integration with Foundation Principle

Company templates now include **face-level octave assignments**, enabling the Foundation Principle calculation:

```javascript
// Load template and calculate organizational octave
const template = await CompanyLoader.loadCompany('quannex');
const result = OctaveIntegrityCalculator.calculateOrganizationalOctave(
    template.faces,
    'pre-seed'  // lifecycle stage
);
// Returns: { orgOctave: 1, spread: 6, penalty: 2.0, ... }
```

**See:** [COMPANY_TEMPLATES_GUIDE.md](COMPANY_TEMPLATES_GUIDE.md) for detailed documentation.

---

## Bringing Real Organization Data Into Quannex

### Two Integration Paths

| Path | Who It's For | What You Need | Complexity |
|------|-------------|---------------|------------|
| **Easy Path** | Quick evaluation, demos, presentations | 12 high-level metrics (1 per face) | Low — minutes |
| **Full Path** | Deep analysis, thesis-grade assessment | 60 KPI values (5 per face × 12 faces) | Medium — requires data mapping |

---

### Easy Path: 12-Metric Quick Integration

1. **Open** `welcome.html` (or `demo-orchestrator.html` directly)
2. **Choose** "Custom Path" on the glass card landing page
3. **Select** the archetype closest to your organization (Startup, Enterprise, Balanced, NonDual)
4. **Use Quick Mode** in Step 2 — enter 1 KPI per face
5. **Calculate** and explore results

**Data you need:**
```
12 values, one per organizational domain:
  Face 1:  Financial Health      → e.g., revenue growth %
  Face 2:  Intellectual Capital  → e.g., patents/innovation index
  Face 3:  Human Resources       → e.g., employee satisfaction
  Face 4:  Structural Capital    → e.g., process maturity score
  Face 5:  Market Position       → e.g., market share %
  Face 6:  Community Relations   → e.g., stakeholder trust index
  Face 7:  Brand Reputation      → e.g., NPS score
  Face 8:  Operational Excellence → e.g., efficiency ratio
  Face 9:  Regenerative Capacity → e.g., sustainability score
  Face 10: Values Alignment      → e.g., culture survey score
  Face 11: Funding Access        → e.g., capital availability
  Face 12: Risk Management       → e.g., risk mitigation index
```

**Future enhancement:** Fast KPI Intelligence will AI-distribute each metric into 5 pentagramic elements. See `docs/FAST_KPI_INTELLIGENCE.md`.

---

### Full Path: 60-KPI Deep Integration

For thesis-grade analysis, you need 60 KPIs organized as 5 elements per face:

1. **Prepare your data** as a JSON file following the company template format:

```json
{
  "company": {
    "name": "Your Organization",
    "archetype": "balanced",
    "lifecycle": "growth"
  },
  "faces": [
    {
      "id": 1,
      "name": "Financial Health",
      "octave": 3,
      "kpis": {
        "ball": { "value": 0.72, "name": "Overall Financial Health" },
        "earth": { "value": 0.80, "name": "Revenue Stability" },
        "water": { "value": 0.65, "name": "Cash Flow" },
        "fire": { "value": 0.55, "name": "Growth Investment" },
        "air": { "value": 0.70, "name": "Financial Communication" },
        "ether": { "value": 0.78, "name": "Financial Purpose Alignment" }
      }
    }
  ]
}
```

2. **Place the file** in `companies/your-org/company.json`
3. **Add a KPI data file** at `companies/your-org/kpis.json` (see existing templates)
4. **Register** in `js/company-templates-bundle.js` (optional, for dropdown access)
5. **Load** via `CompanyLoader.loadCompany('your-org')` or select in the wizard

**Reference templates:**
```
companies/quannex/         → Pre-seed startup (O1-O2)
companies/nova-tech/       → Seed stage with burnout (O2-O3)
companies/zenith/          → Growth with scaling debt (O3-O4)
companies/apex-industries/ → Mature enterprise (O6-O7)
```

---

### Module Dependency Map

The Quannex system loads in a specific order. If building a custom integration, respect these layers:

```
MODULE LOAD ORDER (dependency chain)
════════════════════════════════════

LAYER 1: UTILITIES (no dependencies)
  js/utils/logger.js

LAYER 2: CONSTANTS (depends on Layer 1)
  js/constants/phi-harmonics.js        ← SSOT for all PHI constants
  js/constants/octave-thresholds.js    ← Re-exports from phi-harmonics
  js/constants/colors.js

LAYER 3: DATA SYSTEM (depends on Layers 1-2)
  js/data-system/data-validator.js     ← Circuit breaker, integrity
  js/data-system/json-data-loader.js   ← JSON/CSV parsing
  js/data-transformer.js              ← Bridges UI ↔ Engine
  js/kpi-library.js                   ← KPI definitions & suggestions

LAYER 4: CORE ENGINE (depends on Layers 1-3)
  js/octave-integrity-calculator.js   ← Foundation Principle
  js/breath-analyzer.js               ← 6 breath axes
  js/main.js                          ← DodecahedronEngine (THE engine)
  js/company-loader.js                ← Multi-company data management

LAYER 4b: ADVANCED ANALYZERS (depends on Layer 4, optional)
  js/advanced/edge-analyzer.js        ← Advanced edge diagnostics
  js/advanced/vertex-analyzer.js      ← Advanced vertex diagnostics
  js/advanced/dynamics-analyzer.js    ← System dynamics analysis
  js/spectral-analyzer.js             ← Eigenvalue spectral analysis

LAYER 5: AI LAYER (depends on Layer 4, optional)
  js/gemini-client.js                 ← AI provider
  js/face-wizard.js                   ← Face mapping templates
  js/company-templates-bundle.js      ← Offline template access
  js/context-synthesizer.js           ← Organizational narrative

LAYER 6: ORCHESTRATOR (depends on Layers 1-5)
  js/orchestrator/orchestrator-state.js
  js/orchestrator/orchestrator-session.js
  js/orchestrator/orchestrator-sync.js
  js/orchestrator/orchestrator-utils.js
  js/orchestrator/orchestrator-navigation.js
  js/orchestrator/orchestrator-dashboard.js
  js/orchestrator/steps/*.js           ← 8 step modules
  js/orchestrator/event-handlers.js
  js/demo-orchestrator-logic.js       ← Main orchestrator logic

LAYER 7: UX ENHANCEMENTS (depends on Layer 6, optional)
  js/ux/toast-notifications.js
  js/ux/export-manager.js
  js/ux/error-recovery.js
  js/ux/glossary-hover.js
  js/ux/keyboard-shortcuts.js
```

### Minimum Viable Integration

If you only want the calculation engine (no UI):

```html
<!-- Minimum: 7 scripts for headless calculation -->
<script src="js/utils/logger.js"></script>
<script src="js/constants/phi-harmonics.js"></script>
<script src="js/constants/octave-thresholds.js"></script>
<script src="js/data-system/data-validator.js"></script>
<script src="js/octave-integrity-calculator.js"></script>
<script src="js/breath-analyzer.js"></script>
<script type="module" src="js/main.js"></script>

<script>
  // main.js sets window.quannexEngine after module initialization.
  // Since it's a module, wait for DOMContentLoaded + small delay:
  function waitForEngine(callback, maxAttempts = 50) {
    let attempts = 0;
    const check = setInterval(() => {
      if (window.quannexEngine || attempts >= maxAttempts) {
        clearInterval(check);
        if (window.quannexEngine) callback(window.quannexEngine);
        else console.warn('Engine did not load');
      }
      attempts++;
    }, 100);
  }

  waitForEngine((engine) => {
    const state = engine.getState();
    console.log('Global coherence:', state.globalCoherence);
  });
</script>
```

---

## Next Steps

1. **Quick evaluation**: Use the Easy Path — open `welcome.html`, choose Custom, enter 12 metrics
2. **Deep analysis**: Use the Full Path — create a company JSON, load via wizard
3. **Custom integration**: Use the Minimum Viable Integration above for headless calculation
4. **Explore templates**: Load pre-built examples to see the model in action
5. **Record a demo**: Screen capture walkthrough for training

> **See also:** `docs/UX_TREE_MAP.md` for the complete user journey map and navigation graph.

---

## Support

**Documentation**:
- User experience map: [UX_TREE_MAP.md](UX_TREE_MAP.md)
- Math reference & audit trail: [math/CALCULATION_AUDIT_TRAIL.md](math/CALCULATION_AUDIT_TRAIL.md)
- Company templates: [COMPANY_TEMPLATES_GUIDE.md](COMPANY_TEMPLATES_GUIDE.md)
- Main README: [../README.md](../README.md)

**Key Files**:
- Primary landing: `welcome.html`
- Data input wizard: `demo-orchestrator.html`
- Quick demo: `demo.html`
- Core engine: `js/main.js`

---

**Built with intention. Documented with care. Ready to transform organizations.**

Version: 3.0
Last Updated: 2026-02-16
