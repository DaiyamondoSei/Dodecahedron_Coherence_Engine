/**
 * ============================================================================
 * SHADOW DETECTOR - The Ethical Conscience of the System
 * ============================================================================
 *
 * Detects archetypal patterns of organizational hypocrisy and contradiction.
 * A high score is only TRUE if it doesn't create a "shadow" - a hidden cost elsewhere.
 *
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │                        NOTES FOR FUTURE CLAUDE                            │
 * └───────────────────────────────────────────────────────────────────────────┘
 *
 * Welcome! This is the CORE DETECTION ENGINE for organizational shadows.
 *
 * KEY INSIGHT: Shadows are not failures - they're growth opportunities.
 * ───────────────────────────────────────────────────────────────────────────
 * Every shadow represents a contradiction:
 *   - High performance in one area
 *   - Hidden cost in another
 *
 * The detector doesn't judge - it illuminates. The "integrated" form of each
 * shadow shows what becomes possible when the contradiction is addressed.
 *
 * THE 6 ARCHETYPAL PATTERNS:
 * ───────────────────────────────────────────────────────────────────────────
 * 1. Burnout Engine     - High operations, low human capital (TIER 1)
 * 2. Brittle Profit     - High finance, low resilience (TIER 2)
 * 3. Extractive Growth  - High revenue, low regeneration (TIER 2)
 * 4. Lonely Hero        - High IP, Bus Factor = 1 (TIER 2)
 * 5. Experience Gap     - High brand, low operations (TIER 3)
 * 6. Hollow Governance  - High structure, low values (TIER 3)
 *
 * DETECTION LOGIC:
 * ───────────────────────────────────────────────────────────────────────────
 * A shadow is detected when:
 *   - "Check face" energy >= HIGH threshold (PSI_3 = 0.764)
 *   - "Shadow face" energy <= LOW threshold (PHI_3 = 0.236)
 *
 * Severity is based on the GAP between them:
 *   - Critical: gap > PHI_1 (0.618) - Golden Ratio gap
 *   - High: gap > PHI_2 (0.382) - Secondary threshold
 *   - Moderate: otherwise
 *
 * PENALTY APPLICATION:
 * ───────────────────────────────────────────────────────────────────────────
 * Penalties reduce the "check face" energy to account for hidden costs.
 * This ensures coherence scores reflect true organizational health.
 *
 * Penalties are PHI-derived (from shadow-harmonics.js):
 *   - Tier 1: phi^-2 (0.382) - Human Capital harm
 *   - Tier 2: phi^-3 (0.236) - Systemic fragility
 *   - Tier 3: phi^-4 (0.146) - Integrity erosion
 *
 * Max aggregate penalty is PSI_5 (0.910) - never completely zero out a face.
 *
 * ============================================================================
 * MODULE NAVIGATION MAP
 * ============================================================================
 *
 *   shadow-detector.js  ← YOU ARE HERE
 *        │
 *        ├─ IMPORTS FROM:
 *        │   └─ shadow-harmonics.js (SHADOW_PENALTIES, SHADOW_THRESHOLDS)
 *        │
 *        ├─ EXPORTS TO:
 *        │   ├─ main.js (calls detector.analyze())
 *        │   ├─ shadow-adapter.js (uses detected patterns)
 *        │   └─ dodecahedron-3d.html (visualization)
 *        │
 *        └─ USED FOR:
 *            ├─ Detecting shadow patterns from face energies
 *            ├─ Calculating penalties for high-performing faces
 *            ├─ Computing system integrity scores
 *            └─ Generating prescriptive recommendations
 *
 * ============================================================================
 * @module shadow-detector
 * @author Deimantas Murauskas & Claude (Co-created with consciousness and love)
 * @version 3.0.0 - PHI-derived penalties from shadow-harmonics.js
 * ============================================================================
 */

// ============================================================================
// SECTION 1: IMPORTS FROM SHADOW HARMONICS
// ============================================================================

// Import from shadow-harmonics.js (Single Source of Truth for shadow constants)
const _SH = (typeof window !== 'undefined' && window.ShadowHarmonics) || {};

