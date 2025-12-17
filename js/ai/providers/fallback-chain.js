/**
 * ========================================
 * MODULE: fallback-chain.js
 * ========================================
 *
 * FALLBACK CHAIN - Demo Day Resilience
 *
 * CRITICAL: This is the INSURANCE POLICY for the thesis defense demo.
 * It ensures the system works regardless of API availability, network issues,
 * rate limits, or any other external failure mode.
 *
 * THE FOUR-LEVEL FALLBACK HIERARCHY:
 * ┌─────────────────────────────────────────────────────────────┐
 * │ Level 1: PRIMARY PROVIDER (User's preferred AI)            │
 * │   - Gemini (default) OR OpenAI                             │
 * │   - Full AI capabilities, best quality                     │
 * │   - Timeout: 20-30 seconds                                 │
 * ├─────────────────────────────────────────────────────────────┤
 * │ Level 2: SECONDARY PROVIDER (Backup AI)                    │
 * │   - The other provider if key is available                 │
 * │   - Same quality, different vendor                         │
 * │   - Activated if primary fails                             │
 * ├─────────────────────────────────────────────────────────────┤
 * │ Level 3: OFFLINE PROVIDER (Semantic Analysis)              │
 * │   - Uses local OfflineProvider                             │
 * │   - No network required, instant response (~500ms)         │
 * │   - Keyword-based analysis, good quality fallback          │
 * ├─────────────────────────────────────────────────────────────┤
 * │ Level 4: CACHED DEMO DATA (Last Resort)                    │
 * │   - Pre-loaded startup template                            │
 * │   - Hardcoded faces with PHI-derived sentiments            │
 * │   - Always works, demo-safe baseline                       │
 * └─────────────────────────────────────────────────────────────┘
 *
 * DEPENDENCIES:
 * - OfflineProvider (./offline-provider.js) - semantic fallback
 * - GeminiClient (../gemini-client.js) - primary AI provider
 * - OpenAIProvider (./openai-provider.js) - secondary AI provider
 * - localStorage for API key retrieval
 *
 * EXPORTS:
 * - FallbackChain (class) - main resilience orchestrator
 * - TIMEOUTS (constants) - timeout values for each provider
 * - DEMO_CACHE (object) - pre-loaded startup fallback data
 *
 * ========================================
 * NOTES FOR FUTURE CLAUDE
 * ========================================
 *
 * 1. THE EXECUTESWITHFALLBACK() PATTERN (Core Method):
 *    This is the heart of resilience. It takes an operation function
 *    and tries each provider in order until one succeeds:
 *
 *    executeWithFallback(operation, operationName) {
 *      for each provider in order:
 *        try { return operation(provider) }
 *        catch { log error, try next }
 *      return DEMO_CACHE as last resort
 *    }
 *
 * 2. PROVIDER ORDERING LOGIC:
 *    The order is determined by user preference stored in localStorage:
 *    - STORAGE_KEYS.SELECTED_PROVIDER = 'quannex_selected_provider'
 *    - If 'gemini': [Gemini, OpenAI, Offline]
 *    - If 'openai': [OpenAI, Gemini, Offline]
 *    - Offline is ALWAYS last (it always works)
 *
 * 3. TIMEOUT STRATEGY:
 *    Different providers get different timeouts:
 *    - GEMINI_PRIMARY: 20s (fast, reliable)
 *    - GEMINI_FALLBACK: 25s (give it more time if retrying)
 *    - OPENAI: 30s (can be slower for complex analyses)
 *    - OFFLINE: 500ms (instant, no network)
 *
 * 4. THE _META OBJECT (Debugging Gold):
 *    Every result includes _meta with:
 *    {
 *      provider: 'gemini' | 'openai' | 'offline' | 'cached_demo',
 *      attempts: [{ provider, error, time }],
 *      fallbackUsed: boolean,
 *      validation?: { issues, fixApplied }  // for KPIs
 *    }
 *    Use this to understand what happened during the call!
 *
 * 5. KPI EXTRACTION WITH VALIDATION:
 *    extractKPIs() is special - it has THREE layers of protection:
 *    a) Provider fallback (try multiple providers)
 *    b) Retry with exponential backoff (2 retries max)
 *    c) Response validation (validateKPIResponse)
 *
 *    Validation checks:
 *    - KPIs array exists and has items
 *    - Each KPI has valid faceId (1-12)
 *    - Each KPI has label/name
 *    - All 12 faces have at least one KPI
 *
 * 6. RETRY CONFIGURATION:
 *    RETRY_CONFIG = {
 *      maxRetries: 2,
 *      baseDelay: 1000ms,
 *      maxDelay: 5000ms,
 *      backoffMultiplier: 2
 *    }
 *
 *    Retryable errors: timeout, rate limit (429), server errors (500/502/503)
 *    Non-retryable: auth errors, invalid requests
 *
 * 7. DEMO_CACHE STRUCTURE (The Ultimate Fallback):
 *    DEMO_CACHE.startup contains:
 *    - 12 faces with PHI-based sentiments (0.382, 0.5, 0.618)
 *    - Icons for each domain
 *    - type: 'Startup', focus: 'Early-stage venture analysis'
 *    - source: 'cached_demo'
 *
 *    This ensures SOMETHING always displays during demo!
 *
 * 8. PROVIDER STATUS TRACKING:
 *    this.providerStatus tracks each provider:
 *    {
 *      gemini: { available: bool, lastError: obj, lastSuccess: timestamp },
 *      openai: { available: bool, lastError: obj, lastSuccess: timestamp },
 *      offline: { available: true, ... }  // always true
 *    }
 *
 *    Use getStatus() to inspect provider health.
 *
 * 9. CALLBACKS FOR UI FEEDBACK:
 *    Constructor accepts:
 *    - onProviderChange(type, status) - called when provider changes
 *    - onFallback(type, errorMessage) - called when falling back
 *
 *    UI can use these to show "Trying Gemini...", "Falling back...", etc.
 *
 * 10. PERFORMFULLANALYSIS() (Comprehensive Single-Call):
 *     For complete analysis, use performFullAnalysis(storyText, options):
 *     - Step 1: analyzeStory() → get faces
 *     - Step 2-4: In parallel: lenses, octaves, KPIs
 *     - Returns unified result with all data
 *
 *     If offline mode detected, skips API calls and uses local generation.
 *
 * 11. DYNAMIC PROVIDER LOADING:
 *     Providers are loaded on-demand via dynamic import():
 *     - import('../gemini-client.js')
 *     - import('./openai-provider.js')
 *     This keeps the initial bundle small.
 *
 * USED BY:
 * - demo-orchestrator.js (main entry point for demos)
 * - portrait-view.js (story analysis)
 * - Any AI-powered feature needing resilience
 *
 * GOTCHAS:
 * - API keys are in localStorage, not constructor (check both!)
 * - Offline provider is ALWAYS available (it's local analysis)
 * - DEMO_CACHE only has 'startup' template currently
 * - KPI validation may "fix" results by removing invalid KPIs
 * - _meta.fallbackUsed is true even for offline success
 * - withTimeout() uses Promise.race() - clean but can leave promises hanging
 * - localStorage keys must match APIKeyManager exactly
 * - Offline mode triggers if primary returns 'offline' or 'cached_demo'
 *
 * ========================================
 *
 * @module FallbackChain
 * @author Deimantas Butrimas & Claude
 * @version 2.0.0 - Documented with Notes for Future Claude
 */

