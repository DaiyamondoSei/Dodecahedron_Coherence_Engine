/**
 * ════════════════════════════════════════════════════════════════════════════════
 * FACE.JS - ORGANIZATIONAL DOMAIN MODEL (PENTAGONAL GEOMETRY)
 * ════════════════════════════════════════════════════════════════════════════════
 *
 * Represents one of the 12 faces of the dodecahedron.
 * Each face is an organizational domain (e.g., Financial Capital, Human Capital).
 *
 * EXTRACTED FROM: main.js (December 16, 2025)
 *
 * @module js/core/Face
 * @author Deimantas Murauskas & Claude
 * @version 2.1.0 - Gold documentation standard
 * @see {@link ../../docs/SYSTEM_ARCHITECTURE.md} - Unified system map
 *
 * ════════════════════════════════════════════════════════════════════════════════
 * NAVIGATION MAP - WHAT THIS FILE CONNECTS TO
 * ════════════════════════════════════════════════════════════════════════════════
 *
 * DEPENDS ON:
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │                                                                              │
 * │  ./TuningConfig.js ───────────→ 8 Greek parameters (α, β, γ, δ, η, ζ, θ)   │
 * │  window.PhiHarmonics ─────────→ PHI, PHI_INV_1, PHI_INV_2 (optional)       │
 * │                                                                              │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * EXPORTS:
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │                                                                              │
 * │  export class Face ───────────→ ES module export                            │
 * │  window.Face ─────────────────→ Global export for backward compatibility   │
 * │                                                                              │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * USED BY:
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │                                                                              │
 * │  js/main.js (DodecahedronEngine) ─→ Creates and manages 12 Face instances  │
 * │  js/core/index.js ────────────────→ Barrel export for clean imports        │
 * │                                                                              │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * ════════════════════════════════════════════════════════════════════════════════
 * FORMULA DERIVATIONS - WHERE EACH FORMULA COMES FROM
 * ════════════════════════════════════════════════════════════════════════════════
 *
 * STAR PAIR FORMULA (calculateStarPairs):
 * ────────────────────────────────────────
 *   s = α × (k₁ + k₂)/2 + (1 - α) × k₁ × k₂
 *
 *   Source: Pentagram geometry (non-adjacent vertex connections)
 *   Philosophy: α controls "synergy belief"
 *   - α = 1.0: Pure arithmetic mean (1+1=2)
 *   - α = 0.0: Pure multiplicative synergy (1+1=3 when both high)
 *   - α = 0.5 (default): Balanced blend
 *
 * INTERSECTION NODE FORMULA (calculateIntersectionNodes):
 * ────────────────────────────────────────────────────────
 *   p = β × s_prev + (1 - β) × s_curr
 *
 *   Source: Star pair crossings in pentagram
 *   Philosophy: β controls intersection influence blend
 *
 * LOCAL COHERENCE FORMULA (calculateLocalCoherence):
 * ───────────────────────────────────────────────────
 *   E_base = γ × Ball + (1 - γ) × Pillars_avg
 *   E_local = E_base × (1 + η × R_harmonic)
 *
 *   Source: Ball-and-pillars metaphor from sacred geometry
 *   η (eta) = φ^-2 = 38.2% = maximum harmonic boost
 *   Philosophy: "Coherent systems amplify energy through harmony"
 *
 *   Why φ^-2 for η?
 *   - φ^-2 = 0.382 is the "golden complement" (1 - φ^-1)
 *   - Creates perfect symmetry with zenith gradient
 *
 * OCTAVE PROGRESS FORMULA (calculateOctaveProgress):
 * ───────────────────────────────────────────────────
 *   Progress = E_local × (1 - ζ × (Octave - 1))
 *
 *   Where ζ (zeta) = φ^-2 / 6 = 6.37% per octave step
 *
 *   Derivation:
 *   - Total penalty at O7: should equal φ^-2 = 38.2%
 *   - 6 steps from O1 to O7: 38.2% / 6 = 6.37% per step
 *
 *   OCTAVE MULTIPLIERS:
 *   │ Octave │ Multiplier │ Penalty │
 *   │   O1   │   1.000    │   0.0%  │
 *   │   O2   │   0.936    │   6.4%  │
 *   │   O3   │   0.873    │  12.7%  │
 *   │   O4   │   0.809    │  19.1%  │
 *   │   O5   │   0.745    │  25.5%  │
 *   │   O6   │   0.682    │  31.8%  │
 *   │   O7   │   0.618    │  38.2%  │ ← φ^-1 (beautiful symmetry!)
 *
 * AXIS-INFORMED ENERGY FORMULA (calculateAxisInformedEnergy):
 * ────────────────────────────────────────────────────────────
 *   E_f = δ × E_local + (1 - δ) × E_opposing
 *
 *   Source: Breath axis polarity (6 face pairs)
 *   δ (delta) = shadow integration factor
 *   - δ = 1.0: Pure local focus (ignore shadow)
 *   - δ = 0.5: Equal blend (maximum shadow integration)
 *   - δ = 0.9 (default): Mostly local, 10% shadow
 *
 * HARMONIC RESONANCE FORMULA (calculateHarmonicResonance):
 * ─────────────────────────────────────────────────────────
 *   R = Σ(1 - |kᵢ - kⱼ|) / 10
 *
 *   Where (i,j) are pentagram connections (non-adjacent pairs)
 *   Source: Pentagram inner star creates 5 edges
 *   Each vertex has 2 connections, 5×2=10 measurements
 *   Perfect resonance (R=1.0) when all elements equal
 *
 * ════════════════════════════════════════════════════════════════════════════════
 * NOTES FOR FUTURE CLAUDE - 10 KEY INSIGHTS
 * ════════════════════════════════════════════════════════════════════════════════
 *
 * 1. DEPENDS ON TuningConfig.js (import it), receives KPI instances from engine
 * 2. 12 faces in dodecahedron, each with 5 elemental KPIs (pentagram geometry)
 * 3. Star pairs: alpha-blended connections between non-adjacent elements
 * 4. Intersection nodes: beta-blended crossings of star pairs
 * 5. Harmonic resonance: pentagram geometry measurement (edges in the star)
 * 6. Octave progress: eta resonance boost + zeta zenith gradient
 * 7. Axis-informed energy: delta shadow integration with opposing face
 * 8. All Greek letters (α,β,γ,δ,η,ζ,θ) refer to TuningConfig parameters
 * 9. The faceEnergy getter returns final axis-informed value if available
 * 10. invalidateCache() MUST be called when KPIs change (critical!)
 *
 * ════════════════════════════════════════════════════════════════════════════════
 * BACKWARD COMPATIBILITY
 * ════════════════════════════════════════════════════════════════════════════════
 *
 * This module supports both ES module and global export patterns:
 * - ES Module: import { Face } from './core/index.js'
 * - Global: window.Face (for legacy IIFE modules)
 *
 * PhiHarmonics graceful degradation:
 * - Uses window.PhiHarmonics if available
 * - Falls back to local constants if not loaded
 * - Difference is < 1e-15 (mathematically insignificant)
 *
 * ════════════════════════════════════════════════════════════════════════════════
 */

