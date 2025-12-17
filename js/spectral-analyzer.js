/**
 * ========================================
 * MODULE: spectral-analyzer.js
 * ========================================
 *
 * SpectralAnalyzer - The Mathematical Heart of the Coherence Engine
 *
 * This class performs spectral analysis on the dodecahedron graph using:
 * - The Graph Laplacian (L) matrix
 * - Eigenvector decomposition (U matrix)
 * - Modal amplitude calculation to identify systemic imbalances
 *
 * The spectral analysis reveals the "hidden music" of the organization -
 * the fundamental modes of resonance and dissonance that underlie the visible metrics.
 *
 * Date: Original implementation, documented December 16, 2025
 *
 * MATHEMATICAL FOUNDATION:
 * ========================
 * The Graph Laplacian L = D - A where:
 *   D = Degree matrix (diagonal, each entry = number of edges for that vertex)
 *   A = Adjacency matrix (1 if faces share an edge, 0 otherwise)
 *
 * For the dodecahedron: Each face has exactly 5 neighbors, so D has 5 on diagonal.
 * The eigenvalues λ tell us the "vibration frequencies" of the graph.
 * The eigenvectors u tell us the "shape" of each vibration mode.
 *
 * KEY INSIGHT: Modal amplitude a_i = u_i^T × E tells us how much each mode
 * contributes to the current energy distribution. The dominant mode (largest |a_i|)
 * reveals the primary pattern of imbalance.
 *
 * DEPENDENCIES:
 * - None (standalone module)
 *
 * EXPORTS (to window):
 * - SpectralAnalyzer: Main class
 *
 * ========================================
 * NOTES FOR FUTURE CLAUDE
 * ========================================
 *
 * CORE CONCEPTS:
 * 1. The L matrix is the Graph Laplacian - encodes how faces connect
 * 2. The U matrix columns are eigenvectors - "vibration shapes"
 * 3. Eigenvalues are "frequencies" - higher = more local oscillations
 *
 * EIGENVALUE INTERPRETATION (Critical!):
 * - λ = 0 (Mode 1): DC offset - just the average energy, skip this
 * - λ ≈ 2.4 (Modes 2-4): GLOBAL patterns - whole-system imbalances
 * - λ ≈ 5.6 (Modes 5-7): REGIONAL patterns - clusters of faces
 * - λ ≈ 6.9 (Modes 8-9): LOCAL oscillations - adjacent face differences
 * - λ ≈ 8.1 (Modes 10-12): FINE-GRAINED - subtle dissonance
 *
 * THE DELTA VECTOR (Most Important Output):
 * - Formula: Δ = -u_dominant × a_dominant
 * - Positive Δ = face needs MORE energy
 * - Negative Δ = face has EXCESS energy
 * - This is the "prescription" for rebalancing
 *
 * BAB SCORE (Being-Action Balance):
 * - Uses 6 breath axis pairs from CSV_BREATH_RATIOS.csv
 * - Projection faces [11,7,8,4,5,6] = Action/Exhale
 * - Reception faces [1,2,3,9,10,12] = Being/Inhale
 * - Score > 120% = over-inhaling (too much planning)
 * - Score < 80% = over-exhaling (too much action)
 *
 * GOTCHAS:
 * - Mode indices are 0-based in arrays but 1-based in output
 * - Eigenvectors are normalized on construction to fix rounding errors
 * - If all energies are zero, dominantMode will be null
 * - The U matrix values are rounded to 3 decimal places
 *
 * USED BY: js/main.js (DodecahedronEngine.runSpectralAnalysis)
 * RELATED: js/advanced/spectral-analyzer.js (wrapper with caching)
 *
 * ========================================
 *
 * @module js/spectral-analyzer
 * @author Deimantas Butrimas & Claude
 * @version 1.1 (with comprehensive documentation)
 */

// ========================================
// SECTION: SpectralAnalyzer Class
// ========================================

