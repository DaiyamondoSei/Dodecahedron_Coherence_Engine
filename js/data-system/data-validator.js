/**
 * ============================================================================
 * DATA VALIDATOR - INTEGRITY GUARDIAN FOR QUANNEX DATA
 * ============================================================================
 *
 * SINGLE SOURCE OF TRUTH for data validation and defensive defaults.
 *
 * This module protects the system from corrupted or missing data by:
 * 1. Validating all incoming data from CSVs
 * 2. Providing PHI-derived default values
 * 3. Logging meaningful error messages
 * 4. Making corruption VISIBLE rather than silent
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                        NOTES FOR FUTURE CLAUDE                          │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * KEY INSIGHT: Silent failures are the enemy.
 * ─────────────────────────────────────────────────────────────────────────
 * When Face 5 showed 0 coherence, nobody knew why. The system silently
 * accepted corrupted data (`[object Object]`, `Not Found`, empty strings).
 * This module ensures every substitution is visible and logged.
 *
 * PHI-DERIVED DEFAULT VALUES:
 * ─────────────────────────────────────────────────────────────────────────
 * When a value is missing or corrupted, we don't use arbitrary defaults.
 * Instead, we use PHI-derived values to maintain sacred geometry:
 *
 *   PHI_2 = 0.382 (phi^-2)     → Missing energy: struggling but stable
 *   PHI_MIDPOINT = 0.5         → Missing coherence: perfect balance
 *   PHI_1 = 0.618 (phi^-1)     → Missing KPI: generous neutral
 *
 * Why these values?
 * - PHI_2 (0.382): Low but not crisis - represents struggling but stable
 * - PHI_MIDPOINT (0.5): Perfect balance - neutral assumption
 * - PHI_1 (0.618): Above average - generous assumption for missing data
 *
 * NAVIGATION MAP:
 * ─────────────────────────────────────────────────────────────────────────
 *   This module connects to:
 *   - js/constants/phi-harmonics.js → PHI constants source
 *   - js/unified-data-loader.js → Called during CSV parsing
 *   - js/main.js → Called during recalculate()
 *
 * FACE 5 SPECIAL CASE:
 * ─────────────────────────────────────────────────────────────────────────
 *   Face 5 (Market Resonance) has a Ball KPI value of 0 but non-zero pillars.
 *   This is DATA ABSENCE, not corruption. The defensive guard detects this
 *   and uses a pillar-weighted calculation instead of returning 0.
 *
 * ============================================================================
 */

