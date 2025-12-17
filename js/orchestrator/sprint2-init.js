/* ============================================================================
 * SPRINT 2 INITIALIZATION MODULE
 * ============================================================================
 *
 * Purpose:     Single entry point for Sprint 2 AI Integration components
 * Parent:      demo-orchestrator.html
 * Depends:     ES modules from js/ai/*, js/advanced/shadow-detector.js
 *
 * Import Tree:
 *   sprint2-init.js
 *   ├── ai/core/
 *   │   ├── mapping-context.js      → MappingContext singleton
 *   │   ├── validation-gate.js      → ValidationGate (empowering messages)
 *   │   └── name-propagator.js      → NamePropagator (face name sync)
 *   ├── ai/ui/
 *   │   ├── api-key-manager.js      → APIKeyManager (Gemini key handling)
 *   │   ├── mode-selector.js        → ModeSelector (quick/full mode)
 *   │   ├── archetype-selector.js   → ArchetypeSelector (startup/growth/etc)
 *   │   ├── lens-pre-selector.js    → LensPreSelector (growth/stability/innovation)
 *   │   └── vocabulary-style-selector.js → VocabularyStyleSelector
 *   ├── ai/tuning/
 *   │   ├── archetype-presets.js    → ARCHETYPE_PRESETS, PHI
 *   │   └── octave-modifiers.js     → OCTAVE_*_MODIFIERS, helpers
 *   ├── ai/kpi-extractor.js         → KPIExtractionPanel
 *   └── advanced/shadow-detector.js → ShadowDetector, SHADOW_CONFIG
 *
 * Exports:
 *   - initSprint2()                 → Main initialization function
 *   - updateValidationUI(validation)→ UI helper for validation display
 *   - showSprint2Panel()            → Show config panel
 *   - hideSprint2Panel()            → Hide config panel
 *
 * Global Exposure:
 *   - window.Sprint2                → All Sprint 2 components and helpers
 *   - window.ShadowDetector         → Shadow detection for custom paths
 *   - window.SHADOW_CONFIG          → Shadow configuration constants
 *   - window.lensPreSelector        → Direct lens access
 *   - window.vocabularyStyleSelector→ Direct vocabulary access
 *   - window.kpiExtractionPanel     → Direct KPI panel access
 *   - window.extractedKPIResult     → Last extraction result
 *
 * Initialization:
 *   Called automatically on DOMContentLoaded when this module loads.
 *   Components are initialized in dependency order:
 *   1. MappingContext (singleton)
 *   2. ValidationGate
 *   3. APIKeyManager → api-key-manager-container
 *   4. ModeSelector → mode-selector-container
 *   5. ArchetypeSelector → archetype-selector-container
 *   6. LensPreSelector → lens-pre-selector-container
 *   7. VocabularyStyleSelector → vocabulary-style-container
 *   8. KPIExtractionPanel → kpi-extraction-container
 *
 * @version Sprint 2 - AI Integration
 * @created 2025-01 (extracted from inline script)
 * ============================================================================
 */

// ============================================================================
// IMPORTS
// ============================================================================

// Core AI modules
import { MappingContext } from '../ai/core/mapping-context.js';
import { ValidationGate } from '../ai/core/validation-gate.js';
import { NamePropagator } from '../ai/core/name-propagator.js';

// UI Components
import { APIKeyManager } from '../ai/ui/api-key-manager.js';
import { ModeSelector } from '../ai/ui/mode-selector.js';
import { ArchetypeSelector } from '../ai/ui/archetype-selector.js';
import { LensPreSelector } from '../ai/ui/lens-pre-selector.js';
import { VocabularyStyleSelector } from '../ai/ui/vocabulary-style-selector.js';

// KPI Extraction
import { KPIExtractionPanel } from '../ai/kpi-extractor.js';

// Tuning presets and modifiers
import { ARCHETYPE_PRESETS, PHI } from '../ai/tuning/archetype-presets.js';
import {
    OCTAVE_KAPPA_MODIFIERS,
    OCTAVE_DELTA_MODIFIERS,
    OCTAVE_GAMMA_MODIFIERS,
    getOctaveModifier,
    applyOctaveModifiers
} from '../ai/tuning/octave-modifiers.js';

