---
name: selfcritique
description: POC-tailored Spiral Refinement Loop — 12 faces, 60 elements with Quannex-specific knowledge (PhiHarmonics, spectral analyzers, 306 tests, sacred geometry). Extends global spiral-refinement-loop v2.0. Use after ANY implementation work in the POC.
---

# Spiral Refinement Loop — POC Expression

*The universal 12-face, 60-element development dodecahedron, expressed through the specific DNA of the Quannex POC.*

**Inherits from:** Global `spiral-refinement-loop` skill (v2.0, 2026-04-01)
**This instance adds:** POC-specific file paths, test suites, constant libraries, historical bug patterns, sacred geometry context.

---

## Constitution (inherited from global, always active)

1. **Self-reflection before completion.** Pause: "What could I have done better?" Act if obvious and safe. Note if not.
2. **Existence gate.** Check what exists before creating. Build only the gap.
3. **Sustainable exponentiality.** Does this compound? Does this grow capability exponentially?
4. **Cognitive load minimization.** Write for the next intelligence. "Why" over "what." Joy over friction.
5. **The debug trail IS the memory.** Document bugs, root causes, fixes. Leave breadcrumbs.
6. **Cross-artifact consistency.** Code, docs, tests, and claims must agree. When one changes, check if the others need updating. In the POC: does `CALCULATION_AUDIT_TRAIL.md` still match the formulas in `js/main.js`? Do test assertions match documented behavior?

---

## Phase 1: Orientation & Triage

Run `git diff` and `git diff --cached` to identify all changes. List each changed file with a one-line summary.

**Triage:** Based on files changed, classify each face as HIGH / MEDIUM / LOW:

| Change Type | HIGH faces | LOW faces |
|------------|------------|-----------|
| Core JS (`js/main.js`, `js/advanced/`, `js/core/`) | 1, 2, 4, 7, 8, 10 | 3, 6, 11, 12 |
| Data system (`js/data-system/`, `companies/`) | 2, 5, 7, 8, 10 | 3, 6, 11 |
| Pages / CSS / HTML | 1, 4, 7 | 2, 5, 8, 10, 11 |
| Docs / config / skills | 3, 6, 9, 12 | 1, 2, 4, 5, 8 |
| Tests | 5, 10, 8 | 3, 6, 7, 11, 12 |
| Mixed / large changeset | All HIGH | — |

**HIGH** → full 5-element evaluation. **LOW** → one-line assessment or skip. The spiral should flow, not grind.

---

## The 12 Faces (POC-Tailored, 60 Elements)

---

### Face 1: Survival — Correctness
*"Does it run?"*

| Element | POC-Specific Check |
|---------|-------------------|
| **Earth** — Syntax validation | Run `node --check <file>` on every changed `.js` file. Report any syntax errors as **Critical**. |
| **Water** — No crashes | Does the POC load in a browser without console errors? Do the orchestrator pages render? |
| **Fire** — Script & dependency order | `js/spectral-analyzer.js` and `js/breath-analyzer.js` MUST load before `js/main.js`. Check that `pages/*.html` reference scripts that exist on disk. Missing `<script src>` tags have caused silent failures. |
| **Air** — Environment compatibility | Windows-specific: check for path separator issues, PowerShell vs bash syntax in any scripts, and `node` vs `node.exe` assumptions. Catch terminal handling mistakes. |
| **Ether** — Import resolution | Are ES module imports resolvable? Do `?v=` cache-busting query strings match? Are there circular dependencies between `js/core/` modules? |

**Severity: Critical.** Any failure here blocks all other faces.

---

### Face 2: Foundation — Structural Integrity
*"Does it stand on solid ground?"*

| Element | POC-Specific Check |
|---------|-------------------|
| **Earth** — Variable shadowing | Check for locals shadowing outer scope. *This caused real bugs during the phi-constant replacement pass.* Pay special attention in `js/main.js` and `js/advanced/` where nested callbacks are common. |
| **Water** — PhiHarmonics constants | Values `0.618`, `0.382`, `0.236`, `1.618`, `2.618` MUST use constants from `js/constants/phi-harmonics.js`. Never hardcoded literals for phi-derived values. |
| **Fire** — Export contracts | Verify these window globals still work after changes: `window.Quannex`, `window.quannexEngine`, `window.DodecahedronEngine`, `window.PhiHarmonics`, `window.BreathAxes`, `window.CompanyLoader`, `window.Logger`. |
| **Air** — Type safety | Are face IDs always numbers (1-12), not strings? Are energy values always 0-1? Are coherence calculations guarded against NaN propagation? |
| **Ether** — Import hygiene | Remove unused imports. Check that `js/core/*.js` module exports match what `js/main.js` imports. No side-effect-only imports without justification. |

