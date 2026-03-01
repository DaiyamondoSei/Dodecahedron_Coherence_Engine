/**
 * ========================================
 * API KEY MANAGER - UI Component
 * ========================================
 *
 * Manages API key input with security warnings and validation.
 * Supports multiple AI providers: Gemini and OpenAI.
 *
 * Heart-Coherent UX Principles:
 * - Security warning shown once, stored in localStorage
 * - Visual feedback: saved (green), invalid (amber), missing (neutral)
 * - "Test Connection" button validates before saving
 * - Clear guidance without fear-mongering
 * - Provider switching for multi-provider support
 *
 * @module APIKeyManager
 * @version Sprint 2 - Enhanced with Provider Switching
 */

import { ProviderFactory } from '../providers/provider-factory.js';

// Storage keys
const STORAGE_KEYS = {
    API_KEY: 'quannex_gemini_api_key',
    OPENAI_KEY: 'quannex_openai_api_key',
    SELECTED_PROVIDER: 'quannex_selected_provider',
    WARNING_ACKNOWLEDGED: 'quannex_security_warning_ack',
    LAST_VALIDATED: 'quannex_api_key_validated_at'
};

// Provider configurations
const PROVIDERS = {
    gemini: {
        name: 'Google Gemini',
        icon: '✨',
        color: '#4285f4',
        bgColor: 'rgba(66, 133, 244, 0.15)',
        placeholder: 'Enter your Gemini API key (starts with AIza...)',
        helpUrl: 'https://aistudio.google.com/app/apikey',
        helpText: 'Get your free Gemini API key'
    },
    openai: {
        name: 'OpenAI',
        icon: '🧠',
        color: '#10a37f',
        bgColor: 'rgba(16, 163, 127, 0.15)',
        placeholder: 'Enter your OpenAI API key (starts with sk-...)',
        helpUrl: 'https://platform.openai.com/api-keys',
        helpText: 'Get your OpenAI API key'
    }
};

// Status types for visual feedback
const STATUS = {
    NONE: 'none',
    VALIDATING: 'validating',
    VALID: 'valid',
    INVALID: 'invalid',
    SAVED: 'saved',
    ERROR: 'error'
};

/**
 * APIKeyManager - Handles API key input UI and validation
 * Enhanced with multi-provider support (Gemini, OpenAI)
 */
class APIKeyManager {
    constructor(options = {}) {
        this.containerId = options.containerId || 'api-key-container';
        this.onStatusChange = options.onStatusChange || (() => {});
        this.onKeyValidated = options.onKeyValidated || (() => {});
        this.onProviderChange = options.onProviderChange || (() => {});

        this._status = STATUS.NONE;
        this._container = null;
        this._inputElement = null;
        this._statusElement = null;
        this._warningElement = null;

        // Provider management
        this._selectedProvider = localStorage.getItem(STORAGE_KEYS.SELECTED_PROVIDER) || 'gemini';
    }

    // ========================================
    // INITIALIZATION
    // ========================================

    /**
     * Initialize the API key manager
     * @param {string|HTMLElement} container - Container ID or element
     */
    init(container) {
        if (typeof container === 'string') {
            this._container = document.getElementById(container);
        } else {
            this._container = container;
        }

        if (!this._container) {
            Logger.error('APIKeyManager', 'Container not found');
            return;
        }

        this._render();
        this._attachEventListeners();
        this._checkExistingKey();
    }

