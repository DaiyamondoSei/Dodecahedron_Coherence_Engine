/**
 * ════════════════════════════════════════════════════════════════════════════════
 * MAIN.JS - THE HEART OF QUANNEX
 * ════════════════════════════════════════════════════════════════════════════════
 *
 * QUANNEX - The Organizational Coherence Engine
 *
 * This is the HEART of the entire system - the mathematical brain that:
 * - Orchestrates all 12 faces, 30 edges, 20 vertices of the dodecahedron
 * - Calculates coherence using PHI-derived formulas
 * - Manages the global Quannex API for all UI components
 *
 * @module js/main
 * @author Deimantas Butrimas & Claude
 * @version 2.1.0 - Gold documentation standard
 * @see {@link ../docs/SYSTEM_ARCHITECTURE.md} - Unified system map
 *
 * ════════════════════════════════════════════════════════════════════════════════
 * NAVIGATION MAP - WHAT THIS FILE CONNECTS TO
 * ════════════════════════════════════════════════════════════════════════════════
 *
 * DEPENDS ON (load before main.js):
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │                                                                              │
 * │  js/constants/phi-harmonics.js ───→ PHI, PSI_3-5, CV_LAMBDA, thresholds    │
 * │  js/core/index.js ────────────────→ TuningConfig, KPI, Face, Edge, Vertex  │
 * │  js/advanced/index.js ────────────→ OrganizationalCoherenceEngine          │
 * │  js/spectral-analyzer.js ─────────→ window.SpectralAnalyzer (eigenvalues)  │
 * │  js/breath-analyzer.js ───────────→ window.BreathAnalyzer (6 axes)         │
 * │  js/data-system/json-data-loader.js ─→ window.JSONDataLoader (optional)    │
 * │                                                                              │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * EXPORTS TO (available after main.js loads):
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │                                                                              │
 * │  window.Quannex ──────────────────→ Global API for all UI components       │
 * │     .init()                         Load default company                    │
 * │     .initWithCompany(data)          Load custom data                        │
 * │     .getState()                     Full system state                       │
 * │     .updateKPI(id, value)           Modify KPI → recalculate               │
 * │     .getBreathAnalysis()            6 breath axes                           │
 * │     .getSpectralAnalysis()          Eigenvalue decomposition                │
 * │     .getShadowAnalysis()            6 ethical patterns                      │
 * │                                                                              │
 * │  window.quannexEngine ────────────→ Direct engine instance access          │
 * │  window.DodecahedronEngine ───────→ Class for advanced use                 │
 * │                                                                              │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * USED BY:
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │                                                                              │
 * │  demo-orchestrator.html ──────────→ Wizard flow (via Quannex.init)         │
 * │  index.html ──────────────────────→ Dashboard (via Quannex.getState)       │
 * │  dodecahedron-3d.html ────────────→ 3D visualization                       │
 * │  breath-analysis.html ────────────→ Breath view                            │
 * │  All UI components ───────────────→ via window.Quannex API                 │
 * │                                                                              │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * ════════════════════════════════════════════════════════════════════════════════
 * NOTES FOR FUTURE CLAUDE - 10 KEY INSIGHTS
 * ════════════════════════════════════════════════════════════════════════════════
 *
 * 1. CLASS EXTRACTION (December 16, 2025):
 *    Core classes were extracted to js/core/ for maintainability:
 *    - TuningConfig → js/core/TuningConfig.js (8 Greek parameters)
 *    - KPI → js/core/KPI.js (individual metric with normalization)
 *    - Face → js/core/Face.js (pentagonal domain with 5 KPIs)
 *    - Edge → js/core/Edge.js (connection between 2 faces)
 *    - Vertex → js/core/Vertex.js (convergence of 3 faces)
 *    They're imported at the top and used exactly as before.
 *
 * 2. PHI_HARMONICS FALLBACK PATTERN:
 *    The IIFE at line ~76 implements graceful degradation:
 *    - If window.PhiHarmonics exists (from phi-harmonics.js): use it
 *    - Otherwise: define locally for standalone/testing use
 *    This allows main.js to work without external dependencies.
 *
 * 3. THE RECALCULATE() FLOW (Most Critical Method):
 *    Called whenever data changes. The order matters!
 *
 *    Pass 1: calculateLocalCoherence() for each face
 *            → Raw coherence from 5 elemental KPIs
 *
 *    Pass 2: calculateAxisInformedEnergy() for each face
 *            → Incorporates opposing face (breath axis feedback)
 *            → Uses axisMap: { 1↔11, 2↔7, 3↔8, 4↔9, 5↔10, 6↔12 }
 *
 *    Pass 3: Breath + Spectral analysis (if 12 faces exist)
 *            → breathAnalyzer.analyze() for 6 breath axes
 *            → spectralAnalyzer.analyze() for eigenmode detection
 *
 *    Pass 3.5: Shadow Detection & Penalty Application
 *              → Detects organizational shadows
 *              → Applies energy penalties (capped at 90% reduction)
 *
 *    Pass 4: Update edges (tension from face energy differences)
 *    Pass 5: Update vertices (vortex energy from 3 converging faces)
 *
 * 4. GLOBAL COHERENCE FORMULA (CV-Penalized):
 *    C = μ × (1 - λ × CV)
 *
 *    Where:
 *    - μ = mean of all 12 face energies
 *    - σ = standard deviation of face energies
 *    - CV = σ/μ (coefficient of variation)
 *    - λ = φ^-3 = 0.236 (PHI-derived variance penalty)
 *
 *    Then: applySensitivityAmplifier() applies logistic S-curve
 *
 *    High mean + low variance = HIGH coherence
 *    High mean + high variance = MODERATE (penalized)
 *    Low mean = LOW regardless of variance
 *
 * 5. THE QUANNEX GLOBAL API:
 *    window.Quannex exposes:
 *    - init(): Load from JSON (with CSV fallback) (default Quannex AI company)
 *    - initWithCompany(company): Load custom company data
 *    - getState(): Full system state for UI
 *    - updateKPI(id, value): Modify single KPI, triggers recalculate
 *    - updateTuning(key, value): Modify tuning parameter
 *    - getBreathAnalysis(): 6 breath axis analysis
 *    - getSpectralAnalysis(): Eigenvector decomposition
 *    - getShadowAnalysis(): Detected shadow patterns
 *    - getTemplates(): Available tuning templates
 *    - applyTemplate(id): Apply startup/enterprise/balanced/nonDual
 *
 * 6. TUNING TEMPLATES:
 *    Four philosophical modes:
 *    - startup: Forgiving (α=0.8, β=1.2) - celebrates progress
 *    - enterprise: Demanding (α=1.2, β=0.9) - excellence expected
 *    - balanced: PHI-defaults (α=1.0, β=1.0) - sacred geometry
 *    - nonDual: Shadow-integrated (α=1.0, lower zeta) - evolved orgs
 *
 * 7. EDGE/VERTEX GENERATION:
 *    If no CSV data, edges/vertices are generated from topology:
 *    - generateEdgesFromTopology(): 30 edges from adjacency list
 *    - generateVerticesFromTopology(): 20 vertices from face triplets
 *    Uses hardcoded dodecahedron topology (fixed by geometry).
 *
 * 8. PRE-CALCULATED RESULTS:
 *    applyPreCalculatedResults() allows orchestrator to provide
 *    face energies directly, bypassing CSV-based calculation.
 *    Critical for wizard → visualization data integrity.
 *
 * 9. KPI FORMAT FLEXIBILITY:
 *    createKPIs() handles both:
 *    - CSV format: KPI_ID, KPI_Name, Face_ID, etc.
 *    - UI format: id, name, faceId, etc.
 *    Logs which format was detected for debugging.
 *
 * 10. CACHED VALUES:
 *     - _cachedGlobalCoherence: Avoids recalculating global coherence
 *     - breathAnalysis, spectralAnalysis: Cached analyzer results
 *     - face._localCoherence: Raw pre-axis coherence
 *     Clear caches in recalculate() to force fresh computation.
 *
 * USED BY:
 * - Every visualization (dodecahedron-3d.html, portrait-view, etc.)
 * - Demo Orchestrator (wizard flow)
 * - All UI components via window.Quannex API
 *
 * GOTCHAS:
 * - SpectralAnalyzer loaded via window (not ES import) due to legacy
 * - BreathAnalyzer is defined inline in this file (should extract)
 * - axisMap hardcodes the 6 breath axis pairs
 * - Shadow penalties can reduce face energy by up to 90%
 * - quannexEngine is a singleton - only one instance exists
 *
 * ════════════════════════════════════════════════════════════════════════════════
 * RISKS & RECOVERY
 * ════════════════════════════════════════════════════════════════════════════════
 *
 * RISK: SpectralAnalyzer not available
 * ─────────────────────────────────────
 * Symptom: "Cannot read properties of undefined" in recalculate()
 * Cause: js/spectral-analyzer.js not loaded before main.js
 * Recovery: Check HTML script order - spectral-analyzer.js MUST load first
 * Prevention: Defensive check: if (window.SpectralAnalyzer) before use
 *
 * RISK: Shadow penalties over-applied
 * ────────────────────────────────────
 * Symptom: Face energies near zero despite good KPIs
 * Cause: Multiple shadow patterns detected, penalties stacking
 * Mitigation: Penalties capped at 90% reduction (10% energy minimum preserved)
 * Recovery: Check shadowAnalysis.patterns for which patterns triggered
 *
 * RISK: Breath axis imbalance cascading
 * ─────────────────────────────────────
 * Symptom: One face's energy drops → opposing face also drops
 * Cause: axisInformedEnergy() creates feedback loop
 * Mitigation: eta (η) caps influence at 38.2% (PHI^-2)
 * Recovery: Check breathAnalysis for axis balance diagnostics
 *
 * RISK: Global coherence stuck at 0
 * ──────────────────────────────────
 * Symptom: coherence.global = 0 despite face energies > 0
 * Cause: CV (coefficient of variation) too high, penalty overcorrected
 * Check: λ = 0.236 in formula C = μ × (1 - λ × CV)
 * Recovery: Ensure face energies are somewhat balanced (CV < 4.2)
 *
 * RISK: CSV parsing silently fails
 * ─────────────────────────────────
 * Symptom: Faces created with default KPIs
 * Cause: CSV columns don't match expected headers (KPI_ID vs kpi_id)
 * Recovery: Check console for "Detected CSV format" or "Detected UI format"
 * Prevention: createKPIs() handles both formats - check format detection
 *
 * RISK: quannexEngine is undefined
 * ─────────────────────────────────
 * Symptom: "Cannot read properties of undefined (reading 'getState')"
 * Cause: main.js loaded but Quannex.init() never called
 * Recovery: Ensure wizard/dashboard calls init() or initWithCompany()
 * Check: typeof window.quannexEngine !== 'undefined'
 *
 * ════════════════════════════════════════════════════════════════════════════════
 */

