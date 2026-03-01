/**
 * ========================================
 * MODULE: edge-analyzer.js
 * ========================================
 *
 * EdgeAnalyzer - Browser-Compatible Edition with CSV Integration
 *
 * Analyzes the 30 edges (connections) of the dodecahedron.
 * Each edge represents the relationship and flow between two organizational domains (Faces).
 *
 * Date: Documented December 16, 2025
 * @see {@link ../../docs/EDGE_DYNAMICS_REFERENCE.md} - Complete edge theory & philosophy
 *
 * CORE CONCEPTS:
 * - Edges carry TENSION (energy difference between faces)
 * - Edges have BREATH RATIO (flow direction)
 * - Edges have ELEMENTAL NATURE (Fire, Water, Earth, Air, Ether)
 *
 * DEPENDENCIES:
 * - window.PhiHarmonics (optional, has fallbacks)
 *
 * EXPORTS:
 * - EdgeAnalyzer: Main class (ES module + window)
 *
 * ========================================
 * NOTES FOR FUTURE CLAUDE
 * ========================================
 *
 * THE 30 EDGES:
 * - Dodecahedron has 30 edges (12 faces × 5 neighbors / 2)
 * - Each edge connects exactly 2 faces that share a physical edge
 * - The topology is FIXED - it comes from geometry, not configuration
 *
 * TENSION FORMULA (Normalized):
 * T = |E_A - E_B| / (E_A + E_B + ε)
 *
 * This is RELATIVE tension - a gap between two low-energy faces is
 * MORE severe than the same gap between high-energy faces.
 * Combined: 60% from energy difference, 40% from edge KPI health.
 *
 * BREATH RATIO (Logarithmic, Base-φ):
 * BR = log_φ(E_B / E_A)
 *
 * - BR = 0: Perfect balance (ratio = 1.0)
 * - BR = +1: Energy flows toward face2 (ratio = φ = 1.618)
 * - BR = -1: Energy flows toward face1 (ratio = 1/φ = 0.618)
 *
 * ELEMENTAL MULTIPLIERS:
 * - Fire (1.3): Amplifies tension - volatile, transformative
 * - Water (0.9): Dampens tension - smoothing, adaptive
 * - Earth (0.8): Stabilizes - grounding, structural
 * - Air (1.1): Accelerates flow - communication, speed
 * - Ether (1.0): Neutral - purpose-driven
 *
 * DATA SOURCES:
 * - Backend (Quannex.getState().edges): Authoritative if available
 * - UnifiedDataLoader: Provides edge definitions from CSV
 * - Fallback: Hardcoded this.edgeDefinitions
 *
 * GOTCHAS:
 * - Edge IDs are strings like "E1-2" (not numbers)
 * - faceEnergy can be undefined - always use || 0
 * - Element assignment comes from CSV or fallback (may vary)
 * - validateTopology() checks against geometric truth
 *
 * USED BY: js/advanced/index.js, js/dodec/dodec-data.js
 * RELATED: js/core/Edge.js (data structure)
 *
 * ========================================
 *
 * @module js/advanced/edge-analyzer
 * @author Deimantas Murauskas & Claude
 * @version 4.1 (with comprehensive documentation)
 *
 * USAGE:
 * const analyzer = new EdgeAnalyzer();
 * const edges = analyzer.calculateAllEdges(facesData, edgeDefinitions, edgeKPIs);
 * const tensionMap = analyzer.getTensionStats(edges);
 */

// φ-derived constants (from PhiHarmonics SSOT, with inline fallback)
// These define 5-state health boundaries for edge tension classification
const _PH = (typeof window !== 'undefined' && window.PhiHarmonics) || {};
const _PHI = _PH.PHI || (1 + Math.sqrt(5)) / 2;
const _PHI_4 = _PH.PHI_4 || Math.pow(_PHI, -4);        // φ⁻⁴ = 0.146
const _PHI_2 = _PH.PHI_2 || 1 / (_PHI * _PHI);         // φ⁻² = 0.382
const _PHI_1 = _PH.PHI_1 || 1 / _PHI;                  // φ⁻¹ = 0.618
const _PSI_4 = _PH.PSI_4 || 1 - _PHI_2 * _PHI_2;       // 1−φ⁻⁴ = 0.854

