/**
 * Context Synthesizer
 *
 * Unifies Template & Custom flows to produce identical complete data structures.
 * This is the "Sacred Geometry Bridge" - generating edges and vertices from any input.
 *
 * INPUT: Either template mapping-context OR faceConfig + kpiData from Face Wizard
 * OUTPUT: Complete loadedMappingContext with faces, edges, vertices, breathAxes
 *
 * Mathematical Formulas (Validated Against CSV):
 * - Edge Tension: |face1.sentiment - face2.sentiment|
 * - Vortex Strength: (|E1-E2| + |E2-E3| + |E1-E3|) / 3
 *
 * Sacred Tech Enhancements:
 * - Elemental Harmony Matrix (phi-based modifiers)
 * - Fibonacci Thresholds for health classification
 * - Vortex direction (ascending/descending/neutral)
 *
 * ========================================
 * KNOWN DATA GAP: F10-Ether Coherence
 * ========================================
 *
 * The original CSV_Vortex_Map.csv contains "Not Found" for F10-Ether
 * in vertices V7 and V17. This was a gap in the manual MVP creation.
 *
 * Defensive handling: If coherence is NaN or "Not Found", default to 0.5
 * (neutral coherence) rather than breaking calculations.
 *
 * See /data/DATA_EVOLUTION_NOTES.md for full context on CSV evolution.
 * ========================================
 */

// ========================================
// CONSTANTS: Sacred Geometry & Elements
// ========================================

/**
 * PHI Constants - Single source: js/constants/phi-harmonics.js
 * Fallback values provided for standalone/Node.js use
 */
const _PH = (typeof window !== 'undefined' && window.PhiHarmonics) || {};
const PHI = _PH.PHI || 1.618033988749895;               // φ (Golden Ratio)
const PHI_1 = _PH.PHI_1 || 0.618033988749895;           // φ^-1
const PHI_2 = _PH.PHI_2 || 0.381966011250105;           // φ^-2
const PHI_3 = _PH.PHI_3 || 0.2360679774997896;          // φ^-3
const PHI_4 = _PH.PHI_4 || 0.1458980337503153;          // φ^-4
const SQRT_PHI = _PH.SQRT_PHI || 1.272019649514069;     // √φ
const SQRT_PHI_1 = _PH.SQRT_PHI_1 || 0.7861513777574233; // √(φ^-1)
const SQRT_2 = Math.SQRT2 || 1.4142135623730951;        // √2
const PHI_CUBE_ROOT = Math.pow(PHI, 1/3);               // φ^(1/3) ≈ 1.175

/**
 * Elemental colors for visualization
 */
const ELEMENT_COLORS = {
    'Fire': '#FF4500',
    'Water': '#4169E1',
    'Earth': '#8B4513',
    'Air': '#87CEEB',
    'Ether': '#9370DB'
};

/**
 * Elemental Harmony Matrix (Sacred Tech Architect recommendation)
 * All values derived from Golden Ratio (φ) and its transformations
 *
 * Key relationships:
 * - φ (1.618): Creative tension between opposites
 * - φ^-1 (0.618): Grounding/receptive energy
 * - √φ (1.272): Transcendent bridge
 * - √(φ^-1) (0.786): Nurturing stability
 * - √2 (1.414): Dynamic catalyst
 * - φ^(1/3) (1.175): Gentle flow
 */
const ELEMENTAL_HARMONY = {
    'Fire-Fire': 1.0,
    'Fire-Water': PHI,          // φ - creative tension (opposites)
    'Fire-Earth': PHI_1,        // φ^-1 - grounding transformation
    'Fire-Air': SQRT_2,         // √2 - dynamic catalyst
    'Fire-Ether': SQRT_PHI,     // √φ - transcendent bridge

    'Water-Fire': PHI,
    'Water-Water': 1.0,
    'Water-Earth': SQRT_PHI_1,  // √(φ^-1) - nurturing stability
    'Water-Air': PHI_CUBE_ROOT, // φ^(1/3) - gentle flow
    'Water-Ether': SQRT_PHI,

    'Earth-Fire': PHI_1,
    'Earth-Water': SQRT_PHI_1,
    'Earth-Earth': 1.0,
    'Earth-Air': SQRT_PHI_1,
    'Earth-Ether': 1.0,

    'Air-Fire': SQRT_2,
    'Air-Water': PHI_CUBE_ROOT,
    'Air-Earth': SQRT_PHI_1,
    'Air-Air': 1.0,
    'Air-Ether': SQRT_2,

    'Ether-Fire': SQRT_PHI,
    'Ether-Water': SQRT_PHI,
    'Ether-Earth': 1.0,
    'Ether-Air': SQRT_2,
    'Ether-Ether': 1.0
};

