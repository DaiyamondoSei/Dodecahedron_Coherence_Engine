/**
 * ========================================
 * BREATH AXIS ANALYZER
 * ========================================
 *
 * Analyzes organization stories to dissect them into 6 breath axes.
 * Each axis represents an opposing face pair (projection/reception).
 *
 * The 6 Breath Axes:
 * 1. Resource Flow (F1↔F11): Financial Capital ↔ Funding Pipeline
 * 2. Substance & Story (F2↔F7): Intellectual Capital ↔ Brand & Reputation
 * 3. Being & Doing (F3↔F8): Human Capital ↔ Core Operations
 * 4. Form & Integrity (F4↔F9): Structural Capital ↔ Regenerative Flow
 * 5. Perception & Truth (F5↔F10): Market Resonance ↔ Foundational Values
 * 6. Network & Fortress (F6↔F12): Community & Partners ↔ Risk & Resilience
 *
 * @module BreathAxisAnalyzer
 * @version Sprint 2 - Task 6
 */

import { BREATH_AXES, OCTAVES, detectOrganizationStage, constrainOctave } from './octave-reference-library.js';

// Keyword patterns for detecting axis presence in story text
const AXIS_KEYWORDS = {
    1: { // Resource Flow (F1↔F11)
        projection: ['funding', 'raise', 'investor', 'pitch', 'capital seeking', 'fundraise', 'venture capital', 'angel'],
        reception: ['cash', 'runway', 'budget', 'treasury', 'bank', 'reserve', 'revenue', 'profit'],
        both: ['money', 'finance', 'financial', 'investment', 'capital', 'funds', 'resource']
    },
    2: { // Substance & Story (F2↔F7)
        projection: ['brand', 'reputation', 'image', 'perception', 'marketing', 'story', 'narrative'],
        reception: ['ip', 'patent', 'knowledge', 'proprietary', 'trade secret', 'research', 'development', 'thesis'],
        both: ['innovation', 'idea', 'concept', 'intellectual', 'creation']
    },
    3: { // Being & Doing (F3↔F8)
        projection: ['operations', 'process', 'workflow', 'production', 'delivery', 'execution', 'output'],
        reception: ['team', 'people', 'employee', 'staff', 'talent', 'culture', 'hr', 'founder'],
        both: ['work', 'human', 'capability', 'capacity', 'performance']
    },
    4: { // Form & Integrity (F4↔F9)
        projection: ['governance', 'structure', 'policy', 'compliance', 'legal', 'framework', 'system'],
        reception: ['regenerative', 'sustainable', 'ethical', 'integrity', 'values-aligned', 'responsible'],
        both: ['process', 'procedure', 'guideline', 'standard', 'protocol']
    },
    5: { // Perception & Truth (F5↔F10)
        projection: ['market', 'customer', 'user', 'audience', 'client', 'consumer', 'buyer'],
        reception: ['values', 'mission', 'purpose', 'why', 'belief', 'principle', 'foundation'],
        both: ['trust', 'authentic', 'genuine', 'real', 'truth']
    },
    6: { // Network & Fortress (F6↔F12)
        projection: ['partner', 'community', 'ecosystem', 'alliance', 'collaboration', 'network'],
        reception: ['risk', 'resilience', 'contingency', 'backup', 'security', 'protection'],
        both: ['relationship', 'connection', 'support', 'stability']
    }
};

// Octave-level keyword indicators
const OCTAVE_INDICATORS = {
    O1: ['survive', 'exist', 'basic', 'minimal', 'enough', 'bootstrap', 'mvp', 'viable', 'first'],
    O2: ['stable', 'structure', 'process', 'efficient', 'systematic', 'organized', 'reliable'],
    O3: ['trust', 'community', 'relationship', 'connection', 'loyal', 'belonging', 'team'],
    O4: ['creative', 'innovative', 'experiment', 'bold', 'novel', 'diverse', 'possibility'],
    O5: ['express', 'transparent', 'clarity', 'authentic', 'voice', 'story', 'communicate'],
    O6: ['legacy', 'long-term', 'future', 'generational', 'vision', 'evolve', 'direction'],
    O7: ['radiance', 'sacred', 'planetary', 'consciousness', 'gift', 'service', 'healing']
};

