/**
 * ========================================
 * OFFLINE PROVIDER - Demo Day Safety Net
 * ========================================
 *
 * CRITICAL: This provider ensures the thesis demo works without internet.
 *
 * Uses semantic analysis and keyword matching to provide meaningful
 * face mappings when AI is unavailable. While less sophisticated than
 * Gemini, it provides a reliable fallback.
 *
 * Features:
 * - Keyword-based organization type detection
 * - Sentiment estimation from word patterns
 * - Pre-defined archetype characteristics
 * - Cached example responses for demo
 *
 * @module OfflineProvider
 * @version Sprint 2 - Task 10
 */

import { AIProvider } from './ai-provider.js';

// PHI-DERIVED sentiment defaults - Single source: js/constants/phi-harmonics.js
const _PH = (typeof window !== 'undefined' && window.PhiHarmonics) || {};

const PHI = {
    NEUTRAL: 0.5,                               // Center point (not PHI-derived)
    MODERATE_LOW: _PH.PHI_2 || 0.381966011250105,  // φ^-2
    MODERATE_HIGH: _PH.PHI_1 || 0.618033988749895, // φ^-1
    HIGH: _PH.PSI_3 || 0.763932022500210,       // 1 - φ^-3 = Ψ³
    LOW: _PH.PHI_3 || 0.2360679774997896        // φ^-3
};

// Keyword patterns for semantic analysis
const KEYWORD_PATTERNS = {
    orgTypes: {
        startup: ['startup', 'founded', 'seed', 'series', 'mvp', 'pivot', 'scale', 'raise', 'investors', 'burn rate', 'runway'],
        business: ['company', 'enterprise', 'corporation', 'revenue', 'profit', 'market share', 'quarterly'],
        nonprofit: ['nonprofit', 'non-profit', 'mission', 'donors', 'grant', 'volunteer', 'impact', 'cause'],
        project: ['project', 'deadline', 'milestone', 'sprint', 'delivery', 'scope', 'timeline'],
        community: ['community', 'members', 'collective', 'cooperative', 'grassroots', 'local']
    },

    sentimentPositive: ['growing', 'success', 'excellent', 'strong', 'thriving', 'innovative', 'leading', 'excited', 'passionate', 'breakthrough', 'award', 'winning'],
    sentimentNegative: ['struggling', 'challenge', 'difficult', 'declining', 'problem', 'risk', 'concern', 'worried', 'behind', 'losing', 'failed'],

    archetypes: {
        builder: ['build', 'construct', 'develop', 'create', 'engineer', 'architect', 'infrastructure', 'system', 'platform'],
        nurturer: ['support', 'care', 'grow', 'nurture', 'develop', 'mentor', 'culture', 'team', 'people', 'talent'],
        innovator: ['innovate', 'disrupt', 'pioneer', 'experiment', 'research', 'creative', 'novel', 'breakthrough', 'cutting-edge'],
        guardian: ['protect', 'secure', 'preserve', 'maintain', 'stable', 'reliable', 'risk', 'compliance', 'safety'],
        connector: ['partner', 'network', 'ecosystem', 'connect', 'collaborate', 'alliance', 'integrate', 'bridge']
    }
};

