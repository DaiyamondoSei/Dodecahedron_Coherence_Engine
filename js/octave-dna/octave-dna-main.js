/**
 * ════════════════════════════════════════════════════════════════════════════
 * OCTAVE DNA - MAIN ORCHESTRATOR
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Thin orchestrator that coordinates all Octave DNA modules.
 * This is the entry point that initializes the visualization system.
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                        NOTES FOR FUTURE CLAUDE                          │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * ARCHITECTURE OVERVIEW:
 * ─────────────────────────────────────────────────────────────────────────
 * This file follows the "thin orchestrator" pattern. It contains minimal
 * logic - only coordination between specialized modules. Each module
 * handles its own domain:
 *
 *   State       → Central data registry (facesData, scene objects)
 *   Scene       → THREE.js initialization (camera, renderer, fog)
 *   Lighting    → Ambient and point lights
 *   Geometry    → DNA helix creation and rendering
 *   Interaction → Mouse/touch handling, legend clicks
 *   Animation   → Render loop, auto-rotate
 *   Panels      → Diagnostic panel UI and tabs
 *   Company     → Company data loading and switching
 *
 * INITIALIZATION SEQUENCE:
 * ─────────────────────────────────────────────────────────────────────────
 * 1. Wait for DOMContentLoaded
 * 2. Initialize Scene (camera, renderer, fog, controls)
 * 3. Initialize Lighting (ambient, point lights)
 * 4. Load company data and faces
 * 5. Render DNA helixes
 * 6. Initialize interaction handlers
 * 7. Initialize panels and company dropdown
 * 8. Start animation loop
 * 9. Optionally start auto-refresh
 *
 * IFRAME EMBEDDING:
 * ─────────────────────────────────────────────────────────────────────────
 * When embedded in an iframe (window !== window.top), the header is hidden
 * and iframe communication is enabled for parent-child messaging.
 *
 * NAVIGATION MAP:
 * ─────────────────────────────────────────────────────────────────────────
 * ├─ COORDINATES:
 * │  ├─ state/octave-dna-state.js
 * │  ├─ scene/scene-setup.js
 * │  ├─ scene/scene-lighting.js
 * │  ├─ visualization/helix-geometry.js
 * │  ├─ visualization/helix-helpers.js
 * │  ├─ visualization/helix-rungs.js
 * │  ├─ interaction/mouse-handler.js
 * │  ├─ interaction/legend-handler.js
 * │  ├─ animation/animation-loop.js
 * │  ├─ panels/diagnostic-panel.js
 * │  ├─ panels/breath-tab.js
 * │  ├─ panels/pentagram-tab.js
 * │  ├─ company/company-dropdown.js
 * │  └─ company/company-loader.js
 * │
 * └─ CALLED BY:
 *    └─ pages/octave-dna.html (on DOMContentLoaded)
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │                     WHAT THIS SESSION LEARNED                         │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * 1. Thin orchestrators should delegate ALL logic to specialized modules.
 *    If you find yourself writing business logic here, it belongs elsewhere.
 *
 * 2. The initialization sequence matters. Scene must exist before lighting.
 *    Company data must load before rendering. Animation starts last.
 *
 * 3. Iframe detection enables seamless embedding in the main dashboard.
 *    The header hides automatically, and postMessage enables coordination.
 *
 * ════════════════════════════════════════════════════════════════════════════
 * @version 1.0.0 - Extracted from octave-dna.html monolith
 * @created 2025-12-19
 */

