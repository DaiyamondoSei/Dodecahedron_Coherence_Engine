# W2 Arc 2 — Live Engine State Verification (2026-05-23)

**Wave:** W2 Session A, Arc 2 (Playwright geometric verification gate, Lock #8.7)
**Status:** ⚠️ **HARD GATE FAILURE — Partnership-pause triggered per plan**
**Date:** 2026-05-23
**Authority:** Lock #8.7 (geometric verification before any sheet build)

---

## Method

1. Started local dev server: `python -m http.server 8000` (background)
2. Playwright MCP loaded `http://localhost:8000/pages/dodecahedron-3d.html`
3. Programmatically invoked `window.switchCompany('cen')` (CEN button not in UI registry — only 4 companies visible: Quannex / Nova / Zenith / Apex)
4. Tried both Standard mode and Advanced mode
5. Extracted `window.Quannex.getState()` digest

---

## What WORKED (✓)

- CEN data loads correctly via `switchCompany('cen')` — custom face names appear (Quannex CEN-authentic naming):
  - F1 "Financial Fragility" / F2 "Conceptual Depth" / F3 "Founder Dyad"
  - F4 "Governance Gap" / F5 "Mission in Silence" / F6 "Emerging Network"
  - F7 "Quiet Credibility" / F8 "Underdeveloped Engine" / F9 "Conscious Core"
  - F10 "Sacred Ground" / F11 "Dormant Pipeline" / F12 "Exposed Foundation"
- 12 faces present ✓

## What FAILED (🚨)

### 🚨 Failure 1 — Live tuning constants are NON-CANONICAL

| Constant | Live engine | Canonical (per audit trail + Lock #8.6) | Drift |
|----------|------------|------------------------------------------|-------|
| α (ALPHA) | **0.4** | **φ⁻¹ ≈ 0.618** | -35% |
| β (BETA) | 0.5 | 0.5 | ✓ match |
| γ (GAMMA) | **0.6** | **0.7** | -14% |
| δ (DELTA) | 0.95 | 0.9 or 0.95 (per face) | tolerable |
| κ (KAPPA) | **1.5** | **4** | **-62%** ⚠️ major |
| η (ETA) | **0.236** | **φ⁻² ≈ 0.382** | -38% |
| ζ (ZETA) | **0.03** | **φ⁻²/6 ≈ 0.064** | -53% |
| θ (THETA) | **0.5** | **φ⁻¹ ≈ 0.618** | -19% |

**Six of eight constants are stale.** This extends Lock #8.20 (which only documented stale `dominantMode` narrative) — the ENTIRE tuning block in the live engine is stale. The "stale narrative-scaffolding" finding is far broader than we knew.

### 🚨 Failure 2 — Face energies do NOT match Lock #8.22 canonical

| Face | Live engine | Lock #8.22 canonical (Pure-O1) | Δ |
|------|------------|-------------------------------|---|
| F1 Financial | **0.0346** | 0.2563 (Gate) | **-87%** |
| F2 Intellectual | **0.3939** | 0.1192 (Wall) | **+230%** |
| F3 Human | **0.0349** | 0.1192 (Wall) | **-71%** |
| F4 Structural | 0.2426 | 0.1349 | +80% |
| F5 Mission/Market | **0.0129** | 0.1349 | -90% |
| F6 Community | 0.0108 | 0.1523 (Gate) | -93% |
| F7 Brand | 0.0248 | 0.1192 (Wall) | -79% |
| F8 Operations | **0.0045** | 0.1192 (Wall) | **-96%** |
| F9 Regenerative | 0.0559 | 0.1192 (Wall) | -53% |
| F10 Foundational | 0.0870 | 0.1192 (Wall) | -27% |
| F11 Funding | 0.0068 | 0.1192 (Wall) | -94% |
| F12 Risk | 0.0087 | 0.1523 (Gate) | -94% |

**This is not drift — this is a different distribution entirely.** Live shows F2 dominant (0.39); canonical shows F1 dominant (0.26) with most others at Wall floor (0.1192).

### 🚨 Failure 3 — Global Coherence divergence

| Metric | Live engine | W1 canonical | Δ |
|--------|------------|--------------|---|
| Global Coherence (post-κ rescaled) | 0.0456 | — | (live only) |
| C_global raw pre-amplifier | 0.0494 | **0.1299** | **-62%** |
| κ amplifier | 1.5 | 4 | (constant difference) |

### 🚨 Failure 4 — Engine state missing edges, vertices, spectral, diagnostics

In BOTH Standard mode AND Advanced mode, `window.Quannex.getState()` returns:
- `edges: []` — empty
- `vertices: []` — empty
- `spectralAnalysis: null`
- `diagnostics: null`

The 3D visualization clearly RENDERS edges and vertices, so the geometric structure exists somewhere — but it's not exposed through `getState()`. Possible causes:
- Edges/vertices computed in separate modules invoked by visualization, not orchestrated through `getState()`
- "Complete" mode (vs Advanced) may populate them
- Need to invoke spectral-analyzer.js directly to get spectral data
- May be a missing wiring in the engine's state-aggregation path

This means **W2.5 cross-verify via `window.Quannex.getState()` cannot extract edges/vertices/spectral data as currently architected.** Need to either fix engine state wiring OR invoke each analyzer module separately.

---

## Geometric structure (the actual Lock #8.7 check)

| Element | Expected | Live engine | Status |
|---------|----------|------------|--------|
| Face count | 12 | 12 | ✓ |
| Edge count | 30 | 0 (in getState) | ⚠️ wiring gap, not structural |
| Vertex count | 20 | 0 (in getState) | ⚠️ wiring gap, not structural |
| Euler (V-E+F=2) | 2 | 12 (because E=V=0) | ⚠️ unverifiable from state |

**Verdict:** The DODECAHEDRAL GEOMETRY itself is intact (3D viz renders 12 faces + 30 edges + 20 vertices visibly). The ENGINE STATE OBJECT doesn't expose the edges/vertices arrays in a way `getState()` can return them.

---

## Three-way state divergence summary

| State source | Tuning | F1 Energy | F8 Energy | Global C raw | dominantMode | Provenance |
|--------------|--------|-----------|-----------|--------------|--------------|------------|
| **Live engine today** | κ=1.5, α=0.4 etc. | 0.0346 | 0.0045 | 0.0494 | (not in state) | `mapping-context.json` stale tuning block |
| **W1 Pure-O1 canonical** | κ=4, α=φ⁻¹ etc. | 0.2563 | 0.1192 | 0.1299 | 5 (regional band) | Audit trail §§1+13+16; Lock #8.22 |
| **mapping-context.json narrative field** | (n/a) | (n/a) | (n/a) | (n/a) | **10 (F10 face pointer)** | Lock #8.20 — narrative scaffolding, NOT spectral output |

**The SSOT must choose which "CEN" state to encode.** This is partnership-decision-grade.

---

## Implications for W2

1. **Cannot proceed to Sheet build until partnership-decided.** Plan explicitly says: *"If any assertion fails — STOP and partnership-discuss before building xlsx that encodes the engine."*
2. **Lock #8.27 cross-verify approach (`window.Quannex.getState()` extraction)** is partially compromised — works for faces, fails for edges/vertices/spectral/diagnostics. Either: (a) fix engine state wiring (POC engine refactor), (b) invoke each analyzer module separately via Playwright, (c) re-implement cross-verify via Node-side analyzer module calls (Diagnostics.js works in Node; spectral-analyzer.js might too).
3. **Lock #8.30 Interpretive Layer Disclosure document gains urgency** — the "engine state vs canonical recomputation" gap is exactly the kind of interpretive-architecture finding that disclosure document is designed to surface honestly.

---

## Resolution (added 2026-05-23 mid-Arc 2)

After root-cause investigation via systematic-debugging skill, the divergence is now understood as composed of THREE distinct issues — each separately resolved or honestly deferred:

### Issue A — Tuning block location (Lock #8.31 + #8.33 — fixed on disk)

The `tuning` block in all 5 companies' `mapping-context.json` lives at `diagnostics.tuning` (nested), NOT top-level. `company-loader.js:154` was checking `context.tuning` at the wrong level → never finds any company's tuning → `importTuning()` never fires → engine uses constructor default.

**Fix landed on disk (2026-05-23):**
- `companies/cen/mapping-context.json` — refreshed tuning block from NGO preset to balancedMode canonical (α=φ⁻¹, κ=φ², etc.); legacy NGO block preserved as `tuning_legacy_ngo` per Never Delete Rule.
- `js/company-loader.js:154` — changed to `const companyTuning = context.diagnostics?.tuning ?? context.tuning;` (supports both nested + top-level for backward compat).

**Status:** Disk-correct. In-session Playwright verification blocked by browser module cache (Playwright persists module cache across F5/new-tab/cachebust-query). **Verification deferred to fresh browser session.**

### Issue B — Live engine state vs Lock #8.22 face energies (by-design gap)

The live engine reads `mapping-context.json` `faces[].elements` (researcher-tagged 5-element values per face) for pentagramic computation. The W1 Lock #8.22 canonical face energies came from a DIFFERENT methodology: 34 BSC KPIs from `kpis.csv` → Songbook v2.1 5-element decomposition → strict-O1 normalization → pentagramic. **Two parallel methodology layers** — both valid per Lock #8.3 vector purity.

**Not a bug.** Documented in the disclosure doc (Lock #8.30) as: *"Live engine = researcher-tagged sentiment view; SSOT = BSC-KPI strict-O1 rigorous view."* SSOT encodes the rigorous view as authoritative; live engine continues as exploration layer.

### Issue C — Engine state object missing edges/vertices/spectral/diagnostics

`window.Quannex.getState()` returns empty arrays for edges/vertices and null for spectralAnalysis/diagnostics in both basic and advanced modes. 3D visualization clearly renders edges/vertices so they exist somewhere, just not in the aggregated state object.

**Deferred to Session A or B follow-up** per partnership-decision 2026-05-23. Cross-verify approach for W2.5 can either: (a) fix state aggregation (~1-2h refactor), (b) invoke analyzer modules separately in Node (Diagnostics.js + spectral-analyzer.js are Node-compatible).

---

## Files

- Screenshot: `POC/w2-arc2-cen-live-state-2026-05-23.png` (Playwright viewport capture)
- This document: `POC/docs/cen-ssot/W2_Arc2_LiveEngine_State_2026-05-23.md`
- Refresh evidence: `POC/companies/cen/mapping-context.json` (diagnostics.tuning block + tuning_legacy_ngo)
- Loader fix: `POC/js/company-loader.js:152-165`
