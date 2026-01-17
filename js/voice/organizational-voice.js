/**
 * ============================================================================
 * ORGANIZATIONAL VOICE - UNIFIED VOICE SYSTEM
 * ============================================================================
 *
 * This module consolidates two overlapping voice systems into one unified
 * architecture, designed January 2026 as part of the Sacred Inquiry Architecture.
 *
 * CONSOLIDATED FROM:
 * - js/ux/language-register.js (3 registers)
 * - js/ai/ui/vocabulary-style-selector.js (4 styles)
 *
 * UNIFIED ARCHITECTURE:
 * - Primary Axis: Organizational Context (Corporate / Conscious / Hybrid)
 * - Secondary Axis: Engagement Depth (Analytical / Balanced / Contemplative)
 *
 * This creates a 3×3 matrix of 9 distinct voice configurations, each serving
 * a specific combination of audience type and depth preference.
 *
 * @module js/voice/organizational-voice
 * @author Deimantas & Claude (Co-created January 2026)
 * @version 1.0.0
 * @see {@link ../../docs/EDGE_DYNAMICS_REFERENCE.md} - Voice design section
 * ============================================================================
 */

// ============================================================================
// SECTION 1: ORGANIZATIONAL CONTEXT DEFINITIONS
// ============================================================================

/**
 * ORGANIZATIONAL_CONTEXTS - The primary axis: who is the audience?
 *
 * This determines the vocabulary and framing of concepts.
 */
const ORGANIZATIONAL_CONTEXTS = {

    corporate: {
        id: 'corporate',
        name: 'Corporate',
        icon: '🏢',
        description: 'Business-first language for traditional organizations',
        audience: 'CFOs, boards, investors, traditional executives',

        // How Quannex concepts are named
        vocabulary: {
            coherence: 'alignment score',
            face: 'domain',
            edge: 'interface',
            vertex: 'convergence point',
            shadow: 'risk area',
            breath: 'balance',
            breathAxis: 'polarity metric',
            octave: 'maturity level',
            pentagram: 'five-factor model',
            phi: 'golden ratio',
            vortex: 'activity node',
            inquiry: 'diagnostic question',
            ritual: 'process',
            blessing: null  // Omitted in corporate context
        },

        // AI prompt guidance for this context
        promptGuidance: `
Use business and professional terminology. Avoid spiritual or esoteric language.
Focus on measurable outcomes, ROI, risk mitigation, and strategic alignment.
Reference familiar frameworks (OKRs, KPIs, balanced scorecard) when helpful.
Speak to the boardroom - competent, evidence-based, action-oriented.
`
    },

    conscious: {
        id: 'conscious',
        name: 'Conscious',
        icon: '🧘',
        description: 'Consciousness-integrated language for awakened organizations',
        audience: 'Purpose-driven founders, conscious leaders, regenerative orgs',

        vocabulary: {
            coherence: 'coherence',
            face: 'face',
            edge: 'edge',
            vertex: 'vertex',
            shadow: 'shadow',
            breath: 'breath',
            breathAxis: 'breath axis',
            octave: 'octave',
            pentagram: 'pentagram',
            phi: 'φ (the golden ratio)',
            vortex: 'vortex',
            inquiry: 'inquiry',
            ritual: 'ritual',
            blessing: 'May this measurement serve the highest good.'
        },

        promptGuidance: `
Use the full Quannex vocabulary - coherence, faces, edges, shadows, breath.
Include reflection questions and invitations to deeper inquiry.
Reference sacred geometry, consciousness evolution, and collective awakening.
Speak to the heart - warm, curious, invitational, and reverent.
`
    },

    hybrid: {
        id: 'hybrid',
        name: 'Hybrid',
        icon: '⚖️',
        description: 'Bridging language that serves both worlds',
        audience: 'Purpose-driven businesses, conscious enterprises, B-corps',

        vocabulary: {
            coherence: 'coherence',
            face: 'domain',
            edge: 'connection',
            vertex: 'convergence',
            shadow: 'attention area',
            breath: 'balance flow',
            breathAxis: 'breath axis',
            octave: 'development stage',
            pentagram: 'five elements',
            phi: 'golden ratio (φ)',
            vortex: 'emergence point',
            inquiry: 'question',
            ritual: 'guided reflection',
            blessing: 'May this insight serve your purpose.'
        },

        promptGuidance: `
Balance professional credibility with consciousness-aware depth.
Use business terms but leave doors open to deeper meaning.
Include optional reflection questions (can be skipped by those who prefer action).
Speak to the bridge-builders - professional yet purposeful.
`
    }
};

// ============================================================================
// SECTION 2: ENGAGEMENT DEPTH DEFINITIONS
// ============================================================================