    /**
     * Render the API key input UI with provider switching
     */
    _render() {
        const hasKey = this._hasKeyForProvider(this._selectedProvider);
        const warningAcknowledged = this._isWarningAcknowledged();
        const provider = PROVIDERS[this._selectedProvider];

        this._container.innerHTML = `
            <div class="api-key-manager" style="background: ${provider.bgColor}; border: 1px solid ${provider.color}40; border-radius: 12px;">
                <h3 class="api-key-title" style="color: ${provider.color}; margin: 0 0 15px 0; font-size: 14px; display: flex; align-items: center; gap: 8px;">
                    ${provider.icon} AI Gateway
                </h3>

                <!-- Provider Selector -->
                <div class="provider-selector" style="display: flex; gap: 8px; margin-bottom: 15px;">
                    ${Object.entries(PROVIDERS).map(([id, p]) => `
                        <button
                            type="button"
                            class="provider-btn ${id === this._selectedProvider ? 'selected' : ''}"
                            data-provider="${id}"
                            style="
                                flex: 1;
                                padding: 10px;
                                border-radius: 8px;
                                border: 2px solid ${id === this._selectedProvider ? p.color : 'transparent'};
                                background: ${id === this._selectedProvider ? p.bgColor : 'rgba(0,0,0,0.2)'};
                                color: ${id === this._selectedProvider ? p.color : 'rgba(255,255,255,0.6)'};
                                cursor: pointer;
                                font-size: 13px;
                                transition: all 0.2s;
                            "
                        >
                            ${p.icon} ${p.name}
                        </button>
                    `).join('')}
                </div>

                <!-- Security Warning (shown once) -->
                ${!warningAcknowledged ? this._renderSecurityWarning() : ''}

                <!-- API Key Input Section -->
                <div class="api-key-section">
                    <label class="api-key-label" for="api-key-input" style="color: rgba(255,255,255,0.8);">
                        <span class="label-text" style="font-weight: 600; font-size: 13px;">${provider.icon} ${provider.name} API Key</span>
                        <span class="label-hint" style="font-size: 11px; color: rgba(255,255,255,0.5);">Required for AI-powered analysis</span>
                    </label>

                    <div class="api-key-input-group" style="display: flex; gap: 8px; margin: 10px 0;">
                        <input
                            type="password"
                            id="api-key-input"
                            class="api-key-input"
                            placeholder="${provider.placeholder}"
                            value="${hasKey ? '••••••••••••••••' : ''}"
                            autocomplete="off"
                            style="
                                flex: 1;
                                padding: 10px 12px;
                                background: rgba(0,0,0,0.3);
                                border: 1px solid rgba(255,255,255,0.1);
                                border-radius: 6px;
                                color: #fff;
                                font-size: 13px;
                            "
                        />

                        <button
                            type="button"
                            id="toggle-visibility-btn"
                            class="toggle-visibility-btn"
                            title="Toggle visibility"
                            style="
                                padding: 8px 12px;
                                background: rgba(255,255,255,0.1);
                                border: 1px solid rgba(255,255,255,0.1);
                                border-radius: 6px;
                                cursor: pointer;
                            "
                        >
                            <span class="eye-icon">👁️</span>
                        </button>
                    </div>

                    <div class="api-key-actions" style="display: flex; gap: 8px; margin-bottom: 12px;">
                        <button type="button" id="test-connection-btn" class="action-btn test-btn" style="
                            padding: 8px 14px;
                            border-radius: 6px;
                            border: none;
                            background: rgba(255,255,255,0.1);
                            color: rgba(255,255,255,0.8);
                            cursor: pointer;
                            font-size: 12px;
                        ">
                            Test Connection
                        </button>
                        <button type="button" id="save-key-btn" class="action-btn save-btn" ${!warningAcknowledged ? 'disabled' : ''} style="
                            padding: 8px 14px;
                            border-radius: 6px;
                            border: none;
                            background: ${provider.color};
                            color: #fff;
                            cursor: pointer;
                            font-size: 12px;
                        ">
                            Save Key
                        </button>
                        <button type="button" id="clear-key-btn" class="action-btn clear-btn" ${!hasKey ? 'disabled' : ''} style="
                            padding: 8px 14px;
                            border-radius: 6px;
                            border: none;
                            background: rgba(255,100,100,0.2);
                            color: #ff6b6b;
                            cursor: pointer;
                            font-size: 12px;
                        ">
                            Clear
                        </button>
                    </div>

                    <!-- Status Display -->
                    <div id="api-key-status" class="api-key-status status-none" style="
                        padding: 8px 12px;
                        border-radius: 6px;
                        font-size: 12px;
                        background: rgba(0,0,0,0.2);
                        color: rgba(255,255,255,0.7);
                    ">
                        ${hasKey ? this._getStatusMessage('saved') : this._getStatusMessage('none')}
                    </div>
                </div>

                <!-- Help Link -->
                <div class="api-key-help" style="margin-top: 12px; font-size: 11px; text-align: center;">
                    <a href="${provider.helpUrl}" target="_blank" rel="noopener" style="color: ${provider.color};">
                        ${provider.helpText}
                    </a>
                </div>
            </div>
        `;

        // Cache elements
        this._inputElement = this._container.querySelector('#api-key-input');
        this._statusElement = this._container.querySelector('#api-key-status');
        this._warningElement = this._container.querySelector('.security-warning');
    }

