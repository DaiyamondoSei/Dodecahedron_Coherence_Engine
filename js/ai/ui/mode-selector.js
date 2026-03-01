/**
 * ========================================
 * MODE SELECTOR - UI Component
 * ========================================
 *
 * Allows users to choose between Quick (12 KPIs) and Full (60 KPIs) modes.
 *
 * Bridging Language (from HeartMath Bridge):
 * - Quick Mode (12 KPIs): "Essential scan - one vital sign per domain"
 * - Full Mode (60 KPIs): "Complete portrait - five elements per domain"
 *
 * @module ModeSelector
 * @version Sprint 2 - Task 12
 */

import { MappingContext } from '../core/mapping-context.js';

// Mode configuration
const MODES = {
    quick: {
        id: 'quick',
        name: 'Quick Scan',
        subtitle: '12 Essential Vital Signs',
        description: 'One core metric per domain. Perfect for initial assessment or time-sensitive situations.',
        kpiCount: 12,
        perFace: 1,
        icon: '⚡',
        bridgingLanguage: {
            academic: 'Minimal viable assessment',
            business: 'Executive dashboard',
            intuitive: 'The heartbeat check'
        },
        estimatedTime: '5-10 minutes'
    },
    full: {
        id: 'full',
        name: 'Complete Portrait',
        subtitle: '60 Detailed Metrics',
        description: 'Five metrics per domain for comprehensive organizational insight.',
        kpiCount: 60,
        perFace: 5,
        icon: '🎯',
        bridgingLanguage: {
            academic: 'Comprehensive multi-factor analysis',
            business: 'Full strategic review',
            intuitive: 'The complete picture'
        },
        estimatedTime: '20-30 minutes'
    }
};

/**
 * ModeSelector - UI component for Quick/Full mode selection
 */
class ModeSelector {
    constructor(options = {}) {
        this.containerId = options.containerId || 'mode-selector-container';
        this.onModeChange = options.onModeChange || (() => {});
        this.audienceType = options.audienceType || 'business'; // academic, business, intuitive

        this._container = null;
        this._currentMode = 'quick';
        this._context = null;
    }

    // ========================================
    // INITIALIZATION
    // ========================================

    /**
     * Initialize the mode selector
     * @param {string|HTMLElement} container - Container ID or element
     */
    init(container) {
        if (typeof container === 'string') {
            this._container = document.getElementById(container);
        } else {
            this._container = container;
        }

        if (!this._container) {
            Logger.error('ModeSelector', 'Container not found');
            return;
        }

        // Get MappingContext
        this._context = MappingContext.getInstance();
        this._currentMode = this._context.getMode();

        this._render();
        this._attachEventListeners();
    }

