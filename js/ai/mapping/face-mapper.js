/**
 * ========================================
 * FACE MAPPER - AI Story Analysis
 * ========================================
 *
 * Transforms organizational narratives into 12-face configurations.
 * Generates 3 Strategic Lenses for different perspectives.
 *
 * The 3 Strategic Lenses (from Dodecahedron Architect):
 * 1. Growth Lens (Face-centered): Domain expansion focus
 * 2. Stability Lens (Edge-centered): Relationship health focus
 * 3. Innovation Lens (Vertex-centered): Emergent synergies focus
 *
 * @module FaceMapper
 * @version Sprint 2 - Task 13
 */

import { MappingContext, DODECAHEDRON_TOPOLOGY } from '../core/mapping-context.js';
import { getProvider } from '../providers/index.js';

// PHI-derived sentiment thresholds
const PHI_SENTIMENTS = {
    MINIMAL: 0.146,
    LOW: 0.236,
    MODERATE_LOW: 0.382,
    NEUTRAL: 0.5,
    MODERATE_HIGH: 0.618,
    HIGH: 0.764,
    MASTERY: 0.854
};

// Lens configurations
const LENS_CONFIGS = {
    growth: {
        id: 'growth',
        name: 'Growth Lens',
        subtitle: 'Domain Expansion Focus',
        geometricView: 'Face-centered',
        icon: '🌱',
        question: 'How can each domain grow stronger?',
        emphasis: 'Individual face strength and potential',
        color: '#10B981' // Green
    },
    stability: {
        id: 'stability',
        name: 'Stability Lens',
        subtitle: 'Relationship Health Focus',
        geometricView: 'Edge-centered',
        icon: '🔗',
        question: 'How well do domains support each other?',
        emphasis: 'Bridges between domains',
        color: '#6366F1' // Indigo
    },
    innovation: {
        id: 'innovation',
        name: 'Innovation Lens',
        subtitle: 'Emergent Synergies Focus',
        geometricView: 'Vertex-centered',
        icon: '✨',
        question: 'What emerges from domain intersections?',
        emphasis: 'Creative convergence at vertices',
        color: '#F59E0B' // Amber
    }
};

/**
 * FaceMapper - Analyzes stories and maps to dodecahedron faces
 */
class FaceMapper {
    constructor(options = {}) {
        this.provider = options.provider || null;
        this.context = MappingContext.getInstance();
        this._lastAnalysis = null;
        this._lastLenses = null;
    }

    // ========================================
    // INITIALIZATION
    // ========================================

    /**
     * Initialize with a provider
     */
    async init() {
        if (!this.provider) {
            this.provider = await getProvider();
        }
        return this;
    }

    /**
     * Ensure provider is ready
     */
    async _ensureProvider() {
        if (!this.provider) {
            this.provider = await getProvider();
        }
    }

    // ========================================
    // STORY ANALYSIS
    // ========================================

    /**
     * Analyze a story and generate face mappings
     * @param {string} storyText - The organizational narrative
     * @param {Object} options - Analysis options
     * @returns {Promise<StoryAnalysisResult>} Analysis result with faces
     */
    async analyzeStory(storyText, options = {}) {
        await this._ensureProvider();

        const {
            updateContext = true,
            generateLenses = true
        } = options;

        console.log('[FaceMapper] Analyzing story...');

        try {
            // Get basic story analysis
            const analysis = await this.provider.analyzeStory(storyText);

            // Validate response
            this._validateAnalysis(analysis);

            // Store last analysis
            this._lastAnalysis = {
                ...analysis,
                analyzedAt: Date.now(),
                storyLength: storyText.length,
                provider: this.provider.name
            };

            // Update MappingContext if requested
            if (updateContext) {
                this._updateContext(analysis.faces);
            }

            // Generate lenses if requested
            if (generateLenses) {
                this._lastLenses = await this.generateStrategicLenses(storyText);
            }

            return {
                success: true,
                ...this._lastAnalysis,
                lenses: this._lastLenses
            };

        } catch (error) {
            console.error('[FaceMapper] Analysis failed:', error);
            return {
                success: false,
                error: error.message,
                fallbackUsed: this.provider.name === 'OfflineProvider'
            };
        }
    }

