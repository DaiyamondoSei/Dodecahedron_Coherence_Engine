/**
 * ========================================
 * LENS PRE-SELECTOR - UI Component
 * ========================================
 *
 * Strategic lens selection BEFORE AI analysis.
 * This fixes the causality inversion where lenses were shown AFTER generation.
 *
 * The 3 lenses correspond to dodecahedral geometry:
 * - GROWTH: Face-centered (12 faces) - What is each domain becoming?
 * - STABILITY: Edge-centered (30 edges) - How do domains support each other?
 * - INNOVATION: Vertex-centered (20 vertices) - What emerges at convergence?
 *
 * @module LensPreSelector
 * @version Sprint 2 - Task 4
 */

// Lens configurations
const LENSES = {
    growth: {
        id: 'growth',
        name: 'Growth',
        icon: '🌱',
        focus: 'Face-centered (12 faces)',
        question: 'What is each domain becoming?',
        description: 'Focus on what each domain could BECOME. Emphasize individual domain sovereignty and development potential.',
        color: '#10b981', // emerald
        promptModifier: `
Generate face names that emphasize GROWTH and POTENTIAL.
For each domain, ask: "What is this domain becoming? What is its evolutionary trajectory?"
Names should feel aspirational and future-oriented.
Example: Finance becomes "Venture Pipeline" or "Growth Capital"
`
    },
    stability: {
        id: 'stability',
        name: 'Stability',
        icon: '🪨',
        focus: 'Edge-centered (30 edges)',
        question: 'How do domains support each other?',
        description: 'Focus on RELATIONSHIPS between domains. Emphasize how departments support and strengthen each other.',
        color: '#6366f1', // indigo
        promptModifier: `
Generate face names that emphasize STABILITY and SUPPORT.
For each domain, ask: "How does this domain support the others? What is its relational role?"
Names should feel grounded and interconnected.
Example: Finance becomes "Financial Resilience" or "Capital Foundation"
`
    },
    innovation: {
        id: 'innovation',
        name: 'Innovation',
        icon: '✨',
        focus: 'Vertex-centered (20 vertices)',
        question: 'What emerges at convergence?',
        description: 'Focus on CONVERGENCE points. Emphasize what emerges when 3+ domains work together.',
        color: '#f59e0b', // amber
        promptModifier: `
Generate face names that emphasize INNOVATION and EMERGENCE.
For each domain, ask: "What new possibilities emerge when this domain intersects with others?"
Names should feel creative and transformative.
Example: Finance becomes "Innovation Fund" or "Catalyst Capital"
`
    }
};

// Storage key
const STORAGE_KEY = 'quannex_selected_lens';

/**
 * LensPreSelector - Strategic lens selection component
 */
class LensPreSelector {
    constructor(options = {}) {
        this.containerId = options.containerId || 'lens-selector-container';
        this.onLensChange = options.onLensChange || (() => {});
        this.showDescriptions = options.showDescriptions !== false;

        this._container = null;
        this._selectedLens = localStorage.getItem(STORAGE_KEY) || 'growth';
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
            console.error('[LensPreSelector] Container not found');
            return;
        }

        this._render();
        this._attachEventListeners();
    }

    /**
     * Render the lens selector UI
     */
    _render() {
        const selectedLens = LENSES[this._selectedLens];

        this._container.innerHTML = `
            <div class="lens-pre-selector" style="
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
                    🔮 Strategic Lens
                    <span style="font-size: 11px; color: rgba(255, 255, 255, 0.5); font-weight: normal;">
                        (Shapes how faces are generated)
                    </span>
                </h3>

                <div class="lens-options" style="display: flex; gap: 8px; margin-bottom: 12px;">
                    ${Object.values(LENSES).map(lens => `
                        <button
                            type="button"
                            class="lens-option ${lens.id === this._selectedLens ? 'selected' : ''}"
                            data-lens="${lens.id}"
                            style="
                                flex: 1;
                                padding: 12px 8px;
                                border-radius: 8px;
                                border: 2px solid ${lens.id === this._selectedLens ? lens.color : 'transparent'};
                                background: ${lens.id === this._selectedLens ? lens.color + '20' : 'rgba(0,0,0,0.2)'};
                                color: ${lens.id === this._selectedLens ? lens.color : 'rgba(255,255,255,0.6)'};
                                cursor: pointer;
                                font-size: 12px;
                                transition: all 0.2s;
                                text-align: center;
                            "
                        >
                            <div style="font-size: 20px; margin-bottom: 4px;">${lens.icon}</div>
                            <div style="font-weight: 600;">${lens.name}</div>
                            <div style="font-size: 10px; opacity: 0.7;">${lens.focus}</div>
                        </button>
                    `).join('')}
                </div>

                ${this.showDescriptions ? `
                    <div class="lens-description" style="
                        padding: 12px;
                        background: ${selectedLens.color}15;
                        border-left: 3px solid ${selectedLens.color};
                        border-radius: 4px;
                        font-size: 12px;
                        color: rgba(255, 255, 255, 0.8);
                    ">
                        <div style="font-weight: 600; margin-bottom: 4px; color: ${selectedLens.color};">
                            ${selectedLens.question}
                        </div>
                        <div style="color: rgba(255, 255, 255, 0.6);">
                            ${selectedLens.description}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Attach event listeners
     */
    _attachEventListeners() {
        const lensButtons = this._container.querySelectorAll('.lens-option');

        lensButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const lensId = btn.dataset.lens;
                if (lensId && lensId !== this._selectedLens) {
                    this._selectLens(lensId);
                }
            });

            // Hover effect
            btn.addEventListener('mouseenter', () => {
                if (btn.dataset.lens !== this._selectedLens) {
                    const lens = LENSES[btn.dataset.lens];
                    btn.style.borderColor = lens.color + '60';
                    btn.style.background = lens.color + '10';
                }
            });

            btn.addEventListener('mouseleave', () => {
                if (btn.dataset.lens !== this._selectedLens) {
                    btn.style.borderColor = 'transparent';
                    btn.style.background = 'rgba(0,0,0,0.2)';
                }
            });
        });
    }

    /**
     * Select a lens
     */
    _selectLens(lensId) {
        if (!LENSES[lensId]) return;

        this._selectedLens = lensId;
        localStorage.setItem(STORAGE_KEY, lensId);

        this._render();
        this._attachEventListeners();

        this.onLensChange(lensId, LENSES[lensId]);
    }

    /**
     * Get the currently selected lens
     */
    getSelectedLens() {
        return this._selectedLens;
    }

    /**
     * Get the full lens configuration
     */
    getLensConfig() {
        return LENSES[this._selectedLens];
    }

    /**
     * Get the prompt modifier for the selected lens
     */
    getPromptModifier() {
        return LENSES[this._selectedLens].promptModifier;
    }

    /**
     * Get all available lenses
     */
    static getAllLenses() {
        return LENSES;
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

export { LensPreSelector, LENSES, STORAGE_KEY };

// Export for browser global
if (typeof window !== 'undefined') {
    window.LensPreSelector = LensPreSelector;
    window.STRATEGIC_LENSES = LENSES;
}

console.log('✅ LensPreSelector loaded with 3 strategic lenses');
