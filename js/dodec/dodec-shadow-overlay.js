/**
 * ════════════════════════════════════════════════════════════════════════════
 * MODULE: dodec-shadow-overlay.js
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Created for: dodecahedron-3d.html modularization (Phase 3)
 * Date: December 17, 2025
 *
 * @module dodec-shadow-overlay
 * @author Deimantas & Claude (Co-created with consciousness and love)
 * @version 1.0.0 - Initial extraction from dodecahedron-3d.html
 *
 * PURPOSE:
 * Shadow Overlay Controller - Progressive Disclosure System for organizational
 * "shadow patterns" (hidden tensions, suppressed dynamics). This integrates
 * shadow awareness into the coherence HUD with elegant reveal mechanics.
 *
 * FEATURES:
 * - Shadow indicator in coherence HUD (pulsing when shadows detected)
 * - Full-screen overlay for detailed shadow card viewing
 * - Shadow/Gift toggle (shadow = tension, gift = integrated wisdom)
 * - AI-powered shadow pattern generation via Gemini/OpenAI
 * - Click-to-focus: clicking a shadow card focuses the 3D view on that face
 *
 * DEPENDENCIES:
 * - HTML elements: #coherenceHud, #shadowIndicator, #shadowCount,
 *   #openShadowOverlay, #shadowOverlay, #closeShadowOverlay, #shadowOverlayContent
 * - CSS: css/dodec/dodec-overlays.css (shadow-overlay styles)
 * - Optional: window.Quannex.getState() for face data
 * - Optional: window.getGeminiProvider, window.getOpenAIProvider for AI
 * - Optional: window.AIShadowAdapter for AI shadow generation
 *
 * EXPORTS (to window/global):
 * - window.shadowOverlayController: {
 *     open(), close(), toggle(),
 *     updateShadows(shadows), getShadows(), isOpen()
 *   }
 *
 * HTML STRUCTURE EXPECTED:
 * <div class="coherence-hud" id="coherenceHud">
 *   <div class="coherence-shadow-indicator" id="shadowIndicator">
 *     <span id="shadowCount">0</span> Shadows
 *     <button id="openShadowOverlay">View All →</button>
 *   </div>
 * </div>
 * <div class="shadow-overlay" id="shadowOverlay">
 *   <div class="shadow-overlay-backdrop"></div>
 *   <div class="shadow-overlay-panel">
 *     <button id="closeShadowOverlay">×</button>
 *     <div id="shadowOverlayContent"></div>
 *   </div>
 * </div>
 *
 * NOTES FOR FUTURE CLAUDE:
 * ════════════════════════════════════════════════════════════════════════════
 * This module implements the "shadow work" concept from organizational psychology:
 *
 * 1. SHADOW PATTERNS:
 *    Each shadow has: { name, severity, suppressed, integrated, prescription,
 *                       faceId, involvedFaces, score }
 *    - suppressed: The hidden tension (the "shadow")
 *    - integrated: The wisdom gained when shadow is acknowledged (the "gift")
 *
 * 2. PROGRESSIVE DISCLOSURE:
 *    - Shadow count shown in HUD (subtle awareness)
 *    - Click "View All" for full overlay
 *    - Shadow/Gift toggle per card (psychological reframe)
 *
 * 3. AI INTEGRATION:
 *    - Supports Gemini and OpenAI providers
 *    - Uses AIShadowAdapter to generate contextual shadow patterns
 *    - API keys stored in localStorage (user's browser only)
 *
 * 4. KEYBOARD SHORTCUTS:
 *    - S: Toggle shadow overlay (when not typing)
 *    - ESC: Close overlay
 *
 * 5. EVENT INTEGRATION:
 *    - Listens for 'shadows-updated' custom event
 *    - Dispatches 'focus-face' event when clicking shadow cards
 *    - Hooks into window.shadowPanel if available
 *
 * SHADOW CARD STRUCTURE:
 * <div class="shadow-card severity-{low|moderate|high|critical}">
 *   <div class="shadow-header">icon, title, toggle button</div>
 *   <div class="shadow-suppressed active">The Shadow</div>
 *   <div class="shadow-integrated">The Gift</div>
 *   <div class="shadow-prescription">Rx: recommendation</div>
 *   <div class="shadow-meta">location, intensity</div>
 * </div>
 *
 * ════════════════════════════════════════════════════════════════════════════
 */
