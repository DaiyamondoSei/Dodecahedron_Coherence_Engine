/**
 * Demo Orchestrator Logic
 *
 * Main navigation and state management for the demo flow
 */

// Global state
const demoState = {
    currentStep: 0,
    totalSteps: 5, // Now includes Step 0
    faceConfig: null,
    kpiMode: null, // 'quick' or 'full'
    kpiData: null,
    coherenceResults: null,
    completedSteps: [],
    selectedCompanyId: null, // Track which company template is selected
    loadedMappingContext: null // Store the loaded mapping context
};

// Re-entrancy guard to prevent infinite loop when clicking company cards
// (Fix for event handler loop bug observed during testing)
let _isSelectingCompanyTemplate = false;

/**
 * ========================================
 * SESSION EXPIRY MANAGER
 * ========================================
 *
 * Prevents users from losing work by:
 * 1. Warning at 25 minutes (5 min before expiry)
 * 2. Allowing session extension
 * 3. Graceful handling at 30 min expiry
 *
 * INTEGRITY FIX: Previously sessions expired silently.
 * ========================================
 */
const SessionManager = {
    SESSION_DURATION: 30 * 60 * 1000,    // 30 minutes in ms
    WARNING_THRESHOLD: 25 * 60 * 1000,   // 25 minutes - show warning
    CHECK_INTERVAL: 60 * 1000,           // Check every minute
    _checkTimer: null,
    _warningShown: false,
    _notificationElement: null,

    /**
     * Start monitoring the session
     */
    start() {
        this.stop(); // Clear any existing timer
        this._warningShown = false;
        this._checkTimer = setInterval(() => this._checkSession(), this.CHECK_INTERVAL);
        console.log('[SessionManager] Session monitoring started (30 min expiry, 25 min warning)');
    },

    /**
     * Stop monitoring
     */
    stop() {
        if (this._checkTimer) {
            clearInterval(this._checkTimer);
            this._checkTimer = null;
        }
        this._hideNotification();
    },

    /**
     * Check session age and show warnings
     */
    _checkSession() {
        try {
            const savedData = sessionStorage.getItem('customCompanyData');
            if (!savedData) return;

            const parsed = JSON.parse(savedData);
            const savedTime = new Date(parsed.timestamp);
            const elapsed = Date.now() - savedTime.getTime();
            const remaining = this.SESSION_DURATION - elapsed;
            const minutesRemaining = Math.ceil(remaining / 60000);

            // Session expired
            if (remaining <= 0) {
                this._handleExpiry();
                return;
            }

            // Show warning at 25 minutes (5 min remaining)
            if (elapsed >= this.WARNING_THRESHOLD && !this._warningShown) {
                this._showWarning(minutesRemaining);
            }

            // Update warning if already shown
            if (this._warningShown && this._notificationElement) {
                const timeText = this._notificationElement.querySelector('.session-time-remaining');
                if (timeText) {
                    timeText.textContent = `${minutesRemaining} minute${minutesRemaining !== 1 ? 's' : ''} remaining`;
                }
            }
        } catch (e) {
            console.warn('[SessionManager] Check failed:', e.message);
        }
    },

    /**
     * Show expiry warning notification
     */
    _showWarning(minutesRemaining) {
        this._warningShown = true;

        // Create notification if not exists
        if (!this._notificationElement) {
            this._notificationElement = document.createElement('div');
            this._notificationElement.id = 'session-expiry-warning';
            this._notificationElement.innerHTML = `
                <div class="session-warning-content">
                    <div class="session-warning-icon">⏰</div>
                    <div class="session-warning-text">
                        <strong>Session Expiring Soon</strong>
                        <span class="session-time-remaining">${minutesRemaining} minutes remaining</span>
                    </div>
                    <button class="session-extend-btn" onclick="SessionManager.extendSession()">
                        Extend Session
                    </button>
                    <button class="session-dismiss-btn" onclick="SessionManager._hideNotification()">
                        ✕
                    </button>
                </div>
            `;
            document.body.appendChild(this._notificationElement);

            // Add styles if not exists
            if (!document.getElementById('session-warning-styles')) {
                const style = document.createElement('style');
                style.id = 'session-warning-styles';
                style.textContent = `
                    #session-expiry-warning {
                        position: fixed;
                        bottom: 20px;
                        right: 20px;
                        background: linear-gradient(135deg, #1a1a2e, #16213e);
                        border: 1px solid #ffcc00;
                        border-radius: 12px;
                        padding: 16px 20px;
                        box-shadow: 0 4px 20px rgba(255, 204, 0, 0.3);
                        z-index: 10000;
                        animation: slideInWarning 0.3s ease-out;
                        max-width: 400px;
                    }
                    @keyframes slideInWarning {
                        from { transform: translateX(100%); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                    .session-warning-content {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                    }
                    .session-warning-icon {
                        font-size: 28px;
                        animation: pulseIcon 1s ease-in-out infinite;
                    }
                    @keyframes pulseIcon {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.1); }
                    }
                    .session-warning-text {
                        display: flex;
                        flex-direction: column;
                        gap: 4px;
                        color: white;
                    }
                    .session-warning-text strong {
                        color: #ffcc00;
                        font-size: 14px;
                    }
                    .session-time-remaining {
                        font-size: 12px;
                        color: rgba(255, 255, 255, 0.7);
                    }
                    .session-extend-btn {
                        background: linear-gradient(135deg, #00ffcc, #00cc99);
                        border: none;
                        border-radius: 6px;
                        padding: 8px 16px;
                        color: #000;
                        font-weight: 600;
                        cursor: pointer;
                        transition: transform 0.2s, box-shadow 0.2s;
                    }
                    .session-extend-btn:hover {
                        transform: scale(1.05);
                        box-shadow: 0 2px 10px rgba(0, 255, 204, 0.4);
                    }
                    .session-dismiss-btn {
                        background: transparent;
                        border: none;
                        color: rgba(255, 255, 255, 0.5);
                        font-size: 18px;
                        cursor: pointer;
                        padding: 4px 8px;
                        margin-left: auto;
                    }
                    .session-dismiss-btn:hover {
                        color: white;
                    }
                `;
                document.head.appendChild(style);
            }
        }

        this._notificationElement.style.display = 'block';
        console.log(`[SessionManager] ⚠️ Session expiry warning shown (${minutesRemaining} min remaining)`);
    },

    /**
     * Hide notification
     */
    _hideNotification() {
        if (this._notificationElement) {
            this._notificationElement.style.display = 'none';
        }
    },

    /**
     * Extend the session by updating timestamp
     */
    extendSession() {
        try {
            const savedData = sessionStorage.getItem('customCompanyData');
            if (savedData) {
                const parsed = JSON.parse(savedData);
                parsed.timestamp = new Date().toISOString();
                sessionStorage.setItem('customCompanyData', JSON.stringify(parsed));
                this._warningShown = false;
                this._hideNotification();
                console.log('[SessionManager] ✅ Session extended for another 30 minutes');

                // Show confirmation toast
                this._showToast('Session extended! You have 30 more minutes.');
            }
        } catch (e) {
            console.error('[SessionManager] Extension failed:', e);
        }
    },

    /**
     * Handle session expiry
     */
    _handleExpiry() {
        this.stop();
        console.log('[SessionManager] ❌ Session expired');

        // Show final notification
        if (this._notificationElement) {
            this._notificationElement.innerHTML = `
                <div class="session-warning-content">
                    <div class="session-warning-icon">⌛</div>
                    <div class="session-warning-text">
                        <strong style="color: #ff6666;">Session Expired</strong>
                        <span class="session-time-remaining">Your work has been cleared after 30 minutes of inactivity.</span>
                    </div>
                    <button class="session-extend-btn" onclick="location.reload()">
                        Start Fresh
                    </button>
                </div>
            `;
            this._notificationElement.style.borderColor = '#ff6666';
            this._notificationElement.style.display = 'block';
        }

        // Clear session
        sessionStorage.removeItem('customCompanyData');
    },

    /**
     * Show a brief toast notification
     */
    _showToast(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 20px;
            background: rgba(0, 255, 204, 0.9);
            color: #000;
            padding: 12px 20px;
            border-radius: 8px;
            font-weight: 600;
            z-index: 10001;
            animation: fadeInOut 2s ease-in-out forwards;
        `;
        toast.textContent = message;

        if (!document.getElementById('toast-animation-style')) {
            const style = document.createElement('style');
            style.id = 'toast-animation-style';
            style.textContent = `
                @keyframes fadeInOut {
                    0% { opacity: 0; transform: translateY(10px); }
                    15%, 85% { opacity: 1; transform: translateY(0); }
                    100% { opacity: 0; transform: translateY(-10px); }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    }
};

/**
 * ========================================
 * CROSS-WINDOW SYNCHRONIZATION (Issue #12 Fix)
 * ========================================
 *
 * Uses BroadcastChannel API to sync state between multiple windows/tabs.
 * When user modifies data in orchestrator, all open visualization views
 * (3D model, DNA helix, etc.) receive updates in real-time.
 *
 * Channel: 'quannex-sync'
 * Messages: { type: string, payload: any, timestamp: number }
 * ========================================
 */
const CrossWindowSync = {
    CHANNEL_NAME: 'quannex-sync',
    _channel: null,
    _listeners: new Map(),

    /**
     * Initialize the broadcast channel
     */
    init() {
        if (typeof BroadcastChannel === 'undefined') {
            console.warn('[CrossWindowSync] BroadcastChannel not supported in this browser');
            return false;
        }

        try {
            this._channel = new BroadcastChannel(this.CHANNEL_NAME);
            this._channel.onmessage = (event) => this._handleMessage(event.data);
            console.log('[CrossWindowSync] ✅ Channel initialized:', this.CHANNEL_NAME);
            return true;
        } catch (e) {
            console.error('[CrossWindowSync] Failed to create channel:', e);
            return false;
        }
    },

    /**
     * Broadcast a state update to all windows
     * @param {string} type - Message type (e.g., 'STATE_UPDATE', 'FACES_CHANGED')
     * @param {any} payload - Data to broadcast
     */
    broadcast(type, payload) {
        if (!this._channel) return;

        const message = {
            type,
            payload,
            timestamp: Date.now(),
            source: window.location.pathname  // Identify source window
        };

        try {
            this._channel.postMessage(message);
            console.log(`[CrossWindowSync] 📤 Broadcast: ${type}`, payload);
        } catch (e) {
            console.error('[CrossWindowSync] Broadcast failed:', e);
        }
    },

    /**
     * Register a listener for incoming messages
     * @param {string} type - Message type to listen for, or '*' for all
     * @param {Function} callback - Handler function(payload, message)
     */
    on(type, callback) {
        if (!this._listeners.has(type)) {
            this._listeners.set(type, []);
        }
        this._listeners.get(type).push(callback);
    },

    /**
     * Handle incoming messages
     */
    _handleMessage(message) {
        console.log(`[CrossWindowSync] 📥 Received: ${message.type} from ${message.source}`);

        // Skip messages from self
        if (message.source === window.location.pathname) {
            return;
        }

        // Notify type-specific listeners
        const typeListeners = this._listeners.get(message.type) || [];
        typeListeners.forEach(cb => cb(message.payload, message));

        // Notify wildcard listeners
        const wildcardListeners = this._listeners.get('*') || [];
        wildcardListeners.forEach(cb => cb(message.payload, message));
    },

    /**
     * Broadcast current demoState (for views to sync on open)
     */
    broadcastCurrentState() {
        this.broadcast('STATE_SYNC', {
            demoState: {
                currentStep: demoState.currentStep,
                faceConfig: demoState.faceConfig,
                kpiData: demoState.kpiData,
                coherenceResults: demoState.coherenceResults,
                loadedMappingContext: demoState.loadedMappingContext
            }
        });
    },

    /**
     * Request current state from other windows (for views that open late)
     */
    requestState() {
        this.broadcast('STATE_REQUEST', { requester: window.location.pathname });
    },

    /**
     * Clean up
     */
    close() {
        if (this._channel) {
            this._channel.close();
            this._channel = null;
        }
    }
};

// Initialize sync channel
CrossWindowSync.init();

// Listen for state requests (orchestrator responds to views asking for data)
CrossWindowSync.on('STATE_REQUEST', (payload) => {
    console.log('[CrossWindowSync] State requested by:', payload.requester);
    // Only orchestrator should respond
    if (window.location.pathname.includes('demo-orchestrator')) {
        CrossWindowSync.broadcastCurrentState();
    }
});

// Export for global access
window.CrossWindowSync = CrossWindowSync;

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    SessionManager.stop();
    CrossWindowSync.close();
});

/**
 * Initialize demo
 */
function initializeDemo() {
    console.log('🌟 Quannex Demo Orchestrator initialized');

    // =====================================================
    // URL PARAMETER HANDLING
    // =====================================================
    const urlParams = new URLSearchParams(window.location.search);
    const selectedPath = urlParams.get('path');
    const shouldRestore = urlParams.get('restore') === 'true';

    // Issue #10 Fix: Handle ?restore=true from back navigation
    // This ensures state is restored when returning from sub-views
    if (shouldRestore) {
        console.log('🔄 Restore flag detected - restoring session from back navigation');
        // Clear the restore parameter
        window.history.replaceState({}, document.title, window.location.pathname);
        // Fall through to normal session restoration below
    }

    // PATH HANDLING: Check for ?path= parameter from welcome screen
    if (selectedPath) {
        console.log(`🎯 Welcome screen path detected: ${selectedPath}`);
        // Clear URL parameter to prevent re-triggering on refresh
        window.history.replaceState({}, document.title, window.location.pathname);

        // Handle each path type
        setTimeout(() => {
            switch (selectedPath) {
                case 'template':
                    // Go to Step 0 and highlight template options
                    goToStep(0);
                    highlightTemplateOptions();
                    break;

                case 'custom':
                    // Start fresh with manual mode
                    startFreshManual();
                    break;

                case 'ai':
                    // Start fresh with AI story mode
                    startFreshAI();
                    break;

                default:
                    console.warn(`Unknown path: ${selectedPath}, defaulting to Step 0`);
                    goToStep(0);
            }
        }, 100);

        return; // Skip session restoration when coming from welcome screen
    }

    // Session restoration: attempt to restore previous session data
    try {
        const savedData = sessionStorage.getItem('customCompanyData');
        if (savedData) {
            const parsed = JSON.parse(savedData);
            // Only restore if recent (within 30 minutes)
            const savedTime = new Date(parsed.timestamp);
            const now = new Date();
            const minutesElapsed = (now - savedTime) / (1000 * 60);

            if (minutesElapsed < 30) {
                console.log('[Demo] Restoring previous session data (saved', Math.round(minutesElapsed), 'minutes ago)');
                demoState.kpiData = parsed.kpis || [];
                demoState.faceConfig = parsed.faceConfig || null;
                demoState.coherenceResults = parsed.coherenceResults || null;
                // Restore completed steps if available
                if (parsed.completedSteps) {
                    demoState.completedSteps = parsed.completedSteps;
                }

                // ===================================================
                // ISSUE #11 FIX: Sync demoState with MappingContext
                // ===================================================
                // MappingContext is used by Sprint2/AI flow. Without this sync,
                // two parallel state systems exist with no connection.
                if (demoState.faceConfig && demoState.faceConfig.faces) {
                    try {
                        // Lazy import - MappingContext may be loaded via module
                        if (window.MappingContext) {
                            const ctx = window.MappingContext.getInstance();
                            demoState.faceConfig.faces.forEach(face => {
                                ctx.updateFace(face.id, {
                                    name: face.name,
                                    icon: face.icon,
                                    sentiment: face.sentiment || face.faceEnergy || face.energy || 0.5
                                });
                            });
                            console.log('[Demo] ✅ MappingContext synced with demoState');
                            // Store reference for later use
                            demoState.loadedMappingContext = ctx.toJSON();
                        }
                    } catch (syncError) {
                        console.warn('[Demo] MappingContext sync deferred (not yet loaded):', syncError.message);
                    }
                }

                console.log('[Demo] Session restored:', {
                    kpiCount: demoState.kpiData?.length,
                    hasFaceConfig: !!demoState.faceConfig,
                    hasCoherence: !!demoState.coherenceResults
                });
                // Start session monitoring after successful restore
                SessionManager.start();
            } else {
                console.log('[Demo] Previous session expired (', Math.round(minutesElapsed), 'minutes old)');
                sessionStorage.removeItem('customCompanyData');
            }
        }
    } catch (e) {
        console.warn('[Demo] Session restore failed:', e.message);
    }

    updateProgress();
}

