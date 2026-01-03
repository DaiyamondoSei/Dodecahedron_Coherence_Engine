/**
 * ════════════════════════════════════════════════════════════════════════════
 * KPI LIBRARY - SMART SUGGESTIONS AND ELEMENTAL WISDOM
 * ════════════════════════════════════════════════════════════════════════════
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                        NOTES FOR FUTURE CLAUDE                          │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * KEY INSIGHT: This is a SUGGESTION engine, not a definition source.
 * ─────────────────────────────────────────────────────────────────────────
 * The ACTUAL KPI definitions come from CSV/JSON data (data/CSV_KPI_Database.csv).
 * This library provides contextual suggestions when users:
 *   - Select face domains in the UI
 *   - Choose elements for their KPIs
 *   - Need inspiration for what to measure
 *
 * Think of this as a "wise advisor" that suggests, not a "database" that defines.
 *
 * ELEMENTAL WISDOM:
 * ─────────────────────────────────────────────────────────────────────────
 * Each element represents a lens through which to view any metric:
 *   - 🌍 EARTH: Stability, resources, foundation (survival metrics)
 *   - 💧 WATER: Flow, adaptability, growth (growth metrics)
 *   - 🔥 FIRE: Energy, transformation, productivity (performance metrics)
 *   - 🌬️ AIR: Communication, speed, connection (velocity metrics)
 *   - ✨ ETHER: Vision, purpose, alignment (coherence metrics)
 *
 * METRIC TYPES AND CURVATURE (κ):
 * ─────────────────────────────────────────────────────────────────────────
 *   - 'survival' (κ=0.618): Early gains matter more - forgiving curve
 *   - 'growth' (κ=1.618): Late gains compound - demanding curve
 *   - 'completion' (κ=1.0): Linear progress - default
 *
 * NAVIGATION MAP:
 * ─────────────────────────────────────────────────────────────────────────
 *   ↑ IMPORTS FROM:
 *     • js/constants/kpi-constants.js → ELEMENTS, KPI_TYPES, KPI_LAYERS
 *     • js/constants/consciousness-constants.js → Elemental inquiries
 *
 *   → CONSUMED BY:
 *     • js/ai/mapping/kpi-extractor.js → Uses suggestions for AI extraction
 *     • UI components → KPI creation forms, element pickers
 *     • pages/*.html → Interactive KPI configuration
 *
 *   ← RELATED TO:
 *     • js/core/KPI.js → The actual KPI model (library suggests, KPI.js creates)
 *     • data/CSV_KPI_Database.csv → The source of truth for actual KPI values
 *     • docs/KPI_DATA_FLOW.md → Complete data flow documentation
 *
 * ════════════════════════════════════════════════════════════════════════════
 * @file kpi-library.js - Smart KPI Suggestions and Elemental Wisdom
 * @author Deimantas Murauskas & Claude
 * @description Contextual KPI suggestions based on face domains and elements.
 *              NOT the source of truth - that's CSV/JSON data.
 * ════════════════════════════════════════════════════════════════════════════
 */

// ════════════════════════════════════════════════════════════════════════════
// SECTION 1A: OCTAVE WISDOM - THE 7 DEVELOPMENTAL STAGES
// ════════════════════════════════════════════════════════════════════════════
//
// The 7 Octaves represent the developmental journey of an organization.
// At O1, survival is everything. At O7, the organization radiates service.
// Each octave has different KPI priorities and tolerances.
//
// KEY INSIGHT: An O1 organization shouldn't be judged by O7 standards.
// The system adapts its expectations to meet organizations where they are.
// ════════════════════════════════════════════════════════════════════════════

