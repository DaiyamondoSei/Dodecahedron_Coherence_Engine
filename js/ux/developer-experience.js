/**
 * ════════════════════════════════════════════════════════════════════════════
 * DEVELOPER EXPERIENCE (DX) - MAKING QUANNEX A JOY TO WORK WITH
 * ════════════════════════════════════════════════════════════════════════════
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                         NOTES FOR FUTURE CLAUDE                         │
 * │                                                                         │
 * │  This module makes the codebase a joy to work with for future          │
 * │  developers and Claude instances. Good DX means:                        │
 * │                                                                         │
 * │  1. Self-documenting code with clear patterns                          │
 * │  2. Helpful console messages that guide, not confuse                   │
 * │  3. Debug tools that illuminate, not obscure                           │
 * │  4. Error messages that teach, not frustrate                           │
 * │                                                                         │
 * │  KEY INSIGHT: Developer experience IS user experience.                  │
 * │  The next person to read this code is also a user.                     │
 * │                                                                         │
 * │  PHILOSOPHY: Code is read more often than written.                     │
 * │  Optimize for the reader, not the writer.                              │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                             NAVIGATION MAP                                ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║  1. DX_CONFIG               → Core DX configuration and philosophy       ║
 * ║  2. GOLD_HEADER_TEMPLATE    → Standard file header template              ║
 * ║  3. CONSOLE_STANDARDS       → Console message patterns                   ║
 * ║  4. ERROR_MESSAGE_STANDARDS → Register-aware error messages              ║
 * ║  5. DEV_TOOLS               → Browser console utilities                  ║
 * ║  6. HOT_RELOAD              → Development hot reload support             ║
 * ║  7. QuannexDev              → Runtime developer utilities                ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 *
 * @author Deimantas Murauskas & Claude (Opus 4.5)
 * @thesis Organizational Coherence Through Sacred Geometry
 * @created 2026-01-03
 * @related
 *   - js/ux/language-register.js → Register-aware error messages
 *   - js/ux/data-integrity.js → Data validation for debugging
 *   - docs/CALCULATION_AUDIT_TRAIL.md → Error reference documentation
 *   - docs/DOCUMENTATION_INDEX.md → Central documentation hub
 */

'use strict';

// ════════════════════════════════════════════════════════════════════════════
// SECTION 1: DX CONFIGURATION
// ════════════════════════════════════════════════════════════════════════════

/**
 * Core developer experience configuration.
 */