/**
 * Highlight template options in Step 0 (for welcome screen path)
 */
function highlightTemplateOptions() {
    // Add visual emphasis to template cards
    const templateCards = document.querySelectorAll('.company-template-card');
    templateCards.forEach(card => {
        card.style.animation = 'pulseHighlight 1.5s ease-in-out 3';
    });

    // Add CSS animation if not exists
    if (!document.getElementById('welcome-path-styles')) {
        const style = document.createElement('style');
        style.id = 'welcome-path-styles';
        style.textContent = `
            @keyframes pulseHighlight {
                0%, 100% { box-shadow: 0 0 0 0 rgba(0, 255, 204, 0); }
                50% { box-shadow: 0 0 20px 5px rgba(0, 255, 204, 0.3); }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Navigate to step
 */
function goToStep(stepNumber) {
    // Step 0 is always accessible
    if (stepNumber === 0) {
        // Allow going back to step 0
    }
    // Validate step is accessible (for steps > 0)
    else if (stepNumber > 1 && !demoState.completedSteps.includes(stepNumber - 1)) {
        alert(`Please complete Step ${stepNumber - 1} first`);
        return;
    }
    // Step 1 requires step 0 to be completed (company selected or manual mode)
    else if (stepNumber === 1 && !demoState.completedSteps.includes(0)) {
        alert('Please select a journey or start fresh first');
        return;
    }

    // Sprint 2 FIX: Enforce validation gate for step 2+
    // Must have all 12 faces validated before proceeding past step 1
    // EXCEPTION: Skip validation for template flow (all steps already marked complete)
    if (stepNumber > 1 && window.Sprint2 && window.Sprint2.validationGate) {
        const isTemplateFlow = demoState.completedSteps.includes(1) &&
                               demoState.completedSteps.includes(2) &&
                               demoState.completedSteps.includes(3);

        if (!isTemplateFlow) {
            const gateResult = window.Sprint2.canProceed();
            if (!gateResult.canProceed) {
                // Show empowering dialog instead of blocking alert
                showValidationBlockDialog(gateResult);
                return;
            }
        }
    }

    // Hide all steps
    document.querySelectorAll('.step-content').forEach(content => {
        content.classList.remove('active');
    });

    // Show target step
    document.getElementById(`step${stepNumber}`).classList.add('active');

    // Update navigation
    document.querySelectorAll('.step-button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-step="${stepNumber}"]`).classList.add('active');

    // Update state
    demoState.currentStep = stepNumber;
    updateProgress();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // If navigating to Step 4, initialize visualizations
    if (stepNumber === 4) {
        setTimeout(() => {
            initializePortraitView();
            initializeOctaveDashboard();
            // Sprint 3 Fix: Ensure nervous endpoints are updated with current template data
            if (demoState.coherenceResults && demoState.coherenceResults.faces) {
                identifyNervousEndpoints();
            }
            // Sprint 4 Task 34: Display highest leverage action
            identifyHighestLeverageAction();
        }, 100);
    }

    // If navigating to Step 2, ensure KPI mode buttons are visible
    if (stepNumber === 2) {
        const modeQuick = document.getElementById('modeQuick');
        const modeFull = document.getElementById('modeFull');
        if (modeQuick) modeQuick.style.display = 'inline-block';
        if (modeFull) modeFull.style.display = 'inline-block';
    }

    // If navigating back to Step 1, restore face names from demoState
    // This preserves user customizations across navigation
    if (stepNumber === 1 && demoState.faceConfig) {
        if (typeof window.restoreFacesFromDemoState === 'function') {
            window.restoreFacesFromDemoState();
            // Also re-populate the face editor UI
            populateFaceEditor();
        }
    }

    console.log(`📍 Navigated to Step ${stepNumber}`);
}

/**
 * Show validation block dialog with empowering messaging
 * Sprint 2 Task 15: Red indicators + blocking
 */
function showValidationBlockDialog(gateResult) {
    const validation = window.Sprint2.validationGate.validate();
    const message = validation.message;
    const incompleteFaces = validation.faceGuidance || [];

    // Build face list with red indicators
    let faceListHtml = incompleteFaces.slice(0, 5).map(face =>
        `<div style="display: flex; align-items: center; gap: 8px; padding: 8px; background: rgba(255,100,100,0.1); border-radius: 4px; margin: 4px 0;">
            <span style="color: #ff6b6b; font-size: 16px;">⚠️</span>
            <span>Face ${face.faceId}: ${face.currentName}</span>
        </div>`
    ).join('');

    if (incompleteFaces.length > 5) {
        faceListHtml += `<div style="font-size: 12px; color: rgba(255,255,255,0.5); padding: 4px;">...and ${incompleteFaces.length - 5} more</div>`;
    }

    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.id = 'validation-block-modal';
    overlay.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.85); z-index: 3000; display: flex; align-items: center; justify-content: center;">
            <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border: 2px solid #ff6b6b; border-radius: 16px; padding: 30px; max-width: 500px; margin: 20px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <span style="font-size: 48px;">${message.icon || '🔴'}</span>
                    <h2 style="color: #ff6b6b; margin: 15px 0 10px 0; font-size: 24px;">${message.title}</h2>
                    <p style="color: rgba(255,255,255,0.8); font-size: 14px;">${message.message}</p>
                    ${message.encouragement ? `<p style="color: rgba(255,255,255,0.5); font-size: 12px; margin-top: 10px;">${message.encouragement}</p>` : ''}
                </div>

                <div style="margin: 20px 0;">
                    <div style="font-size: 12px; color: #ff6b6b; margin-bottom: 8px; font-weight: 600;">
                        ⚠️ INCOMPLETE FACES (${incompleteFaces.length} remaining):
                    </div>
                    ${faceListHtml}
                </div>

                <div style="display: flex; gap: 12px; justify-content: center; margin-top: 20px;">
                    <button onclick="closeValidationModal(); focusOnIncompleteFace()"
                        style="padding: 12px 24px; background: linear-gradient(135deg, #00ffcc, #00ff88); color: #000; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
                        Complete Faces
                    </button>
                    <button onclick="applyDefaultsAndProceed()"
                        style="padding: 12px 24px; background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.3); border-radius: 8px; cursor: pointer;">
                        Use Defaults
                    </button>
                    <button onclick="closeValidationModal()"
                        style="padding: 12px 24px; background: transparent; color: rgba(255,255,255,0.5); border: none; cursor: pointer;">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
}

/**
 * Close validation modal
 */
function closeValidationModal() {
    const modal = document.getElementById('validation-block-modal');
    if (modal) modal.remove();
}

/**
 * Apply defaults and proceed
 */
function applyDefaultsAndProceed() {
    closeValidationModal();
    if (window.Sprint2 && window.Sprint2.validationGate) {
        window.Sprint2.validationGate.applyDefaults();
        console.log('✅ Applied defaults to incomplete faces');
        // Now try to proceed
        completeStep1();
    }
}

/**
 * Focus on first incomplete face
 */
function focusOnIncompleteFace() {
    if (window.Sprint2 && window.Sprint2.validationGate) {
        const validation = window.Sprint2.validationGate.validate();
        if (validation.faceGuidance && validation.faceGuidance.length > 0) {
            const firstIncomplete = validation.faceGuidance[0];
            const faceInput = document.querySelector(`#face-input-${firstIncomplete.faceId}`);
            if (faceInput) {
                faceInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                faceInput.focus();
                // Add red highlight
                faceInput.style.borderColor = '#ff6b6b';
                faceInput.style.boxShadow = '0 0 10px rgba(255, 107, 107, 0.5)';
            }
        }
    }
}

/**
 * Update progress bar
 */
function updateProgress() {
    // Step 0 = 0%, Step 1 = 25%, Step 2 = 50%, Step 3 = 75%, Step 4 = 100%
    const progressPercent = (demoState.currentStep / (demoState.totalSteps - 1)) * 100;
    document.getElementById('progressBar').style.width = `${progressPercent}%`;
}

// ============================================
// COMPANY TEMPLATE SELECTION (Sprint 3)
// ============================================

/**
 * Select a pre-filled company template
 * Loads the mapping-context.json and pre-fills all steps
 */
async function selectCompanyTemplate(companyId) {
    // Re-entrancy guard: prevent duplicate calls from rapid clicks or event bubbling
    if (_isSelectingCompanyTemplate) {
        console.log(`[selectCompanyTemplate] Ignoring duplicate call for: ${companyId}`);
        return;
    }
    _isSelectingCompanyTemplate = true;

    console.log(`🏢 Selecting company template: ${companyId}`);
    showLoading('Loading organizational DNA...');

    try {
        let mappingContext;

        // Try to fetch from server first
        try {
            const response = await fetch(`companies/${companyId}/mapping-context.json`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            mappingContext = await response.json();
            console.log(`✅ Loaded mapping context from server for ${mappingContext.displayName}`);
        } catch (fetchError) {
            // Fallback to bundled templates for offline/file:// protocol support
            console.warn(`⚠️ Fetch failed (${fetchError.message}), trying offline bundle...`);

            if (window.CompanyTemplatesBundle && window.CompanyTemplatesBundle.has(companyId)) {
                mappingContext = window.CompanyTemplatesBundle.get(companyId);
                console.log(`✅ Loaded mapping context from offline bundle for ${mappingContext.displayName}`);
            } else {
                throw new Error(`Template not found: ${companyId} (offline bundle not available)`);
            }
        }

        // Store in state
        demoState.selectedCompanyId = companyId;
        demoState.loadedMappingContext = mappingContext;

        // Pre-fill face configuration
        demoState.faceConfig = {
            templateName: mappingContext.displayName,
            faces: mappingContext.faces.map(face => ({
                id: face.id,
                name: face.customName || face.baseName,
                icon: face.icon || '',
                octave: face.octave,
                tooltip: face.tooltip,
                sentiment: face.sentiment
            }))
        };

        // Pre-fill KPI data
        demoState.kpiMode = mappingContext.mode || 'quick';
        demoState.kpiData = [];

        // Transform KPIs from mapping context
        Object.keys(mappingContext.kpis || {}).forEach(faceKey => {
            const faceId = parseInt(faceKey.replace('face', ''));
            const faceKpis = mappingContext.kpis[faceKey];
            const face = mappingContext.faces.find(f => f.id === faceId);

            faceKpis.forEach((kpi, index) => {
                demoState.kpiData.push({
                    faceId: faceId,
                    faceName: face ? (face.customName || face.baseName) : `Face ${faceId}`,
                    id: kpi.id,
                    name: kpi.name,
                    value: kpi.value,
                    unit: kpi.unit || 'number',
                    direction: '↑',
                    targetMin: 0,
                    targetIdeal: kpi.target || 100,
                    element: 'Earth'
                });
            });
        });

        // Pre-calculate coherence from face sentiments
        const avgCoherence = mappingContext.diagnostics?.globalCoherence ||
            (mappingContext.faces.reduce((sum, f) => sum + (f.sentiment || 0.5), 0) / mappingContext.faces.length);

        demoState.coherenceResults = {
            globalCoherence: avgCoherence,
            coherenceStatus: getCoherenceStatus(avgCoherence),
            faces: mappingContext.faces.map(f => ({
                id: f.id,
                name: f.customName || f.baseName,
                faceEnergy: f.sentiment,  // Primary property for 3D viz
                energy: f.sentiment,       // Backwards compatibility
                kpis: []
            }))
        };

        // Mark steps as completed since data is pre-loaded
        demoState.completedSteps = [0, 1, 2, 3];

        // Sync to Sprint 2 MappingContext if available
        if (window.Sprint2 && window.Sprint2.mappingContext) {
            try {
                const facesConfig = demoState.faceConfig.faces.map(face => ({
                    id: face.id,
                    name: face.name,
                    icon: face.icon || '',
                    source: 'template'
                }));
                window.Sprint2.mappingContext.setAllFaces(facesConfig);
                console.log('✅ Synced to Sprint2 MappingContext');
            } catch (err) {
                console.warn('⚠️ Sprint2 sync failed:', err.message);
            }
        }

        // ============================================================
        // DATA BRIDGE: Initialize Quannex Engine with template data
        // ============================================================
        try {
            if (typeof window.DataTransformer !== 'undefined' && demoState.kpiData && demoState.kpiData.length > 0) {
                const engineData = window.DataTransformer.transform({
                    faceConfig: demoState.faceConfig,
                    kpiMode: demoState.kpiMode || 'quick',
                    kpiData: demoState.kpiData
                });

                // Add shadowPatterns from mappingContext to engineData
                if (mappingContext.shadowPatterns && mappingContext.shadowPatterns.length > 0) {
                    engineData.shadowPatterns = mappingContext.shadowPatterns;
                    console.log(`[DataBridge] Added ${mappingContext.shadowPatterns.length} shadow patterns to engine data`);
                }

                if (typeof window.Quannex !== 'undefined') {
                    // Apply tuning parameters from template (if available)
                    // This ensures coherence calculations match the stored perspective
                    if (mappingContext.diagnostics?.tuning) {
                        const tuning = mappingContext.diagnostics.tuning;
                        console.log(`[Tuning] Applying ${tuning.perspective} perspective from template`);
                        window.Quannex.importTuning(tuning);
                    }

                    await window.Quannex.initWithCompany(engineData);
                    console.log('[DataBridge] Engine initialized with template data');

                    const engineState = window.Quannex.getState();
                    if (engineState && engineState.globalCoherence !== undefined) {
                        demoState.coherenceResults = window.DataTransformer.transformResults(engineState);
                    }
                }
            }
        } catch (bridgeError) {
            console.warn('[DataBridge] Engine initialization skipped:', bridgeError.message);
            // Continue with fallback data - visualization will use pre-calculated sentiments
        }

        // Trigger hero update for template-loaded data
        if (demoState.coherenceResults && demoState.coherenceResults.globalCoherence) {
            setTimeout(() => {
                if (typeof initializeCoherenceHero === 'function') {
                    initializeCoherenceHero();
                }
            }, 200);
        }

        // Ensure sessionStorage is populated immediately for 3D view
        // (Risk Manager: prevents race condition if user opens 3D before clicking launchView)
        updateSessionStorage();
        console.log('[Template] ✅ SessionStorage populated with edges/vertices for 3D view');

        hideLoading();

        // Show success notification
        showCompanyLoadedNotification(mappingContext);

        // Navigate to Step 1 (Face Configuration) - data is pre-filled
        goToStep(1);

        // Pre-populate the face editor
        populateFaceEditor();

        // Hide the template grid to prevent users from accidentally clicking generic templates
        // which would overwrite the custom company face names
        hideTemplateGridForPreloadedCompany(mappingContext);

    } catch (error) {
        console.error('❌ Failed to load company template:', error);
        hideLoading();
        alert(`Failed to load ${companyId} template: ${error.message}`);
    } finally {
        // Always reset the re-entrancy guard
        _isSelectingCompanyTemplate = false;
    }
}

/**
 * Show notification that company data was loaded
 */
function showCompanyLoadedNotification(mappingContext) {
    const notification = document.createElement('div');
    notification.id = 'company-loaded-notification';
    notification.innerHTML = `
        <div style="position: fixed; top: 100px; right: 20px; z-index: 2000;
                    background: rgba(0, 255, 204, 0.15); border: 1px solid rgba(0, 255, 204, 0.4);
                    border-radius: 12px; padding: 20px; max-width: 350px;
                    animation: slideIn 0.5s ease;">
            <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 32px;">${mappingContext.faces[0]?.icon || '🏢'}</span>
                <div>
                    <div style="font-weight: 600; color: #00ffcc; font-size: 16px;">
                        ${mappingContext.displayName} Loaded
                    </div>
                    <div style="font-size: 12px; color: rgba(255,255,255,0.7); margin-top: 4px;">
                        ${mappingContext.octaveStage} • ${mappingContext.archetype}
                    </div>
                    <div style="font-size: 11px; color: rgba(255,255,255,0.5); margin-top: 4px; font-style: italic;">
                        "${mappingContext.dominantBreathName}"
                    </div>
                </div>
            </div>
            <div style="margin-top: 12px; font-size: 11px; color: rgba(255,255,255,0.6);">
                ✅ All 12 faces pre-configured<br>
                ✅ KPIs and metrics loaded<br>
                ✅ Ready to explore the journey
            </div>
        </div>
    `;
    document.body.appendChild(notification);

    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 5000);
}

