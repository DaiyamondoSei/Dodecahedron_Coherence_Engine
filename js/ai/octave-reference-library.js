/**
 * ========================================
 * OCTAVE REFERENCE LIBRARY
 * ========================================
 *
 * The "Constitution" for octave determination.
 * Built from CSV_BREATH_RATIOS.csv and CSV_Refrence_Models.csv
 *
 * KEY INSIGHT: Octave = KPI SOPHISTICATION, not face count.
 * A startup CAN have all 12 faces active, but at O1 coherence.
 *
 * This library provides:
 * 1. Breath Axis definitions (6 axes, 7 octave levels each)
 * 2. Face-Element-Octave KPI reference (12 faces x 5 elements x 7 octaves)
 * 3. Octave keyword patterns for AI matching
 *
 * @module OctaveReferenceLibrary
 * @version Sprint 2 - Task 3
 */

// ========================================
// OCTAVE DEFINITIONS
// ========================================

const OCTAVES = {
    O1: {
        name: 'Survival',
        focus: 'Existence',
        description: 'The organization is fighting to exist. Focus is on basic viability.',
        keywords: ['survive', 'exist', 'basic', 'runway', 'cash', 'founder', 'bootstrap', 'mvp', 'viable'],
        thresholds: { faceCount: [1, 3], coherence: [0, 0.2] }
    },
    O2: {
        name: 'Structure',
        focus: 'Stability',
        description: 'Building stable foundations. Processes and systems are being established.',
        keywords: ['structure', 'stable', 'process', 'efficient', 'systematic', 'discipline', 'organized'],
        thresholds: { faceCount: [3, 5], coherence: [0.2, 0.4] }
    },
    O3: {
        name: 'Relationships',
        focus: 'Connection',
        description: 'Building trust and community. Stakeholder relationships are forming.',
        keywords: ['trust', 'relationship', 'community', 'stakeholder', 'loyalty', 'belonging', 'team'],
        thresholds: { faceCount: [5, 8], coherence: [0.4, 0.5] }
    },
    O4: {
        name: 'Creativity',
        focus: 'Possibility',
        description: 'Creative experimentation. Innovation and bold ideas are being explored.',
        keywords: ['creative', 'innovate', 'experiment', 'bold', 'diverse', 'possibility', 'novel'],
        thresholds: { faceCount: [8, 10], coherence: [0.5, 0.6] }
    },
    O5: {
        name: 'Expression',
        focus: 'Clarity',
        description: 'Authentic expression. The organization\'s unique voice is clear and compelling.',
        keywords: ['express', 'clarity', 'transparent', 'authentic', 'voice', 'story', 'communicate'],
        thresholds: { faceCount: [10, 12], coherence: [0.6, 0.7] }
    },
    O6: {
        name: 'Vision',
        focus: 'Direction',
        description: 'Long-term vision. Building legacy and future-focused initiatives.',
        keywords: ['vision', 'legacy', 'future', 'direction', 'long-term', 'generational', 'evolve'],
        thresholds: { faceCount: [12, 12], coherence: [0.7, 0.8] }
    },
    O7: {
        name: 'Radiance',
        focus: 'Service',
        description: 'Pure service to the world. The organization is a gift to humanity.',
        keywords: ['radiance', 'service', 'sacred', 'planetary', 'consciousness', 'gift', 'healing'],
        thresholds: { faceCount: [12, 12], coherence: [0.8, 1.0] }
    }
};

// ========================================
// BREATH AXES (6 opposing face pairs)
// ========================================