(function () {
  'use strict';

  // ══════════════════════════════════════════════════════════════════════════
  // SECTION 1: PHI-DERIVED CONSTANTS
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * PHI (Golden Ratio) - sourced from phi-harmonics.js if available
   */
  const PHI = (typeof window !== 'undefined' && window.PhiHarmonics?.PHI)
    ? window.PhiHarmonics.PHI
    : (1 + Math.sqrt(5)) / 2; // 1.618033988749895

  const PHI_1 = 1 / PHI;                    // 0.618033988749895
  const PHI_2 = 1 / (PHI * PHI);            // 0.381966011250105
  const PHI_MIDPOINT = (PHI_1 + PHI_2) / 2; // 0.5 exactly

  /**
   * Default values for missing/corrupted data
   * All values are PHI-derived to maintain sacred geometry
   */
  const DEFAULTS = Object.freeze({
    // Face-level defaults
    faceEnergy: PHI_2,           // 0.382 - struggling but stable
    localCoherence: PHI_2,       // 0.382 - same reasoning

    // KPI-level defaults
    kpiValue: PHI_1,             // 0.618 - generous neutral
    kpiNormalized: PHI_MIDPOINT, // 0.5 - perfect balance
    kpiWeight: 1.0,              // Unity - no bias

    // Edge/Vertex defaults
    edgeTension: PHI_2,          // 0.382 - moderate tension
    vortexEnergy: PHI_MIDPOINT,  // 0.5 - balanced vortex

    // Elemental coherence (for "Not Found" cases)
    elementalCoherence: PHI_MIDPOINT  // 0.5 - neutral
  });

  // ══════════════════════════════════════════════════════════════════════════
  // SECTION 2: CORRUPTION DETECTION
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * Known corruption patterns to detect
   */
  const CORRUPTION_PATTERNS = [
    '[object Object]',  // JavaScript serialization failure
    'Not Found',        // Lookup failure in Excel
    '#N/A',             // Excel formula error
    '#REF!',            // Excel reference error
    '#VALUE!',          // Excel value error
    '#DIV/0!',          // Excel division by zero
    'undefined',        // JS undefined serialized
    'null',             // JS null serialized
    'NaN',              // Not a number serialized
    'Infinity',         // STRESS_TEST_FIX [F2]: Infinity as string
    '-Infinity'         // STRESS_TEST_FIX [F2]: Negative Infinity as string
  ];

  /**
   * Check if a value appears corrupted
   *
   * @param {*} value - Value to check
   * @returns {boolean} True if value appears corrupted
   */
  function isCorrupted(value) {
    // Null or undefined
    if (value === undefined || value === null) return true;

    // STRESS_TEST_FIX [F1]: Type guards — objects, arrays, booleans, functions
    // are structurally incompatible with numeric fields. parseFloat([3]) silently
    // returns 3, losing the array context. parseFloat({}) returns NaN but the
    // object's presence indicates a structural error, not a numeric value.
    // Catch these BEFORE they reach parseFloat.
    if (typeof value === 'object') return true;   // includes arrays, Date, etc.
    if (typeof value === 'boolean') return true;   // true/false aren't numeric data
    if (typeof value === 'function') return true;  // code isn't data

    // STRESS_TEST_FIX [F2]: Infinity guard — Infinity is a valid JS number but
    // poisons all downstream math (Infinity * 0 = NaN, Infinity + x = Infinity).
    // isFinite() catches NaN, Infinity, and -Infinity in a single check.
    if (typeof value === 'number') return !isFinite(value);

    // String patterns
    if (typeof value === 'string') {
      const trimmed = value.trim();

      // Empty string
      if (trimmed === '') return true;

      // Known corruption patterns
      return CORRUPTION_PATTERNS.some(pattern =>
        trimmed.includes(pattern)
      );
    }

    return false;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SECTION 3: CORRUPTION LOG
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * Central log of all detected corruption
   * Makes issues VISIBLE for debugging and reporting
   */
  const corruptionLog = [];

  // ══════════════════════════════════════════════════════════════════════════
  // SECTION 3b: STRUCTURED AUDIT TRAIL (Thesis Defense Proof)
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * Structured audit trail for thesis defense.
   * Records every PHI-derived substitution with full traceability:
   * faceId, field, originalValue, substitutedValue, reason, phiDerivation.
   */
  const _auditTrail = [];

  /**
   * Determine a human-readable reason string for why a value was corrupted.
   * @param {*} value - The original corrupted value
   * @returns {string} Reason description
   */
  function _detectReason(value) {
    if (value === undefined) return 'undefined';
    if (value === null) return 'null';
    if (typeof value === 'boolean') return 'boolean detected';
    if (typeof value === 'function') return 'function detected';
    if (Array.isArray(value)) return 'array detected';
    if (typeof value === 'object') return '[object Object]';
    if (typeof value === 'number') {
      if (isNaN(value)) return 'NaN detected';
      if (!isFinite(value)) return value > 0 ? 'Infinity detected' : '-Infinity detected';
    }
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed === '') return 'empty string';
      for (const pattern of CORRUPTION_PATTERNS) {
        if (trimmed.includes(pattern)) return `"${pattern}" detected`;
      }
      // If string but parseFloat fails
      if (isNaN(parseFloat(trimmed))) return 'unparseable string';
    }
    return 'unknown corruption';
  }

  /**
   * Determine the PHI derivation label for a given default value.
   * @param {number} defaultVal - The substituted PHI-derived value
   * @returns {string} Human-readable derivation string
   */
  function _phiDerivationLabel(defaultVal) {
    // Use approximate matching to handle floating-point
    if (Math.abs(defaultVal - PHI_2) < 1e-9) return 'PHI_2 (\u03C6^-2 = 0.382)';
    if (Math.abs(defaultVal - PHI_MIDPOINT) < 1e-9) return 'PHI_MIDPOINT (0.5)';
    if (Math.abs(defaultVal - PHI_1) < 1e-9) return 'PHI_1 (\u03C6^-1 = 0.618)';
    if (defaultVal === 1.0) return 'Unity (1.0)';
    return `custom (${defaultVal})`;
  }

  /**
   * Parse faceId and field name from a context string.
   * Context strings follow patterns like:
   *   "Face 5 (Market Resonance) energy"
   *   "KPI IMC-Score (Initial Message Coherence) on Face 5"
   *   "F10-Ether at V3"
   * @param {string} context
   * @returns {{ faceId: number|null, field: string }}
   */
  function _parseContext(context) {
    let faceId = null;
    let field = context;

    // Try "Face N" pattern
    const faceMatch = context.match(/Face\s+(\d+)/i);
    if (faceMatch) {
      faceId = parseInt(faceMatch[1], 10);
    }

    // Try "F<N>-" pattern (e.g. "F10-Ether")
    if (faceId === null) {
      const fMatch = context.match(/\bF(\d+)-/);
      if (fMatch) {
        faceId = parseInt(fMatch[1], 10);
      }
    }

    // Determine field from context keywords
    if (/energy/i.test(context)) {
      field = 'energy';
    } else if (/coherence/i.test(context)) {
      field = 'coherence';
    } else if (/KPI/i.test(context)) {
      field = 'kpiValue';
    } else if (/pillar/i.test(context)) {
      field = 'pillarScore';
    } else if (/edge/i.test(context)) {
      field = 'edgeTension';
    } else if (/vortex/i.test(context)) {
      field = 'vortexEnergy';
    } else if (/element/i.test(context)) {
      field = 'elementalCoherence';
    }

    return { faceId, field };
  }

  /**
   * Push a structured audit trail entry.
   * @param {string} context - The validation context string
   * @param {*} originalValue - The corrupted/missing value
   * @param {number} substitutedValue - The PHI-derived replacement
   * @param {string} [reasonOverride] - Optional explicit reason
   */
  function _pushAuditEntry(context, originalValue, substitutedValue, reasonOverride) {
    const { faceId, field } = _parseContext(context);
    _auditTrail.push(Object.freeze({
      faceId: faceId,
      field: field,
      originalValue: originalValue,
      substitutedValue: substitutedValue,
      reason: reasonOverride || _detectReason(originalValue),
      phiDerivation: _phiDerivationLabel(substitutedValue)
    }));
  }

  /**
   * Get the current structured audit trail.
   * @returns {Array<Object>} Array of audit trail entries
   */
  function getLastAuditTrail() {
    return [..._auditTrail];
  }

  /**
   * Clear the audit trail (e.g., before a fresh validation run).
   */
  function clearAuditTrail() {
    _auditTrail.length = 0;
  }

  /**
   * Log a corruption instance
   *
   * @param {string} context - Description of where corruption was found
   * @param {*} originalValue - The corrupted value
   * @param {number} substitutedValue - The PHI-derived default used
   */
  function logCorruption(context, originalValue, substitutedValue) {
    const entry = {
      timestamp: new Date().toISOString(),
      context,
      originalValue: String(originalValue),
      substitutedValue
    };
    corruptionLog.push(entry);

    // Keep log manageable (last 100 entries)
    if (corruptionLog.length > 100) {
      corruptionLog.shift();
    }
  }

  /**
   * Get corruption report for display/debugging
   *
   * @returns {Object} Report with healthy status and issues array
   */
  function getCorruptionReport() {
    if (corruptionLog.length === 0) {
      return { healthy: true, issueCount: 0, issues: [] };
    }

    return {
      healthy: false,
      issueCount: corruptionLog.length,
      issues: corruptionLog.map(entry => ({
        context: entry.context,
        original: entry.originalValue,
        substituted: entry.substitutedValue,
        when: entry.timestamp
      }))
    };
  }

  /**
   * Clear the corruption log (e.g., before a fresh calculation)
   */
  function clearLog() {
    corruptionLog.length = 0;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SECTION 4: VALIDATION FUNCTIONS
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * Validate and clean a numeric value
   *
   * @param {*} value - Raw value from CSV/source
   * @param {string} context - Description for logging (e.g., "Face 5 Ball KPI")
   * @param {number} [defaultValue=DEFAULTS.kpiNormalized] - PHI-derived default
   * @returns {number} Validated numeric value
   */
  function validateNumber(value, context, defaultValue = DEFAULTS.kpiNormalized) {
    // Check for corruption
    if (isCorrupted(value)) {
      Logger.warn('DataValidator', `DATA CORRUPTION: ${context}`);
      Logger.debug('DataValidator', `   Raw value: "${value}" → Using default: ${defaultValue.toFixed(6)}`);
      logCorruption(context, value, defaultValue);
      _pushAuditEntry(context, value, defaultValue);
      return defaultValue;
    }

    // Parse as number
    const parsed = parseFloat(value);
    if (isNaN(parsed)) {
      Logger.warn('DataValidator', `PARSE FAILURE: ${context}`);
      Logger.debug('DataValidator', `   Cannot parse: "${value}" → Using default: ${defaultValue.toFixed(6)}`);
      logCorruption(context, value, defaultValue);
      _pushAuditEntry(context, value, defaultValue, 'unparseable string');
      return defaultValue;
    }

    return parsed;
  }

  /**
   * Validate a face energy value (must be 0-1)
   *
   * @param {*} value - Raw face energy value
   * @param {number} faceId - Face ID for logging
   * @param {string} faceName - Face name for logging
   * @returns {number} Validated face energy (0-1)
   */
  function validateFaceEnergy(value, faceId, faceName) {
    const context = `Face ${faceId} (${faceName}) energy`;
    const cleaned = validateNumber(value, context, DEFAULTS.faceEnergy);

    // Clamp to valid range
    if (cleaned < 0 || cleaned > 1) {
      Logger.warn('DataValidator', `OUT OF RANGE: ${context} = ${cleaned}, clamping to [0,1]`);
      return Math.max(0, Math.min(1, cleaned));
    }

    return cleaned;
  }

  /**
   * Validate KPI normalized score (must be 0-1)
   *
   * @param {*} value - Raw KPI score
   * @param {string} kpiId - KPI ID for logging
   * @param {string} kpiName - KPI name for logging
   * @param {number} faceId - Face ID for context
   * @returns {number} Validated KPI score (0-1)
   */
  function validateKPIScore(value, kpiId, kpiName, faceId) {
    const context = `KPI ${kpiId} (${kpiName}) on Face ${faceId}`;
    const cleaned = validateNumber(value, context, DEFAULTS.kpiNormalized);

    // Clamp to valid range
    return Math.max(0, Math.min(1, cleaned));
  }

  /**
   * Validate elemental coherence (for vortex calculations)
   * Special handling for "Not Found" string from CSV
   *
   * @param {*} value - Raw elemental coherence
   * @param {string} elementKey - Element key (e.g., "F10-Ether")
   * @param {string} vertexId - Vertex ID for context
   * @returns {number} Validated coherence (0-1)
   */
  function validateElementalCoherence(value, elementKey, vertexId) {
    const context = `element ${elementKey} at ${vertexId}`;

    // Special handling for "Not Found" string
    if (typeof value === 'string' && value.includes('Not Found')) {
      Logger.warn('DataValidator', `MISSING DATA: ${context}`);
      Logger.debug('DataValidator', '   Using PHI_MIDPOINT (0.5) as neutral default');
      logCorruption(context, value, DEFAULTS.elementalCoherence);
      _pushAuditEntry(context, value, DEFAULTS.elementalCoherence, '"Not Found" detected');
      return DEFAULTS.elementalCoherence;
    }

    return validateNumber(value, context, DEFAULTS.elementalCoherence);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SECTION 5: FACE 5 DEFENSIVE GUARD
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * Calculate defensive local coherence when Ball KPI is 0 but Pillars exist
   *
   * This handles the Face 5 special case where:
   * - Ball KPI (Initial Message Coherence) = 0 (data absence)
   * - Pillar average > 0 (pillars have real data)
   *
   * Standard formula: E_local = gamma * Ball + (1-gamma) * Pillars
   * With gamma = 0.6, Ball = 0 makes E_local = 0 despite pillar activity.
   *
   * Defensive formula: Use gamma = 0.3 to weight pillars more heavily
   *
   * @param {number} ballScore - Ball KPI normalized score
   * @param {number} pillarAvg - Average of 5 pillar KPIs
   * @param {number} [gamma=0.6] - Standard gamma weight
   * @returns {Object} { coherence, wasDefensive }
   */
  function calculateDefensiveCoherence(ballScore, pillarAvg, gamma = 0.6) {
    // Standard calculation
    if (ballScore > 0 || pillarAvg === 0) {
      return {
        coherence: (gamma * ballScore) + ((1 - gamma) * pillarAvg),
        wasDefensive: false
      };
    }

    // DEFENSIVE: Ball = 0 but Pillars > 0
    const defensiveGamma = 0.3; // Weight pillars more heavily
    const coherence = (defensiveGamma * ballScore) + ((1 - defensiveGamma) * pillarAvg);

    Logger.warn('DataValidator', `DEFENSIVE COHERENCE: Ball=0 but Pillars=${pillarAvg.toFixed(4)}`);
    Logger.debug('DataValidator', `   Using gamma=${defensiveGamma} instead of ${gamma}`);
    Logger.debug('DataValidator', `   Result: ${coherence.toFixed(6)} (would have been 0)`);

    return {
      coherence,
      wasDefensive: true
    };
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SECTION 6: EXPORTS
  // ══════════════════════════════════════════════════════════════════════════

  const DataValidator = {
    // Version
    VERSION: '1.0.0',

    // Constants
    PHI,
    PHI_1,
    PHI_2,
    PHI_MIDPOINT,
    DEFAULTS,
    CORRUPTION_PATTERNS,

    // Detection
    isCorrupted,

    // Validation
    validateNumber,
    validateFaceEnergy,
    validateKPIScore,
    validateElementalCoherence,
    calculateDefensiveCoherence,

    // Logging
    logCorruption,
    getCorruptionReport,
    clearLog,

    // Structured Audit Trail (Thesis Defense)
    getLastAuditTrail,
    clearAuditTrail
  };

  // Browser global export
  if (typeof window !== 'undefined') {
    window.DataValidator = DataValidator;

    // Also register with DataSystem if available
    if (window.DataSystem) {
      window.DataSystem.Validator = DataValidator;
    }

    Logger.info('DataValidator', 'DataValidator loaded - Corruption detection active');
  }

  // CommonJS export (for testing)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataValidator;
  }

})();
