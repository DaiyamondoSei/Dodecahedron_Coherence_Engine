/**
 * ========================================
 * MODULE: orchestrator-session.js
 * ========================================
 *
 * Extracted from: demo-orchestrator-logic.js
 * Original lines: 142-426
 * Date: December 15, 2025
 *
 * PURPOSE:
 * Session expiry management for the Demo Orchestrator.
 * Prevents users from losing work by warning before session expiry
 * and allowing session extension.
 *
 * DEPENDENCIES:
 * - None (standalone module)
 *
 * EXPORTS (to window/global):
 * - SessionManager: Session expiry management object
 *
 * ========================================
 */
(function(global) {
    'use strict';

    // ========================================
    // SESSION MANAGER
    // ========================================

    /**
     * Session Expiry Manager
     *
     * Prevents users from losing work by:
     * 1. Warning at 25 minutes (5 min before expiry)
     * 2. Allowing session extension
     * 3. Graceful handling at 30 min expiry
     *
     * INTEGRITY FIX: Previously sessions expired silently.
     *
     * @namespace SessionManager
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
                        <div class="session-warning-icon">&#9200;</div>
                        <div class="session-warning-text">
                            <strong>Session Expiring Soon</strong>
                            <span class="session-time-remaining">${minutesRemaining} minutes remaining</span>
                        </div>
                        <button class="session-extend-btn" onclick="SessionManager.extendSession()">
                            Extend Session
                        </button>
                        <button class="session-dismiss-btn" onclick="SessionManager._hideNotification()">
                            &#10005;
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
            console.log(`[SessionManager] Session expiry warning shown (${minutesRemaining} min remaining)`);
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
                    console.log('[SessionManager] Session extended for another 30 minutes');

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
            console.log('[SessionManager] Session expired');

            // Show final notification
            if (this._notificationElement) {
                this._notificationElement.innerHTML = `
                    <div class="session-warning-content">
                        <div class="session-warning-icon">&#8987;</div>
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

    // ========================================
    // EXPORTS
    // ========================================

    global.SessionManager = SessionManager;

    console.log('[orchestrator-session] Module loaded');

})(typeof window !== 'undefined' ? window : this);
