/**
 * Company Loader
 *
 * Manages loading of company profiles and data.
 * Now powered by UnifiedDataLoader for consistent data handling.
 *
 * ========================================
 * DEVELOPER NOTE: CSV Loading with Historical Context
 * ========================================
 *
 * The CSV files in /data were the original MVP proof-of-concept,
 * manually created to validate the dodecahedron model. Known gaps:
 *
 * - CSV_Vortex_Map.csv has "Not Found" for F10-Ether in some vertices
 * - CSV_Dodeca_Engine.csv E_Vector column is empty
 * - Face energies may differ between CSV files (use Dodeca_Engine as source)
 * - CSVs only contain O1 (Survival) octave data; JS handles O1-O7 dynamically
 *
 * See /data/DATA_EVOLUTION_NOTES.md for full documentation.
 *
 * The JS codebase has grown beyond the original CSVs in some areas,
 * particularly around octave assignment (CSVs are O1-only, JS allows O1-O7).
 * This is intentional: CSVs are the seed/reference, JS is the living implementation.
 * ========================================
 */
import { UnifiedDataLoader } from './unified-data-loader.js?v=20251217';

const COMPANIES = [
    { id: 'quannex', name: 'Quannex AI' },
    { id: 'nova-tech', name: 'NovaTech Solutions' },
    { id: 'apex-industries', name: 'Apex Industries' },
    { id: 'zenith-solutions', name: 'Zenith Global' }
];

/**
 * Get the correct base path for fetching resources
 * Auto-detects if running from /pages/ subdirectory
 * @returns {string} Base path prefix ('./' or '../')
 */
function getBasePath() {
    return window.location.pathname.includes('/pages/') ? '../' : './';
}

// Re-entrancy guard to prevent infinite loop when updating selector
let _isSwitchingCompany = false;

async function loadCompanyProfile(companyId) {
    const basePath = getBasePath();
    try {
        const response = await fetch(`${basePath}companies/${companyId}/company.json`);
        if (!response.ok) {
            console.warn(`⚠️ Company profile not found for ${companyId} (HTTP ${response.status})`);
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error(`Failed to load profile for ${companyId}:`, error);
        return null;
    }
}

/**
 * Load company KPI data using the UnifiedDataLoader
 *
 * NOTE: If the CSV file is missing or malformed, this returns an empty array.
 * The UI should check for empty results and display appropriate feedback.
 *
 * @param {string} companyId
 * @returns {Promise<Array>}
 */
async function loadCompanyKPIs(companyId) {
    const basePath = getBasePath();
    const loader = new UnifiedDataLoader();
    try {
        const kpiReq = await fetch(`${basePath}companies/${companyId}/kpis.csv`);
        if (!kpiReq.ok) {
            console.warn(`⚠️ KPI file not found for ${companyId} (HTTP ${kpiReq.status}). Returning empty array.`);
            console.warn(`   Expected path: ${basePath}companies/${companyId}/kpis.csv`);
            return [];
        }
        const kpiText = await kpiReq.text();
        const kpis = loader.parseKPIs(kpiText);
        if (kpis.length === 0) {
            console.warn(`⚠️ KPI file for ${companyId} parsed to 0 records. Check CSV format.`);
        }
        return kpis;
    } catch (error) {
        console.error(`Failed to load KPIs for ${companyId}:`, error);
        return [];
    }
}

/**
 * Switch the active company
 * Re-initializes the engine with the new company data
 */
async function switchCompany(companyId) {
    // Re-entrancy guard: prevent infinite loop from selector change events
    if (_isSwitchingCompany) {
        console.log(`[CompanyLoader] Ignoring recursive call for: ${companyId}`);
        return null;
    }
    _isSwitchingCompany = true;

    console.log(`Switching to company: ${companyId}`);

    // Show loading state if UI elements exist
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) loadingOverlay.style.display = 'flex';

    try {
        const loader = new UnifiedDataLoader();

        // Handle custom company data from sessionStorage
        let customConfig = null;
        if (companyId === 'custom') {
            const customDataJson = sessionStorage.getItem('customCompanyData');
            if (customDataJson) {
                const customData = JSON.parse(customDataJson);
                // Transform sessionStorage format to expected customConfig format
                customConfig = {
                    id: 'custom',
                    name: customData.name || 'Custom Analysis',
                    description: customData.description || 'User-generated data',
                    faceConfig: {
                        faces: customData.kpis ?
                            [...new Set(customData.kpis.map(k => k.faceId))].map(faceId => {
                                const kpi = customData.kpis.find(k => k.faceId === faceId);
                                return {
                                    id: faceId,
                                    name: kpi?.faceName || `Face ${faceId}`
                                };
                            }) : []
                    },
                    kpis: customData.kpis || []
                };
                console.log('📦 Loaded custom config from sessionStorage:', customConfig);
            }
        }

        // Load full context via Unified Loader
        const context = await loader.loadContext(companyId, customConfig);

        if (!context) {
            throw new Error("Failed to load company context");
        }

        // Update Global State
        window.currentCompany = context.company;

        // Initialize Engine
        if (window.Quannex) {
            // Apply tuning parameters first (if available) for consistent coherence calculation
            if (context.tuning && typeof window.Quannex.importTuning === 'function') {
                console.log(`[CompanyLoader] Applying tuning: ${context.tuning.perspective}`);
                window.Quannex.importTuning(context.tuning);
            }

            await window.Quannex.initWithCompany({
                ...context.company,
                faceConfig: { faces: context.faces },
                kpis: context.kpis,
                shadowPatterns: context.shadowPatterns || []
            });
        }

        // Update UI
        updateCompanyUI(context.company);

        return context;

    } catch (error) {
        console.error('Error switching company:', error);
        // Only show alert for real companies, not for 'custom' (which uses session data)
        if (companyId !== 'custom') {
            alert(`Failed to load company: ${companyId}`);
        } else {
            // For custom companies, log a helpful message but don't interrupt user
            console.warn('⚠️ Custom session data may be missing. Starting from Demo Orchestrator is recommended.');
        }
    } finally {
        if (loadingOverlay) loadingOverlay.style.display = 'none';
        _isSwitchingCompany = false; // Reset guard
    }
}

function updateCompanyUI(company) {
    const titleEl = document.getElementById('company-title');
    const descEl = document.getElementById('company-description');

    if (titleEl) titleEl.textContent = company.name;
    if (descEl) descEl.textContent = company.description;

    // Update selector if it exists
    const selector = document.getElementById('company-selector');
    if (selector) selector.value = company.id;
}

// Export
window.CompanyLoader = {
    COMPANIES,
    loadCompanyProfile,
    loadCompanyKPIs,
    switchCompany,
    // Backward compatibility for dodecahedron-viz.js
    loadCompany: switchCompany,
    getAvailableCompanies: () => COMPANIES,
    // Get currently loaded company (set during switchCompany)
    getCurrentCompany: () => window.currentCompany || null
};
