/**
 * ============================================================================
 * SACRED INQUIRY ARCHITECTURE - THE 25 STATE-BASED INQUIRIES
 * ============================================================================
 *
 * This module implements the Sacred Inquiry Architecture designed January 2026.
 *
 * KEY BREAKTHROUGH: "Observation over prescription"
 * -----------------------------------------------
 * We don't prescribe what an edge IS (removed static exchange types)
 * We don't prescribe what question to ASK (removed static edge questions)
 * We observe what EMERGES (synergies calculated, questions generated)
 *
 * THE 25 UNIVERSAL INQUIRIES:
 * -----------------------------------------------
 * 5 Health States × 5 Synergy Elements = 25 inquiry patterns
 *
 * Health States (what is the edge doing?):
 *   - wall: Blocked, impermeable, defensive
 *   - gate: Controlled, selective, intentional
 *   - membrane: Balanced, semi-permeable, healthy
 *   - hemorrhage: Too open, leaking, losing definition
 *   - vortex: Amplifying, transforming, generating
 *
 * Synergy Elements (what is the dominant energy?):
 *   - earth: Stability, structure, grounding
 *   - water: Flow, emotion, adaptability
 *   - fire: Transformation, passion, will
 *   - air: Communication, clarity, connection
 *   - ether: Purpose, meaning, transcendence
 *
 * These inquiries are UNIVERSAL - they apply to any edge in any organization.
 * They speak to the QUALITY of the relationship, not its content.
 *
 * @module js/constants/sacred-inquiry
 * @author Deimantas & Claude (Co-created January 2026)
 * @version 1.0.0
 * @see {@link ../../docs/EDGE_DYNAMICS_REFERENCE.md} - Full architecture
 * ============================================================================
 */

// ============================================================================
// SECTION 1: HEALTH STATE DEFINITIONS
// ============================================================================

/**
 * HEALTH_STATES - The 5 possible states of an edge relationship
 *
 * These describe HOW the edge is functioning, not what it "is"
 */
const HEALTH_STATES = {
    wall: {
        id: 'wall',
        name: 'Wall',
        symbol: '🧱',
        description: 'The edge is blocked, defensive, impermeable',
        tensionRange: [0, 0.15],  // Very low tension = no flow
        indicators: ['No exchange happening', 'Departments isolated', 'Communication breakdown'],
        healthLevel: 'critical'
    },

    gate: {
        id: 'gate',
        name: 'Gate',
        symbol: '🚪',
        description: 'The edge is controlled, selective, intentional',
        tensionRange: [0.15, 0.35],  // Low-moderate tension = controlled
        indicators: ['Formal approval processes', 'Clear boundaries', 'Intentional exchange'],
        healthLevel: 'guarded'
    },

    membrane: {
        id: 'membrane',
        name: 'Membrane',
        symbol: '🫧',
        description: 'The edge is balanced, semi-permeable, healthy',
        tensionRange: [0.35, 0.65],  // Moderate tension = balanced
        indicators: ['Natural flow', 'Healthy boundaries', 'Reciprocal exchange'],
        healthLevel: 'healthy'
    },

    hemorrhage: {
        id: 'hemorrhage',
        name: 'Hemorrhage',
        symbol: '💧',
        description: 'The edge is too open, leaking, losing definition',
        tensionRange: [0.65, 0.85],  // High tension = over-flow
        indicators: ['Boundary confusion', 'Resource leakage', 'Role overlap'],
        healthLevel: 'stressed'
    },

    vortex: {
        id: 'vortex',
        name: 'Vortex',
        symbol: '🌀',
        description: 'The edge is amplifying, transforming, generating',
        tensionRange: [0.85, 1.0],  // Very high tension = intense activity
        indicators: ['Rapid transformation', 'Creative chaos', 'Emergence happening'],
        healthLevel: 'transcendent'
    }
};

// ============================================================================
// SECTION 2: SYNERGY ELEMENT DEFINITIONS
// ============================================================================