/**
 * Hide template grid when company data is pre-loaded
 * This prevents users from accidentally clicking generic templates
 * which would overwrite the custom company face names
 */
function hideTemplateGridForPreloadedCompany(mappingContext) {
    const templateGrid = document.querySelector('.template-grid');
    const step1Content = document.getElementById('step1');

    if (!templateGrid || !step1Content) return;

    // Hide the template grid
    templateGrid.style.display = 'none';

    // Hide the "Select a Template" header
    const templateHeader = step1Content.querySelector('h3');
    if (templateHeader && templateHeader.textContent.includes('Select a Template')) {
        templateHeader.style.display = 'none';
    }

    // Add a "company loaded" banner at the top of Step 1
    const existingBanner = document.getElementById('company-preloaded-banner');
    if (existingBanner) existingBanner.remove();

    const banner = document.createElement('div');
    banner.id = 'company-preloaded-banner';
    banner.innerHTML = `
        <div style="background: linear-gradient(135deg, rgba(0, 255, 204, 0.15), rgba(147, 112, 219, 0.15));
                    border: 1px solid rgba(0, 255, 204, 0.3); border-radius: 12px; padding: 20px;
                    margin-bottom: 20px; display: flex; align-items: center; gap: 15px;">
            <div style="font-size: 40px;">${mappingContext.faces[0]?.icon || '🏢'}</div>
            <div style="flex: 1;">
                <div style="font-size: 18px; font-weight: 600; color: #00ffcc;">
                    ${mappingContext.displayName} Template Loaded
                </div>
                <div style="font-size: 13px; color: rgba(255,255,255,0.7); margin-top: 4px;">
                    ${mappingContext.octaveStage} • ${mappingContext.archetype} • 12 custom faces pre-configured
                </div>
                <div style="font-size: 12px; color: rgba(255,255,255,0.5); margin-top: 8px; font-style: italic;">
                    Review the faces below and click "Next" when ready
                </div>
            </div>
            <button onclick="resetToTemplateSelection()"
                    style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
                           border-radius: 8px; padding: 8px 16px; color: rgba(255,255,255,0.7);
                           cursor: pointer; font-size: 12px; transition: all 0.3s;">
                Choose Different Template
            </button>
        </div>
    `;

    // Insert banner before the info-box
    const infoBox = step1Content.querySelector('.info-box');
    if (infoBox) {
        infoBox.parentNode.insertBefore(banner, infoBox);
    }

    console.log('✅ Template grid hidden for pre-loaded company');
}

/**
 * Reset to template selection (when user wants to choose a different template)
 */
function resetToTemplateSelection() {
    // Show the template grid again
    const templateGrid = document.querySelector('.template-grid');
    if (templateGrid) templateGrid.style.display = 'grid';

    // Show the "Select a Template" header
    const step1Content = document.getElementById('step1');
    const templateHeader = step1Content?.querySelector('h3');
    if (templateHeader) templateHeader.style.display = 'block';

    // Remove the preloaded banner
    const banner = document.getElementById('company-preloaded-banner');
    if (banner) banner.remove();

    // Clear company data
    demoState.selectedCompanyId = null;
    demoState.loadedMappingContext = null;
    demoState.faceConfig = null;
    demoState.kpiData = [];
    demoState.coherenceResults = null;
    demoState.completedSteps = [0];

    // Clear face editor
    const faceEditorSection = document.getElementById('faceEditorSection');
    if (faceEditorSection) faceEditorSection.style.display = 'none';

    console.log('✅ Reset to template selection');
}

// Expose to window
window.resetToTemplateSelection = resetToTemplateSelection;

/**
 * Populate the face editor with pre-loaded data
 */
function populateFaceEditor() {
    if (!demoState.faceConfig) return;

    // Generate face grid HTML
    const faceGrid = document.getElementById('faceGrid');
    if (!faceGrid) return;

    let html = '';
    demoState.faceConfig.faces.forEach(face => {
        html += `
            <div class="face-item" style="background: rgba(0, 255, 204, 0.1); border-color: rgba(0, 255, 204, 0.3);">
                <span class="face-number">${face.id}</span>
                <input
                    type="text"
                    class="face-input"
                    id="face-input-${face.id}"
                    value="${face.name}"
                    placeholder="Face ${face.id} name"
                    data-face-id="${face.id}"
                    style="border-color: rgba(0, 255, 204, 0.5);"
                />
                <span style="font-size: 11px; color: rgba(255,255,255,0.5); margin-left: 8px;">
                    O${face.octave || '?'}
                </span>
            </div>
        `;
    });

    faceGrid.innerHTML = html;

    // Show the face editor section
    const editorSection = document.getElementById('faceEditorSection');
    if (editorSection) {
        editorSection.style.display = 'block';
    }

    // Enable the Next button
    const nextBtn = document.getElementById('step1NextBtn');
    if (nextBtn) {
        nextBtn.disabled = false;
    }

    console.log('✅ Face editor populated with pre-loaded data');
}

/**
 * Start fresh with manual setup
 */
function startFreshManual() {
    console.log('🛠️ Starting fresh with manual setup');

    // Mark step 0 as complete
    markStepCompleted(0);

    // Clear any loaded company data
    demoState.selectedCompanyId = null;
    demoState.loadedMappingContext = null;

    // Navigate to step 1
    goToStep(1);
}

/**
 * Start fresh with AI story mode
 */
function startFreshAI() {
    console.log('🧠 Starting fresh with AI story mode');

    // Mark step 0 as complete
    markStepCompleted(0);

    // Clear any loaded company data
    demoState.selectedCompanyId = null;
    demoState.loadedMappingContext = null;

    // Navigate to step 1
    goToStep(1);

    // Select the AI Story template
    setTimeout(() => {
        if (typeof selectTemplate === 'function') {
            selectTemplate('story');
        }
    }, 100);
}

/**
 * Mark step as completed
 */
function markStepCompleted(stepNumber) {
    if (!demoState.completedSteps.includes(stepNumber)) {
        demoState.completedSteps.push(stepNumber);
    }

    // Update UI
    const stepButton = document.querySelector(`[data-step="${stepNumber}"]`);
    if (stepButton) {
        stepButton.classList.add('completed');
    }
}

/**
 * Complete Step 1: Face Definition
 */
function completeStep1() {
    // Validate faces (local check)
    const validation = validateFaces();

    if (!validation.valid) {
        alert(validation.message);
        return;
    }

    // Save configuration first
    demoState.faceConfig = getFaceConfiguration();

    // Sprint 2 FIX: Sync faces to MappingContext BEFORE validation check
    if (window.Sprint2 && window.Sprint2.mappingContext) {
        try {
            const facesConfig = demoState.faceConfig.faces.map(face => ({
                id: face.id,
                name: face.name,
                icon: face.icon || '',
                source: 'user'
            }));
            window.Sprint2.mappingContext.setAllFaces(facesConfig);
            console.log('✅ Synced faces to MappingContext');
        } catch (err) {
            console.warn('⚠️ MappingContext sync failed:', err.message);
        }
    }

    // Sprint 2 FIX: Now check validation gate with updated data
    // EXCEPTION: Skip validation for template flow (all steps already marked complete)
    if (window.Sprint2 && window.Sprint2.validationGate) {
        const isTemplateFlow = demoState.completedSteps.includes(1) &&
                               demoState.completedSteps.includes(2) &&
                               demoState.completedSteps.includes(3);

        if (!isTemplateFlow) {
            const gateResult = window.Sprint2.canProceed();
            console.log('📋 Validation Gate:', gateResult);

            // Block if validation fails - show empowering dialog
            if (!gateResult.canProceed) {
                showValidationBlockDialog(gateResult);
                return; // Block navigation
            }
        } else {
            console.log('📋 Validation Gate: Skipped (template flow)');
        }
    }

    // Mark completed
    markStepCompleted(1);

    // Show success
    console.log('✅ Step 1 completed:', demoState.faceConfig);

    // Go to next step
    goToStep(2);
}

/**
 * Select KPI mode
 */
function selectMode(mode) {
    demoState.kpiMode = mode;

    // Update UI
    document.getElementById('modeQuick').classList.remove('btn-primary');
    document.getElementById('modeFull').classList.remove('btn-primary');
    document.getElementById('modeQuick').classList.add('btn-secondary');
    document.getElementById('modeFull').classList.add('btn-secondary');

    if (mode === 'quick') {
        document.getElementById('modeQuick').classList.remove('btn-secondary');
        document.getElementById('modeQuick').classList.add('btn-primary');
    } else {
        document.getElementById('modeFull').classList.remove('btn-secondary');
        document.getElementById('modeFull').classList.add('btn-primary');
    }

    // Sprint 2: Sync mode to MappingContext if available
    if (window.Sprint2 && window.Sprint2.mappingContext) {
        try {
            window.Sprint2.mappingContext.setMode(mode);
            console.log('✅ Synced mode to MappingContext:', mode);
        } catch (err) {
            console.warn('⚠️ Mode sync failed:', err.message);
        }
    }

    // Load KPI mapper
    loadKPIMapper(mode);

    // Enable next button
    document.getElementById('step2NextBtn').disabled = false;

    console.log(`✅ KPI mode selected: ${mode}`);
}

/**
 * Load KPI mapper interface
 */
function loadKPIMapper(mode) {
    const section = document.getElementById('kpiMapperSection');
    section.style.display = 'block';

    if (mode === 'quick') {
        section.innerHTML = generateQuickModeHTML();
    } else {
        section.innerHTML = generateFullModeHTML();
    }

    // Sprint 2: Auto-fill with extracted KPIs from AI story analysis
    autoFillExtractedKPIs();
}

/**
 * Auto-fill KPI fields with AI-extracted data
 */
function autoFillExtractedKPIs() {
    // Check if we have extracted KPIs from story analysis
    const extractedKPIs = window.getExtractedKPIs ? window.getExtractedKPIs() : [];
    const financials = window.getExtractedFinancials ? window.getExtractedFinancials() : {};

    if (extractedKPIs.length === 0 && Object.keys(financials).length === 0) {
        console.log('📊 No extracted KPIs to auto-fill');
        return;
    }

    console.log(`📊 Auto-filling ${extractedKPIs.length} extracted KPIs...`);

    // Fill KPIs by face
    extractedKPIs.forEach(kpi => {
        const faceId = kpi.faceId;

        // Find the input fields for this face
        const nameInput = document.querySelector(`input[data-face-id="${faceId}"][data-field="kpiName"]`);
        const valueInput = document.querySelector(`input[data-face-id="${faceId}"][data-field="value"]`);

        if (nameInput && kpi.name) {
            nameInput.value = kpi.name;
            nameInput.style.borderColor = 'rgba(0, 255, 204, 0.5)';
        }

        if (valueInput && kpi.value !== undefined && kpi.value !== null) {
            // Extract numeric value from string or use directly if already a number
            let numValue;
            if (typeof kpi.value === 'number') {
                numValue = kpi.value;
            } else {
                numValue = parseFloat(String(kpi.value).replace(/[^0-9.-]/g, ''));
            }

            if (!isNaN(numValue)) {
                valueInput.value = numValue;
                valueInput.style.borderColor = 'rgba(0, 255, 204, 0.5)';

                // Trigger normalization calculation
                if (typeof calculateLiveNormalization === 'function') {
                    calculateLiveNormalization(faceId);
                }
            }
        }
    });

    // Also apply direct financial extractions as fallback
    if (financials.revenue?.value) {
        setKPIFieldValue(1, 'Revenue', financials.revenue.value);
    }
    if (financials.teamSize?.value) {
        setKPIFieldValue(3, 'Team Size', financials.teamSize.value);
    }
    if (financials.customers?.value) {
        setKPIFieldValue(5, 'Customer Count', financials.customers.value);
    }
    if (financials.runway?.value) {
        setKPIFieldValue(11, 'Runway', financials.runway.value);
    }

    // Show confirmation message
    showAutoFillNotification(extractedKPIs.length);
}

