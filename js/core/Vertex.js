/**
 * ========================================================================
 * VERTEX - Triadic Synergy Model (The Vortex)
 * ========================================================================
 *
 * EXTRACTED FROM: main.js (lines 1061-1161)
 * EXTRACTION DATE: December 16, 2025
 *
 * Represents the intersection of three faces (the vortex point).
 * Dodecahedron has 20 vertices where 3 faces meet.
 *
 * ============================================================================
 *                         NOTES FOR FUTURE CLAUDE
 * ============================================================================
 * 1. This class is INDEPENDENT - no imports from other js/core/ files
 * 2. Dodecahedron has 20 vertices (each where 3 faces meet)
 * 3. vortexStrength: 70% variance contribution + 30% mean energy
 * 4. vortexDirection: -1 to +1 (degenerative to generative spiral)
 * 5. coherence: inverse of average pairwise differences
 * 6. isLeveragePoint: high strength + low coherence = opportunity
 * 7. FIXED: Constructor no longer calculates with undefined energies
 * 8. Calculation is deferred to calculateVortexEnergy(faces) method
 * 9. Status states: Dormant, Rising, Declining, Powerful Ascent, Critical Descent, Turbulent
 * 10. Used by: DodecahedronEngine (main.js) for triadic synergy calculations
 * ============================================================================
 *
 * @module js/core/Vertex
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
