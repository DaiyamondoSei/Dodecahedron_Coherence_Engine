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
 * WHAT IS AN EDGE? THE MEMBRANE OF FLOW
 * ─────────────────────────────────────
 * An edge is where two organizational domains share a boundary.
 * Edge energy (geometric mean of face energies) tells us about
 * the quality and intensity of flow across that boundary.
 *
 * Think of edges as semi-permeable membranes:
 *   - Very low energy (Wall): No flow — domains isolated
 *   - Golden section energy (Membrane): Healthy flow — balanced exchange
 *   - Very high energy (Vortex): Intense — transformation or chaos
 *
 * ORGANIZATIONAL MEANING:
 * ───────────────────────
 * Consider the edge between "Human Capital" and "Operations":
 *   - If both faces are strong: Hemorrhage/Vortex (intense synergy, watch for overflow)
 *   - If Human is strong but Operations weak: Gate (flow is restricted)
 *   - If both are weak: Wall (no energy to move either way)
 *
 * ════════════════════════════════════════════════════════════════════════════════
 * THE PURE MEMBRANE MODEL
 * ════════════════════════════════════════════════════════════════════════════════
 *
 * FORMULA: E_edge = √(E_faceA × E_faceB)  (geometric mean)
 *
 * Why geometric mean instead of threshold-based detection?
 *   - No arbitrary constants (0.4, 0.6, 0.8, 0.9, 1.3 all eliminated)
 *   - If either face dies, the membrane collapses (√(x × 0) = 0)
 *   - Symmetry is naturally rewarded (√(0.5 × 0.5) = 0.5 > √(0.9 × 0.1) = 0.3)
 *   - The formula IS the relationship: the shared energy at the boundary
 *
 * HEALTH STATE MAPPING — φ-derived boundaries:
 *
 *   State       │ Range              │ Meaning
 *   ────────────┼────────────────────┼──────────────────────────
 *   Wall        │ [0, φ⁻⁴)          │ Blocked, impermeable
 *   Gate        │ [φ⁻⁴, φ⁻²)        │ Controlled, selective
 *   Membrane    │ [φ⁻², φ⁻¹)        │ Healthy flow (golden section)
 *   Hemorrhage  │ [φ⁻¹, 1−φ⁻⁴)      │ Over-flowing, leaking
 *   Vortex      │ [1−φ⁻⁴, 1.0]      │ Intense transformation
 *
 * The Membrane zone [φ⁻², φ⁻¹] IS the golden section of [0, 1].
 *
 * ELEMENT AS INTERPRETATION, NOT MULTIPLIER:
 * ──────────────────────────────────────────
 * The element stored on each edge is metadata — it does NOT modify the
 * energy value. Instead, element colors the INTERPRETATION through
 * Sacred Inquiry (js/constants/sacred-inquiry.js):
 *   5 health states × 5 elements = 25 inquiry patterns
 *
 * In the advanced visualization (unified-edge.js), the dominant element
 * EMERGES dynamically from face synergies: √(FaceA.element × FaceB.element)
 *
 * ════════════════════════════════════════════════════════════════════════════════
 * NOTES FOR FUTURE CLAUDE - 10 KEY INSIGHTS
 * ════════════════════════════════════════════════════════════════════════════════
 *
 * 1. This class is INDEPENDENT - no imports from other js/core/ files
 * 2. Dodecahedron has 30 edges (each face has 5 neighbors)
 * 3. Edge energy = geometric mean √(E_faceA × E_faceB), range [0, 1]
 * 4. breathRatio: -1 to +1 (contraction to expansion)
 * 5. Element is metadata only — does NOT modify the energy value
 * 6. calculateTension() takes two Face objects, uses their faceEnergy
 * 7. 5 health states: Wall / Gate / Membrane / Hemorrhage / Vortex
 * 8. Used by: DodecahedronEngine (main.js) for relationship calculations
 * 9. flowDirection: 'expansion' (A→B), 'contraction' (B→A), or 'balanced'
 * 10. Membrane [φ⁻², φ⁻¹] is the GOAL state — the golden section of [0,1]
 *
 * ════════════════════════════════════════════════════════════════════════════════
 */

