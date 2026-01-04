/**
 * ============================================================================
 * QUANNEX KEYBOARD SHORTCUTS
 * ============================================================================
 *
 * NOTES FOR FUTURE CLAUDE:
 * ============================================================================
 * This module provides keyboard navigation and shortcuts for power users.
 * It's designed to be non-intrusive - shortcuts only fire when not typing
 * in an input field.
 *
 * SHORTCUTS OVERVIEW:
 *   ? - Show/hide help modal
 *   Escape - Close any open panel/modal
 *   / - Focus search (if available)
 *   e - Open export menu
 *   r - Cycle language register (NOT on 3D page - conflicts with Reset)
 *   t - Start guided tour (3D page)
 *   p - Print / Export PDF (NOT on 3D page - conflicts with Presentation)
 *   1-9 - Quick navigate to faces
 *   Arrow keys - Navigate 3D view (rotate)
 *   + / - - Zoom in/out (3D view)
 *
 * PAGE AWARENESS:
 *   On dodecahedron-3d.html, this module defers to dodec-controls.js for:
 *   R, P, Space, A, S, I, O, D, H, F, C, L (presentation controls)
 *
 * NAVIGATION MAP:
 *   -> IMPORTS FROM:
 *      - js/ux/language-register.js -> Register cycling
 *      - js/ux/export-manager.js -> Export trigger
 *      - js/dodec/dodec-tour.js -> Tour trigger
 *
 *   -> CONSUMED BY:
 *      - All pages (keyboard shortcuts are global)
 * ============================================================================
 *
 * @fileoverview Keyboard shortcuts for Quannex power users
 * @author Deimantas Murauskas & Claude
 * @version 1.0.0
 */

