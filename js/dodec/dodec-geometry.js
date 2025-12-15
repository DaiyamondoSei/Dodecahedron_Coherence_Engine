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
 * - dodec-topology.js (for buildFaceIndexMapping)
 * - dodec-materials.js (for ELEMENT_COLORS)
 *
 * EXPORTS (to window/global):
 * - createDodecahedron(): Main geometry creation function
 * - createInteractiveEdges(): Creates 30 tube geometry edges
 * - mainDodecahedron: (window export) Main THREE.js mesh
 * - dodecahedronMaterials: (window export) Array of 12 materials
 *
 * NOTES FOR FUTURE CLAUDE:
 * ========================================
 * GEOMETRY ARCHITECTURE:
 * - Main mesh uses DodecahedronGeometry with 12 material groups
 * - Each face = 3 triangles = 9 vertices in the buffer
 * - 12 invisible click meshes for precise raycasting
 * - 30 TubeGeometry edges for visual edge representation
 *
 * MATERIAL GROUPS:
 * baseGeometry.addGroup(start, count, materialIndex) assigns
 * triangles 0-2 to material 0, triangles 3-5 to material 1, etc.
 *
 * FACE ID MAPPING:
 * After geometry creation, buildFaceIndexMapping() from dodec-topology.js
 * maps Three.js face indices (0-11) to analytical Face IDs (1-12).
 * This is critical for connecting clicks to correct business data.
 *
 * TUBE EDGES:
 * TubeGeometry creates cylindrical edges instead of lines.
 * Each edge stores faceIds, tension, element, color in userData.
 * Edge data comes from sessionStorage (mapping context).
 *
 * PARENT-CHILD RELATIONSHIP:
 * - clickMeshes and edgeLines are children of mainDodecahedron
 * - This ensures they rotate together as a unit
 *
 * ========================================
 */
