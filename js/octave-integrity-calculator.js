/**
 * ========================================
 * OCTAVE INTEGRITY CALCULATOR
 * ========================================
 *
 * Implements the Foundation Principle: An organization cannot claim
 * a higher octave than its structural foundation supports.
 *
 * Key concepts:
 * - Face octaves: Individual maturity levels per domain (O1-O7)
 * - Org octave: Constrained by foundation, not elevated by outliers
 * - Spread penalty: Large octave gaps indicate structural misalignment
 * - Coherence: Quality of operation at current octave (not promotion)
 *
 * ========================================
 * THE FOUNDATION PRINCIPLE
 * ========================================
 *
 * High coherence within O1 means *excellence at survival*, NOT promotion to O2.
 * An organization with:
 * - 10 faces at O1
 * - 2 faces at O2
 * - 1 face at O3
 * - 1 face at O6
 *
 * Should result in O1 (due to structural misalignment), not O2 or higher.
 *
 * The formula:
 *   org_octave = floor(geometric_mean(face_octaves) - spread_penalty)
 *
 * Where spread_penalty:
 * - spread <= 2: 0 (healthy variance)
 * - spread = 3: 0.5
 * - spread = 4: 1.0
 * - spread >= 5: 1.5 + (spread - 5) * 0.5 (severe misalignment)
 *
 * ========================================
 * RELATIONSHIP TO CSV DATA
 * ========================================
 *
 * The CSV files (CSV_Dodeca_Engine.csv, CSV_BREATH_RATIOS.csv) only contain
 * O1 (Survival) octave data - this was the original MVP proof-of-concept.
 *
 * Face octave assignments come from:
 * 1. AI story analysis (future)
 * 2. Manual assignment in mapping-context.json
 * 3. User input via Face Wizard
 *
 * CSVs are the SEED (O1 reference), JS is the LIVING TREE (O1-O7 dynamic).
 *
 * See /data/DATA_EVOLUTION_NOTES.md for full context.
 * ========================================
 */

