/**
 * ========================================
 * MODULE: results-display.js
 * ========================================
 *
 * STEP 3 - RESULTS DISPLAY & SESSION STORAGE
 *
 * Handles displaying coherence calculation results and syncing
 * data to sessionStorage for cross-window communication (3D view).
 *
 * Extracted from: orchestrator-steps.js (lines 1863-2015)
 * Date: December 18, 2025
 *
 * ========================================
 * NOTES FOR FUTURE CLAUDE
 * ========================================
 *
 * 1. SESSION STORAGE CONTRACT (CRITICAL):
 *    updateSessionStorage() writes data that the 3D dodecahedron reads.
 *    The format MUST NOT CHANGE without updating all consumers:
 *
 *    sessionStorage.setItem('customCompanyData', JSON.stringify({
 *      id: 'custom',
 *      name: companyName,
 *      description: 'User-generated data from Orchestrator',
 *      kpis: demoState.kpiData,
 *      faceConfig: demoState.faceConfig,
 *      coherenceResults: demoState.coherenceResults,
 *      breathAxes: ...,
 *      edges: ...,
 *      dominantOctave: ...,
 *      tuning: ...,
 *      shadowPatterns: [...],              // Legacy format (for backwards compat)
 *      shadowSources: {                    // Sprint 9.1: New dual-source format
 *        template: [...],                  // Template/detected shadows
 *        ai: [...],                        // AI-generated shadows (preserved)
 *        activeSource: 'template'|'ai'     // Which source is active
 *      },
 *      isCustomData: true,
 *      timestamp: ...
 *    }));
 *
 *    Consumers:
 *    - js/dodec/dodec-data.js
 *    - js/dodec/dodec-geometry.js
 *    - js/dodec/dodec-panels.js
 *    - js/dodec/dodec-shadow-overlay.js
 *    - js/ui/shadow-panel.js
 *
 * 2. CROSS-WINDOW SYNC:
 *    CrossWindowSync.broadcast() sends STATE_UPDATE via BroadcastChannel
 *    to notify already-open 3D views of data changes.
 *
 * 3. SHADOW PATTERNS:
 *    For custom flow (no template), shadowPatterns are detected by
 *    ShadowDetector. For template flow, they come from mappingContext.
 *    This module dispatches 'shadows-updated' event for Shadow Overlay.
 *
 * 4. TIMESTAMP FRESHNESS:
 *    Each updateSessionStorage() call generates a new timestamp.
 *    This allows 3D views to detect stale data and refresh.
 *
 * 5. DASHBOARD INITIALIZATION:
 *    completeStep3() triggers three dashboard initializations:
 *    - Coherence Hero (global score display)
 *    - Portrait View (12-face grid)
 *    - Octave Dashboard (7-octave distribution)
 *
 * ========================================
 * DEPENDENCIES
 * ========================================
 * - js/orchestrator/orchestrator-state.js (demoState)
 * - js/orchestrator/orchestrator-utils.js (identifyNervousEndpoints)
 * - js/orchestrator/orchestrator-session.js (SessionManager)
 * - js/orchestrator/orchestrator-sync.js (CrossWindowSync)
 * - js/orchestrator/orchestrator-navigation.js (goToStep)
 * - js/orchestrator/orchestrator-dashboard.js (initializeCoherenceHero, etc.)
 * - markStepCompleted (from orchestrator-steps.js or face-configuration.js)
 *
 * ========================================
 * EXPORTS (to window/global)
 * ========================================
 * - displayCalculationResults()
 * - updateSessionStorage()
 * - displayCalculationTransparency()
 * - completeStep3()
 *
 * ========================================
 */
