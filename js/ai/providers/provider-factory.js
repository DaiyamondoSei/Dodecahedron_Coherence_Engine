/**
 * ========================================
 * PROVIDER FACTORY - Smart Provider Selection
 * ========================================
 *
 * Automatically selects the best available AI provider.
 * Implements Factory pattern with graceful degradation.
 *
 * Selection Priority (configurable):
 * 1. Preferred provider (Gemini or OpenAI)
 * 2. Fallback to other online provider
 * 3. OfflineProvider (always available fallback)
 *
 * Supported Providers:
 * - GeminiProvider: Google's Gemini 2.5 Flash
 * - OpenAIProvider: GPT-5-nano (ultra-low latency)
 * - OfflineProvider: Semantic analysis fallback
 *
 * @module ProviderFactory
 * @version Sprint 2 - Extended with OpenAI
 */

import { GeminiProvider } from './gemini-provider.js';
import { OpenAIProvider } from './openai-provider.js';
import { OfflineProvider } from './offline-provider.js';

// API Key storage keys
const API_KEY_STORAGE = {
    GEMINI: 'quannex_gemini_api_key',
    OPENAI: 'quannex_openai_api_key',
    PREFERRED: 'quannex_preferred_provider'
};

// Provider types
const PROVIDER_TYPES = {
    GEMINI: 'gemini',
    OPENAI: 'openai',
    OFFLINE: 'offline'
};

/**
 * ProviderFactory - Creates the best available AI provider
 */
class ProviderFactory {
    /**
     * Create a provider instance with smart selection
     * @param {Object} options - Configuration options
     * @param {string} options.provider - Force specific provider ('gemini', 'openai', 'offline')
     * @param {string} options.geminiKey - Gemini API key (optional, will check storage)
     * @param {string} options.openaiKey - OpenAI API key (optional, will check storage)
     * @param {boolean} options.forceOffline - Force offline mode for testing
     * @param {number} options.timeout - Connection test timeout in ms
     * @returns {Promise<AIProvider>} The best available provider
     */
    static async create(options = {}) {
        const {
            provider,
            geminiKey,
            openaiKey,
            forceOffline = false,
            timeout = 5000
        } = options;

        // Force offline mode
        if (forceOffline) {
            console.log('[ProviderFactory] Forcing offline mode');
            return new OfflineProvider();
        }

        // Force specific provider
        if (provider) {
            return await ProviderFactory._createSpecificProvider(provider, {
                geminiKey: geminiKey || ProviderFactory.getStoredGeminiKey(),
                openaiKey: openaiKey || ProviderFactory.getStoredOpenAIKey(),
                timeout
            });
        }

        // Check network connectivity
        if (!navigator.onLine) {
            console.log('[ProviderFactory] No network, using offline provider');
            return new OfflineProvider();
        }

        // Get preferred provider or default to gemini
        const preferred = ProviderFactory.getPreferredProvider() || PROVIDER_TYPES.GEMINI;
        const fallback = preferred === PROVIDER_TYPES.GEMINI
            ? PROVIDER_TYPES.OPENAI
            : PROVIDER_TYPES.GEMINI;

        // Try preferred provider first
        const preferredResult = await ProviderFactory._tryProvider(preferred, {
            geminiKey: geminiKey || ProviderFactory.getStoredGeminiKey(),
            openaiKey: openaiKey || ProviderFactory.getStoredOpenAIKey(),
            timeout
        });

        if (preferredResult) {
            return preferredResult;
        }

        // Try fallback provider
        console.log(`[ProviderFactory] ${preferred} failed, trying ${fallback}`);
        const fallbackResult = await ProviderFactory._tryProvider(fallback, {
            geminiKey: geminiKey || ProviderFactory.getStoredGeminiKey(),
            openaiKey: openaiKey || ProviderFactory.getStoredOpenAIKey(),
            timeout
        });

        if (fallbackResult) {
            return fallbackResult;
        }

        // Last resort: offline provider
        console.log('[ProviderFactory] All online providers failed, using offline');
        return new OfflineProvider();
    }