const BREATH_AXES = [
    {
        id: 1,
        name: 'Resource Flow Axis',
        projectionFace: 11, // Funding Pipeline
        receptionFace: 1,   // Financial Capital
        description: 'The flow of resources into and through the organization',
        octaves: {
            O1: {
                breathName: 'Breath of Viability',
                projection: { question: 'Are we actively seeking any resources to exist?', kpi: 'Pipeline Viability & Coherence' },
                reception: { question: 'Do we have enough cash to survive?', kpi: 'Months of Runway' }
            },
            O2: {
                breathName: 'Breath of Efficiency',
                projection: { question: 'Is our funding pursuit efficient and systematic?', kpi: 'Financial System Integrity' },
                reception: { question: 'Is our capital being managed with discipline?', kpi: 'Operational Efficiency' }
            },
            O3: {
                breathName: 'Breath of Integrity',
                projection: { question: 'Are we building trust with values-aligned funders?', kpi: 'Investor Relationships' },
                reception: { question: 'Is our capital use creating stakeholder trust?', kpi: 'Stakeholder Value Distribution' }
            },
            O4: {
                breathName: 'Breath of Possibility',
                projection: { question: 'Are we seeking capital to fund bold experiments?', kpi: 'Creative Capital' },
                reception: { question: 'Is our capital base diverse enough for creative risks?', kpi: 'Investment in Innovation' }
            },
            O5: {
                breathName: 'Breath of Transparency',
                projection: { question: 'Is our financial story attracting aligned capital?', kpi: 'Capital as Communication' },
                reception: { question: 'Do our financial reports express our integrity?', kpi: 'Financial Storytelling' }
            },
            O6: {
                breathName: 'Breath of Legacy',
                projection: { question: 'Are we seeking capital for 100-year projects?', kpi: 'Legacy Capital' },
                reception: { question: 'Is our capital structured for generational stewardship?', kpi: 'Long-Term Capital Stewardship' }
            },
            O7: {
                breathName: 'Breath of Infinite Circulation',
                projection: { question: 'Is our very presence a magnet for sacred capital?', kpi: 'Capital as a Field of Grace' },
                reception: { question: 'Is our capital a pure gift to the world?', kpi: 'Capital as Sacred Energy' }
            }
        }
    },
    {
        id: 2,
        name: 'Substance & Story Axis',
        projectionFace: 7,  // Brand & Reputation
        receptionFace: 2,   // Intellectual Capital
        description: 'The relationship between what we build and what we tell',
        octaves: {
            O1: {
                breathName: 'Breath of Articulation',
                projection: { question: 'Do we have a basic, functional description of our idea?', kpi: 'Foundational Brand Integrity' },
                reception: { question: 'Have we documented the core of the idea?', kpi: 'IP Security & Formalization' }
            },
            O2: {
                breathName: 'Breath of Consistency',
                projection: { question: 'Is our brand message consistent and reliable?', kpi: 'Brand Consistency & Trust' },
                reception: { question: 'Is our IP robust and well-architected?', kpi: 'Dev. Velocity & Quality' }
            },
            O3: {
                breathName: 'Breath of Authenticity',
                projection: { question: 'Does our brand story build community and trust?', kpi: 'Brand Trust & Authenticity' },
                reception: { question: 'Is our IP being co-created with our partners?', kpi: 'Collaborative Knowledge' }
            },
            O4: {
                breathName: 'Breath of Genius',
                projection: { question: 'Is our brand actively telling new, challenging stories?', kpi: 'Innovative Branding' },
                reception: { question: 'Is our IP portfolio generating novel creations?', kpi: 'Embodied Innovation' }
            },
            O5: {
                breathName: 'Breath of Beauty',
                projection: { question: 'Is our brand\'s voice a beautiful and authentic work of art?', kpi: 'Authentic Brand Expression' },
                reception: { question: 'Is our knowledge expressed with masterful elegance?', kpi: 'Knowledge Sharing & Influence' }
            },
            O6: {
                breathName: 'Breath of Endurance',
                projection: { question: 'Is our brand telling a story that can change the future?', kpi: 'Legacy Branding' },
                reception: { question: 'Is our IP a legacy that will serve future generations?', kpi: 'Evolution of Knowledge' }
            },
            O7: {
                breathName: 'Breath of Revelation',
                projection: { question: 'Is our brand an archetypal symbol for truth itself?', kpi: 'Brand as an Archetype' },
                reception: { question: 'Is our knowledge a living field of planetary consciousness?', kpi: 'Knowledge as a Living Field' }
            }
        }
    },
    {
        id: 3,
        name: 'Being & Doing Axis',
        projectionFace: 8,  // Core Operations
        receptionFace: 3,   // Human Capital
        description: 'The relationship between human energy and operational output',
        octaves: {
            O1: {
                breathName: 'Breath of Sustainability',
                projection: { question: 'Is any work getting done?', kpi: 'Operational Viability' },
                reception: { question: 'Does the founder have the energy to exist?', kpi: 'Founder Sustainability' }
            },
            O2: {
                breathName: 'Breath of Rhythm',
                projection: { question: 'Is our work efficient and reliable?', kpi: 'Operational Throughput' },
                reception: { question: 'Is our team stable and are roles clear?', kpi: 'Role Clarity & Team Stability' }
            },
            O3: {
                breathName: 'Breath of Belonging',
                projection: { question: 'Does our work feel collaborative and joyful?', kpi: 'Collaborative Flow' },
                reception: { question: 'Does our team feel safe and connected?', kpi: 'Team Cohesion & Psych. Safety' }
            },
            O4: {
                breathName: 'Breath of Play',
                projection: { question: 'Are we creating space for operational innovation?', kpi: 'Operational Innovation' },
                reception: { question: 'Do our people have psychological safety to be creative?', kpi: 'Creative Culture' }
            },
            O5: {
                breathName: 'Breath of Presence',
                projection: { question: 'Are we transparently sharing how we work?', kpi: 'Operational Transparency' },
                reception: { question: 'Is our culture a story worth telling?', kpi: 'Cultural Storytelling' }
            },
            O6: {
                breathName: 'Breath of Continuity',
                projection: { question: 'Is our work a path to collective mastery?', kpi: 'Evolutionary Operations' },
                reception: { question: 'Is our culture designed to outlive its founders?', kpi: 'Long-Term Cultural Viability' }
            },
            O7: {
                breathName: 'Breath of Oneness',
                projection: { question: 'Is our work itself a form of meditation and service?', kpi: 'Operations as a Living Art' },
                reception: { question: 'Is our collective being a source of healing?', kpi: 'Consciousness as Capital' }
            }
        }
    },
    {
        id: 4,
        name: 'Form & Integrity Axis',
        projectionFace: 4,  // Structural Capital
        receptionFace: 9,   // Regenerative Flow
        description: 'The relationship between governance structure and regenerative integrity',
        octaves: {
            O1: {
                breathName: 'Breath of Intention',
                projection: { question: 'Do we have the basic legal forms to exist?', kpi: 'Governance Foundation Integrity' },
                reception: { question: 'Are we making conscious, integrity-based choices?', kpi: 'Regenerative Intent & Practice' }
            },
            O2: {
                breathName: 'Breath of Resilience',
                projection: { question: 'Are our processes resilient and scalable?', kpi: 'Process Resilience' },
                reception: { question: 'Are those processes designed to reduce waste?', kpi: 'Regenerative Operations' }
            },
            O3: {
                breathName: 'Breath of Participation',
                projection: { question: 'Do our structures feel fair and empowering?', kpi: 'Participatory Governance' },
                reception: { question: 'Are our relationships with stakeholders regenerative?', kpi: 'Stakeholder Relationships' }
            },
            O4: {
                breathName: 'Breath of Wisdom',
                projection: { question: 'Does our governance allow for creative rule-breaking?', kpi: 'Adaptive Governance' },
                reception: { question: 'Is our creativity in service of regeneration?', kpi: 'Regenerative Design' }
            },
            O5: {
                breathName: 'Breath of Accountability',
                projection: { question: 'Are we radically transparent about our structures?', kpi: 'Governance Transparency' },
                reception: { question: 'Is our story of impact honest and verifiable?', kpi: 'Impact Storytelling' }
            },
            O6: {
                breathName: 'Breath of Evolution',
                projection: { question: 'Is our governance model itself designed to evolve?', kpi: 'Evolutionary Governance' },
                reception: { question: 'Are we a steward for future generations?', kpi: 'Generational Regeneration' }
            },
            O7: {
                breathName: 'Breath of Life Itself',
                projection: { question: 'Has our structure dissolved into emergent order?', kpi: 'Governance as Emergent Order' },
                reception: { question: 'Are we a living expression of the Earth healing itself?', kpi: 'Creation as a Planetary Act' }
            }
        }
    },
    {
        id: 5,
        name: 'Perception & Truth Axis',
        projectionFace: 5,  // Market Resonance
        receptionFace: 10,  // Foundational Values
        description: 'The relationship between external perception and internal truth',
        octaves: {
            O1: {
                breathName: 'Breath of Clarity',
                projection: { question: 'Does the market understand our basic message?', kpi: 'Initial Message Coherence' },
                reception: { question: 'Are our actions grounded in our core values?', kpi: 'Lived Values & Cultural Integrity' }
            },
            O2: {
                breathName: 'Breath of Reliability',
                projection: { question: 'Do customers have a reliable, stable experience?', kpi: 'Customer Experience' },
                reception: { question: 'Are our values embedded in our formal systems?', kpi: 'Formalized Cultural Systems' }
            },
            O3: {
                breathName: 'Breath of Loyalty',
                projection: { question: 'Are we building a loyal, trusting community?', kpi: 'Customer Loyalty, Love & Community' },
                reception: { question: 'Are our values lived in our daily relationships?', kpi: 'Values in Relationship' }
            },
            O4: {
                breathName: 'Breath of Imagination',
                projection: { question: 'Is the market co-creating our product with us?', kpi: 'Co-Creative Marketing' },
                reception: { question: 'Are our values themselves a source of innovation?', kpi: 'Evolution of Values' }
            },
            O5: {
                breathName: 'Breath of Resonance',
                projection: { question: 'Does the market feel our authentic signal?', kpi: 'Ecosystem Signal Fidelity' },
                reception: { question: 'Is our public expression of values a beacon of truth?', kpi: 'Values as a Beacon' }
            },
            O6: {
                breathName: 'Breath of Destiny',
                projection: { question: 'Is the market seeing us as a shaper of the future?', kpi: 'Future-Shaping Narratives' },
                reception: { question: 'Are our values universal and timeless?', kpi: 'Timeless Values' }
            },
            O7: {
                breathName: 'Breath of Unity',
                projection: { question: 'Have "we" and "the market" dissolved into one field?', kpi: 'The Market as a Field of Consciousness' },
                reception: { question: 'Have our values become a self-evident truth?', kpi: 'Values as Universal Law' }
            }
        }
    },
    {
        id: 6,
        name: 'Network & Fortress Axis',
        projectionFace: 6,  // Community & Partners
        receptionFace: 12,  // Risk & Resilience
        description: 'The relationship between external network and internal resilience',
        octaves: {
            O1: {
                breathName: 'Breath of Support',
                projection: { question: 'Are we building a foundational support network?', kpi: 'Network Foundation Strength' },
                reception: { question: 'Is our venture protected from a single point of failure?', kpi: 'Systemic Fragility Assessment' }
            },
            O2: {
                breathName: 'Breath of Stability',
                projection: { question: 'Are our partnerships stable and well-integrated?', kpi: 'Partnership Integration' },
                reception: { question: 'Are our core systems resilient and managed for risk?', kpi: 'Risk Management Systems' }
            },
            O3: {
                breathName: 'Breath of Synergy',
                projection: { question: 'Are our partnerships deep and mutually supportive?', kpi: 'Ecosystem Health' },
                reception: { question: 'Is our resilience built on a foundation of trust?', kpi: 'Relational Resilience' }
            },
            O4: {
                breathName: 'Breath of Emergence',
                projection: { question: 'Is our network a source of ecosystem-level innovation?', kpi: 'Ecosystem Innovation' },
                reception: { question: 'Is our innovation portfolio diverse enough to be resilient?', kpi: 'Innovative Resilience' }
            },
            O5: {
                breathName: 'Breath of Trust',
                projection: { question: 'Is the story of our ecosystem clear and inspiring?', kpi: 'Ecosystem Narrative Weaving' },
                reception: { question: 'Is our honesty about failures making us stronger?', kpi: 'Resilience through Story' }
            },
            O6: {
                breathName: 'Breath of Stewardship',
                projection: { question: 'Is our network consciously building a better future?', kpi: 'Ecosystem as a Future-Builder' },
                reception: { question: 'Is our vision itself resilient and able to self-correct?', kpi: 'Anti-Fragile Vision' }
            },
            O7: {
                breathName: 'Breath of Interbeing',
                projection: { question: 'Is our network a living prototype of a new civilization?', kpi: 'The Network as a Planetary Organ' },
                reception: { question: 'Have we mastered the art of becoming stronger from chaos?', kpi: 'Resilience as Being' }
            }
        }
    }
];

