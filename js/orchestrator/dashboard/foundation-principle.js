/**
 * ═══════════════════════════════════════════════════════════════════════════
 * @module dashboard/foundation-principle
 * @description Foundation Principle warning display for structural integrity
 * @version 1.0.0
 * @since Session 5 Modularization (December 2025)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                        NOTES FOR FUTURE CLAUDE                         │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * Welcome, future self! This module handles the Foundation Principle warnings
 * that appear in the Octave Dashboard. The Foundation Principle is a core
 * concept: organizations cannot skip developmental stages.
 *
 * WHAT THIS MODULE DOES:
 * - Displays warnings about structural misalignment between faces
 * - Shows octave spread (how far apart min/max face octaves are)
 * - Shows penalties applied to the geometric mean
 * - Provides specific recommendations for structural issues
 * - Shows octave distribution across all 12 faces
 *
 * WHY IT EXISTS:
 * - Extracted from orchestrator-dashboard.js (Session 5) for clarity
 * - Single responsibility: structural integrity warnings
 * - Enables independent testing and maintenance
 *
 * KEY CONCEPTS TO UNDERSTAND:
 * - Foundation Principle: You can't build O7 on O2 foundations
 * - Octave Spread: Difference between highest and lowest face octaves
 * - Structural Misalignment: When some faces are far ahead of others
 * - Aspirational Outliers: Faces that have outpaced structural support
 *
 * QUICK NAVIGATION:
 * - Section 1: Imports & Dependencies
 * - Section 2: Warning Display Constants
 * - Section 3: Warning Display Function
 * - Section 4: Exports
 *
 * DEPENDENCY MAP:
 * ┌────────────────────────────────┐
 * │ OctaveIntegrityCalculator      │ (provides integrityResult)
 * │ (octave-integrity-calculator.js)│
 * └────────────┬───────────────────┘
 *              ↓
 * ┌──────────────────┐
 * │  THIS MODULE     │ ← You are here
 * └────────┬─────────┘
 *          ↓
 * ┌────────────────────────────┐
 * │ orchestrator-dashboard.js  │ (calls displayFoundationPrincipleWarnings)
 * └────────────────────────────┘
 *
 * DOM ELEMENTS REQUIRED:
 * ┌────────────────────────────────────┬─────────────────────────────────────┐
 * │ Element ID                         │ Purpose                             │
 * ├────────────────────────────────────┼─────────────────────────────────────┤
 * │ #foundation-principle-warnings     │ Container for warning messages      │
 * │ #octave-progress-fill (fallback)   │ Used to find insertion point        │
 * └────────────────────────────────────┴─────────────────────────────────────┘
 *
 * RISK DOCUMENTATION:
 * ⚠️ Dynamically creates container if not found in DOM
 * ⚠️ Depends on integrityResult structure from OctaveIntegrityCalculator
 * ⚠️ If integrityResult is null, clears all warnings (safe behavior)
 *
 * TESTING:
 * - With spread <= 2: Should show green checkmark (healthy)
 * - With spread 3-4: Should show orange chart (developing gap)
 * - With spread > 4: Should show red warning triangle (critical)
 * - With penalty > 0: Should show penalty info bar
 *
 * ═══════════════════════════════════════════════════════════════════════════
 */