import { OfflineProvider } from './offline-provider.js';

// Storage keys (must match APIKeyManager)
const STORAGE_KEYS = {
    GEMINI_KEY: 'quannex_gemini_api_key',
    OPENAI_KEY: 'quannex_openai_api_key',
    SELECTED_PROVIDER: 'quannex_selected_provider'
};

// Timeout constants (in ms)
const TIMEOUTS = {
    GEMINI_PRIMARY: 20000,   // 20 seconds
    GEMINI_FALLBACK: 25000,  // 25 seconds
    OPENAI: 30000,           // 30 seconds (increased for complex analyses)
    OFFLINE: 500             // Nearly instant
};

// Cached demo data for absolute fallback
const DEMO_CACHE = {
    startup: {
        faces: [
            { id: 1, name: 'Runway & Resources', icon: '💰', sentiment: 0.5, reasoning: 'Pre-cached startup template' },
            { id: 2, name: 'Innovation Engine', icon: '💡', sentiment: 0.618, reasoning: 'Pre-cached startup template' },
            { id: 3, name: 'Founding Team', icon: '👥', sentiment: 0.618, reasoning: 'Pre-cached startup template' },
            { id: 4, name: 'Tech Stack', icon: '🏗️', sentiment: 0.5, reasoning: 'Pre-cached startup template' },
            { id: 5, name: 'Market Traction', icon: '📈', sentiment: 0.382, reasoning: 'Pre-cached startup template' },
            { id: 6, name: 'Investor Relations', icon: '🤝', sentiment: 0.5, reasoning: 'Pre-cached startup template' },
            { id: 7, name: 'Brand Promise', icon: '⭐', sentiment: 0.382, reasoning: 'Pre-cached startup template' },
            { id: 8, name: 'Product Development', icon: '⚙️', sentiment: 0.618, reasoning: 'Pre-cached startup template' },
            { id: 9, name: 'Growth Loops', icon: '♻️', sentiment: 0.5, reasoning: 'Pre-cached startup template' },
            { id: 10, name: 'Mission & Vision', icon: '🎯', sentiment: 0.618, reasoning: 'Pre-cached startup template' },
            { id: 11, name: 'Funding Pipeline', icon: '💎', sentiment: 0.382, reasoning: 'Pre-cached startup template' },
            { id: 12, name: 'Pivot Readiness', icon: '🛡️', sentiment: 0.5, reasoning: 'Pre-cached startup template' }
        ],
        type: 'Startup',
        focus: 'Early-stage venture analysis',
        overallOctave: 'O2',
        source: 'cached_demo'
    }
};