    /**
     * Create a specific provider by name
     * @private
     */
    static async _createSpecificProvider(providerType, options) {
        const { geminiKey, openaiKey, timeout } = options;

        switch (providerType) {
            case PROVIDER_TYPES.GEMINI:
                if (!geminiKey) {
                    console.warn('[ProviderFactory] No Gemini key, falling back to offline');
                    return new OfflineProvider();
                }
                const gemini = new GeminiProvider(geminiKey);
                const geminiConnected = await ProviderFactory._testWithTimeout(
                    gemini.testConnection.bind(gemini),
                    timeout
                );
                if (geminiConnected) {
                    return gemini;
                }
                console.warn('[ProviderFactory] Gemini connection failed');
                return new OfflineProvider();

            case PROVIDER_TYPES.OPENAI:
                if (!openaiKey) {
                    console.warn('[ProviderFactory] No OpenAI key, falling back to offline');
                    return new OfflineProvider();
                }
                const openai = new OpenAIProvider(openaiKey);
                const openaiConnected = await ProviderFactory._testWithTimeout(
                    openai.testConnection.bind(openai),
                    timeout
                );
                if (openaiConnected) {
                    return openai;
                }
                console.warn('[ProviderFactory] OpenAI connection failed');
                return new OfflineProvider();

            case PROVIDER_TYPES.OFFLINE:
            default:
                return new OfflineProvider();
        }
    }

    /**
     * Try to create a provider, return null if fails
     * @private
     */
    static async _tryProvider(providerType, options) {
        const { geminiKey, openaiKey, timeout } = options;

        try {
            if (providerType === PROVIDER_TYPES.GEMINI && geminiKey) {
                const gemini = new GeminiProvider(geminiKey);
                const connected = await ProviderFactory._testWithTimeout(
                    gemini.testConnection.bind(gemini),
                    timeout
                );
                if (connected) {
                    console.log('[ProviderFactory] Gemini provider available');
                    return gemini;
                }
            } else if (providerType === PROVIDER_TYPES.OPENAI && openaiKey) {
                const openai = new OpenAIProvider(openaiKey);
                const connected = await ProviderFactory._testWithTimeout(
                    openai.testConnection.bind(openai),
                    timeout
                );
                if (connected) {
                    console.log('[ProviderFactory] OpenAI provider available');
                    return openai;
                }
            }
        } catch (error) {
            console.warn(`[ProviderFactory] ${providerType} error:`, error.message);
        }

        return null;
    }

