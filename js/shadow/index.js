/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                            ║
 * ║   UNIFIED SHADOW MODULE - Central Export Point                            ║
 * ║   "The mirror's mathematics, unified in one home"                         ║
 * ║                                                                            ║
 * ║   Location: js/shadow/index.js                                            ║
 * ║   Created: December 2025                                                  ║
 * ║   @see {@link ../../docs/SHADOW_SYSTEM_ARCHITECTURE.md} - Complete shadow system reference
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * NOTES FOR FUTURE CLAUDE
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Welcome, future me. This file serves as the central barrel export for the
 * entire shadow module. Import from here to get any shadow functionality.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * MODULE STRUCTURE
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * js/shadow/
 * ├── index.js                    ← YOU ARE HERE (central exports)
 * ├── constants/
 * │   └── shadow-harmonics.js     → PHI-derived constants (Single Source of Truth)
 * ├── detection/
 * │   └── shadow-detector.js      → Pattern detection engine
 * ├── adaptation/
 * │   ├── shadow-adapter.js       → Template-based stories (Jungian dual-form)
 * │   └── ai-shadow-adapter.js    → AI-powered pattern discovery
 * └── ui/
 *     └── shadow-panel.js         → Toast notifications with accessibility
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * USAGE EXAMPLES
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * // Import everything
 * import * as Shadow from './js/shadow/index.js';
 *
 * // Import specific components
 * import { ShadowDetector, ShadowPanel, AIShadowAdapter } from './js/shadow/index.js';
 *
 * // Import constants
 * import { SHADOW_PENALTIES, SHADOW_THRESHOLDS } from './js/shadow/index.js';
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * THREE-TIER PHI SYSTEM (Quick Reference)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * | Tier | PHI Value | Capital Type         | Example Shadows          |
 * |------|-----------|---------------------|--------------------------|
 * | 1    | φ⁻² 0.382 | Human Capital       | burnoutEngine            |
 * | 2    | φ⁻³ 0.236 | Systemic Fragility  | brittleProfit, lonelyHero|
 * | 3    | φ⁻⁴ 0.146 | Integrity Erosion   | experienceGap, hollow... |
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * @module js/shadow
 * @author Deimantas & Claude
 * @version 1.0 - Unified Shadow Module
 */

// ════════════════════════════════════════════════════════════════════════════
// CONSTANTS - From shadow-harmonics.js (Single Source of Truth)
// ════════════════════════════════════════════════════════════════════════════

// Re-export from constants module
// Note: shadow-harmonics.js sets window.ShadowHarmonics and also has ES exports
export {
    // PHI-derived penalties
    SHADOW_PENALTIES,
    // Detection thresholds
    SHADOW_THRESHOLDS,
    // Complete archetype definitions
    SHADOW_ARCHETYPES,
    // Accessibility: colors and icons
    SEVERITY_COLORS,
    SEVERITY_ICONS,
    // Max penalty cap
    MAX_PENALTY_CAP
} from './constants/shadow-harmonics.js';

// ════════════════════════════════════════════════════════════════════════════
// DETECTION - Pattern detection engine
// ════════════════════════════════════════════════════════════════════════════

export { ShadowDetector } from './detection/shadow-detector.js';

// ════════════════════════════════════════════════════════════════════════════
// ADAPTATION - Template and AI-based story generation
// ════════════════════════════════════════════════════════════════════════════

export {
    ShadowAdapter,
    SHADOW_TEMPLATES,
    SEVERITY_STYLES
} from './adaptation/shadow-adapter.js';

export { AIShadowAdapter } from './adaptation/ai-shadow-adapter.js';

// ════════════════════════════════════════════════════════════════════════════
// UI - Toast notifications and display
// ════════════════════════════════════════════════════════════════════════════

export { ShadowPanel } from './ui/shadow-panel.js';

// ════════════════════════════════════════════════════════════════════════════
// CONVENIENCE: Grouped exports for common use cases
// ════════════════════════════════════════════════════════════════════════════

/**
 * All constants needed for shadow calculations
 */
export const ShadowConstants = {
    get PENALTIES() {
        return (typeof window !== 'undefined' && window.ShadowHarmonics?.SHADOW_PENALTIES) || {};
    },
    get THRESHOLDS() {
        return (typeof window !== 'undefined' && window.ShadowHarmonics?.SHADOW_THRESHOLDS) || {};
    },
    get ARCHETYPES() {
        return (typeof window !== 'undefined' && window.ShadowHarmonics?.SHADOW_ARCHETYPES) || {};
    }
};

// Log module load
console.log('[Shadow Module] 🌑 Unified shadow module loaded');
console.log('[Shadow Module] Exports: ShadowDetector, ShadowAdapter, AIShadowAdapter, ShadowPanel');
