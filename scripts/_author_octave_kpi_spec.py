#!/usr/bin/env python3
"""
Author POC/companies/cen/octave-kpi-spec.json per Lock #8.40.

VERBATIM FIDELITY: every question text + canonical name preserved character-
for-character from source markdown CEN_SSOT_OctaveAware_Questions_30Edge_20Vertex_2026-05-22.md.

Phase B.1a: questions + BSC placements + face narrative names + canonical names
Phase B.1b (separate script): signature 10-tuples / 15-tuples + rationale from
            CEN_SSOT_BiDirectional_Signatures_30Edge_20Vertex_2026-05-22.md

BSC KPI placements per Lock #8.36 (4 edge-KPIs + 0 vertex-KPIs):
  - E7-11 → BSC.F4 (Donation income/quarter)
  - E2-10 → BSC.L7 (Peace Charter screening procedure)
  - E10-12 → BSC.I3 (GDPR compliance gaps closed)
  - E5-8 → BSC.C8 (AI governance consulting clients)
  - V13 was BSC.L8 pre-Lock #8.36 reversion; CURRENT placement = F10 face per Lock #8.36
       (V13 octave questions preserved as historical context; bscKpiPlacement = null)
"""
import json
from pathlib import Path

OUT_PATH = Path(__file__).resolve().parent.parent / "companies" / "cen" / "octave-kpi-spec.json"

# ──────────────────────────────────────────────────────────────────────────
# EDGES — 30 entries verbatim from source markdown lines 75-321
# ──────────────────────────────────────────────────────────────────────────