(function(global) {
    'use strict';

    // ========================================
    // RESULTS DISPLAY
    // ========================================

    /**
     * Display calculation results.
     *
     * Shows global coherence score and triggers breakdown display.
     * Also updates sessionStorage immediately for 3D view sync.
     */
    function displayCalculationResults() {
        const demoState = global.demoState;
        const identifyNervousEndpoints = global.identifyNervousEndpoints;

        const resultDiv = document.getElementById('calculationResult');
        const scoreDiv = document.getElementById('coherenceScore');

        const coherence = demoState.coherenceResults.globalCoherence;
        const status = demoState.coherenceResults.coherenceStatus;

        scoreDiv.textContent = `Global Coherence: ${(coherence * 100).toFixed(1)}% (${status})`;
        resultDiv.style.display = 'block';

        // Show calculation breakdown
        displayCalculationTransparency();

        // Identify nervous endpoints
        identifyNervousEndpoints();

        // Update sessionStorage immediately after calculation
        // This allows users to recalculate and see updates in already-open 3D views
        updateSessionStorage();
    }

    // ========================================
    // SESSION STORAGE SYNC
    // ========================================

    /**
     * Update sessionStorage with latest data.
     *
     * CRITICAL: This is the data bridge to the 3D visualization.
     * Any changes to this format require updates to all consumers.
     *
     * Broadcasts STATE_UPDATE via CrossWindowSync for live updates
     * to already-open 3D views.
     */
    function updateSessionStorage() {
        const demoState = global.demoState;
        const SessionManager = global.SessionManager;
        const CrossWindowSync = global.CrossWindowSync;

        if (demoState.kpiData && demoState.kpiData.length > 0) {
            // Get actual company name from loaded template or face config
            const companyName = demoState.loadedMappingContext?.displayName
                || demoState.faceConfig?.templateName
                || 'Custom Analysis';

            const customCompanyData = {
                id: 'custom',
                name: companyName,
                description: 'User-generated data from Orchestrator',
                kpis: demoState.kpiData,
                faceConfig: demoState.faceConfig,
                coherenceResults: demoState.coherenceResults,
                breathAxes: demoState.loadedMappingContext?.breathAxes || null,
                edges: demoState.loadedMappingContext?.edges || null,
                dominantOctave: demoState.loadedMappingContext?.dominantOctave || 1,
                tuning: demoState.loadedMappingContext?.diagnostics?.tuning || null,
                // Shadow system - use detected patterns for custom path, or template patterns if available
                shadowPatterns: demoState.shadowPatterns?.length > 0
                    ? demoState.shadowPatterns
                    : (demoState.loadedMappingContext?.shadowPatterns || []),
                // Sprint 9.1: New shadowSources format for proper template/AI separation
                // Template shadows come from ShadowDetector (custom path) or loadedMappingContext (template path)
                // AI shadows are preserved from existing sessionStorage (generated in 3D view)
                shadowSources: (() => {
                    // Preserve existing AI shadows from previous 3D view session
                    let existingAI = [];
                    try {
                        const existing = JSON.parse(sessionStorage.getItem('customCompanyData') || '{}');
                        existingAI = existing.shadowSources?.ai || [];
                    } catch (e) { /* ignore */ }

                    return {
                        template: demoState.shadowPatterns?.length > 0
                            ? demoState.shadowPatterns
                            : (demoState.loadedMappingContext?.shadowPatterns || []),
                        ai: existingAI,  // Preserve AI shadows from 3D view
                        activeSource: 'template'  // Start on template, user can switch to AI
                    };
                })(),
                isCustomData: true,
                timestamp: new Date().toISOString()
            };

            sessionStorage.setItem('customCompanyData', JSON.stringify(customCompanyData));
            sessionStorage.setItem('selectedCompanyId', 'custom');
            console.log('💾 Updated sessionStorage with latest data (timestamp:', customCompanyData.timestamp, ')');

            // Dispatch shadows-updated event for Shadow Overlay Controller
            if (customCompanyData.shadowPatterns) {
                window.dispatchEvent(new CustomEvent('shadows-updated', {
                    detail: { shadows: customCompanyData.shadowPatterns }
                }));
                console.log('[results-display] shadows-updated event dispatched');
            }

            // Ensure session monitoring is active
            if (SessionManager && !SessionManager._checkTimer) {
                SessionManager.start();
            }

            // Broadcast state change to other windows (3D views, etc.)
            if (CrossWindowSync) {
                CrossWindowSync.broadcast('STATE_UPDATE', {
                    customCompanyData,
                    demoState: {
                        currentStep: demoState.currentStep,
                        faceConfig: demoState.faceConfig,
                        coherenceResults: demoState.coherenceResults
                    }
                });
            }
        }
    }

    // ========================================
    // CALCULATION TRANSPARENCY
    // ========================================

    /**
     * Display calculation transparency breakdown.
     *
     * Shows per-face energy levels with progress bars and color coding:
     * - Green (≥70%): Healthy
     * - Yellow (≥40%): Moderate
     * - Red (<40%): Critical
     */
    function displayCalculationTransparency() {
        const demoState = global.demoState;
        const section = document.getElementById('calculationTransparency');

        let html = '<div style="margin-top: 30px;">';
        html += '<h3 style="font-size: 16px; margin-bottom: 20px; color: rgba(255, 255, 255, 0.8);">Calculation Breakdown</h3>';

        demoState.coherenceResults.faces.forEach(face => {
            const energy = face.energy || face.faceEnergy || 0;
            const percentage = (energy * 100).toFixed(1);
            const color = energy >= 0.7 ? '#00ff88' : energy >= 0.4 ? '#ffcc00' : '#ff6666';

            html += `
                <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 15px; margin-bottom: 15px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <div style="font-size: 14px; font-weight: 600; color: #fff;">Face ${face.id}: ${face.name}</div>
                            <div style="font-size: 11px; color: rgba(255, 255, 255, 0.6); margin-top: 5px;">
                                ${face.kpis ? face.kpis.length : 0} KPIs analyzed
                            </div>
                        </div>
                        <div style="font-size: 24px; font-weight: 600; color: ${color};">
                            ${percentage}%
                        </div>
                    </div>
                    <div style="margin-top: 10px; height: 6px; background: rgba(0, 0, 0, 0.3); border-radius: 3px; overflow: hidden;">
                        <div style="width: ${percentage}%; height: 100%; background: ${color}; transition: width 0.5s ease;"></div>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        section.innerHTML = html;
    }

    // ========================================
    // STEP COMPLETION
    // ========================================

    /**
     * Complete Step 3: Calculation.
     *
     * Marks step as complete, navigates to Step 4, and initializes
     * all three dashboard components.
     */
    function completeStep3() {
        const goToStep = global.goToStep;
        const markStepCompleted = global.markStepCompleted;
        const initializeCoherenceHero = global.initializeCoherenceHero;
        const initializePortraitView = global.initializePortraitView;
        const initializeOctaveDashboard = global.initializeOctaveDashboard;

        markStepCompleted(3);
        goToStep(4);

        // Initialize Coherence Hero when entering Step 4
        initializeCoherenceHero();

        // Initialize Portrait View when entering Step 4
        initializePortraitView();

        // Initialize Octave Dashboard when entering Step 4
        initializeOctaveDashboard();
    }

    // ========================================
    // EXPORTS
    // ========================================

    global.displayCalculationResults = displayCalculationResults;
    global.updateSessionStorage = updateSessionStorage;
    global.displayCalculationTransparency = displayCalculationTransparency;
    global.completeStep3 = completeStep3;

    console.log('[results-display] Module loaded');

})(typeof window !== 'undefined' ? window : this);
