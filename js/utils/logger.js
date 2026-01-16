/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                            ║
 * ║   QUANNEX LOGGER UTILITY                                                   ║
 * ║   "Silence is the canvas where the signal paints"                          ║
 * ║                                                                            ║
 * ║   Location: js/utils/logger.js                                            ║
 * ║   Created: January 2026                                                   ║
 * ║   Purpose: Centralized control for console output to reduce noise         ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * NOTES FOR FUTURE CLAUDE
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * This module solves the "1000+ console.log" problem by providing:
 * 1. Centralized log levels (DEBUG, INFO, WARN, ERROR)
 * 2. Namespace filtering (e.g., only show "ShadowPanel")
 * 3. Persistence via localStorage
 * 4. Production-ready defaults (WARN level by default)
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ARCHITECTURE
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *    ┌───────────────┐        ┌───────────────┐
 *    │  Your Module  │───────►│    Logger     │───────► console.log/warn
 *    └───────────────┘        └───────┬───────┘
 *                                     │
 *                                     ▼
 *                            ┌─────────────────┐
 *                            │  LocalStorage   │
 *                            │  - LOG_LEVEL    │
 *                            │  - LOG_FILTER   │
 *                            └─────────────────┘
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * USAGE EXAMPLES
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * // 1. Import
 * import { Logger } from './utils/logger.js';
 *
 * // 2. Log with module name
 * Logger.info('MyModule', 'System initialized', { version: '1.0' });
 *
 * // 3. Set level (in console or code)
 * Logger.setLevel('DEBUG');
 *
 * // 4. Filter specific modules only
 * Logger.setFilter('ShadowPanel,Voice');
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * @module js/utils/logger
 * @version 1.0.0
 */

(function (global) {
    'use strict';

    // ════════════════════════════════════════════════════════════════════════════
    // CONSTANTS & STATE
    // ════════════════════════════════════════════════════════════════════════════

    const LEVELS = {
        DEBUG: 0,
        INFO: 1,
        WARN: 2,
        ERROR: 3,
        NONE: 4
    };

    const LEVEL_NAMES = Object.keys(LEVELS);

    // Default configuration (can be overridden by localStorage)
    let currentLevel = LEVELS.WARN;
    let activeNamespaces = []; // Empty = all allowed

    // Load persisted settings
    if (typeof localStorage !== 'undefined') {
        const storedLevel = localStorage.getItem('LOG_LEVEL');
        if (storedLevel && LEVELS[storedLevel] !== undefined) {
            currentLevel = LEVELS[storedLevel];
        }

        const storedFilter = localStorage.getItem('LOG_FILTER');
        if (storedFilter) {
            activeNamespaces = storedFilter.split(',').map(s => s.trim());
        }
    }

    // ════════════════════════════════════════════════════════════════════════════
    // THE LOGGER CLASS
    // ════════════════════════════════════════════════════════════════════════════

    class Logger {

        /**
         * Log a debug message (lowest priority)
         * @param {string} module - The name of the module (e.g. 'ShadowPanel')
         * @param {string} message - The message to log
         * @param {any} [data] - Optional data object
         */
        static debug(module, message, data) {
            if (this._shouldLog(LEVELS.DEBUG, module)) {
                const style = 'color: #9CA3AF;'; // Gray
                this._print(console.debug || console.log, module, message, data, style);
            }
        }

        /**
         * Log an info message (general information)
         * @param {string} module - The name of the module
         * @param {string} message - The message to log
         * @param {any} [data] - Optional data object
         */
        static info(module, message, data) {
            if (this._shouldLog(LEVELS.INFO, module)) {
                const style = 'color: #60A5FA; font-weight: bold;'; // Blue
                this._print(console.info || console.log, module, message, data, style);
            }
        }

        /**
         * Log a warning (something to pay attention to)
         * @param {string} module - The name of the module
         * @param {string} message - The message to log
         * @param {any} [data] - Optional data object
         */
        static warn(module, message, data) {
            if (this._shouldLog(LEVELS.WARN, module)) {
                const style = 'color: #F59E0B; font-weight: bold;'; // Amber
                this._print(console.warn || console.log, module, message, data, style);
            }
        }

        /**
         * Log an error (critical issue)
         * @param {string} module - The name of the module
         * @param {string} message - The message to log
         * @param {any} [error] - Error object or data
         */
        static error(module, message, error) {
            if (this._shouldLog(LEVELS.ERROR, module)) {
                const style = 'color: #EF4444; font-weight: bold; background: #FEF2F2;'; // Red
                this._print(console.error || console.log, module, message, error, style);
            }
        }

        // ════════════════════════════════════════════════════════════════════════
        // CONFIGURATION METHODS
        // ════════════════════════════════════════════════════════════════════════

        /**
         * Set the global logging level
         * @param {string} level - 'DEBUG', 'INFO', 'WARN', 'ERROR', 'NONE'
         */
        static setLevel(level) {
            const upper = level.toUpperCase();
            if (LEVELS[upper] !== undefined) {
                currentLevel = LEVELS[upper];
                if (typeof localStorage !== 'undefined') {
                    localStorage.setItem('LOG_LEVEL', upper);
                }
                console.log(`[Logger] Level set to ${upper}`);
            } else {
                console.warn(`[Logger] Invalid level: ${level}. Valid: ${LEVEL_NAMES.join(', ')}`);
            }
        }

        /**
         * Set the namespace filter (comma-separated)
         * @param {string|null} filter - 'ShadowPanel,Voice' or null to clear
         */
        static setFilter(filter) {
            if (!filter) {
                activeNamespaces = [];
                if (typeof localStorage !== 'undefined') {
                    localStorage.removeItem('LOG_FILTER');
                }
                console.log('[Logger] Filter cleared - showing all modules');
            } else {
                activeNamespaces = filter.split(',').map(s => s.trim());
                if (typeof localStorage !== 'undefined') {
                    localStorage.setItem('LOG_FILTER', filter);
                }
                console.log(`[Logger] Filter set to: ${activeNamespaces.join(', ')}`);
            }
        }

        // ════════════════════════════════════════════════════════════════════════
        // PRIVATE HELPERS
        // ════════════════════════════════════════════════════════════════════════

        /**
         * Check if a message should be logged based on level and filter
         * @private
         */
        static _shouldLog(level, module) {
            // 1. Level Check
            if (level < currentLevel) return false;

            // 2. Namespace Filter Check (if active)
            if (activeNamespaces.length > 0) {
                return activeNamespaces.includes(module);
            }

            return true;
        }

        /**
         * Internal print method
         * @private
         */
        static _print(consoleMethod, module, message, data, style) {
            const prefix = `%c[${module}]`;

            if (data !== undefined) {
                consoleMethod(`${prefix} ${message}`, style, data);
            } else {
                consoleMethod(`${prefix} ${message}`, style);
            }
        }
    }

    // Expose to window for global access (ES module/script hybrid)
    if (typeof window !== 'undefined') {
        window.Logger = Logger;
        window.LOG_LEVELS = LEVELS;
    }

    // Export if module system is present
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Logger;
    }

})(typeof window !== 'undefined' ? window : this);
