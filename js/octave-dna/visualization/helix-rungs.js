/**
 * ════════════════════════════════════════════════════════════════════════════
 * OCTAVE DNA - BREATH RUNGS
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Creates the connecting rungs between DNA strands that visualize breath balance.
 * These rungs show whether the projection/reception relationship is healthy.
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                        NOTES FOR FUTURE CLAUDE                          │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * THE BREATH RUNG METAPHOR:
 * ─────────────────────────────────────────────────────────────────────────
 * DNA rungs connect the two strands of a double helix. In this visualization:
 *
 *   • SOLID RUNGS = Balanced breath (energy flows smoothly)
 *   • GAPS/MISSING RUNGS = Imbalanced breath (energy stuck)
 *   • WARNING SPHERES = Critical imbalance (red pulsing dots)
 *
 * BALANCE DETECTION:
 * ─────────────────────────────────────────────────────────────────────────
 * Balance is determined by the φ-normalized breath ratio:
 *
 *   • |BR| <= φ^-2 (0.382): BALANCED - Cyan-green rungs, full visibility
 *   • BR > 0: Over-inhaling - Blue tint, some gaps appear
 *   • BR < 0: Over-exhaling - Red tint, some gaps appear
 *   • |BR| > 1.5: Severely imbalanced - Warning spheres appear
 *
 * RUNG DENSITY:
 * ─────────────────────────────────────────────────────────────────────────
 * Maximum 21 rungs (3 per octave × 7 octaves)
 * Visible rungs = maxRungs × balanceFactor
 *
 * When imbalanced, rungs disappear to show "gaps in the breath".
 * This visual metaphor immediately communicates organizational health.
 *
 * NAVIGATION MAP:
 * ─────────────────────────────────────────────────────────────────────────
 * ├─ DEPENDS ON:
 * │  ├─ THREE.js (global)
 * │  ├─ OctaveDNAState (CONFIG)
 * │  └─ OctaveDNAHelpers (getFibonacciRadius, PHI_INV_2)
 * │
 * └─ USED BY:
 *    └─ helix-geometry.js (calls createBreathRungs for each helix)
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │                     WHAT THIS SESSION LEARNED                         │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * 1. The rung gaps create immediate visual feedback about organizational
 *    health without needing to read numbers or charts.
 *
 * 2. Using color (cyan/blue/red) + density (full/sparse) + animation
 *    (warning pulses) creates multi-channel communication of breath state.
 *
 * 3. The central axis indicator (when imbalanced) shows which direction
 *    the breath is off - a subtle but useful visual cue.
 *
 * ════════════════════════════════════════════════════════════════════════════
 * @version 1.0.0 - Extracted from octave-dna.html monolith
 * @created 2025-12-19
 */

