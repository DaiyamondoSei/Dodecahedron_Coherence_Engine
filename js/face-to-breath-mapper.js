/**
 * ═══════════════════════════════════════════════════════════════════════════
 * @module face-to-breath-mapper
 * @description Intelligently maps custom face names to the 6 breath axes
 * @version 2.0.0
 * @since December 2025 (original), January 2026 (IIFE refactor)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                        NOTES FOR FUTURE CLAUDE                         │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * WHAT THIS MODULE DOES:
 * - Maps custom face names to the 6 breath axes using keyword detection
 * - Uses heuristic matching (no AI API required)
 * - Supports both predefined companies and custom data
 *
 * WHY IIFE PATTERN (January 2026 Fix):
 * - Prevents global scope pollution with BREATH_AXIS_DEFINITIONS
 * - phi-harmonics.js exports BREATH_AXES as a number (count = 6)
 * - This module needs BREATH_AXIS_DEFINITIONS as an array (the full definitions)
 * - IIFE encapsulation prevents `const` redeclaration errors
 *
 * DATA CONTRACT:
 * - Input: Array of 12 face objects with {id, name}
 * - Output: Array of 6 breath axis mappings
 * - SSOT: PhiHarmonics.BREATH_AXES = 6 (count), this module has definitions
 *
 * DEPENDENCY MAP:
 * ┌──────────────────────┐     ┌──────────────────┐
 * │   Logger utility     │ --> │   THIS MODULE    │ --> exports to window.FaceToBreathMapper
 * └──────────────────────┘     └──────────────────┘
 *
 * EXPORTS:
 * - window.FaceToBreathMapper.mapFacesToBreathAxes(faces)
 * - window.FaceToBreathMapper.getBreathAxisConfig(company, facesData)
 * - window.FaceToBreathMapper.BREATH_AXIS_DEFINITIONS (array of 6 axis definitions)
 *
 * ═══════════════════════════════════════════════════════════════════════════
 */

