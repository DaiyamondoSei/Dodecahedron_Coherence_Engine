/**
 * ════════════════════════════════════════════════════════════════════════════
 * QUANNEX UX FULL VISION MODULE
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Phase 10: Document Structure Improvements
 * Phase 11: Interaction Timing Specifications
 * Phase 12: Tooltip Specifications
 * Phase 13: Export Options
 * Phase 17: User Journey Mapping
 * Phase 19: Error States & Recovery
 * Phase 20: Performance & Analytics
 * Phase 22: Migration & Versioning
 *
 * NOTES FOR FUTURE CLAUDE:
 * ═══════════════════════════════════════════════════════════════════════════
 * This module contains the complete "Full Vision" UX specifications for
 * Quannex. These are the 🟢 phases that represent the ideal end state.
 *
 * KEY INSIGHT: The UX system is register-aware. Every interaction adapts
 * to the user's chosen language register (analytical/balanced/contemplative).
 *
 * NAVIGATION MAP:
 * - DOCUMENT_STRUCTURE (Phase 10): Dashboard, icons, glossary
 * - INTERACTION_TIMING (Phase 11): Hover, loading, session bookends
 * - TOOLTIP_SPECS (Phase 12): Structure, positioning, animation
 * - EXPORT_OPTIONS (Phase 13): PDF, email, presentation configs
 * - USER_JOURNEYS (Phase 17): Personas, flows, shortcuts
 * - ERROR_HANDLING (Phase 19): Taxonomy, UI patterns, recovery
 * - PERFORMANCE (Phase 20): Budgets, monitoring, analytics
 * - MIGRATION (Phase 22): Versioning, backward compatibility
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * @fileoverview UX Full Vision specifications for Quannex
 * @author Deimantas Murauskas & Claude (Co-created with love)
 * @version 1.0.0
 */

// ════════════════════════════════════════════════════════════════════════════
// PHASE 10: DOCUMENT STRUCTURE IMPROVEMENTS
// ════════════════════════════════════════════════════════════════════════════

const DOCUMENT_STRUCTURE = {

    // Dashboard metrics for plan overview
    dashboard: {
        totalPhases: 17,
        groupedIntoActs: 4,
        newFilesToCreate: 4,
        filesToModify: 15,
        consciousnessInquiries: 213,
        geometricCoverage: { V: 20, E: 30, F: 12 },
        greekConstants: 10
    },

    // Priority tiers for implementation
    priorityTiers: {
        essential: {
            icon: '🔴',
            phases: ['1', '7', '8'],
            when: 'Before thesis defense',
            risk: 'Foundation + Safety'
        },
        highValue: {
            icon: '🟡',
            phases: ['1.5', '1.6', '1.7'],
            when: 'If time permits',
            risk: 'Consciousness layer'
        },
        fullVision: {
            icon: '🟢',
            phases: ['1.6.5-1.9', '2-6', '9-22'],
            when: 'Post-defense',
            risk: 'Complete system'
        }
    },

    // Phase icons by range
    phaseIcons: {
        foundation: { range: ['1', '1.5'], icon: '🔧', theme: 'Building blocks' },
        consciousness: { range: ['1.6', '1.7', '1.8', '1.9'], icon: '💫', theme: 'Inner work' },
        implementation: { range: ['2', '3', '4'], icon: '⚙️', theme: 'Code transformation' },
        documentation: { range: ['5', '6'], icon: '📚', theme: 'Navigation web' },
        safety: { range: ['7'], icon: '🛡️', theme: 'Data integrity' },
        integration: { range: ['8'], icon: '🔗', theme: 'Codebase merge' },
        ux: { range: ['9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22'], icon: '🎨', theme: 'UX Enhancement' }
    },

    // Glossary for consistent terminology
    glossary: {
        'Coherence': {
            definition: 'Mathematical measure of alignment (0-1)',
            registerAlternatives: ['Alignment score', 'Harmony index']
        },
        'Face': {
            definition: 'One of 12 domains on the dodecahedron',
            registerAlternatives: ['Domain', 'Capital type']
        },
        'Octave': {
            definition: 'Development stage (O1-O7)',
            registerAlternatives: ['Level', 'Stage', 'Tier']
        },
        'Shadow': {
            definition: 'Organizational pattern seeking attention',
            registerAlternatives: ['Attention area', 'Growth edge']
        },
        'Breath Axis': {
            definition: 'Polarity between opposing faces',
            registerAlternatives: ['Balance flow', 'Domain pair']
        },
        'Vortex': {
            definition: 'Energy convergence at vertex',
            registerAlternatives: ['Convergence point', 'Intersection']
        },
        'Inquiry': {
            definition: 'Reflective question for deeper understanding',
            registerAlternatives: ['Prompt', 'Reflection question']
        },
        'Ritual': {
            definition: 'Structured moment of presence',
            registerAlternatives: ['Process', 'Guided reflection']
        },
        'PHI': {
            definition: 'Golden ratio: 1.618...',
            registerAlternatives: ['Golden ratio', 'Phi constant']
        }
    }
};