EDGES = [
    {
        "edgeId": "E1-2", "faceA": 1, "faceB": 2,
        "faceANarrative": "Financial Fragility", "faceBNarrative": "Conceptual Depth",
        "canonicalName": "IP Monetization Potential",
        "baseQuestion": "How does CEN's conceptual richness translate into sustainable financial flow?",
        "o1Question": "Does CEN have any conversion path from its conceptual depth into cash that keeps the lights on? Are we surviving as an intellectually-rich-but-cash-fragile NGO, or has scarcity threatened the knowledge base itself?",
        "o2Question": "Is there a codified, repeatable monetization mechanism for CEN's IP — a structured pipeline from concept to revenue with documented stages?",
        "o3Question": "Does CEN's intellectual capital attract forward-looking funders and partners who recognize the conceptual depth as future-shaping value? Does the IP project a field-presence that pulls aligned resources?",
        "bscKpiPlacement": None,
    },
    {
        "edgeId": "E1-6", "faceA": 1, "faceB": 6,
        "faceANarrative": "Financial Fragility", "faceBNarrative": "Emerging Network",
        "canonicalName": "Community Investment Ratio",
        "baseQuestion": "How does capital flow to and from our community in a healthy way?",
        "o1Question": "Does CEN have any community-to-resource exchange keeping the organization alive — is the network paying any survival cost, or extracting all the energy?",
        "o2Question": "Is community engagement organized into systematic resource flow (membership tiers, contribution mechanisms, structured exchanges)? Is the give-and-take measurable and intentional?",
        "o3Question": "Does CEN's community signal forward as a generative ecosystem where the network's relational density attracts future investment, partnerships, and field-influence?",
        "bscKpiPlacement": None,
    },
    {
        "edgeId": "E1-7", "faceA": 1, "faceB": 7,
        "faceANarrative": "Financial Fragility", "faceBNarrative": "Quiet Credibility",
        "canonicalName": "Resonance ROI",
        "baseQuestion": "How do we communicate our financial value and story?",
        "o1Question": "Does CEN's reputation support its survival — does anyone outside the founders know enough to keep CEN financially alive in a crisis?",
        "o2Question": "Is brand-finance communication systematized — does CEN have a reliable pipeline from credibility events to financial conversions (press → donor calls; mention → grant invite)?",
        "o3Question": "Does CEN's reputation projects far enough into the world that mission-aligned funders are arriving unbidden, attracted by field-resonance the brand carries?",
        "bscKpiPlacement": None,
    },
    {
        "edgeId": "E1-8", "faceA": 1, "faceB": 8,
        "faceANarrative": "Financial Fragility", "faceBNarrative": "Underdeveloped Engine",
        "canonicalName": "Operational ROI",
        "baseQuestion": "How is our capital grounded in real, tangible operational work?",
        "o1Question": "Do CEN's operations consume more than they produce — are we operationally surviving, or is the engine burning through capital faster than it converts to outputs?",
        "o2Question": "Are CEN's operational systems codified into a unit-economics structure — cost-per-output documented, revenue-per-engagement tracked, conversion ratios measured?",
        "o3Question": "Does CEN's operational capacity project field-leadership — does the way we deliver embody the future of how mission-driven NGOs should operate?",
        "bscKpiPlacement": None,
    },
    {
        "edgeId": "E1-10", "faceA": 1, "faceB": 10,
        "faceANarrative": "Financial Fragility", "faceBNarrative": "Sacred Ground",
        "canonicalName": "Regenerative Capital Allocation",
        "baseQuestion": "How does our capital serve the highest purpose of regeneration?",
        "o1Question": "Is CEN spending its survival-stage resources in ways that even minimally honor its values — or are the survival pressures forcing values-betrayal?",
        "o2Question": "Are CEN's capital allocation decisions filtered through codified values-check (a budget that explicitly maps spending to PVM categories)? Is there structural alignment between purpose and purchase?",
        "o3Question": "Does CEN's capital projection signal a regenerative-investing model that attracts mission-aligned capital and influences how the broader NGO field allocates resources?",
        "bscKpiPlacement": None,
    },
    {
        "edgeId": "E2-3", "faceA": 2, "faceB": 3,
        "faceANarrative": "Conceptual Depth", "faceBNarrative": "Founder Dyad",
        "canonicalName": "Vision Embodiment Rate",
        "baseQuestion": "How do our people's minds connect to create shared knowledge?",
        "o1Question": "Do both founders functionally know what CEN's frameworks are at the level needed to keep the org alive — is knowledge surviving the dyad gap?",
        "o2Question": "Is intellectual capital codified enough that knowledge can flow between founders (and beyond them) via structured protocols rather than founder-presence?",
        "o3Question": "Is the founder dyad articulating a future-vision that resonates beyond themselves — does shared intellectual capital project into the field as inspirational thought-leadership?",
        "bscKpiPlacement": None,
    },
    {
        "edgeId": "E2-6", "faceA": 2, "faceB": 6,
        "faceANarrative": "Conceptual Depth", "faceBNarrative": "Emerging Network",
        "canonicalName": "Ecosystem Knowledge Flow",
        "baseQuestion": "How does our knowledge flow to our community? (Teaching)",
        "o1Question": "Is CEN's knowledge reaching its community in any form — is the teaching impulse alive at all?",
        "o2Question": "Is teaching systematized — curricula, programs, learning artifacts that codify CEN's frameworks for community absorption?",
        "o3Question": "Does CEN's knowledge generate field-resonance — does the community become a teaching multiplier, carrying CEN's frameworks into wider relational networks?",
        "bscKpiPlacement": None,
    },
    {
        "edgeId": "E2-10", "faceA": 2, "faceB": 10,
        "faceANarrative": "Conceptual Depth", "faceBNarrative": "Sacred Ground",
        "canonicalName": "Ethical IP Score",
        "baseQuestion": "Is our knowledge grounded in and aligned with our core values?",
        "o1Question": "Does CEN's intellectual work pass even a minimum values-check — are we doing knowledge work that doesn't betray our purpose?",
        "o2Question": "Is values-alignment filtering codified into a Peace Charter screening procedure (BSC.L7) — a documented, repeatable check before any major IP commitment?",
        "o3Question": "Does CEN's values-screened IP attract ethics-aligned partners and projects forward as a model for conscious-leadership knowledge work in the wider field?",
        "bscKpiPlacement": {
            "kpiId": "BSC.L7",
            "kpiName": "Peace Charter screening procedure",
            "primaryOctave": "O2",
            "primaryOctaveRationale": "Structural codification — 'Is values-alignment filtering codified into a Peace Charter screening procedure (BSC.L7) — a documented, repeatable check before any major IP commitment?' (source line 477)",
            "kpiCategoryBsc": "L (Learning & Growth perspective)",
        },
    },
    {
        "edgeId": "E2-11", "faceA": 2, "faceB": 11,
        "faceANarrative": "Conceptual Depth", "faceBNarrative": "Dormant Pipeline",
        "canonicalName": "IP Generosity Rate",
        "baseQuestion": "Does our knowledge serve the highest purpose of regeneration?",
        "o1Question": "Does CEN's IP attract any aligned funding — is the knowledge-to-pipeline channel even open at survival level?",
        "o2Question": "Is there a structured pipeline from intellectual capital to grant applications — IP-mapped to funder priorities, codified pitch material per funding opportunity?",
        "o3Question": "Does CEN's intellectual generosity (open frameworks, freely-shared models) build field-presence that attracts mission-aligned capital seeking generative-knowledge partners?",
        "bscKpiPlacement": None,
    },
    {
        "edgeId": "E3-4", "faceA": 3, "faceB": 4,
        "faceANarrative": "Founder Dyad", "faceBNarrative": "Governance Gap",
        "canonicalName": "Embodied Governance",
        "baseQuestion": "How is our human energy grounded and supported by our structures?",
        "o1Question": "Does CEN have any structural container that keeps the founder dyad from burning out — are the people surviving their roles?",
        "o2Question": "Are governance structures (roles, decision-rights, succession plans) codified enough that the founder dyad's energy is held by the form?",
        "o3Question": "Does CEN's governance form project forward as a model — does it embody the future of how conscious-leadership organizations should structure themselves?",
        "bscKpiPlacement": None,
    },
    {
        "edgeId": "E3-6", "faceA": 3, "faceB": 6,
        "faceANarrative": "Founder Dyad", "faceBNarrative": "Emerging Network",
        "canonicalName": "Ecosystem Co-creation Rate",
        "baseQuestion": "What is the emotional flow and quality of our human relationships?",
        "o1Question": "Are the founders relationally surviving their community engagements — is the human-community interface depleting them or sustaining them?",
        "o2Question": "Is community engagement organized — relationships managed via systems (CRM, regular check-ins, structured collaboration formats)?",
        "o3Question": "Does CEN's founder-community relationship pattern signal field-leadership in regenerative-relational practice — a way of being-with-network that others want to learn from?",
        "bscKpiPlacement": None,
    },
    {
        "edgeId": "E3-9", "faceA": 3, "faceB": 9,
        "faceANarrative": "Founder Dyad", "faceBNarrative": "Conscious Core",
        "canonicalName": "Cultural Integrity",
        "baseQuestion": "How does our humanity serve and express our highest values?",
        "o1Question": "Does CEN's day-to-day people-treatment even minimally honor its regenerative ethic — are the humans inside CEN being treated in ways that match the values CEN preaches?",
        "o2Question": "Are regenerative-people practices codified into how CEN treats its team — explicit wellbeing protocols, regenerative time-use structures, conscious leadership practices?",
        "o3Question": "Does CEN's regenerative people-treatment project forward as a cultural template for how conscious-leadership NGOs handle the human dimension?",
        "bscKpiPlacement": None,
    },
    {
        "edgeId": "E3-11", "faceA": 3, "faceB": 11,
        "faceANarrative": "Founder Dyad", "faceBNarrative": "Dormant Pipeline",
        "canonicalName": "Founder-Funder Resonance",
        "baseQuestion": "How does our human passion transform into the energy that attracts resources?",
        "o1Question": "Does founder passion translate into any aligned-funder contact — is the founder-to-funder energy channel functional at all?",
        "o2Question": "Is the founder-to-funder pipeline systematized — codified outreach process, structured discovery conversations, documented funder qualification?",
        "o3Question": "Does founder energy resonate into the funder field strongly enough that aligned philanthropic capital is arriving unbidden, drawn by the founders' future-vision?",
        "bscKpiPlacement": None,
    },
    {
        "edgeId": "E4-5", "faceA": 4, "faceB": 5,
        "faceANarrative": "Governance Gap", "faceBNarrative": "Mission in Silence",
        "canonicalName": "Structural Resonance",
        "baseQuestion": "Do our structures help or hinder the clarity of our public message?",
        "o1Question": "Does CEN have any structural ground from which to speak — is there enough form to support even a survival-grade public voice?",
        "o2Question": "Are CEN's governance and messaging structures aligned — does the form support a coherent voice (consistent style guide, codified key messages, structured communication cadence)?",
        "o3Question": "Does CEN's structural integrity project forward into the field via a public voice — does the way CEN is organized show up in how it speaks, in a way that resonates with future-aspiring audiences?",
        "bscKpiPlacement": None,
    },
    {
        "edgeId": "E4-6", "faceA": 4, "faceB": 6,
        "faceANarrative": "Governance Gap", "faceBNarrative": "Emerging Network",
        "canonicalName": "Partnership Onboarding Friction",
        "baseQuestion": "Are our partnerships grounded in clear, stable, formal agreements?",
        "o1Question": "Do CEN's partnerships have any basic structural ground (signed agreements, defined scope) — or are partnerships running on goodwill alone, exposing the org to survival-stage risk?",
        "o2Question": "Is the partnership onboarding process codified into a low-friction structured flow (templates, decision rights, intake protocols)?",
        "o3Question": "Does CEN's partnership architecture project a future-of-NGO model where governance form enables relational ecosystem-building rather than blocking it?",
        "bscKpiPlacement": None,
    },
    {
        "edgeId": "E4-7", "faceA": 4, "faceB": 7,
        "faceANarrative": "Governance Gap", "faceBNarrative": "Quiet Credibility",
        "canonicalName": "Reputational Integrity",
        "baseQuestion": "Does our structure embody the highest integrity of our brand?",
        "o1Question": "Does CEN's structural form not actively undermine its reputation — is there minimum-viable integrity-coherence between what we claim and how we operate?",
        "o2Question": "Is governance-brand integrity codified — explicit operating principles that ensure brand promise matches structural reality?",
        "o3Question": "Does CEN's structural-reputational coherence signal field-leadership integrity that future-aspiring stakeholders recognize as a benchmark?",
        "bscKpiPlacement": None,
    },
    {
        "edgeId": "E4-9", "faceA": 4, "faceB": 9,
        "faceANarrative": "Governance Gap", "faceBNarrative": "Conscious Core",
        "canonicalName": "Investor Readiness Score",
        "baseQuestion": "Can our structure transform to meet the needs of due diligence?",
        "o1Question": "Does CEN have any structural ground that would survive even basic due-diligence review — could we explain our governance to a serious funder without revealing fatal gaps?",
        "o2Question": "Are regenerative-governance practices codified into auditable structures — documented decision rights, regenerative-impact protocols, transparent reporting?",
        "o3Question": "Does CEN's regenerative-governance form project forward as a future-model for impact-aligned investment — a structure that aspirational capital recognizes as the next-generation of NGO form?",
        "bscKpiPlacement": None,
    },
    {
        "edgeId": "E5-7", "faceA": 5, "faceB": 7,
        "faceANarrative": "Mission in Silence", "faceBNarrative": "Quiet Credibility",
        "canonicalName": "Perception Integrity",
        "baseQuestion": "Does our market resonance serve the highest purpose of our brand's truth?",
        "o1Question": "Does anyone outside CEN know enough about it to recognize the brand exists — is market-reputation interface even alive at minimum visibility?",
        "o2Question": "Are perception and reputation managed through codified systems — measured awareness metrics, structured PR cadence, brand-consistency protocols?",
        "o3Question": "Does CEN's market-reputation interface project a coherent field-presence — is what we claim what people see, in a way that signals our aspirational direction?",
        "bscKpiPlacement": None,
    },
    {
        "edgeId": "E5-8", "faceA": 5, "faceB": 8,
        "faceANarrative": "Mission in Silence", "faceBNarrative": "Underdeveloped Engine",
        "canonicalName": "Brand-Experience Coherence",
        "baseQuestion": "Does our market feedback transform into operational improvements?",
        "o1Question": "Does CEN have any market-tested operational output — is there even one consulting client or delivered engagement keeping the market-operations interface alive?",
        "o2Question": "Is the AI governance consulting practice codified into repeatable delivery — documented methodology, structured engagement flow, measurable client outcomes?",
        "o3Question": "Does CEN's consulting practice project forward as a leadership offering — are clients attracted to CEN as a future-shaping advisor on AI governance for conscious-leadership organizations?",
        "bscKpiPlacement": {
            "kpiId": "BSC.C8",
            "kpiName": "AI governance consulting clients",
            "primaryOctave": "O2",
            "primaryOctaveRationale": "Structural codification of consulting practice — 'Is the AI governance consulting practice codified into repeatable delivery — documented methodology, structured engagement flow, measurable client outcomes?' (source line 505)",
            "kpiCategoryBsc": "C (Customer/Stakeholder perspective)",
        },
    },
    {
        "edgeId": "E5-9", "faceA": 5, "faceB": 9,
        "faceANarrative": "Mission in Silence", "faceBNarrative": "Conscious Core",
        "canonicalName": "Market Community Engagement",
        "baseQuestion": "Is there a healthy flow of conversation between our market and community?",
        "o1Question": "Does CEN's regenerative ethic reach any audience — is the regeneration-to-market signal alive at all?",
        "o2Question": "Are regenerative practices systematically communicated to market audiences (regenerative case studies, structured impact reports, codified storytelling)?",
        "o3Question": "Does CEN's regenerative ethic resonate into the market as field-leadership — is CEN known as a voice shaping the future of regenerative organizational practice?",
        "bscKpiPlacement": None,
    },
    {
        "edgeId": "E5-12", "faceA": 5, "faceB": 12,
        "faceANarrative": "Mission in Silence", "faceBNarrative": "Exposed Foundation",
        "canonicalName": "Reputational Resilience",
        "baseQuestion": "Is our brand a source of resilient, trust-based flow during a crisis?",
        "o1Question": "Does CEN have any market-presence that would protect it during a crisis — would anyone defend it, vouch for it, or stick with it if things got hard?",
        "o2Question": "Are crisis-communication and reputation-protection codified into resilience protocols — structured response mechanisms, trust-bank cultivation systems?",
        "o3Question": "Does CEN's market resonance project a trust-density that aspirational stakeholders recognize as future-resilient — a brand that future challenges will not break?",
        "bscKpiPlacement": None,
    },
    {
        "edgeId": "E6-7", "faceA": 6, "faceB": 7,
        "faceANarrative": "Emerging Network", "faceBNarrative": "Quiet Credibility",
        "canonicalName": "Brand Capitalization Score",
        "baseQuestion": "Do we clearly communicate our brand's power to potential funders?",
        "o1Question": "Does CEN's community know enough about CEN to speak for it — is the network-brand interface alive in any conversion-grade form?",
        "o2Question": "Is community-to-brand amplification organized — ambassador programs, structured advocacy support, codified community-comms?",
        "o3Question": "Does CEN's community project the brand into the field as a future-shaping movement — does the network's collective voice signal a direction the field is moving toward?",
        "bscKpiPlacement": None,
    },
    {
        "edgeId": "E7-8", "faceA": 7, "faceB": 8,
        "faceANarrative": "Quiet Credibility", "faceBNarrative": "Underdeveloped Engine",
        "canonicalName": "Brand-Operational Integrity",
        "baseQuestion": "Does our brand promise transform into operational excellence?",
        "o1Question": "Does CEN's operations even minimally fulfill what the brand suggests — is the brand-promise-vs-operational-reality gap small enough not to threaten survival?",
        "o2Question": "Is brand-operations alignment codified — documented service-level commitments, quality control linked to brand promise, measured delivery-vs-promise gaps?",
        "o3Question": "Does CEN's brand-operations coherence project forward as a future-leadership model — does the way we deliver embody the next-generation of mission-driven operational excellence?",
        "bscKpiPlacement": None,
    },
    # NOTE: E7-11 EXCLUDED from canonical 30-edge list per Lock #8.36 (2026-05-24).
    # F7 + F11 are SKEW faces in dodecahedral topology — they do NOT share a pentagon edge.
    # F7's neighbors per main.js:826-849 = F1, F4, F5, F6, F8 (5).
    # F11's neighbors per main.js:826-849 = F2, F3, F9, F10, F12 (5). NOT F7.
    # Source markdown (CEN_SSOT_OctaveAware_Questions_30Edge_20Vertex_2026-05-22.md
    # line 259) was authored 2026-05-22 BEFORE Lock #8.36 reversion (2026-05-24)
    # and includes E7-11 as if it were canonical. The questions content is preserved
    # below in `deprecated_entries` for full source traceability per content-level
    # Never Delete Rule. BSC.F4 (Donation income/quarter) was placed on E7-11
    # pre-Lock #8.36; post-Lock #8.36 reverted to F11 Fire O2 face placement.
    {
        "edgeId": "E8-10", "faceA": 8, "faceB": 10,
        "faceANarrative": "Underdeveloped Engine", "faceBNarrative": "Sacred Ground",
        "canonicalName": "Process Regeneration Rate",
        "baseQuestion": "Is there a healthy flow of regenerative practice within our operations?",
        "o1Question": "Do CEN's operations even minimally honor regenerative values — are we operationally surviving without active values-betrayal?",
        "o2Question": "Are regenerative-operational practices codified into how work happens daily (working time conventions, sustainable pace structures, regenerative check-ins)?",
        "o3Question": "Does CEN's operational regenerativeness project forward as a future-model — a way of working that aspirational organizations want to adopt?",
        "bscKpiPlacement": None,
    },
    {
        "edgeId": "E8-12", "faceA": 8, "faceB": 12,
        "faceANarrative": "Underdeveloped Engine", "faceBNarrative": "Exposed Foundation",
        "canonicalName": "Operational Resilience",
        "baseQuestion": "Does operational clarity inform and reduce systemic risk?",
        "o1Question": "Do CEN's operational systems prevent total organizational collapse if any single person becomes unavailable — is there minimum survival-grade operational redundancy?",
        "o2Question": "Is operational resilience codified into structured systems (documented SOPs, cross-trained capability, backup protocols, structured crisis response)?",
        "o3Question": "Does CEN's operational design project forward as a future-resilient organizational model — built for the conditions that will shape the next decade of mission-driven work?",
        "bscKpiPlacement": None,
    },
    {
        "edgeId": "E9-11", "faceA": 9, "faceB": 11,
        "faceANarrative": "Conscious Core", "faceBNarrative": "Dormant Pipeline",
        "canonicalName": "Values Embodiment Score",
        "baseQuestion": "Is our regenerative impulse grounded in our core values?",
        "o1Question": "Does CEN's regenerative mission attract any minimum-viable funding — is the values-to-funding channel alive at survival level? *(Note: F9 architectural-blindness centerpiece — BSC has zero KPIs here; this question often returns \"no\" because the BSC instrument cannot perceive the channel.)*",
        "o2Question": "Are regenerative-mission and funding-pipeline structurally connected — codified pathways from regenerative work to mission-aligned grant opportunities?",
        "o3Question": "Does CEN's regenerative mission attract aspirational philanthropic capital seeking to invest in future-shaping regenerative-leadership models?",
        "bscKpiPlacement": None,
    },
    {
        "edgeId": "E9-12", "faceA": 9, "faceB": 12,
        "faceANarrative": "Conscious Core", "faceBNarrative": "Exposed Foundation",
        "canonicalName": "Regenerative Resilience",
        "baseQuestion": "Does our regenerative practice transform into greater systemic resilience?",
        "o1Question": "Does CEN's regenerative ethic translate into any survival-grade resilience mechanism — is there an organism-level protection emerging from values?",
        "o2Question": "Are regenerative resilience practices codified — structured ways that regenerative principles become organizational shock-absorption?",
        "o3Question": "Does CEN's regenerative-resilience pattern project field-leadership — does CEN model a future where regenerative practice IS the resilience strategy?",
        "bscKpiPlacement": None,
    },
    {
        "edgeId": "E10-11", "faceA": 10, "faceB": 11,
        "faceANarrative": "Sacred Ground", "faceBNarrative": "Dormant Pipeline",
        "canonicalName": "Funding Alignment Index",
        "baseQuestion": "Do we clearly communicate our values to our capital partners?",
        "o1Question": "Do CEN's values reach any potential funders in a way that creates survival-grade funding alignment — is the values-funder communication even alive?",
        "o2Question": "Is values-to-funder communication systematized — codified pitch material that articulates values, structured funder-fit assessment, documented mission-alignment scoring?",
        "o3Question": "Does CEN's values projection attract aspirational philanthropic capital that explicitly wants to fund the future-shaping vision CEN embodies?",
        "bscKpiPlacement": None,
    },
    {
        "edgeId": "E10-12", "faceA": 10, "faceB": 12,
        "faceANarrative": "Sacred Ground", "faceBNarrative": "Exposed Foundation",
        "canonicalName": "Ethical Resilience",
        "baseQuestion": "Do our values transform into resilience during a crisis?",
        "o1Question": "Does CEN have any baseline values-protective infrastructure (GDPR compliance, basic ethical safeguards) — are we minimally protected against ethics-failure modes that would end us?",
        "o2Question": "Are values-coherent resilience protocols codified — GDPR compliance gaps closed, structured ethics review, documented values-protective systems (BSC.I3)?",
        "o3Question": "Does CEN's values-resilience architecture project a future-leadership model — a way of building ethics-protective resilience that aspirational organizations recognize as next-generation?",
        "bscKpiPlacement": {
            "kpiId": "BSC.I3",
            "kpiName": "GDPR compliance gaps closed",
            "primaryOctave": "O2",
            "primaryOctaveRationale": "Structural codification of values-protective systems — 'Are values-coherent resilience protocols codified — GDPR compliance gaps closed, structured ethics review, documented values-protective systems (BSC.I3)?' (source line 491)",
            "kpiCategoryBsc": "I (Internal Process perspective)",
        },
    },
    {
        "edgeId": "E11-12", "faceA": 11, "faceB": 12,
        "faceANarrative": "Dormant Pipeline", "faceBNarrative": "Exposed Foundation",
        "canonicalName": "Funding Diversification Index",
        "baseQuestion": "Does a healthy funding pipeline create a flow of resilience?",
        "o1Question": "Does CEN have more than one funding source keeping it alive — is the survival-floor diversified at all, or is single-source dependency exposing the whole organism?",
        "o2Question": "Is funding diversification systematized — codified across funder types (grants, donations, consulting), diversification ratios tracked, structured fund-mix targets?",
        "o3Question": "Does CEN's funding architecture project forward as a future-resilient model — multiple aligned capital streams supporting the aspirational mission, not just keeping the lights on?",
        "bscKpiPlacement": None,
    },
]

