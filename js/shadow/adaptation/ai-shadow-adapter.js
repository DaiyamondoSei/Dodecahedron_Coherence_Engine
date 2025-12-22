/**
 * ═══════════════════════════════════════════════════════════════════════════
 * AI SHADOW ADAPTER - AI-Powered Shadow Generation
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Extends ShadowAdapter with AI capabilities to generate:
 * - Unique shadow patterns based on custom face configurations
 * - Contextual narratives (suppressed/integrated forms)
 * - Tailored prescriptions specific to the organization
 *
 * Falls back to template-based detection when AI is unavailable.
 *
 * @module AIShadowAdapter
 * @version Enhanced - December 2025 Modularization
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * NOTES FOR FUTURE CLAUDE
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * 1. TWO MODES OF OPERATION:
 *    A) AI Mode: Uses Gemini/OpenAI to generate contextual shadows
 *       - Requires aiProvider set via setProvider()
 *       - Sends face data + organization context to AI
 *       - Parses structured JSON response
 *
 *    B) Fallback Mode: Template-based shadow detection
 *       - Used when no AI provider or API call fails
 *       - Uses fallbackDetection() method
 *       - Generates shadows from spectral/contradiction patterns
 *
 * ────────────────────────────────────────────────────────────────────────────
 * 2. PHI-DERIVED THRESHOLDS (from shadow-harmonics.js)
 * ────────────────────────────────────────────────────────────────────────────
 *
 *    All thresholds are mathematically derived from the Golden Ratio:
 *
 *    HIGH_THRESHOLD = 0.764 = PSI_3 = 1 - φ⁻³  (Mastery level)
 *    LOW_THRESHOLD  = 0.236 = PHI_3 = φ⁻³     (Shadows emerging)
 *    PHI_INV        = 0.618 = φ⁻¹             (Primary balance point)
 *
 *    Primary source: js/shadow/constants/shadow-harmonics.js
 *    Root source: js/constants/phi-harmonics.js
 *
 * ────────────────────────────────────────────────────────────────────────────
 * 3. CACHE STRATEGY
 * ────────────────────────────────────────────────────────────────────────────
 *
 *    - 5-minute TTL for AI responses (configurable via cacheTimeout)
 *    - Cache key based on face IDs + organization context hash
 *    - Prevents redundant API calls on repeated requests
 *
 * ────────────────────────────────────────────────────────────────────────────
 * 4. DEMO MODE (Agent Council - December 2024)
 * ────────────────────────────────────────────────────────────────────────────
 *
 *    Enable via: localStorage.setItem('quannexDemoMode', 'true')
 *    Behavior:
 *    - Bypasses AI entirely, returns DEMO_SHADOW_CACHE
 *    - Essential for thesis defense reliability
 *    - Pre-generated insights avoid API latency/failures
 *
 * ────────────────────────────────────────────────────────────────────────────
 * 5. SHADOW NORMALIZATION
 * ────────────────────────────────────────────────────────────────────────────
 *
 *    AI responses are normalized via _normalizeShadow():
 *    - Ensures consistent field names (suppressed, integrated, prescription)
 *    - Generates unique IDs if not provided
 *    - Maps severity to valid values (critical/high/moderate/low)
 *
 * ────────────────────────────────────────────────────────────────────────────
 * 6. PROMPT ENGINEERING
 * ────────────────────────────────────────────────────────────────────────────
 *
 *    _buildShadowDiscoveryPrompt() crafts a structured prompt:
 *    - Organization context (type, stage, story)
 *    - All 12 faces with current health percentages
 *    - Instructions for shadow analysis format
 *    - Request for exactly 3-5 unique shadow patterns
 *
 * ────────────────────────────────────────────────────────────────────────────
 * 7. NAVIGATION MAP
 * ────────────────────────────────────────────────────────────────────────────
 *
 *    This module connects to:
 *
 *    IMPORTS FROM:
 *    ├─ js/ai/core/mapping-context.js → Face names, breath axes
 *    └─ js/shadow/constants/shadow-harmonics.js → Thresholds (via window)
 *
 *    USED BY:
 *    ├─ js/shadow/ui/shadow-panel.js → AI enhance button
 *    └─ js/dodec/dodec-shadow-overlay.js → AI shadow source
 *
 *    PROVIDERS:
 *    ├─ js/ai/providers/gemini-provider.js
 *    └─ js/ai/providers/openai-provider.js
 *
 * ────────────────────────────────────────────────────────────────────────────
 * 8. ERROR HANDLING
 * ────────────────────────────────────────────────────────────────────────────
 *
 *    All AI calls wrapped in try/catch with fallback:
 *    - Console logs errors for debugging
 *    - Falls back to template detection
 *    - Never throws to calling code
 *
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { MappingContext } from '../../ai/core/mapping-context.js';

// ═══════════════════════════════════════════════════════════════════════════
// PHI CONSTANTS - From Shadow Harmonics (Single Source of Truth)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Import thresholds from ShadowHarmonics, falling back to PhiHarmonics, then inline
 *
 * Priority:
 * 1. window.ShadowHarmonics.SHADOW_THRESHOLDS (preferred)
 * 2. window.PhiHarmonics (fallback)
 * 3. Inline constants (last resort)
 */
