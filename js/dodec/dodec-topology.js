/**
 * ========================================
 * MODULE: dodec-topology.js
 * ========================================
 *
 * Extracted from: dodecahedron-viz.js
 * Original lines: 18-236
 * Date: December 15, 2025
 *
 * PURPOSE:
 * Provides topology and geometry helper functions for the dodecahedron.
 * Maps between Three.js geometric indices and analytical face/vertex IDs.
 *
 * DEPENDENCIES:
 * - THREE.js (for Vector3)
 * - js/constants/phi-harmonics.js (for PHI in fallback vertices)
 *
 * EXPORTS (to window/global):
 * - getGeometricVertexIndex(id): Maps analytical vertex ID to geometric index
 * - buildVertexToFacesMap(): Creates Map of vertex → connected faces
 * - findSharedEdgeVertices(face1Id, face2Id): Finds vertices shared by two faces
 * - getDodecahedronVertices(): Gets 20 vertex positions (cached)
 * - buildFaceIndexMapping(): Maps Three.js faces to analytical Face IDs
 *
 * NOTES FOR FUTURE CLAUDE:
 * ========================================
 * These functions were originally OUTSIDE the initDodecahedron() closure
 * in the source file (lines 18-236), already exported to window.*.
 *
 * TOPOLOGY REFERENCE:
 * - Dodecahedron has 12 pentagonal faces
 * - Each face has 5 vertices
 * - Total: 20 unique vertices
 * - Each vertex is shared by exactly 3 faces
 * - Total: 30 edges
 *
 * The vertex definitions array (lines 25-36) encodes which 3 faces
 * each of the 20 vertices belongs to. This is the topological truth
 * that enables edge-to-face mapping.
 *
 * CACHING:
 * getDodecahedronVertices() caches results to window.cachedGeometricVertices
 * to avoid repeated geometry extraction.
 *
 * FALLBACK:
 * If mainDodecahedron isn't available yet, getDodecahedronVertices()
 * uses theoretical PHI-based positions (adequate for topology).
 *
 * ========================================
 */
