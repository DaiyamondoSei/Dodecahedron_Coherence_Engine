/**
 * ========================================
 * MAPPING CONTEXT - The Sacred Vessel
 * ========================================
 *
 * Central nervous system for all naming and state management.
 * Implements Singleton pattern for single source of truth.
 * Implements Observer pattern for reactive UI updates.
 *
 * This class is like the Flower of Life - a central seed pattern
 * from which all other patterns emerge. Changes at the center (faces)
 * ripple outward to edges and vertices.
 *
 * @module MappingContext
 * @version Sprint 2 - Task 9
 */

// ========================================
// DODECAHEDRON TOPOLOGY
// ========================================

/**
 * Immutable topology data for the dodecahedron.
 * - 12 faces (pentagonal)
 * - 30 edges (where faces meet)
 * - 20 vertices (where 3 faces converge)
 *
 * Euler's Formula: V - E + F = 2 → 20 - 30 + 12 = 2 ✓
 */
const DODECAHEDRON_TOPOLOGY = {
    // 6 Breath Axes - polar opposite face pairs
    breathAxes: [
        { id: 1, reception: 1, projection: 11, name: 'Resource Flow' },
        { id: 2, reception: 2, projection: 7, name: 'Substance & Story' },
        { id: 3, reception: 3, projection: 8, name: 'Being & Doing' },
        { id: 4, reception: 9, projection: 4, name: 'Form & Integrity' },
        { id: 5, reception: 10, projection: 5, name: 'Perception & Truth' },
        { id: 6, reception: 12, projection: 6, name: 'Network & Fortress' }
    ],

    // 30 Edge connections (each face has 5 edges, shared between 2 faces)
    edges: [
        { id: 'E1-2', faces: [1, 2] },
        { id: 'E1-3', faces: [1, 3] },
        { id: 'E1-4', faces: [1, 4] },
        { id: 'E1-5', faces: [1, 5] },
        { id: 'E1-6', faces: [1, 6] },
        { id: 'E2-3', faces: [2, 3] },
        { id: 'E2-6', faces: [2, 6] },
        { id: 'E2-7', faces: [2, 7] },
        { id: 'E2-8', faces: [2, 8] },
        { id: 'E3-4', faces: [3, 4] },
        { id: 'E3-8', faces: [3, 8] },
        { id: 'E3-9', faces: [3, 9] },
        { id: 'E4-5', faces: [4, 5] },
        { id: 'E4-9', faces: [4, 9] },
        { id: 'E4-10', faces: [4, 10] },
        { id: 'E5-6', faces: [5, 6] },
        { id: 'E5-10', faces: [5, 10] },
        { id: 'E5-11', faces: [5, 11] },
        { id: 'E6-7', faces: [6, 7] },
        { id: 'E6-11', faces: [6, 11] },
        { id: 'E7-8', faces: [7, 8] },
        { id: 'E7-11', faces: [7, 11] },
        { id: 'E7-12', faces: [7, 12] },
        { id: 'E8-9', faces: [8, 9] },
        { id: 'E8-12', faces: [8, 12] },
        { id: 'E9-10', faces: [9, 10] },
        { id: 'E9-12', faces: [9, 12] },
        { id: 'E10-11', faces: [10, 11] },
        { id: 'E10-12', faces: [10, 12] },
        { id: 'E11-12', faces: [11, 12] }
    ],

    // 20 Vertices (where 3 faces meet)
    vertices: [
        { id: 'V1', faces: [1, 2, 3] },
        { id: 'V2', faces: [1, 3, 4] },
        { id: 'V3', faces: [1, 4, 5] },
        { id: 'V4', faces: [1, 5, 6] },
        { id: 'V5', faces: [1, 2, 6] },
        { id: 'V6', faces: [2, 3, 8] },
        { id: 'V7', faces: [3, 4, 9] },
        { id: 'V8', faces: [4, 5, 10] },
        { id: 'V9', faces: [5, 6, 11] },
        { id: 'V10', faces: [2, 6, 7] },
        { id: 'V11', faces: [2, 7, 8] },
        { id: 'V12', faces: [3, 8, 9] },
        { id: 'V13', faces: [4, 9, 10] },
        { id: 'V14', faces: [5, 10, 11] },
        { id: 'V15', faces: [6, 7, 11] },
        { id: 'V16', faces: [7, 8, 12] },
        { id: 'V17', faces: [8, 9, 12] },
        { id: 'V18', faces: [9, 10, 12] },
        { id: 'V19', faces: [10, 11, 12] },
        { id: 'V20', faces: [7, 11, 12] }
    ],

    // Default face names (12 organizational domains)
    defaultFaceNames: [
        { id: 1, name: 'Financial Capital', icon: '💰' },
        { id: 2, name: 'Intellectual Capital', icon: '💡' },
        { id: 3, name: 'Human Capital', icon: '👥' },
        { id: 4, name: 'Structural Capital', icon: '🏛️' },
        { id: 5, name: 'Market Resonance', icon: '📊' },
        { id: 6, name: 'Community & Partners', icon: '🤝' },
        { id: 7, name: 'Brand & Reputation', icon: '⭐' },
        { id: 8, name: 'Core Operations', icon: '⚙️' },
        { id: 9, name: 'Regenerative Flow', icon: '♻️' },
        { id: 10, name: 'Foundational Values', icon: '🎯' },
        { id: 11, name: 'Funding Pipeline', icon: '💎' },
        { id: 12, name: 'Risk & Resilience', icon: '🛡️' }
    ]
};

