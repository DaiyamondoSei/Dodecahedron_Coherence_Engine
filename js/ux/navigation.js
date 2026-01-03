/**
 * ════════════════════════════════════════════════════════════════════════════
 * BIDIRECTIONAL NAVIGABILITY SYSTEM - WAYFINDING FOR QUANNEX
 * ════════════════════════════════════════════════════════════════════════════
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                         NOTES FOR FUTURE CLAUDE                         │
 * │                                                                         │
 * │  Every element in Quannex knows where it lives, who its neighbors are,  │
 * │  and how to guide users home. Navigation is not just wayfinding—it's    │
 * │  an expression of the interconnected nature of the dodecahedron.        │
 * │                                                                         │
 * │  KEY INSIGHT: The dodecahedron has no dead ends. Every face connects    │
 * │  to 5 others, every edge bridges 2 faces, every vertex unites 3.        │
 * │  Navigation should reflect this inherent connectivity.                  │
 * │                                                                         │
 * │  TOPOLOGY: V=20, E=30, F=12. Navigation paths mirror geometry.          │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                             NAVIGATION MAP                                ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║  1. NAVIGATION_CONFIG        → Core navigation configuration             ║
 * ║  2. BREADCRUMB_SYSTEM        → "Where am I?" orientation                 ║
 * ║  3. CONTEXTUAL_NAVIGATION    → Related items and neighbors               ║
 * ║  4. CROSS_REFERENCES         → Code ↔ Docs ↔ UI connections              ║
 * ║  5. DEEP_LINKING             → Shareable URLs with state                 ║
 * ║  6. QUICK_JUMP               → Keyboard navigation (Cmd+K)               ║
 * ║  7. DOC_NAVIGATION           → Documentation-specific navigation         ║
 * ║  8. NavigationManager        → Runtime navigation utilities              ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 *
 * @author Deimantas Murauskas & Claude (Opus 4.5)
 * @thesis Organizational Coherence Through Sacred Geometry
 * @created 2026-01-03
 * @related
 *   - docs/DOCUMENTATION_INDEX.md → Navigation hub for documentation
 *   - js/ux/accessibility.js → Keyboard navigation accessibility
 *   - pages/dodecahedron-3d.html → 3D spatial navigation
 *   - docs/BREATH_AXIS_REFERENCE.md → Polarity-based navigation
 */

'use strict';

// ════════════════════════════════════════════════════════════════════════════
// SECTION 1: NAVIGATION CONFIGURATION
// ════════════════════════════════════════════════════════════════════════════

/**
 * Core navigation configuration for Quannex.
 */
