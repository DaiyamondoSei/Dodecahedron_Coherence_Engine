/**
 * Face Class - The 12 Faces of Organizational Reality
 * 
 * Each Face represents a fundamental domain of organizational life.
 * A Face holds 5 Elemental KPIs that interact in a pentagram pattern,
 * creating harmonics of health or discord.
 */

export class Face {
  /**
   * @param {number} id - Face ID (1-12)
   * @param {string} name - Name of this organizational domain
   * @param {Array<KPI>} elementalKPIs - The 5 elemental KPIs for this face
   * @param {string} archetype - The archetypal energy of this face
   * @param {number} currentOctave - Current octave level (1-7)
   * @param {Object} octaveProgressions - Octave-specific KPI configurations
   */
  constructor({
    id,
    name = '',
    elementalKPIs = [],
    archetype = '',
    color = '#ffffff',
    currentOctave = 1,
    octaveProgressions = {}
  }) {
    this.id = id;
    this.name = name;
    this.elementalKPIs = elementalKPIs; // Array of 5 KPIs
    this.archetype = archetype;
    this.color = color;
    this.currentOctave = currentOctave;
    this.octaveProgressions = octaveProgressions;
    
    // Pentagram indices - how the 5 elements interact
    // In a pentagram, each point connects to two non-adjacent points
    this.pentagramConnections = [
      [0, 2, 4], // Element 0 connects to 2 and 4
      [1, 3, 0], // Element 1 connects to 3 and 0
      [2, 4, 1], // Element 2 connects to 4 and 1
      [3, 0, 2], // Element 3 connects to 0 and 2
      [4, 1, 3]  // Element 4 connects to 1 and 3
    ];
    
    // Ball and Pillars structure
    this.ballKPI = null; // Primary KPI
    this.pillarKPIs = []; // 5 edge KPIs
    
    // Cache for calculated values
    this._faceEnergy = null;
    this._harmonicResonance = null;
    this._octaveCoherence = null;
  }

  /**
   * Get all KPIs for this face
   */
  get kpis() {
    return this.elementalKPIs;
  }

  /**
   * Calculate the base face energy (average of weighted KPI scores)
   */
  calculateBaseFaceEnergy() {
    if (this.elementalKPIs.length === 0) return 0;
    
    const totalWeight = this.elementalKPIs.reduce((sum, kpi) => sum + kpi.weight, 0);
    const weightedSum = this.elementalKPIs.reduce((sum, kpi) => sum + kpi.weightedScore, 0);
    
    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  }

  /**
   * Calculate harmonic resonance using pentagram geometry
   * This measures how well the 5 elements work together
   */
  calculateHarmonicResonance() {
    if (this.elementalKPIs.length < 5) return 0;
    
    let totalResonance = 0;
    
    // For each element, check its harmony with connected elements
    for (let i = 0; i < 5; i++) {
      const element = this.elementalKPIs[i];
      const connections = this.pentagramConnections[i];
      
      // Calculate resonance with each connected element
      for (const connectedIdx of connections.slice(0, 2)) {
        const connected = this.elementalKPIs[connectedIdx];
        
        // Resonance is higher when values are similar (harmony)
        const difference = Math.abs(element.normalizedScore - connected.normalizedScore);
        const resonance = 1.0 - difference;
        
        totalResonance += resonance;
      }
    }
    
    // Average resonance across all connections (10 total connections in pentagram)
    return totalResonance / 10;
  }

  /**
   * Calculate final face energy incorporating harmonic resonance
   * E_f = E_base × (1 + 0.3 × R_harmonic)
   * Where R_harmonic is the harmonic resonance factor
   */
  calculateFinalFaceEnergy() {
    const baseEnergy = this.calculateBaseFaceEnergy();
    const resonance = this.calculateHarmonicResonance();
    
    // Harmonic resonance can boost energy by up to 30%
    const harmonicBoost = 1.0 + (0.3 * resonance);
    
    return baseEnergy * harmonicBoost;
  }

  /**
   * Get face energy (cached)
   * Uses try-catch to prevent infinite retry loop on calculation errors
   */
  get faceEnergy() {
    if (this._faceEnergy === null) {
      try {
        this._faceEnergy = this.calculateFinalFaceEnergy();
      } catch (error) {
        console.error(`[Face ${this.id}] Error calculating face energy:`, error.message);
        this._faceEnergy = 0.5; // Default to neutral energy on error
      }
    }
    return this._faceEnergy;
  }

  /**
   * Get harmonic resonance (cached)
   * Uses try-catch to prevent infinite retry loop on calculation errors
   */
  get harmonicResonance() {
    if (this._harmonicResonance === null) {
      try {
        this._harmonicResonance = this.calculateHarmonicResonance();
      } catch (error) {
        console.error(`[Face ${this.id}] Error calculating harmonic resonance:`, error.message);
        this._harmonicResonance = 0.5; // Default to neutral resonance on error
      }
    }
    return this._harmonicResonance;
  }

  /**
   * Invalidate caches when KPIs change
   */
  invalidateCache() {
    this._faceEnergy = null;
    this._harmonicResonance = null;
    this._octaveCoherence = null;
  }

