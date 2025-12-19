/**
 * ════════════════════════════════════════════════════════════════════════════
 * OCTAVE DNA - BREATH ANALYSIS TAB
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Generates and displays the breath analysis content for the diagnostic panel.
 * Shows φ-normalized breath ratio, strand energies, and dimensional progression.
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                        NOTES FOR FUTURE CLAUDE                          │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * BREATH RATIO MATHEMATICS:
 * ─────────────────────────────────────────────────────────────────────────
 * The φ-normalized logarithmic breath ratio:
 *
 *   BR = log(reception / projection) / log(φ)
 *
 * Interpretation:
 *   • BR = 0: Perfect balance (ratio = 1.0)
 *   • BR > 0: Over-inhaling (reception > projection)
 *   • BR < 0: Over-exhaling (projection > reception)
 *   • |BR| <= φ^-2 (0.382): Balanced zone
 *
 * STRAND DISPLAY:
 * ─────────────────────────────────────────────────────────────────────────
 * Each helix has two strands:
 *   • faces[0] = Projection (Exhale) - Energy going out
 *   • faces[1] = Reception (Inhale) - Energy coming in
 *
 * Side-by-side cards show energy %, octave level, and next threshold.
 *
 * DIMENSIONAL PROGRESSION:
 * ─────────────────────────────────────────────────────────────────────────
 * Visual dots showing 7 octave levels for each strand:
 *   • reached: Solid glow (octave attained)
 *   • not-yet: Dim (next target)
 *   • blocked: Red (foundation weak, can't skip ahead)
 *   • aspirational: Purple (too far ahead to consider now)
 *
 * NAVIGATION MAP:
 * ─────────────────────────────────────────────────────────────────────────
 * ├─ DEPENDS ON:
 * │  ├─ OctaveDNAState (facesData)
 * │  └─ OctaveDNAHelpers (PHI, getFaceEnergy, getCurrentOctave, etc.)
 * │
 * └─ USED BY:
 *    └─ diagnostic-panel.js (calls updateBreathTab)
 *
 * ════════════════════════════════════════════════════════════════════════════
 * @version 1.0.0 - Extracted from octave-dna.html monolith
 * @created 2025-12-19
 */