    /**
     * Test provider with timeout
     * @param {Function} testFn - Async test function
     * @param {number} timeoutMs - Timeout in milliseconds
     * @returns {Promise<boolean>} Whether test passed
     */
    static async _testWithTimeout(testFn, timeoutMs) {
        return Promise.race([
            testFn(),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Connection timeout')), timeoutMs)
            )
        ]).catch(() => false);
    }

    // ========================================
    // API KEY MANAGEMENT - GEMINI
    // ========================================

    /**
     * Store Gemini API key in localStorage
     * @param {string} apiKey - The API key to store
     */
    static storeGeminiKey(apiKey) {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(API_KEY_STORAGE.GEMINI, apiKey);
        }
    }

    /**
     * Get stored Gemini API key
     * @returns {string|null} The stored API key or null
     */
    static getStoredGeminiKey() {
        if (typeof localStorage !== 'undefined') {
            return localStorage.getItem(API_KEY_STORAGE.GEMINI);
        }
        return null;
    }

    /**
     * Clear stored Gemini API key
     */
    static clearGeminiKey() {
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem(API_KEY_STORAGE.GEMINI);
        }
    }

    /**
     * Check if Gemini API key is stored
     * @returns {boolean} Whether a Gemini API key exists
     */
    static hasGeminiKey() {
        return !!ProviderFactory.getStoredGeminiKey();
    }

    // ========================================
    // API KEY MANAGEMENT - OPENAI
    // ========================================

    /**
     * Store OpenAI API key in localStorage
     * @param {string} apiKey - The API key to store
     */
    static storeOpenAIKey(apiKey) {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(API_KEY_STORAGE.OPENAI, apiKey);
        }
    }

    /**
     * Get stored OpenAI API key
     * @returns {string|null} The stored API key or null
     */
    static getStoredOpenAIKey() {
        if (typeof localStorage !== 'undefined') {
            return localStorage.getItem(API_KEY_STORAGE.OPENAI);
        }
        return null;
    }

    /**
     * Clear stored OpenAI API key
     */
    static clearOpenAIKey() {
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem(API_KEY_STORAGE.OPENAI);
        }
    }

    /**
     * Check if OpenAI API key is stored
     * @returns {boolean} Whether an OpenAI API key exists
     */
    static hasOpenAIKey() {
        return !!ProviderFactory.getStoredOpenAIKey();
    }

    // ========================================
    // PREFERRED PROVIDER MANAGEMENT
    // ========================================

    /**
     * Set preferred provider
     * @param {string} provider - 'gemini' or 'openai'
     */
    static setPreferredProvider(provider) {
        if (typeof localStorage !== 'undefined') {
            if (provider === PROVIDER_TYPES.GEMINI || provider === PROVIDER_TYPES.OPENAI) {
                localStorage.setItem(API_KEY_STORAGE.PREFERRED, provider);
            }
        }
    }

    /**
     * Get preferred provider
     * @returns {string|null} The preferred provider or null
     */
    static getPreferredProvider() {
        if (typeof localStorage !== 'undefined') {
            return localStorage.getItem(API_KEY_STORAGE.PREFERRED);
        }
        return null;
    }

    // ========================================
    // BACKWARDS COMPATIBILITY
    // ========================================

    /**
     * Store API key (defaults to Gemini for backwards compatibility)
     * @param {string} apiKey - The API key to store
     * @deprecated Use storeGeminiKey() or storeOpenAIKey() instead
     */
    static storeApiKey(apiKey) {
        ProviderFactory.storeGeminiKey(apiKey);
    }

    /**
     * Get stored API key (returns Gemini key for backwards compatibility)
     * @returns {string|null} The stored API key or null
     * @deprecated Use getStoredGeminiKey() or getStoredOpenAIKey() instead
     */
    static getStoredApiKey() {
        return ProviderFactory.getStoredGeminiKey();
    }

    /**
     * Clear stored API key (clears Gemini key for backwards compatibility)
     * @deprecated Use clearGeminiKey() or clearOpenAIKey() instead
     */
    static clearApiKey() {
        ProviderFactory.clearGeminiKey();
    }

    /**
     * Check if API key is stored (checks Gemini for backwards compatibility)
     * @returns {boolean} Whether a Gemini API key exists
     * @deprecated Use hasGeminiKey() or hasOpenAIKey() instead
     */
    static hasApiKey() {
        return ProviderFactory.hasGeminiKey();
    }

    // ========================================
    // PROVIDER STATUS
    // ========================================

    /**
     * Get status of all providers
     * @returns {Promise<Object>} Status of each provider
     */
    static async getProviderStatus() {
        const status = {
            gemini: {
                available: false,
                hasApiKey: ProviderFactory.hasGeminiKey(),
                online: navigator.onLine
            },
            openai: {
                available: false,
                hasApiKey: ProviderFactory.hasOpenAIKey(),
                online: navigator.onLine
            },
            offline: {
                available: true,
                note: 'Always available as fallback'
            },
            preferred: ProviderFactory.getPreferredProvider() || 'gemini',
            recommended: 'offline'
        };

        // Test Gemini if we have a key and are online
        if (status.gemini.hasApiKey && status.gemini.online) {
            try {
                const gemini = new GeminiProvider(ProviderFactory.getStoredGeminiKey());
                status.gemini.available = await ProviderFactory._testWithTimeout(
                    gemini.testConnection.bind(gemini),
                    3000
                );
            } catch (error) {
                status.gemini.error = error.message;
            }
        }

        // Test OpenAI if we have a key and are online
        if (status.openai.hasApiKey && status.openai.online) {
            try {
                const openai = new OpenAIProvider(ProviderFactory.getStoredOpenAIKey());
                status.openai.available = await ProviderFactory._testWithTimeout(
                    openai.testConnection.bind(openai),
                    3000
                );
            } catch (error) {
                status.openai.error = error.message;
            }
        }

        // Determine recommended provider
        if (status.gemini.available && status.preferred === 'gemini') {
            status.recommended = 'gemini';
        } else if (status.openai.available && status.preferred === 'openai') {
            status.recommended = 'openai';
        } else if (status.gemini.available) {
            status.recommended = 'gemini';
        } else if (status.openai.available) {
            status.recommended = 'openai';
        }

        return status;
    }

    /**
     * Quick check if AI is available (any provider)
     * @returns {boolean} Whether any provider is ready
     */
    static isAIAvailable() {
        // Offline provider is always available
        return true;
    }

    /**
     * Quick check if online AI is available
     * @returns {boolean} Whether any online provider is likely available
     */
    static isOnlineAIAvailable() {
        return (ProviderFactory.hasGeminiKey() || ProviderFactory.hasOpenAIKey()) && navigator.onLine;
    }

    /**
     * Clear all stored keys and preferences
     */
    static clearAll() {
        ProviderFactory.clearGeminiKey();
        ProviderFactory.clearOpenAIKey();
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem(API_KEY_STORAGE.PREFERRED);
        }
    }
}

