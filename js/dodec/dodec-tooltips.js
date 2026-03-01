/**
 * ════════════════════════════════════════════════════════════════════════════
 * MODULE: dodec-tooltips.js
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Created for: dodecahedron-3d.html modularization (Phase 4)
 * Date: December 17, 2025
 *
 * @module dodec-tooltips
 * @author Deimantas & Claude (Co-created with consciousness and love)
 * @version 1.2.0 - Sacred Inquiry Architecture integration (2026-01-08)
 *
 * PURPOSE:
 * Interactive tooltip system for the 3D Dodecahedron visualization.
 * Handles hover tooltips for edges, vertices, and feedback loops.
 * Also provides detail panel rendering for clicked objects.
 *
 * TOOLTIP TYPES:
 * 1. Edge Tooltip - Shows relationship dynamics between faces
 *    - Archetype name, strategic question, tension analysis
 *    - Flow direction, elemental nature, KPI recommendations
 *
 * 2. Vertex Tooltip - Shows vortex/convergence point data
 *    - Emergent name, spin label, vortex strength
 *    - Coherence, chirality (clockwise/counterclockwise)
 *
 * 3. Loop Tooltip - Shows feedback loop information
 *    - Loop type (virtuous/vicious), cycle path
 *    - Loop gain, average energy, impact strength
 *
 * DEPENDENCIES:
 * - THREE.js (for Raycaster)
 * - HTML elements: #edgeTooltip, #vertexTooltip, #loopTooltip
 * - HTML elements: #faceDetailPanel (for click detail views)
 * - CSS: css/dodec/dodec-tooltips.css
 *
 * EXPORTS (to window/global):
 * - window.DodecTooltips: Tooltip controller object
 *   {
 *     showEdge(event, data), hideEdge(),
 *     showVertex(event, data), hideVertex(),
 *     showLoop(event, data), hideLoop(),
 *     showEdgeDetailPanel(data), showVertexDetailPanel(data),
 *     highlight(object), clearHighlights(),
 *     getInteractiveObjects()
 *   }
 *
 * NOTES FOR FUTURE CLAUDE:
 * ════════════════════════════════════════════════════════════════════════════
 * This module provides RENDERING functions for tooltips. The actual raycasting
 * and event handling is done in the main dodecahedron-3d.html inline script
 * because it requires access to THREE.js scene/camera/renderer globals and
 * ES module context for dynamic imports.
 *
 * TOOLTIP POSITIONING:
 * All tooltips position at (event.clientX + 15, event.clientY + 15) to
 * appear near but not under the cursor.
 *
 * DETAIL PANELS:
 * Edge and vertex clicks open the #faceDetailPanel with rich HTML content.
 * This reuses the face detail panel infrastructure but with edge/vertex data.
 *
 * HIGHLIGHT SYSTEM:
 * - highlightObject() boosts opacity and emissive intensity
 * - For vertices: also scales up 1.3x
 * - clearHighlights() restores original values from userData
 *
 * NARRATIVE DATA:
 * Tooltips expect data objects with optional narrative property:
 * - data.narrative.question (strategic question)
 * - data.narrative.flow (energy flow direction)
 * - data.narrative.fullNarrative (detailed insight)
 * - data.narrative.spinLabel (vertex spin description)
 *
 * ════════════════════════════════════════════════════════════════════════════
 */
