/**
 * ========================================
 * MODULE: unified-data-loader.js
 * ========================================
 *
 * UNIFIED DATA LOADER - The Single Source of Truth
 *
 * This is the GATEKEEPER for all data entering the Quannex system.
 * It centralizes loading from three sources and synthesizes them
 * into a unified context object that all other modules consume.
 *
 * THE THREE DATA SOURCES:
 * ┌─────────────────────────────────────────────────────────────┐
 * │ 1. STATIC CSVs (Base Models - The Geometry)                │
 * │    - CSV_Edge_tension_Map.csv → 30 edges with archetypes   │
 * │    - CSV_Vortex_Map.csv → 20 vertices with face mappings   │
 * │    These define the FIXED dodecahedron topology.           │
 * ├─────────────────────────────────────────────────────────────┤
 * │ 2. COMPANY JSONs (Specific Profiles)                       │
 * │    - companies/{id}/company.json → metadata + faceConfig   │
 * │    - companies/{id}/kpis.csv → KPI definitions             │
 * │    - companies/{id}/mapping-context.json → shadow patterns │
 * │    These customize the dodecahedron for each organization. │
 * ├─────────────────────────────────────────────────────────────┤
 * │ 3. AI GENERATION (Dynamic Context)                         │
 * │    - AIEdgeInterpreter generates edge metadata on-the-fly  │
 * │    - Used when CSV/JSON data is insufficient               │
 * │    Provides intelligent fallbacks for missing data.        │
 * └─────────────────────────────────────────────────────────────┘
 *
 * DEPENDENCIES:
 * - AIEdgeInterpreter (./advanced/ai-edge-interpreter.js)
 * - CSV files in ./data/ folder
 * - Company profiles in ./companies/{companyId}/ folder
 *
 * EXPORTS (to window/global):
 * - UnifiedDataLoader (class) - exported via ES6 module AND window
 *
 * ========================================
 * NOTES FOR FUTURE CLAUDE
 * ========================================
 *
 * 1. THE LOADCONTEXT() FLOW (Main Entry Point):
 *    loadContext(companyId, customConfig) does:
 *    Step 1: loadBaseModels() - CSV geometry (cached)
 *    Step 2: loadCompanyProfile() OR use customConfig
 *    Step 3: synthesizeContext() - merge everything
 *    Result: A complete context object ready for Quannex
 *
 * 2. CACHING STRATEGY:
 *    - this.cache = new Map() holds cached data
 *    - Base models (CSVs) are cached after first load
 *    - Company profiles are NOT cached (may change)
 *    - Cache key: 'baseModels' for edge/vertex definitions
 *
 * 3. THE 'CUSTOM' COMPANY ID:
 *    When companyId === 'custom':
 *    - Uses customConfig if provided
 *    - Falls back to getDefaultFaces() if no config
 *    - This handles direct navigation to views without orchestrator
 *    - Warning is logged when no config provided
 *
 * 4. COMPANY PROFILE LOADING:
 *    loadCompanyProfile(companyId) loads 3 files:
 *    1. company.json → { id, name, description, faceConfig, shadowPatterns }
 *    2. kpis.csv → Array of KPI objects
 *    3. mapping-context.json → Rich shadow patterns + tuning (optional)
 *
 * 5. SHADOW PATTERNS PRIORITY:
 *    The loader tries mapping-context.json FIRST because:
 *    - company.json has shadowPatterns as strings
 *    - mapping-context.json has proper objects with 'name' property
 *    - Rich objects enable better shadow detection
 *
 * 6. TUNING PARAMETERS:
 *    Tuning (alpha, beta, etc.) can come from mapping-context.json:
 *    - diagnostics.tuning.perspective → 'optimistic'/'realistic'
 *    - Ensures coherence calculations match the mapping session
 *
 * 7. THE SYNTHESIZE FLOW:
 *    synthesizeContext(baseData, companyData) does:
 *    a) Faces: Use companyData.faceConfig OR getDefaultFaces()
 *    b) Edges: Merge CSV definitions + AI-generated metadata
 *    c) Vertices: Enrich CSV definitions with face names
 *    d) Return unified { company, faces, edges, vertices, kpis, shadowPatterns, tuning }
 *
 * 8. CSV PARSING:
 *    - parseCSVLine() handles quoted commas correctly
 *    - parseEdgeCSV() extracts face IDs from "Face 1" strings
 *    - parseVertexCSV() gets 3 face IDs per vertex
 *    - parseKPIs() creates objects from header-value pairs
 *
 * 9. DEFAULT FACES (The 12 Organizational Domains):
 *    When no faceConfig provided, getDefaultFaces() returns:
 *    1: Financial Capital, 2: Human Capital, 3: Customer Experience
 *    4: Operations, 5: Technology, 6: Brand
 *    7: Leadership, 8: Strategy, 9: Partnerships
 *    10: Risk, 11: Learning, 12: Sustainability
 *
 * 10. AI EDGE INTERPRETER INTEGRATION:
 *     For each edge, aiInterpreter.generateEdgeMetadata() is called
 *     This enriches edges with contextual metadata like:
 *     - Relationship descriptions
 *     - Flow dynamics
 *     - Tension interpretations
 *
 * 11. THE CONTEXT OBJECT SHAPE:
 *     loadContext() returns:
 *     {
 *       company: { id, name, description },
 *       faces: [{ id, name, ... }],
 *       edges: [{ id, face1Id, face2Id, archetype, element, ... }],
 *       vertices: [{ id, faceIds, faceNames, archetype }],
 *       kpis: [{ name, metric, target, ... }],
 *       shadowPatterns: [{ name, faces, description }],
 *       tuning: { alpha, beta, ..., perspective } or null
 *     }
 *
 * USED BY:
 * - demo-orchestrator.js (initializing sessions)
 * - portrait-view.js (loading company context)
 * - Any component needing the full organizational model
 *
 * GOTCHAS:
 * - CSV paths auto-detect location (./data/ from root, ../data/ from pages/)
 * - Company profiles must exist or loadCompanyProfile returns null
 * - 'custom' without config shows a warning but still works
 * - Edge element is extracted: "Air (Communication)" → "Air"
 * - Face IDs in CSV are strings like "Face 1", parsed to integers
 * - ES6 module export AND window export for compatibility
 *
 * ========================================
 *
 * @module js/unified-data-loader
 * @author Deimantas Butrimas & Claude
 * @version 2.0.0 - Documented with Notes for Future Claude
 */

