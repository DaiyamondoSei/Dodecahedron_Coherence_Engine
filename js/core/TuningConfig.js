/**
 * ========================================================================
 * TUNING CONFIG - Organizational Coherence Tuning Parameters
 * ========================================================================
 *
 * EXTRACTED FROM: main.js (lines 59-392)
 * EXTRACTION DATE: December 16, 2025
 *
 * This class contains the "Conductor's Settings" - tuning constants that
 * control how the coherence engine calculates organizational health.
 *
 * All constants are grounded in phi (golden ratio) for mathematical coherence
 * with the dodecahedral geometry. The dodecahedron is constructed from phi,
 * therefore all tuning parameters derive from phi for self-similarity.
 *
 * ============================================================================
 *                         NOTES FOR FUTURE CLAUDE
 * ============================================================================
 * 1. This class is INDEPENDENT - no imports from other js/core/ files
 * 2. PHI_HARMONICS is obtained from window.PhiHarmonics OR fallback
 * 3. All 8 Greek letter constants (alpha,beta,gamma,delta,kappa,eta,zeta,theta) are defined here
 * 4. Four template modes: startup, enterprise, balanced, nonDual
 * 5. Used by: Face.js, DodecahedronEngine (main.js)
 * 6. The sensitivity amplifier uses logistic S-curve transformation
 * 7. The constructor sets default "Balanced Mode" values
 * 8. Static methods create preset configurations for different org types
 * ============================================================================
 *
 * @module js/core/TuningConfig
 * @requires window.PhiHarmonics (optional, has fallback)
 */

// ============================================================================
// PHI_HARMONICS: Get from single-source module or use fallback
// ============================================================================
const PHI_HARMONICS = (function() {
  if (typeof window !== 'undefined' && window.PhiHarmonics) {
    console.log('   TuningConfig: Using PhiHarmonics from single-source module');
    return window.PhiHarmonics;
  }

  // Fallback for standalone use or testing
  console.log('   TuningConfig: Using local PHI_HARMONICS fallback');
  const PHI = (1 + Math.sqrt(5)) / 2;

  return {
    PHI: PHI,
    PHI_SQUARED: PHI * PHI,
    PHI_INV_1: 1 / PHI,
    PHI_INV_2: 1 / (PHI * PHI),
    PHI_INV_3: 1 / Math.pow(PHI, 3),
    PHI_INV_4: 1 / Math.pow(PHI, 4),
    // Legacy aliases
    PHI_1: 1 / PHI,
    PHI_2: 1 / (PHI * PHI),
    PHI_3: 1 / Math.pow(PHI, 3),
    PHI_4: 1 / Math.pow(PHI, 4)
  };
})();

/**
 * The "Conductor's Settings" - Tuning constants from Reference Models
 *
 * All constants are grounded in phi (golden ratio) for mathematical coherence with
 * the dodecahedral geometry. The dodecahedron is constructed from phi,
 * therefore all tuning parameters derive from phi for self-similarity.
 *
 * @class TuningConfig
 */
