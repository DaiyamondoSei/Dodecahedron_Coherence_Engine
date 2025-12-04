/**
 * ========================================
 * OPENAI PROVIDER - GPT-5-nano Backend
 * ========================================
 *
 * Uses OpenAI's new Responses API with GPT-5-nano model.
 * Ultra-low latency, cost-effective option for real-time applications.
 *
 * Model: gpt-5-nano (2025-08-07)
 * Pricing: $0.05/1M input, $0.40/1M output
 *
 * Features:
 * - reasoning_effort: "none" | "low" | "medium" | "high"
 * - verbosity: "low" | "medium" | "high"
 *
 * @see https://platform.openai.com/docs/models/gpt-5-nano
 * @see https://cookbook.openai.com/examples/gpt-5/gpt-5_new_params_and_tools
 *
 * @module OpenAIProvider
 * @version Sprint 2 - Extended
 */

import { AIProvider } from './ai-provider.js';

// PHI-DERIVED CONSTANTS for octave thresholds (same as Gemini)
const PHI_THRESHOLDS = {
    PHI_NEG_4: 0.146,
    PHI_NEG_3: 0.236,
    PHI_NEG_2: 0.382,
    PHI_NEG_1: 0.618,
    PSI_3: 0.764,
    PSI_4: 0.854
};

// OpenAI-specific defaults
const OPENAI_DEFAULTS = {
    MODEL: 'gpt-5-nano',
    BASE_URL: 'https://api.openai.com/v1',
    REASONING_LEVELS: ['none', 'low', 'medium', 'high'],
    VERBOSITY_LEVELS: ['low', 'medium', 'high'],
    DEFAULT_REASONING: 'low',
    DEFAULT_VERBOSITY: 'medium',
    PRICING: {
        INPUT_PER_MILLION: 0.05,
        OUTPUT_PER_MILLION: 0.40
    }
};

/**
 * OpenAIProvider - GPT-5-nano powered AI provider
 */
class OpenAIProvider extends AIProvider {
    constructor(apiKey) {
        super();

        this.name = 'OpenAIProvider';
        this.isOnline = true;
        this.apiKey = apiKey;
        this.baseUrl = 'https://api.openai.com/v1';
        this.model = 'gpt-5-nano';

        // Default settings for low-latency responses
        this.defaultReasoning = 'low';
        this.defaultVerbosity = 'medium';
    }

    // ========================================
    // CONNECTION TEST
    // ========================================

    async testConnection() {
        if (!this.apiKey) {
            this.logError('testConnection', new Error('No API key provided'));
            return false;
        }

        try {
            const response = await this._callResponsesAPI('Respond with only: OK');
            return response && response.toUpperCase().includes('OK');
        } catch (error) {
            this.logError('testConnection', error);
            return false;
        }
    }

    // ========================================
    // STORY ANALYSIS
    // ========================================

    async analyzeStory(storyText) {
        const prompt = this._buildStoryAnalysisPrompt(storyText);

        try {
            const response = await this._callResponsesAPI(prompt, {
                reasoning: 'medium',
                verbosity: 'medium'
            });
            return this._parseJSONResponse(response);
        } catch (error) {
            this.logError('analyzeStory', error);
            throw error;
        }
    }