/**
 * Helper to set a KPI field value
 */
function setKPIFieldValue(faceId, kpiName, value) {
    const nameInput = document.querySelector(`input[data-face-id="${faceId}"][data-field="kpiName"]`);
    const valueInput = document.querySelector(`input[data-face-id="${faceId}"][data-field="value"]`);

    if (nameInput && !nameInput.value) {
        nameInput.value = kpiName;
        nameInput.style.borderColor = 'rgba(0, 255, 204, 0.5)';
    }

    if (valueInput && !valueInput.value && value) {
        const numValue = typeof value === 'number' ? value : parseFloat(value);
        if (!isNaN(numValue)) {
            valueInput.value = numValue;
            valueInput.style.borderColor = 'rgba(0, 255, 204, 0.5)';
        }
    }
}

/**
 * Show notification that KPIs were auto-filled
 */
function showAutoFillNotification(count) {
    const section = document.getElementById('kpiMapperSection');
    if (!section || count === 0) return;

    // Add notification banner at the top
    const existing = document.getElementById('autoFillNotification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.id = 'autoFillNotification';
    notification.innerHTML = `
        <div style="background: rgba(0, 255, 204, 0.15); border: 1px solid rgba(0, 255, 204, 0.4);
                    border-radius: 8px; padding: 12px 16px; margin-bottom: 20px;
                    display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 24px;">🤖</span>
            <div>
                <div style="font-weight: 600; color: #00ffcc; font-size: 14px;">
                    AI Pre-filled ${count} KPIs from your story
                </div>
                <div style="font-size: 12px; color: rgba(255,255,255,0.6);">
                    Highlighted fields contain extracted data. Review and adjust as needed.
                </div>
            </div>
        </div>
    `;
    section.insertBefore(notification, section.firstChild);
}

/**
 * Generate Quick Mode HTML (12 KPIs) - ENHANCED with better layout
 */
function generateQuickModeHTML() {
    // Defensive check: ensure face configuration exists
    if (!demoState.faceConfig || !demoState.faceConfig.faces) {
        console.error('[KPIMapper] No face configuration available');
        return '<p style="color: #ff6b6b; text-align: center; padding: 40px;">Please complete Step 1 (Define Faces) first.</p>';
    }

    const units = window.KPILibrary ? window.KPILibrary.getUnitTypes() : [];

    // Create KPI lookup by faceId for pre-filling template data
    const kpiByFaceId = {};
    if (demoState.kpiData && demoState.kpiData.length > 0) {
        demoState.kpiData.forEach(kpi => {
            kpiByFaceId[kpi.faceId] = kpi;
        });
        console.log('[KPIMapper] Pre-filling with template KPIs:', Object.keys(kpiByFaceId).length);
    }

    let html = '<div style="margin: 30px 0;">';
    html += '<h3 style="font-size: 16px; margin-bottom: 20px; color: rgba(255, 255, 255, 0.8);">Quick Mode: 1 KPI per Face</h3>';
    html += '<div style="display: grid; gap: 20px;">';

    demoState.faceConfig.faces.forEach(face => {
        // Get pre-loaded KPI data for this face (from template)
        const preFilledKPI = kpiByFaceId[face.id];

        // Get KPI suggestions for this face (Earth element by default for quick mode)
        const suggestions = window.KPILibrary ? window.KPILibrary.getKPISuggestions(face.name, 'Earth') : [];
        const datalistId = `kpi-suggestions-${face.id}`;

        html += `
            <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 20px;">
                <div style="font-size: 14px; font-weight: 600; margin-bottom: 15px; color: #00ffcc;">
                    Face ${face.id}: ${face.name}
                </div>

                <!-- Main KPI input row -->
                <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 12px; margin-bottom: 12px;">
                    <div>
                        <label style="font-size: 11px; color: rgba(255, 255, 255, 0.6); display: block; margin-bottom: 5px;">
                            KPI Name
                        </label>
                        <input
                            type="text"
                            class="face-input"
                            list="${datalistId}"
                            placeholder="Start typing..."
                            data-face-id="${face.id}"
                            data-field="kpiName"
                            value="${preFilledKPI?.name || ''}"
                            onchange="autofillKPISuggestion(this, ${face.id})"
                            oninput="this.setAttribute('data-current-value', this.value)"
                        />
                        <datalist id="${datalistId}">
                            ${suggestions.map(s => `<option value="${s.name}" data-unit="${s.unit}" data-min="${s.targetMin}" data-ideal="${s.targetIdeal}">${s.description}</option>`).join('')}
                        </datalist>
                    </div>
                    <div>
                        <label style="font-size: 11px; color: rgba(255, 255, 255, 0.6); display: block; margin-bottom: 5px;">
                            Current Value
                        </label>
                        <input
                            type="number"
                            class="face-input"
                            placeholder="0"
                            data-face-id="${face.id}"
                            data-field="value"
                            value="${preFilledKPI?.value !== undefined ? preFilledKPI.value : ''}"
                            step="any"
                            oninput="calculateLiveNormalization(${face.id})"
                        />
                    </div>
                    <div>
                        <label style="font-size: 11px; color: rgba(255, 255, 255, 0.6); display: block; margin-bottom: 5px;">
                            Unit
                        </label>
                        <select
                            class="face-input"
                            data-face-id="${face.id}"
                            data-field="unit"
                            style="cursor: pointer; font-size: 12px;"
                        >
                            ${units.map(u => `<option value="${u.value}" ${preFilledKPI?.unit === u.value ? 'selected' : ''}>${u.symbol || u.label}</option>`).join('')}
                        </select>
                    </div>
                </div>

                <!-- Target ranges row -->
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px;">
                    <div>
                        <label style="font-size: 11px; color: rgba(255, 255, 255, 0.6); display: block; margin-bottom: 5px;">
                            Target Min
                        </label>
                        <input
                            type="number"
                            class="face-input"
                            placeholder="0"
                            data-face-id="${face.id}"
                            data-field="targetMin"
                            value="${preFilledKPI?.targetMin !== undefined ? preFilledKPI.targetMin : ''}"
                            step="any"
                            oninput="calculateLiveNormalization(${face.id})"
                        />
                    </div>
                    <div>
                        <label style="font-size: 11px; color: rgba(255, 255, 255, 0.6); display: block; margin-bottom: 5px;">
                            Target Ideal
                        </label>
                        <input
                            type="number"
                            class="face-input"
                            placeholder="100"
                            data-face-id="${face.id}"
                            data-field="targetIdeal"
                            value="${preFilledKPI?.targetIdeal !== undefined ? preFilledKPI.targetIdeal : ''}"
                            step="any"
                            oninput="calculateLiveNormalization(${face.id})"
                        />
                    </div>
                    <div>
                        <label style="font-size: 11px; color: rgba(255, 255, 255, 0.6); display: block; margin-bottom: 5px;">
                            Direction
                        </label>
                        <select
                            class="face-input"
                            data-face-id="${face.id}"
                            data-field="direction"
                            style="cursor: pointer; font-size: 12px;"
                            onchange="calculateLiveNormalization(${face.id})"
                        >
                            <option value="↑" ${preFilledKPI?.direction === '↑' || !preFilledKPI ? 'selected' : ''}>↑ Higher</option>
                            <option value="↓" ${preFilledKPI?.direction === '↓' ? 'selected' : ''}>↓ Lower</option>
                            <option value="Band" ${preFilledKPI?.direction === 'Band' ? 'selected' : ''}>⊟ Sweet spot</option>
                        </select>
                    </div>
                </div>

                <!-- Live normalization preview -->
                <div id="normalization-preview-${face.id}" style="margin-top: 12px; padding: 8px; background: rgba(0, 0, 0, 0.2); border-radius: 6px; font-size: 11px; color: rgba(255, 255, 255, 0.7); display: none;">
                    <span style="color: rgba(0, 255, 204, 0.8);">→ Normalized:</span>
                    <span id="norm-value-${face.id}" style="font-weight: 600; color: #00ffcc;">--</span>
                    <span style="opacity: 0.6;">(This value goes to calculation)</span>
                </div>
            </div>
        `;
    });

    html += '</div></div>';
    return html;
}

/**
 * Generate Full Mode HTML (60 KPIs) - ENHANCED with tooltips, units, and suggestions
 */
function generateFullModeHTML() {
    const elements = ['Earth', 'Water', 'Fire', 'Air', 'Ether'];
    const units = window.KPILibrary ? window.KPILibrary.getUnitTypes() : [];

    let html = '<div style="margin: 30px 0;">';
    html += '<h3 style="font-size: 16px; margin-bottom: 20px; color: rgba(255, 255, 255, 0.8);">Full Mode: 5 Elemental KPIs per Face</h3>';

    demoState.faceConfig.faces.forEach(face => {
        html += `
            <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                <div style="font-size: 16px; font-weight: 600; margin-bottom: 20px; color: #00ffcc;">
                    Face ${face.id}: ${face.name}
                </div>
        `;

        elements.forEach(element => {
            // Get elemental wisdom
            const wisdom = window.KPILibrary ? window.KPILibrary.getElementalWisdom(element) : { icon: '✨', subtitle: element, description: '' };

            // Get KPI suggestions for this element
            const suggestions = window.KPILibrary ? window.KPILibrary.getKPISuggestions(face.name, element) : [];
            const datalistId = `kpi-suggestions-${face.id}-${element}`;

            html += `
                <div style="background: rgba(0, 0, 0, 0.2); border-radius: 6px; padding: 15px; margin-bottom: 15px; position: relative;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
                        <span style="font-size: 12px; font-weight: 600; color: rgba(255, 255, 255, 0.9);">
                            ${wisdom.icon} ${element}
                        </span>
                        <span style="font-size: 10px; color: rgba(255, 255, 255, 0.6);">
                            (${wisdom.subtitle})
                        </span>
                        <span class="elemental-tooltip" style="cursor: help; font-size: 11px; color: rgba(0, 255, 204, 0.7);" title="${wisdom.description}">ℹ️</span>
                    </div>
                    <div style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr; gap: 10px;">
                        <input
                            type="text"
                            class="face-input"
                            list="${datalistId}"
                            placeholder="KPI name"
                            data-face-id="${face.id}"
                            data-element="${element}"
                            data-field="kpiName"
                            style="font-size: 12px;"
                            onchange="autofillElementalKPI(this, ${face.id}, '${element}')"
                        />
                        <datalist id="${datalistId}">
                            ${suggestions.map(s => `<option value="${s.name}" data-unit="${s.unit}" data-min="${s.targetMin}" data-ideal="${s.targetIdeal}">${s.description}</option>`).join('')}
                        </datalist>

                        <input
                            type="number"
                            class="face-input"
                            placeholder="Value"
                            data-face-id="${face.id}"
                            data-element="${element}"
                            data-field="value"
                            style="font-size: 12px;"
                            step="any"
                        />

                        <select
                            class="face-input"
                            data-face-id="${face.id}"
                            data-element="${element}"
                            data-field="unit"
                            style="cursor: pointer; font-size: 11px;"
                        >
                            ${units.map(u => `<option value="${u.value}">${u.symbol || u.label.substring(0, 8)}</option>`).join('')}
                        </select>

                        <input
                            type="number"
                            class="face-input"
                            placeholder="Min"
                            data-face-id="${face.id}"
                            data-element="${element}"
                            data-field="targetMin"
                            style="font-size: 12px;"
                            step="any"
                        />

                        <input
                            type="number"
                            class="face-input"
                            placeholder="Ideal"
                            data-face-id="${face.id}"
                            data-element="${element}"
                            data-field="targetIdeal"
                            style="font-size: 12px;"
                            step="any"
                        />
                    </div>
                </div>
            `;
        });

        html += '</div>';
    });

    html += '</div>';
    return html;
}

/**
 * Complete Step 2: KPI Mapping
 */
function completeStep2() {
    // Collect KPI data from form
    demoState.kpiData = collectKPIData();

    // Validate
    if (!demoState.kpiData || demoState.kpiData.length === 0) {
        alert('Please enter at least one KPI');
        return;
    }

    // NEW: Generate edges/vertices for custom flow using Context Synthesizer
    // This ensures the 3D visualization has complete data for non-template flows
    if (!demoState.loadedMappingContext && demoState.faceConfig) {
        console.log('🔮 Custom flow detected - synthesizing edges and vertices...');

        // Check if Context Synthesizer is available
        if (window.ContextSynthesizer && typeof window.ContextSynthesizer.synthesizeCustomContext === 'function') {
            try {
                const synthesizedContext = window.ContextSynthesizer.synthesizeCustomContext(
                    demoState.faceConfig,
                    demoState.kpiData
                );

                if (synthesizedContext) {
                    demoState.loadedMappingContext = synthesizedContext;
                    console.log('✅ Context Synthesizer generated:',
                        synthesizedContext.edges?.length || 0, 'edges,',
                        synthesizedContext.vertices?.length || 0, 'vertices');
                }
            } catch (error) {
                console.error('⚠️ Context Synthesizer failed:', error);
                // Continue anyway - visualization will work without edges
            }
        } else {
            console.warn('⚠️ Context Synthesizer not loaded - 3D view may lack edge data');
        }
    }

    // Mark completed
    markStepCompleted(2);

    console.log('✅ Step 2 completed:', demoState.kpiData);

    // Go to calculation
    goToStep(3);

    // Auto-run calculation
    runCalculation();
}

/**
 * Autofill KPI suggestion (Quick Mode)
 */
function autofillKPISuggestion(inputElement, faceId) {
    const kpiName = inputElement.value.trim();
    const datalistOptions = inputElement.list?.options;

    console.log(`🔧 Autofill triggered for Face ${faceId}, KPI name: "${kpiName}"`);

    if (!kpiName) {
        console.log(`   ⚠️ No KPI name entered`);
        return;
    }

    if (!datalistOptions) {
        console.log(`   ⚠️ No datalist options found`);
        return;
    }

    // Ensure the input value is set (sometimes datalist doesn't persist)
    inputElement.value = kpiName;
    inputElement.setAttribute('value', kpiName);

    // Find matching option
    let matched = false;
    for (let option of datalistOptions) {
        if (option.value === kpiName) {
            // Autofill unit, min, and ideal if available
            const faceInputs = document.querySelectorAll(`[data-face-id="${faceId}"]`);

            faceInputs.forEach(input => {
                const field = input.getAttribute('data-field');

                if (field === 'unit' && option.dataset.unit) {
                    input.value = option.dataset.unit;
                }
                if (field === 'targetMin' && option.dataset.min && !input.value) {
                    input.value = option.dataset.min;
                }
                if (field === 'targetIdeal' && option.dataset.ideal && !input.value) {
                    input.value = option.dataset.ideal;
                }
            });

            matched = true;
            console.log(`✅ Autofilled KPI: ${kpiName}`);
            break;
        }
    }

    if (!matched) {
        console.log(`   ℹ️ No matching suggestion found (custom KPI: "${kpiName}")`);
    }

    // Trigger live normalization after autofill
    setTimeout(() => calculateLiveNormalization(faceId), 100);
}

/**
 * Autofill elemental KPI suggestion (Full Mode)
 */
function autofillElementalKPI(inputElement, faceId, element) {
    const kpiName = inputElement.value;
    const datalistOptions = inputElement.list?.options;

    if (!datalistOptions) return;

    // Find matching option
    for (let option of datalistOptions) {
        if (option.value === kpiName) {
            // Autofill unit, min, and ideal if available
            const faceInputs = document.querySelectorAll(`[data-face-id="${faceId}"][data-element="${element}"]`);

            faceInputs.forEach(input => {
                const field = input.getAttribute('data-field');

                if (field === 'unit' && option.dataset.unit) {
                    input.value = option.dataset.unit;
                }
                if (field === 'targetMin' && option.dataset.min && !input.value) {
                    input.value = option.dataset.min;
                }
                if (field === 'targetIdeal' && option.dataset.ideal && !input.value) {
                    input.value = option.dataset.ideal;
                }
            });

            console.log(`✅ Autofilled ${element} KPI: ${kpiName}`);
            break;
        }
    }
}

/**
 * Calculate live normalization for a KPI (Quick Mode)
 */
function calculateLiveNormalization(faceId) {
    // Get all inputs for this face
    const inputs = document.querySelectorAll(`[data-face-id="${faceId}"]`);
    const kpiData = {};

    inputs.forEach(input => {
        const field = input.getAttribute('data-field');
        kpiData[field] = input.value;
    });

    // Get values
    const value = parseFloat(kpiData.value);
    const targetMin = parseFloat(kpiData.targetMin);
    const targetIdeal = parseFloat(kpiData.targetIdeal);
    const direction = kpiData.direction || '↑';

    // Show/hide preview
    const previewDiv = document.getElementById(`normalization-preview-${faceId}`);
    const normValueSpan = document.getElementById(`norm-value-${faceId}`);

    // Only show if we have all required values
    if (isNaN(value) || isNaN(targetMin) || isNaN(targetIdeal)) {
        previewDiv.style.display = 'none';
        return;
    }

    // Calculate normalized score based on direction
    let normalized = 0;

    if (direction === '↑') {
        // Higher is better
        normalized = (value - targetMin) / (targetIdeal - targetMin);
    } else if (direction === '↓') {
        // Lower is better
        normalized = (targetMin - value) / (targetMin - targetIdeal);
    } else if (direction === 'Band') {
        // Sweet spot (band target)
        const midpoint = (targetMin + targetIdeal) / 2;
        const range = Math.abs(targetIdeal - targetMin) / 2;
        const distance = Math.abs(value - midpoint);
        normalized = Math.max(0, 1 - (distance / range));
    }

    // Clamp between 0 and 1
    normalized = Math.max(0, Math.min(1, normalized));

    // Display
    const percentage = (normalized * 100).toFixed(1);
    normValueSpan.textContent = `${percentage}%`;

    // Color code
    if (normalized >= 0.7) {
        normValueSpan.style.color = '#00ff88';
    } else if (normalized >= 0.4) {
        normValueSpan.style.color = '#ffcc00';
    } else {
        normValueSpan.style.color = '#ff6666';
    }

    previewDiv.style.display = 'block';
}

/**
 * Collect KPI data from form - ENHANCED with units and default to 0 for empty values
 */
function collectKPIData() {
    const kpis = [];

    console.log('📊 Collecting KPI data...');
    console.log('   Mode:', demoState.kpiMode);
    console.log('   Faces:', demoState.faceConfig.faces.length);

    if (demoState.kpiMode === 'quick') {
        // Collect 12 KPIs (one per face)
        demoState.faceConfig.faces.forEach(face => {
            const inputs = document.querySelectorAll(`[data-face-id="${face.id}"]`);
            const kpiData = {};

            inputs.forEach(input => {
                const field = input.getAttribute('data-field');
                // Check both value and data-current-value (in case of datalist issues)
                const currentValue = input.getAttribute('data-current-value') || input.value;
                kpiData[field] = field === 'kpiName' ? currentValue.trim() : input.value;

                // Debug: Show what we're capturing
                if (field === 'kpiName') {
                    console.log(`      🔍 Input value: "${input.value}", data-current-value: "${input.getAttribute('data-current-value')}"`);
                }
            });

            console.log(`   Face ${face.id} (${face.name}):`, kpiData);

            // Only require kpiName - value defaults to 0 if empty
            if (kpiData.kpiName && kpiData.kpiName.length > 0) {
                const kpiEntry = {
                    faceId: face.id,
                    faceName: face.name,
                    id: `F${face.id}_K1`,
                    name: kpiData.kpiName,
                    value: parseFloat(kpiData.value) || 0, // ✅ Default to 0
                    unit: kpiData.unit || 'number',
                    direction: kpiData.direction || '↑',
                    targetMin: parseFloat(kpiData.targetMin) || 0,
                    targetIdeal: parseFloat(kpiData.targetIdeal) || 100,
                    element: 'Earth' // Default for quick mode
                };
                kpis.push(kpiEntry);
                console.log(`      ✅ Added KPI:`, kpiEntry);
            } else {
                console.log(`      ⚠️ Skipped (no KPI name entered for this face)`);
            }
        });
    } else {
        // Collect 60 KPIs (5 per face)
        const elements = ['Earth', 'Water', 'Fire', 'Air', 'Ether'];

        demoState.faceConfig.faces.forEach(face => {
            elements.forEach((element, eIndex) => {
                const inputs = document.querySelectorAll(`[data-face-id="${face.id}"][data-element="${element}"]`);
                const kpiData = {};

                inputs.forEach(input => {
                    const field = input.getAttribute('data-field');
                    kpiData[field] = input.value;
                });

                // Only require kpiName - value defaults to 0 if empty
                if (kpiData.kpiName) {
                    const kpiEntry = {
                        faceId: face.id,
                        faceName: face.name,
                        id: `F${face.id}_K${eIndex + 1}`,
                        name: kpiData.kpiName,
                        value: parseFloat(kpiData.value) || 0, // ✅ Default to 0
                        unit: kpiData.unit || 'number',
                        direction: '↑',
                        targetMin: parseFloat(kpiData.targetMin) || 0,
                        targetIdeal: parseFloat(kpiData.targetIdeal) || 100,
                        element: element
                    };
                    kpis.push(kpiEntry);
                    console.log(`      ✅ Added ${element} KPI:`, kpiEntry);
                }
            });
        });
    }

    console.log(`📊 Total KPIs collected: ${kpis.length}`);

    // Validation feedback: warn if no KPIs collected
    if (kpis.length === 0) {
        console.warn('[collectKPIData] No KPIs collected - check if form was rendered');
        alert('Please enter at least one KPI with a name before proceeding.');
    }

    return kpis;
}

/**
 * Run coherence calculation
 */
async function runCalculation() {
    showLoading('Calculating coherence...');

    // Simulate calculation delay for UX
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
        console.log('🔬 Running calculation...');

        // ========================================
        // 🔄 TRANSFORMATION LAYER
        // ========================================
        // Transform UI data to Engine format using DataTransformer
        let companyData;

        if (typeof window.DataTransformer !== 'undefined') {
            console.log('   🔄 Using Data Transformation Layer');

            // Prepare data for transformation
            const demoData = {
                faceConfig: demoState.faceConfig,
                kpiMode: demoState.kpiMode,
                kpiData: demoState.kpiData
            };

            // Validate before transforming
            const validation = window.DataTransformer.validate(demoData);
            console.log('   📋 Validation:', validation);

            if (!validation.valid) {
                throw new Error(`Data validation failed: ${validation.errors.join(', ')}`);
            }

            if (validation.warnings.length > 0) {
                console.warn('   ⚠️ Warnings:', validation.warnings);
            }

            // Transform to engine format
            companyData = window.DataTransformer.transform(demoData);
            console.log('   ✅ Data transformed successfully');
        } else {
            console.warn('   ⚠️ DataTransformer not loaded - using raw format');

            // Fallback: Use raw format (may cause issues)
            companyData = {
                name: demoState.faceConfig.templateName,
                kpis: demoState.kpiData
            };
        }

        console.log('   Company name:', companyData.name);
        console.log('   KPIs count:', companyData.kpis.length);
        console.log('   Sample KPI:', companyData.kpis[0]);

        // ========================================
        // 🧮 CALCULATION ENGINE
        // ========================================
        // Check if Quannex engine is loaded
        if (typeof window.quannexEngine !== 'undefined') {
            console.log('   ✅ Using Quannex Engine');

            // Use real engine
            await window.quannexEngine.initializeWithCompany(companyData);
            const engineState = window.quannexEngine.getState();

            console.log('   ✅ Engine calculation complete');

            // Transform results back to UI format
            if (typeof window.DataTransformer !== 'undefined') {
                demoState.coherenceResults = window.DataTransformer.transformResults(engineState);
            } else {
                demoState.coherenceResults = engineState;
            }

            console.log('   ✅ Results ready for display:', demoState.coherenceResults);
        } else {
            console.log('   ⚠️ Quannex Engine not loaded - using fallback calculation');

            // Fallback: Simple calculation (works with UI format)
            demoState.coherenceResults = calculateSimpleCoherence(demoState.kpiData);

            console.log('   ✅ Fallback calculation completed:', demoState.coherenceResults);
        }

        // Display results
        displayCalculationResults();

        hideLoading();
    } catch (error) {
        console.error('❌ Calculation failed:', error);
        console.error('   Error details:', error.message);
        console.error('   Stack:', error.stack);
        hideLoading();
        alert(`Calculation failed: ${error.message}\n\nPlease check console for details.`);
    }
}