/**
 * PHI-derived thresholds for health classification
 * All values derived from Golden Ratio inverse powers
 */
const PHI_THRESHOLDS = {
    CRITICAL: PHI_4,    // φ^-4 ≈ 0.146 - severe misalignment (was ~0.21)
    WARNING: PHI_3,     // φ^-3 ≈ 0.236 - needs attention (was ~0.34)
    MODERATE: PHI_2,    // φ^-2 ≈ 0.382 - developing (was ~0.55)
    HEALTHY: PHI_1      // φ^-1 ≈ 0.618 - thriving (was ~0.89)
};

/**
 * Base edge definitions from CSV_Edge_tension_Map.csv
 * These define the dodecahedron's 30 edges with their elemental natures
 */
const BASE_EDGE_DEFINITIONS = [
    { id: 'E5-9', face1Id: 5, face2Id: 9, element: 'Water', archetype: 'Market Resonance ↔ Regenerative Flow', question: 'Is there a healthy flow of conversation between our market and community?' },
    { id: 'E5-8', face1Id: 5, face2Id: 8, element: 'Fire', archetype: 'Market Resonance ↔ Core Operations', question: 'Does our market feedback transform into operational improvements?' },
    { id: 'E5-7', face1Id: 5, face2Id: 7, element: 'Ether', archetype: 'Market Resonance ↔ Brand & Reputation', question: "Does our market resonance serve the highest purpose of our brand's truth?" },
    { id: 'E5-12', face1Id: 5, face2Id: 12, element: 'Water', archetype: 'Market Resonance ↔ Risk & Resilience', question: 'Is our brand a source of resilient, trust-based flow during a crisis?' },
    { id: 'E3-9', face1Id: 3, face2Id: 9, element: 'Ether', archetype: 'Human Capital ↔ Regenerative Flow', question: 'How does our humanity serve and express our highest values?' },
    { id: 'E8-10', face1Id: 8, face2Id: 10, element: 'Water', archetype: 'Core Operations ↔ Foundational Values', question: 'Is there a healthy flow of regenerative practice within our operations?' },
    { id: 'E4-9', face1Id: 4, face2Id: 9, element: 'Fire', archetype: 'Structural Capital ↔ Regenerative Flow', question: 'Can our structure transform to meet the needs of due diligence?' },
    { id: 'E1-10', face1Id: 1, face2Id: 10, element: 'Ether', archetype: 'Financial Capital ↔ Foundational Values', question: 'How does our capital serve the highest purpose of regeneration?' },
    { id: 'E1-2', face1Id: 1, face2Id: 2, element: 'Fire', archetype: 'Financial Capital ↔ Intellectual Capital', question: 'How does our capital transform into valuable knowledge?' },
    { id: 'E11-12', face1Id: 11, face2Id: 12, element: 'Water', archetype: 'Funding Pipeline ↔ Risk & Resilience', question: 'Does a healthy funding pipeline create a flow of resilience?' },
    { id: 'E3-6', face1Id: 3, face2Id: 6, element: 'Water', archetype: 'Human Capital ↔ Community & Partners', question: 'What is the emotional flow and quality of our human relationships?' },
    { id: 'E3-4', face1Id: 3, face2Id: 4, element: 'Earth', archetype: 'Human Capital ↔ Structural Capital', question: 'How is our human energy grounded and supported by our structures?' },
    { id: 'E7-8', face1Id: 7, face2Id: 8, element: 'Fire', archetype: 'Brand & Reputation ↔ Core Operations', question: 'Does our brand promise transform into operational excellence?' },
    { id: 'E2-10', face1Id: 2, face2Id: 10, element: 'Earth', archetype: 'Intellectual Capital ↔ Foundational Values', question: 'Is our knowledge grounded in and aligned with our core values?' },
    { id: 'E1-6', face1Id: 1, face2Id: 6, element: 'Water', archetype: 'Financial Capital ↔ Community & Partners', question: 'How does capital flow to and from our community in a healthy way?' },
    { id: 'E4-6', face1Id: 4, face2Id: 6, element: 'Earth', archetype: 'Structural Capital ↔ Community & Partners', question: 'Are our partnerships grounded in clear, stable, formal agreements?' },
    { id: 'E1-8', face1Id: 1, face2Id: 8, element: 'Earth', archetype: 'Financial Capital ↔ Core Operations', question: 'How is our capital grounded in real, tangible operational work?' },
    { id: 'E8-12', face1Id: 8, face2Id: 12, element: 'Air', archetype: 'Core Operations ↔ Risk & Resilience', question: 'Does operational clarity inform and reduce systemic risk?' },
    { id: 'E1-7', face1Id: 1, face2Id: 7, element: 'Air', archetype: 'Financial Capital ↔ Brand & Reputation', question: 'How do we communicate our financial value and story?' },
    { id: 'E4-7', face1Id: 4, face2Id: 7, element: 'Ether', archetype: 'Structural Capital ↔ Brand & Reputation', question: 'Does our structure embody the highest integrity of our brand?' },
    { id: 'E6-7', face1Id: 6, face2Id: 7, element: 'Air', archetype: 'Community & Partners ↔ Brand & Reputation', question: "Do we clearly communicate our brand's power to potential funders?" },
    { id: 'E3-11', face1Id: 3, face2Id: 11, element: 'Fire', archetype: 'Human Capital ↔ Funding Pipeline', question: 'How does our human passion transform into the energy that attracts resources?' },
    { id: 'E2-6', face1Id: 2, face2Id: 6, element: 'Water', archetype: 'Intellectual Capital ↔ Community & Partners', question: 'How does our knowledge flow to our community? (Teaching)' },
    { id: 'E10-12', face1Id: 10, face2Id: 12, element: 'Fire', archetype: 'Foundational Values ↔ Risk & Resilience', question: 'Do our values transform into resilience during a crisis?' },
    { id: 'E9-12', face1Id: 9, face2Id: 12, element: 'Fire', archetype: 'Regenerative Flow ↔ Risk & Resilience', question: 'Does our regenerative practice transform into greater systemic resilience?' },
    { id: 'E2-3', face1Id: 2, face2Id: 3, element: 'Air', archetype: 'Intellectual Capital ↔ Human Capital', question: "How do our people's minds connect to create shared knowledge?" },
    { id: 'E2-11', face1Id: 2, face2Id: 11, element: 'Ether', archetype: 'Intellectual Capital ↔ Funding Pipeline', question: 'Does our knowledge serve the highest purpose of regeneration?' },
    { id: 'E10-11', face1Id: 10, face2Id: 11, element: 'Air', archetype: 'Foundational Values ↔ Funding Pipeline', question: 'Do we clearly communicate our values to our capital partners?' },
    { id: 'E9-11', face1Id: 9, face2Id: 11, element: 'Earth', archetype: 'Regenerative Flow ↔ Funding Pipeline', question: 'Is our regenerative impulse grounded in our core values?' },
    { id: 'E4-5', face1Id: 4, face2Id: 5, element: 'Air', archetype: 'Structural Capital ↔ Market Resonance', question: 'Do our structures help or hinder the clarity of our public message?' }
];

