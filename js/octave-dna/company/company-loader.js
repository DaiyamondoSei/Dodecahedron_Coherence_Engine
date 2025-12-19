/**
 * ════════════════════════════════════════════════════════════════════════════
 * OCTAVE DNA - COMPANY LOADER & VISUALIZATION INIT
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Handles loading company data and initializing/refreshing the DNA visualization.
 * Bridges between CompanyLoader (data source) and OctaveDNA rendering.
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                        NOTES FOR FUTURE CLAUDE                          │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * DATA FLOW:
 * ─────────────────────────────────────────────────────────────────────────
 * 1. CompanyLoader.loadCompany(id) -> raw company data
 * 2. Quannex.initWithCompany(data) -> processed face data
 * 3. updateDNAHelicesConfig() -> maps faces to breath axes
 * 4. OctaveDNAGeometry.renderDNA() -> creates 3D visualization
 *
 * SESSION STORAGE:
 * ─────────────────────────────────────────────────────────────────────────
 * Custom company data can be stored in sessionStorage.customCompanyData
 * This allows testing with different organizational configurations.
 *
 * IFRAME COMMUNICATION:
 * ─────────────────────────────────────────────────────────────────────────
 * When embedded in an iframe, listens for 'message' events:
 *   • LOAD_COMPANY: Load a specific company by ID
 *   • AUTO_REFRESH: Updates visualization with current data
 *
 * AUTO-REFRESH:
 * ─────────────────────────────────────────────────────────────────────────
 * 2-second polling interval refreshes data when page is visible.
 * Visibility change detection pauses/resumes refresh.
 *
 * NAVIGATION MAP:
 * ─────────────────────────────────────────────────────────────────────────
 * ├─ DEPENDS ON:
 * │  ├─ window.CompanyLoader (external)
 * │  ├─ window.Quannex (external)
 * │  ├─ OctaveDNAState (facesData, dnaHelices)
 * │  └─ OctaveDNAGeometry (renderDNA, refreshDNA)
 * │
 * └─ USED BY:
 *    ├─ company-dropdown.js (calls initVisualization on switch)
 *    └─ octave-dna-main.js (initial load)
 *
 * ════════════════════════════════════════════════════════════════════════════
 * @version 1.0.0 - Extracted from octave-dna.html monolith
 * @created 2025-12-19
 */