import { TuningConfig } from './TuningConfig.js';

// ============================================================================
// PHI_HARMONICS: Get from single-source module or use fallback
// ============================================================================
const PHI_HARMONICS = (function() {
  if (typeof window !== 'undefined' && window.PhiHarmonics) {
    console.log('   Face: Using PhiHarmonics from single-source module');
    return window.PhiHarmonics;
  }

  // Fallback for standalone use or testing
  console.log('   Face: Using local PHI_HARMONICS fallback');
  const PHI = (1 + Math.sqrt(5)) / 2;

  return {
    PHI: PHI,
    PHI_INV_1: 1 / PHI,
    PHI_INV_2: 1 / (PHI * PHI)
  };
})();

/**
 * Represents one of the 12 faces of the dodecahedron.
 * Each face is an organizational domain (e.g., Financial Capital, Human Capital).
 *
 * The face calculates its "energy" through a multi-step geometric process:
 * 1. Star Pairs: Connect non-adjacent elements using alpha blend
 * 2. Intersection Nodes: Blend crossing star pairs using beta
 * 3. Center Composite: Average of intersection nodes
 * 4. Pillar Symmetry: Variance of elemental scores
 * 5. Harmonic Resonance: Pentagram geometry harmony
 * 6. Local Coherence: Gamma-blended ball + pillars with eta harmonic boost
 * 7. Octave Progress: Local coherence with zeta zenith gradient
 * 8. Axis-Informed Energy: Delta-blended with opposing face
 *
 * @class Face
 */
