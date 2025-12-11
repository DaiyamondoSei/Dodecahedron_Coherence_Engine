/**
 * ShadowDetector - Browser-Compatible Edition
 *
 * The Ethical Conscience of the System
 *
 * Detects archetypal patterns of organizational hypocrisy and contradiction.
 * A high score is only TRUE if it doesn't create a "shadow" - a hidden cost elsewhere.
 *
 * The 6 Shadow Patterns:
 * 1. Brittle Profit - High finance, low resilience
 * 2. Extractive Growth - High revenue, low regeneration
 * 3. Experience Gap - High brand, low operations
 * 4. Burnout Engine - High operations, low human capital
 * 5. Hollow Governance - High structure, low values
 * 6. Lonely Hero - High IP, Bus Factor = 1
 *
 * USAGE:
 * const detector = new ShadowDetector();
 * const analysis = detector.analyze(facesData, kpisData);
 * const shadows = analysis.detectedPatterns;
 *
 * @author Deimantas Butrimas & Claude
 * @version 2.1 (Normalized Output Edition)
 */

// ═══════════════════════════════════════════════════════════════════════════════
// SHADOW CONFIGURATION - Single Source of Truth
// ═══════════════════════════════════════════════════════════════════════════════
export const SHADOW_CONFIG = {
  thresholds: {
    HIGH: 0.7,              // Face energy considered "high"
    LOW: 0.3,               // Face energy considered "low"
    BUS_FACTOR_LOW: 0.5     // More lenient threshold for Bus Factor
  },
  severityGaps: {
    CRITICAL: 0.6,          // Gap > 0.6 = critical severity
    HIGH: 0.4               // Gap > 0.4 = high severity, else moderate
  },
  penalties: {
    brittleProfit: 0.25,
    extractiveGrowth: 0.30,
    experienceGap: 0.20,
    burnoutEngine: 0.35,
    hollowGovernance: 0.15,
    lonelyHero: 0.25
  }
};

/**
 * Canonical Shadow Object Schema
 * All shadow sources must normalize to this structure for interoperability
 */
export const SHADOW_SCHEMA = {
  required: ['id', 'name', 'involvedFaces', 'severity', 'suppressed', 'integrated'],
  optional: ['prescription', 'logic', 'icon', 'penalty', 'score', 'evidence', 'source', 'affectedFaces']
};

/**
 * Validates a shadow object has required fields
 * @param {Object} shadow - Shadow to validate
 * @returns {boolean} - True if valid
 */
export function validateShadow(shadow) {
  if (!shadow || typeof shadow !== 'object') {
    console.warn('[Shadow] Invalid shadow object:', shadow);
    return false;
  }
  const missing = SHADOW_SCHEMA.required.filter(field => !shadow[field]);
  if (missing.length > 0) {
    console.warn(`[Shadow] Missing required fields: ${missing.join(', ')}`, shadow);
    return false;
  }
  return true;
}

// PHI-derived constants for mathematical harmony
const PHI = 1.618033988749895;
const PHI_INV = 0.618033988749895;              // φ^-1
const PHI_INV_SQUARED = 0.381966011250105;      // φ^-2
const PHI_INV_CUBED = 0.2360679774997896;       // φ^-3
const PHI_INV_4 = 0.1458980337503153;           // φ^-4