(function() {
    'use strict';

    // Track currently loaded company to prevent double-loading
    let currentLoadedCompanyId = null;

    // Auto-refresh interval
    let refreshInterval = null;

    // ════════════════════════════════════════════════════════════════════════
    // VISUALIZATION INITIALIZATION
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Initialize visualization (can be called multiple times when switching companies)
     */
    async function initVisualization() {
        const State = window.OctaveDNAState;
        const Geometry = window.OctaveDNAGeometry;

        try {
            // Show loading indicator if present
            const loadingEl = document.getElementById('loading');
            if (loadingEl) {
                loadingEl.style.display = 'flex';
            }

            // Clear existing DNA group
            const existingGroup = State?.getState('dnaGroup');
            const scene = State?.getState('scene');
            if (existingGroup && scene) {
                scene.remove(existingGroup);
                State.setState('dnaGroup', null);
            }

            // Get current company or load first company
            let company = window.CompanyLoader?.getCurrentCompany();
            if (!company || !company.name) {
                const companies = window.CompanyLoader?.getAvailableCompanies() || [];
                if (companies.length > 0) {
                    const firstCompany = companies[0];
                    const context = await window.CompanyLoader.loadCompany(firstCompany.id);
                    company = context?.company || context;
                }
            }

            // Get faces from Quannex
            if (window.Quannex && company) {
                const facesData = window.Quannex.getFaces();
                State?.setState('facesData', facesData);

                console.log('✅ Using Quannex engine for', company.name);
                console.log('📊 Loaded', facesData.length, 'faces');

                // Try to load breath axes from various sources
                let breathAxes = null;

                // 1. Try company templates bundle
                if (window.CompanyTemplatesBundle?.templates && company.id) {
                    const companyData = window.CompanyTemplatesBundle.templates[company.id];
                    if (companyData?.breathAxes) {
                        breathAxes = companyData.breathAxes;
                        console.log('🌬️ Loaded breath axes from template bundle');
                    }
                }

                // Update DNA helix configuration
                updateDNAHelicesConfig(company, facesData, breathAxes);

                currentLoadedCompanyId = company.id;
            }

            // Render DNA
            if (Geometry?.renderDNA) {
                Geometry.renderDNA();
            }

            // Hide loading indicator
            if (loadingEl) {
                loadingEl.style.display = 'none';
            }

            console.log('🧬 DNA Visualization Complete!');
            console.log('✨ Simplicity is the ultimate sophistication');

        } catch (error) {
            console.error('Failed to initialize:', error);
            const loadingEl = document.getElementById('loading');
            if (loadingEl) {
                loadingEl.innerHTML = '<div class="spinner"></div><div class="loading-text">Error loading DNA</div>';
            }
        }
    }

    /**
     * Update DNA helices configuration based on company data
     *
     * @param {Object} company - Company data
     * @param {Array} facesData - Array of face data
     * @param {Array} breathAxes - Optional breath axes configuration
     */
    function updateDNAHelicesConfig(company, facesData, breathAxes) {
        const State = window.OctaveDNAState;
        if (!State) return;

        const dnaHelices = State.getState('dnaHelices') || State._state?.dnaHelices || [];

        // If we have custom breath axes, use them
        if (breathAxes && breathAxes.length === 6) {
            breathAxes.forEach((axis, index) => {
                if (dnaHelices[index]) {
                    dnaHelices[index].faces = axis.faces || dnaHelices[index].faces;
                    dnaHelices[index].names = axis.names || dnaHelices[index].names;
                    if (axis.name) {
                        dnaHelices[index].name = axis.name;
                    }
                }
            });
            console.log('🧬 Updated helix config from breath axes');
        }

        // Try session storage fallback
        else if (typeof sessionStorage !== 'undefined') {
            try {
                const customData = sessionStorage.getItem('customCompanyData');
                if (customData) {
                    const parsed = JSON.parse(customData);
                    if (parsed.breathAxes && parsed.breathAxes.length === 6) {
                        parsed.breathAxes.forEach((axis, index) => {
                            if (dnaHelices[index]) {
                                dnaHelices[index].faces = axis.faces || dnaHelices[index].faces;
                                dnaHelices[index].names = axis.names || dnaHelices[index].names;
                            }
                        });
                        console.log('🧬 Updated helix config from sessionStorage');
                    }
                }
            } catch (e) {
                console.warn('Failed to load sessionStorage breath axes:', e);
            }
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // SESSION STORAGE RELOAD
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Reload custom data from session storage
     * Called when sessionStorage data changes
     */
    function reloadCustomData() {
        console.log('🔄 [Company Loader] Reloading custom data...');

        try {
            const customDataJson = sessionStorage.getItem('customCompanyData');
            if (customDataJson) {
                const parsed = JSON.parse(customDataJson);

                // Update faces in Quannex if available
                if (window.Quannex && (parsed.kpis || parsed.faces)) {
                    // Re-initialize with custom data
                    window.Quannex.initWithCompany({
                        name: parsed.name || 'Custom Company',
                        faceConfig: parsed.faceConfig,
                        kpis: parsed.kpis,
                        breathAxes: parsed.breathAxes
                    });
                }

                // Refresh visualization
                if (window.OctaveDNAGeometry?.refreshDNA) {
                    window.OctaveDNAGeometry.refreshDNA();
                }

                console.log('✅ Custom data reloaded');
            }
        } catch (e) {
            console.warn('Failed to reload custom data:', e);
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // IFRAME MESSAGE HANDLING
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Initialize parent-child communication for iframe embedding
     */
    function initIframeCommunication() {
        window.addEventListener('message', async (event) => {
            const { type, companyId } = event.data;

            if (type === 'LOAD_COMPANY') {
                console.log(`[DNA View] 📨 Received company load request: ${companyId}`);

                // Check if already loaded
                if (currentLoadedCompanyId === companyId) {
                    console.log(`[DNA View] Company "${companyId}" already loaded`);
                    return;
                }

                try {
                    if (window.CompanyLoader) {
                        await window.CompanyLoader.switchCompany(companyId);
                        await initVisualization();
                    }
                } catch (error) {
                    console.error('[DNA View] Failed to load company:', error);
                }
            }
        });

        console.log('📨 [Company Loader] Iframe communication initialized');
    }

    // ════════════════════════════════════════════════════════════════════════
    // AUTO-REFRESH
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Start auto-refresh polling
     *
     * @param {number} intervalMs - Refresh interval in milliseconds (default 2000)
     */
    function startAutoRefresh(intervalMs = 2000) {
        if (refreshInterval) {
            clearInterval(refreshInterval);
        }

        refreshInterval = setInterval(() => {
            // Only refresh if page is visible
            if (!document.hidden) {
                refreshVisualization();
            }
        }, intervalMs);

        // Visibility change detection
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                refreshVisualization();
            }
        });

        console.log(`🔄 [Company Loader] Auto-refresh started (${intervalMs}ms)`);
    }

    /**
     * Stop auto-refresh polling
     */
    function stopAutoRefresh() {
        if (refreshInterval) {
            clearInterval(refreshInterval);
            refreshInterval = null;
            console.log('🔄 [Company Loader] Auto-refresh stopped');
        }
    }

    /**
     * Refresh visualization with current data
     */
    function refreshVisualization() {
        if (window.OctaveDNAGeometry?.refreshDNA) {
            window.OctaveDNAGeometry.refreshDNA();
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // BROWSER GLOBAL EXPORT
    // ════════════════════════════════════════════════════════════════════════

    if (typeof window !== 'undefined') {
        window.OctaveDNACompanyLoader = {
            initVisualization,
            updateDNAHelicesConfig,
            reloadCustomData,
            initIframeCommunication,
            startAutoRefresh,
            stopAutoRefresh,
            refreshVisualization,
            getCurrentLoadedCompanyId: () => currentLoadedCompanyId
        };

        console.log('🏢 [OctaveDNA Company Loader] Module loaded');
    }

})();
