/**
 * ========================================
 * AI ADAPTERS - Module Index
 * ========================================
 *
 * Central export for integration adapters.
 *
 * NOTE (Dec 2025): Shadow adapters have been moved to js/shadow/adaptation/
 * These re-exports maintained for backward compatibility.
 *
 * @module AIAdapters
 * @version Sprint 2 - Updated Dec 2025
 */

// Shadow Adapter - Re-export from new unified location
export {
    ShadowAdapter,
    SHADOW_TEMPLATES,
    SEVERITY_STYLES
} from '../../shadow/adaptation/shadow-adapter.js';

// AI Shadow Adapter - Re-export from new unified location
export { AIShadowAdapter } from '../../shadow/adaptation/ai-shadow-adapter.js';
