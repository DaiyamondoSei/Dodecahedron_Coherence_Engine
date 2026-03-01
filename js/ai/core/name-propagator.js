/**
 * ========================================
 * NAME PROPAGATOR - Dynamic Visualization Sync
 * ========================================
 *
 * Subscribes to MappingContext and propagates name changes
 * to all visualization components:
 * - 3D Dodecahedron visualization
 * - Breath Analysis panel
 * - DNA Helix view
 * - Shadow Panel
 * - Calculations view
 *
 * @module NamePropagator
 * @version Sprint 2 - Task 17
 */

import { MappingContext } from './mapping-context.js';

// Target visualization selectors
const VISUALIZATION_TARGETS = {
    dodecahedron: {
        selector: '#dodecahedron-viz, .dodecahedron-container, #three-container',
        faceSelector: '.face-label, [data-face-id]',
        type: '3d'
    },
    breathAnalysis: {
        selector: '#breath-analysis, .breath-panel',
        faceSelector: '.axis-face, [data-axis-face]',
        type: 'panel'
    },
    dnaHelix: {
        selector: '#dna-helix, .dna-viz',
        faceSelector: '.dna-face, [data-dna-face]',
        type: '3d'
    },
    shadowPanel: {
        selector: '#shadow-panel, .shadow-detector',
        faceSelector: '.shadow-face, [data-shadow-face]',
        type: 'panel'
    },
    calculations: {
        selector: '#calculations, .calc-panel',
        faceSelector: '.calc-face, [data-calc-face]',
        type: 'panel'
    },
    kpiMapper: {
        selector: '#kpi-mapper, .kpi-panel',
        faceSelector: '.kpi-face, [data-kpi-face]',
        type: 'panel'
    }
};

// Event types that trigger propagation
const PROPAGATION_EVENTS = [
    'FACE_NAMED',
    'FACE_UPDATED',
    'ALL_FACES_UPDATED',
    'EDGES_NAMED',
    'VERTICES_NAMED',
    'LENS_CHANGED'
];

/**
 * NamePropagator - Syncs names across all visualizations
 */
class NamePropagator {
    constructor(options = {}) {
        this.context = MappingContext.getInstance();
        this.targets = options.targets || VISUALIZATION_TARGETS;
        this.onPropagation = options.onPropagation || (() => {});
        this.debug = options.debug || false;

        this._unsubscribe = null;
        this._lastPropagation = null;
        this._customHandlers = new Map();
    }

    // ========================================
    // INITIALIZATION
    // ========================================

    /**
     * Start listening for context changes
     */
    start() {
        if (this._unsubscribe) {
            Logger.warn('NamePropagator', 'Already started');
            return;
        }

        this._unsubscribe = this.context.subscribe((event) => {
            if (PROPAGATION_EVENTS.includes(event.type)) {
                this._handleEvent(event);
            }
        });

        // Initial propagation
        this._propagateAll();

        this._log('Started');
    }

    /**
     * Stop listening
     */
    stop() {
        if (this._unsubscribe) {
            this._unsubscribe();
            this._unsubscribe = null;
            this._log('Stopped');
        }
    }

    // ========================================
    // EVENT HANDLING
    // ========================================

    /**
     * Handle context events
     */
    _handleEvent(event) {
        this._log('Event received:', event.type);

        switch (event.type) {
            case 'FACE_NAMED':
            case 'FACE_UPDATED':
                this._propagateFace(event.faceId);
                break;

            case 'ALL_FACES_UPDATED':
            case 'LENS_CHANGED':
                this._propagateAll();
                break;

            case 'EDGES_NAMED':
                this._propagateEdges(event.edges);
                break;

            case 'VERTICES_NAMED':
                this._propagateVertices(event.vertices);
                break;
        }

        this._lastPropagation = {
            event: event.type,
            timestamp: Date.now()
        };

        this.onPropagation(event);
    }

    // ========================================
    // PROPAGATION METHODS
    // ========================================

    /**
     * Propagate all face names to all targets
     */
    _propagateAll() {
        const faces = this.context.getAllFaces();
        const edges = this.context.getAllEdges();
        const vertices = this.context.getAllVertices();

        // Update all DOM elements
        faces.forEach(face => this._updateFaceInDOM(face));
        edges.forEach(edge => this._updateEdgeInDOM(edge));
        vertices.forEach(vertex => this._updateVertexInDOM(vertex));

        // Notify custom handlers
        this._customHandlers.forEach((handler, targetId) => {
            handler({
                type: 'full',
                faces: faces.map(f => f.toJSON()),
                edges: edges.map(e => e.toJSON()),
                vertices: vertices.map(v => v.toJSON())
            });
        });

        this._log('Propagated all names');
    }

    /**
     * Propagate a single face update
     */
    _propagateFace(faceId) {
        const face = this.context.getFace(faceId);
        if (!face) return;

        this._updateFaceInDOM(face);

        // Also update connected edges and vertices
        const connectedEdges = this.context.getEdgesForFace(faceId);
        const connectedVertices = this.context.getVerticesForFace(faceId);

        connectedEdges.forEach(edge => this._updateEdgeInDOM(edge));
        connectedVertices.forEach(vertex => this._updateVertexInDOM(vertex));

        // Notify custom handlers
        this._customHandlers.forEach((handler, targetId) => {
            handler({
                type: 'face',
                faceId,
                face: face.toJSON()
            });
        });

        this._log(`Propagated face ${faceId}`);
    }

    /**
     * Propagate edge name updates
     */
    _propagateEdges(edges) {
        edges.forEach(edge => {
            const edgeData = this.context.getEdge(edge.id);
            if (edgeData) {
                this._updateEdgeInDOM(edgeData);
            }
        });

        this._log(`Propagated ${edges.length} edges`);
    }

