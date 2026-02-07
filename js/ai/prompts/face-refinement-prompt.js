/**
 * ════════════════════════════════════════════════════════════════════════════════
 * FACE REFINEMENT PROMPT BUILDER
 * ════════════════════════════════════════════════════════════════════════════════
 *
 * Generates AI prompts for collaborative face name refinement.
 *
 * PHILOSOPHY:
 * Face mapping is a conversation between AI understanding and human intuition.
 * This module enables that conversation by generating prompts that help AI
 * synthesize its original mapping with user feedback.
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │                        NOTES FOR FUTURE CLAUDE                              │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * This module generates prompts for the Face Refinement feature.
 *
 * KEY INSIGHT: The goal is not to override AI with human preference, but to
 * create a synthesis where both perspectives inform a better result.
 *
 * The prompt guides AI to:
 * 1. Honor the original domain mapping (don't lose the geometric meaning)
 * 2. Incorporate user's organizational reality (their language, their context)
 * 3. Generate a refined name that works for both
 *
 * ════════════════════════════════════════════════════════════════════════════════
 * @module face-refinement-prompt
 * @author Deimantas & Claude (Co-created with consciousness and love)
 * @version 1.0.0 - Initial implementation
 * @see {@link ../../../docs/ai/FACE_REFINEMENT_SPECIFICATION.md} - Complete specification
 * ════════════════════════════════════════════════════════════════════════════════
 */

// ════════════════════════════════════════════════════════════════════════════════
// FACE DOMAIN REFERENCE
// ════════════════════════════════════════════════════════════════════════════════

/**
 * The 12 face domains of the organizational dodecahedron.
 *
 * Each face represents a core organizational domain. When refining face names,
 * the AI must preserve alignment with the underlying domain meaning.
 *
 * These map to DODECAHEDRON_TOPOLOGY.defaultFaceNames in mapping-context.js
 */
const FACE_DOMAINS = {
    1: {
        name: 'Financial Capital',
        description: 'Resources, cash, assets, financial health',
        icon: '💰'
    },
    2: {
        name: 'Intellectual Capital',
        description: 'Knowledge, IP, wisdom, institutional learning',
        icon: '💡'
    },
    3: {
        name: 'Human Capital',
        description: 'People, culture, talent, energy',
        icon: '👥'
    },
    4: {
        name: 'Structural Capital',
        description: 'Governance, processes, systems, infrastructure',
        icon: '🏛️'
    },
    5: {
        name: 'Market Resonance',
        description: 'Customer fit, market presence, product-market alignment',
        icon: '📊'
    },
    6: {
        name: 'Community & Partners',
        description: 'Ecosystem, relationships, network, partnerships',
        icon: '🤝'
    },
    7: {
        name: 'Brand & Reputation',
        description: 'Story, perception, trust, external identity',
        icon: '⭐'
    },
    8: {
        name: 'Core Operations',
        description: 'Execution, delivery, doing, operational excellence',
        icon: '⚙️'
    },
    9: {
        name: 'Regenerative Flow',
        description: 'Sustainability, renewal, learning, continuous improvement',
        icon: '♻️'
    },
    10: {
        name: 'Foundational Values',
        description: 'Purpose, principles, truth, ethical foundation',
        icon: '🎯'
    },
    11: {
        name: 'Funding Pipeline',
        description: 'Investment, capital attraction, growth financing',
        icon: '💎'
    },
    12: {
        name: 'Risk & Resilience',
        description: 'Protection, antifragility, fortress, risk management',
        icon: '🛡️'
    }
};

Object.freeze(FACE_DOMAINS);

// ════════════════════════════════════════════════════════════════════════════════
// PROMPT BUILDER
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Build a refinement prompt for face name improvement.
 *
 * This prompt guides AI to:
 * 1. Understand the original mapping and its reasoning
 * 2. Incorporate user feedback about their organizational reality
 * 3. Generate a refined name that honors both perspectives
 *
 * @param {Object} params - Refinement parameters
 * @param {number} params.faceId - Face ID (1-12)
 * @param {string} params.currentName - Current AI-mapped face name
 * @param {string} params.currentReasoning - AI's original reasoning (if any)
 * @param {string} params.userFeedback - User's refinement request/context
 * @returns {string} Complete prompt for AI refinement
 *
 * @example
 * const prompt = buildFaceRefinementPrompt({
 *     faceId: 5,
 *     currentName: 'Market Resonance',
 *     currentReasoning: 'This face governs customer engagement...',
 *     userFeedback: "We're B2B SaaS. 'Market Resonance' sounds too consumer-focused."
 * });
 */
