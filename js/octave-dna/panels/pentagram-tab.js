/**
 * ════════════════════════════════════════════════════════════════════════════
 * OCTAVE DNA - PENTAGRAM ANALYSIS TAB
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Handles the pentagram (5 elements) analysis for each breath axis.
 * Shows how the 5 elemental pillars create structural coherence.
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                        NOTES FOR FUTURE CLAUDE                          │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * PENTAGRAM GEOMETRY:
 * ─────────────────────────────────────────────────────────────────────────
 * Each dodecahedron face has 5 vertices = 5 elements (pillars).
 * The pentagram is formed by connecting non-adjacent vertices:
 *
 *   Star Pairs: (0→2), (1→3), (2→4), (3→0), (4→1)
 *
 * This creates the 5-pointed star where lines intersect, forming
 * inner pentagon nodes that represent composite coherence.
 *
 * ANALYSIS CALCULATIONS:
 * ─────────────────────────────────────────────────────────────────────────
 * 1. Star Pair Values (s₁-s₅): Average of connected pillars
 * 2. Intersection Nodes (p₁-p₅): Average of adjacent star pairs
 * 3. Center Composite (C): Average of all intersection nodes
 * 4. Pillar Symmetry: 1 - coefficient_of_variation(pillars)
 * 5. Local Coherence: Blend of ball value and nuanced pillar health
 *
 * PENTAGRAM OVERLAY:
 * ─────────────────────────────────────────────────────────────────────────
 * Uses window.PentagramOverlay (from pentagram-overlay.js) for rendering.
 * The overlay creates an animated canvas visualization of the pentagram.
 *
 * NAVIGATION MAP:
 * ─────────────────────────────────────────────────────────────────────────
 * ├─ DEPENDS ON:
 * │  ├─ OctaveDNAState (facesData)
 * │  └─ window.PentagramOverlay (external rendering class)
 * │
 * └─ USED BY:
 *    └─ diagnostic-panel.js (on tab switch to pentagram)
 *
 * ════════════════════════════════════════════════════════════════════════════
 * @version 1.0.0 - Extracted from octave-dna.html monolith
 * @created 2025-12-19
 */