(function(global) {
    'use strict';

    // ========================================
    // IMPORTS
    // ========================================

    // PHI constants for fallback vertex positions
    const _PH = global.PhiHarmonics || {};
    const PHI = _PH.PHI || (1 + Math.sqrt(5)) / 2;

    // ========================================
    // SECTION: Vertex Index Mapping
    // ========================================
    //
    // Maps between analytical vertex IDs (1-20) and
    // geometric array indices (0-19) used by Three.js.
    //
    // ========================================

    /**
     * Convert analytical vertex ID to geometric array index
     *
     * Analytical IDs are 1-based (human-friendly)
     * Geometric indices are 0-based (array-friendly)
     *
     * @param {number} id - Analytical vertex ID (1-20)
     * @returns {number} Geometric index (0-19)
     */
    function getGeometricVertexIndex(id) {
        return id - 1;
    }

    // ========================================
    // SECTION: Vertex-to-Faces Topology
    // ========================================
    //
    // Each of the 20 vertices belongs to exactly 3 faces.
    // This map enables finding shared edges between faces.
    //
    // ========================================

    /**
     * Build a map from vertex indices to their connected faces
     *
     * Uses the canonical dodecahedron topology where each vertex
     * is shared by exactly 3 faces.
     *
     * @returns {Map<number, Set<number>>} Map of vertexIndex → Set of faceIds
     */
    function buildVertexToFacesMap() {
        // Vertex definitions: which 3 faces each vertex belongs to
        // Format: { id: analytical vertex ID (1-20), faces: [faceId, faceId, faceId] }
        const definitions = [
            { id: 1, faces: [1, 2, 6] }, { id: 2, faces: [1, 5, 6] },
            { id: 3, faces: [1, 5, 8] }, { id: 4, faces: [1, 8, 9] },
            { id: 5, faces: [1, 2, 9] }, { id: 6, faces: [2, 3, 6] },
            { id: 7, faces: [2, 3, 10] }, { id: 8, faces: [2, 9, 10] },
            { id: 9, faces: [3, 4, 6] }, { id: 10, faces: [3, 4, 11] },
            { id: 11, faces: [3, 10, 11] }, { id: 12, faces: [4, 5, 6] },
            { id: 13, faces: [4, 5, 7] }, { id: 14, faces: [4, 7, 11] },
            { id: 15, faces: [5, 7, 8] }, { id: 16, faces: [5, 8, 10] },
            { id: 17, faces: [7, 8, 12] }, { id: 18, faces: [8, 9, 12] },
            { id: 19, faces: [9, 10, 12] }, { id: 20, faces: [10, 11, 12] }
        ];

        const map = new Map();
        definitions.forEach(def => {
            // Map geometric index (id-1) to Set of analytical face IDs
            map.set(def.id - 1, new Set(def.faces));
        });

        return map;
    }

    // ========================================
    // SECTION: Edge Detection
    // ========================================
    //
    // Two faces share an edge if they have exactly 2 vertices in common.
    //
    // ========================================

    /**
     * Find the vertices shared between two faces (the edge vertices)
     *
     * In a dodecahedron, adjacent faces share exactly 2 vertices,
     * which define the edge between them.
     *
     * @param {number} face1Id - First face ID (1-12)
     * @param {number} face2Id - Second face ID (1-12)
     * @returns {THREE.Vector3[]|null} Array of 2 shared vertex positions, or null
     */
    function findSharedEdgeVertices(face1Id, face2Id) {
        const vertexToFacesMap = buildVertexToFacesMap();
        const vertices = getDodecahedronVertices();
        const sharedVertices = [];

        if (!vertexToFacesMap || !vertices) {
            console.warn('[dodec-topology] findSharedEdgeVertices: Missing map or vertices');
            return null;
        }

        // Iterate through all vertices to find ones shared by both faces
        vertexToFacesMap.forEach((faces, vertexIndex) => {
            if (faces.has(face1Id) && faces.has(face2Id)) {
                if (vertices[vertexIndex]) {
                    sharedVertices.push(vertices[vertexIndex]);
                }
            }
        });

        return sharedVertices;
    }

    // ========================================
    // SECTION: Vertex Position Extraction
    // ========================================
    //
    // Gets the 20 vertex positions from the Three.js geometry,
    // with fallback to theoretical PHI-based positions.
    //
    // ========================================

    /**
     * Get the 20 unique vertex positions of the dodecahedron
     *
     * Extracts from mainDodecahedron geometry if available,
     * otherwise uses theoretical PHI-based positions.
     *
     * Results are cached to window.cachedGeometricVertices.
     *
     * @returns {THREE.Vector3[]} Array of 20 vertex positions
     */
    function getDodecahedronVertices() {
        // Check for cached vertices
        if (global.cachedGeometricVertices) {
            return global.cachedGeometricVertices;
        }

        // Try to get the actual geometry from the rendered dodecahedron
        const dodecahedron = global.mainDodecahedron;

        if (dodecahedron && dodecahedron.geometry) {
            const positions = dodecahedron.geometry.attributes.position;
            const vertices = [];
            const uniqueVertices = new Map();

            // Extract unique vertices (Three.js may duplicate vertices for each face)
            for (let i = 0; i < positions.count; i++) {
                const x = positions.getX(i);
                const y = positions.getY(i);
                const z = positions.getZ(i);

                // Round to avoid floating point precision issues
                const key = `${x.toFixed(6)},${y.toFixed(6)},${z.toFixed(6)}`;

                if (!uniqueVertices.has(key)) {
                    uniqueVertices.set(key, new THREE.Vector3(x, y, z));
                }
            }

            // Convert map to array
            uniqueVertices.forEach(vertex => vertices.push(vertex));

            console.log(`[dodec-topology] Extracted ${vertices.length} unique vertices from Three.js geometry`);

            // Cache for future calls
            global.cachedGeometricVertices = vertices;
            return vertices;
        }

        // Fallback to theoretical positions if geometry not available
        console.warn('[dodec-topology] Using fallback theoretical vertex positions');
        const radius = 2;

        const fallbackVertices = [
            new THREE.Vector3(1, 1, 1).normalize().multiplyScalar(radius),
            new THREE.Vector3(1, 1, -1).normalize().multiplyScalar(radius),
            new THREE.Vector3(1, -1, 1).normalize().multiplyScalar(radius),
            new THREE.Vector3(1, -1, -1).normalize().multiplyScalar(radius),
            new THREE.Vector3(-1, 1, 1).normalize().multiplyScalar(radius),
            new THREE.Vector3(-1, 1, -1).normalize().multiplyScalar(radius),
            new THREE.Vector3(-1, -1, 1).normalize().multiplyScalar(radius),
            new THREE.Vector3(-1, -1, -1).normalize().multiplyScalar(radius),
            new THREE.Vector3(0, PHI, 1 / PHI).normalize().multiplyScalar(radius),
            new THREE.Vector3(0, PHI, -1 / PHI).normalize().multiplyScalar(radius),
            new THREE.Vector3(0, -PHI, 1 / PHI).normalize().multiplyScalar(radius),
            new THREE.Vector3(0, -PHI, -1 / PHI).normalize().multiplyScalar(radius),
            new THREE.Vector3(1 / PHI, 0, PHI).normalize().multiplyScalar(radius),
            new THREE.Vector3(1 / PHI, 0, -PHI).normalize().multiplyScalar(radius),
            new THREE.Vector3(-1 / PHI, 0, PHI).normalize().multiplyScalar(radius),
            new THREE.Vector3(-1 / PHI, 0, -PHI).normalize().multiplyScalar(radius),
            new THREE.Vector3(PHI, 1 / PHI, 0).normalize().multiplyScalar(radius),
            new THREE.Vector3(PHI, -1 / PHI, 0).normalize().multiplyScalar(radius),
            new THREE.Vector3(-PHI, 1 / PHI, 0).normalize().multiplyScalar(radius),
            new THREE.Vector3(-PHI, -1 / PHI, 0).normalize().multiplyScalar(radius)
        ];

        global.cachedGeometricVertices = fallbackVertices;
        return fallbackVertices;
    }

    // ========================================
    // SECTION: Face Index Mapping
    // ========================================
    //
    // Maps Three.js face indices (0-11) to analytical Face IDs (1-12).
    // Essential for connecting geometry clicks to business logic.
    //
    // ========================================

    /**
     * Build a topology-aware mapping from Three.js face indices to analytical Face IDs
     *
     * Three.js orders faces differently than our analytical model.
     * This function determines the mapping by matching vertex positions.
     *
     * @returns {number[]|null} Array where index = Three.js face index (0-11),
     *                          value = analytical Face ID (1-12), or null on error
     */
    function buildFaceIndexMapping() {
        console.log('\n[dodec-topology] BUILDING TOPOLOGY-AWARE FACE MAPPING:');
        console.log('='.repeat(60));

        // Get the actual dodecahedron geometry
        // Note: global.mainDodecahedron needs to be set by dodec-geometry.js
        const dodecahedron = global.mainDodecahedron;
        if (!dodecahedron || !dodecahedron.geometry) {
            console.error('[dodec-topology] Cannot build face mapping - dodecahedron not available');
            return null;
        }

        const geometry = dodecahedron.geometry;
        const position = geometry.attributes.position;

        const geometricVertices = getDodecahedronVertices();
        const vertexToFacesMap = buildVertexToFacesMap();

        if (!vertexToFacesMap) {
            console.error('[dodec-topology] Cannot build face mapping - vertex topology not available');
            return null;
        }

        const mapping = [];

        // For each of the 12 faces in Three.js geometry
        for (let faceIdx = 0; faceIdx < 12; faceIdx++) {
            // Each face is 3 triangles = 9 vertices
            const start = faceIdx * 9;
            const faceVertexIndices = new Set();

            // Extract unique geometric vertex indices for this face
            if (geometry.index) {
                // Indexed geometry
                for (let i = 0; i < 9; i++) {
                    const idx = geometry.index.getX(start + i);
                    faceVertexIndices.add(idx);
                }
            } else {
                // Non-indexed - match by position
                for (let i = 0; i < 9; i++) {
                    const vx = position.getX(start + i);
                    const vy = position.getY(start + i);
                    const vz = position.getZ(start + i);

                    // Find matching geometric vertex
                    for (let geoIdx = 0; geoIdx < geometricVertices.length; geoIdx++) {
                        const geoV = geometricVertices[geoIdx];
                        const dist = Math.sqrt(
                            Math.pow(vx - geoV.x, 2) +
                            Math.pow(vy - geoV.y, 2) +
                            Math.pow(vz - geoV.z, 2)
                        );
                        if (dist < 0.01) {
                            faceVertexIndices.add(geoIdx);
                            break;
                        }
                    }
                }
            }

            // Now we have the geometric vertex indices for this face
            // Find which analytical face ID appears in ALL vertices' connected faces
            const vertexFaceSets = Array.from(faceVertexIndices).map(geoIdx =>
                vertexToFacesMap.get(geoIdx) || new Set()
            );

            // Find the common face ID across all vertices
            let commonFaceId = null;
            if (vertexFaceSets.length > 0) {
                const firstSet = vertexFaceSets[0];
                for (const faceId of firstSet) {
                    if (vertexFaceSets.every(set => set.has(faceId))) {
                        commonFaceId = faceId;
                        break;
                    }
                }
            }

            mapping[faceIdx] = commonFaceId;
            console.log(`Geometry Face ${faceIdx + 1} (${faceVertexIndices.size} vertices) → Analytical Face ${commonFaceId}`);
        }

        console.log('='.repeat(60));
        console.log(`[dodec-topology] Built face mapping for all 12 faces\n`);

        return mapping;
    }

    // ========================================
    // EXPORTS
    // ========================================

    // Export to window (maintaining original API)
    global.getGeometricVertexIndex = getGeometricVertexIndex;
    global.buildVertexToFacesMap = buildVertexToFacesMap;
    global.findSharedEdgeVertices = findSharedEdgeVertices;
    global.getDodecahedronVertices = getDodecahedronVertices;
    global.buildFaceIndexMapping = buildFaceIndexMapping;

    console.log('[dodec-topology] Module loaded - Topology helpers ready');

})(typeof window !== 'undefined' ? window : this);