/**
 * BreathAxisAnalyzer - Analyzes stories through breath axis framework
 */
class BreathAxisAnalyzer {
    constructor() {
        this._axisKeywords = AXIS_KEYWORDS;
        this._octaveIndicators = OCTAVE_INDICATORS;
    }

    /**
     * Analyze a story text and return breath axis assessment
     * @param {string} storyText - The organization story to analyze
     * @returns {Object} Analysis result with axis presence and octave estimates
     */
    analyze(storyText) {
        const lowerStory = storyText.toLowerCase();
        const stageInfo = detectOrganizationStage(storyText);

        const axisAnalysis = {};
        let totalProjectionStrength = 0;
        let totalReceptionStrength = 0;

        // Analyze each breath axis
        for (let axisId = 1; axisId <= 6; axisId++) {
            const keywords = this._axisKeywords[axisId];
            const axisData = BREATH_AXES.find(a => a.id === axisId);

            // Count keyword matches
            const projectionMatches = this._countKeywordMatches(lowerStory, keywords.projection);
            const receptionMatches = this._countKeywordMatches(lowerStory, keywords.reception);
            const bothMatches = this._countKeywordMatches(lowerStory, keywords.both);

            // Calculate strengths (normalized 0-1)
            const projectionStrength = Math.min(1, (projectionMatches + bothMatches * 0.5) / 5);
            const receptionStrength = Math.min(1, (receptionMatches + bothMatches * 0.5) / 5);

            // Determine breath ratio
            const breathRatio = projectionStrength > 0 || receptionStrength > 0
                ? projectionStrength / (projectionStrength + receptionStrength)
                : 0.5;

            // Detect octave level for this axis
            const axisOctave = this._detectAxisOctave(lowerStory, axisId);
            const constrainedOctave = constrainOctave(axisOctave, stageInfo.maxOctave);

            totalProjectionStrength += projectionStrength;
            totalReceptionStrength += receptionStrength;

            axisAnalysis[axisId] = {
                name: axisData?.name || `Axis ${axisId}`,
                projectionFace: axisData?.projectionFace,
                receptionFace: axisData?.receptionFace,
                projectionStrength,
                receptionStrength,
                breathRatio,
                octave: constrainedOctave,
                octaveUnconstrained: axisOctave,
                presence: projectionStrength + receptionStrength > 0.2 ? 'present' : 'minimal',
                interpretation: this._interpretBreathRatio(breathRatio)
            };
        }

        // Calculate overall breath balance
        const overallBreathRatio = totalProjectionStrength > 0 || totalReceptionStrength > 0
            ? totalProjectionStrength / (totalProjectionStrength + totalReceptionStrength)
            : 0.5;

        // Determine overall octave
        const overallOctave = this._calculateOverallOctave(axisAnalysis, stageInfo);

        return {
            axes: axisAnalysis,
            overall: {
                projectionStrength: totalProjectionStrength / 6,
                receptionStrength: totalReceptionStrength / 6,
                breathRatio: overallBreathRatio,
                interpretation: this._interpretBreathRatio(overallBreathRatio),
                octave: overallOctave,
                stage: stageInfo
            },
            summary: this._generateSummary(axisAnalysis, overallOctave, stageInfo)
        };
    }

    /**
     * Count keyword matches in text
     */
    _countKeywordMatches(text, keywords) {
        let count = 0;
        for (const keyword of keywords) {
            const regex = new RegExp(keyword, 'gi');
            const matches = text.match(regex);
            if (matches) count += matches.length;
        }
        return count;
    }

