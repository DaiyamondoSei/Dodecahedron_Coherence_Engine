/**
 * ========================================
 * MODULE: vertex-analyzer.js
 * ========================================
 *
 * VertexAnalyzer - Browser-Compatible Edition with Unified Data Integration
 *
 * Analyzes the 20 vertices (convergence points) of the dodecahedron.
 * Each vertex is where exactly 3 faces meet - a "Triple Convergence" of domains.
 *
 * Date: Documented December 16, 2025
 *
 * CORE CONCEPTS:
 * - Vertices are VORTEX POINTS where energy converges
 * - Can be generative (upward spiral) or degenerative (downward spiral)
 * - High-leverage points have high strength but low coherence
 *
 * DEPENDENCIES:
 * - None (standalone module)
 *
 * EXPORTS:
 * - VertexAnalyzer: Main class (ES module + window)
 *
 * ========================================
 * NOTES FOR FUTURE CLAUDE
 * ========================================
 *
 * THE 20 VERTICES:
 * - Dodecahedron has 20 vertices
 * - Each vertex touches exactly 3 faces
 * - Topology is FIXED from geometry
 *
 * VORTEX STRENGTH (0-1):
 * - Based on VARIANCE of the 3 face energies
 * - High variance = high strength (turbulent)
 * - Combined: 70% variance, 30% mean energy
 * - Max variance for 0-1 range is 0.25
 *
 * VORTEX DIRECTION (-1 to +1):
 * - Based on average energy vs 0.5 (balanced)
 * - Positive = upward spiral (generative, building)
 * - Negative = downward spiral (degenerative, releasing)
 * - Formula: (avgEnergy - 0.5) × 2
 *
 * CHIRALITY (Sprint 4 Task 35):
 * - Clockwise vs counterclockwise energy rotation
 * - Uses cross-product-like calculation
 * - Counterclockwise = building (energy spiraling in)
 * - Clockwise = releasing (energy spiraling out)
 *
 * COHERENCE (0-1):
 * - How aligned are the 3 faces?
 * - Based on average pairwise difference
 * - High coherence = faces have similar energy
 * - Low coherence = faces are very different
 *
 * LEVERAGE POINTS (Critical Concept!):
 * - High strength (>0.7) + Low coherence (<0.5)
 * - These are transformation opportunities
 * - Small interventions here cascade through system
 *
 * VORTEX TYPES:
 * - Dormant: strength < 0.3
 * - Rising/Powerful Ascent: direction > 0.3
 * - Declining/Critical Descent: direction < -0.3
 * - Turbulent: strong but no clear direction
 *
 * DATA SOURCES:
 * - Backend (Quannex.getState().vertices): Authoritative if available
 * - Fallback: Local calculation from face energies
 *
 * GOTCHAS:
 * - Vertex IDs are strings like "V1" in CSV but numbers in definitions
 * - The topology in vertexDefinitions has comments about corrections needed
 * - faceEnergies must be filtered to length === 3
 * - Backend vertex ID format may differ (check both V1 and 1)
 *
 * USED BY: js/advanced/index.js
 * RELATED: js/core/Vertex.js (data structure)
 *
 * ========================================
 *
 * @module js/advanced/vertex-analyzer
 * @author Deimantas Butrimas & Claude
 * @version 4.1 (with comprehensive documentation)
 *
 * USAGE:
 * const analyzer = new VertexAnalyzer();
 * const vertices = analyzer.calculateAllVertices(facesData, vertexDefinitions);
 * const leverage = analyzer.getLeveragePoints(vertices);
 */

export class VertexAnalyzer {
  constructor() {
    // Define the 20 vertices of a dodecahedron
    // Each vertex connects exactly 3 faces
    this.vertexDefinitions = [
      { id: 'V1', faceIds: [1, 2, 6] },
      { id: 'V2', faceIds: [1, 2, 7] }, // Correction: Check topology
      { id: 'V3', faceIds: [1, 6, 10] },
      { id: 'V4', faceIds: [1, 7, 8] },
      { id: 'V5', faceIds: [1, 8, 10] },

      { id: 'V6', faceIds: [2, 3, 6] },
      { id: 'V7', faceIds: [2, 3, 11] },
      { id: 'V8', faceIds: [2, 7, 11] }, // Correction: Check topology

      { id: 'V9', faceIds: [3, 4, 6] },
      { id: 'V10', faceIds: [3, 4, 9] },
      { id: 'V11', faceIds: [3, 9, 11] },

      { id: 'V12', faceIds: [4, 5, 7] }, // Wait, 4-5-7?
      { id: 'V13', faceIds: [4, 5, 9] },
      { id: 'V14', faceIds: [4, 6, 7] }, // 4-6-7?

      { id: 'V15', faceIds: [5, 7, 8] },
      { id: 'V16', faceIds: [5, 8, 12] },
      { id: 'V17', faceIds: [5, 9, 12] },

      { id: 'V18', faceIds: [8, 10, 12] },
      { id: 'V19', faceIds: [9, 11, 12] },
      { id: 'V20', faceIds: [10, 11, 12] } // 10-11-12?
    ];
  }