/**
 * SYNERGY_ELEMENTS - The 5 elemental qualities that can dominate an edge
 *
 * The dominant synergy is calculated from: sqrt(FaceA.element * FaceB.element)
 * The element with highest synergy determines the inquiry focus
 */
const SYNERGY_ELEMENTS = {
    earth: {
        id: 'earth',
        name: 'Earth',
        symbol: '🜃',
        color: '#4a5568',  // Gray-green
        quality: 'Stability, structure, grounding',
        question: 'What foundation is being built or broken?',
        archetype: 'The Builder'
    },

    water: {
        id: 'water',
        name: 'Water',
        symbol: '💧',
        color: '#3182ce',  // Blue
        quality: 'Flow, emotion, adaptability',
        question: 'What is flowing or stagnant?',
        archetype: 'The Healer'
    },

    fire: {
        id: 'fire',
        name: 'Fire',
        symbol: '🔥',
        color: '#e53e3e',  // Red
        quality: 'Transformation, passion, will',
        question: 'What is being transformed or consumed?',
        archetype: 'The Warrior'
    },

    air: {
        id: 'air',
        name: 'Air',
        symbol: '💨',
        color: '#38b2ac',  // Teal
        quality: 'Communication, clarity, connection',
        question: 'What truth is being spoken or silenced?',
        archetype: 'The Messenger'
    },

    ether: {
        id: 'ether',
        name: 'Ether',
        symbol: '✧',
        color: '#805ad5',  // Purple
        quality: 'Purpose, meaning, transcendence',
        question: 'What higher purpose is being served or abandoned?',
        archetype: 'The Sage'
    }
};

// ============================================================================
// SECTION 3: THE 25 STATE-BASED INQUIRIES
// ============================================================================

/**
 * STATE_INQUIRIES - The 25 universal inquiry patterns
 *
 * Format: `${healthState}:${synergyElement}`
 *
 * Each inquiry contains:
 *   - inquiry: The contemplative question (the most expansive voice)
 *   - shadow: The shadow question (what's being avoided/protected)
 *   - gift: The gift that can emerge from this state
 *   - practice: A simple practice for this state
 */
