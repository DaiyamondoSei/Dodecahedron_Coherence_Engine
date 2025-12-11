/**
 * @deprecated Since v2.0 - Backend Shadow Detection
 *
 * ⚠️ DEPRECATION NOTICE:
 * The canonical shadow detection logic has been consolidated into:
 *   js/advanced/shadow-detector.js
 *
 * This file is kept for reference only and should NOT be used for new development.
 * The frontend ShadowDetector now handles all shadow detection with:
 * - Configurable thresholds via SHADOW_CONFIG
 * - Standardized output via SHADOW_SCHEMA
 * - Integration with AI shadow generation (ai-shadow-adapter.js)
 *
 * If you need shadow detection functionality, import from:
 *   import { ShadowDetector, SHADOW_CONFIG } from '../js/advanced/shadow-detector.js';
 *
 * @see js/advanced/shadow-detector.js - Canonical implementation
 * @see js/ai/adapters/ai-shadow-adapter.js - AI shadow generation
 */

/**
 * ShadowPenaltyEngine - The Ethical Conscience of the System
 *
 * This implements the Shadow Penalty Rules from the Excel engine.
 * It detects archetypal patterns of organizational hypocrisy and applies
 * penalties to face energies that exhibit these patterns.
 *
 * The core principle: A high score is only TRUE if it doesn't create a "shadow" -
 * a corresponding hidden cost in another part of the system.
 *
 * When a shadow is detected, a penalty is applied, making the dissonance visible
 * and forcing the organization to confront its own contradictions.
 */

export class ShadowPenaltyEngine {
  constructor(tuningConstants) {
    this.tuning = tuningConstants;
    
    // Define the 6 archetypal shadow patterns
    this.shadowPatterns = {
      brittleProfit: {
        name: 'Brittle Profit',
        story: 'The organization is financially successful but fragile and on the verge of collapse. It is a tree with fruit but no roots.',
        checkFaces: [1, 11],  // Financial Capital or Funding Pipeline
        shadowFaces: [12],    // Risk & Resilience
        highThreshold: 0.7,
        lowThreshold: 0.3,
        penalty: this.tuning.shadowPenalties.brittleProfit
      },
      
      extractiveGrowth: {
        name: 'Extractive Growth',
        story: 'The organization grows its revenue by depleting the natural or social ecosystems it depends on. It is "sawing off the branch it is sitting on."',
        checkFaces: [1, 11],  // Financial Capital or Funding Pipeline
        shadowFaces: [9],     // Regenerative Flow
        highThreshold: 0.7,
        lowThreshold: 0.3,
        penalty: this.tuning.shadowPenalties.extractiveGrowth
      },
      
      experienceGap: {
        name: 'The Experience Gap (Trust Theater)',
        story: 'The organization has a brilliant marketing story and strong brand, but the actual experience of its product or culture is poor. The "say-do" gap.',
        checkFaces: [7, 5],   // Brand & Reputation or Market Resonance
        shadowFaces: [8, 3],  // Core Operations or Human Capital
        highThreshold: 0.7,
        lowThreshold: 0.3,
        penalty: this.tuning.shadowPenalties.experienceGap
      },
      
      burnoutEngine: {
        name: 'The Burnout Engine',
        story: 'The organization is incredibly efficient and productive, but achieves this by burning out its people. The machine is running perfectly, but the operators are collapsing.',
        checkFaces: [8],      // Core Operations
        shadowFaces: [3],     // Human Capital
        highThreshold: 0.7,
        lowThreshold: 0.3,
        penalty: this.tuning.shadowPenalties.burnoutEngine
      },
      
      hollowGovernance: {
        name: 'Hollow Governance',
        story: 'The organization has many formal rules and well-drafted documents, but lacks a true culture of integrity and lived values. The "bones" have no soul.',
        checkFaces: [4],      // Structural Capital
        shadowFaces: [10],    // Foundational Values
        highThreshold: 0.7,
        lowThreshold: 0.3,
        penalty: this.tuning.shadowPenalties.hollowGovernance
      },
      
      lonelyHero: {
        name: 'The Lonely Hero',
        story: 'The venture\'s vision and IP are brilliant, but it relies entirely on a single person or fragile network, making it un-investable and un-scalable.',
        checkFaces: [2],      // Intellectual Capital
        shadowFaces: [12],    // Risk & Resilience (specifically Bus Factor)
        highThreshold: 0.7,
        lowThreshold: 0.5,    // More lenient for Bus Factor
        penalty: this.tuning.shadowPenalties.lonelyHero,
        specialCondition: 'busFactor'  // Needs special handling
      }
    };
  }

