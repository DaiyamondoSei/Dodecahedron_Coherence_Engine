/**
 * ========================================
 * GEMINI PROVIDER - Primary AI Backend
 * ========================================
 *
 * Extends existing GeminiClient with full AIProvider interface.
 * Uses Google's Gemini API for organizational analysis.
 *
 * Model Strategy:
 * - Primary: gemini-2.5-flash (latest, fastest)
 * - Fallback: gemini-1.5-flash (stable)
 *
 * @module GeminiProvider
 * @version Sprint 2 - Task 10
 */

import { AIProvider } from './ai-provider.js';

// PHI-DERIVED CONSTANTS for octave thresholds
const PHI_THRESHOLDS = {
    PHI_NEG_4: 0.146,  // Minimal
    PHI_NEG_3: 0.236,  // Low
    PHI_NEG_2: 0.382,  // Moderate-Low
    PHI_NEG_1: 0.618,  // Moderate-High
    PSI_3: 0.764,      // High (Mastery)
    PSI_4: 0.854       // Very High
};

/**
 * GeminiProvider - Primary AI provider using Google's Gemini API
 */
class GeminiProvider extends AIProvider {
    constructor(apiKey) {
        super();

        this.name = 'GeminiProvider';
        this.isOnline = true;
        this.apiKey = apiKey;
        this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
        this.primaryModel = 'gemini-2.5-flash';
        this.fallbackModel = 'gemini-1.5-flash';
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
            // Simple test call
            const response = await this._callApi(this.primaryModel, 'Respond with only: OK');
            return response && response.trim().toUpperCase().includes('OK');
        } catch (error) {
            // Try fallback
            try {
                const response = await this._callApi(this.fallbackModel, 'Respond with only: OK');
                return response && response.trim().toUpperCase().includes('OK');
            } catch (fallbackError) {
                this.logError('testConnection', fallbackError);
                return false;
            }
        }
    }

    // ========================================
    // STORY ANALYSIS
    // ========================================

    async analyzeStory(storyText) {
        const prompt = this._buildStoryAnalysisPrompt(storyText);

        try {
            const response = await this._callApiWithFallback(prompt);
            return this._parseJSONResponse(response);
        } catch (error) {
            this.logError('analyzeStory', error);
            throw error;
        }
    }

    _buildStoryAnalysisPrompt(storyText) {
        return `
You are the Quannex Organizational Architect, an expert system based on Sacred Geometry.
Your task is to map the user's organizational story to a 12-Face Dodecahedron model.

THE 12 FACES (Standard Model):
1. Financial Capital (Foundation - Resource acquisition and management)
2. Intellectual Capital (Knowledge, IP, innovation capacity)
3. Human Capital (Team, culture, talent)
4. Structural Capital (Systems, processes, infrastructure)
5. Market Resonance (Market position, customer perception)
6. Community & Partners (External relationships, ecosystem)
7. Brand & Reputation (Identity, trust, recognition)
8. Core Operations (Execution, delivery, production)
9. Regenerative Flow (Sustainability, renewal, adaptation)
10. Foundational Values (Ethics, purpose, principles)
11. Funding Pipeline (Investment, growth capital, runway)
12. Risk & Resilience (Protection, contingency, adaptability)

INSTRUCTIONS:
1. Analyze the user's story carefully.
2. Determine the organization type (Business, Startup, Non-Profit, Project, Community, or Personal).
3. Create CONTEXTUAL names for each face that capture the ESSENCE of that domain for THIS organization.
4. Estimate a "sentiment/health" score (0.0 - 1.0) for each face based on explicit or implied information.
5. Provide brief reasoning for each face name and score.

NAMING GUIDELINES:
- Names should be evocative and specific, not generic
- GOOD: "The Innovation Engine" (for R&D at a tech startup)
- BAD: "Research and Development" (too generic)
- GOOD: "Community Heartbeat" (for a community org's engagement)
- BAD: "Customer Experience" (too corporate for community)

USER STORY:
"${storyText}"

OUTPUT FORMAT (Return ONLY valid JSON, no markdown):
{
    "type": "Startup|Business|Non-Profit|Project|Community|Personal",
    "focus": "One sentence describing the organization's primary focus",
    "faces": [
        { "id": 1, "name": "Contextual Name", "icon": "Relevant Emoji", "sentiment": 0.75, "reasoning": "Why this name and score" },
        { "id": 2, "name": "...", "icon": "...", "sentiment": 0.5, "reasoning": "..." },
        ... (all 12 faces)
    ]
}
`;
    }

    // ========================================
    // STRATEGIC LENSES
    // ========================================

    async generateStrategicLenses(storyText) {
        const prompt = this._buildStrategicLensesPrompt(storyText);

        try {
            const response = await this._callApiWithFallback(prompt);
            return this._parseJSONResponse(response);
        } catch (error) {
            this.logError('generateStrategicLenses', error);
            throw error;
        }
    }

    _buildStrategicLensesPrompt(storyText) {
        return `
You are the Quannex Strategic Lens Architect. Generate 3 different interpretive lenses for this organization's dodecahedron.

THE 3 STRATEGIC LENSES:

1. GROWTH LENS (Face-Centered)
   - Focus: Domain expansion, capability building
   - Emphasis: Individual face strength and potential
   - Question: "How can each domain grow stronger?"

2. STABILITY LENS (Edge-Centered)
   - Focus: Relationship health, connection resilience
   - Emphasis: Bridges between domains
   - Question: "How well do domains support each other?"

3. INNOVATION LENS (Vertex-Centered)
   - Focus: Emergent synergies, creative convergence
   - Emphasis: Points where 3 domains meet and create new possibilities
   - Question: "What emerges from domain intersections?"

For each lens, provide contextual face names that emphasize that lens's perspective.

USER STORY:
"${storyText}"

OUTPUT FORMAT (Return ONLY valid JSON, no markdown):
{
    "organizationType": "Startup|Business|Non-Profit|etc",
    "lenses": {
        "growth": {
            "name": "Growth-oriented title",
            "description": "How this lens views the organization",
            "faces": [
                { "id": 1, "name": "Growth-focused name", "icon": "emoji", "emphasis": "What to grow" },
                ... (all 12)
            ]
        },
        "stability": {
            "name": "Stability-oriented title",
            "description": "How this lens views the organization",
            "faces": [
                { "id": 1, "name": "Stability-focused name", "icon": "emoji", "emphasis": "What to stabilize" },
                ... (all 12)
            ]
        },
        "innovation": {
            "name": "Innovation-oriented title",
            "description": "How this lens views the organization",
            "faces": [
                { "id": 1, "name": "Innovation-focused name", "icon": "emoji", "emphasis": "What could emerge" },
                ... (all 12)
            ]
        }
    }
}
`;
    }

    // ========================================
    // KPI EXTRACTION
    // ========================================

    async extractKPIs(storyText, mode = 'quick') {
        const kpiCount = mode === 'quick' ? 12 : 60;
        const prompt = this._buildKPIExtractionPrompt(storyText, kpiCount);

        try {
            const response = await this._callApiWithFallback(prompt);
            return this._parseJSONResponse(response);
        } catch (error) {
            this.logError('extractKPIs', error);
            throw error;
        }
    }

    _buildKPIExtractionPrompt(storyText, kpiCount) {
        const perFace = kpiCount / 12;
        return `
You are a KPI extraction specialist. Extract ${kpiCount} Key Performance Indicators from this organizational story.

REQUIREMENTS:
- Extract ${perFace} KPI(s) per face (12 faces total)
- Prioritize explicit numbers mentioned in the text
- Estimate ranges when exact values aren't provided
- Mark each KPI as 'extracted' (from text) or 'estimated' (inferred)

COMMON KPI PATTERNS TO LOOK FOR:
- Revenue, profit, runway, burn rate
- Team size, growth rate, churn
- Customer count, satisfaction scores
- Product metrics, milestones
- Time-based goals, deadlines

USER STORY:
"${storyText}"

OUTPUT FORMAT (Return ONLY valid JSON, no markdown):
{
    "mode": "quick|full",
    "totalKPIs": ${kpiCount},
    "financials": {
        "revenue": { "value": "amount or null", "source": "extracted|estimated" },
        "runway": { "value": "months or null", "source": "extracted|estimated" },
        "teamSize": { "value": "number or null", "source": "extracted|estimated" },
        "growthRate": { "value": "percentage or null", "source": "extracted|estimated" }
    },
    "kpis": [
        { "faceId": 1, "name": "KPI Name", "value": "value", "unit": "unit", "source": "extracted|estimated" },
        ... (${kpiCount} total)
    ]
}
`;
    }

    // ========================================
    // OCTAVE DETERMINATION
    // ========================================

    async determineOctaves(faces, storyText) {
        const prompt = this._buildOctaveDeterminationPrompt(faces, storyText);

        try {
            const response = await this._callApiWithFallback(prompt);
            return this._parseJSONResponse(response);
        } catch (error) {
            this.logError('determineOctaves', error);
            throw error;
        }
    }

    _buildOctaveDeterminationPrompt(faces, storyText) {
        const facesList = faces.map(f => `Face ${f.id}: ${f.name} (sentiment: ${f.sentiment})`).join('\n');

        return `
You are the Quannex Octave Analyst. Determine the developmental octave (O1-O7) for each organizational face.

THE 7 OCTAVES:
O1 - Survival: Baseline viability, keeping lights on, existential focus
O2 - Structure: Building systems, creating foundation, establishing order
O3 - Relationships: Network development, tribe building, connection focus
O4 - Creativity: Innovation activation, unique value expression, differentiation
O5 - Expression: Communication optimization, being heard, influence expansion
O6 - Vision: Strategic foresight, seeing possibilities, future orientation
O7 - Radiance: Systemic transcendence, industry leadership, lighthouse status

OCTAVE INDICATORS:
- Low sentiment (< 0.382) often indicates O1-O2
- Moderate sentiment (0.382 - 0.618) often indicates O3-O4
- High sentiment (0.618 - 0.764) often indicates O4-O5
- Very high sentiment (> 0.764) often indicates O6-O7

CURRENT FACES:
${facesList}

ORGANIZATIONAL CONTEXT:
"${storyText}"

OUTPUT FORMAT (Return ONLY valid JSON, no markdown):
{
    "overallOctave": "O1-O7 (organization's center of gravity)",
    "assignments": [
        { "faceId": 1, "octave": "O4", "reasoning": "Why this octave for this face" },
        ... (all 12 faces)
    ]
}
`;
    }

    // ========================================
    // ARCHETYPE SUGGESTION
    // ========================================

    async suggestArchetype(storyText) {
        const prompt = this._buildArchetypeSuggestionPrompt(storyText);

        try {
            const response = await this._callApiWithFallback(prompt);
            return this._parseJSONResponse(response);
        } catch (error) {
            this.logError('suggestArchetype', error);
            throw error;
        }
    }

    _buildArchetypeSuggestionPrompt(storyText) {
        return `
You are the Quannex Archetype Advisor. Suggest the best organizational archetype based on this story.

THE 5 ARCHETYPES:

1. THE BUILDER
   - Philosophy: Structure and tangible outcomes
   - Strengths: Systems, execution, reliability
   - Focus: "What can we construct?"

2. THE NURTURER
   - Philosophy: Relationships and sustainable growth
   - Strengths: Team development, culture, care
   - Focus: "How can we support?"

3. THE INNOVATOR
   - Philosophy: Creativity and new possibilities
   - Strengths: R&D, experimentation, disruption
   - Focus: "What hasn't been tried?"

4. THE GUARDIAN
   - Philosophy: Protection and preservation
   - Strengths: Risk management, security, stability
   - Focus: "What must we protect?"

5. THE CONNECTOR
   - Philosophy: Ecosystems and partnerships
   - Strengths: Networks, alliances, integration
   - Focus: "Who should we partner with?"

USER STORY:
"${storyText}"

OUTPUT FORMAT (Return ONLY valid JSON, no markdown):
{
    "primary": "Builder|Nurturer|Innovator|Guardian|Connector",
    "secondary": "The second-best fit archetype",
    "reasoning": "Why the primary archetype fits best",
    "confidence": 0.85,
    "archetypeBlend": {
        "Builder": 0.25,
        "Nurturer": 0.15,
        "Innovator": 0.35,
        "Guardian": 0.10,
        "Connector": 0.15
    }
}
`;
    }

    // ========================================
    // EDGE NAMING
    // ========================================

    async generateEdgeNames(edges, faceNames) {
        const prompt = this._buildEdgeNamingPrompt(edges, faceNames);

        try {
            const response = await this._callApiWithFallback(prompt);
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

        return `
You are the Quannex Edge Synthesizer. Generate EMERGENT names for edges (connections between faces).

NAMING PRINCIPLE:
Edge names should capture the SYNTHESIS of two domains, not just concatenate them.
- BAD: "Finance-HR Connection"
- GOOD: "Team Investment Capacity"
- BAD: "Brand + Operations"
- GOOD: "Delivery Promise Keeper"

SAMPLE EDGES (generate names for all 30):
${edgeList}
... (30 total edges)

OUTPUT FORMAT (Return ONLY valid JSON, no markdown):
{
    "edges": [
        { "id": "E1-2", "name": "Emergent Name", "archetype": "Bridge|Flow|Tension|etc" },
        ... (all edges)
    ]
}
`;
    }

    // ========================================
    // VERTEX NAMING
    // ========================================

    async generateVertexNames(vertices, faceNames) {
        const prompt = this._buildVertexNamingPrompt(vertices, faceNames);

        try {
            const response = await this._callApiWithFallback(prompt);
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

        return `
You are the Quannex Vertex Synthesizer. Generate EMERGENT names for vertices (where 3 faces converge).

NAMING PRINCIPLE:
Vertices are "vortex points" - leverage points for systemic change.
Names should capture what EMERGES when three domains converge.

SAMPLE VERTICES (generate names for all 20):
${vertexList}
... (20 total vertices)

OUTPUT FORMAT (Return ONLY valid JSON, no markdown):
{
    "vertices": [
        { "id": "V1", "name": "Emergent Name", "vortexType": "ascending|descending|neutral" },
        ... (all vertices)
    ]
}
`;
    }

    // ========================================
    // INTERNAL API METHODS
    // ========================================

    async _callApiWithFallback(prompt) {
        try {
            this.log('Calling primary model', { model: this.primaryModel });
            return await this._callApi(this.primaryModel, prompt);
        } catch (error) {
            this.log('Primary failed, trying fallback', { model: this.fallbackModel });
            return await this._callApi(this.fallbackModel, prompt);
        }
    }

    async _callApi(modelName, prompt) {
        const response = await fetch(`${this.baseUrl}/${modelName}:generateContent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': this.apiKey
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    temperature: 0.2,
                    maxOutputTokens: 2000
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Gemini API Error: ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }

    _parseJSONResponse(text) {
        try {
            // Clean markdown code blocks if present
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
}

// ========================================
// EXPORTS
// ========================================

export { GeminiProvider, PHI_THRESHOLDS };

// Export for browser global
if (typeof window !== 'undefined') {
    window.GeminiProvider = GeminiProvider;
}
