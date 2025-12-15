/**
 * ========================================
 * MODULE: dodec-data.js
 * ========================================
 *
 * Extracted from: dodecahedron-viz.js
 * Original lines: 409-476, 810-946, 951-1065
 * Date: December 15, 2025
 *
 * PURPOSE:
 * Handles company data loading, visualization updates, and cross-window
 * synchronization. This is the data layer of the visualization - it
 * connects the Quannex engine state to the THREE.js materials.
 *
 * DEPENDENCIES:
 * - THREE.js (for THREE.Color)
 * - dodec-state.js (for DodecState)
 * - dodec-materials.js (for getEnergyColor, ELEMENT_COLORS)
 * - js/constants/phi-harmonics.js (for PHI constants in shadow highlighting)
 *
 * EXPORTS (to window/global):
 * - loadQuannexEngine(): Async function to wait for and load engine
 * - switchCompany(companyId): Switch to different company data
 * - updateVisualization(): Refresh face colors from engine state
 * - updateEdgeData(): Update edge tooltips from sessionStorage
 * - updateVisualFeedback(params): Philosophical slider visual effects
 * - highlightShadowFaces(faceIds, severity): Highlight shadow-affected faces
 * - clearShadowHighlights(): Remove shadow highlights
 *
 * NOTES FOR FUTURE CLAUDE:
 * ========================================
 * DATA FLOW:
 * 1. loadQuannexEngine() waits for window.Quannex (from main.js)
 * 2. CompanyLoader.loadCompany() populates sessionStorage with company data
 * 3. updateVisualization() reads faces from engine.getState()
 * 4. Each face's faceEnergy → getEnergyColor() → material.color
 *
 * CROSS-WINDOW SYNC:
 * The orchestrator (demo-orchestrator.html) sends updates via BroadcastChannel.
 * When data changes, refreshVisualization() is called (see dodec-main.js).
 *
 * SESSION STORAGE KEYS:
 * - 'selectedCompanyId': Current company ID (string)
 * - 'customCompanyData': Full company data including edges (JSON)
 *
 * EDGE DATA:
 * Edge tooltips need data from sessionStorage (populated by orchestrator).
 * updateEdgeData() refreshes edge userData when sessionStorage changes.
 *
 * PHILOSOPHICAL SLIDERS:
 * updateVisualFeedback() handles GAMMA (edge opacity) and DELTA (face transparency)
 * based on philosophical parameter values from the orchestrator.
 *
 * SHADOW HIGHLIGHTING:
 * Uses PHI-derived intensity values for severity levels:
 * - critical: 1.0
 * - high: φ^-1 ≈ 0.618
 * - moderate: φ^-2 ≈ 0.382
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
        console.error('[dodec-data] DodecState not loaded!');
        return;
    }

    // PHI constants for shadow highlighting
    const _PH = global.PhiHarmonics || {};
    const PHI_1 = _PH.PHI_1 || 0.618033988749895;  // φ^-1
    const PHI_2 = _PH.PHI_2 || 0.381966011250105;  // φ^-2

    // ELEMENT_COLORS from dodec-materials.js (for edge updates)
    const ELEMENT_COLORS = global.ELEMENT_COLORS || {
        'Earth': '#8B4513',
        'Water': '#4169E1',
        'Fire': '#FF4500',
        'Air': '#87CEEB',
        'Ether': '#9370DB'
    };

    // ========================================
    // SECTION: Engine Loading
    // ========================================
    //
    // Waits for the Quannex engine to be available (loaded by main.js).
    // Uses polling with timeout - the engine may load asynchronously.
    //
    // ========================================

    /**
     * Load Quannex engine (expects it to be globally available from main.js)
     *
     * Waits up to 5 seconds for window.Quannex to become available.
     * Also triggers CompanyLoader to load from sessionStorage if available.
     *
     * @returns {Promise<boolean>} True if engine loaded successfully
     */
    async function loadQuannexEngine() {
        try {
            // Wait for Quannex (capital Q - the correct API) or quannexEngine (legacy)
            let attempts = 0;
            while ((!global.Quannex && !global.quannexEngine) && attempts < 50) {
                await new Promise(resolve => setTimeout(resolve, 100));
                attempts++;
            }

            // Use Quannex if available (new API), fallback to quannexEngine (legacy)
            const engine = global.Quannex || global.quannexEngine;

            if (!engine) {
                throw new Error('Quannex engine not available after timeout');
            }

            // Store reference to whichever engine is available
            global.quannexEngine = engine;

            // If CompanyLoader available, load company from sessionStorage or default
            if (global.CompanyLoader) {
                const selectedCompanyId = sessionStorage.getItem('selectedCompanyId') || 'quannex';
                console.log(`[dodec-data] 🔄 Loading company from session: ${selectedCompanyId}`);
                await global.CompanyLoader.loadCompany(selectedCompanyId);
            }

            S.companyData = engine.getState();
            console.log('[dodec-data] ✅ Quannex Engine loaded:', S.companyData);
            return true;
        } catch (error) {
            console.error('[dodec-data] ❌ Error loading Quannex engine:', error);
            return false;
        }
    }

    // ========================================
    // SECTION: Company Switching
    // ========================================
    //
    // Switches to a different company's data and refreshes visualization.
    // Updates octave layers if visible.
    //
    // ========================================

    /**
     * Switch to a different company's data
     *
     * Uses CompanyLoader to switch the engine state, then refreshes
     * all visualizations including octave layers.
     *
     * @param {string} companyId - Company ID (e.g., 'quannex', 'techflow')
     */
    async function switchCompany(companyId) {
        try {
            if (!global.CompanyLoader) {
                throw new Error('Company loader not available');
            }

            console.log(`[dodec-data] 🔄 Switching to company: ${companyId}`);

            // Update current company tracking for octave layers
            S.currentCompany = companyId;

            await global.CompanyLoader.switchCompany(companyId);

            // Get fresh state from whichever engine is available
            const engine = global.Quannex || global.quannexEngine;
            if (engine) {
                S.companyData = engine.getState();
            }

            updateVisualization();

            // updateStats() will be called by dodec-controls.js
            if (typeof global.updateStats === 'function') {
                global.updateStats();
            }

            // Update octave layers if visible (Phase 3 feature)
            if (typeof global.updateOctaveLayers === 'function') {
                global.updateOctaveLayers();
            }

            console.log(`[dodec-data] ✅ Switched to ${companyId} - ${S.companyData?.faces?.length || 0} faces loaded`);
        } catch (error) {
            console.error(`[dodec-data] ❌ Error switching to ${companyId}:`, error);
        }
    }

    // ========================================
    // SECTION: Visualization Update
    // ========================================
    //
    // Updates face material colors based on engine state.
    // The core data→visual mapping function.
    //
    // ========================================

    /**
     * Update visualization with current company data
     *
     * Reads face energy from engine state and applies colors to materials.
     * Also stores face data in mesh.userData for panel display.
     *
     * Color mapping (via getEnergyColor from dodec-materials.js):
     * - 0.7-1.0: Green (healthy)
     * - 0.4-0.7: Yellow/Orange (warning)
     * - 0.0-0.4: Red (critical)
     */
    function updateVisualization() {
        // Get fresh state from engine instead of using cached data
        const engine = global.Quannex || global.quannexEngine;
        if (engine) {
            S.companyData = engine.getState();
            console.log('[dodec-data] 🔄 Refreshed company data from engine:',
                S.companyData?.faces?.length || 0, 'faces');
        }

        if (!S.companyData || !S.companyData.faces) {
            console.warn('[dodec-data] ⚠️ No company data available');
            return;
        }

        // Get the materials array
        const materials = global.dodecahedronMaterials || S.materials;
        if (!materials || materials.length === 0) {
            console.warn('[dodec-data] ⚠️ Materials not available yet');
            return;
        }

        // Get getEnergyColor function
        const getEnergyColor = global.getEnergyColor;
        if (!getEnergyColor) {
            console.warn('[dodec-data] ⚠️ getEnergyColor not available');
            return;
        }

        // Update each material's color based on face energy
        S.companyData.faces.forEach((face, index) => {
            if (index < materials.length) {
                const energy = face.faceEnergy || 0;
                const color = getEnergyColor(energy);

                // Update material properties
                materials[index].color = color;

                // Add emissive glow - stronger for critical faces
                let emissiveIntensity;
                if (energy < 0.1) {
                    emissiveIntensity = 0.6; // Very low energy = strong glow (visible warning)
                } else if (energy < 0.4) {
                    emissiveIntensity = 0.5; // Critical = strong glow
                } else {
                    emissiveIntensity = 0.3; // Healthy = moderate glow
                }

                materials[index].emissive = color.clone().multiplyScalar(0.3);
                materials[index].emissiveIntensity = emissiveIntensity;

                // Store face data in the clickable mesh
                if (S.faceMeshes[index]) {
                    S.faceMeshes[index].userData.faceData = face;
                    console.log(`[dodec-data]    ✅ Face ${index + 1} data stored:`,
                        face.name, `(${face.elementalKPIs?.length || 0} KPIs)`);
                }
            }
        });

        // Force material updates
        materials.forEach(mat => mat.needsUpdate = true);

        console.log('[dodec-data] ✅ Visualization updated with',
            S.companyData.faces.length, 'face colors');
    }

    // ========================================
    // SECTION: Edge Data Update
    // ========================================
    //
    // Updates edge userData with data from sessionStorage.
    // Called when sessionStorage is populated by orchestrator.
    //
    // ========================================

    /**
     * Update edge userData with data from sessionStorage or CompanyTemplatesBundle
     *
     * Edge data includes:
     * - faceIds: Which two faces the edge connects
     * - tension: Relationship health (0-1)
     * - element: Elemental nature (Earth, Water, Fire, Air, Ether)
     * - theQuestion: The reflective question for this edge
     */
    function updateEdgeData() {
        if (!S.edgeLines || S.edgeLines.length === 0) {
            console.log('[dodec-data] ℹ️ No edge lines to update');
            return;
        }

        // Try to load edge data from sessionStorage
        let edgeDataMap = {};
        try {
            const customDataJson = sessionStorage.getItem('customCompanyData');
            if (customDataJson) {
                const customData = JSON.parse(customDataJson);
                if (customData.edges && customData.edges.length > 0) {
                    customData.edges.forEach(edge => {
                        const key = edge.faceIds.slice().sort().join('-');
                        edgeDataMap[key] = edge;
                    });
                    console.log(`[dodec-data] 📊 Loaded ${customData.edges.length} edges from sessionStorage`);
                }
            }
        } catch (e) {
            console.warn('[dodec-data] Could not load edge data from sessionStorage:', e);
        }

        // Fallback to CompanyTemplatesBundle
        if (Object.keys(edgeDataMap).length === 0 && global.CompanyTemplatesBundle?.templates) {
            const selectedCompanyId = sessionStorage.getItem('selectedCompanyId');
            if (selectedCompanyId && global.CompanyTemplatesBundle.templates[selectedCompanyId]?.edges) {
                const edges = global.CompanyTemplatesBundle.templates[selectedCompanyId].edges;
                edges.forEach(edge => {
                    const key = edge.faceIds.slice().sort().join('-');
                    edgeDataMap[key] = edge;
                });
                console.log(`[dodec-data] 📊 Loaded ${edges.length} edges from CompanyTemplatesBundle`);
            }
        }

        if (Object.keys(edgeDataMap).length === 0) {
            console.log('[dodec-data] ℹ️ No edge data available to update');
            return;
        }

        // Update each edge line's userData
        let updatedCount = 0;
        S.edgeLines.forEach(line => {
            if (!line.userData) return;

            // Get the face pair from existing userData
            const currentFaceIds = line.userData.edgeData?.faceIds || [];
            if (currentFaceIds.length < 2) return;

            const faceKey = currentFaceIds.slice().sort().join('-');
            const mappedEdgeData = edgeDataMap[faceKey];

            if (mappedEdgeData) {
                // Update userData with fresh data
                line.userData.edgeData = {
                    faceIds: mappedEdgeData.faceIds,
                    tension: mappedEdgeData.tension || 0,
                    healthStatus: mappedEdgeData.tension < 0.1 ? 'Healthy' :
                                  mappedEdgeData.tension < 0.2 ? 'Moderate' : 'Tense',
                    element: mappedEdgeData.elementalNature || 'Unknown',
                    color: ELEMENT_COLORS[mappedEdgeData.elementalNature] || '#00ffcc',
                    theQuestion: mappedEdgeData.theQuestion || null
                };
                line.userData.edgeName = mappedEdgeData.emergentName || line.userData.edgeName;
                updatedCount++;
            }
        });

        console.log(`[dodec-data] ✅ Updated ${updatedCount}/${S.edgeLines.length} edges with mapped data`);
    }

    // ========================================
    // SECTION: Philosophical Visual Feedback
    // ========================================
    //
    // Updates visual properties based on philosophical slider values.
    // GAMMA controls edge opacity, DELTA controls face transparency.
    //
    // ========================================

    /**
     * Update visual feedback based on philosophical parameters
     *
     * @param {Object} params - Philosophical parameter values
     * @param {number} [params.GAMMA] - Balance: Relational vs Internal (0-1)
     * @param {number} [params.DELTA] - Shadow: Non-Duality vs Local Reality (0-1)
     */
    function updateVisualFeedback(params) {
        // GAMMA (Balance): Relational vs Internal
        // Low Gamma = Relational = Stronger Edges (Pillars)
        // High Gamma = Internal = Weaker Edges
        if (params.GAMMA !== undefined) {
            const edgeOpacity = 0.8 - (params.GAMMA * 0.6); // 0.0 -> 0.8, 1.0 -> 0.2
            if (S.edgeLines) {
                S.edgeLines.forEach(edge => {
                    if (edge.material) {
                        edge.material.opacity = edgeOpacity;
                        edge.material.needsUpdate = true;
                    }
                });
            }
        }

        // DELTA (Shadow): Non-Duality vs Local Reality
        // Low Delta = Non-Duality = See the Shadow (Transparency)
        // High Delta = Local Reality = Solid Faces
        if (params.DELTA !== undefined) {
            const isNonDual = params.DELTA < 0.5;
            const opacity = isNonDual ? 0.6 : 1.0;
            const transparent = isNonDual;

            const materials = global.dodecahedronMaterials || S.materials;
            if (materials) {
                materials.forEach(mat => {
                    mat.transparent = transparent;
                    mat.opacity = opacity;
                    // If non-dual, we want to see the inside/back faces clearly
                    mat.side = THREE.DoubleSide;
                    mat.needsUpdate = true;
                });
            }
        }
    }

    // ========================================
    // SECTION: Shadow Face Highlighting
    // ========================================
    //
    // Visual indicators for faces affected by shadow patterns.
    // Uses PHI-derived intensity values.
    //
    // ========================================

    /**
     * Highlight faces affected by shadow patterns
     *
     * Uses PHI-derived intensity values for severity levels.
     * Stores original emissive properties for later restoration.
     *
     * @param {Array<number>} faceIds - Array of face IDs (1-indexed) to highlight
     * @param {string} [severity='moderate'] - 'critical' | 'high' | 'moderate'
     */
    function highlightShadowFaces(faceIds, severity = 'moderate') {
        const materials = global.dodecahedronMaterials || S.materials;
        if (!materials || !Array.isArray(faceIds)) return;

        // PHI-derived intensity values
        const intensityMap = {
            critical: 1.0,
            high: PHI_1,    // φ^-1 ≈ 0.618
            moderate: PHI_2 // φ^-2 ≈ 0.382
        };

        const intensity = intensityMap[severity] || intensityMap.moderate;

        // Shadow highlight color (red spectrum for warnings)
        const shadowColor = new THREE.Color(0xff4444);

        faceIds.forEach(faceId => {
            // Find face mesh by faceId (faceId is 1-indexed)
            const meshIndex = S.faceMeshes.findIndex(m =>
                m.userData.faceId === faceId || m.userData.faceData?.id === faceId
            );

            if (meshIndex !== -1 && materials[meshIndex]) {
                const material = materials[meshIndex];

                // Store original emissive for restoration
                if (!material.userData) material.userData = {};
                if (!material.userData.originalEmissive) {
                    material.userData.originalEmissive = material.emissive.clone();
                    material.userData.originalEmissiveIntensity = material.emissiveIntensity || 0;
                }

                // Apply shadow highlight with lerp for smooth blending
                material.emissive.lerp(shadowColor, 0.4 * intensity);
                material.emissiveIntensity = Math.min(0.8,
                    (material.userData.originalEmissiveIntensity || 0) + (0.4 * intensity));
                material.userData.hasShadowHighlight = true;
                material.needsUpdate = true;
            }
        });
    }

    /**
     * Clear shadow highlights from all faces
     *
     * Restores original emissive properties saved during highlighting.
     */
    function clearShadowHighlights() {
        const materials = global.dodecahedronMaterials || S.materials;
        if (!materials) return;

        materials.forEach(material => {
            if (material.userData?.hasShadowHighlight) {
                if (material.userData.originalEmissive) {
                    material.emissive.copy(material.userData.originalEmissive);
                    material.emissiveIntensity = material.userData.originalEmissiveIntensity || 0;
                }
                material.userData.hasShadowHighlight = false;
                material.needsUpdate = true;
            }
        });
    }

    // ========================================
    // EXPORTS
    // ========================================

    // Core functions
    global.loadQuannexEngine = loadQuannexEngine;
    global.switchCompany = switchCompany;
    global.updateVisualization = updateVisualization;
    global.updateEdgeData = updateEdgeData;

    // Visual feedback
    global.updateVisualFeedback = updateVisualFeedback;

    // Shadow highlighting
    global.highlightShadowFaces = highlightShadowFaces;
    global.clearShadowHighlights = clearShadowHighlights;

    // Convenience alias for cross-window refresh
    global.refreshVisualization = function() {
        updateVisualization();
        updateEdgeData();
        if (typeof global.updateStats === 'function') {
            global.updateStats();
        }
    };

    console.log('[dodec-data] Module loaded - Data layer ready');
    console.log('[dodec-data] Exports: loadQuannexEngine, switchCompany, updateVisualization, updateEdgeData');

})(typeof window !== 'undefined' ? window : this);