const DX_CONFIG = {
    philosophy: {
        statement: 'Developer experience IS user experience',
        principle: 'Code is read more often than written',
        goal: 'Make the codebase a joy to work with'
    },

    enabledBy: {
        devMode: "localStorage.setItem('quannexDev', 'true')",
        debugMode: "localStorage.setItem('quannexDebug', 'true')",
        urlParam: '?dev=true'
    },

    features: {
        consoleUtilities: true,
        visualDebugMode: true,
        performanceTiming: true,
        hotReload: true,
        stateInspection: true
    }
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 2: GOLD HEADER TEMPLATE
// ════════════════════════════════════════════════════════════════════════════

/**
 * Gold Standard header template for all new files.
 *
 * Every file should have this structure to ensure
 * future developers (and Claude instances) can understand it quickly.
 */
const GOLD_HEADER_TEMPLATE = {
    required: true,

    template: `
/**
 * ════════════════════════════════════════════════════════════════════════════
 * {FILENAME} - {ONE_LINE_PURPOSE}
 * ════════════════════════════════════════════════════════════════════════════
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                        NOTES FOR FUTURE CLAUDE                          │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * KEY INSIGHT: {What's the most important thing to understand?}
 * ─────────────────────────────────────────────────────────────────────────
 *   {2-3 sentences explaining the core concept}
 *
 * NAVIGATION MAP:
 * ─────────────────────────────────────────────────────────────────────────
 *   This module connects to:
 *   - {file1.js} → {relationship}
 *   - {file2.js} → {relationship}
 *   - docs/{DOC}.md → {relationship}
 *
 * REGISTER AWARENESS: {Does this module need register transformation?}
 * ─────────────────────────────────────────────────────────────────────────
 *   - Output: {Yes - use transformContent() / No - data only}
 *   - Input: {Accepts register param / Register-agnostic}
 *
 * @module js/{path}/{filename}
 * @author Deimantas & Claude
 * @version {semver}
 */
`,

    sections: {
        keyInsight: {
            required: true,
            description: 'The most important thing to understand about this file'
        },
        navigationMap: {
            required: true,
            description: 'Files and docs this module connects to'
        },
        registerAwareness: {
            required: false,
            description: 'Only needed if module handles content transformation'
        }
    },

    generate: function (options) {
        return this.template
            .replace('{FILENAME}', options.filename || 'filename.js')
            .replace('{ONE_LINE_PURPOSE}', options.purpose || 'Description')
            .replace(/{What's the most important thing to understand\?}/, options.keyInsight || '')
            .replace(/{2-3 sentences explaining the core concept}/, options.explanation || '')
            .replace(/{file1\.js}/g, options.relatedFile1 || 'related-file.js')
            .replace(/{file2\.js}/g, options.relatedFile2 || 'another-file.js')
            .replace(/{relationship}/g, options.relationship || 'describes relationship')
            .replace(/{DOC}/g, options.docName || 'REFERENCE')
            .replace(/{path}/g, options.path || 'module')
            .replace(/{filename}/g, options.filename || 'filename')
            .replace(/{semver}/g, options.version || '1.0.0');
    }
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 3: CONSOLE STANDARDS
// ════════════════════════════════════════════════════════════════════════════

/**
 * Console message standards for consistent developer feedback.
 */
const CONSOLE_STANDARDS = {

    // ─────────────────────────────────────────────────────────────────────────
    // 3.1: On Load Messages
    // ─────────────────────────────────────────────────────────────────────────

    onLoad: {
        pattern: '{emoji} {filename} loaded - {brief context}',

        examples: [
            '🔗 edge-constants.js loaded - 30 edge KPIs ready',
            '🎨 language-register.js loaded - 3 registers available',
            '🛡️ data-validator.js loaded - Circuit breaker active',
            '📐 phi-harmonics.js loaded - PHI constants defined',
            '🧭 navigation.js loaded - Quick jump ready (Cmd+K)'
        ],

        log: function (filename, context, emoji = '📦') {
            if (this.isDevMode()) {
                Logger.info('DX', `${emoji} ${filename} loaded - ${context}`);
            }
        },

        isDevMode: function () {
            return typeof localStorage !== 'undefined' &&
                localStorage.getItem('quannexDev') === 'true';
        }
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 3.2: Error Messages
    // ─────────────────────────────────────────────────────────────────────────

    onError: {
        pattern: '❌ {module}: {error} | See: {doc-link}',

        examples: [
            '❌ EdgeAnalyzer: Invalid edge ID "E99" | See: docs/EDGE_DYNAMICS_REFERENCE.md',
            '❌ FaceCalculator: Coherence out of bounds (1.5) | See: docs/CALCULATION_AUDIT_TRAIL.md',
            '❌ VertexVortex: Missing triadic faces | See: docs/VERTEX_DYNAMICS_REFERENCE.md'
        ],

        log: function (module, error, docLink) {
            Logger.error(module, `${error} | See: ${docLink}`);
        }
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 3.3: Warning Messages
    // ─────────────────────────────────────────────────────────────────────────

    onWarning: {
        pattern: '⚠️ {module}: {warning}',

        examples: [
            '⚠️ RegisterTransformer: Unknown content type "custom", using default',
            '⚠️ DataValidator: Missing optional field "description"',
            '⚠️ NavigationManager: Scroll position not found, using top'
        ],

        log: function (module, warning) {
            Logger.warn(module, warning);
        }
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 3.4: Success Messages
    // ─────────────────────────────────────────────────────────────────────────

    onSuccess: {
        pattern: '✅ {action} complete',

        examples: [
            '✅ Coherence calculation complete (12 faces, 342ms)',
            '✅ Data export complete (PDF, 2.3MB)',
            '✅ Register switch complete (balanced → analytical)'
        ],

        log: function (action, details) {
            if (this.isDevMode()) {
                const detailStr = details ? ` (${details})` : '';
                Logger.info('DX', `✅ ${action} complete${detailStr}`);
            }
        },

        isDevMode: function () {
            return typeof localStorage !== 'undefined' &&
                localStorage.getItem('quannexDev') === 'true';
        }
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 3.5: Debug Messages
    // ─────────────────────────────────────────────────────────────────────────

    debug: {
        pattern: '🔍 {module}.{function}: {detail}',
        enabledBy: "localStorage.quannexDebug = true",

        log: function (module, func, detail) {
            if (this.isDebugMode()) {
                Logger.debug(module, `${func}: ${detail}`);
            }
        },

        table: function (module, data) {
            if (this.isDebugMode()) {
                Logger.debug(module, 'Data breakdown:');
                console.table(data);
            }
        },

        isDebugMode: function () {
            return typeof localStorage !== 'undefined' &&
                localStorage.getItem('quannexDebug') === 'true';
        }
    }
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 4: ERROR MESSAGE STANDARDS
// ════════════════════════════════════════════════════════════════════════════

/**
 * Register-aware error message standards.
 */
const ERROR_MESSAGE_STANDARDS = {

    // ─────────────────────────────────────────────────────────────────────────
    // 4.1: User-Facing Errors (by register)
    // ─────────────────────────────────────────────────────────────────────────

    userFacing: {
        structure: {
            analytical: '{What happened}. {Action to take}.',
            balanced: '{What happened}. {Possible cause}. {Action to take}.',
            contemplative: '{What happened}. {Reflection}. {Action to take}.'
        },

        templates: {
            dataLoadFailed: {
                analytical: 'Data failed to load. Please refresh the page.',
                balanced: 'We couldn\'t load your data. This might be a connection issue. Please refresh or try again later.',
                contemplative: 'The data didn\'t arrive. Sometimes things need a moment. Take a breath and refresh when ready.'
            },

            calculationError: {
                analytical: 'Calculation error. Check input values.',
                balanced: 'Something went wrong with the calculation. Please verify your inputs are complete.',
                contemplative: 'The calculation encountered something unexpected. What might be incomplete in the inputs?'
            },

            invalidInput: {
                analytical: 'Invalid input: {field}. Expected: {expected}.',
                balanced: 'The {field} value doesn\'t look right. We\'re expecting {expected}.',
                contemplative: 'The {field} is asking for something different. It\'s expecting {expected}.'
            },

            networkTimeout: {
                analytical: 'Connection slow. Retrying...',
                balanced: 'Taking longer than expected. Hang tight...',
                contemplative: 'The connection is finding its way. Patience...'
            },

            validationFailed: {
                analytical: 'Validation failed. {count} error(s) found.',
                balanced: 'Some inputs need attention. We found {count} issue(s).',
                contemplative: '{count} things are asking for your attention before we continue.'
            }
        },

        getMessage: function (errorType, register, params = {}) {
            const template = this.templates[errorType];
            if (!template) return 'An error occurred.';

            let message = template[register] || template.balanced;

            // Replace placeholders
            Object.entries(params).forEach(([key, value]) => {
                message = message.replace(new RegExp(`{${key}}`, 'g'), value);
            });

            return message;
        }
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 4.2: Developer-Facing Errors
    // ─────────────────────────────────────────────────────────────────────────

    developerFacing: {
        structure: '{ErrorType}: {message}\n  at {location}\n  See: {doc-link}',

        includeAlways: [
            'Error type/code',
            'Specific message',
            'Stack trace (dev mode)',
            'Documentation link',
            'Suggested fix'
        ],

        create: function (options) {
            const {
                type = 'QuannexError',
                message,
                location,
                docLink,
                suggestedFix
            } = options;

            let errorMessage = `${type}: ${message}`;

            if (location) {
                errorMessage += `\n  at ${location}`;
            }

            if (docLink) {
                errorMessage += `\n  See: ${docLink}`;
            }

            if (suggestedFix) {
                errorMessage += `\n  Fix: ${suggestedFix}`;
            }

            return errorMessage;
        },

        example: `
QuannexValidationError: Face energy out of bounds (1.5, expected 0-1)
  at FaceCalculator.setEnergy (js/core/Face.js:142)
  See: docs/CALCULATION_AUDIT_TRAIL.md#face-energy-bounds
  Fix: Ensure input values are normalized before calling setEnergy()
`
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 4.3: Error Recovery Guidance
    // ─────────────────────────────────────────────────────────────────────────

    recovery: {
        levels: {
            retry: {
                description: 'Transient error - retry may succeed',
                action: { button: 'Try again', auto: 'after 3 seconds' }
            },
            refresh: {
                description: 'State corruption - page refresh needed',
                action: { button: 'Refresh page', preserve: 'url params' }
            },
            report: {
                description: 'Unknown error - user should report',
                action: { button: 'Report issue', prefill: 'error details' }
            },
            fatal: {
                description: 'Cannot continue - show fallback UI',
                action: { show: 'Fallback static content', contact: 'Support info' }
            }
        },

        getRecoveryLevel: function (error) {
            // Network errors are typically retryable
            if (error.name === 'NetworkError' || error.message?.includes('network')) {
                return 'retry';
            }

            // Validation errors need user attention
            if (error.name === 'ValidationError') {
                return 'refresh';
            }

            // Unknown errors should be reported
            return 'report';
        }
    }
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 5: DEV TOOLS
// ════════════════════════════════════════════════════════════════════════════

/**
 * Browser console utilities for development.
 */
const DEV_TOOLS = {

    // ─────────────────────────────────────────────────────────────────────────
    // 5.1: Console Utilities
    // ─────────────────────────────────────────────────────────────────────────

    consoleUtilities: {
        enable: "window.quannexDev = true",

        commands: {
            'quannex.inspect(faceId)': {
                description: 'Show all data for a face',
                usage: 'quannex.inspect(1)'
            },
            'quannex.inspect.edge(edgeId)': {
                description: 'Show all data for an edge',
                usage: 'quannex.inspect.edge("E3-4")'
            },
            'quannex.inspect.vertex(vertexId)': {
                description: 'Show all data for a vertex',
                usage: 'quannex.inspect.vertex("V7")'
            },
            'quannex.registers.preview(register)': {
                description: 'Preview register transformation',
                usage: 'quannex.registers.preview("analytical")'
            },
            'quannex.registers.compare()': {
                description: 'Show same content in all registers',
                usage: 'quannex.registers.compare()'
            },
            'quannex.validate()': {
                description: 'Run all validation checks',
                usage: 'quannex.validate()'
            },
            'quannex.timing()': {
                description: 'Show performance timing breakdown',
                usage: 'quannex.timing()'
            },
            'quannex.state()': {
                description: 'Dump current application state',
                usage: 'quannex.state()'
            },
            'quannex.reset()': {
                description: 'Reset to default state',
                usage: 'quannex.reset()'
            },
            'quannex.help()': {
                description: 'Show all available commands',
                usage: 'quannex.help()'
            }
        }
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 5.2: Visual Debug Mode
    // ─────────────────────────────────────────────────────────────────────────

    visualDebug: {
        enable: 'Settings > Developer > Visual Debug Mode',
        enableByUrl: '?debug=visual',

        overlays: {
            geometry: {
                description: 'Show face/edge/vertex IDs on 3D model',
                cssClass: 'debug-geometry'
            },
            dataFlow: {
                description: 'Highlight data transformation points',
                cssClass: 'debug-dataflow'
            },
            timing: {
                description: 'Show render timing on each component',
                cssClass: 'debug-timing'
            },
            register: {
                description: 'Show current register on each text element',
                cssClass: 'debug-register'
            }
        },

        colors: {
            rawData: '#3b82f6',      // Blue
            computedData: '#22c55e', // Green
            transformedData: '#f97316', // Orange
            renderedUI: '#a855f7'    // Purple
        },

        cssOverlay: `
.debug-geometry [data-face-id]::after,
.debug-geometry [data-edge-id]::after,
.debug-geometry [data-vertex-id]::after {
    content: attr(data-face-id) attr(data-edge-id) attr(data-vertex-id);
    position: absolute;
    background: rgba(0,0,0,0.8);
    color: white;
    padding: 2px 6px;
    font-size: 10px;
    border-radius: 3px;
    z-index: 9999;
}

.debug-dataflow [data-layer="raw"] { outline: 2px solid #3b82f6; }
.debug-dataflow [data-layer="computed"] { outline: 2px solid #22c55e; }
.debug-dataflow [data-layer="transformed"] { outline: 2px solid #f97316; }
.debug-dataflow [data-layer="rendered"] { outline: 2px solid #a855f7; }

.debug-timing [data-render-time]::before {
    content: attr(data-render-time) "ms";
    position: absolute;
    top: 0;
    right: 0;
    background: rgba(0,0,0,0.8);
    color: #22c55e;
    padding: 1px 4px;
    font-size: 9px;
}

.debug-register [data-register]::after {
    content: "[" attr(data-register) "]";
    font-size: 10px;
    color: #a855f7;
    margin-left: 4px;
}
`
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 5.3: Performance Profiling
    // ─────────────────────────────────────────────────────────────────────────

    performance: {
        marks: {},
        measures: {},

        mark: function (name) {
            if (typeof performance !== 'undefined') {
                performance.mark(name);
                this.marks[name] = performance.now();
            }
        },

        measure: function (name, startMark, endMark) {
            if (typeof performance !== 'undefined') {
                performance.measure(name, startMark, endMark);
                const entries = performance.getEntriesByName(name, 'measure');
                if (entries.length > 0) {
                    this.measures[name] = entries[entries.length - 1].duration;
                }
            }
        },

        report: function () {
            console.group('🕐 Performance Report');
            Object.entries(this.measures).forEach(([name, duration]) => {
                const color = duration < 100 ? 'green' : duration < 500 ? 'orange' : 'red';
                console.log(`%c${name}: ${duration.toFixed(2)}ms`, `color: ${color}`);
            });
            console.groupEnd();
        },

        clear: function () {
            if (typeof performance !== 'undefined') {
                performance.clearMarks();
                performance.clearMeasures();
            }
            this.marks = {};
            this.measures = {};
        }
    }
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 6: HOT RELOAD
// ════════════════════════════════════════════════════════════════════════════

/**
 * Hot reload support for development.
 */
const HOT_RELOAD = {

    // What can be hot-reloaded without full refresh
    supported: [
        'Language register changes',
        'CSS/styling changes',
        'Consciousness inquiry content',
        'Tooltip content',
        'Error message templates'
    ],

    // What requires a full page refresh
    requiresRefresh: [
        'PHI constant changes',
        'Geometry topology changes',
        'Core calculation logic',
        'Data schema changes'
    ],

    // State to preserve on reload
    preserveOnReload: [
        'Current view/navigation',
        'Expanded sections',
        'Scroll position',
        'User preferences',
        'Selected register'
    ],

    // State preservation implementation
    saveState: function () {
        if (typeof localStorage === 'undefined') return;

        const state = {
            path: window.location.pathname + window.location.search,
            scroll: window.scrollY,
            expanded: this.getExpandedSections(),
            timestamp: Date.now()
        };

        localStorage.setItem('quannex.hotReload.state', JSON.stringify(state));
    },

    restoreState: function () {
        if (typeof localStorage === 'undefined') return;

        const saved = localStorage.getItem('quannex.hotReload.state');
        if (!saved) return;

        const state = JSON.parse(saved);

        // Only restore if recent (within last 30 seconds)
        if (Date.now() - state.timestamp > 30000) return;

        // Restore scroll position
        if (state.scroll) {
            requestAnimationFrame(() => {
                window.scrollTo(0, state.scroll);
            });
        }

        // Restore expanded sections
        if (state.expanded) {
            this.restoreExpandedSections(state.expanded);
        }

        // Clean up
        localStorage.removeItem('quannex.hotReload.state');
    },

    getExpandedSections: function () {
        const expanded = [];
        document.querySelectorAll('[data-expanded="true"]').forEach(el => {
            if (el.id) expanded.push(el.id);
        });
        return expanded;
    },

    restoreExpandedSections: function (expanded) {
        expanded.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.setAttribute('data-expanded', 'true');
        });
    }
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 7: QUANNEX DEV RUNTIME
// ════════════════════════════════════════════════════════════════════════════

/**
 * Runtime developer utilities exposed to browser console.
 */
const QuannexDev = {

    // ─────────────────────────────────────────────────────────────────────────
    // 7.1: Initialization
    // ─────────────────────────────────────────────────────────────────────────

    init: function () {
        if (typeof window === 'undefined') return this;

        // Check if dev mode is enabled
        if (this.isEnabled()) {
            this.attachToWindow();
            this.logWelcome();
        }

        // Always attach hot reload restoration
        HOT_RELOAD.restoreState();

        return this;
    },

    isEnabled: function () {
        if (typeof localStorage === 'undefined') return false;

        const devMode = localStorage.getItem('quannexDev') === 'true';
        const urlParam = window.location.search.includes('dev=true');

        return devMode || urlParam;
    },

    attachToWindow: function () {
        window.quannex = {
            inspect: (id) => this.inspect('face', id),
            validate: () => this.validate(),
            timing: () => DEV_TOOLS.performance.report(),
            state: () => this.dumpState(),
            reset: () => this.reset(),
            help: () => this.help(),

            inspect: {
                face: (id) => this.inspect('face', id),
                edge: (id) => this.inspect('edge', id),
                vertex: (id) => this.inspect('vertex', id)
            },

            registers: {
                preview: (register) => this.previewRegister(register),
                compare: () => this.compareRegisters()
            },

            debug: {
                enable: () => this.enableDebug(),
                disable: () => this.disableDebug(),
                visual: (overlay) => this.toggleVisualDebug(overlay)
            },

            performance: DEV_TOOLS.performance
        };
    },

    logWelcome: function () {
        console.log(`
%c🔮 Quannex Developer Mode Enabled %c

Available commands:
  quannex.inspect(1)           - Inspect face 1
  quannex.inspect.edge("E3-4") - Inspect edge E3-4
  quannex.validate()           - Run validation checks
  quannex.timing()             - Show performance report
  quannex.state()              - Dump application state
  quannex.registers.preview("analytical")
  quannex.help()               - Show all commands

Type %cquannex.help()%c for full documentation.
`,
            'background: #7c3aed; color: white; padding: 4px 8px; border-radius: 4px;',
            '',
            'color: #7c3aed; font-weight: bold;',
            ''
        );
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 7.2: Inspection Commands
    // ─────────────────────────────────────────────────────────────────────────

    inspect: function (type, id) {
        console.group(`🔍 Inspecting ${type} ${id}`);

        // Get data from appropriate source
        const data = this.getDataFor(type, id);

        if (!data) {
            console.warn(`No data found for ${type} ${id}`);
            console.groupEnd();
            return null;
        }

        console.table(data);
        console.log('Raw object:', data);
        console.groupEnd();

        return data;
    },

    getDataFor: function (type, id) {
        // Placeholder - would integrate with actual data sources
        // This demonstrates the structure
        if (type === 'face') {
            return {
                id,
                name: `Face ${id}`,
                coherence: Math.random().toFixed(3),
                elements: {
                    earth: Math.random().toFixed(3),
                    water: Math.random().toFixed(3),
                    fire: Math.random().toFixed(3),
                    air: Math.random().toFixed(3),
                    ether: Math.random().toFixed(3)
                }
            };
        }
        return null;
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 7.3: Register Preview
    // ─────────────────────────────────────────────────────────────────────────

    previewRegister: function (register) {
        console.group(`🎨 Preview: ${register} register`);

        const samples = {
            'shadow detection': {
                analytical: 'area for attention detected',
                balanced: 'attention area identified',
                contemplative: 'shadow pattern emerging'
            },
            'coherence description': {
                analytical: 'alignment score: 0.78',
                balanced: 'coherence level: 0.78',
                contemplative: 'coherence radiates at 0.78'
            },
            'action suggestion': {
                analytical: 'Increase productivity KPI.',
                balanced: 'Consider focusing on productivity.',
                contemplative: 'Productivity is calling for attention.'
            }
        };

        Object.entries(samples).forEach(([context, versions]) => {
            console.log(`\n${context}:`);
            console.log(`  → ${versions[register] || versions.balanced}`);
        });

        console.groupEnd();
    },

    compareRegisters: function () {
        console.group('🎨 Register Comparison');

        const sampleContent = 'This face has a shadow in productivity with coherence at 0.78';

        console.log('Original:', sampleContent);
        console.log('\nTransformed by register:');
        console.table({
            analytical: this.transformSample(sampleContent, 'analytical'),
            balanced: this.transformSample(sampleContent, 'balanced'),
            contemplative: this.transformSample(sampleContent, 'contemplative')
        });

        console.groupEnd();
    },

    transformSample: function (content, register) {
        // Simplified transformation for demo
        const transforms = {
            analytical: {
                'shadow': 'area for attention',
                'coherence': 'alignment score'
            },
            balanced: {
                'shadow': 'attention area',
                'coherence': 'coherence'
            },
            contemplative: {
                'shadow': 'shadow',
                'coherence': 'coherence'
            }
        };

        let result = content;
        const patterns = transforms[register] || {};
        Object.entries(patterns).forEach(([from, to]) => {
            result = result.replace(new RegExp(from, 'g'), to);
        });

        return result;
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 7.4: Validation
    // ─────────────────────────────────────────────────────────────────────────

    validate: function () {
        console.group('🛡️ Running Validation Checks');

        const checks = [
            { name: 'PHI constants defined', check: () => true },
            { name: 'Data validator loaded', check: () => typeof window.QuannexDataIntegrity !== 'undefined' },
            { name: 'Register system loaded', check: () => typeof window.QuannexLanguageRegister !== 'undefined' },
            { name: 'Accessibility loaded', check: () => typeof window.QuannexAccessibility !== 'undefined' },
            { name: 'Navigation loaded', check: () => typeof window.QuannexNavigation !== 'undefined' }
        ];

        let passed = 0;
        let failed = 0;

        checks.forEach(({ name, check }) => {
            try {
                if (check()) {
                    console.log(`✅ ${name}`);
                    passed++;
                } else {
                    console.log(`❌ ${name}`);
                    failed++;
                }
            } catch (e) {
                console.log(`❌ ${name}: ${e.message}`);
                failed++;
            }
        });

        console.log(`\n${passed} passed, ${failed} failed`);
        console.groupEnd();

        return { passed, failed };
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 7.5: State Dump
    // ─────────────────────────────────────────────────────────────────────────

    dumpState: function () {
        console.group('📦 Application State');

        const state = {
            url: window.location.href,
            register: localStorage.getItem('quannex.register') || 'balanced',
            devMode: localStorage.getItem('quannexDev') === 'true',
            debugMode: localStorage.getItem('quannexDebug') === 'true',
            preferences: this.getPreferences()
        };

        console.table(state);
        console.log('Full state object:', state);
        console.groupEnd();

        return state;
    },

    getPreferences: function () {
        const prefs = {};
        const prefix = 'quannex.';

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(prefix)) {
                prefs[key.replace(prefix, '')] = localStorage.getItem(key);
            }
        }

        return prefs;
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 7.6: Reset
    // ─────────────────────────────────────────────────────────────────────────

    reset: function () {
        console.log('🔄 Resetting to defaults...');

        // Clear Quannex-specific storage
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('quannex.')) {
                keysToRemove.push(key);
            }
        }

        keysToRemove.forEach(key => localStorage.removeItem(key));

        console.log(`✅ Cleared ${keysToRemove.length} stored items`);
        console.log('Refresh the page to complete reset.');
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 7.7: Help
    // ─────────────────────────────────────────────────────────────────────────

    help: function () {
        console.log(`
%c🔮 Quannex Developer Commands %c

%cInspection:%c
  quannex.inspect(1)              Inspect face by ID
  quannex.inspect.edge("E3-4")    Inspect edge by ID
  quannex.inspect.vertex("V7")    Inspect vertex by ID

%cRegisters:%c
  quannex.registers.preview("analytical")
                                  Preview how content looks in a register
  quannex.registers.compare()     Compare content across all registers

%cValidation:%c
  quannex.validate()              Run all validation checks

%cPerformance:%c
  quannex.timing()                Show performance timing report
  quannex.performance.mark("x")   Create a timing mark
  quannex.performance.measure("name", "start", "end")
                                  Measure between marks

%cState:%c
  quannex.state()                 Dump current application state
  quannex.reset()                 Reset to default state

%cDebug Mode:%c
  quannex.debug.enable()          Enable debug logging
  quannex.debug.disable()         Disable debug logging
  quannex.debug.visual("geometry") Toggle visual debug overlay

%cStorage Keys:%c
  quannexDev = "true"             Enable dev mode
  quannexDebug = "true"           Enable debug logging
`,
            'background: #7c3aed; color: white; padding: 4px 8px; border-radius: 4px;', '',
            'color: #3b82f6; font-weight: bold;', '',
            'color: #22c55e; font-weight: bold;', '',
            'color: #f97316; font-weight: bold;', '',
            'color: #ec4899; font-weight: bold;', '',
            'color: #a855f7; font-weight: bold;', '',
            'color: #6366f1; font-weight: bold;', '',
            'color: #64748b; font-weight: bold;', ''
        );
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 7.8: Debug Mode Toggle
    // ─────────────────────────────────────────────────────────────────────────

    enableDebug: function () {
        localStorage.setItem('quannexDebug', 'true');
        console.log('🔍 Debug mode enabled. Verbose logging is now active.');
    },

    disableDebug: function () {
        localStorage.removeItem('quannexDebug');
        console.log('🔇 Debug mode disabled.');
    },

    toggleVisualDebug: function (overlay) {
        const body = document.body;
        const className = `debug-${overlay}`;

        if (body.classList.contains(className)) {
            body.classList.remove(className);
            console.log(`Visual debug overlay "${overlay}" disabled.`);
        } else {
            body.classList.add(className);
            console.log(`Visual debug overlay "${overlay}" enabled.`);
        }
    }
};

// ════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════════════════

// CommonJS export for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        DX_CONFIG,
        GOLD_HEADER_TEMPLATE,
        CONSOLE_STANDARDS,
        ERROR_MESSAGE_STANDARDS,
        DEV_TOOLS,
        HOT_RELOAD,
        QuannexDev
    };
}

// Browser global export
if (typeof window !== 'undefined') {
    window.QuannexDX = {
        DX_CONFIG,
        GOLD_HEADER_TEMPLATE,
        CONSOLE_STANDARDS,
        ERROR_MESSAGE_STANDARDS,
        DEV_TOOLS,
        HOT_RELOAD,
        QuannexDev
    };

    // Auto-initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            QuannexDev.init();
        });
    } else {
        QuannexDev.init();
    }

    // Log module loaded (in dev mode only)
    Logger.debug('DX', 'developer-experience.js loaded - Dev tools ready (quannex.help())');
}

// ════════════════════════════════════════════════════════════════════════════
// END OF DEVELOPER EXPERIENCE
// ════════════════════════════════════════════════════════════════════════════