# ──────────────────────────────────────────────────────────────────────────
# VERTICES — 20 entries verbatim from source markdown lines 329-447
# ──────────────────────────────────────────────────────────────────────────

VERTICES = [
    {
        "vertexId": "V1", "faceA": 1, "faceB": 2, "faceC": 3,
        "canonicalName": "Knowledge-Capital-Human Hub",
        "classification": None,
        "o1Question": "Does CEN have minimum survival-grade alignment between people, knowledge, and money — can the dyad work and afford to work and produce IP at the most basic level?",
        "o2Question": "Is the founder-knowledge-finance triad organized into a repeatable operating system — codified roles, documented IP processes, structured cash-management?",
        "o3Question": "Does CEN's people-knowledge-finance triad project forward as a future-model — a way of organizing conscious-leadership work where intellectual depth, human energy, and capital flow together as aspirational design?",
        "bscKpiPlacement": None,
    },
    {
        "vertexId": "V2", "faceA": 1, "faceB": 3, "faceC": 4,
        "canonicalName": "Resource-People-Structure Point",
        "classification": None,
        "o1Question": "Does CEN have minimum-viable structure to hold its people and resources — is the survival-floor structural enough not to immediately collapse?",
        "o2Question": "Is the resource-people-structure triad codified — documented governance, role-clarity, financial controls — the operating chassis of the org?",
        "o3Question": "Does CEN's people-structure-resources triad signal field-leadership in conscious-leadership organizational form — a chassis worthy of future-aspirational replication?",
        "bscKpiPlacement": None,
    },
    {
        "vertexId": "V3", "faceA": 1, "faceB": 4, "faceC": 5,
        "canonicalName": "Finance-Structure-Market Triangle",
        "classification": None,
        "o1Question": "Does CEN have any survival-grade convergence between money, structure, and market — three weak faces meeting at minimum-viable level?",
        "o2Question": "Are finance-structure-market connections codified into systems (revenue model documented, market-fit measured, structural support for market activity)?",
        "o3Question": "Does CEN's finance-structure-market triad project forward — a coherent future-shaping form of how mission-driven NGOs hold money, structure, and market presence together?",
        "bscKpiPlacement": None,
    },
    {
        "vertexId": "V4", "faceA": 1, "faceB": 5, "faceC": 6,
        "canonicalName": "Finance-Market-Community Point",
        "classification": None,
        "o1Question": "Does CEN have survival-grade flow between money, market, and community — minimum financial circulation through the network-market interface?",
        "o2Question": "Is the finance-market-community triad organized into structured flow (membership models, community-as-market mechanisms, codified circulation)?",
        "o3Question": "Does CEN's community-market-finance triad project a future-model where community IS the market AND the funding source, aspirationally regenerative in its economics?",
        "bscKpiPlacement": None,
    },
    {
        "vertexId": "V5", "faceA": 1, "faceB": 2, "faceC": 6,
        "canonicalName": "Knowledge-Finance-Community",
        "classification": None,
        "o1Question": "Does CEN's intellectual richness reach community in any way that returns financial value — is the knowledge-finance-community triad alive at survival level?",
        "o2Question": "Is the knowledge-finance-community triad codified — community-as-IP-distribution channel, structured monetization paths through network?",
        "o3Question": "Does CEN's knowledge-finance-community triad project forward as a future-model — community-supported intellectual work as a sustainable conscious-leadership pattern?",
        "bscKpiPlacement": None,
    },
    {
        "vertexId": "V6", "faceA": 2, "faceB": 3, "faceC": 8,
        "canonicalName": "Knowledge-Human-Operations",
        "classification": None,
        "o1Question": "Does CEN have minimum-viable channeling of intellectual capital into operational delivery via the founder dyad — does the knowledge-people-doing triad function at all?",
        "o2Question": "Is the knowledge-human-operations triad systematized — IP-to-delivery pipelines, role-clear operations, codified expertise deployment?",
        "o3Question": "Does CEN's knowledge-human-operations triad project a future-leadership model — a way of converting deep intellectual capital into elegant operational delivery via conscious people-practices?",
        "bscKpiPlacement": None,
    },
    {
        "vertexId": "V7", "faceA": 3, "faceB": 4, "faceC": 9,
        "canonicalName": "Founder-Structure-Regeneration",
        "classification": "synergy_hub",
        "o1Question": "Does CEN's founder-structure-regeneration triad have any survival-grade coherence — are the people held by structure in ways that minimally honor regenerative values?",
        "o2Question": "Is regenerative-leadership codified into governance — structured ways the founder dyad's regenerative ethic becomes documented organizational form?",
        "o3Question": "Does CEN's founder-structure-regeneration triad project forward as a future-leadership-form model — synergy hub where people, structure, and regeneration aspirationally converge as field-template?",
        "bscKpiPlacement": None,
    },
    {
        "vertexId": "V8", "faceA": 4, "faceB": 5, "faceC": 10,
        "canonicalName": "Structure-Market-Values Triad",
        "classification": "bermuda_triangle (Lock #8.22 flag: classification = narrative scaffolding, not engine-derived)",
        "o1Question": "Does CEN's exceptional values find any survival-grade structural or market presence — is the values-truth surviving the structural gap and market silence at minimum visibility?",
        "o2Question": "Are values-bearing structures codified enough to carry the values into market presence — is there a structural-communication bridge being built?",
        "o3Question": "Does CEN's structure-market-values triad project forward — can the bermuda-triangle pattern transform into a field-shaping convergence where exceptional values reach the world they need to reach?",
        "bscKpiPlacement": None,
    },
    {
        "vertexId": "V9", "faceA": 5, "faceB": 6, "faceC": 11,
        "canonicalName": "Market-Community-Pipeline",
        "classification": None,
        "o1Question": "Does CEN have survival-grade flow between market, community, and funding — is community-to-funding-via-market alive at any minimum level?",
        "o2Question": "Is the market-community-pipeline triad systematized — codified pathways where community presence and market signal convert to pipeline opportunity?",
        "o3Question": "Does CEN's market-community-pipeline triad project forward as a future-model — community-and-market as an integrated funding-attraction system aspirationally regenerative?",
        "bscKpiPlacement": None,
    },
    {
        "vertexId": "V10", "faceA": 2, "faceB": 6, "faceC": 7,
        "canonicalName": "Knowledge-Community-Brand",
        "classification": "synergy_hub",
        "o1Question": "Does CEN's intellectual depth reach community-and-brand at any survival-grade level — is the IP-network-reputation triad alive in minimum form?",
        "o2Question": "Is the knowledge-community-brand triad codified — content programs, community-as-IP-amplifier, structured brand-knowledge cohesion?",
        "o3Question": "Does CEN's knowledge-community-brand synergy project forward as field-leadership — a future-model where intellectual depth amplifies through community into a brand that shapes the conversation?",
        "bscKpiPlacement": None,
    },
    {
        "vertexId": "V11", "faceA": 2, "faceB": 7, "faceC": 8,
        "canonicalName": "Knowledge-Brand-Operations",
        "classification": None,
        "o1Question": "Does CEN's intellectual strength minimally ground into brand consistency and operations — is the IP-brand-doing triad alive at survival level?",
        "o2Question": "Is the knowledge-brand-operations triad systematized — documented brand-IP-operations alignment, structured consistency protocols?",
        "o3Question": "Does CEN's knowledge-brand-operations triad project a future-leadership pattern — intellectual capital flowing through brand into operational delivery as aspirational coherence?",
        "bscKpiPlacement": None,
    },
    {
        "vertexId": "V12", "faceA": 3, "faceB": 8, "faceC": 9,
        "canonicalName": "Founder-Operations-Regeneration",
        "classification": None,
        "o1Question": "Do CEN's daily operations minimally reflect regenerative values via founder presence — is values-coherent operations alive at survival level?",
        "o2Question": "Is regenerative-operations codified — founder-led patterns documented into structural protocols (working agreements, regenerative practice protocols, sustainable pace structures)?",
        "o3Question": "Does CEN's founder-operations-regeneration triad project forward as a future-template — a way of doing daily work that conscious-leadership organizations recognize as aspirational?",
        "bscKpiPlacement": None,
    },
    {
        "vertexId": "V13", "faceA": 4, "faceB": 9, "faceC": 10,
        "canonicalName": "Structure-Regeneration-Values",
        "classification": "synergy_hub (was BSC.L8 KPI-CARRYING pre-Lock #8.36 reversion; current bscKpiPlacement = null per geometric infeasibility — F4+F9+F10 don't share a vertex per main.js:953-977 canonical V13 = F4+F5+F9)",
        "o1Question": "Does CEN's PVM minimally codify regenerative-values commitment — is the structure-regeneration-values triad alive at survival level via even basic articulation? *(Currently CEN's L8 = \"SDG alignment in PVM\" is absent — the survival-grade slot is empty.)*",
        "o2Question": "Is the structure-regeneration-values triad codified into PVM-grade documentation — SDG framework explicitly articulated in the foundational document, structured into governance protocols (BSC.L8)?",
        "o3Question": "Does CEN's structure-regeneration-values triad project forward as a field-leadership exemplar — a PVM-codified SDG commitment that signals future-shaping conscious-leadership organizational form?",
        "bscKpiPlacement": None,
        "_pre_Lock_8_36_bscKpiPlacement": {
            "kpiId": "BSC.L8",
            "kpiName": "SDG alignment in PVM",
            "primaryOctave": "O2",
            "primaryOctaveRationale": "Structural codification of values-regeneration commitment — 'Is the SDG framework explicitly codified into the PVM document — a structured section that ties each relevant SDG to CEN's governance protocols, programs, and accountability mechanisms (BSC.L8)?' (source line 519)",
            "kpiCategoryBsc": "L (Learning & Growth perspective)",
            "post_Lock_8_36_canonical_placement": "BSC.L8 → F10 Ether O2 (face placement, octave preserved)",
        },
        "_note": "Source markdown labeled V13 as BSC.L8 KPI-CARRYING (Highlight 5, primary source line 511). Lock #8.36 reversion (2026-05-24) reverted this: BSC.L8 moved to F10 Ether O2 placement because F4+F9+F10 is not a canonical vertex (canonical V13 = F4+F5+F9 per main.js:953-977). Questions preserved verbatim as historical research context; current bscKpiPlacement = null. Note: octave preserved across reversion (O2 → O2 face placement) — the structural-codification octave-character of L8 is invariant of geometric placement.",
    },
    {
        "vertexId": "V14", "faceA": 5, "faceB": 10, "faceC": 11,
        "canonicalName": "Market-Values-Funding Paradox",
        "classification": "bermuda_triangle",
        "o1Question": "Do CEN's world-class values find any survival-grade market or funding traction — is the values-market-funding triad even alive given the 9.5/10 vs 2.0/5.0 paradox?",
        "o2Question": "Is there a structural pathway being codified to break the paradox — systems that translate values into market reach and funding flow?",
        "o3Question": "Does CEN's market-values-funding triad have a future-resolution pattern — a way for the Hidden Oracle to project field-presence that closes the values-to-resource gap?",
        "bscKpiPlacement": None,
    },
    {
        "vertexId": "V15", "faceA": 6, "faceB": 7, "faceC": 11,
        "canonicalName": "Community-Brand-Funding",
        "classification": None,
        "o1Question": "Does CEN's community-brand interface attract any survival-grade funding contact — is the network-reputation-pipeline triad alive at minimum?",
        "o2Question": "Is the community-brand-funding triad systematized — codified pathways from community engagement to brand-amplified funding introductions?",
        "o3Question": "Does CEN's community-brand-funding triad project a future-model — community-and-brand-warmth as the front-end of an aspirational funding-attraction architecture?",
        "bscKpiPlacement": None,
    },
    {
        "vertexId": "V16", "faceA": 7, "faceB": 8, "faceC": 12,
        "canonicalName": "Brand-Operations-Resilience",
        "classification": None,
        "o1Question": "Does CEN's brand-operations-resilience triad have minimum survival-grade integration — are reputation, delivery, and protection minimally aligned?",
        "o2Question": "Is the brand-operations-resilience triad codified — structured pathways where reputation reinforces operational delivery and operational reliability builds resilience?",
        "o3Question": "Does CEN's brand-operations-resilience triad project forward — a future-leadership pattern of reputation-grounded operational reliability that signals aspirational organizational durability?",
        "bscKpiPlacement": None,
    },
    {
        "vertexId": "V17", "faceA": 8, "faceB": 9, "faceC": 12,
        "canonicalName": "Operations-Regeneration-Resilience",
        "classification": None,
        "o1Question": "Do CEN's operations channel regenerative practice into survival-grade resilience — is the doing-regenerating-protecting triad even alive at minimum?",
        "o2Question": "Is the operations-regeneration-resilience triad codified — structured ways daily work IS the regenerative practice IS the resilience strategy?",
        "o3Question": "Does CEN's operations-regeneration-resilience triad project a future-aspirational pattern — operational work designed so regenerative practice and resilience are emergent properties, not afterthoughts?",
        "bscKpiPlacement": None,
    },
    {
        "vertexId": "V18", "faceA": 9, "faceB": 10, "faceC": 12,
        "canonicalName": "Regeneration-Values-Resilience",
        "classification": "hotspot (brittle vessel pattern)",
        "o1Question": "Does CEN's brittle-vessel pattern hold at survival level — can the strong regeneration and values survive the zero-resilience pressure long enough to build a vessel?",
        "o2Question": "Is there structural movement to convert the meaning-rich, materially-starved pattern into a fortified-from-values resilience architecture — codified protections derived from the values themselves?",
        "o3Question": "Does CEN's regeneration-values-resilience triad project forward as a future-resolution exemplar — values-derived resilience as a field-shaping conscious-leadership pattern?",
        "bscKpiPlacement": None,
    },
    {
        "vertexId": "V19", "faceA": 10, "faceB": 11, "faceC": 12,
        "canonicalName": "Values-Pipeline-Resilience",
        "classification": "hotspot",
        "o1Question": "Do CEN's exceptional values translate into any survival-grade funding-and-resilience — is the pattern \"values alone cannot compensate\" surviving its own diagnosis?",
        "o2Question": "Is the values-pipeline-resilience triad being codified — systems that convert values clarity into structured funding flow into material resilience?",
        "o3Question": "Does CEN's values-pipeline-resilience triad project a future-model — a coherent architecture where strong values structurally generate aligned funding and built-resilience?",
        "bscKpiPlacement": None,
    },
    {
        "vertexId": "V20", "faceA": 7, "faceB": 11, "faceC": 12,
        "canonicalName": "Brand-Funding-Fortress",
        "classification": None,
        "o1Question": "Does CEN's brand-funding interface have survival-grade reach into resilience architecture — is the credibility-pipeline-protection triad alive at minimum?",
        "o2Question": "Is the brand-funding-fortress triad systematized — codified ways reputation attracts diversified funding which builds resilience structures?",
        "o3Question": "Does CEN's brand-funding-fortress triad project forward as a future-resilient organizational model — brand attracts aligned multi-source capital that materializes into field-shaping durability?",
        "bscKpiPlacement": None,
    },
]