    /**
     * Render the mode selector UI
     */
    _render() {
        this._container.innerHTML = `
            <div class="mode-selector">
                <h3 class="mode-selector-title">Analysis Depth</h3>
                <p class="mode-selector-subtitle">Choose your assessment approach</p>

                <div class="mode-options">
                    ${this._renderModeCard('quick')}
                    ${this._renderModeCard('full')}
                </div>

                <div class="mode-comparison">
                    <div class="comparison-header">
                        <span class="comparison-label">KPIs per Domain</span>
                        <span class="comparison-value">
                            <span class="quick-indicator ${this._currentMode === 'quick' ? 'active' : ''}">1</span>
                            <span class="vs">vs</span>
                            <span class="full-indicator ${this._currentMode === 'full' ? 'active' : ''}">5</span>
                        </span>
                    </div>

                    <div class="mode-bar">
                        <div class="mode-bar-fill ${this._currentMode}" style="width: ${this._currentMode === 'quick' ? '20' : '100'}%"></div>
                    </div>

                    <div class="mode-info">
                        <span class="current-mode-text">
                            ${this._getModeDescription(this._currentMode)}
                        </span>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Render a single mode card
     */
    _renderModeCard(modeId) {
        const mode = MODES[modeId];
        const isActive = this._currentMode === modeId;
        const bridgingText = mode.bridgingLanguage[this.audienceType];

        return `
            <div class="mode-card ${isActive ? 'active' : ''}" data-mode="${modeId}">
                <div class="mode-card-header">
                    <span class="mode-icon">${mode.icon}</span>
                    <div class="mode-card-titles">
                        <h4 class="mode-name">${mode.name}</h4>
                        <span class="mode-subtitle">${mode.subtitle}</span>
                    </div>
                    ${isActive ? '<span class="mode-check">✓</span>' : ''}
                </div>

                <p class="mode-description">${mode.description}</p>

                <div class="mode-meta">
                    <span class="mode-time">
                        <span class="meta-icon">⏱️</span>
                        ${mode.estimatedTime}
                    </span>
                    <span class="mode-bridging" title="Intuitive perspective">
                        "${bridgingText}"
                    </span>
                </div>

                <div class="mode-kpi-preview">
                    <span class="kpi-count">${mode.kpiCount}</span>
                    <span class="kpi-label">Total KPIs</span>
                </div>
            </div>
        `;
    }

    /**
     * Get mode description with bridging language
     */
    _getModeDescription(modeId) {
        const mode = MODES[modeId];
        return `${mode.icon} ${mode.name}: ${mode.bridgingLanguage[this.audienceType]}`;
    }

    /**
     * Attach event listeners
     */
    _attachEventListeners() {
        const cards = this._container.querySelectorAll('.mode-card');

        cards.forEach(card => {
            card.addEventListener('click', () => {
                const modeId = card.dataset.mode;
                this._selectMode(modeId);
            });

            // Keyboard accessibility
            card.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    const modeId = card.dataset.mode;
                    this._selectMode(modeId);
                }
            });

            // Make focusable
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
        });
    }

    // ========================================
    // MODE SELECTION
    // ========================================

    /**
     * Select a mode
     * @param {string} modeId - 'quick' or 'full'
     */
    _selectMode(modeId) {
        if (modeId === this._currentMode) return;

        this._currentMode = modeId;

        // Update MappingContext
        if (this._context) {
            this._context.setMode(modeId);
        }

        // Update UI
        this._updateUI();

        // Notify
        this.onModeChange(modeId, MODES[modeId]);
    }

    /**
     * Update UI after mode change
     */
    _updateUI() {
        // Update cards
        const cards = this._container.querySelectorAll('.mode-card');
        cards.forEach(card => {
            const isActive = card.dataset.mode === this._currentMode;
            card.classList.toggle('active', isActive);

            // Update check mark
            const existingCheck = card.querySelector('.mode-check');
            if (isActive && !existingCheck) {
                const header = card.querySelector('.mode-card-header');
                const check = document.createElement('span');
                check.className = 'mode-check';
                check.textContent = '✓';
                header.appendChild(check);
            } else if (!isActive && existingCheck) {
                existingCheck.remove();
            }
        });

        // Update comparison bar
        const barFill = this._container.querySelector('.mode-bar-fill');
        if (barFill) {
            barFill.className = `mode-bar-fill ${this._currentMode}`;
            barFill.style.width = this._currentMode === 'quick' ? '20%' : '100%';
        }

        // Update indicators
        const quickIndicator = this._container.querySelector('.quick-indicator');
        const fullIndicator = this._container.querySelector('.full-indicator');
        if (quickIndicator) quickIndicator.classList.toggle('active', this._currentMode === 'quick');
        if (fullIndicator) fullIndicator.classList.toggle('active', this._currentMode === 'full');

        // Update description
        const modeText = this._container.querySelector('.current-mode-text');
        if (modeText) {
            modeText.textContent = this._getModeDescription(this._currentMode);
        }
    }

    // ========================================
    // PUBLIC API
    // ========================================

    /**
     * Get current mode
     */
    getMode() {
        return this._currentMode;
    }

    /**
     * Get current mode configuration
     */
    getModeConfig() {
        return MODES[this._currentMode];
    }

    /**
     * Set mode programmatically
     */
    setMode(modeId) {
        if (MODES[modeId]) {
            this._selectMode(modeId);
        }
    }

    /**
     * Set audience type for bridging language
     */
    setAudienceType(type) {
        if (['academic', 'business', 'intuitive'].includes(type)) {
            this.audienceType = type;
            this._render();
            this._attachEventListeners();
        }
    }

    /**
     * Get KPI count for current mode
     */
    getKPICount() {
        return MODES[this._currentMode].kpiCount;
    }

    /**
     * Get KPIs per face for current mode
     */
    getKPIsPerFace() {
        return MODES[this._currentMode].perFace;
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
// STYLES (Inject if not present)
// ========================================

function injectStyles() {
    if (document.getElementById('mode-selector-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'mode-selector-styles';
    styles.textContent = `
        .mode-selector {
            font-family: system-ui, -apple-system, sans-serif;
            max-width: 600px;
            padding: 1rem;
        }

        .mode-selector-title {
            margin: 0 0 0.25rem 0;
            font-size: 1.1rem;
            font-weight: 600;
        }

        .mode-selector-subtitle {
            margin: 0 0 1rem 0;
            font-size: 0.85rem;
            color: #666;
        }

        .mode-options {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
            margin-bottom: 1.5rem;
        }

        @media (max-width: 500px) {
            .mode-options {
                grid-template-columns: 1fr;
            }
        }

        .mode-card {
            padding: 1rem;
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.2s;
            background: white;
        }

        .mode-card:hover {
            border-color: #a5b4fc;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
        }

        .mode-card.active {
            border-color: #6366f1;
            background: linear-gradient(to bottom right, #f5f3ff, #ede9fe);
        }

        .mode-card-header {
            display: flex;
            align-items: flex-start;
            gap: 0.75rem;
            margin-bottom: 0.75rem;
        }

        .mode-icon {
            font-size: 1.5rem;
            flex-shrink: 0;
        }

        .mode-card-titles {
            flex: 1;
        }

        .mode-name {
            margin: 0;
            font-size: 1rem;
            font-weight: 600;
        }

        .mode-subtitle {
            font-size: 0.75rem;
            color: #6b7280;
        }

        .mode-check {
            width: 24px;
            height: 24px;
            background: #6366f1;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8rem;
            font-weight: bold;
        }

        .mode-description {
            margin: 0 0 0.75rem 0;
            font-size: 0.8rem;
            color: #4b5563;
            line-height: 1.4;
        }

        .mode-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-bottom: 0.75rem;
            font-size: 0.75rem;
        }

        .mode-time {
            display: flex;
            align-items: center;
            gap: 0.25rem;
            color: #6b7280;
        }

        .mode-bridging {
            font-style: italic;
            color: #8b5cf6;
        }

        .mode-kpi-preview {
            display: flex;
            align-items: baseline;
            gap: 0.5rem;
            padding-top: 0.5rem;
            border-top: 1px solid #e5e7eb;
        }

        .kpi-count {
            font-size: 1.5rem;
            font-weight: 700;
            color: #6366f1;
        }

        .kpi-label {
            font-size: 0.75rem;
            color: #6b7280;
        }

        .mode-comparison {
            padding: 1rem;
            background: #f9fafb;
            border-radius: 8px;
        }

        .comparison-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;
        }

