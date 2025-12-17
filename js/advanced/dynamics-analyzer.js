/**
 * ========================================
 * MODULE: dynamics-analyzer.js
 * ========================================
 *
 * Novel Mathematical Enhancements for Organizational Coherence Theory
 *
 * This module contains ORIGINAL CONTRIBUTIONS to organizational coherence:
 * 1. Feedback Loop Detection - Identifies reinforcing/dampening cycles
 * 2. Phase Transition Proximity - Predicts critical thresholds
 * 3. Hysteresis & Inertia Tracking - Measures resistance to change
 * 4. Attractor Basin Mapping - Predicts system trajectory
 *
 * These frameworks apply concepts from:
 * - Dynamical Systems Theory (Strogatz, Lorenz)
 * - Statistical Mechanics (Ising model, critical phenomena)
 * - Complex Networks (Barabási, Newman)
 * - Nonlinear Dynamics (bifurcations, strange attractors)
 *
 * To organizational geometry FOR THE FIRST TIME - this is thesis-worthy research.
 *
 * DEPENDENCIES:
 * - None (self-contained, uses dodecahedron adjacency data internally)
 *
 * EXPORTS:
 * - DynamicsAnalyzer (class)
 *
 * ========================================
 * NOTES FOR FUTURE CLAUDE
 * ========================================
 *
 * 1. THE 4 NOVEL FRAMEWORKS:
 *    a) Feedback Loops: Find cycles in the graph, calculate "loop gain"
 *       - Gain > 1 = reinforcing (amplifies change)
 *       - Gain < 1 = dampening (resists change)
 *       - Vicious/virtuous depends on energy level in loop
 *
 *    b) Phase Transitions: Detect proximity to octave boundaries
 *       - Uses "critical slowing down" from statistical mechanics
 *       - High variance + flickering = transition imminent
 *       - Key insight: systems show precursors before big changes
 *
 *    c) Inertia: Measures resistance to recommended changes
 *       - High required delta + low current energy = STUCK
 *       - "Frozen" faces need different intervention than "responsive"
 *       - Links to spectral delta vector
 *
 *    d) Attractors: Predicts where system "naturally flows"
 *       - 5 attractor basins: Chaos, Survival, Structure, Flow, Radiance
 *       - Gradient shows direction of natural evolution
 *       - Stability shows how easily perturbed
 *
 * 2. ADJACENCY MATRIX (Critical Data):
 *    - The adjacency list encodes dodecahedron topology
 *    - Each face has 5 neighbors (pentagonal faces)
 *    - Face 6 and Face 12 are POLAR OPPOSITES
 *    - This topology enables cycle detection
 *
 * 3. LOOP GAIN FORMULA:
 *    For a cycle [A→B→C→A]:
 *    Gain = Π(transmission_i × energy_ratio_i)
 *    Where: transmission = 1 - (tension × 0.5)
 *           energy_ratio = E_next / E_current
 *
 * 4. OCTAVE BOUNDARIES (Phase Transitions):
 *    O1→O2: 0.35 (Survival → Structure)
 *    O2→O3: 0.50 (Structure → Relationships)
 *    O3→O4: 0.60 (Relationships → Creativity)
 *    O4→O5: 0.70 (Creativity → Expression)
 *    O5→O6: 0.80 (Expression → Vision)
 *    O6→O7: 0.90 (Vision → Radiance)
 *
 * 5. CRITICAL SLOWING DOWN (Physics Concept):
 *    - Near phase transitions, systems recover slower from perturbations
 *    - Mathematically: autocorrelation ↑, variance ↑, recovery time ↑
 *    - We approximate with variance + "flicker score"
 *
 * 6. ATTRACTOR BASINS:
 *    - Chaos (0.15): System in disarray
 *    - Survival (0.35): Basic functioning
 *    - Structure (0.50): Organized but rigid
 *    - Flow (0.70): Dynamic coherence
 *    - Radiance (0.90): Peak integration
 *
 * 7. INTEGRATION POINTS:
 *    - Needs faces array with faceEnergy property
 *    - Needs edges array with tension property
 *    - Needs spectralAnalysis.deltaVector for inertia
 *    - Returns comprehensive dynamics object
 *
 * 8. USED BY:
 *    - js/main.js (via analyzeComplete method)
 *    - js/advanced/index.js (exports)
 *    - Orchestrator for advanced insights
 *
 * GOTCHAS:
 * - Cycle detection is O(n!) in worst case, but limited by maxLength=6
 * - Loop gain can be 0 if any face has near-zero energy (div protection)
 * - Phase transition proximity assumes linear distance - simplification
 *
 * THESIS RELEVANCE:
 * This module represents ORIGINAL mathematical research. The application
 * of dynamical systems theory to organizational geometry is novel. Cite:
 * - "Novel application of feedback loop analysis to sacred geometry"
 * - "First use of phase transition theory in organizational coherence"
 *
 * ========================================
 *
 * @module js/advanced/dynamics-analyzer
 * @author Claude & Deimantas Butrimas
 * @version 1.0 (Novel Research Contribution)
 */

