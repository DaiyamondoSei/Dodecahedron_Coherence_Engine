/**
 * ========================================
 * QUANNEX - Serverless POC Edition
 * ========================================
 *
 * A self-contained, browser-based organizational coherence engine.
 * No backend server required - all processing happens in the browser.
 *
 * Architecture:
 * - CSV Parser: Loads and parses CSV data files
 * - Data Models: KPI, Face, Edge, Vertex classes
 * - Math Engine: Coherence calculations
 * - API Interface: Simple methods for UI to call
 */

import { OrganizationalCoherenceEngine } from './advanced/index.js';

// ========================================
// UTILITY: CSV Parser
// ========================================

/**
 * Parse CSV text into array of objects
 * @param {string} csvText - Raw CSV content
 * @returns {Array<Object>} Parsed data with headers as keys
 */
function parseCSV(csvText) {
  const lines = csvText.split('\n').filter(line => line.trim());
  if (lines.length === 0) return [];

  const headers = lines[0].split(',').map(h => h.trim());
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const row = {};

    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });

    data.push(row);
  }

  return data;
}

// ========================================
// CONFIGURATION: Tuning Constants
// ========================================

/**
 * The "Conductor's Settings" - Tuning constants from Reference Models
 *
 * All constants are grounded in φ (phi) for mathematical coherence with
 * the dodecahedral geometry. The dodecahedron is constructed from φ,
 * therefore all tuning parameters derive from φ for self-similarity.
 */
class TuningConfig {
  constructor() {
    // ════════════════════════════════════════════════════════════════
    // CORE PHILOSOPHICAL DIALS (Exposed in Harmonic Tuner)
    // ════════════════════════════════════════════════════════════════

    // α (Alpha): The Synergy Blend
    // Blends arithmetic and multiplicative synergy for Star Pairs
    // 0.6 = "We believe in synergy, but ground it in reality"
    this.ALPHA = 0.6;

    // β (Beta): The Intersection Blend
    // Balances influence of adjacent star-pairs on intersection nodes
    // 0.5 = Perfect symmetry (default)
    this.BETA = 0.5;

    // γ (Gamma): The "Ball and Pillars" Blend
    // Balances internal health (Ball) vs relational health (Pillars)
    // 0.7 = "A department is 70% responsible for itself, 30% influenced by connections"
    this.GAMMA = 0.7;

    // δ (Delta): The Axis Coherence Factor
    // Blends local health with the health of the polar opposite (shadow)
    // 0.9 = "We focus primarily on local reality, but acknowledge the shadow"
    this.DELTA = 0.9;

    // κ (Kappa): Sensitivity Amplifier
    // Controls the "emotional responsiveness" of the final score
    // 2.0 = Balanced responsiveness (Reference model suggests 2.0, logic sometimes uses 4.0)
    this.KAPPA = 2.0;

    // ════════════════════════════════════════════════════════════════
    // PHI-DERIVED HARMONIC PARAMETERS (Sacred Geometry Foundation)
    // ════════════════════════════════════════════════════════════════

    // η (Eta): Resonance Amplifier - "How much does harmony amplify energy?"
    // Default: φ⁻² = 0.382 (38.2% maximum boost for perfect pentagram resonance)
    // Philosophy: "Coherent systems can amplify their energy by up to 38.2%"
    // Range: 0.0 (no boost) to 1.0 (100% boost)
    this.ETA = PHI_HARMONICS.PHI_INV_2;  // 0.381966... ≈ 38.2%

    // ζ (Zeta): Zenith Gradient - "How much harder is each growth stage?"
    // Default: φ⁻² ÷ 6 ≈ 0.0637 (6.37% penalty per octave level)
    // Philosophy: "Each octave of maturity raises expectations by 6.37%"
    // At Octave 7: total penalty = φ⁻² = 38.2% (symmetric with max boost)
    // Range: 0.0 (no penalty) to 0.15 (15% per octave)
    this.ZETA = PHI_HARMONICS.PHI_INV_2 / 6;  // 0.06366... ≈ 6.37%

    // θ (Theta): Transcendence Threshold - "When is a face ready for next octave?"
    // Default: φ⁻¹ = 0.618 (61.8% progress needed to advance)
    // Philosophy: "The Golden Threshold - when you've integrated 61.8%, you're ready"
    // Range: 0.5 (easy advancement) to 0.9 (demanding advancement)
    this.THETA = PHI_HARMONICS.PHI_INV_1;  // 0.618033... ≈ 61.8%
  }

  /**
   * Apply sensitivity amplifier using logistic function
   * Transforms a 0-1 score into an S-curve response
   *
   * Formula: 1 / (1 + e^(-κ*(x-0.5)))
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

  // ════════════════════════════════════════════════════════════════
  // TUNING TEMPLATES: Pre-configured Organizational Archetypes
  // ════════════════════════════════════════════════════════════════

  /**
   * 🌱 STARTUP MODE: Forgiving, Growth-Focused
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
    config.ETA = 1 / Math.pow((1 + Math.sqrt(5)) / 2, 3);  // φ⁻³ ≈ 23.6% max boost

    // Zenith: "Early stages are equally valued"
    config.ZETA = 0.03;   // 3% per octave (18% max at Octave 7)

    // Threshold: "Move forward when you're half-ready"
    config.THETA = 0.5;   // 50% threshold to advance

    return config;
  }

  /**
   * 🏢 ENTERPRISE MODE: Demanding, Excellence-Focused
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
    config.ETA = 1 / (phi * phi);  // φ⁻² ≈ 38.2% max boost

    // Zenith: "Maturity demands excellence"
    config.ZETA = 1 / (phi * phi) / 6;  // 6.37% per octave

    // Threshold: "Golden threshold - advance only when integrated"
    config.THETA = 1 / phi;  // φ⁻¹ ≈ 61.8%

    return config;
  }

  /**
   * ⚖️ BALANCED MODE: Sacred Geometry Defaults
   *
   * Philosophy: "Trust the golden ratio. Let phi guide the way."
   *
   * All parameters derive from φ (golden ratio) for mathematical coherence
   * and self-similarity with the dodecahedral structure.
   *
   * Best for: General use, organizations seeking holistic balance
   */
  static balancedMode() {
    return new TuningConfig();  // Default constructor uses phi-derived values
  }

