/**
 * ════════════════════════════════════════════════════════════════════════════
 * QUANNEX TOAST NOTIFICATION SYSTEM
 * ════════════════════════════════════════════════════════════════════════════
 *
 * NOTES FOR FUTURE CLAUDE:
 * ═══════════════════════════════════════════════════════════════════════════
 * This module provides a global, register-aware toast notification system.
 * It's the foundation for all user feedback in Quannex.
 *
 * KEY INSIGHT: Toasts are the voice of the system. In analytical mode,
 * they're brief and factual. In contemplative mode, they breathe.
 *
 * NAVIGATION MAP:
 *   ↑ IMPORTS FROM:
 *     • js/ux/language-register.js → Register detection
 *     • js/ux/ux-full-vision.js → ERROR_HANDLING.uiPatterns.toast specs
 *
 *   → CONSUMED BY:
 *     • All pages - via quannex:toast event
 *     • js/ux/error-recovery.js → Uses for warning/error toasts
 *     • js/ux/export-manager.js → Uses for success feedback
 *
 * SPECS (from ux-full-vision.js):
 *   position: 'Bottom-right'
 *   duration: { success: 3000, warning: 5000, error: 8000 }
 *   maxVisible: 3
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * @fileoverview Global toast notification system
 * @author Deimantas Murauskas & Claude
 * @version 1.0.0
 */

