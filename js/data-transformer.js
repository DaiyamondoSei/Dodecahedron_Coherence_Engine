/**
 * ========================================
 * DATA TRANSFORMATION LAYER
 * ========================================
 *
 * Transforms data between UI format and Calculation Engine format.
 * Provides validation, normalization, and error handling.
 *
 * This is the critical "adapter" layer that bridges:
 * - Demo Orchestrator UI → Quannex Engine
 * - User input format → Mathematical calculation format
 *
 * @module DataTransformer
 * @see {@link ../js/main.js} - Calculation Engine consumer
 * @see {@link ../js/demo-orchestrator-logic.js} - UI data source
 * @see {@link ../docs/DATA_FLOW_ARCHITECTURE.md} - Complete data pipeline documentation
 *
 * ========================================
 * DATA FLOW ARCHITECTURE
 * ========================================
 *
 * ```
 * Demo Orchestrator UI          DataTransformer           Quannex Engine
 * ┌─────────────────┐         ┌──────────────────┐       ┌─────────────────┐
 * │ User inputs KPIs│ ──────→ │ transformDemoTo  │ ────→ │ calculateAll()  │
 * │ in simple format│         │ Engine()         │       │ in main.js      │
 * └─────────────────┘         └──────────────────┘       └─────────────────┘
 *                                     │
 *                                     ↓
 *                             ┌──────────────────┐
 *                             │ transformEngine  │ ← Results from Engine
 *                             │ ToUI()           │
 *                             └──────────────────┘
 * ```
 *
 * ========================================
 * KNOWN ISSUE FIXED: KPI Range Defaults
 * ========================================
 *
 * Healthy_Min and Healthy_Max can be undefined from user input,
 * causing NaN in face energy calculations when normalized:
 *   normalized = (value - healthyMin) / (healthyMax - healthyMin)
 *
 * Fix: If not provided, derive from Target_Min/Target_Ideal or use defaults.
 * Default range: 0-100 (standard percentage scale)
 *
 * See DATA_EVOLUTION_NOTES.md for context on known gaps.
 * ========================================
 */

// ========================================
// TYPE DEFINITIONS
// ========================================

/**
 * KPI data as provided by the Demo Orchestrator UI.
 * Uses simple property names and minimal required fields.
 *
 * @typedef {Object} UIFormatKPI
 * @property {number} faceId - Face ID this KPI belongs to (1-12)
 * @property {string} faceName - Human-readable face name
 * @property {string} id - KPI identifier (e.g., "F1_K1")
 * @property {string} name - KPI display name
 * @property {number} value - Current KPI value
 * @property {string} [unit] - Unit of measurement (e.g., "percentage", "scale 1-5")
 * @property {string} [direction] - Target direction ("↑" or "↓")
 * @property {number} [targetMin] - Minimum acceptable value
 * @property {number} [targetIdeal] - Ideal/target value
 * @property {number} [healthyMin] - Healthy range minimum
 * @property {number} [healthyMax] - Healthy range maximum
 * @property {number} [absoluteMax] - Absolute maximum possible value
 * @property {string} [element] - Elemental nature (Fire/Water/Earth/Air/Ether)
 * @property {number} [weight] - KPI weight for calculations
 */

/**
 * KPI data in the format required by the Quannex Calculation Engine.
 * Uses CSV-style property names with explicit ranges.
 *
 * @typedef {Object} EngineFormatKPI
 * @property {string} KPI_ID - Unique KPI identifier
 * @property {string} KPI_Name - KPI display name
 * @property {number} Value - Current KPI value
 * @property {number} Weight - KPI weight (default: 1.0)
 * @property {string} Direction - Target direction ("↑" or "↓")
 * @property {number} Target_Min - Minimum acceptable value
 * @property {number} Target_Ideal - Ideal/target value
 * @property {number} Healthy_Min - Healthy range minimum (guaranteed not NaN)
 * @property {number} Healthy_Max - Healthy range maximum (guaranteed not NaN)
 * @property {number} Absolute_Max - Absolute maximum possible value
 * @property {number|null} Face_ID - Face ID this KPI belongs to
 * @property {string} Element - Elemental nature
 * @property {string} [faceName] - Metadata: original face name
 * @property {string} [unit] - Metadata: original unit
 */

