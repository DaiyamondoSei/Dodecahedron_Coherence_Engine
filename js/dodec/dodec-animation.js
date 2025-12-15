/**
 * ========================================
 * MODULE: dodec-animation.js
 * ========================================
 *
 * Extracted from: dodecahedron-viz.js
 * Original lines: 2558-2672
 * Date: December 15, 2025
 *
 * PURPOSE:
 * Main animation loop with PHI-tuned pulsing effects for faces.
 * Renders the scene, handles auto-rotation, and creates visual
 * feedback for organizational health through golden ratio timing.
 *
 * DEPENDENCIES:
 * - THREE.js (global)
 * - dodec-state.js (for DodecState)
 * - phi-harmonics.js (for PHI constant, or use S.PHI)
 * - window.Quannex (for theta threshold)
 *
 * EXPORTS (to window/global):
 * - startAnimation(): Begins the render loop
 * - stopAnimation(): Stops the render loop (cleanup)
 * - animate(): Main animation function (internal, but exposed)
 *
 * NOTES FOR FUTURE CLAUDE:
 * ========================================
 * PHI-TUNED PULSING SYSTEM:
 * The animation uses golden ratio (PHI = 1.618...) for all
 * time-based calculations, creating naturally pleasing rhythms.
 *
 * THREE PULSING MODES:
 * 1. URGENT (energy < 10%): Fast pulse (PHI * 2), red shift
 *    - sin(time * PHI * 2) creates ~0.62 second cycle
 *    - Color shifts toward danger red (#ff2200)
 *
 * 2. WARNING (energy 10-40%): Moderate pulse (PHI), orange shift
 *    - sin(time * PHI) creates ~1 second cycle
 *    - Color shifts toward warm orange (#ff8800)
 *
 * 3. TRANSCENDENCE (energy >= theta): Slow golden glow (PHI * 0.5)
 *    - sin(time * PHI * 0.5) creates ~2 second majestic cycle
 *    - Color shifts toward golden (#ffd700)
 *
 * BASE EMISSIVE CACHING:
 * Materials store their original emissive color in userData.baseEmissive
 * to allow smooth transitions back to normal state.
 *
 * PAUSE SYSTEM:
 * When animationsPaused=true:
 * - Time-based effects stop (no pulsing)
 * - Scene still renders (static view)
 * - Last time stored in window._pausedTime
 *
 * AUTO-ROTATION:
 * When autoRotate=true and not interacting:
 * - Dodecahedron rotates at 0.003 rad/frame (~0.17 deg/frame)
 * - Edge lines and octave layers rotate in sync
 *
 * VERTEX SPHERE PULSING:
 * Optional vertex spheres pulse using PHI * 3 for harmonic
 * resonance with face pulsing. Uses pulsePhase for variety.
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
        console.error('[dodec-animation] DodecState not loaded!');
        return;
    }

    // Get PHI from state or phi-harmonics
    const PHI = S.PHI || global.PHI || 1.618033988749895;

    // Animation frame ID for cleanup
    let animationFrameId = null;

    // ========================================
    // SECTION: Animation Loop
    // ========================================
    //
    // Main render loop with PHI-tuned effects.
    // Runs at 60fps (browser requestAnimationFrame).
    //
    // ========================================

    /**
     * Main animation loop function
     *
     * Called every frame (~60fps). Handles:
     * - Auto-rotation of dodecahedron
     * - PHI-tuned face pulsing based on energy
     * - Vertex sphere pulsing
     * - OrbitControls update
     * - Scene rendering
     */
    function animate() {
        animationFrameId = requestAnimationFrame(animate);

        // ========================================
        // TIME MANAGEMENT
        // ========================================
        // Skip time-based animations when paused
        // (Still render the scene, just don't update time-based effects)
        const time = S.animationsPaused ? (global._pausedTime || 0) : Date.now() * 0.001;
        if (!S.animationsPaused) {
            global._pausedTime = time; // Store last time for when we pause
        }

        // ========================================
        // AUTO-ROTATION
        // ========================================
        // Rotate dodecahedron when enabled and not interacting
        if (S.autoRotate && !S.isUserInteracting && !S.animationsPaused) {
            if (S.mainDodecahedron) {
                S.mainDodecahedron.rotation.y += 0.003;
            }
            // Edge lines are children of mainDodecahedron, but if separate:
            if (S.edgeLines) {
                S.edgeLines.forEach(line => {
                    line.rotation.y += 0.003;
                });
            }
            // Rotate octave layers in sync
            if (S.octaveLayerGroup) {
                S.octaveLayerGroup.rotation.y += 0.003;
            }
        }

        // ========================================
        // PHI-TUNED CRITICAL FACE PULSING
        // ========================================
        // Golden ratio timing for natural rhythm
        // Skip pulsing when animations are paused
        const materials = S.materials || global.dodecahedronMaterials;
        if (materials && S.faceMeshes && !S.animationsPaused) {
            S.faceMeshes.forEach((mesh, index) => {
                const faceData = mesh.userData.faceData;
                if (faceData && materials[index]) {
                    const energy = faceData.faceEnergy || 0;

                    // ========================================
                    // URGENT: Very low energy (< 10%)
                    // Fast phi-tuned pulse with danger red
                    // ========================================
                    if (energy < 0.1) {
                        const urgentPulse = Math.sin(time * PHI * 2) * 0.3 + 0.7;
                        materials[index].emissiveIntensity = 0.7 * urgentPulse;

                        // Shift emissive toward danger red
                        const warningRed = new THREE.Color(0xff2200);
                        const baseEmissive = materials[index].userData.baseEmissive || materials[index].emissive.clone();
                        if (!materials[index].userData.baseEmissive) {
                            materials[index].userData.baseEmissive = materials[index].emissive.clone();
                        }
                        materials[index].emissive.lerpColors(baseEmissive, warningRed, 0.5 + 0.3 * Math.sin(time * PHI * 3));
                    }
                    // ========================================
                    // WARNING: Critical faces (10-40%)
                    // Moderate phi-tuned pulse with warm orange
                    // ========================================
                    else if (energy < 0.4) {
                        const criticalPulse = Math.sin(time * PHI) * 0.2 + 0.8;
                        materials[index].emissiveIntensity = 0.5 * criticalPulse;

                        // Subtle shift toward warm orange
                        const warningOrange = new THREE.Color(0xff8800);
                        const baseEmissive = materials[index].userData.baseEmissive || materials[index].emissive.clone();
                        if (!materials[index].userData.baseEmissive) {
                            materials[index].userData.baseEmissive = materials[index].emissive.clone();
                        }
                        materials[index].emissive.lerpColors(baseEmissive, warningOrange, 0.2 + 0.1 * Math.sin(time * PHI * 2));
                    }
                    // ========================================
                    // TRANSCENDENCE or HEALTHY
                    // ========================================
                    else {
                        // Get theta threshold from tuning config
                        const tuning = global.Quannex ? global.Quannex.exportTuning() : null;
                        const theta = tuning ? tuning.theta : 0.618;

                        // ========================================
                        // TRANSCENDENCE READY: Energy >= theta
                        // Slow golden glow for faces ready to advance
                        // ========================================
                        if (energy >= theta) {
                            const transcendencePulse = Math.sin(time * PHI * 0.5) * 0.15 + 0.85;
                            materials[index].emissiveIntensity = 0.6 * transcendencePulse;

                            // Radiant golden color (phi-derived warmth)
                            const goldenColor = new THREE.Color(0xffd700);
                            const baseEmissive = materials[index].userData.baseEmissive || materials[index].emissive.clone();
                            if (!materials[index].userData.baseEmissive) {
                                materials[index].userData.baseEmissive = materials[index].emissive.clone();
                            }
                            // Subtle golden shimmer
                            const shimmer = 0.3 + 0.15 * Math.sin(time * PHI * 1.5);
                            materials[index].emissive.lerpColors(baseEmissive, goldenColor, shimmer);
                        }
                        // ========================================
                        // HEALTHY: Restore base emissive
                        // ========================================
                        else if (materials[index].userData.baseEmissive) {
                            materials[index].emissive.copy(materials[index].userData.baseEmissive);
                            materials[index].emissiveIntensity = 0.3;
                        }
                    }
                }
            });
        }

        // ========================================
        // VERTEX SPHERE PULSING
        // ========================================
        // Phi-tuned for harmonic resonance with face pulsing
        if (global.vertexSpheres && !S.animationsPaused) {
            global.vertexSpheres.forEach(sphere => {
                if (sphere.userData.isPulsing) {
                    const phase = sphere.userData.pulsePhase || 0;
                    // Phi-tuned pulse: 3 * PHI creates pleasing ratio with face pulse
                    const scale = 1 + Math.sin(time * PHI * 3 + phase) * 0.3;
                    sphere.scale.setScalar(scale);
                }
            });
        }

        // ========================================
        // RENDER
        // ========================================
        if (S.controls) {
            S.controls.update();
        }
        if (S.renderer && S.scene && S.camera) {
            S.renderer.render(S.scene, S.camera);
        }
    }

    /**
     * Start the animation loop
     *
     * Call this after all initialization is complete.
     * Safe to call multiple times (will not duplicate).
     */
    function startAnimation() {
        if (animationFrameId === null) {
            console.log('[dodec-animation] Starting animation loop');
            animate();
        }
    }

    /**
     * Stop the animation loop
     *
     * Call this for cleanup or when switching views.
     */
    function stopAnimation() {
        if (animationFrameId !== null) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
            console.log('[dodec-animation] Animation loop stopped');
        }
    }

    // ========================================
    // EXPORTS
    // ========================================

    global.animate = animate;
    global.startAnimation = startAnimation;
    global.stopAnimation = stopAnimation;

    console.log('[dodec-animation] Module loaded - Animation loop ready');
    console.log('[dodec-animation] PHI-tuned pulsing: Urgent (<10%), Warning (10-40%), Transcendence (>=theta)');

})(typeof window !== 'undefined' ? window : this);
