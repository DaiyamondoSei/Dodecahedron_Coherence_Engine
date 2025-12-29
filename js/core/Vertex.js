/**
 * ════════════════════════════════════════════════════════════════════════════════
 * VERTEX.JS - THE VORTEX POINTS WHERE TRANSFORMATION SPIRALS
 * ════════════════════════════════════════════════════════════════════════════════
 *
 * EXTRACTED FROM: main.js (lines 1061-1161)
 * EXTRACTION DATE: December 16, 2025
 *
 * @module js/core/Vertex
 * @author Deimantas Butrimas & Claude
 * @version 2.1.0 - Gold documentation standard
 * @see {@link ../../docs/VERTEX_DYNAMICS_REFERENCE.md} - Complete vertex theory & philosophy
 *
 * ════════════════════════════════════════════════════════════════════════════════
 * WHY 20 VERTICES? THE GEOMETRY OF CONVERGENCE
 * ════════════════════════════════════════════════════════════════════════════════
 *
 * A dodecahedron has exactly 20 vertices. This is fixed by geometry:
 *   - 12 faces × 5 vertices per face = 60 vertex-touches
 *   - Each vertex shared by exactly 3 faces: 60 ÷ 3 = 20 vertices
 *   - Euler's formula: V - E + F = 2 → 20 - 30 + 12 = 2 ✓
 *
 * THE PROFOUND MEANING OF "THREE FACES MEETING":
 * ───────────────────────────────────────────────
 * At every vertex, EXACTLY three domains converge. Not two. Not four. Three.
 *
 * This is geometrically fixed, but it's also organizationally profound:
 *   - Dyads (2 domains) can push-pull, but they're linear
 *   - Triads (3 domains) create SPIRAL dynamics - they can spin
 *   - Higher numbers diffuse energy - too many cooks
 *
 * Think of water going down a drain - it needs 3 dimensions to spiral.
 * Similarly, organizational transformation happens at these triadic points.
 *
 * ════════════════════════════════════════════════════════════════════════════════
 * THE VORTEX METAPHOR - SPIRALING ENERGY
 * ════════════════════════════════════════════════════════════════════════════════
 *
 * A vortex is a spinning column of energy. It can spiral UP (generative) or
 * DOWN (degenerative), and it can be strong or weak.
 *
 * UPWARD SPIRAL (Generative):
 * ───────────────────────────
 * When all 3 domains are healthy (above 0.5 baseline), the vortex spirals UP.
 * This creates:
 *   - Innovation and breakthrough
 *   - Synergistic amplification
 *   - The whole becoming greater than the sum of parts
 *
 * Example: Vertex [Human Capital + Brand + Operations]
 * When all three are strong, employees naturally embody the brand through
 * excellent operations. Customers feel this authenticity. Magic happens.
 *
 * DOWNWARD SPIRAL (Degenerative):
 * ────────────────────────────────
 * When domains are below baseline, the vortex spirals DOWN.
 * This creates:
 *   - Compounding problems
 *   - Energy drain
 *   - Symptoms that seem unrelated but share this vertex
 *
 * Example: Same vertex when weak - employees don't believe in the brand,
 * operations suffer, customers leave. The three failures reinforce each other.
 *
 * ════════════════════════════════════════════════════════════════════════════════
 * THE MATHEMATICS OF VORTEX STRENGTH
 * ════════════════════════════════════════════════════════════════════════════════
 *
 * VORTEX STRENGTH FORMULA:
 *   strength = 0.7 × (σ / 0.577) + 0.3 × μ
 *
 * WHERE:
 *   σ = standard deviation of the 3 face energies
 *   μ = mean of the 3 face energies
 *   0.577 = √(1/3) = maximum possible σ for 3 values in [0,1]
 *
 * WHY 70/30 SPLIT?
 * ─────────────────
 * The 70% weight on variance and 30% on mean is intentional:
 *
 *   - VARIANCE (70%): High variance = high TENSION = high POTENTIAL for change
 *     A vertex where one domain is strong and another weak has more
 *     transformative potential than one where all are middling.
 *
 *   - MEAN (30%): Higher mean = more FUEL for the transformation
 *     You need some baseline energy for the vortex to actually spin.
 *
 * This captures the insight that LEVERAGE POINTS are often places of
 * imbalance (high variance) that have enough energy (reasonable mean)
 * to actually do something about it.
 *
 * WHY 0.577 FOR NORMALIZATION?
 * ─────────────────────────────
 * For any 3 values constrained to [0, 1], the maximum standard deviation
 * occurs when values are [0, 0, 1] or [0, 1, 1], giving σ ≈ 0.577 = √(1/3).
 * Dividing by this normalizes variance to [0, 1] scale.
 *
 * ════════════════════════════════════════════════════════════════════════════════
 * LEVERAGE POINTS - WHERE SMALL CHANGES CREATE BIG EFFECTS
 * ════════════════════════════════════════════════════════════════════════════════
 *
 * A vertex is a LEVERAGE POINT when:
 *   - High vortex strength (> 0.7) - there's energy and tension
 *   - Low coherence (< 0.5) - the 3 domains are misaligned
 *
 * This combination means: "There's significant energy here, but it's not
 * harmonized. A small intervention to align these 3 domains will ripple
 * through the entire system."
 *
 * Donella Meadows (Systems Thinking): "Leverage points are places within a
 * complex system where a small shift in one thing can produce big changes."
 *
 * ════════════════════════════════════════════════════════════════════════════════
 * NOTES FOR FUTURE CLAUDE - 10 KEY INSIGHTS
 * ════════════════════════════════════════════════════════════════════════════════
 *
 * 1. This class is INDEPENDENT - no imports from other js/core/ files
 * 2. Dodecahedron has 20 vertices (each where 3 faces meet - this is FIXED)
 * 3. vortexStrength: 70% normalized variance + 30% mean energy
 * 4. vortexDirection: -1 to +1 (below/above 0.5 baseline, scaled by 2)
 * 5. coherence: 1 - (avgPairwiseDiff / 0.667), measures 3-way alignment
 * 6. isLeveragePoint: strength > 0.7 AND coherence < 0.5 = OPPORTUNITY
 * 7. Constructor doesn't calculate - call calculateVortexEnergy(faces) explicitly
 * 8. The 0.577 normalization = √(1/3) = max σ for 3 values in [0,1]
 * 9. Status: Dormant/Rising/Declining/Powerful Ascent/Critical Descent/Turbulent
 * 10. Triadic synergy is MORE than the sum - it's the SPIRAL of the parts
 *
 * ════════════════════════════════════════════════════════════════════════════════
 */