  /**
   * ∞ NON-DUAL MODE: Shadow-Integrated, Relational
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
    config.ETA = 1 / (phi * phi);  // φ⁻² ≈ 38.2%

    // Zenith: "All stages are sacred"
    config.ZETA = 0.05;   // Gentle 5% per octave

    // Threshold: "The golden mean"
    config.THETA = 1 / phi;  // φ⁻¹ ≈ 61.8%

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
        symbol: 'α',
        name: 'Synergy Blend',
        meaning: this.ALPHA < 0.4 ? 'Magical Thinking (1+1=3)' :
                 this.ALPHA > 0.7 ? 'Pragmatic Realism' :
                 'Grounded Magic'
      },
      beta: {
        value: this.BETA,
        symbol: 'β',
        name: 'Intersection Blend',
        meaning: Math.abs(this.BETA - 0.5) < 0.05 ? 'Perfect Symmetry' :
                 this.BETA > 0.5 ? 'Forward-Biased Flow' :
                 'Backward-Biased Flow'
      },
      gamma: {
        value: this.GAMMA,
        symbol: 'γ',
        name: 'Ball & Pillars',
        meaning: this.GAMMA < 0.4 ? 'Radically Relational' :
                 this.GAMMA > 0.7 ? 'Radically Accountable' :
                 'Balanced Ecosystem'
      },
      delta: {
        value: this.DELTA,
        symbol: 'δ',
        name: 'Shadow Factor',
        meaning: this.DELTA < 0.6 ? 'Deep Non-Duality' :
                 this.DELTA > 0.85 ? 'Local Focus' :
                 'Shadow Aware'
      },
      kappa: {
        value: this.KAPPA,
        symbol: 'κ',
        name: 'Sensitivity',
        meaning: this.KAPPA < 2 ? 'Gentle & Forgiving' :
                 this.KAPPA > 4 ? 'Highly Reactive' :
                 'Balanced Responsiveness'
      },
      eta: {
        value: this.ETA,
        symbol: 'η',
        name: 'Resonance Amplifier',
        meaning: `${(this.ETA * 100).toFixed(1)}% max harmonic boost`,
        phiRelation: Math.abs(this.ETA - phi_inv_2) < 0.001 ? 'φ⁻² (Sacred)' :
                     Math.abs(this.ETA - phi_inv_3) < 0.001 ? 'φ⁻³ (Gentle)' :
                     'Custom'
      },
      zeta: {
        value: this.ZETA,
        symbol: 'ζ',
        name: 'Zenith Gradient',
        meaning: `${(this.ZETA * 100).toFixed(2)}% per octave`,
        maxPenalty: `${(this.ZETA * 6 * 100).toFixed(1)}% at Octave 7`
      },
      theta: {
        value: this.THETA,
        symbol: 'θ',
        name: 'Transcendence Threshold',
        meaning: `${(this.THETA * 100).toFixed(1)}% to advance`,
        phiRelation: Math.abs(this.THETA - phi_inv_1) < 0.001 ? 'φ⁻¹ (Golden)' :
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

// ========================================
// CONSTANTS: Phi-Harmonic Values (Sacred Geometry)
// ========================================

/**
 * Golden Ratio (φ) derived constants for all harmonic calculations.
 * The dodecahedron is constructed from φ, therefore ALL mathematical
 * constants in the system derive from φ for self-similarity at every level.
 *
 * Reference: Master Plan "φ-Harmonic Constant System (AUTHORITATIVE)"
 */
const PHI = (1 + Math.sqrt(5)) / 2;  // Source of truth: 1.618033988749895

const PHI_HARMONICS = {
  // Core phi values
  PHI: PHI,                              // 1.618033988749895
  PHI_2: PHI * PHI,                      // 2.618033988749895

  // Inverse powers of phi (0 < x < 1)
  PHI_INV_1: 1 / PHI,                    // 0.618033988749895 (high/creative)
  PHI_INV_2: 1 / (PHI * PHI),            // 0.381966011250105 (low/receptive)
  PHI_INV_3: 1 / Math.pow(PHI, 3),       // 0.236067977499790 (very low, CV lambda)
  PHI_INV_4: 1 / Math.pow(PHI, 4),       // 0.145898033750315 (minimal threshold)

  // Psi derived values (1 - phi^-n)
  PSI_3: 1 - 1 / Math.pow(PHI, 3),       // 0.763932022500210 (very high)
  PSI_4: 1 - 1 / Math.pow(PHI, 4),       // 0.854101966249685 (near maximum)

  // Numerical stability
  EPSILON: 1e-10,

  // Semantic aliases for domain-specific usage
  get CV_LAMBDA() { return this.PHI_INV_3; },      // Variance penalty coefficient
  get BREATH_BASE() { return this.PHI; },          // Log base for breath ratio
  get MASTERY_THRESHOLD() { return this.PSI_3; },  // 76.4% mastery before octave advance

  // Curvature parameters for KPI normalization (κ)
  // survival: sublinear curve (forgiving early gains)
  // growth: superlinear curve (rewards excellence)
  // completion: linear (default)
  CURVATURE: {
    survival: 1 / PHI,    // 0.618 - asymptotic, forgiving
    growth: PHI,          // 1.618 - exponential, rewarding
    completion: 1.0       // linear progression
  }
};

// Freeze to prevent accidental mutation
Object.freeze(PHI_HARMONICS);
Object.freeze(PHI_HARMONICS.CURVATURE);

// Export for global access (used by other modules)
if (typeof window !== 'undefined') {
  window.PHI_HARMONICS = PHI_HARMONICS;
}

// ========================================
// MODEL: KPI (Key Performance Indicator)
// ========================================

/**
 * Represents a single KPI with normalization and scoring logic
 */
class KPI {
  constructor(config) {
    this.id = config.id || '';
    this.name = config.name || '';
    this.value = parseFloat(config.value) || 0;
    this.weight = parseFloat(config.weight) || 1.0;
    this.direction = config.direction || '↑'; // ↑, ↓, or Band

    // Normalization parameters
    this.targetMin = parseFloat(config.targetMin) || 0;
    this.targetIdeal = parseFloat(config.targetIdeal) || 100;
    this.healthyMin = parseFloat(config.healthyMin) || this.targetMin;
    this.healthyMax = parseFloat(config.healthyMax) || this.targetIdeal;
    this.absoluteMax = parseFloat(config.absoluteMax) || this.targetIdeal * 2;

    // Metadata
    this.faceId = config.faceId || null;
    this.element = config.element || null; // Earth, Water, Fire, Air, Ether

    // Metric type for κ curvature (survival, growth, or completion)
    // survival: φ^-1 (0.618) - forgiving, rewards early progress
    // growth: φ (1.618) - demanding, rewards excellence
    // completion: 1.0 - linear (default)
    this.metricType = config.metricType || 'completion';
  }

  /**
   * Calculate normalized score (0 to 1) based on KPI direction
   * Then apply κ curvature based on metric type
   */
  get normalizedScore() {
    // Get linear score based on direction
    let linearScore;
    switch (this.direction) {
      case '↑':
        linearScore = this.normalizeUp();
        break;
      case '↓':
        linearScore = this.normalizeDown();
        break;
      case 'Band':
        linearScore = this.normalizeBand();
        break;
      default:
        linearScore = this.normalizeUp();
    }

    // Apply κ curvature based on metric type
    // Uses PHI_HARMONICS.CURVATURE for phi-derived values
    const kappa = (typeof PHI_HARMONICS !== 'undefined' && PHI_HARMONICS.CURVATURE)
      ? (PHI_HARMONICS.CURVATURE[this.metricType] || 1.0)
      : 1.0;

    // Apply curvature: score^kappa
    // survival (κ=0.618): 0.5^0.618 = 0.65 (forgiving)
    // growth (κ=1.618): 0.5^1.618 = 0.33 (demanding)
    return Math.pow(linearScore, kappa);
  }

