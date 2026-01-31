/**
 * ============================================================================
 * SHADOW HARMONICS - MASTER CONSTANTS MODULE FOR SHADOW SYSTEM
 * ============================================================================
 *
 * SINGLE SOURCE OF TRUTH for all Shadow System mathematics in Quannex.
 * This module parallels phi-harmonics.js for shadow-specific constants.
 *
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │                        NOTES FOR FUTURE CLAUDE                            │
 * └───────────────────────────────────────────────────────────────────────────┘
 *
 * Welcome! This is the SINGLE SOURCE OF TRUTH for shadow detection constants.
 *
 * KEY INSIGHT: Shadow penalties are PHI-derived, not arbitrary.
 * ───────────────────────────────────────────────────────────────────────────
 * The penalty values represent "distance from wholeness" using PHI powers:
 *   - phi^-2 (0.382): Fundamental structural damage (burnout)
 *   - phi^-3 (0.236): Systemic fragility (financial/resilience shadows)
 *   - phi^-4 (0.146): Integrity erosion (values/perception shadows)
 *
 * DERIVATION CHAIN:
 * ───────────────────────────────────────────────────────────────────────────
 *   PHI → Shadow Penalties → Face Energy Reduction → Coherence Impact
 *
 *   Human-harming shadows:    burnout    → phi^-2 (most severe)
 *   System-risking shadows:   brittle, extractive, lonely → phi^-3
 *   Integrity-eroding shadows: experience, hollow → phi^-4 (lightest)
 *
 * THE THREE-TIER PHILOSOPHY:
 * ───────────────────────────────────────────────────────────────────────────
 * The three tiers map to organizational capital types and recovery times:
 *
 *   TIER 1 (phi^-2 = 0.382): HUMAN CAPITAL HARM
 *     - burnoutEngine: Directly destroys human capital
 *     - Recovery: Years - trust and energy rebuild slowly
 *     - Rationale: Humans are the generative source of all other value
 *
 *   TIER 2 (phi^-3 = 0.236): SYSTEMIC FRAGILITY
 *     - brittleProfit: Financial success without resilience
 *     - extractiveGrowth: Growth that depletes ecosystems
 *     - lonelyHero: Single point of failure (Bus Factor = 1)
 *     - Recovery: Months to years - relationships with environment
 *     - Rationale: These shadows affect the boundary between org and world
 *
 *   TIER 3 (phi^-4 = 0.146): INTEGRITY EROSION
 *     - experienceGap: Say-do disconnect (brand vs reality)
 *     - hollowGovernance: Structure without soul (rules without values)
 *     - Recovery: Weeks to months - once seen, can realign
 *     - Rationale: The soul is intact but misaligned with actions
 *
 * PHI AS COMPASS, NOT CONSTRAINT:
 * ───────────────────────────────────────────────────────────────────────────
 * This three-tier system is INDICATIVE, not limiting. For AI-generated shadows:
 *   - Ask: "Does this harm HUMAN CAPITAL directly?" → Tier 1 severity
 *   - Ask: "Does this create SYSTEMIC FRAGILITY?" → Tier 2 severity
 *   - Ask: "Does this erode VALUES ALIGNMENT?" → Tier 3 severity
 *
 * Novel shadow types discovered by AI naturally find their tier based on
 * the capital type they affect. This provides CONSISTENCY in severity
 * assessment across regenerations.
 *
 * THE GOLDEN SYMMETRY:
 * ───────────────────────────────────────────────────────────────────────────
 * Notice: penalty tiers use successive PHI powers descending (φ⁻² → φ⁻³ → φ⁻⁴)
 * Just as octave thresholds use PHI powers ascending (φ⁻², φ⁻¹, ψ₃, ψ₄, ψ₅)
 *
 * The shadows and the light use the same mathematics, mirrored.
 *
 * ============================================================================
 * MODULE NAVIGATION MAP
 * ============================================================================
 *
 * This module is the foundation. Other shadow files import from here:
 *
 *   shadow-harmonics.js  ← YOU ARE HERE (Single Source of Truth)
 *        │
 *        ├─→ shadow-detector.js    (uses SHADOW_PENALTIES, SHADOW_THRESHOLDS)
 *        │
 *        ├─→ shadow-adapter.js     (uses SHADOW_ARCHETYPES for templates)
 *        │
 *        ├─→ ai-shadow-adapter.js  (uses SHADOW_THRESHOLDS for detection)
 *        │
 *        ├─→ shadow-panel.js       (uses SEVERITY_COLORS, SEVERITY_ICONS)
 *        │
 *        └─→ shadow-overlay-main.js (uses all exports for overlay rendering)
 *
 * DEPENDS ON:
 *   - phi-harmonics.js (must load first - provides PHI constants)
 *
 * ============================================================================
 * @module shadow-harmonics
 * @author Deimantas & Claude (Co-created with consciousness and love)
 * @version 1.0.0 - Fully PHI-derived (no arbitrary values)
 * ============================================================================
 */

