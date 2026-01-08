/**
 * ════════════════════════════════════════════════════════════════════════════
 * EDGE CONSTANTS - THE 30 INTERFACE METRICS
 * ════════════════════════════════════════════════════════════════════════════
 *
 * This module defines the 30 edges of the dodecahedron - the interfaces where
 * adjacent domain faces meet and exchange energy. Each edge is a MEMBRANE,
 * not an element-holder.
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                        NOTES FOR FUTURE CLAUDE                          │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * KEY INSIGHT: The edge is a MEMBRANE, not an element-holder.
 * ─────────────────────────────────────────────────────────────────────────
 * IMPORTANT: We explored assigning elements to edges (Dec 27) and SET IT ASIDE
 * (Dec 28) because it was FORCED COMPLEXITY. See EDGE_DYNAMICS_REFERENCE.md.
 *
 * The simpler, organic model:
 *   1. Edge is a membrane between two faces
 *   2. Edge character EMERGES DYNAMICALLY from the relationship
 *   3. Edge KPIs are DERIVED from connected face element synergies
 *   4. "Exchange type" describes what HAPPENS, not what the edge "is"
 *
 * EXCHANGE TYPES (descriptive, not inherent):
 * ─────────────────────────────────────────────────────────────────────────
 *   - Grounding (Earth): Stability, structure exchange
 *   - Flow (Water): Movement, adaptability exchange
 *   - Transformation (Fire): Change, catalysis exchange
 *   - Communication (Air): Connection, clarity exchange
 *   - Purpose (Ether): Meaning, alignment exchange
 *
 * DERIVED KPI ARCHITECTURE:
 * ─────────────────────────────────────────────────────────────────────────
 *   Edge KPIs are calculated from FACE element synergies:
 *   - earthSynergy = sqrt(FaceA.earth * FaceB.earth)
 *   - waterSynergy = sqrt(FaceA.water * FaceB.water)
 *   - fireSynergy = sqrt(FaceA.fire * FaceB.fire)
 *   - airSynergy = sqrt(FaceA.air * FaceB.air)
 *   - etherSynergy = sqrt(FaceA.ether * FaceB.ether)
 *
 * NAVIGATION MAP:
 * ─────────────────────────────────────────────────────────────────────────
 *   - data/CSV_Edge_tension_Map.csv -> Source data (30 edges)
 *   - js/advanced/edge-analyzer.js -> Edge calculation engine
 *   - docs/EDGE_DYNAMICS_REFERENCE.md -> Membrane model decision
 *   - kpi-constants.js -> Domain names and face definitions
 *   - consciousness-constants.js -> Edge inquiries
 *
 * @module js/constants/edge-constants
 * @author Deimantas & Claude (Co-created with consciousness and love)
 * @version 1.0.0
 * @see {@link ../../data/CSV_Edge_tension_Map.csv} - Source data
 * @see {@link ../../docs/EDGE_DYNAMICS_REFERENCE.md} - Membrane model
 * ════════════════════════════════════════════════════════════════════════════
 */

// ════════════════════════════════════════════════════════════════════════════
// SECTION 1: EXCHANGE TYPES - Categories of Interface Energy
// ════════════════════════════════════════════════════════════════════════════

/**
 * EXCHANGE_TYPES - The five types of exchange that can occur at edges
 *
 * These describe WHAT'S HAPPENING at the membrane, not what element the
 * edge "has". The exchange type emerges from the nature of the relationship
 * between the two connected faces.
 *
 * @constant {Object}
 */