    _buildStoryAnalysisPrompt(storyText) {
        return `You are the Quannex Organizational Architect, an expert system based on Sacred Geometry.
Map this organizational story to a 12-Face Dodecahedron model.

THE 12 FACES:
1. Financial Capital - Resource acquisition/management
2. Intellectual Capital - Knowledge, IP, innovation
3. Human Capital - Team, culture, talent
4. Structural Capital - Systems, processes, infrastructure
5. Market Resonance - Market position, perception
6. Community & Partners - External relationships
7. Brand & Reputation - Identity, trust
8. Core Operations - Execution, delivery
9. Regenerative Flow - Sustainability, renewal
10. Foundational Values - Ethics, purpose
11. Funding Pipeline - Investment, growth capital
12. Risk & Resilience - Protection, adaptability

NAMING GUIDELINES:
- Names should be evocative and specific to THIS organization
- GOOD: "The Innovation Engine" (for R&D)
- BAD: "Research and Development" (too generic)

USER STORY:
"${storyText}"

Return ONLY valid JSON (no markdown):
{
    "type": "Startup|Business|Non-Profit|Project|Community|Personal",
    "focus": "One sentence summary",
    "faces": [
        { "id": 1, "name": "Contextual Name", "icon": "emoji", "sentiment": 0.75, "reasoning": "Why this name" },
        ... (all 12 faces)
    ]
}`;
    }

    // ========================================
    // STRATEGIC LENSES
    // ========================================

    async generateStrategicLenses(storyText) {
        const prompt = this._buildStrategicLensesPrompt(storyText);

        try {
            const response = await this._callResponsesAPI(prompt, {
                reasoning: 'medium',
                verbosity: 'high'
            });
            return this._parseJSONResponse(response);
        } catch (error) {
            this.logError('generateStrategicLenses', error);
            throw error;
        }
    }

    _buildStrategicLensesPrompt(storyText) {
        return `Generate 3 Strategic Lenses for analyzing this organization as a dodecahedron:

1. GROWTH LENS (Face-Centered): How can each domain grow stronger?
2. STABILITY LENS (Edge-Centered): How well do domains support each other?
3. INNOVATION LENS (Vertex-Centered): What emerges from domain intersections?

USER STORY: "${storyText}"

Return ONLY valid JSON:
{
    "organizationType": "type",
    "lenses": {
        "growth": { "name": "...", "description": "...", "faces": [{id, name, icon, emphasis}...] },
        "stability": { "name": "...", "description": "...", "faces": [...] },
        "innovation": { "name": "...", "description": "...", "faces": [...] }
    }
}`;
    }

    // ========================================
    // KPI EXTRACTION
    // ========================================

    /**
     * Extract KPIs from story with octave-aware guidance
     * @param {string} storyText - The organization story
     * @param {string} mode - 'quick' (12 KPIs) or 'full' (60 KPIs with 5 elements)
     * @param {string} octave - Target octave 'O1'-'O7' (default: 'O2')
     */
    async extractKPIs(storyText, mode = 'quick', octave = 'O2') {
        const kpiCount = mode === 'quick' ? 12 : 60;
        const prompt = this._buildKPIExtractionPrompt(storyText, kpiCount, octave);

        console.log(`[OpenAIProvider] extractKPIs called: mode=${mode}, octave=${octave}, kpiCount=${kpiCount}`);

        try {
            const response = await this._callResponsesAPI(prompt, {
                reasoning: 'medium',  // Increased for octave-aware analysis
                verbosity: 'medium'
            });
            return this._parseJSONResponse(response);
        } catch (error) {
            this.logError('extractKPIs', error);
            throw error;
        }
    }

