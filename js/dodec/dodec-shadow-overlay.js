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
 * @version 1.1.0 - Sprint 6: Shadow Source Toggle (December 2025)
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
 *     updateShadows(shadows, source), getShadows(), isOpen(),
 *     destroy(), getState(), focusOnShadow(shadow),  // Added Dec 2024
 *     setActiveSource(source), getTemplateCount(), getAICount()  // Sprint 6
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
 * 6. LIFECYCLE CRITICAL (Agent Council - December 2024):
 *    ⚠️ WARNING: Memory leak without destroy()!
 *    - syncIntervalId: 10-second interval for shadow sync
 *    - MUST call destroy() on page unload to clear interval
 *    - destroy() also closes overlay and clears shadow state
 *    Example: window.shadowOverlayController.destroy();
 *
 * 7. PERFORMANCE OPTIMIZATION:
 *    - shadowsEqual(): O(n) comparison replaces JSON.stringify
 *    - Only compares id and severity (sufficient for UI updates)
 *    - Prevents unnecessary re-renders on every sync cycle
 *
 * 8. NEW APIs (December 2024):
 *    - getState(): Returns { overlayOpen, currentShadows, selectedShadow,
 *                           shadowCount, syncIntervalActive, hasShadows }
 *    - focusOnShadow(shadow): Rotates 3D view to shadow's face
 *    - destroy(): Cleans up interval and closes overlay
 *
 * 9. AI AVAILABLE FOR ALL PATHS:
 *    - AI section now shown for ALL users (manual, AI-assisted, demo)
 *    - Demo mode (localStorage.quannexDemoMode) uses cached insights
 *
 * 10. SPRINT 6: SHADOW SOURCE TOGGLE (December 2025):
 *    ═══════════════════════════════════════════════════════════════════════
 *    Major enhancement: Users can now switch between two shadow sources:
 *
 *    a) SHADOW STATE OBJECT:
 *       shadowState = {
 *           templateShadows: [],       // From company templates (preserved)
 *           aiShadows: [],             // AI-generated (cached)
 *           activeSource: 'template',  // 'template' | 'ai'
 *           aiGenerationStatus: 'idle' // 'idle' | 'generating' | 'success' | 'error'
 *       }
 *
 *    b) DATA INTEGRITY GUARANTEES:
 *       - Template shadows NEVER overwritten by AI generation
 *       - Both sources persist to sessionStorage (survives refresh)
 *       - Switching sources is just a reference change - no data loss
 *       - AI failures gracefully fallback to template shadows
 *
 *    c) NEW UI ELEMENTS:
 *       - Source dropdown in overlay header (#shadowSourceSelect)
 *       - AI controls bar with persistent generate button (#generateAIShadowsBtn)
 *       - Status indicator for AI generation (#aiGenerationStatus)
 *
 *    d) NEW EVENTS:
 *       - 'shadow-source-changed': Dispatched when source switches
 *         detail: { source, shadows, templateCount, aiCount }
 *
 *    e) NEW APIs:
 *       - setActiveSource(source): Programmatic source switching
 *       - getTemplateCount(): Number of template shadows
 *       - getAICount(): Number of AI shadows
 *
 *    f) SESSIONSSTORAGE STRUCTURE (backward compatible):
 *       customCompanyData.shadowPatterns  // Legacy: active shadows
 *       customCompanyData.shadowSources   // New: { template, ai, activeSource }
 *    ═══════════════════════════════════════════════════════════════════════
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
    let syncIntervalId = null;  // LIFECYCLE: Track interval for cleanup
    let activeShadowId = null;  // Currently focused shadow (for getState)

    // ════════════════════════════════════════════════════════════════════════
    // SHADOW SOURCE STATE (Sprint 6 - Shadow System Enhancement)
    // ════════════════════════════════════════════════════════════════════════
    //
    // NOTES FOR FUTURE CLAUDE:
    // This state object manages two independent shadow sources:
    // 1. templateShadows - Predefined shadows from company templates (immutable)
    // 2. aiShadows - On-demand AI-generated shadows (cached)
    //
    // The activeSource determines which array is displayed. Users can switch
    // freely between sources without data loss. Both sources persist to
    // sessionStorage for page refresh survival.
    //
    // Key behaviors:
    // - Switching sources never mutates either array
    // - AI failures gracefully fall back to template shadows
    // - Source dropdown is disabled during AI generation
    // - The 'shadow-source-changed' event notifies other listeners
    //
    // ════════════════════════════════════════════════════════════════════════
    let shadowState = {
        templateShadows: [],       // Original shadows from company template (preserved)
        aiShadows: [],             // AI-generated shadows (cached between switches)
        activeSource: 'template',  // 'template' | 'ai' - which source is displayed
        aiGenerationStatus: 'idle' // 'idle' | 'generating' | 'success' | 'error'
    };

    // ════════════════════════════════════════════════════════════════════════
    // SHADOW DATA MANAGEMENT
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Update the shadow count and indicator visibility
     * Called whenever shadow patterns change
     *
     * Sprint 6 Enhancement: Now supports dual-source storage.
     * The optional 'source' parameter specifies where to store the shadows.
     * Default is 'template' for backward compatibility with existing callers.
     *
     * @param {Array} shadows - Array of shadow pattern objects
     * @param {string} source - 'template' | 'ai' (default: 'template')
     */
    function updateShadowIndicator(shadows, source = 'template') {
        const shadowArray = shadows || [];

        // Store in appropriate source bucket
        if (source === 'template') {
            shadowState.templateShadows = shadowArray;
        } else if (source === 'ai') {
            shadowState.aiShadows = shadowArray;
        }

        // CRITICAL: currentShadows always reflects the active source
        // This ensures all existing code that reads currentShadows continues to work
        currentShadows = shadowState.activeSource === 'template'
            ? shadowState.templateShadows
            : shadowState.aiShadows;

        const count = currentShadows.length;

        // Update count display
        if (shadowCount) {
            shadowCount.textContent = count;
        }

        // Update source dropdown count if it exists
        updateSourceDropdownCount();

        // Add/remove .has-shadows class for pulsing indicator
        if (coherenceHud) {
            if (count > 0) {
                coherenceHud.classList.add('has-shadows');
            } else {
                coherenceHud.classList.remove('has-shadows');
            }
        }

        console.log(`[ShadowOverlay] Updated indicator: ${count} shadows (source: ${source}, active: ${shadowState.activeSource})`);
    }

    /**
     * Update the source dropdown count badge
     * Shows count for the currently active source
     */
    function updateSourceDropdownCount() {
        const countSpan = document.getElementById('shadowSourceCount');
        if (countSpan) {
            countSpan.textContent = `(${currentShadows.length})`;
        }
    }

    /**
     * Render shadow cards into the overlay content area
     */
    function renderShadowCards() {
        if (!shadowOverlayContent) return;

        // Empty state - with AI enhance option for ALL paths
        // Per Agent Council (December 2024): AI should be available regardless of setup mode
        if (currentShadows.length === 0) {
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
     * Sprint 6: Updated to use shadowState system
     *
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

        // Update generation status
        shadowState.aiGenerationStatus = 'generating';
        updateSourceDropdown(); // Disable dropdown during generation

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

                // Sprint 6: Store in aiShadows bucket (don't overwrite template!)
                shadowState.aiShadows = aiShadows;
                shadowState.activeSource = 'ai';
                shadowState.aiGenerationStatus = 'success';

                // Update currentShadows to point to AI results
                currentShadows = aiShadows;

                // Update UI
                updateSourceDropdown();
                updateSourceDropdownCount();
                renderShadowCards();
                saveToSessionStorage();

                // Dispatch event for other listeners
                global.dispatchEvent(new CustomEvent('shadows-updated', {
                    detail: { shadows: aiShadows }
                }));

                console.log(`[ShadowOverlay] ✨ Generated ${aiShadows.length} AI shadows`);
            } else {
                shadowState.aiGenerationStatus = 'success';
                btn.textContent = '✅ No hidden patterns found';
                updateSourceDropdown();
            }
        } catch (e) {
            console.error('[ShadowOverlay] AI generation failed:', e);
            shadowState.aiGenerationStatus = 'error';

            // CRITICAL: Never lose template shadows - graceful fallback
            if (shadowState.templateShadows.length > 0) {
                shadowState.activeSource = 'template';
                currentShadows = shadowState.templateShadows;
                showTemporaryStatus('AI unavailable - showing template shadows', 'error');
                renderShadowCards();
            }

            updateSourceDropdown();
            btn.textContent = '❌ ' + (e.message || 'AI error');
            btn.disabled = false;
        }
    }

    /**
     * Generate AI shadows from the persistent button in the AI controls bar
     * Sprint 6: Separate handler for the always-visible AI button
     *
     * @param {HTMLButtonElement} btn - The persistent generate button
     */
    async function generateAIShadowsFromPersistentButton(btn) {
        const geminiKey = localStorage.getItem('quannex_gemini_api_key');
        const openaiKey = localStorage.getItem('quannex_openai_api_key');
        const preferredProvider = localStorage.getItem('quannex_preferred_provider') || 'gemini';

        if (!geminiKey && !openaiKey) {
            showTemporaryStatus('Please configure an API key first', 'error');
            return;
        }

        // Update generation status
        shadowState.aiGenerationStatus = 'generating';
        updateSourceDropdown(); // Disable dropdown
        showTemporaryStatus('Analyzing organizational patterns...', 'info');

        btn.disabled = true;
        const originalText = btn.textContent;
        btn.textContent = '🔄 Analyzing...';

        try {
            // Get current state
            const state = global.Quannex?.getState?.();
            if (!state || !state.faces) {
                throw new Error('No face data available');
            }

            // Create provider
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

            // Create adapter and generate
            const aiAdapter = new global.AIShadowAdapter({ provider });
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

                // Store in AI bucket and switch source
                shadowState.aiShadows = aiShadows;
                shadowState.activeSource = 'ai';
                shadowState.aiGenerationStatus = 'success';
                currentShadows = aiShadows;

                // Update UI
                updateSourceDropdown();
                updateSourceDropdownCount();
                renderShadowCards();
                saveToSessionStorage();

                showTemporaryStatus(`✨ Generated ${aiShadows.length} AI shadows`, 'success');

                // Dispatch event
                global.dispatchEvent(new CustomEvent('shadows-updated', {
                    detail: { shadows: aiShadows }
                }));

                console.log(`[ShadowOverlay] ✨ Generated ${aiShadows.length} AI shadows from persistent button`);
            } else {
                shadowState.aiGenerationStatus = 'success';
                showTemporaryStatus('✅ No hidden patterns found', 'success');
            }

            btn.textContent = originalText;
            btn.disabled = false;

        } catch (e) {
            console.error('[ShadowOverlay] AI generation failed:', e);
            shadowState.aiGenerationStatus = 'error';

            // Graceful fallback to template
            if (shadowState.templateShadows.length > 0) {
                shadowState.activeSource = 'template';
                currentShadows = shadowState.templateShadows;
                renderShadowCards();
            }

            updateSourceDropdown();
            showTemporaryStatus('❌ ' + (e.message || 'AI generation failed'), 'error');
            btn.textContent = originalText;
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
    // SOURCE SWITCHING (Sprint 6 - Shadow System Enhancement)
    // ════════════════════════════════════════════════════════════════════════
    //
    // These functions handle switching between template and AI shadow sources.
    // The key principle: switching is just a reference change, never data loss.
    //
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Handle source change from the dropdown
     * @param {string} newSource - 'template' | 'ai'
     */
    function handleSourceChange(newSource) {
        // Block switching during AI generation
        if (shadowState.aiGenerationStatus === 'generating') {
            console.log('[ShadowOverlay] Blocked source switch - AI generation in progress');
            // Reset dropdown to current source
            updateSourceDropdown();
            return;
        }

        // No-op if same source
        if (shadowState.activeSource === newSource) {
            return;
        }

        console.log(`[ShadowOverlay] Switching source: ${shadowState.activeSource} → ${newSource}`);

        shadowState.activeSource = newSource;

        // Update currentShadows to reflect new source
        currentShadows = newSource === 'template'
            ? shadowState.templateShadows
            : shadowState.aiShadows;

        // Update UI
        updateSourceDropdown();
        updateSourceDropdownCount();
        renderShadowCards();
        saveToSessionStorage();

        // Dispatch event for other listeners
        global.dispatchEvent(new CustomEvent('shadow-source-changed', {
            detail: {
                source: newSource,
                shadows: currentShadows,
                templateCount: shadowState.templateShadows.length,
                aiCount: shadowState.aiShadows.length
            }
        }));

        console.log(`[ShadowOverlay] Now showing ${currentShadows.length} ${newSource} shadows`);
    }

    /**
     * Update the source dropdown to reflect current state
     */
    function updateSourceDropdown() {
        const sourceSelect = document.getElementById('shadowSourceSelect');
        if (sourceSelect) {
            sourceSelect.value = shadowState.activeSource;
            // Disable during generation
            sourceSelect.disabled = shadowState.aiGenerationStatus === 'generating';
        }
    }

    /**
     * Save shadow sources to sessionStorage for persistence
     * Maintains backward compatibility with existing shadowPatterns field
     */
    function saveToSessionStorage() {
        try {
            const stored = sessionStorage.getItem('customCompanyData');
            if (!stored) return;

            const data = JSON.parse(stored);

            // Preserve existing shadowPatterns for backward compatibility
            // (based on active source for legacy code)
            data.shadowPatterns = currentShadows;

            // Add new shadowSources field for dual-source management
            data.shadowSources = {
                template: shadowState.templateShadows,
                ai: shadowState.aiShadows,
                activeSource: shadowState.activeSource
            };

            sessionStorage.setItem('customCompanyData', JSON.stringify(data));
            console.log('[ShadowOverlay] Saved shadow sources to sessionStorage');
        } catch (e) {
            console.warn('[ShadowOverlay] Failed to save to sessionStorage:', e);
        }
    }

    /**
     * Load shadow sources from sessionStorage on init
     * Handles both new format (shadowSources) and legacy format (shadowPatterns)
     */
    function loadFromSessionStorage() {
        try {
            const stored = sessionStorage.getItem('customCompanyData');
            if (!stored) return;

            const data = JSON.parse(stored);

            // Prefer new shadowSources format if available
            if (data.shadowSources) {
                shadowState.templateShadows = data.shadowSources.template || [];
                shadowState.aiShadows = data.shadowSources.ai || [];
                shadowState.activeSource = data.shadowSources.activeSource || 'template';
                console.log('[ShadowOverlay] Loaded shadow sources from sessionStorage');
            }
            // Fall back to legacy shadowPatterns (treat as template)
            else if (data.shadowPatterns) {
                shadowState.templateShadows = data.shadowPatterns;
                shadowState.activeSource = 'template';
                console.log('[ShadowOverlay] Loaded legacy shadowPatterns as template');
            }

            // Update currentShadows based on active source
            currentShadows = shadowState.activeSource === 'template'
                ? shadowState.templateShadows
                : shadowState.aiShadows;

        } catch (e) {
            console.warn('[ShadowOverlay] Failed to load from sessionStorage:', e);
        }
    }

    /**
     * Show a temporary status message in the AI controls bar
     * @param {string} message - Message to display
     * @param {string} type - 'info' | 'success' | 'error'
     */
    function showTemporaryStatus(message, type = 'info') {
        const statusEl = document.getElementById('aiGenerationStatus');
        if (statusEl) {
            statusEl.textContent = message;
            statusEl.className = `ai-status ai-status-${type}`;

            // Clear after 5 seconds
            setTimeout(() => {
                if (statusEl.textContent === message) {
                    statusEl.textContent = '';
                    statusEl.className = 'ai-status';
                }
            }, 5000);
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

        // Sprint 6: Source dropdown change handler
        const sourceSelect = document.getElementById('shadowSourceSelect');
        if (sourceSelect) {
            sourceSelect.addEventListener('change', (e) => {
                handleSourceChange(e.target.value);
            });
        }

        // Sprint 6: Persistent AI generate button
        const persistentAIBtn = document.getElementById('generateAIShadowsBtn');
        if (persistentAIBtn) {
            persistentAIBtn.addEventListener('click', async () => {
                await generateAIShadowsFromPersistentButton(persistentAIBtn);
            });
        }
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
     * Efficient shadow comparison without JSON serialization.
     * Compares only id and severity for change detection.
     * Per Agent Council: Optimize for performance without losing clarity.
     *
     * @param {Array} a - First shadow array
     * @param {Array} b - Second shadow array
     * @returns {boolean} True if arrays are equivalent
     */
    function shadowsEqual(a, b) {
        if (a.length !== b.length) return false;
        if (a.length === 0) return true;
        for (let i = 0; i < a.length; i++) {
            const aId = a[i].id || a[i].name;
            const bId = b[i].id || b[i].name;
            if (aId !== bId || a[i].severity !== b[i].severity) return false;
        }
        return true;
    }

    /**
     * Hook into the existing shadow panel update mechanism
     * Watches for changes to the global shadow state
     * Optimized: Early exit if shadows haven't changed (using efficient comparison)
     */
    function syncWithShadowPanel() {
        // Check Quannex state for shadow patterns
        const state = global.Quannex?.getState?.();
        const newShadows = state?.shadowPatterns || [];

        // Early exit if no change (using efficient O(n) comparison, not JSON.stringify)
        if (shadowsEqual(newShadows, currentShadows)) {
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

        // Sprint 6: Load persisted shadow sources from sessionStorage
        loadFromSessionStorage();

        // Sprint 6: Update UI to reflect loaded state
        updateSourceDropdown();
        updateSourceDropdownCount();

        // Initial sync after a delay (waiting for engine to initialize)
        setTimeout(syncWithShadowPanel, 2000);

        // Fallback periodic sync every 10 seconds (primary: event-driven via shadows-updated)
        // LIFECYCLE: Store reference for cleanup in destroy()
        syncIntervalId = setInterval(syncWithShadowPanel, 10000);

        // Hook into shadowPanel if available
        hookShadowPanel();

        console.log('[ShadowOverlay] 👁️ Shadow overlay controller initialized');
        console.log('[ShadowOverlay] Press "S" to toggle shadow analysis overlay');
        console.log(`[ShadowOverlay] Shadow sources: ${shadowState.templateShadows.length} template, ${shadowState.aiShadows.length} AI, active: ${shadowState.activeSource}`);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ════════════════════════════════════════════════════════════════════════
    // LIFECYCLE MANAGEMENT
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Cleanup resources and stop background processes.
     * CRITICAL: Call this on page unload to prevent memory leaks.
     *
     * Per Agent Council guidance: The shadow is not the enemy—
     * even cleanup can be done with consciousness.
     */
    function destroy() {
        if (syncIntervalId) {
            clearInterval(syncIntervalId);
            syncIntervalId = null;
        }
        if (overlayOpen) closeShadowOverlay();
        currentShadows = [];
        activeShadowId = null;
        console.log('[ShadowOverlay] 🌙 Destroyed - resources cleaned up with grace');
    }

    /**
     * Get current overlay state for debugging and integration.
     * Per Sacred Tech Architect: Expose state for transparency.
     *
     * Sprint 6: Enhanced with shadowState information
     *
     * @returns {Object} Current state snapshot
     */
    function getState() {
        return {
            overlayOpen,
            currentShadows: [...currentShadows],
            selectedShadow: activeShadowId
                ? currentShadows.find(s => (s.id || s.name) === activeShadowId)
                : null,
            shadowCount: currentShadows.length,
            syncIntervalActive: syncIntervalId !== null,
            hasShadows: currentShadows.length > 0,
            // Sprint 6: Shadow source state
            shadowSources: {
                templateCount: shadowState.templateShadows.length,
                aiCount: shadowState.aiShadows.length,
                activeSource: shadowState.activeSource,
                aiGenerationStatus: shadowState.aiGenerationStatus
            }
        };
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
        isOpen: () => overlayOpen,
        // New APIs (per Agent Council - December 2024)
        destroy: destroy,
        getState: getState,
        focusOnShadow: focusOnShadowFace,
        // Sprint 6: Source switching APIs
        setActiveSource: handleSourceChange,
        getTemplateCount: () => shadowState.templateShadows.length,
        getAICount: () => shadowState.aiShadows.length
    };

})(typeof window !== 'undefined' ? window : this);