// Default face templates per organization type
const FACE_TEMPLATES = {
    startup: [
        { id: 1, name: 'Runway & Resources', icon: '💰', base: 0.5 },
        { id: 2, name: 'Innovation Engine', icon: '💡', base: 0.618 },
        { id: 3, name: 'Founding Team', icon: '👥', base: 0.618 },
        { id: 4, name: 'Tech Stack', icon: '🏗️', base: 0.5 },
        { id: 5, name: 'Market Traction', icon: '📈', base: 0.382 },
        { id: 6, name: 'Investor Relations', icon: '🤝', base: 0.5 },
        { id: 7, name: 'Brand Promise', icon: '⭐', base: 0.382 },
        { id: 8, name: 'Product Development', icon: '⚙️', base: 0.618 },
        { id: 9, name: 'Growth Loops', icon: '♻️', base: 0.5 },
        { id: 10, name: 'Mission & Vision', icon: '🎯', base: 0.618 },
        { id: 11, name: 'Funding Pipeline', icon: '💎', base: 0.382 },
        { id: 12, name: 'Pivot Readiness', icon: '🛡️', base: 0.5 }
    ],
    business: [
        { id: 1, name: 'Financial Health', icon: '💰', base: 0.5 },
        { id: 2, name: 'Intellectual Property', icon: '💡', base: 0.5 },
        { id: 3, name: 'Workforce Capital', icon: '👥', base: 0.5 },
        { id: 4, name: 'Operational Systems', icon: '🏛️', base: 0.618 },
        { id: 5, name: 'Market Position', icon: '📊', base: 0.5 },
        { id: 6, name: 'Strategic Partners', icon: '🤝', base: 0.5 },
        { id: 7, name: 'Brand Equity', icon: '⭐', base: 0.5 },
        { id: 8, name: 'Core Operations', icon: '⚙️', base: 0.618 },
        { id: 9, name: 'Sustainability', icon: '♻️', base: 0.382 },
        { id: 10, name: 'Corporate Values', icon: '🎯', base: 0.5 },
        { id: 11, name: 'Capital Access', icon: '💎', base: 0.5 },
        { id: 12, name: 'Risk Management', icon: '🛡️', base: 0.618 }
    ],
    nonprofit: [
        { id: 1, name: 'Financial Sustainability', icon: '💰', base: 0.382 },
        { id: 2, name: 'Program Innovation', icon: '💡', base: 0.5 },
        { id: 3, name: 'Team & Volunteers', icon: '👥', base: 0.618 },
        { id: 4, name: 'Organizational Capacity', icon: '🏛️', base: 0.5 },
        { id: 5, name: 'Beneficiary Impact', icon: '💖', base: 0.618 },
        { id: 6, name: 'Community Partners', icon: '🤝', base: 0.618 },
        { id: 7, name: 'Public Trust', icon: '⭐', base: 0.5 },
        { id: 8, name: 'Program Delivery', icon: '⚙️', base: 0.5 },
        { id: 9, name: 'Mission Renewal', icon: '♻️', base: 0.5 },
        { id: 10, name: 'Guiding Values', icon: '🎯', base: 0.764 },
        { id: 11, name: 'Donor Pipeline', icon: '💎', base: 0.382 },
        { id: 12, name: 'Governance', icon: '🛡️', base: 0.5 }
    ],
    project: [
        { id: 1, name: 'Budget Health', icon: '💰', base: 0.5 },
        { id: 2, name: 'Technical Approach', icon: '💡', base: 0.5 },
        { id: 3, name: 'Project Team', icon: '👥', base: 0.618 },
        { id: 4, name: 'Project Structure', icon: '🏛️', base: 0.618 },
        { id: 5, name: 'Stakeholder Buy-in', icon: '📊', base: 0.5 },
        { id: 6, name: 'Vendor Relations', icon: '🤝', base: 0.5 },
        { id: 7, name: 'Project Reputation', icon: '⭐', base: 0.5 },
        { id: 8, name: 'Execution Engine', icon: '⚙️', base: 0.618 },
        { id: 9, name: 'Scope Flexibility', icon: '♻️', base: 0.382 },
        { id: 10, name: 'Success Criteria', icon: '🎯', base: 0.618 },
        { id: 11, name: 'Resource Pipeline', icon: '💎', base: 0.5 },
        { id: 12, name: 'Risk Buffer', icon: '🛡️', base: 0.5 }
    ],
    community: [
        { id: 1, name: 'Shared Resources', icon: '💰', base: 0.382 },
        { id: 2, name: 'Collective Wisdom', icon: '💡', base: 0.618 },
        { id: 3, name: 'Member Engagement', icon: '👥', base: 0.764 },
        { id: 4, name: 'Community Structure', icon: '🏛️', base: 0.5 },
        { id: 5, name: 'Public Perception', icon: '📊', base: 0.5 },
        { id: 6, name: 'Allied Communities', icon: '🤝', base: 0.618 },
        { id: 7, name: 'Community Identity', icon: '⭐', base: 0.618 },
        { id: 8, name: 'Collective Action', icon: '⚙️', base: 0.5 },
        { id: 9, name: 'Cultural Renewal', icon: '♻️', base: 0.5 },
        { id: 10, name: 'Shared Values', icon: '🎯', base: 0.764 },
        { id: 11, name: 'Growth Potential', icon: '💎', base: 0.5 },
        { id: 12, name: 'Resilience Network', icon: '🛡️', base: 0.618 }
    ],
    default: [
        { id: 1, name: 'Financial Capital', icon: '💰', base: 0.5 },
        { id: 2, name: 'Intellectual Capital', icon: '💡', base: 0.5 },
        { id: 3, name: 'Human Capital', icon: '👥', base: 0.5 },
        { id: 4, name: 'Structural Capital', icon: '🏛️', base: 0.5 },
        { id: 5, name: 'Market Resonance', icon: '📊', base: 0.5 },
        { id: 6, name: 'Community & Partners', icon: '🤝', base: 0.5 },
        { id: 7, name: 'Brand & Reputation', icon: '⭐', base: 0.5 },
        { id: 8, name: 'Core Operations', icon: '⚙️', base: 0.5 },
        { id: 9, name: 'Regenerative Flow', icon: '♻️', base: 0.5 },
        { id: 10, name: 'Foundational Values', icon: '🎯', base: 0.5 },
        { id: 11, name: 'Funding Pipeline', icon: '💎', base: 0.5 },
        { id: 12, name: 'Risk & Resilience', icon: '🛡️', base: 0.5 }
    ]
};

