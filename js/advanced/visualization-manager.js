/**
 * ========================================
 * VisualizationManager - The Nervous System
 * ========================================
 *
 * Connects the "Brain" (Advanced Math) to the "Body" (Three.js Scene).
 * Implements the "Wisdom Layer" visualizations:
 * - Neon Edge Tubes (Phi-tuned tension)
 * - Vertex Spheres (Vortex energy)
 * - Feedback Loop Lines (Dashed flow)
 * - Immersive Phase Transitions (Glitch effects)
 *
 * DEPENDENCIES:
 * - THREE.js (global)
 * - js/constants/phi-harmonics.js (for PHI values)
 * - js/dodec/dodec-topology.js (for buildVertexToFacesMap, getDodecahedronVertices)
 *
 * ========================================
 * NOTES FOR FUTURE CLAUDE:
 * ========================================
 *
 * ARCHITECTURE:
 * This class manages THREE.js Groups containing dynamic visualization elements.
 * The groups (neonEdges, vertexSpheres, feedbackLoops) are added to the scene
 * and populated based on analysis data from OrganizationalCoherenceEngine.
 *
 * CRITICAL BUG FIX (December 2025) - Vertex Positioning:
 * ========================================
 * The getVertexPosition() method had a subtle but critical bug.
 *
 * THE BUG:
 * Original code assumed getDodecahedronVertices() returns vertices in
 * order matching analytical IDs (V1 at index 0, V2 at index 1, etc.).
 * This is FALSE - the array order depends on Map iteration order when
 * extracting unique vertices from Three.js geometry.
 *
 * SYMPTOMS:
 * Vertex spheres appeared displaced from edge endpoints in Advanced/Complete views.
 * They were at wrong vertex positions relative to where edges actually met.
 *
 * THE FIX:
 * Use topology-based lookup instead of array-index lookup:
 * 1. Each analytical vertex (V1-V20) belongs to exactly 3 faces (defined in dodec-topology.js)
 * 2. Use buildVertexToFacesMap() to get geometric vertex → face mappings
 * 3. Find the geometric vertex that belongs to ALL 3 target faces
 * 4. Return that vertex's position
 *
 * WHY THIS WORKS:
 * The topology is constant - vertex V1 ALWAYS belongs to faces [1, 2, 6].
 * By matching the target faces, we find the correct geometric vertex
 * regardless of array ordering.
 *
 * PULSE ANIMATION:
 * Edge tubes and vertex spheres use phi-tuned pulsing animation.
 * Per-edge timing prevents all edges from pulsing in sync, creating
 * a more organic "living system" feel.
 *
 * ========================================
 *
 * @author Deimantas Murauskas & Claude
 * @version 2.0 (Bug fix: topology-based vertex positioning)
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

        // Golden Ratio - single source: js/constants/phi-harmonics.js
        const PH = (typeof window !== 'undefined' && window.PhiHarmonics) || {};
        this.PHI = PH.PHI || 1.618033988749895;

        // State
        this.currentAnalysis = null;
        this.time = 0;
        this.pulsePhase = 0;
    }

    /**
     * Update visualization based on new analysis data
     * @param {Object} analysis - The full advancedAnalysis object
     * @param {Object} companyData - Optional company data for rich tooltips
     */
    updateData(analysis, companyData = null) {
        this.currentAnalysis = analysis;
        this.companyData = companyData;

        // Extract face names for tooltip context
        const faceNames = companyData?.faces?.map(f => f.name) || [];

        this.updateNeonEdges(analysis.edges, companyData, faceNames);
        this.updateVertexSpheres(analysis.vertices, companyData, faceNames);
        this.updateFeedbackLoops(analysis.dynamics);
        this.checkPhaseTransition(analysis.dynamics);
        this.highlightFrozenFaces(analysis.dynamics);
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

        // Use per-edge timing for individual pulse animation
        // Each edge pulses at its own frequency based on tension
        this.groups.neonEdges.children.forEach(tube => {
            this.animateEdgeWithTiming(tube, deltaTime);
        });

        // Animate Feedback Loops (Dash Offset for flowing effect)
        this.groups.feedbackLoops.children.forEach(line => {
            if (line.material.dashSize) {
                // Flow speed based on loop strength (stronger = faster)
                const flowSpeed = 2.0 + (line.userData.strength || 0) * 3.0;
                line.material.dashOffset -= deltaTime * flowSpeed;
            }
        });

        // Animate Vertex Spheres (subtle breathing effect)
        const vertexPulse = (Math.sin(this.pulsePhase * 0.5) + 1) * 0.5; // Slower pulse for vertices
        this.groups.vertexSpheres.children.forEach(sphere => {
            const data = sphere.userData;
            if (!data.isVertex) return;

            // Sprint 4 Task 32: Special pulsing animation for Bermuda Triangles
            if (data.isBermuda) {
                // Faster, more intense pulse for bermuda triangles (danger signal)
                const bermudaPulse = (Math.sin(this.time * 4) + 1) * 0.5;
                const bermudaScale = (data.baseScale || 1.0) + (bermudaPulse * 0.25);
                sphere.scale.setScalar(bermudaScale);

                // Strong emissive pulse (0.5 to 1.0)
                if (sphere.material.emissiveIntensity !== undefined) {
                    sphere.material.emissiveIntensity = 0.5 + (bermudaPulse * 0.5);
                }
                return; // Skip normal breathing for bermuda triangles
            }

            // Sprint 4 Task 35: Chirality-based rotation animation
            if (data.chirality && data.chirality !== 'neutral' && data.chiralityStrength > 0.1) {
                // Rotation speed based on chirality strength and vortex strength
                const rotationSpeed = 0.3 * (data.chiralityStrength || 0.5) * (data.vortexStrength || 0.5);
                const direction = data.chirality === 'clockwise' ? -1 : 1;
                sphere.rotation.y += rotationSpeed * direction * 0.016; // ~60fps delta
            }

            // Subtle scale breathing (1.0 to 1.08)
            const breathScale = (data.baseScale || 1.0) + (vertexPulse * 0.08 * (data.vortexStrength || 0.5));
            sphere.scale.setScalar(breathScale);

            // Emissive pulse
            const baseEmissive = data.baseEmissive || 0.5;
            const pulseValue = (vertexPulse - 0.5) * 0.2;
            if (sphere.material.emissiveIntensity !== undefined) {
                sphere.material.emissiveIntensity = baseEmissive + pulseValue;
            }
        });

        // Phase transition proximity effect (subtle pulsing when near threshold)
        if (this.phaseTransitionProximity > 0.6) {
            const urgency = (this.phaseTransitionProximity - 0.6) / 0.4; // 0-1 scale
            const urgentPulse = Math.sin(this.time * 4) * urgency * 0.1;

            // Apply urgent pulsing to all edges
            this.groups.neonEdges.children.forEach(tube => {
                if (tube.material.emissiveIntensity !== undefined) {
                    tube.material.emissiveIntensity += urgentPulse;
                }
            });
        }
    }

    /**
     * Highlight frozen faces in the dodecahedron
     * Called after dynamics analysis to mark faces with high inertia
     * @param {Object} dynamicsAnalysis - Dynamics analysis with inertia data
     */
    highlightFrozenFaces(dynamicsAnalysis) {
        if (!dynamicsAnalysis || !dynamicsAnalysis.inertia) return;

        const materials = window.dodecahedronMaterials;
        if (!materials) return;

        const frozenFaces = dynamicsAnalysis.inertia.faceInertia || [];

        frozenFaces.forEach(faceInertia => {
            const faceIndex = faceInertia.faceId - 1; // Convert to 0-indexed
            if (faceIndex < 0 || faceIndex >= materials.length) return;

            const material = materials[faceIndex];

            if (faceInertia.responsiveness === 'Frozen') {
                // High glow for frozen faces (ice-like effect)
                if (material.emissiveIntensity !== undefined) {
                    material.emissiveIntensity = 0.8;
                    material.emissive = new THREE.Color(0x4488ff); // Blue-ish frozen glow
                    material.needsUpdate = true;
                }
                console.log(`❄️ Face ${faceInertia.faceId} (${faceInertia.faceName}) is FROZEN`);
            } else if (faceInertia.responsiveness === 'Sticky') {
                // Moderate glow for sticky faces
                if (material.emissiveIntensity !== undefined) {
                    material.emissiveIntensity = 0.4;
                    material.emissive = new THREE.Color(0x888888); // Grey-ish sticky glow
                    material.needsUpdate = true;
                }
            }
        });
    }

    /**
     * Update Neon Edge Tubes
     * Renders tension/flow as glowing tubes along dodecahedron edges
     * @param {Array|Object} edgeAnalysis - Edge analysis data
     * @param {Object} companyData - Company data for rich tooltips
     * @param {Array} faceNames - Array of face names for context
     */
    updateNeonEdges(edgeAnalysis, companyData = null, faceNames = []) {
        // Clear existing
        while (this.groups.neonEdges.children.length > 0) {
            const obj = this.groups.neonEdges.children[0];
            obj.geometry.dispose();
            obj.material.dispose();
            this.groups.neonEdges.remove(obj);
        }

        // Handle both array and object with edges property
        const edges = Array.isArray(edgeAnalysis) ? edgeAnalysis : edgeAnalysis?.edges;
        if (!edges || edges.length === 0) return;

        // Create lookup for company edge data (for emergentName, theQuestion, etc.)
        const companyEdges = companyData?.edges || [];
        const edgeLookup = {};
        companyEdges.forEach(e => {
            edgeLookup[e.id] = e;
        });

        // Helper to get tension status label
        const getTensionStatus = (tension) => {
            if (tension < 0.2) return 'Harmonious';
            if (tension < 0.4) return 'Active';
            if (tension < 0.6) return 'Dynamic';
            if (tension < 0.8) return 'Intense';
            return 'Critical';
        };

        edges.forEach(edge => {
            // Render ALL edges (removed threshold to show all 30 edges)
            const flow = edge.flow || 0;
            {
                const isTension = edge.tension > flow;
                const intensity = isTension ? edge.tension : flow;

                const positions = this.getEdgePositions(edge.id);
                if (!positions) return;

                // Scale positions slightly outward (1.02x) so tubes render outside faces
                const scale = 1.02;
                const scaledStart = positions.start.clone().multiplyScalar(scale);
                const scaledEnd = positions.end.clone().multiplyScalar(scale);

                // Tube Radius: Base + intensity-scaled component for visibility
                // Low tension = thinner (0.02), high tension = thicker (0.06)
                const radius = 0.02 + intensity * 0.04;

                const curve = new THREE.LineCurve3(scaledStart, scaledEnd);
                const geometry = new THREE.TubeGeometry(
                    curve,
                    8,  // segments
                    radius,
                    12, // radialSegments
                    false // closed
                );

                // Color gradient: Low tension = subtle green-blue, High tension = vivid red
                // This provides visual hierarchy - healthy edges are calm, stressed edges pop
                let color;
                if (edge.tension < 0.2) {
                    // Very healthy flow - subtle teal
                    color = 0x44aaaa;
                } else if (edge.tension < 0.4) {
                    // Moderate - yellow-green
                    color = isTension ? 0xaaaa44 : 0x44aa44;
                } else {
                    // High tension - vivid red/green
                    color = isTension ? 0xff3333 : 0x33ff33;
                }
                const colorValue = new THREE.Color(color);

                // NEON GLOW: Emissive intensity scaled by tension
                // Low tension = subtle glow (0.3), high tension = bright glow (0.9)
                const baseOpacity = 0.5 + (edge.tension * 0.45); // 50-95% visible
                const emissiveIntensity = 0.3 + (edge.tension * 0.6);

                // MeshPhongMaterial for neon glow effect
                const material = new THREE.MeshPhongMaterial({
                    color: colorValue,
                    emissive: colorValue,
                    emissiveIntensity: emissiveIntensity,
                    transparent: true,
                    opacity: baseOpacity,
                    shininess: 100, // High shininess for neon look
                    side: THREE.DoubleSide,
                    depthTest: true,
                    depthWrite: true
                });

                // Get rich data from company edges if available
                const companyEdge = edgeLookup[edge.id] || {};

                // Parse face IDs from edge ID (e.g., "E1-2" or "1-2")
                const cleanId = edge.id.replace(/^E/, '');
                const [f1, f2] = cleanId.split('-').map(Number);

                const tube = new THREE.Mesh(geometry, material);
                tube.renderOrder = 10; // Render edges on top
                tube.userData = {
                    isPulsing: true,
                    isEdge: true,  // Marker for raycaster
                    edgeId: edge.id,
                    edgeName: companyEdge.emergentName || edge.archetype || edge.emergentName || edge.id,
                    face1Id: f1,
                    face2Id: f2,
                    face1Name: faceNames[f1 - 1] || `Face ${f1}`,
                    face2Name: faceNames[f2 - 1] || `Face ${f2}`,
                    tension: edge.tension,
                    tensionStatus: getTensionStatus(edge.tension),
                    flow: flow,
                    elementalNature: companyEdge.elementalNature || edge.element || edge.elementalNature || 'Unknown',
                    theQuestion: companyEdge.theQuestion || edge.question || edge.theQuestion || '',
                    intensity: intensity,
                    baseOpacity: baseOpacity,
                    baseEmissive: emissiveIntensity, // For hover effect restoration
                    // 📖 Rich narrative data from EdgeAnalyzer.generateNarrative()
                    narrative: edge.narrative || null,
                    archetype: edge.archetype || null,
                    kpiName: edge.kpiName || null,
                    kpiMetric: edge.kpiMetric || null
                };
                this.groups.neonEdges.add(tube);
            }
        });
    }

    /**
     * Update Vertex Spheres
     * Renders vortex energy as glowing spheres at dodecahedron vertices
     * @param {Array|Object} vertexAnalysis - Vertex analysis data
     * @param {Object} companyData - Company data for rich tooltips
     * @param {Array} faceNames - Array of face names for context
     */
    updateVertexSpheres(vertexAnalysis, companyData = null, faceNames = []) {
        // Clear existing
        while (this.groups.vertexSpheres.children.length > 0) {
            const obj = this.groups.vertexSpheres.children[0];
            obj.geometry.dispose();
            obj.material.dispose();
            this.groups.vertexSpheres.remove(obj);
        }

        // Handle both array and object with vertices property
        const vertices = Array.isArray(vertexAnalysis) ? vertexAnalysis : vertexAnalysis?.vertices;
        if (!vertices || vertices.length === 0) return;

        // Create lookup for company vertex data
        const companyVertices = companyData?.vertices || [];
        const vertexLookup = {};
        companyVertices.forEach(v => {
            vertexLookup[v.id] = v;
        });

        // Helper to classify vortex type
        const getVortexType = (strength, direction) => {
            if (strength > 0.6) return direction > 0 ? 'Amplifying Vortex' : 'Concentrating Vortex';
            if (strength > 0.3) return 'Active Confluence';
            return 'Gentle Convergence';
        };

        // φ⁻² (0.382) = Dormant boundary for color thresholds (computed once, not per-vertex)
        const PHI_2_THRESHOLD = (typeof PhiHarmonics !== 'undefined') ? PhiHarmonics.PHI_2 : 0.382;

        vertices.forEach(vertex => {
            // Render ALL vertices (removed threshold to show all 20 vertices)
            {
                const position = this.getVertexPosition(vertex.id);
                if (!position) return;

                // Position spheres exactly at vertices (no scaling)
                // Previous 1.05x caused misalignment with edge tube endpoints
                const scaledPosition = position.clone();

                // Size: Base + vortex-scaled component for visibility
                // Low strength = smaller (0.05), high strength = larger (0.18)
                const size = 0.05 + vertex.vortexStrength * 0.13;

                const geometry = new THREE.SphereGeometry(size, 16, 16);

                // Get rich data from company vertices FIRST (needed for classification check)
                const companyVertex = vertexLookup[vertex.id] || {};

                // Color hierarchy based on vortex strength and classification
                // Low strength = subtle colors, high strength = vivid colors
                let color;
                const strength = vertex.vortexStrength || 0;

                // Sprint 4 Task 32: Bermuda Triangle Detection - special handling
                const classification = companyVertex.classification || vertex.classification || '';
                const isBermuda = classification === 'bermuda_triangle';

                if (isBermuda) {
                    color = 0xff2222; // Deep red for bermuda triangles (critical imbalance)
                } else if (strength < 0.1) {
                    // Very low strength - subtle white/grey (synergy hubs, harmonious)
                    color = 0x88aaaa;
                } else if (strength < 0.2) {
                    // Low-moderate - soft cyan/teal
                    color = vertex.vortexDirection > 0 ? 0x66cccc : 0xccaa66;
                } else if (strength < PHI_2_THRESHOLD) {
                    // Below Dormant threshold (φ⁻² ≈ 0.382) - more saturated
                    color = vertex.vortexDirection > 0 ? 0x00ddaa : 0xddaa00;
                } else {
                    // High strength - vivid colors (hotspots, bermuda triangles)
                    if (vertex.vortexDirection > 0.2) {
                        color = 0x00ffcc; // Cyan (upward/positive spiral)
                    } else if (vertex.vortexDirection > -0.2) {
                        color = 0xffaa00; // Orange (neutral/turbulent)
                    } else {
                        color = 0xff4444; // Red (downward/negative spiral)
                    }
                }
                const colorValue = new THREE.Color(color);

                // NEON GLOW: Emissive intensity scaled by vortex strength
                // Low strength = subtle glow (0.25), high strength = bright glow (0.9)
                // Sprint 4 Task 32: Bermuda triangles get maximum glow
                const baseOpacity = isBermuda ? 0.95 : (0.4 + (strength * 0.5)); // 40-90% visible
                const emissiveIntensity = isBermuda ? 0.9 : (0.25 + (strength * 0.65));

                // MeshPhongMaterial for neon glow effect
                const material = new THREE.MeshPhongMaterial({
                    color: colorValue,
                    emissive: colorValue,
                    emissiveIntensity: emissiveIntensity,
                    transparent: true,
                    opacity: baseOpacity,
                    shininess: 80
                });

                // companyVertex already retrieved above for classification check

                // Map face IDs to face names
                const vertexFaceIds = vertex.faceIds || companyVertex.faceIds || [];
                const vertexFaceNames = vertexFaceIds.map(id => faceNames[id - 1] || `Face ${id}`);

                const sphere = new THREE.Mesh(geometry, material);
                sphere.position.copy(scaledPosition);
                sphere.userData = {
                    isVertex: true,  // Marker for raycaster
                    vertexId: vertex.id,
                    emergentName: companyVertex.emergentName || vertex.archetype || vertex.emergentName || `V${vertex.id}`,
                    faceIds: vertexFaceIds,
                    faceNames: vertexFaceNames,
                    vortexStrength: vertex.vortexStrength,
                    vortexDirection: vertex.vortexDirection || 0,
                    coherence: vertex.coherence || companyVertex.coherence || 0,
                    vortexType: vertex.vortexType || getVortexType(vertex.vortexStrength, vertex.vortexDirection || 0),
                    classification: companyVertex.classification || vertex.classification || 'Vortex Point',
                    tooltip: companyVertex.tooltip || vertex.tooltip || '',
                    isLeveragePoint: vertex.isLeveragePoint || false,
                    isBermuda: isBermuda, // Sprint 4 Task 32: Bermuda Triangle flag
                    // Sprint 4 Task 35: Chirality data for rotation animation
                    chirality: vertex.chirality || companyVertex.chirality || 'neutral',
                    chiralityStrength: vertex.chiralityStrength || companyVertex.chiralityStrength || 0,
                    chiralityLabel: vertex.chiralityLabel || companyVertex.chiralityLabel || 'Neutral',
                    chiralityDescription: vertex.chiralityDescription || companyVertex.chiralityDescription || 'Balanced energy flow',
                    baseOpacity: baseOpacity,
                    baseEmissive: emissiveIntensity, // For hover effect restoration
                    baseScale: 1.0, // For hover scale animation
                    // 📖 Rich narrative data from VertexAnalyzer.generateVertexNarrative()
                    narrative: vertex.narrative || null,
                    archetype: vertex.archetype || null,
                    healthStatus: vertex.healthStatus || null
                };
                this.groups.vertexSpheres.add(sphere);
            }
        });
    }

    /**
     * Update Feedback Loops
     * Renders critical feedback loops as colored lines connecting face centers
     * - Green: Virtuous cycles (positive reinforcement)
     * - Red: Vicious cycles (negative reinforcement)
     * - Orange: Neutral/mixed cycles
     * @param {Object} dynamicsAnalysis - Dynamics analysis with feedbackLoops data
     */
    updateFeedbackLoops(dynamicsAnalysis) {
        // Clear existing feedback loop lines
        while (this.groups.feedbackLoops.children.length > 0) {
            const obj = this.groups.feedbackLoops.children[0];
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) obj.material.dispose();
            this.groups.feedbackLoops.remove(obj);
        }

        if (!dynamicsAnalysis || !dynamicsAnalysis.feedbackLoops) return;

        const loops = dynamicsAnalysis.feedbackLoops.summary?.criticalLoops || [];
        if (loops.length === 0) return;

        // Render top 5 most impactful loops
        loops.slice(0, 5).forEach((loop, index) => {
            const points = [];

            // Get face center positions for each face in the cycle
            loop.cycle.forEach(faceId => {
                const pos = this.getFaceCenterPosition(faceId - 1); // 0-indexed
                if (pos) {
                    // Scale slightly outward so lines don't clip with faces
                    points.push(pos.clone().multiplyScalar(1.03));
                }
            });

            // Close the loop by connecting back to start
            if (points.length > 0) {
                points.push(points[0].clone());
            }

            if (points.length < 2) return;

            const geometry = new THREE.BufferGeometry().setFromPoints(points);

            // Color by loop type
            let color;
            if (loop.direction.includes('Virtuous')) {
                color = new THREE.Color(0x00ff88); // Green - generative
            } else if (loop.direction.includes('Vicious')) {
                color = new THREE.Color(0xff4444); // Red - degenerative
            } else {
                color = new THREE.Color(0xffaa00); // Orange - neutral/stabilizing
            }

            // Use LineDashedMaterial for animated flow effect
            const material = new THREE.LineDashedMaterial({
                color: color,
                linewidth: 2,
                transparent: true,
                opacity: 0.6 + (loop.strength * 0.3), // More visible for stronger loops
                dashSize: 0.15,
                gapSize: 0.08,
                scale: 1
            });

            const line = new THREE.Line(geometry, material);
            line.computeLineDistances(); // Required for dashed lines

            // Store loop data for tooltips and animation
            line.userData = {
                isFeedbackLoop: true,
                loopIndex: index,
                cycle: loop.cycle,
                faceNames: loop.faceNames || [],
                loopGain: loop.loopGain,
                type: loop.type,
                direction: loop.direction,
                strength: loop.strength,
                avgEnergy: loop.avgEnergy
            };

            line.renderOrder = 5; // Render above faces but below edges
            this.groups.feedbackLoops.add(line);
        });

        console.log(`✅ Rendered ${this.groups.feedbackLoops.children.length} feedback loops`);
    }

    /**
     * Get face center position from dodecahedron geometry
     * @param {number} faceIndex - 0-indexed face index
     * @returns {THREE.Vector3|null} Center position or null if not found
     */
    getFaceCenterPosition(faceIndex) {
        const faceMeshes = window.dodecahedronViz?.faceMeshes;
        if (!faceMeshes) {
            console.warn('⚠️ faceMeshes not available');
            return null;
        }
        if (faceIndex < 0 || faceIndex >= faceMeshes.length) {
            console.warn(`⚠️ faceIndex ${faceIndex} out of bounds`);
            return null;
        }

        const mesh = faceMeshes[faceIndex];
        const geometry = mesh.geometry;
        const position = geometry.attributes.position;

        // Calculate centroid from actual vertices
        let x = 0, y = 0, z = 0;
        const count = position.count;

        for (let i = 0; i < count; i++) {
            x += position.getX(i);
            y += position.getY(i);
            z += position.getZ(i);
        }

        return new THREE.Vector3(x / count, y / count, z / count);
    }

    /**
     * Check for Phase Transition effects
     * Triggers immersive visual effects when organization is near critical threshold
     * - Camera shake
     * - Pulsing glow on all elements
     * - Warning overlay (handled in HTML)
     * @param {Object} dynamicsAnalysis - Dynamics analysis with phaseTransitions data
     */
    checkPhaseTransition(dynamicsAnalysis) {
        if (!dynamicsAnalysis || !dynamicsAnalysis.phaseTransitions) return;

        const transitions = dynamicsAnalysis.phaseTransitions;
        const proximity = transitions.proximity || 0;

        // Store for animation effects
        this.phaseTransitionProximity = proximity;
        this.phaseTransitionImminent = transitions.isImminent || false;

        if (proximity > 0.8 && transitions.isImminent) {
            console.log('⚠️ PHASE TRANSITION IMMINENT - Activating effects');

            // Trigger camera shake effect
            this.triggerCameraShake();

            // Dispatch event for HTML warning overlay
            window.dispatchEvent(new CustomEvent('phaseTransitionImminent', {
                detail: {
                    nearestTransition: transitions.nearestTransition,
                    prediction: transitions.prediction,
                    proximity: proximity
                }
            }));
        }
    }

    /**
     * Trigger camera shake effect for phase transition
     * Creates subtle oscillation to convey system instability
     */
    triggerCameraShake() {
        if (!this.camera || this.isShaking) return;

        this.isShaking = true;
        const originalPosition = this.camera.position.clone();
        const shakeIntensity = 0.05;
        const shakeDuration = 2000; // 2 seconds
        const shakeFrequency = 30; // Hz
        const startTime = Date.now();

        const shake = () => {
            const elapsed = Date.now() - startTime;
            if (elapsed >= shakeDuration) {
                // Restore original position
                this.camera.position.copy(originalPosition);
                this.isShaking = false;
                return;
            }

            // Damping factor (shake reduces over time)
            const damping = 1 - (elapsed / shakeDuration);
            const intensity = shakeIntensity * damping;

            // High-frequency oscillation
            const t = elapsed * 0.001 * shakeFrequency * Math.PI * 2;
            const offsetX = Math.sin(t * 1.3) * intensity;
            const offsetY = Math.cos(t * 0.9) * intensity * 0.5;
            const offsetZ = Math.sin(t * 1.7) * intensity * 0.3;

            this.camera.position.set(
                originalPosition.x + offsetX,
                originalPosition.y + offsetY,
                originalPosition.z + offsetZ
            );

            requestAnimationFrame(shake);
        };

        requestAnimationFrame(shake);
    }

    /**
     * Apply per-edge animation timing
     * Each edge pulses at its own frequency based on tension level
     * Higher tension = faster pulse (more urgent)
     * @param {THREE.Mesh} tube - The edge tube mesh
     * @param {number} deltaTime - Time since last frame
     */
    animateEdgeWithTiming(tube, deltaTime) {
        const data = tube.userData;
        if (!data.isPulsing) return;

        // Initialize edge-specific phase if not exists
        if (data.pulsePhase === undefined) {
            data.pulsePhase = Math.random() * Math.PI * 2; // Random start phase
        }

        // Tension-based pulse speed: 0.5 (low tension) to 2.0 (high tension)
        const tensionSpeed = 0.5 + (data.tension || 0.5) * 1.5;

        // Accumulate phase
        data.pulsePhase += deltaTime * tensionSpeed;

        // Calculate pulse value
        const pulse = (Math.sin(data.pulsePhase) + 1) * 0.5;
        const pulseAmplitude = 0.12; // Slightly stronger pulse for individual timing
        const pulseValue = (pulse - 0.5) * 2 * pulseAmplitude;

        // Apply to material
        const baseOpacity = data.baseOpacity || 0.85;
        const baseEmissive = data.baseEmissive || 0.5;

        tube.material.opacity = Math.min(1.0, baseOpacity + pulseValue);
        if (tube.material.emissiveIntensity !== undefined) {
            tube.material.emissiveIntensity = baseEmissive + (pulseValue * 0.5);
        }
    }

    // --- Helpers ---

    getEdgePositions(edgeId) {
        // This requires access to the geometry. 
        // We can access window.dodecahedronViz.faceMeshes
        // An edge connects two faces. We can find the shared vertices.
        // edgeId is likely "1-2" (Face 1 and Face 2)
        if (!window.dodecahedronViz || !window.dodecahedronViz.faceMeshes) return null;

        // Handle edge IDs like "E1-2" or "1-2"
        const cleanId = edgeId.replace(/^E/, '');
        const parts = cleanId.split('-').map(Number);
        if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) {
            console.warn(`Invalid edge ID format: ${edgeId}`);
            return null;
        }
        const [f1, f2] = parts;

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
        //
        // BUG FIX v3 (Dec 2025): Previous approaches failed because:
        // - The face ID mapping (buildFaceIndexMapping) was broken
        // - Face meshes had wrong userData.faceId values
        //
        // NEW APPROACH: Extract ALL 20 vertex positions directly from geometry
        // and cache them. Use the vertex index to lookup.
        //
        // This bypasses face ID mapping entirely and works with raw geometry.

        // Extract numeric ID from "V1" -> 1
        const idNum = typeof vertexId === 'string'
            ? parseInt(vertexId.replace('V', ''))
            : vertexId;

        if (idNum < 1 || idNum > 20) {
            console.warn(`[visualization-manager] Invalid vertex ID: ${vertexId}`);
            return null;
        }

        // Check cache first
        if (!this._cachedVertexPositions) {
            this._cachedVertexPositions = this._extractAllVertexPositions();
        }

        if (!this._cachedVertexPositions || this._cachedVertexPositions.length < 20) {
            console.warn(`[visualization-manager] Could not extract vertex positions`);
            return null;
        }

        // Return position by index (idNum 1-20 maps to index 0-19)
        const position = this._cachedVertexPositions[idNum - 1];
        return position ? position.clone() : null;
    }

    /**
     * Extract all 20 unique vertex positions from the dodecahedron geometry
     * @private
     */
    _extractAllVertexPositions() {
        // Try to get from mainDodecahedron (most reliable)
        const dodec = window.mainDodecahedron;
        if (dodec && dodec.geometry) {
            const positions = dodec.geometry.attributes.position;
            const uniqueMap = new Map(); // key -> Vector3

            for (let i = 0; i < positions.count; i++) {
                const x = positions.getX(i);
                const y = positions.getY(i);
                const z = positions.getZ(i);
                const key = `${x.toFixed(5)},${y.toFixed(5)},${z.toFixed(5)}`;

                if (!uniqueMap.has(key)) {
                    uniqueMap.set(key, new THREE.Vector3(x, y, z));
                }
            }

            const vertices = Array.from(uniqueMap.values());
            console.log(`[visualization-manager] Extracted ${vertices.length} unique vertex positions from geometry`);

            if (vertices.length === 20) {
                return vertices;
            }
        }

        // Fallback: try to get from faceMeshes
        const faceMeshes = window.dodecahedronViz?.faceMeshes;
        if (faceMeshes && faceMeshes.length >= 12) {
            const uniqueMap = new Map();

            for (const mesh of faceMeshes) {
                if (!mesh.geometry) continue;
                const positions = mesh.geometry.attributes.position;

                for (let i = 0; i < positions.count; i++) {
                    const x = positions.getX(i);
                    const y = positions.getY(i);
                    const z = positions.getZ(i);
                    const key = `${x.toFixed(5)},${y.toFixed(5)},${z.toFixed(5)}`;

                    if (!uniqueMap.has(key)) {
                        uniqueMap.set(key, new THREE.Vector3(x, y, z));
                    }
                }
            }

            const vertices = Array.from(uniqueMap.values());
            console.log(`[visualization-manager] Extracted ${vertices.length} unique vertex positions from face meshes`);

            if (vertices.length === 20) {
                return vertices;
            }
        }

        console.warn('[visualization-manager] Could not extract 20 vertex positions');
        return null;
    }

    /**
     * Clear all advanced visualizations
     *
     * Called when switching from Advanced/Complete to Standard/Minimal mode.
     * Properly disposes geometries and materials to prevent memory leaks.
     *
     * Phase 0.1 Fix: This method is now the single source of truth for
     * clearing visualizations. Called via window.vizManager.clearAll()
     */
    clearAll() {
        console.log('🧹 [VisualizationManager] Clearing all advanced visualizations');

        // Clear neon edge tubes
        while (this.groups.neonEdges.children.length > 0) {
            const obj = this.groups.neonEdges.children[0];
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) obj.material.dispose();
            this.groups.neonEdges.remove(obj);
        }

        // Clear vertex spheres
        while (this.groups.vertexSpheres.children.length > 0) {
            const obj = this.groups.vertexSpheres.children[0];
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) obj.material.dispose();
            this.groups.vertexSpheres.remove(obj);
        }

        // Clear feedback loop lines
        while (this.groups.feedbackLoops.children.length > 0) {
            const obj = this.groups.feedbackLoops.children[0];
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) obj.material.dispose();
            this.groups.feedbackLoops.remove(obj);
        }

        // Clear cached vertex positions (force recalculation if needed)
        this._cachedVertexPositions = null;

        // Reset analysis state
        this.currentAnalysis = null;

        console.log('✅ [VisualizationManager] All visualizations cleared');
    }
}