/**
 * Wrap a promise with a timeout
 */
function withTimeout(promise, ms, errorMessage = 'Request timed out') {
    return Promise.race([
        promise,
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error(errorMessage)), ms)
        )
    ]);
}

// Retry configuration
const RETRY_CONFIG = {
    maxRetries: 2,
    baseDelay: 1000,      // 1 second
    maxDelay: 5000,       // 5 seconds
    backoffMultiplier: 2
};

/**
 * Sleep for a given number of milliseconds
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Calculate exponential backoff delay
 */
function getBackoffDelay(attempt) {
    const delay = RETRY_CONFIG.baseDelay * Math.pow(RETRY_CONFIG.backoffMultiplier, attempt);
    return Math.min(delay, RETRY_CONFIG.maxDelay);
}

/**
 * Validate KPI extraction response
 * @param {Object} result - The result from AI provider
 * @param {string} mode - 'quick' (12 KPIs) or 'full' (60 KPIs)
 * @returns {Object} { valid: boolean, issues: string[], fixedResult?: Object }
 */
function validateKPIResponse(result, mode = 'quick') {
    const issues = [];
    const expectedCount = mode === 'quick' ? 12 : 60;

    // Check if result exists
    if (!result) {
        return { valid: false, issues: ['Result is null or undefined'] };
    }

    // Check for KPIs array
    if (!result.kpis || !Array.isArray(result.kpis)) {
        issues.push('Missing or invalid kpis array');
        return { valid: false, issues };
    }

    // Check KPI count
    const actualCount = result.kpis.length;
    if (actualCount === 0) {
        issues.push('KPIs array is empty');
        return { valid: false, issues };
    }

    if (actualCount < expectedCount * 0.5) {
        issues.push(`Too few KPIs: got ${actualCount}, expected ~${expectedCount}`);
    }

    // Validate individual KPIs
    const validKPIs = [];
    const invalidKPIs = [];

    for (let i = 0; i < result.kpis.length; i++) {
        const kpi = result.kpis[i];
        const kpiIssues = [];

        // Must have faceId
        if (typeof kpi.faceId !== 'number' || kpi.faceId < 1 || kpi.faceId > 12) {
            kpiIssues.push(`Invalid faceId: ${kpi.faceId}`);
        }

        // Must have label or name
        if (!kpi.label && !kpi.name) {
            kpiIssues.push('Missing label/name');
        }

        // For full mode, should have element
        if (mode === 'full' && !kpi.element && !kpi.elementCode) {
            kpiIssues.push('Missing element (full mode)');
        }

        if (kpiIssues.length > 0) {
            invalidKPIs.push({ index: i, issues: kpiIssues, kpi });
        } else {
            validKPIs.push(kpi);
        }
    }

    // Check face distribution
    const faceCount = new Map();
    for (const kpi of validKPIs) {
        const faceId = kpi.faceId;
        faceCount.set(faceId, (faceCount.get(faceId) || 0) + 1);
    }

    // All 12 faces should have at least one KPI
    const missingFaces = [];
    for (let i = 1; i <= 12; i++) {
        if (!faceCount.has(i)) {
            missingFaces.push(i);
        }
    }

    if (missingFaces.length > 0) {
        issues.push(`Missing KPIs for faces: ${missingFaces.join(', ')}`);
    }

    if (invalidKPIs.length > 0) {
        issues.push(`${invalidKPIs.length} KPIs have validation issues`);
    }

    // Determine if result is usable
    const isUsable = validKPIs.length >= expectedCount * 0.3 && missingFaces.length < 6;

    return {
        valid: issues.length === 0,
        usable: isUsable,
        issues,
        stats: {
            total: actualCount,
            valid: validKPIs.length,
            invalid: invalidKPIs.length,
            faceCoverage: 12 - missingFaces.length,
            missingFaces
        },
        fixedResult: isUsable ? {
            ...result,
            kpis: validKPIs,
            _validation: { issues, fixApplied: invalidKPIs.length > 0 }
        } : null
    };
}

