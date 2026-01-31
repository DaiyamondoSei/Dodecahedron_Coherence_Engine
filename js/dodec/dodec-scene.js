/**
 * ========================================
 * MODULE: dodec-scene.js
 * ========================================
 *
 * Extracted from: dodecahedron-viz.js
 * Original lines: 251-374, 2218-2305
 * Date: December 15, 2025
 *
 * PURPOSE:
 * Sets up the THREE.js scene infrastructure: renderer, scene, camera,
 * controls, lighting system, and octave layer visualization.
 *
 * DEPENDENCIES:
 * - THREE.js (global)
 * - THREE.OrbitControls (global)
 * - dodec-state.js (for DodecState)
 *
 * EXPORTS (to window/global):
 * - initScene(): Initialize scene, camera, renderer, lights
 * - createOctaveLayers(): Create 7 concentric octave shells
 * - toggleOctaveLayersVisibility(): Show/hide octave layers
 * - updateOctaveLayersForCompany(): Refresh octave layers after company switch
 * - updateOctaveLayers: (window export for callbacks)
 *
 * NOTES FOR FUTURE CLAUDE:
 * ========================================
 * SCENE ARCHITECTURE:
 * - Black background with fog for depth
 * - PerspectiveCamera at (4, 4, 4) looking at origin
 * - OrbitControls with damping for smooth interaction
 *
 * LIGHTING SYSTEM (5 lights, ~2.0x total intensity):
 * 1. Ambient (0.4) - soft base illumination
 * 2. Key Light (0.6) - white, main shadow direction
 * 3. Fill Light (0.3) - cyan, reduces harsh shadows
 * 4. Accent Magenta (0.25) - mystical depth
 * 5. Accent Yellow (0.2) - warm golden highlights
 * 6. Top Rim (0.25) - halo effect from above
 *
 * OCTAVE LAYERS:
 * 7 concentric wireframe dodecahedra representing development stages.
 * Current octave is highlighted with higher opacity.
 * Scale: Linear 1.0 + (i * 0.25) for each octave level.
 *
 * MOUSE TRACKING:
 * OrbitControls 'start' and 'end' events track drag state
 * for distinguishing clicks from drags (important for face selection).
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
        Logger.error('DodecScene', 'DodecState not loaded!');
        return;
    }

    // ========================================
    // SECTION: Scene Initialization
    // ========================================
    //
    // Creates the core THREE.js infrastructure:
    // - WebGL renderer with antialiasing
    // - Scene with black background and fog
    // - Perspective camera
    // - OrbitControls for interaction
    // - 5-light illumination system
    //
    // ========================================

    /**
     * Initialize the THREE.js scene, camera, renderer, and controls
     *
     * This is the first function called during visualization setup.
     * All created objects are stored in DodecState for cross-module access.
     */
    function initScene() {
        Logger.info('DodecScene', 'Initializing THREE.js scene...');

        // Check if running in iframe
        const isInIframe = global.self !== global.top;
        if (isInIframe) {
            const header = document.getElementById('pageHeader');
            if (header) header.classList.add('hidden');
        }

        // ========================================
        // RENDERER
        // ========================================

        const canvas = document.getElementById('scene');
        if (!canvas) {
            Logger.error('DodecScene', 'Canvas element #scene not found!');
            return;
        }

        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true
        });
        renderer.setPixelRatio(Math.min(global.devicePixelRatio || 1, 2));
        renderer.setSize(global.innerWidth, global.innerHeight);

        // ========================================
        // SCENE
        // ========================================

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000); // Pure black to match DNA helix
        scene.fog = new THREE.Fog(0x000000, 15, 50); // Atmospheric depth

        // ========================================
        // CAMERA
        // ========================================

        const camera = new THREE.PerspectiveCamera(
            45,                                    // FOV
            global.innerWidth / global.innerHeight, // Aspect ratio
            0.1,                                   // Near clipping plane
            1000                                   // Far clipping plane
        );
        camera.position.set(4, 4, 4);

        // ========================================
        // ORBIT CONTROLS
        // ========================================

        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;      // Reduced for more responsive feel
        controls.rotateSpeed = 1.2;         // Increased for easier rotation
        controls.minDistance = 2;
        controls.maxDistance = 15;
        controls.enablePan = false;
        controls.autoRotateSpeed = 1.0;     // Smooth auto-rotation speed
        controls.zoomSpeed = 1.2;           // Comfortable zoom speed

        // Track mouse position continuously for drag detection
        document.addEventListener('mousemove', (event) => {
            S.currentMousePosition.x = event.clientX;
            S.currentMousePosition.y = event.clientY;
        }, true);

        // Track OrbitControls interactions for auto-rotation pause and drag detection
        controls.addEventListener('start', () => {
            S.isUserInteracting = true;
            S.isDraggingWithOrbit = true;

            // Capture the starting mouse position when user starts dragging
            S.mouseStartPosition.x = S.currentMousePosition.x;
            S.mouseStartPosition.y = S.currentMousePosition.y;

            Logger.debug('DodecScene', `OrbitControls drag start at (${S.mouseStartPosition.x}, ${S.mouseStartPosition.y})`);

            if (S.interactionTimeout) clearTimeout(S.interactionTimeout);
        });

        controls.addEventListener('end', () => {
            S.isUserInteracting = false;

            // Calculate total drag distance
            const deltaX = Math.abs(S.currentMousePosition.x - S.mouseStartPosition.x);
            const deltaY = Math.abs(S.currentMousePosition.y - S.mouseStartPosition.y);
            const totalMovement = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            Logger.debug('DodecScene', `OrbitControls drag end - Total movement: ${totalMovement.toFixed(1)}px`);

            // Keep dragging flag for a brief moment to prevent click firing
            setTimeout(() => {
                S.isDraggingWithOrbit = false;
            }, 50);

            if (S.interactionTimeout) clearTimeout(S.interactionTimeout);
            S.interactionTimeout = setTimeout(() => {
                S.isUserInteracting = false;
            }, 2000);
        });

        // ========================================
        // LIGHTING SYSTEM (5 lights)
        // ========================================

        // Ambient: Soft base illumination
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        // Primary key light: Main white
        const pointLight1 = new THREE.PointLight(0xffffff, 0.6);
        pointLight1.position.set(5, 5, 5);
        scene.add(pointLight1);

        // Fill light: Cyan accent
        const pointLight2 = new THREE.PointLight(0x00ffcc, 0.3);
        pointLight2.position.set(-5, -5, -5);
        scene.add(pointLight2);

        // Magenta accent light - adds depth and mystical quality
        const pointLight3 = new THREE.PointLight(0xff00ff, 0.25);
        pointLight3.position.set(-5, 3, 3);
        scene.add(pointLight3);

        // Yellow warm accent - creates golden highlights
        const pointLight4 = new THREE.PointLight(0xffff00, 0.2);
        pointLight4.position.set(3, -5, -3);
        scene.add(pointLight4);

        // Top white rim light - creates halo effect
        const topLight = new THREE.PointLight(0xffffff, 0.25);
        topLight.position.set(0, 8, 0);
        scene.add(topLight);

        // ========================================
        // STORE IN STATE
        // ========================================

        S.canvas = canvas;
        S.renderer = renderer;
        S.scene = scene;
        S.camera = camera;
        S.controls = controls;

        // Expose to window for external access (VisualizationManager, etc.)
        global.scene = scene;
        global.camera = camera;
        global.renderer = renderer;

        // Handle window resize
        global.addEventListener('resize', () => {
            S.camera.aspect = global.innerWidth / global.innerHeight;
            S.camera.updateProjectionMatrix();
            S.renderer.setSize(global.innerWidth, global.innerHeight);
        });

        Logger.info('DodecScene', 'Scene initialized with 5-light system');
    }

    // ========================================
    // SECTION: Octave Layer System
    // ========================================
    //
    // 7 concentric wireframe dodecahedra representing
    // the developmental octaves (O1-O7).
    //
    // Colors from DodecState.OCTAVE_COLORS:
    // O1 - Survival (Red)
    // O2 - Security (Orange)
    // O3 - Power (Yellow)
    // O4 - Connection (Green)
    // O5 - Expression (Cyan)
    // O6 - Vision (Indigo)
    // O7 - Transcendence (Violet)
    //
    // ========================================

    /**
     * Create 7 concentric dodecahedron shells for octave visualization
     *
     * Each shell represents a developmental octave.
     * Current company's octave is highlighted with higher opacity.
     * Lower octaves (achieved) have moderate opacity.
     * Higher octaves (future) have low opacity (ghost states).
     */
    function createOctaveLayers() {
        // Remove existing group if present
        if (S.octaveLayerGroup) {
            S.scene.remove(S.octaveLayerGroup);
        }

        S.octaveLayerGroup = new THREE.Group();
        const baseRadius = 2; // Same as main dodecahedron

        // Determine current company octave
        let currentOctave = 1;
        if (S.currentCompany === 'nova-tech') currentOctave = 3;
        else if (S.currentCompany === 'zenith-solutions') currentOctave = 4;
        else if (S.currentCompany === 'apex-industries') currentOctave = 6;

        // Create 7 shells from inner (O1) to outer (O7)
        for (let i = 0; i < 7; i++) {
            const octaveNum = i + 1;
            // Scale: O1 is 1.0, each higher octave is larger
            const scale = 1.0 + (i * 0.25); // Linear growth for cleaner visualization
            const radius = baseRadius * scale;

            const geometry = new THREE.DodecahedronGeometry(radius);

            // Higher octaves are more transparent (ghost future states)
            // Current octave highlighted with higher opacity
            let opacity = octaveNum <= currentOctave ? 0.25 : 0.08;
            if (octaveNum === currentOctave) opacity = 0.4; // Highlight current stage

            const material = new THREE.MeshBasicMaterial({
                color: S.OCTAVE_COLORS[i],
                transparent: true,
                opacity: opacity,
                wireframe: true, // Wireframe for cleaner layered view
                side: THREE.DoubleSide
            });

            const shell = new THREE.Mesh(geometry, material);
            shell.userData.octaveLevel = octaveNum;
            S.octaveLayerGroup.add(shell);
        }

        S.scene.add(S.octaveLayerGroup);
        Logger.info('DodecScene', `Created 7 octave layers, current company at O${currentOctave}`);
    }

    /**
     * Toggle octave layers visibility on/off
     *
     * Creates layers on first show if they don't exist yet.
     */
    function toggleOctaveLayersVisibility() {
        S.showOctaveLayers = !S.showOctaveLayers;

        if (S.showOctaveLayers) {
            if (!S.octaveLayerGroup) {
                createOctaveLayers();
            } else {
                S.scene.add(S.octaveLayerGroup);
            }
        } else {
            if (S.octaveLayerGroup) {
                S.scene.remove(S.octaveLayerGroup);
            }
        }

        Logger.info('DodecScene', `Octave layers: ${S.showOctaveLayers ? 'ON' : 'OFF'}`);
    }

    /**
     * Update octave layers when company changes
     *
     * Recreates the layers with correct opacity based on new company's octave level.
     */
    function updateOctaveLayersForCompany() {
        if (S.showOctaveLayers && S.octaveLayerGroup) {
            S.scene.remove(S.octaveLayerGroup);
            createOctaveLayers();
        }
    }

    // ========================================
    // EXPORTS
    // ========================================

    global.initScene = initScene;
    global.createOctaveLayers = createOctaveLayers;
    global.toggleOctaveLayersVisibility = toggleOctaveLayersVisibility;
    global.updateOctaveLayersForCompany = updateOctaveLayersForCompany;

    // Callback for company switch (used by dodec-data.js)
    global.updateOctaveLayers = updateOctaveLayersForCompany;

    Logger.info('DodecScene', 'Module loaded - Scene infrastructure ready');

})(typeof window !== 'undefined' ? window : this);
