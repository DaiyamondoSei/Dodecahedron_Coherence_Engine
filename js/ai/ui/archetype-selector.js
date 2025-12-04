/**
 * ========================================
 * ARCHETYPE SELECTOR - UI Component
 * ========================================
 *
 * Card-based selection UI for the 5 organizational archetypes.
 * AI suggests based on story, user confirms with selection.
 *
 * The 5 Archetypes (from Chief Creativity Officer):
 * 1. The Builder - Structure and tangible outcomes
 * 2. The Nurturer - Relationships and sustainable growth
 * 3. The Innovator - Creativity and new possibilities
 * 4. The Guardian - Protection and preservation
 * 5. The Connector - Ecosystems and partnerships
 *
 * @module ArchetypeSelector
 * @version Sprint 2 - Task 19
 */

import { MappingContext } from '../core/mapping-context.js';
import { ARCHETYPE_PRESETS } from '../tuning/archetype-presets.js';

// Archetype definitions with rich metadata
const ARCHETYPES = {
    Builder: {
        id: 'Builder',
        name: 'The Builder',
        icon: '🔧',
        color: '#92400E',
        bgGradient: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
        philosophy: 'Structure and tangible outcomes',
        strengths: ['Systems', 'Execution', 'Reliability', 'Infrastructure'],
        coreQuestion: 'What can we construct?',
        shadowRisk: 'Rigidity, over-engineering',
        phiEmphasis: 'GAMMA/DELTA - structural integrity'
    },
    Nurturer: {
        id: 'Nurturer',
        name: 'The Nurturer',
        icon: '💚',
        color: '#059669',
        bgGradient: 'linear-gradient(135deg, #D1FAE5, #A7F3D0)',
        philosophy: 'Relationships and sustainable growth',
        strengths: ['Team development', 'Culture', 'Care', 'Empathy'],
        coreQuestion: 'How can we support?',
        shadowRisk: 'Avoiding conflict, over-accommodation',
        phiEmphasis: 'BETA - social cohesion'
    },
    Innovator: {
        id: 'Innovator',
        name: 'The Innovator',
        icon: '💡',
        color: '#7C3AED',
        bgGradient: 'linear-gradient(135deg, #EDE9FE, #DDD6FE)',
        philosophy: 'Creativity and new possibilities',
        strengths: ['R&D', 'Experimentation', 'Disruption', 'Vision'],
        coreQuestion: "What hasn't been tried?",
        shadowRisk: 'Shiny object syndrome, abandoning proven paths',
        phiEmphasis: 'ALPHA/KAPPA - creative curvature'
    },
    Guardian: {
        id: 'Guardian',
        name: 'The Guardian',
        icon: '🛡️',
        color: '#1E40AF',
        bgGradient: 'linear-gradient(135deg, #DBEAFE, #BFDBFE)',
        philosophy: 'Protection and preservation',
        strengths: ['Risk management', 'Security', 'Stability', 'Compliance'],
        coreQuestion: 'What must we protect?',
        shadowRisk: 'Stagnation, excessive caution',
        phiEmphasis: 'GAMMA/DELTA - defensive stability'
    },
    Connector: {
        id: 'Connector',
        name: 'The Connector',
        icon: '🔗',
        color: '#DB2777',
        bgGradient: 'linear-gradient(135deg, #FCE7F3, #FBCFE8)',
        philosophy: 'Ecosystems and partnerships',
        strengths: ['Networks', 'Alliances', 'Integration', 'Bridges'],
        coreQuestion: 'Who should we partner with?',
        shadowRisk: 'Over-reliance on external validation',
        phiEmphasis: 'BETA - network resonance'
    }
};

/**
 * ArchetypeSelector - Card-based archetype selection UI
 */
class ArchetypeSelector {
    constructor(options = {}) {
        this.containerId = options.containerId || 'archetype-selector-container';
        this.onArchetypeChange = options.onArchetypeChange || (() => {});
        this.onPresetsApplied = options.onPresetsApplied || (() => {});

        this._container = null;
        this._context = MappingContext.getInstance();
        this._selectedArchetype = null;
        this._suggestedArchetype = null;
        this._suggestionConfidence = 0;
    }

    // ========================================
    // INITIALIZATION
    // ========================================

    /**
     * Initialize the archetype selector
     */
    init(container) {
        if (typeof container === 'string') {
            this._container = document.getElementById(container);
        } else {
            this._container = container;
        }

        if (!this._container) {
            console.error('[ArchetypeSelector] Container not found');
            return;
        }

        this._selectedArchetype = this._context.getArchetype();
        this._render();
        this._attachEventListeners();
    }

