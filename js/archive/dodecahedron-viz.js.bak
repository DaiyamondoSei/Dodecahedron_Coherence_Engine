/**
 * 🔷 Dodecahedron 3D Visualization Engine
 *
 * Interactive 3D visualization that maps organizational data onto dodecahedral geometry.
 * Features:
 * - 12 faces colored by face energy (organizational domains)
 * - 30 edges colored by relationship tension
 * - Clickable faces with detailed KPI panels
 * - Real-time company data integration
 * - Pentagram analysis integration
 *
 * Note: Requires THREE.js and OrbitControls to be loaded as global scripts
 */
// ========================================
// HELPER FUNCTIONS (Topology & Geometry)
// ========================================

// Helper to map analytical vertex ID to geometric index
window.getGeometricVertexIndex = function (id) {
    return id - 1;
};

// Helper to build vertex-to-faces map (Analytical)
window.buildVertexToFacesMap = function () {
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
};

// Helper to find shared vertices between two faces
window.findSharedEdgeVertices = function (face1Id, face2Id) {
    const vertexToFacesMap = window.buildVertexToFacesMap();
    const vertices = window.getDodecahedronVertices();
    const sharedVertices = [];

    if (!vertexToFacesMap || !vertices) {
        console.warn('❌ findSharedEdgeVertices: Missing map or vertices');
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
};

// Get actual vertex positions and build face topology from Three.js dodecahedron
window.getDodecahedronVertices = function () {
    // Check for cached vertices
    if (window.cachedGeometricVertices) {
        return window.cachedGeometricVertices;
    }

    // Try to get the actual geometry from the rendered dodecahedron
    const dodecahedron = window.mainDodecahedron;

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

        console.log(`✅ Extracted ${vertices.length} unique vertices from Three.js geometry`);

        // Cache for future calls
        window.cachedGeometricVertices = vertices;
        return vertices;
    }

    // Fallback to theoretical positions if geometry not available
    console.warn('⚠️ Using fallback theoretical vertex positions');
    const _PH = (typeof window !== 'undefined' && window.PhiHarmonics) || {};
    const phi = _PH.PHI || (1 + Math.sqrt(5)) / 2;
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
        new THREE.Vector3(0, phi, 1 / phi).normalize().multiplyScalar(radius),
        new THREE.Vector3(0, phi, -1 / phi).normalize().multiplyScalar(radius),
        new THREE.Vector3(0, -phi, 1 / phi).normalize().multiplyScalar(radius),
        new THREE.Vector3(0, -phi, -1 / phi).normalize().multiplyScalar(radius),
        new THREE.Vector3(1 / phi, 0, phi).normalize().multiplyScalar(radius),
        new THREE.Vector3(1 / phi, 0, -phi).normalize().multiplyScalar(radius),
        new THREE.Vector3(-1 / phi, 0, phi).normalize().multiplyScalar(radius),
        new THREE.Vector3(-1 / phi, 0, -phi).normalize().multiplyScalar(radius),
        new THREE.Vector3(phi, 1 / phi, 0).normalize().multiplyScalar(radius),
        new THREE.Vector3(phi, -1 / phi, 0).normalize().multiplyScalar(radius),
        new THREE.Vector3(-phi, 1 / phi, 0).normalize().multiplyScalar(radius),
        new THREE.Vector3(-phi, -1 / phi, 0).normalize().multiplyScalar(radius)
    ];

    window.cachedGeometricVertices = fallbackVertices;
    return fallbackVertices;
};

/**
 * Build a topology-aware mapping from Three.js face indices to analytical Face IDs
 * Returns an array where index = Three.js face index (0-11), value = analytical Face ID (1-12)
 */