/**
 * Base vertex definitions from CSV_Vortex_Map.csv
 * These define the dodecahedron's 20 vertices where 3 faces meet
 */
const BASE_VERTEX_DEFINITIONS = [
    { id: 'V1', faceIds: [1, 2, 6], name: 'Financial-Intellectual-Community Hub' },
    { id: 'V2', faceIds: [1, 5, 6], name: 'Financial-Market-Community Hub' },
    { id: 'V3', faceIds: [1, 8, 9], name: 'Financial-Operations-Regenerative Hub' },
    { id: 'V4', faceIds: [2, 9, 10], name: 'Intellectual-Regenerative-Values Hub' },
    { id: 'V5', faceIds: [2, 3, 10], name: 'Intellectual-Human-Values Hub' },
    { id: 'V6', faceIds: [3, 6, 2], name: 'Human-Community-Intellectual Hub' },
    { id: 'V7', faceIds: [3, 10, 11], name: 'Human-Values-Funding Hub' },
    { id: 'V8', faceIds: [4, 5, 6], name: 'Structural-Market-Community Hub' },
    { id: 'V9', faceIds: [1, 5, 8], name: 'Financial-Market-Operations Hub' },
    { id: 'V10', faceIds: [4, 5, 7], name: 'Structural-Market-Brand Hub' },
    { id: 'V11', faceIds: [3, 4, 11], name: 'Human-Structural-Funding Hub' },
    { id: 'V12', faceIds: [4, 7, 11], name: 'Structural-Brand-Funding Hub' },
    { id: 'V13', faceIds: [5, 7, 8], name: 'Market-Brand-Operations Hub' },
    { id: 'V14', faceIds: [7, 8, 12], name: 'Brand-Operations-Risk Hub' },
    { id: 'V15', faceIds: [7, 11, 12], name: 'Brand-Funding-Risk Hub' },
    { id: 'V16', faceIds: [8, 9, 12], name: 'Operations-Regenerative-Risk Hub' },
    { id: 'V17', faceIds: [9, 10, 12], name: 'Regenerative-Values-Risk Hub' },
    { id: 'V18', faceIds: [10, 11, 12], name: 'Values-Funding-Risk Hub' },
    { id: 'V19', faceIds: [3, 4, 6], name: 'Human-Structural-Community Hub' },
    { id: 'V20', faceIds: [1, 9, 2], name: 'Financial-Regenerative-Intellectual Hub' }
];