const NAVIGATION_CONFIG = {
    philosophy: {
        statement: 'Navigation reflects the interconnected nature of the dodecahedron',
        principle: 'No dead ends—every path leads somewhere meaningful',
        goal: 'Users always know where they are and how to get where they want to go'
    },

    // Dodecahedron topology informs navigation
    topology: {
        faces: 12,
        edges: 30,
        vertices: 20,
        facesPerVertex: 3,
        edgesPerFace: 5,
        breathAxes: 6,
        insight: 'Every face connects to 5 others, every edge bridges 2, every vertex unites 3'
    },

    // Navigation state persistence
    persistence: {
        storage: 'localStorage',
        prefix: 'quannex.nav.',
        items: ['lastVisited', 'favorites', 'recentSearches', 'expandedSections', 'scrollPositions']
    }
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 2: BREADCRUMB SYSTEM
// ════════════════════════════════════════════════════════════════════════════

/**
 * Breadcrumb navigation system - "Where am I?"
 */
const BREADCRUMB_SYSTEM = {
    structure: 'Home > {Section} > {Subsection} > {Current}',
    clickable: true, // Each segment is navigable
    separator: ' > ',

    // ─────────────────────────────────────────────────────────────────────────
    // 2.1: Route Definitions
    // ─────────────────────────────────────────────────────────────────────────

    routes: {
        dashboard: {
            path: '/',
            breadcrumb: ['Dashboard'],
            title: 'Organizational Coherence Dashboard'
        },
        faceDetail: {
            path: '/faces/:id',
            breadcrumb: ['Dashboard', 'Domains', '{faceName}'],
            title: '{faceName} - Domain Detail'
        },
        elementDetail: {
            path: '/faces/:faceId/elements/:element',
            breadcrumb: ['Dashboard', 'Domains', '{faceName}', '{elementName}'],
            title: '{elementName} - Element Detail'
        },
        edgeView: {
            path: '/edges/:id',
            breadcrumb: ['Dashboard', 'Interfaces', '{edgeId}'],
            title: '{edgeId} - Edge Interface'
        },
        vertexView: {
            path: '/vertices/:id',
            breadcrumb: ['Dashboard', 'Convergences', '{vertexId}: {archetype}'],
            title: '{vertexId} - Vertex Vortex'
        },
        breathAnalysis: {
            path: '/breath-analysis',
            breadcrumb: ['Dashboard', 'Breath Axes'],
            title: 'Breath Axis Analysis'
        },
        resultsSummary: {
            path: '/results-summary',
            breadcrumb: ['Dashboard', 'Results'],
            title: 'Results Summary'
        },
        dodecahedron3d: {
            path: '/dodecahedron-3d',
            breadcrumb: ['Dashboard', '3D Visualization'],
            title: '3D Dodecahedron'
        },
        settings: {
            path: '/settings/:section?',
            breadcrumb: ['Settings', '{sectionName}'],
            title: 'Settings - {sectionName}'
        },
        ritual: {
            path: '/rituals/:ritual/:step?',
            breadcrumb: ['Rituals', '{ritualName}', 'Step {step} of {total}'],
            title: '{ritualName} - Step {step}'
        }
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 2.2: Mobile Collapse
    // ─────────────────────────────────────────────────────────────────────────

    mobileCollapse: {
        threshold: 3, // Collapse if more than 3 segments
        pattern: '... > {Parent} > {Current}',
        expandable: true // Tap to expand full breadcrumb
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 2.3: Breadcrumb Generation
    // ─────────────────────────────────────────────────────────────────────────

    generate: function(route, params = {}) {
        const routeConfig = this.routes[route];
        if (!routeConfig) return ['Dashboard'];

        return routeConfig.breadcrumb.map(segment => {
            // Replace placeholders with actual values
            return segment.replace(/{(\w+)}/g, (match, key) => {
                return params[key] || match;
            });
        });
    },

    toHTML: function(breadcrumbs, currentPath) {
        return breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            if (isLast) {
                return `<span class="breadcrumb-current" aria-current="page">${crumb}</span>`;
            }
            return `<a href="${this.getPathForCrumb(crumb)}" class="breadcrumb-link">${crumb}</a>`;
        }).join(`<span class="breadcrumb-separator" aria-hidden="true">${this.separator}</span>`);
    },

    getPathForCrumb: function(crumb) {
        // Simplified path resolution
        const pathMap = {
            'Dashboard': '/',
            'Domains': '/faces',
            'Interfaces': '/edges',
            'Convergences': '/vertices',
            'Settings': '/settings',
            'Rituals': '/rituals'
        };
        return pathMap[crumb] || '/';
    }
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 3: CONTEXTUAL NAVIGATION
// ════════════════════════════════════════════════════════════════════════════

/**
 * Related items and neighbor navigation based on dodecahedron topology.
 */
const CONTEXTUAL_NAVIGATION = {

    // ─────────────────────────────────────────────────────────────────────────
    // 3.1: Face View Navigation
    // ─────────────────────────────────────────────────────────────────────────

    faceView: {
        showRelated: [
            { type: 'adjacentFaces', count: 5, label: 'Adjacent Domains' },
            { type: 'connectedEdges', count: 5, label: 'Connected Interfaces' },
            { type: 'associatedVertices', count: 5, label: 'Associated Vertices' },
            { type: 'opposingFace', count: 1, label: 'Breath Axis Partner' },
            { type: 'sameOctaveFaces', label: 'Same Octave' }
        ],
        navigationPattern: 'sidebar-panel', // or 'inline-chips'

        getRelated: function(faceId, topology) {
            return {
                adjacentFaces: topology.getAdjacentFaces(faceId),
                connectedEdges: topology.getEdgesForFace(faceId),
                associatedVertices: topology.getVerticesForFace(faceId),
                opposingFace: topology.getOpposingFace(faceId),
                sameOctaveFaces: topology.getSameOctaveFaces(faceId)
            };
        }
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 3.2: Edge View Navigation
    // ─────────────────────────────────────────────────────────────────────────

    edgeView: {
        showRelated: [
            { type: 'connectedFaces', count: 2, label: 'Connected Domains' },
            { type: 'adjacentEdges', count: 4, label: 'Adjacent Interfaces' },
            { type: 'terminalVertices', count: 2, label: 'Terminal Vertices' },
            { type: 'exchangeTypeSiblings', label: 'Same Exchange Type' }
        ],

        getRelated: function(edgeId, topology) {
            return {
                connectedFaces: topology.getFacesForEdge(edgeId),
                adjacentEdges: topology.getAdjacentEdges(edgeId),
                terminalVertices: topology.getVerticesForEdge(edgeId),
                exchangeTypeSiblings: topology.getEdgesByExchangeType(edgeId)
            };
        }
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 3.3: Vertex View Navigation
    // ─────────────────────────────────────────────────────────────────────────

    vertexView: {
        showRelated: [
            { type: 'convergingFaces', count: 3, label: 'Converging Domains' },
            { type: 'connectedEdges', count: 3, label: 'Connected Interfaces' },
            { type: 'adjacentVertices', label: 'Adjacent Vertices' },
            { type: 'sameLatitudeVertices', label: 'Same Latitude' },
            { type: 'sameClassificationVertices', label: 'Same Classification' }
        ],

        getRelated: function(vertexId, topology) {
            return {
                convergingFaces: topology.getFacesForVertex(vertexId),
                connectedEdges: topology.getEdgesForVertex(vertexId),
                adjacentVertices: topology.getAdjacentVertices(vertexId),
                sameLatitudeVertices: topology.getSameLatitudeVertices(vertexId),
                sameClassificationVertices: topology.getSameClassificationVertices(vertexId)
            };
        }
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 3.4: Related Items Component
    // ─────────────────────────────────────────────────────────────────────────

    renderRelatedItems: function(type, items, options = {}) {
        const pattern = options.pattern || 'chips';

        if (pattern === 'chips') {
            return `
                <div class="related-items related-items--chips" role="navigation" aria-label="Related ${type}">
                    ${items.map(item => `
                        <a href="${item.path}" class="related-chip" data-type="${type}">
                            ${item.icon ? `<span class="chip-icon">${item.icon}</span>` : ''}
                            <span class="chip-label">${item.label}</span>
                            ${item.value ? `<span class="chip-value">${item.value}</span>` : ''}
                        </a>
                    `).join('')}
                </div>
            `;
        }

        return `
            <aside class="related-items related-items--sidebar" role="complementary" aria-label="Related ${type}">
                <h3 class="related-heading">${type}</h3>
                <ul class="related-list">
                    ${items.map(item => `
                        <li class="related-item">
                            <a href="${item.path}">${item.label}</a>
                            ${item.description ? `<p class="item-description">${item.description}</p>` : ''}
                        </li>
                    `).join('')}
                </ul>
            </aside>
        `;
    }
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 4: CROSS-REFERENCES
// ════════════════════════════════════════════════════════════════════════════

/**
 * Code ↔ Docs ↔ UI cross-reference system.
 */
const CROSS_REFERENCES = {

    // ─────────────────────────────────────────────────────────────────────────
    // 4.1: Code to Documentation
    // ─────────────────────────────────────────────────────────────────────────

    codeToDoc: {
        pattern: '// See: docs/{REFERENCE}.md#section',
        clickable: true, // In IDE with proper tooling

        examples: [
            '// See: docs/EDGE_DYNAMICS_REFERENCE.md#membrane-model',
            '// See: docs/BREATH_AXIS_REFERENCE.md#reception-projection',
            '// See: docs/VERTEX_DYNAMICS_REFERENCE.md#triadic-convergence'
        ],

        generate: function(docPath, section) {
            const base = section ? `${docPath}#${section}` : docPath;
            return `// See: ${base}`;
        }
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 4.2: Documentation to Code
    // ─────────────────────────────────────────────────────────────────────────

    docToCode: {
        pattern: '**Code:** `js/constants/{file}.js:{line}`',

        examples: [
            '**Code:** `js/constants/edge-constants.js:677`',
            '**Code:** `js/main.js:342`',
            '**Code:** `js/constants/phi-harmonics.js:15`'
        ],

        generate: function(filePath, line) {
            return line
                ? `**Code:** \`${filePath}:${line}\``
                : `**Code:** \`${filePath}\``;
        }
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 4.3: UI to Documentation
    // ─────────────────────────────────────────────────────────────────────────

    uiToDoc: {
        helpIcon: true, // ? icon on complex UI elements
        tooltip: 'Learn more about {concept}',
        linkPattern: '/docs/{concept-slug}',

        concepts: {
            coherence: {
                slug: 'coherence',
                doc: 'docs/SYSTEM_COHERENCE_REFERENCE.md',
                tooltip: 'Learn more about coherence calculation'
            },
            breathAxis: {
                slug: 'breath-axis',
                doc: 'docs/BREATH_AXIS_REFERENCE.md',
                tooltip: 'Learn more about breath axes'
            },
            edgeTension: {
                slug: 'edge-tension',
                doc: 'docs/EDGE_DYNAMICS_REFERENCE.md',
                tooltip: 'Learn more about edge tension'
            },
            vertexVortex: {
                slug: 'vertex-vortex',
                doc: 'docs/VERTEX_DYNAMICS_REFERENCE.md',
                tooltip: 'Learn more about vertex vortices'
            },
            phi: {
                slug: 'phi-constants',
                doc: 'docs/PHI_CONSTANTS_REFERENCE.md',
                tooltip: 'Learn more about PHI-derived constants'
            }
        },

        renderHelpIcon: function(concept) {
            const config = this.concepts[concept];
            if (!config) return '';

            return `
                <button class="help-icon"
                        aria-label="${config.tooltip}"
                        data-doc="${config.doc}">
                    <span aria-hidden="true">?</span>
                </button>
            `;
        }
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 4.4: Documentation to UI
    // ─────────────────────────────────────────────────────────────────────────

    docToUi: {
        pattern: '**Try it:** [Open in Quannex](/app/{route})',

        examples: [
            '**Try it:** [View Edge E3-4](/app/edges/E3-4)',
            '**Try it:** [Explore Face 7](/app/faces/7)',
            '**Try it:** [See 3D Visualization](/app/dodecahedron-3d)'
        ],

        generate: function(label, route) {
            return `**Try it:** [${label}](/app${route})`;
        }
    }
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 5: DEEP LINKING
// ════════════════════════════════════════════════════════════════════════════

/**
 * Shareable URLs with full state preservation.
 */
const DEEP_LINKING = {
    structure: '/app/{section}/{id}?{params}',

    // ─────────────────────────────────────────────────────────────────────────
    // 5.1: URL Patterns
    // ─────────────────────────────────────────────────────────────────────────

    patterns: {
        face: '/app/faces/{id}',
        edge: '/app/edges/{id}',
        vertex: '/app/vertices/{id}',
        comparison: '/app/compare',
        ritual: '/app/rituals/{ritual}',
        export: '/app/export'
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 5.2: URL Parameters
    // ─────────────────────────────────────────────────────────────────────────

    params: {
        register: 'r',      // ?r=analytical
        octave: 'o',        // ?o=4
        highlight: 'h',     // ?h=shadow
        view: 'v',          // ?v=3d OR ?v=list
        compare: 'c',       // ?c=1,7,12
        step: 's',          // ?s=3 (ritual step)
        format: 'f'         // ?f=pdf (export format)
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 5.3: URL Building
    // ─────────────────────────────────────────────────────────────────────────

    build: function(pattern, id, options = {}) {
        let url = this.patterns[pattern];
        if (!url) return '/';

        // Replace ID placeholder
        url = url.replace('{id}', id).replace('{ritual}', id);

        // Add query parameters
        const params = new URLSearchParams();
        Object.entries(options).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                const paramKey = this.params[key] || key;
                params.set(paramKey, Array.isArray(value) ? value.join(',') : value);
            }
        });

        const queryString = params.toString();
        return queryString ? `${url}?${queryString}` : url;
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 5.4: URL Parsing
    // ─────────────────────────────────────────────────────────────────────────

    parse: function(url) {
        const urlObj = new URL(url, window.location.origin);
        const path = urlObj.pathname;
        const searchParams = urlObj.searchParams;

        // Extract section and ID from path
        const pathParts = path.split('/').filter(Boolean);
        const section = pathParts[1]; // After /app/
        const id = pathParts[2];

        // Parse query parameters
        const options = {};
        Object.entries(this.params).forEach(([key, param]) => {
            const value = searchParams.get(param);
            if (value) {
                // Handle comma-separated values
                options[key] = value.includes(',') ? value.split(',') : value;
            }
        });

        return { section, id, options };
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 5.5: Sharing
    // ─────────────────────────────────────────────────────────────────────────

    sharing: {
        copyLink: true,
        qrCode: true, // For mobile handoff
        preserveRegister: 'ask-user', // "Share with your language preference?"

        getShareableUrl: function(options = {}) {
            const url = new URL(window.location.href);

            if (options.preserveRegister === false) {
                url.searchParams.delete('r');
            }

            return url.toString();
        },

        copyToClipboard: async function(url) {
            try {
                await navigator.clipboard.writeText(url);
                return { success: true, message: 'Link copied to clipboard' };
            } catch (err) {
                return { success: false, message: 'Failed to copy link' };
            }
        }
    }
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 6: QUICK JUMP
// ════════════════════════════════════════════════════════════════════════════

/**
 * Keyboard-driven quick navigation (Cmd/Ctrl + K).
 */
const QUICK_JUMP = {
    trigger: 'Cmd/Ctrl + K',
    placeholder: 'Jump to...',

    // ─────────────────────────────────────────────────────────────────────────
    // 6.1: Search Scope
    // ─────────────────────────────────────────────────────────────────────────

    searchScope: [
        { type: 'faces', pattern: /^(face\s*)?(\d{1,2})$/i, label: 'Faces by number' },
        { type: 'faces', pattern: /^[a-z]/i, label: 'Faces by name' },
        { type: 'edges', pattern: /^E\d+-\d+$/i, label: 'Edges by ID' },
        { type: 'vertices', pattern: /^V\d+$/i, label: 'Vertices by ID' },
        { type: 'vertices', pattern: /gateway|bridge|crucible|apex/i, label: 'Vertices by archetype' },
        { type: 'constants', pattern: /^[γφηθελζαβκδ]$/i, label: 'Constants by symbol' },
        { type: 'rituals', pattern: /ritual|shadow|threshold|communion/i, label: 'Rituals by name' },
        { type: 'settings', pattern: /^settings?/i, label: 'Settings sections' },
        { type: 'docs', pattern: /^docs?/i, label: 'Documentation pages' }
    ],

    // ─────────────────────────────────────────────────────────────────────────
    // 6.2: Recent Items
    // ─────────────────────────────────────────────────────────────────────────

    recentItems: {
        show: true,
        count: 5,
        label: 'Recent',
        storageKey: 'quannex.nav.recent'
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 6.3: Favorites
    // ─────────────────────────────────────────────────────────────────────────

    favorites: {
        allow: true,
        trigger: 'Star icon OR Cmd/Ctrl+D',
        section: 'Favorites',
        storageKey: 'quannex.nav.favorites',
        maxItems: 20
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 6.4: Search Implementation
    // ─────────────────────────────────────────────────────────────────────────

    search: function(query, options = {}) {
        if (!query) return this.getDefaultResults();

        const results = [];
        const lowerQuery = query.toLowerCase();

        // Check each scope pattern
        for (const scope of this.searchScope) {
            if (scope.pattern.test(query)) {
                const items = this.searchByType(scope.type, query);
                results.push(...items);
            }
        }

        // If no pattern matches, do fuzzy search across all types
        if (results.length === 0) {
            results.push(...this.fuzzySearch(lowerQuery));
        }

        return results.slice(0, options.limit || 10);
    },

    getDefaultResults: function() {
        const results = [];

        // Add favorites first
        if (this.favorites.allow) {
            const favs = this.getFavorites();
            if (favs.length > 0) {
                results.push({ type: 'section', label: this.favorites.section });
                results.push(...favs.slice(0, 3));
            }
        }

        // Add recent items
        if (this.recentItems.show) {
            const recent = this.getRecentItems();
            if (recent.length > 0) {
                results.push({ type: 'section', label: this.recentItems.label });
                results.push(...recent);
            }
        }

        return results;
    },

    searchByType: function(type, query) {
        // Placeholder - would be implemented with actual data
        return [];
    },

    fuzzySearch: function(query) {
        // Placeholder - would implement fuzzy matching
        return [];
    },

    getFavorites: function() {
        if (typeof localStorage === 'undefined') return [];
        const stored = localStorage.getItem(this.favorites.storageKey);
        return stored ? JSON.parse(stored) : [];
    },

    getRecentItems: function() {
        if (typeof localStorage === 'undefined') return [];
        const stored = localStorage.getItem(this.recentItems.storageKey);
        return stored ? JSON.parse(stored) : [];
    },

    addToRecent: function(item) {
        if (typeof localStorage === 'undefined') return;
        const recent = this.getRecentItems();

        // Remove if already exists
        const filtered = recent.filter(r => r.path !== item.path);

        // Add to front
        filtered.unshift(item);

        // Keep only last N items
        const trimmed = filtered.slice(0, this.recentItems.count);

        localStorage.setItem(this.recentItems.storageKey, JSON.stringify(trimmed));
    }
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 7: DOC NAVIGATION
// ════════════════════════════════════════════════════════════════════════════

/**
 * Documentation-specific navigation features.
 */
const DOC_NAVIGATION = {

    // ─────────────────────────────────────────────────────────────────────────
    // 7.1: Required Sections
    // ─────────────────────────────────────────────────────────────────────────

    requiredSections: {
        top: {
            breadcrumb: 'docs > {category} > {document}',
            lastUpdated: true,
            readTime: true,
            relatedDocs: 'chips of 3-5 related documents'
        },

        bottom: {
            seeAlso: 'Related documentation',
            codeReferences: 'Relevant source files',
            changelog: 'Recent changes to this document'
        }
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 7.2: Bidirectional Links
    // ─────────────────────────────────────────────────────────────────────────

    linkTypes: {
        parentOf: { label: 'Parent of', description: 'This doc is the parent of...' },
        childOf: { label: 'Child of', description: 'This doc is a child of...' },
        siblingOf: { label: 'Related', description: 'Related docs at same level...' },
        implements: { label: 'Implements', description: 'Code that implements this concept...' },
        documents: { label: 'Documents', description: 'Docs that explain this code...' },
        supersedes: { label: 'Supersedes', description: 'This replaces older doc...' },
        supersededBy: { label: 'Superseded by', description: 'This was replaced by...' }
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 7.3: Navigation Aids
    // ─────────────────────────────────────────────────────────────────────────

    aids: {
        tableOfContents: {
            position: 'sticky sidebar on desktop, collapsible on mobile',
            highlightCurrent: true,
            collapsible: true
        },

        progressBar: {
            show: true, // for docs > 1000 words
            wordThreshold: 1000,
            position: 'top of viewport'
        },

        scrollSpy: {
            updateUrl: true, // URL reflects current section
            updateToc: true  // TOC highlights current section
        }
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 7.4: Table of Contents Generation
    // ─────────────────────────────────────────────────────────────────────────

    generateTOC: function(content) {
        const headings = content.querySelectorAll('h2, h3, h4');
        const toc = [];

        headings.forEach((heading, index) => {
            const level = parseInt(heading.tagName.charAt(1));
            const id = heading.id || `heading-${index}`;
            heading.id = id;

            toc.push({
                level,
                text: heading.textContent,
                id,
                element: heading
            });
        });

        return toc;
    },

    renderTOC: function(toc) {
        const renderItem = (item) => {
            const indent = (item.level - 2) * 16; // 16px per level
            return `
                <a href="#${item.id}"
                   class="toc-item toc-level-${item.level}"
                   style="padding-left: ${indent}px">
                    ${item.text}
                </a>
            `;
        };

        return `
            <nav class="table-of-contents" aria-label="Table of Contents">
                <h2 class="toc-heading">Contents</h2>
                <div class="toc-items">
                    ${toc.map(renderItem).join('')}
                </div>
            </nav>
        `;
    }
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 8: NAVIGATION MANAGER
// ════════════════════════════════════════════════════════════════════════════

/**
 * Runtime navigation utilities and state management.
 */
const NavigationManager = {

    // ─────────────────────────────────────────────────────────────────────────
    // 8.1: State
    // ─────────────────────────────────────────────────────────────────────────

    state: {
        currentRoute: null,
        history: [],
        scrollPositions: {}
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 8.2: Initialization
    // ─────────────────────────────────────────────────────────────────────────

    init: function() {
        if (typeof window === 'undefined') return this;

        // Set up keyboard shortcuts
        this.setupKeyboardShortcuts();

        // Set up history navigation
        window.addEventListener('popstate', (e) => {
            this.onPopState(e);
        });

        // Track scroll positions
        window.addEventListener('scroll', () => {
            this.saveScrollPosition();
        }, { passive: true });

        // Restore state from storage
        this.restoreState();

        return this;
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 8.3: Keyboard Shortcuts
    // ─────────────────────────────────────────────────────────────────────────

    setupKeyboardShortcuts: function() {
        document.addEventListener('keydown', (e) => {
            // Cmd/Ctrl + K - Quick Jump
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                this.openQuickJump();
            }

            // Cmd/Ctrl + D - Add to Favorites
            if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
                e.preventDefault();
                this.toggleFavorite();
            }

            // Escape - Close modals, back navigation
            if (e.key === 'Escape') {
                this.handleEscape();
            }
        });
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 8.4: Navigation Actions
    // ─────────────────────────────────────────────────────────────────────────

    navigateTo: function(path, options = {}) {
        // Save current scroll position
        this.saveScrollPosition();

        // Track in recent
        QUICK_JUMP.addToRecent({
            path,
            label: options.label || path,
            type: options.type || 'page'
        });

        // Update history
        if (options.replace) {
            history.replaceState(options.state, '', path);
        } else {
            history.pushState(options.state, '', path);
        }

        // Trigger navigation event
        window.dispatchEvent(new CustomEvent('quannex:navigate', {
            detail: { path, options }
        }));
    },

    goBack: function() {
        if (this.state.history.length > 1) {
            history.back();
        } else {
            this.navigateTo('/');
        }
    },

    onPopState: function(e) {
        // Restore scroll position for this route
        const path = window.location.pathname;
        const scrollY = this.state.scrollPositions[path];

        if (scrollY !== undefined) {
            requestAnimationFrame(() => {
                window.scrollTo(0, scrollY);
            });
        }
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 8.5: Scroll Management
    // ─────────────────────────────────────────────────────────────────────────

    saveScrollPosition: function() {
        const path = window.location.pathname;
        this.state.scrollPositions[path] = window.scrollY;
    },

    restoreScrollPosition: function() {
        const path = window.location.pathname;
        const scrollY = this.state.scrollPositions[path];

        if (scrollY !== undefined) {
            window.scrollTo(0, scrollY);
        }
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 8.6: Quick Jump Modal
    // ─────────────────────────────────────────────────────────────────────────

    quickJumpElement: null,

    openQuickJump: function() {
        if (!this.quickJumpElement) {
            this.createQuickJumpModal();
        }
        this.quickJumpElement.classList.add('visible');
        this.quickJumpElement.querySelector('input').focus();
    },

    closeQuickJump: function() {
        if (this.quickJumpElement) {
            this.quickJumpElement.classList.remove('visible');
        }
    },

    createQuickJumpModal: function() {
        const modal = document.createElement('div');
        modal.className = 'quick-jump-modal';
        modal.innerHTML = `
            <div class="quick-jump-content">
                <input type="text"
                       class="quick-jump-input"
                       placeholder="${QUICK_JUMP.placeholder}"
                       aria-label="Quick navigation search">
                <div class="quick-jump-results" role="listbox"></div>
            </div>
        `;

        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeQuickJump();
        });

        const input = modal.querySelector('input');
        input.addEventListener('input', (e) => {
            const results = QUICK_JUMP.search(e.target.value);
            this.renderQuickJumpResults(results);
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeQuickJump();
        });

        document.body.appendChild(modal);
        this.quickJumpElement = modal;
    },

    renderQuickJumpResults: function(results) {
        const container = this.quickJumpElement.querySelector('.quick-jump-results');
        container.innerHTML = results.map(result => {
            if (result.type === 'section') {
                return `<div class="quick-jump-section">${result.label}</div>`;
            }
            return `
                <a href="${result.path}" class="quick-jump-result" role="option">
                    <span class="result-label">${result.label}</span>
                    ${result.description ? `<span class="result-description">${result.description}</span>` : ''}
                </a>
            `;
        }).join('');
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 8.7: Favorites
    // ─────────────────────────────────────────────────────────────────────────

    toggleFavorite: function() {
        const current = {
            path: window.location.pathname,
            label: document.title,
            type: 'page'
        };

        const favorites = QUICK_JUMP.getFavorites();
        const index = favorites.findIndex(f => f.path === current.path);

        if (index >= 0) {
            favorites.splice(index, 1);
            this.announce('Removed from favorites');
        } else {
            favorites.unshift(current);
            if (favorites.length > QUICK_JUMP.favorites.maxItems) {
                favorites.pop();
            }
            this.announce('Added to favorites');
        }

        localStorage.setItem(QUICK_JUMP.favorites.storageKey, JSON.stringify(favorites));
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 8.8: Escape Handler
    // ─────────────────────────────────────────────────────────────────────────

    handleEscape: function() {
        // Close quick jump if open
        if (this.quickJumpElement?.classList.contains('visible')) {
            this.closeQuickJump();
            return;
        }

        // Dispatch event for other modals to handle
        window.dispatchEvent(new CustomEvent('quannex:escape'));
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 8.9: State Persistence
    // ─────────────────────────────────────────────────────────────────────────

    restoreState: function() {
        if (typeof localStorage === 'undefined') return;

        // Restore scroll positions
        const positions = localStorage.getItem('quannex.nav.scrollPositions');
        if (positions) {
            this.state.scrollPositions = JSON.parse(positions);
        }

        // Restore to saved position
        this.restoreScrollPosition();
    },

    saveState: function() {
        if (typeof localStorage === 'undefined') return;

        localStorage.setItem(
            'quannex.nav.scrollPositions',
            JSON.stringify(this.state.scrollPositions)
        );
    },

    // ─────────────────────────────────────────────────────────────────────────
    // 8.10: Announcements (for screen readers)
    // ─────────────────────────────────────────────────────────────────────────

    announce: function(message) {
        // Use accessibility manager if available
        if (typeof window !== 'undefined' && window.QuannexAccessibility) {
            window.QuannexAccessibility.AccessibilityManager.announce(message);
        }
    }
};

// ════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════════════════

// CommonJS export for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        NAVIGATION_CONFIG,
        BREADCRUMB_SYSTEM,
        CONTEXTUAL_NAVIGATION,
        CROSS_REFERENCES,
        DEEP_LINKING,
        QUICK_JUMP,
        DOC_NAVIGATION,
        NavigationManager
    };
}

// Browser global export
if (typeof window !== 'undefined') {
    window.QuannexNavigation = {
        NAVIGATION_CONFIG,
        BREADCRUMB_SYSTEM,
        CONTEXTUAL_NAVIGATION,
        CROSS_REFERENCES,
        DEEP_LINKING,
        QUICK_JUMP,
        DOC_NAVIGATION,
        NavigationManager
    };

    // Auto-initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            NavigationManager.init();
        });
    } else {
        NavigationManager.init();
    }
}

// ════════════════════════════════════════════════════════════════════════════
// END OF BIDIRECTIONAL NAVIGABILITY SYSTEM
// ════════════════════════════════════════════════════════════════════════════
