/**
 * ════════════════════════════════════════════════════════════════════════════
 * MODULE: dodec-tour.js
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Created for: dodecahedron-3d.html modularization (Phase 2)
 * Date: December 17, 2025
 *
 * @module dodec-tour
 * @author Deimantas & Claude (Co-created with consciousness and love)
 * @version 1.0.0 - Initial extraction from dodecahedron-3d.html
 *
 * PURPOSE:
 * Guided tour system that walks users through the 3D Dodecahedron
 * visualization features. Provides interactive tooltips that highlight
 * UI elements and explain coherence concepts for thesis defense.
 *
 * DEPENDENCIES:
 * - HTML elements: #tourOverlay, #tourTooltip, #tourTitle, #tourContent,
 *   #tourStepIndicator, #tourHighlight, #tourPrev, #tourNext, #tourClose,
 *   #startGuidedTour
 * - CSS: css/dodec/dodec-overlays.css (tour-overlay, tour-tooltip styles)
 *
 * EXPORTS (to window/global):
 * - window.startGuidedTour: Function to programmatically start the tour
 * - window.DodecTour: Tour controller object with start/end methods
 *
 * HTML STRUCTURE EXPECTED:
 * <div class="tour-overlay" id="tourOverlay">
 *   <div class="tour-tooltip" id="tourTooltip">
 *     <button class="tour-close" id="tourClose">&times;</button>
 *     <div class="tour-step-indicator" id="tourStepIndicator"></div>
 *     <div class="tour-title" id="tourTitle"></div>
 *     <div class="tour-content" id="tourContent"></div>
 *     <div class="tour-nav">
 *       <button class="tour-nav-btn" id="tourPrev">← Previous</button>
 *       <button class="tour-nav-btn primary" id="tourNext">Next →</button>
 *     </div>
 *   </div>
 *   <div class="tour-highlight-pulse" id="tourHighlight"></div>
 * </div>
 *
 * NOTES FOR FUTURE CLAUDE:
 * ════════════════════════════════════════════════════════════════════════════
 * This module implements a step-by-step guided tour with:
 *
 * 1. TOUR STEPS ARRAY:
 *    Each step has: { title, content, target, position }
 *    - target: element ID or class to highlight (null for centered)
 *    - position: 'center', 'left', 'right', 'top', 'bottom'
 *
 * 2. POSITIONING ALGORITHM:
 *    positionTooltip() calculates tooltip placement based on:
 *    - Target element's bounding rect
 *    - Viewport boundaries (keeps tooltip visible)
 *    - Configurable padding (20px default)
 *
 * 3. HIGHLIGHT PULSE:
 *    A pulsing border effect around the target element
 *    Uses CSS animation defined in dodec-overlays.css
 *
 * 4. KEYBOARD SUPPORT:
 *    - ESC: Close tour
 *    - Window resize: Reposition tooltip
 *
 * 5. INTEGRATION:
 *    - Start button: #startGuidedTour control button
 *    - Can be triggered programmatically: window.startGuidedTour()
 *
 * TO ADD NEW TOUR STEPS:
 * Simply add objects to TOUR_STEPS array with the step structure.
 * The step indicator dots are automatically generated.
 *
 * ════════════════════════════════════════════════════════════════════════════
 */