(function() {
    'use strict';

    // ════════════════════════════════════════════════════════════════════════
    // BREATH TAB CONTENT GENERATION
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Update the breath tab with helix data
     *
     * @param {Object} helix - The helix configuration object
     */
    function updateBreathTab(helix) {
        const breathTab = document.getElementById('breathTab');
        const Helpers = window.OctaveDNAHelpers;

        if (!breathTab || !Helpers) {
            console.warn('⚠️ [Breath Tab] Missing elements or helpers');
            return;
        }

        // Get energies for both faces
        const energy1 = Helpers.getFaceEnergy(helix.faces[0]); // Projection
        const energy2 = Helpers.getFaceEnergy(helix.faces[1]); // Reception

        // Calculate φ-normalized breath ratio
        const breathRatio = Helpers.calculatePhiBreathRatio(energy1, energy2);
        const isBalanced = Helpers.isBreathBalanced(breathRatio);
        const breathStatus = Helpers.getBreathStatus(breathRatio);

        // Get octave info for each face
        const face1Octave = Helpers.getCurrentOctave(helix.faces[0]);
        const face2Octave = Helpers.getCurrentOctave(helix.faces[1]);
        const face1Info = Helpers.getOctaveInfo(face1Octave);
        const face2Info = Helpers.getOctaveInfo(face2Octave);
        const face1NextThreshold = Helpers.getNextOctaveThreshold(face1Octave);
        const face2NextThreshold = Helpers.getNextOctaveThreshold(face2Octave);

        // Calculate octave spread
        const minOctave = Math.min(face1Octave, face2Octave);
        const maxOctave = Math.max(face1Octave, face2Octave);
        const octaveSpread = maxOctave - minOctave;

        // Generate insight
        const insight = generateInsight(helix, breathRatio, energy1, energy2);

        // Convert color
        const colorHex = Helpers.colorToHex(helix.color);

        // Build HTML content
        breathTab.innerHTML = buildBreathTabHTML({
            helix,
            energy1,
            energy2,
            breathRatio,
            isBalanced,
            breathStatus,
            face1Octave,
            face2Octave,
            face1Info,
            face2Info,
            face1NextThreshold,
            face2NextThreshold,
            octaveSpread,
            minOctave,
            maxOctave,
            insight,
            colorHex
        });

        console.log(`🌬️ [Breath Tab] Updated for ${helix.name} (BR: ${breathRatio.toFixed(3)})`);
    }

    /**
     * Build the breath tab HTML content
     *
     * @param {Object} data - All the calculated breath data
     * @returns {string} HTML string
     */
    function buildBreathTabHTML(data) {
        const {
            helix, energy1, energy2, breathRatio, isBalanced, breathStatus,
            face1Octave, face2Octave, face1Info, face2Info,
            face1NextThreshold, face2NextThreshold,
            octaveSpread, minOctave, maxOctave, insight, colorHex
        } = data;

        const balanceColor = isBalanced ? '#00ff66' : '#ff6666';
        const balanceBg = isBalanced ? 'rgba(0,255,102,0.2)' : 'rgba(255,102,102,0.2)';

        return `
            <!-- Breath Ratio -->
            <div class="breath-ratio" style="border-color: ${balanceColor}">
                <div class="ratio-label">Breath Ratio (Φ-Balanced)</div>
                <div class="ratio-value" style="color: ${balanceColor}">
                    ${breathRatio.toFixed(3)}
                </div>
                <div class="ratio-status" style="background: ${balanceBg}; color: ${balanceColor}">
                    ${breathStatus}
                </div>
            </div>

            <!-- Side-by-Side Strands -->
            <div class="strands-container">
                <!-- Strand 1 (Projection) -->
                ${buildStrandCard({
                    label: '↗ Projection (Exhale)',
                    name: helix.names[0],
                    faceId: helix.faces[0],
                    energy: energy1,
                    octave: face1Octave,
                    octaveInfo: face1Info,
                    nextThreshold: face1NextThreshold,
                    colorHex
                })}

                <!-- Strand 2 (Reception) -->
                ${buildStrandCard({
                    label: '↙ Reception (Inhale)',
                    name: helix.names[1],
                    faceId: helix.faces[1],
                    energy: energy2,
                    octave: face2Octave,
                    octaveInfo: face2Info,
                    nextThreshold: face2NextThreshold,
                    colorHex
                })}
            </div>

            <!-- Enhanced Dimensional Progression -->
            <div class="dimensional-section">
                <div class="dimensional-title">Dimensional Progression</div>

                ${buildOctaveRow(helix.names[0], helix.faces[0], face1Octave)}
                ${buildOctaveRow(helix.names[1], helix.faces[1], face2Octave)}

                <!-- Octave Spread Indicator -->
                <div class="spread-indicator">
                    <span>Octave Spread:</span>
                    <span class="spread-value ${octaveSpread <= 1 ? 'spread-healthy' : octaveSpread <= 2 ? 'spread-warning' : 'spread-critical'}">
                        ${octaveSpread} octave${octaveSpread !== 1 ? 's' : ''}
                    </span>
                    <span style="flex: 1; text-align: right;">
                        ${octaveSpread <= 1 ? 'Aligned' : octaveSpread <= 2 ? 'Minor gap' : 'Structural gap'}
                    </span>
                </div>

                ${octaveSpread > 2 ? '<div class="foundation-warning"><span class="foundation-warning-icon">⚠️</span>Foundation Principle: Large octave gaps indicate uneven development. Focus on strengthening the lagging face before advancing further.</div>' : ''}

                ${(minOctave === 1 && maxOctave >= 4) ? '<div class="foundation-warning" style="margin-top: 8px;"><span class="foundation-warning-icon">🏗️</span>One strand at O1 (Survival) while the other is at O' + maxOctave + '. Stabilize the foundation first.</div>' : ''}

                <!-- Legend -->
                <div class="octave-legend">
                    <div class="legend-item"><div class="legend-dot reached"></div> Reached</div>
                    <div class="legend-item"><div class="legend-dot not-yet"></div> Not Yet</div>
                    <div class="legend-item"><div class="legend-dot blocked"></div> Blocked</div>
                    <div class="legend-item"><div class="legend-dot aspirational"></div> Aspirational</div>
                </div>
            </div>

            <!-- Elegant Insight Card -->
            <div class="insight-card">
                <div class="insight-title">✨ Coherence Insight</div>
                <div class="insight-text">${insight}</div>
            </div>
        `;
    }

    /**
     * Build HTML for a single strand card
     *
     * @param {Object} strand - Strand data
     * @returns {string} HTML string
     */
    function buildStrandCard(strand) {
        const { label, name, faceId, energy, octave, octaveInfo, nextThreshold, colorHex } = strand;

        return `
            <div class="strand-card">
                <div class="strand-label">${label}</div>
                <div class="strand-name" style="color: ${colorHex}">${name}</div>
                <div class="strand-id">Face ${faceId}</div>
                <div class="energy-display" style="color: ${colorHex}">
                    ${(energy * 100).toFixed(1)}%
                </div>
                <div class="energy-bar">
                    <div class="energy-fill" style="width: ${energy * 100}%; background: linear-gradient(90deg, ${colorHex}, ${colorHex}88);"></div>
                </div>
                <div style="font-size: 10px; color: rgba(255,255,255,0.6); margin-top: 6px;">
                    <span class="face-octave-badge" style="background: ${octaveInfo.color}22; color: ${octaveInfo.color}; border: 1px solid ${octaveInfo.color}44;">
                        O${octave} ${octaveInfo.name}
                    </span>
                </div>
                <div style="font-size: 9px; color: rgba(255,255,255,0.4); margin-top: 4px;">
                    Next: O${octave + 1} @ ${(nextThreshold * 100).toFixed(1)}%
                </div>
            </div>
        `;
    }

    /**
     * Build octave progression row for a face
     *
     * @param {string} faceName - Display name
     * @param {number} faceId - Face ID
     * @param {number} faceOctave - Current octave
     * @returns {string} HTML string
     */
    function buildOctaveRow(faceName, faceId, faceOctave) {
        const Helpers = window.OctaveDNAHelpers;

        const dots = [1, 2, 3, 4, 5, 6, 7].map(oct => {
            const reached = Helpers.isOctaveReached(faceId, oct);
            const octInfo = Helpers.getOctaveInfo(oct);

            let stateClass = 'not-yet';
            if (reached) {
                stateClass = 'reached';
            } else if (oct > faceOctave + 2 && faceOctave <= 2) {
                stateClass = 'blocked'; // Foundation weak
            } else if (oct > faceOctave + 3) {
                stateClass = 'aspirational'; // Too far ahead
            }

            return `<div class="octave-dot ${stateClass}" title="O${oct}: ${octInfo.name} (${(octInfo.threshold * 100).toFixed(1)}%)"></div>`;
        }).join('');

        return `
            <div class="face-octave-row">
                <div class="face-octave-label">${faceName}</div>
                <div class="per-face-dots">${dots}</div>
            </div>
        `;
    }

    // ════════════════════════════════════════════════════════════════════════
    // INSIGHT GENERATION
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Generate an elegant insight based on φ-logarithmic breath ratio
     *
     * @param {Object} helix - Helix configuration
     * @param {number} ratio - Breath ratio
     * @param {number} energy1 - Projection energy
     * @param {number} energy2 - Reception energy
     * @returns {string} Insight text
     */
    function generateInsight(helix, ratio, energy1, energy2) {
        const Helpers = window.OctaveDNAHelpers;
        const PHI_INV_2 = Helpers?.PHI_INV_2 || 0.381966011250105;
        const absRatio = Math.abs(ratio);

        if (absRatio <= PHI_INV_2) {
            // Balanced (within φ^-2 threshold)
            return `Perfect harmony detected. This axis demonstrates the Golden Ratio principle: balanced flow creates exponential coherence. Both strands are breathing in unison—a rare state of organizational resonance.`;
        } else if (ratio < 0) {
            // Over-exhaling (projection > reception)
            return `Over-projection detected. ${helix.names[0]} is exhausting energy faster than ${helix.names[1]} can receive and ground it. Consider pausing expansion to strengthen foundations—the Fibonacci sequence teaches us that growth requires proper spacing.`;
        } else if (ratio > 0) {
            // Over-inhaling (reception > projection)
            return `Under-projection detected. ${helix.names[1]} has capacity that ${helix.names[0]} isn't utilizing. This is untapped potential—like a coiled spring waiting to release. Channel this receptive energy into focused action.`;
        } else {
            return `Mild imbalance detected. The system is self-correcting but could benefit from conscious attention. Like a DNA helix, organizational health requires both strands to spiral in proportion—neither too tight nor too loose.`;
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // BROWSER GLOBAL EXPORT
    // ════════════════════════════════════════════════════════════════════════

    if (typeof window !== 'undefined') {
        window.OctaveDNABreathTab = {
            updateBreathTab,
            buildBreathTabHTML,
            buildStrandCard,
            buildOctaveRow,
            generateInsight
        };

        console.log('🌬️ [OctaveDNA Breath Tab] Module loaded');
    }

})();
