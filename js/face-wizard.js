/**
 * Face Wizard - Template Selection and Face Definition
 *
 * Handles Stage 1 of the demo: Defining the 12 organizational faces
 */

// Face Templates
const FACE_TEMPLATES = {
    business: {
        name: "Standard Business Model",
        faces: [
            { id: 1, name: "Financial Capital", icon: "💰" },
            { id: 2, name: "Human Capital", icon: "👥" },
            { id: 3, name: "Customer Experience", icon: "❤️" },
            { id: 4, name: "Operations & Execution", icon: "⚙️" },
            { id: 5, name: "Technology & Innovation", icon: "💡" },
            { id: 6, name: "Brand & Reputation", icon: "✨" },
            { id: 7, name: "Leadership & Governance", icon: "👑" },
            { id: 8, name: "Strategy & Vision", icon: "🎯" },
            { id: 9, name: "Partnerships & Ecosystem", icon: "🤝" },
            { id: 10, name: "Risk & Compliance", icon: "🛡️" },
            { id: 11, name: "Learning & Development", icon: "📚" },
            { id: 12, name: "Sustainability & Impact", icon: "🌍" }
        ]
    },

    startup: {
        name: "Startup Framework",
        faces: [
            { id: 1, name: "Product-Market Fit", icon: "🎯" },
            { id: 2, name: "Funding & Runway", icon: "💵" },
            { id: 3, name: "Team & Culture", icon: "👥" },
            { id: 4, name: "Technology Stack", icon: "⚡" },
            { id: 5, name: "Customer Acquisition", icon: "📈" },
            { id: 6, name: "Revenue Model", icon: "💰" },
            { id: 7, name: "Competitive Position", icon: "🏆" },
            { id: 8, name: "Operational Efficiency", icon: "⚙️" },
            { id: 9, name: "Founder Alignment", icon: "🤝" },
            { id: 10, name: "Market Timing", icon: "⏰" },
            { id: 11, name: "Scalability Potential", icon: "🚀" },
            { id: 12, name: "Risk Management", icon: "🛡️" }
        ]
    },

    nonprofit: {
        name: "Non-Profit Model",
        faces: [
            { id: 1, name: "Mission Clarity", icon: "🌟" },
            { id: 2, name: "Impact Measurement", icon: "📊" },
            { id: 3, name: "Community Engagement", icon: "🤝" },
            { id: 4, name: "Funding Diversity", icon: "💰" },
            { id: 5, name: "Volunteer Capacity", icon: "👥" },
            { id: 6, name: "Program Effectiveness", icon: "✅" },
            { id: 7, name: "Board Governance", icon: "👑" },
            { id: 8, name: "Stakeholder Trust", icon: "❤️" },
            { id: 9, name: "Operational Sustainability", icon: "♻️" },
            { id: 10, name: "Advocacy & Influence", icon: "📣" },
            { id: 11, name: "Learning Culture", icon: "📚" },
            { id: 12, name: "Financial Health", icon: "💵" }
        ]
    },

    project: {
        name: "Project Management",
        faces: [
            { id: 1, name: "Scope & Requirements", icon: "📋" },
            { id: 2, name: "Timeline & Milestones", icon: "⏱️" },
            { id: 3, name: "Budget & Resources", icon: "💰" },
            { id: 4, name: "Team Performance", icon: "👥" },
            { id: 5, name: "Stakeholder Engagement", icon: "🗣️" },
            { id: 6, name: "Quality Standards", icon: "⭐" },
            { id: 7, name: "Risk Management", icon: "⚠️" },
            { id: 8, name: "Change Control", icon: "🔄" },
            { id: 9, name: "Dependencies & Integration", icon: "🔗" },
            { id: 10, name: "Technical Delivery", icon: "🔧" },
            { id: 11, name: "Knowledge Transfer", icon: "📖" },
            { id: 12, name: "Value Realization", icon: "🎁" }
        ]
    },

    custom: {
        name: "Custom",
        faces: [
            { id: 1, name: "Face 1", icon: "1️⃣" },
            { id: 2, name: "Face 2", icon: "2️⃣" },
            { id: 3, name: "Face 3", icon: "3️⃣" },
            { id: 4, name: "Face 4", icon: "4️⃣" },
            { id: 5, name: "Face 5", icon: "5️⃣" },
            { id: 6, name: "Face 6", icon: "6️⃣" },
            { id: 7, name: "Face 7", icon: "7️⃣" },
            { id: 8, name: "Face 8", icon: "8️⃣" },
            { id: 9, name: "Face 9", icon: "9️⃣" },
            { id: 10, name: "Face 10", icon: "🔟" },
            { id: 11, name: "Face 11", icon: "1️⃣1️⃣" },
            { id: 12, name: "Face 12", icon: "1️⃣2️⃣" }
        ]
    },

    // AI Story Mode (Placeholder for logic)
    story: {
        name: "AI Story Mode",
        faces: [] // Populated dynamically
    }
};