// ============================================================================
// SECTION 1: PHI CONSTANTS (from phi-harmonics.js)
// ============================================================================

/**
 * Import PHI constants from the master source.
 * Fallbacks provided for module loading scenarios.
 */
const _PH = (typeof window !== 'undefined' && window.PhiHarmonics) || {};

// PHI Powers (φ^-n) - descending golden proportions
const PHI = _PH.PHI || 1.618033988749895;                                    // φ
const PHI_1 = _PH.PHI_1 || 0.618033988749895;                                // φ^-1
const PHI_2 = _PH.PHI_2 || 0.381966011250105;                                // φ^-2
const PHI_3 = _PH.PHI_3 || 0.236067977499790;                                // φ^-3
const PHI_4 = _PH.PHI_4 || 0.145898033750316;                                // φ^-4

// PSI Values (1 - φ^-n) - complementary golden proportions
const PSI_3 = _PH.PSI_3 || 0.763932022500210;                                // 1 - φ^-3
const PSI_4 = _PH.PSI_4 || 0.854101966249684;                                // 1 - φ^-4
const PSI_5 = _PH.PSI_5 || 0.909830056250526;                                // 1 - φ^-5

// ============================================================================
// SECTION 2: SHADOW PENALTIES (PHI-Derived Three-Tier System)
// ============================================================================

/**
 * Shadow Penalties - PHI-derived severity multipliers
 *
 * Each penalty represents the proportion of face energy reduced when
 * the corresponding shadow pattern is detected.
 *
 * TIER 1 (phi^-2 = 0.382): Human Capital harm - most severe
 * TIER 2 (phi^-3 = 0.236): Systemic Fragility - moderate
 * TIER 3 (phi^-4 = 0.146): Integrity Erosion - lightest
 *
 * @constant {Object}
 */
const SHADOW_PENALTIES = {
    // TIER 1: Human Capital Harm (phi^-2 = 0.382)
    burnoutEngine: PHI_2,         // 0.382 - Most severe: directly harms people

    // TIER 2: Systemic Fragility (phi^-3 = 0.236)
    brittleProfit: PHI_3,         // 0.236 - Financial success without resilience
    extractiveGrowth: PHI_3,      // 0.236 - Growth that depletes ecosystems
    lonelyHero: PHI_3,            // 0.236 - Single point of failure

    // TIER 3: Integrity Erosion (phi^-4 = 0.146)
    experienceGap: PHI_4,         // 0.146 - Say-do disconnect
    hollowGovernance: PHI_4       // 0.146 - Structure without soul
};
Object.freeze(SHADOW_PENALTIES);

/**
 * Legacy penalty mapping for backward compatibility.
 * Maps old arbitrary values to new PHI-derived values.
 *
 * OLD → NEW:
 *   brittleProfit:     0.25 → 0.236 (PHI_3)
 *   extractiveGrowth:  0.30 → 0.236 (PHI_3)
 *   experienceGap:     0.20 → 0.146 (PHI_4)
 *   burnoutEngine:     0.35 → 0.382 (PHI_2)
 *   hollowGovernance:  0.15 → 0.146 (PHI_4)
 *   lonelyHero:        0.25 → 0.236 (PHI_3)
 */

