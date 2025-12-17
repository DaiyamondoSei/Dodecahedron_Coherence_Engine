/**
 * ========================================
 * MODULE: kpi-extractor.js
 * ========================================
 *
 * KPI EXTRACTOR - AI-Assisted KPI Extraction from Organizational Stories
 *
 * Extracts KPIs from organizational stories using AI or pattern matching.
 * Provides dual-path option for users:
 * - Manual Entry: User fills in each KPI themselves
 * - AI-Assisted: AI extracts and pre-populates KPI fields automatically
 *
 * DEPENDENCIES:
 * - window.FallbackChain (optional, for AI extraction)
 * - window.MappingContext (optional, for mode detection)
 * - window.currentStoryText (for extraction source)
 *
 * EXPORTS:
 * - KPIExtractor (class)
 * - KPIExtractionPanel (class, UI component)
 * - EXTRACTION_PATTERNS (regex patterns)
 * - FACE_KPI_MAPPING (face-to-KPI relationships)
 *
 * ========================================
 * NOTES FOR FUTURE CLAUDE
 * ========================================
 *
 * 1. TWO EXTRACTION MODES:
 *    a) Pattern-based: Uses regex (EXTRACTION_PATTERNS) to find metrics in text
 *       - Always works offline
 *       - Less accurate but reliable
 *    b) AI-based: Uses FallbackChain → GeminiClient for intelligent extraction
 *       - More accurate but requires API
 *       - Falls back to patterns if AI fails
 *
 * 2. EXTRACTION_PATTERNS STRUCTURE:
 *    Each pattern config has:
 *    - patterns: Array of regex (all matching the same metric type)
 *    - multipliers: { k: 1000, m: 1000000, ... } for suffix handling
 *    - unit: Display unit string
 *
 * 3. FACE_KPI_MAPPING:
 *    Maps which KPIs belong to which faces:
 *    - Face 1 (Financial Capital): revenue, burnRate, fundingRaised
 *    - Face 3 (Human Capital): teamSize
 *    - Face 5 (Market Resonance): customers, nps, socialFollowers
 *    - Face 7 (Brand): websiteTraffic, socialFollowers
 *    - Face 8 (Operations): growthRate
 *    - Face 9 (Regenerative): retention, waitlist
 *    - Face 11 (Funding): runway, fundingRaised
 *
 * 4. TWO MODES IN UI:
 *    - 'quick' mode: 12 KPIs (one per face)
 *    - 'full' mode: 60 KPIs (5 elements × 12 faces)
 *    Mode is detected from MappingContext.getMode()
 *
 * 5. AI RESULT FORMAT:
 *    AI returns: { kpis: [...], financials: {...}, mode, octave, _meta }
 *    Must be converted to: { byFace: {...}, raw: {...}, confidence }
 *    The _convertAIResultToDisplayFormat() method handles this.
 *
 * 6. CONFIDENCE LEVELS:
 *    - 'none': 0 metrics extracted
 *    - 'low': 1-2 metrics
 *    - 'medium': 3-4 metrics
 *    - 'high': 5-6 metrics
 *    - 'very-high': 7+ metrics
 *
 * 7. KPI EXTRACTION PANEL:
 *    UI component that:
 *    - Shows mode selector (Manual vs AI-Assisted)
 *    - Displays extraction results grouped by face
 *    - Full mode shows elemental grouping (earth/water/fire/air/ether)
 *    - "Apply to Assessment" button dispatches 'kpis-extracted' event
 *
 * 8. VALUE FORMATTING:
 *    Large numbers are formatted as:
 *    - >= 1B → "$X.XB"
 *    - >= 1M → "$X.XM"
 *    - >= 1K → "$XK"
 *    Percentages get "%" suffix.
 *
 * 9. OCTAVE-AWARE EXTRACTION:
 *    AI extraction respects detected octave:
 *    - O1-O2: Focus on survival metrics (runway, burn rate)
 *    - O3-O4: Include growth metrics (customers, retention)
 *    - O5-O7: Include advanced metrics (NPS, brand metrics)
 *
 * 10. EVENTS:
 *     - 'kpis-extracted': Dispatched when user clicks "Apply"
 *       Detail contains the full extraction result object
 *
 * USED BY:
 * - Orchestrator setup flow
 * - Story analysis workflow
 * - KPI input panels
 *
 * GOTCHAS:
 * - Regex patterns are US/English focused (dollar signs, etc.)
 * - First regex match wins (won't find multiple revenues)
 * - AI extraction requires window.currentStoryText to be set
 * - Some patterns may overlap (socialFollowers used by Face 5 and 7)
 *
 * ========================================
 *
 * @module js/ai/kpi-extractor
 * @author Deimantas Butrimas & Claude
 * @version Sprint 2 - Task 10
 */