  /**
   * Get the most critical (lowest scoring) KPI on this face
   */
  get criticalKPI() {
    if (this.elementalKPIs.length === 0) return null;
    
    return this.elementalKPIs.reduce((lowest, kpi) => 
      kpi.normalizedScore < lowest.normalizedScore ? kpi : lowest
    );
  }

  /**
   * Get health status
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
   * Get color based on energy level
   */
  getEnergyColor() {
    const energy = this.faceEnergy;
    
    // Color gradient from red (0) to yellow (0.5) to green (1.0)
    if (energy >= 0.7) {
      // Green zone
      const t = (energy - 0.7) / 0.3;
      return this.interpolateColor('#66ff66', '#00ff00', t);
    } else if (energy >= 0.4) {
      // Yellow zone
      const t = (energy - 0.4) / 0.3;
      return this.interpolateColor('#ffff00', '#66ff66', t);
    } else {
      // Red zone
      const t = energy / 0.4;
      return this.interpolateColor('#ff0000', '#ffff00', t);
    }
  }

  /**
   * Helper to interpolate between two hex colors
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

  /**
   * Set the current octave level and update KPIs accordingly
   * @param {number} octaveLevel - The octave level (1-7)
   */
  setOctaveLevel(octaveLevel) {
    if (octaveLevel < 1 || octaveLevel > 7) {
      throw new Error('Octave level must be between 1 and 7');
    }
    
    this.currentOctave = octaveLevel;
    this.invalidateCache();
    
    // If we have octave progressions, update the ball and pillar KPIs
    if (this.octaveProgressions[octaveLevel]) {
      this.updateKPIsForOctave(octaveLevel);
    }
  }

  /**
   * Update KPIs based on octave progression data
   * @param {number} octaveLevel - The octave level
   */
  updateKPIsForOctave(octaveLevel) {
    const octaveData = this.octaveProgressions[octaveLevel];
    if (!octaveData) return;
    
    // Set ball KPI
    if (octaveData.ball) {
      this.ballKPI = octaveData.ball;
      this.ballKPI.kpiType = 'ball';
      this.ballKPI.weight = 1.5; // Ball has higher weight
    }
    
    // Set pillar KPIs
    if (octaveData.pillars && octaveData.pillars.length > 0) {
      this.pillarKPIs = octaveData.pillars.map((pillar, index) => {
        pillar.kpiType = 'pillar';
        pillar.weight = 1.0;
        return pillar;
      });
    }
    
    // Update elemental KPIs to include ball and pillars
    this.elementalKPIs = [this.ballKPI, ...this.pillarKPIs].filter(kpi => kpi !== null);
  }

  /**
   * Calculate octave coherence - how well the face aligns with its current octave
   * @returns {number} Coherence score (0-1)
   */
  calculateOctaveCoherence() {
    if (!this.ballKPI || this.pillarKPIs.length === 0) {
      return 0;
    }
    
    // Ball contributes 40%, pillars contribute 60%
    const ballWeight = 0.4;
    const pillarWeight = 0.6;
    
    // Ball coherence
    const ballScore = this.ballKPI.normalizedScore || 0;
    
    // Average pillar coherence
    const pillarScores = this.pillarKPIs.map(kpi => kpi.normalizedScore || 0);
    const avgPillarScore = pillarScores.reduce((sum, score) => sum + score, 0) / pillarScores.length;
    
    // Combined coherence
    const coherence = (ballScore * ballWeight) + (avgPillarScore * pillarWeight);
    
    // Apply octave progression penalty (higher octaves require higher coherence)
    const octavePenalty = 1 - (0.05 * (this.currentOctave - 1)); // 5% penalty per octave
    
    return coherence * octavePenalty;
  }

  /**
   * Get octave coherence (cached)
   * Uses try-catch to prevent infinite retry loop on calculation errors
   */
  get octaveCoherence() {
    if (this._octaveCoherence === null) {
      try {
        this._octaveCoherence = this.calculateOctaveCoherence();
      } catch (error) {
        console.error(`[Face ${this.id}] Error calculating octave coherence:`, error.message);
        this._octaveCoherence = 0.5; // Default to neutral coherence on error
      }
    }
    return this._octaveCoherence;
  }

  /**
   * Check if ready for next octave
   * @returns {boolean} True if ready to progress
   */
  isReadyForNextOctave() {
    // Need at least 80% coherence to progress
    return this.octaveCoherence >= 0.8 && this.currentOctave < 7;
  }

  /**
   * Get octave progression status
   * @returns {Object} Status information
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
   * Export to JSON
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      archetype: this.archetype,
      faceEnergy: this.faceEnergy,
      harmonicResonance: this.harmonicResonance,
      healthStatus: this.healthStatus,
      color: this.getEnergyColor(),
      elementalKPIs: this.elementalKPIs.map(kpi => kpi.toJSON()),
      criticalKPI: this.criticalKPI ? this.criticalKPI.id : null,
      currentOctave: this.currentOctave,
      octaveCoherence: this.octaveCoherence,
      octaveStatus: this.getOctaveStatus(),
      ballKPI: this.ballKPI ? this.ballKPI.toJSON() : null,
      pillarKPIs: this.pillarKPIs.map(kpi => kpi.toJSON())
    };
  }
}