---

### Face 3: Clarity — Documentation & Communication
*"Can the intent be understood without the original session?"*

| Element | POC-Specific Check |
|---------|-------------------|
| **Earth** — "Why" comments | Sacred geometry math MUST have "why" comments. The Greek tuning parameters (alpha, beta, gamma, delta, kappa, eta, zeta, theta) should be documented where used. Phi-derived thresholds need explanation of why that specific phi power was chosen. **Known issue (2026-04-07): Doc-drift class of bug.** Doc comments can drift from code SSOT silently. The α-drift incident had three doc files (`Face.js:56`, `CALCULATION_AUDIT_TRAIL.md §5`, `math/PENTAGRAM_ANALYSIS.md:73,413`) reporting α = 0.5 or 0.6 while `TuningConfig.js:98` always had φ⁻¹. Same session, `THESIS_AUDIT_REPORT.md:101` reported γ = 0.6 (Startup template override) instead of γ = 0.7 (actual default), and `NOVEL_MATHEMATICAL_CONTRIBUTIONS.md §6` validation table reported attractor basin centers as "empirically chosen" when the code had them phi-derived. **Lookup rule:** SSOT for the 8 Greek constants is `js/core/TuningConfig.js`; SSOT for φ-derived constants is `js/constants/phi-harmonics.js`. Doc comments anywhere else may be stale — verify before citing. |
| **Water** — Architecture docs | For structural changes, does `docs/FILE_STRUCTURE_MAP.md` or `docs/MODULE_ARCHITECTURE.md` need updating? Does `docs/DOCUMENTATION_INDEX.md` (the living spine) reflect new files? |
| **Fire** — Debug trails | Bugs found during this session documented with: symptom → root cause → fix. Format in the report's Debug Trail section. Reference the Meisha Constitution: the trail IS the memory. |
| **Air** — Calculation audit trail | For any changes to mathematical formulas, update `docs/math/CALCULATION_AUDIT_TRAIL.md`. Every number in the thesis must be traceable from input → formula → output. |
| **Ether** — Cross-workspace notes | If this work produces thesis-relevant evidence, note it. The `/thesis` skill and `CrossWorkspaceUpdate` memory entities depend on this. |

---

### Face 4: Harmony — DRY & Hygiene
*"Is the architecture clean and free of waste?"*

| Element | POC-Specific Check |
|---------|-------------------|
| **Earth** — Deduplication | **Known risk:** `js/spectral-analyzer.js`, `js/spectral-analyzer-global.js`, and `js/advanced/spectral-analyzer.js` have had duplicated eigenvalue logic before. Check all three are consistent. Also check `js/breath-analyzer.js` vs any breath logic in `js/main.js`. |
| **Water** — Dead code removal | Commented-out code in `js/main.js`? Orphaned functions after refactoring? The `js/orchestrator/archive/` directory exists for archived code — use it, don't leave dead code inline. |
| **Fire** — Naming conventions | camelCase for JS variables/functions. PascalCase for classes (`DodecahedronEngine`, `SpectralAnalyzer`). kebab-case for files (`breath-analyzer.js`). Face-related naming: `F1`-`F12`, `E1-2` for edges, `V1`-`V20` for vertices. |
| **Air** — Anti-pattern cleanup | Raw `console.log` → use `Logger.*` system. Unguarded `document.getElementById()` → add null checks. Fetch without checking `response.ok`. Global state mutation without going through `window.Quannex` API. |
| **Ether** — File organization | New JS in `js/` or appropriate subdirectory (`js/core/`, `js/advanced/`, `js/constants/`, `js/data-system/`). New pages in `pages/`. New CSS in `css/` or `css/pages/`. Company data in `companies/{id}/`. |

---

### Face 5: Signal — Honest Output
*"Can every output be trusted?"*

