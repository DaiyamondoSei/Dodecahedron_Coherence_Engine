/**
 * ============================================================================
 * DYNAMIC EDGE INQUIRY GENERATOR
 * ============================================================================
 *
 * This module generates edge-specific questions dynamically based on:
 * - The organization's custom face names/definitions
 * - The current health state of the edge
 * - The dominant synergy element
 *
 * KEY BREAKTHROUGH: "Observation over prescription"
 * -----------------------------------------------
 * Static questions like "How does capital become knowledge?" assume our
 * archetypes fit their reality. Their "Financial Capital" might be
 * "Abundance Stewardship". Their "Intellectual Capital" might be "Embodied Wisdom".
 *
 * This module generates questions using THEIR language for THEIR truth.
 *
 * FALLBACK HIERARCHY:
 * 1. AI-generated question (uses Gemini via edge-interpreter.js)
 * 2. Template-based question (uses their face names with our patterns)
 * 3. Static fallback (original edge-constants.js questions)
 *
 * @module js/ai/dynamic-edge-inquiry
 * @author Deimantas & Claude (Co-created January 2026)
 * @version 1.0.0
 * ============================================================================
 */

// ============================================================================
// SECTION 1: IMPORTS AND DEPENDENCIES
// ============================================================================

// These will be available at runtime
// - window.SacredInquiry (from sacred-inquiry.js)
// - window.OrganizationalVoice (from organizational-voice.js)
// - window.AIEdgeInterpreter (from ai-edge-interpreter.js) - optional

// ============================================================================
// SECTION 2: QUESTION TEMPLATES
// ============================================================================

/**
 * QUESTION_TEMPLATES - Patterns for generating questions from face names
 *
 * These templates use {faceA} and {faceB} placeholders that get replaced
 * with the organization's actual face names.
 *
 * Organized by health state × synergy element
 */
const QUESTION_TEMPLATES = {

    // WALL STATE - Blocked, defensive
    'wall:earth': {
        template: "What fortress stands between {faceA} and {faceB}? What is being protected?",
        shadow: "Is protection necessary, or has fear calcified into barrier?"
    },
    'wall:water': {
        template: "What emotions have frozen at the boundary of {faceA} and {faceB}?",
        shadow: "What grief is the heart protecting itself from?"
    },
    'wall:fire': {
        template: "What transformation is blocked between {faceA} and {faceB}?",
        shadow: "What truth is too dangerous to speak?"
    },
    'wall:air': {
        template: "What conversation has stopped between {faceA} and {faceB}?",
        shadow: "What would we have to admit if we started talking again?"
    },
    'wall:ether': {
        template: "What shared purpose has been abandoned between {faceA} and {faceB}?",
        shadow: "Is the wall protecting us from a calling we're not ready for?"
    },

    // GATE STATE - Controlled, selective
    'gate:earth': {
        template: "What agreements govern the exchange between {faceA} and {faceB}?",
        shadow: "Are these rules serving life or their own perpetuation?"
    },
    'gate:water': {
        template: "What emotional permission is required at the {faceA}-{faceB} boundary?",
        shadow: "Is trust being earned or demanded?"
    },
    'gate:fire': {
        template: "What initiation is required before {faceA} can transform through {faceB}?",
        shadow: "Is this gate testing readiness or blocking change?"
    },
    'gate:air': {
        template: "What information is filtered between {faceA} and {faceB}?",
        shadow: "Is communication curated for clarity or control?"
    },
    'gate:ether': {
        template: "What alignment must be verified before {faceA} meets {faceB}?",
        shadow: "Is the gate testing worthiness or creating scarcity?"
    },

    // MEMBRANE STATE - Balanced, healthy
    'membrane:earth': {
        template: "What stable foundation supports the exchange between {faceA} and {faceB}?",
        shadow: "Is stability enabling growth or preventing necessary change?"
    },
    'membrane:water': {
        template: "How do {faceA} and {faceB} nourish each other emotionally?",
        shadow: "Is the flow truly balanced, or is one side giving more?"
    },
    'membrane:fire': {
        template: "What healthy transformation occurs where {faceA} meets {faceB}?",
        shadow: "Is this creating value or just change for its own sake?"
    },
    'membrane:air': {
        template: "What clarity flows between {faceA} and {faceB}?",
        shadow: "Is clarity revealing truth or hiding complexity?"
    },
    'membrane:ether': {
        template: "What shared purpose flows through the {faceA}-{faceB} connection?",
        shadow: "Is the purpose truly shared or differently interpreted?"
    },

    // HEMORRHAGE STATE - Too open, leaking
    'hemorrhage:earth': {
        template: "What boundaries have dissolved between {faceA} and {faceB}?",
        shadow: "Is this openness generosity or poor stewardship?"
    },
    'hemorrhage:water': {
        template: "What emotional flooding is occurring between {faceA} and {faceB}?",
        shadow: "Is this vulnerability or boundary collapse?"
    },
    'hemorrhage:fire': {
        template: "What wildfire burns uncontrolled between {faceA} and {faceB}?",
        shadow: "Is this creative destruction or just destruction?"
    },
    'hemorrhage:air': {
        template: "What information overload exists between {faceA} and {faceB}?",
        shadow: "Is openness creating transparency or chaos?"
    },
    'hemorrhage:ether': {
        template: "Whose meaning is drowning whose at the {faceA}-{faceB} boundary?",
        shadow: "Have we lost our center trying to serve everyone?"
    },

    // VORTEX STATE - Amplifying, transforming
    'vortex:earth': {
        template: "What new forms emerge from the intensity between {faceA} and {faceB}?",
        shadow: "Is this creation sustainable or born of unsustainable intensity?"
    },
    'vortex:water': {
        template: "What emotions are being amplified at the {faceA}-{faceB} interface?",
        shadow: "Is intensity creating connection or codependency?"
    },
    'vortex:fire': {
        template: "What phoenix rises from the {faceA}-{faceB} transformation?",
        shadow: "Is this creative destruction or just destruction?"
    },
    'vortex:air': {
        template: "What breakthrough ideas emerge where {faceA} meets {faceB}?",
        shadow: "Is this collective insight or groupthink?"
    },
    'vortex:ether': {
        template: "What transcendent meaning is being born at the {faceA}-{faceB} vortex?",
        shadow: "Is this genuine transcendence or spiritual bypass?"
    }
};