const _SH = (typeof window !== 'undefined' && window.ShadowHarmonics) || {};
const _PH = (typeof window !== 'undefined' && window.PhiHarmonics) || {};

// PHI-derived constants for shadow detection thresholds
const PHI_INV = _PH.PHI_1 || 0.618033988749895;           // φ⁻¹ ≈ 0.618
const HIGH_THRESHOLD = _SH.SHADOW_THRESHOLDS?.HIGH || _PH.PSI_3 || 0.763932022500210;    // Ψ³ ≈ 0.764
const LOW_THRESHOLD = _SH.SHADOW_THRESHOLDS?.LOW || _PH.PHI_3 || 0.2360679774997896;     // φ⁻³ ≈ 0.236

// ═══════════════════════════════════════════════════════════════════════════
// DEMO MODE CACHE - Pre-generated Insights
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Per Agent Council (December 2024): For thesis demo reliability
 * These cached shadows bypass AI calls during demo presentations
 */
const DEMO_SHADOW_CACHE = [
    {
        id: 'demo_shadow_1',
        name: 'Innovation vs Stability',
        type: 'polarity_tension',
        severity: 'moderate',
        suppressed: 'The drive for breakthrough innovation is being suppressed by risk-averse processes.',
        integrated: 'Creative experimentation balanced with proven stability creates sustainable evolution.',
        prescription: 'Create a "safe sandbox" for experiments that don\'t risk core operations.'
    },
    {
        id: 'demo_shadow_2',
        name: 'Individual vs Collective',
        type: 'boundary_shadow',
        severity: 'high',
        suppressed: 'Individual voices are getting lost in committee consensus.',
        integrated: 'Strong individuals contributing unique gifts to collective purpose.',
        prescription: 'Institute "voice rounds" where each person speaks before group discussion.'
    },
    {
        id: 'demo_shadow_3',
        name: 'Speed vs Quality',
        type: 'resource_shadow',
        severity: 'moderate',
        suppressed: 'Rush to deliver is compromising craftsmanship and attention to detail.',
        integrated: 'Sustainable pace where quality enhances speed through reduced rework.',
        prescription: 'Define "good enough" criteria upfront; celebrate quality wins equally with speed.'
    }
];

// ═══════════════════════════════════════════════════════════════════════════
// AI SHADOW ADAPTER CLASS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * AIShadowAdapter - AI-Powered Shadow Pattern Discovery
 *
 * Discovers and generates contextual shadow patterns by analyzing
 * tensions between custom faces using AI understanding.
 */
class AIShadowAdapter {
    constructor(options = {}) {
        this.context = MappingContext.getInstance();
        this.aiProvider = options.provider || null;
        this.cache = new Map();
        this.cacheTimeout = options.cacheTimeout || 5 * 60 * 1000; // 5 minutes

        // Demo mode: Use cached shadows for reliable thesis presentations
        // Toggle via: localStorage.setItem('quannexDemoMode', 'true')
        this.demoMode = localStorage.getItem('quannexDemoMode') === 'true';
        if (this.demoMode) {
            console.log('[AIShadowAdapter] 🎭 Demo mode active - using cached insights');
        }
    }

    /**
     * Set or update the AI provider
     * @param {Object} provider - AI provider instance (Gemini, OpenAI, etc.)
     */
    setProvider(provider) {
        this.aiProvider = provider;
        return this;
    }