/**
 * ENGAGEMENT_DEPTHS - The secondary axis: how deep should we go?
 *
 * This determines the length, complexity, and philosophical depth of responses.
 */
const ENGAGEMENT_DEPTHS = {

    analytical: {
        id: 'analytical',
        name: 'Analytical',
        icon: '📊',
        description: 'Direct, data-focused, action-oriented',
        style: 'concise',

        characteristics: {
            includeReflectionQuestions: false,
            includePhilosophy: false,
            includeBlessings: false,
            maxSentences: 3,
            focusOn: ['data', 'trends', 'actions', 'recommendations']
        },

        formatGuidance: `
Keep responses short and actionable.
Lead with the key metric or insight.
Provide 1-2 concrete next steps.
No rhetorical questions or philosophical tangents.
`
    },

    balanced: {
        id: 'balanced',
        name: 'Balanced',
        icon: '⚖️',
        description: 'Professional with optional depth',
        style: 'moderate',

        characteristics: {
            includeReflectionQuestions: 'sometimes',  // ~33% of significant insights
            includePhilosophy: 'on-request',
            includeBlessings: 'occasionally',
            maxSentences: 6,
            focusOn: ['data', 'patterns', 'recommendations', 'optional-reflection']
        },

        formatGuidance: `
Start with the key insight, then offer context.
Include a reflection question for significant discoveries.
Balance action with invitation to deeper understanding.
Professional but warm.
`
    },

    contemplative: {
        id: 'contemplative',
        name: 'Contemplative',
        icon: '🧘',
        description: 'Full depth, inquiry-centered',
        style: 'expansive',

        characteristics: {
            includeReflectionQuestions: true,
            includePhilosophy: true,
            includeBlessings: true,
            maxSentences: 12,
            focusOn: ['patterns', 'meaning', 'emergence', 'questions']
        },

        formatGuidance: `
Hold space for the question before offering answers.
Invite the reader into their own inquiry.
Reference deeper patterns and sacred geometry principles.
End with a blessing or invocation when appropriate.
`
    }
};

// ============================================================================
// SECTION 3: VOICE CONFIGURATION MATRIX
// ============================================================================

/**
 * Generate the 9 voice configurations from the 3×3 matrix
 */
function generateVoiceConfigs() {
    const configs = {};

    for (const context of Object.values(ORGANIZATIONAL_CONTEXTS)) {
        for (const depth of Object.values(ENGAGEMENT_DEPTHS)) {
            const key = `${context.id}:${depth.id}`;

            configs[key] = {
                id: key,
                name: `${context.name} ${depth.name}`,
                icons: `${context.icon}${depth.icon}`,

                // Combined configuration
                context,
                depth,

                // Merged vocabulary (context determines terms)
                vocabulary: context.vocabulary,

                // Merged characteristics (depth determines behavior)
                characteristics: {
                    ...depth.characteristics,
                    // Context-specific overrides
                    includeBlessings: context.id === 'corporate'
                        ? false
                        : depth.characteristics.includeBlessings
                },

                // Combined AI prompt
                aiPrompt: `
ORGANIZATIONAL CONTEXT: ${context.name}
${context.promptGuidance}

ENGAGEMENT DEPTH: ${depth.name}
${depth.formatGuidance}
`
            };
        }
    }

    return configs;
}

const VOICE_CONFIGS = generateVoiceConfigs();

// ============================================================================
// SECTION 4: VOICE STATE MANAGEMENT
// ============================================================================

/**
 * VoiceState - Singleton manager for current voice configuration
 */
