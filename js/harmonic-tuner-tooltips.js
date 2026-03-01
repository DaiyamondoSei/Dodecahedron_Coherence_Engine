/**
 * Harmonic Tuner Tooltips v1.0
 * Rich parameter explanations with phi-based timing
 * Provides educational context for each tuning parameter
 */

class TooltipManager {
    constructor() {
        // ========================================
        // PHI-based timing (golden ratio)
        // Single source: js/constants/phi-harmonics.js
        // ========================================
        const _PH = (typeof window !== 'undefined' && window.PhiHarmonics) || {};
        const PHI_2 = _PH.PHI_2 || 0.381966011250105;  // φ^-2 ≈ 0.382

        this.showDelay = Math.round(PHI_2 * 1000);  // φ^-2 × 1000ms ≈ 382ms
        this.hideDelay = 200;  // Quick fade
        this.animationDuration = 250;

        this.activeTooltip = null;
        this.showTimeout = null;
        this.hideTimeout = null;

        // Rich tooltip content for each parameter
        this.tooltipData = {
            Alpha: {
                symbol: 'α',
                name: 'ALPHA - Synergy',
                category: 'Foundation',
                description: 'Controls the strength of collaborative bonds between organizational faces. Higher values amplify interconnection effects.',
                optimal: '0.6 - 0.8',
                effect: 'Increases cross-functional harmony',
                warning: 'Values above 0.9 may cause over-coupling'
            },
            Beta: {
                symbol: 'β',
                name: 'BETA - Structure',
                category: 'Foundation',
                description: 'Defines the rigidity of organizational boundaries. Balances stability with adaptability.',
                optimal: '0.4 - 0.6',
                effect: 'Shapes organizational form',
                warning: 'Too high creates rigidity, too low causes instability'
            },
            Gamma: {
                symbol: 'γ',
                name: 'GAMMA - Balance',
                category: 'Foundation',
                description: 'Equilibrium factor between opposing forces. Seeks the golden mean in all relationships.',
                optimal: '0.5 - 0.7',
                effect: 'Harmonizes tensions',
                warning: 'Extreme values disrupt equilibrium'
            },
            Delta: {
                symbol: 'δ',
                name: 'DELTA - Shadow',
                category: 'Transformation',
                description: 'Represents hidden potential and unconscious organizational patterns. Integrates shadow aspects.',
                optimal: '0.3 - 0.5',
                effect: 'Reveals hidden dynamics',
                warning: 'High values surface suppressed tensions'
            },
            Kappa: {
                symbol: 'κ',
                name: 'KAPPA - Gain',
                category: 'Transformation',
                description: 'Amplification coefficient for coherence signals. Controls how strongly changes propagate.',
                optimal: '0.5 - 0.7',
                effect: 'Amplifies resonance effects',
                warning: 'Above 0.8 may cause feedback loops'
            },
            Eta: {
                symbol: 'η',
                name: 'ETA - Resonance',
                category: 'Mastery',
                description: 'Fine-tunes the resonance frequency of the coherence field. Derived from phi relationships.',
                optimal: '0.309 - 0.382',
                effect: 'Aligns vibrational frequencies',
                warning: 'Precise tuning required for optimal effect'
            },
            Zeta: {
                symbol: 'ζ',
                name: 'ZETA - Zenith',
                category: 'Mastery',
                description: 'Peak potential coefficient. Governs the maximum achievable coherence state.',
                optimal: '0.500 - 0.618',
                effect: 'Sets coherence ceiling',
                warning: 'Higher values require stable foundation'
            },
            Theta: {
                symbol: 'θ',
                name: 'THETA - Threshold',
                category: 'Mastery',
                description: 'Activation threshold for transcendent states. Controls when quantum coherence effects emerge.',
                optimal: '0.618 - 0.786',
                effect: 'Triggers state transitions',
                warning: 'Below threshold prevents emergence'
            }
        };

        this.init();
    }

    init() {
        // Create tooltip container if it doesn't exist
        if (!document.getElementById('paramTooltip')) {
            const tooltip = document.createElement('div');
            tooltip.id = 'paramTooltip';
            tooltip.className = 'tuner-tooltip';
            tooltip.innerHTML = `
                <div class="tuner-tooltip__header">
                    <span class="tuner-tooltip__symbol"></span>
                    <span class="tuner-tooltip__name"></span>
                </div>
                <div class="tuner-tooltip__category"></div>
                <div class="tuner-tooltip__description"></div>
                <div class="tuner-tooltip__meta">
                    <div class="tuner-tooltip__optimal">
                        <span class="tuner-tooltip__label">Optimal:</span>
                        <span class="tuner-tooltip__value"></span>
                    </div>
                    <div class="tuner-tooltip__effect">
                        <span class="tuner-tooltip__label">Effect:</span>
                        <span class="tuner-tooltip__value"></span>
                    </div>
                </div>
                <div class="tuner-tooltip__warning"></div>
            `;
            document.body.appendChild(tooltip);
        }

        this.tooltipElement = document.getElementById('paramTooltip');

        // Attach to all knob controls
        this.attachToKnobs();

        Logger.info('HarmonicTunerTooltips', `Initialized with ${Object.keys(this.tooltipData).length} parameters`);
    }