    _buildKPIExtractionPrompt(storyText, kpiCount, octave = 'O2') {
        const kpisPerFace = kpiCount / 12;
        const isFullMode = kpiCount === 60;

        // Octave-specific question focus
        const octaveGuidance = this._getOctaveGuidance(octave);

        // Element structure for full mode
        const elementGuidance = isFullMode ? `
ELEMENTAL STRUCTURE (5 elements per face for Full Mode):
- E1 Earth: Tangible, grounded metrics (counts, currency, %)
- E2 Water: Flow/growth metrics (rates, velocity, growth %)
- E3 Fire: Energy/productivity metrics (efficiency, ROI, conversion)
- E4 Air: Communication/clarity metrics (time, clarity scores, speed)
- E5 Ether: Vision/purpose metrics (alignment scores 1-10)

For each face, generate 5 KPIs - one per element.
` : '';

        return `You are the Quannex KPI Analyst. Extract or intelligently estimate ${kpiCount} KPIs from this organizational story.

OCTAVE CONTEXT: ${octave}
${octaveGuidance}

THE 12 ORGANIZATIONAL FACES (${kpisPerFace} KPI${kpisPerFace > 1 ? 's' : ''} per face):
1. Financial Capital - Resource acquisition/management
2. Intellectual Capital - Knowledge, IP, innovation
3. Human Capital - Team, culture, talent
4. Structural Capital - Systems, processes, infrastructure
5. Market Resonance - Market position, perception
6. Community & Partners - External relationships
7. Brand & Reputation - Identity, trust
8. Core Operations - Execution, delivery
9. Regenerative Flow - Sustainability, renewal
10. Foundational Values - Ethics, purpose
11. Funding Pipeline - Investment, growth capital
12. Risk & Resilience - Protection, adaptability
${elementGuidance}
EXTRACTION RULES:
- EXTRACT exact values when mentioned in the story
- ESTIMATE reasonable values when implied (mark source: "estimated")
- Match KPI complexity to the ${octave} octave level
- KPI names should reflect ${octave} developmental focus
- Include appropriate units (%, €, $, people, months, etc.)
${isFullMode ? '- Include element and elementCode for each KPI' : ''}

USER STORY:
"${storyText}"

Return ONLY valid JSON (no markdown):
{
    "mode": "${isFullMode ? 'full' : 'quick'}",
    "octave": "${octave}",
    "totalKPIs": ${kpiCount},
    "financials": {
        "revenue": { "value": number|null, "source": "extracted|estimated|unknown" },
        "runway": { "value": number|null, "unit": "months", "source": "..." },
        "teamSize": { "value": number, "source": "..." },
        "burnRate": { "value": number|null, "unit": "€/month", "source": "..." }
    },
    "kpis": [
        { "faceId": 1, "name": "KPI Name", "value": 0, "unit": "unit", "source": "extracted|estimated"${isFullMode ? ', "element": "Earth", "elementCode": "E1"' : ''}, "reasoning": "..." },
        ... (${kpiCount} total KPIs)
    ]
}`;
    }

    /**
     * Get octave-specific guidance for KPI extraction
     */
    _getOctaveGuidance(octave) {
        const guidance = {
            'O1': `SURVIVAL FOCUS: Basic existence questions
- "Is it safe?" "Is it moving?" "Do we have enough to exist?"
- KPIs should focus on immediate survival metrics`,
            'O2': `STRUCTURE FOCUS: Stability and systems questions
- "Are our accounts in order?" "Is our cash flow predictable?"
- KPIs should focus on operational stability and basic systems`,
            'O3': `RELATIONSHIPS FOCUS: Connection and trust questions
- "Is there trust?" "Are relationships healthy?" "Is there belonging?"
- KPIs should focus on stakeholder relationships and team cohesion`,
            'O4': `CREATIVITY FOCUS: Innovation and possibility questions
- "Can we experiment?" "Is there creative flow?" "Are we innovating?"
- KPIs should focus on creative output and innovation capacity`,
            'O5': `EXPRESSION FOCUS: Clarity and communication questions
- "Is our story clear?" "Are we teaching?" "Is our message resonant?"
- KPIs should focus on communication effectiveness and brand clarity`,
            'O6': `VISION FOCUS: Long-term and legacy questions
- "Is our plan long-term?" "Are we building legacy?" "What's our 10-year view?"
- KPIs should focus on strategic vision and generational impact`,
            'O7': `RADIANCE FOCUS: Service and transcendence questions
- "Is our work sacred?" "Are we serving the whole?" "Is this a gift to the world?"
- KPIs should focus on systemic impact and higher purpose`
        };
        return guidance[octave] || guidance['O2'];
    }

    // ========================================
    // OCTAVE DETERMINATION
    // ========================================

