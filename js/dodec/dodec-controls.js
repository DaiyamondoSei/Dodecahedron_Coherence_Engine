/**
 * ========================================
 * MODULE: dodec-controls.js
 * ========================================
 *
 * Extracted from: dodecahedron-viz.js
 * Original lines: 2119-2556
 * Date: December 15, 2025
 *
 * PURPOSE:
 * UI controls, keyboard shortcuts, and stats display for the
 * 3D dodecahedron visualization. Provides user interaction
 * through buttons and 14 keyboard shortcuts for thesis defense.
 *
 * DEPENDENCIES:
 * - dodec-state.js (for DodecState)
 * - dodec-scene.js (for toggleOctaveLayersVisibility)
 * - dodec-interaction.js (for resetCameraView, onMouseClick, onMouseMove)
 * - dodec-panels.js (for closeFaceDetail)
 * - dodec-data.js (for switchCompany)
 *
 * EXPORTS (to window/global):
 * - updateStats(): Updates coherence HUD and face counts
 * - setupUIControls(): Initializes button event listeners
 * - setupKeyboardShortcuts(): Registers 15 keyboard shortcuts
 *
 * NOTES FOR FUTURE CLAUDE:
 * ========================================
 * KEYBOARD SHORTCUTS (15 total):
 * - Esc: Close panel/overlays
 * - R: Reset camera view
 * - Space: Toggle animation pause (prevents page scroll)
 * - A: Toggle auto-rotation
 * - O: Toggle octave layers
 * - D: Open DNA helix view (new tab)
 * - S: Toggle shadow overlay (handled by shadow system)
 * - I: Toggle data integrity overlay
 * - P: Toggle presentation mode
 * - L: Cycle font scale (Normal → Large → XLarge)
 * - C: Toggle high contrast (projector mode)
 * - H: Toggle keyboard hints overlay
 * - F: Toggle fullscreen
 * - Shift+R: Open Results Summary report
 *
 * FONT SCALE LEVELS:
 * Uses CSS classes: font-scale-normal, font-scale-large, font-scale-xlarge
 * Cycles through with L key for accessibility.
 *
 * INDICATOR PATTERN:
 * Font scale and contrast changes show temporary indicators that
 * auto-hide after 2 seconds with fade-out animation.
 *
 * PANEL TAB SWITCHING:
 * Face panel has multiple tabs (metrics, elements, etc.) that
 * switch content sections. Uses data-section attribute matching.
 *
 * OUTSIDE-CLICK DETECTION:
 * Closes face panel when clicking outside, but NOT when:
 * - Clicking inside the panel
 * - Clicking the close button
 * - Clicking on canvas (might be selecting another face)
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
        console.error('[dodec-controls] DodecState not loaded!');
        return;
    }

    // ========================================
    // SECTION: Stats Display
    // ========================================
    //
    // Updates the coherence HUD and face health counts.
    // Called after visualization updates and company switches.
    //
    // ========================================

    /**
     * Update stats display with current company data
     *
     * Updates:
     * - Coherence percentage and status color
     * - Coherence HUD with transcendence detection
     * - Face count by health status (green/yellow/red)
     */
    function updateStats() {
        if (!S.companyData) {
            console.warn('[dodec-controls] No company data for stats');
            return;
        }

        const coherence = S.companyData.globalCoherence || 0;
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

        const statCoherence = document.getElementById('statCoherence');
        if (statCoherence) {
            statCoherence.textContent = `${coherencePercent}%`;
        }

        const statusEl = document.getElementById('statStatus');
        if (statusEl) {
            statusEl.textContent = status;
            statusEl.style.color = statusColor;
        }

        // ========================================
        // Update Coherence HUD
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

            // Determine status (PHI threshold at 0.618)
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

        // ========================================
        // Count faces by health
        // ========================================
        if (S.companyData.faces) {
            const healthy = S.companyData.faces.filter(f => (f.faceEnergy || 0) >= 0.7).length;
            const moderate = S.companyData.faces.filter(f => {
                const energy = f.faceEnergy || 0;
                return energy >= 0.4 && energy < 0.7;
            }).length;
            const critical = S.companyData.faces.filter(f => (f.faceEnergy || 0) < 0.4).length;

            // Update face count stats (if elements exist)
            const statFacesEl = document.getElementById('statFaces');
            if (statFacesEl) {
                statFacesEl.textContent = `12 (🟢${healthy} 🟡${moderate} 🔴${critical})`;
            }
        }
    }

    // ========================================
    // SECTION: UI Controls Setup
    // ========================================
    //
    // Initializes button event listeners for all UI controls.
    // Called once during initialization.
    //
    // ========================================

    /**
     * Setup UI control button handlers
     *
     * Initializes event listeners for:
     * - Toggle rotation button
     * - Octave layers toggle button
     * - Company selector buttons
     * - Close face detail button
     * - Face panel tab switching
     * - Pentagram/dimensional analysis button
     * - Mouse handlers (canvas click/move)
     * - Outside-click panel closing
     */
    function setupUIControls() {
        console.log('[dodec-controls] Setting up UI controls...');

        // ========================================
        // Toggle rotation button
        // ========================================
        const toggleRotationBtn = document.getElementById('toggleRotation');
        if (toggleRotationBtn) {
            toggleRotationBtn.addEventListener('click', (e) => {
                S.autoRotate = !S.autoRotate;
                e.target.textContent = `Auto-Rotate: ${S.autoRotate ? 'ON' : 'OFF'}`;
                e.target.classList.toggle('active', S.autoRotate);
            });
        }

        // ========================================
        // Octave layers toggle button
        // ========================================
        const octaveToggleBtn = document.getElementById('toggleOctaveLayers');
        if (octaveToggleBtn) {
            octaveToggleBtn.addEventListener('click', (e) => {
                if (typeof global.toggleOctaveLayersVisibility === 'function') {
                    global.toggleOctaveLayersVisibility();
                }
                e.target.textContent = `Octave Layers: ${S.showOctaveLayers ? 'ON' : 'OFF'}`;
                e.target.classList.toggle('active', S.showOctaveLayers);
            });
        }

        // ========================================
        // Company selectors
        // ========================================
        const companyQuannex = document.getElementById('companyQuannex');
        const companyNova = document.getElementById('companyNova');
        const companyZenith = document.getElementById('companyZenith');
        const companyApex = document.getElementById('companyApex');

        if (companyQuannex && typeof global.switchCompany === 'function') {
            companyQuannex.addEventListener('click', () => global.switchCompany('quannex'));
        }
        if (companyNova && typeof global.switchCompany === 'function') {
            companyNova.addEventListener('click', () => global.switchCompany('nova-tech'));
        }
        if (companyZenith && typeof global.switchCompany === 'function') {
            companyZenith.addEventListener('click', () => global.switchCompany('zenith-solutions'));
        }
        if (companyApex && typeof global.switchCompany === 'function') {
            companyApex.addEventListener('click', () => global.switchCompany('apex-industries'));
        }

        // ========================================
        // Close face detail button
        // ========================================
        const closeFaceDetailBtn = document.getElementById('closeFaceDetail');
        if (closeFaceDetailBtn && typeof global.closeFaceDetail === 'function') {
            closeFaceDetailBtn.addEventListener('click', global.closeFaceDetail);
        }

        // ========================================
        // Face panel tab switching
        // ========================================
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

                console.log(`[dodec-controls] Face panel tab switched to: ${sectionName}`);
            });
        });

        // ========================================
        // Pentagram / Dimensional analysis button
        // ========================================
        const pentagramBtn = document.getElementById('showPentagram');
        if (pentagramBtn) {
            pentagramBtn.addEventListener('click', () => {
                alert('📊 Dimensional Analysis\n\nFor deeper sacred geometry insights (pentagram analysis, elemental harmonics), please visit the DNA Helix visualization tab.\n\nThe dodecahedron view focuses on business metrics and organizational health.');
            });
        }

        // ========================================
        // Mouse handlers on canvas
        // ========================================
        if (S.canvas) {
            if (typeof global.onMouseClick === 'function') {
                S.canvas.addEventListener('click', global.onMouseClick);
            }
            if (typeof global.onMouseMove === 'function') {
                S.canvas.addEventListener('mousemove', global.onMouseMove);
            }
        }

        // ========================================
        // Close face panel when clicking outside
        // ========================================
        document.addEventListener('click', (event) => {
            const panel = document.getElementById('faceDetailPanel');
            const closeButton = document.getElementById('closeFaceDetail');

            // Check if panel is visible and click is outside the panel
            if (panel && panel.classList.contains('visible')) {
                // Don't close if:
                // - Click is inside the panel
                // - Click is on the close button
                // - Click is on the canvas (might be opening a different face)
                const isClickOnCanvas = event.target === S.canvas || event.target.tagName === 'CANVAS';

                if (!panel.contains(event.target) && event.target !== closeButton && !isClickOnCanvas) {
                    console.log('[dodec-controls] Click outside panel detected - closing face detail');
                    if (typeof global.closeFaceDetail === 'function') {
                        global.closeFaceDetail();
                    }
                }
            }
        });

        console.log('[dodec-controls] UI controls initialized');
    }

    // ========================================
    // SECTION: Keyboard Shortcuts
    // ========================================
    //
    // Registers 14 keyboard shortcuts for visualization control.
    // Designed for thesis defense presentation ease.
    //
    // ========================================

    /**
     * Setup keyboard shortcut handlers
     *
     * Shortcuts:
     * - Esc: Close panel/overlays
     * - R: Reset camera
     * - Space: Toggle pause
     * - A: Toggle auto-rotation
     * - O: Toggle octave layers
     * - D: Open DNA helix (new tab)
     * - S: Toggle shadow overlay (handled by shadow system)
     * - I: Toggle data integrity overlay
     * - P: Toggle presentation mode
     * - L: Cycle font scale
     * - C: Toggle high contrast
     * - H: Toggle keyboard hints
     * - F: Toggle fullscreen
     * - Shift+R: Open results summary
     */
    function setupKeyboardShortcuts() {
        console.log('[dodec-controls] Setting up keyboard shortcuts...');

        document.addEventListener('keydown', (e) => {
            // ========================================
            // Esc - Close panel/overlays
            // ========================================
            if (e.key === 'Escape') {
                if (typeof global.closeFaceDetail === 'function') {
                    global.closeFaceDetail();
                }
                // Also close keyboard hints overlay
                const hints = document.getElementById('keyboardHints');
                if (hints && hints.classList.contains('visible')) {
                    hints.classList.remove('visible');
                }
            }

            // ========================================
            // R - Reset camera view
            // ========================================
            if (e.key === 'r' || e.key === 'R') {
                // Shift+R is handled separately below
                if (!e.shiftKey && typeof global.resetCameraView === 'function') {
                    global.resetCameraView();
                }
            }

            // ========================================
            // Space - Toggle animation pause
            // ========================================
            if (e.key === ' ' && e.target === document.body) {
                e.preventDefault(); // Prevent page scroll
                S.animationsPaused = !S.animationsPaused;

                // Show pause indicator
                const pauseIndicator = document.getElementById('pauseIndicator');
                if (pauseIndicator) {
                    if (S.animationsPaused) {
                        pauseIndicator.classList.add('visible');
                    } else {
                        pauseIndicator.classList.remove('visible');
                    }
                }

                // Also pause auto-rotation when animations are paused
                if (S.animationsPaused && S.autoRotate) {
                    S.autoRotate = false;
                    const toggleBtn = document.getElementById('toggleRotation');
                    if (toggleBtn) {
                        toggleBtn.textContent = 'Auto-Rotate: OFF';
                        toggleBtn.classList.remove('active');
                    }
                }

                console.log(`[dodec-controls] All animations: ${S.animationsPaused ? 'PAUSED' : 'PLAYING'}`);
            }

            // ========================================
            // A - Toggle auto-rotation
            // ========================================
            if (e.key === 'a' || e.key === 'A') {
                if (!S.animationsPaused) {
                    S.autoRotate = !S.autoRotate;
                    const toggleBtn = document.getElementById('toggleRotation');
                    if (toggleBtn) {
                        toggleBtn.textContent = `Auto-Rotate: ${S.autoRotate ? 'ON' : 'OFF'}`;
                        toggleBtn.classList.toggle('active', S.autoRotate);
                    }
                    console.log(`[dodec-controls] Auto-rotate: ${S.autoRotate ? 'ON' : 'OFF'}`);
                }
            }

            // ========================================
            // O - Toggle octave layers
            // ========================================
            if (e.key === 'o' || e.key === 'O') {
                const octaveBtn = document.getElementById('toggleOctaveLayers');
                if (octaveBtn) {
                    octaveBtn.click();
                }
            }

            // ========================================
            // D - Open DNA Helix view
            // ========================================
            if (e.key === 'd' || e.key === 'D') {
                global.open('octave-dna.html', '_blank');
            }

            // ========================================
            // P - Toggle presentation mode
            // ========================================
            if (e.key === 'p' || e.key === 'P') {
                document.body.classList.toggle('presentation-mode');
                const isPresentation = document.body.classList.contains('presentation-mode');
                console.log(`[dodec-controls] Presentation mode: ${isPresentation ? 'ON' : 'OFF'}`);
            }

            // ========================================
            // L - Cycle font scale
            // ========================================
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

                console.log(`[dodec-controls] Font scale: ${nextScale.toUpperCase()}`);
            }

            // ========================================
            // C - Toggle high contrast mode
            // ========================================
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

                console.log(`[dodec-controls] High contrast: ${isHighContrast ? 'ON' : 'OFF'}`);
            }

            // ========================================
            // H - Toggle keyboard hints
            // ========================================
            if (e.key === 'h' || e.key === 'H') {
                const hints = document.getElementById('keyboardHints');
                if (hints) {
                    hints.classList.toggle('visible');
                    console.log(`[dodec-controls] Keyboard hints: ${hints.classList.contains('visible') ? 'SHOWN' : 'HIDDEN'}`);
                }
            }

            // ========================================
            // I - Toggle data integrity overlay (Sprint 6)
            // ========================================
            if (e.key === 'i' || e.key === 'I') {
                // Don't trigger when typing in input fields
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

                if (global.IntegrityOrchestrator?.toggleOverlay) {
                    global.IntegrityOrchestrator.toggleOverlay();
                    console.log('[dodec-controls] Data integrity overlay toggled');
                } else if (global.IntegrityOverlay?.toggle) {
                    // Fallback if orchestrator not available
                    global.IntegrityOverlay.toggle();
                    console.log('[dodec-controls] Data integrity overlay toggled (direct)');
                }
            }

            // ========================================
            // F - Toggle fullscreen
            // ========================================
            if (e.key === 'f' || e.key === 'F') {
                // Don't trigger when typing in input fields
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

                if (!document.fullscreenElement) {
                    // Enter fullscreen
                    document.documentElement.requestFullscreen().then(() => {
                        console.log('[dodec-controls] Fullscreen: ENTERED');
                    }).catch(err => {
                        console.warn('[dodec-controls] Fullscreen not supported:', err.message);
                    });
                } else {
                    // Exit fullscreen
                    document.exitFullscreen().then(() => {
                        console.log('[dodec-controls] Fullscreen: EXITED');
                    }).catch(err => {
                        console.warn('[dodec-controls] Exit fullscreen failed:', err.message);
                    });
                }
            }

            // ========================================
            // Shift+R - Open Results Summary Report
            // ========================================
            if ((e.key === 'r' || e.key === 'R') && e.shiftKey) {
                // Don't trigger when typing in input fields
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
                e.preventDefault();

                // Open results summary in new tab
                global.open('results-summary.html', '_blank');
                console.log('[dodec-controls] Opening Results Summary Report');
            }
        });

        console.log('[dodec-controls] Keyboard shortcuts registered (15 shortcuts)');
    }

    // ========================================
    // EXPORTS
    // ========================================

    global.updateStats = updateStats;
    global.setupUIControls = setupUIControls;
    global.setupKeyboardShortcuts = setupKeyboardShortcuts;

    console.log('[dodec-controls] Module loaded - UI controls and keyboard shortcuts ready');

})(typeof window !== 'undefined' ? window : this);