export class TuningConfig {
  constructor() {
    // ========================================================================
    // CORE PHILOSOPHICAL DIALS (Exposed in Harmonic Tuner)
    // ========================================================================

    // ========================================================================
    // ALPHA (α): The Synergy Blend
    // ========================================================================
    // Blends arithmetic mean and multiplicative synergy for Star Pairs.
    // Formula: s = α × (k₁ + k₂)/2 + (1-α) × (k₁ × k₂)
    //
    // DEFAULT: 0.6 (intentionally near φ^-1 = 0.618)
    //
    // PHI DERIVATION NOTE:
    // The natural PHI choice is φ^-1 = 0.618033... (golden ratio inverse).
    // Backend uses φ^-1; frontend uses 0.6 for UX clarity ("60/40 blend").
    // The 0.018 difference (< 3%) has negligible practical impact.
    //
    // Philosophy: "We believe in synergy, but ground it in reality"
    // Range: 0.0 (pure synergy) to 1.0 (pure arithmetic)
    // ========================================================================
    this.ALPHA = 0.6;

    // ========================================================================
    // BETA (β): The Intersection Blend
    // ========================================================================
    // Balances influence of adjacent star-pairs on intersection nodes.
    // Formula: p = β × s_prev + (1-β) × s_curr
    //
    // DEFAULT: 0.5 = PHI_MIDPOINT (!)
    //
    // PHI DERIVATION NOTE:
    // 0.5 = (φ^-1 + φ^-2) / 2 = (0.618 + 0.382) / 2 = PHI_MIDPOINT
    // This is NOT arbitrary - 0.5 is the exact harmonic center of
    // the two primary golden proportions! Beautiful mathematical truth:
    // φ^-1 + φ^-2 = 1.0 exactly, so their midpoint is 0.5 exactly.
    //
    // Philosophy: "Perfect symmetry in flow direction"
    // Range: 0.0 (backward-biased) to 1.0 (forward-biased)
    // ========================================================================
    this.BETA = 0.5;

    // ========================================================================
    // GAMMA (γ): The "Ball and Pillars" Blend
    // ========================================================================
    // Balances internal health (Ball) vs relational health (Pillars).
    // Formula: E_local = γ × Ball + (1-γ) × Pillars_Avg
    //
    // DEFAULT: 0.7 (between φ^-1 and ψ₃)
    //
    // PHI DERIVATION NOTE:
    // Natural PHI choices: φ^-1 = 0.618 (more relational) or ψ₃ = 0.764 (more internal)
    // 0.7 sits precisely between these golden thresholds, representing:
    // - More accountable than φ^-1 (golden default)
    // - Less demanding than ψ₃ (enterprise level)
    // "70/30 split" is also cognitively intuitive for users.
    //
    // Philosophy: "70% responsible for yourself, 30% influenced by connections"
    // Range: 0.0 (fully relational) to 1.0 (fully internal)
    // ========================================================================
    this.GAMMA = 0.7;

    // ========================================================================
    // DELTA (δ): The Axis Coherence Factor (Shadow Integration)
    // ========================================================================
    // Blends local face health with the health of the polar opposite (shadow).
    // Formula: E_f = δ × E_local + (1-δ) × E_opposing
    //
    // DEFAULT: 0.9 (approximately ψ₅ = 0.910)
    //
    // PHI DERIVATION NOTE:
    // Natural PHI choices: ψ₄ = 0.854 (15% shadow) or ψ₅ = 0.910 (9% shadow)
    // 0.9 ≈ ψ₅ = 1 - φ^-5 = 0.90983... (within 1% of golden value)
    // This allows 10% shadow influence - enough to acknowledge polarity
    // without overwhelming local reality.
    //
    // Philosophy: "90% local focus, 10% shadow acknowledgment"
    // Range: 0.0 (full non-duality) to 1.0 (no shadow awareness)
    // ========================================================================
    this.DELTA = 0.9;

    // ========================================================================
    // KAPPA (κ): Sensitivity Amplifier (S-Curve Steepness)
    // ========================================================================
    // Controls the "emotional responsiveness" via logistic S-curve steepness.
    // Formula: f(x) = 1 / (1 + e^(-κ × (x - 0.5)))
    //
    // DEFAULT: 2.0 (balanced responsiveness)
    //
    // PHI DERIVATION NOTE:
    // Unlike other parameters, KAPPA is NOT a 0-1 proportion.
    // It controls curve steepness (range typically 1.0 to 6.0).
    // 2.0 represents the musical "octave" relationship (doubling).
    // While not directly PHI-derived, 2.0 has harmonic significance:
    // - In music, octave = 2:1 frequency ratio (fundamental harmony)
    // - φ² = 2.618, so 2.0 = φ² × φ^-1 (golden relationships)
    //
    // Philosophy: "Balanced awareness - neither panic nor numbness"
    // Range: 1.0 (gentle curve) to 6.0 (sharp, reactive curve)
    // ========================================================================
    this.KAPPA = 2.0;

    // ========================================================================
    // PHI-DERIVED HARMONIC PARAMETERS (Sacred Geometry Foundation)
    // ========================================================================

    // eta (Eta): Resonance Amplifier - "How much does harmony amplify energy?"
    // Default: phi^-2 = 0.382 (38.2% maximum boost for perfect pentagram resonance)
    // Philosophy: "Coherent systems can amplify their energy by up to 38.2%"
    // Range: 0.0 (no boost) to 1.0 (100% boost)
    this.ETA = PHI_HARMONICS.PHI_INV_2;  // 0.381966... = 38.2%

    // zeta (Zeta): Zenith Gradient - "How much harder is each growth stage?"
    // Default: phi^-2 / 6 = 0.0637 (6.37% penalty per octave level)
    // Philosophy: "Each octave of maturity raises expectations by 6.37%"
    // At Octave 7: total penalty = phi^-2 = 38.2% (symmetric with max boost)
    // Range: 0.0 (no penalty) to 0.15 (15% per octave)
    this.ZETA = PHI_HARMONICS.PHI_INV_2 / 6;  // 0.06366... = 6.37%

    // theta (Theta): Transcendence Threshold - "When is a face ready for next octave?"
    // Default: phi^-1 = 0.618 (61.8% progress needed to advance)
    // Philosophy: "The Golden Threshold - when you've integrated 61.8%, you're ready"
    // Range: 0.5 (easy advancement) to 0.9 (demanding advancement)
    this.THETA = PHI_HARMONICS.PHI_INV_1;  // 0.618033... = 61.8%
  }