import { OrganizationalCoherenceEngine } from './advanced/index.js';

// NEW: Import core classes from js/core/ (extracted December 16, 2025)
import { TuningConfig, KPI, Face, Edge, Vertex } from './core/index.js';

// ========================================
// UTILITY: CSV Parser
// ========================================

/**
 * Parse CSV text into array of objects
 * @param {string} csvText - Raw CSV content
 * @returns {Array<Object>} Parsed data with headers as keys
 */
function parseCSV(csvText) {
  const lines = csvText.split('\n').filter(line => line.trim());
  if (lines.length === 0) return [];

  const headers = lines[0].split(',').map(h => h.trim());
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const row = {};

    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });

    data.push(row);
  }

  return data;
}

// ========================================
// [EXTRACTED] TuningConfig -> js/core/TuningConfig.js
// ========================================

// TuningConfig class has been extracted to js/core/TuningConfig.js
// Imported above: import { TuningConfig, ... } from './core/index.js'

// ========================================
// CONSTANTS: Phi-Harmonic Values (Sacred Geometry)
// ========================================

/**
 * Golden Ratio (φ) derived constants for all harmonic calculations.
 * The dodecahedron is constructed from φ, therefore ALL mathematical
 * constants in the system derive from φ for self-similarity at every level.
 *
 * SINGLE SOURCE OF TRUTH: js/constants/phi-harmonics.js
 *
 * This file uses window.PhiHarmonics when available (loaded from phi-harmonics.js),
 * with a fallback for standalone usage (e.g., unit testing).
 *
 * Reference: Master Plan "φ-Harmonic Constant System (AUTHORITATIVE)"
 */