(function(global) {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════
    // SECTION 1: IMPORTS & DEPENDENCIES
    // ═══════════════════════════════════════════════════════════════════════
    //
    // This module depends on:
    //   - integrityResult from OctaveIntegrityCalculator (passed as parameter)
    //
    // The integrityResult object should contain:
    //   - spread: Number of octaves between min and max face
    //   - penalty: Octave penalty applied (0 if none)
    //   - geoMean: Geometric mean before penalty
    //   - warnings: Array of warning objects
    //   - breakdown: { min, max, distribution }
    //
    // ═══════════════════════════════════════════════════════════════════════

    // ═══════════════════════════════════════════════════════════════════════
    // SECTION 1B: PHILOSOPHICAL FOUNDATIONS - WHY FOUNDATIONS MATTER
    // ═══════════════════════════════════════════════════════════════════════
    //
    // ┌─────────────────────────────────────────────────────────────────────┐
    // │  "You cannot build a cathedral on quicksand.                       │
    // │   You cannot reach O7 Radiance on O2 foundations."                 │
    // └─────────────────────────────────────────────────────────────────────┘
    //
    // THE FOUNDATION PRINCIPLE
    // ─────────────────────────────────────────────────────────────────────
    // This is perhaps the most important insight in the Quannex system:
    // Organizations cannot sustainably skip developmental stages.
    //
    // Imagine a child who learns calculus before learning to add. They
    // might produce correct answers sometimes, but they lack the deep
    // understanding that comes from building knowledge layer by layer.
    // When faced with a novel problem, they collapse.
    //
    // Organizations work the same way:
    //   • A company at O5 (Expression) with O2 (Structure) foundations
    //     will eventually face crises that overwhelm their unstable base.
    //   • A team claiming O6 (Vision) while neglecting O1 (Survival)
    //     questions will find their vision disconnected from reality.
    //
    // WHY SPREAD MATTERS
    // ─────────────────────────────────────────────────────────────────────
    // The "spread" measures how many octaves separate your highest and
    // lowest scoring faces. A spread of 2 is healthy - natural variation.
    // A spread of 5+ is critical - something is deeply misaligned.
    //
    // Large spreads indicate:
    //   • "Aspirational outliers" - faces that have outpaced their support
    //   • "Neglected foundations" - faces stuck in survival mode
    //   • Structural instability that will eventually cause collapse
    //
    // The system applies penalties to geometric mean based on spread,
    // because a 70% coherence with even distribution is healthier than
    // 70% coherence with some faces at O6 and others at O2.
    //
    // THIS IS NOT PUNISHMENT
    // ─────────────────────────────────────────────────────────────────────
    // The warnings displayed by this module are not criticisms. They are
    // gifts - visibility into structural patterns that might otherwise
    // remain hidden until crisis reveals them.
    //
    // Every warning comes with guidance. The system doesn't just say
    // "you have a problem" - it shows WHERE the misalignment exists and
    // WHAT can be done to strengthen foundations.
    //
    // The goal is integration, not perfection. An organization that
    // consciously slows an advanced face to strengthen foundations is
    // wiser than one that ignores the warning signs.
    //
    // THE GEOMETRIC MEAN WISDOM
    // ─────────────────────────────────────────────────────────────────────
    // We use geometric mean (not arithmetic mean) for face coherence
    // because it better reflects structural integrity. In geometric mean,
    // one very low score pulls down the overall more than in arithmetic.
    //
    // This is intentional: a chain is only as strong as its weakest link.
    // An organization with eleven O5 faces and one O1 face is NOT an O5
    // organization. The geometric mean reveals this truth mathematically.
    //
    // ═══════════════════════════════════════════════════════════════════════

    // ═══════════════════════════════════════════════════════════════════════
    // SECTION 2: WARNING DISPLAY CONSTANTS
    // ═══════════════════════════════════════════════════════════════════════
    //
    // PURPOSE: Define colors and icons for different severity levels
    //
    // SEVERITY LEVELS:
    //   Healthy (spread <= 2): Green - Organization is well-aligned
    //   Warning (spread 3-4): Orange - Some faces developing faster
    //   Critical (spread > 4): Red - Foundations need strengthening
    //
    // PHILOSOPHY:
    // The Foundation Principle teaches that organizations cannot sustainably
    // operate at higher octaves without solid foundations. If Face A is at O6
    // while Face B is at O2, the organization is structurally unstable.
    //
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Color constants for warning severity levels
     * @constant {Object}
     * @private
     */
    const WARNING_COLORS = {
        CRITICAL: '#ff6b6b',   // Red - immediate attention needed
        WARNING: '#ffa94d',    // Orange - developing concern
        HEALTHY: '#69db7c'     // Green - well-aligned
    };

    /**
     * HTML entity icons for warning types
     * @constant {Object}
     * @private
     */
    const WARNING_ICONS = {
        TRIANGLE: '&#9888;',   // ⚠ Warning triangle
        CHART: '&#128202;',    // 📊 Chart
        CHECK: '&#10004;',     // ✔ Checkmark
        SIREN: '&#128680;',    // 🚨 Siren
        ZAP: '&#9889;',        // ⚡ Lightning bolt
        TREND: '&#128201;'     // 📉 Trend chart
    };

    // ═══════════════════════════════════════════════════════════════════════
    // SECTION 3: WARNING DISPLAY FUNCTION
    // ═══════════════════════════════════════════════════════════════════════
    //
    // PURPOSE: Render Foundation Principle warnings to the DOM
    //
    // CALL SITE:
    //   - orchestrator-dashboard.js: initializeOctaveDashboard() calls this
    //
    // FLOW:
    //   1. Find or create warning container
    //   2. If no integrityResult, clear warnings and return
    //   3. Build spread warning HTML (if spread > 0)
    //   4. Build penalty info HTML (if penalty > 0)
    //   5. Build specific warnings HTML (structural/aspirational)
    //   6. Build octave distribution HTML (if multiple octaves)
    //   7. Insert all HTML into container
    //
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Display Foundation Principle warnings in the Octave Dashboard
     *
     * Shows spread warnings, structural misalignment alerts, and recommendations.
     * Creates or updates a warning container that appears below the octave
     * progress bar.
     *
     * ┌─────────────────────────────────────────────────────────────────────┐
     * │ PHILOSOPHY: The Foundation Principle is about structural integrity.│
     * │ An organization with Face 1 at O6 and Face 12 at O2 is unstable.   │
     * │ These warnings help users understand where to focus their energy.  │
     * └─────────────────────────────────────────────────────────────────────┘
     *
     * Warning severity color coding:
     *   - Green: Healthy variance (spread <= 2)
     *   - Orange: Developing gap (spread 3-4)
     *   - Red: Critical misalignment (spread > 4)
     *
     * @param {Object|null} integrityResult - Result from OctaveIntegrityCalculator
     *   - spread: {number} Octave spread between min/max faces
     *   - penalty: {number} Octave penalty applied
     *   - geoMean: {number} Geometric mean before penalty
     *   - warnings: {Array} Array of warning objects
     *   - breakdown: {Object} { min, max, distribution }
     * @param {string} octaveColor - Current octave's theme color (reserved for future)
     *
     * @returns {void}
     *
     * @example
     * // Called from initializeOctaveDashboard
     * const integrityResult = OctaveIntegrityCalculator.calculate(faceOctaves);
     * displayFoundationPrincipleWarnings(integrityResult, octaveData.color);
     *
     * @example
     * // Clear warnings when no integrity data
     * displayFoundationPrincipleWarnings(null, null);
     *
     * @risk Creates container dynamically if not in DOM
     * @risk Silently skips if container cannot be created
     *
     * @since Sprint 3 (original)
     * @since Session 5 Modularization (extracted)
     * @author Claude (with Deimantas)
     */
    function displayFoundationPrincipleWarnings(integrityResult, octaveColor) {
        // ────────────────────────────────────────────────────────────────────
        // STEP 1: Find or create warning container
        // ────────────────────────────────────────────────────────────────────
        // WHY: The container may not exist on first load. We create it
        // dynamically to ensure warnings can always be displayed.
        // ────────────────────────────────────────────────────────────────────
        let warningContainer = document.getElementById('foundation-principle-warnings');

        // If no container exists, try to insert one after the octave progress section
        if (!warningContainer) {
            const octaveProgressContainer = document.querySelector('#octave-progress-fill')?.closest('div')?.parentElement;
            if (octaveProgressContainer) {
                warningContainer = document.createElement('div');
                warningContainer.id = 'foundation-principle-warnings';
                warningContainer.style.cssText = 'margin-top: 15px; transition: all 0.3s ease;';
                octaveProgressContainer.parentElement.insertBefore(warningContainer, octaveProgressContainer.nextSibling);
            }
        }

        // If still no container, skip silently
        if (!warningContainer) {
            console.warn('[foundation-principle] Could not find/create warning container');
            return;
        }

        // ────────────────────────────────────────────────────────────────────
        // STEP 2: Handle null integrityResult (no Foundation Principle applied)
        // ────────────────────────────────────────────────────────────────────
        if (!integrityResult) {
            warningContainer.innerHTML = '';
            return;
        }

        // ────────────────────────────────────────────────────────────────────
        // STEP 3: Build warning HTML components
        // ────────────────────────────────────────────────────────────────────
        let warningsHtml = '';
        const warnings = integrityResult.warnings || [];

        // ────────────────────────────────────────────────────────────────────
        // STEP 3a: Show spread info if there's any variance between faces
        // ────────────────────────────────────────────────────────────────────
        // Color-code based on severity:
        //   Critical (red):  spread > 4 - major structural issues
        //   Warning (orange): spread 3-4 - developing gap
        //   Healthy (green): spread <= 2 - well-aligned
        // ────────────────────────────────────────────────────────────────────
        if (integrityResult.spread > 0) {
            const spreadColor = integrityResult.spread > 4 ? WARNING_COLORS.CRITICAL :
                               integrityResult.spread > 2 ? WARNING_COLORS.WARNING :
                               WARNING_COLORS.HEALTHY;
            const spreadIcon = integrityResult.spread > 4 ? WARNING_ICONS.TRIANGLE :
                              integrityResult.spread > 2 ? WARNING_ICONS.CHART :
                              WARNING_ICONS.CHECK;

            warningsHtml += `
                <div style="display: flex; align-items: center; gap: 10px; padding: 10px; background: ${spreadColor}15; border-left: 3px solid ${spreadColor}; border-radius: 0 6px 6px 0; margin-bottom: 10px;">
                    <span style="font-size: 18px;">${spreadIcon}</span>
                    <div style="flex: 1;">
                        <div style="font-size: 12px; font-weight: 600; color: ${spreadColor};">
                            Octave Spread: ${integrityResult.spread} levels (O${integrityResult.breakdown?.min || '?'} → O${integrityResult.breakdown?.max || '?'})
                        </div>
                        <div style="font-size: 11px; color: rgba(255,255,255,0.6); margin-top: 3px;">
                            ${integrityResult.spread <= 2 ? 'Healthy variance - well-aligned development' :
                              integrityResult.spread <= 4 ? 'Some faces are developing faster than others' :
                              'Critical misalignment detected - foundations need strengthening'}
                        </div>
                    </div>
                </div>
            `;
        }

        // ────────────────────────────────────────────────────────────────────
        // STEP 3b: Show penalty info if one was applied
        // ────────────────────────────────────────────────────────────────────
        // The penalty reduces the effective octave when structural
        // misalignment is detected. This ensures the organization
        // addresses foundations before claiming higher development.
        // ────────────────────────────────────────────────────────────────────
        if (integrityResult.penalty > 0) {
            warningsHtml += `
                <div style="display: flex; align-items: center; gap: 10px; padding: 10px; background: rgba(255,170,77,0.1); border-left: 3px solid ${WARNING_COLORS.WARNING}; border-radius: 0 6px 6px 0; margin-bottom: 10px;">
                    <span style="font-size: 18px;">${WARNING_ICONS.TREND}</span>
                    <div style="flex: 1;">
                        <div style="font-size: 12px; font-weight: 600; color: ${WARNING_COLORS.WARNING};">
                            Foundation Principle Applied: -${integrityResult.penalty.toFixed(1)} octave penalty
                        </div>
                        <div style="font-size: 11px; color: rgba(255,255,255,0.6); margin-top: 3px;">
                            Geometric mean was ${integrityResult.geoMean?.toFixed(2) || '?'}, reduced due to structural misalignment
                        </div>
                    </div>
                </div>
            `;
        }

        // ────────────────────────────────────────────────────────────────────
        // STEP 3c: Show specific warnings (structural misalignment, aspirational)
        // ────────────────────────────────────────────────────────────────────
        // These are detailed warnings about specific structural issues:
        //   - structural_misalignment: Some faces are lagging behind
        //   - aspirational_outlier: Some faces have outpaced support
        // ────────────────────────────────────────────────────────────────────
        warnings.forEach(warning => {
            if (warning.type === 'structural_misalignment' || warning.type === 'aspirational_outlier') {
                const color = warning.severity === 'critical' ? WARNING_COLORS.CRITICAL : WARNING_COLORS.WARNING;
                const icon = warning.severity === 'critical' ? WARNING_ICONS.SIREN : WARNING_ICONS.ZAP;

                warningsHtml += `
                    <div style="display: flex; align-items: flex-start; gap: 10px; padding: 10px; background: ${color}10; border-left: 3px solid ${color}; border-radius: 0 6px 6px 0; margin-bottom: 10px;">
                        <span style="font-size: 16px;">${icon}</span>
                        <div style="flex: 1;">
                            <div style="font-size: 12px; font-weight: 600; color: ${color};">
                                ${warning.message}
                            </div>
                            ${warning.detail ? `<div style="font-size: 11px; color: rgba(255,255,255,0.6); margin-top: 3px;">${warning.detail}</div>` : ''}
                            ${warning.recommendation ? `
                                <div style="font-size: 11px; color: rgba(0,255,204,0.8); margin-top: 6px; padding: 6px; background: rgba(0,255,204,0.1); border-radius: 4px;">
                                    ${warning.recommendation}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `;
            }
        });

        // ────────────────────────────────────────────────────────────────────
        // STEP 3d: Show octave distribution if we have breakdown data
        // ────────────────────────────────────────────────────────────────────
        // This shows how faces are distributed across octaves,
        // helping users understand the overall structural balance.
        // ────────────────────────────────────────────────────────────────────
        if (integrityResult.breakdown?.distribution && Object.keys(integrityResult.breakdown.distribution).length > 1) {
            const distHtml = Object.entries(integrityResult.breakdown.distribution)
                .map(([oct, count]) => `<span style="padding: 2px 8px; background: rgba(255,255,255,0.1); border-radius: 10px; font-size: 10px;">${oct}: ${count}</span>`)
                .join(' ');

            warningsHtml += `
                <div style="padding: 8px 10px; background: rgba(255,255,255,0.05); border-radius: 6px; margin-bottom: 10px;">
                    <div style="font-size: 11px; color: rgba(255,255,255,0.5); margin-bottom: 5px;">Face Octave Distribution:</div>
                    <div style="display: flex; flex-wrap: wrap; gap: 6px; color: rgba(255,255,255,0.7);">
                        ${distHtml}
                    </div>
                </div>
            `;
        }

        // ────────────────────────────────────────────────────────────────────
        // STEP 4: Insert HTML into container
        // ────────────────────────────────────────────────────────────────────
        warningContainer.innerHTML = warningsHtml;

        if (warnings.length > 0) {
            console.log('[foundation-principle] Displayed', warnings.length, 'Foundation Principle warnings');
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // SECTION 4: EXPORTS
    // ═══════════════════════════════════════════════════════════════════════
    //
    // EXPORT STRATEGY:
    // We use dual exports for maximum compatibility:
    // 1. Browser global (window.XXX) - for script tag usage
    // 2. CommonJS (module.exports) - for Node.js/testing
    //
    // PUBLIC API:
    // ┌─────────────────────────────────────┬─────────────────────────────────┐
    // │ Export                              │ Description                     │
    // ├─────────────────────────────────────┼─────────────────────────────────┤
    // │ displayFoundationPrincipleWarnings  │ Main warning display function   │
    // │ WARNING_COLORS                      │ Color constants (for testing)   │
    // │ WARNING_ICONS                       │ Icon constants (for testing)    │
    // └─────────────────────────────────────┴─────────────────────────────────┘
    //
    // BACKWARD COMPATIBILITY:
    // displayFoundationPrincipleWarnings was previously in orchestrator-dashboard.js
    // This export maintains the same API for existing consumers.
    //
    // ═══════════════════════════════════════════════════════════════════════

    // Export to global scope (browser)
    global.displayFoundationPrincipleWarnings = displayFoundationPrincipleWarnings;
    global.FOUNDATION_WARNING_COLORS = WARNING_COLORS;
    global.FOUNDATION_WARNING_ICONS = WARNING_ICONS;

    // CommonJS export (Node.js/testing)
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = {
            displayFoundationPrincipleWarnings,
            WARNING_COLORS,
            WARNING_ICONS
        };
    }

    console.log('[dashboard/foundation-principle] Module loaded - structural integrity warnings ready');

})(typeof window !== 'undefined' ? window : this);
