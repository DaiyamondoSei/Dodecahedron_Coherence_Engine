/**
 * ========================================
 * KPI MATCHER
 * ========================================
 *
 * Matches story content to octave-level KPI descriptions.
 * This ensures startups get O1-O2, not O5-O6.
 *
 * KEY INSIGHT: Octave = KPI SOPHISTICATION, not face count.
 * Match story content to the sophistication level of described practices.
 *
 * @module KPIMatcher
 * @version Sprint 2 - Task 7
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