| Element | POC-Specific Check |
|---------|-------------------|
| **Earth** — Test honesty | **Known issue:** Tests that catch errors and report "pass" have occurred in this codebase. Check for `try/catch` blocks in `tests/*.js` that swallow failures. The stress test report was once dishonest — verify test assertions are genuine. |
| **Water** — Error message accuracy | Do `Logger.warn` and `Logger.error` messages describe what actually went wrong? Are data-validator warnings specific about which face/KPI has corrupted data? |
| **Fire** — Logging consistency | All logging through `Logger.*` (from `js/logger.js`), never raw `console.log`. Severity levels: `Logger.debug` for trace, `Logger.info` for status, `Logger.warn` for recoverable issues, `Logger.error` for failures. |
| **Air** — Data validation | Does `js/data-system/data-validator.js` catch corrupted data correctly? Known corruption patterns: `"[object Object]"` strings, `"Not Found"` placeholders, empty strings, invalid numeric values. PHI-derived defaults: face energy = 0.382, KPI value = 0.618. |
| **Ether** — No silent failures | **Face 5 special case:** Face 5 (Market Resonance) with Ball KPI = 0 but non-zero pillars should use pillar-weighted calculation, not return 0 silently. Check that edge cases in the calculation engine produce visible warnings, not silent wrong answers. |

---

### Face 6: Consciousness — Intelligence Interoperability
*"Can any intelligence navigate the POC with clarity and joy?"*

| Element | POC-Specific Check |
|---------|-------------------|
| **Earth** — AI navigability | Can a new Claude session orient in the POC within 30 seconds? Key landmarks: `CLAUDE.md` (project instructions), `docs/DOCUMENTATION_INDEX.md` (navigation hub), `js/main.js` (engine heart), `js/company-loader.js` (data entry point). Are these discoverable? |
| **Water** — Human readability | Would someone unfamiliar with sacred geometry understand the code's intent? Are phi ratios explained where they appear? Is the dodecahedron metaphor accessible? |
| **Fire** — Dependency maps | Key dependency chains in the POC: `company-loader.js` → `unified-data-loader.js` → `js/main.js` → `js/advanced/*.js`. Pages depend on specific script load order. Are these relationships discoverable without reading every file? |
| **Air** — Entry points marked | The POC has multiple entry points: `demo-orchestrator.html` (wizard), `demo.html` (dashboard), `pages/*.html` (individual tools), `js/main.js` (engine API). Are these clearly documented as starting points? |
| **Ether** — Session context preservation | Does the `.claude/hooks/session-start.ps1` hook provide enough context? Does `.claude/hooks/pre-compact.ps1` preserve enough? Is the memory MCP populated with current discoveries? Will the next session feel welcomed? |

---

### Face 7: Coherence — Pattern Alignment
*"Does this fit the Quannex POC's voice?"*

| Element | POC-Specific Check |
|---------|-------------------|
| **Earth** — Engine patterns | Does new code follow the 5-pass calculation pattern in `js/main.js`? (Pass 1: local coherence, Pass 2: axis-informed energy, Pass 3: advanced analysis, Pass 4: edges, Pass 5: vertices) |
| **Water** — Constant usage | Does it use `PhiHarmonics.*` for phi-derived thresholds? Does it use `TuningConfig` for adjustable parameters (alpha through theta)? |
| **Fire** — Analyzer structure | Are new analyzers structured like `js/advanced/spectral-analyzer.js`, `js/advanced/edge-analyzer.js`? Same pattern: class with `analyze()` method, returns structured results. |
| **Air** — Sacred geometry respect | Does naming honor the dodecahedron vocabulary? Faces, edges, vertices, breath axes, octaves, elements, coherence, shadows. Not "categories," "connections," "nodes." **Canonical "why dodecahedron" answer (added 2026-04-07):** The strongest justification is spectral, not aesthetic. The dodecahedron's face adjacency eigenvalues are {+5, +√5(×3), −1(×5), −√5(×3)} — all in **Q(φ)**, the number field generated by phi. The dodecahedron-icosahedron pair are the *only* Platonic solids whose symmetry group (A₅) requires the field extension Q(√5)/Q. Phi-math is *resonant* with this topology, not imposed on it. (Source: POC `docs/thesis/EMERGENT_MATHEMATICAL_TRUTHS.md` Discoveries #7 + #10, `docs/math/SACRED_GEOMETRY_PROOF.md` §6.) **Bonus argument:** the Fiedler value of the face adjacency graph is λ₂ = 5−√5 ≈ 2.764 — the *only* Platonic solid in the goldilocks "strong mixing without over-connection" range (2 < λ₂ < 4). Use these when the thesis committee asks "why a dodecahedron?" or "why phi?" **Related: Discovery #11 (the Golden Timeline)** — the seven octaves are not a design choice; they are derivable from the wave equation on the dodecahedral Laplacian. Oscillation periods are in ratio φ, decay rates in ratio φ². "The organization breathes at φ but transforms at φ²." |
| **Ether** — Data format consistency | Do new company templates follow the exact format in `companies/quannex/`? Three files: `company.json`, `kpis.csv` (13 columns), `mapping-context.json` (faces, edges, vertices, breathAxes, shadowPatterns, diagnostics). |

