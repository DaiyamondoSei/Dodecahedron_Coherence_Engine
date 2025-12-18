/**
 * ========================================
 * MODULE: face-configuration.js
 * ========================================
 *
 * STEP 1 - FACE CONFIGURATION & DEFINITION
 *
 * Handles the face editor UI, face validation, and Step 1 completion.
 * Also includes the "Start Fresh" entry points (manual/AI modes).
 *
 * Extracted from: orchestrator-steps.js (lines 579-821)
 * Date: December 18, 2025
 *
 * ========================================
 * NOTES FOR FUTURE CLAUDE
 * ========================================
 *
 * 1. FACE EDITOR UI:
 *    populateFaceEditor() generates a grid of 12 face inputs.
 *    Each input has:
 *    - data-face-id attribute (1-12)
 *    - Pre-filled value from demoState.faceConfig.faces
 *    - Octave indicator (O1-O7)
 *
 * 2. TWO ENTRY POINTS FOR FRESH START:
 *    A) startFreshManual():
 *       - User enters face names manually
 *       - setupMode = 'manual'
 *       - Navigates to Step 1 with empty face editor
 *
 *    B) startFreshAI():
 *       - User enters company story
 *       - setupMode = 'ai-assisted'
 *       - Navigates to Step 1 and auto-selects 'story' template
 *       - AI extracts face names from story text
 *
 * 3. VALIDATION GATE:
 *    completeStep1() checks two things:
 *    A) Local validation: All 12 faces must have names (validateFaces)
 *    B) Sprint 2 validation: If Sprint2.validationGate exists, checks
 *       canProceed() unless in template flow (already complete).
 *
 *    EXCEPTION: Template flow skips Sprint2 validation because
 *    steps [0,1,2,3] are already marked complete.
 *
 * 4. MAPPING CONTEXT SYNC:
 *    completeStep1() syncs face configuration to Sprint2.mappingContext
 *    BEFORE checking validation gate. This ensures validation sees
 *    the current face data, not stale data.
 *
 * 5. markStepCompleted():
 *    - Adds step number to demoState.completedSteps array
 *    - Updates UI by adding 'completed' class to step button
 *    - IMPORTANT: This function is used by MANY modules, so it's
 *      exported globally. Don't rename or change signature.
 *
 * 6. getFaceConfiguration():
 *    Reads the 12 face inputs from DOM and returns structured object:
 *    {
 *      templateName: string,
 *      faces: [{ id, name, icon, octave }, ...]
 *    }
 *
 * ========================================
 * DEPENDENCIES
 * ========================================
 * - js/orchestrator/orchestrator-state.js (demoState)
 * - js/orchestrator/orchestrator-navigation.js (goToStep, showValidationBlockDialog)
 * - js/orchestrator/steps/template-selection.js (selectTemplate) [optional]
 *
 * ========================================
 * EXPORTS (to window/global)
 * ========================================
 * - populateFaceEditor()
 * - startFreshManual()
 * - startFreshAI()
 * - markStepCompleted(stepNumber)
 * - completeStep1()
 * - validateFaces()
 * - getFaceConfiguration()
 *
 * ========================================
 */