  /**
   * Apply sensitivity amplifier using logistic function
   * Transforms a 0-1 score into an S-curve response
   *
   * Formula: 1 / (1 + e^(-kappa*(x-0.5)))
   *
   * Low KAPPA (1-2): Gentle, forgiving curve
   * High KAPPA (4+): Sharp, responsive curve
   *
   * @param {number} score - Raw score between 0 and 1
   * @returns {number} - Transformed score between 0 and 1
   */
  applySensitivityAmplifier(score) {
    return 1 / (1 + Math.exp(-this.KAPPA * (score - 0.5)));
  }

  // ========================================================================
  // TUNING TEMPLATES: Pre-configured Organizational Archetypes
  // ========================================================================

  /**
   * STARTUP MODE: Forgiving, Growth-Focused
   *
   * Philosophy: "Every step forward is a victory. We celebrate progress."
   *
   * - Lower resonance amplification (still rewarding harmony, but gentler)
   * - Minimal octave penalty (early stages aren't punished)
   * - Lower advancement threshold (move fast, learn fast)
   * - Higher synergy belief (startups need to believe 1+1=3)
   * - Gentle sensitivity curve (don't panic at every fluctuation)
   *
   * Best for: Early-stage startups, new teams, turnaround situations
   *
   * @static
   * @returns {TuningConfig} Configuration for startup mode
   */
  static startupMode() {
    const config = new TuningConfig();

    // Philosophical: "We believe in magic" - high synergy faith
    config.ALPHA = 0.4;   // More multiplicative synergy belief

    // Structural: Maintain symmetry
    config.BETA = 0.5;    // Perfect symmetry

    // Internal/External: "We need our relationships"
    config.GAMMA = 0.6;   // More relational dependency

    // Shadow Awareness: "We're focused on building, not shadows"
    config.DELTA = 0.95;  // Very local focus

    // Sensitivity: "Stay calm, we're learning"
    config.KAPPA = 1.5;   // Gentle, forgiving curve

    // Resonance: "Harmony helps, but we're still learning to dance"
    config.ETA = 1 / Math.pow((1 + Math.sqrt(5)) / 2, 3);  // phi^-3 = 23.6% max boost

    // Zenith: "Early stages are equally valued"
    config.ZETA = 0.03;   // 3% per octave (18% max at Octave 7)

    // Threshold: "Move forward when you're half-ready"
    config.THETA = 0.5;   // 50% threshold to advance

    return config;
  }