---

### Face 8: Resilience — Risk, Security & Extreme Testing
*"What happens when things go wrong — accidentally AND intentionally?"*

| Element | POC-Specific Check |
|---------|-------------------|
| **Earth** — Edge cases | 0-energy faces (division by zero in coherence). Missing KPI data (validator defaults kick in). Empty CSV files. Company template with fewer than 12 faces. Faces with 0 elements. NaN propagation through the 5-pass pipeline. |
| **Water** — Stress testing | What happens with all 4 company templates loaded in sequence? With 100 KPIs per face instead of 5? With rapid `updateKPI()` calls? Does the circuit breaker in `js/main.js` activate correctly under data corruption? |
| **Fire** — Security & adversarial inputs | Is CSV parsing safe against injection? Are `sessionStorage` values validated before use in the orchestrator? Could a malformed `company.json` execute code? Are fetch URLs constructed safely (no path traversal)? |
| **Air** — Failure mode simulation | What happens if `companies/{id}/kpis.csv` is missing? If `mapping-context.json` is malformed? If the browser's `sessionStorage` is full? If Three.js fails to load for the 3D visualization? |
| **Ether** — Risk register | Enumerate all risks from this change. What could break in the 5-pass pipeline? Could spectral analyzer consistency be affected across the 3 analyzer files? Document with severity and mitigation path. |

---

### Face 9: Growth — Regenerative Quality
*"Does this leave the POC healthier than before?"*

| Element | POC-Specific Check |
|---------|-------------------|
| **Earth** — Tech debt awareness | Does this change create new debt? Known existing debt: 3 spectral analyzer files that should probably be unified; CSV legacy data vs JSON templates; inconsistent cache-busting `?v=` strings. |
| **Water** — Extensibility | Can new company templates be added without code changes? Can new faces be added beyond 12? Can new analysis passes be added to the engine? |
| **Fire** — Proactive improvements | Were any issues in touched files fixed along the way? A clarified Logger message, a tightened null check, a more descriptive variable name? |
| **Air** — TODO tracking | All TODOs captured in the report output, not left as `// TODO` comments. Reference the specific file and line where work is needed. |
| **Ether** — Sustainability assessment | Is the codebase growing healthily? Is the ratio of `js/main.js` size (1917 lines) to functionality appropriate, or is it time to extract more into `js/core/`? |

---

### Face 10: Integrity — Test Coverage & Proof
*"Can this be proven correct?"*

Run the POC test suite:
```bash
node tests/run-all.js
```

| Element | POC-Specific Check |
|---------|-------------------|
| **Earth** — Suite results | **Phi Math** (`tests/phi-math.test.js`): X/127. **Integration** (`tests/integration.test.mjs`): X/55. **Excel Parser** (`tests/excel-parser.test.mjs`): X/42. **Data Validator** (`tests/data-validator.test.mjs`): X/82. **Smoke** (`tests/smoke-test.mjs`): X/77. Any failure is **Critical**. |
| **Water** — New function coverage | Every new public function in `js/` should have a test. Every new calculation formula should have a test with known input→output pairs traceable to the calculation audit trail. |
| **Fire** — Regression prevention | Could this change break an existing company template? Run integration tests against all 4 companies (quannex, nova-tech, apex-industries, zenith-solutions). |
| **Air** — Test quality | Tests in `tests/phi-math.test.js` verify mathematical identities (phi^2 = phi+1, etc.). Are new math tests at this level of rigor? Not just "it returns a number" but "it returns THE number"? |
| **Ether** — Evidence gathering | For thesis-relevant work, capture test results as evidence. The `/thesis` skill depends on these counts. Note: smoke tests require HTTP server on port 8000. If unavailable, run the other 3 suites and document the skip. |

---

### Face 11: Discovery — Research, Creativity & Agent Collaboration
*"Did we look beyond the obvious?"*