    // ════════════════════════════════════════════════════════════════════════
    // AI SHADOW DISCOVERY
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Generate unique shadow patterns using AI analysis
     * Analyzes face relationships to discover organizational tensions
     *
     * @param {Array} faces - Array of face objects with id, name, sentiment
     * @param {Object} organizationContext - Context about the organization
     * @returns {Promise<Array>} Array of discovered shadow patterns
     */
    async generateAIShadowPatterns(faces, organizationContext = {}) {
        // Demo mode: Return pre-cached shadows for reliable presentations
        if (this.demoMode) {
            console.log('[AIShadowAdapter] 🎭 Demo mode - returning cached shadow patterns');
            return DEMO_SHADOW_CACHE;
        }

        if (!this.aiProvider) {
            console.warn('[AIShadowAdapter] No AI provider set, using fallback detection');
            return this.fallbackDetection(faces);
        }

        // Check cache first
        const cacheKey = this._generateCacheKey(faces, organizationContext);
        const cached = this._getFromCache(cacheKey);
        if (cached) {
            console.log('[AIShadowAdapter] Returning cached shadow patterns');
            return cached;
        }

        try {
            const prompt = this._buildShadowDiscoveryPrompt(faces, organizationContext);
            const response = await this.aiProvider.generateContent(prompt);
            const shadows = this._parseShadowResponse(response);

            // Cache the results
            this._setCache(cacheKey, shadows);

            console.log(`[AIShadowAdapter] AI discovered ${shadows.length} unique shadow patterns`);
            return shadows;
        } catch (error) {
            console.error('[AIShadowAdapter] AI shadow generation failed:', error);
            return this.fallbackDetection(faces);
        }
    }

    /**
     * Build the prompt for AI shadow discovery
     * @private
     */
    _buildShadowDiscoveryPrompt(faces, context) {
        const faceList = faces.map(f =>
            `${f.id}. ${f.name || f.customName || f.baseName} (${f.icon || '●'}) - Health: ${((f.sentiment || f.faceEnergy || 0.5) * 100).toFixed(0)}%`
        ).join('\n');

        return `You are the Quannex Shadow Interpreter - expert in organizational psychology, systems dynamics, and Jungian shadow work.

ORGANIZATION CONTEXT:
${context.story || context.description || 'Custom organization undergoing analysis'}
Type: ${context.type || 'Unknown'}
Stage: ${context.octaveRange || 'Not specified'}

THE 12 ORGANIZATIONAL FACES (with current health):
${faceList}

SHADOW WORK PRINCIPLES:
- A shadow is an organizational hypocrisy - a contradiction between stated values and actual behavior
- Every shadow, when integrated, becomes a gift (Jungian principle)
- Shadows emerge from face-to-face tensions, especially when high-performing faces deplete others

TASK: Discover Shadow Patterns
Analyze tensions, contradictions, and hidden dynamics between these specific faces.
Look for:
1. High-performing faces (>70%) that may be depleting low-performing ones (<30%)
2. Gaps between aspirational faces and foundational ones
3. Imbalances that create systemic fragility
4. Hidden dependencies or single points of failure
5. Say-do gaps (brand promise vs operational reality)

Generate 2-4 unique shadow patterns specific to THIS organization.
Use the ACTUAL face names provided, not generic terms.

OUTPUT FORMAT (Return ONLY valid JSON, no markdown):
{
  "shadows": [
    {
      "id": "kebab-case-unique-id",
      "name": "Evocative Shadow Name (3-4 words)",
      "involvedFaces": [face_id_numbers],
      "severity": "critical|significant|moderate|minimal",
      "suppressed": {
        "title": "The Challenge (3-5 words)",
        "narrative": "2-3 sentences describing the shadow pattern using actual face names",
        "insight": "What this reveals about the organization (1 sentence)"
      },
      "integrated": {
        "title": "The Gift - Reframed (3-5 words)",
        "narrative": "2-3 sentences describing the potential when integrated",
        "opportunity": "How to transform this shadow (1 sentence)"
      },
      "prescriptions": {
        "action": "What to DO - immediate, specific action (1 sentence)",
        "insight": "What to UNDERSTAND - deeper pattern at play (1 sentence)",
        "opportunity": "What becomes POSSIBLE - the transformation awaiting (1 sentence)"
      }
    }
  ]
}`;
    }