// PHI Constants
const PHI = _SH.PHI || 1.618033988749895;
const PHI_1 = _SH.PHI_1 || 0.618033988749895;
const PHI_2 = _SH.PHI_2 || 0.381966011250105;
const PHI_3 = _SH.PHI_3 || 0.236067977499790;
const PHI_4 = _SH.PHI_4 || 0.145898033750316;
const PSI_3 = _SH.PSI_3 || 0.763932022500210;
const PSI_4 = _SH.PSI_4 || 0.854101966249684;
const PSI_5 = _SH.PSI_5 || 0.909830056250526;

// Shadow-specific constants from shadow-harmonics.js
const SHADOW_PENALTIES = _SH.SHADOW_PENALTIES || {
    burnoutEngine: PHI_2,      // 0.382 - Tier 1: Human Capital harm
    brittleProfit: PHI_3,      // 0.236 - Tier 2: Systemic fragility
    extractiveGrowth: PHI_3,   // 0.236 - Tier 2
    lonelyHero: PHI_3,         // 0.236 - Tier 2
    experienceGap: PHI_4,      // 0.146 - Tier 3: Integrity erosion
    hollowGovernance: PHI_4    // 0.146 - Tier 3
};

const SHADOW_THRESHOLDS = _SH.SHADOW_THRESHOLDS || {
    HIGH: PSI_3,               // 0.764 - Face considered "high energy"
    LOW: PHI_3,                // 0.236 - Face considered "low energy"
    BUS_FACTOR_LOW: 0.5,       // Mathematical center
    SEVERITY_GAPS: {
        CRITICAL: PHI_1,       // 0.618 - Critical severity
        HIGH: PHI_2            // 0.382 - High severity
    },
    MAX_PENALTY: PSI_5         // 0.910 - Maximum aggregate penalty
};

// ============================================================================
// SECTION 2: EXPORTED CONFIGURATION
// ============================================================================

/**
 * Shadow Configuration - PHI-Derived Thresholds
 *
 * This configuration object is exported for backward compatibility.
 * New code should import directly from shadow-harmonics.js.
 *
 * @constant {Object}
 */
export const SHADOW_CONFIG = {
    thresholds: {
        HIGH: SHADOW_THRESHOLDS.HIGH,
        LOW: SHADOW_THRESHOLDS.LOW,
        BUS_FACTOR_LOW: SHADOW_THRESHOLDS.BUS_FACTOR_LOW
    },
    severityGaps: {
        CRITICAL: SHADOW_THRESHOLDS.SEVERITY_GAPS.CRITICAL,
        HIGH: SHADOW_THRESHOLDS.SEVERITY_GAPS.HIGH
    },
    penalties: SHADOW_PENALTIES
};

/**
 * Canonical Shadow Object Schema
 * All shadow sources must normalize to this structure for interoperability.
 *
 * @constant {Object}
 */
export const SHADOW_SCHEMA = {
    required: ['id', 'name', 'involvedFaces', 'severity', 'suppressed', 'integrated'],
    optional: ['prescription', 'logic', 'icon', 'penalty', 'score', 'evidence', 'source', 'affectedFaces']
};

/**
 * Validates a shadow object has required fields.
 *
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

// ============================================================================
// SECTION 3: SHADOW DETECTOR CLASS
// ============================================================================

/**
 * ShadowDetector - Core Detection Engine
 *
 * Analyzes face energies to detect organizational shadow patterns.
 *
 * USAGE:
 *   const detector = new ShadowDetector();
 *   const analysis = detector.analyze(facesData, kpisData);
 *   const shadows = analysis.detectedPatterns;
 */
