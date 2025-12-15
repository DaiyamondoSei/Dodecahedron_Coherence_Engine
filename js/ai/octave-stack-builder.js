/**
 * ========================================
 * OCTAVE STACK BUILDER - Hybrid Orchestrator
 * ========================================
 *
 * Builds complete octave stacks using the hybrid approach:
 * - Foundation octaves (O1 to O(n-1)): From CSV templates (instant, reliable)
 * - Target octave (On): AI-generated with story context (creative, contextual)
 *
 * Core Philosophy:
 * "You cannot claim O5 without coherent O1-O4 foundation"
 *
 * This ensures developmental honesty - organizations must have stable
 * foundations before reaching for higher octaves.
 *
 * @module OctaveStackBuilder
 * @version Sprint 2 - Phase 2 (Octave-Stack Architecture)
 */

import { getOctaveKPIReference, OCTAVES, OCTAVE_NAMES, OCTAVE_FOCUS, FACE_NAMES } from './octave-kpi-reference.js';

// PHI-based thresholds for coherence scoring
// Single source: js/constants/phi-harmonics.js (window.PhiHarmonics)
// Note: These are PHI POWERS (φ^-n), not PHI itself
const _PH = (typeof window !== 'undefined' && window.PhiHarmonics) || {};
const PHI_1 = _PH.PHI_1 || 0.618033988749895;     // φ^-1 (creativity threshold)
const PHI_2 = _PH.PHI_2 || 0.381966011250105;     // φ^-2 (structure threshold)
const PSI_3 = _PH.PSI_3 || 0.763932022500210;     // 1-φ^-3 (expression threshold)

// Legacy aliases for backward compatibility
const PHI = PHI_1;          // Note: This is φ^-1, not φ itself
const PHI_SQUARED = PHI_2;  // Note: This is φ^-2, not φ²
const PHI_PLUS = PSI_3;     // Note: This is ψ₃ = 1-φ^-3

/**
 * OctaveStackBuilder - Orchestrates hybrid KPI generation
 */
class OctaveStackBuilder {
    constructor(options = {}) {
        this.fallbackChain = options.fallbackChain || null;
        this.kpiReference = null;
        this.initialized = false;
    }

    /**
     * Initialize the builder (loads CSV reference)
     */
    async initialize() {
        if (this.initialized) return;

        this.kpiReference = await getOctaveKPIReference();
        this.initialized = true;
        console.log('[OctaveStackBuilder] Initialized');
    }

    /**
     * Build complete octave stack for all 12 faces
     *
     * @param {string} storyText - Organization story for AI context
     * @param {string} targetOctave - Detected target octave ('O1'-'O7')
     * @param {Array} faces - Array of face configurations (id, name, sentiment)
     * @param {Object} options - Additional options
     * @returns {Object} Complete octave stack with all faces
     */
    async buildOctaveStack(storyText, targetOctave, faces, options = {}) {
        await this.initialize();

        const {
            useAI = true,
            fallbackChain = this.fallbackChain
        } = options;

        console.log(`[OctaveStackBuilder] Building octave stack for target ${targetOctave}`);

        const result = {
            targetOctave: targetOctave,
            targetOctaveName: OCTAVE_NAMES[targetOctave],
            targetOctaveFocus: OCTAVE_FOCUS[targetOctave],
            faces: {},
            meta: {
                foundationSource: 'csv_template',
                targetSource: useAI ? 'pending' : 'csv_template',
                buildTime: new Date().toISOString()
            }
        };

        // Build stack for each face
        for (const face of faces) {
            const faceId = face.id || face.faceId;
            const faceName = face.name || FACE_NAMES[faceId];

            result.faces[faceId] = await this._buildFaceStack(
                faceId,
                faceName,
                targetOctave,
                storyText,
                face.sentiment,
                { useAI, fallbackChain }
            );
        }

        // Calculate aggregate metrics
        result.aggregates = this._calculateAggregates(result.faces, targetOctave);
        result.meta.targetSource = useAI ? (result.aggregates.aiUsed ? 'ai' : 'csv_template') : 'csv_template';

        console.log('[OctaveStackBuilder] Octave stack built successfully');
        return result;
    }