Object.freeze(DODECAHEDRON_TOPOLOGY);

// ========================================
// FACE MAPPING CLASS
// ========================================

/**
 * Represents a single face mapping with all its metadata.
 */
class FaceMapping {
    constructor(config) {
        this.id = config.id;
        this.name = config.name || `Face ${config.id}`;
        this.icon = config.icon || '';
        this.octave = config.octave || 'O4'; // Default to middle octave
        this.archetype = config.archetype || null;
        this.kpis = config.kpis || [];
        this.validated = config.validated || false;
        this.sentiment = config.sentiment || 0.5;
        this.reasoning = config.reasoning || '';
        this.source = config.source || 'default'; // 'default', 'ai', 'manual'
        this.namedAt = config.namedAt || null;
    }

    /**
     * Check if face has valid custom name
     */
    get isComplete() {
        return this.name &&
               this.name.trim().length > 0 &&
               this.name !== `Face ${this.id}`;
    }

    /**
     * Get required KPI count based on mode
     */
    getRequiredKPICount(mode = 'quick') {
        return mode === 'quick' ? 1 : 5;
    }

    /**
     * Check if face has required KPIs
     */
    hasRequiredKPIs(mode = 'quick') {
        return this.kpis.length >= this.getRequiredKPICount(mode);
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            icon: this.icon,
            octave: this.octave,
            archetype: this.archetype,
            kpis: this.kpis,
            validated: this.validated,
            sentiment: this.sentiment,
            reasoning: this.reasoning,
            source: this.source,
            namedAt: this.namedAt,
            isComplete: this.isComplete
        };
    }
}

// ========================================
// EDGE MAPPING CLASS
// ========================================

/**
 * Represents an edge mapping between two faces.
 * Edge names should be EMERGENT SYNTHESIS, not concatenations.
 */
class EdgeMapping {
    constructor(config) {
        this.id = config.id;
        this.faceIds = config.faceIds || [];
        this.name = config.name || '';
        this.element = config.element || 'Ether';
        this.archetype = config.archetype || '';
        this.source = config.source || 'derived';
    }

    /**
     * Generate emergent name from two face names.
     * This is the default - AI should provide better names.
     *
     * BAD: "Finance ↔ HR"
     * GOOD: "Team Investment Capacity"
     */
    generateEmergentName(faceAName, faceBName) {
        // Simple fallback - real emergent names come from AI
        this.name = `${faceAName} ↔ ${faceBName}`;
        this.source = 'derived';
        return this.name;
    }

    toJSON() {
        return {
            id: this.id,
            faceIds: this.faceIds,
            name: this.name,
            element: this.element,
            archetype: this.archetype,
            source: this.source
        };
    }
}

// ========================================
// VERTEX MAPPING CLASS
// ========================================

/**
 * Represents a vertex mapping where three faces converge.
 * Vertices are "vortex points" - leverage points for systemic change.
 */
class VertexMapping {
    constructor(config) {
        this.id = config.id;
        this.faceIds = config.faceIds || [];
        this.name = config.name || '';
        this.archetype = config.archetype || '';
        this.vortexType = config.vortexType || 'neutral'; // ascending, descending, neutral
        this.source = config.source || 'derived';
    }