/**
 * Simple coherence calculation (fallback)
 */
function calculateSimpleCoherence(kpis) {
    console.log('🧮 Starting simple coherence calculation...');
    console.log('   Input KPIs:', kpis.length);

    const faceEnergies = {};

    // Group KPIs by face
    kpis.forEach(kpi => {
        if (!faceEnergies[kpi.faceId]) {
            faceEnergies[kpi.faceId] = {
                id: kpi.faceId,
                name: kpi.faceName,
                kpis: [],
                energy: 0
            };
        }

        // Normalize KPI based on direction
        let normalized = 0;

        if (kpi.direction === '↑') {
            // Higher is better
            normalized = (kpi.value - kpi.targetMin) / (kpi.targetIdeal - kpi.targetMin);
        } else if (kpi.direction === '↓') {
            // Lower is better
            normalized = (kpi.targetMin - kpi.value) / (kpi.targetMin - kpi.targetIdeal);
        } else if (kpi.direction === 'Band') {
            // Sweet spot (band target)
            const midpoint = (kpi.targetMin + kpi.targetIdeal) / 2;
            const range = Math.abs(kpi.targetIdeal - kpi.targetMin) / 2;
            const distance = Math.abs(kpi.value - midpoint);
            normalized = Math.max(0, 1 - (distance / range));
        }

        const score = Math.max(0, Math.min(1, normalized));

        console.log(`   KPI: ${kpi.name} = ${kpi.value} → ${(score * 100).toFixed(1)}%`);

        faceEnergies[kpi.faceId].kpis.push({
            ...kpi,
            normalizedScore: score
        });
    });

    // Calculate face energies
    Object.values(faceEnergies).forEach(face => {
        if (face.kpis.length > 0) {
            const avgScore = face.kpis.reduce((sum, kpi) => sum + kpi.normalizedScore, 0) / face.kpis.length;
            face.energy = avgScore;
            console.log(`   Face ${face.id} (${face.name}): ${face.kpis.length} KPIs → ${(face.energy * 100).toFixed(1)}%`);
        } else {
            face.energy = 0;
            console.log(`   Face ${face.id} (${face.name}): No KPIs → 0%`);
        }
    });

    // Calculate global coherence
    const faces = Object.values(faceEnergies);
    const globalCoherence = faces.length > 0
        ? faces.reduce((sum, face) => sum + face.energy, 0) / faces.length
        : 0;

    console.log(`🧮 Calculation complete:`);
    console.log(`   Global Coherence: ${(globalCoherence * 100).toFixed(1)}%`);
    console.log(`   Status: ${getCoherenceStatus(globalCoherence)}`);

    return {
        globalCoherence: globalCoherence,
        coherenceStatus: getCoherenceStatus(globalCoherence),
        faces: faces
    };
}

/**
 * Get coherence status label
 */
function getCoherenceStatus(coherence) {
    if (coherence >= 0.9) return 'Radiant';
    if (coherence >= 0.8) return 'Excellent';
    if (coherence >= 0.7) return 'Healthy';
    if (coherence >= 0.6) return 'Moderate';
    if (coherence >= 0.5) return 'Fair';
    if (coherence >= 0.4) return 'Concerning';
    if (coherence >= 0.3) return 'Critical';
    return 'Crisis';
}

/**
 * Display calculation results
 */
function displayCalculationResults() {
    const resultDiv = document.getElementById('calculationResult');
    const scoreDiv = document.getElementById('coherenceScore');

    const coherence = demoState.coherenceResults.globalCoherence;
    const status = demoState.coherenceResults.coherenceStatus;

    scoreDiv.textContent = `Global Coherence: ${(coherence * 100).toFixed(1)}% (${status})`;
    resultDiv.style.display = 'block';

    // Show calculation breakdown
    displayCalculationTransparency();

    // Identify nervous endpoints
    identifyNervousEndpoints();

    // 🔧 FIX: Update sessionStorage immediately after calculation
    // This allows users to recalculate and see updates in already-open 3D views
    updateSessionStorage();
}

/**
 * Update sessionStorage with latest data
 */