// Archetype tuning presets (PHI-derived only)
const ARCHETYPE_PRESETS = {
    Builder: { ALPHA: 0.618, BETA: 0.382, GAMMA: 0.764, DELTA: 0.854, KAPPA: 0.618 },
    Nurturer: { ALPHA: 0.382, BETA: 0.618, GAMMA: 0.618, DELTA: 0.764, KAPPA: 0.382 },
    Innovator: { ALPHA: 0.764, BETA: 0.618, GAMMA: 0.618, DELTA: 0.618, KAPPA: 0.764 },
    Guardian: { ALPHA: 0.382, BETA: 0.382, GAMMA: 0.854, DELTA: 0.854, KAPPA: 0.236 },
    Connector: { ALPHA: 0.618, BETA: 0.764, GAMMA: 0.382, DELTA: 0.618, KAPPA: 0.618 }
};

/**
 * OfflineProvider - Semantic analysis fallback when AI is unavailable
 */
class OfflineProvider extends AIProvider {
    constructor() {
        super();

        this.name = 'OfflineProvider';
        this.isOnline = false;
    }

    // ========================================
    // CONNECTION TEST
    // ========================================

    async testConnection() {
        // Offline provider is always "available"
        return true;
    }

    // ========================================
    // SEMANTIC ANALYSIS HELPERS
    // ========================================

    _detectOrganizationType(text) {
        const lowerText = text.toLowerCase();
        let bestMatch = 'default';
        let bestScore = 0;

        for (const [type, keywords] of Object.entries(KEYWORD_PATTERNS.orgTypes)) {
            const score = keywords.filter(kw => lowerText.includes(kw)).length;
            if (score > bestScore) {
                bestScore = score;
                bestMatch = type;
            }
        }

        return bestMatch;
    }

    _estimateOverallSentiment(text) {
        const lowerText = text.toLowerCase();

        const positiveCount = KEYWORD_PATTERNS.sentimentPositive
            .filter(kw => lowerText.includes(kw)).length;

        const negativeCount = KEYWORD_PATTERNS.sentimentNegative
            .filter(kw => lowerText.includes(kw)).length;

        // Calculate sentiment delta
        const delta = (positiveCount - negativeCount) * 0.05;

        // Clamp to valid range
        return Math.max(0.1, Math.min(0.9, PHI.NEUTRAL + delta));
    }

    _detectArchetype(text) {
        const lowerText = text.toLowerCase();
        const scores = {};

        for (const [archetype, keywords] of Object.entries(KEYWORD_PATTERNS.archetypes)) {
            scores[archetype] = keywords.filter(kw => lowerText.includes(kw)).length;
        }

        // Find best match
        let best = 'builder';
        let bestScore = 0;

        for (const [archetype, score] of Object.entries(scores)) {
            if (score > bestScore) {
                bestScore = score;
                best = archetype;
            }
        }

        // Capitalize
        return best.charAt(0).toUpperCase() + best.slice(1);
    }

    _extractFocus(text) {
        // Simple extraction: first sentence or first 100 chars
        const firstSentence = text.split(/[.!?]/)[0];
        if (firstSentence.length < 150) {
            return firstSentence.trim();
        }
        return text.substring(0, 100).trim() + '...';
    }

    _applyKeywordModifiers(faces, text) {
        const lowerText = text.toLowerCase();

        // Face-specific keyword patterns
        const faceKeywords = {
            1: { positive: ['profitable', 'revenue', 'funded', 'investment'], negative: ['debt', 'loss', 'budget cuts'] },
            2: { positive: ['innovative', 'patent', 'research', 'breakthrough'], negative: ['outdated', 'behind'] },
            3: { positive: ['talented', 'culture', 'team', 'hiring'], negative: ['turnover', 'shortage'] },
            4: { positive: ['efficient', 'scalable', 'automated'], negative: ['manual', 'bottleneck'] },
            5: { positive: ['growing', 'market leader', 'customers love'], negative: ['losing share', 'competitors'] },
            6: { positive: ['partnerships', 'network', 'alliances'], negative: ['isolated', 'alone'] },
            7: { positive: ['trusted', 'respected', 'award-winning'], negative: ['scandal', 'reputation'] },
            8: { positive: ['delivering', 'executing', 'on track'], negative: ['delays', 'behind schedule'] },
            9: { positive: ['sustainable', 'renewable', 'long-term'], negative: ['short-term', 'unsustainable'] },
            10: { positive: ['mission-driven', 'principled', 'ethical'], negative: ['conflicted', 'unclear'] },
            11: { positive: ['investors interested', 'funding secured'], negative: ['struggling to raise', 'no funding'] },
            12: { positive: ['resilient', 'prepared', 'contingency'], negative: ['vulnerable', 'exposed', 'risky'] }
        };

        return faces.map(face => {
            const keywords = faceKeywords[face.id] || { positive: [], negative: [] };
            let modifier = 0;

            keywords.positive.forEach(kw => {
                if (lowerText.includes(kw)) modifier += 0.1;
            });

            keywords.negative.forEach(kw => {
                if (lowerText.includes(kw)) modifier -= 0.1;
            });

            const sentiment = Math.max(0.1, Math.min(0.9, face.base + modifier));

            return {
                ...face,
                sentiment,
                reasoning: `Semantic analysis (offline mode)`,
                source: 'offline'
            };
        });
    }

