/**
 * ========================================
 * OCTAVE DETERMINER - Developmental Levels
 * ========================================
 *
 * Assigns developmental octave levels (O1-O7) to each face.
 * Octaves represent organizational maturity and capability.
 *
 * The 7 Octaves (from Sacred Geometry principles):
 * O1 - Survival: Baseline viability, keeping lights on
 * O2 - Structure: Building systems, establishing order
 * O3 - Relationships: Network development, tribe building
 * O4 - Creativity: Innovation activation, differentiation
 * O5 - Expression: Communication optimization, influence
 * O6 - Vision: Strategic foresight, seeing possibilities
 * O7 - Radiance: Systemic transcendence, leadership
 *
 * @module OctaveDeterminer
 * @version Sprint 2 - Task 16
 */

import { MappingContext } from '../core/mapping-context.js';
import { getProvider } from '../providers/index.js';

// PHI-derived octave thresholds (sentiment to octave mapping)
const OCTAVE_THRESHOLDS = {
    O1: { min: 0.000, max: 0.146, name: 'Survival' },
    O2: { min: 0.146, max: 0.236, name: 'Structure' },
    O3: { min: 0.236, max: 0.382, name: 'Relationships' },
    O4: { min: 0.382, max: 0.500, name: 'Creativity' },
    O5: { min: 0.500, max: 0.618, name: 'Expression' },
    O6: { min: 0.618, max: 0.764, name: 'Vision' },
    O7: { min: 0.764, max: 1.000, name: 'Radiance' }
};

// Multi-audience octave descriptions
const OCTAVE_DESCRIPTIONS = {
    O1: {
        academic: 'Baseline viability - existential focus on fundamental survival',
        business: 'Keeping the lights on - cash flow and immediate needs',
        intuitive: 'The first heartbeat - survival instinct activated'
    },
    O2: {
        academic: 'Systematization - creating order from chaos',
        business: 'Building foundation - processes and structure',
        intuitive: 'Bones forming - the skeleton takes shape'
    },
    O3: {
        academic: 'Network development - social capital formation',
        business: 'Growing your tribe - relationships and teams',
        intuitive: 'Finding your people - connection awakens'
    },
    O4: {
        academic: 'Innovation activation - creative problem solving',
        business: 'Expressing unique value - differentiation',
        intuitive: 'Voice emerges - creativity flows'
    },
    O5: {
        academic: 'Communication optimization - influence expansion',
        business: 'Being heard - market presence and reach',
        intuitive: 'Speaking truth - your signal strengthens'
    },
    O6: {
        academic: 'Strategic foresight - anticipatory capability',
        business: 'Seeing what is coming - strategic vision',
        intuitive: 'Third eye opens - patterns become visible'
    },
    O7: {
        academic: 'Systemic transcendence - emergent leadership',
        business: 'Industry leadership - setting the standard',
        intuitive: 'Lighthouse stage - you guide others home'
    }
};

// Octave icons (chakra-inspired)
const OCTAVE_ICONS = {
    O1: '🔴', // Root - survival
    O2: '🟠', // Sacral - structure
    O3: '🟡', // Solar Plexus - relationships/power
    O4: '🟢', // Heart - creativity/balance
    O5: '🔵', // Throat - expression
    O6: '💜', // Third Eye - vision
    O7: '⚪' // Crown - radiance/transcendence
};

/**
 * OctaveDeterminer - Assigns developmental octaves to faces
 */
class OctaveDeterminer {
    constructor(options = {}) {
        this.provider = options.provider || null;
        this.context = MappingContext.getInstance();
        this.audienceType = options.audienceType || 'business';
        this._octaveAssignments = new Map();
        this._overallOctave = null;
    }

    // ========================================
    // INITIALIZATION
    // ========================================

    async init() {
        if (!this.provider) {
            this.provider = await getProvider();
        }
        return this;
    }

    async _ensureProvider() {
        if (!this.provider) {
            this.provider = await getProvider();
        }
    }

    // ========================================
    // OCTAVE DETERMINATION
    // ========================================

    /**
     * Determine octaves for all faces
     * @param {string} storyText - Optional story context
     * @returns {Promise<OctaveResult>} Octave assignments
     */
    async determineOctaves(storyText = '') {
        await this._ensureProvider();

        console.log('[OctaveDeterminer] Determining octaves...');

        const faces = this.context.getAllFaces();

        try {
            // Use AI for nuanced octave determination
            const result = await this.provider.determineOctaves(
                faces.map(f => f.toJSON()),
                storyText
            );

            // Process and validate result
            this._processOctaveResult(result);

            // Update context with octaves
            this._updateContextOctaves();

            return {
                success: true,
                overallOctave: this._overallOctave,
                assignments: Array.from(this._octaveAssignments.entries()).map(([faceId, octave]) => ({
                    faceId,
                    ...octave
                })),
                provider: this.provider.name
            };

        } catch (error) {
            console.warn('[OctaveDeterminer] AI failed, using sentiment-based fallback');
            return this._fallbackDetermination(faces);
        }
    }

    /**
     * Process AI octave result
     */
    _processOctaveResult(result) {
        this._overallOctave = result.overallOctave || 'O4';

        if (result.assignments) {
            result.assignments.forEach(assignment => {
                this._octaveAssignments.set(assignment.faceId, {
                    octave: assignment.octave,
                    reasoning: assignment.reasoning || '',
                    source: 'ai'
                });
            });
        }
    }