// ========================================
// FACE DEFINITIONS
// ========================================

const FACES = {
    1: { name: 'Financial Capital', icon: '💰', breathAxis: 1, role: 'reception' },
    2: { name: 'Intellectual Capital', icon: '💡', breathAxis: 2, role: 'reception' },
    3: { name: 'Human Capital', icon: '👥', breathAxis: 3, role: 'reception' },
    4: { name: 'Structural Capital', icon: '🏗️', breathAxis: 4, role: 'projection' },
    5: { name: 'Market Resonance', icon: '📈', breathAxis: 5, role: 'projection' },
    6: { name: 'Community & Partners', icon: '🤝', breathAxis: 6, role: 'projection' },
    7: { name: 'Brand & Reputation', icon: '⭐', breathAxis: 2, role: 'projection' },
    8: { name: 'Core Operations', icon: '⚙️', breathAxis: 3, role: 'projection' },
    9: { name: 'Regenerative Flow', icon: '♻️', breathAxis: 4, role: 'reception' },
    10: { name: 'Foundational Values', icon: '🎯', breathAxis: 5, role: 'reception' },
    11: { name: 'Funding Pipeline', icon: '💎', breathAxis: 1, role: 'projection' },
    12: { name: 'Risk & Resilience', icon: '🛡️', breathAxis: 6, role: 'reception' }
};

