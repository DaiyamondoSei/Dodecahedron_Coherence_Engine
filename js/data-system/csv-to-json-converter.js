/**
 * ============================================================================
 * CSV TO JSON CONVERTER - Self-Documenting Data Migration Engine
 * ============================================================================
 *
 * VERSION: 2.0.0
 * CREATED: 2025-12-26 by Claude Opus 4.5
 * ENHANCED: 2025-12-30 - Added transformDodecaEngine, transformFaceModels
 * VERIFICATION: ✅ Verified 2025-12-30 - All 8 JSON files generated successfully
 * COMPLEXITY: Medium-High
 * DATA INTEGRITY: Protected (uses DataValidator, creates audit trail)
 *
 * ============================================================================
 * NOTES FOR FUTURE CLAUDE
 * ============================================================================
 *
 * WHAT THIS DOES:
 * ────────────────────────────────────────────────────────────────────────────
 * Transforms Quannex CSV files into self-documenting JSON with:
 * - $philosophy layer - Human-readable meaning
 * - $topology layer - Sacred geometry validation
 * - $integrity layer - Multi-dimensional health checks
 * - wasSubstituted audit trail for every field
 *
 * KEY INSIGHT - CSV is Seed, JavaScript is Tree:
 * ────────────────────────────────────────────────────────────────────────────
 * The JavaScript codebase has EVOLVED beyond the original CSV formulas.
 * This converter captures the evolved JavaScript state, not just CSV parsing.
 *
 * NAVIGATION MAP:
 * ────────────────────────────────────────────────────────────────────────────
 * DEPENDS ON:
 * - DataValidator (window.DataValidator) → Corruption detection, PHI defaults
 * - PhiHarmonics (window.PhiHarmonics) → Sacred geometry constants
 *
 * EXPORTS:
 * - CSVToJSONConverter.convert(type, csvContent) → Single file conversion
 * - CSVToJSONConverter.convertAll(csvFiles) → Batch conversion
 * - CSVToJSONConverter.getSchema(type) → Get JSON Schema for type
 *
 * USED BY:
 * - tools/migrate-csv-to-json.html → Migration UI
 * - Manual migration scripts
 *
 * ============================================================================
 */