window.buildFaceIndexMapping = function () {
    console.log('\n🔄 BUILDING TOPOLOGY-AWARE FACE MAPPING:');
    console.log('='.repeat(60));

    // Get the actual dodecahedron geometry
    // Note: window.mainDodecahedron needs to be set by initDodecahedron
    const dodecahedron = window.mainDodecahedron;
    if (!dodecahedron || !dodecahedron.geometry) {
        console.error('❌ Cannot build face mapping - dodecahedron not available');
        return null;
    }

    const geometry = dodecahedron.geometry;
    const position = geometry.attributes.position;

    if (!window.getDodecahedronVertices) {
        console.error('❌ getDodecahedronVertices not available');
        return null;
    }

    const geometricVertices = window.getDodecahedronVertices();
    const vertexToFacesMap = window.buildVertexToFacesMap();

    if (!vertexToFacesMap) {
        console.error('❌ Cannot build face mapping - vertex topology not available');
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
    console.log(`✅ Built face mapping for all 12 faces\n`);

    return mapping;
};

// Wait for DOM and THREE.js to be ready
document.addEventListener('DOMContentLoaded', () => {
    initDodecahedron();
});

function initDodecahedron() {
    // Check if THREE is available
    if (typeof THREE === 'undefined') {
        console.error('❌ THREE.js not loaded');
        document.getElementById('loading').innerHTML = '<div class="loading-text">⚠️ THREE.js failed to load</div>';
        return;
    }

    // Check if running in iframe
    const isInIframe = window.self !== window.top;
    if (isInIframe) {
        const header = document.getElementById('pageHeader');
        if (header) header.classList.add('hidden');
    }

    // Scene, Camera, Renderer
    const canvas = document.getElementById('scene');
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // Pure black to match DNA helix
    scene.fog = new THREE.Fog(0x000000, 15, 50); // Atmospheric depth

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(4, 4, 4);

    // Expose to window for external access (VisualizationManager)
    window.scene = scene;
    window.camera = camera;
    window.renderer = renderer;

    // ========================================
    // MOUSE TRACKING - Simplified approach
    // ========================================
    // Note: OrbitControls prevents us from tracking mousedown events on the canvas,
    // so we use OrbitControls events + continuous mouse tracking for drag detection.
    let isUserInteracting = false;
    let interactionTimeout = null;
    let mouseStartPosition = { x: 0, y: 0 };
    let currentMousePosition = { x: 0, y: 0 };
    let isDraggingWithOrbit = false;
    const DRAG_THRESHOLD = 5; // pixels - stricter than browser default

    // Track mouse position continuously
    document.addEventListener('mousemove', (event) => {
        currentMousePosition.x = event.clientX;
        currentMousePosition.y = event.clientY;
    }, true);

    // Orbit Controls - Optimized for natural soccer ball-like rotation
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05; // Reduced for more responsive feel
    controls.rotateSpeed = 1.2; // Increased for easier rotation
    controls.minDistance = 2;
    controls.maxDistance = 15;
    controls.enablePan = false;
    controls.autoRotateSpeed = 1.0; // Smooth auto-rotation speed
    controls.zoomSpeed = 1.2; // Comfortable zoom speed

    // Track OrbitControls interactions for auto-rotation pause and drag detection
    controls.addEventListener('start', () => {
        isUserInteracting = true;
        isDraggingWithOrbit = true;

        // Capture the starting mouse position when user starts dragging
        mouseStartPosition.x = currentMousePosition.x;
        mouseStartPosition.y = currentMousePosition.y;

        console.log(`🎮 OrbitControls drag start at (${mouseStartPosition.x}, ${mouseStartPosition.y})`);

        if (interactionTimeout) clearTimeout(interactionTimeout);
    });

    controls.addEventListener('end', () => {
        isUserInteracting = false;

        // Calculate total drag distance
        const deltaX = Math.abs(currentMousePosition.x - mouseStartPosition.x);
        const deltaY = Math.abs(currentMousePosition.y - mouseStartPosition.y);
        const totalMovement = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        console.log(`🎮 OrbitControls drag end - Total movement: ${totalMovement.toFixed(1)}px`);

        // Keep dragging flag for a brief moment to prevent click firing
        setTimeout(() => {
            isDraggingWithOrbit = false;
        }, 50);

        if (interactionTimeout) clearTimeout(interactionTimeout);
        interactionTimeout = setTimeout(() => {
            isUserInteracting = false;
        }, 2000);
    });

    // ========================================
    // ENHANCED 5-LIGHT SYSTEM
    // Integrated from Dodecahedron Code
    // Total intensity balanced at ~2.0x
    // ========================================

    // Ambient: Soft base illumination (reduced from 0.5 to 0.4)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Primary key light: Main white (reduced from 0.8 to 0.6)
    const pointLight1 = new THREE.PointLight(0xffffff, 0.6);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    // Fill light: Cyan accent (kept at 0.3)
    const pointLight2 = new THREE.PointLight(0x00ffcc, 0.3);
    pointLight2.position.set(-5, -5, -5);
    scene.add(pointLight2);

    // NEW: Magenta accent light - adds depth and mystical quality
    const pointLight3 = new THREE.PointLight(0xff00ff, 0.25);
    pointLight3.position.set(-5, 3, 3);
    scene.add(pointLight3);

    // NEW: Yellow warm accent - creates golden highlights
    const pointLight4 = new THREE.PointLight(0xffff00, 0.2);
    pointLight4.position.set(3, -5, -3);
    scene.add(pointLight4);

    // NEW: Top white rim light - creates halo effect
    const topLight = new THREE.PointLight(0xffffff, 0.25);
    topLight.position.set(0, 8, 0);
    scene.add(topLight);

    // Golden ratio constant for phi-tuned animations
    // Single source: js/constants/phi-harmonics.js
    const _PHI_SRC = (typeof window !== 'undefined' && window.PhiHarmonics) || {};
    const PHI = _PHI_SRC.PHI || 1.618033988749895;

    // ========================================
    // DATA MANAGEMENT
    // ========================================

    let currentCompany = 'quannex';
    let companyData = null;
    let faceMeshes = [];
    let edgeLines = [];
    let autoRotate = false; // Start with manual control
    let animationsPaused = false; // Sprint 3.5: Global animation pause
    // Note: isUserInteracting and interactionTimeout are declared earlier before OrbitControls initialization

    // ========================================
    // OCTAVE LAYER SYSTEM - Phase 3 Enhancement
    // 7 transparent shells representing developmental octaves
    // ========================================
    let showOctaveLayers = false;
    let octaveLayerGroup = null;
    const OCTAVE_COLORS = [
        0xff3333,  // O1 - Survival (Red)
        0xff9933,  // O2 - Security (Orange)
        0xffff33,  // O3 - Power (Yellow)
        0x33ff33,  // O4 - Connection (Green)
        0x33ffff,  // O5 - Expression (Cyan)
        0x3333ff,  // O6 - Vision (Indigo)
        0xff33ff   // O7 - Transcendence (Violet)
    ];

    // Load Quannex engine (expects it to be globally available from main.js)
    const loadQuannexEngine = async () => {
        try {
            // Wait for Quannex (capital Q - the correct API) or quannexEngine (legacy)
            let attempts = 0;
            while ((!window.Quannex && !window.quannexEngine) && attempts < 50) {
                await new Promise(resolve => setTimeout(resolve, 100));
                attempts++;
            }

            // Use Quannex if available (new API), fallback to quannexEngine (legacy)
            const engine = window.Quannex || window.quannexEngine;

            if (!engine) {
                throw new Error('Quannex engine not available after timeout');
            }

            // Store reference to whichever engine is available
            window.quannexEngine = engine;

            // If CompanyLoader available, load company from sessionStorage or default
            if (window.CompanyLoader) {
                const selectedCompanyId = sessionStorage.getItem('selectedCompanyId') || 'quannex';
                console.log(`🔄 Loading company from session: ${selectedCompanyId}`);
                await window.CompanyLoader.loadCompany(selectedCompanyId);
            }

            companyData = engine.getState();
            console.log('✅ Quannex Engine loaded:', companyData);
            return true;
        } catch (error) {
            console.error('❌ Error loading Quannex engine:', error);
            return false;
        }
    };

    // Switch company
    const switchCompany = async (companyId) => {
        try {
            if (!window.CompanyLoader) {
                throw new Error('Company loader not available');
            }

            console.log(`🔄 Switching to company: ${companyId}`);

            // Update current company tracking for octave layers
            currentCompany = companyId;

            await window.CompanyLoader.switchCompany(companyId);

            // Get fresh state from whichever engine is available
            const engine = window.Quannex || window.quannexEngine;
            if (engine) {
                companyData = engine.getState();
            }

            updateVisualization();
            updateStats();

            // Update octave layers if visible (Phase 3)
            if (window.updateOctaveLayers) {
                window.updateOctaveLayers();
            }

            console.log(`✅ Switched to ${companyId} - ${companyData?.faces?.length || 0} faces loaded`);
        } catch (error) {
            console.error(`❌ Error switching to ${companyId}:`, error);
        }
    };

    // ========================================
    // GEOMETRY CREATION
    // ========================================

    // Sprint 3 Task 28: Element colors for edge tooltips
    const ELEMENT_COLORS = {
        'Earth': '#8B4513',
        'Water': '#4169E1',
        'Fire': '#FF4500',
        'Air': '#87CEEB',
        'Ether': '#9370DB'
    };

    /**
     * Sprint 3 Task 28: Create interactive edges with userData for hover detection
     * Each edge gets face pair info, name, question, and elemental nature from mapping context
     */
    const createInteractiveEdges = (baseGeometry, parentMesh, faceMeshesArray) => {
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
            console.warn('[3D View] Could not load edge data from sessionStorage:', e);
        }

        // Also check for loaded company context
        if (Object.keys(edgeDataMap).length === 0 && window.CompanyTemplatesBundle?.templates) {
            const selectedCompanyId = sessionStorage.getItem('selectedCompanyId');
            if (selectedCompanyId && window.CompanyTemplatesBundle.templates[selectedCompanyId]?.edges) {
                const edges = window.CompanyTemplatesBundle.templates[selectedCompanyId].edges;
                edges.forEach(edge => {
                    const key = edge.faceIds.slice().sort().join('-');
                    edgeDataMap[key] = edge;
                });
            }
        }

        // ============================================================
        // TUBE GEOMETRY EDGES - Enhanced 3D visual for thesis defense
        // Uses TubeGeometry instead of Line for richer 3D appearance
        // ============================================================

        // Configuration for tube edges
        const TUBE_RADIUS = 0.015; // Radius of the tube
        const TUBE_SEGMENTS = 8; // Smoothness of tube cross-section
        const TUBE_RADIAL = 6; // Radial segments (roundness)

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
        console.log(`[3D View] Creating ${edgeCount} TubeGeometry edges`);

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
                healthStatus: mappedEdgeData.tension < 0.1 ? 'Healthy' : mappedEdgeData.tension < 0.2 ? 'Moderate' : 'Tense',
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

            // Apply the element color to the material (Sacred Tech: let essence match form)
            const edgeColor = new THREE.Color(tubeMesh.userData.edgeData.color);
            edgeTubeMaterial.color.copy(edgeColor);
            edgeTubeMaterial.emissive.copy(edgeColor).multiplyScalar(0.2);

            // Add to parent mesh so it rotates together
            parentMesh.add(tubeMesh);
            edgeLines.push(tubeMesh);
        }

        console.log(`[3D View] ✅ Created ${edgeLines.length} TubeGeometry edges with ${Object.keys(edgeDataMap).length} mapped data entries`);
    };

    // Create dodecahedron with 12 separate face meshes
    const createDodecahedron = () => {
        // Clear existing geometry
        faceMeshes.forEach(mesh => scene.remove(mesh));
        edgeLines.forEach(line => scene.remove(line));
        faceMeshes = [];
        edgeLines = [];

        const radius = 2;

        // Use a single dodecahedron but assign material index per face
        const baseGeometry = new THREE.DodecahedronGeometry(radius);
        const position = baseGeometry.attributes.position;
        const index = baseGeometry.index;

        // Create 12 materials (one per face)
        const materials = [];
        for (let i = 0; i < 12; i++) {
            materials.push(new THREE.MeshPhongMaterial({
                color: 0x00ffcc,
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
        scene.add(dodecahedron);

        // Store reference for raycasting - we'll detect which material was hit
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

            // Use same scale as visible mesh - precise clicking, may have tiny gaps at edges
            clickMesh.scale.set(1.0, 1.0, 1.0);

            clickMesh.userData.faceId = faceIndex + 1;
            clickMesh.userData.faceIndex = faceIndex;
            clickMesh.userData.materialIndex = faceIndex;
            clickMesh.userData.material = materials[faceIndex];

            // Add as child of main dodecahedron so they rotate together
            dodecahedron.add(clickMesh);
            faceMeshes.push(clickMesh);
        }

        // Store the main dodecahedron for updates
        window.mainDodecahedron = dodecahedron;
        window.dodecahedronMaterials = materials;

        // Update the faceMeshes reference in the export (since we reassigned the array)
        if (window.dodecahedronViz) {
            window.dodecahedronViz.faceMeshes = faceMeshes;
        }

        // Build topology-aware face mapping and update face IDs
        if (typeof window.buildFaceIndexMapping === 'function') {
            console.log('[3D View] 🔧 Building topology-aware face mapping...');
            const faceMapping = window.buildFaceIndexMapping();

            if (faceMapping) {
                // Update face IDs based on topology mapping
                faceMeshes.forEach((mesh, faceIndex) => {
                    const analyticalFaceId = faceMapping[faceIndex];
                    if (analyticalFaceId) {
                        mesh.userData.faceId = analyticalFaceId;
                        console.log(`[3D View] Geometry Face ${faceIndex + 1} → Analytical Face ${analyticalFaceId}`);
                    } else {
                        console.warn(`[3D View] No mapping found for geometry face ${faceIndex + 1}, using default Face ${faceIndex + 1}`);
                        mesh.userData.faceId = faceIndex + 1;
                    }
                });
                console.log('[3D View] ✅ Face IDs updated with topology mapping');
            } else {
                console.warn('[3D View] ⚠️ Face mapping failed, using default Face IDs (1-12)');
            }
        } else {
            console.log('[3D View] ℹ️ buildFaceIndexMapping not available, using default face IDs');
        }

        // Create edges - Sprint 3 Task 28: Interactive edges with userData
        createInteractiveEdges(baseGeometry, dodecahedron, faceMeshes);

        console.log(`✅ Created dodecahedron with ${materials.length} materials and ${faceMeshes.length} clickable faces`);
    };

    // ========================================
    // COLOR MAPPING
    // ========================================

    // Get color based on energy level (0-1)
    const getEnergyColor = (energy) => {
        // Ensure minimum energy for visibility (even 0% faces are visible)
        const minEnergy = 0.05; // Minimum 5% brightness
        const adjustedEnergy = Math.max(energy, minEnergy);

        if (energy >= 0.7) {
            // Healthy: Green gradient
            return new THREE.Color().lerpColors(
                new THREE.Color(0x00ff88),
                new THREE.Color(0x00ffcc),
                (energy - 0.7) / 0.3
            );
        } else if (energy >= 0.4) {
            // Warning: Yellow/Orange gradient
            return new THREE.Color().lerpColors(
                new THREE.Color(0xff6600),
                new THREE.Color(0xffcc00),
                (energy - 0.4) / 0.3
            );
        } else {
            // Critical: Bright red gradient with minimum brightness
            // Map 0-40% to a visible red range (never completely black)
            const minRed = 0x882222; // Minimum visible red (darker but still visible)
            const maxRed = 0xff6666; // Bright red

            return new THREE.Color().lerpColors(
                new THREE.Color(minRed),
                new THREE.Color(maxRed),
                adjustedEnergy / 0.4
            );
        }
    };

    // Update visualization with current company data
    const updateVisualization = () => {
        // 🔧 FIX: Get fresh state from engine instead of using cached data
        const engine = window.Quannex || window.quannexEngine;
        if (engine) {
            companyData = engine.getState();
            console.log('🔄 Refreshed company data from engine:', companyData?.faces?.length || 0, 'faces');
        }

        if (!companyData || !companyData.faces) {
            console.warn('⚠️ No company data available');
            return;
        }

        // Get the materials array
        const materials = window.dodecahedronMaterials;
        if (!materials) {
            console.warn('⚠️ Materials not available yet');
            return;
        }

        // Update each material's color based on face energy
        companyData.faces.forEach((face, index) => {
            if (index < materials.length) {
                const energy = face.faceEnergy || 0;
                const color = getEnergyColor(energy);

                // Update material properties
                materials[index].color = color;

                // Add emissive glow - stronger for critical faces
                let emissiveIntensity;
                if (energy < 0.1) {
                    emissiveIntensity = 0.6; // Very low energy = strong glow (visible warning)
                } else if (energy < 0.4) {
                    emissiveIntensity = 0.5; // Critical = strong glow
                } else {
                    emissiveIntensity = 0.3; // Healthy = moderate glow
                }

                materials[index].emissive = color.clone().multiplyScalar(0.3);
                materials[index].emissiveIntensity = emissiveIntensity;

                // Store face data in the clickable mesh
                if (faceMeshes[index]) {
                    faceMeshes[index].userData.faceData = face;
                    console.log(`   ✅ Face ${index + 1} data stored:`, face.name, `(${face.elementalKPIs?.length || 0} KPIs)`);
                }
            }
        });

        // Force material updates
        materials.forEach(mat => mat.needsUpdate = true);

        console.log('✅ Visualization updated with', companyData.faces.length, 'face colors');
    };

    // ========================================
    // EDGE DATA UPDATE (Sprint 3 Fix)
    // ========================================

    /**
     * Update edge userData with data from sessionStorage or CompanyTemplatesBundle.
     * This is called by refreshVisualization() to ensure edge tooltips have
     * the latest data (questions, elemental nature, etc.) after sessionStorage is populated.
     */
    const updateEdgeData = () => {
        if (!edgeLines || edgeLines.length === 0) {
            console.log('[3D View] ℹ️ No edge lines to update');
            return;
        }

        // Try to load edge data from sessionStorage
        let edgeDataMap = {};
        try {
            const customDataJson = sessionStorage.getItem('customCompanyData');
            if (customDataJson) {
                const customData = JSON.parse(customDataJson);
                if (customData.edges && customData.edges.length > 0) {
                    customData.edges.forEach(edge => {
                        const key = edge.faceIds.slice().sort().join('-');
                        edgeDataMap[key] = edge;
                    });
                    console.log(`[3D View] 📊 Loaded ${customData.edges.length} edges from sessionStorage`);
                }
            }
        } catch (e) {
            console.warn('[3D View] Could not load edge data from sessionStorage:', e);
        }

        // Fallback to CompanyTemplatesBundle
        if (Object.keys(edgeDataMap).length === 0 && window.CompanyTemplatesBundle?.templates) {
            const selectedCompanyId = sessionStorage.getItem('selectedCompanyId');
            if (selectedCompanyId && window.CompanyTemplatesBundle.templates[selectedCompanyId]?.edges) {
                const edges = window.CompanyTemplatesBundle.templates[selectedCompanyId].edges;
                edges.forEach(edge => {
                    const key = edge.faceIds.slice().sort().join('-');
                    edgeDataMap[key] = edge;
                });
                console.log(`[3D View] 📊 Loaded ${edges.length} edges from CompanyTemplatesBundle`);
            }
        }

        if (Object.keys(edgeDataMap).length === 0) {
            console.log('[3D View] ℹ️ No edge data available to update');
            return;
        }

        // Update each edge line's userData
        let updatedCount = 0;
        edgeLines.forEach(line => {
            if (!line.userData) return;

            // Get the face pair from existing userData
            const currentFaceIds = line.userData.edgeData?.faceIds || [];
            if (currentFaceIds.length < 2) return;

            const faceKey = currentFaceIds.slice().sort().join('-');
            const mappedEdgeData = edgeDataMap[faceKey];

            if (mappedEdgeData) {
                // Update userData with fresh data
                line.userData.edgeData = {
                    faceIds: mappedEdgeData.faceIds,
                    tension: mappedEdgeData.tension || 0,
                    healthStatus: mappedEdgeData.tension < 0.1 ? 'Healthy' : mappedEdgeData.tension < 0.2 ? 'Moderate' : 'Tense',
                    element: mappedEdgeData.elementalNature || 'Unknown',
                    color: ELEMENT_COLORS[mappedEdgeData.elementalNature] || '#00ffcc',
                    theQuestion: mappedEdgeData.theQuestion || null
                };
                line.userData.edgeName = mappedEdgeData.emergentName || line.userData.edgeName;
                updatedCount++;
            }
        });

        console.log(`[3D View] ✅ Updated ${updatedCount}/${edgeLines.length} edges with mapped data`);
    };

    // ========================================
    // PHILOSOPHICAL VISUAL FEEDBACK
    // ========================================
    window.updateVisualFeedback = function (params) {
        // params: { ALPHA, BETA, GAMMA, DELTA, KAPPA }

        // 1. GAMMA (Balance): Relational vs Internal
        // Low Gamma = Relational = Stronger Edges (Pillars)
        // High Gamma = Internal = Weaker Edges
        if (params.GAMMA !== undefined) {
            const edgeOpacity = 0.8 - (params.GAMMA * 0.6); // 0.0 -> 0.8, 1.0 -> 0.2
            if (window.edgeLines) {
                window.edgeLines.forEach(edges => {
                    if (edges.material) {
                        edges.material.opacity = edgeOpacity;
                        edges.material.needsUpdate = true;
                    }
                });
            }
        }

        // 2. DELTA (Shadow): Non-Duality vs Local Reality
        // Low Delta = Non-Duality = See the Shadow (Transparency)
        // High Delta = Local Reality = Solid Faces
        if (params.DELTA !== undefined) {
            const isNonDual = params.DELTA < 0.5;
            const opacity = isNonDual ? 0.6 : 1.0;
            const transparent = isNonDual;

            if (window.dodecahedronMaterials) {
                window.dodecahedronMaterials.forEach(mat => {
                    mat.transparent = transparent;
                    mat.opacity = opacity;
                    // If non-dual, we want to see the inside/back faces clearly
                    mat.side = THREE.DoubleSide;
                    mat.needsUpdate = true;
                });
            }
        }
    };

    // ========================================
    // SHADOW FACE HIGHLIGHTING
    // Visual indicator for shadow-affected faces
    // ========================================

    /**
     * Highlight faces affected by shadow patterns
     * Uses PHI-derived intensity values for severity levels
     * @param {Array<number>} faceIds - Array of face IDs (1-indexed) to highlight
     * @param {string} severity - 'critical' | 'high' | 'moderate'
     */
    const highlightShadowFaces = (faceIds, severity = 'moderate') => {
        if (!window.dodecahedronMaterials || !Array.isArray(faceIds)) return;

        // ========================================
        // PHI-derived intensity values
        // Single source: js/constants/phi-harmonics.js
        // ========================================
        const _PH = window.PhiHarmonics || {};
        const PHI_1 = _PH.PHI_1 || 0.618033988749895;  // φ^-1
        const PHI_2 = _PH.PHI_2 || 0.381966011250105;  // φ^-2

        const intensityMap = {
            critical: 1.0,
            high: PHI_1,    // φ^-1 ≈ 0.618
            moderate: PHI_2 // φ^-2 ≈ 0.382
        };

        const intensity = intensityMap[severity] || intensityMap.moderate;

        // Shadow highlight color (red spectrum for warnings)
        const shadowColor = new THREE.Color(0xff4444);

        faceIds.forEach(faceId => {
            // Find face mesh by faceId (faceId is 1-indexed)
            const meshIndex = faceMeshes.findIndex(m =>
                m.userData.faceId === faceId || m.userData.faceData?.id === faceId
            );

            if (meshIndex !== -1 && window.dodecahedronMaterials[meshIndex]) {
                const material = window.dodecahedronMaterials[meshIndex];

                // Store original emissive for restoration
                if (!material.userData) material.userData = {};
                if (!material.userData.originalEmissive) {
                    material.userData.originalEmissive = material.emissive.clone();
                    material.userData.originalEmissiveIntensity = material.emissiveIntensity || 0;
                }

                // Apply shadow highlight with lerp for smooth blending
                material.emissive.lerp(shadowColor, 0.4 * intensity);
                material.emissiveIntensity = Math.min(0.8, (material.userData.originalEmissiveIntensity || 0) + (0.4 * intensity));
                material.userData.hasShadowHighlight = true;
                material.needsUpdate = true;
            }
        });
    };

    /**
     * Clear shadow highlights from all faces
     * Restores original emissive properties
     */
    const clearShadowHighlights = () => {
        if (!window.dodecahedronMaterials) return;

        window.dodecahedronMaterials.forEach(material => {
            if (material.userData?.hasShadowHighlight) {
                if (material.userData.originalEmissive) {
                    material.emissive.copy(material.userData.originalEmissive);
                    material.emissiveIntensity = material.userData.originalEmissiveIntensity || 0;
                }
                material.userData.hasShadowHighlight = false;
                material.needsUpdate = true;
            }
        });
    };

    // ========================================
    // INTERACTION
    // ========================================

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let selectedFace = null;
    let hoveredFace = null;
    let isCameraAnimating = false;

    // ========================================
    // CAMERA ANIMATION
    // ========================================

    /**
     * Smooth camera animation to target position
     * Uses easeInOutCubic for natural motion
     */
    const animateCameraTo = (targetPosition, lookAtTarget, duration = 1200) => {
        const startPosition = camera.position.clone();
        const startTarget = controls.target.clone();
        const startTime = Date.now();

        isCameraAnimating = true;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Smooth easing (ease-in-out cubic)
            const eased = progress < 0.5
                ? 4 * progress * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            // Interpolate camera position and target
            camera.position.lerpVectors(startPosition, targetPosition, eased);
            controls.target.lerpVectors(startTarget, lookAtTarget, eased);
            controls.update();

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                isCameraAnimating = false;
            }
        };

        animate();
    };

    /**
     * Calculate optimal camera position for viewing a face
     * Zooms camera closer while maintaining rotation center at origin
     */
    const getCameraPositionForFace = (faceIndex) => {
        // Get face position from the clickable mesh
        const clickMesh = faceMeshes[faceIndex];
        if (!clickMesh) return null;

        // Calculate face center from geometry
        const geometry = clickMesh.geometry;
        const position = geometry.attributes.position;

        // Get average position of all vertices (face center)
        let centerX = 0, centerY = 0, centerZ = 0;
        const vertexCount = position.count;

        for (let i = 0; i < vertexCount; i++) {
            centerX += position.getX(i);
            centerY += position.getY(i);
            centerZ += position.getZ(i);
        }

        centerX /= vertexCount;
        centerY /= vertexCount;
        centerZ /= vertexCount;

        const faceCenter = new THREE.Vector3(centerX, centerY, centerZ);

        // Calculate direction from origin to face
        const direction = faceCenter.clone().normalize();

        // Position camera closer along this direction, but not too close
        const cameraDistance = 4.5; // Closer for better view
        const cameraPos = direction.clone().multiplyScalar(cameraDistance);

        // Keep rotation center at origin for consistent rotation feel
        return {
            position: cameraPos,
            lookAt: new THREE.Vector3(0, 0, 0) // Always rotate around center
        };
    };

    /**
     * Reset camera to default view
     */
    const resetCameraView = () => {
        const defaultPosition = new THREE.Vector3(4, 4, 4);
        const defaultTarget = new THREE.Vector3(0, 0, 0);
        animateCameraTo(defaultPosition, defaultTarget, 1000);
    };

    // Handle mouse move (hover effect + drag detection)
    const onMouseMove = (event) => {
        // Track dragging for click vs drag detection
        if (event.buttons === 1) { // Left mouse button is pressed
            const deltaX = Math.abs(event.clientX - mouseDownPosition.x);
            const deltaY = Math.abs(event.clientY - mouseDownPosition.y);

            if (deltaX > mouseMoveThreshold || deltaY > mouseMoveThreshold) {
                isDragging = true;
            }
        }

        const rect = canvas.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        // Try to raycast edges first (priority over faces)
        const edgeLines = window.edgeLines || [];
        const edgeIntersects = raycaster.intersectObjects(edgeLines);

        const faceIntersects = raycaster.intersectObjects(faceMeshes);

        const faceTooltip = document.getElementById('faceTooltip');
        const edgeTooltip = document.getElementById('edgeTooltip');
        const tooltipFaceName = document.getElementById('tooltipFaceName');
        const tooltipEnergyValue = document.getElementById('tooltipEnergyValue');

        // PRIORITY 1: Check edge hover (edges take priority over faces)
        if (edgeIntersects.length > 0) {
            const hoveredEdge = edgeIntersects[0].object;
            const edgeData = hoveredEdge.userData.edgeData;
            const edgeName = hoveredEdge.userData.edgeName;

            if (edgeData && edgeTooltip) {
                // Hide face tooltip
                if (faceTooltip) faceTooltip.classList.remove('visible');

                // Show edge tooltip
                const tensionPercent = Math.round(edgeData.tension * 100);
                const healthStatus = edgeData.healthStatus || 'Unknown';

                // Sprint 4 Task 33: Enhanced edge question display
                const questionHtml = edgeData.theQuestion ?
                    `<div class="edge-question">${edgeData.theQuestion}</div>` : '';

                // Sprint 4 Task 29: Edge Polarity - Calculate energy flow direction
                const face1Energy = edgeData.face1Energy || 0;
                const face2Energy = edgeData.face2Energy || 0;
                const energyDiff = face2Energy - face1Energy;
                let flowHtml = '';

                if (Math.abs(energyDiff) > 0.05) {
                    const flowDirection = energyDiff > 0 ? '→' : '←';
                    const flowLabel = energyDiff > 0 ? 'projecting' : 'receiving';
                    const flowColor = energyDiff > 0 ? '#00ffcc' : '#ffaa00';
                    const f1Name = edgeData.face1Name || `Face ${edgeData.face1Id}`;
                    const f2Name = edgeData.face2Name || `Face ${edgeData.face2Id}`;
                    const f1Pct = Math.round(face1Energy * 100);
                    const f2Pct = Math.round(face2Energy * 100);

                    flowHtml = `
                    <div style="font-size: 10px; margin-top: 6px; padding-top: 6px; border-top: 1px solid rgba(255,255,255,0.1);">
                        <div style="opacity: 0.7; margin-bottom: 4px;">Energy Flow:</div>
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <span style="color: ${face1Energy < face2Energy ? '#ffaa00' : '#00ffcc'}">${f1Name} (${f1Pct}%)</span>
                            <span style="color: ${flowColor}; font-size: 14px;">${flowDirection}</span>
                            <span style="color: ${face2Energy < face1Energy ? '#ffaa00' : '#00ffcc'}">${f2Name} (${f2Pct}%)</span>
                        </div>
                    </div>`;
                }

                edgeTooltip.innerHTML = `
                <div style="font-weight: 600; margin-bottom: 4px; font-size: 12px; color: ${edgeData.color};">${edgeName}</div>
                <div style="font-size: 11px; opacity: 0.8;">
                    Tension: <span style="color: ${edgeData.color}">${tensionPercent}%</span> (${healthStatus})
                </div>
                <div style="font-size: 10px; opacity: 0.6; margin-top: 2px;">
                    <span style="color: ${edgeData.color};">●</span> ${edgeData.element} Element
                </div>
                ${flowHtml}
                ${questionHtml}
            `;

                // Position tooltip
                const tooltipOffset = 20;
                edgeTooltip.style.left = (event.clientX + tooltipOffset) + 'px';
                edgeTooltip.style.top = (event.clientY + tooltipOffset) + 'px';
                edgeTooltip.classList.add('visible');

                canvas.style.cursor = 'pointer';
            }

            return; // Skip face hover if edge is hovered
        } else {
            // Hide edge tooltip when not hovering edge
            if (edgeTooltip) edgeTooltip.classList.remove('visible');
        }

        // Reset previous hover - brighten the material slightly
        if (hoveredFace && hoveredFace !== selectedFace) {
            const material = hoveredFace.userData.material;
            if (material) {
                // Reset to normal brightness
                material.emissiveIntensity = material.userData.baseIntensity || 0.3;
            }
        }

        // PRIORITY 2: Check face hover (only if no edge hovered)
        if (faceIntersects.length > 0) {
            const hoveredMesh = faceIntersects[0].object;
            hoveredFace = hoveredMesh;

            const material = hoveredMesh.userData.material;
            if (material) {
                // Store base intensity if not already stored
                if (!material.userData.baseIntensity) {
                    material.userData.baseIntensity = material.emissiveIntensity;
                }
                // Brighten on hover
                material.emissiveIntensity = Math.min(material.userData.baseIntensity * 1.5, 1.0);
            }

            // Show tooltip with face data
            const faceData = hoveredMesh.userData.faceData;
            if (faceData && faceTooltip && tooltipFaceName && tooltipEnergyValue) {
                tooltipFaceName.textContent = faceData.name || `Face ${hoveredMesh.userData.faceId}`;

                const energy = faceData.faceEnergy || 0;
                const energyPercent = Math.round(energy * 100);
                tooltipEnergyValue.textContent = `${energyPercent}%`;

                // Set energy value color class
                tooltipEnergyValue.className = 'tooltip-energy-value';
                if (energy >= 0.7) {
                    tooltipEnergyValue.classList.add('healthy');
                } else if (energy >= 0.4) {
                    tooltipEnergyValue.classList.add('warning');
                } else {
                    tooltipEnergyValue.classList.add('critical');
                }

                // Position tooltip near mouse
                const tooltipOffset = 20;
                faceTooltip.style.left = (event.clientX + tooltipOffset) + 'px';
                faceTooltip.style.top = (event.clientY + tooltipOffset) + 'px';

                // Show tooltip
                faceTooltip.classList.add('visible');
            }

            canvas.style.cursor = 'pointer';
        } else {
            hoveredFace = null;
            canvas.style.cursor = 'default';

            // Hide tooltips
            if (faceTooltip) {
                faceTooltip.classList.remove('visible');
            }
        }
    };

    // Handle mouse click
    const onMouseClick = (event) => {
        console.log(`🖱️ Canvas click at (${event.clientX}, ${event.clientY})`);

        // Calculate movement from where OrbitControls drag started
        const deltaX = Math.abs(event.clientX - mouseStartPosition.x);
        const deltaY = Math.abs(event.clientY - mouseStartPosition.y);
        const totalMovement = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        console.log(`   📏 Movement from drag start: ${totalMovement.toFixed(1)}px (threshold: ${DRAG_THRESHOLD}px)`);
        console.log(`   🎮 isDraggingWithOrbit: ${isDraggingWithOrbit}`);

        // If user moved more than threshold, ignore the click (it was a drag)
        // Note: We check movement first because the dragging flag may still be true
        // when the click event fires, but if movement is minimal, it's a valid click
        if (totalMovement > DRAG_THRESHOLD) {
            console.log(`   🚫 Ignoring click - user was dragging (${totalMovement.toFixed(1)}px movement)`);
            return;
        }

        console.log(`   ✅ Valid click - processing...`);
        console.log(`   📊 faceMeshes.length: ${faceMeshes.length}`);

        // Calculate mouse position in normalized device coordinates
        const rect = canvas.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        console.log(`   🎯 Mouse NDC: (${mouse.x.toFixed(2)}, ${mouse.y.toFixed(2)})`);

        // Raycast to find intersections (edges take priority)
        raycaster.setFromCamera(mouse, camera);

        const edgeLines = window.edgeLines || [];
        const edgeIntersects = raycaster.intersectObjects(edgeLines);
        const faceIntersects = raycaster.intersectObjects(faceMeshes);

        console.log(`   🔍 Raycaster found ${edgeIntersects.length} edge intersections, ${faceIntersects.length} face intersections`);

        // PRIORITY 1: Check if edge was clicked
        if (edgeIntersects.length > 0) {
            const clickedEdge = edgeIntersects[0].object;
            const edgeData = clickedEdge.userData.edgeData;

            console.log(`   🔗 Hit edge ${edgeData.id}: ${clickedEdge.userData.edgeName}`);
            console.log(`   📦 Edge data:`, edgeData);

            if (edgeData) {
                // Show edge detail panel
                showEdgeDetail(edgeData, clickedEdge.userData.edgeName);
            }
            return; // Don't process face click if edge was clicked
        }

        // PRIORITY 2: Check if face was clicked (only if no edge clicked)
        if (faceIntersects.length > 0) {
            const clickedMesh = faceIntersects[0].object;
            selectedFace = clickedMesh.userData.faceData;
            const faceIndex = clickedMesh.userData.faceIndex;

            console.log(`   ✅ Hit face ${faceIndex + 1}: ${selectedFace?.name || 'Unknown'}`);
            console.log(`   📦 Face data:`, selectedFace);

            if (selectedFace) {
                // Animate camera to focus on this face
                const cameraTarget = getCameraPositionForFace(faceIndex);
                if (cameraTarget) {
                    // Temporarily disable auto-rotation during camera animation
                    const wasAutoRotating = autoRotate;
                    autoRotate = false;

                    animateCameraTo(cameraTarget.position, cameraTarget.lookAt, 1200);

                    // Re-enable auto-rotation after animation completes (if it was on)
                    setTimeout(() => {
                        autoRotate = wasAutoRotating;
                    }, 1200);
                }

                // Show face detail panel
                showFaceDetail(selectedFace);
            }
        } else {
            // Clicked on canvas but didn't hit any face - close the panel if open
            console.log(`   ⚠️ No face hit - clicked empty space`);
            const panel = document.getElementById('faceDetailPanel');
            if (panel && panel.classList.contains('visible')) {
                console.log(`   🔒 Closing face detail panel`);
                closeFaceDetail();
            }
        }
    };

    // Map internal element codes to business-friendly dimension names
    const getBusinessDimensionName = (element) => {
        const dimensionMap = {
            'earth': 'Stability',
            'water': 'Adaptability',
            'fire': 'Drive',
            'air': 'Communication',
            'ether': 'Vision'
        };
        return dimensionMap[element.toLowerCase()] || element;
    };

    // Show face detail panel
    const showFaceDetail = (face) => {
        const panel = document.getElementById('faceDetailPanel');
        const title = document.getElementById('faceDetailTitle');
        const energyDisplay = document.getElementById('faceEnergyDisplay');
        const kpiGrid = document.getElementById('kpiGrid');

        title.textContent = face.name || `Face ${face.id}`;
        energyDisplay.textContent = `${Math.round((face.faceEnergy || 0) * 100)}%`;

        // Build KPI grid
        kpiGrid.innerHTML = '';

        if (face.elementalKPIs && face.elementalKPIs.length > 0) {
            face.elementalKPIs.forEach(kpi => {
                const kpiItem = document.createElement('div');
                kpiItem.className = 'kpi-item';

                const normalizedScore = kpi.normalizedScore || 0;
                const healthClass = normalizedScore >= 0.7 ? 'healthy' : normalizedScore >= 0.4 ? 'warning' : 'critical';
                const element = kpi.element ? kpi.element.toLowerCase() : 'earth';
                const dimensionName = getBusinessDimensionName(element);

                kpiItem.innerHTML = `
                <div class="kpi-item-header">
                    <span class="kpi-name">${kpi.name || 'Unknown KPI'}</span>
                    <span class="kpi-element ${element}">${dimensionName}</span>
                </div>
                <div class="kpi-value-bar">
                    <div class="kpi-value-fill ${healthClass}" style="width: ${normalizedScore * 100}%"></div>
                </div>
            `;

                kpiGrid.appendChild(kpiItem);
            });
        } else {
            kpiGrid.innerHTML = '<div style="text-align: center; opacity: 0.5; padding: 20px;">No KPI data available</div>';
        }

        // ========================================
        // SPRINT 3.5: ELEMENT BALANCE GRID
        // ========================================
        const elementBalanceGrid = document.getElementById('elementBalanceGrid');
        if (elementBalanceGrid && face.elementalKPIs) {
            // Group KPIs by element and calculate average scores
            const elementData = {
                earth: { icon: '🜃', name: 'Earth', scores: [], label: 'Stability' },
                water: { icon: '💧', name: 'Water', scores: [], label: 'Adaptability' },
                fire: { icon: '🔥', name: 'Fire', scores: [], label: 'Action' },
                air: { icon: '💨', name: 'Air', scores: [], label: 'Communication' },
                ether: { icon: '✧', name: 'Ether', scores: [], label: 'Vision' }
            };

            // Collect scores by element
            face.elementalKPIs.forEach(kpi => {
                const element = (kpi.element || 'earth').toLowerCase();
                if (elementData[element]) {
                    elementData[element].scores.push(kpi.normalizedScore || 0);
                }
            });

            // Build the grid
            elementBalanceGrid.innerHTML = '';
            Object.entries(elementData).forEach(([key, data]) => {
                const avgScore = data.scores.length > 0
                    ? data.scores.reduce((a, b) => a + b, 0) / data.scores.length
                    : 0;
                const percentage = Math.round(avgScore * 100);

                const item = document.createElement('div');
                item.className = 'element-balance-item';
                item.innerHTML = `
                    <div class="element-icon">${data.icon}</div>
                    <div class="element-name">${data.label}</div>
                    <div class="element-value">${percentage}%</div>
                    <div class="element-bar">
                        <div class="element-bar-fill" style="width: ${percentage}%"></div>
                    </div>
                `;
                elementBalanceGrid.appendChild(item);
            });

            // Sprint 4 Task 28: Update Pentagram Visualization
            const pentagramData = document.getElementById('pentagramData');
            if (pentagramData) {
                // Calculate element scores for pentagram (order: Fire, Air, Ether, Water, Earth)
                const elementOrder = ['fire', 'air', 'ether', 'water', 'earth'];
                const scores = elementOrder.map(el => {
                    const data = elementData[el];
                    return data.scores.length > 0
                        ? data.scores.reduce((a, b) => a + b, 0) / data.scores.length
                        : 0;
                });

                // Pentagram points (star shape) - center is (80, 80), radius 65
                const center = { x: 80, y: 80 };
                const maxRadius = 60;
                const minRadius = 5;

                // Calculate point positions for pentagram (5 points, -90° offset for top)
                const angleOffset = -Math.PI / 2; // Start at top
                const points = scores.map((score, i) => {
                    const angle = angleOffset + (i * 2 * Math.PI / 5);
                    const radius = minRadius + (score * (maxRadius - minRadius));
                    return {
                        x: center.x + radius * Math.cos(angle),
                        y: center.y + radius * Math.sin(angle)
                    };
                });

                // Update polygon points
                const pointsStr = points.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
                pentagramData.setAttribute('points', pointsStr);

                // Color based on overall balance
                const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
                if (avgScore >= 0.618) {
                    pentagramData.setAttribute('fill', 'rgba(102, 255, 136, 0.3)');
                    pentagramData.setAttribute('stroke', '#66ff88');
                } else if (avgScore >= 0.382) {
                    pentagramData.setAttribute('fill', 'rgba(0, 255, 204, 0.3)');
                    pentagramData.setAttribute('stroke', '#00ffcc');
                } else {
                    pentagramData.setAttribute('fill', 'rgba(255, 170, 0, 0.3)');
                    pentagramData.setAttribute('stroke', '#ffaa00');
                }
            }
        }

        // ========================================
        // SPRINT 3.5: LEVERAGE ACTION
        // ========================================
        const leverageActionText = document.getElementById('leverageActionText');
        if (leverageActionText && face.elementalKPIs) {
            // Find the lowest scoring KPI
            let lowestKpi = null;
            let lowestScore = 1;
            face.elementalKPIs.forEach(kpi => {
                if ((kpi.normalizedScore || 0) < lowestScore) {
                    lowestScore = kpi.normalizedScore || 0;
                    lowestKpi = kpi;
                }
            });

            if (lowestKpi && lowestScore < 0.6) {
                leverageActionText.textContent = `Focus on improving "${lowestKpi.name}" (currently at ${Math.round(lowestScore * 100)}%) for maximum impact on this face's energy.`;
            } else if (face.faceEnergy < 0.4) {
                leverageActionText.textContent = `This face needs attention. Consider reviewing all KPIs and prioritizing the most critical improvements.`;
            } else if (face.faceEnergy >= 0.618) {
                leverageActionText.textContent = `This face is performing well! Consider how to leverage this strength to support weaker areas of the organization.`;
            } else {
                leverageActionText.textContent = `Continue steady progress across all elements to build toward transcendence threshold (61.8%).`;
            }
        }

        // ========================================
        // OCTAVE PROGRESSION SECTION
        // ========================================
        const octaveNumber = document.getElementById('octaveNumber');
        const octaveNameDisplay = document.getElementById('octaveNameDisplay');
        const octaveProgressPercent = document.getElementById('octaveProgressPercent');
        const nextOctaveName = document.getElementById('nextOctaveName');
        const octaveProgressFill = document.getElementById('octaveProgressFill');
        const octaveThresholdMarker = document.getElementById('octaveThresholdMarker');
        const transcendenceBadge = document.getElementById('transcendenceBadge');

        // Roman numeral conversion
        const toRoman = (num) => ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'][num - 1] || num;

        // Octave names from main.js
        const octaveNames = ['Survival', 'Structure', 'Relationships', 'Creativity', 'Expression', 'Vision', 'Radiance'];

        // Get octave info (use currentOctave from face or default to 1)
        const currentOctave = face.currentOctave || 1;
        const octaveName = octaveNames[currentOctave - 1] || 'Unknown';

        // Get progress (face energy as proxy for octave progress)
        const progress = face.faceEnergy || 0;

        // Get threshold from tuning config
        const tuning = window.Quannex ? window.Quannex.exportTuning() : null;
        const theta = tuning ? tuning.theta : 0.618;
        const isReady = progress >= theta && currentOctave < 7;

        // Update octave badge
        if (octaveNumber) {
            octaveNumber.textContent = toRoman(currentOctave);
        }
        if (octaveNameDisplay) {
            octaveNameDisplay.textContent = octaveName;
        }

        // Update progress display
        if (octaveProgressPercent) {
            octaveProgressPercent.textContent = `${Math.round(progress * 100)}%`;
        }

        if (nextOctaveName) {
            if (currentOctave < 7) {
                nextOctaveName.textContent = `Octave ${toRoman(currentOctave + 1)} (${octaveNames[currentOctave]})`;
            } else {
                nextOctaveName.textContent = 'Radiance Mastery';
            }
        }

        if (octaveProgressFill) {
            octaveProgressFill.style.width = `${Math.min(progress * 100, 100)}%`;
        }

        // Position threshold marker based on THETA
        if (octaveThresholdMarker) {
            octaveThresholdMarker.style.left = `${theta * 100}%`;
        }

        // Show/hide transcendence badge
        if (transcendenceBadge) {
            transcendenceBadge.style.display = isReady ? 'block' : 'none';
        }

        // ========================================
        // BREATH AXIS SECTION - Phase 2 Enhancement
        // ========================================
        const breathAxisSection = document.getElementById('breathAxisSection');
        const breathAxisName = document.getElementById('breathAxisName');
        const breathRatioValue = document.getElementById('breathRatioValue');
        const breathStatus = document.getElementById('breathStatus');
        const partnerFaceInfo = document.getElementById('partnerFaceInfo');
        const viewFullDnaBtn = document.getElementById('viewFullDnaBtn');

        // Get breath analysis data
        const breathAnalysis = window.Quannex ? window.Quannex.getBreathAnalysis() : null;

        if (breathAnalysis && breathAxisSection) {
            // Find the breath axis that includes this face
            const faceId = face.id;
            const axisData = breathAnalysis.axes ? breathAnalysis.axes.find(axis =>
                axis.receptionFace === faceId || axis.projectionFace === faceId
            ) : null;

            if (axisData) {
                // Determine this face's role in the breath axis
                const isReception = axisData.receptionFace === faceId;
                const partnerFaceId = isReception ? axisData.projectionFace : axisData.receptionFace;
                const role = isReception ? 'Reception (Inhale)' : 'Projection (Exhale)';

                // Get partner face name from company data
                const companyData = window.Quannex.getState();
                let partnerFaceName = `Face ${partnerFaceId}`;
                let partnerEnergy = 0.5;
                if (companyData && companyData.faces) {
                    const partnerFace = companyData.faces.find(f => f.id === partnerFaceId);
                    if (partnerFace) {
                        partnerFaceName = partnerFace.name || partnerFaceName;
                        partnerEnergy = partnerFace.faceEnergy || 0.5;
                    }
                }

                // Populate UI elements
                breathAxisName.textContent = `${axisData.axis || 'Breath Axis'} (${role})`;
                breathRatioValue.textContent = axisData.linearRatio ? axisData.linearRatio.toFixed(2) : '--';

                // Determine status based on ratio
                const ratio = axisData.linearRatio || 1.0;
                let statusText = 'Balanced';
                let statusClass = 'balanced';

                if (ratio > 1.3) {
                    statusText = 'Over-projecting';
                    statusClass = 'over-exhaling';
                } else if (ratio < 0.7) {
                    statusText = 'Over-receiving';
                    statusClass = 'over-inhaling';
                }

                breathStatus.textContent = statusText;
                breathStatus.className = 'breath-status ' + statusClass;

                partnerFaceInfo.textContent = `Partner: F${partnerFaceId} (${partnerFaceName})`;

                // Initialize DNA preview animation
                if (window.initDNAPreview) {
                    window.initDNAPreview({
                        ratio: ratio,
                        receptionEnergy: isReception ? (face.faceEnergy || 0.5) : partnerEnergy,
                        projectionEnergy: isReception ? partnerEnergy : (face.faceEnergy || 0.5)
                    });
                }

                // Setup button click handler
                if (viewFullDnaBtn) {
                    viewFullDnaBtn.onclick = () => {
                        // Store context for the DNA page
                        sessionStorage.setItem('selectedFaceForDNA', JSON.stringify({
                            faceId: faceId,
                            faceName: face.name,
                            axisName: axisData.axis,
                            receptionFace: axisData.receptionFace,
                            projectionFace: axisData.projectionFace
                        }));
                        // Navigate to full DNA analysis
                        window.location.href = 'octave-dna.html';
                    };
                }

                breathAxisSection.style.display = 'block';
            } else {
                breathAxisSection.style.display = 'none';
            }
        } else {
            if (breathAxisSection) {
                breathAxisSection.style.display = 'none';
            }
        }

        // Populate connected edges section (Advanced mode only)
        const edgesSection = document.getElementById('connectedEdgesSection');
        const edgesList = document.getElementById('connectedEdgesList');

        if (window.advancedAnalysisResults && window.advancedAnalysisResults.edges) {
            const edges = window.advancedAnalysisResults.edges;
            const companyData = window.Quannex ? window.Quannex.getState() : null;

            // Find edges connected to this face
            const connectedEdges = edges.filter(edge =>
                edge.face1Id === face.id || edge.face2Id === face.id
            );

            if (connectedEdges.length > 0) {
                edgesList.innerHTML = '';
                connectedEdges.forEach(edge => {
                    const otherFaceId = edge.face1Id === face.id ? edge.face2Id : edge.face1Id;

                    // Get the actual face name from company data
                    let otherFaceName = `Face ${otherFaceId}`;
                    let otherFaceEnergy = 0;
                    let currentFaceEnergy = face.faceEnergy || 0;

                    if (companyData && companyData.faces) {
                        const otherFace = companyData.faces.find(f => f.id === otherFaceId);
                        if (otherFace) {
                            otherFaceName = otherFace.name || otherFaceName;
                            otherFaceEnergy = otherFace.faceEnergy || 0;
                        }
                    }

                    const tension = edge.tension || 0;
                    const tensionPercent = Math.round(tension * 100);

                    // Determine tension context
                    let tensionClass = 'success';
                    let contextIndicator = '';

                    if (tension > 0.6) {
                        tensionClass = 'critical';
                    } else if (tension > 0.4) {
                        tensionClass = 'warning';
                    } else {
                        // Low tension - check context
                        if (currentFaceEnergy < 0.4 && otherFaceEnergy < 0.4) {
                            // Both faces critical - bad situation
                            contextIndicator = ' ⚠️';
                            tensionClass = 'critical';
                        } else if (currentFaceEnergy >= 0.7 && otherFaceEnergy >= 0.7) {
                            // Both faces healthy - good balance
                            contextIndicator = ' ✓';
                            tensionClass = 'success';
                        }
                    }

                    // Sprint 4 Task 28: Enhanced edge display with question
                    const edgeQuestion = edge.question || edge.theQuestion || '';
                    const edgeName = edge.emergentName || edge.name || '';

                    const edgeItem = document.createElement('div');
                    edgeItem.className = 'connected-edge-item';
                    edgeItem.style.fontSize = '11px';
                    edgeItem.style.marginBottom = '10px';
                    edgeItem.style.padding = '8px';
                    edgeItem.style.background = 'rgba(0, 255, 204, 0.05)';
                    edgeItem.style.borderRadius = '4px';
                    edgeItem.style.borderLeft = `3px solid ${tension > 0.6 ? '#ff4444' : tension > 0.4 ? '#ffaa00' : '#00ff88'}`;
                    edgeItem.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                        <span style="color: #00ffcc; font-weight: 500;">${edgeName || `→ ${otherFaceName}`}</span>
                        <span class="metric-value ${tensionClass}" style="font-size: 10px;">${tensionPercent}%${contextIndicator}</span>
                    </div>
                    ${edgeQuestion ? `
                        <div style="font-size: 10px; font-style: italic; color: rgba(255, 204, 0, 0.8); padding-left: 8px; border-left: 2px solid rgba(255, 204, 0, 0.3); margin-top: 4px;">
                            "${edgeQuestion}"
                        </div>
                    ` : ''}
                `;
                    edgesList.appendChild(edgeItem);
                });
                edgesSection.style.display = 'block';
            } else {
                edgesSection.style.display = 'none';
            }
        } else {
            edgesSection.style.display = 'none';
        }

        // Populate corner vertices section (Advanced mode only)
        const verticesSection = document.getElementById('cornerVerticesSection');
        const verticesList = document.getElementById('cornerVerticesList');

        if (window.advancedAnalysisResults && window.advancedAnalysisResults.vertices) {
            const vertices = window.advancedAnalysisResults.vertices;
            // Find vertices at corners of this face (vertices whose faceIds include this face)
            const cornerVertices = vertices.filter(vertex =>
                vertex.faceIds && vertex.faceIds.includes(face.id)
            );

            if (cornerVertices.length > 0) {
                verticesList.innerHTML = '';
                cornerVertices.forEach(vertex => {
                    const archetype = vertex.archetype || vertex.emergentName || 'Unknown';
                    const vortexStrength = vertex.vortexStrength || 0;
                    const vortexDirection = vertex.vortexDirection || 0;
                    const strengthPercent = Math.round(vortexStrength * 100);
                    const classification = vertex.classification || '';
                    const isBermuda = classification === 'bermuda_triangle';

                    // Color code based on vortex direction
                    let directionIcon = '⚪';
                    let directionLabel = 'Neutral';
                    if (vortexDirection > 0.2) {
                        directionIcon = '🔵';
                        directionLabel = 'Upward';
                    } else if (vortexDirection < -0.2) {
                        directionIcon = '🔴';
                        directionLabel = 'Downward';
                    }

                    // Sprint 4 Task 28: Enhanced vertex display with bermuda triangle indicator
                    const vertexItem = document.createElement('div');
                    vertexItem.className = 'corner-vertex-item';
                    vertexItem.style.marginBottom = '10px';
                    vertexItem.style.padding = '8px';
                    vertexItem.style.background = isBermuda ? 'rgba(255, 34, 34, 0.15)' : 'rgba(255, 0, 100, 0.05)';
                    vertexItem.style.borderRadius = '4px';
                    vertexItem.style.borderLeft = isBermuda ? '3px solid #ff2222' : '3px solid rgba(255, 0, 100, 0.5)';
                    vertexItem.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                        <span style="color: ${isBermuda ? '#ff6666' : '#ff66aa'}; font-weight: 500;">
                            ${directionIcon} V${vertex.id}: ${archetype}
                        </span>
                        <span style="font-size: 10px;">${strengthPercent}% • ${directionLabel}</span>
                    </div>
                    ${isBermuda ? `
                        <div style="font-size: 10px; color: #ff4444; padding: 4px 8px; background: rgba(255, 34, 34, 0.2); border-radius: 3px; margin-top: 4px;">
                            ⚠️ <strong>BERMUDA TRIANGLE</strong> - Critical imbalance zone
                        </div>
                    ` : classification ? `
                        <div style="font-size: 10px; color: rgba(255, 255, 255, 0.6); margin-top: 2px;">
                            ${classification.replace(/_/g, ' ')}
                        </div>
                    ` : ''}
                `;
                    verticesList.appendChild(vertexItem);
                });
                verticesSection.style.display = 'block';
            } else {
                verticesSection.style.display = 'none';
            }
        } else {
            verticesSection.style.display = 'none';
        }

        // Populate shadow section (Phase 3)
        const shadowSection = document.getElementById('shadowSection');
        const shadowList = document.getElementById('shadowList');

        if (window.advancedAnalysisResults && window.advancedAnalysisResults.shadows) {
            const shadows = window.advancedAnalysisResults.shadows;
            // Find shadows affecting this face
            const faceShadows = shadows.filter(s => s.faceId === face.id);

            if (faceShadows.length > 0) {
                shadowList.innerHTML = '';
                faceShadows.forEach((shadow, index) => {
                    // Sprint 4 Task 28: Enhanced shadow display with dual-form toggle
                    const suppressedForm = shadow.suppressed || shadow.description || 'Shadow pattern detected';
                    const integratedForm = shadow.integrated || shadow.gift || 'Integrated wisdom awaits discovery';
                    const shadowId = `shadow-${face.id}-${index}`;

                    const shadowItem = document.createElement('div');
                    shadowItem.className = 'shadow-dual-card';
                    shadowItem.style.marginBottom = '12px';
                    shadowItem.style.padding = '10px';
                    shadowItem.style.background = 'rgba(255, 68, 68, 0.1)';
                    shadowItem.style.borderRadius = '6px';
                    shadowItem.style.borderLeft = '3px solid #ff4444';
                    shadowItem.setAttribute('data-shadow-id', shadowId);
                    shadowItem.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <span style="font-weight: 600; color: #ff8888; font-size: 11px;">⚠️ ${shadow.name}</span>
                        <button class="shadow-toggle-btn" data-shadow-id="${shadowId}" style="font-size: 9px; padding: 3px 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 4px; color: #fff; cursor: pointer;">
                            🔄 See Gift
                        </button>
                    </div>
                    <div class="shadow-suppressed-view" data-shadow-id="${shadowId}" style="font-size: 10px; color: rgba(255, 136, 136, 0.9);">
                        <div style="opacity: 0.7; font-size: 9px; margin-bottom: 2px;">The Shadow:</div>
                        ${suppressedForm}
                    </div>
                    <div class="shadow-integrated-view" data-shadow-id="${shadowId}" style="display: none; font-size: 10px; color: rgba(102, 255, 153, 0.9);">
                        <div style="opacity: 0.7; font-size: 9px; margin-bottom: 2px;">💡 The Gift:</div>
                        ${integratedForm}
                    </div>
                `;

                    // Add toggle functionality
                    const toggleBtn = shadowItem.querySelector('.shadow-toggle-btn');
                    toggleBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const suppressed = shadowItem.querySelector('.shadow-suppressed-view');
                        const integrated = shadowItem.querySelector('.shadow-integrated-view');
                        const isShowingShadow = suppressed.style.display !== 'none';

                        if (isShowingShadow) {
                            suppressed.style.display = 'none';
                            integrated.style.display = 'block';
                            toggleBtn.textContent = '🔄 See Shadow';
                            shadowItem.style.background = 'rgba(102, 255, 153, 0.1)';
                            shadowItem.style.borderLeftColor = '#66ff99';
                        } else {
                            integrated.style.display = 'none';
                            suppressed.style.display = 'block';
                            toggleBtn.textContent = '🔄 See Gift';
                            shadowItem.style.background = 'rgba(255, 68, 68, 0.1)';
                            shadowItem.style.borderLeftColor = '#ff4444';
                        }
                    });

                    shadowList.appendChild(shadowItem);
                });
                if (shadowSection) shadowSection.style.display = 'block';
            } else {
                if (shadowSection) shadowSection.style.display = 'none';
            }
        } else {
            if (shadowSection) shadowSection.style.display = 'none';
        }

        // Show panel
        panel.classList.add('visible');
    };

    // Show edge detail panel with CSV metadata
    const showEdgeDetail = (edgeData, edgeName) => {
        console.log('🔗 Showing edge detail:', edgeData);

        // For now, use the face detail panel but customize it for edges
        // TODO: Create dedicated edge detail panel in future
        const panel = document.getElementById('faceDetailPanel');
        const title = document.getElementById('faceDetailTitle');
        const energyDisplay = document.getElementById('faceEnergyDisplay');
        const kpiGrid = document.getElementById('kpiGrid');

        // Set title to edge archetype
        title.textContent = edgeName || `Edge ${edgeData.id}`;

        // Show tension as energy
        const tensionPercent = Math.round((edgeData.tension || 0) * 100);
        energyDisplay.textContent = `${tensionPercent}% Tension`;
        energyDisplay.className = edgeData.tension > 0.6 ? 'critical' : edgeData.tension > 0.3 ? 'warning' : 'healthy';

        // Build edge metadata display
        kpiGrid.innerHTML = `
        <div style="padding: 20px; line-height: 1.8;">
            <div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                <div style="font-size: 11px; opacity: 0.6; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Edge Connection</div>
                <div style="font-size: 13px; color: #00ffcc;">${edgeData.face1Name} ↔ ${edgeData.face2Name}</div>
            </div>

            <div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                <div style="font-size: 11px; opacity: 0.6; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Tension Analysis</div>
                <div style="margin-bottom: 8px;">
                    <span style="opacity: 0.7;">Status:</span>
                    <span style="color: ${edgeData.color}; font-weight: 600;">${edgeData.healthStatus}</span>
                </div>
                <div style="margin-bottom: 8px;">
                    <span style="opacity: 0.7;">Tension:</span>
                    <span style="color: ${edgeData.color}; font-weight: 600;">${tensionPercent}%</span>
                </div>
                <div style="margin-bottom: 8px;">
                    <span style="opacity: 0.7;">Element:</span>
                    <span style="font-weight: 600;">${edgeData.element}</span>
                </div>
                <div>
                    <span style="opacity: 0.7;">Flow Direction:</span>
                    <span style="font-weight: 600;">${edgeData.flowDirection}</span>
                    ${edgeData.breathRatio > 0 ? ' →' : edgeData.breathRatio < 0 ? ' ←' : ' ⚖️'}
                </div>
            </div>

            ${edgeData.question ? `
                <div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <div style="font-size: 11px; opacity: 0.6; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Guiding Question</div>
                    <div style="font-style: italic; color: #ffcc00; line-height: 1.6;">"${edgeData.question}"</div>
                </div>
            ` : ''}

            ${edgeData.kpiName ? `
                <div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <div style="font-size: 11px; opacity: 0.6; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Edge KPI</div>
                    <div style="margin-bottom: 8px;">
                        <span style="font-weight: 600; color: #00ffcc;">${edgeData.kpiName}</span>
                    </div>
                    ${edgeData.kpiCoherence !== null ? `
                        <div style="margin-bottom: 8px;">
                            <span style="opacity: 0.7;">Coherence:</span>
                            <span style="font-weight: 600;">${Math.round(edgeData.kpiCoherence * 100)}%</span>
                        </div>
                    ` : ''}
                    ${edgeData.kpiMetric ? `
                        <div style="margin-top: 10px; padding: 12px; background: rgba(0,255,204,0.05); border-radius: 6px; font-size: 11px; opacity: 0.8;">
                            <div style="font-weight: 600; margin-bottom: 4px;">How to Measure:</div>
                            <div>${edgeData.kpiMetric}</div>
                        </div>
                    ` : ''}
                </div>
            ` : ''}

            <div style="margin-bottom: 20px;">
                <div style="font-size: 11px; opacity: 0.6; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Energy Levels</div>
                <div style="margin-bottom: 8px;">
                    <span style="opacity: 0.7;">${edgeData.face1Name}:</span>
                    <span style="font-weight: 600;">${Math.round(edgeData.face1Energy * 100)}%</span>
                </div>
                <div>
                    <span style="opacity: 0.7;">${edgeData.face2Name}:</span>
                    <span style="font-weight: 600;">${Math.round(edgeData.face2Energy * 100)}%</span>
                </div>
            </div>

            ${edgeData.hasCSVData ? `
                <div style="padding: 12px; background: rgba(0,255,100,0.1); border-left: 3px solid #00ff66; border-radius: 4px; font-size: 11px;">
                    ✅ Full CSV data loaded for this edge
                </div>
            ` : `
                <div style="padding: 12px; background: rgba(255,204,0,0.1); border-left: 3px solid #ffcc00; border-radius: 4px; font-size: 11px;">
                    ⚠️ Using calculated tension values (CSV data not available)
                </div>
            `}
        </div>
    `;

        // Hide edge/vertex sections for now
        const edgesSection = document.getElementById('connectedEdgesSection');
        const verticesSection = document.getElementById('cornerVerticesSection');
        if (edgesSection) edgesSection.style.display = 'none';
        if (verticesSection) verticesSection.style.display = 'none';

        // Show panel
        panel.classList.add('visible');
    };

    // Close face detail panel
    const closeFaceDetail = () => {
        const panel = document.getElementById('faceDetailPanel');
        panel.classList.remove('visible');
        selectedFace = null;

        // Also hide tooltip when closing panel
        const tooltip = document.getElementById('faceTooltip');
        if (tooltip) {
            tooltip.classList.remove('visible');
        }

        // Stop DNA preview animation when panel closes
        if (window.stopDNAPreview) {
            window.stopDNAPreview();
        }

        // Smoothly return to default view for better UX
        // Check if camera is close (zoomed in from clicking a face)
        const currentDistance = camera.position.length();
        if (currentDistance < 5) {
            resetCameraView();
        }
    };

    // ========================================
    // UI CONTROLS
    // ========================================

    const updateStats = () => {
        if (!companyData) {
            console.warn('⚠️ No company data for stats');
            return;
        }

        const coherence = companyData.globalCoherence || 0;
        const coherencePercent = Math.round(coherence * 100);

        // Calculate status with color
        let status, statusColor;
        if (coherence >= 0.7) {
            status = 'Healthy ✅';
            statusColor = '#00ff88';
        } else if (coherence >= 0.5) {
            status = 'Moderate ⚠️';
            statusColor = '#ffcc00';
        } else if (coherence >= 0.3) {
            status = 'Concerning 🔴';
            statusColor = '#ff6666';
        } else {
            status = 'Critical 🚨';
            statusColor = '#ff0000';
        }

        document.getElementById('statCoherence').textContent = `${coherencePercent}%`;
        const statusEl = document.getElementById('statStatus');
        statusEl.textContent = status;
        statusEl.style.color = statusColor;

        // ========================================
        // SPRINT 3.5: Update Coherence HUD
        // ========================================
        const coherenceHud = document.getElementById('coherenceHud');
        const coherenceHudValue = document.getElementById('coherenceHudValue');
        const coherenceHudStatus = document.getElementById('coherenceHudStatus');

        if (coherenceHudValue) {
            coherenceHudValue.textContent = `${coherencePercent}%`;
        }

        if (coherenceHudStatus) {
            // Remove all status classes
            coherenceHudStatus.classList.remove('critical', 'warning', 'healthy', 'transcendent');

            // Determine status
            let hudStatus, hudClass;
            if (coherence >= 0.618) {
                hudStatus = 'Transcendent';
                hudClass = 'transcendent';
            } else if (coherence >= 0.5) {
                hudStatus = 'Healthy';
                hudClass = 'healthy';
            } else if (coherence >= 0.3) {
                hudStatus = 'Warning';
                hudClass = 'warning';
            } else {
                hudStatus = 'Critical';
                hudClass = 'critical';
            }

            coherenceHudStatus.textContent = hudStatus;
            coherenceHudStatus.classList.add(hudClass);

            // Update HUD border for critical state
            if (coherenceHud) {
                coherenceHud.classList.toggle('critical', hudClass === 'critical');
            }
        }

        // Count faces by health
        if (companyData.faces) {
            const healthy = companyData.faces.filter(f => (f.faceEnergy || 0) >= 0.7).length;
            const moderate = companyData.faces.filter(f => {
                const energy = f.faceEnergy || 0;
                return energy >= 0.4 && energy < 0.7;
            }).length;
            const critical = companyData.faces.filter(f => (f.faceEnergy || 0) < 0.4).length;

            // Update face count stats (if elements exist)
            const statFacesEl = document.getElementById('statFaces');
            if (statFacesEl) {
                statFacesEl.textContent = `12 (🟢${healthy} 🟡${moderate} 🔴${critical})`;
            }
        }
    };

    // Toggle rotation
    document.getElementById('toggleRotation').addEventListener('click', (e) => {
        autoRotate = !autoRotate;
        e.target.textContent = `Auto-Rotate: ${autoRotate ? 'ON' : 'OFF'}`;
        e.target.classList.toggle('active', autoRotate);
    });

    // ========================================
    // OCTAVE LAYER CREATION & TOGGLE - Phase 3
    // ========================================

    // Create octave layer shells (7 concentric dodecahedra)
    const createOctaveLayers = () => {
        if (octaveLayerGroup) {
            scene.remove(octaveLayerGroup);
        }

        octaveLayerGroup = new THREE.Group();
        const baseRadius = 2; // Same as main dodecahedron

        // Determine current company octave (Quannex = O1, Apex = O6-O7)
        let currentOctave = 1;
        if (currentCompany === 'nova-tech') currentOctave = 3;
        else if (currentCompany === 'zenith-solutions') currentOctave = 4;
        else if (currentCompany === 'apex-industries') currentOctave = 6;

        // Create 7 shells from inner (O1) to outer (O7)
        for (let i = 0; i < 7; i++) {
            const octaveNum = i + 1;
            // Scale: O1 is 1.0, each higher octave is PHI^(i*0.15) larger
            const scale = 1.0 + (i * 0.25); // Linear growth for cleaner visualization
            const radius = baseRadius * scale;

            const geometry = new THREE.DodecahedronGeometry(radius);

            // Higher octaves are more transparent (ghost future states)
            // Current octave highlighted with higher opacity
            let opacity = octaveNum <= currentOctave ? 0.25 : 0.08;
            if (octaveNum === currentOctave) opacity = 0.4; // Highlight current stage

            const material = new THREE.MeshBasicMaterial({
                color: OCTAVE_COLORS[i],
                transparent: true,
                opacity: opacity,
                wireframe: true, // Wireframe for cleaner layered view
                side: THREE.DoubleSide
            });

            const shell = new THREE.Mesh(geometry, material);
            shell.userData.octaveLevel = octaveNum;
            octaveLayerGroup.add(shell);
        }

        scene.add(octaveLayerGroup);
        console.log(`[3D View] 🌈 Created 7 octave layers, current company at O${currentOctave}`);
    };

    // Toggle octave layers visibility
    const toggleOctaveLayersVisibility = () => {
        showOctaveLayers = !showOctaveLayers;

        if (showOctaveLayers) {
            if (!octaveLayerGroup) {
                createOctaveLayers();
            } else {
                scene.add(octaveLayerGroup);
            }
        } else {
            if (octaveLayerGroup) {
                scene.remove(octaveLayerGroup);
            }
        }

        console.log(`[3D View] 🌈 Octave layers: ${showOctaveLayers ? 'ON' : 'OFF'}`);
    };

    // Octave layers toggle button
    const octaveToggleBtn = document.getElementById('toggleOctaveLayers');
    if (octaveToggleBtn) {
        octaveToggleBtn.addEventListener('click', (e) => {
            toggleOctaveLayersVisibility();
            e.target.textContent = `Octave Layers: ${showOctaveLayers ? 'ON' : 'OFF'}`;
            e.target.classList.toggle('active', showOctaveLayers);
        });
    }

    // Update octave layers when company changes
    const updateOctaveLayersForCompany = () => {
        if (showOctaveLayers && octaveLayerGroup) {
            scene.remove(octaveLayerGroup);
            createOctaveLayers();
        }
    };

    // Expose for company switch callback
    window.updateOctaveLayers = updateOctaveLayersForCompany;

    // Company selectors
    document.getElementById('companyQuannex').addEventListener('click', () => switchCompany('quannex'));
    document.getElementById('companyNova').addEventListener('click', () => switchCompany('nova-tech'));
    document.getElementById('companyZenith').addEventListener('click', () => switchCompany('zenith-solutions'));
    document.getElementById('companyApex').addEventListener('click', () => switchCompany('apex-industries'));

    // Close face detail
    document.getElementById('closeFaceDetail').addEventListener('click', closeFaceDetail);

    // Sprint 3.5: Face panel tab switching
    document.querySelectorAll('.face-panel-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const sectionName = tab.dataset.section;

            // Update active tab
            document.querySelectorAll('.face-panel-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update active section
            document.querySelectorAll('.face-panel-section').forEach(section => {
                section.classList.remove('active');
                if (section.dataset.section === sectionName) {
                    section.classList.add('active');
                }
            });

            console.log(`[3D View] 📑 Face panel tab switched to: ${sectionName}`);
        });
    });

    // Dimensional analysis (will link to DNA helix view for sacred geometry)
    const pentagramBtn = document.getElementById('showPentagram');
    if (pentagramBtn) {
        pentagramBtn.addEventListener('click', () => {
            alert('📊 Dimensional Analysis\n\nFor deeper sacred geometry insights (pentagram analysis, elemental harmonics), please visit the DNA Helix visualization tab.\n\nThe dodecahedron view focuses on business metrics and organizational health.');
        });
    }

    // Mouse handlers
    canvas.addEventListener('click', onMouseClick);
    canvas.addEventListener('mousemove', onMouseMove);

    // Close face panel when clicking outside of it
    document.addEventListener('click', (event) => {
        const panel = document.getElementById('faceDetailPanel');
        const closeButton = document.getElementById('closeFaceDetail');

        // Check if panel is visible and click is outside the panel
        if (panel && panel.classList.contains('visible')) {
            // Don't close if:
            // - Click is inside the panel
            // - Click is on the close button
            // - Click is on the canvas (might be opening a different face)
            const isClickOnCanvas = event.target === canvas || event.target.tagName === 'CANVAS';

            if (!panel.contains(event.target) && event.target !== closeButton && !isClickOnCanvas) {
                console.log('🖱️ Click outside panel detected - closing face detail');
                closeFaceDetail();
            }
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeFaceDetail();
            // Also close keyboard hints overlay
            const hints = document.getElementById('keyboardHints');
            if (hints && hints.classList.contains('visible')) {
                hints.classList.remove('visible');
            }
        }

        // 'R' key - Reset camera view
        if (e.key === 'r' || e.key === 'R') {
            resetCameraView();
        }

        // 'Space' - Toggle global animation pause (Sprint 3.5 enhanced)
        if (e.key === ' ' && e.target === document.body) {
            e.preventDefault(); // Prevent page scroll
            animationsPaused = !animationsPaused;

            // Show pause indicator
            const pauseIndicator = document.getElementById('pauseIndicator');
            if (pauseIndicator) {
                if (animationsPaused) {
                    pauseIndicator.classList.add('visible');
                } else {
                    pauseIndicator.classList.remove('visible');
                }
            }

            // Also pause auto-rotation when animations are paused
            if (animationsPaused && autoRotate) {
                autoRotate = false;
                const toggleBtn = document.getElementById('toggleRotation');
                if (toggleBtn) {
                    toggleBtn.textContent = 'Auto-Rotate: OFF';
                    toggleBtn.classList.remove('active');
                }
            }

            console.log(`[3D View] ⏸️ All animations: ${animationsPaused ? 'PAUSED' : 'PLAYING'}`);
        }

        // 'A' key - Toggle auto-rotation only (separate from global pause)
        if (e.key === 'a' || e.key === 'A') {
            if (!animationsPaused) {
                autoRotate = !autoRotate;
                const toggleBtn = document.getElementById('toggleRotation');
                if (toggleBtn) {
                    toggleBtn.textContent = `Auto-Rotate: ${autoRotate ? 'ON' : 'OFF'}`;
                    toggleBtn.classList.toggle('active', autoRotate);
                }
                console.log(`[3D View] 🔄 Auto-rotate: ${autoRotate ? 'ON' : 'OFF'}`);
            }
        }

        // Phase 4: 'O' key - Toggle octave layers
        if (e.key === 'o' || e.key === 'O') {
            const octaveBtn = document.getElementById('toggleOctaveLayers');
            if (octaveBtn) {
                octaveBtn.click();
            }
        }

        // Phase 4: 'D' key - Navigate to DNA Helix view
        if (e.key === 'd' || e.key === 'D') {
            // Open DNA helix visualization in new tab
            window.open('octave-dna.html', '_blank');
        }

        // Phase 5: 'P' key - Toggle presentation mode (thesis defense)
        if (e.key === 'p' || e.key === 'P') {
            document.body.classList.toggle('presentation-mode');
            const isPresentation = document.body.classList.contains('presentation-mode');
            console.log(`[3D View] 🎤 Presentation mode: ${isPresentation ? 'ON' : 'OFF'}`);
        }

        // Sprint 3.5: 'L' key - Cycle font scale levels (Normal → Large → XLarge → Normal)
        if (e.key === 'l' || e.key === 'L') {
            const fontScales = ['normal', 'large', 'xlarge'];
            const fontScaleLabels = { normal: 'NORMAL', large: 'LARGE', xlarge: 'X-LARGE' };

            // Find current scale
            let currentIndex = 0;
            fontScales.forEach((scale, index) => {
                if (document.body.classList.contains(`font-scale-${scale}`)) {
                    currentIndex = index;
                }
            });

            // Remove current scale class
            fontScales.forEach(scale => {
                document.body.classList.remove(`font-scale-${scale}`);
            });

            // Apply next scale (cycle)
            const nextIndex = (currentIndex + 1) % fontScales.length;
            const nextScale = fontScales[nextIndex];
            document.body.classList.add(`font-scale-${nextScale}`);

            // Update and show indicator
            const indicator = document.getElementById('fontScaleIndicator');
            if (indicator) {
                indicator.textContent = `FONT: ${fontScaleLabels[nextScale]}`;
                indicator.classList.add('visible');
                indicator.classList.remove('fade-out');

                // Auto-hide after 2 seconds
                clearTimeout(indicator._hideTimeout);
                indicator._hideTimeout = setTimeout(() => {
                    indicator.classList.add('fade-out');
                    setTimeout(() => {
                        indicator.classList.remove('visible', 'fade-out');
                    }, 300);
                }, 2000);
            }

            console.log(`[3D View] 📏 Font scale: ${nextScale.toUpperCase()}`);
        }

        // Sprint 3.5: 'C' key - Toggle high-contrast mode (for projectors)
        if (e.key === 'c' || e.key === 'C') {
            document.body.classList.toggle('high-contrast');
            const isHighContrast = document.body.classList.contains('high-contrast');

            // Update and show indicator
            const indicator = document.getElementById('contrastIndicator');
            if (indicator) {
                indicator.textContent = `HIGH CONTRAST: ${isHighContrast ? 'ON' : 'OFF'}`;
                indicator.classList.add('visible');
                indicator.classList.remove('fade-out');

                // Auto-hide after 2 seconds
                clearTimeout(indicator._hideTimeout);
                indicator._hideTimeout = setTimeout(() => {
                    indicator.classList.add('fade-out');
                    setTimeout(() => {
                        indicator.classList.remove('visible', 'fade-out');
                    }, 300);
                }, 2000);
            }

            console.log(`[3D View] 🎨 High contrast: ${isHighContrast ? 'ON' : 'OFF'}`);
        }

        // Sprint 3.5: 'H' key - Toggle keyboard hints overlay
        if (e.key === 'h' || e.key === 'H') {
            const hints = document.getElementById('keyboardHints');
            if (hints) {
                hints.classList.toggle('visible');
                console.log(`[3D View] ⌨️ Keyboard hints: ${hints.classList.contains('visible') ? 'SHOWN' : 'HIDDEN'}`);
            }
        }

        // Sprint 3.5: 'F' key - Toggle fullscreen mode
        if (e.key === 'f' || e.key === 'F') {
            // Don't trigger when typing in input fields
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            if (!document.fullscreenElement) {
                // Enter fullscreen
                document.documentElement.requestFullscreen().then(() => {
                    console.log('[3D View] 🖥️ Fullscreen: ENTERED');
                }).catch(err => {
                    console.warn('[3D View] Fullscreen not supported:', err.message);
                });
            } else {
                // Exit fullscreen
                document.exitFullscreen().then(() => {
                    console.log('[3D View] 🖥️ Fullscreen: EXITED');
                }).catch(err => {
                    console.warn('[3D View] Exit fullscreen failed:', err.message);
                });
            }
        }

        // Sprint 3.5: Shift+R - Open Results Summary Report
        if ((e.key === 'r' || e.key === 'R') && e.shiftKey) {
            // Don't trigger when typing in input fields
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            e.preventDefault();

            // Open results summary in new tab
            window.open('results-summary.html', '_blank');
            console.log('[3D View] 📊 Opening Results Summary Report');
        }
    });

    // ========================================
    // ANIMATION LOOP
    // ========================================

    const animate = () => {
        requestAnimationFrame(animate);

        // Sprint 3.5: Skip time-based animations when paused
        // (Still render the scene, just don't update time-based effects)
        const time = animationsPaused ? (window._pausedTime || 0) : Date.now() * 0.001;
        if (!animationsPaused) {
            window._pausedTime = time; // Store last time for when we pause
        }

        // Auto-rotate the main dodecahedron and edges (only when not interacting and not paused)
        // Note: faceMeshes are children of mainDodecahedron, so they rotate automatically
        if (autoRotate && !isUserInteracting && !animationsPaused) {
            if (window.mainDodecahedron) {
                window.mainDodecahedron.rotation.y += 0.003;
            }
            edgeLines.forEach(line => {
                line.rotation.y += 0.003;
            });
            // Rotate octave layers in sync (Phase 3)
            if (octaveLayerGroup) {
                octaveLayerGroup.rotation.y += 0.003;
            }
        }

        // ========================================
        // PHI-TUNED CRITICAL FACE PULSING
        // Golden ratio timing for natural rhythm
        // Skip pulsing when animations are paused
        // ========================================
        const materials = window.dodecahedronMaterials;
        if (materials && faceMeshes && !animationsPaused) {
            faceMeshes.forEach((mesh, index) => {
                const faceData = mesh.userData.faceData;
                if (faceData && materials[index]) {
                    const energy = faceData.faceEnergy || 0;

                    // Very low energy (below 10%) - URGENT warning
                    // Phi-tuned fast pulse with color shift to danger red
                    if (energy < 0.1) {
                        const urgentPulse = Math.sin(time * PHI * 2) * 0.3 + 0.7; // φ-tuned
                        materials[index].emissiveIntensity = 0.7 * urgentPulse;
                        // Shift emissive toward danger red
                        const warningRed = new THREE.Color(0xff2200);
                        const baseEmissive = materials[index].userData.baseEmissive || materials[index].emissive.clone();
                        if (!materials[index].userData.baseEmissive) {
                            materials[index].userData.baseEmissive = materials[index].emissive.clone();
                        }
                        materials[index].emissive.lerpColors(baseEmissive, warningRed, 0.5 + 0.3 * Math.sin(time * PHI * 3));
                    }
                    // Critical faces (10-40%) - Warning pulse
                    // Phi-tuned moderate pulse with subtle color warming
                    else if (energy < 0.4) {
                        const criticalPulse = Math.sin(time * PHI) * 0.2 + 0.8; // Slower φ-tuned pulse
                        materials[index].emissiveIntensity = 0.5 * criticalPulse;
                        // Subtle shift toward warm orange
                        const warningOrange = new THREE.Color(0xff8800);
                        const baseEmissive = materials[index].userData.baseEmissive || materials[index].emissive.clone();
                        if (!materials[index].userData.baseEmissive) {
                            materials[index].userData.baseEmissive = materials[index].emissive.clone();
                        }
                        materials[index].emissive.lerpColors(baseEmissive, warningOrange, 0.2 + 0.1 * Math.sin(time * PHI * 2));
                    }
                    // TRANSCENDENCE READY - Golden glow for faces ready to advance
                    // Energy >= θ (theta threshold from tuning config)
                    else {
                        const tuning = window.Quannex ? window.Quannex.exportTuning() : null;
                        const theta = tuning ? tuning.theta : 0.618;

                        if (energy >= theta) {
                            // Golden transcendence glow - gentle phi-tuned pulse
                            const transcendencePulse = Math.sin(time * PHI * 0.5) * 0.15 + 0.85; // Slow, majestic
                            materials[index].emissiveIntensity = 0.6 * transcendencePulse;

                            // Radiant golden color (φ-derived warmth)
                            const goldenColor = new THREE.Color(0xffd700);
                            const baseEmissive = materials[index].userData.baseEmissive || materials[index].emissive.clone();
                            if (!materials[index].userData.baseEmissive) {
                                materials[index].userData.baseEmissive = materials[index].emissive.clone();
                            }
                            // Subtle golden shimmer
                            const shimmer = 0.3 + 0.15 * Math.sin(time * PHI * 1.5);
                            materials[index].emissive.lerpColors(baseEmissive, goldenColor, shimmer);
                        }
                        // Healthy faces - restore base emissive if previously shifted
                        else if (materials[index].userData.baseEmissive) {
                            materials[index].emissive.copy(materials[index].userData.baseEmissive);
                            materials[index].emissiveIntensity = 0.3;
                        }
                    }
                }
            });
        }

        // Pulse Vertex Spheres (Advanced Visualization)
        // Phi-tuned for harmonic resonance with face pulsing
        // Skip pulsing when animations are paused
        if (window.vertexSpheres && !animationsPaused) {
            window.vertexSpheres.forEach(sphere => {
                if (sphere.userData.isPulsing) {
                    const phase = sphere.userData.pulsePhase || 0;
                    // Phi-tuned pulse: 3 * PHI ≈ 4.854 creates pleasing ratio with face pulse
                    const scale = 1 + Math.sin(time * PHI * 3 + phase) * 0.3;
                    sphere.scale.setScalar(scale);
                }
            });
        }

        controls.update();
        renderer.render(scene, camera);
    };

    // ========================================
    // WINDOW RESIZE
    // ========================================

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // ========================================
    // INITIALIZATION
    // ========================================

    const init = async () => {
        console.log('🔷 Initializing 3D Dodecahedron Visualization...');

        // Load company data
        const loaded = await loadQuannexEngine();

        if (loaded) {
            // Create geometry
            createDodecahedron();

            // Update visualization
            updateVisualization();
            updateStats();

            // Hide loading
            document.getElementById('loading').style.display = 'none';

            // Start animation
            animate();

            console.log('✅ 3D Dodecahedron initialized successfully!');
        } else {
            document.getElementById('loading').innerHTML = '<div class="loading-text">⚠️ Error loading data</div>';
        }
    };

    // Start initialization
    init();

    // ========================================
    // SHADOW PANEL INTEGRATION
    // Focus on face when shadow card is clicked
    // ========================================
    window.addEventListener('focus-face', (event) => {
        const { faceId } = event.detail || {};
        if (!faceId) {
            console.warn('[3D View] focus-face event received without faceId');
            return;
        }

        console.log(`[3D View] Focusing on face ${faceId} from shadow panel`);

        // Find the face mesh with matching faceId (faceId is 1-indexed, array is 0-indexed)
        const targetFaceIndex = faceMeshes.findIndex(mesh =>
            mesh.userData.faceId === faceId || mesh.userData.faceData?.id === faceId
        );

        if (targetFaceIndex !== -1) {
            // Get camera position for this face
            const cameraTarget = getCameraPositionForFace(targetFaceIndex);
            if (cameraTarget) {
                // Pause auto-rotation during focus
                const wasAutoRotating = autoRotate;
                autoRotate = false;

                // Animate camera to face
                animateCameraTo(cameraTarget.position, cameraTarget.lookAt, 1200);

                // Resume auto-rotation after animation
                setTimeout(() => {
                    autoRotate = wasAutoRotating;
                }, 1500);
            }

            // Store selected face and show detail panel
            selectedFace = faceMeshes[targetFaceIndex].userData.faceData;
            if (selectedFace) {
                showFaceDetail(selectedFace);
            }
        } else {
            console.warn(`[3D View] Face ${faceId} not found in faceMeshes`);
        }
    });

    // Export for debugging and external access
    window.dodecahedronViz = {
        scene,
        camera,
        faceMeshes,
        companyData,
        switchCompany,
        updateVisualization,
        // Shadow highlighting functions
        highlightShadowFaces,
        clearShadowHighlights,
        // Shadow data access
        getShadowPatterns: () => {
            const state = window.Quannex?.getState?.() || window.quannexEngine?.getState?.();
            return state?.shadowPatterns || [];
        },
        // Focus on face programmatically
        focusOnFace: (faceId) => {
            window.dispatchEvent(new CustomEvent('focus-face', { detail: { faceId } }));
        }
    };

    // Export scene and camera globally for unified HTML mode system
    window.scene = scene;
    window.camera = camera;
    window.renderer = renderer;

    // Export refreshVisualization globally (used by parent window communication)
    window.refreshVisualization = () => {
        updateVisualization();
        updateEdgeData(); // Sprint 3 Fix: Update edge tooltips with sessionStorage data
        updateStats();
        console.log('✅ Visualization refreshed (faces + edges)');
    };

    console.log('✅ 3D Dodecahedron initialized successfully!');
} // End of initDodecahedron() function