// ========================================
// OCTAVE KEYWORD PATTERNS
// ========================================

const OCTAVE_KEYWORD_PATTERNS = {
    // Financial indicators
    financial: {
        O1: ['runway', 'cash', 'survive', 'exist', 'bootstrap', 'seed', 'pre-seed', 'founder funding'],
        O2: ['efficiency', 'burn rate', 'systematic', 'discipline', 'operational', 'process'],
        O3: ['trust', 'stakeholder', 'values-aligned', 'investor relations', 'community'],
        O4: ['creative capital', 'bold experiments', 'diverse', 'innovation fund', 'risk'],
        O5: ['transparent', 'financial story', 'communicate', 'clarity', 'expression'],
        O6: ['legacy', 'long-term', 'generational', 'stewardship', '100-year'],
        O7: ['sacred', 'gift', 'infinite', 'planetary', 'consciousness']
    },
    // Team/HR indicators
    team: {
        O1: ['founder', 'solo', 'energy', 'burnout', 'sustain'],
        O2: ['roles', 'structure', 'stable', 'clear', 'organized'],
        O3: ['team', 'cohesion', 'belonging', 'safety', 'connected'],
        O4: ['creative culture', 'innovation', 'psychological safety', 'experiment'],
        O5: ['culture story', 'transparent', 'presence', 'authentic'],
        O6: ['succession', 'mentorship', 'outlive founders', 'continuity'],
        O7: ['consciousness', 'collective being', 'healing', 'meditation']
    },
    // Operations indicators
    operations: {
        O1: ['mvp', 'prototype', 'working', 'viable', 'functional'],
        O2: ['efficient', 'reliable', 'throughput', 'process', 'flow'],
        O3: ['collaborative', 'joyful', 'team flow', 'dance'],
        O4: ['innovation', 'experiment', 'play', 'creative space'],
        O5: ['transparent', 'sharing how', 'story of work'],
        O6: ['mastery', 'evolution', 'autopoietic', 'self-creating'],
        O7: ['art', 'meditation', 'beautiful', 'sacred process']
    }
};

