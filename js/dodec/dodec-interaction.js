/**
 * ========================================
 * MODULE: dodec-interaction.js
 * ========================================
 *
 * Extracted from: dodecahedron-viz.js
 * Original lines: 1070-1422
 * Date: December 15, 2025
 *
 * PURPOSE:
 * Handles user interaction with the dodecahedron:
 * - Raycasting for face and edge detection
 * - Camera animation (zoom to face, reset)
 * - Mouse hover effects and tooltips
 * - Mouse click handling for panel display
 *
 * DEPENDENCIES:
 * - THREE.js (for Raycaster, Vector2, Vector3)
 * - dodec-state.js (for DodecState)
 * - dodec-panels.js (for showFaceDetail, showEdgeDetail, closeFaceDetail)
 *
 * EXPORTS (to window/global):
 * - setupInteraction(): Initialize raycaster and event listeners
 * - animateCameraTo(targetPos, lookAt, duration): Smooth camera animation
 * - getCameraPositionForFace(faceIndex): Calculate optimal camera position
 * - resetCameraView(): Return camera to default position
 * - onMouseMove: Event handler for hover
 * - onMouseClick: Event handler for clicks
 *
 * NOTES FOR FUTURE CLAUDE:
 * ========================================
 * CLICK VS DRAG DETECTION:
 * OrbitControls captures mousedown, so we can't use traditional click detection.
 * Instead:
 * 1. OrbitControls 'start' event saves mouseStartPosition
 * 2. OrbitControls 'end' event calculates total movement
 * 3. onClick compares movement to DRAG_THRESHOLD (5px)
 * 4. Movements > threshold are ignored (user was dragging)
 *
 * RAYCASTING PRIORITY:
 * 1. Edges (TubeGeometry) - checked first
 * 2. Faces (invisible click meshes) - checked if no edge hit
 * This ensures edge tooltips work even when over faces.
 *
 * CAMERA ANIMATION:
 * Uses easeInOutCubic for natural motion. During animation,
 * auto-rotation is temporarily disabled and restored after.
 *
 * TOOLTIP POSITIONING:
 * Tooltips are positioned 20px from mouse cursor to avoid
 * interference with hover detection.
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
        Logger.error('DodecInteraction', 'DodecState not loaded!');
        return;
    }

    // ========================================
    // SECTION: Raycaster Setup
    // ========================================
    //
    // Initializes the raycasting system for mouse picking.
    //
    // ========================================

    /**
     * Initialize the interaction system
     *
     * Creates raycaster, mouse vector, and attaches event listeners.
     * Should be called after scene and geometry are ready.
     */
    function setupInteraction() {
        Logger.info('DodecInteraction', 'Setting up interaction system...');

        // Create raycaster and mouse vector
        S.raycaster = new THREE.Raycaster();
        S.mouse = new THREE.Vector2();

        // Get canvas for event listeners
        const canvas = S.canvas;
        if (!canvas) {
            Logger.error('DodecInteraction', 'Canvas not available for event listeners!');
            return;
        }

        // Attach event listeners
        document.addEventListener('mousemove', onMouseMove, false);
        canvas.addEventListener('click', onMouseClick, false);

        Logger.info('DodecInteraction', 'Event listeners attached');
    }

    // ========================================
    // SECTION: Camera Animation
    // ========================================
    //
    // Smooth camera movements for face focus and reset.
    //
    // ========================================

    /**
     * Smooth camera animation to target position
     *
     * Uses easeInOutCubic for natural motion.
     *
     * @param {THREE.Vector3} targetPosition - Target camera position
     * @param {THREE.Vector3} lookAtTarget - Target look-at point
     * @param {number} [duration=1200] - Animation duration in ms
     */
    function animateCameraTo(targetPosition, lookAtTarget, duration = 1200) {
        const camera = S.camera;
        const controls = S.controls;

        if (!camera || !controls) {
            Logger.warn('DodecInteraction', 'Camera or controls not available');
            return;
        }

        const startPosition = camera.position.clone();
        const startTarget = controls.target.clone();
        const startTime = Date.now();

        S.isCameraAnimating = true;

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
                S.isCameraAnimating = false;
            }
        };

        animate();
    }

    /**
     * Calculate optimal camera position for viewing a face
     *
     * Positions camera along the face normal at a comfortable distance.
     * Rotation center remains at origin for consistent interaction.
     *
     * @param {number} faceIndex - Index of the face (0-11)
     * @returns {Object|null} {position: Vector3, lookAt: Vector3} or null
     */
    function getCameraPositionForFace(faceIndex) {
        // Get face position from the clickable mesh
        const clickMesh = S.faceMeshes[faceIndex];
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
    }

    /**
     * Reset camera to default view
     *
     * Animates camera back to initial position (4, 4, 4).
     */
    function resetCameraView() {
        const defaultPosition = new THREE.Vector3(4, 4, 4);
        const defaultTarget = new THREE.Vector3(0, 0, 0);
        animateCameraTo(defaultPosition, defaultTarget, 1000);
    }

    // ========================================
    // SECTION: Mouse Hover Handling
    // ========================================
    //
    // Handles hover effects on faces and edges, shows tooltips.
    //
    // ========================================

    /**
     * Handle mouse move for hover effects
     *
     * Priority:
     * 1. Edge hover - shows edge tooltip
     * 2. Face hover - shows face tooltip, brightens material
     *
     * @param {MouseEvent} event - Mouse event
     */
    function onMouseMove(event) {
        // Skip if no canvas
        const canvas = S.canvas;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        S.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        S.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        S.raycaster.setFromCamera(S.mouse, S.camera);

        // Try to raycast edges first (priority over faces)
        const edgeIntersects = S.raycaster.intersectObjects(S.edgeLines);
        const faceIntersects = S.raycaster.intersectObjects(S.faceMeshes);

        // Get tooltip elements
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

                // Enhanced edge question display
                const questionHtml = edgeData.theQuestion ?
                    `<div class="edge-question">${edgeData.theQuestion}</div>` : '';

                // Edge Polarity - Calculate energy flow direction
                const face1Energy = edgeData.face1Energy || 0;
                const face2Energy = edgeData.face2Energy || 0;
                const energyDiff = face2Energy - face1Energy;
                let flowHtml = '';

                if (Math.abs(energyDiff) > 0.05) {
                    const flowDirection = energyDiff > 0 ? '→' : '←';
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

        // Reset previous hover - reset to normal brightness
        if (S.hoveredFace && S.hoveredFace !== S.selectedFace) {
            const material = S.hoveredFace.userData.material;
            if (material) {
                material.emissiveIntensity = material.userData.baseIntensity || 0.3;
            }
        }

        // PRIORITY 2: Check face hover (only if no edge hovered)
        if (faceIntersects.length > 0) {
            const hoveredMesh = faceIntersects[0].object;
            S.hoveredFace = hoveredMesh;

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
            S.hoveredFace = null;
            canvas.style.cursor = 'default';

            // Hide tooltips
            if (faceTooltip) {
                faceTooltip.classList.remove('visible');
            }
        }
    }

    // ========================================
    // SECTION: Mouse Click Handling
    // ========================================
    //
    // Handles face and edge selection, opens detail panels.
    //
    // ========================================

    /**
     * Handle mouse click for selection
     *
     * Distinguishes clicks from drags using mouse movement threshold.
     * Priority:
     * 1. Edge clicks - shows edge detail panel
     * 2. Face clicks - shows face detail panel, animates camera
     * 3. Empty space - closes open panels
     *
     * @param {MouseEvent} event - Click event
     */
    function onMouseClick(event) {
        Logger.debug('DodecInteraction', `🖱️ Canvas click at (${event.clientX}, ${event.clientY})`);

        // Calculate movement from where OrbitControls drag started
        const deltaX = Math.abs(event.clientX - S.mouseStartPosition.x);
        const deltaY = Math.abs(event.clientY - S.mouseStartPosition.y);
        const totalMovement = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        Logger.debug('DodecInteraction', `   📏 Movement from drag start: ${totalMovement.toFixed(1)}px (threshold: ${S.DRAG_THRESHOLD}px)`);
        Logger.debug('DodecInteraction', `   🎮 isDraggingWithOrbit: ${S.isDraggingWithOrbit}`);

        // If user moved more than threshold, ignore the click (it was a drag)
        if (totalMovement > S.DRAG_THRESHOLD) {
            Logger.debug('DodecInteraction', `   🚫 Ignoring click - user was dragging (${totalMovement.toFixed(1)}px movement)`);
            return;
        }

        Logger.debug('DodecInteraction', `   ✅ Valid click - processing...`);

        // Get canvas
        const canvas = S.canvas;
        if (!canvas) return;

        // Calculate mouse position in normalized device coordinates
        const rect = canvas.getBoundingClientRect();
        S.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        S.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        // Raycast to find intersections (edges take priority)
        S.raycaster.setFromCamera(S.mouse, S.camera);

        const edgeIntersects = S.raycaster.intersectObjects(S.edgeLines);
        const faceIntersects = S.raycaster.intersectObjects(S.faceMeshes);

        Logger.debug('DodecInteraction', `   🔍 Found ${edgeIntersects.length} edge, ${faceIntersects.length} face intersections`);

        // PRIORITY 1: Check if edge was clicked
        if (edgeIntersects.length > 0) {
            const clickedEdge = edgeIntersects[0].object;
            const edgeData = clickedEdge.userData.edgeData;

            Logger.debug('DodecInteraction', `   🔗 Hit edge: ${clickedEdge.userData.edgeName}`);

            if (edgeData && typeof global.showEdgeDetail === 'function') {
                global.showEdgeDetail(edgeData, clickedEdge.userData.edgeName);
            }
            return; // Don't process face click if edge was clicked
        }

        // PRIORITY 2: Check if face was clicked (only if no edge clicked)
        if (faceIntersects.length > 0) {
            const clickedMesh = faceIntersects[0].object;
            S.selectedFace = clickedMesh.userData.faceData;
            const faceIndex = clickedMesh.userData.faceIndex;

            Logger.debug('DodecInteraction', `   ✅ Hit face ${faceIndex + 1}: ${S.selectedFace?.name || 'Unknown'}`);

            if (S.selectedFace) {
                // Animate camera to focus on this face
                const cameraTarget = getCameraPositionForFace(faceIndex);
                if (cameraTarget) {
                    // Temporarily disable auto-rotation during camera animation
                    const wasAutoRotating = S.autoRotate;
                    S.autoRotate = false;

                    animateCameraTo(cameraTarget.position, cameraTarget.lookAt, 1200);

                    // Re-enable auto-rotation after animation completes (if it was on)
                    setTimeout(() => {
                        S.autoRotate = wasAutoRotating;
                    }, 1200);
                }

                // Show face detail panel
                if (typeof global.showFaceDetail === 'function') {
                    global.showFaceDetail(S.selectedFace);
                }
            }
        } else {
            // Clicked on canvas but didn't hit any face - close the panel if open
            Logger.debug('DodecInteraction', `   ⚠️ No face hit - clicked empty space`);
            const panel = document.getElementById('faceDetailPanel');
            if (panel && panel.classList.contains('visible')) {
                Logger.debug('DodecInteraction', `   🔒 Closing face detail panel`);
                if (typeof global.closeFaceDetail === 'function') {
                    global.closeFaceDetail();
                }
            }
        }
    }

    // ========================================
    // EXPORTS
    // ========================================

    // Setup function
    global.setupInteraction = setupInteraction;

    // Camera functions
    global.animateCameraTo = animateCameraTo;
    global.getCameraPositionForFace = getCameraPositionForFace;
    global.resetCameraView = resetCameraView;

    // Event handlers (exported for potential external use)
    global.onMouseMove = onMouseMove;
    global.onMouseClick = onMouseClick;

    Logger.info('DodecInteraction', 'Module loaded - Interaction system ready');

})(typeof window !== 'undefined' ? window : this);
