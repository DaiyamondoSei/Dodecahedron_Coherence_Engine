/**
 * ========================================
 * MODULE: excel-measurement-parser.js
 * ========================================
 *
 * Parses Quannex Weekly Input Excel files (.xlsx) into the
 * structured format consumed by the Quannex calculation engine.
 *
 * Expected Excel structure (3 sheets):
 *   Sheet 1 "Raw Input"   - 12 face KPIs (rows 2-13, cols A-J)
 *   Sheet 2 "Breath Axes" - 6 polarity axes (rows 2-7, cols A-I)
 *   Sheet 3 "Diagnostics" - Week metadata + computed outputs
 *
 * DEPENDENCIES:
 * - SheetJS (xlsx.js) loaded via CDN before this module
 *
 * @module js/excel-measurement-parser
 * @author Deimantas Murauskas & Claude
 */

class ExcelMeasurementParser {

    /**
     * The 12 Quannex face domains in canonical order.
     * Must match the Excel template row order (rows 2-13).
     */
    static FACE_DOMAINS = [
        { id: 1, name: 'Financial Capital' },
        { id: 2, name: 'Intellectual Capital' },
        { id: 3, name: 'Human Capital' },
        { id: 4, name: 'Structural Capital' },
        { id: 5, name: 'Market Resonance' },
        { id: 6, name: 'Community' },
        { id: 7, name: 'Brand & Reputation' },
        { id: 8, name: 'Core Operations' },
        { id: 9, name: 'Regenerative Flow' },
        { id: 10, name: 'Foundational Values' },
        { id: 11, name: 'Funding Pipeline' },
        { id: 12, name: 'Risk & Resilience' }
    ];

    /**
     * The 6 breath axes in canonical order.
     * Must match the Excel template row order (rows 2-7).
     */
    static BREATH_AXES = [
        { id: 1, projectionFace: 1, receptionFace: 12, theme: 'Survival vs. Legacy' },
        { id: 2, projectionFace: 7, receptionFace: 8, theme: 'Voice vs. Engine' },
        { id: 3, projectionFace: 4, receptionFace: 10, theme: 'Structure vs. Soul' },
        { id: 4, projectionFace: 3, receptionFace: 9, theme: 'People vs. Renewal' },
        { id: 5, projectionFace: 6, receptionFace: 2, theme: 'Network vs. Knowledge' },
        { id: 6, projectionFace: 5, receptionFace: 11, theme: 'Signal vs. Resources' }
    ];

    /**
     * Parse an Excel file (ArrayBuffer) into a measurement snapshot.
     *
     * @param {ArrayBuffer} arrayBuffer - The raw file contents
     * @returns {Object} Parsed measurement with faces, breathAxes, diagnostics
     */
    static parse(arrayBuffer) {
        if (typeof XLSX === 'undefined') {
            throw new Error('SheetJS (XLSX) library not loaded. Include xlsx CDN before this module.');
        }

        const workbook = XLSX.read(arrayBuffer, { type: 'array', cellFormula: true, sheetStubs: true });
        const sheetNames = workbook.SheetNames;

        if (sheetNames.length < 2) {
            throw new Error(`Expected at least 2 sheets (Raw Input, Breath Axes), found ${sheetNames.length}`);
        }

        const rawInputSheet = workbook.Sheets[sheetNames[0]];
        const breathAxesSheet = workbook.Sheets[sheetNames[1]];
        const diagnosticsSheet = sheetNames.length >= 3 ? workbook.Sheets[sheetNames[2]] : null;

        const faces = this.parseRawInput(rawInputSheet);
        const breathAxes = this.parseBreathAxes(breathAxesSheet);
        const diagnostics = diagnosticsSheet ? this.parseDiagnostics(diagnosticsSheet) : {};

        // Post-process: compute values that SheetJS can't resolve (cross-sheet formulas)
        this.computeDerivedValues(faces, breathAxes, diagnostics);

        const week = diagnostics.week || null;
        const date = diagnostics.date || new Date().toISOString().split('T')[0];

        return {
            meta: {
                week,
                date,
                parsedAt: new Date().toISOString(),
                source: 'excel-upload',
                version: '1.0'
            },
            faces,
            breathAxes,
            diagnostics
        };
    }