  /**
   * Analyze the entire system for shadow patterns
   * 
   * @param {Array<Face>} faces - All 12 faces
   * @param {Map<string, KPI>} kpis - All KPIs (for special conditions like Bus Factor)
   * @returns {Object} Shadow analysis with detected patterns and penalties
   */
  analyze(faces, kpis = null) {
    const faceEnergies = {};
    faces.forEach(face => {
      faceEnergies[face.id] = face.faceEnergy;
    });

    const detectedPatterns = [];
    const penalties = {};  // faceId -> total penalty

    // Check each shadow pattern
    Object.entries(this.shadowPatterns).forEach(([patternKey, pattern]) => {
      const detection = this.checkPattern(pattern, faceEnergies, kpis);
      
      if (detection.isActive) {
        detectedPatterns.push({
          pattern: pattern.name,
          story: pattern.story,
          severity: detection.severity,
          penalty: pattern.penalty,
          affectedFaces: detection.affectedFaces,
          evidence: detection.evidence
        });

        // Apply penalty to the high-energy face(s)
        detection.affectedFaces.forEach(faceId => {
          if (!penalties[faceId]) penalties[faceId] = 0;
          penalties[faceId] += pattern.penalty;
        });
      }
    });

    // Calculate total penalties and ensure they don't exceed 1.0
    Object.keys(penalties).forEach(faceId => {
      penalties[faceId] = Math.min(penalties[faceId], 0.9); // Max 90% penalty
    });

    return {
      detectedPatterns: detectedPatterns,
      penalties: penalties,
      totalPatternsDetected: detectedPatterns.length,
      systemIntegrity: this.calculateSystemIntegrity(detectedPatterns)
    };
  }

  /**
   * Check if a specific shadow pattern is active
   */
  checkPattern(pattern, faceEnergies, kpis) {
    const result = {
      isActive: false,
      severity: 0,
      affectedFaces: [],
      evidence: {}
    };

    // Special handling for Lonely Hero (Bus Factor)
    if (pattern.specialCondition === 'busFactor' && kpis) {
      const busFactor = this.getBusFactor(kpis);
      if (busFactor === 1) {
        // Check if Intellectual Capital is high
        const checkFace = pattern.checkFaces[0];
        if (faceEnergies[checkFace] >= pattern.highThreshold) {
          result.isActive = true;
          result.affectedFaces = [checkFace];
          result.severity = 'high';
          result.evidence = {
            intellectualCapital: faceEnergies[checkFace],
            busFactor: busFactor,
            message: 'High IP value but critically dependent on single person'
          };
        }
      }
      return result;
    }

    // Standard pattern checking
    // Check if any "check face" is high
    const highFaces = pattern.checkFaces.filter(faceId => 
      faceEnergies[faceId] >= pattern.highThreshold
    );

    // Check if any "shadow face" is low
    const lowShadowFaces = pattern.shadowFaces.filter(faceId => 
      faceEnergies[faceId] <= pattern.lowThreshold
    );

    // Pattern is active if BOTH conditions are met
    if (highFaces.length > 0 && lowShadowFaces.length > 0) {
      result.isActive = true;
      result.affectedFaces = highFaces;
      
      // Calculate severity based on the gap
      const maxHighEnergy = Math.max(...highFaces.map(id => faceEnergies[id]));
      const minLowEnergy = Math.min(...lowShadowFaces.map(id => faceEnergies[id]));
      const gap = maxHighEnergy - minLowEnergy;
      
      if (gap > 0.6) result.severity = 'critical';
      else if (gap > 0.4) result.severity = 'high';
      else result.severity = 'moderate';

      result.evidence = {
        highFaces: highFaces.map(id => ({
          face: id,
          energy: faceEnergies[id]
        })),
        lowShadowFaces: lowShadowFaces.map(id => ({
          face: id,
          energy: faceEnergies[id]
        })),
        gap: gap
      };
    }

    return result;
  }