(function() {
    'use strict';

    // Reference to pentagram overlay instance
    let pentagramOverlay = null;

    // ════════════════════════════════════════════════════════════════════════
    // PENTAGRAM ANALYSIS
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Calculate pentagram analysis for a helix
     *
     * @param {Object} helix - Helix configuration
     */
    function calculatePentagramAnalysis(helix) {
        const State = window.OctaveDNAState;
        const facesData = State?.getState('facesData') || [];

        // Get face data
        const face1 = facesData.find(f => f.id === helix.faces[0]);
        const face2 = facesData.find(f => f.id === helix.faces[1]);

        if (!face1 || !face2) {
            console.warn('⚠️ [Pentagram] Face data not found for helix', helix);
            return;
        }

        // Use the average of both faces as the "Ball" value
        const ballValue = (face1.energy + face2.energy) / 2;

        // Get pillar values (5 KPIs for each face)
        let pillarValues = [0.5, 0.5, 0.5, 0.5, 0.5]; // Default

        if (face1.kpis && face1.kpis.length >= 5) {
            pillarValues = face1.kpis.slice(0, 5).map(kpi => kpi.normalizedScore || kpi.value || 0.5);
        } else {
            // Generate varied pillar values based on face energy
            pillarValues = [
                face1.energy * 0.9,
                face1.energy * 1.1,
                face1.energy * 0.95,
                face1.energy * 1.05,
                face1.energy * 1.0
            ].map(v => Math.min(Math.max(v, 0), 1));
        }

        // Calculate analysis
        const analysis = calculateSimplePentagramAnalysis(ballValue, pillarValues);

        // Render pentagram visualization
        renderPentagram(analysis, helix);

        // Display insights
        displayPentagramInsights(analysis, helix);

        console.log(`⭐ [Pentagram] Analysis calculated for ${helix.name}`);
    }

    /**
     * Simplified pentagram analysis calculation
     * (Mirrors backend/models/PentagramAnalyzer.js logic)
     *
     * @param {number} ballValue - Central ball (face average) value
     * @param {number[]} pillarValues - Array of 5 pillar values
     * @returns {Object} Analysis results
     */
    function calculateSimplePentagramAnalysis(ballValue, pillarValues) {
        // Step 1: Calculate Star Pair Values (s₁-s₅)
        // Pentagram connections: 0→2, 1→3, 2→4, 3→0, 4→1
        const starPairs = [
            (pillarValues[0] + pillarValues[2]) / 2, // s₁
            (pillarValues[1] + pillarValues[3]) / 2, // s₂
            (pillarValues[2] + pillarValues[4]) / 2, // s₃
            (pillarValues[3] + pillarValues[0]) / 2, // s₄
            (pillarValues[4] + pillarValues[1]) / 2  // s₅
        ];

        // Step 2: Calculate Intersection Nodes (p₁-p₅)
        // Adjacent star pair intersections
        const intersectionNodes = [
            (starPairs[0] + starPairs[1]) / 2, // p₁
            (starPairs[1] + starPairs[2]) / 2, // p₂
            (starPairs[2] + starPairs[3]) / 2, // p₃
            (starPairs[3] + starPairs[4]) / 2, // p₄
            (starPairs[4] + starPairs[0]) / 2  // p₅
        ];

        // Step 3: Calculate Center Composite (C)
        const centerComposite = intersectionNodes.reduce((sum, node) => sum + node, 0) / intersectionNodes.length;

        // Step 4: Calculate weighted average of pillars
        const weightedAvgPillars = pillarValues.reduce((sum, val) => sum + val, 0) / pillarValues.length;

        // Step 5: Calculate Nuanced Average Pillar Health
        const blendConstant = 0.7;
        const nuancedAvgPillarHealth = blendConstant * weightedAvgPillars + (1 - blendConstant) * centerComposite;

        // Step 6: Calculate Pillar Symmetry Score
        const mean = weightedAvgPillars;
        const variance = pillarValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / pillarValues.length;
        const stdDev = Math.sqrt(variance);
        const coefficientOfVariation = mean > 0 ? stdDev / mean : 0;
        const pillarSymmetry = Math.max(0, 1.0 - coefficientOfVariation);

        // Step 7: Calculate Local Coherence (blend ball and pillars)
        const gamma = 0.7; // Blending constant
        const localCoherence = gamma * ballValue + (1 - gamma) * nuancedAvgPillarHealth;

        return {
            ballValue: ballValue,
            pillarValues: pillarValues,
            starPairs: starPairs,
            intersectionNodes: intersectionNodes,
            centerComposite: centerComposite,
            weightedAvgPillars: weightedAvgPillars,
            nuancedAvgPillarHealth: nuancedAvgPillarHealth,
            pillarSymmetry: pillarSymmetry,
            selfCoherence: ballValue,
            relationalCoherence: nuancedAvgPillarHealth,
            structuralIntegrity: pillarSymmetry,
            localCoherence: localCoherence
        };
    }

    // ════════════════════════════════════════════════════════════════════════
    // PENTAGRAM RENDERING
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Render pentagram visualization
     *
     * @param {Object} analysis - Pentagram analysis results
     * @param {Object} helix - Helix configuration
     */
    function renderPentagram(analysis, helix) {
        // Use external PentagramOverlay if available
        if (!window.PentagramOverlay) {
            console.log('⭐ [Pentagram] PentagramOverlay not loaded, skipping render');
            return;
        }

        if (!pentagramOverlay) {
            pentagramOverlay = new window.PentagramOverlay();
        }

        // Stop any existing animation
        pentagramOverlay.stop();

        // Initialize canvas in container
        pentagramOverlay.initialize('pentagramCanvasContainer');

        // Render with animation
        pentagramOverlay.render(analysis, helix);
    }

    /**
     * Stop pentagram animation
     */
    function stopPentagram() {
        if (pentagramOverlay) {
            pentagramOverlay.stop();
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // PENTAGRAM INSIGHTS
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Display pentagram insights
     *
     * @param {Object} analysis - Pentagram analysis results
     * @param {Object} helix - Helix configuration
     */
    function displayPentagramInsights(analysis, helix) {
        const insightsContainer = document.getElementById('pentagramInsights');
        if (!insightsContainer) return;

        let insights = [];

        // Self vs Relational coherence
        if (analysis.selfCoherence > analysis.relationalCoherence + 0.2) {
            insights.push(`<strong>Insight:</strong> Strong internal coherence (${(analysis.selfCoherence * 100).toFixed(0)}%) but weaker relational connections (${(analysis.relationalCoherence * 100).toFixed(0)}%). Focus on strengthening the 5 elemental pillars.`);
        } else if (analysis.relationalCoherence > analysis.selfCoherence + 0.2) {
            insights.push(`<strong>Insight:</strong> Excellent relational coherence (${(analysis.relationalCoherence * 100).toFixed(0)}%) with room to strengthen core energy (${(analysis.selfCoherence * 100).toFixed(0)}%). The foundation is ready for growth.`);
        } else {
            insights.push(`<strong>Insight:</strong> Balanced harmony between self (${(analysis.selfCoherence * 100).toFixed(0)}%) and relational (${(analysis.relationalCoherence * 100).toFixed(0)}%) coherence. This axis is in φ-aligned flow.`);
        }

        // Symmetry analysis
        if (analysis.structuralIntegrity < 0.7) {
            insights.push(`<strong>Warning:</strong> Low structural symmetry (${(analysis.structuralIntegrity * 100).toFixed(0)}%). Some elemental pillars are significantly weaker than others. Consider rebalancing resources.`);
        } else if (analysis.structuralIntegrity > 0.9) {
            insights.push(`<strong>Excellence:</strong> High structural symmetry (${(analysis.structuralIntegrity * 100).toFixed(0)}%). All 5 elemental pillars are evenly strengthened - a rare pentagram harmony.`);
        }

        // Local coherence
        if (analysis.localCoherence > 0.8) {
            insights.push(`<strong>Status:</strong> Exceptional local coherence (${(analysis.localCoherence * 100).toFixed(0)}%). This breath axis is operating at peak organizational DNA expression.`);
        } else if (analysis.localCoherence < 0.5) {
            insights.push(`<strong>Alert:</strong> Low local coherence (${(analysis.localCoherence * 100).toFixed(0)}%). This axis requires immediate attention and resource allocation.`);
        }

        if (insights.length > 0) {
            insightsContainer.innerHTML = insights.join('<br><br>');
            insightsContainer.style.display = 'block';
        } else {
            insightsContainer.style.display = 'none';
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // BROWSER GLOBAL EXPORT
    // ════════════════════════════════════════════════════════════════════════

    if (typeof window !== 'undefined') {
        window.OctaveDNAPentagramTab = {
            calculatePentagramAnalysis,
            calculateSimplePentagramAnalysis,
            renderPentagram,
            stopPentagram,
            displayPentagramInsights
        };

        console.log('⭐ [OctaveDNA Pentagram Tab] Module loaded');
    }

})();
