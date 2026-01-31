/**
 * ========================================
 * DODECAHEDRON TOPOLOGY
 * ========================================
 *
 * SINGLE SOURCE OF TRUTH for all dodecahedron geometry.
 *
 * This module consolidates all topology definitions that were
 * previously scattered across multiple files:
 * - mapping-context.js
 * - face-to-breath-mapper.js
 * - context-synthesizer.js
 * - octave-reference-library.js
 *
 * ========================================
 * SACRED GEOMETRY FOUNDATION
 * ========================================
 *
 * The dodecahedron is one of the five Platonic solids.
 * Its 12 pentagonal faces represent 12 organizational domains.
 *
 * Euler's Formula: V - E + F = 2
 *   20 - 30 + 12 = 2 ✓
 *
 * Key properties:
 * - 12 Faces (pentagonal) - organizational domains
 * - 30 Edges - connections between domains
 * - 20 Vertices - convergence points (3 faces meet)
 * - 6 Breath Axes - opposing face pairs
 *
 * Each face has 5 edges (pentagram connection to 5 neighbors).
 * Each vertex is the meeting point of exactly 3 faces.
 *
 * ========================================
 * FIVE ELEMENTS
 * ========================================
 *
 * Each edge carries one of five elemental natures:
 * - Fire: Transformation, change, catalyst
 * - Water: Flow, emotion, nurturing
 * - Earth: Grounding, stability, form
 * - Air: Communication, clarity, thought
 * - Ether: Spirit, integration, transcendence
 *
 * ========================================
 */