export class Face {
  /**
   * Create a new Face instance
   *
   * @param {Object} config - Configuration object
   * @param {number} config.id - Face ID (1-12)
   * @param {string} config.name - Human-readable name
   * @param {Array<KPI>} config.elementalKPIs - 5 KPIs (one per element: Earth, Water, Fire, Air, Ether)
   * @param {KPI} config.ballKPI - Primary/headline KPI
   * @param {number} config.currentOctave - Current octave level (1-7)
   * @param {TuningConfig} tuningConfig - Tuning configuration instance
   */
  constructor(config, tuningConfig) {
    this.id = config.id || 0;
    this.name = config.name || '';
    this.elementalKPIs = config.elementalKPIs || []; // 5 KPIs (one per element)
    this.ballKPI = config.ballKPI || null; // Primary/headline KPI
    this.tuning = tuningConfig || new TuningConfig();

    // Octave tracking (1-7, representing organizational maturity)
    this.currentOctave = config.currentOctave || 1;

    // Geometric State
    this.starPairs = []; // s values
    this.intersectionNodes = []; // p values
    this.centerComposite = 0; // C value
    this.pillarSymmetry = 0; // S_f

    // Energy States
    this._localCoherence = null; // Before axis check
    this._faceEnergy = null; // Final axis-informed energy
    this._harmonicResonance = null; // Pentagram resonance cache
    this._octaveCoherence = null; // Octave-penalized coherence cache

    // Pentagram connections: which elements each vertex connects to
    // In a pentagram, each vertex connects to the two non-adjacent vertices
    this.pentagramConnections = [
      [2, 3], // Element 0 connects to 2 and 3
      [3, 4], // Element 1 connects to 3 and 4
      [0, 4], // Element 2 connects to 0 and 4
      [0, 1], // Element 3 connects to 0 and 1
      [1, 2]  // Element 4 connects to 1 and 2
    ];
  }

  /**
   * 1. Calculate Star Pair Values (s)
   *
   * Formula: s = alpha * average(k1, k2) + (1-alpha) * (k1 * k2)
   * Connects non-adjacent elements (The pentagram lines)
   *
   * Philosophy: The alpha parameter controls the "Synergy Blend" -
   * how much we believe 1+1=3 (multiplicative) vs 1+1=2 (arithmetic)
   *
   * @returns {Array<number>} Star pair values
   */
  calculateStarPairs() {
    if (this.elementalKPIs.length < 5) return [];

    // Pentagram connections: 0-2, 1-3, 2-4, 3-0, 4-1
    const connections = [
      [0, 2], [1, 3], [2, 4], [3, 0], [4, 1]
    ];

    this.starPairs = connections.map(([i1, i2]) => {
      const k1 = this.elementalKPIs[i1].normalizedScore;
      const k2 = this.elementalKPIs[i2].normalizedScore;

      // The Synergy Blend (Alpha)
      const arithmeticMean = (k1 + k2) / 2;
      const geometricSynergy = k1 * k2; // Simplified product synergy

      return (this.tuning.ALPHA * arithmeticMean) + ((1 - this.tuning.ALPHA) * geometricSynergy);
    });

    return this.starPairs;
  }

  /**
   * 2. Calculate Intersection Nodes (p)
   *
   * Formula: p = beta * s_prev + (1-beta) * s_next
   * Where star pairs cross
   *
   * Philosophy: Beta controls the "Intersection Blend" -
   * the influence of adjacent star pairs on crossing points
   *
   * @returns {Array<number>} Intersection node values
   */
  calculateIntersectionNodes() {
    if (this.starPairs.length < 5) return [];

    // Intersections follow the cycle of star pairs
    // p0 is between s4 and s0, p1 between s0 and s1...
    // Simplified adjacency for loop: p[i] blends s[i] and s[i-1] (wrapping)

    this.intersectionNodes = this.starPairs.map((s, i) => {
      const s_prev = this.starPairs[(i - 1 + 5) % 5];
      const s_curr = s;

      return (this.tuning.BETA * s_prev) + ((1 - this.tuning.BETA) * s_curr);
    });

    return this.intersectionNodes;
  }