    /**
     * Parse AI response into shadow objects
     * @private
     */
    _parseShadowResponse(response) {
        try {
            // Handle different response formats
            let jsonStr = response;

            if (typeof response === 'object' && response.text) {
                jsonStr = response.text;
            }

            // Clean markdown code blocks if present
            jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

            const parsed = JSON.parse(jsonStr);
            const shadows = parsed.shadows || parsed;

            // Validate and normalize shadow objects
            return shadows.map(shadow => this._normalizeShadow(shadow)).filter(s => s !== null);
        } catch (error) {
            console.error('[AIShadowAdapter] Failed to parse AI response:', error);
            return [];
        }
    }

    /**
     * Normalize shadow object to ensure required fields.
     *
     * WHY: Shadows come from multiple sources:
     * - AI generation (structured with title/narrative/insight + prescriptions object)
     * - Template detection (simple strings + single prescription)
     * - Legacy data in sessionStorage (old format)
     *
     * This function ensures ALL shadows have the same shape
     * before reaching the card renderer.
     *
     * PRESCRIPTIONS HANDLING:
     * - New format: { action, insight, opportunity } object
     * - Legacy format: single prescription string (→ becomes action)
     *
     * @private
     */
    _normalizeShadow(shadow) {
        if (!shadow || !shadow.name) return null;

        // Normalize prescriptions (support BOTH formats for backwards compatibility)
        let prescriptions = {
            action: '',
            insight: '',
            opportunity: ''
        };

        if (shadow.prescriptions && typeof shadow.prescriptions === 'object') {
            // New structured format from AI (v2.0)
            prescriptions = {
                action: shadow.prescriptions.action || '',
                insight: shadow.prescriptions.insight || '',
                opportunity: shadow.prescriptions.opportunity || ''
            };
        } else if (shadow.prescription) {
            // Legacy single string - treat as action
            prescriptions.action = shadow.prescription;
        }

        return {
            id: shadow.id || shadow.name.toLowerCase().replace(/\s+/g, '-'),
            name: shadow.name,
            involvedFaces: shadow.involvedFaces || [],
            severity: shadow.severity || 'moderate',
            suppressed: typeof shadow.suppressed === 'string'
                ? shadow.suppressed
                : shadow.suppressed?.narrative || shadow.suppressed?.title || 'Shadow pattern detected',
            integrated: typeof shadow.integrated === 'string'
                ? shadow.integrated
                : shadow.integrated?.narrative || shadow.integrated?.title || 'Integration potential awaits',
            // NEW: 3-type prescriptions object
            prescriptions,
            // LEGACY: Keep single prescription for backwards compatibility
            prescription: prescriptions.action || shadow.prescription || shadow.recommendation || '',
            aiGenerated: true,
            // Preserve full structure if available
            suppressedFull: typeof shadow.suppressed === 'object' ? shadow.suppressed : null,
            integratedFull: typeof shadow.integrated === 'object' ? shadow.integrated : null
        };
    }

