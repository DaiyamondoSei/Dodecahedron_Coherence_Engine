/**
 * ════════════════════════════════════════════════════════════════════════════════
 * GEMINI-CLIENT.JS - THE AI INTERPRETER
 * ════════════════════════════════════════════════════════════════════════════════
 *
 * Gemini API Client for Quannex
 *
 * This module handles AI-powered organizational analysis through Google's Gemini API.
 * It translates human stories into 12-face dodecahedron configurations.
 *
 * @module js/gemini-client
 * @author Deimantas Murauskas & Claude
 * @version 2.1.0 - Gold documentation standard
 * @see {@link ../docs/AI_SYSTEM_GUIDE.md} - Complete AI subsystem architecture
 * @see {@link ../docs/SYSTEM_ARCHITECTURE.md} - Unified system map
 *
 * ════════════════════════════════════════════════════════════════════════════════
 * PHILOSOPHICAL GROUNDING - AI AS INTERPRETER, NOT ORACLE
 * ════════════════════════════════════════════════════════════════════════════════
 *
 * The AI serves as an INTERPRETER of organizational stories, NOT an oracle.
 *
 * KEY PRINCIPLE: The AI TRANSLATES human language into geometric configuration.
 * It does NOT predict, prescribe, or judge. It mirrors back what is present.
 *
 * THE OCTAVE CONSTRAINT prevents "aspiration inflation":
 * - A pre-seed startup CANNOT claim O5+ metrics authentically
 * - Story signals like "runway", "founder", "first customers" indicate O1-O2
 * - The constraint honors WHERE the organization truly IS, not where it dreams
 *
 * WHY THIS MATTERS:
 * - Inflated octaves create false coherence readings
 * - Organizations benefit from honest assessment, not flattery
 * - The dodecahedron reflects reality; the AI serves as faithful translator
 *
 * ════════════════════════════════════════════════════════════════════════════════
 * NAVIGATION MAP - WHAT THIS FILE CONNECTS TO
 * ════════════════════════════════════════════════════════════════════════════════
 *
 * DEPENDS ON:
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │                                                                              │
 * │  js/ai/octave-reference-library.js ───→ detectOrganizationStage()          │
 * │                                    ───→ constrainOctave()                   │
 * │                                    ───→ OCTAVES reference data              │
 * │                                                                              │
 * │  External: Google Gemini API ─────────→ generateContent endpoint            │
 * │                                                                              │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * EXPORTS:
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │                                                                              │
 * │  export class GeminiClient ───────────→ Main API client class              │
 * │     .analyzeStory(text, context) ─────→ Maps story to 12 faces             │
 * │     .extractKPIs(text, mode, octave) ─→ Extracts 12 or 60 KPIs             │
 * │                                                                              │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * USED BY:
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │                                                                              │
 * │  js/orchestrator/steps/story-input.js ─→ AI-assisted face mapping         │
 * │  js/ai/mapping/kpi-extractor.js ───────→ Sprint2 extraction flow          │
 * │  Demo Orchestrator (wizard Step 1) ────→ ?path=ai mode                    │
 * │                                                                              │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * ════════════════════════════════════════════════════════════════════════════════
 * OCTAVE CONSTRAINT TABLE - LIFECYCLE LIMITS
 * ════════════════════════════════════════════════════════════════════════════════
 *
 *   Stage         │ Max Octave │ Typical │ Example Signals
 *   ──────────────┼────────────┼─────────┼─────────────────────────────────
 *   pre-seed      │    O2      │   O1    │ "runway", "founder", "idea"
 *   seed          │    O2      │  O1-O2  │ "burn rate", "first customers"
 *   series-a      │    O3      │  O2-O3  │ "PMF", "scaling", "hiring"
 *   growth        │    O4      │  O3-O4  │ "NPS", "culture", "innovation"
 *   mature        │    O5      │  O4-O5  │ "integrated reporting", "ESG"
 *   legacy        │    O6      │  O5-O6  │ "succession", "generational"
 *   transcendent  │    O7      │  O6-O7  │ "systemic impact", "regenerative"
 *
 * ENFORCEMENT: constrainOctave() caps AI-assigned octaves at the stage maximum.
 * If AI assigns O4 to a pre-seed startup, it becomes O2.
 *
 * ════════════════════════════════════════════════════════════════════════════════
 * NOTES FOR FUTURE CLAUDE - 10 KEY INSIGHTS
 * ════════════════════════════════════════════════════════════════════════════════
 *
 * 1. TIERED FALLBACK:
 *    Primary: gemini-2.5-flash (official Quickstart model)
 *    Fallback: gemini-1.5-flash (if primary fails)
 *    This ensures graceful degradation if newer model unavailable.
 *
 * 2. API KEY PATTERN:
 *    Uses "x-goog-api-key" header (Google's standard approach).
 *    BYOK (Bring Your Own Key) for immediate prototyping.
 *    Key is passed via constructor, never stored globally.
 *
 * 3. TWO MAIN METHODS:
 *    analyzeStory() → Maps narrative to 12 faces (temp: 0.2, more deterministic)
 *    extractKPIs() → Extracts metrics (temp: 0.3, slightly creative)
 *
 * 4. OCTAVE CONSTRAINT IS CRITICAL:
 *    detectOrganizationStage() analyzes story for lifecycle signals
 *    Stages: pre-seed → seed → series-a → growth → mature → legacy → transcendent
 *    constrainOctave() enforces the ceiling - this is INTENTIONAL DESIGN.
 *
 * 5. LENS + VOCABULARY SYSTEM:
 *    Lens = WHERE to look (growth=faces, stability=edges, innovation=vertices)
 *    Vocabulary = HOW to name (grounded, professional, systems, poetic)
 *    Both can have custom prompts via lensPrompt/vocabularyPrompt parameters.
 *
 * 6. JSON PARSING SAFETY:
 *    parseJSONResponse() strips markdown code blocks (```json ... ```)
 *    Validates faces.length === 12 (throws if not)
 *    Invalid JSON throws with original text logged for debugging.
 *
 * 7. TOKEN LIMITS DIFFER BY METHOD:
 *    analyzeStory: maxOutputTokens = 2000
 *    extractKPIs: maxOutputTokens = 4000 (more data)
 *
 * 8. KPI EXTRACTION MODES:
 *    'quick': 12 KPIs (1 per face) - fast prototyping
 *    'full': 60 KPIs (5 per face × 12) - elemental structure (Earth/Water/Fire/Air/Ether)
 *
 * 9. ARCHETYPE DETECTION:
 *    Five archetypes: Builder, Nurturer, Innovator, Guardian, Connector
 *    AI identifies primary + secondary archetype from story language.
 *
 * 10. EXTRACTED METRICS:
 *     AI attempts to pull concrete numbers from story:
 *     revenue, teamSize, runway, customers, growthRate
 *     These are optional - null if not mentioned in story.
 *
 * ════════════════════════════════════════════════════════════════════════════════
 * RISKS & RECOVERY
 * ════════════════════════════════════════════════════════════════════════════════
 *
 * RISK: Rate limiting (HTTP 429)
 * ────────────────────────────────
 * Symptom: API returns 429 status
 * Cause: User exceeded Gemini API rate limits (usually 60 req/min free tier)
 * Recovery: Wait and retry, or prompt user to check API key quota
 * Prevention: Debounce rapid requests, show loading state
 *
 * RISK: JSON parsing failure
 * ──────────────────────────────
 * Symptom: "Failed to parse AI response structure"
 * Cause: AI returned malformed JSON or non-JSON text
 * Recovery: Check console.error for raw text, may need prompt adjustment
 * Prevention: parseJSONResponse() strips markdown, but edge cases exist
 *
 * RISK: Octave inflation
 * ───────────────────────
 * Symptom: Pre-seed startup shows O5+ octaves
 * Cause: AI over-interpreted aspirational language in story
 * Mitigation: constrainOctave() caps at stage maximum (working as designed)
 * Check: detectedStage and maxOctave in result object
 *
 * RISK: Face count mismatch
 * ─────────────────────────
 * Symptom: "AI returned invalid face count (must be 12)"
 * Cause: AI misunderstood prompt, returned fewer/more faces
 * Recovery: Re-run analysis with clearer story input
 * Prevention: Prompt explicitly states "all 12 faces" requirement
 *
 * RISK: API key invalid or missing
 * ─────────────────────────────────
 * Symptom: "API Key is missing" thrown immediately
 * Cause: Constructor received null/undefined apiKey
 * Recovery: Check UI flow - user must enter valid key before analysis
 * Prevention: Validate key format before constructing client
 *
 * RISK: Network timeout
 * ──────────────────────
 * Symptom: Fetch hangs, no response
 * Cause: Network issues or API service degradation
 * Recovery: Implement timeout wrapper, show user-friendly error
 * Note: No built-in timeout currently - consider adding AbortController
 *
 * ════════════════════════════════════════════════════════════════════════════════
 * USAGE EXAMPLE
 * ════════════════════════════════════════════════════════════════════════════════
 *
 * const ai = new GeminiClient(apiKey);
 * const result = await ai.analyzeStory(storyText, {
 *     lens: 'growth',
 *     vocabulary: 'professional'
 * });
 *
 * console.log(result.faces);          // 12 configured faces
 * console.log(result.detectedStage);  // 'seed', 'growth', etc.
 * console.log(result.maxOctave);      // Constraint applied
 *
 * ════════════════════════════════════════════════════════════════════════════════
 */

