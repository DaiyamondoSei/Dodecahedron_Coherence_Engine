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
    const phi = (1 + Math.sqrt(5)) / 2;
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

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xffffff, 0.8);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x00ffcc, 0.3);
    pointLight2.position.set(-5, -5, -5);
    scene.add(pointLight2);

    // ========================================
    // DATA MANAGEMENT
    // ========================================

    let currentCompany = 'quannex';
    let companyData = null;
    let faceMeshes = [];
    let edgeLines = [];
    let autoRotate = false; // Start with manual control
    // Note: isUserInteracting and interactionTimeout are declared earlier before OrbitControls initialization

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

            // If CompanyLoader available, load default company
            if (window.CompanyLoader) {
                await window.CompanyLoader.loadCompany('quannex');
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

            await window.CompanyLoader.switchCompany(companyId);

            // Get fresh state from whichever engine is available
            const engine = window.Quannex || window.quannexEngine;
            if (engine) {
                companyData = engine.getState();
            }

            updateVisualization();
            updateStats();

            console.log(`✅ Switched to ${companyId} - ${companyData?.faces?.length || 0} faces loaded`);
        } catch (error) {
            console.error(`❌ Error switching to ${companyId}:`, error);
        }
    };

    // ========================================
    // GEOMETRY CREATION
    // ========================================

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

        // Create edges
        const edgesGeometry = new THREE.EdgesGeometry(baseGeometry);
        const edgesMaterial = new THREE.LineBasicMaterial({
            color: 0x00ffcc,
            linewidth: 2,
            transparent: true,
            opacity: 0.4
        });
        const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
        scene.add(edges);
        edgeLines.push(edges);

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

                edgeTooltip.innerHTML = `
                <div style="font-weight: 600; margin-bottom: 4px; font-size: 12px;">${edgeName}</div>
                <div style="font-size: 11px; opacity: 0.8;">
                    Tension: <span style="color: ${edgeData.color}">${tensionPercent}%</span> (${healthStatus})
                </div>
                <div style="font-size: 10px; opacity: 0.6; margin-top: 2px;">
                    ${edgeData.element} • Click for details
                </div>
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

                    const edgeItem = document.createElement('div');
                    edgeItem.className = 'metric-row';
                    edgeItem.style.fontSize = '11px';
                    edgeItem.innerHTML = `
                    <span class="metric-label" style="flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">→ ${otherFaceName}</span>
                    <span class="metric-value ${tensionClass}" style="white-space: nowrap;">${tensionPercent}%${contextIndicator}</span>
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
                    const archetype = vertex.archetype || 'Unknown';
                    const vortexStrength = vertex.vortexStrength || 0;
                    const vortexDirection = vertex.vortexDirection || 0;
                    const strengthPercent = Math.round(vortexStrength * 100);

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

                    const vertexItem = document.createElement('div');
                    vertexItem.className = 'metric-row';
                    vertexItem.style.marginBottom = '8px';
                    vertexItem.innerHTML = `
                    <span class="metric-label">${directionIcon} V${vertex.id}: ${archetype}</span>
                    <span class="metric-value">${strengthPercent}% • ${directionLabel}</span>
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
                faceShadows.forEach(shadow => {
                    const shadowItem = document.createElement('div');
                    shadowItem.className = 'metric-row';
                    shadowItem.style.marginBottom = '8px';
                    shadowItem.style.borderLeft = '3px solid #ff4444';
                    shadowItem.style.paddingLeft = '8px';
                    shadowItem.innerHTML = `
                    <div style="font-weight: bold; color: #ff8888; font-size: 11px;">${shadow.name}</div>
                    <div style="font-size: 10px; opacity: 0.8;">${shadow.description}</div>
                `;
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

    // Company selectors
    document.getElementById('companyQuannex').addEventListener('click', () => switchCompany('quannex'));
    document.getElementById('companyNova').addEventListener('click', () => switchCompany('nova-tech'));
    document.getElementById('companyZenith').addEventListener('click', () => switchCompany('zenith-solutions'));
    document.getElementById('companyApex').addEventListener('click', () => switchCompany('apex-industries'));

    // Close face detail
    document.getElementById('closeFaceDetail').addEventListener('click', closeFaceDetail);

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
        }

        // 'R' key - Reset camera view
        if (e.key === 'r' || e.key === 'R') {
            resetCameraView();
        }

        // 'Space' - Toggle auto-rotation
        if (e.key === ' ' && e.target === document.body) {
            e.preventDefault(); // Prevent page scroll
            autoRotate = !autoRotate;
            const toggleBtn = document.getElementById('toggleRotation');
            if (toggleBtn) {
                toggleBtn.textContent = `Auto-Rotate: ${autoRotate ? 'ON' : 'OFF'}`;
                toggleBtn.classList.toggle('active', autoRotate);
            }
        }
    });

    // ========================================
    // ANIMATION LOOP
    // ========================================

    const animate = () => {
        requestAnimationFrame(animate);

        const time = Date.now() * 0.001; // Time in seconds

        // Auto-rotate the main dodecahedron and edges (only when not interacting)
        // Note: faceMeshes are children of mainDodecahedron, so they rotate automatically
        if (autoRotate && !isUserInteracting) {
            if (window.mainDodecahedron) {
                window.mainDodecahedron.rotation.y += 0.003;
            }
            edgeLines.forEach(line => {
                line.rotation.y += 0.003;
            });
        }

        // Pulse critical faces for attention
        const materials = window.dodecahedronMaterials;
        if (materials && faceMeshes) {
            faceMeshes.forEach((mesh, index) => {
                const faceData = mesh.userData.faceData;
                if (faceData && materials[index]) {
                    const energy = faceData.faceEnergy || 0;

                    // Pulse critical faces (below 40%)
                    if (energy < 0.4) {
                        const pulse = Math.sin(time * 2) * 0.2 + 0.8; // Oscillates 0.6-1.0
                        materials[index].emissiveIntensity = 0.5 * pulse;
                    }
                    // Very slow pulse for very low energy (below 10%)
                    else if (energy < 0.1) {
                        const slowPulse = Math.sin(time * 1) * 0.3 + 0.7; // Slow oscillation
                        materials[index].emissiveIntensity = 0.6 * slowPulse;
                    }
                }
            });
        }

        // Pulse Vertex Spheres (Advanced Visualization)
        if (window.vertexSpheres) {
            window.vertexSpheres.forEach(sphere => {
                if (sphere.userData.isPulsing) {
                    const phase = sphere.userData.pulsePhase || 0;
                    const scale = 1 + Math.sin(time * 3 + phase) * 0.3; // Faster pulse for vertices
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

    // Export for debugging and external access
    window.dodecahedronViz = {
        scene,
        camera,
        faceMeshes,
        companyData,
        switchCompany,
        updateVisualization
    };

    // Export scene and camera globally for unified HTML mode system
    window.scene = scene;
    window.camera = camera;
    window.renderer = renderer;

    // Export refreshVisualization globally (used by parent window communication)
    window.refreshVisualization = () => {
        updateVisualization();
        updateStats();
        console.log('✅ Visualization refreshed');
    };

    console.log('✅ 3D Dodecahedron initialized successfully!');
} // End of initDodecahedron() function