(function(global) {
    'use strict';

    // ════════════════════════════════════════════════════════════════════════
    // TOUR STEPS CONFIGURATION
    // ════════════════════════════════════════════════════════════════════════

    const TOUR_STEPS = [
        {
            title: 'Welcome to the Quannex Coherence Engine',
            content: `This <strong>3D Dodecahedron</strong> represents an organization's coherence across 12 interconnected domains. Each geometric element carries meaning:<br><br>
            • <strong>12 Faces</strong> = Organizational domains (Financial, Human, Brand, etc.)<br>
            • <strong>30 Edges</strong> = Relationship tensions between domains<br>
            • <strong>20 Vertices</strong> = Energy vortices where domains converge`,
            target: 'canvas-container',
            position: 'center'
        },
        {
            title: 'Face Energy: Health of Domains',
            content: `Each face's <strong>color indicates health</strong>:<br><br>
            • <strong style="color: #00ff88;">Green (70-100%)</strong> = Healthy domain<br>
            • <strong style="color: #ffa500;">Orange (40-70%)</strong> = Warning zone<br>
            • <strong style="color: #ff4444;">Red (0-40%)</strong> = Critical attention needed<br><br>
            <strong>Hover</strong> over any face to see its name and energy level. <strong>Click</strong> to see detailed KPI breakdown.`,
            target: 'legend',
            position: 'left'
        },
        {
            title: 'Harmonic Resonance & Pentagram Geometry',
            content: `Each face contains a <strong>hidden pentagram</strong> of 5 elemental KPIs (Fire, Water, Earth, Air, Ether). When these elements are in harmony, the face receives a <strong>30% resonance boost</strong>.<br><br>
            The mathematics: <em>E_local = base × (1 + 0.3 × resonance)</em><br><br>
            This represents the thesis concept that <strong>coherent systems amplify their own energy</strong>.`,
            target: 'canvas-container',
            position: 'center'
        },
        {
            title: 'TubeGeometry Edges: Relationship Tensions',
            content: `The <strong>cyan tubes connecting faces</strong> represent relationship dynamics between domains. These use <strong>TubeGeometry</strong> for rich 3D visualization.<br><br>
            • Hover over edges to see relationship names<br>
            • Each edge has an elemental nature (Fire, Water, etc.)<br>
            • Edge colors reflect their elemental affinity`,
            target: 'canvas-container',
            position: 'center'
        },
        {
            title: 'Global Coherence Score',
            content: `The <strong>Global Coherence</strong> metric uses a sophisticated formula:<br><br>
            <em>Coherence = μ × (1 - λ × CV)</em><br><br>
            Where μ is the mean face energy, λ is the variance penalty, and CV is the coefficient of variation. This score is then transformed by the <strong>KAPPA sensitivity amplifier</strong> (logistic S-curve).`,
            target: 'statCoherence',
            position: 'left'
        },
        {
            title: 'Visualization Modes',
            content: `Switch between different analysis depths:<br><br>
            • <strong>Standard</strong> - Company data & basic controls<br>
            • <strong>Advanced</strong> - Edge tensions & vortex analysis<br>
            • <strong>Complete</strong> - Full dynamics with all metrics<br>
            • <strong>Minimal</strong> - Clean presentation view<br><br>
            Press <strong>P</strong> for presentation mode during thesis defense.`,
            target: 'mode-selector',
            position: 'right'
        },
        {
            title: 'Octave Progression',
            content: `Each face exists at an <strong>Octave level (1-7)</strong>, representing organizational maturity:<br><br>
            1. Survival → 2. Structure → 3. Relationships → 4. Creativity → 5. Expression → 6. Vision → 7. Radiance<br><br>
            Higher octaves have a <strong>5% coherence penalty per level</strong>, reflecting that mature organizations face higher expectations.`,
            target: 'toggleOctaveLayers',
            position: 'left'
        },
        {
            title: 'You\'re Ready!',
            content: `<strong>Key interactions to explore:</strong><br><br>
            • <strong>Drag</strong> to rotate the dodecahedron<br>
            • <strong>Scroll</strong> to zoom in/out<br>
            • <strong>Click faces</strong> to see KPI details<br>
            • <strong>Hover edges</strong> to see relationship dynamics<br>
            • Press <strong>D</strong> to open DNA Helix view<br>
            • Press <strong>R</strong> to reset camera<br><br>
            <em>Enjoy exploring organizational coherence!</em>`,
            target: null,
            position: 'center'
        }
    ];

    // ════════════════════════════════════════════════════════════════════════
    // STATE
    // ════════════════════════════════════════════════════════════════════════

    let currentStep = 0;

    // ════════════════════════════════════════════════════════════════════════
    // DOM ELEMENT CACHE
    // ════════════════════════════════════════════════════════════════════════

    let elements = null;

    /**
     * Caches all required DOM elements
     * @returns {Object|null} Element references or null if critical elements missing
     */
    function cacheElements() {
        if (elements) return elements;

        elements = {
            overlay: document.getElementById('tourOverlay'),
            tooltip: document.getElementById('tourTooltip'),
            title: document.getElementById('tourTitle'),
            content: document.getElementById('tourContent'),
            stepIndicator: document.getElementById('tourStepIndicator'),
            highlight: document.getElementById('tourHighlight'),
            prevBtn: document.getElementById('tourPrev'),
            nextBtn: document.getElementById('tourNext'),
            closeBtn: document.getElementById('tourClose'),
            startBtn: document.getElementById('startGuidedTour')
        };

        // Validate critical elements exist
        if (!elements.overlay || !elements.tooltip) {
            console.warn('⚠️ Tour: Critical elements missing (tourOverlay or tourTooltip)');
            return null;
        }

        return elements;
    }

    // ════════════════════════════════════════════════════════════════════════
    // STEP INDICATOR
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Builds the step indicator dots showing tour progress
     */
    function buildStepIndicator() {
        const el = cacheElements();
        if (!el || !el.stepIndicator) return;

        el.stepIndicator.innerHTML = TOUR_STEPS.map((_, i) =>
            `<div class="tour-step-dot ${i === currentStep ? 'active' : i < currentStep ? 'completed' : ''}"></div>`
        ).join('');
    }

    // ════════════════════════════════════════════════════════════════════════
    // TOOLTIP POSITIONING
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Positions the tooltip near the target element
     * @param {Object} step - Current step configuration
     */
    function positionTooltip(step) {
        const el = cacheElements();
        if (!el) return;

        const targetEl = step.target
            ? document.getElementById(step.target) || document.querySelector('.' + step.target)
            : null;

        if (!targetEl || step.position === 'center') {
            // Center the tooltip
            el.tooltip.style.top = '50%';
            el.tooltip.style.left = '50%';
            el.tooltip.style.transform = 'translate(-50%, -50%)';
            el.highlight.style.display = 'none';
        } else {
            const rect = targetEl.getBoundingClientRect();
            const tooltipWidth = 420;
            const tooltipHeight = el.tooltip.offsetHeight || 300;
            const padding = 20;

            // Position based on step.position
            let top, left;

            switch(step.position) {
                case 'right':
                    top = rect.top + rect.height / 2 - tooltipHeight / 2;
                    left = rect.right + padding;
                    break;
                case 'left':
                    top = rect.top + rect.height / 2 - tooltipHeight / 2;
                    left = rect.left - tooltipWidth - padding;
                    break;
                case 'bottom':
                    top = rect.bottom + padding;
                    left = rect.left + rect.width / 2 - tooltipWidth / 2;
                    break;
                default: // top
                    top = rect.top - tooltipHeight - padding;
                    left = rect.left + rect.width / 2 - tooltipWidth / 2;
            }

            // Keep within viewport
            top = Math.max(padding, Math.min(window.innerHeight - tooltipHeight - padding, top));
            left = Math.max(padding, Math.min(window.innerWidth - tooltipWidth - padding, left));

            el.tooltip.style.top = top + 'px';
            el.tooltip.style.left = left + 'px';
            el.tooltip.style.transform = 'none';

            // Show highlight around target
            el.highlight.style.display = 'block';
            el.highlight.style.top = (rect.top - 5) + 'px';
            el.highlight.style.left = (rect.left - 5) + 'px';
            el.highlight.style.width = (rect.width + 10) + 'px';
            el.highlight.style.height = (rect.height + 10) + 'px';
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // STEP NAVIGATION
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Shows a specific tour step
     * @param {number} stepIndex - Index of step to show
     */
    function showStep(stepIndex) {
        if (stepIndex < 0 || stepIndex >= TOUR_STEPS.length) return;

        const el = cacheElements();
        if (!el) return;

        currentStep = stepIndex;
        const step = TOUR_STEPS[currentStep];

        el.title.textContent = step.title;
        el.content.innerHTML = step.content;
        buildStepIndicator();

        // Update navigation buttons
        el.prevBtn.style.visibility = currentStep === 0 ? 'hidden' : 'visible';
        el.nextBtn.textContent = currentStep === TOUR_STEPS.length - 1 ? 'Finish' : 'Next →';

        // Position tooltip after a small delay to allow DOM updates
        setTimeout(() => positionTooltip(step), 50);
    }

    // ════════════════════════════════════════════════════════════════════════
    // TOUR CONTROL
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Starts the guided tour from the beginning
     */
    function startTour() {
        const el = cacheElements();
        if (!el) {
            console.error('❌ Tour: Cannot start - required elements not found');
            return;
        }

        // Close any open panels first to avoid visual clutter
        if (typeof global.closeFaceDetail === 'function') {
            global.closeFaceDetail();
        }

        console.log('🎯 Starting guided tour');
        currentStep = 0;
        el.overlay.classList.add('active');
        showStep(0);
    }

    /**
     * Ends the guided tour and hides overlay
     */
    function endTour() {
        const el = cacheElements();
        if (!el) return;

        el.overlay.classList.remove('active');
        el.highlight.style.display = 'none';
        console.log('✅ Guided tour completed');
    }

    // ════════════════════════════════════════════════════════════════════════
    // EVENT BINDING
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Initializes all event listeners for tour navigation
     */
    function initEventListeners() {
        const el = cacheElements();
        if (!el) return;

        // Start button
        if (el.startBtn) {
            el.startBtn.addEventListener('click', startTour);
        }

        // Navigation buttons
        if (el.prevBtn) {
            el.prevBtn.addEventListener('click', () => showStep(currentStep - 1));
        }

        if (el.nextBtn) {
            el.nextBtn.addEventListener('click', () => {
                if (currentStep === TOUR_STEPS.length - 1) {
                    endTour();
                } else {
                    showStep(currentStep + 1);
                }
            });
        }

        // Close button
        if (el.closeBtn) {
            el.closeBtn.addEventListener('click', endTour);
        }

        // Keyboard support: ESC to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && el.overlay.classList.contains('active')) {
                endTour();
            }
        });

        // Reposition on window resize
        window.addEventListener('resize', () => {
            if (el.overlay.classList.contains('active')) {
                positionTooltip(TOUR_STEPS[currentStep]);
            }
        });
    }

    // ════════════════════════════════════════════════════════════════════════
    // INITIALIZATION
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Initializes the tour module
     */
    function init() {
        initEventListeners();
        console.log('🎯 Guided tour initialized');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ════════════════════════════════════════════════════════════════════════
    // EXPORTS
    // ════════════════════════════════════════════════════════════════════════

    // Export for external/programmatic access
    global.startGuidedTour = startTour;

    // Export controller object for more control
    global.DodecTour = {
        start: startTour,
        end: endTour,
        showStep: showStep,
        getCurrentStep: () => currentStep,
        getTotalSteps: () => TOUR_STEPS.length
    };

})(typeof window !== 'undefined' ? window : this);