// Check for single-source module (phi-harmonics.js)
const PHI_HARMONICS = (function() {
  // If phi-harmonics.js has loaded, use it as the single source
  if (typeof window !== 'undefined' && window.PhiHarmonics) {
    console.log('📐 main.js: Using PhiHarmonics from single-source module');
    return window.PhiHarmonics;
  }

  // Fallback: Define locally for standalone use or testing
  console.log('📐 main.js: PhiHarmonics not found, using local definition');

  const PHI = (1 + Math.sqrt(5)) / 2;

  const harmonics = {
    // Core phi values
    PHI: PHI,
    PHI_SQUARED: PHI * PHI,

    // PHI Powers (φ^-n) - using both naming conventions
    PHI_1: 1 / PHI,
    PHI_2: 1 / (PHI * PHI),
    PHI_3: 1 / Math.pow(PHI, 3),
    PHI_4: 1 / Math.pow(PHI, 4),

    // Legacy aliases (backward compatibility)
    PHI_INV_1: 1 / PHI,
    PHI_INV_2: 1 / (PHI * PHI),
    PHI_INV_3: 1 / Math.pow(PHI, 3),
    PHI_INV_4: 1 / Math.pow(PHI, 4),

    // PSI values (1 - φ^-n)
    PSI_3: 1 - 1 / Math.pow(PHI, 3),
    PSI_4: 1 - 1 / Math.pow(PHI, 4),
    PSI_5: 1 - 1 / Math.pow(PHI, 5),

    // Numerical stability
    EPSILON: 1e-10,

    // Semantic aliases
    CV_LAMBDA: 1 / Math.pow(PHI, 3),
    BREATH_BASE: PHI,
    MASTERY_THRESHOLD: 1 - 1 / Math.pow(PHI, 3),

    // Curvature parameters
    CURVATURE: Object.freeze({
      survival: 1 / PHI,
      growth: PHI,
      completion: 1.0
    })
  };

  Object.freeze(harmonics);
  return harmonics;
})();

// Export for global access (maintain backward compatibility)
if (typeof window !== 'undefined' && !window.PHI_HARMONICS) {
  window.PHI_HARMONICS = PHI_HARMONICS;
}

// Local PHI constant for direct use in this file
const PHI = PHI_HARMONICS.PHI;

// ========================================
// [EXTRACTED] KPI -> js/core/KPI.js
// ========================================
// KPI class has been extracted to js/core/KPI.js
// Imported above: import { ..., KPI, ... } from './core/index.js'

// ========================================
// [EXTRACTED] Face -> js/core/Face.js
// ========================================
// Face class has been extracted to js/core/Face.js
// Imported above: import { ..., Face, ... } from './core/index.js'

// ========================================
// [EXTRACTED] Edge -> js/core/Edge.js
// ========================================
// Edge class has been extracted to js/core/Edge.js
// Imported above: import { ..., Edge, ... } from './core/index.js'

// ========================================
// [EXTRACTED] Vertex -> js/core/Vertex.js
// ========================================
// Vertex class has been extracted to js/core/Vertex.js
// Imported above: import { ..., Vertex, ... } from './core/index.js'

// ========================================
// ENGINE: Dodecahedron System
// ========================================

/**
 * Main coherence engine orchestrating all 12 faces, 30 edges, 20 vertices
 *
 * REFACTORED December 16, 2025:
 * Core classes have been extracted to js/core/ folder:
 * - TuningConfig -> js/core/TuningConfig.js
 * - KPI -> js/core/KPI.js
 * - Face -> js/core/Face.js
 * - Edge -> js/core/Edge.js
 * - Vertex -> js/core/Vertex.js
 *
 * All classes are imported at the top of this file.
 */
// [REMOVED] Face class body - extracted to js/core/Face.js
// [REMOVED] Edge class body - extracted to js/core/Edge.js
// [REMOVED] Vertex class body - extracted to js/core/Vertex.js
// The actual DodecahedronEngine begins below:

// All Face, Edge, Vertex class definitions have been removed.
// They are now imported from js/core/ at the top of this file.

export class DodecahedronEngine {
  constructor() {
    this.faces = [];
    this.edges = [];
    this.vertices = [];
    this.kpis = new Map(); // id -> KPI object
    this.shadowPatterns = []; // Company shadow patterns
    this.tuning = new TuningConfig(); // Load tuning constants
    this.breathAnalyzer = new BreathAnalyzer(); // Breath analysis

    // Spectral analysis - handle module scope for both ES module and global contexts
    this.spectralAnalyzer = (typeof SpectralAnalyzer !== 'undefined')
      ? new SpectralAnalyzer()
      : (typeof window !== 'undefined' && window.SpectralAnalyzer)
        ? new window.SpectralAnalyzer()
        : null;

    if (!this.spectralAnalyzer) {
      console.warn('SpectralAnalyzer not available - spectral analysis will be skipped');
    }
    this.breathAnalysis = null; // Cached breath analysis
    this.spectralAnalysis = null; // Cached spectral analysis

    // The Advanced Brain
    this.advancedEngine = new OrganizationalCoherenceEngine(this.tuning);
    this.advancedAnalysis = null;
  }

  /**
   * Load CSV file from data folder
   * @param {string} filename - Name of CSV file
   * @returns {Promise<Array<Object>>} Parsed CSV data
   */
  async loadCSV(filename) {
    try {
      // Auto-detect path based on location (works from root or pages/ subdirectory)
      const basePath = window.location.pathname.includes('/pages/') ? '../data/' : './data/';
      const response = await fetch(`${basePath}${filename}`);
      const text = await response.text();
      return parseCSV(text);
    } catch (error) {
      console.error(`Error loading ${filename}:`, error);
      return [];
    }
  }

  // ========================================
  // JSON-FIRST LOADING WITH CSV FALLBACK
  // ========================================

  /**
   * Load data using JSON-first strategy with CSV fallback
   *
   * Uses JSONDataLoader when available for:
   * - Pre-validated JSON data
   * - Pre-computed substitutions (no runtime corruption)
   * - Self-documenting structure with $integrityReport
   *
   * Falls back to CSV loading if JSON unavailable.
   *
   * @param {string} type - Data type ('kpi-database', 'edge-tension', 'vortex-map', 'breath-ratios')
   * @param {string} csvFilename - CSV filename for fallback
   * @returns {Promise<Array<Object>>} Parsed data array
   */
  async loadWithJSONFirst(type, csvFilename) {
    // Check if JSONDataLoader is available
    if (window.JSONDataLoader) {
      try {
        console.log(`📦 Attempting JSON-first load for: ${type}`);
        const jsonData = await window.JSONDataLoader.load(type);

        if (jsonData) {
          // Extract data array from self-documenting JSON structure
          const dataArray = window.JSONDataLoader.extractDataArray(jsonData, type);

          // Log integrity status
          if (jsonData.$integrityReport) {
            const report = jsonData.$integrityReport;
            if (report.substitutionCount > 0) {
              console.log(`📊 ${type}: ${report.substitutionCount} pre-computed substitutions applied`);
            }
            if (!report.topologyValid) {
              console.warn(`⚠️ ${type}: Topology validation failed`);
            }
          }

          console.log(`✅ Loaded ${type} from JSON (${dataArray.length} records)`);
          return this.transformJSONToInternal(dataArray, type);
        }
      } catch (error) {
        console.log(`📦 JSON load failed for ${type}, falling back to CSV:`, error.message);
      }
    }

    // Fallback to CSV
    console.log(`📄 Loading ${type} from CSV: ${csvFilename}`);
    return this.loadCSV(csvFilename);
  }