    async determineOctaves(faces, storyText) {
        const prompt = this._buildOctaveDeterminationPrompt(faces, storyText);

        try {
            const response = await this._callResponsesAPI(prompt, {
                reasoning: 'medium',
                verbosity: 'low'
            });
            return this._parseJSONResponse(response);
        } catch (error) {
            this.logError('determineOctaves', error);
            throw error;
        }
    }

    _buildOctaveDeterminationPrompt(faces, storyText) {
        const facesList = faces.map(f => `Face ${f.id}: ${f.name} (sentiment: ${f.sentiment})`).join('\n');

        return `Determine developmental octave (O1-O7) for each organizational face:

O1-Survival, O2-Structure, O3-Relationships, O4-Creativity, O5-Expression, O6-Vision, O7-Radiance

Low sentiment (<0.382) = O1-O2, Moderate (0.382-0.618) = O3-O4, High (>0.618) = O5-O7

FACES:
${facesList}

CONTEXT: "${storyText}"

Return ONLY valid JSON:
{
    "overallOctave": "O1-O7",
    "assignments": [{ "faceId": 1, "octave": "O4", "reasoning": "..." }, ...]
}`;
    }

    // ========================================
    // ARCHETYPE SUGGESTION
    // ========================================

    async suggestArchetype(storyText) {
        const prompt = this._buildArchetypeSuggestionPrompt(storyText);

        try {
            const response = await this._callResponsesAPI(prompt, {
                reasoning: 'low',
                verbosity: 'low'
            });
            return this._parseJSONResponse(response);
        } catch (error) {
            this.logError('suggestArchetype', error);
            throw error;
        }
    }

    _buildArchetypeSuggestionPrompt(storyText) {
        return `Suggest the best organizational archetype:

1. BUILDER - Structure, execution, tangible outcomes
2. NURTURER - Relationships, sustainable growth
3. INNOVATOR - Creativity, new possibilities
4. GUARDIAN - Protection, preservation
5. CONNECTOR - Ecosystems, partnerships

USER STORY: "${storyText}"

Return ONLY valid JSON:
{
    "primary": "Builder|Nurturer|Innovator|Guardian|Connector",
    "secondary": "...",
    "reasoning": "...",
    "confidence": 0.85,
    "archetypeBlend": { "Builder": 0.25, "Nurturer": 0.15, ... }
}`;
    }

    // ========================================
    // EDGE NAMING
    // ========================================

    async generateEdgeNames(edges, faceNames) {
        const prompt = this._buildEdgeNamingPrompt(edges, faceNames);

        try {
            const response = await this._callResponsesAPI(prompt, {
                reasoning: 'low',
                verbosity: 'medium'
            });
            return this._parseJSONResponse(response);
        } catch (error) {
            this.logError('generateEdgeNames', error);
            throw error;
        }
    }

    _buildEdgeNamingPrompt(edges, faceNames) {
        const edgeList = edges.slice(0, 10).map(e => {
            const face1 = faceNames.get(e.faceIds[0]) || `Face ${e.faceIds[0]}`;
            const face2 = faceNames.get(e.faceIds[1]) || `Face ${e.faceIds[1]}`;
            return `${e.id}: ${face1} <-> ${face2}`;
        }).join('\n');

        return `Generate EMERGENT names for edges (not concatenations):
BAD: "Finance-HR Connection"
GOOD: "Team Investment Capacity"

EDGES:
${edgeList}

Return ONLY valid JSON:
{ "edges": [{ "id": "E1-2", "name": "Emergent Name", "archetype": "Bridge|Flow|Tension" }, ...] }`;
    }

    // ========================================
    // VERTEX NAMING
    // ========================================

    async generateVertexNames(vertices, faceNames) {
        const prompt = this._buildVertexNamingPrompt(vertices, faceNames);

        try {
            const response = await this._callResponsesAPI(prompt, {
                reasoning: 'low',
                verbosity: 'medium'
            });
            return this._parseJSONResponse(response);
        } catch (error) {
            this.logError('generateVertexNames', error);
            throw error;
        }
    }