const EXCHANGE_TYPES = {
    Grounding: {
        id: 'grounding',
        element: 'Earth',
        description: 'Stability and structure exchange at this interface',
        formulaPatterns: [
            'Stability_Metric / Benchmark',
            '(Value - Min) / (Max - Min)',
            'Assets_In_Place / Assets_Required'
        ],
        triggerQuestion: 'How is [Domain A] grounded in [Domain B]?',
        derivedFrom: 'sqrt(FaceA.earth * FaceB.earth)',
        indicators: ['physical assets', 'documented processes', 'compliance', 'stability over time']
    },

    Flow: {
        id: 'flow',
        element: 'Water',
        description: 'Movement and adaptability exchange at this interface',
        formulaPatterns: [
            'Value_Given / Value_Received',
            'Flow_Rate_A_to_B * Flow_Quality',
            '1 - Concentration_Index'
        ],
        triggerQuestion: 'How does energy flow between [Domain A] and [Domain B]?',
        derivedFrom: 'sqrt(FaceA.water * FaceB.water)',
        indicators: ['exchange rates', 'reciprocity', 'adaptability', 'emotional intelligence']
    },

    Transformation: {
        id: 'transformation',
        element: 'Fire',
        description: 'Change and catalysis exchange at this interface',
        formulaPatterns: [
            'Output_Transformed / Input_Invested',
            'MIN(Metric_A, Metric_B) / MAX(Metric_A, Metric_B)',
            '(Value - 1) / (Max - 1)'
        ],
        triggerQuestion: 'How does [Domain A] transform into [Domain B]?',
        derivedFrom: 'sqrt(FaceA.fire * FaceB.fire)',
        indicators: ['conversion rates', 'catalytic effects', 'change velocity', 'crisis resilience']
    },

    Communication: {
        id: 'communication',
        element: 'Air',
        description: 'Clarity and connection exchange at this interface',
        formulaPatterns: [
            'Signal_Strength / Noise',
            'Awareness_Generated / Resources_Invested',
            'Connections_Made / Connections_Possible'
        ],
        triggerQuestion: 'How does [Domain A] communicate with [Domain B]?',
        derivedFrom: 'sqrt(FaceA.air * FaceB.air)',
        indicators: ['communication effectiveness', 'information flow', 'connection quality', 'recovery speed']
    },

    Purpose: {
        id: 'purpose',
        element: 'Ether',
        description: 'Meaning and alignment exchange at this interface',
        formulaPatterns: [
            'Purpose_Aligned_Activity / Total_Activity',
            'Short_Term_Value / Long_Term_Value',
            '(Ethics_Score - 1) / (Max - 1)'
        ],
        triggerQuestion: 'How does [Domain A] serve the highest purpose through [Domain B]?',
        derivedFrom: 'sqrt(FaceA.ether * FaceB.ether)',
        indicators: ['values alignment', 'integrity', 'generosity', 'transcendent purpose']
    }
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 2: EDGE KPI LIBRARY - All 30 Edge Interface Metrics
// ════════════════════════════════════════════════════════════════════════════

/**
 * EDGE_KPI_LIBRARY - Complete definition of all 30 edge KPIs
 *
 * Each edge connects two adjacent faces and has a unique KPI that measures
 * the health of that interface. Data sourced from CSV_Edge_tension_Map.csv.
 *
 * PURE MEMBRANE MODEL (January 2026):
 * ─────────────────────────────────────────────────────────────────────────
 * Edge character EMERGES DYNAMICALLY from synergy calculation, not static assignment.
 * Use SacredInquiry.getDominantSynergy(faceA, faceB) to determine edge's elemental nature.
 * The 'derivedFrom' field shows which synergy formula is MOST RELEVANT to this edge's KPI,
 * but the actual dominant element is calculated at runtime from real face values.
 *
 * @constant {Object}
 */
const EDGE_KPI_LIBRARY = {

    // ═══════════════════════════════════════════════════════════════════════
    // THE 30 EDGE MEMBRANES - Pure interfaces, character emerges from synergy
    // ═══════════════════════════════════════════════════════════════════════

    'E3-4': {
        id: 'E3-4',
        faces: [3, 4],
        archetype: 'Human Capital <-> Structural Capital',
        kpiName: 'Embodied Governance',
        metric: 'Ratio of Employee Engagement Score vs. Number of Formal Policies/Rules',
        formula: 'Engagement_Score_Normalized / (1 + LOG(Number_of_Policies, 10))',
        derivedFrom: 'sqrt(Face3.earth * Face4.earth)',
        question: 'How is our human energy grounded and supported by our structures?',
        shadow: 'Are policies strangling engagement, or is chaos preventing structure?'
    },

    'E4-6': {
        id: 'E4-6',
        faces: [4, 6],
        archetype: 'Structural Capital <-> Community & Partners',
        kpiName: 'Partnership Onboarding Friction',
        metric: 'Average days from handshake to operational agreement',
        formula: '1 - (Value / Max_Days_Target)',
        derivedFrom: 'sqrt(Face4.earth * Face6.earth)',
        question: 'Are our partnerships grounded in clear, stable, formal agreements?',
        shadow: 'Is bureaucracy blocking partnership flow?'
    },

    'E2-10': {
        id: 'E2-10',
        faces: [2, 10],
        archetype: 'Intellectual Capital <-> Foundational Values',
        kpiName: 'Ethical IP Score',
        metric: 'Qualitative score (1-5) from internal ethics review',
        formula: '(Value - 1) / (5 - 1)',
        derivedFrom: 'sqrt(Face2.earth * Face10.earth)',
        question: 'Is our knowledge grounded in and aligned with our core values?',
        shadow: 'Is our IP serving humanity or exploiting it?'
    },

    'E1-8': {
        id: 'E1-8',
        faces: [1, 8],
        archetype: 'Financial Capital <-> Core Operations',
        kpiName: 'Operational ROI',
        metric: 'Ratio of Operational Output to Budget Spent',
        formula: 'Output / Budget',
        derivedFrom: 'sqrt(Face1.earth * Face8.earth)',
        question: 'How is our capital grounded in real, tangible operational work?',
        shadow: 'Are we spending money without creating value?'
    },

    'E9-11': {
        id: 'E9-11',
        faces: [9, 11],
        archetype: 'Regenerative Flow <-> Funding Pipeline',
        kpiName: 'Values Embodiment Score',
        metric: 'Ratio of Regenerative Choices to Value Alignment Checks',
        formula: 'KPI_E1.1_Value / KPI_L3.1_Value',
        derivedFrom: 'sqrt(Face9.earth * Face11.earth)',
        question: 'Is our regenerative impulse grounded in our core values?',
        shadow: 'Are we performing regeneration without embodying it?'
    },

    'E5-9': {
        id: 'E5-9',
        faces: [5, 9],
        archetype: 'Market Resonance <-> Regenerative Flow',
        kpiName: 'Market Community Engagement',
        metric: 'Ratio of Engagement Score vs. Policy Complexity',
        formula: 'Engagement_Score_Normalized / (1 + LOG(Number_of_Policies, 10))',
        derivedFrom: 'sqrt(Face5.water * Face9.water)',
        question: 'Is there a healthy flow of conversation between our market and community?',
        shadow: 'Is market feedback drowning in bureaucratic noise?'
    },

    'E5-12': {
        id: 'E5-12',
        faces: [5, 12],
        archetype: 'Market Resonance <-> Risk & Resilience',
        kpiName: 'Reputational Resilience',
        metric: 'Crisis simulation score (1-5)',
        formula: '(Value - 1) / (5 - 1)',
        derivedFrom: 'sqrt(Face5.water * Face12.water)',
        question: 'Is our brand a source of resilient, trust-based flow during a crisis?',
        shadow: 'Does crisis expose the fragility of our market position?'
    },

    'E11-12': {
        id: 'E11-12',
        faces: [11, 12],
        archetype: 'Funding Pipeline <-> Risk & Resilience',
        kpiName: 'Funding Diversification Index',
        metric: 'Inverted Herfindahl-Hirschman Index on funding sources',
        formula: '1 - HHI_Score',
        derivedFrom: 'sqrt(Face11.water * Face12.water)',
        question: 'Does a healthy funding pipeline create a flow of resilience?',
        shadow: 'Is funding concentration creating systemic fragility?'
    },

    'E3-6': {
        id: 'E3-6',
        faces: [3, 6],
        archetype: 'Human Capital <-> Community & Partners',
        kpiName: 'Ecosystem Co-creation Rate',
        metric: 'Hours in co-creative sessions / Total project hours',
        formula: 'Co_creative_Hours / Total_Hours',
        derivedFrom: 'sqrt(Face3.water * Face6.water)',
        question: 'What is the emotional flow and quality of our human relationships?',
        shadow: 'Are we isolated within our own team bubble?'
    },

    'E8-10': {
        id: 'E8-10',
        faces: [8, 10],
        archetype: 'Core Operations <-> Foundational Values',
        kpiName: 'Process Regeneration Rate',
        metric: 'Percentage of core processes with documented regenerative practice',
        formula: 'Value / 100',
        derivedFrom: 'sqrt(Face8.water * Face10.water)',
        question: 'Is there a healthy flow of regenerative practice within our operations?',
        shadow: 'Are processes stagnant or constantly evolving?'
    },

    'E2-6': {
        id: 'E2-6',
        faces: [2, 6],
        archetype: 'Intellectual Capital <-> Community & Partners',
        kpiName: 'Ecosystem Knowledge Flow',
        metric: 'Qualitative score (1-5) on collaborative knowledge sharing',
        formula: '(Value - 1) / (5 - 1)',
        derivedFrom: 'sqrt(Face2.water * Face6.water)',
        question: 'How does our knowledge flow to our community? (Teaching)',
        shadow: 'Are we hoarding knowledge or sharing it freely?'
    },

    'E1-6': {
        id: 'E1-6',
        faces: [1, 6],
        archetype: 'Financial Capital <-> Community & Partners',
        kpiName: 'Community Investment Ratio',
        metric: 'Value returned to community / Value extracted from community',
        formula: 'Value_Returned / Value_Extracted',
        derivedFrom: 'sqrt(Face1.water * Face6.water)',
        question: 'How does capital flow to and from our community in a healthy way?',
        shadow: 'Are we extracting more than we give?'
    },

    'E5-8': {
        id: 'E5-8',
        faces: [5, 8],
        archetype: 'Market Resonance <-> Core Operations',
        kpiName: 'Brand-Experience Coherence',
        metric: 'MIN(NPS, CSAT) / MAX(NPS, CSAT)',
        formula: 'MIN(NPS_normalized, CSAT_normalized) / MAX(NPS_normalized, CSAT_normalized)',
        derivedFrom: 'sqrt(Face5.fire * Face8.fire)',
        question: 'Does our market feedback transform into operational improvements?',
        shadow: 'Is feedback being ignored or actively resisted?'
    },

    'E4-9': {
        id: 'E4-9',
        faces: [4, 9],
        archetype: 'Structural Capital <-> Regenerative Flow',
        kpiName: 'Investor Readiness Score',
        metric: 'Checklist-based score (0-100%)',
        formula: 'Value / 100',
        derivedFrom: 'sqrt(Face4.fire * Face9.fire)',
        question: 'Can our structure transform to meet the needs of due diligence?',
        shadow: 'Is structure rigid or adaptable to investment scrutiny?'
    },

    'E1-2': {
        id: 'E1-2',
        faces: [1, 2],
        archetype: 'Financial Capital <-> Intellectual Capital',
        kpiName: 'IP Monetization Potential',
        metric: 'Qualitative score (1-10) on market relevance and defensibility',
        formula: '(Value - 1) / (10 - 1)',
        derivedFrom: 'sqrt(Face1.fire * Face2.fire)',
        question: 'How does our capital transform into valuable knowledge?',
        shadow: 'Is money buying ideas or just buying time?'
    },

    'E7-8': {
        id: 'E7-8',
        faces: [7, 8],
        archetype: 'Brand & Reputation <-> Core Operations',
        kpiName: 'Brand-Operational Integrity',
        metric: 'MIN(Brand Trust, Quality Score) / MAX(Brand Trust, Quality Score)',
        formula: 'MIN(Brand_Score_Norm, Quality_Score_Norm) / MAX(Brand_Score_Norm, Quality_Score_Norm)',
        derivedFrom: 'sqrt(Face7.fire * Face8.fire)',
        question: 'Does our brand promise transform into operational excellence?',
        shadow: 'Is our brand overpromising what operations cannot deliver?'
    },

    'E3-11': {
        id: 'E3-11',
        faces: [3, 11],
        archetype: 'Human Capital <-> Funding Pipeline',
        kpiName: 'Founder-Funder Resonance',
        metric: 'Qualitative score (1-10) on relationship quality with funders',
        formula: '(Value - 1) / (10 - 1)',
        derivedFrom: 'sqrt(Face3.fire * Face11.fire)',
        question: 'How does our human passion transform into the energy that attracts resources?',
        shadow: 'Is desperation driving fundraising instead of vision?'
    },

    'E10-12': {
        id: 'E10-12',
        faces: [10, 12],
        archetype: 'Foundational Values <-> Risk & Resilience',
        kpiName: 'Ethical Resilience',
        metric: 'Crisis scenario adherence to values (1-5)',
        formula: '(Value - 1) / (5 - 1)',
        derivedFrom: 'sqrt(Face10.fire * Face12.fire)',
        question: 'Do our values transform into resilience during a crisis?',
        shadow: 'Do values collapse under pressure?'
    },

    'E9-12': {
        id: 'E9-12',
        faces: [9, 12],
        archetype: 'Regenerative Flow <-> Risk & Resilience',
        kpiName: 'Regenerative Resilience',
        metric: 'Resilience wargame score on regenerative alternatives (1-5)',
        formula: '(Value - 1) / (5 - 1)',
        derivedFrom: 'sqrt(Face9.fire * Face12.fire)',
        question: 'Does our regenerative practice transform into greater systemic resilience?',
        shadow: 'Is regeneration a nice-to-have that disappears under stress?'
    },

    'E8-12': {
        id: 'E8-12',
        faces: [8, 12],
        archetype: 'Core Operations <-> Risk & Resilience',
        kpiName: 'Operational Resilience',
        metric: 'Mean Time To Recover (MTTR) from system failure',
        formula: '1 - (MTTR_hours / Max_Acceptable_Downtime_hours)',
        derivedFrom: 'sqrt(Face8.air * Face12.air)',
        question: 'Does operational clarity inform and reduce systemic risk?',
        shadow: 'Are we flying blind on operational vulnerabilities?'
    },

    'E1-7': {
        id: 'E1-7',
        faces: [1, 7],
        archetype: 'Financial Capital <-> Brand & Reputation',
        kpiName: 'Resonance ROI',
        metric: 'Brand awareness / Marketing budget (normalized)',
        formula: '(Awareness_Metric / Budget) / Target_Ratio',
        derivedFrom: 'sqrt(Face1.air * Face7.air)',
        question: 'How do we communicate our financial value and story?',
        shadow: 'Is marketing spend creating signal or just noise?'
    },

    'E6-7': {
        id: 'E6-7',
        faces: [6, 7],
        archetype: 'Community & Partners <-> Brand & Reputation',
        kpiName: 'Brand Capitalization Score',
        metric: 'Investor/funder feedback on brand influence (1-10)',
        formula: '(Value - 1) / (10 - 1)',
        derivedFrom: 'sqrt(Face6.air * Face7.air)',
        question: "Do we clearly communicate our brand's power to potential funders?",
        shadow: 'Is our brand story reaching the right ears?'
    },

    'E2-3': {
        id: 'E2-3',
        faces: [2, 3],
        archetype: 'Intellectual Capital <-> Human Capital',
        kpiName: 'Vision Embodiment Rate',
        metric: 'Tangible IP created / Hours of founder work',
        formula: 'IP_Units_Created / Hours_Worked',
        derivedFrom: 'sqrt(Face2.air * Face3.air)',
        question: "How do our people's minds connect to create shared knowledge?",
        shadow: 'Is the founder bottlenecking idea-to-IP conversion?'
    },

    'E10-11': {
        id: 'E10-11',
        faces: [10, 11],
        archetype: 'Foundational Values <-> Funding Pipeline',
        kpiName: 'Funding Alignment Index',
        metric: 'Weighted average values-alignment score of funding sources (1-5)',
        formula: '(Weighted_Average_Score - 1) / (5 - 1)',
        derivedFrom: 'sqrt(Face10.air * Face11.air)',
        question: 'Do we clearly communicate our values to our capital partners?',
        shadow: 'Are we hiding our values to attract misaligned capital?'
    },

    'E4-5': {
        id: 'E4-5',
        faces: [4, 5],
        archetype: 'Structural Capital <-> Market Resonance',
        kpiName: 'Structural Resonance',
        metric: 'Stakeholder survey on organizational clarity (1-5)',
        formula: '(Value - 1) / (5 - 1)',
        derivedFrom: 'sqrt(Face4.air * Face5.air)',
        question: 'Do our structures help or hinder the clarity of our public message?',
        shadow: 'Is internal complexity confusing external perception?'
    },

    'E5-7': {
        id: 'E5-7',
        faces: [5, 7],
        archetype: 'Market Resonance <-> Brand & Reputation',
        kpiName: 'Perception Integrity',
        metric: 'Short-term engagement / Long-term trust metrics',
        formula: 'Short_Term_Normalized / Long_Term_Normalized',
        derivedFrom: 'sqrt(Face5.ether * Face7.ether)',
        question: "Does our market resonance serve the highest purpose of our brand's truth?",
        shadow: 'Are we chasing viral moments instead of building lasting trust?'
    },

    'E3-9': {
        id: 'E3-9',
        faces: [3, 9],
        archetype: 'Human Capital <-> Regenerative Flow',
        kpiName: 'Cultural Integrity',
        metric: 'Anonymous team poll: "How well did we live our values this week?" (1-10)',
        formula: '(Value - 1) / (10 - 1)',
        derivedFrom: 'sqrt(Face3.ether * Face9.ether)',
        question: 'How does our humanity serve and express our highest values?',
        shadow: 'Are stated values and lived values the same?'
    },

    'E1-10': {
        id: 'E1-10',
        faces: [1, 10],
        archetype: 'Financial Capital <-> Foundational Values',
        kpiName: 'Regenerative Capital Allocation',
        metric: 'Regenerative budget / Total operating budget',
        formula: 'Regenerative_Budget / Total_Op_Budget',
        derivedFrom: 'sqrt(Face1.ether * Face10.ether)',
        question: 'How does our capital serve the highest purpose of regeneration?',
        shadow: 'Is money serving life or exploiting it?'
    },

    'E4-7': {
        id: 'E4-7',
        faces: [4, 7],
        archetype: 'Structural Capital <-> Brand & Reputation',
        kpiName: 'Reputational Integrity',
        metric: 'External ethics audit on governance perception (1-5)',
        formula: '(Value - 1) / (5 - 1)',
        derivedFrom: 'sqrt(Face4.ether * Face7.ether)',
        question: 'Does our structure embody the highest integrity of our brand?',
        shadow: 'Is structure performing integrity without embodying it?'
    },

    'E2-11': {
        id: 'E2-11',
        faces: [2, 11],
        archetype: 'Intellectual Capital <-> Funding Pipeline',
        kpiName: 'IP Generosity Rate',
        metric: 'Open Source contributions / Total IP assets',
        formula: 'Open_Contributions / (Open_Contributions + Closed_Assets)',
        derivedFrom: 'sqrt(Face2.ether * Face11.ether)',
        question: 'Does our knowledge serve the highest purpose of regeneration?',
        shadow: 'Is our IP serving humanity or hoarding value?'
    }
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 3: EDGE INTERFACE INQUIRIES - Consciousness Questions
// ════════════════════════════════════════════════════════════════════════════

/**
 * EDGE_INTERFACE_INQUIRIES - Questions for exploring edge health
 *
 * @constant {Object}
 */
const EDGE_INTERFACE_INQUIRIES = {

    health: {
        flow: 'Is energy flowing freely between these domains, or is there a blockage?',
        translation: 'What gets lost in translation at this boundary?',
        reciprocity: 'Is the exchange balanced, or is one domain giving without receiving?',
        friction: 'Is there healthy friction (creative tension) or unhealthy friction (conflict)?',
        permeability: 'Is this boundary too rigid (blocking flow) or too porous (losing definition)?'
    },

    dynamics: {
        whenBlocked: 'What fear or protection is causing this boundary to close?',
        whenLeaking: 'What value is escaping that should be contained?',
        whenAmplifying: 'How is this interface creating multiplication rather than just addition?',
        whenConflicting: 'What values are clashing at this boundary? How might they reconcile?',
        whenHarmonizing: 'What makes this interface particularly graceful? Can we learn from it?'
    },

    byExchangeType: {
        Grounding: {
            surface: 'Is this interface grounded in clear agreements?',
            depth: 'What structures support or block flow at this boundary?',
            shadow: 'Is bureaucracy strangling what wants to move?',
            gift: 'What stability does this interface provide to the whole?'
        },
        Flow: {
            surface: 'Is there healthy flow between these domains?',
            depth: 'What emotions live at this interface?',
            shadow: 'Is the flow drying up or flooding?',
            gift: 'What adaptability emerges from this exchange?'
        },
        Transformation: {
            surface: 'What is being transformed at this interface?',
            depth: 'What old form is dying to birth the new?',
            shadow: 'Is the fire out of control or extinguished?',
            gift: 'What catalytic power does this interface provide?'
        },
        Communication: {
            surface: 'Is communication clear at this interface?',
            depth: 'What truths are trying to be spoken between these domains?',
            shadow: 'Is there noise drowning out signal?',
            gift: 'What connections does this interface enable?'
        },
        Purpose: {
            surface: 'Does this interface serve a higher purpose?',
            depth: 'What meaning is being created at this boundary?',
            shadow: 'Is purpose being performed without being embodied?',
            gift: 'What transcendent value emerges from this meeting?'
        }
    }
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 4: EDGE CONSTANT - Epsilon
// ════════════════════════════════════════════════════════════════════════════

/**
 * EDGE_CONSTANT - The epsilon parameter for edge sensitivity
 *
 * @constant {Object}
 */
const EDGE_CONSTANT = {
    symbol: 'epsilon',
    greekSymbol: 'ε',
    value: 0.236,
    derivation: 'phi^-3',
    meaning: 'Edge Sensitivity - tension threshold at domain interfaces',
    usage: 'When edge tension exceeds epsilon, intervention is warranted'
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 5: HELPER FUNCTIONS
// ════════════════════════════════════════════════════════════════════════════

/**
 * Get edge by ID
 *
 * @param {string} edgeId - Edge ID (e.g., 'E1-2', 'E5-9')
 * @returns {Object|null} Edge definition
 */
function getEdgeById(edgeId) {
    return EDGE_KPI_LIBRARY[edgeId] || null;
}

/**
 * Get all edges for a given face
 *
 * @param {number} faceNumber - Face number (1-12)
 * @returns {Array} Array of edge objects connected to this face
 */
function getEdgesForFace(faceNumber) {
    return Object.values(EDGE_KPI_LIBRARY).filter(
        edge => edge.faces.includes(faceNumber)
    );
}

/**
 * Get edges by exchange type
 *
 * @deprecated PURE MEMBRANE MODEL: Exchange type now emerges dynamically from synergy.
 *             Use SacredInquiry.getInquiry(tension, faceA, faceB).dominantElement instead.
 *             This function returns an empty array as exchangeType has been removed.
 *
 * @param {string} exchangeType - 'Grounding', 'Flow', 'Transformation', 'Communication', 'Purpose'
 * @returns {Array} Empty array (deprecated)
 */
function getEdgesByExchangeType(exchangeType) {
    console.warn('[EdgeConstants] getEdgesByExchangeType is DEPRECATED. Use SacredInquiry.getInquiry() instead.');
    return [];
}

/**
 * Get the edge connecting two specific faces
 *
 * @param {number} faceA - First face number
 * @param {number} faceB - Second face number
 * @returns {Object|null} Edge definition or null if not adjacent
 */
function getEdgeBetweenFaces(faceA, faceB) {
    return Object.values(EDGE_KPI_LIBRARY).find(
        edge => edge.faces.includes(faceA) && edge.faces.includes(faceB)
    ) || null;
}

/**
 * Get count of edges by exchange type
 *
 * @deprecated PURE MEMBRANE MODEL: Exchange type now emerges dynamically from synergy.
 *             Use SacredInquiry to calculate dominant elements at runtime.
 *
 * @returns {Object} Object with all counts at 0 (deprecated)
 */
function getEdgeExchangeTypeCounts() {
    console.warn('[EdgeConstants] getEdgeExchangeTypeCounts is DEPRECATED. Exchange types emerge dynamically via SacredInquiry.');
    return { Grounding: 0, Flow: 0, Transformation: 0, Communication: 0, Purpose: 0 };
}

// ════════════════════════════════════════════════════════════════════════════
// SECTION 6: EXPORTS
// ════════════════════════════════════════════════════════════════════════════

// Browser global export
if (typeof window !== 'undefined') {
    window.EdgeConstants = {
        // Exchange Types
        EXCHANGE_TYPES,

        // The 30 Edge KPIs
        EDGE_KPI_LIBRARY,

        // Consciousness Inquiries
        EDGE_INTERFACE_INQUIRIES,

        // Epsilon constant
        EDGE_CONSTANT,

        // Helper Functions
        getEdgeById,
        getEdgesForFace,
        getEdgesByExchangeType,
        getEdgeBetweenFaces,
        getEdgeExchangeTypeCounts
    };

    console.log('🔗 Edge Constants loaded - 30 pure membrane interfaces');
    console.log('   Pure Membrane Model: Edge character emerges from SacredInquiry synergy calculation');
}

// CommonJS export (for Node.js testing)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        EXCHANGE_TYPES,
        EDGE_KPI_LIBRARY,
        EDGE_INTERFACE_INQUIRIES,
        EDGE_CONSTANT,
        getEdgeById,
        getEdgesForFace,
        getEdgesByExchangeType,
        getEdgeBetweenFaces,
        getEdgeExchangeTypeCounts
    };
}