    /**
     * Detect octave level for a specific axis
     */
    _detectAxisOctave(text, axisId) {
        const octaveScores = {};

        for (const [octave, indicators] of Object.entries(this._octaveIndicators)) {
            let score = 0;
            for (const indicator of indicators) {
                if (text.includes(indicator)) {
                    score += 1;
                }
            }
            octaveScores[octave] = score;
        }

        // Find the highest scoring octave
        let bestOctave = 'O1';
        let bestScore = 0;

        for (const [octave, score] of Object.entries(octaveScores)) {
            if (score > bestScore) {
                bestScore = score;
                bestOctave = octave;
            }
        }

        // Default to O1 if no matches
        return bestScore > 0 ? bestOctave : 'O1';
    }

    /**
     * Calculate overall octave from axis analysis
     */
    _calculateOverallOctave(axisAnalysis, stageInfo) {
        const octaveCounts = {};

        for (const axis of Object.values(axisAnalysis)) {
            const octave = axis.octave;
            octaveCounts[octave] = (octaveCounts[octave] || 0) + 1;
        }

        // Find the most common octave
        let mostCommon = 'O1';
        let maxCount = 0;

        for (const [octave, count] of Object.entries(octaveCounts)) {
            if (count > maxCount) {
                maxCount = count;
                mostCommon = octave;
            }
        }

        // Constrain to stage maximum
        return constrainOctave(mostCommon, stageInfo.maxOctave);
    }

    /**
     * Interpret breath ratio
     */
    _interpretBreathRatio(ratio) {
        if (ratio < 0.3) return 'Strong Inhale (Reception dominant)';
        if (ratio < 0.45) return 'Moderate Inhale';
        if (ratio <= 0.55) return 'Balanced Breath';
        if (ratio <= 0.7) return 'Moderate Exhale';
        return 'Strong Exhale (Projection dominant)';
    }

    /**
     * Generate human-readable summary
     */
    _generateSummary(axisAnalysis, overallOctave, stageInfo) {
        const presentAxes = Object.values(axisAnalysis).filter(a => a.presence === 'present');
        const dominantAxis = Object.values(axisAnalysis).reduce((prev, curr) =>
            (curr.projectionStrength + curr.receptionStrength) > (prev.projectionStrength + prev.receptionStrength)
                ? curr : prev
        );

        const octaveInfo = OCTAVES[overallOctave];

        return {
            stage: `Detected as ${stageInfo.stage} stage organization`,
            octave: `Overall developmental octave: ${overallOctave} - ${octaveInfo?.name || 'Unknown'}`,
            focus: octaveInfo?.focus ? `Focus: ${octaveInfo.focus}` : '',
            activeAxes: `${presentAxes.length} of 6 breath axes are actively mentioned`,
            dominantAxis: `Dominant axis: ${dominantAxis.name}`,
            constraint: `Maximum allowed octave for this stage: ${stageInfo.maxOctave}`
        };
    }

    /**
     * Get octave assignment for each face based on axis analysis
     */
    getFaceOctaves(analysisResult) {
        const faceOctaves = {};

        for (const [axisId, axis] of Object.entries(analysisResult.axes)) {
            // Assign octave to both faces of this axis
            if (axis.projectionFace) {
                faceOctaves[axis.projectionFace] = {
                    octave: axis.octave,
                    role: 'projection',
                    axisName: axis.name,
                    strength: axis.projectionStrength
                };
            }
            if (axis.receptionFace) {
                faceOctaves[axis.receptionFace] = {
                    octave: axis.octave,
                    role: 'reception',
                    axisName: axis.name,
                    strength: axis.receptionStrength
                };
            }
        }

        return faceOctaves;
    }
}

// ========================================
// EXPORTS
// ========================================

export { BreathAxisAnalyzer, AXIS_KEYWORDS, OCTAVE_INDICATORS };

// Export for browser global
if (typeof window !== 'undefined') {
    window.BreathAxisAnalyzer = BreathAxisAnalyzer;
}

Logger.info('BreathAxisAnalyzer', 'Module loaded with 6 breath axes');