import { AIEdgeInterpreter } from './advanced/ai-edge-interpreter.js';

export class UnifiedDataLoader {
    constructor() {
        this.aiInterpreter = new AIEdgeInterpreter();
        this.cache = new Map();
    }

    /**
     * Get the correct base path for fetching resources
     * Auto-detects if running from /pages/ subdirectory
     * @returns {string} Base path prefix ('./' or '../')
     */
    getBasePath() {
        return window.location.pathname.includes('/pages/') ? '../' : './';
    }

    /**
     * Load the complete context for a session
     * @param {string} companyId - 'quannex', 'nova-tech', etc. OR 'custom'
     * @param {Object} customConfig - Optional config for custom/AI modes
     */
    async loadContext(companyId, customConfig = null) {
        console.log(`🔄 UnifiedLoader: Loading context for '${companyId}'...`);

        // 1. Load Base CSV Models (The Geometry)
        const baseData = await this.loadBaseModels();

        // 2. Load Specific Company Data
        let companyData = null;
        if (companyId === 'custom') {
            if (customConfig) {
                companyData = customConfig;
            } else {
                // Custom company without config - create minimal default
                // This happens when navigating directly to a view without going through orchestrator
                console.warn('⚠️ Custom company requested but no config provided. Using default.');
                companyData = {
                    id: 'custom',
                    name: 'Custom Analysis',
                    description: 'Session data not found - please start from Demo Orchestrator',
                    faceConfig: { faces: this.getDefaultFaces() },
                    kpis: []
                };
            }
        } else {
            companyData = await this.loadCompanyProfile(companyId);
        }

        if (!companyData) {
            console.error('❌ Failed to load company data');
            return null;
        }

        // 3. Merge & Synthesize
        const context = this.synthesizeContext(baseData, companyData);

        console.log('✅ Context Loaded:', context);
        return context;
    }

