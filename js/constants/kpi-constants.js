/**
 * ════════════════════════════════════════════════════════════════════════════
 * KPI CONSTANTS - SINGLE SOURCE OF TRUTH FOR KPI DEFINITIONS
 * ════════════════════════════════════════════════════════════════════════════
 *
 * This module provides the foundational constants for the KPI measurement
 * system in Quannex. It defines the three-layer architecture (Ball, Pillar,
 * Pentagram), elemental weights, axis oppositions, and tuning parameters.
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                        NOTES FOR FUTURE CLAUDE                          │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * KEY INSIGHT: KPIs exist at THREE levels in Quannex.
 * ─────────────────────────────────────────────────────────────────────────
 *   1. BALL KPI (Primary): Face's central metric (weight: α = 0.6)
 *   2. PILLAR KPIs (5 Elements): Pentagram vertices (weight: 0.2 each)
 *   3. PENTAGRAM LAYER: Calculated star pairs, intersections, symmetry
 *
 * The Ball represents the "heartbeat" of each face - a single KPI that
 * captures the essence of that organizational domain. The Pillars are the
 * five elemental perspectives (Earth, Water, Fire, Air, Ether) that give
 * depth and nuance. Together they form the Face's coherence score.
 *
 * WHY THESE CONSTANTS?
 * ─────────────────────────────────────────────────────────────────────────
 *   α = 0.6 → Star pair blending weight (from CSV_Face_Models.csv)
 *   β = 0.5 → Intersection blend (PHI_MIDPOINT - perfect balance)
 *   γ = 0.7 → Nuanced average weighting (leans toward excellence)
 *   δ = 0.9 → Axis coherence factor (90% light, 10% shadow honored)
 *
 * All values orbit the golden neighborhood (φ^-1 = 0.618 to ψ₃ = 0.764).
 * There are NO arbitrary numbers - each has geometric or philosophical basis.
 *
 * NAVIGATION MAP:
 * ─────────────────────────────────────────────────────────────────────────
 *   - phi-harmonics.js → PHI constants (imports from there)
 *   - edge-constants.js → 30 edge interface KPIs
 *   - vertex-constants.js → 20 vertex triadic convergences
 *   - consciousness-constants.js → Contemplative measurement inquiries
 *   - js/main.js → Uses these for coherence calculations
 *   - js/kpi-library.js → KPI suggestion engine references these
 *
 * @module js/constants/kpi-constants
 * @author Deimantas & Claude (Co-created with consciousness and love)
 * @version 1.0.0
 * @see {@link ./phi-harmonics.js} - PHI constants source
 * @see {@link ../../docs/math/CALCULATION_AUDIT_TRAIL.md} - Formula proofs
 * ════════════════════════════════════════════════════════════════════════════
 */

// ════════════════════════════════════════════════════════════════════════════
// SECTION 1: PHI REFERENCE (Values come from phi-harmonics.js)
// ════════════════════════════════════════════════════════════════════════════

/**
 * PHI values are provided by phi-harmonics.js (loaded before this file)
 * and available via window.PhiHarmonics.
 *
 * We do NOT redeclare PHI/PHI_1/etc. here because when both phi-harmonics.js
 * and kpi-constants.js are loaded as regular <script> tags, duplicate
 * `const` declarations in the global scope cause a SyntaxError that
 * kills the entire file.
 *
 * Access PHI values via: window.PhiHarmonics.PHI, .PHI_1, .PHI_2, etc.
 * The PENTAGRAM_CONSTANTS below use hardcoded numeric values (derived from PHI)
 * so no local PHI reference is needed in this file.
 */

// ════════════════════════════════════════════════════════════════════════════
// SECTION 2: KPI TYPES - The Three Measurement Categories
// ════════════════════════════════════════════════════════════════════════════

/**
 * KPI_TYPES - Classification of organizational metrics
 *
 * Not all metrics behave the same way. Understanding the TYPE helps
 * interpret what "good" means for each KPI.
 *
 * @constant {Object}
 */
