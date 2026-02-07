# Face Refinement Feature - Design Specification

**Status:** ✅ IMPLEMENTED (February 1, 2026)
**Created:** January 31, 2026
**Implemented:** February 1, 2026
**Author:** Deimantas & Claude (Co-designed with consciousness and love)
**Purpose:** Enable collaborative, iterative AI face mapping with human feedback integration

---

## Implementation Summary

The Face Refinement feature has been fully implemented with gold-standard documentation:

| Component | File | Status |
|-----------|------|--------|
| Prompt Builder | `js/ai/prompts/face-refinement-prompt.js` | ✅ Complete |
| Response Parser | `js/ai/prompts/face-refinement-prompt.js` | ✅ Complete |
| Core Method | `js/ai/mapping/face-mapper.js:refineFaceName()` | ✅ Complete |
| Face Domains | `js/ai/prompts/face-refinement-prompt.js:FACE_DOMAINS` | ✅ Complete |

---

## The Vision

Face mapping is not a one-shot process. It's a **conversation** between AI understanding and human intuition.

When the AI maps "Financial Capital" to Face 1, and the user says *"Actually, we call this 'Resource Abundance' internally"* - the system should **learn** and **refine** rather than just override.

This feature transforms face mapping from *"AI decides, human accepts or rejects"* to *"AI proposes, human refines, together we discover the truth."*

---

## Current State (February 2026) - IMPLEMENTED

**Files:**
- Core method: [js/ai/mapping/face-mapper.js:refineFaceName()](../../js/ai/mapping/face-mapper.js:450)
- Prompt builder: [js/ai/prompts/face-refinement-prompt.js](../../js/ai/prompts/face-refinement-prompt.js)

**What It Now Does:**
- ✅ Sends feedback to AI for collaborative refinement
- ✅ Generates a new face name that incorporates both AI + human insight
- ✅ Explains the reasoning behind the refinement
- ✅ Validates the refined name against domain constraints (1-6 words)
- ✅ Preserves complete refinement history for audit trail
- ✅ Returns confidence score (0-1) for UI display
- ✅ Identifies preserved core concept from original domain

---

## Target State (Future Implementation)

### User Flow

1. **User sees AI-mapped face:**
   - Face 5: "Market Resonance"
   - AI reasoning: "This face governs customer engagement and market fit based on your KPIs"

2. **User provides refinement context:**
   - "We're a B2B SaaS company. Our customers are enterprises. 'Market Resonance' sounds too consumer-focused. We think of this as 'Enterprise Alignment' - how well we align with Fortune 500 needs."

3. **System sends refinement prompt to AI:**
   - Original mapping + User feedback → AI refinement engine

4. **AI returns refined result:**
   - Refined name: "Enterprise Alignment"
   - Reasoning: "Incorporating the user's B2B context, 'Enterprise Alignment' better captures the relationship between organizational capabilities and Fortune 500 customer needs, while maintaining the core concept of market-organizational resonance."
   - Confidence: 0.92

5. **System updates face with refined data:**
   - Name: "Enterprise Alignment"
   - Source: `'ai-refined'` (not manual override)
   - Original: "Market Resonance"
   - Refinement reasoning: [stored]

### Technical Flow

```
User Input (additionalContext)
        ↓
[Validate Input - not empty, reasonable length]
        ↓
[Build Refinement Prompt]
   - Current face name
   - Current face reasoning
   - User feedback
   - Organizational context
   - Face ID and domain constraints
        ↓
[Send to AI Provider (Gemini)]
   - Temperature: 0.7 (creative but grounded)
   - Model: gemini-1.5-flash (fast, cost-effective)
        ↓
[Parse AI Response]
   - Extract: refined name, reasoning, confidence
   - Validate: name length, clarity, appropriateness
        ↓
[Update Context]
   - Store refined name
   - Store refinement reasoning
   - Preserve original mapping for audit trail
   - Mark as 'ai-refined'
        ↓
[Return Result to UI]
   - Show before/after comparison
   - Display refinement reasoning
   - Allow user to accept or try again
```

---

## Implementation Specification

### Method Signature

