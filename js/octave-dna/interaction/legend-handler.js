/**
 * ════════════════════════════════════════════════════════════════════════════
 * OCTAVE DNA - LEGEND HANDLER
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Handles the side legend panel that lists all 6 breath axes.
 * Clicking a legend item selects the corresponding helix.
 * Hovering shows tooltip with breath questions.
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                        NOTES FOR FUTURE CLAUDE                          │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * LEGEND STRUCTURE:
 * ─────────────────────────────────────────────────────────────────────────
 * The legend is a vertical list of 6 helix items, each showing:
 *   • Helix name (e.g., "Resource Flow")
 *   • Confidence badge (●●● for fixed pairings)
 *   • Face pairing (e.g., "Funding Pipeline → Financial Capital")
 *   • Breath name (if available from mapping context)
 *
 * TOOLTIP SYSTEM:
 * ─────────────────────────────────────────────────────────────────────────
 * Hovering over a legend item shows a tooltip with:
 *   • Breath name ("The Flow of Resources")
 *   • Projection question
 *   • Reception question
 *
 * The tooltip follows the mouse and stays within viewport bounds.
 *
 * DATA FLOW:
 * ─────────────────────────────────────────────────────────────────────────
 * Legend items are dynamically generated from DNA_HELICES config.
 * Each item has data attributes storing breath questions:
 *   • data-helix: Helix ID
 *   • data-breath-name: Custom breath name
 *   • data-projection-q: Projection question text
 *   • data-reception-q: Reception question text
 *
 * NAVIGATION MAP:
 * ─────────────────────────────────────────────────────────────────────────
 * ├─ DEPENDS ON:
 * │  ├─ OctaveDNAState (dnaHelices configuration)
 * │  └─ OctaveDNAMouse.selectHelix()
 * │
 * └─ USED BY:
 *    └─ octave-dna-main.js (calls updateLegend after data load)
 *
 * ════════════════════════════════════════════════════════════════════════════
 * @version 1.0.0 - Extracted from octave-dna.html monolith
 * @created 2025-12-19
 */

