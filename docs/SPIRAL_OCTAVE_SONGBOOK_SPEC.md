# Spiral Octave Songbook — Canonical Specification

**Version:** 1.0 (Phase 4 Commitment Artifact)
**Date:** 2026-04-15
**Status:** Methodology + 5 worked examples; full 34-KPI mapping targeted May 2026
**Audience:** CEN research partners (Dominique + Esther), thesis committee, Quannex team

---

## Reading Panel

| Section | Purpose | Who reads it |
|---|---|---|
| §1 Vocabulary | Disambiguate two 12-face taxonomies | All readers first |
| §2 Architecture | 12 × 7 × 5 = 420 overview | All readers |
| §3 Paradigm Reframe | Instrument of attention, not measurement | **Read this second** |
| §4-6 Rules A/B/C | Mapping methodology | Committee + CEN |
| §7-8 Tie-breakers + Friction | Edge cases | Practitioners |
| §9 Octave Transitions | Boundary notes | Committee |
| §10 Worked Examples | 5 concrete mappings | CEN + Committee |
| §11 Epistemic Framing | 386 silent strings clarification | CEN first |
| §12 Prior Art | Internal + external lineage | Committee |
| §13 Glossary | Term definitions | Non-Quannex readers |
| §14 Cross-references | Paths to source material | Deep divers |

---

## 1. Vocabulary — Two 12-face Taxonomies

Quannex uses **two** distinct 12-face vocabularies. They must not be conflated.

**Vocabulary A — Organizational Capital Domains (what this Songbook uses):**

| ID | Name |
|---|---|
| F1 | Financial Capital |
| F2 | Intellectual Capital |
| F3 | Human Capital |
| F4 | Structural Capital |
| F5 | Market Resonance |
| F6 | Community & Partners |
| F7 | Brand & Reputation |
| F8 | Core Operations |
| F9 | Regenerative Flow |
| F10 | Foundational Values |
| F11 | Funding Pipeline |
| F12 | Risk & Resilience |

Defined canonically in `js/constants/kpi-constants.js:511-524` as `DOMAIN_NAMES`. These are the 12 pentagonal faces of the Quannex dodecahedron — domains of organizational health.

**Vocabulary B — Spiral Refinement Quality Faces (development tooling):**

Survival / Foundation / Clarity / Harmony / Signal / Consciousness / Coherence / Resilience / Growth / Integrity / Discovery / Radiance.

Used exclusively by the `/selfcritique` skill and the POC CONTROL_PANEL's Dashboard sheet to audit development quality. **Not relevant to the Songbook measurement framework.**

Throughout this spec, "Face" and "F1-F12" refer to Vocabulary A unless explicitly marked "Spiral face."

---

## 2. Architecture — 12 × 7 × 5 = 420

The Spiral Octave Songbook's coordinate system:

| Axis | Count | What it is |
|---|---|---|
| Faces (Domains) | 12 | Pentagonal faces of the dodecahedron; organizational capital domains |
| Octaves | 7 | Developmental stages from Survival (O1) to Radiance (O7); PHI-derived thresholds |
| Elements | 5 | Pentagramic vertices per face: Earth, Water, Fire, Air, Ether — inquiry lenses / capital types |
| **Total cells** | **420** | Each = (Face × Octave × Element) coordinate |

**Octave thresholds** (from `js/constants/phi-harmonics.js:269-347` `OCTAVE_THRESHOLDS`):

| Octave | Name | Threshold | Core question |
|---|---|---|---|
| O1 | Survival | 0.000 | "Will we exist tomorrow?" |
| O2 | Structure | 0.382 (φ⁻²) | "How do we organize?" |
| O3 | Relationships | 0.500 | "Who are we together?" |
| O4 | Creativity | 0.618 (φ⁻¹) | "What can we create?" |
| O5 | Expression | 0.764 (1 − φ⁻³) | "What do we stand for?" |
| O6 | Vision | 0.854 (1 − φ⁻⁴) | "Where are we going?" |
| O7 | Radiance | 0.910 (1 − φ⁻⁵) | "How do we serve?" |

**Elements** (from `js/constants/kpi-constants.js:140-190` `ELEMENTS`):

| Element | Pentagram vertex | Inquiry lens |
|---|---|---|
| Earth | Position 0 | Foundation / material base |
| Water | Position 1 | Flow / circulation |
| Fire | Position 2 | Catalyst / activation |
| Air | Position 3 | Connector / relationship quality |
| Ether | Position 4 | Transcendent / meaning |