  /**
   * Transform JSON data format to internal format expected by createKPIs/createEdges/etc.
   *
   * JSON files have a different structure (camelCase, nested objects) that needs
   * to be transformed to the format that createKPIs() and createEdges() expect.
   *
   * @param {Array<Object>} dataArray - Raw data from JSON
   * @param {string} type - Data type
   * @returns {Array<Object>} Transformed data matching internal format
   */
  transformJSONToInternal(dataArray, type) {
    switch (type) {
      case 'kpi-database':
        return dataArray.map(kpi => ({
          // Map JSON format to CSV format expected by createKPIs()
          KPI_ID: kpi.id,
          KPI_Name: kpi.name,
          Face_ID: kpi.faceId,
          Value: kpi.raw?.value ?? kpi.computed?.normalized ?? 0,
          Weight: kpi.weight ?? 1.0,
          Direction: kpi.direction === 'up' ? '↑' : (kpi.direction === 'down' ? '↓' : kpi.direction),
          Target_Min: kpi.raw?.target_min ?? kpi.targetMin ?? 0,
          Target_Ideal: kpi.raw?.target_ideal ?? kpi.targetIdeal ?? 100,
          Healthy_Min: kpi.diagnostics?.healthyMin,
          Healthy_Max: kpi.diagnostics?.healthyMax,
          Absolute_Max: kpi.diagnostics?.absoluteMax,
          Element: kpi.philosophy?.element ?? 'Earth'
        }));

      case 'edge-tension':
        return dataArray.map(edge => ({
          Edge_ID: edge.id,
          Face_A_ID: edge.faceA?.id ?? edge.face1Id,
          Face_B_ID: edge.faceB?.id ?? edge.face2Id,
          'Edge Archytype': edge.philosophy?.element ?? edge.archetype,
          Description: edge.philosophy?.question ?? edge.description
        }));

      case 'vortex-map':
        return dataArray.map(vertex => ({
          Vertex_ID: vertex.id,
          Face_1_ID: vertex.faces?.[0]?.id ?? vertex.faceIds?.[0],
          Face_2_ID: vertex.faces?.[1]?.id ?? vertex.faceIds?.[1],
          Face_3_ID: vertex.faces?.[2]?.id ?? vertex.faceIds?.[2],
          Name: vertex.philosophy?.archetype ?? vertex.name
        }));

      default:
        // Return as-is for unknown types
        return dataArray;
    }
  }

  /**
   * Initialize system from data (JSON-first with CSV fallback)
   *
   * LOADING STRATEGY (December 2025):
   * 1. If JSONDataLoader is available, try JSON files first
   *    - Pre-validated data (no runtime corruption handling needed)
   *    - Pre-computed substitutions tracked in $integrityReport
   *    - Self-documenting structure with $philosophy metadata
   * 2. If JSON fails or JSONDataLoader unavailable, fall back to CSV
   *    - Runtime DataValidator handles corruption
   *    - Original CSV parsing behavior preserved
   *
   * JSON files location: /data/json/{type}.json
   * CSV files location: /data/CSV_{type}.csv
   */
  async initialize() {
    console.log('🌟 Initializing Quannex Coherence Engine...');

    // Detect loading mode
    const loadingMode = window.JSONDataLoader ? 'JSON-first' : 'CSV-only';
    console.log(`📦 Loading mode: ${loadingMode}`);

    // Load data using JSON-first strategy with CSV fallback
    const kpiData = await this.loadWithJSONFirst('kpi-database', 'CSV_KPI_DATABASE.csv');
    const edgeData = await this.loadWithJSONFirst('edge-tension', 'CSV_Edge_tension_Map.csv');
    const vertexData = await this.loadWithJSONFirst('vortex-map', 'CSV_Vortex_Map.csv');

    // NOTE: CSV_FACE_MODELS.csv is NOT loaded here. That file contains a pentagram
    // calculation worksheet (323 rows of formulas), not structured face configuration.
    // Faces are created from hardcoded topology (12 faces) with names from:
    // - Custom company config (via initializeWithCompany), or
    // - Default face names defined in createFaces()

    // Create KPIs
    this.createKPIs(kpiData);

    // Create Faces (from topology, not from CSV)
    this.createFaces();

    // Create Edges and Vertices
    this.createEdges(edgeData);
    this.createVertices(vertexData);

    // Calculate initial state
    this.recalculate();

    console.log('✅ System initialized');
    console.log(`📊 Loaded ${this.faces.length} faces, ${this.kpis.size} KPIs`);
    console.log(`🔷 Loaded ${this.edges.length} edges, ${this.vertices.length} vertices`);
    console.log(`🎯 Global Coherence: ${(this.getGlobalCoherence() * 100).toFixed(1)}%`);
  }

  /**
   * Initialize system with company-specific data
   */
  async initializeWithCompany(company) {
    console.log(`🌟 Initializing with company: ${company.name}`);

    // Clear existing data
    this.faces = [];
    this.edges = [];
    this.vertices = [];
    this.kpis = new Map();
    this.shadowPatterns = company.shadowPatterns || [];

    // Create KPIs from company data
    this.createKPIs(company.kpis);

    // Create Faces (use custom face config if provided)
    this.createFaces(company.faceConfig);

    // Check if pre-calculated coherence results are available
    if (company.coherenceResults && company.coherenceResults.faces) {
      console.log('📊 Using pre-calculated coherence results from orchestrator');
      this.applyPreCalculatedResults(company.coherenceResults);
    } else {
      // Calculate initial state (fallback)
      this.recalculate();
    }

    console.log('✅ Company loaded');
    console.log(`📊 ${company.name}: ${this.faces.length} faces, ${this.kpis.size} KPIs`);
    console.log(`🎯 Global Coherence: ${(this.getGlobalCoherence() * 100).toFixed(1)}%`);
  }