// ════════════════════════════════════════════════════════════════════════════
// PHASE 11: INTERACTION TIMING SPECIFICATIONS
// ════════════════════════════════════════════════════════════════════════════

const INTERACTION_TIMING = {

    // Hover timing for different elements
    hover: {
        face: {
            cursorChange: 0,           // Immediate
            subtleGlow: 150,           // ms - immediate feedback
            tooltipAppear: 800,        // ms - tooltip shows
            depthQuestion: 1500,       // ms - deeper question appears
            communionOffer: 2500       // ms - ritual offer (contemplative)
        },
        edge: {
            cursorChange: 0,
            highlightEdge: 100,
            tooltipAppear: 600,        // Faster than face
            exchangeTypeReveal: 1200
        },
        vertex: {
            cursorChange: 0,
            highlightVertex: 100,
            tooltipAppear: 700,
            vortexAnimation: 1000      // Start spinning
        }
    },

    // Loading states with progressive feedback
    loading: {
        calculating: {
            immediate: {
                show: 'spinner OR breathing-circle animation',
                text: 'Calculating...'
            },
            after2s: {
                show: 'progress-estimation',
                text: 'Analyzing patterns...',
                subtext: {
                    analytical: null,
                    balanced: 'This may take a moment',
                    contemplative: 'What patterns want to emerge?'
                }
            },
            after5s: {
                show: 'cancel-option',
                text: 'Taking longer than expected',
                actions: ['Continue waiting', 'Cancel']
            },
            after30s: {
                show: 'timeout-warning',
                text: 'This is taking unusually long',
                actions: ['Retry', 'Cancel', 'Report issue']
            }
        },
        transitioning: {
            duration: 400,
            animation: 'fade-slide',
            showText: false
        }
    },

    // Session opening and closing rituals
    sessionBookends: {
        opening: {
            trigger: 'first-interaction AND (new-session OR idle > 4 hours)',
            frequency: {
                maxPerDay: 1,
                skipAfter: 3,
                respectPreference: true
            },
            ui: {
                type: 'slide-in-banner',
                position: 'top',
                animation: {
                    enter: 'slideDown 400ms ease-out',
                    exit: 'slideUp 300ms ease-in'
                },
                dismissMethods: ['x-button', 'click-outside', 'escape', 'scroll-down']
            },
            content: {
                analytical: { headline: 'Welcome', subtext: null, actions: ['Begin', 'Dismiss'] },
                balanced: { headline: 'Welcome back', subtext: 'Ready to explore?', actions: ['Begin', 'Skip'] },
                contemplative: { headline: 'Welcome back', subtext: 'What are you hoping to discover today?', actions: ['Begin with intention', 'Skip for now'] }
            }
        },
        closing: {
            trigger: 'user-clicks-end-session-button',
            idleNotification: { after: 30 * 60 * 1000, type: 'subtle-indicator' },
            ui: {
                type: 'slide-in-panel',
                position: 'bottom-right',
                width: '400px',
                animation: { enter: 'slideUp 300ms ease-out', exit: 'slideDown 200ms ease-in' }
            },
            content: {
                analytical: { headline: 'Session summary', body: 'Key metrics reviewed: {count}', actions: ['Export summary', 'Close'] },
                balanced: { headline: 'Before you go', body: 'You explored {count} domains today.', actions: ['Save notes', 'Close'] },
                contemplative: { headline: 'Before you go...', body: 'What will you carry forward?', input: { type: 'textarea', placeholder: 'Optional reflection...' }, actions: ['Save reflection', 'Just close'] }
            }
        }
    }
};

