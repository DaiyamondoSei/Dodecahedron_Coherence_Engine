/**
 * ═══════════════════════════════════════════════════════════════════════════
 * @module orchestrator-dashboard
 * @description Thin coordinator for the modular Dashboard components
 * @version 2.0.0 (Session 5 Modularization)
 * @since Sprint 3 (original monolith), Session 5 (modularized)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                        NOTES FOR FUTURE CLAUDE                         │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * Welcome, future self! This module has been MODULARIZED in Session 5.
 *
 * IMPORTANT: This file is now a THIN COORDINATOR. Most logic has been
 * extracted to the dashboard/ subdirectory. Here's the new architecture:
 *
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                         SESSION 5 ARCHITECTURE                           │
 * └──────────────────────────────────────────────────────────────────────────┘
 *
 *   dashboard/
 *   ├── index.js                 → Navigation map & module registry
 *   ├── octave-utilities.js      → getDefaultElements(), getDefaultFaceName()
 *   ├── octave-system.js         → OCTAVE_REFERENCE, detectOctave*()
 *   ├── coherence-hero.js        → initializeCoherenceHero()
 *   ├── foundation-principle.js  → displayFoundationPrincipleWarnings()
 *   └── portrait-view-manager.js → initializePortraitView(), transformToPortraitData()
 *
 * THIS FILE CONTAINS ONLY:
 *   - initializeOctaveDashboard() - the main orchestrator function
 *   - Backward-compatible re-exports for legacy consumers
 *
 * WHY MODULARIZE?
 *   - Original file was 1,272 lines (hard to navigate)
 *   - Now each module is < 300 lines with single responsibility
 *   - Comprehensive documentation for future Claude navigation
 *   - Isolated testing and maintenance
 *
 * SCRIPT LOAD ORDER (demo-orchestrator.html):
 *   1. orchestrator-state.js           ← Hard dependency (demoState, thresholds)
 *   2. dashboard/octave-utilities.js   ← Pure utilities (no deps)
 *   3. dashboard/octave-system.js      ← Depends on state
 *   4. dashboard/coherence-hero.js     ← Depends on state
 *   5. dashboard/foundation-principle.js ← Depends on state
 *   6. dashboard/portrait-view-manager.js ← Depends on state, octave-system
 *   7. orchestrator-dashboard.js       ← THIS FILE (coordinator)
 *   8. orchestrator-navigation.js      ← Calls this module's functions
 *
 * ROLLBACK PROCEDURE:
 *   If something breaks, restore from archive:
 *   js/orchestrator/archive/orchestrator-dashboard-pre-session5.js
 *
 * ═══════════════════════════════════════════════════════════════════════════
 */

