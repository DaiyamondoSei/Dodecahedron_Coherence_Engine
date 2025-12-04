/**
 * ========================================
 * AI CORE - Module Index
 * ========================================
 *
 * Central export for core AI functionality.
 *
 * @module AICore
 * @version Sprint 2 - Tasks 9, 15, 17
 */

// MappingContext - Central state management
export {
    MappingContext,
    FaceMapping,
    EdgeMapping,
    VertexMapping,
    DODECAHEDRON_TOPOLOGY
} from './mapping-context.js';

// ValidationGate - Empowering progress checks
export {
    ValidationGate,
    COMPLETION_THRESHOLDS,
    EMPOWERING_MESSAGES
} from './validation-gate.js';

// NamePropagator - Dynamic visualization sync
export {
    NamePropagator,
    VISUALIZATION_TARGETS,
    PROPAGATION_EVENTS
} from './name-propagator.js';