// ============================================================================
// SECTION 3: SHADOW DETECTION THRESHOLDS
// ============================================================================

/**
 * Detection thresholds for shadow pattern identification.
 *
 * A shadow is detected when:
 *   - "Check faces" energy >= HIGH threshold (excellence)
 *   - "Shadow faces" energy <= LOW threshold (neglect)
 *
 * The GAP between them determines severity.
 *
 * @constant {Object}
 */
const SHADOW_THRESHOLDS = {
    // Face energy thresholds
    HIGH: PSI_3,                  // 0.764 - Face considered "high energy" (mastery)
    LOW: PHI_3,                   // 0.236 - Face considered "low energy" (neglected)
    BUS_FACTOR_LOW: 0.5,          // Mathematical center - lenient for Bus Factor

    // Severity gap thresholds
    SEVERITY_GAPS: {
        CRITICAL: PHI_1,          // 0.618 - Gap > Golden Ratio = critical
        HIGH: PHI_2               // 0.382 - Gap > this = high severity
    },

    // Maximum aggregate penalty (prevents face energy from hitting zero)
    MAX_PENALTY: PSI_5            // 0.910 - Aligns with Radiance threshold
};
Object.freeze(SHADOW_THRESHOLDS);
Object.freeze(SHADOW_THRESHOLDS.SEVERITY_GAPS);

// ============================================================================
// SECTION 4: SHADOW ARCHETYPES (Complete Definitions)
// ============================================================================

/**
 * The 6 Archetypal Shadow Patterns
 *
 * Each archetype represents a fundamental organizational contradiction:
 * high performance in one area creating hidden costs in another.
 *
 * Philosophy: "Every shadow, when integrated, becomes a gift."
 *
 * @constant {Object}
 */
