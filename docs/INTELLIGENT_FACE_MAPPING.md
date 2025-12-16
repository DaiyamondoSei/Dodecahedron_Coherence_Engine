# 🧠 Intelligent Face-to-Breath-Axis Mapping

## Overview

The DNA Helix visualization uses a **6 Breath Axes** framework to analyze organizational dynamics. When users create custom KPIs with their own face names (e.g., "Market Traction", "Team Velocity"), the system needs to intelligently map these to the breath axes.

This document explains how the **keyword-based semantic mapping** works without requiring an AI API.

## The Problem

### Predefined Companies
For companies like "Nova Tech", "Apex Industries", etc., the mapping is **hardcoded**:
```javascript
{
    name: 'Resource Flow',
    faces: [11, 1], // Funding Pipeline → Financial Capital
    names: ['Funding Pipeline', 'Financial Capital']
}
```

### Custom Companies
When users create custom faces like:
- "Product-Market Fit"
- "Team Velocity"
- "Cash Runway"
- "Brand Awareness"

The system needs to figure out: **Which breath axis do these belong to?**

## The Solution: Keyword-Based Semantic Mapping

### Architecture

```
Custom Face Names
        ↓
Keyword Matching Algorithm
        ↓
Confidence Scoring (high/medium/low)
        ↓
Breath Axis Assignment
        ↓
DNA Helix Visualization
```

### How It Works

#### 1. Keyword Dictionary

Each breath axis has **semantic keywords** for both inhale and exhale:

```javascript
{
    name: 'Resource Flow',
    keywords: {
        inhale: ['funding', 'investment', 'capital raise', 'financing', 'revenue', 'income', 'pipeline'],
        exhale: ['financial', 'cash', 'capital', 'money', 'budget', 'treasury', 'resources']
    }
}
```

#### 2. Matching Algorithm

For each custom face name, the system:

1. **Converts to lowercase** for case-insensitive matching
2. **Scans all keywords** in all breath axes
3. **Scores matches**:
   - Exact substring match: **+10 points** (e.g., "funding" in "Funding Pipeline")
   - Partial match (4+ chars): **+5 points** (e.g., "fund" matches "funding")
4. **Selects best match** based on highest score

#### 3. Confidence Levels

```javascript
if (score >= 10) → confidence = 'high'    // ●●● (direct keyword match)
if (score >= 5)  → confidence = 'medium'  // ●●○ (partial match)
if (score === 0) → confidence = 'low'     // ●○○ (sequential fallback)
```

#### 4. Fallback Strategy

If no keywords match:
- Uses **sequential pairing** (Face 1 & 2 → Axis 1, Face 3 & 4 → Axis 2, etc.)
- Marks as low confidence

## Example Mappings

### High Confidence Example

**User creates face**: "Cash Runway Management"

```javascript
// Matching process:
1. Check "Resource Flow" keywords
   - Contains "cash" → +10 points (exhale keyword)
   - Best match found!

2. Result:
   Axis: Resource Flow
   Confidence: high ●●●
   Method: keyword
```

### Medium Confidence Example

**User creates face**: "Team Development"

```javascript
// Matching process:
1. Check all axes
   - "Being & Doing" has "team" in exhale keywords → +10 points
   - Partial match on "devel" (from "development") → +5 points

2. Result:
   Axis: Being & Doing
   Confidence: high ●●●
   Method: keyword
```

### Low Confidence Example

**User creates face**: "Widget Sales Velocity"

```javascript
// Matching process:
1. Check all axes
   - No exact keyword matches found
   - No partial matches above threshold

2. Result:
   Falls back to sequential pairing
   Confidence: low ●○○
   Method: sequential
```

## Visual Feedback

The legend shows confidence with dots:
- **●●●** = High confidence (strong keyword match)
- **●●○** = Medium confidence (partial match)
- **●○○** = Low confidence (sequential fallback)

## Files Involved

### 1. **face-to-breath-mapper.js** (New)
Core mapping logic:
- Keyword dictionary
- Matching algorithm
- Confidence scoring

### 2. **octave-dna.html** (Updated)
Integration points:
- Line 793: Loads mapper script
- Line 911-942: `updateDNAHelicesConfig()` - Calls mapper
- Line 947-982: `updateLegend()` - Shows mapped faces with confidence

## Usage in Code

```javascript
// Get intelligent mapping
const breathConfig = window.FaceToBreathMapper.getBreathAxisConfig(company, facesData);

// Result structure:
{
    mode: 'custom',  // or 'predefined'
    axes: [
        {
            axisId: 1,
            axisName: 'Resource Flow',
            inhaleFace: { id: 5, name: 'Cash Runway' },
            exhaleFace: { id: 1, name: 'Financial Reserves' },
            confidence: 'high',
            method: 'keyword'
        },
        // ... 5 more axes
    ],
    summary: {
        highConfidence: 4,
        mediumConfidence: 1,
        lowConfidence: 1
    }
}
```