Each face has exactly 5 elemental KPIs (one per element) at each octave — giving 35 cells per face × 12 faces = 420.

---

## 3. Paradigm Reframe — Instrument of Attention

**Conventional KPIs measure what is. Spiral Octave KPIs ask what is alive or asleep in each domain.**

This is the core conceptual shift. Every cell in the 420 grid is a **contemplative position** — a coordinate where asking could happen — not a metric that must be tracked.

**Grounded in POC's existing practice.** The canonical KPI database (`data/json/kpi-database.json`) and REFRENCE_MODELS sheet (`SpiralDASHBOARD-Leading_V2.xlsx`) both pair every KPI with a `philosophy.question` field. Example cells from the existing template:

- F1 × O1 × Earth: *"Is it grounded?"* → Raw Cash in Bank (€)
- F3 × O1 × Ether: *"Are you joyful?"* → Joy in the Work Score (1-5)
- F9 × O1 × Water: *"Do these choices feel right?"* → Founder's Felt Sense of Integrity
- F10 × O1 × Earth: *"Are values embedded in our decisions?"* → Documented Value Alignment Moments

The instrument **asks** before it measures. The number is attached to a contemplative practice, not reported to an abstract dashboard.

**Corollary — the `zeroEnergy` principle.** Per `data/json/kpi-database.json` top-level philosophy:

> *"zeroEnergy: Not absence of effort, but perception below threshold."*

A zero score does not claim nothing happened. It claims the instrument's perception window did not detect whatever did. The instrument knows it cannot see everything. This is humility encoded as math.

**Implication for the 420.** The 34 BSC KPIs CEN already has = 34 active attentions. The remaining 386 cells = 386 **dormant possibilities of attention**. They reveal where the music could go as CEN develops through the octaves. They are not required measurements. They are not obligations. They are a map of the instrument CEN is already holding.

---

## 4. Decision Rule A — Domain (Which POC F1-F12)

For each BSC KPI, read Name + Data Source + Measurement Method. Match to the strongest signal:

| Signal in BSC KPI | Primary face |
|---|---|
| Revenue, costs, P&L, cost coverage | F1 Financial Capital |
| Knowledge, expertise, curriculum, IP | F2 Intellectual Capital |
| People, compensation, roles, hiring, onboarding | F3 Human Capital |
| Policies, governance docs, systems, process | F4 Structural Capital |
| Clients, commercial pipeline, conversion, market | F5 Market Resonance |
| Members, community, partnerships, engagement | F6 Community & Partners |
| NPS, reputation, positioning, visibility | F7 Brand & Reputation |
| Core service delivery, audit throughput, operations | F8 Core Operations |
| Regenerative practice, SDGs, sustainability | F9 Regenerative Flow |
| Values consistency, mission, vision alignment | F10 Foundational Values |
| Donations, subscriptions, fundraising | F11 Funding Pipeline |
| Compliance, GDPR, crisis protocols, independence | F12 Risk & Resilience |

**Tie-breaker (per §7):** primary = where the measurement *lives*; secondary = where the *impact* appears.

---

## 5. Decision Rule B — Octave (O1-O7)

CEN's Conventional Strategic Analysis Report (Phase 1) priority-tagged all 34 KPIs via §6.6 "Priority Tiers":

- **O1 Survival (🔴)**: *"prerequisites for revenue; CEN cannot scale without these"*
- **O2 Structural (🟡)**: *"infrastructure for sustainable growth"*
- **O3 Aspirational (🟢)**: *"CEN's vision at full expression"*

**Rule:** use CEN's priority tags verbatim. No re-interpretation. O1 → O1, O2 → O2, O3 → O3.

**O4 Creativity, O5 Expression, O6 Vision, O7 Radiance** are not represented in the 34 BSC KPIs. They are the **silent higher octaves** that the Songbook surfaces as aspirational developmental capacity. A mature CEN five years hence will have KPIs at O4+; today it does not, and that's honest.

---

## 6. Decision Rule C — Element (Calibration, Not Invention)

Element assignment is **calibrated against POC's existing element-anchor system**, not invented. Two authoritative sources define the precedent:

1. `POC/data/json/kpi-database.json` — 12 KPIs (one per face, all O1) with `philosophy.element` assigned
2. `Final Thesis/.../SpiralDASHBOARD-Leading_V2.xlsx` REFRENCE_MODELS — all 420 cells with element assigned (420/420 templated; 394/420 have values)