// ========================================
// CONVENIENCE FUNCTIONS
// ========================================

/**
 * Get the default provider (quick factory method)
 * @returns {Promise<AIProvider>} Best available provider
 */
async function getProvider() {
    return ProviderFactory.create();
}

/**
 * Get provider with specific API keys
 * @param {string} geminiKey - Gemini API key (optional)
 * @param {string} openaiKey - OpenAI API key (optional)
 * @returns {Promise<AIProvider>} Provider configured with keys
 */
async function getProviderWithKey(geminiKey, openaiKey) {
    return ProviderFactory.create({ geminiKey, openaiKey });
}

/**
 * Get Gemini provider specifically
 * @param {string} apiKey - Gemini API key (optional, uses stored)
 * @returns {Promise<AIProvider>} Gemini provider or offline fallback
 */
async function getGeminiProvider(apiKey) {
    return ProviderFactory.create({
        provider: PROVIDER_TYPES.GEMINI,
        geminiKey: apiKey
    });
}

/**
 * Get OpenAI provider specifically
 * @param {string} apiKey - OpenAI API key (optional, uses stored)
 * @returns {Promise<AIProvider>} OpenAI provider or offline fallback
 */
async function getOpenAIProvider(apiKey) {
    return ProviderFactory.create({
        provider: PROVIDER_TYPES.OPENAI,
        openaiKey: apiKey
    });
}

/**
 * Get offline provider (for testing or demo)
 * @returns {Promise<AIProvider>} Offline provider
 */
async function getOfflineProvider() {
    return ProviderFactory.create({ forceOffline: true });
}

// ========================================
// EXPORTS
// ========================================

export {
    ProviderFactory,
    PROVIDER_TYPES,
    API_KEY_STORAGE,
    getProvider,
    getProviderWithKey,
    getGeminiProvider,
    getOpenAIProvider,
    getOfflineProvider
};

// Export for browser global
if (typeof window !== 'undefined') {
    window.ProviderFactory = ProviderFactory;
    window.PROVIDER_TYPES = PROVIDER_TYPES;
    window.getProvider = getProvider;
    window.getGeminiProvider = getGeminiProvider;
    window.getOpenAIProvider = getOpenAIProvider;
    window.getOfflineProvider = getOfflineProvider;
}