(function(global) {
    'use strict';

    // ========================================
    // FACE EDITOR
    // ========================================

    /**
     * Populate the face editor with pre-loaded data.
     *
     * Generates HTML for 12 face inputs with:
     * - Face number badge
     * - Pre-filled value from faceConfig
     * - Octave indicator
     * - Success styling (green border)
     */
    function populateFaceEditor() {
        const demoState = global.demoState;

        if (!demoState.faceConfig) return;

        // Generate face grid HTML
        const faceGrid = document.getElementById('faceGrid');
        if (!faceGrid) return;

        let html = '';
        demoState.faceConfig.faces.forEach(face => {
            html += `
                <div class="face-item" style="background: rgba(0, 255, 204, 0.1); border-color: rgba(0, 255, 204, 0.3);">
                    <span class="face-number">${face.id}</span>
                    <input
                        type="text"
                        class="face-input"
                        id="face-input-${face.id}"
                        value="${face.name}"
                        placeholder="Face ${face.id} name"
                        data-face-id="${face.id}"
                        style="border-color: rgba(0, 255, 204, 0.5);"
                    />
                    <span style="font-size: 11px; color: rgba(255,255,255,0.5); margin-left: 8px;">
                        O${face.octave || '?'}
                    </span>
                </div>
            `;
        });

        faceGrid.innerHTML = html;

        // Show the face editor section
        const editorSection = document.getElementById('faceEditorSection');
        if (editorSection) {
            editorSection.style.display = 'block';
        }

        // Enable the Next button
        const nextBtn = document.getElementById('step1NextBtn');
        if (nextBtn) {
            nextBtn.disabled = false;
        }

        console.log('[face-configuration] Face editor populated with pre-loaded data');
    }

    // ========================================
    // FRESH START ENTRY POINTS
    // ========================================

    /**
     * Start fresh with manual setup.
     *
     * Clears any loaded company data and navigates to Step 1
     * with an empty face editor for manual entry.
     */
    function startFreshManual() {
        const demoState = global.demoState;
        const goToStep = global.goToStep;

        console.log('[face-configuration] Starting fresh with manual setup');

        // Mark step 0 as complete
        markStepCompleted(0);

        // Clear any loaded company data
        demoState.selectedCompanyId = null;
        demoState.loadedMappingContext = null;

        // Phase 5: Track setup mode for AI integration
        demoState.setupMode = 'manual';
        sessionStorage.setItem('quannex-setup-mode', 'manual');

        // Navigate to step 1
        goToStep(1);
    }

    /**
     * Start fresh with AI story mode.
     *
     * Navigates to Step 1 and auto-selects the 'story' template
     * which provides AI-powered face extraction from company story.
     */
    function startFreshAI() {
        const demoState = global.demoState;
        const goToStep = global.goToStep;
        const selectTemplate = global.selectTemplate;

        console.log('[face-configuration] Starting fresh with AI story mode');

        // Mark step 0 as complete
        markStepCompleted(0);

        // Clear any loaded company data
        demoState.selectedCompanyId = null;
        demoState.loadedMappingContext = null;

        // Phase 5: Track setup mode for AI integration
        demoState.setupMode = 'ai-assisted';
        sessionStorage.setItem('quannex-setup-mode', 'ai-assisted');

        // Navigate to step 1
        goToStep(1);

        // Select the AI Story template
        setTimeout(() => {
            if (typeof selectTemplate === 'function') {
                selectTemplate('story');
            }
        }, 100);
    }

    // ========================================
    // STEP COMPLETION
    // ========================================

    /**
     * Mark step as completed.
     *
     * Adds step number to completedSteps array and updates UI.
     * This function is used by multiple modules.
     *
     * @param {number} stepNumber - Step number (0-4)
     */
    function markStepCompleted(stepNumber) {
        const demoState = global.demoState;

        if (!demoState.completedSteps.includes(stepNumber)) {
            demoState.completedSteps.push(stepNumber);
        }

        // Update UI
        const stepButton = document.querySelector(`[data-step="${stepNumber}"]`);
        if (stepButton) {
            stepButton.classList.add('completed');
        }
    }

    /**
     * Complete Step 1: Face Definition.
     *
     * Validates faces, syncs to MappingContext, checks Sprint2
     * validation gate, and navigates to Step 2.
     */
    function completeStep1() {
        const demoState = global.demoState;
        const goToStep = global.goToStep;
        const showValidationBlockDialog = global.showValidationBlockDialog;

        // Validate faces (local check)
        const validation = validateFaces();

        if (!validation.valid) {
            alert(validation.message);
            return;
        }

        // Save configuration first
        demoState.faceConfig = getFaceConfiguration();

        // Sprint 2 FIX: Sync faces to MappingContext BEFORE validation check
        if (window.Sprint2 && window.Sprint2.mappingContext) {
            try {
                const facesConfig = demoState.faceConfig.faces.map(face => ({
                    id: face.id,
                    name: face.name,
                    icon: face.icon || '',
                    source: 'user'
                }));
                window.Sprint2.mappingContext.setAllFaces(facesConfig);
                console.log('[face-configuration] Synced faces to MappingContext');
            } catch (err) {
                console.warn('[face-configuration] MappingContext sync failed:', err.message);
            }
        }

        // Sprint 2 FIX: Now check validation gate with updated data
        // EXCEPTION: Skip validation for template flow (all steps already marked complete)
        if (window.Sprint2 && window.Sprint2.validationGate) {
            const isTemplateFlow = demoState.completedSteps.includes(1) &&
                                   demoState.completedSteps.includes(2) &&
                                   demoState.completedSteps.includes(3);

            if (!isTemplateFlow) {
                const gateResult = window.Sprint2.canProceed();
                console.log('[face-configuration] Validation Gate:', gateResult);

                // Block if validation fails - show empowering dialog
                if (!gateResult.canProceed) {
                    showValidationBlockDialog(gateResult);
                    return; // Block navigation
                }
            } else {
                console.log('[face-configuration] Validation Gate: Skipped (template flow)');
            }
        }

        // Mark completed
        markStepCompleted(1);

        // Show success
        console.log('[face-configuration] Step 1 completed:', demoState.faceConfig);

        // Go to next step
        goToStep(2);
    }

    // ========================================
    // VALIDATION & DATA COLLECTION
    // ========================================

    /**
     * Validate faces before completing Step 1.
     *
     * Checks that all 12 face inputs have non-empty values.
     *
     * @returns {{ valid: boolean, message: string }}
     */
    function validateFaces() {
        const inputs = document.querySelectorAll('.face-input[data-face-id]');
        let valid = true;
        let message = '';

        inputs.forEach(input => {
            if (!input.value || input.value.trim() === '') {
                valid = false;
                message = 'Please name all 12 faces before proceeding.';
            }
        });

        return { valid, message };
    }

    /**
     * Get face configuration from form.
     *
     * Reads all 12 face inputs and returns structured configuration.
     *
     * @returns {{ templateName: string, faces: Array<{ id: number, name: string, icon: string, octave: number }> }}
     */
    function getFaceConfiguration() {
        const demoState = global.demoState;
        const faces = [];

        // Use data-face-id selector (consistent with validateFaces and FaceWizard)
        for (let i = 1; i <= 12; i++) {
            const input = document.querySelector(`.face-input[data-face-id="${i}"]`);
            faces.push({
                id: i,
                name: input ? input.value.trim() : `Face ${i}`,
                icon: '',
                octave: demoState.faceConfig?.faces?.[i-1]?.octave || 1
            });
        }

        return {
            templateName: demoState.faceConfig?.templateName || 'Custom Configuration',
            faces: faces
        };
    }

    // ========================================
    // EXPORTS
    // ========================================

    global.populateFaceEditor = populateFaceEditor;
    global.startFreshManual = startFreshManual;
    global.startFreshAI = startFreshAI;
    global.markStepCompleted = markStepCompleted;
    global.completeStep1 = completeStep1;
    global.validateFaces = validateFaces;
    global.getFaceConfiguration = getFaceConfiguration;

    console.log('[face-configuration] Module loaded');

})(typeof window !== 'undefined' ? window : this);