const STATE_INQUIRIES = {

    // =========================================================================
    // WALL STATE - Blocked, defensive, impermeable
    // =========================================================================

    'wall:earth': {
        inquiry: "What fortress has been built here? What is being protected by this immovable barrier?",
        shadow: "Is this protection necessary, or has fear calcified into permanent defense?",
        gift: "True protection emerges when we know what is worth defending.",
        practice: "Name the fear. Ask: 'What would happen if this wall came down?'"
    },

    'wall:water': {
        inquiry: "What emotions have frozen behind this dam? What tears cannot flow?",
        shadow: "Is the heart protecting itself from grief it has not yet felt?",
        gift: "The wall may hold back a flood that needs to find its ocean.",
        practice: "Find one small crack. Let one drop of emotion move."
    },

    'wall:fire': {
        inquiry: "What transformation is blocked? What creative fire suffocates behind this wall?",
        shadow: "What truth is too dangerous to speak into being?",
        gift: "Fire contained becomes fuel for when the wall finally falls.",
        practice: "Ask: 'What wants to burn here? What must be released?'"
    },

    'wall:air': {
        inquiry: "What conversation has stopped? What ideas cannot reach across this divide?",
        shadow: "What would we have to admit if we started talking again?",
        gift: "Silence sometimes holds truths that words cannot yet carry.",
        practice: "Write the unsent message. You don't have to send it yet."
    },

    'wall:ether': {
        inquiry: "What purpose has been abandoned behind this wall? What meaning cannot pass through?",
        shadow: "Is the wall protecting us from a calling we're not ready to answer?",
        gift: "Sacred boundaries sometimes protect what is not yet ready to emerge.",
        practice: "Ask: 'What vision lives on the other side of this wall?'"
    },

    // =========================================================================
    // GATE STATE - Controlled, selective, intentional
    // =========================================================================

    'gate:earth': {
        inquiry: "What structures govern this gatekeeping? What agreements determine who passes?",
        shadow: "Are the rules serving life, or serving their own perpetuation?",
        gift: "Wise gatekeeping ensures the right things reach the right places.",
        practice: "Review the rules. Ask: 'Do these still serve our purpose?'"
    },

    'gate:water': {
        inquiry: "What emotional permission is required to pass through this gate?",
        shadow: "Is trust being earned or demanded? Is vulnerability safe here?",
        gift: "Controlled emotional flow can create safety for deeper intimacy.",
        practice: "Notice what emotions the gate allows and blocks. Is this wise?"
    },

    'gate:fire': {
        inquiry: "What initiations must occur before transformation can enter?",
        shadow: "Is the gate testing readiness, or blocking change through bureaucracy?",
        gift: "The gate ensures change comes at the right time and pace.",
        practice: "Ask: 'What preparation is genuinely needed? What is delay?'"
    },

    'gate:air': {
        inquiry: "What information passes through? What truths are filtered?",
        shadow: "Is communication being curated for clarity or for control?",
        gift: "Selective communication can bring focus and reduce noise.",
        practice: "Examine what's being filtered out. Is it noise or signal?"
    },

    'gate:ether': {
        inquiry: "What sacred threshold must be crossed? What alignment is being verified?",
        shadow: "Is the gate testing worthiness, or creating artificial scarcity of meaning?",
        gift: "Sacred gates protect what is precious from what is premature.",
        practice: "Ask: 'What must I become to walk through this door?'"
    },

    // =========================================================================
    // MEMBRANE STATE - Balanced, semi-permeable, healthy
    // =========================================================================

    'membrane:earth': {
        inquiry: "What stable exchange is happening here? What structures support this flow?",
        shadow: "Is the stability serving growth, or preventing necessary disruption?",
        gift: "Healthy membranes create the container for life to flourish.",
        practice: "Appreciate what is working. Ask: 'How did we achieve this balance?'"
    },

    'membrane:water': {
        inquiry: "What emotional reciprocity flows through this boundary? How is trust exchanged?",
        shadow: "Is the emotional flow truly balanced, or is one side giving more?",
        gift: "Healthy emotional membranes create space for authentic connection.",
        practice: "Feel the quality of the exchange. Is it nourishing both sides?"
    },

    'membrane:fire': {
        inquiry: "What healthy transformation is occurring at this interface?",
        shadow: "Is the transformation creating value, or just change for its own sake?",
        gift: "Balanced transformation allows evolution without destruction.",
        practice: "Notice what is being transmuted. What emerges from this alchemy?"
    },

    'membrane:air': {
        inquiry: "What clear communication flows through this connection?",
        shadow: "Is the clarity revealing truth, or hiding complexity?",
        gift: "Healthy communication membranes allow understanding without overwhelm.",
        practice: "Listen to what moves through. Is the signal pure?"
    },

    'membrane:ether': {
        inquiry: "What shared purpose flows through this connection? How does meaning travel?",
        shadow: "Is the purpose truly shared, or differently interpreted?",
        gift: "Aligned membranes allow purpose to flow without distortion.",
        practice: "Speak the purpose aloud. Do both sides hear the same thing?"
    },

    // =========================================================================
    // HEMORRHAGE STATE - Too open, leaking, losing definition
    // =========================================================================

    'hemorrhage:earth': {
        inquiry: "What boundaries have dissolved? What resources are escaping?",
        shadow: "Is the openness generosity or poor stewardship?",
        gift: "Broken walls sometimes reveal that separation was the illusion.",
        practice: "Identify what is leaking. Ask: 'Does it need to be contained?'"
    },

    'hemorrhage:water': {
        inquiry: "What emotional flooding is occurring? Where is the heart overwhelmed?",
        shadow: "Is this vulnerability or boundary collapse? Is empathy healthy here?",
        gift: "The flood may be washing away what needed to dissolve.",
        practice: "Name the overwhelm. Ask: 'What boundary needs gentle restoration?'"
    },

    'hemorrhage:fire': {
        inquiry: "What transformation has become uncontrolled? What wildfire burns here?",
        shadow: "Is this creative destruction or just destruction?",
        gift: "Wildfire clears the forest floor for new growth.",
        practice: "Ask: 'What can be saved? What should burn?'"
    },

    'hemorrhage:air': {
        inquiry: "What information overload is occurring? What signal is lost in noise?",
        shadow: "Is the openness creating transparency or chaos?",
        gift: "Excessive communication sometimes breaks through to new understanding.",
        practice: "Find the essential message. Strip away the noise."
    },

    'hemorrhage:ether': {
        inquiry: "What purpose confusion has emerged? Whose meaning is drowning whose?",
        shadow: "Have we lost our center in trying to serve everyone?",
        gift: "Boundary dissolution can reveal the deeper unity underneath.",
        practice: "Return to core purpose. Ask: 'What is OUR truth?'"
    },

    // =========================================================================
    // VORTEX STATE - Amplifying, transforming, generating
    // =========================================================================

    'vortex:earth': {
        inquiry: "What new forms are being generated? What structures emerge from this intensity?",
        shadow: "Is the creation sustainable, or born of unsustainable intensity?",
        gift: "Vortexes birth new realities from apparent chaos.",
        practice: "Watch what emerges. Don't try to control the birth."
    },

    'vortex:water': {
        inquiry: "What emotional amplification is occurring? What feelings are being magnified?",
        shadow: "Is this emotional intensity creating connection or codependency?",
        gift: "Intense emotional fields can catalyze breakthrough healing.",
        practice: "Feel without drowning. Ask: 'What is this intensity teaching?'"
    },

    'vortex:fire': {
        inquiry: "What rapid transformation is occurring? What phoenix is rising?",
        shadow: "Is the fire creative destruction or just destruction?",
        gift: "The vortex of fire births what could never emerge from gradual change.",
        practice: "Honor the destruction. Watch for what emerges from the ashes."
    },

    'vortex:air': {
        inquiry: "What breakthrough communication is happening? What minds are merging?",
        shadow: "Is this collective insight or group-think? Is the voice authentic?",
        gift: "Vortexes of air birth new ideas that no single mind could conceive.",
        practice: "Capture the insights. They will fade when the intensity passes."
    },

    'vortex:ether': {
        inquiry: "What transcendent emergence is occurring? What new meaning is being born?",
        shadow: "Is this genuine transcendence or spiritual bypass?",
        gift: "The vortex of ether births new purpose from the death of the old.",
        practice: "Witness. The sacred emerges when we stop trying to manufacture it."
    }
};

