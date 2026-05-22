# CEN SSOT Architecture Mirror (POC reference)

**Mirrored:** 2026-05-22 (session-close)
**Source workspace:** `Final Thesis/Thesis Work/spiral-reports/`
**Purpose:** POC-internal preservation of architectural findings + decisions from the CEN Spiral Dashboard SSOT build. POC future-development reads these as canonical reference; Final Thesis stays the active SSOT-build location.

---

## Why this mirror exists

The CEN SSOT build (W0+W1 complete as of 2026-05-22) produced architectural decisions that **define how the POC engine works** — not just CEN-specific artifacts. Examples:

- Lock #8.24 — Bi-Directional Co-Evolution Architecture (defines how 50 Elemental Influence Signatures couple element changes back to edges/vertices)
- Lock #8.19 — Chirality → SequenceConcavity rename (engine code change applied)
- Lock #8.20 — DominantMode naming collision (spectral interpretation reference)
- Lock #8.22 — Pure-O1 face energy recomputation (canonical CEN baseline)
- Constants Sensitivity Analysis — engine constant tuning reference for future companies

These artifacts originated in Final Thesis spiral-reports (the active SSOT-build location), but they encode POC engine architecture. Without this mirror, future POC development would either re-discover the same architecture from scratch OR depend on cross-workspace reading of Final Thesis — both fragile.

**Per Deimantas (2026-05-22 partnership-decided):** *"It's also very very important to have those kinds of architectural findings and decisions in the POC itself for future work and development of the POC workspace."*

---

## Snapshot semantics

These files are **snapshots as of 2026-05-22**. If Final Thesis updates a source artifact (e.g., during active W2-W4 build), the POC mirror MAY diverge. Resolution protocol:

| Question | Answer |
|----------|--------|
| Which is authoritative during active build? | Final Thesis source (active editing location) |
| Which is authoritative for POC engine code references? | POC mirror (snapshot at the architectural-lock point) |
| Should POC mirror be re-synced periodically? | Yes — at Wave boundaries (W2 close, W3 close, W4 close) and at major architectural locks |
| Are these files git-tracked in POC? | Yes (POC has live git; Final Thesis has unsynced git as of 2026-05-22) |

**Update protocol:** When Final Thesis lands a new architectural-lock-grade artifact, partnership-decide whether to re-mirror to POC. Don't auto-sync; partnership preserves intentionality.

---

## Artifact inventory