    /**
     * Generate emergent name from three face names.
     * This is the default - AI should provide better names.
     */
    generateEmergentName(faceNames) {
        if (faceNames.length !== 3) return '';
        const abbreviated = faceNames.map(n => n.split(' ')[0]).join('-');
        this.name = `Nexus: ${abbreviated}`;
        this.source = 'derived';
        return this.name;
    }

    toJSON() {
        return {
            id: this.id,
            faceIds: this.faceIds,
            name: this.name,
            archetype: this.archetype,
            vortexType: this.vortexType,
            source: this.source
        };
    }
}

// ========================================
// MAPPING CONTEXT - SINGLETON
// ========================================

/**
 * MappingContext - The Central Sacred Vessel
 *
 * Stores all face, edge, and vertex mappings.
 * Provides reactive updates via Observer pattern.
 * Persists to sessionStorage for page navigation.
 */
class MappingContext {
    static _instance = null;
    static STORAGE_KEY = 'quannex_mapping_context';

    constructor() {
        if (MappingContext._instance) {
            return MappingContext._instance;
        }

        // Core state
        this._faces = new Map();
        this._edges = new Map();
        this._vertices = new Map();

        // Subscribers for reactive updates
        this._subscribers = new Set();

        // Mode configuration
        this._mode = 'quick'; // 'quick' (12 KPIs) or 'full' (60 KPIs)

        // Archetype configuration
        this._selectedArchetype = null;
        this._archetypeConstants = null;

        // Strategic lens
        this._selectedLens = null; // 'growth', 'stability', 'innovation'

        // Vocabulary style
        this._selectedVocabulary = null; // 'grounded', 'professional', 'systems', 'poetic'

        // Validation state (cached)
        this._validationState = {
            isComplete: false,
            completedFaces: 0,
            totalFaces: 12,
            invalidFaces: [],
            errors: []
        };

        // Initialize default structure
        this._initializeStructure();

        // Try to restore from sessionStorage
        this._restoreFromStorage();

        MappingContext._instance = this;
    }

    /**
     * Get singleton instance
     */
    static getInstance() {
        if (!MappingContext._instance) {
            MappingContext._instance = new MappingContext();
        }
        return MappingContext._instance;
    }

    /**
     * Reset instance (for testing)
     */
    static reset() {
        if (MappingContext._instance) {
            MappingContext._instance._subscribers.clear();
        }
        MappingContext._instance = null;
        if (typeof sessionStorage !== 'undefined') {
            sessionStorage.removeItem(MappingContext.STORAGE_KEY);
        }
    }

    // ============================================
    // INITIALIZATION
    // ============================================

    /**
     * Initialize the dodecahedron structure with default mappings
     */
    _initializeStructure() {
        // Initialize 12 faces with defaults
        DODECAHEDRON_TOPOLOGY.defaultFaceNames.forEach(defaultFace => {
            this._faces.set(defaultFace.id, new FaceMapping({
                id: defaultFace.id,
                name: defaultFace.name,
                icon: defaultFace.icon,
                source: 'default'
            }));
        });

        // Initialize 30 edges
        DODECAHEDRON_TOPOLOGY.edges.forEach(edge => {
            this._edges.set(edge.id, new EdgeMapping({
                id: edge.id,
                faceIds: edge.faces
            }));
        });

        // Initialize 20 vertices
        DODECAHEDRON_TOPOLOGY.vertices.forEach(vertex => {
            this._vertices.set(vertex.id, new VertexMapping({
                id: vertex.id,
                faceIds: vertex.faces
            }));
        });

        // Derive initial edge/vertex names
        this._propagateAllNames();
    }

    // ============================================
    // FACE OPERATIONS
    // ============================================

    /**
     * Get face by ID
     */
    getFace(id) {
        return this._faces.get(id);
    }

    /**
     * Get all faces as array
     */
    getAllFaces() {
        return Array.from(this._faces.values());
    }

    /**
     * Get face name by ID (convenience method)
     */
    getFaceName(id) {
        const face = this._faces.get(id);
        return face ? face.name : `Face ${id}`;
    }

    /**
     * Set face name with optional metadata
     * Triggers name propagation to edges and vertices
     */
    setFaceName(id, name, metadata = {}) {
        const face = this._faces.get(id);
        if (!face) {
            console.warn(`MappingContext: Face ${id} not found`);
            return false;
        }

        const previousName = face.name;

        // Update face
        face.name = name;
        face.icon = metadata.icon || face.icon;
        face.octave = metadata.octave || face.octave;
        face.reasoning = metadata.reasoning || '';
        face.sentiment = metadata.sentiment ?? face.sentiment;
        face.source = metadata.source || 'manual';
        face.namedAt = Date.now();

        // Propagate to edges and vertices
        this._propagateFaceNameChange(id);

        // Revalidate
        this._validate();

        // Persist
        this._saveToStorage();

        // Notify subscribers
        this._notify({
            type: 'FACE_NAMED',
            faceId: id,
            name: name,
            previousName: previousName,
            metadata: metadata,
            validationState: this._validationState
        });

        return true;
    }