// Wrap in IIFE to avoid global const conflicts with octave-thresholds.js
(function() {
'use strict';

/**
 * ========================================
 * PHI CONSTANTS & OCTAVE DEFINITIONS
 * ========================================
 *
 * These are derived from the unified thresholds file if available,
 * with fallback definitions for standalone use.
 *
 * UNIFIED SOURCE: js/constants/octave-thresholds.js
 * ========================================
 */

// Check if unified thresholds are loaded
const _unifiedThresholds = (typeof window !== 'undefined' && window.OctaveThresholds) || null;

// PHI Constants - use unified if available (local to this IIFE)
const PHI = _unifiedThresholds?.PHI || 1.618033988749895;
const PHI_INVERSE = _unifiedThresholds?.PHI_INVERSE || 0.618033988749895;
const PHI_SQUARED_INVERSE = _unifiedThresholds?.PHI_SQUARED_INVERSE || 0.381966011250105;  // φ^-2

/**
 * Octave definitions with thresholds
 * Uses unified thresholds if available, otherwise fallback
 */
const OCTAVE_DEFINITIONS = _unifiedThresholds?.OCTAVE_THRESHOLDS || {
    O1: { id: 1, name: 'Survival', focus: 'Existence', threshold: 0, color: '#FF4444' },
    O2: { id: 2, name: 'Structure', focus: 'Stability', threshold: PHI_SQUARED_INVERSE, color: '#FF8800' },
    O3: { id: 3, name: 'Relationships', focus: 'Connection', threshold: 0.5, color: '#FFCC00' },
    O4: { id: 4, name: 'Creativity', focus: 'Possibility', threshold: PHI_INVERSE, color: '#44BB44' },
    O5: { id: 5, name: 'Expression', focus: 'Clarity', threshold: 0.764, color: '#00CCCC' },
    O6: { id: 6, name: 'Vision', focus: 'Direction', threshold: 0.854, color: '#4488FF' },
    O7: { id: 7, name: 'Radiance', focus: 'Service', threshold: 0.95, color: '#AA44FF' }
};

/**
 * Lifecycle constraints - maximum octave achievable by lifecycle stage
 * Uses unified thresholds if available, otherwise fallback
 */
const LIFECYCLE_CONSTRAINTS = _unifiedThresholds?.LIFECYCLE_CONSTRAINTS || {
    'pre-seed': { maxOctave: 2, typicalOctave: 1 },
    'seed': { maxOctave: 2, typicalOctave: 1 },
    'early-stage': { maxOctave: 3, typicalOctave: 2 },
    'growth': { maxOctave: 4, typicalOctave: 3 },
    'mature': { maxOctave: 5, typicalOctave: 4 },
    'enterprise': { maxOctave: 6, typicalOctave: 5 },
    'transcendent': { maxOctave: 7, typicalOctave: 6 }
};

/**
 * Calculate organizational octave from individual face octaves
 *
 * @param {Object[]} faces - Array of {id, octave, coherence, name} objects
 * @param {string} lifecycleStage - Optional lifecycle stage for constraint
 * @returns {Object} - {orgOctave, geoMean, spread, penalty, warnings, breakdown}
 */
function calculateOrganizationalOctave(faces, lifecycleStage = null) {
    if (!faces || faces.length === 0) {
        return {
            orgOctave: 1,
            geoMean: 1,
            spread: 0,
            penalty: 0,
            warnings: [{ type: 'error', message: 'No face data provided', severity: 'critical' }],
            breakdown: { min: 1, max: 1, distribution: { O1: 0 } }
        };
    }

    // Extract octave values (default to 1 if not specified)
    const octaves = faces.map(f => {
        const oct = parseInt(f.octave) || 1;
        return Math.max(1, Math.min(7, oct)); // Clamp to 1-7
    });

    const min = Math.min(...octaves);
    const max = Math.max(...octaves);
    const spread = max - min;

    // Calculate geometric mean of face octaves
    const product = octaves.reduce((a, b) => a * b, 1);
    const geoMean = Math.pow(product, 1 / octaves.length);

    // Apply spread penalty
    const penalty = calculateSpreadPenalty(spread);

    // Floor to get discrete octave level (minimum 1)
    let orgOctave = Math.max(1, Math.floor(geoMean - penalty));

    // Apply lifecycle constraint if provided
    if (lifecycleStage && LIFECYCLE_CONSTRAINTS[lifecycleStage]) {
        const constraint = LIFECYCLE_CONSTRAINTS[lifecycleStage];
        if (orgOctave > constraint.maxOctave) {
            orgOctave = constraint.maxOctave;
        }
    }

    // Generate warnings
    const warnings = generateWarnings(spread, min, max, geoMean, penalty, faces);

    return {
        orgOctave,
        orgOctaveName: `O${orgOctave}`,
        orgOctaveInfo: OCTAVE_DEFINITIONS[`O${orgOctave}`],
        geoMean: parseFloat(geoMean.toFixed(3)),
        spread,
        penalty,
        warnings,
        breakdown: {
            min,
            max,
            distribution: getOctaveDistribution(octaves),
            faceDetails: faces.map((f, i) => ({
                id: f.id,
                name: f.name || `Face ${f.id}`,
                octave: octaves[i],
                octaveName: OCTAVE_DEFINITIONS[`O${octaves[i]}`]?.name || 'Unknown'
            }))
        }
    };
}

/**
 * Calculate spread penalty for octave variance
 *
 * @param {number} spread - Difference between max and min octaves
 * @returns {number} Penalty to subtract from geometric mean
 */
function calculateSpreadPenalty(spread) {
    if (spread <= 2) return 0;       // Healthy variance
    if (spread === 3) return 0.5;    // Minor misalignment
    if (spread === 4) return 1.0;    // Moderate misalignment
    // Severe misalignment: 1.5 + 0.5 for each octave beyond 4
    return 1.5 + (spread - 5) * 0.5;
}

/**
 * Get distribution of octaves across faces
 *
 * @param {number[]} octaves - Array of octave numbers
 * @returns {Object} Count per octave level
 */
function getOctaveDistribution(octaves) {
    const dist = {};
    for (let i = 1; i <= 7; i++) {
        const count = octaves.filter(o => o === i).length;
        if (count > 0) {
            dist[`O${i}`] = count;
        }
    }
    return dist;
}

/**
 * Generate warnings based on octave analysis
 *
 * @param {number} spread - Octave spread
 * @param {number} min - Minimum octave
 * @param {number} max - Maximum octave
 * @param {number} geoMean - Geometric mean
 * @param {number} penalty - Applied penalty
 * @param {Object[]} faces - Face array for detailed analysis
 * @returns {Object[]} Array of warning objects
 */
function generateWarnings(spread, min, max, geoMean, penalty, faces) {
    const warnings = [];

    // Structural misalignment warning
    if (spread > 2) {
        warnings.push({
            type: 'structural_misalignment',
            message: `${spread}-octave spread detected (O${min} to O${max})`,
            severity: spread > 4 ? 'critical' : 'warning',
            detail: `The organization has faces operating at very different maturity levels. This indicates uneven development that constrains overall potential.`,
            recommendation: `Focus on strengthening O${min} faces before advancing O${max} faces further.`
        });
    }

    // Penalty applied warning
    if (penalty > 0) {
        warnings.push({
            type: 'penalty_applied',
            message: `Spread penalty of ${penalty.toFixed(1)} applied`,
            severity: 'info',
            detail: `Due to octave variance, organizational octave was reduced from ${geoMean.toFixed(2)} to ${Math.max(1, Math.floor(geoMean - penalty))}`,
            recommendation: 'Reduce octave spread by developing lagging faces.'
        });
    }

    // Foundation weakness warning
    const o1Count = faces.filter(f => (parseInt(f.octave) || 1) === 1).length;
    if (o1Count > faces.length * 0.5) {
        warnings.push({
            type: 'foundation_building',
            message: `${o1Count} of ${faces.length} faces at O1 (Survival)`,
            severity: 'info',
            detail: 'More than half of organizational faces are at survival level. This is normal for early-stage organizations.',
            recommendation: 'Focus on establishing stable foundations before pursuing growth.'
        });
    }

    // Aspirational outlier warning
    const highOctaves = faces.filter(f => (parseInt(f.octave) || 1) >= 5);
    if (highOctaves.length > 0 && min <= 2) {
        const outlierNames = highOctaves.map(f => f.name || `Face ${f.id}`).join(', ');
        warnings.push({
            type: 'aspirational_outlier',
            message: `High-octave faces detected while foundation is weak`,
            severity: 'warning',
            detail: `Faces [${outlierNames}] are at O5+ while some faces are at O1-O2. These advanced faces may be aspirational rather than grounded.`,
            recommendation: 'Verify that high-octave assessments reflect actual capability, not just vision.'
        });
    }

    return warnings;
}

/**
 * Detect octave from coherence score
 * This converts a 0-1 coherence score to an octave level
 *
 * NOTE: This determines quality WITHIN an octave, not promotion TO a higher octave.
 * High coherence at O1 means "excellent survival", not "promote to O2".
 *
 * @param {number} coherence - Coherence score (0-1)
 * @returns {Object} - {octave, octaveName, octaveInfo, coherenceLevel}
 */
function detectOctaveFromCoherence(coherence) {
    // Clamp to valid range
    const c = Math.max(0, Math.min(1, coherence));

    // Determine octave based on PHI thresholds
    let octave = 1;
    if (c >= 0.95) octave = 7;
    else if (c >= 0.854) octave = 6;
    else if (c >= 0.764) octave = 5;
    else if (c >= PHI_INVERSE) octave = 4;
    else if (c >= 0.5) octave = 3;
    else if (c >= PHI_SQUARED_INVERSE) octave = 2;

    // Determine coherence level within the octave
    let coherenceLevel;
    if (c >= 0.85) coherenceLevel = 'excellent';
    else if (c >= 0.7) coherenceLevel = 'good';
    else if (c >= 0.5) coherenceLevel = 'moderate';
    else if (c >= 0.3) coherenceLevel = 'developing';
    else coherenceLevel = 'critical';

    return {
        octave,
        octaveName: `O${octave}`,
        octaveInfo: OCTAVE_DEFINITIONS[`O${octave}`],
        coherenceLevel,
        coherenceValue: parseFloat(c.toFixed(3))
    };
}

/**
 * Calculate face-level coherence from KPI scores
 * Uses geometric mean to ensure no weak element can hide
 *
 * @param {Object[]} kpis - Array of KPI scores for a single face
 * @returns {number} Face coherence (0-1)
 */
function calculateFaceCoherence(kpis) {
    if (!kpis || kpis.length === 0) return 0.5; // Neutral default

    // Normalize KPI values to 0-1 range
    const normalizedScores = kpis.map(kpi => {
        const value = parseFloat(kpi.value) || 0;
        const min = parseFloat(kpi.healthyMin) || 0;
        const max = parseFloat(kpi.healthyMax) || 100;

        if (max <= min) return 0.5; // Invalid range, use neutral

        // Clamp to 0-1
        return Math.max(0, Math.min(1, (value - min) / (max - min)));
    });

    // Geometric mean: ensures one bad score pulls down the whole
    // (value1 * value2 * ... * valueN) ^ (1/N)
    if (normalizedScores.some(s => s === 0)) {
        // If any score is 0, geometric mean is 0
        return 0;
    }

    const product = normalizedScores.reduce((a, b) => a * b, 1);
    return Math.pow(product, 1 / normalizedScores.length);
}

/**
 * Calculate global organizational coherence
 * Geometric mean of all face coherences
 *
 * @param {Object[]} faces - Array of face objects with coherence property
 * @returns {number} Global coherence (0-1)
 */
function calculateGlobalCoherence(faces) {
    if (!faces || faces.length === 0) return 0;

    const coherences = faces.map(f =>
        parseFloat(f.coherence) || parseFloat(f.faceEnergy) || parseFloat(f.sentiment) || 0.5
    );

    if (coherences.some(c => c === 0)) return 0;

    const product = coherences.reduce((a, b) => a * b, 1);
    return Math.pow(product, 1 / coherences.length);
}

// ========================================
// EXPORTS
// ========================================

// Export to window for browser use
if (typeof window !== 'undefined') {
    window.OctaveIntegrityCalculator = {
        calculateOrganizationalOctave,
        calculateSpreadPenalty,
        detectOctaveFromCoherence,
        calculateFaceCoherence,
        calculateGlobalCoherence,
        getOctaveDistribution,
        OCTAVE_DEFINITIONS,
        LIFECYCLE_CONSTRAINTS,
        PHI,
        PHI_INVERSE,
        PHI_SQUARED_INVERSE,
        // Meta info
        usingUnifiedThresholds: !!_unifiedThresholds
    };

    console.log('📊 Octave Integrity Calculator loaded');
    console.log(`   Unified thresholds: ${_unifiedThresholds ? '✅ YES' : '⚠️ Using fallback definitions'}`);
    console.log('   Use OctaveIntegrityCalculator.calculateOrganizationalOctave(faces) to compute org octave');
}

// Note: CommonJS exports removed - this file is designed for browser use via IIFE
// For Node.js testing, import from js/constants/octave-thresholds.js instead

})(); // End IIFE