/**
 * FallbackChain - Resilient AI provider with automatic failover
 */
class FallbackChain {
    constructor(options = {}) {
        this.geminiKey = options.geminiKey || localStorage.getItem(STORAGE_KEYS.GEMINI_KEY);
        this.openaiKey = options.openaiKey || localStorage.getItem(STORAGE_KEYS.OPENAI_KEY);
        this.preferredProvider = options.preferredProvider || localStorage.getItem(STORAGE_KEYS.SELECTED_PROVIDER) || 'gemini';
        this.offlineProvider = new OfflineProvider();

        // Track which providers succeeded/failed
        this.providerStatus = {
            gemini: { available: null, lastError: null, lastSuccess: null },
            openai: { available: null, lastError: null, lastSuccess: null },
            offline: { available: true, lastError: null, lastSuccess: null }
        };

        // Callbacks for UI updates
        this.onProviderChange = options.onProviderChange || (() => {});
        this.onFallback = options.onFallback || (() => {});

        console.log('🔗 FallbackChain initialized');
    }

    /**
     * Get the current provider status for debugging/display
     */
    getStatus() {
        return {
            geminiAvailable: !!this.geminiKey,
            openaiAvailable: !!this.openaiKey,
            offlineReady: true,
            providerStatus: this.providerStatus
        };
    }

    /**
     * Try to load a provider dynamically
     */
    async _loadProvider(type, key) {
        if (type === 'gemini' && key) {
            const { GeminiClient } = await import('../gemini-client.js');
            return new GeminiClient(key);
        } else if (type === 'openai' && key) {
            const { OpenAIProvider } = await import('./openai-provider.js');
            return new OpenAIProvider(key);
        }
        return null;
    }

