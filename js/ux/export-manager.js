/**
 * ════════════════════════════════════════════════════════════════════════════
 * QUANNEX EXPORT MANAGER
 * ════════════════════════════════════════════════════════════════════════════
 *
 * NOTES FOR FUTURE CLAUDE:
 * ═══════════════════════════════════════════════════════════════════════════
 * This module provides a unified export system for Quannex reports.
 * It handles PDF (print), JSON, and CSV exports with register-aware feedback.
 *
 * KEY INSIGHT: Export is where Quannex meets the real world. A PDF on a
 * boardroom table. A JSON feeding another system. A CSV in a spreadsheet.
 * These moments matter.
 *
 * NAVIGATION MAP:
 *   ↑ IMPORTS FROM:
 *     • js/ux/toast-notifications.js → User feedback
 *     • js/ux/language-register.js → Register detection
 *     • js/ux/ux-full-vision.js → EXPORT_OPTIONS specs
 *
 *   → CONSUMED BY:
 *     • demo-orchestrator.html → Export button
 *     • pages/results-summary.html → Export actions
 *     • js/orchestrator/orchestrator-utils.js → Replaces placeholder
 *
 * SPECS (from ux-full-vision.js):
 *   pdf: { preview: true, modal: true }
 *   json: { prettyPrint: true, includeCalculatedFields: true }
 *   csv: { includeMetadata: true, encoding: 'UTF-8' }
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * @fileoverview Unified export system for Quannex reports
 * @author Deimantas Murauskas & Claude
 * @version 1.0.0
 */

