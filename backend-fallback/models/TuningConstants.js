/**
 * TuningConstants - The Dials of Coherence
 *
 * These are the master tuning parameters that control the behavior of the entire
 * coherence engine. They represent fundamental philosophical choices about how
 * the system measures and weighs different aspects of organizational health.
 *
 * Think of these as the "tuning forks" of the instrument - adjusting them changes
 * the fundamental frequency and responsiveness of the entire system.
 *
 * SPRINT 2 UPDATE: All values now use PHI-derived constants only.
 * The dodecahedron is constructed from φ, so ALL constants must derive from φ.
 * This creates self-similarity at every level (fractal coherence).
 */

// PHI-DERIVED CONSTANTS (Sacred Geometry Foundation)
// Import these values to ensure consistency across the system
const PHI_CONSTANTS = {
  NEG_4: 0.146,    // φ^-4 - Minimal threshold
  NEG_3: 0.236,    // φ^-3 - Low penalty
  NEG_2: 0.382,    // φ^-2 - Moderate-Low
  NEG_1: 0.618,    // φ^-1 - Golden Ratio (balanced)
  HIGH: 0.764,     // 1 - φ^-3 - High (Ψ³)
  MASTERY: 0.854,  // φ^-1 + φ^-3 - Very High (Ψ⁴)
  PHI: 1.618,      // φ - Golden Ratio
  RECIP: 0.618     // 1/φ = φ^-1
};

export class TuningConstants {
  constructor(config = {}) {
    /**
     * α (Alpha): The Synergy Blend
     * Range: 0.0 to 1.0
     * Default: 0.618 (φ^-1) - Golden Ratio
     *
     * Controls the balance between arithmetic mean and multiplicative synergy
     * when calculating Star Pair Values in the pentagram.
     *
     * Philosophy:
     * - High α (0.764 Ψ³): Pragmatic, cautious - trusts simple averages
     * - Low α (0.382 φ^-2): Believes in non-linear synergy - 1+1=3
     * - Balanced α (0.618 φ^-1): "We believe in synergy, but ground it in reality"
     */
    this.alpha = config.alpha ?? PHI_CONSTANTS.NEG_1; // 0.618

    /**
     * β (Beta): The Intersection Blend
     * Range: 0.0 to 1.0
     * Default: 0.618 (φ^-1) - Golden Ratio balanced
     *
     * Controls how adjacent "star pairs" influence each other in the pentagram.
     *
     * Philosophy:
     * - β = 0.618: Golden-balanced influence
     * - β = 0.382: Asymmetric, favoring second element
     */
    this.beta = config.beta ?? PHI_CONSTANTS.NEG_1; // 0.618

    /**
     * γ (Gamma): The "Ball and Pillars" Blend
     * Range: 0.0 to 1.0
     * Default: 0.764 (Ψ³) - High internal accountability
     *
     * Controls the balance between a face's internal state (the "Ball" - its primary KPI)
     * and its relational health (the "Pillars" - its edge KPIs).
     *
     * Philosophy:
     * - High γ (0.854 Ψ⁴): "Radical internal accountability" - own your state
     * - Low γ (0.382 φ^-2): "Nothing without relationships" - context is everything
     * - Balanced γ (0.764 Ψ³): "Primarily responsible for self, significantly influenced by relationships"
     */
    this.gamma = config.gamma ?? PHI_CONSTANTS.HIGH; // 0.764

    /**
     * δ (Delta): The Axis Coherence Factor
     * Range: 0.0 to 1.0
     * Default: 0.854 (Ψ⁴) - High local focus
     *
     * Controls how much a face's energy is influenced by its polar opposite on the
     * axis (e.g., how much "Financial Capital" is influenced by "Funding Pipeline").
     *
     * Philosophy:
     * - High δ (0.854 Ψ⁴): "Focus on local reality" - 85% local, 15% shadow
     * - Low δ (0.382 φ^-2): "Profoundly linked to shadow" - deep non-duality
     * - Balanced δ (0.618 φ^-1): Golden-balanced non-dual awareness
     */
    this.delta = config.delta ?? PHI_CONSTANTS.MASTERY; // 0.854

    /**
     * κ (Kappa): The Sensitivity Amplifier
     * Range: 1.0 to 10.0
     * Default: 4.0 (kept for mathematical reasons - not a 0-1 constant)
     *
     * Controls the "emotional responsiveness" of the system - how steeply
     * the S-curve responds to changes in face energy.
     *
     * Philosophy:
     * - Low κ (1.618 φ): Gentle, forgiving, high inertia
     * - High κ (6.18): Highly sensitive, responsive
     * - Balanced κ (4.0): Good responsiveness without volatility
     *
     * Technical: Uses logistic function: 1 / (1 + e^(-κ*(x-0.5)))
     */
    this.kappa = config.kappa ?? 4.0;

    /**
     * Shadow Penalty Weights (Now PHI-derived)
     * These control how severely the system penalizes incoherent patterns
     */
    this.shadowPenalties = {
      brittleProfit: config.brittleProfit ?? PHI_CONSTANTS.NEG_3,      // 0.236 - High finance + Low resilience
      extractiveGrowth: config.extractiveGrowth ?? PHI_CONSTANTS.NEG_2, // 0.382 - High finance + Low regeneration
      experienceGap: config.experienceGap ?? PHI_CONSTANTS.NEG_2,      // 0.382 - High brand + Low operations
      burnoutEngine: config.burnoutEngine ?? PHI_CONSTANTS.NEG_1,      // 0.618 - High operations + Low human (more severe)
      hollowGovernance: config.hollowGovernance ?? PHI_CONSTANTS.NEG_3, // 0.236 - High structure + Low values
      lonelyHero: config.lonelyHero ?? PHI_CONSTANTS.NEG_2             // 0.382 - High IP + Bus factor = 1
    };

    /**
     * Breath Ratio Thresholds (Now PHI-derived: 1/φ to φ)
     * Define what counts as "balanced" breathing
     * Per Master Plan: "Use φ-based values (1/φ to φ = 0.618-1.618), NOT arbitrary 0.8-1.2"
     */
    this.breathRatio = {
      minBalanced: config.breathMinBalanced ?? PHI_CONSTANTS.RECIP,  // 0.618 - Below this = over-exhaling
      maxBalanced: config.breathMaxBalanced ?? PHI_CONSTANTS.PHI     // 1.618 - Above this = over-inhaling
    };

    /**
     * Variance Penalties (from SYSTEM_COHERENCE) - Now PHI-derived
     * Control how much the system values harmony over raw power
     */
    this.variancePenalties = {
      department: config.deptPenalty ?? PHI_CONSTANTS.NEG_2,  // 0.382 ρ_dept
      octave: config.octavePenalty ?? PHI_CONSTANTS.NEG_3,    // 0.236 ρ_oct
      global: config.globalPenalty ?? PHI_CONSTANTS.NEG_3     // 0.236 ρ_global
    };
  }