    /**
     * Build octave stack for a single face
     */
    async _buildFaceStack(faceId, faceName, targetOctave, storyText, sentiment, options) {
        const { useAI, fallbackChain } = options;

        const faceStack = {
            faceId: faceId,
            faceName: faceName,
            targetOctave: targetOctave,
            sentiment: sentiment || 0.5,
            octaveStack: {},
            foundationStability: null,
            stackCoherence: null,
            warnings: []
        };

        // Step 1: Load foundation octaves from templates
        const targetIndex = OCTAVES.indexOf(targetOctave);

        for (let i = 0; i < targetIndex; i++) {
            const octave = OCTAVES[i];
            const templateKPIs = this.kpiReference.getOctaveKPIs(faceId, octave);

            faceStack.octaveStack[octave] = {
                name: OCTAVE_NAMES[octave],
                focus: OCTAVE_FOCUS[octave],
                status: 'foundation',
                kpis: templateKPIs.map(kpi => ({
                    ...kpi,
                    value: null,  // To be filled by user
                    coherenceScore: null
                })),
                coherenceScore: null,
                source: 'csv_template'
            };
        }

        // Step 2: Generate target octave KPIs
        let targetKPIs;
        let targetSource = 'csv_template';

        if (useAI && fallbackChain) {
            try {
                // Try to get AI-generated KPIs for target octave
                targetKPIs = await this._getAITargetKPIs(
                    faceId,
                    faceName,
                    targetOctave,
                    storyText,
                    fallbackChain
                );
                targetSource = 'ai';
            } catch (error) {
                console.warn(`[OctaveStackBuilder] AI failed for face ${faceId}, using templates:`, error.message);
                targetKPIs = this.kpiReference.getOctaveKPIs(faceId, targetOctave);
            }
        } else {
            targetKPIs = this.kpiReference.getOctaveKPIs(faceId, targetOctave);
        }

        faceStack.octaveStack[targetOctave] = {
            name: OCTAVE_NAMES[targetOctave],
            focus: OCTAVE_FOCUS[targetOctave],
            status: 'target',
            kpis: targetKPIs.map(kpi => ({
                ...kpi,
                value: null,
                coherenceScore: null
            })),
            coherenceScore: null,
            source: targetSource
        };

        // Step 3: Calculate initial coherence estimates
        faceStack.foundationStability = this._estimateFoundationStability(faceStack, sentiment);
        faceStack.stackCoherence = this._estimateStackCoherence(faceStack, sentiment);

        // Step 4: Generate warnings
        faceStack.warnings = this._generateWarnings(faceStack, targetIndex);

        return faceStack;
    }

    /**
     * Get AI-generated KPIs for target octave
     */
    async _getAITargetKPIs(faceId, faceName, targetOctave, storyText, fallbackChain) {
        // Build a focused prompt for single-face, single-octave KPIs
        const faceContext = this._extractFaceContext(storyText, faceName);

        // Use fallback chain to get 5 KPIs for this face at target octave
        const result = await fallbackChain.extractKPIs(faceContext || storyText, 'full', targetOctave);

        // Extract just the KPIs for this face
        const faceKPIs = result.kpis?.filter(kpi => kpi.faceId === faceId) || [];

        if (faceKPIs.length >= 5) {
            return faceKPIs.slice(0, 5);  // Take first 5
        }

        // If not enough KPIs, supplement with templates
        const templateKPIs = this.kpiReference.getOctaveKPIs(faceId, targetOctave);
        const merged = [];

        for (let i = 0; i < 5; i++) {
            if (i < faceKPIs.length) {
                merged.push({
                    ...faceKPIs[i],
                    source: 'ai'
                });
            } else {
                merged.push({
                    ...templateKPIs[i],
                    source: 'csv_template'
                });
            }
        }

        return merged;
    }