// Shadow detection for custom path analysis
import { ShadowDetector, SHADOW_CONFIG } from '../advanced/shadow-detector.js';


// ============================================================================
// GLOBAL EXPOSURE (for non-module scripts)
// ============================================================================

// Expose ShadowDetector globally for demo-orchestrator-logic.js
window.ShadowDetector = ShadowDetector;
window.SHADOW_CONFIG = SHADOW_CONFIG;


// ============================================================================
// UI HELPERS
// ============================================================================

/**
 * Update validation UI with color-coded indicators
 * Sprint 2 FIX: Red/amber/green indicators based on completion percentage
 *
 * @param {Object} validation - Validation state from ValidationGate
 * @param {boolean} validation.isComplete - Whether all 12 faces are complete
 * @param {number} validation.percentage - Completion percentage (0-100)
 * @param {number} validation.completedFaces - Number of completed faces
 * @param {Object} validation.message - Display message object
 */
export function updateValidationUI(validation) {
    const container = document.getElementById('validation-gate-container');
    if (!container) return;

    const message = validation.message;

    // Sprint 2 Task 15: Color-coded indicators based on completion
    let borderColor, textColor, progressGradient, statusIcon;

    if (validation.isComplete) {
        // Green for complete
        borderColor = '#00ff88';
        textColor = '#00ff88';
        progressGradient = 'linear-gradient(90deg, #00ffcc, #00ff88)';
        statusIcon = '✅';
    } else if (validation.percentage >= 50) {
        // Amber for partial completion (50%+)
        borderColor = '#ffcc00';
        textColor = '#ffcc00';
        progressGradient = 'linear-gradient(90deg, #ff6b6b, #ffcc00)';
        statusIcon = '⚠️';
    } else {
        // Red for low completion (<50%)
        borderColor = '#ff6b6b';
        textColor = '#ff6b6b';
        progressGradient = 'linear-gradient(90deg, #ff4444, #ff6b6b)';
        statusIcon = '🔴';
    }

    container.innerHTML = `
        <div style="padding: 12px; background: rgba(0,0,0,0.2); border-radius: 8px; border-left: 3px solid ${borderColor};">
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 24px;">${validation.isComplete ? message.icon : statusIcon}</span>
                <div style="flex: 1;">
                    <div style="font-weight: 600; color: ${textColor};">
                        ${message.title}
                    </div>
                    <div style="font-size: 12px; color: rgba(255,255,255,0.7);">
                        ${message.message}
                    </div>
                    ${message.encouragement ? `<div style="font-size: 11px; color: rgba(255,255,255,0.5); margin-top: 4px;">${message.encouragement}</div>` : ''}
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 20px; font-weight: 700; color: ${textColor};">${validation.percentage}%</div>
                    <div style="font-size: 10px; color: rgba(255,255,255,0.5);">${validation.completedFaces}/12 faces</div>
                </div>
            </div>
            <div style="margin-top: 10px; height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden;">
                <div style="width: ${validation.percentage}%; height: 100%; background: ${progressGradient}; transition: width 0.5s ease;"></div>
            </div>
            ${!validation.isComplete ? `
            <div style="margin-top: 8px; font-size: 11px; color: ${borderColor};">
                ⚠️ Complete all 12 faces to proceed to the next step
            </div>
            ` : ''}
        </div>
    `;
}


/**
 * Show Sprint 2 config panel when AI Story Mode is selected
 */
export function showSprint2Panel() {
    const panel = document.getElementById('sprint2-config-panel');
    if (panel) {
        panel.style.display = 'block';
    }
}


/**
 * Hide Sprint 2 config panel
 */
export function hideSprint2Panel() {
    const panel = document.getElementById('sprint2-config-panel');
    if (panel) {
        panel.style.display = 'none';
    }
}


// ============================================================================
// MAIN INITIALIZATION
// ============================================================================

/**
 * Initialize all Sprint 2 AI Integration components
 * Called automatically on DOMContentLoaded
 */