// ========================================
// ORGANIZATION STAGE DETECTION
// ========================================

const ORGANIZATION_STAGES = {
    'pre-seed': { maxOctave: 'O2', typicalOctave: 'O1', keywords: ['idea', 'pre-seed', 'concept', 'founding', 'bootstrap'] },
    'seed': { maxOctave: 'O2', typicalOctave: 'O1', keywords: ['seed', 'first funding', 'angel', 'mvp', 'early'] },
    'early-stage': { maxOctave: 'O3', typicalOctave: 'O2', keywords: ['series a', 'early-stage', 'growth', 'traction'] },
    'growth': { maxOctave: 'O4', typicalOctave: 'O3', keywords: ['series b', 'scaling', 'expansion', 'growth stage'] },
    'mature': { maxOctave: 'O5', typicalOctave: 'O4', keywords: ['established', 'mature', 'profitable', 'series c', 'late stage'] },
    'enterprise': { maxOctave: 'O6', typicalOctave: 'O5', keywords: ['enterprise', 'fortune 500', 'multinational', 'legacy'] },
    'transcendent': { maxOctave: 'O7', typicalOctave: 'O6', keywords: ['foundation', 'non-profit', 'movement', 'planetary'] }
};

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Detect organization stage from story text
 */
function detectOrganizationStage(storyText) {
    const lowerStory = storyText.toLowerCase();

    for (const [stage, config] of Object.entries(ORGANIZATION_STAGES)) {
        for (const keyword of config.keywords) {
            if (lowerStory.includes(keyword)) {
                return {
                    stage,
                    maxOctave: config.maxOctave,
                    typicalOctave: config.typicalOctave,
                    matchedKeyword: keyword
                };
            }
        }
    }

    // Default to early-stage if no keywords found
    return {
        stage: 'early-stage',
        maxOctave: 'O3',
        typicalOctave: 'O2',
        matchedKeyword: null
    };
}