  /**
   * 3. Calculate Center Composite (C)
   *
   * The harmonic core - average of intersection nodes
   *
   * @returns {number} Center composite value
   */
  calculateCenterComposite() {
    if (this.intersectionNodes.length === 0) return 0;
    const sum = this.intersectionNodes.reduce((a, b) => a + b, 0);
    this.centerComposite = sum / this.intersectionNodes.length;
    return this.centerComposite;
  }

  /**
   * 4. Calculate Pillar Symmetry (S_f)
   *
   * Measures variance between pillars (1.0 = perfect symmetry, 0.0 = chaos)
   *
   * @returns {number} Pillar symmetry (0-1)
   */
  calculatePillarSymmetry() {
    if (this.elementalKPIs.length === 0) return 0;

    // Standard deviation of normalized scores
    const scores = this.elementalKPIs.map(k => k.normalizedScore);
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / scores.length;
    const stdDev = Math.sqrt(variance);

    // Convert to 0-1 score (inverted deviation)
    // Assuming max meaningful deviation is around 0.5
    this.pillarSymmetry = Math.max(0, 1 - (stdDev * 2));
    return this.pillarSymmetry;
  }

  /**
   * 4b. Calculate Harmonic Resonance using pentagram geometry
   *
   * Measures how well the 5 elemental KPIs work together in harmony.
   *
   * Philosophy: Resonance is highest when connected elements have similar values.
   * The pentagram connects non-adjacent vertices, creating the "star within".
   *
   * @returns {number} Harmonic resonance (0.0 = total dissonance, 1.0 = perfect harmony)
   */
  calculateHarmonicResonance() {
    if (this.elementalKPIs.length < 5) return 0;

    let totalResonance = 0;

    // For each element, check its harmony with its pentagram connections
    for (let i = 0; i < 5; i++) {
      const element = this.elementalKPIs[i];
      const connections = this.pentagramConnections[i];

      // Calculate resonance with each connected element (2 connections per vertex)
      for (const connectedIdx of connections) {
        const connected = this.elementalKPIs[connectedIdx];

        // Resonance is higher when values are similar (harmony)
        // Maximum difference is 1.0, so resonance = 1 - |difference|
        const difference = Math.abs(element.normalizedScore - connected.normalizedScore);
        const resonance = 1.0 - difference;

        totalResonance += resonance;
      }
    }

    // Average resonance across all 10 connections in the pentagram
    // (5 vertices * 2 connections each = 10, but each edge counted twice = 5 unique edges)
    // We count all 10 for consistency with original formula
    this._harmonicResonance = totalResonance / 10;
    return this._harmonicResonance;
  }

  /**
   * Get harmonic resonance (cached)
   * @returns {number} Harmonic resonance (0-1)
   */
  get harmonicResonance() {
    if (this._harmonicResonance === null) {
      this._harmonicResonance = this.calculateHarmonicResonance();
    }
    return this._harmonicResonance;
  }