  /**
   * ↑ (Up is Better): More is better - linear increase
   */
  normalizeUp() {
    if (this.value >= this.targetIdeal) return 1.0;
    if (this.value <= this.targetMin) return 0.0;
    return (this.value - this.targetMin) / (this.targetIdeal - this.targetMin);
  }

  /**
   * ↓ (Down is Better): Less is better - linear decrease
   */
  normalizeDown() {
    if (this.value <= this.targetMin) return 1.0;
    if (this.value >= this.absoluteMax) return 0.0;
    return 1 - ((this.value - this.targetMin) / (this.absoluteMax - this.targetMin));
  }

  /**
   * Band (Plateau): Sweet spot between healthyMin and healthyMax
   */
  normalizeBand() {
    // Perfect plateau: within healthy range
    if (this.value >= this.healthyMin && this.value <= this.healthyMax) {
      return 1.0;
    }

    // Below plateau: linear rise from targetMin to healthyMin
    if (this.value < this.healthyMin) {
      if (this.value <= this.targetMin) return 0.0;
      return (this.value - this.targetMin) / (this.healthyMin - this.targetMin);
    }

    // Above plateau: linear decline from healthyMax to absoluteMax
    if (this.value >= this.absoluteMax) return 0.0;
    return 1 - ((this.value - this.healthyMax) / (this.absoluteMax - this.healthyMax));
  }

  /**
   * Get weighted score (normalized score × weight)
   */
  get weightedScore() {
    return this.normalizedScore * this.weight;
  }
}

// ========================================
// MODEL: Face (Organizational Domain)
// ========================================

/**
 * Represents one of the 12 faces of the dodecahedron
 * Each face is an organizational domain (e.g., Financial Capital, Human Capital)
 */
class Face {
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
   * Formula: s = α * average(k1, k2) + (1-α) * (k1 * k2)
   * Connects non-adjacent elements (The pentagram lines)
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
   * Formula: p = β * s_prev + (1-β) * s_next
   * Where star pairs cross
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
   * The harmonic core - average of intersection nodes
   */
  calculateCenterComposite() {
    if (this.intersectionNodes.length === 0) return 0;
    const sum = this.intersectionNodes.reduce((a, b) => a + b, 0);
    this.centerComposite = sum / this.intersectionNodes.length;
    return this.centerComposite;
  }

  /**
   * 4. Calculate Pillar Symmetry (S_f)
   * Measures variance between pillars (1.0 = perfect symmetry, 0.0 = chaos)
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
   * Measures how well the 5 elemental KPIs work together in harmony
   *
   * Philosophy: Resonance is highest when connected elements have similar values
   * The pentagram connects non-adjacent vertices, creating the "star within"
   *
   * Returns: 0.0 (total dissonance) to 1.0 (perfect harmony)
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
    // (5 vertices × 2 connections each = 10, but each edge counted twice = 5 unique edges)
    // We count all 10 for consistency with original formula
    this._harmonicResonance = totalResonance / 10;
    return this._harmonicResonance;
  }

  /**
   * Get harmonic resonance (cached)
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
   * Formula: progress = localCoherence × (1 - ζ × (currentOctave - 1))
   *
   * Where ζ (Zeta) = φ⁻² ÷ 6 ≈ 6.37% (the Zenith Gradient)
   *
   * Results (using phi-derived constants):
   * - Octave 1 (Survival):      multiplier = 1.000 (no penalty)
   * - Octave 2 (Structure):     multiplier = 0.936 (6.4% harder)
   * - Octave 3 (Relationships): multiplier = 0.873 (12.7% harder)
   * - Octave 4 (Creativity):    multiplier = 0.809 (19.1% harder)
   * - Octave 5 (Expression):    multiplier = 0.745 (25.5% harder)
   * - Octave 6 (Vision):        multiplier = 0.682 (31.8% harder)
   * - Octave 7 (Radiance):      multiplier = 0.618 (38.2% harder = φ⁻²)
   *
   * Beautiful symmetry: Max penalty (φ⁻²) = Max boost (φ⁻²)
   */
  calculateOctaveProgress() {
    // Get base coherence (local coherence with harmonic boost already applied)
    if (this._localCoherence === null) {
      this.calculateLocalCoherence();
    }

    // Apply zenith gradient (higher octaves are harder to master)
    // Uses ZETA (ζ) = φ⁻² ÷ 6 per octave step
    const zenithMultiplier = 1 - (this.tuning.ZETA * (this.currentOctave - 1));

    // Calculate progress toward transcendence
    this._octaveCoherence = this._localCoherence * zenithMultiplier;
    return this._octaveCoherence;
  }

  // Alias for backward compatibility
  calculateOctaveCoherence() {
    return this.calculateOctaveProgress();
  }

  /**
   * Get octave progress (cached)
   * Represents progress toward the next octave level
   */
  get octaveProgress() {
    if (this._octaveCoherence === null) {
      this._octaveCoherence = this.calculateOctaveProgress();
    }
    return this._octaveCoherence;
  }

  // Alias for backward compatibility
  get octaveCoherence() {
    return this.octaveProgress;
  }

  /**
   * Check if this face is ready to transcend to the next octave
   *
   * Uses θ (Theta) = φ⁻¹ ≈ 61.8% as the Golden Threshold
   * Philosophy: "When you've integrated 61.8%, you're ready to transcend"
   *
   * At Octave 7, there's no "next" octave - you've reached Radiance.
   * Progress at Octave 7 represents depth of mastery, not advancement.
   */
  isReadyForNextOctave() {
    return this.octaveProgress >= this.tuning.THETA && this.currentOctave < 7;
  }

  /**
   * Get octave status for display
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
   * Blends the Ball (Primary KPI) with the Pillars (Relational Health)
   * Then applies Harmonic Resonance Boost from pentagram geometry
   *
   * Formula: E_local_base = γ × Ball + (1-γ) × Pillars_Avg
   *          E_local = E_local_base × (1.0 + η × R_harmonic)
   *
   * Where η (Eta) = φ⁻² ≈ 38.2% (the Resonance Amplifier)
   * Philosophy: "Coherent systems amplify their energy through harmony"
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

    // Apply Harmonic Resonance Boost using Eta (φ⁻² ≈ 38.2% max boost)
    // When elements are in resonance, the whole becomes greater than the sum of parts
    // This is grounded in sacred geometry: φ⁻² is the "golden complement"
    const harmonicBoost = 1.0 + (this.tuning.ETA * this._harmonicResonance);
    this._localCoherence = Math.min(1.0, baseCoherence * harmonicBoost); // Cap at 1.0

    return this._localCoherence;
  }

  /**
   * 6. Calculate Final Axis-Informed Energy (E_f)
   * The "Grand Synthesis" - blends local score with opposing face
   * Formula: E_f = δ * E_local + (1-δ) * E_opposing
   */
  calculateAxisInformedEnergy(opposingFaceEnergy) {
    if (this._localCoherence === null) this.calculateLocalCoherence();

    const local = this._localCoherence;
    const opposing = opposingFaceEnergy || 0; // If no opposing face (rare), assume 0 impact or handle gracefully

    // The Axis Coherence Factor (Delta)
    // If Delta is 0.9, we are 90% local, 10% shadow
    this._faceEnergy = (this.tuning.DELTA * local) + ((1 - this.tuning.DELTA) * opposing);

    return this._faceEnergy;
  }