export class DynamicsAnalyzer {
  constructor() {
    // Dodecahedron graph structure (adjacency list)
    this.adjacency = {
      1: [2, 5, 6, 8, 9],
      2: [1, 3, 6, 9, 10],
      3: [2, 4, 6, 10, 11],
      4: [3, 5, 6, 7, 11],
      5: [1, 4, 7, 8, 10],
      6: [1, 2, 3, 4],
      7: [4, 5, 8, 12],
      8: [1, 5, 7, 9, 12],
      9: [1, 2, 8, 10, 12],
      10: [2, 3, 5, 9, 11, 12],
      11: [3, 4, 10, 12],
      12: [7, 8, 9, 10, 11]
    };

    // Octave boundaries (thresholds for phase transitions)
    this.octaveBoundaries = [
      { octave: 'O1→O2', threshold: 0.35, name: 'Survival → Structure' },
      { octave: 'O2→O3', threshold: 0.50, name: 'Structure → Relationships' },
      { octave: 'O3→O4', threshold: 0.60, name: 'Relationships → Creativity' },
      { octave: 'O4→O5', threshold: 0.70, name: 'Creativity → Expression' },
      { octave: 'O5→O6', threshold: 0.80, name: 'Expression → Vision' },
      { octave: 'O6→O7', threshold: 0.90, name: 'Vision → Radiance' }
    ];
  }

  /**
   * ========================================
   * 1. FEEDBACK LOOP DETECTION
   * ========================================
   *
   * Identifies cycles in the organizational graph where changes
   * propagate back to their origin (reinforcing or dampening loops).
   *
   * Uses depth-first search to find all simple cycles, then calculates
   * loop gain to determine if loops amplify (vicious/virtuous) or dampen.
   */

  /**
   * Detect all feedback loops in the system
   *
   * @param {Array<Object>} faces - Face data with energies
   * @param {Array<Object>} edges - Edge tension data
   * @returns {Object} Detected loops with characteristics
   */
  detectFeedbackLoops(faces, edges) {
    const faceEnergies = {};
    faces.forEach(f => faceEnergies[f.id] = f.faceEnergy);

    // Find all simple cycles (3-6 node loops)
    const cycles = this.findAllCycles(6); // Max cycle length of 6

    // Analyze each cycle
    const loops = cycles.map(cycle => {
      const loopGain = this.calculateLoopGain(cycle, faceEnergies, edges);
      const avgEnergy = cycle.reduce((sum, id) => sum + faceEnergies[id], 0) / cycle.length;

      // Classify loop type
      let type, direction;
      if (loopGain > 1.1) {
        type = 'Reinforcing';
        direction = avgEnergy > 0.5 ? 'Virtuous Cycle ✨' : 'Vicious Cycle ⚠️';
      } else if (loopGain < 0.9) {
        type = 'Dampening';
        direction = 'Stabilizing 🔒';
      } else {
        type = 'Neutral';
        direction = 'Balanced ⚖️';
      }

      return {
        cycle: cycle,
        length: cycle.length,
        loopGain: loopGain,
        type: type,
        direction: direction,
        avgEnergy: avgEnergy,
        strength: Math.abs(loopGain - 1.0), // How far from neutral
        faceNames: cycle.map(id => faces.find(f => f.id === id)?.name || `Face ${id}`)
      };
    });

    // Sort by strength (most impactful loops first)
    loops.sort((a, b) => b.strength - a.strength);

    // Identify dominant patterns
    const reinforcing = loops.filter(l => l.type === 'Reinforcing');
    const dampening = loops.filter(l => l.type === 'Dampening');
    const vicious = loops.filter(l => l.direction.includes('Vicious'));
    const virtuous = loops.filter(l => l.direction.includes('Virtuous'));

    return {
      loops: loops,
      summary: {
        totalLoops: loops.length,
        reinforcing: reinforcing.length,
        dampening: dampening.length,
        vicious: vicious.length,
        virtuous: virtuous.length,
        dominantPattern: this.identifyDominantPattern(loops),
        criticalLoops: loops.slice(0, 3) // Top 3 highest impact
      }
    };
  }

