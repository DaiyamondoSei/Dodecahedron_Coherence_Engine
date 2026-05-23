# CEN SSOT W0.6 v3 — 34-KPI Question-Derived Structural Mapping (Procedure C)

**Prepared by:** Sonnet sub-agent (ssot-mapper-v3) under Opus orchestration (§27 Orchestrator pattern)
**Date:** 2026-05-21
**Supersedes:** `CEN_SSOT_W06v2_34KPI_3Octave_Mapping_2026-05-21.md` (which applied Procedure B — s58 element-tagging — with cluster-vs-face flagged conflicts)
**Status:** Proposed — awaiting partnership validation by Deimantas
**Scope:** Place every CEN BSC KPI at the cell whose **canonical Songbook v2.1 inquiry** the KPI most directly answers. Procedure C is the methodologically purest of the three procedures considered (A: cluster narrative; B: s58 element-tag; **C: question-answer match against canonical inquiry**).

---

## Plan Control Panel

| Field | Value |
|-------|-------|
| **Status** | Proposed (Procedure C — question-derived from Songbook v2.1) |
| **Methodology** | Each KPI matched to canonical Songbook v2.1 inquiry semantic |
| **Source of inquiries** | `POC/deliverables/POC_420_Songbook_v2.1_Full34_2026-04-18.xlsx` sheet "The 420 Inquiries" (420 rows verified) |
| **Source of KPI mapping baseline** | Same xlsx sheet "34 KPI Mappings" (Songbook's own canonical placements) |
| **Total KPIs verified** | 34 (13 O1 + 17 O2 + 4 O3) |
| **Face-KPIs** | 29 (placed at unique face-element-octave coordinates) |
| **Edge-KPIs** | 4 (E7-11, E2-10, E10-12, E5-8 per Lock #8.9) |
| **Vertex-KPIs** | **1** (BSC.L8 SDG alignment in PVM → Vertex V13 — see Section 5) |
| **HIGH confidence placements** | 32 |
| **MEDIUM confidence placements** | 2 |
| **LOW confidence placements** | 0 |
| **Items flagged for partnership-discussion** | 2 (L8 vertex promotion validation; L4 Songbook canonical placement difference) |
| **Placements CHANGED from v2** | 5 (BSC.F8, BSC.L4, L8, C7, L5 — see Section 4) |
| **L8 verdict** | Promoted to Vertex V13 (Structure-Regeneration-Values triad) |
| **O1 face energies** | Identical to v2 (Δ = 0 across all 12 faces; only changes were silent-cell relocations) |
| **Next action** | Partnership validation walkthrough |

---

## Section 1 — Architectural Locks Applied

### Locks #8.5 through #8.10 from W0 Consolidation Map (constitutional)

All v2 locks remain in force:
- **Lock #8.5** — 34 BSC KPIs are the canonical mathematical input through Songbook 60-element mapping
- **Lock #8.6** — Three data streams (KPIs / D+E co-founder / V_res researcher) with distinct roles
- **Lock #8.7** — Sheet 16 Dashboard surfaces D, E, V_res analytical context alongside canonical E_f
- **Lock #8.8** — Canonical CEN AAG is computed from pentagramic face energies (single number)
- **Lock #8.9** — KPI Structural Placement Uniqueness: Face XOR Edge XOR Vertex per KPI; 4 pre-validated edge promotions
- **Lock #8.10** — Spectral Δ analysis is core SSOT content

### NEW LOCK — Procedure C (Question-Answer Matching) as Canonical Methodology

The v3 mapping uses **Procedure C** — semantic match of each KPI to the canonical Songbook v2.1 inquiry it most directly answers. This is methodologically purer than:
- **Procedure A** (Spiralization §2.1.2 cluster narrative): risks interpretive cluster-naming bleeding into face-coordinate placement
- **Procedure B** (s58 line 77-91 element-tagging): closer to canonical but the s58 doc gives the element-tags as RESULTS rather than the PROCEDURE; raw inquiries are upstream of element-tagged values

Procedure C goes to the upstream source: the 420 contemplative inquiries themselves. Each cell in the 180-cell SSOT grid has a verbatim canonical inquiry; each KPI is matched to the inquiry whose semantic content it most directly addresses.

**Procedure C rule:** *"Which cell's canonical Songbook v2.1 inquiry does this KPI most directly answer?"* The KPI lives at THAT cell. No interpretive cluster narrative, no mathematical fudging — just question-answer semantic matching.

### NEW LOCK — Vertex-KPI Detection via 3-Face Question-Spanning

The structural-uniqueness principle (Lock #8.9) reserved the vertex slot but found no vertex-KPIs in v1/v2. Under Procedure C, the test is: *"Does this KPI semantically REQUIRE inquiries from three different faces simultaneously, OR does it answer a single face's inquiry better than any other?"* If the former, it lives at the corresponding vertex (the 3-face junction).

**BSC.L8 SDG alignment in PVM** is identified as the first vertex-KPI candidate under this lens — bridging F4 Structural (PVM = document codification), F9 Regenerative (SDGs = ecological commitment), and F10 Values (PVM = values articulation). See Section 5.

---

## Section 2 — Procedure C Methodology

### The question-answer matching rule

For each CEN KPI, the placement is determined by answering this question:

> *"Among the canonical Songbook v2.1 inquiries at the KPI's octave layer (per priority tier 🔴 O1 / 🟡 O2 / 🟢 O3), which inquiry does this KPI most directly answer?"*

The KPI lives at that inquiry's (Face, Element, Octave) coordinate. No partial weights, no cluster narrative override.

### Source of canonical inquiries

The complete 420-inquiry canonical set was extracted from:
- **Workbook:** `POC/deliverables/POC_420_Songbook_v2.1_Full34_2026-04-18.xlsx`
- **Sheet:** "The 420 Inquiries" (rows 4-437, 420 inquiries × 8 columns: Face / Domain / Octave # / Octave Theme / Element / Contemplative Question / Exemplar KPI Name / CEN Active)
- **Upstream source:** `POC/data/json/refrence_models_extracted.json` (canonical model definitions)
- **Verified:** 420 rows present (100% populated); 34 CEN-active mappings highlighted; 386 silent strings carry pre-existing Quannex inquiries

### Source of existing canonical KPI mappings

The Songbook v2.1 already contains canonical placements for all 34 CEN KPIs in its "34 KPI Mappings" sheet (rows 4-37, 34 KPIs × 8 columns). Each KPI has:
- CEN BSC ID + KPI name
- BSC Perspective / Octave (priority tier)
- POC Coordinate (Face × Octave × Element)
- Alignment (Aligned with face precedent OR Divergent-justified)
- P4 worked example flag
- Rationale / Friction Note (the question-match logic, verbatim from Songbook)

**Procedure C applies these canonical placements as the primary source.** Lock #8.9 edge promotions then OVERRIDE the Songbook face placements for the 4 boundary-case KPIs (F4 Donation, L7 Peace Charter, I3 GDPR, C8 AI gov consulting) AND vertex promotion is now tested for L8 SDG alignment.

### Tier-discipline note

The Songbook v2.1 mappings are themselves bachelor's-defensible: each placement cites the canonical inquiry it answers, with rationale. The Procedure C mapping in this document **preserves the Songbook v2.1 placements as canonical** and applies the structural-uniqueness lock #8.9 + vertex-detection on top.

---

## Section 3 — Master Mapping Table (34 KPIs)

Every KPI's placement includes:
- Verbatim canonical Songbook v2.1 inquiry (the question the KPI answers)
- Question-match rationale from Songbook + this document
- Confidence rating

| # | BSC ID | KPI Name | BSC Persp | Priority Tier | Octave | CEN Cluster (narrative) | Structural Slot | Position (face, element, octave) OR (edge, octave) OR (vertex, octave) | **Canonical Songbook Inquiry (verbatim)** | **Question-match rationale** | Confidence |
|---|--------|----------|-----------|:-------------:|:------:|---------------------------|:---------------:|------------------------------------------------------------------------|------------------------------------------|------------------------------|:----------:|
| 1 | F1 | Total annual revenue | Financial | 🔴 O1 | **O1** | Three-Pillar Sustainability | Face | **(F1, Earth, O1)** | *"Is it grounded? — Raw Cash in Bank (€)"* | Songbook v2.1 R5: "Revenue = canonical Earth inquiry at F1's precedent anchor 'How long can we survive without new resources?' Direct resonance." Total revenue IS the grounded financial-substance measure. | HIGH |
| 2 | F2 | Certification revenue per client | Financial | 🔴 O1 | **O1** | Three-Pillar Sustainability | Face | **(F1, Air, O1)** | *"Is it understood? — Clarity Score of Financials to Stakeholders (1-5)"* | Songbook v2.1 R6: "Per-client revenue is a connector signal between certification offering and economic yield — Air inquiry. Earth slot occupied by F1 total revenue." Per-client = relational-clarity dimension. | HIGH |
| 3 | F3 | AI governance consulting revenue | Financial | 🔴 O1 | **O1** | Three-Pillar Sustainability | Face | **(F1, Fire, O1)** | *"Are we adding to it? — # of Funding Opportunities Pursued"* | Songbook v2.1 R7: "Emerging revenue capability's ignition (£0→£200K Y1). Fire = capability-operational + ignition mechanism. Today zero-energy (perception below threshold)." | HIGH |
| 4 | F4 | Donation income/quarter | Financial | 🟡 O2 | **O2** | (boundary case) | **Edge** | **E7-11, O2** (F7 Brand ↔ F11 Funding) | (edge-level inquiry) *"Does CEN's reputation attract aligned philanthropic capital?"* (mapping-context.json:165 — emergentName "Reputation-Funding Attraction") | Lock #8.9 pre-validated edge promotion. Donations to CEN are reputation-driven (donor recognition of CEN's voice), not pipeline-driven. The edge inquiry maps exactly. **Note:** Songbook v2.1 R8 had placed BSC.F4 at (F11, Fire, O2) pre-Lock #8.9; Lock #8.9 is the LATER architectural decision and supersedes. | HIGH (Lock #8.9) |
| 5 | F5 | SCMS subscription revenue | Financial | 🟡 O2 | **O2** | Funding Inflow | Face | **(F11, Water, O2)** | *"How accurate is our financial forecasting? — Predictability of Financial Projections"* | Songbook v2.1 R9: "Subscriptions carry stronger cycle-time/renewal character than one-time donations. Water inquiry fits the recurring-flow behavior." | HIGH |
| 6 | F6 | Revenue per active member | Financial | 🟡 O2 | **O2** | Three-Pillar Sustainability | Face | **(F1, Water, O2)** | *"Is our cash flow predictable? — Cash Flow Volatility"* | Songbook v2.1 R10: "Revenue-per-member = unit-economics flow metric. Tie-breaker §7: measurement lives in P&L÷member DB → F1 primary; F6 impact noted." | HIGH |
| 7 | F7 | Cost coverage ratio | Financial | 🔴 O1 | **O1** | Three-Pillar Sustainability | Face | **(F1, Ether, O1)** | *"Is it aligned? — Funding Alignment Index (1-5)"* | Songbook v2.1 R11: "At Survival octave, cost coverage = existential-integrity question. Ether inquiry (meaning-of-survival). Resonates with F1's Earth anchor question." | HIGH |
| 8 | F8 | Founder-borne infrastructure costs | Financial | 🟡 O2 | **O2** | Three-Pillar Sustainability | Face | **(F1, Earth, O2)** ← **CHANGED FROM v2 (was F11 Fire)** | *"Are our accounts in order? — Audit Accuracy Score"* | Songbook v2.1 R12: "Founder-subsidy amount = quantifiable material burden. Earth inquiry. FRICTION: F1 vs F3 boundary; §7 tie-breaker places primary at F1 (measurement lives in expense tracking)." Procedure C corrects v2's mis-placement at F11 Fire. | HIGH (Songbook canonical) |
| 9 | C1 | Active member count | Customer | 🔴 O1 | **O1** | Membership Belonging | Face | **(F6, Earth, O1)** | *"Are your allies real? — # of Committed Advisors"* | Songbook v2.1 R13: "F6 precedent = Water (flow). Count-of-active-members = Earth inquiry. Engagement rate (C2) is the Water-primary KPI at F6." Active member count is the foundational ground of community. | HIGH |
| 10 | C2 | Member engagement rate | Customer | 🟡 O2 | **O2** | Membership Belonging | Face | **(F6, Water, O2)** | *"Is there a smooth flow? — Partner Comm. Cadence"* | Songbook v2.1 R14: "F6 precedent = Water. Engagement RATE = flow/throughput. Canonical Water inquiry at F6: 'does community flow circulate?'" | HIGH |
| 11 | C3 | Certified enterprise count | Customer | 🔴 O1 | **O1** | Coaching Market Fit | Face | **(F5, Earth, O1)** | *"Is the message grounded? — Clarity Score of one-sentence pitch (1-5)"* | Songbook v2.1 R15: "Counts-of-clients = material-base at F5. Mirrors C1-at-Earth pattern. F5 precedent Air occupied by C8 (active-client relationships)." | HIGH |
| 12 | C4 | Cert renewal rate | Customer | 🟡 O2 | **O2** | Coaching Market Fit | Face | **(F5, Water, O2)** | *"Are our customers happy? — Customer Satisfaction (CSAT)"* | Songbook v2.1 R16: "Renewal rate = circulation measure (are clients flowing back?). Water inquiry." Renewal = the customer-happiness flow at F5/O2. | HIGH |
| 13 | C5 | NPS score | Customer | 🟡 O2 | **O2** | Field Voice | Face | **(F7, Air, O2)** | *"Is our unique value clear to the market? — Clarity of Competitive Positioning"* | Songbook v2.1 R17: "NPS = relationship-quality score — explicitly listed in §6 Air signal table. F7 Fire precedent inverted for this KPI type." | HIGH |
| 14 | C6 | New member acquisition rate | Customer | 🟡 O2 | **O2** | Membership Belonging | Face | **(F6, Fire, O2)** | *"Are we creating value together? — # Active Co-Creative Projects"* | Songbook v2.1 R18: "Acquisition rate explicitly in §6 Fire signal table ('acquisition rate, ignition mechanisms'). Community-ignition." | HIGH |
| 15 | C7 | NGCLP students enrolled | Customer | 🟢 O3 | **O3** | Coaching Market Fit | Face | **(F5, Earth, O3)** ← **CHANGED FROM v2 (was F5 Ether)** | *"Is our relationship with customers stable and lasting? — Customer Retention Rate %"* | Songbook v2.1 R19: "Count-of-students pattern. FRICTION: F5 vs F2 boundary. Curriculum (L5) = F2 Air; students (C7) = F5 Earth — complementary across faces." Procedure C corrects v2's inferred Ether placement. | HIGH (Songbook canonical) |
| 16 | C8 | AI governance consulting clients | Customer | 🔴 O1 | **O1** | (boundary case) | **Edge** | **E5-8, O1** (F5 Market ↔ F8 Operations) | (edge-level inquiry) *"Does market feedback transform into operational improvements? — Brand-Experience Coherence"* (s58 30-Edge Dataset) | Lock #8.9 pre-validated edge promotion. AI governance consulting clients = market validation of emerging operational pillar. **Note:** Songbook v2.1 R20 had placed C8 at (F5, Air, O1) — "Active qualifier names relationship-quality. F5 precedent Air resonates with anchor question 'Does the world perceive our value?'" Lock #8.9 supersedes. | HIGH (Lock #8.9) |
| 17 | C9 | Country representation in active members | Customer | 🟢 O3 | **O3** | Membership Belonging | Face | **(F6, Air, O3)** | *"Is our communication with partners clear and honest? — Quality of Partner Communication"* | Songbook v2.1 R21: "Geographic diversity = connectivity measure. Air inquiry ('how wide does the community network reach?')." | HIGH |
| 18 | I1 | P&P Pack 0 policies | IP | 🔴 O1 | **O1** | Operational Discipline | Face | **(F4, Earth, O1)** | *"Is it legal? — % of Legal Registration Complete"* | Songbook v2.1 R22: "F4 precedent Earth — direct resonance with 'How solid is our operational foundation?' Documents-exist binary." | HIGH |
| 19 | I2 | Certification governance policies | IP | 🔴 O1 | **O1** | Operational Discipline | Face | **(F4, Fire, O1)** | *"Are we accountable? — # of Documented Value Alignment Checks"* | Songbook v2.1 R23: "Certification-governance policies activate a specific capability (independent certification). Fire resonance. FRICTION: slot-pressure forced divergence from Earth precedent (taken by I1)." | HIGH |
| 20 | I3 | GDPR compliance gaps closed | IP | 🔴 O1 | **O1** | (boundary case) | **Edge** | **E10-12, O1** (F10 Values ↔ F12 Risk) | (edge-level inquiry) *"Do our values transform into resilience during a crisis? — Ethical Resilience"* (s58 30-Edge Dataset) | Lock #8.9 pre-validated edge promotion. **Note:** Songbook v2.1 R24 had placed I3 at (F12, Earth, O1) — "Documents-exist binary at F12 Risk & Resilience. Tie-breaker: F12 not F4 because measurement is risk-specific." Lock #8.9 promotes to edge E10-12 (values↔risk bridge); compliance IS the value-to-risk operational manifestation. Edge inquiry maps semantically exact. | HIGH (Lock #8.9) |
| 21 | I4 | Cert independence mechanism | IP | 🔴 O1 | **O1** | Operational Discipline | Face | **(F4, Air, O1)** | *"It is written? — % of Core Governance Docs Drafted"* | Songbook v2.1 R25: "Independence is intrinsically about QUALITY of reviewer-reviewee relationship. Per spec §7 worked example, F4 not F3 (measurement is mechanism-exists)." | HIGH |
| 22 | I5 | Cert time-to-completion | IP | 🟡 O2 | **O2** | Field-Shaping Aspiration | Face | **(F8, Water, O2)** | *"Are our workflows smooth? — Process Efficiency (Flow State)"* | Songbook v2.1 R26: "Cycle time = Water's canonical lens (§6 signal table explicit)." | HIGH |
| 23 | I6 | AI engagement close rate | IP | 🟡 O2 | **O2** | Coaching Market Fit | Face | **(F5, Fire, O2)** | *"Are we responsive? — Mean Time to Resolve Issues"* | Songbook v2.1 R27: "Conversion rate = Fire per §6. Tie-breaker: CRM lives market-side → F5. FRICTION: F5 vs F8 boundary (BSC filed under Internal; Songbook reads as market-conversion)." | HIGH |
| 24 | I7 | DMS adoption | IP | 🟡 O2 | **O2** | Operational Discipline | Face | **(F4, Earth, O2)** | *"Can our systems handle a shock? — Process Resilience Score"* | Songbook v2.1 R28: "Binary compliance/presence check. F4 Earth inquiry persists across octaves — 'is the infrastructure grounded?'" | HIGH |
| 25 | I8 | Crisis response protocol | IP | 🔴 O1 | **O1** | Compliance & Continuity | Face | **(F12, Water, O1)** | *"Are we emotionally resilient? — Founder's Psychological Resilience Score (1-5)"* | Songbook v2.1 R29: "F12 precedent Water — direct resonance with anchor question 'Can we weather unexpected storms?' Crisis protocols ARE this question operationalized." | HIGH |
| 26 | I9 | Vision/mission consistency | IP | 🟡 O2 | **O2** | Conscious-Leadership Identity | Face | **(F10, Air, O2)** | *"Are our shared rules clear and explicit? — Clarity of Code of Conduct"* | Songbook v2.1 R30: "Cross-document connectivity = connector-quality measure. L8 (Ether) holds values-in-one-doc; I9 (Air) holds values-across-docs. Complementary elements in same cell." | HIGH |
| 27 | L1 | Compensated contributor count | L&G | 🟡 O2 | **O2** | Team & Energy | Face | **(F3, Earth, O2)** | *"Do people know their roles? — Role Clarity Score"* | Songbook v2.1 R31: "Count-of-people = material-base at F3. Mirrors C1/C3/C7 count-over-precedent pattern." | HIGH |
| 28 | L2 | Knowledge transfer mechanisms | L&G | 🟡 O2 | **O2** | Programs Engine | Face | **(F2, Air, O2)** | *"Is our roadmap clear? — Clarity of Product Roadmap"* | Songbook v2.1 R32: "F2 precedent Air. Knowledge-transfer mechanisms ARE Air by function — enabling connection of knowledge across people." | HIGH |
| 29 | L3 | Onboarding documented + used | L&G | 🟡 O2 | **O2** | Team & Energy | Face | **(F3, Fire, O2)** | *"Are we retaining our talent? — Employee Retention Rate"* | Songbook v2.1 R33: "F3 precedent Fire. Onboarding ignites human capital — canonical Fire inquiry." | HIGH |
| 30 | L4 | Marketing capability operational | L&G | 🔴 O1 | **O1** | Team & Energy | Face | **(F3, Fire, O1)** ← **CHANGED FROM v2 (was F3 Air)** | *"Are you growing? — Hours Spent in Learning/Development"* | Songbook v2.1 R34: "F3 precedent Fire — role-filled-and-producing is capability-operational. FRICTION: F3 vs F5 boundary (cause vs effect split across faces)." Procedure C corrects v2's inferred Air to canonical Fire. Currently silent at 0 (capability absent). | HIGH (Songbook canonical) |
| 31 | L5 | NGCLP curriculum delivered | L&G | 🟢 O3 | **O3** | Programs Engine | Face | **(F2, Air, O3)** ← **CHANGED FROM v2 (was F2 Fire)** | *"Are the rules of collaboration clear and fair? — Clarity of IP Attribution Policies"* | Songbook v2.1 R35: "F2 precedent Air. Curriculum-ready = knowledge made connectable. O3 reflects aspirational (not yet delivered)." Procedure C corrects v2's inferred Fire to canonical Air. Currently silent at 0. | HIGH (Songbook canonical) |
| 32 | L6 | Volunteer programme operational | L&G | 🟢 O3 | **O3** | Field-Shaping Aspiration (narrative) | Face | **(F6, Water, O3)** | *"Do our partners feel this relationship is a win? — Partner's 'Perceived Value of Rel.' Score"* | Songbook v2.1 R36: "F6 precedent Water. Volunteer programmes channel community flow into contribution. FRICTION: F6 vs F3 boundary (programme vs contributors)." Note: Spiralization cluster names this Field-Shaping Aspiration (F8) but Songbook canonical is F6. | HIGH (Songbook canonical) |
| 33 | L7 | Peace Charter screening procedure | L&G | 🟡 O2 | **O2** | (boundary case) | **Edge** | **E2-10, O2** (F2 Intellectual ↔ F10 Values) | (edge-level inquiry) *"Is our knowledge grounded in and aligned with our core values? — Ethical IP Score"* (s58 30-Edge Dataset) | Lock #8.9 pre-validated edge promotion. **Note:** Songbook v2.1 R37 had placed L7 at (F4, Fire, O2) — "Per §7 tie-breaker (measurement lives where the procedure-audit is), primary = F4 matching I4 pattern. FRICTION: F4 vs F10 boundary (structural form vs values substance)." Lock #8.9 promotes to edge E2-10 (knowledge↔values bridge). Edge inquiry maps semantically exact for a values-screening procedure. | HIGH (Lock #8.9) |
| 34 | L8 | SDG alignment in PVM | L&G | 🟡 O2 | **O2** | Conscious-Leadership Identity (narrative) | **Vertex** | **V13, O2** (F4 Structural ∩ F9 Regenerative ∩ F10 Values) ← **CHANGED FROM v2 (was F10 Ether)** | (vertex-level inquiry, mapping-context.json:191 — emergentName) *"Where structure improves, CEN's values and regenerative flow can fully express — Structure-Regeneration-Values triad"* | **NEW VERTEX-KPI PROMOTION.** SDG alignment in PVM bridges THREE faces simultaneously: F4 Structural (PVM is a document artifact — structural codification), F9 Regenerative (SDGs are the ecological/regenerative commitment), F10 Values (PVM = values articulation; SDG alignment IS values-coherence with planetary stewardship). The 3-face semantic span is irreducible — no single face captures the act of codifying ecological-regenerative commitment INTO the foundational values document. Songbook v2.1 R38 placed L8 at (F10, Ether, O2) — "F10 precedent Ether. Values-made-structural. CEN's loudest string (V_res_post=8; Dominique=10, Esther=9)." However, the v3 reading is: "Values-made-structural" is precisely the 3-face junction phenomenology — STRUCTURE + REGENERATION + VALUES, not just VALUES alone. The "loudest string" reading at F10 Ether reflects the felt-sense but the structural reality is a vertex measurement. See Section 5 for full rationale. | HIGH (Procedure C semantic match + Lock #8.9 vertex slot activated) |

**Total: 29 face-KPIs + 4 edge-KPIs + 1 vertex-KPI = 34 ✓**

---

## Section 4 — Procedure C vs v2 Comparison Table

The following 5 placements CHANGED between v2 (Procedure B-leaning) and v3 (Procedure C canonical Songbook):

| # | BSC ID | KPI Name | v2 Placement (Procedure B) | v3 Placement (Procedure C) | Rationale for change |
|---|--------|----------|----------------------------|-----------------------------|----------------------|
| 1 | BSC.F8 | Founder-borne infrastructure costs | (F11, Fire, O2) | **(F1, Earth, O2)** | v2 followed s58 line 89 ("F4-fin=0.1 (Fire)" — but BSC.F4 = Donation, not Founder-borne). v2 misread the s58 label "F4-fin" as BSC.F8. Songbook v2.1 R12 canonical: BSC.F8 at F1 Earth O2 — "Founder-subsidy = quantifiable material burden." |
| 2 | BSC.L4 | Marketing capability operational | (F3, Air, O1) inferred | **(F3, Fire, O1)** | v2 inferred Air ("relational-clarity function of team"). Songbook v2.1 R34 canonical: F3 Fire — "F3 precedent Fire — role-filled-and-producing is capability-operational." Both placements silent at 0 (capability absent); E_f impact = 0. Procedure C corrects to canonical inquiry. |
| 3 | BSC.L8 | SDG alignment in PVM | (F10, Ether, O2) | **Vertex V13 (F4 ∩ F9 ∩ F10, O2)** | v2 placed at F10 Ether per Songbook v2.1 R38. v3 promotes to Vertex V13: SDG alignment in PVM is irreducibly 3-face (Structure + Regeneration + Values). See Section 5 for full vertex-promotion rationale. **Significant E_f impact:** F10/O2 drops from 0.2814 (Gate) to 0.1818 (Gate) — see Section 7. |
| 4 | BSC.C7 | NGCLP students enrolled | (F5, Ether, O3) inferred | **(F5, Earth, O3)** | v2 inferred Ether (meaning/integrity). Songbook v2.1 R19 canonical: F5 Earth — "Count-of-students pattern. Curriculum (L5) = F2 Air; students (C7) = F5 Earth — complementary across faces." Both placements silent at 0 (0 students currently). E_f impact = 0 at O3 layer (already at logistic floor). |
| 5 | BSC.L5 | NGCLP curriculum delivered | (F2, Fire, O3) inferred | **(F2, Air, O3)** | v2 inferred Fire (transformation/program-activation). Songbook v2.1 R35 canonical: F2 Air — "F2 precedent Air. Curriculum-ready = knowledge made connectable." Both silent at 0. E_f impact = 0 at O3 layer. |

**Net E_f impact of v2→v3 corrections:**
- O1 layer: **Δ = 0 across all 12 faces** (L4 silent at both Air and Fire)
- O2 layer: F1 unchanged, F10 DROPS (L8 vertex promotion); F11 DROPS (BSC.F8 moves to F1)
- O3 layer: Δ = 0 (all changes are silent-cell relocations)

---

## Section 5 — Edge-KPI Subsection (4 Pre-Validated + 1 NEW Candidate Tested)

### Pre-validated edge promotions (4) — confirmed under Procedure C

| Edge ID | Faces | KPI | Octave | Edge canonical KPI name | Procedure C verification | Confidence |
|---------|-------|-----|:------:|--------------------------|--------------------------|:----------:|
| **E7-11** | F7 Brand ↔ F11 Funding | BSC.F4 Donation income/quarter | O2 | "Reputation-Funding Attraction" (mapping-context.json:165) | Edge inquiry "Does CEN's reputation attract aligned philanthropic capital?" maps exactly. The face-level Songbook placement (F11/O2/Fire "Are we adding to it?") is less semantically pure than the edge-level reputation↔funding bridge. **Verified.** | HIGH |
| **E2-10** | F2 Intellectual ↔ F10 Values | BSC.L7 Peace Charter screening | O2 | "Ethical IP Score" (s58 30-Edge Dataset line 58) | Edge inquiry "Is our knowledge grounded in and aligned with our core values?" maps exactly to a values-screening methodology. The face-level Songbook placement (F4/O2/Fire "Are we improving?") is generic process-improvement; the edge-level knowledge↔values bridge is the load-bearing semantic. **Verified.** | HIGH |
| **E10-12** | F10 Values ↔ F12 Risk | BSC.I3 GDPR compliance gaps closed | O1 | "Ethical Resilience" (s58 30-Edge Dataset line 79) | Edge inquiry "Do our values transform into resilience during a crisis?" maps exactly. The face-level Songbook placement (F12/O1/Earth "Are we structurally fragile? — Bus Factor") and the alternative (F4 — DMS/policy) both miss the values↔risk bridge that GDPR compliance IS. **Verified.** | HIGH |
| **E5-8** | F5 Market ↔ F8 Operations | BSC.C8 AI governance consulting clients | O1 | "Brand-Experience Coherence" (s58 30-Edge Dataset line 69) | Edge inquiry "Does market feedback transform into operational improvements?" maps to closed consulting clients as the market-operations feedback loop. The face-level Songbook placement (F5/O1/Air "Is it understood? — Quality of Feedback from listeners") captures market-perception but misses the F5↔F8 transaction (market accepts → operations delivers). **Verified.** | HIGH |

### 5th edge promotion candidate — TESTED and REJECTED

**Original hypothesis:** BSC.L8 SDG alignment in PVM → Edge E9-10 (F9 Regenerative ↔ F10 Values).

**Verdict: REJECTED** — but for a critical reason: **E9-10 is NOT in the canonical 30-edge set.**

Per the verified canonical 30 edges (s58 30-Edge Dataset 2026-05-16):
```
E1-2, E1-6, E1-7, E1-8, E1-10, E2-3, E2-6, E2-10, E2-11,
E3-4, E3-6, E3-9, E3-11, E4-5, E4-6, E4-7, E4-9, E5-7, E5-8, E5-9, E5-12,
E6-7, E7-8, E8-10, E8-12, E9-11, E9-12, E10-11, E10-12, E11-12
```

E9-10 was in `mapping-context.json` (which had ~41 non-canonical edges pre-s58 architectural correction) but was REMOVED in the s58 canonical 30-edge set. F9 Regenerative Flow and F10 Foundational Values do NOT share a geometric edge on the dodecahedron.

**Therefore L8 cannot be promoted to E9-10 because that edge does not exist in the canonical architecture.**

L8 must be placed at a face OR a vertex. See Section 5.B below for the vertex test.

### 5.B — L8 vertex-promotion test (Procedure C semantic match across 6 candidate positions)

**KPI:** BSC.L8 SDG alignment in PVM (Sustainable Development Goals alignment in Purpose-Vision-Mission document).
**Current state:** Absent from PVM. **Target:** SDG statement added.

**6 candidate positions tested:**

| Candidate | Position | Canonical Inquiry | Semantic match analysis | Score |
|-----------|----------|--------------------|--------------------------|:-----:|
| **C1** | (F10, Ether, O2) | "Does the team feel the culture is authentic? — Cultural Integrity Score" | L8 measures DOCUMENT ARTIFACT content (SDG statement IN PVM), not team-felt culture. Songbook rationale "Values-made-structural" is correct directionally but the F10/Ether inquiry is about felt-sense culture; L8 is about codified document content. **Partial match: 6/10** | 6/10 |
| **C2** | (F9, Ether, O2) | "Are our operations healing or harming? — Operational Regeneration Index" | L8 measures statement codification, not operations behavior. SDGs are ecological commitment but the act of ADDING them to PVM is documentary, not operational. **Weak match: 4/10** | 4/10 |
| **C3** | (F9, Ether, O1) | "Are we connected to the larger whole? — Felt Connection to Planetary Purpose" | L8 is structural (binary: in PVM or not), not felt-sense. Closer than F9/O2/Ether but still misses the document-codification dimension. **Weak match: 5/10** | 5/10 |
| **C4** | (F4, Ether, O2) | "Do our processes feel coherent? — Simplicity & Elegance" | F4 captures structural codification but Ether at F4 is about process aesthetics, not value-content. **Weak match: 4/10** | 4/10 |
| **C5** | (F12, Ether, O2) | "Will our values hold up under extreme pressure? — Ethical Resilience Score" | SDGs are not directly about resilience under pressure. **Weak match: 3/10** | 3/10 |
| **V13** | F4 ∩ F9 ∩ F10, O2 | "Structure-Regeneration-Values triad — Where structure improves, CEN's values and regenerative flow can fully express" (mapping-context.json:191) | L8 is IRREDUCIBLY 3-face: F4 (PVM = document codification = STRUCTURAL form), F9 (SDGs = ecological/regenerative commitment), F10 (PVM = VALUES articulation; SDG alignment IS values-coherence with planetary stewardship). The act of codifying ecological-regenerative commitment INTO the foundational values document REQUIRES all three faces simultaneously. No single face captures the act. **Strong match: 10/10** | **10/10** |
| **V18** | F9 ∩ F10 ∩ F12, O2 | "Regeneration-Values-Resilience" — "Strong values and regeneration but zero resilience — brittle vessel" | L8 doesn't measure resilience. SDGs are regenerative commitment but not protection against shocks. **Weak match: 5/10** | 5/10 |

**Verdict: L8 → Vertex V13 (Structure-Regeneration-Values triad, O2).** Strongest semantic match across all candidates. The 3-face span (F4 + F9 + F10) is irreducible.

### Architectural significance of L8 vertex promotion

1. **L8 is the first vertex-KPI in CEN's dataset.** v2 reported 0 vertex-KPIs; v3 reports 1.
2. **F9 architectural-blindness finding is PRESERVED** — F9 Regenerative Flow still has zero FACE-KPIs at any octave. L8 sits at a vertex bridging F9, not at F9 itself.
3. **F10 Ether becomes empty in O2** — Previously L8=0.8 at F10 Ether; now empty (vertex placement). This significantly drops F10's O2 face energy (see Section 7).
4. **V13 was identified in mapping-context.json as a "synergy_hub" classification** with vortexStrength=0.25 — pre-Procedure C the vortex was computed from face energies only (no KPI-content attached). Now L8 occupies V13 as the first KPI-content for the vertex.
5. **Vertex-vortex calculations downstream** (post W1) should now incorporate L8's value (0.8 normalized — SDG alignment target met) into V13's vortex computation, not just compute from face energies.

### Edge octave distribution (4 edges)

| Octave | Count | Edges |
|:------:|:-----:|------|
| O1 | 2 | E5-8 (C8), E10-12 (I3) |
| O2 | 2 | E7-11 (F4), E2-10 (L7) |
| O3 | 0 | — |

### Vertex octave distribution (1 vertex)

| Octave | Count | Vertex |
|:------:|:-----:|------|
| O1 | 0 | — |
| O2 | 1 | V13 (L8) |
| O3 | 0 | — |

---

## Section 6 — Vertex-KPI Subsection: Re-test Under Procedure C

### V13 occupied (NEW — see Section 5.B)

**V13 (F4 ∩ F9 ∩ F10): BSC.L8 SDG alignment in PVM (Structure-Regeneration-Values triad)**

### Other 19 vertex candidates re-tested

Each remaining vertex was tested for question-spanning under Procedure C. For each, the question asked: "Does any of CEN's 34 KPIs answer the vertex's 3-face triadic inquiry better than any single face?"

| Vertex | Faces | Triad emergent name (mapping-context.json) | CEN KPIs tested | Verdict |
|--------|-------|--------------------------------------------|-----------------|---------|
| V1 | F1, F2, F3 | "Knowledge-Capital-Human Hub" | No KPI requires all 3 simultaneously | NOT USED |
| V2 | F1, F3, F4 | "Resource-People-Structure Point" | No KPI requires all 3 | NOT USED |
| V3 | F1, F4, F5 | "Finance-Structure-Market Triangle" | No KPI requires all 3 | NOT USED |
| V4 | F1, F5, F6 | "Finance-Market-Community Point" | No KPI requires all 3 | NOT USED |
| V5 | F1, F2, F6 | "Knowledge-Finance-Community" | No KPI requires all 3 | NOT USED |
| V6 | F2, F3, F8 | "Knowledge-Human-Operations" | No KPI requires all 3 | NOT USED |
| V7 | F3, F4, F9 | "Founder-Structure-Regeneration" | No KPI requires all 3 (F9 empty) | NOT USED |
| V8 | F4, F5, F10 | "Structure-Market-Values Triad" | No KPI requires all 3 | NOT USED |
| V9 | F5, F6, F11 | "Market-Community-Pipeline" | No KPI requires all 3 | NOT USED |
| V10 | F2, F6, F7 | "Knowledge-Community-Brand" | No KPI requires all 3 | NOT USED |
| V11 | F2, F7, F8 | "Knowledge-Brand-Operations" | No KPI requires all 3 | NOT USED |
| V12 | F3, F8, F9 | "Founder-Operations-Regeneration" | F9 empty; no KPI requires all 3 | NOT USED |
| **V13** | **F4, F9, F10** | **"Structure-Regeneration-Values"** | **BSC.L8 SDG alignment in PVM** | **USED — first vertex-KPI** |
| V14 | F5, F10, F11 | "Market-Values-Funding Paradox" | No KPI requires all 3 | NOT USED |
| V15 | F6, F7, F11 | "Community-Brand-Funding" | No KPI requires all 3 | NOT USED |
| V16 | F7, F8, F12 | "Brand-Operations-Resilience" | No KPI requires all 3 | NOT USED |
| V17 | F8, F9, F12 | "Operations-Regeneration-Resilience" | F9 empty; no KPI requires all 3 | NOT USED |
| V18 | F9, F10, F12 | "Regeneration-Values-Resilience" | L8 tested (weak match 5/10); no KPI requires all 3 | NOT USED |
| V19 | F10, F11, F12 | "Values-Pipeline-Resilience" | No KPI requires all 3 | NOT USED |
| V20 | F7, F11, F12 | "Brand-Funding-Fortress" | No KPI requires all 3 | NOT USED |

**Total vertices used: 1 (V13). 19 vertices remain architecturally reserved.**

---

## Section 7 — Recomputed O1 Face Energies (Procedure C, Canonical)

**KEY FINDING:** O1 face energies under Procedure C are **IDENTICAL** to v2 O1 face energies. The single Procedure C change at O1 layer (L4 Air → Fire) is a silent-cell relocation (L4 = 0 at either position; capability currently absent). E_f impact = 0 across all 12 faces.

### Methodology (verbatim 7-step pentagramic — unchanged)

```
Constants: α = φ⁻¹ = 0.6180339887498948, β = 0.5, γ = 0.7, κ = 4

For face F with elements k₁=Earth, k₂=Water, k₃=Fire, k₄=Air, k₅=Ether (each ∈ [0,1]):
Step 1: K̄ = mean(k₁..k₅)
Step 2: Star pairs s_i for skip-pairs (1,3), (2,4), (3,5), (4,1), (5,2): s_i = α·((k_i+k_j)/2) + (1-α)·(k_i × k_j)
Step 3: Intersection nodes p_i = β·s_i + (1-β)·s_{(i mod 5)+1}
Step 4: P = mean(p_i)
Step 5: C = γ·K̄ + (1-γ)·P
Step 6: E_f = 1/(1 + exp(-κ·(C - 0.5)))
Step 7: Band classification: Wall [0, 0.146) / Gate [0.146, 0.382) / Membrane [0.382, 0.618) / Hemorrhage [0.618, 0.854) / Vortex [0.854, 1.0]
Logistic floor: when all elements = 0, E_f ≈ 0.1192 → Wall
```

### O1 element inputs per face (Procedure C)

| Face | Earth | Water | Fire | Air | Ether | O1 KPIs |
|------|:-----:|:-----:|:----:|:---:|:-----:|---------|
| F1 Financial Capital | 0.5 | 0.0 | 0.0 | 0.3 | 0.5 | F1 (Earth), F3 (Fire silent), F2 (Air), F7 (Ether) |
| F2 Intellectual Capital | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | (silent at O1) |
| F3 Human Capital | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | L4 (Fire silent — corrected from v2 Air) |
| F4 Structural Capital | 0.0 | 0.0 | 0.0 | 0.2 | 0.0 | I1 (Earth silent), I2 (Fire silent), I4 (Air); I3 to edge |
| F5 Market Resonance | 0.2 | 0.0 | 0.0 | 0.0 | 0.0 | C3 (Earth); C8 to edge |
| F6 Community | 0.4 | 0.0 | 0.0 | 0.0 | 0.0 | C1 (Earth) |
| F7 Brand & Reputation | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | (silent at O1) |
| F8 Core Operations | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | (silent at O1) |
| F9 Regenerative Flow | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | (silent — architectural blindness) |
| F10 Foundational Values | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | (silent at O1) |
| F11 Funding Pipeline | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | (silent at O1) |
| F12 Risk & Resilience | 0.0 | 0.4 | 0.0 | 0.0 | 0.0 | I8 (Water); I3 to edge |

### Per-face 7-step computation walkthrough

#### F1 Financial Capital (O1)

**Inputs:** [0.5, 0.0, 0.0, 0.3, 0.5]
- Step 1: K̄ = 0.2600
- Step 2: s = [0.1545, 0.0927, 0.1545, 0.3045, 0.1545]
- Step 3: p = [0.1236, 0.1236, 0.2295, 0.2295, 0.1545]
- Step 4: P = 0.1721
- Step 5: C = 0.7·0.26 + 0.3·0.1721 = 0.2336
- Step 6: E_f = 1/(1+exp(-4·(0.2336-0.5))) = **0.2563**
- **Band: GATE**

#### F2 Intellectual Capital (O1)
**Inputs:** all zero → all steps zero → **E_f = 0.1192 (logistic floor) — Wall**

#### F3 Human Capital (O1)
**Inputs:** all zero (L4 silent at Fire) → **E_f = 0.1192 — Wall**

#### F4 Structural Capital (O1)
**Inputs:** [0.0, 0.0, 0.0, 0.2, 0.0] (only I4 Air=0.2)
- Step 1: K̄ = 0.0400
- Step 2: s = [0, 0.0618, 0, 0.0618, 0]
- Step 3: p = [0.0309, 0.0309, 0.0309, 0.0309, 0]
- Step 4: P = 0.0247
- Step 5: C = 0.0354
- Step 6: E_f = **0.1349 — Wall** (below 0.146 threshold)

#### F5 Market Resonance (O1)
**Inputs:** [0.2, 0.0, 0.0, 0.0, 0.0] (only C3 Earth=0.2)
- K̄ = 0.0400, P = 0.0247, C = 0.0354, **E_f = 0.1349 — Wall**

#### F6 Community (O1)
**Inputs:** [0.4, 0.0, 0.0, 0.0, 0.0] (only C1 Earth=0.4)
- K̄ = 0.0800, P = 0.0494, C = 0.0708, **E_f = 0.1523 — Gate**

#### F7 Brand & Reputation (O1)
**Inputs:** all zero → **E_f = 0.1192 — Wall**

#### F8 Core Operations (O1)
**Inputs:** all zero → **E_f = 0.1192 — Wall**

#### F9 Regenerative Flow (O1)
**Inputs:** all zero (architectural blindness) → **E_f = 0.1192 — Wall**

#### F10 Foundational Values (O1)
**Inputs:** all zero (I9, L8 are O2; I3 promoted to edge) → **E_f = 0.1192 — Wall**

#### F11 Funding Pipeline (O1)
**Inputs:** all zero (F5 BSC, F8 BSC are O2; F4 BSC promoted to edge) → **E_f = 0.1192 — Wall**

#### F12 Risk & Resilience (O1)
**Inputs:** [0.0, 0.4, 0.0, 0.0, 0.0] (only I8 Water=0.4)
- K̄ = 0.0800, P = 0.0494, C = 0.0708, **E_f = 0.1523 — Gate**

### O1 Face Energies Summary Table (CANONICAL v3)

| Face | Face Name | Earth | Water | Fire | Air | Ether | K̄ | P | C | **E_f (O1)** | Band |
|------|-----------|:-----:|:-----:|:----:|:---:|:-----:|----|----|----|:------------:|------|
| F1 | Financial Capital | 0.5 | 0.0 | 0.0 | 0.3 | 0.5 | 0.2600 | 0.1721 | 0.2336 | **0.2563** | Gate |
| F2 | Intellectual Capital | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **0.1192** | Wall |
| F3 | Human Capital | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **0.1192** | Wall |
| F4 | Structural Capital | 0 | 0 | 0 | 0.2 | 0 | 0.0400 | 0.0247 | 0.0354 | **0.1349** | Wall |
| F5 | Market Resonance | 0.2 | 0 | 0 | 0 | 0 | 0.0400 | 0.0247 | 0.0354 | **0.1349** | Wall |
| F6 | Community | 0.4 | 0 | 0 | 0 | 0 | 0.0800 | 0.0494 | 0.0708 | **0.1523** | Gate |
| F7 | Brand & Reputation | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **0.1192** | Wall |
| F8 | Core Operations | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **0.1192** | Wall |
| F9 | Regenerative Flow | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **0.1192** | Wall |
| F10 | Foundational Values | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **0.1192** | Wall |
| F11 | Funding Pipeline | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **0.1192** | Wall |
| F12 | Risk & Resilience | 0 | 0.4 | 0 | 0 | 0 | 0.0800 | 0.0494 | 0.0708 | **0.1523** | Gate |

**Statistical summary (v3 O1, identical to v2 O1):**
- Mean: 0.1483
- Median: 0.1192 (7 faces at logistic floor)
- Min: 0.1192 (F2, F3, F7, F8, F9, F10, F11)
- Max: 0.2563 (F1)
- Band distribution: **9 Wall + 3 Gate (F1, F6, F12) + 0 Membrane/+**

### O2 Face Energies (Procedure C — note L8 vertex impact)

Procedure C placements deconflate co-tags. Key Procedure C correction: BSC.F8 founder-borne costs at (F1, Earth, O2) per Songbook canonical. L8 vertex promotion empties F10 Ether.

**O2 element inputs per face:**

| Face | Earth | Water | Fire | Air | Ether | KPIs at O2 |
|------|:-----:|:-----:|:----:|:---:|:-----:|------------|
| F1 | 0.0 | 0.4 | 0.0 | 0.0 | 0.0 | F8-fin Earth=0 unquantified silent; F6-fin Water=0.4 |
| F2 | 0.0 | 0.0 | 0.0 | 0.6 | 0.0 | L2 Air=0.6 |
| F3 | 0.6 | 0.0 | 0.6 | 0.0 | 0.0 | L1 Earth=0.6, L3 Fire=0.6 |
| F4 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | I7 Earth=0 silent; L7 promoted to edge |
| F5 | 0.0 | 0.0 | 0.2 | 0.0 | 0.0 | C4 Water=0 silent, I6 Fire=0.2 |
| F6 | 0.0 | 0.25 | 0.3 | 0.0 | 0.0 | C2 Water=0.25, C6 Fire=0.3 |
| F7 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | C5 Air silent (unmeasured) |
| F8 | 0.0 | 0.4 | 0.0 | 0.0 | 0.0 | I5 Water=0.4 |
| F9 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | (silent) |
| F10 | 0.0 | 0.0 | 0.0 | 0.7 | 0.0 ← **L8 vertex** | I9 Air=0.7; L8 promoted to V13 (NOT at F10 Ether) |
| F11 | 0.0 | 0.1 | 0.0 | 0.0 | 0.0 | F5-fin Water=0.1; F4-fin promoted to edge; F8-fin moved to F1 |
| F12 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 | (silent) |

**O2 Face Energies Summary (v3 Procedure C):**

| Face | E_f (v3 O2) | Band | v2 O2 E_f | Delta v2→v3 |
|------|:-----------:|:----:|:---------:|:-----------:|
| F1 | **0.1523** | Gate | 0.1523 | 0 |
| F2 | **0.1715** | Gate | 0.1715 | 0 |
| F3 | **0.2466** | Gate | 0.2466 | 0 |
| F4 | **0.1192** | Wall | 0.1192 | 0 |
| F5 | **0.1349** | Wall | 0.1349 | 0 |
| F6 | **0.1665** | Gate | 0.1665 | 0 |
| F7 | **0.1192** | Wall | 0.1192 | 0 |
| F8 | **0.1523** | Gate | 0.1523 | 0 |
| F9 | **0.1192** | Wall | 0.1192 | 0 |
| F10 | **0.1818** | **Gate** ← shifted | 0.2814 (Gate) | **-0.0996** ← L8 vertex impact |
| F11 | **0.1268** | **Wall** ← shifted | 0.1349 (Wall) | **-0.0081** ← F8-fin relocated to F1 |
| F12 | **0.1192** | Wall | 0.1192 | 0 |

**Significant deltas:**
- **F10 O2 drops from 0.2814 to 0.1818** (delta -0.0996). L8 vertex promotion removes the Ether=0.8 contribution. F10 stays in Gate band but moves down significantly. **Honest interpretation:** F10/O2 was carried by L8's Ether content in v2; with L8 correctly identified as a 3-face vertex phenomenon, F10/O2 reflects only I9 Air=0.7. The face still has gate energy from values-document-articulation (I9) but loses the values-codification-of-ecological-commitment (L8 — now at V13).
- **F11 O2 drops from 0.1349 to 0.1268** (delta -0.0081). Marginal — BSC.F8 was at F11 Fire=0.1 in v2; Procedure C relocates to F1 Earth (unquantified, silent). F11 stays in Wall band.

### O3 Face Energies (Procedure C)

C7 (F5 Earth) and L5 (F2 Air) Procedure C corrections vs v2 (both were at different elements). All O3 KPIs are silent at value 0 → no E_f impact at O3 layer.

| Face | E_f (v3 O3) | Band | v2 O3 E_f | Delta |
|------|:-----------:|:----:|:---------:|:-----:|
| F1 | 0.1192 | Wall | 0.1192 | 0 |
| F2 | 0.1192 | Wall | 0.1192 | 0 |
| F3 | 0.1192 | Wall | 0.1192 | 0 |
| F4 | 0.1192 | Wall | 0.1192 | 0 |
| F5 | 0.1192 | Wall | 0.1192 | 0 |
| F6 | **0.1889** | Gate | 0.1889 | 0 |
| F7-F12 | 0.1192 | Wall | 0.1192 | 0 |

---

## Section 8 — Comparison: v2 O1 vs v3 O1 Face Energies

| Face | v2 O1 E_f | **v3 O1 E_f (Procedure C)** | Delta | Band shift |
|------|:---------:|:----------------------------:|:-----:|:----------:|
| F1 | 0.2563 | **0.2563** | 0.0000 | Gate (no shift) |
| F2 | 0.1192 | **0.1192** | 0.0000 | Wall (no shift) |
| F3 | 0.1192 | **0.1192** | 0.0000 | Wall (no shift) |
| F4 | 0.1349 | **0.1349** | 0.0000 | Wall (no shift) |
| F5 | 0.1349 | **0.1349** | 0.0000 | Wall (no shift) |
| F6 | 0.1523 | **0.1523** | 0.0000 | Gate (no shift) |
| F7 | 0.1192 | **0.1192** | 0.0000 | Wall (no shift) |
| F8 | 0.1192 | **0.1192** | 0.0000 | Wall (no shift) |
| F9 | 0.1192 | **0.1192** | 0.0000 | Wall (no shift) |
| F10 | 0.1192 | **0.1192** | 0.0000 | Wall (no shift) |
| F11 | 0.1192 | **0.1192** | 0.0000 | Wall (no shift) |
| F12 | 0.1523 | **0.1523** | 0.0000 | Gate (no shift) |

**Net delta at O1 layer: 0 across all 12 faces.** The Procedure C correction at O1 (BSC.L4 Air → Fire) is a silent-cell relocation with zero E_f impact.

**This is a robustness finding:** The O1 canonical face energies are stable under Procedure A→B→C methodological refinement at the O1 layer. The architectural blindness findings (F9 Wall at floor; 6 of 12 faces shifting Gate→Wall under O1-only) are preserved. The thesis-defense centerpiece (F9 delta = -0.681) is unaffected.

### Major v2→v3 deltas at OTHER layers

| Layer | Face | v2 E_f | v3 E_f | Delta | Driver |
|-------|------|:------:|:------:|:-----:|--------|
| O2 | **F10** | 0.2814 | **0.1818** | **-0.0996** | L8 vertex promotion empties F10 Ether |
| O2 | F11 | 0.1349 | 0.1268 | -0.0081 | BSC.F8 relocated F11 Fire → F1 Earth |

All other O2 and O3 face energies unchanged.

---

## Section 9 — Items Flagged for Partnership-Discussion

### Item 1 — L8 Vertex Promotion Validation

**Issue:** L8 (SDG alignment in PVM) is the first vertex-KPI in CEN's dataset. The promotion from F10 Ether (v2, Songbook v2.1 canonical) to V13 (v3, Procedure C semantic match) is a significant architectural decision.

**Trade-offs:**
- **Pro V13 promotion:**
  - Semantic purity: SDG-in-PVM bridges Structure (document codification) + Regeneration (SDGs) + Values (PVM) irreducibly
  - Preserves F9 architectural-blindness finding (F9 still empty)
  - Activates V13 vertex slot for first time (mapping-context.json:191 had V13 classified as "synergy_hub" with vortexStrength=0.25 pre-KPI-content)
- **Con V13 promotion:**
  - Songbook v2.1 R38 canonical placed L8 at (F10, Ether, O2) with rationale "Values-made-structural. CEN's loudest string."
  - F10/O2 drops from 0.2814 (Gate) to 0.1818 (Gate, still) — the "loudest string" felt-sense at F10 may be analytically dimmed
  - Vertex KPI placement is unprecedented in prior CEN architecture (v1, v2 both reported 0 vertex-KPIs)

**Partnership decides:**
- Option A: Promote L8 to V13 (current v3 recommendation) — semantic purity wins
- Option B: Keep L8 at (F10, Ether, O2) per Songbook v2.1 canonical — preserves "loudest string" felt-sense at F10
- Option C: Document L8 at BOTH positions (V13 primary + F10 Ether secondary) with cross-reference — violates Lock #8.9 structural-uniqueness; explicitly rejected

**Recommendation:** Option A — Procedure C semantic match is rigorous; the F10 Ether placement reflected the Songbook's pre-vertex-detection bias toward face placements. The "loudest string" rhetoric is preserved at the vertex level (V13 IS where the structural-regenerative-values triad sings loudest), just at a different geometric resolution.

### Item 2 — L4 Songbook Canonical Placement (F3 Fire vs v2 inferred F3 Air)

**Issue:** v2 inferred L4 at (F3, Air, O1) based on cluster + element-availability heuristics. Songbook v2.1 R34 canonical places L4 at (F3, Fire, O1) with rationale "F3 precedent Fire — role-filled-and-producing is capability-operational."

**Resolution:** Procedure C honors Songbook canonical → L4 at (F3, Fire, O1). Both positions silent at 0 (L4 capability currently absent), so E_f impact = 0 at O1 layer. The relocation is methodologically purer.

**Partnership confirms:** L4 at F3 Fire is the canonical inquiry "Are you growing? — Hours Spent in Learning/Development." This frames marketing-capability-operational as a growth/learning measure within Human Capital, not a relational-clarity measure.

---

## Section 10 — Honest Disclosures

### Methodological choices made

1. **Procedure C as canonical priority:** Songbook v2.1 sheet "34 KPI Mappings" provides the canonical face-element-octave placement for each of CEN's 34 KPIs with rationale. v3 uses these as the primary source. Lock #8.9 edge promotions OVERRIDE the Songbook face placements for 4 boundary-case KPIs (already partnership-validated). Vertex promotion for L8 emerges from question-answer semantic matching across all 7 candidate positions.

2. **No silent face cells re-tagged:** Where Songbook v2.1 places a KPI at a coordinate where the value is currently 0 (e.g., L4 silent at F3 Fire), Procedure C preserves the placement. The silent cell carries the KPI's structural identity even when the measurement value is below perception threshold (zeroEnergy principle).

3. **Vertex detection rigorously applied:** Each of the 20 canonical vertices was tested against the 34 KPIs under Procedure C. Only V13 emerged as a match. 19 vertices remain architecturally reserved but unoccupied.

4. **F10 O2 drop honestly disclosed:** L8 vertex promotion removes the largest single element contributor (Ether=0.8) from F10. This drops F10's O2 face energy from 0.2814 to 0.1818. The "loudest string" finding at F10 (per Songbook rhetoric) needs reframing — the strength was at the F4∩F9∩F10 vertex, not at F10 alone.

### Uncertainties and known limitations

1. **L8 vertex-vortex computation impact (DEFERRED to W1):** With L8 at V13, the vertex's vortexStrength + chirality values in `mapping-context.json:191` (currently 0.25 / clockwise / 0.50) need recomputation. The current values were derived from face energies only; with L8 content attached (normalized value 0.8 — SDG alignment achieved if target met), V13's vortex computation shifts. This is W1 §6 work, not W0.6.

2. **F11 O2 thinness:** With BSC.F8 founder-borne costs relocated to F1 (unquantified silent), F11 O2 layer has only BSC.F5 SCMS at Water=0.1. F11 O2 E_f drops from 0.1349 to 0.1268 — still Wall, near logistic floor. CEN's funding-pipeline structural-tier measurement is even thinner than v2 suggested.

3. **BSC.F8 value disambiguation:** §1.3 says "High (unquantified)" current state. Procedure C places at (F1, Earth, O2) per Songbook but doesn't resolve the value. Conservative assignment: silent at 0 (unquantified = below perception). Partnership may want to assign a value (e.g., 0.7 to reflect HIGH burden) post-quantification.

4. **L8 value inheritance to V13:** L8's s58 value was 0.8 (Ether at F10). When L8 moves to V13, does the 0.8 value transfer to V13's vortex computation? Procedure C says yes — the KPI carries its value to its new structural position. W1 computation should use L8=0.8 as V13's KPI-content.

### What 3-octave layering + Procedure C reveals beyond v2

1. **First vertex-KPI in CEN data:** L8 → V13. This validates the Lock #8.9 vertex slot architecture.
2. **F9 architectural blindness is methodology-invariant:** Under v1 (Strategy Map), v2 (s58 element-tag), v3 (Procedure C), F9 remains silent across all octaves. The thesis-defense centerpiece (delta = -0.681) is robust.
3. **F10 felt-sense at structural reality:** v2's F10=0.2814 (Gate) felt like a strong values face. v3 reveals this strength was actually a vertex phenomenon (V13: F4 ∩ F9 ∩ F10). F10 alone at O2 is 0.1818 — still Gate, but the "loudest string" is more accurately a "loudest triad."
4. **Procedure C robustness at O1:** Identical O1 face energies under Procedure C and Procedure B at the O1 layer confirms the architectural-blindness findings are not artifacts of methodology choice.

### Confidence distribution

| Confidence | Count | KPIs |
|-----------|:-----:|------|
| **HIGH** | 32 | All KPIs except L8 (vertex promotion requires partnership) and L4 (Songbook canonical placement difference from v2 inference) |
| **MEDIUM** | 2 | L8 (V13 promotion vs F10 Ether — partnership decides); L4 (F3 Fire vs v2 inferred F3 Air — Songbook canonical wins but both silent) |
| **LOW** | 0 | — |

All MEDIUM placements have explicit honest disclosure and partnership-discussion items in Section 9.

---

## Section 11 — Walkthrough Sequence for Partnership Validation

Recommended sequence with Deimantas (~1.5 hours):

1. **Confirm Procedure C methodology** (10 min) — question-answer matching against canonical Songbook v2.1 inquiries
2. **Confirm Songbook v2.1 canonical mappings** (10 min) — review the "34 KPI Mappings" sheet structure
3. **Walk through 4 edge promotions** (10 min) — confirm all 4 still hold under Procedure C; E9-10 correctly rejected (not in canonical 30)
4. **Walk through L8 vertex promotion to V13** (20 min) — review the 6-position semantic match analysis; partnership decides Option A (V13) vs Option B (F10 Ether)
5. **Walk through 4 other v2→v3 changes** (15 min) — BSC.F8 (F1 Earth), L4 (F3 Fire), C7 (F5 Earth), L5 (F2 Air) — Songbook canonical wins in all
6. **Walk through O1 face energies — robustness confirmation** (10 min) — Procedure C identical to v2 at O1; architectural-blindness findings preserved
7. **Walk through F10 O2 drop** (10 min) — L8 vertex impact reframes "loudest string" as "loudest triad" (V13)
8. **Lock the final mapping → feeds W1 + W2 SSOT build** (5 min)

---

## End of W0.6 v3 proposed mapping

**Next step:** Partnership-validation walkthrough with Deimantas. Then update W0 Consolidation Map §6.5 with Procedure C as the canonical methodology and V13 as the first occupied vertex. Feeds W1 audit-trail extension (vertex-vortex recomputation with L8 content) + W2 SSOT v1.0 xlsx build.

**Cross-references:**
- Constitutional anchor: `Final Thesis/Thesis Work/spiral-reports/CEN_SSOT_Wave0_Consolidation_Map_2026-05-21.md` §6.5
- Source of canonical inquiries: `POC/deliverables/POC_420_Songbook_v2.1_Full34_2026-04-18.xlsx` sheet "The 420 Inquiries" (420 rows)
- Source of KPI canonical mappings: same xlsx sheet "34 KPI Mappings" (34 rows)
- Methodological canonical (Procedure A reference): `Final Thesis/Thesis Work/Masters Preparation/Mathematical Depth/CEN_Strategy_Map_Spiral_Operationalization_v0.2_master_2026-05-05.md`
- Element-tag source (Procedure B reference): `Final Thesis/Thesis Work/spiral-reports/CEN_Face_Energies_Pentagramic_s58_2026-05-16.md` lines 77-91
- Edge canonical 30: `Final Thesis/Thesis Work/spiral-reports/CEN_30Edge_Dataset_s58_2026-05-16.md` (verified — E9-10 NOT in canonical set)
- Vertex canonical 20: `POC/companies/cen/mapping-context.json` lines 178-199 (V13 line 191)
- Superseded prior mapping (v2): `Final Thesis/Thesis Work/spiral-reports/CEN_SSOT_W06v2_34KPI_3Octave_Mapping_2026-05-21.md`