/**
 * Input data structure from Demo Orchestrator.
 *
 * @typedef {Object} DemoInputData
 * @property {Object} faceConfig - Face configuration object
 * @property {string} faceConfig.templateName - Company/template name
 * @property {Array<Object>} [faceConfig.faces] - Face definitions
 * @property {string} kpiMode - KPI entry mode ("quick" or "full")
 * @property {Array<UIFormatKPI>} kpiData - Array of KPI data from UI
 */

/**
 * Transformed company data for the Engine.
 *
 * @typedef {Object} EngineCompanyData
 * @property {string} name - Company name
 * @property {Array<EngineFormatKPI>} kpis - Transformed KPI array
 * @property {Object} faceConfig - Original face configuration
 * @property {string} mode - KPI mode used
 * @property {string} timestamp - ISO timestamp of transformation
 */

/**
 * Scale range extracted from unit string.
 *
 * @typedef {Object} ScaleRange
 * @property {number} min - Minimum value of scale
 * @property {number} max - Maximum value of scale
 * @property {string} source - Description of how scale was determined
 */

/**
 * Validation summary result.
 *
 * @typedef {Object} ValidationSummary
 * @property {boolean} valid - True if no errors
 * @property {Array<string>} errors - Fatal validation errors
 * @property {Array<string>} warnings - Non-fatal quality warnings
 * @property {number} kpiCount - Number of KPIs validated
 * @property {string} summary - Human-readable summary message
 */

// ========================================
// DATA TRANSFORMER CLASS
// ========================================

/**
 * Transforms data between Demo Orchestrator UI format and Quannex Engine format.
 *
 * This class handles:
 * - Format conversion (UI → Engine and Engine → UI)
 * - Scale-aware normalization (detects scales from unit strings)
 * - Validation with detailed error/warning reporting
 * - Safe defaults to prevent NaN in calculations
 *
 * @class DataTransformer
 * @example
 * // Basic usage
 * const transformer = new DataTransformer();
 * const engineData = transformer.transformDemoToEngine(demoData);
 *
 * @example
 * // Using global singleton
 * const engineData = window.DataTransformer.transform(demoData);
 * const validation = window.DataTransformer.validate(demoData);
 */
class DataTransformer {

    /**
     * Creates a new DataTransformer instance.
     * Initializes validation state and scale detection patterns.
     *
     * @constructor
     */
    constructor() {
        /**
         * Array of validation errors from last operation.
         * @type {Array<string>}
         */
        this.validationErrors = [];

        /**
         * Common scale patterns for unit field parsing.
         * Each pattern is [RegExp, defaultMin, defaultMax].
         * If regex captures groups, those are used; otherwise defaults apply.
         *
         * @type {Array<[RegExp, number|null, number|null]>}
         * @private
         */
        this.scalePatterns = [
            [/scale\s*(\d+)-(\d+)/i, null, null],           // "scale 1-5", "scale 0-10"
            [/(\d+)-(\d+)\s*scale/i, null, null],           // "1-5 scale"
            [/\((\d+)-(\d+)\)/i, null, null],               // "(1-5)", "(0-100)"
            [/percentage|%/i, 0, 100],                       // "percentage", "%"
            [/ratio/i, 0, 1],                                // "ratio"
            [/score\s*\((\d+)-(\d+)\)/i, null, null],       // "Score (0-5)"
            [/score/i, 0, 5],                                // "score" (default 0-5)
        ];
    }

    // ========================================
    // SCALE DETECTION
    // ========================================