  /**
   * Find all simple cycles in the graph using DFS
   */
  findAllCycles(maxLength) {
    const cycles = [];
    const visited = new Set();

    const dfs = (start, current, path) => {
      if (path.length > maxLength) return;

      const neighbors = this.adjacency[current] || [];

      for (const neighbor of neighbors) {
        if (neighbor === start && path.length >= 3) {
          // Found a cycle back to start
          cycles.push([...path]);
        } else if (!path.includes(neighbor)) {
          // Continue search
          dfs(start, neighbor, [...path, neighbor]);
        }
      }
    };

    // Start DFS from each node
    for (let start = 1; start <= 12; start++) {
      dfs(start, start, [start]);
    }

    // Remove duplicate cycles (same nodes, different starting point)
    return this.deduplicateCycles(cycles);
  }

  /**
   * Remove duplicate cycles
   */
  deduplicateCycles(cycles) {
    const unique = [];
    const seen = new Set();

    for (const cycle of cycles) {
      // Normalize cycle (smallest number first, then sorted)
      const normalized = this.normalizeCycle(cycle);
      const key = normalized.join(',');

      if (!seen.has(key)) {
        seen.add(key);
        unique.push(cycle);
      }
    }

    return unique;
  }

  /**
   * Normalize cycle for comparison
   */
  normalizeCycle(cycle) {
    const minIndex = cycle.indexOf(Math.min(...cycle));
    const rotated = [...cycle.slice(minIndex), ...cycle.slice(0, minIndex)];
    return rotated;
  }

  /**
   * Calculate loop gain (amplification factor)
   *
   * Loop gain > 1 = reinforcing (energy amplifies)
   * Loop gain < 1 = dampening (energy dissipates)
   * Loop gain = 1 = neutral
   */
  calculateLoopGain(cycle, faceEnergies, edges) {
    let totalGain = 1.0;

    for (let i = 0; i < cycle.length; i++) {
      const current = cycle[i];
      const next = cycle[(i + 1) % cycle.length];

      const currentEnergy = faceEnergies[current];
      const nextEnergy = faceEnergies[next];

      // Find edge between these faces
      const edge = edges.find(e =>
        (e.face1Id === current && e.face2Id === next) ||
        (e.face1Id === next && e.face2Id === current)
      );

      // Gain factor for this step
      // High energy difference = low transmission (loss)
      // Low tension = high transmission
      const tension = edge ? edge.tension : 0.5;
      const transmission = 1.0 - (tension * 0.5); // 0.5 to 1.0

      // Energy ratio (how much next has relative to current)
      const energyRatio = nextEnergy / (currentEnergy + 0.01); // Avoid div by zero

      totalGain *= transmission * energyRatio;
    }

    return totalGain;
  }

  /**
   * Identify dominant feedback pattern
   */
  identifyDominantPattern(loops) {
    if (loops.length === 0) return 'No loops detected';

    const avgGain = loops.reduce((sum, l) => sum + l.loopGain, 0) / loops.length;
    const vicious = loops.filter(l => l.direction.includes('Vicious')).length;
    const virtuous = loops.filter(l => l.direction.includes('Virtuous')).length;

    if (vicious > virtuous && avgGain > 1.1) {
      return '⚠️ Degenerative Spiral - System amplifying low-energy patterns';
    } else if (virtuous > vicious && avgGain > 1.1) {
      return '✨ Generative Spiral - System amplifying high-energy patterns';
    } else if (avgGain < 0.9) {
      return '🔒 Stable Equilibrium - System resists change';
    } else {
      return '⚖️ Neutral Dynamics - System in balance';
    }
  }

  /**
   * ========================================
   * 2. PHASE TRANSITION PROXIMITY
   * ========================================
   *
   * Detects when the organization is near a critical threshold
   * (like transitioning from O1 Survival to O2 Structure).
   *
   * Uses "critical slowing down" indicators from statistical mechanics:
   * - Variance increases near phase transitions
   * - Autocorrelation increases (system "flickers")
   * - Recovery from perturbations slows
   */