  /**
   * ENTERPRISE MODE: Demanding, Excellence-Focused
   *
   * Philosophy: "Excellence is the expectation. Harmony is non-negotiable."
   *
   * - Maximum resonance amplification (harmony is rewarded greatly)
   * - Full octave penalty (maturity demands more)
   * - High advancement threshold (only advance when truly ready)
   * - Pragmatic synergy (trust proven methods)
   * - Sharp sensitivity curve (responsive to changes)
   *
   * Best for: Mature organizations, public companies, high-stakes environments
   *
   * @static
   * @returns {TuningConfig} Configuration for enterprise mode
   */
  static enterpriseMode() {
    const phi = (1 + Math.sqrt(5)) / 2;
    const config = new TuningConfig();

    // Philosophical: "Trust what we can measure"
    config.ALPHA = 0.7;   // More arithmetic (pragmatic)

    // Structural: Perfect balance
    config.BETA = 0.5;    // Perfect symmetry

    // Internal/External: "Own your results"
    config.GAMMA = 0.8;   // High internal accountability

    // Shadow Awareness: "Know your shadows"
    config.DELTA = 0.8;   // More shadow awareness

    // Sensitivity: "We notice everything"
    config.KAPPA = 4.0;   // Sharp, responsive curve

    // Resonance: "Harmony is rewarded at full phi power"
    config.ETA = 1 / (phi * phi);  // phi^-2 = 38.2% max boost

    // Zenith: "Maturity demands excellence"
    config.ZETA = 1 / (phi * phi) / 6;  // 6.37% per octave

    // Threshold: "Golden threshold - advance only when integrated"
    config.THETA = 1 / phi;  // phi^-1 = 61.8%

    return config;
  }

  /**
   * BALANCED MODE: Sacred Geometry Defaults
   *
   * Philosophy: "Trust the golden ratio. Let phi guide the way."
   *
   * All parameters derive from phi (golden ratio) for mathematical coherence
   * and self-similarity with the dodecahedral structure.
   *
   * Best for: General use, organizations seeking holistic balance
   *
   * @static
   * @returns {TuningConfig} Default configuration using phi-derived values
   */
  static balancedMode() {
    return new TuningConfig();  // Default constructor uses phi-derived values
  }

  /**
   * NON-DUAL MODE: Shadow-Integrated, Relational
   *
   * Philosophy: "We are our shadows. Separation is illusion."
   *
   * - Equal weight to self and relationships
   * - Deep shadow integration
   * - Maximum symmetry everywhere
   * - Balanced responsiveness
   *
   * Best for: Highly evolved organizations, spiritual communities,
   * holacratic structures, consciousness-focused enterprises
   *
   * @static
   * @returns {TuningConfig} Configuration for non-dual mode
   */
  static nonDualMode() {
    const phi = (1 + Math.sqrt(5)) / 2;
    const config = new TuningConfig();

    // Philosophical: "Synergy and structure are equally valid"
    config.ALPHA = 0.5;   // Perfect blend

    // Structural: "All influence flows equally"
    config.BETA = 0.5;    // Perfect symmetry

    // Internal/External: "I am my relationships"
    config.GAMMA = 0.5;   // Equal internal/external weight

    // Shadow Awareness: "I am my shadow"
    config.DELTA = 0.5;   // Full non-duality

    // Sensitivity: "Balanced awareness"
    config.KAPPA = 3.0;   // Moderate responsiveness

    // Resonance: "Harmony naturally amplifies"
    config.ETA = 1 / (phi * phi);  // phi^-2 = 38.2%

    // Zenith: "All stages are sacred"
    config.ZETA = 0.05;   // Gentle 5% per octave

    // Threshold: "The golden mean"
    config.THETA = 1 / phi;  // phi^-1 = 61.8%

    return config;
  }