    // ========================================
    // STORY ANALYSIS
    // ========================================

    async analyzeStory(storyText, context = {}) {
        this.log('Analyzing story offline', { lens: context.lens, vocabulary: context.vocabulary });

        const orgType = this._detectOrganizationType(storyText);
        const template = FACE_TEMPLATES[orgType] || FACE_TEMPLATES.default;
        let faces = this._applyKeywordModifiers([...template], storyText);

        // Apply lens/vocabulary naming (basic offline version)
        faces = this._applyLensVocabulary(faces, context.lens, context.vocabulary);

        // Estimate octaves based on story content
        const stageInfo = this._detectOrganizationStage(storyText);
        faces = faces.map(face => ({
            ...face,
            octave: stageInfo.typicalOctave || 'O2'
        }));

        return {
            type: orgType.charAt(0).toUpperCase() + orgType.slice(1),
            focus: this._extractFocus(storyText),
            faces: faces,
            overallOctave: stageInfo.typicalOctave || 'O2',
            detectedStage: stageInfo.stage,
            maxOctave: stageInfo.maxOctave,
            source: 'offline',
            note: 'Analysis performed using semantic keyword matching (offline mode)'
        };
    }

    /**
     * Detect organization stage for octave constraints
     */
    _detectOrganizationStage(text) {
        const lowerText = text.toLowerCase();

        const stageKeywords = {
            'pre-seed': ['pre-seed', 'idea stage', 'just starting', 'concept', 'no funding yet'],
            'seed': ['seed', 'early stage', 'mvp', 'first customers', 'angel', 'pre-revenue'],
            'series-a': ['series a', 'series-a', 'growth stage', 'scaling', 'product-market fit'],
            'growth': ['series b', 'series c', 'rapid growth', 'expanding', 'scaling rapidly'],
            'mature': ['profitable', 'established', 'market leader', 'stable growth', 'fortune 500'],
            'legacy': ['legacy', 'generational', 'century-old', 'heritage', 'founding family']
        };

        for (const [stage, keywords] of Object.entries(stageKeywords)) {
            for (const kw of keywords) {
                if (lowerText.includes(kw)) {
                    const maxOctaves = {
                        'pre-seed': 'O2', 'seed': 'O2', 'series-a': 'O3',
                        'growth': 'O4', 'mature': 'O5', 'legacy': 'O6'
                    };
                    const typicalOctaves = {
                        'pre-seed': 'O1', 'seed': 'O1', 'series-a': 'O2',
                        'growth': 'O3', 'mature': 'O4', 'legacy': 'O5'
                    };
                    return {
                        stage,
                        maxOctave: maxOctaves[stage],
                        typicalOctave: typicalOctaves[stage],
                        confidence: 'medium'
                    };
                }
            }
        }

        return { stage: 'unknown', maxOctave: 'O4', typicalOctave: 'O2', confidence: 'low' };
    }

    /**
     * Apply lens and vocabulary to face names (basic offline version)
     */
    _applyLensVocabulary(faces, lens, vocabulary) {
        // Simple suffix/prefix based on lens
        const lensModifiers = {
            growth: { prefix: '', suffix: ' Growth' },
            stability: { prefix: '', suffix: ' Foundation' },
            innovation: { prefix: 'Emerging ', suffix: '' }
        };

        // Vocabulary style doesn't change structure in offline mode
        // but we note it for transparency
        const modifier = lensModifiers[lens] || { prefix: '', suffix: '' };

        return faces.map(face => ({
            ...face,
            name: lens && lens !== 'growth'
                ? `${modifier.prefix}${face.name}${modifier.suffix}`.trim()
                : face.name,
            appliedLens: lens || 'default',
            appliedVocabulary: vocabulary || 'professional'
        }));
    }

    // ========================================
    // STRATEGIC LENSES
    // ========================================

