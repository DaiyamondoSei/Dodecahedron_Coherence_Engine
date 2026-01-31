/**
 * ════════════════════════════════════════════════════════════════════════════
 * LANGUAGE REGISTER SYSTEM - BRIDGING CONSCIOUSNESS AND COMMERCE
 * ════════════════════════════════════════════════════════════════════════════
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                        NOTES FOR FUTURE CLAUDE                          │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * KEY INSIGHT: Same mathematics. Same geometry. Multiple entry points.
 * ─────────────────────────────────────────────────────────────────────────
 * The contemplative layer is an ENHANCEMENT, not a requirement. This system
 * allows users to experience Quannex in their preferred voice:
 *
 *   - ANALYTICAL: Corporate, direct, data-focused (CFO in a boardroom)
 *   - BALANCED: Professional with warmth (default - best of both)
 *   - CONTEMPLATIVE: Full consciousness integration (meditation practitioner)
 *
 * THE THREE VOICES:
 * ─────────────────────────────────────────────────────────────────────────
 *   Analytical:    "Financial Capital shows 0.72 alignment."
 *   Balanced:      "Financial Capital coherence: 0.72. Strong performance."
 *   Contemplative: "Financial Capital radiates at 0.72 coherence.
 *                   What truth wants to be seen in these numbers?"
 *
 * NAVIGATION MAP:
 * ─────────────────────────────────────────────────────────────────────────
 *   ↑ IMPORTS FROM:
 *     • js/ux/data-integrity.js → Uses safeTransform for protected transforms
 *     • js/constants/phi-harmonics.js → PHI values preserved across registers
 *
 *   → CONSUMED BY:
 *     • js/ai/providers/*.js → AI responses adapted to register
 *     • pages/*.html → All UI text transformed
 *     • js/shadow/overlay/*.js → Shadow descriptions transformed
 *
 *   ← RELATED TO:
 *     • js/constants/consciousness-constants.js → Inquiry texts per register
 *     • settings.html → User preference controls
 *
 * ════════════════════════════════════════════════════════════════════════════
 * @file language-register.js - Multi-voice language transformation system
 * @author Deimantas Murauskas & Claude
 * @version 1.0.0 (Phase 9 - UX Enhancement Addendum)
 * ════════════════════════════════════════════════════════════════════════════
 */

// ════════════════════════════════════════════════════════════════════════════
// SECTION 1: LANGUAGE REGISTER DEFINITIONS
// ════════════════════════════════════════════════════════════════════════════