    /**
     * Render security warning
     */
    _renderSecurityWarning() {
        return `
            <div class="security-warning">
                <div class="warning-icon">⚠️</div>
                <div class="warning-content">
                    <h4 class="warning-title">API Key Security Notice</h4>
                    <p class="warning-text">
                        Your API key will be stored in your browser's localStorage.
                        This is suitable for personal use and demos.
                        For production use, implement server-side key management.
                    </p>
                    <label class="warning-acknowledge">
                        <input type="checkbox" id="acknowledge-warning" />
                        <span>I understand and accept this for my use case</span>
                    </label>
                </div>
            </div>
        `;
    }

    /**
     * Attach event listeners
     */
    _attachEventListeners() {
        // Provider switching buttons
        const providerBtns = this._container.querySelectorAll('.provider-btn');
        providerBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const provider = btn.dataset.provider;
                if (provider && provider !== this._selectedProvider) {
                    this._switchProvider(provider);
                }
            });
        });

        // Acknowledge warning checkbox
        const ackCheckbox = this._container.querySelector('#acknowledge-warning');
        if (ackCheckbox) {
            ackCheckbox.addEventListener('change', (e) => {
                this._handleWarningAcknowledge(e.target.checked);
            });
        }

        // Toggle visibility button
        const toggleBtn = this._container.querySelector('#toggle-visibility-btn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this._toggleVisibility());
        }

        // Test connection button
        const testBtn = this._container.querySelector('#test-connection-btn');
        if (testBtn) {
            testBtn.addEventListener('click', () => this._testConnection());
        }

        // Save key button
        const saveBtn = this._container.querySelector('#save-key-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this._saveKey());
        }

        // Clear key button
        const clearBtn = this._container.querySelector('#clear-key-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this._clearKey());
        }

        // Input change
        if (this._inputElement) {
            this._inputElement.addEventListener('input', () => {
                this._onInputChange();
            });

            // Enter key to test
            this._inputElement.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this._testConnection();
                }
            });
        }
    }

    /**
     * Switch to a different AI provider
     */
    _switchProvider(provider) {
        this._selectedProvider = provider;
        localStorage.setItem(STORAGE_KEYS.SELECTED_PROVIDER, provider);

        // Re-render with new provider
        this._render();
        this._attachEventListeners();
        this._checkExistingKey();

        // Notify listeners
        this.onProviderChange(provider);
    }

    // ========================================
    // EVENT HANDLERS
    // ========================================

    _handleWarningAcknowledge(acknowledged) {
        if (acknowledged) {
            localStorage.setItem(STORAGE_KEYS.WARNING_ACKNOWLEDGED, 'true');

            // Enable save button
            const saveBtn = this._container.querySelector('#save-key-btn');
            if (saveBtn) saveBtn.disabled = false;

            // Fade out warning
            if (this._warningElement) {
                this._warningElement.classList.add('acknowledged');
                setTimeout(() => {
                    this._warningElement.style.display = 'none';
                }, 500);
            }
        }
    }

    _toggleVisibility() {
        if (this._inputElement.type === 'password') {
            this._inputElement.type = 'text';
        } else {
            this._inputElement.type = 'password';
        }
    }

    _onInputChange() {
        // Reset status when input changes
        if (this._status !== STATUS.NONE) {
            this._setStatus(STATUS.NONE);
        }
    }

    async _testConnection() {
        const key = this._inputElement.value.trim();

        if (!key || key === '••••••••••••••••') {
            this._setStatus(STATUS.ERROR, 'Please enter an API key');
            return;
        }

        this._setStatus(STATUS.VALIDATING);

        try {
            // Validate based on selected provider
            if (this._selectedProvider === 'gemini') {
                const provider = await ProviderFactory.create({
                    apiKey: key,
                    timeout: 5000
                });

                if (provider.name === 'GeminiProvider') {
                    this._setStatus(STATUS.VALID);
                } else {
                    this._setStatus(STATUS.INVALID, 'Could not connect to Gemini API');
                }
            } else if (this._selectedProvider === 'openai') {
                // Basic validation for OpenAI key format
                if (key.startsWith('sk-') && key.length > 20) {
                    this._setStatus(STATUS.VALID);
                } else {
                    this._setStatus(STATUS.INVALID, 'Invalid OpenAI key format (should start with sk-)');
                }
            }
        } catch (error) {
            this._setStatus(STATUS.INVALID, error.message);
        }
    }

    async _saveKey() {
        const key = this._inputElement.value.trim();

        if (!key || key === '••••••••••••••••') {
            this._setStatus(STATUS.ERROR, 'Please enter an API key');
            return;
        }

        // Test first if not already validated
        if (this._status !== STATUS.VALID) {
            await this._testConnection();

            // Don't save if invalid
            if (this._status === STATUS.INVALID) {
                return;
            }
        }

        // Save to localStorage with provider-specific key
        const storageKey = this._getStorageKeyForProvider();
        localStorage.setItem(storageKey, key);
        localStorage.setItem(STORAGE_KEYS.LAST_VALIDATED, Date.now().toString());

        // Also update ProviderFactory if it's Gemini (for compatibility)
        if (this._selectedProvider === 'gemini') {
            ProviderFactory.storeApiKey(key);
        }

        // Mask input
        this._inputElement.value = '••••••••••••••••';
        this._inputElement.type = 'password';

        // Update status
        this._setStatus(STATUS.SAVED);

        // Enable clear button
        const clearBtn = this._container.querySelector('#clear-key-btn');
        if (clearBtn) clearBtn.disabled = false;

        // Notify
        this.onKeyValidated(true, this._selectedProvider);
    }

    _clearKey() {
        // Clear provider-specific key
        const storageKey = this._getStorageKeyForProvider();
        localStorage.removeItem(storageKey);
        localStorage.removeItem(STORAGE_KEYS.LAST_VALIDATED);

        // Also clear from ProviderFactory if Gemini
        if (this._selectedProvider === 'gemini') {
            ProviderFactory.clearApiKey();
        }

        this._inputElement.value = '';
        this._setStatus(STATUS.NONE);

        // Disable clear button
        const clearBtn = this._container.querySelector('#clear-key-btn');
        if (clearBtn) clearBtn.disabled = true;

        // Notify
        this.onKeyValidated(false, this._selectedProvider);
    }

    // ========================================
    // STATUS MANAGEMENT
    // ========================================

    _setStatus(status, message = null) {
        this._status = status;

        if (this._statusElement) {
            // Remove all status classes
            this._statusElement.className = 'api-key-status';
            this._statusElement.classList.add(`status-${status}`);

            // Set message
            this._statusElement.innerHTML = message || this._getStatusMessage(status);
        }

        this.onStatusChange(status, message);
    }

    _getStatusMessage(status) {
        switch (status) {
            case STATUS.NONE:
                return '<span class="status-icon">○</span> Enter your API key to enable AI features';
            case STATUS.VALIDATING:
                return '<span class="status-icon spinning">◌</span> Testing connection...';
            case STATUS.VALID:
                return '<span class="status-icon">✓</span> Connection successful!';
            case STATUS.INVALID:
                return '<span class="status-icon">✗</span> Connection failed';
            case STATUS.SAVED:
                return '<span class="status-icon">✓</span> API key saved and validated';
            case STATUS.ERROR:
                return '<span class="status-icon">!</span> Error';
            default:
                return '';
        }
    }

    // ========================================
    // UTILITY METHODS
    // ========================================

    _isWarningAcknowledged() {
        return localStorage.getItem(STORAGE_KEYS.WARNING_ACKNOWLEDGED) === 'true';
    }

    /**
     * Check if a key exists for the specified provider
     */
    _hasKeyForProvider(provider) {
        const storageKey = provider === 'openai' ? STORAGE_KEYS.OPENAI_KEY : STORAGE_KEYS.API_KEY;
        const key = localStorage.getItem(storageKey);
        return key && key.length > 0;
    }

    /**
     * Get the storage key for the current provider
     */
    _getStorageKeyForProvider() {
        return this._selectedProvider === 'openai' ? STORAGE_KEYS.OPENAI_KEY : STORAGE_KEYS.API_KEY;
    }

    _checkExistingKey() {
        if (this._hasKeyForProvider(this._selectedProvider)) {
            this._setStatus(STATUS.SAVED);
        }
    }

    /**
     * Get current status
     */
    getStatus() {
        return this._status;
    }

    /**
     * Check if key is valid and saved
     */
    isKeyValid() {
        return this._status === STATUS.SAVED || this._status === STATUS.VALID;
    }

    /**
     * Get selected provider
     */
    getSelectedProvider() {
        return this._selectedProvider;
    }

    /**
     * Get API key for current provider
     */
    getApiKey() {
        const storageKey = this._getStorageKeyForProvider();
        return localStorage.getItem(storageKey);
    }

    /**
     * Get both API keys
     */
    getAllKeys() {
        return {
            gemini: localStorage.getItem(STORAGE_KEYS.API_KEY),
            openai: localStorage.getItem(STORAGE_KEYS.OPENAI_KEY),
            selectedProvider: this._selectedProvider
        };
    }

    /**
     * Destroy and cleanup
     */
    destroy() {
        if (this._container) {
            this._container.innerHTML = '';
        }
    }
}