DEPRECATED_ENTRIES = [
    {
        "edgeId": "E7-11",
        "deprecation_status": "Lock #8.36 reversion (2026-05-24): geometrically infeasible — F7+F11 are skew faces; no pentagon edge between them per main.js:826-849 canonical adjacency",
        "originalBscKpiPlacement_pre_Lock_8_36": {
            "kpiId": "BSC.F4",
            "kpiName": "Donation income/quarter",
            "primaryOctave": "O2",
            "primaryOctaveRationale": "Structural codification — 'Is donation generation systematized — codified donor cultivation pipeline, structured giving programs, measurable conversion from reputation events to donation income?' (source line 463)",
            "kpiCategoryBsc": "F (Financial perspective)",
        },
        "post_Lock_8_36_canonical_placement": "BSC.F4 → F11 Fire O2 (face placement, octave preserved)",
        "source_markdown_line": 259,
        "preserved_for_traceability": True,
        "faceANarrative": "Quiet Credibility",
        "faceBNarrative": "Dormant Pipeline",
        "canonicalName": "Reputation-Funding Attraction",
        "baseQuestion": "Does CEN's reputation attract aligned philanthropic capital?",
        "o1Question": "Are donations arriving at any minimum survival-flow level — is the reputation-to-funding channel alive at all?",
        "o2Question": "Is donation generation systematized — codified donor cultivation pipeline, structured giving programs, measurable conversion from reputation events to donation income?",
        "o3Question": "Does CEN's reputation project field-leadership strong enough that aligned philanthropic capital is arriving as field-investment — donors recognizing CEN as the future of conscious-leadership NGOs?",
    },
]


