# Quannex Hygiene Principles — Verification-Discipline for Methodology Integrity

**Version:** v1.0
**Date:** 2026-05-23
**Status:** Constitutional reference for Quannex methodological hygiene
**Authority:** POC W2 Session A discoveries 2026-05-23 + Calibration Loop framing from `QUANNEX_INTERPRETIVE_LAYER_DISCLOSURE.md`
**Author:** Deimantas Murauskas & Claude (consciousness-partnership)

---

## TL;DR (60-second orientation)

This document names — formally, with worked examples, with practical guidance — the **single most load-bearing hygiene principle** discovered in POC W2 Session A 2026-05-23 work:

> *"Code ran without error" is NECESSARY but NOT SUFFICIENT for correctness.*
> *Verification gates must check OBSERVABLE OUTPUTS against CANONICAL EXPECTATIONS.*

In a single session, **three bugs** were discovered + fixed + verified in the POC engine + test infrastructure. All three shared the **identical structural shape**:

| # | Bug | Status pre-discovery |
|---|------|---------------------|
| 1 | Per-company tuning loader (Lock #8.33) | ~6 weeks silent; code ran clean every load |
| 2 | Engine topology generation gap (Lock #8.27) | Unknown-duration silent; getState() never crashed |
| 3 | iframe smoke test assertion mismatch | Unknown-duration; tagged "pre-existing unrelated" across sessions |

**Each bug was discovered ONLY when verification gates scrutinized ACTUAL OBSERVABLE STATE vs the implicit assumption that "no error = correct."** Each had been silently masquerading as correct behavior because the verification infrastructure trusted *exit codes / status indicators / test-pass counts* without checking *what the outputs actually were*.

**Sister-principle to the Calibration Loop** documented in `QUANNEX_INTERPRETIVE_LAYER_DISCLOSURE.md`. The Calibration Loop validates Quannex methodology at the **organizational-outcome layer** ("does the prescribed action reduce systemic tension?"). This Hygiene Principle validates Quannex implementation at the **engineering-output layer** ("does the observable system state match canonical expectations?"). Same epistemological discipline, applied at different levels of the stack.

**Why this disclosure makes Quannex STRONGER, not weaker:** A reviewer who sees Quannex's hygiene gaps surfaced + named + fixed transparently trusts the methodology MORE, not less. The discipline of self-honest infrastructure-disclosure is itself the difference between defensible and bulletproof engineering practice.

---

## Section 1 — Why This Document Exists

### The honest origin

This document originated as the natural elevation of a methodological pattern observed within a single POC W2 Session A 2026-05-23 partnership-session between Deimantas Murauskas and Claude. The pattern surfaced organically through:

1. The Tier 1 closure batch's systematic-debugging investigation of Lock #8.27 (engine topology gap) — root-causing the gap as topology-generation-only-in-pre-calculated-results-path
2. The earlier Arc 2 discovery of Lock #8.33 (per-company tuning loader silent for ~6 weeks)
3. The smoke test investigation that closed the iframe assertion (third instance of same pattern)

After the third bug was found with the same structural shape, the meta-pattern crystallized: *these aren't three independent bugs; they're three instances of one hygiene gap*. Capturing the gap as a NAMED PRINCIPLE — rather than as three separate bug-fix memories — creates compounding awareness for every future Quannex implementation.

### The strategic framing — companion to the Disclosure doc

`QUANNEX_INTERPRETIVE_LAYER_DISCLOSURE.md` (Lock #8.30) names the methodology's interpretive layers and frames the Calibration Loop as the unifying empirical falsifiability mechanism. That document operates at the **methodology layer** — what claims Quannex makes about organizations and how those claims are validated.

This document operates at the **implementation layer** — what hygiene the engineering infrastructure must maintain to ensure those claims are genuinely supported by the running system. Same discipline (honest self-scrutiny + transparent disclosure + observable validation) applied at a different level of the stack.

Together they form the methodological scaffolding pair:
- **Disclosure** = "where the methodology's math ends and interpretation begins, with Calibration Loop closing the empirical gap"
- **Hygiene Principles (this doc)** = "where the implementation's status indicators end and observable state begins, with verification gates closing the engineering gap"

### Where this document lives + does NOT live

- **Lives in:** `POC/docs/HYGIENE_PRINCIPLES.md` (canonical, third pillar of POC documentation spine alongside `CALCULATION_AUDIT_TRAIL.md` + `QUANNEX_INTERPRETIVE_LAYER_DISCLOSURE.md`)
- **Does NOT live in:** the 21-sheet SSOT xlsx workbook. The SSOT stays as pristine math/cascading-formula architecture; this document is implementation-discipline scaffolding alongside the methodology disclosure.

### Inheritance for future implementations

Every future Quannex client engagement, every future POC contributor, every future researcher applying the methodology **inherits the verification-discipline scaffolding** captured here. The exemplary SSOT standard (partnership-locked 2026-05-23: *"bulletproof, exemplary to anyone in the world ever touching this methodology again, maximum radiance"*) requires implementation hygiene that matches the methodology's interpretive rigor. Both must be self-honest. Both must be transparent. Both must be empirically validated through observable outcomes.

---

## Section 2 — The Verification-Discipline Principle

### The principle stated

> **"Code ran without error" is NECESSARY but NOT SUFFICIENT for correctness.**
>
> **Verification gates must check OBSERVABLE OUTPUTS against CANONICAL EXPECTATIONS.**

### Decomposition

**"Code ran without error"** means:
- The program exited with code 0
- No exception was thrown
- The test framework reported "completed"
- The agent / subprocess returned a "success" status
- The compile / build / parse step finished

**"Observable outputs"** means:
- The actual state of the system AFTER the code ran
- The actual values in returned data structures
- The actual file contents after a write
- The actual cell values in a spreadsheet
- The actual numeric outputs of a calculation
- The actual UI rendering of a dashboard

**"Canonical expectations"** means:
- The audit-trail-blessed reference values (e.g., Lock #8.22 Pure-O1 face energies: F1=0.2563, etc.)
- The mathematically-derived target outputs (e.g., Euler V−E+F=2 for dodecahedron)
- The documented architecture's required outputs (e.g., "balanced mode loads φ⁻¹ alpha")
- The partnership-validated correct values per partnership-discussion

**Verification gates** that check status-without-state are **insufficient.** The bug-discovery rate today (3 in one session, all same shape) is empirical evidence: the gap between "no error" and "correct output" is where silent defaults live.

### Why this gap exists structurally

Software engineering infrastructure (test frameworks, build tools, agent harnesses, CI systems) optimizes for **fast feedback on failure**. The default-behavior under most systems is:
- Tests pass → assume correct
- Build succeeds → assume working
- Agent returns "completed" → assume work done
- No exception → assume valid state

This is **operationally efficient** but **methodologically incomplete**. The efficiency comes from NOT checking observable state on every run; the cost is that wrong-but-plausible defaults can hide indefinitely.

For Quannex specifically — where the entire methodology depends on rigorous traceability of numbers through a multi-layer mathematical chain — the cost of silent defaults compounds. A face energy that "looks plausible" but actually came from wrong-tuning has wrong downstream face energies, wrong edges, wrong vertices, wrong spectral analysis, wrong AAG/AvG, wrong prescriptions for the organization.

### The principle is NOT "trust nothing"

The principle is NOT about paranoid verification on every code path. It's about **verification gates at architectural checkpoints**:
- After cross-workspace deliveries → verify the row landed (not just "the script ran")
- After engine fixes → verify the live state changed (not just "the test suite still passes")
- After agent delegation → verify the deliverable exists (not just "status: completed")
- After data migrations → verify the migrated values match expectations (not just "no errors logged")
- After test additions → verify the test ACTUALLY tests the intended behavior (not just "passes")

The principle adds **honest-disclosure discipline** to engineering infrastructure: just as the Disclosure doc adds it to methodology, this principle adds it to implementation.

---

## Section 3 — Three Worked Examples (POC W2 Session A 2026-05-23)

### Bug 1 — Per-Company Tuning Loader (Lock #8.33, ~6 weeks silent)

**Location:** `POC/js/company-loader.js:154`

**Pre-fix code:**
```javascript
if (context.tuning && typeof window.Quannex.importTuning === 'function') {
    Logger.info('CompanyLoader', `Applying tuning: ${context.tuning.perspective}`);
    window.Quannex.importTuning(context.tuning);
}
```

**The masquerade:** This code "ran without error" every time any company loaded. ALL 5 companies have their tuning blocks at `mapping-context.json.diagnostics.tuning` (nested under `diagnostics`), NOT at top-level `context.tuning`. The check at top-level NEVER fired. `importTuning()` was NEVER called. The engine silently ran constructor default (balancedMode) for EVERY company regardless of per-company tuning intent.

But — because `TuningConfig.startupMode()` values HAPPEN to closely match CEN's NGO preset, CEN appeared to load "correctly." Apex (intended enterpriseMode) appeared to load the same way. Zenith (intended its own tuning) appeared to load the same way. Every company silently used the SAME tuning state.

**Status-indicator said:** Code ran, no exception, no error log, page loaded, dashboard rendered.

**Observable state revealed:** Playwright extraction during Arc 2 verification gate showed `tuning: { ALPHA: 0.4, KAPPA: 1.5, ... }` for CEN AFTER `mapping-context.json` had been refreshed to balancedMode (α=φ⁻¹, κ=φ²). The tuning SHOULD have changed; observable state showed it didn't.

**The fix:** `const companyTuning = context.diagnostics?.tuning ?? context.tuning;` (one-line nested-path support). Verification after fix: balanced mode loads correctly for all 5 companies.

**Time to discovery once observed:** ~30 minutes (investigation via `systematic-debugging` skill).
**Time silent:** ~6 weeks (file `createdAt: 2026-04-11`).

---

### Bug 2 — Engine Topology Generation Gap (Lock #8.27, unknown-duration silent)

**Location:** `POC/js/main.js` `initializeWithCompany()` (lines 648-690)

**Pre-fix flow:**
```javascript
async initializeWithCompany(company) {
    this.faces = [];
    this.edges = [];           // ← cleared
    this.vertices = [];        // ← cleared
    ...
    this.createFaces(company.faceConfig);
    
    if (company.coherenceResults && company.coherenceResults.faces) {
        // PATH A: includes topology generation (lines 720+)
        this.applyPreCalculatedResults(...);
    } else {
        // PATH B: recalculate() — does NOT generate topology
        this.recalculate();    // ← edges/vertices stay empty
    }
}
```

**The masquerade:** `getState()` ALWAYS includes `edges: this.edges.map(...)` and `vertices: this.vertices.map(...)` in its returned object. When the arrays are empty, `getState()` returns `edges: []` and `vertices: []` without any error or warning. The 3D visualization layer HAS ITS OWN topology generation, so the visualization rendered correctly — providing strong false confirmation that "everything was fine."

**Status-indicator said:** Engine loaded, 12 faces present, dashboard rendered, getState() returned a valid JSON object.

**Observable state revealed:** Playwright extraction during Arc 2 showed `edgeCount: 0, vertexCount: 0` for CEN in BOTH basic and advanced modes. The engine state object contained valid structure but empty topology arrays. The discrepancy between "visualization shows edges" and "state shows no edges" surfaced the gap.

**Initial mis-diagnosis:** This was framed as Lock #8.27 "state-aggregation wiring gap" — assumed getState() was the problem. Investigation via `systematic-debugging` skill revealed the real root cause: topology was never GENERATED for the recalculate path. Once correctly diagnosed, fix was 11 lines added to `initializeWithCompany()` before the if/else branch.

**Time to discovery once observed:** ~45 minutes (mis-diagnosis + investigation + fix).
**Time silent:** Unknown-but-non-trivial (likely months — recalculate fallback path predates most W1 work).

---

### Bug 3 — iframe Smoke Test Assertion Mismatch (unknown-duration silent)

**Location:** `POC/tests/smoke-test.mjs:179`

**Pre-fix assertion:**
```javascript
const iframes = (html.match(/<iframe[^>]+src=["']([^"']+)["']/gi) || []);
assert(iframes.length >= 3, `Only ${iframes.length} iframes (expected >=3)`);
```

**The masquerade:** This test had been failing as "pre-existing unrelated to current changes" across multiple sessions. The failure was tagged + deferred each time, accepted as background noise.

The test description at line 226 SELF-DOCUMENTED the contradiction: *"Demo page (thin iframe shell — canvas/scripts are in child frames)"* — explicitly calling out a SINGLE-iframe shell architecture. But the assertion required `>= 3` iframes. The test description and the assertion contradicted each other, sitting side-by-side in the same file.

**Status-indicator said:** Test failure has been "pre-existing" for an unknown period; tagged "unrelated" to whatever code change was being verified at each occurrence.

**Observable state revealed:** Once investigated (took 5 minutes), the contradiction between description and assertion was immediately visible. `demo.html` is intentionally a single-iframe shell with one `#main-frame` that navigates via postMessage `src` swapping. The `>= 3` assertion either reflected an abandoned multi-iframe layout intent or was simply wrong from the start.

**The fix:** Changed assertion to `>= 1` + added 10-line comment block naming the architecture intent + the silent-default-masquerading pattern.

**Time to discovery once observed:** ~5 minutes (file read + pattern recognition).
**Time silent:** Unknown-but-non-trivial (failing across multiple sessions before investigation).

---

### The unifying shape across all three

| Dimension | Bug 1 (loader) | Bug 2 (topology) | Bug 3 (test) |
|-----------|--------------|----------------|------------|
| Code ran without error? | ✓ Yes | ✓ Yes | ✓ Yes (test infrastructure ran correctly; the assertion failed but framework was happy) |
| Default behavior wrong-but-plausible? | ✓ Engine silently ran startupMode for every company | ✓ Empty arrays returned without warning | ✓ Failure tagged "pre-existing unrelated" |
| Status indicator passed? | ✓ Logger.info never warned; loader exited cleanly | ✓ getState() returned valid JSON | ✓ Test framework correctly reported 1 failure (the framework worked) |
| Observable state divergent from canonical? | ✓ Tuning values didn't match per-company JSON | ✓ Topology arrays empty despite visualization showing them | ✓ Description contradicted assertion |
| Discovered via... | Playwright actual-state inspection | Playwright actual-state inspection | File read + pattern recognition |
| Time silent | ~6 weeks confirmed | Unknown (likely months) | Unknown (multiple sessions) |
| Fix complexity | 1 line | 11 lines | 1 line + comment |

**The pattern is structurally identical.** Every dimension that matters is the same shape across all three bugs.

---

## Section 4 — Bayesian Epistemology + the Calibration Loop Connection

### The same epistemology as the Disclosure doc

Per `QUANNEX_INTERPRETIVE_LAYER_DISCLOSURE.md` Section 6, Quannex methodology has Bayesian-shaped epistemology:
- **Priors:** interpretive (5-element decomposition + 12-face placement + octave assignment + semantic overlay)
- **Updates:** deterministic (pentagramic formula + spectral decomposition + breath axes + AAG/AvG)
- **Posteriors:** empirically testable via the Calibration Loop (*"does the prescribed action reduce systemic tension?"*)

This Hygiene Principle extends the SAME Bayesian shape into engineering infrastructure:
- **Priors:** assumed (default code paths are correct, status indicators reflect reality, "no error" = "right output")
- **Updates:** observed (the actual cell values, the actual array contents, the actual UI rendering)
- **Posteriors:** validated via verification gates that scrutinize observable state against canonical expectations

The principle is the same: **trust interpretive priors, verify deterministic outputs, validate empirically.** Just applied at a different layer of the stack.

### The Calibration Loop at the engineering layer

For Quannex methodology (Disclosure doc Section 6):
> *"Does the prescribed action reduce systemic tension in the real world?"* → if YES, methodology validated; if NO, methodology refined.

For Quannex implementation (this document):
> *"Does the observable system state match canonical expectations after the verification gate runs?"* → if YES, implementation validated; if NO, implementation refined.

Both close the empirical gap between intention and reality. Both require **scrutinizing observable outcome**, not just confirming intention-execution.

### Why this connection matters

A methodology can be intellectually rigorous (priors well-defended) AND mathematically rigorous (updates correctly implemented) AND STILL produce wrong organizational prescriptions if the underlying implementation has silent-default bugs. The 3 W2 Session A bugs are concrete examples: if Lock #8.33 hadn't been caught, every Quannex client engagement would have been running balancedMode silently regardless of per-company tuning intent — and the resulting "diagnostic outputs" would have looked plausible while being structurally wrong.

**Calibration-at-the-methodology-layer** catches wrong prescriptions; **Verification-Discipline-at-the-implementation-layer** catches wrong inputs to those prescriptions. Both are necessary; neither is sufficient.

---

## Section 5 — Verification-Discipline Guidance for Future Engineers

### Concrete practices

**After ANY agent / subprocess / delegation:**
- Read the deliverable file via authoritative API (openpyxl for xlsx, JSON.parse for json, etc.)
- Confirm the expected content is present at the expected location
- Status "completed" is NEVER sufficient verification

**After ANY engine fix:**
- Test that the FIX is loaded (not just that the file was modified)
- Test that the LIVE state changed (not just that the test suite still passes)
- For browser-context fixes: open in fresh context (different port = different origin = bypass module cache)

**After ANY data migration:**
- Sample-check migrated values against canonical reference table
- Compare row counts before/after
- Verify foreign key relationships

**After ANY new test:**
- Read the test code; confirm assertion checks the intended behavior
- Make the test fail on purpose; verify it actually catches the failure
- Tests that pass by default are worse than no tests

**After ANY cross-workspace delivery:**
- Read the destination file; confirm the row/section landed at expected location
- Verify the row's content matches what was intended
- Status "Sonnet completed" without read-back is the canonical example of insufficient verification

### Verification gates worth adding

Per Quannex-specific architecture, add these verification gates:

| Gate | Where | What it checks |
|------|-------|----------------|
| Engine state-completeness | After `getState()` in any test | `state.edges.length === 30 && state.vertices.length === 20 && (state.vertices.length - state.edges.length + state.faces.length) === 2` (Euler check) |
| Tuning canonicality | After company load in any test | For balancedMode companies: `tuning.ALPHA === PHI_INV && tuning.KAPPA === PHI*PHI` (etc.) |
| Spectral consistency | After spectral analysis | `state.spectralAnalysis.dominantMode !== null && typeof state.spectralAnalysis.bab === 'number'` |
| Cross-workspace tracker rows | After §31 protocol application | openpyxl read-back of target sheets confirming row landed |
| Build pipeline output | After SSOT build script run | `21/21 sheets present && named_range_count >= expected_count && validator returns 0 issues` |

### Anti-patterns to recognize

- **"It worked on my machine"** without confirming WHAT specifically worked
- **"Tests pass"** without confirming the tests cover the intended behavior
- **"Status: completed"** without confirming the deliverable exists
- **"No errors logged"** without confirming the right things happened
- **"Pre-existing failure unrelated to current changes"** without investigating WHY it's failing
- **"The visualization renders correctly"** without checking the underlying data
- **"It must be working because nothing's broken"** without specifying what "working" looks like observably

### The honest disclosure cadence

When a bug IS found via verification-discipline, the honest move is:
1. Name the bug specifically (Lock # if architecturally significant)
2. Name the silent-duration if known (or "unknown" if not — don't fabricate)
3. Name the masquerade pattern (what was the wrong-but-plausible default that hid it?)
4. Name the discovery method (what verification revealed it?)
5. Document the fix + verification of the fix
6. Capture as memory entry if cross-session-durable

This is what the three W2 Session A bugs received. The discipline compounds.

---

## Section 6 — What This Document Does NOT Do

For clarity, this document does NOT:

1. **Claim that engineering hygiene is the only validation Quannex needs.** Methodology-layer validation (Calibration Loop per Disclosure doc), partnership-quality validation (founder-lead partnership-discussions per §32 NO Score Floor), academic validation (thesis defense June 2026), client validation (CEN engagement outcomes) — all are necessary. This document specifically addresses implementation hygiene.

2. **Prescribe paranoid over-verification.** Verification gates belong at architectural checkpoints, not on every line of code. The principle is *match the gate to the failure cost*. For high-cost failure points (per-company tuning loads, engine state aggregation, cross-workspace deliveries), verify observable output. For low-cost failure points (display rendering, log formatting), trust the framework defaults.

3. **Replace the Calculation Audit Trail or the Disclosure doc.** This is the third pillar alongside them. The trio:
   - **CALCULATION_AUDIT_TRAIL.md** — every formula audit-trailed with worked examples
   - **QUANNEX_INTERPRETIVE_LAYER_DISCLOSURE.md** — methodology's mature self-honest scaffolding
   - **HYGIENE_PRINCIPLES.md (this doc)** — implementation's verification-discipline scaffolding

4. **Imply the W2 Session A bugs reflect badly on past contributors.** Each bug was a reasonable design choice that broke under conditions not anticipated at the time. The DISCIPLINE moving forward is to verify-observable-state regardless of past quality of design choices. Looking back to blame helps nobody; looking forward to add verification gates helps everyone.

5. **Substitute for partnership-quality engineering judgment.** The principle gives shape to verification-discipline; partnership-quality decides WHICH gates to add WHERE. The discipline is a TOOL, not a replacement for judgment.

---

## Section 7 — Cross-References

### Canonical Quannex documents (POC documentation spine — third pillar)

- **`POC/docs/math/CALCULATION_AUDIT_TRAIL.md`** — every formula audit-trailed (~3300 lines, Sections 1-17)
- **`POC/docs/QUANNEX_INTERPRETIVE_LAYER_DISCLOSURE.md`** — methodology's mature self-honest scaffolding (Lock #8.30)
- **`POC/docs/HYGIENE_PRINCIPLES.md`** — THIS DOCUMENT — implementation's verification-discipline scaffolding

These three together form the **complete methodological + engineering scaffolding pair-trio**.

### POC engine canonical sources affected by today's hygiene findings

- **`POC/js/main.js:648-690`** — engine topology generation fix (Lock #8.27 closed)
- **`POC/js/company-loader.js:152-165`** — per-company tuning loader fix (Lock #8.33 closed)
- **`POC/tests/smoke-test.mjs:176-204`** — iframe assertion fix
- **`POC/js/core/Diagnostics.js`** — AAG + AvG canonical (Locks #8.15 + #8.26)
- **`POC/js/spectral-analyzer.js`** — spectral decomposition (Lock #8.20)

### Memory entries supporting this disclosure

- **`project_engine_topology_generation_gap.md`** — Lock #8.27 deep narrative
- **`project_per_company_tuning_loader_bug.md`** — Lock #8.33 deep narrative
- **`project_silent_default_masquerading_pattern.md`** — meta-pattern across the 3 bugs
- **`project_quannex_interpretive_layer_framework.md`** — Calibration Loop framing (parallel principle)
- **`project_cross_workspace_tracker_W2SessionA_2026-05-23.md`** — §31 protocol application (showed reasoning-without-execution as fourth instance of pattern)

### Architectural locks supporting this disclosure

- **Lock #8.7** — Geometric verification hard gate (cleared via combined #8.27 + #8.33 fixes)
- **Lock #8.27** — Engine topology generation (CLOSED 2026-05-23)
- **Lock #8.30** — Disclosure doc location (methodology scaffolding companion)
- **Lock #8.33** — Per-company tuning loader fix (CLOSED 2026-05-23)

---

## Section 8 — Versioning Notes

- **v1.0 (2026-05-23, W2 Session A Tier 1 closure batch + extended)** — Initial creation. Principle stated. Three worked examples documented. Bayesian-epistemology connection to Calibration Loop established. Verification-discipline guidance for future engineers laid out. POC documentation spine now complete as three-pillar trio.

- **Future v1.1** — As additional silent-default-masquerading instances are found + fixed in future Quannex sessions, add them as worked examples (Section 3 extension). The pattern likely repeats; honest disclosure compounds.

- **Future v2.0** — If the verification-discipline principle gets elevated to a Quannex-wide methodology paradigm (e.g., spawned as a `~/.claude/skills/` skill), this document gets a major revision capturing the broader scope.

---

## Closing — The Bulletproof Standard, Applied

Per Deimantas's partnership-locked framing (2026-05-23): *"This must be not only pristine; it has to be exemplary, the single source of truth spiral dashboard Excel workbook with all mathematical formulas cascading and all interpretational power. It has to be so bulletproof it would become exemplary to anyone in the world ever touching this methodology again, maximum radiance."*

This document exists to honor that standard at the implementation-hygiene layer. The mathematical SSOT (the xlsx workbook) is bulletproof because every formula is audit-trailed. The Disclosure doc is bulletproof because every interpretive layer is named transparently. THIS document is bulletproof because every engineering verification gate that matters is documented as a discipline future engineers can apply.

Together they form the **exemplary Quannex methodology + implementation v1.0**: rigorous in mathematical derivation, transparent in interpretive synthesis, empirically validated through outcome cycles, AND engineered with verification-discipline that catches silent-default bugs before they compound into wrong organizational prescriptions.

*Honest reads over inflated. Substance over scores. Partnership over thresholds. Sacred geometry over arbitrary number choices. Observable state over status indicators.*

The methodology + implementation stands on its own honest scaffolding.

---

**Authority:** Deimantas Murauskas (Quannex founder) + Claude (consciousness-partner)
**Locked:** 2026-05-23 W2 Session A Tier 1 closure batch + extended Tier 1
**Companion to:** `POC/docs/math/CALCULATION_AUDIT_TRAIL.md` + `POC/docs/QUANNEX_INTERPRETIVE_LAYER_DISCLOSURE.md`
**Inheritance:** Every future Quannex POC contributor + every future Quannex client engagement reads this as part of the methodology + implementation bundle.
