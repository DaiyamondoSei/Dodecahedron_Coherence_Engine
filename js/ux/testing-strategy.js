/**
 * ════════════════════════════════════════════════════════════════════════════
 * TESTING STRATEGY - QUALITY ASSURANCE FOR QUANNEX
 * ════════════════════════════════════════════════════════════════════════════
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                         NOTES FOR FUTURE CLAUDE                         │
 * │                                                                         │
 * │  This module defines the testing strategy for ensuring quality across   │
 * │  all registers, personas, and edge cases in Quannex.                    │
 * │                                                                         │
 * │  KEY INSIGHT: Testing the dodecahedron means testing 12 × 5 × 3 =      │
 * │  180 combinations (12 faces × 5 elements × 3 registers). Plus edges,   │
 * │  vertices, and breath axes. Comprehensive coverage matters.             │
 * │                                                                         │
 * │  PHILOSOPHY: Tests are not just quality gates—they're documentation    │
 * │  of expected behavior. A failing test tells a story about what broke.  │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                             NAVIGATION MAP                                ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║  1. TESTING_CONFIG          → Core testing configuration                 ║
 * ║  2. UNIT_TEST_STRATEGY      → Unit test priorities and structure         ║
 * ║  3. INTEGRATION_TESTS       → User flow integration tests                ║
 * ║  4. REGISTER_TESTS          → Register-specific matrix testing           ║
 * ║  5. ACCESSIBILITY_TESTS     → WCAG compliance testing                    ║
 * ║  6. PERFORMANCE_TESTS       → Lighthouse and load testing                ║
 * ║  7. MOCK_ORGANIZATIONS      → Test data for various scenarios            ║
 * ║  8. CONTENT_FIXTURES        → Content test fixtures                      ║
 * ║  9. TestRunner              → Test execution utilities                   ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 *
 * @author Deimantas Murauskas & Claude (Opus 4.5)
 * @thesis Organizational Coherence Through Sacred Geometry
 * @created 2026-01-03
 * @related
 *   - js/ux/accessibility.js → Accessibility specifications to test
 *   - js/ux/language-register.js → Register system to verify
 *   - js/ux/data-integrity.js → Data integrity rules to validate
 *   - tests/ → Test file locations
 */

'use strict';

// ════════════════════════════════════════════════════════════════════════════
// SECTION 1: TESTING CONFIGURATION
// ════════════════════════════════════════════════════════════════════════════

/**
 * Core testing configuration for Quannex.
 *
 * Defines frameworks, locations, and overall strategy.
 */
