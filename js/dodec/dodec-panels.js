/**
 * ========================================
 * MODULE: dodec-panels.js
 * ========================================
 *
 * Extracted from: dodecahedron-viz.js
 * Original lines: 1424-2117
 * Date: December 15, 2025
 *
 * PURPOSE:
 * Face and edge detail panels displaying organizational health data.
 * Shows KPIs, element balance, pentagram visualization, octave progression,
 * breath axis relationships, connected edges, corner vertices, and shadows.
 *
 * DEPENDENCIES:
 * - dodec-state.js (for DodecState)
 * - dodec-interaction.js (for resetCameraView)
 * - window.Quannex (for breath analysis and state data)
 * - window.advancedAnalysisResults (for edges, vertices, shadows)
 * - window.initDNAPreview, window.stopDNAPreview (optional DNA animation)
 *
 * EXPORTS (to window/global):
 * - getBusinessDimensionName(element): Maps element codes to business names
 * - showFaceDetail(face): Opens face detail panel with full data
 * - showEdgeDetail(edgeData, edgeName): Opens edge detail panel
 * - closeFaceDetail(): Closes the detail panel
 *
 * NOTES FOR FUTURE CLAUDE:
 * ========================================
 * PANEL ARCHITECTURE:
 * This is the LARGEST module (~700 lines) containing all panel logic.
 * showFaceDetail() is particularly large with 10+ sections:
 * 1. Basic info (title, energy display)
 * 2. KPI grid (elemental KPIs with health bars)
 * 3. Element balance grid (5 elements with averages)
 * 4. Pentagram visualization (SVG polygon)
 * 5. Leverage action (recommended focus area)
 * 6. Octave progression (O1-O7 with THETA threshold)
 * 7. Breath axis (partner face relationship)
 * 8. Connected edges (from advancedAnalysisResults)
 * 9. Corner vertices (with Bermuda triangle detection)
 * 10. Shadow patterns (with dual-form toggle)
 *
 * DOM ELEMENTS ACCESSED (30+):
 * The panel heavily manipulates DOM via getElementById().
 * If elements don't exist, code has defensive null checks.
 *
 * SHADOW TOGGLE PATTERN:
 * Shadows have a unique toggle between "suppressed" and "integrated"
 * (gift) views. Each shadow card has event listeners for this toggle.
 *
 * DNA PREVIEW INTEGRATION:
 * showFaceDetail() can initialize a DNA preview animation if
 * window.initDNAPreview exists. closeFaceDetail() stops it.
 *
 * PHI THRESHOLD (THETA):
 * The octave threshold marker is positioned at 61.8% (golden ratio).
 * Face energy >= THETA indicates readiness for next octave.
 *
 * ========================================
 */