    /**
     * Update face configuration
     */
    updateFace(id, updates) {
        const face = this._faces.get(id);
        if (!face) return false;

        Object.keys(updates).forEach(key => {
            if (key in face) {
                face[key] = updates[key];
            }
        });

        if (updates.name) {
            this._propagateFaceNameChange(id);
        }

        this._validate();
        this._saveToStorage();

        this._notify({
            type: 'FACE_UPDATED',
            faceId: id,
            updates: updates,
            validationState: this._validationState
        });

        return true;
    }

    /**
     * Set all 12 faces at once (from AI mapping)
     */
    setAllFaces(facesConfig, lens = null) {
        if (!Array.isArray(facesConfig) || facesConfig.length !== 12) {
            console.error('MappingContext: Must provide exactly 12 face configurations');
            return false;
        }

        facesConfig.forEach(config => {
            const face = this._faces.get(config.id);
            if (face) {
                Object.assign(face, {
                    // Use explicit check to allow empty string (which should fail validation)
                    name: config.name !== undefined ? config.name : face.name,
                    icon: config.icon || face.icon,
                    octave: config.octave || face.octave,
                    reasoning: config.reasoning || '',
                    sentiment: config.sentiment ?? 0.5,
                    source: config.source || 'ai',
                    namedAt: Date.now()
                });
            }
        });

        if (lens) {
            this._selectedLens = lens;
        }

        // Propagate all names
        this._propagateAllNames();

        // Validate
        this._validate();

        // Persist
        this._saveToStorage();

        // Notify
        this._notify({
            type: 'ALL_FACES_UPDATED',
            lens: lens,
            faces: this.getAllFaces().map(f => f.toJSON()),
            validationState: this._validationState
        });

        return true;
    }

    // ============================================
    // NAME PROPAGATION
    // ============================================

    /**
     * Propagate name change from a face to connected edges and vertices
     */
    _propagateFaceNameChange(faceId) {
        const face = this._faces.get(faceId);
        if (!face) return;

        // Update edges containing this face
        this._edges.forEach((edge, edgeId) => {
            if (edge.faceIds.includes(faceId)) {
                const faceA = this._faces.get(edge.faceIds[0]);
                const faceB = this._faces.get(edge.faceIds[1]);
                if (faceA && faceB) {
                    edge.generateEmergentName(faceA.name, faceB.name);
                }
            }
        });

        // Update vertices containing this face
        this._vertices.forEach((vertex, vertexId) => {
            if (vertex.faceIds.includes(faceId)) {
                const faceNames = vertex.faceIds.map(id => {
                    const f = this._faces.get(id);
                    return f ? f.name : `Face ${id}`;
                });
                vertex.generateEmergentName(faceNames);
            }
        });
    }

    /**
     * Propagate all face names to edges and vertices
     */
    _propagateAllNames() {
        // Update all edges
        this._edges.forEach((edge, edgeId) => {
            const faceA = this._faces.get(edge.faceIds[0]);
            const faceB = this._faces.get(edge.faceIds[1]);
            if (faceA && faceB) {
                edge.generateEmergentName(faceA.name, faceB.name);
            }
        });

        // Update all vertices
        this._vertices.forEach((vertex, vertexId) => {
            const faceNames = vertex.faceIds.map(id => {
                const f = this._faces.get(id);
                return f ? f.name : `Face ${id}`;
            });
            vertex.generateEmergentName(faceNames);
        });
    }

    /**
     * Set AI-generated emergent names for edges
     * These should be synthesized names, not concatenations
     */
    setEdgeNames(edgeConfigs) {
        edgeConfigs.forEach(config => {
            const edge = this._edges.get(config.id);
            if (edge) {
                edge.name = config.name;
                edge.element = config.element || edge.element;
                edge.archetype = config.archetype || '';
                edge.source = 'ai';
            }
        });

        this._saveToStorage();

        this._notify({
            type: 'EDGES_NAMED',
            edges: edgeConfigs
        });
    }