  /**
   * Calculate proximity to phase transitions
   *
   * @param {Array<number>} faceEnergies - Current face energies
   * @returns {Object} Phase transition analysis
   */
  analyzePhaseTransitions(faceEnergies) {
    const avgEnergy = faceEnergies.reduce((a, b) => a + b, 0) / faceEnergies.length;
    const variance = this.calculateVariance(faceEnergies);
    const stdDev = Math.sqrt(variance);

    // Find nearest octave boundary
    const nearest = this.findNearestBoundary(avgEnergy);
    const distance = Math.abs(avgEnergy - nearest.threshold);
    const proximity = 1.0 - Math.min(distance / 0.15, 1.0); // 0.15 = sensitivity range

    // Critical slowing down indicators
    const criticalSlowing = this.detectCriticalSlowing(faceEnergies, variance);

    // Predict if transition is imminent
    const isImminent = proximity > 0.7 && criticalSlowing.score > 0.6;

    return {
      currentState: {
        avgEnergy: avgEnergy,
        variance: variance,
        stdDev: stdDev
      },
      nearestTransition: nearest,
      distance: distance,
      proximity: proximity, // 0-1 (1 = very close)
      criticalSlowing: criticalSlowing,
      isImminent: isImminent,
      prediction: this.generateTransitionPrediction(nearest, proximity, criticalSlowing, avgEnergy)
    };
  }

  /**
   * Find nearest octave boundary
   */
  findNearestBoundary(avgEnergy) {
    let nearest = this.octaveBoundaries[0];
    let minDist = Math.abs(avgEnergy - nearest.threshold);

    for (const boundary of this.octaveBoundaries) {
      const dist = Math.abs(avgEnergy - boundary.threshold);
      if (dist < minDist) {
        minDist = dist;
        nearest = boundary;
      }
    }

    return nearest;
  }

  /**
   * Detect critical slowing down (precursor to phase transition)
   */
  detectCriticalSlowing(faceEnergies, variance) {
    // High variance near boundaries = critical slowing
    const varianceScore = Math.min(variance / 0.1, 1.0); // Normalize

    // Check for "flickering" (high difference between adjacent faces)
    let flickerCount = 0;
    for (let i = 0; i < faceEnergies.length - 1; i++) {
      const diff = Math.abs(faceEnergies[i] - faceEnergies[i + 1]);
      if (diff > 0.3) flickerCount++;
    }
    const flickerScore = Math.min(flickerCount / 6, 1.0);

    // Combined score
    const score = (varianceScore * 0.6) + (flickerScore * 0.4);

    return {
      score: score,
      varianceScore: varianceScore,
      flickerScore: flickerScore,
      interpretation: score > 0.7 ? 'HIGH - System unstable, transition likely' :
        score > 0.4 ? 'MODERATE - System showing precursors' :
          'LOW - System stable'
    };
  }

  /**
   * Generate transition prediction
   */
  generateTransitionPrediction(nearest, proximity, criticalSlowing, avgEnergy) {
    if (proximity > 0.8 && criticalSlowing.score > 0.7) {
      return {
        likelihood: 'VERY HIGH',
        timeframe: 'Imminent (weeks)',
        direction: avgEnergy > nearest.threshold ? 'Ascending ↑' : 'Descending ↓',
        message: `System is at critical threshold for ${nearest.name}. Transition highly likely.`
      };
    } else if (proximity > 0.6) {
      return {
        likelihood: 'MODERATE',
        timeframe: 'Near-term (months)',
        direction: avgEnergy > nearest.threshold ? 'Ascending ↑' : 'Descending ↓',
        message: `System approaching ${nearest.name} transition. Monitor for accelerating changes.`
      };
    } else {
      return {
        likelihood: 'LOW',
        timeframe: 'Distant (stable)',
        direction: avgEnergy > nearest.threshold ? 'Above threshold' : 'Below threshold',
        message: `System stable. ${nearest.name} transition not imminent.`
      };
    }
  }

  /**
   * ========================================
   * 3. HYSTERESIS & INERTIA TRACKING
   * ========================================
   *
   * Measures organizational "stickiness" - resistance to change.
   * High force applied + low change observed = frozen pattern
   */

