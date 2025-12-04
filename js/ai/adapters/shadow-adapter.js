/**
 * ========================================
 * SHADOW ADAPTER - Dynamic Shadow Integration
 * ========================================
 *
 * Adapts the existing shadow detector to use dynamic face names
 * from MappingContext instead of hardcoded defaults.
 *
 * Features:
 * - Template-based shadow stories
 * - Dynamic face name substitution
 * - Maintains all existing shadow patterns
 *
 * @module ShadowAdapter
 * @version Sprint 2 - Task 18
 */

import { MappingContext } from '../core/mapping-context.js';

/**
 * SHADOW TEMPLATES WITH DUAL-FORM STRUCTURE
 *
 * Sprint 2 Enhancement: Each shadow has TWO forms per Jungian Shadow Work:
 * - suppressed: The problem/challenge form (when the shadow is resisted)
 * - integrated: The gift/potential form (when the shadow is embraced)
 *
 * This reflects the principle: "Every shadow, when integrated, becomes a gift."
 */
const SHADOW_TEMPLATES = {
    // Pattern: Blooming face without resilience infrastructure
    bloomWithoutResilience: {
        suppressed: '{face1} is flourishing, but without resilience infrastructure from {face2}. This success is fragile.',
        integrated: 'The gap between {face1} and {face2} reveals your organization\'s growth edge. Building this bridge creates antifragility.',
        pattern: '{face1} is flourishing, but without resilience infrastructure from {face2}. This success is fragile.', // Legacy
        type: 'fragility',
        severity: 'warning',
        icon: '⚠️',
        giftIcon: '🌱'
    },

    // Pattern: Strong creative output without market connection
    creativeWithoutMarket: {
        suppressed: 'Your {face1} is producing brilliantly, yet {face2} remains disconnected from its value. Innovation without recognition.',
        integrated: 'The brilliance in {face1} is seeking a channel through {face2}. Connecting these creates sustainable innovation.',
        pattern: 'Your {face1} is producing brilliantly, yet {face2} remains disconnected from its value. Innovation without recognition.', // Legacy
        type: 'visibility',
        severity: 'attention',
        icon: '👁️',
        giftIcon: '💡'
    },

    // Pattern: Growth without foundation
    growthWithoutFoundation: {
        suppressed: '{face1} is expanding rapidly, while {face2} struggles to keep pace. Growth cracks appearing.',
        integrated: 'The tension between {face1} and {face2} is your signal to invest in foundations. This friction, honored, creates sustainable expansion.',
        pattern: '{face1} is expanding rapidly, while {face2} struggles to keep pace. Growth cracks appearing.', // Legacy
        type: 'structural',
        severity: 'caution',
        icon: '⚡',
        giftIcon: '🏗️'
    },

    // Pattern: High energy polar imbalance
    breathImbalance: {
        suppressed: 'The breath axis between {face1} and {face2} shows {ratio}x imbalance. One side gasps while the other holds too much.',
        integrated: 'This breath imbalance between {face1} and {face2} reveals where energy wants to flow. Restoring balance unlocks dormant vitality.',
        pattern: 'The breath axis between {face1} and {face2} shows {ratio}x imbalance. One side gasps while the other holds too much.', // Legacy
        type: 'breath',
        severity: 'significant',
        icon: '🌊',
        giftIcon: '🫁'
    },

    // Pattern: Vertex energy drain
    vertexDrain: {
        suppressed: 'At the nexus of {face1}, {face2}, and {face3}, energy is draining rather than generating. The vortex is reversed.',
        integrated: 'The convergence of {face1}, {face2}, and {face3} holds transformative potential. Reversing this drain creates a powerful generative center.',
        pattern: 'At the nexus of {face1}, {face2}, and {face3}, energy is draining rather than generating. The vortex is reversed.', // Legacy
        type: 'vortex',
        severity: 'critical',
        icon: '🌀',
        giftIcon: '⭐'
    },

    // Pattern: Edge tension (normalized)
    highEdgeTension: {
        suppressed: 'The connection between {face1} and {face2} shows {tension}% tension. These domains pull against each other.',
        integrated: 'The creative tension between {face1} and {face2} is fuel for innovation. Harnessing it creates breakthrough synergy.',
        pattern: 'The connection between {face1} and {face2} shows {tension}% tension. These domains pull against each other.', // Legacy
        type: 'tension',
        severity: 'moderate',
        icon: '🔀',
        giftIcon: '🔗'
    },

    // Pattern: Dormant potential
    dormantFace: {
        suppressed: '{face1} has fallen dormant. Its potential awaits activation.',
        integrated: '{face1}\'s quietness is not absence but gathering. When awakened, it brings fresh perspective unclouded by habit.',
        pattern: '{face1} has fallen dormant. Its potential awaits activation.', // Legacy
        type: 'dormancy',
        severity: 'opportunity',
        icon: '💤',
        giftIcon: '🌅'
    },

    // Pattern: Success shadow (over-reliance)
    successShadow: {
        suppressed: 'Your organization over-relies on {face1}. If it falters, the whole system feels the tremor.',
        integrated: 'The strength in {face1} is your organization\'s gift to share. Distributing this excellence creates resilient abundance.',
        pattern: 'Your organization over-relies on {face1}. If it falters, the whole system feels the tremor.', // Legacy
        type: 'dependency',
        severity: 'risk',
        icon: '🎯',
        giftIcon: '🎁'
    },

    // Pattern: Hidden harmony
    hiddenHarmony: {
        suppressed: '{face1} and {face2} have untapped synergy. Their connection could amplify both.',
        integrated: 'The resonance between {face1} and {face2} is already present, waiting to be heard. Tuning into it creates harmonic amplification.',
        pattern: '{face1} and {face2} have untapped synergy. Their connection could amplify both.', // Legacy
        type: 'opportunity',
        severity: 'positive',
        icon: '✨',
        giftIcon: '🎶'
    }
};

