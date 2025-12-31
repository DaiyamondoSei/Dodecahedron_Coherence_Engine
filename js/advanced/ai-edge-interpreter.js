/**
 * AI Edge Interpreter - Context-Aware Edge Metadata Generator
 *
 * Generates intelligent, contextual edge metadata when organizational-specific
 * data is not available. Uses the face domains and their relationships to create
 * meaningful archetypes, questions, and KPI suggestions.
 *
 * USAGE:
 * const interpreter = new AIEdgeInterpreter();
 * const metadata = interpreter.generateEdgeMetadata(face1, face2, edgeElement);
 *
 * @author Deimantas Murauskas & Claude
 * @version 1.0
 */

export class AIEdgeInterpreter {
  constructor() {
    // Archetypal relationship patterns based on domain combinations
    this.archetypeTemplates = {
      'Financial Capital': {
        'Intellectual Capital': 'Capital → Knowledge Transformation',
        'Core Operations': 'Financial Grounding & Operational Health',
        'Market Resonance': 'Investment → Market Presence',
        'Community & Partners': 'Capital → Community Investment',
        'Regenerative Flow': 'Financial Alignment with Regeneration'
      },
      'Intellectual Capital': {
        'Human Capital': 'Vision → Embodiment Flow',
        'Core Operations': 'Knowledge → Operational Excellence',
        'Regenerative Flow': 'Generous Knowledge Sharing'
      },
      'Human Capital': {
        'Structural Capital': 'People → Process Alignment',
        'Foundational Values': 'Human Expression of Values',
        'Community & Partners': 'Human Connection & Co-creation'
      },
      'Structural Capital': {
        'Market Resonance': 'Structure → Market Clarity',
        'Brand & Reputation': 'Structural → Reputational Integrity',
        'Funding Pipeline': 'Organizational Readiness for Capital'
      },
      'Market Resonance': {
        'Brand & Reputation': 'Market Feedback → Brand Evolution',
        'Core Operations': 'Market Intelligence → Operations',
        'Community & Partners': 'Market → Community Engagement'
      },
      'Community & Partners': {
        'Intellectual Capital': 'Ecosystem Knowledge Exchange',
        'Financial Capital': 'Community Value Flow',
        'Core Operations': 'Partnership → Operational Integration'
      },
      'Brand & Reputation': {
        'Core Operations': 'Brand Promise → Operational Delivery',
        'Risk & Resilience': 'Reputational Resilience during Crisis',
        'Funding Pipeline': 'Brand → Capital Attraction'
      },
      'Core Operations': {
        'Risk & Resilience': 'Operational → Systemic Resilience',
        'Regenerative Flow': 'Operations → Regenerative Practice'
      },
      'Regenerative Flow': {
        'Risk & Resilience': 'Regeneration → System Resilience',
        'Foundational Values': 'Regenerative Embodiment of Values'
      },
      'Foundational Values': {
        'Funding Pipeline': 'Values → Capital Alignment',
        'Risk & Resilience': 'Ethical Resilience under Pressure'
      },
      'Funding Pipeline': {
        'Risk & Resilience': 'Funding Diversity → Resilience'
      }
    };

    // Question templates based on elemental nature
    this.questionTemplates = {
      'Fire': (face1, face2) =>
        `How does ${face1} transform into ${face2} energy?`,
      'Water': (face1, face2) =>
        `What is the flow quality between ${face1} and ${face2}?`,
      'Earth': (face1, face2) =>
        `How is ${face1} grounded and supported by ${face2}?`,
      'Air': (face1, face2) =>
        `How clearly does ${face1} communicate with ${face2}?`,
      'Ether': (face1, face2) =>
        `How does the ${face1} ↔ ${face2} relationship serve the highest purpose?`
    };

    // KPI name templates based on domain relationships
    this.kpiNameTemplates = {
      'capital_knowledge': 'IP Monetization Potential',
      'capital_operations': 'Operational ROI',
      'capital_market': 'Market Resonance ROI',
      'capital_community': 'Community Investment Ratio',
      'capital_regenerative': 'Regenerative Capital Allocation',
      'knowledge_human': 'Vision Embodiment Rate',
      'knowledge_operations': 'Knowledge → Operations Transfer',
      'knowledge_regenerative': 'IP Generosity Rate',
      'human_structural': 'Embodied Governance Quality',
      'human_values': 'Cultural Integrity Score',
      'human_community': 'Ecosystem Co-creation Rate',
      'structural_market': 'Structural Resonance with Market',
      'structural_brand': 'Reputational Integrity Score',
      'structural_funding': 'Investor Readiness Score',
      'market_brand': 'Perception Integrity',
      'market_operations': 'Brand-Experience Coherence',
      'market_community': 'Market Community Engagement',
      'community_knowledge': 'Ecosystem Knowledge Flow',
      'community_operations': 'Partnership → Operations Integration',
      'brand_operations': 'Brand-Operational Integrity',
      'brand_risk': 'Reputational Resilience',
      'brand_funding': 'Brand Capitalization Score',
      'operations_risk': 'Operational Resilience',
      'operations_regenerative': 'Process Regeneration Rate',
      'regenerative_risk': 'Regenerative → Resilience',
      'regenerative_values': 'Values Embodiment Score',
      'values_funding': 'Funding Alignment Index',
      'values_risk': 'Ethical Resilience',
      'funding_risk': 'Funding Diversification Index'
    };

    // Measurement suggestions based on domain pairs
    this.measurementSuggestions = {
      'capital_knowledge': 'Qualitative assessment (1-10) of IP market relevance and potential revenue models',
      'capital_operations': 'Ratio of operational output (units of value created) to operational budget spent',
      'capital_market': 'Ratio of brand awareness metrics to marketing & communications budget',
      'capital_community': 'Value returned to community vs. value extracted from community',
      'capital_regenerative': 'Percentage of budget allocated to regenerative projects',
      'knowledge_human': 'Ratio of tangible IP created to hours of founder/team work',
      'knowledge_operations': 'Percentage of documented knowledge actively used in operations',
      'knowledge_regenerative': 'Ratio of open/shared IP to total IP assets',
      'human_structural': 'Employee engagement score vs. number of formal policies/rules',
      'human_values': 'Anonymous team poll: "How well did we live our values this week?" (1-10)',
      'human_community': 'Hours spent in co-creative sessions vs. total project hours',
      'structural_market': 'Stakeholder clarity rating (1-5) on organizational design coherence',
      'structural_brand': 'External ethics audit or public perception of governance fairness (1-5)',
      'structural_funding': 'Checklist-based readiness score (entity formalized, agreements in place, etc.)',
      'market_brand': 'Ratio of short-term engagement metrics to long-term trust metrics',
      'market_operations': 'Comparison of Net Promoter Score (brand) to Customer Satisfaction (product)',
      'market_community': 'Quality score (1-5) of conversation frequency between market and community',
      'community_knowledge': 'Frequency and depth of collaborative sessions and co-creative workshops (1-5)',
      'community_operations': 'Partnership onboarding friction (days from handshake to operational agreement)',
      'brand_operations': 'Ratio comparing brand trust score to internal quality metrics',
      'brand_risk': 'Crisis simulation score: response speed and coherence to PR crisis (1-5)',
      'brand_funding': 'Investor feedback: "How much did brand influence interest?" (1-10 average)',
      'operations_risk': '1 - (Mean Time To Recover hours / Max Acceptable Downtime hours)',
      'operations_regenerative': 'Percentage of core processes with embedded regenerative practices',
      'regenerative_risk': 'Resilience wargame: "Would regenerative alternatives insulate from shock?" (1-5)',
      'regenerative_values': 'Ratio of regenerative choices to value-alignment checks',
      'values_funding': 'Values-alignment checklist score for current funding pipeline (1-5 average)',
      'values_risk': 'Crisis scenario: "Do we adhere to values under pressure?" (1-5)',
      'funding_risk': 'Herfindahl-Hirschman Index of funding source diversity (inverted)'
    };
  }