function updateSessionStorage() {
    if (demoState.kpiData && demoState.kpiData.length > 0) {
        // Get actual company name from loaded template or face config
        const companyName = demoState.loadedMappingContext?.displayName
            || demoState.faceConfig?.templateName
            || 'Custom Analysis';

        const customCompanyData = {
            id: 'custom',
            name: companyName,
            description: 'User-generated data from Orchestrator',
            kpis: demoState.kpiData,
            faceConfig: demoState.faceConfig,
            coherenceResults: demoState.coherenceResults,
            breathAxes: demoState.loadedMappingContext?.breathAxes || null, // Sprint 3 Task 27: Include breath data
            edges: demoState.loadedMappingContext?.edges || null, // Sprint 3 Task 28: Include edge data for 3D hover
            dominantOctave: demoState.loadedMappingContext?.dominantOctave || 1,
            tuning: demoState.loadedMappingContext?.diagnostics?.tuning || null, // Tuning perspective for consistent calculation
            isCustomData: true,
            timestamp: new Date().toISOString() // Fresh timestamp on each update
        };

        sessionStorage.setItem('customCompanyData', JSON.stringify(customCompanyData));
        sessionStorage.setItem('selectedCompanyId', 'custom');
        console.log('💾 Updated sessionStorage with latest data (timestamp:', customCompanyData.timestamp, ')');

        // Ensure session monitoring is active
        if (!SessionManager._checkTimer) {
            SessionManager.start();
        }

        // Issue #12: Broadcast state change to other windows (3D views, etc.)
        if (window.CrossWindowSync) {
            CrossWindowSync.broadcast('STATE_UPDATE', {
                customCompanyData,
                demoState: {
                    currentStep: demoState.currentStep,
                    faceConfig: demoState.faceConfig,
                    coherenceResults: demoState.coherenceResults
                }
            });
        }
    }
}

/**
 * Display calculation transparency
 */
function displayCalculationTransparency() {
    const section = document.getElementById('calculationTransparency');

    let html = '<div style="margin-top: 30px;">';
    html += '<h3 style="font-size: 16px; margin-bottom: 20px; color: rgba(255, 255, 255, 0.8);">Calculation Breakdown</h3>';

    demoState.coherenceResults.faces.forEach(face => {
        const energy = face.energy || face.faceEnergy || 0;
        const percentage = (energy * 100).toFixed(1);
        const color = energy >= 0.7 ? '#00ff88' : energy >= 0.4 ? '#ffcc00' : '#ff6666';

        html += `
            <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 15px; margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-size: 14px; font-weight: 600; color: #fff;">Face ${face.id}: ${face.name}</div>
                        <div style="font-size: 11px; color: rgba(255, 255, 255, 0.6); margin-top: 5px;">
                            ${face.kpis ? face.kpis.length : 0} KPIs analyzed
                        </div>
                    </div>
                    <div style="font-size: 24px; font-weight: 600; color: ${color};">
                        ${percentage}%
                    </div>
                </div>
                <div style="margin-top: 10px; height: 6px; background: rgba(0, 0, 0, 0.3); border-radius: 3px; overflow: hidden;">
                    <div style="width: ${percentage}%; height: 100%; background: ${color}; transition: width 0.5s ease;"></div>
                </div>
            </div>
        `;
    });

    html += '</div>';
    section.innerHTML = html;
}

/**
 * Complete Step 3: Calculation
 */
function completeStep3() {
    markStepCompleted(3);
    goToStep(4);

    // Initialize Coherence Hero when entering Step 4 (Sprint 3 Task 26)
    initializeCoherenceHero();

    // Initialize Portrait View when entering Step 4
    initializePortraitView();

    // Initialize Octave Dashboard when entering Step 4 (Sprint 3 Task 30)
    initializeOctaveDashboard();
}

// Portrait View instance holder
let portraitViewInstance = null;

/**
 * Octave reference data for dashboard population
 */
const OCTAVE_REFERENCE = {
    1: {
        name: 'Survival',
        focus: 'Existence',
        color: '#ff6b6b',
        gradient: 'linear-gradient(135deg, #ff6b6b, #ff8e53)',
        description: 'The organization is fighting to exist. Focus is on basic viability.',
        questions: [
            'Are we actively seeking resources to exist?',
            'Do we have enough cash to survive?',
            'Is any work getting done?',
            'Does the founder have the energy to exist?'
        ],
        breathInsight: 'At this stage, every breath is about staying alive. Resources in, survival out.',
        advanceHint: 'Secure basic viability first. Once survival is stable, you can begin building structure.'
    },
    2: {
        name: 'Structure',
        focus: 'Stability',
        color: '#ffa94d',
        gradient: 'linear-gradient(135deg, #ffa94d, #ffd43b)',
        description: 'Building stable foundations. Processes and systems are being established.',
        questions: [
            'Are systems being documented?',
            'Is knowledge being preserved?',
            'Are processes repeatable?',
            'Do we have a clear operational rhythm?'
        ],
        breathInsight: 'Structure brings rhythm to chaos. Each exhale is a process documented.',
        advanceHint: 'Document and systematize key processes. When foundations are solid, relationships can flourish.'
    },
    3: {
        name: 'Relationships',
        focus: 'Connection',
        color: '#69db7c',
        gradient: 'linear-gradient(135deg, #69db7c, #94d82d)',
        description: 'Growing through connection. Community and partnerships are central.',
        questions: [
            'Are we building meaningful partnerships?',
            'Is our team growing in harmony?',
            'Do our stakeholders feel valued?',
            'Is communication flowing both ways?'
        ],
        breathInsight: 'Relationships are the breath between beings. Inhale others\' wisdom, exhale your value.',
        advanceHint: 'Deepen key relationships. When connections are strong, creativity emerges naturally.'
    },
    4: {
        name: 'Creativity',
        focus: 'Innovation',
        color: '#4dabf7',
        gradient: 'linear-gradient(135deg, #4dabf7, #748ffc)',
        description: 'Innovation flourishes. New ideas emerge and are welcomed.',
        questions: [
            'Is experimentation encouraged?',
            'Do people feel safe to propose new ideas?',
            'Are we solving problems creatively?',
            'Is there space for play and exploration?'
        ],
        breathInsight: 'Creativity is the breath of new possibility. Let go of what was to create what can be.',
        advanceHint: 'Foster innovation culture. When creativity flows freely, authentic expression becomes possible.'
    },
    5: {
        name: 'Expression',
        focus: 'Authenticity',
        color: '#a78bfa',
        gradient: 'linear-gradient(135deg, #a78bfa, #f472b6)',
        description: 'Authentic voice emerging. The organization expresses its unique identity.',
        questions: [
            'Is our brand voice distinctive and true?',
            'Do our actions match our stated values?',
            'Are we communicating our unique perspective?',
            'Is there coherence between inner and outer?'
        ],
        breathInsight: 'Expression is truth made visible. Each exhale shares your authentic essence.',
        advanceHint: 'Refine authentic expression. When you speak your truth fully, vision crystallizes.'
    },
    6: {
        name: 'Vision',
        focus: 'Purpose',
        color: '#da77f2',
        gradient: 'linear-gradient(135deg, #da77f2, #f06595)',
        description: 'Clear sight of purpose. Strategic vision guides all decisions.',
        questions: [
            'Is our long-term vision crystal clear?',
            'Does everyone understand the "why"?',
            'Are we seeing patterns others miss?',
            'Is our strategy aligned with deeper purpose?'
        ],
        breathInsight: 'Vision is the breath of the future. Inhale possibility, exhale direction.',
        advanceHint: 'Clarify and embody the vision. When vision is lived fully, radiance emerges.'
    },
    7: {
        name: 'Radiance',
        focus: 'Service',
        color: '#ffd43b',
        gradient: 'linear-gradient(135deg, #ffd43b, #ffe066)',
        description: 'Full coherence achieved. The organization serves something greater than itself.',
        questions: [
            'Are we serving the greater good?',
            'Is our impact regenerative?',
            'Do we uplift those we touch?',
            'Is there joy in our work?'
        ],
        breathInsight: 'Radiance is the breath of service. Every exhale blesses the world.',
        advanceHint: 'Radiance is the culmination. Maintain coherence while expanding your service to the world.'
    }
};

/**
 * Initialize Octave Dashboard with current data
 */
/**
 * Initialize Coherence Hero Section (Sprint 3 Task 26)
 * Displays the coherence score prominently at the top of Step 4
 */
function initializeCoherenceHero() {
    if (!demoState.coherenceResults) {
        console.warn('[CoherenceHero] No coherence results available');
        return;
    }

    const coherence = demoState.coherenceResults.globalCoherence || 0;
    const coherencePercent = (coherence * 100).toFixed(1);

    // Determine interpretation based on coherence level
    let interpretation = '';
    let detail = '';

    if (coherence >= 0.85) {
        interpretation = 'Exceptional Coherence';
        detail = 'Your organization demonstrates masterful integration across all dimensions. This is rare and represents organizational radiance.';
    } else if (coherence >= 0.7) {
        interpretation = 'Strong Coherence';
        detail = 'Your organization shows excellent alignment. Most dimensions work harmoniously together with clear synergies.';
    } else if (coherence >= 0.5) {
        interpretation = 'Developing Coherence';
        detail = 'Your organization has solid foundations with room for growth. Focus on strengthening the connections between dimensions.';
    } else if (coherence >= 0.382) {
        interpretation = 'Emerging Coherence';
        detail = 'Your organization is in early development. The dodecahedron reveals specific areas requiring focused attention.';
    } else {
        interpretation = 'Foundational Stage';
        detail = 'Your organization is at the beginning of its coherence journey. Every step forward matters. The path is clear.';
    }

    // Update hero elements
    const scoreEl = document.getElementById('hero-coherence-score');
    const interpEl = document.getElementById('hero-coherence-interpretation');
    const detailEl = document.getElementById('hero-coherence-detail');

    if (scoreEl) scoreEl.textContent = `${coherencePercent}%`;
    if (interpEl) interpEl.textContent = interpretation;
    if (detailEl) detailEl.textContent = detail;

    // Update hero border color based on coherence
    const heroEl = document.getElementById('coherence-hero');
    if (heroEl) {
        let borderColor = 'rgba(0, 255, 204, 0.4)';
        if (coherence >= 0.85) {
            borderColor = 'rgba(255, 215, 0, 0.6)';
        } else if (coherence >= 0.7) {
            borderColor = 'rgba(0, 255, 136, 0.5)';
        } else if (coherence < 0.382) {
            borderColor = 'rgba(255, 107, 107, 0.5)';
        }
        heroEl.style.borderColor = borderColor;
    }

    console.log('[CoherenceHero] Initialized with coherence:', coherencePercent + '%');
}

function initializeOctaveDashboard() {
    // Try to get octave from loaded mapping context
    let dominantOctave = 1;
    let octaveStage = 'O1';
    let dominantBreathName = 'The Breath of Viability';
    let breathAxes = [];
    let integrityResult = null;  // Store Foundation Principle calculation result

    // Check for loaded mapping context
    if (demoState.loadedMappingContext) {
        dominantOctave = demoState.loadedMappingContext.dominantOctave || 1;
        octaveStage = demoState.loadedMappingContext.octaveStage || `O${dominantOctave}`;
        dominantBreathName = demoState.loadedMappingContext.dominantBreathName || 'The Breath of Viability';
        breathAxes = demoState.loadedMappingContext.breathAxes || [];
    }

    // ========================================
    // FOUNDATION PRINCIPLE: Use OctaveIntegrityCalculator
    // ========================================
    // If we have face-level coherence data, apply the Foundation Principle:
    // "An organization cannot claim a higher octave than its structural foundation supports"
    if (window.OctaveIntegrityCalculator && demoState.coherenceResults?.faces) {
        // Build face data with individual octaves
        const faceOctaveData = demoState.coherenceResults.faces.map(face => {
            // Get face coherence/energy
            const faceCoherence = face.energy || face.faceEnergy || face.coherence || 0.5;
            // Detect face-level octave from its coherence
            const faceOctave = window.OctaveIntegrityCalculator.detectOctaveFromCoherence(faceCoherence);
            return {
                id: face.id,
                name: face.name || `Face ${face.id}`,
                octave: faceOctave.octave,
                coherence: faceCoherence
            };
        });

        // Get lifecycle stage if available
        const lifecycleStage = demoState.loadedMappingContext?.lifecycleStage || null;

        // Calculate organizational octave with Foundation Principle
        integrityResult = window.OctaveIntegrityCalculator.calculateOrganizationalOctave(
            faceOctaveData,
            lifecycleStage
        );

        // Use Foundation Principle result if available
        if (integrityResult && integrityResult.orgOctave) {
            dominantOctave = integrityResult.orgOctave;
            octaveStage = `O${dominantOctave}`;
            console.log('[OctaveDashboard] Foundation Principle applied:', {
                orgOctave: dominantOctave,
                geoMean: integrityResult.geoMean,
                spread: integrityResult.spread,
                penalty: integrityResult.penalty,
                warnings: integrityResult.warnings?.length || 0
            });
        }
    }
    // Fallback: If no face data, detect from global coherence
    else if (!demoState.loadedMappingContext && demoState.coherenceResults) {
        const avgCoherence = demoState.coherenceResults.globalCoherence || 0.5;
        dominantOctave = detectOctaveFromCoherence(avgCoherence);
    }

    const octaveData = OCTAVE_REFERENCE[dominantOctave] || OCTAVE_REFERENCE[1];
    const nextOctave = Math.min(7, dominantOctave + 1);
    const nextOctaveData = OCTAVE_REFERENCE[nextOctave];

    // Update progress bar (14% per octave)
    const progressPercent = (dominantOctave / 7) * 100;
    const progressFill = document.getElementById('octave-progress-fill');
    const progressMarker = document.getElementById('octave-progress-marker');
    if (progressFill) progressFill.style.width = `${progressPercent}%`;
    if (progressMarker) progressMarker.style.left = `${progressPercent}%`;

    // Update progress bar gradient based on octave
    if (progressFill) {
        progressFill.style.background = octaveData.gradient;
    }

    // Update badge
    const badge = document.getElementById('octave-badge');
    if (badge) {
        badge.textContent = `O${dominantOctave}`;
        badge.style.background = octaveData.gradient;
    }

    // Update name and description
    const nameEl = document.getElementById('octave-name');
    const focusEl = document.getElementById('octave-focus');
    const descEl = document.getElementById('octave-description');

    if (nameEl) {
        nameEl.textContent = octaveData.name;
        nameEl.style.color = octaveData.color;
    }
    if (focusEl) {
        focusEl.innerHTML = `Focus: <span style="color: ${octaveData.color};">${octaveData.focus}</span>`;
    }
    if (descEl) {
        descEl.textContent = octaveData.description;
    }

    // Update questions from breath axes if available, otherwise use defaults
    const questionsEl = document.getElementById('octave-questions');
    if (questionsEl) {
        let questions = octaveData.questions;

        // If we have breath axes, use their questions
        if (breathAxes.length > 0) {
            questions = breathAxes
                .filter(axis => axis.projectionQuestion || axis.receptionQuestion)
                .slice(0, 4)
                .flatMap(axis => [
                    axis.projectionQuestion,
                    axis.receptionQuestion
                ])
                .filter(q => q)
                .slice(0, 4);
        }

        questionsEl.innerHTML = questions.map((q, i) =>
            `<div style="padding: 8px 0; ${i < questions.length - 1 ? 'border-bottom: 1px solid rgba(255,255,255,0.05);' : ''}">• ${q}</div>`
        ).join('');
    }

    // Update next octave preview
    const nextBadgeDiv = document.querySelector('#next-octave-preview > div:first-child > div:first-child');
    const nextNameDiv = document.querySelector('#next-octave-preview .font-weight-600, #next-octave-preview div > div > div:first-child');

    if (dominantOctave < 7) {
        const nextPreview = document.getElementById('next-octave-preview');
        if (nextPreview) {
            nextPreview.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                    <div style="width: 40px; height: 40px; border-radius: 50%; background: rgba(167,139,250,0.2); border: 2px solid ${nextOctaveData.color}40; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; color: ${nextOctaveData.color};">O${nextOctave}</div>
                    <div>
                        <div style="font-weight: 600; color: ${nextOctaveData.color};">${nextOctaveData.name}</div>
                        <div style="font-size: 11px; color: rgba(255,255,255,0.5);">Focus: ${nextOctaveData.focus}</div>
                    </div>
                </div>
                <div style="font-size: 12px; color: rgba(255,255,255,0.6); line-height: 1.6;">
                    ${nextOctaveData.description}
                </div>
                <div style="margin-top: 12px; padding: 10px; background: ${nextOctaveData.color}15; border-radius: 6px; font-size: 11px; color: rgba(255,255,255,0.7);">
                    💡 <strong>To advance:</strong> ${octaveData.advanceHint}
                </div>
            `;
        }
    } else {
        // At O7 - show completion message
        const nextPreview = document.getElementById('next-octave-preview');
        if (nextPreview) {
            nextPreview.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <span style="font-size: 32px;">✨</span>
                    <div style="font-weight: 600; color: #ffd43b; margin-top: 10px;">Full Radiance Achieved</div>
                    <div style="font-size: 12px; color: rgba(255,255,255,0.6); margin-top: 8px;">
                        The journey continues in service to others. Your coherence becomes a gift to the world.
                    </div>
                </div>
            `;
        }
    }

    // Update breath insight
    const breathNameEl = document.getElementById('dominant-breath-name');
    const breathInsightEl = document.getElementById('dominant-breath-insight');

    if (breathNameEl) {
        breathNameEl.textContent = `"${dominantBreathName}"`;
    }
    if (breathInsightEl) {
        breathInsightEl.textContent = octaveData.breathInsight;
    }

    // Highlight current octave in progress bar labels
    const labels = document.querySelectorAll('#octave-progress-labels span');
    labels.forEach((label, i) => {
        if (i + 1 === dominantOctave) {
            label.style.color = octaveData.color;
            label.style.fontWeight = '600';
        } else {
            label.style.color = 'rgba(255,255,255,0.4)';
            label.style.fontWeight = 'normal';
        }
    });

    // ========================================
    // SPREAD WARNING UI (Foundation Principle Feedback)
    // ========================================
    displayFoundationPrincipleWarnings(integrityResult, octaveData.color);

    console.log(`🎵 Octave Dashboard initialized: O${dominantOctave} (${octaveData.name})`);
}