    /**
     * Extracts scale range from a unit string using pattern matching.
     *
     * Supports various formats:
     * - "scale 1-5", "1-5 scale" → {min: 1, max: 5}
     * - "(0-100)" → {min: 0, max: 100}
     * - "percentage", "%" → {min: 0, max: 100}
     * - "ratio" → {min: 0, max: 1}
     * - "score", "Score (0-5)" → {min: 0, max: 5}
     *
     * @param {string} unit - The unit string to parse
     * @returns {ScaleRange|null} Scale range object or null if no pattern matched
     *
     * @example
     * extractScaleFromUnit("scale 1-5")   // → {min: 1, max: 5, source: 'unit pattern: "scale 1-5"'}
     * extractScaleFromUnit("percentage")  // → {min: 0, max: 100, source: 'unit keyword: "percentage"'}
     * extractScaleFromUnit("unknown")     // → null
     */
    extractScaleFromUnit(unit) {
        if (!unit || typeof unit !== 'string') return null;

        for (const [pattern, defaultMin, defaultMax] of this.scalePatterns) {
            const match = unit.match(pattern);
            if (match) {
                // If pattern captures groups, use them; otherwise use defaults
                if (match[1] && match[2]) {
                    return {
                        min: parseInt(match[1]),
                        max: parseInt(match[2]),
                        source: `unit pattern: "${unit}"`
                    };
                } else if (defaultMin !== null && defaultMax !== null) {
                    return {
                        min: defaultMin,
                        max: defaultMax,
                        source: `unit keyword: "${unit}"`
                    };
                }
            }
        }
        return null;
    }

    // ========================================
    // MAIN TRANSFORMATION METHODS
    // ========================================

    /**
     * Transform Demo Orchestrator data to Quannex Engine format.
     *
     * This is the primary entry point for data transformation.
     * It validates input, transforms KPIs, and builds the company object.
     *
     * @param {DemoInputData} demoData - Data from Demo Orchestrator
     * @returns {EngineCompanyData} Engine-compatible company data
     * @throws {Error} If validation fails (missing required fields)
     *
     * @example
     * const demoData = {
     *   faceConfig: { templateName: 'Acme Corp', faces: [...] },
     *   kpiMode: 'full',
     *   kpiData: [
     *     { faceId: 1, name: 'Revenue', value: 85, unit: 'percentage' }
     *   ]
     * };
     *
     * try {
     *   const engineData = transformer.transformDemoToEngine(demoData);
     *   // Use engineData.kpis with main.js calculateAll()
     * } catch (error) {
     *   console.error('Validation failed:', error.message);
     * }
     *
     * @see {@link validateInput} - Called first to validate input
     * @see {@link transformKPIs} - Transforms individual KPIs
     */
    transformDemoToEngine(demoData) {
        console.log('🔄 DATA TRANSFORMER: Starting transformation...');
        console.log('   Input:', {
            faceConfig: demoData.faceConfig?.templateName,
            kpiMode: demoData.kpiMode,
            kpiCount: demoData.kpiData?.length
        });

        this.validationErrors = [];

        // Validate input
        if (!this.validateInput(demoData)) {
            console.error('❌ Validation failed:', this.validationErrors);
            throw new Error(`Validation failed: ${this.validationErrors.join(', ')}`);
        }

        // Transform KPIs to engine format
        const transformedKPIs = this.transformKPIs(demoData.kpiData);

        // Build company object
        const companyData = {
            name: demoData.faceConfig.templateName || 'Demo Company',
            kpis: transformedKPIs,
            faceConfig: demoData.faceConfig, // ✅ Pass face configuration for custom names
            mode: demoData.kpiMode,
            timestamp: new Date().toISOString()
        };

        console.log('✅ DATA TRANSFORMER: Transformation complete');
        console.log('   Output KPIs:', transformedKPIs.length);
        console.log('   Sample:', transformedKPIs[0]);

        return companyData;
    }

    // ========================================
    // VALIDATION METHODS
    // ========================================

    /**
     * Validate input data structure and required fields.
     *
     * Checks for:
     * - Presence of demoData object
     * - Presence of faceConfig
     * - kpiData is a non-empty array
     *
     * Validation errors are stored in `this.validationErrors` array.
     *
     * @param {DemoInputData} demoData - Input data to validate
     * @returns {boolean} True if validation passes, false otherwise
     *
     * @example
     * const isValid = transformer.validateInput(demoData);
     * if (!isValid) {
     *   console.error('Errors:', transformer.validationErrors);
     * }
     *
     * @private
     */
    validateInput(demoData) {
        let valid = true;

        if (!demoData) {
            this.validationErrors.push('demoData is null or undefined');
            return false;
        }

        if (!demoData.faceConfig) {
            this.validationErrors.push('faceConfig is missing');
            valid = false;
        }

        if (!demoData.kpiData || !Array.isArray(demoData.kpiData)) {
            this.validationErrors.push('kpiData is missing or not an array');
            valid = false;
        }

        if (demoData.kpiData && demoData.kpiData.length === 0) {
            this.validationErrors.push('kpiData is empty - no KPIs to process');
            valid = false;
        }

        return valid;
    }