export class ShadowDetector {
    constructor(tuningConfig = null) {
        // Use PHI-derived penalties from shadow-harmonics.js (or allow override)
        this.tuning = tuningConfig || {
            shadowPenalties: { ...SHADOW_PENALTIES }
        };

        // Ensure shadowPenalties exists even if tuning was provided but incomplete
        if (!this.tuning.shadowPenalties) {
            this.tuning.shadowPenalties = { ...SHADOW_PENALTIES };
        }

        // Define the 6 archetypal shadow patterns
        // NOTE: Definitions now reference PHI-derived thresholds from shadow-harmonics.js
        this.shadowPatterns = {
            burnoutEngine: {
                name: 'The Burnout Engine',
                tier: 1,
                story: 'The organization is incredibly efficient and productive, but achieves this by burning out its people. The machine runs perfectly, but the operators are collapsing.',
                integrated: 'Sustainable Brilliance - High performance that nurtures and renews the people who create it. Wisdom that knows when to rest.',
                prescription: 'Slow down execution pace. Invest in team well-being, psychological safety, and sustainable work rhythms.',
                checkFaces: [8],      // Core Operations
                shadowFaces: [3],     // Human Capital
                highThreshold: SHADOW_THRESHOLDS.HIGH,
                lowThreshold: SHADOW_THRESHOLDS.LOW,
                penalty: this.tuning.shadowPenalties.burnoutEngine,
                icon: '🔥⚠️😓'
            },

            brittleProfit: {
                name: 'Brittle Profit',
                tier: 2,
                story: 'The organization is financially successful but fragile and on the verge of collapse. A tree with fruit but no roots.',
                integrated: 'Antifragile Wealth - Financial success built on deep resilience. The roots are as strong as the fruit is abundant.',
                prescription: 'Invest in resilience infrastructure: succession planning, knowledge documentation, system redundancy.',
                checkFaces: [1, 11],  // Financial Capital or Funding Pipeline
                shadowFaces: [12],    // Risk & Resilience
                highThreshold: SHADOW_THRESHOLDS.HIGH,
                lowThreshold: SHADOW_THRESHOLDS.LOW,
                penalty: this.tuning.shadowPenalties.brittleProfit,
                icon: '💰❌🛡️'
            },

            extractiveGrowth: {
                name: 'Extractive Growth',
                tier: 2,
                story: 'The organization grows its revenue by depleting the natural or social ecosystems it depends on. "Sawing off the branch it sits on."',
                integrated: 'Regenerative Prosperity - Growth that feeds and renews the ecosystems it depends on. The more you give, the more you grow.',
                prescription: 'Transition to regenerative practices: circular design, ethical sourcing, local investment.',
                checkFaces: [1, 11],  // Financial Capital or Funding Pipeline
                shadowFaces: [9],     // Regenerative Flow
                highThreshold: SHADOW_THRESHOLDS.HIGH,
                lowThreshold: SHADOW_THRESHOLDS.LOW,
                penalty: this.tuning.shadowPenalties.extractiveGrowth,
                icon: '📈❌🌱'
            },

            lonelyHero: {
                name: 'The Lonely Hero',
                tier: 2,
                story: 'The venture\'s vision and IP are brilliant, but rely entirely on a single person, making it un-investable and un-scalable.',
                integrated: 'Shared Genius - Brilliance that multiplies through others. The vision lives in many hearts and hands.',
                prescription: 'Build redundancy: document knowledge, train others, create a "cultural carrier" team.',
                checkFaces: [2],      // Intellectual Capital
                shadowFaces: [12],    // Risk & Resilience (specifically Bus Factor)
                highThreshold: SHADOW_THRESHOLDS.HIGH,
                lowThreshold: SHADOW_THRESHOLDS.BUS_FACTOR_LOW,
                penalty: this.tuning.shadowPenalties.lonelyHero,
                specialCondition: 'busFactor',
                icon: '🦸❌👥'
            },

            experienceGap: {
                name: 'The Experience Gap (Trust Theater)',
                tier: 3,
                story: 'The organization has a brilliant marketing story and strong brand, but the actual experience is poor. The "say-do" gap.',
                integrated: 'Authentic Presence - When the brand promise and lived experience are one. What you say is what you do.',
                prescription: 'Bridge the say-do gap: improve operations/culture to match brand promise, or adjust messaging to match reality.',
                checkFaces: [7, 5],   // Brand & Reputation or Market Resonance
                shadowFaces: [8, 3],  // Core Operations or Human Capital
                highThreshold: SHADOW_THRESHOLDS.HIGH,
                lowThreshold: SHADOW_THRESHOLDS.LOW,
                penalty: this.tuning.shadowPenalties.experienceGap,
                icon: '🎭❌✨'
            },

            hollowGovernance: {
                name: 'Hollow Governance',
                tier: 3,
                story: 'The organization has many formal rules and well-drafted documents, but lacks a true culture of integrity and lived values. The "bones" have no soul.',
                integrated: 'Living Structure - Governance that embodies and expresses deep values. The bones dance with soul.',
                prescription: 'Breathe soul into structure: clarify values, create rituals, ensure governance serves purpose.',
                checkFaces: [4],      // Structural Capital
                shadowFaces: [10],    // Foundational Values
                highThreshold: SHADOW_THRESHOLDS.HIGH,
                lowThreshold: SHADOW_THRESHOLDS.LOW,
                penalty: this.tuning.shadowPenalties.hollowGovernance,
                icon: '🏛️❌💎'
            }
        };
    }