    /**
     * Fallback: determine octaves from sentiment scores
     */
    _fallbackDetermination(faces) {
        let sentimentSum = 0;

        faces.forEach(face => {
            const octave = this._sentimentToOctave(face.sentiment);
            this._octaveAssignments.set(face.id, {
                octave,
                reasoning: 'Derived from sentiment score',
                source: 'fallback'
            });
            sentimentSum += face.sentiment;
        });

        // Overall octave from average sentiment
        const avgSentiment = sentimentSum / faces.length;
        this._overallOctave = this._sentimentToOctave(avgSentiment);

        this._updateContextOctaves();

        return {
            success: true,
            overallOctave: this._overallOctave,
            assignments: Array.from(this._octaveAssignments.entries()).map(([faceId, octave]) => ({
                faceId,
                ...octave
            })),
            provider: 'fallback',
            note: 'Octaves derived from sentiment scores'
        };
    }

    /**
     * Convert sentiment score to octave level
     */
    _sentimentToOctave(sentiment) {
        for (const [octave, range] of Object.entries(OCTAVE_THRESHOLDS)) {
            if (sentiment >= range.min && sentiment < range.max) {
                return octave;
            }
        }
        return 'O4'; // Default to middle octave
    }

    /**
     * Update MappingContext with octave assignments
     */
    _updateContextOctaves() {
        this._octaveAssignments.forEach((assignment, faceId) => {
            this.context.updateFace(faceId, { octave: assignment.octave });
        });
    }

    // ========================================
    // OCTAVE ACCESS
    // ========================================

    /**
     * Get octave for a specific face
     */
    getOctave(faceId) {
        return this._octaveAssignments.get(faceId)?.octave || 'O4';
    }

    /**
     * Get overall organizational octave
     */
    getOverallOctave() {
        return this._overallOctave || 'O4';
    }

    /**
     * Get octave details with descriptions
     */
    getOctaveDetails(octaveId) {
        const threshold = OCTAVE_THRESHOLDS[octaveId];
        const descriptions = OCTAVE_DESCRIPTIONS[octaveId];

        if (!threshold || !descriptions) {
            return null;
        }

        return {
            id: octaveId,
            name: threshold.name,
            icon: OCTAVE_ICONS[octaveId],
            thresholdRange: { min: threshold.min, max: threshold.max },
            descriptions,
            currentDescription: descriptions[this.audienceType]
        };
    }

    /**
     * Get all octave definitions
     */
    getAllOctaves() {
        return Object.keys(OCTAVE_THRESHOLDS).map(id => ({
            id,
            ...this.getOctaveDetails(id)
        }));
    }

    /**
     * Get octave distribution across faces
     */
    getOctaveDistribution() {
        const distribution = {};

        Object.keys(OCTAVE_THRESHOLDS).forEach(octave => {
            distribution[octave] = {
                count: 0,
                faces: [],
                ...this.getOctaveDetails(octave)
            };
        });

        this._octaveAssignments.forEach((assignment, faceId) => {
            const octave = assignment.octave;
            if (distribution[octave]) {
                distribution[octave].count++;
                distribution[octave].faces.push(faceId);
            }
        });

        return distribution;
    }

    // ========================================
    // OCTAVE MODIFIERS
    // ========================================

    /**
     * Get tuning modifier based on octave
     * Lower octaves = more forgiving, higher octaves = more demanding
     */
    getOctaveModifier(octaveId) {
        const modifiers = {
            O1: 0.618, // Very forgiving
            O2: 0.764, // Forgiving
            O3: 0.854, // Slightly forgiving
            O4: 1.0,   // Balanced
            O5: 1.146, // Slightly demanding
            O6: 1.236, // Demanding
            O7: 1.382  // Most demanding (PHI itself)
        };

        return modifiers[octaveId] || 1.0;
    }

    /**
     * Calculate adjusted KAPPA based on face octave
     */
    getAdjustedKappa(faceId, baseKappa = 0.618) {
        const octave = this.getOctave(faceId);
        const modifier = this.getOctaveModifier(octave);
        return baseKappa * modifier;
    }

    // ========================================
    // MANUAL OVERRIDE
    // ========================================

    /**
     * Manually set octave for a face
     */
    setOctave(faceId, octaveId, reasoning = '') {
        if (!OCTAVE_THRESHOLDS[octaveId]) {
            console.error('[OctaveDeterminer] Invalid octave:', octaveId);
            return false;
        }

        this._octaveAssignments.set(faceId, {
            octave: octaveId,
            reasoning,
            source: 'manual'
        });

        this.context.updateFace(faceId, { octave: octaveId });
        return true;
    }

    /**
     * Set audience type for descriptions
     */
    setAudienceType(type) {
        if (['academic', 'business', 'intuitive'].includes(type)) {
            this.audienceType = type;
        }
    }
}

// ========================================
// EXPORTS
// ========================================

export {
    OctaveDeterminer,
    OCTAVE_THRESHOLDS,
    OCTAVE_DESCRIPTIONS,
    OCTAVE_ICONS
};

// Export for browser global
if (typeof window !== 'undefined') {
    window.OctaveDeterminer = OctaveDeterminer;
    window.OCTAVE_THRESHOLDS = OCTAVE_THRESHOLDS;
}
