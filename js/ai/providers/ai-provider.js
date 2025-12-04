/**
 * ========================================
 * AI PROVIDER - Abstract Interface
 * ========================================
 *
 * Defines the contract for all AI providers.
 * Implements Strategy pattern for swappable AI backends.
 *
 * Current Providers:
 * - GeminiProvider: Primary (Google AI)
 * - OfflineProvider: Fallback (semantic analysis)
 *
 * Future Providers (Sprint 3+):
 * - OpenAIProvider: Alternative
 * - AnthropicProvider: Alternative
 *
 * @module AIProvider
 * @version Sprint 2 - Task 10
 */

/**
 * Abstract base class for AI providers.
 * All providers must implement these methods.
 */
class AIProvider {
    constructor() {
        if (new.target === AIProvider) {
            throw new Error('AIProvider is abstract and cannot be instantiated directly');
        }

        this.name = 'AbstractProvider';
        this.isOnline = true;
        this.lastError = null;
    }

    // ========================================
    // REQUIRED METHODS (Override in subclasses)
    // ========================================

    /**
     * Test if provider is available and working
     * @returns {Promise<boolean>} True if provider is available
     */
    async testConnection() {
        throw new Error('testConnection() must be implemented by subclass');
    }

    /**
     * Analyze organizational story and generate 12 face mappings
     * @param {string} storyText - The organization's narrative
     * @returns {Promise<StoryAnalysisResult>} Face mappings with metadata
     */
    async analyzeStory(storyText) {
        throw new Error('analyzeStory() must be implemented by subclass');
    }

    /**
     * Generate 3 Strategic Lenses for the organization
     * @param {string} storyText - The organization's narrative
     * @returns {Promise<StrategicLensResult>} Three lens configurations
     */
    async generateStrategicLenses(storyText) {
        throw new Error('generateStrategicLenses() must be implemented by subclass');
    }

    /**
     * Extract KPIs from story text
     * @param {string} storyText - The organization's narrative
     * @param {string} mode - 'quick' (12 KPIs) or 'full' (60 KPIs)
     * @returns {Promise<KPIExtractionResult>} Extracted KPIs
     */
    async extractKPIs(storyText, mode = 'quick') {
        throw new Error('extractKPIs() must be implemented by subclass');
    }

    /**
     * Determine octave level (O1-O7) for each face
     * @param {Array} faces - Array of face configurations
     * @param {string} storyText - Context from story
     * @returns {Promise<OctaveResult>} Octave assignments
     */
    async determineOctaves(faces, storyText) {
        throw new Error('determineOctaves() must be implemented by subclass');
    }

    /**
     * Suggest best archetype based on story
     * @param {string} storyText - The organization's narrative
     * @returns {Promise<ArchetypeSuggestion>} Recommended archetype
     */
    async suggestArchetype(storyText) {
        throw new Error('suggestArchetype() must be implemented by subclass');
    }

    /**
     * Generate emergent names for edges (face connections)
     * @param {Array} edges - Edge configurations with face pairs
     * @param {Map} faceNames - Current face name mappings
     * @returns {Promise<EdgeNamingResult>} Emergent edge names
     */
    async generateEdgeNames(edges, faceNames) {
        throw new Error('generateEdgeNames() must be implemented by subclass');
    }

    /**
     * Generate emergent names for vertices (face convergence points)
     * @param {Array} vertices - Vertex configurations with face triplets
     * @param {Map} faceNames - Current face name mappings
     * @returns {Promise<VertexNamingResult>} Emergent vertex names
     */
    async generateVertexNames(vertices, faceNames) {
        throw new Error('generateVertexNames() must be implemented by subclass');
    }

    // ========================================
    // UTILITY METHODS (Shared by all providers)
    // ========================================

    /**
     * Get provider capabilities
     * @returns {ProviderCapabilities} What this provider can do
     */
    getCapabilities() {
        return {
            name: this.name,
            isOnline: this.isOnline,
            supportsLenses: true,
            supportsKPIExtraction: true,
            supportsOctaves: true,
            supportsArchetypes: true,
            supportsEdgeNaming: true,
            supportsVertexNaming: true
        };
    }

    /**
     * Get last error if any
     * @returns {Error|null} Last error or null
     */
    getLastError() {
        return this.lastError;
    }

    /**
     * Clear last error
     */
    clearError() {
        this.lastError = null;
    }

    /**
     * Log provider activity
     * @param {string} action - What the provider is doing
     * @param {Object} details - Additional context
     */
    log(action, details = {}) {
        console.log(`[${this.name}] ${action}`, details);
    }

    /**
     * Record an error
     * @param {string} action - What failed
     * @param {Error} error - The error
     */
    logError(action, error) {
        this.lastError = error;
        console.error(`[${this.name}] ${action} failed:`, error.message);
    }
}

// ========================================
// TYPE DEFINITIONS (JSDoc for IDE support)
// ========================================

/**
 * @typedef {Object} StoryAnalysisResult
 * @property {string} type - Organization type (Startup, Business, etc.)
 * @property {string} focus - Primary focus summary
 * @property {Array<FaceConfig>} faces - 12 face configurations
 */

/**
 * @typedef {Object} FaceConfig
 * @property {number} id - Face ID (1-12)
 * @property {string} name - Contextual name for this face
 * @property {string} icon - Emoji icon
 * @property {number} sentiment - Health score (0.0 - 1.0)
 * @property {string} reasoning - Why this name fits
 */

/**
 * @typedef {Object} StrategicLensResult
 * @property {LensConfig} growth - Face-centered growth lens
 * @property {LensConfig} stability - Edge-centered stability lens
 * @property {LensConfig} innovation - Vertex-centered innovation lens
 */

/**
 * @typedef {Object} LensConfig
 * @property {string} name - Lens name
 * @property {string} description - Lens philosophy
 * @property {Array<FaceConfig>} faces - 12 face configurations for this lens
 */

/**
 * @typedef {Object} KPIExtractionResult
 * @property {Array<KPIConfig>} kpis - Extracted KPIs
 * @property {Object} financials - Detected financial metrics
 */

/**
 * @typedef {Object} KPIConfig
 * @property {number} faceId - Which face this KPI belongs to
 * @property {string} name - KPI name
 * @property {string} value - Extracted or estimated value
 * @property {string} source - 'extracted' or 'estimated'
 */

/**
 * @typedef {Object} OctaveResult
 * @property {Array<OctaveAssignment>} assignments - Octave per face
 */

/**
 * @typedef {Object} OctaveAssignment
 * @property {number} faceId - Face ID
 * @property {string} octave - O1-O7
 * @property {string} reasoning - Why this octave
 */

/**
 * @typedef {Object} ArchetypeSuggestion
 * @property {string} primary - Recommended archetype
 * @property {string} secondary - Alternative archetype
 * @property {string} reasoning - Why this archetype fits
 * @property {number} confidence - Confidence score (0.0 - 1.0)
 */

/**
 * @typedef {Object} ProviderCapabilities
 * @property {string} name - Provider name
 * @property {boolean} isOnline - Whether provider needs internet
 * @property {boolean} supportsLenses - Can generate strategic lenses
 * @property {boolean} supportsKPIExtraction - Can extract KPIs
 * @property {boolean} supportsOctaves - Can determine octaves
 * @property {boolean} supportsArchetypes - Can suggest archetypes
 * @property {boolean} supportsEdgeNaming - Can name edges
 * @property {boolean} supportsVertexNaming - Can name vertices
 */

// ========================================
// EXPORTS
// ========================================

export { AIProvider };

// Export for browser global
if (typeof window !== 'undefined') {
    window.AIProvider = AIProvider;
}
