/**
 * ============================================================================
 * QUANNEX ERROR RECOVERY UI
 * ============================================================================
 *
 * NOTES FOR FUTURE CLAUDE:
 * ============================================================================
 * This module provides graceful error handling with register-aware messaging.
 * It implements three UI patterns from ERROR_HANDLING.uiPatterns:
 *   - inline: Field errors (below input, red text)
 *   - toast: Warnings (uses toast notification system)
 *   - modal: Critical errors (circuit breaker triggered, data corruption)
 *
 * NAVIGATION MAP:
 *   -> IMPORTS FROM:
 *      - js/ux/ux-full-vision.js -> ERROR_HANDLING taxonomy
 *      - js/ux/toast-notifications.js -> Toast system
 *      - js/ux/language-register.js -> Register detection
 *
 *   -> CONSUMED BY:
 *      - js/main.js -> Circuit breaker integration
 *      - js/data-system/data-validator.js -> Validation errors
 *      - demo-orchestrator.html -> Form validation
 *
 * INTEGRATION POINTS:
 *   - Listens for 'quannex:calculation_blocked' from main.js circuit breaker
 *   - Dispatches 'quannex:toast' for warning-level errors
 *   - Shows modal for critical errors
 * ============================================================================
 *
 * @fileoverview Error recovery system with register-aware messaging
 * @author Deimantas Murauskas & Claude
 * @version 1.0.0
 */

