# CEN SSOT — Mode 5 Deep Interpretation

> *Spectral interpretation of CEN's dominant regional-cluster mode at lambda=6*
> *Date: 2026-05-22 · Workspace: Final Thesis · Session purpose: SSOT depth on spectral layer*
> *Locks referenced: #8.20 (dominantMode provenance) · #8.22 (pure-O1 face energies) · #8.24 (Bi-Directional)*

---

## TL;DR

CEN's canonical engine output dominantMode=5 belongs to the lambda=6 multiplicity-5 eigenvalue band — the regional-cluster band. This document interprets what that mode *means* for CEN specifically: which faces form the regional cluster, what the modal amplitude `a_5 = U[:,4]^T E` evaluates to under the pure-O1 face energies (Lock #8.22), what single-face energy adjustment would most reduce |a_5|, and what edges/vertices most contribute to Mode 5 reduction under Lock #8.24's bi-directional architecture. The Mode 5 finding is the academically-richest part of the SSOT — it grounds organizational coherence in Graph Laplacian decomposition with explicit phi connection (lambda=6 sits at the harmonic midpoint between lambda=2(3-phi) and lambda=2(2+phi)).

---

## Section 0 — Framing

### 0.1 Mode 5 as regional-cluster eigenvector

The dodecahedral face-adjacency Laplacian L (12x12, derived from the icosahedral edge graph) has analytical eigenvalues `{0, 5-sqrt(5), 6, 5+sqrt(5)}` with multiplicities `{1, 3, 5, 3}`. The lambda=6 band (5-dimensional eigenspace) sits between the global-imbalance band (lambda=2.764, three modes) and the fine-grained dissonance band (lambda=7.236, three modes). Per `POC/js/spectral-analyzer.js:55-57`, the 5 lambda=6 modes are interpreted as **regional patterns — clusters of 3-5 faces** that oscillate as a sub-structure of the dodecahedron.

Mode 5 (1-indexed, corresponding to column index 4 in the U matrix) is the first of these five lambda=6 modes. The mode-number assignment is partly arbitrary (any orthonormal basis of the lambda=6 eigenspace would work), but the specific column 4 of U as hardcoded in `spectral-analyzer.js:140-154` is the canonical basis the POC engine reports against.

### 0.2 Distinguish Mode 5 from Mode 10 (narrative pointer)

Per Lock #8.20 (POC SSOT Consolidation Map): the integer `10` recorded in `companies/cen/mapping-context.json:dominantMode` is **NOT a spectral eigenvalue index**. It is a narrative-scaffolding pointer to **face F10 (Foundational Values — CEN's spotlight face)**. The audit-trail provenance investigation (CALCULATION_AUDIT_TRAIL.md Section 13, lines 1367-1450) ran the engine across multiple input vectors and confirmed: **no input vector reproduces dominantMode=10 from the canonical engine.** The closest engine output for CEN's canonical O1 inputs is dominantMode=5.

This distinction matters because Mode 10 (column index 9) — if interpreted as a real spectral mode — would belong to the lambda=7.236 fine-grained band, an entirely different geometric class (local pairwise dissonance, not regional clusters). The narrative scaffolding "10" and the spectral "5" are not in conversation with each other; they are different layers conflated by an earlier templating choice. Lock #8.20 separates them: rename the template field `dominantMode` to `dominantFace`, and let the spectral analyzer own the `dominantMode` namespace.

### 0.3 The puzzle this document answers

> *Which 3-5 faces form Mode 5's regional cluster for CEN, and what does Mode 5's amplitude reveal about CEN's highest-leverage intervention point?*

The puzzle decomposes:
1. **Geometric class:** what faces does Mode 5's eigenvector positively/negatively weight?
2. **CEN-specific amplitude:** what is `a_5 = U[:,4]^T E` under Lock #8.22 face energies?
3. **Intervention:** which single `delta_E_i` most reduces |a_5|?
4. **Bi-Directional projection:** which edges/vertices most carry Mode 5's signature?
5. **Defense angle:** why this is committee-defensible spectral graph theory.

---

## Section 1 — Mode 5 Mathematical Structure

### 1.1 The U[:,4] eigenvector (column 5 in 1-indexed reading, column 4 in 0-indexed code)

