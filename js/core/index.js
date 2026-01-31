/**
 * ========================================================================
 * CORE MODELS - Barrel Export
 * ========================================================================
 *
 * CREATED: December 16, 2025
 *
 * Central export point for all core data models.
 * Enables clean imports: import { Face, Edge, Vertex } from './core/index.js'
 *
 * ============================================================================
 *                         NOTES FOR FUTURE CLAUDE
 * ============================================================================
 * 1. This file re-exports all core classes for convenience
 * 2. Import order doesn't matter here (ES modules handle dependencies)
 * 3. main.js imports from this file for cleaner syntax
 * 4. Each class file also exports to window for backward compatibility
 * 5. All 5 classes are independent EXCEPT Face which imports TuningConfig
 * 6. The DodecahedronEngine stays in main.js (it's the orchestrator)
 * ============================================================================
 *
 * @module js/core/index
 */

// Export all core models
export { TuningConfig } from './TuningConfig.js';
export { KPI } from './KPI.js';
export { Face } from './Face.js';
export { Edge } from './Edge.js';
export { Vertex } from './Vertex.js';

Logger.info('Core', 'models barrel export loaded');