    // ========================================
    // KPI TRANSFORMATION
    // ========================================

    /**
     * Transform KPI array from UI format to Engine format.
     *
     * This is the core transformation logic that handles:
     * - Property name mapping (camelCase → CSV_Style)
     * - Scale detection from unit strings
     * - Safe default values to prevent NaN
     * - Healthy range derivation from targets
     *
     * **Scale Detection Priority:**
     * 1. Explicit healthyMin/Max if provided
     * 2. Target_Min/Target_Ideal if provided
     * 3. Scale extracted from unit string (e.g., "scale 1-5")
     * 4. Default 0-100 (standard percentage scale)
     *
     * @param {Array<UIFormatKPI>} kpiArray - Array of UI-format KPIs
     * @returns {Array<EngineFormatKPI>} Array of Engine-format KPIs
     *
     * @example
     * // Input (UI Format):
     * const uiKPIs = [{
     *   faceId: 1,
     *   faceName: "Financial Capital",
     *   id: "F1_K1",
     *   name: "Revenue Growth",
     *   value: 15,
     *   unit: "percentage",
     *   direction: "↑",
     *   targetMin: 0,
     *   targetIdeal: 100,
     *   element: "Earth"
     * }];
     *
     * // Output (Engine Format):
     * const engineKPIs = transformer.transformKPIs(uiKPIs);
     * // [{
     * //   KPI_ID: "F1_K1",
     * //   KPI_Name: "Revenue Growth",
     * //   Value: 15,
     * //   Weight: 1.0,
     * //   Direction: "↑",
     * //   Target_Min: 0,
     * //   Target_Ideal: 100,
     * //   Healthy_Min: 0,        // Derived from targetMin
     * //   Healthy_Max: 100,      // Derived from targetIdeal
     * //   Absolute_Max: 150,     // Default: 150% of healthy max
     * //   Face_ID: 1,
     * //   Element: "Earth"
     * // }]
     *
     * @see {@link extractScaleFromUnit} - Used for scale detection
     * @private
     */
    transformKPIs(kpiArray) {
        return kpiArray.map((uiKPI, index) => {
            // Parse target ranges first (required for deriving healthy ranges)
            const targetMin = parseFloat(uiKPI.targetMin);
            const targetIdeal = parseFloat(uiKPI.targetIdeal);

            // ========================================
            // SCALE-AWARE NORMALIZATION (Issue #6 Fix)
            // ========================================
            // Priority order for determining scale:
            // 1. Explicit healthyMin/Max if provided
            // 2. Target_Min/Target_Ideal if provided
            // 3. Scale extracted from unit string (e.g., "scale 1-5")
            // 4. Default 0-100 (standard percentage scale)

            // Try to extract scale from unit string first (as fallback)
            const unitScale = this.extractScaleFromUnit(uiKPI.unit);
            const defaultMin = unitScale ? unitScale.min : 0;
            const defaultMax = unitScale ? unitScale.max : 100;

            if (unitScale) {
                console.log(`   📏 KPI ${uiKPI.name}: Detected ${unitScale.source} → range [${unitScale.min}-${unitScale.max}]`);
            }

            // Use explicit values or derive from targets, falling back to unit-derived or default 0-100
            // This prevents NaN in normalization: (value - min) / (max - min)
            const safeTargetMin = isNaN(targetMin) ? defaultMin : targetMin;
            const safeTargetIdeal = isNaN(targetIdeal) ? defaultMax : targetIdeal;

            // Healthy ranges: use provided values, or derive from targets
            let healthyMin = parseFloat(uiKPI.healthyMin);
            let healthyMax = parseFloat(uiKPI.healthyMax);

            // If healthyMin not provided, use targetMin (or scale-derived default)
            if (isNaN(healthyMin)) {
                healthyMin = safeTargetMin;
            }

            // If healthyMax not provided, use targetIdeal (or scale-derived default)
            if (isNaN(healthyMax)) {
                healthyMax = safeTargetIdeal;
            }

            // Safety: ensure max > min to prevent division by zero
            if (healthyMax <= healthyMin) {
                console.warn(`   ⚠️ KPI ${uiKPI.name}: Invalid range (max ${healthyMax} <= min ${healthyMin}). Using scale-derived or default range.`);
                healthyMin = defaultMin;
                healthyMax = defaultMax;
            }

            // Map UI properties to Engine properties
            const engineKPI = {
                // Required fields
                KPI_ID: uiKPI.id || `KPI_${index + 1}`,
                KPI_Name: uiKPI.name || 'Unnamed KPI',
                Value: parseFloat(uiKPI.value) || 0,
                Weight: parseFloat(uiKPI.weight) || 1.0,
                Direction: uiKPI.direction || '↑',

                // Target ranges (safe values)
                Target_Min: safeTargetMin,
                Target_Ideal: safeTargetIdeal,

                // Healthy ranges (guaranteed valid - prevents NaN)
                Healthy_Min: healthyMin,
                Healthy_Max: healthyMax,
                Absolute_Max: parseFloat(uiKPI.absoluteMax) || healthyMax * 1.5, // Default to 150% of healthy max

                // Organizational context
                Face_ID: parseInt(uiKPI.faceId) || null,
                Element: uiKPI.element || 'Earth',

                // Metadata (optional, for debugging)
                faceName: uiKPI.faceName,
                unit: uiKPI.unit
            };

            // Log transformation for debugging
            console.log(`   📋 KPI ${index + 1}:`, {
                from: `${uiKPI.name} = ${uiKPI.value}`,
                to: `${engineKPI.KPI_Name} = ${engineKPI.Value}`,
                face: engineKPI.Face_ID,
                element: engineKPI.Element,
                range: `[${engineKPI.Healthy_Min}-${engineKPI.Healthy_Max}]`
            });

            return engineKPI;
        });
    }