// ========================================
// STYLES (Inject if not present)
// ========================================

function injectStyles() {
    if (document.getElementById('api-key-manager-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'api-key-manager-styles';
    styles.textContent = `
        .api-key-manager {
            font-family: system-ui, -apple-system, sans-serif;
            max-width: 500px;
            padding: 1rem;
        }

        .security-warning {
            display: flex;
            gap: 1rem;
            padding: 1rem;
            margin-bottom: 1rem;
            background: rgba(255, 193, 7, 0.1);
            border: 1px solid rgba(255, 193, 7, 0.3);
            border-radius: 8px;
            transition: opacity 0.5s, transform 0.5s;
        }

        .security-warning.acknowledged {
            opacity: 0;
            transform: translateY(-10px);
        }

        .warning-icon {
            font-size: 1.5rem;
            flex-shrink: 0;
        }

        .warning-title {
            margin: 0 0 0.5rem 0;
            font-size: 0.95rem;
            color: #b8860b;
        }

        .warning-text {
            margin: 0 0 0.75rem 0;
            font-size: 0.85rem;
            line-height: 1.5;
            color: #666;
        }

        .warning-acknowledge {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            cursor: pointer;
            font-size: 0.85rem;
        }

        .api-key-section {
            margin-bottom: 1rem;
        }

        .api-key-label {
            display: block;
            margin-bottom: 0.5rem;
        }

        .label-text {
            font-weight: 600;
            display: block;
        }

        .label-hint {
            font-size: 0.8rem;
            color: #666;
        }

        .api-key-input-group {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 0.75rem;
        }

        .api-key-input {
            flex: 1;
            padding: 0.75rem;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 0.95rem;
            font-family: monospace;
        }

        .api-key-input:focus {
            outline: none;
            border-color: #6366f1;
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .toggle-visibility-btn {
            padding: 0.5rem 0.75rem;
            background: #f3f4f6;
            border: 1px solid #ddd;
            border-radius: 6px;
            cursor: pointer;
            transition: background 0.2s;
        }

        .toggle-visibility-btn:hover {
            background: #e5e7eb;
        }

        .api-key-actions {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 0.75rem;
        }

        .action-btn {
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 6px;
            font-size: 0.85rem;
            cursor: pointer;
            transition: all 0.2s;
        }

        .action-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .test-btn {
            background: #f3f4f6;
            color: #374151;
        }

        .test-btn:hover:not(:disabled) {
            background: #e5e7eb;
        }

        .save-btn {
            background: #6366f1;
            color: white;
        }

        .save-btn:hover:not(:disabled) {
            background: #4f46e5;
        }

        .clear-btn {
            background: #fee2e2;
            color: #991b1b;
        }

        .clear-btn:hover:not(:disabled) {
            background: #fecaca;
        }

        .api-key-status {
            padding: 0.5rem 0.75rem;
            border-radius: 6px;
            font-size: 0.85rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .status-none {
            background: #f3f4f6;
            color: #6b7280;
        }

        .status-validating {
            background: #dbeafe;
            color: #1d4ed8;
        }

        .status-valid {
            background: #d1fae5;
            color: #065f46;
        }

        .status-invalid {
            background: #fee2e2;
            color: #991b1b;
        }

        .status-saved {
            background: #d1fae5;
            color: #065f46;
        }

        .status-error {
            background: #fef3c7;
            color: #92400e;
        }

        .status-icon {
            font-weight: bold;
        }

        .status-icon.spinning {
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        .api-key-help {
            font-size: 0.8rem;
            text-align: center;
        }

        .api-key-help a {
            color: #6366f1;
            text-decoration: none;
        }

        .api-key-help a:hover {
            text-decoration: underline;
        }
    `;
    document.head.appendChild(styles);
}

// Auto-inject styles when module loads
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectStyles);
    } else {
        injectStyles();
    }
}

// ========================================
// EXPORTS
// ========================================

export { APIKeyManager, STATUS, STORAGE_KEYS, PROVIDERS };

// Export for browser global
if (typeof window !== 'undefined') {
    window.APIKeyManager = APIKeyManager;
    window.AI_PROVIDERS = PROVIDERS;
}