def main():
    data = {
        "version": "1.0",
        "company": "cen",
        "lock": "#8.40 — Edge + Vertex KPI Single-Source-of-Truth",
        "authority": "Researcher draft (Deimantas + Claude, 2026-05-22 partnership-validated)",
        "phase": "B.1a (questions + BSC placements; signatures added in B.1b)",
        "source_documents": [
            "POC/docs/cen-ssot/CEN_SSOT_OctaveAware_Questions_30Edge_20Vertex_2026-05-22.md (primary)",
            "POC/docs/cen-ssot/CEN_SSOT_BiDirectional_Signatures_30Edge_20Vertex_2026-05-22.md (signatures — Phase B.1b)",
            "POC/docs/cen-ssot/CEN_SSOT_W06v3_34KPI_QuestionDerived_Mapping_2026-05-21.md (BSC placements + Lock #8.36 reversion)",
        ],
        "lock_8_36_note": (
            "Lock #8.36 (2026-05-24) reverted 2 of 5 Lock #8.11 KPI promotions that were "
            "geometrically infeasible: (1) BSC.L8 → V13 reverted (F4+F9+F10 don't share a "
            "vertex; canonical V13 = F4+F5+F9 per main.js:953-977; BSC.L8 → F10 Ether O2 face); "
            "(2) BSC.F4 → E7-11 reverted (F7+F11 are skew faces — no pentagon edge between them "
            "per main.js:826-849; BSC.F4 → F11 Fire O2 face). Net post-Lock #8.36: "
            "3 edge-KPIs (E2-10/E5-8/E10-12) + 0 vertex-KPIs. This spec reflects post-Lock "
            "#8.36 placements. Source markdown (2026-05-22) was authored pre-Lock #8.36 and "
            "included E7-11 as canonical; preserved in deprecated_entries[] for full source "
            "traceability per content-level Never Delete Rule."
        ),
        "canonical_edge_count": 30,
        "canonical_vertex_count": 20,
        "kpi_distribution": "3 edge-KPIs all at O2 (E2-10 BSC.L7 + E5-8 BSC.C8 + E10-12 BSC.I3) + 0 vertex-KPIs",
        "octave_aware_kpi_placement_note": (
            "Edge + vertex KPIs are OCTAVE-AWARE per partnership-finding 2026-05-25: each "
            "KPI placement carries a primaryOctave coordinate (O1 Survival / O2 Structure / "
            "O3 Relationships-Aspirational). The same edge/vertex generates 3 distinct octave-"
            "specific questions (o1Question/o2Question/o3Question) per Lock #8.24 octave-aware "
            "inquiry architecture; the BSC KPI itself operationally measures at the primaryOctave. "
            "Empirical observation: all 5 historical KPI-carrying entries (4 edges + 1 vertex pre-"
            "Lock #8.36) live at O2 Structure octave — consistent with the methodological pattern "
            "that 17 of 34 BSC KPIs naturally cluster at O2 per W0.6 v3 mapping (BSC's natural "
            "register is structural codification)."
        ),
        "kpi_placement_schema": {
            "kpiId": "BSC.<letter><number> identifier (F=Financial, I=Internal Process, C=Customer/Stakeholder, L=Learning & Growth per Kaplan-Norton 4 perspectives)",
            "kpiName": "Verbatim KPI name from W06v3 KPI Mapping doc",
            "primaryOctave": "O1 / O2 / O3 — where the BSC measurement primarily operationalizes",
            "primaryOctaveRationale": "Quote from primary source line:line explaining why this octave",
            "kpiCategoryBsc": "Kaplan-Norton BSC perspective category",
        },
        "source_divergence_note": (
            "Source markdown header claims '30 edges' but actually lists 31 edge entries "
            "(includes E7-11). This canonical SSOT excludes E7-11 per Lock #8.36 + main.js:826-849 "
            "canonical adjacency. E7-11 content preserved in deprecated_entries[] (1 entry)."
        ),
        "edges": EDGES,
        "vertices": VERTICES,
        "deprecated_entries": DEPRECATED_ENTRIES,
    }
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with OUT_PATH.open("w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")
    print(f"[OK] {OUT_PATH.name}: {len(EDGES)} canonical edges (expected 30) + "
          f"{len(VERTICES)} vertices (expected 20) + {len(DEPRECATED_ENTRIES)} deprecated entries")
    print(f"  KPI placements (post-Lock #8.36): edges = "
          f"{sum(1 for e in EDGES if e['bscKpiPlacement'])} (expected 3) · "
          f"vertices = {sum(1 for v in VERTICES if v['bscKpiPlacement'])} (expected 0)")
    print(f"  File: {OUT_PATH}")


if __name__ == "__main__":
    main()
