/**
 * ════════════════════════════════════════════════════════════════════════════
 *
 *    ██████╗ ███╗   ██╗ █████╗     ██╗  ██╗███████╗██╗     ██╗██╗  ██╗
 *    ██╔══██╗████╗  ██║██╔══██╗    ██║  ██║██╔════╝██║     ██║╚██╗██╔╝
 *    ██║  ██║██╔██╗ ██║███████║    ███████║█████╗  ██║     ██║ ╚███╔╝
 *    ██║  ██║██║╚██╗██║██╔══██║    ██╔══██║██╔══╝  ██║     ██║ ██╔██╗
 *    ██████╔╝██║ ╚████║██║  ██║    ██║  ██║███████╗███████╗██║██╔╝ ██╗
 *    ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═╝    ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝╚═╝  ╚═╝
 *
 *                    THE CORE VISUAL OF OCTAVE DNA
 *
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Creates the 6 DNA double-helix structures representing breath axes.
 * Each helix has 7 octave levels with Fibonacci radius expansion.
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                        NOTES FOR FUTURE CLAUDE                          │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * THE DOUBLE HELIX METAPHOR:
 * ─────────────────────────────────────────────────────────────────────────
 * Each of the 6 breath axes is visualized as a DNA double-helix because:
 *
 *   1. COMPLEMENTARY STRANDS - Just as DNA has two complementary strands,
 *      each breath axis pairs a projection face with a reception face.
 *      They're opposites that complete each other.
 *
 *   2. BREATH RUNGS - The rungs connecting the two strands visualize the
 *      "breathing" between them. Balanced breath = solid rungs.
 *      Imbalanced = gaps and warning indicators.
 *
 *   3. OCTAVE LEVELS - The 7 levels of each helix represent developmental
 *      stages from Survival (O1) to Radiance (O7). Like DNA encoding
 *      potential, the ghostly unreached octaves show organizational potential.
 *
 * THE TRANSPARENCY TRICK:
 * ─────────────────────────────────────────────────────────────────────────
 * This is the key visual insight! When an octave is NOT reached:
 *   • opacity is reduced to 15% of normal (baseOpacity *= 0.15)
 *   • emissive glow is reduced to 0.2
 *
 * This creates "ghostly" unreached octaves that show potential vs actual.
 * Reached octaves glow solid and bright. Beautiful and meaningful!
 *
 * HEXAGONAL ARRANGEMENT:
 * ─────────────────────────────────────────────────────────────────────────
 * The 6 helixes are arranged in a hexagon pattern using:
 *   x = cos(angle) × helixSpacing
 *   z = sin(angle) × helixSpacing
 *
 * Where angle = (index × 2π) / 6, creating 60° increments.
 *
 * NAVIGATION MAP:
 * ─────────────────────────────────────────────────────────────────────────
 * ├─ DEPENDS ON:
 * │  ├─ THREE.js (global)
 * │  ├─ OctaveDNAState (CONFIG, dnaHelices)
 * │  ├─ OctaveDNAHelpers (getFibonacciRadius, isOctaveReached, etc.)
 * │  └─ helix-rungs.js (createBreathRungs)
 * │
 * └─ USED BY:
 *    └─ octave-dna-main.js (calls renderDNA on initialization)
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │                     WHAT THIS SESSION LEARNED                         │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * 1. The helix transparency trick (reached vs unreached octaves) was
 *    inspired by showing "potential vs actual" - a beautiful metaphor
 *    for organizational development.
 *
 * 2. Fibonacci radius expansion (1, 1, 2, 3, 5...) for octave spacing
 *    creates natural visual hierarchy without arbitrary magic numbers.
 *
 * 3. Using TubeGeometry for DNA strands creates smooth, organic curves
 *    that feel alive and flowing.
 *
 * ════════════════════════════════════════════════════════════════════════════
 * @version 1.0.0 - Extracted from octave-dna.html monolith
 * @created 2025-12-19
 */