  /**
   * Get face energy (returns final axis-informed if available, else local)
   */
  get faceEnergy() {
    if (this._faceEnergy !== null) return this._faceEnergy;
    if (this._localCoherence !== null) return this._localCoherence;
    return this.calculateLocalCoherence();
  }

  /**
   * Invalidate cache when KPIs change
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

// ========================================
// MODEL: Edge (Narrative Tension)
// ========================================

/**
 * Represents a connection between two faces
 * Models the "Narrative Tension" or relationship archetype
 */
class Edge {
  constructor(config) {
    this.id = config.id || '';
    this.faceAId = parseInt(config.faceAId) || 0;
    this.faceBId = parseInt(config.faceBId) || 0;
    this.archetype = config.archetype || '';
    this.description = config.description || '';

    // State
    this.tension = 0; // 0 (Dissonance) to 1 (Resonance)
    this.status = 'Neutral';
    this.breathRatio = 0;
    this.flowDirection = 'balanced';
    this.element = config.element || 'Ether';
  }

  /**
   * Calculate tension based on the energy of connected faces
   * @param {Face} faceA 
   * @param {Face} faceB 
   */
  calculateTension(faceA, faceB) {
    if (!faceA || !faceB) return 0;

    const e1 = faceA.faceEnergy;
    const e2 = faceB.faceEnergy;

    // 1. Energy Delta (Difference)
    const delta = Math.abs(e1 - e2);

    // 2. Breath Ratio (Flow Direction)
    // Positive = expansion (A to B), Negative = contraction (B to A)
    // Normalized to -1 to +1 range
    this.breathRatio = Math.max(-1.0, Math.min(1.0, (e2 - e1) * 2));

    if (Math.abs(this.breathRatio) < 0.1) this.flowDirection = 'balanced';
    else this.flowDirection = this.breathRatio > 0 ? 'expansion' : 'contraction';

    // 3. Elemental Multiplier
    const multipliers = {
      'Fire': 1.3,    // Fire amplifies tension and flow
      'Water': 0.9,   // Water smooths and dampens
      'Earth': 0.8,   // Earth stabilizes and grounds
      'Air': 1.1,     // Air accelerates flow
      'Ether': 1.0    // Ether is neutral/balanced
    };
    const multiplier = multipliers[this.element] || 1.0;

    // 4. Harmonic Resonance (Similarity)
    if (e1 > 0.6 && e2 > 0.6) {
      this.tension = 0.9; // High Synergy
      this.status = 'Synergetic';
    } else if (e1 < 0.4 && e2 < 0.4) {
      this.tension = 0.2; // Depleted
      this.status = 'Depleted';
    } else {
      // Base tension from delta, modulated by element
      const baseTension = 0.5 + (delta / 2);
      this.tension = Math.min(1.0, Math.max(0.0, baseTension * multiplier));
      this.status = delta > 0.4 ? 'Flowing' : 'Stable';
    }

    return this.tension;
  }
}

// ========================================
// MODEL: Vertex (Triadic Synergy)
// ========================================

/**
 * Represents the intersection of three faces (The Vortex)
 * Models the synergy where three domains meet.
 *
 * FIXED: Constructor no longer tries to calculate with undefined 'energies'.
 * Calculation is deferred to calculateVortexEnergy(faces) method.
 */
class Vertex {
  constructor(config) {
    this.id = config.id || '';
    this.faceIds = config.faceIds || []; // Array of 3 face IDs
    this.name = config.name || '';
    this.archetype = config.archetype || '';

    // Cache for calculated values (initialized as null)
    this._vortexStrength = null;
    this._vortexDirection = null;
    this._coherence = null;
  }

  /**
   * Calculate all vortex metrics based on converging face energies
   * Called by recalculate() with the actual Face objects
   *
   * @param {Array<Face>} faces - The 3 faces meeting at this vertex
   * @returns {number} Vortex strength (0-1)
   */
  calculateVortexEnergy(faces) {
    if (!faces || faces.length !== 3) {
      console.warn(`Vertex ${this.id} doesn't have exactly 3 faces`);
      this._vortexStrength = 0;
      this._vortexDirection = 0;
      this._coherence = 0;
      return 0;
    }

    // Get face energies
    const energies = faces.map(f => f.faceEnergy || 0);
    const [f1, f2, f3] = energies;

    // 1. Calculate mean energy
    const mean = (f1 + f2 + f3) / 3;

    // 2. Calculate variance and standard deviation
    const variance = ((f1 - mean) ** 2 + (f2 - mean) ** 2 + (f3 - mean) ** 2) / 3;
    const stdDev = Math.sqrt(variance);

    // 3. Vortex Strength: 70% variance contribution, 30% mean energy
    // Normalized stdDev (max possible ~0.577 for values 0-1)
    const normalizedVariance = stdDev / 0.577;
    this._vortexStrength = Math.min(1.0, Math.max(0.0, (0.7 * normalizedVariance) + (0.3 * mean)));

    // 4. Vortex Direction: based on whether energy is above/below 0.5 baseline
    // Positive = upward spiral (generative), Negative = downward spiral (degenerative)
    this._vortexDirection = Math.max(-1.0, Math.min(1.0, (mean - 0.5) * 2));

    // 5. Coherence: inverse of average pairwise differences
    const diff12 = Math.abs(f1 - f2);
    const diff23 = Math.abs(f2 - f3);
    const diff31 = Math.abs(f3 - f1);
    const avgDiff = (diff12 + diff23 + diff31) / 3;
    // Max possible average diff is ~0.667
    this._coherence = Math.max(0.0, Math.min(1.0, 1.0 - (avgDiff / 0.667)));

    return this._vortexStrength;
  }

  // ========================================
  // Getters for cached values
  // ========================================

  get vortexEnergy() {
    return this._vortexStrength !== null ? this._vortexStrength : 0;
  }

  get vortexStrength() {
    return this._vortexStrength !== null ? this._vortexStrength : 0;
  }

  get vortexDirection() {
    return this._vortexDirection !== null ? this._vortexDirection : 0;
  }

  get coherence() {
    return this._coherence !== null ? this._coherence : 0;
  }

  /**
   * Check if this is a high-leverage point
   * High strength + low coherence = opportunity for transformation
   */
  get isLeveragePoint() {
    return this._vortexStrength > 0.7 && this._coherence < 0.5;
  }