    /**
     * Extract context relevant to a specific face from the story
     */
    _extractFaceContext(storyText, faceName) {
        // Simple keyword extraction - could be enhanced with NLP
        const keywords = faceName.toLowerCase().split(/\s+/);
        const sentences = storyText.split(/[.!?]+/);

        const relevantSentences = sentences.filter(sentence => {
            const lowerSentence = sentence.toLowerCase();
            return keywords.some(kw => lowerSentence.includes(kw));
        });

        if (relevantSentences.length > 0) {
            return relevantSentences.join('. ') + '.';
        }

        return null;  // Use full story if no specific context found
    }

    /**
     * Estimate foundation stability from sentiment (before user input)
     */
    _estimateFoundationStability(faceStack, sentiment) {
        const foundationOctaves = Object.entries(faceStack.octaveStack)
            .filter(([_, data]) => data.status === 'foundation');

        if (foundationOctaves.length === 0) return 1.0;  // O1 target has no foundation

        // Use sentiment as proxy for foundation health
        // This will be replaced with actual values when user inputs data
        return Math.max(0.1, Math.min(1.0, sentiment || 0.5));
    }

    /**
     * Estimate stack coherence (geometric mean of all octaves)
     */
    _estimateStackCoherence(faceStack, sentiment) {
        // Simple estimate based on sentiment
        // Real calculation will use actual KPI values
        return Math.max(0.1, Math.min(1.0, sentiment || 0.5));
    }

    /**
     * Generate warnings based on stack analysis
     */
    _generateWarnings(faceStack, targetIndex) {
        const warnings = [];

        // Warning: Low estimated foundation
        if (faceStack.foundationStability < PHI_SQUARED) {
            warnings.push({
                type: 'foundation_weak',
                message: `Foundation stability is low (${(faceStack.foundationStability * 100).toFixed(0)}%). Consider strengthening O1-O${targetIndex} before reaching for O${targetIndex + 1}.`,
                severity: 'warning'
            });
        }

        // Warning: High octave with no data
        if (targetIndex >= 4) {  // O5 or higher
            warnings.push({
                type: 'high_octave_unvalidated',
                message: `Targeting ${OCTAVE_NAMES[OCTAVES[targetIndex]]} (O${targetIndex + 1}) requires validated foundation. Complete foundation assessments first.`,
                severity: 'info'
            });
        }

        // Warning: Missing foundation octaves
        if (targetIndex > 0) {
            const foundationCount = Object.values(faceStack.octaveStack)
                .filter(o => o.status === 'foundation').length;

            if (foundationCount < targetIndex) {
                warnings.push({
                    type: 'foundation_incomplete',
                    message: `Only ${foundationCount}/${targetIndex} foundation octaves loaded.`,
                    severity: 'error'
                });
            }
        }

        return warnings;
    }

    /**
     * Calculate aggregate metrics across all faces
     */
    _calculateAggregates(faces, targetOctave) {
        const faceArray = Object.values(faces);
        const count = faceArray.length;

        if (count === 0) {
            return {
                overallFoundationStability: 0,
                overallStackCoherence: 0,
                facesWithWarnings: 0,
                aiUsed: false
            };
        }

        // Geometric mean of foundation stability
        const stabilities = faceArray.map(f => f.foundationStability || 0.5);
        const overallFoundationStability = Math.pow(
            stabilities.reduce((a, b) => a * b, 1),
            1 / count
        );

        // Geometric mean of stack coherence
        const coherences = faceArray.map(f => f.stackCoherence || 0.5);
        const overallStackCoherence = Math.pow(
            coherences.reduce((a, b) => a * b, 1),
            1 / count
        );

        // Count faces with warnings
        const facesWithWarnings = faceArray.filter(f => f.warnings.length > 0).length;

        // Check if AI was used
        const aiUsed = faceArray.some(f =>
            Object.values(f.octaveStack).some(o => o.source === 'ai')
        );

        return {
            overallFoundationStability,
            overallStackCoherence,
            facesWithWarnings,
            totalWarnings: faceArray.reduce((sum, f) => sum + f.warnings.length, 0),
            aiUsed
        };
    }

    // ========================================
    // COHERENCE CALCULATION (for user-provided values)
    // ========================================