    async generateStrategicLenses(storyText) {
        this.log('Generating strategic lenses offline');

        const orgType = this._detectOrganizationType(storyText);
        const baseFaces = FACE_TEMPLATES[orgType] || FACE_TEMPLATES.default;

        // Generate three lens variations
        const lenses = {
            growth: {
                name: 'Expansion Focus',
                description: 'Emphasizing growth potential in each domain',
                faces: baseFaces.map(f => ({
                    ...f,
                    emphasis: `Growth opportunity in ${f.name}`
                }))
            },
            stability: {
                name: 'Foundation Focus',
                description: 'Emphasizing stability and relationships between domains',
                faces: baseFaces.map(f => ({
                    ...f,
                    emphasis: `Stability anchor in ${f.name}`
                }))
            },
            innovation: {
                name: 'Emergence Focus',
                description: 'Emphasizing creative potential at domain intersections',
                faces: baseFaces.map(f => ({
                    ...f,
                    emphasis: `Innovation potential in ${f.name}`
                }))
            }
        };

        return {
            organizationType: orgType,
            lenses: lenses,
            source: 'offline'
        };
    }

    // ========================================
    // KPI EXTRACTION
    // ========================================

    /**
     * Extract KPIs with octave-aware templates (offline fallback)
     * @param {string} storyText - The organization story
     * @param {string} mode - 'quick' (12 KPIs) or 'full' (60 KPIs with elements)
     * @param {string} octave - Target octave 'O1'-'O7' (default: 'O2')
     */
    async extractKPIs(storyText, mode = 'quick', octave = 'O2') {
        this.log('Extracting KPIs offline', { mode, octave });

        const kpiCount = mode === 'quick' ? 12 : 60;

        // Get octave-appropriate KPI templates
        const kpis = this._generateOctaveKPIs(kpiCount, octave);

        // Try to extract financial data from story
        const financials = this._extractFinancialsFromStory(storyText);

        return {
            mode,
            octave,
            totalKPIs: kpiCount,
            financials,
            kpis,
            source: 'offline',
            note: `KPI templates for ${octave} level (offline mode)`
        };
    }

    /**
     * Generate octave-appropriate KPI templates
     */
    _generateOctaveKPIs(kpiCount, octave) {
        const templates = this._getOctaveKPITemplates(octave);
        const kpis = [];
        const elements = ['earth', 'water', 'fire', 'air', 'ether'];
        const elementNames = ['Earth', 'Water', 'Fire', 'Air', 'Ether'];

        for (let faceId = 1; faceId <= 12; faceId++) {
            const faceTemplate = templates[faceId] || templates.default;

            if (kpiCount === 60) {
                // Full mode: 5 KPIs per face (one per element)
                elements.forEach((elemCode, idx) => {
                    const elemTemplate = faceTemplate[elemCode] || faceTemplate.default;
                    kpis.push({
                        faceId,
                        label: elemTemplate.label,
                        element: elementNames[idx],
                        elementCode: elemCode,
                        question: elemTemplate.question,
                        unit: elemTemplate.unit || 'score',
                        target: elemTemplate.target || '0.618',
                        reasoning: `${octave} level ${elementNames[idx]} aspect`,
                        source: 'offline_template'
                    });
                });
            } else {
                // Quick mode: 1 primary KPI per face (Earth element)
                const primaryTemplate = faceTemplate.earth || faceTemplate.default;
                kpis.push({
                    faceId,
                    label: primaryTemplate.label,
                    question: primaryTemplate.question,
                    unit: primaryTemplate.unit || 'score',
                    target: primaryTemplate.target || '0.618',
                    reasoning: `Primary ${octave} indicator`,
                    source: 'offline_template'
                });
            }
        }

        return kpis;
    }