// ============================================================================
// SECTION 3: AI PROMPT GENERATOR
// ============================================================================

/**
 * Generate the AI prompt for creating edge-specific questions
 */
function generateAIPrompt(faceA, faceB, healthState, synergyElement, voiceConfig) {
    const stateInfo = window.SacredInquiry?.HEALTH_STATES?.[healthState.id] || healthState;
    const elementInfo = window.SacredInquiry?.SYNERGY_ELEMENTS?.[synergyElement.id] || synergyElement;

    return `
You are generating a single inquiry question for an organizational edge.

CONTEXT:
- Face A: "${faceA.name}" - ${faceA.description || 'An organizational domain'}
- Face B: "${faceB.name}" - ${faceB.description || 'An organizational domain'}
- Edge Health: ${stateInfo.name} (${stateInfo.description})
- Dominant Energy: ${elementInfo.name} (${elementInfo.quality})

VOICE CONFIGURATION:
${voiceConfig?.aiPrompt || 'Use a balanced, professional yet warm tone.'}

INSTRUCTIONS:
Generate ONE powerful inquiry question that:
1. Uses the organization's exact face names ("{faceA.name}" and "{faceB.name}")
2. Reflects the ${stateInfo.name} health state (${stateInfo.description})
3. Incorporates the ${elementInfo.name} elemental quality
4. Is genuinely useful for organizational reflection

Also provide a shadow question - what uncomfortable truth might this edge be hiding?

FORMAT YOUR RESPONSE AS JSON:
{
    "inquiry": "Your main question here",
    "shadow": "The shadow question here"
}

RESPOND ONLY WITH THE JSON, NO EXPLANATION.
`;
}

// ============================================================================
// SECTION 4: DYNAMIC INQUIRY GENERATOR
// ============================================================================

/**
 * DynamicEdgeInquiry - Main generator class
 */
