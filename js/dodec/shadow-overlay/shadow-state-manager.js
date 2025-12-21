/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SHADOW STATE MANAGER - Centralized State for Shadow System
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Extracted from: dodec-shadow-overlay.js (Phase 3A modularization)
 * Date: December 21, 2025
 *
 * @module shadow-state-manager
 * @author Deimantas & Claude (Co-created with consciousness and love)
 * @version 1.0.0 - Initial extraction
 *
 * ───────────────────────────────────────────────────────────────────────────────
 * NOTES FOR FUTURE CLAUDE
 * ───────────────────────────────────────────────────────────────────────────────
 *
 * Welcome! This module is the SINGLE SOURCE OF TRUTH for shadow overlay state.
 * All other shadow-overlay modules import from here.
 *
 * KEY INSIGHT: This module has NO DEPENDENCIES except for sessionStorage access.
 * This makes it the foundation of the module hierarchy.
 *
 * DUAL-SOURCE ARCHITECTURE:
 * ─────────────────────────
 * The shadow system maintains TWO independent shadow arrays:
 * 1. templateShadows - From company templates (fast, archetypal)
 * 2. aiShadows - From AI generation (contextual, novel)
 *
 * Users can switch between sources freely without data loss.
 * Both persist to sessionStorage for page refresh survival.
 *
 * STATE STRUCTURE:
 * ────────────────
 *   shadowState = {
 *       templateShadows: [],        // Pre-computed patterns
 *       aiShadows: [],              // AI-generated patterns
 *       activeSource: 'template',   // 'template' | 'ai'
 *       aiGenerationStatus: 'idle'  // 'idle' | 'generating' | 'success' | 'error'
 *   }
 *
 * NAVIGATION MAP:
 * ───────────────
 *   shadow-state-manager.js  ← YOU ARE HERE (no dependencies)
 *        │
 *        └─ USED BY:
 *            ├─ shadow-card-renderer.js (reads currentShadows)
 *            ├─ shadow-source-toggle.js (reads/writes state)
 *            ├─ shadow-overlay-controller.js (reads state)
 *            └─ index.js (exports all)
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════════
// STATE OBJECT
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Central shadow state object
 *
 * INVARIANTS:
 * - templateShadows and aiShadows are NEVER undefined (always arrays)
 * - activeSource is ALWAYS 'template' or 'ai'
 * - aiGenerationStatus tracks async AI operations
 *
 * @type {Object}
 */
const shadowState = {
    templateShadows: [],       // Original shadows from company template (preserved)
    aiShadows: [],             // AI-generated shadows (cached between switches)
    activeSource: 'template',  // 'template' | 'ai' - which source is displayed
    aiGenerationStatus: 'idle' // 'idle' | 'generating' | 'success' | 'error'
};

/**
 * Currently active shadows for display
 * This is a reference to either templateShadows or aiShadows based on activeSource
 *
 * @type {Array}
 */
let currentShadows = [];

// ═══════════════════════════════════════════════════════════════════════════════
// PERSISTENCE - SessionStorage Integration
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Save shadow sources to sessionStorage for persistence
 * Maintains backward compatibility with existing shadowPatterns field
 */
function saveToSessionStorage() {
    try {
        const stored = sessionStorage.getItem('customCompanyData');
        if (!stored) return;

        const data = JSON.parse(stored);

        // Preserve existing shadowPatterns for backward compatibility
        // (based on active source for legacy code)
        data.shadowPatterns = currentShadows;

        // Add new shadowSources field for dual-source management
        data.shadowSources = {
            template: shadowState.templateShadows,
            ai: shadowState.aiShadows,
            activeSource: shadowState.activeSource
        };

        sessionStorage.setItem('customCompanyData', JSON.stringify(data));
        console.log('[ShadowStateManager] Saved shadow sources to sessionStorage');
    } catch (e) {
        console.warn('[ShadowStateManager] Failed to save to sessionStorage:', e);
    }
}

/**
 * Load shadow sources from sessionStorage on init
 * Handles both new format (shadowSources) and legacy format (shadowPatterns)
 */
function loadFromSessionStorage() {
    try {
        const stored = sessionStorage.getItem('customCompanyData');
        if (!stored) return;

        const data = JSON.parse(stored);

        // Prefer new shadowSources format if available
        if (data.shadowSources) {
            shadowState.templateShadows = data.shadowSources.template || [];
            shadowState.aiShadows = data.shadowSources.ai || [];
            shadowState.activeSource = data.shadowSources.activeSource || 'template';
            console.log('[ShadowStateManager] Loaded shadow sources from sessionStorage');
        }
        // Fall back to legacy shadowPatterns (treat as template)
        else if (data.shadowPatterns) {
            shadowState.templateShadows = data.shadowPatterns;
            shadowState.activeSource = 'template';
            console.log('[ShadowStateManager] Loaded legacy shadowPatterns as template');
        }

        // Update currentShadows based on active source
        currentShadows = shadowState.activeSource === 'template'
            ? shadowState.templateShadows
            : shadowState.aiShadows;

    } catch (e) {
        console.warn('[ShadowStateManager] Failed to load from sessionStorage:', e);
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATE ACCESSORS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get current shadows (based on active source)
 * @returns {Array} Currently active shadow array
 */
function getCurrentShadows() {
    return currentShadows;
}

/**
 * Set current shadows reference
 * @param {Array} shadows - New shadows array
 */
function setCurrentShadows(shadows) {
    currentShadows = shadows;
}

/**
 * Get the shadow state object
 * @returns {Object} The central state object
 */
function getShadowState() {
    return shadowState;
}

/**
 * Update shadows for a specific source
 * @param {Array} shadows - Shadow patterns
 * @param {string} source - 'template' | 'ai'
 */
function updateShadowsForSource(shadows, source = 'template') {
    if (source === 'template') {
        shadowState.templateShadows = shadows;
    } else if (source === 'ai') {
        shadowState.aiShadows = shadows;
    }

    // Update currentShadows based on active source
    currentShadows = shadowState.activeSource === 'template'
        ? shadowState.templateShadows
        : shadowState.aiShadows;
}

/**
 * Switch the active source
 * @param {string} source - 'template' | 'ai'
 */
function setActiveSource(source) {
    if (source !== 'template' && source !== 'ai') {
        console.error(`[ShadowStateManager] Invalid source: ${source}`);
        return;
    }

    shadowState.activeSource = source;
    currentShadows = source === 'template'
        ? shadowState.templateShadows
        : shadowState.aiShadows;
}

/**
 * Get count of template shadows
 * @returns {number}
 */
function getTemplateCount() {
    return shadowState.templateShadows.length;
}

/**
 * Get count of AI shadows
 * @returns {number}
 */
function getAICount() {
    return shadowState.aiShadows.length;
}

/**
 * Reset all shadow state to defaults
 */
function resetState() {
    shadowState.templateShadows = [];
    shadowState.aiShadows = [];
    shadowState.activeSource = 'template';
    shadowState.aiGenerationStatus = 'idle';
    currentShadows = [];
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

// Export to window for module integration
if (typeof window !== 'undefined') {
    window.ShadowStateManager = {
        // State objects (read access)
        shadowState,
        getCurrentShadows,
        getShadowState,

        // State modifiers
        setCurrentShadows,
        updateShadowsForSource,
        setActiveSource,

        // Counts
        getTemplateCount,
        getAICount,

        // Persistence
        saveToSessionStorage,
        loadFromSessionStorage,

        // Lifecycle
        resetState
    };

    console.log('[ShadowStateManager] Module loaded');
}