    /**
     * Set AI-generated emergent names for vertices
     */
    setVertexNames(vertexConfigs) {
        vertexConfigs.forEach(config => {
            const vertex = this._vertices.get(config.id);
            if (vertex) {
                vertex.name = config.name;
                vertex.archetype = config.archetype || '';
                vertex.vortexType = config.vortexType || 'neutral';
                vertex.source = 'ai';
            }
        });

        this._saveToStorage();

        this._notify({
            type: 'VERTICES_NAMED',
            vertices: vertexConfigs
        });
    }

    // ============================================
    // EDGE & VERTEX ACCESSORS
    // ============================================

    getEdge(id) {
        return this._edges.get(id);
    }

    getAllEdges() {
        return Array.from(this._edges.values());
    }

    getEdgeName(id) {
        const edge = this._edges.get(id);
        return edge ? edge.name : id;
    }

    getVertex(id) {
        return this._vertices.get(id);
    }

    getAllVertices() {
        return Array.from(this._vertices.values());
    }

    getVertexName(id) {
        const vertex = this._vertices.get(id);
        return vertex ? vertex.name : id;
    }

    /**
     * Get edges connected to a face
     */
    getEdgesForFace(faceId) {
        return this.getAllEdges().filter(edge =>
            edge.faceIds.includes(faceId)
        );
    }

    /**
     * Get vertices connected to a face
     */
    getVerticesForFace(faceId) {
        return this.getAllVertices().filter(vertex =>
            vertex.faceIds.includes(faceId)
        );
    }

    /**
     * Get breath axis pair for a face
     */
    getBreathAxisForFace(faceId) {
        return DODECAHEDRON_TOPOLOGY.breathAxes.find(axis =>
            axis.reception === faceId || axis.projection === faceId
        );
    }

    /**
     * Get opposite face ID for breath axis
     */
    getOppositeFaceId(faceId) {
        const axis = this.getBreathAxisForFace(faceId);
        if (!axis) return null;
        return axis.reception === faceId ? axis.projection : axis.reception;
    }

    // ============================================
    // MODE & ARCHETYPE
    // ============================================

    setMode(mode) {
        if (mode !== 'quick' && mode !== 'full') {
            console.warn('MappingContext: Mode must be "quick" or "full"');
            return;
        }
        this._mode = mode;
        this._validate();
        this._saveToStorage();

        this._notify({
            type: 'MODE_CHANGED',
            mode: mode,
            requiredKPIs: this.getRequiredKPICount()
        });
    }

    getMode() {
        return this._mode;
    }

    getRequiredKPICount() {
        return this._mode === 'quick' ? 12 : 60;
    }

    setArchetype(archetype, constants) {
        this._selectedArchetype = archetype;
        this._archetypeConstants = constants;
        this._saveToStorage();

        this._notify({
            type: 'ARCHETYPE_CHANGED',
            archetype: archetype,
            constants: constants
        });
    }

    getArchetype() {
        return this._selectedArchetype;
    }

    getArchetypeConstants() {
        return this._archetypeConstants;
    }

    setLens(lens) {
        this._selectedLens = lens;
        this._saveToStorage();

        this._notify({
            type: 'LENS_CHANGED',
            lens: lens
        });
    }

    getLens() {
        return this._selectedLens;
    }

    setVocabulary(vocabulary) {
        this._selectedVocabulary = vocabulary;
        this._saveToStorage();

        this._notify({
            type: 'VOCABULARY_CHANGED',
            vocabulary: vocabulary
        });
    }

    getVocabulary() {
        return this._selectedVocabulary;
    }

    // ============================================
    // VALIDATION
    // ============================================

    _validate() {
        const invalidFaces = [];
        const errors = [];
        let completedFaces = 0;

        this._faces.forEach((face, id) => {
            if (face.isComplete) {
                completedFaces++;
            } else {
                invalidFaces.push(id);
            }
        });

        // Check for duplicate names
        const names = this.getAllFaces().map(f => f.name.toLowerCase().trim());
        const duplicates = names.filter((n, i) =>
            n !== `face ${i + 1}` && names.indexOf(n) !== i
        );
        if (duplicates.length > 0) {
            errors.push(`Duplicate face names: ${[...new Set(duplicates)].join(', ')}`);
        }

        this._validationState = {
            isComplete: completedFaces === 12 && errors.length === 0,
            completedFaces: completedFaces,
            totalFaces: 12,
            invalidFaces: invalidFaces,
            errors: errors
        };
    }