// Pattern-based extraction for offline/fallback mode
const EXTRACTION_PATTERNS = {
    // Financial patterns
    revenue: {
        patterns: [
            /(?:revenue|sales|income)\s*(?:of|is|:)?\s*\$?\s*([\d,.]+)\s*(m(?:illion)?|k|b(?:illion)?)?/gi,
            /\$\s*([\d,.]+)\s*(m(?:illion)?|k|b(?:illion)?)\s*(?:revenue|sales|arr|mrr)/gi,
            /([\d,.]+)\s*(m(?:illion)?|k|b(?:illion)?)\s*(?:in\s+)?(?:revenue|sales)/gi
        ],
        multipliers: { k: 1000, m: 1000000, million: 1000000, b: 1000000000, billion: 1000000000 }
    },

    runway: {
        patterns: [
            /(\d+)\s*(?:months?)\s*(?:of\s+)?runway/gi,
            /runway\s*(?:of|:)?\s*(\d+)\s*months?/gi,
            /(\d+)\s*months?\s*(?:of\s+)?cash/gi
        ],
        unit: 'months'
    },

    teamSize: {
        patterns: [
            /(\d+)\s*(?:employees?|team\s*members?|people|staff)/gi,
            /team\s*(?:of|:)?\s*(\d+)/gi,
            /(?:company|we)\s*(?:has|have)\s*(\d+)\s*(?:employees?|people)/gi
        ],
        unit: 'people'
    },

    customers: {
        patterns: [
            /(\d+(?:,\d{3})*(?:\.\d+)?)\s*(?:k|m)?\s*(?:customers?|users?|clients?)/gi,
            /(?:serve|serving)\s*(\d+(?:,\d{3})*(?:\.\d+)?)\s*(?:k|m)?/gi
        ],
        multipliers: { k: 1000, m: 1000000 }
    },

    growthRate: {
        patterns: [
            /(\d+(?:\.\d+)?)\s*%\s*(?:growth|increase|yoy|mom|growth\s*rate)/gi,
            /growing\s*(?:at\s+)?(\d+(?:\.\d+)?)\s*%/gi,
            /(\d+(?:\.\d+)?)\s*%\s*(?:annual|monthly|yearly)/gi
        ],
        unit: '%'
    },

    burnRate: {
        patterns: [
            /burn\s*(?:rate)?\s*(?:of|:)?\s*\$?\s*([\d,.]+)\s*(?:k|m)?(?:\s*\/?\s*month)?/gi,
            /\$?\s*([\d,.]+)\s*(?:k|m)?\s*(?:monthly)?\s*burn/gi
        ],
        unit: '$/month'
    },

    fundingRaised: {
        patterns: [
            /raised\s*\$?\s*([\d,.]+)\s*(m(?:illion)?|k|b(?:illion)?)?/gi,
            /\$?\s*([\d,.]+)\s*(m(?:illion)?|k|b(?:illion)?)\s*(?:raised|funding|round)/gi,
            /series\s*[abc]\s*(?:of|:)?\s*\$?\s*([\d,.]+)\s*(m(?:illion)?)?/gi
        ],
        multipliers: { k: 1000, m: 1000000, million: 1000000, b: 1000000000, billion: 1000000000 }
    },

    nps: {
        patterns: [
            /nps\s*(?:of|:)?\s*(\+?-?\d+)/gi,
            /net\s*promoter\s*score\s*(?:of|:)?\s*(\+?-?\d+)/gi
        ]
    },

    retention: {
        patterns: [
            /(\d+(?:\.\d+)?)\s*%\s*retention/gi,
            /retention\s*(?:rate)?\s*(?:of|:)?\s*(\d+(?:\.\d+)?)\s*%/gi,
            /(\d+(?:\.\d+)?)\s*%\s*(?:churn|attrition)/gi // Inverted
        ],
        unit: '%'
    },

    // Social media & audience
    socialFollowers: {
        patterns: [
            /(\d+(?:,\d{3})*)\s*(?:followers?|subscribers?)\s*(?:on\s+)?(?:linkedin|facebook|twitter|instagram|youtube)?/gi,
            /(?:linkedin|facebook|twitter|instagram|youtube)\s*(?:has|have|with)?\s*(?:around|about|over)?\s*(\d+(?:,\d{3})*)\s*(?:followers?|subscribers?)/gi,
            /(?:around|about|over)\s*(\d+(?:,\d{3})*)\s*followers?/gi
        ],
        unit: 'followers'
    },

    // Waitlist / signups
    waitlist: {
        patterns: [
            /(\d+(?:,\d{3})*)\s*(?:people|users?|signups?)?\s*(?:on\s+)?(?:the\s+)?(?:waiting\s*list|waitlist)/gi,
            /(?:waiting\s*list|waitlist)\s*(?:of|with|has)?\s*(\d+(?:,\d{3})*)/gi,
            /(\d+(?:,\d{3})*)\s*(?:on\s+)?(?:the\s+)?waitlist/gi,
            /(\d+(?:,\d{3})*)\s*(?:beta\s*)?signups?/gi
        ],
        unit: 'signups'
    },

    // Website traffic
    websiteTraffic: {
        patterns: [
            /(\d+(?:,\d{3})*)\s*(?:k|m)?\s*(?:monthly\s+)?(?:visitors?|visits|page\s*views?)/gi,
            /(?:website|site)\s*(?:gets?|has|receives?)\s*(\d+(?:,\d{3})*)\s*(?:k|m)?/gi
        ],
        unit: 'visits/month',
        multipliers: { k: 1000, m: 1000000 }
    }
};

