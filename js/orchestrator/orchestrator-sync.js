/**
 * ========================================
 * MODULE: orchestrator-sync.js
 * ========================================
 *
 * Extracted from: demo-orchestrator-logic.js
 * Original lines: 155-300
 * Date: December 15, 2025
 *
 * PURPOSE:
 * Cross-window synchronization for the Demo Orchestrator.
 * Uses BroadcastChannel API to sync state between multiple windows/tabs.
 * When user modifies data in orchestrator, all open visualization views
 * (3D model, DNA helix, etc.) receive updates in real-time.
 *
 * DEPENDENCIES:
 * - SessionManager (for cleanup on beforeunload)
 * - demoState (for broadcasting current state)
 *
 * EXPORTS (to window/global):
 * - CrossWindowSync: Cross-window synchronization object
 *
 * ========================================
 */
(function (global) {
    'use strict';

    // ========================================
    // CROSS-WINDOW SYNCHRONIZATION
    // ========================================

    /**
     * Cross-Window Synchronization (Issue #12 Fix)
     *
     * Uses BroadcastChannel API to sync state between multiple windows/tabs.
     * When user modifies data in orchestrator, all open visualization views
     * (3D model, DNA helix, etc.) receive updates in real-time.
     *
     * Channel: 'quannex-sync'
     * Messages: { type: string, payload: any, timestamp: number }
     *
     * @namespace CrossWindowSync
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
                Logger.warn('CrossWindowSync', 'BroadcastChannel not supported in this browser');
                return false;
            }

            try {
                this._channel = new BroadcastChannel(this.CHANNEL_NAME);
                this._channel.onmessage = (event) => this._handleMessage(event.data);
                Logger.info('CrossWindowSync', `Channel initialized: ${this.CHANNEL_NAME}`);
                return true;
            } catch (e) {
                Logger.error('CrossWindowSync', 'Failed to create channel', e);
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
                source: global.location ? global.location.pathname : 'unknown'
            };

            try {
                this._channel.postMessage(message);
                Logger.debug('CrossWindowSync', `Broadcast: ${type}`, payload);
            } catch (e) {
                Logger.error('CrossWindowSync', 'Broadcast failed', e);
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
            const sourcePath = global.location ? global.location.pathname : '';
            Logger.debug('CrossWindowSync', `Received: ${message.type} from ${message.source}`);

            // Skip messages from self
            if (message.source === sourcePath) {
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
            // Access demoState from global scope (loaded from orchestrator-state.js)
            const demoState = global.demoState;
            if (!demoState) {
                Logger.warn('CrossWindowSync', 'demoState not available for broadcast');
                return;
            }

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
            const sourcePath = global.location ? global.location.pathname : 'unknown';
            this.broadcast('STATE_REQUEST', { requester: sourcePath });
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

    // ========================================
    // INITIALIZATION
    // ========================================

    // Initialize sync channel
    CrossWindowSync.init();

    // Listen for state requests (orchestrator responds to views asking for data)
    CrossWindowSync.on('STATE_REQUEST', (payload) => {
        Logger.info('CrossWindowSync', 'State requested by:', payload.requester);
        // Only orchestrator should respond
        const currentPath = global.location ? global.location.pathname : '';
        if (currentPath.includes('demo-orchestrator')) {
            CrossWindowSync.broadcastCurrentState();
        }
    });

    // Clean up on page unload
    global.addEventListener('beforeunload', () => {
        // Check if SessionManager is available (loaded from orchestrator-session.js)
        if (global.SessionManager && typeof global.SessionManager.stop === 'function') {
            global.SessionManager.stop();
        }
        CrossWindowSync.close();
    });

    // ========================================
    // EXPORTS
    // ========================================

    global.CrossWindowSync = CrossWindowSync;

    Logger.info('CrossWindowSync', 'Module loaded');

})(typeof window !== 'undefined' ? window : this);
