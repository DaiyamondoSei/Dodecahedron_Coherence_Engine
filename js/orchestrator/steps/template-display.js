/**
 * ========================================
 * MODULE: template-display.js
 * ========================================
 *
 * TEMPLATE LOADING NOTIFICATIONS & UI
 *
 * Handles the visual feedback when a company template is loaded:
 * - Success notification (top-right toast)
 * - Template grid visibility management
 * - "Choose Different Template" reset functionality
 *
 * Extracted from: orchestrator-steps.js (lines 440-577)
 * Date: December 18, 2025
 *
 * ========================================
 * NOTES FOR FUTURE CLAUDE
 * ========================================
 *
 * 1. NOTIFICATION LIFECYCLE:
 *    showCompanyLoadedNotification() creates a floating toast that:
 *    - Appears at top-right with slide-in animation
 *    - Auto-dismisses after 5 seconds with fade-out
 *    - Shows company name, octave stage, archetype, and breath name
 *
 * 2. TEMPLATE GRID HIDING:
 *    When a company template is selected, we hide the generic template
 *    grid to prevent users from accidentally overwriting their custom
 *    face names. The banner provides a "Choose Different Template" button.
 *
 * 3. INLINE EVENT HANDLER:
 *    The banner includes an inline onclick for resetToTemplateSelection().
 *    This function MUST be exported to window for the button to work.
 *    Line 527 (original): onclick="resetToTemplateSelection()"
 *
 * 4. DOM DEPENDENCIES:
 *    - .template-grid: The grid of template cards
 *    - #step1: Step 1 content container
 *    - #company-preloaded-banner: Banner inserted by this module
 *    - #faceEditorSection: Face editor section to hide on reset
 *    - .info-box: Element before which banner is inserted
 *
 * ========================================
 * DEPENDENCIES
 * ========================================
 * - js/orchestrator/orchestrator-state.js (demoState)
 *
 * ========================================
 * EXPORTS (to window/global)
 * ========================================
 * - showCompanyLoadedNotification(mappingContext)
 * - hideTemplateGridForPreloadedCompany(mappingContext)
 * - resetToTemplateSelection()
 *
 * ========================================
 */