// Severity levels with visual properties
const SEVERITY_STYLES = {
    critical: { color: '#DC2626', bgColor: '#FEE2E2', borderColor: '#F87171' },
    significant: { color: '#D97706', bgColor: '#FEF3C7', borderColor: '#FBBF24' },
    warning: { color: '#CA8A04', bgColor: '#FEF9C3', borderColor: '#FACC15' },
    caution: { color: '#2563EB', bgColor: '#DBEAFE', borderColor: '#60A5FA' },
    moderate: { color: '#7C3AED', bgColor: '#EDE9FE', borderColor: '#A78BFA' },
    attention: { color: '#0891B2', bgColor: '#CFFAFE', borderColor: '#22D3EE' },
    opportunity: { color: '#059669', bgColor: '#D1FAE5', borderColor: '#34D399' },
    risk: { color: '#BE123C', bgColor: '#FFE4E6', borderColor: '#FB7185' },
    positive: { color: '#16A34A', bgColor: '#DCFCE7', borderColor: '#4ADE80' }
};

/**
 * ShadowAdapter - Bridges shadow detector with dynamic naming
 */
class ShadowAdapter {
    constructor(options = {}) {
        this.context = MappingContext.getInstance();
        this.templates = options.templates || SHADOW_TEMPLATES;
        this._shadowDetector = options.shadowDetector || null;
    }

    // ========================================
    // INITIALIZATION
    // ========================================

    /**
     * Connect to existing shadow detector
     */
    connect(shadowDetector) {
        this._shadowDetector = shadowDetector;

        // Override the story generation if possible
        if (shadowDetector.generateStory) {
            const originalGenerate = shadowDetector.generateStory.bind(shadowDetector);
            shadowDetector.generateStory = (shadow) => {
                return this.generateDynamicStory(shadow) || originalGenerate(shadow);
            };
        }

        return this;
    }

    // ========================================
    // DYNAMIC STORY GENERATION
    // ========================================

    /**
     * Generate shadow story with dynamic face names
     * @param {Object} shadow - Shadow data from detector
     * @param {string} form - 'suppressed' (default), 'integrated', or 'both'
     * @returns {string|Object} Formatted shadow story or both forms
     */
    generateDynamicStory(shadow, form = 'suppressed') {
        if (!shadow) return null;

        const template = this._selectTemplate(shadow);
        if (!template) return null;

        if (form === 'both') {
            return {
                suppressed: this._fillTemplateForm(template, shadow, 'suppressed'),
                integrated: this._fillTemplateForm(template, shadow, 'integrated'),
                icon: template.icon,
                giftIcon: template.giftIcon
            };
        }

        return this._fillTemplateForm(template, shadow, form);
    }