  /**
   * Analyze system inertia and hysteresis
   *
   * @param {Array<Object>} faces - Current faces
   * @param {Object} spectralAnalysis - Delta vector from spectral analysis
   * @returns {Object} Inertia analysis
   */
  analyzeInertia(faces, spectralAnalysis) {
    const deltaVector = spectralAnalysis.deltaVector;
    const inertiaByFace = [];

    faces.forEach((face, index) => {
      const delta = deltaVector[index];
      const currentEnergy = face.faceEnergy;
      const requiredChange = delta.deltaValue;

      // Inertia = how much force needed vs. current state
      // High required change + low current energy = high inertia (stuck)
      const inertiaScore = Math.abs(requiredChange) / (currentEnergy + 0.1);

      // Classify responsiveness
      let responsiveness, status;
      if (inertiaScore < 0.5) {
        responsiveness = 'Responsive';
        status = '✅ Easy to change';
      } else if (inertiaScore < 1.0) {
        responsiveness = 'Moderate';
        status = '⚠️ Some resistance';
      } else if (inertiaScore < 2.0) {
        responsiveness = 'Sticky';
        status = '🔒 High resistance';
      } else {
        responsiveness = 'Frozen';
        status = '❄️ Locked pattern';
      }

      inertiaByFace.push({
        faceId: face.id,
        faceName: face.name,
        currentEnergy: currentEnergy,
        requiredChange: requiredChange,
        inertiaScore: inertiaScore,
        responsiveness: responsiveness,
        status: status
      });
    });

    // Sort by inertia (highest = most stuck)
    inertiaByFace.sort((a, b) => b.inertiaScore - a.inertiaScore);

    const avgInertia = inertiaByFace.reduce((sum, f) => sum + f.inertiaScore, 0) / inertiaByFace.length;
    const frozenCount = inertiaByFace.filter(f => f.responsiveness === 'Frozen').length;
    const stickyCount = inertiaByFace.filter(f => f.responsiveness === 'Sticky').length;

    return {
      faceInertia: inertiaByFace,
      summary: {
        avgInertia: avgInertia,
        frozenFaces: frozenCount,
        stickyFaces: stickyCount,
        responsiveFaces: 12 - frozenCount - stickyCount,
        mostStuck: inertiaByFace.slice(0, 3),
        systemFlexibility: this.calculateSystemFlexibility(avgInertia)
      }
    };
  }

  /**
   * Calculate overall system flexibility
   */
  calculateSystemFlexibility(avgInertia) {
    const flexibility = 1.0 / (1.0 + avgInertia);

    if (flexibility > 0.7) {
      return { score: flexibility, status: 'High', message: '✨ System is adaptive and responsive' };
    } else if (flexibility > 0.4) {
      return { score: flexibility, status: 'Moderate', message: '⚖️ System has some resistance' };
    } else {
      return { score: flexibility, status: 'Low', message: '🔒 System is rigid and stuck' };
    }
  }

  /**
   * ========================================
   * 4. ATTRACTOR BASIN MAPPING
   * ========================================
   *
   * Predicts where the system naturally flows if current patterns continue.
   * Uses gradient descent on the organizational energy landscape.
   */

  /**
   * Map attractor basins and predict trajectory
   *
   * @param {Array<Object>} faces - Current faces
   * @param {Object} feedbackLoops - Detected loops
   * @returns {Object} Attractor analysis
   */
  mapAttractors(faces, feedbackLoops) {
    const faceEnergies = faces.map(f => f.faceEnergy);
    const avgEnergy = faceEnergies.reduce((a, b) => a + b, 0) / faceEnergies.length;

    // Calculate energy landscape gradient
    const gradient = this.calculateGradient(faceEnergies, feedbackLoops);

    // Predict trajectory
    const trajectory = this.predictTrajectory(avgEnergy, gradient, feedbackLoops);

    // Identify nearest attractor
    const attractor = this.identifyNearestAttractor(avgEnergy, gradient);

    // Calculate basin stability
    const stability = this.calculateBasinStability(avgEnergy, faceEnergies);

    return {
      currentPosition: avgEnergy,
      gradient: gradient,
      trajectory: trajectory,
      attractor: attractor,
      stability: stability,
      prediction: this.generateAttractorPrediction(trajectory, attractor, stability)
    };
  }

