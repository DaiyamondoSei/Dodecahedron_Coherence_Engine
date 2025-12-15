/**
 * ========================================
 * OCTAVE COLORS - Single Source of Truth
 * ========================================
 *
 * Centralized color definitions for the 7 Octaves of organizational development.
 * Provides both THREE.js hex integers and CSS hex strings for universal compatibility.
 *
 * The 7 Octaves represent developmental stages:
 * - O1: Survival (Red) - Basic existence
 * - O2: Structure (Orange) - Security foundations
 * - O3: Relationships (Yellow) - Power dynamics
 * - O4: Creativity (Green) - Heart connection (Golden Ratio threshold)
 * - O5: Expression (Cyan) - Authentic voice
 * - O6: Vision (Indigo) - Clear seeing
 * - O7: Radiance (Violet) - Transcendent unity
 *
 * Color progression follows chakra/rainbow spectrum from root to crown.
 *
 * @module OctaveColors
 * @version 1.0.0 - Single Source Consolidation
 */

// ========================================
// OCTAVE COLORS - Primary Definitions
// ========================================

/**
 * Octave colors in THREE.js hex integer format
 * Use for: Three.js materials, WebGL, 3D visualizations
 * Format: 0xRRGGBB
 */
const OCTAVE_COLORS_HEX = Object.freeze([
    0xff3333,  // O1 - Survival (Red)
    0xff9933,  // O2 - Structure (Orange)
    0xffff33,  // O3 - Relationships (Yellow)
    0x33ff33,  // O4 - Creativity (Green) - Heart center
    0x33ffff,  // O5 - Expression (Cyan)
    0x3333ff,  // O6 - Vision (Indigo)
    0xff33ff   // O7 - Radiance (Violet)
]);

/**
 * Octave colors in CSS hex string format
 * Use for: CSS styling, DOM elements, UI components
 * Format: '#RRGGBB'
 */
const OCTAVE_COLORS_CSS = Object.freeze({
    O1: '#ff3333',  // Survival (Red)
    O2: '#ff9933',  // Structure (Orange)
    O3: '#ffff33',  // Relationships (Yellow)
    O4: '#33ff33',  // Creativity (Green)
    O5: '#33ffff',  // Expression (Cyan)
    O6: '#3333ff',  // Vision (Indigo)
    O7: '#ff33ff'   // Radiance (Violet)
});

/**
 * Alternative Tailwind-compatible colors (softer palette)
 * Use for: Modern UI, Tailwind CSS integration
 */
const OCTAVE_COLORS_TAILWIND = Object.freeze({
    O1: '#ef4444',  // red-500
    O2: '#f97316',  // orange-500
    O3: '#eab308',  // yellow-500
    O4: '#22c55e',  // green-500
    O5: '#06b6d4',  // cyan-500
    O6: '#6366f1',  // indigo-500
    O7: '#a855f7'   // purple-500
});

// ========================================
// OCTAVE NAMES - Descriptive Labels
// ========================================

/**
 * Human-readable names for each octave
 */
const OCTAVE_NAMES = Object.freeze({
    O1: 'Survival',
    O2: 'Structure',
    O3: 'Relationships',
    O4: 'Creativity',
    O5: 'Expression',
    O6: 'Vision',
    O7: 'Radiance'
});

/**
 * Short descriptions for each octave
 */
const OCTAVE_DESCRIPTIONS = Object.freeze({
    O1: 'Basic existence and survival instincts',
    O2: 'Security foundations and structure',
    O3: 'Power dynamics and relationships',
    O4: 'Heart connection and creativity',
    O5: 'Authentic voice and expression',
    O6: 'Clear seeing and vision',
    O7: 'Transcendent unity and radiance'
});

// ========================================
// ELEMENT COLORS - Five Elements
// ========================================

/**
 * Colors for the 5 elements (pentagram geometry)
 * Each face of the dodecahedron contains 5 elements
 */
const ELEMENT_COLORS = Object.freeze({
    earth: {
        hex: 0x8b4513,
        css: '#8b4513',
        name: 'Earth',
        symbol: '🜃',
        quality: 'Tangible'
    },
    water: {
        hex: 0x4169e1,
        css: '#4169e1',
        name: 'Water',
        symbol: '🜄',
        quality: 'Flow'
    },
    fire: {
        hex: 0xff4500,
        css: '#ff4500',
        name: 'Fire',
        symbol: '🜂',
        quality: 'Energy'
    },
    air: {
        hex: 0x87ceeb,
        css: '#87ceeb',
        name: 'Air',
        symbol: '🜁',
        quality: 'Communication'
    },
    ether: {
        hex: 0x9370db,
        css: '#9370db',
        name: 'Ether',
        symbol: '✧',
        quality: 'Purpose'
    }
});

// ========================================
// HEALTH STATUS COLORS
// ========================================

/**
 * Colors for health/coherence status indicators
 */