  /**
   * Get a human-readable explanation of the current tuning philosophy
   * @returns {Object} Explanation of current settings
   */
  getPhilosophy() {
    const phi = (1 + Math.sqrt(5)) / 2;
    const phi_inv_1 = 1 / phi;
    const phi_inv_2 = 1 / (phi * phi);
    const phi_inv_3 = 1 / Math.pow(phi, 3);

    return {
      alpha: {
        value: this.ALPHA,
        symbol: 'alpha',
        name: 'Synergy Blend',
        meaning: this.ALPHA < 0.4 ? 'Magical Thinking (1+1=3)' :
                 this.ALPHA > 0.7 ? 'Pragmatic Realism' :
                 'Grounded Magic'
      },
      beta: {
        value: this.BETA,
        symbol: 'beta',
        name: 'Intersection Blend',
        meaning: Math.abs(this.BETA - 0.5) < 0.05 ? 'Perfect Symmetry' :
                 this.BETA > 0.5 ? 'Forward-Biased Flow' :
                 'Backward-Biased Flow'
      },
      gamma: {
        value: this.GAMMA,
        symbol: 'gamma',
        name: 'Ball & Pillars',
        meaning: this.GAMMA < 0.4 ? 'Radically Relational' :
                 this.GAMMA > 0.7 ? 'Radically Accountable' :
                 'Balanced Ecosystem'
      },
      delta: {
        value: this.DELTA,
        symbol: 'delta',
        name: 'Shadow Factor',
        meaning: this.DELTA < 0.6 ? 'Deep Non-Duality' :
                 this.DELTA > 0.85 ? 'Local Focus' :
                 'Shadow Aware'
      },
      kappa: {
        value: this.KAPPA,
        symbol: 'kappa',
        name: 'Sensitivity',
        meaning: this.KAPPA < 2 ? 'Gentle & Forgiving' :
                 this.KAPPA > 4 ? 'Highly Reactive' :
                 'Balanced Responsiveness'
      },
      eta: {
        value: this.ETA,
        symbol: 'eta',
        name: 'Resonance Amplifier',
        meaning: `${(this.ETA * 100).toFixed(1)}% max harmonic boost`,
        phiRelation: Math.abs(this.ETA - phi_inv_2) < 0.001 ? 'phi^-2 (Sacred)' :
                     Math.abs(this.ETA - phi_inv_3) < 0.001 ? 'phi^-3 (Gentle)' :
                     'Custom'
      },
      zeta: {
        value: this.ZETA,
        symbol: 'zeta',
        name: 'Zenith Gradient',
        meaning: `${(this.ZETA * 100).toFixed(2)}% per octave`,
        maxPenalty: `${(this.ZETA * 6 * 100).toFixed(1)}% at Octave 7`
      },
      theta: {
        value: this.THETA,
        symbol: 'theta',
        name: 'Transcendence Threshold',
        meaning: `${(this.THETA * 100).toFixed(1)}% to advance`,
        phiRelation: Math.abs(this.THETA - phi_inv_1) < 0.001 ? 'phi^-1 (Golden)' :
                     this.THETA < 0.55 ? 'Low Bar' :
                     'Custom'
      }
    };
  }

  /**
   * Export configuration to JSON
   * @returns {Object} JSON-serializable configuration
   */
  toJSON() {
    return {
      alpha: this.ALPHA,
      beta: this.BETA,
      gamma: this.GAMMA,
      delta: this.DELTA,
      kappa: this.KAPPA,
      eta: this.ETA,
      zeta: this.ZETA,
      theta: this.THETA
    };
  }

  /**
   * Create TuningConfig from JSON
   * @param {Object} json - Configuration object
   * @returns {TuningConfig} New configuration instance
   */
  static fromJSON(json) {
    const config = new TuningConfig();
    if (json.alpha !== undefined) config.ALPHA = json.alpha;
    if (json.beta !== undefined) config.BETA = json.beta;
    if (json.gamma !== undefined) config.GAMMA = json.gamma;
    if (json.delta !== undefined) config.DELTA = json.delta;
    if (json.kappa !== undefined) config.KAPPA = json.kappa;
    if (json.eta !== undefined) config.ETA = json.eta;
    if (json.zeta !== undefined) config.ZETA = json.zeta;
    if (json.theta !== undefined) config.THETA = json.theta;
    return config;
  }
}

// ============================================================================
// Backward compatibility: export to window for IIFE modules
// ============================================================================
if (typeof window !== 'undefined') {
  window.TuningConfig = TuningConfig;
}

console.log('   TuningConfig module loaded');