/**
 * Breath axis definitions (6 opposing face pairs)
 */
const BREATH_AXIS_DEFINITIONS = [
    { axis: 1, face1Id: 1, face2Id: 9, name: 'Resource Flow Breath', description: 'Financial Capital ↔ Regenerative Flow' },
    { axis: 2, face1Id: 2, face2Id: 10, name: 'Knowledge-Values Breath', description: 'Intellectual Capital ↔ Foundational Values' },
    { axis: 3, face1Id: 3, face2Id: 11, name: 'People-Pipeline Breath', description: 'Human Capital ↔ Funding Pipeline' },
    { axis: 4, face1Id: 4, face2Id: 12, name: 'Structure-Resilience Breath', description: 'Structural Capital ↔ Risk & Resilience' },
    { axis: 5, face1Id: 5, face2Id: 7, name: 'Market-Brand Breath', description: 'Market Resonance ↔ Brand & Reputation' },
    { axis: 6, face1Id: 6, face2Id: 8, name: 'Community-Operations Breath', description: 'Community & Partners ↔ Core Operations' }
];

// ========================================
// CORE SYNTHESIS FUNCTIONS
// ========================================

/**
 * Calculate edge tension using the formula: |face1.sentiment - face2.sentiment|
 * Optionally applies elemental harmony modifier
 *
 * @param {number} sentiment1 - Face 1 sentiment (0-1)
 * @param {number} sentiment2 - Face 2 sentiment (0-1)
 * @param {string} element1 - Face 1 elemental nature (optional)
 * @param {string} element2 - Face 2 elemental nature (optional)
 * @param {boolean} useHarmonyMatrix - Whether to apply elemental harmony modifiers
 * @returns {number} Tension value
 */
function calculateEdgeTension(sentiment1, sentiment2, element1 = null, element2 = null, useHarmonyMatrix = false) {
    const baseTension = Math.abs(sentiment1 - sentiment2);

    if (useHarmonyMatrix && element1 && element2) {
        const harmonyKey = `${element1}-${element2}`;
        const modifier = ELEMENTAL_HARMONY[harmonyKey] || 1.0;
        return baseTension * modifier;
    }

    return baseTension;
}

/**
 * Safely parse a numeric value with fallback for "Not Found" or invalid values.
 *
 * This handles the known gap in CSV_Vortex_Map.csv where F10-Ether shows "Not Found"
 * instead of a numeric value. See DATA_EVOLUTION_NOTES.md for context.
 *
 * @param {any} value - Value to parse (could be number, string, or undefined)
 * @param {number} defaultValue - Fallback value (default: 0.5 for neutral coherence)
 * @param {string} context - Description for logging purposes
 * @returns {number} Parsed numeric value or default
 */