  /**
   * Generate comprehensive edge metadata for a given edge
   *
   * @param {Object} face1 - First face object with id and name
   * @param {Object} face2 - Second face object with id and name
   * @param {string} element - Elemental nature of the edge
   * @param {Object} csvData - Optional CSV data to fill gaps
   * @returns {Object} Complete edge metadata
   */
  generateEdgeMetadata(face1, face2, element, csvData = null) {
    const face1Name = face1.name || `Face ${face1.id}`;
    const face2Name = face2.name || `Face ${face2.id}`;

    // If CSV data exists and has all fields, return it (minor formatting)
    if (csvData && csvData.archetype && csvData.question && csvData.kpiName) {
      return {
        archetype: csvData.archetype,
        question: csvData.question,
        kpiName: csvData.kpiName,
        kpiMetric: csvData.kpiMetric || 'See CSV for details',
        kpiCalculation: csvData.kpiCalculation || 'See CSV for formula',
        source: 'csv'
      };
    }

    // Generate AI-contextual metadata
    const archetype = this.generateArchetype(face1Name, face2Name, csvData);
    const question = this.generateQuestion(face1Name, face2Name, element);
    const kpiData = this.generateKPI(face1Name, face2Name);

    return {
      archetype: archetype,
      question: question,
      kpiName: kpiData.name,
      kpiMetric: kpiData.metric,
      kpiCalculation: kpiData.calculation,
      source: 'ai-generated'
    };
  }

