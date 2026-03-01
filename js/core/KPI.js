/**
 * ========================================================================
 * KPI - Key Performance Indicator Model
 * ========================================================================
 *
 * EXTRACTED FROM: main.js (lines 481-584)
 * EXTRACTION DATE: December 16, 2025
 *
 * Represents a single KPI with normalization and scoring logic.
 * Each KPI belongs to a Face (organizational domain) and has an element
 * (Earth, Water, Fire, Air, Ether - the pentagram vertices).
 *
 * ============================================================================
 *                         NOTES FOR FUTURE CLAUDE
 * ============================================================================
 * 1. This class is INDEPENDENT - no imports from other js/core/ files
 * 2. PHI_HARMONICS.CURVATURE is used for kappa curvature in normalizedScore
 * 3. Three direction types: up arrow (up better), down arrow (down better), Band
 * 4. Three metric types: survival (phi^-1), growth (phi), completion (1.0)
 * 5. Used by: Face.js (elementalKPIs array), DodecahedronEngine
 * 6. The normalizedScore getter applies kappa curvature automatically
 * 7. Band normalization creates a "healthy zone" with linear ramps on edges
 * 8. Each KPI has faceId and element properties for mapping to geometry
 * ============================================================================
 *
 * @module js/core/KPI
 * @requires window.PhiHarmonics (optional, has fallback)
 */

// ============================================================================
// PHI_HARMONICS: Get from single-source module or use fallback
// ============================================================================
const PHI_HARMONICS = (function() {
  if (typeof window !== 'undefined' && window.PhiHarmonics) {
    Logger.debug('KPI', 'Using PhiHarmonics from single-source module');
    return window.PhiHarmonics;
  }

  // Fallback for standalone use or testing
  Logger.debug('KPI', 'Using local PHI_HARMONICS fallback');
  const PHI = (1 + Math.sqrt(5)) / 2;

  return {
    PHI: PHI,
    PHI_INV_1: 1 / PHI,
    PHI_INV_2: 1 / (PHI * PHI),
    // Curvature parameters for kappa-based scoring
    CURVATURE: Object.freeze({
      survival: 1 / PHI,      // phi^-1 = 0.618 - forgiving curve
      growth: PHI,            // phi = 1.618 - demanding curve
      completion: 1.0         // linear - balanced curve
    })
  };
})();

/**
 * Represents a single KPI with normalization and scoring logic.
 *
 * KPIs can have three normalization directions:
 * - Up arrow: Higher values are better (linear increase to target)
 * - Down arrow: Lower values are better (linear decrease from target)
 * - Band: Values within a "healthy zone" are optimal
 *
 * The kappa curvature system applies phi-derived transformations:
 * - survival metrics (kappa=0.618): Forgiving, rewards early progress
 * - growth metrics (kappa=1.618): Demanding, rewards excellence
 * - completion metrics (kappa=1.0): Linear, balanced progression
 *
 * @class KPI
 */
export class KPI {
  /**
   * Create a new KPI instance
   *
   * @param {Object} config - Configuration object
   * @param {string} config.id - Unique identifier
   * @param {string} config.name - Human-readable name
   * @param {number} config.value - Current value
   * @param {number} config.weight - Importance weight (default 1.0)
   * @param {string} config.direction - 'up arrow', 'down arrow', or 'Band'
   * @param {number} config.targetMin - Minimum acceptable value
   * @param {number} config.targetIdeal - Ideal/target value
   * @param {number} config.healthyMin - Start of healthy band (Band mode)
   * @param {number} config.healthyMax - End of healthy band (Band mode)
   * @param {number} config.absoluteMax - Maximum possible value
   * @param {number} config.faceId - Which face this KPI belongs to (1-12)
   * @param {string} config.element - Element type (Earth, Water, Fire, Air, Ether)
   * @param {string} config.metricType - Curvature type (survival, growth, completion)
   */
  constructor(config) {
    this.id = config.id || '';
    this.name = config.name || '';
    this.value = parseFloat(config.value) || 0;
    this.weight = parseFloat(config.weight) || 1.0;
    this.direction = config.direction || '\u2191'; // up arrow, down arrow, or Band

    // Normalization parameters
    this.targetMin = parseFloat(config.targetMin) || 0;
    this.targetIdeal = parseFloat(config.targetIdeal) || 100;
    this.healthyMin = parseFloat(config.healthyMin) || this.targetMin;
    this.healthyMax = parseFloat(config.healthyMax) || this.targetIdeal;
    this.absoluteMax = parseFloat(config.absoluteMax) || this.targetIdeal * 2;

    // Metadata
    this.faceId = config.faceId || null;
    this.element = config.element || null; // Earth, Water, Fire, Air, Ether

    // Metric type for kappa curvature (survival, growth, or completion)
    // survival: phi^-1 (0.618) - forgiving, rewards early progress
    // growth: phi (1.618) - demanding, rewards excellence
    // completion: 1.0 - linear (default)
    this.metricType = config.metricType || 'completion';
  }