// Face to KPI mapping
const FACE_KPI_MAPPING = {
    1: { // Financial Capital / Runway & Resources
        kpis: ['revenue', 'burnRate', 'fundingRaised'],
        labels: {
            revenue: 'Annual Revenue',
            burnRate: 'Monthly Burn Rate',
            fundingRaised: 'Total Funding Raised'
        }
    },
    3: { // Human Capital / Founding Team
        kpis: ['teamSize'],
        labels: {
            teamSize: 'Team Size'
        }
    },
    5: { // Market Resonance / Market Traction
        kpis: ['customers', 'nps', 'socialFollowers'],
        labels: {
            customers: 'Active Customers',
            nps: 'Net Promoter Score',
            socialFollowers: 'Social Followers'
        }
    },
    7: { // Brand Promise
        kpis: ['websiteTraffic', 'socialFollowers'],
        labels: {
            websiteTraffic: 'Website Traffic',
            socialFollowers: 'Social Audience'
        }
    },
    8: { // Core Operations / Product Development
        kpis: ['growthRate'],
        labels: {
            growthRate: 'Growth Rate'
        }
    },
    9: { // Regenerative Flow / Growth Loops
        kpis: ['retention', 'waitlist'],
        labels: {
            retention: 'Customer Retention',
            waitlist: 'Waitlist Signups'
        }
    },
    11: { // Funding Pipeline
        kpis: ['runway', 'fundingRaised'],
        labels: {
            runway: 'Runway (Months)',
            fundingRaised: 'Next Round Target'
        }
    }
};

/**
 * KPIExtractor - Extracts KPIs from organizational stories
 */
class KPIExtractor {
    constructor(options = {}) {
        this.mode = options.mode || 'hybrid'; // 'pattern', 'ai', 'hybrid'
        this.aiProvider = options.aiProvider || null;
    }

    /**
     * Extract all KPIs from story text
     * @param {string} storyText - The organizational story
     * @param {Object} options - Extraction options
     * @returns {Object} Extracted KPIs organized by face
     */
    async extract(storyText, options = {}) {
        const { mode = this.mode, aiMetrics = null } = options;

        // Start with pattern-based extraction (always works)
        const patternResults = this._extractWithPatterns(storyText);

        // If we have AI-extracted metrics, merge them
        let mergedResults = { ...patternResults };
        if (aiMetrics) {
            mergedResults = this._mergeResults(patternResults, aiMetrics);
        }

        // Organize by face
        const faceKPIs = this._organizeByFace(mergedResults);

        return {
            raw: mergedResults,
            byFace: faceKPIs,
            source: aiMetrics ? 'hybrid' : 'pattern',
            confidence: this._calculateConfidence(mergedResults)
        };
    }

    /**
     * Pattern-based extraction (offline-capable)
     */
    _extractWithPatterns(text) {
        const results = {};

        for (const [metric, config] of Object.entries(EXTRACTION_PATTERNS)) {
            for (const pattern of config.patterns) {
                const matches = [...text.matchAll(pattern)];
                if (matches.length > 0) {
                    const match = matches[0];
                    let value = parseFloat(match[1].replace(/,/g, ''));

                    // Apply multiplier if present
                    if (config.multipliers && match[2]) {
                        const multiplier = config.multipliers[match[2].toLowerCase()] || 1;
                        value *= multiplier;
                    }

                    results[metric] = {
                        value,
                        raw: match[0],
                        unit: config.unit || '',
                        source: 'pattern'
                    };
                    break; // Use first match for each metric
                }
            }
        }

        return results;
    }