  /**
   * Get a human-readable explanation of current settings
   */
  getExplanation() {
    return {
      alpha: {
        value: this.alpha,
        meaning: this.alpha > 0.7 ? 'Pragmatic & cautious' : this.alpha < 0.4 ? 'Believes in strong synergy' : 'Balanced',
        impact: 'Controls how Star Pairs blend arithmetic and multiplicative effects'
      },
      beta: {
        value: this.beta,
        meaning: this.beta === 0.5 ? 'Perfectly symmetrical' : 'Asymmetric influence',
        impact: 'Controls how adjacent elements influence each other in pentagram'
      },
      gamma: {
        value: this.gamma,
        meaning: this.gamma > 0.7 ? 'Internal accountability focus' : this.gamma < 0.4 ? 'Relationship focus' : 'Balanced',
        impact: 'Balance between internal state and relational health'
      },
      delta: {
        value: this.delta,
        meaning: this.delta > 0.7 ? 'Local focus' : this.delta < 0.4 ? 'Shadow-aware' : 'Non-dual balance',
        impact: 'Influence of polar opposite face on axis'
      },
      kappa: {
        value: this.kappa,
        meaning: this.kappa > 5 ? 'Highly responsive' : this.kappa < 3 ? 'Gentle & forgiving' : 'Balanced sensitivity',
        impact: 'How steeply system responds to changes'
      }
    };
  }

  /**
   * Apply sensitivity amplifier (logistic function)
   * Transforms a 0-1 score into an amplified response
   */
  applySensitivityAmplifier(score) {
    // Logistic function: 1 / (1 + e^(-κ*(x-0.5)))
    return 1 / (1 + Math.exp(-this.kappa * (score - 0.5)));
  }