    /**
     * Get octave-specific KPI templates
     * These are simplified versions - full implementation will load from CSV
     */
    _getOctaveKPITemplates(octave) {
        const baseTemplates = {
            // Face 1: Financial Capital
            1: {
                earth: { label: 'Cash Position', question: 'Do we have tangible resources?', unit: '$', target: 'varies' },
                water: { label: 'Cash Flow Rate', question: 'How does money circulate?', unit: '$/month', target: 'positive' },
                fire: { label: 'Burn Efficiency', question: 'How effectively do we convert capital?', unit: '%', target: '0.618' },
                air: { label: 'Financial Transparency', question: 'How clear is our financial story?', unit: 'score', target: '0.8' },
                ether: { label: 'Capital Purpose Alignment', question: 'Does our spending serve our mission?', unit: 'score', target: '0.764' }
            },
            // Face 2: Intellectual Capital
            2: {
                earth: { label: 'IP Assets', question: 'What tangible knowledge do we own?', unit: 'count', target: 'varies' },
                water: { label: 'Knowledge Flow', question: 'How does learning circulate?', unit: 'score', target: '0.618' },
                fire: { label: 'Innovation Rate', question: 'How fast do ideas become reality?', unit: '%', target: '0.382' },
                air: { label: 'Knowledge Sharing', question: 'Is expertise communicated well?', unit: 'score', target: '0.764' },
                ether: { label: 'Wisdom Integration', question: 'Do our ideas serve deeper purpose?', unit: 'score', target: '0.618' }
            },
            // Face 3: Human Capital
            3: {
                earth: { label: 'Team Size', question: 'How many people do we have?', unit: 'count', target: 'varies' },
                water: { label: 'Talent Flow', question: 'How do people move and grow?', unit: 'score', target: '0.618' },
                fire: { label: 'Team Energy', question: 'What is our collective motivation?', unit: 'score', target: '0.764' },
                air: { label: 'Communication Quality', question: 'Do we understand each other?', unit: 'score', target: '0.764' },
                ether: { label: 'Purpose Alignment', question: 'Does the team share our mission?', unit: 'score', target: '0.854' }
            },
            // Face 4: Structural Capital
            4: {
                earth: { label: 'Process Documentation', question: 'Are systems documented?', unit: 'score', target: '0.618' },
                water: { label: 'Process Efficiency', question: 'How smoothly do systems run?', unit: '%', target: '0.764' },
                fire: { label: 'System Adaptability', question: 'Can systems change when needed?', unit: 'score', target: '0.618' },
                air: { label: 'Process Clarity', question: 'Does everyone understand the systems?', unit: 'score', target: '0.764' },
                ether: { label: 'Structure Purpose Fit', question: 'Do systems serve our mission?', unit: 'score', target: '0.618' }
            },
            // Face 5: Market Resonance
            5: {
                earth: { label: 'Customer Count', question: 'How many customers do we have?', unit: 'count', target: 'varies' },
                water: { label: 'Market Flow', question: 'How do customers move through our funnel?', unit: '%', target: '0.382' },
                fire: { label: 'Market Traction', question: 'How strongly is the market responding?', unit: 'score', target: '0.618' },
                air: { label: 'Market Message', question: 'Is our value proposition clear?', unit: 'score', target: '0.764' },
                ether: { label: 'Market Purpose', question: 'Are we serving a real need?', unit: 'score', target: '0.854' }
            },
            // Face 6: Community & Partners
            6: {
                earth: { label: 'Partner Count', question: 'How many strategic partners?', unit: 'count', target: 'varies' },
                water: { label: 'Partnership Flow', question: 'How do partnerships develop?', unit: 'score', target: '0.618' },
                fire: { label: 'Network Energy', question: 'How active is our ecosystem?', unit: 'score', target: '0.618' },
                air: { label: 'Community Connection', question: 'How well do we communicate with partners?', unit: 'score', target: '0.764' },
                ether: { label: 'Ecosystem Purpose', question: 'Do partnerships serve shared mission?', unit: 'score', target: '0.618' }
            },
            // Face 7: Brand & Reputation
            7: {
                earth: { label: 'Brand Assets', question: 'What tangible brand elements exist?', unit: 'count', target: 'varies' },
                water: { label: 'Brand Perception Flow', question: 'How is perception changing?', unit: 'trend', target: 'positive' },
                fire: { label: 'Brand Energy', question: 'How much passion does our brand evoke?', unit: 'score', target: '0.618' },
                air: { label: 'Brand Message Clarity', question: 'Is our brand story coherent?', unit: 'score', target: '0.764' },
                ether: { label: 'Brand Authenticity', question: 'Does our brand reflect our truth?', unit: 'score', target: '0.854' }
            },
            // Face 8: Core Operations
            8: {
                earth: { label: 'Deliverables Count', question: 'What have we shipped?', unit: 'count', target: 'varies' },
                water: { label: 'Delivery Flow', question: 'How smoothly do we deliver?', unit: 'score', target: '0.764' },
                fire: { label: 'Execution Speed', question: 'How fast can we execute?', unit: 'velocity', target: 'varies' },
                air: { label: 'Operations Clarity', question: 'Does everyone know their role?', unit: 'score', target: '0.764' },
                ether: { label: 'Operations Purpose', question: 'Does our work matter?', unit: 'score', target: '0.618' }
            },
            // Face 9: Regenerative Flow
            9: {
                earth: { label: 'Sustainability Assets', question: 'What regenerative systems exist?', unit: 'count', target: 'varies' },
                water: { label: 'Renewal Cycles', question: 'How do we regenerate?', unit: 'score', target: '0.618' },
                fire: { label: 'Growth Energy', question: 'What drives sustainable growth?', unit: 'score', target: '0.618' },
                air: { label: 'Sustainability Message', question: 'Do we communicate our impact?', unit: 'score', target: '0.618' },
                ether: { label: 'Regenerative Purpose', question: 'Do we leave things better?', unit: 'score', target: '0.764' }
            },
            // Face 10: Foundational Values
            10: {
                earth: { label: 'Values Documentation', question: 'Are our values written down?', unit: 'binary', target: '1' },
                water: { label: 'Values Integration', question: 'How do values flow through decisions?', unit: 'score', target: '0.764' },
                fire: { label: 'Values Passion', question: 'How strongly are values felt?', unit: 'score', target: '0.764' },
                air: { label: 'Values Communication', question: 'Are values understood by all?', unit: 'score', target: '0.854' },
                ether: { label: 'Values Authenticity', question: 'Do we live our values?', unit: 'score', target: '0.854' }
            },
            // Face 11: Funding Pipeline
            11: {
                earth: { label: 'Funding Secured', question: 'How much funding do we have?', unit: '$', target: 'varies' },
                water: { label: 'Funding Flow', question: 'How is capital developing?', unit: 'trend', target: 'positive' },
                fire: { label: 'Investor Energy', question: 'How excited are investors?', unit: 'score', target: '0.618' },
                air: { label: 'Investor Communication', question: 'Are investors well informed?', unit: 'score', target: '0.764' },
                ether: { label: 'Funding Purpose Alignment', question: 'Does funding serve our mission?', unit: 'score', target: '0.764' }
            },
            // Face 12: Risk & Resilience
            12: {
                earth: { label: 'Risk Inventory', question: 'What risks have we identified?', unit: 'count', target: 'varies' },
                water: { label: 'Risk Adaptation', question: 'How do we respond to change?', unit: 'score', target: '0.618' },
                fire: { label: 'Resilience Strength', question: 'How quickly do we bounce back?', unit: 'score', target: '0.618' },
                air: { label: 'Risk Communication', question: 'Are risks clearly communicated?', unit: 'score', target: '0.764' },
                ether: { label: 'Antifragility', question: 'Do challenges make us stronger?', unit: 'score', target: '0.618' }
            },
            default: {
                earth: { label: 'Tangible Assets', question: 'What can be measured?', unit: 'count', target: 'varies' },
                water: { label: 'Flow Dynamics', question: 'How does this circulate?', unit: 'score', target: '0.618' },
                fire: { label: 'Transformative Energy', question: 'What drives change?', unit: 'score', target: '0.618' },
                air: { label: 'Communication Clarity', question: 'How well is this understood?', unit: 'score', target: '0.764' },
                ether: { label: 'Purpose Alignment', question: 'Does this serve the mission?', unit: 'score', target: '0.618' },
                default: { label: 'Health Indicator', question: 'How healthy is this area?', unit: 'score', target: '0.618' }
            }
        };

        // Apply octave-specific question modifiers
        return this._applyOctaveModifiers(baseTemplates, octave);
    }