// ============================================================================
// SECTION 4: INQUIRY SELECTION ENGINE
// ============================================================================

/**
 * Determine the health state of an edge based on its tension value
 *
 * @param {number} tension - Edge tension (0-1)
 * @returns {Object} Health state definition
 */
function getHealthState(tension) {
    // Ensure tension is in valid range
    const t = Math.max(0, Math.min(1, tension));

    for (const state of Object.values(HEALTH_STATES)) {
        if (t >= state.tensionRange[0] && t < state.tensionRange[1]) {
            return state;
        }
    }

    // Edge case: exactly 1.0
    return HEALTH_STATES.vortex;
}

/**
 * Calculate synergy values from two faces' element strengths
 *
 * @param {Object} faceA - Face A with element values (earth, water, fire, air, ether)
 * @param {Object} faceB - Face B with element values
 * @returns {Object} Synergy values per element
 */
function calculateSynergies(faceA, faceB) {
    const synergies = {};

    for (const element of Object.keys(SYNERGY_ELEMENTS)) {
        const valA = faceA[element] || faceA.elements?.[element] || 0.5;
        const valB = faceB[element] || faceB.elements?.[element] || 0.5;
        synergies[element] = Math.sqrt(valA * valB);
    }

    return synergies;
}

/**
 * Get the dominant synergy element from calculated synergies
 *
 * @param {Object} synergies - Synergy values per element
 * @returns {Object} Dominant synergy element definition
 */
