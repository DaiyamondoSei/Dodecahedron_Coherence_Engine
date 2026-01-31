/**
 * ════════════════════════════════════════════════════════════════════════════
 * ACCESSIBILITY SPECIFICATIONS - WCAG 2.1 AA COMPLIANCE FOR QUANNEX
 * ════════════════════════════════════════════════════════════════════════════
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                         NOTES FOR FUTURE CLAUDE                         │
 * │                                                                         │
 * │  This module ensures Quannex is usable by EVERYONE, regardless of      │
 * │  ability. Accessibility is not an afterthought—it's a core value.      │
 * │                                                                         │
 * │  KEY INSIGHT: The dodecahedron's 12 faces represent 12 ways of         │
 * │  seeing. Accessibility adds more ways—screen readers, keyboard,        │
 * │  reduced motion. Every way of seeing is valid.                         │
 * │                                                                         │
 * │  CRITICAL: Never sacrifice accessibility for aesthetics.               │
 * │  Beauty that excludes is not true beauty.                              │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                             NAVIGATION MAP                                ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║  1. ACCESSIBILITY_CONFIG    → WCAG 2.1 AA target and principles         ║
 * ║  2. WCAG_PERCEIVABLE        → Text alternatives, contrast, resize       ║
 * ║  3. WCAG_OPERABLE           → Keyboard, timing, seizures, navigation    ║
 * ║  4. WCAG_UNDERSTANDABLE     → Language, predictability, input help      ║
 * ║  5. WCAG_ROBUST             → Parsing, ARIA, dynamic content            ║
 * ║  6. SCREEN_READER_SUPPORT   → ARIA live regions, announcements          ║
 * ║  7. REDUCED_MOTION          → prefers-reduced-motion handling           ║
 * ║  8. AccessibilityManager    → Runtime utilities and helpers             ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 *
 * @author Deimantas Murauskas & Claude (Opus 4.5)
 * @thesis Organizational Coherence Through Sacred Geometry
 * @created 2026-01-03
 * @related
 *   - js/ux/language-register.js → Register-specific a11y considerations
 *   - js/ux/data-integrity.js → Ensuring accessible data transforms
 *   - pages/dodecahedron-3d.html → 3D model accessibility
 *   - docs/SOUL_OF_QUANNEX.md → The philosophy of inclusive seeing
 */

'use strict';

// ════════════════════════════════════════════════════════════════════════════
// SECTION 1: ACCESSIBILITY CONFIGURATION
// ════════════════════════════════════════════════════════════════════════════

/**
 * Core accessibility configuration and compliance target.
 *
 * The four WCAG principles form a complete framework:
 * - PERCEIVABLE: Can users perceive the content?
 * - OPERABLE: Can users operate the interface?
 * - UNDERSTANDABLE: Can users understand the content?
 * - ROBUST: Will it work with assistive technologies?
 */