  /**
   * Calculate normalized score (0 to 1) based on KPI direction
   * Then apply kappa curvature based on metric type
   *
   * The kappa curvature transforms linear scores using power function:
   * - survival (kappa=0.618): 0.5^0.618 = 0.65 (forgiving)
   * - growth (kappa=1.618): 0.5^1.618 = 0.33 (demanding)
   * - completion (kappa=1.0): 0.5^1.0 = 0.50 (linear)
   *
   * @returns {number} Normalized and curvature-adjusted score (0-1)
   */
  get normalizedScore() {
    // Get linear score based on direction
    let linearScore;
    switch (this.direction) {
      case '\u2191': // up arrow
        linearScore = this.normalizeUp();
        break;
      case '\u2193': // down arrow
        linearScore = this.normalizeDown();
        break;
      case 'Band':
        linearScore = this.normalizeBand();
        break;
      default:
        linearScore = this.normalizeUp();
    }

    // Apply kappa curvature based on metric type
    // Uses PHI_HARMONICS.CURVATURE for phi-derived values
    const kappa = (typeof PHI_HARMONICS !== 'undefined' && PHI_HARMONICS.CURVATURE)
      ? (PHI_HARMONICS.CURVATURE[this.metricType] || 1.0)
      : 1.0;

    // STRESS_TEST_FIX [H4]: Clamp linearScore BEFORE kappa to prevent
    // Math.pow(negative, non-integer) = NaN propagation.
    // Edge case: if normalization returns slightly negative due to floating
    // point, Math.pow(-0.001, 1.618) = NaN, which silently poisons coherence.
    const safeScore = Math.max(0, Math.min(1, linearScore));

    // Apply curvature: score^kappa
    // survival (kappa=0.618): 0.5^0.618 = 0.65 (forgiving)
    // growth (kappa=1.618): 0.5^1.618 = 0.33 (demanding)
    return Math.pow(safeScore, kappa);
  }

  /**
   * Up arrow (Up is Better): More is better - linear increase
   *
   * Score increases linearly from 0 at targetMin to 1 at targetIdeal
   *
   * @returns {number} Linear normalized score (0-1)
   */
  normalizeUp() {
    if (this.value >= this.targetIdeal) return 1.0;
    if (this.value <= this.targetMin) return 0.0;
    // STRESS_TEST_FIX [C1]: Guard against targetIdeal === targetMin
    // (organization confused its floor with its ceiling — concept breaks, so math must not)
    const range = this.targetIdeal - this.targetMin;
    if (range <= 0) return 0.0;
    return (this.value - this.targetMin) / range;
  }

  /**
   * Down arrow (Down is Better): Less is better - linear decrease
   *
   * Score is 1 at or below targetMin, decreasing to 0 at absoluteMax
   *
   * @returns {number} Linear normalized score (0-1)
   */
  normalizeDown() {
    if (this.value <= this.targetMin) return 1.0;
    if (this.value >= this.absoluteMax) return 0.0;
    // STRESS_TEST_FIX [C1]: Guard against absoluteMax === targetMin
    const range = this.absoluteMax - this.targetMin;
    if (range <= 0) return 0.0;
    return 1 - ((this.value - this.targetMin) / range);
  }

  /**
   * Band (Plateau): Sweet spot between healthyMin and healthyMax
   *
   * Score is 1 within the healthy zone, with linear ramps on either side:
   * - Below healthyMin: rises from 0 (at targetMin) to 1 (at healthyMin)
   * - Within healthy zone: stays at 1
   * - Above healthyMax: falls from 1 (at healthyMax) to 0 (at absoluteMax)
   *
   * @returns {number} Band normalized score (0-1)
   */
  normalizeBand() {
    // Perfect plateau: within healthy range
    if (this.value >= this.healthyMin && this.value <= this.healthyMax) {
      return 1.0;
    }

    // Below plateau: linear rise from targetMin to healthyMin
    if (this.value < this.healthyMin) {
      if (this.value <= this.targetMin) return 0.0;
      // STRESS_TEST_FIX [C1]: Guard against healthyMin === targetMin
      const riseRange = this.healthyMin - this.targetMin;
      if (riseRange <= 0) return 0.0;
      return (this.value - this.targetMin) / riseRange;
    }

    // Above plateau: linear decline from healthyMax to absoluteMax
    if (this.value >= this.absoluteMax) return 0.0;
    // STRESS_TEST_FIX [C1]: Guard against absoluteMax === healthyMax
    const fallRange = this.absoluteMax - this.healthyMax;
    if (fallRange <= 0) return 0.0;
    return 1 - ((this.value - this.healthyMax) / fallRange);
  }

  /**
   * Get weighted score (normalized score times weight)
   *
   * @returns {number} Score adjusted by importance weight
   */
  get weightedScore() {
    return this.normalizedScore * this.weight;
  }
}

// ============================================================================
// Backward compatibility: export to window for IIFE modules
// ============================================================================
if (typeof window !== 'undefined') {
  window.KPI = KPI;
}

Logger.info('KPI', 'KPI module loaded');