  /**
   * Apply pre-calculated coherence results from orchestrator
   * This ensures data integrity between the wizard and visualization
   */
  applyPreCalculatedResults(coherenceResults) {
    // Apply face energies from pre-calculated results
    coherenceResults.faces.forEach(resultFace => {
      const face = this.faces.find(f => f.id === resultFace.id);
      if (face) {
        // Update face name if different
        if (resultFace.name && resultFace.name !== face.name) {
          face.name = resultFace.name;
        }
        // Apply pre-calculated energy to private cache
        // Note: faceEnergy and healthStatus are getter-only properties,
        // so we set the underlying cache directly
        const energy = resultFace.energy || resultFace.faceEnergy || 0;
        face._faceEnergy = energy;      // Private cache for faceEnergy getter
        face._localCoherence = energy;  // Backup cache (legacy support)

        // Apply KPI values if available
        // Note: normalizedScore is a computed getter in KPI.js that derives from
        // value + direction + boundaries + metricType. We update the underlying
        // value instead, and normalizedScore will compute correctly.
        if (resultFace.kpis && face.elementalKPIs) {
          resultFace.kpis.forEach(resultKpi => {
            const kpi = face.elementalKPIs.find(k => k.id === resultKpi.id);
            if (kpi && resultKpi.value !== undefined) {
              kpi.value = resultKpi.value;  // This triggers normalizedScore recalculation
            }
          });
        }
      }
    });

    // Apply global coherence
    if (coherenceResults.globalCoherence !== undefined) {
      this._cachedGlobalCoherence = coherenceResults.globalCoherence;
    }

    // Create edges and vertices dynamically from faces (if not already created)
    if (this.edges.length === 0) {
      this.generateEdgesFromTopology();
    }
    if (this.vertices.length === 0) {
      this.generateVerticesFromTopology();
    }

    // ════════════════════════════════════════════════════════════════════════════
    // NOTE FOR FUTURE CLAUDE (2025-12-26):
    // ════════════════════════════════════════════════════════════════════════════
    // Previously, this method called `this.runAdvancedAnalysis()` which was a BUG:
    // - The method didn't exist on DodecahedronEngine class
    // - The function exists in dodecahedron-3d.html as window.runAdvancedAnalysis()
    // - The call silently failed (no crash, but no analysis ran)
    //
    // FIX: Advanced analysis (spectral, breath, shadows) is the visualization
    // layer's responsibility, not the data engine's. When dodecahedron-3d.html
    // loads data via switchMode(), it calls window.runAdvancedAnalysis() itself.
    //
    // This method's job is DATA APPLICATION only - applying pre-calculated
    // face energies and global coherence. Analysis happens at visualization level.
    // ════════════════════════════════════════════════════════════════════════════

    console.log('✅ Pre-calculated results applied successfully');
  }

  /**
   * Generate edges dynamically from dodecahedron topology
   * Each face shares an edge with 5 neighbors
   */
  generateEdgesFromTopology() {
    // Dodecahedron edge topology: which faces share edges
    const edgeTopology = [
      [1, 2], [1, 3], [1, 4], [1, 5], [1, 6],
      [2, 3], [2, 7], [2, 11], [2, 6],
      [3, 4], [3, 7], [3, 8],
      [4, 5], [4, 8], [4, 9],
      [5, 6], [5, 9], [5, 10],
      [6, 10], [6, 11],
      [7, 8], [7, 11], [7, 12],
      [8, 9], [8, 12],
      [9, 10], [9, 12],
      [10, 11], [10, 12],
      [11, 12]
    ];

    edgeTopology.forEach(([faceAId, faceBId], index) => {
      const faceA = this.faces.find(f => f.id === faceAId);
      const faceB = this.faces.find(f => f.id === faceBId);

      if (faceA && faceB) {
        const edge = new Edge({
          id: `E${index + 1}`,
          faceAId: faceAId,
          faceBId: faceBId,
          archetype: 'Dynamic',
          description: `${faceA.name} ↔ ${faceB.name}`
        });

        // Calculate edge tension from face energies
        const energyA = faceA.faceEnergy || 0;
        const energyB = faceB.faceEnergy || 0;
        edge._tension = Math.abs(energyA - energyB);
        edge._flow = energyA > energyB ? -1 : (energyB > energyA ? 1 : 0);

        this.edges.push(edge);
      }
    });

    console.log(`🔗 Generated ${this.edges.length} edges from topology`);
  }

  /**
   * Generate vertices dynamically from edge topology
   * Each vertex is where 3 faces meet
   */
  generateVerticesFromTopology() {
    // Dodecahedron vertex topology: which 3 faces meet at each vertex
    const vertexTopology = [
      [1, 2, 3], [1, 3, 4], [1, 4, 5], [1, 5, 6], [1, 6, 2],
      [2, 7, 3], [3, 7, 8], [3, 8, 4], [4, 8, 9], [4, 9, 5],
      [5, 9, 10], [5, 10, 6], [6, 10, 11], [6, 11, 2], [2, 11, 7],
      [7, 12, 8], [8, 12, 9], [9, 12, 10], [10, 12, 11], [11, 12, 7]
    ];

    vertexTopology.forEach((faceIds, index) => {
      const faces = faceIds.map(id => this.faces.find(f => f.id === id)).filter(f => f);

      if (faces.length === 3) {
        const vertex = new Vertex({
          id: `V${index + 1}`,
          faceIds: faceIds,
          archetype: 'Dynamic'
        });

        // Calculate vortex energy
        vertex.calculateVortexEnergy(faces);

        this.vertices.push(vertex);
      }
    });

    console.log(`🌀 Generated ${this.vertices.length} vertices from topology`);
  }