    /**
     * Validate analysis response structure
     */
    _validateAnalysis(analysis) {
        if (!analysis) {
            throw new Error('Empty analysis response');
        }

        if (!analysis.faces || !Array.isArray(analysis.faces)) {
            throw new Error('Missing faces array in response');
        }

        if (analysis.faces.length !== 12) {
            throw new Error(`Expected 12 faces, got ${analysis.faces.length}`);
        }

        // Validate each face
        analysis.faces.forEach((face, index) => {
            if (!face.id) face.id = index + 1;
            if (!face.name) throw new Error(`Face ${face.id} missing name`);
            if (typeof face.sentiment !== 'number') face.sentiment = 0.5;

            // Clamp sentiment to valid range
            face.sentiment = Math.max(0, Math.min(1, face.sentiment));
        });
    }

    /**
     * Update MappingContext with new face configurations
     */
    _updateContext(faces) {
        const faceConfigs = faces.map(face => ({
            id: face.id,
            name: face.name,
            icon: face.icon || this._getDefaultIcon(face.id),
            sentiment: face.sentiment,
            reasoning: face.reasoning || '',
            source: 'ai'
        }));

        this.context.setAllFaces(faceConfigs);
    }

    /**
     * Get default icon for face ID
     */
    _getDefaultIcon(id) {
        const defaults = DODECAHEDRON_TOPOLOGY.defaultFaceNames;
        const face = defaults.find(f => f.id === id);
        return face ? face.icon : '○';
    }

    // ========================================
    // STRATEGIC LENSES
    // ========================================

    /**
     * Generate 3 Strategic Lenses for the organization
     * @param {string} storyText - The organizational narrative
     * @returns {Promise<LensesResult>} Three lens configurations
     */
    async generateStrategicLenses(storyText) {
        await this._ensureProvider();

        console.log('[FaceMapper] Generating strategic lenses...');

        try {
            const result = await this.provider.generateStrategicLenses(storyText);

            // Validate and enhance response
            const lenses = this._processLensesResponse(result);

            this._lastLenses = {
                lenses,
                generatedAt: Date.now(),
                provider: this.provider.name
            };

            return this._lastLenses;

        } catch (error) {
            console.error('[FaceMapper] Lens generation failed:', error);

            // Return fallback lenses
            return this._getFallbackLenses();
        }
    }

    /**
     * Process and validate lenses response
     */
    _processLensesResponse(result) {
        const processed = {};

        for (const lensId of ['growth', 'stability', 'innovation']) {
            const lensConfig = LENS_CONFIGS[lensId];
            const lensData = result.lenses?.[lensId] || {};

            processed[lensId] = {
                ...lensConfig,
                name: lensData.name || lensConfig.name,
                description: lensData.description || lensConfig.question,
                faces: this._processFacesForLens(lensData.faces, lensId)
            };
        }

        return processed;
    }

    /**
     * Process faces for a specific lens
     */
    _processFacesForLens(faces, lensId) {
        if (!faces || !Array.isArray(faces) || faces.length !== 12) {
            // Return defaults enhanced for lens
            return DODECAHEDRON_TOPOLOGY.defaultFaceNames.map(f => ({
                ...f,
                emphasis: `${LENS_CONFIGS[lensId].emphasis} in ${f.name}`
            }));
        }

        return faces.map((face, index) => ({
            id: face.id || index + 1,
            name: face.name || `Face ${index + 1}`,
            icon: face.icon || this._getDefaultIcon(index + 1),
            emphasis: face.emphasis || '',
            sentiment: face.sentiment || 0.5
        }));
    }

