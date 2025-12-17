/**
 * ========================================
 * MODULE: kpi-matcher.js
 * ========================================
 *
 * KPI MATCHER - Octave Sophistication Detector
 *
 * This module solves a critical problem: ensuring organizations are
 * assessed at the appropriate development level. A seed-stage startup
 * shouldn't be measured with Fortune 500 KPIs!
 *
 * KEY INSIGHT: Octave = KPI SOPHISTICATION, not face count.
 * A startup talks about "runway" and "first customers" (O1-O2).
 * An enterprise talks about "stakeholder narrative" and "category defining" (O5-O6).
 *
 * THE 7 OCTAVES OF ORGANIZATIONAL DEVELOPMENT:
 * ┌─────────────────────────────────────────────────────────────┐
 * │ O1: SURVIVAL     - Runway, bootstrap, first customers      │
 * │ O2: STRUCTURE    - Budget, processes, metrics              │
 * │ O3: RELATIONSHIPS - Culture, trust, community              │
 * │ O4: CREATIVITY   - Innovation, experimentation, R&D        │
 * │ O5: EXPRESSION   - Brand voice, storytelling, transparency │
 * │ O6: VISION       - Legacy, succession, 100-year thinking   │
 * │ O7: RADIANCE     - Consciousness, planetary benefit        │
 * └─────────────────────────────────────────────────────────────┘
 *
 * DEPENDENCIES:
 * - octave-reference-library.js (OCTAVES, constrainOctave, detectOrganizationStage)
 *
 * EXPORTS:
 * - KPIMatcher (class) - main sophistication detector
 * - KPI_SOPHISTICATION_PATTERNS (constant) - keyword dictionaries per octave
 *
 * ========================================
 * NOTES FOR FUTURE CLAUDE
 * ========================================
 *
 * 1. THE FOUR DOMAIN INDICATORS:
 *    Each octave has 4 keyword categories:
 *    - financialIndicators: How they talk about money
 *    - teamIndicators: How they describe people/culture
 *    - operationsIndicators: How they run things
 *    - marketIndicators: How they engage customers
 *
 *    Example O1 vs O6:
 *    O1 financial: "runway", "burn rate", "bootstrap"
 *    O6 financial: "long-term capital", "legacy planning", "patient capital"
 *
 * 2. THE MATCH() METHOD (Main Entry Point):
 *    match(storyText) returns:
 *    {
 *      domainScores: { financial: {...}, team: {...}, ... },
 *      overallOctave: "O2",
 *      stageInfo: { stage: 'startup', maxOctave: 'O3' },
 *      recommendation: { insight, strongestDomain, weakestDomain },
 *      confidence: 'medium-high'
 *    }
 *
 * 3. STAGE CONSTRAINT (Prevents Over-Assessment):
 *    detectOrganizationStage() caps the max octave:
 *    - 'seed' stage → max O2
 *    - 'startup' stage → max O3
 *    - 'growth' stage → max O4
 *    - 'enterprise' stage → max O6
 *    - 'transcendent' → no limit
 *
 *    This prevents a startup from accidentally being O5 because they
 *    used a few sophisticated words.
 *
 * 4. SCORING ALGORITHM:
 *    _scoreDomain(text, indicatorType):
 *    - Counts keyword matches for each octave (O1-O7)
 *    - Finds bestOctave with highest match count
 *    - Returns normalized score (bestScore / totalMatches)
 *
 * 5. WEIGHTED OVERALL OCTAVE:
 *    _calculateOverallOctave uses domain weights:
 *    - financial: 0.3 (most important)
 *    - team: 0.25
 *    - operations: 0.25
 *    - market: 0.2
 *
 *    Weighted average is then constrained by stageInfo.maxOctave.
 *
 * 6. CONFIDENCE LEVELS:
 *    Based on total keyword matches found:
 *    - 0 matches: 'low'
 *    - 1-4 matches: 'medium-low'
 *    - 5-9 matches: 'medium'
 *    - 10-19 matches: 'medium-high'
 *    - 20+ matches: 'high'
 *
 * 7. FACE OCTAVE MAPPING:
 *    getFaceOctaves(matchResult, faces) assigns octaves to specific faces:
 *    - financial domain → faces 1, 11 (Financial Capital, Funding)
 *    - team domain → faces 3, 8 (Human Capital, Operations)
 *    - operations domain → faces 4, 8, 9
 *    - market domain → faces 5, 6, 7 (Market, Community, Brand)
 *
 *    Faces not in a detected domain get the overall octave.
 *
 * 8. INSIGHT GENERATION:
 *    _generateInsight() provides actionable feedback:
 *    "Focus is on survival. Strengthen [weakestDomain] practices to build towards O2."
 *
 * 9. OCTAVE PROGRESSION PHILOSOPHY:
 *    Organizations develop through octaves sequentially:
 *    - Can't skip levels (must master O2 structure before O3 relationships)
 *    - Higher isn't always better (O7 is rare and not for everyone)
 *    - Each octave builds on the foundations of previous ones
 *
 * USED BY:
 * - Story analysis flow (determining appropriate KPI sophistication)
 * - AI face mapper (adjusting KPI generation to match org level)
 * - Demo orchestrator (showing octave in results)
 *
 * GOTCHAS:
 * - Keywords are case-insensitive (text is lowercased)
 * - Empty story text returns O1 with 'low' confidence
 * - constrainOctave() from octave-reference-library handles the capping
 * - OCTAVES constant contains names/descriptions for each octave
 * - Domain-to-face mapping is hardcoded (may need update if face semantics change)
 *
 * ========================================
 *
 * @module KPIMatcher
 * @author Deimantas Butrimas & Claude
 * @version 2.0.0 - Documented with Notes for Future Claude
 */

