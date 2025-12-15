/**
 * ========================================
 * MODULE: orchestrator-navigation.js
 * ========================================
 *
 * Extracted from: demo-orchestrator-logic.js
 * Original lines: ~176-539
 * Date: December 15, 2025
 *
 * PURPOSE:
 * Navigation, progress tracking, and initialization functions
 * for the demo orchestrator flow.
 *
 * DEPENDENCIES:
 * - js/orchestrator/orchestrator-state.js (for demoState, guards)
 * - js/orchestrator/orchestrator-session.js (for SessionManager)
 * - js/orchestrator/orchestrator-utils.js (for showLoading)
 * - js/orchestrator/orchestrator-dashboard.js (for visualization init)
 *
 * EXPORTS (to window/global):
 * - initializeDemo(): Main entry point
 * - highlightTemplateOptions(): Visual helper
 * - goToStep(stepNumber): Navigate to step
 * - showValidationBlockDialog(gateResult): Validation modal
 * - closeValidationModal(): Close modal
 * - applyDefaultsAndProceed(): Apply defaults
 * - focusOnIncompleteFace(): Focus helper
 * - updateProgress(): Progress bar update
 *
 * NOTES FOR FUTURE CLAUDE:
 * - This module calls functions from other modules via window globals
 * - goToStep() calls dashboard functions and step functions
 * - initializeDemo() is called from DOMContentLoaded event
 * - Validation dialogs integrate with Sprint2 validation gate
 *
 * ========================================
 */