    /**
     * Parse the "Raw Input" sheet into 12 face objects.
     * Reads rows 2-13 (faces F1-F12).
     *
     * Columns: A=Face, B=Domain, C=KPI, D=Formula, E=RawValue, F=K_norm, G=Weight, H=E_f, I=Delta, J=Notes
     */
    static parseRawInput(sheet) {
        const faces = [];

        for (let row = 2; row <= 13; row++) {
            const faceIndex = row - 2;
            const domainDefault = this.FACE_DOMAINS[faceIndex];

            // Read domain name dynamically from column B, fall back to static default
            const domainFromExcel = this.cellString(sheet, `B${row}`);
            const domainName = domainFromExcel || domainDefault.name;

            const rawValue = this.cellValue(sheet, `E${row}`);
            const kNorm = this.cellValue(sheet, `F${row}`);
            const weight = this.cellValue(sheet, `G${row}`) || 1;
            const eFace = this.cellValue(sheet, `H${row}`);
            const delta = this.cellValue(sheet, `I${row}`);
            const notes = this.cellString(sheet, `J${row}`);
            const kpiName = this.cellString(sheet, `C${row}`);
            const formulaRef = this.cellString(sheet, `D${row}`);

            faces.push({
                faceId: domainDefault.id,
                domain: domainName,
                kpiName: kpiName || `Face ${domainDefault.id} KPI`,
                formulaReference: formulaRef || '',
                rawValue: rawValue,
                normalizedScore: kNorm,
                weight: weight,
                faceEnergy: eFace,
                deltaPrev: delta,
                evidenceNotes: notes || ''
            });
        }

        return faces;
    }

    /**
     * Parse the "Breath Axes" sheet into 6 axis objects.
     * Reads rows 2-7 (Axes 1-6).
     *
     * Columns: A=Axis, B=Projection, C=Reception, D=Theme, E=Score, F=E_fProj, G=E_fRecep, H=EdgeTension, I=Notes
     */
    static parseBreathAxes(sheet) {
        const axes = [];

        for (let row = 2; row <= 7; row++) {
            const axisIndex = row - 2;
            const axisDef = this.BREATH_AXES[axisIndex];

            // Read projection/reception names and theme dynamically from Excel
            const projectionFromExcel = this.cellString(sheet, `B${row}`);
            const receptionFromExcel = this.cellString(sheet, `C${row}`);
            const themeFromExcel = this.cellString(sheet, `D${row}`);
            const theme = themeFromExcel || axisDef.theme;

            const score = this.cellValue(sheet, `E${row}`);
            const eFProj = this.cellValue(sheet, `F${row}`);
            const eFRecep = this.cellValue(sheet, `G${row}`);
            const edgeTension = this.cellValue(sheet, `H${row}`);
            const notes = this.cellString(sheet, `I${row}`);

            axes.push({
                axisId: axisDef.id,
                projectionFaceId: axisDef.projectionFace,
                receptionFaceId: axisDef.receptionFace,
                projectionName: projectionFromExcel || null,
                receptionName: receptionFromExcel || null,
                theme: theme,
                score: score,
                projectionEnergy: eFProj,
                receptionEnergy: eFRecep,
                edgeTension: edgeTension,
                interpretationNotes: notes || ''
            });
        }

        return axes;
    }

