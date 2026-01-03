/**
 * ════════════════════════════════════════════════════════════════════════════
 * VERTEX CONSTANTS - THE 20 TRIADIC CONVERGENCE POINTS
 * ════════════════════════════════════════════════════════════════════════════
 *
 * This module defines the 20 vertices of the dodecahedron - the points where
 * three domain faces meet. Each vertex is a VORTEX of triadic energy where
 * emergence happens.
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                        NOTES FOR FUTURE CLAUDE                          │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * KEY INSIGHT: Every vertex involves EXACTLY 3 domains.
 * ─────────────────────────────────────────────────────────────────────────
 * This is geometrically fixed and organizationally profound. Where three
 * domains converge, something NEW emerges that none could create alone.
 * 1 + 1 + 1 doesn't equal 3 at a vertex - it equals something entirely new.
 *
 * VERTEX AS VORTEX:
 * ─────────────────────────────────────────────────────────────────────────
 * Each vertex is a spinning vortex where three energies mix. The vortex can:
 *   - Spiral UP (synergy): Faces amplify each other
 *   - Spiral DOWN (drain): Faces conflict and waste energy
 *   - Remain BALANCED: Stable, healthy convergence
 *
 * VORTEX STRENGTH (sigma):
 * ─────────────────────────────────────────────────────────────────────────
 * The key metric is the VARIANCE between face energies. Low variance =
 * harmony. High variance = "Bermuda Triangle" - hidden conflict.
 *
 * Formula: sigma = average_difference(E1, E2, E3)
 *
 * VERTEX CLASSIFICATIONS:
 * ─────────────────────────────────────────────────────────────────────────
 *   - Harmony Hub: High strength, high coherence (thriving)
 *   - Bermuda Triangle: High strength, low coherence (crisis point)
 *   - Leverage Point: High strength, moderate coherence (opportunity)
 *   - Dormant: Low strength, moderate coherence (sleeping)
 *
 * NAVIGATION MAP:
 * ─────────────────────────────────────────────────────────────────────────
 *   - data/CSV_Vortex_Map.csv -> Source data (20 vertices)
 *   - js/advanced/vertex-analyzer.js -> Vertex calculation engine
 *   - docs/VERTEX_DYNAMICS_REFERENCE.md -> Full vertex documentation
 *   - kpi-constants.js -> Domain names and face definitions
 *   - consciousness-constants.js -> Vertex inquiries
 *
 * @module js/constants/vertex-constants
 * @author Deimantas & Claude (Co-created with consciousness and love)
 * @version 1.0.0
 * @see {@link ../../data/CSV_Vortex_Map.csv} - Source data
 * @see {@link ../../docs/VERTEX_DYNAMICS_REFERENCE.md} - Full documentation
 * ════════════════════════════════════════════════════════════════════════════
 */

// ════════════════════════════════════════════════════════════════════════════
// SECTION 1: PHI IMPORTS
// ════════════════════════════════════════════════════════════════════════════

const PHI = (typeof window !== 'undefined' && window.PhiHarmonics?.PHI) || (1 + Math.sqrt(5)) / 2;
const PHI_1 = (typeof window !== 'undefined' && window.PhiHarmonics?.PHI_1) || 1 / PHI;

// ════════════════════════════════════════════════════════════════════════════
// SECTION 2: VERTEX CLASSIFICATIONS - States of Triadic Health
// ════════════════════════════════════════════════════════════════════════════

/**
 * VERTEX_CLASSIFICATIONS - The four states a vertex can be in
 *
 * These classifications help prioritize attention and intervention.
 * They are determined by the combination of Strength and Coherence.
 *
 * @constant {Object}
 */