  /**
   * 4c. Calculate Octave Progress (Progress Toward Transcendence)
   *
   * REFRAMED CONCEPT: Instead of "coherence percentage", this represents
   * "progress toward the next octave" - a developmental journey.
   *
   * Philosophy: Organizations don't have abstract "coherence" - they're always
   * on a journey of becoming. This measures how far along that journey they are.
   *
   * Formula: progress = localCoherence * (1 - zeta * (currentOctave - 1))
   *
   * Where zeta = phi^-2 / 6 = 6.37% (the Zenith Gradient)
   *
   * Results (using phi-derived constants):
   * - Octave 1 (Survival):      multiplier = 1.000 (no penalty)
   * - Octave 2 (Structure):     multiplier = 0.936 (6.4% harder)
   * - Octave 3 (Relationships): multiplier = 0.873 (12.7% harder)
   * - Octave 4 (Creativity):    multiplier = 0.809 (19.1% harder)
   * - Octave 5 (Expression):    multiplier = 0.745 (25.5% harder)
   * - Octave 6 (Vision):        multiplier = 0.682 (31.8% harder)
   * - Octave 7 (Radiance):      multiplier = 0.618 (38.2% harder = phi^-2)
   *
   * Beautiful symmetry: Max penalty (phi^-2) = Max boost (phi^-2)
   *
   * @returns {number} Octave progress (0-1)
   */
  calculateOctaveProgress() {
    // Get base coherence (local coherence with harmonic boost already applied)
    if (this._localCoherence === null) {
      this.calculateLocalCoherence();
    }

    // Apply zenith gradient (higher octaves are harder to master)
    // Uses ZETA = phi^-2 / 6 per octave step
    const zenithMultiplier = 1 - (this.tuning.ZETA * (this.currentOctave - 1));

    // Calculate progress toward transcendence
    this._octaveCoherence = this._localCoherence * zenithMultiplier;
    return this._octaveCoherence;
  }

  /**
   * Alias for backward compatibility
   * @returns {number} Octave coherence (0-1)
   */
  calculateOctaveCoherence() {
    return this.calculateOctaveProgress();
  }

  /**
   * Get octave progress (cached)
   * Represents progress toward the next octave level
   * @returns {number} Octave progress (0-1)
   */
  get octaveProgress() {
    if (this._octaveCoherence === null) {
      this._octaveCoherence = this.calculateOctaveProgress();
    }
    return this._octaveCoherence;
  }

  /**
   * Alias for backward compatibility
   * @returns {number} Octave coherence (0-1)
   */
  get octaveCoherence() {
    return this.octaveProgress;
  }

  /**
   * Check if this face is ready to transcend to the next octave.
   *
   * Uses theta = phi^-1 = 61.8% as the Golden Threshold.
   * Philosophy: "When you've integrated 61.8%, you're ready to transcend"
   *
   * At Octave 7, there's no "next" octave - you've reached Radiance.
   * Progress at Octave 7 represents depth of mastery, not advancement.
   *
   * @returns {boolean} True if ready for next octave
   */
  isReadyForNextOctave() {
    return this.octaveProgress >= this.tuning.THETA && this.currentOctave < 7;
  }

  /**
   * Get octave status for display
   *
   * @returns {Object} Octave status information
   */
  getOctaveStatus() {
    const octaveNames = [
      'Survival', 'Structure', 'Relationships', 'Creativity',
      'Expression', 'Vision', 'Radiance'
    ];

    return {
      currentOctave: this.currentOctave,
      octaveName: octaveNames[this.currentOctave - 1],
      coherence: this.octaveCoherence,
      readyForNext: this.isReadyForNextOctave(),
      nextOctave: this.currentOctave < 7 ? octaveNames[this.currentOctave] : null
    };
  }

  /**
   * 5. Calculate Local Coherence Score (E_local)
   *
   * Blends the Ball (Primary KPI) with the Pillars (Relational Health)
   * Then applies Harmonic Resonance Boost from pentagram geometry.
   *
   * Formula: E_local_base = gamma * Ball + (1-gamma) * Pillars_Avg
   *          E_local = E_local_base * (1.0 + eta * R_harmonic)
   *
   * Where eta = phi^-2 = 38.2% (the Resonance Amplifier)
   * Philosophy: "Coherent systems amplify their energy through harmony"
   *
   * @returns {number} Local coherence (0-1)
   */
  calculateLocalCoherence() {
    // Ensure prerequisites
    this.calculateStarPairs();
    this.calculateIntersectionNodes();
    this.calculateCenterComposite();
    this.calculatePillarSymmetry();
    this.calculateHarmonicResonance();

    const ballScore = this.ballKPI ? this.ballKPI.normalizedScore : 0;

    // "Nuanced Avg Pillar Health" - we'll use CenterComposite as the robust pillar metric
    // or a blend of raw average and geometric integrity
    const rawPillarAvg = this.elementalKPIs.reduce((s, k) => s + k.normalizedScore, 0) / 5;

    // Blend Ball and Pillars using Gamma
    const baseCoherence = (this.tuning.GAMMA * ballScore) + ((1 - this.tuning.GAMMA) * rawPillarAvg);

    // Apply Harmonic Resonance Boost using Eta (phi^-2 = 38.2% max boost)
    // When elements are in resonance, the whole becomes greater than the sum of parts
    // This is grounded in sacred geometry: phi^-2 is the "golden complement"
    const harmonicBoost = 1.0 + (this.tuning.ETA * this._harmonicResonance);
    this._localCoherence = Math.min(1.0, baseCoherence * harmonicBoost); // Cap at 1.0

    return this._localCoherence;
  }

