/**
 * ========================================
 * VOCABULARY STYLE SELECTOR - UI Component
 * ========================================
 *
 * Controls the language style for AI-generated domain names.
 * Addresses the "vocabulary resonance" issue where names may
 * feel too corporate or too esoteric for different audiences.
 *
 * 4 Vocabulary Styles:
 * - GROUNDED: Plain, everyday language
 * - PROFESSIONAL: Business terminology
 * - SYSTEMS: Technical, analytical language
 * - POETIC: Metaphorical, evocative language
 *
 * @module VocabularyStyleSelector
 * @version Sprint 2 - Task 5
 */

// Vocabulary style configurations
const VOCABULARY_STYLES = {
    grounded: {
        id: 'grounded',
        name: 'Grounded',
        icon: '🌍',
        description: 'Plain, everyday language',
        example: 'Money Flow',
        color: '#78716c', // stone
        promptModifier: `
Use plain, everyday language for all domain names.
Names should feel like talking to a wise friend.
Avoid jargon, buzzwords, or abstract concepts.
Example: Instead of "Financial Capital" use "Money Flow"
Example: Instead of "Human Resources" use "Our People"
`
    },
    professional: {
        id: 'professional',
        name: 'Professional',
        icon: '💼',
        description: 'Business terminology',
        example: 'Financial Capital',
        color: '#3b82f6', // blue
        promptModifier: `
Use business and professional terminology for domain names.
Names should feel competent and boardroom-appropriate.
Use standard business vocabulary that executives would recognize.
Example: "Financial Capital", "Human Resources", "Strategic Partnerships"
`
    },
    systems: {
        id: 'systems',
        name: 'Systems',
        icon: '🔄',
        description: 'Technical, interconnected language',
        example: 'Resource Circulation',
        color: '#8b5cf6', // violet
        promptModifier: `
Use technical, systems-thinking language for domain names.
Names should show how pieces connect and interact.
Emphasize flows, feedback loops, and emergent properties.
Example: Instead of "Finance" use "Resource Circulation"
Example: Instead of "Team" use "Human System Dynamics"
`
    },
    poetic: {
        id: 'poetic',
        name: 'Poetic',
        icon: '✨',
        description: 'Metaphorical, evocative language',
        example: 'Abundance Stream',
        color: '#ec4899', // pink
        promptModifier: `
Use metaphorical, evocative language for domain names.
Names should touch something deeper and inspire.
Draw from nature, mythology, and universal archetypes.
Example: Instead of "Finance" use "Abundance Stream"
Example: Instead of "Brand" use "Voice in the World"
`
    }
};

// Storage key
const STORAGE_KEY = 'quannex_vocabulary_style';

/**
 * VocabularyStyleSelector - Language style selection component
 */
class VocabularyStyleSelector {
    constructor(options = {}) {
        this.containerId = options.containerId || 'vocabulary-style-container';
        this.onStyleChange = options.onStyleChange || (() => {});
        this.compact = options.compact || false;

        this._container = null;
        this._selectedStyle = localStorage.getItem(STORAGE_KEY) || 'professional';
    }

    /**
     * Initialize the component
     */
    init(container) {
        if (typeof container === 'string') {
            this._container = document.getElementById(container);
        } else {
            this._container = container;
        }

        if (!this._container) {
            console.error('[VocabularyStyleSelector] Container not found');
            return;
        }

        this._render();
        this._attachEventListeners();
    }