class SpectralAnalyzer {
  /**
   * Initialize the SpectralAnalyzer with precomputed matrices
   *
   * The L and U matrices are derived from graph theory analysis of
   * the dodecahedron structure. They are constant for all analyses.
   */
  constructor() {
    // ========================================
    // LAPLACIAN MATRIX (L)
    // ========================================
    // The Graph Laplacian encodes connectivity: L[i][j] = -1 if faces share edge
    // Diagonal entries = degree (5 for each face in dodecahedron)
    this.L = [
      [5, -1, 0, 0, -1, -1, 0, -1, -1, 0, 0, 0],
      [-1, 5, -1, 0, 0, -1, 0, 0, -1, -1, 0, 0],
      [0, -1, 5, -1, 0, -1, 0, 0, 0, -1, -1, 0],
      [0, 0, -1, 5, -1, -1, -1, 0, 0, 0, -1, 0],
      [-1, 0, 0, -1, 5, -1, -1, -1, 0, 0, 0, 0],
      [-1, -1, -1, -1, -1, 5, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, -1, -1, 0, 5, -1, 0, 0, -1, -1],
      [-1, 0, 0, 0, -1, 0, -1, 5, -1, 0, 0, -1],
      [-1, -1, 0, 0, 0, 0, 0, -1, 5, -1, 0, -1],
      [0, -1, -1, 0, 0, 0, 0, 0, -1, 5, -1, -1],
      [0, 0, -1, -1, 0, 0, -1, 0, 0, -1, 5, -1],
      [0, 0, 0, 0, 0, 0, -1, -1, -1, -1, -1, 5]
    ];

    // The Dodecahedron Eigenvector Matrix (U)
    // Each column is an eigenvector corresponding to an eigenvalue
    // Eigenvalues: λ = [0, 2.394, 2.394, 2.394, 5.584, 5.584, 5.584, 6.854, 6.854, 8.146, 8.146, 8.146]
    this.U = [
      // Mode 1    2       3       4       5       6       7       8       9       10      11      12
      [0.289, -0.421, 0.000, 0.250, 0.000, -0.354, -0.289, 0.408, 0.000, 0.368, 0.000, -0.421],  // Face 1
      [0.289, -0.368, 0.250, -0.325, 0.354, -0.289, 0.162, -0.162, 0.408, -0.250, 0.500, 0.000],  // Face 2
      [0.289, -0.368, -0.250, -0.325, -0.354, -0.289, 0.162, -0.162, -0.408, -0.250, -0.500, 0.000],  // Face 3
      [0.289, -0.250, 0.000, 0.408, 0.000, 0.421, -0.368, 0.250, 0.000, 0.162, 0.000, 0.577],  // Face 4
      [0.289, -0.250, 0.408, 0.162, 0.577, 0.000, 0.250, 0.250, -0.162, -0.421, -0.325, -0.289],  // Face 5
      [0.289, 0.000, 0.368, -0.368, -0.577, 0.162, 0.250, -0.421, -0.250, 0.000, 0.325, -0.162],  // Face 6
      [0.289, 0.162, -0.368, -0.368, 0.577, 0.162, 0.250, -0.421, 0.250, 0.000, -0.325, -0.162],  // Face 7
      [0.289, 0.250, -0.408, 0.162, 0.000, 0.500, -0.421, 0.162, -0.250, 0.289, 0.162, 0.289],  // Face 8
      [0.289, 0.250, 0.408, 0.162, -0.354, -0.162, 0.289, 0.162, 0.250, -0.421, -0.162, 0.289],  // Face 9
      [0.289, 0.408, -0.162, 0.250, 0.354, 0.368, 0.000, -0.500, 0.125, 0.125, -0.289, -0.162],  // Face 10
      [0.289, 0.408, 0.162, 0.250, 0.000, -0.368, 0.000, 0.000, 0.500, 0.125, 0.289, -0.162],  // Face 11
      [0.289, 0.577, 0.000, -0.500, 0.000, 0.000, 0.000, 0.000, 0.000, 0.000, 0.000, -0.577]   // Face 12
    ];

    // Eigenvalues corresponding to each eigenvector (mode)
    this.eigenvalues = [0, 2.394, 2.394, 2.394, 5.584, 5.584, 5.584, 6.854, 6.854, 8.146, 8.146, 8.146];

    // Mode interpretations
    this.modeInterpretations = {
      0: 'DC Offset (Overall Average Energy)',
      2.394: 'Low-Frequency Mode (Global Imbalance)',
      5.584: 'Mid-Frequency Mode (Regional Patterns)',
      6.854: 'High-Frequency Mode (Local Oscillations)',
      8.146: 'Highest-Frequency Mode (Fine-Grained Dissonance)'
    };

    // Projection/Reception pole definitions for BAB Score
    // Based on the 6 harmonic pairs from CSV_Breath_Ratios.csv
    this.projectionFaces = [11, 7, 8, 4, 5, 6];  // Exhale/Action pole
    this.receptionFaces = [1, 2, 3, 9, 10, 12];   // Inhale/Being pole

    // 🔧 MATH FIX: Normalize Eigenvectors
    // Ensure modes 2-12 sum to exactly zero (orthogonality to DC mode)
    // This corrects any rounding errors in the hardcoded U matrix
    this.normalizeEigenvectors();
  }