// φ-derived constants (from PhiHarmonics SSOT, with inline fallback)
// These define the 5-state health mapping boundaries: Wall / Gate / Membrane / Hemorrhage / Vortex
const _PHI = (typeof PhiHarmonics !== 'undefined') ? PhiHarmonics.PHI : (1 + Math.sqrt(5)) / 2;
const _PHI_4 = (typeof PhiHarmonics !== 'undefined') ? PhiHarmonics.PHI_4 : Math.pow(_PHI, -4);    // φ⁻⁴ = 0.146
const _PHI_2 = (typeof PhiHarmonics !== 'undefined') ? PhiHarmonics.PHI_2 : 1 / (_PHI * _PHI);     // φ⁻² = 0.382
const _PHI_1 = (typeof PhiHarmonics !== 'undefined') ? PhiHarmonics.PHI_1 : 1 / _PHI;              // φ⁻¹ = 0.618
const _PSI_4 = (typeof PhiHarmonics !== 'undefined') ? PhiHarmonics.PSI_4 : 1 - _PHI_2 * _PHI_2;   // 1−φ⁻⁴ = 0.854

/**
 * Represents a connection between two faces.
 * Models the edge as a Pure Membrane — its energy is the geometric mean
 * of connected face energies, and its health state emerges from φ-derived boundaries.
 *
 * Edge energy (tension) = √(E_faceA × E_faceB)
 *
 * Health states via φ-derived boundaries:
 *   Wall       < φ⁻⁴ (0.146) — blocked, impermeable
 *   Gate       [φ⁻⁴, φ⁻²)    — controlled, selective
 *   Membrane   [φ⁻², φ⁻¹)    — healthy flow (THE golden section)
 *   Hemorrhage [φ⁻¹, ψ₄)     — over-flowing, leaking
 *   Vortex     ≥ ψ₄ (0.854)  — intense transformation
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
   * @param {string} config.element - Element type (metadata only, does not affect energy calculation)
   */
  constructor(config) {
    this.id = config.id || '';
    this.faceAId = parseInt(config.faceAId) || 0;
    this.faceBId = parseInt(config.faceBId) || 0;
    this.archetype = config.archetype || '';
    this.description = config.description || '';

    // State
    this.tension = 0; // Edge energy [0, 1] — Membrane [φ⁻², φ⁻¹] is healthy zone
    this.status = 'Neutral';
    this.breathRatio = 0;
    this.flowDirection = 'balanced';
    this.element = config.element || 'Ether';
  }

  /**
   * Calculate edge energy based on the geometric mean of connected faces
   *
   * PURE MEMBRANE MODEL: E_edge = √(E_faceA × E_faceB)
   *
   * Why geometric mean?
   * - If either face is zero, the edge collapses to zero (dead membrane)
   * - If both faces are equal, the edge equals them (perfect symmetry)
   * - Asymmetry is naturally penalized (√(0.9 × 0.1) = 0.3, not 0.5)
   *
   * Health state uses φ-derived boundaries (same as sacred-inquiry.js):
   *   Wall < φ⁻⁴ < Gate < φ⁻² < Membrane < φ⁻¹ < Hemorrhage < ψ₄ < Vortex
   *
   * Element is preserved as metadata but does NOT modify the energy value.
   * Element colors the INTERPRETATION (via Sacred Inquiry), not the number.
   *
   * @param {Face} faceA - First connected face
   * @param {Face} faceB - Second connected face
   * @returns {number} Edge energy (0-1)
   */
  calculateTension(faceA, faceB) {
    if (!faceA || !faceB) return 0;

    const e1 = faceA.faceEnergy;
    const e2 = faceB.faceEnergy;

    // 1. Edge Energy = geometric mean of connected face energies
    this.tension = Math.sqrt(e1 * e2);

    // 2. Breath Ratio (Flow Direction)
    // Positive = expansion (A to B), Negative = contraction (B to A)
    // Normalized to -1 to +1 range
    this.breathRatio = Math.max(-1.0, Math.min(1.0, (e2 - e1) * 2));

    if (Math.abs(this.breathRatio) < 0.1) this.flowDirection = 'balanced';
    else this.flowDirection = this.breathRatio > 0 ? 'expansion' : 'contraction';

    // 3. Health State — φ-derived 5-state mapping
    // Wall < φ⁻⁴ (0.146) < Gate < φ⁻² (0.382) < Membrane < φ⁻¹ (0.618) < Hemorrhage < ψ₄ (0.854) < Vortex
    if (this.tension < _PHI_4) {
      this.status = 'Wall';
    } else if (this.tension < _PHI_2) {
      this.status = 'Gate';
    } else if (this.tension < _PHI_1) {
      this.status = 'Membrane';
    } else if (this.tension < _PSI_4) {
      this.status = 'Hemorrhage';
    } else {
      this.status = 'Vortex';
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

Logger.info('Edge', 'Edge module loaded');