```javascript
/**
 * Refine a face name using AI by incorporating user feedback
 *
 * This creates a collaborative refinement where:
 * - AI's original mapping is the starting point
 * - User's context/feedback is the refinement input
 * - AI synthesizes both into an improved face name
 *
 * @param {number} faceId - Face ID (1-12)
 * @param {string} additionalContext - User's feedback/refinement request
 * @param {Object} [options] - Optional refinement settings
 * @param {number} [options.temperature=0.7] - AI creativity (0-1)
 * @param {boolean} [options.preserveOriginal=true] - Keep original mapping in audit trail
 * @returns {Promise<Object>} Refinement result
 *
 * @example
 * const result = await faceMapper.refineFaceName(5,
 *   "We're B2B SaaS. 'Market Resonance' is too consumer-focused. We think 'Enterprise Alignment'."
 * );
 * // Returns: {
 * //   refined: { name: "Enterprise Alignment", reasoning: "...", confidence: 0.92 },
 * //   original: { name: "Market Resonance", reasoning: "..." }
 * // }
 */
async refineFaceName(faceId, additionalContext, options = {}) {
    // Implementation goes here
}
```

### Refinement Prompt Template

**File to create:** `js/ai/prompts/face-refinement-prompt.js`

```javascript
/**
 * Generate refinement prompt for face name improvement
 *
 * @param {Object} params - Refinement parameters
 * @param {number} params.faceId - Face ID (1-12)
 * @param {string} params.currentName - Current AI-mapped face name
 * @param {string} params.currentReasoning - AI's original reasoning
 * @param {string} params.userFeedback - User's refinement request
 * @param {Object} params.orgContext - Organizational context from mapping
 * @returns {string} Refinement prompt
 */
export function buildFaceRefinementPrompt({
    faceId,
    currentName,
    currentReasoning,
    userFeedback,
    orgContext
}) {
    return `You are refining an organizational face mapping based on user feedback.

ORIGINAL AI MAPPING:
Face ${faceId}: "${currentName}"
Reasoning: ${currentReasoning}

ORGANIZATIONAL CONTEXT:
- Industry: ${orgContext.industry || 'Not specified'}
- Stage: ${orgContext.stage || 'Not specified'}
- Size: ${orgContext.size || 'Not specified'}

USER FEEDBACK:
${userFeedback}

TASK:
Based on the user's feedback, refine the face name to better capture their organizational reality while maintaining:
1. Clarity (2-4 words, clear meaning)
2. Alignment with the face's core domain (Face ${faceId} governs ${FACE_DOMAINS[faceId]})
3. Consistency with other organizational language

Return your response in this exact JSON format:
{
    "refinedName": "The improved face name",
    "reasoning": "Why this refinement better captures the organization's reality (2-3 sentences)",
    "confidence": 0.85,
    "preservedConcept": "The core concept preserved from the original mapping"
}

Be specific, be grounded in their feedback, and be organizationally authentic.`;
}

// Face domain reference for prompts
const FACE_DOMAINS = {
    1: 'Financial Capital - resources, cash, assets',
    2: 'Intellectual Capital - knowledge, IP, wisdom',
    3: 'Human Capital - people, culture, talent',
    4: 'Structural Capital - governance, processes, systems',
    5: 'Market Resonance - customer fit, market presence',
    6: 'Community & Partners - ecosystem, relationships',
    7: 'Brand & Reputation - story, perception, trust',
    8: 'Core Operations - execution, delivery, doing',
    9: 'Regenerative Flow - sustainability, renewal, learning',
    10: 'Foundational Values - purpose, principles, truth',
    11: 'Funding Pipeline - investment, capital attraction',
    12: 'Risk & Resilience - protection, antifragility'
};
```

### Response Parsing