    /**
     * Apply octave-specific question modifiers to templates
     */
    _applyOctaveModifiers(templates, octave) {
        const octavePrefix = {
            'O1': 'Survival: ',
            'O2': 'Structure: ',
            'O3': 'Relationship: ',
            'O4': 'Creative: ',
            'O5': 'Expressive: ',
            'O6': 'Visionary: ',
            'O7': 'Radiant: '
        };

        const prefix = octavePrefix[octave] || '';

        // Deep clone and modify questions
        const modified = JSON.parse(JSON.stringify(templates));

        for (const faceId of Object.keys(modified)) {
            if (faceId === 'default') continue;
            for (const element of Object.keys(modified[faceId])) {
                if (modified[faceId][element].question) {
                    modified[faceId][element].question = prefix + modified[faceId][element].question;
                }
            }
        }

        return modified;
    }

    /**
     * Extract financial data from story text using patterns
     */
    _extractFinancialsFromStory(text) {
        const lowerText = text.toLowerCase();

        // Revenue patterns
        let revenue = null;
        const revenueMatch = text.match(/\$?([\d,.]+)\s*(m|million|k|thousand|b|billion)?\s*(arr|mrr|revenue)/i);
        if (revenueMatch) {
            revenue = { value: revenueMatch[0], source: 'story' };
        }

        // Runway patterns
        let runway = null;
        const runwayMatch = text.match(/([\d]+)\s*(months?|years?)\s*(of\s+)?runway/i);
        if (runwayMatch) {
            runway = { value: runwayMatch[0], source: 'story' };
        }

        // Team size patterns
        let teamSize = null;
        const teamMatch = text.match(/([\d]+)\s*(person|people|employee|team member|founder)/i);
        if (teamMatch) {
            teamSize = { value: teamMatch[1], source: 'story' };
        }

        // Growth rate patterns
        let growthRate = null;
        const growthMatch = text.match(/([\d]+)%?\s*(growth|growing|increase)/i);
        if (growthMatch) {
            growthRate = { value: growthMatch[1] + '%', source: 'story' };
        }

        return {
            revenue: revenue || { value: null, source: 'not detected' },
            runway: runway || { value: null, source: 'not detected' },
            teamSize: teamSize || { value: null, source: 'not detected' },
            growthRate: growthRate || { value: null, source: 'not detected' }
        };
    }