    /**
     * Parse the "Diagnostics" sheet for metadata.
     * Extracts week number, date, global coherence, AAG.
     */
    static parseDiagnostics(sheet) {
        const week = this.cellValue(sheet, 'B2');
        const dateRaw = this.cellValue(sheet, 'B3');
        const sumEnergies = this.cellValue(sheet, 'B6');
        const maxPossible = this.cellValue(sheet, 'B7');
        const globalCoherence = this.cellValue(sheet, 'B8');
        const eAspiration = this.cellValue(sheet, 'B11');
        const eActuality = this.cellValue(sheet, 'B12');
        const aag = this.cellValue(sheet, 'B13');
        const dominantTension = this.cellValue(sheet, 'B30');

        let date = null;
        if (dateRaw instanceof Date) {
            date = dateRaw.toISOString().split('T')[0];
        } else if (typeof dateRaw === 'string') {
            date = dateRaw;
        } else if (typeof dateRaw === 'number') {
            // Excel serial date
            const excelEpoch = new Date(1899, 11, 30);
            const d = new Date(excelEpoch.getTime() + dateRaw * 86400000);
            date = d.toISOString().split('T')[0];
        }

        return {
            week,
            date,
            sumFaceEnergies: sumEnergies,
            maxPossible: maxPossible,
            globalCoherence: globalCoherence,
            aspirationEnergy: eAspiration,
            actualityEnergy: eActuality,
            aspirationActualityGap: aag,
            dominantTensionValue: dominantTension
        };
    }

    /**
     * Compute derived values that SheetJS can't resolve from cross-sheet formulas.
     * Uses the parsed face energies to fill in breath axis tensions and diagnostics.
     */
    static computeDerivedValues(faces, breathAxes, diagnostics) {
        // Build face energy lookup: faceId -> faceEnergy
        const faceEnergyMap = {};
        faces.forEach(f => { faceEnergyMap[f.faceId] = f.faceEnergy; });

        // Fill breath axis projection/reception energies and edge tensions
        for (const axis of breathAxes) {
            if (axis.projectionEnergy == null) {
                axis.projectionEnergy = faceEnergyMap[axis.projectionFaceId] || null;
            }
            if (axis.receptionEnergy == null) {
                axis.receptionEnergy = faceEnergyMap[axis.receptionFaceId] || null;
            }
            if (axis.edgeTension == null && axis.projectionEnergy != null && axis.receptionEnergy != null) {
                axis.edgeTension = Math.abs(axis.projectionEnergy - axis.receptionEnergy);
            }
        }

        // Fill diagnostics from face data
        if (diagnostics.sumFaceEnergies == null) {
            const energies = faces.map(f => f.faceEnergy).filter(e => e != null);
            diagnostics.sumFaceEnergies = energies.reduce((s, e) => s + e, 0);
        }
        if (diagnostics.maxPossible == null) {
            diagnostics.maxPossible = faces.reduce((s, f) => s + (f.weight || 0), 0);
        }
        if (diagnostics.globalCoherence == null && diagnostics.maxPossible > 0) {
            diagnostics.globalCoherence = diagnostics.sumFaceEnergies / diagnostics.maxPossible;
        }
        // AAG computation consolidated to POC/js/core/Diagnostics.js per W1 §6.2 (2026-05-21)
        // See Lock #8.15 + CALCULATION_AUDIT_TRAIL.md §12 for the canonical formula.
        // Note: this branch preserves the pre-consolidation semantic where null
        // aspirationEnergy/actualityEnergy is set ONLY if not already populated
        // (e.g., when parsed from Excel cells B11/B12), then AAG is derived from those.
        const DiagnosticsMod = (typeof Diagnostics !== 'undefined') ? Diagnostics
            : (typeof window !== 'undefined' ? window.Diagnostics : null);

        if (DiagnosticsMod && (diagnostics.aspirationEnergy == null ||
            diagnostics.actualityEnergy == null ||
            diagnostics.aspirationActualityGap == null)) {
            const aagResult = DiagnosticsMod.getAspirationActualityGap(faceEnergyMap);
            if (diagnostics.aspirationEnergy == null) {
                // Map returns 0 for empty group; preserve null sentinel when no aspiration faces
                const aspHasData = [10, 11, 12].some(id => faceEnergyMap[id] != null);
                diagnostics.aspirationEnergy = aspHasData ? aagResult.eAspiration : null;
            }
            if (diagnostics.actualityEnergy == null) {
                const actHasData = [1, 2, 3].some(id => faceEnergyMap[id] != null);
                diagnostics.actualityEnergy = actHasData ? aagResult.eActuality : null;
            }
            if (diagnostics.aspirationActualityGap == null &&
                diagnostics.aspirationEnergy != null && diagnostics.actualityEnergy != null &&
                diagnostics.actualityEnergy !== 0) {
                diagnostics.aspirationActualityGap = aagResult.aag;
            }
        } else if (!DiagnosticsMod) {
            // Fallback (pre-consolidation semantics preserved verbatim)
            if (diagnostics.aspirationEnergy == null) {
                const aspFaces = [10, 11, 12].map(id => faceEnergyMap[id]).filter(e => e != null);
                diagnostics.aspirationEnergy = aspFaces.length > 0
                    ? aspFaces.reduce((s, e) => s + e, 0) / aspFaces.length : null;
            }
            if (diagnostics.actualityEnergy == null) {
                const actFaces = [1, 2, 3].map(id => faceEnergyMap[id]).filter(e => e != null);
                diagnostics.actualityEnergy = actFaces.length > 0
                    ? actFaces.reduce((s, e) => s + e, 0) / actFaces.length : null;
            }
            if (diagnostics.aspirationActualityGap == null &&
                diagnostics.aspirationEnergy != null && diagnostics.actualityEnergy != null &&
                diagnostics.actualityEnergy !== 0) {
                diagnostics.aspirationActualityGap = diagnostics.aspirationEnergy / diagnostics.actualityEnergy;
            }
        }
        // Dominant tension
        if (diagnostics.dominantTensionValue == null) {
            const tensions = breathAxes.map(a => a.edgeTension).filter(t => t != null);
            diagnostics.dominantTensionValue = tensions.length > 0 ? Math.max(...tensions) : null;
        }
    }