const VoiceState = {
    _context: 'hybrid',
    _depth: 'balanced',
    _listeners: [],

    STORAGE_KEY: 'quannex.voice',

    /**
     * Initialize from localStorage or defaults
     */
    init() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                const { context, depth } = JSON.parse(stored);
                if (ORGANIZATIONAL_CONTEXTS[context]) this._context = context;
                if (ENGAGEMENT_DEPTHS[depth]) this._depth = depth;
            }
        } catch (e) {
            Logger.warn('Voice', 'Could not load from storage', e);
        }

        Logger.info('Voice', `Initialized: ${this._context}:${this._depth}`);
    },

    /**
     * Get current voice configuration key
     */
    getKey() {
        return `${this._context}:${this._depth}`;
    },

    /**
     * Get current full voice configuration
     */
    getConfig() {
        return VOICE_CONFIGS[this.getKey()];
    },

    /**
     * Get current context
     */
    getContext() {
        return ORGANIZATIONAL_CONTEXTS[this._context];
    },

    /**
     * Get current depth
     */
    getDepth() {
        return ENGAGEMENT_DEPTHS[this._depth];
    },

    /**
     * Set organizational context
     */
    setContext(contextId) {
        if (!ORGANIZATIONAL_CONTEXTS[contextId]) {
            Logger.error('Voice', `Invalid context: ${contextId}`);
            return false;
        }

        const previous = this._context;
        this._context = contextId;
        this._persist();
        this._notify('context', previous, contextId);
        return true;
    },

    /**
     * Set engagement depth
     */
    setDepth(depthId) {
        if (!ENGAGEMENT_DEPTHS[depthId]) {
            Logger.error('Voice', `Invalid depth: ${depthId}`);
            return false;
        }

        const previous = this._depth;
        this._depth = depthId;
        this._persist();
        this._notify('depth', previous, depthId);
        return true;
    },

    /**
     * Set both at once
     */
    set(contextId, depthId) {
        let changed = false;

        if (ORGANIZATIONAL_CONTEXTS[contextId] && this._context !== contextId) {
            this._context = contextId;
            changed = true;
        }

        if (ENGAGEMENT_DEPTHS[depthId] && this._depth !== depthId) {
            this._depth = depthId;
            changed = true;
        }

        if (changed) {
            this._persist();
            this._notify('both', null, this.getKey());
        }

        return changed;
    },

    /**
     * Subscribe to changes
     */
    subscribe(callback) {
        this._listeners.push(callback);
        return () => {
            this._listeners = this._listeners.filter(l => l !== callback);
        };
    },

    _persist() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
                context: this._context,
                depth: this._depth
            }));
        } catch (e) {
            Logger.warn('Voice', 'Could not persist', e);
        }
    },

    _notify(type, previous, current) {
        const event = { type, previous, current, config: this.getConfig() };

        this._listeners.forEach(cb => {
            try { cb(event); } catch (e) { Logger.error('Voice', 'Listener error:', e); }
        });

        window.dispatchEvent(new CustomEvent('quannex:voice-changed', { detail: event }));
        Logger.info('Voice', `Changed: ${this.getKey()}`);
    }
};

// ============================================================================
// SECTION 5: CONTENT TRANSFORMATION
// ============================================================================

/**
 * ContentTransformer - Transform content based on current voice
 */
const ContentTransformer = {

    /**
     * Transform a Quannex term to the current vocabulary
     */
    transformTerm(term) {
        const vocab = VoiceState.getConfig().vocabulary;
        const lower = term.toLowerCase();

        if (vocab.hasOwnProperty(lower)) {
            const transformed = vocab[lower];
            if (transformed === null) return '';

            // Preserve capitalization
            if (term[0] === term[0].toUpperCase()) {
                return transformed.charAt(0).toUpperCase() + transformed.slice(1);
            }
            return transformed;
        }

        return term;
    },

    /**
     * Transform content with vocabulary replacement
     */
    transform(content) {
        if (!content) return content;

        const vocab = VoiceState.getConfig().vocabulary;
        let result = content;

        // Sort by length (longest first) to avoid partial replacements
        const terms = Object.keys(vocab).sort((a, b) => b.length - a.length);

        for (const term of terms) {
            const replacement = vocab[term];

            if (replacement === null) {
                // Remove the term
                result = result.replace(new RegExp(`\\b${term}\\b`, 'gi'), '');
            } else {
                // Replace with case preservation
                result = result.replace(new RegExp(`\\b${term}\\b`, 'gi'), (match) => {
                    if (match[0] === match[0].toUpperCase()) {
                        return replacement.charAt(0).toUpperCase() + replacement.slice(1);
                    }
                    return replacement;
                });
            }
        }

        return result.replace(/\s+/g, ' ').trim();
    },

    /**
     * Get AI prompt for current voice configuration
     */
    getAIPrompt() {
        return VoiceState.getConfig().aiPrompt;
    },

    /**
     * Should include reflection questions for this insight?
     */
    shouldIncludeReflection(isSignificant = false) {
        const char = VoiceState.getConfig().characteristics;

        if (char.includeReflectionQuestions === true) return true;
        if (char.includeReflectionQuestions === false) return false;

        // 'sometimes' - only for significant insights, ~33% chance
        return isSignificant && Math.random() < 0.33;
    },

    /**
     * Get closing for AI response based on current voice
     */
    getClosing() {
        const config = VoiceState.getConfig();
        const char = config.characteristics;

        if (!char.includeBlessings) return '';
        if (char.includeBlessings === 'occasionally' && Math.random() > 0.25) return '';

        return config.vocabulary.blessing || '';
    }
};

// ============================================================================
// SECTION 6: UI COMPONENTS
// ============================================================================

/**
 * VoiceSelector - UI component for selecting voice configuration
 */