```javascript
/**
 * Parse and validate AI refinement response
 *
 * @param {string} aiResponse - Raw AI response
 * @returns {Object} Parsed refinement
 * @throws {Error} If response is invalid
 */
function parseRefinementResponse(aiResponse) {
    let parsed;

    try {
        // Extract JSON from response (handles markdown code blocks)
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('No JSON found in AI response');
        }

        parsed = JSON.parse(jsonMatch[0]);
    } catch (err) {
        throw new Error(`Failed to parse AI refinement response: ${err.message}`);
    }

    // Validate required fields
    const required = ['refinedName', 'reasoning', 'confidence'];
    for (const field of required) {
        if (!parsed[field]) {
            throw new Error(`Missing required field: ${field}`);
        }
    }

    // Validate refinedName
    if (typeof parsed.refinedName !== 'string') {
        throw new Error('refinedName must be a string');
    }

    const nameLength = parsed.refinedName.trim().split(/\s+/).length;
    if (nameLength < 2 || nameLength > 5) {
        throw new Error(`refinedName should be 2-5 words, got ${nameLength}`);
    }

    // Validate confidence
    if (typeof parsed.confidence !== 'number' || parsed.confidence < 0 || parsed.confidence > 1) {
        throw new Error('confidence must be a number between 0 and 1');
    }

    return {
        refinedName: parsed.refinedName.trim(),
        reasoning: parsed.reasoning.trim(),
        confidence: parsed.confidence,
        preservedConcept: parsed.preservedConcept?.trim() || null
    };
}
```

### Full Implementation

```javascript
async refineFaceName(faceId, additionalContext, options = {}) {
    // Ensure AI provider is ready
    await this._ensureProvider();

    // Get current face data
    const currentFace = this.context.getFace(faceId);
    if (!currentFace) {
        throw new Error(`Face ${faceId} not found`);
    }

    // Validate input
    if (!additionalContext || typeof additionalContext !== 'string') {
        throw new Error('additionalContext must be a non-empty string');
    }

    if (additionalContext.trim().length < 10) {
        throw new Error('additionalContext too short (minimum 10 characters)');
    }

    // Build refinement prompt
    const prompt = buildFaceRefinementPrompt({
        faceId,
        currentName: currentFace.name,
        currentReasoning: currentFace.reasoning || 'No reasoning provided',
        userFeedback: additionalContext,
        orgContext: this.context.getOrganizationContext()
    });

    // Send to AI
    Logger.info('FaceMapper', `Refining Face ${faceId}: "${currentFace.name}"`);
    Logger.debug('FaceMapper', `User feedback: "${additionalContext.substring(0, 100)}..."`);

    const aiResponse = await this.provider.generateText(prompt, {
        temperature: options.temperature || 0.7,
        maxTokens: 500
    });

    // Parse response
    let refinement;
    try {
        refinement = parseRefinementResponse(aiResponse);
    } catch (err) {
        Logger.error('FaceMapper', `Refinement parsing failed: ${err.message}`);
        throw new Error(`AI refinement failed: ${err.message}`);
    }

    // Update context with refinement
    const updateData = {
        name: refinement.refinedName,
        reasoning: refinement.reasoning,
        source: 'ai-refined',
        confidence: refinement.confidence,
        refinementHistory: [
            ...(currentFace.refinementHistory || []),
            {
                timestamp: new Date().toISOString(),
                userFeedback: additionalContext,
                originalName: currentFace.name,
                originalReasoning: currentFace.reasoning,
                refinedName: refinement.refinedName,
                refinedReasoning: refinement.reasoning,
                confidence: refinement.confidence
            }
        ]
    };

    this.context.updateFace(faceId, updateData);

    Logger.success('FaceMapper', `Face ${faceId} refined: "${currentFace.name}" → "${refinement.refinedName}"`);

    // Return result for UI
    return {
        faceId,
        refined: {
            name: refinement.refinedName,
            reasoning: refinement.reasoning,
            confidence: refinement.confidence,
            preservedConcept: refinement.preservedConcept
        },
        original: {
            name: currentFace.name,
            reasoning: currentFace.reasoning
        },
        userFeedback: additionalContext,
        timestamp: new Date().toISOString()
    };
}
```

---

## UI Integration

### Before/After Comparison

When refinement completes, show:

