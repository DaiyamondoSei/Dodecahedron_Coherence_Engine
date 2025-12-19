/**
 * ════════════════════════════════════════════════════════════════════════════
 * OCTAVE DNA - DIAGNOSTIC PANEL CONTROLLER
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Controls the diagnostic panel that appears when clicking a DNA helix.
 * Manages tab switching, panel visibility, and close functionality.
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                        NOTES FOR FUTURE CLAUDE                          │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * PANEL STRUCTURE:
 * ─────────────────────────────────────────────────────────────────────────
 * The diagnostic panel has:
 *   1. Header with title and close button
 *   2. Tab navigation (Breath Analysis, Pentagram, etc.)
 *   3. Tab content areas that switch based on selection
 *
 * SHOW/HIDE MECHANISM:
 * ─────────────────────────────────────────────────────────────────────────
 * Panel uses CSS class 'show' for visibility:
 *   • Adding 'show' -> panel slides in
 *   • Removing 'show' -> panel slides out
 *
 * TAB SWITCHING:
 * ─────────────────────────────────────────────────────────────────────────
 * Tabs use 'active' class for both tab button and content:
 *   1. Click tab -> Remove 'active' from all tabs/contents
 *   2. Add 'active' to clicked tab and matching content
 *   3. If pentagram tab, trigger recalculation
 *
 * NAVIGATION MAP:
 * ─────────────────────────────────────────────────────────────────────────
 * ├─ DEPENDS ON:
 * │  ├─ OctaveDNAState (selectedHelix)
 * │  ├─ breath-tab.js (updateBreathTab)
 * │  └─ pentagram-tab.js (calculatePentagramAnalysis)
 * │
 * └─ USED BY:
 *    ├─ mouse-handler.js (showDiagnosticPanel on click)
 *    └─ octave-dna-main.js (initPanels on startup)
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │                     WHAT THIS SESSION LEARNED                         │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * 1. Panel should delegate content generation to specialized tab modules
 *    (breath-tab.js, pentagram-tab.js) rather than containing all logic.
 *
 * 2. Tab switching needs to trigger data recalculation for dynamic tabs
 *    like the pentagram visualization.
 *
 * 3. The close button should also stop any running pentagram animations
 *    to prevent orphaned animation loops.
 *
 * ════════════════════════════════════════════════════════════════════════════
 * @version 1.0.0 - Extracted from octave-dna.html monolith
 * @created 2025-12-19
 */

(function() {
    'use strict';

    // ════════════════════════════════════════════════════════════════════════
    // PANEL VISIBILITY
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Show the diagnostic panel for a selected helix
     *
     * Opens the panel and populates it with helix data.
     * Delegates content generation to specialized tab modules.
     *
     * @param {Object} helix - The helix configuration object
     */
    function showDiagnosticPanel(helix) {
        const panel = document.getElementById('diagnosticPanel');
        const title = document.getElementById('panelTitle');

        if (!panel) {
            console.warn('⚠️ [Panel] Diagnostic panel element not found');
            return;
        }

        // Update title
        if (title) {
            title.textContent = helix.name.toUpperCase();
        }

        // Store selected helix in state
        const State = window.OctaveDNAState;
        if (State) {
            State.setState('selectedHelix', helix);
        }

        // Update breath tab content (via breath-tab.js)
        if (window.OctaveDNABreathTab?.updateBreathTab) {
            window.OctaveDNABreathTab.updateBreathTab(helix);
        }

        // Show panel with animation
        panel.classList.add('show');

        console.log(`📊 [Panel] Showing diagnostic panel for ${helix.name}`);

        // Emit custom event
        document.dispatchEvent(new CustomEvent('octave-dna:panel-opened', {
            detail: { helix }
        }));
    }

    /**
     * Close the diagnostic panel
     *
     * Hides the panel and clears selection.
     * Stops any running pentagram animations.
     */
    function closePanel() {
        const panel = document.getElementById('diagnosticPanel');

        if (panel) {
            panel.classList.remove('show');
        }

        // Clear selected helix
        const State = window.OctaveDNAState;
        if (State) {
            State.setState('selectedHelix', null);
        }

        // Stop pentagram animation if running
        if (window.OctaveDNAPentagramTab?.stopPentagram) {
            window.OctaveDNAPentagramTab.stopPentagram();
        }

        console.log('📊 [Panel] Diagnostic panel closed');

        // Emit custom event
        document.dispatchEvent(new CustomEvent('octave-dna:panel-closed'));
    }

    /**
     * Check if panel is currently open
     * @returns {boolean}
     */
    function isPanelOpen() {
        const panel = document.getElementById('diagnosticPanel');
        return panel?.classList.contains('show') || false;
    }

    // ════════════════════════════════════════════════════════════════════════
    // TAB SWITCHING
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Initialize tab switching functionality
     *
     * Attaches click handlers to tab buttons for content switching.
     */
    function initTabSwitching() {
        const tabs = document.querySelectorAll('.panel-tab');
        const tabContents = document.querySelectorAll('.tab-content');

        if (tabs.length === 0) {
            console.log('📊 [Panel] No tabs found to initialize');
            return;
        }

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(tc => tc.classList.remove('active'));

                // Add active class to clicked tab
                tab.classList.add('active');

                // Show corresponding content
                const tabName = tab.dataset.tab;
                const content = document.getElementById(`${tabName}Tab`);
                if (content) {
                    content.classList.add('active');
                }

                // Handle special tab logic
                handleTabSwitch(tabName);
            });
        });

        console.log(`📊 [Panel] Tab switching initialized (${tabs.length} tabs)`);
    }

    /**
     * Handle tab-specific logic when switching
     *
     * @param {string} tabName - Name of the tab being switched to
     */
    function handleTabSwitch(tabName) {
        const State = window.OctaveDNAState;
        const selectedHelix = State?.getState('selectedHelix');

        if (tabName === 'pentagram' && selectedHelix) {
            // Trigger pentagram calculation when switching to that tab
            if (window.OctaveDNAPentagramTab?.calculatePentagramAnalysis) {
                window.OctaveDNAPentagramTab.calculatePentagramAnalysis(selectedHelix);
            }
        }

        // Emit tab switch event
        document.dispatchEvent(new CustomEvent('octave-dna:tab-switched', {
            detail: { tabName, helix: selectedHelix }
        }));
    }

    /**
     * Switch to a specific tab programmatically
     *
     * @param {string} tabName - Name of the tab to switch to
     */
    function switchToTab(tabName) {
        const tab = document.querySelector(`.panel-tab[data-tab="${tabName}"]`);
        if (tab) {
            tab.click();
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // CLOSE BUTTON HANDLER
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Initialize close button handler
     */
    function initCloseButton() {
        const closeBtn = document.getElementById('closePanel');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                closePanel();
            });
            console.log('📊 [Panel] Close button handler attached');
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // INITIALIZATION
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Initialize all panel functionality
     */
    function initPanels() {
        initCloseButton();
        initTabSwitching();
        console.log('📊 [Panel] Diagnostic panel system initialized');
    }

    // ════════════════════════════════════════════════════════════════════════
    // BROWSER GLOBAL EXPORT
    // ════════════════════════════════════════════════════════════════════════

    if (typeof window !== 'undefined') {
        window.OctaveDNAPanels = {
            // Visibility
            showDiagnosticPanel,
            closePanel,
            isPanelOpen,

            // Tabs
            initTabSwitching,
            switchToTab,

            // Initialization
            initPanels,
            initCloseButton
        };

        console.log('📊 [OctaveDNA Panels] Controller module loaded');
    }

})();