  /**
   * Calculate vortex strength (intensity of the convergence)
   * Based on energy variance and mean energy of the 3 faces
   */
  calculateVortexStrength(faces) {
    if (faces.length !== 3) return 0;

    const energies = faces.map(f => f.faceEnergy);
    const mean = energies.reduce((a, b) => a + b, 0) / 3;

    // Variance: sum((x - mean)^2) / N
    const variance = energies.reduce((sum, e) => sum + Math.pow(e - mean, 2), 0) / 3;

    // Normalize variance (max possible variance for 0-1 range is 0.25)
    const normalizedVariance = Math.min(variance / 0.1, 1.0);

    // Combined strength: 70% variance, 30% mean energy
    const strength = (0.7 * normalizedVariance) + (0.3 * mean);

    return Math.min(1.0, Math.max(0.0, strength));
  }

  /**
   * Calculate vortex direction (upward/downward spiral)
   *
   * Positive = upward spiral (generative)
   * Negative = downward spiral (degenerative)
   *
   * @param {Array<Object>} faces - The 3 faces meeting at this vertex
   * @returns {number} Direction between -1 (downward) and +1 (upward)
   */
  calculateVortexDirection(faces) {
    if (faces.length !== 3) return 0;

    // Average energy of the three faces
    const avgEnergy = faces.reduce((sum, f) => sum + f.faceEnergy, 0) / 3;

    // Direction is based on whether energy is above or below balanced (0.5)
    // and how far from balanced it is
    const direction = (avgEnergy - 0.5) * 2;

    return Math.max(-1.0, Math.min(1.0, direction));
  }

  /**
   * Sprint 4 Task 35: Calculate chirality (rotational direction)
   *
   * Clockwise = energy flows in ascending order around the vertex
   * Counterclockwise = energy flows in descending order
   *
   * Uses cross product of energy vectors to determine handedness.
   *
   * @param {Array<Object>} faces - The 3 faces meeting at this vertex
   * @returns {Object} { chirality: 'clockwise'|'counterclockwise'|'neutral', strength: 0-1 }
   */
  calculateChirality(faces) {
    if (faces.length !== 3) return { chirality: 'neutral', strength: 0 };

    const [f1, f2, f3] = faces.map(f => f.faceEnergy);

    // Calculate "winding" using determinant-like cross product
    // Positive = counterclockwise energy flow (building)
    // Negative = clockwise energy flow (releasing)
    const winding = (f2 - f1) * (f3 - f2) - (f3 - f1) * (f2 - f1) / 2;

    // Normalize to -1 to 1 range
    const normalizedWinding = Math.max(-1, Math.min(1, winding * 10));

    // Determine chirality
    if (Math.abs(normalizedWinding) < 0.1) {
      return { chirality: 'neutral', strength: 0, rawValue: normalizedWinding };
    } else if (normalizedWinding > 0) {
      return {
        chirality: 'counterclockwise',
        strength: Math.abs(normalizedWinding),
        rawValue: normalizedWinding,
        label: 'Building (↺)',
        description: 'Energy spirals inward, building potential'
      };
    } else {
      return {
        chirality: 'clockwise',
        strength: Math.abs(normalizedWinding),
        rawValue: normalizedWinding,
        label: 'Releasing (↻)',
        description: 'Energy spirals outward, expressing potential'
      };
    }
  }

  /**
   * Calculate coherence at this vertex
   *
   * High coherence = faces are well-balanced
   * Low coherence = faces are very different
   *
   * @param {Array<Object>} faces - The 3 faces meeting at this vertex
   * @returns {number} Coherence between 0 (chaotic) and 1 (coherent)
   */
  calculateCoherence(faces) {
    if (faces.length !== 3) return 0;

    const [f1, f2, f3] = faces.map(f => f.faceEnergy);

    // Calculate pairwise differences
    const diff12 = Math.abs(f1 - f2);
    const diff23 = Math.abs(f2 - f3);
    const diff31 = Math.abs(f3 - f1);

    // Average difference
    const avgDiff = (diff12 + diff23 + diff31) / 3;

    // Coherence is inverse of difference
    // Maximum possible average difference is ~0.667 (when one is 0, one is 1, one is 0.5)
    const coherence = 1.0 - (avgDiff / 0.667);

    return Math.max(0.0, Math.min(1.0, coherence));
  }