(function (global) {
    'use strict';

    // ════════════════════════════════════════════════════════════════════════
    // φ-DERIVED CONSTANTS (from PhiHarmonics SSOT, with inline fallback)
    // Used for edge health classification: replaces arbitrary 0.3/0.6 thresholds
    // ════════════════════════════════════════════════════════════════════════
    const _PH = (typeof PhiHarmonics !== 'undefined') ? PhiHarmonics : {};
    const _PHI = _PH.PHI || (1 + Math.sqrt(5)) / 2;
    const _PHI_2 = _PH.PHI_2 || 1 / (_PHI * _PHI);   // φ⁻² = 0.382
    const _PHI_1 = _PH.PHI_1 || 1 / _PHI;             // φ⁻¹ = 0.618

    // ════════════════════════════════════════════════════════════════════════
    // VOICE & INQUIRY INTEGRATION (Enhanced 2026-01-08)
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Get current language register/engagement depth
     * Uses new OrganizationalVoice if available, falls back to legacy LanguageRegister
     * @returns {string} 'analytical', 'balanced', or 'contemplative'
     */
    function getRegister() {
        // Try new OrganizationalVoice system first
        if (global.OrganizationalVoice?.VoiceState) {
            return global.OrganizationalVoice.VoiceState.getDepth() || 'balanced';
        }
        // Fallback to legacy LanguageRegister
        return global.LanguageRegister?.get?.() || 'balanced';
    }

    /**
     * Get Sacred Inquiry for edge based on tension and synergy elements
     * Uses the new Sacred Inquiry Architecture (January 2026)
     * @param {Object} data - Edge userData
     * @returns {Object|null} Sacred inquiry with inquiry, shadow, gift, practice
     */
    function getSacredInquiry(data) {
        if (!global.SacredInquiry) return null;

        try {
            const tension = data.tension || 0.5;
            const healthState = global.SacredInquiry.getHealthState(tension);

            // Determine dominant element from edge data
            // Try elemental nature first, fall back to ether
            const elementalNature = (data.elementalNature || 'ether').toLowerCase().replace(/\s*\(.*$/, '');
            const elementMap = {
                'earth': 'earth',
                'water': 'water',
                'fire': 'fire',
                'air': 'air',
                'ether': 'ether',
                'flow': 'water',
                'transformation': 'fire',
                'structure': 'earth',
                'communication': 'air',
                'purpose': 'ether'
            };
            const dominantElementId = elementMap[elementalNature] || 'ether';

            // Get the synergy element definition
            const dominantSynergy = global.SacredInquiry.SYNERGY_ELEMENTS?.[dominantElementId] || {
                id: dominantElementId,
                name: dominantElementId.charAt(0).toUpperCase() + dominantElementId.slice(1),
                icon: ''
            };

            // Get the inquiry for this health state + element combination
            const stateInquiry = global.SacredInquiry.STATE_INQUIRIES?.[`${healthState.id}:${dominantElementId}`];

            if (!stateInquiry) {
                // Fallback: return basic inquiry
                return {
                    inquiry: `What wants to flow between ${data.face1Name} and ${data.face2Name}?`,
                    shadow: 'What truth is being avoided at this boundary?',
                    healthState,
                    dominantSynergy
                };
            }

            return {
                ...stateInquiry,
                healthState,
                dominantSynergy
            };
        } catch (e) {
            Logger.warn('Tooltips', 'Sacred Inquiry error:', e.message);
            return null;
        }
    }

    /**
     * Register-specific edge tooltip templates
     */
    const EDGE_TEMPLATES = {
        analytical: (data, narrative) => `
            <div style="font-weight: bold; color: #00ffcc; margin-bottom: 4px;">${data.face1Name} ↔ ${data.face2Name}</div>
            <div style="display: grid; grid-template-columns: auto 1fr; gap: 4px 12px; font-size: 11px;">
                <span style="opacity: 0.6;">Tension:</span>
                <span style="color: ${data.tension > _PHI_1 ? '#ff4444' : '#00ff88'}">${(data.tension * 100).toFixed(0)}%</span>
                <span style="opacity: 0.6;">Flow:</span>
                <span>${(data.flow * 100).toFixed(0)}%</span>
                ${data.kpiName ? `<span style="opacity: 0.6;">KPI:</span><span>${data.kpiName}</span>` : ''}
            </div>
        `,
        balanced: (data, narrative) => `
            <div style="font-weight: bold; color: #00ffcc; margin-bottom: 2px; font-size: 13px;">${narrative.archetype || data.edgeName}</div>
            <div style="font-size: 9px; color: rgba(255,255,255,0.5); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">
                ${data.face1Name} ↔ ${data.face2Name}
            </div>
            ${narrative.question ? `<div class="edge-question" style="font-style: italic; color: #ffcc00; margin-bottom: 8px;">"${narrative.question}"</div>` : ''}
            <div style="display: flex; justify-content: space-between; font-size: 10px; margin-bottom: 4px;">
                <span>Tension:</span>
                <span style="color: ${data.tension > _PHI_1 ? '#ff4444' : '#00ff88'}">${(data.tension * 100).toFixed(0)}% (${data.tensionStatus || 'Flowing'})</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 10px;">
                <span>Element:</span>
                <span style="color: #ffaa00;">${data.elementalNature || 'Mixed'}</span>
            </div>
        `,
        contemplative: (data, narrative) => `
            <div style="font-weight: bold; color: #00ffcc; margin-bottom: 2px; font-size: 13px;">${narrative.archetype || data.edgeName}</div>
            <div style="font-size: 9px; color: rgba(255,255,255,0.5); margin-bottom: 8px;">
                Where ${data.face1Name} meets ${data.face2Name}
            </div>
            ${narrative.question ? `
                <div style="background: rgba(255,204,0,0.1); padding: 10px; border-left: 2px solid #ffcc00; margin-bottom: 10px; border-radius: 0 6px 6px 0;">
                    <div style="font-style: italic; color: #ffcc00; font-size: 12px;">"${narrative.question}"</div>
                </div>
            ` : ''}
            <div style="font-size: 11px; color: rgba(255,255,255,0.7); line-height: 1.5;">
                ${narrative.fullNarrative || `This boundary holds ${(data.tension * 100).toFixed(0)}% tension. What wants to flow here?`}
            </div>
            <div style="margin-top: 8px; font-size: 10px; color: #00ffcc;">→ Click to explore this relationship</div>
        `
    };

    /**
     * Register-specific vertex tooltip templates
     */
    const VERTEX_TEMPLATES = {
        analytical: (data, narrative) => `
            <div style="font-weight: bold; color: #ff0066; margin-bottom: 4px;">V${data.vertexId}: ${data.emergentName || 'Convergence Point'}</div>
            <div style="display: grid; grid-template-columns: auto 1fr; gap: 4px 12px; font-size: 11px;">
                <span style="opacity: 0.6;">Strength:</span>
                <span>${(data.vortexStrength * 100).toFixed(0)}%</span>
                <span style="opacity: 0.6;">Coherence:</span>
                <span>${(data.coherence * 100).toFixed(0)}%</span>
                <span style="opacity: 0.6;">Type:</span>
                <span>${data.classification?.replace('_', ' ') || data.vortexType}</span>
            </div>
        `,
        balanced: (data, narrative) => {
            const chiralityIcon = data.chirality === 'clockwise' ? '↻' : data.chirality === 'counterclockwise' ? '↺' : '⚖';
            const chiralityColor = data.chirality === 'clockwise' ? '#ff9966' : data.chirality === 'counterclockwise' ? '#66ccff' : 'rgba(255,255,255,0.6)';
            const chiralityLabel = data.chiralityLabel || (data.chirality === 'clockwise' ? 'Releasing' : data.chirality === 'counterclockwise' ? 'Building' : 'Neutral');

            return `
                <div style="font-weight: bold; color: #ff0066; margin-bottom: 2px; font-size: 13px;">${data.emergentName || 'Convergence'}</div>
                <div style="font-size: 9px; color: rgba(255,255,255,0.5); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">
                    V${data.vertexId} • ${data.vortexType || 'Vortex Point'}
                </div>
                ${data.faceNames?.length ? `<div style="font-size: 10px; margin-bottom: 8px; display: flex; gap: 4px; flex-wrap: wrap;">${data.faceNames.map(name => `<span style="background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px;">${name}</span>`).join('')}</div>` : ''}
                <div style="display: flex; justify-content: space-between; font-size: 10px; margin-bottom: 4px;">
                    <span>Strength:</span>
                    <span style="color: ${data.vortexStrength > 0.7 ? '#ff0066' : '#00ffcc'}">${(data.vortexStrength * 100).toFixed(0)}%</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 10px;">
                    <span>Chirality:</span>
                    <span style="color: ${chiralityColor}; font-weight: 600;">${chiralityIcon} ${chiralityLabel}</span>
                </div>
            `;
        },
        contemplative: (data, narrative) => `
            <div style="font-weight: bold; color: #ff0066; margin-bottom: 2px; font-size: 13px;">${data.emergentName || 'The Convergence'}</div>
            <div style="font-size: 10px; color: rgba(255,255,255,0.6); margin-bottom: 10px;">
                Where ${data.faceNames?.join(', ') || 'three domains'} become one
            </div>
            ${narrative.spinLabel ? `
                <div style="background: rgba(255, 0, 100, 0.1); padding: 10px; border-radius: 6px; margin-bottom: 10px; border: 1px solid rgba(255, 0, 100, 0.3);">
                    <div style="font-size: 10px; color: #ff99cc; margin-bottom: 2px;">The Spin:</div>
                    <div style="font-size: 12px; color: #fff; font-style: italic;">"${narrative.spinLabel}"</div>
                </div>
            ` : `
                <div style="font-size: 11px; color: rgba(255,255,255,0.7); line-height: 1.5; margin-bottom: 8px;">
                    This vortex spins at ${(data.vortexStrength * 100).toFixed(0)}% intensity.
                    ${data.coherence > 0.7 ? 'The energy flows harmoniously.' : 'What discord wants attention?'}
                </div>
            `}
            ${narrative.action ? `<div style="font-size: 11px; color: #ff0066;"><strong>Invitation:</strong> ${narrative.action}</div>` : ''}
            <div style="margin-top: 8px; font-size: 10px; color: #ff0066;">→ Click to enter this convergence</div>
        `
    };

    /**
     * Register-specific loop tooltip templates
     */
    const LOOP_TEMPLATES = {
        analytical: (data) => {
            const colorClass = data.direction?.includes('Virtuous') ? '#00ff88' :
                data.direction?.includes('Vicious') ? '#ff4444' : '#ffaa00';
            return `
                <div style="font-weight: bold; color: ${colorClass}; margin-bottom: 4px;">${data.type} Loop</div>
                <div style="display: grid; grid-template-columns: auto 1fr; gap: 4px 12px; font-size: 11px;">
                    <span style="opacity: 0.6;">Direction:</span>
                    <span>${data.direction}</span>
                    <span style="opacity: 0.6;">Gain:</span>
                    <span style="color: ${colorClass}">${data.loopGain?.toFixed(2) || '1.00'}x</span>
                    <span style="opacity: 0.6;">Avg Energy:</span>
                    <span>${((data.avgEnergy || 0) * 100).toFixed(0)}%</span>
                    <span style="opacity: 0.6;">Impact:</span>
                    <span>${((data.strength || 0) * 100).toFixed(0)}%</span>
                </div>
            `;
        },
        balanced: (data) => {
            let colorClass = '#ffaa00';
            let emoji = '🔄';
            if (data.direction?.includes('Virtuous')) {
                colorClass = '#00ff88';
                emoji = '✨';
            } else if (data.direction?.includes('Vicious')) {
                colorClass = '#ff4444';
                emoji = '⚠️';
            }
            return `
                <div style="font-weight: bold; color: ${colorClass}; margin-bottom: 8px; font-size: 13px;">
                    ${emoji} ${data.type} Loop
                </div>
                <div style="font-size: 10px; opacity: 0.7; margin-bottom: 10px;">
                    ${data.direction}
                </div>
                <div style="font-size: 11px; margin-bottom: 6px;">
                    <span style="opacity: 0.6;">Cycle Path:</span>
                </div>
                <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 10px;">
                    ${(data.faceNames || []).map(name => `<span style="background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px; font-size: 10px;">${name}</span>`).join(' → ')}
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 10px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.1);">
                    <span style="opacity: 0.6;">Loop Gain:</span>
                    <span style="color: ${colorClass}; font-weight: bold;">${(data.loopGain || 1).toFixed(2)}x</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 10px;">
                    <span style="opacity: 0.6;">Avg Energy:</span>
                    <span>${((data.avgEnergy || 0) * 100).toFixed(0)}%</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 10px;">
                    <span style="opacity: 0.6;">Impact:</span>
                    <span style="color: ${colorClass};">${((data.strength || 0) * 100).toFixed(0)}% strength</span>
                </div>
            `;
        },
        contemplative: (data) => {
            const isVirtuous = data.direction?.includes('Virtuous');
            const isVicious = data.direction?.includes('Vicious');
            const colorClass = isVirtuous ? '#00ff88' : isVicious ? '#ff4444' : '#ffaa00';
            const emoji = isVirtuous ? '✨' : isVicious ? '🌀' : '🔄';
            const narrative = isVirtuous
                ? 'This cycle amplifies what is working. How can you lean into this flow?'
                : isVicious
                    ? 'This cycle may be reinforcing patterns that no longer serve. What wants to shift?'
                    : 'This cycle holds potential for transformation. What direction wants to emerge?';

            return `
                <div style="font-weight: bold; color: ${colorClass}; margin-bottom: 8px; font-size: 14px;">
                    ${emoji} The ${data.type} Cycle
                </div>
                <div style="font-size: 10px; color: rgba(255,255,255,0.5); margin-bottom: 10px; font-style: italic;">
                    ${data.direction}
                </div>
                <div style="margin-bottom: 12px;">
                    <div style="font-size: 10px; color: rgba(255,255,255,0.6); margin-bottom: 6px;">The Journey:</div>
                    <div style="display: flex; flex-wrap: wrap; gap: 6px; align-items: center;">
                        ${(data.faceNames || []).map((name, i, arr) =>
                `<span style="background: rgba(255,255,255,0.1); padding: 3px 8px; border-radius: 4px; font-size: 11px;">${name}</span>${i < arr.length - 1 ? '<span style="color: ${colorClass};">→</span>' : ''}`
            ).join('')}
                    </div>
                </div>
                <div style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 6px; margin-bottom: 10px;">
                    <div style="font-size: 11px; line-height: 1.5; color: rgba(255,255,255,0.8);">
                        ${narrative}
                    </div>
                </div>
                <div style="font-size: 10px; color: ${colorClass};">
                    Amplification: ${(data.loopGain || 1).toFixed(2)}x
                </div>
            `;
        }
    };

    // ════════════════════════════════════════════════════════════════════════
    // DOM ELEMENT CACHE
    // ════════════════════════════════════════════════════════════════════════

    let elements = null;
    let highlightedObject = null;

    /**
     * Cache DOM elements for tooltips and panels
     */
    function cacheElements() {
        if (elements) return elements;

        elements = {
            edgeTooltip: document.getElementById('edgeTooltip'),
            vertexTooltip: document.getElementById('vertexTooltip'),
            loopTooltip: document.getElementById('loopTooltip'),
            faceDetailPanel: document.getElementById('faceDetailPanel'),
            faceDetailTitle: document.getElementById('faceDetailTitle'),
            faceEnergyDisplay: document.getElementById('faceEnergyDisplay'),
            kpiGrid: document.getElementById('kpiGrid'),
            connectedEdgesSection: document.getElementById('connectedEdgesSection'),
            cornerVerticesSection: document.getElementById('cornerVerticesSection')
        };

        return elements;
    }

    // ════════════════════════════════════════════════════════════════════════
    // EDGE TOOLTIP
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Display edge tooltip with relationship data (REGISTER-AWARE)
     * @param {MouseEvent} event - Mouse event for positioning
     * @param {Object} data - Edge userData from THREE.js mesh
     */
    function showEdgeTooltip(event, data) {
        const el = cacheElements();
        if (!el.edgeTooltip) return;

        // Get narrative data and register
        const narrative = data.narrative || {};
        narrative.question = narrative.question || data.theQuestion;
        narrative.archetype = narrative.archetype || data.archetype || data.edgeName;

        // Get register-specific template
        const register = getRegister();
        const template = EDGE_TEMPLATES[register] || EDGE_TEMPLATES.balanced;

        // Render tooltip content
        el.edgeTooltip.innerHTML = template(data, narrative);

        el.edgeTooltip.style.left = (event.clientX + 15) + 'px';
        el.edgeTooltip.style.top = (event.clientY + 15) + 'px';
        el.edgeTooltip.classList.add('visible');
        document.body.style.cursor = 'help';
    }

    /**
     * Hide edge tooltip
     */
    function hideEdgeTooltip() {
        const el = cacheElements();
        if (el.edgeTooltip) {
            el.edgeTooltip.classList.remove('visible');
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // VERTEX TOOLTIP
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Display vertex tooltip with vortex data (REGISTER-AWARE)
     * @param {MouseEvent} event - Mouse event for positioning
     * @param {Object} data - Vertex userData from THREE.js mesh
     */
    function showVertexTooltip(event, data) {
        const el = cacheElements();
        if (!el.vertexTooltip) return;

        // Get narrative data (generated by VertexAnalyzer.generateVertexNarrative)
        const narrative = data.narrative || {};

        // Get register-specific template
        const register = getRegister();
        const template = VERTEX_TEMPLATES[register] || VERTEX_TEMPLATES.balanced;

        // Render tooltip content
        el.vertexTooltip.innerHTML = template(data, narrative);

        el.vertexTooltip.style.left = (event.clientX + 15) + 'px';
        el.vertexTooltip.style.top = (event.clientY + 15) + 'px';
        el.vertexTooltip.classList.add('visible');
        document.body.style.cursor = 'help';
    }

    /**
     * Hide vertex tooltip
     */
    function hideVertexTooltip() {
        const el = cacheElements();
        if (el.vertexTooltip) {
            el.vertexTooltip.classList.remove('visible');
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // LOOP TOOLTIP
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Display feedback loop tooltip (REGISTER-AWARE)
     * @param {MouseEvent} event - Mouse event for positioning
     * @param {Object} data - Loop userData from THREE.js line
     */
    function showLoopTooltip(event, data) {
        const el = cacheElements();
        if (!el.loopTooltip) return;

        // Get register-specific template
        const register = getRegister();
        const template = LOOP_TEMPLATES[register] || LOOP_TEMPLATES.balanced;

        // Render tooltip content
        el.loopTooltip.innerHTML = template(data);

        el.loopTooltip.style.left = (event.clientX + 15) + 'px';
        el.loopTooltip.style.top = (event.clientY + 15) + 'px';
        el.loopTooltip.classList.add('visible');
        document.body.style.cursor = 'help';
    }

    /**
     * Hide loop tooltip
     */
    function hideLoopTooltip() {
        const el = cacheElements();
        if (el.loopTooltip) {
            el.loopTooltip.classList.remove('visible');
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // HIGHLIGHT SYSTEM
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Highlight an interactive object (edge or vertex)
     * @param {THREE.Mesh} object - The mesh to highlight
     */
    function highlightObject(object) {
        clearHighlights();
        highlightedObject = object;
        const data = object.userData;

        // Boost opacity
        object.material.opacity = 1.0;

        // SUPER GLOW: Boost emissive intensity for dramatic hover effect
        if (object.material.emissiveIntensity !== undefined) {
            object.material.emissiveIntensity = 2.0;
        }

        // SCALE ANIMATION: Vertices grow slightly on hover
        if (data.isVertex) {
            object.scale.setScalar(1.3);
        }

        document.body.style.cursor = 'help';
    }

    /**
     * Clear all highlights and restore original appearance
     */
    function clearHighlights() {
        if (highlightedObject) {
            const data = highlightedObject.userData;

            // Restore base opacity
            const baseOpacity = data.baseOpacity || 0.7;
            highlightedObject.material.opacity = baseOpacity;

            // Restore base emissive intensity
            if (highlightedObject.material.emissiveIntensity !== undefined) {
                const baseEmissive = data.baseEmissive || 0.5;
                highlightedObject.material.emissiveIntensity = baseEmissive;
            }

            // Restore scale for vertices
            if (data.isVertex) {
                highlightedObject.scale.setScalar(data.baseScale || 1.0);
            }

            highlightedObject = null;
        }
        document.body.style.cursor = 'default';
    }

    // ════════════════════════════════════════════════════════════════════════
    // SCENE TRAVERSAL
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Collect interactive objects from the scene
     * @returns {Array} Array of interactive THREE.js objects
     */
    function getInteractiveObjects() {
        if (!global.scene) return [];

        const targets = [];
        global.scene.traverse((obj) => {
            if (obj.type === 'Mesh' && (obj.userData.isEdge || obj.userData.isVertex)) {
                targets.push(obj);
            }
            // Include feedback loop lines
            if (obj.type === 'Line' && obj.userData.isFeedbackLoop) {
                targets.push(obj);
            }
        });
        return targets;
    }

    // ════════════════════════════════════════════════════════════════════════
    // DETAIL PANELS
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Show edge detail panel (integrates with face detail panel system)
     * ENHANCED 2026-01-08: Sacred Inquiry Architecture integration
     * @param {Object} data - Edge userData
     */
    function showEdgeDetailPanel(data) {
        const el = cacheElements();
        if (!el.faceDetailPanel || !el.faceDetailTitle) return;

        // Set title to edge name
        el.faceDetailTitle.textContent = data.edgeName || `Edge ${data.edgeId}`;

        // Show tension as energy
        const tensionPercent = Math.round((data.tension || 0) * 100);
        el.faceEnergyDisplay.textContent = `${tensionPercent}% Tension`;
        el.faceEnergyDisplay.className = data.tension > _PHI_1 ? 'critical' : data.tension > _PHI_2 ? 'warning' : 'healthy';

        // Get narrative data if available
        const narrative = data.narrative || {};

        // Get Sacred Inquiry (January 2026 Enhancement)
        const sacredInquiry = getSacredInquiry(data);
        const register = getRegister();

        // Health state color mapping
        const healthColors = {
            wall: '#8b0000',
            gate: '#ff8c00',
            membrane: '#00cc88',
            hemorrhage: '#ff4444',
            vortex: '#9966ff'
        };
        const healthColor = sacredInquiry ? healthColors[sacredInquiry.healthState.id] || '#00cc88' : '#00cc88';

        // Build rich edge detail display with Sacred Inquiry
        el.kpiGrid.innerHTML = `
            <div style="padding: 20px; line-height: 1.8;">
                <div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <div style="font-size: 11px; opacity: 0.6; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Edge Connection</div>
                    <div style="font-size: 13px; color: #00ffcc;">${data.face1Name} ↔ ${data.face2Name}</div>
                </div>

                ${sacredInquiry ? `
                    <!-- SACRED INQUIRY SECTION (January 2026) -->
                    <div style="margin-bottom: 20px; padding: 16px; background: linear-gradient(135deg, ${healthColor}15, ${healthColor}05); border-left: 3px solid ${healthColor}; border-radius: 0 8px 8px 0;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                            <div style="font-size: 11px; opacity: 0.6; text-transform: uppercase; letter-spacing: 1px;">Sacred Inquiry</div>
                            <div style="display: flex; gap: 8px; align-items: center;">
                                <span style="font-size: 10px; padding: 3px 8px; background: ${healthColor}30; color: ${healthColor}; border-radius: 12px; font-weight: 600;">
                                    ${sacredInquiry.healthState.name}
                                </span>
                                <span style="font-size: 10px; padding: 3px 8px; background: rgba(255,255,255,0.1); border-radius: 12px;">
                                    ${sacredInquiry.dominantSynergy.icon || ''} ${sacredInquiry.dominantSynergy.name}
                                </span>
                            </div>
                        </div>
                        <div style="font-style: italic; color: #ffcc00; line-height: 1.6; font-size: 13px; margin-bottom: 12px;">
                            "${sacredInquiry.inquiry}"
                        </div>
                        ${register !== 'analytical' && sacredInquiry.shadow ? `
                            <div style="font-size: 11px; color: rgba(255,255,255,0.5); margin-top: 8px; padding-top: 8px; border-top: 1px dashed rgba(255,255,255,0.1);">
                                <span style="opacity: 0.6;">Shadow:</span> ${sacredInquiry.shadow}
                            </div>
                        ` : ''}
                        ${register === 'contemplative' && sacredInquiry.gift ? `
                            <div style="font-size: 11px; color: rgba(0,255,204,0.7); margin-top: 8px;">
                                <span style="opacity: 0.6;">Gift:</span> ${sacredInquiry.gift}
                            </div>
                        ` : ''}
                        ${register === 'contemplative' && sacredInquiry.practice ? `
                            <div style="font-size: 11px; color: rgba(153,102,255,0.7); margin-top: 4px;">
                                <span style="opacity: 0.6;">Practice:</span> ${sacredInquiry.practice}
                            </div>
                        ` : ''}
                    </div>
                ` : data.theQuestion ? `
                    <div style="margin-bottom: 20px; padding: 15px; background: rgba(255,204,0,0.1); border-left: 3px solid #ffcc00; border-radius: 4px;">
                        <div style="font-size: 11px; opacity: 0.6; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Strategic Question</div>
                        <div style="font-style: italic; color: #ffcc00; line-height: 1.6;">"${data.theQuestion}"</div>
                    </div>
                ` : ''}

                <div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <div style="font-size: 11px; opacity: 0.6; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Tension Analysis</div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                        <div><span style="opacity: 0.7;">Status:</span></div>
                        <div style="color: ${data.tension > _PHI_1 ? '#ff4444' : data.tension > _PHI_2 ? '#ffaa00' : '#00ff88'}; font-weight: 600;">${data.tensionStatus}</div>
                        <div><span style="opacity: 0.7;">Tension:</span></div>
                        <div style="font-weight: 600;">${tensionPercent}%</div>
                        <div><span style="opacity: 0.7;">Element:</span></div>
                        <div style="font-weight: 600;">${data.elementalNature}</div>
                        <div><span style="opacity: 0.7;">Flow:</span></div>
                        <div style="font-weight: 600;">${Math.round((data.flow || 0) * 100)}%</div>
                    </div>
                </div>

                ${narrative.fullNarrative ? `
                    <div style="margin-bottom: 20px; padding: 15px; background: rgba(0,255,204,0.05); border-radius: 6px;">
                        <div style="font-size: 11px; opacity: 0.6; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Narrative Insight</div>
                        <div style="font-size: 12px; line-height: 1.6;">${narrative.fullNarrative}</div>
                    </div>
                ` : ''}

                ${data.kpiName ? `
                    <div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                        <div style="font-size: 11px; opacity: 0.6; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Recommended KPI</div>
                        <div style="font-weight: 600; color: #00ffcc;">${data.kpiName}</div>
                        ${data.kpiMetric ? `<div style="margin-top: 8px; font-size: 11px; opacity: 0.8;">${data.kpiMetric}</div>` : ''}
                    </div>
                ` : ''}
            </div>
        `;

        // Hide extra sections
        if (el.connectedEdgesSection) el.connectedEdgesSection.style.display = 'none';
        if (el.cornerVerticesSection) el.cornerVerticesSection.style.display = 'none';

        // Show panel
        el.faceDetailPanel.classList.add('visible');
    }

    /**
     * Show vertex detail panel
     * @param {Object} data - Vertex userData
     */
    function showVertexDetailPanel(data) {
        const el = cacheElements();
        if (!el.faceDetailPanel || !el.faceDetailTitle) return;

        // Set title to vertex name
        el.faceDetailTitle.textContent = data.emergentName || `Vertex ${data.vertexId}`;

        // Show vortex strength as energy
        const strengthPercent = Math.round((data.vortexStrength || 0) * 100);
        el.faceEnergyDisplay.textContent = `${strengthPercent}% Vortex`;
        el.faceEnergyDisplay.className = data.vortexStrength > 0.5 ? 'critical' : data.vortexStrength > 0.25 ? 'warning' : 'healthy';

        // Get narrative data if available
        const narrative = data.narrative || {};

        // Classification color
        const classColors = {
            'synergy_hub': '#00ffcc',
            'hotspot': '#ffaa00',
            'bermuda_triangle': '#ff4444',
            'neutral': '#888888'
        };
        const classColor = classColors[data.classification] || '#888888';

        // Build rich vertex detail display
        el.kpiGrid.innerHTML = `
            <div style="padding: 20px; line-height: 1.8;">
                <div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <div style="font-size: 11px; opacity: 0.6; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Convergence Point</div>
                    <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                        ${(data.faceNames || []).map(name => `<span style="background: rgba(255,255,255,0.1); padding: 4px 10px; border-radius: 4px; font-size: 11px;">${name}</span>`).join('')}
                    </div>
                </div>

                <div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <div style="font-size: 11px; opacity: 0.6; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Vortex Analysis</div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                        <div><span style="opacity: 0.7;">Strength:</span></div>
                        <div style="color: ${data.vortexStrength > 0.5 ? '#ff4444' : '#00ffcc'}; font-weight: 600;">${strengthPercent}%</div>
                        <div><span style="opacity: 0.7;">Type:</span></div>
                        <div style="font-weight: 600;">${data.vortexType}</div>
                        <div><span style="opacity: 0.7;">Coherence:</span></div>
                        <div style="font-weight: 600;">${Math.round((data.coherence || 0) * 100)}%</div>
                        <div><span style="opacity: 0.7;">Chirality:</span></div>
                        <div style="color: ${data.chirality === 'clockwise' ? '#ff9966' : data.chirality === 'counterclockwise' ? '#66ccff' : 'rgba(255,255,255,0.6)'}; font-weight: 600;">
                            ${data.chirality === 'clockwise' ? '↻ Releasing' : data.chirality === 'counterclockwise' ? '↺ Building' : '⚖ Neutral'}
                        </div>
                        <div><span style="opacity: 0.7;">Classification:</span></div>
                        <div style="color: ${classColor}; font-weight: 600; text-transform: capitalize;">${(data.classification || 'unknown').replace('_', ' ')}</div>
                    </div>
                </div>

                ${data.tooltip ? `
                    <div style="margin-bottom: 20px; padding: 15px; background: rgba(255,0,100,0.1); border-left: 3px solid #ff0066; border-radius: 4px;">
                        <div style="font-size: 12px; line-height: 1.6;">${data.tooltip}</div>
                    </div>
                ` : ''}

                ${narrative.spinLabel ? `
                    <div style="margin-bottom: 20px; padding: 15px; background: rgba(255,0,100,0.05); border-radius: 6px;">
                        <div style="font-size: 11px; color: #ff99cc; margin-bottom: 4px;">The Spin:</div>
                        <div style="font-size: 13px; font-style: italic; color: #fff;">"${narrative.spinLabel}"</div>
                        ${narrative.description ? `<div style="margin-top: 8px; font-size: 11px; opacity: 0.8;">${narrative.description}</div>` : ''}
                    </div>
                ` : ''}

                ${narrative.action ? `
                    <div style="padding: 12px; background: rgba(0,255,204,0.05); border-radius: 4px;">
                        <span style="color: #ff0066; font-weight: 600;">Action:</span> ${narrative.action}
                    </div>
                ` : ''}

                ${data.classification === 'bermuda_triangle' ? `
                    <div style="margin-top: 15px; padding: 12px; background: rgba(255,34,34,0.2); border-left: 3px solid #ff2222; border-radius: 4px; font-size: 11px;">
                        ⚠️ <strong>BERMUDA TRIANGLE</strong> - Critical imbalance between converging faces. This vertex demands immediate attention.
                    </div>
                ` : ''}

                ${data.isLeveragePoint ? `
                    <div style="margin-top: 15px; padding: 12px; background: rgba(255,215,0,0.15); border-left: 3px solid #ffd700; border-radius: 4px; font-size: 11px;">
                        ⚡ <strong>Leverage Point</strong> - High transformation potential
                    </div>
                ` : ''}
            </div>
        `;

        // Hide extra sections
        if (el.connectedEdgesSection) el.connectedEdgesSection.style.display = 'none';
        if (el.cornerVerticesSection) el.cornerVerticesSection.style.display = 'none';

        // Show panel
        el.faceDetailPanel.classList.add('visible');
    }

    // ════════════════════════════════════════════════════════════════════════
    // INITIALIZATION
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Initialize the tooltip system
     */
    function init() {
        cacheElements();
        Logger.info('Tooltips', 'Initialized with 8 parameters');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ════════════════════════════════════════════════════════════════════════
    // EXPORTS
    // ════════════════════════════════════════════════════════════════════════

    global.DodecTooltips = {
        // Tooltip display
        showEdge: showEdgeTooltip,
        hideEdge: hideEdgeTooltip,
        showVertex: showVertexTooltip,
        hideVertex: hideVertexTooltip,
        showLoop: showLoopTooltip,
        hideLoop: hideLoopTooltip,

        // Highlight system
        highlight: highlightObject,
        clearHighlights: clearHighlights,

        // Scene helpers
        getInteractiveObjects: getInteractiveObjects,

        // Detail panels
        showEdgeDetailPanel: showEdgeDetailPanel,
        showVertexDetailPanel: showVertexDetailPanel
    };

})(typeof window !== 'undefined' ? window : this);