    _buildVertexNamingPrompt(vertices, faceNames) {
        const vertexList = vertices.slice(0, 5).map(v => {
            const names = v.faceIds.map(id => faceNames.get(id) || `Face ${id}`);
            return `${v.id}: ${names.join(' + ')}`;
        }).join('\n');

        return `Generate EMERGENT names for vertices (where 3 faces converge):

VERTICES:
${vertexList}

Return ONLY valid JSON:
{ "vertices": [{ "id": "V1", "name": "Emergent Name", "vortexType": "ascending|descending|neutral" }, ...] }`;
    }

    // ========================================
    // RESPONSES API CALL
    // ========================================

    /**
     * Call OpenAI's Responses API
     * @param {string} input - The prompt/input text
     * @param {Object} options - Optional parameters
     * @returns {Promise<string>} Response text
     */
    async _callResponsesAPI(input, options = {}) {
        const {
            reasoning = this.defaultReasoning,
            verbosity = this.defaultVerbosity
        } = options;

        const response = await fetch(`${this.baseUrl}/responses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: this.model,
                input: input,
                reasoning: { effort: reasoning },
                text: { verbosity: verbosity }
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`OpenAI API Error: ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();

        // Handle Responses API structure
        // output array contains: [reasoning object, message object]
        // We need to find the "message" type output
        if (data.output && Array.isArray(data.output) && data.output.length > 0) {
            // Find the message output (not reasoning)
            const messageOutput = data.output.find(item => item.type === 'message');

            if (messageOutput && messageOutput.content && Array.isArray(messageOutput.content)) {
                // Find the output_text content
                const textContent = messageOutput.content.find(c => c.type === 'output_text');
                if (textContent && textContent.text) {
                    return textContent.text;
                }
            }

            // Fallback: try first output with content
            for (const output of data.output) {
                if (output.content && Array.isArray(output.content) && output.content.length > 0) {
                    const text = output.content[0].text;
                    if (text) return text;
                }
            }
        }

        // Fallback for simpler response structure
        if (data.output_text) {
            return data.output_text;
        }

        console.error('[OpenAI] Unexpected response:', JSON.stringify(data, null, 2));
        throw new Error('Unexpected response structure from OpenAI API');
    }

    /**
     * Parse JSON from response text
     */
    _parseJSONResponse(text) {
        try {
            const cleanText = text
                .replace(/```json\s*/gi, '')
                .replace(/```\s*/g, '')
                .trim();

            return JSON.parse(cleanText);
        } catch (error) {
            this.logError('parseJSON', error);
            throw new Error('Failed to parse AI response as JSON');
        }
    }

    // ========================================
    // CONFIGURATION
    // ========================================

    /**
     * Set default reasoning effort
     * @param {string} level - "none" | "low" | "medium" | "high"
     */
    setReasoningEffort(level) {
        if (['none', 'low', 'medium', 'high'].includes(level)) {
            this.defaultReasoning = level;
        }
    }

    /**
     * Set default verbosity
     * @param {string} level - "low" | "medium" | "high"
     */
    setVerbosity(level) {
        if (['low', 'medium', 'high'].includes(level)) {
            this.defaultVerbosity = level;
        }
    }

    /**
     * Get provider capabilities
     */
    getCapabilities() {
        return {
            ...super.getCapabilities(),
            model: this.model,
            supportsReasoning: true,
            supportsVerbosity: true,
            estimatedLatency: 'ultra-low',
            pricing: {
                input: '$0.05/1M tokens',
                output: '$0.40/1M tokens'
            }
        };
    }
}

// ========================================
// EXPORTS
// ========================================

export { OpenAIProvider, PHI_THRESHOLDS, OPENAI_DEFAULTS };

// Export for browser global
if (typeof window !== 'undefined') {
    window.OpenAIProvider = OpenAIProvider;
}