const KPI_TYPES = {
    /**
     * SURVIVAL metrics - Required minimum for organizational existence
     * Example: Months of Runway, Team Retention Rate
     * Interpretation: Below threshold = existential risk
     */
    survival: {
        id: 'survival',
        name: 'Survival',
        description: 'Required minimum for existence',
        interpretation: 'Below threshold indicates existential risk',
        icon: '🛡️'
    },

    /**
     * GROWTH metrics - Measures of healthy development
     * Example: Revenue Growth Rate, Innovation Pipeline
     * Interpretation: Higher is generally better, but sustainability matters
     */
    growth: {
        id: 'growth',
        name: 'Growth',
        description: 'Measures of healthy development',
        interpretation: 'Higher values indicate expansion and vitality',
        icon: '📈'
    },

    /**
     * COMPLETION metrics - Progress toward defined goals
     * Example: Project Completion Rate, OKR Achievement
     * Interpretation: 1.0 = goal fully achieved
     */
    completion: {
        id: 'completion',
        name: 'Completion',
        description: 'Progress toward defined goals',
        interpretation: '1.0 represents goal achievement',
        icon: '✓'
    }
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 3: ELEMENTS - The Five Pentagram Vertices
// ════════════════════════════════════════════════════════════════════════════

/**
 * ELEMENTS - The five elemental perspectives for each face
 *
 * Each face has 5 Pillar KPIs, one for each element. This creates the
 * pentagram structure within each face. The elements aren't arbitrary -
 * they represent fundamental modes of organizational inquiry.
 *
 * The weight of 0.2 each (totaling 1.0) means each element contributes
 * equally to the Pillar layer. This is the democratic foundation upon
 * which the Ball KPI sits as the primary signal.
 *
 * @constant {Object}
 */
const ELEMENTS = {
    Earth: {
        id: 'earth',
        name: 'Earth',
        archetype: 'The Foundation',
        question: 'Is it grounded? Does it have stability?',
        indicators: ['consistency', 'reliability', 'physical presence', 'tangible assets'],
        weight: 0.2,
        position: 0  // Pentagram vertex position
    },

    Water: {
        id: 'water',
        name: 'Water',
        archetype: 'The Flow',
        question: 'Is it flowing? Is there adaptability?',
        indicators: ['flexibility', 'responsiveness', 'emotional intelligence', 'adaptability'],
        weight: 0.2,
        position: 1
    },

    Fire: {
        id: 'fire',
        name: 'Fire',
        archetype: 'The Catalyst',
        question: 'Is it transformative? Does it drive change?',
        indicators: ['passion', 'energy', 'transformation power', 'initiative'],
        weight: 0.2,
        position: 2
    },

    Air: {
        id: 'air',
        name: 'Air',
        archetype: 'The Connector',
        question: 'Is it communicative? Does it connect?',
        indicators: ['clarity', 'communication', 'relationships', 'information flow'],
        weight: 0.2,
        position: 3
    },

    Ether: {
        id: 'ether',
        name: 'Ether',
        archetype: 'The Transcendent',
        question: 'Is it purposeful? Does it align with higher meaning?',
        indicators: ['purpose', 'vision', 'spiritual alignment', 'systemic contribution'],
        weight: 0.2,
        position: 4
    }
};

/**
 * Element array for iteration (maintains pentagram order)
 */
const ELEMENT_ORDER = ['Earth', 'Water', 'Fire', 'Air', 'Ether'];

// ════════════════════════════════════════════════════════════════════════════
// SECTION 4: KPI LAYERS - The Three-Level Architecture
// ════════════════════════════════════════════════════════════════════════════

/**
 * KPI_LAYERS - The hierarchical structure of face measurement
 *
 * This is the architectural insight: every face is measured at three levels,
 * each building on the previous. The Ball is simple (one KPI), the Pillars
 * add depth (5 KPIs), and the Pentagram adds geometric sophistication
 * (star pairs, intersections, symmetry).
 *
 * @constant {Object}
 */
const KPI_LAYERS = {
    Ball: {
        id: 'ball',
        name: 'Ball',
        description: 'Primary face KPI - the heartbeat',
        weight: 0.6,  // α - star pair blending weight from CSV
        kpiCount: 1,
        philosophy: 'The Ball is the face\'s primary pulse. It answers: "How is this domain doing overall?"'
    },

    Pillar: {
        id: 'pillar',
        name: 'Pillar',
        description: 'Five elemental KPIs forming the pentagram vertices',
        weight: 0.4,  // Remaining weight (1 - α = 0.4, distributed across 5)
        kpiCount: 5,
        philosophy: 'The Pillars are the five perspectives that give depth. Each element asks a different question.'
    },

    Pentagram: {
        id: 'pentagram',
        name: 'Pentagram',
        description: 'Calculated layer: star pairs, intersections, symmetry',
        weight: null,  // Calculated, not weighted
        kpiCount: null,  // Derived metrics
        philosophy: 'The Pentagram layer emerges from geometric relationships - it cannot be directly measured.'
    }
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 5: DIRECTION TYPES - How KPIs Signal Change
// ════════════════════════════════════════════════════════════════════════════

/**
 * DIRECTION_TYPES - How to interpret whether a KPI is improving
 *
 * Not all metrics improve in the same direction. Revenue going up is good.
 * Employee turnover going up is bad. Some metrics have a target band.
 *
 * @constant {Object}
 */
const DIRECTION_TYPES = {
    up: {
        id: 'up',
        name: 'Up Arrow',
        symbol: '↑',
        description: 'Higher is better',
        examples: ['Revenue', 'NPS', 'Employee Engagement']
    },

    down: {
        id: 'down',
        name: 'Down Arrow',
        symbol: '↓',
        description: 'Lower is better',
        examples: ['Churn Rate', 'Bug Count', 'Time to Resolution']
    },

    band: {
        id: 'band',
        name: 'Target Band',
        symbol: '↔',
        description: 'Optimal value is in a range, not at extreme',
        examples: ['Work Hours', 'Meeting Load', 'Inventory Levels']
    }
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 6: PENTAGRAM CONSTANTS - The Greek Letter Parameters
// ════════════════════════════════════════════════════════════════════════════

/**
 * PENTAGRAM_CONSTANTS - The tuning parameters for coherence calculation
 *
 * These constants are derived from the CSV_Face_Models.csv file and
 * represent the mathematical weights used in the pentagram calculation
 * engine. Each has a philosophical meaning tied to organizational wisdom.
 *
 * @constant {Object}
 */
const PENTAGRAM_CONSTANTS = {
    /**
     * α (alpha) - Star pair blending weight
     *
     * Used in: s₁ = α×k₁ + (1-α)×k₂
     * Meaning: How strongly the first element influences the star pair
     *
     * Value: 0.6 (slightly favoring the first element in each pair)
     */
    alpha: {
        symbol: 'α',
        value: 0.6,
        derivation: 'Between φ^-1 and φ^-2, optimized empirically',
        usage: 'Star pair calculation: s₁ = α×k₁ + (1-α)×k₂',
        philosophy: 'Star pair blending - the first element slightly leads the dance'
    },

    /**
     * β (beta) - Intersection blend factor
     *
     * Used in: p₁ = β×s₁ + (1-β)×s₂
     * Meaning: How star pairs combine at intersection points
     *
     * Value: 0.5 (perfect balance - PHI_MIDPOINT)
     */
    beta: {
        symbol: 'β',
        value: 0.5,
        derivation: 'PHI_MIDPOINT - exact harmonic center',
        usage: 'Intersection calculation: p₁ = β×s₁ + (1-β)×s₂',
        philosophy: 'Perfect symmetry in pentagram flow - where elements meet as equals'
    },

    /**
     * γ (gamma) - Nuanced average weighting
     *
     * Used in: NuancedAvg = γ×max(pillars) + (1-γ)×avg(pillars)
     * Meaning: How much to weight excellence vs. overall average
     *
     * Value: 0.7 (70% excellence, 30% average - leans toward high performers)
     */
    gamma: {
        symbol: 'γ',
        value: 0.7,
        derivation: 'Between φ^-1 (0.618) and ψ₃ (0.764)',
        usage: 'Nuanced average: γ×max(pillars) + (1-γ)×mean(pillars)',
        philosophy: '70% self, 30% influenced by connections - the golden blend'
    },

    /**
     * δ (delta) - Axis coherence factor
     *
     * Used in: AxisCoherence = δ×localCoherence + (1-δ)×oppositeCoherence
     * Meaning: How much local face vs. opposite face influences axis health
     *
     * Value: 0.9 (90% local focus, 10% opposite influence)
     */
    delta: {
        symbol: 'δ',
        value: 0.9,
        derivation: '≈ ψ₅ (0.910) - near-radiance threshold',
        usage: 'Axis coherence: δ×local + (1-δ)×opposite',
        philosophy: 'Focus on light (90%), honor the shadow (10%)'
    },

    /**
     * κ (kappa) - Curvature sensitivity parameter
     *
     * Used in: curved_score = tanh(κ × (raw_score - 0.5)) / tanh(κ × 0.5)
     * Meaning: How sharply the S-curve distinguishes good from bad
     *
     * Value: 2.0 default (configurable by template mode)
     */
    kappa: {
        symbol: 'κ',
        value: 2.0,
        derivation: 'Harmonic octave - balanced sensitivity',
        usage: 'Sigmoid curvature: tanh(κ × (score - 0.5))',
        philosophy: 'Balanced awareness - neither panic nor numbness'
    }
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 7: AXIS OPPOSITIONS - The Six Breath Pairs
// ════════════════════════════════════════════════════════════════════════════

/**
 * AXIS_OPPOSITIONS - The six polarity pairs of the dodecahedron
 *
 * In dodecahedral geometry, every face has exactly one opposite face.
 * This creates 6 "breath axes" - polarities that must be balanced.
 * The organization breathes between these poles.
 *
 * These are verified against DODECAHEDRON_TOPOLOGY in main.js and
 * BREATH_AXIS_REFERENCE.md documentation.
 *
 * @constant {Object}
 */
const AXIS_OPPOSITIONS = {
    /**
     * Axis 1: Resource Flow
     * Financial Capital (F1) ↔ Funding Pipeline (F11)
     * The breath of money: earning vs. raising capital
     */
    axis1: {
        id: 'resourceFlow',
        name: 'Resource Flow',
        faceA: 1,
        faceB: 11,
        domainA: 'Financial Capital',
        domainB: 'Funding Pipeline',
        tension: 'The tension between earning and raising capital',
        question: 'Are we financially self-sustaining or funding-dependent?'
    },

    /**
     * Axis 2: Knowledge Flow
     * Intellectual Capital (F2) ↔ Brand & Reputation (F7)
     * The breath of wisdom: internal knowing vs. external perception
     */
    axis2: {
        id: 'knowledgeFlow',
        name: 'Knowledge Flow',
        faceA: 2,
        faceB: 7,
        domainA: 'Intellectual Capital',
        domainB: 'Brand & Reputation',
        tension: 'The tension between what we know and how we are perceived',
        question: 'Does our reputation reflect our true knowledge and capability?'
    },

    /**
     * Axis 3: Being & Doing
     * Human Capital (F3) ↔ Core Operations (F8)
     * The breath of action: who we are vs. what we do
     */
    axis3: {
        id: 'beingDoing',
        name: 'Being & Doing',
        faceA: 3,
        faceB: 8,
        domainA: 'Human Capital',
        domainB: 'Core Operations',
        tension: 'The tension between nurturing people and driving execution',
        question: 'Are we burning out our people to achieve operational goals?'
    },

    /**
     * Axis 4: Structure & Adaptation
     * Structural Capital (F4) ↔ Regenerative Flow (F9)
     * The breath of form: stability vs. renewal
     */
    axis4: {
        id: 'structureAdaptation',
        name: 'Structure & Adaptation',
        faceA: 4,
        faceB: 9,
        domainA: 'Structural Capital',
        domainB: 'Regenerative Flow',
        tension: 'The tension between structure and organic renewal',
        question: 'Are our structures enabling or blocking regeneration?'
    },

    /**
     * Axis 5: Internal & External
     * Market Resonance (F5) ↔ Foundational Values (F10)
     * The breath of identity: market response vs. core values
     */
    axis5: {
        id: 'internalExternal',
        name: 'Internal & External',
        faceA: 5,
        faceB: 10,
        domainA: 'Market Resonance',
        domainB: 'Foundational Values',
        tension: 'The tension between market demands and core values',
        question: 'Are we compromising values for market success?'
    },

    /**
     * Axis 6: Connection & Protection
     * Community & Partners (F6) ↔ Risk & Resilience (F12)
     * The breath of relationship: openness vs. protection
     */
    axis6: {
        id: 'connectionProtection',
        name: 'Connection & Protection',
        faceA: 6,
        faceB: 12,
        domainA: 'Community & Partners',
        domainB: 'Risk & Resilience',
        tension: 'The tension between openness and self-protection',
        question: 'Are partnerships increasing or decreasing our vulnerability?'
    }
};

/**
 * Quick lookup: face number to its opposite
 */
const FACE_OPPOSITES = {
    1: 11, 11: 1,   // Financial ↔ Funding
    2: 7, 7: 2,     // Intellectual ↔ Brand
    3: 8, 8: 3,     // Human ↔ Operations
    4: 9, 9: 4,     // Structural ↔ Regenerative
    5: 10, 10: 5,   // Market ↔ Values
    6: 12, 12: 6    // Community ↔ Risk
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 8: DOMAIN NAMES - The 12 Faces
// ════════════════════════════════════════════════════════════════════════════

/**
 * DOMAIN_NAMES - The canonical names for the 12 dodecahedron faces
 *
 * These are the SINGLE SOURCE OF TRUTH for domain names.
 * All other files should reference this.
 *
 * @constant {Object}
 */
const DOMAIN_NAMES = {
    1: 'Financial Capital',
    2: 'Intellectual Capital',
    3: 'Human Capital',
    4: 'Structural Capital',
    5: 'Market Resonance',
    6: 'Community & Partners',
    7: 'Brand & Reputation',
    8: 'Core Operations',
    9: 'Regenerative Flow',
    10: 'Foundational Values',
    11: 'Funding Pipeline',
    12: 'Risk & Resilience'
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 9: TEMPLATE MODES - Organizational Archetypes
// ════════════════════════════════════════════════════════════════════════════

/**
 * TEMPLATE_MODES - Preset configurations for different organizational types
 *
 * Not all organizations should be measured the same way. A startup needs
 * gentler curves (more forgiving). An enterprise needs sharper accountability.
 * These modes adjust the Greek constants accordingly.
 *
 * @constant {Object}
 */
const TEMPLATE_MODES = {
    startup: {
        id: 'startup',
        name: 'Startup Mode',
        description: 'Gentler curves, lower thresholds - for emerging organizations',
        constants: {
            alpha: 0.4,   // More balanced star pairs
            beta: 0.5,    // Standard intersection
            gamma: 0.6,   // Ball weight (startup mode from plan)
            delta: 0.9,   // Standard axis factor
            kappa: 1.5    // Gentler curvature
        },
        philosophy: 'Survival is the first octave. Be gentle with the emerging.'
    },

    balanced: {
        id: 'balanced',
        name: 'Balanced Mode',
        description: 'Default configuration for most organizations',
        constants: {
            alpha: 0.6,   // Standard star pair blend
            beta: 0.5,    // PHI_MIDPOINT
            gamma: 0.7,   // Standard ball weight
            delta: 0.9,   // Standard axis factor
            kappa: 2.0    // Balanced curvature
        },
        philosophy: 'The middle path. Neither too harsh nor too forgiving.'
    },

    enterprise: {
        id: 'enterprise',
        name: 'Enterprise Mode',
        description: 'Sharper curves, higher accountability - for mature organizations',
        constants: {
            alpha: 0.7,   // Stronger first-element influence
            beta: 0.5,    // Standard intersection
            gamma: 0.8,   // Higher accountability
            delta: 0.9,   // Standard axis factor
            kappa: 4.0    // Sharp curvature (high sensitivity)
        },
        philosophy: 'With maturity comes accountability. Excellence is expected.'
    },

    nonDual: {
        id: 'nonDual',
        name: 'Non-Dual Mode',
        description: 'Perfect symmetry - for consciousness-focused analysis',
        constants: {
            alpha: 0.5,   // Perfect balance
            beta: 0.5,    // Perfect balance
            gamma: 0.5,   // Perfect balance
            delta: 0.5,   // Equal local and opposite
            kappa: 3.0    // Moderate curvature
        },
        philosophy: 'No preference. No judgment. Pure witnessing.'
    }
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 10: HELPER FUNCTIONS
// ════════════════════════════════════════════════════════════════════════════

/**
 * Get the opposite face number for a given face
 *
 * @param {number} faceNumber - Face number (1-12)
 * @returns {number} Opposite face number
 */
function getOppositeFace(faceNumber) {
    return FACE_OPPOSITES[faceNumber] || null;
}

/**
 * Get domain name by face number
 *
 * @param {number} faceNumber - Face number (1-12)
 * @returns {string} Domain name
 */
function getDomainName(faceNumber) {
    return DOMAIN_NAMES[faceNumber] || `Unknown (${faceNumber})`;
}

/**
 * Get axis information for a face
 *
 * @param {number} faceNumber - Face number (1-12)
 * @returns {Object} Axis info including opposite face and axis name
 */
function getAxisForFace(faceNumber) {
    for (const [axisKey, axis] of Object.entries(AXIS_OPPOSITIONS)) {
        if (axis.faceA === faceNumber || axis.faceB === faceNumber) {
            return {
                axisId: axis.id,
                axisName: axis.name,
                thisFace: faceNumber,
                oppositeFace: axis.faceA === faceNumber ? axis.faceB : axis.faceA,
                tension: axis.tension,
                question: axis.question
            };
        }
    }
    return null;
}

/**
 * Get constants for a template mode
 *
 * @param {string} mode - Template mode id ('startup', 'balanced', 'enterprise', 'nonDual')
 * @returns {Object} Constants object with alpha, beta, gamma, delta, kappa
 */
function getTemplateConstants(mode) {
    return TEMPLATE_MODES[mode]?.constants || TEMPLATE_MODES.balanced.constants;
}

/**
 * Get element by position in pentagram
 *
 * @param {number} position - Position (0-4)
 * @returns {Object} Element object
 */
function getElementByPosition(position) {
    const elementName = ELEMENT_ORDER[position];
    return ELEMENTS[elementName] || null;
}

// ════════════════════════════════════════════════════════════════════════════
// SECTION 11: EXPORTS
// ════════════════════════════════════════════════════════════════════════════

// Browser global export
if (typeof window !== 'undefined') {
    window.KpiConstants = {
        // KPI Types
        KPI_TYPES,

        // Elements
        ELEMENTS,
        ELEMENT_ORDER,

        // Layers
        KPI_LAYERS,

        // Direction Types
        DIRECTION_TYPES,

        // Pentagram Constants (Greek letters)
        PENTAGRAM_CONSTANTS,

        // Axis Oppositions
        AXIS_OPPOSITIONS,
        FACE_OPPOSITES,

        // Domain Names
        DOMAIN_NAMES,

        // Template Modes
        TEMPLATE_MODES,

        // Helper Functions
        getOppositeFace,
        getDomainName,
        getAxisForFace,
        getTemplateConstants,
        getElementByPosition
    };

    console.log('📊 KPI Constants loaded - Single Source of Truth for KPI definitions');
    console.log('   Layers: Ball (α=0.6) → Pillar (5×0.2) → Pentagram (calculated)');
    console.log('   Greek: α=0.6, β=0.5, γ=0.7, δ=0.9, κ=2.0');
}

// CommonJS export (for Node.js testing)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        KPI_TYPES,
        ELEMENTS,
        ELEMENT_ORDER,
        KPI_LAYERS,
        DIRECTION_TYPES,
        PENTAGRAM_CONSTANTS,
        AXIS_OPPOSITIONS,
        FACE_OPPOSITES,
        DOMAIN_NAMES,
        TEMPLATE_MODES,
        getOppositeFace,
        getDomainName,
        getAxisForFace,
        getTemplateConstants,
        getElementByPosition
    };
}