    /**
     * Render the vocabulary style selector UI
     */
    _render() {
        const selectedStyle = VOCABULARY_STYLES[this._selectedStyle];

        this._container.innerHTML = `
            <div class="vocabulary-style-selector" style="
                background: rgba(0, 0, 0, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                padding: 16px;
            ">
                <h3 style="
                    font-size: 14px;
                    margin: 0 0 12px 0;
                    color: rgba(255, 255, 255, 0.8);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                ">
                    🎨 Vocabulary Style
                    <span style="font-size: 11px; color: rgba(255, 255, 255, 0.5); font-weight: normal;">
                        (How domain names feel)
                    </span>
                </h3>

                <div class="style-options" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px;">
                    ${Object.values(VOCABULARY_STYLES).map(style => `
                        <button
                            type="button"
                            class="style-option ${style.id === this._selectedStyle ? 'selected' : ''}"
                            data-style="${style.id}"
                            style="
                                padding: ${this.compact ? '8px 4px' : '10px 6px'};
                                border-radius: 8px;
                                border: 2px solid ${style.id === this._selectedStyle ? style.color : 'transparent'};
                                background: ${style.id === this._selectedStyle ? style.color + '20' : 'rgba(0,0,0,0.2)'};
                                color: ${style.id === this._selectedStyle ? style.color : 'rgba(255,255,255,0.6)'};
                                cursor: pointer;
                                font-size: 11px;
                                transition: all 0.2s;
                                text-align: center;
                            "
                        >
                            <div style="font-size: 16px; margin-bottom: 2px;">${style.icon}</div>
                            <div style="font-weight: 600; font-size: 10px;">${style.name}</div>
                        </button>
                    `).join('')}
                </div>

                <div class="style-preview" style="
                    margin-top: 10px;
                    padding: 10px;
                    background: ${selectedStyle.color}10;
                    border-left: 3px solid ${selectedStyle.color};
                    border-radius: 4px;
                    font-size: 11px;
                ">
                    <div style="color: rgba(255, 255, 255, 0.6);">
                        ${selectedStyle.description}
                    </div>
                    <div style="margin-top: 4px; color: ${selectedStyle.color};">
                        Example: "${selectedStyle.example}"
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Attach event listeners
     */
    _attachEventListeners() {
        const styleButtons = this._container.querySelectorAll('.style-option');

        styleButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const styleId = btn.dataset.style;
                if (styleId && styleId !== this._selectedStyle) {
                    this._selectStyle(styleId);
                }
            });

            // Hover effect
            btn.addEventListener('mouseenter', () => {
                if (btn.dataset.style !== this._selectedStyle) {
                    const style = VOCABULARY_STYLES[btn.dataset.style];
                    btn.style.borderColor = style.color + '60';
                    btn.style.background = style.color + '10';
                }
            });

            btn.addEventListener('mouseleave', () => {
                if (btn.dataset.style !== this._selectedStyle) {
                    btn.style.borderColor = 'transparent';
                    btn.style.background = 'rgba(0,0,0,0.2)';
                }
            });
        });
    }

    /**
     * Select a vocabulary style
     */
    _selectStyle(styleId) {
        if (!VOCABULARY_STYLES[styleId]) return;

        this._selectedStyle = styleId;
        localStorage.setItem(STORAGE_KEY, styleId);

        this._render();
        this._attachEventListeners();

        this.onStyleChange(styleId, VOCABULARY_STYLES[styleId]);
    }

    /**
     * Get the currently selected style
     */
    getSelectedStyle() {
        return this._selectedStyle;
    }

    /**
     * Get the full style configuration
     */
    getStyleConfig() {
        return VOCABULARY_STYLES[this._selectedStyle];
    }

    /**
     * Get the prompt modifier for the selected style
     */
    getPromptModifier() {
        return VOCABULARY_STYLES[this._selectedStyle].promptModifier;
    }

    /**
     * Get all available styles
     */
    static getAllStyles() {
        return VOCABULARY_STYLES;
    }

    /**
     * Destroy the component
     */
    destroy() {
        if (this._container) {
            this._container.innerHTML = '';
        }
    }
}

// ========================================
// EXPORTS
// ========================================

export { VocabularyStyleSelector, VOCABULARY_STYLES, STORAGE_KEY };

// Export for browser global
if (typeof window !== 'undefined') {
    window.VocabularyStyleSelector = VocabularyStyleSelector;
    window.VOCABULARY_STYLES = VOCABULARY_STYLES;
}

console.log('✅ VocabularyStyleSelector loaded with 4 vocabulary styles');