(function(global) {
    'use strict';

    // ========================================
    // IMPORTS
    // ========================================

    const S = global.DodecState;
    if (!S) {
        console.error('[dodec-panels] DodecState not loaded!');
        return;
    }

    // ========================================
    // SECTION: Business Dimension Mapping
    // ========================================
    //
    // Maps internal element codes to user-friendly business terms.
    // Used in KPI displays and element balance sections.
    //
    // ========================================

    /**
     * Map internal element codes to business-friendly dimension names
     *
     * @param {string} element - Element name (earth, water, fire, air, ether)
     * @returns {string} Business-friendly name
     */
    function getBusinessDimensionName(element) {
        const dimensionMap = {
            'earth': 'Stability',
            'water': 'Adaptability',
            'fire': 'Drive',
            'air': 'Communication',
            'ether': 'Vision'
        };
        return dimensionMap[element.toLowerCase()] || element;
    }

    // ========================================
    // SECTION: Face Detail Panel
    // ========================================
    //
    // The main face detail panel shows comprehensive information
    // about a selected organizational domain (face). This is the
    // largest function in the visualization system.
    //
    // ========================================

    /**
     * Show face detail panel with full organizational domain data
     *
     * Populates 10+ sections of the face detail panel:
     * - Basic info and energy
     * - KPI grid with health indicators
     * - Element balance with pentagram
     * - Leverage action recommendation
     * - Octave progression with THETA marker
     * - Breath axis with partner face
     * - Connected edges (if advanced analysis available)
     * - Corner vertices (with Bermuda detection)
     * - Shadow patterns (with toggle)
     *
     * @param {Object|number} faceOrId - Face data object or face ID (1-12)
     *   If object, expects properties:
     *   - id: Face ID (1-12)
     *   - name: Display name
     *   - faceEnergy: Energy level (0-1)
     *   - elementalKPIs: Array of KPI objects
     *   - currentOctave: Octave level (1-7)
     */
    function showFaceDetail(faceOrId) {
        // Type guard: Convert numeric ID to face object
        let face = faceOrId;
        if (typeof faceOrId === 'number') {
            const companyData = S.companyData || global.Quannex?.getState?.();
            face = companyData?.faces?.find(f => f.id === faceOrId);
            if (!face) {
                console.warn(`[dodec-panels] Face ID ${faceOrId} not found in company data`);
                return;
            }
            console.log(`[dodec-panels] Resolved face ID ${faceOrId} to:`, face.name);
        }

        // Validate face object
        if (!face || typeof face !== 'object') {
            console.warn('[dodec-panels] Invalid face data provided:', faceOrId);
            return;
        }

        const panel = document.getElementById('faceDetailPanel');
        const title = document.getElementById('faceDetailTitle');
        const energyDisplay = document.getElementById('faceEnergyDisplay');
        const kpiGrid = document.getElementById('kpiGrid');

        title.textContent = face.name || `Face ${face.id}`;
        energyDisplay.textContent = `${Math.round((face.faceEnergy || 0) * 100)}%`;

        // ========================================
        // Build KPI grid
        // ========================================
        kpiGrid.innerHTML = '';

        if (face.elementalKPIs && face.elementalKPIs.length > 0) {
            face.elementalKPIs.forEach(kpi => {
                const kpiItem = document.createElement('div');
                kpiItem.className = 'kpi-item';

                const normalizedScore = kpi.normalizedScore || 0;
                const healthClass = normalizedScore >= 0.7 ? 'healthy' : normalizedScore >= 0.4 ? 'warning' : 'critical';
                const element = kpi.element ? kpi.element.toLowerCase() : 'earth';
                const dimensionName = getBusinessDimensionName(element);

                kpiItem.innerHTML = `
                <div class="kpi-item-header">
                    <span class="kpi-name">${kpi.name || 'Unknown KPI'}</span>
                    <span class="kpi-element ${element}">${dimensionName}</span>
                </div>
                <div class="kpi-value-bar">
                    <div class="kpi-value-fill ${healthClass}" style="width: ${normalizedScore * 100}%"></div>
                </div>
            `;

                kpiGrid.appendChild(kpiItem);
            });
        } else {
            kpiGrid.innerHTML = '<div style="text-align: center; opacity: 0.5; padding: 20px;">No KPI data available</div>';
        }

        // ========================================
        // ELEMENT BALANCE GRID
        // ========================================
        const elementBalanceGrid = document.getElementById('elementBalanceGrid');
        if (elementBalanceGrid && face.elementalKPIs) {
            // Group KPIs by element and calculate average scores
            const elementData = {
                earth: { icon: '🜃', name: 'Earth', scores: [], label: 'Stability' },
                water: { icon: '💧', name: 'Water', scores: [], label: 'Adaptability' },
                fire: { icon: '🔥', name: 'Fire', scores: [], label: 'Action' },
                air: { icon: '💨', name: 'Air', scores: [], label: 'Communication' },
                ether: { icon: '✧', name: 'Ether', scores: [], label: 'Vision' }
            };

            // Collect scores by element
            face.elementalKPIs.forEach(kpi => {
                const element = (kpi.element || 'earth').toLowerCase();
                if (elementData[element]) {
                    elementData[element].scores.push(kpi.normalizedScore || 0);
                }
            });

            // Build the grid
            elementBalanceGrid.innerHTML = '';
            Object.entries(elementData).forEach(([key, data]) => {
                const avgScore = data.scores.length > 0
                    ? data.scores.reduce((a, b) => a + b, 0) / data.scores.length
                    : 0;
                const percentage = Math.round(avgScore * 100);

                const item = document.createElement('div');
                item.className = 'element-balance-item';
                item.innerHTML = `
                    <div class="element-icon">${data.icon}</div>
                    <div class="element-name">${data.label}</div>
                    <div class="element-value">${percentage}%</div>
                    <div class="element-bar">
                        <div class="element-bar-fill" style="width: ${percentage}%"></div>
                    </div>
                `;
                elementBalanceGrid.appendChild(item);
            });

            // ========================================
            // Update Pentagram Visualization
            // ========================================
            const pentagramData = document.getElementById('pentagramData');
            if (pentagramData) {
                // Calculate element scores for pentagram (order: Fire, Air, Ether, Water, Earth)
                const elementOrder = ['fire', 'air', 'ether', 'water', 'earth'];
                const scores = elementOrder.map(el => {
                    const data = elementData[el];
                    return data.scores.length > 0
                        ? data.scores.reduce((a, b) => a + b, 0) / data.scores.length
                        : 0;
                });

                // Pentagram points (star shape) - center is (80, 80), radius 65
                const center = { x: 80, y: 80 };
                const maxRadius = 60;
                const minRadius = 5;

                // Calculate point positions for pentagram (5 points, -90 offset for top)
                const angleOffset = -Math.PI / 2; // Start at top
                const points = scores.map((score, i) => {
                    const angle = angleOffset + (i * 2 * Math.PI / 5);
                    const radius = minRadius + (score * (maxRadius - minRadius));
                    return {
                        x: center.x + radius * Math.cos(angle),
                        y: center.y + radius * Math.sin(angle)
                    };
                });

                // Update polygon points
                const pointsStr = points.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
                pentagramData.setAttribute('points', pointsStr);

                // Color based on overall balance (PHI thresholds)
                const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
                if (avgScore >= 0.618) {
                    pentagramData.setAttribute('fill', 'rgba(102, 255, 136, 0.3)');
                    pentagramData.setAttribute('stroke', '#66ff88');
                } else if (avgScore >= 0.382) {
                    pentagramData.setAttribute('fill', 'rgba(0, 255, 204, 0.3)');
                    pentagramData.setAttribute('stroke', '#00ffcc');
                } else {
                    pentagramData.setAttribute('fill', 'rgba(255, 170, 0, 0.3)');
                    pentagramData.setAttribute('stroke', '#ffaa00');
                }
            }
        }

        // ========================================
        // LEVERAGE ACTION
        // ========================================
        const leverageActionText = document.getElementById('leverageActionText');
        if (leverageActionText && face.elementalKPIs) {
            // Find the lowest scoring KPI
            let lowestKpi = null;
            let lowestScore = 1;
            face.elementalKPIs.forEach(kpi => {
                if ((kpi.normalizedScore || 0) < lowestScore) {
                    lowestScore = kpi.normalizedScore || 0;
                    lowestKpi = kpi;
                }
            });

            if (lowestKpi && lowestScore < 0.6) {
                leverageActionText.textContent = `Focus on improving "${lowestKpi.name}" (currently at ${Math.round(lowestScore * 100)}%) for maximum impact on this face's energy.`;
            } else if (face.faceEnergy < 0.4) {
                leverageActionText.textContent = `This face needs attention. Consider reviewing all KPIs and prioritizing the most critical improvements.`;
            } else if (face.faceEnergy >= 0.618) {
                leverageActionText.textContent = `This face is performing well! Consider how to leverage this strength to support weaker areas of the organization.`;
            } else {
                leverageActionText.textContent = `Continue steady progress across all elements to build toward transcendence threshold (61.8%).`;
            }
        }

        // ========================================
        // OCTAVE PROGRESSION SECTION
        // ========================================
        const octaveNumber = document.getElementById('octaveNumber');
        const octaveNameDisplay = document.getElementById('octaveNameDisplay');
        const octaveProgressPercent = document.getElementById('octaveProgressPercent');
        const nextOctaveName = document.getElementById('nextOctaveName');
        const octaveProgressFill = document.getElementById('octaveProgressFill');
        const octaveThresholdMarker = document.getElementById('octaveThresholdMarker');
        const transcendenceBadge = document.getElementById('transcendenceBadge');

        // Roman numeral conversion
        const toRoman = (num) => ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'][num - 1] || num;

        // Octave names from main.js
        const octaveNames = ['Survival', 'Structure', 'Relationships', 'Creativity', 'Expression', 'Vision', 'Radiance'];

        // Get octave info (use currentOctave from face or default to 1)
        const currentOctave = face.currentOctave || 1;
        const octaveName = octaveNames[currentOctave - 1] || 'Unknown';

        // Get progress (face energy as proxy for octave progress)
        const progress = face.faceEnergy || 0;

        // Get threshold from tuning config
        const tuning = global.Quannex ? global.Quannex.exportTuning() : null;
        const theta = tuning ? tuning.theta : 0.618;
        const isReady = progress >= theta && currentOctave < 7;

        // Update octave badge
        if (octaveNumber) {
            octaveNumber.textContent = toRoman(currentOctave);
        }
        if (octaveNameDisplay) {
            octaveNameDisplay.textContent = octaveName;
        }

        // Update progress display
        if (octaveProgressPercent) {
            octaveProgressPercent.textContent = `${Math.round(progress * 100)}%`;
        }

        if (nextOctaveName) {
            if (currentOctave < 7) {
                nextOctaveName.textContent = `Octave ${toRoman(currentOctave + 1)} (${octaveNames[currentOctave]})`;
            } else {
                nextOctaveName.textContent = 'Radiance Mastery';
            }
        }

        if (octaveProgressFill) {
            octaveProgressFill.style.width = `${Math.min(progress * 100, 100)}%`;
        }

        // Position threshold marker based on THETA
        if (octaveThresholdMarker) {
            octaveThresholdMarker.style.left = `${theta * 100}%`;
        }

        // Show/hide transcendence badge
        if (transcendenceBadge) {
            transcendenceBadge.style.display = isReady ? 'block' : 'none';
        }

        // ========================================
        // BREATH AXIS SECTION
        // ========================================
        const breathAxisSection = document.getElementById('breathAxisSection');
        const breathAxisName = document.getElementById('breathAxisName');
        const breathRatioValue = document.getElementById('breathRatioValue');
        const breathStatus = document.getElementById('breathStatus');
        const partnerFaceInfo = document.getElementById('partnerFaceInfo');
        const viewFullDnaBtn = document.getElementById('viewFullDnaBtn');

        // Get breath analysis data
        const breathAnalysis = global.Quannex ? global.Quannex.getBreathAnalysis() : null;

        if (breathAnalysis && breathAxisSection) {
            // Find the breath axis that includes this face
            const faceId = face.id;
            const axisData = breathAnalysis.axes ? breathAnalysis.axes.find(axis =>
                axis.receptionFace === faceId || axis.projectionFace === faceId
            ) : null;

            if (axisData) {
                // Determine this face's role in the breath axis
                const isReception = axisData.receptionFace === faceId;
                const partnerFaceId = isReception ? axisData.projectionFace : axisData.receptionFace;
                const role = isReception ? 'Reception (Inhale)' : 'Projection (Exhale)';

                // Get partner face name from company data
                const companyData = global.Quannex.getState();
                let partnerFaceName = `Face ${partnerFaceId}`;
                let partnerEnergy = 0.5;
                if (companyData && companyData.faces) {
                    const partnerFace = companyData.faces.find(f => f.id === partnerFaceId);
                    if (partnerFace) {
                        partnerFaceName = partnerFace.name || partnerFaceName;
                        partnerEnergy = partnerFace.faceEnergy || 0.5;
                    }
                }

                // Populate UI elements
                breathAxisName.textContent = `${axisData.axis || 'Breath Axis'} (${role})`;
                breathRatioValue.textContent = axisData.linearRatio ? axisData.linearRatio.toFixed(2) : '--';

                // Determine status based on ratio
                const ratio = axisData.linearRatio || 1.0;
                let statusText = 'Balanced';
                let statusClass = 'balanced';

                if (ratio > 1.3) {
                    statusText = 'Over-projecting';
                    statusClass = 'over-exhaling';
                } else if (ratio < 0.7) {
                    statusText = 'Over-receiving';
                    statusClass = 'over-inhaling';
                }

                breathStatus.textContent = statusText;
                breathStatus.className = 'breath-status ' + statusClass;

                partnerFaceInfo.textContent = `Partner: F${partnerFaceId} (${partnerFaceName})`;

                // Initialize DNA preview animation
                if (global.initDNAPreview) {
                    global.initDNAPreview({
                        ratio: ratio,
                        receptionEnergy: isReception ? (face.faceEnergy || 0.5) : partnerEnergy,
                        projectionEnergy: isReception ? partnerEnergy : (face.faceEnergy || 0.5)
                    });
                }

                // Setup button click handler
                if (viewFullDnaBtn) {
                    viewFullDnaBtn.onclick = () => {
                        // Store context for the DNA page
                        sessionStorage.setItem('selectedFaceForDNA', JSON.stringify({
                            faceId: faceId,
                            faceName: face.name,
                            axisName: axisData.axis,
                            receptionFace: axisData.receptionFace,
                            projectionFace: axisData.projectionFace
                        }));
                        // Navigate to full DNA analysis
                        global.location.href = 'octave-dna.html';
                    };
                }

                breathAxisSection.style.display = 'block';
            } else {
                breathAxisSection.style.display = 'none';
            }
        } else {
            if (breathAxisSection) {
                breathAxisSection.style.display = 'none';
            }
        }

        // ========================================
        // CONNECTED EDGES SECTION
        // ========================================
        const edgesSection = document.getElementById('connectedEdgesSection');
        const edgesList = document.getElementById('connectedEdgesList');

        if (global.advancedAnalysisResults && global.advancedAnalysisResults.edges) {
            const edges = global.advancedAnalysisResults.edges;
            const companyData = global.Quannex ? global.Quannex.getState() : null;

            // Find edges connected to this face
            const connectedEdges = edges.filter(edge =>
                edge.face1Id === face.id || edge.face2Id === face.id
            );

            if (connectedEdges.length > 0) {
                edgesList.innerHTML = '';
                connectedEdges.forEach(edge => {
                    const otherFaceId = edge.face1Id === face.id ? edge.face2Id : edge.face1Id;

                    // Get the actual face name from company data
                    let otherFaceName = `Face ${otherFaceId}`;
                    let otherFaceEnergy = 0;
                    let currentFaceEnergy = face.faceEnergy || 0;

                    if (companyData && companyData.faces) {
                        const otherFace = companyData.faces.find(f => f.id === otherFaceId);
                        if (otherFace) {
                            otherFaceName = otherFace.name || otherFaceName;
                            otherFaceEnergy = otherFace.faceEnergy || 0;
                        }
                    }

                    const tension = edge.tension || 0;
                    const tensionPercent = Math.round(tension * 100);

                    // Determine tension context
                    let tensionClass = 'success';
                    let contextIndicator = '';

                    if (tension > 0.6) {
                        tensionClass = 'critical';
                    } else if (tension > 0.4) {
                        tensionClass = 'warning';
                    } else {
                        // Low tension - check context
                        if (currentFaceEnergy < 0.4 && otherFaceEnergy < 0.4) {
                            // Both faces critical - bad situation
                            contextIndicator = ' ⚠️';
                            tensionClass = 'critical';
                        } else if (currentFaceEnergy >= 0.7 && otherFaceEnergy >= 0.7) {
                            // Both faces healthy - good balance
                            contextIndicator = ' ✓';
                            tensionClass = 'success';
                        }
                    }

                    // Enhanced edge display with question
                    const edgeQuestion = edge.question || edge.theQuestion || '';
                    const edgeName = edge.emergentName || edge.name || '';

                    const edgeItem = document.createElement('div');
                    edgeItem.className = 'connected-edge-item';
                    edgeItem.style.fontSize = '11px';
                    edgeItem.style.marginBottom = '10px';
                    edgeItem.style.padding = '8px';
                    edgeItem.style.background = 'rgba(0, 255, 204, 0.05)';
                    edgeItem.style.borderRadius = '4px';
                    edgeItem.style.borderLeft = `3px solid ${tension > 0.6 ? '#ff4444' : tension > 0.4 ? '#ffaa00' : '#00ff88'}`;
                    edgeItem.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                        <span style="color: #00ffcc; font-weight: 500;">${edgeName || `→ ${otherFaceName}`}</span>
                        <span class="metric-value ${tensionClass}" style="font-size: 10px;">${tensionPercent}%${contextIndicator}</span>
                    </div>
                    ${edgeQuestion ? `
                        <div style="font-size: 10px; font-style: italic; color: rgba(255, 204, 0, 0.8); padding-left: 8px; border-left: 2px solid rgba(255, 204, 0, 0.3); margin-top: 4px;">
                            "${edgeQuestion}"
                        </div>
                    ` : ''}
                `;
                    edgesList.appendChild(edgeItem);
                });
                edgesSection.style.display = 'block';
            } else {
                edgesSection.style.display = 'none';
            }
        } else {
            edgesSection.style.display = 'none';
        }

        // ========================================
        // CORNER VERTICES SECTION
        // ========================================
        const verticesSection = document.getElementById('cornerVerticesSection');
        const verticesList = document.getElementById('cornerVerticesList');

        if (global.advancedAnalysisResults && global.advancedAnalysisResults.vertices) {
            const vertices = global.advancedAnalysisResults.vertices;
            // Find vertices at corners of this face (vertices whose faceIds include this face)
            const cornerVertices = vertices.filter(vertex =>
                vertex.faceIds && vertex.faceIds.includes(face.id)
            );

            if (cornerVertices.length > 0) {
                verticesList.innerHTML = '';
                cornerVertices.forEach(vertex => {
                    const archetype = vertex.archetype || vertex.emergentName || 'Unknown';
                    const vortexStrength = vertex.vortexStrength || 0;
                    const vortexDirection = vertex.vortexDirection || 0;
                    const strengthPercent = Math.round(vortexStrength * 100);
                    const classification = vertex.classification || '';
                    const isBermuda = classification === 'bermuda_triangle';

                    // Color code based on vortex direction
                    let directionIcon = '⚪';
                    let directionLabel = 'Neutral';
                    if (vortexDirection > 0.2) {
                        directionIcon = '🔵';
                        directionLabel = 'Upward';
                    } else if (vortexDirection < -0.2) {
                        directionIcon = '🔴';
                        directionLabel = 'Downward';
                    }

                    // Enhanced vertex display with bermuda triangle indicator
                    const vertexItem = document.createElement('div');
                    vertexItem.className = 'corner-vertex-item';
                    vertexItem.style.marginBottom = '10px';
                    vertexItem.style.padding = '8px';
                    vertexItem.style.background = isBermuda ? 'rgba(255, 34, 34, 0.15)' : 'rgba(255, 0, 100, 0.05)';
                    vertexItem.style.borderRadius = '4px';
                    vertexItem.style.borderLeft = isBermuda ? '3px solid #ff2222' : '3px solid rgba(255, 0, 100, 0.5)';
                    vertexItem.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                        <span style="color: ${isBermuda ? '#ff6666' : '#ff66aa'}; font-weight: 500;">
                            ${directionIcon} V${vertex.id}: ${archetype}
                        </span>
                        <span style="font-size: 10px;">${strengthPercent}% • ${directionLabel}</span>
                    </div>
                    ${isBermuda ? `
                        <div style="font-size: 10px; color: #ff4444; padding: 4px 8px; background: rgba(255, 34, 34, 0.2); border-radius: 3px; margin-top: 4px;">
                            ⚠️ <strong>BERMUDA TRIANGLE</strong> - Critical imbalance zone
                        </div>
                    ` : classification ? `
                        <div style="font-size: 10px; color: rgba(255, 255, 255, 0.6); margin-top: 2px;">
                            ${classification.replace(/_/g, ' ')}
                        </div>
                    ` : ''}
                `;
                    verticesList.appendChild(vertexItem);
                });
                verticesSection.style.display = 'block';
            } else {
                verticesSection.style.display = 'none';
            }
        } else {
            verticesSection.style.display = 'none';
        }

        // ========================================
        // SHADOW SECTION
        // ========================================
        const shadowSection = document.getElementById('shadowSection');
        const shadowList = document.getElementById('shadowList');

        if (global.advancedAnalysisResults && global.advancedAnalysisResults.shadows) {
            const shadows = global.advancedAnalysisResults.shadows;
            // Find shadows affecting this face
            const faceShadows = shadows.filter(s => s.faceId === face.id);

            if (faceShadows.length > 0) {
                shadowList.innerHTML = '';
                faceShadows.forEach((shadow, index) => {
                    // Enhanced shadow display with dual-form toggle
                    const suppressedForm = shadow.suppressed || shadow.description || 'Shadow pattern detected';
                    const integratedForm = shadow.integrated || shadow.gift || 'Integrated wisdom awaits discovery';
                    const shadowId = `shadow-${face.id}-${index}`;

                    const shadowItem = document.createElement('div');
                    shadowItem.className = 'shadow-dual-card';
                    shadowItem.style.marginBottom = '12px';
                    shadowItem.style.padding = '10px';
                    shadowItem.style.background = 'rgba(255, 68, 68, 0.1)';
                    shadowItem.style.borderRadius = '6px';
                    shadowItem.style.borderLeft = '3px solid #ff4444';
                    shadowItem.setAttribute('data-shadow-id', shadowId);
                    shadowItem.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <span style="font-weight: 600; color: #ff8888; font-size: 11px;">⚠️ ${shadow.name}</span>
                        <button class="shadow-toggle-btn" data-shadow-id="${shadowId}" style="font-size: 9px; padding: 3px 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 4px; color: #fff; cursor: pointer;">
                            🔄 See Gift
                        </button>
                    </div>
                    <div class="shadow-suppressed-view" data-shadow-id="${shadowId}" style="font-size: 10px; color: rgba(255, 136, 136, 0.9);">
                        <div style="opacity: 0.7; font-size: 9px; margin-bottom: 2px;">The Shadow:</div>
                        ${suppressedForm}
                    </div>
                    <div class="shadow-integrated-view" data-shadow-id="${shadowId}" style="display: none; font-size: 10px; color: rgba(102, 255, 153, 0.9);">
                        <div style="opacity: 0.7; font-size: 9px; margin-bottom: 2px;">💡 The Gift:</div>
                        ${integratedForm}
                    </div>
                `;

                    // Add toggle functionality
                    const toggleBtn = shadowItem.querySelector('.shadow-toggle-btn');
                    toggleBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const suppressed = shadowItem.querySelector('.shadow-suppressed-view');
                        const integrated = shadowItem.querySelector('.shadow-integrated-view');
                        const isShowingShadow = suppressed.style.display !== 'none';

                        if (isShowingShadow) {
                            suppressed.style.display = 'none';
                            integrated.style.display = 'block';
                            toggleBtn.textContent = '🔄 See Shadow';
                            shadowItem.style.background = 'rgba(102, 255, 153, 0.1)';
                            shadowItem.style.borderLeftColor = '#66ff99';
                        } else {
                            integrated.style.display = 'none';
                            suppressed.style.display = 'block';
                            toggleBtn.textContent = '🔄 See Gift';
                            shadowItem.style.background = 'rgba(255, 68, 68, 0.1)';
                            shadowItem.style.borderLeftColor = '#ff4444';
                        }
                    });

                    shadowList.appendChild(shadowItem);
                });
                if (shadowSection) shadowSection.style.display = 'block';
            } else {
                if (shadowSection) shadowSection.style.display = 'none';
            }
        } else {
            if (shadowSection) shadowSection.style.display = 'none';
        }

        // Show panel
        panel.classList.add('visible');
    }

    // ========================================
    // SECTION: Edge Detail Panel
    // ========================================
    //
    // Shows detailed information about a selected edge
    // (relationship between two organizational domains).
    // Reuses the face detail panel with edge-specific content.
    //
    // ========================================

    /**
     * Show edge detail panel with relationship data
     *
     * Displays comprehensive information about an edge (relationship)
     * between two faces, including tension, element, flow direction,
     * guiding question, and KPI data if available from CSV.
     *
     * @param {Object} edgeData - Edge data object with properties:
     *   - id: Edge ID
     *   - tension: Tension level (0-1)
     *   - element: Elemental nature
     *   - face1Name, face2Name: Connected face names
     *   - face1Energy, face2Energy: Connected face energies
     *   - question: Guiding question for the relationship
     *   - color: Display color
     *   - healthStatus: Status text
     *   - flowDirection: Direction of energy flow
     *   - kpiName, kpiCoherence, kpiMetric: Optional KPI data
     *   - hasCSVData: Whether CSV metadata is loaded
     * @param {string} edgeName - Display name for the edge
     */
    function showEdgeDetail(edgeData, edgeName) {
        console.log('🔗 Showing edge detail:', edgeData);

        // For now, use the face detail panel but customize it for edges
        const panel = document.getElementById('faceDetailPanel');
        const title = document.getElementById('faceDetailTitle');
        const energyDisplay = document.getElementById('faceEnergyDisplay');
        const kpiGrid = document.getElementById('kpiGrid');

        // Set title to edge archetype
        title.textContent = edgeName || `Edge ${edgeData.id}`;

        // Show tension as energy
        const tensionPercent = Math.round((edgeData.tension || 0) * 100);
        energyDisplay.textContent = `${tensionPercent}% Tension`;
        energyDisplay.className = edgeData.tension > 0.6 ? 'critical' : edgeData.tension > 0.3 ? 'warning' : 'healthy';

        // Build edge metadata display
        kpiGrid.innerHTML = `
        <div style="padding: 20px; line-height: 1.8;">
            <div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                <div style="font-size: 11px; opacity: 0.6; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Edge Connection</div>
                <div style="font-size: 13px; color: #00ffcc;">${edgeData.face1Name} ↔ ${edgeData.face2Name}</div>
            </div>

            <div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                <div style="font-size: 11px; opacity: 0.6; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Tension Analysis</div>
                <div style="margin-bottom: 8px;">
                    <span style="opacity: 0.7;">Status:</span>
                    <span style="color: ${edgeData.color}; font-weight: 600;">${edgeData.healthStatus}</span>
                </div>
                <div style="margin-bottom: 8px;">
                    <span style="opacity: 0.7;">Tension:</span>
                    <span style="color: ${edgeData.color}; font-weight: 600;">${tensionPercent}%</span>
                </div>
                <div style="margin-bottom: 8px;">
                    <span style="opacity: 0.7;">Element:</span>
                    <span style="font-weight: 600;">${edgeData.element}</span>
                </div>
                <div>
                    <span style="opacity: 0.7;">Flow Direction:</span>
                    <span style="font-weight: 600;">${edgeData.flowDirection}</span>
                    ${edgeData.breathRatio > 0 ? ' →' : edgeData.breathRatio < 0 ? ' ←' : ' ⚖️'}
                </div>
            </div>

            ${edgeData.question ? `
                <div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <div style="font-size: 11px; opacity: 0.6; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Guiding Question</div>
                    <div style="font-style: italic; color: #ffcc00; line-height: 1.6;">"${edgeData.question}"</div>
                </div>
            ` : ''}

            ${edgeData.kpiName ? `
                <div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <div style="font-size: 11px; opacity: 0.6; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Edge KPI</div>
                    <div style="margin-bottom: 8px;">
                        <span style="font-weight: 600; color: #00ffcc;">${edgeData.kpiName}</span>
                    </div>
                    ${edgeData.kpiCoherence !== null ? `
                        <div style="margin-bottom: 8px;">
                            <span style="opacity: 0.7;">Coherence:</span>
                            <span style="font-weight: 600;">${Math.round(edgeData.kpiCoherence * 100)}%</span>
                        </div>
                    ` : ''}
                    ${edgeData.kpiMetric ? `
                        <div style="margin-top: 10px; padding: 12px; background: rgba(0,255,204,0.05); border-radius: 6px; font-size: 11px; opacity: 0.8;">
                            <div style="font-weight: 600; margin-bottom: 4px;">How to Measure:</div>
                            <div>${edgeData.kpiMetric}</div>
                        </div>
                    ` : ''}
                </div>
            ` : ''}

            <div style="margin-bottom: 20px;">
                <div style="font-size: 11px; opacity: 0.6; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Energy Levels</div>
                <div style="margin-bottom: 8px;">
                    <span style="opacity: 0.7;">${edgeData.face1Name}:</span>
                    <span style="font-weight: 600;">${Math.round(edgeData.face1Energy * 100)}%</span>
                </div>
                <div>
                    <span style="opacity: 0.7;">${edgeData.face2Name}:</span>
                    <span style="font-weight: 600;">${Math.round(edgeData.face2Energy * 100)}%</span>
                </div>
            </div>

            ${edgeData.hasCSVData ? `
                <div style="padding: 12px; background: rgba(0,255,100,0.1); border-left: 3px solid #00ff66; border-radius: 4px; font-size: 11px;">
                    ✅ Full CSV data loaded for this edge
                </div>
            ` : `
                <div style="padding: 12px; background: rgba(255,204,0,0.1); border-left: 3px solid #ffcc00; border-radius: 4px; font-size: 11px;">
                    ⚠️ Using calculated tension values (CSV data not available)
                </div>
            `}
        </div>
    `;

        // Hide edge/vertex sections for edge view
        const edgesSection = document.getElementById('connectedEdgesSection');
        const verticesSection = document.getElementById('cornerVerticesSection');
        if (edgesSection) edgesSection.style.display = 'none';
        if (verticesSection) verticesSection.style.display = 'none';

        // Show panel
        panel.classList.add('visible');
    }

    // ========================================
    // SECTION: Close Panel
    // ========================================
    //
    // Closes the face/edge detail panel and performs cleanup.
    //
    // ========================================

    /**
     * Close the face/edge detail panel
     *
     * Hides the panel, clears selection state, stops DNA preview,
     * and optionally resets the camera if zoomed in.
     */
    function closeFaceDetail() {
        const panel = document.getElementById('faceDetailPanel');
        panel.classList.remove('visible');
        S.selectedFace = null;

        // Also hide tooltip when closing panel
        const tooltip = document.getElementById('faceTooltip');
        if (tooltip) {
            tooltip.classList.remove('visible');
        }

        // Stop DNA preview animation when panel closes
        if (global.stopDNAPreview) {
            global.stopDNAPreview();
        }

        // Smoothly return to default view for better UX
        // Check if camera is close (zoomed in from clicking a face)
        if (S.camera) {
            const currentDistance = S.camera.position.length();
            if (currentDistance < 5 && typeof global.resetCameraView === 'function') {
                global.resetCameraView();
            }
        }
    }

    // ========================================
    // EXPORTS
    // ========================================

    global.getBusinessDimensionName = getBusinessDimensionName;
    global.showFaceDetail = showFaceDetail;
    global.showEdgeDetail = showEdgeDetail;
    global.closeFaceDetail = closeFaceDetail;

    console.log('[dodec-panels] Module loaded - Panel display ready');
    console.log('[dodec-panels] Exports: showFaceDetail, showEdgeDetail, closeFaceDetail, getBusinessDimensionName');

})(typeof window !== 'undefined' ? window : this);