import { OCTAVES, constrainOctave, detectOrganizationStage } from './octave-reference-library.js';

// KPI sophistication patterns by octave (what the story content sounds like)
const KPI_SOPHISTICATION_PATTERNS = {
    O1: {
        name: 'Survival',
        financialIndicators: [
            'runway', 'cash', 'survive', 'bootstrap', 'burn rate', 'enough money',
            'pay the bills', 'make payroll', 'break even', 'seed money', 'initial funding'
        ],
        teamIndicators: [
            'founder', 'solo', 'just me', 'small team', 'co-founder', 'starting out',
            'first hire', 'wearing many hats', 'do it all myself'
        ],
        operationsIndicators: [
            'mvp', 'prototype', 'first version', 'getting started', 'figuring out',
            'testing', 'learning', 'early days', 'just launched'
        ],
        marketIndicators: [
            'first customers', 'finding product-market fit', 'validation',
            'does anyone want this', 'early adopters', 'initial traction'
        ]
    },
    O2: {
        name: 'Structure',
        financialIndicators: [
            'budget', 'financial plan', 'accounting', 'bookkeeping', 'financial system',
            'revenue tracking', 'cost management', 'unit economics', 'margins'
        ],
        teamIndicators: [
            'roles', 'responsibilities', 'team structure', 'org chart', 'hiring plan',
            'onboarding', 'training', 'processes', 'standard operating procedures'
        ],
        operationsIndicators: [
            'workflow', 'process', 'system', 'automation', 'efficiency',
            'documentation', 'repeatability', 'scalable', 'reliable'
        ],
        marketIndicators: [
            'customer acquisition', 'sales process', 'marketing funnel',
            'conversion rate', 'retention', 'churn', 'metrics'
        ]
    },
    O3: {
        name: 'Relationships',
        financialIndicators: [
            'investor relations', 'stakeholder trust', 'financial transparency',
            'shareholder value', 'profit sharing', 'fair compensation'
        ],
        teamIndicators: [
            'culture', 'team cohesion', 'psychological safety', 'belonging',
            'trust', 'collaboration', 'community', 'values alignment'
        ],
        operationsIndicators: [
            'cross-functional', 'collaboration', 'teamwork', 'communication',
            'feedback loops', 'retrospectives', 'continuous improvement'
        ],
        marketIndicators: [
            'customer loyalty', 'nps', 'community', 'brand loyalty', 'advocacy',
            'word of mouth', 'customer love', 'relationship building'
        ]
    },
    O4: {
        name: 'Creativity',
        financialIndicators: [
            'innovation fund', 'r&d budget', 'creative capital', 'venture experiments',
            'risk capital', 'exploration budget', 'moonshot funding'
        ],
        teamIndicators: [
            'creative culture', 'innovation mindset', 'experimentation', 'fail fast',
            'psychological safety for ideas', 'diverse perspectives', 'think different'
        ],
        operationsIndicators: [
            'innovation process', 'ideation', 'prototyping', 'design thinking',
            'agile', 'iteration', 'experimentation framework', 'innovation lab'
        ],
        marketIndicators: [
            'co-creation', 'customer innovation', 'beta program', 'feedback integration',
            'product evolution', 'market shaping', 'category creation'
        ]
    },
    O5: {
        name: 'Expression',
        financialIndicators: [
            'financial storytelling', 'impact reporting', 'transparent financials',
            'integrated reporting', 'value communication', 'stakeholder narrative'
        ],
        teamIndicators: [
            'employer brand', 'culture story', 'purpose expression', 'authentic leadership',
            'voice', 'values lived', 'cultural narrative'
        ],
        operationsIndicators: [
            'operational transparency', 'open book management', 'process sharing',
            'knowledge sharing', 'thought leadership', 'best practice sharing'
        ],
        marketIndicators: [
            'brand voice', 'authentic marketing', 'purpose-driven', 'mission clarity',
            'value expression', 'story-telling', 'content strategy'
        ]
    },
    O6: {
        name: 'Vision',
        financialIndicators: [
            'long-term capital', 'legacy planning', 'generational wealth',
            'endowment', 'perpetual fund', 'patient capital', '100-year thinking'
        ],
        teamIndicators: [
            'succession planning', 'leadership development', 'legacy culture',
            'mentorship', 'next generation', 'institutional knowledge'
        ],
        operationsIndicators: [
            'sustainable operations', 'regenerative processes', 'circular economy',
            'future-proof', 'evolutionary design', 'adaptive systems'
        ],
        marketIndicators: [
            'market shaping', 'industry transformation', 'future building',
            'paradigm shift', 'category defining', 'vision casting'
        ]
    },
    O7: {
        name: 'Radiance',
        financialIndicators: [
            'sacred capital', 'gift economy', 'abundance', 'generosity',
            'capital as service', 'money as energy', 'universal benefit'
        ],
        teamIndicators: [
            'consciousness', 'collective intelligence', 'oneness', 'healing',
            'planetary team', 'service orientation', 'ego dissolution'
        ],
        operationsIndicators: [
            'living systems', 'emergent order', 'self-organizing', 'wisdom-based',
            'intuitive operations', 'flow state', 'sacred work'
        ],
        marketIndicators: [
            'planetary benefit', 'consciousness raising', 'humanity serving',
            'universal good', 'transcendent purpose', 'world healing'
        ]
    }
};