(function(global) {
    'use strict';

    // ════════════════════════════════════════════════════════════════════════
    // CONFIGURATION
    // ════════════════════════════════════════════════════════════════════════

    const CONFIG = {
        maxVisible: 3,
        position: 'bottom-right',
        durations: {
            success: 3000,
            warning: 5000,
            error: 8000,
            info: 4000
        },
        icons: {
            success: '✓',
            warning: '⚠',
            error: '✕',
            info: 'ℹ'
        },
        animationDuration: 300
    };

    // ════════════════════════════════════════════════════════════════════════
    // STATE
    // ════════════════════════════════════════════════════════════════════════

    let container = null;
    const activeToasts = [];

    // ════════════════════════════════════════════════════════════════════════
    // REGISTER-AWARE MESSAGES
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Get register-appropriate message wrapper
     * @param {string} message - Base message
     * @param {string} type - Toast type (success, warning, error, info)
     * @returns {string} Register-transformed message
     */
    function getRegisterMessage(message, type) {
        const register = global.LanguageRegister?.get?.() || 'balanced';

        // For analytical, keep it brief
        if (register === 'analytical') {
            return message;
        }

        // For contemplative, add breath
        if (register === 'contemplative') {
            const suffixes = {
                success: ' ✨',
                warning: ' — pause and notice.',
                error: ' — what is asking for attention?',
                info: ''
            };
            return message + (suffixes[type] || '');
        }

        // Balanced - as-is
        return message;
    }

    // ════════════════════════════════════════════════════════════════════════
    // CONTAINER MANAGEMENT
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Create or get the toast container
     * @returns {HTMLElement}
     */
    function getContainer() {
        if (container && document.body.contains(container)) {
            return container;
        }

        container = document.createElement('div');
        container.id = 'quannex-toast-container';
        container.className = `toast-container toast-${CONFIG.position}`;
        document.body.appendChild(container);

        return container;
    }

    // ════════════════════════════════════════════════════════════════════════
    // TOAST CREATION
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Create a toast element
     * @param {string} message - Toast message
     * @param {string} type - Toast type
     * @param {Object} options - Additional options
     * @returns {HTMLElement}
     */
    function createToastElement(message, type, options = {}) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        const icon = options.icon || CONFIG.icons[type] || CONFIG.icons.info;
        const displayMessage = getRegisterMessage(message, type);

        toast.innerHTML = `
            <div class="toast-icon">${icon}</div>
            <div class="toast-content">
                <div class="toast-message">${displayMessage}</div>
                ${options.detail ? `<div class="toast-detail">${options.detail}</div>` : ''}
            </div>
            <button class="toast-close" aria-label="Dismiss">×</button>
            <div class="toast-progress"></div>
        `;

        // Add close handler
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => dismiss(toast));

        return toast;
    }

    // ════════════════════════════════════════════════════════════════════════
    // SHOW / DISMISS
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Show a toast notification
     * @param {string} message - Toast message
     * @param {string} type - Toast type (success, warning, error, info)
     * @param {Object} options - Additional options
     * @returns {HTMLElement} The toast element
     */
    function show(message, type = 'info', options = {}) {
        const containerEl = getContainer();

        // Enforce max visible limit
        while (activeToasts.length >= CONFIG.maxVisible) {
            dismiss(activeToasts[0]);
        }

        const toast = createToastElement(message, type, options);
        containerEl.appendChild(toast);
        activeToasts.push(toast);

        // Trigger entrance animation
        requestAnimationFrame(() => {
            toast.classList.add('toast-visible');
        });

        // Start progress bar animation
        const duration = options.duration || CONFIG.durations[type] || CONFIG.durations.info;
        const progress = toast.querySelector('.toast-progress');
        progress.style.animationDuration = `${duration}ms`;

        // Auto-dismiss
        toast._dismissTimeout = setTimeout(() => {
            dismiss(toast);
        }, duration);

        // Log for debugging
        console.log(`[Toast] ${type.toUpperCase()}: ${message}`);

        return toast;
    }

    /**
     * Dismiss a toast
     * @param {HTMLElement} toast - Toast element to dismiss
     */
    function dismiss(toast) {
        if (!toast || !toast.parentNode) return;

        // Clear timeout
        if (toast._dismissTimeout) {
            clearTimeout(toast._dismissTimeout);
        }

        // Remove from active list
        const index = activeToasts.indexOf(toast);
        if (index > -1) {
            activeToasts.splice(index, 1);
        }

        // Animate out
        toast.classList.remove('toast-visible');
        toast.classList.add('toast-exiting');

        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, CONFIG.animationDuration);
    }

    /**
     * Dismiss all toasts
     */
    function dismissAll() {
        [...activeToasts].forEach(dismiss);
    }

    // ════════════════════════════════════════════════════════════════════════
    // CONVENIENCE METHODS
    // ════════════════════════════════════════════════════════════════════════

    const success = (message, options) => show(message, 'success', options);
    const warning = (message, options) => show(message, 'warning', options);
    const error = (message, options) => show(message, 'error', options);
    const info = (message, options) => show(message, 'info', options);

    // ════════════════════════════════════════════════════════════════════════
    // EVENT LISTENER
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Listen for quannex:toast events
     */
    function initEventListener() {
        global.addEventListener('quannex:toast', (event) => {
            const { message, type, ...options } = event.detail || {};
            if (message) {
                show(message, type, options);
            }
        });
    }

    // ════════════════════════════════════════════════════════════════════════
    // CSS INJECTION
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Inject toast styles if CSS file not loaded
     */
    function injectStyles() {
        if (document.getElementById('quannex-toast-styles')) return;

        const style = document.createElement('style');
        style.id = 'quannex-toast-styles';
        style.textContent = `
            .toast-container {
                position: fixed;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 8px;
                pointer-events: none;
            }
            .toast-container.toast-bottom-right {
                bottom: 20px;
                right: 20px;
            }
            .toast {
                display: flex;
                align-items: flex-start;
                gap: 12px;
                padding: 12px 16px;
                background: rgba(30, 30, 40, 0.95);
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                color: #fff;
                font-size: 14px;
                max-width: 380px;
                min-width: 280px;
                pointer-events: all;
                transform: translateX(120%);
                opacity: 0;
                transition: transform 0.3s ease, opacity 0.3s ease;
                position: relative;
                overflow: hidden;
            }
            .toast-visible {
                transform: translateX(0);
                opacity: 1;
            }
            .toast-exiting {
                transform: translateX(120%);
                opacity: 0;
            }
            .toast-icon {
                font-size: 18px;
                line-height: 1;
                flex-shrink: 0;
            }
            .toast-content {
                flex: 1;
                min-width: 0;
            }
            .toast-message {
                line-height: 1.4;
            }
            .toast-detail {
                font-size: 12px;
                opacity: 0.7;
                margin-top: 4px;
            }
            .toast-close {
                background: none;
                border: none;
                color: rgba(255, 255, 255, 0.5);
                cursor: pointer;
                font-size: 18px;
                padding: 0;
                line-height: 1;
                transition: color 0.2s;
            }
            .toast-close:hover {
                color: #fff;
            }
            .toast-progress {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                background: currentColor;
                opacity: 0.3;
                animation: toast-progress linear forwards;
            }
            @keyframes toast-progress {
                from { width: 100%; }
                to { width: 0%; }
            }
            /* Type colors */
            .toast-success {
                border-left: 4px solid #00ff88;
            }
            .toast-success .toast-icon { color: #00ff88; }
            .toast-warning {
                border-left: 4px solid #ffaa00;
            }
            .toast-warning .toast-icon { color: #ffaa00; }
            .toast-error {
                border-left: 4px solid #ff4444;
            }
            .toast-error .toast-icon { color: #ff4444; }
            .toast-info {
                border-left: 4px solid #00ccff;
            }
            .toast-info .toast-icon { color: #00ccff; }
        `;
        document.head.appendChild(style);
    }

    // ════════════════════════════════════════════════════════════════════════
    // INITIALIZATION
    // ════════════════════════════════════════════════════════════════════════

    function init() {
        injectStyles();
        initEventListener();
        console.log('[Quannex] Toast Notification System initialized');
    }

    // Auto-init when DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ════════════════════════════════════════════════════════════════════════
    // EXPORTS
    // ════════════════════════════════════════════════════════════════════════

    const QuannexToast = {
        show,
        dismiss,
        dismissAll,
        success,
        warning,
        error,
        info,
        CONFIG
    };

    // Browser export
    global.QuannexToast = QuannexToast;

    // CommonJS export
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = QuannexToast;
    }

})(typeof window !== 'undefined' ? window : this);