    /**
     * Execute an operation with the full fallback chain
     */
    async executeWithFallback(operation, operationName = 'operation') {
        const attempts = [];

        // Build provider order based on preference
        const providerOrder = [];

        if (this.preferredProvider === 'gemini') {
            if (this.geminiKey) providerOrder.push({ type: 'gemini', key: this.geminiKey, timeout: TIMEOUTS.GEMINI_PRIMARY });
            if (this.openaiKey) providerOrder.push({ type: 'openai', key: this.openaiKey, timeout: TIMEOUTS.OPENAI });
        } else {
            if (this.openaiKey) providerOrder.push({ type: 'openai', key: this.openaiKey, timeout: TIMEOUTS.OPENAI });
            if (this.geminiKey) providerOrder.push({ type: 'gemini', key: this.geminiKey, timeout: TIMEOUTS.GEMINI_PRIMARY });
        }

        // Always add offline as final fallback
        providerOrder.push({ type: 'offline', key: null, timeout: TIMEOUTS.OFFLINE });

        // Try each provider in order
        for (const { type, key, timeout } of providerOrder) {
            try {
                console.log(`🔄 Attempting ${operationName} with ${type}...`);
                this.onProviderChange(type, 'attempting');

                let provider;
                if (type === 'offline') {
                    provider = this.offlineProvider;
                } else {
                    provider = await this._loadProvider(type, key);
                    if (!provider) continue;
                }

                const result = await withTimeout(
                    operation(provider),
                    timeout,
                    `${type} timeout after ${timeout}ms`
                );

                // Success!
                this.providerStatus[type].available = true;
                this.providerStatus[type].lastSuccess = Date.now();
                this.onProviderChange(type, 'success');

                console.log(`✅ ${operationName} succeeded with ${type}`);

                return {
                    ...result,
                    _meta: {
                        provider: type,
                        attempts: attempts,
                        fallbackUsed: type === 'offline' || attempts.length > 0
                    }
                };

            } catch (error) {
                console.warn(`⚠️ ${type} failed for ${operationName}:`, error.message);

                this.providerStatus[type].available = false;
                this.providerStatus[type].lastError = { message: error.message, time: Date.now() };

                attempts.push({ provider: type, error: error.message, time: Date.now() });
                this.onFallback(type, error.message);
            }
        }

        // If we get here, even offline failed (shouldn't happen)
        console.error('❌ All providers failed, using cached demo data');
        return {
            ...DEMO_CACHE.startup,
            _meta: {
                provider: 'cached_demo',
                attempts: attempts,
                fallbackUsed: true,
                error: 'All providers failed, using pre-cached demo data'
            }
        };
    }

    // ========================================
    // HIGH-LEVEL OPERATIONS
    // ========================================

    /**
     * Analyze story with fallback
     * @param {string} storyText - The organization story to analyze
     * @param {Object} context - Analysis context (lens, vocabulary, etc.)
     */
    async analyzeStory(storyText, context = {}) {
        return this.executeWithFallback(
            (provider) => provider.analyzeStory(storyText, context),
            'analyzeStory'
        );
    }

    /**
     * Generate strategic lenses with fallback
     */
    async generateStrategicLenses(storyText) {
        return this.executeWithFallback(
            (provider) => provider.generateStrategicLenses(storyText),
            'generateStrategicLenses'
        );
    }

    /**
     * Determine octaves with fallback
     */
    async determineOctaves(faces, storyText) {
        return this.executeWithFallback(
            (provider) => provider.determineOctaves(faces, storyText),
            'determineOctaves'
        );
    }