export class EdgeAnalyzer {
  constructor() {
    // STRESS_TEST_FIX [H1]: Import edge definitions from topology SSOT.
    // The previous hardcoded list had wrong element assignments (e.g., E1-2 was
    // 'Water', SSOT says 'Fire'). SSOT elements reflect the philosophical elemental
    // nature of each edge interface. Also gains archetype + question fields for
    // richer narrative generation (line ~596 uses edge.question).
    const topology = (typeof window !== 'undefined' && window.DodecahedronTopology)
      ? window.DodecahedronTopology.EDGES
      : null;

    if (topology) {
      this.edgeDefinitions = topology.map(e => ({
        id: e.id,
        face1: e.faces[0],
        face2: e.faces[1],
        element: e.element,
        archetype: e.archetype || '',
        question: e.question || ''
      }));
    } else {
      console.warn('EdgeAnalyzer: DodecahedronTopology not available, using corrected inline fallback');
      // Fallback: corrected edge definitions from SSOT (elements match topology source of truth)
      this.edgeDefinitions = [
        { id: 'E1-2', face1: 1, face2: 2, element: 'Fire' },
        { id: 'E1-6', face1: 1, face2: 6, element: 'Water' },
        { id: 'E1-7', face1: 1, face2: 7, element: 'Air' },
        { id: 'E1-8', face1: 1, face2: 8, element: 'Earth' },
        { id: 'E1-10', face1: 1, face2: 10, element: 'Ether' },
        { id: 'E2-3', face1: 2, face2: 3, element: 'Air' },
        { id: 'E2-6', face1: 2, face2: 6, element: 'Water' },
        { id: 'E2-10', face1: 2, face2: 10, element: 'Earth' },
        { id: 'E2-11', face1: 2, face2: 11, element: 'Ether' },
        { id: 'E3-4', face1: 3, face2: 4, element: 'Earth' },
        { id: 'E3-6', face1: 3, face2: 6, element: 'Water' },
        { id: 'E3-9', face1: 3, face2: 9, element: 'Ether' },
        { id: 'E3-11', face1: 3, face2: 11, element: 'Fire' },
        { id: 'E4-5', face1: 4, face2: 5, element: 'Air' },
        { id: 'E4-6', face1: 4, face2: 6, element: 'Earth' },
        { id: 'E4-7', face1: 4, face2: 7, element: 'Ether' },
        { id: 'E4-9', face1: 4, face2: 9, element: 'Fire' },
        { id: 'E5-7', face1: 5, face2: 7, element: 'Ether' },
        { id: 'E5-8', face1: 5, face2: 8, element: 'Fire' },
        { id: 'E5-9', face1: 5, face2: 9, element: 'Water' },
        { id: 'E5-12', face1: 5, face2: 12, element: 'Water' },
        { id: 'E6-7', face1: 6, face2: 7, element: 'Air' },
        { id: 'E7-8', face1: 7, face2: 8, element: 'Fire' },
        { id: 'E8-10', face1: 8, face2: 10, element: 'Water' },
        { id: 'E8-12', face1: 8, face2: 12, element: 'Air' },
        { id: 'E9-11', face1: 9, face2: 11, element: 'Earth' },
        { id: 'E9-12', face1: 9, face2: 12, element: 'Fire' },
        { id: 'E10-11', face1: 10, face2: 11, element: 'Air' },
        { id: 'E10-12', face1: 10, face2: 12, element: 'Fire' },
        { id: 'E11-12', face1: 11, face2: 12, element: 'Water' }
      ];
    }

    // Elemental multipliers (affect how tension manifests)
    this.elementalMultipliers = {
      'Fire': 1.3,    // Fire amplifies tension and flow
      'Water': 0.9,   // Water smooths and dampens
      'Earth': 0.8,   // Earth stabilizes and grounds
      'Air': 1.1,     // Air accelerates flow
      'Ether': 1.0    // Ether is neutral/balanced
    };
  }