  /**
   * Create KPI objects from data (supports both CSV format and UI format)
   */
  createKPIs(data) {
    console.log(`📊 Creating ${data.length} KPIs...`);
    let csvFormat = 0;
    let uiFormat = 0;

    data.forEach(row => {
      // 🔧 FIX: Support both CSV format (KPI_ID) and UI format (id)
      const kpiId = row.KPI_ID || row.id;
      if (!kpiId) return;

      // Track which format we're using
      if (row.KPI_ID) csvFormat++;
      if (row.id && !row.KPI_ID) uiFormat++;

      // Use DataValidator if available for robust value parsing
      const V = window.DataValidator;
      const kpiName = row.KPI_Name || row.name || kpiId;
      const faceId = parseInt(row.Face_ID !== undefined ? row.Face_ID : row.faceId) || null;

      const kpi = new KPI({
        // Support both formats
        id: kpiId,
        name: kpiName,
        value: V
          ? V.validateNumber(row.Value !== undefined ? row.Value : row.value, `KPI ${kpiId} (${kpiName}) value`, 0)
          : parseFloat(row.Value !== undefined ? row.Value : row.value) || 0,
        weight: V
          ? V.validateNumber(row.Weight !== undefined ? row.Weight : row.weight, `KPI ${kpiId} weight`, 1.0)
          : parseFloat(row.Weight !== undefined ? row.Weight : row.weight) || 1.0,
        direction: row.Direction || row.direction || '↑',
        targetMin: parseFloat(row.Target_Min !== undefined ? row.Target_Min : row.targetMin) || 0,
        targetIdeal: parseFloat(row.Target_Ideal !== undefined ? row.Target_Ideal : row.targetIdeal) || 100,
        healthyMin: parseFloat(row.Healthy_Min !== undefined ? row.Healthy_Min : row.healthyMin),
        healthyMax: parseFloat(row.Healthy_Max !== undefined ? row.Healthy_Max : row.healthyMax),
        absoluteMax: parseFloat(row.Absolute_Max !== undefined ? row.Absolute_Max : row.absoluteMax),
        faceId: faceId,
        element: row.Element || row.element || 'Earth'
      });

      this.kpis.set(kpi.id, kpi);
    });

    console.log(`✅ Created ${this.kpis.size} KPIs (CSV format: ${csvFormat}, UI format: ${uiFormat})`);
  }

  /**
   * Create Face objects
   */
  createFaces(faceConfig = null) {
    let faceNames;

    if (faceConfig && faceConfig.faces && Array.isArray(faceConfig.faces) && faceConfig.faces.length === 12) {
      faceNames = faceConfig.faces.map(f => f.name);
      console.log('✅ Using custom face configuration:', faceConfig.templateName || 'Custom');
    } else {
      faceNames = [
        'Financial Capital', 'Intellectual Capital', 'Human Capital', 'Structural Capital',
        'Market Resonance', 'Community & Partners', 'Brand & Reputation', 'Core Operations',
        'Regenerative Flow', 'Foundational Values', 'Funding Pipeline', 'Risk & Resilience'
      ];
      console.log('ℹ️ Using default face names');
    }

    faceNames.forEach((name, index) => {
      const faceId = index + 1;
      const faceKPIs = Array.from(this.kpis.values())
        .filter(kpi => kpi.faceId === faceId)
        .slice(0, 5);

      const face = new Face({
        id: faceId,
        name: name,
        elementalKPIs: faceKPIs,
        ballKPI: faceKPIs[0] || null
      }, this.tuning); // Pass global tuning to each face

      this.faces.push(face);
    });
  }

  /**
   * Create Edge objects from CSV data
   */
  createEdges(edgeData) {
    if (!edgeData) return;
    console.log(`🔗 Creating Edges from ${edgeData.length} rows...`);

    edgeData.forEach(row => {
      // CSV columns: Edge_ID, Face_A_ID, Face_B_ID, Edge Archytype, Description
      // Note: Face IDs in CSV might be "Face 1", "Face 2" etc. or just numbers.
      // We need to parse them.

      const parseFaceId = (val) => {
        if (typeof val === 'number') return val;
        if (typeof val === 'string') return parseInt(val.replace('Face ', '')) || 0;
        return 0;
      };

      const edge = new Edge({
        id: row.Edge_ID || row.id,
        faceAId: parseFaceId(row.Face_A_ID || row.faceA),
        faceBId: parseFaceId(row.Face_B_ID || row.faceB),
        archetype: row['Edge Archytype'] || row.archetype,
        description: row.Description || row.description
      });

      if (edge.faceAId && edge.faceBId) {
        this.edges.push(edge);
      }
    });
  }

  /**
   * Create Vertex objects from CSV data
   */
  createVertices(vertexData) {
    if (!vertexData) return;
    console.log(`🌀 Creating Vertices from ${vertexData.length} rows...`);

    vertexData.forEach(row => {
      // CSV columns: Vertex_ID, Face_1_ID, Face_2_ID, Face_3_ID

      const parseFaceId = (val) => {
        if (typeof val === 'number') return val;
        if (typeof val === 'string') return parseInt(val.replace('Face ', '')) || 0;
        return 0;
      };

      const f1 = parseFaceId(row.Face_1_ID);
      const f2 = parseFaceId(row.Face_2_ID);
      const f3 = parseFaceId(row.Face_3_ID);

      const vertex = new Vertex({
        id: row.Vertex_ID || row.id,
        faceIds: [f1, f2, f3],
        name: row.Name || `Vortex ${row.Vertex_ID}`
      });

      if (f1 && f2 && f3) {
        this.vertices.push(vertex);
      }
    });
  }