export class ShadowDetector {
  constructor(tuningConfig = null) {
    // Default tuning constants (can be overridden)
    // Default tuning if not provided
    this.tuning = tuningConfig || {
      shadowPenalties: {
        brittleProfit: 0.25,      // 25% penalty
        extractiveGrowth: 0.30,   // 30% penalty (more severe)
        experienceGap: 0.20,      // 20% penalty
        burnoutEngine: 0.35,      // 35% penalty (most severe)
        hollowGovernance: 0.15,   // 15% penalty
        lonelyHero: 0.25          // 25% penalty
      }
    };

    // Ensure shadowPenalties exists even if tuning was provided but incomplete
    if (!this.tuning.shadowPenalties) {
      this.tuning.shadowPenalties = {
        brittleProfit: 0.25,
        extractiveGrowth: 0.30,
        experienceGap: 0.20,
        burnoutEngine: 0.35,
        hollowGovernance: 0.15,
        lonelyHero: 0.25
      };
    }

    // Define the 6 archetypal shadow patterns
    this.shadowPatterns = {
      brittleProfit: {
        name: 'Brittle Profit',
        story: 'The organization is financially successful but fragile and on the verge of collapse. It is a tree with fruit but no roots.',
        integrated: 'Antifragile Wealth - Financial success built on deep resilience. The roots are as strong as the fruit is abundant.',
        prescription: 'Invest in resilience infrastructure: succession planning, knowledge documentation, system redundancy.',
        checkFaces: [1, 11],  // Financial Capital or Funding Pipeline
        shadowFaces: [12],    // Risk & Resilience
        highThreshold: SHADOW_CONFIG.thresholds.HIGH,
        lowThreshold: SHADOW_CONFIG.thresholds.LOW,
        penalty: this.tuning.shadowPenalties.brittleProfit,
        icon: '💰❌🛡️'
      },

      extractiveGrowth: {
        name: 'Extractive Growth',
        story: 'The organization grows its revenue by depleting the natural or social ecosystems it depends on. It is "sawing off the branch it is sitting on."',
        integrated: 'Regenerative Prosperity - Growth that feeds and renews the ecosystems it depends on. The more you give, the more you grow.',
        prescription: 'Transition to regenerative practices: circular design, ethical sourcing, local investment.',
        checkFaces: [1, 11],  // Financial Capital or Funding Pipeline
        shadowFaces: [9],     // Regenerative Flow
        highThreshold: SHADOW_CONFIG.thresholds.HIGH,
        lowThreshold: SHADOW_CONFIG.thresholds.LOW,
        penalty: this.tuning.shadowPenalties.extractiveGrowth,
        icon: '📈❌🌱'
      },

      experienceGap: {
        name: 'The Experience Gap (Trust Theater)',
        story: 'The organization has a brilliant marketing story and strong brand, but the actual experience of its product or culture is poor. The "say-do" gap.',
        integrated: 'Authentic Presence - When the brand promise and lived experience are one. What you say is what you do.',
        prescription: 'Bridge the say-do gap: improve operations/culture to match brand promise, or adjust messaging to match reality.',
        checkFaces: [7, 5],   // Brand & Reputation or Market Resonance
        shadowFaces: [8, 3],  // Core Operations or Human Capital
        highThreshold: SHADOW_CONFIG.thresholds.HIGH,
        lowThreshold: SHADOW_CONFIG.thresholds.LOW,
        penalty: this.tuning.shadowPenalties.experienceGap,
        icon: '📢❌⚙️'
      },

      burnoutEngine: {
        name: 'The Burnout Engine',
        story: 'The organization is incredibly efficient and productive, but achieves this by burning out its people. The machine is running perfectly, but the operators are collapsing.',
        integrated: 'Sustainable Brilliance - High performance that nurtures and renews the people who create it. Wisdom that knows when to rest.',
        prescription: 'Slow down execution pace. Invest in team well-being, psychological safety, and sustainable work rhythms.',
        checkFaces: [8],      // Core Operations
        shadowFaces: [3],     // Human Capital
        highThreshold: SHADOW_CONFIG.thresholds.HIGH,
        lowThreshold: SHADOW_CONFIG.thresholds.LOW,
        penalty: this.tuning.shadowPenalties.burnoutEngine,
        icon: '⚙️❌😓'
      },

      hollowGovernance: {
        name: 'Hollow Governance',
        story: 'The organization has many formal rules and well-drafted documents, but lacks a true culture of integrity and lived values. The "bones" have no soul.',
        integrated: 'Living Structure - Governance that embodies and expresses deep values. The bones dance with soul.',
        prescription: 'Breathe soul into structure: clarify values, create rituals, ensure governance serves purpose.',
        checkFaces: [4],      // Structural Capital
        shadowFaces: [10],    // Foundational Values
        highThreshold: SHADOW_CONFIG.thresholds.HIGH,
        lowThreshold: SHADOW_CONFIG.thresholds.LOW,
        penalty: this.tuning.shadowPenalties.hollowGovernance,
        icon: '📋❌💎'
      },

      lonelyHero: {
        name: 'The Lonely Hero',
        story: 'The venture\'s vision and IP are brilliant, but it relies entirely on a single person or fragile network, making it un-investable and un-scalable.',
        integrated: 'Shared Genius - Brilliance that multiplies through others. The vision lives in many hearts and hands.',
        prescription: 'Build redundancy: document knowledge, train others, create a "cultural carrier" team.',
        checkFaces: [2],      // Intellectual Capital
        shadowFaces: [12],    // Risk & Resilience (specifically Bus Factor)
        highThreshold: SHADOW_CONFIG.thresholds.HIGH,
        lowThreshold: SHADOW_CONFIG.thresholds.BUS_FACTOR_LOW,
        penalty: this.tuning.shadowPenalties.lonelyHero,
        specialCondition: 'busFactor',  // Needs special handling
        icon: '🧠❌👥'
      }
    };
  }