  /**
   * Get Bus Factor from KPIs (special case for Lonely Hero)
   */
  getBusFactor(kpis) {
    // Look for Bus Factor KPI (typically R1.1)
    const busFactorKPI = Array.from(kpis.values()).find(kpi => 
      kpi.id === 'R1.1' || kpi.name.toLowerCase().includes('bus factor')
    );
    
    return busFactorKPI ? busFactorKPI.value : null;
  }

  /**
   * Calculate overall system integrity based on detected patterns
   */
  calculateSystemIntegrity(detectedPatterns) {
    if (detectedPatterns.length === 0) {
      return {
        score: 1.0,
        status: 'Excellent',
        message: 'No shadow patterns detected. System is coherent and ethical.'
      };
    }

    const criticalCount = detectedPatterns.filter(p => p.severity === 'critical').length;
    const highCount = detectedPatterns.filter(p => p.severity === 'high').length;
    const moderateCount = detectedPatterns.filter(p => p.severity === 'moderate').length;

    // Calculate integrity score
    const integrityScore = 1.0 - (
      (criticalCount * 0.3) +
      (highCount * 0.2) +
      (moderateCount * 0.1)
    );

    let status, message;
    if (integrityScore >= 0.8) {
      status = 'Good';
      message = 'Minor integrity issues detected. Address when possible.';
    } else if (integrityScore >= 0.6) {
      status = 'Concerning';
      message = 'Multiple shadow patterns detected. Organizational integrity is at risk.';
    } else {
      status = 'Critical';
      message = 'Severe shadow patterns detected. Fundamental contradictions threaten sustainability.';
    }

    return {
      score: Math.max(0, integrityScore),
      status: status,
      message: message,
      breakdown: {
        critical: criticalCount,
        high: highCount,
        moderate: moderateCount
      }
    };
  }

  /**
   * Apply shadow penalties to face energies
   * 
   * @param {Object} faceEnergies - Map of faceId -> energy
   * @param {Object} penalties - Map of faceId -> penalty (0-1)
   * @returns {Object} Adjusted face energies
   */
  applyPenalties(faceEnergies, penalties) {
    const adjusted = { ...faceEnergies };
    
    Object.entries(penalties).forEach(([faceId, penalty]) => {
      const originalEnergy = adjusted[faceId];
      adjusted[faceId] = originalEnergy * (1 - penalty);
    });

    return adjusted;
  }

  /**
   * Generate recommendations for addressing shadow patterns
   */
  generateRecommendations(detectedPatterns) {
    return detectedPatterns.map(pattern => {
      let recommendation = '';
      
      switch (pattern.pattern) {
        case 'Brittle Profit':
          recommendation = 'Invest in resilience infrastructure: succession planning, knowledge documentation, system redundancy.';
          break;
        case 'Extractive Growth':
          recommendation = 'Transition to regenerative practices: circular design, ethical sourcing, local investment.';
          break;
        case 'The Experience Gap (Trust Theater)':
          recommendation = 'Bridge the say-do gap: improve operations/culture to match brand promise, or adjust messaging to match reality.';
          break;
        case 'The Burnout Engine':
          recommendation = 'Slow down execution pace. Invest in team well-being, psychological safety, and sustainable work rhythms.';
          break;
        case 'Hollow Governance':
          recommendation = 'Breathe soul into structure: clarify values, create rituals, ensure governance serves purpose.';
          break;
        case 'The Lonely Hero':
          recommendation = 'Build redundancy: document knowledge, train others, create a "cultural carrier" team.';
          break;
      }

      return {
        pattern: pattern.pattern,
        severity: pattern.severity,
        recommendation: recommendation,
        affectedFaces: pattern.affectedFaces
      };
    });
  }
}

