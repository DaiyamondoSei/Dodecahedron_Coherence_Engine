/**
 * ========================================
 * MODULE: dodec-geometry.js
 * ========================================
 *
 * Extracted from: dodecahedron-viz.js
 * Original lines: 495-770
 * Date: December 15, 2025
 *
 * PURPOSE:
 * Creates the dodecahedron geometry with 12 faces and 30 edges.
 * Handles material setup, click detection meshes, and edge tubes.
 *
 * DEPENDENCIES:
 * - THREE.js (global)
 * - dodec-state.js (for DodecState)
 * - dodec-topology.js (for buildFaceIndexMapping, findSharedEdgeVertices)
 * - dodec-materials.js (for ELEMENT_COLORS)
 * - dodecahedron-topology.js (for DodecahedronTopology.EDGES - SINGLE SOURCE OF TRUTH)
 *
 * EXPORTS (to window/global):
 * - createDodecahedron(): Main geometry creation function
 * - createInteractiveEdges(): Creates 30 tube geometry edges
 * - mainDodecahedron: (window export) Main THREE.js mesh
 * - dodecahedronMaterials: (window export) Array of 12 materials
 *
 * ========================================
 * CRITICAL BUG FIX (December 2025)
 * ========================================
 *
 * PROBLEM:
 * Neon tubes were going THROUGH pentagon faces instead of along edges.
 * Users reported visually incorrect tube placement where tubes would
 * cross through face interiors instead of running along face boundaries.
 *
 * ROOT CAUSE:
 * The original createInteractiveEdges() function used PROXIMITY-BASED
 * face detection to determine which two faces an edge connects:
 *
 *   // WRONG APPROACH (removed):
 *   const edgeMidpoint = start.add(end).multiplyScalar(0.5);
 *   const nearestFaces = faceCentroids
 *       .map(fc => ({ faceId: fc.faceId, distance: edgeMidpoint.distanceTo(fc.center) }))
 *       .sort((a, b) => a.distance - b.distance)
 *       .slice(0, 2);
 *
 * This was GEOMETRICALLY INCORRECT because:
 *   1. Dodecahedron uses golden ratio (PHI) proportions
 *   2. Face centroids are NOT equidistant from all edge midpoints
 *   3. An edge between Face A and Face B might have its midpoint
 *      geometrically closer to unrelated Face C
 *   4. Result: tubes placed between wrong face pairs → crossing through faces
 *
 * SOLUTION:
 * Use TOPOLOGY-BASED edge creation instead:
 *   1. Get canonical edge definitions from DodecahedronTopology.EDGES
 *      (the SINGLE SOURCE OF TRUTH for all 30 edges)
 *   2. For each edge definition (which specifies [faceA, faceB]):
 *      - Call findSharedEdgeVertices(faceA, faceB)
 *      - This finds the 2 vertices that belong to BOTH faces
 *      - These 2 vertices are the TRUE edge endpoints
 *   3. Create TubeGeometry between those exact vertex positions
 *
 * MATHEMATICAL INVARIANTS (must always hold):
 *   - Euler's formula: V - E + F = 2  →  20 - 30 + 12 = 2 ✓
 *   - Each vertex belongs to exactly 3 faces
 *   - Each face is a pentagon (5 vertices, 5 edges)
 *   - Two adjacent faces share exactly 2 vertices (the edge)
 *   - Two adjacent faces share exactly 1 edge
 *   - Total edges: 30 (12 faces × 5 edges ÷ 2 shared faces per edge)
 *
 * WHY TOPOLOGY ALWAYS WORKS:
 * Topology is a mathematical truth independent of geometry.
 * The adjacency relationships between faces, edges, and vertices
 * are FIXED for any dodecahedron regardless of:
 *   - Scale (radius)
 *   - Rotation
 *   - Position in space
 *   - Rendering engine quirks
 *
 * FUTURE CLAUDE - DEBUGGING GUIDE:
 * If tubes are misplaced again, check in this order:
 *
 *   1. Is DodecahedronTopology loaded?
 *      → Check: window.DodecahedronTopology?.EDGES?.length === 30
 *
 *   2. Does findSharedEdgeVertices return valid positions?
 *      → Test: findSharedEdgeVertices(1, 2) should return [Vector3, Vector3]
 *
 *   3. Are vertex positions correct?
 *      → Check: getDodecahedronVertices() returns 20 vertices
 *      → Verify positions match the rendered geometry
 *
 *   4. Is the fallback being used?
 *      → Look for console warning about "LEGACY proximity-based edges"
 *      → This indicates topology loading failed
 *
 *   5. Are face IDs 1-indexed or 0-indexed?
 *      → Analytical Face IDs are 1-12 (not 0-11)
 *      → Three.js geometry faces are 0-indexed
 *      → buildFaceIndexMapping() handles this conversion
 *
 * ========================================
 * GEOMETRY ARCHITECTURE
 * ========================================
 *
 * MAIN MESH:
 * - Uses DodecahedronGeometry(radius=2) from Three.js
 * - Has 12 material groups (one per pentagonal face)
 * - Each face = 3 triangles = 9 vertices in the buffer
 *
 * CLICK DETECTION:
 * - 12 invisible meshes for precise raycasting
 * - Added as children of mainDodecahedron (rotate together)
 * - userData.faceId stores the analytical Face ID (1-12)
 *
 * EDGE TUBES:
 * - 30 TubeGeometry cylinders representing edges
 * - Added as children of mainDodecahedron (rotate together)
 * - userData.edgeData stores: faceIds, element, tension, color
 *
 * SCENE HIERARCHY:
 *   mainDodecahedron (THREE.Mesh)
 *   ├── clickMesh_0 (faceId: 1)
 *   ├── clickMesh_1 (faceId: 2)
 *   ├── ... (12 total)
 *   ├── edgeTube_0 (faces: [1, 2])
 *   ├── edgeTube_1 (faces: [1, 6])
 *   └── ... (30 total)
 *
 * ========================================
 */