const VoiceSelector = {

    /**
     * Create voice selector component
     */
    create(container, options = {}) {
        const { compact = false, showDepth = true } = options;

        const el = document.createElement('div');
        el.className = 'voice-selector';
        el.innerHTML = this._render(compact, showDepth);

        this._attachListeners(el);

        if (container) {
            if (typeof container === 'string') {
                document.getElementById(container)?.appendChild(el);
            } else {
                container.appendChild(el);
            }
        }

        return el;
    },

    _render(compact, showDepth) {
        const currentContext = VoiceState._context;
        const currentDepth = VoiceState._depth;

        return `
            <div class="voice-selector-inner" style="
                background: rgba(0,0,0,0.3);
                border-radius: 12px;
                padding: ${compact ? '8px' : '12px'};
            ">
                <div class="voice-context-row" style="
                    display: flex;
                    gap: 4px;
                    ${showDepth ? 'margin-bottom: 8px;' : ''}
                ">
                    <span style="color: #888; font-size: 11px; margin-right: 8px;">Audience:</span>
                    ${Object.values(ORGANIZATIONAL_CONTEXTS).map(ctx => `
                        <button
                            class="voice-btn ${ctx.id === currentContext ? 'active' : ''}"
                            data-type="context"
                            data-value="${ctx.id}"
                            title="${ctx.description}"
                            style="
                                padding: 4px 10px;
                                border-radius: 6px;
                                border: 1px solid ${ctx.id === currentContext ? '#6666ff' : '#333'};
                                background: ${ctx.id === currentContext ? 'rgba(100,100,255,0.2)' : 'transparent'};
                                color: ${ctx.id === currentContext ? '#fff' : '#888'};
                                cursor: pointer;
                                font-size: 11px;
                            "
                        >
                            ${ctx.icon} ${ctx.name}
                        </button>
                    `).join('')}
                </div>

                ${showDepth ? `
                <div class="voice-depth-row" style="display: flex; gap: 4px;">
                    <span style="color: #888; font-size: 11px; margin-right: 8px;">Depth:</span>
                    ${Object.values(ENGAGEMENT_DEPTHS).map(dep => `
                        <button
                            class="voice-btn ${dep.id === currentDepth ? 'active' : ''}"
                            data-type="depth"
                            data-value="${dep.id}"
                            title="${dep.description}"
                            style="
                                padding: 4px 10px;
                                border-radius: 6px;
                                border: 1px solid ${dep.id === currentDepth ? '#6666ff' : '#333'};
                                background: ${dep.id === currentDepth ? 'rgba(100,100,255,0.2)' : 'transparent'};
                                color: ${dep.id === currentDepth ? '#fff' : '#888'};
                                cursor: pointer;
                                font-size: 11px;
                            "
                        >
                            ${dep.icon} ${dep.name}
                        </button>
                    `).join('')}
                </div>
                ` : ''}
            </div>
        `;
    },

    _attachListeners(el) {
        el.querySelectorAll('.voice-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.dataset.type;
                const value = btn.dataset.value;

                if (type === 'context') {
                    VoiceState.setContext(value);
                } else if (type === 'depth') {
                    VoiceState.setDepth(value);
                }

                // Re-render
                el.innerHTML = this._render(
                    el.classList.contains('compact'),
                    el.querySelector('.voice-depth-row') !== null
                );
                this._attachListeners(el);
            });
        });
    }
};

// ============================================================================
// SECTION 7: EXPORTS
// ============================================================================

// Browser global export
if (typeof window !== 'undefined') {
    window.OrganizationalVoice = {
        // Definitions
        ORGANIZATIONAL_CONTEXTS,
        ENGAGEMENT_DEPTHS,
        VOICE_CONFIGS,

        // State management
        VoiceState,

        // Transformation
        ContentTransformer,

        // UI
        VoiceSelector,

        // Convenience
        getConfig: () => VoiceState.getConfig(),
        setVoice: (context, depth) => VoiceState.set(context, depth),
        transform: (content) => ContentTransformer.transform(content),
        getAIPrompt: () => ContentTransformer.getAIPrompt(),

        // Initialization
        init() {
            VoiceState.init();
            Logger.info('Voice', 'System initialized');
            Logger.debug('Voice', 'Context: corporate | hybrid | conscious');
            Logger.debug('Voice', 'Depth: analytical | balanced | contemplative');
        }
    };

    Logger.info('Voice', 'System v1.0.0 loaded');
}

// CommonJS export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ORGANIZATIONAL_CONTEXTS,
        ENGAGEMENT_DEPTHS,
        VOICE_CONFIGS,
        VoiceState,
        ContentTransformer,
        VoiceSelector
    };
}