function safeParseNumeric(value, defaultValue = 0.5, context = '') {
    // Handle "Not Found" string from CSV
    if (value === 'Not Found' || value === 'not found' || value === 'N/A') {
        console.warn(`⚠️ Missing data${context ? ` (${context})` : ''}: using default ${defaultValue}`);
        return defaultValue;
    }

    const parsed = parseFloat(value);
    if (isNaN(parsed)) {
        console.warn(`⚠️ Invalid numeric value${context ? ` (${context})` : ''}: "${value}" → using default ${defaultValue}`);
        return defaultValue;
    }

    return parsed;
}

/**
 * Calculate vortex strength using the formula: (|E1-E2| + |E2-E3| + |E1-E3|) / 3
 *
 * Includes defensive handling for missing or invalid energy values.
 *
 * @param {number} e1 - Face 1 energy/sentiment
 * @param {number} e2 - Face 2 energy/sentiment
 * @param {number} e3 - Face 3 energy/sentiment
 * @returns {number} Vortex strength (higher = more tension)
 */
function calculateVortexStrength(e1, e2, e3) {
    // Defensive: ensure all values are valid numbers
    const safe1 = safeParseNumeric(e1, 0.5, 'vortex face 1');
    const safe2 = safeParseNumeric(e2, 0.5, 'vortex face 2');
    const safe3 = safeParseNumeric(e3, 0.5, 'vortex face 3');

    return (
        Math.abs(safe1 - safe2) +
        Math.abs(safe2 - safe3) +
        Math.abs(safe1 - safe3)
    ) / 3;
}

/**
 * Classify vortex based on strength
 *
 * PHI-derived thresholds:
 * - Synergy: strength < φ^-4 (≈0.146) - minimal tension, harmonious
 * - Balanced: strength < φ^-3 (≈0.236) - healthy creative tension
 * - Conflict: strength >= φ^-3 - needs attention
 *
 * @param {number} strength - Vortex strength value
 * @returns {string} Classification: 'synergy' | 'balanced' | 'conflict'
 */
function classifyVortex(strength) {
    if (strength < PHI_4) return 'synergy';    // φ^-4 ≈ 0.146 - Harmonious hub
    if (strength < PHI_3) return 'balanced';   // φ^-3 ≈ 0.236 - Healthy tension
    return 'conflict';                          // Bermuda Triangle - needs attention
}

/**
 * Determine vortex direction based on average sentiment
 * (Sacred Tech Architect enhancement)
 *
 * PHI-derived thresholds:
 * - Ascending: avgSentiment > φ^-1 (0.618) - golden expansion
 * - Descending: avgSentiment < φ^-2 (0.382) - golden contraction
 * - Neutral: between these thresholds
 *
 * @param {number} e1 - Face 1 energy
 * @param {number} e2 - Face 2 energy
 * @param {number} e3 - Face 3 energy
 * @returns {string} Direction: 'ascending' | 'descending' | 'neutral'
 */
function determineVortexDirection(e1, e2, e3) {
    const avgSentiment = (e1 + e2 + e3) / 3;
    if (avgSentiment > PHI_1) return 'ascending';   // φ^-1 ≈ 0.618 threshold
    if (avgSentiment < PHI_2) return 'descending';  // φ^-2 ≈ 0.382 threshold
    return 'neutral';
}

/**
 * Classify health level using Fibonacci thresholds
 *
 * @param {number} value - Value to classify (0-1)
 * @returns {string} Health level: 'critical' | 'warning' | 'moderate' | 'healthy'
 */
function classifyHealth(value) {
    if (value < PHI_THRESHOLDS.CRITICAL) return 'critical';
    if (value < PHI_THRESHOLDS.WARNING) return 'warning';
    if (value < PHI_THRESHOLDS.MODERATE) return 'moderate';
    return 'healthy';
}

// ========================================
// MAIN SYNTHESIS FUNCTION
// ========================================

/**
 * Synthesize complete mapping context from custom face configuration
 * This is the main function called when the Face Wizard completes Step 2
 *
 * @param {Object} faceConfig - Face configuration from Face Wizard { faces: [...] }
 * @param {Object} kpiData - KPI data collected in Step 2 (optional)
 * @returns {Object} Complete mapping context with faces, edges, vertices, breathAxes
 */