(function() {
    'use strict';

    // ════════════════════════════════════════════════════════════════════════
    // MODULE REFERENCES
    // ════════════════════════════════════════════════════════════════════════

    // These will be populated from window globals after DOM loads
    let State, Scene, Lighting, Geometry, Mouse, Legend, Animation, Panels, CompanyDropdown, CompanyLoader;

    // ════════════════════════════════════════════════════════════════════════
    // INITIALIZATION
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Main initialization function
     * Coordinates all modules in the correct sequence
     */
    async function init() {
        console.log(`
╔═══════════════════════════════════════════════════════════════╗
║  🧬 OCTAVE DNA VISUALIZATION                                  ║
║  ─────────────────────────────────────────────────────────    ║
║  Organizational DNA through Sacred Geometry                   ║
║  φ-normalized coherence analysis                              ║
╚═══════════════════════════════════════════════════════════════╝
        `);

        // Gather module references
        gatherModuleReferences();

        // Check required modules
        if (!validateModules()) {
            console.error('❌ [Main] Required modules not loaded. Aborting initialization.');
            showLoadingError('Required modules failed to load');
            return;
        }

        try {
            // Show loading indicator
            showLoading(true);

            // Step 1: Initialize Scene (camera, renderer, controls)
            if (Scene?.initScene) {
                Scene.initScene();
                console.log('✅ [Main] Scene initialized');
            }

            // Step 2: Initialize Lighting
            if (Lighting?.initLighting) {
                Lighting.initLighting();
                console.log('✅ [Main] Lighting initialized');
            }

            // Step 3: Check for iframe embedding
            handleIframeEmbedding();

            // Step 4: Load company data and initialize Quannex
            await loadCompanyData();

            // Step 5: Render DNA visualization
            if (Geometry?.renderDNA) {
                Geometry.renderDNA();
                console.log('✅ [Main] DNA helixes rendered');
            }

            // Step 6: Initialize interaction handlers
            if (Mouse?.initMouseHandlers) {
                Mouse.initMouseHandlers();
                console.log('✅ [Main] Mouse handlers initialized');
            }

            if (Legend?.attachLegendHandlers) {
                Legend.attachLegendHandlers();
                console.log('✅ [Main] Legend handlers initialized');
            }

            // Step 7: Initialize panels
            if (Panels?.initPanels) {
                Panels.initPanels();
                console.log('✅ [Main] Diagnostic panels initialized');
            }

            // Step 8: Initialize company dropdown
            if (CompanyDropdown?.initCompanyDropdown) {
                CompanyDropdown.initCompanyDropdown();
                console.log('✅ [Main] Company dropdown initialized');
            }

            // Step 9: Initialize iframe communication
            if (CompanyLoader?.initIframeCommunication) {
                CompanyLoader.initIframeCommunication();
                console.log('✅ [Main] Iframe communication initialized');
            }

            // Step 10: Initialize resize handler
            if (Animation?.initResizeHandler) {
                Animation.initResizeHandler();
                console.log('✅ [Main] Resize handler initialized');
            }

            // Step 11: Start animation loop
            if (Animation?.startAnimation) {
                Animation.startAnimation();
                console.log('✅ [Main] Animation loop started');
            }

            // Step 12: Start auto-refresh (optional - for live data updates)
            // CompanyLoader?.startAutoRefresh(2000);

            // Hide loading indicator
            showLoading(false);

            // Log completion
            console.log(`
🧬 ═══════════════════════════════════════════════════════════════
🧬 OCTAVE DNA VISUALIZATION READY
🧬 ═══════════════════════════════════════════════════════════════
🧬 ✨ Simplicity is the ultimate sophistication
🧬 ═══════════════════════════════════════════════════════════════
            `);

            // Emit ready event
            document.dispatchEvent(new CustomEvent('octave-dna:ready'));

        } catch (error) {
            console.error('❌ [Main] Initialization failed:', error);
            showLoadingError('Initialization failed: ' + error.message);
        }
    }

    /**
     * Gather references to all module globals
     */
    function gatherModuleReferences() {
        State = window.OctaveDNAState;
        Scene = window.OctaveDNAScene;
        Lighting = window.OctaveDNALighting;
        Geometry = window.OctaveDNAGeometry;
        Mouse = window.OctaveDNAMouse;
        Legend = window.OctaveDNALegend;
        Animation = window.OctaveDNAAnimation;
        Panels = window.OctaveDNAPanels;
        CompanyDropdown = window.OctaveDNACompanyDropdown;
        CompanyLoader = window.OctaveDNACompanyLoader;
    }

    /**
     * Validate that required modules are loaded
     * @returns {boolean} True if all required modules present
     */
    function validateModules() {
        const required = [
            { name: 'State', module: State },
            { name: 'Scene', module: Scene },
            { name: 'Geometry', module: Geometry },
            { name: 'Animation', module: Animation }
        ];

        let allPresent = true;
        required.forEach(({ name, module }) => {
            if (!module) {
                console.error(`❌ [Main] Missing required module: ${name}`);
                allPresent = false;
            }
        });

        return allPresent;
    }

    // ════════════════════════════════════════════════════════════════════════
    // IFRAME HANDLING
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Handle iframe embedding (hide header, enable communication)
     */
    function handleIframeEmbedding() {
        const isIframe = window !== window.top;

        if (isIframe) {
            // Hide header when embedded
            const header = document.querySelector('.header');
            if (header) {
                header.style.display = 'none';
                console.log('📱 [Main] Running in iframe - header hidden');
            }
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // COMPANY DATA LOADING
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Load company data and initialize face values
     *
     * PRIORITY ORDER:
     * 1. Check sessionStorage for customCompanyData (from demo orchestrator)
     * 2. Check window.CompanyLoader for template companies
     * 3. Fall back to mock data
     */
    async function loadCompanyData() {
        // ═══════════════════════════════════════════════════════════════════
        // PRIORITY 1: Check for custom company data from demo orchestrator
        // ═══════════════════════════════════════════════════════════════════
        try {
            const customDataJson = sessionStorage.getItem('customCompanyData');
            if (customDataJson) {
                const customData = JSON.parse(customDataJson);
                console.log('📦 [Main] Found customCompanyData in sessionStorage');

                if (window.Quannex && customData.kpis && customData.kpis.length > 0) {
                    // Initialize Quannex with custom data
                    await window.Quannex.initWithCompany({
                        name: customData.name || 'Custom Company',
                        faceConfig: customData.faceConfig,
                        kpis: customData.kpis,
                        breathAxes: customData.breathAxes
                    });

                    const facesData = window.Quannex.getFaces();
                    State?.setState('facesData', facesData);

                    // Update DNA helices with custom breath axes
                    if (customData.breathAxes && CompanyLoader?.updateDNAHelicesConfig) {
                        CompanyLoader.updateDNAHelicesConfig(
                            { id: 'custom', name: customData.name },
                            facesData,
                            customData.breathAxes
                        );
                    }

                    console.log(`✅ [Main] Loaded ${facesData.length} faces from custom data`);
                    console.log(`📊 [Main] Custom coherence: ${(customData.coherenceResults?.global || 0) * 100}%`);
                    return; // Custom data loaded successfully
                }
            }
        } catch (error) {
            console.warn('⚠️ [Main] Failed to load custom data:', error);
        }

        // ═══════════════════════════════════════════════════════════════════
        // PRIORITY 2: Check for template companies via CompanyLoader
        // ═══════════════════════════════════════════════════════════════════
        if (window.CompanyLoader) {
            try {
                // Get current company or load first available
                let company = window.CompanyLoader.getCurrentCompany();
                if (!company || !company.name) {
                    const companies = window.CompanyLoader.getAvailableCompanies() || [];
                    if (companies.length > 0) {
                        const context = await window.CompanyLoader.loadCompany(companies[0].id);
                        company = context?.company || context;
                    }
                }

                // Get faces from Quannex
                if (window.Quannex && company) {
                    const facesData = window.Quannex.getFaces();
                    State?.setState('facesData', facesData);
                    console.log(`✅ [Main] Loaded ${facesData.length} faces for ${company.name}`);
                    return;
                }
            } catch (error) {
                console.warn('⚠️ [Main] Company data loading failed:', error);
            }
        }

        // ═══════════════════════════════════════════════════════════════════
        // PRIORITY 3: Fall back to mock data
        // ═══════════════════════════════════════════════════════════════════
        loadMockFacesData();
    }

    /**
     * Load mock faces data for standalone testing
     */
    function loadMockFacesData() {
        const mockFaces = [];
        for (let i = 1; i <= 12; i++) {
            mockFaces.push({
                id: i,
                name: `Face ${i}`,
                energy: 0.3 + Math.random() * 0.5  // Random 0.3-0.8
            });
        }
        State?.setState('facesData', mockFaces);
        console.log('📊 [Main] Using mock faces data (12 faces)');
    }

    // ════════════════════════════════════════════════════════════════════════
    // LOADING INDICATOR
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Show/hide loading indicator
     * @param {boolean} show - Whether to show loading
     */
    function showLoading(show) {
        const loadingEl = document.getElementById('loading');
        if (loadingEl) {
            loadingEl.style.display = show ? 'flex' : 'none';
        }
    }

    /**
     * Show loading error message
     * @param {string} message - Error message to display
     */
    function showLoadingError(message) {
        const loadingEl = document.getElementById('loading');
        if (loadingEl) {
            loadingEl.innerHTML = `
                <div class="spinner"></div>
                <div class="loading-text" style="color: #ff6666;">Error: ${message}</div>
            `;
            loadingEl.style.display = 'flex';
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // PUBLIC API
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Refresh the DNA visualization
     */
    function refresh() {
        if (Geometry?.refreshDNA) {
            Geometry.refreshDNA();
        }
    }

    /**
     * Re-render the entire DNA visualization
     */
    function rerender() {
        if (Geometry?.renderDNA) {
            Geometry.renderDNA();
        }
    }

    /**
     * Get current state
     * @param {string} key - State key
     * @returns {*} State value
     */
    function getState(key) {
        return State?.getState(key);
    }

    /**
     * Toggle auto-rotate
     */
    function toggleRotation() {
        if (Animation?.toggleAutoRotate) {
            Animation.toggleAutoRotate();
        }
    }

    /**
     * Show diagnostic panel for a helix
     * @param {number} helixIndex - Index of helix (0-5)
     */
    function showPanel(helixIndex) {
        const dnaHelices = State?.getState('dnaHelices') || State?._state?.dnaHelices || [];
        if (dnaHelices[helixIndex] && Panels?.showDiagnosticPanel) {
            Panels.showDiagnosticPanel(dnaHelices[helixIndex]);
        }
    }

    /**
     * Close diagnostic panel
     */
    function closePanel() {
        if (Panels?.closePanel) {
            Panels.closePanel();
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // BROWSER GLOBAL EXPORT
    // ════════════════════════════════════════════════════════════════════════

    if (typeof window !== 'undefined') {
        window.OctaveDNAViz = {
            // Lifecycle
            init,
            refresh,
            rerender,

            // State
            getState,

            // UI
            toggleRotation,
            showPanel,
            closePanel,

            // Module access (for debugging)
            modules: {
                get State() { return State; },
                get Scene() { return Scene; },
                get Lighting() { return Lighting; },
                get Geometry() { return Geometry; },
                get Mouse() { return Mouse; },
                get Legend() { return Legend; },
                get Animation() { return Animation; },
                get Panels() { return Panels; },
                get CompanyDropdown() { return CompanyDropdown; },
                get CompanyLoader() { return CompanyLoader; }
            }
        };

        console.log('🎯 [OctaveDNA Main] Orchestrator loaded');

        // Auto-initialize on DOMContentLoaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            // DOM already loaded
            init();
        }
    }

})();