  /**
   * Get status description based on vortex characteristics
   */
  get status() {
    const strength = this._vortexStrength || 0;
    const direction = this._vortexDirection || 0;

    if (strength < 0.3) return 'Dormant';
    if (direction > 0.3) return strength > 0.7 ? 'Powerful Ascent' : 'Rising';
    if (direction < -0.3) return strength > 0.7 ? 'Critical Descent' : 'Declining';
    return 'Turbulent';
  }
}

// ========================================
// ENGINE: Dodecahedron System
// ========================================

/**
 * Main coherence engine orchestrating all 12 faces, 30 edges, 20 vertices
 */
export class DodecahedronEngine {
  constructor() {
    this.faces = [];
    this.edges = [];
    this.vertices = [];
    this.kpis = new Map(); // id -> KPI object
    this.shadowPatterns = []; // Company shadow patterns
    this.tuning = new TuningConfig(); // Load tuning constants
    this.breathAnalyzer = new BreathAnalyzer(); // Breath analysis

    // Spectral analysis - handle module scope for both ES module and global contexts
    this.spectralAnalyzer = (typeof SpectralAnalyzer !== 'undefined')
      ? new SpectralAnalyzer()
      : (typeof window !== 'undefined' && window.SpectralAnalyzer)
        ? new window.SpectralAnalyzer()
        : null;

    if (!this.spectralAnalyzer) {
      console.warn('SpectralAnalyzer not available - spectral analysis will be skipped');
    }
    this.breathAnalysis = null; // Cached breath analysis
    this.spectralAnalysis = null; // Cached spectral analysis

    // The Advanced Brain
    this.advancedEngine = new OrganizationalCoherenceEngine(this.tuning);
    this.advancedAnalysis = null;
  }

  /**
   * Load CSV file from data folder
   * @param {string} filename - Name of CSV file
   * @returns {Promise<Array<Object>>} Parsed CSV data
   */
  async loadCSV(filename) {
    try {
      const response = await fetch(`./data/${filename}`);
      const text = await response.text();
      return parseCSV(text);
    } catch (error) {
      console.error(`Error loading ${filename}:`, error);
      return [];
    }
  }

  /**
   * Initialize system from CSV data
   */
  async initialize() {
    console.log('🌟 Initializing Quannex Coherence Engine...');

    // Load CSV data
    const kpiData = await this.loadCSV('CSV_KPI_DATABASE.csv');
    const faceData = await this.loadCSV('CSV_FACE_MODELS.csv');
    const edgeData = await this.loadCSV('CSV_Edge_tension_Map.csv');
    const vertexData = await this.loadCSV('CSV_Vortex_Map.csv');

    // Create KPIs
    this.createKPIs(kpiData);

    // Create Faces (simplified for POC)
    this.createFaces();

    // Create Edges and Vertices
    this.createEdges(edgeData);
    this.createVertices(vertexData);

    // Calculate initial state
    this.recalculate();

    console.log('✅ System initialized');
    console.log(`📊 Loaded ${this.faces.length} faces, ${this.kpis.size} KPIs`);
    console.log(`🔷 Loaded ${this.edges.length} edges, ${this.vertices.length} vertices`);
    console.log(`🎯 Global Coherence: ${(this.getGlobalCoherence() * 100).toFixed(1)}%`);
  }

  /**
   * Initialize system with company-specific data
   */
  async initializeWithCompany(company) {
    console.log(`🌟 Initializing with company: ${company.name}`);

    // Clear existing data
    this.faces = [];
    this.edges = [];
    this.vertices = [];
    this.kpis = new Map();
    this.shadowPatterns = company.shadowPatterns || [];

    // Create KPIs from company data
    this.createKPIs(company.kpis);

    // Create Faces (use custom face config if provided)
    this.createFaces(company.faceConfig);

    // Check if pre-calculated coherence results are available
    if (company.coherenceResults && company.coherenceResults.faces) {
      console.log('📊 Using pre-calculated coherence results from orchestrator');
      this.applyPreCalculatedResults(company.coherenceResults);
    } else {
      // Calculate initial state (fallback)
      this.recalculate();
    }

    console.log('✅ Company loaded');
    console.log(`📊 ${company.name}: ${this.faces.length} faces, ${this.kpis.size} KPIs`);
    console.log(`🎯 Global Coherence: ${(this.getGlobalCoherence() * 100).toFixed(1)}%`);
  }

  /**
   * Apply pre-calculated coherence results from orchestrator
   * This ensures data integrity between the wizard and visualization
   */
  applyPreCalculatedResults(coherenceResults) {
    // Apply face energies from pre-calculated results
    coherenceResults.faces.forEach(resultFace => {
      const face = this.faces.find(f => f.id === resultFace.id);
      if (face) {
        // Update face name if different
        if (resultFace.name && resultFace.name !== face.name) {
          face.name = resultFace.name;
        }
        // Apply pre-calculated energy
        const energy = resultFace.energy || resultFace.faceEnergy || 0;
        face.faceEnergy = energy;
        face._localCoherence = energy;
        face.healthStatus = energy >= 0.7 ? 'Healthy' : energy >= 0.4 ? 'Warning' : 'Critical';

        // Apply KPI normalized scores if available
        if (resultFace.kpis && face.elementalKPIs) {
          resultFace.kpis.forEach(resultKpi => {
            const kpi = face.elementalKPIs.find(k => k.id === resultKpi.id);
            if (kpi && resultKpi.normalizedScore !== undefined) {
              kpi.normalizedScore = resultKpi.normalizedScore;
            }
          });
        }
      }
    });

    // Apply global coherence
    if (coherenceResults.globalCoherence !== undefined) {
      this._cachedGlobalCoherence = coherenceResults.globalCoherence;
    }

    // Create edges and vertices dynamically from faces (if not already created)
    if (this.edges.length === 0) {
      this.generateEdgesFromTopology();
    }
    if (this.vertices.length === 0) {
      this.generateVerticesFromTopology();
    }

    // Run advanced analysis with correct face energies
    this.runAdvancedAnalysis();

    console.log('✅ Pre-calculated results applied successfully');
  }

  /**
   * Generate edges dynamically from dodecahedron topology
   * Each face shares an edge with 5 neighbors
   */
  generateEdgesFromTopology() {
    // Dodecahedron edge topology: which faces share edges
    const edgeTopology = [
      [1, 2], [1, 3], [1, 4], [1, 5], [1, 6],
      [2, 3], [2, 7], [2, 11], [2, 6],
      [3, 4], [3, 7], [3, 8],
      [4, 5], [4, 8], [4, 9],
      [5, 6], [5, 9], [5, 10],
      [6, 10], [6, 11],
      [7, 8], [7, 11], [7, 12],
      [8, 9], [8, 12],
      [9, 10], [9, 12],
      [10, 11], [10, 12],
      [11, 12]
    ];

    edgeTopology.forEach(([faceAId, faceBId], index) => {
      const faceA = this.faces.find(f => f.id === faceAId);
      const faceB = this.faces.find(f => f.id === faceBId);

      if (faceA && faceB) {
        const edge = new Edge({
          id: `E${index + 1}`,
          faceAId: faceAId,
          faceBId: faceBId,
          archetype: 'Dynamic',
          description: `${faceA.name} ↔ ${faceB.name}`
        });

        // Calculate edge tension from face energies
        const energyA = faceA.faceEnergy || 0;
        const energyB = faceB.faceEnergy || 0;
        edge._tension = Math.abs(energyA - energyB);
        edge._flow = energyA > energyB ? -1 : (energyB > energyA ? 1 : 0);

        this.edges.push(edge);
      }
    });

    console.log(`🔗 Generated ${this.edges.length} edges from topology`);
  }