  /**
   * Calculate tension for a single edge
   *
   * NORMALIZED FORMULA: T = |E_A - E_B| / (E_A + E_B + ε)
   *
   * This makes tension RELATIVE to total energy:
   * - Two low-energy faces with a gap → HIGH relative tension (stressed connection)
   * - Two high-energy faces with same gap → LOWER relative tension (abundant)
   *
   * Combined with:
   * 1. Normalized energy difference (60%)
   * 2. Edge KPI health if available (40%)
   * 3. Modulated by elemental nature
   *
   * @param {Object} face1 - First face object with faceEnergy property
   * @param {Object} face2 - Second face object with faceEnergy property
   * @param {string} element - Elemental nature of this edge
   * @param {Object} edgeKPI - Optional edge KPI (if it exists)
   * @returns {number} Tension value between 0 (harmonious) and 1 (highly tense)
   */
  // STRESS_TEST_FIX [C2]: ALTERNATIVE PERSPECTIVE — normalized relative tension.
  // This formula (T = |E_A - E_B| / (E_A + E_B + ε)) differs from the canonical
  // geometric mean formula in Edge.js. Both are valid but measure different things:
  //   - Edge.js (canonical): Membrane energy √(E_A × E_B) — "how STRONG is this boundary?"
  //   - This formula: Relative tension — "how PROPORTIONALLY imbalanced is the flow?"
  // The canonical formula is used for system coherence. This one provides analytical
  // depth for the advanced analysis views.
  // Both share φ-derived classification boundaries: φ⁻⁴ / φ⁻² / φ⁻¹ / ψ₄.
  calculateTension(face1, face2, element, edgeKPI = null) {
    const E_A = face1.faceEnergy || 0;
    const E_B = face2.faceEnergy || 0;

    // Use epsilon from PhiHarmonics SSOT (module-level _PH constant)
    const epsilon = _PH.EPSILON || 1e-10;

    // NORMALIZED tension formula: |E_A - E_B| / (E_A + E_B + epsilon)
    // Range: [0, 1) - approaches 1 as difference grows relative to sum
    const absoluteDiff = Math.abs(E_A - E_B);
    const totalEnergy = E_A + E_B + epsilon;
    const normalizedDiff = absoluteDiff / totalEnergy;

    // Edge KPI health (inverted - low health = high tension)
    const edgeHealth = edgeKPI && edgeKPI.normalizedScore !== undefined
      ? edgeKPI.normalizedScore
      : 0.5;
    const edgeTension = 1.0 - edgeHealth;

    // Combined tension: weighted average
    // 60% from normalized energy difference, 40% from edge KPI health
    const baseTension = (0.6 * normalizedDiff) + (0.4 * edgeTension);

    // Apply elemental multiplier
    const multiplier = this.elementalMultipliers[element] || 1.0;
    const modulatedTension = baseTension * multiplier;

    return Math.min(1.0, Math.max(0.0, modulatedTension));
  }

  /**
   * Calculate breath ratio (flow direction) across an edge
   *
   * LOGARITHMIC FORMULA: BR = log(E_B / E_A) / log(φ)
   *
   * Using log base φ (golden ratio) creates meaningful anchor points:
   * - BR = +1 when ratio = φ (1.618) - golden expansion
   * - BR = -1 when ratio = φ⁻¹ (0.618) - golden contraction
   * - BR = 0 when ratio = 1.0 - perfect balance
   *
   * This is SYMMETRIC: inverting the faces inverts the sign
   *
   * Positive = expansion (energy flows toward face2)
   * Negative = contraction (energy flows toward face1)
   *
   * @param {Object} face1
   * @param {Object} face2
   * @returns {number} Breath ratio (typically between -2 and +2)
   */
  calculateBreathRatio(face1, face2) {
    const E_A = face1.faceEnergy || 0;
    const E_B = face2.faceEnergy || 0;

    // PHI constants from module-level _PH (PhiHarmonics SSOT)
    const phi = _PHI;
    const epsilon = _PH.EPSILON || 1e-10;

    // Logarithmic breath ratio using golden base
    // log_φ(E_B / E_A) = ln(E_B / E_A) / ln(φ)
    const safeA = E_A + epsilon;
    const safeB = E_B + epsilon;
    const rawLogRatio = Math.log(safeB / safeA);
    const breathRatio = rawLogRatio / Math.log(phi);

    // Clamp to reasonable range (±2 allows for ratios up to φ²)
    return Math.max(-2.0, Math.min(2.0, breathRatio));
  }

  /**
   * Get flow direction category
   */
  getFlowDirection(breathRatio) {
    if (Math.abs(breathRatio) < 0.1) return 'balanced';
    return breathRatio > 0 ? 'expansion' : 'contraction';
  }

  /**
   * Get health status based on tension — φ-derived 5-state mapping
   * Boundaries: φ⁻⁴ (0.146) / φ⁻² (0.382) / φ⁻¹ (0.618) / ψ₄ (0.854)
   */
  getHealthStatus(tension) {
    if (tension <= _PHI_4) return 'Flowing';
    if (tension <= _PHI_2) return 'Stable';
    if (tension <= _PHI_1) return 'Stressed';
    if (tension <= _PSI_4) return 'Strained';
    return 'Breaking';
  }