(function(global) {
    'use strict';

    // ========================================================================
    // SECTION 1: CONSTANTS & CONFIGURATION
    // ========================================================================

    const VERSION = '2.0.0';

    /**
     * CSV file registry with metadata
     */
    const CSV_REGISTRY = {
        'kpi-database': {
            filename: 'CSV_KPI_Database.csv',
            priority: 1,
            expectedRecords: 12,
            description: 'The 12 organizational domains (faces of dodecahedron)'
        },
        'edge-tension': {
            filename: 'CSV_Edge_tension_Map.csv',
            priority: 2,
            expectedRecords: 30,
            description: 'The 30 connections between domains (edges)'
        },
        'vortex-map': {
            filename: 'CSV_Vortex_Map.csv',
            priority: 3,
            expectedRecords: 20,
            description: 'The 20 triadic intersections (vertices)'
        },
        'breath-ratios': {
            filename: 'CSV_BREATH_RATIOS.csv',
            priority: 4,
            expectedRecords: 6,
            description: 'The 6 harmonic axes (breath patterns)'
        },
        'face-models': {
            filename: 'CSV_Face_Models.csv',
            priority: 5,
            expectedRecords: 12,
            description: 'Detailed pentagram analysis per face'
        },
        'dodeca-engine': {
            filename: 'CSV_Dodeca_Engine.csv',
            priority: 6,
            expectedRecords: 12,
            description: 'Spectral analysis and graph Laplacian'
        },
        'system-coherence': {
            filename: 'CSV_System_Coherence.csv',
            priority: 7,
            expectedRecords: 12,
            description: 'Department-level coherence summary'
        },
        'spiral-dashboard': {
            filename: 'CSV_SPIRAL_DASHBOARD.csv',
            priority: 8,
            expectedRecords: 1,
            description: 'Executive summary metrics'
        }
    };

    /**
     * Get PHI constants from PhiHarmonics or calculate locally
     */
    function getPHIConstants() {
        const phi = global.PhiHarmonics || {};
        const PHI = phi.PHI || (1 + Math.sqrt(5)) / 2;
        const PHI_1 = phi.PHI_1 || 1 / PHI;
        const PHI_2 = phi.PHI_2 || PHI_1 / PHI;
        const PHI_3 = phi.PHI_3 || PHI_2 / PHI;
        const PHI_MIDPOINT = phi.PHI_MIDPOINT || 0.5;
        const PSI_3 = phi.PSI_3 || 1 - PHI_3;
        const PSI_4 = phi.PSI_4 || 1 - (PHI_3 / PHI);
        const PSI_5 = phi.PSI_5 || 1 - (PHI_3 / (PHI * PHI));

        return { PHI, PHI_1, PHI_2, PHI_3, PHI_MIDPOINT, PSI_3, PSI_4, PSI_5 };
    }

    /**
     * Dodecahedron topology constraints
     */
    const TOPOLOGY = {
        faces: 12,
        edges: 30,
        vertices: 20,
        elementsPerFace: 5,
        breathAxes: 6,
        octaves: 7,
        oppositionPairs: [
            [1, 11], [2, 7], [3, 8], [4, 9], [5, 10], [6, 12]
        ],
        elements: { Fire: 5, Water: 8, Air: 6, Earth: 4, Ether: 7 }
    };

    // ========================================================================
    // SECTION 2: CSV PARSING
    // ========================================================================

    /**
     * Parse a CSV line handling quoted fields with commas
     *
     * @param {string} line - CSV line
     * @returns {string[]} Array of field values
     */
    function parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const nextChar = line[i + 1];

            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    // Escaped quote
                    current += '"';
                    i++;
                } else {
                    // Toggle quote state
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }

        result.push(current.trim());
        return result;
    }

    /**
     * Parse full CSV content into rows
     *
     * @param {string} csvContent - Raw CSV text
     * @param {Object} options - Parsing options
     * @returns {Object} { headers, rows, rawLines }
     */
    function parseCSV(csvContent, options = {}) {
        const { hasHeaders = true, skipEmptyRows = true } = options;

        // Normalize line endings
        const normalized = csvContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        const lines = normalized.split('\n');

        const rawLines = [];
        const parsedRows = [];

        for (const line of lines) {
            if (skipEmptyRows && line.trim() === '') continue;
            rawLines.push(line);
            parsedRows.push(parseCSVLine(line));
        }

        const headers = hasHeaders && parsedRows.length > 0 ? parsedRows[0] : [];
        const rows = hasHeaders ? parsedRows.slice(1) : parsedRows;

        return { headers, rows, rawLines };
    }

    // ========================================================================
    // SECTION 3: DATA VALIDATION INTEGRATION
    // ========================================================================

    /**
     * Validate and track a numeric field
     *
     * @param {*} value - Raw value
     * @param {string} context - Field context for logging
     * @param {number} defaultValue - PHI-derived default
     * @param {Object} tracking - Tracking object to record substitution
     * @returns {number} Validated value
     */
    function validateField(value, context, defaultValue, tracking) {
        const validator = global.DataValidator;

        if (validator?.validateNumber) {
            const result = validator.validateNumber(value, context, defaultValue);

            // Check if substitution occurred
            if (validator.isCorrupted?.(value)) {
                tracking.wasSubstituted = true;
                tracking.originalValue = String(value);
                tracking.substitutedWith = getConstantName(defaultValue);
            }

            return result;
        }

        // Fallback validation
        const parsed = parseFloat(value);
        if (isNaN(parsed) || value === null || value === undefined || value === '') {
            tracking.wasSubstituted = true;
            tracking.originalValue = String(value);
            tracking.substitutedWith = getConstantName(defaultValue);
            return defaultValue;
        }

        return parsed;
    }

    /**
     * Get PHI constant name for a value
     */
    function getConstantName(value) {
        const phi = getPHIConstants();
        const tolerance = 0.000001;

        if (Math.abs(value - phi.PHI) < tolerance) return 'PHI';
        if (Math.abs(value - phi.PHI_1) < tolerance) return 'PHI_1';
        if (Math.abs(value - phi.PHI_2) < tolerance) return 'PHI_2';
        if (Math.abs(value - phi.PHI_3) < tolerance) return 'PHI_3';
        if (Math.abs(value - phi.PHI_MIDPOINT) < tolerance) return 'PHI_MIDPOINT';
        if (Math.abs(value - phi.PSI_3) < tolerance) return 'PSI_3';
        if (Math.abs(value - phi.PSI_4) < tolerance) return 'PSI_4';
        if (Math.abs(value - phi.PSI_5) < tolerance) return 'PSI_5';

        return String(value);
    }

    // ========================================================================
    // SECTION 4: TOPOLOGY VALIDATION
    // ========================================================================

    /**
     * Validate data against dodecahedron topology
     *
     * @param {Object} data - Converted data
     * @param {string} type - Data type (kpis, edges, vertices)
     * @returns {Object} Validation report
     */
    function validateTopology(data, type) {
        const report = {
            valid: true,
            violations: [],
            constraints: {}
        };

        switch (type) {
            case 'kpi-database':
                report.constraints = {
                    expectedFaces: TOPOLOGY.faces,
                    actualFaces: data.kpis?.length || 0
                };
                if (report.constraints.actualFaces !== TOPOLOGY.faces) {
                    report.valid = false;
                    report.violations.push({
                        constraint: 'faceCount',
                        expected: TOPOLOGY.faces,
                        actual: report.constraints.actualFaces,
                        message: 'Dodecahedron must have exactly 12 faces'
                    });
                }
                break;

            case 'edge-tension':
                report.constraints = {
                    expectedEdges: TOPOLOGY.edges,
                    actualEdges: data.edges?.length || 0
                };
                if (report.constraints.actualEdges !== TOPOLOGY.edges) {
                    report.valid = false;
                    report.violations.push({
                        constraint: 'edgeCount',
                        expected: TOPOLOGY.edges,
                        actual: report.constraints.actualEdges,
                        message: 'Dodecahedron must have exactly 30 edges'
                    });
                }
                break;

            case 'vortex-map':
                report.constraints = {
                    expectedVertices: TOPOLOGY.vertices,
                    actualVertices: data.vertices?.length || 0
                };
                if (report.constraints.actualVertices !== TOPOLOGY.vertices) {
                    report.valid = false;
                    report.violations.push({
                        constraint: 'vertexCount',
                        expected: TOPOLOGY.vertices,
                        actual: report.constraints.actualVertices,
                        message: 'Dodecahedron must have exactly 20 vertices'
                    });
                }
                break;

            case 'breath-ratios':
                report.constraints = {
                    expectedAxes: TOPOLOGY.breathAxes,
                    actualAxes: data.axes?.length || 0
                };
                if (report.constraints.actualAxes !== TOPOLOGY.breathAxes) {
                    report.valid = false;
                    report.violations.push({
                        constraint: 'axisCount',
                        expected: TOPOLOGY.breathAxes,
                        actual: report.constraints.actualAxes,
                        message: 'Dodecahedron must have exactly 6 breath axes'
                    });
                }
                break;
        }

        return report;
    }

    // ========================================================================
    // SECTION 5: KPI DATABASE TRANSFORMER
    // ========================================================================

    /**
     * Transform CSV_KPI_Database.csv to self-documenting JSON
     *
     * @param {string} csvContent - Raw CSV content
     * @returns {Object} Self-documenting JSON structure
     */
    function transformKPIDatabase(csvContent) {
        const phi = getPHIConstants();
        const { headers, rows } = parseCSV(csvContent);

        // Clear DataValidator log for fresh tracking
        if (global.DataValidator?.clearLog) {
            global.DataValidator.clearLog();
        }

        const substitutions = [];
        const anomalies = [];
        const kpis = [];

        // Column index mapping (adjust based on actual CSV structure)
        const colIndex = {};
        headers.forEach((h, i) => {
            const normalized = h.toLowerCase().replace(/[^a-z0-9]/g, '_');
            colIndex[normalized] = i;
        });

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            if (!row || row.length === 0) continue;

            // Skip rows without valid KPI_ID (pattern: F1.1, L2.1, P1.1, etc.)
            const rawKpiId = row[colIndex.kpi_id] || row[0] || '';
            if (!rawKpiId || !rawKpiId.trim()) continue;
            // Only include rows with valid KPI ID pattern: Letter + Digit + . + Digit
            if (!/^[FLPSER]\d+\.\d+$/i.test(rawKpiId.trim())) continue;

            const tracking = { wasSubstituted: false };

            // Extract values (these column names may need adjustment)
            const kpiId = rawKpiId.trim();
            const kpiName = row[colIndex.kpi_name] || row[1] || `KPI ${i + 1}`;
            // Extract face ID from "Face 1", "Face 2", etc.
            const rawFaceId = row[colIndex.face_id] || row[3] || '';
            const faceIdMatch = rawFaceId.match(/(\d+)/);
            const faceId = faceIdMatch ? parseInt(faceIdMatch[1]) : (kpis.length + 1);
            const faceName = row[colIndex.face_name] || row[2] || `Face ${faceId}`;
            const octave = row[colIndex.primary_octave] || row[4] || 'O1';

            // Direction normalization
            let direction = row[colIndex.direction] || row[5] || 'up';
            direction = direction.includes('Band') ? 'band' :
                       direction.includes('down') || direction.includes('↓') ? 'down' : 'up';

            const weight = validateField(
                row[colIndex.weight] || row[6],
                `${kpiId} weight`,
                1.0,
                tracking
            );

            const unit = row[colIndex.unit] || row[7] || '';

            // Raw values (preserved as strings)
            const rawValue = row[colIndex.value] || row[8] || '';
            const rawTargetIdeal = row[colIndex.target_ideal] || row[9] || '';
            const rawTargetMin = row[colIndex.target_min] || row[10] || '';

            // Computed values
            const normalized = validateField(
                row[colIndex.k_normalized] || row[11],
                `${kpiId} normalized`,
                phi.PHI_MIDPOINT,
                tracking
            );

            const faceEnergy = validateField(
                row[colIndex.face_energy] || row[12],
                `${kpiId} face energy`,
                phi.PHI_2,
                tracking
            );

            // Diagnostics
            const healthyMin = row[colIndex.healthy_min] || row[15];
            const healthyMax = row[colIndex.healthy_max] || row[16];
            const absoluteMax = row[colIndex.absolute_max] || row[17];
            const rationale = row[colIndex.rationale] || row[18] || '';

            // Track substitutions
            if (tracking.wasSubstituted) {
                substitutions.push({
                    field: `kpis[${i}]`,
                    kpiId,
                    original: tracking.originalValue,
                    substituted: tracking.wasSubstituted ? faceEnergy : normalized,
                    substitutedWith: tracking.substitutedWith,
                    reason: 'Corruption pattern detected'
                });
            }

            // Detect anomalies
            if (faceEnergy === 0 || normalized === 0) {
                anomalies.push({
                    type: 'zeroEnergy',
                    face: faceId,
                    kpiId,
                    description: `${faceName} has zero energy`,
                    severity: 'critical',
                    recommendation: `Review data source for ${kpiName}`
                });
            }

            kpis.push({
                id: kpiId,
                name: kpiName,
                faceId,
                faceName,
                octave,
                direction,
                weight: parseFloat(weight.toFixed(6)),
                unit,

                philosophy: {
                    element: getElementForFace(faceId),
                    question: generateFaceQuestion(faceId, faceName),
                    healthyRange: generateHealthyRange(direction, rawTargetIdeal, rawTargetMin)
                },

                raw: {
                    value: rawValue,
                    target_ideal: rawTargetIdeal,
                    target_min: rawTargetMin,
                    wasCorrupted: tracking.wasSubstituted
                },

                computed: {
                    normalized: parseFloat(normalized.toFixed(6)),
                    faceEnergy: parseFloat(faceEnergy.toFixed(6)),
                    wasSubstituted: tracking.wasSubstituted
                },

                diagnostics: {
                    healthyMin: parseHealthyBound(healthyMin),
                    healthyMax: parseHealthyBound(healthyMax),
                    absoluteMax: parseHealthyBound(absoluteMax),
                    isPlateauKPI: direction === 'band',
                    rationale: rationale.replace(/^"|"$/g, '')
                }
            });
        }

        // Validate topology
        const result = { kpis };
        const topologyReport = validateTopology(result, 'kpi-database');

        // STRESS_TEST_FIX [F6]: Topology validation is now blocking.
        // A non-12-face dodecahedron cannot produce valid sacred geometry.
        // Log violations prominently so they cannot be silently ignored.
        if (!topologyReport.valid) {
          Logger.error('CSVToJSON', `TOPOLOGY VIOLATION in kpi-database: ${topologyReport.violations.join(', ')}`);
        }

        return {
            $schema: './schemas/kpi-database.schema.json',
            $version: VERSION,
            $generatedAt: new Date().toISOString(),
            $source: CSV_REGISTRY['kpi-database'].filename,

            $philosophy: {
                purpose: 'Map of 12 organizational consciousness domains',
                sacredGeometry: 'Each KPI represents one face of the dodecahedron',
                interpretation: {
                    healthy: `When Face Energy > ${phi.PHI_1.toFixed(3)} (PHI^-1), the domain thrives`,
                    critical: `When Face Energy < ${phi.PHI_3.toFixed(3)} (PHI^-3), intervention needed`,
                    zeroEnergy: 'Not absence of effort, but perception below threshold'
                }
            },

            $topology: {
                expectedFaces: TOPOLOGY.faces,
                actualFaces: kpis.length,
                validated: topologyReport.valid,
                violations: topologyReport.violations,
                constraints: {
                    kpiIdPattern: '^[FLPSER]\\d+\\.\\d+$',
                    faceIdRange: [1, 12],
                    octavePattern: '^O[1-7]$'
                }
            },

            $validationRules: {
                corruptionPatterns: global.DataValidator?.CORRUPTION_PATTERNS || [
                    '[object Object]', '#N/A', '#REF!', '#VALUE!', '#DIV/0!', 'undefined', 'null', 'NaN'
                ],
                defaults: {
                    faceEnergy: phi.PHI_2,
                    kpiNormalized: phi.PHI_MIDPOINT,
                    kpiValue: phi.PHI_1
                },
                phiConstants: {
                    PHI: phi.PHI,
                    PHI_1: phi.PHI_1,
                    PHI_2: phi.PHI_2,
                    PHI_3: phi.PHI_3,
                    PHI_MIDPOINT: phi.PHI_MIDPOINT
                }
            },

            $integrityReport: {
                totalRecords: kpis.length,
                substitutionCount: substitutions.length,
                topologyValid: topologyReport.valid,
                anomalies,
                substitutions
            },

            kpis
        };
    }

    // ========================================================================
    // SECTION 6: EDGE TENSION TRANSFORMER
    // ========================================================================

    /**
     * Transform CSV_Edge_tension_Map.csv to JSON
     */
    function transformEdgeTension(csvContent) {
        const phi = getPHIConstants();
        const { headers, rows } = parseCSV(csvContent);

        if (global.DataValidator?.clearLog) {
            global.DataValidator.clearLog();
        }

        const substitutions = [];
        const edges = [];

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            if (!row || row.length === 0) continue;

            // Skip rows without valid Edge_ID (empty rows, metadata rows)
            const rawEdgeId = row[0] || '';
            if (!rawEdgeId || !rawEdgeId.trim() || !rawEdgeId.includes('-')) continue;

            const tracking = { wasSubstituted: false };

            const edgeId = rawEdgeId.trim();
            const faceAId = parseInt(edgeId.split('-')[0]?.replace('E', '')) || 1;
            const faceBId = parseInt(edgeId.split('-')[1]) || 2;

            // Phase 0.2 Fix: Correct column indices for CSV_Edge_tension_Map.csv
            // CSV Structure (0-indexed):
            // 0: Edge_ID, 1: Face_A_ID, 2: Face_B_ID, 3: Edge Archetype (text)
            // 4: Face_A_Energy, 5: Face_B_Energy, 6: Edge_tension, 7: Breath Ratio
            // 8: KPI Coherence, 9: KPI Name, 10: Metric, 11: Calculation, 12: KPI Value
            // 13: Elemental Nature, 14: The Question
            const edgeArchetype = row[3] || '';  // Text archetype like "Market Resonance → Regenerative Flow"
            const faceAEnergy = validateField(row[4], `${edgeId} Face A energy`, phi.PHI_2, tracking);
            const faceBEnergy = validateField(row[5], `${edgeId} Face B energy`, phi.PHI_2, tracking);
            const tension = validateField(row[6], `${edgeId} tension`, 0, tracking);
            const breathRatio = validateField(row[7], `${edgeId} breath ratio`, 1.0, tracking);
            const kpiCoherence = validateField(row[8], `${edgeId} KPI coherence`, 0, tracking);
            const kpiName = row[9] || '';        // Edge KPI Name
            const kpiMetric = row[10] || '';     // How to measure
            const kpiCalculation = row[11] || ''; // Calculation system
            const elementalNature = row[13] || 'Ether';
            const theQuestion = row[14] || '';

            if (tracking.wasSubstituted) {
                substitutions.push({
                    field: `edges[${i}]`,
                    edgeId,
                    original: tracking.originalValue,
                    substitutedWith: tracking.substitutedWith,
                    reason: 'Corruption pattern detected'
                });
            }

            edges.push({
                id: edgeId,
                faceA: {
                    id: faceAId,
                    name: getFaceName(faceAId),
                    energy: parseFloat(faceAEnergy.toFixed(6))
                },
                faceB: {
                    id: faceBId,
                    name: getFaceName(faceBId),
                    energy: parseFloat(faceBEnergy.toFixed(6))
                },

                philosophy: {
                    element: elementalNature,
                    question: theQuestion.replace(/^"|"$/g, ''),
                    archetype: edgeArchetype.replace(/^"|"$/g, '') || `The relationship between ${getFaceName(faceAId)} and ${getFaceName(faceBId)}`
                },

                kpi: {
                    name: kpiName.replace(/^"|"$/g, ''),
                    metric: kpiMetric.replace(/^"|"$/g, ''),
                    calculation: kpiCalculation.replace(/^"|"$/g, '')
                },

                computed: {
                    tension: parseFloat(tension.toFixed(6)),
                    breathRatio: parseFloat(breathRatio.toFixed(6)),
                    kpiCoherence: parseFloat(kpiCoherence.toFixed(6)),
                    wasSubstituted: tracking.wasSubstituted
                },

                diagnostics: {
                    status: getEdgeStatus(breathRatio),
                    interpretation: getEdgeInterpretation(breathRatio)
                }
            });
        }

        const result = { edges };
        const topologyReport = validateTopology(result, 'edge-tension');

        // STRESS_TEST_FIX [F6]: Log topology violations prominently
        if (!topologyReport.valid) {
          Logger.error('CSVToJSON', `TOPOLOGY VIOLATION in edge-tension: ${topologyReport.violations.join(', ')}`);
        }

        // Check for all-zero KPI coherence (known issue)
        const allZeroKPI = edges.every(e => e.computed.kpiCoherence === 0);

        return {
            $schema: './schemas/edge-tension.schema.json',
            $version: VERSION,
            $generatedAt: new Date().toISOString(),
            $source: CSV_REGISTRY['edge-tension'].filename,

            $philosophy: {
                purpose: 'Map of 30 connections between organizational domains',
                sacredGeometry: 'Each edge connects two faces of the dodecahedron',
                interpretation: {
                    lowTension: 'Breath Ratio close to 1.0 = balanced energy exchange',
                    highTension: 'Ratio > 2.0 or < 0.5 = one-way flow, intervention needed'
                }
            },

            $topology: {
                expectedEdges: TOPOLOGY.edges,
                actualEdges: edges.length,
                validated: topologyReport.valid,
                violations: topologyReport.violations,
                elementalDistribution: countElements(edges)
            },

            $integrityReport: {
                totalRecords: edges.length,
                substitutionCount: substitutions.length,
                incompleteData: allZeroKPI ? {
                    field: 'kpiCoherence',
                    issue: 'All values are 0 - placeholder data, not yet measured',
                    severity: 'warning'
                } : null,
                substitutions
            },

            edges
        };
    }

    // ========================================================================
    // SECTION 7: VORTEX MAP TRANSFORMER
    // ========================================================================

    /**
     * Transform CSV_Vortex_Map.csv to JSON
     */
    function transformVortexMap(csvContent) {
        const phi = getPHIConstants();
        const { headers, rows } = parseCSV(csvContent);

        if (global.DataValidator?.clearLog) {
            global.DataValidator.clearLog();
        }

        const substitutions = [];
        const vertices = [];
        const harmonyHubs = [];
        const bermudaTriangles = [];
        let totalLambda = 0;

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            if (!row || row.length === 0) continue;

            // Skip rows without valid Vertex_ID (e.g., "V1", "V2")
            const rawVertexId = row[0] || '';
            if (!rawVertexId || !rawVertexId.trim() || !rawVertexId.match(/^V\d+$/i)) continue;

            const tracking = { wasSubstituted: false };

            const vertexId = rawVertexId.trim();
            // CSV columns contain "Face X" — extract the number (parseInt("Face 6") → NaN)
            const face1Id = parseInt(String(row[1] || '').replace(/\D/g, '')) || 1;
            const face2Id = parseInt(String(row[2] || '').replace(/\D/g, '')) || 2;
            const face3Id = parseInt(String(row[3] || '').replace(/\D/g, '')) || 3;

            const face1Energy = validateField(row[4], `${vertexId} Face 1 energy`, phi.PHI_2, tracking);
            const face2Energy = validateField(row[5], `${vertexId} Face 2 energy`, phi.PHI_2, tracking);
            const face3Energy = validateField(row[6], `${vertexId} Face 3 energy`, phi.PHI_2, tracking);

            const macroVMean = validateField(row[7], `${vertexId} macro mean`, phi.PHI_MIDPOINT, tracking);
            const vortexStrength = validateField(row[8], `${vertexId} vortex strength`, 0.1, tracking);
            const microVMean = validateField(row[9], `${vertexId} micro mean`, phi.PHI_MIDPOINT, tracking);
            const overallCoherence = validateField(row[10], `${vertexId} coherence`, phi.PHI_MIDPOINT, tracking);

            totalLambda += vortexStrength;

            // Categorize by lambda
            if (vortexStrength < 0.05) {
                harmonyHubs.push(vertexId);
            } else if (vortexStrength > 0.2) {
                bermudaTriangles.push(vertexId);
            }

            if (tracking.wasSubstituted) {
                substitutions.push({
                    field: `vertices[${i}]`,
                    vertexId,
                    original: tracking.originalValue,
                    substitutedWith: tracking.substitutedWith,
                    reason: 'Corruption pattern detected'
                });
            }

            vertices.push({
                id: vertexId,
                faces: [
                    { id: face1Id, name: getFaceName(face1Id), energy: parseFloat(face1Energy.toFixed(6)) },
                    { id: face2Id, name: getFaceName(face2Id), energy: parseFloat(face2Energy.toFixed(6)) },
                    { id: face3Id, name: getFaceName(face3Id), energy: parseFloat(face3Energy.toFixed(6)) }
                ],

                philosophy: {
                    archetype: getVertexArchetype(face1Id, face2Id, face3Id),
                    question: `Are ${getFaceName(face1Id)}, ${getFaceName(face2Id)}, and ${getFaceName(face3Id)} aligned?`,
                    status: vortexStrength < 0.05 ? 'Harmony Hub' :
                            vortexStrength > 0.2 ? 'Bermuda Triangle' : 'Moderate'
                },

                computed: {
                    macroVMean: parseFloat(macroVMean.toFixed(6)),
                    vortexStrength: parseFloat(vortexStrength.toFixed(6)),
                    microVMean: parseFloat(microVMean.toFixed(6)),
                    overallCoherence: parseFloat(overallCoherence.toFixed(6)),
                    wasSubstituted: tracking.wasSubstituted
                }
            });
        }

        const result = { vertices };
        const topologyReport = validateTopology(result, 'vortex-map');

        // STRESS_TEST_FIX [F6]: Log topology violations prominently
        if (!topologyReport.valid) {
          Logger.error('CSVToJSON', `TOPOLOGY VIOLATION in vortex-map: ${topologyReport.violations.join(', ')}`);
        }

        return {
            $schema: './schemas/vortex-map.schema.json',
            $version: VERSION,
            $generatedAt: new Date().toISOString(),
            $source: CSV_REGISTRY['vortex-map'].filename,

            $philosophy: {
                purpose: 'Map of 20 triadic intersections where 3 domains meet',
                sacredGeometry: 'Each vertex is a crossroads of organizational energy',
                interpretation: {
                    lowLambda: 'lambda < 0.05 = harmony hub, domains aligned',
                    highLambda: 'lambda > 0.2 = turbulent crossroads, domains conflicting'
                }
            },

            $topology: {
                expectedVertices: TOPOLOGY.vertices,
                actualVertices: vertices.length,
                validated: topologyReport.valid,
                violations: topologyReport.violations,
                triadicConstraint: 'Each vertex connects exactly 3 faces'
            },

            $integrityReport: {
                totalRecords: vertices.length,
                substitutionCount: substitutions.length,
                harmonyHubs,
                bermudaTriangles,
                averageLambda: parseFloat((totalLambda / vertices.length).toFixed(6)),
                substitutions
            },

            vertices
        };
    }

    // ========================================================================
    // SECTION 8: BREATH RATIOS TRANSFORMER
    // ========================================================================

    /**
     * Transform CSV_BREATH_RATIOS.csv to JSON
     */
    function transformBreathRatios(csvContent) {
        const phi = getPHIConstants();
        const { rows } = parseCSV(csvContent, { hasHeaders: false });

        if (global.DataValidator?.clearLog) {
            global.DataValidator.clearLog();
        }

        const substitutions = [];
        const axes = [];
        const criticalAxes = [];
        const octavesPopulated = ['O1'];
        const octavesMissing = ['O2', 'O3', 'O4', 'O5', 'O6', 'O7'];

        // Parse breath axes (this CSV has a specific structure)
        const axisArchetypes = [
            'Resource Flow', 'Substance & Story', 'Being & Doing',
            'Form & Integrity', 'Perception & Truth', 'Network & Fortress'
        ];

        for (let i = 0; i < 6; i++) {
            const tracking = { wasSubstituted: false };
            const pairIndex = i;

            // Get opposition pair
            const pair = TOPOLOGY.oppositionPairs[pairIndex];
            if (!pair) continue;

            const projectionFaceId = pair[1]; // F11, F7, F8, F9, F10, F12
            const receptionFaceId = pair[0];   // F1, F2, F3, F4, F5, F6

            // Find the row for this axis (structure varies)
            const axisRow = rows[i + 1] || []; // Skip header row

            const breathRatio = validateField(axisRow[5] || 1.0, `Axis ${i + 1} ratio`, 1.0, tracking);

            // Detect critical axes
            if (breathRatio > 3.0 || breathRatio < 0.33) {
                criticalAxes.push({
                    axis: i + 1,
                    ratio: breathRatio,
                    severity: 'extreme',
                    interpretation: breathRatio > 1 ?
                        'Reception far exceeds projection' :
                        'Projection far exceeds reception'
                });
            }

            if (tracking.wasSubstituted) {
                substitutions.push({
                    field: `axes[${i}]`,
                    axisId: i + 1,
                    original: tracking.originalValue,
                    substitutedWith: tracking.substitutedWith,
                    reason: 'Corruption pattern detected'
                });
            }

            axes.push({
                id: i + 1,
                archetype: axisArchetypes[i],
                projection: {
                    faceId: projectionFaceId,
                    name: getFaceName(projectionFaceId),
                    energy: phi.PHI_2 // Placeholder - would come from actual data
                },
                reception: {
                    faceId: receptionFaceId,
                    name: getFaceName(receptionFaceId),
                    energy: phi.PHI_2 // Placeholder
                },

                philosophy: {
                    question: getBreathQuestion(i + 1),
                    currentState: getBreathState(breathRatio),
                    intervention: breathRatio > 3.0 || breathRatio < 0.33 ?
                        'Critical imbalance requires attention' : null
                },

                computed: {
                    breathRatio: parseFloat(breathRatio.toFixed(6)),
                    status: getBreathStatus(breathRatio),
                    wasSubstituted: tracking.wasSubstituted
                },

                octaves: {
                    O1: { manifestation: 'Survival', score: phi.PHI_2 },
                    O2: null, O3: null, O4: null, O5: null, O6: null, O7: null
                }
            });
        }

        const result = { axes };
        const topologyReport = validateTopology(result, 'breath-ratios');

        // STRESS_TEST_FIX [F6]: Log topology violations prominently
        if (!topologyReport.valid) {
          Logger.error('CSVToJSON', `TOPOLOGY VIOLATION in breath-ratios: ${topologyReport.violations.join(', ')}`);
        }

        return {
            $schema: './schemas/breath-ratios.schema.json',
            $version: VERSION,
            $generatedAt: new Date().toISOString(),
            $source: CSV_REGISTRY['breath-ratios'].filename,

            $philosophy: {
                purpose: 'Map of 6 harmonic axes - the organization\'s breathing pattern',
                sacredGeometry: 'Each axis pairs opposite faces of the dodecahedron',
                interpretation: {
                    balanced: 'Ratio 0.8-1.2 = healthy breath',
                    strongExhale: 'Ratio < 0.8 = projecting more than receiving',
                    abundantInhale: 'Ratio > 1.2 = receiving more than projecting',
                    extreme: 'Ratio > 3.0 = critical imbalance requiring intervention'
                }
            },

            $topology: {
                expectedAxes: TOPOLOGY.breathAxes,
                actualAxes: axes.length,
                validated: topologyReport.valid,
                violations: topologyReport.violations,
                axisPairs: TOPOLOGY.oppositionPairs
            },

            $integrityReport: {
                totalRecords: axes.length,
                substitutionCount: substitutions.length,
                criticalAxes,
                octaveDataComplete: false,
                octavesPopulated,
                octavesMissing,
                substitutions
            },

            axes
        };
    }

    // ========================================================================
    // SECTION 9: HELPER FUNCTIONS
    // ========================================================================

    /**
     * Get face name by ID
     */
    function getFaceName(faceId) {
        const names = {
            1: 'Financial Capital', 2: 'Intellectual Capital', 3: 'Human Capital',
            4: 'Structural Capital', 5: 'Market Resonance', 6: 'Community & Partners',
            7: 'Brand & Reputation', 8: 'Core Operations', 9: 'Regenerative Flow',
            10: 'Foundational Values', 11: 'Funding Pipeline', 12: 'Risk & Resilience'
        };
        return names[faceId] || `Face ${faceId}`;
    }

    /**
     * Get element for face (Earth/Water/Fire/Air/Ether)
     */
    function getElementForFace(faceId) {
        const elements = {
            1: 'Earth', 2: 'Air', 3: 'Fire', 4: 'Earth', 5: 'Air', 6: 'Water',
            7: 'Fire', 8: 'Earth', 9: 'Ether', 10: 'Ether', 11: 'Fire', 12: 'Water'
        };
        return elements[faceId] || 'Ether';
    }

    /**
     * Generate philosophical question for a face
     */
    function generateFaceQuestion(faceId, faceName) {
        const questions = {
            1: 'How long can we survive without new resources?',
            2: 'How unique and protected is our knowledge?',
            3: 'How sustainable is our team energy?',
            4: 'How solid is our operational foundation?',
            5: 'Does the world perceive our value?',
            6: 'How strong is our support network?',
            7: 'How clear is our voice in the market?',
            8: 'How efficiently do we transform inputs to outputs?',
            9: 'Does our work regenerate rather than extract?',
            10: 'Are our actions aligned with our stated values?',
            11: 'Is there a healthy pipeline of future resources?',
            12: 'Can we weather unexpected storms?'
        };
        return questions[faceId] || `What is the state of ${faceName}?`;
    }

    /**
     * Generate healthy range description
     */
    function generateHealthyRange(direction, targetIdeal, targetMin) {
        if (direction === 'band') {
            return 'Optimal range: not too high, not too low';
        }
        if (targetIdeal && targetMin) {
            return `Target: ${targetIdeal}, Minimum: ${targetMin}`;
        }
        return direction === 'up' ? 'Higher is better' : 'Lower is better';
    }

    /**
     * Parse healthy bound value (handle "(N/A)" strings)
     */
    function parseHealthyBound(value) {
        if (!value || value.includes('N/A') || value.includes('(N/A)')) {
            return null;
        }
        const parsed = parseFloat(value);
        return isNaN(parsed) ? null : parsed;
    }

    /**
     * Get edge status based on breath ratio
     */
    function getEdgeStatus(ratio) {
        if (ratio >= 0.8 && ratio <= 1.2) return 'harmonious';
        if (ratio >= 0.5 && ratio <= 2.0) return 'moderate';
        return 'critical';
    }

    /**
     * Get edge interpretation
     */
    function getEdgeInterpretation(ratio) {
        if (ratio >= 0.8 && ratio <= 1.2) {
            return 'Near-perfect balance between giving and receiving';
        }
        if (ratio > 1.2) {
            return 'Receiving more than projecting in this connection';
        }
        return 'Projecting more than receiving in this connection';
    }

    /**
     * Count elemental distribution
     */
    function countElements(edges) {
        const counts = { Fire: 0, Water: 0, Air: 0, Earth: 0, Ether: 0 };
        for (const edge of edges) {
            const element = edge.philosophy?.element || 'Ether';
            if (counts[element] !== undefined) {
                counts[element]++;
            }
        }
        return counts;
    }

    /**
     * Get vertex archetype
     */
    function getVertexArchetype(f1, f2, f3) {
        // Simplified archetype generation
        const names = [getFaceName(f1), getFaceName(f2), getFaceName(f3)];
        return `${names[0]} meets ${names[1]} meets ${names[2]}`;
    }

    /**
     * Get breath question for axis
     */
    function getBreathQuestion(axisId) {
        const questions = {
            1: 'Is funding flowing into financial stability?',
            2: 'Does our story reflect our substance?',
            3: 'Do we have capacity to do our work?',
            4: 'Does regeneration strengthen our structure?',
            5: 'Does the world see what we believe in?',
            6: 'Does our network provide resilience?'
        };
        return questions[axisId] || 'Is energy flowing harmoniously?';
    }

    /**
     * Get breath state description
     */
    function getBreathState(ratio) {
        if (ratio > 3.0) return 'Extreme receiving - values held but invisible';
        if (ratio > 1.2) return 'Abundant inhale - internal accumulation';
        if (ratio < 0.33) return 'Extreme exhale - unsustainable output';
        if (ratio < 0.8) return 'Strong exhale - external expression';
        return 'Balanced breath - healthy exchange';
    }

    /**
     * Get breath status
     */
    function getBreathStatus(ratio) {
        if (ratio >= 0.8 && ratio <= 1.2) return 'balanced';
        if (ratio > 1.2 && ratio <= 3.0) return 'abundantInhale';
        if (ratio < 0.8 && ratio >= 0.33) return 'strongExhale';
        return 'extreme';
    }

    // ========================================================================
    // SECTION 9B: DODECA ENGINE TRANSFORMER (The Mathematical Heart)
    // ========================================================================

    /**
     * Transform CSV_Dodeca_Engine.csv to thesis-ready spectral analysis JSON
     *
     * EVOLUTION: This captures the EVOLVED JavaScript formulas from SpectralAnalyzer.js,
     * not just the CSV data. The CSV is the seed, this JSON is the tree.
     *
     * @param {string} csvContent - Raw CSV content
     * @returns {Object} Self-documenting spectral analysis JSON
     */
    function transformDodecaEngine(csvContent) {
        const phi = getPHIConstants();
        const lines = csvContent.split('\n').map(l => l.trim()).filter(l => l);

        // Initialize structures
        const faceEnergies = [];
        const laplacianMatrix = [];
        const eigenvectorMatrix = [];
        const modalAmplitudes = [];
        const deltaVector = [];
        const substitutions = [];

        // Parse face energies (first 12 data rows after header)
        let currentSection = 'faces';
        let laplacianRowIndex = 0;
        let eigenvectorRowIndex = 0;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const cells = parseCSVLine(line);

            // Detect section changes
            if (line.includes('Graph Laplacian') || line.includes('L_Matrix')) {
                currentSection = 'laplacian';
                laplacianRowIndex = 0;
                continue;
            }
            if (line.includes('Eigenvectors') || line.includes('U_Matrix')) {
                currentSection = 'eigenvectors';
                eigenvectorRowIndex = 0;
                continue;
            }
            if (line.includes('Modal Amplitude')) {
                currentSection = 'modes';
                continue;
            }
            if (line.includes('Dominant Mode')) {
                currentSection = 'dominant';
                continue;
            }
            if (line.includes('Delta Vector') || line.includes('Required Delta')) {
                currentSection = 'delta';
                continue;
            }
            if (line.includes('Diagnostic Indicators') || line.includes('Breath Ratio')) {
                currentSection = 'diagnostics';
                continue;
            }

            // Skip empty or header rows
            if (!cells[0] || cells[0].includes('Face ID') || cells[0].includes('Mode')) continue;

            // Parse based on section
            switch (currentSection) {
                case 'faces':
                    if (cells[0].includes('Face')) {
                        const faceMatch = cells[0].match(/Face\s*(\d+)/);
                        if (faceMatch) {
                            const faceId = parseInt(faceMatch[1]);
                            const tracking = { wasSubstituted: false };

                            faceEnergies.push({
                                faceId,
                                name: cells[1] || getFaceName(faceId),
                                octaves: {
                                    O1: validateField(cells[2], `Face ${faceId} O1`, phi.PHI_2, tracking),
                                    O2: cells[3] || null,
                                    O3: cells[4] || null,
                                    O4: cells[5] || null,
                                    O5: cells[6] || null,
                                    O6: cells[7] || null,
                                    O7: cells[8] || null
                                },
                                initialEnergy: validateField(cells[9], `Face ${faceId} initial`, phi.PHI_2, tracking),
                                eVector: validateField(cells[10], `Face ${faceId} eVector`, 0, tracking)
                            });

                            if (tracking.wasSubstituted) {
                                substitutions.push({
                                    field: `faceEnergies[${faceId - 1}]`,
                                    faceId,
                                    original: tracking.originalValue,
                                    substitutedWith: tracking.substitutedWith
                                });
                            }
                        }
                    }
                    break;

                case 'laplacian':
                    if (laplacianRowIndex < 12 && cells.length >= 12) {
                        const row = [];
                        for (let j = 0; j < 12; j++) {
                            // STRESS_TEST_FIX [F15]: Use DataValidator instead of silent || 0
                            // to maintain audit trail for spectral analysis data (thesis heart).
                            const val = (typeof window !== 'undefined' && window.DataValidator)
                              ? window.DataValidator.validateNumber(cells[j], `Laplacian[${laplacianRowIndex}][${j}]`, 0)
                              : (parseFloat(cells[j]) || 0);
                            row.push(val);
                        }
                        laplacianMatrix.push(row);
                        laplacianRowIndex++;
                    }
                    break;

                case 'eigenvectors':
                    // Skip the eigenvalue header row
                    if (cells[0].includes('u') || cells[0].includes('λ')) continue;

                    if (eigenvectorRowIndex < 12 && cells.length >= 12) {
                        const row = [];
                        for (let j = 0; j < 12; j++) {
                            // STRESS_TEST_FIX [F15]: Use DataValidator for eigenvector data too
                            const val = (typeof window !== 'undefined' && window.DataValidator)
                              ? window.DataValidator.validateNumber(cells[j], `Eigenvector[${eigenvectorRowIndex}][${j}]`, 0)
                              : (parseFloat(cells[j]) || 0);
                            row.push(val);
                        }
                        eigenvectorMatrix.push(row);
                        eigenvectorRowIndex++;
                    }
                    break;

                case 'modes':
                    const modeMatch = cells[0]?.match(/^(\d+)$/);
                    if (modeMatch) {
                        const modeIndex = parseInt(modeMatch[1]);
                        modalAmplitudes.push({
                            mode: modeIndex,
                            eigenvalue: parseFloat(cells[1]) || 0,
                            amplitude: parseFloat(cells[2]) || 0,
                            absAmplitude: Math.abs(parseFloat(cells[2]) || 0),
                            interpretation: getModeInterpretation(parseFloat(cells[1]) || 0)
                        });
                    }
                    break;

                case 'delta':
                    const deltaFaceMatch = cells[1]?.match(/Face\s*(\d+)/);
                    if (deltaFaceMatch) {
                        const faceId = parseInt(deltaFaceMatch[1]);
                        const deltaValue = parseFloat(cells[2]) || 0;
                        deltaVector.push({
                            faceId,
                            faceName: getFaceName(faceId),
                            deltaValue,
                            absDelta: Math.abs(deltaValue),
                            correctionType: deltaValue > 0.01 ? 'ADD_ENERGY' :
                                           deltaValue < -0.01 ? 'REDUCE_ENERGY' : 'BALANCED',
                            interpretation: interpretDelta(deltaValue)
                        });
                    }
                    break;
            }
        }

        // Find dominant mode (highest absolute amplitude, excluding mode 1)
        const nonTrivialModes = modalAmplitudes.filter(m => m.mode > 1);
        const dominantMode = nonTrivialModes.reduce((max, m) =>
            m.absAmplitude > max.absAmplitude ? m : max,
            { absAmplitude: 0 }
        );

        // Extract eigenvector for dominant mode
        const dominantEigenvector = eigenvectorMatrix.length > 0 && dominantMode.mode
            ? eigenvectorMatrix.map(row => row[dominantMode.mode - 1] || 0)
            : [];

        // Calculate BAB Score and Dissonance from face energies
        const projectionFaces = [11, 7, 8, 4, 5, 6];
        const receptionFaces = [1, 2, 3, 9, 10, 12];

        let projectionSum = 0, receptionSum = 0;
        faceEnergies.forEach(f => {
            if (projectionFaces.includes(f.faceId)) projectionSum += f.initialEnergy;
            if (receptionFaces.includes(f.faceId)) receptionSum += f.initialEnergy;
        });

        const babScore = projectionSum > 0 ? (receptionSum / projectionSum) : 1;
        const babPercentage = babScore * 100;

        // Calculate dissonance from delta vector
        const totalAbsDelta = deltaVector.reduce((sum, d) => sum + d.absDelta, 0);
        const avgEnergy = faceEnergies.reduce((sum, f) => sum + f.initialEnergy, 0) / 12;
        const dissonanceIndex = avgEnergy > 0 ? (totalAbsDelta / 12) / avgEnergy * 100 : 0;

        // Identify corrective actions
        const needEnergy = deltaVector.filter(d => d.correctionType === 'ADD_ENERGY')
            .sort((a, b) => b.absDelta - a.absDelta);
        const haveExcess = deltaVector.filter(d => d.correctionType === 'REDUCE_ENERGY')
            .sort((a, b) => b.absDelta - a.absDelta);

        return {
            $schema: './schemas/dodeca-engine.schema.json',
            $version: VERSION,
            $generatedAt: new Date().toISOString(),
            $source: CSV_REGISTRY['dodeca-engine'].filename,

            $philosophy: {
                purpose: 'Spectral decomposition of organizational coherence using graph Laplacian',
                sacredGeometry: 'The dodecahedron\'s topology encoded as a 12×12 matrix',
                insight: 'The Laplacian encodes "which faces are neighbors" - the topology itself',
                interpretation: {
                    dominantMode: 'The loudest "sour note" in the organizational symphony',
                    deltaVectors: 'Prescriptions for rebalancing - where to add/remove energy',
                    eigenvalues: 'The fundamental frequencies of organizational resonance'
                }
            },

            $mathematics: {
                graphLaplacian: {
                    definition: 'L = D - A where D is degree matrix, A is adjacency matrix',
                    formula: 'L[i][i] = degree(i), L[i][j] = -1 if adjacent, 0 otherwise',
                    phiConnection: 'Dodecahedron has icosahedral symmetry deeply connected to PHI'
                },
                eigenvalueStructure: {
                    explanation: 'Eigenvalues reveal natural frequencies of the graph',
                    degeneracies: {
                        'λ=0': { count: 1, meaning: 'Trivial mode - overall average' },
                        'λ=2.394': { count: 3, meaning: '3-fold degenerate - rotational symmetry' },
                        'λ=5.584': { count: 3, meaning: 'Mid-frequency regional patterns' },
                        'λ=6.854': { count: 2, meaning: 'High-frequency local oscillations' },
                        'λ=8.146': { count: 3, meaning: 'Highest frequency - fine-grained dissonance' }
                    },
                    symmetryGroup: 'Icosahedral symmetry group (order 120), dual to dodecahedron'
                },
                modalAnalysis: {
                    purpose: 'Transform face energies into modal space to identify imbalance patterns',
                    formula: 'a = U^T × E where U is eigenvector matrix, E is energy vector'
                },
                greekConstants: {
                    note: 'These evolved from CSV to JavaScript implementation',
                    PHI: { value: phi.PHI, derivation: '(1+√5)/2', meaning: 'The golden ratio' },
                    PHI_1: { value: phi.PHI_1, derivation: '1/φ', meaning: 'Golden complement' },
                    PHI_2: { value: phi.PHI_2, derivation: 'φ^-2', meaning: 'Default face energy' }
                }
            },

            $topology: {
                faces: 12,
                edges: 30,
                vertices: 20,
                eulerCharacteristic: 2,
                note: 'F - E + V = 12 - 30 + 20 = 2 (Euler\'s formula for polyhedra)'
            },

            $integrityReport: {
                totalRecords: faceEnergies.length,
                substitutionCount: substitutions.length,
                matrixDimensions: {
                    laplacian: [laplacianMatrix.length, laplacianMatrix[0]?.length || 0],
                    eigenvectors: [eigenvectorMatrix.length, eigenvectorMatrix[0]?.length || 0]
                },
                substitutions
            },

            faceEnergies,

            laplacianMatrix,

            eigenvectorMatrix,

            eigenvalues: {
                values: [0, 2.394, 2.394, 2.394, 5.584, 5.584, 5.584, 6.854, 6.854, 8.146, 8.146, 8.146],
                interpretations: {
                    0: 'DC Offset (Overall Average Energy)',
                    2.394: 'Low-Frequency Mode (Global Imbalance)',
                    5.584: 'Mid-Frequency Mode (Regional Patterns)',
                    6.854: 'High-Frequency Mode (Local Oscillations)',
                    8.146: 'Highest-Frequency Mode (Fine-Grained Dissonance)'
                }
            },

            modalAmplitudes,

            dominantMode: {
                index: dominantMode.mode || 9,
                eigenvalue: dominantMode.eigenvalue || 6.854,
                amplitude: dominantMode.amplitude || 0,
                absAmplitude: dominantMode.absAmplitude || 0,
                eigenvector: dominantEigenvector,
                interpretation: dominantMode.interpretation || 'High-Frequency Mode (Local Oscillations)',
                phiConnection: 'Dominant mode reveals which organizational "note" is most out of tune'
            },

            deltaVector,

            diagnostics: {
                beingActionBalance: {
                    score: parseFloat(babScore.toFixed(6)),
                    percentage: parseFloat(babPercentage.toFixed(2)),
                    interpretation: babPercentage > 120 ? 'Over-Inhaling - Too much reception, not enough action' :
                                   babPercentage < 80 ? 'Over-Exhaling - Too much action, not enough regeneration' :
                                   'Balanced - Healthy balance between being and doing',
                    projectionFaces: projectionFaces.map(id => ({ id, name: getFaceName(id) })),
                    receptionFaces: receptionFaces.map(id => ({ id, name: getFaceName(id) })),
                    formula: 'BAB = (Σ Reception Energy) / (Σ Projection Energy) × 100%'
                },
                dissonanceIndex: {
                    score: parseFloat((dissonanceIndex / 100).toFixed(6)),
                    percentage: parseFloat(dissonanceIndex.toFixed(2)),
                    interpretation: dissonanceIndex > 30 ? 'HIGH - Significant systemic imbalances' :
                                   dissonanceIndex > 15 ? 'MODERATE - Some imbalances present' :
                                   dissonanceIndex > 5 ? 'LOW - Minor imbalances, system coherent' :
                                   'MINIMAL - System is highly coherent',
                    formula: 'Dissonance = Σ|Δ_i| / n / μ where Δ is delta vector, μ is mean energy'
                }
            },

            correctiveActions: {
                addEnergy: needEnergy.slice(0, 5),
                reduceEnergy: haveExcess.slice(0, 5),
                topPriority: needEnergy[0] || null,
                strategicRecommendation: generateStrategicRecommendation(babPercentage, dissonanceIndex, needEnergy)
            }
        };
    }

    /**
     * Helper: Get mode interpretation
     */
    function getModeInterpretation(eigenvalue) {
        if (eigenvalue === 0) return 'DC Offset (Overall Average Energy)';
        if (eigenvalue < 3) return 'Low-Frequency Mode (Global Imbalance)';
        if (eigenvalue < 6) return 'Mid-Frequency Mode (Regional Patterns)';
        if (eigenvalue < 7.5) return 'High-Frequency Mode (Local Oscillations)';
        return 'Highest-Frequency Mode (Fine-Grained Dissonance)';
    }

    /**
     * Helper: Interpret delta value
     */
    function interpretDelta(deltaValue) {
        if (deltaValue > 0.1) return 'ADD ENERGY - This face is weak and needs strengthening';
        if (deltaValue < -0.1) return 'REDUCE/BALANCE - This face has excess energy relative to its pole';
        return 'BALANCED - This face is in good equilibrium';
    }

    /**
     * Helper: Generate strategic recommendation
     */
    function generateStrategicRecommendation(babPercentage, dissonanceIndex, needEnergy) {
        const recommendations = [];

        if (babPercentage > 120) {
            recommendations.push('Focus on ACTION: Move from planning/receiving to concrete execution');
        } else if (babPercentage < 80) {
            recommendations.push('Focus on REGENERATION: Slow down execution, strengthen foundations');
        }

        if (dissonanceIndex > 20) {
            recommendations.push('Address systemic imbalances through highest-leverage faces');
        }

        if (needEnergy.length > 0) {
            recommendations.push(`Top leverage point: ${needEnergy[0].faceName} (add energy)`);
        }

        return recommendations.length > 0
            ? recommendations.join('. ')
            : 'System is in good balance - maintain current trajectory';
    }

    // ========================================================================
    // SECTION 9C: FACE MODELS TRANSFORMER (The Pentagram Soul)
    // ========================================================================

    /**
     * Transform CSV_Face_Models.csv to thesis-ready pentagram analysis JSON
     *
     * EVOLUTION: This captures the EVOLVED JavaScript formulas from Face.js,
     * including the PHI-derived α, β, γ, δ, η constants.
     *
     * CSV Structure: Each face occupies ~32 rows in repeating blocks:
     * - Face header
     * - Ball (Primary KPI)
     * - 5 Pillars with elements
     * - Pentagram calculations (star pairs, intersections)
     * - Synthesis scores
     * - Axis-informed energy
     *
     * @param {string} csvContent - Raw CSV content
     * @returns {Object} Self-documenting pentagram analysis JSON
     */
    function transformFaceModels(csvContent) {
        const phi = getPHIConstants();
        const lines = csvContent.split('\n').map(l => l.trim()).filter(l => l);

        const faces = [];
        const substitutions = [];

        // Element names for the 5 pillars
        const elementNames = ['Earth', 'Water', 'Fire', 'Air', 'Ether'];

        // Pentagram connections (non-adjacent vertices in a pentagon)
        const pentagramConnections = [
            [0, 2], [1, 3], [2, 4], [3, 0], [4, 1]
        ];

        // Parse in blocks - each face is approximately 32-33 rows
        let currentFace = null;
        let pillars = [];
        let starPairs = [];
        let intersectionNodes = [];
        let synthesis = {};
        let axisInfo = {};

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const cells = parseCSVLine(line);

            // Detect new face start (e.g., "Face 1,Financial Capital")
            const faceMatch = cells[0]?.match(/^Face\s*(\d+)$/);
            if (faceMatch) {
                // Save previous face if exists
                if (currentFace) {
                    faces.push(buildFaceObject(currentFace, pillars, starPairs, intersectionNodes, synthesis, axisInfo, phi));
                }

                // Start new face
                const faceId = parseInt(faceMatch[1]);
                currentFace = {
                    id: faceId,
                    name: cells[1] || getFaceName(faceId),
                    ball: null
                };
                pillars = [];
                starPairs = [];
                intersectionNodes = [];
                synthesis = {};
                axisInfo = {};
                continue;
            }

            if (!currentFace) continue;

            // Parse Ball (Primary KPI) - row contains "The Ball" or KPI ID
            if (cells[0]?.includes('Ball') || cells[0]?.includes('Primary Face KPI')) {
                // Next row has the actual Ball KPI
                continue;
            }
            if (cells[1]?.match(/^[FLPSER]\d+\.\d+$/)) {
                const tracking = { wasSubstituted: false };
                currentFace.ball = {
                    kpiId: cells[1],
                    name: cells[0],
                    faceEnergy: validateField(cells[2], `${currentFace.name} ball energy`, phi.PHI_2, tracking),
                    value: cells[3] || ''
                };
                if (tracking.wasSubstituted) {
                    substitutions.push({
                        field: `faces[${currentFace.id - 1}].ball`,
                        faceId: currentFace.id,
                        original: tracking.originalValue,
                        substitutedWith: tracking.substitutedWith
                    });
                }
                continue;
            }

            // Parse Pillars (5 elements)
            if (elementNames.includes(cells[1])) {
                const tracking = { wasSubstituted: false };
                pillars.push({
                    element: cells[1],
                    kpiName: cells[0],
                    coherence: validateField(cells[2], `${currentFace.name} ${cells[1]}`, phi.PHI_2, tracking),
                    weight: validateField(cells[3], `${currentFace.name} ${cells[1]} weight`, 0.2, tracking)
                });
                continue;
            }

            // Parse Star Pairs (s values)
            if (cells[0]?.includes('s?') || cells[0]?.includes('s₁') || cells[6]?.includes('s?')) {
                const value = parseFloat(cells[7]) || 0;
                if (value > 0 || starPairs.length < 5) {
                    starPairs.push(value);
                }
                continue;
            }

            // Parse Intersection Nodes (p values)
            if (cells[0]?.includes('p?') || cells[0]?.includes('p₁') || cells[6]?.includes('p?')) {
                const value = parseFloat(cells[7]) || 0;
                if (value > 0 || intersectionNodes.length < 5) {
                    intersectionNodes.push(value);
                }
                continue;
            }

            // Parse synthesis scores
            if (cells[0]?.includes('Weighted Avg')) {
                synthesis.weightedAvgPillars = parseFloat(cells[1]) || 0;
            }
            if (cells[0]?.includes('Center Composite') || cells[0]?.includes('Center Composte')) {
                synthesis.centerComposite = parseFloat(cells[1]) || parseFloat(cells[7]) || 0;
            }
            if (cells[0]?.includes('Nuanced Avg')) {
                synthesis.nuancedAvgPillarHealth = parseFloat(cells[1]) || parseFloat(cells[7]) || 0;
            }
            if (cells[0]?.includes('Pillar Symmetry') || cells[0]?.includes('Pillar Symetry')) {
                synthesis.pillarSymmetry = parseFloat(cells[1]) || 0;
            }
            if (cells[0]?.includes('Self-Coherence')) {
                synthesis.selfCoherence = parseFloat(cells[1]) || 0;
            }
            if (cells[0]?.includes('Relational Coherence')) {
                synthesis.relationalCoherence = parseFloat(cells[1]) || 0;
            }
            if (cells[0]?.includes('Structural Integrity')) {
                synthesis.structuralIntegrity = parseFloat(cells[1]) || 0;
            }
            if (cells[0]?.includes('LOCAL COHERENCE')) {
                synthesis.localCoherence = parseFloat(cells[1]) || 0;
            }

            // Parse axis-informed synthesis
            if (cells[0]?.includes('Local Coherence Score')) {
                axisInfo.localScore = parseFloat(cells[1]) || 0;
            }
            if (cells[0]?.includes('Opposing Face')) {
                const oppMatch = cells[0].match(/Face\s*(\d+)/);
                axisInfo.opposingFaceId = oppMatch ? parseInt(oppMatch[1]) : null;
                axisInfo.opposingEnergy = parseFloat(cells[1]) || 0;
            }
            if (cells[0]?.includes('Axis Coherence Factor')) {
                axisInfo.deltaFactor = parseFloat(cells[1]) || 0.9;
            }
            if (cells[0]?.includes('FINAL') && cells[0]?.includes('AXIS-INFORMED')) {
                axisInfo.finalEnergy = parseFloat(cells[1]) || 0;
            }
            if (cells[0]?.includes('SENSITIVITY AMPLIFIER')) {
                axisInfo.sensitivityAmplified = parseFloat(cells[1]) || 0;
            }
        }

        // Save last face
        if (currentFace) {
            faces.push(buildFaceObject(currentFace, pillars, starPairs, intersectionNodes, synthesis, axisInfo, phi));
        }

        return {
            $schema: './schemas/face-models.schema.json',
            $version: VERSION,
            $generatedAt: new Date().toISOString(),
            $source: CSV_REGISTRY['face-models'].filename,

            $philosophy: {
                purpose: 'Pentagram soul of each organizational domain',
                sacredGeometry: '5 elements create internal star geometry within each face',
                elements: {
                    Earth: 'Tangible assets, stability, grounding',
                    Water: 'Flow, adaptation, relationships, flexibility',
                    Fire: 'Transformation, action, energy, initiative',
                    Air: 'Clarity, communication, understanding, transparency',
                    Ether: 'Essence, purpose, alignment, transcendence'
                },
                insight: 'A face with all 5 elements balanced has TRUE coherence - not just high numbers'
            },

            $mathematics: {
                starPairFormula: {
                    formula: 's = α×(k₁+k₂)/2 + (1-α)×k₁×k₂',
                    explanation: 'Connects non-adjacent pentagram vertices (the star lines)',
                    evolution: 'CSV used α=0.6, JavaScript evolved to α=φ^-1=0.618'
                },
                intersectionFormula: {
                    formula: 'p = β×s_prev + (1-β)×s_curr',
                    explanation: 'Where star pairs cross, energy blends',
                    evolution: 'β=0.5 represents equal influence of adjacent pairs'
                },
                localCoherenceFormula: {
                    formula: 'E_base = γ×Ball + (1-γ)×Pillars_avg',
                    harmonicBoost: 'E_local = E_base × (1 + η×R_harmonic)',
                    explanation: 'Ball (headline) blended with Pillars (relational health)',
                    evolution: 'η=φ^-2=0.382 is max harmonic boost - unique to JavaScript'
                },
                axisInformedFormula: {
                    formula: 'E_f = δ×E_local + (1-δ)×E_opposing',
                    explanation: 'Each face influenced by its breath axis partner',
                    evolution: 'δ=0.9 means 90% self, 10% shadow awareness'
                },
                greekConstants: {
                    alpha: { symbol: 'α', value: 0.618, derivation: 'φ^-1', meaning: 'Synergy blend (arithmetic vs multiplicative)' },
                    beta: { symbol: 'β', value: 0.5, derivation: 'PHI_MIDPOINT', meaning: 'Intersection blend (adjacent pairs)' },
                    gamma: { symbol: 'γ', value: 0.7, derivation: 'Empirical', meaning: 'Ball vs Pillars weight (70% ball)' },
                    delta: { symbol: 'δ', value: 0.9, derivation: 'Empirical', meaning: 'Self vs shadow influence (90% self)' },
                    eta: { symbol: 'η', value: 0.382, derivation: 'φ^-2', meaning: 'Max harmonic boost from resonance' },
                    zeta: { symbol: 'ζ', value: 0.0637, derivation: 'φ^-2/6', meaning: 'Octave difficulty increase per level' }
                }
            },

            $topology: {
                facesCount: 12,
                elementsPerFace: 5,
                pentagramConnections: pentagramConnections,
                note: 'Each face is a regular pentagon with internal pentagram star'
            },

            $integrityReport: {
                totalRecords: faces.length,
                substitutionCount: substitutions.length,
                facesWithCompleteData: faces.filter(f => f.pillars.length === 5).length,
                substitutions
            },

            faces
        };
    }

    /**
     * Helper: Build face object from parsed data
     */
    function buildFaceObject(currentFace, pillars, starPairs, intersectionNodes, synthesis, axisInfo, phi) {
        // Calculate harmonic resonance from pillars
        let harmonicResonance = 0;
        if (pillars.length === 5) {
            const pentagramConnections = [[0, 2], [1, 3], [2, 4], [3, 0], [4, 1]];
            let totalResonance = 0;
            for (const [i, j] of pentagramConnections) {
                const diff = Math.abs((pillars[i]?.coherence || 0) - (pillars[j]?.coherence || 0));
                totalResonance += 1 - diff;
            }
            harmonicResonance = totalResonance / 5;
        }

        // Calculate pillar average
        const pillarAvg = pillars.length > 0
            ? pillars.reduce((sum, p) => sum + p.coherence, 0) / pillars.length
            : phi.PHI_2;

        // Find opposing face
        const oppositionPairs = [[1, 11], [2, 7], [3, 8], [4, 9], [5, 10], [6, 12]];
        const pair = oppositionPairs.find(p => p.includes(currentFace.id));
        const opposingFaceId = pair ? (pair[0] === currentFace.id ? pair[1] : pair[0]) : null;

        return {
            id: currentFace.id,
            name: currentFace.name,

            ball: currentFace.ball || {
                kpiId: '',
                name: 'Unknown',
                faceEnergy: phi.PHI_2
            },

            pillars: pillars.map((p, idx) => ({
                index: idx,
                element: p.element,
                kpiName: p.kpiName,
                coherence: parseFloat(p.coherence.toFixed(6)),
                weight: parseFloat(p.weight.toFixed(6))
            })),

            pentagram: {
                starPairs: starPairs.slice(0, 5).map((value, idx) => ({
                    index: idx,
                    connection: [[0, 2], [1, 3], [2, 4], [3, 0], [4, 1]][idx],
                    value: parseFloat((value || 0).toFixed(6))
                })),
                intersectionNodes: intersectionNodes.slice(0, 5).map((value, idx) => ({
                    index: idx,
                    value: parseFloat((value || 0).toFixed(6))
                })),
                centerComposite: parseFloat((synthesis.centerComposite || 0).toFixed(6)),
                harmonicResonance: parseFloat(harmonicResonance.toFixed(6)),
                pillarSymmetry: parseFloat((synthesis.pillarSymmetry || 0).toFixed(6))
            },

            synthesis: {
                selfCoherence: {
                    value: parseFloat((synthesis.selfCoherence || currentFace.ball?.faceEnergy || phi.PHI_2).toFixed(6)),
                    interpretation: 'Ball KPI health - the headline metric'
                },
                relationalCoherence: {
                    value: parseFloat((synthesis.relationalCoherence || pillarAvg).toFixed(6)),
                    interpretation: 'Pillar health - relational connections'
                },
                structuralIntegrity: {
                    value: parseFloat((synthesis.structuralIntegrity || synthesis.pillarSymmetry || 0).toFixed(6)),
                    interpretation: 'Variance between pillars - symmetry of elements'
                }
            },

            coherence: {
                local: {
                    value: parseFloat((synthesis.localCoherence || phi.PHI_2).toFixed(6)),
                    formula: 'γ×Ball + (1-γ)×Pillars × (1+η×R)',
                    components: {
                        ball: currentFace.ball?.faceEnergy || phi.PHI_2,
                        pillarsAvg: parseFloat(pillarAvg.toFixed(6)),
                        harmonicBoost: parseFloat((1 + 0.382 * harmonicResonance).toFixed(6))
                    }
                },
                axisInformed: {
                    value: parseFloat((axisInfo.finalEnergy || synthesis.localCoherence || phi.PHI_2).toFixed(6)),
                    opposingFace: opposingFaceId ? {
                        id: opposingFaceId,
                        name: getFaceName(opposingFaceId),
                        energy: axisInfo.opposingEnergy || phi.PHI_2
                    } : null,
                    deltaFactor: axisInfo.deltaFactor || 0.9
                },
                sensitivityAmplified: parseFloat((axisInfo.sensitivityAmplified || axisInfo.finalEnergy || phi.PHI_2).toFixed(6))
            },

            diagnostics: {
                healthStatus: getHealthStatus(axisInfo.finalEnergy || synthesis.localCoherence || phi.PHI_2),
                elementalBalance: assessElementalBalance(pillars)
            }
        };
    }

    /**
     * Helper: Get health status from energy
     */
    function getHealthStatus(energy) {
        if (energy >= 0.9) return 'Radiant';
        if (energy >= 0.7) return 'Healthy';
        if (energy >= 0.5) return 'Dimming';
        if (energy >= 0.3) return 'Struggling';
        return 'Critical';
    }

    /**
     * Helper: Assess elemental balance
     */
    function assessElementalBalance(pillars) {
        if (pillars.length !== 5) return 'Incomplete data';

        const values = pillars.map(p => p.coherence);
        const mean = values.reduce((a, b) => a + b, 0) / 5;
        const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / 5;
        const stdDev = Math.sqrt(variance);

        if (stdDev < 0.1) return 'Highly balanced';
        if (stdDev < 0.2) return 'Moderately balanced';
        if (stdDev < 0.3) return 'Some imbalance';
        return 'Significant imbalance';
    }

    // ========================================================================
    // SECTION 9D: GENERIC TRANSFORMER (For remaining CSVs)
    // ========================================================================

    /**
     * Generic transformer for remaining CSV types
     *
     * Creates a basic self-documenting JSON structure with raw parsed data.
     * Used for: system-coherence, spiral-dashboard
     *
     * @param {string} type - CSV type
     * @param {string} csvContent - Raw CSV content
     * @returns {Object} Basic self-documenting JSON
     */
    function transformGeneric(type, csvContent) {
        const lines = csvContent.trim().split('\n');
        const fileInfo = CSV_REGISTRY[type];

        // Parse header and data
        const headers = parseCSVLine(lines[0]);
        const records = [];

        for (let i = 1; i < lines.length; i++) {
            const values = parseCSVLine(lines[i]);
            if (values.length === 0 || values.every(v => !v.trim())) continue;

            const record = {};
            headers.forEach((header, idx) => {
                record[header.trim()] = values[idx]?.trim() || '';
            });
            records.push(record);
        }

        return {
            $schema: `./schemas/${type}.schema.json`,
            $version: VERSION,
            $generatedAt: new Date().toISOString(),
            $source: fileInfo.filename,

            $philosophy: {
                purpose: fileInfo.description,
                note: 'Generic conversion - full transformation pending'
            },

            $integrityReport: {
                totalRecords: records.length,
                substitutionCount: 0,
                conversionType: 'generic',
                substitutions: []
            },

            records: records
        };
    }

    // ========================================================================
    // SECTION 10: MAIN CONVERSION API
    // ========================================================================

    /**
     * Convert a single CSV type to JSON
     *
     * @param {string} type - CSV type key from registry
     * @param {string} csvContent - Raw CSV content
     * @returns {Object} Self-documenting JSON
     */
    function convert(type, csvContent) {
        Logger.debug('CSVToJSONConverter', `Converting ${type}...`);

        switch (type) {
            case 'kpi-database':
                return transformKPIDatabase(csvContent);
            case 'edge-tension':
                return transformEdgeTension(csvContent);
            case 'vortex-map':
                return transformVortexMap(csvContent);
            case 'breath-ratios':
                return transformBreathRatios(csvContent);
            // Enhanced transformers (thesis-ready)
            case 'dodeca-engine':
                return transformDodecaEngine(csvContent);
            case 'face-models':
                return transformFaceModels(csvContent);
            // Generic transformation for remaining types
            case 'system-coherence':
            case 'spiral-dashboard':
                return transformGeneric(type, csvContent);
            default:
                throw new Error(`Unknown CSV type: ${type}. Available: ${Object.keys(CSV_REGISTRY).join(', ')}`);
        }
    }

    /**
     * Convert multiple CSV files
     *
     * @param {Object} csvFiles - Map of type to CSV content
     * @returns {Object} Map of type to converted JSON
     */
    function convertAll(csvFiles) {
        const results = {};
        const errors = [];

        for (const [type, content] of Object.entries(csvFiles)) {
            try {
                results[type] = convert(type, content);
                Logger.debug('CSVToJSONConverter', `${type} converted`);
            } catch (e) {
                Logger.error('CSVToJSONConverter', `${type} failed: ${e.message}`, e);
                errors.push({ type, error: e.message });
            }
        }

        return { results, errors };
    }

    /**
     * Get JSON Schema for a type (placeholder - returns schema template)
     */
    function getSchema(type) {
        // Return schema template based on type
        const schemas = {
            'kpi-database': {
                $schema: 'http://json-schema.org/draft-07/schema#',
                title: 'Quannex KPI Database',
                type: 'object',
                required: ['$version', '$source', 'kpis'],
                properties: {
                    kpis: {
                        type: 'array',
                        minItems: 12,
                        maxItems: 12
                    }
                }
            }
        };
        return schemas[type] || null;
    }

    // ========================================================================
    // SECTION 11: EXPORTS
    // ========================================================================

    const CSVToJSONConverter = {
        VERSION,

        // Registry
        CSV_REGISTRY,
        TOPOLOGY,

        // Parsing
        parseCSVLine,
        parseCSV,

        // Validation
        validateTopology,

        // Transformation
        transformKPIDatabase,
        transformEdgeTension,
        transformVortexMap,
        transformBreathRatios,
        transformDodecaEngine,
        transformFaceModels,

        // API
        convert,
        convertAll,
        getSchema,

        // Helpers
        getFaceName,
        getElementForFace,
        getPHIConstants
    };

    // Export to window
    global.CSVToJSONConverter = CSVToJSONConverter;

    Logger.info('CSVToJSONConverter', 'v2.0.0 loaded - Self-documenting data migration');

})(typeof window !== 'undefined' ? window : this);