/**
 * Display Foundation Principle warnings in the Octave Dashboard
 * Shows spread warnings, structural misalignment alerts, and recommendations
 *
 * @param {Object|null} integrityResult - Result from OctaveIntegrityCalculator
 * @param {string} octaveColor - Current octave's theme color
 */
function displayFoundationPrincipleWarnings(integrityResult, octaveColor) {
    // Find or create warning container
    let warningContainer = document.getElementById('foundation-principle-warnings');

    // If no container exists, try to insert one after the octave progress section
    if (!warningContainer) {
        const octaveProgressContainer = document.querySelector('#octave-progress-fill')?.closest('div')?.parentElement;
        if (octaveProgressContainer) {
            warningContainer = document.createElement('div');
            warningContainer.id = 'foundation-principle-warnings';
            warningContainer.style.cssText = 'margin-top: 15px; transition: all 0.3s ease;';
            octaveProgressContainer.parentElement.insertBefore(warningContainer, octaveProgressContainer.nextSibling);
        }
    }

    // If still no container, skip
    if (!warningContainer) {
        console.warn('[FoundationWarnings] Could not find/create warning container');
        return;
    }

    // No integrity result means no Foundation Principle was applied
    if (!integrityResult) {
        warningContainer.innerHTML = '';
        return;
    }

    // Build warning HTML
    let warningsHtml = '';
    const warnings = integrityResult.warnings || [];

    // Show spread info if there's a penalty
    if (integrityResult.spread > 0) {
        const spreadColor = integrityResult.spread > 4 ? '#ff6b6b' :
                           integrityResult.spread > 2 ? '#ffa94d' : '#69db7c';
        const spreadIcon = integrityResult.spread > 4 ? '⚠️' :
                          integrityResult.spread > 2 ? '📊' : '✅';

        warningsHtml += `
            <div style="display: flex; align-items: center; gap: 10px; padding: 10px; background: ${spreadColor}15; border-left: 3px solid ${spreadColor}; border-radius: 0 6px 6px 0; margin-bottom: 10px;">
                <span style="font-size: 18px;">${spreadIcon}</span>
                <div style="flex: 1;">
                    <div style="font-size: 12px; font-weight: 600; color: ${spreadColor};">
                        Octave Spread: ${integrityResult.spread} levels (O${integrityResult.breakdown?.min || '?'} → O${integrityResult.breakdown?.max || '?'})
                    </div>
                    <div style="font-size: 11px; color: rgba(255,255,255,0.6); margin-top: 3px;">
                        ${integrityResult.spread <= 2 ? 'Healthy variance - well-aligned development' :
                          integrityResult.spread <= 4 ? 'Some faces are developing faster than others' :
                          'Critical misalignment detected - foundations need strengthening'}
                    </div>
                </div>
            </div>
        `;
    }

    // Show penalty info if applied
    if (integrityResult.penalty > 0) {
        warningsHtml += `
            <div style="display: flex; align-items: center; gap: 10px; padding: 10px; background: rgba(255,170,77,0.1); border-left: 3px solid #ffa94d; border-radius: 0 6px 6px 0; margin-bottom: 10px;">
                <span style="font-size: 18px;">📉</span>
                <div style="flex: 1;">
                    <div style="font-size: 12px; font-weight: 600; color: #ffa94d;">
                        Foundation Principle Applied: -${integrityResult.penalty.toFixed(1)} octave penalty
                    </div>
                    <div style="font-size: 11px; color: rgba(255,255,255,0.6); margin-top: 3px;">
                        Geometric mean was ${integrityResult.geoMean?.toFixed(2) || '?'}, reduced due to structural misalignment
                    </div>
                </div>
            </div>
        `;
    }

    // Show specific warnings
    warnings.forEach(warning => {
        if (warning.type === 'structural_misalignment' || warning.type === 'aspirational_outlier') {
            const color = warning.severity === 'critical' ? '#ff6b6b' : '#ffa94d';
            const icon = warning.severity === 'critical' ? '🚨' : '⚡';

            warningsHtml += `
                <div style="display: flex; align-items: flex-start; gap: 10px; padding: 10px; background: ${color}10; border-left: 3px solid ${color}; border-radius: 0 6px 6px 0; margin-bottom: 10px;">
                    <span style="font-size: 16px;">${icon}</span>
                    <div style="flex: 1;">
                        <div style="font-size: 12px; font-weight: 600; color: ${color};">
                            ${warning.message}
                        </div>
                        ${warning.detail ? `<div style="font-size: 11px; color: rgba(255,255,255,0.6); margin-top: 3px;">${warning.detail}</div>` : ''}
                        ${warning.recommendation ? `
                            <div style="font-size: 11px; color: rgba(0,255,204,0.8); margin-top: 6px; padding: 6px; background: rgba(0,255,204,0.1); border-radius: 4px;">
                                💡 ${warning.recommendation}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }
    });

    // Show octave distribution if we have breakdown
    if (integrityResult.breakdown?.distribution && Object.keys(integrityResult.breakdown.distribution).length > 1) {
        const distHtml = Object.entries(integrityResult.breakdown.distribution)
            .map(([oct, count]) => `<span style="padding: 2px 8px; background: rgba(255,255,255,0.1); border-radius: 10px; font-size: 10px;">${oct}: ${count}</span>`)
            .join(' ');

        warningsHtml += `
            <div style="padding: 8px 10px; background: rgba(255,255,255,0.05); border-radius: 6px; margin-bottom: 10px;">
                <div style="font-size: 11px; color: rgba(255,255,255,0.5); margin-bottom: 5px;">Face Octave Distribution:</div>
                <div style="display: flex; flex-wrap: wrap; gap: 6px; color: rgba(255,255,255,0.7);">
                    ${distHtml}
                </div>
            </div>
        `;
    }

    warningContainer.innerHTML = warningsHtml;

    if (warnings.length > 0) {
        console.log('[FoundationWarnings] Displayed', warnings.length, 'warnings');
    }
}

/**
 * Detect octave from coherence score
 */
function detectOctaveFromCoherence(coherence) {
    if (coherence >= 0.95) return 7;
    if (coherence >= 0.854) return 6;
    if (coherence >= 0.764) return 5;
    if (coherence >= 0.618) return 4;
    if (coherence >= 0.5) return 3;
    if (coherence >= 0.382) return 2;
    return 1;
}

/**
 * Initialize Portrait View with current coherence data
 */
function initializePortraitView() {
    if (!demoState.coherenceResults) {
        console.warn('[PortraitView] No coherence results available');
        return;
    }

    // Ensure faces array exists and has data (null-safe fallback)
    if (!demoState.coherenceResults.faces || demoState.coherenceResults.faces.length === 0) {
        console.warn('[PortraitView] No face data in coherence results, creating fallback');
        if (demoState.faceConfig && demoState.faceConfig.faces) {
            demoState.coherenceResults.faces = demoState.faceConfig.faces.map(f => ({
                id: f.id,
                name: f.name,
                energy: demoState.loadedMappingContext?.faces?.find(mf => mf.id === f.id)?.sentiment || 0.5,
                kpis: []
            }));
        }
    }

    // Wait for PortraitView to be available (it's a module)
    const waitForPortraitView = () => {
        if (typeof window.PortraitView === 'undefined') {
            console.log('[PortraitView] Waiting for module to load...');
            setTimeout(waitForPortraitView, 100);
            return;
        }

        console.log('[PortraitView] Initializing with coherence data');

        // Transform coherence results to Portrait View format
        const portraitData = transformToPortraitData(demoState.coherenceResults);

        // Create or update the Portrait View
        if (!portraitViewInstance) {
            portraitViewInstance = new window.PortraitView('portrait-view-container', {
                size: 380,
                showLabels: true,
                interactive: true
            });
        }

        portraitViewInstance.update(portraitData);
        console.log('[PortraitView] Updated with:', portraitData);
    };

    waitForPortraitView();
}

/**
 * Transform coherence results to Portrait View data format
 */
function transformToPortraitData(coherenceResults) {
    const faces = {};

    // Get face-level octaves if available
    let faceOctavesMap = {};
    if (typeof window.getFaceOctaves === 'function') {
        faceOctavesMap = window.getFaceOctaves();
    }

    // Detect overall octave from face-wizard or default
    let overallOctave = 'O3';
    if (typeof window.getOverallOctave === 'function') {
        overallOctave = window.getOverallOctave() || 'O3';
    } else if (Object.keys(faceOctavesMap).length > 0) {
        // Fallback: get from face octaves map
        const octaveValues = Object.values(faceOctavesMap).map(f => f.octave || 'O3');
        overallOctave = octaveValues[0] || 'O3';
    }

    // Transform each face
    coherenceResults.faces.forEach(face => {
        // Extract elemental breakdown if available
        const elements = extractElementalData(face);

        // Get face coherence
        const faceCoherence = face.energy || face.faceEnergy || 0.5;

        // Detect operational octave based on coherence AND elemental engagement
        const octaveInfo = detectOctave(faceCoherence, elements);

        // Get face-specific octave or use detected
        const faceOctaveInfo = faceOctavesMap[face.id];
        const faceOctave = faceOctaveInfo?.octave || face.targetOctave || octaveInfo.effective;

        faces[face.id] = {
            name: face.name || `Face ${face.id}`,
            coherence: faceCoherence,
            targetOctave: faceOctave,
            octaveInfo: octaveInfo, // Include full octave detection info
            elements: elements,
            kpis: face.kpis || [],
            warnings: []
        };

        // Add warnings for low coherence
        if (faceCoherence < 0.382) {
            faces[face.id].warnings.push('Critical: coherence below PHI²');
        } else if (faceCoherence < 0.5) {
            faces[face.id].warnings.push('Attention needed: developing coherence');
        }

        // Add warning if octave is limited by elemental coverage
        if (octaveInfo.limitedBy === 'elemental_coverage') {
            faces[face.id].warnings.push(`Octave limited: explore more elements to unlock ${octaveInfo.coherenceBased}`);
        }
    });

    // Ensure all 12 faces exist
    for (let i = 1; i <= 12; i++) {
        if (!faces[i]) {
            faces[i] = {
                name: getDefaultFaceName(i),
                coherence: 0,
                targetOctave: overallOctave,
                elements: getDefaultElements(),
                kpis: [],
                warnings: ['No data available']
            };
        }
    }

    return {
        overallCoherence: coherenceResults.globalCoherence || 0.5,
        octave: overallOctave,
        faces: faces
    };
}

/**
 * Extract elemental breakdown from face data
 * Enhanced: Tracks which elements are explored vs unexplored
 */
function extractElementalData(face) {
    // If face has explicit elemental data, use it
    if (face.elements) return face.elements;

    // Default: all elements unexplored (Quick Mode starts here)
    const elements = {
        earth: { value: null, label: 'Foundation', explored: false, question: 'Is it grounded?' },
        water: { value: null, label: 'Flow', explored: false, question: 'Is it flowing?' },
        fire: { value: null, label: 'Energy', explored: false, question: 'Is there action?' },
        air: { value: null, label: 'Communication', explored: false, question: 'Is it clear?' },
        ether: { value: null, label: 'Purpose', explored: false, question: 'Is it aligned?' }
    };

    if (face.kpis && face.kpis.length > 0) {
        // Try to extract from elemental KPIs
        const elementalKpis = {
            earth: face.kpis.filter(k => k.element === 'earth' || k.element === 'Earth'),
            water: face.kpis.filter(k => k.element === 'water' || k.element === 'Water'),
            fire: face.kpis.filter(k => k.element === 'fire' || k.element === 'Fire'),
            air: face.kpis.filter(k => k.element === 'air' || k.element === 'Air'),
            ether: face.kpis.filter(k => k.element === 'ether' || k.element === 'Ether')
        };

        Object.keys(elementalKpis).forEach(element => {
            const kpis = elementalKpis[element];
            if (kpis.length > 0) {
                const avgScore = kpis.reduce((sum, k) => sum + (k.normalizedScore || 0.5), 0) / kpis.length;
                elements[element] = {
                    value: avgScore,
                    label: kpis[0]?.label || kpis[0]?.name || element,
                    explored: true,
                    kpiName: kpis[0]?.name,
                    question: elements[element].question
                };
            }
        });

        // Quick Mode fallback: if no element tags, assign all to Earth
        const hasElementTags = Object.values(elementalKpis).some(arr => arr.length > 0);
        if (!hasElementTags && face.kpis.length > 0) {
            // In Quick Mode, the single KPI represents Earth element
            const kpi = face.kpis[0];
            const score = kpi.normalizedScore || kpi.coherence || face.energy || 0.5;
            elements.earth = {
                value: score,
                label: kpi.name || 'Foundation',
                explored: true,
                kpiName: kpi.name,
                question: 'Is it grounded?'
            };
        }
    }

    return elements;
}

