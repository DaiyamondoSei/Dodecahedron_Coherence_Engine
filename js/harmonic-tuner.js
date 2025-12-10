/**
 * Harmonic Tuner Logic v2.0
 * Clean rewrite with BEM naming convention
 * Handles rotary knobs, resonance meter, and mode selection
 */

class RotaryKnob {
    constructor(elementId) {
        this.element = document.getElementById(elementId);
        if (!this.element) {
            console.warn(`RotaryKnob: Element ${elementId} not found`);
            return;
        }

        // BEM selectors
        this.display = document.getElementById(elementId.replace('knob', 'disp'));
        this.ringValue = this.element.querySelector('.tuner__ring-value');

        this.param = this.element.dataset.param;
        this.min = parseFloat(this.element.dataset.min);
        this.max = parseFloat(this.element.dataset.max);
        this.step = parseFloat(this.element.dataset.step);
        this.value = parseFloat(this.element.dataset.value);

        this.isDragging = false;
        this.startY = 0;
        this.startValue = 0;

        this.init();
    }

    init() {
        this.updateVisuals();

        // Mouse Events
        this.element.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.startY = e.clientY;
            this.startValue = this.value;
            document.body.style.cursor = 'ns-resize';

            // Visual feedback
            this.element.style.transform = 'scale(0.95)';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;

            const deltaY = this.startY - e.clientY;
            const range = this.max - this.min;
            const sensitivity = 200;

            let newValue = this.startValue + (deltaY / sensitivity) * range;

            // Snap to step
            newValue = Math.round(newValue / this.step) * this.step;

            // Clamp
            newValue = Math.max(this.min, Math.min(this.max, newValue));

            if (newValue !== this.value) {
                this.value = newValue;
                this.updateVisuals();
                this.emitChange();
            }
        });

        document.addEventListener('mouseup', () => {
            if (this.isDragging) {
                this.isDragging = false;
                document.body.style.cursor = 'default';
                this.element.style.transform = 'scale(1)';
            }
        });
    }

    updateVisuals() {
        // Update display text
        if (this.display) {
            const precision = ['ETA', 'ZETA', 'THETA'].includes(this.param) ? 3 : 1;
            this.display.textContent = this.value.toFixed(precision);
        }

        // Update ring arc
        if (this.ringValue) {
            const range = this.max - this.min;
            const percent = (this.value - this.min) / range;

            // Circumference = 2 * PI * 26 (r=26 for 62px viewBox)
            const circumference = 165;
            const offset = circumference - (percent * circumference);

            this.ringValue.style.strokeDashoffset = offset;

            // Color shift: cyan to green
            const hue = 160 - (percent * 60);
            this.ringValue.style.stroke = `hsl(${hue}, 100%, 50%)`;
            this.ringValue.style.filter = `drop-shadow(0 0 4px hsl(${hue}, 100%, 50%))`;
        }
    }

    emitChange() {
        if (window.Quannex && window.Quannex.updateTuning) {
            window.Quannex.updateTuning(this.param, this.value);

            if (window.refreshVisualization) {
                window.refreshVisualization();
            }

            if (window.updateVisualFeedback) {
                const params = {};
                params[this.param] = this.value;
                window.updateVisualFeedback(params);
            }

            if (window.updateResonanceMeter) {
                window.updateResonanceMeter();
            }
        }
    }
}