(function(global) {
    'use strict';

    // ========================================================================
    // CONFIGURATION
    // ========================================================================

    const CONFIG = {
        // Retry settings for recoverable errors
        retry: {
            maxAttempts: 3,
            baseDelay: 1000,      // ms
            backoffMultiplier: 2  // Exponential backoff
        },

        // Modal settings
        modal: {
            zIndex: 10000,
            animationDuration: 200
        },

        // Inline error settings
        inline: {
            fadeInDuration: 200,
            clearOnFocus: true
        }
    };

    // ========================================================================
    // ERROR TAXONOMY (mirrors ux-full-vision.js)
    // ========================================================================

    const ERROR_MESSAGES = {
        recoverable: {
            networkTimeout: {
                analytical: 'Connection slow. Retrying...',
                balanced: 'Taking longer than expected. Hang tight...',
                contemplative: 'The connection is finding its way. Patience...'
            },
            validationError: {
                analytical: 'Invalid input. Please correct the highlighted field.',
                balanced: 'Something needs adjustment. Check the highlighted field.',
                contemplative: 'This field is asking for a different value...'
            },
            staleData: {
                analytical: 'Data was updated elsewhere. Refresh to see changes.',
                balanced: 'Changes were made elsewhere. Want to refresh?',
                contemplative: 'The data has shifted. Shall we sync with the new reality?'
            }
        },
        degraded: {
            partialLoadFailure: {
                analytical: 'Some features temporarily unavailable.',
                balanced: 'Some features are taking a break. Core analysis available.',
                contemplative: 'Some features are resting. The essence remains...'
            },
            aiUnavailable: {
                analytical: 'AI insights temporarily unavailable.',
                balanced: 'AI insights taking a break. Core analysis still available.',
                contemplative: 'The AI is resting. Your own insights remain available.'
            },
            calculationTimeout: {
                analytical: 'Calculation exceeded time limit. Consider simplifying.',
                balanced: 'This calculation is taking too long. Want to simplify?',
                contemplative: 'The calculation seeks more time than we can give...'
            }
        },
        critical: {
            dataCorruption: {
                analytical: 'Data integrity issue detected. Reloading...',
                balanced: 'We detected a data issue. Refreshing to fix...',
                contemplative: 'Something in the data needs healing. Refreshing...'
            },
            circuitBreakerTripped: {
                analytical: 'System halted due to data quality failure.',
                balanced: 'The system paused to protect your data.',
                contemplative: 'The system has paused to restore harmony...'
            },
            authenticationFailure: {
                analytical: 'Session expired. Please sign in again.',
                balanced: 'Your session ended. Let\'s get you signed back in.',
                contemplative: 'Your session has completed its cycle. Time to renew...'
            }
        }
    };

    // ========================================================================
    // STATE
    // ========================================================================

    let errorModal = null;
    let retryAttempts = new Map(); // Track retry attempts by errorId

    // ========================================================================
    // REGISTER DETECTION
    // ========================================================================

    /**
     * Get current language register
     * @returns {string} 'analytical', 'balanced', or 'contemplative'
     */
    function getRegister() {
        return global.LanguageRegister?.get?.() || 'balanced';
    }

    /**
     * Get error message for type and register
     * @param {string} level - 'recoverable', 'degraded', or 'critical'
     * @param {string} errorType - Specific error type
     * @param {string} [register] - Optional register override
     * @returns {string} Localized error message
     */
    function getErrorMessage(level, errorType, register) {
        register = register || getRegister();
        const messages = ERROR_MESSAGES[level]?.[errorType];
        if (messages) {
            return messages[register] || messages.balanced;
        }
        return 'An unexpected error occurred.';
    }

    // ========================================================================
    // INLINE ERRORS (Field-level)
    // ========================================================================

    /**
     * Show inline error below a field
     * @param {HTMLElement|string} field - Field element or selector
     * @param {string} message - Error message
     * @param {Object} [options] - Additional options
     */
    function showInlineError(field, message, options = {}) {
        const element = typeof field === 'string' ? document.querySelector(field) : field;
        if (!element) {
            console.warn('[ErrorRecovery] Field not found:', field);
            return;
        }

        // Remove existing error
        clearInlineError(element);

        // Create error element
        const errorEl = document.createElement('div');
        errorEl.className = 'quannex-inline-error';
        errorEl.innerHTML = `<span class="error-icon">!</span> ${message}`;
        errorEl.style.cssText = `
            color: #ff4444;
            font-size: 11px;
            margin-top: 4px;
            padding: 4px 8px;
            background: rgba(255, 68, 68, 0.1);
            border-radius: 4px;
            display: flex;
            align-items: center;
            gap: 6px;
            opacity: 0;
            transition: opacity ${CONFIG.inline.fadeInDuration}ms ease;
        `;

        // Add error icon styling
        const iconSpan = errorEl.querySelector('.error-icon');
        if (iconSpan) {
            iconSpan.style.cssText = `
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 14px;
                height: 14px;
                background: #ff4444;
                color: white;
                border-radius: 50%;
                font-size: 10px;
                font-weight: bold;
            `;
        }

        // Mark field as having error
        element.dataset.hasError = 'true';
        element.style.borderColor = '#ff4444';

        // Insert after field
        element.parentNode.insertBefore(errorEl, element.nextSibling);

        // Animate in
        requestAnimationFrame(() => {
            errorEl.style.opacity = '1';
        });

        // Clear on focus if configured
        if (CONFIG.inline.clearOnFocus) {
            const clearHandler = () => {
                clearInlineError(element);
                element.removeEventListener('focus', clearHandler);
            };
            element.addEventListener('focus', clearHandler);
        }
    }

    /**
     * Clear inline error from a field
     * @param {HTMLElement|string} field - Field element or selector
     */
    function clearInlineError(field) {
        const element = typeof field === 'string' ? document.querySelector(field) : field;
        if (!element) return;

        const errorEl = element.nextElementSibling;
        if (errorEl && errorEl.classList.contains('quannex-inline-error')) {
            errorEl.remove();
        }

        element.dataset.hasError = 'false';
        element.style.borderColor = '';
    }

    /**
     * Clear all inline errors
     */
    function clearAllInlineErrors() {
        document.querySelectorAll('.quannex-inline-error').forEach(el => el.remove());
        document.querySelectorAll('[data-has-error="true"]').forEach(el => {
            el.dataset.hasError = 'false';
            el.style.borderColor = '';
        });
    }

    // ========================================================================
    // TOAST ERRORS (Warning-level)
    // ========================================================================

    /**
     * Show error as toast notification
     * @param {string} message - Error message
     * @param {string} [type='error'] - Toast type
     */
    function showToastError(message, type = 'error') {
        if (global.QuannexToast) {
            global.QuannexToast.show(message, type);
        } else {
            // Fallback to event
            global.dispatchEvent(new CustomEvent('quannex:toast', {
                detail: { message, type }
            }));
        }
    }

    // ========================================================================
    // MODAL ERRORS (Critical)
    // ========================================================================

    /**
     * Create error modal DOM if needed
     */
    function ensureModal() {
        if (errorModal) return;

        errorModal = document.createElement('div');
        errorModal.id = 'quannex-error-modal';
        errorModal.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-content">
                <div class="modal-icon"></div>
                <h2 class="modal-title"></h2>
                <p class="modal-message"></p>
                <div class="modal-actions"></div>
            </div>
        `;

        const style = document.createElement('style');
        style.textContent = `
            #quannex-error-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: ${CONFIG.modal.zIndex};
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            #quannex-error-modal.visible {
                display: flex;
                align-items: center;
                justify-content: center;
            }
            #quannex-error-modal .modal-backdrop {
                position: absolute;
                inset: 0;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(4px);
            }
            #quannex-error-modal .modal-content {
                position: relative;
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                padding: 32px;
                border-radius: 16px;
                max-width: 480px;
                width: 90%;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                border: 1px solid rgba(255, 255, 255, 0.1);
                text-align: center;
                animation: modalFadeIn ${CONFIG.modal.animationDuration}ms ease;
            }
            @keyframes modalFadeIn {
                from { opacity: 0; transform: scale(0.95) translateY(-10px); }
                to { opacity: 1; transform: scale(1) translateY(0); }
            }
            #quannex-error-modal .modal-icon {
                width: 64px;
                height: 64px;
                margin: 0 auto 20px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 32px;
            }
            #quannex-error-modal .modal-icon.critical {
                background: rgba(255, 68, 68, 0.2);
                border: 2px solid #ff4444;
            }
            #quannex-error-modal .modal-icon.warning {
                background: rgba(255, 170, 0, 0.2);
                border: 2px solid #ffaa00;
            }
            #quannex-error-modal .modal-title {
                color: #fff;
                margin: 0 0 12px;
                font-size: 20px;
                font-weight: 600;
            }
            #quannex-error-modal .modal-message {
                color: rgba(255, 255, 255, 0.8);
                margin: 0 0 24px;
                font-size: 14px;
                line-height: 1.6;
            }
            #quannex-error-modal .modal-actions {
                display: flex;
                gap: 12px;
                justify-content: center;
            }
            #quannex-error-modal button {
                padding: 10px 24px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                border: none;
            }
            #quannex-error-modal button.primary {
                background: linear-gradient(135deg, #00ffcc, #00cc99);
                color: #1a1a2e;
            }
            #quannex-error-modal button.primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 255, 204, 0.3);
            }
            #quannex-error-modal button.secondary {
                background: rgba(255, 255, 255, 0.1);
                color: #fff;
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            #quannex-error-modal button.secondary:hover {
                background: rgba(255, 255, 255, 0.15);
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(errorModal);
    }

    /**
     * Show error modal
     * @param {Object} options - Modal options
     * @param {string} options.title - Modal title
     * @param {string} options.message - Modal message
     * @param {string} [options.type='critical'] - 'critical' or 'warning'
     * @param {Array} [options.actions] - Array of action buttons
     */
    function showErrorModal(options) {
        ensureModal();

        const {
            title,
            message,
            type = 'critical',
            actions = [{ label: 'Refresh Page', primary: true, action: () => location.reload() }]
        } = options;

        const iconEl = errorModal.querySelector('.modal-icon');
        const titleEl = errorModal.querySelector('.modal-title');
        const messageEl = errorModal.querySelector('.modal-message');
        const actionsEl = errorModal.querySelector('.modal-actions');

        // Set icon
        iconEl.className = `modal-icon ${type}`;
        iconEl.textContent = type === 'critical' ? '!' : '?';

        // Set content
        titleEl.textContent = title;
        messageEl.textContent = message;

        // Build actions
        actionsEl.innerHTML = '';
        actions.forEach(({ label, primary, action }) => {
            const btn = document.createElement('button');
            btn.className = primary ? 'primary' : 'secondary';
            btn.textContent = label;
            btn.onclick = () => {
                hideErrorModal();
                if (action) action();
            };
            actionsEl.appendChild(btn);
        });

        // Show modal
        errorModal.classList.add('visible');

        // Block background scrolling
        document.body.style.overflow = 'hidden';
    }

    /**
     * Hide error modal
     */
    function hideErrorModal() {
        if (errorModal) {
            errorModal.classList.remove('visible');
            document.body.style.overflow = '';
        }
    }

    // ========================================================================
    // AUTO-RETRY SYSTEM
    // ========================================================================

    /**
     * Execute with auto-retry for recoverable errors
     * @param {string} errorId - Unique identifier for this operation
     * @param {Function} operation - Async function to retry
     * @param {Object} [options] - Retry options
     * @returns {Promise} Result of successful operation
     */
    async function withRetry(errorId, operation, options = {}) {
        const maxAttempts = options.maxAttempts || CONFIG.retry.maxAttempts;
        const baseDelay = options.baseDelay || CONFIG.retry.baseDelay;

        let attempts = retryAttempts.get(errorId) || 0;

        while (attempts < maxAttempts) {
            try {
                const result = await operation();
                retryAttempts.delete(errorId);
                return result;
            } catch (error) {
                attempts++;
                retryAttempts.set(errorId, attempts);

                if (attempts < maxAttempts) {
                    const delay = baseDelay * Math.pow(CONFIG.retry.backoffMultiplier, attempts - 1);
                    const register = getRegister();

                    showToastError(
                        getErrorMessage('recoverable', 'networkTimeout', register),
                        'warning'
                    );

                    await new Promise(resolve => setTimeout(resolve, delay));
                } else {
                    retryAttempts.delete(errorId);
                    throw error;
                }
            }
        }
    }

    // ========================================================================
    // CIRCUIT BREAKER INTEGRATION
    // ========================================================================

    /**
     * Handle circuit breaker trip event
     * @param {CustomEvent} event - The calculation_blocked event
     */
    function handleCircuitBreakerTrip(event) {
        const { qualityScore, recommendation, criticalIssues } = event.detail || {};
        const register = getRegister();

        const title = register === 'contemplative'
            ? 'The System Has Paused'
            : register === 'analytical'
                ? 'Circuit Breaker Activated'
                : 'System Paused';

        const message = getErrorMessage('critical', 'circuitBreakerTripped', register);
        const details = recommendation || `Data quality: ${((qualityScore || 0) * 100).toFixed(0)}%`;

        showErrorModal({
            title,
            message: `${message}\n\n${details}`,
            type: 'critical',
            actions: [
                {
                    label: 'Refresh Data',
                    primary: true,
                    action: () => location.reload()
                },
                {
                    label: 'View Details',
                    primary: false,
                    action: () => {
                        console.log('[ErrorRecovery] Circuit breaker details:', event.detail);
                        showToastError(`Critical issues: ${criticalIssues}`, 'info');
                    }
                }
            ]
        });
    }

    // ========================================================================
    // UNIFIED ERROR HANDLER
    // ========================================================================

    /**
     * Handle any error with appropriate UI pattern
     * @param {Object} errorConfig - Error configuration
     * @param {string} errorConfig.level - 'recoverable', 'degraded', or 'critical'
     * @param {string} errorConfig.type - Specific error type
     * @param {string} [errorConfig.field] - Field selector for inline errors
     * @param {string} [errorConfig.customMessage] - Override default message
     * @param {Object} [errorConfig.retryAction] - Retry configuration
     */
    function handleError(errorConfig) {
        const { level, type, field, customMessage, retryAction } = errorConfig;
        const register = getRegister();
        const message = customMessage || getErrorMessage(level, type, register);

        switch (level) {
            case 'recoverable':
                if (field) {
                    showInlineError(field, message);
                } else {
                    showToastError(message, 'warning');
                }
                break;

            case 'degraded':
                showToastError(message, 'warning');
                break;

            case 'critical':
                showErrorModal({
                    title: 'Error',
                    message,
                    type: 'critical'
                });
                break;

            default:
                showToastError(message, 'error');
        }

        // Log for debugging
        console.warn(`[ErrorRecovery] ${level}/${type}:`, message);
    }

    // ========================================================================
    // INITIALIZATION
    // ========================================================================

    function init() {
        // Listen for circuit breaker events
        global.addEventListener('quannex:calculation_blocked', handleCircuitBreakerTrip);

        // Listen for generic error events
        global.addEventListener('quannex:error', (event) => {
            handleError(event.detail);
        });

        console.log('[Quannex] Error Recovery UI initialized');
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

    const QuannexErrorRecovery = {
        // Inline errors
        showInlineError,
        clearInlineError,
        clearAllInlineErrors,

        // Toast errors
        showToastError,

        // Modal errors
        showErrorModal,
        hideErrorModal,

        // Retry system
        withRetry,

        // Unified handler
        handleError,

        // Message helpers
        getErrorMessage,

        // Configuration
        CONFIG
    };

    // Browser export
    global.QuannexErrorRecovery = QuannexErrorRecovery;

    // CommonJS export
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = QuannexErrorRecovery;
    }

})(typeof window !== 'undefined' ? window : this);
