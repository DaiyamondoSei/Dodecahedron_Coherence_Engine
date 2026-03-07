/**
 * Company Templates Bundle - Offline Support
 *
 * This file contains embedded company templates for offline/file:// protocol support.
 * When fetch() fails (e.g., when opening HTML directly without a server),
 * the demo orchestrator will fall back to these embedded templates.
 */

window.CompanyTemplatesBundle = {
    // Minimal embedded templates for offline demo
    templates: {
        'quannex': {
            companyId: 'quannex',
            displayName: 'Quannex',
            tagline: 'Organizational DNA Visualization Platform',
            octaveStage: 'O1-O2',
            dominantOctave: 1,
            archetype: 'startup',
            dominantBreathName: 'The Breath of Viability',
            mode: 'quick',
            faces: [
                { id: 1, baseName: 'Financial Capital', customName: 'Seed Runway', icon: '💰', octave: 1, sentiment: 0.24 },
                { id: 2, baseName: 'Intellectual Capital', customName: 'Thesis Framework', icon: '💡', octave: 2, sentiment: 0.40 },
                { id: 3, baseName: 'Human Capital', customName: 'Founder Energy', icon: '👥', octave: 1, sentiment: 0.17 },
                { id: 4, baseName: 'Structural Capital', customName: 'Governance Foundation', icon: '🏛️', octave: 1, sentiment: 0.24 },
                { id: 5, baseName: 'Market Resonance', customName: 'Problem Validation', icon: '🎯', octave: 2, sentiment: 0.58 },
                { id: 6, baseName: 'Community & Partners', customName: 'Network Embryo', icon: '🤝', octave: 1, sentiment: 0.35 },
                { id: 7, baseName: 'Brand & Reputation', customName: 'Nascent Brand', icon: '🌟', octave: 1, sentiment: 0.20 },
                { id: 8, baseName: 'Core Operations', customName: 'Prototype State', icon: '⚙️', octave: 2, sentiment: 0.65 },
                { id: 9, baseName: 'Regenerative Flow', customName: 'Learning Mode', icon: '🔄', octave: 2, sentiment: 0.72 },
                { id: 10, baseName: 'Foundational Values', customName: 'Vision Clarity', icon: '💎', octave: 3, sentiment: 0.85 },
                { id: 11, baseName: 'Funding Pipeline', customName: 'Investor Readiness', icon: '💼', octave: 1, sentiment: 0.30 },
                { id: 12, baseName: 'Risk & Resilience', customName: 'Founder Resilience', icon: '🛡️', octave: 1, sentiment: 0.55 }
            ],
            kpis: {
                face1: [{ id: 'K1_1', name: 'Cash Runway', value: 28000, unit: 'USD', target: 150000 }],
                face2: [{ id: 'K2_1', name: 'Thesis Completion', value: 61, unit: 'percent', target: 100 }],
                face3: [{ id: 'K3_1', name: 'Founder Energy', value: 5.4, unit: 'score', target: 8 }],
                face4: [{ id: 'K4_1', name: 'Docs Completion', value: 37, unit: 'percent', target: 100 }],
                face5: [{ id: 'K5_1', name: 'Problem Validation', value: 73, unit: 'percent', target: 90 }],
                face6: [{ id: 'K6_1', name: 'Network Connections', value: 12, unit: 'count', target: 50 }],
                face7: [{ id: 'K7_1', name: 'Brand Awareness', value: 8, unit: 'score', target: 50 }],
                face8: [{ id: 'K8_1', name: 'POC Progress', value: 65, unit: 'percent', target: 100 }],
                face9: [{ id: 'K9_1', name: 'Learning Velocity', value: 8.2, unit: 'score', target: 10 }],
                face10: [{ id: 'K10_1', name: 'Vision Alignment', value: 92, unit: 'percent', target: 100 }],
                face11: [{ id: 'K11_1', name: 'Pitch Readiness', value: 45, unit: 'percent', target: 100 }],
                face12: [{ id: 'K12_1', name: 'Resilience Score', value: 6.8, unit: 'score', target: 9 }]
            },
            diagnostics: { globalCoherence: 0.48 },
            // Sprint 3 Task 27: Breath axes for DNA helix visualization
            breathAxes: [
                { axis: 1, name: 'Resource Flow', breathName: 'The Breath of Viability', projectionQuestion: 'Are we actively seeking any resources to exist?', receptionQuestion: 'Do we have enough cash to survive?' },
                { axis: 2, name: 'Substance & Story', breathName: 'The Breath of Articulation', projectionQuestion: 'Do we have a basic, functional description of our idea?', receptionQuestion: 'Have we documented the core of the idea?' },
                { axis: 3, name: 'Being & Doing', breathName: 'The Breath of Sustainability', projectionQuestion: 'Is any work getting done?', receptionQuestion: 'Does the founder have the energy to exist?' },
                { axis: 4, name: 'Form & Integrity', breathName: 'The Breath of Intention', projectionQuestion: 'Do we have the basic legal forms to exist?', receptionQuestion: 'Are we making conscious, integrity-based choices?' },
                { axis: 5, name: 'Perception & Truth', breathName: 'The Breath of Clarity', projectionQuestion: 'Does the market understand our basic message?', receptionQuestion: 'Are our actions grounded in our core values?' },
                { axis: 6, name: 'Network & Fortress', breathName: 'The Breath of Support', projectionQuestion: 'Are we building a foundational support network?', receptionQuestion: 'Is our venture protected from a single point of failure?' }
            ],
            // Sprint 3 Task 28: Full edge data for 3D hover questions (30 canonical edges from dodecahedron-topology.js)
            edges: [
                { id: 'E1-2', faceIds: [1, 2], emergentName: 'Innovation Funding Bridge', elementalNature: 'Fire', theQuestion: 'How does our capital transform into valuable knowledge?', tension: 0.16 },
                { id: 'E1-6', faceIds: [1, 6], emergentName: 'Community Investment Flow', elementalNature: 'Water', theQuestion: 'How does capital flow to and from our community in a healthy way?', tension: 0.01 },
                { id: 'E1-7', faceIds: [1, 7], emergentName: 'Brand Capital Bridge', elementalNature: 'Air', theQuestion: 'How do we communicate our financial value and story?', tension: 0.03 },
                { id: 'E1-8', faceIds: [1, 8], emergentName: 'Operational Investment', elementalNature: 'Earth', theQuestion: 'How is our capital grounded in real, tangible operational work?', tension: 0.02 },
                { id: 'E1-10', faceIds: [1, 10], emergentName: 'Regenerative Capital Allocation', elementalNature: 'Ether', theQuestion: 'How does our capital serve the highest purpose of regeneration?', tension: 0.18 },
                { id: 'E2-3', faceIds: [2, 3], emergentName: 'Vision Embodiment', elementalNature: 'Air', theQuestion: 'How do our people\'s minds connect to create shared knowledge?', tension: 0.24 },
                { id: 'E2-6', faceIds: [2, 6], emergentName: 'Ecosystem Knowledge Flow', elementalNature: 'Water', theQuestion: 'How does our knowledge flow to our community? (Teaching)', tension: 0.15 },
                { id: 'E2-10', faceIds: [2, 10], emergentName: 'Ethical IP Foundation', elementalNature: 'Earth', theQuestion: 'Is our knowledge grounded in and aligned with our core values?', tension: 0.02 },
                { id: 'E2-11', faceIds: [2, 11], emergentName: 'IP Generosity Channel', elementalNature: 'Ether', theQuestion: 'Does our knowledge serve the highest purpose of regeneration?', tension: 0.28 },
                { id: 'E3-4', faceIds: [3, 4], emergentName: 'Embodied Governance', elementalNature: 'Earth', theQuestion: 'How is our human energy grounded and supported by our structures?', tension: 0.08 },
                { id: 'E3-6', faceIds: [3, 6], emergentName: 'Ecosystem Co-creation', elementalNature: 'Water', theQuestion: 'What is the emotional flow and quality of our human relationships?', tension: 0.08 },
                { id: 'E3-9', faceIds: [3, 9], emergentName: 'Cultural Integrity', elementalNature: 'Ether', theQuestion: 'How does our humanity serve and express our highest values?', tension: 0.27 },
                { id: 'E3-11', faceIds: [3, 11], emergentName: 'Founder-Funder Resonance', elementalNature: 'Fire', theQuestion: 'How does our human passion transform into the energy that attracts resources?', tension: 0.04 },
                { id: 'E4-5', faceIds: [4, 5], emergentName: 'Structural Resonance', elementalNature: 'Air', theQuestion: 'Do our structures help or hinder the clarity of our public message?', tension: 0.20 },
                { id: 'E4-6', faceIds: [4, 6], emergentName: 'Partnership Foundation', elementalNature: 'Earth', theQuestion: 'Are our partnerships grounded in clear, stable, formal agreements?', tension: 0.00 },
                { id: 'E4-7', faceIds: [4, 7], emergentName: 'Reputational Integrity', elementalNature: 'Ether', theQuestion: 'Does our structure embody the highest integrity of our brand?', tension: 0.04 },
                { id: 'E4-9', faceIds: [4, 9], emergentName: 'Investor Readiness', elementalNature: 'Fire', theQuestion: 'Can our structure transform to meet the needs of due diligence?', tension: 0.19 },
                { id: 'E5-7', faceIds: [5, 7], emergentName: 'Perception Integrity', elementalNature: 'Ether', theQuestion: 'Does our market resonance serve the highest purpose of our brand\'s truth?', tension: 0.16 },
                { id: 'E5-8', faceIds: [5, 8], emergentName: 'Brand-Experience Coherence', elementalNature: 'Fire', theQuestion: 'Does our market feedback transform into operational improvements?', tension: 0.17 },
                { id: 'E5-9', faceIds: [5, 9], emergentName: 'Market Community Engagement', elementalNature: 'Water', theQuestion: 'Is there a healthy flow of conversation between our market and community?', tension: 0.39 },
                { id: 'E5-12', faceIds: [5, 12], emergentName: 'Reputational Resilience', elementalNature: 'Water', theQuestion: 'Is our brand a source of resilient, trust-based flow during a crisis?', tension: 0.15 },
                { id: 'E6-7', faceIds: [6, 7], emergentName: 'Brand Capitalization', elementalNature: 'Air', theQuestion: 'Do we clearly communicate our brand\'s power to potential funders?', tension: 0.04 },
                { id: 'E7-8', faceIds: [7, 8], emergentName: 'Brand-Operational Integrity', elementalNature: 'Fire', theQuestion: 'Does our brand promise transform into operational excellence?', tension: 0.01 },
                { id: 'E8-10', faceIds: [8, 10], emergentName: 'Process Regeneration', elementalNature: 'Water', theQuestion: 'Is there a healthy flow of regenerative practice within our operations?', tension: 0.20 },
                { id: 'E8-12', faceIds: [8, 12], emergentName: 'Operational Resilience', elementalNature: 'Air', theQuestion: 'Does operational clarity inform and reduce systemic risk?', tension: 0.02 },
                { id: 'E9-11', faceIds: [9, 11], emergentName: 'Values Embodiment Score', elementalNature: 'Earth', theQuestion: 'Is our regenerative impulse grounded in our core values?', tension: 0.31 },
                { id: 'E9-12', faceIds: [9, 12], emergentName: 'Regenerative Resilience', elementalNature: 'Fire', theQuestion: 'Does our regenerative practice transform into greater systemic resilience?', tension: 0.24 },
                { id: 'E10-11', faceIds: [10, 11], emergentName: 'Funding Alignment Index', elementalNature: 'Air', theQuestion: 'Do we clearly communicate our values to our capital partners?', tension: 0.29 },
                { id: 'E10-12', faceIds: [10, 12], emergentName: 'Ethical Resilience', elementalNature: 'Fire', theQuestion: 'Do our values transform into resilience during a crisis?', tension: 0.22 },
                { id: 'E11-12', faceIds: [11, 12], emergentName: 'Funding Diversification', elementalNature: 'Water', theQuestion: 'Does a healthy funding pipeline create a flow of resilience?', tension: 0.07 }
            ],
            // Sprint 3 Task 28: Full vertex data for 3D vortex visualization (20 vertices from mapping-context.json)
            vertices: [
                { id: 'V1', faceIds: [1, 2, 6], emergentName: 'Resourced Innovation Hub', vortexStrength: 0.12, classification: 'synergy_hub', tooltip: 'Where capital, knowledge, and humanity converge' },
                { id: 'V2', faceIds: [1, 2, 10], emergentName: 'Structural Foundation Point', vortexStrength: 0.08, classification: 'neutral', tooltip: 'Where resources, people, and structure meet' },
                { id: 'V3', faceIds: [1, 6, 7], emergentName: 'Market Structure Bridge', vortexStrength: 0.20, classification: 'hotspot', tooltip: 'CAUTION: Market clarity (0.05) drags down this vertex' },
                { id: 'V4', faceIds: [1, 7, 8], emergentName: 'Community Market Capital', vortexStrength: 0.15, classification: 'neutral', tooltip: 'Where financial, market, and community meet' },
                { id: 'V5', faceIds: [1, 8, 10], emergentName: 'Knowledge Capital Network', vortexStrength: 0.10, classification: 'synergy_hub', tooltip: 'Where intellectual capital flows to community' },
                { id: 'V6', faceIds: [2, 3, 6], emergentName: 'Team Learning Junction', vortexStrength: 0.11, classification: 'synergy_hub', tooltip: 'Where team learns together through operations' },
                { id: 'V7', faceIds: [2, 3, 11], emergentName: 'Human Governance Values', vortexStrength: 0.15, classification: 'neutral', tooltip: 'Where people, structure, and values intersect' },
                { id: 'V8', faceIds: [2, 10, 11], emergentName: 'Structural Truth Point', vortexStrength: 0.22, classification: 'hotspot', tooltip: 'CAUTION: Market clarity creates imbalance here' },
                { id: 'V9', faceIds: [3, 4, 6], emergentName: 'Network Market Pipeline', vortexStrength: 0.14, classification: 'neutral', tooltip: 'Where market, community, and funding meet' },
                { id: 'V10', faceIds: [3, 4, 9], emergentName: 'Knowledge Brand Community', vortexStrength: 0.08, classification: 'synergy_hub', tooltip: 'Where IP, partners, and brand converge' },
                { id: 'V11', faceIds: [3, 9, 11], emergentName: 'Brand Knowledge Operations', vortexStrength: 0.09, classification: 'synergy_hub', tooltip: 'Where thesis informs brand and operations' },
                { id: 'V12', faceIds: [4, 5, 7], emergentName: 'Human Operations Values', vortexStrength: 0.18, classification: 'neutral', tooltip: 'Where founder energy meets regenerative work' },
                { id: 'V13', faceIds: [4, 5, 9], emergentName: 'Governance Values Regeneration', vortexStrength: 0.10, classification: 'synergy_hub', tooltip: 'Strong values alignment at this vertex' },
                { id: 'V14', faceIds: [4, 6, 7], emergentName: 'Market Values Pipeline', vortexStrength: 0.25, classification: 'bermuda_triangle', tooltip: 'CRITICAL: Market weakness (0.05) creates severe imbalance' },
                { id: 'V15', faceIds: [5, 7, 8], emergentName: 'Community Brand Funding', vortexStrength: 0.12, classification: 'neutral', tooltip: 'Where network influences funding pursuit' },
                { id: 'V16', faceIds: [5, 8, 12], emergentName: 'Brand Operations Resilience', vortexStrength: 0.01, classification: 'synergy_hub', tooltip: 'EXCELLENT: Near-perfect balance between brand, ops, resilience' },
                { id: 'V17', faceIds: [5, 9, 12], emergentName: 'Operations Regeneration Resilience', vortexStrength: 0.16, classification: 'neutral', tooltip: 'Where daily work meets regenerative resilience' },
                { id: 'V18', faceIds: [8, 10, 12], emergentName: 'Values Regeneration Fortress', vortexStrength: 0.15, classification: 'neutral', tooltip: 'Where values and regeneration build resilience' },
                { id: 'V19', faceIds: [9, 11, 12], emergentName: 'Values Pipeline Resilience', vortexStrength: 0.20, classification: 'hotspot', tooltip: 'CAUTION: Weak funding pipeline creates strain' },
                { id: 'V20', faceIds: [10, 11, 12], emergentName: 'Brand Funding Fortress', vortexStrength: 0.05, classification: 'synergy_hub', tooltip: 'Brand and resilience support funding pursuit' }
            ],
            // Shadow patterns for deep organizational insight
            shadowPatterns: [
                { id: 'burnout-engine', name: 'Burnout Engine', suppressed: 'High intellectual intensity + Low human sustainability', integrated: 'Sustainable Brilliance - Wisdom that knows when to rest', severity: 'critical', involvedFaces: [2, 3, 8] },
                { id: 'lonely-hero', name: 'Lonely Hero', suppressed: 'Bus factor of 1 = Brilliant but fragile', integrated: 'Shared Genius - Brilliance that multiplies through others', severity: 'significant', involvedFaces: [3, 12] },
                { id: 'aspiration-actuality-gap', name: 'Aspiration-Actuality Gap', suppressed: 'Vision at O6-O7, execution at O1 - 4+ octave split', integrated: 'Grounded Vision - High ideals with feet on the earth', severity: 'significant', involvedFaces: [5, 9, 10, 11] }
            ]
        },

        'nova-tech': {
            companyId: 'nova-tech',
            displayName: 'Nova Tech',
            tagline: 'AI-Powered Marketing Platform',
            octaveStage: 'O1-O2',
            dominantOctave: 1,
            archetype: 'startup',
            dominantBreathName: 'The Breath of Viability',
            mode: 'quick',
            faces: [
                { id: 1, baseName: 'Financial Capital', customName: 'Death Spiral Cash', icon: '💸', octave: 1, sentiment: 0.08 },
                { id: 2, baseName: 'Intellectual Capital', customName: 'Brilliant Tech', icon: '🧠', octave: 3, sentiment: 0.75 },
                { id: 3, baseName: 'Human Capital', customName: 'Exhausted Team', icon: '😰', octave: 1, sentiment: 0.15 },
                { id: 4, baseName: 'Structural Capital', customName: 'Missing Foundation', icon: '🚧', octave: 1, sentiment: 0.12 },
                { id: 5, baseName: 'Market Resonance', customName: 'Unclear PMF', icon: '❓', octave: 1, sentiment: 0.22 },
                { id: 6, baseName: 'Community & Partners', customName: 'Isolated Island', icon: '🏝️', octave: 1, sentiment: 0.10 },
                { id: 7, baseName: 'Brand & Reputation', customName: 'Unknown Entity', icon: '👻', octave: 1, sentiment: 0.05 },
                { id: 8, baseName: 'Core Operations', customName: 'Chaos Mode', icon: '🌀', octave: 1, sentiment: 0.18 },
                { id: 9, baseName: 'Regenerative Flow', customName: 'Burning Out', icon: '🔥', octave: 1, sentiment: 0.08 },
                { id: 10, baseName: 'Foundational Values', customName: 'Strong Vision', icon: '🌟', octave: 2, sentiment: 0.55 },
                { id: 11, baseName: 'Funding Pipeline', customName: 'Desperate Search', icon: '🔍', octave: 1, sentiment: 0.15 },
                { id: 12, baseName: 'Risk & Resilience', customName: 'Fragile State', icon: '💔', octave: 1, sentiment: 0.12 }
            ],
            kpis: {
                face1: [{ id: 'K1_1', name: 'Cash Remaining', value: 28000, unit: 'USD', target: 200000 }],
                face2: [{ id: 'K2_1', name: 'Tech Innovation', value: 85, unit: 'percent', target: 100 }],
                face3: [{ id: 'K3_1', name: 'Team Energy', value: 3.2, unit: 'score', target: 8 }],
                face4: [{ id: 'K4_1', name: 'Process Maturity', value: 15, unit: 'percent', target: 80 }],
                face5: [{ id: 'K5_1', name: 'PMF Score', value: 2.8, unit: 'score', target: 8 }],
                face6: [{ id: 'K6_1', name: 'Partner Count', value: 1, unit: 'count', target: 10 }],
                face7: [{ id: 'K7_1', name: 'Brand Recognition', value: 2, unit: 'percent', target: 50 }],
                face8: [{ id: 'K8_1', name: 'Ops Efficiency', value: 25, unit: 'percent', target: 80 }],
                face9: [{ id: 'K9_1', name: 'Sustainability', value: 1.5, unit: 'score', target: 8 }],
                face10: [{ id: 'K10_1', name: 'Vision Clarity', value: 68, unit: 'percent', target: 90 }],
                face11: [{ id: 'K11_1', name: 'Pipeline Value', value: 50000, unit: 'USD', target: 500000 }],
                face12: [{ id: 'K12_1', name: 'Resilience', value: 2.8, unit: 'score', target: 8 }]
            },
            diagnostics: { globalCoherence: 0.23 },
            breathAxes: [
                { axis: 1, name: 'Resource Flow', breathName: 'The Breath of Viability', projectionQuestion: 'Are we actively seeking any resources to exist?', receptionQuestion: 'Do we have enough cash to survive?' },
                { axis: 2, name: 'Substance & Story', breathName: 'The Breath of Articulation', projectionQuestion: 'Do we have a basic, functional description of our idea?', receptionQuestion: 'Have we documented the core of the idea?' },
                { axis: 3, name: 'Being & Doing', breathName: 'The Breath of Sustainability', projectionQuestion: 'Is any work getting done?', receptionQuestion: 'Does the founder have the energy to exist?' },
                { axis: 4, name: 'Form & Integrity', breathName: 'The Breath of Intention', projectionQuestion: 'Do we have the basic legal forms to exist?', receptionQuestion: 'Are we making conscious, integrity-based choices?' },
                { axis: 5, name: 'Perception & Truth', breathName: 'The Breath of Clarity', projectionQuestion: 'Does the market understand our basic message?', receptionQuestion: 'Are our actions grounded in our core values?' },
                { axis: 6, name: 'Network & Fortress', breathName: 'The Breath of Support', projectionQuestion: 'Are we building a foundational support network?', receptionQuestion: 'Is our venture protected from a single point of failure?' }
            ],
            // 30 canonical edges from dodecahedron-topology.js
            edges: [
                { id: 'E1-2', faceIds: [1, 2], emergentName: 'IP Funding Crisis', elementalNature: 'Fire', theQuestion: 'How does our capital transform into valuable knowledge?', tension: 0.57 },
                { id: 'E1-6', faceIds: [1, 6], emergentName: 'Network Capital Gap', elementalNature: 'Water', theQuestion: 'How does capital flow to and from our community in a healthy way?', tension: 0.07 },
                { id: 'E1-7', faceIds: [1, 7], emergentName: 'Invisible Brand Bridge', elementalNature: 'Air', theQuestion: 'How do we communicate our financial value and story?', tension: 0.02 },
                { id: 'E1-8', faceIds: [1, 8], emergentName: 'Operations Underfunded', elementalNature: 'Earth', theQuestion: 'How is our capital grounded in real, tangible operational work?', tension: 0.27 },
                { id: 'E1-10', faceIds: [1, 10], emergentName: 'Values vs Survival', elementalNature: 'Ether', theQuestion: 'How does our capital serve the highest purpose of regeneration?', tension: 0.44 },
                { id: 'E2-3', faceIds: [2, 3], emergentName: 'Brilliance Burnout', elementalNature: 'Air', theQuestion: 'How do our people\'s minds connect to create shared knowledge?', tension: 0.53 },
                { id: 'E2-6', faceIds: [2, 6], emergentName: 'IP Sharing Potential', elementalNature: 'Water', theQuestion: 'How does our knowledge flow to our community? (Teaching)', tension: 0.50 },
                { id: 'E2-10', faceIds: [2, 10], emergentName: 'Purpose-Driven Innovation', elementalNature: 'Earth', theQuestion: 'Is our knowledge grounded in and aligned with our core values?', tension: 0.13 },
                { id: 'E2-11', faceIds: [2, 11], emergentName: 'IP as Pitch Asset', elementalNature: 'Ether', theQuestion: 'Does our knowledge serve the highest purpose of regeneration?', tension: 0.33 },
                { id: 'E3-4', faceIds: [3, 4], emergentName: 'Chaos Without Structure', elementalNature: 'Earth', theQuestion: 'How is our human energy grounded and supported by our structures?', tension: 0.06 },
                { id: 'E3-6', faceIds: [3, 6], emergentName: 'Isolated Founders', elementalNature: 'Water', theQuestion: 'What is the emotional flow and quality of our human relationships?', tension: 0.03 },
                { id: 'E3-9', faceIds: [3, 9], emergentName: 'Survival vs Values', elementalNature: 'Ether', theQuestion: 'How does our humanity serve and express our highest values?', tension: 0.08 },
                { id: 'E3-11', faceIds: [3, 11], emergentName: 'Desperate Pitch Energy', elementalNature: 'Fire', theQuestion: 'How does our human passion transform into the energy that attracts resources?', tension: 0.20 },
                { id: 'E4-5', faceIds: [4, 5], emergentName: 'Structure-Market Gap', elementalNature: 'Air', theQuestion: 'Do our structures help or hinder the clarity of our public message?', tension: 0.12 },
                { id: 'E4-6', faceIds: [4, 6], emergentName: 'Informal Partnerships', elementalNature: 'Earth', theQuestion: 'Are our partnerships grounded in clear, stable, formal agreements?', tension: 0.03 },
                { id: 'E4-7', faceIds: [4, 7], emergentName: 'Undocumented Brand', elementalNature: 'Ether', theQuestion: 'Does our structure embody the highest integrity of our brand?', tension: 0.08 },
                { id: 'E4-9', faceIds: [4, 9], emergentName: 'Structure for Survival', elementalNature: 'Fire', theQuestion: 'Can our structure transform to meet the needs of due diligence?', tension: 0.02 },
                { id: 'E5-7', faceIds: [5, 7], emergentName: 'Market Void', elementalNature: 'Ether', theQuestion: 'Does our market resonance serve the highest purpose of our brand\'s truth?', tension: 0.04 },
                { id: 'E5-8', faceIds: [5, 8], emergentName: 'Product Without Users', elementalNature: 'Fire', theQuestion: 'Does our market feedback transform into operational improvements?', tension: 0.29 },
                { id: 'E5-9', faceIds: [5, 9], emergentName: 'Market-Values Disconnect', elementalNature: 'Water', theQuestion: 'Is there a healthy flow of conversation between our market and community?', tension: 0.14 },
                { id: 'E5-12', faceIds: [5, 12], emergentName: 'Invisible Fragility', elementalNature: 'Water', theQuestion: 'Is our brand a source of resilient, trust-based flow during a crisis?', tension: 0.09 },
                { id: 'E6-7', faceIds: [6, 7], emergentName: 'Network-Brand Gap', elementalNature: 'Air', theQuestion: 'Do we clearly communicate our brand\'s power to potential funders?', tension: 0.05 },
                { id: 'E7-8', faceIds: [7, 8], emergentName: 'Product Without Brand', elementalNature: 'Fire', theQuestion: 'Does our brand promise transform into operational excellence?', tension: 0.25 },
                { id: 'E8-10', faceIds: [8, 10], emergentName: 'Purpose-Driven Ops', elementalNature: 'Water', theQuestion: 'Is there a healthy flow of regenerative practice within our operations?', tension: 0.17 },
                { id: 'E8-12', faceIds: [8, 12], emergentName: 'Operational Fragility', elementalNature: 'Air', theQuestion: 'Does operational clarity inform and reduce systemic risk?', tension: 0.20 },
                { id: 'E9-11', faceIds: [9, 11], emergentName: 'Survival vs Regeneration', elementalNature: 'Earth', theQuestion: 'Is our regenerative impulse grounded in our core values?', tension: 0.12 },
                { id: 'E9-12', faceIds: [9, 12], emergentName: 'Fragile Choices', elementalNature: 'Fire', theQuestion: 'Does our regenerative practice transform into greater systemic resilience?', tension: 0.05 },
                { id: 'E10-11', faceIds: [10, 11], emergentName: 'Values Pitch Alignment', elementalNature: 'Air', theQuestion: 'Do we clearly communicate our values to our capital partners?', tension: 0.20 },
                { id: 'E10-12', faceIds: [10, 12], emergentName: 'Values Under Pressure', elementalNature: 'Fire', theQuestion: 'Do our values transform into resilience during a crisis?', tension: 0.37 },
                { id: 'E11-12', faceIds: [11, 12], emergentName: 'Pipeline Fragility', elementalNature: 'Water', theQuestion: 'Does a healthy funding pipeline create a flow of resilience?', tension: 0.17 }
            ],
            // Full vertex data from mapping-context.json
            vertices: [
                { id: 'V1', faceIds: [1, 2, 6], emergentName: 'Brilliant Burnout Triangle', vortexStrength: 0.45, classification: 'bermuda_triangle', tooltip: 'CRITICAL: Strong IP (0.65) vs exhausted founders (0.12) vs no cash (0.08)' },
                { id: 'V2', faceIds: [1, 2, 10], emergentName: 'Structural Survival Point', vortexStrength: 0.08, classification: 'neutral', tooltip: 'All three faces struggling at survival level' },
                { id: 'V3', faceIds: [1, 6, 7], emergentName: 'Market Structure Gap', vortexStrength: 0.10, classification: 'neutral', tooltip: 'Market invisibility compounds structural weakness' },
                { id: 'V4', faceIds: [1, 7, 8], emergentName: 'Community Capital Void', vortexStrength: 0.07, classification: 'neutral', tooltip: 'Weak across all three survival dimensions' },
                { id: 'V5', faceIds: [1, 8, 10], emergentName: 'Innovation Without Support', vortexStrength: 0.40, classification: 'hotspot', tooltip: 'Strong IP isolated from funding and community' },
                { id: 'V6', faceIds: [2, 3, 6], emergentName: 'Burnout Engine Vertex', vortexStrength: 0.35, classification: 'bermuda_triangle', tooltip: 'CRITICAL: Founders pouring energy into IP at expense of health' },
                { id: 'V7', faceIds: [2, 3, 11], emergentName: 'Survival Values Junction', vortexStrength: 0.08, classification: 'neutral', tooltip: 'Trying to maintain values while surviving' },
                { id: 'V8', faceIds: [2, 10, 11], emergentName: 'Hidden Mission Point', vortexStrength: 0.35, classification: 'hotspot', tooltip: 'Strong values (0.52) but invisible to market (0.06)' },
                { id: 'V9', faceIds: [3, 4, 6], emergentName: 'Pipeline Visibility Gap', vortexStrength: 0.18, classification: 'neutral', tooltip: 'Fundraising without market presence' },
                { id: 'V10', faceIds: [3, 4, 9], emergentName: 'IP Brand Network', vortexStrength: 0.42, classification: 'hotspot', tooltip: 'Strong IP (0.65) completely invisible externally' },
                { id: 'V11', faceIds: [3, 9, 11], emergentName: 'Product Without Story', vortexStrength: 0.38, classification: 'hotspot', tooltip: 'Working product but no brand narrative' },
                { id: 'V12', faceIds: [4, 5, 7], emergentName: 'Exhausted Operations', vortexStrength: 0.15, classification: 'neutral', tooltip: 'Operations running on founder fumes' },
                { id: 'V13', faceIds: [4, 5, 9], emergentName: 'Values Structure Gap', vortexStrength: 0.26, classification: 'hotspot', tooltip: 'Clear values but uncodified structure' },
                { id: 'V14', faceIds: [4, 6, 7], emergentName: 'Mission Funding Bridge', vortexStrength: 0.35, classification: 'hotspot', tooltip: 'Strong mission (0.52) could attract aligned investors if visible' },
                { id: 'V15', faceIds: [5, 7, 8], emergentName: 'Network Pitch Junction', vortexStrength: 0.15, classification: 'neutral', tooltip: 'Building investor relationships slowly' },
                { id: 'V16', faceIds: [5, 8, 12], emergentName: 'Product Stability Point', vortexStrength: 0.15, classification: 'neutral', tooltip: '87.5% uptime threatening credibility' },
                { id: 'V17', faceIds: [5, 9, 12], emergentName: 'Operational Survival', vortexStrength: 0.12, classification: 'neutral', tooltip: 'Operations barely maintaining' },
                { id: 'V18', faceIds: [8, 10, 12], emergentName: 'Values Resilience Point', vortexStrength: 0.25, classification: 'neutral', tooltip: 'Values providing some psychological resilience' },
                { id: 'V19', faceIds: [9, 11, 12], emergentName: 'Mission Survival Triangle', vortexStrength: 0.28, classification: 'hotspot', tooltip: 'Can mission clarity attract the funding needed to survive?' },
                { id: 'V20', faceIds: [10, 11, 12], emergentName: 'Pitch Survival Point', vortexStrength: 0.18, classification: 'neutral', tooltip: '3.5/5 pitch deck quality - potential' }
            ],
            shadowPatterns: [
                { id: 'brilliant-burnout', name: 'Brilliant Burnout', suppressed: 'Exceptional IP creation rate + Exhausted founders', integrated: 'Sustainable Genius - Brilliance that renews rather than depletes', severity: 'critical', involvedFaces: [2, 3, 8] },
                { id: 'invisible-innovation', name: 'Invisible Innovation', suppressed: 'Working product + Zero market presence', integrated: 'Visible Value - Innovation that finds its audience', severity: 'significant', involvedFaces: [2, 5, 7] }
            ]
        },

        'zenith-solutions': {
            companyId: 'zenith-solutions',
            displayName: 'Zenith Solutions',
            tagline: 'Cloud Infrastructure Automation',
            octaveStage: 'O3-O4',
            dominantOctave: 4,
            archetype: 'scaleup',
            dominantBreathName: 'The Breath of Belonging',
            mode: 'quick',
            faces: [
                { id: 1, baseName: 'Financial Capital', customName: 'Growth Capital', icon: '💰', octave: 4, sentiment: 0.82 },
                { id: 2, baseName: 'Intellectual Capital', customName: 'Innovation Engine', icon: '💡', octave: 4, sentiment: 0.75 },
                { id: 3, baseName: 'Human Capital', customName: 'Stretched Team', icon: '👥', octave: 3, sentiment: 0.55 },
                { id: 4, baseName: 'Structural Capital', customName: 'Catching-Up Governance', icon: '🏛️', octave: 3, sentiment: 0.48 },
                { id: 5, baseName: 'Market Resonance', customName: 'Market Momentum', icon: '🎯', octave: 4, sentiment: 0.85 },
                { id: 6, baseName: 'Community & Partners', customName: 'Strategic Ecosystem', icon: '🤝', octave: 4, sentiment: 0.72 },
                { id: 7, baseName: 'Brand & Reputation', customName: 'Rising Brand', icon: '🌟', octave: 4, sentiment: 0.78 },
                { id: 8, baseName: 'Core Operations', customName: 'Operational Excellence', icon: '⚙️', octave: 4, sentiment: 0.88 },
                { id: 9, baseName: 'Regenerative Flow', customName: 'Sustainability Gap', icon: '🔄', octave: 2, sentiment: 0.35 },
                { id: 10, baseName: 'Foundational Values', customName: 'Purpose Alignment', icon: '💎', octave: 4, sentiment: 0.70 },
                { id: 11, baseName: 'Funding Pipeline', customName: 'Investor Confidence', icon: '💼', octave: 5, sentiment: 0.90 },
                { id: 12, baseName: 'Risk & Resilience', customName: 'Growing Fortress', icon: '🛡️', octave: 3, sentiment: 0.62 }
            ],
            kpis: {
                face1: [{ id: 'K1_1', name: 'ARR', value: 2800000, unit: 'USD', target: 5000000 }],
                face2: [{ id: 'K2_1', name: 'Patents Filed', value: 8, unit: 'count', target: 15 }],
                face3: [{ id: 'K3_1', name: 'Team Satisfaction', value: 6.8, unit: 'score', target: 8.5 }],
                face4: [{ id: 'K4_1', name: 'Process Maturity', value: 58, unit: 'percent', target: 85 }],
                face5: [{ id: 'K5_1', name: 'NPS Score', value: 52, unit: 'score', target: 70 }],
                face6: [{ id: 'K6_1', name: 'Partner Revenue', value: 35, unit: 'percent', target: 50 }],
                face7: [{ id: 'K7_1', name: 'Brand Recognition', value: 42, unit: 'percent', target: 60 }],
                face8: [{ id: 'K8_1', name: 'Uptime', value: 99.4, unit: 'percent', target: 99.9 }],
                face9: [{ id: 'K9_1', name: 'Carbon Footprint', value: 125, unit: 'tons', target: 50 }],
                face10: [{ id: 'K10_1', name: 'Values Alignment', value: 78, unit: 'percent', target: 90 }],
                face11: [{ id: 'K11_1', name: 'Series B Pipeline', value: 12000000, unit: 'USD', target: 15000000 }],
                face12: [{ id: 'K12_1', name: 'Risk Score', value: 7.2, unit: 'score', target: 8.5 }]
            },
            diagnostics: { globalCoherence: 0.68 },
            breathAxes: [
                { axis: 1, name: 'Resource Flow', breathName: 'The Breath of Integrity', projectionQuestion: 'Are we building trust with values-aligned funders?', receptionQuestion: 'Is our capital use creating stakeholder trust?' },
                { axis: 2, name: 'Substance & Story', breathName: 'The Breath of Authenticity', projectionQuestion: 'Does our brand story build community and trust?', receptionQuestion: 'Is our IP being co-created with our partners?' },
                { axis: 3, name: 'Being & Doing', breathName: 'The Breath of Belonging', projectionQuestion: 'Does our work feel collaborative and joyful?', receptionQuestion: 'Does our team feel safe and connected?' },
                { axis: 4, name: 'Form & Integrity', breathName: 'The Breath of Participation', projectionQuestion: 'Do our structures feel fair and empowering?', receptionQuestion: 'Are our relationships with our stakeholders regenerative?' },
                { axis: 5, name: 'Perception & Truth', breathName: 'The Breath of Loyalty', projectionQuestion: 'Are we building a loyal, trusting community?', receptionQuestion: 'Are our values lived in our daily relationships?' },
                { axis: 6, name: 'Network & Fortress', breathName: 'The Breath of Synergy', projectionQuestion: 'Are our partnerships deep and mutually supportive?', receptionQuestion: 'Is our resilience built on a foundation of trust?' }
            ],
            // 30 canonical edges from dodecahedron-topology.js
            edges: [
                { id: 'E1-2', faceIds: [1, 2], emergentName: 'Funded Innovation', elementalNature: 'Fire', theQuestion: 'How does our capital transform into valuable knowledge?', tension: 0.04 },
                { id: 'E1-6', faceIds: [1, 6], emergentName: 'Partner Investment Flow', elementalNature: 'Water', theQuestion: 'How does capital flow to and from our community in a healthy way?', tension: 0.03 },
                { id: 'E1-7', faceIds: [1, 7], emergentName: 'Brand Capital Story', elementalNature: 'Air', theQuestion: 'How do we communicate our financial value and story?', tension: 0.08 },
                { id: 'E1-8', faceIds: [1, 8], emergentName: 'Operational Investment', elementalNature: 'Earth', theQuestion: 'How is our capital grounded in real, tangible operational work?', tension: 0.00 },
                { id: 'E1-10', faceIds: [1, 10], emergentName: 'Values-Aligned Capital', elementalNature: 'Ether', theQuestion: 'How does our capital serve the highest purpose of regeneration?', tension: 0.10 },
                { id: 'E2-3', faceIds: [2, 3], emergentName: 'Team Innovation Capacity', elementalNature: 'Air', theQuestion: 'How do our people\'s minds connect to create shared knowledge?', tension: 0.27 },
                { id: 'E2-6', faceIds: [2, 6], emergentName: 'Partner Co-Innovation', elementalNature: 'Water', theQuestion: 'How does our knowledge flow to our community? (Teaching)', tension: 0.07 },
                { id: 'E2-10', faceIds: [2, 10], emergentName: 'Purpose-Driven IP', elementalNature: 'Earth', theQuestion: 'Is our knowledge grounded in and aligned with our core values?', tension: 0.14 },
                { id: 'E2-11', faceIds: [2, 11], emergentName: 'IP Investor Appeal', elementalNature: 'Ether', theQuestion: 'Does our knowledge serve the highest purpose of regeneration?', tension: 0.02 },
                { id: 'E3-4', faceIds: [3, 4], emergentName: 'Team-Structure Tension', elementalNature: 'Earth', theQuestion: 'How is our human energy grounded and supported by our structures?', tension: 0.07 },
                { id: 'E3-6', faceIds: [3, 6], emergentName: 'Team-Partner Relationships', elementalNature: 'Water', theQuestion: 'What is the emotional flow and quality of our human relationships?', tension: 0.20 },
                { id: 'E3-9', faceIds: [3, 9], emergentName: 'Team Sustainability Gap', elementalNature: 'Ether', theQuestion: 'How does our humanity serve and express our highest values?', tension: 0.13 },
                { id: 'E3-11', faceIds: [3, 11], emergentName: 'Team Investor Story', elementalNature: 'Fire', theQuestion: 'How does our human passion transform into the energy that attracts resources?', tension: 0.25 },
                { id: 'E4-5', faceIds: [4, 5], emergentName: 'Structure-Market Alignment', elementalNature: 'Air', theQuestion: 'Do our structures help or hinder the clarity of our public message?', tension: 0.10 },
                { id: 'E4-6', faceIds: [4, 6], emergentName: 'Formalized Partnerships', elementalNature: 'Earth', theQuestion: 'Are our partnerships grounded in clear, stable, formal agreements?', tension: 0.13 },
                { id: 'E4-7', faceIds: [4, 7], emergentName: 'Governance Brand Integrity', elementalNature: 'Ether', theQuestion: 'Does our structure embody the highest integrity of our brand?', tension: 0.08 },
                { id: 'E4-9', faceIds: [4, 9], emergentName: 'Structure vs Sustainability', elementalNature: 'Fire', theQuestion: 'Can our structure transform to meet the needs of due diligence?', tension: 0.20 },
                { id: 'E5-7', faceIds: [5, 7], emergentName: 'Brand Market Resonance', elementalNature: 'Ether', theQuestion: 'Does our market resonance serve the highest purpose of our brand\'s truth?', tension: 0.02 },
                { id: 'E5-8', faceIds: [5, 8], emergentName: 'Customer Experience Loop', elementalNature: 'Fire', theQuestion: 'Does our market feedback transform into operational improvements?', tension: 0.06 },
                { id: 'E5-9', faceIds: [5, 9], emergentName: 'Market vs Sustainability', elementalNature: 'Water', theQuestion: 'Is there a healthy flow of conversation between our market and community?', tension: 0.30 },
                { id: 'E5-12', faceIds: [5, 12], emergentName: 'Market Resilience', elementalNature: 'Water', theQuestion: 'Is our brand a source of resilient, trust-based flow during a crisis?', tension: 0.14 },
                { id: 'E6-7', faceIds: [6, 7], emergentName: 'Partner Brand Amplification', elementalNature: 'Air', theQuestion: 'Do we clearly communicate our brand\'s power to potential funders?', tension: 0.05 },
                { id: 'E7-8', faceIds: [7, 8], emergentName: 'Brand Operations Match', elementalNature: 'Fire', theQuestion: 'Does our brand promise transform into operational excellence?', tension: 0.08 },
                { id: 'E8-10', faceIds: [8, 10], emergentName: 'Operations Values Bridge', elementalNature: 'Water', theQuestion: 'Is there a healthy flow of regenerative practice within our operations?', tension: 0.10 },
                { id: 'E8-12', faceIds: [8, 12], emergentName: 'Operational Resilience', elementalNature: 'Air', theQuestion: 'Does operational clarity inform and reduce systemic risk?', tension: 0.20 },
                { id: 'E9-11', faceIds: [9, 11], emergentName: 'Sustainability vs Growth', elementalNature: 'Earth', theQuestion: 'Is our regenerative impulse grounded in our core values?', tension: 0.38 },
                { id: 'E9-12', faceIds: [9, 12], emergentName: 'Sustainability Resilience Gap', elementalNature: 'Fire', theQuestion: 'Does our regenerative practice transform into greater systemic resilience?', tension: 0.16 },
                { id: 'E10-11', faceIds: [10, 11], emergentName: 'Values Investor Alignment', elementalNature: 'Air', theQuestion: 'Do we clearly communicate our values to our capital partners?', tension: 0.12 },
                { id: 'E10-12', faceIds: [10, 12], emergentName: 'Values Resilience Foundation', elementalNature: 'Fire', theQuestion: 'Do our values transform into resilience during a crisis?', tension: 0.10 },
                { id: 'E11-12', faceIds: [11, 12], emergentName: 'Capital Resilience', elementalNature: 'Water', theQuestion: 'Does a healthy funding pipeline create a flow of resilience?', tension: 0.22 }
            ],
            // Full vertex data from mapping-context.json
            vertices: [
                { id: 'V1', faceIds: [1, 2, 6], emergentName: 'Funded Innovation Team', vortexStrength: 0.18, classification: 'hotspot', tooltip: 'Strong capital + IP but team stretched' },
                { id: 'V2', faceIds: [1, 2, 10], emergentName: 'Team Structure Capital', vortexStrength: 0.15, classification: 'neutral', tooltip: 'Resources present but structure catching up' },
                { id: 'V3', faceIds: [1, 6, 7], emergentName: 'Market Structure Capital', vortexStrength: 0.12, classification: 'synergy_hub', tooltip: 'Good alignment across growth dimensions' },
                { id: 'V4', faceIds: [1, 7, 8], emergentName: 'Community Market Capital', vortexStrength: 0.05, classification: 'synergy_hub', tooltip: 'EXCELLENT: Strong external coherence' },
                { id: 'V5', faceIds: [1, 8, 10], emergentName: 'Innovation Network Capital', vortexStrength: 0.06, classification: 'synergy_hub', tooltip: 'IP, partners, and capital aligned' },
                { id: 'V6', faceIds: [2, 3, 6], emergentName: 'Team Innovation Operations', vortexStrength: 0.22, classification: 'hotspot', tooltip: 'Strong ops + IP but team capacity strained' },
                { id: 'V7', faceIds: [2, 3, 11], emergentName: 'Team Structure Sustainability', vortexStrength: 0.12, classification: 'neutral', tooltip: 'Sustainability lagging team growth' },
                { id: 'V8', faceIds: [2, 10, 11], emergentName: 'Market Structure Values', vortexStrength: 0.08, classification: 'synergy_hub', tooltip: 'Good alignment of external presence with values' },
                { id: 'V9', faceIds: [3, 4, 6], emergentName: 'Network Market Funding', vortexStrength: 0.04, classification: 'synergy_hub', tooltip: 'EXCELLENT: Market + network driving funding' },
                { id: 'V10', faceIds: [3, 4, 9], emergentName: 'Brand IP Network', vortexStrength: 0.08, classification: 'synergy_hub', tooltip: 'Strong innovation story to market' },
                { id: 'V11', faceIds: [3, 9, 11], emergentName: 'Brand Operations IP', vortexStrength: 0.06, classification: 'synergy_hub', tooltip: 'Product excellence supports brand' },
                { id: 'V12', faceIds: [4, 5, 7], emergentName: 'Team Ops Sustainability Gap', vortexStrength: 0.28, classification: 'bermuda_triangle', tooltip: 'CRITICAL: Ops excellent but team stretched, sustainability neglected' },
                { id: 'V13', faceIds: [4, 5, 9], emergentName: 'Values Structure Sustainability', vortexStrength: 0.20, classification: 'hotspot', tooltip: 'Values present but sustainability practices lag' },
                { id: 'V14', faceIds: [4, 6, 7], emergentName: 'Market Values Funding', vortexStrength: 0.10, classification: 'synergy_hub', tooltip: 'Values-aligned market driving investment' },
                { id: 'V15', faceIds: [5, 7, 8], emergentName: 'Network Brand Funding', vortexStrength: 0.06, classification: 'synergy_hub', tooltip: 'Partner network amplifying investor interest' },
                { id: 'V16', faceIds: [5, 8, 12], emergentName: 'Brand Ops Resilience', vortexStrength: 0.12, classification: 'neutral', tooltip: 'Strong ops but resilience developing' },
                { id: 'V17', faceIds: [5, 9, 12], emergentName: 'Ops Sustainability Resilience Gap', vortexStrength: 0.30, classification: 'bermuda_triangle', tooltip: 'CRITICAL: Excellent ops but sustainability debt accumulating' },
                { id: 'V18', faceIds: [8, 10, 12], emergentName: 'Values Sustainability Resilience', vortexStrength: 0.18, classification: 'hotspot', tooltip: 'Values strong but sustainability practices need development' },
                { id: 'V19', faceIds: [9, 11, 12], emergentName: 'Values Funding Resilience', vortexStrength: 0.16, classification: 'neutral', tooltip: 'Strong funding provides resilience buffer' },
                { id: 'V20', faceIds: [10, 11, 12], emergentName: 'Brand Funding Fortress', vortexStrength: 0.14, classification: 'neutral', tooltip: 'Brand + capital provide some protection' }
            ],
            shadowPatterns: [
                { id: 'growth-at-cost', name: 'Growth at Any Cost', suppressed: 'Rapid scaling + Sustainability neglect', integrated: 'Sustainable Growth - Expansion that regenerates rather than depletes', severity: 'significant', involvedFaces: [8, 9, 3] },
                { id: 'team-stretch', name: 'The Stretched Team', suppressed: 'Excellent operations + Exhausted team', integrated: 'Thriving Operations - Excellence that energizes the team', severity: 'moderate', involvedFaces: [3, 8, 5] }
            ]
        },

        'apex-industries': {
            companyId: 'apex-industries',
            displayName: 'Apex Industries',
            tagline: 'Sustainable Manufacturing Excellence',
            octaveStage: 'O6-O7',
            dominantOctave: 6,
            archetype: 'enterprise',
            dominantBreathName: 'The Breath of Legacy',
            mode: 'quick',
            faces: [
                { id: 1, baseName: 'Financial Capital', customName: 'Market Leadership', icon: '👑', octave: 7, sentiment: 0.95 },
                { id: 2, baseName: 'Intellectual Capital', customName: 'Innovation Legacy', icon: '🔬', octave: 6, sentiment: 0.92 },
                { id: 3, baseName: 'Human Capital', customName: 'Talent Magnet', icon: '🌟', octave: 6, sentiment: 0.88 },
                { id: 4, baseName: 'Structural Capital', customName: 'Governance Excellence', icon: '🏛️', octave: 7, sentiment: 0.96 },
                { id: 5, baseName: 'Market Resonance', customName: 'Market Dominance', icon: '🎯', octave: 7, sentiment: 0.94 },
                { id: 6, baseName: 'Community & Partners', customName: 'Ecosystem Leadership', icon: '🌐', octave: 6, sentiment: 0.90 },
                { id: 7, baseName: 'Brand & Reputation', customName: 'Trusted Brand', icon: '💎', octave: 7, sentiment: 0.97 },
                { id: 8, baseName: 'Core Operations', customName: 'Operational Mastery', icon: '⚡', octave: 7, sentiment: 0.98 },
                { id: 9, baseName: 'Regenerative Flow', customName: 'Carbon Negative', icon: '🌱', octave: 7, sentiment: 0.95 },
                { id: 10, baseName: 'Foundational Values', customName: 'Purpose-Driven', icon: '🧭', octave: 6, sentiment: 0.91 },
                { id: 11, baseName: 'Funding Pipeline', customName: 'Capital Abundance', icon: '💰', octave: 7, sentiment: 0.93 },
                { id: 12, baseName: 'Risk & Resilience', customName: 'Antifragile', icon: '🛡️', octave: 6, sentiment: 0.89 }
            ],
            kpis: {
                face1: [{ id: 'K1_1', name: 'Revenue', value: 450000000, unit: 'USD', target: 500000000 }],
                face2: [{ id: 'K2_1', name: 'R&D Pipeline', value: 42, unit: 'count', target: 50 }],
                face3: [{ id: 'K3_1', name: 'Employee Satisfaction', value: 8.7, unit: 'score', target: 9 }],
                face4: [{ id: 'K4_1', name: 'Governance Score', value: 96, unit: 'percent', target: 100 }],
                face5: [{ id: 'K5_1', name: 'Market Share', value: 34, unit: 'percent', target: 40 }],
                face6: [{ id: 'K6_1', name: 'Partner Value', value: 85000000, unit: 'USD', target: 100000000 }],
                face7: [{ id: 'K7_1', name: 'Brand Value', value: 2100000000, unit: 'USD', target: 2500000000 }],
                face8: [{ id: 'K8_1', name: 'Efficiency Index', value: 94, unit: 'percent', target: 98 }],
                face9: [{ id: 'K9_1', name: 'Carbon Offset', value: -15000, unit: 'tons', target: -20000 }],
                face10: [{ id: 'K10_1', name: 'Purpose Score', value: 91, unit: 'percent', target: 95 }],
                face11: [{ id: 'K11_1', name: 'Cash Reserves', value: 180000000, unit: 'USD', target: 200000000 }],
                face12: [{ id: 'K12_1', name: 'Risk Rating', value: 8.9, unit: 'score', target: 9.5 }]
            },
            diagnostics: { globalCoherence: 0.94 },
            breathAxes: [
                { axis: 1, name: 'Resource Flow', breathName: 'The Breath of Legacy', projectionQuestion: 'Are we seeking capital for 100-year projects?', receptionQuestion: 'Is our capital structured for generational stewardship?' },
                { axis: 2, name: 'Substance & Story', breathName: 'The Breath of Endurance', projectionQuestion: 'Is our brand telling a story that can change the future?', receptionQuestion: 'Is our IP a legacy that will serve future generations?' },
                { axis: 3, name: 'Being & Doing', breathName: 'The Breath of Continuity', projectionQuestion: 'Is our work a path to collective mastery?', receptionQuestion: 'Is our culture designed to outlive its founders?' },
                { axis: 4, name: 'Form & Integrity', breathName: 'The Breath of Evolution', projectionQuestion: 'Is our governance model itself designed to evolve?', receptionQuestion: 'Are we a steward for future generations?' },
                { axis: 5, name: 'Perception & Truth', breathName: 'The Breath of Destiny', projectionQuestion: 'Is the market seeing us as a shaper of the future?', receptionQuestion: 'Are our values universal and timeless?' },
                { axis: 6, name: 'Network & Fortress', breathName: 'The Breath of Stewardship', projectionQuestion: 'Is our network consciously building a better future?', receptionQuestion: 'Is our vision itself resilient and able to self-correct?' }
            ],
            // 30 canonical edges from dodecahedron-topology.js
            edges: [
                { id: 'E1-2', faceIds: [1, 2], emergentName: 'Capital Wisdom Flow', elementalNature: 'Fire', theQuestion: 'How does our capital transform into valuable knowledge?', tension: 0.03 },
                { id: 'E1-6', faceIds: [1, 6], emergentName: 'Generous Capital Circulation', elementalNature: 'Water', theQuestion: 'How does capital flow to and from our community in a healthy way?', tension: 0.03 },
                { id: 'E1-7', faceIds: [1, 7], emergentName: 'Brand Capital Story', elementalNature: 'Air', theQuestion: 'How do we communicate our financial value and story?', tension: 0.00 },
                { id: 'E1-8', faceIds: [1, 8], emergentName: 'Operational Investment Harmony', elementalNature: 'Earth', theQuestion: 'How is our capital grounded in real, tangible operational work?', tension: 0.04 },
                { id: 'E1-10', faceIds: [1, 10], emergentName: 'Capital as Sacred Service', elementalNature: 'Ether', theQuestion: 'How does our capital serve the highest purpose of regeneration?', tension: 0.05 },
                { id: 'E2-3', faceIds: [2, 3], emergentName: 'Collective Genius', elementalNature: 'Air', theQuestion: 'How do our people\'s minds connect to create shared knowledge?', tension: 0.01 },
                { id: 'E2-6', faceIds: [2, 6], emergentName: 'Knowledge Gift Economy', elementalNature: 'Water', theQuestion: 'How does our knowledge flow to our community? (Teaching)', tension: 0.00 },
                { id: 'E2-10', faceIds: [2, 10], emergentName: 'Wisdom Values Integration', elementalNature: 'Earth', theQuestion: 'Is our knowledge grounded in and aligned with our core values?', tension: 0.02 },
                { id: 'E2-11', faceIds: [2, 11], emergentName: 'IP as Legacy Gift', elementalNature: 'Ether', theQuestion: 'Does our knowledge serve the highest purpose of regeneration?', tension: 0.05 },
                { id: 'E3-4', faceIds: [3, 4], emergentName: 'Empowering Structures', elementalNature: 'Earth', theQuestion: 'How is our human energy grounded and supported by our structures?', tension: 0.04 },
                { id: 'E3-6', faceIds: [3, 6], emergentName: 'Community as Family', elementalNature: 'Water', theQuestion: 'What is the emotional flow and quality of our human relationships?', tension: 0.01 },
                { id: 'E3-9', faceIds: [3, 9], emergentName: 'Humanity as Earth Service', elementalNature: 'Ether', theQuestion: 'How does our humanity serve and express our highest values?', tension: 0.04 },
                { id: 'E3-11', faceIds: [3, 11], emergentName: 'People Attract Capital', elementalNature: 'Fire', theQuestion: 'How does our human passion transform into the energy that attracts resources?', tension: 0.04 },
                { id: 'E4-5', faceIds: [4, 5], emergentName: 'Structure as Message', elementalNature: 'Air', theQuestion: 'Do our structures help or hinder the clarity of our public message?', tension: 0.02 },
                { id: 'E4-6', faceIds: [4, 6], emergentName: 'Partnership Excellence', elementalNature: 'Earth', theQuestion: 'Are our partnerships grounded in clear, stable, formal agreements?', tension: 0.05 },
                { id: 'E4-7', faceIds: [4, 7], emergentName: 'Governance as Brand', elementalNature: 'Ether', theQuestion: 'Does our structure embody the highest integrity of our brand?', tension: 0.02 },
                { id: 'E4-9', faceIds: [4, 9], emergentName: 'Structure Serves Regeneration', elementalNature: 'Fire', theQuestion: 'Can our structure transform to meet the needs of due diligence?', tension: 0.08 },
                { id: 'E5-7', faceIds: [5, 7], emergentName: 'Brand Market Unity', elementalNature: 'Ether', theQuestion: 'Does our market resonance serve the highest purpose of our brand\'s truth?', tension: 0.04 },
                { id: 'E5-8', faceIds: [5, 8], emergentName: 'Customer Delight Loop', elementalNature: 'Fire', theQuestion: 'Does our market feedback transform into operational improvements?', tension: 0.08 },
                { id: 'E5-9', faceIds: [5, 9], emergentName: 'Market Regeneration Bridge', elementalNature: 'Water', theQuestion: 'Is there a healthy flow of conversation between our market and community?', tension: 0.10 },
                { id: 'E5-12', faceIds: [5, 12], emergentName: 'Market Resilience', elementalNature: 'Water', theQuestion: 'Is our brand a source of resilient, trust-based flow during a crisis?', tension: 0.07 },
                { id: 'E6-7', faceIds: [6, 7], emergentName: 'Community Brand Synergy', elementalNature: 'Air', theQuestion: 'Do we clearly communicate our brand\'s power to potential funders?', tension: 0.03 },
                { id: 'E7-8', faceIds: [7, 8], emergentName: 'Brand-Operations Excellence', elementalNature: 'Fire', theQuestion: 'Does our brand promise transform into operational excellence?', tension: 0.04 },
                { id: 'E8-10', faceIds: [8, 10], emergentName: 'Operations Values Unity', elementalNature: 'Water', theQuestion: 'Is there a healthy flow of regenerative practice within our operations?', tension: 0.01 },
                { id: 'E8-12', faceIds: [8, 12], emergentName: 'Operational Antifragility', elementalNature: 'Air', theQuestion: 'Does operational clarity inform and reduce systemic risk?', tension: 0.01 },
                { id: 'E9-11', faceIds: [9, 11], emergentName: 'Regeneration Attracts Capital', elementalNature: 'Earth', theQuestion: 'Is our regenerative impulse grounded in our core values?', tension: 0.08 },
                { id: 'E9-12', faceIds: [9, 12], emergentName: 'Regeneration as Resilience', elementalNature: 'Fire', theQuestion: 'Does our regenerative practice transform into greater systemic resilience?', tension: 0.03 },
                { id: 'E10-11', faceIds: [10, 11], emergentName: 'Values Attract Sacred Capital', elementalNature: 'Air', theQuestion: 'Do we clearly communicate our values to our capital partners?', tension: 0.07 },
                { id: 'E10-12', faceIds: [10, 12], emergentName: 'Values as Fortress Foundation', elementalNature: 'Fire', theQuestion: 'Do our values transform into resilience during a crisis?', tension: 0.02 },
                { id: 'E11-12', faceIds: [11, 12], emergentName: 'Capital Resilience Synergy', elementalNature: 'Water', theQuestion: 'Does a healthy funding pipeline create a flow of resilience?', tension: 0.05 }
            ],
            // Full vertex data from mapping-context.json
            vertices: [
                { id: 'V1', faceIds: [1, 2, 6], emergentName: 'Resourced Flourishing Wisdom', vortexStrength: 0.02, classification: 'synergy_hub', tooltip: 'HARMONY: Capital, knowledge, and people in perfect flow' },
                { id: 'V2', faceIds: [1, 2, 10], emergentName: 'Empowered Structure', vortexStrength: 0.03, classification: 'synergy_hub', tooltip: 'Resources, people, and governance aligned' },
                { id: 'V3', faceIds: [1, 6, 7], emergentName: 'Market Capital Governance', vortexStrength: 0.04, classification: 'synergy_hub', tooltip: 'External and internal coherence' },
                { id: 'V4', faceIds: [1, 7, 8], emergentName: 'Ecosystem Capital Market', vortexStrength: 0.05, classification: 'synergy_hub', tooltip: 'Strong community-market-capital flow' },
                { id: 'V5', faceIds: [1, 8, 10], emergentName: 'Knowledge Capital Network', vortexStrength: 0.02, classification: 'synergy_hub', tooltip: 'IP, capital, and community in harmony' },
                { id: 'V6', faceIds: [2, 3, 6], emergentName: 'Team Learning Excellence', vortexStrength: 0.01, classification: 'synergy_hub', tooltip: 'PERFECT: People, knowledge, operations unified' },
                { id: 'V7', faceIds: [2, 3, 11], emergentName: 'Human Structure Regeneration', vortexStrength: 0.06, classification: 'synergy_hub', tooltip: 'People flourishing within regenerative structures' },
                { id: 'V8', faceIds: [2, 10, 11], emergentName: 'Structure Market Values', vortexStrength: 0.07, classification: 'synergy_hub', tooltip: 'Values visible in governance and market' },
                { id: 'V9', faceIds: [3, 4, 6], emergentName: 'Network Market Capital', vortexStrength: 0.04, classification: 'synergy_hub', tooltip: 'Ecosystem driving sustainable growth' },
                { id: 'V10', faceIds: [3, 4, 9], emergentName: 'Brand Knowledge Network', vortexStrength: 0.02, classification: 'synergy_hub', tooltip: 'IP story shared through community' },
                { id: 'V11', faceIds: [3, 9, 11], emergentName: 'Brand IP Operations', vortexStrength: 0.03, classification: 'synergy_hub', tooltip: 'Operational excellence tells brand story' },
                { id: 'V12', faceIds: [4, 5, 7], emergentName: 'Human Ops Regeneration', vortexStrength: 0.03, classification: 'synergy_hub', tooltip: 'Work as service, people flourishing' },
                { id: 'V13', faceIds: [4, 5, 9], emergentName: 'Governance Regeneration Values', vortexStrength: 0.05, classification: 'synergy_hub', tooltip: 'Structure serves regeneration and values' },
                { id: 'V14', faceIds: [4, 6, 7], emergentName: 'Market Values Capital', vortexStrength: 0.08, classification: 'synergy_hub', tooltip: 'Values visible in market attracting capital' },
                { id: 'V15', faceIds: [5, 7, 8], emergentName: 'Network Brand Funding', vortexStrength: 0.04, classification: 'synergy_hub', tooltip: 'Community amplifying brand to capital' },
                { id: 'V16', faceIds: [5, 8, 12], emergentName: 'Brand Ops Fortress', vortexStrength: 0.03, classification: 'synergy_hub', tooltip: 'Operations and brand building resilience' },
                { id: 'V17', faceIds: [5, 9, 12], emergentName: 'Ops Regeneration Antifragile', vortexStrength: 0.02, classification: 'synergy_hub', tooltip: 'Operations healing Earth, building strength' },
                { id: 'V18', faceIds: [8, 10, 12], emergentName: 'Values Regeneration Fortress', vortexStrength: 0.02, classification: 'synergy_hub', tooltip: 'Values and regeneration as antifragile core' },
                { id: 'V19', faceIds: [9, 11, 12], emergentName: 'Values Capital Fortress', vortexStrength: 0.05, classification: 'synergy_hub', tooltip: 'Values attracting capital building resilience' },
                { id: 'V20', faceIds: [10, 11, 12], emergentName: 'Brand Capital Fortress', vortexStrength: 0.04, classification: 'synergy_hub', tooltip: 'Brand and capital providing protection' }
            ],
            shadowPatterns: [
                { id: 'integrated-excellence', name: 'Integrated Excellence', suppressed: 'All shadows integrated - this is what O6-O7 looks like', integrated: 'Thriving Coherence - All aspects of organization in harmony', severity: 'none', involvedFaces: [] }
            ]
        }
    },

    /**
     * Get template by company ID (for offline fallback)
     */
    get: function(companyId) {
        return this.templates[companyId] || null;
    },

    /**
     * Check if a template exists
     */
    has: function(companyId) {
        return companyId in this.templates;
    },

    /**
     * Get all available company IDs
     */
    getAvailableIds: function() {
        return Object.keys(this.templates);
    },

    /**
     * Initialize offline mode fallbacks for ES modules that fail on file:// protocol
     */
    initOfflineMode: function() {
        // Create fallback Quannex API if module didn't load
        if (typeof window.Quannex === 'undefined') {
            Logger.warn('CompanyTemplatesBundle', 'Creating fallback Quannex API');
            window.Quannex = {
                async init() { return { globalCoherence: 0.5 }; },
                async initWithCompany(data) {
                    Logger.debug('CompanyTemplatesBundle', 'Offline Quannex init with company', data?.name);
                    return { globalCoherence: data?.kpis?.length > 0 ? 0.5 : 0.3 };
                },
                getState() {
                    return {
                        globalCoherence: 0.5,
                        faces: [],
                        coherenceStatus: 'balanced'
                    };
                }
            };
        }

        // Create fallback PortraitView if module didn't load
        if (typeof window.PortraitView === 'undefined') {
            Logger.warn('CompanyTemplatesBundle', 'Creating fallback PortraitView');
            window.PortraitView = class {
                constructor(containerId, options) {
                    this.containerId = containerId;
                    this.options = options || {};
                    Logger.debug('CompanyTemplatesBundle', `Offline PortraitView created for: ${containerId}`);
                }
                update(data) {
                    Logger.debug('CompanyTemplatesBundle', `Offline PortraitView update called with ${data?.faces?.length} faces`);
                    const container = document.getElementById(this.containerId);
                    if (container) {
                        container.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.6); padding: 40px;">Portrait visualization requires HTTP server. Start with: python -m http.server 8080</p>';
                    }
                }
            };
        }

        // Create fallback DataTransformer if needed
        if (typeof window.DataTransformer === 'undefined') {
            Logger.warn('CompanyTemplatesBundle', 'Creating fallback DataTransformer');
            window.DataTransformer = {
                transform: (demoData) => ({
                    name: demoData?.faceConfig?.templateName || 'Demo Company',
                    kpis: demoData?.kpiData || [],
                    faceConfig: demoData?.faceConfig,
                    mode: demoData?.kpiMode || 'quick'
                }),
                transformResults: (engineState) => ({
                    globalCoherence: engineState?.globalCoherence || 0.5,
                    coherenceStatus: 'balanced',
                    faces: engineState?.faces || []
                }),
                validate: () => ({ valid: true, errors: [], warnings: [] })
            };
        }

        Logger.info('CompanyTemplatesBundle', 'Fallback APIs initialized');
    }
};

// Auto-initialize offline mode after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (window.location.protocol === 'file:') {
            Logger.info('CompanyTemplatesBundle', 'Detected file:// protocol, initializing fallbacks');
            window.CompanyTemplatesBundle.initOfflineMode();
        }
    }, 500);
});

Logger.info('CompanyTemplatesBundle', 'Company Templates Bundle loaded (offline support)');
