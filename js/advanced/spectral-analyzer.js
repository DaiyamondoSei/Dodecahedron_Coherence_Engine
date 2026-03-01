/**
 * SpectralAnalyzer - Browser-Compatible Edition
 *
 * The Mathematical Heart of the Coherence Engine
 *
 * This performs spectral analysis on the dodecahedron graph using:
 * - Graph Laplacian (L) matrix
 * - Eigenvector decomposition (U matrix)
 * - Modal amplitude calculation to identify systemic imbalances
 *
 * The spectral analysis reveals the "hidden music" of the organization -
 * the fundamental modes of resonance and dissonance that underlie visible metrics.
 *
 * USAGE:
 * const analyzer = new SpectralAnalyzer();
 * const faceEnergies = [0.39, 0.61, 0.19, 0.37, 0.00, 0.40, 0.31, 0.41, 0.67, 0.67, 0.19, 0.27];
 * const analysis = analyzer.analyze(faceEnergies);
 *
 * @author Deimantas Murauskas & Claude
 * @version 2.0 (Browser Edition)
 */

export class SpectralAnalyzer {
  constructor() {
    // The Dodecahedron Graph Laplacian Matrix (L)
    // This 12x12 matrix encodes the connectivity structure of the dodecahedron
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
        absAmplitude: Math.abs(amplitude),
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
   * @returns {Object} Dominant mode information (defaults to Mode 2 if all amplitudes are 0)
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

    // Edge case: If all amplitudes are 0 (e.g., all KPIs are 0), default to Mode 2
    // This prevents null reference errors in downstream calculations
    if (dominantMode === null && modalAmplitudes.length > 1) {
      dominantMode = modalAmplitudes[1]; // Mode 2 (first non-DC mode)
      Logger.warn('SpectralAnalyzer', 'All modal amplitudes are 0, defaulting to Mode 2');
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
        absDelta: Math.abs(deltaValue),
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
    // Step 1: Calculate modal amplitudes
    const modalAmplitudes = this.calculateModalAmplitudes(faceEnergies);

    // Step 2: Identify dominant mode
    const dominantMode = this.identifyDominantMode(modalAmplitudes);

    // Step 3: Calculate delta vector
    const deltaVector = this.calculateDeltaVector(dominantMode);

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
        absAmplitude: Math.abs(dominantMode.amplitude),
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

      if (delta.deltaValue > 0.01) {  // Threshold to filter noise
        needEnergy.push(action);
      } else if (delta.deltaValue < -0.01) {
        haveExcess.push(action);
      }
    });

    // Sort by priority (absolute delta value)
    needEnergy.sort((a, b) => b.priority - a.priority);
    haveExcess.sort((a, b) => b.priority - a.priority);

    return {
      addEnergy: needEnergy,
      reduceEnergy: haveExcess,
      topPriority: needEnergy.length > 0 ? needEnergy[0] : null,
      leverageRatio: this.calculateLeverageRatio(needEnergy, haveExcess)
    };
  }

  /**
   * Calculate leverage ratio (how efficiently can we rebalance)
   * High ratio = small changes yield big impact
   */
  calculateLeverageRatio(needEnergy, haveExcess) {
    if (needEnergy.length === 0) return 0;

    const totalNeed = needEnergy.reduce((sum, a) => sum + a.priority, 0);
    const highestNeed = needEnergy[0].priority;

    // Leverage is high when one face dominates the need
    return totalNeed > 0 ? (highestNeed / totalNeed) : 0;
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
      absModalAmplitude: Math.abs(dominantMode.amplitude),
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

// Export for use in browser
if (typeof window !== 'undefined') {
  window.SpectralAnalyzer = SpectralAnalyzer;
}