    /**
     * Load the static CSV models that define the Dodecahedron's physics
     */
    async loadBaseModels() {
        if (this.cache.has('baseModels')) {
            return this.cache.get('baseModels');
        }

        console.log('   📂 Loading base CSV models...');
        // Use getBasePath() to work from any subdirectory (e.g., pages/)
        const basePath = this.getBasePath();
        const [edges, vertices] = await Promise.all([
            this.fetchCSV(`${basePath}data/CSV_Edge_tension_Map.csv`),
            this.fetchCSV(`${basePath}data/CSV_Vortex_Map.csv`)
        ]);

        const models = {
            edgeDefinitions: this.parseEdgeCSV(edges),
            vertexDefinitions: this.parseVertexCSV(vertices)
        };

        this.cache.set('baseModels', models);
        return models;
    }

    /**
     * Load a company profile from the companies folder
     */
    async loadCompanyProfile(companyId) {
        const basePath = this.getBasePath();
        try {
            // Load metadata
            const profileReq = await fetch(`${basePath}companies/${companyId}/company.json`);
            const profile = await profileReq.json();

            // Load KPIs
            const kpiReq = await fetch(`${basePath}companies/${companyId}/kpis.csv`);
            const kpiText = await kpiReq.text();
            const kpis = this.parseKPIs(kpiText);

            // Try to load rich shadowPatterns and tuning from mapping-context.json
            // (mapping-context has proper object format vs company.json string format)
            let shadowPatterns = profile.shadowPatterns || [];
            let tuning = null;
            try {
                const mappingReq = await fetch(`${basePath}companies/${companyId}/mapping-context.json`);
                if (mappingReq.ok) {
                    const mappingContext = await mappingReq.json();
                    if (mappingContext.shadowPatterns && mappingContext.shadowPatterns.length > 0) {
                        // Check if it's proper object format (has 'name' property)
                        if (typeof mappingContext.shadowPatterns[0] === 'object' && mappingContext.shadowPatterns[0].name) {
                            shadowPatterns = mappingContext.shadowPatterns;
                            console.log(`   ✅ Loaded ${shadowPatterns.length} rich shadow patterns from mapping-context.json`);
                        }
                    }
                    // Extract tuning parameters for consistent coherence calculation
                    if (mappingContext.diagnostics?.tuning) {
                        tuning = mappingContext.diagnostics.tuning;
                        console.log(`   ✅ Loaded tuning (${tuning.perspective}) from mapping-context.json`);
                    }
                }
            } catch (mappingError) {
                // mapping-context.json not available, use company.json shadowPatterns
                console.log(`   ℹ️ Using basic shadow patterns from company.json`);
            }

            return {
                ...profile,
                kpis: kpis,
                shadowPatterns: shadowPatterns,
                tuning: tuning
            };
        } catch (error) {
            console.warn(`   ⚠️ Could not load profile for '${companyId}':`, error);
            return null;
        }
    }

    /**
     * Synthesize the final context object
     */
    synthesizeContext(baseData, companyData) {
        // 1. Map Faces
        const faces = companyData.faceConfig ? companyData.faceConfig.faces : this.getDefaultFaces();

        // 2. Map Edges (Merge Base Geometry with Company Context)
        const edges = baseData.edgeDefinitions.map(def => {
            const face1 = faces.find(f => f.id === def.face1Id);
            const face2 = faces.find(f => f.id === def.face2Id);

            // Use AI Interpreter to generate context if missing
            const metadata = this.aiInterpreter.generateEdgeMetadata(
                face1 || { id: def.face1Id, name: `Face ${def.face1Id}` },
                face2 || { id: def.face2Id, name: `Face ${def.face2Id}` },
                def.element,
                def // Pass original CSV data as fallback
            );

            return {
                ...def,
                ...metadata,
                face1Name: face1 ? face1.name : `Face ${def.face1Id}`,
                face2Name: face2 ? face2.name : `Face ${def.face2Id}`
            };
        });

        // 3. Map Vertices
        const vertices = baseData.vertexDefinitions.map(def => {
            const faceNames = def.faceIds.map(fid => {
                const f = faces.find(face => face.id === fid);
                return f ? f.name : `Face ${fid}`;
            });

            return {
                ...def,
                faceNames: faceNames
            };
        });

        return {
            company: {
                id: companyData.id,
                name: companyData.name,
                description: companyData.description
            },
            faces: faces,
            edges: edges,
            vertices: vertices,
            kpis: companyData.kpis,
            shadowPatterns: companyData.shadowPatterns || [],
            tuning: companyData.tuning || null
        };
    }

