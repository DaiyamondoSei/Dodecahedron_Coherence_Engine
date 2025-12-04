/**
 * Advanced Mathematical Analyzers - Main Export
 *
 * This file provides a unified interface to all advanced mathematical analysis modules.
 *
 * USAGE:
 * import { SpectralAnalyzer, EdgeAnalyzer, VertexAnalyzer, ShadowDetector } from './js/advanced/index.js';
 *
 * Or for browsers:
 * <script type="module" src="./js/advanced/index.js"></script>
 *
 * @author Deimantas Butrimas & Claude
 * @version 2.0
 */

import { SpectralAnalyzer } from './spectral-analyzer.js';
import { EdgeAnalyzer } from './edge-analyzer.js';
import { VertexAnalyzer } from './vertex-analyzer.js';
import { ShadowDetector } from './shadow-detector.js';

export { SpectralAnalyzer, EdgeAnalyzer, VertexAnalyzer, ShadowDetector };

/**
 * OrganizationalCoherenceEngine - Unified Interface
 *
 * This class orchestrates all advanced analyzers for comprehensive analysis
 */
export class OrganizationalCoherenceEngine {
  constructor(tuningConfig = null) {
    this.spectral = new SpectralAnalyzer();
    this.edges = new EdgeAnalyzer();
    this.vertices = new VertexAnalyzer();
    this.shadows = new ShadowDetector(tuningConfig);
  }

  /**
   * Perform complete comprehensive analysis
   *
   * @param {Array<Object>} faces - Array of 12 face objects with faceEnergy
   * @param {Array<Object>} kpis - Array of KPI objects (optional, for shadow detection)
   * @returns {Object} Complete analysis results
   */
  async analyzeComplete(faces, kpis = null) {
    // Extract face energies
    const faceEnergies = faces.map(f => f.faceEnergy);

    // Run all analyses
    const spectralAnalysis = this.spectral.analyze(faceEnergies);
    const edgeAnalysis = this.edges.calculateAllEdges(faces);
    const vertexAnalysis = this.vertices.calculateAllVertices(faces);
    const shadowAnalysis = this.shadows.analyze(faces, kpis);

    // Calculate cross-analysis insights
    const edgeStats = this.edges.getTensionStats(edgeAnalysis);
    const vertexStats = this.vertices.getVortexStats(vertexAnalysis);
    const leveragePoints = this.vertices.getLeveragePoints(vertexAnalysis);
    const criticalEdges = this.edges.getCriticalEdges(edgeAnalysis, 5);
    const criticalVertices = this.vertices.getCriticalVertices(vertexAnalysis, 5);

    return {
      // Core analyses
      spectral: spectralAnalysis,
      edges: edgeAnalysis,
      vertices: vertexAnalysis,
      shadows: shadowAnalysis,

      // Statistics
      edgeStats: edgeStats,
      vertexStats: vertexStats,

      // Critical points
      leveragePoints: leveragePoints,
      criticalEdges: criticalEdges,
      criticalVertices: criticalVertices,

      // Summary
      summary: {
        globalCoherence: this.calculateGlobalCoherence(spectralAnalysis, edgeStats, vertexStats, shadowAnalysis),
        dominantPattern: spectralAnalysis.summary.pattern,
        systemHealth: {
          spectralDissonance: spectralAnalysis.diagnostics.dissonanceIndex.percentage,
          edgeTension: edgeStats.average * 100,
          vortexDynamics: vertexStats.averageStrength * 100,
          ethicalIntegrity: shadowAnalysis.systemIntegrity.score * 100
        },
        topRecommendations: this.generateTopRecommendations(spectralAnalysis, leveragePoints, shadowAnalysis)
      }
    };
  }

  /**
   * Calculate global coherence metric
   * Combines all analysis dimensions into single score
   */
  calculateGlobalCoherence(spectral, edges, vertices, shadows) {
    // Invert dissonance to coherence
    const spectralCoherence = 1 - (spectral.diagnostics.dissonanceIndex.score);
    const edgeCoherence = edges.systemHealth;
    const vertexCoherence = 1 - vertices.averageStrength; // Lower strength = higher coherence (less turbulence)
    const ethicalCoherence = shadows.systemIntegrity.score;

    // Weighted average
    const globalCoherence = (
      spectralCoherence * 0.35 +  // Spectral patterns (highest weight)
      edgeCoherence * 0.25 +       // Edge tensions
      vertexCoherence * 0.20 +     // Vertex dynamics
      ethicalCoherence * 0.20      // Ethical integrity
    );

    return {
      score: globalCoherence,
      percentage: globalCoherence * 100,
      components: {
        spectral: spectralCoherence,
        edges: edgeCoherence,
        vertices: vertexCoherence,
        ethical: ethicalCoherence
      },
      interpretation: this.interpretCoherence(globalCoherence)
    };
  }

  /**
   * Interpret global coherence score
   */
  interpretCoherence(score) {
    if (score >= 0.8) return 'Excellent - System operating with high coherence';
    if (score >= 0.6) return 'Good - Minor imbalances present';
    if (score >= 0.4) return 'Concerning - Significant systemic issues';
    return 'Critical - Fundamental contradictions threaten sustainability';
  }

  /**
   * Generate top recommendations across all analyses
   */
  generateTopRecommendations(spectral, leveragePoints, shadows) {
    const recommendations = [];

    // Spectral recommendation (highest priority)
    if (spectral.correctiveActions.topPriority) {
      const action = spectral.correctiveActions.topPriority;
      recommendations.push({
        priority: 1,
        source: 'Spectral Analysis',
        message: `Face ${action.faceId} needs +${(action.deltaValue * 100).toFixed(1)}% energy boost (spectral leverage: ${spectral.correctiveActions.leverageRatio.toFixed(2)}x)`,
        type: 'strategic'
      });
    }

    // Leverage point recommendation
    if (leveragePoints.length > 0) {
      const topLeverage = leveragePoints[0];
      recommendations.push({
        priority: 2,
        source: 'Vortex Analysis',
        message: `High leverage at "${topLeverage.archetype}" - small changes will cascade through ${topLeverage.faceNames.join(', ')}`,
        type: 'tactical'
      });
    }

    // Shadow recommendation
    if (shadows.detectedPatterns.length > 0) {
      const mostSevere = shadows.detectedPatterns.reduce((most, curr) =>
        curr.severity === 'critical' ? curr : most
      );
      recommendations.push({
        priority: 3,
        source: 'Shadow Detection',
        message: `${mostSevere.icon} ${mostSevere.pattern}: ${mostSevere.story}`,
        type: 'ethical',
        recommendation: shadows.recommendations.find(r => r.pattern === mostSevere.pattern).recommendation
      });
    }

    return recommendations.sort((a, b) => a.priority - b.priority);
  }
}

// Export singleton for browser use
if (typeof window !== 'undefined') {
  window.OrganizationalCoherenceEngine = OrganizationalCoherenceEngine;
}