## Benefits

### ✅ No AI API Required
- Pure client-side JavaScript
- No external dependencies
- Instant results

### ✅ Transparent & Debuggable
- Clear keyword matching rules
- Visible confidence scores
- Console logs show reasoning

### ✅ Extensible
- Easy to add more keywords
- Can integrate AI later as enhancement
- Fallback ensures robustness

### ✅ User Feedback
- Confidence dots show mapping quality
- Users can see which faces map where
- Encourages meaningful face naming

## Future Enhancements

### Phase 1 (Current): Keyword Matching ✅
- Hardcoded keyword dictionary
- Simple substring matching
- Confidence scoring

### Phase 2: User Feedback Loop (Optional)
- Allow users to manually adjust mappings
- Learn from corrections (store preferences)

### Phase 3: AI Integration (Future Work)
- Use LLM for semantic similarity
- Handle complex business terminology
- Context-aware mapping

Example AI call:
```javascript
const aiMapping = await fetch('https://api.openai.com/v1/chat/completions', {
    model: 'gpt-4',
    messages: [{
        role: 'system',
        content: 'Map this organizational face to one of the 6 breath axes...'
    }]
});
```

## Testing the Mapping

### Test Case 1: Standard Business Terms
Create faces with common business terms:
- "Revenue Growth" → Should map to **Resource Flow** (high confidence)
- "Employee Satisfaction" → Should map to **Being & Doing** (high confidence)
- "Risk Management" → Should map to **Network & Fortress** (high confidence)

### Test Case 2: Creative Naming
Create faces with unique names:
- "Money Pipeline" → Should map to **Resource Flow** (high confidence via "money")
- "People Power" → Should map to **Being & Doing** (medium confidence via "people")
- "Safe Harbor" → Should map to **Network & Fortress** (medium confidence via partial match)

### Test Case 3: No Matches
Create faces with technical jargon:
- "API Response Time" → Sequential fallback (low confidence)
- "Database Throughput" → Sequential fallback (low confidence)

## Keyword Dictionary Reference

Full keyword list for all 6 axes:

### Resource Flow
- **Inhale**: funding, investment, capital raise, financing, revenue, income, pipeline
- **Exhale**: financial, cash, capital, money, budget, treasury, resources

### Substance & Story
- **Inhale**: brand, reputation, marketing, image, identity, communication, story
- **Exhale**: intellectual, knowledge, expertise, innovation, ip, research, learning

### Being & Doing
- **Inhale**: operations, processes, execution, delivery, production, work, activity
- **Exhale**: human, team, people, talent, culture, employees, skills, workforce

### Form & Integrity
- **Inhale**: structure, systems, infrastructure, architecture, framework, organization
- **Exhale**: regenerative, sustainability, renewal, adaptability, resilience, evolution

### Perception & Truth
- **Inhale**: market, customer, demand, perception, awareness, positioning, fit
- **Exhale**: values, mission, vision, purpose, ethics, principles, culture, foundation

### Network & Fortress
- **Inhale**: community, partners, network, relationships, ecosystem, collaboration
- **Exhale**: risk, resilience, security, protection, safety, stability, defense

## Console Output Example

When mapping custom faces, you'll see:

```
🔄 Mapping custom faces to breath axes...
   ✓ Axis 1 (Resource Flow): Cash Runway ↔ Financial Reserves [high confidence, keyword]
   ✓ Axis 2 (Substance & Story): Brand Awareness ↔ Innovation Pipeline [high confidence, keyword]
   ✓ Axis 3 (Being & Doing): Operations ↔ Team Velocity [high confidence, keyword]
   ✓ Axis 4 (Form & Integrity): Infrastructure ↔ Sustainability [medium confidence, keyword]
   ✓ Axis 5 (Perception & Truth): Market Fit ↔ Core Values [high confidence, keyword]
   ✓ Axis 6 (Network & Fortress): Community ↔ Risk Mgmt [high confidence, keyword]
✅ Mapped 6 breath axes
🧬 Breath axis configuration: { mode: 'custom', ... }
   Mapping confidence: 5 high, 1 medium, 0 low
✅ DNA helices configuration updated: 6 axes
```

---

**Status**: ✅ Implemented (No AI API Required)
**Date**: 2025-11-11
**Approach**: Keyword-based heuristic matching with confidence scoring
**Next Step**: Optional AI integration for enhanced semantic understanding