    // ==========================================
    // PARSERS (The "No More Hardcoded Magic" Zone)
    // ==========================================

    async fetchCSV(path) {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`Failed to fetch ${path}`);
        return await response.text();
    }

    parseEdgeCSV(csvText) {
        const lines = csvText.split('\n').filter(l => l.trim());
        // Skip header
        return lines.slice(1).map(line => {
            const cols = this.parseCSVLine(line);
            if (cols.length < 5) return null;

            // Extract Face IDs from "Face 1" string
            const f1 = parseInt(cols[1].replace(/\D/g, '')) || 0;
            const f2 = parseInt(cols[2].replace(/\D/g, '')) || 0;

            return {
                id: cols[0].trim(),
                face1Id: f1,
                face2Id: f2,
                archetype: cols[3]?.trim(),
                element: cols[13]?.split(' ')[0] || 'Ether', // "Air (Communication)" -> "Air"
                question: cols[14]?.trim(),
                kpiName: cols[9]?.trim(),
                kpiMetric: cols[10]?.trim(),
                kpiCalculation: cols[11]?.trim()
            };
        }).filter(e => e !== null);
    }

    parseVertexCSV(csvText) {
        const lines = csvText.split('\n').filter(l => l.trim());
        return lines.slice(1).map(line => {
            const cols = this.parseCSVLine(line);
            if (!cols[0] || !cols[0].startsWith('V')) return null;

            // Hardcoded mapping from standard Dodecahedron topology
            // (Since CSV doesn't explicitly list face IDs in a machine-readable way easily)
            // We'll use the ID to look up the topology if needed, or parse if available.
            // For now, let's assume the VertexAnalyzer has the topology definitions 
            // and we just enrich it. 
            // Actually, let's return the metadata and let the synthesizer merge it 
            // with the hardcoded topology in the synthesizer if needed, 
            // OR we parse the "Face_1_ID" columns if they exist.

            // Looking at previous file view, CSV has Face_1_ID etc.
            const f1 = parseInt(cols[1]?.replace(/\D/g, '')) || 0;
            const f2 = parseInt(cols[2]?.replace(/\D/g, '')) || 0;
            const f3 = parseInt(cols[3]?.replace(/\D/g, '')) || 0;

            return {
                id: cols[0].trim(),
                faceIds: [f1, f2, f3],
                archetype: cols[15]?.trim() // "Archetype" column
            };
        }).filter(v => v !== null);
    }

    parseKPIs(csvText) {
        const lines = csvText.split('\n').filter(l => l.trim());
        const headers = lines[0].split(',').map(h => h.trim());

        return lines.slice(1).map(line => {
            const cols = this.parseCSVLine(line);
            const kpi = {};
            headers.forEach((h, i) => kpi[h] = cols[i]?.trim());
            return kpi;
        });
    }

    parseCSVLine(text) {
        // Simple regex to handle quoted commas
        const re_value = /(?!\s*$)\s*(?:'([^']*)'|"([^"]*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
        const a = [];
        text.replace(re_value, function (m0, m1, m2, m3) {
            if (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
            else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
            else if (m3 !== undefined) a.push(m3);
            return '';
        });
        if (/,\s*$/.test(text)) a.push('');
        return a;
    }

    getDefaultFaces() {
        return [
            { id: 1, name: 'Financial Capital' },
            { id: 2, name: 'Human Capital' },
            { id: 3, name: 'Customer Experience' },
            { id: 4, name: 'Operations' },
            { id: 5, name: 'Technology' },
            { id: 6, name: 'Brand' },
            { id: 7, name: 'Leadership' },
            { id: 8, name: 'Strategy' },
            { id: 9, name: 'Partnerships' },
            { id: 10, name: 'Risk' },
            { id: 11, name: 'Learning' },
            { id: 12, name: 'Sustainability' }
        ];
    }
}

// Export to window
if (typeof window !== 'undefined') {
    window.UnifiedDataLoader = UnifiedDataLoader;
}