  /**
   * Calculate Star Pair Value using alpha blending
   * s = α × mean(k1, k2) + (1-α) × sqrt(k1 × k2)
   */
  calculateStarPairValue(k1, k2) {
    const arithmeticMean = (k1 + k2) / 2;
    const geometricMean = Math.sqrt(k1 * k2);
    return this.alpha * arithmeticMean + (1 - this.alpha) * geometricMean;
  }

  /**
   * Calculate Intersection Node using beta blending
   * p = β × s1 + (1-β) × s2
   */
  calculateIntersectionNode(s1, s2) {
    return this.beta * s1 + (1 - this.beta) * s2;
  }

  /**
   * Blend Ball and Pillars using gamma
   * LocalCoherence = γ × Ball + (1-γ) × Pillars
   */
  blendBallAndPillars(ballHealth, pillarHealth) {
    return this.gamma * ballHealth + (1 - this.gamma) * pillarHealth;
  }

  /**
   * Apply axis coherence factor using delta
   * AxisInformed = δ × Local + (1-δ) × Opposite
   */
  applyAxisCoherence(localEnergy, oppositeEnergy) {
    return this.delta * localEnergy + (1 - this.delta) * oppositeEnergy;
  }

  /**
   * Validate and constrain all constants to valid ranges
   */
  validate() {
    this.alpha = Math.max(0, Math.min(1, this.alpha));
    this.beta = Math.max(0, Math.min(1, this.beta));
    this.gamma = Math.max(0, Math.min(1, this.gamma));
    this.delta = Math.max(0, Math.min(1, this.delta));
    this.kappa = Math.max(1, Math.min(10, this.kappa));
    return this;
  }

  /**
   * Export to JSON
   */
  toJSON() {
    return {
      alpha: this.alpha,
      beta: this.beta,
      gamma: this.gamma,
      delta: this.delta,
      kappa: this.kappa,
      shadowPenalties: this.shadowPenalties,
      breathRatio: this.breathRatio,
      variancePenalties: this.variancePenalties
    };
  }

  /**
   * Create from JSON
   */
  static fromJSON(json) {
    return new TuningConstants(json);
  }

  /**
   * Create default "balanced" configuration (PHI-aligned)
   */
  static balanced() {
    return new TuningConstants({
      alpha: PHI_CONSTANTS.NEG_1,   // 0.618
      beta: PHI_CONSTANTS.NEG_1,    // 0.618
      gamma: PHI_CONSTANTS.HIGH,    // 0.764
      delta: PHI_CONSTANTS.MASTERY, // 0.854
      kappa: 4.0
    });
  }

  /**
   * Create "gentle" configuration (forgiving, stable) - PHI-aligned
   */
  static gentle() {
    return new TuningConstants({
      alpha: PHI_CONSTANTS.HIGH,    // 0.764 (trusts averages)
      beta: PHI_CONSTANTS.NEG_1,    // 0.618
      gamma: PHI_CONSTANTS.MASTERY, // 0.854 (internal focus)
      delta: PHI_CONSTANTS.MASTERY, // 0.854 (local focus)
      kappa: PHI_CONSTANTS.PHI      // 1.618 (gentle curve)
    });
  }

  /**
   * Create "responsive" configuration (sensitive, dynamic) - PHI-aligned
   */
  static responsive() {
    return new TuningConstants({
      alpha: PHI_CONSTANTS.NEG_2,   // 0.382 (values synergy)
      beta: PHI_CONSTANTS.NEG_1,    // 0.618
      gamma: PHI_CONSTANTS.NEG_1,   // 0.618 (balanced ball/pillars)
      delta: PHI_CONSTANTS.HIGH,    // 0.764 (some shadow awareness)
      kappa: 6.18                   // High sensitivity (phi-inspired)
    });
  }

  /**
   * Create "non-dual" configuration (shadow-aware, relational) - PHI-aligned
   */
  static nonDual() {
    return new TuningConstants({
      alpha: PHI_CONSTANTS.NEG_1,   // 0.618 (balanced)
      beta: PHI_CONSTANTS.NEG_1,    // 0.618 (balanced)
      gamma: PHI_CONSTANTS.NEG_1,   // 0.618 (balanced ball/pillars)
      delta: PHI_CONSTANTS.NEG_1,   // 0.618 (equal local/shadow)
      kappa: 4.0
    });
  }
}

// Export PHI_CONSTANTS for use elsewhere
export { PHI_CONSTANTS };

