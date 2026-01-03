/**
 * ════════════════════════════════════════════════════════════════════════════
 * UX DATA INTEGRITY - TRANSFORMATION SAFETY & PHI CONSTANT PROTECTION
 * ════════════════════════════════════════════════════════════════════════════
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                        NOTES FOR FUTURE CLAUDE                          │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * KEY INSIGHT: Transform Display, Never Data.
 * ─────────────────────────────────────────────────────────────────────────
 * All language register transformations (analytical/balanced/contemplative)
 * operate ONLY at the view layer. Raw data is NEVER modified.
 *
 * THE FOUR-LAYER DATA FLOW:
 * ─────────────────────────────────────────────────────────────────────────
 *   1. RAW DATA (immutable) - from CSV/JSON/API
 *   2. COMPUTED DATA (immutable) - calculations applied
 *   3. DISPLAY DATA (transformed) - register applied ← Transformation here ONLY
 *   4. RENDERED UI - what user sees
 *
 * PHI PROTECTION:
 * ─────────────────────────────────────────────────────────────────────────
 * PHI values (1.618...) and Greek symbols (α, β, γ, δ, etc.) are SACRED.
 * They must NEVER be corrupted by display transformations.
 *
 * NAVIGATION MAP:
 * ─────────────────────────────────────────────────────────────────────────
 *   ↑ IMPORTS FROM:
 *     • js/constants/phi-harmonics.js → PHI values for validation
 *     • js/ux/language-register.js → Current register state
 *
 *   → CONSUMED BY:
 *     • js/ux/language-register.js → Uses validation gates
 *     • js/data-system/data-validator.js → Coordinates with circuit breaker
 *     • Export modules → Ensures raw data integrity on export
 *
 *   ← RELATED TO:
 *     • docs/KPI_DATA_FLOW.md → Documents the data flow architecture
 *     • js/data-system/integrity-orchestrator.js → System-wide integrity
 *
 * ════════════════════════════════════════════════════════════════════════════
 * @file data-integrity.js - UX Data Integrity and Transformation Safety
 * @author Deimantas Murauskas & Claude
 * @version 1.0.0 (Phase 15 - UX Enhancement Addendum)
 * ════════════════════════════════════════════════════════════════════════════
 */

// ════════════════════════════════════════════════════════════════════════════
// SECTION 1: PHI CONSTANTS (LOCAL FALLBACK)
// ════════════════════════════════════════════════════════════════════════════

const PHI = window.PhiHarmonics?.PHI || (1 + Math.sqrt(5)) / 2;
const PHI_INV_1 = window.PhiHarmonics?.PHI_INV_1 || 1 / PHI;
const PHI_INV_2 = window.PhiHarmonics?.PHI_INV_2 || 1 / (PHI * PHI);

// Protected PHI-derived values that must NEVER be transformed
const PROTECTED_PHI_VALUES = [
    1.618033988749895,  // PHI
    0.6180339887498949, // PHI_INV_1
    0.3819660112501051, // PHI_INV_2
    0.7639320225002102, // PSI_3
    0.8541019662496845, // PSI_4
    0.9102392266268373, // PSI_5
];

