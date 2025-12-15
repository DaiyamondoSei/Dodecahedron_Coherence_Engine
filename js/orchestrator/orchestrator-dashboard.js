/**
 * ========================================
 * MODULE: orchestrator-dashboard.js
 * ========================================
 *
 * Extracted from: demo-orchestrator-logic.js
 * Original lines: ~2270-3083 (SECTIONS 13-14)
 * Date: December 15, 2025
 *
 * ========================================
 * PURPOSE
 * ========================================
 *
 * This module manages the Octave Dashboard (Step 4) and Portrait View
 * visualizations. It is responsible for:
 *
 * 1. **Octave Dashboard** - Displays which of the 7 developmental octaves
 *    (Survival -> Radiance) an organization is currently operating at.
 *    Uses PHI-derived thresholds to detect octave from coherence scores.
 *
 * 2. **Coherence Hero** - The prominent display of overall coherence score
 *    at the top of Step 4 results, with interpretation and guidance.
 *
 * 3. **Foundation Principle Warnings** - Displays warnings when there's
 *    structural misalignment between face octaves (some faces much higher
 *    than others), applying the principle: "An organization cannot claim
 *    a higher octave than its structural foundation supports."
 *
 * 4. **Portrait View Integration** - Initializes the 2D radial face
 *    visualization that shows all 12 faces arranged in a circle.
 *
 * ========================================
 * PHILOSOPHY NOTE FOR FUTURE CLAUDE
 * ========================================
 *
 * The 7 Octaves represent developmental stages:
 *   O1: Survival (existence focus) - Below 0.382 coherence
 *   O2: Structure (stability focus) - 0.382 to 0.5 coherence (PHI^-2)
 *   O3: Relationships (connection focus) - 0.5 to 0.618 coherence
 *   O4: Creativity (innovation focus) - 0.618 to 0.764 coherence (PHI^-1)
 *   O5: Expression (authenticity focus) - 0.764 to 0.854 coherence (PSI^3)
 *   O6: Vision (purpose focus) - 0.854 to 0.95 coherence (PSI^4)
 *   O7: Radiance (service focus) - Above 0.95 coherence
 *
 * These thresholds are derived from PHI (Golden Ratio = 1.618...) and
 * its inverse PSI (0.618...). They're defined in orchestrator-state.js
 * as OCTAVE_COHERENCE_THRESHOLDS.
 *
 * The Foundation Principle prevents "aspirational outliers" - faces that
 * show artificially high scores while foundation faces are weak. A single
 * team can't claim O7 Radiance if their O1 Survival needs are unmet.
 *
 * ========================================
 * DEPENDENCIES
 * ========================================
 *
 * Required (must be loaded before this module):
 *   - js/orchestrator/orchestrator-state.js
 *     - demoState (central state object)
 *     - OCTAVE_COHERENCE_THRESHOLDS (PHI-derived thresholds)
 *
 * Optional (checked at runtime):
 *   - window.OctaveIntegrityCalculator (external module for Foundation Principle)
 *   - window.PortraitView (external module for 2D radial visualization)
 *   - window.getFaceOctaves() (from face-wizard if loaded)
 *   - window.getOverallOctave() (from face-wizard if loaded)
 *
 * ========================================
 * EXPORTS (to window/global)
 * ========================================
 *
 * Functions:
 *   - initializeCoherenceHero() : Display coherence score hero section
 *   - initializeOctaveDashboard() : Main dashboard initialization
 *   - initializePortraitView() : Initialize 2D radial visualization
 *   - detectOctaveFromCoherence(coherence) : Get octave from coherence score
 *
 * Constants:
 *   - OCTAVE_REFERENCE : Static data for all 7 octaves (descriptions, colors, etc.)
 *
 * Internal (not exported):
 *   - displayFoundationPrincipleWarnings() : Show spread/penalty warnings
 *   - transformToPortraitData() : Convert coherence data to portrait format
 *   - extractElementalData() : Get elemental breakdown from face
 *   - detectOctave() : Full octave detection with elemental engagement
 *   - getDefaultElements() : Default elemental structure
 *   - getDefaultFaceName() : Default face names (1-12)
 *
 * ========================================
 * USAGE PATTERNS
 * ========================================
 *
 * Called from goToStep() when transitioning to Step 4:
 *   initializePortraitView();
 *   initializeOctaveDashboard();
 *   setTimeout(() => identifyNervousEndpoints(), 300);
 *   identifyHighestLeverageAction();
 *
 * Called from loadDemoResultsFromStorage() for resuming sessions:
 *   initializeCoherenceHero();
 *   initializePortraitView();
 *   initializeOctaveDashboard();
 *
 * ========================================
 */