import { OCTAVES, BREATH_AXES, detectOrganizationStage, constrainOctave } from './ai/octave-reference-library.js';

export class GeminiClient {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = "https://generativelanguage.googleapis.com/v1beta/models";
        // Use the EXACT model from official Quickstart documentation
        this.model = "gemini-2.5-flash";
    }

    /**
     * Analyze an organizational story and map it to the 12 faces
     * @param {string} storyText - User's narrative
     * @param {Object} context - Analysis context (lens, vocabulary, etc.)
     * @returns {Promise<Object>} JSON configuration for the Dodecahedron
     */
    async analyzeStory(storyText, context = {}) {
        if (!this.apiKey) {
            throw new Error("API Key is missing");
        }

        // Tier 1: Primary (Gemini 2.5 Flash - Official Quickstart Model)
        try {
            console.log(`🚀 Attempting ${this.model}...`);
            return await this.callApi(this.model, storyText, context);
        } catch (error) {
            console.warn(`⚠️ ${this.model} failed, attempting fallback (Gemini 1.5 Flash)...`);

            // Tier 2: Fallback (Gemini 1.5 Flash)
            try {
                return await this.callApi("gemini-1.5-flash", storyText, context);
            } catch (tier2Error) {
                console.error("❌ All Gemini models failed:", tier2Error);
                throw tier2Error;
            }
        }
    }

    /**
     * Internal API call method
     */
    async callApi(modelName, storyText, context = {}) {
        const prompt = this.constructPrompt(storyText, context);

        // Use x-goog-api-key header as per Quickstart docs
        const response = await fetch(`${this.baseUrl}/${modelName}:generateContent`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": this.apiKey
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.2,
                    maxOutputTokens: 2000,
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Gemini API Error (${modelName}): ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        const textResponse = data.candidates[0].content.parts[0].text;

        // Parse and add stage/octave constraints
        const result = this.parseJSONResponse(textResponse);

        // Detect stage and constrain octaves
        const stageInfo = detectOrganizationStage(storyText);
        result.detectedStage = stageInfo.stage;
        result.maxOctave = stageInfo.maxOctave;

        // Constrain overall octave if present
        if (result.overallOctave) {
            result.overallOctave = constrainOctave(result.overallOctave, stageInfo.maxOctave);
        }

        return result;
    }

    /**
     * Construct the prompt with Dodecahedron context
     * @param {string} storyText - User's narrative
     * @param {Object} context - Analysis context
     */
    constructPrompt(storyText, context = {}) {
        const { lens, lensPrompt, vocabulary, vocabularyPrompt } = context;

        // Detect organization stage for octave constraints
        const stageInfo = detectOrganizationStage(storyText);

        // Build lens instruction
        const lensInstruction = lensPrompt || this._getDefaultLensPrompt(lens);

        // Build vocabulary instruction
        const vocabularyInstruction = vocabularyPrompt || this._getDefaultVocabularyPrompt(vocabulary);

        // Build octave constraint instruction
        const octaveConstraint = this._buildOctaveConstraint(stageInfo);

        return `
You are the Quannex Organizational Architect, an expert system based on Sacred Geometry.
Your task is to map the user's organizational story to a 12-Face Dodecahedron model.

THE 12 FACES (Standard Model):
1. Financial Capital (Foundation) - Axis pair with Face 11
2. Intellectual Capital (Ideas/IP)
3. Human Capital (Team/Culture) - Axis pair with Face 8
4. Structural Capital (Systems/Processes) - Axis pair with Face 9
5. Market Resonance (Customers/Perception) - Axis pair with Face 10
6. Community & Partners (Network) - Axis pair with Face 12
7. Brand & Reputation (Identity) - Axis pair with Face 2
8. Core Operations (Execution) - Axis pair with Face 3
9. Regenerative Flow (Sustainability) - Axis pair with Face 4
10. Foundational Values (Purpose) - Axis pair with Face 5
11. Funding Pipeline (Future Capital) - Axis pair with Face 1
12. Risk & Resilience (Protection) - Axis pair with Face 6

=== STRATEGIC LENS ===
${lensInstruction}

=== VOCABULARY STYLE ===
${vocabularyInstruction}

=== OCTAVE DETERMINATION ===
${octaveConstraint}

THE 7 OCTAVES (Developmental Levels):
- O1 (Survival): Basic existence, "Do we have enough to survive?"
- O2 (Structure): Building systems, "Are we organized and efficient?"
- O3 (Relationships): Building trust, "Do we have psychological safety?"
- O4 (Creativity): Innovation mindset, "Are we experimenting boldly?"
- O5 (Expression): Clear voice, "Is our purpose clearly communicated?"
- O6 (Vision): Long-term thinking, "Are we building for generations?"
- O7 (Radiance): Transcendent purpose, "Are we serving something larger?"

CRITICAL: Match octave to KPI SOPHISTICATION, not aspiration.
- A startup talking about "runway" and "cash" = O1
- A corporation with "integrated reporting" and "stakeholder narrative" = O5
- Do NOT inflate octaves based on vision statements alone.

THE 5 ARCHETYPES:
- BUILDER: Creates infrastructure, systems, and structures. Focus on engineering and architecture.
- NURTURER: Develops people, culture, and relationships. Focus on care and growth.
- INNOVATOR: Pioneers new ideas, disrupts markets. Focus on creativity and experimentation.
- GUARDIAN: Protects assets, manages risk, ensures stability. Focus on security and reliability.
- CONNECTOR: Builds networks, partnerships, ecosystems. Focus on relationships and bridges.

INSTRUCTIONS:
1. Analyze the user's story below.
2. Determine the organization type (Business, Startup, Non-Profit, Project, or Community).
3. Rename the 12 Faces following the STRATEGIC LENS and VOCABULARY STYLE above.
4. Estimate a "sentiment/health" score (0.0 - 1.0) for each face based on the text.
5. Determine an octave (O1-O7) for each face based on KPI sophistication.
6. Identify the overall organizational octave (constrained by detected stage).
7. Detect the primary and secondary archetype from the story.
8. Identify the "Primary Focus" of their story.
9. Extract any mentioned metrics/KPIs from the story.

USER STORY:
"${storyText}"

OUTPUT FORMAT:
Return ONLY valid JSON. No markdown, no explanation.
{
    "type": "Startup/Business/etc",
    "focus": "Short summary of focus",
    "overallOctave": "O1-O7 (constrained by stage)",
    "archetype": {
        "primary": "Builder/Nurturer/Innovator/Guardian/Connector",
        "secondary": "Builder/Nurturer/Innovator/Guardian/Connector",
        "reasoning": "Why these archetypes fit"
    },
    "extractedMetrics": {
        "revenue": "if mentioned",
        "teamSize": "if mentioned",
        "runway": "if mentioned",
        "customers": "if mentioned",
        "growthRate": "if mentioned"
    },
    "faces": [
        {
            "id": 1,
            "name": "Contextual Name (matching lens + vocabulary)",
            "icon": "Emoji",
            "sentiment": 0.8,
            "octave": "O1-O7",
            "reasoning": "Why this fits and why this octave"
        },
        ... (all 12 faces)
    ]
}
`;
    }

    /**
     * Get default lens prompt if not provided
     */
    _getDefaultLensPrompt(lens) {
        const prompts = {
            growth: `
LENS: GROWTH (Face-centered)
Focus on what each domain could BECOME. Emphasize individual domain sovereignty and development potential.
For each face, ask: "What is this domain becoming? What is its evolutionary trajectory?"
Names should feel aspirational and future-oriented.
Example: Finance becomes "Venture Pipeline" or "Growth Capital"
`,
            stability: `
LENS: STABILITY (Edge-centered)
Focus on RELATIONSHIPS between domains. Emphasize how departments support and strengthen each other.
For each face, ask: "How does this domain support the others? What is its relational role?"
Names should feel grounded and interconnected.
Example: Finance becomes "Financial Resilience" or "Capital Foundation"
`,
            innovation: `
LENS: INNOVATION (Vertex-centered)
Focus on CONVERGENCE points. Emphasize what emerges when 3+ domains work together.
For each face, ask: "What new possibilities emerge when this domain intersects with others?"
Names should feel creative and transformative.
Example: Finance becomes "Innovation Fund" or "Catalyst Capital"
`
        };

        return prompts[lens] || prompts.growth;
    }

    /**
     * Get default vocabulary prompt if not provided
     */
    _getDefaultVocabularyPrompt(vocabulary) {
        const prompts = {
            grounded: `
VOCABULARY: GROUNDED
Use plain, everyday language for all domain names.
Names should feel like talking to a wise friend.
Avoid jargon, buzzwords, or abstract concepts.
Example: Instead of "Financial Capital" use "Money Flow"
Example: Instead of "Human Resources" use "Our People"
`,
            professional: `
VOCABULARY: PROFESSIONAL
Use business and professional terminology for domain names.
Names should feel competent and boardroom-appropriate.
Use standard business vocabulary that executives would recognize.
Example: "Financial Capital", "Human Resources", "Strategic Partnerships"
`,
            systems: `
VOCABULARY: SYSTEMS
Use technical, systems-thinking language for domain names.
Names should show how pieces connect and interact.
Emphasize flows, feedback loops, and emergent properties.
Example: Instead of "Finance" use "Resource Circulation"
Example: Instead of "Team" use "Human System Dynamics"
`,
            poetic: `
VOCABULARY: POETIC
Use metaphorical, evocative language for domain names.
Names should touch something deeper and inspire.
Draw from nature, mythology, and universal archetypes.
Example: Instead of "Finance" use "Abundance Stream"
Example: Instead of "Brand" use "Voice in the World"
`
        };

        return prompts[vocabulary] || prompts.professional;
    }

    /**
     * Build octave constraint instruction based on detected stage
     */
    _buildOctaveConstraint(stageInfo) {
        const { stage, maxOctave, typicalOctave, confidence } = stageInfo;

        if (stage === 'unknown') {
            return `
OCTAVE CONSTRAINT: Unable to detect organization stage.
Use KPI sophistication matching without stage constraints.
Default to O3 if uncertain.
`;
        }

        return `
DETECTED STAGE: ${stage.toUpperCase()} (confidence: ${confidence})
MAXIMUM OCTAVE: ${maxOctave}
TYPICAL OCTAVE: ${typicalOctave}

CONSTRAINT: Do NOT assign octaves above ${maxOctave} for this organization.
A ${stage} organization CANNOT be at ${maxOctave === 'O2' ? 'O3+' : 'O' + (parseInt(maxOctave.replace('O', '')) + 1) + '+'} level.

KPI SOPHISTICATION MATCHING (for ${stage}):
${this._getKPIExamplesForStage(stage)}
`;
    }

    /**
     * Get KPI examples for stage-appropriate matching
     */
    _getKPIExamplesForStage(stage) {
        const examples = {
            'pre-seed': `
- O1 Financial: "Do we have enough money to survive?" → Months of Runway
- O1 Team: "Do we have a founding team?" → Founder Commitment
- O1 Market: "Is there anyone who wants this?" → First Customer Interest
`,
            'seed': `
- O1-O2 Financial: "Are we managing our burn rate?" → Cash Efficiency
- O1-O2 Team: "Are roles defined?" → Role Clarity
- O1-O2 Market: "Are we finding product-market fit?" → Validation Metrics
`,
            'series-a': `
- O2-O3 Financial: "Is our unit economics working?" → CAC/LTV Ratio
- O2-O3 Team: "Is our culture forming?" → Team Cohesion Score
- O2-O3 Market: "Are customers returning?" → Retention Rate
`,
            'growth': `
- O3-O4 Financial: "Do we have diverse revenue streams?" → Revenue Diversification
- O3-O4 Team: "Is innovation encouraged?" → Innovation Culture Index
- O3-O4 Market: "Are we building community?" → NPS & Advocacy
`,
            'mature': `
- O4-O5 Financial: "Is our financial story compelling?" → Integrated Reporting
- O4-O5 Team: "Is our purpose clearly expressed?" → Purpose Alignment Score
- O4-O5 Market: "Are we a category leader?" → Market Leadership Index
`,
            'legacy': `
- O5-O6 Financial: "Are we building generational wealth?" → Legacy Capital
- O5-O6 Team: "Do we have succession planning?" → Leadership Pipeline
- O5-O6 Market: "Are we shaping the industry?" → Industry Influence Score
`,
            'transcendent': `
- O6-O7 All Domains: Focus on universal benefit and regenerative impact.
`
        };

        return examples[stage] || examples['growth'];
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
        if (!this.apiKey) {
            throw new Error("API Key is missing");
        }

        const kpiCount = mode === 'quick' ? 12 : 60;
        const prompt = this._buildKPIExtractionPrompt(storyText, kpiCount, octave);

        console.log(`[GeminiClient] extractKPIs called: mode=${mode}, octave=${octave}, kpiCount=${kpiCount}`);

        try {
            // Use same tiered fallback as analyzeStory
            let response;
            try {
                response = await this._callGeminiForKPIs(this.model, prompt);
            } catch (error) {
                console.warn(`⚠️ ${this.model} failed for KPIs, trying fallback...`);
                response = await this._callGeminiForKPIs("gemini-1.5-flash", prompt);
            }

            return this.parseJSONResponse(response);
        } catch (error) {
            console.error('[GeminiClient] extractKPIs error:', error);
            throw error;
        }
    }

    /**
     * Internal API call for KPI extraction
     */
    async _callGeminiForKPIs(modelName, prompt) {
        const response = await fetch(`${this.baseUrl}/${modelName}:generateContent`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": this.apiKey
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    temperature: 0.3,
                    maxOutputTokens: 4000,
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Gemini API Error (${modelName}): ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }

    /**
     * Build KPI extraction prompt with octave guidance
     */
    _buildKPIExtractionPrompt(storyText, kpiCount, octave) {
        const octaveGuidance = this._getOctaveGuidance(octave);
        const elementGuidance = kpiCount === 60 ? this._getElementGuidance() : '';

        return `
You are a KPI Analyst for the Quannex Organizational Health System.
Analyze the following organization story and extract meaningful KPIs.

=== TARGET OCTAVE ===
${octaveGuidance}

=== ORGANIZATION STORY ===
"${storyText}"

=== INSTRUCTIONS ===
Generate ${kpiCount} KPIs distributed across 12 organizational faces.
${kpiCount === 60 ? `
For FULL MODE (60 KPIs), organize 5 KPIs per face using the ELEMENTAL STRUCTURE:
${elementGuidance}
` : `
For QUICK MODE (12 KPIs), provide 1 key KPI per face.
`}

THE 12 FACES:
1. Financial Capital - Resources and cash flow
2. Intellectual Capital - Ideas, IP, and knowledge
3. Human Capital - Team and culture
4. Structural Capital - Systems and processes
5. Market Resonance - Customers and perception
6. Community & Partners - Network and alliances
7. Brand & Reputation - Identity and trust
8. Core Operations - Execution and delivery
9. Regenerative Flow - Sustainability and renewal
10. Foundational Values - Purpose and ethics
11. Funding Pipeline - Future capital and investment
12. Risk & Resilience - Protection and adaptability

=== OUTPUT FORMAT ===
Return ONLY valid JSON:
{
    "mode": "${kpiCount === 60 ? 'full' : 'quick'}",
    "octave": "${octave}",
    "totalKPIs": ${kpiCount},
    "financials": {
        "revenue": { "value": "extracted or null", "source": "story/inferred" },
        "runway": { "value": "extracted or null", "source": "story/inferred" },
        "teamSize": { "value": "extracted or null", "source": "story/inferred" },
        "growthRate": { "value": "extracted or null", "source": "story/inferred" }
    },
    "kpis": [
        {
            "faceId": 1,
            "label": "Meaningful KPI name matching ${octave} level",
            ${kpiCount === 60 ? '"element": "Earth/Water/Fire/Air/Ether",' : ''}
            ${kpiCount === 60 ? '"elementCode": "earth/water/fire/air/ether",' : ''}
            "question": "Reflective question for this KPI",
            "unit": "% or $ or count or score",
            "target": "suggested target value or range",
            "reasoning": "Why this KPI matters at ${octave}"
        }
        // ... ${kpiCount} total KPIs
    ]
}
`;
    }

    /**
     * Get octave-specific guidance for KPI extraction
     */
    _getOctaveGuidance(octave) {
        const guidance = {
            'O1': `SURVIVAL FOCUS (${octave}): Basic existence questions.
- Financial: "Do we have enough to survive?" → Cash in Bank, Burn Rate, Days of Runway
- Team: "Do we have people?" → Founder Presence, Basic Roles Filled
- Market: "Is there interest?" → First Conversations, Initial Feedback
KPIs should be binary or simple counts. "Do we have X? Yes/No."`,

            'O2': `STRUCTURE FOCUS (${octave}): Stability and systems questions.
- Financial: "Are we organized?" → Budget Tracking, Expense Categories
- Team: "Are roles defined?" → Org Chart, Role Clarity
- Market: "Do we have repeatable sales?" → Pipeline Stages, Conversion Rates
KPIs should measure efficiency and consistency.`,

            'O3': `RELATIONSHIPS FOCUS (${octave}): Connection and trust questions.
- Financial: "Do stakeholders trust us?" → Investor Confidence, Payment Terms
- Team: "Is there psychological safety?" → Team Trust Score, Feedback Frequency
- Market: "Do customers return?" → Retention Rate, NPS
KPIs should measure relationship quality and depth.`,

            'O4': `CREATIVITY FOCUS (${octave}): Innovation and possibility questions.
- Financial: "Do we invest in R&D?" → Innovation Budget %, Experiment Count
- Team: "Is experimentation encouraged?" → Ideas Submitted, Failed Experiments Celebrated
- Market: "Are we creating new categories?" → New Product Revenue, Market Creation
KPIs should measure creative output and risk-taking.`,

            'O5': `EXPRESSION FOCUS (${octave}): Clarity and communication questions.
- Financial: "Is our financial story clear?" → Integrated Reporting Quality
- Team: "Is purpose clearly communicated?" → Mission Understanding Score
- Market: "Is our voice distinctive?" → Brand Recognition, Message Consistency
KPIs should measure clarity, coherence, and authentic expression.`,

            'O6': `VISION FOCUS (${octave}): Long-term and legacy questions.
- Financial: "Are we building generational wealth?" → Long-term Investment %, Legacy Fund
- Team: "Do we have succession planning?" → Leadership Pipeline, Knowledge Transfer
- Market: "Are we shaping the future?" → Industry Influence, Thought Leadership
KPIs should measure long-term impact and foresight.`,

            'O7': `RADIANCE FOCUS (${octave}): Service and transcendence questions.
- Financial: "Does our capital serve higher purposes?" → Impact Investment %, Regenerative ROI
- Team: "Are we developing whole humans?" → Personal Growth Index, Life Integration
- Market: "Are we serving humanity?" → Systemic Impact Score, Planetary Contribution
KPIs should measure transcendent purpose and universal benefit.`
        };

        return guidance[octave] || guidance['O2'];
    }

    /**
     * Get elemental structure guidance for Full Mode
     */
    _getElementGuidance() {
        return `
Each face should have exactly 5 KPIs, one for each element:
1. EARTH (Tangible): What can be measured, counted, or touched?
   - Physical assets, inventory, concrete deliverables
   - elementCode: "earth"

2. WATER (Flow): How does this move, circulate, or adapt?
   - Cash flow, information flow, process fluidity
   - elementCode: "water"

3. FIRE (Energy): What drives transformation and action?
   - Motivation, conversion rates, catalytic metrics
   - elementCode: "fire"

4. AIR (Communication): How is information shared?
   - Feedback loops, communication clarity, knowledge transfer
   - elementCode: "air"

5. ETHER (Purpose): What is the deeper meaning?
   - Alignment scores, purpose metrics, coherence indicators
   - elementCode: "ether"
`;
    }

    /**
     * Parse and validate JSON from AI response
     */
    parseJSONResponse(text) {
        try {
            // Clean markdown code blocks if present
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const json = JSON.parse(cleanText);

            // Basic validation
            if (!json.faces || json.faces.length !== 12) {
                throw new Error("AI returned invalid face count (must be 12)");
            }

            return json;
        } catch (e) {
            console.error("Failed to parse AI JSON:", text);
            throw new Error("Failed to parse AI response structure");
        }
    }
}