(function(global) {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════
    // BREATH AXIS DEFINITIONS (local to this IIFE)
    // ═══════════════════════════════════════════════════════════════════════
    //
    // Note: PhiHarmonics.BREATH_AXES exports the COUNT (6).
    // This module contains the full DEFINITIONS array.
    //
    // ═══════════════════════════════════════════════════════════════════════

    const BREATH_AXIS_DEFINITIONS = [
        {
            id: 1,
            name: 'Resource Flow',
            description: 'Money, funding, capital flowing in and out',
            defaultFaces: [11, 1], // Funding Pipeline → Financial Capital
            defaultNames: ['Funding Pipeline', 'Financial Capital'],
            keywords: {
                inhale: ['funding', 'investment', 'capital raise', 'financing', 'revenue', 'income', 'pipeline'],
                exhale: ['financial', 'cash', 'capital', 'money', 'budget', 'treasury', 'resources']
            }
        },
        {
            id: 2,
            name: 'Substance & Story',
            description: 'Building expertise and communicating value',
            defaultFaces: [7, 2], // Brand → Intellectual
            defaultNames: ['Brand & Reputation', 'Intellectual Capital'],
            keywords: {
                inhale: ['brand', 'reputation', 'marketing', 'image', 'identity', 'communication', 'story'],
                exhale: ['intellectual', 'knowledge', 'expertise', 'innovation', 'ip', 'research', 'learning']
            }
        },
        {
            id: 3,
            name: 'Being & Doing',
            description: 'Team development and productive work',
            defaultFaces: [8, 3], // Operations → Human
            defaultNames: ['Core Operations', 'Human Capital'],
            keywords: {
                inhale: ['operations', 'processes', 'execution', 'delivery', 'production', 'work', 'activity'],
                exhale: ['human', 'team', 'people', 'talent', 'culture', 'employees', 'skills', 'workforce']
            }
        },
        {
            id: 4,
            name: 'Form & Integrity',
            description: 'Structure and regenerative capacity',
            defaultFaces: [4, 9], // Structural → Regenerative
            defaultNames: ['Structural Capital', 'Regenerative Flow'],
            keywords: {
                inhale: ['structure', 'systems', 'infrastructure', 'architecture', 'framework', 'organization'],
                exhale: ['regenerative', 'sustainability', 'renewal', 'adaptability', 'resilience', 'evolution']
            }
        },
        {
            id: 5,
            name: 'Perception & Truth',
            description: 'Market perception and core values',
            defaultFaces: [5, 10], // Market → Values
            defaultNames: ['Market Resonance', 'Foundational Values'],
            keywords: {
                inhale: ['market', 'customer', 'demand', 'perception', 'awareness', 'positioning', 'fit'],
                exhale: ['values', 'mission', 'vision', 'purpose', 'ethics', 'principles', 'culture', 'foundation']
            }
        },
        {
            id: 6,
            name: 'Network & Fortress',
            description: 'Community connections and protective resilience',
            defaultFaces: [6, 12], // Community → Risk
            defaultNames: ['Community & Partners', 'Risk & Resilience'],
            keywords: {
                inhale: ['community', 'partners', 'network', 'relationships', 'ecosystem', 'collaboration'],
                exhale: ['risk', 'resilience', 'security', 'protection', 'safety', 'stability', 'defense']
            }
        }
    ];

    // ═══════════════════════════════════════════════════════════════════════
    // HELPER FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Calculate keyword similarity score between a face name and keyword set
     */
    function calculateKeywordScore(faceName, keywords) {
        const lowerName = faceName.toLowerCase();
        let score = 0;

        keywords.forEach(keyword => {
            if (lowerName.includes(keyword)) {
                // Exact match
                score += 10;
            } else if (keyword.includes(lowerName) || lowerName.includes(keyword.substring(0, 4))) {
                // Partial match (e.g., "fund" matches "funding")
                score += 5;
            }
        });

        return score;
    }

    /**
     * Find best breath axis match for a face
     */
    function findBestAxisMatch(faceName, direction) {
        let bestMatch = null;
        let bestScore = 0;

        BREATH_AXIS_DEFINITIONS.forEach(axis => {
            const keywords = direction === 'inhale' ? axis.keywords.inhale : axis.keywords.exhale;
            const score = calculateKeywordScore(faceName, keywords);

            if (score > bestScore) {
                bestScore = score;
                bestMatch = axis.id;
            }
        });

        return { axisId: bestMatch, score: bestScore };
    }

    // ═══════════════════════════════════════════════════════════════════════
    // MAIN MAPPING FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Map custom faces to breath axes
     * @param {Array} faces - Array of 12 face objects with {id, name}
     * @returns {Array} - Array of 6 breath axis mappings
     */
    function mapFacesToBreathAxes(faces) {
        Logger.info('FaceToBreathMapper', 'Mapping custom faces to breath axes...');

        // If not exactly 12 faces, use sequential pairing
        if (faces.length !== 12) {
            Logger.warn('FaceToBreathMapper', `Expected 12 faces, got ${faces.length} - using sequential pairing`);
            return createSequentialMapping(faces);
        }

        const mappings = [];
        const usedFaceIds = new Set();

        // Try to map each axis intelligently
        BREATH_AXIS_DEFINITIONS.forEach(axis => {
            // Find best matches for inhale and exhale
            const availableFaces = faces.filter(f => !usedFaceIds.has(f.id));

            if (availableFaces.length < 2) {
                // Not enough faces left, use sequential
                const remaining = faces.filter(f => !usedFaceIds.has(f.id));
                if (remaining.length >= 2) {
                    mappings.push({
                        axisId: axis.id,
                        axisName: axis.name,
                        inhaleFace: remaining[0],
                        exhaleFace: remaining[1],
                        confidence: 'low',
                        method: 'sequential'
                    });
                    usedFaceIds.add(remaining[0].id);
                    usedFaceIds.add(remaining[1].id);
                }
                return;
            }

            // Find best inhale match
            let bestInhale = null;
            let bestInhaleScore = 0;

            availableFaces.forEach(face => {
                const match = findBestAxisMatch(face.name, 'inhale');
                if (match.axisId === axis.id && match.score > bestInhaleScore) {
                    bestInhaleScore = match.score;
                    bestInhale = face;
                }
            });

            // Find best exhale match (excluding inhale face)
            const availableForExhale = availableFaces.filter(f => f.id !== bestInhale?.id);
            let bestExhale = null;
            let bestExhaleScore = 0;

            availableForExhale.forEach(face => {
                const match = findBestAxisMatch(face.name, 'exhale');
                if (match.axisId === axis.id && match.score > bestExhaleScore) {
                    bestExhaleScore = match.score;
                    bestExhale = face;
                }
            });

            // Determine confidence
            let confidence = 'high';
            let method = 'keyword';

            if (bestInhaleScore === 0 && bestExhaleScore === 0) {
                // No keyword matches - use first two available
                confidence = 'low';
                method = 'sequential';
                bestInhale = availableFaces[0];
                bestExhale = availableFaces[1] || availableFaces[0];
            } else if (bestInhaleScore < 5 || bestExhaleScore < 5) {
                confidence = 'medium';
            }

            // Add mapping
            if (bestInhale && bestExhale) {
                mappings.push({
                    axisId: axis.id,
                    axisName: axis.name,
                    inhaleFace: bestInhale,
                    exhaleFace: bestExhale,
                    confidence: confidence,
                    method: method
                });

                usedFaceIds.add(bestInhale.id);
                usedFaceIds.add(bestExhale.id);

                Logger.debug('FaceToBreathMapper', `Axis ${axis.id} (${axis.name}): ${bestInhale.name} ↔ ${bestExhale.name} [${confidence} confidence, ${method}]`);
            }
        });

        // Fill in any missing mappings with remaining faces
        const remainingFaces = faces.filter(f => !usedFaceIds.has(f.id));
        if (remainingFaces.length > 0) {
            Logger.debug('FaceToBreathMapper', `${remainingFaces.length} faces not mapped: ${remainingFaces.map(f => f.name).join(', ')}`);
        }

        Logger.info('FaceToBreathMapper', `Mapped ${mappings.length} breath axes`);
        return mappings;
    }

    /**
     * Create sequential pairing as fallback
     */
    function createSequentialMapping(faces) {
        Logger.info('FaceToBreathMapper', 'Creating sequential mapping (fallback)');

        const mappings = [];
        for (let i = 0; i < Math.min(6, Math.floor(faces.length / 2)); i++) {
            const axis = BREATH_AXIS_DEFINITIONS[i];
            const inhaleFace = faces[i * 2];
            const exhaleFace = faces[i * 2 + 1];

            if (inhaleFace && exhaleFace) {
                mappings.push({
                    axisId: axis.id,
                    axisName: axis.name,
                    inhaleFace: inhaleFace,
                    exhaleFace: exhaleFace,
                    confidence: 'low',
                    method: 'sequential'
                });
            }
        }

        return mappings;
    }

    /**
     * Get breath axis configuration for a company
     * Detects if custom or predefined company
     */
    function getBreathAxisConfig(company, facesData) {
        // Predefined companies use hardcoded mapping
        if (company.id !== 'custom') {
            Logger.info('FaceToBreathMapper', `Using predefined breath axis mapping for: ${company.id}`);
            return {
                mode: 'predefined',
                axes: BREATH_AXIS_DEFINITIONS.map(axis => ({
                    axisId: axis.id,
                    axisName: axis.name,
                    inhaleFace: facesData.find(f => f.id === axis.defaultFaces[0]),
                    exhaleFace: facesData.find(f => f.id === axis.defaultFaces[1]),
                    confidence: 'high',
                    method: 'predefined'
                }))
            };
        }

        // Custom companies use intelligent mapping
        Logger.info('FaceToBreathMapper', 'Detecting custom company - using intelligent face mapping');

        // Extract face info from facesData
        const faces = facesData.map(f => ({
            id: f.id,
            name: f.name
        }));

        const mappings = mapFacesToBreathAxes(faces);

        return {
            mode: 'custom',
            axes: mappings,
            summary: {
                highConfidence: mappings.filter(m => m.confidence === 'high').length,
                mediumConfidence: mappings.filter(m => m.confidence === 'medium').length,
                lowConfidence: mappings.filter(m => m.confidence === 'low').length
            }
        };
    }

    // ═══════════════════════════════════════════════════════════════════════
    // EXPORTS
    // ═══════════════════════════════════════════════════════════════════════

    global.FaceToBreathMapper = {
        mapFacesToBreathAxes,
        getBreathAxisConfig,
        BREATH_AXIS_DEFINITIONS,
        // Legacy alias for backward compatibility
        BREATH_AXES: BREATH_AXIS_DEFINITIONS
    };

    Logger.info('FaceToBreathMapper', 'Face-to-Breath Mapper loaded (IIFE encapsulated)');

})(typeof window !== 'undefined' ? window : this);