// Current configuration
let currentTemplate = null;
let currentFaces = [];
let geminiApiKey = localStorage.getItem('gemini_api_key'); // Load stored key
let openaiApiKey = localStorage.getItem('openai_api_key'); // Load stored OpenAI key
let selectedProvider = localStorage.getItem('selected_provider') || 'gemini'; // Default to Gemini

// Sprint 2: Strategic Lenses & Octave State
let currentLenses = null;       // { growth, stability, innovation } from AI
let selectedLens = null;        // 'growth' | 'stability' | 'innovation'
let faceOctaves = new Map();    // Map<faceId, {octave, reasoning}>
let overallOctave = null;       // O1-O7
let currentStoryText = '';      // Store story for subsequent AI calls
let extractedKPIs = [];         // KPIs extracted by AI from story
let extractedFinancials = {};   // Financial data (revenue, runway, etc.)

// Octave display constants
const OCTAVE_INFO = {
    O1: { icon: '🔴', name: 'Survival', desc: 'Baseline viability - keeping lights on' },
    O2: { icon: '🟠', name: 'Structure', desc: 'Systematization - building foundation' },
    O3: { icon: '🟡', name: 'Relationships', desc: 'Network development - growing your tribe' },
    O4: { icon: '🟢', name: 'Creativity', desc: 'Innovation activation - expressing unique value' },
    O5: { icon: '🔵', name: 'Expression', desc: 'Communication optimization - being heard' },
    O6: { icon: '🟣', name: 'Vision', desc: 'Strategic foresight - seeing what\'s coming' },
    O7: { icon: '⚪', name: 'Radiance', desc: 'Systemic transcendence - lighthouse stage' }
};

// Import AI Clients (Dynamic Import in analyzeStory)

/**
 * Select a template
 */