(function () {
    'use strict';

    // Tooltip element reference
    let breathTooltip = null;

    // ════════════════════════════════════════════════════════════════════════
    // LEGEND RENDERING
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Update the legend panel with current helix configurations
     *
     * This should be called after DNA_HELICES is updated (company switch,
     * custom data load, etc.) to reflect the current breath axis mappings.
     */
    function updateLegend() {
        const State = window.OctaveDNAState;
        const Helpers = window.OctaveDNAHelpers;

        if (!State) return;

        const legendContainer = document.querySelector('.legend');
        if (!legendContainer) {
            Logger.warn('OctaveDNA', 'Legend container not found');
            return;
        }

        // Get helix configurations
        const dnaHelices = State.getState('dnaHelices') || State._state?.dnaHelices || [];

        // Build legend HTML
        const legendHtml = `
            <div class="legend-title">Six Breath Axes</div>
            ${dnaHelices.map((helix, index) => {
            const colorHex = Helpers?.colorToHex(helix.color) || '#' + helix.color.toString(16).padStart(6, '0');

            // Confidence badge (●●● for high, ●●○ for medium, ●○○ for low)
            const confidenceBadge = helix.confidence ?
                `<span style="font-size: 9px; opacity: 0.6;">${helix.confidence === 'high' ? '●●●' :
                    helix.confidence === 'medium' ? '●●○' : '●○○'
                }</span>` : '';

            // Breath name display (if available from mapping context)
            const breathNameHtml = helix.breathName ?
                `<div class="breath-name">"${helix.breathName}"</div>` : '';

            return `
                    <div class="helix-item" style="border-color: ${colorHex};" data-helix="${helix.id}"
                         data-breath-name="${helix.breathName || ''}"
                         data-projection-q="${helix.projectionQuestion || ''}"
                         data-reception-q="${helix.receptionQuestion || ''}">
                        <div class="helix-name" style="color: ${colorHex};">
                            ${helix.name} ${confidenceBadge}
                        </div>
                        <div class="helix-faces">
                            ${helix.names[0]} → ${helix.names[1]}
                        </div>
                        ${breathNameHtml}
                    </div>
                `;
        }).join('')}
        `;

        legendContainer.innerHTML = legendHtml;

        // Attach event handlers
        attachLegendHandlers();

        Logger.info('OctaveDNA', `Legend updated with ${dnaHelices.length} breath axes`);
    }

    /**
     * Attach click and hover handlers to legend items
     */
    function attachLegendHandlers() {
        const State = window.OctaveDNAState;
        const Mouse = window.OctaveDNAMouse;

        document.querySelectorAll('.helix-item').forEach(item => {
            // Click handler - select helix
            item.addEventListener('click', () => {
                const helixId = parseInt(item.dataset.helix);
                const dnaHelices = State?.getState('dnaHelices') || State?._state?.dnaHelices || [];
                const helix = dnaHelices.find(h => h.id === helixId);

                if (helix && Mouse?.selectHelix) {
                    Mouse.selectHelix(helix);
                }
            });

            // Hover handlers for tooltip
            const projectionQ = item.dataset.projectionQ;
            const receptionQ = item.dataset.receptionQ;
            const breathName = item.dataset.breathName;

            if (projectionQ || receptionQ) {
                item.addEventListener('mouseenter', (e) => {
                    showBreathTooltip(e, breathName, projectionQ, receptionQ);
                });
                item.addEventListener('mouseleave', () => {
                    hideBreathTooltip();
                });
                item.addEventListener('mousemove', (e) => {
                    moveBreathTooltip(e);
                });
            }
        });
    }

    // ════════════════════════════════════════════════════════════════════════
    // TOOLTIP SYSTEM
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Show breath tooltip with questions
     *
     * @param {MouseEvent} e - Mouse event for positioning
     * @param {string} breathName - Custom breath name
     * @param {string} projectionQ - Projection question text
     * @param {string} receptionQ - Reception question text
     */
    function showBreathTooltip(e, breathName, projectionQ, receptionQ) {
        // Create tooltip element if needed
        if (!breathTooltip) {
            breathTooltip = document.createElement('div');
            breathTooltip.className = 'helix-tooltip';
            document.body.appendChild(breathTooltip);
        }

        // Build tooltip content
        let tooltipHtml = '';
        if (breathName) {
            tooltipHtml += `<div class="helix-tooltip-title">"${breathName}"</div>`;
        }
        if (projectionQ) {
            tooltipHtml += `<div class="helix-tooltip-question"><strong>Projection:</strong> ${projectionQ}</div>`;
        }
        if (receptionQ) {
            tooltipHtml += `<div class="helix-tooltip-question"><strong>Reception:</strong> ${receptionQ}</div>`;
        }

        breathTooltip.innerHTML = tooltipHtml;

        // Position tooltip near mouse
        breathTooltip.style.left = `${e.clientX + 15}px`;
        breathTooltip.style.top = `${e.clientY + 10}px`;

        // Ensure tooltip stays within viewport
        requestAnimationFrame(() => {
            if (!breathTooltip) return;

            const rect = breathTooltip.getBoundingClientRect();

            // Adjust horizontal position if overflowing right
            if (rect.right > window.innerWidth) {
                breathTooltip.style.left = `${e.clientX - rect.width - 15}px`;
            }

            // Adjust vertical position if overflowing bottom
            if (rect.bottom > window.innerHeight) {
                breathTooltip.style.top = `${e.clientY - rect.height - 10}px`;
            }

            // Show with animation
            breathTooltip.classList.add('visible');
        });
    }

    /**
     * Move tooltip to follow mouse
     *
     * @param {MouseEvent} e - Mouse event
     */
    function moveBreathTooltip(e) {
        if (breathTooltip) {
            breathTooltip.style.left = `${e.clientX + 15}px`;
            breathTooltip.style.top = `${e.clientY + 10}px`;
        }
    }

    /**
     * Hide and cleanup tooltip
     */
    function hideBreathTooltip() {
        if (breathTooltip) {
            breathTooltip.classList.remove('visible');
        }
    }

    /**
     * Destroy tooltip element
     */
    function destroyTooltip() {
        if (breathTooltip && breathTooltip.parentNode) {
            breathTooltip.parentNode.removeChild(breathTooltip);
            breathTooltip = null;
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // BROWSER GLOBAL EXPORT
    // ════════════════════════════════════════════════════════════════════════

    if (typeof window !== 'undefined') {
        window.OctaveDNALegend = {
            updateLegend,
            attachLegendHandlers,
            showBreathTooltip,
            moveBreathTooltip,
            hideBreathTooltip,
            destroyTooltip
        };

        Logger.debug('OctaveDNA', 'Legend handler loaded');
    }

})();