const VERTEX_CLASSIFICATIONS = {
    harmonyHub: {
        id: 'harmonyHub',
        name: 'Harmony Hub',
        emoji: '🌟',
        description: 'High strength, high coherence - thriving convergence',
        criteria: {
            strength: '>= 0.7',
            coherence: '>= 0.7'
        },
        meaning: 'This is a place of organizational excellence where three domains dance beautifully together',
        action: 'Celebrate and learn from this pattern. Can it be replicated elsewhere?',
        fibonacciTiming: '8 weeks (thriving, check quarterly)'
    },

    bermudaTriangle: {
        id: 'bermudaTriangle',
        name: 'Bermuda Triangle',
        emoji: '🔺',
        description: 'High strength, low coherence - crisis point',
        criteria: {
            strength: '>= 0.7',
            coherence: '< 0.5'
        },
        meaning: 'High energy but misaligned - these three domains are fighting instead of flowing',
        action: 'URGENT: Get all three domain leaders in a room. This is a hidden source of chaos.',
        fibonacciTiming: '1 week (urgent intervention needed)'
    },

    leveragePoint: {
        id: 'leveragePoint',
        name: 'Leverage Point',
        emoji: '🎯',
        description: 'High strength, moderate coherence - high opportunity',
        criteria: {
            strength: '>= 0.7',
            coherence: '>= 0.5 && < 0.7'
        },
        meaning: 'Strong energy with room for alignment - small changes could create big effects',
        action: 'Strategic opportunity. Investment here would ripple far.',
        fibonacciTiming: '2 weeks (high priority attention)'
    },

    dormant: {
        id: 'dormant',
        name: 'Dormant',
        emoji: '💤',
        description: 'Low strength - quiet convergence point',
        criteria: {
            strength: '< 0.7',
            coherence: 'any'
        },
        meaning: 'Low energy meeting point - may be intentionally quiet or blocked',
        action: 'Monitor. Ask: Is this dormancy healthy rest or suppressed potential?',
        fibonacciTiming: '3 weeks (routine monitoring)'
    }
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 3: VERTEX TOPOLOGY - All 20 Vertices
// ════════════════════════════════════════════════════════════════════════════

/**
 * VERTEX_TOPOLOGY - Complete definition of all 20 triadic convergence points
 *
 * Each vertex defines which three faces meet and provides an archetype name
 * that captures the essence of that convergence.
 *
 * @constant {Object}
 */
const VERTEX_TOPOLOGY = {

    // ═══════════════════════════════════════════════════════════════════════
    // NORTH POLAR VERTICES (V1-V5) - Resource & Capital Convergences
    // ═══════════════════════════════════════════════════════════════════════

    V1: {
        id: 'V1',
        faces: [1, 2, 6],
        domains: ['Financial Capital', 'Intellectual Capital', 'Community & Partners'],
        archetype: 'The Knowledge Investment Hub',
        theme: 'Where financial resources meet intellectual assets and community relationships',
        question: 'How does money flow into ideas that serve our community?',
        latitude: 'northPolar'
    },

    V2: {
        id: 'V2',
        faces: [1, 5, 6],
        domains: ['Financial Capital', 'Market Resonance', 'Community & Partners'],
        archetype: 'The Market Community Gateway',
        theme: 'Where capital meets market presence and partner ecosystem',
        question: 'Is our market strategy serving both finances and community?',
        latitude: 'northPolar'
    },

    V3: {
        id: 'V3',
        faces: [1, 8, 9],
        domains: ['Financial Capital', 'Core Operations', 'Regenerative Flow'],
        archetype: 'The Operational Sustainability Engine',
        theme: 'Where capital meets operations meets regeneration',
        question: 'Are our operations financially sustainable AND regenerative?',
        latitude: 'northPolar'
    },

    V4: {
        id: 'V4',
        faces: [2, 9, 10],
        domains: ['Intellectual Capital', 'Regenerative Flow', 'Foundational Values'],
        archetype: 'The Innovation Ethics Nexus',
        theme: 'Where ideas meet sustainability meets values',
        question: 'Does our innovation serve regeneration and align with values?',
        latitude: 'northPolar'
    },

    V5: {
        id: 'V5',
        faces: [2, 3, 10],
        domains: ['Intellectual Capital', 'Human Capital', 'Foundational Values'],
        archetype: 'The Purpose-Driven Knowledge Center',
        theme: 'Where knowledge meets people meets purpose',
        question: 'Is our knowledge creating meaningful work aligned with values?',
        latitude: 'northPolar'
    },

    // ═══════════════════════════════════════════════════════════════════════
    // EQUATORIAL VERTICES (V6-V15) - Operational & Relational Convergences
    // ═══════════════════════════════════════════════════════════════════════

    V6: {
        id: 'V6',
        faces: [2, 3, 6],
        domains: ['Intellectual Capital', 'Human Capital', 'Community & Partners'],
        archetype: 'The Collaborative Learning Hub',
        theme: 'Where knowledge meets team meets community',
        question: 'How do our people share knowledge with our community?',
        latitude: 'equatorial'
    },

    V7: {
        id: 'V7',
        faces: [3, 10, 11],
        domains: ['Human Capital', 'Foundational Values', 'Funding Pipeline'],
        archetype: 'The Values-Funding Alignment Point',
        theme: 'Where team meets values meets funding',
        question: 'Is our team attracting funding that aligns with our values?',
        latitude: 'equatorial'
    },

    V8: {
        id: 'V8',
        faces: [4, 5, 6],
        domains: ['Structural Capital', 'Market Resonance', 'Community & Partners'],
        archetype: 'The External Coherence Gateway',
        theme: 'Where structure meets market meets partners',
        question: 'Does our structure serve both market and community relationships?',
        latitude: 'equatorial'
    },

    V9: {
        id: 'V9',
        faces: [1, 5, 8],
        domains: ['Financial Capital', 'Market Resonance', 'Core Operations'],
        archetype: 'The Market Operations Engine',
        theme: 'Where capital meets market meets delivery',
        question: 'Is our market presence backed by solid operations and finances?',
        latitude: 'equatorial'
    },

    V10: {
        id: 'V10',
        faces: [4, 5, 7],
        domains: ['Structural Capital', 'Market Resonance', 'Brand & Reputation'],
        archetype: 'The Brand Structure Nexus',
        theme: 'Where structure meets market meets brand',
        question: 'Does our organizational structure support our brand promise?',
        latitude: 'equatorial'
    },

    V11: {
        id: 'V11',
        faces: [3, 4, 11],
        domains: ['Human Capital', 'Structural Capital', 'Funding Pipeline'],
        archetype: 'The Team Structure Investment Point',
        theme: 'Where people meet structure meets funding',
        question: 'Is our team structure attractive to investors?',
        latitude: 'equatorial'
    },

    V12: {
        id: 'V12',
        faces: [4, 7, 11],
        domains: ['Structural Capital', 'Brand & Reputation', 'Funding Pipeline'],
        archetype: 'The Governance Credibility Gateway',
        theme: 'Where structure meets brand meets funding',
        question: 'Does our governance structure build credibility with funders?',
        latitude: 'equatorial'
    },

    V13: {
        id: 'V13',
        faces: [5, 7, 8],
        domains: ['Market Resonance', 'Brand & Reputation', 'Core Operations'],
        archetype: 'The Market Presence Triangle',
        theme: 'Where market meets brand meets operations',
        question: 'Is our operational delivery matching our brand and market promise?',
        latitude: 'equatorial'
    },

    V14: {
        id: 'V14',
        faces: [7, 8, 12],
        domains: ['Brand & Reputation', 'Core Operations', 'Risk & Resilience'],
        archetype: 'The Operational Integrity Guardian',
        theme: 'Where brand meets operations meets risk',
        question: 'Does our operational excellence protect our reputation from risk?',
        latitude: 'equatorial'
    },

    V15: {
        id: 'V15',
        faces: [7, 11, 12],
        domains: ['Brand & Reputation', 'Funding Pipeline', 'Risk & Resilience'],
        archetype: 'The Investor Confidence Triangle',
        theme: 'Where brand meets funding meets risk',
        question: 'Does our brand and risk posture inspire investor confidence?',
        latitude: 'equatorial'
    },

    // ═══════════════════════════════════════════════════════════════════════
    // SOUTH POLAR VERTICES (V16-V20) - Protection & Resilience Convergences
    // ═══════════════════════════════════════════════════════════════════════

    V16: {
        id: 'V16',
        faces: [8, 9, 12],
        domains: ['Core Operations', 'Regenerative Flow', 'Risk & Resilience'],
        archetype: 'The Regenerative Resilience Engine',
        theme: 'Where operations meet regeneration meets protection',
        question: 'Are our operations both regenerative AND resilient?',
        latitude: 'southPolar'
    },

    V17: {
        id: 'V17',
        faces: [9, 10, 12],
        domains: ['Regenerative Flow', 'Foundational Values', 'Risk & Resilience'],
        archetype: 'The Values-Based Resilience Center',
        theme: 'Where regeneration meets values meets protection',
        question: 'Do our values create genuine resilience through regeneration?',
        latitude: 'southPolar'
    },

    V18: {
        id: 'V18',
        faces: [10, 11, 12],
        domains: ['Foundational Values', 'Funding Pipeline', 'Risk & Resilience'],
        archetype: 'The Ethical Funding Guardian',
        theme: 'Where values meet funding meets risk',
        question: 'Is our funding aligned with values while managing risk?',
        latitude: 'southPolar'
    },

    V19: {
        id: 'V19',
        faces: [3, 4, 6],
        domains: ['Human Capital', 'Structural Capital', 'Community & Partners'],
        archetype: 'The Execution Gateway',
        theme: 'Where people meet structure meets community',
        question: 'How well do people, process, and community dance together?',
        latitude: 'equatorial'  // Actually equatorial per CSV
    },

    V20: {
        id: 'V20',
        faces: [1, 2, 9],
        domains: ['Financial Capital', 'Intellectual Capital', 'Regenerative Flow'],
        archetype: 'The Regenerative Innovation Funder',
        theme: 'Where capital meets ideas meets regeneration',
        question: 'Are we investing in innovation that regenerates?',
        latitude: 'northPolar'  // Actually north polar per CSV
    }
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 4: VERTEX LATITUDE MODEL - Geographic Organization
// ════════════════════════════════════════════════════════════════════════════

/**
 * VERTEX_LATITUDE - Groups vertices by their position on the dodecahedron
 *
 * The north polar vertices cluster around Face 1 (Financial Capital).
 * The south polar vertices cluster around Face 12 (Risk & Resilience).
 * The equatorial belt handles operational and relational convergences.
 *
 * @constant {Object}
 */
const VERTEX_LATITUDE = {
    northPolar: {
        vertices: ['V1', 'V2', 'V3', 'V4', 'V5', 'V20'],
        centralFace: 1,
        centralDomain: 'Financial Capital',
        theme: 'Resource & Capital convergences',
        question: 'How does capital flow through these five gateways?'
    },

    equatorial: {
        vertices: ['V6', 'V7', 'V8', 'V9', 'V10', 'V11', 'V12', 'V13', 'V14', 'V15', 'V19'],
        theme: 'Operational & Relational convergences',
        question: 'Where does daily work converge and transform?'
    },

    southPolar: {
        vertices: ['V16', 'V17', 'V18'],
        centralFace: 12,
        centralDomain: 'Risk & Resilience',
        theme: 'Protection & Resilience convergences',
        question: 'How does resilience manifest across these guardians?'
    }
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 5: VERTEX FORMULAS - Calculation Definitions
// ════════════════════════════════════════════════════════════════════════════

/**
 * VERTEX_FORMULAS - Mathematical definitions for vertex metrics
 *
 * @constant {Object}
 */
const VERTEX_FORMULAS = {
    /**
     * V-Mean: The ambient energy at the vertex
     * Average of the three face energies
     */
    vMean: {
        name: 'V-Mean (Ambient Temperature)',
        formula: '(E1 + E2 + E3) / 3',
        description: 'Average Face Energy of the three domains meeting at this vertex',
        interpretation: 'High = energetic/important junction. Low = quiet corner.',
        note: 'High V-Mean is not good or bad, just high energy.'
    },

    /**
     * Vortex Strength (sigma): The spin intensity
     * Measures variance/dissonance between the three faces
     */
    vortexStrength: {
        name: 'Vortex Strength (sigma)',
        formula: 'avg(|E1-E2|, |E2-E3|, |E1-E3|)',
        description: 'Average difference in energy between the three meeting faces',
        interpretation: 'Low = harmonious resonance. High = turbulent whirlpool.',
        note: 'High sigma is ALWAYS a red flag - the "Bermuda Triangle" signature.'
    },

    /**
     * Vertex Coherence: Overall triadic health
     * Combines macro (face) and micro (KPI) level coherence
     */
    vertexCoherence: {
        name: 'Overall Vertex Coherence',
        formula: '(Normalized_Macro_Vortex + Normalized_Micro_Vortex) / 2',
        description: 'Combined coherence score from both face-level and KPI-level analysis',
        interpretation: '1.0 = perfect harmony. 0 = complete dissonance.'
    },

    /**
     * Coherence-to-Variance Ratio: Stability measure
     * Higher ratio = more stable vertex
     */
    coherenceVarianceRatio: {
        name: 'Coherence-to-Variance Ratio',
        formula: 'Coherence / Vortex_Strength',
        description: 'How much coherence per unit of variance',
        interpretation: 'Higher is better - more harmony per unit of energy difference.'
    }
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 6: VERTEX CHIRALITY - Spiral Direction
// ════════════════════════════════════════════════════════════════════════════

/**
 * VERTEX_CHIRALITY - The direction of the vortex spiral
 *
 * Vortices can spin clockwise (releasing), counterclockwise (building),
 * or be balanced. This affects how energy moves through the system.
 *
 * @constant {Object}
 */
const VERTEX_CHIRALITY = {
    clockwise: {
        id: 'clockwise',
        symbol: '↻',
        name: 'Clockwise (Releasing)',
        meaning: 'Energy flowing outward - letting go, completing, releasing',
        healthy: 'Conscious letting go of what no longer serves',
        shadow: 'Depletion, loss, hemorrhaging resources',
        question: 'What is being released? Is it conscious or depleting?'
    },

    counterclockwise: {
        id: 'counterclockwise',
        symbol: '↺',
        name: 'Counter-Clockwise (Building)',
        meaning: 'Energy flowing inward - accumulating, growing, building',
        healthy: 'Sustainable growth and resource building',
        shadow: 'Hoarding, stagnation, accumulation without purpose',
        question: 'What is being built? Is it sustainable or accumulating?'
    },

    balanced: {
        id: 'balanced',
        symbol: '⊙',
        name: 'Balanced',
        meaning: 'Energy in dynamic equilibrium - stable but not static',
        healthy: 'Productive stability with healthy exchange',
        shadow: 'Stagnation disguised as balance',
        question: 'What is being held? Is it productive stability or stagnation?'
    }
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 7: VERTEX CONSCIOUSNESS - Inquiries for Triadic Exploration
// ════════════════════════════════════════════════════════════════════════════

/**
 * VERTEX_CONSCIOUSNESS - Contemplative questions for vertex exploration
 *
 * @constant {Object}
 */
const VERTEX_CONSCIOUSNESS = {

    triadic: {
        recognition: 'Where do these three domains converge in our organization?',
        synergy: 'What emerges when these three dance together that none could create alone?',
        bottleneck: 'Which of the three is the outlier pulling the vortex down?',
        amplification: 'If we aligned all three, what would amplify?',
        interference: 'Are these three fighting or supporting each other?',
        emergence: 'What new capacity wants to be born at this convergence?'
    },

    vortex: {
        direction: 'Is this vortex spiraling up (synergy) or down (drain)?',
        intensity: 'Is this a gentle eddy or a powerful whirlpool?',
        stability: 'Is this convergence stable or volatile?',
        leverage: 'Small changes here would ripple how far?',
        attention: 'Is this vertex seeking attention? What would happen if we honored it?'
    },

    byClassification: {
        harmonyHub: {
            celebration: 'What makes this vertex thrive? Can we learn from it?',
            gratitude: 'Thank you for this coherence. What wants to be shared?',
            replication: 'Could this pattern be seeded elsewhere?'
        },
        bermudaTriangle: {
            compassion: 'What conflict is this triangle holding? What wants to be heard?',
            protection: 'What is this dysfunction protecting us from?',
            keystone: 'Which of the three faces is the keystone for change?'
        },
        leveragePoint: {
            opportunity: 'What would happen if these three domains started talking?',
            facilitation: 'Who could facilitate alignment between these faces?',
            ripple: 'If we invested here, where would the effects appear?'
        },
        dormant: {
            inquiry: 'Is this vertex intentionally quiet, or is something blocked?',
            awakening: 'What would activate this convergence?',
            wisdom: 'Perhaps this dormancy serves. What does it protect?'
        }
    },

    alchemical: {
        detection: 'Is this vertex a crucible - a place where transformation is occurring?',
        timing: "Don't rush the alchemical process. What is the right pace here?",
        emergence: 'What wants to be transmuted at this convergence?',
        witness: 'Can I witness this transformation without interfering?'
    }
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 8: FIBONACCI TIMING - Intervention Cadence
// ════════════════════════════════════════════════════════════════════════════

/**
 * FIBONACCI_TIMING - Check-in schedules based on vertex classification
 *
 * Uses Fibonacci sequence for natural rhythm: 1, 2, 3, 5, 8, 13 weeks
 *
 * @constant {Object}
 */
const FIBONACCI_TIMING = {
    bermudaTriangle: { weeks: 1, description: 'URGENT - check weekly' },
    leveragePoint: { weeks: 2, description: 'High opportunity - check bi-weekly' },
    dormant: { weeks: 3, description: 'Monitor - check every 3 weeks' },
    balanced: { weeks: 5, description: 'Stable - check monthly' },
    harmonyHub: { weeks: 8, description: 'Thriving - check quarterly' },
    exceptional: { weeks: 13, description: 'Exceptional - celebrate quarterly' }
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 9: VERTEX CONSTANT - Lambda
// ════════════════════════════════════════════════════════════════════════════

/**
 * VERTEX_CONSTANT - The lambda parameter for vertex contribution
 *
 * @constant {Object}
 */
const VERTEX_CONSTANT = {
    symbol: 'lambda',
    greekSymbol: 'λ',
    value: 0.206,
    derivation: 'phi^-1 / 3',
    meaning: 'Vertex Emergence - triadic synergy weight in coherence',
    usage: 'Vertices contribute lambda to overall coherence calculation',
    note: 'Divided by 3 because three faces converge at each vertex'
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 10: HELPER FUNCTIONS
// ════════════════════════════════════════════════════════════════════════════

/**
 * Get vertex by ID
 *
 * @param {string} vertexId - Vertex ID (e.g., 'V1', 'V20')
 * @returns {Object|null} Vertex definition
 */
function getVertexById(vertexId) {
    return VERTEX_TOPOLOGY[vertexId] || null;
}

/**
 * Get all vertices for a given face
 *
 * @param {number} faceNumber - Face number (1-12)
 * @returns {Array} Array of vertex objects containing this face
 */
function getVerticesForFace(faceNumber) {
    return Object.values(VERTEX_TOPOLOGY).filter(
        vertex => vertex.faces.includes(faceNumber)
    );
}

/**
 * Get vertices by latitude zone
 *
 * @param {string} latitude - 'northPolar', 'equatorial', or 'southPolar'
 * @returns {Array} Array of vertex IDs in that zone
 */
function getVerticesByLatitude(latitude) {
    return VERTEX_LATITUDE[latitude]?.vertices || [];
}

/**
 * Classify a vertex based on strength and coherence
 *
 * @param {number} strength - Vortex strength (0-1)
 * @param {number} coherence - Vertex coherence (0-1)
 * @returns {Object} Classification object
 */
function classifyVertex(strength, coherence) {
    if (strength >= 0.7 && coherence >= 0.7) {
        return VERTEX_CLASSIFICATIONS.harmonyHub;
    }
    if (strength >= 0.7 && coherence < 0.5) {
        return VERTEX_CLASSIFICATIONS.bermudaTriangle;
    }
    if (strength >= 0.7 && coherence >= 0.5) {
        return VERTEX_CLASSIFICATIONS.leveragePoint;
    }
    return VERTEX_CLASSIFICATIONS.dormant;
}

/**
 * Get vertex that connects three specific faces
 *
 * @param {number} face1 - First face number
 * @param {number} face2 - Second face number
 * @param {number} face3 - Third face number
 * @returns {Object|null} Vertex definition or null
 */
function getVertexForFaces(face1, face2, face3) {
    const targetFaces = [face1, face2, face3].sort((a, b) => a - b);
    return Object.values(VERTEX_TOPOLOGY).find(vertex => {
        const sortedFaces = [...vertex.faces].sort((a, b) => a - b);
        return sortedFaces[0] === targetFaces[0] &&
               sortedFaces[1] === targetFaces[1] &&
               sortedFaces[2] === targetFaces[2];
    }) || null;
}

/**
 * Calculate vortex strength from three face energies
 *
 * @param {number} e1 - Face 1 energy
 * @param {number} e2 - Face 2 energy
 * @param {number} e3 - Face 3 energy
 * @returns {number} Vortex strength (sigma)
 */
function calculateVortexStrength(e1, e2, e3) {
    const diff1 = Math.abs(e1 - e2);
    const diff2 = Math.abs(e2 - e3);
    const diff3 = Math.abs(e1 - e3);
    return (diff1 + diff2 + diff3) / 3;
}

/**
 * Calculate V-Mean from three face energies
 *
 * @param {number} e1 - Face 1 energy
 * @param {number} e2 - Face 2 energy
 * @param {number} e3 - Face 3 energy
 * @returns {number} V-Mean (average energy)
 */
function calculateVMean(e1, e2, e3) {
    return (e1 + e2 + e3) / 3;
}

// ════════════════════════════════════════════════════════════════════════════
// SECTION 11: EXPORTS
// ════════════════════════════════════════════════════════════════════════════

// Browser global export
if (typeof window !== 'undefined') {
    window.VertexConstants = {
        // Classifications
        VERTEX_CLASSIFICATIONS,

        // The 20 Vertices
        VERTEX_TOPOLOGY,

        // Latitude Model
        VERTEX_LATITUDE,

        // Formulas
        VERTEX_FORMULAS,

        // Chirality (spiral direction)
        VERTEX_CHIRALITY,

        // Consciousness Inquiries
        VERTEX_CONSCIOUSNESS,

        // Fibonacci Timing
        FIBONACCI_TIMING,

        // Lambda constant
        VERTEX_CONSTANT,

        // Helper Functions
        getVertexById,
        getVerticesForFace,
        getVerticesByLatitude,
        classifyVertex,
        getVertexForFaces,
        calculateVortexStrength,
        calculateVMean
    };

    console.log('🔮 Vertex Constants loaded - 20 triadic convergence points defined');
    console.log('   Classifications: HarmonyHub | BermudaTriangle | LeveragePoint | Dormant');
}

// CommonJS export (for Node.js testing)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        VERTEX_CLASSIFICATIONS,
        VERTEX_TOPOLOGY,
        VERTEX_LATITUDE,
        VERTEX_FORMULAS,
        VERTEX_CHIRALITY,
        VERTEX_CONSCIOUSNESS,
        FIBONACCI_TIMING,
        VERTEX_CONSTANT,
        getVertexById,
        getVerticesForFace,
        getVerticesByLatitude,
        classifyVertex,
        getVertexForFaces,
        calculateVortexStrength,
        calculateVMean
    };
}
