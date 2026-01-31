/**
 * ════════════════════════════════════════════════════════════════════════════
 * OCTAVE DNA - COMPANY DROPDOWN
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Handles the company selector dropdown UI in the header.
 * Allows switching between different companies to visualize their DNA.
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                        NOTES FOR FUTURE CLAUDE                          │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * DROPDOWN STRUCTURE:
 * ─────────────────────────────────────────────────────────────────────────
 * The dropdown consists of:
 *   • currentCompany button - Shows selected company name
 *   • companyOptions container - List of available companies
 *   • Each option shows: name, stage, octave range
 *
 * COMPANY DATA SOURCE:
 * ─────────────────────────────────────────────────────────────────────────
 * Companies come from window.CompanyLoader.getAvailableCompanies()
 * Each company has: id, name, stage, color, octaveRange
 *
 * SWITCHING FLOW:
 * ─────────────────────────────────────────────────────────────────────────
 * 1. User clicks company in dropdown
 * 2. switchCompany(company) is called
 * 3. CompanyLoader.switchCompany(id) loads data
 * 4. initVisualization() rebuilds DNA helixes
 * 5. Dropdown updates to show new selection
 *
 * NAVIGATION MAP:
 * ─────────────────────────────────────────────────────────────────────────
 * ├─ DEPENDS ON:
 * │  └─ window.CompanyLoader (external company data loader)
 * │
 * └─ USED BY:
 *    └─ octave-dna-main.js (initializes dropdown on startup)
 *
 * ════════════════════════════════════════════════════════════════════════════
 * @version 1.0.0 - Extracted from octave-dna.html monolith
 * @created 2025-12-19
 */

(function () {
    'use strict';

    // ════════════════════════════════════════════════════════════════════════
    // DROPDOWN POPULATION
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Populate the company dropdown with available companies
     */
    function populateCompanyDropdown() {
        const companyOptionsDiv = document.getElementById('companyOptions');
        const currentCompanyBtn = document.getElementById('currentCompany');

        if (!companyOptionsDiv || !currentCompanyBtn) {
            Logger.debug('OctaveDNA', 'Dropdown elements not found');
            return;
        }

        if (!window.CompanyLoader) {
            Logger.debug('OctaveDNA', 'CompanyLoader not available');
            return;
        }

        const companies = window.CompanyLoader.getAvailableCompanies();
        companyOptionsDiv.innerHTML = '';

        companies.forEach((company, index) => {
            const option = document.createElement('div');
            option.className = 'company-option';
            option.id = `company-option-${company.id}`;
            option.style.setProperty('--company-color', company.color);

            // Set first as active by default
            if (index === 0) {
                option.classList.add('active');
                currentCompanyBtn.textContent = company.name;
            }

            option.innerHTML = `
                <div class="company-option-name">${company.name}</div>
                <div class="company-option-stage">${company.stage}</div>
                <div class="company-option-octaves">Octaves: ${company.octaveRange}</div>
            `;

            option.addEventListener('click', () => switchCompany(company));
            companyOptionsDiv.appendChild(option);
        });

        Logger.debug('OctaveDNA', `Dropdown populated with ${companies.length} companies`);
    }

    // ════════════════════════════════════════════════════════════════════════
    // DROPDOWN TOGGLE
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Initialize dropdown toggle behavior
     */
    function initDropdownToggle() {
        const companyDropdown = document.getElementById('companyDropdown');
        const currentCompanyBtn = document.getElementById('currentCompany');

        if (!companyDropdown || !currentCompanyBtn) {
            return;
        }

        // Toggle dropdown on button click
        currentCompanyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            companyDropdown.classList.toggle('open');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!companyDropdown.contains(e.target)) {
                companyDropdown.classList.remove('open');
            }
        });

        Logger.debug('OctaveDNA', 'Dropdown toggle initialized');
    }

    // ════════════════════════════════════════════════════════════════════════
    // COMPANY SWITCHING
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Switch to a different company
     *
     * @param {Object} company - Company data object
     */
    async function switchCompany(company) {
        const companyDropdown = document.getElementById('companyDropdown');
        const currentCompanyBtn = document.getElementById('currentCompany');

        try {
            Logger.info('OctaveDNA', `Switching to: ${company.name}`);

            // Close dropdown
            if (companyDropdown) {
                companyDropdown.classList.remove('open');
            }

            // Update active state
            document.querySelectorAll('.company-option').forEach(opt => {
                opt.classList.remove('active');
            });
            const activeOption = document.getElementById(`company-option-${company.id}`);
            if (activeOption) {
                activeOption.classList.add('active');
            }
            if (currentCompanyBtn) {
                currentCompanyBtn.textContent = company.name;
            }

            // Load company data via CompanyLoader
            if (window.CompanyLoader) {
                const companyData = await window.CompanyLoader.switchCompany(company.id);

                if (companyData) {
                    // Trigger visualization refresh
                    if (window.OctaveDNACompanyLoader?.initVisualization) {
                        await window.OctaveDNACompanyLoader.initVisualization();
                    }
                    Logger.info('OctaveDNA', `Switched to ${company.name}`);
                }
            }

            // Emit custom event
            document.dispatchEvent(new CustomEvent('octave-dna:company-switched', {
                detail: { company }
            }));

        } catch (error) {
            Logger.error('OctaveDNA', 'Failed to switch company:', error);
            alert(`Failed to load company: ${error.message}`);
        }
    }

    /**
     * Get currently selected company
     *
     * @returns {Object|null} Current company or null
     */
    function getCurrentCompany() {
        if (window.CompanyLoader) {
            return window.CompanyLoader.getCurrentCompany();
        }
        return null;
    }

    // ════════════════════════════════════════════════════════════════════════
    // INITIALIZATION
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Initialize the company dropdown system
     */
    function initCompanyDropdown() {
        initDropdownToggle();
        populateCompanyDropdown();
        Logger.info('OctaveDNA', 'Dropdown system initialized');
    }

    // ════════════════════════════════════════════════════════════════════════
    // BROWSER GLOBAL EXPORT
    // ════════════════════════════════════════════════════════════════════════

    if (typeof window !== 'undefined') {
        window.OctaveDNACompanyDropdown = {
            initCompanyDropdown,
            populateCompanyDropdown,
            initDropdownToggle,
            switchCompany,
            getCurrentCompany
        };

        Logger.debug('OctaveDNA', 'Company dropdown module loaded');
    }

})();