(function(global) {
    'use strict';

    // ========================================
    // IMPORTS (from global scope)
    // ========================================

    // demoState from orchestrator-state.js
    // SessionManager from orchestrator-session.js
    // Note: These must be loaded before this module

    // ========================================
    // SECTION: INITIALIZATION
    // ========================================
    //
    // Main entry point for the demo orchestrator.
    // Handles URL parameters, session restoration,
    // and initial state setup.
    //
    // ========================================

    /**
     * Initialize the demo orchestrator.
     * Called on DOMContentLoaded.
     *
     * Responsibilities:
     * - URL parameter handling (?path=, ?restore=)
     * - Session data restoration
     * - Company preloading from templates
     * - Step navigation setup
     *
     * @function initializeDemo
     * @global
     */
    function initializeDemo() {
        console.log('🌟 Quannex Demo Orchestrator initialized');

        // Access demoState from global
        const state = global.demoState;

        // =====================================================
        // URL PARAMETER HANDLING
        // =====================================================
        const urlParams = new URLSearchParams(window.location.search);
        const selectedPath = urlParams.get('path');
        const shouldRestore = urlParams.get('restore') === 'true';

        // Issue #10 Fix: Handle ?restore=true from back navigation
        // This ensures state is restored when returning from sub-views
        if (shouldRestore) {
            console.log('🔄 Restore flag detected - restoring session from back navigation');
            // Clear the restore parameter
            window.history.replaceState({}, document.title, window.location.pathname);
            // Fall through to normal session restoration below
        }

        // PATH HANDLING: Check for ?path= parameter from welcome screen
        if (selectedPath) {
            console.log(`🎯 Welcome screen path detected: ${selectedPath}`);
            // Clear URL parameter to prevent re-triggering on refresh
            window.history.replaceState({}, document.title, window.location.pathname);

            // Handle each path type
            setTimeout(() => {
                switch (selectedPath) {
                    case 'template':
                        // Go to Step 0 and highlight template options
                        goToStep(0);
                        highlightTemplateOptions();
                        break;

                    case 'custom':
                        // Start fresh with manual mode
                        if (typeof global.startFreshManual === 'function') {
                            global.startFreshManual();
                        }
                        break;

                    case 'ai':
                        // Start fresh with AI story mode
                        if (typeof global.startFreshAI === 'function') {
                            global.startFreshAI();
                        }
                        break;

                    default:
                        console.warn(`Unknown path: ${selectedPath}, defaulting to Step 0`);
                        goToStep(0);
                }
            }, 100);

            return; // Skip session restoration when coming from welcome screen
        }

        // Session restoration: attempt to restore previous session data
        try {
            const savedData = sessionStorage.getItem('customCompanyData');
            if (savedData) {
                const parsed = JSON.parse(savedData);
                // Only restore if recent (within 30 minutes)
                const savedTime = new Date(parsed.timestamp);
                const now = new Date();
                const minutesElapsed = (now - savedTime) / (1000 * 60);

                if (minutesElapsed < 30) {
                    console.log('[Demo] Restoring previous session data (saved', Math.round(minutesElapsed), 'minutes ago)');
                    state.kpiData = parsed.kpis || [];
                    state.faceConfig = parsed.faceConfig || null;
                    state.coherenceResults = parsed.coherenceResults || null;
                    // Restore completed steps if available
                    if (parsed.completedSteps) {
                        state.completedSteps = parsed.completedSteps;
                    }

                    // ===================================================
                    // ISSUE #11 FIX: Sync demoState with MappingContext
                    // ===================================================
                    // MappingContext is used by Sprint2/AI flow. Without this sync,
                    // two parallel state systems exist with no connection.
                    if (state.faceConfig && state.faceConfig.faces) {
                        try {
                            // Lazy import - MappingContext may be loaded via module
                            if (window.MappingContext) {
                                const ctx = window.MappingContext.getInstance();
                                state.faceConfig.faces.forEach(face => {
                                    ctx.updateFace(face.id, {
                                        name: face.name,
                                        icon: face.icon,
                                        sentiment: face.sentiment || face.faceEnergy || face.energy || 0.5
                                    });
                                });
                                console.log('[Demo] ✅ MappingContext synced with demoState');
                                // Store reference for later use
                                state.loadedMappingContext = ctx.toJSON();
                            }
                        } catch (syncError) {
                            console.warn('[Demo] MappingContext sync deferred (not yet loaded):', syncError.message);
                        }
                    }

                    console.log('[Demo] Session restored:', {
                        kpiCount: state.kpiData?.length,
                        hasFaceConfig: !!state.faceConfig,
                        hasCoherence: !!state.coherenceResults
                    });
                    // Start session monitoring after successful restore
                    if (global.SessionManager) {
                        global.SessionManager.start();
                    }
                } else {
                    console.log('[Demo] Previous session expired (', Math.round(minutesElapsed), 'minutes old)');
                    sessionStorage.removeItem('customCompanyData');
                }
            }
        } catch (e) {
            console.warn('[Demo] Session restore failed:', e.message);
        }

        updateProgress();
    }

    /**
     * Highlight template options in Step 0 (for welcome screen path)
     */
    function highlightTemplateOptions() {
        // Add visual emphasis to template cards
        const templateCards = document.querySelectorAll('.company-template-card');
        templateCards.forEach(card => {
            card.style.animation = 'pulseHighlight 1.5s ease-in-out 3';
        });

        // Add CSS animation if not exists
        if (!document.getElementById('welcome-path-styles')) {
            const style = document.createElement('style');
            style.id = 'welcome-path-styles';
            style.textContent = `
                @keyframes pulseHighlight {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(0, 255, 204, 0); }
                    50% { box-shadow: 0 0 20px 5px rgba(0, 255, 204, 0.3); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // ========================================
    // SECTION: NAVIGATION & PROGRESS
    // ========================================
    //
    // Functions for navigating between demo steps and
    // tracking progress.
    //
    // ========================================

    /**
     * Navigate to a specific step in the demo flow.
     *
     * Validates step accessibility and enforces the validation gate.
     * Broadcasts step changes via CrossWindowSync.
     *
     * @param {number} stepNumber - Step to navigate to (0-4)
     * @function goToStep
     * @global
     */
    function goToStep(stepNumber) {
        // Access demoState from global
        const state = global.demoState;

        // Step 0 is always accessible
        if (stepNumber === 0) {
            // Allow going back to step 0
        }
        // Validate step is accessible (for steps > 0)
        else if (stepNumber > 1 && !state.completedSteps.includes(stepNumber - 1)) {
            alert(`Please complete Step ${stepNumber - 1} first`);
            return;
        }
        // Step 1 requires step 0 to be completed (company selected or manual mode)
        else if (stepNumber === 1 && !state.completedSteps.includes(0)) {
            alert('Please select a journey or start fresh first');
            return;
        }

        // Sprint 2 FIX: Enforce validation gate for step 2+
        // Must have all 12 faces validated before proceeding past step 1
        // EXCEPTION: Skip validation for template flow (all steps already marked complete)
        if (stepNumber > 1 && window.Sprint2 && window.Sprint2.validationGate) {
            const isTemplateFlow = state.completedSteps.includes(1) &&
                                   state.completedSteps.includes(2) &&
                                   state.completedSteps.includes(3);

            if (!isTemplateFlow) {
                const gateResult = window.Sprint2.canProceed();
                if (!gateResult.canProceed) {
                    // Show empowering dialog instead of blocking alert
                    showValidationBlockDialog(gateResult);
                    return;
                }
            }
        }

        // Hide all steps
        document.querySelectorAll('.step-content').forEach(content => {
            content.classList.remove('active');
        });

        // Show target step
        document.getElementById(`step${stepNumber}`).classList.add('active');

        // Update navigation
        document.querySelectorAll('.step-button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-step="${stepNumber}"]`).classList.add('active');

        // Update state
        state.currentStep = stepNumber;
        updateProgress();

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // If navigating to Step 4, initialize visualizations
        if (stepNumber === 4) {
            setTimeout(() => {
                // Call dashboard functions via global
                if (typeof global.initializePortraitView === 'function') {
                    global.initializePortraitView();
                }
                if (typeof global.initializeOctaveDashboard === 'function') {
                    global.initializeOctaveDashboard();
                }
                // Sprint 3 Fix: Ensure nervous endpoints are updated with current template data
                if (state.coherenceResults && state.coherenceResults.faces) {
                    if (typeof global.identifyNervousEndpoints === 'function') {
                        global.identifyNervousEndpoints();
                    }
                }
                // Sprint 4 Task 34: Display highest leverage action
                if (typeof global.identifyHighestLeverageAction === 'function') {
                    global.identifyHighestLeverageAction();
                }
            }, 100);
        }

        // If navigating to Step 2, ensure KPI mode buttons are visible
        if (stepNumber === 2) {
            const modeQuick = document.getElementById('modeQuick');
            const modeFull = document.getElementById('modeFull');
            if (modeQuick) modeQuick.style.display = 'inline-block';
            if (modeFull) modeFull.style.display = 'inline-block';
        }

        // If navigating back to Step 1, restore face names from demoState
        // This preserves user customizations across navigation
        if (stepNumber === 1 && state.faceConfig) {
            if (typeof global.restoreFacesFromDemoState === 'function') {
                global.restoreFacesFromDemoState();
                // Also re-populate the face editor UI
                if (typeof global.populateFaceEditor === 'function') {
                    global.populateFaceEditor();
                }
            }
        }

        console.log(`📍 Navigated to Step ${stepNumber}`);
    }

    // ========================================
    // SECTION: VALIDATION DIALOGS
    // ========================================
    //
    // Modal dialogs for validation gate.
    // Shows empowering messages when faces are incomplete.
    //
    // ========================================

    /**
     * Show validation block dialog with empowering messaging.
     * Sprint 2 Task 15: Red indicators + blocking
     *
     * @param {Object} gateResult - Result from Sprint2.canProceed()
     * @function showValidationBlockDialog
     * @global
     */
    function showValidationBlockDialog(gateResult) {
        const validation = window.Sprint2.validationGate.validate();
        const message = validation.message;
        const incompleteFaces = validation.faceGuidance || [];

        // Build face list with red indicators
        let faceListHtml = incompleteFaces.slice(0, 5).map(face =>
            `<div style="display: flex; align-items: center; gap: 8px; padding: 8px; background: rgba(255,100,100,0.1); border-radius: 4px; margin: 4px 0;">
                <span style="color: #ff6b6b; font-size: 16px;">⚠️</span>
                <span>Face ${face.faceId}: ${face.currentName}</span>
            </div>`
        ).join('');

        if (incompleteFaces.length > 5) {
            faceListHtml += `<div style="font-size: 12px; color: rgba(255,255,255,0.5); padding: 4px;">...and ${incompleteFaces.length - 5} more</div>`;
        }

        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.id = 'validation-block-modal';
        overlay.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.85); z-index: 3000; display: flex; align-items: center; justify-content: center;">
                <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border: 2px solid #ff6b6b; border-radius: 16px; padding: 30px; max-width: 500px; margin: 20px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <span style="font-size: 48px;">${message.icon || '🔴'}</span>
                        <h2 style="color: #ff6b6b; margin: 15px 0 10px 0; font-size: 24px;">${message.title}</h2>
                        <p style="color: rgba(255,255,255,0.8); font-size: 14px;">${message.message}</p>
                        ${message.encouragement ? `<p style="color: rgba(255,255,255,0.5); font-size: 12px; margin-top: 10px;">${message.encouragement}</p>` : ''}
                    </div>

                    <div style="margin: 20px 0;">
                        <div style="font-size: 12px; color: #ff6b6b; margin-bottom: 8px; font-weight: 600;">
                            ⚠️ INCOMPLETE FACES (${incompleteFaces.length} remaining):
                        </div>
                        ${faceListHtml}
                    </div>

                    <div style="display: flex; gap: 12px; justify-content: center; margin-top: 20px;">
                        <button onclick="closeValidationModal(); focusOnIncompleteFace()"
                            style="padding: 12px 24px; background: linear-gradient(135deg, #00ffcc, #00ff88); color: #000; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
                            Complete Faces
                        </button>
                        <button onclick="applyDefaultsAndProceed()"
                            style="padding: 12px 24px; background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.3); border-radius: 8px; cursor: pointer;">
                            Use Defaults
                        </button>
                        <button onclick="closeValidationModal()"
                            style="padding: 12px 24px; background: transparent; color: rgba(255,255,255,0.5); border: none; cursor: pointer;">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    /**
     * Close validation modal
     */
    function closeValidationModal() {
        const modal = document.getElementById('validation-block-modal');
        if (modal) modal.remove();
    }

    /**
     * Apply defaults and proceed
     */
    function applyDefaultsAndProceed() {
        closeValidationModal();
        if (window.Sprint2 && window.Sprint2.validationGate) {
            window.Sprint2.validationGate.applyDefaults();
            console.log('✅ Applied defaults to incomplete faces');
            // Now try to proceed - call via global
            if (typeof global.completeStep1 === 'function') {
                global.completeStep1();
            }
        }
    }

    /**
     * Focus on first incomplete face
     */
    function focusOnIncompleteFace() {
        if (window.Sprint2 && window.Sprint2.validationGate) {
            const validation = window.Sprint2.validationGate.validate();
            if (validation.faceGuidance && validation.faceGuidance.length > 0) {
                const firstIncomplete = validation.faceGuidance[0];
                const faceInput = document.querySelector(`#face-input-${firstIncomplete.faceId}`);
                if (faceInput) {
                    faceInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    faceInput.focus();
                    // Add red highlight
                    faceInput.style.borderColor = '#ff6b6b';
                    faceInput.style.boxShadow = '0 0 10px rgba(255, 107, 107, 0.5)';
                }
            }
        }
    }

    /**
     * Update progress bar
     */
    function updateProgress() {
        const state = global.demoState;
        // Step 0 = 0%, Step 1 = 25%, Step 2 = 50%, Step 3 = 75%, Step 4 = 100%
        const progressPercent = (state.currentStep / (state.totalSteps - 1)) * 100;
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            progressBar.style.width = `${progressPercent}%`;
        }
    }

    // ========================================
    // EXPORTS
    // ========================================

    // Initialization
    global.initializeDemo = initializeDemo;
    global.highlightTemplateOptions = highlightTemplateOptions;

    // Navigation
    global.goToStep = goToStep;
    global.updateProgress = updateProgress;

    // Validation dialogs
    global.showValidationBlockDialog = showValidationBlockDialog;
    global.closeValidationModal = closeValidationModal;
    global.applyDefaultsAndProceed = applyDefaultsAndProceed;
    global.focusOnIncompleteFace = focusOnIncompleteFace;

    console.log('[orchestrator-navigation] Module loaded');

})(typeof window !== 'undefined' ? window : this);
