/**
 * ========================================
 * MODULE: sim-sync.js
 * ========================================
 *
 * Created for: Coherence Simulator modularization
 * Date: February 2026
 *
 * PURPOSE:
 * Cross-window synchronization via BroadcastChannel API.
 * When slider values change, broadcasts state to other open windows
 * (primarily the 3D dodecahedron visualization) for live feedback.
 *
 * DEPENDENCIES:
 * - sim-state.js (SimState, SimStateHelpers)
 *
 * EXPORTS (to window/global):
 * - SimSync: { init, broadcast, toggle, destroy }
 *
 * NOTES FOR FUTURE CLAUDE:
 * ========================================
 * CHANNEL PROTOCOL:
 * Uses channel name 'quannex-sync' (same as orchestrator-sync.js).
 * The dodecahedron-3d.html page already listens for STATE_UPDATE
 * messages on this channel and calls refreshVisualization().
 *
 * MESSAGE FORMAT:
 * {
 *   type: 'STATE_UPDATE',           // matches dodec page expectations
 *   payload: {
 *     faces: [...12 objects],       // { faceId, name, energy, faceEnergy }
 *     globalCoherence: 0.73,        // from engine or mock calculation
 *     companyId: 'nova-tech'        // for multi-company routing
 *   },
 *   timestamp: Date.now(),
 *   source: 'simulator'             // distinguishes from orchestrator
 * }
 *
 * WHY BROADCASTCHANNEL (not WebSocket/socket.io):
 * BroadcastChannel is same-origin, zero-config, no server needed.
 * Perfect for our use case: tabs on the same machine sharing state.
 * Supported in all modern browsers (Chrome 54+, Firefox 38+, Edge 79+).
 * Safari 15.4+ also supports it. No polyfill needed for our target.
 *
 * SESSIONSTORAGE FALLBACK:
 * Also writes to sessionStorage key 'customCompanyData' as fallback.
 * This covers environments where BroadcastChannel might be blocked
 * (some enterprise proxies, very old browsers). The dodec page checks
 * sessionStorage on focus/visibility change events.
 *
 * ECHO PREVENTION:
 * Simulator ONLY broadcasts, never consumes its own messages.
 * The source: 'simulator' field lets receivers filter if needed.
 * Multiple simulator tabs won't echo because none listens on the channel.
 *
 * LIFECYCLE:
 * Channel is created in init(), closed in destroy() (called on
 * beforeunload). The toggle() method enables/disables broadcasting
 * without closing the channel. Default: S.syncEnabled = true.
 * ========================================
 */
(function (global) {
    'use strict';

    const S = global.SimState;
    const CHANNEL_NAME = 'quannex-sync';

    const SimSync = {

        /**
         * Initialize BroadcastChannel for cross-window sync.
         * @returns {boolean} true if channel created successfully
         */
        init() {
            if (typeof BroadcastChannel === 'undefined') {
                Logger.warn('SimSync', 'BroadcastChannel not supported - using sessionStorage fallback only');
                S.syncEnabled = false;
                return false;
            }

            try {
                S.broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
                Logger.info('SimSync', `Channel initialized: ${CHANNEL_NAME}`);

                // Clean up on page unload
                global.addEventListener('beforeunload', () => {
                    this.destroy();
                });

                return true;
            } catch (e) {
                Logger.error('SimSync', 'Failed to create channel:', e);
                S.syncEnabled = false;
                return false;
            }
        },

        /**
         * Broadcast current state to other windows.
         * Called after each engine recalculation.
         */
        broadcast() {
            if (!S.syncEnabled) return;

            // Build face data for broadcast
            const faces = S.FACE_DEFINITIONS.map(def => ({
                faceId: def.faceId,
                name: def.name,
                energy: SimStateHelpers.sliderToEnergy(S.sliderValues[def.arrayIndex]),
                faceEnergy: SimStateHelpers.sliderToEnergy(S.sliderValues[def.arrayIndex])
            }));

            const message = {
                type: 'STATE_UPDATE',
                payload: {
                    faces: faces,
                    globalCoherence: _getCurrentCoherence(),
                    companyId: S.currentCompanyId
                },
                timestamp: Date.now(),
                source: 'simulator'
            };

            // BroadcastChannel
            if (S.broadcastChannel) {
                try {
                    S.broadcastChannel.postMessage(message);
                } catch (e) {
                    Logger.warn('SimSync', 'Broadcast failed:', e);
                }
            }

            // SessionStorage fallback
            try {
                sessionStorage.setItem('customCompanyData', JSON.stringify({
                    faces: faces,
                    coherence: _getCurrentCoherence(),
                    companyId: S.currentCompanyId,
                    timestamp: Date.now()
                }));
            } catch (e) {
                // sessionStorage may be full or blocked
            }
        },

        /**
         * Toggle sync on/off.
         * @returns {boolean} New sync state
         */
        toggle() {
            S.syncEnabled = !S.syncEnabled;
            Logger.info('SimSync', `Sync ${S.syncEnabled ? 'enabled' : 'disabled'}`);
            return S.syncEnabled;
        },

        /**
         * Clean up BroadcastChannel.
         */
        destroy() {
            if (S.broadcastChannel) {
                S.broadcastChannel.close();
                S.broadcastChannel = null;
                Logger.info('SimSync', 'Channel closed');
            }
        }
    };

    // ========================================
    // PRIVATE
    // ========================================

    function _getCurrentCoherence() {
        if (!S.mockMode && global.Quannex?.getState) {
            try {
                const state = global.Quannex.getState();
                return state.globalCoherence || 0;
            } catch (e) {
                return S.baselineCoherence;
            }
        }
        // Mock: average of slider values
        return S.sliderValues.reduce((sum, v) => sum + v, 0) / 1200;
    }

    global.SimSync = SimSync;

    Logger.info('SimSync', 'Module loaded - Cross-window sync ready');

})(typeof window !== 'undefined' ? window : this);