(function (global) {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════
    // SECTION 1: MODULE VERIFICATION
    // ═══════════════════════════════════════════════════════════════════════
    //
    // Verify that all required dashboard modules are loaded.
    // These modules provide the functions we coordinate.
    //
    // ═══════════════════════════════════════════════════════════════════════

    const requiredModules = [
        'OCTAVE_REFERENCE',
        'detectOctaveFromCoherence',
        'initializeCoherenceHero',
        'displayFoundationPrincipleWarnings',
        'initializePortraitView'
    ];

    const missingModules = requiredModules.filter(mod => typeof global[mod] === 'undefined');
    if (missingModules.length > 0) {
        Logger.warn('OrchestratorDashboard', `Missing modules: ${missingModules.join(', ')}`);
        Logger.warn('OrchestratorDashboard', 'Ensure dashboard/*.js files are loaded before this file');
    }

    // ═══════════════════════════════════════════════════════════════════════
    // SECTION 2: MAIN ORCHESTRATOR FUNCTION
    // ═══════════════════════════════════════════════════════════════════════
    //
    // PURPOSE: Initialize the Octave Dashboard with current data
    //
    // This is the main coordinator that:
    //   1. Determines dominant octave (from context or calculated)
    //   2. Applies Foundation Principle via OctaveIntegrityCalculator
    //   3. Updates all dashboard UI elements
    //   4. Displays structural warnings
    //
    // CALL SITES:
    //   - orchestrator-navigation.js: goToStep(4)
    //   - steps/results-display.js: loadDemoResultsFromStorage()
    //
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Initialize Octave Dashboard with current data
     *
     * This is the main dashboard initialization function. It coordinates
     * multiple modules to render the complete dashboard view.
     *
     * ┌─────────────────────────────────────────────────────────────────────┐
     * │ PHILOSOPHY: The Octave Dashboard shows WHERE the organization is   │
     * │ on its developmental journey (O1-O7), WHAT questions it should be  │
     * │ engaging with, and HOW to advance to the next level.               │
     * └─────────────────────────────────────────────────────────────────────┘
     *
     * DOM Elements Updated:
     *   - #octave-progress-fill : Progress bar fill
     *   - #octave-progress-marker : Progress bar marker
     *   - #octave-badge : Octave number badge (O1-O7)
     *   - #octave-name : Octave name
     *   - #octave-focus : Focus area
     *   - #octave-description : Description text
     *   - #octave-questions : Diagnostic questions
     *   - #next-octave-preview : Next octave preview card
     *   - #dominant-breath-name : Breath axis name
     *   - #dominant-breath-insight : Breath insight text
     *   - #octave-progress-labels : Progress bar labels (O1-O7)
     *   - #foundation-principle-warnings : Warning container
     *
     * @returns {void}
     *
     * @example
     * // Called when navigating to Step 4
     * goToStep(4); // internally calls initializeOctaveDashboard()
     *
     * @risk Requires OCTAVE_REFERENCE from octave-system.js
     * @risk Requires displayFoundationPrincipleWarnings from foundation-principle.js
     *
     * @since Sprint 3 (original)
     * @since Session 5 (modularized - this function stays as coordinator)
     * @author Claude (with Deimantas)
     */
    function initializeOctaveDashboard() {
        // Access shared state and thresholds from global scope
        const state = global.demoState;
        const thresholds = global.OCTAVE_COHERENCE_THRESHOLDS;
        const OCTAVE_REFERENCE = global.OCTAVE_REFERENCE;
        const detectOctaveFromCoherence = global.detectOctaveFromCoherence;
        const displayFoundationPrincipleWarnings = global.displayFoundationPrincipleWarnings;

        // Validate dependencies
        if (!OCTAVE_REFERENCE) {
            Logger.error('OrchestratorDashboard', 'OCTAVE_REFERENCE not loaded');
            return;
        }

        // ────────────────────────────────────────────────────────────────────
        // STEP 1: Initialize default values
        // ────────────────────────────────────────────────────────────────────
        let dominantOctave = 1;
        let octaveStage = 'O1';
        let dominantBreathName = 'The Breath of Viability';
        let breathAxes = [];
        let integrityResult = null;  // Will store Foundation Principle result

        // ────────────────────────────────────────────────────────────────────
        // STEP 2: Check for loaded mapping context (from template or saved)
        // ────────────────────────────────────────────────────────────────────
        if (state.loadedMappingContext) {
            dominantOctave = state.loadedMappingContext.dominantOctave || 1;
            octaveStage = state.loadedMappingContext.octaveStage || `O${dominantOctave}`;
            dominantBreathName = state.loadedMappingContext.dominantBreathName || 'The Breath of Viability';
            breathAxes = state.loadedMappingContext.breathAxes || [];
        }

        // ════════════════════════════════════════════════════════════════════
        // FOUNDATION PRINCIPLE: Use OctaveIntegrityCalculator
        // ════════════════════════════════════════════════════════════════════
        //
        // The Foundation Principle states:
        // "An organization cannot claim a higher octave than its
        // structural foundation supports"
        //
        // This prevents cherry-picking high scores while ignoring
        // foundational weaknesses.
        //
        // ════════════════════════════════════════════════════════════════════
        if (global.OctaveIntegrityCalculator && state.coherenceResults?.faces) {
            // Build face data with individual octaves
            const faceOctaveData = state.coherenceResults.faces.map(face => {
                const faceCoherence = face.energy || face.faceEnergy || face.coherence || 0.5;
                const faceOctave = global.OctaveIntegrityCalculator.detectOctaveFromCoherence(faceCoherence);
                return {
                    id: face.id,
                    name: face.name || `Face ${face.id}`,
                    octave: faceOctave.octave,
                    coherence: faceCoherence
                };
            });

            // Get lifecycle stage if available
            const lifecycleStage = state.loadedMappingContext?.lifecycleStage || null;

            // Calculate organizational octave with Foundation Principle
            integrityResult = global.OctaveIntegrityCalculator.calculateOrganizationalOctave(
                faceOctaveData,
                lifecycleStage
            );

            // Use Foundation Principle result if available
            dominantOctave = integrityResult.orgOctave;
            octaveStage = `O${dominantOctave}`;
            Logger.info('OrchestratorDashboard', 'Foundation Principle applied', {
                orgOctave: dominantOctave,
                geoMean: integrityResult.geoMean,
                spread: integrityResult.spread,
                penalty: integrityResult.penalty,
                warnings: integrityResult.warnings?.length || 0
            });
        }
        // ────────────────────────────────────────────────────────────────────
        // FALLBACK: If no face data, detect from global coherence
        // ────────────────────────────────────────────────────────────────────
        else if (!state.loadedMappingContext && state.coherenceResults) {
            const avgCoherence = state.coherenceResults.globalCoherence || 0.5;
            dominantOctave = detectOctaveFromCoherence ? detectOctaveFromCoherence(avgCoherence) : 3;
        }

    // ────────────────────────────────────────────────────────────────────
    // STEP 3: Get reference data for current and next octave
    // ────────────────────────────────────────────────────────────────────
    const octaveData = OCTAVE_REFERENCE[dominantOctave] || OCTAVE_REFERENCE[1];
    const nextOctave = Math.min(7, dominantOctave + 1);
    const nextOctaveData = OCTAVE_REFERENCE[nextOctave];

    // ────────────────────────────────────────────────────────────────────
    // STEP 4: Update progress bar
    // ────────────────────────────────────────────────────────────────────
    const progressPercent = (dominantOctave / 7) * 100;
    const progressFill = document.getElementById('octave-progress-fill');
    const progressMarker = document.getElementById('octave-progress-marker');

    if (progressFill) {
        progressFill.style.width = `${progressPercent}%`;
        progressFill.style.background = octaveData.gradient;
    }
    if (progressMarker) {
        progressMarker.style.left = `${progressPercent}%`;
    }

    // ────────────────────────────────────────────────────────────────────
    // STEP 5: Update octave badge
    // ────────────────────────────────────────────────────────────────────
    const badge = document.getElementById('octave-badge');
    if (badge) {
        badge.textContent = `O${dominantOctave}`;
        badge.style.background = octaveData.gradient;
    }

    // ────────────────────────────────────────────────────────────────────
    // STEP 6: Update name and description
    // ────────────────────────────────────────────────────────────────────
    const nameEl = document.getElementById('octave-name');
    const focusEl = document.getElementById('octave-focus');
    const descEl = document.getElementById('octave-description');

    if (nameEl) {
        nameEl.textContent = octaveData.name;
        nameEl.style.color = octaveData.color;
    }
    if (focusEl) {
        focusEl.innerHTML = `Focus: <span style="color: ${octaveData.color};">${octaveData.focus}</span>`;
    }
    if (descEl) {
        descEl.textContent = octaveData.description;
    }

    // ────────────────────────────────────────────────────────────────────
    // STEP 7: Update questions
    // ────────────────────────────────────────────────────────────────────
    const questionsEl = document.getElementById('octave-questions');
    if (questionsEl) {
        let questions = octaveData.questions;

        // If we have breath axes, use their questions instead
        if (breathAxes.length > 0) {
            questions = breathAxes
                .filter(axis => axis.projectionQuestion || axis.receptionQuestion)
                .slice(0, 4)
                .flatMap(axis => [axis.projectionQuestion, axis.receptionQuestion])
                .filter(q => q)
                .slice(0, 4);
        }

        questionsEl.innerHTML = questions.map((q, i) =>
            `<div style="padding: 8px 0; ${i < questions.length - 1 ? 'border-bottom: 1px solid rgba(255,255,255,0.05);' : ''}">• ${q}</div>`
        ).join('');
    }

    // ────────────────────────────────────────────────────────────────────
    // STEP 8: Update next octave preview
    // ────────────────────────────────────────────────────────────────────
    const nextPreview = document.getElementById('next-octave-preview');
    if (nextPreview) {
        if (dominantOctave < 7) {
            nextPreview.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                        <div style="width: 40px; height: 40px; border-radius: 50%; background: rgba(167,139,250,0.2); border: 2px solid ${nextOctaveData.color}40; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; color: ${nextOctaveData.color};">O${nextOctave}</div>
                        <div>
                            <div style="font-weight: 600; color: ${nextOctaveData.color};">${nextOctaveData.name}</div>
                            <div style="font-size: 11px; color: rgba(255,255,255,0.5);">Focus: ${nextOctaveData.focus}</div>
                        </div>
                    </div>
                    <div style="font-size: 12px; color: rgba(255,255,255,0.6); line-height: 1.6;">
                        ${nextOctaveData.description}
                    </div>
                    <div style="margin-top: 12px; padding: 10px; background: ${nextOctaveData.color}15; border-radius: 6px; font-size: 11px; color: rgba(255,255,255,0.7);">
                        <strong>To advance:</strong> ${octaveData.advanceHint}
                    </div>
                `;
        } else {
            // At O7 - show completion message
            nextPreview.innerHTML = `
                    <div style="text-align: center; padding: 20px;">
                        <span style="font-size: 32px;">&#10024;</span>
                        <div style="font-weight: 600; color: #ffd43b; margin-top: 10px;">Full Radiance Achieved</div>
                        <div style="font-size: 12px; color: rgba(255,255,255,0.6); margin-top: 8px;">
                            The journey continues in service to others. Your coherence becomes a gift to the world.
                        </div>
                    </div>
                `;
        }
    }

    // ────────────────────────────────────────────────────────────────────
    // STEP 9: Update breath insight
    // ────────────────────────────────────────────────────────────────────
    const breathNameEl = document.getElementById('dominant-breath-name');
    const breathInsightEl = document.getElementById('dominant-breath-insight');

    if (breathNameEl) {
        breathNameEl.textContent = `"${dominantBreathName}"`;
    }
    if (breathInsightEl) {
        breathInsightEl.textContent = octaveData.breathInsight;
    }

    // ────────────────────────────────────────────────────────────────────
    // STEP 10: Highlight current octave in progress bar labels
    // ────────────────────────────────────────────────────────────────────
    const labels = document.querySelectorAll('#octave-progress-labels span');
    labels.forEach((label, i) => {
        if (i + 1 === dominantOctave) {
            label.style.color = octaveData.color;
            label.style.fontWeight = '600';
        } else {
            label.style.color = 'rgba(255,255,255,0.4)';
            label.style.fontWeight = 'normal';
        }
    });

    // ────────────────────────────────────────────────────────────────────
    // STEP 11: Display Foundation Principle warnings
    // ────────────────────────────────────────────────────────────────────
    // Uses foundation-principle.js module
    if (displayFoundationPrincipleWarnings) {
        displayFoundationPrincipleWarnings(integrityResult, octaveData.color);
    }

    Logger.info('OrchestratorDashboard', `Octave Dashboard initialized: O${dominantOctave} (${octaveData.name})`);
}

    // ═══════════════════════════════════════════════════════════════════════
    // SECTION 3: EXPORTS
    // ═══════════════════════════════════════════════════════════════════════
    //
    // EXPORT STRATEGY:
    // This coordinator exports initializeOctaveDashboard to global scope.
    // All other functions are exported by their respective modules.
    //
    // BACKWARD COMPATIBILITY:
    // The same functions are available on window as before modularization.
    // No breaking changes for existing consumers.
    //
    // ═══════════════════════════════════════════════════════════════════════

    // Export the main coordinator function
    global.initializeOctaveDashboard = initializeOctaveDashboard;

// Log module status
Logger.info('OrchestratorDashboard', 'Thin coordinator loaded (Session 5 modular architecture)');
Logger.debug('OrchestratorDashboard', 'Modules integrated: octave-system, coherence-hero, foundation-principle, portrait-view-manager');

}) (typeof window !== 'undefined' ? window : this);