  /**
   * Generate vertices dynamically from edge topology
   * Each vertex is where 3 faces meet
   */
  generateVerticesFromTopology() {
    // Dodecahedron vertex topology: which 3 faces meet at each vertex
    const vertexTopology = [
      [1, 2, 3], [1, 3, 4], [1, 4, 5], [1, 5, 6], [1, 6, 2],
      [2, 7, 3], [3, 7, 8], [3, 8, 4], [4, 8, 9], [4, 9, 5],
      [5, 9, 10], [5, 10, 6], [6, 10, 11], [6, 11, 2], [2, 11, 7],
      [7, 12, 8], [8, 12, 9], [9, 12, 10], [10, 12, 11], [11, 12, 7]
    ];

    vertexTopology.forEach((faceIds, index) => {
      const faces = faceIds.map(id => this.faces.find(f => f.id === id)).filter(f => f);

      if (faces.length === 3) {
        const vertex = new Vertex({
          id: `V${index + 1}`,
          faceIds: faceIds,
          archetype: 'Dynamic'
        });

        // Calculate vortex energy
        vertex.calculateVortexEnergy(faces);

        this.vertices.push(vertex);
      }
    });

    console.log(`🌀 Generated ${this.vertices.length} vertices from topology`);
  }

  /**
   * Create KPI objects from data (supports both CSV format and UI format)
   */
  createKPIs(data) {
    console.log(`📊 Creating ${data.length} KPIs...`);
    let csvFormat = 0;
    let uiFormat = 0;

    data.forEach(row => {
      // 🔧 FIX: Support both CSV format (KPI_ID) and UI format (id)
      const kpiId = row.KPI_ID || row.id;
      if (!kpiId) return;

      // Track which format we're using
      if (row.KPI_ID) csvFormat++;
      if (row.id && !row.KPI_ID) uiFormat++;

      const kpi = new KPI({
        // Support both formats
        id: kpiId,
        name: row.KPI_Name || row.name || kpiId,
        value: parseFloat(row.Value !== undefined ? row.Value : row.value) || 0,
        weight: parseFloat(row.Weight !== undefined ? row.Weight : row.weight) || 1.0,
        direction: row.Direction || row.direction || '↑',
        targetMin: parseFloat(row.Target_Min !== undefined ? row.Target_Min : row.targetMin) || 0,
        targetIdeal: parseFloat(row.Target_Ideal !== undefined ? row.Target_Ideal : row.targetIdeal) || 100,
        healthyMin: parseFloat(row.Healthy_Min !== undefined ? row.Healthy_Min : row.healthyMin),
        healthyMax: parseFloat(row.Healthy_Max !== undefined ? row.Healthy_Max : row.healthyMax),
        absoluteMax: parseFloat(row.Absolute_Max !== undefined ? row.Absolute_Max : row.absoluteMax),
        faceId: parseInt(row.Face_ID !== undefined ? row.Face_ID : row.faceId) || null,
        element: row.Element || row.element || 'Earth'
      });

      this.kpis.set(kpi.id, kpi);
    });

    console.log(`✅ Created ${this.kpis.size} KPIs (CSV format: ${csvFormat}, UI format: ${uiFormat})`);
  }

  /**
   * Create Face objects
   */
  createFaces(faceConfig = null) {
    let faceNames;

    if (faceConfig && faceConfig.faces && Array.isArray(faceConfig.faces) && faceConfig.faces.length === 12) {
      faceNames = faceConfig.faces.map(f => f.name);
      console.log('✅ Using custom face configuration:', faceConfig.templateName || 'Custom');
    } else {
      faceNames = [
        'Financial Capital', 'Intellectual Capital', 'Human Capital', 'Structural Capital',
        'Market Resonance', 'Community & Partners', 'Brand & Reputation', 'Core Operations',
        'Regenerative Flow', 'Foundational Values', 'Funding Pipeline', 'Risk & Resilience'
      ];
      console.log('ℹ️ Using default face names');
    }

    faceNames.forEach((name, index) => {
      const faceId = index + 1;
      const faceKPIs = Array.from(this.kpis.values())
        .filter(kpi => kpi.faceId === faceId)
        .slice(0, 5);

      const face = new Face({
        id: faceId,
        name: name,
        elementalKPIs: faceKPIs,
        ballKPI: faceKPIs[0] || null
      }, this.tuning); // Pass global tuning to each face

      this.faces.push(face);
    });
  }

  /**
   * Create Edge objects from CSV data
   */
  createEdges(edgeData) {
    if (!edgeData) return;
    console.log(`🔗 Creating Edges from ${edgeData.length} rows...`);

    edgeData.forEach(row => {
      // CSV columns: Edge_ID, Face_A_ID, Face_B_ID, Edge Archytype, Description
      // Note: Face IDs in CSV might be "Face 1", "Face 2" etc. or just numbers.
      // We need to parse them.

      const parseFaceId = (val) => {
        if (typeof val === 'number') return val;
        if (typeof val === 'string') return parseInt(val.replace('Face ', '')) || 0;
        return 0;
      };

      const edge = new Edge({
        id: row.Edge_ID || row.id,
        faceAId: parseFaceId(row.Face_A_ID || row.faceA),
        faceBId: parseFaceId(row.Face_B_ID || row.faceB),
        archetype: row['Edge Archytype'] || row.archetype,
        description: row.Description || row.description
      });

      if (edge.faceAId && edge.faceBId) {
        this.edges.push(edge);
      }
    });
  }

  /**
   * Create Vertex objects from CSV data
   */
  createVertices(vertexData) {
    if (!vertexData) return;
    console.log(`🌀 Creating Vertices from ${vertexData.length} rows...`);

    vertexData.forEach(row => {
      // CSV columns: Vertex_ID, Face_1_ID, Face_2_ID, Face_3_ID

      const parseFaceId = (val) => {
        if (typeof val === 'number') return val;
        if (typeof val === 'string') return parseInt(val.replace('Face ', '')) || 0;
        return 0;
      };

      const f1 = parseFaceId(row.Face_1_ID);
      const f2 = parseFaceId(row.Face_2_ID);
      const f3 = parseFaceId(row.Face_3_ID);

      const vertex = new Vertex({
        id: row.Vertex_ID || row.id,
        faceIds: [f1, f2, f3],
        name: row.Name || `Vortex ${row.Vertex_ID}`
      });

      if (f1 && f2 && f3) {
        this.vertices.push(vertex);
      }
    });
  }

