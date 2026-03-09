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
 * @see {@link ../docs/math/SPECTRAL_IMPLEMENTATION.md} - Graph Laplacian implementation details
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
 * Analytical: λ = 0 (×1), 5−√5 (×3), 5 (×5), 5+√5 (×3)
 * - λ = 0 (Mode 1): DC offset - just the average energy, skip this
 * - λ = 5−√5 ≈ 2.764 (Modes 2-4): GLOBAL patterns - whole-system imbalances
 * - λ = 5 (Modes 5-9): REGIONAL patterns - clusters of faces
 * - λ = 5+√5 ≈ 7.236 (Modes 10-12): FINE-GRAINED - local dissonance
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
 * @author Deimantas Murauskas & Claude
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
    // Canonical adjacency from dodecahedron-topology.js EDGES:
    // [1,2],[1,6],[1,7],[1,8],[1,10], [2,3],[2,6],[2,10],[2,11],
    // [3,4],[3,6],[3,9],[3,11], [4,5],[4,6],[4,7],[4,9],
    // [5,7],[5,8],[5,9],[5,12], [6,7], [7,8],
    // [8,10],[8,12], [9,11],[9,12], [10,11],[10,12], [11,12]
    this.L = [
    // F1  F2  F3  F4  F5  F6  F7  F8  F9  F10 F11 F12
      [5, -1,  0,  0,  0, -1, -1, -1,  0, -1,  0,  0], // F1:  adj 2,6,7,8,10
      [-1, 5, -1,  0,  0, -1,  0,  0,  0, -1, -1,  0], // F2:  adj 1,3,6,10,11
      [0, -1,  5, -1,  0, -1,  0,  0, -1,  0, -1,  0], // F3:  adj 2,4,6,9,11
      [0,  0, -1,  5, -1, -1, -1,  0, -1,  0,  0,  0], // F4:  adj 3,5,6,7,9
      [0,  0,  0, -1,  5,  0, -1, -1, -1,  0,  0, -1], // F5:  adj 4,7,8,9,12
      [-1,-1, -1, -1,  0,  5, -1,  0,  0,  0,  0,  0], // F6:  adj 1,2,3,4,7
      [-1, 0,  0, -1, -1, -1,  5, -1,  0,  0,  0,  0], // F7:  adj 1,4,5,6,8
      [-1, 0,  0,  0, -1,  0, -1,  5,  0, -1,  0, -1], // F8:  adj 1,5,7,10,12
      [0,  0, -1, -1, -1,  0,  0,  0,  5,  0, -1, -1], // F9:  adj 3,4,5,11,12
      [-1,-1,  0,  0,  0,  0,  0, -1,  0,  5, -1, -1], // F10: adj 1,2,8,11,12
      [0, -1, -1,  0,  0,  0,  0,  0, -1, -1,  5, -1], // F11: adj 2,3,9,10,12
      [0,  0,  0,  0, -1,  0,  0, -1, -1, -1, -1,  5]  // F12: adj 5,8,9,10,11
    ];

    // The Dodecahedron Eigenvector Matrix (U)
    // Each column is an eigenvector corresponding to an eigenvalue
    //
    // CORRECTED March 9, 2026 — Recomputed via Jacobi eigendecomposition
    // from the canonical EDGES topology Laplacian above.
    //
    // Analytical eigenvalues of the icosahedral face-adjacency Laplacian:
    //   λ = 0 (×1), 5−√5 ≈ 2.7639 (×3), 6 (×5), 5+√5 ≈ 7.2361 (×3)
    //
    // Derivation: icosahedron adjacency eigenvalues are {5, √5, −1, −√5}
    // so L = 5I − A gives {0, 5−√5, 6, 5+√5}.
    // Note: 5−√5 = 2(3−φ) and 5+√5 = 2(2+φ) — deeply φ-connected.
    // Multiplicities: 1+3+5+3 = 12 ✓
    //
    this.U = [
      // Mode 1       2          3          4          5          6          7          8          9          10         11         12
      [ 0.288675, -0.186471, -0.386147,  0.257136, -0.521268, -0.265553, -0.203798, -0.167723,  0.069018,  0.408617,  0.246300,  0.149560],  // Face 1
      [ 0.288675,  0.280403, -0.175174,  0.375084,  0.002974,  0.585787, -0.215034, -0.153152,  0.061775, -0.415179,  0.071313,  0.269334],  // Face 2
      [ 0.288675,  0.260394,  0.337664,  0.261109,  0.470089, -0.290634, -0.293337, -0.095398,  0.126758,  0.360460, -0.273373,  0.212922],  // Face 3
      [ 0.288675, -0.218846,  0.443642,  0.072720,  0.044295, -0.031604,  0.106062,  0.019417, -0.634097, -0.070754,  0.459327,  0.184425],  // Face 4
      [ 0.288675, -0.280403,  0.175174, -0.375084,  0.002974,  0.585787, -0.215034, -0.153152,  0.061775,  0.415179, -0.071313, -0.269334],  // Face 5
      [ 0.288675, -0.160793,  0.096726,  0.463454, -0.049607,  0.021815,  0.046881,  0.622803,  0.153781, -0.060137, -0.054581, -0.493360],  // Face 6
      [ 0.288675, -0.495024, -0.003698,  0.070265,  0.053517, -0.019812,  0.559225, -0.225947,  0.222766, -0.148674, -0.381520,  0.286946],  // Face 7
      [ 0.288675, -0.260394, -0.337664, -0.261109,  0.470089, -0.290634, -0.293337, -0.095398,  0.126758, -0.360460,  0.273373, -0.212922],  // Face 8
      [ 0.288675,  0.186471,  0.386147, -0.257136, -0.521268, -0.265553, -0.203798, -0.167723,  0.069018, -0.408617, -0.246300, -0.149560],  // Face 9
      [ 0.288675,  0.218846, -0.443642, -0.072720,  0.044295, -0.031604,  0.106062,  0.019417, -0.634097,  0.070754, -0.459327, -0.184425],  // Face 10
      [ 0.288675,  0.495024,  0.003698, -0.070265,  0.053517, -0.019812,  0.559225, -0.225947,  0.222766,  0.148674,  0.381520, -0.286946],  // Face 11
      [ 0.288675,  0.160793, -0.096726, -0.463454, -0.049607,  0.021815,  0.046881,  0.622803,  0.153781,  0.060137,  0.054581,  0.493360]   // Face 12
    ];

    // Eigenvalues corresponding to each eigenvector (mode)
    // Analytical: 0, 5−√5 (×3), 6 (×5), 5+√5 (×3)
    // Mid-frequency is 6 (not 5) because adjacency eigenvalue for that band is −1
    const SQRT5 = Math.sqrt(5);
    this.eigenvalues = [0, 5-SQRT5, 5-SQRT5, 5-SQRT5, 6, 6, 6, 6, 6, 5+SQRT5, 5+SQRT5, 5+SQRT5];

    // Mode interpretations keyed by rounded eigenvalue
    this.modeInterpretations = {
      0: 'DC Offset (Overall Average Energy)',
      [+(5-SQRT5).toFixed(4)]: 'Low-Frequency Mode (Global Imbalance)',
      6: 'Mid-Frequency Mode (Regional Patterns)',
      [+(5+SQRT5).toFixed(4)]: 'High-Frequency Mode (Fine-Grained Dissonance)'
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
   * Calculate Multi-Mode Delta Vector
   * Sums corrections across ALL significant spectral modes (not just dominant).
   * Formula: Delta_total[f] = -SUM(U[f][m] * a[m]) for |a[m]| >= 0.1 * |a_dominant|
   *
   * @param {Array<Object>} modalAmplitudes - All 12 modal amplitudes
   * @returns {Array<Object>} Delta vector with per-mode contribution breakdown
   */
  calculateMultiModeDeltaVector(modalAmplitudes) {
    const dominantAmp = Math.max(...modalAmplitudes.slice(1).map(m => Math.abs(m.amplitude)));
    const threshold = 0.1 * dominantAmp;
    const deltaVector = [];

    for (let face = 0; face < 12; face++) {
      let totalDelta = 0;
      const modeContributions = [];

      for (let m = 1; m < 12; m++) {
        const amp = modalAmplitudes[m].amplitude;
        if (Math.abs(amp) >= threshold) {
          const contribution = -this.U[face][m] * amp;
          totalDelta += contribution;
          modeContributions.push({
            mode: m + 1,
            eigenvalue: this.eigenvalues[m],
            contribution: contribution
          });
        }
      }

      deltaVector.push({
        faceId: face + 1,
        deltaValue: totalDelta,
        absDelta: Math.abs(totalDelta),
        modeContributions: modeContributions,
        interpretation: this.interpretDelta(totalDelta)
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

    let babScore;
    if (avgProjection > 0) {
      babScore = avgReception / avgProjection;
    } else if (avgReception > 0) {
      babScore = Infinity;
    } else {
      babScore = 1.0; // Both zero = trivially balanced
    }
    const babPercentage = isFinite(babScore) ? babScore * 100 : 999;

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
      // Input validation
      if (!Array.isArray(faceEnergies) || faceEnergies.length !== 12) {
        Logger.warn('SpectralAnalyzer', 'Expected 12-element array, got ' + (Array.isArray(faceEnergies) ? faceEnergies.length : typeof faceEnergies));
        return null;
      }
      if (faceEnergies.some(v => typeof v !== 'number' || isNaN(v))) {
        Logger.warn('SpectralAnalyzer', 'Input contains non-numeric or NaN values — scrubbing to 0');
        faceEnergies = faceEnergies.map(v => (typeof v === 'number' && !isNaN(v)) ? v : 0);
      }

      // Step 1: Calculate modal amplitudes
      const modalAmplitudes = this.calculateModalAmplitudes(faceEnergies);

      // Step 2: Identify dominant mode
      let dominantMode = this.identifyDominantMode(modalAmplitudes);

      // Step 3: Calculate delta vectors
      let deltaVector = [];
      let singleModeDelta = [];
      if (dominantMode) {
        // Multi-mode: sums across all significant modes
        deltaVector = this.calculateMultiModeDeltaVector(modalAmplitudes);
        // Single-mode: preserved for backward compatibility
        singleModeDelta = this.calculateDeltaVector(dominantMode);
      } else {
        Logger.warn('SpectralAnalyzer', 'No dominant mode found (System Empty/Balanced). Using dummy mode.');
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
        singleModeDelta: singleModeDelta,
        diagnostics: {
          beingActionBalance: babScore,
          dissonanceIndex: dissonanceIndex
        },
        correctiveActions: correctiveActions,
        summary: this.generateSummary(dominantMode, babScore, dissonanceIndex)
      };
    } catch (error) {
      Logger.error('SpectralAnalyzer', 'Error in SpectralAnalyzer.analyze:', error);
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

    // Thresholds aligned with analytical eigenvalues: 0, 5-√5≈2.764, 5, 5+√5≈7.236
    if (eigenvalue === 0) {
      pattern = 'System Average';
    } else if (eigenvalue < 4) {
      pattern = 'Global Imbalance Pattern';
    } else if (eigenvalue < 6.5) {
      pattern = 'Regional Pattern';
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
    if (eigenvalue < 0.01) return this.modeInterpretations[0];
    if (eigenvalue < 4) return this.modeInterpretations[+(5 - Math.sqrt(5)).toFixed(4)];
    if (eigenvalue < 6.5) return this.modeInterpretations[5];
    return this.modeInterpretations[+(5 + Math.sqrt(5)).toFixed(4)];
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

    // Mode-specific recommendation (thresholds: 5-√5≈2.764, 5, 5+√5≈7.236)
    if (dominantMode.eigenvalue < 4) {
      recommendations.push('Global pattern detected - requires whole-system intervention');
    } else if (dominantMode.eigenvalue > 6.5) {
      recommendations.push('Local issues detected - can be addressed through targeted interventions');
    }

    return recommendations.length > 0
      ? recommendations.join('. ')
      : 'System is in good balance - maintain current trajectory';
  }
}

// Export for global use
window.SpectralAnalyzer = SpectralAnalyzer;
Logger.info('SpectralAnalyzer', 'Spectral Analyzer (Graph Laplacian) loaded');