    attachToKnobs() {
        const knobIds = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Kappa', 'Eta', 'Zeta', 'Theta'];

        knobIds.forEach(name => {
            const knobElement = document.getElementById(`knob${name}`);
            if (knobElement) {
                // Mouse events
                knobElement.addEventListener('mouseenter', (e) => this.scheduleShow(name, e));
                knobElement.addEventListener('mouseleave', () => this.scheduleHide());
                knobElement.addEventListener('mousedown', () => this.hideImmediate());

                // Touch events for mobile
                knobElement.addEventListener('touchstart', () => this.hideImmediate());
            }
        });
    }

    scheduleShow(paramName, event) {
        this.clearTimeouts();

        this.showTimeout = setTimeout(() => {
            this.show(paramName, event.target);
        }, this.showDelay);
    }

    scheduleHide() {
        this.clearTimeouts();

        this.hideTimeout = setTimeout(() => {
            this.hide();
        }, this.hideDelay);
    }

    hideImmediate() {
        this.clearTimeouts();
        this.hide();
    }

    clearTimeouts() {
        if (this.showTimeout) {
            clearTimeout(this.showTimeout);
            this.showTimeout = null;
        }
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }
    }

    show(paramName, targetElement) {
        const data = this.tooltipData[paramName];
        if (!data || !this.tooltipElement) return;

        // Populate content
        this.tooltipElement.querySelector('.tuner-tooltip__symbol').textContent = data.symbol;
        this.tooltipElement.querySelector('.tuner-tooltip__name').textContent = data.name;
        this.tooltipElement.querySelector('.tuner-tooltip__category').textContent = data.category;
        this.tooltipElement.querySelector('.tuner-tooltip__category').className =
            `tuner-tooltip__category tuner-tooltip__category--${data.category.toLowerCase()}`;
        this.tooltipElement.querySelector('.tuner-tooltip__description').textContent = data.description;
        this.tooltipElement.querySelector('.tuner-tooltip__optimal .tuner-tooltip__value').textContent = data.optimal;
        this.tooltipElement.querySelector('.tuner-tooltip__effect .tuner-tooltip__value').textContent = data.effect;
        this.tooltipElement.querySelector('.tuner-tooltip__warning').textContent = data.warning;

        // Position tooltip
        this.positionTooltip(targetElement);

        // Show with animation
        this.tooltipElement.classList.add('tuner-tooltip--visible');
        this.activeTooltip = paramName;
    }

    positionTooltip(targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const tooltip = this.tooltipElement;

        // Initially position to measure
        tooltip.style.visibility = 'hidden';
        tooltip.style.display = 'block';

        const tooltipRect = tooltip.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Calculate position (prefer above the knob)
        let top = rect.top - tooltipRect.height - 12;
        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);

        // If tooltip would go above viewport, show below
        if (top < 10) {
            top = rect.bottom + 12;
            tooltip.classList.add('tuner-tooltip--below');
            tooltip.classList.remove('tuner-tooltip--above');
        } else {
            tooltip.classList.add('tuner-tooltip--above');
            tooltip.classList.remove('tuner-tooltip--below');
        }

        // Keep within horizontal bounds
        if (left < 10) {
            left = 10;
        } else if (left + tooltipRect.width > viewportWidth - 10) {
            left = viewportWidth - tooltipRect.width - 10;
        }

        tooltip.style.top = `${top}px`;
        tooltip.style.left = `${left}px`;
        tooltip.style.visibility = 'visible';
    }

    hide() {
        if (this.tooltipElement) {
            this.tooltipElement.classList.remove('tuner-tooltip--visible');
            this.activeTooltip = null;
        }
    }

    // Public method to get tooltip data for external use
    getParameterInfo(paramName) {
        return this.tooltipData[paramName] || null;
    }

    // Update tooltip data dynamically if needed
    updateParameterInfo(paramName, newData) {
        if (this.tooltipData[paramName]) {
            this.tooltipData[paramName] = { ...this.tooltipData[paramName], ...newData };
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for other components to initialize
    setTimeout(() => {
        window.tooltipManager = new TooltipManager();
    }, 100);
});

// Export for module use if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TooltipManager;
}