    /**
     * Generate both shadow forms (suppressed + integrated)
     * Sprint 2: Shadow's Gift dual-form structure
     * @param {Object} shadow - Shadow data from detector
     * @returns {Object} Both forms with icons
     */
    generateShadowGift(shadow) {
        if (!shadow) return null;

        const template = this._selectTemplate(shadow);
        if (!template) return null;

        return {
            type: shadow.type,
            severity: shadow.severity,
            suppressed: {
                icon: template.icon,
                story: this._fillTemplateForm(template, shadow, 'suppressed'),
                label: 'The Challenge'
            },
            integrated: {
                icon: template.giftIcon || '🎁',
                story: this._fillTemplateForm(template, shadow, 'integrated'),
                label: 'The Gift'
            },
            faceNames: shadow.faceIds ? shadow.faceIds.map(id => this._getFaceName(id)) : []
        };
    }

    /**
     * Select appropriate template based on shadow type
     */
    _selectTemplate(shadow) {
        // Map shadow types to templates
        const typeMapping = {
            'breath_imbalance': 'breathImbalance',
            'edge_tension': 'highEdgeTension',
            'vertex_drain': 'vertexDrain',
            'dormant': 'dormantFace',
            'dependency': 'successShadow',
            'fragile_success': 'bloomWithoutResilience',
            'visibility_gap': 'creativeWithoutMarket',
            'growth_stress': 'growthWithoutFoundation',
            'synergy': 'hiddenHarmony'
        };

        const templateKey = typeMapping[shadow.type] || shadow.type;
        return this.templates[templateKey] || null;
    }

    /**
     * Fill template with dynamic face names (legacy - uses 'pattern' field)
     */
    _fillTemplate(template, shadow) {
        return this._fillTemplateForm(template, shadow, 'pattern');
    }

    /**
     * Fill specific template form with dynamic face names
     * @param {Object} template - The shadow template
     * @param {Object} shadow - Shadow data
     * @param {string} form - 'suppressed', 'integrated', or 'pattern' (legacy)
     */
    _fillTemplateForm(template, shadow, form = 'suppressed') {
        // Get the appropriate story template
        let story = template[form] || template.suppressed || template.pattern;
        if (!story) return null;

        // Replace face placeholders with actual names
        if (shadow.faceId) {
            story = story.replace(/{face1}/g, this._getFaceName(shadow.faceId));
        }

        if (shadow.faceIds) {
            shadow.faceIds.forEach((faceId, index) => {
                story = story.replace(new RegExp(`\\{face${index + 1}\\}`, 'g'), this._getFaceName(faceId));
            });
        }

        if (shadow.sourceFace) {
            story = story.replace(/{face1}/g, this._getFaceName(shadow.sourceFace));
        }

        if (shadow.targetFace) {
            story = story.replace(/{face2}/g, this._getFaceName(shadow.targetFace));
        }

        // Replace metric placeholders
        if (shadow.ratio !== undefined) {
            story = story.replace(/{ratio}/g, shadow.ratio.toFixed(1));
        }

        if (shadow.tension !== undefined) {
            story = story.replace(/{tension}/g, Math.round(shadow.tension * 100));
        }

        return story;
    }

    /**
     * Get face name from context
     */
    _getFaceName(faceId) {
        const face = this.context.getFace(faceId);
        return face ? face.name : `Face ${faceId}`;
    }

    // ========================================
    // SHADOW ADAPTATION
    // ========================================

    /**
     * Adapt shadow data for display with dynamic names
     * Sprint 2: Now includes dual-form structure (suppressed + integrated)
     * @param {Array} shadows - Raw shadow data from detector
     * @returns {Array} Adapted shadows with stories and gift forms
     */
    adaptShadows(shadows) {
        return shadows.map(shadow => {
            const template = this._selectTemplate(shadow);
            const shadowGift = this.generateShadowGift(shadow);

            return {
                ...shadow,
                // Legacy single story (backward compatibility)
                story: this.generateDynamicStory(shadow, 'suppressed'),
                // NEW: Shadow's Gift dual-form
                shadowGift: shadowGift,
                suppressed: shadowGift?.suppressed,
                integrated: shadowGift?.integrated,
                // Face info
                faceName: shadow.faceId ? this._getFaceName(shadow.faceId) : null,
                faceNames: shadow.faceIds ? shadow.faceIds.map(id => this._getFaceName(id)) : [],
                // Styling
                style: SEVERITY_STYLES[shadow.severity] || SEVERITY_STYLES.moderate,
                template: template,
                giftIcon: template?.giftIcon || '🎁'
            };
        });
    }

