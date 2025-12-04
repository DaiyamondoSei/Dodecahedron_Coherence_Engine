/**
 * ========================================
 * AI MAPPING - Module Index
 * ========================================
 *
 * Central export for all AI mapping functionality.
 *
 * @module AIMapping
 * @version Sprint 2 - Tasks 13-16
 */

// Face Mapper - Story to faces transformation
export { FaceMapper, LENS_CONFIGS, PHI_SENTIMENTS } from './face-mapper.js';

// KPI Extractor - Data extraction from narratives
export { KPIExtractor, KPI_TEMPLATES, EXTRACTION_PATTERNS } from './kpi-extractor.js';

// Octave Determiner - Developmental level assignment
export {
    OctaveDeterminer,
    OCTAVE_THRESHOLDS,
    OCTAVE_DESCRIPTIONS,
    OCTAVE_ICONS
} from './octave-determiner.js';