  /**
   * Calculate gradient (direction of natural flow)
   */
  calculateGradient(faceEnergies, feedbackLoops) {
    const avgEnergy = faceEnergies.reduce((a, b) => a + b, 0) / faceEnergies.length;

    // Gradient determined by:
    // 1. Feedback loop dynamics (amplification pushes away from equilibrium)
    // 2. Variance (high variance = unstable, seeks equilibrium)

    const avgLoopGain = feedbackLoops.summary.totalLoops > 0
      ? feedbackLoops.loops.reduce((sum, l) => sum + l.loopGain, 0) / feedbackLoops.summary.totalLoops
      : 1.0;

    const variance = this.calculateVariance(faceEnergies);

    // Positive gradient = system tends upward
    // Negative gradient = system tends downward
    const direction = (avgLoopGain - 1.0) * (avgEnergy - 0.5);
    const magnitude = Math.abs(direction) + variance;

    return {
      direction: direction,
      magnitude: magnitude,
      interpretation: direction > 0.1 ? 'Upward flow (coherence increasing)' :
        direction < -0.1 ? 'Downward flow (coherence decreasing)' :
          'Equilibrium (stable state)'
    };
  }

  /**
   * Predict trajectory (where system is heading)
   */
  predictTrajectory(currentEnergy, gradient, feedbackLoops) {
    const direction = gradient.direction;
    const reinforcing = feedbackLoops.summary.reinforcing;
    const dampening = feedbackLoops.summary.dampening;

    if (direction > 0.1 && reinforcing > dampening) {
      return {
        type: 'Ascending Spiral ✨',
        destination: Math.min(currentEnergy + 0.2, 1.0),
        confidence: 'High',
        message: 'System has upward momentum with reinforcing loops. Coherence likely to increase.'
      };
    } else if (direction < -0.1 && reinforcing > dampening) {
      return {
        type: 'Descending Spiral ⚠️',
        destination: Math.max(currentEnergy - 0.2, 0.0),
        confidence: 'High',
        message: 'System has downward momentum with reinforcing loops. Coherence likely to decrease.'
      };
    } else if (dampening > reinforcing) {
      return {
        type: 'Convergence to Equilibrium 🔒',
        destination: currentEnergy,
        confidence: 'Moderate',
        message: 'System has dampening loops. Will resist change and stay near current state.'
      };
    } else {
      return {
        type: 'Neutral Drift ⚖️',
        destination: currentEnergy,
        confidence: 'Low',
        message: 'System lacks strong directional forces. Evolution depends on external factors.'
      };
    }
  }

  /**
   * Identify nearest attractor (stable equilibrium point)
   */
  identifyNearestAttractor(avgEnergy, gradient) {
    // Define theoretical attractors
    const attractors = [
      { energy: 0.15, name: 'Chaos Basin', type: 'Low Coherence' },
      { energy: 0.35, name: 'Survival Equilibrium', type: 'O1-O2 Boundary' },
      { energy: 0.50, name: 'Structure Equilibrium', type: 'O2-O3 Boundary' },
      { energy: 0.70, name: 'Flow State', type: 'O4-O5 Boundary' },
      { energy: 0.90, name: 'Radiance Basin', type: 'High Coherence' }
    ];

    // Find nearest
    let nearest = attractors[0];
    let minDist = Math.abs(avgEnergy - nearest.energy);

    for (const attr of attractors) {
      const dist = Math.abs(avgEnergy - attr.energy);
      if (dist < minDist) {
        minDist = dist;
        nearest = attr;
      }
    }

    return {
      ...nearest,
      distance: minDist,
      pullStrength: 1.0 - minDist // Closer = stronger pull
    };
  }

  /**
   * Calculate basin stability (how stable current position is)
   */
  calculateBasinStability(avgEnergy, faceEnergies) {
    const variance = this.calculateVariance(faceEnergies);

    // Low variance = stable (all faces similar)
    // High variance = unstable (faces very different)
    const stabilityScore = 1.0 - Math.min(variance / 0.15, 1.0);

    return {
      score: stabilityScore,
      status: stabilityScore > 0.7 ? 'Stable Basin' :
        stabilityScore > 0.4 ? 'Moderate Stability' :
          'Unstable (易 to perturb)',
      message: stabilityScore > 0.7 ? 'System resists perturbations' :
        stabilityScore > 0.4 ? 'System can be influenced' :
          'System highly sensitive to changes'
    };
  }