  /**
   * Recalculate entire system state
   * NOW WITH AXIS-INFORMED FEEDBACK LOOP
   */
  recalculate() {
    // Clear corruption log for fresh calculation tracking
    if (window.DataValidator) {
      window.DataValidator.clearLog();
    }

    // Clear cached global coherence (forces recalculation)
    this._cachedGlobalCoherence = undefined;

    // 1. Invalidate all caches
    this.faces.forEach(face => face.invalidateCache());

    // 2. PASS 1: Calculate Local Coherence for all faces
    // This happens automatically when calculateAxisInformedEnergy calls calculateLocalCoherence
    // But we explicitly calculate it here to ensure base states are ready
    this.faces.forEach(face => face.calculateLocalCoherence());

    // 3. PASS 2: Calculate Axis-Informed Energy (The Feedback Loop)
    // We need the Axis Map (Polar Opposites)
    const axisMap = {
      1: 11, 11: 1,
      2: 7, 7: 2,
      3: 8, 8: 3,
      4: 9, 9: 4,
      5: 10, 10: 5,
      6: 12, 12: 6
    };

    this.faces.forEach(face => {
      const opposingId = axisMap[face.id];
      let opposingEnergy = 0;

      if (opposingId) {
        // Find the opposing face object
        const opposingFace = this.faces.find(f => f.id === opposingId);
        if (opposingFace) {
          // Use the opposing face's LOCAL coherence (to avoid infinite recursion)
          // or use its previous state. For simplicity/stability, we use its fresh local coherence.
          opposingEnergy = opposingFace._localCoherence;
        }
      }

      face.calculateAxisInformedEnergy(opposingEnergy);
    });

    // 4. Run Global Analyzers
    if (this.faces.length === 12) {
      this.breathAnalysis = this.breathAnalyzer.analyze(this.faces);

      if (this.spectralAnalyzer) {
        const faceEnergies = this.faces.map(f => f.faceEnergy);
        this.spectralAnalysis = this.spectralAnalyzer.analyze(faceEnergies);
      }

      // 4.5 Shadow Detection and Penalty Application
      // Shadow patterns (e.g., "Brittle Profit") apply penalties to face energies
      if (this.advancedEngine && this.advancedEngine.shadows) {
        try {
          const shadowAnalysis = this.advancedEngine.shadows.analyze(this.faces, this.kpis);

          if (shadowAnalysis && shadowAnalysis.penalties) {
            Object.entries(shadowAnalysis.penalties).forEach(([faceId, penalty]) => {
              const face = this.faces.find(f => f.id === parseInt(faceId));
              if (face && face._faceEnergy !== null && penalty > 0) {
                // Apply penalty: reduce face energy by penalty percentage
                const originalEnergy = face._faceEnergy;
                face._faceEnergy = originalEnergy * (1 - penalty);
                // Cap penalties at 90% reduction
                face._faceEnergy = Math.max(face._faceEnergy, originalEnergy * 0.1);
              }
            });
          }

          // Store shadow analysis for UI access
          this.shadowAnalysis = shadowAnalysis;
        } catch (err) {
          console.warn('Shadow analysis failed:', err);
          this.shadowAnalysis = null;
        }
      }
    }

    // 5. Update Edges
    this.edges.forEach(edge => {
      const faceA = this.faces.find(f => f.id === edge.faceAId);
      const faceB = this.faces.find(f => f.id === edge.faceBId);
      edge.calculateTension(faceA, faceB);
    });

    // 6. Update Vertices
    this.vertices.forEach(vertex => {
      const faces = vertex.faceIds.map(id => this.faces.find(f => f.id === id)).filter(f => f);
      vertex.calculateVortexEnergy(faces);
    });

    // 7. Report any data integrity issues
    if (window.DataValidator) {
      const report = window.DataValidator.getCorruptionReport();
      if (!report.healthy) {
        console.warn(`⚠️ DATA INTEGRITY: ${report.issueCount} issues detected during calculation`);
        console.warn('   Run DataValidator.getCorruptionReport() for details');
      }

      // 8. Emit data integrity update event for UI components (Sprint 6)
      // This triggers IntegrityIndicator and IntegrityOverlay updates
      document.dispatchEvent(new CustomEvent('quannex:data-integrity-updated', {
        detail: report
      }));
    }
  }

  /**
   * Get global coherence score
   *
   * COEFFICIENT OF VARIATION FORMULA: C = μ × (1 - λ × (σ/μ))
   *
   * This penalizes variance while preserving scale-invariance:
   * - μ (mean): Average face energy across all 12 faces
   * - σ (stddev): Standard deviation of face energies
   * - λ (lambda): Variance penalty coefficient = φ^-3 = 0.236
   *
   * The result is bounded to [0, 1] and:
   * - High mean + low variance = high coherence
   * - High mean + high variance = moderate coherence (penalized)
   * - Low mean = low coherence regardless of variance
   */
  getGlobalCoherence() {
    // Use cached value if available (from pre-calculated orchestrator results)
    if (this._cachedGlobalCoherence !== undefined) {
      return this._cachedGlobalCoherence;
    }

    if (this.faces.length === 0) return 0;

    const energies = this.faces.map(face => face.faceEnergy || 0);

    // Calculate mean (μ)
    const mu = energies.reduce((sum, e) => sum + e, 0) / energies.length;

    // Handle edge case of zero or near-zero mean
    const epsilon = (typeof PHI_HARMONICS !== 'undefined')
      ? PHI_HARMONICS.EPSILON
      : 1e-10;

    if (mu <= epsilon) return 0;

    // Calculate standard deviation (σ)
    const variance = energies.reduce((sum, e) => sum + Math.pow(e - mu, 2), 0) / energies.length;
    const sigma = Math.sqrt(variance);

    // Get lambda from PHI_HARMONICS (φ^-3 = 0.236)
    const lambda = (typeof PHI_HARMONICS !== 'undefined')
      ? PHI_HARMONICS.CV_LAMBDA
      : 0.236;

    // CV-penalized coherence: μ × (1 - λ × CV)
    // where CV = σ/μ (coefficient of variation)
    const cv = sigma / mu;
    const rawCoherence = mu * (1 - lambda * cv);

    // Clamp to [0, 1] range
    const clampedCoherence = Math.max(0, Math.min(1, rawCoherence));

    // Apply KAPPA sensitivity amplifier (logistic S-curve)
    // This transforms linear coherence into a more responsive curve
    const amplifiedCoherence = this.tuning.applySensitivityAmplifier(clampedCoherence);

    return amplifiedCoherence;
  }

  /**
   * Get coherence status description
   */
  getCoherenceStatus(coherence) {
    if (coherence >= 0.9) return 'Exceptional';
    if (coherence >= 0.8) return 'Excellent';
    if (coherence >= 0.7) return 'Healthy';
    if (coherence >= 0.6) return 'Moderate';
    if (coherence >= 0.5) return 'Fair';
    if (coherence >= 0.4) return 'Concerning';
    if (coherence >= 0.3) return 'Critical';
    return 'Crisis';
  }