| # | File | Purpose | POC engine connection |
|---|------|---------|----------------------|
| 1 | `CEN_SSOT_Wave0_Consolidation_Map_2026-05-21.md` | Constitutional reference — 24 architectural locks (#8.1-#8.24), Section 0 TL;DR for cold readers | All engine architecture decisions trace here |
| 2 | `CEN_SSOT_BiDirectional_CoEvolution_Architecture_2026-05-22.md` | Lock #8.24 — how element-level KPI changes propagate to edges/vertices via 50 signatures | Future engine: `js/core/BiDirectionalCoupling.js` (not yet built) |
| 3 | `CEN_SSOT_BiDirectional_Signatures_30Edge_20Vertex_2026-05-22.md` | 50 Elemental Influence Signatures (30 edges + 20 vertices); 120/120 sum-to-1.0 validated | Future engine: 50-signature lookup table; 5 KPI-carrying partnership-validated |
| 4 | `CEN_SSOT_Constants_Sensitivity_Analysis_2026-05-22.md` | Per-constant tuning analysis (α, β, γ, κ, λ, δ); identified stale `mapping-context.json:323-334` tuning block | Engine reference for future company-specific tuning + thesis Constants chapter |
| 5 | `CEN_F8_Provenance_Template_2026-05-21.md` | Canonical 16-column provenance template (raw → 5-element → face energy → dashboard) | Engine reference for ALCOA+ traceability; replicable per face/edge/vertex |
| 6 | `CEN_SSOT_Sheet09_BiDirectional_Layout_Design_2026-05-22.md` | Drop-in-ready W2 xlsx Sheet 09 spec — 30 edges + 20 vertices with bi-directional coupling | Future engine bridge: signatures-to-xlsx mapping |
| 7 | `CEN_SSOT_OctaveAware_Questions_30Edge_20Vertex_2026-05-22.md` | 150 octave-specific questions (30 edges × 3 octaves + 20 vertices × 3 octaves) | Coherence Probe instrument design + Sheet 16 tooltips |
| 8 | `CEN_SSOT_Sheet14_Spectral_Layout_Design_2026-05-21.md` | Drop-in-ready W2 xlsx Sheet 14 spec — Spectral Δ vector with Performance verdicts | Reads from `js/spectral-analyzer.js` (Mode 5 canonical for CEN at O1) |
| 9 | `CEN_SSOT_Sheet16_Dashboard_Layout_Design_2026-05-21.md` | Drop-in-ready W2 xlsx Sheet 16 spec — CEN-facing dashboard view | Consumes engine outputs; renders traffic-light + breath polarities |
| 10 | `CEN_SSOT_PureO1_Recomputation_2026-05-21.md` | Pure-O1 canonical face energies (Lock #8.22): 9 Wall + 3 Gate + 0 Membrane band | Canonical baseline for CEN; tests in `tests/cen-pure-o1.test.js` (future) |
| 11 | `CEN_SSOT_W2_Entry_Checklist_2026-05-21.md` | Drop-in-ready W2 build entry checklist | Build script: `scripts/_build_cen_ssot_xlsx.py` |
| 12 | `CEN_SSOT_Mode5_Deep_Interpretation_2026-05-22.md` | Mode 5 spectral deep interpretation — highest-leverage harmonization action for CEN; U[:,4] eigenvector analysis; bi-directional carrier-edge identification (E1-8 + E3-9) | Connects `js/spectral-analyzer.js:142-153` (U matrix) → bi-directional intervention design |

---

## What's NOT mirrored (intentionally)

These files stay in Final Thesis only (process artifacts, not POC architecture):

- `CEN_SSOT_W06_34KPI_Proposed_Mapping_2026-05-21.md` (superseded by v3)
- `CEN_SSOT_W06v2_34KPI_3Octave_Mapping_2026-05-21.md` (superseded by v3)
- `CEN_SSOT_W06v3_34KPI_QuestionDerived_Mapping_2026-05-21.md` (KPI mapping iteration — process not engine)
- `CEN_SSOT_W1_Final_Spiral_2026-05-21.md` (spiral process artifact)
- `Session_Handoff_CEN_SSOT_2026-05-21.md` (live handoff — stays at session-tracking location)

The KPI mapping v3 IS engine-relevant (which BSC KPI lives where in geometry), but the FINDING is captured in the Wave 0 Consolidation Map Lock #8.11. The process artifact stays separate from the architectural finding.

---

## Cross-references (POC-internal)

| POC file | Relevant CEN SSOT artifact |
|----------|---------------------------|
| `docs/math/CALCULATION_AUDIT_TRAIL.md` Sections 12-17 | Wave 0 Consolidation Map (Locks #8.18-8.24), BiDirectional Architecture |
| `js/core/Diagnostics.js` | Wave 0 Consolidation Map (Lock #8.11 AAG consolidation) |
| `js/advanced/vertex-analyzer.js` (chirality→sequenceConcavity) | Wave 0 Consolidation Map (Lock #8.19) |
| `js/spectral-analyzer.js` | Sheet 14 Spectral Layout Design, Wave 0 Lock #8.20 |
| `scripts/_build_cen_ssot_xlsx.py` | W2 Entry Checklist, Sheet 09/14/16 Layout Designs |
| `companies/cen/mapping-context.json` | Pure-O1 Recomputation (Lock #8.22 canonical baseline) |
| `companies/cen/company.json` | F8 Provenance Template (D=7/E=1 worked example) |

---

## Maintenance discipline

**Per §31 Cross-Workspace Tracker Row Protocol:** This mirror is POC-internal preservation, NOT a cross-workspace edit of Final Thesis. Don't modify Final Thesis source files from POC. If POC discovers a needed refinement to one of these artifacts:

1. Propose the refinement in POC memory or a POC-internal note
2. At next Final Thesis session, partnership-decide whether to update the Final Thesis source
3. After Final Thesis source updates, re-mirror to POC

This preserves Final Thesis as the editing location AND POC as the architecture-reference location.

**Per Never Delete Rule:** If a future session wants to "clean up" or "remove old artifacts" from this mirror, it must instead archive to `docs/cen-ssot/_archive/` with date stamp. The artifacts here are the durable architectural memory.

---

## Cross-workspace channel reference

The same architectural artifacts also live in `Final Thesis/Thesis Work/Quannex Business Exports/` mirror folder (per cross-workspace conventions). The chain is:

**Final Thesis source** → POC mirror (`docs/cen-ssot/`) → Quannex Business Exports mirror (`Final Thesis/Thesis Work/Quannex Business Exports/`)

POC mirror = engine-architecture reference. Quannex Business Exports mirror = client-delivery reference (for CEN to receive).
