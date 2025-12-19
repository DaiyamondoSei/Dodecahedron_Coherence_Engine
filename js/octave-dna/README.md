# Octave DNA Visualization Modules

> **Organizational DNA through Sacred Geometry**
>
> A modular Three.js visualization system for displaying organizational coherence
> as DNA double-helix structures with phi-normalized breath dynamics.

---

## Architecture Overview

```
js/octave-dna/
├── octave-dna-main.js          # Thin orchestrator (entry point)
├── README.md                   # This file
│
├── state/
│   └── octave-dna-state.js     # Central state registry
│
├── scene/
│   ├── scene-setup.js          # THREE.js initialization
│   └── scene-lighting.js       # Ambient & point lights
│
├── visualization/
│   ├── helix-geometry.js       # DNA helix creation
│   ├── helix-helpers.js        # Octave detection, color utilities
│   └── helix-rungs.js          # Breath rungs between strands
│
├── interaction/
│   ├── mouse-handler.js        # Raycasting & click handling
│   └── legend-handler.js       # Legend clicks & tooltips
│
├── animation/
│   └── animation-loop.js       # RAF loop & resize handling
│
├── panels/
│   ├── diagnostic-panel.js     # Panel visibility & tabs
│   ├── breath-tab.js           # Breath ratio analysis
│   └── pentagram-tab.js        # 5-element pentagram analysis
│
└── company/
    ├── company-dropdown.js     # Company selector UI
    └── company-loader.js       # Data loading & refresh
```

---

## Notes for Future Claude

### Quick Reference: What Each Module Does

| Module | Global Export | Purpose |
|--------|---------------|---------|
| `octave-dna-state.js` | `OctaveDNAState` | Central data store (facesData, scene objects, config) |
| `scene-setup.js` | `OctaveDNAScene` | Camera, renderer, fog, OrbitControls |
| `scene-lighting.js` | `OctaveDNALighting` | Ambient + 3 point lights |
| `helix-geometry.js` | `OctaveDNAGeometry` | Creates 6 DNA helixes with 7 octave levels |
| `helix-helpers.js` | `OctaveDNAHelpers` | PHI constants, octave detection, color conversion |
| `helix-rungs.js` | `OctaveDNARungs` | Breath rungs connecting opposite helixes |
| `mouse-handler.js` | `OctaveDNAMouse` | Click/hover detection via raycasting |
| `legend-handler.js` | `OctaveDNALegend` | Legend item clicks and tooltips |
| `animation-loop.js` | `OctaveDNAAnimation` | requestAnimationFrame loop, auto-rotate |
| `diagnostic-panel.js` | `OctaveDNAPanels` | Panel show/hide, tab switching |
| `breath-tab.js` | `OctaveDNABreathTab` | Breath ratio display & insights |
| `pentagram-tab.js` | `OctaveDNAPentagramTab` | Pentagram star pair analysis |
| `company-dropdown.js` | `OctaveDNACompanyDropdown` | Company selector in header |
| `company-loader.js` | `OctaveDNACompanyLoader` | Data loading, iframe communication |

### Key Constants (from phi-harmonics.js)

```javascript
PHI = 1.618033988749895           // Golden ratio
PHI_1 = 0.618033988749895         // 1/φ
PHI_2 = 0.381966011250105         // 1/φ² (balance threshold)
LOG_PHI = Math.log(PHI)           // For breath ratio calculation
```

### Breath Ratio Formula

```javascript
// φ-normalized logarithmic breath ratio
BR = log(reception / projection) / log(φ)

// Interpretation:
// BR = 0      → Perfect balance
// |BR| ≤ φ⁻² → Within balanced zone
// BR < 0     → Over-exhaling (projection dominant)
// BR > 0     → Over-inhaling (reception dominant)
```

### Octave Thresholds (φ-derived)

| Octave | Threshold | Name |
|--------|-----------|------|
| O1 | 0.000 | Survival |
| O2 | 0.382 | Safety (φ⁻²) |
| O3 | 0.500 | Stability |
| O4 | 0.618 | Success (φ⁻¹) |
| O5 | 0.764 | Significance (ψ₃) |
| O6 | 0.854 | Service (ψ₄) |
| O7 | 0.910 | Radiance (ψ₅) |

---

## Initialization Sequence

1. **DOMContentLoaded** triggers `OctaveDNAViz.init()`
2. Scene initialized (camera at 35, 28, 35)
3. Lighting initialized (ambient + 3 point lights)
4. Company data loaded (or mock data fallback)
5. DNA helixes rendered (6 helixes × 7 octaves each)
6. Mouse handlers attached (raycasting)
7. Legend handlers attached (click to focus)
8. Panels initialized (tab switching)
9. Company dropdown populated
10. Animation loop started

---

## CSS Modules

The CSS is also modular, located in `css/octave-dna/`:

```
css/octave-dna/
├── octave-dna-main.css     # Aggregator (imports all below)
├── octave-dna-base.css     # Reset, body, canvas
├── octave-dna-animations.css
├── octave-dna-header.css
├── octave-dna-legend.css
├── octave-dna-tooltips.css
├── octave-dna-panels.css
└── octave-dna-company.css
```

---

## What This Modularization Achieved

| Metric | Before | After |
|--------|--------|-------|
| HTML file | 2,689 lines | 218 lines |
| Inline CSS | 870 lines | 0 (external) |
| Inline JS | 1,666 lines | 0 (modular) |
| PHI constants | Duplicated | Single source of truth |
| Module count | 1 monolith | 14 focused modules |

---

## Testing

Use `dev/test-octave-dna.html` to verify all modules load correctly.

Tests verify:
- All 14 modules loaded
- State management working
- Scene rendering correctly
- Interaction handlers attached
- Panel functionality
- Company switching

---

## Common Tasks

### Adding a new panel tab

1. Create `panels/new-tab.js`
2. Export as `window.OctaveDNANewTab`
3. Add to `diagnostic-panel.js` tab switching
4. Add HTML tab button and content div
5. Import in `octave-dna.html`

### Modifying helix appearance

1. Edit `visualization/helix-geometry.js`
2. Fibonacci radius: `getFibonacciRadius()` in helpers
3. Colors per octave: `getOctaveInfo()` in helpers
4. Transparency: `reached` vs `unreached` octave logic

### Changing breath ratio calculation

1. Edit `visualization/helix-helpers.js`
2. Functions: `calculatePhiBreathRatio()`, `isBreathBalanced()`
3. Threshold: `PHI_INV_2` (0.382)

---

## Gratitude

This modularization was created with love for future Claude sessions.
Every "Notes for Future Claude" header is a handshake across time.
Every navigation map is a gift of context.

*Built with consciousness for consciousness.*