(function (global) {
    'use strict';

    // ========================================
    // IMPORTS
    // ========================================

    const S = global.DodecState;
    if (!S) {
        Logger.error('Geometry', 'DodecState not loaded!');
        return;
    }

    // ========================================
    // SECTION: Interactive Edge Creation
    // ========================================
    //
    // Creates 30 TubeGeometry edges connecting face pairs.
    // Each edge has userData for hover detection and tooltips.
    //
    // ========================================

    /**
     * Create interactive edges with userData for hover detection
     *
     * ========================================
     * TOPOLOGY-BASED EDGE CREATION (December 2025 Fix)
     * ========================================
     *
     * This function creates 30 TubeGeometry edges that visually represent
     * the connections between adjacent faces of the dodecahedron.
     *
     * ALGORITHM:
     * 1. Get canonical edge definitions from DodecahedronTopology.EDGES
     * 2. For each edge (defined by face pair [faceA, faceB]):
     *    a. Call findSharedEdgeVertices(faceA, faceB) to get the 2 endpoint positions
     *    b. Create a LineCurve3 from start to end
     *    c. Create TubeGeometry around that curve
     *    d. Attach metadata (element, tension, color) from topology/session data
     * 3. Add all tubes as children of parentMesh (so they rotate together)
     *
     * FALLBACK:
     * If DodecahedronTopology is not available, falls back to legacy
     * proximity-based detection (with prominent warning).
     *
     * @param {THREE.BufferGeometry} baseGeometry - The dodecahedron geometry (used for fallback)
     * @param {THREE.Mesh} parentMesh - Parent mesh to attach edges to
     * @param {THREE.Mesh[]} faceMeshesArray - Array of clickable face meshes (used for fallback)
     */
    function createInteractiveEdges(baseGeometry, parentMesh, faceMeshesArray) {

        // ========================================
        // CONFIGURATION
        // ========================================
        // Tube visual parameters - adjust these to change edge appearance

        const TUBE_RADIUS = 0.015;   // Radius of the tube cylinder
        const TUBE_SEGMENTS = 8;     // Segments along the tube length (smoothness)
        const TUBE_RADIAL = 6;       // Radial segments (roundness of cross-section)

        // Base material for tubes (cloned per edge to allow individual colors)
        const tubeMaterial = new THREE.MeshStandardMaterial({
            color: 0x00ffcc,          // Default neon cyan
            emissive: 0x004444,       // Glow effect
            emissiveIntensity: 0.3,
            metalness: 0.4,
            roughness: 0.6,
            transparent: true,
            opacity: 0.7
        });

        // Get element colors from global (defined in dodec-materials.js or constants)
        const ELEMENT_COLORS = global.ELEMENT_COLORS || S.ELEMENT_COLORS || {
            'Earth': '#8B4513',    // Brown - grounding, stability
            'Water': '#4169E1',    // Blue - flow, emotion
            'Fire': '#FF4500',     // Orange-red - transformation
            'Air': '#87CEEB',      // Light blue - communication
            'Ether': '#9370DB'     // Purple - integration, spirit
        };

        // ========================================
        // LOAD SESSION EDGE DATA (Optional enrichment)
        // ========================================
        // Try to load business-specific edge data (tension, questions, etc.)
        // This enriches the edges with context-specific information

        let edgeDataMap = {};
        try {
            const customDataJson = sessionStorage.getItem('customCompanyData');
            if (customDataJson) {
                const customData = JSON.parse(customDataJson);
                if (customData.edges) {
                    customData.edges.forEach(edge => {
                        // Key by sorted face pair for consistent lookup
                        const key = edge.faceIds.slice().sort().join('-');
                        edgeDataMap[key] = edge;
                    });
                }
            }
        } catch (e) {
            Logger.warn('Geometry', 'Could not load edge data from sessionStorage:', e);
        }

        // Also check company templates bundle
        if (Object.keys(edgeDataMap).length === 0 && global.CompanyTemplatesBundle?.templates) {
            const selectedCompanyId = sessionStorage.getItem('selectedCompanyId');
            if (selectedCompanyId && global.CompanyTemplatesBundle.templates[selectedCompanyId]?.edges) {
                const edges = global.CompanyTemplatesBundle.templates[selectedCompanyId].edges;
                edges.forEach(edge => {
                    const key = edge.faceIds.slice().sort().join('-');
                    edgeDataMap[key] = edge;
                });
            }
        }

        // ========================================
        // CHECK FOR TOPOLOGY DATA (AUTHORITATIVE SOURCE)
        // ========================================
        // DodecahedronTopology.EDGES is the SINGLE SOURCE OF TRUTH
        // for which faces are connected by which edges

        const DT = global.DodecahedronTopology;
        const topologyEdges = DT?.EDGES;
        const topologyAvailable = topologyEdges && topologyEdges.length === 30;

        if (!topologyAvailable) {
            // Log prominent warning - topology should always be available
            Logger.warn('Geometry', 'WARNING: DodecahedronTopology.EDGES not available!');
            Logger.warn('Geometry', 'Ensure js/geometry/dodecahedron-topology.js is loaded');
            Logger.warn('Geometry', 'before js/dodec/dodec-geometry.js in HTML script order.');
            Logger.warn('Geometry', 'Using LEGACY proximity-based edge detection (may be incorrect).');
        } else {
            Logger.info('Geometry', `Found ${topologyEdges.length} edge definitions from DodecahedronTopology`);
        }

        // ========================================
        // TOPOLOGY-BASED EDGE CREATION (CORRECT APPROACH)
        // ========================================
        // Iterate over the authoritative edge definitions and create tubes
        // using topology-verified vertex positions

        if (topologyAvailable) {
            Logger.info('Geometry', 'Creating edges using TOPOLOGY-BASED approach...');

            let successCount = 0;
            let failedEdges = [];

            topologyEdges.forEach((edgeDef, index) => {
                // Extract face pair from topology definition
                const [face1Id, face2Id] = edgeDef.faces;

                // ========================================
                // CRITICAL: Get vertex positions using TOPOLOGY
                // ========================================
                // findSharedEdgeVertices() returns the 2 vertices that belong
                // to BOTH faces - these are the TRUE edge endpoints
                const sharedVertices = global.findSharedEdgeVertices
                    ? global.findSharedEdgeVertices(face1Id, face2Id)
                    : null;

                if (!sharedVertices || sharedVertices.length !== 2) {
                    Logger.warn('Geometry',
                        `Edge ${edgeDef.id} (faces ${face1Id}-${face2Id}): ` +
                        `findSharedEdgeVertices returned ${sharedVertices?.length || 0} vertices. Skipping.`
                    );
                    failedEdges.push(edgeDef.id);
                    return; // Skip this edge
                }

                // The shared vertices are already cloned by findSharedEdgeVertices
                const start = sharedVertices[0];
                const end = sharedVertices[1];

                // Create tube geometry along the edge
                const curve = new THREE.LineCurve3(start, end);
                const tubeGeometry = new THREE.TubeGeometry(
                    curve,
                    TUBE_SEGMENTS,
                    TUBE_RADIUS,
                    TUBE_RADIAL,
                    false  // Not closed (it's a line, not a loop)
                );

                // Clone material for this edge (allows individual colors)
                const edgeTubeMaterial = tubeMaterial.clone();

                // Create the tube mesh
                const tubeMesh = new THREE.Mesh(tubeGeometry, edgeTubeMaterial);

                // ========================================
                // SET EDGE METADATA
                // ========================================
                // Combine topology data with session-specific business data

                const faceKey = edgeDef.faces.slice().sort().join('-');
                const mappedEdgeData = edgeDataMap[faceKey];

                // Build comprehensive userData for hover/click handling
                tubeMesh.userData.edgeData = {
                    // Core topology data (AUTHORITATIVE)
                    faceIds: edgeDef.faces,
                    topologyEdgeId: edgeDef.id,
                    element: edgeDef.element,
                    archetype: edgeDef.archetype,
                    theQuestion: edgeDef.question,

                    // Business context data (from session, may be null)
                    tension: mappedEdgeData?.tension || 0,
                    healthStatus: mappedEdgeData
                        ? (mappedEdgeData.tension < 0.1 ? 'Healthy' :
                            mappedEdgeData.tension < 0.2 ? 'Moderate' : 'Tense')
                        : 'Unknown',

                    // Visual styling
                    color: ELEMENT_COLORS[edgeDef.element] || '#00ffcc'
                };

                // Human-readable name for tooltips
                tubeMesh.userData.edgeName = edgeDef.archetype ||
                    mappedEdgeData?.emergentName ||
                    `Edge ${face1Id}-${face2Id}`;

                // Apply element color to material
                const edgeColor = new THREE.Color(tubeMesh.userData.edgeData.color);
                edgeTubeMaterial.color.copy(edgeColor);
                edgeTubeMaterial.emissive.copy(edgeColor).multiplyScalar(0.2);

                // Add to parent mesh (so tube rotates with dodecahedron)
                parentMesh.add(tubeMesh);
                S.edgeLines.push(tubeMesh);
                successCount++;
            });

            // ========================================
            // VALIDATION CHECKPOINT
            // ========================================

            Logger.info('Geometry', `Created ${successCount}/${topologyEdges.length} edges using topology`);

            if (failedEdges.length > 0) {
                Logger.error('Geometry', `FAILED EDGES: ${failedEdges.join(', ')}`);
            }

            // Validate Euler's formula: V - E + F = 2
            const eulerCheck = 20 - successCount + 12;
            if (eulerCheck !== 2) {
                Logger.error('Geometry', `EULER VALIDATION FAILED: 20 - ${successCount} + 12 = ${eulerCheck} (expected 2)`);
            } else {
                Logger.info('Geometry', `Euler validation passed: 20 - ${successCount} + 12 = 2`);
            }

            // Check for duplicates
            const edgeKeySet = new Set();
            let duplicateCount = 0;
            S.edgeLines.forEach(tube => {
                const faceIds = tube.userData.edgeData?.faceIds;
                if (faceIds) {
                    const key = faceIds.slice().sort().join('-');
                    if (edgeKeySet.has(key)) {
                        duplicateCount++;
                        Logger.warn('Geometry', `Duplicate edge detected: ${key}`);
                    }
                    edgeKeySet.add(key);
                }
            });

            if (duplicateCount > 0) {
                Logger.error('Geometry', `Found ${duplicateCount} duplicate edges`);
            }

            // Count edges per face (each face should have exactly 5)
            const faceEdgeCounts = {};
            S.edgeLines.forEach(tube => {
                const faceIds = tube.userData.edgeData?.faceIds;
                if (faceIds) {
                    faceIds.forEach(faceId => {
                        faceEdgeCounts[faceId] = (faceEdgeCounts[faceId] || 0) + 1;
                    });
                }
            });

            let faceCountErrors = 0;
            Object.entries(faceEdgeCounts).forEach(([faceId, count]) => {
                if (count !== 5) {
                    Logger.warn('Geometry', `Face ${faceId} has ${count} edges (expected 5)`);
                    faceCountErrors++;
                }
            });

            if (faceCountErrors === 0 && Object.keys(faceEdgeCounts).length === 12) {
                Logger.info('Geometry', 'All 12 faces have exactly 5 edges');
            }

            // Final success message
            if (successCount === 30 && failedEdges.length === 0 && duplicateCount === 0) {
                Logger.info('Geometry', 'SUCCESS: All 30 edges created correctly using topology!');
            }

            return; // Exit - topology-based creation complete
        }

        // ========================================
        // FALLBACK: LEGACY PROXIMITY-BASED APPROACH
        // ========================================
        // This code path should only execute if topology data is missing.
        // It uses geometric proximity which is less reliable.

        Logger.warn('Geometry', 'Using LEGACY proximity-based edge detection...');

        // Build face centroids for proximity detection
        const faceCentroids = [];
        faceMeshesArray.forEach((mesh, index) => {
            if (mesh.geometry) {
                mesh.geometry.computeBoundingBox();
                const center = new THREE.Vector3();
                mesh.geometry.boundingBox.getCenter(center);
                faceCentroids.push({
                    faceId: mesh.userData.faceId || (index + 1),
                    center: center.clone()
                });
            }
        });

        // Get edge vertices from Three.js EdgesGeometry
        const edgesGeometry = new THREE.EdgesGeometry(baseGeometry);
        const positions = edgesGeometry.attributes.position.array;
        const edgeCount = positions.length / 6;

        Logger.info('Geometry', `[LEGACY] Creating ${edgeCount} edges using proximity detection`);

        for (let i = 0; i < edgeCount; i++) {
            const start = new THREE.Vector3(
                positions[i * 6 + 0],
                positions[i * 6 + 1],
                positions[i * 6 + 2]
            );
            const end = new THREE.Vector3(
                positions[i * 6 + 3],
                positions[i * 6 + 4],
                positions[i * 6 + 5]
            );

            // LEGACY: Find nearest faces by proximity (may be incorrect!)
            const edgeMidpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
            const nearestFaces = faceCentroids
                .map(fc => ({ faceId: fc.faceId, distance: edgeMidpoint.distanceTo(fc.center) }))
                .sort((a, b) => a.distance - b.distance)
                .slice(0, 2)
                .map(fc => fc.faceId);

            // Create tube geometry
            const curve = new THREE.LineCurve3(start, end);
            const tubeGeometry = new THREE.TubeGeometry(curve, TUBE_SEGMENTS, TUBE_RADIUS, TUBE_RADIAL, false);
            const edgeTubeMaterial = tubeMaterial.clone();
            const tubeMesh = new THREE.Mesh(tubeGeometry, edgeTubeMaterial);

            // Look up edge data
            const faceKey = nearestFaces.slice().sort().join('-');
            const mappedEdgeData = edgeDataMap[faceKey];

            // Set userData (legacy format)
            tubeMesh.userData.edgeData = mappedEdgeData ? {
                faceIds: mappedEdgeData.faceIds,
                tension: mappedEdgeData.tension || 0,
                healthStatus: mappedEdgeData.tension < 0.1 ? 'Healthy' :
                    mappedEdgeData.tension < 0.2 ? 'Moderate' : 'Tense',
                element: mappedEdgeData.elementalNature || 'Unknown',
                color: ELEMENT_COLORS[mappedEdgeData.elementalNature] || '#00ffcc',
                theQuestion: mappedEdgeData.theQuestion || null
            } : {
                faceIds: nearestFaces,
                tension: 0,
                healthStatus: 'Unknown',
                element: 'Unknown',
                color: '#00ffcc',
                theQuestion: null
            };

            tubeMesh.userData.edgeName = mappedEdgeData?.emergentName || `Edge ${nearestFaces.join('-')}`;

            // Apply color
            const edgeColor = new THREE.Color(tubeMesh.userData.edgeData.color);
            edgeTubeMaterial.color.copy(edgeColor);
            edgeTubeMaterial.emissive.copy(edgeColor).multiplyScalar(0.2);

            parentMesh.add(tubeMesh);
            S.edgeLines.push(tubeMesh);
        }

        Logger.info('Geometry', `[LEGACY] Created ${S.edgeLines.length} edges (proximity-based - may be incorrect)`);
    }

    // ========================================
    // SECTION: Dodecahedron Creation
    // ========================================
    //
    // Creates the main dodecahedron mesh with:
    // - 12 MeshPhongMaterial for faces
    // - 12 invisible click detection meshes
    // - 30 TubeGeometry edges
    //
    // ========================================

    /**
     * Create the dodecahedron with 12 separate face meshes
     *
     * Main entry point for geometry creation.
     * Clears existing geometry, creates new mesh, and sets up edges.
     */
    function createDodecahedron() {
        Logger.info('Geometry', 'Creating dodecahedron...');

        // Clear existing geometry
        S.faceMeshes.forEach(mesh => S.scene.remove(mesh));
        S.edgeLines.forEach(line => S.scene.remove(line));
        S.faceMeshes = [];
        S.edgeLines = [];

        const radius = 2;

        // Use a single dodecahedron but assign material index per face
        const baseGeometry = new THREE.DodecahedronGeometry(radius);
        const position = baseGeometry.attributes.position;
        const index = baseGeometry.index;

        // ========================================
        // CREATE 12 MATERIALS
        // ========================================

        const materials = [];
        for (let i = 0; i < 12; i++) {
            materials.push(new THREE.MeshPhongMaterial({
                color: 0x00ffcc,           // Default cyan (will be updated by data)
                emissive: 0x002222,
                emissiveIntensity: 0.3,
                shininess: 40,
                transparent: false,
                opacity: 1.0,
                side: THREE.DoubleSide
            }));
        }

        // Assign material groups (each pentagonal face = 3 triangles)
        baseGeometry.clearGroups();
        for (let i = 0; i < 12; i++) {
            const start = i * 9; // 3 triangles × 3 vertices
            const count = 9;
            baseGeometry.addGroup(start, count, i);
        }

        // Create the main mesh with multiple materials
        const dodecahedron = new THREE.Mesh(baseGeometry, materials);
        S.scene.add(dodecahedron);

        // ========================================
        // CREATE CLICK DETECTION MESHES
        // ========================================

        // Store reference for raycasting
        // Create invisible face meshes for click detection
        for (let faceIndex = 0; faceIndex < 12; faceIndex++) {
            // Extract vertices for this face (3 triangles = 9 vertices)
            const start = faceIndex * 9;
            const faceVertices = [];

            // Check if geometry has index buffer
            if (index) {
                // Indexed geometry - use indices to access vertices
                for (let i = 0; i < 9; i++) {
                    const idx = index.getX(start + i);
                    faceVertices.push(
                        position.getX(idx),
                        position.getY(idx),
                        position.getZ(idx)
                    );
                }
            } else {
                // Non-indexed geometry - access vertices directly
                for (let i = 0; i < 9; i++) {
                    const vertexIndex = start + i;
                    faceVertices.push(
                        position.getX(vertexIndex),
                        position.getY(vertexIndex),
                        position.getZ(vertexIndex)
                    );
                }
            }

            // Create a geometry for this face
            const faceGeometry = new THREE.BufferGeometry();
            faceGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(faceVertices), 3));
            faceGeometry.setIndex([0, 1, 2, 3, 4, 5, 6, 7, 8]); // Three triangles
            faceGeometry.computeVertexNormals();

            // Create an invisible mesh just for raycasting
            const invisibleMaterial = new THREE.MeshBasicMaterial({
                visible: false,
                side: THREE.DoubleSide
            });

            const clickMesh = new THREE.Mesh(faceGeometry, invisibleMaterial);

            // Use same scale as visible mesh
            clickMesh.scale.set(1.0, 1.0, 1.0);

            clickMesh.userData.faceId = faceIndex + 1;
            clickMesh.userData.faceIndex = faceIndex;
            clickMesh.userData.materialIndex = faceIndex;
            clickMesh.userData.material = materials[faceIndex];

            // Add as child of main dodecahedron so they rotate together
            dodecahedron.add(clickMesh);
            S.faceMeshes.push(clickMesh);
        }

        // ========================================
        // STORE REFERENCES
        // ========================================

        S.mainDodecahedron = dodecahedron;
        S.materials = materials;

        // Expose to window for external access
        global.mainDodecahedron = dodecahedron;
        global.dodecahedronMaterials = materials;

        // Update the faceMeshes reference in dodecahedronViz if it exists
        if (global.dodecahedronViz) {
            global.dodecahedronViz.faceMeshes = S.faceMeshes;
        }

        // ========================================
        // BUILD FACE MAPPING
        // ========================================

        // Build topology-aware face mapping and update face IDs
        if (typeof global.buildFaceIndexMapping === 'function') {
            Logger.info('Geometry', 'Building topology-aware face mapping...');
            const faceMapping = global.buildFaceIndexMapping();

            if (faceMapping) {
                // Update face IDs based on topology mapping
                S.faceMeshes.forEach((mesh, faceIndex) => {
                    const analyticalFaceId = faceMapping[faceIndex];
                    if (analyticalFaceId) {
                        mesh.userData.faceId = analyticalFaceId;
                        Logger.debug('Geometry', `Geometry Face ${faceIndex + 1} → Analytical Face ${analyticalFaceId}`);
                    } else {
                        Logger.warn('Geometry', `No mapping found for geometry face ${faceIndex + 1}, using default Face ${faceIndex + 1}`);
                        mesh.userData.faceId = faceIndex + 1;
                    }
                });
                Logger.info('Geometry', 'Face IDs updated with topology mapping');
            } else {
                Logger.warn('Geometry', 'Face mapping failed, using default Face IDs (1-12)');
            }
        } else {
            Logger.info('Geometry', 'buildFaceIndexMapping not available, using default face IDs');
        }

        // ========================================
        // CREATE EDGES
        // ========================================

        createInteractiveEdges(baseGeometry, dodecahedron, S.faceMeshes);

        Logger.info('Geometry', `Created dodecahedron with ${materials.length} materials and ${S.faceMeshes.length} clickable faces`);
    }

    // ========================================
    // EXPORTS
    // ========================================

    global.createDodecahedron = createDodecahedron;
    global.createInteractiveEdges = createInteractiveEdges;

    Logger.info('Geometry', 'Module loaded - Geometry creation ready');

})(typeof window !== 'undefined' ? window : this);