function synthesizeCustomContext(faceConfig, kpiData = null) {
    console.log('🔮 Context Synthesizer: Generating complete mapping context...');

    if (!faceConfig || !faceConfig.faces || faceConfig.faces.length !== 12) {
        console.error('❌ Invalid face config: must have exactly 12 faces');
        return null;
    }

    // 1. Enhance faces with sentiment/energy if not present
    const enhancedFaces = faceConfig.faces.map(face => {
        // Calculate sentiment from KPIs if available, otherwise use existing or default
        let sentiment = face.sentiment || face.faceEnergy || face.energy || 0.5;

        if (kpiData && kpiData[face.id]) {
            // Average the KPI scores for this face
            const faceKpis = kpiData[face.id];
            if (Array.isArray(faceKpis) && faceKpis.length > 0) {
                sentiment = faceKpis.reduce((sum, kpi) => sum + (kpi.value || 0), 0) / faceKpis.length;
            }
        }

        return {
            ...face,
            sentiment: sentiment,
            faceEnergy: sentiment, // Ensure both properties exist
            energy: sentiment,
            health: classifyHealth(sentiment)
        };
    });

    console.log(`   📊 Enhanced ${enhancedFaces.length} faces with sentiment data`);

    // 2. Generate edges with calculated tensions
    const edges = BASE_EDGE_DEFINITIONS.map(edgeDef => {
        const face1 = enhancedFaces.find(f => f.id === edgeDef.face1Id);
        const face2 = enhancedFaces.find(f => f.id === edgeDef.face2Id);

        if (!face1 || !face2) {
            console.warn(`   ⚠️ Edge ${edgeDef.id}: Missing face ${edgeDef.face1Id} or ${edgeDef.face2Id}`);
            return null;
        }

        const tension = calculateEdgeTension(
            face1.sentiment,
            face2.sentiment,
            edgeDef.element,
            edgeDef.element, // Same element on both sides for edge's own element
            false // Don't use harmony matrix for now (can enable later)
        );

        // Calculate breath ratio (smaller/larger sentiment)
        const breathRatio = Math.min(face1.sentiment, face2.sentiment) /
                           Math.max(face1.sentiment, face2.sentiment) || 0;

        // Calculate coherence (inverse of tension, normalized)
        const coherence = Math.max(0, 1 - tension);

        return {
            id: edgeDef.id,
            faceIds: [face1.id, face2.id],
            face1Name: face1.name || face1.customName || `Face ${face1.id}`,
            face2Name: face2.name || face2.customName || `Face ${face2.id}`,
            face1Energy: face1.sentiment,
            face2Energy: face2.sentiment,
            tension: parseFloat(tension.toFixed(6)),
            breathRatio: parseFloat(breathRatio.toFixed(3)),
            coherence: parseFloat(coherence.toFixed(3)),
            elementalNature: edgeDef.element,
            color: ELEMENT_COLORS[edgeDef.element] || '#00ffcc',
            archetype: edgeDef.archetype,
            emergentName: edgeDef.archetype,
            theQuestion: edgeDef.question,
            health: classifyHealth(coherence)
        };
    }).filter(e => e !== null);

    console.log(`   🔗 Generated ${edges.length} edges with tensions`);

    // 3. Generate vertices with vortex strengths
    const vertices = BASE_VERTEX_DEFINITIONS.map(vertexDef => {
        const faces = vertexDef.faceIds.map(fid => enhancedFaces.find(f => f.id === fid));

        if (faces.some(f => !f)) {
            console.warn(`   ⚠️ Vertex ${vertexDef.id}: Missing face`);
            return null;
        }

        const [f1, f2, f3] = faces;
        const vortexStrength = calculateVortexStrength(f1.sentiment, f2.sentiment, f3.sentiment);
        const classification = classifyVortex(vortexStrength);
        const direction = determineVortexDirection(f1.sentiment, f2.sentiment, f3.sentiment);
        const avgEnergy = (f1.sentiment + f2.sentiment + f3.sentiment) / 3;

        return {
            id: vertexDef.id,
            faceIds: vertexDef.faceIds,
            faceNames: faces.map(f => f.name || f.customName || `Face ${f.id}`),
            vortexStrength: parseFloat(vortexStrength.toFixed(6)),
            classification: classification,
            direction: direction,
            avgEnergy: parseFloat(avgEnergy.toFixed(3)),
            name: vertexDef.name
        };
    }).filter(v => v !== null);

    console.log(`   🌀 Generated ${vertices.length} vertices with vortex data`);

    // 4. Generate breath axes
    const breathAxes = BREATH_AXIS_DEFINITIONS.map(axisDef => {
        const face1 = enhancedFaces.find(f => f.id === axisDef.face1Id);
        const face2 = enhancedFaces.find(f => f.id === axisDef.face2Id);

        if (!face1 || !face2) return null;

        const differential = face1.sentiment - face2.sentiment;
        const amplitude = Math.abs(differential);

        return {
            ...axisDef,
            face1Name: face1.name || face1.customName,
            face2Name: face2.name || face2.customName,
            face1Energy: face1.sentiment,
            face2Energy: face2.sentiment,
            differential: parseFloat(differential.toFixed(3)),
            amplitude: parseFloat(amplitude.toFixed(3)),
            phase: differential > 0 ? 'inhale' : 'exhale'
        };
    }).filter(a => a !== null);

    console.log(`   🌬️ Generated ${breathAxes.length} breath axes`);

    // 5. Calculate global coherence
    const avgTension = edges.reduce((sum, e) => sum + e.tension, 0) / edges.length;
    const globalCoherence = 1 - avgTension;

    // 6. Determine dominant octave (find the most common energy range)
    // PHI-derived thresholds for octave classification:
    // - O1 (Survival): avgEnergy < φ^-3 (≈0.236)
    // - O2 (Structure): avgEnergy < 0.5 (mathematical center)
    // - O3 (Relationships): avgEnergy < φ^-1 (≈0.618)
    // - O4+ (Creativity & beyond): avgEnergy >= φ^-1
    const avgEnergy = enhancedFaces.reduce((sum, f) => sum + f.sentiment, 0) / enhancedFaces.length;
    const dominantOctave = avgEnergy < PHI_3 ? 1 : avgEnergy < 0.5 ? 2 : avgEnergy < PHI_1 ? 3 : 4;

    const context = {
        faces: enhancedFaces,
        edges: edges,
        vertices: vertices,
        breathAxes: breathAxes,
        globalCoherence: parseFloat(globalCoherence.toFixed(3)),
        dominantOctave: dominantOctave,
        synthesizedAt: new Date().toISOString(),
        source: 'context-synthesizer'
    };

    console.log(`✅ Context Synthesizer: Complete!`);
    console.log(`   - Faces: ${context.faces.length}`);
    console.log(`   - Edges: ${context.edges.length}`);
    console.log(`   - Vertices: ${context.vertices.length}`);
    console.log(`   - Global Coherence: ${(context.globalCoherence * 100).toFixed(1)}%`);

    return context;
}