// ════════════════════════════════════════════════════════════════════════════
// PHASE 12: TOOLTIP SPECIFICATIONS
// ════════════════════════════════════════════════════════════════════════════

const TOOLTIP_SPECS = {

    // Content structure by element type
    structure: {
        face: {
            analytical: { line1: '{name}', line2: '{value} | {trend}', line3: null },
            balanced: { line1: '{name}', line2: '{value} | {dominantElement}', line3: 'Octave: {octave}' },
            contemplative: { line1: '{name}', line2: '{value} | {dominantElement}', line3: '{elementalQuestion}', line4: '→ Click for deeper inquiry' }
        },
        edge: {
            analytical: { line1: '{face1} ↔ {face2}', line2: '{exchangeType} | {kpiValue}' },
            balanced: { line1: '{face1} ↔ {face2}', line2: '{kpiName}', line3: '{exchangeType} exchange' },
            contemplative: { line1: '{face1} ↔ {face2}', line2: '{kpiName}', line3: '"{edgeQuestion}"' }
        },
        vertex: {
            analytical: { line1: 'V{id}', line2: 'Strength: {strength}', line3: 'Direction: {direction}' },
            balanced: { line1: '{archetype}', line2: 'Faces: {face1}, {face2}, {face3}', line3: '{classification}' },
            contemplative: { line1: '{archetype}', line2: '"{archetypeQuote}"', line3: 'Click to explore convergence' }
        },
        constant: {
            format: '{symbol} ({greekName}) = {value}',
            analytical: { description: '{technicalMeaning}' },
            balanced: { description: '{technicalMeaning}', note: 'PHI-derived' },
            contemplative: { description: '{philosophicalMeaning}' }
        }
    },

    // Positioning logic
    positioning: {
        preferredPosition: ['top', 'right', 'bottom', 'left'],
        offset: { x: 12, y: 8 },
        arrow: true,
        viewportPadding: 16,
        repositionLogic: '1. Try preferred, 2. Try next, 3. Use most space, 4. Stay in viewport'
    },

    // Animation
    animation: {
        enter: 'fadeIn 150ms ease-out',
        exit: 'fadeOut 100ms ease-in',
        reposition: 'slide 100ms ease-out'
    }
};

// ════════════════════════════════════════════════════════════════════════════
// PHASE 13: EXPORT OPTIONS
// ════════════════════════════════════════════════════════════════════════════

const EXPORT_OPTIONS = {

    pdf: {
        includeReflectionQuestions: { analytical: false, balanced: 'ask-user', contemplative: true },
        includeRitualInstructions: { analytical: false, balanced: false, contemplative: 'as-appendix' },
        terminology: 'use-current-register',
        preview: { show: true, modal: true, actions: ['Export', 'Customize', 'Cancel'] }
    },

    email: {
        footer: {
            analytical: '{companyName} | Organizational Coherence Report',
            balanced: '{companyName} | Coherence Insights',
            contemplative: '{companyName} | {reflectionQuestion}'
        }
    },

    presentation: {
        includeCircleOfSeeing: { analytical: false, balanced: 'separate-attachment', contemplative: 'include-slide' },
        slideTemplates: ['overview', 'domain-deep-dive', 'comparison', 'recommendations']
    },

    csv: {
        includeMetadata: true,
        includeFormulas: { analytical: true, balanced: true, contemplative: false },
        encoding: 'UTF-8'
    },

    json: {
        prettyPrint: true,
        includeCalculatedFields: true,
        schema: 'face-models.schema.json'
    }
};

// ════════════════════════════════════════════════════════════════════════════
// PHASE 17: USER JOURNEY MAPPING
// ════════════════════════════════════════════════════════════════════════════