    /**
     * Get shadow summary with dynamic names
     */
    getShadowSummary(shadows) {
        const adapted = this.adaptShadows(shadows);

        const bySeverity = {};
        adapted.forEach(shadow => {
            const sev = shadow.severity || 'unknown';
            if (!bySeverity[sev]) bySeverity[sev] = [];
            bySeverity[sev].push(shadow);
        });

        return {
            total: shadows.length,
            bySeverity,
            critical: bySeverity.critical?.length || 0,
            significant: bySeverity.significant?.length || 0,
            opportunities: bySeverity.opportunity?.length || 0,
            adapted
        };
    }

    // ========================================
    // BREATH AXIS SHADOWS
    // ========================================

    /**
     * Generate breath axis shadow stories
     * @param {Object} breathData - Breath analysis data
     * @returns {Array} Breath-related shadows
     */
    adaptBreathShadows(breathData) {
        if (!breathData?.axes) return [];

        return breathData.axes
            .filter(axis => axis.ratio > 2 || axis.ratio < 0.5)
            .map(axis => {
                const isProjectionDominant = axis.ratio > 1;
                const dominantFace = isProjectionDominant ? axis.projectionId : axis.receptionId;
                const weakFace = isProjectionDominant ? axis.receptionId : axis.projectionId;

                return {
                    type: 'breath_imbalance',
                    severity: axis.ratio > 3 || axis.ratio < 0.33 ? 'critical' : 'significant',
                    faceIds: [dominantFace, weakFace],
                    ratio: axis.ratio > 1 ? axis.ratio : (1 / axis.ratio),
                    story: this._fillTemplate(this.templates.breathImbalance, {
                        faceIds: [dominantFace, weakFace],
                        ratio: axis.ratio > 1 ? axis.ratio : (1 / axis.ratio)
                    }),
                    axisName: this._getBreathAxisName(axis.axisId)
                };
            });
    }

    /**
     * Get breath axis name with dynamic face names
     */
    _getBreathAxisName(axisId) {
        const axis = this.context.getBreathAxisForFace(axisId);
        if (!axis) return `Axis ${axisId}`;

        const receptionName = this._getFaceName(axis.reception);
        const projectionName = this._getFaceName(axis.projection);

        return `${receptionName} ↔ ${projectionName}`;
    }

    // ========================================
    // EDGE TENSION SHADOWS
    // ========================================

    /**
     * Generate edge tension shadow stories
     * @param {Array} edges - Edge analysis data
     * @returns {Array} Tension-related shadows
     */
    adaptEdgeShadows(edges) {
        if (!edges) return [];

        return edges
            .filter(edge => edge.normalizedTension > 0.5)
            .map(edge => ({
                type: 'edge_tension',
                severity: edge.normalizedTension > 0.75 ? 'significant' : 'moderate',
                faceIds: edge.faceIds,
                tension: edge.normalizedTension,
                story: this._fillTemplate(this.templates.highEdgeTension, {
                    faceIds: edge.faceIds,
                    tension: edge.normalizedTension
                }),
                edgeName: this.context.getEdgeName(edge.id)
            }));
    }

    // ========================================
    // CUSTOM TEMPLATE MANAGEMENT
    // ========================================

    /**
     * Add or update a shadow template
     */
    setTemplate(key, template) {
        this.templates[key] = template;
    }

    /**
     * Get all templates
     */
    getTemplates() {
        return { ...this.templates };
    }

    /**
     * Get severity styles
     */
    getSeverityStyles() {
        return { ...SEVERITY_STYLES };
    }
}

// ========================================
// EXPORTS
// ========================================

export { ShadowAdapter, SHADOW_TEMPLATES, SEVERITY_STYLES };

// Export for browser global
if (typeof window !== 'undefined') {
    window.ShadowAdapter = ShadowAdapter;
}