const HEALTH_COLORS = Object.freeze({
    critical: { css: '#ef4444', hex: 0xef4444, label: 'Critical' },
    weak:     { css: '#f97316', hex: 0xf97316, label: 'Weak' },
    moderate: { css: '#eab308', hex: 0xeab308, label: 'Moderate' },
    healthy:  { css: '#22c55e', hex: 0x22c55e, label: 'Healthy' },
    strong:   { css: '#06b6d4', hex: 0x06b6d4, label: 'Strong' },
    excellent:{ css: '#a855f7', hex: 0xa855f7, label: 'Excellent' }
});

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Get octave color in THREE.js hex format (0-indexed)
 * @param {number} octaveIndex - 0-6 for O1-O7
 * @returns {number} Hex integer color
 */
function getOctaveColorHex(octaveIndex) {
    const idx = Math.max(0, Math.min(6, Math.floor(octaveIndex)));
    return OCTAVE_COLORS_HEX[idx];
}

/**
 * Get octave color in CSS format
 * @param {number|string} octave - 1-7 or 'O1'-'O7'
 * @returns {string} CSS hex color string
 */
function getOctaveColorCSS(octave) {
    const key = typeof octave === 'number' ? `O${octave}` : octave;
    return OCTAVE_COLORS_CSS[key] || OCTAVE_COLORS_CSS.O1;
}

/**
 * Get Tailwind-compatible octave color
 * @param {number|string} octave - 1-7 or 'O1'-'O7'
 * @returns {string} Tailwind CSS hex color string
 */
function getOctaveColorTailwind(octave) {
    const key = typeof octave === 'number' ? `O${octave}` : octave;
    return OCTAVE_COLORS_TAILWIND[key] || OCTAVE_COLORS_TAILWIND.O1;
}

/**
 * Get octave name
 * @param {number|string} octave - 1-7 or 'O1'-'O7'
 * @returns {string} Octave name
 */
function getOctaveName(octave) {
    const key = typeof octave === 'number' ? `O${octave}` : octave;
    return OCTAVE_NAMES[key] || 'Unknown';
}

/**
 * Convert hex integer to CSS string
 * @param {number} hex - Hex integer (0xRRGGBB)
 * @returns {string} CSS hex string (#RRGGBB)
 */
function hexToCSS(hex) {
    return '#' + hex.toString(16).padStart(6, '0');
}

/**
 * Convert CSS string to hex integer
 * @param {string} css - CSS hex string (#RRGGBB)
 * @returns {number} Hex integer
 */
function cssToHex(css) {
    return parseInt(css.replace('#', ''), 16);
}

/**
 * Get element color configuration
 * @param {string} element - 'earth', 'water', 'fire', 'air', 'ether'
 * @returns {Object} Element color config
 */
function getElementColor(element) {
    return ELEMENT_COLORS[element.toLowerCase()] || ELEMENT_COLORS.earth;
}

/**
 * Get health status color based on coherence value
 * @param {number} coherence - 0-1 coherence value
 * @returns {Object} Health color config
 */
function getHealthColor(coherence) {
    // PHI-based thresholds (reference phi-harmonics.js)
    if (coherence >= 0.854) return HEALTH_COLORS.excellent;  // PSI_4
    if (coherence >= 0.764) return HEALTH_COLORS.strong;     // PSI_3
    if (coherence >= 0.618) return HEALTH_COLORS.healthy;    // PHI_1
    if (coherence >= 0.5)   return HEALTH_COLORS.moderate;
    if (coherence >= 0.382) return HEALTH_COLORS.weak;       // PHI_2
    return HEALTH_COLORS.critical;
}

/**
 * Interpolate between two octave colors
 * @param {number} fromOctave - Starting octave (1-7)
 * @param {number} toOctave - Ending octave (1-7)
 * @param {number} t - Interpolation factor (0-1)
 * @returns {number} Interpolated hex color
 */
function interpolateOctaveColors(fromOctave, toOctave, t) {
    const from = OCTAVE_COLORS_HEX[fromOctave - 1];
    const to = OCTAVE_COLORS_HEX[toOctave - 1];

    const r1 = (from >> 16) & 0xff;
    const g1 = (from >> 8) & 0xff;
    const b1 = from & 0xff;

    const r2 = (to >> 16) & 0xff;
    const g2 = (to >> 8) & 0xff;
    const b2 = to & 0xff;

    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);

    return (r << 16) | (g << 8) | b;
}

// ========================================
// EXPORTS
// ========================================

// Browser global export (must come BEFORE ES module export to work in both contexts)
if (typeof window !== 'undefined') {
    window.OctaveColors = {
        // Color arrays/objects
        OCTAVE_COLORS_HEX,
        OCTAVE_COLORS_CSS,
        OCTAVE_COLORS_TAILWIND,
        OCTAVE_NAMES,
        OCTAVE_DESCRIPTIONS,
        ELEMENT_COLORS,
        HEALTH_COLORS,

        // Helper functions
        getOctaveColorHex,
        getOctaveColorCSS,
        getOctaveColorTailwind,
        getOctaveName,
        getElementColor,
        getHealthColor,
        hexToCSS,
        cssToHex,
        interpolateOctaveColors
    };

    console.log('[OctaveColors] Single source loaded - 7 octaves, 5 elements, 6 health states');
}