function selectTemplate(templateKey) {
    // Update UI
    document.querySelectorAll('.template-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.getElementById(`template-${templateKey}`).classList.add('selected');

    currentTemplate = templateKey;

    // Handle Story Mode separately
    if (templateKey === 'story') {
        document.getElementById('storyModeSection').style.display = 'block';
        document.getElementById('faceEditorSection').style.display = 'none';
        document.getElementById('step1NextBtn').disabled = true;

        // Sprint 2: Show the AI configuration panel FIRST (contains API key manager)
        if (typeof window.showSprint2Panel === 'function') {
            window.showSprint2Panel();
        }

        // Legacy API Key section (now handled by Sprint 2 APIKeyManager)
        const legacyApiSection = document.getElementById('apiKeySection');
        if (legacyApiSection) {
            legacyApiSection.style.display = 'block';
        }

        // Pre-fill keys if available (legacy inputs - may not exist in Sprint 2)
        const geminiInput = document.getElementById('geminiKeyInput');
        const openaiInput = document.getElementById('openaiKeyInput');
        if (geminiApiKey && geminiInput) {
            geminiInput.value = geminiApiKey;
        }
        if (openaiApiKey && openaiInput) {
            openaiInput.value = openaiApiKey;
        }

        // Initialize provider selection UI (if legacy function exists)
        if (typeof selectProvider === 'function') {
            selectProvider(selectedProvider);
        }

        return;
    }

    // Hide Sprint 2 panel for non-AI templates
    if (typeof window.hideSprint2Panel === 'function') {
        window.hideSprint2Panel();
    }

    // Hide AI sections (with null checks for different HTML contexts)
    const storySection = document.getElementById('storyModeSection');
    const apiSection = document.getElementById('apiKeySection');
    const faceSection = document.getElementById('faceEditorSection');

    if (storySection) storySection.style.display = 'none';
    if (apiSection) apiSection.style.display = 'none';

    // Standard Templates
    currentFaces = JSON.parse(JSON.stringify(FACE_TEMPLATES[templateKey].faces));

    // Show face editor
    if (faceSection) {
        faceSection.style.display = 'block';
        renderFaceEditor();
    }

    // Sprint 2 FIX: Sync to MappingContext for validation
    if (window.Sprint2 && window.Sprint2.mappingContext) {
        const facesConfig = currentFaces.map((face, index) => ({
            id: index + 1,
            name: face.name,
            icon: face.icon || '',
            source: 'template'
        }));
        window.Sprint2.mappingContext.setAllFaces(facesConfig);
        console.log('✅ Sprint 2: Synced faces to MappingContext');
    }

    // Enable next button
    document.getElementById('step1NextBtn').disabled = false;

    console.log(`✅ Template selected: ${FACE_TEMPLATES[templateKey].name}`);
}

/**
 * Select AI Provider
 */
function selectProvider(provider) {
    selectedProvider = provider;
    localStorage.setItem('selected_provider', provider);

    // Update UI buttons
    const geminiBtn = document.getElementById('providerGeminiBtn');
    const openaiBtn = document.getElementById('providerOpenAIBtn');
    const geminiSection = document.getElementById('geminiKeySection');
    const openaiSection = document.getElementById('openaiKeySection');

    if (provider === 'gemini') {
        geminiBtn.style.background = 'rgba(66, 133, 244, 0.3)';
        geminiBtn.style.borderColor = '#4285f4';
        openaiBtn.style.background = 'rgba(16, 163, 127, 0.1)';
        openaiBtn.style.borderColor = 'transparent';
        geminiSection.style.display = 'block';
        openaiSection.style.display = 'none';
    } else {
        openaiBtn.style.background = 'rgba(16, 163, 127, 0.3)';
        openaiBtn.style.borderColor = '#10a37f';
        geminiBtn.style.background = 'rgba(66, 133, 244, 0.1)';
        geminiBtn.style.borderColor = 'transparent';
        geminiSection.style.display = 'none';
        openaiSection.style.display = 'block';
    }

    console.log(`🤖 Provider selected: ${provider}`);
}

/**
 * Save Gemini API Key
 */
function saveGeminiKey() {
    const key = document.getElementById('geminiKeyInput').value.trim();
    if (key.length > 10) {
        localStorage.setItem('gemini_api_key', key);
        geminiApiKey = key;
        alert('✅ Gemini API Key Saved! You can now use AI Story Mode.');
    } else {
        alert('❌ Invalid API Key');
    }
}

/**
 * Save OpenAI API Key
 */
function saveOpenAIKey() {
    const key = document.getElementById('openaiKeyInput').value.trim();
    if (key.startsWith('sk-') && key.length > 20) {
        localStorage.setItem('openai_api_key', key);
        openaiApiKey = key;
        alert('✅ OpenAI API Key Saved! You can now use AI Story Mode with GPT-5-nano.');
    } else {
        alert('❌ Invalid API Key. OpenAI keys start with "sk-"');
    }
}

/**
 * Analyze Story with Resilient Fallback Chain
 *
 * Fallback Order:
 * 1. Primary Provider (Gemini or OpenAI)
 * 2. Secondary Provider (the other one)
 * 3. OfflineProvider (semantic analysis)
 * 4. Cached Demo Data
 */
async function analyzeStory() {
    const text = document.getElementById('storyInput').value;
    if (!text || text.trim().length < 10) {
        alert("Please enter a longer story or description.");
        return;
    }

    // Store story for subsequent AI calls (both local and global for KPI extractor)
    currentStoryText = text;
    window.currentStoryText = text;

    const btn = document.querySelector('#storyModeSection .btn-primary');
    const originalText = btn.innerHTML;
    btn.disabled = true;

    // =====================================================
    // Get Pre-Selected Lens and Vocabulary Style
    // =====================================================
    let selectedLens = 'growth'; // default
    let lensPromptModifier = '';
    let vocabularyStyle = 'professional'; // default
    let vocabularyPromptModifier = '';

    // Get lens from LensPreSelector (if initialized)
    if (window.lensPreSelector) {
        selectedLens = window.lensPreSelector.getSelectedLens();
        lensPromptModifier = window.lensPreSelector.getPromptModifier();
        console.log(`🔮 Using Strategic Lens: ${selectedLens}`);
    } else {
        // Fallback: read from localStorage
        selectedLens = localStorage.getItem('quannex_selected_lens') || 'growth';
        console.log(`🔮 Using Lens from storage: ${selectedLens}`);
    }

    // Get vocabulary style (if initialized)
    if (window.vocabularyStyleSelector) {
        vocabularyStyle = window.vocabularyStyleSelector.getSelectedStyle();
        vocabularyPromptModifier = window.vocabularyStyleSelector.getPromptModifier();
        console.log(`🎨 Using Vocabulary Style: ${vocabularyStyle}`);
    } else {
        vocabularyStyle = localStorage.getItem('quannex_vocabulary_style') || 'professional';
        console.log(`🎨 Using Vocabulary from storage: ${vocabularyStyle}`);
    }

    try {
        // Import and initialize the FallbackChain
        const { FallbackChain } = await import('./ai/providers/fallback-chain.js');

        const fallbackChain = new FallbackChain({
            geminiKey: geminiApiKey,
            openaiKey: openaiApiKey,
            preferredProvider: selectedProvider,
            onProviderChange: (provider, status) => {
                if (status === 'attempting') {
                    const icons = { gemini: '✨', openai: '🧠', offline: '📴' };
                    const names = { gemini: 'Gemini', openai: 'GPT-5-nano', offline: 'Offline Mode' };
                    btn.innerHTML = `${icons[provider] || '🔄'} ${names[provider] || provider} Thinking...`;
                }
            },
            onFallback: (failedProvider, error) => {
                console.warn(`⚠️ Fallback triggered: ${failedProvider} failed - ${error}`);
            }
        });

        // =====================================================
        // PHASE 1: Story Analysis with Lens & Vocabulary
        // =====================================================
        btn.innerHTML = `🔮 Analyzing with ${selectedLens.charAt(0).toUpperCase() + selectedLens.slice(1)} Lens...`;

        // Pass lens and vocabulary context to story analysis
        const analysisContext = {
            lens: selectedLens,
            lensPrompt: lensPromptModifier,
            vocabulary: vocabularyStyle,
            vocabularyPrompt: vocabularyPromptModifier
        };

        const storyResult = await fallbackChain.analyzeStory(text, analysisContext);
        currentFaces = storyResult.faces;

        // Store the lens used for this analysis
        currentLenses = { selected: selectedLens };

        const usedProvider = storyResult._meta?.provider || 'unknown';
        const fallbackUsed = storyResult._meta?.fallbackUsed || false;

        console.log(`✅ Story analysis complete via ${usedProvider}${fallbackUsed ? ' (fallback)' : ''}`);
        console.log(`   Lens: ${selectedLens}, Vocabulary: ${vocabularyStyle}`);
        console.log(`   Detected Stage: ${storyResult.detectedStage || 'unknown'}, Max Octave: ${storyResult.maxOctave || 'O7'}`);

        // =====================================================
        // CONSOLIDATED RESPONSE: Extract octaves from single call
        // =====================================================
        btn.innerHTML = '🎵 Processing Developmental Octaves...';

        // Get overall octave from consolidated response
        overallOctave = storyResult.overallOctave || 'O2';

        // Extract face-level octaves from consolidated response
        faceOctaves.clear();
        if (storyResult.faces) {
            storyResult.faces.forEach(face => {
                if (face.octave) {
                    faceOctaves.set(face.id, {
                        octave: face.octave,
                        reasoning: face.reasoning || 'Determined from story analysis'
                    });
                }
            });
        }
        console.log(`🎵 Overall Octave: ${overallOctave}, Face assignments:`, faceOctaves.size);

        // Update octave display
        updateOctaveDisplay(overallOctave);

        // =====================================================
        // CONSOLIDATED RESPONSE: Extract metrics from single call
        // =====================================================
        if (storyResult.extractedMetrics) {
            extractedFinancials = storyResult.extractedMetrics;
            console.log(`📊 Extracted metrics from consolidated call:`, extractedFinancials);
        } else {
            // Fallback: use pattern-based extraction
            extractedFinancials = extractFinancialsFromText(text);
        }

        // =====================================================
        // CONSOLIDATED RESPONSE: Extract archetype from single call
        // =====================================================
        if (storyResult.archetype) {
            console.log(`🎭 Detected Archetype: ${storyResult.archetype.primary} / ${storyResult.archetype.secondary}`);
            // Store for later use
            window.detectedArchetype = storyResult.archetype;
        }

        // =====================================================
        // PHASE 2: KPI EXTRACTION (THE MISSING PIECE!)
        // =====================================================
        btn.innerHTML = '📊 Extracting KPIs...';

        try {
            // Get mode from MappingContext if available, default to 'quick'
            const kpiMode = window.Sprint2?.mappingContext?.getMode?.() || 'quick';

            // Call KPI extraction with story, mode, and detected octave
            const kpiResult = await fallbackChain.extractKPIs(text, kpiMode, overallOctave);

            if (kpiResult && kpiResult.kpis && kpiResult.kpis.length > 0) {
                // Populate the extractedKPIs array (THIS WAS MISSING!)
                extractedKPIs = kpiResult.kpis.map(kpi => ({
                    faceId: kpi.faceId || 1,
                    name: kpi.name || kpi.label || 'KPI',
                    value: kpi.value,
                    unit: kpi.unit || '',
                    source: kpi.source || 'ai',
                    question: kpi.question || '',
                    target: kpi.target || ''
                }));

                // Also merge any extracted financials
                if (kpiResult.financials) {
                    extractedFinancials = { ...extractedFinancials, ...kpiResult.financials };
                }

                console.log(`📊 KPI Extraction Complete: ${extractedKPIs.length} KPIs extracted`);
                console.log('   Sample KPIs:', extractedKPIs.slice(0, 3));
            } else {
                console.warn('⚠️ KPI extraction returned no results, using financials only');
                // Create minimal KPIs from financials as fallback
                extractedKPIs = Object.entries(extractedFinancials).map(([key, data], index) => ({
                    faceId: index + 1,
                    name: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
                    value: data.value,
                    unit: '',
                    source: 'extracted'
                }));
            }
        } catch (kpiError) {
            console.warn('⚠️ KPI extraction failed, continuing with financials:', kpiError.message);
            // Fallback: create KPIs from extracted financials
            extractedKPIs = Object.entries(extractedFinancials).map(([key, data], index) => ({
                faceId: index + 1,
                name: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
                value: data.value,
                unit: '',
                source: 'extracted'
            }));
        }

        // Update UI
        document.getElementById('faceEditorSection').style.display = 'block';
        renderFaceEditor();
        document.getElementById('step1NextBtn').disabled = false;

        // Show notification about provider used
        if (fallbackUsed) {
            console.log(`📢 Analysis completed using fallback: ${usedProvider}`);
            // Could show a subtle notification to user here
        }

    } catch (error) {
        console.error("❌ All providers failed:", error);
        alert(`⚠️ Analysis Error: ${error.message}\n\nUsing emergency fallback.`);
        runLocalFallback(text);
    }

    // Restore button
    btn.innerHTML = originalText;
    btn.disabled = false;
}

/**
 * Local Fallback (The "Mini-Expert" Engine)
 */
function runLocalFallback(text) {
    const results = runSemanticAnalysis(text);
    currentFaces = results.faces;

    document.getElementById('faceEditorSection').style.display = 'block';
    renderFaceEditor();
    document.getElementById('step1NextBtn').disabled = false;

    alert(`✨ Analysis Complete (Local Mode)\n\nDetected Pattern: ${results.type}\n\nWe've mapped your story to the 12 faces.`);
}

/**
 * Run Semantic Analysis (Mini Expert System)
 */
function runSemanticAnalysis(text) {
    const lowerText = text.toLowerCase();

    // 1. Detect Organization Type
    let type = "business";
    let scores = { business: 0, startup: 0, nonprofit: 0 };

    const keywords = {
        business: ['profit', 'revenue', 'market', 'sales', 'customer', 'product', 'company'],
        startup: ['growth', 'scale', 'funding', 'investor', 'product', 'user', 'platform', 'tech'],
        nonprofit: ['mission', 'impact', 'community', 'donor', 'volunteer', 'social', 'change']
    };

    Object.keys(keywords).forEach(key => {
        keywords[key].forEach(word => {
            if (lowerText.includes(word)) scores[key]++;
        });
    });

    // Find winner
    if (scores.nonprofit > scores.business && scores.nonprofit > scores.startup) type = "nonprofit";
    else if (scores.startup > scores.business) type = "startup";

    // 2. Get Base Template
    let faces = JSON.parse(JSON.stringify(FACE_TEMPLATES[type].faces));

    // 3. Semantic Overrides (Rename faces based on specific keywords)
    // Map keywords to specific Face IDs
    const overrides = [
        { words: ['blockchain', 'web3', 'crypto'], faceId: 5, name: 'Decentralized Tech' },
        { words: ['supply chain', 'logistics'], faceId: 4, name: 'Supply Chain Ops' },
        { words: ['community', 'tribe'], faceId: 9, name: 'Community Ecosystem' },
        { words: ['sustainability', 'green', 'climate'], faceId: 12, name: 'Regenerative Impact' },
        { words: ['brand', 'story', 'narrative'], faceId: 6, name: 'Strategic Narrative' },
        { words: ['culture', 'wellbeing', 'health'], faceId: 2, name: 'Team Wellbeing' }
    ];

    let focus = "General Management";

    overrides.forEach(rule => {
        if (rule.words.some(w => lowerText.includes(w))) {
            const face = faces.find(f => f.id === rule.faceId);
            if (face) {
                face.name = rule.name; // Rename face
                face.icon = "✨"; // Mark as AI enhanced
                focus = rule.name; // Track primary focus
            }
        }
    });

    return {
        faces: faces,
        type: type.charAt(0).toUpperCase() + type.slice(1),
        focus: focus
    };
}

// =====================================================
// SPRINT 2: Strategic Lenses & Octave Functions
// =====================================================

/**
 * Populate the Strategic Lens Selector UI
 */
function populateLensSelector(lenses) {
    const container = document.getElementById('lensCards');
    const section = document.getElementById('lensSelectorSection');

    if (!container || !lenses) {
        console.warn('Lens selector not found or no lenses provided');
        return;
    }

    const lensTypes = [
        { key: 'growth', icon: '🌱', title: 'Growth Lens', subtitle: 'Face-centered: Domain expansion' },
        { key: 'stability', icon: '⚖️', title: 'Stability Lens', subtitle: 'Edge-centered: Relationship health' },
        { key: 'innovation', icon: '💡', title: 'Innovation Lens', subtitle: 'Vertex-centered: Emergent synergies' }
    ];

    container.innerHTML = lensTypes.map(lens => {
        const lensData = lenses[lens.key];
        const description = lensData?.description || 'Analyze your organization from this perspective';

        return `
            <div class="lens-card" id="lens-${lens.key}"
                 onclick="selectLens('${lens.key}')"
                 style="background: rgba(0,0,0,0.4); border: 2px solid rgba(255,255,255,0.2);
                        border-radius: 12px; padding: 20px; cursor: pointer; transition: all 0.3s ease;">
                <div style="font-size: 32px; margin-bottom: 10px;">${lens.icon}</div>
                <div style="font-size: 16px; font-weight: 600; color: #00ffcc; margin-bottom: 5px;">
                    ${lensData?.name || lens.title}
                </div>
                <div style="font-size: 12px; color: rgba(255,255,255,0.5); margin-bottom: 10px;">
                    ${lens.subtitle}
                </div>
                <div style="font-size: 13px; color: rgba(255,255,255,0.7); line-height: 1.4;">
                    ${description}
                </div>
            </div>
        `;
    }).join('');

    // Show the section
    section.style.display = 'block';
    console.log('📐 Lens selector populated');
}

/**
 * Apply a selected Strategic Lens
 */
function selectLens(lensType) {
    if (!currentLenses || !currentLenses[lensType]) {
        console.warn(`Lens '${lensType}' not available`);
        return;
    }

    selectedLens = lensType;
    const lensData = currentLenses[lensType];

    // Update visual selection
    document.querySelectorAll('.lens-card').forEach(card => {
        card.style.borderColor = 'rgba(255,255,255,0.2)';
        card.style.background = 'rgba(0,0,0,0.4)';
    });

    const selectedCard = document.getElementById(`lens-${lensType}`);
    if (selectedCard) {
        selectedCard.style.borderColor = '#00ffcc';
        selectedCard.style.background = 'rgba(0,255,204,0.1)';
    }

    // Apply lens face configuration if available
    if (lensData.faces && Array.isArray(lensData.faces)) {
        // Merge lens emphasis into current faces
        lensData.faces.forEach(lensFace => {
            const face = currentFaces.find(f => f.id === lensFace.id);
            if (face) {
                // Keep name but add emphasis
                face.emphasis = lensFace.emphasis;
                // Optionally override name if lens provides one
                if (lensFace.name && lensFace.name !== face.name) {
                    face.lensName = lensFace.name;
                }
            }
        });

        // Re-render with lens emphasis
        renderFaceEditor();
    }

    console.log(`📐 Lens selected: ${lensType} - ${lensData.name}`);
}

/**
 * Extract financial data from text using regex patterns (fallback)
 */
function extractFinancialsFromText(text) {
    const patterns = {
        revenue: /(?:revenue|sales|income|turnover)(?:\s+(?:of|is|was|:))?\s*\$?([\d,.]+)\s*(k|m|b|million|billion|thousand)?/i,
        teamSize: /(?:team|employees|staff|people|members)(?:\s+(?:of|has|have|is))?\s*(\d+)/i,
        runway: /(?:runway|cash|funds)(?:\s+(?:of|for))?\s*(\d+)\s*months?/i,
        growthRate: /(?:growing|growth|grew)(?:\s+(?:at|by|of))?\s*([\d.]+)%/i,
        customers: /(?:customers|clients|users)(?:\s+(?:of|has|have|is))?\s*([\d,]+)/i,
        funding: /(?:raised|funding|investment)(?:\s+(?:of|is))?\s*\$?([\d,.]+)\s*(k|m|million)?/i
    };

    const financials = {};

    for (const [key, pattern] of Object.entries(patterns)) {
        const match = text.match(pattern);
        if (match) {
            let value = match[1].replace(/,/g, '');
            const multiplier = match[2]?.toLowerCase();

            if (multiplier) {
                if (multiplier === 'k' || multiplier === 'thousand') value = parseFloat(value) * 1000;
                else if (multiplier === 'm' || multiplier === 'million') value = parseFloat(value) * 1000000;
                else if (multiplier === 'b' || multiplier === 'billion') value = parseFloat(value) * 1000000000;
            }

            financials[key] = {
                value: parseFloat(value) || value,
                source: 'extracted',
                rawMatch: match[0]
            };
        }
    }

    console.log('📊 Fallback financial extraction:', financials);
    return financials;
}

/**
 * Update the Overall Octave Display
 */
function updateOctaveDisplay(octave) {
    const section = document.getElementById('octaveDisplaySection');
    const iconEl = document.getElementById('overallOctaveIcon');
    const labelEl = document.getElementById('overallOctaveLabel');
    const descEl = document.getElementById('overallOctaveDesc');

    if (!section || !octave) return;

    const info = OCTAVE_INFO[octave] || OCTAVE_INFO.O4;

    if (iconEl) iconEl.textContent = info.icon;
    if (labelEl) labelEl.textContent = `${octave} - ${info.name}`;
    if (descEl) descEl.textContent = info.desc;

    section.style.display = 'block';
    console.log(`🎵 Octave display updated: ${octave}`);
}

/**
 * Render face editor
 */
function renderFaceEditor() {
    const grid = document.getElementById('faceGrid');
    grid.innerHTML = '';

    currentFaces.forEach((face, index) => {
        const faceItem = document.createElement('div');
        faceItem.className = 'face-item';

        // Get octave badge for this face
        const octaveData = faceOctaves.get(face.id);
        let octaveBadgeHtml = '';
        if (octaveData) {
            const info = OCTAVE_INFO[octaveData.octave] || OCTAVE_INFO.O4;
            octaveBadgeHtml = `
                <div class="octave-badge" title="${octaveData.reasoning || info.desc}"
                     style="display: inline-flex; align-items: center; gap: 4px;
                            background: rgba(0,0,0,0.3); padding: 2px 8px; border-radius: 10px;
                            font-size: 11px; color: rgba(255,255,255,0.8); margin-left: 8px;">
                    <span>${info.icon}</span>
                    <span>${octaveData.octave}</span>
                </div>
            `;
        }

        // Get emphasis indicator if lens is selected
        let emphasisHtml = '';
        if (face.emphasis) {
            const emphasisColor = face.emphasis === 'high' ? '#00ffcc' :
                                  face.emphasis === 'medium' ? '#ffcc00' : '#ff6666';
            emphasisHtml = `
                <div style="width: 4px; height: 100%; background: ${emphasisColor};
                            position: absolute; left: 0; top: 0; border-radius: 4px 0 0 4px;"></div>
            `;
        }

        const reasoningHtml = face.reasoning
            ? `<div style="font-size: 0.85em; color: #88ccff; margin-top: 6px; font-style: italic; line-height: 1.3; background: rgba(0,0,0,0.2); padding: 4px 8px; border-radius: 4px;">
                <span style="opacity: 0.7;">🤖 Insight:</span> ${face.reasoning}
               </div>`
            : '';

        faceItem.style.position = 'relative';
        faceItem.innerHTML = `
            ${emphasisHtml}
            <div class="face-number">${face.id}</div>
            <div style="flex-grow: 1; display: flex; flex-direction: column;">
                <div style="display: flex; align-items: center;">
                    <input
                        type="text"
                        id="face-input-${face.id}"
                        class="face-input"
                        value="${face.name}"
                        placeholder="Face ${face.id} name"
                        data-face-id="${face.id}"
                        onchange="updateFaceName(${face.id}, this.value)"
                        style="flex-grow: 1;"
                    />
                    ${octaveBadgeHtml}
                </div>
                ${reasoningHtml}
            </div>
        `;

        grid.appendChild(faceItem);
    });
}

/**
 * Update face name
 * Also syncs to demoState.faceConfig for persistence across navigation
 */
function updateFaceName(faceId, newName) {
    const face = currentFaces.find(f => f.id === faceId);
    if (face) {
        face.name = newName;
        console.log(`✅ Updated Face ${faceId}: ${newName}`);

        // Sync to demoState.faceConfig for persistence
        if (window.demoState && window.demoState.faceConfig && window.demoState.faceConfig.faces) {
            const demoFace = window.demoState.faceConfig.faces.find(f => f.id === faceId);
            if (demoFace) {
                demoFace.name = newName;
                console.log(`   ↳ Synced to demoState.faceConfig`);
            }
        }

        // Also sync to Sprint 2 MappingContext if available
        if (window.Sprint2 && window.Sprint2.mappingContext) {
            window.Sprint2.mappingContext.updateFace(faceId, { name: newName });
        }
    }
}

/**
 * Restore faces from demoState.faceConfig
 * Called when navigating back to Step 1 to preserve user customizations
 */
function restoreFacesFromDemoState() {
    if (window.demoState && window.demoState.faceConfig && window.demoState.faceConfig.faces) {
        const savedFaces = window.demoState.faceConfig.faces;
        if (savedFaces.length === 12) {
            currentFaces = savedFaces.map(f => ({
                id: f.id,
                name: f.name,
                icon: f.icon || ''
            }));
            console.log('🔄 Restored faces from demoState.faceConfig');

            // Re-render the face editor if visible
            const faceEditor = document.getElementById('faceEditorSection');
            if (faceEditor && faceEditor.style.display !== 'none') {
                renderFaceEditor();
            }
            return true;
        }
    }
    return false;
}

/**
 * Validate face configuration
 */
function validateFaces() {
    // Check all faces have names
    const emptyFaces = currentFaces.filter(f => !f.name || f.name.trim() === '');
    if (emptyFaces.length > 0) {
        return {
            valid: false,
            message: `Please name all faces. ${emptyFaces.length} face(s) are empty.`
        };
    }

    // Check for duplicate names
    const names = currentFaces.map(f => f.name.toLowerCase().trim());
    const duplicates = names.filter((name, index) => names.indexOf(name) !== index);
    if (duplicates.length > 0) {
        return {
            valid: false,
            message: `Duplicate face names detected: ${duplicates.join(', ')}`
        };
    }

    return {
        valid: true,
        message: 'All faces are valid'
    };
}

/**
 * Get current face configuration
 */
function getFaceConfiguration() {
    // Handle company template flow where currentTemplate may be null
    const templateInfo = currentTemplate && FACE_TEMPLATES[currentTemplate];

    // If currentFaces is empty, try to read from DOM (company template flow)
    let faces = currentFaces;
    if (!faces || faces.length === 0) {
        const faceInputs = document.querySelectorAll('.face-input[data-face-id]');
        if (faceInputs.length > 0) {
            faces = Array.from(faceInputs).map(input => ({
                id: parseInt(input.getAttribute('data-face-id')),
                name: input.value.trim() || `Face ${input.getAttribute('data-face-id')}`
            }));
            console.log('[getFaceConfiguration] Read faces from DOM:', faces.length);
        }
    }

    return {
        template: currentTemplate || 'company',
        templateName: templateInfo ? templateInfo.name : 'Company Template',
        faces: faces,
        timestamp: new Date().toISOString()
    };
}

/**
 * Export configuration as JSON
 */
function exportFaceConfiguration() {
    const config = getFaceConfiguration();
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `quannex-faces-${Date.now()}.json`;
    a.click();

    URL.revokeObjectURL(url);
    console.log('✅ Configuration exported');
}

/**
 * Import configuration from JSON
 */
function importFaceConfiguration(jsonString) {
    try {
        const config = JSON.parse(jsonString);

        if (!config.faces || config.faces.length !== 12) {
            throw new Error('Invalid configuration: must have 12 faces');
        }

        currentTemplate = config.template || 'custom';
        currentFaces = config.faces;

        // Update UI
        selectTemplate(currentTemplate);

        console.log('✅ Configuration imported');
        return true;
    } catch (error) {
        console.error('❌ Import failed:', error);
        alert('Failed to import configuration: ' + error.message);
        return false;
    }
}

// Expose to window for use in HTML
window.selectTemplate = selectTemplate;
window.updateFaceName = updateFaceName;
window.validateFaces = validateFaces;
window.getFaceConfiguration = getFaceConfiguration;
window.exportFaceConfiguration = exportFaceConfiguration;
window.importFaceConfiguration = importFaceConfiguration;
window.analyzeStory = analyzeStory;
window.saveGeminiKey = saveGeminiKey;
window.saveOpenAIKey = saveOpenAIKey;
window.selectProvider = selectProvider;
window.restoreFacesFromDemoState = restoreFacesFromDemoState;

// Sprint 2: Lens & Octave functions
window.selectLens = selectLens;
window.populateLensSelector = populateLensSelector;
window.updateOctaveDisplay = updateOctaveDisplay;

// Sprint 2: Expose state for debugging
window.getFaceOctaves = () => Object.fromEntries(faceOctaves);
window.getCurrentLenses = () => currentLenses;
window.getSelectedLens = () => selectedLens;
window.getOverallOctave = () => overallOctave;

// Sprint 2: KPI extraction getters
window.getExtractedKPIs = () => extractedKPIs;
window.getExtractedFinancials = () => extractedFinancials;
window.getKPIsForFace = (faceId) => extractedKPIs.filter(k => k.faceId === faceId);
window.getCurrentStoryText = () => currentStoryText;

console.log('✅ Face Wizard loaded with Sprint 2 Lenses, Octaves & KPI extraction');