(function() {
    'use strict';

    // ════════════════════════════════════════════════════════════════════════
    // BREATH RUNG CREATION
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Create breath connection rungs between DNA strands
     *
     * Visualizes breath ratio balance - solid when balanced, gaps when imbalanced.
     * The more imbalanced, the more gaps appear in the rungs.
     *
     * @param {Object} helix - Helix configuration
     * @param {number} centerX - X center position
     * @param {number} centerZ - Z center position
     * @param {number} breathRatio - φ-normalized breath ratio
     * @returns {THREE.Group} Group of rung meshes
     */
    function createBreathRungs(helix, centerX, centerZ, breathRatio) {
        const State = window.OctaveDNAState;
        const Helpers = window.OctaveDNAHelpers;
        const CONFIG = State?.CONFIG || {};

        const PHI_INV_2 = Helpers?.PHI_INV_2 || 0.381966011250105;
        const helixHeight = CONFIG.helixHeight || 22;
        const helixTurns = CONFIG.helixTurns || 4;
        const strandRadius = CONFIG.strandRadius || 0.8;

        const rungsGroup = new THREE.Group();

        // ════════════════════════════════════════════════════════════════════
        // BALANCE CALCULATION
        // ════════════════════════════════════════════════════════════════════

        // Balance factor: 1 = perfect, 0 = severely imbalanced
        const balanceFactor = Math.max(0, 1 - Math.abs(breathRatio) / 1.5);
        const isBalanced = Math.abs(breathRatio) <= PHI_INV_2;

        // Number of visible rungs based on balance
        // Balanced: 21 rungs (3 per octave)
        // Imbalanced: proportionally fewer (gaps appear)
        const maxRungs = 21;
        const visibleRungs = Math.floor(maxRungs * balanceFactor);

        // ════════════════════════════════════════════════════════════════════
        // RUNG COLOR DETERMINATION
        // ════════════════════════════════════════════════════════════════════

        let rungColor;
        if (isBalanced) {
            rungColor = new THREE.Color(0x00ffcc);  // Cyan-green when balanced
        } else if (breathRatio > 0) {
            rungColor = new THREE.Color(0x6666ff);  // Blue tint for over-inhaling
        } else {
            rungColor = new THREE.Color(0xff6666);  // Red tint for over-exhaling
        }

        const rungOpacity = isBalanced ? 0.6 : 0.4;

        // ════════════════════════════════════════════════════════════════════
        // CREATE INDIVIDUAL RUNGS
        // ════════════════════════════════════════════════════════════════════

        for (let i = 0; i < maxRungs; i++) {
            // Skip some rungs to show gaps when imbalanced
            // But always show every 3rd rung (skeletal structure)
            if (i >= visibleRungs && i % 3 !== 0) continue;

            const t = i / maxRungs;
            const octaveLevel = 1 + t * 6; // Spans O1 to O7
            const fibRadius = Helpers.getFibonacciRadius(Math.ceil(octaveLevel));

            // Calculate positions on both strands
            const angle = 2 * Math.PI * helixTurns * t;
            const spiralR = strandRadius * fibRadius;

            // Strand 1 position (phase 0)
            const x1 = centerX + spiralR * Math.cos(angle);
            const z1 = centerZ + spiralR * Math.sin(angle);

            // Strand 2 position (phase π)
            const x2 = centerX + spiralR * Math.cos(angle + Math.PI);
            const z2 = centerZ + spiralR * Math.sin(angle + Math.PI);

            const y = t * helixHeight;

            // Calculate rung geometry
            const start = new THREE.Vector3(x1, y, z1);
            const end = new THREE.Vector3(x2, y, z2);
            const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
            const length = start.distanceTo(end);

            // ════════════════════════════════════════════════════════════════
            // WARNING SPHERES FOR GAPS
            // ════════════════════════════════════════════════════════════════

            if (i >= visibleRungs) {
                // Show warning sphere at gap positions
                const warningGeometry = new THREE.SphereGeometry(0.08, 8, 8);
                const warningMaterial = new THREE.MeshBasicMaterial({
                    color: 0xff4444,
                    transparent: true,
                    opacity: 0.4 + Math.sin(Date.now() * 0.005 + i) * 0.2
                });
                const warningSphere = new THREE.Mesh(warningGeometry, warningMaterial);
                warningSphere.position.copy(midpoint);
                rungsGroup.add(warningSphere);
                continue;
            }

            // ════════════════════════════════════════════════════════════════
            // SOLID RUNGS
            // ════════════════════════════════════════════════════════════════

            const rungGeometry = new THREE.CylinderGeometry(
                0.04,    // Radius top
                0.04,    // Radius bottom
                length,  // Height (length of rung)
                6        // Radial segments
            );

            const rungMaterial = new THREE.MeshPhongMaterial({
                color: rungColor,
                emissive: rungColor,
                emissiveIntensity: isBalanced ? 0.3 : 0.15,
                transparent: true,
                opacity: rungOpacity * (i >= visibleRungs * 0.8 ? 0.6 : 1),
                shininess: 60
            });

            const rung = new THREE.Mesh(rungGeometry, rungMaterial);

            // Position at midpoint
            rung.position.copy(midpoint);

            // Orient cylinder to connect the two strand points
            const direction = new THREE.Vector3().subVectors(end, start).normalize();
            const up = new THREE.Vector3(0, 1, 0);
            const quaternion = new THREE.Quaternion().setFromUnitVectors(up, direction);
            rung.setRotationFromQuaternion(quaternion);

            rungsGroup.add(rung);
        }

        // ════════════════════════════════════════════════════════════════════
        // CENTRAL AXIS INDICATOR (for imbalanced helixes)
        // ════════════════════════════════════════════════════════════════════

        if (!isBalanced) {
            const axisGeometry = new THREE.CylinderGeometry(0.02, 0.02, helixHeight, 8);
            const axisColor = breathRatio > 0 ? 0x4444ff : 0xff4444;
            const axisMaterial = new THREE.MeshBasicMaterial({
                color: axisColor,
                transparent: true,
                opacity: 0.2
            });
            const axis = new THREE.Mesh(axisGeometry, axisMaterial);
            axis.position.set(centerX, helixHeight / 2, centerZ);
            rungsGroup.add(axis);
        }

        // Store metadata for inspection
        rungsGroup.userData = {
            breathRatio,
            isBalanced,
            balanceFactor,
            visibleRungs,
            maxRungs
        };

        return rungsGroup;
    }

    // ════════════════════════════════════════════════════════════════════════
    // BROWSER GLOBAL EXPORT
    // ════════════════════════════════════════════════════════════════════════

    if (typeof window !== 'undefined') {
        window.OctaveDNARungs = {
            createBreathRungs
        };

        console.log('🔗 [OctaveDNA Rungs] Breath rung module loaded');
    }

})();