    /**
     * Merge pattern results with AI-extracted metrics
     */
    _mergeResults(patternResults, aiMetrics) {
        const merged = { ...patternResults };

        // AI metrics take precedence if they seem valid
        for (const [key, value] of Object.entries(aiMetrics)) {
            if (value && value !== 'if mentioned' && value !== null) {
                // Clean the value
                let cleanValue = value;
                if (typeof value === 'string') {
                    // Try to extract number from string
                    const numMatch = value.match(/([\d,.]+)/);
                    if (numMatch) {
                        cleanValue = parseFloat(numMatch[1].replace(/,/g, ''));
                    }
                }

                merged[key] = {
                    value: cleanValue,
                    raw: value,
                    source: 'ai'
                };
            }
        }

        return merged;
    }

    /**
     * Organize extracted KPIs by face
     */
    _organizeByFace(results) {
        const faceKPIs = {};

        for (const [faceId, mapping] of Object.entries(FACE_KPI_MAPPING)) {
            const faceData = {
                faceId: parseInt(faceId),
                kpis: []
            };

            for (const kpiKey of mapping.kpis) {
                if (results[kpiKey]) {
                    faceData.kpis.push({
                        key: kpiKey,
                        label: mapping.labels[kpiKey],
                        value: results[kpiKey].value,
                        unit: results[kpiKey].unit || '',
                        source: results[kpiKey].source
                    });
                }
            }

            if (faceData.kpis.length > 0) {
                faceKPIs[faceId] = faceData;
            }
        }

        return faceKPIs;
    }

    /**
     * Calculate overall extraction confidence
     */
    _calculateConfidence(results) {
        const totalMetrics = Object.keys(EXTRACTION_PATTERNS).length;
        const extractedCount = Object.keys(results).length;

        if (extractedCount === 0) return 'none';
        if (extractedCount < 3) return 'low';
        if (extractedCount < 5) return 'medium';
        if (extractedCount < 7) return 'high';
        return 'very-high';
    }

    /**
     * Format extracted KPIs for display
     */
    formatForDisplay(extractionResult) {
        const { byFace, raw, confidence } = extractionResult;
        const display = [];

        for (const [faceId, data] of Object.entries(byFace)) {
            const faceSection = {
                faceId: data.faceId,
                items: data.kpis.map(kpi => ({
                    label: kpi.label,
                    value: this._formatValue(kpi.value, kpi.unit),
                    source: kpi.source === 'ai' ? '✨ AI' : '🔍 Pattern'
                }))
            };
            display.push(faceSection);
        }

        return {
            sections: display,
            summary: {
                totalExtracted: Object.keys(raw).length,
                confidence
            }
        };
    }

    /**
     * Format value for display
     */
    _formatValue(value, unit) {
        if (typeof value !== 'number') return value;

        if (unit === '%') {
            return `${value}%`;
        }

        if (value >= 1000000000) {
            return `$${(value / 1000000000).toFixed(1)}B`;
        }
        if (value >= 1000000) {
            return `$${(value / 1000000).toFixed(1)}M`;
        }
        if (value >= 1000) {
            return `$${(value / 1000).toFixed(0)}K`;
        }

        return value.toLocaleString() + (unit ? ` ${unit}` : '');
    }
}

// ========================================
// UI COMPONENT: KPI Extraction Panel
// ========================================

class KPIExtractionPanel {
    constructor(options = {}) {
        this.containerId = options.containerId || 'kpi-extraction-container';
        this.onExtracted = options.onExtracted || (() => {});
        this.extractor = new KPIExtractor();
        this._container = null;
        this._extractionResult = null;
    }

    init(container) {
        if (typeof container === 'string') {
            this._container = document.getElementById(container);
        } else {
            this._container = container;
        }

        if (!this._container) {
            console.error('[KPIExtractionPanel] Container not found');
            return;
        }

        this._render();
    }