  /**
   * Get color based on tension level (green → yellow → red)
   * Uses φ-derived boundaries: φ⁻² (0.382) and φ⁻¹ (0.618)
   */
  getTensionColor(tension) {
    if (tension <= _PHI_2) {
      // Green zone (low tension - good!)
      const t = tension / _PHI_2;
      return this.interpolateColor('#00ff00', '#66ff00', t);
    } else if (tension <= _PHI_1) {
      // Yellow zone (medium tension)
      const t = (tension - _PHI_2) / (_PHI_1 - _PHI_2);
      return this.interpolateColor('#66ff00', '#ffaa00', t);
    } else {
      // Red zone (high tension - bad!)
      const t = (tension - _PHI_1) / (1.0 - _PHI_1);
      return this.interpolateColor('#ffaa00', '#ff0000', t);
    }
  }

  /**
   * Interpolate between two hex colors
   */
  interpolateColor(color1, color2, t) {
    const r1 = parseInt(color1.slice(1, 3), 16);
    const g1 = parseInt(color1.slice(3, 5), 16);
    const b1 = parseInt(color1.slice(5, 7), 16);

    const r2 = parseInt(color2.slice(1, 3), 16);
    const g2 = parseInt(color2.slice(3, 5), 16);
    const b2 = parseInt(color2.slice(5, 7), 16);

    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  /**
   * Calculate all 30 edges for the dodecahedron
   * Merges injected edge data with live calculations
   *
   * @param {Array<Object>} faces - Array of 12 face objects
   * @param {Array<Object>} edgeDefinitions - Optional injected edge definitions (from UnifiedDataLoader)
   * @param {Map<string, Object>} edgeKPIs - Optional map of edge KPIs
   * @param {Array<Object>} backendEdges - Optional array of edges from Quannex.getState()
   * @returns {Array<Object>} Array of edge analyses with full metadata
   */
  calculateAllEdges(faces, edgeDefinitions = null, edgeKPIs = null, backendEdges = null) {
    const edgeAnalyses = [];

    // Use injected definitions or fallback to hardcoded defaults
    const definitions = edgeDefinitions || this.edgeDefinitions;

    // Create a map for faster lookup if backend edges are provided
    const backendMap = new Map();
    if (backendEdges) {
      backendEdges.forEach(e => backendMap.set(e.id, e));
    }

    // Create a map for injected definitions (if they are passed as array)
    const definitionMap = new Map();
    if (edgeDefinitions) {
      edgeDefinitions.forEach(def => definitionMap.set(def.id, def));
    }

    // Iterate over the canonical 30 edges (using this.edgeDefinitions as the master topology)
    // We use this.edgeDefinitions to ensure we iterate the correct geometric pairs,
    // but we look up metadata from the injected definitions.
    this.edgeDefinitions.forEach(canonicalDef => {
      const face1 = faces.find(f => f.id === canonicalDef.face1);
      const face2 = faces.find(f => f.id === canonicalDef.face2);

      if (!face1 || !face2) {
        console.warn(`Missing face data for edge ${canonicalDef.id}`);
        return;
      }

      // Look up enriched metadata from injected definitions
      const enrichedDef = definitionMap.get(canonicalDef.id);

      // Use enriched element if available, otherwise fallback
      const element = enrichedDef ? enrichedDef.element : canonicalDef.element;

      const edgeKPI = edgeKPIs ? edgeKPIs.get(canonicalDef.id) : null;

      // Check for backend data
      const backendEdge = backendMap.get(canonicalDef.id);

      let tension, breathRatio, flowDirection, healthStatus, color;

      if (backendEdge) {
        // Use backend physics (Single Source of Truth)
        tension = backendEdge.tension;
        breathRatio = backendEdge.breathRatio;
        flowDirection = backendEdge.flowDirection;
        // Re-derive presentation values from the authoritative physics
        healthStatus = this.getHealthStatus(tension);
        color = this.getTensionColor(tension);
      } else {
        // Fallback to local calculation
        tension = this.calculateTension(face1, face2, element, edgeKPI);
        breathRatio = this.calculateBreathRatio(face1, face2);
        flowDirection = this.getFlowDirection(breathRatio);
        healthStatus = this.getHealthStatus(tension);
        color = this.getTensionColor(tension);
      }

      // Build comprehensive edge object
      const edgeData = {
        // Core identification
        id: canonicalDef.id,
        face1Id: canonicalDef.face1,
        face2Id: canonicalDef.face2,
        face1Name: face1.name || `Face ${canonicalDef.face1}`,
        face2Name: face2.name || `Face ${canonicalDef.face2}`,

        // Calculated properties
        element: element,
        tension: tension,
        breathRatio: breathRatio,
        flowDirection: flowDirection,
        healthStatus: healthStatus,
        color: color,
        face1Energy: face1.faceEnergy,
        face2Energy: face2.faceEnergy,
        elementalMultiplier: this.elementalMultipliers[element],

        // Metadata (from injected definition)
        archetype: enrichedDef ? enrichedDef.archetype : null,
        kpiName: enrichedDef ? enrichedDef.kpiName : null,
        kpiCoherence: enrichedDef ? enrichedDef.kpiCoherence : 0.5,
        kpiMetric: enrichedDef ? enrichedDef.kpiMetric : null,
        kpiCalculation: enrichedDef ? enrichedDef.kpiCalculation : null,
        kpiValue: enrichedDef ? enrichedDef.kpiValue : 0,
        question: enrichedDef ? enrichedDef.question : null,

        // Flag source
        source: backendEdge ? 'backend' : 'frontend'
      };

      edgeAnalyses.push(edgeData);
    });

    return edgeAnalyses;
  }

  /**
   * Get tension statistics
   */
  getTensionStats(edges) {
    const tensions = edges.map(e => e.tension);
    const avgTension = tensions.reduce((sum, t) => sum + t, 0) / tensions.length;
    const maxTension = Math.max(...tensions);
    const minTension = Math.min(...tensions);

    const highTension = edges.filter(e => e.tension > _PHI_1).length;
    const mediumTension = edges.filter(e => e.tension > _PHI_2 && e.tension <= _PHI_1).length;
    const lowTension = edges.filter(e => e.tension <= _PHI_2).length;

    return {
      average: avgTension,
      max: maxTension,
      min: minTension,
      highCount: highTension,
      mediumCount: mediumTension,
      lowCount: lowTension,
      systemHealth: 1.0 - avgTension
    };
  }

  /**
   * Get the most critical edges (highest tension)
   */
  getCriticalEdges(edges, topN = 5) {
    return [...edges]
      .sort((a, b) => b.tension - a.tension)
      .slice(0, topN);
  }

  /**
   * Get breath flow patterns
   */
  getBreathFlowPatterns(edges) {
    const expanding = edges.filter(e => e.flowDirection === 'expansion').length;
    const contracting = edges.filter(e => e.flowDirection === 'contraction').length;
    const balanced = edges.filter(e => e.flowDirection === 'balanced').length;

    let dominantFlow;
    if (expanding > contracting + 5) {
      dominantFlow = 'System-wide expansion';
    } else if (contracting > expanding + 5) {
      dominantFlow = 'System-wide contraction';
    } else {
      dominantFlow = 'Mixed flow patterns';
    }

    return {
      expanding: expanding,
      contracting: contracting,
      balanced: balanced,
      total: edges.length,
      dominantFlow: dominantFlow
    };
  }

  /**
   * Get elemental analysis
   */
  getElementalAnalysis(edges) {
    const elements = ['Fire', 'Water', 'Earth', 'Air', 'Ether'];
    const analysis = {};

    elements.forEach(element => {
      const elementEdges = edges.filter(e => e.element === element);
      const avgTension = elementEdges.reduce((sum, e) => sum + e.tension, 0) / elementEdges.length;

      analysis[element] = {
        count: elementEdges.length,
        averageTension: avgTension,
        health: 1.0 - avgTension
      };
    });

    return analysis;
  }

  /**
   * Validate edge definitions against geometric topology
   * Uses the authoritative vertex-to-faces mapping to verify all edges exist
   *
   * @param {Object} topology - Vertex-to-faces mapping (vertex ID -> array of face IDs)
   * @returns {Object} Validation result with valid/invalid edges
   */
  validateTopology(topology) {
    const validEdges = [];
    const invalidEdges = [];

    this.edgeDefinitions.forEach(edge => {
      let sharedVertices = 0;

      // Check each vertex (1-20) to see if it connects both faces
      for (let vertexId = 1; vertexId <= 20; vertexId++) {
        const connectedFaces = topology[vertexId];
        if (!connectedFaces) continue;

        if (connectedFaces.includes(edge.face1) && connectedFaces.includes(edge.face2)) {
          sharedVertices++;
        }
      }

      // Two adjacent faces should share exactly 2 vertices
      if (sharedVertices === 2) {
        validEdges.push(edge.id);
      } else {
        invalidEdges.push({
          id: edge.id,
          face1: edge.face1,
          face2: edge.face2,
          sharedVertices: sharedVertices
        });
      }
    });

    return {
      valid: invalidEdges.length === 0,
      totalEdges: this.edgeDefinitions.length,
      validCount: validEdges.length,
      invalidCount: invalidEdges.length,
      validEdges: validEdges,
      invalidEdges: invalidEdges
    };
  }

  /**
   * Generate a dynamic narrative insight for an edge
   * This prepares the data for the AI pipeline or displays a rule-based insight
   * 
   * @param {Object} edge - The calculated edge object
   * @returns {Object} Narrative object { question, status, insight }
   */
  generateNarrative(edge) {
    // 1. The Base Question (from CSV or generic)
    let question = edge.question;
    if (!question) {
      question = `How does ${edge.face1Name} relate to ${edge.face2Name}?`;
    }

    // 2. The Flow Status (Physics)
    let flowDesc = "";
    const magnitude = Math.abs(edge.breathRatio);
    const direction = edge.breathRatio > 0 ? `→ (${edge.face2Name} is pulling)` : `← (${edge.face1Name} is pulling)`;

    if (magnitude < 0.1) flowDesc = "Stagnant / Balanced";
    else if (magnitude < _PHI_2) flowDesc = `Gentle Flow ${direction}`;
    else if (magnitude < _PHI_1) flowDesc = `Strong Current ${direction}`;
    else flowDesc = `Rushing Torrent ${direction}`;

    // 3. The Tension Status (Health)
    let tensionDesc = "";
    let insight = "";

    if (edge.tension < _PHI_2) {
      tensionDesc = "Harmonious";
      insight = `The relationship is healthy. Resources transform efficiently between these domains.`;
    } else if (edge.tension < _PHI_1) {
      tensionDesc = "Friction";
      insight = `There is resistance here. Energy is being lost during the transfer. Look for bureaucratic bottlenecks.`;
    } else {
      tensionDesc = "Blockage / Rupture";
      insight = `CRITICAL: The connection is breaking. The disparity is too high for the current structure to handle. Immediate intervention required to bridge the gap.`;
    }

    // 4. Elemental Nuance
    let elementalInsight = "";
    switch (edge.element) {
      case 'Fire': elementalInsight = "This is a volatile, high-energy link."; break;
      case 'Water': elementalInsight = "This connection requires emotional trust."; break;
      case 'Earth': elementalInsight = "This relies on solid structures and agreements."; break;
      case 'Air': elementalInsight = "Communication is the key constraint here."; break;
      case 'Ether': elementalInsight = "This is a purpose-driven alignment."; break;
    }

    return {
      archetype: edge.archetype || "Unnamed Axis",
      question: question,
      flow: flowDesc,
      tensionStatus: tensionDesc,
      fullNarrative: `${insight} ${elementalInsight}`,
      prompt: `Analyze the ${edge.tension.toFixed(2)} tension between ${edge.face1Name} and ${edge.face2Name}. Context: ${elementalInsight}`
    };
  }

  /**
   * Log topology validation results to console
   */
  logTopologyValidation(topology) {
    const result = this.validateTopology(topology);

    console.log('\n🔍 EDGE TOPOLOGY VALIDATION');
    console.log('='.repeat(60));
    console.log(`Total edges defined: ${result.totalEdges}`);
    console.log(`✅ Valid geometric edges: ${result.validCount}`);
    console.log(`❌ Invalid geometric edges: ${result.invalidCount}`);

    if (result.invalidEdges.length > 0) {
      console.warn('\n⚠️ INVALID EDGES (do not match dodecahedron topology):');
      result.invalidEdges.forEach(edge => {
        console.warn(`  ${edge.id}: Face ${edge.face1}-${edge.face2} (shares ${edge.sharedVertices} vertices, expected 2)`);
      });
    } else {
      console.log('\n✅ All edges are geometrically valid!');
    }

    console.log('='.repeat(60));
    return result;
  }
}

// Export for use in browser
if (typeof window !== 'undefined') {
  window.EdgeAnalyzer = EdgeAnalyzer;
}