function getDominantSynergy(synergies) {
    let maxElement = 'ether';
    let maxValue = 0;

    for (const [element, value] of Object.entries(synergies)) {
        if (value > maxValue) {
            maxValue = value;
            maxElement = element;
        }
    }

    return {
        element: SYNERGY_ELEMENTS[maxElement],
        value: maxValue,
        allSynergies: synergies
    };
}

/**
 * Get the appropriate inquiry for an edge based on its state
 *
 * @param {number} tension - Edge tension (0-1)
 * @param {Object} faceA - Face A with element values
 * @param {Object} faceB - Face B with element values
 * @returns {Object} Complete inquiry package
 */
function getInquiry(tension, faceA, faceB) {
    const healthState = getHealthState(tension);
    const synergies = calculateSynergies(faceA, faceB);
    const dominant = getDominantSynergy(synergies);

    const key = `${healthState.id}:${dominant.element.id}`;
    const inquiry = STATE_INQUIRIES[key];

    return {
        // The inquiry itself
        ...inquiry,

        // Context for understanding
        healthState,
        dominantElement: dominant.element,
        synergyStrength: dominant.value,
        allSynergies: dominant.allSynergies,

        // Metadata
        key,
        tension,

        // For display
        stateLabel: `${healthState.symbol} ${healthState.name}`,
        elementLabel: `${dominant.element.symbol} ${dominant.element.name}`,
        summary: `${healthState.name} state with ${dominant.element.name} synergy`
    };
}

/**
 * Get all inquiries for a specific health state
 *
 * @param {string} healthStateId - Health state ID
 * @returns {Object[]} Array of inquiries for that state
 */
function getInquiriesByHealthState(healthStateId) {
    return Object.entries(STATE_INQUIRIES)
        .filter(([key]) => key.startsWith(`${healthStateId}:`))
        .map(([key, inquiry]) => ({
            key,
            ...inquiry,
            element: SYNERGY_ELEMENTS[key.split(':')[1]]
        }));
}

/**
 * Get all inquiries for a specific element
 *
 * @param {string} elementId - Element ID
 * @returns {Object[]} Array of inquiries for that element
 */
function getInquiriesByElement(elementId) {
    return Object.entries(STATE_INQUIRIES)
        .filter(([key]) => key.endsWith(`:${elementId}`))
        .map(([key, inquiry]) => ({
            key,
            ...inquiry,
            healthState: HEALTH_STATES[key.split(':')[0]]
        }));
}

// ============================================================================
// SECTION 5: EXPORTS
// ============================================================================

// Browser global export
if (typeof window !== 'undefined') {
    window.SacredInquiry = {
        // Definitions
        HEALTH_STATES,
        SYNERGY_ELEMENTS,
        STATE_INQUIRIES,

        // Core functions
        getHealthState,
        calculateSynergies,
        getDominantSynergy,
        getInquiry,

        // Query functions
        getInquiriesByHealthState,
        getInquiriesByElement
    };

    console.log('🙏 Sacred Inquiry Architecture loaded - 25 state-based inquiries');
    console.log('   5 Health States: wall | gate | membrane | hemorrhage | vortex');
    console.log('   5 Synergy Elements: earth | water | fire | air | ether');
    console.log('   Use SacredInquiry.getInquiry(tension, faceA, faceB)');
}

// CommonJS export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        HEALTH_STATES,
        SYNERGY_ELEMENTS,
        STATE_INQUIRIES,
        getHealthState,
        calculateSynergies,
        getDominantSynergy,
        getInquiry,
        getInquiriesByHealthState,
        getInquiriesByElement
    };
}