From `POC/js/spectral-analyzer.js:142-153`, the Mode 5 column of the U matrix BEFORE normalization is:

| Face | Mode 5 coefficient U[i][4] |
|------|----------------------------|
| F1   | -0.521268                  |
| F2   |  0.002974                  |
| F3   |  0.470089                  |
| F4   |  0.044295                  |
| F5   |  0.002974                  |
| F6   | -0.049607                  |
| F7   |  0.053517                  |
| F8   |  0.470089                  |
| F9   | -0.521268                  |
| F10  |  0.044295                  |
| F11  |  0.053517                  |
| F12  | -0.049607                  |

After the `normalizeEigenvectors()` pass (subtract column mean to enforce orthogonality to the lambda=0 DC mode), each entry shifts by approximately -0.00006 (the column mean is very near zero by construction), so the structural pattern is preserved. The interpretation below uses pre-normalization values; the post-normalization shift is negligible for sign and magnitude reasoning.

### 1.2 The pattern: paired antipodal opposition

Reading the structure: **two strong-positive faces (F3, F8 at +0.470) opposed by two strong-negative faces (F1, F9 at -0.521)**, with a band of near-zero faces (F2, F4, F5, F6, F7, F10, F11, F12 all between -0.05 and +0.06). This is a 4-face regional cluster — exactly within the lambda=6 "clusters of 3-5 faces" interpretation.

Geometrically on the dodecahedron:
- **F1 and F9** are NOT directly adjacent in the face-adjacency graph (check `spectral-analyzer.js:112-123`: F1's neighbors are {2,6,7,8,10}; F9's neighbors are {3,4,5,11,12}). F1 and F9 are at structural distance 2 — they form an antipodal-ish pair on opposite hemispheres.
- **F3 and F8** are similarly NOT directly adjacent (F3 adj {2,4,6,9,11}; F8 adj {1,5,7,10,12}). F3 and F8 are also at structural distance 2, antipodal-ish.
- **The pair (F1,F9) opposes the pair (F3,F8)**: this is a "two-axis seesaw" — two antipodal pairs on roughly perpendicular axes of the dodecahedron, oscillating against each other.

This is precisely the kind of structure the lambda=6 (regional) band encodes: a sub-structural oscillation that does not span the whole graph (which would be lambda=2.764 / global) and does not sit on single edges (which would be lambda=7.236 / fine-grained), but rather couples two distant face-pairs through the intermediate connective tissue.

### 1.3 What "highest-leverage harmonization" means for Mode 5

If CEN's energy vector E has a non-zero projection onto U[:,4], that projection `a_5` measures how much of CEN's current imbalance is "shaped like" the F3+F8 vs F1+F9 seesaw. Reducing |a_5| to zero means: **bringing F3+F8 and F1+F9 into balance with each other** (subject to the sign of a_5, you either need to lower the high pair / raise the low pair, or vice versa).