  /**
   * Analyze the entire system for shadow patterns
   *
   * @param {Array<Object>} faces - All 12 faces
   * @param {Array<Object>|Map} kpis - All KPIs (for special conditions like Bus Factor)
   * @returns {Object} Shadow analysis with detected patterns and penalties
   */
  analyze(faces, kpis = null) {
    // Create face energy map
    const faceEnergies = {};
    faces.forEach(face => {
      faceEnergies[face.id] = face.faceEnergy;
    });

    // Convert KPIs to Map if it's an array
    let kpiMap = kpis;
    if (Array.isArray(kpis)) {
      kpiMap = new Map();
      kpis.forEach(kpi => kpiMap.set(kpi.id || kpi.KPI_ID, kpi));
    }

    const detectedPatterns = [];
    const penalties = {};  // faceId -> total penalty

    // Check each shadow pattern
    Object.entries(this.shadowPatterns).forEach(([patternKey, pattern]) => {
      const detection = this.checkPattern(pattern, faceEnergies, kpiMap);

      if (detection.isActive) {
        // Build logic string from evidence
        const highFacesList = detection.evidence.highFaces
          ? detection.evidence.highFaces.map(f => `Face ${f.face}: ${(f.energy * 100).toFixed(0)}%`).join(', ')
          : '';
        const lowFacesList = detection.evidence.lowShadowFaces
          ? detection.evidence.lowShadowFaces.map(f => `Face ${f.face}: ${(f.energy * 100).toFixed(0)}%`).join(', ')
          : '';
        const logicString = highFacesList && lowFacesList
          ? `High: ${highFacesList} | Low: ${lowFacesList}`
          : detection.evidence.message || '';

        // Normalized output matching SHADOW_SCHEMA
        detectedPatterns.push({
          // Required fields (SHADOW_SCHEMA)
          id: `shadow-${pattern.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
          name: pattern.name,
          involvedFaces: detection.affectedFaces,
          severity: detection.severity,
          suppressed: pattern.story,
          integrated: pattern.integrated,
          // Optional fields
          prescription: pattern.prescription,
          logic: logicString,
          icon: pattern.icon,
          penalty: pattern.penalty,
          evidence: detection.evidence,
          source: 'detector',
          // Backwards compatibility aliases
          affectedFaces: detection.affectedFaces,
          pattern: pattern.name,  // Legacy field
          story: pattern.story    // Legacy field
        });

        // Apply penalty to the high-energy face(s)
        detection.affectedFaces.forEach(faceId => {
          if (!penalties[faceId]) penalties[faceId] = 0;
          penalties[faceId] += pattern.penalty;
        });
      }
    });

    // Calculate total penalties and ensure they don't exceed 0.9
    Object.keys(penalties).forEach(faceId => {
      penalties[faceId] = Math.min(penalties[faceId], 0.9); // Max 90% penalty
    });

    return {
      detectedPatterns: detectedPatterns,
      penalties: penalties,
      totalPatternsDetected: detectedPatterns.length,
      systemIntegrity: this.calculateSystemIntegrity(detectedPatterns),
      recommendations: this.generateRecommendations(detectedPatterns)
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

      if (gap > SHADOW_CONFIG.severityGaps.CRITICAL) result.severity = 'critical';
      else if (gap > SHADOW_CONFIG.severityGaps.HIGH) result.severity = 'high';
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
    let busFactorKPI = null;

    if (kpis instanceof Map) {
      busFactorKPI = Array.from(kpis.values()).find(kpi =>
        (kpi.id || kpi.KPI_ID) === 'R1.1' ||
        (kpi.name || kpi.KPI_Name || '').toLowerCase().includes('bus factor')
      );
    } else if (Array.isArray(kpis)) {
      busFactorKPI = kpis.find(kpi =>
        (kpi.id || kpi.KPI_ID) === 'R1.1' ||
        (kpi.name || kpi.KPI_Name || '').toLowerCase().includes('bus factor')
      );
    }

    return busFactorKPI ? (busFactorKPI.value || busFactorKPI.Value) : null;
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

    // Calculate integrity score using PHI-derived weights for mathematical harmony
    // Critical: φ^-2 = 0.382 (most impactful - fundamental contradictions)
    // High: φ^-3 = 0.236 (significant impact)
    // Moderate: φ^-4 = 0.146 (noticeable but manageable)
    const integrityScore = 1.0 - (
      (criticalCount * PHI_INV_SQUARED) +   // 0.382
      (highCount * PHI_INV_CUBED) +          // 0.236
      (moderateCount * PHI_INV_4)            // 0.146
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
        default:
          recommendation = 'Address the underlying contradiction between high-performing and neglected faces.';
      }

      return {
        pattern: pattern.pattern,
        severity: pattern.severity,
        recommendation: recommendation,
        prescription: recommendation,  // Alias for UI compatibility
        affectedFaces: pattern.affectedFaces,
        icon: pattern.icon
      };
    });
  }

  /**
   * Get summary statistics
   */
  getSummaryStats(analysis) {
    return {
      totalShadows: analysis.totalPatternsDetected,
      integrityScore: analysis.systemIntegrity.score,
      integrityStatus: analysis.systemIntegrity.status,
      mostSevere: analysis.detectedPatterns.length > 0
        ? analysis.detectedPatterns.reduce((most, curr) =>
          this.severityValue(curr.severity) > this.severityValue(most.severity) ? curr : most
        )
        : null,
      penalizedFaces: Object.keys(analysis.penalties).length
    };
  }

  /**
   * Convert severity to numerical value for comparison
   */
  severityValue(severity) {
    const values = {
      'critical': 3,
      'high': 2,
      'moderate': 1
    };
    return values[severity] || 0;
  }
}

// Export for use in browser
if (typeof window !== 'undefined') {
  window.ShadowDetector = ShadowDetector;
  window.SHADOW_CONFIG = SHADOW_CONFIG;
  window.SHADOW_SCHEMA = SHADOW_SCHEMA;
  window.validateShadow = validateShadow;
}