  /**
   * Recalculate entire system state
   * NOW WITH AXIS-INFORMED FEEDBACK LOOP
   */
  recalculate() {
    // Clear cached global coherence (forces recalculation)
    this._cachedGlobalCoherence = undefined;

    // 1. Invalidate all caches
    this.faces.forEach(face => face.invalidateCache());

    // 2. PASS 1: Calculate Local Coherence for all faces
    // This happens automatically when calculateAxisInformedEnergy calls calculateLocalCoherence
    // But we explicitly calculate it here to ensure base states are ready
    this.faces.forEach(face => face.calculateLocalCoherence());

    // 3. PASS 2: Calculate Axis-Informed Energy (The Feedback Loop)
    // We need the Axis Map (Polar Opposites)
    const axisMap = {
      1: 11, 11: 1,
      2: 7, 7: 2,
      3: 8, 8: 3,
      4: 9, 9: 4,
      5: 10, 10: 5,
      6: 12, 12: 6
    };

    this.faces.forEach(face => {
      const opposingId = axisMap[face.id];
      let opposingEnergy = 0;

      if (opposingId) {
        // Find the opposing face object
        const opposingFace = this.faces.find(f => f.id === opposingId);
        if (opposingFace) {
          // Use the opposing face's LOCAL coherence (to avoid infinite recursion)
          // or use its previous state. For simplicity/stability, we use its fresh local coherence.
          opposingEnergy = opposingFace._localCoherence;
        }
      }

      face.calculateAxisInformedEnergy(opposingEnergy);
    });

    // 4. Run Global Analyzers
    if (this.faces.length === 12) {
      this.breathAnalysis = this.breathAnalyzer.analyze(this.faces);

      if (this.spectralAnalyzer) {
        const faceEnergies = this.faces.map(f => f.faceEnergy);
        this.spectralAnalysis = this.spectralAnalyzer.analyze(faceEnergies);
      }

      // 4.5 Shadow Detection and Penalty Application
      // Shadow patterns (e.g., "Brittle Profit") apply penalties to face energies
      if (this.advancedEngine && this.advancedEngine.shadows) {
        try {
          const shadowAnalysis = this.advancedEngine.shadows.analyze(this.faces, this.kpis);

          if (shadowAnalysis && shadowAnalysis.penalties) {
            Object.entries(shadowAnalysis.penalties).forEach(([faceId, penalty]) => {
              const face = this.faces.find(f => f.id === parseInt(faceId));
              if (face && face._faceEnergy !== null && penalty > 0) {
                // Apply penalty: reduce face energy by penalty percentage
                const originalEnergy = face._faceEnergy;
                face._faceEnergy = originalEnergy * (1 - penalty);
                // Cap penalties at 90% reduction
                face._faceEnergy = Math.max(face._faceEnergy, originalEnergy * 0.1);
              }
            });
          }

          // Store shadow analysis for UI access
          this.shadowAnalysis = shadowAnalysis;
        } catch (err) {
          console.warn('Shadow analysis failed:', err);
          this.shadowAnalysis = null;
        }
      }
    }

    // 5. Update Edges
    this.edges.forEach(edge => {
      const faceA = this.faces.find(f => f.id === edge.faceAId);
      const faceB = this.faces.find(f => f.id === edge.faceBId);
      edge.calculateTension(faceA, faceB);
    });

    // 6. Update Vertices
    this.vertices.forEach(vertex => {
      const faces = vertex.faceIds.map(id => this.faces.find(f => f.id === id)).filter(f => f);
      vertex.calculateVortexEnergy(faces);
    });
  }

  /**
   * Get global coherence score
   *
   * COEFFICIENT OF VARIATION FORMULA: C = μ × (1 - λ × (σ/μ))
   *
   * This penalizes variance while preserving scale-invariance:
   * - μ (mean): Average face energy across all 12 faces
   * - σ (stddev): Standard deviation of face energies
   * - λ (lambda): Variance penalty coefficient = φ^-3 = 0.236
   *
   * The result is bounded to [0, 1] and:
   * - High mean + low variance = high coherence
   * - High mean + high variance = moderate coherence (penalized)
   * - Low mean = low coherence regardless of variance
   */
  getGlobalCoherence() {
    // Use cached value if available (from pre-calculated orchestrator results)
    if (this._cachedGlobalCoherence !== undefined) {
      return this._cachedGlobalCoherence;
    }

    if (this.faces.length === 0) return 0;

    const energies = this.faces.map(face => face.faceEnergy || 0);

    // Calculate mean (μ)
    const mu = energies.reduce((sum, e) => sum + e, 0) / energies.length;

    // Handle edge case of zero or near-zero mean
    const epsilon = (typeof PHI_HARMONICS !== 'undefined')
      ? PHI_HARMONICS.EPSILON
      : 1e-10;

    if (mu <= epsilon) return 0;

    // Calculate standard deviation (σ)
    const variance = energies.reduce((sum, e) => sum + Math.pow(e - mu, 2), 0) / energies.length;
    const sigma = Math.sqrt(variance);

    // Get lambda from PHI_HARMONICS (φ^-3 = 0.236)
    const lambda = (typeof PHI_HARMONICS !== 'undefined')
      ? PHI_HARMONICS.CV_LAMBDA
      : 0.236;

    // CV-penalized coherence: μ × (1 - λ × CV)
    // where CV = σ/μ (coefficient of variation)
    const cv = sigma / mu;
    const rawCoherence = mu * (1 - lambda * cv);

    // Clamp to [0, 1] range
    const clampedCoherence = Math.max(0, Math.min(1, rawCoherence));

    // Apply KAPPA sensitivity amplifier (logistic S-curve)
    // This transforms linear coherence into a more responsive curve
    const amplifiedCoherence = this.tuning.applySensitivityAmplifier(clampedCoherence);

    return amplifiedCoherence;
  }

  /**
   * Get coherence status description
   */
  getCoherenceStatus(coherence) {
    if (coherence >= 0.9) return 'Exceptional';
    if (coherence >= 0.8) return 'Excellent';
    if (coherence >= 0.7) return 'Healthy';
    if (coherence >= 0.6) return 'Moderate';
    if (coherence >= 0.5) return 'Fair';
    if (coherence >= 0.4) return 'Concerning';
    if (coherence >= 0.3) return 'Critical';
    return 'Crisis';
  }