    // ========================================
    // RESULT TRANSFORMATION
    // ========================================

    /**
     * Transform Quannex Engine results back to UI-friendly format.
     *
     * Used for displaying calculation results in the Demo Orchestrator.
     * Extracts key metrics and formats them for visualization.
     *
     * @param {Object} engineState - State object from Quannex Engine
     * @param {number} engineState.globalCoherence - Overall coherence score (0-1)
     * @param {string} engineState.coherenceStatus - Status label
     * @param {Array} engineState.faces - Array of face calculation results
     * @param {string} engineState.timestamp - Calculation timestamp
     * @returns {Object} UI-friendly result object
     * @returns {number} return.globalCoherence - Overall coherence score
     * @returns {string} return.coherenceStatus - Status label
     * @returns {Array} return.faces - Simplified face array
     * @returns {string} return.timestamp - Calculation timestamp
     *
     * @example
     * const engineResults = await engine.calculateAll();
     * const uiResults = transformer.transformEngineToUI(engineResults);
     * updateDashboard(uiResults);
     */
    transformEngineToUI(engineState) {
        console.log('🔄 DATA TRANSFORMER: Transforming results to UI format...');

        return {
            globalCoherence: engineState.globalCoherence,
            coherenceStatus: engineState.coherenceStatus,
            faces: engineState.faces.map(face => ({
                id: face.id,
                name: face.name,
                energy: face.faceEnergy || face.energy || 0,
                status: face.status,
                color: face.color,
                kpis: face.elementalKPIs || []
            })),
            timestamp: engineState.timestamp
        };
    }

    // ========================================
    // QUALITY VALIDATION
    // ========================================

    /**
     * Validate KPI data quality and return non-fatal warnings.
     *
     * Unlike `validateInput()`, this checks for data quality issues
     * that won't prevent calculation but may indicate problems:
     * - Missing KPI names
     * - Invalid target ranges (min >= ideal)
     * - Negative values
     * - Missing face assignments
     *
     * @param {Array<UIFormatKPI>} kpiArray - Array of KPIs to validate
     * @returns {Array<string>} Array of warning messages (empty if no issues)
     *
     * @example
     * const warnings = transformer.validateKPIQuality(kpiData);
     * if (warnings.length > 0) {
     *   console.warn('Data quality issues:', warnings);
     * }
     */
    validateKPIQuality(kpiArray) {
        const warnings = [];

        kpiArray.forEach((kpi, index) => {
            // Check for missing values
            if (!kpi.name || kpi.name.trim() === '') {
                warnings.push(`KPI ${index + 1}: Missing name`);
            }

            // Check for invalid ranges
            if (kpi.targetMin >= kpi.targetIdeal) {
                warnings.push(`KPI ${index + 1} (${kpi.name}): Target Min (${kpi.targetMin}) >= Target Ideal (${kpi.targetIdeal})`);
            }

            // Check for extreme values
            if (kpi.value < 0) {
                warnings.push(`KPI ${index + 1} (${kpi.name}): Negative value (${kpi.value})`);
            }

            // Check for missing face assignment
            if (!kpi.faceId) {
                warnings.push(`KPI ${index + 1} (${kpi.name}): No face assigned`);
            }
        });

        return warnings;
    }