    getValidationState() {
        return { ...this._validationState };
    }

    isValid() {
        return this._validationState.isComplete;
    }

    getCompletionPercentage() {
        return Math.round((this._validationState.completedFaces / 12) * 100);
    }

    // ============================================
    // OBSERVER PATTERN
    // ============================================

    /**
     * Subscribe to context changes
     * @param {Function} callback - Called with event object
     * @returns {Function} Unsubscribe function
     */
    subscribe(callback) {
        this._subscribers.add(callback);
        return () => this._subscribers.delete(callback);
    }

    /**
     * Notify all subscribers of an event
     */
    _notify(event) {
        this._subscribers.forEach(callback => {
            try {
                callback(event);
            } catch (err) {
                console.error('MappingContext subscriber error:', err);
            }
        });
    }

    // ============================================
    // PERSISTENCE
    // ============================================

    _saveToStorage() {
        if (typeof sessionStorage === 'undefined') return;

        try {
            const state = this.toJSON();
            sessionStorage.setItem(MappingContext.STORAGE_KEY, JSON.stringify(state));
        } catch (err) {
            console.warn('MappingContext: Failed to save to sessionStorage', err);
        }
    }

    _restoreFromStorage() {
        if (typeof sessionStorage === 'undefined') return;

        try {
            const stored = sessionStorage.getItem(MappingContext.STORAGE_KEY);
            if (stored) {
                const state = JSON.parse(stored);
                this.fromJSON(state);
            }
        } catch (err) {
            console.warn('MappingContext: Failed to restore from sessionStorage', err);
        }
    }

    // ============================================
    // SERIALIZATION
    // ============================================

    toJSON() {
        return {
            version: 1,
            faces: this.getAllFaces().map(f => f.toJSON()),
            edges: this.getAllEdges().map(e => e.toJSON()),
            vertices: this.getAllVertices().map(v => v.toJSON()),
            mode: this._mode,
            archetype: this._selectedArchetype,
            archetypeConstants: this._archetypeConstants,
            lens: this._selectedLens,
            vocabulary: this._selectedVocabulary,
            validationState: this._validationState
        };
    }

    fromJSON(data) {
        if (!data) return;

        if (data.faces) {
            data.faces.forEach(fConfig => {
                const face = this._faces.get(fConfig.id);
                if (face) {
                    Object.assign(face, fConfig);
                }
            });
        }

        if (data.edges) {
            data.edges.forEach(eConfig => {
                const edge = this._edges.get(eConfig.id);
                if (edge) {
                    Object.assign(edge, eConfig);
                }
            });
        }

        if (data.vertices) {
            data.vertices.forEach(vConfig => {
                const vertex = this._vertices.get(vConfig.id);
                if (vertex) {
                    Object.assign(vertex, vConfig);
                }
            });
        }

        if (data.mode) this._mode = data.mode;
        if (data.archetype) this._selectedArchetype = data.archetype;
        if (data.archetypeConstants) this._archetypeConstants = data.archetypeConstants;
        if (data.lens) this._selectedLens = data.lens;
        if (data.vocabulary) this._selectedVocabulary = data.vocabulary;

        this._validate();
    }

    /**
     * Export for display (all elements with fallback names)
     */
    toDisplayState() {
        return {
            faces: this.getAllFaces().map(f => ({
                ...f.toJSON(),
                displayName: f.name || `Face ${f.id}`,
                hasCustomName: f.source !== 'default'
            })),
            edges: this.getAllEdges().map(e => ({
                ...e.toJSON(),
                displayName: e.name || e.id,
                hasCustomName: e.source === 'ai'
            })),
            vertices: this.getAllVertices().map(v => ({
                ...v.toJSON(),
                displayName: v.name || v.id,
                hasCustomName: v.source === 'ai'
            })),
            mode: this._mode,
            archetype: this._selectedArchetype,
            lens: this._selectedLens,
            vocabulary: this._selectedVocabulary,
            validation: this._validationState,
            completionPercentage: this.getCompletionPercentage()
        };
    }
}

// ========================================
// EXPORTS
// ========================================

// Export for ES modules
export {
    MappingContext,
    FaceMapping,
    EdgeMapping,
    VertexMapping,
    DODECAHEDRON_TOPOLOGY
};

// Export for browser global
if (typeof window !== 'undefined') {
    window.MappingContext = MappingContext;
    window.DODECAHEDRON_TOPOLOGY = DODECAHEDRON_TOPOLOGY;
}