    /**
     * Extract KPIs with fallback, validation, and retry logic
     * @param {string} storyText - The organization story
     * @param {string} mode - 'quick' (12 KPIs) or 'full' (60 KPIs with elements)
     * @param {string} octave - Target octave 'O1'-'O7' (default: 'O2')
     */
    async extractKPIs(storyText, mode = 'quick', octave = 'O2') {
        console.log(`[FallbackChain] extractKPIs called with mode=${mode}, octave=${octave}`);

        const attempts = [];
        const providerOrder = this._buildProviderOrder();

        // Try each provider in order
        for (const { type, key, timeout } of providerOrder) {
            let retryCount = 0;
            const maxRetries = type === 'offline' ? 0 : RETRY_CONFIG.maxRetries;

            while (retryCount <= maxRetries) {
                try {
                    console.log(`🔄 [extractKPIs] Attempting with ${type} (attempt ${retryCount + 1}/${maxRetries + 1})...`);
                    this.onProviderChange(type, 'attempting');

                    let provider;
                    if (type === 'offline') {
                        provider = this.offlineProvider;
                    } else {
                        provider = await this._loadProvider(type, key);
                        if (!provider) break;  // Move to next provider
                    }

                    // Execute with timeout
                    const result = await withTimeout(
                        provider.extractKPIs(storyText, mode, octave),
                        timeout,
                        `${type} timeout after ${timeout}ms`
                    );

                    // Validate the response
                    const validation = validateKPIResponse(result, mode);

                    if (validation.valid || validation.usable) {
                        // Success (or usable with fixes)
                        this.providerStatus[type].available = true;
                        this.providerStatus[type].lastSuccess = Date.now();
                        this.onProviderChange(type, 'success');

                        const finalResult = validation.valid ? result : validation.fixedResult;

                        console.log(`✅ [extractKPIs] succeeded with ${type}:`, {
                            kpiCount: finalResult.kpis?.length,
                            valid: validation.valid,
                            issues: validation.issues
                        });

                        return {
                            ...finalResult,
                            _meta: {
                                provider: type,
                                attempts: attempts,
                                fallbackUsed: type === 'offline' || attempts.length > 0,
                                validation: validation.stats,
                                retries: retryCount
                            }
                        };
                    }

                    // Response invalid - log and possibly retry
                    console.warn(`⚠️ [extractKPIs] ${type} returned invalid response:`, validation.issues);

                    if (retryCount < maxRetries) {
                        const delay = getBackoffDelay(retryCount);
                        console.log(`🔄 Retrying ${type} in ${delay}ms...`);
                        await sleep(delay);
                        retryCount++;
                        continue;
                    }

                    // Max retries reached - move to next provider
                    attempts.push({
                        provider: type,
                        error: `Invalid response: ${validation.issues.join('; ')}`,
                        time: Date.now(),
                        validation: validation.stats
                    });
                    break;

                } catch (error) {
                    console.warn(`⚠️ [extractKPIs] ${type} error:`, error.message);

                    this.providerStatus[type].available = false;
                    this.providerStatus[type].lastError = { message: error.message, time: Date.now() };

                    // Check if we should retry
                    const isRetryable = this._isRetryableError(error);

                    if (isRetryable && retryCount < maxRetries) {
                        const delay = getBackoffDelay(retryCount);
                        console.log(`🔄 Retrying ${type} in ${delay}ms (${error.message})...`);
                        await sleep(delay);
                        retryCount++;
                        continue;
                    }

                    attempts.push({
                        provider: type,
                        error: error.message,
                        time: Date.now(),
                        retryable: isRetryable,
                        retries: retryCount
                    });
                    this.onFallback(type, error.message);
                    break;
                }
            }
        }

        // All providers failed - return cached demo with KPI structure
        console.error('❌ [extractKPIs] All providers failed, using cached demo data');
        return this._generateFallbackKPIs(mode, octave, attempts);
    }

    /**
     * Build provider order based on preference
     */
    _buildProviderOrder() {
        const providerOrder = [];

        if (this.preferredProvider === 'gemini') {
            if (this.geminiKey) providerOrder.push({ type: 'gemini', key: this.geminiKey, timeout: TIMEOUTS.GEMINI_PRIMARY });
            if (this.openaiKey) providerOrder.push({ type: 'openai', key: this.openaiKey, timeout: TIMEOUTS.OPENAI });
        } else {
            if (this.openaiKey) providerOrder.push({ type: 'openai', key: this.openaiKey, timeout: TIMEOUTS.OPENAI });
            if (this.geminiKey) providerOrder.push({ type: 'gemini', key: this.geminiKey, timeout: TIMEOUTS.GEMINI_PRIMARY });
        }

        // Always add offline as final fallback
        providerOrder.push({ type: 'offline', key: null, timeout: TIMEOUTS.OFFLINE });

        return providerOrder;
    }

    /**
     * Check if an error is retryable
     */
    _isRetryableError(error) {
        const message = error.message?.toLowerCase() || '';

        // Retry on timeouts
        if (message.includes('timeout')) return true;

        // Retry on rate limits
        if (message.includes('rate') || message.includes('429')) return true;

        // Retry on temporary server errors
        if (message.includes('500') || message.includes('502') || message.includes('503')) return true;

        // Don't retry on auth errors, invalid requests, etc.
        return false;
    }