  /**
   * 6. Calculate Final Axis-Informed Energy (E_f)
   *
   * The "Grand Synthesis" - blends local score with opposing face.
   * Formula: E_f = delta * E_local + (1-delta) * E_opposing
   *
   * Philosophy: Delta controls the "Shadow Factor" - how much the
   * opposing face influences this face's energy.
   *
   * @param {number} opposingFaceEnergy - Energy of the opposing face (0-1)
   * @returns {number} Axis-informed energy (0-1)
   */
  calculateAxisInformedEnergy(opposingFaceEnergy) {
    if (this._localCoherence === null) this.calculateLocalCoherence();

    const local = this._localCoherence;
    const opposing = opposingFaceEnergy || 0; // If no opposing face (rare), assume 0 impact

    // The Axis Coherence Factor (Delta)
    // If Delta is 0.9, we are 90% local, 10% shadow
    this._faceEnergy = (this.tuning.DELTA * local) + ((1 - this.tuning.DELTA) * opposing);

    return this._faceEnergy;
  }

  /**
   * Get face energy (returns final axis-informed if available, else local)
   * @returns {number} Face energy (0-1)
   */
  get faceEnergy() {
    if (this._faceEnergy !== null) return this._faceEnergy;
    if (this._localCoherence !== null) return this._localCoherence;
    return this.calculateLocalCoherence();
  }

  /**
   * Invalidate cache when KPIs change.
   * MUST be called when any KPI value is updated.
   */
  invalidateCache() {
    this._localCoherence = null;
    this._faceEnergy = null;
    this._harmonicResonance = null;
    this._octaveCoherence = null;
    this.starPairs = [];
    this.intersectionNodes = [];
  }

  /**
   * Get health status as string
   * @returns {string} Health status (Radiant, Healthy, Dimming, Struggling, Critical)
   */
  get healthStatus() {
    const energy = this.faceEnergy;
    if (energy >= 0.9) return 'Radiant';
    if (energy >= 0.7) return 'Healthy';
    if (energy >= 0.5) return 'Dimming';
    if (energy >= 0.3) return 'Struggling';
    return 'Critical';
  }

  /**
   * Get color based on energy level (for visualization)
   *
   * Color zones:
   * - Green (0.7-1.0): Healthy to Radiant
   * - Yellow (0.4-0.7): Dimming
   * - Red (0.0-0.4): Critical to Struggling
   *
   * @returns {string} Hex color string
   */
  getEnergyColor() {
    const energy = this.faceEnergy;

    if (energy >= 0.7) {
      // Green zone: interpolate from light green to bright green
      const t = (energy - 0.7) / 0.3;
      return this.interpolateColor('#66ff66', '#00ff00', t);
    } else if (energy >= 0.4) {
      // Yellow zone: interpolate from yellow to light green
      const t = (energy - 0.4) / 0.3;
      return this.interpolateColor('#ffff00', '#66ff66', t);
    } else {
      // Red zone: interpolate from red to yellow
      const t = energy / 0.4;
      return this.interpolateColor('#ff0000', '#ffff00', t);
    }
  }

  /**
   * Helper: Interpolate between two hex colors
   *
   * @param {string} color1 - Start color (hex)
   * @param {string} color2 - End color (hex)
   * @param {number} t - Interpolation factor (0-1)
   * @returns {string} Interpolated hex color
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
}

// ============================================================================
// Backward compatibility: export to window for IIFE modules
// ============================================================================
if (typeof window !== 'undefined') {
  window.Face = Face;
}

console.log('   Face module loaded');