    /**
     * Get comprehensive validation summary combining errors and warnings.
     *
     * Combines results from `validateInput()` (fatal errors) and
     * `validateKPIQuality()` (quality warnings) into a single summary.
     *
     * @param {Array<UIFormatKPI>} kpiArray - Array of KPIs to validate
     * @returns {ValidationSummary} Complete validation status
     *
     * @example
     * const summary = transformer.getValidationSummary(kpiData);
     * if (summary.valid) {
     *   console.log(summary.summary); // "✅ Data is valid..."
     * } else {
     *   console.error('Errors:', summary.errors);
     *   console.warn('Warnings:', summary.warnings);
     * }
     *
     * @see {@link validateInput} - Provides error list
     * @see {@link validateKPIQuality} - Provides warning list
     */
    getValidationSummary(kpiArray) {
        const warnings = this.validateKPIQuality(kpiArray);

        return {
            valid: this.validationErrors.length === 0,
            errors: this.validationErrors,
            warnings: warnings,
            kpiCount: kpiArray.length,
            summary: this.validationErrors.length === 0
                ? '✅ Data is valid and ready for calculation'
                : `❌ ${this.validationErrors.length} error(s), ${warnings.length} warning(s)`
        };
    }
}

// ========================================
// GLOBAL SINGLETON EXPORT
// ========================================

/**
 * Private singleton instance of DataTransformer.
 * Access through window.DataTransformer methods.
 *
 * @type {DataTransformer}
 * @private
 */
const dataTransformer = new DataTransformer();

/**
 * Global DataTransformer API exposed on window object.
 *
 * Provides simplified access to transformation functions
 * for use in Demo Orchestrator and other UI components.
 *
 * @namespace window.DataTransformer
 * @example
 * // Transform UI data to Engine format
 * const engineData = window.DataTransformer.transform(demoData);
 *
 * // Validate data before transformation
 * const validation = window.DataTransformer.validate(demoData);
 *
 * // Transform engine results back to UI format
 * const uiResults = window.DataTransformer.transformResults(engineState);
 */
window.DataTransformer = {
    /**
     * Transform Demo Orchestrator data to Quannex Engine format.
     *
     * @function transform
     * @memberof window.DataTransformer
     * @param {DemoInputData} demoData - Data from Demo Orchestrator
     * @returns {EngineCompanyData} Engine-compatible company data
     * @throws {Error} If validation fails
     */
    transform: (demoData) => dataTransformer.transformDemoToEngine(demoData),

    /**
     * Transform Quannex Engine results to UI-friendly format.
     *
     * @function transformResults
     * @memberof window.DataTransformer
     * @param {Object} engineState - State object from Quannex Engine
     * @returns {Object} UI-friendly result object
     */
    transformResults: (engineState) => dataTransformer.transformEngineToUI(engineState),

    /**
     * Validate KPI data and get comprehensive summary.
     *
     * @function validate
     * @memberof window.DataTransformer
     * @param {DemoInputData} demoData - Data to validate
     * @returns {ValidationSummary} Validation result with errors and warnings
     */
    validate: (demoData) => dataTransformer.getValidationSummary(demoData.kpiData),

    /**
     * Get direct access to the DataTransformer instance.
     * Use for advanced operations not exposed via the simple API.
     *
     * @function getInstance
     * @memberof window.DataTransformer
     * @returns {DataTransformer} The singleton instance
     */
    getInstance: () => dataTransformer
};

// ========================================
// MODULE INITIALIZATION LOG
// ========================================

console.log('✅ Data Transformation Layer loaded');
console.log('💡 Use window.DataTransformer.transform(demoData) to convert UI data to Engine format');