    /**
     * Set AI suggestion (from provider)
     */
    setSuggestion(archetypeId, confidence = 0.8) {
        if (ARCHETYPES[archetypeId]) {
            this._suggestedArchetype = archetypeId;
            this._suggestionConfidence = confidence;
            this._render();
            this._attachEventListeners();
        }
    }

    // ========================================
    // RENDERING
    // ========================================

    /**
     * Render the archetype selector UI
     */
    _render() {
        this._container.innerHTML = `
            <div class="archetype-selector">
                <div class="archetype-header">
                    <h3 class="archetype-title">Organizational Archetype</h3>
                    <p class="archetype-subtitle">Select the archetype that best represents your organization's core nature</p>

                    ${this._suggestedArchetype ? `
                        <div class="ai-suggestion">
                            <span class="suggestion-icon">🤖</span>
                            <span class="suggestion-text">
                                AI suggests <strong>${ARCHETYPES[this._suggestedArchetype].name}</strong>
                                (${Math.round(this._suggestionConfidence * 100)}% confidence)
                            </span>
                        </div>
                    ` : ''}
                </div>

                <div class="archetype-grid">
                    ${Object.values(ARCHETYPES).map(arch => this._renderArchetypeCard(arch)).join('')}
                </div>

                ${this._selectedArchetype ? `
                    <div class="archetype-actions">
                        <button class="apply-btn" id="apply-archetype-btn">
                            Apply ${ARCHETYPES[this._selectedArchetype].name} Tuning
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Render a single archetype card
     */
    _renderArchetypeCard(archetype) {
        const isSelected = this._selectedArchetype === archetype.id;
        const isSuggested = this._suggestedArchetype === archetype.id;

        return `
            <div class="archetype-card ${isSelected ? 'selected' : ''} ${isSuggested ? 'suggested' : ''}"
                 data-archetype="${archetype.id}"
                 style="--card-bg: ${archetype.bgGradient}; --card-color: ${archetype.color}">

                ${isSuggested ? '<span class="suggested-badge">AI Suggested</span>' : ''}
                ${isSelected ? '<span class="selected-badge">✓ Selected</span>' : ''}

                <div class="card-icon">${archetype.icon}</div>
                <h4 class="card-name">${archetype.name}</h4>
                <p class="card-philosophy">${archetype.philosophy}</p>

                <div class="card-question">
                    <span class="question-label">Core Question:</span>
                    <span class="question-text">"${archetype.coreQuestion}"</span>
                </div>

                <div class="card-strengths">
                    ${archetype.strengths.map(s => `<span class="strength-tag">${s}</span>`).join('')}
                </div>

                <div class="card-footer">
                    <span class="phi-emphasis">${archetype.phiEmphasis}</span>
                </div>
            </div>
        `;
    }

    /**
     * Attach event listeners
     */
    _attachEventListeners() {
        const cards = this._container.querySelectorAll('.archetype-card');

        cards.forEach(card => {
            card.addEventListener('click', () => {
                const archetypeId = card.dataset.archetype;
                this._selectArchetype(archetypeId);
            });

            // Keyboard accessibility
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    this._selectArchetype(card.dataset.archetype);
                }
            });
        });

        // Apply button
        const applyBtn = this._container.querySelector('#apply-archetype-btn');
        if (applyBtn) {
            applyBtn.addEventListener('click', () => this._applyArchetype());
        }
    }

    // ========================================
    // SELECTION
    // ========================================

    /**
     * Select an archetype
     */
    _selectArchetype(archetypeId) {
        if (!ARCHETYPES[archetypeId]) return;

        this._selectedArchetype = archetypeId;

        // Update UI
        this._render();
        this._attachEventListeners();

        // Notify
        this.onArchetypeChange(archetypeId, ARCHETYPES[archetypeId]);
    }

    /**
     * Apply selected archetype tuning
     */
    _applyArchetype() {
        if (!this._selectedArchetype) return;

        const archetype = ARCHETYPES[this._selectedArchetype];
        const constants = ARCHETYPE_PRESETS[this._selectedArchetype];

        if (!constants) {
            console.error('[ArchetypeSelector] No presets for archetype:', this._selectedArchetype);
            return;
        }

        // Update context
        this._context.setArchetype(this._selectedArchetype, constants);

        // Notify
        this.onPresetsApplied(this._selectedArchetype, constants, archetype);

        // Visual feedback
        const applyBtn = this._container.querySelector('#apply-archetype-btn');
        if (applyBtn) {
            applyBtn.textContent = '✓ Applied!';
            applyBtn.classList.add('applied');
            setTimeout(() => {
                applyBtn.textContent = `Apply ${archetype.name} Tuning`;
                applyBtn.classList.remove('applied');
            }, 2000);
        }
    }

    // ========================================
    // PUBLIC API
    // ========================================

    /**
     * Get currently selected archetype
     */
    getSelected() {
        return this._selectedArchetype ? {
            id: this._selectedArchetype,
            ...ARCHETYPES[this._selectedArchetype],
            constants: ARCHETYPE_PRESETS[this._selectedArchetype]
        } : null;
    }

    /**
     * Get all archetype definitions
     */
    getArchetypes() {
        return { ...ARCHETYPES };
    }

    /**
     * Set archetype programmatically
     */
    setArchetype(archetypeId) {
        this._selectArchetype(archetypeId);
    }

    /**
     * Destroy and cleanup
     */
    destroy() {
        if (this._container) {
            this._container.innerHTML = '';
        }
    }
}