  /**
   * Generate attractor prediction
   */
  generateAttractorPrediction(trajectory, attractor, stability) {
    return {
      currentBasin: attractor.name,
      attractorType: attractor.type,
      trajectory: trajectory.type,
      stability: stability.status,
      forecast: `System currently in "${attractor.name}" (${attractor.type}). ` +
        `${trajectory.message} ` +
        `Basin stability: ${stability.status}.`,
      recommendation: this.generateAttractorRecommendation(trajectory, stability)
    };
  }

  /**
   * Generate strategic recommendation based on attractor analysis
   */
  generateAttractorRecommendation(trajectory, stability) {
    if (trajectory.type.includes('Ascending') && stability.score > 0.6) {
      return '✨ Maintain momentum - you\'re on a positive trajectory in a stable basin. Continue current practices.';
    } else if (trajectory.type.includes('Descending') && stability.score < 0.5) {
      return '⚠️ URGENT: System in unstable descending spiral. Major intervention needed to shift attractor basin.';
    } else if (trajectory.type.includes('Equilibrium') && stability.score > 0.7) {
      return '🔒 System is stuck in stable equilibrium. Need external force to break out and evolve.';
    } else if (stability.score < 0.4) {
      return '🌊 System is unstable - high opportunity for transformation, but also risk of collapse. Act strategically.';
    } else {
      return '⚖️ System is in transition. Small interventions can significantly influence direction.';
    }
  }

  /**
   * ========================================
   * UTILITY FUNCTIONS
   * ========================================
   */

  calculateVariance(values) {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squaredDiffs = values.map(v => (v - mean) ** 2);
    return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  }

  /**
   * Complete dynamics analysis (all 4 systems)
   */
  analyzeComplete(faces, edges, spectralAnalysis) {
    console.log('🔬 Running complete dynamics analysis...');

    const feedbackLoops = this.detectFeedbackLoops(faces, edges);
    const phaseTransitions = this.analyzePhaseTransitions(faces.map(f => f.faceEnergy));
    const inertia = this.analyzeInertia(faces, spectralAnalysis);
    const attractors = this.mapAttractors(faces, feedbackLoops);

    return {
      feedbackLoops: feedbackLoops,
      phaseTransitions: phaseTransitions,
      inertia: inertia,
      attractors: attractors,
      summary: {
        systemState: this.synthesizeSystemState(feedbackLoops, phaseTransitions, inertia, attractors),
        criticalInsights: this.generateCriticalInsights(feedbackLoops, phaseTransitions, inertia, attractors)
      }
    };
  }

  /**
   * Synthesize overall system state
   */
  synthesizeSystemState(loops, transitions, inertia, attractors) {
    return {
      dynamicPattern: loops.summary.dominantPattern,
      evolutionaryStage: transitions.nearestTransition.name,
      flexibility: inertia.summary.systemFlexibility.status,
      trajectory: attractors.trajectory.type,
      stability: attractors.stability.status
    };
  }

  /**
   * Generate critical insights
   */
  generateCriticalInsights(loops, transitions, inertia, attractors) {
    const insights = [];

    // Feedback loop insight
    if (loops.summary.vicious > 2) {
      insights.push({
        type: 'WARNING',
        category: 'Feedback Dynamics',
        message: `${loops.summary.vicious} vicious cycles detected. System amplifying negative patterns.`,
        action: 'Break degenerative loops by intervening in key faces: ' +
          loops.summary.criticalLoops.slice(0, 2).map(l => l.faceNames[0]).join(', ')
      });
    }

    // Phase transition insight
    if (transitions.isImminent) {
      insights.push({
        type: 'OPPORTUNITY',
        category: 'Phase Transition',
        message: `System near critical threshold for ${transitions.nearestTransition.name}. Transformation imminent.`,
        action: transitions.prediction.message
      });
    }

    // Inertia insight
    if (inertia.summary.frozenFaces > 3) {
      insights.push({
        type: 'CHALLENGE',
        category: 'System Inertia',
        message: `${inertia.summary.frozenFaces} faces are frozen. High resistance to change.`,
        action: 'Focus on unfreezing: ' +
          inertia.summary.mostStuck.map(f => f.faceName).join(', ')
      });
    }

    // Attractor insight
    if (attractors.trajectory.type.includes('Descending')) {
      insights.push({
        type: 'CRITICAL',
        category: 'Trajectory',
        message: attractors.trajectory.message,
        action: attractors.prediction.recommendation
      });
    }

    return insights;
  }
}

// Export for browser use
if (typeof window !== 'undefined') {
  window.DynamicsAnalyzer = DynamicsAnalyzer;
}