    /**
     * Get fallback lenses when AI fails
     */
    _getFallbackLenses() {
        const lenses = {};

        for (const lensId of ['growth', 'stability', 'innovation']) {
            const config = LENS_CONFIGS[lensId];

            lenses[lensId] = {
                ...config,
                faces: DODECAHEDRON_TOPOLOGY.defaultFaceNames.map(f => ({
                    ...f,
                    emphasis: this._getLensEmphasis(f.name, lensId)
                }))
            };
        }

        return {
            lenses,
            generatedAt: Date.now(),
            provider: 'fallback',
            note: 'Using default lenses (AI unavailable)'
        };
    }

    /**
     * Generate lens-specific emphasis for a face
     */
    _getLensEmphasis(faceName, lensId) {
        const templates = {
            growth: `Expand ${faceName} capacity`,
            stability: `Strengthen ${faceName} foundations`,
            innovation: `Reimagine ${faceName} possibilities`
        };
        return templates[lensId] || faceName;
    }

    // ========================================
    // LENS APPLICATION
    // ========================================

    /**
     * Apply a specific lens to the current context
     * @param {string} lensId - 'growth', 'stability', or 'innovation'
     */
    async applyLens(lensId) {
        if (!LENS_CONFIGS[lensId]) {
            console.error('[FaceMapper] Invalid lens:', lensId);
            return false;
        }

        if (!this._lastLenses?.lenses?.[lensId]) {
            console.error('[FaceMapper] Lens not available. Generate lenses first.');
            return false;
        }

        const lens = this._lastLenses.lenses[lensId];

        // Update context with lens faces
        const faceConfigs = lens.faces.map(face => ({
            id: face.id,
            name: face.name,
            icon: face.icon,
            sentiment: face.sentiment || 0.5,
            reasoning: face.emphasis || '',
            source: 'ai-lens'
        }));

        this.context.setAllFaces(faceConfigs, lensId);
        this.context.setLens(lensId);

        console.log(`[FaceMapper] Applied ${lensId} lens`);
        return true;
    }

    /**
     * Get all available lenses
     */
    getLenses() {
        return this._lastLenses?.lenses || null;
    }

    /**
     * Get a specific lens configuration
     */
    getLens(lensId) {
        return this._lastLenses?.lenses?.[lensId] || null;
    }

    /**
     * Get lens configuration constants
     */
    getLensConfigs() {
        return { ...LENS_CONFIGS };
    }

    // ========================================
    // RE-ANALYSIS
    // ========================================

    /**
     * Re-analyze with a different provider
     * @param {AIProvider} provider - New provider to use
     */
    async reanalyzeWith(provider, storyText) {
        const originalProvider = this.provider;
        this.provider = provider;

        try {
            return await this.analyzeStory(storyText);
        } finally {
            this.provider = originalProvider;
        }
    }

    /**
     * Get last analysis result
     */
    getLastAnalysis() {
        return this._lastAnalysis;
    }

    // ========================================
    // FACE REFINEMENT
    // ========================================

    /**
     * Refine a single face name based on additional context
     * @param {number} faceId - Face ID to refine
     * @param {string} additionalContext - More context about this domain
     */
    async refineFaceName(faceId, additionalContext) {
        await this._ensureProvider();

        const currentFace = this.context.getFace(faceId);
        if (!currentFace) {
            throw new Error(`Face ${faceId} not found`);
        }

        // TODO: Implement refinement prompt
        // For now, just update with additional context as reasoning
        this.context.updateFace(faceId, {
            reasoning: additionalContext,
            source: 'manual-refined'
        });

        return currentFace;
    }

    /**
     * Manually set a face name (override AI)
     */
    setFaceName(faceId, name, metadata = {}) {
        return this.context.setFaceName(faceId, name, {
            ...metadata,
            source: 'manual'
        });
    }
}

// ========================================
// EXPORTS
// ========================================

export {
    FaceMapper,
    LENS_CONFIGS,
    PHI_SENTIMENTS
};

// Export for browser global
if (typeof window !== 'undefined') {
    window.FaceMapper = FaceMapper;
    window.LENS_CONFIGS = LENS_CONFIGS;
}
