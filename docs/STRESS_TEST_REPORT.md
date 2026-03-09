# Quannex Spectral Analyzer — Stress Test Report

**Date:** March 9, 2026
**Scope:** Mathematical integrity, informational representation, user journey
**Result:** All critical issues resolved. 15/15 math tests pass, 13/13 info tests pass, 9/9 journey tests pass.

---

## 1. Mathematical Integrity (15 Tests)

| # | Test | Result | Detail |
|---|------|--------|--------|
| T1 | Eigenvalues correct | PASS | 0 (×1), 5−√5 (×3), **6** (×5), 5+√5 (×3) |
| T2 | U matrix orthonormal | PASS | Max dot-product error < 0.002 |
| T3 | L×u = λ×u | PASS | Max error ~4.4e-15 (machine precision) |
| T4 | Parseval energy conservation | PASS | Energy sum in face space = modal space |
| T5 | Delta conservation (Σ Δ = 0) | PASS | Sum < 0.05 |
| T6 | BAB handles zero projection | PASS | Returns >100% (not 0%) |
| T7 | Uniform energy: no signal | PASS | All non-DC amplitudes ≈ 0 |
| T8 | All-zeros input: graceful | PASS | Returns valid result |
| T9 | Extreme values (0…1000) | PASS | No Infinity/NaN |
| T10 | Single-face redistribution | PASS | Delta negative for over-energized face |
| T11 | Wrong array length | PASS | Returns null |
| T12 | NaN input scrubbed | PASS | NaN → 0, no leakage |
| T13 | L matrix symmetric | PASS | L[i][j] = L[j][i] ∀ i,j |
| T14 | L row sums = 0 | PASS | All 12 rows sum to 0 |
| T15 | L matches canonical 30 EDGES | PASS | Every edge is −1, non-edges are 0 |

### Critical Fixes Applied

**1. Laplacian L matrix (all 3 copies)**
The old L encoded a different face numbering than the canonical EDGES topology in `dodecahedron-topology.js`. Rebuilt from the 30-edge list: `[1,2],[1,6],[1,7],[1,8],[1,10],…,[11,12]`.

**2. Eigenvector U matrix (all 3 copies)**
Recomputed via Jacobi eigendecomposition from the corrected L. Verified to machine precision (L×u = λ×u error ~4.4e-15). The old U was internally consistent with the old L (so Parseval/orthogonality passed) but mapped modes to the wrong organizational domains.

**3. Eigenvalues: 6, not 5**
The mid-frequency band eigenvalue is **6** (not 5). Derivation: the icosahedron adjacency matrix has eigenvalues {5, √5, −1, −√5}. The Laplacian L = 5I − A gives {0, 5−√5, 6, 5+√5}. This was wrong in all prior code and documentation.

**4. BAB division-by-zero (all 3 copies)**
When all projection (Action/Exhale) faces have zero energy but reception faces don't, BAB now returns Infinity/999% instead of incorrectly reporting 0%.

**5. Input validation (main analyzer)**
- Wrong array length → returns null
- NaN values → scrubbed to 0 with Logger warning

---

## 2. Informational Representation (13 Tests)

| # | Test | Result | Detail |
|---|------|--------|--------|
| IR-1 | All 7 sections present | PASS | A, B, C, D, E, E2, F all render |
| IR-2 | Column headers have tooltips | PASS | 30 headers with title attributes |
| IR-3 | Face cells have breath axis tooltips | PASS | 96 face cells with axis pair info |
| IR-4 | No stale eigenvalue=5 references | PASS | Clean |
| IR-5 | Eigenvalue 6 correctly shown | PASS | Regional(6) in labels and narrative |
| IR-6 | Band labels valid | PASS | 11 valid band labels |
| IR-7 | Mode tooltips present | PASS | 12 mode tooltips with names |
| IR-8 | Sensitivity matrix rendered | PASS | 13 rows (header + 12 faces) |
| IR-9 | Edge health tooltips | PASS | 33 edge cells with health state descriptions |
| IR-10 | Diagnostic KPI tooltips (AAG, BAB, Dissonance) | PASS | All 3 present with rich descriptions |
| IR-11 | No NaN/undefined/null in output | PASS | All sections clean |
| IR-12 | Narrative uses eigenvalue 6 | PASS | "6 (x5)" in spectral narrative |
| IR-13 | All 12 faces in Section A | PASS | F1–F12 all present |

---

## 3. User Journey (9 Tests)

| # | Test | Result | Detail |
|---|------|--------|--------|
| UJ-1 | Calculations page loads with data | PASS | 12 face cards, spectral analysis visible |
| UJ-2 | Eigenvalue λ=6 in calculations | PASS | In mode badge tooltips |
| UJ-3 | Mode badges with tooltips | PASS | 5+ mode badges with names + eigenvalues |
| UJ-4 | Face card expandable | PASS | Click expands KPI details |
| UJ-5 | No JS errors | PASS | Page renders without console errors |
| UJ-6 | Math formulas section | PASS | Coherence, Modal, BAB, Delta formulas |
| UJ-7 | Results summary loads | PASS | Title: "Coherence Report - Results Summary" |
| UJ-8 | No NaN/undefined in results | PASS | Clean output |
| UJ-9 | Thesis-export round-trip | PASS | Navigation successful |

---

## Files Modified

| File | Changes |
|------|---------|
| `js/spectral-analyzer.js` | L matrix, U matrix, eigenvalues (5→6), BAB fix, input validation |
| `js/spectral-analyzer-global.js` | L matrix, U matrix, eigenvalues (5→6), BAB fix |
| `js/advanced/spectral-analyzer.js` | L matrix, U matrix, eigenvalues (5→6), BAB fix |
| `pages/thesis-export.html` | Eigenvalue references 5→6 in labels, tooltips, narrative |
| `docs/SUB_RELATIONSHIP_DISCREPANCY_TRACKER.md` | Corrected eigenvalue documentation |

---

## Conclusion

The spectral analysis subsystem is now mathematically correct and fully aligned with the canonical dodecahedron topology. The Laplacian, eigenvectors, and eigenvalues are consistent across all 3 analyzer copies, and the user-facing information accurately reflects the underlying mathematics. All edge cases (zero input, NaN, extreme values, wrong dimensions) are handled gracefully.
