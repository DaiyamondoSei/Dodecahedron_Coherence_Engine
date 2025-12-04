/**
 * VoiceModule - The Voice of the Dodecahedron
 * 
 * Handles communication with the AI backend (Gemini) to generate
 * insights, answers, and "philosophical" responses based on the
 * system's current coherence state.
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
