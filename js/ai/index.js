/**
 * ========================================
 * QUANNEX AI MODULE - Master Index
 * ========================================
 *
 * Central export for all AI-related functionality.
 *
 * This module provides:
 * - MappingContext: Central state management (singleton)
 * - AI Providers: Gemini & Offline fallback
 * - UI Components: API key manager, mode selector
 *
 * Usage:
 * import { MappingContext, getProvider, APIKeyManager } from './ai/index.js';
 *
 * @module QuannexAI
 * @version Sprint 2
 * @see {@link ../../docs/AI_SYSTEM_GUIDE.md} - Complete AI subsystem architecture (36 files)
 */

// ========================================
// CORE - State Management
// ========================================

// Import for local use in browser global
import {
    MappingContext,
    DODECAHEDRON_TOPOLOGY,
    ValidationGate,
    NamePropagator
} from './core/index.js';

export {
    MappingContext,
    FaceMapping,
    EdgeMapping,
    VertexMapping,
    DODECAHEDRON_TOPOLOGY,
    ValidationGate,
    COMPLETION_THRESHOLDS,
    EMPOWERING_MESSAGES,
    NamePropagator,
    VISUALIZATION_TARGETS,
    PROPAGATION_EVENTS
} from './core/index.js';

// ========================================
// PROVIDERS - AI Backends
// ========================================

// Import for local use in browser global
import {
    ProviderFactory,
    PROVIDER_TYPES,
    getProvider,
    getGeminiProvider,
    getOpenAIProvider,
    getOfflineProvider
} from './providers/index.js';

export {
    AIProvider,
    GeminiProvider,
    OpenAIProvider,
    OfflineProvider,
    ProviderFactory,
    PROVIDER_TYPES,
    getProvider,
    getProviderWithKey,
    getGeminiProvider,
    getOpenAIProvider,
    getOfflineProvider,
    PHI_THRESHOLDS,
    OPENAI_DEFAULTS,
    FACE_TEMPLATES
} from './providers/index.js';

// ========================================
// UI - User Interface Components
// ========================================

// Import for local use in browser global
import { APIKeyManager, ModeSelector } from './ui/index.js';
import { ArchetypeSelector } from './ui/archetype-selector.js';

export {
    APIKeyManager,
    API_KEY_STATUS,
    STORAGE_KEYS,
    ModeSelector,
    MODES
} from './ui/index.js';

export { ArchetypeSelector, ARCHETYPES } from './ui/archetype-selector.js';

// ========================================
// MAPPING - AI Analysis Functions
// ========================================

// Import for local use in browser global
import { FaceMapper, KPIExtractor, OctaveDeterminer } from './mapping/index.js';

export {
    FaceMapper,
    LENS_CONFIGS,
    PHI_SENTIMENTS,
    KPIExtractor,
    KPI_TEMPLATES,
    EXTRACTION_PATTERNS,
    OctaveDeterminer,
    OCTAVE_THRESHOLDS,
    OCTAVE_DESCRIPTIONS,
    OCTAVE_ICONS
} from './mapping/index.js';

// ========================================
// TUNING - Constants & Presets
// ========================================

// Import for local use in browser global (re-export doesn't create local binding)
import {
    ARCHETYPE_PRESETS,
    PHI,
    getOctaveModifier,
    applyOctaveModifiers
} from './tuning/index.js';

export {
    ARCHETYPE_PRESETS,
    PHI,
    getArchetypePreset,
    getPresetComparison,
    getDominantParameter,
    validatePresets,
    createBlendedPreset,
    snapToPhiValue,
    OCTAVE_KAPPA_MODIFIERS,
    OCTAVE_DELTA_MODIFIERS,
    OCTAVE_GAMMA_MODIFIERS,
    getOctaveModifier,
    applyOctaveModifiers,
    calculateFaceConstants,
    getStageDescription,
    getModifierExplanation,
    getOctaveThresholds
} from './tuning/index.js';

// ========================================
// ADAPTERS - Integration with existing code
// ========================================

// Import for local use in browser global
import { ShadowAdapter } from './adapters/index.js';

export {
    ShadowAdapter,
    SHADOW_TEMPLATES,
    SEVERITY_STYLES
} from './adapters/index.js';

// ========================================
// CONVENIENCE FUNCTIONS
// ========================================

/**
 * Initialize the AI module with all components
 * @param {Object} options - Configuration options
 * @returns {Object} Initialized components
 */
export async function initializeAI(options = {}) {
    const {
        apiKeyContainer,
        modeContainer,
        onReady = () => {},
        onError = () => {}
    } = options;

    try {
        // Get MappingContext singleton
        const context = MappingContext.getInstance();

        // Create provider
        const provider = await getProvider();

        // Initialize UI components if containers provided
        let apiKeyManager = null;
        let modeSelector = null;

        if (apiKeyContainer) {
            apiKeyManager = new APIKeyManager({
                onKeyValidated: (valid) => {
                    console.log('[QuannexAI] API key validated:', valid);
                }
            });
            apiKeyManager.init(apiKeyContainer);
        }

        if (modeContainer) {
            modeSelector = new ModeSelector({
                onModeChange: (mode, config) => {
                    console.log('[QuannexAI] Mode changed:', mode, config);
                }
            });
            modeSelector.init(modeContainer);
        }

        const result = {
            context,
            provider,
            apiKeyManager,
            modeSelector
        };

        onReady(result);
        return result;

    } catch (error) {
        console.error('[QuannexAI] Initialization error:', error);
        onError(error);
        throw error;
    }
}

/**
 * Get the current provider status
 * @returns {Promise<Object>} Provider status
 */
export async function getAIStatus() {
    return ProviderFactory.getProviderStatus();
}

// ========================================
// BROWSER GLOBAL EXPORT
// ========================================

if (typeof window !== 'undefined') {
    window.QuannexAI = {
        // Core
        MappingContext,
        DODECAHEDRON_TOPOLOGY,
        ValidationGate,
        NamePropagator,

        // Providers
        ProviderFactory,
        PROVIDER_TYPES,
        getProvider,
        getGeminiProvider,
        getOpenAIProvider,
        getOfflineProvider,

        // UI
        APIKeyManager,
        ModeSelector,
        ArchetypeSelector,

        // Mapping
        FaceMapper,
        KPIExtractor,
        OctaveDeterminer,

        // Tuning
        ARCHETYPE_PRESETS,
        PHI,
        getOctaveModifier,
        applyOctaveModifiers,

        // Adapters
        ShadowAdapter,

        // Initialization
        initializeAI,
        getAIStatus
    };

    console.log('[QuannexAI] Sprint 2 Module loaded with OpenAI support. Access via window.QuannexAI');
}