const OCTAVE_WISDOM = {
    O1: {
        name: 'Survival',
        focus: 'Existence',
        level: 1,
        color: '#DC143C',
        icon: '🔴',
        breathName: 'The Breath of Viability',
        philosophy: 'Every step forward is a victory. We celebrate basic existence.',
        kpiPriority: 'survival', // κ=0.618 - forgiving curve
        tolerance: 'Maximum forgiveness - any progress is celebrated',
        advice: 'Focus on immediate viability. Shadows are expected.',
        questions: {
            core: 'Are we still breathing as an organization?',
            celebration: 'What kept us alive this week?',
            warning: 'What threatens our basic existence?'
        },
        metricEmphasis: {
            Earth: 1.5,   // Survival needs FOUNDATIONS
            Water: 0.8,   // Flow is secondary
            Fire: 0.6,    // Energy is conserved
            Air: 0.5,     // Communication is minimal
            Ether: 0.4    // Vision is luxury
        }
    },
    O2: {
        name: 'Structure',
        focus: 'Stability',
        level: 2,
        color: '#FF8C00',
        icon: '🟠',
        breathName: 'The Breath of Efficiency',
        philosophy: 'Building the foundation. Every system counts.',
        kpiPriority: 'survival', // Still forgiving
        tolerance: 'High forgiveness - foundations take time',
        advice: 'Establish basic systems. Some chaos is normal.',
        questions: {
            core: 'Are our core processes reliable?',
            celebration: 'What new system saved us time?',
            warning: 'What process is breaking down?'
        },
        metricEmphasis: {
            Earth: 1.3,   // Structure needs foundations
            Water: 1.0,   // Flow starts to matter
            Fire: 0.8,    // Energy building
            Air: 0.7,     // Communication improving
            Ether: 0.5    // Vision emerging
        }
    },
    O3: {
        name: 'Relationships',
        focus: 'Connection',
        level: 3,
        color: '#FFD700',
        icon: '🟡',
        breathName: 'The Breath of Integrity',
        philosophy: 'Growing the tribe. Connection is currency.',
        kpiPriority: 'completion', // Balanced
        tolerance: 'Moderate forgiveness - teams are forming',
        advice: 'Invest in connections. Relationships compound.',
        questions: {
            core: 'Are our key relationships healthy?',
            celebration: 'What connection deepened this week?',
            warning: 'What relationship needs attention?'
        },
        metricEmphasis: {
            Earth: 1.0,
            Water: 1.4,   // Relationships ARE flow
            Fire: 1.0,
            Air: 1.2,     // Communication is relationships
            Ether: 0.8
        }
    },
    O4: {
        name: 'Creativity',
        focus: 'Possibility',
        level: 4,
        color: '#32CD32',
        icon: '🟢',
        breathName: 'The Breath of Possibility',
        philosophy: 'Find your voice. Differentiation matters.',
        kpiPriority: 'completion', // Balanced, central octave
        tolerance: 'Balanced expectations - you are established',
        advice: 'Express your unique value. Take creative risks.',
        questions: {
            core: 'Are we creating something unique?',
            celebration: 'What did we innovate this week?',
            warning: 'Where are we playing it too safe?'
        },
        metricEmphasis: {
            Earth: 0.9,
            Water: 1.1,
            Fire: 1.4,    // CREATIVITY IS FIRE
            Air: 1.1,
            Ether: 1.0
        }
    },
    O5: {
        name: 'Expression',
        focus: 'Clarity',
        level: 5,
        color: '#1E90FF',
        icon: '🔵',
        breathName: 'The Breath of Transparency',
        philosophy: 'Amplify your signal. Be heard with clarity.',
        kpiPriority: 'growth', // More demanding
        tolerance: 'Moderate demands - coherence strengthens',
        advice: 'Your message should be unmistakable.',
        questions: {
            core: 'Is our voice clear and authentic?',
            celebration: 'Where did our message land powerfully?',
            warning: 'Where is our signal getting lost?'
        },
        metricEmphasis: {
            Earth: 0.8,
            Water: 1.0,
            Fire: 1.1,
            Air: 1.5,     // Expression IS Air
            Ether: 1.2
        }
    },
    O6: {
        name: 'Vision',
        focus: 'Direction',
        level: 6,
        color: '#4B0082',
        icon: '🟣',
        breathName: 'The Breath of Legacy',
        philosophy: 'Lead with foresight. See what comes next.',
        kpiPriority: 'growth', // Demanding
        tolerance: 'High demands - you set standards',
        advice: 'Your vision should inspire generations.',
        questions: {
            core: 'Are we building for the long-term?',
            celebration: 'What strategic insight emerged?',
            warning: 'Are we trapped in short-term thinking?'
        },
        metricEmphasis: {
            Earth: 0.7,
            Water: 0.9,
            Fire: 1.0,
            Air: 1.2,
            Ether: 1.5    // Vision IS Ether
        }
    },
    O7: {
        name: 'Radiance',
        focus: 'Service',
        level: 7,
        color: '#FFFFFF',
        icon: '⚪',
        breathName: 'The Breath of Infinite Circulation',
        philosophy: 'Excellence is the expectation. You ARE the standard.',
        kpiPriority: 'growth', // Most demanding κ
        tolerance: 'Excellence expected - full coherence matters',
        advice: 'Your presence alone should elevate others.',
        questions: {
            core: 'Are we serving the greater good?',
            celebration: 'How did we lift others this week?',
            warning: 'Where has ego crept in?'
        },
        metricEmphasis: {
            Earth: 1.0,   // All elements matter equally
            Water: 1.0,   // at Radiance level
            Fire: 1.0,
            Air: 1.0,
            Ether: 1.3    // Slight emphasis on purpose
        }
    }
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 1B: BREATH AXIS QUESTIONS BY OCTAVE
// ════════════════════════════════════════════════════════════════════════════
//
// The 6 Breath Axes connect opposing face pairs. Each axis has octave-specific
// questions that reveal the health of the relationship between faces.
// ════════════════════════════════════════════════════════════════════════════

const BREATH_AXIS_WISDOM = {
    // Axis 1: F11 (Funding Pipeline) ↔ F1 (Financial Capital)
    'Resource Flow': {
        projection: 'Funding Pipeline',
        reception: 'Financial Capital',
        octaves: {
            O1: { exhale: 'Are we actively seeking any resources to exist?', inhale: 'Do we have enough cash to survive?', breathName: 'Viability' },
            O2: { exhale: 'Is our funding pursuit efficient and systematic?', inhale: 'Is our capital being managed with discipline?', breathName: 'Efficiency' },
            O3: { exhale: 'Are we building trust with values-aligned funders?', inhale: 'Is our capital use creating stakeholder trust?', breathName: 'Integrity' },
            O4: { exhale: 'Are we seeking capital to fund bold experiments?', inhale: 'Is our capital base diverse enough for creative risks?', breathName: 'Possibility' },
            O5: { exhale: 'Is our financial story attracting aligned capital?', inhale: 'Do our financial reports express our integrity?', breathName: 'Transparency' },
            O6: { exhale: 'Are we seeking capital for 100-year projects?', inhale: 'Is our capital structured for generational stewardship?', breathName: 'Legacy' },
            O7: { exhale: 'Is our very presence a magnet for sacred capital?', inhale: 'Is our capital a pure gift to the world?', breathName: 'Infinite Circulation' }
        }
    },
    // Axis 2: F7 (Brand & Reputation) ↔ F2 (Intellectual Capital)
    'Substance & Story': {
        projection: 'Brand & Reputation',
        reception: 'Intellectual Capital',
        octaves: {
            O1: { exhale: 'Do we have a basic, functional description of our idea?', inhale: 'Have we documented the core of the idea?', breathName: 'Articulation' },
            O2: { exhale: 'Is our brand message consistent and reliable?', inhale: 'Is our IP robust and well-architected?', breathName: 'Consistency' },
            O3: { exhale: 'Does our brand story build community and trust?', inhale: 'Is our IP being co-created with our partners?', breathName: 'Authenticity' },
            O4: { exhale: 'Is our brand actively telling new, challenging stories?', inhale: 'Is our IP portfolio generating novel creations?', breathName: 'Genius' },
            O5: { exhale: 'Is our brand\'s voice a beautiful and authentic work of art?', inhale: 'Is our knowledge expressed with masterful, simple elegance?', breathName: 'Beauty' },
            O6: { exhale: 'Is our brand telling a story that can change the future?', inhale: 'Is our IP a legacy that will serve future generations?', breathName: 'Endurance' },
            O7: { exhale: 'Is our brand an archetypal symbol for truth itself?', inhale: 'Is our knowledge a living field of planetary consciousness?', breathName: 'Revelation' }
        }
    },
    // Axis 3: F8 (Core Operations) ↔ F3 (Human Capital)
    'Being & Doing': {
        projection: 'Core Operations',
        reception: 'Human Capital',
        octaves: {
            O1: { exhale: 'Is any work getting done?', inhale: 'Does the founder have the energy to exist?', breathName: 'Sustainability' },
            O2: { exhale: 'Is our work efficient and reliable?', inhale: 'Is our team stable and are roles clear?', breathName: 'Rhythm' },
            O3: { exhale: 'Does our work feel collaborative and joyful?', inhale: 'Does our team feel safe and connected?', breathName: 'Belonging' },
            O4: { exhale: 'Are we creating space for operational innovation?', inhale: 'Do our people have psychological safety to be creative?', breathName: 'Play' },
            O5: { exhale: 'Are we transparently sharing how we work?', inhale: 'Is our culture a story worth telling?', breathName: 'Presence' },
            O6: { exhale: 'Is our work a path to collective mastery?', inhale: 'Is our culture designed to outlive its founders?', breathName: 'Continuity' },
            O7: { exhale: 'Is our work itself a form of meditation and service?', inhale: 'Is our collective being a source of healing for the world?', breathName: 'Oneness' }
        }
    },
    // Axis 4: F4 (Structural Capital) ↔ F9 (Regenerative Flow)
    'Form & Integrity': {
        projection: 'Structural Capital',
        reception: 'Regenerative Flow',
        octaves: {
            O1: { exhale: 'Do we have the basic legal forms to exist?', inhale: 'Are we making conscious, integrity-based choices?', breathName: 'Intention' },
            O2: { exhale: 'Are our processes resilient and scalable?', inhale: 'Are those processes designed to reduce waste?', breathName: 'Resilience' },
            O3: { exhale: 'Do our structures feel fair and empowering?', inhale: 'Are our relationships with stakeholders regenerative?', breathName: 'Participation' },
            O4: { exhale: 'Does our governance allow for creative rule-breaking?', inhale: 'Is our creativity in service of regeneration?', breathName: 'Wisdom' },
            O5: { exhale: 'Are we radically transparent about our structures?', inhale: 'Is our story of impact honest and verifiable?', breathName: 'Accountability' },
            O6: { exhale: 'Is our governance model itself designed to evolve?', inhale: 'Are we a steward for future generations?', breathName: 'Evolution' },
            O7: { exhale: 'Has our structure dissolved into emergent order?', inhale: 'Are we a living expression of the Earth healing itself?', breathName: 'Life Itself' }
        }
    },
    // Axis 5: F5 (Market Resonance) ↔ F10 (Foundational Values)
    'Perception & Truth': {
        projection: 'Market Resonance',
        reception: 'Foundational Values',
        octaves: {
            O1: { exhale: 'Does the market understand our basic message?', inhale: 'Are our actions grounded in our core values?', breathName: 'Clarity' },
            O2: { exhale: 'Do customers have a reliable, stable experience?', inhale: 'Are our values embedded in our formal cultural systems?', breathName: 'Reliability' },
            O3: { exhale: 'Are we building a loyal, trusting community?', inhale: 'Are our values lived in our daily relationships?', breathName: 'Loyalty' },
            O4: { exhale: 'Is the market co-creating our product with us?', inhale: 'Are our values themselves a source of innovation?', breathName: 'Imagination' },
            O5: { exhale: 'Does the market feel our authentic signal?', inhale: 'Is our public expression of values a beacon of truth?', breathName: 'Resonance' },
            O6: { exhale: 'Is the market seeing us as a shaper of the future?', inhale: 'Are our values universal and timeless?', breathName: 'Destiny' },
            O7: { exhale: 'Have "we" and "the market" dissolved into one field?', inhale: 'Have our values become a self-evident truth?', breathName: 'Unity' }
        }
    },
    // Axis 6: F6 (Community & Partners) ↔ F12 (Risk & Resilience)
    'Network & Fortress': {
        projection: 'Community & Partners',
        reception: 'Risk & Resilience',
        octaves: {
            O1: { exhale: 'Are we building a foundational support network?', inhale: 'Is our venture protected from single point of failure?', breathName: 'Support' },
            O2: { exhale: 'Are our partnerships stable and well-integrated?', inhale: 'Are our core systems resilient and managed for risk?', breathName: 'Stability' },
            O3: { exhale: 'Are our partnerships deep and mutually supportive?', inhale: 'Is our resilience built on a foundation of trust?', breathName: 'Synergy' },
            O4: { exhale: 'Is our network a source of ecosystem-level innovation?', inhale: 'Is our innovation portfolio diverse enough to be resilient?', breathName: 'Emergence' },
            O5: { exhale: 'Is the story of our ecosystem clear and inspiring?', inhale: 'Is our honesty about failures making us stronger?', breathName: 'Trust' },
            O6: { exhale: 'Is our network consciously building a better future?', inhale: 'Is our vision itself resilient and able to self-correct?', breathName: 'Stewardship' },
            O7: { exhale: 'Is our network a living prototype of a new civilization?', inhale: 'Have we mastered the art of becoming stronger from chaos?', breathName: 'Interbeing' }
        }
    }
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 1C: ELEMENTAL EXPLANATIONS
// ════════════════════════════════════════════════════════════════════════════

const ELEMENTAL_WISDOM = {
    Earth: {
        name: 'Earth',
        subtitle: 'Stability & Structure',
        icon: '🌍',
        color: '#8B4513',
        description: 'The foundation. Measures resources, infrastructure, and grounding forces. Earth KPIs represent what you can count on, what\'s solid and dependable.',
        qualities: 'Stable, Reliable, Tangible, Material, Foundational',
        examples: 'Cash reserves, physical assets, team size, inventory, infrastructure'
    },

    Water: {
        name: 'Water',
        subtitle: 'Flow & Adaptability',
        icon: '💧',
        color: '#1E90FF',
        description: 'The flow. Measures movement, growth, and adaptability. Water KPIs represent how things change, flow, and evolve over time.',
        qualities: 'Flowing, Adaptive, Growing, Cyclical, Emotional',
        examples: 'Revenue growth, customer acquisition, market expansion, cash flow, relationship quality'
    },

    Fire: {
        name: 'Fire',
        subtitle: 'Energy & Transformation',
        icon: '🔥',
        color: '#FF4500',
        description: 'The energy. Measures intensity, productivity, and transformation. Fire KPIs represent how much energy is being generated and directed.',
        qualities: 'Energetic, Productive, Transformative, Intense, Active',
        examples: 'Profit margin, productivity, conversion rates, innovation output, competitive advantage'
    },

    Air: {
        name: 'Air',
        subtitle: 'Communication & Movement',
        icon: '🌬️',
        color: '#87CEEB',
        description: 'The movement. Measures communication, speed, and connection. Air KPIs represent how quickly things move and how well information flows.',
        qualities: 'Fast, Communicative, Connected, Distributed, Mental',
        examples: 'Response time, velocity, information sharing, network effects, agility'
    },

    Ether: {
        name: 'Ether',
        subtitle: 'Vision & Purpose',
        icon: '✨',
        color: '#8A2BE2',
        description: 'The vision. Measures alignment with purpose, strategic clarity, and higher-order coherence. Ether KPIs represent "why" and "what for."',
        qualities: 'Visionary, Purposeful, Aligned, Strategic, Transcendent',
        examples: 'Mission alignment, strategic clarity, brand strength, cultural coherence, impact'
    }
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 2: UNIT TYPES
// ════════════════════════════════════════════════════════════════════════════

const UNIT_TYPES = [
    { value: 'number', label: 'Number', symbol: '', example: '42' },
    { value: 'percentage', label: 'Percentage', symbol: '%', example: '15%' },
    { value: 'currency_usd', label: 'US Dollars', symbol: '$', example: '$1.5M' },
    { value: 'currency_eur', label: 'Euros', symbol: '€', example: '€1.2M' },
    { value: 'months', label: 'Months', symbol: 'mo', example: '6 months' },
    { value: 'days', label: 'Days', symbol: 'd', example: '30 days' },
    { value: 'score', label: 'Score (1-10)', symbol: '/10', example: '7/10' },
    { value: 'ratio', label: 'Ratio', symbol: '', example: '1.5:1' },
    { value: 'hours', label: 'Hours', symbol: 'h', example: '40h' },
    { value: 'count', label: 'Count', symbol: '', example: '150 people' },
    { value: 'custom', label: 'Custom', symbol: '', example: 'custom' }
];

// ════════════════════════════════════════════════════════════════════════════
// SECTION 3: KPI SUGGESTIONS BY FACE
// ════════════════════════════════════════════════════════════════════════════
//
// These are SUGGESTIONS, not definitions. Use them to inspire KPI creation.
// Each face-element combination offers contextual wisdom for measurement.
// The metricType determines the curvature (κ) applied to normalize scores.
// ════════════════════════════════════════════════════════════════════════════

const KPI_SUGGESTIONS = {
    // Standard Business Model
    'Financial Capital': {
        Earth: [
            { name: 'Cash Reserves', unit: 'months', targetMin: 1, targetIdeal: 6, description: 'Months of runway', metricType: 'survival' },
            { name: 'Total Assets', unit: 'currency_usd', targetMin: 0, targetIdeal: 10000000, description: 'Balance sheet strength', metricType: 'completion' },
            { name: 'Debt-to-Equity Ratio', unit: 'ratio', targetMin: 0, targetIdeal: 0.5, description: 'Financial leverage', metricType: 'completion' }
        ],
        Water: [
            { name: 'Revenue Growth', unit: 'percentage', targetMin: 0, targetIdeal: 25, description: 'YoY growth rate', metricType: 'growth' },
            { name: 'Cash Flow', unit: 'currency_usd', targetMin: 0, targetIdeal: 1000000, description: 'Monthly cash flow', metricType: 'survival' },
            { name: 'Customer Lifetime Value Growth', unit: 'percentage', targetMin: 0, targetIdeal: 20, description: 'CLV increase', metricType: 'growth' }
        ],
        Fire: [
            { name: 'Profit Margin', unit: 'percentage', targetMin: 0, targetIdeal: 25, description: 'Net profit margin', metricType: 'growth' },
            { name: 'ROI', unit: 'percentage', targetMin: 0, targetIdeal: 30, description: 'Return on investment', metricType: 'growth' },
            { name: 'EBITDA Margin', unit: 'percentage', targetMin: 0, targetIdeal: 20, description: 'Operating profitability', metricType: 'growth' }
        ],
        Air: [
            { name: 'Investment Velocity', unit: 'ratio', targetMin: 0, targetIdeal: 1, description: 'Capital deployment speed', metricType: 'completion' },
            { name: 'Days Sales Outstanding', unit: 'days', targetMin: 90, targetIdeal: 30, description: 'Collection speed', metricType: 'completion' },
            { name: 'Payback Period', unit: 'months', targetMin: 24, targetIdeal: 12, description: 'Investment recovery time', metricType: 'completion' }
        ],
        Ether: [
            { name: 'Financial Strategy Clarity', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Strategic alignment score', metricType: 'completion' },
            { name: 'Investor Confidence', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Stakeholder trust', metricType: 'survival' },
            { name: 'Long-term Value Creation', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Sustainable growth focus', metricType: 'completion' }
        ]
    },

    'Human Capital': {
        Earth: [
            { name: 'Total Headcount', unit: 'count', targetMin: 1, targetIdeal: 100, description: 'Number of employees', metricType: 'survival' },
            { name: 'Core Team Stability', unit: 'percentage', targetMin: 60, targetIdeal: 90, description: 'Retention of key staff', metricType: 'survival' },
            { name: 'Salary Competitiveness', unit: 'percentage', targetMin: 80, targetIdeal: 110, description: '% of market rate', metricType: 'completion' }
        ],
        Water: [
            { name: 'Employee Satisfaction', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Happiness survey score', metricType: 'survival' },
            { name: 'Talent Acquisition Rate', unit: 'percentage', targetMin: 0, targetIdeal: 20, description: 'New hire growth', metricType: 'growth' },
            { name: 'Career Progression Rate', unit: 'percentage', targetMin: 0, targetIdeal: 30, description: 'Internal promotions', metricType: 'growth' }
        ],
        Fire: [
            { name: 'Productivity per Employee', unit: 'currency_usd', targetMin: 0, targetIdeal: 200000, description: 'Revenue per FTE', metricType: 'growth' },
            { name: 'Training Investment', unit: 'currency_usd', targetMin: 0, targetIdeal: 5000, description: '$ per employee/year', metricType: 'completion' },
            { name: 'Innovation Output', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Ideas implemented', metricType: 'growth' }
        ],
        Air: [
            { name: 'Communication Quality', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Internal communication rating', metricType: 'completion' },
            { name: 'Collaboration Index', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Cross-team cooperation', metricType: 'completion' },
            { name: 'Time to Fill Position', unit: 'days', targetMin: 90, targetIdeal: 30, description: 'Hiring speed', metricType: 'completion' }
        ],
        Ether: [
            { name: 'Cultural Alignment', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Values coherence', metricType: 'survival' },
            { name: 'Purpose Clarity', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Mission understanding', metricType: 'completion' },
            { name: 'Psychological Safety', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Trust & openness', metricType: 'survival' }
        ]
    },

    'Customer Experience': {
        Earth: [
            { name: 'Customer Base Size', unit: 'count', targetMin: 0, targetIdeal: 10000, description: 'Total customers' },
            { name: 'Customer Retention Rate', unit: 'percentage', targetMin: 60, targetIdeal: 95, description: 'Annual retention' },
            { name: 'Support Infrastructure', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Support capacity' }
        ],
        Water: [
            { name: 'Customer Satisfaction (CSAT)', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Satisfaction score' },
            { name: 'Net Promoter Score (NPS)', unit: 'number', targetMin: -100, targetIdeal: 70, description: 'Recommendation likelihood' },
            { name: 'Customer Engagement', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Active usage rate' }
        ],
        Fire: [
            { name: 'Customer Lifetime Value', unit: 'currency_usd', targetMin: 0, targetIdeal: 10000, description: 'LTV per customer' },
            { name: 'Upsell Rate', unit: 'percentage', targetMin: 0, targetIdeal: 30, description: 'Expansion revenue' },
            { name: 'Customer Success Impact', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Value delivered' }
        ],
        Air: [
            { name: 'Response Time', unit: 'hours', targetMin: 48, targetIdeal: 2, description: 'Average support response' },
            { name: 'Resolution Speed', unit: 'days', targetMin: 14, targetIdeal: 1, description: 'Issue resolution time' },
            { name: 'Feedback Loop Velocity', unit: 'days', targetMin: 30, targetIdeal: 7, description: 'Feedback to action' }
        ],
        Ether: [
            { name: 'Customer-Centricity Score', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Cultural focus on customers' },
            { name: 'Brand Love', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Emotional connection' },
            { name: 'Mission Resonance', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Purpose alignment' }
        ]
    },

    'Operations & Execution': {
        Earth: [
            { name: 'Process Documentation', unit: 'percentage', targetMin: 0, targetIdeal: 90, description: '% of processes documented' },
            { name: 'Infrastructure Stability', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'System reliability' },
            { name: 'Capacity Utilization', unit: 'percentage', targetMin: 40, targetIdeal: 80, description: 'Resource usage' }
        ],
        Water: [
            { name: 'Throughput Growth', unit: 'percentage', targetMin: 0, targetIdeal: 20, description: 'Output increase rate' },
            { name: 'Process Improvement Rate', unit: 'percentage', targetMin: 0, targetIdeal: 15, description: 'Efficiency gains' },
            { name: 'Adaptability Score', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Change readiness' }
        ],
        Fire: [
            { name: 'Operational Efficiency', unit: 'percentage', targetMin: 60, targetIdeal: 95, description: 'Process efficiency' },
            { name: 'Cost per Unit', unit: 'currency_usd', targetMin: 100, targetIdeal: 10, description: 'Unit economics' },
            { name: 'Quality Score', unit: 'percentage', targetMin: 90, targetIdeal: 99, description: 'Output quality' }
        ],
        Air: [
            { name: 'Cycle Time', unit: 'days', targetMin: 30, targetIdeal: 7, description: 'Process completion speed' },
            { name: 'Cross-functional Flow', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Inter-department efficiency' },
            { name: 'Automation Level', unit: 'percentage', targetMin: 0, targetIdeal: 60, description: 'Automated processes' }
        ],
        Ether: [
            { name: 'Strategic Execution Alignment', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Strategy-execution fit' },
            { name: 'Excellence Culture', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Quality mindset' },
            { name: 'Continuous Improvement', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Kaizen culture' }
        ]
    },

    // Project Management Template
    'Scope & Requirements': {
        Earth: [
            { name: 'Requirements Documented', unit: 'percentage', targetMin: 60, targetIdeal: 100, description: '% of requirements captured' },
            { name: 'Baseline Stability', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Scope baseline firmness' },
            { name: 'Acceptance Criteria Defined', unit: 'percentage', targetMin: 50, targetIdeal: 100, description: '% with clear criteria' }
        ],
        Water: [
            { name: 'Requirements Volatility', unit: 'percentage', targetMin: 50, targetIdeal: 5, description: 'Change rate (lower is better)' },
            { name: 'Stakeholder Feedback Rate', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Continuous input quality' },
            { name: 'Requirement Evolution', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Healthy refinement' }
        ],
        Fire: [
            { name: 'Requirements Quality', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Clarity and completeness' },
            { name: 'Scope Creep Impact', unit: 'percentage', targetMin: 50, targetIdeal: 0, description: 'Unauthorized changes' },
            { name: 'Value Alignment', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Requirements-value fit' }
        ],
        Air: [
            { name: 'Requirements Review Cycle', unit: 'days', targetMin: 30, targetIdeal: 7, description: 'Review frequency' },
            { name: 'Traceability', unit: 'percentage', targetMin: 50, targetIdeal: 100, description: 'Requirement to deliverable link' },
            { name: 'Communication Clarity', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Shared understanding' }
        ],
        Ether: [
            { name: 'Strategic Alignment', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Business objective fit' },
            { name: 'Vision Clarity', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'End goal understanding' },
            { name: 'Purpose-Driven Scope', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Why behind what' }
        ]
    },

    'Timeline & Milestones': {
        Earth: [
            { name: 'Schedule Baseline', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Plan stability' },
            { name: 'Milestone Count', unit: 'count', targetMin: 0, targetIdeal: 12, description: 'Key checkpoints defined' },
            { name: 'Buffer Allocation', unit: 'percentage', targetMin: 0, targetIdeal: 20, description: 'Schedule contingency' }
        ],
        Water: [
            { name: 'Schedule Adherence', unit: 'percentage', targetMin: 50, targetIdeal: 95, description: 'On-time delivery rate' },
            { name: 'Timeline Adjustments', unit: 'count', targetMin: 10, targetIdeal: 2, description: 'Baseline changes' },
            { name: 'Velocity Trend', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Delivery speed trend' }
        ],
        Fire: [
            { name: 'Critical Path Health', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Critical tasks on track' },
            { name: 'Milestone Achievement Rate', unit: 'percentage', targetMin: 50, targetIdeal: 100, description: 'Milestones hit' },
            { name: 'Delivery Efficiency', unit: 'percentage', targetMin: 60, targetIdeal: 95, description: 'Planned vs actual' }
        ],
        Air: [
            { name: 'Fast-tracking Capability', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Ability to accelerate' },
            { name: 'Schedule Communication', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Timeline transparency' },
            { name: 'Lead Time', unit: 'days', targetMin: 90, targetIdeal: 30, description: 'Planning horizon' }
        ],
        Ether: [
            { name: 'Timeline Realism', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Achievable goals' },
            { name: 'Long-term Vision', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Beyond current project' },
            { name: 'Time Value Optimization', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Value delivery timing' }
        ]
    },

    'Budget & Resources': {
        Earth: [
            { name: 'Budget Allocated', unit: 'currency_usd', targetMin: 0, targetIdeal: 1000000, description: 'Total project budget' },
            { name: 'Resource Availability', unit: 'percentage', targetMin: 50, targetIdeal: 100, description: 'Resources secured' },
            { name: 'Reserve Fund', unit: 'percentage', targetMin: 0, targetIdeal: 15, description: 'Contingency buffer' }
        ],
        Water: [
            { name: 'Budget Variance', unit: 'percentage', targetMin: 30, targetIdeal: 5, description: 'Planned vs actual spend' },
            { name: 'Burn Rate', unit: 'currency_usd', targetMin: 100000, targetIdeal: 50000, description: 'Monthly spend rate' },
            { name: 'Resource Utilization', unit: 'percentage', targetMin: 40, targetIdeal: 85, description: 'Productive capacity' }
        ],
        Fire: [
            { name: 'Cost Performance Index (CPI)', unit: 'ratio', targetMin: 0.8, targetIdeal: 1.2, description: 'Cost efficiency' },
            { name: 'ROI Projection', unit: 'percentage', targetMin: 0, targetIdeal: 200, description: 'Expected return' },
            { name: 'Value per Dollar', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Budget effectiveness' }
        ],
        Air: [
            { name: 'Budget Approval Speed', unit: 'days', targetMin: 30, targetIdeal: 3, description: 'Financial decision speed' },
            { name: 'Resource Allocation Agility', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Reallocation ease' },
            { name: 'Procurement Velocity', unit: 'days', targetMin: 60, targetIdeal: 14, description: 'Purchase cycle time' }
        ],
        Ether: [
            { name: 'Strategic Investment Alignment', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Budget-strategy fit' },
            { name: 'Financial Stewardship', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Responsible spending' },
            { name: 'Long-term Value Focus', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Beyond immediate costs' }
        ]
    },

    'Team Performance': {
        Earth: [
            { name: 'Team Size', unit: 'count', targetMin: 1, targetIdeal: 10, description: 'Core team members' },
            { name: 'Team Stability', unit: 'percentage', targetMin: 60, targetIdeal: 95, description: 'Team retention' },
            { name: 'Skills Coverage', unit: 'percentage', targetMin: 50, targetIdeal: 100, description: 'Required skills present' }
        ],
        Water: [
            { name: 'Team Morale', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Team satisfaction' },
            { name: 'Collaboration Quality', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Teamwork effectiveness' },
            { name: 'Capacity Flexibility', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Adaptability' }
        ],
        Fire: [
            { name: 'Team Productivity', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Output per person' },
            { name: 'Velocity', unit: 'number', targetMin: 0, targetIdeal: 50, description: 'Story points per sprint' },
            { name: 'Quality of Output', unit: 'percentage', targetMin: 70, targetIdeal: 98, description: 'Defect-free delivery' }
        ],
        Air: [
            { name: 'Communication Effectiveness', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Information flow' },
            { name: 'Decision Speed', unit: 'days', targetMin: 14, targetIdeal: 1, description: 'Time to decision' },
            { name: 'Response Time', unit: 'hours', targetMin: 48, targetIdeal: 4, description: 'Issue response speed' }
        ],
        Ether: [
            { name: 'Purpose Alignment', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Shared mission' },
            { name: 'Team Empowerment', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Autonomy and trust' },
            { name: 'Growth Mindset', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Learning culture' }
        ]
    },

    'Stakeholder Engagement': {
        Earth: [
            { name: 'Stakeholder Count', unit: 'count', targetMin: 1, targetIdeal: 20, description: 'Key stakeholders identified' },
            { name: 'Engagement Plan', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Plan completeness' },
            { name: 'Communication Channels', unit: 'count', targetMin: 1, targetIdeal: 5, description: 'Active channels' }
        ],
        Water: [
            { name: 'Stakeholder Satisfaction', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Overall satisfaction' },
            { name: 'Engagement Frequency', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Regular interaction' },
            { name: 'Feedback Integration', unit: 'percentage', targetMin: 30, targetIdeal: 80, description: 'Feedback acted upon' }
        ],
        Fire: [
            { name: 'Influence Impact', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Stakeholder advocacy' },
            { name: 'Support Level', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Active support' },
            { name: 'Conflict Resolution', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Issue management' }
        ],
        Air: [
            { name: 'Communication Speed', unit: 'hours', targetMin: 72, targetIdeal: 8, description: 'Update frequency' },
            { name: 'Information Transparency', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Openness level' },
            { name: 'Meeting Efficiency', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Productive meetings' }
        ],
        Ether: [
            { name: 'Trust Level', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Stakeholder trust' },
            { name: 'Value Alignment', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Shared values' },
            { name: 'Long-term Partnership', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Beyond project' }
        ]
    },

    'Quality Standards': {
        Earth: [
            { name: 'Quality Plan Documented', unit: 'percentage', targetMin: 50, targetIdeal: 100, description: 'Plan completeness' },
            { name: 'Standards Defined', unit: 'count', targetMin: 0, targetIdeal: 10, description: 'Quality criteria count' },
            { name: 'Testing Infrastructure', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Test capability' }
        ],
        Water: [
            { name: 'Quality Trend', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Improving quality' },
            { name: 'Defect Discovery Rate', unit: 'percentage', targetMin: 10, targetIdeal: 95, description: 'Bugs found pre-release' },
            { name: 'Customer Satisfaction', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Quality perception' }
        ],
        Fire: [
            { name: 'Defect Density', unit: 'number', targetMin: 50, targetIdeal: 2, description: 'Defects per 1000 LOC' },
            { name: 'First-time Pass Rate', unit: 'percentage', targetMin: 50, targetIdeal: 95, description: 'Right first time' },
            { name: 'Quality Metrics Met', unit: 'percentage', targetMin: 60, targetIdeal: 100, description: 'Standards achieved' }
        ],
        Air: [
            { name: 'Test Cycle Time', unit: 'days', targetMin: 14, targetIdeal: 2, description: 'Testing speed' },
            { name: 'Issue Resolution Time', unit: 'days', targetMin: 30, targetIdeal: 3, description: 'Defect fix speed' },
            { name: 'Quality Feedback Loop', unit: 'days', targetMin: 14, targetIdeal: 1, description: 'Quality to action' }
        ],
        Ether: [
            { name: 'Quality Culture', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Quality mindset' },
            { name: 'Excellence Pursuit', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Continuous improvement' },
            { name: 'Craft Pride', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Pride in work' }
        ]
    },

    'Risk Management': {
        Earth: [
            { name: 'Identified Risks', unit: 'count', targetMin: 0, targetIdeal: 20, description: 'Known risks logged' },
            { name: 'Risk Register Completeness', unit: 'percentage', targetMin: 50, targetIdeal: 100, description: 'Documentation level' },
            { name: 'Mitigation Plans', unit: 'percentage', targetMin: 40, targetIdeal: 100, description: 'Risks with plans' }
        ],
        Water: [
            { name: 'Risk Velocity', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Risk identification rate' },
            { name: 'Risk Trend', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Improving or worsening' },
            { name: 'Issue Conversion Rate', unit: 'percentage', targetMin: 50, targetIdeal: 5, description: 'Risks becoming issues' }
        ],
        Fire: [
            { name: 'Risk Exposure', unit: 'currency_usd', targetMin: 1000000, targetIdeal: 10000, description: 'Total risk value' },
            { name: 'Mitigation Effectiveness', unit: 'percentage', targetMin: 30, targetIdeal: 90, description: 'Risk reduction' },
            { name: 'Contingency Utilization', unit: 'percentage', targetMin: 100, targetIdeal: 20, description: 'Reserve usage' }
        ],
        Air: [
            { name: 'Risk Response Time', unit: 'days', targetMin: 30, targetIdeal: 3, description: 'Issue response speed' },
            { name: 'Risk Communication', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Transparency level' },
            { name: 'Early Warning System', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Proactive detection' }
        ],
        Ether: [
            { name: 'Risk Culture', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Risk awareness mindset' },
            { name: 'Strategic Risk Alignment', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Risk appetite fit' },
            { name: 'Resilience Mindset', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Antifragility' }
        ]
    },

    'Change Control': {
        Earth: [
            { name: 'Change Process Defined', unit: 'percentage', targetMin: 50, targetIdeal: 100, description: 'Process documentation' },
            { name: 'Change Board Established', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Governance structure' },
            { name: 'Baseline Documents', unit: 'percentage', targetMin: 50, targetIdeal: 100, description: 'Baselines set' }
        ],
        Water: [
            { name: 'Change Request Rate', unit: 'count', targetMin: 50, targetIdeal: 5, description: 'Monthly change requests' },
            { name: 'Change Approval Rate', unit: 'percentage', targetMin: 10, targetIdeal: 60, description: 'Approved changes' },
            { name: 'Adaptability', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Change responsiveness' }
        ],
        Fire: [
            { name: 'Change Impact Assessment', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Impact analysis quality' },
            { name: 'Approved Change Value', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Value of changes' },
            { name: 'Change Implementation Success', unit: 'percentage', targetMin: 50, targetIdeal: 95, description: 'Successful changes' }
        ],
        Air: [
            { name: 'Change Decision Speed', unit: 'days', targetMin: 30, targetIdeal: 5, description: 'Approval cycle time' },
            { name: 'Change Communication', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Notification effectiveness' },
            { name: 'Process Agility', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Flexible process' }
        ],
        Ether: [
            { name: 'Change Philosophy', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Positive change mindset' },
            { name: 'Strategic Change Alignment', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Changes support vision' },
            { name: 'Continuous Improvement', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Evolution culture' }
        ]
    },

    'Dependencies & Integration': {
        Earth: [
            { name: 'Dependencies Mapped', unit: 'percentage', targetMin: 40, targetIdeal: 100, description: 'Known dependencies' },
            { name: 'Integration Points', unit: 'count', targetMin: 0, targetIdeal: 10, description: 'Connection points' },
            { name: 'Interface Documentation', unit: 'percentage', targetMin: 50, targetIdeal: 100, description: 'Documented interfaces' }
        ],
        Water: [
            { name: 'Dependency Health', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'External health' },
            { name: 'Integration Stability', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Connection reliability' },
            { name: 'Cross-team Collaboration', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Team coordination' }
        ],
        Fire: [
            { name: 'Integration Success Rate', unit: 'percentage', targetMin: 50, targetIdeal: 98, description: 'Successful integrations' },
            { name: 'Dependency Impact', unit: 'score', targetMin: 10, targetIdeal: 2, description: 'Blocking frequency' },
            { name: 'Synergy Achievement', unit: 'score', targetMin: 0, targetIdeal: 10, description: '1+1=3 effect' }
        ],
        Air: [
            { name: 'Integration Speed', unit: 'days', targetMin: 30, targetIdeal: 5, description: 'Connection time' },
            { name: 'Cross-functional Flow', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Information flow' },
            { name: 'Dependency Resolution Time', unit: 'days', targetMin: 30, targetIdeal: 3, description: 'Issue resolution' }
        ],
        Ether: [
            { name: 'Systems Thinking', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Holistic perspective' },
            { name: 'Partnership Mindset', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Collaborative culture' },
            { name: 'Ecosystem Awareness', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Broader context' }
        ]
    },

    'Technical Delivery': {
        Earth: [
            { name: 'Technical Architecture', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Architecture quality' },
            { name: 'Infrastructure Capacity', unit: 'percentage', targetMin: 50, targetIdeal: 150, description: 'Available capacity' },
            { name: 'Technical Debt', unit: 'days', targetMin: 90, targetIdeal: 10, description: 'Debt in person-days' }
        ],
        Water: [
            { name: 'Deployment Frequency', unit: 'count', targetMin: 1, targetIdeal: 30, description: 'Deployments per month' },
            { name: 'Feature Delivery Rate', unit: 'count', targetMin: 1, targetIdeal: 20, description: 'Features per sprint' },
            { name: 'Technical Adaptability', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Tech flexibility' }
        ],
        Fire: [
            { name: 'System Performance', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Speed & efficiency' },
            { name: 'Uptime', unit: 'percentage', targetMin: 95, targetIdeal: 99.99, description: 'System availability' },
            { name: 'Code Quality Score', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Code excellence' }
        ],
        Air: [
            { name: 'Build Time', unit: 'minutes', targetMin: 60, targetIdeal: 5, description: 'CI/CD speed' },
            { name: 'Lead Time for Changes', unit: 'days', targetMin: 30, targetIdeal: 1, description: 'Code to production' },
            { name: 'Mean Time to Recovery', unit: 'hours', targetMin: 24, targetIdeal: 1, description: 'Incident recovery' }
        ],
        Ether: [
            { name: 'Technical Vision', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Tech strategy clarity' },
            { name: 'Innovation Culture', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Technical creativity' },
            { name: 'Craftsmanship Pride', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Engineering excellence' }
        ]
    },

    'Knowledge Transfer': {
        Earth: [
            { name: 'Documentation Coverage', unit: 'percentage', targetMin: 40, targetIdeal: 90, description: '% of project documented' },
            { name: 'Knowledge Base Articles', unit: 'count', targetMin: 0, targetIdeal: 50, description: 'Documented knowledge' },
            { name: 'Training Materials', unit: 'count', targetMin: 0, targetIdeal: 10, description: 'Training resources' }
        ],
        Water: [
            { name: 'Knowledge Sharing Frequency', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Regular sharing' },
            { name: 'Learning Culture', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Growth mindset' },
            { name: 'Cross-training Level', unit: 'percentage', targetMin: 20, targetIdeal: 80, description: 'Skill redundancy' }
        ],
        Fire: [
            { name: 'Knowledge Retention', unit: 'percentage', targetMin: 40, targetIdeal: 95, description: 'Knowledge preserved' },
            { name: 'Training Effectiveness', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Learning impact' },
            { name: 'Expertise Distribution', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Spread of knowledge' }
        ],
        Air: [
            { name: 'Documentation Speed', unit: 'days', targetMin: 30, targetIdeal: 1, description: 'Capture to document' },
            { name: 'Knowledge Accessibility', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Easy to find' },
            { name: 'Communication Channels', unit: 'count', targetMin: 1, targetIdeal: 5, description: 'Knowledge pathways' }
        ],
        Ether: [
            { name: 'Wisdom Cultivation', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Deep understanding' },
            { name: 'Legacy Building', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Future-focused' },
            { name: 'Learning Organization', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Organizational learning' }
        ]
    },

    'Value Realization': {
        Earth: [
            { name: 'Benefits Identified', unit: 'count', targetMin: 1, targetIdeal: 10, description: 'Expected benefits' },
            { name: 'Success Metrics Defined', unit: 'count', targetMin: 1, targetIdeal: 8, description: 'Value measures' },
            { name: 'Baseline Measurements', unit: 'percentage', targetMin: 40, targetIdeal: 100, description: 'Before metrics' }
        ],
        Water: [
            { name: 'Value Delivery Rate', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Incremental value' },
            { name: 'Benefits Tracking', unit: 'percentage', targetMin: 30, targetIdeal: 100, description: 'Monitored benefits' },
            { name: 'Stakeholder Value Perception', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Perceived value' }
        ],
        Fire: [
            { name: 'ROI Achieved', unit: 'percentage', targetMin: 0, targetIdeal: 200, description: 'Return on investment' },
            { name: 'Benefits Realized', unit: 'percentage', targetMin: 30, targetIdeal: 120, description: 'vs planned benefits' },
            { name: 'Business Impact', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Organizational impact' }
        ],
        Air: [
            { name: 'Time to Value', unit: 'months', targetMin: 24, targetIdeal: 3, description: 'Benefits realization time' },
            { name: 'Value Communication', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Value storytelling' },
            { name: 'Early Wins', unit: 'count', targetMin: 0, targetIdeal: 5, description: 'Quick value delivered' }
        ],
        Ether: [
            { name: 'Purpose Fulfillment', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Mission achievement' },
            { name: 'Transformational Impact', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Meaningful change' },
            { name: 'Legacy Value', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Lasting contribution' }
        ]
    },

    // Generic fallback for any face
    // NOTE: metricType determines the κ curvature applied to normalize KPI scores:
    //   - 'survival' (κ=0.618): Early gains matter more - forgiving curve
    //   - 'growth' (κ=1.618): Late gains compound - demanding curve
    //   - 'completion' (κ=1.0): Linear progress - default
    'Generic': {
        Earth: [
            { name: 'Foundation Strength', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Structural stability', metricType: 'survival' },
            { name: 'Resource Availability', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Available capacity', metricType: 'survival' }
        ],
        Water: [
            { name: 'Growth Rate', unit: 'percentage', targetMin: 0, targetIdeal: 20, description: 'Rate of change', metricType: 'growth' },
            { name: 'Adaptability', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Flexibility', metricType: 'completion' }
        ],
        Fire: [
            { name: 'Performance Level', unit: 'percentage', targetMin: 60, targetIdeal: 95, description: 'Output quality', metricType: 'growth' },
            { name: 'Impact', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Effect magnitude', metricType: 'growth' }
        ],
        Air: [
            { name: 'Speed', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Velocity', metricType: 'completion' },
            { name: 'Connectivity', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Integration level', metricType: 'completion' }
        ],
        Ether: [
            { name: 'Strategic Alignment', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Purpose fit', metricType: 'completion' },
            { name: 'Vision Clarity', unit: 'score', targetMin: 0, targetIdeal: 10, description: 'Direction understanding', metricType: 'completion' }
        ]
    }
};

// ════════════════════════════════════════════════════════════════════════════
// SECTION 4: HELPER FUNCTIONS
// ════════════════════════════════════════════════════════════════════════════

/**
 * Get elemental description
 */
function getElementalWisdom(element) {
    return ELEMENTAL_WISDOM[element] || ELEMENTAL_WISDOM.Earth;
}

/**
 * Get KPI suggestions for a face and element
 */
function getKPISuggestions(faceName, element) {
    const suggestions = KPI_SUGGESTIONS[faceName] || KPI_SUGGESTIONS['Generic'];
    return suggestions[element] || suggestions.Earth || [];
}

/**
 * Get all unit types
 */
function getUnitTypes() {
    return UNIT_TYPES;
}

/**
 * Format value with unit
 */
function formatValueWithUnit(value, unit) {
    const unitInfo = UNIT_TYPES.find(u => u.value === unit);
    if (!unitInfo) return value;

    switch (unit) {
        case 'percentage':
            return `${value}%`;
        case 'currency_usd':
            return `$${value.toLocaleString()}`;
        case 'currency_eur':
            return `€${value.toLocaleString()}`;
        case 'months':
            return `${value} months`;
        case 'days':
            return `${value} days`;
        case 'score':
            return `${value}/10`;
        case 'hours':
            return `${value}h`;
        default:
            return value;
    }
}

// ════════════════════════════════════════════════════════════════════════════
// SECTION 4B: OCTAVE-AWARE HELPER FUNCTIONS
// ════════════════════════════════════════════════════════════════════════════

/**
 * Get octave wisdom for a specific octave level
 * @param {string} octave - Octave identifier (O1-O7)
 * @returns {Object} Octave wisdom object
 */
function getOctaveWisdom(octave) {
    return OCTAVE_WISDOM[octave] || OCTAVE_WISDOM.O4; // Default to balanced O4
}

/**
 * Get octave-weighted KPI suggestions
 * At different octaves, different elements matter more.
 * O1 (Survival) emphasizes Earth. O7 (Radiance) balances all.
 *
 * @param {string} faceName - The face domain name
 * @param {string} element - The element (Earth, Water, Fire, Air, Ether)
 * @param {string} octave - Octave level (O1-O7)
 * @returns {Array} Array of weighted KPI suggestions
 */
function getOctaveKPISuggestions(faceName, element, octave = 'O4') {
    const baseSuggestions = getKPISuggestions(faceName, element);
    const octaveInfo = getOctaveWisdom(octave);

    if (!baseSuggestions || !octaveInfo) return baseSuggestions;

    // Get the element emphasis for this octave
    const emphasis = octaveInfo.metricEmphasis[element] || 1.0;

    // Enrich suggestions with octave context
    return baseSuggestions.map(suggestion => ({
        ...suggestion,
        octaveRelevance: emphasis,
        octaveAdvice: emphasis > 1.2 ? `Critical at ${octaveInfo.name} stage` :
                      emphasis < 0.8 ? `Less urgent at ${octaveInfo.name} stage` :
                      `Standard priority at ${octaveInfo.name} stage`,
        recommendedMetricType: octaveInfo.kpiPriority,
        octaveContext: {
            name: octaveInfo.name,
            focus: octaveInfo.focus,
            tolerance: octaveInfo.tolerance
        }
    }));
}

/**
 * Get breath axis questions for a face at a specific octave
 * @param {string} faceName - The face name (must match BREATH_AXIS_WISDOM projections or receptions)
 * @param {string} octave - Octave level (O1-O7)
 * @returns {Object|null} Breath questions and context
 */
function getBreathAxisQuestion(faceName, octave = 'O4') {
    for (const [axisName, axis] of Object.entries(BREATH_AXIS_WISDOM)) {
        const octaveData = axis.octaves[octave];
        if (!octaveData) continue;

        if (axis.projection === faceName) {
            return {
                axis: axisName,
                role: 'projection',
                partner: axis.reception,
                breathName: octaveData.breathName,
                question: octaveData.exhale,
                direction: 'exhale'
            };
        }
        if (axis.reception === faceName) {
            return {
                axis: axisName,
                role: 'reception',
                partner: axis.projection,
                breathName: octaveData.breathName,
                question: octaveData.inhale,
                direction: 'inhale'
            };
        }
    }
    return null;
}

/**
 * Get complete breath axis wisdom for an axis at a specific octave
 * @param {string} axisName - Name of the breath axis
 * @param {string} octave - Octave level (O1-O7)
 * @returns {Object|null} Complete axis wisdom
 */
function getBreathAxisWisdom(axisName, octave = 'O4') {
    const axis = BREATH_AXIS_WISDOM[axisName];
    if (!axis) return null;

    const octaveData = axis.octaves[octave];
    if (!octaveData) return null;

    return {
        axis: axisName,
        projection: axis.projection,
        reception: axis.reception,
        octave,
        breathName: octaveData.breathName,
        exhaleQuestion: octaveData.exhale,
        inhaleQuestion: octaveData.inhale
    };
}

/**
 * Get all breath axes
 * @returns {Array} Array of breath axis names
 */
function getBreathAxes() {
    return Object.keys(BREATH_AXIS_WISDOM);
}

/**
 * Determine recommended octave-appropriate metric type
 * Lower octaves use forgiving (survival) curves
 * Higher octaves use demanding (growth) curves
 *
 * @param {string} octave - Octave level (O1-O7)
 * @returns {string} Recommended metric type
 */
function getOctaveMetricType(octave) {
    const octaveInfo = getOctaveWisdom(octave);
    return octaveInfo?.kpiPriority || 'completion';
}

/**
 * Get octave-specific reflection questions
 * @param {string} octave - Octave level (O1-O7)
 * @returns {Object} Questions for the octave
 */
function getOctaveQuestions(octave) {
    const octaveInfo = getOctaveWisdom(octave);
    return octaveInfo?.questions || {
        core: 'How are we doing?',
        celebration: 'What went well?',
        warning: 'What needs attention?'
    };
}

/**
 * Get all octaves as an array (for iteration)
 * @returns {Array} Array of octave objects with their keys
 */
function getAllOctaves() {
    return Object.entries(OCTAVE_WISDOM).map(([key, value]) => ({
        id: key,
        ...value
    }));
}

// ════════════════════════════════════════════════════════════════════════════
// SECTION 5: MODULE EXPORTS
// ════════════════════════════════════════════════════════════════════════════

// Browser export
window.KPILibrary = {
    // Core Constants
    ELEMENTAL_WISDOM,
    UNIT_TYPES,
    KPI_SUGGESTIONS,

    // Octave Wisdom Constants (NEW - Phase 1.5)
    OCTAVE_WISDOM,
    BREATH_AXIS_WISDOM,

    // Core Helper functions
    getElementalWisdom,
    getKPISuggestions,
    getUnitTypes,
    formatValueWithUnit,

    // Octave-Aware Helper functions (NEW - Phase 1.5)
    getOctaveWisdom,
    getOctaveKPISuggestions,
    getBreathAxisQuestion,
    getBreathAxisWisdom,
    getBreathAxes,
    getOctaveMetricType,
    getOctaveQuestions,
    getAllOctaves
};

// CommonJS export for Node.js/testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        // Core Constants
        ELEMENTAL_WISDOM,
        UNIT_TYPES,
        KPI_SUGGESTIONS,

        // Octave Wisdom Constants (NEW - Phase 1.5)
        OCTAVE_WISDOM,
        BREATH_AXIS_WISDOM,

        // Core Helper functions
        getElementalWisdom,
        getKPISuggestions,
        getUnitTypes,
        formatValueWithUnit,

        // Octave-Aware Helper functions (NEW - Phase 1.5)
        getOctaveWisdom,
        getOctaveKPISuggestions,
        getBreathAxisQuestion,
        getBreathAxisWisdom,
        getBreathAxes,
        getOctaveMetricType,
        getOctaveQuestions,
        getAllOctaves
    };
}

// ════════════════════════════════════════════════════════════════════════════
// MODULE LOADED
// ════════════════════════════════════════════════════════════════════════════
console.log('📚 KPI Library loaded - Elemental wisdom and smart suggestions');
console.log('   ELEMENTAL_WISDOM: 5 elements with archetypes');
console.log('   KPI_SUGGESTIONS: Contextual suggestions by face & element');
console.log('   Remember: This SUGGESTS, the CSV/JSON DEFINES');