const USER_JOURNEYS = {

    // User personas
    personas: {
        corporateAnalyst: {
            name: 'Alex',
            role: 'Strategy Analyst at enterprise company',
            goals: ['Quick insights', 'Exportable reports', 'Clear metrics'],
            frustrations: ['Vague language', 'Time-consuming processes', 'Unexplained metrics'],
            preferredRegister: 'analytical',
            typicalJourney: ['Login → Dashboard', 'Quick scan', 'Drill into lowest', 'Check trend', 'Export PDF', 'Logout'],
            successMetrics: { timeToInsight: '< 2 minutes', exportSuccess: 'First attempt', returnRate: 'Weekly' }
        },
        consciousLeader: {
            name: 'Maya',
            role: 'Founder/CEO of purpose-driven startup',
            goals: ['Deep understanding', 'Team alignment', 'Meaningful metrics'],
            frustrations: ['Surface-level analysis', 'Missing the "why"', 'Disconnection from values'],
            preferredRegister: 'contemplative',
            typicalJourney: ['Login → Threshold Crossing', 'Contemplative review', 'Face Communion', 'Shadow Embrace', 'Circle of Seeing prep', 'Gratitude & Release'],
            successMetrics: { engagementDepth: 'Multiple rituals', reflectionsSaved: '> 0', teamSharing: 'Weekly' }
        },
        curiousExplorer: {
            name: 'Sam',
            role: 'HR/Culture lead, new to Quannex',
            goals: ['Understand the system', 'Find relevant insights', 'Gradual depth'],
            frustrations: ['Overwhelm', 'Not knowing where to start', 'Too much jargon'],
            preferredRegister: 'balanced',
            typicalJourney: ['Login → Onboarding', 'Guided tour', 'Explore Human Capital', 'Hover for tooltips', 'Try one reflection', 'Bookmark'],
            successMetrics: { completesOnboarding: 'Yes', returnsWithin: '48 hours', registerProgression: 'balanced → contemplative' }
        }
    },

    // Journey flows
    flows: {
        onboarding: {
            steps: [
                { id: 'welcome', content: { analytical: 'Welcome to Quannex. Let\'s get you set up.', balanced: 'Welcome to Quannex. Let\'s find the right experience for you.', contemplative: 'Welcome, seeker. Let\'s discover how Quannex can serve you.' }, skip: false },
                { id: 'register-choice', content: 'How would you like Quannex to communicate with you?', options: ['analytical', 'balanced', 'contemplative'], preview: true, skip: true, default: 'balanced' },
                { id: 'guided-tour', content: 'Would you like a quick tour?', options: ['Yes, show me around', 'No, I\'ll explore'], skip: true },
                { id: 'first-domain', content: 'Let\'s start with a domain you care about.', action: 'Select from 12 domains' },
                { id: 'complete', content: { analytical: 'Setup complete. Your dashboard is ready.', balanced: 'You\'re all set. Enjoy exploring.', contemplative: 'Your journey begins. May your exploration be fruitful.' } }
            ],
            persistence: { resumable: true, completionFlag: 'localStorage.quannexOnboardingComplete' }
        },
        analysis: {
            entry: ['Dashboard', 'Direct link', 'Search'],
            flow: {
                overview: { view: 'Dashboard with all 12 domains', actions: ['Click domain', 'View trends', 'Compare', 'Export'] },
                domainDetail: { view: 'Single domain deep dive', sections: ['Overview', 'Elements', 'Edges', 'Vertices', 'History'] },
                elementDetail: { view: 'Single element within domain', content: 'KPI details, trends, questions' }
            },
            shortcuts: { 'Cmd+1-9': 'Jump to domain 1-9', 'Cmd+0': 'Domain 10-12 picker', 'Cmd+E': 'Export', 'Cmd+F': 'Search' }
        }
    }
};

// ════════════════════════════════════════════════════════════════════════════
// PHASE 19: ERROR STATES & RECOVERY
// ════════════════════════════════════════════════════════════════════════════