    // ════════════════════════════════════════════════════════════════════════
    // FALLBACK DETECTION (Template-Based)
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Fallback to template-based shadow detection when AI is unavailable
     * Uses PHI-derived energy thresholds to detect the 6 archetypal patterns
     *
     * Thresholds from shadow-harmonics.js:
     * - HIGH_THRESHOLD = PSI_3 (0.764) - Mastery level
     * - LOW_THRESHOLD = PHI_3 (0.236) - Shadows emerging
     *
     * @param {Array} faces - Array of face objects
     * @returns {Array} Detected shadow patterns
     */
    fallbackDetection(faces) {
        const patterns = [];
        const energies = {};

        // Build energy map
        faces.forEach(f => {
            const energy = f.sentiment || f.faceEnergy || 0.5;
            energies[f.id] = energy;
        });

        // Get face names for narrative
        const getName = (id) => {
            const face = faces.find(f => f.id === id);
            return face?.name || face?.customName || face?.baseName || `Face ${id}`;
        };

        // 1. Brittle Profit: High finance (F1 or F11), low resilience (F12)
        if ((energies[1] >= HIGH_THRESHOLD || energies[11] >= HIGH_THRESHOLD) && energies[12] <= LOW_THRESHOLD) {
            const highFace = energies[1] >= HIGH_THRESHOLD ? 1 : 11;
            patterns.push({
                id: 'brittle-profit',
                name: 'Brittle Profit',
                involvedFaces: [highFace, 12],
                severity: energies[12] < 0.2 ? 'critical' : 'significant',
                suppressed: `${getName(highFace)} is flourishing, but ${getName(12)} remains neglected. Success without resilience is fragile.`,
                integrated: `The gap between ${getName(highFace)} and ${getName(12)} reveals your growth edge. Building this bridge creates antifragility.`,
                prescriptions: {
                    action: 'Create a resilience roadmap: succession planning, knowledge documentation, system redundancy.',
                    insight: 'Profit without protection is borrowed time—every success increases the stakes of failure.',
                    opportunity: 'Antifragile wealth: the more you stress-test, the stronger you become.'
                }
            });
        }

        // 2. Extractive Growth: High finance, low regeneration (F9)
        if ((energies[1] >= HIGH_THRESHOLD || energies[11] >= HIGH_THRESHOLD) && energies[9] <= LOW_THRESHOLD) {
            const highFace = energies[1] >= HIGH_THRESHOLD ? 1 : 11;
            patterns.push({
                id: 'extractive-growth',
                name: 'Extractive Growth',
                involvedFaces: [highFace, 9],
                severity: energies[9] < 0.2 ? 'critical' : 'significant',
                suppressed: `${getName(highFace)} grows by depleting ${getName(9)}. Sawing off the branch you're sitting on.`,
                integrated: `${getName(highFace)} can become regenerative through ${getName(9)}. Growth that nourishes its source.`,
                prescriptions: {
                    action: 'Audit your supply chain and identify three ways to "give back" to your sources.',
                    insight: 'Extraction feels efficient but compounds into scarcity—regeneration feels slow but compounds into abundance.',
                    opportunity: 'Becoming a regenerative force means you never run out of what you need most.'
                }
            });
        }

        // 3. Experience Gap: High brand (F7 or F5), low operations/human (F8, F3)
        if ((energies[7] >= HIGH_THRESHOLD || energies[5] >= HIGH_THRESHOLD) &&
            (energies[8] <= LOW_THRESHOLD || energies[3] <= LOW_THRESHOLD)) {
            const highFace = energies[7] >= HIGH_THRESHOLD ? 7 : 5;
            const lowFace = energies[8] <= LOW_THRESHOLD ? 8 : 3;
            patterns.push({
                id: 'experience-gap',
                name: 'The Experience Gap',
                involvedFaces: [highFace, lowFace],
                severity: 'significant',
                suppressed: `${getName(highFace)} promises what ${getName(lowFace)} cannot deliver. The say-do gap erodes trust.`,
                integrated: `Aligning ${getName(highFace)} with ${getName(lowFace)} creates authentic brand power.`,
                prescriptions: {
                    action: 'Mystery-shop your own experience and document every gap between promise and delivery.',
                    insight: 'The gap is visible to everyone except those inside—customers feel what you can\'t see.',
                    opportunity: 'Closing this gap creates word-of-mouth that no marketing budget can buy.'
                }
            });
        }

        // 4. Burnout Engine: High operations (F8), low human capital (F3)
        if (energies[8] >= HIGH_THRESHOLD && energies[3] <= LOW_THRESHOLD) {
            patterns.push({
                id: 'burnout-engine',
                name: 'Burnout Engine',
                involvedFaces: [8, 3],
                severity: energies[3] < 0.2 ? 'critical' : 'significant',
                suppressed: `${getName(8)} runs efficiently while ${getName(3)} depletes. The machine runs perfectly; the operators collapse.`,
                integrated: `Sustainable excellence emerges when ${getName(8)} honors ${getName(3)}. Performance with well-being.`,
                prescriptions: {
                    action: 'Institute mandatory recovery time: 4-day work week pilot or "no meetings" days.',
                    insight: 'Efficiency without humanity is a debt that compounds in turnover, illness, and quiet quitting.',
                    opportunity: 'Sustainable brilliance: teams that thrive outperform teams that survive.'
                }
            });
        }

        // 5. Hollow Governance: High structure (F4), low values (F10)
        if (energies[4] >= HIGH_THRESHOLD && energies[10] <= LOW_THRESHOLD) {
            patterns.push({
                id: 'hollow-governance',
                name: 'Hollow Governance',
                involvedFaces: [4, 10],
                severity: 'moderate',
                suppressed: `${getName(4)} is elaborate, but ${getName(10)} is absent. Rules without soul.`,
                integrated: `${getName(4)} becomes meaningful when infused with ${getName(10)}. Structure that serves purpose.`,
                prescriptions: {
                    action: 'Run a "values audit": for each major policy, ask "What value does this serve?"',
                    insight: 'Structure without meaning breeds compliance without commitment—the letter kills, the spirit gives life.',
                    opportunity: 'Governance that embodies values creates self-organizing alignment.'
                }
            });
        }

        // 6. Lonely Hero: High intellectual (F2), low resilience (F12)
        if (energies[2] >= HIGH_THRESHOLD && energies[12] <= 0.5) {
            patterns.push({
                id: 'lonely-hero',
                name: 'Lonely Hero',
                involvedFaces: [2, 12],
                severity: 'significant',
                suppressed: `${getName(2)} concentrates in one place while ${getName(12)} has no backup. Brilliant but fragile.`,
                integrated: `${getName(2)} multiplied through others creates ${getName(12)}. Shared genius is resilient genius.`,
                prescriptions: {
                    action: 'Start a "knowledge sharing" practice: every hero documents one thing they know that no one else does.',
                    insight: 'Single points of brilliance are single points of failure—the hero\'s absence is catastrophic.',
                    opportunity: 'Distributed genius: many people carrying the flame means it can never go out.'
                }
            });
        }

        console.log(`[AIShadowAdapter] Fallback detected ${patterns.length} shadow patterns`);
        return patterns;
    }

