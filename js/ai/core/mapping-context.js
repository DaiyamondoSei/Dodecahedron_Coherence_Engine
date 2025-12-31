/**
 * ========================================
 * MODULE: mapping-context.js
 * ========================================
 *
 * MAPPING CONTEXT - The Sacred Vessel
 *
 * Central nervous system for all naming and state management.
 * Implements Singleton pattern for single source of truth.
 * Implements Observer pattern for reactive UI updates.
 *
 * This class is like the Flower of Life - a central seed pattern
 * from which all other patterns emerge. Changes at the center (faces)
 * ripple outward to edges and vertices.
 *
 * DEPENDENCIES:
 * - None (self-contained, no imports)
 * - Uses sessionStorage for persistence
 *
 * EXPORTS:
 * - MappingContext (class, singleton)
 * - FaceMapping, EdgeMapping, VertexMapping (classes)
 * - DODECAHEDRON_TOPOLOGY (constant)
 * - extractFaceEnergy (utility function)
 *
 * ========================================
 * NOTES FOR FUTURE CLAUDE
 * ========================================
 *
 * 1. THE SINGLETON PATTERN:
 *    MappingContext._instance holds the one true instance.
 *    - MappingContext.getInstance() - get or create instance
 *    - MappingContext.reset() - destroy instance (for testing)
 *    - new MappingContext() returns existing instance if exists
 *    NEVER create multiple instances - state will desync!
 *
 * 2. THE OBSERVER PATTERN:
 *    Components subscribe to changes via subscribe(callback):
 *    - Returns unsubscribe function (call to clean up)
 *    - Events: FACE_NAMED, FACE_UPDATED, ALL_FACES_UPDATED,
 *              MODE_CHANGED, ARCHETYPE_CHANGED, LENS_CHANGED,
 *              VOCABULARY_CHANGED, EDGES_NAMED, VERTICES_NAMED
 *    - Event contains { type, ...payload, validationState }
 *
 * 3. NAME PROPAGATION (Critical Concept!):
 *    When a face is renamed, it cascades:
 *    - _propagateFaceNameChange(faceId) updates connected edges/vertices
 *    - Edges get names like "Face A ↔ Face B" (default)
 *    - Vertices get names like "Nexus: A-B-C" (abbreviated)
 *    - AI can override with setEdgeNames() / setVertexNames()
 *
 * 4. FACE ENERGY ALIASES (Issue #9 Fix):
 *    Different modules use different property names:
 *    - Backend (Face.js): faceEnergy
 *    - AI mapping: sentiment
 *    - Visualization: energy
 *    FaceMapping has getters/setters to keep them in sync.
 *    extractFaceEnergy() utility handles any format.
 *
 * 5. TWO MODES:
 *    - 'quick': 12 KPIs total (1 per face) - fast assessment
 *    - 'full': 60 KPIs total (5 per face) - comprehensive
 *    Mode affects validation requirements.
 *
 * 6. DODECAHEDRON_TOPOLOGY CONSTANT:
 *    Contains immutable geometry data:
 *    - breathAxes: 6 polar opposite pairs (1↔11, 2↔7, etc.)
 *    - edges: 30 edge definitions with elemental nature
 *    - vertices: 20 vertex definitions (3 faces each)
 *    - defaultFaceNames: 12 domain names with icons
 *    See js/geometry/dodecahedron-topology.js for comprehensive version.
 *
 * 7. PERSISTENCE:
 *    - _saveToStorage(): Saves to sessionStorage (survives page nav)
 *    - _restoreFromStorage(): Called in constructor
 *    - STORAGE_KEY: 'quannex_mapping_context'
 *    State is automatically saved on every change.
 *
 * 8. VALIDATION:
 *    _validate() checks:
 *    - Face has non-default name (isComplete)
 *    - No duplicate face names
 *    - All 12 faces named = valid
 *    validationState contains: isComplete, completedFaces, invalidFaces, errors
 *
 * 9. CONFIGURATION OPTIONS:
 *    - _selectedArchetype: Organization type (startup, enterprise, etc.)
 *    - _archetypeConstants: Tuning params for archetype
 *    - _selectedLens: Strategic focus (growth, stability, innovation)
 *    - _selectedVocabulary: Language style (grounded, professional, etc.)
 *
 * 10. KEY METHODS:
 *     Faces:
 *     - getFace(id), getAllFaces(), getFaceName(id)
 *     - setFaceName(id, name, metadata) - triggers propagation
 *     - setAllFaces(config) - bulk update from AI
 *
 *     Edges/Vertices:
 *     - getEdge(id), getAllEdges(), getEdgeName(id)
 *     - getVertex(id), getAllVertices(), getVertexName(id)
 *     - getEdgesForFace(id), getVerticesForFace(id)
 *     - getBreathAxisForFace(id), getOppositeFaceId(id)
 *
 *     Serialization:
 *     - toJSON(): Full state for storage
 *     - fromJSON(data): Restore from stored state
 *     - toDisplayState(): Enriched state for UI
 *
 * USED BY:
 * - Demo Orchestrator (wizard state management)
 * - Face Wizard (name editing UI)
 * - AI face mapper (bulk face updates)
 * - 3D visualization (face name display)
 * - Shadow panel (face name resolution)
 *
 * GOTCHAS:
 * - Singleton means state persists across page navigation
 * - Always use getInstance(), not new MappingContext()
 * - Face ID 1-12 (not 0-11!)
 * - Edge IDs are strings like "E1-2" not numbers
 * - Vertex IDs are strings like "V1" not numbers
 * - sessionStorage is per-tab, not shared across tabs
 *
 * ========================================
 *
 * @module js/ai/core/mapping-context
 * @author Deimantas Murauskas & Claude
 * @version 2.0.0 - Sprint 2 Task 9 with comprehensive docs
 */