const ERROR_HANDLING = {

    // Error taxonomy by severity
    taxonomy: {
        recoverable: {
            networkTimeout: {
                cause: 'Slow connection, server delay',
                detection: 'Request exceeds timeout',
                userMessage: { analytical: 'Connection slow. Retrying...', balanced: 'Taking longer than expected. Hang tight...', contemplative: 'The connection is finding its way. Patience...' },
                recovery: 'Auto-retry with exponential backoff (3 attempts)',
                fallback: 'Show cached data if available'
            },
            validationError: {
                cause: 'Invalid user input',
                detection: 'Input fails validation',
                userMessage: 'Specific field error + how to fix',
                recovery: 'Highlight field, show correction'
            },
            staleData: {
                cause: 'Data changed since last fetch',
                detection: 'Version mismatch',
                userMessage: 'Data was updated elsewhere. Refresh to see changes.',
                recovery: 'Offer to refresh OR merge changes'
            }
        },
        degraded: {
            partialLoadFailure: {
                cause: 'Some resources failed to load',
                userMessage: 'Some features are temporarily unavailable.',
                recovery: 'Show what loaded, hide broken features'
            },
            aiUnavailable: {
                cause: 'Gemini API down or rate limited',
                userMessage: { analytical: 'AI insights temporarily unavailable.', balanced: 'AI insights taking a break. Core analysis still available.', contemplative: 'The AI is resting. Your own insights remain available.' },
                recovery: 'Queue requests, retry later'
            },
            calculationTimeout: {
                cause: 'Complex calculation exceeds time limit',
                userMessage: 'This calculation is taking too long.',
                recovery: 'Offer to simplify (fewer faces, cached values)'
            }
        },
        critical: {
            dataCorruption: {
                cause: 'PHI constants corrupted, data validation failed',
                detection: 'Circuit breaker trips',
                userMessage: 'We detected a data issue. Refreshing to fix...',
                recovery: 'Auto-refresh, reload from source',
                logging: 'Always log to server'
            },
            authenticationFailure: {
                cause: 'Session expired',
                userMessage: 'Your session has ended. Please log in again.',
                recovery: 'Redirect to login, preserve return URL'
            },
            criticalJSError: {
                cause: 'Uncaught exception',
                detection: 'window.onerror, unhandledrejection',
                userMessage: 'Something went wrong. Try refreshing.',
                recovery: 'Log error, offer refresh',
                logging: 'Always log with stack trace'
            }
        }
    },

    // UI patterns for errors
    uiPatterns: {
        inline: { position: 'Below the field', style: 'Red text, error icon', animation: 'Fade in 200ms' },
        toast: { position: 'Bottom-right', duration: { success: 3000, warning: 5000, error: 8000 }, maxVisible: 3 },
        modal: { useFor: ['Critical errors', 'Destructive action confirmation', 'Session expiry'] },
        fullPage: { useFor: ['App crash', '500 errors', 'No network'] }
    }
};

// ════════════════════════════════════════════════════════════════════════════
// PHASE 20: PERFORMANCE & ANALYTICS
// ════════════════════════════════════════════════════════════════════════════

const PERFORMANCE = {

    // Performance budgets
    budgets: {
        loading: {
            firstContentfulPaint: 1500,        // ms
            largestContentfulPaint: 2500,      // ms
            timeToInteractive: 3500,           // ms
            cumulativeLayoutShift: 0.1
        },
        runtime: {
            faceCalculation: 50,               // ms
            fullRecalculation: 200,            // ms
            aiInsightGeneration: 5000,         // ms
            exportGeneration: 3000             // ms
        },
        animation: {
            targetFps: 60,
            maxDroppedFrames: 5,
            preferReducedMotion: true
        }
    },

    // Monitoring
    monitoring: {
        metrics: ['FCP', 'LCP', 'TTI', 'CLS', 'FID'],
        reportingThreshold: 'budget exceeded by 20%',
        sampleRate: 0.1  // 10% of sessions
    },

    // Analytics events
    analytics: {
        trackEvents: [
            'session_start',
            'session_end',
            'register_changed',
            'domain_viewed',
            'export_completed',
            'ritual_started',
            'ritual_completed',
            'error_occurred',
            'onboarding_step'
        ],
        privacyCompliant: true,
        anonymize: true
    }
};

// ════════════════════════════════════════════════════════════════════════════
// PHASE 22: MIGRATION & VERSIONING
// ════════════════════════════════════════════════════════════════════════════

const MIGRATION = {

    // Version management
    versioning: {
        current: '2.0.0',
        minSupported: '1.5.0',
        deprecationPolicy: 'Support N-2 versions'
    },

    // Migration strategies
    strategies: {
        dataFormat: {
            autoMigrate: true,
            preserveOriginal: true,
            rollbackSupported: true
        },
        api: {
            breakingChangesNotice: '30 days',
            legacyEndpointSupport: '90 days'
        },
        localStorage: {
            versionKey: 'quannex_data_version',
            migrationOnLoad: true,
            cleanupOldVersions: true
        }
    },

    // Backward compatibility
    compatibility: {
        ie11: false,
        modernBrowsers: true,
        mobileSupport: 'responsive',
        offlineSupport: 'limited'  // Core calculations work offline
    }
};