    // ========================================
    // OCTAVE DETERMINATION
    // ========================================

    async determineOctaves(faces, storyText) {
        this.log('Determining octaves offline');

        const overallSentiment = this._estimateOverallSentiment(storyText);

        // Map sentiment to octave
        const sentimentToOctave = (s) => {
            if (s < 0.236) return 'O1';
            if (s < 0.382) return 'O2';
            if (s < 0.5) return 'O3';
            if (s < 0.618) return 'O4';
            if (s < 0.764) return 'O5';
            if (s < 0.854) return 'O6';
            return 'O7';
        };

        const assignments = faces.map(face => ({
            faceId: face.id,
            octave: sentimentToOctave(face.sentiment || 0.5),
            reasoning: 'Estimated from sentiment score (offline mode)'
        }));

        return {
            overallOctave: sentimentToOctave(overallSentiment),
            assignments,
            source: 'offline'
        };
    }

    // ========================================
    // ARCHETYPE SUGGESTION
    // ========================================

    async suggestArchetype(storyText) {
        this.log('Suggesting archetype offline');

        const detected = this._detectArchetype(storyText);

        // Calculate blend scores
        const blend = {};
        for (const archetype of Object.keys(ARCHETYPE_PRESETS)) {
            blend[archetype] = archetype === detected ? 0.4 : 0.15;
        }

        return {
            primary: detected,
            secondary: detected === 'Builder' ? 'Guardian' : 'Builder',
            reasoning: 'Detected from keyword patterns (offline mode)',
            confidence: 0.6,
            archetypeBlend: blend,
            constants: ARCHETYPE_PRESETS[detected],
            source: 'offline'
        };
    }

    // ========================================
    // EDGE NAMING
    // ========================================

    async generateEdgeNames(edges, faceNames) {
        this.log('Generating edge names offline');

        const edgeNames = edges.map(edge => {
            const face1 = faceNames.get(edge.faceIds[0]) || `Face ${edge.faceIds[0]}`;
            const face2 = faceNames.get(edge.faceIds[1]) || `Face ${edge.faceIds[1]}`;

            return {
                id: edge.id,
                name: `${face1} <-> ${face2}`,
                archetype: 'Bridge',
                source: 'derived'
            };
        });

        return {
            edges: edgeNames,
            source: 'offline',
            note: 'Edge names derived from face names (offline mode)'
        };
    }

    // ========================================
    // VERTEX NAMING
    // ========================================

    async generateVertexNames(vertices, faceNames) {
        this.log('Generating vertex names offline');

        const vertexNames = vertices.map(vertex => {
            const names = vertex.faceIds.map(id =>
                (faceNames.get(id) || `Face ${id}`).split(' ')[0]
            );

            return {
                id: vertex.id,
                name: `Nexus: ${names.join('-')}`,
                vortexType: 'neutral',
                source: 'derived'
            };
        });

        return {
            vertices: vertexNames,
            source: 'offline',
            note: 'Vertex names derived from face names (offline mode)'
        };
    }

    // ========================================
    // CAPABILITIES
    // ========================================

    /**
     * Generate content - throws in offline mode to trigger fallback
     * AI Shadow Adapter will use template-based detection instead
     *
     * @param {string} prompt - The prompt (not used in offline mode)
     * @throws {Error} Always throws to signal fallback needed
     */
    async generateContent(prompt) {
        this.log('generateContent called in offline mode - triggering fallback');
        throw new Error('generateContent not available in offline mode');
    }

    getCapabilities() {
        return {
            ...super.getCapabilities(),
            supportsLenses: true,
            supportsKPIExtraction: false, // Limited in offline mode
            supportsOctaves: true,
            supportsArchetypes: true,
            supportsEdgeNaming: true,
            supportsVertexNaming: true,
            supportsAIShadows: false, // Not available in offline mode
            note: 'Using semantic analysis fallback'
        };
    }
}

// ========================================
// EXPORTS
// ========================================

export { OfflineProvider, FACE_TEMPLATES };
// Note: ARCHETYPE_PRESETS kept local; canonical export is from tuning/archetype-presets.js

// Export for browser global
if (typeof window !== 'undefined') {
    window.OfflineProvider = OfflineProvider;
}