        .comparison-label {
            font-size: 0.85rem;
            font-weight: 500;
            color: #374151;
        }

        .comparison-value {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .quick-indicator, .full-indicator {
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            font-weight: 600;
            font-size: 0.85rem;
            background: #e5e7eb;
            color: #6b7280;
            transition: all 0.3s;
        }

        .quick-indicator.active, .full-indicator.active {
            background: #6366f1;
            color: white;
            transform: scale(1.1);
        }

        .vs {
            font-size: 0.7rem;
            color: #9ca3af;
        }

        .mode-bar {
            height: 8px;
            background: #e5e7eb;
            border-radius: 4px;
            overflow: hidden;
            margin-bottom: 0.5rem;
        }

        .mode-bar-fill {
            height: 100%;
            border-radius: 4px;
            transition: width 0.4s ease, background 0.3s;
        }

        .mode-bar-fill.quick {
            background: linear-gradient(to right, #6366f1, #8b5cf6);
        }

        .mode-bar-fill.full {
            background: linear-gradient(to right, #6366f1, #8b5cf6, #a78bfa);
        }

        .mode-info {
            text-align: center;
        }

        .current-mode-text {
            font-size: 0.85rem;
            color: #6366f1;
            font-weight: 500;
        }
    `;
    document.head.appendChild(styles);
}

// Auto-inject styles when module loads
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

export { ModeSelector, MODES };

// Export for browser global
if (typeof window !== 'undefined') {
    window.ModeSelector = ModeSelector;
    window.MODE_CONFIGS = MODES;
}