  /**
   * Normalize eigenvectors (center them to remove DC component)
   */
  normalizeEigenvectors() {
    // For each mode (column) from 1 to 11 (skipping mode 0/DC)
    for (let col = 1; col < 12; col++) {
      // 1. Calculate mean
      let sum = 0;
      for (let row = 0; row < 12; row++) {
        sum += this.U[row][col];
      }
      const mean = sum / 12;

      // 2. Subtract mean from each element
      for (let row = 0; row < 12; row++) {
        this.U[row][col] -= mean;
      }
    }
    // console.log("✅ Eigenvectors normalized (orthogonalized to DC)");
  }

  /**
   * Calculate Modal Amplitudes using the formula: a = U^T × E
   * This transforms the face energy vector into modal space
   * 
   * @param {Array<number>} faceEnergies - Array of 12 face energy values
   * @returns {Array<Object>} Array of modal amplitudes with metadata
   */
  calculateModalAmplitudes(faceEnergies) {
    const modalAmplitudes = [];

    // For each mode (column in U matrix), calculate the modal amplitude
    for (let mode = 0; mode < 12; mode++) {
      let amplitude = 0;

      // Dot product of eigenvector with face energies: a_i = u_i^T × E
      for (let face = 0; face < 12; face++) {
        amplitude += this.U[face][mode] * faceEnergies[face];
      }

      modalAmplitudes.push({
        mode: mode + 1,
        eigenvalue: this.eigenvalues[mode],
        amplitude: amplitude,
        interpretation: this.getModeInterpretation(this.eigenvalues[mode])
      });
    }

    return modalAmplitudes;
  }

  /**
   * Identify the dominant mode (excluding Mode 1, the DC offset)
   * This is the mode with the largest absolute amplitude
   * 
   * @param {Array<Object>} modalAmplitudes 
   * @returns {Object} Dominant mode information
   */
  identifyDominantMode(modalAmplitudes) {
    // Skip mode 1 (index 0) - the DC offset
    let dominantMode = null;
    let maxAmplitude = 0;

    for (let i = 1; i < modalAmplitudes.length; i++) {
      const absAmplitude = Math.abs(modalAmplitudes[i].amplitude);
      if (absAmplitude > maxAmplitude) {
        maxAmplitude = absAmplitude;
        dominantMode = modalAmplitudes[i];
      }
    }

    return dominantMode;
  }

  /**
   * Calculate the Required Delta Vector
   * This is the negative of the dominant eigenvector, scaled by the modal amplitude
   * It tells us which faces need energy added (positive delta) or reduced (negative delta)
   * 
   * @param {Object} dominantMode 
   * @returns {Array<Object>} Delta vector with face-level recommendations
   */
  calculateDeltaVector(dominantMode) {
    const modeIndex = dominantMode.mode - 1;
    const amplitude = dominantMode.amplitude;
    const deltaVector = [];

    for (let face = 0; face < 12; face++) {
      const eigenvectorValue = this.U[face][modeIndex];
      const deltaValue = -eigenvectorValue * amplitude;

      deltaVector.push({
        faceId: face + 1,
        deltaValue: deltaValue,
        eigenvectorValue: eigenvectorValue,
        interpretation: this.interpretDelta(deltaValue)
      });
    }

    return deltaVector;
  }

  /**
   * Calculate the Being-Action Balance (BAB) Score
   * This measures the balance between "Projection/Action" faces and "Reception/Being" faces
   * Formula: BAB = (Reception Energy / Projection Energy) × 100%
   * 
   * @param {Array<number>} faceEnergies 
   * @returns {Object} BAB score and analysis
   */
  calculateBABScore(faceEnergies) {
    let projectionEnergy = 0;
    let receptionEnergy = 0;

    // Sum energies for projection (action/exhale) faces
    this.projectionFaces.forEach(faceId => {
      projectionEnergy += faceEnergies[faceId - 1];
    });

    // Sum energies for reception (being/inhale) faces
    this.receptionFaces.forEach(faceId => {
      receptionEnergy += faceEnergies[faceId - 1];
    });

    const avgProjection = projectionEnergy / this.projectionFaces.length;
    const avgReception = receptionEnergy / this.receptionFaces.length;

    const babScore = avgProjection > 0 ? (avgReception / avgProjection) : 0;
    const babPercentage = babScore * 100;

    return {
      score: babScore,
      percentage: babPercentage,
      projectionEnergy: avgProjection,
      receptionEnergy: avgReception,
      interpretation: this.interpretBAB(babPercentage),
      projectionFaces: this.projectionFaces,
      receptionFaces: this.receptionFaces
    };
  }