// Greek symbols that must be preserved
const PROTECTED_GREEK_SYMBOLS = ['α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'κ', 'λ', 'φ', 'ψ'];

// ════════════════════════════════════════════════════════════════════════════
// SECTION 2: TRANSFORMATION SAFETY PRINCIPLE
// ════════════════════════════════════════════════════════════════════════════

const TRANSFORMATION_SAFETY = {

    // ─────────────────────────────────────────────────────────────────────────
    // CORE PRINCIPLE
    // ─────────────────────────────────────────────────────────────────────────

    principle: {
        statement: 'All transformations are VIEW-LAYER only',
        rule: 'Raw data is NEVER modified by language register',
        verification: 'Original values always accessible via data-original attribute'
    },

    // ─────────────────────────────────────────────────────────────────────────
    // DATA FLOW LAYERS
    // ─────────────────────────────────────────────────────────────────────────

    dataFlow: {
        layers: [
            '1. RAW DATA (immutable) - from CSV/JSON/API',
            '2. COMPUTED DATA (immutable) - calculations applied',
            '3. DISPLAY DATA (transformed) - register applied',
            '4. RENDERED UI - what user sees'
        ],
        transformationPoint: 'Between layer 2 and 3 ONLY'
    },

    // ─────────────────────────────────────────────────────────────────────────
    // EXPORT INTEGRITY RULES
    // ─────────────────────────────────────────────────────────────────────────

    exportIntegrity: {
        dataExports: {
            csv: 'ALWAYS raw data, never transformed',
            json: 'ALWAYS raw data, never transformed',
            api: 'ALWAYS raw data, never transformed'
        },
        presentationExports: {
            pdf: 'Use register-appropriate language',
            email: 'Use register-appropriate language',
            slides: 'Use register-appropriate language'
        }
    }
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 3: VALIDATION GATES
// ════════════════════════════════════════════════════════════════════════════

/**
 * Validation gates for transformation safety
 */
const ValidationGates = {

    /**
     * Validate before any transformation
     * @param {Object} data - The data to be transformed
     * @param {string} register - The target register (analytical|balanced|contemplative)
     * @returns {Object} { valid: boolean, errors: string[] }
     */
    beforeTransformation(data, register) {
        const errors = [];

        // Verify register is valid
        const validRegisters = ['analytical', 'balanced', 'contemplative'];
        if (!validRegisters.includes(register)) {
            errors.push(`Invalid register: ${register}. Must be one of: ${validRegisters.join(', ')}`);
        }

        // Verify data exists
        if (data === null || data === undefined) {
            errors.push('Data is null or undefined');
        }

        // Verify data is not a raw CSV/JSON file reference
        if (typeof data === 'string' && (data.endsWith('.csv') || data.endsWith('.json'))) {
            errors.push('Cannot transform raw file reference. Load data first.');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    },

    /**
     * Validate after transformation
     * @param {*} original - Original value
     * @param {*} transformed - Transformed value
     * @returns {Object} { valid: boolean, errors: string[] }
     */
    afterTransformation(original, transformed) {
        const errors = [];

        // Verify output exists
        if (transformed === null || transformed === undefined) {
            errors.push('Transformation produced null/undefined output');
        }

        // Verify no runaway replacement (output not excessively longer)
        if (typeof transformed === 'string' && typeof original === 'string') {
            const lengthRatio = transformed.length / (original.length || 1);
            if (lengthRatio > 10) {
                errors.push(`Runaway replacement detected: output ${lengthRatio.toFixed(1)}x longer than input`);
            }
        }

        // Verify numerical values unchanged
        if (typeof original === 'number' && typeof transformed === 'number') {
            if (original !== transformed) {
                errors.push(`Numerical value corrupted: ${original} → ${transformed}`);
            }
        }

        return {
            valid: errors.length === 0,
            errors
        };
    },

    /**
     * Validate data for export
     * @param {*} data - Data to be exported
     * @param {string} exportType - Type of export (csv|json|pdf|email)
     * @returns {Object} { valid: boolean, errors: string[], isRaw: boolean }
     */
    onExport(data, exportType) {
        const errors = [];
        const dataExportTypes = ['csv', 'json', 'api'];
        const isDataExport = dataExportTypes.includes(exportType);

        // For data exports, verify we're using raw data
        if (isDataExport) {
            // Check if data has transformation markers
            if (data && data._transformedBy) {
                errors.push(`Data export (${exportType}) contains transformed data. Use raw data.`);
            }
        }

        return {
            valid: errors.length === 0,
            errors,
            isRaw: isDataExport
        };
    }
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 4: PHI CONSTANT INTEGRITY
// ════════════════════════════════════════════════════════════════════════════

/**
 * PHI constant integrity protection
 */
const PhiIntegrity = {

    /**
     * Check if a value is a protected PHI constant
     * @param {number} value - The value to check
     * @param {number} tolerance - Tolerance for floating point comparison
     * @returns {boolean}
     */
    isProtectedPhiValue(value, tolerance = 1e-10) {
        if (typeof value !== 'number') return false;
        return PROTECTED_PHI_VALUES.some(phi => Math.abs(value - phi) < tolerance);
    },

    /**
     * Check if a string contains a protected Greek symbol
     * @param {string} text - The text to check
     * @returns {boolean}
     */
    containsProtectedSymbol(text) {
        if (typeof text !== 'string') return false;
        return PROTECTED_GREEK_SYMBOLS.some(symbol => text.includes(symbol));
    },

    /**
     * Get display format for PHI values based on register
     * @param {string} constantName - Name of the constant (phi, gamma, etc.)
     * @param {number} value - The numerical value
     * @param {string} register - The current register
     * @returns {string}
     */
    getDisplayFormat(constantName, value, register) {
        const formats = {
            phi: {
                analytical: `${value.toFixed(3)} (golden ratio)`,
                balanced: `φ = ${value.toFixed(3)} (golden ratio)`,
                contemplative: `φ = ${value.toFixed(3)} (the golden ratio - nature's growth pattern)`
            },
            gamma: {
                analytical: `γ = ${value.toFixed(1)} (domain weight)`,
                balanced: `γ = ${value.toFixed(1)} (ball & pillar balance)`,
                contemplative: `γ = ${value.toFixed(1)} (70% self, 30% connections - the dance of autonomy and relation)`
            },
            alpha: {
                analytical: `α = ${value.toFixed(3)} (synergy blend)`,
                balanced: `α = ${value.toFixed(3)} (synergy blend)`,
                contemplative: `α = ${value.toFixed(3)} (the golden balance of synergy and structure)`
            },
            beta: {
                analytical: `β = ${value.toFixed(1)} (intersection blend)`,
                balanced: `β = ${value.toFixed(1)} (intersection blend)`,
                contemplative: `β = ${value.toFixed(1)} (perfect symmetry in pentagram flow)`
            }
        };

        const constantFormats = formats[constantName.toLowerCase()];
        if (!constantFormats) {
            // Default format for unknown constants
            return `${constantName} = ${value}`;
        }

        return constantFormats[register] || constantFormats.balanced;
    },

    /**
     * Validate that PHI values haven't been corrupted in display
     * @param {HTMLElement} element - The element to validate
     * @returns {Object} { valid: boolean, errors: string[] }
     */
    validateElement(element) {
        const errors = [];

        if (!element) return { valid: true, errors: [] };

        // Check for PHI display corruption
        const text = element.textContent || '';

        // Look for common corruption patterns
        const corruptionPatterns = [
            /1\.618.*1\.618/,  // Doubled PHI
            /φ\s*φ/,          // Doubled phi symbol
            /undefined.*phi/i, // Undefined replacement
        ];

        corruptionPatterns.forEach(pattern => {
            if (pattern.test(text)) {
                errors.push(`PHI corruption detected: ${pattern.toString()}`);
            }
        });

        return {
            valid: errors.length === 0,
            errors
        };
    }
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 5: ROLLBACK CAPABILITY
// ════════════════════════════════════════════════════════════════════════════

/**
 * Rollback capability for transformation recovery
 */
const RollbackCapability = {

    /**
     * Store original value on an element
     * @param {HTMLElement} element - The element
     * @param {*} originalValue - The original value to store
     */
    storeOriginal(element, originalValue) {
        if (!element) return;
        element.setAttribute('data-original', JSON.stringify(originalValue));
        element.setAttribute('data-original-type', typeof originalValue);
    },

    /**
     * Retrieve original value from an element
     * @param {HTMLElement} element - The element
     * @returns {*} The original value
     */
    getOriginal(element) {
        if (!element) return null;

        const stored = element.getAttribute('data-original');
        const type = element.getAttribute('data-original-type');

        if (!stored) return null;

        try {
            const parsed = JSON.parse(stored);
            if (type === 'number') return Number(parsed);
            return parsed;
        } catch (e) {
            return stored;
        }
    },

    /**
     * Show raw value on Alt+Click (tooltip)
     * @param {HTMLElement} element - The element
     * @param {Event} event - The click event
     */
    showRawValue(element, event) {
        if (!event.altKey) return;

        const original = this.getOriginal(element);
        if (original === null) return;

        // Create tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'data-integrity-tooltip';
        tooltip.style.cssText = `
            position: fixed;
            background: #1a1a2e;
            color: #fff;
            padding: 8px 12px;
            border-radius: 4px;
            font-family: 'Fira Code', monospace;
            font-size: 12px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            border: 1px solid #4a4a6a;
            left: ${event.clientX + 10}px;
            top: ${event.clientY + 10}px;
        `;
        tooltip.innerHTML = `
            <div style="color: #888; margin-bottom: 4px;">Raw Value:</div>
            <div style="color: #ffd700;">${original}</div>
        `;

        document.body.appendChild(tooltip);

        // Remove after 3 seconds or on click
        const remove = () => {
            if (tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip);
            }
        };

        setTimeout(remove, 3000);
        tooltip.addEventListener('click', remove);
    },

    /**
     * Initialize Alt+Click handlers on all data elements
     */
    initializeAltClickHandlers() {
        document.addEventListener('click', (event) => {
            const element = event.target.closest('[data-original]');
            if (element) {
                this.showRawValue(element, event);
            }
        });
    }
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 6: REGISTER CHANGE VALIDATION
// ════════════════════════════════════════════════════════════════════════════

/**
 * Validation for register changes mid-session
 */
const RegisterChangeValidation = {

    // State tracking
    _state: {
        currentRegister: 'balanced',
        hasUnsavedReflections: false,
        inProgressRitual: null
    },

    /**
     * Set current state
     */
    setState(key, value) {
        this._state[key] = value;
    },

    /**
     * Validate a register change request
     * @param {string} newRegister - The new register to switch to
     * @returns {Object} { canChange: boolean, warnings: Object[], actions: Function[] }
     */
    validateChange(newRegister) {
        const warnings = [];
        const actions = [];

        // Check for unsaved reflections
        if (this._state.hasUnsavedReflections) {
            warnings.push({
                type: 'unsavedReflections',
                message: 'You have unsaved reflections. Changing language style may affect how they appear.',
                severity: 'warning'
            });
            actions.push({
                label: 'Save first',
                action: () => this._saveReflections()
            });
        }

        // Check for in-progress ritual
        if (this._state.inProgressRitual) {
            warnings.push({
                type: 'midRitual',
                message: 'You are in a guided reflection. Changing style will restart it.',
                severity: 'warning'
            });
            actions.push({
                label: 'Complete first',
                action: () => this._completeRitual()
            });
        }

        return {
            canChange: true, // Always allow, but show warnings
            warnings,
            actions,
            requiresConfirmation: warnings.length > 0
        };
    },

    /**
     * Execute register change after validation
     * @param {string} newRegister - The new register
     */
    executeChange(newRegister) {
        const previousRegister = this._state.currentRegister;
        this._state.currentRegister = newRegister;

        // Dispatch event for other modules
        window.dispatchEvent(new CustomEvent('quannex:register-changed', {
            detail: {
                previous: previousRegister,
                current: newRegister,
                timestamp: Date.now()
            }
        }));

        console.log(`🎭 Register changed: ${previousRegister} → ${newRegister}`);
    },

    // Private helpers
    _saveReflections() {
        console.log('💾 Saving reflections...');
        this._state.hasUnsavedReflections = false;
    },

    _completeRitual() {
        console.log('🙏 Completing ritual...');
        this._state.inProgressRitual = null;
    }
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 7: DATA INTEGRITY ORCHESTRATOR INTEGRATION
// ════════════════════════════════════════════════════════════════════════════

/**
 * Integration with the main data integrity system
 */
const DataIntegrityBridge = {

    /**
     * Check if transformations should be blocked due to data integrity issues
     * @returns {boolean}
     */
    shouldBlockTransformations() {
        // Check circuit breaker state
        if (window.DataValidator?.isCorrupted?.()) {
            console.warn('⚠️ Data integrity compromised. Transformations blocked.');
            return true;
        }
        return false;
    },

    /**
     * Report a transformation integrity violation
     * @param {string} type - Type of violation
     * @param {Object} details - Violation details
     */
    reportViolation(type, details) {
        console.error(`🚨 UX Data Integrity Violation: ${type}`, details);

        // Dispatch event for monitoring
        window.dispatchEvent(new CustomEvent('quannex:integrity-violation', {
            detail: {
                source: 'ux-data-integrity',
                type,
                details,
                timestamp: Date.now()
            }
        }));
    },

    /**
     * Get integrity status summary
     * @returns {Object}
     */
    getStatus() {
        return {
            transformationsBlocked: this.shouldBlockTransformations(),
            currentRegister: RegisterChangeValidation._state.currentRegister,
            phiProtectionActive: true,
            validationGatesActive: true
        };
    }
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 8: SAFE TRANSFORMATION WRAPPER
// ════════════════════════════════════════════════════════════════════════════

/**
 * Safe transformation wrapper that enforces all integrity rules
 * @param {*} data - Data to transform
 * @param {string} register - Target register
 * @param {Function} transformFn - The transformation function
 * @returns {Object} { success: boolean, result: *, errors: string[] }
 */
function safeTransform(data, register, transformFn) {
    const errors = [];

    // Check if transformations are blocked
    if (DataIntegrityBridge.shouldBlockTransformations()) {
        return {
            success: false,
            result: data, // Return original
            errors: ['Transformations blocked due to data integrity issues']
        };
    }

    // Validate before transformation
    const beforeValidation = ValidationGates.beforeTransformation(data, register);
    if (!beforeValidation.valid) {
        return {
            success: false,
            result: data,
            errors: beforeValidation.errors
        };
    }

    // Protect PHI values
    if (PhiIntegrity.isProtectedPhiValue(data)) {
        // Don't transform PHI values, just format them
        return {
            success: true,
            result: PhiIntegrity.getDisplayFormat('phi', data, register),
            errors: []
        };
    }

    // Execute transformation
    let result;
    try {
        result = transformFn(data, register);
    } catch (e) {
        DataIntegrityBridge.reportViolation('transformation-error', { error: e.message });
        return {
            success: false,
            result: data,
            errors: [`Transformation error: ${e.message}`]
        };
    }

    // Validate after transformation
    const afterValidation = ValidationGates.afterTransformation(data, result);
    if (!afterValidation.valid) {
        DataIntegrityBridge.reportViolation('post-transformation', afterValidation.errors);
        return {
            success: false,
            result: data, // Rollback to original
            errors: afterValidation.errors
        };
    }

    // Mark result as transformed (for export validation)
    if (typeof result === 'object' && result !== null) {
        result._transformedBy = register;
        result._originalData = data;
    }

    return {
        success: true,
        result,
        errors: []
    };
}

// ════════════════════════════════════════════════════════════════════════════
// SECTION 9: MODULE EXPORTS
// ════════════════════════════════════════════════════════════════════════════

// Browser export
window.UXDataIntegrity = {
    // Core constants
    TRANSFORMATION_SAFETY,
    PROTECTED_PHI_VALUES,
    PROTECTED_GREEK_SYMBOLS,

    // Validation
    ValidationGates,
    PhiIntegrity,

    // Rollback
    RollbackCapability,

    // Register management
    RegisterChangeValidation,

    // Integration
    DataIntegrityBridge,

    // Main API
    safeTransform,

    // Initialization
    init() {
        RollbackCapability.initializeAltClickHandlers();
        console.log('🛡️ UX Data Integrity initialized');
        console.log('   Alt+Click any transformed value to see raw data');
    }
};

// CommonJS export for Node.js/testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TRANSFORMATION_SAFETY,
        PROTECTED_PHI_VALUES,
        PROTECTED_GREEK_SYMBOLS,
        ValidationGates,
        PhiIntegrity,
        RollbackCapability,
        RegisterChangeValidation,
        DataIntegrityBridge,
        safeTransform
    };
}

// ════════════════════════════════════════════════════════════════════════════
// MODULE LOADED
// ════════════════════════════════════════════════════════════════════════════
console.log('🛡️ UX Data Integrity v1.0.0 loaded');
console.log('   TRANSFORMATION_SAFETY: View-layer only transformations');
console.log('   PHI_PROTECTION: Sacred constants preserved');
console.log('   VALIDATION_GATES: Before/after transformation checks');
console.log('   ROLLBACK: Alt+Click for raw values');