  /**
   * Get system state (for UI)
   */
  getState() {
    return {
      globalCoherence: this.getGlobalCoherence(),
      coherenceStatus: this.getCoherenceStatus(this.getGlobalCoherence()),
      tuning: this.tuning, // Expose tuning to UI
      faces: this.faces.map(face => ({
        id: face.id,
        name: face.name,
        faceEnergy: face.faceEnergy, // Final energy
        localCoherence: face._localCoherence, // Raw local energy (for debug/UI)
        status: face.healthStatus,
        color: face.getEnergyColor(),
        elementalKPIs: face.elementalKPIs.map(kpi => ({
          id: kpi.id,
          name: kpi.name,
          value: kpi.value,
          normalizedScore: kpi.normalizedScore,
          element: kpi.element,
          healthStatus: kpi.healthStatus
        }))
      })),
      edges: this.edges.map(e => ({
        id: e.id,
        tension: e.tension,
        status: e.status,
        archetype: e.archetype,
        faceAId: e.faceAId,
        faceBId: e.faceBId,
        breathRatio: e.breathRatio,
        flowDirection: e.flowDirection,
        element: e.element
      })),
      vertices: this.vertices.map(v => ({
        id: v.id,
        energy: v.vortexEnergy,
        status: v.status,
        faceIds: v.faceIds,
        vortexDirection: v.vortexDirection,
        coherence: v.coherence,
        isLeveragePoint: v.isLeveragePoint
      })),
      shadowPatterns: this.shadowPatterns || [],
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Update a KPI value
   */
  updateKPI(kpiId, newValue) {
    const kpi = this.kpis.get(kpiId);
    if (!kpi) {
      console.error(`KPI ${kpiId} not found`);
      return false;
    }

    kpi.value = newValue;
    this.recalculate();

    console.log(`✅ Updated ${kpi.name} to ${newValue}`);
    console.log(`🎯 New Global Coherence: ${(this.getGlobalCoherence() * 100).toFixed(1)}%`);

    return true;
  }

  /**
   * Update Tuning Configuration
   */
  updateTuning(key, value) {
    if (this.tuning.hasOwnProperty(key)) {
      this.tuning[key] = parseFloat(value);
      console.log(`🎛️ Tuning Updated: ${key} = ${value}`);
      this.recalculate();
      return true;
    }
    return false;
  }
}

// ========================================
// API: Global Interface
// ========================================

// Create global engine instance
const quannexEngine = new DodecahedronEngine();

// Expose API for HTML to use
window.Quannex = {
  /**
   * Initialize the engine
   */
  async init() {
    await quannexEngine.initialize();
    return quannexEngine.getState();
  },

  /**
   * Initialize the engine with company-specific data
   */
  async initWithCompany(company) {
    await quannexEngine.initializeWithCompany(company);
    return quannexEngine.getState();
  },

  /**
   * Get current system state
   */
  getState() {
    return quannexEngine.getState();
  },

  /**
   * Update a KPI value
   */
  updateKPI(kpiId, newValue) {
    return quannexEngine.updateKPI(kpiId, newValue);
  },

  /**
   * Update a Tuning Parameter
   */
  updateTuning(key, value) {
    return quannexEngine.updateTuning(key, value);
  },

  /**
   * Get all faces
   */
  getFaces() {
    return quannexEngine.faces.map(face => ({
      id: face.id,
      name: face.name,
      energy: face.faceEnergy,
      localEnergy: face._localCoherence,
      status: face.healthStatus,
      color: face.getEnergyColor(),
      kpis: face.elementalKPIs.map(kpi => ({
        id: kpi.id,
        name: kpi.name,
        value: kpi.value,
        normalizedScore: kpi.normalizedScore
      }))
    }));
  },

  /**
   * Get all KPIs
   */
  getKPIs() {
    return Array.from(quannexEngine.kpis.values()).map(kpi => ({
      id: kpi.id,
      name: kpi.name,
      value: kpi.value,
      normalizedScore: kpi.normalizedScore,
      faceId: kpi.faceId
    }));
  },

  /**
   * Get breath analysis (6 breath axes)
   */
  getBreathAnalysis() {
    return quannexEngine.breathAnalysis;
  },

  /**
   * Get spectral analysis (eigenvectors)
   */
  getSpectralAnalysis() {
    return quannexEngine.spectralAnalysis;
  },

  /**
   * Get shadow analysis (detected organizational shadows and penalties)
   */
  getShadowAnalysis() {
    return quannexEngine.shadowAnalysis;
  },

  // ════════════════════════════════════════════════════════════════
  // TUNING TEMPLATE API
  // ════════════════════════════════════════════════════════════════

  /**
   * Get available tuning templates
   * @returns {Array<Object>} List of available templates with metadata
   */
  getTemplates() {
    return [
      {
        id: 'startup',
        name: '🌱 Startup Mode',
        philosophy: 'Every step forward is a victory. We celebrate progress.',
        description: 'Forgiving, growth-focused. Best for early-stage startups and turnarounds.',
        create: () => TuningConfig.startupMode()
      },
      {
        id: 'enterprise',
        name: '🏢 Enterprise Mode',
        philosophy: 'Excellence is the expectation. Harmony is non-negotiable.',
        description: 'Demanding, excellence-focused. Best for mature organizations.',
        create: () => TuningConfig.enterpriseMode()
      },
      {
        id: 'balanced',
        name: '⚖️ Balanced Mode',
        philosophy: 'Trust the golden ratio. Let phi guide the way.',
        description: 'Sacred geometry defaults. Best for general use.',
        create: () => TuningConfig.balancedMode()
      },
      {
        id: 'nonDual',
        name: '∞ Non-Dual Mode',
        philosophy: 'We are our shadows. Separation is illusion.',
        description: 'Shadow-integrated, relational. Best for evolved organizations.',
        create: () => TuningConfig.nonDualMode()
      }
    ];
  },

  /**
   * Apply a tuning template by ID
   * @param {string} templateId - One of: 'startup', 'enterprise', 'balanced', 'nonDual'
   * @returns {Object} The new tuning configuration
   */
  applyTemplate(templateId) {
    const templates = {
      startup: TuningConfig.startupMode,
      enterprise: TuningConfig.enterpriseMode,
      balanced: TuningConfig.balancedMode,
      nonDual: TuningConfig.nonDualMode
    };

    const factory = templates[templateId];
    if (!factory) {
      console.warn(`Unknown template: ${templateId}. Available: ${Object.keys(templates).join(', ')}`);
      return null;
    }

    const newConfig = factory();
    quannexEngine.tuning = newConfig;

    // Recalculate all coherence values
    quannexEngine.recalculate();

    console.log(`✨ Applied "${templateId}" tuning template`);
    console.log(`   Philosophy: ${newConfig.getPhilosophy().alpha.meaning}`);

    return newConfig.toJSON();
  },

  /**
   * Get the current tuning philosophy (human-readable explanation)
   * @returns {Object} Philosophy explanation for all parameters
   */
  getTuningPhilosophy() {
    return quannexEngine.tuning.getPhilosophy();
  },

  /**
   * Export current tuning configuration to JSON
   * @returns {Object} Current tuning as JSON
   */
  exportTuning() {
    return quannexEngine.tuning.toJSON();
  },

  /**
   * Import tuning configuration from JSON
   * @param {Object} json - Tuning configuration object
   * @returns {Object} The applied configuration
   */
  importTuning(json) {
    quannexEngine.tuning = TuningConfig.fromJSON(json);
    quannexEngine.recalculate();
    console.log('📥 Imported custom tuning configuration');
    return quannexEngine.tuning.toJSON();
  }
};

// Also expose quannexEngine directly for advanced integrations (like 3D viz)
window.quannexEngine = quannexEngine;

console.log('🌟 Quannex Serverless Engine Loaded');
console.log('💡 Use window.Quannex API to interact with the system');
// Export for global access (backward compatibility)
if (typeof window !== 'undefined') {
  window.DodecahedronEngine = DodecahedronEngine;
}