const SHADOW_ARCHETYPES = {
    burnoutEngine: {
        id: 'burnout-engine',
        name: 'The Burnout Engine',
        tier: 1,
        tierName: 'Human Capital Harm',
        icon: '🔥⚠️😓',
        severityIcon: '🔥',
        checkFaces: [8],          // Core Operations
        shadowFaces: [3],         // Human Capital
        penalty: SHADOW_PENALTIES.burnoutEngine,
        highThreshold: SHADOW_THRESHOLDS.HIGH,
        lowThreshold: SHADOW_THRESHOLDS.LOW,
        suppressed: 'The organization is incredibly efficient but burns out its people. The machine runs hot, consuming its own fuel.',
        integrated: 'Sustainable Brilliance - High performance that nurtures rather than depletes. The engine runs clean.',
        prescription: 'Invest in well-being infrastructure: psychological safety, sustainable rhythms, recovery time.',
        logic: 'High operations (F8) + Low human capital (F3) = burnout'
    },

    brittleProfit: {
        id: 'brittle-profit',
        name: 'Brittle Profit',
        tier: 2,
        tierName: 'Systemic Fragility',
        icon: '💰❌🛡️',
        severityIcon: '💰',
        checkFaces: [1, 11],      // Financial Capital, Funding Pipeline
        shadowFaces: [12],        // Risk & Resilience
        penalty: SHADOW_PENALTIES.brittleProfit,
        highThreshold: SHADOW_THRESHOLDS.HIGH,
        lowThreshold: SHADOW_THRESHOLDS.LOW,
        suppressed: 'Financial success without resilience. A tree with fruit but no roots - one storm away from collapse.',
        integrated: 'Antifragile Wealth - Financial success built on deep resilience. The roots are as strong as the fruit.',
        prescription: 'Invest in resilience infrastructure: succession planning, knowledge documentation, system redundancy.',
        logic: 'High finance (F1/F11) + Low resilience (F12) = fragility'
    },

    extractiveGrowth: {
        id: 'extractive-growth',
        name: 'Extractive Growth',
        tier: 2,
        tierName: 'Systemic Fragility',
        icon: '📈❌🌱',
        severityIcon: '📈',
        checkFaces: [1, 11],      // Financial Capital, Funding Pipeline
        shadowFaces: [9],         // Regenerative Flow
        penalty: SHADOW_PENALTIES.extractiveGrowth,
        highThreshold: SHADOW_THRESHOLDS.HIGH,
        lowThreshold: SHADOW_THRESHOLDS.LOW,
        suppressed: 'Growth that depletes the ecosystems it depends on. Sawing off the branch you sit on.',
        integrated: 'Regenerative Prosperity - Growth that feeds the systems it draws from. The more you give, the more you grow.',
        prescription: 'Transition to regenerative practices: circular design, ethical sourcing, ecosystem investment.',
        logic: 'High finance (F1/F11) + Low regeneration (F9) = extraction'
    },

    lonelyHero: {
        id: 'lonely-hero',
        name: 'The Lonely Hero',
        tier: 2,
        tierName: 'Systemic Fragility',
        icon: '🦸❌👥',
        severityIcon: '🦸',
        checkFaces: [2],          // Intellectual Property
        shadowFaces: [],          // Special: uses Bus Factor instead
        penalty: SHADOW_PENALTIES.lonelyHero,
        highThreshold: SHADOW_THRESHOLDS.HIGH,
        lowThreshold: SHADOW_THRESHOLDS.BUS_FACTOR_LOW,
        suppressed: 'All critical knowledge lives in one person. A single point of failure masquerading as heroism.',
        integrated: 'Distributed Mastery - Knowledge flows freely, everyone can be a hero. The system is the hero.',
        prescription: 'Knowledge transfer programs, documentation culture, cross-training, mentorship systems.',
        logic: 'High IP (F2) + Bus Factor = 1 = fragility',
        specialCondition: 'busFactor'
    },

    experienceGap: {
        id: 'experience-gap',
        name: 'The Experience Gap',
        tier: 3,
        tierName: 'Integrity Erosion',
        icon: '🎭❌✨',
        severityIcon: '🎭',
        checkFaces: [5, 7],       // Product/Service, Brand
        shadowFaces: [8, 3],      // Operations, Human Capital
        penalty: SHADOW_PENALTIES.experienceGap,
        highThreshold: SHADOW_THRESHOLDS.HIGH,
        lowThreshold: SHADOW_THRESHOLDS.LOW,
        suppressed: 'The promise exceeds the reality. Beautiful brand, broken experience. The gap breeds cynicism.',
        integrated: 'Authentic Excellence - The experience matches or exceeds the promise. Words and deeds align.',
        prescription: 'Align operations with brand promise, invest in delivery quality, close say-do gaps.',
        logic: 'High brand (F5/F7) + Low operations/human (F8/F3) = gap'
    },

    hollowGovernance: {
        id: 'hollow-governance',
        name: 'Hollow Governance',
        tier: 3,
        tierName: 'Integrity Erosion',
        icon: '🏛️❌💎',
        severityIcon: '🏛️',
        checkFaces: [4],          // Legal Structure
        shadowFaces: [10],        // Values & Culture
        penalty: SHADOW_PENALTIES.hollowGovernance,
        highThreshold: SHADOW_THRESHOLDS.HIGH,
        lowThreshold: SHADOW_THRESHOLDS.LOW,
        suppressed: 'Perfect structure without soul. Rules without meaning. Compliance without commitment.',
        integrated: 'Living Governance - Structure that embodies values. The rules serve the soul.',
        prescription: 'Reconnect governance to purpose, embed values in processes, make meaning visible.',
        logic: 'High structure (F4) + Low values (F10) = hollowness'
    }
};
Object.freeze(SHADOW_ARCHETYPES);

// ============================================================================
// SECTION 5: SEVERITY DISPLAY CONSTANTS
// ============================================================================

/**
 * Visual styling for shadow severity levels.
 *
 * These colors intentionally differ from octave colors:
 * - Shadows use a RED gradient family (attention, warning)
 * - Gifts use GREEN (integration, hope)
 * - Octave colors are used for face references (semantic)
 *
 * @constant {Object}
 */