export function initSprint2() {
    console.log('🚀 Sprint 2: Initializing AI Integration modules...');

    // Get singleton MappingContext
    const mappingContext = MappingContext.getInstance();

    // Initialize Validation Gate with empowering messaging
    const validationGate = new ValidationGate({
        onValidationChange: (validation) => {
            console.log('📋 Validation update:', validation.stage, validation.percentage + '%');
            updateValidationUI(validation);
        }
    });

    // Initialize API Key Manager with proper init() call
    const apiKeyManager = new APIKeyManager({
        onStatusChange: (status, message) => {
            console.log('🔑 API Key status:', status, message);
        },
        onKeyValidated: (isValid) => {
            console.log('🔑 API Key validated:', isValid);
            // Provider is set via face-wizard.js selectProvider()
        }
    });
    apiKeyManager.init('api-key-manager-container');

    // Initialize Mode Selector with proper init() call
    const modeSelector = new ModeSelector({
        onModeChange: (modeId, modeConfig) => {
            console.log('⚡ Mode changed:', modeId, modeConfig);
            mappingContext.setMode(modeId);
        }
    });
    modeSelector.init('mode-selector-container');

    // Initialize Archetype Selector with proper init() call
    const archetypeSelector = new ArchetypeSelector({
        onArchetypeChange: (archetypeId, archetype) => {
            console.log('🎭 Archetype changed:', archetypeId, archetype);
        },
        onPresetsApplied: (archetypeId, constants, archetype) => {
            console.log('🎭 Archetype presets applied:', archetypeId, constants);
            mappingContext.setArchetype(archetypeId, constants);
        }
    });
    archetypeSelector.init('archetype-selector-container');

    // Initialize Lens Pre-Selector (Sprint 2 Task 4)
    const lensPreSelector = new LensPreSelector({
        onLensChange: (lensId, lensConfig) => {
            console.log('🔮 Strategic Lens changed:', lensId, lensConfig.name);
            mappingContext.setLens(lensId);
        }
    });
    lensPreSelector.init('lens-pre-selector-container');
    window.lensPreSelector = lensPreSelector;

    // Initialize Vocabulary Style Selector (Sprint 2 Task 5)
    const vocabularyStyleSelector = new VocabularyStyleSelector({
        onStyleChange: (styleId, styleConfig) => {
            console.log('🎨 Vocabulary Style changed:', styleId, styleConfig.name);
            mappingContext.setVocabulary(styleId);
        }
    });
    vocabularyStyleSelector.init('vocabulary-style-container');
    window.vocabularyStyleSelector = vocabularyStyleSelector;

    // Initialize KPI Extraction Panel (Sprint 2 Task 10)
    const kpiExtractionPanel = new KPIExtractionPanel({
        onExtracted: (result) => {
            console.log('📊 KPIs extracted:', result);
            // Store for later use
            window.extractedKPIResult = result;
        }
    });
    kpiExtractionPanel.init('kpi-extraction-container');
    window.kpiExtractionPanel = kpiExtractionPanel;

    // Expose panel helpers globally
    window.showSprint2Panel = showSprint2Panel;
    window.hideSprint2Panel = hideSprint2Panel;

    // Expose to window for integration with demo-orchestrator-logic.js
    window.Sprint2 = {
        mappingContext,
        validationGate,
        apiKeyManager,
        modeSelector,
        archetypeSelector,
        lensPreSelector,
        vocabularyStyleSelector,
        kpiExtractionPanel,
        ARCHETYPE_PRESETS,
        PHI,
        OCTAVE_MODIFIERS: {
            KAPPA: OCTAVE_KAPPA_MODIFIERS,
            DELTA: OCTAVE_DELTA_MODIFIERS,
            GAMMA: OCTAVE_GAMMA_MODIFIERS
        },
        getOctaveModifier,
        applyOctaveModifiers,
        // Convenience methods
        showPanel: showSprint2Panel,
        hidePanel: hideSprint2Panel,
        getValidation: () => validationGate.validate(),
        canProceed: () => validationGate.canProceed()
    };

    console.log('✅ Sprint 2: AI Integration modules initialized');
    console.log('   📦 Available via window.Sprint2');
}


// ============================================================================
// AUTO-INITIALIZATION
// ============================================================================

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', initSprint2);