const DynamicEdgeInquiry = {

    /**
     * Generate an inquiry for a specific edge
     *
     * @param {Object} options
     * @param {Object} options.faceA - Face A with name and optionally description
     * @param {Object} options.faceB - Face B with name and optionally description
     * @param {number} options.tension - Edge tension (0-1)
     * @param {boolean} options.useAI - Whether to attempt AI generation (default: true)
     * @returns {Promise<Object>} The generated inquiry
     */
    async generate(options) {
        const { faceA, faceB, tension, useAI = true } = options;

        // Get state information from SacredInquiry module
        let healthState, synergies, dominantElement;

        if (window.SacredInquiry) {
            healthState = window.SacredInquiry.getHealthState(tension);
            synergies = window.SacredInquiry.calculateSynergies(faceA, faceB);
            const dominant = window.SacredInquiry.getDominantSynergy(synergies);
            dominantElement = dominant.element;
        } else {
            // Fallback if SacredInquiry not loaded
            healthState = this._fallbackHealthState(tension);
            dominantElement = { id: 'ether', name: 'Ether' };
            synergies = {};
        }

        const stateKey = `${healthState.id}:${dominantElement.id}`;

        // Get voice configuration
        const voiceConfig = window.OrganizationalVoice?.VoiceState?.getConfig();

        // LAYER 1: Try AI generation if available and enabled
        if (useAI && window.AIEdgeInterpreter) {
            try {
                const aiResult = await this._tryAIGeneration(
                    faceA, faceB, healthState, dominantElement, voiceConfig
                );
                if (aiResult) {
                    return {
                        ...aiResult,
                        source: 'ai',
                        healthState,
                        dominantElement,
                        synergies,
                        stateKey
                    };
                }
            } catch (e) {
                console.warn('[DynamicEdgeInquiry] AI generation failed, using template:', e.message);
            }
        }

        // LAYER 2: Template-based generation (uses their face names)
        const template = QUESTION_TEMPLATES[stateKey];
        if (template) {
            return {
                inquiry: template.template
                    .replace(/{faceA}/g, faceA.name)
                    .replace(/{faceB}/g, faceB.name),
                shadow: template.shadow,
                source: 'template',
                healthState,
                dominantElement,
                synergies,
                stateKey
            };
        }

        // LAYER 3: Static fallback from edge-constants.js
        const staticInquiry = this._getStaticFallback(faceA, faceB);
        return {
            ...staticInquiry,
            source: 'static',
            healthState,
            dominantElement,
            synergies,
            stateKey
        };
    },

    /**
     * Attempt AI generation
     * @private
     */
    async _tryAIGeneration(faceA, faceB, healthState, dominantElement, voiceConfig) {
        if (!window.AIEdgeInterpreter?.generateEdgeNarrative) {
            return null;
        }

        const prompt = generateAIPrompt(faceA, faceB, healthState, dominantElement, voiceConfig);

        // Use the existing AI infrastructure
        const response = await window.AIEdgeInterpreter.generateCustomPrompt(prompt);

        if (response) {
            try {
                // Parse JSON response
                const parsed = JSON.parse(response);
                if (parsed.inquiry) {
                    return {
                        inquiry: parsed.inquiry,
                        shadow: parsed.shadow || ''
                    };
                }
            } catch (e) {
                // If not valid JSON, use as plain text inquiry
                return {
                    inquiry: response,
                    shadow: ''
                };
            }
        }

        return null;
    },

    /**
     * Get static fallback from edge-constants.js
     * @private
     */
    _getStaticFallback(faceA, faceB) {
        if (!window.EdgeConstants?.getEdgeBetweenFaces) {
            return {
                inquiry: `What is the relationship between ${faceA.name} and ${faceB.name}?`,
                shadow: 'What truth is being avoided at this boundary?'
            };
        }

        const edge = window.EdgeConstants.getEdgeBetweenFaces(faceA.id, faceB.id);
        if (edge) {
            return {
                inquiry: edge.question || `How do ${faceA.name} and ${faceB.name} serve each other?`,
                shadow: edge.shadow || 'What is this edge protecting?'
            };
        }

        return {
            inquiry: `What wants to flow between ${faceA.name} and ${faceB.name}?`,
            shadow: 'What truth is being avoided at this boundary?'
        };
    },

    /**
     * Fallback health state determination
     * @private
     */
    _fallbackHealthState(tension) {
        if (tension < 0.15) return { id: 'wall', name: 'Wall' };
        if (tension < 0.35) return { id: 'gate', name: 'Gate' };
        if (tension < 0.65) return { id: 'membrane', name: 'Membrane' };
        if (tension < 0.85) return { id: 'hemorrhage', name: 'Hemorrhage' };
        return { id: 'vortex', name: 'Vortex' };
    },

    /**
     * Generate inquiries for all edges of a face
     *
     * @param {Object} face - The face to analyze
     * @param {Object[]} adjacentFaces - Array of adjacent faces
     * @param {Object[]} edges - Array of edge objects with tension values
     * @returns {Promise<Object[]>} Array of generated inquiries
     */
    async generateForFace(face, adjacentFaces, edges) {
        const inquiries = [];

        for (const adjFace of adjacentFaces) {
            const edge = edges.find(e =>
                (e.faceAId === face.id && e.faceBId === adjFace.id) ||
                (e.faceBId === face.id && e.faceAId === adjFace.id)
            );

            const tension = edge?.tension || 0.5;

            const inquiry = await this.generate({
                faceA: face,
                faceB: adjFace,
                tension
            });

            inquiries.push({
                ...inquiry,
                faceA: face,
                faceB: adjFace,
                edgeId: edge?.id || `E${face.id}-${adjFace.id}`
            });
        }

        return inquiries;
    }
};

// ============================================================================
// SECTION 5: EXPORTS
// ============================================================================

// Browser global export
if (typeof window !== 'undefined') {
    window.DynamicEdgeInquiry = DynamicEdgeInquiry;
    window.QUESTION_TEMPLATES = QUESTION_TEMPLATES;

    console.log('🌟 Dynamic Edge Inquiry Generator loaded');
    console.log('   Fallback hierarchy: AI → Template → Static');
    console.log('   Use DynamicEdgeInquiry.generate({ faceA, faceB, tension })');
}

// CommonJS export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        DynamicEdgeInquiry,
        QUESTION_TEMPLATES,
        generateAIPrompt
    };
}