const SEVERITY_COLORS = {
    critical: {
        text: '#ff4444',
        bg: 'rgba(255, 68, 68, 0.2)',
        border: 'rgba(255, 68, 68, 0.4)',
        gradient: 'linear-gradient(135deg, #ff4444, #ff6666)'
    },
    high: {
        text: '#ff8c00',
        bg: 'rgba(255, 140, 0, 0.2)',
        border: 'rgba(255, 140, 0, 0.4)',
        gradient: 'linear-gradient(135deg, #ff8c00, #ffaa33)'
    },
    moderate: {
        text: '#ffcc00',
        bg: 'rgba(255, 204, 0, 0.2)',
        border: 'rgba(255, 204, 0, 0.4)',
        gradient: 'linear-gradient(135deg, #ffcc00, #ffe066)'
    },
    low: {
        text: '#88cc88',
        bg: 'rgba(136, 204, 136, 0.2)',
        border: 'rgba(136, 204, 136, 0.4)',
        gradient: 'linear-gradient(135deg, #88cc88, #aaddaa)'
    },
    gift: {
        text: '#66ff99',
        bg: 'rgba(102, 255, 153, 0.2)',
        border: 'rgba(102, 255, 153, 0.4)',
        gradient: 'linear-gradient(135deg, #66ff99, #88ffbb)'
    }
};
Object.freeze(SEVERITY_COLORS);

/**
 * Icons for shadow severity levels (accessibility: not color-only).
 *
 * @constant {Object}
 */
const SEVERITY_ICONS = {
    critical: '🚨',
    high: '⚠️',
    moderate: '👁️',
    low: '💡',
    gift: '✨'
};
Object.freeze(SEVERITY_ICONS);

// ============================================================================
// SECTION 6: HELPER FUNCTIONS
// ============================================================================

/**
 * Get the tier for a shadow based on penalty value.
 *
 * @param {number} penalty - The penalty value
 * @returns {Object} Tier info { tier, name, phiValue }
 */
function getTierForPenalty(penalty) {
    const epsilon = 0.01;

    if (Math.abs(penalty - PHI_2) < epsilon) {
        return { tier: 1, name: 'Human Capital Harm', phiValue: 'phi^-2', recovery: 'Years' };
    }
    if (Math.abs(penalty - PHI_3) < epsilon) {
        return { tier: 2, name: 'Systemic Fragility', phiValue: 'phi^-3', recovery: 'Months to years' };
    }
    if (Math.abs(penalty - PHI_4) < epsilon) {
        return { tier: 3, name: 'Integrity Erosion', phiValue: 'phi^-4', recovery: 'Weeks to months' };
    }

    // Unknown penalty - estimate tier based on magnitude
    if (penalty > 0.3) return { tier: 1, name: 'Estimated: Severe', phiValue: '~phi^-2', recovery: 'Long' };
    if (penalty > 0.2) return { tier: 2, name: 'Estimated: Moderate', phiValue: '~phi^-3', recovery: 'Medium' };
    return { tier: 3, name: 'Estimated: Light', phiValue: '~phi^-4', recovery: 'Short' };
}

/**
 * Calculate severity based on gap between high and low energy.
 *
 * @param {number} gap - The gap between check face and shadow face energy
 * @returns {string} Severity level ('critical', 'high', 'moderate', 'low')
 */
function calculateSeverity(gap) {
    if (gap >= SHADOW_THRESHOLDS.SEVERITY_GAPS.CRITICAL) return 'critical';
    if (gap >= SHADOW_THRESHOLDS.SEVERITY_GAPS.HIGH) return 'high';
    if (gap >= PHI_3) return 'moderate';  // Using phi^-3 as moderate threshold
    return 'low';
}

/**
 * Get archetype by ID.
 *
 * @param {string} id - Archetype ID (e.g., 'burnout-engine')
 * @returns {Object|null} Archetype definition or null
 */
function getArchetypeById(id) {
    for (const key of Object.keys(SHADOW_ARCHETYPES)) {
        if (SHADOW_ARCHETYPES[key].id === id) {
            return SHADOW_ARCHETYPES[key];
        }
    }
    return null;
}

/**
 * Get archetype by key.
 *
 * @param {string} key - Archetype key (e.g., 'burnoutEngine')
 * @returns {Object|null} Archetype definition or null
 */