// ========================================
// STYLES
// ========================================

function injectStyles() {
    if (document.getElementById('archetype-selector-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'archetype-selector-styles';
    styles.textContent = `
        .archetype-selector {
            font-family: system-ui, -apple-system, sans-serif;
            max-width: 900px;
            padding: 1rem;
        }

        .archetype-header {
            text-align: center;
            margin-bottom: 1.5rem;
        }

        .archetype-title {
            margin: 0 0 0.25rem 0;
            font-size: 1.25rem;
            font-weight: 600;
        }

        .archetype-subtitle {
            margin: 0 0 1rem 0;
            font-size: 0.9rem;
            color: #6b7280;
        }

        .ai-suggestion {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            background: linear-gradient(135deg, #EEF2FF, #E0E7FF);
            border: 1px solid #A5B4FC;
            border-radius: 20px;
            font-size: 0.85rem;
        }

        .archetype-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
            margin-bottom: 1.5rem;
        }

        .archetype-card {
            position: relative;
            padding: 1.25rem;
            background: var(--card-bg);
            border: 2px solid transparent;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .archetype-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        }

        .archetype-card.selected {
            border-color: var(--card-color);
            box-shadow: 0 0 0 3px rgba(0,0,0,0.1);
        }

        .archetype-card.suggested {
            animation: suggestPulse 2s infinite;
        }

        @keyframes suggestPulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); }
            50% { box-shadow: 0 0 0 6px rgba(99, 102, 241, 0); }
        }

        .suggested-badge, .selected-badge {
            position: absolute;
            top: -8px;
            right: 10px;
            padding: 0.25rem 0.5rem;
            font-size: 0.7rem;
            font-weight: 600;
            border-radius: 4px;
        }

        .suggested-badge {
            background: #6366F1;
            color: white;
        }

        .selected-badge {
            background: #059669;
            color: white;
        }

        .card-icon {
            font-size: 2rem;
            margin-bottom: 0.5rem;
        }

        .card-name {
            margin: 0 0 0.25rem 0;
            font-size: 1.1rem;
            font-weight: 600;
            color: var(--card-color);
        }

        .card-philosophy {
            margin: 0 0 0.75rem 0;
            font-size: 0.85rem;
            color: #4b5563;
        }

        .card-question {
            margin-bottom: 0.75rem;
            font-size: 0.8rem;
        }

        .question-label {
            color: #6b7280;
        }

        .question-text {
            font-style: italic;
            color: var(--card-color);
        }

        .card-strengths {
            display: flex;
            flex-wrap: wrap;
            gap: 0.25rem;
            margin-bottom: 0.75rem;
        }

        .strength-tag {
            padding: 0.15rem 0.4rem;
            background: rgba(255,255,255,0.7);
            border-radius: 4px;
            font-size: 0.7rem;
            color: #374151;
        }

        .card-footer {
            padding-top: 0.5rem;
            border-top: 1px solid rgba(0,0,0,0.1);
            font-size: 0.7rem;
            color: #6b7280;
        }

        .archetype-actions {
            text-align: center;
        }

        .apply-btn {
            padding: 0.75rem 2rem;
            background: #6366F1;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
        }

        .apply-btn:hover {
            background: #4F46E5;
            transform: translateY(-1px);
        }

        .apply-btn.applied {
            background: #059669;
        }
    `;
    document.head.appendChild(styles);
}

if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectStyles);
    } else {
        injectStyles();
    }
}

// ========================================
// EXPORTS
// ========================================

export { ArchetypeSelector, ARCHETYPES };

// Export for browser global
if (typeof window !== 'undefined') {
    window.ArchetypeSelector = ArchetypeSelector;
    window.ARCHETYPES = ARCHETYPES;
}