    /**
     * Generate fallback KPIs when all providers fail
     */
    _generateFallbackKPIs(mode, octave, attempts) {
        const kpiCount = mode === 'quick' ? 12 : 60;
        const perFace = kpiCount / 12;
        const kpis = [];

        for (let faceId = 1; faceId <= 12; faceId++) {
            for (let i = 0; i < perFace; i++) {
                const elements = ['earth', 'water', 'fire', 'air', 'ether'];
                const elementNames = ['Earth', 'Water', 'Fire', 'Air', 'Ether'];

                kpis.push({
                    faceId,
                    label: `${octave} ${DEMO_CACHE.startup.faces[faceId - 1]?.name || 'Face ' + faceId} KPI ${i + 1}`,
                    element: mode === 'full' ? elementNames[i % 5] : undefined,
                    elementCode: mode === 'full' ? elements[i % 5] : undefined,
                    question: `How healthy is this area at ${octave}?`,
                    unit: 'score',
                    target: '0.618',
                    source: 'fallback_template'
                });
            }
        }

        return {
            mode,
            octave,
            totalKPIs: kpiCount,
            financials: {
                revenue: { value: null, source: 'not available' },
                runway: { value: null, source: 'not available' },
                teamSize: { value: null, source: 'not available' },
                growthRate: { value: null, source: 'not available' }
            },
            kpis,
            source: 'fallback_template',
            _meta: {
                provider: 'fallback_template',
                attempts: attempts,
                fallbackUsed: true,
                error: 'All providers failed, using fallback template'
            }
        };
    }

    /**
     * Suggest archetype with fallback
     */
    async suggestArchetype(storyText) {
        return this.executeWithFallback(
            (provider) => provider.suggestArchetype(storyText),
            'suggestArchetype'
        );
    }

    /**
     * Generate edge names with fallback
     */
    async generateEdgeNames(edges, faceNames) {
        return this.executeWithFallback(
            (provider) => provider.generateEdgeNames(edges, faceNames),
            'generateEdgeNames'
        );
    }

    /**
     * Generate vertex names with fallback
     */
    async generateVertexNames(vertices, faceNames) {
        return this.executeWithFallback(
            (provider) => provider.generateVertexNames(vertices, faceNames),
            'generateVertexNames'
        );
    }

    // ========================================
    // COMPREHENSIVE SINGLE-CALL OPERATION
    // ========================================

    /**
     * Perform full analysis in a single operation with fallback
     * This consolidates multiple calls and uses the fallback chain once
     * @param {string} storyText - The organization story
     * @param {Object} options - Analysis options (mode, octave)
     */
    async performFullAnalysis(storyText, options = {}) {
        const { mode = 'quick', octave = 'O2' } = options;

        console.log(`🚀 Starting full analysis with fallback chain (mode=${mode}, octave=${octave})...`);

        // Step 1: Story analysis
        const storyResult = await this.analyzeStory(storyText);
        const faces = storyResult.faces;
        const usedProvider = storyResult._meta?.provider;

        // For offline/cached, we can't make more calls - return early with defaults
        if (usedProvider === 'offline' || usedProvider === 'cached_demo') {
            console.log('📴 Using offline mode - generating all data locally');

            const lensResult = await this.offlineProvider.generateStrategicLenses(storyText);
            const octaveResult = await this.offlineProvider.determineOctaves(faces, storyText);
            const archetypeResult = await this.offlineProvider.suggestArchetype(storyText);

            return {
                faces,
                lenses: lensResult.lenses,
                overallOctave: octaveResult.overallOctave,
                faceOctaves: octaveResult.assignments,
                archetype: archetypeResult,
                kpis: [],
                financials: {},
                provider: usedProvider,
                fallbackUsed: true,
                mode: 'offline'
            };
        }

        // Step 2-4: Continue with same provider (or fallback if needed)
        const [lensResult, octaveResult, kpiResult] = await Promise.all([
            this.generateStrategicLenses(storyText),
            this.determineOctaves(faces, storyText),
            this.extractKPIs(storyText, mode, octave)
        ]);

        return {
            faces,
            lenses: lensResult.lenses,
            overallOctave: octaveResult.overallOctave,
            faceOctaves: octaveResult.assignments,
            kpis: kpiResult.kpis || [],
            financials: kpiResult.financials || {},
            provider: usedProvider,
            fallbackUsed: storyResult._meta?.fallbackUsed || false,
            mode
        };
    }
}

// ========================================
// EXPORTS
// ========================================

export { FallbackChain, TIMEOUTS, DEMO_CACHE };

// Export for browser global
if (typeof window !== 'undefined') {
    window.FallbackChain = FallbackChain;
}

console.log('✅ FallbackChain module loaded');