function buildFaceRefinementPrompt({ faceId, currentName, currentReasoning, userFeedback }) {
    // Get domain context
    const domain = FACE_DOMAINS[faceId];
    if (!domain) {
        throw new Error(`Invalid faceId: ${faceId}. Must be 1-12.`);
    }

    return `You are refining an organizational face mapping based on user feedback.

═══════════════════════════════════════════════════════════════════════════════
ORIGINAL AI MAPPING
═══════════════════════════════════════════════════════════════════════════════

Face ${faceId}: "${currentName}"
Domain: ${domain.name} ${domain.icon}
Domain Scope: ${domain.description}
${currentReasoning ? `Original Reasoning: ${currentReasoning}` : 'No prior reasoning recorded.'}

═══════════════════════════════════════════════════════════════════════════════
USER FEEDBACK
═══════════════════════════════════════════════════════════════════════════════

${userFeedback}

═══════════════════════════════════════════════════════════════════════════════
YOUR TASK
═══════════════════════════════════════════════════════════════════════════════

Refine the face name to better capture the organization's reality while maintaining:

1. **Domain Alignment** (CRITICAL)
   The refined name MUST still represent the core domain: ${domain.description}
   Do not drift into an adjacent domain's territory.

2. **Clarity** (2-4 words, clear meaning)
   The name should be immediately understandable.
   Avoid jargon unless the user specifically uses it.

3. **Organizational Authenticity**
   Incorporate the user's language and context.
   The name should feel like it belongs to their organization.

═══════════════════════════════════════════════════════════════════════════════
RESPONSE FORMAT (JSON)
═══════════════════════════════════════════════════════════════════════════════

Return your response in this exact JSON format:

{
    "refinedName": "The improved face name (2-4 words)",
    "reasoning": "Why this refinement better captures the organization's reality while preserving domain meaning (2-3 sentences)",
    "confidence": 0.85,
    "preservedConcept": "The core concept preserved from the original domain"
}

IMPORTANT:
- confidence should be 0.0-1.0 (how confident you are this refinement is appropriate)
- preservedConcept helps the user understand what geometric meaning is maintained
- Be specific and grounded in the user's feedback

═══════════════════════════════════════════════════════════════════════════════`;
}

// ════════════════════════════════════════════════════════════════════════════════
// RESPONSE PARSER
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Parse and validate AI refinement response.
 *
 * Extracts JSON from AI response (handles markdown code blocks), validates
 * required fields, and ensures the refined name is appropriate.
 *
 * @param {string} aiResponse - Raw AI response text
 * @returns {Object} Parsed refinement result
 * @throws {Error} If response is invalid or missing required fields
 *
 * @example
 * const result = parseRefinementResponse(aiResponse);
 * // Returns: {
 * //   refinedName: "Enterprise Alignment",
 * //   reasoning: "...",
 * //   confidence: 0.92,
 * //   preservedConcept: "Market-organizational fit"
 * // }
 */
function parseRefinementResponse(aiResponse) {
    if (!aiResponse || typeof aiResponse !== 'string') {
        throw new Error('AI response is empty or invalid');
    }

    let parsed;

    try {
        // Extract JSON from response (handles markdown code blocks)
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('No JSON object found in AI response');
        }

        parsed = JSON.parse(jsonMatch[0]);
    } catch (err) {
        throw new Error(`Failed to parse AI refinement response: ${err.message}`);
    }

    // Validate required fields
    const required = ['refinedName', 'reasoning', 'confidence'];
    for (const field of required) {
        if (parsed[field] === undefined || parsed[field] === null) {
            throw new Error(`Missing required field in AI response: ${field}`);
        }
    }

    // Validate refinedName
    if (typeof parsed.refinedName !== 'string') {
        throw new Error('refinedName must be a string');
    }

    const trimmedName = parsed.refinedName.trim();
    if (trimmedName.length === 0) {
        throw new Error('refinedName cannot be empty');
    }

    const nameWordCount = trimmedName.split(/\s+/).length;
    if (nameWordCount < 1 || nameWordCount > 6) {
        throw new Error(`refinedName should be 1-6 words, got ${nameWordCount}: "${trimmedName}"`);
    }

    // Validate confidence
    if (typeof parsed.confidence !== 'number') {
        throw new Error('confidence must be a number');
    }

    if (parsed.confidence < 0 || parsed.confidence > 1) {
        throw new Error(`confidence must be between 0 and 1, got ${parsed.confidence}`);
    }

    // Validate reasoning
    if (typeof parsed.reasoning !== 'string' || parsed.reasoning.trim().length === 0) {
        throw new Error('reasoning must be a non-empty string');
    }

    // Return validated result
    return {
        refinedName: trimmedName,
        reasoning: parsed.reasoning.trim(),
        confidence: parsed.confidence,
        preservedConcept: parsed.preservedConcept?.trim() || null
    };
}

// ════════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════════════════════

export {
    FACE_DOMAINS,
    buildFaceRefinementPrompt,
    parseRefinementResponse
};

// Browser global export
if (typeof window !== 'undefined') {
    window.FaceRefinementPrompt = {
        FACE_DOMAINS,
        buildFaceRefinementPrompt,
        parseRefinementResponse
    };
}