const LANGUAGE_REGISTERS = {

    // ─────────────────────────────────────────────────────────────────────────
    // ANALYTICAL REGISTER - Corporate/Direct
    // ─────────────────────────────────────────────────────────────────────────

    analytical: {
        id: 'analytical',
        name: 'Analytical',
        icon: '📊',
        description: 'Direct, data-focused language for business contexts',

        // Term transformations (Quannex term → Analytical term)
        patterns: {
            shadow: 'area for attention',
            shadowQuestion: 'What factors are contributing to this pattern?',
            coherence: 'alignment score',
            breath: 'balance',
            breathAxis: 'balance axis',
            octave: 'development stage',
            face: 'domain',
            vortex: 'convergence point',
            vertex: 'intersection',
            edge: 'interface',
            ritual: 'process',
            inquiry: 'reflection prompt',
            blessing: null, // Omitted in analytical mode
            sacred: 'fundamental',
            consciousness: 'awareness',
            emergence: 'development',
            phi: 'golden ratio',
            pentagram: 'five-point structure'
        },

        // AI response style
        aiStyle: {
            includeReflectionQuestions: false,
            includePhilosophy: false,
            includeBlessings: false,
            focusOn: ['data', 'trends', 'recommendations', 'actions'],
            tone: 'professional, concise, action-oriented'
        },

        // Example outputs
        examples: {
            insight: "Financial Capital shows 0.72 alignment. Recommend reviewing stakeholder distribution metrics.",
            tooltip: "Financial Capital | 0.72 | Trend: ↑3%",
            loading: "Calculating alignment scores...",
            faceLabel: "Domain 1: Financial Capital",
            shadowLabel: "Attention Area: Low alignment in Fire element"
        }
    },

    // ─────────────────────────────────────────────────────────────────────────
    // BALANCED REGISTER - Middle Path (Default)
    // ─────────────────────────────────────────────────────────────────────────

    balanced: {
        id: 'balanced',
        name: 'Balanced',
        icon: '⚖️',
        description: 'Professional language with optional contemplative elements',

        patterns: {
            shadow: 'attention area',
            shadowQuestion: 'What underlying factors might be at play here?',
            coherence: 'coherence',
            breath: 'balance flow',
            breathAxis: 'breath axis',
            octave: 'development level',
            face: 'domain',
            vortex: 'convergence',
            vertex: 'convergence point',
            edge: 'connection',
            ritual: 'guided reflection',
            inquiry: 'question',
            blessing: 'May this insight serve your purpose.',
            sacred: 'fundamental',
            consciousness: 'awareness',
            emergence: 'emergence',
            phi: 'φ (golden ratio)',
            pentagram: 'pentagram'
        },

        aiStyle: {
            includeReflectionQuestions: 'sometimes', // Every 3rd significant insight
            includePhilosophy: 'on-request',
            includeBlessings: 'occasionally',
            focusOn: ['data', 'patterns', 'recommendations', 'optional-reflection'],
            tone: 'professional yet warm'
        },

        examples: {
            insight: "Financial Capital coherence: 0.72. Strong performance. Consider: what's enabling this success?",
            tooltip: "Financial Capital | 0.72 | Domain Health: Strong",
            loading: "Analyzing organizational coherence...",
            faceLabel: "Face 1: Financial Capital",
            shadowLabel: "Attention Area: Fire element showing patterns"
        }
    },

    // ─────────────────────────────────────────────────────────────────────────
    // CONTEMPLATIVE REGISTER - Full Consciousness Integration
    // ─────────────────────────────────────────────────────────────────────────

    contemplative: {
        id: 'contemplative',
        name: 'Contemplative',
        icon: '🧘',
        description: 'Consciousness-integrated language for deeper exploration',

        patterns: {
            shadow: 'shadow',
            shadowQuestion: 'What is this shadow protecting? What gift does it carry?',
            coherence: 'coherence',
            breath: 'breath',
            breathAxis: 'breath axis',
            octave: 'octave',
            face: 'face',
            vortex: 'vortex',
            vertex: 'vertex',
            edge: 'edge',
            ritual: 'ritual',
            inquiry: 'inquiry',
            blessing: 'May this measurement serve the highest good.',
            sacred: 'sacred',
            consciousness: 'consciousness',
            emergence: 'emergence',
            phi: 'φ (the golden ratio - nature\'s growth pattern)',
            pentagram: 'pentagram (the five-pointed star of elemental balance)'
        },

        aiStyle: {
            includeReflectionQuestions: true,
            includePhilosophy: true,
            includeBlessings: true,
            focusOn: ['patterns', 'meaning', 'emergence', 'questions'],
            tone: 'warm, curious, invitational'
        },

        examples: {
            insight: "Financial Capital radiates at 0.72 coherence. A question arises: What truth wants to be seen in these numbers?",
            tooltip: "Financial Capital | 0.72 | Earth: 'Is it grounded?'",
            loading: "Calculating coherence... What patterns want to emerge?",
            faceLabel: "Face 1: Financial Capital (The Heartbeat of Resources)",
            shadowLabel: "Shadow in Fire: What transformation is being resisted?"
        }
    }
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 2: USER PREFERENCES SCHEMA
// ════════════════════════════════════════════════════════════════════════════

const USER_PREFERENCES = {
    languageRegister: {
        key: 'quannex.language.register',
        default: 'balanced',
        options: ['analytical', 'balanced', 'contemplative'],

        ui: {
            location: 'Settings > Experience > Language Style',
            component: 'RadioGroup with preview'
        },

        onboarding: {
            askDuring: 'first-session',
            question: 'How would you like Quannex to communicate with you?',
            options: [
                {
                    id: 'analytical',
                    label: 'Keep it direct',
                    description: 'Data-focused, action-oriented',
                    icon: '📊'
                },
                {
                    id: 'balanced',
                    label: 'Best of both (Recommended)',
                    description: 'Professional with optional depth',
                    icon: '⚖️'
                },
                {
                    id: 'contemplative',
                    label: 'Full depth',
                    description: 'Consciousness-integrated exploration',
                    icon: '🧘'
                }
            ]
        }
    },

    // Granular controls for power users
    advanced: {
        showReflectionQuestions: { type: 'toggle', default: 'inherit-from-register' },
        showRitualPrompts: { type: 'toggle', default: 'inherit-from-register' },
        showBlessings: { type: 'toggle', default: 'inherit-from-register' },
        showElementalQuestions: { type: 'toggle', default: 'inherit-from-register' },
        aiPhilosophyLevel: { type: 'slider', range: [0, 100], default: 50 }
    }
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 3: REGISTER STATE MANAGEMENT
// ════════════════════════════════════════════════════════════════════════════

/**
 * Register state manager - singleton pattern
 */
const RegisterState = {

    _currentRegister: null,
    _listeners: [],

    /**
     * Initialize register from localStorage or default
     */
    init() {
        const stored = localStorage.getItem(USER_PREFERENCES.languageRegister.key);
        this._currentRegister = stored || USER_PREFERENCES.languageRegister.default;
        Logger.info('UX:LanguageRegister', `Language Register initialized: ${this._currentRegister}`);
    },

    /**
     * Get current register
     * @returns {string}
     */
    get() {
        if (!this._currentRegister) this.init();
        return this._currentRegister;
    },

    /**
     * Get current register definition
     * @returns {Object}
     */
    getDefinition() {
        return LANGUAGE_REGISTERS[this.get()];
    },

    /**
     * Set register (with validation through data-integrity)
     * @param {string} registerId - The register to switch to
     * @returns {Object} { success: boolean, errors: string[] }
     */
    set(registerId) {
        // Validate register exists
        if (!LANGUAGE_REGISTERS[registerId]) {
            return {
                success: false,
                errors: [`Invalid register: ${registerId}`]
            };
        }

        // Use data integrity validation if available
        if (window.UXDataIntegrity?.RegisterChangeValidation) {
            const validation = window.UXDataIntegrity.RegisterChangeValidation.validateChange(registerId);
            if (validation.requiresConfirmation) {
                // For now, log warnings but proceed
                validation.warnings.forEach(w => Logger.warn('UX:LanguageRegister', w.message));
            }
        }

        const previous = this._currentRegister;
        this._currentRegister = registerId;

        // Persist to localStorage
        localStorage.setItem(USER_PREFERENCES.languageRegister.key, registerId);

        // Notify listeners
        this._notifyListeners(previous, registerId);

        // Dispatch global event
        window.dispatchEvent(new CustomEvent('quannex:register-changed', {
            detail: { previous, current: registerId, timestamp: Date.now() }
        }));

        Logger.info('UX:LanguageRegister', `Register changed: ${previous} → ${registerId}`);

        return { success: true, errors: [] };
    },

    /**
     * Subscribe to register changes
     * @param {Function} callback - Called with (previousRegister, newRegister)
     * @returns {Function} Unsubscribe function
     */
    subscribe(callback) {
        this._listeners.push(callback);
        return () => {
            this._listeners = this._listeners.filter(l => l !== callback);
        };
    },

    _notifyListeners(previous, current) {
        this._listeners.forEach(callback => {
            try {
                callback(previous, current);
            } catch (e) {
                Logger.error('UX:LanguageRegister', 'Register listener error:', e);
            }
        });
    }
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 4: CONTENT TRANSFORMATION ENGINE
// ════════════════════════════════════════════════════════════════════════════

/**
 * Transform content based on current language register
 */
const ContentTransformer = {

    /**
     * Transform a term using current register patterns
     * @param {string} term - The Quannex term to transform
     * @returns {string} The transformed term
     */
    transformTerm(term) {
        const register = RegisterState.getDefinition();
        const lowerTerm = term.toLowerCase();

        // Check if this term has a pattern mapping
        if (register.patterns.hasOwnProperty(lowerTerm)) {
            const transformed = register.patterns[lowerTerm];
            // null means remove/omit the term
            if (transformed === null) return '';
            return transformed;
        }

        return term; // Return unchanged if no mapping
    },

    /**
     * Transform text content with pattern replacements
     * @param {string} content - The content to transform
     * @param {string} contentType - Type: 'text', 'ai-insight', 'tooltip', 'loading'
     * @returns {string} Transformed content
     */
    transform(content, contentType = 'text') {
        if (!content) return content;

        const register = RegisterState.getDefinition();
        let result = content;

        // Use safe transformation if available
        if (window.UXDataIntegrity?.safeTransform) {
            const safeResult = window.UXDataIntegrity.safeTransform(
                content,
                register.id,
                (data, reg) => this._applyPatterns(data, register)
            );
            if (safeResult.success) {
                result = safeResult.result;
            } else {
                Logger.warn('UX:LanguageRegister', 'Transform failed:', safeResult.errors);
                return content; // Return original on failure
            }
        } else {
            result = this._applyPatterns(content, register);
        }

        // Apply content-type specific transformations
        switch (contentType) {
            case 'ai-insight':
                result = this._transformAIInsight(result, register);
                break;
            case 'tooltip':
                result = this._transformTooltip(result, register);
                break;
            case 'loading':
                // Use register-specific loading text
                result = register.examples.loading;
                break;
        }

        return result;
    },

    /**
     * Apply pattern replacements
     * @private
     */
    _applyPatterns(content, register) {
        let result = content;

        // Sort patterns by length (longest first) to avoid partial replacements
        const sortedPatterns = Object.entries(register.patterns)
            .sort((a, b) => b[0].length - a[0].length);

        sortedPatterns.forEach(([key, value]) => {
            if (value === null) {
                // Remove the term and surrounding context
                result = result.replace(new RegExp(`\\s*${key}[:\\s]*[^.]*\\.?`, 'gi'), '');
            } else {
                // Case-preserving replacement
                result = result.replace(new RegExp(`\\b${key}\\b`, 'gi'), (match) => {
                    // Preserve capitalization
                    if (match[0] === match[0].toUpperCase()) {
                        return value.charAt(0).toUpperCase() + value.slice(1);
                    }
                    return value;
                });
            }
        });

        return result;
    },

    /**
     * Transform AI insight with register-specific additions
     * @private
     */
    _transformAIInsight(content, register) {
        let result = content;

        // Add reflection question if enabled
        if (register.aiStyle.includeReflectionQuestions === true) {
            result += '\n\nReflection: ' + register.patterns.shadowQuestion;
        } else if (register.aiStyle.includeReflectionQuestions === 'sometimes') {
            // Add every 3rd time (using random for simplicity)
            if (Math.random() < 0.33) {
                result += '\n\nConsider: What patterns are emerging here?';
            }
        }

        // Add blessing if enabled
        if (register.aiStyle.includeBlessings && register.patterns.blessing) {
            result += '\n\n' + register.patterns.blessing;
        }

        return result;
    },

    /**
     * Transform tooltip content
     * @private
     */
    _transformTooltip(content, register) {
        // Tooltips are typically short, just apply basic pattern transforms
        return this._applyPatterns(content, register);
    },

    /**
     * Get register-appropriate label for a face
     * @param {number} faceId - Face ID (1-12)
     * @param {string} faceName - Face name
     * @returns {string}
     */
    getFaceLabel(faceId, faceName) {
        const register = RegisterState.getDefinition();
        const faceWord = register.patterns.face || 'Face';

        if (register.id === 'contemplative') {
            // Add poetic descriptors for contemplative mode
            const descriptors = {
                1: 'The Heartbeat of Resources',
                2: 'The Temple of Wisdom',
                3: 'The Garden of Talent',
                4: 'The Architecture of Process',
                5: 'The Mirror of Market Truth',
                6: 'The Web of Connection',
                7: 'The Voice of Value',
                8: 'The Engine of Creation',
                9: 'The Wellspring of Renewal',
                10: 'The Compass of Purpose',
                11: 'The River of Opportunity',
                12: 'The Shield of Resilience'
            };
            return `${faceWord} ${faceId}: ${faceName} (${descriptors[faceId] || ''})`;
        }

        return `${faceWord.charAt(0).toUpperCase() + faceWord.slice(1)} ${faceId}: ${faceName}`;
    }
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 5: UI COMPONENTS
// ════════════════════════════════════════════════════════════════════════════

/**
 * UI components for register selection
 */
const RegisterUI = {

    /**
     * Create register selector component
     * @param {HTMLElement} container - Container element
     * @returns {HTMLElement}
     */
    createSelector(container) {
        const selector = document.createElement('div');
        selector.className = 'register-selector';
        selector.innerHTML = `
            <div class="register-selector-label">Language Style:</div>
            <div class="register-options">
                ${Object.values(LANGUAGE_REGISTERS).map(reg => `
                    <button
                        class="register-option ${RegisterState.get() === reg.id ? 'active' : ''}"
                        data-register="${reg.id}"
                        title="${reg.description}"
                    >
                        <span class="register-icon">${reg.icon}</span>
                        <span class="register-name">${reg.name}</span>
                    </button>
                `).join('')}
            </div>
        `;

        // Add event listeners
        selector.querySelectorAll('.register-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const registerId = e.currentTarget.dataset.register;
                const result = RegisterState.set(registerId);
                if (result.success) {
                    // Update UI
                    selector.querySelectorAll('.register-option').forEach(b => {
                        b.classList.toggle('active', b.dataset.register === registerId);
                    });
                }
            });
        });

        if (container) {
            container.appendChild(selector);
        }

        return selector;
    },

    /**
     * Add minimal CSS for register selector
     */
    injectStyles() {
        if (document.getElementById('register-selector-styles')) return;

        const style = document.createElement('style');
        style.id = 'register-selector-styles';
        style.textContent = `
            .register-selector {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 8px 12px;
                background: rgba(255,255,255,0.05);
                border-radius: 8px;
            }
            .register-selector-label {
                color: #888;
                font-size: 12px;
            }
            .register-options {
                display: flex;
                gap: 4px;
            }
            .register-option {
                display: flex;
                align-items: center;
                gap: 6px;
                padding: 6px 12px;
                background: transparent;
                border: 1px solid #333;
                border-radius: 6px;
                color: #aaa;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            .register-option:hover {
                background: rgba(255,255,255,0.05);
                border-color: #555;
            }
            .register-option.active {
                background: rgba(100,100,255,0.1);
                border-color: #6666ff;
                color: #fff;
            }
            .register-icon {
                font-size: 14px;
            }
            .register-name {
                font-size: 12px;
            }
        `;
        document.head.appendChild(style);
    }
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 6: MODULE EXPORTS
// ════════════════════════════════════════════════════════════════════════════

// Browser export
window.LanguageRegister = {
    // Constants
    LANGUAGE_REGISTERS,
    USER_PREFERENCES,

    // State management
    RegisterState,

    // Transformation
    ContentTransformer,

    // UI
    RegisterUI,

    // Convenience methods
    get: () => RegisterState.get(),
    set: (id) => RegisterState.set(id),
    getDefinition: () => RegisterState.getDefinition(),
    transform: (content, type) => ContentTransformer.transform(content, type),

    // Initialization
    init() {
        RegisterState.init();
        RegisterUI.injectStyles();
        Logger.info('UX:LanguageRegister', 'Language Register System initialized');
    }
};

// CommonJS export for Node.js/testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        LANGUAGE_REGISTERS,
        USER_PREFERENCES,
        RegisterState,
        ContentTransformer
    };
}

// ════════════════════════════════════════════════════════════════════════════
// MODULE LOADED
// ════════════════════════════════════════════════════════════════════════════
Logger.debug('UX:LanguageRegister', 'Language Register System v1.0.0 loaded');
Logger.debug('UX:LanguageRegister', '   REGISTERS: analytical | balanced | contemplative');
Logger.debug('UX:LanguageRegister', '   Same math. Same geometry. Multiple voices.');
Logger.debug('UX:LanguageRegister', '   Use LanguageRegister.set("contemplative") to change');