    /**
     * Calculate coherence scores after user provides KPI values
     *
     * @param {Object} faceStack - Face octave stack
     * @param {Object} values - Map of KPI id -> value (0-1)
     * @returns {Object} Updated face stack with coherence scores
     */
    calculateCoherence(faceStack, values) {
        const updated = { ...faceStack };

        // Calculate coherence for each octave
        for (const [octave, octaveData] of Object.entries(updated.octaveStack)) {
            const kpiScores = octaveData.kpis.map(kpi => {
                const kpiId = `${faceStack.faceId}_${octave}_${kpi.elementCode}`;
                const value = values[kpiId] ?? kpi.value ?? 0.5;
                return value;
            });

            // Geometric mean of KPI values
            if (kpiScores.length > 0 && kpiScores.every(s => s > 0)) {
                octaveData.coherenceScore = Math.pow(
                    kpiScores.reduce((a, b) => a * b, 1),
                    1 / kpiScores.length
                );
            } else {
                octaveData.coherenceScore = 0;
            }
        }

        // Recalculate foundation stability
        const foundationOctaves = Object.entries(updated.octaveStack)
            .filter(([_, data]) => data.status === 'foundation')
            .map(([_, data]) => data.coherenceScore || 0.5);

        if (foundationOctaves.length > 0) {
            updated.foundationStability = Math.pow(
                foundationOctaves.reduce((a, b) => a * b, 1),
                1 / foundationOctaves.length
            );
        }

        // Recalculate overall stack coherence
        const allOctaves = Object.values(updated.octaveStack)
            .map(data => data.coherenceScore || 0.5);

        if (allOctaves.length > 0) {
            updated.stackCoherence = Math.pow(
                allOctaves.reduce((a, b) => a * b, 1),
                1 / allOctaves.length
            );
        }

        // Update warnings based on actual coherence
        updated.warnings = this._generateCoherenceWarnings(updated);

        return updated;
    }

    /**
     * Generate warnings based on actual coherence scores
     */
    _generateCoherenceWarnings(faceStack) {
        const warnings = [];

        // Check foundation stability
        if (faceStack.foundationStability < PHI_SQUARED) {
            const weakOctaves = Object.entries(faceStack.octaveStack)
                .filter(([_, data]) => data.status === 'foundation' && data.coherenceScore < PHI_SQUARED)
                .map(([octave, _]) => octave);

            if (weakOctaves.length > 0) {
                warnings.push({
                    type: 'foundation_weak',
                    message: `Foundation needs attention: ${weakOctaves.join(', ')} require strengthening.`,
                    severity: 'warning',
                    octaves: weakOctaves
                });
            }
        }

        // Check for dramatic jumps in coherence (incoherent profile)
        const scores = Object.entries(faceStack.octaveStack)
            .sort((a, b) => OCTAVES.indexOf(a[0]) - OCTAVES.indexOf(b[0]))
            .map(([_, data]) => data.coherenceScore || 0.5);

        for (let i = 1; i < scores.length; i++) {
            const jump = scores[i] - scores[i - 1];
            if (jump > 0.3) {  // 30% jump between adjacent octaves
                warnings.push({
                    type: 'coherence_gap',
                    message: `Unusual jump in coherence between O${i} and O${i + 1}. This may indicate developmental gaps.`,
                    severity: 'info'
                });
                break;  // Only one such warning
            }
        }

        return warnings;
    }
}

// ========================================
// SINGLETON INSTANCE
// ========================================

let builderInstance = null;

/**
 * Get singleton instance of OctaveStackBuilder
 */
function getOctaveStackBuilder(options = {}) {
    if (!builderInstance) {
        builderInstance = new OctaveStackBuilder(options);
    }
    return builderInstance;
}

// ========================================
// EXPORTS
// ========================================

export {
    OctaveStackBuilder,
    getOctaveStackBuilder
};

// Export for browser global
if (typeof window !== 'undefined') {
    window.OctaveStackBuilder = OctaveStackBuilder;
    window.getOctaveStackBuilder = getOctaveStackBuilder;
}

console.log('[OctaveStackBuilder] Module loaded');