/**
 * Get the maximum octave allowed for a detected stage
 */
function getMaxOctaveForStage(stage) {
    const stageConfig = ORGANIZATION_STAGES[stage];
    return stageConfig ? stageConfig.maxOctave : 'O3';
}

/**
 * Convert octave string to number (O1 -> 1, O7 -> 7)
 */
function octaveToNumber(octave) {
    return parseInt(octave.replace('O', ''));
}

/**
 * Convert number to octave string (1 -> O1, 7 -> O7)
 */
function numberToOctave(num) {
    return `O${Math.min(7, Math.max(1, num))}`;
}

/**
 * Constrain an octave to a maximum level
 */
function constrainOctave(proposedOctave, maxOctave) {
    const proposed = octaveToNumber(proposedOctave);
    const max = octaveToNumber(maxOctave);
    return numberToOctave(Math.min(proposed, max));
}

/**
 * Match story text to octave level based on keyword patterns
 */
function matchStoryToOctave(storyText, domain = 'financial') {
    const lowerStory = storyText.toLowerCase();
    const patterns = OCTAVE_KEYWORD_PATTERNS[domain] || OCTAVE_KEYWORD_PATTERNS.financial;

    // Count matches for each octave level (weighted by position - earlier in text = more important)
    const matches = {};
    for (let i = 1; i <= 7; i++) {
        const octave = `O${i}`;
        matches[octave] = 0;

        for (const keyword of patterns[octave] || []) {
            const index = lowerStory.indexOf(keyword);
            if (index !== -1) {
                // Weight by position (earlier = more weight)
                const weight = 1 - (index / lowerStory.length) * 0.5;
                matches[octave] += weight;
            }
        }
    }

    // Find the octave with the most matches
    let bestOctave = 'O1';
    let bestScore = 0;

    for (const [octave, score] of Object.entries(matches)) {
        if (score > bestScore) {
            bestScore = score;
            bestOctave = octave;
        }
    }

    return {
        octave: bestOctave,
        score: bestScore,
        matches
    };
}

