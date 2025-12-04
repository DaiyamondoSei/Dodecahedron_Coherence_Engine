/**
 * ========================================
 * AI PROVIDERS - Module Index
 * ========================================
 *
 * Central export for all AI provider classes.
 *
 * Usage:
 * import { ProviderFactory, getProvider } from './providers/index.js';
 * const provider = await getProvider();
 * const result = await provider.analyzeStory(text);
 *
 * Supported Providers:
 * - GeminiProvider: Google's Gemini 2.5 Flash
 * - OpenAIProvider: GPT-5-nano (ultra-low latency)
 * - OfflineProvider: Semantic analysis fallback
 *
 * @module AIProviders
 * @version Sprint 2 - Extended with OpenAI
 */

// Core abstract class
export { AIProvider } from './ai-provider.js';

// Concrete providers
export { GeminiProvider, PHI_THRESHOLDS } from './gemini-provider.js';
export { OpenAIProvider, OPENAI_DEFAULTS } from './openai-provider.js';
export { OfflineProvider, FACE_TEMPLATES } from './offline-provider.js';
// Note: ARCHETYPE_PRESETS is exported from tuning/index.js as canonical source

// Factory and convenience functions
export {
    ProviderFactory,
    PROVIDER_TYPES,
    API_KEY_STORAGE,
    getProvider,
    getProviderWithKey,
    getGeminiProvider,
    getOpenAIProvider,
    getOfflineProvider
} from './provider-factory.js';
