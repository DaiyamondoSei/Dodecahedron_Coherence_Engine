/**
 * ========================================
 * DATA TRANSFORMATION LAYER
 * ========================================
 *
 * Transforms data between UI format and Calculation Engine format
 * Provides validation, normalization, and error handling
 *
 * This is the critical "adapter" layer that bridges:
 * - Demo Orchestrator UI → Quannex Engine
 * - User input format → Mathematical calculation format
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

/**
 * Data Transformation Schema
 * --------------------------
 * UI Format (from demo-orchestrator) → Engine Format (for main.js)
 */
class DataTransformer {
    constructor() {
        this.validationErrors = [];

        // Common scale patterns for unit field parsing
        // Format: [regex, minValue, maxValue]
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

    /**
     * Extract scale range from unit string
     * @param {string} unit - The unit string (e.g., "scale 1-5", "percentage")
     * @returns {Object|null} - {min, max} or null if no pattern matched
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

    /**
     * Transform demo data to engine format
     *
     * @param {Object} demoData - Data from demo orchestrator
     * @param {string} demoData.faceConfig - Face configuration
     * @param {string} demoData.kpiMode - "quick" or "full"
     * @param {Array} demoData.kpiData - KPI data from UI
     * @returns {Object} - Engine-compatible company data
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

    /**
     * Validate input data
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

    /**
     * Transform KPI array from UI format to Engine format
     *
     * UI Format:
     * {
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
     * }
     *
     * Engine Format:
     * {
     *   KPI_ID: "F1_E1",
     *   KPI_Name: "Revenue Growth",
     *   Value: 15,
     *   Weight: 1.0,
     *   Direction: "↑",
     *   Target_Min: 0,
     *   Target_Ideal: 100,
     *   Healthy_Min: undefined,
     *   Healthy_Max: undefined,
     *   Absolute_Max: undefined,
     *   Face_ID: 1,
     *   Element: "Earth"
     * }
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

    /**
     * Transform engine results back to UI format
     * (For displaying calculation results in the demo)
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

    /**
     * Validate KPI data quality
     * Returns array of warnings (non-fatal issues)
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
     * Get validation summary
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

/**
 * Create global singleton instance
 */
const dataTransformer = new DataTransformer();

/**
 * Expose to window for use in demo-orchestrator
 */
window.DataTransformer = {
    /**
     * Transform demo data to engine format
     */
    transform: (demoData) => dataTransformer.transformDemoToEngine(demoData),

    /**
     * Transform engine results to UI format
     */
    transformResults: (engineState) => dataTransformer.transformEngineToUI(engineState),

    /**
     * Validate KPI data
     */
    validate: (demoData) => dataTransformer.getValidationSummary(demoData.kpiData),

    /**
     * Get direct access to transformer instance (for advanced use)
     */
    getInstance: () => dataTransformer
};

console.log('✅ Data Transformation Layer loaded');
console.log('💡 Use window.DataTransformer.transform(demoData) to convert UI data to Engine format');