    _render() {
        this._container.innerHTML = `
            <div class="kpi-extraction-panel" style="
                background: rgba(0, 0, 0, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                padding: 16px;
            ">
                <h3 style="
                    font-size: 14px;
                    margin: 0 0 12px 0;
                    color: rgba(255, 255, 255, 0.8);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                ">
                    📊 KPI Entry Mode
                </h3>

                <div class="kpi-mode-options" style="display: flex; gap: 8px; margin-bottom: 12px;">
                    <button type="button" class="kpi-mode-btn selected" data-mode="manual" style="
                        flex: 1;
                        padding: 12px;
                        border-radius: 8px;
                        border: 2px solid #6366f1;
                        background: rgba(99, 102, 241, 0.2);
                        color: #a5b4fc;
                        cursor: pointer;
                        font-size: 12px;
                        transition: all 0.2s;
                    ">
                        <div style="font-size: 18px; margin-bottom: 4px;">✍️</div>
                        <div style="font-weight: 600;">Manual Entry</div>
                        <div style="font-size: 10px; opacity: 0.7;">Fill in each KPI</div>
                    </button>

                    <button type="button" class="kpi-mode-btn" data-mode="extract" style="
                        flex: 1;
                        padding: 12px;
                        border-radius: 8px;
                        border: 2px solid transparent;
                        background: rgba(0, 0, 0, 0.2);
                        color: rgba(255, 255, 255, 0.6);
                        cursor: pointer;
                        font-size: 12px;
                        transition: all 0.2s;
                    ">
                        <div style="font-size: 18px; margin-bottom: 4px;">✨</div>
                        <div style="font-weight: 600;">AI-Assisted</div>
                        <div style="font-size: 10px; opacity: 0.7;">Extract from story</div>
                    </button>
                </div>

                <div id="kpi-extraction-result" style="display: none;"></div>
            </div>
        `;

        this._attachEventListeners();
    }