const ACCESSIBILITY_CONFIG = {
    target: 'WCAG 2.1 Level AA',

    principles: {
        perceivable: 'Information must be presentable in ways users can perceive',
        operable: 'Interface components must be operable by all users',
        understandable: 'Information and operation must be understandable',
        robust: 'Content must be robust enough for assistive technologies'
    },

    // The sacred geometry connection
    insight: {
        statement: 'The dodecahedron has 12 faces—12 ways of seeing. ' +
            'Accessibility adds more ways: screen readers, keyboard navigation, ' +
            'reduced motion. Every way of seeing is valid and honored.',
        application: 'Every visual representation has an accessible alternative'
    }
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 2: WCAG PERCEIVABLE
// ════════════════════════════════════════════════════════════════════════════

/**
 * WCAG Perceivable principle implementation.
 *
 * Addresses:
 * - Text alternatives for non-text content
 * - Color contrast requirements
 * - Text resize support
 * - Audio/visual considerations
 */
const WCAG_PERCEIVABLE = {

    // ─────────────────────────────────────────────────────────────────────────
    // 2.1: Text Alternatives
    // ─────────────────────────────────────────────────────────────────────────

    textAlternatives: {
        images: {
            requirement: 'All images have alt text',
            implementation: 'alt="" for decorative, descriptive for informative'
        },
        icons: {
            requirement: 'All icons have aria-label',
            implementation: 'aria-label="Description" or aria-hidden="true" if decorative'
        },
        charts: {
            requirement: 'All charts have text description',
            implementation: 'aria-describedby pointing to detailed description'
        },
        threeDModel: {
            requirement: 'Dodecahedron has comprehensive aria description',
            implementation: 'role="img" with aria-label describing the visualization',
            description: 'Interactive dodecahedron visualization showing 12 organizational ' +
                'domains. Use Tab to navigate between faces, Enter to select, ' +
                'Arrow keys to rotate view, Escape to return to overview.'
        }
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 2.2: Color Contrast
    // ─────────────────────────────────────────────────────────────────────────

    colorContrast: {
        requirements: {
            normalText: { ratio: '4.5:1', size: 'Under 18pt (or 14pt bold)' },
            largeText: { ratio: '3:1', size: '18pt+ (or 14pt+ bold)' },
            uiComponents: { ratio: '3:1', description: 'Interactive element boundaries' }
        },

        // Register-specific palettes (all meet contrast requirements)
        byRegister: {
            analytical: {
                description: 'High contrast, no decorative colors',
                foreground: '#1a1a1a',
                background: '#ffffff',
                accent: '#0066cc',
                error: '#cc0000'
            },
            balanced: {
                description: 'Standard palette with sufficient contrast',
                foreground: '#2c2c2c',
                background: '#f8f8f8',
                accent: '#2563eb',
                error: '#dc2626'
            },
            contemplative: {
                description: 'Warmer palette, still meets contrast requirements',
                foreground: '#3d3d3d',
                background: '#faf8f5',
                accent: '#7c3aed',
                error: '#b91c1c'
            }
        },

        // Utility function to check contrast
        checkContrast: function (foreground, background) {
            // Luminance calculation following WCAG formula
            const getLuminance = (hex) => {
                const rgb = parseInt(hex.slice(1), 16);
                const r = (rgb >> 16) & 0xff;
                const g = (rgb >> 8) & 0xff;
                const b = rgb & 0xff;

                const [rs, gs, bs] = [r, g, b].map(c => {
                    c = c / 255;
                    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
                });

                return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
            };

            const l1 = getLuminance(foreground);
            const l2 = getLuminance(background);
            const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

            return {
                ratio: ratio.toFixed(2),
                passesNormal: ratio >= 4.5,
                passesLarge: ratio >= 3
            };
        }
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 2.3: Text Resize
    // ─────────────────────────────────────────────────────────────────────────

    textResize: {
        support: 'Up to 200% without loss of functionality',
        responsive: 'Layout adapts to text size changes',
        noHorizontalScroll: 'At 200% zoom on 320px viewport',

        implementation: {
            useRelativeUnits: 'rem, em, %, vh/vw instead of px for text',
            fluidTypography: 'clamp() for responsive font sizes',
            flexibleContainers: 'min-content, max-content, fit-content'
        }
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 2.4: Audio/Visual
    // ─────────────────────────────────────────────────────────────────────────

    audioVisual: {
        noAutoplay: 'No auto-playing audio/video content',
        captions: 'If video content added, captions required',
        animations: 'Respect prefers-reduced-motion media query',

        implementation: {
            videoRequirements: ['captions', 'transcripts', 'audio descriptions'],
            animationControl: 'User toggle for all animations'
        }
    }
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 3: WCAG OPERABLE
// ════════════════════════════════════════════════════════════════════════════

/**
 * WCAG Operable principle implementation.
 *
 * Addresses:
 * - Keyboard accessibility
 * - Timing considerations
 * - Seizure prevention
 * - Navigation support
 */
const WCAG_OPERABLE = {

    // ─────────────────────────────────────────────────────────────────────────
    // 3.1: Keyboard Accessibility
    // ─────────────────────────────────────────────────────────────────────────

    keyboard: {
        fullNavigation: 'All functionality available via keyboard',
        focusVisible: 'Clear focus indicator on all interactive elements',
        noKeyboardTraps: 'Can always Tab/Escape out of any component',
        shortcuts: 'Document all keyboard shortcuts, allow customization',

        globalShortcuts: {
            'Tab': 'Move focus to next interactive element',
            'Shift+Tab': 'Move focus to previous interactive element',
            'Enter/Space': 'Activate focused element',
            'Escape': 'Close modal/return to previous context',
            '?': 'Show keyboard shortcuts help',
            '/': 'Focus search (if applicable)'
        },

        dodecahedronShortcuts: {
            'Arrow keys': 'Rotate 3D model view',
            '1-9, 0, -, =': 'Select face 1-12 directly',
            'Enter': 'Open details for selected face',
            'Escape': 'Return to overview/deselect',
            'Home': 'Reset view to default',
            '+/-': 'Zoom in/out'
        },

        focusStyle: {
            outline: '3px solid currentColor',
            outlineOffset: '2px',
            backgroundColor: 'rgba(37, 99, 235, 0.1)'
        }
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 3.2: Timing
    // ─────────────────────────────────────────────────────────────────────────

    timing: {
        noTimeLimit: 'No time limits on interactions',
        pausable: 'Any moving content can be paused',
        ritualTiming: 'Ritual timers are optional, never enforced',

        implementation: {
            noSessionTimeout: 'Application does not time out',
            pauseAnimations: 'Pause button for all timed content',
            ritualOptional: 'User can skip or extend ritual timings'
        }
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 3.3: Seizures
    // ─────────────────────────────────────────────────────────────────────────

    seizures: {
        noFlashing: 'No content flashes more than 3 times per second',
        animationControl: 'User can disable animations',

        safeAnimation: {
            maxFlashRate: '3 Hz maximum',
            noRedFlashing: 'No saturated red flashing',
            smallAreaException: 'Flashing content < 25% of viewport may be exempt'
        }
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 3.4: Navigation
    // ─────────────────────────────────────────────────────────────────────────

    navigation: {
        skipLinks: 'Skip to main content link as first focusable element',
        pageTitle: 'Unique, descriptive page titles',
        focusOrder: 'Logical focus order matching visual order',
        linkPurpose: 'Link text describes destination',

        pageTitles: {
            dashboard: 'Quannex - Organizational Coherence Dashboard',
            dodecahedron3d: 'Quannex - 3D Dodecahedron Visualization',
            breathAnalysis: 'Quannex - Breath Axis Analysis',
            resultsSummary: 'Quannex - Results Summary',
            kpiEditor: 'Quannex - KPI Editor'
        },

        landmarks: {
            banner: 'Site header with navigation',
            main: 'Primary content area',
            navigation: 'Main navigation menu',
            complementary: 'Sidebar with related information',
            contentinfo: 'Site footer with additional links'
        }
    }
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 4: WCAG UNDERSTANDABLE
// ════════════════════════════════════════════════════════════════════════════

/**
 * WCAG Understandable principle implementation.
 *
 * Addresses:
 * - Language identification
 * - Predictable behavior
 * - Input assistance
 */
const WCAG_UNDERSTANDABLE = {

    // ─────────────────────────────────────────────────────────────────────────
    // 4.1: Language
    // ─────────────────────────────────────────────────────────────────────────

    language: {
        pageLanguage: 'lang="en" on HTML element',
        languageChanges: 'Mark language changes inline with lang attribute',
        registerClarity: 'Register choice clearly explained before selection',

        implementation: {
            htmlLang: '<html lang="en">',
            foreignText: '<span lang="la">Quod erat demonstrandum</span>',
            registerExplanation: 'Clear description of what each register provides'
        }
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 4.2: Predictable
    // ─────────────────────────────────────────────────────────────────────────

    predictable: {
        consistentNavigation: 'Same navigation on all pages',
        consistentIdentification: 'Same icons/buttons mean same thing',
        noContextChange: 'No unexpected context changes on focus/input',

        principles: {
            focusBehavior: 'Focus never automatically moves content',
            inputBehavior: 'Input never automatically submits form',
            navigationConsistency: 'Menu items in same order across pages',
            iconConsistency: 'Same icon always means same action'
        }
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 4.3: Input Assistance
    // ─────────────────────────────────────────────────────────────────────────

    inputAssistance: {
        errorIdentification: 'Errors clearly identified with text, not just color',
        labels: 'All inputs have visible labels',
        instructions: 'Complex inputs have instructions',
        errorPrevention: 'Confirm before destructive actions',

        errorPatterns: {
            inline: {
                location: 'Directly below input field',
                icon: 'Error icon (aria-hidden) + text',
                color: 'Red with sufficient contrast',
                association: 'aria-describedby linking input to error'
            },
            summary: {
                location: 'Top of form',
                focus: 'Focus moves to error summary on submit',
                links: 'Links to each error field'
            }
        },

        confirmationDialogs: {
            delete: 'Are you sure you want to delete {item}? This cannot be undone.',
            reset: 'Reset all data to defaults? Your current data will be lost.',
            leave: 'You have unsaved changes. Leave anyway?'
        }
    }
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 5: WCAG ROBUST
// ════════════════════════════════════════════════════════════════════════════

/**
 * WCAG Robust principle implementation.
 *
 * Addresses:
 * - Valid parsing
 * - Accessible names
 * - ARIA roles
 * - Dynamic content updates
 */
const WCAG_ROBUST = {
    parsing: {
        validHTML: 'All HTML passes validation',
        noDuplicateIDs: 'Each ID unique within page',
        properNesting: 'Elements properly nested and closed'
    },

    name: {
        requirement: 'All components have accessible name',
        sources: ['label element', 'aria-label', 'aria-labelledby', 'title'],
        priority: 'aria-labelledby > aria-label > label > title'
    },

    role: {
        requirement: 'ARIA roles used correctly',
        rules: [
            'Use native HTML elements when possible',
            'If custom, add appropriate role',
            'Include all required ARIA states',
            'Update states on interaction'
        ]
    },

    value: {
        requirement: 'Dynamic content updates announced',
        implementation: 'aria-live regions for dynamic content',
        atomicity: 'aria-atomic for complete announcements'
    }
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 6: SCREEN READER SUPPORT
// ════════════════════════════════════════════════════════════════════════════

/**
 * Screen reader support specifications.
 *
 * Provides templates and utilities for:
 * - ARIA live regions
 * - Component announcements
 * - 3D model accessibility
 */
const SCREEN_READER_SUPPORT = {

    // ─────────────────────────────────────────────────────────────────────────
    // 6.1: ARIA Live Regions
    // ─────────────────────────────────────────────────────────────────────────

    liveRegions: {
        notifications: {
            role: 'status',
            ariaLive: 'polite',
            content: 'System notifications, success messages',
            example: 'Data saved successfully'
        },

        errors: {
            role: 'alert',
            ariaLive: 'assertive',
            content: 'Error messages, validation failures',
            example: 'Unable to load data. Please try again.'
        },

        loading: {
            role: 'status',
            ariaLive: 'polite',
            content: 'Loading states, progress updates',
            example: 'Loading face data... 50% complete'
        },

        calculations: {
            role: 'status',
            ariaLive: 'polite',
            content: 'Calculation results, coherence updates',
            example: 'Global coherence calculated: 0.78'
        }
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 6.2: Component Announcements
    // ─────────────────────────────────────────────────────────────────────────

    announcements: {
        faceSelection: 'Face {name} selected. Coherence {value}. Press Enter for details.',
        edgeHover: 'Edge {id}, connecting {face1} and {face2}. {exchangeType} exchange.',
        vertexHover: 'Vertex {id}, {archetype}. {classification} classification.',
        tooltipOpen: 'Tooltip: {content}',
        modalOpen: '{modalTitle} dialog opened. Press Escape to close.',
        ritualStep: 'Step {current} of {total}: {instruction}',
        coherenceChange: 'Coherence changed from {previous} to {current}',
        registerChange: 'Language register changed to {register}'
    },

    // Template interpolation helper
    formatAnnouncement: function (template, data) {
        return template.replace(/{(\w+)}/g, (match, key) => {
            return data[key] !== undefined ? data[key] : match;
        });
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 6.3: 3D Model Accessibility
    // ─────────────────────────────────────────────────────────────────────────

    threeDModel: {
        description: 'Interactive dodecahedron showing 12 organizational domains',

        navigation: {
            tabOrder: 'Tab through faces in numerical order (1-12)',
            arrowKeys: 'Rotate model view (up/down/left/right)',
            enterKey: 'Select focused face for details',
            escapeKey: 'Return to overview, deselect face'
        },

        alternatives: {
            listView: {
                label: 'List View',
                description: 'All face data in accessible list format',
                ariaLabel: 'View faces as accessible list'
            },
            tableView: {
                label: 'Table View',
                description: 'All data in sortable table format',
                ariaLabel: 'View data as accessible table'
            },
            toggle: {
                label: 'Toggle View',
                ariaLabel: 'Switch between 3D and accessible views'
            }
        },

        // Structured data for screen readers
        faceDescriptionTemplate:
            'Face {number}: {name}. ' +
            'Coherence: {coherence}. ' +
            'Elements: Earth {earth}, Water {water}, Fire {fire}, Air {air}, Ether {ether}. ' +
            'Status: {status}.'
    }
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 7: REDUCED MOTION
// ════════════════════════════════════════════════════════════════════════════

/**
 * Reduced motion support for users with vestibular disorders.
 *
 * Detects prefers-reduced-motion and provides alternatives
 * that convey the same information without animation.
 */
const REDUCED_MOTION = {
    detect: 'prefers-reduced-motion: reduce',

    // Animations to disable when reduced motion is preferred
    disable: [
        'Breathing animations',
        'Vortex spinning',
        'Transition animations',
        'Loading spinners (use progress bar instead)',
        'Hover effects with movement',
        'Parallax effects',
        'Auto-scrolling content'
    ],

    // Effects to keep (they don't cause vestibular issues)
    keep: [
        'Opacity transitions (quick, under 200ms)',
        'Color changes',
        'Focus indicators',
        'Essential feedback',
        'Transform: scale (subtle, under 1.1x)'
    ],

    // Non-animated alternatives for each animated feature
    alternatives: {
        breathingCircle: {
            animated: 'Pulsing circle animation',
            reduced: 'Static progress indicator with percentage'
        },
        vortexSpin: {
            animated: 'Rotating vortex visualization',
            reduced: 'Color intensity change to show activity'
        },
        slideTransition: {
            animated: 'Slide in/out page transitions',
            reduced: 'Instant switch or quick fade (100ms)'
        },
        pulsingGlow: {
            animated: 'Pulsing glow on selected elements',
            reduced: 'Static highlight border (3px solid)'
        },
        loadingSpinner: {
            animated: 'Rotating spinner',
            reduced: 'Progress bar with percentage text'
        },
        coherenceWave: {
            animated: 'Wave propagation showing coherence',
            reduced: 'Static color gradient'
        }
    },

    // CSS implementation
    cssSnippet: `
/* Respect user's motion preferences */
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }

    /* Keep essential quick transitions */
    .a11y-safe-transition {
        transition-duration: 100ms !important;
    }
}
`
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 8: ACCESSIBILITY MANAGER (Runtime Utilities)
// ════════════════════════════════════════════════════════════════════════════

/**
 * Runtime accessibility manager providing utilities and helpers.
 */
const AccessibilityManager = {

    // ─────────────────────────────────────────────────────────────────────────
    // 8.1: State Detection
    // ─────────────────────────────────────────────────────────────────────────

    state: {
        reducedMotion: false,
        highContrast: false,
        screenReader: false,
        keyboardUser: false
    },

    /**
     * Initialize accessibility state detection.
     */
    init: function () {
        // Detect reduced motion preference
        if (typeof window !== 'undefined' && window.matchMedia) {
            const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
            this.state.reducedMotion = motionQuery.matches;
            motionQuery.addEventListener('change', (e) => {
                this.state.reducedMotion = e.matches;
                this.onReducedMotionChange(e.matches);
            });

            // Detect high contrast mode
            const contrastQuery = window.matchMedia('(prefers-contrast: more)');
            this.state.highContrast = contrastQuery.matches;
            contrastQuery.addEventListener('change', (e) => {
                this.state.highContrast = e.matches;
            });
        }

        // Detect keyboard navigation
        if (typeof document !== 'undefined') {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    this.state.keyboardUser = true;
                    document.body.classList.add('keyboard-user');
                }
            });

            document.addEventListener('mousedown', () => {
                this.state.keyboardUser = false;
                document.body.classList.remove('keyboard-user');
            });
        }

        return this;
    },

    /**
     * Callback when reduced motion preference changes.
     */
    onReducedMotionChange: function (prefersReduced) {
        if (typeof document !== 'undefined') {
            document.body.classList.toggle('reduced-motion', prefersReduced);
            this.announce(
                prefersReduced
                    ? 'Reduced motion mode enabled'
                    : 'Animations enabled'
            );
        }
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 8.2: Live Region Management
    // ─────────────────────────────────────────────────────────────────────────

    liveRegionElement: null,

    /**
     * Create or get the live region element for announcements.
     */
    getLiveRegion: function () {
        if (typeof document === 'undefined') return null;

        if (!this.liveRegionElement) {
            this.liveRegionElement = document.createElement('div');
            this.liveRegionElement.setAttribute('role', 'status');
            this.liveRegionElement.setAttribute('aria-live', 'polite');
            this.liveRegionElement.setAttribute('aria-atomic', 'true');
            this.liveRegionElement.className = 'sr-only';
            this.liveRegionElement.style.cssText =
                'position: absolute; width: 1px; height: 1px; padding: 0; ' +
                'margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); ' +
                'white-space: nowrap; border: 0;';
            document.body.appendChild(this.liveRegionElement);
        }
        return this.liveRegionElement;
    },

    /**
     * Announce a message to screen readers.
     *
     * @param {string} message - The message to announce
     * @param {string} priority - 'polite' or 'assertive'
     */
    announce: function (message, priority = 'polite') {
        const region = this.getLiveRegion();
        if (!region) return;

        region.setAttribute('aria-live', priority);

        // Clear and re-add to trigger announcement
        region.textContent = '';
        setTimeout(() => {
            region.textContent = message;
        }, 50);
    },

    /**
     * Announce formatted component message.
     *
     * @param {string} templateKey - Key in SCREEN_READER_SUPPORT.announcements
     * @param {Object} data - Data to interpolate
     */
    announceComponent: function (templateKey, data) {
        const template = SCREEN_READER_SUPPORT.announcements[templateKey];
        if (!template) {
            Logger.warn('UX:Accessibility', `Unknown announcement template: ${templateKey}`);
            return;
        }

        const message = SCREEN_READER_SUPPORT.formatAnnouncement(template, data);
        this.announce(message);
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 8.3: Focus Management
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Trap focus within a container (for modals).
     *
     * @param {HTMLElement} container - The container to trap focus within
     * @returns {Function} Cleanup function to remove the trap
     */
    trapFocus: function (container) {
        if (typeof document === 'undefined' || !container) return () => { };

        const focusable = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusable[0];
        const lastFocusable = focusable[focusable.length - 1];

        const handleKeydown = (e) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey && document.activeElement === firstFocusable) {
                e.preventDefault();
                lastFocusable.focus();
            } else if (!e.shiftKey && document.activeElement === lastFocusable) {
                e.preventDefault();
                firstFocusable.focus();
            }
        };

        container.addEventListener('keydown', handleKeydown);
        firstFocusable?.focus();

        return () => {
            container.removeEventListener('keydown', handleKeydown);
        };
    },

    /**
     * Skip link functionality.
     */
    setupSkipLink: function () {
        if (typeof document === 'undefined') return;

        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        skipLink.style.cssText =
            'position: absolute; top: -40px; left: 0; padding: 8px 16px; ' +
            'background: #000; color: #fff; z-index: 10000; ' +
            'transition: top 0.2s;';

        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '0';
        });

        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });

        document.body.insertBefore(skipLink, document.body.firstChild);
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 8.4: Contrast Checking
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Check if colors meet WCAG contrast requirements.
     */
    checkContrast: WCAG_PERCEIVABLE.colorContrast.checkContrast,

    // ─────────────────────────────────────────────────────────────────────────
    // 8.5: 3D Accessibility Helpers
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Generate accessible description for a face.
     *
     * @param {Object} face - Face data object
     * @returns {string} Screen reader friendly description
     */
    describeFace: function (face) {
        const template = SCREEN_READER_SUPPORT.threeDModel.faceDescriptionTemplate;
        return SCREEN_READER_SUPPORT.formatAnnouncement(template, {
            number: face.id || face.number,
            name: face.name,
            coherence: (face.coherence * 100).toFixed(0) + '%',
            earth: face.elements?.earth?.toFixed(2) || 'N/A',
            water: face.elements?.water?.toFixed(2) || 'N/A',
            fire: face.elements?.fire?.toFixed(2) || 'N/A',
            air: face.elements?.air?.toFixed(2) || 'N/A',
            ether: face.elements?.ether?.toFixed(2) || 'N/A',
            status: face.status || 'Active'
        });
    },

    /**
     * Generate keyboard navigation instructions.
     */
    getKeyboardInstructions: function () {
        return Object.entries(WCAG_OPERABLE.keyboard.dodecahedronShortcuts)
            .map(([key, action]) => `${key}: ${action}`)
            .join('. ');
    }
};

// ════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════════════════

// CommonJS export for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ACCESSIBILITY_CONFIG,
        WCAG_PERCEIVABLE,
        WCAG_OPERABLE,
        WCAG_UNDERSTANDABLE,
        WCAG_ROBUST,
        SCREEN_READER_SUPPORT,
        REDUCED_MOTION,
        AccessibilityManager
    };
}

// Browser global export
if (typeof window !== 'undefined') {
    window.QuannexAccessibility = {
        ACCESSIBILITY_CONFIG,
        WCAG_PERCEIVABLE,
        WCAG_OPERABLE,
        WCAG_UNDERSTANDABLE,
        WCAG_ROBUST,
        SCREEN_READER_SUPPORT,
        REDUCED_MOTION,
        AccessibilityManager
    };

    // Auto-initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            AccessibilityManager.init();
        });
    } else {
        AccessibilityManager.init();
    }
}

// ════════════════════════════════════════════════════════════════════════════
// END OF ACCESSIBILITY SPECIFICATIONS
// ════════════════════════════════════════════════════════════════════════════