(function(global) {
    'use strict';

    // ========================================================================
    // CONFIGURATION
    // ========================================================================

    const CONFIG = {
        // Enable/disable shortcut categories
        enabled: {
            navigation: true,
            panels: true,
            actions: true,
            threeD: true
        },

        // 3D rotation speed (degrees per keypress)
        rotationSpeed: 15,
        zoomSpeed: 0.1,

        // Keys that conflict with dodec-controls.js on 3D page
        // These are handled by dodec-controls: R (reset), P (presentation), Space (pause),
        // A (auto-rotate), S (shadow), I (integrity), O (octave), D (DNA), H (help)
        dodecConflictKeys: ['r', 'p', ' ', 'a', 's', 'i', 'o', 'd', 'h', 'f', 'c', 'l']
    };

    // ========================================================================
    // PAGE DETECTION
    // ========================================================================

    /**
     * Detect if we're on the 3D dodecahedron page
     * @returns {boolean}
     */
    function isOn3DPage() {
        // Check for dodec-controls presence or specific page elements
        return !!(
            global.DodecControls ||
            document.getElementById('dodecahedronCanvas') ||
            document.getElementById('keyboardHints') ||
            document.querySelector('.keyboard-hints-overlay')
        );
    }

    /**
     * Check if this key conflicts with existing dodec-controls
     * @param {string} key - The key pressed
     * @returns {boolean}
     */
    function isDodecConflict(key) {
        if (!isOn3DPage()) return false;
        return CONFIG.dodecConflictKeys.includes(key.toLowerCase());
    }

    // ========================================================================
    // SHORTCUT DEFINITIONS
    // ========================================================================

    const SHORTCUTS = {
        // Help
        '?': {
            description: 'Show keyboard shortcuts',
            category: 'general',
            action: () => toggleHelpModal()
        },

        // Escape - close things
        'Escape': {
            description: 'Close panel / modal',
            category: 'panels',
            action: () => closeActivePanel()
        },

        // Search
        '/': {
            description: 'Focus search',
            category: 'navigation',
            action: (e) => {
                e.preventDefault();
                focusSearch();
            }
        },

        // Export
        'e': {
            description: 'Open export menu',
            category: 'actions',
            action: () => triggerExport()
        },

        // Print/PDF
        'p': {
            description: 'Print / Export PDF',
            category: 'actions',
            action: () => {
                if (global.QuannexExport) {
                    global.QuannexExport.exportPDF();
                } else {
                    global.print();
                }
            }
        },

        // Register toggle
        'r': {
            description: 'Cycle language register',
            category: 'actions',
            action: () => cycleRegister()
        },

        // Tour (3D page)
        't': {
            description: 'Start guided tour',
            category: 'navigation',
            action: () => startTour()
        },

        // 3D Navigation
        'ArrowLeft': {
            description: 'Rotate left',
            category: '3d',
            action: () => rotate3D('left')
        },
        'ArrowRight': {
            description: 'Rotate right',
            category: '3d',
            action: () => rotate3D('right')
        },
        'ArrowUp': {
            description: 'Rotate up',
            category: '3d',
            action: () => rotate3D('up')
        },
        'ArrowDown': {
            description: 'Rotate down',
            category: '3d',
            action: () => rotate3D('down')
        },
        '+': {
            description: 'Zoom in',
            category: '3d',
            action: () => zoom3D('in')
        },
        '=': {
            description: 'Zoom in',
            category: '3d',
            action: () => zoom3D('in'),
            hidden: true // Don't show in help (duplicate of +)
        },
        '-': {
            description: 'Zoom out',
            category: '3d',
            action: () => zoom3D('out')
        },

        // Face quick-select (1-9 for first 9 faces, 0 for face 10)
        '1': { description: 'Select Face 1', category: 'faces', action: () => selectFace(0) },
        '2': { description: 'Select Face 2', category: 'faces', action: () => selectFace(1) },
        '3': { description: 'Select Face 3', category: 'faces', action: () => selectFace(2) },
        '4': { description: 'Select Face 4', category: 'faces', action: () => selectFace(3) },
        '5': { description: 'Select Face 5', category: 'faces', action: () => selectFace(4) },
        '6': { description: 'Select Face 6', category: 'faces', action: () => selectFace(5) },
        '7': { description: 'Select Face 7', category: 'faces', action: () => selectFace(6) },
        '8': { description: 'Select Face 8', category: 'faces', action: () => selectFace(7) },
        '9': { description: 'Select Face 9', category: 'faces', action: () => selectFace(8) },
        '0': { description: 'Select Face 10', category: 'faces', action: () => selectFace(9) },

        // Home - reset view
        'Home': {
            description: 'Reset 3D view',
            category: '3d',
            action: () => reset3DView()
        },

        // Space - pause/resume animations
        ' ': {
            description: 'Pause/resume animation',
            category: '3d',
            action: (e) => {
                e.preventDefault();
                toggleAnimation();
            }
        }
    };

    // ========================================================================
    // STATE
    // ========================================================================

    let helpModal = null;
    let isHelpVisible = false;

    // ========================================================================
    // HELPER: Check if in input field
    // ========================================================================

    function isTyping() {
        const active = document.activeElement;
        if (!active) return false;

        const tag = active.tagName.toLowerCase();
        if (tag === 'input' || tag === 'textarea' || tag === 'select') {
            return true;
        }

        if (active.isContentEditable) {
            return true;
        }

        return false;
    }

    // ========================================================================
    // ACTION HANDLERS
    // ========================================================================

    /**
     * Close any active panel or modal
     */
    function closeActivePanel() {
        // Close help modal first
        if (isHelpVisible) {
            hideHelpModal();
            return true;
        }

        // Close error modal
        if (global.QuannexErrorRecovery) {
            global.QuannexErrorRecovery.hideErrorModal();
        }

        // Close face detail panel
        const facePanel = document.getElementById('faceDetailPanel');
        if (facePanel?.classList.contains('visible')) {
            facePanel.classList.remove('visible');
            return true;
        }

        // Close shadow overlay
        const shadowOverlay = document.getElementById('shadowOverlay');
        if (shadowOverlay?.classList.contains('visible')) {
            shadowOverlay.classList.remove('visible');
            return true;
        }

        // Close any open dropdowns
        document.querySelectorAll('.dropdown.open, .menu.open').forEach(el => {
            el.classList.remove('open');
        });

        return false;
    }

    /**
     * Focus search input if available
     */
    function focusSearch() {
        const searchInput = document.querySelector(
            'input[type="search"], input[name="search"], #searchInput, .search-input'
        );
        if (searchInput) {
            searchInput.focus();
            searchInput.select();
            return true;
        }
        return false;
    }

    /**
     * Trigger export menu/action
     */
    function triggerExport() {
        // Try export button click
        const exportBtn = document.querySelector('[data-action="export"], .export-btn, #exportBtn');
        if (exportBtn) {
            exportBtn.click();
            return true;
        }

        // Dispatch export event
        global.dispatchEvent(new CustomEvent('quannex:export-requested', {
            detail: { format: 'pdf' }
        }));

        return true;
    }

    /**
     * Cycle through language registers
     */
    function cycleRegister() {
        if (!global.LanguageRegister) {
            showToast('Language register not available', 'info');
            return false;
        }

        const registers = ['analytical', 'balanced', 'contemplative'];
        const current = global.LanguageRegister.get() || 'balanced';
        const currentIndex = registers.indexOf(current);
        const nextIndex = (currentIndex + 1) % registers.length;
        const next = registers[nextIndex];

        global.LanguageRegister.set(next);
        showToast(`Register: ${next}`, 'info');

        return true;
    }

    /**
     * Start guided tour
     */
    function startTour() {
        if (global.DodecTour?.start) {
            global.DodecTour.start();
            return true;
        }

        // Try tour button
        const tourBtn = document.querySelector('[data-action="start-tour"], #tourBtn, .tour-btn');
        if (tourBtn) {
            tourBtn.click();
            return true;
        }

        return false;
    }

    /**
     * Rotate 3D view
     */
    function rotate3D(direction) {
        if (!global.camera || !global.controls) return false;

        const speed = CONFIG.rotationSpeed * (Math.PI / 180);

        // If OrbitControls available, use them
        if (global.controls?.object) {
            switch (direction) {
                case 'left':
                    global.controls.object.position.applyAxisAngle(
                        new THREE.Vector3(0, 1, 0), speed
                    );
                    break;
                case 'right':
                    global.controls.object.position.applyAxisAngle(
                        new THREE.Vector3(0, 1, 0), -speed
                    );
                    break;
                case 'up':
                    global.controls.object.position.applyAxisAngle(
                        new THREE.Vector3(1, 0, 0), speed
                    );
                    break;
                case 'down':
                    global.controls.object.position.applyAxisAngle(
                        new THREE.Vector3(1, 0, 0), -speed
                    );
                    break;
            }
            global.controls.update();
            return true;
        }

        return false;
    }

    /**
     * Zoom 3D view
     */
    function zoom3D(direction) {
        if (!global.camera) return false;

        const factor = direction === 'in' ? (1 - CONFIG.zoomSpeed) : (1 + CONFIG.zoomSpeed);

        if (global.camera.position) {
            global.camera.position.multiplyScalar(factor);
            if (global.controls?.update) {
                global.controls.update();
            }
            return true;
        }

        return false;
    }

    /**
     * Reset 3D view to default
     */
    function reset3DView() {
        if (global.controls?.reset) {
            global.controls.reset();
            return true;
        }

        // Manual reset
        if (global.camera) {
            global.camera.position.set(0, 0, 5);
            global.camera.lookAt(0, 0, 0);
            return true;
        }

        return false;
    }

    /**
     * Toggle animation pause/resume
     */
    function toggleAnimation() {
        if (typeof global.toggleAutoRotate === 'function') {
            global.toggleAutoRotate();
            return true;
        }

        if (global.controls?.autoRotate !== undefined) {
            global.controls.autoRotate = !global.controls.autoRotate;
            showToast(global.controls.autoRotate ? 'Animation resumed' : 'Animation paused', 'info');
            return true;
        }

        return false;
    }

    /**
     * Select a face by index
     */
    function selectFace(index) {
        // Try Quannex engine
        if (global.Quannex?.selectFace) {
            global.Quannex.selectFace(index);
            return true;
        }

        // Try face click simulation
        const faceElements = document.querySelectorAll('[data-face-index], .face-card');
        if (faceElements[index]) {
            faceElements[index].click();
            return true;
        }

        // Dispatch event
        global.dispatchEvent(new CustomEvent('quannex:face-selected', {
            detail: { faceIndex: index }
        }));

        return true;
    }

    /**
     * Show toast notification
     */
    function showToast(message, type = 'info') {
        if (global.QuannexToast) {
            global.QuannexToast.show(message, type);
        } else {
            global.dispatchEvent(new CustomEvent('quannex:toast', {
                detail: { message, type }
            }));
        }
    }

    // ========================================================================
    // HELP MODAL
    // ========================================================================

    function createHelpModal() {
        if (helpModal) return;

        helpModal = document.createElement('div');
        helpModal.id = 'quannex-shortcuts-help';
        helpModal.setAttribute('role', 'dialog');
        helpModal.setAttribute('aria-label', 'Keyboard Shortcuts');

        const style = document.createElement('style');
        style.textContent = `
            #quannex-shortcuts-help {
                position: fixed;
                inset: 0;
                z-index: 10002;
                display: none;
                align-items: center;
                justify-content: center;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            #quannex-shortcuts-help.visible {
                display: flex;
            }
            #quannex-shortcuts-help .backdrop {
                position: absolute;
                inset: 0;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(4px);
            }
            #quannex-shortcuts-help .modal {
                position: relative;
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                border: 1px solid rgba(0, 255, 204, 0.3);
                border-radius: 16px;
                padding: 24px 32px;
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
            }
            #quannex-shortcuts-help h2 {
                color: #00ffcc;
                margin: 0 0 20px;
                font-size: 20px;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            #quannex-shortcuts-help .close-btn {
                position: absolute;
                top: 16px;
                right: 16px;
                background: none;
                border: none;
                color: rgba(255, 255, 255, 0.5);
                font-size: 24px;
                cursor: pointer;
                padding: 4px 8px;
                border-radius: 4px;
                transition: all 0.2s;
            }
            #quannex-shortcuts-help .close-btn:hover {
                color: #fff;
                background: rgba(255, 255, 255, 0.1);
            }
            #quannex-shortcuts-help .category {
                margin-bottom: 20px;
            }
            #quannex-shortcuts-help .category-title {
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: rgba(255, 255, 255, 0.5);
                margin-bottom: 10px;
                padding-bottom: 6px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            #quannex-shortcuts-help .shortcut-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 6px 0;
            }
            #quannex-shortcuts-help .shortcut-key {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                min-width: 28px;
                height: 28px;
                padding: 0 8px;
                background: rgba(0, 255, 204, 0.15);
                border: 1px solid rgba(0, 255, 204, 0.3);
                border-radius: 6px;
                font-family: monospace;
                font-size: 13px;
                color: #00ffcc;
            }
            #quannex-shortcuts-help .shortcut-desc {
                color: rgba(255, 255, 255, 0.8);
                font-size: 13px;
            }
            #quannex-shortcuts-help .footer {
                margin-top: 20px;
                padding-top: 16px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                text-align: center;
                font-size: 12px;
                color: rgba(255, 255, 255, 0.4);
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(helpModal);

        // Build content
        updateHelpContent();
    }

    function updateHelpContent() {
        if (!helpModal) return;

        const categories = {
            general: { title: 'General', shortcuts: [] },
            navigation: { title: 'Navigation', shortcuts: [] },
            actions: { title: 'Actions', shortcuts: [] },
            panels: { title: 'Panels', shortcuts: [] },
            '3d': { title: '3D View', shortcuts: [] },
            faces: { title: 'Face Selection', shortcuts: [] }
        };

        // Group shortcuts by category
        for (const [key, shortcut] of Object.entries(SHORTCUTS)) {
            if (shortcut.hidden) continue;
            const cat = shortcut.category || 'general';
            if (categories[cat]) {
                categories[cat].shortcuts.push({ key, ...shortcut });
            }
        }

        // Build HTML
        let html = `
            <div class="backdrop" onclick="QuannexShortcuts.hideHelp()"></div>
            <div class="modal">
                <button class="close-btn" onclick="QuannexShortcuts.hideHelp()">&times;</button>
                <h2><span style="font-size: 24px;">&#x2328;</span> Keyboard Shortcuts</h2>
        `;

        for (const [catKey, cat] of Object.entries(categories)) {
            if (cat.shortcuts.length === 0) continue;

            html += `
                <div class="category">
                    <div class="category-title">${cat.title}</div>
            `;

            for (const shortcut of cat.shortcuts) {
                const keyDisplay = shortcut.key === ' ' ? 'Space' :
                                   shortcut.key === 'Escape' ? 'Esc' :
                                   shortcut.key;
                html += `
                    <div class="shortcut-row">
                        <span class="shortcut-key">${keyDisplay}</span>
                        <span class="shortcut-desc">${shortcut.description}</span>
                    </div>
                `;
            }

            html += '</div>';
        }

        html += `
                <div class="footer">Press <kbd style="background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 3px;">?</kbd> to toggle this help</div>
            </div>
        `;

        helpModal.innerHTML = html;
    }

    function toggleHelpModal() {
        if (isHelpVisible) {
            hideHelpModal();
        } else {
            showHelpModal();
        }
    }

    function showHelpModal() {
        createHelpModal();
        helpModal.classList.add('visible');
        isHelpVisible = true;
    }

    function hideHelpModal() {
        if (helpModal) {
            helpModal.classList.remove('visible');
        }
        isHelpVisible = false;
    }

    // ========================================================================
    // MAIN KEYBOARD HANDLER
    // ========================================================================

    function handleKeyDown(event) {
        // Don't interfere with typing
        if (isTyping() && event.key !== 'Escape') {
            return;
        }

        // Don't interfere with dodec-controls on 3D page
        if (isDodecConflict(event.key)) {
            return; // Let dodec-controls handle it
        }

        // Find matching shortcut
        const key = event.key;
        const shortcut = SHORTCUTS[key];

        if (shortcut) {
            // Check if category is enabled
            const category = shortcut.category || 'general';
            const categoryEnabled = CONFIG.enabled[category] !== false;

            if (categoryEnabled && shortcut.action) {
                shortcut.action(event);
            }
        }
    }

    // ========================================================================
    // INITIALIZATION
    // ========================================================================

    function init() {
        document.addEventListener('keydown', handleKeyDown);

        // Log with page awareness info
        if (isOn3DPage()) {
            console.log('[Quannex] Keyboard shortcuts initialized (3D page mode - deferring R/P/Space to dodec-controls). Press ? for help.');
        } else {
            console.log('[Quannex] Keyboard shortcuts initialized. Press ? for help.');
        }
    }

    // Auto-init when DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ========================================================================
    // EXPORTS
    // ========================================================================

    const QuannexShortcuts = {
        // Help modal
        showHelp: showHelpModal,
        hideHelp: hideHelpModal,
        toggleHelp: toggleHelpModal,

        // Configuration
        CONFIG,
        SHORTCUTS,

        // Enable/disable
        enable: (category) => { CONFIG.enabled[category] = true; },
        disable: (category) => { CONFIG.enabled[category] = false; },

        // Page awareness
        isOn3DPage,
        isDodecConflict,

        // Add custom shortcut
        register: (key, description, action, category = 'general') => {
            SHORTCUTS[key] = { description, action, category };
            updateHelpContent();
        }
    };

    // Browser export
    global.QuannexShortcuts = QuannexShortcuts;

    // CommonJS export
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = QuannexShortcuts;
    }

})(typeof window !== 'undefined' ? window : this);