/**
 * Get breath axis information for a face
 */
function getBreathAxisForFace(faceId) {
    const face = FACES[faceId];
    if (!face) return null;

    const axis = BREATH_AXES.find(a => a.id === face.breathAxis);
    if (!axis) return null;

    return {
        axis,
        role: face.role,
        opposingFace: face.role === 'projection' ? axis.receptionFace : axis.projectionFace
    };
}

/**
 * Get octave-specific KPI information for a breath axis
 */
function getBreathAxisOctaveInfo(axisId, octave) {
    const axis = BREATH_AXES.find(a => a.id === axisId);
    if (!axis || !axis.octaves[octave]) return null;

    return axis.octaves[octave];
}

/**
 * Generate AI prompt context for octave determination
 */
function generateOctavePromptContext(storyText) {
    const stageInfo = detectOrganizationStage(storyText);

    return {
        detectedStage: stageInfo,
        maxAllowedOctave: stageInfo.maxOctave,
        breathAxes: BREATH_AXES.map(axis => ({
            name: axis.name,
            description: axis.description,
            sampleQuestions: {
                O1: axis.octaves.O1,
                O2: axis.octaves.O2,
                O3: axis.octaves.O3
            }
        })),
        octaveDescriptions: OCTAVES,
        constraintInstruction: `
IMPORTANT CONSTRAINT: Based on detected stage "${stageInfo.stage}",
the MAXIMUM octave any face can receive is ${stageInfo.maxOctave}.
DO NOT assign octaves higher than ${stageInfo.maxOctave}.
Typical organizations at this stage are at ${stageInfo.typicalOctave}.

A startup CAN have all 12 faces, but they may all be at O1-O2 coherence.
Octave measures KPI SOPHISTICATION, not face existence.
`
    };
}

// ========================================
// EXPORTS
// ========================================

export {
    OCTAVES,
    BREATH_AXES,
    FACES,
    OCTAVE_KEYWORD_PATTERNS,
    ORGANIZATION_STAGES,
    detectOrganizationStage,
    getMaxOctaveForStage,
    octaveToNumber,
    numberToOctave,
    constrainOctave,
    matchStoryToOctave,
    getBreathAxisForFace,
    getBreathAxisOctaveInfo,
    generateOctavePromptContext
};

// Export for browser global
if (typeof window !== 'undefined') {
    window.OctaveReferenceLibrary = {
        OCTAVES,
        BREATH_AXES,
        FACES,
        OCTAVE_KEYWORD_PATTERNS,
        ORGANIZATION_STAGES,
        detectOrganizationStage,
        getMaxOctaveForStage,
        constrainOctave,
        matchStoryToOctave,
        generateOctavePromptContext
    };
}

Logger.info('OctaveReferenceLibrary', 'OctaveReferenceLibrary loaded with 6 breath axes, 7 octaves, 12 faces');
