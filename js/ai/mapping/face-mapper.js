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
 * @version Sprint 2 - Task 13 + Face Refinement (Feb 2026)
 */

import { MappingContext, DODECAHEDRON_TOPOLOGY } from '../core/mapping-context.js';
import { getProvider } from '../providers/index.js';
import { buildFaceRefinementPrompt, parseRefinementResponse } from '../prompts/face-refinement-prompt.js';

// ========================================
// PHI CONSTANTS - Single Source Reference
// ========================================
// Primary source: js/constants/phi-harmonics.js
const _PH = (typeof window !== 'undefined' && window.PhiHarmonics) || {};

// PHI Powers (with fallbacks for module loading)
const PHI_1 = _PH.PHI_1 || 0.618033988749895;           // φ^-1
const PHI_2 = _PH.PHI_2 || 0.381966011250105;           // φ^-2
const PHI_3 = _PH.PHI_3 || 0.2360679774997896;          // φ^-3
const PHI_4 = _PH.PHI_4 || 0.1458980337503153;          // φ^-4

// PSI Values (complements): PSI_n = 1 - φ^-n
const PSI_3 = _PH.PSI_3 || 0.763932022500210;           // 1 - φ^-3
const PSI_4 = _PH.PSI_4 || 0.8541019662496847;          // 1 - φ^-4

/**
 * PHI-derived sentiment thresholds
 *
 * These thresholds map to the 7 octaves of organizational development:
 * - MINIMAL (φ^-4): O1 Survival threshold
 * - LOW (φ^-3): O2 Structure threshold
 * - MODERATE_LOW (φ^-2): O3-O4 transition
 * - NEUTRAL (0.5): Center point (mathematical, not PHI-derived)
 * - MODERATE_HIGH (φ^-1): O4-O5 transition (Golden Ratio)
 * - HIGH (Ψ³): O5-O6 transition
 * - MASTERY (Ψ⁴): O6-O7 transition
 */
const PHI_SENTIMENTS = {
    MINIMAL: PHI_4,         // φ^-4 ≈ 0.146
    LOW: PHI_3,             // φ^-3 ≈ 0.236
    MODERATE_LOW: PHI_2,    // φ^-2 ≈ 0.382
    NEUTRAL: 0.5,           // Center point (not PHI-derived)
    MODERATE_HIGH: PHI_1,   // φ^-1 ≈ 0.618
    HIGH: PSI_3,            // Ψ³ ≈ 0.764
    MASTERY: PSI_4          // Ψ⁴ ≈ 0.854
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
     * Refine a face name using AI by incorporating user feedback.
     *
     * This creates a collaborative refinement where:
     * - AI's original mapping is the starting point
     * - User's context/feedback is the refinement input
     * - AI synthesizes both into an improved face name
     *
     * @param {number} faceId - Face ID (1-12)
     * @param {string} additionalContext - User's feedback/refinement request
     * @param {Object} [options] - Optional refinement settings
     * @param {number} [options.temperature=0.7] - AI creativity (0-1)
     * @param {boolean} [options.preserveOriginal=true] - Keep original mapping in audit trail
     * @returns {Promise<Object>} Refinement result with refined and original data
     * @throws {Error} If faceId invalid, context too short, or AI fails
     *
     * @see {@link ../../../docs/ai/FACE_REFINEMENT_SPECIFICATION.md} - Complete specification
     *
     * @example
     * const result = await faceMapper.refineFaceName(5,
     *   "We're B2B SaaS. 'Market Resonance' is too consumer-focused. We think 'Enterprise Alignment'."
     * );
     * // Returns: {
     * //   faceId: 5,
     * //   refined: { name: "Enterprise Alignment", reasoning: "...", confidence: 0.92 },
     * //   original: { name: "Market Resonance", reasoning: "..." },
     * //   userFeedback: "...",
     * //   timestamp: "2026-01-31T10:30:00.000Z"
     * // }
     */
    async refineFaceName(faceId, additionalContext, options = {}) {
        // Ensure AI provider is ready
        await this._ensureProvider();

        // Get current face data
        const currentFace = this.context.getFace(faceId);
        if (!currentFace) {
            throw new Error(`Face ${faceId} not found`);
        }

        // ════════════════════════════════════════════════════════════════════
        // INPUT VALIDATION
        // ════════════════════════════════════════════════════════════════════

        if (!additionalContext || typeof additionalContext !== 'string') {
            throw new Error('additionalContext must be a non-empty string');
        }

        const trimmedContext = additionalContext.trim();
        if (trimmedContext.length < 10) {
            throw new Error('additionalContext too short (minimum 10 characters for meaningful refinement)');
        }

        // ════════════════════════════════════════════════════════════════════
        // BUILD REFINEMENT PROMPT
        // ════════════════════════════════════════════════════════════════════

        const prompt = buildFaceRefinementPrompt({
            faceId,
            currentName: currentFace.name,
            currentReasoning: currentFace.reasoning || 'No prior reasoning recorded',
            userFeedback: trimmedContext
        });

        // ════════════════════════════════════════════════════════════════════
        // SEND TO AI PROVIDER
        // ════════════════════════════════════════════════════════════════════

        console.log(`[FaceMapper] Refining Face ${faceId}: "${currentFace.name}"`);
        console.log(`[FaceMapper] User feedback: "${trimmedContext.substring(0, 100)}${trimmedContext.length > 100 ? '...' : ''}"`);

        let aiResponse;
        try {
            aiResponse = await this.provider.generateText(prompt, {
                temperature: options.temperature ?? 0.7,
                maxTokens: 500
            });
        } catch (err) {
            console.error('[FaceMapper] AI call failed:', err);
            throw new Error(`AI refinement request failed: ${err.message}`);
        }

        // ════════════════════════════════════════════════════════════════════
        // PARSE AND VALIDATE RESPONSE
        // ════════════════════════════════════════════════════════════════════

        let refinement;
        try {
            refinement = parseRefinementResponse(aiResponse);
        } catch (err) {
            console.error('[FaceMapper] Refinement parsing failed:', err.message);
            throw new Error(`AI refinement response invalid: ${err.message}`);
        }

        // ════════════════════════════════════════════════════════════════════
        // UPDATE CONTEXT WITH REFINEMENT
        // ════════════════════════════════════════════════════════════════════

        const timestamp = new Date().toISOString();

        const updateData = {
            name: refinement.refinedName,
            reasoning: refinement.reasoning,
            source: 'ai-refined',
            confidence: refinement.confidence,
            refinementHistory: [
                ...(currentFace.refinementHistory || []),
                {
                    timestamp,
                    userFeedback: trimmedContext,
                    originalName: currentFace.name,
                    originalReasoning: currentFace.reasoning || null,
                    refinedName: refinement.refinedName,
                    refinedReasoning: refinement.reasoning,
                    confidence: refinement.confidence,
                    preservedConcept: refinement.preservedConcept
                }
            ]
        };

        this.context.updateFace(faceId, updateData);

        console.log(`[FaceMapper] ✓ Face ${faceId} refined: "${currentFace.name}" → "${refinement.refinedName}" (${Math.round(refinement.confidence * 100)}% confidence)`);

        // ════════════════════════════════════════════════════════════════════
        // RETURN RESULT FOR UI
        // ════════════════════════════════════════════════════════════════════

        return {
            faceId,
            refined: {
                name: refinement.refinedName,
                reasoning: refinement.reasoning,
                confidence: refinement.confidence,
                preservedConcept: refinement.preservedConcept
            },
            original: {
                name: currentFace.name,
                reasoning: currentFace.reasoning || null
            },
            userFeedback: trimmedContext,
            timestamp
        };
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