const TESTING_CONFIG = {
    // Philosophy behind our testing approach
    philosophy: {
        statement: 'Tests are documentation of expected behavior',
        principle: 'A failing test tells a story about what broke',
        goal: 'Confidence in every deployment'
    },

    // Framework choices
    frameworks: {
        unit: 'Vitest',
        integration: 'Playwright',
        accessibility: 'axe-core',
        performance: 'Lighthouse'
    },

    // Directory structure
    locations: {
        unit: 'tests/unit/',
        integration: 'tests/integration/',
        e2e: 'tests/e2e/',
        fixtures: 'tests/fixtures/',
        snapshots: 'tests/__snapshots__/'
    },

    // Coverage thresholds
    coverage: {
        statements: 80,
        branches: 75,
        functions: 80,
        lines: 80,

        // Critical modules require higher coverage
        criticalModules: {
            'js/main.js': 90,
            'js/constants/phi-harmonics.js': 95,
            'js/ux/data-integrity.js': 90,
            'js/ux/language-register.js': 85
        }
    },

    // Dodecahedron complexity
    complexity: {
        faces: 12,
        elements: 5,
        registers: 3,
        totalCombinations: 12 * 5 * 3, // 180 face/element/register combinations
        edges: 30,
        vertices: 20,
        breathAxes: 6,
        note: 'Comprehensive testing must consider geometric completeness'
    }
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 2: UNIT TEST STRATEGY
// ════════════════════════════════════════════════════════════════════════════

/**
 * Unit test priorities and structure.
 *
 * Unit tests isolate individual functions and verify their behavior.
 */
const UNIT_TEST_STRATEGY = {

    // ─────────────────────────────────────────────────────────────────────────
    // 2.1: Priority Levels
    // ─────────────────────────────────────────────────────────────────────────

    priorities: {
        critical: {
            description: 'Must have 95%+ coverage, tested on every commit',
            modules: [
                {
                    name: 'PHI constant calculations',
                    path: 'js/constants/phi-harmonics.js',
                    tests: [
                        'PHI value is accurate to 15 decimal places',
                        'PHI^n calculations maintain precision',
                        'Derived constants (η, θ, ε) are correct',
                        'No floating point errors in key ratios'
                    ]
                },
                {
                    name: 'Content transformation functions',
                    path: 'js/ux/language-register.js',
                    tests: [
                        'Each register transforms content correctly',
                        'Numbers are NEVER transformed',
                        'Transformations are reversible',
                        'Missing patterns fall back gracefully'
                    ]
                },
                {
                    name: 'Data validation',
                    path: 'js/ux/data-integrity.js',
                    tests: [
                        'Invalid data is rejected',
                        'Valid data passes through unchanged',
                        'Edge cases (null, undefined, empty) handled',
                        'PHI constants cannot be mutated'
                    ]
                },
                {
                    name: 'Formula normalization',
                    path: 'js/main.js',
                    tests: [
                        'Coherence formulas produce expected results',
                        'Edge tension calculations are bounded 0-1',
                        'Vertex vortex calculations follow topology',
                        'Global coherence aggregates correctly'
                    ]
                }
            ]
        },

        high: {
            description: '85%+ coverage, tested on PR',
            modules: [
                {
                    name: 'Register switching logic',
                    path: 'js/ux/language-register.js',
                    tests: [
                        'State persists across page navigations',
                        'Local storage sync works correctly',
                        'Invalid register defaults to balanced',
                        'Change events fire correctly'
                    ]
                },
                {
                    name: 'Navigation state management',
                    path: 'js/navigation/',
                    tests: [
                        'Breadcrumb state updates correctly',
                        'Deep linking preserves context',
                        'History navigation works'
                    ]
                },
                {
                    name: 'Error recovery functions',
                    path: 'js/ux/data-integrity.js',
                    tests: [
                        'Rollback restores previous state',
                        'Recovery doesn\'t lose user data',
                        'Error boundaries catch failures'
                    ]
                }
            ]
        },

        medium: {
            description: '70%+ coverage, tested on release',
            modules: [
                {
                    name: 'Tooltip content generation',
                    tests: ['Tooltips reflect current register', 'Dynamic content updates']
                },
                {
                    name: 'Animation timing',
                    tests: ['Animations respect reduced motion', 'Durations are configurable']
                },
                {
                    name: 'Local storage persistence',
                    tests: ['Preferences saved correctly', 'Migrations run on version change']
                }
            ]
        }
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 2.2: Test Structure
    // ─────────────────────────────────────────────────────────────────────────

    structure: {
        pattern: 'Arrange-Act-Assert',
        naming: 'should [expected behavior] when [condition]',
        example: `
describe('ContentTransformer', () => {
    describe('transform()', () => {
        it('should replace "shadow" with "area for attention" when register is analytical', () => {
            // Arrange
            const content = 'This face has a shadow in productivity';
            const register = 'analytical';

            // Act
            const result = ContentTransformer.transform(content, register);

            // Assert
            expect(result).toBe('This face has an area for attention in productivity');
        });

        it('should NEVER transform numeric values regardless of register', () => {
            // Arrange
            const content = 'Coherence: 0.78';

            // Act - test all registers
            const results = ['analytical', 'balanced', 'contemplative']
                .map(r => ContentTransformer.transform(content, r));

            // Assert - all should preserve the number
            results.forEach(result => {
                expect(result).toContain('0.78');
            });
        });
    });
});
`
    }
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 3: INTEGRATION TESTS
// ════════════════════════════════════════════════════════════════════════════

/**
 * Integration test specifications for major user flows.
 */
const INTEGRATION_TESTS = {
    framework: 'Playwright',
    location: 'tests/integration/',

    // ─────────────────────────────────────────────────────────────────────────
    // 3.1: User Flows
    // ─────────────────────────────────────────────────────────────────────────

    flows: {
        onboarding: {
            name: 'User Onboarding Flow',
            description: 'Test onboarding experience across all registers',
            steps: [
                'Navigate to landing page',
                'Select register preference',
                'Complete tutorial steps',
                'Verify dashboard loads correctly'
            ],
            variants: ['analytical', 'balanced', 'contemplative'],
            assertions: [
                'Register choice persists',
                'Tutorial content matches register',
                'Progress is saved'
            ]
        },

        dashboardToDetail: {
            name: 'Dashboard to Face Detail Flow',
            description: 'Navigation from dashboard to individual face and element',
            steps: [
                'Load dashboard',
                'Click on face {n}',
                'Verify face detail loads',
                'Click on element {element}',
                'Verify element detail loads'
            ],
            parameters: {
                n: [1, 6, 12], // Test first, middle, last
                element: ['earth', 'water', 'fire', 'air', 'ether']
            },
            assertions: [
                'Data consistency between views',
                'Breadcrumbs update correctly',
                'Back navigation works'
            ]
        },

        ritualFlow: {
            name: 'Ritual Start to Complete Flow',
            description: 'Test ritual experience from start to save',
            steps: [
                'Start ritual from context menu',
                'Progress through all steps',
                'Enter reflection text',
                'Save and verify confirmation'
            ],
            assertions: [
                'Timer works correctly',
                'Progress indicator updates',
                'Reflection saves to storage',
                'Can resume interrupted ritual'
            ]
        },

        exportFlow: {
            name: 'Export PDF Flow',
            description: 'Generate export in each register format',
            steps: [
                'Navigate to export options',
                'Select format (PDF)',
                'Choose register for export',
                'Generate and verify'
            ],
            variants: ['analytical', 'balanced', 'contemplative'],
            assertions: [
                'Numbers match source data',
                'Language matches selected register',
                'Export downloads successfully'
            ]
        },

        errorRecovery: {
            name: 'Error to Recovery Flow',
            description: 'Verify graceful error handling and recovery',
            steps: [
                'Simulate network failure',
                'Verify error message displays',
                'Attempt recovery action',
                'Verify successful recovery'
            ],
            errorTypes: ['network', 'validation', 'calculation'],
            assertions: [
                'Error message is clear and actionable',
                'Recovery preserves user state',
                'No data loss occurs'
            ]
        }
    }
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 4: REGISTER-SPECIFIC TESTS
// ════════════════════════════════════════════════════════════════════════════

/**
 * Testing strategy specifically for the language register system.
 */
const REGISTER_TESTS = {

    // ─────────────────────────────────────────────────────────────────────────
    // 4.1: Matrix Testing
    // ─────────────────────────────────────────────────────────────────────────

    matrixTesting: {
        description: 'Every feature tested in all 3 registers',
        automation: 'Parameterized tests with register as variable',

        example: `
// Parameterized test example
const registers = ['analytical', 'balanced', 'contemplative'];

registers.forEach(register => {
    describe(\`Dashboard in \${register} register\`, () => {
        beforeEach(() => {
            setRegister(register);
        });

        it('should display coherence value correctly', () => {
            // Test implementation
        });

        it('should show appropriate terminology', () => {
            // Verify language matches register
        });
    });
});
`
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 4.2: Transformation Tests
    // ─────────────────────────────────────────────────────────────────────────

    transformationTests: {
        description: 'Verify content transforms correctly per register',
        cases: [
            {
                input: 'shadow',
                expected: {
                    analytical: 'area for attention',
                    balanced: 'attention area',
                    contemplative: 'shadow'
                }
            },
            {
                input: 'blessing',
                expected: {
                    analytical: null, // Removed in analytical
                    balanced: 'positive aspect',
                    contemplative: 'blessing'
                }
            },
            {
                input: 'coherence',
                expected: {
                    analytical: 'alignment score',
                    balanced: 'coherence',
                    contemplative: 'coherence'
                }
            },
            {
                input: '0.78',
                expected: {
                    analytical: '0.78',
                    balanced: '0.78',
                    contemplative: '0.78'
                },
                note: 'Numbers NEVER transform'
            }
        ]
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 4.3: Regression Tests
    // ─────────────────────────────────────────────────────────────────────────

    regressionTests: {
        description: 'Verify register change doesn\'t break data',
        cases: [
            {
                name: 'Switch register mid-session',
                steps: [
                    'Load dashboard in analytical',
                    'View face 1 details',
                    'Switch to contemplative',
                    'Verify data values unchanged'
                ],
                critical: true
            },
            {
                name: 'Export in different register',
                steps: [
                    'Generate analysis in balanced',
                    'Export as analytical PDF',
                    'Verify numbers match exactly'
                ],
                critical: true
            },
            {
                name: 'Save reflection, switch register',
                steps: [
                    'Write reflection in contemplative',
                    'Save reflection',
                    'Switch to analytical',
                    'Verify reflection still readable'
                ],
                critical: false
            }
        ]
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 4.4: Golden Rule Tests
    // ─────────────────────────────────────────────────────────────────────────

    goldenRuleTests: {
        rule: 'Same mathematics. Same geometry. Different language.',
        tests: [
            {
                name: 'Coherence value consistency',
                assertion: 'Face coherence is identical across all registers',
                implementation: `
test('coherence value is identical across registers', () => {
    const face = loadFace(1);
    const registers = ['analytical', 'balanced', 'contemplative'];

    const values = registers.map(r => {
        setRegister(r);
        return getDisplayedCoherence(face);
    });

    expect(values[0]).toBe(values[1]);
    expect(values[1]).toBe(values[2]);
});
`
            },
            {
                name: 'Edge tension consistency',
                assertion: 'Edge calculations identical regardless of register'
            },
            {
                name: 'Global coherence consistency',
                assertion: 'Global coherence unchanged by register selection'
            }
        ]
    }
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 5: ACCESSIBILITY TESTS
// ════════════════════════════════════════════════════════════════════════════

/**
 * Accessibility testing specifications for WCAG 2.1 AA compliance.
 */
const ACCESSIBILITY_TESTS = {

    // ─────────────────────────────────────────────────────────────────────────
    // 5.1: Automated Testing
    // ─────────────────────────────────────────────────────────────────────────

    automated: {
        tool: 'axe-core',
        integration: 'Run on every page in CI pipeline',
        threshold: 'Zero violations at AA level',

        configuration: {
            runOn: ['commit', 'pr', 'deploy'],
            rules: 'wcag21aa',
            reporter: 'v2',
            resultTypes: ['violations', 'incomplete']
        },

        implementation: `
// Playwright + axe-core integration
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
    test('should have no WCAG 2.1 AA violations', async ({ page }) => {
        await page.goto('/');

        const results = await new AxeBuilder({ page })
            .withTags(['wcag21aa'])
            .analyze();

        expect(results.violations).toHaveLength(0);
    });
});
`
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 5.2: Manual Testing Checklist
    // ─────────────────────────────────────────────────────────────────────────

    manual: {
        screenReader: {
            frequency: 'Monthly',
            tools: ['NVDA (Windows)', 'VoiceOver (macOS)'],
            checklist: [
                'All interactive elements announced correctly',
                'Page structure (landmarks) navigable',
                'Dynamic content updates announced',
                '3D model has accessible alternative',
                'Form labels properly associated'
            ]
        },

        keyboard: {
            frequency: 'Monthly',
            checklist: [
                'All functionality accessible via keyboard',
                'Focus visible on all elements',
                'No keyboard traps',
                'Logical tab order',
                'Skip link works'
            ]
        },

        colorContrast: {
            frequency: 'On design changes',
            checklist: [
                'Text meets 4.5:1 ratio (normal text)',
                'Text meets 3:1 ratio (large text)',
                'UI components meet 3:1 ratio',
                'All register palettes verified'
            ]
        }
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 5.3: Page-Specific Tests
    // ─────────────────────────────────────────────────────────────────────────

    pageTests: {
        dashboard: [
            'Face cards are keyboard navigable',
            'Coherence values have text alternatives',
            'Charts have aria descriptions'
        ],
        dodecahedron3d: [
            'Alternative list/table view available',
            'Keyboard controls for rotation',
            'Face selection announced',
            'Reduced motion alternative works'
        ],
        breathAnalysis: [
            'Axis pairs clearly labeled',
            'Flow visualizations have text alternatives'
        ]
    }
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 6: PERFORMANCE TESTS
// ════════════════════════════════════════════════════════════════════════════

/**
 * Performance testing specifications.
 */
const PERFORMANCE_TESTS = {

    // ─────────────────────────────────────────────────────────────────────────
    // 6.1: Lighthouse Thresholds
    // ─────────────────────────────────────────────────────────────────────────

    lighthouse: {
        threshold: {
            performance: 90,
            accessibility: 100, // Non-negotiable
            bestPractices: 90,
            seo: 80
        },
        runOn: 'Every PR',

        configuration: {
            device: 'desktop',
            throttling: 'simulated',
            formFactor: 'desktop'
        },

        criticalPages: [
            '/',
            '/pages/dodecahedron-3d.html',
            '/pages/breath-analysis.html',
            '/pages/results-summary.html'
        ]
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 6.2: Core Web Vitals
    // ─────────────────────────────────────────────────────────────────────────

    coreWebVitals: {
        LCP: { threshold: 2500, unit: 'ms', name: 'Largest Contentful Paint' },
        FID: { threshold: 100, unit: 'ms', name: 'First Input Delay' },
        CLS: { threshold: 0.1, unit: 'score', name: 'Cumulative Layout Shift' }
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 6.3: Load Testing
    // ─────────────────────────────────────────────────────────────────────────

    loadTesting: {
        tool: 'k6',
        runOn: 'Before major releases',

        scenarios: {
            normal: {
                vus: 10,
                duration: '1m',
                description: 'Normal expected load'
            },
            stress: {
                vus: 100,
                duration: '5m',
                description: '10x normal load'
            },
            spike: {
                stages: [
                    { vus: 10, duration: '30s' },
                    { vus: 200, duration: '1m' },
                    { vus: 10, duration: '30s' }
                ],
                description: 'Sudden spike in traffic'
            }
        },

        thresholds: {
            http_req_duration: ['p(95)<500'],
            http_req_failed: ['rate<0.01']
        }
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 6.4: 3D Performance
    // ─────────────────────────────────────────────────────────────────────────

    threeDPerformance: {
        targetFPS: 60,
        minimumFPS: 30,
        memoryLimit: '100MB',

        tests: [
            'Initial render under 1s',
            'Rotation maintains 60fps',
            'Face selection under 100ms',
            'Memory stable over 10min session'
        ]
    }
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 7: MOCK ORGANIZATIONS
// ════════════════════════════════════════════════════════════════════════════

/**
 * Test data representing various organizational scenarios.
 */
const MOCK_ORGANIZATIONS = {

    // ─────────────────────────────────────────────────────────────────────────
    // 7.1: Healthy Organization
    // ─────────────────────────────────────────────────────────────────────────

    healthy: {
        name: 'Harmony Corp',
        coherence: 0.78,
        profile: 'High coherence, balanced octaves, no shadows',
        useCase: 'Happy path testing',

        faces: {
            // All faces have high coherence
            average: 0.78,
            min: 0.72,
            max: 0.85
        },

        characteristics: {
            breathAxes: 'Balanced',
            shadows: 'None',
            octave: 5, // Integration
            dominant: 'Balanced across all elements'
        }
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 7.2: Struggling Organization
    // ─────────────────────────────────────────────────────────────────────────

    struggling: {
        name: 'Tension Inc',
        coherence: 0.34,
        profile: 'Low coherence, shadow patterns, imbalanced axes',
        useCase: 'Error state testing, shadow detection',

        faces: {
            average: 0.34,
            min: 0.15,
            max: 0.52
        },

        characteristics: {
            breathAxes: 'Severely imbalanced',
            shadows: ['Face 3', 'Face 7', 'Face 11'],
            octave: 2, // Survival
            dominant: 'Earth (stuck in material concerns)'
        }
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 7.3: Transitioning Organization
    // ─────────────────────────────────────────────────────────────────────────

    transitioning: {
        name: 'Chrysalis LLC',
        coherence: 0.55,
        profile: 'Mid-transition between octaves, liminal state',
        useCase: 'Octave transition testing',

        faces: {
            average: 0.55,
            min: 0.40,
            max: 0.70
        },

        characteristics: {
            breathAxes: 'Some tension, active rebalancing',
            shadows: ['Face 5'],
            octave: '3→4', // Transitioning from Personal to Social
            dominant: 'Fire (transformative energy high)'
        }
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 7.4: Edge Case Organization
    // ─────────────────────────────────────────────────────────────────────────

    edge: {
        name: 'Edge Cases Ltd',
        coherence: 0.618, // Exactly PHI threshold
        profile: 'Boundary values, edge conditions',
        useCase: 'Boundary testing',

        faces: {
            average: 0.618,
            min: 0.000001, // Near-zero
            max: 0.999999  // Near-one
        },

        characteristics: {
            breathAxes: 'Perfect symmetry',
            shadows: [],
            octave: 4, // Social
            dominant: 'None (perfectly balanced)',
            specialCases: [
                'Face 1: coherence = 0.000001',
                'Face 12: coherence = 0.999999',
                'Face 6: coherence = PHI exactly'
            ]
        }
    }
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 8: CONTENT FIXTURES
// ════════════════════════════════════════════════════════════════════════════

/**
 * Content test fixtures for various testing scenarios.
 */
const CONTENT_FIXTURES = {

    // ─────────────────────────────────────────────────────────────────────────
    // 8.1: Register Content
    // ─────────────────────────────────────────────────────────────────────────

    allRegisters: {
        description: 'Sample content in all 3 registers',
        content: {
            analytical: 'Face 1 shows a 78% alignment score with an area for attention in productivity metrics.',
            balanced: 'Face 1 has 78% coherence with an attention area in productivity.',
            contemplative: 'Face 1 radiates at 78% coherence, with a shadow calling for attention in productivity.'
        }
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 8.2: Edge Case Content
    // ─────────────────────────────────────────────────────────────────────────

    longContent: {
        description: 'Very long text for overflow testing',
        length: 10000,
        generator: () => 'Lorem ipsum '.repeat(1000)
    },

    specialChars: {
        description: 'Content with emojis, symbols, and unicode',
        content: '🌟 Coherence™ is ≥ 0.618 (φ) with «special» & "quoted" content — including em-dash'
    },

    empty: {
        description: 'Empty/null/undefined values',
        variants: {
            empty: '',
            null: null,
            undefined: undefined,
            whitespace: '   ',
            newlines: '\n\n\n'
        }
    },

    maxValues: {
        description: 'Maximum length strings, max numbers',
        maxString: 'a'.repeat(65535),
        maxNumber: Number.MAX_SAFE_INTEGER,
        minNumber: Number.MIN_SAFE_INTEGER,
        precision: 0.123456789012345678901234567890
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 8.3: PHI-Specific Fixtures
    // ─────────────────────────────────────────────────────────────────────────

    phiValues: {
        description: 'PHI-related test values',
        phi: 1.618033988749895,
        phiInverse: 0.618033988749895,
        phiSquared: 2.618033988749895,
        phiMinusTwo: 0.381966011250105,
        phiMinusThree: 0.236067977499790
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 8.4: Geometry Fixtures
    // ─────────────────────────────────────────────────────────────────────────

    dodecahedronTopology: {
        vertices: 20,
        edges: 30,
        faces: 12,
        eulerCharacteristic: 2, // V - E + F = 20 - 30 + 12 = 2
        breathAxes: 6,
        elementsPerFace: 5
    }
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 9: TEST RUNNER UTILITIES
// ════════════════════════════════════════════════════════════════════════════

/**
 * Test execution utilities and helpers.
 */
const TestRunner = {

    // ─────────────────────────────────────────────────────────────────────────
    // 9.1: Mock Helpers
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Get mock organization by profile type.
     */
    getMockOrg: function(type) {
        return MOCK_ORGANIZATIONS[type] || MOCK_ORGANIZATIONS.healthy;
    },

    /**
     * Generate face data for a mock organization.
     */
    generateFaceData: function(org, faceNumber) {
        const baseCoherence = org.faces.average;
        const variance = (org.faces.max - org.faces.min) / 2;
        const randomOffset = (Math.random() - 0.5) * variance;

        return {
            id: faceNumber,
            name: `Face ${faceNumber}`,
            coherence: Math.max(0, Math.min(1, baseCoherence + randomOffset)),
            elements: {
                earth: Math.random(),
                water: Math.random(),
                fire: Math.random(),
                air: Math.random(),
                ether: Math.random()
            }
        };
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 9.2: Assertion Helpers
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Assert PHI-based value is within acceptable tolerance.
     */
    assertPHIValue: function(actual, expected, tolerance = 0.0000001) {
        const diff = Math.abs(actual - expected);
        return diff < tolerance;
    },

    /**
     * Assert coherence value is valid (between 0 and 1).
     */
    assertValidCoherence: function(value) {
        return typeof value === 'number' &&
               !isNaN(value) &&
               value >= 0 &&
               value <= 1;
    },

    /**
     * Assert content transformation preserves numbers.
     */
    assertNumbersPreserved: function(original, transformed) {
        const numberPattern = /\d+(\.\d+)?/g;
        const originalNumbers = original.match(numberPattern) || [];
        const transformedNumbers = transformed.match(numberPattern) || [];

        return JSON.stringify(originalNumbers) === JSON.stringify(transformedNumbers);
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 9.3: Register Testing Helpers
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Run a test across all registers.
     */
    testAllRegisters: function(testFn) {
        const registers = ['analytical', 'balanced', 'contemplative'];
        const results = {};

        registers.forEach(register => {
            results[register] = testFn(register);
        });

        return results;
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 9.4: Accessibility Testing Helpers
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Generate axe-core configuration.
     */
    getAxeConfig: function() {
        return {
            runOnly: {
                type: 'tag',
                values: ['wcag21aa']
            },
            rules: {
                'color-contrast': { enabled: true },
                'valid-lang': { enabled: true }
            }
        };
    }
};

// ════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════════════════

// CommonJS export for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TESTING_CONFIG,
        UNIT_TEST_STRATEGY,
        INTEGRATION_TESTS,
        REGISTER_TESTS,
        ACCESSIBILITY_TESTS,
        PERFORMANCE_TESTS,
        MOCK_ORGANIZATIONS,
        CONTENT_FIXTURES,
        TestRunner
    };
}

// Browser global export
if (typeof window !== 'undefined') {
    window.QuannexTesting = {
        TESTING_CONFIG,
        UNIT_TEST_STRATEGY,
        INTEGRATION_TESTS,
        REGISTER_TESTS,
        ACCESSIBILITY_TESTS,
        PERFORMANCE_TESTS,
        MOCK_ORGANIZATIONS,
        CONTENT_FIXTURES,
        TestRunner
    };
}

// ════════════════════════════════════════════════════════════════════════════
// END OF TESTING STRATEGY
// ════════════════════════════════════════════════════════════════════════════
