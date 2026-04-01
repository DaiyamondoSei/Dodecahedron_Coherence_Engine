---
name: thesis
description: Gather POC evidence for the thesis defense. Collects mathematical proofs, calculation audit trails, novel contributions, live engine output, test results, and architecture summaries. Creates a CrossWorkspaceUpdate memory entity so the Thesis workspace knows what's ready. Use when preparing thesis content or checking what the POC can currently prove.
---

# Thesis Evidence Gatherer

Collect and organize everything the POC can prove right now for the thesis defense. This skill does NOT write thesis chapters — it gathers evidence FROM the POC.

## Step 1: Mathematical Foundations

Read and summarize the current state of:

1. **`docs/math/SACRED_GEOMETRY_PROOF.md`** — What geometric claims are formally proven? What's still conjectural?
2. **`docs/math/CALCULATION_AUDIT_TRAIL.md`** — What calculations have a complete audit trail (input → formula → output)? This is critical for thesis defense — every number must be traceable.
3. **`docs/thesis/NOVEL_MATHEMATICAL_CONTRIBUTIONS.md`** — What does Quannex contribute that didn't exist before?

For each document, report:
- Status: Complete / In Progress / Needs Work
- Key claims that can be cited in the thesis
- Gaps that need filling before defense

## Step 2: Live Engine Evidence

Run the test suite to capture current engine capabilities:
```bash
node tests/run-all.js
```

Report:
- **Phi math tests** (tests/phi-math.test.js): X/127 passing — proves the mathematical constants are correct
- **Integration tests** (tests/integration.test.mjs): X/55 passing — proves the full pipeline works (CSV → engine → coherence scores)
- **Excel parser tests** (tests/excel-parser.test.mjs): X/42 passing — proves real-world data ingestion works
- **Smoke tests** (tests/smoke-test.mjs): X/77 passing — proves all pages render correctly

Any failures should be flagged as thesis risks.

## Step 3: Architecture Mapping

Scan the codebase to summarize how theory became code:

| Theoretical Concept | Implementation | File |
|---------------------|---------------|------|
| 12 Dodecahedron Faces | `Face` class, 5-element pentagram | `js/core/Face.js` |
| 30 Edges | `Edge` class, tension calculation | `js/core/Edge.js` |
| 20 Vertices | `Vertex` class, vortex energy | `js/core/Vertex.js` |
| 5-Pass Calculation Pipeline | `DodecahedronEngine.recalculate()` | `js/main.js` |
| Spectral Decomposition | `SpectralAnalyzer` (Laplacian eigenvectors) | `js/advanced/spectral-analyzer.js` |
| Breath Axes | `BreathAnalyzer` (log-phi ratio) | `js/breath-analyzer.js` |
| Shadow Detection | `ShadowDetector` (6 patterns) | `js/advanced/shadow-detector.js` |
| PHI Constants | `PhiHarmonics` | `js/constants/phi-harmonics.js` |
| 7 Octaves | Octave system | `js/orchestrator/dashboard/octave-system.js` |
| 3D Visualization | Three.js dodecahedron | `pages/dodecahedron-3d.html` |

Verify each file exists and the class/function is present. Flag any theory-to-code gaps.

## Step 4: Company Template Evidence

Check how many company templates demonstrate the engine's versatility:
- List all directories under `companies/`
- For each: does it have company.json + kpis.csv + mapping-context.json?
- Can the engine load and calculate coherence for each? (check for any known issues)

This demonstrates the thesis claim that the model is generalizable, not just fitted to one case.

## Step 5: Evidence Summary

Output a structured report:

```
## POC Evidence Summary for Thesis

### Ready to Cite (strong evidence)
- [list of claims with supporting test counts and file references]

### Needs Strengthening (evidence exists but incomplete)
- [list with what's missing]

### Not Yet Provable (gaps)
- [list of thesis claims that need more POC work]

### Test Coverage
- Phi Math: X/127
- Integration: X/55
- Excel Parser: X/42
- Smoke: X/77
- Total: X/301

### Company Templates: X templates loaded successfully

### Recommendation
[What should be prioritized next to strengthen the thesis evidence base]
```

## Step 6: Cross-Workspace Update

Create a memory entity so the Thesis workspace session can pick up this evidence:

```
Create entity: CrossWorkspaceUpdate-POC-Evidence-{date}
Type: CrossWorkspaceUpdate
Observations:
- Summary of what's ready
- Key test counts
- Any critical gaps found
```

Connect it to the Quannex-Vision entity if it exists.