(function(global) {
    'use strict';

    // ========================================
    // IMPORTS
    // ========================================

    const S = global.DodecState;
    if (!S) {
        console.error('[dodec-geometry] DodecState not loaded!');
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
     * Uses TubeGeometry for 3D appearance instead of lines.
     * Edges are colored by element and store relationship data.
     *
     * @param {THREE.BufferGeometry} baseGeometry - The dodecahedron geometry
     * @param {THREE.Mesh} parentMesh - Parent mesh to attach edges to
     * @param {THREE.Mesh[]} faceMeshesArray - Array of clickable face meshes
     */
    function createInteractiveEdges(baseGeometry, parentMesh, faceMeshesArray) {
        // Get edge vertices from EdgesGeometry
        const edgesGeometry = new THREE.EdgesGeometry(baseGeometry);
        const positions = edgesGeometry.attributes.position.array;

        // Build a map of face centroids for determining which faces an edge belongs to
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

        // Try to load edge data from mapping context (sessionStorage or global)
        let edgeDataMap = {};
        try {
            const customDataJson = sessionStorage.getItem('customCompanyData');
            if (customDataJson) {
                const customData = JSON.parse(customDataJson);
                // Build a map keyed by sorted face pair
                if (customData.edges) {
                    customData.edges.forEach(edge => {
                        const key = edge.faceIds.slice().sort().join('-');
                        edgeDataMap[key] = edge;
                    });
                }
            }
        } catch (e) {
            console.warn('[dodec-geometry] Could not load edge data from sessionStorage:', e);
        }

        // Also check for loaded company context
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

        // ============================================================
        // TUBE GEOMETRY EDGES - Enhanced 3D visual for thesis defense
        // ============================================================

        // Configuration for tube edges
        const TUBE_RADIUS = 0.015;   // Radius of the tube
        const TUBE_SEGMENTS = 8;     // Smoothness of tube cross-section
        const TUBE_RADIAL = 6;       // Radial segments (roundness)

        // Create base material for tubes (will be cloned per edge)
        const tubeMaterial = new THREE.MeshStandardMaterial({
            color: 0x00ffcc,
            emissive: 0x004444,
            emissiveIntensity: 0.3,
            metalness: 0.4,
            roughness: 0.6,
            transparent: true,
            opacity: 0.7
        });

        const edgeCount = positions.length / 6; // 2 vertices per edge, 3 coords per vertex
        console.log(`[dodec-geometry] Creating ${edgeCount} TubeGeometry edges`);

        // Get ELEMENT_COLORS from global (set by dodec-materials.js)
        const ELEMENT_COLORS = global.ELEMENT_COLORS || S.ELEMENT_COLORS || {
            'Earth': '#8B4513',
            'Water': '#4169E1',
            'Fire': '#FF4500',
            'Air': '#87CEEB',
            'Ether': '#9370DB'
        };

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

            // Find the two faces this edge belongs to by checking proximity to face centroids
            const edgeMidpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
            const nearestFaces = faceCentroids
                .map(fc => ({ faceId: fc.faceId, distance: edgeMidpoint.distanceTo(fc.center) }))
                .sort((a, b) => a.distance - b.distance)
                .slice(0, 2)
                .map(fc => fc.faceId);

            // Create TubeGeometry using LineCurve3
            const curve = new THREE.LineCurve3(start, end);
            const tubeGeometry = new THREE.TubeGeometry(curve, TUBE_SEGMENTS, TUBE_RADIUS, TUBE_RADIAL, false);

            // Clone material for potential color changes per edge
            const edgeTubeMaterial = tubeMaterial.clone();

            // Create tube mesh
            const tubeMesh = new THREE.Mesh(tubeGeometry, edgeTubeMaterial);

            // Look up edge data from mapping context
            const faceKey = nearestFaces.slice().sort().join('-');
            const mappedEdgeData = edgeDataMap[faceKey];

            // Set userData for hover detection
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

            // Apply the element color to the material
            const edgeColor = new THREE.Color(tubeMesh.userData.edgeData.color);
            edgeTubeMaterial.color.copy(edgeColor);
            edgeTubeMaterial.emissive.copy(edgeColor).multiplyScalar(0.2);

            // Add to parent mesh so it rotates together
            parentMesh.add(tubeMesh);
            S.edgeLines.push(tubeMesh);
        }

        console.log(`[dodec-geometry] Created ${S.edgeLines.length} TubeGeometry edges with ${Object.keys(edgeDataMap).length} mapped data entries`);
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
        console.log('[dodec-geometry] Creating dodecahedron...');

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
            console.log('[dodec-geometry] Building topology-aware face mapping...');
            const faceMapping = global.buildFaceIndexMapping();

            if (faceMapping) {
                // Update face IDs based on topology mapping
                S.faceMeshes.forEach((mesh, faceIndex) => {
                    const analyticalFaceId = faceMapping[faceIndex];
                    if (analyticalFaceId) {
                        mesh.userData.faceId = analyticalFaceId;
                        console.log(`[dodec-geometry] Geometry Face ${faceIndex + 1} → Analytical Face ${analyticalFaceId}`);
                    } else {
                        console.warn(`[dodec-geometry] No mapping found for geometry face ${faceIndex + 1}, using default Face ${faceIndex + 1}`);
                        mesh.userData.faceId = faceIndex + 1;
                    }
                });
                console.log('[dodec-geometry] Face IDs updated with topology mapping');
            } else {
                console.warn('[dodec-geometry] Face mapping failed, using default Face IDs (1-12)');
            }
        } else {
            console.log('[dodec-geometry] buildFaceIndexMapping not available, using default face IDs');
        }

        // ========================================
        // CREATE EDGES
        // ========================================

        createInteractiveEdges(baseGeometry, dodecahedron, S.faceMeshes);

        console.log(`[dodec-geometry] Created dodecahedron with ${materials.length} materials and ${S.faceMeshes.length} clickable faces`);
    }

    // ========================================
    // EXPORTS
    // ========================================

    global.createDodecahedron = createDodecahedron;
    global.createInteractiveEdges = createInteractiveEdges;

    console.log('[dodec-geometry] Module loaded - Geometry creation ready');

})(typeof window !== 'undefined' ? window : this);