    // ════════════════════════════════════════════════════════════════════════
    // SHADOW ENRICHMENT
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Enrich existing shadow with AI-generated narrative
     * Used to enhance template-detected shadows with contextual stories
     *
     * @param {Object} shadow - Existing shadow object
     * @param {Object} context - Organization context
     * @returns {Promise<Object>} Enriched shadow
     */
    async enrichShadowNarrative(shadow, context = {}) {
        if (!this.aiProvider || !shadow) {
            return shadow;
        }

        try {
            const prompt = this._buildEnrichmentPrompt(shadow, context);
            const response = await this.aiProvider.generateContent(prompt);
            const enriched = this._parseEnrichmentResponse(response);

            return {
                ...shadow,
                aiEnriched: true,
                enrichedNarrative: enriched
            };
        } catch (error) {
            console.error('[AIShadowAdapter] Shadow enrichment failed:', error);
            return shadow;
        }
    }

    /**
     * Build prompt for shadow narrative enrichment
     * @private
     */
    _buildEnrichmentPrompt(shadow, context) {
        const faceNames = shadow.involvedFaces?.map(id => {
            const face = this.context.getFace(id);
            return face?.name || `Face ${id}`;
        }).join(', ') || 'Unknown faces';

        return `You are the Quannex Shadow Interpreter.

SHADOW PATTERN: ${shadow.name}
Involved Faces: ${faceNames}
Current Severity: ${shadow.severity}
Current Description: ${shadow.suppressed || shadow.description}

ORGANIZATION CONTEXT:
${context.story || context.description || 'Organization undergoing shadow analysis'}

TASK: Enrich this shadow pattern with deeper narrative.
Write more evocative, contextual versions of:
1. The suppressed form (the challenge)
2. The integrated form (the gift)
3. A specific, actionable prescription

Use the actual face names. Make it personal to THIS organization.

OUTPUT FORMAT (JSON only):
{
  "suppressed": "2-3 sentences, vivid and specific",
  "integrated": "2-3 sentences, hopeful and actionable",
  "prescription": "1-2 specific recommendations"
}`;
    }

    /**
     * Parse enrichment response
     * @private
     */
    _parseEnrichmentResponse(response) {
        try {
            let jsonStr = typeof response === 'string' ? response : response.text;
            jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            return JSON.parse(jsonStr);
        } catch (error) {
            console.error('[AIShadowAdapter] Failed to parse enrichment:', error);
            return null;
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // CACHING
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Generate cache key from faces and context
     * @private
     */
    _generateCacheKey(faces, context) {
        const faceSignature = faces.map(f => `${f.id}:${(f.sentiment || 0.5).toFixed(2)}`).join('|');
        const contextSignature = context.type || 'default';
        return `shadows_${contextSignature}_${faceSignature}`;
    }

    /**
     * Get item from cache if not expired
     * @private
     */
    _getFromCache(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }
        this.cache.delete(key);
        return null;
    }

    /**
     * Set item in cache
     * @private
     */
    _setCache(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    /**
     * Clear the shadow cache
     */
    clearCache() {
        this.cache.clear();
        console.log('[AIShadowAdapter] Cache cleared');
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export { AIShadowAdapter };

// Also expose globally for non-module usage
if (typeof window !== 'undefined') {
    window.AIShadowAdapter = AIShadowAdapter;
}
