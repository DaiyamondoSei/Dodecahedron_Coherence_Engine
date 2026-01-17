/**
 * ============================================================================
 * CONSTELLATION-DODECAHEDRON.JS - Sacred Geometry Written in Starlight
 * ============================================================================
 *
 * Part of: Quannex Welcome Experience
 * Purpose: Renders the dodecahedron as a hidden constellation revealed by
 *          the cursor acting as a lamp/spotlight. Vertices are star clusters
 *          that gather when illuminated - like cosmic gravity wells.
 *
 * Architecture:
 * - Uses Three.js for 3D rendering
 * - LAMP EFFECT: Cursor acts as spotlight revealing hidden geometry
 * - STAR CLUSTERS: 10 particles per vertex that gather/scatter
 * - EDGES: 30 edge lines revealed by lamp proximity
 * - PENTAGRAMS: 60 sacred geometry lines within faces
 * - Responds to mouse with magnetic lean and parallax
 *
 * ============================================================================
 * NOTES FOR FUTURE CLAUDE
 * ============================================================================
 *
 * This module creates the sacred geometry centerpiece. Key concepts:
 *
 * 1. LAMP EFFECT: Everything starts hidden (opacity 0). The cursor acts as
 *    a lamp that reveals geometry based on proximity. This creates a sense
 *    of discovery as users explore the sacred geometry.
 *
 * 2. STAR CLUSTER VERTICES: Each of the 20 vertices is a cluster of 10
 *    tiny star particles (200 total). When the lamp is far, stars scatter
 *    outward blending with the background starfield. When the lamp
 *    approaches, stars GATHER inward with spiraling motion, forming tight
 *    clusters - like gravitational centers collecting stellar energy.
 *
 * 3. GATHERING ANIMATION: Stars spiral inward (not straight lines) when
 *    gathering, with phi-based timing. Gathered clusters slowly rotate.
 *    Scattering is slower than gathering (asymmetric, organic feel).
 *
 * 4. EDGE & PENTAGRAM REVEAL: The 30 edges and 60 pentagram lines fade in
 *    based on lamp proximity to their midpoints/centroids.
 *
 * 5. MAGNETIC LEAN: The whole constellation tilts toward cursor position.
 *
 * The dodecahedron represents organizational wholeness - 12 faces for
 * 12 organizational domains. Vertices are convergence points where three
 * domains meet, represented as gathering star clusters.
 *
 * Integration: Works alongside starfield.js - both respond to same mouse
 * coordinates for unified cosmic interaction.
 *
 * ============================================================================
 */