The "highest-leverage" framing means: of all the modes the energy vector E projects onto, Mode 5 has the largest projection (Lock #8.20 + audit Section 13 confirm this for CEN's canonical inputs). So an intervention that reduces |a_5| reduces *more* dissonance per unit-of-energy-shift than any other mode-aligned intervention would. This is the spectral analog of "find the resonant frequency of the system's wobble and damp it."

---

## Section 2 — CEN-Specific Mode 5 Contribution

### 2.1 Computing a_5 for CEN's canonical pure-O1 face energies

The pure-O1 face energies per Lock #8.22:

| Face | Energy E_i | Band     |
|------|-----------|----------|
| F1   | 0.2563    | Gate     |
| F2   | 0.1192    | Wall     |
| F3   | 0.1192    | Wall     |
| F4   | 0.1349    | Wall     |
| F5   | 0.1349    | Wall     |
| F6   | 0.1523    | Gate     |
| F7   | 0.1192    | Wall     |
| F8   | 0.1192    | Wall     |
| F9   | 0.1192    | Wall     |
| F10  | 0.1192    | Wall     |
| F11  | 0.1192    | Wall     |
| F12  | 0.1523    | Gate     |

The modal amplitude formula: **a_5 = sum_i U[i][4] * E_i**

Computing term-by-term using the pre-normalization U[:,4] (post-normalization shift is ~0.00006 per term, negligible at 4 decimals for the cumulative sum):

| Face | U[i][4]    | E_i      | Contribution U[i][4]*E_i |
|------|-----------|----------|--------------------------|
| F1   | -0.521268 | 0.2563   | -0.13360                 |
| F2   |  0.002974 | 0.1192   | +0.00035                 |
| F3   |  0.470089 | 0.1192   | +0.05603                 |
| F4   |  0.044295 | 0.1349   | +0.00598                 |
| F5   |  0.002974 | 0.1349   | +0.00040                 |
| F6   | -0.049607 | 0.1523   | -0.00755                 |
| F7   |  0.053517 | 0.1192   | +0.00638                 |
| F8   |  0.470089 | 0.1192   | +0.05603                 |
| F9   | -0.521268 | 0.1192   | -0.06213                 |
| F10  |  0.044295 | 0.1192   | +0.00528                 |
| F11  |  0.053517 | 0.1192   | +0.00638                 |
| F12  | -0.049607 | 0.1523   | -0.00755                 |

**Sum: a_5 = -0.07400** (approximately; final digit subject to rounding accumulation across 12 terms)

The sign is **negative**, indicating CEN's current energy distribution **opposes** the U[:,4] direction. Specifically: F1 (a negative-coefficient face in the eigenvector) is the highest-energy Gate face (0.2563), so its negative contribution (-0.134) dominates the sum even though F3+F8 contribute +0.112 in the opposite direction.

### 2.2 Interpreting |a_5| ≈ 0.074

This is a *moderate* amplitude. By comparison, if all 12 face energies were uniform (E_i = mean = ~0.137 for all i), every modal amplitude except a_0 would be exactly zero (because U[:,m] for m>=1 is orthogonal to the constant vector after normalization). So |a_5|=0.074 measures CEN's *deviation from uniform face energy* in the specific direction of the F3+F8 vs F1+F9 seesaw.

To check whether Mode 5 is genuinely dominant or whether other modes carry comparable amplitude, the full a_m vector would need to be computed. The audit trail provenance investigation (Section 13) reports dominantMode=5 for CEN's pure-O1 canonical inputs, so by construction |a_5| > |a_m| for all m != 5, m != 0. The absolute value 0.074 sets the baseline for what an intervention must shift.

### 2.3 The sign-direction reading

`a_5 < 0` means CEN's energy is shaped *opposite* the U[:,4] direction. The Delta vector formula `Delta = -U[:,4] * a_5` therefore produces:

- For faces with negative U[i][4] (F1, F9, F6, F12): `Delta_i = -(negative)*(negative) = -positive`, meaning **REDUCE energy** at F1, F9 (and small reductions at F6, F12).
- For faces with positive U[i][4] (F3, F8 strongly; F4, F7, F10, F11 weakly): `Delta_i = -(positive)*(negative) = +positive`, meaning **ADD energy** at F3, F8 (and small additions at F4, F7, F10, F11).
- Near-zero U[i][4] faces (F2, F5): essentially untouched.

This is the **spectral prescription**: lower F1 (and F9 to a lesser degree), raise F3 and F8. The next section translates this from energy-space back to KPI-space.

---

## Section 3 — Highest-Leverage Action

### 3.1 The single-delta question

Deimantas's stated intent: *"the whole idea of the spectral decomposition is to have one single highest leverage action that would have the highest impact on harmonizing the geometry."*

Formally: which single face energy adjustment `delta_E_i` (with magnitude bounded — say |delta_E_i| <= 0.05 to remain in plausible KPI-shift territory) produces the largest reduction in |a_5|?

The sensitivity is: `d(a_5)/d(E_i) = U[i][4]`. So per-unit energy change at face i moves a_5 by exactly U[i][4]. The largest-magnitude coefficients in U[:,4] are at F1 and F9 (both ~0.52), then F3 and F8 (both ~0.47). Since `a_5 < 0`:

- **Reducing E_1 by delta** changes a_5 by `-(-0.521)*(-delta) = -0.521*delta`. To move a_5 toward zero (from -0.074 toward 0, i.e., +0.074), reducing E_1 *adds* a positive amount to a_5. So **reducing F1 reduces |a_5|**.
- **Increasing E_3 by delta** changes a_5 by `+0.470*delta`. To move a_5 toward zero, increasing E_3 adds positive — so **raising F3 reduces |a_5|**.
- F8 raise: same magnitude as F3 raise (+0.470).
- F9 reduction: same magnitude as F1 reduction (-0.521).

### 3.2 The single highest-leverage move

F1 has the largest |U[i][4]| at 0.521. F1 also currently sits at energy 0.2563 — the highest face energy in the system (it is the most concentrated Gate face). **Reducing F1's energy** is therefore the single highest-leverage action on Mode 5.

But this framing requires nuance:
- **F1 is "Financial Resource Health"** per the CEN mapping context's face list (id:1 from the JSON, the "Financial" / "Resource" domain).
- The pure-O1 face energy 0.2563 is high *because* F1 has a strong base, not because it should be reduced as a target.
- "Reducing F1" in KPI terms means *not lowering the actual KPI values* (that would worsen organizational health) but rather *focusing investment energy elsewhere* — i.e., bringing F3 and F8 up to match F1's strength, which has the same mathematical effect on a_5 because it's the *ratio* across the eigenvector pattern that matters.

The mathematically-equivalent and operationally-sensible move: **raise F3 and F8** (the positive-coefficient pair).

### 3.3 What F3 and F8 are (per mapping-context.json)

Looking at the CEN face KPI definitions and the Lock #8.22 banding (F3 and F8 are both Walls):

- **F3 = "Human Capital / Founder Energy"** (the founder-energy face per the CEN mapping context; the F3 emergent edges like E3-4 "Founder-Structure Interface" and E3-11 "Founder-Funder Resonance" confirm this is the founder-bandwidth face).
- **F8 = "Operations / Operational Delivery"** (per F8's emergent edges: E1-8 "Operations-Finance Flow", E7-8 "Brand-Operations Coherence", E8-10 "Operations-Values Integrity").

Both are at Wall energy (0.1192) — the floor band. Spectral analysis is telling us: **CEN's highest-leverage harmonization is to invest energy into Founder Capacity (F3) AND Operations (F8) together**. Doing both simultaneously is the Mode 5 prescription because Mode 5's eigenvector treats them as a coupled pair (both at +0.470, identical magnitude and sign).

### 3.4 Why "AND" not "OR"

If only F3 were raised, the F3 contribution to a_5 would rise but F8 would remain at the floor — partially closing the Mode 5 gap. If only F8 were raised, same partial effect. Both faces have identical coefficients in U[:,4], so raising them together (in equal energy increments) **doubles the rate of |a_5| reduction** per unit total energy spent compared to raising just one.

This is a non-obvious organizational insight that the spectral decomposition surfaces: **F3 (Founder Energy) and F8 (Operations) are spectrally coupled — investing in one without the other leaves dissonance on the table.**

### 3.5 Cross-reference to KPI-level intervention

Per `companies/cen/mapping-context.json:138-176`, the F3 and F8 emergent edges name what the KPI-level moves look like:
- **F3 axis:** E3-4 (Founder-Structure Interface), E3-9 (Human-Regenerative Coherence), E3-11 (Founder-Funder Resonance) all sit near tension 0.0-0.05 — meaning F3's adjacent edges are *currently low-tension*, so KPI investments in founder-energy KPIs should not destabilize neighboring faces.
- **F8 axis:** E1-8 (Operations-Finance Flow, tension 0.05), E7-8 (Brand-Operations Coherence, tension 0.10), E8-10 (Operations-Values Integrity, tension 0.55) — the E8-10 high tension warns that raising F8 without simultaneously addressing F10 (Foundational Values) coherence will create operations/values drift.

The Mode 5 prescription is therefore **conditionally clean**: it advises a paired F3+F8 lift, with a watchpoint on E8-10 (the values-operations interface) to prevent the lift from creating new bilateral tension at the F8-F10 edge.

---

## Section 4 — Bi-Directional Implications (per Lock #8.24)

### 4.1 The architectural frame

Lock #8.24 (Bi-Directional Co-Evolution) decomposes intervention into:
- **Forward math:** elements -> faces -> edges/vertices (unchanged from current engine).
- **Backward intervention:** each edge carries a 10-tuple of Elemental Influence Signatures (weights summing to 1.0 per face, expressing which of F_a's 5 elements feed E_{a,b} vs which of F_b's 5 elements feed it). Each vertex carries a 15-tuple (3 faces × 5 elements).

The Mode 5 spectral signal lives in face-space (E_i values for each of 12 faces). Translating Mode 5 into edge-space and vertex-space asks: **which edges and vertices most strongly carry the F3+F8 vs F1+F9 oscillation?**

### 4.2 Edges that span Mode 5's high-magnitude faces

The 30-edge dataset (CEN_30Edge_Dataset_s58_2026-05-16.md, accessed via filesystem reference; full computation requires reading that dataset, which is outside this document's immediate context) catalogs which edges connect which face pairs. From the mapping-context.json snippet visible to this analysis, the Mode-5-relevant edges (those that touch F1, F3, F8, or F9 with non-trivial U[i][4] weight) include:

- **E1-2, E1-6, E1-7, E1-8, E1-10:** F1's five adjacent edges — all carry F1's strong-negative Mode 5 weight. E1-8 is the *crucial* one because it connects two Mode 5 active faces (F1 -0.521 and F8 +0.470 — opposite signs, so this edge carries the strongest seesaw tension across the eigenvector). E1-8 is "Operations-Finance Flow" — exactly the edge the spectral layer would flag as the highest-tension Mode 5 carrier.
- **E2-3, E3-4, E3-6, E3-9, E3-11:** F3's five adjacent edges — all carry F3's strong-positive weight. None of these connect to F8 or F9 directly, so they're "single-ended" Mode 5 carriers (only one side of the pair).
- **E8-9, E8-10, E8-12, E1-8, E5-8, E7-8:** F8's five adjacent edges. E5-8 has both faces near-zero in U[:,4] (F5 at 0.003, F8 at +0.470), so E5-8 is a one-ended carrier. E1-8 is again the double-ended carrier.
- **E9-10, E9-11, E9-12, E3-9, E4-9, E5-9:** F9's five adjacent edges. E3-9 connects F3 (+0.470) to F9 (-0.521) — another *double-ended* Mode 5 carrier with opposite signs.

**The two double-ended Mode 5 carrier edges are E1-8 and E3-9.** These edges carry the seesaw tension across the eigenvector and are the highest-leverage edges in the bi-directional framework for Mode 5 reduction.

Worth noting honestly: a *quantitative* ranking of all 30 edges by their Mode 5 contribution would require running the elemental-signature decomposition through the per-edge 10-tuples — a computation that the 30-edge dataset supports but which is not executed inline in this document. The qualitative ranking (E1-8 and E3-9 as the two double-ended carriers, then F1's other four adjacencies + F3's + F8's + F9's as single-ended carriers) is robust without that computation.

### 4.3 Vertices that anchor Mode 5

A vertex V_{a,b,c} carries Mode 5 weight equal to U[a][4] + U[b][4] + U[c][4] (with appropriate signs — three faces summed at the vertex). The vertices that maximize |U[a][4] + U[b][4] + U[c][4]| are those that concentrate multiple high-magnitude Mode 5 faces.

From the 20-vertex dataset:
- Vertices touching F1 + F8: would carry U[F1][4] + U[F8][4] + (third face). F1+F8 alone = -0.521 + 0.470 = -0.051. If the third face is F2 (~0) or F5 (~0), the vertex carries a near-zero net Mode 5 weight despite touching two high-magnitude faces (because of sign cancellation).
- Vertices touching F1 + F9: F1 + F9 = -0.521 + -0.521 = -1.042 (same-sign reinforcement). A vertex touching both F1 and F9 would be a strong Mode 5 anchor — but F1 and F9 are *not adjacent* in the face graph, so no vertex touches both simultaneously (vertices in the dodecahedron face graph are 3-face intersection points, requiring all three to be mutually adjacent).
- Vertices touching F3 + F8: similarly same-sign positive reinforcement (+0.940). F3 and F8 are also non-adjacent.

The structural constraint (Mode 5's high-magnitude same-sign face pairs are non-adjacent) means **no single vertex carries the doubled same-sign Mode 5 weight**. The strongest single-vertex Mode 5 anchors are those that combine a high-magnitude face with two near-zero faces — e.g., a vertex touching F1, F2, F10 would carry |U[F1][4] + U[F2][4] + U[F10][4]| = |-0.521 + 0.003 + 0.044| ≈ 0.474.

This is a real-and-interesting structural finding: **Mode 5 lives more cleanly in edge-space than in vertex-space** because the eigenvector pattern is built from non-adjacent same-sign pairs, which the 3-face vertex geometry cannot cleanly capture but the 2-face edge geometry (especially the cross-sign edges E1-8 and E3-9) can.

### 4.4 KPI-level read-out via the bi-directional framework

Combining: the **two edges E1-8 and E3-9 are the highest-leverage bi-directional Mode 5 intervention points**. In KPI terms:
- E1-8 = "Operations-Finance Flow." Intervention: KPIs that strengthen operational financial discipline (cost-per-output, runway tracking, financial reporting cadence) directly attack Mode 5's largest single-edge contribution.
- E3-9 = "Human-Regenerative Coherence." Intervention: KPIs that link founder energy to regenerative practice (founder-burnout protocols, regenerative-leadership metrics).

These two KPI clusters, *as a paired intervention*, would harmonize CEN's Mode 5 oscillation more efficiently than face-level interventions alone — because edge-level moves shift two faces simultaneously rather than one.

---

## Section 5 — Thesis Defense Angle

### 5.1 Why Mode 5 is committee-defensible

The dodecahedral Graph Laplacian decomposition is the **most academically-rigorous** layer of the entire CEN coherence engine. It draws on:
- **Fan Chung's Spectral Graph Theory (1997)** — canonical reference for this math.
- **Fiedler (1973)** "Algebraic connectivity of graphs" — the lambda_2 value (here 5-sqrt(5) ≈ 2.764) is the Fiedler value of the dodecahedral face graph, a published spectral graph constant.
- **Analytical eigenvalues with closed-form phi connection:** lambda = 0, 5-sqrt(5), 6, 5+sqrt(5). Note that 5-sqrt(5) = 2(3-phi) and 5+sqrt(5) = 2(2+phi) where phi = (1+sqrt(5))/2. This is not an artifact of the engine; it is a property of the icosahedral symmetry group acting on the face graph. A defense committee can verify these eigenvalues independently (Mathematica, NumPy, by hand for the Cayley graph) — they will reproduce.

The Mode 5 finding (regional-cluster oscillation at lambda=6) is therefore not "the engine is opinionated about CEN" but rather "given the dodecahedral topology and CEN's measured face energies, the Graph Laplacian mathematics produces this specific dominant mode." Committee scrutiny strengthens this rather than weakening it.

### 5.2 What the defense should foreground

Three specific committee-facing claims:
1. **The math reproduces.** The 12×12 Laplacian is built from canonical EDGES topology (`POC/js/dodecahedron-topology.js`), eigenvalue decomposition is verifiable, modal amplitude is `a = U^T E` — every step is open-source-readable.
2. **The dominantMode=5 finding for CEN's canonical pure-O1 face energies is not an accident.** The provenance investigation (CALCULATION_AUDIT_TRAIL.md Section 13) explicitly tested whether any input vector reproduces the historic dominantMode=10 stored in mapping-context.json. **No vector does.** The canonical engine output is dominantMode=5. The historic "10" is narrative scaffolding (Lock #8.20).
3. **The Mode 5 prescription (raise F3+F8) maps to organizationally sensible KPI interventions** (founder energy + operational delivery). The math does not contradict managerial common sense — it sharpens it by specifying that F3 and F8 should move *together* and naming the watchpoint (E8-10 values-operations tension).

### 5.3 What is bachelor's-defensible vs master's-scope

**Bachelor's-defensible (this document's scope):**
- The Mode 5 = lambda=6 regional-cluster identification.
- The U[:,4] eigenvector interpretation as F3+F8 vs F1+F9 seesaw.
- The single-action highest-leverage move (raise F3+F8).
- The qualitative bi-directional projection to edges E1-8 and E3-9.

**Master's-scope (flagged honestly, not undertaken here):**
- Quantitative ranking of all 30 edges by Mode 5 contribution via the elemental-signature 10-tuples (Lock #8.24 backward math). This requires the bi-directional dataset to be fully populated and validated.
- Sensitivity analysis: how robust is dominantMode=5 to small perturbations in face energies? At what delta does the dominant mode shift to another lambda=6 mode (Mode 4, 6, 7, or 8) or to a lambda=2.764 global mode?
- Multi-mode integration: the engine already has `calculateMultiModeDeltaVector` (spectral-analyzer.js:284-323) which combines corrections across all significant modes. A master's-scope analysis would derive the optimal intervention under this multi-mode framework rather than the single-mode (Mode 5 only) framing used here.
- Time-series spectral analysis: how does CEN's dominant mode shift across measurement cycles? Mode 5 today; what next quarter?

### 5.4 Closing reflection

Mode 5 is the *crown jewel* of CEN's spectral diagnostic — not because it is the only insight the engine produces, but because it converts a 12-dimensional organizational-energy problem into a single coherent geometric statement: *CEN's biggest internal oscillation is a Founder/Operations vs Finance/Regeneration seesaw, dampable by paired investment at F3 and F8.* This is the kind of finding that a defense committee can verify mathematically AND a CEO can act on operationally — and that intersection is the thesis's defensibility center.

---

## Provenance + Locks Referenced

- **Lock #8.20** (POC SSOT Consolidation Map): `mapping-context.json:dominantMode` is narrative scaffolding to face F_n, NOT spectral eigenvalue index. CEN's canonical engine dominantMode=5 (regional-cluster band).
- **Lock #8.22** (POC SSOT Consolidation Map): canonical pure-O1 face energies — F1=0.2563 Gate, F6=F12=0.1523 Gate, F4=F5=0.1349 Wall, F2=F3=F7=F8=F9=F10=F11=0.1192 Wall. Band: 9 Wall + 3 Gate + 0 Membrane.
- **Lock #8.24** (POC SSOT Consolidation Map): Bi-Directional Co-Evolution architecture — forward math unchanged; backward intervention via per-edge 10-tuples + per-vertex 15-tuples of Elemental Influence Signatures.
- **Source files referenced:**
  - `POC/js/spectral-analyzer.js:140-154` (U matrix, Mode 5 column = column index 4)
  - `POC/js/spectral-analyzer.js:55-57` (mode interpretation comments)
  - `POC/docs/math/SPECTRAL_IMPLEMENTATION.md` (parallel doc, superseded by audit Section 13)
  - `POC/docs/math/CALCULATION_AUDIT_TRAIL.md` Section 13 lines 1367-1450 (provenance investigation confirming dominantMode=5 for CEN's canonical inputs and ruling out dominantMode=10 as engine output)
  - `POC/companies/cen/mapping-context.json:138-176` (CEN's 30-edge dataset with emergent names + KPI questions + tension values)

---

## ADDENDUM — Mode 5 Robustness at κ=φ² Canonical (added 2026-05-24)

### Context

This document was originally computed using **κ=4 face energies** (Lock #8.22 v1 baseline: F1=0.2563, F2-F11=0.1192 Wall floor, F4/F5=0.1349, F6/F12=0.1523). Subsequently:

- **2026-05-23 W2 Session A** discovered the κ-band coupling finding via hygiene-discipline verification of Sheet 04.
- **2026-05-24 morning** resolved via **Option E (trust the geometry fully)**: κ=φ² is geometrically derived from the dodecahedral Laplacian spectrum polarity ratio (5+√5)/(5−√5) = φ² (Lock #8.35). New canonical face energies at κ=φ²: F1=0.3324, F2-F11=0.2127, F4/F5=0.2286, F6/F12=0.2453 (Lock #8.22 v2 baseline).

The natural second-order question (Resolution Analysis §5 Q3): **Does Mode 5 remain CEN's dominant spectral mode at the new κ=φ² canonical baseline?**

### Answer: YES — Mode 5 is geometrically robust across the κ shift

Modal amplitudes computed analytically using U[:,4] (κ-independent, purely geometric):

| Metric | κ=4 baseline (v1) | κ=φ² baseline (v2) | Change |
|--------|-------------------|--------------------|--------|
| **a_5** (signed) | −0.07401 | **−0.06488** | −0.00913 |
| **\|a_5\|** (magnitude) | 0.07401 | **0.06488** | −12.3% |
| **Dominant non-DC mode** | Mode 5 (λ=6, regional) | **Mode 5 (λ=6, regional)** | **PRESERVED** ✓ |
| **Sign of a_5** | negative | negative | same |
| **Modal ranking (top 5)** | 5, 10, 3, 11, 2 | **5, 10, 3, 11, 1** | top-4 preserved |

### What this means — all structural findings HOLD VERBATIM at κ=φ²

1. **The paired antipodal seesaw** (F3+F8 at +0.470 vs F1+F9 at −0.521 with 8 near-zero faces) is a property of U[:,4] — purely geometric, κ-independent. Same eigenvector, same structural pattern.
2. **CEN's a_5 sign** stays negative (F1's energy dominance still over-rides F3+F8's positive contribution, just with gentler magnitudes).
3. **Highest-leverage prescription** remains: **raise F3 + F8 paired** (they share the +0.470 coefficient, spectrally coupled). Per-unit sensitivity `d(a_5)/d(E_i) = U[i][4]` unchanged.
4. **Carrier-edge identification** (E1-8 + E3-9 as the two Mode 5 carrier edges with double-ended opposite-sign weight) is identical.
5. **Mode 5 = edge phenomenon (not vertex phenomenon)** — geometric argument holds regardless of κ.

### Why the magnitude shifted ~12% (analytical explanation)

The κ shift was **almost but not exactly uniform** across faces:
- F1: +0.0761 (smallest; F1 had largest pre-shift C_raw=0.2336 where sigmoid steepness mattered most)
- F2-F11: ~+0.0935 (most faces)
- F4/F5/F6/F12: ~+0.0930-0.0937

If the shift had been EXACTLY uniform (E_new = E_old + c·𝟙), all non-DC modal amplitudes would be **invariant** because non-DC eigenvectors are orthogonal to the all-ones vector U[:,0]. Since the shift was ~99% uniform with ~12% non-uniformity at F1, the modal amplitudes shifted slightly.

**Verification of uniform-shift invariance:** Mode 0 (DC) amplitude shifted by exactly 0.31870 = mean_shift × √12 = 0.092 × 3.464 ✓ (matches analytical prediction precisely).

### Methodological implication

The ~12% magnitude reduction is consistent with the κ=φ² methodological-restraint principle from Lock #8.35: **the gentler amplifier produces gentler spectral tension readings while preserving the geometric structure.** CEN's "spectral tension" at κ=φ² is methodologically more restrained — not less real, just less amplified.

This compounds with the architectural-blindness narrative reframe: the methodology refuses to overdramatize at the amplifier layer; the geometric findings (Mode 5 dominance, F3+F8 vs F1+F9 seesaw, E1-8/E3-9 carrier edges) live at the eigenvector layer which is purely geometric and unaffected.

### What stays from this document

**Sections 0-5 of this document are valid VERBATIM at κ=φ²** with one numerical update: substitute |a_5| ≈ 0.0649 wherever the document cites 0.0740. The interpretive content, the highest-leverage prescription, the carrier-edge identification, the bi-directional implications, the thesis-defense framing — all hold geometrically.

### Cross-references

- κ-band Resolution Analysis §9 (Option E + Lock #8.35) — `docs/cen-ssot/CEN_SSOT_KappaBand_Resolution_Analysis_2026-05-23.md`
- Disclosure doc §6.5 (Geometric Derivation of κ) — `docs/QUANNEX_INTERPRETIVE_LAYER_DISCLOSURE.md`
- Audit Trail §13 Spectral Derivation of κ=φ² sub-section — `docs/math/CALCULATION_AUDIT_TRAIL.md`
- Memory: `project_kappa_band_coupling_finding_2026-05-23.md` (RESOLVED)
- Memory: `project_cen_mode5_edge_phenomenon.md` (sister entry — Mode 5 finding survives κ=φ² resolution unchanged in structure)

---

*End of CEN SSOT Mode 5 Deep Interpretation, 2026-05-22. Addendum 2026-05-24.*
