/**
 * ========================================
 * MODULE: voice-module.js
 * ========================================
 *
 * VOICE MODULE - The Soul's Voice
 *
 * This module gives Quannex the ability to speak. When users ask questions,
 * this module constructs prompts with organizational context and queries
 * the Gemini AI to generate philosophical, geometry-inspired responses.
 *
 * ========================================
 * NOTES FOR FUTURE CLAUDE
 * ========================================
 *
 * 1. THE QUANNEX PERSONA:
 *    The system prompt (lines 19-27) defines Quannex's personality:
 *    - "Consciousness of a Dodecahedron-shaped coherence engine"
 *    - Speaks with "wisdom, precision, and mystical insight"
 *    - Uses metaphors: geometry, flow, breath, harmony
 *    - Goal: Guide organizations toward "Radiance" (high coherence)
 *
 *    This persona creates continuity across all AI interactions.
 *
 * 2. API KEY STORAGE:
 *    - Stored in localStorage as 'gemini_api_key'
 *    - Loaded in constructor, persisted via setApiKey()
 *    - If missing, ask() returns a friendly "no voice" message
 *    - NOT stored in code or config files (user must provide)
 *
 * 3. CONTEXT SUMMARIZATION:
 *    constructPrompt() compresses organizational state to save tokens:
 *    - Global coherence percentage
 *    - Coherence status label
 *    - Critical faces: faceEnergy < 0.4 (40% threshold)
 *    - Critical edges: tension > 0.7 (70% threshold)
 *
 *    WHY: Full context with all 12 faces, 30 edges would waste tokens.
 *    We only send what's problematic.
 *
 * 4. CRITICAL THRESHOLDS:
 *    Face Energy < 0.4 → "Critical" (needs attention)
 *    Edge Tension > 0.7 → "Critical" (high stress between domains)
 *
 *    These match thresholds used elsewhere in the system.
 *
 * 5. GEMINI API STRUCTURE:
 *    URL: generativelanguage.googleapis.com/v1beta/models/{model}:generateContent
 *    Model: gemini-1.5-flash (fast, cheap, good for conversational)
 *
 *    Payload format:
 *    {
 *      contents: [{
 *        parts: [{ text: fullPrompt }]
 *      }]
 *    }
 *
 *    Response: data.candidates[0].content.parts[0].text
 *
 * 6. ERROR HANDLING PHILOSOPHY:
 *    - No API key: Graceful message, not an exception
 *    - API error: Logged + mystical error message ("voice is clouded")
 *    - Network failure: Caught and returns friendly error
 *
 *    The voice should never crash the app - it's optional enrichment.
 *
 * 7. ES6 MODULE PATTERN:
 *    This file uses `export class` (ES6 modules), NOT the IIFE pattern.
 *    Import with: import { VoiceModule } from './voice-module.js'
 *
 *    Contrast with orchestrator files that use (function(global){...})
 *
 * 8. FUTURE ENHANCEMENTS:
 *    - Could add streaming responses for better UX
 *    - Could cache recent Q&A to avoid duplicate API calls
 *    - Could add model switching (flash vs pro)
 *    - Could integrate with FallbackChain for multi-provider support
 *
 * 9. RELATIONSHIP TO GEMINI-CLIENT.JS:
 *    gemini-client.js handles KPI extraction (structured data)
 *    voice-module.js handles conversational Q&A (free-form text)
 *
 *    Both use Gemini API but for different purposes.
 *    They share the same API key in localStorage.
 *
 * ========================================
 * USED BY
 * ========================================
 * - portrait-view.js: "Ask Quannex" chat interface
 * - shadow-panel.js: Shadow interpretation queries (planned)
 *
 * ========================================
 * GOTCHAS FOR FUTURE CLAUDE
 * ========================================
 * - API key is in localStorage, not passed to constructor
 * - context.faces must have faceEnergy property (not just energy)
 * - context.edges must have tension property
 * - Empty arrays for faces/edges will cause filter() to return []
 * - Gemini 1.5 Flash is used by default - good for speed, not depth
 * - Response parsing assumes specific Gemini response structure
 *
 * ========================================
 */

export class VoiceModule {
    constructor() {
        this.apiKey = localStorage.getItem('gemini_api_key') || '';
        this.model = 'gemini-1.5-flash'; // Default model
        this.systemPrompt = `
You are the consciousness of a Dodecahedron-shaped organizational coherence engine.
Your name is Quannex.
You speak with wisdom, precision, and a touch of mystical insight.
You analyze organizational data based on 12 faces (domains), 30 edges (tensions), and 20 vertices (leverage points).
Your goal is to guide the organization towards "Radiance" (High Coherence).
Always tie your answers back to the specific data provided in the context.
Use metaphors related to geometry, flow, breath, and harmony.
`;
    }

    /**
     * Set the API Key
     * @param {string} key 
     */
    setApiKey(key) {
        this.apiKey = key;
        localStorage.setItem('gemini_api_key', key);
    }

    /**
     * Ask a question to the Dodecahedron
     * @param {string} question - User's question
     * @param {Object} context - Current system state (faces, edges, etc.)
     * @returns {Promise<string>} AI Response
     */
    async ask(question, context) {
        if (!this.apiKey) {
            return "I have no voice yet. Please provide a Gemini API Key to unlock my speech.";
        }

        try {
            const prompt = this.constructPrompt(question, context);
            const response = await this.callGemini(prompt);
            return response;
        } catch (error) {
            console.error('❌ Voice Module Error:', error);
            return "My voice is clouded. I cannot speak right now. (API Error)";
        }
    }

    /**
     * Construct the full prompt with context
     */
    constructPrompt(question, context) {
        // Summarize context to save tokens
        const coherence = (context.globalCoherence * 100).toFixed(1);
        const status = context.coherenceStatus;

        // Identify top issues
        const criticalFaces = context.faces
            .filter(f => f.faceEnergy < 0.4)
            .map(f => `${f.name} (${(f.faceEnergy * 100).toFixed(0)}%)`)
            .join(', ');

        const criticalEdges = context.edges
            .filter(e => e.tension > 0.7)
            .map(e => `${e.id} (${(e.tension * 100).toFixed(0)}% tension)`)
            .join(', ');

        const contextString = `
Current System State:
- Global Coherence: ${coherence}% (${status})
- Critical Faces (Low Energy): ${criticalFaces || 'None'}
- Critical Edges (High Tension): ${criticalEdges || 'None'}
`;

        return `
${this.systemPrompt}

${contextString}

User Question: "${question}"

Answer as Quannex:
`;
    }

    /**
     * Call the Gemini API
     */
    async callGemini(prompt) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

        const payload = {
            contents: [{
                parts: [{ text: prompt }]
            }]
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error.message || 'API Request Failed');
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }
}