  /**
   * Generate edge archetype name
   */
  generateArchetype(face1Name, face2Name, csvData) {
    // If CSV has archetype, use it
    if (csvData && csvData.archetype) {
      return csvData.archetype;
    }

    // Check if we have a template for this domain combination
    const template = this.archetypeTemplates[face1Name]?.[face2Name] ||
                     this.archetypeTemplates[face2Name]?.[face1Name];

    if (template) {
      return template;
    }

    // Fallback: generic archetype
    return `${face1Name} ↔ ${face2Name}`;
  }

  /**
   * Generate edge question based on element
   */
  generateQuestion(face1Name, face2Name, element) {
    const questionGenerator = this.questionTemplates[element] || this.questionTemplates['Ether'];
    return questionGenerator(face1Name, face2Name);
  }

  /**
   * Generate KPI name and measurement for the edge
   */
  generateKPI(face1Name, face2Name) {
    // Create domain pair key
    const key1 = this.getDomainKey(face1Name);
    const key2 = this.getDomainKey(face2Name);
    const pairKey = [key1, key2].sort().join('_');

    const kpiName = this.kpiNameTemplates[pairKey] || `${face1Name} ↔ ${face2Name} Coherence`;
    const measurement = this.measurementSuggestions[pairKey] ||
      'Qualitative assessment (1-5) of relationship health and flow quality';

    return {
      name: kpiName,
      metric: measurement,
      calculation: '[AI: Context-specific formula to be defined based on organizational data availability]'
    };
  }

  /**
   * Convert face name to domain key for lookup
   */
  getDomainKey(faceName) {
    const keyMap = {
      'Financial Capital': 'capital',
      'Intellectual Capital': 'knowledge',
      'Human Capital': 'human',
      'Structural Capital': 'structural',
      'Market Resonance': 'market',
      'Community & Partners': 'community',
      'Brand & Reputation': 'brand',
      'Core Operations': 'operations',
      'Regenerative Flow': 'regenerative',
      'Foundational Values': 'values',
      'Funding Pipeline': 'funding',
      'Risk & Resilience': 'risk'
    };

    return keyMap[faceName] || 'unknown';
  }

  /**
   * Generate edge intelligence summary
   */
  generateEdgeSummary(edge, metadata) {
    const tensionLevel = edge.tension <= 0.3 ? 'low' : edge.tension <= 0.6 ? 'medium' : 'high';
    const flowDirection = edge.breathRatio > 0.1 ? 'expanding' : edge.breathRatio < -0.1 ? 'contracting' : 'balanced';

    const insights = [];

    // Tension insight
    if (tensionLevel === 'high') {
      insights.push(`⚠️ High tension (${(edge.tension * 100).toFixed(1)}%) suggests significant misalignment or energy difference`);
    } else if (tensionLevel === 'low') {
      insights.push(`✅ Low tension (${(edge.tension * 100).toFixed(1)}%) indicates healthy alignment`);
    }

    // Flow insight
    if (flowDirection === 'expanding') {
      insights.push(`📈 Energy flows from ${edge.face1Name} → ${edge.face2Name}`);
    } else if (flowDirection === 'contracting') {
      insights.push(`📉 Energy flows from ${edge.face2Name} → ${edge.face1Name}`);
    } else {
      insights.push(`⚖️ Balanced energy exchange between domains`);
    }

    // KPI insight
    if (edge.kpiCoherence >= 0.9) {
      insights.push(`🎯 Excellent KPI coherence (${(edge.kpiCoherence * 100).toFixed(1)}%)`);
    } else if (edge.kpiCoherence < 0.7) {
      insights.push(`📊 KPI coherence needs attention (${(edge.kpiCoherence * 100).toFixed(1)}%)`);
    }

    return {
      archetype: metadata.archetype,
      question: metadata.question,
      kpiName: metadata.kpiName,
      tensionLevel: tensionLevel,
      flowDirection: flowDirection,
      insights: insights
    };
  }
}

// Export for use in browser
if (typeof window !== 'undefined') {
  window.AIEdgeInterpreter = AIEdgeInterpreter;
}