  /**
   * Get system state (for UI)
   */
  getState() {
    return {
      globalCoherence: this.getGlobalCoherence(),
      coherenceStatus: this.getCoherenceStatus(this.getGlobalCoherence()),
      tuning: this.tuning, // Expose tuning to UI
      faces: this.faces.map(face => ({
        id: face.id,
        name: face.name,
        faceEnergy: face.faceEnergy, // Final energy
        localCoherence: face._localCoherence, // Raw local energy (for debug/UI)
        status: face.healthStatus,
        color: face.getEnergyColor(),
        elementalKPIs: face.elementalKPIs.map(kpi => ({
          id: kpi.id,
          name: kpi.name,
          value: kpi.value,
          normalizedScore: kpi.normalizedScore,
          element: kpi.element,
          healthStatus: kpi.healthStatus
        }))
      })),
      edges: this.edges.map(e => ({
        id: e.id,
        tension: e.tension,
        status: e.status,
        archetype: e.archetype,
        faceAId: e.faceAId,
        faceBId: e.faceBId,
        breathRatio: e.breathRatio,
        flowDirection: e.flowDirection,
        element: e.element
      })),
      vertices: this.vertices.map(v => ({
        id: v.id,
        energy: v.vortexEnergy,
        status: v.status,
        faceIds: v.faceIds,
        vortexDirection: v.vortexDirection,
        coherence: v.coherence,
        isLeveragePoint: v.isLeveragePoint
      })),
      shadowPatterns: this.shadowPatterns || [],
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Update a KPI value
   */
  updateKPI(kpiId, newValue) {
    const kpi = this.kpis.get(kpiId);
    if (!kpi) {
      console.error(`KPI ${kpiId} not found`);
      return false;
    }

    kpi.value = newValue;
    this.recalculate();

    console.log(`✅ Updated ${kpi.name} to ${newValue}`);
    console.log(`🎯 New Global Coherence: ${(this.getGlobalCoherence() * 100).toFixed(1)}%`);

    return true;
  }

  /**
   * Update Tuning Configuration
   */
  updateTuning(key, value) {
    if (this.tuning.hasOwnProperty(key)) {
      this.tuning[key] = parseFloat(value);
      console.log(`🎛️ Tuning Updated: ${key} = ${value}`);
      this.recalculate();
      return true;
    }
    return false;
  }
}

// ========================================
// API: Global Interface
// ========================================

// Create global engine instance
const quannexEngine = new DodecahedronEngine();

// Expose API for HTML to use
window.Quannex = {
  /**
   * Initialize the engine
   */
  async init() {
    await quannexEngine.initialize();
    return quannexEngine.getState();
  },

  /**
   * Initialize the engine with company-specific data
   */
  async initWithCompany(company) {
    await quannexEngine.initializeWithCompany(company);
    return quannexEngine.getState();
  },

  /**
   * Get current system state
   */
  getState() {
    return quannexEngine.getState();
  },

  /**
   * Update a KPI value
   */
  updateKPI(kpiId, newValue) {
    return quannexEngine.updateKPI(kpiId, newValue);
  },

  /**
   * Update a Tuning Parameter
   */
  updateTuning(key, value) {
    return quannexEngine.updateTuning(key, value);
  },

  /**
   * Get all faces
   */
  getFaces() {
    return quannexEngine.faces.map(face => ({
      id: face.id,
      name: face.name,
      energy: face.faceEnergy,
      localEnergy: face._localCoherence,
      status: face.healthStatus,
      color: face.getEnergyColor(),
      kpis: face.elementalKPIs.map(kpi => ({
        id: kpi.id,
        name: kpi.name,
        value: kpi.value,
        normalizedScore: kpi.normalizedScore
      }))
    }));
  },

  /**
   * Get all KPIs
   */
  getKPIs() {
    return Array.from(quannexEngine.kpis.values()).map(kpi => ({
      id: kpi.id,
      name: kpi.name,
      value: kpi.value,
      normalizedScore: kpi.normalizedScore,
      faceId: kpi.faceId
    }));
  },

  /**
   * Get breath analysis (6 breath axes)
   */
  getBreathAnalysis() {
    return quannexEngine.breathAnalysis;
  },

  /**
   * Get spectral analysis (eigenvectors)
   */
  getSpectralAnalysis() {
    return quannexEngine.spectralAnalysis;
  },

  /**
   * Get shadow analysis (detected organizational shadows and penalties)
   */
  getShadowAnalysis() {
    return quannexEngine.shadowAnalysis;
  },

  // ════════════════════════════════════════════════════════════════
  // TUNING TEMPLATE API
  // ════════════════════════════════════════════════════════════════

  /**
   * Get available tuning templates
   * @returns {Array<Object>} List of available templates with metadata
   */
  getTemplates() {
    return [
      {
        id: 'startup',
        name: '🌱 Startup Mode',
        philosophy: 'Every step forward is a victory. We celebrate progress.',
        description: 'Forgiving, growth-focused. Best for early-stage startups and turnarounds.',
        create: () => TuningConfig.startupMode()
      },
      {
        id: 'enterprise',
        name: '🏢 Enterprise Mode',
        philosophy: 'Excellence is the expectation. Harmony is non-negotiable.',
        description: 'Demanding, excellence-focused. Best for mature organizations.',
        create: () => TuningConfig.enterpriseMode()
      },
      {
        id: 'balanced',
        name: '⚖️ Balanced Mode',
        philosophy: 'Trust the golden ratio. Let phi guide the way.',
        description: 'Sacred geometry defaults. Best for general use.',
        create: () => TuningConfig.balancedMode()
      },
      {
        id: 'nonDual',
        name: '∞ Non-Dual Mode',
        philosophy: 'We are our shadows. Separation is illusion.',
        description: 'Shadow-integrated, relational. Best for evolved organizations.',
        create: () => TuningConfig.nonDualMode()
      }
    ];
  },

  /**
   * Apply a tuning template by ID
   * @param {string} templateId - One of: 'startup', 'enterprise', 'balanced', 'nonDual'
   * @returns {Object} The new tuning configuration
   */
  applyTemplate(templateId) {
    const templates = {
      startup: TuningConfig.startupMode,
      enterprise: TuningConfig.enterpriseMode,
      balanced: TuningConfig.balancedMode,
      nonDual: TuningConfig.nonDualMode
    };

    const factory = templates[templateId];
    if (!factory) {
      console.warn(`Unknown template: ${templateId}. Available: ${Object.keys(templates).join(', ')}`);
      return null;
    }

    const newConfig = factory();
    quannexEngine.tuning = newConfig;

    // Recalculate all coherence values
    quannexEngine.recalculate();

    console.log(`✨ Applied "${templateId}" tuning template`);
    console.log(`   Philosophy: ${newConfig.getPhilosophy().alpha.meaning}`);

    return newConfig.toJSON();
  },

  /**
   * Get the current tuning philosophy (human-readable explanation)
   * @returns {Object} Philosophy explanation for all parameters
   */
  getTuningPhilosophy() {
    return quannexEngine.tuning.getPhilosophy();
  },

  /**
   * Export current tuning configuration to JSON
   * @returns {Object} Current tuning as JSON
   */
  exportTuning() {
    return quannexEngine.tuning.toJSON();
  },

  /**
   * Import tuning configuration from JSON
   * @param {Object} json - Tuning configuration object
   * @returns {Object} The applied configuration
   */
  importTuning(json) {
    quannexEngine.tuning = TuningConfig.fromJSON(json);
    quannexEngine.recalculate();
    console.log('📥 Imported custom tuning configuration');
    return quannexEngine.tuning.toJSON();
  }
};

// Also expose quannexEngine directly for advanced integrations (like 3D viz)
window.quannexEngine = quannexEngine;

console.log('🌟 Quannex Serverless Engine Loaded');
console.log('💡 Use window.Quannex API to interact with the system');
// Export for global access (backward compatibility)
if (typeof window !== 'undefined') {
  window.DodecahedronEngine = DodecahedronEngine;
}
