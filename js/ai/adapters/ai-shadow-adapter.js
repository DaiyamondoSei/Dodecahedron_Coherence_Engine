/**
 * ========================================
 * AI SHADOW ADAPTER - AI-Powered Shadow Generation
 * ========================================
 *
 * Extends ShadowAdapter with AI capabilities to generate:
 * - Unique shadow patterns based on custom face configurations
 * - Contextual narratives (suppressed/integrated forms)
 * - Tailored prescriptions specific to the organization
 *
 * Falls back to template-based detection when AI is unavailable.
 *
 * @module AIShadowAdapter
 * @version Sprint 5 - Shadow Remediation Enhancement
 */

import { MappingContext } from '../core/mapping-context.js';

// PHI-derived constants for thresholds
const PHI_INV = 0.618;
const HIGH_THRESHOLD = 0.7;
const LOW_THRESHOLD = 0.3;

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
    }

    /**
     * Set or update the AI provider
     * @param {Object} provider - AI provider instance (Gemini, OpenAI, etc.)
     */
    setProvider(provider) {
        this.aiProvider = provider;
        return this;
    }

    // ========================================
    // AI SHADOW DISCOVERY
    // ========================================

    /**
     * Generate unique shadow patterns using AI analysis
     * Analyzes face relationships to discover organizational tensions
     *
     * @param {Array} faces - Array of face objects with id, name, sentiment
     * @param {Object} organizationContext - Context about the organization
     * @returns {Promise<Array>} Array of discovered shadow patterns
     */
    async generateAIShadowPatterns(faces, organizationContext = {}) {
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
      "prescription": "Specific actionable recommendation (1-2 sentences)"
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
     * Normalize shadow object to ensure required fields
     * @private
     */
    _normalizeShadow(shadow) {
        if (!shadow || !shadow.name) return null;

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
            prescription: shadow.prescription || shadow.recommendation || '',
            aiGenerated: true,
            // Preserve full structure if available
            suppressedFull: typeof shadow.suppressed === 'object' ? shadow.suppressed : null,
            integratedFull: typeof shadow.integrated === 'object' ? shadow.integrated : null
        };
    }

    // ========================================
    // FALLBACK DETECTION (Template-Based)
    // ========================================

    /**
     * Fallback to template-based shadow detection when AI is unavailable
     * Uses energy thresholds to detect the 6 archetypal patterns
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
                prescription: 'Invest in resilience: succession planning, knowledge documentation, system redundancy.'
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
                prescription: 'Transition to regenerative practices: circular design, ethical sourcing, local investment.'
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
                prescription: 'Bridge the say-do gap: improve operations to match brand promise, or adjust messaging to match reality.'
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
                prescription: 'Invest in team well-being, psychological safety, and sustainable work rhythms. Slow down to speed up.'
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
                prescription: 'Breathe soul into structure: clarify values, create rituals, ensure governance serves purpose.'
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
                prescription: 'Build redundancy: document knowledge, train others, create a "cultural carrier" team.'
            });
        }

        console.log(`[AIShadowAdapter] Fallback detected ${patterns.length} shadow patterns`);
        return patterns;
    }

    // ========================================
    // SHADOW ENRICHMENT
    // ========================================

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

    // ========================================
    // CACHING
    // ========================================

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

// Export for ES6 modules
export { AIShadowAdapter };

// Also expose globally for non-module usage
if (typeof window !== 'undefined') {
    window.AIShadowAdapter = AIShadowAdapter;
}