(function (global) {
    'use strict';

    // ════════════════════════════════════════════════════════════════════════
    // CONFIGURATION
    // ════════════════════════════════════════════════════════════════════════

    const CONFIG = {
        formats: ['pdf', 'json', 'csv'],
        defaultFilename: 'quannex-report',
        jsonIndent: 2,
        csvDelimiter: ',',
        includeMetadata: true
    };

    // ════════════════════════════════════════════════════════════════════════
    // DATA COLLECTION
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Collect exportable data from the current state
     * @returns {Object} Export-ready data object
     */
    function collectExportData() {
        const data = {
            meta: {
                exportedAt: new Date().toISOString(),
                version: '1.0.0',
                source: 'Quannex Coherence Engine'
            },
            company: {},
            faces: [],
            coherence: {},
            breathAxes: [],
            shadowPatterns: []
        };

        // Try to get data from various sources
        // 1. From Quannex engine state
        if (global.Quannex?.getState) {
            const state = global.Quannex.getState();
            data.faces = state.faces || [];
            data.coherence = {
                global: state.globalCoherence,
                dataIntegrity: state.dataIntegrity
            };
        }

        // 2. From demoState (orchestrator)
        if (global.demoState) {
            data.company = {
                id: global.demoState.company?.id,
                name: global.demoState.company?.name
            };
            data.faces = data.faces.length ? data.faces : global.demoState.faceConfig?.faces || [];
            data.coherence = data.coherence.global ? data.coherence : global.demoState.coherenceResults || {};
        }

        // 3. From sessionStorage
        const companyId = sessionStorage.getItem('selectedCompanyId');
        if (companyId && !data.company.id) {
            data.company.id = companyId;
        }

        return data;
    }

    // ════════════════════════════════════════════════════════════════════════
    // PDF EXPORT
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Export to PDF using browser print dialog
     * @param {Object} options - Export options
     */
    function exportPDF(options = {}) {
        const register = global.LanguageRegister?.get?.() || 'balanced';

        // Show toast feedback
        showToast('Preparing PDF...', 'info');

        // Check if we're on results-summary page (optimized for print)
        if (global.location.pathname.includes('results-summary')) {
            // Directly print current page
            setTimeout(() => {
                global.print();
                showToast('PDF dialog opened', 'success');
            }, 300);
        } else {
            // Navigate to results-summary for print
            const confirm = options.skipConfirm || global.confirm(
                'For the best PDF output, we\'ll open the Results Summary page.\n\nContinue?'
            );

            if (confirm) {
                // Store flag to auto-print
                sessionStorage.setItem('quannex.autoPrint', 'true');
                global.location.href = 'pages/results-summary.html';
            }
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // JSON EXPORT
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Export to JSON file
     * @param {Object} options - Export options
     */
    function exportJSON(options = {}) {
        try {
            const data = collectExportData();
            const register = global.LanguageRegister?.get?.() || 'balanced';

            // Add register info to metadata
            data.meta.register = register;

            // Pretty print
            const jsonString = JSON.stringify(data, null, CONFIG.jsonIndent);

            // Create and trigger download
            const blob = new Blob([jsonString], { type: 'application/json' });
            downloadBlob(blob, `${CONFIG.defaultFilename}-${getTimestamp()}.json`);

            showToast('JSON exported successfully', 'success');

        } catch (error) {
            Logger.error('UX:ExportManager', 'JSON export failed:', error);
            showToast('JSON export failed: ' + error.message, 'error');
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // CSV EXPORT
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Export to CSV file
     * @param {Object} options - Export options
     */
    function exportCSV(options = {}) {
        try {
            const data = collectExportData();
            const faces = data.faces || [];

            if (faces.length === 0) {
                showToast('No face data to export', 'warning');
                return;
            }

            // Build CSV content
            const rows = [];

            // Header row
            rows.push(['Face ID', 'Name', 'Energy', 'Earth', 'Water', 'Fire', 'Air', 'Ether'].join(CONFIG.csvDelimiter));

            // Data rows
            faces.forEach((face, index) => {
                const elements = face.elements || {};
                rows.push([
                    index + 1,
                    escapeCsvValue(face.name || `Face ${index + 1}`),
                    face.sentiment?.toFixed(3) || '0.500',
                    elements.earth?.toFixed(3) || '0.500',
                    elements.water?.toFixed(3) || '0.500',
                    elements.fire?.toFixed(3) || '0.500',
                    elements.air?.toFixed(3) || '0.500',
                    elements.ether?.toFixed(3) || '0.500'
                ].join(CONFIG.csvDelimiter));
            });

            // Add metadata if configured
            if (CONFIG.includeMetadata) {
                rows.push('');
                rows.push(['# Exported:', new Date().toISOString()].join(CONFIG.csvDelimiter));
                rows.push(['# Company:', data.company?.name || data.company?.id || 'Unknown'].join(CONFIG.csvDelimiter));
            }

            const csvString = rows.join('\n');

            // Create and trigger download
            const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8' });
            downloadBlob(blob, `${CONFIG.defaultFilename}-${getTimestamp()}.csv`);

            showToast('CSV exported successfully', 'success');

        } catch (error) {
            Logger.error('UX:ExportManager', 'CSV export failed:', error);
            showToast('CSV export failed: ' + error.message, 'error');
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // UTILITIES
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Download a blob as a file
     * @param {Blob} blob - The blob to download
     * @param {string} filename - The filename
     */
    function downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Get timestamp for filename
     * @returns {string}
     */
    function getTimestamp() {
        return new Date().toISOString().slice(0, 10);
    }

    /**
     * Escape CSV value
     * @param {string} value - Value to escape
     * @returns {string}
     */
    function escapeCsvValue(value) {
        if (typeof value !== 'string') return value;
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
            return '"' + value.replace(/"/g, '""') + '"';
        }
        return value;
    }

    /**
     * Show toast notification
     * @param {string} message - Message to show
     * @param {string} type - Toast type
     */
    function showToast(message, type) {
        if (global.QuannexToast) {
            global.QuannexToast.show(message, type);
        } else {
            // Fallback to event
            global.dispatchEvent(new CustomEvent('quannex:toast', {
                detail: { message, type }
            }));
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // UNIFIED EXPORT FUNCTION
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Export report in specified format
     * @param {string} format - Export format (pdf, json, csv)
     * @param {Object} options - Export options
     */
    function exportReport(format = 'pdf', options = {}) {
        Logger.info('UX:ExportManager', `Exporting as ${format}...`);

        switch (format.toLowerCase()) {
            case 'pdf':
                exportPDF(options);
                break;
            case 'json':
                exportJSON(options);
                break;
            case 'csv':
                exportCSV(options);
                break;
            default:
                showToast(`Unknown format: ${format}`, 'error');
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // EVENT LISTENER
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Listen for export events
     */
    function initEventListener() {
        global.addEventListener('quannex:export-requested', (event) => {
            const { format, ...options } = event.detail || {};
            exportReport(format || 'pdf', options);
        });
    }

    // ════════════════════════════════════════════════════════════════════════
    // AUTO-PRINT CHECK
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Check if we should auto-print (redirected from another page)
     */
    function checkAutoPrint() {
        if (sessionStorage.getItem('quannex.autoPrint') === 'true') {
            sessionStorage.removeItem('quannex.autoPrint');
            // Wait for page to fully render
            setTimeout(() => {
                global.print();
            }, 1000);
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // INITIALIZATION
    // ════════════════════════════════════════════════════════════════════════

    function init() {
        initEventListener();
        checkAutoPrint();
        Logger.info('UX:ExportManager', 'Export Manager initialized');
    }

    // Auto-init when DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ════════════════════════════════════════════════════════════════════════
    // EXPORTS
    // ════════════════════════════════════════════════════════════════════════

    const QuannexExport = {
        exportReport,
        exportPDF,
        exportJSON,
        exportCSV,
        collectExportData,
        CONFIG
    };

    // Browser export
    global.QuannexExport = QuannexExport;

    // Also expose as global exportReport for backward compatibility
    global.exportReport = exportReport;

    // CommonJS export
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = QuannexExport;
    }

})(typeof window !== 'undefined' ? window : this);