**POC primary-element precedent per face at O1:**

| Face | Primary element at O1 (from kpi-database.json) |
|---|---|
| F1 Financial Capital | Earth |
| F2 Intellectual Capital | Air |
| F3 Human Capital | Fire |
| F4 Structural Capital | Earth |
| F5 Market Resonance | Air |
| F6 Community & Partners | Water |
| F7 Brand & Reputation | Fire |
| F8 Core Operations | Earth |
| F9 Regenerative Flow | Ether |
| F10 Foundational Values | Ether |
| F11 Funding Pipeline | Fire |
| F12 Risk & Resilience | Water |

**Two-step rule:**

**C1 — Default to precedent.** For a KPI at face F, start from that face's primary-element precedent. If the KPI's inquiry-lens character matches that element, the mapping is **precedent-aligned** → use it.

**C2 — Deliberate divergence permitted at a different element slot.** Each (face, octave) cell has 5 element slots. The precedent occupies one; the other 4 are available for different-inquiry KPIs that activate a different element per the signal table below. If a KPI's character clearly activates a non-primary element, assign the divergent element and **document the reason in the Rationale column**.

**Element signal table:**

| Element | Inquiry lens | BSC KPI type signal |
|---|---|---|
| Earth (Foundation) | Material base | Absolute counts, revenue amounts, documents-exist binary, compliance presence |
| Water (Flow) | Circulation | Engagement rate, renewal rate, flow/throughput metrics, cycle time |
| Fire (Catalyst) | Activation | Conversion rate, acquisition rate, ignition mechanisms, capability-exists-and-operational |
| Air (Connector) | Relationship quality | NPS, touchpoints, quality-of-relationship scores, clarity |
| Ether (Transcendent) | Meaning | Values alignment, vision consistency, purpose integrity, perceived authenticity |

---

## 7. Tie-breaker Rules

When a BSC KPI could reasonably map to multiple faces or elements, apply in order:

1. **Primary = where the measurement LIVES.** Whose system generates the number? That's the native face.
2. **Secondary = where the IMPACT appears.** Noted in the Rationale column, not in the coordinate.
3. **One primary assignment per KPI.** No dual-primary placements. Dual-impact is acknowledged in prose, not structurally.

*Example.* CEN KPI I4 "Certification independence mechanism operational" could map to F3 Human Capital (a named reviewer is a person) OR F4 Structural Capital (the mechanism itself). Primary = F4 because the *measurement* is whether the mechanism exists, not whether the person exists. Secondary impact on F3 noted in Rationale.

---

## 8. Rule Friction as Feature

If, during mapping, a BSC KPI resists all three rules (Domain/Octave/Element) — it doesn't clearly fit any face signal, or its octave tag contradicts its apparent developmental level, or no element signal activates — **document the friction in the Rationale column, do not hide it, do not force-fit**.

Rules that never friction with reality are suspicious. A methodology that produces clean mappings for 34 out of 34 BSC KPIs should be questioned; a methodology that produces 31 clean + 3 documented-friction mappings is doing its job.

Friction cases become the most interesting entries in the Songbook because they surface what the BSC couldn't say about CEN.

---

## 9. Octave Transitions — Boundary Notes

The thresholds between octaves (0.382, 0.500, 0.618, 0.764, 0.854, 0.910) are PHI-derived — not arbitrary. Each threshold is a **developmental boundary note**: the point where a domain's coherence must clear one level of embodiment to be audible at the next.

**Why this matters for CEN:** CEN's Phase 2 frozen scores show F10 Foundational Values at 8/10 (above O4 threshold 0.618, above O5 threshold 0.764, approaching O6 threshold 0.854). Simultaneously, F1 Financial Capital is at 2/10 (below O2 threshold 0.382). That cross-octave gap — values-Vision-level while Finance barely clears Survival — IS the dramatic boundary-note pattern. The instrument surfaces it as information.

Full boundary-note dynamics (the 30 edges between adjacent faces, the 20 vertex confluence points, the 6 breath axes) are deferred to the May Unified Workbook.

---

## 10. Worked Examples — 5 Concrete Mappings

Chosen to demonstrate: (a) all 4 BSC perspectives, (b) 3 octaves (O1, O2, O3), (c) 3 elements (Earth, Air, Ether), (d) 3 precedent-aligned + 2 precedent-divergent mappings, (e) one mapping on CEN's loudest string F10 = 8/10.

