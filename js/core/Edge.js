/**
 * ════════════════════════════════════════════════════════════════════════════════
 * EDGE.JS - THE BOUNDARIES WHERE DOMAINS MEET
 * ════════════════════════════════════════════════════════════════════════════════
 *
 * EXTRACTED FROM: main.js (lines 984-1048)
 * EXTRACTION DATE: December 16, 2025
 *
 * @module js/core/Edge
 * @author Deimantas Murauskas & Claude
 * @version 2.1.0 - Gold documentation standard
 * @see {@link ../../docs/EDGE_DYNAMICS_REFERENCE.md} - Complete edge theory & philosophy
 *
 * ════════════════════════════════════════════════════════════════════════════════
 * WHY 30 EDGES? THE GEOMETRY OF RELATIONSHIP
 * ════════════════════════════════════════════════════════════════════════════════
 *
 * A dodecahedron has exactly 30 edges. This is fixed by geometry:
 *   - 12 faces × 5 edges per face = 60 edge-touches
 *   - Each edge shared by exactly 2 faces: 60 ÷ 2 = 30 edges
 *   - Euler's formula: V - E + F = 2 → 20 - 30 + 12 = 2 ✓
 *
 * WHAT IS AN EDGE? THE BOUNDARY OF FLOW
 * ─────────────────────────────────────
 * An edge is where two organizational domains share a boundary.
 * Energy must flow across this boundary, and the TENSION on the edge
 * tells us about the quality of that flow.
 *
 * Think of edges as semi-permeable membranes:
 *   - Low tension (smooth flow): Domains integrate well
 *   - High tension (blocked flow): Bottleneck or conflict
 *
 * ORGANIZATIONAL MEANING:
 * ───────────────────────
 * Consider the edge between "Human Capital" and "Operations":
 *   - If both faces are strong: Synergetic (people → efficient processes)
 *   - If Human is strong but Operations weak: Blocked flow (ideas can't execute)
 *   - If both are weak: Depleted (no energy to move either way)
 *
 * ════════════════════════════════════════════════════════════════════════════════
 * THE FIVE ELEMENTS AND THEIR EDGE ARCHETYPES
 * ════════════════════════════════════════════════════════════════════════════════
 *
 * Each edge can be associated with an element that modifies its character.
 * These multipliers come from traditional elemental correspondences:
 *
 *   🔥 FIRE (1.3):   Amplifies tension - Fire edges are CATALYTIC
 *                    Where change happens fast, conflict ignites, or
 *                    transformation accelerates. High risk, high reward.
 *
 *   💧 WATER (0.9):  Dampens tension - Water edges are ADAPTIVE
 *                    Flow adjusts to circumstances, conflicts dissolve,
 *                    but energy can also leak away if not channeled.
 *
 *   🌍 EARTH (0.8):  Stabilizes tension - Earth edges are FOUNDATIONAL
 *                    Slow, steady, reliable. Resistant to change but
 *                    provides the solid base other elements need.
 *
 *   🌬️ AIR (1.1):    Accelerates tension - Air edges are COMMUNICATIVE
 *                    Information flows quickly, ideas spread, but
 *                    can also create scattered energy if unfocused.
 *
 *   ✧ ETHER (1.0):   Neutral - Ether edges are INTEGRATIVE
 *                    Pure connection without elemental bias.
 *                    Represents the space where all elements meet.
 *
 * WHY THESE SPECIFIC MULTIPLIERS?
 * ────────────────────────────────
 * The multipliers are arranged around 1.0 (neutral):
 *   Fire (1.3) → Air (1.1) → Ether (1.0) → Water (0.9) → Earth (0.8)
 *
 * This creates a spectrum from CATALYTIC (Fire) to STABILIZING (Earth),
 * with Ether as the neutral center. The range (0.8 to 1.3) ensures
 * no element can dominate but each meaningfully colors the edge character.
 *
 * ════════════════════════════════════════════════════════════════════════════════
 * NOTES FOR FUTURE CLAUDE - 10 KEY INSIGHTS
 * ════════════════════════════════════════════════════════════════════════════════
 *
 * 1. This class is INDEPENDENT - no imports from other js/core/ files
 * 2. Dodecahedron has 30 edges (each face has 5 neighbors)
 * 3. Tension = 0 (Dissonance) to 1 (Resonance) - inverted from intuition!
 * 4. breathRatio: -1 to +1 (contraction to expansion)
 * 5. Elemental multipliers modify edge character (see section above)
 * 6. calculateTension() takes two Face objects, uses their faceEnergy
 * 7. Status states: Synergetic (both high), Depleted (both low), Flowing/Stable
 * 8. Used by: DodecahedronEngine (main.js) for relationship calculations
 * 9. flowDirection: 'expansion' (A→B), 'contraction' (B→A), or 'balanced'
 * 10. High synergy (0.9) when both faces >0.6 - this is the GOAL state
 *
 * ════════════════════════════════════════════════════════════════════════════════
 */

/**
 * Represents a connection between two faces.
 * Models the "Narrative Tension" or relationship archetype.
 *
 * Edge tension represents the quality of relationship between two
 * organizational domains:
 * - High tension (>0.7): Synergetic flow
 * - Low tension (<0.3): Depleted connection
 * - Medium tension: Stable or Flowing state
 *
 * @class Edge
 */
export class Edge {
  /**
   * Create a new Edge instance
   *
   * @param {Object} config - Configuration object
   * @param {string} config.id - Unique identifier
   * @param {number} config.faceAId - ID of first connected face
   * @param {number} config.faceBId - ID of second connected face
   * @param {string} config.archetype - Relationship archetype name
   * @param {string} config.description - Human-readable description
   * @param {string} config.element - Element type (Earth, Water, Fire, Air, Ether)
   */
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
   *
   * The tension calculation considers:
   * 1. Energy Delta: Absolute difference between face energies
   * 2. Breath Ratio: Flow direction (-1 contraction to +1 expansion)
   * 3. Elemental Multiplier: Element-specific amplification
   * 4. Harmonic Resonance: Special states for high/low energy pairs
   *
   * @param {Face} faceA - First connected face
   * @param {Face} faceB - Second connected face
   * @returns {number} Calculated tension (0-1)
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

// ============================================================================
// Backward compatibility: export to window for IIFE modules
// ============================================================================
if (typeof window !== 'undefined') {
  window.Edge = Edge;
}

console.log('   Edge module loaded');