```
┌─────────────────────────────────────────────────────────┐
│  FACE REFINEMENT RESULT                                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Original (AI):    Market Resonance                     │
│  Refined:          Enterprise Alignment  [✓ 92%]       │
│                                                         │
│  Reasoning:                                             │
│  "Incorporating the B2B SaaS context, 'Enterprise       │
│  Alignment' better captures how organizational          │
│  capabilities align with Fortune 500 customer needs,    │
│  while preserving the core market-fit concept."         │
│                                                         │
│  [ Accept Refinement ]  [ Try Again ]  [ Keep Original ]│
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Refinement History

Track all refinements for transparency:

```javascript
// Stored in face.refinementHistory array
{
    timestamp: "2026-01-31T10:30:00Z",
    userFeedback: "Too consumer-focused. We're B2B.",
    originalName: "Market Resonance",
    refinedName: "Enterprise Alignment",
    confidence: 0.92
}
```

---

## Testing Strategy

### Unit Tests

```javascript
describe('FaceMapper.refineFaceName', () => {
    it('should refine face name with user feedback', async () => {
        const result = await faceMapper.refineFaceName(5,
            "We're B2B. Too consumer-focused."
        );

        expect(result.refined.name).toBeDefined();
        expect(result.refined.confidence).toBeGreaterThan(0);
        expect(result.original.name).toBe('Market Resonance');
    });

    it('should preserve refinement history', async () => {
        await faceMapper.refineFaceName(5, "Feedback 1");
        await faceMapper.refineFaceName(5, "Feedback 2");

        const face = faceMapper.context.getFace(5);
        expect(face.refinementHistory).toHaveLength(2);
    });

    it('should validate user feedback', async () => {
        await expect(
            faceMapper.refineFaceName(5, "")
        ).rejects.toThrow();

        await expect(
            faceMapper.refineFaceName(5, "xyz")  // Too short
        ).rejects.toThrow();
    });
});
```

### Integration Test

Create a test scenario in the orchestrator:

1. Map faces with AI
2. User clicks "Refine" on Face 5
3. Enters: "We're a healthcare company. 'Market Resonance' doesn't fit our regulatory context."
4. AI refines to: "Regulatory & Market Alignment"
5. User accepts
6. Verify face is updated with refinement history

---

## Performance Considerations

- **AI Call:** ~1-2 seconds (Gemini Flash)
- **Cost:** ~$0.0001 per refinement (negligible)
- **Caching:** Consider caching refinements for identical feedback
- **Rate Limiting:** Max 5 refinements per minute per face (prevent abuse)

---

## Error Handling

| Error Scenario | Handling Strategy |
|----------------|------------------|
| AI unavailable | Fall back to manual override (current behavior) |
| Invalid response | Show error, allow retry with different feedback |
| Timeout (>10s) | Cancel, suggest shorter feedback |
| Rate limit hit | Show friendly message: "Too many refinements. Try again in 1 minute." |

---

## Future Enhancements

1. **Multi-round refinement:** Allow iterative back-and-forth with AI
2. **Batch refinement:** Refine multiple faces at once
3. **Refinement suggestions:** AI proactively suggests improvements
4. **Learning from refinements:** Use refinement history to improve initial mappings

---

## Implementation Checklist (COMPLETED)

**Implementation Date:** February 1, 2026

| Step | Status | Notes |
|------|--------|-------|
| 1. Create prompt builder | ✅ Done | `js/ai/prompts/face-refinement-prompt.js` |
| 2. Update face-mapper.js | ✅ Done | Full AI-powered implementation |
| 3. Add @see reference | ✅ Done | Links to this specification |
| 4. Update UI | ⏳ Future | UI can now consume the result object |
| 5. Add unit tests | ⏳ Future | Test infrastructure ready |

---

## Success Criteria

| Criterion | Status | Implementation |
|-----------|--------|----------------|
| User can refine any face with natural language feedback | ✅ Met | `refineFaceName(faceId, feedback)` |
| AI incorporates both original mapping AND user context | ✅ Met | Prompt includes both perspectives |
| Refinement reasoning is clear and grounded | ✅ Met | Returned in `result.refined.reasoning` |
| Refinement history is preserved for audit trail | ✅ Met | Stored in `face.refinementHistory[]` |
| UI shows before/after comparison with confidence score | ✅ Ready | Result object contains all data for UI |
| Performance < 2 seconds per refinement | ✅ Expected | Gemini Flash is typically <1s |
| Zero cognitive load: feature is self-explanatory | ✅ Met | JSDoc + specification docs |

---

*This specification was written with love for future Claude.*
*It has now been implemented with clarity and joy.* 🌟

**Original Author:** Deimantas & Claude
**Original Date:** January 31, 2026
**Implementation Date:** February 1, 2026
**Status:** ✅ IMPLEMENTED