### Example 1 — F1 "Total annual revenue" (Financial, O1)

- **BSC source**: Report §6.2 row F1, priority 🔴 O1
- **Coordinate**: F1 Financial Capital × O1 Survival × Earth
- **Rule A (Domain)**: Revenue amount → F1 (direct, canonical)
- **Rule B (Octave)**: CEN-tagged O1 → O1 (verbatim)
- **Rule C (Element)**: POC precedent F1 → Earth. Revenue as absolute material amount ≡ Earth inquiry. **Precedent-aligned.**
- **Rationale**: Canonical case. Revenue is the foundational material measure of financial capital. No tie-breaker needed.

### Example 2 — C1 "Active member count — engaged, not ghost" (Customer, O1)

- **BSC source**: Report §6.3 row C1, priority 🔴 O1
- **Coordinate**: F6 Community & Partners × O1 Survival × Earth
- **Rule A (Domain)**: Members / community engagement → F6 (signal table)
- **Rule B (Octave)**: CEN-tagged O1 → O1
- **Rule C (Element)**: POC precedent F6 → Water (community flow). However C1 measures a **count** (absolute member number, Earth inquiry), not a flow rate. **Divergent from precedent, justified.** Different element slot within the same (F6, O1) cell.
- **Rationale**: Active member count is a material-base measure (Earth) not a circulation measure (Water). Member engagement *rate* (C2 in the BSC) would be the Water-primary KPI at this cell. Illustrates rule-calibration: multiple KPIs can occupy the same (face, octave) cell at different element slots.

### Example 3 — I3 "GDPR compliance gaps closed" (Internal, O1)

- **BSC source**: Report §6.4 row I3, priority 🔴 O1
- **Coordinate**: F12 Risk & Resilience × O1 Survival × Earth
- **Rule A (Domain)**: Compliance gap → F12 (signal table). Could tie-break to F4 Structural Capital (governance docs); tie-breaker resolves to F12 because the *measurement* is risk-specific, not general-governance.
- **Rule B (Octave)**: CEN-tagged O1 → O1
- **Rule C (Element)**: POC precedent F12 → Water. However I3 is a **documents-exist binary** (gap closed or not — Earth inquiry), not a flow measure. **Divergent from precedent, justified.**
- **Rationale**: GDPR compliance as closed-gap-count is Earth (foundational presence). Risk *flow* (incidents per quarter, say) would be Water. Rule C2 divergence; same-cell multi-element population.

### Example 4 — L5 "NGCLP curriculum ready for delivery" (Learning & Growth, O3)

- **BSC source**: Report §6.5 row L5, priority 🟢 O3
- **Coordinate**: F2 Intellectual Capital × O3 Relationships × Air
- **Rule A (Domain)**: Curriculum / knowledge → F2
- **Rule B (Octave)**: CEN-tagged O3 Aspirational → O3
- **Rule C (Element)**: POC precedent F2 → Air (knowledge connection). Curriculum-ready-for-delivery is knowledge made connectable, teachable, relational. **Precedent-aligned.**
- **Rationale**: Curriculum is the moment intellectual capital becomes relational — knowledge carried to students. Air (connection) is native. O3 reflects aspirational vision: CEN has not yet delivered NGCLP to a cohort.

### Example 5 — L8 "SDG alignment in PVM" (Learning & Growth, O2) — **On CEN's loudest string**

- **BSC source**: Report §6.5 row L8, priority 🟡 O2
- **Coordinate**: F10 Foundational Values × O2 Structure × Ether
- **Rule A (Domain)**: Values consistency, mission alignment → F10
- **Rule B (Octave)**: CEN-tagged O2 Structural → O2
- **Rule C (Element)**: POC precedent F10 → Ether (values/transcendent). SDG alignment in the PVM is values-made-structural. **Precedent-aligned.**
- **CEN score context**: F10 Foundational Values scored V_res_post = 8/10 in Phase 2 frozen scores — one of CEN's two loudest strings (alongside F9 at 8/10). Dominique scored F10 = 10/10 and Esther 9/10 — near-perfect co-founder consensus. This mapping **lands on CEN's strongest face**. The Songbook is not a deficit report.
- **Rationale**: Values as embedded meaning (Ether) being structurally encoded in core documents (O2) is the mapping that the Coherence Portrait §7 celebrates as CEN's anchor: *"Your values are your foundation — and you both know it."*

---