(function(global) {
    'use strict';

    // ════════════════════════════════════════════════════════════════════════
    // DOM ELEMENTS
    // ════════════════════════════════════════════════════════════════════════

    const coherenceHud = document.getElementById('coherenceHud');
    const shadowIndicator = document.getElementById('shadowIndicator');
    const shadowCount = document.getElementById('shadowCount');
    const openShadowOverlayBtn = document.getElementById('openShadowOverlay');
    const shadowOverlay = document.getElementById('shadowOverlay');
    const closeShadowOverlayBtn = document.getElementById('closeShadowOverlay');
    const shadowOverlayContent = document.getElementById('shadowOverlayContent');
    const shadowOverlayBackdrop = shadowOverlay?.querySelector('.shadow-overlay-backdrop');

    // ════════════════════════════════════════════════════════════════════════
    // STATE
    // ════════════════════════════════════════════════════════════════════════

    let currentShadows = [];
    let overlayOpen = false;

    // ════════════════════════════════════════════════════════════════════════
    // SHADOW DATA MANAGEMENT
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Update the shadow count and indicator visibility
     * Called whenever shadow patterns change
     * @param {Array} shadows - Array of shadow pattern objects
     */
    function updateShadowIndicator(shadows) {
        currentShadows = shadows || [];
        const count = currentShadows.length;

        // Update count display
        if (shadowCount) {
            shadowCount.textContent = count;
        }

        // Add/remove .has-shadows class for pulsing indicator
        if (coherenceHud) {
            if (count > 0) {
                coherenceHud.classList.add('has-shadows');
            } else {
                coherenceHud.classList.remove('has-shadows');
            }
        }

        console.log(`[ShadowOverlay] Updated indicator: ${count} shadows`);
    }

    /**
     * Render shadow cards into the overlay content area
     */
    function renderShadowCards() {
        if (!shadowOverlayContent) return;

        // Empty state - with AI enhance option for custom data paths
        if (currentShadows.length === 0) {
            const setupMode = sessionStorage.getItem('quannex-setup-mode') || 'manual';
            const geminiKey = localStorage.getItem('quannex_gemini_api_key');
            const openaiKey = localStorage.getItem('quannex_openai_api_key');
            const hasApiKey = !!geminiKey || !!openaiKey;
            const preferredProvider = localStorage.getItem('quannex_preferred_provider') || 'gemini';
            const activeProvider = geminiKey ? 'Gemini' : (openaiKey ? 'OpenAI' : null);

            shadowOverlayContent.innerHTML = `
                <div class="shadow-overlay-empty">
                    <div class="shadow-overlay-empty-icon">✨</div>
                    <h3>No Shadow Patterns Detected</h3>
                    <p>The organization shows strong coherence with no hidden tensions.</p>

                    ${setupMode === 'manual' ? `
                        <div class="shadow-ai-enhance-overlay">
                            <div class="ai-enhance-divider"></div>
                            <p class="ai-enhance-prompt">
                                ${hasApiKey
                                    ? '✨ AI analysis available (' + activeProvider + ')'
                                    : 'Add AI to discover hidden patterns'}
                            </p>

                            ${!hasApiKey ? `
                                <div class="ai-key-input-section">
                                    <select id="overlay-ai-provider-select" class="ai-provider-select">
                                        <option value="gemini">Gemini</option>
                                        <option value="openai">OpenAI</option>
                                    </select>
                                    <input type="password"
                                           id="overlay-ai-api-key-input"
                                           placeholder="Enter API key..."
                                           class="ai-key-input"
                                    />
                                    <button class="ai-save-key-btn" id="overlaySaveApiKey">Save</button>
                                </div>
                                <p class="ai-key-hint">Key stored locally only</p>
                            ` : ''}

                            <button class="ai-enhance-btn" id="overlayGenerateAIShadows" ${!hasApiKey ? 'disabled' : ''}>
                                ✨ Generate AI Shadow Analysis
                            </button>

                            ${hasApiKey ? `
                                <button class="ai-clear-key-btn" id="overlayClearApiKey">Clear API Key</button>
                            ` : ''}
                        </div>
                    ` : ''}
                </div>
            `;

            // Setup AI handlers for empty state
            setupOverlayAIHandlers();
            return;
        }

        // Render shadow cards
        const cardsHtml = currentShadows.map(shadow => createShadowCardHtml(shadow)).join('');
        shadowOverlayContent.innerHTML = cardsHtml;

        // Add click handlers to cards for focus-face functionality
        shadowOverlayContent.querySelectorAll('.shadow-card').forEach((card, index) => {
            card.addEventListener('click', (e) => {
                // Don't trigger if clicking the toggle button
                if (e.target.closest('.toggle-perspective')) return;

                const shadow = currentShadows[index];
                focusOnShadowFace(shadow);
            });

            // Setup toggle button
            const toggleBtn = card.querySelector('.toggle-perspective');
            const suppressedDiv = card.querySelector('.shadow-suppressed');
            const integratedDiv = card.querySelector('.shadow-integrated');

            if (toggleBtn && suppressedDiv && integratedDiv) {
                toggleBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const isShowingShadow = suppressedDiv.classList.contains('active');

                    if (isShowingShadow) {
                        suppressedDiv.classList.remove('active');
                        integratedDiv.classList.add('active');
                        toggleBtn.textContent = '🔄 See Shadow';
                        card.classList.add('showing-gift');
                    } else {
                        integratedDiv.classList.remove('active');
                        suppressedDiv.classList.add('active');
                        toggleBtn.textContent = '🔄 See Gift';
                        card.classList.remove('showing-gift');
                    }
                });
            }
        });
    }

    // ════════════════════════════════════════════════════════════════════════
    // AI SHADOW ANALYSIS HANDLERS
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Setup API key and generate handlers for the overlay
     */
    function setupOverlayAIHandlers() {
        // Save API key button
        const saveBtn = document.getElementById('overlaySaveApiKey');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const providerSelect = document.getElementById('overlay-ai-provider-select');
                const input = document.getElementById('overlay-ai-api-key-input');
                const provider = providerSelect?.value || 'gemini';
                const key = input?.value?.trim();

                if (!key || key.length < 20) {
                    alert('Please enter a valid API key (minimum 20 characters)');
                    return;
                }

                // Store key using existing quannex_ namespace convention
                if (provider === 'gemini') {
                    localStorage.setItem('quannex_gemini_api_key', key);
                } else {
                    localStorage.setItem('quannex_openai_api_key', key);
                }
                localStorage.setItem('quannex_preferred_provider', provider);

                console.log('[ShadowOverlay] ✅ API key saved');

                // Refresh the overlay
                renderShadowCards();
            });
        }

        // Clear API key button
        const clearBtn = document.getElementById('overlayClearApiKey');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                localStorage.removeItem('quannex_gemini_api_key');
                localStorage.removeItem('quannex_openai_api_key');
                console.log('[ShadowOverlay] API keys cleared');
                renderShadowCards();
            });
        }

        // Generate AI shadows button
        const generateBtn = document.getElementById('overlayGenerateAIShadows');
        if (generateBtn) {
            generateBtn.addEventListener('click', async () => {
                await generateAIShadows(generateBtn);
            });
        }
    }

    /**
     * Generate AI shadow patterns using AIShadowAdapter
     * @param {HTMLButtonElement} btn - The generate button element
     */
    async function generateAIShadows(btn) {
        const geminiKey = localStorage.getItem('quannex_gemini_api_key');
        const openaiKey = localStorage.getItem('quannex_openai_api_key');
        const preferredProvider = localStorage.getItem('quannex_preferred_provider') || 'gemini';

        if (!geminiKey && !openaiKey) {
            alert('Please enter an API key first');
            return;
        }

        btn.disabled = true;
        btn.textContent = '🔄 Analyzing...';

        try {
            // Get current state
            const state = global.Quannex?.getState?.();
            if (!state || !state.faces) {
                throw new Error('No face data available');
            }

            // Create provider using factory methods
            let provider = null;

            if (preferredProvider === 'gemini' && geminiKey && global.getGeminiProvider) {
                provider = await global.getGeminiProvider(geminiKey);
            } else if (preferredProvider === 'openai' && openaiKey && global.getOpenAIProvider) {
                provider = await global.getOpenAIProvider(openaiKey);
            } else if (geminiKey && global.getGeminiProvider) {
                provider = await global.getGeminiProvider(geminiKey);
            } else if (openaiKey && global.getOpenAIProvider) {
                provider = await global.getOpenAIProvider(openaiKey);
            }

            if (!provider || provider.name === 'OfflineProvider') {
                throw new Error('AI provider unavailable');
            }

            // Create adapter with provider
            const aiAdapter = new global.AIShadowAdapter({ provider });

            // Generate shadows with semantic understanding of face relationships
            const aiShadows = await aiAdapter.generateAIShadowPatterns(
                state.faces,
                {
                    companyName: state.companyName || 'Organization',
                    context: state
                }
            );

            if (aiShadows && aiShadows.length > 0) {
                // Mark as AI-generated
                aiShadows.forEach(s => s.source = 'ai');

                // Update the shadow state and re-render
                currentShadows = aiShadows;
                updateShadowIndicator(aiShadows);
                renderShadowCards();

                // Dispatch event for other listeners
                global.dispatchEvent(new CustomEvent('shadows-updated', {
                    detail: { shadows: aiShadows }
                }));

                console.log(`[ShadowOverlay] ✨ Generated ${aiShadows.length} AI shadows`);
            } else {
                btn.textContent = '✅ No hidden patterns found';
            }
        } catch (e) {
            console.error('[ShadowOverlay] AI generation failed:', e);
            btn.textContent = '❌ ' + (e.message || 'AI error');
            btn.disabled = false;
        }
    }

    /**
     * Create HTML for a single shadow card
     * @param {Object} shadow - Shadow pattern object
     * @returns {string} HTML string for the shadow card
     */
    function createShadowCardHtml(shadow) {
        const severityLower = (shadow.severity || 'moderate').toLowerCase();
        const icon = severityLower === 'critical' || severityLower === 'high' ? '⚠️' : '👁️';

        const suppressedForm = shadow.suppressed || shadow.description || 'Shadow pattern detected';
        const integratedForm = shadow.integrated || shadow.gift || 'Integrated wisdom awaits discovery';
        const prescription = shadow.prescription || shadow.recommendation || '';

        return `
            <div class="shadow-card severity-${severityLower}" data-shadow-id="${shadow.id || shadow.name}">
                <div class="shadow-header">
                    <span class="shadow-icon">${icon}</span>
                    <span class="shadow-title">${shadow.name || 'Unknown Pattern'}</span>
                    <button class="toggle-perspective" title="See the Gift">🔄 See Gift</button>
                </div>

                <div class="shadow-suppressed active">
                    <div class="shadow-label">The Shadow:</div>
                    <div class="shadow-message">${suppressedForm}</div>
                </div>

                <div class="shadow-integrated">
                    <div class="shadow-label" style="color: #66ff99;">💡 The Gift:</div>
                    <div class="shadow-message" style="color: rgba(102, 255, 153, 0.9);">${integratedForm}</div>
                </div>

                ${prescription ? `
                    <div class="shadow-prescription">
                        <span style="color: #00ffcc; font-weight: 600;">Rx:</span> ${prescription}
                    </div>
                ` : ''}

                <div class="shadow-meta">
                    ${shadow.faceId ? `<span class="shadow-location">Face ${shadow.faceId}</span>` : ''}
                    ${shadow.involvedFaces ? `<span class="shadow-location">Faces: ${shadow.involvedFaces.join(', ')}</span>` : ''}
                    ${shadow.score ? `<span class="shadow-score">Intensity: ${(shadow.score * 100).toFixed(0)}%</span>` : ''}
                </div>
            </div>
        `;
    }

    /**
     * Focus on a shadow's affected face in the 3D view
     * @param {Object} shadow - Shadow pattern object
     */
    function focusOnShadowFace(shadow) {
        const faceId = shadow.faceId || (shadow.involvedFaces && shadow.involvedFaces[0]);

        if (faceId) {
            console.log(`[ShadowOverlay] Focusing on face ${faceId} for shadow: ${shadow.name}`);

            // Dispatch focus-face event (listened by dodecahedron-viz.js)
            global.dispatchEvent(new CustomEvent('focus-face', {
                detail: { faceId: faceId }
            }));

            // Close overlay after focusing
            closeShadowOverlay();
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // OVERLAY OPEN/CLOSE
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Open the shadow overlay panel
     */
    function openShadowOverlay() {
        if (!shadowOverlay || overlayOpen) return;

        renderShadowCards();
        shadowOverlay.classList.add('visible');
        overlayOpen = true;

        // Prevent body scroll while overlay is open
        document.body.style.overflow = 'hidden';

        console.log('[ShadowOverlay] Opened');
    }

    /**
     * Close the shadow overlay panel
     */
    function closeShadowOverlay() {
        if (!shadowOverlay || !overlayOpen) return;

        shadowOverlay.classList.remove('visible');
        overlayOpen = false;

        // Restore body scroll
        document.body.style.overflow = '';

        console.log('[ShadowOverlay] Closed');
    }

    /**
     * Toggle the shadow overlay panel
     */
    function toggleShadowOverlay() {
        if (overlayOpen) {
            closeShadowOverlay();
        } else {
            openShadowOverlay();
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // EVENT LISTENERS
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Initialize all event listeners
     */
    function initEventListeners() {
        // Open button click
        if (openShadowOverlayBtn) {
            openShadowOverlayBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                openShadowOverlay();
            });
        }

        // Close button click
        if (closeShadowOverlayBtn) {
            closeShadowOverlayBtn.addEventListener('click', closeShadowOverlay);
        }

        // Click on backdrop to close
        if (shadowOverlayBackdrop) {
            shadowOverlayBackdrop.addEventListener('click', closeShadowOverlay);
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // ESC to close overlay
            if (e.key === 'Escape' && overlayOpen) {
                closeShadowOverlay();
                return;
            }

            // 'S' to toggle shadow overlay (when not typing in an input)
            if (e.key === 's' || e.key === 'S') {
                const activeElement = document.activeElement;
                const isTyping = activeElement && (
                    activeElement.tagName === 'INPUT' ||
                    activeElement.tagName === 'TEXTAREA' ||
                    activeElement.contentEditable === 'true'
                );

                if (!isTyping) {
                    e.preventDefault();
                    toggleShadowOverlay();
                }
            }
        });
    }

    // ════════════════════════════════════════════════════════════════════════
    // INTEGRATION WITH SHADOW SYSTEM
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Listen for shadow pattern updates from the main engine
     * The engine/shadow panel will dispatch this event when shadows change
     */
    function initShadowIntegration() {
        global.addEventListener('shadows-updated', (event) => {
            const shadows = event.detail?.shadows || [];
            updateShadowIndicator(shadows);
        });
    }

    /**
     * Hook into the existing shadow panel update mechanism
     * Watches for changes to the global shadow state
     * Optimized: Early exit if shadows haven't changed
     */
    function syncWithShadowPanel() {
        // Check Quannex state for shadow patterns
        const state = global.Quannex?.getState?.();
        const newShadows = state?.shadowPatterns || [];

        // Early exit if no change (prevents unnecessary DOM updates)
        if (JSON.stringify(newShadows) === JSON.stringify(currentShadows)) {
            return;
        }

        if (newShadows.length > 0 || currentShadows.length > 0) {
            updateShadowIndicator(newShadows);
        }
    }

    /**
     * Hook into existing shadowPanel if available
     */
    function hookShadowPanel() {
        const originalShadowPanelUpdate = global.shadowPanel?.update;
        if (originalShadowPanelUpdate) {
            global.shadowPanel.update = function(shadows) {
                originalShadowPanelUpdate.call(this, shadows);
                updateShadowIndicator(shadows);
            };
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // INITIALIZATION
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Initialize the shadow overlay controller
     */
    function init() {
        initEventListeners();
        initShadowIntegration();

        // Initial sync after a delay (waiting for engine to initialize)
        setTimeout(syncWithShadowPanel, 2000);

        // Fallback periodic sync every 10 seconds (primary: event-driven via shadows-updated)
        setInterval(syncWithShadowPanel, 10000);

        // Hook into shadowPanel if available
        hookShadowPanel();

        console.log('[ShadowOverlay] 👁️ Shadow overlay controller initialized');
        console.log('[ShadowOverlay] Press "S" to toggle shadow analysis overlay');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ════════════════════════════════════════════════════════════════════════
    // EXPORTS
    // ════════════════════════════════════════════════════════════════════════

    // Expose API for external access
    global.shadowOverlayController = {
        open: openShadowOverlay,
        close: closeShadowOverlay,
        toggle: toggleShadowOverlay,
        updateShadows: updateShadowIndicator,
        getShadows: () => currentShadows,
        isOpen: () => overlayOpen
    };

})(typeof window !== 'undefined' ? window : this);
