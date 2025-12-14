/**
 * Unified Data Loader
 * 
 * The "Single Source of Truth" for the Quannex Engine.
 * Centralizes loading from:
 * 1. Static CSVs (Base Models)
 * 2. Company JSONs (Specific Profiles)
 * 3. AI Generation (Dynamic Context)
 */

import { AIEdgeInterpreter } from './advanced/ai-edge-interpreter.js';

export class UnifiedDataLoader {
    constructor() {
        this.aiInterpreter = new AIEdgeInterpreter();
        this.cache = new Map();
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
        const [edges, vertices] = await Promise.all([
            this.fetchCSV('./data/CSV_Edge_tension_Map.csv'),
            this.fetchCSV('./data/CSV_Vortex_Map.csv')
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
        try {
            // Load metadata
            const profileReq = await fetch(`./companies/${companyId}/company.json`);
            const profile = await profileReq.json();

            // Load KPIs
            const kpiReq = await fetch(`./companies/${companyId}/kpis.csv`);
            const kpiText = await kpiReq.text();
            const kpis = this.parseKPIs(kpiText);

            // Try to load rich shadowPatterns and tuning from mapping-context.json
            // (mapping-context has proper object format vs company.json string format)
            let shadowPatterns = profile.shadowPatterns || [];
            let tuning = null;
            try {
                const mappingReq = await fetch(`./companies/${companyId}/mapping-context.json`);
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