(function(global) {
    'use strict';

    // ========================================
    // COMPANY LOADING NOTIFICATIONS
    // ========================================

    /**
     * Show notification that company data was loaded.
     *
     * Creates a floating toast notification at top-right showing:
     * - Company name and icon
     * - Octave stage and archetype
     * - Dominant breath name
     * - Checklist of what was loaded
     *
     * Auto-dismisses after 5 seconds with fade animation.
     *
     * @param {Object} mappingContext - Loaded company mapping context
     * @param {string} mappingContext.displayName - Company display name
     * @param {string} mappingContext.octaveStage - Current octave stage
     * @param {string} mappingContext.archetype - Company archetype
     * @param {string} mappingContext.dominantBreathName - Dominant breath axis name
     * @param {Array} mappingContext.faces - Array of face objects
     */
    function showCompanyLoadedNotification(mappingContext) {
        const notification = document.createElement('div');
        notification.id = 'company-loaded-notification';
        notification.innerHTML = `
            <div style="position: fixed; top: 100px; right: 20px; z-index: 2000;
                        background: rgba(0, 255, 204, 0.15); border: 1px solid rgba(0, 255, 204, 0.4);
                        border-radius: 12px; padding: 20px; max-width: 350px;
                        animation: slideIn 0.5s ease;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <span style="font-size: 32px;">${mappingContext.faces[0]?.icon || '🏢'}</span>
                    <div>
                        <div style="font-weight: 600; color: #00ffcc; font-size: 16px;">
                            ${mappingContext.displayName} Loaded
                        </div>
                        <div style="font-size: 12px; color: rgba(255,255,255,0.7); margin-top: 4px;">
                            ${mappingContext.octaveStage} • ${mappingContext.archetype}
                        </div>
                        <div style="font-size: 11px; color: rgba(255,255,255,0.5); margin-top: 4px; font-style: italic;">
                            "${mappingContext.dominantBreathName}"
                        </div>
                    </div>
                </div>
                <div style="margin-top: 12px; font-size: 11px; color: rgba(255,255,255,0.6);">
                    ✅ All 12 faces pre-configured<br>
                    ✅ KPIs and metrics loaded<br>
                    ✅ Ready to explore the journey
                </div>
            </div>
        `;
        document.body.appendChild(notification);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.5s ease';
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    }

    // ========================================
    // TEMPLATE GRID VISIBILITY
    // ========================================

    /**
     * Hide template grid when company data is pre-loaded.
     *
     * This prevents users from accidentally clicking generic templates
     * which would overwrite the custom company face names.
     *
     * Inserts a banner showing:
     * - Company icon and name
     * - Octave stage and archetype
     * - "Choose Different Template" button
     *
     * @param {Object} mappingContext - Loaded company mapping context
     */
    function hideTemplateGridForPreloadedCompany(mappingContext) {
        const templateGrid = document.querySelector('.template-grid');
        const step1Content = document.getElementById('step1');

        if (!templateGrid || !step1Content) return;

        // Hide the template grid
        templateGrid.style.display = 'none';

        // Hide the "Select a Template" header
        const templateHeader = step1Content.querySelector('h3');
        if (templateHeader && templateHeader.textContent.includes('Select a Template')) {
            templateHeader.style.display = 'none';
        }

        // Add a "company loaded" banner at the top of Step 1
        const existingBanner = document.getElementById('company-preloaded-banner');
        if (existingBanner) existingBanner.remove();

        const banner = document.createElement('div');
        banner.id = 'company-preloaded-banner';
        banner.innerHTML = `
            <div style="background: linear-gradient(135deg, rgba(0, 255, 204, 0.15), rgba(147, 112, 219, 0.15));
                        border: 1px solid rgba(0, 255, 204, 0.3); border-radius: 12px; padding: 20px;
                        margin-bottom: 20px; display: flex; align-items: center; gap: 15px;">
                <div style="font-size: 40px;">${mappingContext.faces[0]?.icon || '🏢'}</div>
                <div style="flex: 1;">
                    <div style="font-size: 18px; font-weight: 600; color: #00ffcc;">
                        ${mappingContext.displayName} Template Loaded
                    </div>
                    <div style="font-size: 13px; color: rgba(255,255,255,0.7); margin-top: 4px;">
                        ${mappingContext.octaveStage} • ${mappingContext.archetype} • 12 custom faces pre-configured
                    </div>
                    <div style="font-size: 12px; color: rgba(255,255,255,0.5); margin-top: 8px; font-style: italic;">
                        Review the faces below and click "Next" when ready
                    </div>
                </div>
                <button onclick="resetToTemplateSelection()"
                        style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
                               border-radius: 8px; padding: 8px 16px; color: rgba(255,255,255,0.7);
                               cursor: pointer; font-size: 12px; transition: all 0.3s;">
                    Choose Different Template
                </button>
            </div>
        `;

        // Insert banner before the info-box
        const infoBox = step1Content.querySelector('.info-box');
        if (infoBox) {
            infoBox.parentNode.insertBefore(banner, infoBox);
        }

        console.log('✅ Template grid hidden for pre-loaded company');
    }

    // ========================================
    // TEMPLATE RESET
    // ========================================

    /**
     * Reset to template selection.
     *
     * Called when user clicks "Choose Different Template" button.
     * Restores the template grid, clears loaded company data,
     * and resets the wizard to initial state.
     *
     * This function is called from an inline onclick handler
     * in the banner created by hideTemplateGridForPreloadedCompany().
     */
    function resetToTemplateSelection() {
        const demoState = global.demoState;

        // Show the template grid again
        const templateGrid = document.querySelector('.template-grid');
        if (templateGrid) templateGrid.style.display = 'grid';

        // Show the "Select a Template" header
        const step1Content = document.getElementById('step1');
        const templateHeader = step1Content?.querySelector('h3');
        if (templateHeader) templateHeader.style.display = 'block';

        // Remove the preloaded banner
        const banner = document.getElementById('company-preloaded-banner');
        if (banner) banner.remove();

        // Clear company data
        demoState.selectedCompanyId = null;
        demoState.loadedMappingContext = null;
        demoState.faceConfig = null;
        demoState.kpiData = [];
        demoState.coherenceResults = null;
        demoState.completedSteps = [0];

        // Clear face editor
        const faceEditorSection = document.getElementById('faceEditorSection');
        if (faceEditorSection) faceEditorSection.style.display = 'none';

        console.log('✅ Reset to template selection');
    }

    // ========================================
    // EXPORTS
    // ========================================

    global.showCompanyLoadedNotification = showCompanyLoadedNotification;
    global.hideTemplateGridForPreloadedCompany = hideTemplateGridForPreloadedCompany;
    global.resetToTemplateSelection = resetToTemplateSelection;

    console.log('[template-display] Module loaded');

})(typeof window !== 'undefined' ? window : this);