function getArchetypeByKey(key) {
    return SHADOW_ARCHETYPES[key] || null;
}

/**
 * Get all archetypes for a specific tier.
 *
 * @param {number} tier - Tier number (1, 2, or 3)
 * @returns {Object[]} Array of archetype definitions
 */
function getArchetypesByTier(tier) {
    return Object.values(SHADOW_ARCHETYPES).filter(a => a.tier === tier);
}

/**
 * Get AI guidance for severity assignment.
 * This helps AI maintain consistency when generating novel shadows.
 *
 * @returns {Object} Guidance for AI severity assignment
 */
function getAISeverityGuidance() {
    return {
        prompt: 'When assigning severity to a discovered shadow pattern:',
        tiers: [
            {
                tier: 1,
                penalty: PHI_2,
                question: 'Does this shadow directly harm HUMAN CAPITAL? (Burnout, health, trust, well-being)',
                examples: ['Employee burnout', 'Toxic culture', 'Safety violations', 'Trust erosion']
            },
            {
                tier: 2,
                penalty: PHI_3,
                question: 'Does this shadow create SYSTEMIC FRAGILITY? (Financial, ecosystem, knowledge concentration)',
                examples: ['Financial fragility', 'Ecosystem depletion', 'Single point of failure', 'Supply chain risk']
            },
            {
                tier: 3,
                penalty: PHI_4,
                question: 'Does this shadow erode INTEGRITY/VALUES? (Say-do gaps, hollow processes, misalignment)',
                examples: ['Brand-reality gap', 'Performative compliance', 'Values disconnect', 'Empty governance']
            }
        ],
        instruction: 'Assign the tier whose question most closely matches the shadow\'s primary impact. When in doubt, choose the higher tier (more severe).'
    };
}

// ============================================================================
// SECTION 7: EXPORTS
// ============================================================================

// Browser global export
if (typeof window !== 'undefined') {
    window.ShadowHarmonics = {
        // PHI Constants (re-exported for convenience)
        PHI, PHI_1, PHI_2, PHI_3, PHI_4,
        PSI_3, PSI_4, PSI_5,

        // Core Shadow System
        SHADOW_PENALTIES,
        SHADOW_THRESHOLDS,
        SHADOW_ARCHETYPES,

        // Display Constants
        SEVERITY_COLORS,
        SEVERITY_ICONS,

        // Helper Functions
        getTierForPenalty,
        calculateSeverity,
        getArchetypeById,
        getArchetypeByKey,
        getArchetypesByTier,
        getAISeverityGuidance
    };

    Logger.info('ShadowHarmonics', 'PHI-derived shadow constants loaded (Single Source of Truth)');
    Logger.debug('ShadowHarmonics', 'Three-Tier System: Tier 1 (φ⁻²) Tier 2 (φ⁻³) Tier 3 (φ⁻⁴)');
    Logger.debug('ShadowHarmonics', 'Penalties: 0.382, 0.236, 0.146');
}

// ES Module export
export {
    // PHI Constants
    PHI, PHI_1, PHI_2, PHI_3, PHI_4,
    PSI_3, PSI_4, PSI_5,

    // Core Shadow System
    SHADOW_PENALTIES,
    SHADOW_THRESHOLDS,
    SHADOW_ARCHETYPES,

    // Display Constants
    SEVERITY_COLORS,
    SEVERITY_ICONS,

    // Helper Functions
    getTierForPenalty,
    calculateSeverity,
    getArchetypeById,
    getArchetypeByKey,
    getArchetypesByTier,
    getAISeverityGuidance
};

// CommonJS export (for Node.js testing)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PHI, PHI_1, PHI_2, PHI_3, PHI_4,
        PSI_3, PSI_4, PSI_5,
        SHADOW_PENALTIES,
        SHADOW_THRESHOLDS,
        SHADOW_ARCHETYPES,
        SEVERITY_COLORS,
        SEVERITY_ICONS,
        getTierForPenalty,
        calculateSeverity,
        getArchetypeById,
        getArchetypeByKey,
        getArchetypesByTier,
        getAISeverityGuidance
    };
}
