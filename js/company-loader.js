/**
 * Company Loader
 * 
 * Manages loading of company profiles and data.
 * Now powered by UnifiedDataLoader for consistent data handling.
 */
import { UnifiedDataLoader } from './unified-data-loader.js';

const COMPANIES = [
    { id: 'quannex', name: 'Quannex AI' },
    { id: 'nova-tech', name: 'NovaTech Solutions' },
    { id: 'apex-industries', name: 'Apex Industries' },
    { id: 'zenith-solutions', name: 'Zenith Global' }
];

async function loadCompanyProfile(companyId) {
    try {
        const response = await fetch(`./companies/${companyId}/company.json`);
        return await response.json();
    } catch (error) {
        console.error(`Failed to load profile for ${companyId}:`, error);
        return null;
    }
}

/**
 * Load company KPI data using the UnifiedDataLoader
 * @param {string} companyId 
 * @returns {Promise<Array>}
 */
async function loadCompanyKPIs(companyId) {
    const loader = new UnifiedDataLoader();
    try {
        const kpiReq = await fetch(`./companies/${companyId}/kpis.csv`);
        const kpiText = await kpiReq.text();
        return loader.parseKPIs(kpiText);
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
    console.log(`Switching to company: ${companyId}`);

    // Show loading state if UI elements exist
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) loadingOverlay.style.display = 'flex';

    try {
        const loader = new UnifiedDataLoader();

        // Load full context via Unified Loader
        const context = await loader.loadContext(companyId);

        if (!context) {
            throw new Error("Failed to load company context");
        }

        // Update Global State
        window.currentCompany = context.company;

        // Initialize Engine
        if (window.Quannex) {
            await window.Quannex.initWithCompany({
                ...context.company,
                faceConfig: { faces: context.faces },
                kpis: context.kpis
            });
        }

        // Update UI
        updateCompanyUI(context.company);

        return context;

    } catch (error) {
        console.error('Error switching company:', error);
        alert(`Failed to load company: ${companyId}`);
    } finally {
        if (loadingOverlay) loadingOverlay.style.display = 'none';
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
    getAvailableCompanies: () => COMPANIES
};