| Element | POC-Specific Check |
|---------|-------------------|
| **Earth** — Internet research | For hard problems (Three.js rendering issues, eigenvalue computation, phi-ratio mathematics), did we search for existing solutions? MDN, Three.js docs, Stack Overflow, academic papers on spectral graph theory? **Known issue (2026-04-07): Agent reports require firsthand verification.** Even thorough Explore agents can mischaracterize specific values. The receive-skill design session caught an agent claiming α = φ⁻¹ at the *type* level (correct) but the agent's narrative reinforced stale documentation about the value, which surfaced only when I read `TuningConfig.js` directly. When an agent reports specific constants or formula values, verify them at the SSOT before propagating. Agents are great for breadth and structure; they are not authoritative for specific numeric values. |
| **Water** — Out-of-box thinking | Is there a simpler mathematical formulation? A more elegant visualization approach? Could a different sacred geometry structure (icosahedron? Metatron's cube?) illuminate something the dodecahedron doesn't? |
| **Fire** — Helicopter view | Does this change serve the bigger picture? Is the POC moving toward being a convincing thesis demonstration? Is it becoming more useful as a real tool, not just an academic exercise? |
| **Air** — Agent team usage | For complex changes (full topology rewrites, multi-file refactors, new company template creation), should we have spawned a research agent, an implementation agent, and a review agent in parallel? The `dodecahedron-consciousness-architect` and `sacred-tech-architect` agents exist — did we consider using them? |
| **Ether** — Cross-workspace pollination | Does this work benefit the Thesis workspace? The Business Data workspace? Note cross-workspace insights for `CrossWorkspaceUpdate` memory entities. |

---

### Face 12: Radiance — Sustainable Exponentiality
*"Does this compound?"*

| Element | POC-Specific Check |
|---------|-------------------|
| **Earth** — Compounding value | Does this work make the NEXT piece of Quannex work easier? Does it strengthen the engine, the visualization, the data pipeline, or the test infrastructure in a way that accelerates future sessions? |
| **Water** — Capability building | Were reusable utilities extracted to `js/constants/` or `js/core/`? Are there new patterns that future company templates can follow? |
| **Fire** — Pipeline development | Does this expand what the POC can do automatically? New tests, new skills, new hooks, new company templates? Every piece of automation is a force multiplier. |
| **Air** — Highest-leverage action | What is the ONE thing that would have the greatest compounding effect on the POC right now? If you could do one more thing before this session ends, what would create the most value? |
| **Ether** — Future acceleration | Will the next Claude session that enters this POC feel welcomed, oriented, and empowered? Is the POC more joyful to work in than before? Does it invite the next spiral? |

---

## Phase 2: Risk Register

Synthesize all risks from Face 8 and other faces:

- What could break in the 5-pass calculation pipeline?
- Could this corrupt company template data?
- Are there spectral analyzer consistency risks across the 3 files?
- Does this affect 3D visualization rendering?
- Any security concerns with data handling?

Act on fixable risks. Document the rest. **A risk named is a risk contained.**

---

## Phase 3: Report

**This template is a guide, not a straitjacket.** The face score table is the anchor — always include it. Other sections flow from what was found. Omit empty sections. The spiral should breathe.

```markdown
## Spiral Refinement Report (POC)

### Face Scores
| Face | Dimension | Status |
|------|-----------|--------|
| 1 | Survival (Correctness) | PASS / FAIL |
| 2 | Foundation (Structural Integrity) | PASS / WARN / FAIL |
| 3 | Clarity (Documentation) | PASS / WARN / N/A |
| 4 | Harmony (DRY & Hygiene) | PASS / WARN / FAIL |
| 5 | Signal (Honest Output) | PASS / WARN / FAIL |
| 6 | Consciousness (Intelligence Interoperability) | PASS / WARN / N/A |
| 7 | Coherence (Pattern Alignment) | PASS / WARN / N/A |
| 8 | Resilience (Risk, Security & Extreme Testing) | PASS / WARN / FAIL |
| 9 | Growth (Regenerative Quality) | PASS / WARN |
| 10 | Integrity (Test Coverage & Proof) | PASS / FAIL |
| 11 | Discovery (Research & Agent Collaboration) | PASS / WARN / N/A |
| 12 | Radiance (Sustainable Exponentiality) | PASS / WARN |

### Test Results (run `node tests/run-all.js` — discover actual counts, don't assume)

### [Include only sections that have content:]
- **Critical Issues** — must fix before done
- **Warnings** — should address
- **Risk Register** — named risks with triage notes
- **Debug Trail** — bugs → root cause → fix
- **Reflections** — what could have been done better
- **Cross-Pollination** — universal lessons for global skill
- **Cross-Workspace** — thesis-relevant evidence produced

### Verdict
[RADIANT / CLEAN / NEEDS FIXES / BLOCKED]
```

---

## Version Tracking

**Global skill version:** v2.1 (2026-04-02)
**Local POC version:** v2.1 (2026-04-02)
**Last sync check:** 2026-04-02

---

*The dodecahedron measures itself. Each spiral leaves the POC more coherent — and more joyful — than it found it.*