## Summary statistics for the 5 examples

| Dimension | Distribution |
|---|---|
| BSC perspective | Fin: 1, Cust: 1, Int: 1, L&G: 2 — all 4 covered |
| Octave | O1: 3, O2: 1, O3: 1 |
| Element | Earth: 3, Air: 1, Ether: 1 |
| Precedent alignment | Aligned: 3, Divergent-with-justification: 2 |
| CEN score coverage | Loud strings: 1 (F10 = 8/10), quieter: 4 (F1=2, F6=4, F12=3, F2=5) |

Narrative balance achieved: the methodology demonstrates on CEN's strongest face AND on quieter faces, so the Songbook reads as a mirror not a deficit report.

---

## 11. Epistemic Framing — Instrument of Attention, Not Obligation of Measurement

**The 386 unmapped cells are dormant possibilities of attention, not required measurements.** This framing must appear in every CEN-facing surface (Cover sheet, spec, presentation) because the alternative reading — "420 things you must now measure" — is the most likely misinterpretation and the most damaging.

Grounded in two existing POC principles:

1. **Every KPI pairs a number with a contemplative question** (per §3). The 420 grid is 420 questions, not 420 metrics. 420 places where asking could happen.

2. **The `zeroEnergy` principle** (per `data/json/kpi-database.json`): zero = perception below threshold, not absence of effort. The instrument admits it cannot see everything. A zero on a cell does NOT mean CEN is failing on that cell; it means that specific window isn't currently active.

**Corollary for thesis defense.** The claim — *"Conventional KPIs measure what is. Spiral Octave KPIs ask what is alive or asleep in each domain"* — upgrades the Balanced Scorecard rather than replacing it. The 34 BSC KPIs are ABSORBED into the 420 framework at their native coordinates. The 386 silent cells are the framework's aspirational range. Neither is a verdict.

---

## 12. Prior Art Lineage — Internal AND External

### Internal (POC's own canonical 420 template — this work extends it)

The full 420-cell Octave Progression Model already exists as the `REFRENCE_MODELS` sheet of `SpiralDASHBOARD-Leading_V2.xlsx`. All 420 cells are defined (face × octave × element, each with contemplative question + KPI name + direction). 394/420 currently have values; 26 are intentional nulls (Pay Equity Ratios stored as ratio strings). This Songbook is **extraction + CEN-adaptation** of that existing audit-traceable template, not new construction.

The mathematical audit at `Spiral Dashboard/Audit & Documentation/SpiralDASHBOARD_V2_Full_Mathematical_Audit.md` documents all 2,022 formulas with honest disclosure. Thesis defense gains rigor from this disclosure: the framework's theoretical scope vastly exceeds today's operational scope, and the thesis does not oversell.

### External lineage — this framework honors its predecessors

The Spiral Octave framework is a synthesis, not a ground-up invention:

- **Spiral Dynamics** (Don Beck & Chris Cowan, extending Clare Graves): the developmental-stage concept named in colored memes (Beige/Purple/Red/Blue/Orange/Green/Yellow/Turquoise — 7-8 stages). Quannex's "octaves" retain this developmental-stage logic.
- **Reinventing Organizations** (Frederic Laloux, 2014): organizational developmental stages tied to consciousness levels. Validates the map-organizations-by-developmental-stage move.
- **Integral Theory / AQAL** (Ken Wilber): quadrant integration — individual/collective × interior/exterior. Informs the multi-perspective measurement logic.
- **The Reflexive Universe** (Arthur Young, 1976): seven-stage developmental arc through matter/consciousness. Deep structural parallel to the 7-octave progression.
- **Platonic solids spectral mathematics**: the dodecahedron-icosahedron pair are the only Platonic solids whose symmetry group (A₅) requires the field extension Q(√5)/Q. Phi-math is *resonant* with this topology, not imposed. See POC `docs/thesis/EMERGENT_MATHEMATICAL_TRUTHS.md` Discoveries #7, #10, #11.

What Quannex adds: (a) the specific dodecahedral 12-domain organizational container, (b) the pentagramic 5-element decomposition per face, (c) the 6 breath-axis polarity structure, (d) the mathematical operationalization (2,022 formulas in the SpiralDashboard). The thesis defense names this lineage rather than claiming whole-cloth invention.

---

## 13. Glossary (for non-Quannex readers)

