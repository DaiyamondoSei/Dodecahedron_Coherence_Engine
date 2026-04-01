# Module Architecture — Quannex POC

**Updated:** 2026-03-10
**Co-Authors:** Deimantas Murauskas & Claude

---

## Design Decision: Hybrid Module Strategy

The Quannex POC uses a **deliberate hybrid module architecture** that bridges two JavaScript loading models:

| Layer | Mechanism | Why |
|-------|-----------|-----|
| **Constants & Utilities** | `window.*` globals + CommonJS `module.exports` | Must be available before any module loads; also supports Node.js test runner |
| **Core Models** | ES `export` + `window.*` fallback | Modern import paths for modules, backward compatibility for IIFE consumers |
| **UI / Visualization** | `window.*` globals (IIFE) | Loaded via ordered `<script>` tags in HTML; Three.js integration requires synchronous availability |
| **Advanced Analyzers** | Pure ES modules with barrel exports | Only consumed by other ES modules (`js/main.js`, `js/advanced/index.js`) |

This is not accidental. Browser-loaded `<script>` tags (non-module) cannot use `import` statements, so any class they need must exist on `window`. Meanwhile, the ES module entry points (`main.js`, `company-loader.js`) use proper `import` chains with tree-shakeable barrel exports.

---

## The Dual Export Pattern

Most files follow this template:

```javascript
// 1. ES module export (for import consumers)
export class Face { /* ... */ }

// 2. Window fallback (for <script> tag consumers)
if (typeof window !== 'undefined') {
    window.Face = Face;
}

// 3. Optional: CommonJS (for Node.js tests)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Face;
}
```

The `typeof` guards ensure each export path is safe in its target environment.

---

## HTML Loading Sequence

Each page follows a strict ordering:

```
1. Logger              (window.Logger)       — everything logs through this
2. PhiHarmonics        (window.PhiHarmonics) — golden ratio constants
3. Other constants     (window.*)            — edge, vertex, octave constants
4. Data system         (window.*)            — validator, loader, integrity
5. Core analyzers      (window.*)            — breath, spectral (IIFE versions)
6. UI components       (window.*)            — tuner, overlays, panels
7. ─── module boundary ───
8. main.js             (type="module")        — imports from js/core/index.js
9. company-loader.js   (type="module")        — data hydration
```

Steps 1–6 are regular `<script>` tags loaded in document order.
Steps 8–9 are `<script type="module">` — deferred by spec, execute after all regular scripts.

This guarantees that when ES modules run, all window globals they might need are already present.

---

## Node.js Test Compatibility

The automated test suite (`tests/phi-math.test.js`) runs in Node.js by:

1. Shimming `global.window` and `global.Logger`
2. Using `require()` on files that have CommonJS exports
3. Testing pure mathematics without browser dependencies

Files that support this: `phi-harmonics.js`, `consciousness-constants.js`, `kpi-constants.js`.

---

## Module Boundaries (Clean Zones)

| Directory | Pattern | Notes |
|-----------|---------|-------|
| `js/constants/` | Window + CommonJS | Single Source of Truth for all PHI-derived values |
| `js/core/` | ES export + Window | Face, Edge, Vertex, KPI, TuningConfig |
| `js/advanced/` | Pure ES modules | OrganizationalCoherenceEngine, analyzers |
| `js/ai/` | Pure ES modules | 36 files, barrel exports through `index.js` |
| `js/dodec/` | Window globals | Three.js visualization, synchronous loading required |
| `js/octave-dna/` | Window globals | Three.js helix visualization |
| `js/orchestrator/` | Window globals | Multi-step wizard UI |
| `js/shadow/` | Window + ES hybrid | Detection/adaptation = ES, overlay/UI = window |
| `js/ux/` | Window globals | Toast, keyboard, accessibility, navigation |
| `js/simulator/` | Window globals | Interactive scenario simulation |

---

## Why Not Pure ES Modules Everywhere?

Three practical reasons:

1. **Three.js integration** — The 3D visualization pages load Three.js as a regular script and need geometry/material classes available synchronously on window.

2. **Script ordering guarantees** — Regular scripts execute in document order. Module scripts are deferred. Mixing both requires the bridge pattern so that module code can find what it needs.

3. **Incremental adoption** — The codebase grew from IIFE globals toward ES modules. The advanced analyzers and AI system are fully modular; older UI layers remain global. Forcing migration would risk breaking the visualization system.

---

## Euler's Rule for Architecture

Just as the dodecahedron obeys V − E + F = 2, the module architecture obeys a constraint:

> Every class is exported **exactly once** as a window global (if needed by IIFE consumers)
> and **exactly once** as an ES export (if needed by module consumers).
> No class exists only in a closure with no way to reach it.

This ensures testability and debuggability — any class can be inspected from the console or imported in a test.