    /**
     * Convert a parsed measurement into the KPI format expected by the Quannex engine.
     * This is the bridge from Excel → calculation pipeline.
     *
     * @param {Object} measurement - Output from parse()
     * @param {Object} [baseKPIs] - Optional existing 60-KPI set to merge with
     * @returns {Object} Engine-ready data: { kpis, faceConfig, breathAxes }
     */
    static toEngineFormat(measurement, baseKPIs = null) {
        const kpis = [];
        const faceConfig = { faces: [] };

        for (const face of measurement.faces) {
            faceConfig.faces.push({
                id: face.faceId,
                name: face.domain
            });

            if (baseKPIs && baseKPIs.length > 0) {
                // Merge mode: Update Earth element KPI with Excel value, keep others
                const faceKPIs = baseKPIs.filter(k => {
                    const fid = k.Face_ID || k.faceId;
                    return parseInt(fid) === face.faceId;
                });

                for (const existingKPI of faceKPIs) {
                    const element = existingKPI.Element || existingKPI.element || 'Earth';
                    if (element === 'Earth') {
                        // Overwrite Earth element with Excel measurement
                        kpis.push({
                            KPI_ID: existingKPI.KPI_ID || existingKPI.id || `F${face.faceId}_E1`,
                            KPI_Name: face.kpiName,
                            Face_ID: face.faceId,
                            Element: 'Earth',
                            Value: face.rawValue,
                            Weight: face.weight,
                            Direction: existingKPI.Direction || existingKPI.direction || '\u2191',
                            Target_Min: existingKPI.Target_Min || existingKPI.target_min || 0,
                            Target_Ideal: existingKPI.Target_Ideal || existingKPI.target_ideal || 1,
                            Healthy_Min: existingKPI.Healthy_Min || existingKPI.healthyMin,
                            Healthy_Max: existingKPI.Healthy_Max || existingKPI.healthyMax,
                            Absolute_Max: existingKPI.Absolute_Max || existingKPI.absoluteMax,
                            metricType: existingKPI.metricType || 'completion'
                        });
                    } else {
                        // Keep non-Earth KPIs as-is
                        kpis.push(existingKPI);
                    }
                }
            } else {
                // Quick mode: Create single Earth KPI per face from Excel data
                // The normalized score IS the value (already 0-1 from Excel formulas)
                kpis.push({
                    KPI_ID: `F${face.faceId}_E1`,
                    KPI_Name: face.kpiName,
                    Face_ID: face.faceId,
                    Element: 'Earth',
                    Value: face.normalizedScore != null ? face.normalizedScore : face.rawValue,
                    Weight: face.weight,
                    Direction: '\u2191',
                    Target_Min: 0,
                    Target_Ideal: 1,
                    Healthy_Min: 0,
                    Healthy_Max: 1,
                    Absolute_Max: 1,
                    metricType: 'completion'
                });
            }
        }

        // Convert breath axes to the format used by mapping-context
        const breathAxesFormatted = measurement.breathAxes.map(axis => ({
            axisId: axis.axisId,
            projectionFace: axis.projectionFaceId,
            receptionFace: axis.receptionFaceId,
            theme: axis.theme,
            score: axis.score,
            edgeTension: axis.edgeTension
        }));

        return {
            kpis,
            faceConfig,
            breathAxes: breathAxesFormatted,
            meta: measurement.meta
        };
    }