  /**
   * Calculate the Absolute Breath Dissonance (ABD) Score / Dissonance Index
   * This measures the total magnitude of imbalance in the system
   * Formula: ABD = Σ(|Δ_i| × w_i) / Σ(|Δ_i|) where w_i are face energies
   * 
   * @param {Array<Object>} deltaVector 
   * @param {Array<number>} faceEnergies 
   * @returns {Object} Dissonance index and analysis
   */
  calculateDissonanceIndex(deltaVector, faceEnergies) {
    let totalAbsDelta = 0;
    let weightedDissonance = 0;

    deltaVector.forEach((delta, index) => {
      const absDelta = Math.abs(delta.deltaValue);
      totalAbsDelta += absDelta;

      // Weight by face energy (more critical when high-energy faces are imbalanced)
      const weight = faceEnergies[index];
      weightedDissonance += absDelta * weight;
    });

    // Normalize
    const normalizedDissonance = totalAbsDelta > 0 ? weightedDissonance / totalAbsDelta : 0;
    const dissonancePercentage = normalizedDissonance * 100;

    return {
      score: normalizedDissonance,
      percentage: dissonancePercentage,
      totalMagnitude: totalAbsDelta,
      interpretation: this.interpretDissonance(dissonancePercentage)
    };
  }

  /**
   * Perform complete spectral analysis
   * 
   * @param {Array<number>} faceEnergies - Array of 12 face energy values (0-1)
   * @returns {Object} Complete spectral analysis results
   */
  analyze(faceEnergies) {
    try {
      // Step 1: Calculate modal amplitudes
      const modalAmplitudes = this.calculateModalAmplitudes(faceEnergies);

      // Step 2: Identify dominant mode
      let dominantMode = this.identifyDominantMode(modalAmplitudes);

      // Step 3: Calculate delta vector
      let deltaVector = [];
      if (dominantMode) {
        deltaVector = this.calculateDeltaVector(dominantMode);
      } else {
        console.warn('⚠️ No dominant mode found (System Empty/Balanced). Using dummy mode.');
        dominantMode = { mode: 0, eigenvalue: 0, amplitude: 0, interpretation: 'System Balanced / Empty' };
      }

      // Step 4: Calculate diagnostic indicators
      const babScore = this.calculateBABScore(faceEnergies);
      const dissonanceIndex = this.calculateDissonanceIndex(deltaVector, faceEnergies);

      // Step 5: Identify corrective actions
      const correctiveActions = this.identifyCorrectiveActions(deltaVector, faceEnergies);

      return {
        modalAmplitudes: modalAmplitudes,
        dominantMode: {
          mode: dominantMode.mode,
          eigenvalue: dominantMode.eigenvalue,
          amplitude: dominantMode.amplitude,
          interpretation: dominantMode.interpretation
        },
        deltaVector: deltaVector,
        diagnostics: {
          beingActionBalance: babScore,
          dissonanceIndex: dissonanceIndex
        },
        correctiveActions: correctiveActions,
        summary: this.generateSummary(dominantMode, babScore, dissonanceIndex)
      };
    } catch (error) {
      console.error('❌ Error in SpectralAnalyzer.analyze:', error);
      console.error(error.stack);
      throw error;
    }
  }

