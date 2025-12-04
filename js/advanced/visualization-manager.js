/**
 * VisualizationManager - The Nervous System
 *
 * Connects the "Brain" (Advanced Math) to the "Body" (Three.js Scene).
 * Implements the "Wisdom Layer" visualizations:
 * - Neon Edge Tubes (Phi-tuned tension)
 * - Vertex Spheres (Vortex energy)
 * - Feedback Loop Lines (Dashed flow)
 * - Immersive Phase Transitions (Glitch effects)
 *
 * @author Deimantas Butrimas & Claude
 * @version 1.0
 */

export class VisualizationManager {
    constructor(scene, camera, renderer) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;

        // Groups for managing objects
        this.groups = {
            neonEdges: new THREE.Group(),
            vertexSpheres: new THREE.Group(),
            feedbackLoops: new THREE.Group()
        };

        // Add groups to scene
        this.scene.add(this.groups.neonEdges);
        this.scene.add(this.groups.vertexSpheres);
        this.scene.add(this.groups.feedbackLoops);

        // Golden Ratio
        this.PHI = 1.61803398875;

        // State
        this.currentAnalysis = null;
        this.time = 0;
        this.pulsePhase = 0;
    }

    /**
     * Update visualization based on new analysis data
     * @param {Object} analysis - The full advancedAnalysis object
     */
    updateData(analysis) {
        this.currentAnalysis = analysis;

        this.updateNeonEdges(analysis.edges);
        this.updateVertexSpheres(analysis.vertices);
        this.updateFeedbackLoops(analysis.dynamics);
        this.checkPhaseTransition(analysis.dynamics);
    }

    /**
     * Main animation loop update
     * @param {number} deltaTime - Time since last frame in seconds
     */
    update(deltaTime) {
        this.time += deltaTime;

        // Pulse effects (Phi-tuned)
        let pulseSpeed = 1.0;
        if (this.currentAnalysis && this.currentAnalysis.breath && this.currentAnalysis.breath.pulseSpeed) {
            pulseSpeed = this.currentAnalysis.breath.pulseSpeed;
        }

        // Accumulate phase to prevent jumps when speed changes
        this.pulsePhase += deltaTime * pulseSpeed;
        const pulse = (Math.sin(this.pulsePhase) + 1) * 0.5; // 0 to 1

        // Animate Neon Edges (Opacity Pulse)
        this.groups.neonEdges.children.forEach(tube => {
            if (tube.userData.isPulsing) {
                // Pulse opacity from 0.4 to 0.4 * Phi (approx 0.65)
                const baseOpacity = 0.4;
                const targetOpacity = baseOpacity * this.PHI;
                tube.material.opacity = baseOpacity + (targetOpacity - baseOpacity) * pulse;
            }
        });

        // Animate Feedback Loops (Dash Offset)
        this.groups.feedbackLoops.children.forEach(line => {
            if (line.material.dashSize) {
                line.material.dashOffset -= deltaTime * 2; // Flow animation
            }
        });
    }

    /**
     * Update Neon Edge Tubes
     */
    updateNeonEdges(edgeAnalysis) {
        // Clear existing
        while (this.groups.neonEdges.children.length > 0) {
            const obj = this.groups.neonEdges.children[0];
            obj.geometry.dispose();
            obj.material.dispose();
            this.groups.neonEdges.remove(obj);
        }

        if (!edgeAnalysis || !edgeAnalysis.edges) return;

        edgeAnalysis.edges.forEach(edge => {
            // Only render high tension or high flow edges
            if (edge.tension > 0.6 || edge.flow > 0.6) {
                const isTension = edge.tension > edge.flow;
                const intensity = isTension ? edge.tension : edge.flow;

                // Get vertex positions (we need to map edge IDs to geometric positions)
                // This relies on the global helper for now, or we pass vertices
                // For now, let's assume we can find the geometric vertices.
                // Actually, we need the geometric positions from the main scene.
                // We can find them by looking up the edge in the main `dodecahedronViz` if available,
                // or by recalculating.

                // Strategy: Use the global window.dodecahedronViz.faceMeshes to find shared vertices
                // This is a bit hacky but works for the "Brain Transplant" phase.
                const positions = this.getEdgePositions(edge.id);
                if (!positions) return;

                // Tube Radius: Base * Phi * Intensity
                const baseRadius = 0.02;
                const radius = baseRadius * this.PHI * intensity;

                const geometry = new THREE.TubeGeometry(
                    new THREE.LineCurve3(positions.start, positions.end),
                    4, // segments
                    radius,
                    8, // radialSegments
                    false // closed
                );

                const color = isTension ? 0xff0000 : 0x00ff00;

                const material = new THREE.MeshBasicMaterial({
                    color: color,
                    transparent: true,
                    opacity: 0.4,
                    blending: THREE.AdditiveBlending
                });

                const tube = new THREE.Mesh(geometry, material);
                tube.userData = { isPulsing: true };
                this.groups.neonEdges.add(tube);
            }
        });
    }

    /**
     * Update Vertex Spheres
     */
    updateVertexSpheres(vertexAnalysis) {
        // Clear existing
        while (this.groups.vertexSpheres.children.length > 0) {
            const obj = this.groups.vertexSpheres.children[0];
            obj.geometry.dispose();
            obj.material.dispose();
            this.groups.vertexSpheres.remove(obj);
        }

        if (!vertexAnalysis) return;

        vertexAnalysis.forEach(vertex => {
            // Only render significant vertices (Leverage points or high energy)
            if (vertex.isLeveragePoint || vertex.vortexStrength > 0.7) {
                const position = this.getVertexPosition(vertex.id); // Need helper
                if (!position) return;

                // Size: Base * Energy * Phi
                const baseSize = 0.15;
                const size = baseSize * vertex.vortexStrength * this.PHI;

                const geometry = new THREE.SphereGeometry(size, 16, 16);

                const color = vertex.isLeveragePoint ? 0xffd700 : 0x800080; // Gold or Purple

                const material = new THREE.MeshBasicMaterial({
                    color: color,
                    transparent: true,
                    opacity: 0.8
                });

                const sphere = new THREE.Mesh(geometry, material);
                this.groups.vertexSpheres.add(sphere);
            }
        });
    }

    /**
     * Update Feedback Loops
     */
    updateFeedbackLoops(dynamicsAnalysis) {
        // Placeholder for now - requires complex path finding visualization
    }

    /**
     * Check for Phase Transition effects
     */
    checkPhaseTransition(dynamicsAnalysis) {
        if (dynamicsAnalysis && dynamicsAnalysis.phaseTransitions.proximity > 0.8) {
            // Trigger glitch effect (can implement via post-processing or camera shake)
            // For now, just log it
            // console.log("⚠️ PHASE TRANSITION IMMINENT");
        }
    }

    // --- Helpers ---

    getEdgePositions(edgeId) {
        // This requires access to the geometry. 
        // We can access window.dodecahedronViz.faceMeshes
        // An edge connects two faces. We can find the shared vertices.
        // edgeId is likely "1-2" (Face 1 and Face 2)
        if (!window.dodecahedronViz || !window.dodecahedronViz.faceMeshes) return null;

        const [f1, f2] = edgeId.split('-').map(Number);
        // Use the global helper defined in dodecahedron-viz.js
        if (typeof window.findSharedEdgeVertices === 'function') {
            const vertices = window.findSharedEdgeVertices(f1, f2);
            if (vertices && vertices.length === 2) {
                return { start: vertices[0], end: vertices[1] };
            }
        }
        return null;
    }

    getVertexPosition(vertexId) {
        // vertexId is likely "V1", "V2" or just 1, 2
        // We need to map this to geometric coordinates.
        // Global helper: window.getGeometricVertexIndex(id)
        if (!window.dodecahedronViz || !window.dodecahedronViz.faceMeshes) return null;

        // Assume we can get all vertices from the first face mesh's parent geometry?
        // Or use window.getDodecahedronVertices()
        if (typeof window.getDodecahedronVertices === 'function') {
            const allVertices = window.getDodecahedronVertices();
            // Extract numeric ID from "V1" -> 1
            const idNum = parseInt(vertexId.replace('V', ''));
            const index = window.getGeometricVertexIndex(idNum);
            if (allVertices[index]) {
                return allVertices[index];
            }
        }
        return null;
    }
}