    /**
     * Propagate vertex name updates
     */
    _propagateVertices(vertices) {
        vertices.forEach(vertex => {
            const vertexData = this.context.getVertex(vertex.id);
            if (vertexData) {
                this._updateVertexInDOM(vertexData);
            }
        });

        this._log(`Propagated ${vertices.length} vertices`);
    }

    // ========================================
    // DOM UPDATES
    // ========================================

    /**
     * Update face elements in DOM
     */
    _updateFaceInDOM(face) {
        // Find all elements with data-face-id matching
        const selectors = [
            `[data-face-id="${face.id}"]`,
            `[data-face="${face.id}"]`,
            `.face-${face.id}`,
            `#face-${face.id}`
        ];

        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                // Update name
                const nameEl = el.querySelector('.face-name, .name') || el;
                if (nameEl.textContent !== face.name) {
                    nameEl.textContent = face.name;
                }

                // Update icon if present
                const iconEl = el.querySelector('.face-icon, .icon');
                if (iconEl && face.icon) {
                    iconEl.textContent = face.icon;
                }

                // Update data attributes
                el.dataset.faceName = face.name;
                el.dataset.faceSource = face.source;

                // Add animation class for visual feedback
                el.classList.add('name-updated');
                setTimeout(() => el.classList.remove('name-updated'), 500);
            });
        });

        // Special handling for 3D visualizations (Three.js)
        this._update3DFaceLabel(face);
    }

    /**
     * Update 3D face label (Three.js integration)
     */
    _update3DFaceLabel(face) {
        // Check for global dodecahedron visualization
        if (window.dodecahedronViz?.updateFaceLabel) {
            window.dodecahedronViz.updateFaceLabel(face.id, face.name, face.icon);
        }

        // Check for DodecahedronVisualization class
        if (window.DodecahedronVisualization?.instance?.updateFaceLabel) {
            window.DodecahedronVisualization.instance.updateFaceLabel(face.id, face.name);
        }

        // Dispatch custom event for any listeners
        document.dispatchEvent(new CustomEvent('quannex:face-updated', {
            detail: { faceId: face.id, name: face.name, icon: face.icon }
        }));
    }

    /**
     * Update edge elements in DOM
     */
    _updateEdgeInDOM(edge) {
        const selectors = [
            `[data-edge-id="${edge.id}"]`,
            `[data-edge="${edge.id}"]`,
            `.edge-${edge.id.replace(/\-/g, '_')}`
        ];

        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                const nameEl = el.querySelector('.edge-name, .name') || el;
                if (nameEl.textContent !== edge.name) {
                    nameEl.textContent = edge.name;
                }
                el.dataset.edgeName = edge.name;
            });
        });

        // Dispatch event
        document.dispatchEvent(new CustomEvent('quannex:edge-updated', {
            detail: { edgeId: edge.id, name: edge.name }
        }));
    }

    /**
     * Update vertex elements in DOM
     */
    _updateVertexInDOM(vertex) {
        const selectors = [
            `[data-vertex-id="${vertex.id}"]`,
            `[data-vertex="${vertex.id}"]`,
            `.vertex-${vertex.id.replace('V', '')}`
        ];

        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                const nameEl = el.querySelector('.vertex-name, .name') || el;
                if (nameEl.textContent !== vertex.name) {
                    nameEl.textContent = vertex.name;
                }
                el.dataset.vertexName = vertex.name;
            });
        });

        // Dispatch event
        document.dispatchEvent(new CustomEvent('quannex:vertex-updated', {
            detail: { vertexId: vertex.id, name: vertex.name }
        }));
    }

    // ========================================
    // CUSTOM HANDLER REGISTRATION
    // ========================================

    /**
     * Register a custom handler for a visualization target
     * @param {string} targetId - Unique identifier for the handler
     * @param {Function} handler - Called with propagation data
     * @returns {Function} Unregister function
     */
    registerHandler(targetId, handler) {
        this._customHandlers.set(targetId, handler);

        // Initial call with current state
        handler({
            type: 'init',
            faces: this.context.getAllFaces().map(f => f.toJSON()),
            edges: this.context.getAllEdges().map(e => e.toJSON()),
            vertices: this.context.getAllVertices().map(v => v.toJSON())
        });

        return () => this._customHandlers.delete(targetId);
    }

    /**
     * Unregister a custom handler
     */
    unregisterHandler(targetId) {
        this._customHandlers.delete(targetId);
    }

    // ========================================
    // UTILITY
    // ========================================

    /**
     * Force a full propagation
     */
    forcePropagate() {
        this._propagateAll();
    }

    /**
     * Get last propagation info
     */
    getLastPropagation() {
        return this._lastPropagation;
    }

    /**
     * Debug logging
     */
    _log(...args) {
        if (this.debug) {
            Logger.debug('NamePropagator', args.join(' '));
        }
    }

    /**
     * Destroy and cleanup
     */
    destroy() {
        this.stop();
        this._customHandlers.clear();
    }
}

// ========================================
// INJECT UPDATE ANIMATION STYLES
// ========================================

function injectStyles() {
    if (document.getElementById('name-propagator-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'name-propagator-styles';
    styles.textContent = `
        .name-updated {
            animation: nameUpdatePulse 0.5s ease-out;
        }

        @keyframes nameUpdatePulse {
            0% {
                background-color: rgba(99, 102, 241, 0.3);
            }
            100% {
                background-color: transparent;
            }
        }
    `;
    document.head.appendChild(styles);
}

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

export { NamePropagator, VISUALIZATION_TARGETS, PROPAGATION_EVENTS };

// Export for browser global
if (typeof window !== 'undefined') {
    window.NamePropagator = NamePropagator;
}