(function () {
    'use strict';

    // ========================================
    // IMPORT PHI CONSTANTS
    // ========================================

    /**
     * Get PHI constants from phi-harmonics.js if available.
     * Falls back to inline calculation if not loaded.
     */
    const getPHI = () => {
        if (typeof window !== 'undefined' && window.PhiHarmonics) {
            return window.PhiHarmonics.PHI;
        }
        return (1 + Math.sqrt(5)) / 2;
    };

    const PHI = getPHI();

    // ========================================
    // CONSTANTS
    // ========================================

    /** Number of faces in a dodecahedron */
    const FACE_COUNT = 12;

    /** Number of edges in a dodecahedron */
    const EDGE_COUNT = 30;

    /** Number of vertices in a dodecahedron */
    const VERTEX_COUNT = 20;

    /** Number of breath axes (opposing face pairs) */
    const AXIS_COUNT = 6;

    /** Edges per face (pentagonal) */
    const EDGES_PER_FACE = 5;

    /** Faces per vertex */
    const FACES_PER_VERTEX = 3;

    // ========================================
    // ELEMENT DEFINITIONS
    // ========================================

    /**
     * The Five Elements with their properties
     */
    const ELEMENTS = {
        Fire: {
            name: 'Fire',
            color: '#FF4500',
            nature: 'Transformation',
            action: 'Transform',
            question: 'How does this transform?'
        },
        Water: {
            name: 'Water',
            color: '#4169E1',
            nature: 'Flow',
            action: 'Flow',
            question: 'How does this flow?'
        },
        Earth: {
            name: 'Earth',
            color: '#8B4513',
            nature: 'Grounding',
            action: 'Ground',
            question: 'How is this grounded?'
        },
        Air: {
            name: 'Air',
            color: '#87CEEB',
            nature: 'Communication',
            action: 'Communicate',
            question: 'How is this communicated?'
        },
        Ether: {
            name: 'Ether',
            color: '#9370DB',
            nature: 'Integration',
            action: 'Integrate',
            question: 'How does this serve the highest?'
        }
    };

    // ========================================
    // 12 FACES (Organizational Domains)
    // ========================================

    /**
     * The 12 faces of the organizational dodecahedron.
     * Each face represents a distinct organizational domain.
     */
    const FACES = {
        1: { id: 1, name: 'Financial Capital', icon: '💰', breathAxis: 1, role: 'reception', shortName: 'Financial' },
        2: { id: 2, name: 'Intellectual Capital', icon: '💡', breathAxis: 2, role: 'reception', shortName: 'Intellectual' },
        3: { id: 3, name: 'Human Capital', icon: '👥', breathAxis: 3, role: 'reception', shortName: 'Human' },
        4: { id: 4, name: 'Structural Capital', icon: '🏗️', breathAxis: 4, role: 'projection', shortName: 'Structural' },
        5: { id: 5, name: 'Market Resonance', icon: '📈', breathAxis: 5, role: 'projection', shortName: 'Market' },
        6: { id: 6, name: 'Community & Partners', icon: '🤝', breathAxis: 6, role: 'projection', shortName: 'Community' },
        7: { id: 7, name: 'Brand & Reputation', icon: '⭐', breathAxis: 2, role: 'projection', shortName: 'Brand' },
        8: { id: 8, name: 'Core Operations', icon: '⚙️', breathAxis: 3, role: 'projection', shortName: 'Operations' },
        9: { id: 9, name: 'Regenerative Flow', icon: '♻️', breathAxis: 4, role: 'reception', shortName: 'Regenerative' },
        10: { id: 10, name: 'Foundational Values', icon: '🎯', breathAxis: 5, role: 'reception', shortName: 'Values' },
        11: { id: 11, name: 'Funding Pipeline', icon: '💎', breathAxis: 1, role: 'projection', shortName: 'Pipeline' },
        12: { id: 12, name: 'Risk & Resilience', icon: '🛡️', breathAxis: 6, role: 'reception', shortName: 'Resilience' }
    };

    /**
     * Default face names as ordered array (for CSV/data compatibility)
     */
    const DEFAULT_FACE_NAMES = Object.values(FACES).map(f => ({
        id: f.id,
        name: f.name,
        icon: f.icon
    }));

    // ========================================
    // 6 BREATH AXES (Opposing Face Pairs)
    // ========================================

    /**
     * The 6 breath axes represent pairs of opposing faces.
     * Each axis has a projection face (outward) and reception face (inward).
     */
    const BREATH_AXES = [
        {
            id: 1,
            name: 'Resource Flow',
            description: 'The flow of resources into and through the organization',
            projection: 11,  // Funding Pipeline
            reception: 1,    // Financial Capital
            projectionName: 'Funding Pipeline',
            receptionName: 'Financial Capital',
            keywords: {
                projection: ['funding', 'investment', 'capital raise', 'financing', 'revenue', 'income', 'pipeline'],
                reception: ['financial', 'cash', 'capital', 'money', 'budget', 'treasury', 'resources']
            }
        },
        {
            id: 2,
            name: 'Substance & Story',
            description: 'The relationship between what we build and what we tell',
            projection: 7,   // Brand & Reputation
            reception: 2,    // Intellectual Capital
            projectionName: 'Brand & Reputation',
            receptionName: 'Intellectual Capital',
            keywords: {
                projection: ['brand', 'reputation', 'marketing', 'image', 'identity', 'communication', 'story'],
                reception: ['intellectual', 'knowledge', 'expertise', 'innovation', 'ip', 'research', 'learning']
            }
        },
        {
            id: 3,
            name: 'Being & Doing',
            description: 'The relationship between human energy and operational output',
            projection: 8,   // Core Operations
            reception: 3,    // Human Capital
            projectionName: 'Core Operations',
            receptionName: 'Human Capital',
            keywords: {
                projection: ['operations', 'processes', 'execution', 'delivery', 'production', 'work', 'activity'],
                reception: ['human', 'team', 'people', 'talent', 'culture', 'employees', 'skills', 'workforce']
            }
        },
        {
            id: 4,
            name: 'Form & Integrity',
            description: 'The relationship between governance structure and regenerative integrity',
            projection: 4,   // Structural Capital
            reception: 9,    // Regenerative Flow
            projectionName: 'Structural Capital',
            receptionName: 'Regenerative Flow',
            keywords: {
                projection: ['structure', 'systems', 'infrastructure', 'architecture', 'framework', 'organization'],
                reception: ['regenerative', 'sustainability', 'renewal', 'adaptability', 'resilience', 'evolution']
            }
        },
        {
            id: 5,
            name: 'Perception & Truth',
            description: 'The relationship between external perception and internal truth',
            projection: 5,   // Market Resonance
            reception: 10,   // Foundational Values
            projectionName: 'Market Resonance',
            receptionName: 'Foundational Values',
            keywords: {
                projection: ['market', 'customer', 'demand', 'perception', 'awareness', 'positioning', 'fit'],
                reception: ['values', 'mission', 'vision', 'purpose', 'ethics', 'principles', 'culture', 'foundation']
            }
        },
        {
            id: 6,
            name: 'Network & Fortress',
            description: 'The relationship between external network and internal resilience',
            projection: 6,   // Community & Partners
            reception: 12,   // Risk & Resilience
            projectionName: 'Community & Partners',
            receptionName: 'Risk & Resilience',
            keywords: {
                projection: ['community', 'partners', 'network', 'relationships', 'ecosystem', 'collaboration'],
                reception: ['risk', 'resilience', 'security', 'protection', 'safety', 'stability', 'defense']
            }
        }
    ];

    // ========================================
    // 30 EDGES (Face Connections)
    // ========================================

    /**
     * The 30 edges of the dodecahedron.
     * Each edge connects two adjacent faces with an elemental nature.
     */
    const EDGES = [
        { id: 'E1-2', faces: [1, 2], element: 'Fire', archetype: 'Financial Capital ↔ Intellectual Capital', question: 'How does our capital transform into valuable knowledge?' },
        { id: 'E1-6', faces: [1, 6], element: 'Water', archetype: 'Financial Capital ↔ Community & Partners', question: 'How does capital flow to and from our community in a healthy way?' },
        { id: 'E1-7', faces: [1, 7], element: 'Air', archetype: 'Financial Capital ↔ Brand & Reputation', question: 'How do we communicate our financial value and story?' },
        { id: 'E1-8', faces: [1, 8], element: 'Earth', archetype: 'Financial Capital ↔ Core Operations', question: 'How is our capital grounded in real, tangible operational work?' },
        { id: 'E1-10', faces: [1, 10], element: 'Ether', archetype: 'Financial Capital ↔ Foundational Values', question: 'How does our capital serve the highest purpose of regeneration?' },
        { id: 'E2-3', faces: [2, 3], element: 'Air', archetype: 'Intellectual Capital ↔ Human Capital', question: "How do our people's minds connect to create shared knowledge?" },
        { id: 'E2-6', faces: [2, 6], element: 'Water', archetype: 'Intellectual Capital ↔ Community & Partners', question: 'How does our knowledge flow to our community? (Teaching)' },
        { id: 'E2-10', faces: [2, 10], element: 'Earth', archetype: 'Intellectual Capital ↔ Foundational Values', question: 'Is our knowledge grounded in and aligned with our core values?' },
        { id: 'E2-11', faces: [2, 11], element: 'Ether', archetype: 'Intellectual Capital ↔ Funding Pipeline', question: 'Does our knowledge serve the highest purpose of regeneration?' },
        { id: 'E3-4', faces: [3, 4], element: 'Earth', archetype: 'Human Capital ↔ Structural Capital', question: 'How is our human energy grounded and supported by our structures?' },
        { id: 'E3-6', faces: [3, 6], element: 'Water', archetype: 'Human Capital ↔ Community & Partners', question: 'What is the emotional flow and quality of our human relationships?' },
        { id: 'E3-9', faces: [3, 9], element: 'Ether', archetype: 'Human Capital ↔ Regenerative Flow', question: 'How does our humanity serve and express our highest values?' },
        { id: 'E3-11', faces: [3, 11], element: 'Fire', archetype: 'Human Capital ↔ Funding Pipeline', question: 'How does our human passion transform into the energy that attracts resources?' },
        { id: 'E4-5', faces: [4, 5], element: 'Air', archetype: 'Structural Capital ↔ Market Resonance', question: 'Do our structures help or hinder the clarity of our public message?' },
        { id: 'E4-6', faces: [4, 6], element: 'Earth', archetype: 'Structural Capital ↔ Community & Partners', question: 'Are our partnerships grounded in clear, stable, formal agreements?' },
        { id: 'E4-7', faces: [4, 7], element: 'Ether', archetype: 'Structural Capital ↔ Brand & Reputation', question: 'Does our structure embody the highest integrity of our brand?' },
        { id: 'E4-9', faces: [4, 9], element: 'Fire', archetype: 'Structural Capital ↔ Regenerative Flow', question: 'Can our structure transform to meet the needs of due diligence?' },
        { id: 'E5-7', faces: [5, 7], element: 'Ether', archetype: 'Market Resonance ↔ Brand & Reputation', question: "Does our market resonance serve the highest purpose of our brand's truth?" },
        { id: 'E5-8', faces: [5, 8], element: 'Fire', archetype: 'Market Resonance ↔ Core Operations', question: 'Does our market feedback transform into operational improvements?' },
        { id: 'E5-9', faces: [5, 9], element: 'Water', archetype: 'Market Resonance ↔ Regenerative Flow', question: 'Is there a healthy flow of conversation between our market and community?' },
        { id: 'E5-12', faces: [5, 12], element: 'Water', archetype: 'Market Resonance ↔ Risk & Resilience', question: 'Is our brand a source of resilient, trust-based flow during a crisis?' },
        { id: 'E6-7', faces: [6, 7], element: 'Air', archetype: 'Community & Partners ↔ Brand & Reputation', question: "Do we clearly communicate our brand's power to potential funders?" },
        { id: 'E7-8', faces: [7, 8], element: 'Fire', archetype: 'Brand & Reputation ↔ Core Operations', question: 'Does our brand promise transform into operational excellence?' },
        { id: 'E8-10', faces: [8, 10], element: 'Water', archetype: 'Core Operations ↔ Foundational Values', question: 'Is there a healthy flow of regenerative practice within our operations?' },
        { id: 'E8-12', faces: [8, 12], element: 'Air', archetype: 'Core Operations ↔ Risk & Resilience', question: 'Does operational clarity inform and reduce systemic risk?' },
        { id: 'E9-11', faces: [9, 11], element: 'Earth', archetype: 'Regenerative Flow ↔ Funding Pipeline', question: 'Is our regenerative impulse grounded in our core values?' },
        { id: 'E9-12', faces: [9, 12], element: 'Fire', archetype: 'Regenerative Flow ↔ Risk & Resilience', question: 'Does our regenerative practice transform into greater systemic resilience?' },
        { id: 'E10-11', faces: [10, 11], element: 'Air', archetype: 'Foundational Values ↔ Funding Pipeline', question: 'Do we clearly communicate our values to our capital partners?' },
        { id: 'E10-12', faces: [10, 12], element: 'Fire', archetype: 'Foundational Values ↔ Risk & Resilience', question: 'Do our values transform into resilience during a crisis?' },
        { id: 'E11-12', faces: [11, 12], element: 'Water', archetype: 'Funding Pipeline ↔ Risk & Resilience', question: 'Does a healthy funding pipeline create a flow of resilience?' }
    ];

    // ========================================
    // 20 VERTICES (Face Convergence Points)
    // ========================================

    /**
     * The 20 vertices of the dodecahedron.
     * Each vertex is where exactly 3 faces meet, creating energy vortices.
     */
    const VERTICES = [
        { id: 'V1', faces: [1, 2, 6], name: 'Financial-Intellectual-Community Hub' },
        { id: 'V2', faces: [1, 5, 6], name: 'Financial-Market-Community Hub' },
        { id: 'V3', faces: [1, 8, 9], name: 'Financial-Operations-Regenerative Hub' },
        { id: 'V4', faces: [2, 9, 10], name: 'Intellectual-Regenerative-Values Hub' },
        { id: 'V5', faces: [2, 3, 10], name: 'Intellectual-Human-Values Hub' },
        { id: 'V6', faces: [3, 6, 2], name: 'Human-Community-Intellectual Hub' },
        { id: 'V7', faces: [3, 10, 11], name: 'Human-Values-Funding Hub' },
        { id: 'V8', faces: [4, 5, 6], name: 'Structural-Market-Community Hub' },
        { id: 'V9', faces: [1, 5, 8], name: 'Financial-Market-Operations Hub' },
        { id: 'V10', faces: [4, 5, 7], name: 'Structural-Market-Brand Hub' },
        { id: 'V11', faces: [3, 4, 11], name: 'Human-Structural-Funding Hub' },
        { id: 'V12', faces: [4, 7, 11], name: 'Structural-Brand-Funding Hub' },
        { id: 'V13', faces: [5, 7, 8], name: 'Market-Brand-Operations Hub' },
        { id: 'V14', faces: [7, 8, 12], name: 'Brand-Operations-Risk Hub' },
        { id: 'V15', faces: [7, 11, 12], name: 'Brand-Funding-Risk Hub' },
        { id: 'V16', faces: [8, 9, 12], name: 'Operations-Regenerative-Risk Hub' },
        { id: 'V17', faces: [9, 10, 12], name: 'Regenerative-Values-Risk Hub' },
        { id: 'V18', faces: [10, 11, 12], name: 'Values-Funding-Risk Hub' },
        { id: 'V19', faces: [3, 4, 6], name: 'Human-Structural-Community Hub' },
        { id: 'V20', faces: [1, 9, 2], name: 'Financial-Regenerative-Intellectual Hub' }
    ];

    // ========================================
    // ADJACENCY MATRICES
    // ========================================

    /**
     * Face adjacency - which faces neighbor each other.
     * Built from EDGES for fast lookup.
     */
    const FACE_ADJACENCY = {};
    EDGES.forEach(edge => {
        const [f1, f2] = edge.faces;
        if (!FACE_ADJACENCY[f1]) FACE_ADJACENCY[f1] = [];
        if (!FACE_ADJACENCY[f2]) FACE_ADJACENCY[f2] = [];
        FACE_ADJACENCY[f1].push(f2);
        FACE_ADJACENCY[f2].push(f1);
    });

    /**
     * Opposing faces - each face has one opposite face.
     * Built from BREATH_AXES.
     */
    const OPPOSING_FACES = {};
    BREATH_AXES.forEach(axis => {
        OPPOSING_FACES[axis.projection] = axis.reception;
        OPPOSING_FACES[axis.reception] = axis.projection;
    });

    // ========================================
    // VALIDATION FUNCTIONS
    // ========================================

    /**
     * Validate Euler's formula: V - E + F = 2
     * @returns {boolean} True if topology is valid
     */
    function validateEuler() {
        const v = VERTICES.length;
        const e = EDGES.length;
        const f = Object.keys(FACES).length;
        const euler = v - e + f;
        const valid = euler === 2;

        if (!valid) {
            Logger.error('Topology', `Euler validation failed: ${v} - ${e} + ${f} = ${euler} (should be 2)`);
        }

        return valid;
    }

    /**
     * Validate that each face has exactly 5 edges (pentagonal)
     * @returns {boolean} True if all faces are pentagons
     */
    function validatePentagons() {
        const faceEdgeCounts = {};

        EDGES.forEach(edge => {
            edge.faces.forEach(faceId => {
                faceEdgeCounts[faceId] = (faceEdgeCounts[faceId] || 0) + 1;
            });
        });

        for (const [faceId, count] of Object.entries(faceEdgeCounts)) {
            if (count !== EDGES_PER_FACE) {
                Logger.error('Topology', `Face ${faceId} has ${count} edges (should be ${EDGES_PER_FACE})`);
                return false;
            }
        }

        return true;
    }

    /**
     * Validate that each vertex has exactly 3 faces
     * @returns {boolean} True if all vertices have 3 faces
     */
    function validateVertices() {
        for (const vertex of VERTICES) {
            if (vertex.faces.length !== FACES_PER_VERTEX) {
                Logger.error('Topology', `Vertex ${vertex.id} has ${vertex.faces.length} faces (should be ${FACES_PER_VERTEX})`);
                return false;
            }
        }
        return true;
    }

    /**
     * Run all topology validations
     * @returns {Object} Validation results
     */
    function validateTopology() {
        const results = {
            euler: validateEuler(),
            pentagons: validatePentagons(),
            vertices: validateVertices(),
            counts: {
                faces: Object.keys(FACES).length === FACE_COUNT,
                edges: EDGES.length === EDGE_COUNT,
                vertices: VERTICES.length === VERTEX_COUNT,
                axes: BREATH_AXES.length === AXIS_COUNT
            }
        };

        results.valid = results.euler &&
            results.pentagons &&
            results.vertices &&
            Object.values(results.counts).every(v => v);

        return results;
    }

    // ========================================
    // HELPER FUNCTIONS
    // ========================================

    /**
     * Get face by ID
     * @param {number} id - Face ID (1-12)
     * @returns {Object|null} Face definition or null
     */
    function getFace(id) {
        return FACES[id] || null;
    }

    /**
     * Get edge by ID
     * @param {string} id - Edge ID (e.g., 'E1-2')
     * @returns {Object|null} Edge definition or null
     */
    function getEdge(id) {
        return EDGES.find(e => e.id === id) || null;
    }

    /**
     * Get edge between two faces
     * @param {number} face1Id - First face ID
     * @param {number} face2Id - Second face ID
     * @returns {Object|null} Edge or null if not adjacent
     */
    function getEdgeBetween(face1Id, face2Id) {
        return EDGES.find(e =>
            (e.faces[0] === face1Id && e.faces[1] === face2Id) ||
            (e.faces[0] === face2Id && e.faces[1] === face1Id)
        ) || null;
    }

    /**
     * Get vertex by ID
     * @param {string} id - Vertex ID (e.g., 'V1')
     * @returns {Object|null} Vertex definition or null
     */
    function getVertex(id) {
        return VERTICES.find(v => v.id === id) || null;
    }

    /**
     * Get breath axis by ID
     * @param {number} id - Axis ID (1-6)
     * @returns {Object|null} Breath axis or null
     */
    function getBreathAxis(id) {
        return BREATH_AXES.find(a => a.id === id) || null;
    }

    /**
     * Get breath axis for a face
     * @param {number} faceId - Face ID (1-12)
     * @returns {Object|null} Breath axis with face's role
     */
    function getBreathAxisForFace(faceId) {
        const face = FACES[faceId];
        if (!face) return null;

        const axis = BREATH_AXES.find(a => a.id === face.breathAxis);
        if (!axis) return null;

        return {
            ...axis,
            faceRole: face.role,
            opposingFace: face.role === 'projection' ? axis.reception : axis.projection
        };
    }

    /**
     * Get adjacent faces for a face
     * @param {number} faceId - Face ID
     * @returns {number[]} Array of adjacent face IDs
     */
    function getAdjacentFaces(faceId) {
        return FACE_ADJACENCY[faceId] || [];
    }

    /**
     * Get opposing face
     * @param {number} faceId - Face ID
     * @returns {number|null} Opposing face ID or null
     */
    function getOpposingFace(faceId) {
        return OPPOSING_FACES[faceId] || null;
    }

    /**
     * Get vertices for a face
     * @param {number} faceId - Face ID
     * @returns {Object[]} Array of vertices touching this face
     */
    function getVerticesForFace(faceId) {
        return VERTICES.filter(v => v.faces.includes(faceId));
    }

    /**
     * Get edges for a face
     * @param {number} faceId - Face ID
     * @returns {Object[]} Array of edges touching this face
     */
    function getEdgesForFace(faceId) {
        return EDGES.filter(e => e.faces.includes(faceId));
    }

    /**
     * Get element color
     * @param {string} element - Element name
     * @returns {string} Hex color code
     */
    function getElementColor(element) {
        return ELEMENTS[element]?.color || '#00ffcc';
    }

    // ========================================
    // EXPORTS
    // ========================================

    const DodecahedronTopology = {
        // Constants
        PHI,
        FACE_COUNT,
        EDGE_COUNT,
        VERTEX_COUNT,
        AXIS_COUNT,
        EDGES_PER_FACE,
        FACES_PER_VERTEX,

        // Core data structures
        ELEMENTS,
        FACES,
        EDGES,
        VERTICES,
        BREATH_AXES,
        DEFAULT_FACE_NAMES,

        // Adjacency lookups
        FACE_ADJACENCY,
        OPPOSING_FACES,

        // Validation
        validateEuler,
        validatePentagons,
        validateVertices,
        validateTopology,

        // Helper functions
        getFace,
        getEdge,
        getEdgeBetween,
        getVertex,
        getBreathAxis,
        getBreathAxisForFace,
        getAdjacentFaces,
        getOpposingFace,
        getVerticesForFace,
        getEdgesForFace,
        getElementColor
    };

    // Browser global export
    if (typeof window !== 'undefined') {
        window.DodecahedronTopology = DodecahedronTopology;

        // Run validation on load
        const validation = validateTopology();
        if (validation.valid) {
            Logger.info('Topology', 'Dodecahedron Topology loaded');
            Logger.debug('Topology', `Euler: V(${VERTEX_COUNT}) - E(${EDGE_COUNT}) + F(${FACE_COUNT}) = 2`);
            Logger.debug('Topology', `${AXIS_COUNT} breath axes, ${FACE_COUNT} faces, ${EDGE_COUNT} edges, ${VERTEX_COUNT} vertices`);
        } else {
            Logger.error('Topology', 'Dodecahedron Topology validation failed:', validation);
        }
    }

    // CommonJS export (for Node.js)
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = DodecahedronTopology;
    }

})();