/**
 * KPIMatcher - Matches story content to octave-appropriate KPIs
 */
class KPIMatcher {
    constructor() {
        this._patterns = KPI_SOPHISTICATION_PATTERNS;
    }

    /**
     * Match story text to octave levels across different domains
     * @param {string} storyText - The organization story
     * @returns {Object} Matching result with domain-specific octaves
     */
    match(storyText) {
        const lowerStory = storyText.toLowerCase();
        const stageInfo = detectOrganizationStage(storyText);

        const domainScores = {
            financial: this._scoreDomain(lowerStory, 'financialIndicators'),
            team: this._scoreDomain(lowerStory, 'teamIndicators'),
            operations: this._scoreDomain(lowerStory, 'operationsIndicators'),
            market: this._scoreDomain(lowerStory, 'marketIndicators')
        };

        // Calculate overall octave (weighted average, constrained by stage)
        const overallOctave = this._calculateOverallOctave(domainScores, stageInfo);

        return {
            domainScores,
            overallOctave,
            stageInfo,
            recommendation: this._generateRecommendation(domainScores, overallOctave, stageInfo),
            confidence: this._calculateConfidence(domainScores)
        };
    }

    /**
     * Score a specific domain across all octaves
     */
    _scoreDomain(text, indicatorType) {
        const scores = {};
        let totalMatches = 0;

        for (let i = 1; i <= 7; i++) {
            const octave = `O${i}`;
            const indicators = this._patterns[octave][indicatorType] || [];
            let matches = 0;

            for (const indicator of indicators) {
                if (text.includes(indicator.toLowerCase())) {
                    matches++;
                }
            }

            scores[octave] = matches;
            totalMatches += matches;
        }

        // Find the best matching octave for this domain
        let bestOctave = 'O1';
        let bestScore = 0;

        for (const [octave, score] of Object.entries(scores)) {
            if (score > bestScore) {
                bestScore = score;
                bestOctave = octave;
            }
        }

        return {
            scores,
            bestOctave,
            bestScore,
            totalMatches,
            normalized: totalMatches > 0 ? bestScore / totalMatches : 0
        };
    }

