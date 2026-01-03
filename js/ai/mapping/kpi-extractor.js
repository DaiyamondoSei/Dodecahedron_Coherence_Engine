/**
 * ════════════════════════════════════════════════════════════════════════════
 * KPI EXTRACTOR - AI DATA EXTRACTION FROM ORGANIZATIONAL NARRATIVES
 * ════════════════════════════════════════════════════════════════════════════
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                        NOTES FOR FUTURE CLAUDE                          │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * KEY INSIGHT: This module EXTRACTS KPIs from narratives. It DISCOVERS.
 * ─────────────────────────────────────────────────────────────────────────
 * The library (kpi-library.js) SUGGESTS what to measure.
 * The extractor (this file) DISCOVERS what's in the story.
 *
 * These are complementary functions:
 *   - Library: "Here are good KPIs for Financial Capital"
 *   - Extractor: "I found revenue mentioned at $1.5M in this story"
 *
 * HOW EXTRACTION WORKS:
 * ─────────────────────────────────────────────────────────────────────────
 * 1. PATTERN MATCHING: Local regex patterns catch common metrics
 *    (revenue, team size, runway, growth rate, customers, funding)
 *
 * 2. AI EXTRACTION: Gemini AI parses the full narrative for deeper insights
 *    and maps them to the 12 dodecahedron faces
 *
 * 3. MERGE: Local patterns + AI insights = comprehensive KPI extraction
 *
 * EXTRACTION MODES:
 * ─────────────────────────────────────────────────────────────────────────
 *   - 'quick': 12 KPIs (1 per face) - Fast assessment
 *   - 'full': 60 KPIs (5 per face) - Comprehensive analysis
 *
 * NAVIGATION MAP:
 * ─────────────────────────────────────────────────────────────────────────
 *   ↑ IMPORTS FROM:
 *     • ../core/mapping-context.js → MappingContext singleton
 *     • ../providers/index.js → AI provider (Gemini)
 *
 *   → CONSUMED BY:
 *     • sprint2-init.js → Story analysis workflow
 *     • pages/story-analyzer.html → UI for narrative input
 *
 *   ← RELATED TO:
 *     • js/kpi-library.js → SUGGESTS KPIs (this file EXTRACTS)
 *     • js/constants/kpi-constants.js → KPI_TYPES, ELEMENTS, layers
 *     • data/CSV_Face_Models.csv → Face definitions for mapping
 *
 * ════════════════════════════════════════════════════════════════════════════
 * @file kpi-extractor.js - AI-powered KPI extraction from organizational stories
 * @author Deimantas Murauskas & Claude
 * @module KPIExtractor
 * @version Sprint 2 - Task 14
 * ════════════════════════════════════════════════════════════════════════════
 */

import { MappingContext } from '../core/mapping-context.js';
import { getProvider } from '../providers/index.js';

// ════════════════════════════════════════════════════════════════════════════
// SECTION 1: KPI TEMPLATES BY FACE
// ════════════════════════════════════════════════════════════════════════════
// These templates define what KPIs to extract for each face.
// quickKPIs: 1 per face (12 total) - for fast assessment
// fullKPIs: 5 per face (60 total) - for comprehensive analysis
// ════════════════════════════════════════════════════════════════════════════