/**
 * Detect operational octave based on coherence and engaged elements
 * Philosophy: Octave isn't a reward - it's recognition of which level questions are being engaged
 */
function detectOctave(faceCoherence, elementsExplored) {
    // Count how many elements have data
    const exploredCount = Object.values(elementsExplored).filter(e => e.explored).length;

    // Coherence thresholds for octave progression (PHI-based)
    const thresholds = {
        O1: 0.0,    // Survival - just existing
        O2: 0.382,  // Structure - PHI²
        O3: 0.5,    // Relationships - midpoint
        O4: 0.618,  // Creativity - PHI
        O5: 0.764,  // Expression - PHI + 0.146
        O6: 0.854,  // Vision - 1 - PHI²
        O7: 0.95    // Radiance - near unity
    };

    // Base octave from coherence score
    let detectedOctave = 'O1';
    if (faceCoherence >= thresholds.O7) detectedOctave = 'O7';
    else if (faceCoherence >= thresholds.O6) detectedOctave = 'O6';
    else if (faceCoherence >= thresholds.O5) detectedOctave = 'O5';
    else if (faceCoherence >= thresholds.O4) detectedOctave = 'O4';
    else if (faceCoherence >= thresholds.O3) detectedOctave = 'O3';
    else if (faceCoherence >= thresholds.O2) detectedOctave = 'O2';

    // Elemental engagement can elevate or limit octave
    // Full elemental engagement (5/5) allows full octave expression
    // Partial engagement caps the effective octave
    const octaveOrder = ['O1', 'O2', 'O3', 'O4', 'O5', 'O6', 'O7'];
    const maxOctaveByEngagement = Math.min(exploredCount + 2, 7); // 1 element = max O3, 5 elements = max O7
    const detectedIndex = octaveOrder.indexOf(detectedOctave);
    const effectiveIndex = Math.min(detectedIndex, maxOctaveByEngagement - 1);

    return {
        detected: detectedOctave,
        effective: octaveOrder[effectiveIndex],
        limitedBy: effectiveIndex < detectedIndex ? 'elemental_coverage' : null,
        exploredCount: exploredCount,
        coherenceBased: detectedOctave
    };
}

/**
 * Get default elements structure
 */
function getDefaultElements() {
    return {
        earth: { value: 0, label: 'Foundation' },
        water: { value: 0, label: 'Flow' },
        fire: { value: 0, label: 'Energy' },
        air: { value: 0, label: 'Communication' },
        ether: { value: 0, label: 'Purpose' }
    };
}

/**
 * Get default face name
 */
function getDefaultFaceName(faceId) {
    const defaultNames = {
        1: 'Financial Capital',
        2: 'Intellectual Capital',
        3: 'Human Capital',
        4: 'Structural Capital',
        5: 'Market Resonance',
        6: 'Community & Partners',
        7: 'Brand & Reputation',
        8: 'Core Operations',
        9: 'Regenerative Flow',
        10: 'Foundational Values',
        11: 'Funding Pipeline',
        12: 'Risk & Resilience'
    };
    return defaultNames[faceId] || `Face ${faceId}`;
}

/**
 * Identify nervous endpoints (Sprint 3 Task 26 Polish)
 */
function identifyNervousEndpoints() {
    const section = document.getElementById('nervousEndpoints');

    // Find faces with energy < 0.5 or missing data
    // We check all 12 faces to ensure structural gaps are caught
    const allFaceIds = Array.from({ length: 12 }, (_, i) => i + 1);
    const criticalFaces = [];
    const healthyFaces = [];

    allFaceIds.forEach(id => {
        const face = demoState.coherenceResults.faces.find(f => f.id === id);
        const energy = face ? (face.energy || face.faceEnergy || 0) : 0;
        const kpiCount = face && face.kpis ? face.kpis.length : 0;

        const faceInfo = {
            id: id,
            name: face ? face.name : `Face ${id}`,
            energy: energy
        };

        // Critical if energy is low OR if no data present (Structural Immaturity)
        if (energy < 0.5) {
            faceInfo.reason = kpiCount === 0 ? "Structural Immaturity (No Data)" : "Low Coherence";
            criticalFaces.push(faceInfo);
        } else if (energy >= 0.7) {
            faceInfo.reason = "Strong Performance";
            healthyFaces.push(faceInfo);
        }
    });

    criticalFaces.sort((a, b) => a.energy - b.energy);
    healthyFaces.sort((a, b) => b.energy - a.energy);

    if (criticalFaces.length === 0 && healthyFaces.length > 0) {
        // Show healthy faces when no critical issues
        let html = '';
        healthyFaces.slice(0, 3).forEach(face => {
            const percentage = (face.energy * 100).toFixed(1);
            html += `
                <div class="nervous-endpoint-card healthy">
                    <div class="endpoint-header">
                        <span class="endpoint-icon">✨</span>
                        <span class="endpoint-name">Face ${face.id}: ${face.name}</span>
                    </div>
                    <div class="endpoint-detail">
                        <strong>${percentage}%</strong> coherence — ${face.reason}
                    </div>
                </div>
            `;
        });
        section.innerHTML = html || '<p style="color: rgba(0, 255, 136, 0.8); text-align: center;">✅ All systems coherent!</p>';
        return;
    }

    let html = '';

    // Show critical faces (max 4)
    criticalFaces.slice(0, 4).forEach(face => {
        const percentage = (face.energy * 100).toFixed(1);
        const isCritical = face.energy < 0.3;
        const icon = isCritical ? '🚨' : '⚠️';

        html += `
            <div class="nervous-endpoint-card">
                <div class="endpoint-header">
                    <span class="endpoint-icon">${icon}</span>
                    <span class="endpoint-name">Face ${face.id}: ${face.name}</span>
                </div>
                <div class="endpoint-detail">
                    <strong>${percentage}%</strong> coherence — ${face.reason}
                </div>
            </div>
        `;
    });

    section.innerHTML = html || '<p style="color: rgba(255, 255, 255, 0.6); text-align: center;">No endpoints to display</p>';
}

/**
 * Sprint 4 Task 34: Identify and display highest leverage action
 * Finds the most impactful intervention point based on:
 * - Vertices with bermuda_triangle classification
 * - Faces with lowest energy in high-stress vertices
 */
function identifyHighestLeverageAction() {
    const panel = document.getElementById('leverageActionPanel');
    const content = document.getElementById('leverageActionContent');

    if (!panel || !content) return;

    // Get company data (template or custom)
    const companyData = demoState.templateContext || demoState.coherenceResults;
    if (!companyData || !companyData.faces) {
        panel.style.display = 'none';
        return;
    }

    const faces = companyData.faces;
    const vertices = companyData.vertices || [];

    // Strategy 1: Find bermuda_triangle vertex if available
    let leverageVertex = vertices.find(v => v.classification === 'bermuda_triangle');

    // Strategy 2: If no bermuda triangle, find highest vortex strength vertex
    if (!leverageVertex && vertices.length > 0) {
        leverageVertex = vertices.reduce((max, v) =>
            (v.vortexStrength || 0) > (max.vortexStrength || 0) ? v : max
        , vertices[0]);
    }

    // Strategy 3: If no vertices, just find the lowest-energy face
    if (!leverageVertex || !leverageVertex.faceIds) {
        const sortedFaces = [...faces].sort((a, b) =>
            (a.energy || a.faceEnergy || 0) - (b.energy || b.faceEnergy || 0)
        );
        const weakestFace = sortedFaces[0];

        if (!weakestFace || (weakestFace.energy || weakestFace.faceEnergy || 0) > 0.7) {
            // All faces are healthy, no leverage action needed
            panel.style.display = 'none';
            return;
        }

        // Display simple face-based leverage action
        const energy = (weakestFace.energy || weakestFace.faceEnergy || 0) * 100;
        content.innerHTML = `
            <div class="leverage-vertex-name">Primary Focus Area</div>
            <div class="leverage-target-face">
                <span class="face-icon">⚡</span>
                <div class="face-details">
                    <div class="face-name">${weakestFace.name || `Face ${weakestFace.id}`}</div>
                    <div class="face-energy">Currently at ${energy.toFixed(0)}% energy</div>
                </div>
            </div>
            <div class="leverage-insight">
                Strengthening this face will have the most immediate positive impact on overall organizational coherence.
            </div>
        `;
        panel.style.display = 'block';
        return;
    }

    // Full vertex-based analysis
    const vertexFaceIds = leverageVertex.faceIds || [];
    const vertexFaces = vertexFaceIds.map(id =>
        faces.find(f => f.id === id) || { id, name: `Face ${id}`, energy: 0 }
    );

    // Find the weakest face in this vertex
    const weakestFace = vertexFaces.reduce((min, f) => {
        const e1 = min.energy || min.faceEnergy || 0;
        const e2 = f.energy || f.faceEnergy || 0;
        return e2 < e1 ? f : min;
    }, vertexFaces[0] || { name: 'Unknown', energy: 0 });

    const weakestEnergy = (weakestFace.energy || weakestFace.faceEnergy || 0) * 100;
    const vertexStrength = ((leverageVertex.vortexStrength || 0) * 100).toFixed(0);
    const connectedEdges = vertices.length > 0 ? vertexFaceIds.length : 0;
    const estimatedLift = Math.min(15, Math.round((100 - weakestEnergy) * 0.3));

    const isBermuda = leverageVertex.classification === 'bermuda_triangle';
    const vertexTitle = isBermuda
        ? `⚠️ Bermuda Triangle: ${leverageVertex.emergentName || 'Critical Vertex'}`
        : `🎯 ${leverageVertex.emergentName || 'Key Convergence Point'}`;

    content.innerHTML = `
        <div class="leverage-vertex-name">${vertexTitle}</div>
        <div class="leverage-target-face">
            <span class="face-icon">${isBermuda ? '🔥' : '⚡'}</span>
            <div class="face-details">
                <div class="face-name">Focus: ${weakestFace.name || `Face ${weakestFace.id}`}</div>
                <div class="face-energy">Currently at ${weakestEnergy.toFixed(0)}% energy</div>
            </div>
        </div>
        <div class="leverage-impact">
            <div class="leverage-impact-item">
                <div class="value">${connectedEdges}</div>
                <div class="label">Connected Faces</div>
            </div>
            <div class="leverage-impact-item">
                <div class="value">${vertexStrength}%</div>
                <div class="label">Vortex Strength</div>
            </div>
            <div class="leverage-impact-item">
                <div class="value">+${estimatedLift}%</div>
                <div class="label">Est. Coherence Lift</div>
            </div>
        </div>
        <div class="leverage-insight">
            ${isBermuda
                ? 'This vertex represents a critical imbalance where energy is being lost. Strengthening the weakest converging face will begin to restore harmonic flow.'
                : 'This convergence point has the highest transformation potential. Improving the target face will cascade positive effects through connected edges.'}
        </div>
    `;

    panel.style.display = 'block';
}

/**
 * Launch visualization view with custom data
 */
function launchView(viewName) {
    const viewUrls = {
        'dodecahedron': 'dodecahedron-3d.html',
        'calculations': 'calculations.html',
        'breath': 'breath-analysis.html',
        'dna': 'octave-dna.html',
        'simulator': 'simulator.html'
    };

    // 🔧 Always update sessionStorage before launching (ensure fresh data)
    updateSessionStorage();

    const url = viewUrls[viewName];
    if (url) {
        window.open(url, '_blank');
        console.log(`🚀 Launched view: ${viewName}`);
    }
}

/**
 * Export report
 */
function exportReport() {
    alert('PDF export feature coming soon!\n\nFor now, you can:\n• Screenshot the visualizations\n• Save the configuration JSON\n• Copy the coherence data');
}

function saveConfiguration() {
    const fullConfig = {
        faceConfig: demoState.faceConfig,
        kpiMode: demoState.kpiMode,
        kpiData: demoState.kpiData,
        coherenceResults: demoState.coherenceResults,
        timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(fullConfig, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `quannex-demo-${Date.now()}.json`;
    a.click();

    URL.revokeObjectURL(url);
    console.log('✅ Configuration saved');
}

/**
 * Start over
 */
function startOver() {
    if (confirm('Start a new analysis? This will clear all current data.')) {
        location.reload();
    }
}

/**
 * Show help
 */
function showHelp() {
    window.open('DEMO_GUIDE.md', '_blank');
}

/**
 * Show loading overlay
 */
function showLoading(message = 'Processing...') {
    document.getElementById('loadingText').textContent = message;
    document.getElementById('loadingOverlay').classList.add('active');
}

/**
 * Hide loading overlay
 */
function hideLoading() {
    document.getElementById('loadingOverlay').classList.remove('active');
}

// Expose to window
window.goToStep = goToStep;
window.completeStep1 = completeStep1;
window.selectMode = selectMode;
window.completeStep2 = completeStep2;
window.completeStep3 = completeStep3;
window.launchView = launchView;
window.exportReport = exportReport;
window.saveConfiguration = saveConfiguration;
window.startOver = startOver;
window.showHelp = showHelp;
window.autofillKPISuggestion = autofillKPISuggestion;
window.autofillElementalKPI = autofillElementalKPI;
window.calculateLiveNormalization = calculateLiveNormalization;
// Sprint 2: Validation gate modal functions
window.showValidationBlockDialog = showValidationBlockDialog;
window.closeValidationModal = closeValidationModal;
window.applyDefaultsAndProceed = applyDefaultsAndProceed;
window.focusOnIncompleteFace = focusOnIncompleteFace;
// Sprint 3: Company template selection
window.selectCompanyTemplate = selectCompanyTemplate;
window.startFreshManual = startFreshManual;
window.startFreshAI = startFreshAI;

// Initialize on load
document.addEventListener('DOMContentLoaded', initializeDemo);

console.log('✅ Demo Orchestrator Logic loaded');
