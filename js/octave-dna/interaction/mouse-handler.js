/**
 * ════════════════════════════════════════════════════════════════════════════
 * OCTAVE DNA - MOUSE INTERACTION HANDLER
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Handles mouse clicks on DNA helixes using THREE.js raycasting.
 * Clicking a helix selects it and opens the diagnostic panel.
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                        NOTES FOR FUTURE CLAUDE                          │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * RAYCASTING EXPLAINED:
 * ─────────────────────────────────────────────────────────────────────────
 * Raycasting is how we detect what the user clicked in 3D space:
 *
 *   1. Convert mouse position from screen coords to normalized device coords
 *      x: (clientX / width) * 2 - 1  → range [-1, 1]
 *      y: -(clientY / height) * 2 + 1  → range [-1, 1] (inverted!)
 *
 *   2. Cast a ray from camera through the mouse point
 *
 *   3. Check intersections with clickable meshes
 *
 *   4. If hit, the mesh has userData.helix with the helix config
 *
 * INTERACTION FLOW:
 * ─────────────────────────────────────────────────────────────────────────
 * Click on helix → selectHelix(helix) → showDiagnosticPanel(helix)
 * Click on empty → closePanel()
 *
 * The selected helix is stored in state so panels know what to display.
 *
 * NAVIGATION MAP:
 * ─────────────────────────────────────────────────────────────────────────
 * ├─ DEPENDS ON:
 * │  ├─ THREE.js (Raycaster, Vector2)
 * │  ├─ OctaveDNAState (camera, selectedHelix)
 * │  └─ OctaveDNAGeometry.getClickableMeshes()
 * │
 * └─ USED BY:
 *    └─ octave-dna-main.js (attaches click listener)
 *
 * ════════════════════════════════════════════════════════════════════════════
 * @version 1.0.0 - Extracted from octave-dna.html monolith
 * @created 2025-12-19
 */

(function() {
    'use strict';

    // ════════════════════════════════════════════════════════════════════════
    // RAYCASTER SETUP
    // ════════════════════════════════════════════════════════════════════════

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // ════════════════════════════════════════════════════════════════════════
    // CLICK HANDLING
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Handle canvas click event
     *
     * Performs raycasting to detect which helix (if any) was clicked.
     * If a helix is clicked, it's selected and the diagnostic panel opens.
     * If empty space is clicked, any open panel is closed.
     *
     * @param {MouseEvent} event - The click event
     */
    function onCanvasClick(event) {
        const State = window.OctaveDNAState;
        const Geometry = window.OctaveDNAGeometry;

        if (!State || !Geometry) return;

        const camera = State.getState('camera');
        if (!camera) return;

        // Convert mouse position to normalized device coordinates (-1 to +1)
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Cast ray from camera through mouse position
        raycaster.setFromCamera(mouse, camera);

        // Get clickable meshes from geometry module
        const clickableMeshes = Geometry.getClickableMeshes();

        // Check for intersections
        const intersects = raycaster.intersectObjects(clickableMeshes, false);

        if (intersects.length > 0) {
            const clicked = intersects[0].object;

            if (clicked.userData && clicked.userData.clickable) {
                // Helix clicked - select it
                selectHelix(clicked.userData.helix);
            }
        } else {
            // Click on empty space - close panel
            closePanel();
        }
    }

    /**
     * Handle canvas double-click for camera focus
     *
     * Double-clicking a helix focuses the camera on it.
     *
     * @param {MouseEvent} event - The double-click event
     */
    function onCanvasDoubleClick(event) {
        const State = window.OctaveDNAState;
        const Geometry = window.OctaveDNAGeometry;

        if (!State || !Geometry) return;

        const camera = State.getState('camera');
        const controls = State.getState('controls');
        if (!camera || !controls) return;

        // Convert mouse position
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const clickableMeshes = Geometry.getClickableMeshes();
        const intersects = raycaster.intersectObjects(clickableMeshes, false);

        if (intersects.length > 0) {
            const clicked = intersects[0].object;
            const point = intersects[0].point;

            // Focus camera on clicked point
            if (point) {
                // Smoothly animate camera target to clicked point
                const targetY = Math.max(point.y, 5); // Keep target above ground
                controls.target.set(point.x, targetY, point.z);
                console.log(`🎯 Camera focused on helix at (${point.x.toFixed(1)}, ${targetY.toFixed(1)}, ${point.z.toFixed(1)})`);
            }
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // HELIX SELECTION
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Select a helix and show its diagnostic panel
     *
     * @param {Object} helix - The helix configuration object
     */
    function selectHelix(helix) {
        const State = window.OctaveDNAState;
        if (!State) return;

        // Store selected helix in state
        State.setState('selectedHelix', helix);

        console.log(`🧬 Selected helix: ${helix.name}`);

        // Show diagnostic panel (if panels module is loaded)
        if (window.OctaveDNAPanels?.showDiagnosticPanel) {
            window.OctaveDNAPanels.showDiagnosticPanel(helix);
        }

        // Emit custom event for other modules
        document.dispatchEvent(new CustomEvent('octave-dna:helix-selected', {
            detail: { helix }
        }));
    }

    /**
     * Clear helix selection
     */
    function clearSelection() {
        const State = window.OctaveDNAState;
        if (State) {
            State.setState('selectedHelix', null);
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // PANEL CONTROL
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Close the diagnostic panel
     */
    function closePanel() {
        // Clear selection
        clearSelection();

        // Close panel (if panels module is loaded)
        if (window.OctaveDNAPanels?.closePanel) {
            window.OctaveDNAPanels.closePanel();
        } else {
            // Fallback: directly hide panel
            const panel = document.getElementById('diagnosticPanel');
            if (panel) {
                panel.classList.remove('show');
            }
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // EVENT LISTENER SETUP
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Initialize mouse event listeners
     *
     * Attaches click and double-click handlers to the canvas.
     */
    function initMouseHandlers() {
        const canvas = document.getElementById('canvas');
        if (!canvas) {
            console.warn('⚠️ [Mouse Handler] Canvas not found');
            return;
        }

        // Single click for selection
        canvas.addEventListener('click', onCanvasClick);

        // Double click for camera focus
        canvas.addEventListener('dblclick', onCanvasDoubleClick);

        console.log('🖱️ [Mouse Handler] Click handlers attached to canvas');
    }

    /**
     * Remove mouse event listeners
     */
    function removeMouseHandlers() {
        const canvas = document.getElementById('canvas');
        if (canvas) {
            canvas.removeEventListener('click', onCanvasClick);
            canvas.removeEventListener('dblclick', onCanvasDoubleClick);
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // BROWSER GLOBAL EXPORT
    // ════════════════════════════════════════════════════════════════════════

    if (typeof window !== 'undefined') {
        window.OctaveDNAMouse = {
            initMouseHandlers,
            removeMouseHandlers,
            onCanvasClick,
            onCanvasDoubleClick,
            selectHelix,
            clearSelection,
            closePanel
        };

        console.log('🖱️ [OctaveDNA Mouse] Interaction handler loaded');
    }

})();
