/**
 * ========================================
 * MODULE: orchestrator-utils.js
 * ========================================
 *
 * Extracted from: demo-orchestrator-logic.js
 * Original lines: ~3085-3402
 * Date: December 15, 2025
 *
 * PURPOSE:
 * Utility functions for diagnostics, view launching, configuration
 * export/save, and loading overlays.
 *
 * DEPENDENCIES:
 * - js/orchestrator/orchestrator-state.js (for demoState)
 *
 * EXPORTS (to window/global):
 * - identifyNervousEndpoints(): Diagnostic for low-coherence faces
 * - identifyHighestLeverageAction(): Find best intervention point
 * - launchView(viewName): Open visualization windows
 * - exportReport(): PDF export (placeholder)
 * - saveConfiguration(): JSON config download
 * - startOver(): Reset and reload
 * - showHelp(): Open documentation
 * - showLoading(message): Show loading overlay
 * - hideLoading(): Hide loading overlay
 *
 * ========================================
 */
(function(global) {
    'use strict';

    // ========================================
    // IMPORTS
    // ========================================

    // demoState from orchestrator-state.js
    // Note: demoState must be loaded before this module

    // ========================================
    // SECTION: DIAGNOSTIC ANALYSIS
    // ========================================
    //
    // Functions for identifying organizational health issues
    // and recommending highest-leverage interventions.
    //
    // ========================================

    /**
     * Identify nervous endpoints (faces with low coherence).
     * Sprint 3 Task 26 Polish.
     *
     * Displays critical faces needing attention and healthy faces
     * performing well.
     */
    function identifyNervousEndpoints() {
        const section = document.getElementById('nervousEndpoints');

        if (!section) {
            console.warn('[orchestrator-utils] nervousEndpoints element not found');
            return;
        }

        // Access demoState from global scope
        const state = global.demoState;
        if (!state || !state.coherenceResults || !state.coherenceResults.faces) {
            section.innerHTML = '<p style="color: rgba(255, 255, 255, 0.6); text-align: center;">No data available</p>';
            return;
        }

        // Find faces with energy < 0.5 or missing data
        // We check all 12 faces to ensure structural gaps are caught
        const allFaceIds = Array.from({ length: 12 }, (_, i) => i + 1);
        const criticalFaces = [];
        const healthyFaces = [];

        allFaceIds.forEach(id => {
            const face = state.coherenceResults.faces.find(f => f.id === id);
            const energy = face ? (face.energy || face.faceEnergy || 0) : 0;
            const kpiCount = face && face.kpis ? face.kpis.length : 0;

            const faceInfo = {
                id: id,
                name: face ? face.name : `Face ${id}`,
                energy: energy
            };

            // Critical if energy is low OR if no data present (Structural Immaturity)
            if (energy < 0.5) {
                faceInfo.reason = kpiCount === 0 ? "Structural Immaturity (No Data)" : "Low Coherence";
                criticalFaces.push(faceInfo);
            } else if (energy >= 0.7) {
                faceInfo.reason = "Strong Performance";
                healthyFaces.push(faceInfo);
            }
        });

        criticalFaces.sort((a, b) => a.energy - b.energy);
        healthyFaces.sort((a, b) => b.energy - a.energy);

        if (criticalFaces.length === 0 && healthyFaces.length > 0) {
            // Show healthy faces when no critical issues
            let html = '';
            healthyFaces.slice(0, 3).forEach(face => {
                const percentage = (face.energy * 100).toFixed(1);
                html += `
                    <div class="nervous-endpoint-card healthy">
                        <div class="endpoint-header">
                            <span class="endpoint-icon">&#10024;</span>
                            <span class="endpoint-name">Face ${face.id}: ${face.name}</span>
                        </div>
                        <div class="endpoint-detail">
                            <strong>${percentage}%</strong> coherence - ${face.reason}
                        </div>
                    </div>
                `;
            });
            section.innerHTML = html || '<p style="color: rgba(0, 255, 136, 0.8); text-align: center;">All systems coherent!</p>';
            return;
        }

        let html = '';

        // Show critical faces (max 4)
        criticalFaces.slice(0, 4).forEach(face => {
            const percentage = (face.energy * 100).toFixed(1);
            const isCritical = face.energy < 0.3;
            const icon = isCritical ? '&#128680;' : '&#9888;';

            html += `
                <div class="nervous-endpoint-card">
                    <div class="endpoint-header">
                        <span class="endpoint-icon">${icon}</span>
                        <span class="endpoint-name">Face ${face.id}: ${face.name}</span>
                    </div>
                    <div class="endpoint-detail">
                        <strong>${percentage}%</strong> coherence - ${face.reason}
                    </div>
                </div>
            `;
        });

        section.innerHTML = html || '<p style="color: rgba(255, 255, 255, 0.6); text-align: center;">No endpoints to display</p>';
    }

    /**
     * Sprint 4 Task 34: Identify and display highest leverage action
     * Finds the most impactful intervention point based on:
     * - Vertices with bermuda_triangle classification
     * - Faces with lowest energy in high-stress vertices
     */
    function identifyHighestLeverageAction() {
        const panel = document.getElementById('leverageActionPanel');
        const content = document.getElementById('leverageActionContent');

        if (!panel || !content) return;

        // Access demoState from global scope
        const state = global.demoState;

        // Get company data (template or custom)
        const companyData = state.templateContext || state.coherenceResults;
        if (!companyData || !companyData.faces) {
            panel.style.display = 'none';
            return;
        }

        const faces = companyData.faces;
        const vertices = companyData.vertices || [];

        // Strategy 1: Find bermuda_triangle vertex if available
        let leverageVertex = vertices.find(v => v.classification === 'bermuda_triangle');

        // Strategy 2: If no bermuda triangle, find highest vortex strength vertex
        if (!leverageVertex && vertices.length > 0) {
            leverageVertex = vertices.reduce((max, v) =>
                (v.vortexStrength || 0) > (max.vortexStrength || 0) ? v : max
            , vertices[0]);
        }

        // Strategy 3: If no vertices, just find the lowest-energy face
        if (!leverageVertex || !leverageVertex.faceIds) {
            const sortedFaces = [...faces].sort((a, b) =>
                (a.energy || a.faceEnergy || 0) - (b.energy || b.faceEnergy || 0)
            );
            const weakestFace = sortedFaces[0];

            if (!weakestFace || (weakestFace.energy || weakestFace.faceEnergy || 0) > 0.7) {
                // All faces are healthy, no leverage action needed
                panel.style.display = 'none';
                return;
            }

            // Display simple face-based leverage action
            const energy = (weakestFace.energy || weakestFace.faceEnergy || 0) * 100;
            content.innerHTML = `
                <div class="leverage-vertex-name">Primary Focus Area</div>
                <div class="leverage-target-face">
                    <span class="face-icon">&#9889;</span>
                    <div class="face-details">
                        <div class="face-name">${weakestFace.name || `Face ${weakestFace.id}`}</div>
                        <div class="face-energy">Currently at ${energy.toFixed(0)}% energy</div>
                    </div>
                </div>
                <div class="leverage-insight">
                    Strengthening this face will have the most immediate positive impact on overall organizational coherence.
                </div>
            `;
            panel.style.display = 'block';
            return;
        }

        // Full vertex-based analysis
        const vertexFaceIds = leverageVertex.faceIds || [];
        const vertexFaces = vertexFaceIds.map(id =>
            faces.find(f => f.id === id) || { id, name: `Face ${id}`, energy: 0 }
        );

        // Find the weakest face in this vertex
        const weakestFace = vertexFaces.reduce((min, f) => {
            const e1 = min.energy || min.faceEnergy || 0;
            const e2 = f.energy || f.faceEnergy || 0;
            return e2 < e1 ? f : min;
        }, vertexFaces[0] || { name: 'Unknown', energy: 0 });

        const weakestEnergy = (weakestFace.energy || weakestFace.faceEnergy || 0) * 100;
        const vertexStrength = ((leverageVertex.vortexStrength || 0) * 100).toFixed(0);
        const connectedEdges = vertices.length > 0 ? vertexFaceIds.length : 0;
        const estimatedLift = Math.min(15, Math.round((100 - weakestEnergy) * 0.3));

        const isBermuda = leverageVertex.classification === 'bermuda_triangle';
        const vertexTitle = isBermuda
            ? `&#9888; Bermuda Triangle: ${leverageVertex.emergentName || 'Critical Vertex'}`
            : `&#127919; ${leverageVertex.emergentName || 'Key Convergence Point'}`;

        content.innerHTML = `
            <div class="leverage-vertex-name">${vertexTitle}</div>
            <div class="leverage-target-face">
                <span class="face-icon">${isBermuda ? '&#128293;' : '&#9889;'}</span>
                <div class="face-details">
                    <div class="face-name">Focus: ${weakestFace.name || `Face ${weakestFace.id}`}</div>
                    <div class="face-energy">Currently at ${weakestEnergy.toFixed(0)}% energy</div>
                </div>
            </div>
            <div class="leverage-impact">
                <div class="leverage-impact-item">
                    <div class="value">${connectedEdges}</div>
                    <div class="label">Connected Faces</div>
                </div>
                <div class="leverage-impact-item">
                    <div class="value">${vertexStrength}%</div>
                    <div class="label">Vortex Strength</div>
                </div>
                <div class="leverage-impact-item">
                    <div class="value">+${estimatedLift}%</div>
                    <div class="label">Est. Coherence Lift</div>
                </div>
            </div>
            <div class="leverage-insight">
                ${isBermuda
                    ? 'This vertex represents a critical imbalance where energy is being lost. Strengthening the weakest converging face will begin to restore harmonic flow.'
                    : 'This convergence point has the highest transformation potential. Improving the target face will cascade positive effects through connected edges.'}
            </div>
        `;

        panel.style.display = 'block';
    }

    // ========================================
    // SECTION: UTILITY FUNCTIONS
    // ========================================
    //
    // General utility functions for view launching, export/save,
    // loading overlays, and navigation helpers.
    //
    // ========================================

    /**
     * Launch visualization view with custom data
     */
    function launchView(viewName) {
        const viewUrls = {
            'dodecahedron': 'dodecahedron-3d.html',
            'calculations': 'dev/calculations.html',
            'breath': 'pages/breath-analysis.html',
            'dna': 'octave-dna.html',
            'simulator': 'pages/simulator.html'
        };

        // Update sessionStorage before launching (ensure fresh data)
        // Call via window since updateSessionStorage is in main file
        if (typeof global.updateSessionStorage === 'function') {
            global.updateSessionStorage();
        }

        const url = viewUrls[viewName];
        if (url) {
            window.open(url, '_blank');
            console.log(`[orchestrator-utils] Launched view: ${viewName}`);
        }
    }

    /**
     * Export report (placeholder for future PDF export)
     */
    function exportReport() {
        alert('PDF export feature coming soon!\n\nFor now, you can:\n- Screenshot the visualizations\n- Save the configuration JSON\n- Copy the coherence data');
    }

    /**
     * Save configuration to JSON file
     */
    function saveConfiguration() {
        const state = global.demoState;

        const fullConfig = {
            faceConfig: state.faceConfig,
            kpiMode: state.kpiMode,
            kpiData: state.kpiData,
            coherenceResults: state.coherenceResults,
            timestamp: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(fullConfig, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `quannex-demo-${Date.now()}.json`;
        a.click();

        URL.revokeObjectURL(url);
        console.log('[orchestrator-utils] Configuration saved');
    }

    /**
     * Start over - reset and reload
     */
    function startOver() {
        if (confirm('Start a new analysis? This will clear all current data.')) {
            location.reload();
        }
    }

    /**
     * Show help documentation
     */
    function showHelp() {
        window.open('DEMO_GUIDE.md', '_blank');
    }

    /**
     * Show loading overlay
     */
    function showLoading(message) {
        message = message || 'Processing...';
        const textEl = document.getElementById('loadingText');
        const overlayEl = document.getElementById('loadingOverlay');

        if (textEl) textEl.textContent = message;
        if (overlayEl) overlayEl.classList.add('active');
    }

    /**
     * Hide loading overlay
     */
    function hideLoading() {
        const overlayEl = document.getElementById('loadingOverlay');
        if (overlayEl) overlayEl.classList.remove('active');
    }

    // ========================================
    // EXPORTS
    // ========================================

    // Diagnostic functions
    global.identifyNervousEndpoints = identifyNervousEndpoints;
    global.identifyHighestLeverageAction = identifyHighestLeverageAction;

    // Utility functions
    global.launchView = launchView;
    global.exportReport = exportReport;
    global.saveConfiguration = saveConfiguration;
    global.startOver = startOver;
    global.showHelp = showHelp;
    global.showLoading = showLoading;
    global.hideLoading = hideLoading;

    console.log('[orchestrator-utils] Module loaded');

})(typeof window !== 'undefined' ? window : this);