(function() {
    'use strict';

    // Track clickable meshes for raycasting
    let clickableMeshes = [];

    // ════════════════════════════════════════════════════════════════════════
    // STRAND CREATION
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Create a single DNA strand (one helix spiral segment)
     *
     * Each strand is a tube that spirals around the center axis.
     * The spiral uses CatmullRomCurve3 for smooth interpolation.
     *
     * @param {number} octave - Octave level (1-7)
     * @param {number} fibRadius - Fibonacci-scaled radius for this octave
     * @param {number} phaseOffset - Phase offset (0 or π for opposite strands)
     * @param {number} centerX - X position of helix center
     * @param {number} centerZ - Z position of helix center
     * @param {number} color - Color as integer
     * @param {number} opacity - Transparency (0-1)
     * @param {number} emissiveIntensity - Glow intensity
     * @param {Object} helix - Helix configuration object
     * @param {number} strandNum - Strand number (1 or 2)
     * @returns {THREE.Mesh} The strand mesh
     */
    function createStrand(octave, fibRadius, phaseOffset, centerX, centerZ, color, opacity, emissiveIntensity, helix, strandNum) {
        const State = window.OctaveDNAState;
        const CONFIG = State?.CONFIG || {};

        const helixHeight = CONFIG.helixHeight || 22;
        const helixTurns = CONFIG.helixTurns || 4;
        const strandRadius = CONFIG.strandRadius || 0.8;
        const tubeRadius = CONFIG.tubeRadius || 0.18;
        const segments = CONFIG.segments || 150;

        // Calculate Y range for this octave
        const yStart = ((octave - 1) / 7) * helixHeight;
        const yEnd = (octave / 7) * helixHeight;

        // Generate spiral points
        const points = [];
        const segmentPoints = 25;

        for (let i = 0; i <= segmentPoints; i++) {
            const t = i / segmentPoints;
            const globalT = ((octave - 1) + t) / 7;
            const angle = 2 * Math.PI * helixTurns * globalT + phaseOffset;
            const y = yStart + (yEnd - yStart) * t;

            const spiralR = strandRadius * fibRadius;
            const x = centerX + spiralR * Math.cos(angle);
            const z = centerZ + spiralR * Math.sin(angle);

            points.push(new THREE.Vector3(x, y, z));
        }

        // Create smooth curve through points
        const curve = new THREE.CatmullRomCurve3(points);

        // Create tube geometry following the curve
        const geometry = new THREE.TubeGeometry(
            curve,
            Math.floor(segments / 10),  // Tube segments
            tubeRadius,                  // Tube radius
            8,                           // Radial segments
            false                        // Not closed
        );

        // Material with glow effect
        const material = new THREE.MeshPhongMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: emissiveIntensity,
            transparent: true,
            opacity: opacity,
            shininess: 120
        });

        const mesh = new THREE.Mesh(geometry, material);

        // Store metadata for interaction
        mesh.userData = {
            helixId: helix.id,
            helix: helix,
            octave: octave,
            strandNum: strandNum,
            clickable: true
        };

        return mesh;
    }

    // ════════════════════════════════════════════════════════════════════════
    // DOUBLE HELIX CREATION
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Create a DNA double helix with transparency for unreached octaves
     *
     * This is the core function that creates a complete helix structure
     * with both strands for all 7 octaves, plus breath rungs.
     *
     * @param {Object} helix - Helix configuration object
     * @param {number} centerX - X position in the hexagonal arrangement
     * @param {number} centerZ - Z position in the hexagonal arrangement
     * @returns {THREE.Group} Group containing both strands and rungs
     */
    function createDoubleHelix(helix, centerX, centerZ) {
        const State = window.OctaveDNAState;
        const Helpers = window.OctaveDNAHelpers;
        const CONFIG = State?.CONFIG || {};

        const maxOctaves = CONFIG.maxOctaves || 7;
        const group = new THREE.Group();
        group.userData = { helixId: helix.id, helix: helix };

        // Create strands for each octave
        for (let octave = 1; octave <= maxOctaves; octave++) {
            const fibRadius = Helpers.getFibonacciRadius(octave);

            // Check if this octave is reached for both faces
            const face1Reached = Helpers.isOctaveReached(helix.faces[0], octave);
            const face2Reached = Helpers.isOctaveReached(helix.faces[1], octave);
            const octaveReached = face1Reached || face2Reached;

            // Calculate opacity - THE TRANSPARENCY TRICK!
            // Reached octaves are visible, unreached are ghostly
            let baseOpacity = Math.pow(1 - (octave - 1) / 7, 1.3) * 0.9;
            if (!octaveReached) {
                baseOpacity *= 0.15; // Make unreached octaves almost transparent
            }

            // Emissive glow - strong for reached, dim for unreached
            const emissive = octaveReached ? (1.2 - (octave - 1) * 0.15) : 0.2;

            // Create both strands (phase offset of 0 and π for opposite spirals)
            const strand1 = createStrand(octave, fibRadius, 0, centerX, centerZ, helix.color, baseOpacity, emissive, helix, 1);
            const strand2 = createStrand(octave, fibRadius, Math.PI, centerX, centerZ, helix.color, baseOpacity, emissive, helix, 2);

            group.add(strand1);
            group.add(strand2);

            // Track for raycasting
            clickableMeshes.push(strand1);
            clickableMeshes.push(strand2);
        }

        // Add breath connection rungs
        const energy1 = Helpers.getFaceEnergy(helix.faces[0]); // Projection
        const energy2 = Helpers.getFaceEnergy(helix.faces[1]); // Reception
        const breathRatio = Helpers.calculatePhiBreathRatio(energy1, energy2);

        // Create breath rungs (from helix-rungs.js)
        if (window.OctaveDNARungs) {
            const rungs = window.OctaveDNARungs.createBreathRungs(helix, centerX, centerZ, breathRatio);
            group.add(rungs);
        }

        return group;
    }

    // ════════════════════════════════════════════════════════════════════════
    // RENDER ALL DNA HELIXES
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Render all 6 DNA helixes in hexagonal arrangement
     *
     * This is the main entry point called by octave-dna-main.js
     * It creates all helixes and adds them to the scene.
     */
    function renderDNA() {
        const State = window.OctaveDNAState;
        const CONFIG = State?.CONFIG || {};

        const scene = State.getState('scene');
        if (!scene) {
            console.error('❌ [Helix Geometry] Scene not available!');
            return;
        }

        // Clear previous clickable meshes
        clickableMeshes = [];

        // Create container group
        const dnaGroup = new THREE.Group();

        // Get helix configurations
        const dnaHelices = State.getState('dnaHelices') || State._state?.dnaHelices || [];
        const helixSpacing = CONFIG.helixSpacing || 12;

        // Create each helix in hexagonal arrangement
        dnaHelices.forEach(helix => {
            const x = Math.cos(helix.angle) * helixSpacing;
            const z = Math.sin(helix.angle) * helixSpacing;
            const doubleHelix = createDoubleHelix(helix, x, z);
            dnaGroup.add(doubleHelix);
        });

        // Add elegant octave markers at center
        addOctaveMarkers(dnaGroup, CONFIG);

        // Store and add to scene
        State.setState('dnaGroup', dnaGroup);
        scene.add(dnaGroup);

        console.log('🧬 [Helix Geometry] Rendered', dnaHelices.length, 'DNA helixes');

        return dnaGroup;
    }

    /**
     * Add central octave marker spheres
     *
     * These small colored spheres at the center show octave levels
     * with consistent color coding (red to purple).
     *
     * @param {THREE.Group} dnaGroup - Parent group for markers
     * @param {Object} CONFIG - Configuration object
     */
    function addOctaveMarkers(dnaGroup, CONFIG) {
        const helixHeight = CONFIG.helixHeight || 22;

        // Octave colors (red to purple spectrum)
        const octaveColors = [
            0xff3333,  // O1 Survival - Red
            0xff9900,  // O2 Structure - Orange
            0xffff00,  // O3 Relationships - Yellow
            0x00ff66,  // O4 Creativity - Green
            0x00ffcc,  // O5 Expression - Cyan
            0x00ccff,  // O6 Vision - Blue
            0xaa00ff   // O7 Radiance - Purple
        ];

        for (let i = 0; i < 7; i++) {
            const y = (i / 7) * helixHeight;
            const geometry = new THREE.SphereGeometry(0.2, 16, 16);
            const material = new THREE.MeshBasicMaterial({
                color: octaveColors[i],
                transparent: true,
                opacity: 0.6
            });
            const sphere = new THREE.Mesh(geometry, material);
            sphere.position.set(0, y, 0);
            dnaGroup.add(sphere);
        }
    }

    /**
     * Clear and re-render DNA visualization
     * Used when company data changes
     */
    function refreshDNA() {
        const State = window.OctaveDNAState;
        const scene = State.getState('scene');
        const dnaGroup = State.getState('dnaGroup');

        // Remove existing DNA group
        if (dnaGroup && scene) {
            scene.remove(dnaGroup);

            // Dispose geometries and materials
            dnaGroup.traverse((child) => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(m => m.dispose());
                    } else {
                        child.material.dispose();
                    }
                }
            });
        }

        // Render fresh
        return renderDNA();
    }

    /**
     * Get clickable meshes for raycasting
     * @returns {Array} Array of clickable THREE.Mesh objects
     */
    function getClickableMeshes() {
        return clickableMeshes;
    }

    // ════════════════════════════════════════════════════════════════════════
    // BROWSER GLOBAL EXPORT
    // ════════════════════════════════════════════════════════════════════════

    if (typeof window !== 'undefined') {
        window.OctaveDNAGeometry = {
            createStrand,
            createDoubleHelix,
            renderDNA,
            refreshDNA,
            getClickableMeshes
        };

        console.log('🧬 [OctaveDNA Geometry] Helix creation module loaded');
    }

})();