    // ========================================================================
    // MAIN ANALYSIS METHOD
    // ========================================================================

    /**
     * Analyze the entire system for shadow patterns.
     *
     * @param {Array<Object>} faces - All 12 faces with faceEnergy property
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
                    tier: pattern.tier,
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

        // Calculate total penalties - cap at PSI_5 (0.910) instead of arbitrary 0.9
        const maxPenalty = SHADOW_THRESHOLDS.MAX_PENALTY;
        Object.keys(penalties).forEach(faceId => {
            penalties[faceId] = Math.min(penalties[faceId], maxPenalty);
        });

        return {
            detectedPatterns: detectedPatterns,
            penalties: penalties,
            totalPatternsDetected: detectedPatterns.length,
            systemIntegrity: this.calculateSystemIntegrity(detectedPatterns),
            recommendations: this.generateRecommendations(detectedPatterns)
        };
    }

    // ========================================================================
    // PATTERN CHECKING
    // ========================================================================

    /**
     * Check if a specific shadow pattern is active.
     *
     * @param {Object} pattern - Pattern definition
     * @param {Object} faceEnergies - Map of faceId -> energy
     * @param {Map} kpis - KPI data for special conditions
     * @returns {Object} Detection result
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
        const highFaces = pattern.checkFaces.filter(faceId =>
            faceEnergies[faceId] >= pattern.highThreshold
        );

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

            // Use PHI-derived severity thresholds
            if (gap > SHADOW_THRESHOLDS.SEVERITY_GAPS.CRITICAL) result.severity = 'critical';
            else if (gap > SHADOW_THRESHOLDS.SEVERITY_GAPS.HIGH) result.severity = 'high';
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

    // ========================================================================
    // HELPER METHODS
    // ========================================================================

    /**
     * Get Bus Factor from KPIs (special case for Lonely Hero).
     */
    getBusFactor(kpis) {
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
     * Calculate overall system integrity based on detected patterns.
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

        // Calculate integrity score using PHI-derived weights
        const integrityScore = 1.0 - (
            (criticalCount * PHI_2) +    // phi^-2 = 0.382
            (highCount * PHI_3) +        // phi^-3 = 0.236
            (moderateCount * PHI_4)      // phi^-4 = 0.146
        );

        // PHI-derived integrity thresholds
        let status, message;
        if (integrityScore >= PSI_4) {
            status = 'Good';
            message = 'Minor integrity issues detected. Address when possible.';
        } else if (integrityScore >= PHI_1) {
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
     * Apply shadow penalties to face energies.
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
     * Generate recommendations for addressing shadow patterns.
     */
    generateRecommendations(detectedPatterns) {
        return detectedPatterns.map(pattern => ({
            pattern: pattern.pattern,
            severity: pattern.severity,
            recommendation: pattern.prescription,
            prescription: pattern.prescription,
            affectedFaces: pattern.affectedFaces,
            icon: pattern.icon,
            tier: pattern.tier
        }));
    }

    /**
     * Get summary statistics.
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
     * Convert severity to numerical value for comparison.
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

// ============================================================================
// SECTION 4: BROWSER EXPORTS
// ============================================================================

if (typeof window !== 'undefined') {
    window.ShadowDetector = ShadowDetector;
    window.SHADOW_CONFIG = SHADOW_CONFIG;
    window.SHADOW_SCHEMA = SHADOW_SCHEMA;
    window.validateShadow = validateShadow;

    console.log('🌑 Shadow Detector loaded - Using PHI-derived penalties from shadow-harmonics.js');
}