(function(global) {
    'use strict';

    // ========================================
    // IMPORTS FROM GLOBAL SCOPE
    // ========================================
    //
    // These must be loaded before this module (see script order in HTML):
    //   1. orchestrator-state.js provides demoState and OCTAVE_COHERENCE_THRESHOLDS
    //
    // We don't cache these at load time because:
    //   - demoState is mutated throughout the session
    //   - OCTAVE_COHERENCE_THRESHOLDS is a constant but should be read fresh
    //
    // ========================================

    // ========================================
    // MODULE-LEVEL STATE
    // ========================================

    /**
     * Portrait View instance holder.
     *
     * We keep a single instance of PortraitView to avoid creating
     * multiple instances on repeated calls to initializePortraitView().
     * The instance is updated with new data rather than recreated.
     *
     * @private
     * @type {Object|null}
     */
    let portraitViewInstance = null;

    // ========================================
    // OCTAVE REFERENCE DATA
    // ========================================
    //
    // This is the master reference for all 7 octaves.
    // Each octave has:
    //   - name: Human-readable name
    //   - focus: One-word focus area
    //   - color: Hex color for theming
    //   - gradient: CSS gradient for backgrounds
    //   - description: What this stage means
    //   - questions: Diagnostic questions for this stage
    //   - breathInsight: Metaphorical insight about breath at this level
    //   - advanceHint: How to progress to the next octave
    //
    // These are static - they don't change based on user data.
    //
    // ========================================

    /**
     * Octave reference data for dashboard population.
     * Each octave has name, focus, colors, description, questions,
     * breath insight, and advancement hints.
     *
     * The 7 Octaves follow a developmental progression:
     * O1 -> O2 -> O3 -> O4 -> O5 -> O6 -> O7
     * (Survival -> Structure -> Relationships -> Creativity -> Expression -> Vision -> Radiance)
     *
     * @constant {Object}
     */
    const OCTAVE_REFERENCE = {
        1: {
            name: 'Survival',
            focus: 'Existence',
            color: '#ff6b6b',
            gradient: 'linear-gradient(135deg, #ff6b6b, #ff8e53)',
            description: 'The organization is fighting to exist. Focus is on basic viability.',
            questions: [
                'Are we actively seeking resources to exist?',
                'Do we have enough cash to survive?',
                'Is any work getting done?',
                'Does the founder have the energy to exist?'
            ],
            breathInsight: 'At this stage, every breath is about staying alive. Resources in, survival out.',
            advanceHint: 'Secure basic viability first. Once survival is stable, you can begin building structure.'
        },
        2: {
            name: 'Structure',
            focus: 'Stability',
            color: '#ffa94d',
            gradient: 'linear-gradient(135deg, #ffa94d, #ffd43b)',
            description: 'Building stable foundations. Processes and systems are being established.',
            questions: [
                'Are systems being documented?',
                'Is knowledge being preserved?',
                'Are processes repeatable?',
                'Do we have a clear operational rhythm?'
            ],
            breathInsight: 'Structure brings rhythm to chaos. Each exhale is a process documented.',
            advanceHint: 'Document and systematize key processes. When foundations are solid, relationships can flourish.'
        },
        3: {
            name: 'Relationships',
            focus: 'Connection',
            color: '#69db7c',
            gradient: 'linear-gradient(135deg, #69db7c, #94d82d)',
            description: 'Growing through connection. Community and partnerships are central.',
            questions: [
                'Are we building meaningful partnerships?',
                'Is our team growing in harmony?',
                'Do our stakeholders feel valued?',
                'Is communication flowing both ways?'
            ],
            breathInsight: 'Relationships are the breath between beings. Inhale others\' wisdom, exhale your value.',
            advanceHint: 'Deepen key relationships. When connections are strong, creativity emerges naturally.'
        },
        4: {
            name: 'Creativity',
            focus: 'Innovation',
            color: '#4dabf7',
            gradient: 'linear-gradient(135deg, #4dabf7, #748ffc)',
            description: 'Innovation flourishes. New ideas emerge and are welcomed.',
            questions: [
                'Is experimentation encouraged?',
                'Do people feel safe to propose new ideas?',
                'Are we solving problems creatively?',
                'Is there space for play and exploration?'
            ],
            breathInsight: 'Creativity is the breath of new possibility. Let go of what was to create what can be.',
            advanceHint: 'Foster innovation culture. When creativity flows freely, authentic expression becomes possible.'
        },
        5: {
            name: 'Expression',
            focus: 'Authenticity',
            color: '#a78bfa',
            gradient: 'linear-gradient(135deg, #a78bfa, #f472b6)',
            description: 'Authentic voice emerging. The organization expresses its unique identity.',
            questions: [
                'Is our brand voice distinctive and true?',
                'Do our actions match our stated values?',
                'Are we communicating our unique perspective?',
                'Is there coherence between inner and outer?'
            ],
            breathInsight: 'Expression is truth made visible. Each exhale shares your authentic essence.',
            advanceHint: 'Refine authentic expression. When you speak your truth fully, vision crystallizes.'
        },
        6: {
            name: 'Vision',
            focus: 'Purpose',
            color: '#da77f2',
            gradient: 'linear-gradient(135deg, #da77f2, #f06595)',
            description: 'Clear sight of purpose. Strategic vision guides all decisions.',
            questions: [
                'Is our long-term vision crystal clear?',
                'Does everyone understand the "why"?',
                'Are we seeing patterns others miss?',
                'Is our strategy aligned with deeper purpose?'
            ],
            breathInsight: 'Vision is the breath of the future. Inhale possibility, exhale direction.',
            advanceHint: 'Clarify and embody the vision. When vision is lived fully, radiance emerges.'
        },
        7: {
            name: 'Radiance',
            focus: 'Service',
            color: '#ffd43b',
            gradient: 'linear-gradient(135deg, #ffd43b, #ffe066)',
            description: 'Full coherence achieved. The organization serves something greater than itself.',
            questions: [
                'Are we serving the greater good?',
                'Is our impact regenerative?',
                'Do we uplift those we touch?',
                'Is there joy in our work?'
            ],
            breathInsight: 'Radiance is the breath of service. Every exhale blesses the world.',
            advanceHint: 'Radiance is the culmination. Maintain coherence while expanding your service to the world.'
        }
    };

    // ========================================
    // COHERENCE HERO SECTION
    // ========================================
    //
    // The "Coherence Hero" is the prominent display of the overall
    // coherence score at the top of Step 4 (Results). It provides:
    //   - The percentage score (e.g., "73.2%")
    //   - An interpretation (e.g., "Strong Coherence")
    //   - A detail explanation of what the score means
    //   - Visual theming (border color changes with score)
    //
    // ========================================

    /**
     * Initialize Coherence Hero Section (Sprint 3 Task 26)
     * Displays the coherence score prominently at the top of Step 4
     *
     * DOM Elements Updated:
     *   - #hero-coherence-score : The percentage display
     *   - #hero-coherence-interpretation : The tier name (e.g., "Strong Coherence")
     *   - #hero-coherence-detail : Explanation text
     *   - #coherence-hero : Container border color
     *
     * @returns {void}
     */
    function initializeCoherenceHero() {
        // Access demoState from global scope (loaded by orchestrator-state.js)
        const state = global.demoState;

        if (!state || !state.coherenceResults) {
            console.warn('[orchestrator-dashboard] No coherence results available for hero');
            return;
        }

        const coherence = state.coherenceResults.globalCoherence || 0;
        const coherencePercent = (coherence * 100).toFixed(1);

        // --------------------------------------------------------
        // Determine interpretation based on coherence level
        // --------------------------------------------------------
        // These thresholds provide human-readable tiers:
        //   >= 0.85 : Exceptional (rare, masterful)
        //   >= 0.70 : Strong (excellent alignment)
        //   >= 0.50 : Developing (solid foundations)
        //   >= 0.382: Emerging (early development) - uses PHI^-2
        //   < 0.382 : Foundational (beginning journey)
        // --------------------------------------------------------
        let interpretation = '';
        let detail = '';

        if (coherence >= 0.85) {
            interpretation = 'Exceptional Coherence';
            detail = 'Your organization demonstrates masterful integration across all dimensions. This is rare and represents organizational radiance.';
        } else if (coherence >= 0.7) {
            interpretation = 'Strong Coherence';
            detail = 'Your organization shows excellent alignment. Most dimensions work harmoniously together with clear synergies.';
        } else if (coherence >= 0.5) {
            interpretation = 'Developing Coherence';
            detail = 'Your organization has solid foundations with room for growth. Focus on strengthening the connections between dimensions.';
        } else if (coherence >= 0.382) {  // PHI^-2 = 0.381966... (Structure threshold)
            interpretation = 'Emerging Coherence';
            detail = 'Your organization is in early development. The dodecahedron reveals specific areas requiring focused attention.';
        } else {
            interpretation = 'Foundational Stage';
            detail = 'Your organization is at the beginning of its coherence journey. Every step forward matters. The path is clear.';
        }

        // --------------------------------------------------------
        // Update DOM elements
        // --------------------------------------------------------
        const scoreEl = document.getElementById('hero-coherence-score');
        const interpEl = document.getElementById('hero-coherence-interpretation');
        const detailEl = document.getElementById('hero-coherence-detail');

        if (scoreEl) scoreEl.textContent = `${coherencePercent}%`;
        if (interpEl) interpEl.textContent = interpretation;
        if (detailEl) detailEl.textContent = detail;

        // --------------------------------------------------------
        // Update hero border color based on coherence tier
        // --------------------------------------------------------
        // Visual feedback: the hero section glows differently
        // based on the coherence level:
        //   >= 0.85 : Gold (radiance)
        //   >= 0.70 : Green (strong)
        //   >= 0.382: Cyan (default)
        //   < 0.382 : Red (needs attention)
        // --------------------------------------------------------
        const heroEl = document.getElementById('coherence-hero');
        if (heroEl) {
            let borderColor = 'rgba(0, 255, 204, 0.4)';  // Default cyan
            if (coherence >= 0.85) {
                borderColor = 'rgba(255, 215, 0, 0.6)';  // Gold for exceptional
            } else if (coherence >= 0.7) {
                borderColor = 'rgba(0, 255, 136, 0.5)';  // Green for strong
            } else if (coherence < 0.382) {  // Below PHI^-2 - Structure threshold
                borderColor = 'rgba(255, 107, 107, 0.5)';  // Red for foundational
            }
            heroEl.style.borderColor = borderColor;
        }

        console.log('[orchestrator-dashboard] Coherence hero initialized:', coherencePercent + '%');
    }

    // ========================================
    // OCTAVE DASHBOARD
    // ========================================
    //
    // The main dashboard that shows:
    //   - Current octave (O1-O7) with progress bar
    //   - Octave details (name, focus, description, questions)
    //   - Next octave preview with advancement hints
    //   - Breath insight for the current level
    //   - Foundation Principle warnings (if structural issues detected)
    //
    // ========================================

    /**
     * Initialize Octave Dashboard with current data
     *
     * This is the main dashboard initialization function. It:
     *   1. Determines the dominant octave (from loaded context or calculated)
     *   2. Applies the Foundation Principle via OctaveIntegrityCalculator
     *   3. Updates all dashboard UI elements
     *   4. Displays any structural warnings
     *
     * DOM Elements Updated:
     *   - #octave-progress-fill : Progress bar fill
     *   - #octave-progress-marker : Progress bar marker
     *   - #octave-badge : Octave number badge (O1-O7)
     *   - #octave-name : Octave name
     *   - #octave-focus : Focus area
     *   - #octave-description : Description text
     *   - #octave-questions : Diagnostic questions
     *   - #next-octave-preview : Next octave preview card
     *   - #dominant-breath-name : Breath axis name
     *   - #dominant-breath-insight : Breath insight text
     *   - #octave-progress-labels : Progress bar labels (O1-O7)
     *   - #foundation-principle-warnings : Warning container (created if needed)
     *
     * @returns {void}
     */
    function initializeOctaveDashboard() {
        // Access shared state and thresholds from global scope
        const state = global.demoState;
        const thresholds = global.OCTAVE_COHERENCE_THRESHOLDS;

        // --------------------------------------------------------
        // STEP 1: Initialize default values
        // --------------------------------------------------------
        let dominantOctave = 1;
        let octaveStage = 'O1';
        let dominantBreathName = 'The Breath of Viability';
        let breathAxes = [];
        let integrityResult = null;  // Will store Foundation Principle result

        // --------------------------------------------------------
        // STEP 2: Check for loaded mapping context (from template or saved data)
        // --------------------------------------------------------
        if (state.loadedMappingContext) {
            dominantOctave = state.loadedMappingContext.dominantOctave || 1;
            octaveStage = state.loadedMappingContext.octaveStage || `O${dominantOctave}`;
            dominantBreathName = state.loadedMappingContext.dominantBreathName || 'The Breath of Viability';
            breathAxes = state.loadedMappingContext.breathAxes || [];
        }

        // ========================================
        // FOUNDATION PRINCIPLE: Use OctaveIntegrityCalculator
        // ========================================
        //
        // The Foundation Principle states:
        // "An organization cannot claim a higher octave than its
        // structural foundation supports"
        //
        // This means if Face 1 (Financial Capital) is at O2 but
        // Face 7 (Brand) claims O6, the organization is penalized.
        // The geometric mean of all face octaves is calculated,
        // and a penalty is applied based on the spread.
        //
        // This prevents organizations from cherry-picking high scores
        // while ignoring foundational weaknesses.
        //
        // ========================================
        if (global.OctaveIntegrityCalculator && state.coherenceResults?.faces) {
            // Build face data with individual octaves
            const faceOctaveData = state.coherenceResults.faces.map(face => {
                // Get face coherence/energy
                const faceCoherence = face.energy || face.faceEnergy || face.coherence || 0.5;
                // Detect face-level octave from its coherence
                const faceOctave = global.OctaveIntegrityCalculator.detectOctaveFromCoherence(faceCoherence);
                return {
                    id: face.id,
                    name: face.name || `Face ${face.id}`,
                    octave: faceOctave.octave,
                    coherence: faceCoherence
                };
            });

            // Get lifecycle stage if available (affects some calculations)
            const lifecycleStage = state.loadedMappingContext?.lifecycleStage || null;

            // Calculate organizational octave with Foundation Principle
            integrityResult = global.OctaveIntegrityCalculator.calculateOrganizationalOctave(
                faceOctaveData,
                lifecycleStage
            );

            // Use Foundation Principle result if available
            if (integrityResult && integrityResult.orgOctave) {
                dominantOctave = integrityResult.orgOctave;
                octaveStage = `O${dominantOctave}`;
                console.log('[orchestrator-dashboard] Foundation Principle applied:', {
                    orgOctave: dominantOctave,
                    geoMean: integrityResult.geoMean,
                    spread: integrityResult.spread,
                    penalty: integrityResult.penalty,
                    warnings: integrityResult.warnings?.length || 0
                });
            }
        }
        // --------------------------------------------------------
        // FALLBACK: If no face data, detect from global coherence
        // --------------------------------------------------------
        else if (!state.loadedMappingContext && state.coherenceResults) {
            const avgCoherence = state.coherenceResults.globalCoherence || 0.5;
            dominantOctave = detectOctaveFromCoherence(avgCoherence);
        }

        // --------------------------------------------------------
        // STEP 3: Get reference data for current and next octave
        // --------------------------------------------------------
        const octaveData = OCTAVE_REFERENCE[dominantOctave] || OCTAVE_REFERENCE[1];
        const nextOctave = Math.min(7, dominantOctave + 1);
        const nextOctaveData = OCTAVE_REFERENCE[nextOctave];

        // --------------------------------------------------------
        // STEP 4: Update progress bar
        // --------------------------------------------------------
        // Progress is shown as percentage (14.3% per octave, 7 total)
        const progressPercent = (dominantOctave / 7) * 100;
        const progressFill = document.getElementById('octave-progress-fill');
        const progressMarker = document.getElementById('octave-progress-marker');

        if (progressFill) {
            progressFill.style.width = `${progressPercent}%`;
            progressFill.style.background = octaveData.gradient;
        }
        if (progressMarker) {
            progressMarker.style.left = `${progressPercent}%`;
        }

        // --------------------------------------------------------
        // STEP 5: Update octave badge
        // --------------------------------------------------------
        const badge = document.getElementById('octave-badge');
        if (badge) {
            badge.textContent = `O${dominantOctave}`;
            badge.style.background = octaveData.gradient;
        }

        // --------------------------------------------------------
        // STEP 6: Update name and description
        // --------------------------------------------------------
        const nameEl = document.getElementById('octave-name');
        const focusEl = document.getElementById('octave-focus');
        const descEl = document.getElementById('octave-description');

        if (nameEl) {
            nameEl.textContent = octaveData.name;
            nameEl.style.color = octaveData.color;
        }
        if (focusEl) {
            focusEl.innerHTML = `Focus: <span style="color: ${octaveData.color};">${octaveData.focus}</span>`;
        }
        if (descEl) {
            descEl.textContent = octaveData.description;
        }

        // --------------------------------------------------------
        // STEP 7: Update questions
        // --------------------------------------------------------
        // If breath axes are loaded from template, use their questions
        // Otherwise, use default questions from OCTAVE_REFERENCE
        const questionsEl = document.getElementById('octave-questions');
        if (questionsEl) {
            let questions = octaveData.questions;

            // If we have breath axes, use their questions instead
            if (breathAxes.length > 0) {
                questions = breathAxes
                    .filter(axis => axis.projectionQuestion || axis.receptionQuestion)
                    .slice(0, 4)
                    .flatMap(axis => [
                        axis.projectionQuestion,
                        axis.receptionQuestion
                    ])
                    .filter(q => q)
                    .slice(0, 4);
            }

            questionsEl.innerHTML = questions.map((q, i) =>
                `<div style="padding: 8px 0; ${i < questions.length - 1 ? 'border-bottom: 1px solid rgba(255,255,255,0.05);' : ''}">• ${q}</div>`
            ).join('');
        }

        // --------------------------------------------------------
        // STEP 8: Update next octave preview
        // --------------------------------------------------------
        const nextPreview = document.getElementById('next-octave-preview');
        if (nextPreview) {
            if (dominantOctave < 7) {
                // Show next octave preview
                nextPreview.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                        <div style="width: 40px; height: 40px; border-radius: 50%; background: rgba(167,139,250,0.2); border: 2px solid ${nextOctaveData.color}40; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; color: ${nextOctaveData.color};">O${nextOctave}</div>
                        <div>
                            <div style="font-weight: 600; color: ${nextOctaveData.color};">${nextOctaveData.name}</div>
                            <div style="font-size: 11px; color: rgba(255,255,255,0.5);">Focus: ${nextOctaveData.focus}</div>
                        </div>
                    </div>
                    <div style="font-size: 12px; color: rgba(255,255,255,0.6); line-height: 1.6;">
                        ${nextOctaveData.description}
                    </div>
                    <div style="margin-top: 12px; padding: 10px; background: ${nextOctaveData.color}15; border-radius: 6px; font-size: 11px; color: rgba(255,255,255,0.7);">
                        <strong>To advance:</strong> ${octaveData.advanceHint}
                    </div>
                `;
            } else {
                // At O7 - show completion message
                nextPreview.innerHTML = `
                    <div style="text-align: center; padding: 20px;">
                        <span style="font-size: 32px;">&#10024;</span>
                        <div style="font-weight: 600; color: #ffd43b; margin-top: 10px;">Full Radiance Achieved</div>
                        <div style="font-size: 12px; color: rgba(255,255,255,0.6); margin-top: 8px;">
                            The journey continues in service to others. Your coherence becomes a gift to the world.
                        </div>
                    </div>
                `;
            }
        }

        // --------------------------------------------------------
        // STEP 9: Update breath insight
        // --------------------------------------------------------
        const breathNameEl = document.getElementById('dominant-breath-name');
        const breathInsightEl = document.getElementById('dominant-breath-insight');

        if (breathNameEl) {
            breathNameEl.textContent = `"${dominantBreathName}"`;
        }
        if (breathInsightEl) {
            breathInsightEl.textContent = octaveData.breathInsight;
        }

        // --------------------------------------------------------
        // STEP 10: Highlight current octave in progress bar labels
        // --------------------------------------------------------
        const labels = document.querySelectorAll('#octave-progress-labels span');
        labels.forEach((label, i) => {
            if (i + 1 === dominantOctave) {
                label.style.color = octaveData.color;
                label.style.fontWeight = '600';
            } else {
                label.style.color = 'rgba(255,255,255,0.4)';
                label.style.fontWeight = 'normal';
            }
        });

        // --------------------------------------------------------
        // STEP 11: Display Foundation Principle warnings
        // --------------------------------------------------------
        displayFoundationPrincipleWarnings(integrityResult, octaveData.color);

        console.log(`[orchestrator-dashboard] Octave Dashboard initialized: O${dominantOctave} (${octaveData.name})`);
    }

    // ========================================
    // FOUNDATION PRINCIPLE WARNINGS
    // ========================================
    //
    // Displays warnings about structural misalignment:
    //   - Octave spread (how far apart the min/max face octaves are)
    //   - Penalty applied (reduction from geometric mean)
    //   - Specific warnings (structural misalignment, aspirational outliers)
    //   - Octave distribution (breakdown of faces per octave)
    //
    // ========================================

    /**
     * Display Foundation Principle warnings in the Octave Dashboard
     * Shows spread warnings, structural misalignment alerts, and recommendations
     *
     * This creates or updates a warning container that appears below
     * the octave progress bar. Warnings are color-coded:
     *   - Green: Healthy variance (spread <= 2)
     *   - Orange: Developing gap (spread 3-4)
     *   - Red: Critical misalignment (spread > 4)
     *
     * @param {Object|null} integrityResult - Result from OctaveIntegrityCalculator
     * @param {string} octaveColor - Current octave's theme color (unused but kept for future theming)
     * @returns {void}
     * @private
     */
    function displayFoundationPrincipleWarnings(integrityResult, octaveColor) {
        // Find or create warning container
        let warningContainer = document.getElementById('foundation-principle-warnings');

        // If no container exists, try to insert one after the octave progress section
        if (!warningContainer) {
            const octaveProgressContainer = document.querySelector('#octave-progress-fill')?.closest('div')?.parentElement;
            if (octaveProgressContainer) {
                warningContainer = document.createElement('div');
                warningContainer.id = 'foundation-principle-warnings';
                warningContainer.style.cssText = 'margin-top: 15px; transition: all 0.3s ease;';
                octaveProgressContainer.parentElement.insertBefore(warningContainer, octaveProgressContainer.nextSibling);
            }
        }

        // If still no container, skip silently
        if (!warningContainer) {
            console.warn('[orchestrator-dashboard] Could not find/create warning container');
            return;
        }

        // No integrity result means no Foundation Principle was applied
        if (!integrityResult) {
            warningContainer.innerHTML = '';
            return;
        }

        // Build warning HTML
        let warningsHtml = '';
        const warnings = integrityResult.warnings || [];

        // --------------------------------------------------------
        // Show spread info if there's any variance between faces
        // --------------------------------------------------------
        if (integrityResult.spread > 0) {
            // Color-code based on severity
            const spreadColor = integrityResult.spread > 4 ? '#ff6b6b' :  // Critical (red)
                               integrityResult.spread > 2 ? '#ffa94d' :  // Warning (orange)
                               '#69db7c';                                 // Healthy (green)
            const spreadIcon = integrityResult.spread > 4 ? '&#9888;' :  // Warning triangle
                              integrityResult.spread > 2 ? '&#128202;' : // Chart
                              '&#10004;';                                 // Checkmark

            warningsHtml += `
                <div style="display: flex; align-items: center; gap: 10px; padding: 10px; background: ${spreadColor}15; border-left: 3px solid ${spreadColor}; border-radius: 0 6px 6px 0; margin-bottom: 10px;">
                    <span style="font-size: 18px;">${spreadIcon}</span>
                    <div style="flex: 1;">
                        <div style="font-size: 12px; font-weight: 600; color: ${spreadColor};">
                            Octave Spread: ${integrityResult.spread} levels (O${integrityResult.breakdown?.min || '?'} → O${integrityResult.breakdown?.max || '?'})
                        </div>
                        <div style="font-size: 11px; color: rgba(255,255,255,0.6); margin-top: 3px;">
                            ${integrityResult.spread <= 2 ? 'Healthy variance - well-aligned development' :
                              integrityResult.spread <= 4 ? 'Some faces are developing faster than others' :
                              'Critical misalignment detected - foundations need strengthening'}
                        </div>
                    </div>
                </div>
            `;
        }

        // --------------------------------------------------------
        // Show penalty info if one was applied
        // --------------------------------------------------------
        if (integrityResult.penalty > 0) {
            warningsHtml += `
                <div style="display: flex; align-items: center; gap: 10px; padding: 10px; background: rgba(255,170,77,0.1); border-left: 3px solid #ffa94d; border-radius: 0 6px 6px 0; margin-bottom: 10px;">
                    <span style="font-size: 18px;">&#128201;</span>
                    <div style="flex: 1;">
                        <div style="font-size: 12px; font-weight: 600; color: #ffa94d;">
                            Foundation Principle Applied: -${integrityResult.penalty.toFixed(1)} octave penalty
                        </div>
                        <div style="font-size: 11px; color: rgba(255,255,255,0.6); margin-top: 3px;">
                            Geometric mean was ${integrityResult.geoMean?.toFixed(2) || '?'}, reduced due to structural misalignment
                        </div>
                    </div>
                </div>
            `;
        }

        // --------------------------------------------------------
        // Show specific warnings (structural misalignment, aspirational outliers)
        // --------------------------------------------------------
        warnings.forEach(warning => {
            if (warning.type === 'structural_misalignment' || warning.type === 'aspirational_outlier') {
                const color = warning.severity === 'critical' ? '#ff6b6b' : '#ffa94d';
                const icon = warning.severity === 'critical' ? '&#128680;' : '&#9889;';  // Siren or zap

                warningsHtml += `
                    <div style="display: flex; align-items: flex-start; gap: 10px; padding: 10px; background: ${color}10; border-left: 3px solid ${color}; border-radius: 0 6px 6px 0; margin-bottom: 10px;">
                        <span style="font-size: 16px;">${icon}</span>
                        <div style="flex: 1;">
                            <div style="font-size: 12px; font-weight: 600; color: ${color};">
                                ${warning.message}
                            </div>
                            ${warning.detail ? `<div style="font-size: 11px; color: rgba(255,255,255,0.6); margin-top: 3px;">${warning.detail}</div>` : ''}
                            ${warning.recommendation ? `
                                <div style="font-size: 11px; color: rgba(0,255,204,0.8); margin-top: 6px; padding: 6px; background: rgba(0,255,204,0.1); border-radius: 4px;">
                                    ${warning.recommendation}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `;
            }
        });

        // --------------------------------------------------------
        // Show octave distribution if we have breakdown data
        // --------------------------------------------------------
        if (integrityResult.breakdown?.distribution && Object.keys(integrityResult.breakdown.distribution).length > 1) {
            const distHtml = Object.entries(integrityResult.breakdown.distribution)
                .map(([oct, count]) => `<span style="padding: 2px 8px; background: rgba(255,255,255,0.1); border-radius: 10px; font-size: 10px;">${oct}: ${count}</span>`)
                .join(' ');

            warningsHtml += `
                <div style="padding: 8px 10px; background: rgba(255,255,255,0.05); border-radius: 6px; margin-bottom: 10px;">
                    <div style="font-size: 11px; color: rgba(255,255,255,0.5); margin-bottom: 5px;">Face Octave Distribution:</div>
                    <div style="display: flex; flex-wrap: wrap; gap: 6px; color: rgba(255,255,255,0.7);">
                        ${distHtml}
                    </div>
                </div>
            `;
        }

        warningContainer.innerHTML = warningsHtml;

        if (warnings.length > 0) {
            console.log('[orchestrator-dashboard] Displayed', warnings.length, 'Foundation Principle warnings');
        }
    }

    // ========================================
    // OCTAVE DETECTION
    // ========================================
    //
    // Functions for detecting which octave (O1-O7) corresponds to
    // a given coherence score, using PHI-derived thresholds.
    //
    // ========================================

    /**
     * Detect octave from coherence score (simple version)
     * Uses PHI-derived thresholds from OCTAVE_COHERENCE_THRESHOLDS
     *
     * This is the basic version used when we only have a coherence
     * score and no elemental engagement data.
     *
     * Threshold values (from orchestrator-state.js):
     *   O7: 0.95     (Radiance)
     *   O6: ~0.854   (Vision, PSI^4)
     *   O5: ~0.764   (Expression, PSI^3)
     *   O4: ~0.618   (Creativity, PHI^-1)
     *   O3: 0.5      (Relationships)
     *   O2: ~0.382   (Structure, PHI^-2)
     *   O1: below 0.382 (Survival)
     *
     * @param {number} coherence - Coherence score between 0 and 1
     * @returns {number} Octave number (1-7)
     */
    function detectOctaveFromCoherence(coherence) {
        const thresholds = global.OCTAVE_COHERENCE_THRESHOLDS;

        // Defensive check - if thresholds not loaded, use hardcoded values
        if (!thresholds) {
            console.warn('[orchestrator-dashboard] OCTAVE_COHERENCE_THRESHOLDS not found, using defaults');
            if (coherence >= 0.95) return 7;
            if (coherence >= 0.854) return 6;
            if (coherence >= 0.764) return 5;
            if (coherence >= 0.618) return 4;
            if (coherence >= 0.5) return 3;
            if (coherence >= 0.382) return 2;
            return 1;
        }

        if (coherence >= thresholds.O7) return 7;  // 0.95 - Radiance
        if (coherence >= thresholds.O6) return 6;  // PSI^4 ~ 0.854 - Vision
        if (coherence >= thresholds.O5) return 5;  // PSI^3 ~ 0.764 - Expression
        if (coherence >= thresholds.O4) return 4;  // PHI^-1 ~ 0.618 - Creativity
        if (coherence >= thresholds.O3) return 3;  // 0.5 - Relationships
        if (coherence >= thresholds.O2) return 2;  // PHI^-2 ~ 0.382 - Structure
        return 1;  // O1 - Survival
    }

    // ========================================
    // PORTRAIT VIEW
    // ========================================
    //
    // The Portrait View is a 2D radial visualization showing all 12
    // faces arranged in a circle. Each face shows:
    //   - Its coherence level (color intensity)
    //   - Its target octave
    //   - Its elemental breakdown (if available)
    //   - Any warnings
    //
    // ========================================

    /**
     * Initialize Portrait View with current coherence data.
     *
     * This function:
     *   1. Checks for coherence data availability
     *   2. Creates fallback face data if needed
     *   3. Waits for PortraitView module to load (async)
     *   4. Transforms data to portrait format
     *   5. Creates or updates the PortraitView instance
     *
     * DOM Elements:
     *   - #portrait-view-container : Container for the visualization
     *
     * @returns {void}
     */
    function initializePortraitView() {
        const state = global.demoState;

        if (!state.coherenceResults) {
            console.warn('[orchestrator-dashboard] No coherence results available for Portrait View');
            return;
        }

        // --------------------------------------------------------
        // Ensure faces array exists (null-safe fallback)
        // --------------------------------------------------------
        // In some cases (e.g., template loading), coherenceResults may
        // exist but faces array may be empty. We create fallback data
        // from faceConfig if available.
        // --------------------------------------------------------
        if (!state.coherenceResults.faces || state.coherenceResults.faces.length === 0) {
            console.warn('[orchestrator-dashboard] No face data, creating fallback');
            if (state.faceConfig && state.faceConfig.faces) {
                state.coherenceResults.faces = state.faceConfig.faces.map(f => ({
                    id: f.id,
                    name: f.name,
                    energy: state.loadedMappingContext?.faces?.find(mf => mf.id === f.id)?.sentiment || 0.5,
                    kpis: []
                }));
            }
        }

        // --------------------------------------------------------
        // Wait for PortraitView module to be available
        // --------------------------------------------------------
        // PortraitView is an external module loaded via <script> tag.
        // It may not be available immediately, so we poll for it.
        // --------------------------------------------------------
        const waitForPortraitView = () => {
            if (typeof global.PortraitView === 'undefined') {
                console.log('[orchestrator-dashboard] Waiting for PortraitView module...');
                setTimeout(waitForPortraitView, 100);
                return;
            }

            console.log('[orchestrator-dashboard] Initializing Portrait View');

            // Transform coherence results to Portrait View format
            const portraitData = transformToPortraitData(state.coherenceResults);

            // Create or update the Portrait View
            if (!portraitViewInstance) {
                portraitViewInstance = new global.PortraitView('portrait-view-container', {
                    size: 380,
                    showLabels: true,
                    interactive: true
                });
            }

            portraitViewInstance.update(portraitData);
            console.log('[orchestrator-dashboard] Portrait View updated');
        };

        waitForPortraitView();
    }

    /**
     * Transform coherence results to Portrait View data format
     *
     * Converts the internal coherence data structure to the format
     * expected by the PortraitView visualization component.
     *
     * @param {Object} coherenceResults - The coherence results from calculation
     * @param {number} coherenceResults.globalCoherence - Overall coherence (0-1)
     * @param {Array} coherenceResults.faces - Array of face objects
     * @returns {Object} Portrait View compatible data structure
     * @private
     */
    function transformToPortraitData(coherenceResults) {
        const faces = {};

        // --------------------------------------------------------
        // Get face-level octaves if available from face-wizard
        // --------------------------------------------------------
        let faceOctavesMap = {};
        if (typeof global.getFaceOctaves === 'function') {
            faceOctavesMap = global.getFaceOctaves();
        }

        // --------------------------------------------------------
        // Detect overall octave
        // --------------------------------------------------------
        let overallOctave = 'O3';
        if (typeof global.getOverallOctave === 'function') {
            overallOctave = global.getOverallOctave() || 'O3';
        } else if (Object.keys(faceOctavesMap).length > 0) {
            // Fallback: get from face octaves map
            const octaveValues = Object.values(faceOctavesMap).map(f => f.octave || 'O3');
            overallOctave = octaveValues[0] || 'O3';
        }

        // --------------------------------------------------------
        // Transform each face
        // --------------------------------------------------------
        coherenceResults.faces.forEach(face => {
            // Extract elemental breakdown if available
            const elements = extractElementalData(face);

            // Get face coherence
            const faceCoherence = face.energy || face.faceEnergy || 0.5;

            // Detect operational octave based on coherence AND elemental engagement
            const octaveInfo = detectOctave(faceCoherence, elements);

            // Get face-specific octave or use detected
            const faceOctaveInfo = faceOctavesMap[face.id];
            const faceOctave = faceOctaveInfo?.octave || face.targetOctave || octaveInfo.effective;

            faces[face.id] = {
                name: face.name || `Face ${face.id}`,
                coherence: faceCoherence,
                targetOctave: faceOctave,
                octaveInfo: octaveInfo,  // Include full octave detection info
                elements: elements,
                kpis: face.kpis || [],
                warnings: []
            };

            // --------------------------------------------------------
            // Add warnings for low coherence
            // --------------------------------------------------------
            // PHI^-2 = 0.381966... is the Structure threshold
            if (faceCoherence < 0.382) {
                faces[face.id].warnings.push('Critical: coherence below phi^2 threshold');
            } else if (faceCoherence < 0.5) {
                faces[face.id].warnings.push('Attention needed: developing coherence');
            }

            // Add warning if octave is limited by elemental coverage
            if (octaveInfo.limitedBy === 'elemental_coverage') {
                faces[face.id].warnings.push(`Octave limited: explore more elements to unlock ${octaveInfo.coherenceBased}`);
            }
        });

        // --------------------------------------------------------
        // Ensure all 12 faces exist (fill missing with defaults)
        // --------------------------------------------------------
        for (let i = 1; i <= 12; i++) {
            if (!faces[i]) {
                faces[i] = {
                    name: getDefaultFaceName(i),
                    coherence: 0,
                    targetOctave: overallOctave,
                    elements: getDefaultElements(),
                    kpis: [],
                    warnings: ['No data available']
                };
            }
        }

        return {
            overallCoherence: coherenceResults.globalCoherence || 0.5,
            octave: overallOctave,
            faces: faces
        };
    }

    /**
     * Extract elemental breakdown from face data
     * Enhanced: Tracks which elements are explored vs unexplored
     *
     * The 5 elements (pentagram) are:
     *   - Earth (Foundation): Is it grounded?
     *   - Water (Flow): Is it flowing?
     *   - Fire (Energy): Is there action?
     *   - Air (Communication): Is it clear?
     *   - Ether (Purpose): Is it aligned?
     *
     * @param {Object} face - Face data object
     * @returns {Object} Elemental breakdown with values and exploration status
     * @private
     */
    function extractElementalData(face) {
        // If face has explicit elemental data, use it
        if (face.elements) return face.elements;

        // Default: all elements unexplored (Quick Mode starts here)
        const elements = {
            earth: { value: null, label: 'Foundation', explored: false, question: 'Is it grounded?' },
            water: { value: null, label: 'Flow', explored: false, question: 'Is it flowing?' },
            fire: { value: null, label: 'Energy', explored: false, question: 'Is there action?' },
            air: { value: null, label: 'Communication', explored: false, question: 'Is it clear?' },
            ether: { value: null, label: 'Purpose', explored: false, question: 'Is it aligned?' }
        };

        if (face.kpis && face.kpis.length > 0) {
            // Try to extract from elemental KPIs
            const elementalKpis = {
                earth: face.kpis.filter(k => k.element === 'earth' || k.element === 'Earth'),
                water: face.kpis.filter(k => k.element === 'water' || k.element === 'Water'),
                fire: face.kpis.filter(k => k.element === 'fire' || k.element === 'Fire'),
                air: face.kpis.filter(k => k.element === 'air' || k.element === 'Air'),
                ether: face.kpis.filter(k => k.element === 'ether' || k.element === 'Ether')
            };

            Object.keys(elementalKpis).forEach(element => {
                const kpis = elementalKpis[element];
                if (kpis.length > 0) {
                    const avgScore = kpis.reduce((sum, k) => sum + (k.normalizedScore || 0.5), 0) / kpis.length;
                    elements[element] = {
                        value: avgScore,
                        label: kpis[0]?.label || kpis[0]?.name || element,
                        explored: true,
                        kpiName: kpis[0]?.name,
                        question: elements[element].question
                    };
                }
            });

            // --------------------------------------------------------
            // Quick Mode fallback
            // --------------------------------------------------------
            // If no element tags exist but face has KPIs, assign all to Earth
            // This handles the Quick Mode scenario where users enter a single
            // KPI without specifying which element it belongs to.
            // --------------------------------------------------------
            const hasElementTags = Object.values(elementalKpis).some(arr => arr.length > 0);
            if (!hasElementTags && face.kpis.length > 0) {
                // In Quick Mode, the single KPI represents Earth element
                const kpi = face.kpis[0];
                const score = kpi.normalizedScore || kpi.coherence || face.energy || 0.5;
                elements.earth = {
                    value: score,
                    label: kpi.name || 'Foundation',
                    explored: true,
                    kpiName: kpi.name,
                    question: 'Is it grounded?'
                };
            }
        }

        return elements;
    }

    /**
     * Detect operational octave based on coherence and engaged elements
     *
     * Philosophy: Octave isn't a reward - it's recognition of which level
     * questions are being engaged. You can't claim O7 Radiance if you're
     * only engaging with Earth element questions.
     *
     * Uses centralized PHI-derived thresholds from OCTAVE_COHERENCE_THRESHOLDS.
     *
     * @param {number} faceCoherence - Face coherence score (0-1)
     * @param {Object} elementsExplored - Elemental data with exploration status
     * @returns {Object} Octave detection result with:
     *   - detected: Base octave from coherence score
     *   - effective: Actual octave after elemental engagement cap
     *   - limitedBy: 'elemental_coverage' if capped, null otherwise
     *   - exploredCount: Number of explored elements
     *   - coherenceBased: Same as detected (for reference)
     * @private
     */
    function detectOctave(faceCoherence, elementsExplored) {
        // Count how many elements have data
        const exploredCount = Object.values(elementsExplored).filter(e => e.explored).length;

        // Use centralized PHI-based coherence thresholds
        const thresholds = global.OCTAVE_COHERENCE_THRESHOLDS || {
            O7: 0.95, O6: 0.854, O5: 0.764, O4: 0.618, O3: 0.5, O2: 0.382
        };

        // --------------------------------------------------------
        // Base octave from coherence score
        // --------------------------------------------------------
        let detectedOctave = 'O1';
        if (faceCoherence >= thresholds.O7) detectedOctave = 'O7';       // 0.95 - Radiance
        else if (faceCoherence >= thresholds.O6) detectedOctave = 'O6'; // PSI^4 ~ 0.854 - Vision
        else if (faceCoherence >= thresholds.O5) detectedOctave = 'O5'; // PSI^3 ~ 0.764 - Expression
        else if (faceCoherence >= thresholds.O4) detectedOctave = 'O4'; // PHI^-1 ~ 0.618 - Creativity
        else if (faceCoherence >= thresholds.O3) detectedOctave = 'O3'; // 0.5 - Relationships
        else if (faceCoherence >= thresholds.O2) detectedOctave = 'O2'; // PHI^-2 ~ 0.382 - Structure

        // --------------------------------------------------------
        // Elemental engagement can elevate or limit octave
        // --------------------------------------------------------
        // Full elemental engagement (5/5) allows full octave expression
        // Partial engagement caps the effective octave:
        //   1 element explored = max O3
        //   2 elements explored = max O4
        //   3 elements explored = max O5
        //   4 elements explored = max O6
        //   5 elements explored = max O7 (no cap)
        // --------------------------------------------------------
        const octaveOrder = ['O1', 'O2', 'O3', 'O4', 'O5', 'O6', 'O7'];
        const maxOctaveByEngagement = Math.min(exploredCount + 2, 7);
        const detectedIndex = octaveOrder.indexOf(detectedOctave);
        const effectiveIndex = Math.min(detectedIndex, maxOctaveByEngagement - 1);

        return {
            detected: detectedOctave,
            effective: octaveOrder[effectiveIndex],
            limitedBy: effectiveIndex < detectedIndex ? 'elemental_coverage' : null,
            exploredCount: exploredCount,
            coherenceBased: detectedOctave
        };
    }

    /**
     * Get default elements structure
     * Used when no elemental data is available for a face.
     *
     * @returns {Object} Default elemental structure with all values at 0
     * @private
     */
    function getDefaultElements() {
        return {
            earth: { value: 0, label: 'Foundation' },
            water: { value: 0, label: 'Flow' },
            fire: { value: 0, label: 'Energy' },
            air: { value: 0, label: 'Communication' },
            ether: { value: 0, label: 'Purpose' }
        };
    }

    /**
     * Get default face name for a given face ID
     * Used when face name is not provided in data.
     *
     * The 12 faces of the dodecahedron represent organizational domains:
     *   1: Financial Capital
     *   2: Intellectual Capital
     *   3: Human Capital
     *   4: Structural Capital
     *   5: Market Resonance
     *   6: Community & Partners
     *   7: Brand & Reputation
     *   8: Core Operations
     *   9: Regenerative Flow
     *   10: Foundational Values
     *   11: Funding Pipeline
     *   12: Risk & Resilience
     *
     * @param {number} faceId - Face ID (1-12)
     * @returns {string} Default face name
     * @private
     */
    function getDefaultFaceName(faceId) {
        const defaultNames = {
            1: 'Financial Capital',
            2: 'Intellectual Capital',
            3: 'Human Capital',
            4: 'Structural Capital',
            5: 'Market Resonance',
            6: 'Community & Partners',
            7: 'Brand & Reputation',
            8: 'Core Operations',
            9: 'Regenerative Flow',
            10: 'Foundational Values',
            11: 'Funding Pipeline',
            12: 'Risk & Resilience'
        };
        return defaultNames[faceId] || `Face ${faceId}`;
    }

    // ========================================
    // EXPORTS TO GLOBAL SCOPE
    // ========================================
    //
    // These functions and constants are exported to window/global
    // so they can be called from other modules (e.g., goToStep,
    // loadDemoResultsFromStorage, etc.)
    //
    // ========================================

    // Public functions (called from other parts of the application)
    global.initializeCoherenceHero = initializeCoherenceHero;
    global.initializeOctaveDashboard = initializeOctaveDashboard;
    global.initializePortraitView = initializePortraitView;
    global.detectOctaveFromCoherence = detectOctaveFromCoherence;

    // Constants (may be useful for debugging or external modules)
    global.OCTAVE_REFERENCE = OCTAVE_REFERENCE;

    console.log('[orchestrator-dashboard] Module loaded - Octave Dashboard and Portrait View ready');

})(typeof window !== 'undefined' ? window : this);