**Face / Domain.** One of 12 pentagonal faces of the Quannex dodecahedron. Each face = one organizational capital domain (F1 Financial Capital … F12 Risk & Resilience). Do not confuse with Spiral Refinement quality faces (Survival, Foundation, etc. — see §1).

**Octave.** One of 7 developmental stages (O1 Survival → O7 Radiance), separated by PHI-derived thresholds. An organization sits at some current octave per face; the octave indicates developmental maturity.

**Element.** One of 5 pentagramic vertices per face (Earth, Water, Fire, Air, Ether). Elements are universal **inquiry lenses** applied uniformly across all faces — the *kind* of capital that can vibrate at that position.

**Breath Axis.** One of 6 polarity pairs (opposite faces on the dodecahedron). Axis 1 Resource Flow = F1 ↔ F11. Axis 5 Internal & External = F5 ↔ F10 — the axis where CEN showed full polarity inversion between co-founders. Each axis asks a diagnostic question about organizational balance.

**Vortex.** One of 20 vertices of the dodecahedron. Each vortex = confluence of 3 faces (three-way energy convergence). Used for deeper dynamics analysis in the Unified Workbook.

**Edge.** One of 30 face-face adjacencies. Each edge has Tension, Breath Ratio, Coherence, and an Archetype label (e.g. F5 ↔ F9 = "Market Resonance ↔ Regenerative Flow"). Used in the May package's Domain Control Panels.

**Coherence.** The metric — how well a face's 5 elemental KPIs harmonize. Ranges 0-1. Thresholds above PHI⁻¹ = 0.618 indicate "thriving"; below PHI⁻³ = 0.236 indicates "critical intervention needed."

**KPI.** In this framework: a number paired with a contemplative question (see §3). Not a conventional metric.

**Contemplative question.** The "ask" half of every KPI. Questions like *"Are you joyful?"* or *"Is it grounded?"* — operationalized as a score but honoring the quality of attention required to answer them.

**`zeroEnergy` principle.** A score of zero means "perception below threshold," not "nothing happened." Built into the framework's integrity.

For deep dives: see POC docs `BREATH_AXIS_REFERENCE.md`, `EDGE_DYNAMICS_REFERENCE.md`, `VERTEX_DYNAMICS_REFERENCE.md`, `SYSTEM_COHERENCE_REFERENCE.md`.

---

## 14. Cross-References

| Source | Path | Purpose |
|---|---|---|
| Cross-workspace handoff | `Final Thesis/Thesis Work/Quannex Business Exports/POC_420_KPI_Songbook_Handoff.md` | Original Phase 4 handoff from thesis to POC (session 28) |
| CEN Conventional Analysis | `Final Thesis/.../Phase 1/CEN_Conventional_Strategic_Analysis_Report.md` Ch 6 | 34 BSC KPIs with octave priority tags |
| CEN Phase 2 frozen scores | `Final Thesis/.../CEN_Phase2/EvidencePackage/CEN_Phase2_RawScores_Frozen.md` | 12 face scores, 6 breath axis scores; V_res_post canonical |
| CEN Coherence Portrait | `Final Thesis/.../Phase 3/CEN_Coherence_Portrait.md` §6.1 | CEN's prior expectation of Phase 4 delivery |
| 420 canonical template | `Final Thesis/.../SpiralDASHBOARD-Leading_V2.xlsx` REFRENCE_MODELS sheet | All 420 cells with questions/KPIs/directions; 394/420 with values |
| Mathematical audit | `Final Thesis/.../Spiral Dashboard/Audit & Documentation/SpiralDASHBOARD_V2_Full_Mathematical_Audit.md` | 2,022 formulas documented, honest 60/420 operational disclosure |
| POC SSOT — domains | `js/constants/kpi-constants.js:511-524` | `DOMAIN_NAMES` (F1-F12) |
| POC SSOT — octaves | `js/constants/phi-harmonics.js:269-347` | `OCTAVE_THRESHOLDS` with phi-derived values |
| POC SSOT — elements | `js/constants/kpi-constants.js:140-190` | `ELEMENTS` constants |
| POC SSOT — element precedent | `data/json/kpi-database.json` kpis array | 12 KPIs (one per face) with `philosophy.element` — calibration anchor for Rule C |
| POC SSOT — breath axes | `js/constants/kpi-constants.js:389-485` | `AXIS_OPPOSITIONS` with diagnostic questions |

---

**End of specification.**

*Version 1.0 — 2026-04-15. Next revision: May 2026, accompanying the full Unified CEN Reusable Excel Workbook.*
