/**
 * ============================================================================
 * CSV TO JSON CONVERTER - Self-Documenting Data Migration Engine
 * ============================================================================
 *
 * VERSION: 2.0.0
 * CREATED: 2025-12-26 by Claude Opus 4.5
 * VERIFICATION: Pending first migration
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

            const faceAEnergy = validateField(row[1], `${edgeId} Face A energy`, phi.PHI_2, tracking);
            const faceBEnergy = validateField(row[2], `${edgeId} Face B energy`, phi.PHI_2, tracking);
            const tension = validateField(row[3], `${edgeId} tension`, 0, tracking);
            const breathRatio = validateField(row[4], `${edgeId} breath ratio`, 1.0, tracking);
            const kpiCoherence = validateField(row[5], `${edgeId} KPI coherence`, 0, tracking);
            const elementalNature = row[6] || 'Ether';
            const theQuestion = row[7] || '';

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
                    archetype: `The relationship between ${getFaceName(faceAId)} and ${getFaceName(faceBId)}`
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
            const face1Id = parseInt(row[1]) || 1;
            const face2Id = parseInt(row[2]) || 2;
            const face3Id = parseInt(row[3]) || 3;

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
    // SECTION 9B: GENERIC TRANSFORMER (For complex CSVs pending full implementation)
    // ========================================================================

    /**
     * Generic transformer for complex CSV types
     *
     * Creates a basic self-documenting JSON structure with raw parsed data.
     * Full transformation pending for: face-models, dodeca-engine, system-coherence, spiral-dashboard
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
        console.log(`[CSVToJSONConverter] Converting ${type}...`);

        switch (type) {
            case 'kpi-database':
                return transformKPIDatabase(csvContent);
            case 'edge-tension':
                return transformEdgeTension(csvContent);
            case 'vortex-map':
                return transformVortexMap(csvContent);
            case 'breath-ratios':
                return transformBreathRatios(csvContent);
            // Additional types with generic transformation
            case 'face-models':
            case 'dodeca-engine':
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
                console.log(`[CSVToJSONConverter] ✓ ${type} converted`);
            } catch (e) {
                console.error(`[CSVToJSONConverter] ✗ ${type} failed: ${e.message}`);
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

    console.log('🔄 CSVToJSONConverter v2.0.0 loaded - Self-documenting data migration');

})(typeof window !== 'undefined' ? window : this);