    _attachEventListeners() {
        const buttons = this._container.querySelectorAll('.kpi-mode-btn');

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const mode = btn.dataset.mode;
                this._selectMode(mode);
            });
        });
    }

    _selectMode(mode) {
        const buttons = this._container.querySelectorAll('.kpi-mode-btn');
        buttons.forEach(btn => {
            if (btn.dataset.mode === mode) {
                btn.style.borderColor = '#6366f1';
                btn.style.background = 'rgba(99, 102, 241, 0.2)';
                btn.style.color = '#a5b4fc';
                btn.classList.add('selected');
            } else {
                btn.style.borderColor = 'transparent';
                btn.style.background = 'rgba(0, 0, 0, 0.2)';
                btn.style.color = 'rgba(255, 255, 255, 0.6)';
                btn.classList.remove('selected');
            }
        });

        if (mode === 'extract') {
            this._triggerExtraction();
        } else {
            document.getElementById('kpi-extraction-result').style.display = 'none';
        }
    }

    async _triggerExtraction() {
        const resultDiv = document.getElementById('kpi-extraction-result');
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = '<div style="text-align: center; color: rgba(255,255,255,0.6);">🤖 AI is analyzing your story for KPIs...</div>';

        try {
            // Get story text from global or storage
            const storyText = window.currentStoryText || '';

            if (!storyText) {
                resultDiv.innerHTML = '<div style="color: #f87171;">⚠️ No story text found. Please analyze a story first.</div>';
                return;
            }

            // Get face names for context
            const faces = window.dodecahedronFaces || [];
            const faceNames = faces.map((f, i) => `Face ${i + 1}: ${f.name || f}`).join(', ');

            // Try AI-based extraction first using FallbackChain
            let result = null;
            let usedAI = false;

            if (window.FallbackChain) {
                try {
                    // Get mode from MappingContext instead of hardcoding 'quick'
                    const context = window.MappingContext?.getInstance?.() || { getMode: () => 'quick' };
                    const mode = context.getMode?.() || 'quick';

                    // Get detected octave from story analysis (stored in window or context)
                    const octave = window.overallOctave || context.getOverallOctave?.() || 'O2';

                    console.log(`[KPIExtractionPanel] Extracting KPIs in ${mode} mode, octave ${octave}...`);
                    resultDiv.innerHTML = `<div style="text-align: center; color: rgba(255,255,255,0.6);">🤖 Calling AI to generate intelligent KPI suggestions (${mode} mode, ${octave})...</div>`;

                    const fallbackChain = new window.FallbackChain();
                    const aiResult = await fallbackChain.extractKPIs(storyText, mode, octave);

                    if (aiResult && aiResult.kpis && aiResult.kpis.length > 0) {
                        // Convert AI result to our format
                        result = this._convertAIResultToDisplayFormat(aiResult, faces);
                        usedAI = true;
                        console.log('✅ AI KPI extraction succeeded:', aiResult);
                    }
                } catch (aiError) {
                    console.warn('AI KPI extraction failed, falling back to patterns:', aiError);
                }
            }

            // Fall back to pattern-based extraction if AI didn't work
            if (!result) {
                resultDiv.innerHTML = '<div style="text-align: center; color: rgba(255,255,255,0.6);">🔍 Using pattern matching to extract KPIs...</div>';
                const aiMetrics = window.extractedFinancials || (typeof window.getExtractedFinancials === 'function' ? window.getExtractedFinancials() : null);
                result = await this.extractor.extract(storyText, { aiMetrics });
            }

            this._extractionResult = result;
            this._extractionResult._usedAI = usedAI;

            this._renderExtractionResult(result, resultDiv);
            this.onExtracted(result);

        } catch (error) {
            console.error('KPI extraction failed:', error);
            resultDiv.innerHTML = `<div style="color: #f87171;">⚠️ Extraction failed: ${error.message}</div>`;
        }
    }

    /**
     * Convert AI result format to display format
     * Must match the format expected by formatForDisplay():
     * { byFace: { [faceId]: { faceId, kpis: [{ label, value, unit, source }] } }, raw, confidence }
     *
     * Enhanced for octave-stack architecture (Sprint 2):
     * - Supports element structure (earth/water/fire/air/ether)
     * - Includes questions for reflection
     * - Tracks octave level and source (AI vs template)
     */
    _convertAIResultToDisplayFormat(aiResult, faces) {
        const byFace = {};
        const raw = aiResult.financials || {};
        const mode = aiResult.mode || 'quick';
        const octave = aiResult.octave || 'O2';

        // Group KPIs by face in the expected format
        if (aiResult.kpis) {
            for (const kpi of aiResult.kpis) {
                const faceId = kpi.faceId || 1;
                if (!byFace[faceId]) {
                    // Get face name from faces array if available
                    const faceMeta = faces?.find?.(f => f.id === faceId);
                    byFace[faceId] = {
                        faceId: faceId,
                        faceName: faceMeta?.name || `Face ${faceId}`,
                        octave: octave,
                        kpis: []
                    };
                }

                // Build KPI object with enhanced structure
                const kpiObj = {
                    // Core fields
                    label: kpi.label || kpi.name || `KPI ${faceId}`,  // Support both 'label' and 'name'
                    value: kpi.value || null,
                    unit: kpi.unit || '',
                    source: kpi.source || (aiResult._meta?.provider) || 'ai',

                    // Enhanced octave-stack fields
                    question: kpi.question || '',
                    target: kpi.target || '0.618',
                    reasoning: kpi.reasoning || ''
                };

                // Add elemental structure for full mode (60 KPIs)
                if (mode === 'full' && kpi.element) {
                    kpiObj.element = kpi.element;
                    kpiObj.elementCode = kpi.elementCode || kpi.element?.toLowerCase() || 'earth';
                }

                byFace[faceId].kpis.push(kpiObj);

                // Also add to raw for totalExtracted count
                const kpiLabel = kpi.label || kpi.name || 'unknown';
                const kpiKey = kpiObj.elementCode
                    ? `face${faceId}_${kpiObj.elementCode}_${kpiLabel}`
                    : `face${faceId}_${kpiLabel}`;
                raw[kpiKey] = kpiObj.value;
            }
        }

        return {
            raw: raw,
            byFace: byFace,
            mode: mode,
            octave: octave,
            source: aiResult._meta?.provider || aiResult.source || 'ai',
            confidence: aiResult.source === 'offline' ? 'medium' : 'high',
            note: aiResult.note || null,
            _usedAI: aiResult.source !== 'offline'
        };
    }

    /**
     * Render extraction result with octave-stack architecture support
     * Handles both Quick Mode (12 KPIs) and Full Mode (60 KPIs)
     */
    _renderExtractionResult(result, container) {
        const mode = result.mode || 'quick';
        const octave = result.octave || 'O2';
        const isFullMode = mode === 'full';

        // Octave color mapping (chakra-based)
        const octaveColors = {
            'O1': '#ef4444', // Red - Survival
            'O2': '#f97316', // Orange - Structure
            'O3': '#eab308', // Yellow - Relationships
            'O4': '#22c55e', // Green - Creativity
            'O5': '#06b6d4', // Cyan - Expression
            'O6': '#6366f1', // Indigo - Vision
            'O7': '#a855f7'  // Violet - Radiance
        };

        const octaveNames = {
            'O1': 'Survival', 'O2': 'Structure', 'O3': 'Relationships',
            'O4': 'Creativity', 'O5': 'Expression', 'O6': 'Vision', 'O7': 'Radiance'
        };

        // Element symbols and colors
        const elementSymbols = {
            earth: { symbol: '🜃', color: '#8b4513', name: 'Earth' },
            water: { symbol: '🜄', color: '#1e90ff', name: 'Water' },
            fire: { symbol: '🜂', color: '#ff4500', name: 'Fire' },
            air: { symbol: '🜁', color: '#87ceeb', name: 'Air' },
            ether: { symbol: '✧', color: '#9370db', name: 'Ether' }
        };

        const byFace = result.byFace || {};
        const faceCount = Object.keys(byFace).length;
        const totalKPIs = Object.values(byFace).reduce((sum, f) => sum + (f.kpis?.length || 0), 0);

        if (faceCount === 0) {
            container.innerHTML = `
                <div style="
                    padding: 12px;
                    background: rgba(251, 191, 36, 0.1);
                    border-left: 3px solid #fbbf24;
                    border-radius: 4px;
                    color: rgba(255, 255, 255, 0.8);
                    font-size: 12px;
                ">
                    ⚠️ No KPIs extracted. Try adding more details to your story.
                </div>
            `;
            return;
        }

        // Build octave header
        const octaveColor = octaveColors[octave] || '#6366f1';
        const octaveName = octaveNames[octave] || 'Unknown';

        // Source indicator
        const sourceLabel = result._usedAI
            ? '✨ AI-Generated'
            : (result.source === 'offline' ? '📋 Template-Based' : '🔍 Pattern-Matched');

        // Render the main container
        container.innerHTML = `
            <div class="kpi-result-container" style="
                background: rgba(0, 0, 0, 0.3);
                border-radius: 12px;
                overflow: hidden;
            ">
                <!-- Octave Header -->
                <div class="octave-header" style="
                    background: linear-gradient(135deg, ${octaveColor}33, ${octaveColor}11);
                    border-bottom: 2px solid ${octaveColor};
                    padding: 12px 16px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <div>
                        <div style="
                            font-size: 10px;
                            text-transform: uppercase;
                            letter-spacing: 1px;
                            color: ${octaveColor};
                            margin-bottom: 2px;
                        ">Target Octave</div>
                        <div style="
                            font-size: 16px;
                            font-weight: 700;
                            color: white;
                        ">${octave} · ${octaveName}</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="
                            font-size: 10px;
                            color: rgba(255,255,255,0.6);
                        ">${sourceLabel}</div>
                        <div style="
                            font-size: 14px;
                            color: white;
                            font-weight: 600;
                        ">${totalKPIs} KPIs</div>
                    </div>
                </div>

                <!-- Mode Badge -->
                <div style="
                    padding: 8px 16px;
                    background: rgba(0,0,0,0.2);
                    display: flex;
                    gap: 8px;
                    align-items: center;
                    font-size: 11px;
                ">
                    <span style="
                        background: ${isFullMode ? '#22c55e' : '#6366f1'}33;
                        color: ${isFullMode ? '#22c55e' : '#6366f1'};
                        padding: 2px 8px;
                        border-radius: 4px;
                        font-weight: 600;
                    ">${isFullMode ? 'Full Mode (5 Elements)' : 'Quick Mode'}</span>
                    <span style="color: rgba(255,255,255,0.5);">·</span>
                    <span style="color: rgba(255,255,255,0.6);">${faceCount} faces covered</span>
                </div>

                <!-- KPI List by Face -->
                <div class="kpi-faces-list" style="
                    max-height: 400px;
                    overflow-y: auto;
                    padding: 8px;
                ">
                    ${Object.entries(byFace).map(([faceId, faceData]) => {
                        const faceName = faceData.faceName || `Face ${faceId}`;
                        const kpis = faceData.kpis || [];

                        // Group by element for full mode
                        const elementGroups = {};
                        if (isFullMode) {
                            kpis.forEach(kpi => {
                                const elem = (kpi.elementCode || kpi.element || 'earth').toLowerCase();
                                if (!elementGroups[elem]) elementGroups[elem] = [];
                                elementGroups[elem].push(kpi);
                            });
                        }

                        return `
                            <div class="face-card" style="
                                background: rgba(255,255,255,0.03);
                                border: 1px solid rgba(255,255,255,0.1);
                                border-radius: 8px;
                                margin-bottom: 8px;
                                overflow: hidden;
                            ">
                                <div class="face-header" style="
                                    background: rgba(255,255,255,0.05);
                                    padding: 8px 12px;
                                    border-bottom: 1px solid rgba(255,255,255,0.1);
                                    display: flex;
                                    justify-content: space-between;
                                    align-items: center;
                                ">
                                    <span style="
                                        font-weight: 600;
                                        color: white;
                                        font-size: 12px;
                                    ">Face ${faceId}: ${faceName}</span>
                                    <span style="
                                        font-size: 10px;
                                        color: rgba(255,255,255,0.5);
                                    ">${kpis.length} KPIs</span>
                                </div>

                                <div class="face-kpis" style="padding: 8px 12px;">
                                    ${isFullMode ? this._renderElementalKPIs(elementGroups, elementSymbols) : this._renderSimpleKPIs(kpis)}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>

                <!-- Coherence Warning (if any) -->
                ${result.note ? `
                    <div style="
                        padding: 10px 16px;
                        background: rgba(251, 191, 36, 0.1);
                        border-top: 1px solid rgba(251, 191, 36, 0.3);
                        color: #fbbf24;
                        font-size: 11px;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    ">
                        <span>⚠️</span>
                        <span>${result.note}</span>
                    </div>
                ` : ''}

                <!-- Apply Button -->
                <div style="
                    padding: 12px 16px;
                    background: rgba(0,0,0,0.2);
                    text-align: center;
                ">
                    <button type="button" id="apply-extracted-kpis" style="
                        background: linear-gradient(135deg, ${octaveColor}, ${octaveColor}cc);
                        color: white;
                        border: none;
                        padding: 10px 24px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 13px;
                        font-weight: 600;
                        transition: all 0.2s;
                        box-shadow: 0 2px 8px ${octaveColor}44;
                    ">
                        ✅ Apply ${totalKPIs} KPIs to Assessment
                    </button>
                </div>
            </div>
        `;

        // Attach apply button listener
        document.getElementById('apply-extracted-kpis')?.addEventListener('click', () => {
            this._applyExtractedKPIs(result);
        });
    }

    /**
     * Render elemental KPIs grouped by element (for Full Mode)
     */
    _renderElementalKPIs(elementGroups, elementSymbols) {
        const elements = ['earth', 'water', 'fire', 'air', 'ether'];

        return elements.map(elem => {
            const kpis = elementGroups[elem] || [];
            if (kpis.length === 0) return '';

            const { symbol, color, name } = elementSymbols[elem] || { symbol: '•', color: '#888', name: elem };

            return `
                <div class="element-group" style="margin-bottom: 8px;">
                    <div style="
                        display: flex;
                        align-items: center;
                        gap: 6px;
                        margin-bottom: 4px;
                        padding-bottom: 4px;
                        border-bottom: 1px solid ${color}33;
                    ">
                        <span style="color: ${color}; font-size: 14px;">${symbol}</span>
                        <span style="
                            font-size: 10px;
                            text-transform: uppercase;
                            letter-spacing: 0.5px;
                            color: ${color};
                            font-weight: 600;
                        ">${name}</span>
                    </div>
                    ${kpis.map(kpi => this._renderSingleKPI(kpi, color)).join('')}
                </div>
            `;
        }).join('');
    }

    /**
     * Render simple KPI list (for Quick Mode)
     */
    _renderSimpleKPIs(kpis) {
        return kpis.map(kpi => this._renderSingleKPI(kpi, '#10b981')).join('');
    }

    /**
     * Render a single KPI item
     */
    _renderSingleKPI(kpi, accentColor) {
        const sourceIcon = kpi.source === 'ai' ? '✨' : (kpi.source === 'csv_template' ? '📋' : '🔍');
        const valueDisplay = kpi.value !== null && kpi.value !== undefined
            ? `<span style="color: ${accentColor};">${kpi.value}${kpi.unit ? ' ' + kpi.unit : ''}</span>`
            : '<span style="color: rgba(255,255,255,0.3);">—</span>';

        return `
            <div class="kpi-item" style="
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                padding: 4px 0;
                font-size: 11px;
            ">
                <div style="flex: 1; min-width: 0;">
                    <div style="
                        color: rgba(255,255,255,0.9);
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    " title="${kpi.label}">${kpi.label}</div>
                    ${kpi.question ? `
                        <div style="
                            color: rgba(255,255,255,0.4);
                            font-size: 9px;
                            font-style: italic;
                            margin-top: 1px;
                        ">${kpi.question}</div>
                    ` : ''}
                </div>
                <div style="
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    margin-left: 8px;
                    flex-shrink: 0;
                ">
                    ${valueDisplay}
                    <span style="font-size: 9px;" title="${kpi.source || 'unknown'}">${sourceIcon}</span>
                </div>
            </div>
        `;
    }

    _applyExtractedKPIs(result) {
        // Emit event for parent component to handle
        const event = new CustomEvent('kpis-extracted', {
            detail: result
        });
        window.dispatchEvent(event);

        // Visual feedback
        const btn = document.getElementById('apply-extracted-kpis');
        if (btn) {
            btn.innerHTML = '✓ Applied!';
            btn.disabled = true;
        }

        console.log('📊 KPIs applied:', result.byFace);
    }

    getExtractionResult() {
        return this._extractionResult;
    }

    destroy() {
        if (this._container) {
            this._container.innerHTML = '';
        }
    }
}

// ========================================
// EXPORTS
// ========================================

export { KPIExtractor, KPIExtractionPanel, EXTRACTION_PATTERNS, FACE_KPI_MAPPING };

// Export for browser global
if (typeof window !== 'undefined') {
    window.KPIExtractor = KPIExtractor;
    window.KPIExtractionPanel = KPIExtractionPanel;
}

console.log('✅ KPIExtractor module loaded');