const KPI_TEMPLATES = {
    1: { // Financial Capital
        name: 'Financial Health',
        quickKPIs: ['Annual Revenue / Budget'],
        fullKPIs: ['Annual Revenue', 'Profit Margin', 'Cash Runway', 'Burn Rate', 'Working Capital']
    },
    2: { // Intellectual Capital
        name: 'Knowledge Assets',
        quickKPIs: ['Innovation Score'],
        fullKPIs: ['Patents/IP Count', 'R&D Investment %', 'Knowledge Base Size', 'Process Documentation %', 'Innovation Pipeline']
    },
    3: { // Human Capital
        name: 'Team Vitality',
        quickKPIs: ['Team Size'],
        fullKPIs: ['Team Size', 'Retention Rate', 'Engagement Score', 'Skills Coverage', 'Training Hours']
    },
    4: { // Structural Capital
        name: 'Operational Foundation',
        quickKPIs: ['System Maturity'],
        fullKPIs: ['Process Automation %', 'System Uptime', 'Technical Debt', 'Infrastructure Score', 'Security Posture']
    },
    5: { // Market Resonance
        name: 'Market Position',
        quickKPIs: ['Customer Count'],
        fullKPIs: ['Customer Count', 'Market Share', 'NPS Score', 'Conversion Rate', 'Brand Awareness']
    },
    6: { // Community & Partners
        name: 'Ecosystem Strength',
        quickKPIs: ['Partner Count'],
        fullKPIs: ['Strategic Partners', 'Community Size', 'Referral Rate', 'Integration Count', 'Collaboration Score']
    },
    7: { // Brand & Reputation
        name: 'Brand Equity',
        quickKPIs: ['Brand Score'],
        fullKPIs: ['Brand Recognition', 'Trust Index', 'Media Mentions', 'Social Following', 'Review Rating']
    },
    8: { // Core Operations
        name: 'Execution Excellence',
        quickKPIs: ['Delivery Rate'],
        fullKPIs: ['On-Time Delivery', 'Quality Score', 'Efficiency Index', 'Capacity Utilization', 'Cycle Time']
    },
    9: { // Regenerative Flow
        name: 'Sustainability',
        quickKPIs: ['Sustainability Index'],
        fullKPIs: ['Environmental Impact', 'Resource Efficiency', 'Waste Reduction', 'Renewal Rate', 'Long-term Viability']
    },
    10: { // Foundational Values
        name: 'Purpose Alignment',
        quickKPIs: ['Values Alignment'],
        fullKPIs: ['Mission Clarity', 'Values Adherence', 'Ethical Score', 'Culture Strength', 'Purpose Index']
    },
    11: { // Funding Pipeline
        name: 'Growth Capital',
        quickKPIs: ['Runway (months)'],
        fullKPIs: ['Available Funding', 'Runway Months', 'Investor Interest', 'Funding Stage', 'Valuation']
    },
    12: { // Risk & Resilience
        name: 'Risk Posture',
        quickKPIs: ['Risk Score'],
        fullKPIs: ['Risk Exposure', 'Contingency Coverage', 'Recovery Time', 'Compliance Score', 'Resilience Index']
    }
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 2: TEXT EXTRACTION PATTERNS
// ════════════════════════════════════════════════════════════════════════════
// Regex patterns for local pattern matching (before AI extraction)
// These catch common financial and organizational metrics from narrative text.
// ════════════════════════════════════════════════════════════════════════════

const EXTRACTION_PATTERNS = {
    revenue: /(?:revenue|sales|income|turnover)(?:\s+(?:of|is|was|:))?\s*\$?([\d,.]+)\s*(k|m|b|million|billion|thousand)?/i,
    teamSize: /(?:team|employees|staff|people|members)(?:\s+(?:of|has|have|is))?\s*(\d+)/i,
    runway: /(?:runway|cash|funds)(?:\s+(?:of|for))?\s*(\d+)\s*months?/i,
    growthRate: /(?:growing|growth|grew)(?:\s+(?:at|by|of))?\s*([\d.]+)%/i,
    customers: /(?:customers|clients|users)(?:\s+(?:of|has|have|is))?\s*([\d,]+)/i,
    funding: /(?:raised|funding|investment)(?:\s+(?:of|is))?\s*\$?([\d,.]+)\s*(k|m|million)?/i
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 3: KPI EXTRACTOR CLASS
// ════════════════════════════════════════════════════════════════════════════

/**
 * KPIExtractor - Extracts and manages KPIs from narratives
 *
 * This class orchestrates:
 * 1. Local pattern matching (fast, regex-based)
 * 2. AI extraction (deep, context-aware)
 * 3. Merging and validation of results
 */
class KPIExtractor {
    constructor(options = {}) {
        this.provider = options.provider || null;
        this.context = MappingContext.getInstance();
        this._extractedKPIs = new Map();
        this._financials = {};
    }

    // ────────────────────────────────────────────────────────────────────────
    // INITIALIZATION
    // ────────────────────────────────────────────────────────────────────────

    async init() {
        if (!this.provider) {
            this.provider = await getProvider();
        }
        return this;
    }

    async _ensureProvider() {
        if (!this.provider) {
            this.provider = await getProvider();
        }
    }

    // ────────────────────────────────────────────────────────────────────────
    // KPI EXTRACTION METHODS
    // ────────────────────────────────────────────────────────────────────────

    /**
     * Extract KPIs from story text
     * @param {string} storyText - The organizational narrative
     * @param {Object} options - Extraction options
     * @returns {Promise<ExtractionResult>} Extracted KPIs
     */
    async extractKPIs(storyText, options = {}) {
        await this._ensureProvider();

        const mode = options.mode || this.context.getMode();
        const updateContext = options.updateContext !== false;

        console.log(`[KPIExtractor] Extracting KPIs in ${mode} mode...`);

        try {
            // First, do local pattern extraction
            this._financials = this._extractFinancialsFromText(storyText);

            // Then use AI for comprehensive extraction
            const aiResult = await this.provider.extractKPIs(storyText, mode);

            // Merge AI and local extractions
            const mergedKPIs = this._mergeExtractions(aiResult.kpis, this._financials);

            // Organize by face
            this._organizeKPIsByFace(mergedKPIs);

            // Update face KPIs in context
            if (updateContext) {
                this._updateContextKPIs();
            }

            return {
                success: true,
                mode,
                totalKPIs: mergedKPIs.length,
                kpis: mergedKPIs,
                financials: {
                    ...this._financials,
                    ...aiResult.financials
                },
                provider: this.provider.name
            };

        } catch (error) {
            console.error('[KPIExtractor] Extraction failed:', error);

            // Return placeholder KPIs
            return this._getPlaceholderKPIs(mode);
        }
    }

    /**
     * Extract financial data using regex patterns
     */
    _extractFinancialsFromText(text) {
        const financials = {};

        for (const [key, pattern] of Object.entries(EXTRACTION_PATTERNS)) {
            const match = text.match(pattern);
            if (match) {
                let value = match[1].replace(/,/g, '');
                const multiplier = match[2]?.toLowerCase();

                // Apply multipliers
                if (multiplier) {
                    if (multiplier === 'k' || multiplier === 'thousand') {
                        value = parseFloat(value) * 1000;
                    } else if (multiplier === 'm' || multiplier === 'million') {
                        value = parseFloat(value) * 1000000;
                    } else if (multiplier === 'b' || multiplier === 'billion') {
                        value = parseFloat(value) * 1000000000;
                    }
                }

                financials[key] = {
                    value: parseFloat(value) || value,
                    source: 'extracted',
                    rawMatch: match[0]
                };
            }
        }

        return financials;
    }

    /**
     * Merge AI and local extractions
     */
    _mergeExtractions(aiKPIs, localFinancials) {
        const merged = aiKPIs || [];

        // Override AI extractions with local matches (more reliable)
        if (localFinancials.revenue?.value) {
            const revenueKPI = merged.find(k => k.faceId === 1 && k.name.toLowerCase().includes('revenue'));
            if (revenueKPI) {
                revenueKPI.value = this._formatCurrency(localFinancials.revenue.value);
                revenueKPI.source = 'extracted';
            }
        }

        if (localFinancials.teamSize?.value) {
            const teamKPI = merged.find(k => k.faceId === 3 && k.name.toLowerCase().includes('team'));
            if (teamKPI) {
                teamKPI.value = localFinancials.teamSize.value.toString();
                teamKPI.source = 'extracted';
            }
        }

        if (localFinancials.runway?.value) {
            const runwayKPI = merged.find(k => k.faceId === 11 && k.name.toLowerCase().includes('runway'));
            if (runwayKPI) {
                runwayKPI.value = `${localFinancials.runway.value} months`;
                runwayKPI.source = 'extracted';
            }
        }

        return merged;
    }

    /**
     * Format currency value
     */
    _formatCurrency(value) {
        if (value >= 1000000000) {
            return `$${(value / 1000000000).toFixed(1)}B`;
        } else if (value >= 1000000) {
            return `$${(value / 1000000).toFixed(1)}M`;
        } else if (value >= 1000) {
            return `$${(value / 1000).toFixed(0)}K`;
        }
        return `$${value}`;
    }

    /**
     * Organize KPIs by face ID
     */
    _organizeKPIsByFace(kpis) {
        this._extractedKPIs.clear();

        kpis.forEach(kpi => {
            const faceId = kpi.faceId;
            if (!this._extractedKPIs.has(faceId)) {
                this._extractedKPIs.set(faceId, []);
            }
            this._extractedKPIs.get(faceId).push(kpi);
        });
    }

    /**
     * Update MappingContext with extracted KPIs
     */
    _updateContextKPIs() {
        this._extractedKPIs.forEach((kpis, faceId) => {
            const face = this.context.getFace(faceId);
            if (face) {
                this.context.updateFace(faceId, { kpis });
            }
        });
    }

    /**
     * Get placeholder KPIs when extraction fails
     */
    _getPlaceholderKPIs(mode) {
        const kpis = [];
        const perFace = mode === 'quick' ? 1 : 5;

        for (let faceId = 1; faceId <= 12; faceId++) {
            const template = KPI_TEMPLATES[faceId];
            const kpiNames = mode === 'quick' ? template.quickKPIs : template.fullKPIs;

            kpiNames.forEach((name, index) => {
                kpis.push({
                    faceId,
                    name,
                    value: 'To be defined',
                    unit: '',
                    source: 'placeholder'
                });
            });
        }

        return {
            success: true,
            mode,
            totalKPIs: kpis.length,
            kpis,
            financials: {},
            provider: 'placeholder',
            note: 'Using template KPIs (extraction failed)'
        };
    }

    // ========================================
    // KPI ACCESS
    // ========================================

    /**
     * Get KPIs for a specific face
     */
    getKPIsForFace(faceId) {
        return this._extractedKPIs.get(faceId) || [];
    }

    /**
     * Get all extracted KPIs
     */
    getAllKPIs() {
        const all = [];
        this._extractedKPIs.forEach(kpis => all.push(...kpis));
        return all;
    }

    /**
     * Get extracted financials
     */
    getFinancials() {
        return { ...this._financials };
    }

    /**
     * Get KPI templates
     */
    getTemplates() {
        return { ...KPI_TEMPLATES };
    }

    // ========================================
    // MANUAL KPI ENTRY
    // ========================================

    /**
     * Manually set a KPI value
     */
    setKPI(faceId, kpiName, value, metadata = {}) {
        if (!this._extractedKPIs.has(faceId)) {
            this._extractedKPIs.set(faceId, []);
        }

        const kpis = this._extractedKPIs.get(faceId);
        const existing = kpis.find(k => k.name === kpiName);

        if (existing) {
            existing.value = value;
            existing.source = 'manual';
            Object.assign(existing, metadata);
        } else {
            kpis.push({
                faceId,
                name: kpiName,
                value,
                source: 'manual',
                ...metadata
            });
        }

        // Update context
        this.context.updateFace(faceId, { kpis });
    }

    /**
     * Get KPI completion status
     */
    getCompletionStatus() {
        const mode = this.context.getMode();
        const requiredPerFace = mode === 'quick' ? 1 : 5;
        const status = {
            complete: [],
            incomplete: [],
            percentage: 0
        };

        for (let faceId = 1; faceId <= 12; faceId++) {
            const kpis = this._extractedKPIs.get(faceId) || [];
            const definedKPIs = kpis.filter(k => k.value && k.value !== 'To be defined');

            if (definedKPIs.length >= requiredPerFace) {
                status.complete.push(faceId);
            } else {
                status.incomplete.push(faceId);
            }
        }

        status.percentage = Math.round((status.complete.length / 12) * 100);
        return status;
    }
}

// ════════════════════════════════════════════════════════════════════════════
// SECTION 4: MODULE EXPORTS
// ════════════════════════════════════════════════════════════════════════════

export { KPIExtractor, KPI_TEMPLATES, EXTRACTION_PATTERNS };

// Browser global export for non-module contexts
if (typeof window !== 'undefined') {
    window.KPIExtractor = KPIExtractor;
    window.KPI_TEMPLATES = KPI_TEMPLATES;
    window.EXTRACTION_PATTERNS = EXTRACTION_PATTERNS;
}

// ════════════════════════════════════════════════════════════════════════════
// MODULE LOADED
// ════════════════════════════════════════════════════════════════════════════
console.log('🔍 KPI Extractor loaded - AI-powered narrative analysis');
console.log('   KPI_TEMPLATES: 12 faces × quick/full modes');
console.log('   EXTRACTION_PATTERNS: 6 financial regex patterns');
console.log('   Remember: Library SUGGESTS, Extractor DISCOVERS');