  /**
   * Get vortex type description
   */
  getVortexType(strength, direction) {
    if (strength < 0.3) return 'Dormant';

    if (direction > 0.3) {
      return strength > 0.7 ? 'Powerful Ascent' : 'Rising';
    } else if (direction < -0.3) {
      return strength > 0.7 ? 'Critical Descent' : 'Declining';
    } else {
      return 'Turbulent';
    }
  }

  /**
   * Get health status based on coherence
   */
  getHealthStatus(coherence) {
    if (coherence >= 0.8) return 'Harmonious';
    if (coherence >= 0.6) return 'Balanced';
    if (coherence >= 0.4) return 'Unstable';
    if (coherence >= 0.2) return 'Chaotic';
    return 'Critical';
  }

  /**
   * Get color based on vortex characteristics
   */
  getVortexColor(strength, direction, coherence) {
    // Determine base color from direction
    if (direction > 0.2) {
      // Upward spiral - green/cyan
      const t = Math.min(1.0, strength);
      return this.interpolateColor('#88ff88', '#00ffff', t);
    } else if (direction < -0.2) {
      // Downward spiral - red/orange
      const t = Math.min(1.0, strength);
      return this.interpolateColor('#ffaa00', '#ff0000', t);
    } else {
      // Neutral/turbulent - yellow/white based on coherence
      const t = coherence;
      return this.interpolateColor('#ffff00', '#ffffff', t);
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
   * Check if this is a high-leverage point
   * (high strength + low coherence = opportunity for transformation)
   */
  isLeveragePoint(strength, coherence) {
    return strength > 0.7 && coherence < 0.5;
  }

  /**
   * Calculate all 20 vertices for the dodecahedron
   *
   * @param {Array<Object>} faces - Array of 12 face objects
   * @param {Array<Object>} backendVertices - Optional array of vertices from Quannex.getState()
   * @returns {Array<Object>} Array of vertex analyses
   */
  calculateAllVertices(faces, backendVertices = null) {
    const vertexAnalyses = [];

    // Create a map for faster lookup if backend vertices are provided
    const backendMap = new Map();
    if (backendVertices) {
      backendVertices.forEach(v => backendMap.set(v.id, v));
    }

    this.vertexDefinitions.forEach(vertexDef => {
      // Get the 3 faces that meet at this vertex
      const convergingFaces = vertexDef.faceIds.map(faceId =>
        faces.find(f => f.id === faceId)
      ).filter(f => f !== undefined);

      if (convergingFaces.length !== 3) {
        console.warn(`Missing face data for vertex ${vertexDef.id}`);
        return;
      }

      // Check for backend data
      const backendVertex = backendMap.get(vertexDef.id); // Note: backend uses numeric ID for vertices? Let's check main.js
      // In main.js Vertex class: this.id = config.id || '';
      // In createVertices: id: row.Vertex_ID || row.id
      // The CSV uses "V1", "V2".
      // Let's assume backend ID matches the definition ID or we might need to handle "V" prefix.
      // Wait, vertexDef.id is number (1, 2, 3). Backend might be string "V1" or number 1.
      // Let's try both lookups just in case.
      const backendVertexV = backendMap.get(`V${vertexDef.id}`);
      const backendVertexNum = backendMap.get(vertexDef.id);
      const activeBackendVertex = backendVertexV || backendVertexNum;

      let strength, direction, coherence, vortexType, healthStatus, color, isLeverage;

      if (activeBackendVertex) {
        // Use backend physics
        strength = activeBackendVertex.energy; // Mapped from vortexEnergy
        direction = activeBackendVertex.vortexDirection;
        coherence = activeBackendVertex.coherence;
        isLeverage = activeBackendVertex.isLeveragePoint;

        // Re-derive presentation
        vortexType = this.getVortexType(strength, direction);
        healthStatus = this.getHealthStatus(coherence);
        color = this.getVortexColor(strength, direction, coherence);
      } else {
        // Fallback to local calculation
        strength = this.calculateVortexStrength(convergingFaces);
        direction = this.calculateVortexDirection(convergingFaces);
        coherence = this.calculateCoherence(convergingFaces);
        vortexType = this.getVortexType(strength, direction);
        healthStatus = this.getHealthStatus(coherence);
        color = this.getVortexColor(strength, direction, coherence);
        isLeverage = this.isLeveragePoint(strength, coherence);
      }

      // Merge CSV Data if available
      let csvInfo = null;
      // Map numeric ID (1) to CSV ID (V1)
      const csvId = `V${vertexDef.id}`;
      if (this.csvData && this.csvData[csvId]) {
        csvInfo = this.csvData[csvId];
      }

      // Sprint 4 Task 35: Calculate chirality
      const chirality = this.calculateChirality(convergingFaces);

      vertexAnalyses.push({
        id: vertexDef.id,
        csvId: csvId,
        archetype: csvInfo ? csvInfo.archetype : vertexDef.archetype,
        faceIds: vertexDef.faceIds,
        faceNames: convergingFaces.map(f => f.name || `Face ${f.id}`),
        faceEnergies: convergingFaces.map(f => f.faceEnergy),
        vortexStrength: strength,
        vortexDirection: direction,
        coherence: coherence,
        vortexType: vortexType,
        healthStatus: healthStatus,
        isLeveragePoint: isLeverage,
        color: color,
        // Sprint 4 Task 35: Chirality data
        chirality: chirality.chirality,
        chiralityStrength: chirality.strength,
        chiralityLabel: chirality.label || 'Neutral',
        chiralityDescription: chirality.description || 'Balanced energy flow',
        // Add narrative elements
        narrative: this.generateVertexNarrative(strength, direction, coherence, csvInfo ? csvInfo.archetype : vertexDef.archetype),
        // Flag source
        source: activeBackendVertex ? 'backend' : 'frontend'
      });
    });

    return vertexAnalyses;
  }

  /**
   * Generate narrative for the vertex
   */
  generateVertexNarrative(strength, direction, coherence, archetype) {
    let description = "";

    if (strength > 0.7) {
      description = "This is a high-intensity vortex. The forces here are spinning rapidly, creating significant transformation pressure.";
    } else if (strength < 0.3) {
      description = "This is a calm, stable junction. The energies are balanced and dormant.";
    } else {
      description = "Active circulation. There is healthy movement and exchange between these domains.";
    }

    let action = "";
    if (coherence < 0.4) {
      action = "High dissonance detected. Requires immediate alignment of the three converging domains.";
    } else if (coherence > 0.8) {
      action = "High resonance. A potential hub for scaling best practices.";
    } else {
      action = "Monitor for potential friction or synergy opportunities.";
    }

    return {
      description: description,
      action: action,
      spinLabel: strength > 0.5 ? (direction > 0 ? "Ascending Spiral" : "Descending Spiral") : "Neutral Flow"
    };
  }

  /**
   * Get leverage points (high impact, low coherence)
   */
  getLeveragePoints(vertices) {
    return vertices
      .filter(v => v.isLeveragePoint)
      .sort((a, b) => b.vortexStrength - a.vortexStrength);
  }

  /**
   * Get vortex statistics
   */
  getVortexStats(vertices) {
    const strengths = vertices.map(v => v.vortexStrength);
    const avgStrength = strengths.reduce((sum, s) => sum + s, 0) / strengths.length;

    const upward = vertices.filter(v => v.vortexDirection > 0.2).length;
    const downward = vertices.filter(v => v.vortexDirection < -0.2).length;
    const neutral = vertices.length - upward - downward;

    const leverageCount = vertices.filter(v => v.isLeveragePoint).length;

    let dominantDirection;
    if (upward > downward + 3) {
      dominantDirection = 'System-wide upward momentum';
    } else if (downward > upward + 3) {
      dominantDirection = 'System-wide downward pressure';
    } else {
      dominantDirection = 'Mixed vortex patterns';
    }

    return {
      averageStrength: avgStrength,
      upwardCount: upward,
      downwardCount: downward,
      neutralCount: neutral,
      leveragePointCount: leverageCount,
      dominantDirection: dominantDirection
    };
  }

  /**
   * Get critical vertices (strongest vortices)
   */
  getCriticalVertices(vertices, topN = 5) {
    return [...vertices]
      .sort((a, b) => b.vortexStrength - a.vortexStrength)
      .slice(0, topN);
  }

  /**
   * Get transformation recommendations
   */
  getTransformationRecommendations(vertices) {
    const leveragePoints = this.getLeveragePoints(vertices);
    const recommendations = [];

    leveragePoints.forEach(vertex => {
      const direction = vertex.vortexDirection > 0 ? 'upward' : 'downward';
      const momentum = vertex.vortexDirection > 0 ? 'positive' : 'negative';

      recommendations.push({
        vertexId: vertex.id,
        archetype: vertex.archetype,
        priority: vertex.vortexStrength,
        direction: direction,
        message: `High leverage at "${vertex.archetype}" (Vertex ${vertex.id}). ` +
          `Strong ${momentum} momentum with low coherence across ${vertex.faceNames.join(', ')}. ` +
          `Small interventions here will cascade through connected faces.`
      });
    });

    return recommendations.sort((a, b) => b.priority - a.priority);
  }
}

// Export for use in browser
if (typeof window !== 'undefined') {
  window.VertexAnalyzer = VertexAnalyzer;
}