// ========================================
// EXPORTS
// ========================================

// Export to window for browser use
if (typeof window !== 'undefined') {
    window.ContextSynthesizer = {
        synthesizeCustomContext,
        calculateEdgeTension,
        calculateVortexStrength,
        classifyVortex,
        classifyHealth,
        determineVortexDirection,
        safeParseNumeric,  // Utility for handling "Not Found" and NaN values
        ELEMENT_COLORS,
        ELEMENTAL_HARMONY,
        PHI_THRESHOLDS,
        BASE_EDGE_DEFINITIONS,
        BASE_VERTEX_DEFINITIONS,
        BREATH_AXIS_DEFINITIONS
    };

    console.log('🔮 Context Synthesizer loaded and ready');
}

// CommonJS export (for Node.js environments)
// Note: When loaded via <script> tag, this file uses window.ContextSynthesizer
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        synthesizeCustomContext,
        calculateEdgeTension,
        calculateVortexStrength,
        classifyVortex,
        classifyHealth,
        determineVortexDirection,
        safeParseNumeric,
        ELEMENT_COLORS,
        ELEMENTAL_HARMONY,
        PHI_THRESHOLDS,
        BASE_EDGE_DEFINITIONS,
        BASE_VERTEX_DEFINITIONS,
        BREATH_AXIS_DEFINITIONS
    };
}