    // --- Utility methods ---

    /**
     * Extract a numeric value from a cell, evaluating simple formulas
     * when SheetJS doesn't cache formula results (type "z" / stub cells).
     *
     * Handles these common Excel patterns:
     * - Plain numbers: cell.v is already the value
     * - Simple fractions entered as formulas: "4/10", "3/7"
     * - IF-wrapped normalization: "IF(E2="","",(E2/12))"
     * - Reference formulas: evaluates using a cell-value lookup
     */
    static cellValue(sheet, ref) {
        const cell = sheet[ref];
        if (!cell) return null;

        // If it has a proper numeric value, use it
        if (cell.t === 'n' && cell.v !== undefined) return cell.v;

        // If it's a formula cell without cached result (type "z"),
        // try to evaluate the formula
        if (cell.f) {
            return this.evaluateSimpleFormula(cell.f, sheet);
        }

        return cell.v !== undefined ? cell.v : null;
    }

    /**
     * Evaluate simple Excel formulas that SheetJS can't resolve.
     * Supports: arithmetic (a/b, a*b), cell references (E2, F3*G3),
     * and IF(ref="","",expr) wrappers.
     *
     * @param {string} formula - The Excel formula string
     * @param {Object} sheet - SheetJS sheet object for cell lookups
     * @param {number} [depth=0] - Recursion depth guard (max 5)
     */
    static evaluateSimpleFormula(formula, sheet, depth = 0) {
        if (depth > 5) return null; // Prevent infinite recursion

        // Bail on cross-sheet references (e.g., 'Raw Input'!H2)
        if (formula.includes('!')) return null;

        // Strip IF(ref="","", expr) wrapper — just evaluate the inner expression
        const ifMatch = formula.match(/^IF\([^,]+,"",\s*(.+)\)$/i);
        const expr = ifMatch ? ifMatch[1] : formula;

        // Replace cell references (like E2, F3) with their numeric values
        const resolved = expr.replace(/\b([A-Z]{1,2})(\d{1,3})\b/g, (match, col, row) => {
            const refCell = sheet[match];
            if (!refCell) return '0';
            if (refCell.t === 'n') return String(refCell.v);
            // Recurse for formula cells (with depth guard)
            if (refCell.f) {
                const val = this.evaluateSimpleFormula(refCell.f, sheet, depth + 1);
                return val != null ? String(val) : '0';
            }
            return refCell.v != null ? String(refCell.v) : '0';
        });

        // Evaluate simple arithmetic (only +, -, *, / with numbers)
        try {
            if (/^[\d\s.+\-*/()]+$/.test(resolved)) {
                const result = Function('"use strict"; return (' + resolved + ')')();
                return isFinite(result) ? result : null;
            }
        } catch (e) {
            // Fall through
        }

        return null;
    }

    static cellString(sheet, ref) {
        const cell = sheet[ref];
        if (!cell) return '';
        if (cell.t === 'z' && cell.f) {
            // Formula cell — try to get a string value
            const val = this.evaluateSimpleFormula(cell.f, sheet);
            return val != null ? String(val) : '';
        }
        return String(cell.v || '');
    }
}

// Export for both module and window contexts
if (typeof window !== 'undefined') {
    window.ExcelMeasurementParser = ExcelMeasurementParser;
}