    /**
     * Calculate overall octave from domain scores
     */
    _calculateOverallOctave(domainScores, stageInfo) {
        // Weight domains by importance
        const weights = {
            financial: 0.3,
            team: 0.25,
            operations: 0.25,
            market: 0.2
        };

        let weightedSum = 0;
        let totalWeight = 0;

        for (const [domain, score] of Object.entries(domainScores)) {
            if (score.totalMatches > 0) {
                const octaveNum = parseInt(score.bestOctave.replace('O', ''));
                weightedSum += octaveNum * weights[domain] * score.normalized;
                totalWeight += weights[domain] * score.normalized;
            }
        }

        // Calculate weighted average octave
        let avgOctave = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 1;
        avgOctave = Math.max(1, Math.min(7, avgOctave));

        const proposedOctave = `O${avgOctave}`;

        // Constrain to stage maximum
        return constrainOctave(proposedOctave, stageInfo.maxOctave);
    }

    /**
     * Calculate confidence in the match
     */
    _calculateConfidence(domainScores) {
        const totalMatches = Object.values(domainScores)
            .reduce((sum, s) => sum + s.totalMatches, 0);

        if (totalMatches === 0) return 'low';
        if (totalMatches < 5) return 'medium-low';
        if (totalMatches < 10) return 'medium';
        if (totalMatches < 20) return 'medium-high';
        return 'high';
    }

    /**
     * Generate recommendation based on matches
     */
    _generateRecommendation(domainScores, overallOctave, stageInfo) {
        const octaveInfo = OCTAVES[overallOctave];
        const domains = Object.entries(domainScores);

        // Find strongest and weakest domains
        const sorted = domains.sort((a, b) => b[1].totalMatches - a[1].totalMatches);
        const strongest = sorted[0];
        const weakest = sorted[sorted.length - 1];

        return {
            octave: overallOctave,
            name: octaveInfo?.name || 'Unknown',
            focus: octaveInfo?.focus || '',
            strongestDomain: strongest[0],
            weakestDomain: weakest[0],
            stageConstraint: stageInfo.stage !== 'transcendent'
                ? `Constrained to ${stageInfo.maxOctave} based on ${stageInfo.stage} stage detection`
                : null,
            insight: this._generateInsight(overallOctave, strongest[0], weakest[0])
        };
    }

    /**
     * Generate human-readable insight
     */
    _generateInsight(octave, strongestDomain, weakestDomain) {
        const insights = {
            O1: `Focus is on survival. Strengthen ${weakestDomain} practices to build towards O2.`,
            O2: `Building stable structures. Continue systematizing ${weakestDomain} for sustained growth.`,
            O3: `Relationship focus is emerging. Deepen ${weakestDomain} connections for team coherence.`,
            O4: `Creative energy is active. Apply innovation mindset to ${weakestDomain} domain.`,
            O5: `Expression is clarifying. Bring ${weakestDomain} communication to the same level.`,
            O6: `Vision is forming. Extend long-term thinking to ${weakestDomain} planning.`,
            O7: `Radiance is present. Continue embodying service-orientation across all domains.`
        };

        return insights[octave] || 'Continue developing organizational coherence.';
    }

    /**
     * Get face-specific octave assignments based on domain mapping
     */
    getFaceOctaves(matchResult, faces) {
        const faceOctaves = {};

        // Map domains to faces
        const domainToFaces = {
            financial: [1, 11],  // Financial Capital, Funding Pipeline
            team: [3, 8],       // Human Capital, Core Operations
            operations: [4, 8, 9], // Structural Capital, Core Operations, Regenerative Flow
            market: [5, 6, 7]   // Market Resonance, Community, Brand
        };

        for (const [domain, domainFaceIds] of Object.entries(domainToFaces)) {
            const domainScore = matchResult.domainScores[domain];
            const octave = constrainOctave(domainScore.bestOctave, matchResult.stageInfo.maxOctave);

            for (const faceId of domainFaceIds) {
                if (!faceOctaves[faceId]) {
                    faceOctaves[faceId] = {
                        octave,
                        domain,
                        confidence: domainScore.totalMatches > 0 ? 'detected' : 'inferred'
                    };
                }
            }
        }

        // Fill in remaining faces with overall octave
        for (let i = 1; i <= 12; i++) {
            if (!faceOctaves[i]) {
                faceOctaves[i] = {
                    octave: matchResult.overallOctave,
                    domain: 'general',
                    confidence: 'inferred'
                };
            }
        }

        return faceOctaves;
    }
}

// ========================================
// EXPORTS
// ========================================

export { KPIMatcher, KPI_SOPHISTICATION_PATTERNS };

// Export for browser global
if (typeof window !== 'undefined') {
    window.KPIMatcher = KPIMatcher;
}

console.log('✅ KPIMatcher loaded with 7-octave sophistication patterns');