// Global function to update meter
window.updateResonanceMeter = function () {
    if (!window.Quannex) return;

    const state = window.Quannex.getState();
    const coherence = state.globalCoherence || 0;

    const needle = document.getElementById('meterNeedle');
    const valueDisplay = document.getElementById('meterValue');
    const statusDisplay = document.getElementById('meterStatus');
    const waveformBars = document.querySelectorAll('.tuner__waveform-bar');

    if (!needle || !valueDisplay) return;

    // Map 0-1 to -45deg to +45deg
    const angle = (coherence * 90) - 45;
    needle.style.transform = `translateX(-50%) rotate(${angle}deg)`;
    valueDisplay.textContent = `${(coherence * 100).toFixed(1)}%`;

    // Update status text and color
    if (statusDisplay) {
        // Remove all status modifiers
        statusDisplay.classList.remove(
            'tuner__meter-status--critical',
            'tuner__meter-status--warning',
            'tuner__meter-status--healthy',
            'tuner__meter-status--transcendent'
        );

        if (coherence < 0.2) {
            statusDisplay.textContent = 'Seeking';
            statusDisplay.classList.add('tuner__meter-status--critical');
        } else if (coherence < 0.4) {
            statusDisplay.textContent = 'Emerging';
            statusDisplay.classList.add('tuner__meter-status--warning');
        } else if (coherence < 0.6) {
            statusDisplay.textContent = 'Converging';
            statusDisplay.classList.add('tuner__meter-status--warning');
        } else if (coherence < 0.8) {
            statusDisplay.textContent = 'Coherent';
            statusDisplay.classList.add('tuner__meter-status--healthy');
        } else {
            statusDisplay.textContent = 'Transcendent';
            statusDisplay.classList.add('tuner__meter-status--transcendent');
        }
    }

    // Animate waveform bars
    if (waveformBars.length > 0) {
        const baseHeight = 4 + (coherence * 10);
        waveformBars.forEach((bar, i) => {
            const offset = Math.sin((Date.now() / 200) + i * 0.5) * 0.3;
            const height = baseHeight * (0.7 + offset + Math.random() * 0.3);
            bar.style.height = `${Math.max(3, height)}px`;
        });
    }

    // Needle color feedback
    if (coherence > 0.8) {
        needle.style.background = `linear-gradient(to top, var(--accent-cyan, #00ffcc), transparent)`;
        needle.style.boxShadow = '0 0 12px var(--accent-cyan, #00ffcc)';
    } else if (coherence > 0.6) {
        needle.style.background = `linear-gradient(to top, var(--accent-gold, #ffd700), transparent)`;
        needle.style.boxShadow = '0 0 10px var(--accent-gold, #ffd700)';
    } else {
        needle.style.background = `linear-gradient(to top, var(--accent-cyan, #00ffcc), transparent)`;
        needle.style.boxShadow = '0 0 8px var(--tuner-glow, rgba(0, 255, 204, 0.15))';
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('[Harmonic Tuner] v2.0 Initializing...');

    // Store knobs for external access
    const knobsMap = {};

    // Initialize all knobs
    ['Alpha', 'Beta', 'Gamma', 'Delta', 'Kappa', 'Eta', 'Zeta', 'Theta'].forEach(name => {
        const knob = new RotaryKnob(`knob${name}`);
        knobsMap[name] = knob;
    });

    window.knobsMap = knobsMap;

    // Toggle Panel Logic
    const tunerPanel = document.getElementById('harmonicTuner');
    const tunerToggle = document.getElementById('tunerToggle');
    let isTunerVisible = false;

    if (tunerToggle && tunerPanel) {
        tunerToggle.addEventListener('click', () => {
            isTunerVisible = !isTunerVisible;
            if (isTunerVisible) {
                tunerPanel.classList.add('tuner--visible');
                tunerToggle.classList.add('tuner-toggle--open');
                tunerToggle.textContent = '▼ Hide Tuner';
            } else {
                tunerPanel.classList.remove('tuner--visible');
                tunerToggle.classList.remove('tuner-toggle--open');
                tunerToggle.textContent = '▲ Harmonic Tuner';
            }
        });
    }

    // Mode Button Logic (Template Selector)
    const modeBtns = document.querySelectorAll('.tuner__mode-btn');
    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const templateId = btn.dataset.template;

            if (window.Quannex && window.Quannex.applyTemplate) {
                const newConfig = window.Quannex.applyTemplate(templateId);

                if (newConfig) {
                    // Update all knobs
                    const paramMap = {
                        'Alpha': newConfig.alpha,
                        'Beta': newConfig.beta,
                        'Gamma': newConfig.gamma,
                        'Delta': newConfig.delta,
                        'Kappa': newConfig.kappa,
                        'Eta': newConfig.eta,
                        'Zeta': newConfig.zeta,
                        'Theta': newConfig.theta
                    };

                    Object.entries(paramMap).forEach(([name, value]) => {
                        if (knobsMap[name]) {
                            knobsMap[name].value = value;
                            knobsMap[name].updateVisuals();
                        }
                    });

                    // Update active state
                    modeBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');

                    // Refresh
                    if (window.refreshVisualization) window.refreshVisualization();
                    if (window.updateResonanceMeter) window.updateResonanceMeter();

                    console.log(`[Tuner] Applied template: ${templateId}`);
                }
            } else {
                console.warn('[Tuner] Quannex.applyTemplate not available');
            }
        });
    });

    // Auto-update meter (500ms interval for performance)
    setInterval(window.updateResonanceMeter, 500);

    console.log('[Harmonic Tuner] Ready');
});