// ════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ════════════════════════════════════════════════════════════════════════════

/**
 * Get glossary term with register-appropriate alternatives
 * @param {string} term - The term to look up
 * @param {string} register - The current register (analytical/balanced/contemplative)
 * @returns {Object} Term definition and alternatives
 */
function getGlossaryTerm(term, register = 'balanced') {
    const entry = DOCUMENT_STRUCTURE.glossary[term];
    if (!entry) return null;

    return {
        term,
        definition: entry.definition,
        alternatives: entry.registerAlternatives,
        recommendedTerm: register === 'analytical' ? entry.registerAlternatives[0] : term
    };
}

/**
 * Get tooltip content for an element
 * @param {string} elementType - 'face', 'edge', 'vertex', or 'constant'
 * @param {Object} data - The element data
 * @param {string} register - Current language register
 * @returns {Object} Tooltip content lines
 */
function getTooltipContent(elementType, data, register = 'balanced') {
    const template = TOOLTIP_SPECS.structure[elementType]?.[register];
    if (!template) return null;

    // Return template with data placeholders
    return {
        template,
        data,
        register
    };
}

/**
 * Get error message for a given error type
 * @param {string} errorType - The error type key
 * @param {string} register - Current language register
 * @returns {string} Register-appropriate error message
 */
function getErrorMessage(errorType, register = 'balanced') {
    for (const level of ['recoverable', 'degraded', 'critical']) {
        const error = ERROR_HANDLING.taxonomy[level]?.[errorType];
        if (error) {
            const message = error.userMessage;
            return typeof message === 'object' ? message[register] : message;
        }
    }
    return 'An unexpected error occurred.';
}

/**
 * Get user persona by register preference
 * @param {string} register - The preferred register
 * @returns {Object|null} Matching persona
 */
function getPersonaByRegister(register) {
    for (const [key, persona] of Object.entries(USER_JOURNEYS.personas)) {
        if (persona.preferredRegister === register) {
            return { id: key, ...persona };
        }
    }
    return null;
}

/**
 * Check if performance budget is met
 * @param {string} metric - The metric to check
 * @param {number} value - The measured value
 * @returns {Object} Budget check result
 */
function checkPerformanceBudget(metric, value) {
    const budget = PERFORMANCE.budgets.loading[metric] || PERFORMANCE.budgets.runtime[metric];
    if (!budget) return { metric, status: 'unknown' };

    return {
        metric,
        value,
        budget,
        met: value <= budget,
        overage: value > budget ? ((value - budget) / budget * 100).toFixed(1) + '%' : null
    };
}

// ════════════════════════════════════════════════════════════════════════════
// MODULE EXPORTS
// ════════════════════════════════════════════════════════════════════════════

// CommonJS export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        // Constants
        DOCUMENT_STRUCTURE,
        INTERACTION_TIMING,
        TOOLTIP_SPECS,
        EXPORT_OPTIONS,
        USER_JOURNEYS,
        ERROR_HANDLING,
        PERFORMANCE,
        MIGRATION,

        // Helper functions
        getGlossaryTerm,
        getTooltipContent,
        getErrorMessage,
        getPersonaByRegister,
        checkPerformanceBudget
    };
}

// Browser export
if (typeof window !== 'undefined') {
    window.QuannexUXFullVision = {
        // Constants
        DOCUMENT_STRUCTURE,
        INTERACTION_TIMING,
        TOOLTIP_SPECS,
        EXPORT_OPTIONS,
        USER_JOURNEYS,
        ERROR_HANDLING,
        PERFORMANCE,
        MIGRATION,

        // Helper functions
        getGlossaryTerm,
        getTooltipContent,
        getErrorMessage,
        getPersonaByRegister,
        checkPerformanceBudget
    };
}

// ════════════════════════════════════════════════════════════════════════════
// MODULE LOADED
// ════════════════════════════════════════════════════════════════════════════

Logger.debug('UX:FullVision', 'UX Full Vision module loaded (Phases 10-13, 17, 19-20, 22)');