/**
 * Represents the intersection of three faces (The Vortex).
 * Models the synergy where three domains meet.
 *
 * The vortex metaphor captures how energy spirals at convergence points:
 * - Positive direction: Upward spiral (generative, creative flow)
 * - Negative direction: Downward spiral (degenerative, draining)
 * - High strength + low coherence: Leverage point for transformation
 *
 * FIXED: Constructor no longer tries to calculate with undefined 'energies'.
 * Calculation is deferred to calculateVortexEnergy(faces) method.
 *
 * @class Vertex
 */
export class Vertex {
  /**
   * Create a new Vertex instance
   *
   * @param {Object} config - Configuration object
   * @param {string} config.id - Unique identifier
   * @param {Array<number>} config.faceIds - Array of 3 face IDs meeting at this vertex
   * @param {string} config.name - Human-readable name
   * @param {string} config.archetype - Triadic archetype name
   */
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
   * Calculate all vortex metrics based on converging face energies.
   * Called by recalculate() with the actual Face objects.
   *
   * Calculations performed:
   * 1. Mean energy of 3 faces
   * 2. Variance and standard deviation
   * 3. Vortex Strength: 70% normalized variance + 30% mean energy
   * 4. Vortex Direction: Above/below 0.5 baseline (-1 to +1)
   * 5. Coherence: Inverse of average pairwise differences
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

  // ========================================================================
  // Getters for cached values
  // ========================================================================

  /**
   * Get vortex energy (alias for vortexStrength)
   * @returns {number} Vortex energy (0-1)
   */
  get vortexEnergy() {
    return this._vortexStrength !== null ? this._vortexStrength : 0;
  }

  /**
   * Get vortex strength
   * @returns {number} Vortex strength (0-1)
   */
  get vortexStrength() {
    return this._vortexStrength !== null ? this._vortexStrength : 0;
  }

  /**
   * Get vortex direction
   * @returns {number} Vortex direction (-1 to +1)
   */
  get vortexDirection() {
    return this._vortexDirection !== null ? this._vortexDirection : 0;
  }

  /**
   * Get coherence
   * @returns {number} Coherence (0-1)
   */
  get coherence() {
    return this._coherence !== null ? this._coherence : 0;
  }

  /**
   * Check if this is a high-leverage point.
   * High strength + low coherence = opportunity for transformation.
   *
   * Leverage points are where small interventions can create
   * significant system-wide changes.
   *
   * @returns {boolean} True if vertex is a leverage point
   */
  get isLeveragePoint() {
    return this._vortexStrength > 0.7 && this._coherence < 0.5;
  }

  /**
   * Get status description based on vortex characteristics.
   *
   * Status descriptions:
   * - Dormant: Low strength (<0.3)
   * - Rising: Positive direction, moderate strength
   * - Powerful Ascent: Positive direction, high strength
   * - Declining: Negative direction, moderate strength
   * - Critical Descent: Negative direction, high strength
   * - Turbulent: Neutral direction (neither rising nor declining)
   *
   * @returns {string} Human-readable status
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

// ============================================================================
// Backward compatibility: export to window for IIFE modules
// ============================================================================
if (typeof window !== 'undefined') {
  window.Vertex = Vertex;
}

console.log('   Vertex module loaded');