const ConstellationDodecahedron = (function () {
    'use strict';

    // ========================================================================
    // SACRED CONSTANTS
    // ========================================================================

    const PHI = 1.618033988749895;  // Golden ratio
    const PHI_INVERSE = 0.618033988749895;

    // ========================================================================
    // CONFIGURATION
    // ========================================================================

    const CONFIG = {
        // Geometry
        geometry: {
            radius: 1.5,
            detail: 0                   // 0 = standard dodecahedron
        },

        // Visual appearance
        appearance: {
            // Vertex star clusters (stars gather when lamp approaches)
            vertex: {
                // Cluster configuration
                cluster: {
                    particleCount: 10,          // Stars per vertex (10 x 20 vertices = 200 total)
                    scatteredRadius: 0.35,      // How far stars scatter (blends with background)
                    gatheredRadius: 0.06,       // How tight the cluster forms

                    // Individual star properties
                    starSize: 0.015,            // Size of each star particle
                    starSizeVariation: 0.5,     // Random size variation (0.5 = 50% to 150%)

                    // Colors
                    coreColor: 0xffffff,        // Bright white for core stars
                    glowColor: 0x00ffcc,        // Teal for outer stars
                    coreRatio: 0.3,             // 30% of stars are bright white cores

                    // Animation
                    gatherSpeed: 0.08,          // How fast stars gather (lerp factor)
                    scatterSpeed: 0.04,         // How fast stars scatter (slower, dreamy)
                    orbitSpeed: 0.3,            // Rotation speed when gathered
                    twinkleSpeed: 2.0,          // Individual twinkle rate

                    // Spiral gathering effect
                    spiralIntensity: 0.5,       // How much stars spiral inward (vs straight)
                    spiralRotations: 0.75       // Partial rotation during gather
                },
                maxDistance: 1.8                // Lamp radius for vertices
            },

            // Edge connections (lamp reveals them)
            edges: {
                color: 0x00ffcc,
                baseOpacity: 0,         // Hidden until lamp approaches
                maxOpacity: 0.25,       // Subtle glow in lamp light
                lineWidth: 1,
                maxDistance: 1.5        // Lamp radius for edges
            },

            // Solid fill (hidden - lamp reveals it)
            solid: {
                color: 0x00ffcc,
                baseOpacity: 0,         // Hidden until lamp approaches
                maxOpacity: 0.03        // Very subtle even when revealed
            },

            // Pentagram lines (sacred geometry within faces)
            pentagram: {
                color: 0x00ffcc,
                baseOpacity: 0,             // Hidden by default
                maxOpacity: 0.4,            // Full reveal opacity
                maxDistance: 1.2            // Proximity distance for reveal
            }
        },

        // Animation
        animation: {
            // Base rotation (meditative, slow)
            rotation: {
                x: { speed: 0.1, amplitude: 0.1, offset: 0 },
                y: { speed: 0.15, amplitude: 0, offset: 1 }
            },

            // Breathing effect (phi-based)
            breathing: {
                speed: 2,               // Cycles per second * phi
                intensity: 0.05         // Opacity variation
            },

            // Interpolation smoothness
            lerpFactor: 0.08
        },

        // Mouse interaction
        mouse: {
            // Magnetic lean toward cursor
            lean: {
                x: 0.15,                // Tilt intensity on X axis
                y: 0.2                  // Tilt intensity on Y axis
            },

            // Proximity detection for vertex glow
            proximity: {
                maxDistance: 1.5        // Max distance for glow effect
            },

            // Scale response
            scale: {
                base: 1.0,
                edgeBonus: 0.08         // Extra scale at screen edges
            }
        },

        // Camera
        camera: {
            fov: 45,
            near: 0.1,
            far: 1000,
            z: 5,
            parallaxIntensity: 0.3
        }
    };

    // ========================================================================
    // STATE
    // ========================================================================

    let canvas = null;
    let renderer = null;
    let scene = null;
    let camera = null;

    // Mesh groups
    let dodecahedronGroup = null;
    let vertexMeshes = [];
    let edgeLines = [];       // Stores {line, midpoint} for lamp reveal
    let pentagramLines = [];  // Stores {line, centroid} for proximity detection

    // Materials (stored for animation updates)
    let wireframeMaterial = null;
    let solidMaterial = null;

    // Animation state
    let time = 0;
    let isRunning = false;
    let animationId = null;

    // Mouse state with smoothing
    const mouse = {
        raw: { x: 0, y: 0 },
        smoothed: { x: 0, y: 0 },
        target: {
            rotationX: 0,
            rotationY: 0,
            scale: 1
        },
        current: {
            rotationX: 0,
            rotationY: 0,
            scale: 1
        }
    };

    // Raycaster for proximity detection
    let raycaster = null;
    let mouseVector = null;

    // ========================================================================
    // INITIALIZATION
    // ========================================================================

    /**
     * Initialize the constellation dodecahedron
     * @param {string} canvasId - ID of the canvas element
     * @returns {Object} Public API
     */
    function init(canvasId = 'dodecahedron-canvas') {
        canvas = document.getElementById(canvasId);

        if (!canvas) {
            Logger.error('Constellation', `Canvas #${canvasId} not found`);
            return null;
        }

        setupRenderer();
        setupScene();
        setupCamera();
        setupRaycaster();
        createDodecahedron();
        setupEventListeners();

        Logger.info('Constellation', 'Initialized');
        return API;
    }

    /**
     * Setup Three.js renderer
     */
    function setupRenderer() {
        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true               // Transparent background
        });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    /**
     * Setup scene
     */
    function setupScene() {
        scene = new THREE.Scene();
    }

    /**
     * Setup camera
     */
    function setupCamera() {
        const aspect = window.innerWidth / window.innerHeight;
        camera = new THREE.PerspectiveCamera(
            CONFIG.camera.fov,
            aspect,
            CONFIG.camera.near,
            CONFIG.camera.far
        );
        camera.position.z = CONFIG.camera.z;
    }

    /**
     * Setup raycaster for proximity detection
     */
    function setupRaycaster() {
        raycaster = new THREE.Raycaster();
        mouseVector = new THREE.Vector2();
    }

    // ========================================================================
    // GEOMETRY CREATION
    // ========================================================================

    /**
     * Create the complete dodecahedron constellation
     */
    function createDodecahedron() {
        // Create unified group for all elements
        dodecahedronGroup = new THREE.Group();
        scene.add(dodecahedronGroup);

        // Create geometry
        const geometry = new THREE.DodecahedronGeometry(
            CONFIG.geometry.radius,
            CONFIG.geometry.detail
        );

        // Create individual edge lines (lamp reveals them)
        createEdgeLines(geometry);

        // Create solid fill (very subtle - also hidden until lamp)
        createSolidFill(geometry);

        // Create pentagram lines (sacred geometry within each face)
        createPentagrams(geometry);

        // Create vertex stars (lamp reveals them)
        createVertexStars(geometry);
    }

    /**
     * Create pentagram lines within each pentagonal face
     *
     * A dodecahedron has 12 pentagonal faces. Each pentagon has a pentagram
     * (5-pointed star) inscribed within it, formed by connecting each vertex
     * to the two non-adjacent vertices.
     *
     * PROXIMITY REVEAL: Pentagram lines start invisible and reveal themselves
     * when the cursor approaches their face. This creates a sense of discovery
     * as users explore the sacred geometry.
     */
    function createPentagrams(geometry) {
        // Reset pentagram lines array
        pentagramLines = [];

        // Extract unique vertices from geometry
        const positions = geometry.attributes.position;
        const vertices = [];
        const vertexMap = new Map();

        for (let i = 0; i < positions.count; i++) {
            const x = parseFloat(positions.getX(i).toFixed(5));
            const y = parseFloat(positions.getY(i).toFixed(5));
            const z = parseFloat(positions.getZ(i).toFixed(5));
            const key = `${x},${y},${z}`;

            if (!vertexMap.has(key)) {
                vertexMap.set(key, vertices.length);
                vertices.push(new THREE.Vector3(x, y, z));
            }
        }

        // Define the 12 pentagonal faces by vertex indices
        const faces = getDodecahedronFaces(vertices);

        // For each pentagonal face, create the 5 pentagram diagonals
        let pentagramLineCount = 0;
        faces.forEach((faceIndices, faceIndex) => {
            if (faceIndices.length !== 5) {
                Logger.warn('Constellation', `Face ${faceIndex} has ${faceIndices.length} vertices, expected 5`);
                return;
            }

            // Calculate face centroid for proximity detection
            const centroid = new THREE.Vector3();
            faceIndices.forEach(idx => centroid.add(vertices[idx]));
            centroid.divideScalar(5);

            // Connect each vertex to the two non-adjacent vertices (skip one on each side)
            // Pentagon vertices: 0, 1, 2, 3, 4
            // Pentagram connections: 0-2, 1-3, 2-4, 3-0, 4-1
            for (let i = 0; i < 5; i++) {
                const startIdx = faceIndices[i];
                const endIdx = faceIndices[(i + 2) % 5];  // Skip one vertex

                // Each line gets its own material so we can animate opacity individually
                const lineMaterial = new THREE.LineBasicMaterial({
                    color: CONFIG.appearance.pentagram.color,
                    transparent: true,
                    opacity: CONFIG.appearance.pentagram.baseOpacity  // Start hidden
                });

                const lineGeometry = new THREE.BufferGeometry();
                const linePositions = new Float32Array([
                    vertices[startIdx].x, vertices[startIdx].y, vertices[startIdx].z,
                    vertices[endIdx].x, vertices[endIdx].y, vertices[endIdx].z
                ]);
                lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

                const line = new THREE.Line(lineGeometry, lineMaterial);
                dodecahedronGroup.add(line);

                // Store reference with centroid for proximity detection
                pentagramLines.push({
                    line: line,
                    centroid: centroid.clone(),
                    faceIndex: faceIndex
                });

                pentagramLineCount++;
            }
        });

        Logger.info('Constellation', `Created ${pentagramLineCount} pentagram lines across ${faces.length} faces (hidden until cursor approaches)`);
    }

    /**
     * Get the 12 pentagonal faces of a dodecahedron
     *
     * This reconstructs the original pentagonal faces from the vertex positions.
     * A dodecahedron has 12 faces, each a regular pentagon.
     */
    function getDodecahedronFaces(vertices) {
        // For a dodecahedron with radius r, vertices lie at specific positions
        // defined by the golden ratio. We need to find which 5 vertices form each face.

        // Strategy: Find all faces by identifying coplanar vertex groups
        // Each face has 5 vertices that lie on the same plane

        const faces = [];
        const usedVertexSets = new Set();
        const epsilon = 0.01;  // Slightly larger epsilon for floating point tolerance

        // For each triplet of vertices, compute the plane and find all 5 coplanar vertices
        for (let i = 0; i < vertices.length; i++) {
            for (let j = i + 1; j < vertices.length; j++) {
                for (let k = j + 1; k < vertices.length; k++) {
                    // Compute plane normal from three points
                    const v1 = vertices[j].clone().sub(vertices[i]);
                    const v2 = vertices[k].clone().sub(vertices[i]);
                    const normal = v1.cross(v2);

                    if (normal.length() < epsilon) continue;  // Collinear points
                    normal.normalize();

                    // Find all vertices on this plane
                    const d = -normal.dot(vertices[i]);
                    const coplanarIndices = [];

                    for (let m = 0; m < vertices.length; m++) {
                        const dist = Math.abs(normal.dot(vertices[m]) + d);
                        if (dist < epsilon) {
                            coplanarIndices.push(m);
                        }
                    }

                    // A pentagon has exactly 5 vertices
                    if (coplanarIndices.length === 5) {
                        // Create a unique key for this face (sorted indices)
                        // This ensures we don't add the same face twice regardless of normal direction
                        const faceKey = coplanarIndices.slice().sort((a, b) => a - b).join(',');

                        if (!usedVertexSets.has(faceKey)) {
                            usedVertexSets.add(faceKey);

                            // Order vertices around the pentagon (counterclockwise)
                            const orderedIndices = orderPentagonVertices(vertices, coplanarIndices);
                            faces.push(orderedIndices);

                            // Early exit if we found all 12 faces
                            if (faces.length === 12) {
                                Logger.info('Constellation', `Found all ${faces.length} pentagonal faces`);
                                return faces;
                            }
                        }
                    }
                }
            }
        }

        Logger.info('Constellation', `Found ${faces.length} pentagonal faces`);
        return faces;
    }

    /**
     * Order 5 vertices of a pentagon counterclockwise
     */
    function orderPentagonVertices(vertices, indices) {
        // Find centroid
        const centroid = new THREE.Vector3();
        indices.forEach(i => centroid.add(vertices[i]));
        centroid.divideScalar(5);

        // Get plane normal (centroid to origin direction works for centered dodecahedron)
        const normal = centroid.clone().normalize();

        // Create local coordinate system on the pentagon plane
        const tempVec = Math.abs(normal.x) < 0.9
            ? new THREE.Vector3(1, 0, 0)
            : new THREE.Vector3(0, 1, 0);
        const xAxis = tempVec.cross(normal).normalize();
        const yAxis = normal.clone().cross(xAxis);

        // Calculate angle of each vertex relative to centroid
        const angles = indices.map(i => {
            const toVertex = vertices[i].clone().sub(centroid);
            const x = toVertex.dot(xAxis);
            const y = toVertex.dot(yAxis);
            return { index: i, angle: Math.atan2(y, x) };
        });

        // Sort by angle (counterclockwise)
        angles.sort((a, b) => a.angle - b.angle);

        return angles.map(a => a.index);
    }

    /**
     * Create individual edge lines (for lamp reveal effect)
     *
     * Instead of a wireframe mesh, we create individual line segments
     * so each edge can be independently revealed by the cursor lamp.
     */
    function createEdgeLines(geometry) {
        edgeLines = [];

        // Extract unique vertices
        const positions = geometry.attributes.position;
        const vertices = [];
        const vertexMap = new Map();

        for (let i = 0; i < positions.count; i++) {
            const x = parseFloat(positions.getX(i).toFixed(5));
            const y = parseFloat(positions.getY(i).toFixed(5));
            const z = parseFloat(positions.getZ(i).toFixed(5));
            const key = `${x},${y},${z}`;

            if (!vertexMap.has(key)) {
                vertexMap.set(key, vertices.length);
                vertices.push(new THREE.Vector3(x, y, z));
            }
        }

        // Get the 30 edges of a dodecahedron
        // Each edge connects two adjacent vertices
        const edges = getDodecahedronEdges(vertices);

        edges.forEach((edge, index) => {
            const [startIdx, endIdx] = edge;
            const start = vertices[startIdx];
            const end = vertices[endIdx];

            // Calculate midpoint for proximity detection
            const midpoint = new THREE.Vector3()
                .addVectors(start, end)
                .multiplyScalar(0.5);

            const lineMaterial = new THREE.LineBasicMaterial({
                color: CONFIG.appearance.edges.color,
                transparent: true,
                opacity: CONFIG.appearance.edges.baseOpacity  // Start hidden
            });

            const lineGeometry = new THREE.BufferGeometry();
            const linePositions = new Float32Array([
                start.x, start.y, start.z,
                end.x, end.y, end.z
            ]);
            lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

            const line = new THREE.Line(lineGeometry, lineMaterial);
            dodecahedronGroup.add(line);

            edgeLines.push({
                line: line,
                midpoint: midpoint,
                index: index
            });
        });

        Logger.info('Constellation', `Created ${edgeLines.length} edge lines (lamp reveals them)`);
    }

    /**
     * Get the 30 edges of a dodecahedron
     *
     * Two vertices are connected by an edge if they are adjacent
     * (share two faces). For a dodecahedron with radius r, adjacent
     * vertices are separated by a specific distance.
     */
    function getDodecahedronEdges(vertices) {
        const edges = [];
        const edgeSet = new Set();

        // For a unit dodecahedron, edge length is 2/phi ≈ 1.236
        // For our scaled dodecahedron, edge length = radius * 2/phi / golden_factor
        // Actually, let's compute adjacency by finding the minimum non-zero distances

        // First, compute all pairwise distances
        const distances = [];
        for (let i = 0; i < vertices.length; i++) {
            for (let j = i + 1; j < vertices.length; j++) {
                const dist = vertices[i].distanceTo(vertices[j]);
                distances.push({ i, j, dist });
            }
        }

        // Sort by distance
        distances.sort((a, b) => a.dist - b.dist);

        // The shortest distance is the edge length
        // A dodecahedron has 30 edges, so take the 30 shortest distances
        const edgeLength = distances[0].dist;
        const tolerance = edgeLength * 0.1;  // 10% tolerance

        for (const { i, j, dist } of distances) {
            if (Math.abs(dist - edgeLength) < tolerance) {
                const edgeKey = `${Math.min(i, j)},${Math.max(i, j)}`;
                if (!edgeSet.has(edgeKey)) {
                    edgeSet.add(edgeKey);
                    edges.push([i, j]);
                }
            }
            if (edges.length >= 30) break;
        }

        return edges;
    }

    /**
     * Create subtle solid fill (lamp reveals it)
     */
    function createSolidFill(geometry) {
        solidMaterial = new THREE.MeshBasicMaterial({
            color: CONFIG.appearance.solid.color,
            transparent: true,
            opacity: CONFIG.appearance.solid.baseOpacity,  // Start hidden
            side: THREE.DoubleSide
        });

        const solidMesh = new THREE.Mesh(geometry, solidMaterial);
        dodecahedronGroup.add(solidMesh);
    }

    /**
     * Create star clusters at each vertex
     *
     * Each vertex has a cluster of 8-12 tiny stars that:
     * - Scatter outward when lamp is far (blending with background)
     * - Gather inward when lamp approaches (forming tight cluster)
     * - Spiral during the gathering motion for organic feel
     * - Twinkle independently with phi-based timing
     *
     * This creates vertices that feel like gravitational centers
     * gathering stellar energy - convergence points where
     * organizational coherence concentrates.
     */
    function createVertexStars(geometry) {
        const clusterConfig = CONFIG.appearance.vertex.cluster;

        // Small sphere geometry for individual star particles
        const starGeometry = new THREE.SphereGeometry(
            clusterConfig.starSize,
            8,      // Low poly for performance (200 total particles)
            8
        );

        // Extract unique vertex positions
        const positions = geometry.attributes.position;
        const uniquePositions = new Set();
        const vertexPositions = [];

        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const y = positions.getY(i);
            const z = positions.getZ(i);
            const key = `${x.toFixed(3)},${y.toFixed(3)},${z.toFixed(3)}`;

            if (!uniquePositions.has(key)) {
                uniquePositions.add(key);
                vertexPositions.push({ x, y, z });
            }
        }

        // Create star cluster for each vertex
        vertexPositions.forEach((vertexPos, vertexIndex) => {
            // Create a group to hold all particles in this cluster
            const clusterGroup = new THREE.Group();
            clusterGroup.position.set(vertexPos.x, vertexPos.y, vertexPos.z);

            // Array to store individual particle data
            const particles = [];

            // Create particles for this cluster
            for (let i = 0; i < clusterConfig.particleCount; i++) {
                // Determine if this is a core star (white) or glow star (teal)
                const isCore = i < clusterConfig.particleCount * clusterConfig.coreRatio;
                const color = isCore ? clusterConfig.coreColor : clusterConfig.glowColor;

                // Random size variation
                const sizeMultiplier = 1 + (Math.random() - 0.5) * clusterConfig.starSizeVariation * 2;

                // Create star material
                const starMaterial = new THREE.MeshBasicMaterial({
                    color: color,
                    transparent: true,
                    opacity: 0  // Start invisible
                });

                // Create star mesh with scaled geometry
                const star = new THREE.Mesh(starGeometry, starMaterial);
                star.scale.setScalar(sizeMultiplier);

                // Calculate scattered position (random on sphere surface)
                const scatteredTheta = Math.random() * Math.PI * 2;
                const scatteredPhi = Math.acos(2 * Math.random() - 1);
                const scatteredR = clusterConfig.scatteredRadius * (0.7 + Math.random() * 0.3);

                const scatteredPos = new THREE.Vector3(
                    scatteredR * Math.sin(scatteredPhi) * Math.cos(scatteredTheta),
                    scatteredR * Math.sin(scatteredPhi) * Math.sin(scatteredTheta),
                    scatteredR * Math.cos(scatteredPhi)
                );

                // Calculate gathered position (tight cluster near center)
                const gatheredTheta = Math.random() * Math.PI * 2;
                const gatheredPhi = Math.acos(2 * Math.random() - 1);
                const gatheredR = clusterConfig.gatheredRadius * Math.random();

                const gatheredPos = new THREE.Vector3(
                    gatheredR * Math.sin(gatheredPhi) * Math.cos(gatheredTheta),
                    gatheredR * Math.sin(gatheredPhi) * Math.sin(gatheredTheta),
                    gatheredR * Math.cos(gatheredPhi)
                );

                // Start at scattered position
                star.position.copy(scatteredPos);

                // Store particle data for animation
                const particleData = {
                    mesh: star,
                    isCore: isCore,
                    scatteredPos: scatteredPos.clone(),
                    gatheredPos: gatheredPos.clone(),
                    currentPos: scatteredPos.clone(),
                    // Animation state
                    gatherProgress: 0,          // 0 = scattered, 1 = gathered
                    twinklePhase: Math.random() * Math.PI * 2,  // Random start phase
                    twinkleSpeed: clusterConfig.twinkleSpeed * (0.8 + Math.random() * 0.4),
                    // Spiral animation data
                    spiralAngle: Math.random() * Math.PI * 2,
                    spiralOffset: Math.random() * 0.5
                };

                particles.push(particleData);
                clusterGroup.add(star);
            }

            // Store cluster data
            clusterGroup.userData = {
                vertexIndex: vertexIndex,
                particles: particles,
                lampIntensity: 0,       // Current lamp influence
                orbitAngle: 0           // For cluster rotation when gathered
            };

            dodecahedronGroup.add(clusterGroup);
            vertexMeshes.push(clusterGroup);
        });

        const totalParticles = vertexMeshes.length * clusterConfig.particleCount;
        Logger.info('Constellation', `Created ${vertexMeshes.length} vertex clusters (${totalParticles} total star particles)`);
    }

    // ========================================================================
    // EVENT HANDLING
    // ========================================================================

    /**
     * Setup all event listeners
     */
    function setupEventListeners() {
        window.addEventListener('resize', handleResize);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseleave', handleMouseLeave);
    }

    function handleResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
    }

    function handleMouseMove(e) {
        // Normalize to -1 to 1 range
        mouse.raw.x = (e.clientX / window.innerWidth - 0.5) * 2;
        mouse.raw.y = (e.clientY / window.innerHeight - 0.5) * 2;

        // Update mouse vector for raycaster
        mouseVector.x = mouse.raw.x;
        mouseVector.y = -mouse.raw.y;

        // Calculate targets
        mouse.target.rotationX = -mouse.raw.y * CONFIG.mouse.lean.x;
        mouse.target.rotationY = mouse.raw.x * CONFIG.mouse.lean.y;

        // Scale response at edges
        const distFromCenter = Math.sqrt(mouse.raw.x ** 2 + mouse.raw.y ** 2);
        mouse.target.scale = CONFIG.mouse.scale.base +
            distFromCenter * CONFIG.mouse.scale.edgeBonus;
    }

    function handleMouseLeave() {
        mouse.target.rotationX = 0;
        mouse.target.rotationY = 0;
        mouse.target.scale = CONFIG.mouse.scale.base;
    }

    // ========================================================================
    // ANIMATION
    // ========================================================================

    /**
     * Main animation loop
     */
    function animate() {
        if (!isRunning) return;

        time += 0.005;

        updateMouseSmoothing();
        updateRotation();
        updateScale();
        // updateBreathing();  // Disabled - lamp effect replaces breathing
        updateVertexGlow();
        updateEdgeGlow();
        updateSolidGlow();
        updatePentagramGlow();
        updateCameraParallax();

        renderer.render(scene, camera);
        animationId = requestAnimationFrame(animate);
    }

    /**
     * Smooth mouse position interpolation (momentum/inertia)
     */
    function updateMouseSmoothing() {
        const lerp = CONFIG.animation.lerpFactor;

        mouse.current.rotationX += (mouse.target.rotationX - mouse.current.rotationX) * lerp;
        mouse.current.rotationY += (mouse.target.rotationY - mouse.current.rotationY) * lerp;
        mouse.current.scale += (mouse.target.scale - mouse.current.scale) * lerp;

        mouse.smoothed.x += (mouse.raw.x - mouse.smoothed.x) * lerp;
        mouse.smoothed.y += (mouse.raw.y - mouse.smoothed.y) * lerp;
    }

    /**
     * Update rotation (base + mouse influence)
     */
    function updateRotation() {
        const rotConfig = CONFIG.animation.rotation;

        // Base meditative rotation
        const baseRotX = Math.sin(time * rotConfig.x.speed) * rotConfig.x.amplitude +
            time * rotConfig.x.offset;
        const baseRotY = time * rotConfig.y.offset;

        // Apply combined rotation
        dodecahedronGroup.rotation.x = baseRotX + mouse.current.rotationX;
        dodecahedronGroup.rotation.y = baseRotY + mouse.current.rotationY;
    }

    /**
     * Update scale (depth response)
     */
    function updateScale() {
        dodecahedronGroup.scale.setScalar(mouse.current.scale);
    }

    /**
     * Update breathing effect on wireframe opacity
     */
    function updateBreathing() {
        const breathConfig = CONFIG.animation.breathing;

        // Phi-based breathing rhythm
        const breathPhase = time * breathConfig.speed * PHI;
        const breath = Math.sin(breathPhase) * breathConfig.intensity;

        wireframeMaterial.opacity = CONFIG.appearance.edges.opacity + breath;
    }

    /**
     * Update vertex star clusters based on cursor lamp proximity
     *
     * When lamp approaches a vertex:
     * - Stars gather inward with spiraling motion
     * - Opacity increases (stars become visible)
     * - Cluster rotates slowly when gathered
     *
     * When lamp moves away:
     * - Stars scatter outward (slower, dreamy)
     * - Opacity decreases (blends with background)
     *
     * Throughout:
     * - Each star twinkles independently with phi-based timing
     * - Core stars (white) are brighter than glow stars (teal)
     */
    function updateVertexGlow() {
        raycaster.setFromCamera(mouseVector, camera);

        const clusterConfig = CONFIG.appearance.vertex.cluster;

        vertexMeshes.forEach(clusterGroup => {
            // Get world position of this vertex
            const worldPos = new THREE.Vector3();
            clusterGroup.getWorldPosition(worldPos);

            // Calculate distance from ray to vertex
            const rayPoint = new THREE.Vector3();
            raycaster.ray.closestPointToPoint(worldPos, rayPoint);
            const distance = worldPos.distanceTo(rayPoint);

            // Calculate lamp intensity (radial falloff)
            const maxDist = CONFIG.appearance.vertex.maxDistance;
            const lampIntensity = Math.max(0, 1 - distance / maxDist);

            // Store lamp intensity for reference
            const userData = clusterGroup.userData;
            userData.lampIntensity = lampIntensity;

            // Update orbit angle (rotation of gathered cluster)
            userData.orbitAngle += clusterConfig.orbitSpeed * lampIntensity * 0.016;

            // Animate each particle in this cluster
            userData.particles.forEach((particle, particleIndex) => {
                // === GATHER/SCATTER ANIMATION ===
                // Target gather progress based on lamp intensity
                const targetGather = lampIntensity;

                // Different speeds for gathering vs scattering
                const speed = targetGather > particle.gatherProgress
                    ? clusterConfig.gatherSpeed
                    : clusterConfig.scatterSpeed;

                // Smooth interpolation toward target
                particle.gatherProgress += (targetGather - particle.gatherProgress) * speed;

                // Calculate current position with spiral effect
                const progress = particle.gatherProgress;

                // Spiral angle increases as particle gathers
                const spiralAngle = particle.spiralAngle +
                    progress * clusterConfig.spiralRotations * Math.PI * 2;

                // Base interpolation between scattered and gathered positions
                const basePos = new THREE.Vector3().lerpVectors(
                    particle.scatteredPos,
                    particle.gatheredPos,
                    progress
                );

                // Add spiral offset (perpendicular to radial direction)
                const radialDir = basePos.clone().normalize();
                const spiralIntensity = clusterConfig.spiralIntensity *
                    Math.sin(progress * Math.PI);  // Peak spiral at midpoint

                // Create perpendicular vector for spiral
                const up = new THREE.Vector3(0, 1, 0);
                const perpendicular = radialDir.clone().cross(up).normalize();
                if (perpendicular.length() < 0.1) {
                    perpendicular.set(1, 0, 0);
                }

                // Apply spiral offset
                const spiralOffset = perpendicular.clone()
                    .multiplyScalar(Math.sin(spiralAngle) * spiralIntensity * 0.1)
                    .add(up.clone().multiplyScalar(Math.cos(spiralAngle) * spiralIntensity * 0.1));

                basePos.add(spiralOffset);

                // Apply cluster rotation when gathered
                if (progress > 0.3) {
                    const rotationAmount = (progress - 0.3) / 0.7;  // 0 to 1 in gathered state
                    const rotatedPos = basePos.clone();
                    const cosA = Math.cos(userData.orbitAngle * rotationAmount);
                    const sinA = Math.sin(userData.orbitAngle * rotationAmount);

                    // Rotate around Y axis
                    const x = rotatedPos.x * cosA - rotatedPos.z * sinA;
                    const z = rotatedPos.x * sinA + rotatedPos.z * cosA;
                    rotatedPos.x = x;
                    rotatedPos.z = z;

                    basePos.copy(rotatedPos);
                }

                // Update particle position
                particle.mesh.position.copy(basePos);

                // === TWINKLE ANIMATION ===
                particle.twinklePhase += particle.twinkleSpeed * 0.016 * PHI;
                const twinkle = 0.5 + 0.5 * Math.sin(particle.twinklePhase);

                // === OPACITY ===
                // Base opacity depends on lamp intensity and gather state
                const visibilityFromLamp = lampIntensity;
                const visibilityFromScatter = 0.15 * (1 - progress);  // Faint when scattered

                const baseOpacity = Math.max(visibilityFromLamp, visibilityFromScatter);

                // Core stars are brighter
                const brightnessMultiplier = particle.isCore ? 1.0 : 0.7;

                // Apply twinkle modulation
                const twinkleAmount = 0.3 * (1 - progress * 0.5);  // Less twinkle when gathered
                const finalOpacity = baseOpacity * brightnessMultiplier *
                    (1 - twinkleAmount + twinkle * twinkleAmount);

                particle.mesh.material.opacity = finalOpacity;

                // === SCALE ===
                // Stars grow slightly when gathered
                const baseScale = particle.mesh.userData?.baseScale || particle.mesh.scale.x;
                if (!particle.mesh.userData) particle.mesh.userData = {};
                if (!particle.mesh.userData.baseScale) particle.mesh.userData.baseScale = baseScale;

                const scaleBoost = 1 + progress * 0.3;  // Up to 30% larger when gathered
                particle.mesh.scale.setScalar(particle.mesh.userData.baseScale * scaleBoost);
            });
        });
    }

    /**
     * Update edge glow based on cursor lamp proximity
     *
     * Each edge line reveals itself when the cursor lamp approaches
     * its midpoint - like constellation lines appearing in torchlight.
     */
    function updateEdgeGlow() {
        if (edgeLines.length === 0) return;

        raycaster.setFromCamera(mouseVector, camera);

        edgeLines.forEach(item => {
            // Get world position of edge midpoint
            const worldPos = new THREE.Vector3();
            worldPos.copy(item.midpoint);
            dodecahedronGroup.localToWorld(worldPos);

            // Calculate distance from ray to edge midpoint
            const rayPoint = new THREE.Vector3();
            raycaster.ray.closestPointToPoint(worldPos, rayPoint);
            const distance = worldPos.distanceTo(rayPoint);

            // Calculate lamp intensity
            const maxDist = CONFIG.appearance.edges.maxDistance;
            const lampIntensity = Math.max(0, 1 - distance / maxDist);

            // Smooth opacity transition
            const baseOpacity = CONFIG.appearance.edges.baseOpacity;
            const maxOpacity = CONFIG.appearance.edges.maxOpacity;
            const targetOpacity = baseOpacity + lampIntensity * (maxOpacity - baseOpacity);

            const currentOpacity = item.line.material.opacity;
            item.line.material.opacity = currentOpacity + (targetOpacity - currentOpacity) * 0.15;
        });
    }

    /**
     * Update solid fill glow based on cursor lamp proximity
     *
     * The solid fill reveals when the cursor is anywhere near the
     * dodecahedron, providing a subtle inner glow effect.
     */
    function updateSolidGlow() {
        if (!solidMaterial) return;

        raycaster.setFromCamera(mouseVector, camera);

        // Get world position of dodecahedron center
        const centerWorld = new THREE.Vector3();
        dodecahedronGroup.getWorldPosition(centerWorld);

        // Calculate distance from ray to center
        const rayPoint = new THREE.Vector3();
        raycaster.ray.closestPointToPoint(centerWorld, rayPoint);
        const distance = centerWorld.distanceTo(rayPoint);

        // Larger radius for solid fill - reveals when cursor is near the whole shape
        const maxDist = CONFIG.geometry.radius * 2;
        const lampIntensity = Math.max(0, 1 - distance / maxDist);

        // Smooth opacity transition
        const baseOpacity = CONFIG.appearance.solid.baseOpacity;
        const maxOpacity = CONFIG.appearance.solid.maxOpacity;
        const targetOpacity = baseOpacity + lampIntensity * (maxOpacity - baseOpacity);

        solidMaterial.opacity = solidMaterial.opacity + (targetOpacity - solidMaterial.opacity) * 0.1;
    }

    /**
     * Update pentagram line visibility based on cursor proximity to face
     *
     * Pentagrams start hidden and reveal themselves when the cursor
     * approaches their face centroid. This creates a magical sense
     * of discovery as users explore the sacred geometry.
     */
    function updatePentagramGlow() {
        if (pentagramLines.length === 0) return;

        raycaster.setFromCamera(mouseVector, camera);

        pentagramLines.forEach(item => {
            // Get world position of face centroid
            const worldPos = new THREE.Vector3();
            worldPos.copy(item.centroid);
            dodecahedronGroup.localToWorld(worldPos);

            // Calculate distance from ray to face centroid
            const rayPoint = new THREE.Vector3();
            raycaster.ray.closestPointToPoint(worldPos, rayPoint);
            const distance = worldPos.distanceTo(rayPoint);

            // Calculate reveal intensity based on proximity
            const maxDist = CONFIG.appearance.pentagram.maxDistance;
            const revealIntensity = Math.max(0, 1 - distance / maxDist);

            // Smooth the opacity transition
            const baseOpacity = CONFIG.appearance.pentagram.baseOpacity;
            const maxOpacity = CONFIG.appearance.pentagram.maxOpacity;
            const targetOpacity = baseOpacity + revealIntensity * (maxOpacity - baseOpacity);

            // Apply with slight smoothing for gentler transitions
            const currentOpacity = item.line.material.opacity;
            item.line.material.opacity = currentOpacity + (targetOpacity - currentOpacity) * 0.15;
        });
    }

    /**
     * Update camera position for parallax effect
     */
    function updateCameraParallax() {
        const intensity = CONFIG.camera.parallaxIntensity;
        camera.position.x = mouse.smoothed.x * intensity;
        camera.position.y = -mouse.smoothed.y * intensity;
        camera.lookAt(0, 0, 0);
    }

    // ========================================================================
    // PUBLIC API
    // ========================================================================

    const API = {
        /**
         * Start the animation
         */
        start() {
            if (isRunning) return;
            isRunning = true;
            animationId = requestAnimationFrame(animate);
            Logger.info('Constellation', 'Started');
        },

        /**
         * Stop the animation
         */
        stop() {
            isRunning = false;
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
            Logger.info('Constellation', 'Stopped');
        },

        /**
         * Update mouse position externally
         * (for coordination with starfield)
         */
        setMouse(x, y) {
            mouse.raw.x = x;
            mouse.raw.y = y;
            mouseVector.x = x;
            mouseVector.y = -y;

            mouse.target.rotationX = -y * CONFIG.mouse.lean.x;
            mouse.target.rotationY = x * CONFIG.mouse.lean.y;

            const distFromCenter = Math.sqrt(x ** 2 + y ** 2);
            mouse.target.scale = CONFIG.mouse.scale.base +
                distFromCenter * CONFIG.mouse.scale.edgeBonus;
        },

        /**
         * Trigger hyperspace effect (constellation dissolves into stars)
         * @param {Function} callback - Called when effect completes
         */
        dissolve(callback) {
            // Increase vertex spread dramatically
            const duration = 1500;
            const startTime = performance.now();

            function dissolveStep() {
                const elapsed = performance.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Fade out wireframe and solid
                wireframeMaterial.opacity = CONFIG.appearance.edges.opacity * (1 - progress);
                solidMaterial.opacity = CONFIG.appearance.solid.opacity * (1 - progress);

                // Scatter vertices outward
                vertexMeshes.forEach(vertex => {
                    const direction = vertex.position.clone().normalize();
                    const scatter = progress * 3;
                    vertex.position.copy(
                        direction.multiplyScalar(CONFIG.geometry.radius + scatter)
                    );
                    vertex.material.opacity = CONFIG.appearance.vertex.baseOpacity * (1 - progress * 0.5);
                });

                if (progress < 1) {
                    requestAnimationFrame(dissolveStep);
                } else if (callback) {
                    callback();
                }
            }

            dissolveStep();
        },

        /**
         * Get current configuration
         */
        getConfig() {
            return { ...CONFIG };
        },

        /**
         * Check if running
         */
        isRunning() {
            return isRunning;
        }
    };

    // ========================================================================
    // EXPORTS
    // ========================================================================

    return { init, ...API };

})();

// Export for ES modules if supported
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ConstellationDodecahedron;
}