// ========================================
// DODECAHEDRON TOPOLOGY
// ========================================
//
// COMPREHENSIVE SOURCE: js/geometry/dodecahedron-topology.js
// - window.DodecahedronTopology provides full topology with:
//   FACES, EDGES, VERTICES, BREATH_AXES, ELEMENTS, helper functions
//
// This simplified version is kept for backward compatibility with
// modules importing DODECAHEDRON_TOPOLOGY from mapping-context.js
//
// ========================================

/**
 * Immutable topology data for the dodecahedron.
 * - 12 faces (pentagonal)
 * - 30 edges (where faces meet)
 * - 20 vertices (where 3 faces converge)
 *
 * Euler's Formula: V - E + F = 2 → 20 - 30 + 12 = 2 ✓
 *
 * @see js/geometry/dodecahedron-topology.js for comprehensive version
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
    // Element data derived from CSV_Edge_tension_Map.csv "Elemental Nature of the Relationship" column
    edges: [
        { id: 'E1-2', faces: [1, 2], element: 'Fire' },      // Financial Capital ↔ Intellectual Capital
        { id: 'E1-6', faces: [1, 6], element: 'Water' },     // Financial Capital ↔ Community & Partners
        { id: 'E1-7', faces: [1, 7], element: 'Air' },       // Financial Capital ↔ Brand & Reputation
        { id: 'E1-8', faces: [1, 8], element: 'Earth' },     // Financial Capital ↔ Core Operations
        { id: 'E1-10', faces: [1, 10], element: 'Ether' },   // Financial Capital ↔ Foundational Values
        { id: 'E2-3', faces: [2, 3], element: 'Air' },       // Intellectual Capital ↔ Human Capital
        { id: 'E2-6', faces: [2, 6], element: 'Water' },     // Intellectual Capital ↔ Community & Partners
        { id: 'E2-10', faces: [2, 10], element: 'Earth' },   // Intellectual Capital ↔ Foundational Values
        { id: 'E2-11', faces: [2, 11], element: 'Ether' },   // Intellectual Capital ↔ Funding Pipeline
        { id: 'E3-4', faces: [3, 4], element: 'Earth' },     // Human Capital ↔ Structural Capital
        { id: 'E3-6', faces: [3, 6], element: 'Water' },     // Human Capital ↔ Community & Partners
        { id: 'E3-9', faces: [3, 9], element: 'Ether' },     // Human Capital ↔ Regenerative Flow
        { id: 'E3-11', faces: [3, 11], element: 'Fire' },    // Human Capital ↔ Funding Pipeline
        { id: 'E4-5', faces: [4, 5], element: 'Air' },       // Structural Capital ↔ Market Resonance
        { id: 'E4-6', faces: [4, 6], element: 'Earth' },     // Structural Capital ↔ Community & Partners
        { id: 'E4-7', faces: [4, 7], element: 'Ether' },     // Structural Capital ↔ Brand & Reputation
        { id: 'E4-9', faces: [4, 9], element: 'Fire' },      // Structural Capital ↔ Regenerative Flow
        { id: 'E5-7', faces: [5, 7], element: 'Ether' },     // Market Resonance ↔ Brand & Reputation
        { id: 'E5-8', faces: [5, 8], element: 'Fire' },      // Market Resonance ↔ Core Operations
        { id: 'E5-9', faces: [5, 9], element: 'Water' },     // Market Resonance ↔ Regenerative Flow
        { id: 'E5-12', faces: [5, 12], element: 'Water' },   // Market Resonance ↔ Risk & Resilience
        { id: 'E6-7', faces: [6, 7], element: 'Air' },       // Community & Partners ↔ Brand & Reputation
        { id: 'E7-8', faces: [7, 8], element: 'Fire' },      // Brand & Reputation ↔ Core Operations
        { id: 'E8-10', faces: [8, 10], element: 'Water' },   // Core Operations ↔ Foundational Values
        { id: 'E8-12', faces: [8, 12], element: 'Air' },     // Core Operations ↔ Risk & Resilience
        { id: 'E9-11', faces: [9, 11], element: 'Earth' },   // Regenerative Flow ↔ Funding Pipeline
        { id: 'E9-12', faces: [9, 12], element: 'Fire' },    // Regenerative Flow ↔ Risk & Resilience
        { id: 'E10-11', faces: [10, 11], element: 'Air' },   // Foundational Values ↔ Funding Pipeline
        { id: 'E10-12', faces: [10, 12], element: 'Fire' },  // Foundational Values ↔ Risk & Resilience
        { id: 'E11-12', faces: [11, 12], element: 'Water' }  // Funding Pipeline ↔ Risk & Resilience
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
        // Accept both 'sentiment' and 'faceEnergy' for backwards compatibility (Issue #9 Fix)
        this.sentiment = config.sentiment ?? config.faceEnergy ?? config.energy ?? 0.5;
        this.reasoning = config.reasoning || '';
        this.source = config.source || 'default'; // 'default', 'ai', 'manual'
        this.namedAt = config.namedAt || null;
    }

    /**
     * Alias for sentiment - provides backwards compatibility with backend Face class
     * which uses 'faceEnergy' instead of 'sentiment'
     * @returns {number} The face's energy/sentiment value (0-1)
     */
    get faceEnergy() {
        return this.sentiment;
    }

    /**
     * Setter for faceEnergy - syncs with sentiment
     * @param {number} value - The energy value (0-1)
     */
    set faceEnergy(value) {
        this.sentiment = value;
    }

    /**
     * Alias for sentiment - 'energy' is used in some visualization code
     * @returns {number} The face's energy value (0-1)
     */
    get energy() {
        return this.sentiment;
    }

    /**
     * Setter for energy - syncs with sentiment
     * @param {number} value - The energy value (0-1)
     */
    set energy(value) {
        this.sentiment = value;
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
            faceEnergy: this.sentiment,  // Alias for backwards compatibility
            energy: this.sentiment,       // Alias for visualization code
            reasoning: this.reasoning,
            source: this.source,
            namedAt: this.namedAt,
            isComplete: this.isComplete
        };
    }
}