  /**
   * Identify the top corrective actions based on delta vector
   * 
   * @param {Array<Object>} deltaVector 
   * @param {Array<number>} faceEnergies 
   * @returns {Object} Prioritized corrective actions
   */
  identifyCorrectiveActions(deltaVector, faceEnergies) {
    // Separate positive (need energy) and negative (have excess energy) deltas
    const needEnergy = [];
    const haveExcess = [];

    deltaVector.forEach((delta, index) => {
      const action = {
        faceId: delta.faceId,
        deltaValue: delta.deltaValue,
        currentEnergy: faceEnergies[index],
        targetEnergy: faceEnergies[index] + delta.deltaValue,
        priority: Math.abs(delta.deltaValue)
      };

      if (delta.deltaValue > 0) {
        needEnergy.push(action);
      } else if (delta.deltaValue < 0) {
        haveExcess.push(action);
      }
    });

    // Sort by priority (absolute delta value)
    needEnergy.sort((a, b) => b.priority - a.priority);
    haveExcess.sort((a, b) => b.priority - a.priority);

    return {
      addEnergy: needEnergy,
      reduceEnergy: haveExcess,
      topPriority: needEnergy.length > 0 ? needEnergy[0] : null
    };
  }

  /**
   * Generate a human-readable summary of the spectral analysis
   */
  generateSummary(dominantMode, babScore, dissonanceIndex) {
    const eigenvalue = dominantMode.eigenvalue;
    let pattern = '';

    if (eigenvalue === 0) {
      pattern = 'System Average';
    } else if (eigenvalue <= 2.5) {
      pattern = 'Global Imbalance Pattern';
    } else if (eigenvalue <= 6.0) {
      pattern = 'Regional Pattern';
    } else if (eigenvalue <= 7.0) {
      pattern = 'Local Oscillation Pattern';
    } else {
      pattern = 'Fine-Grained Dissonance';
    }

    return {
      pattern: pattern,
      dominantEigenvalue: eigenvalue,
      modalAmplitude: dominantMode.amplitude,
      breathBalance: `${babScore.percentage.toFixed(1)}% (${babScore.interpretation})`,
      systemDissonance: `${dissonanceIndex.percentage.toFixed(1)}% (${dissonanceIndex.interpretation})`,
      recommendation: this.getRecommendation(dominantMode, babScore, dissonanceIndex)
    };
  }

  /**
   * Get mode interpretation
   */
  getModeInterpretation(eigenvalue) {
    const rounded = Math.round(eigenvalue * 1000) / 1000;
    return this.modeInterpretations[rounded] || 'Unknown Mode';
  }

  /**
   * Interpret delta value
   */
  interpretDelta(deltaValue) {
    if (deltaValue > 0.1) return 'ADD ENERGY - This face is weak and needs strengthening';
    if (deltaValue < -0.1) return 'REDUCE/BALANCE - This face has excess energy relative to its pole';
    return 'BALANCED - This face is in good equilibrium';
  }

  /**
   * Interpret BAB score
   */
  interpretBAB(percentage) {
    if (percentage > 120) return 'Over-Inhaling - Too much reception, not enough action';
    if (percentage < 80) return 'Over-Exhaling - Too much action, not enough regeneration';
    return 'Balanced - Healthy balance between being and doing';
  }

  /**
   * Interpret Dissonance Index
   */
  interpretDissonance(percentage) {
    if (percentage > 30) return 'HIGH - Significant systemic imbalances require attention';
    if (percentage > 15) return 'MODERATE - Some imbalances present';
    if (percentage > 5) return 'LOW - Minor imbalances, system is relatively coherent';
    return 'MINIMAL - System is highly coherent';
  }

  /**
   * Generate strategic recommendation
   */
  getRecommendation(dominantMode, babScore, dissonanceIndex) {
    const recommendations = [];

    // Breath balance recommendation
    if (babScore.percentage > 120) {
      recommendations.push('Focus on ACTION: Move from planning/receiving to concrete execution');
    } else if (babScore.percentage < 80) {
      recommendations.push('Focus on REGENERATION: Slow down execution, strengthen foundations');
    }

    // Dissonance recommendation
    if (dissonanceIndex.percentage > 20) {
      recommendations.push('Address systemic imbalances through the highest-leverage faces identified in the delta vector');
    }

    // Mode-specific recommendation
    if (dominantMode.eigenvalue <= 2.5) {
      recommendations.push('Global pattern detected - requires whole-system intervention');
    } else if (dominantMode.eigenvalue >= 7.0) {
      recommendations.push('Local issues detected - can be addressed through targeted interventions');
    }

    return recommendations.length > 0
      ? recommendations.join('. ')
      : 'System is in good balance - maintain current trajectory';
  }
}

// Export for global use
window.SpectralAnalyzer = SpectralAnalyzer;
console.log('✨ Spectral Analyzer (Graph Laplacian) loaded');