// ========================================
// UTILITY: EXTRACT FACE ENERGY
// ========================================

/**
 * Extracts face energy from any face-like object, handling various property names.
 * This utility resolves the sentiment vs faceEnergy vs energy naming inconsistency.
 * (Issue #9: Sentiment to FaceEnergy converter)
 *
 * @param {Object} face - A face object from any source (FaceMapping, Face, plain object)
 * @param {number} defaultValue - Default value if no energy property found (default: 0.5)
 * @returns {number} The face energy value (0-1)
 *
 * @example
 * const energy = extractFaceEnergy(face); // Works with any face object
 */
function extractFaceEnergy(face, defaultValue = 0.5) {
    if (!face || typeof face !== 'object') return defaultValue;

    // Priority order: coherence > sentiment > faceEnergy > energy > default
    const value = face.coherence ?? face.sentiment ?? face.faceEnergy ?? face.energy ?? defaultValue;

    // Ensure we have a valid number
    const numValue = parseFloat(value);
    return isNaN(numValue) ? defaultValue : Math.max(0, Math.min(1, numValue));
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

        // Initialize 30 edges with elemental nature from CSV data
        DODECAHEDRON_TOPOLOGY.edges.forEach(edge => {
            this._edges.set(edge.id, new EdgeMapping({
                id: edge.id,
                faceIds: edge.faces,
                element: edge.element || 'Ether' // Use element from topology, fallback to Ether
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

        // Writable properties for FaceMapping (excludes computed getters like isComplete)
        // Note: isComplete is computed from name, so it will be correct after name is restored
        const faceWritableProps = ['name', 'icon', 'octave', 'archetype', 'kpis',
                                   'validated', 'sentiment', 'reasoning', 'source', 'namedAt'];

        if (data.faces) {
            data.faces.forEach(fConfig => {
                const face = this._faces.get(fConfig.id);
                if (face) {
                    // Selectively assign only writable properties to avoid
                    // "Cannot set property X which has only a getter" errors
                    faceWritableProps.forEach(prop => {
                        if (fConfig[prop] !== undefined) {
                            face[prop] = fConfig[prop];
                        }
                    });
                }
            });
        }

        // Writable properties for EdgeMapping
        const edgeWritableProps = ['sourceId', 'targetId', 'name', 'tension', 'flow', 'validated'];

        if (data.edges) {
            data.edges.forEach(eConfig => {
                const edge = this._edges.get(eConfig.id);
                if (edge) {
                    edgeWritableProps.forEach(prop => {
                        if (eConfig[prop] !== undefined) {
                            edge[prop] = eConfig[prop];
                        }
                    });
                }
            });
        }

        // Writable properties for VertexMapping
        const vertexWritableProps = ['faceIds', 'name', 'resonance', 'validated'];

        if (data.vertices) {
            data.vertices.forEach(vConfig => {
                const vertex = this._vertices.get(vConfig.id);
                if (vertex) {
                    vertexWritableProps.forEach(prop => {
                        if (vConfig[prop] !== undefined) {
                            vertex[prop] = vConfig[prop];
                        }
                    });
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
    DODECAHEDRON_TOPOLOGY,
    extractFaceEnergy  // Utility for getting face energy regardless of property name
};

// Export for browser global
if (typeof window !== 'undefined') {
    window.MappingContext = MappingContext;
    window.DODECAHEDRON_TOPOLOGY = DODECAHEDRON_TOPOLOGY;
    window.extractFaceEnergy = extractFaceEnergy;  // Issue #9: Sentiment-FaceEnergy converter
}
