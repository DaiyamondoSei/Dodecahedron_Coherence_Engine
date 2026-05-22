/**
 * ========================================
 * MODULE: excel-report-generator.js
 * ========================================
 *
 * Generates a multi-sheet Excel report from Quannex calculation results.
 * Closes the loop: upload template in → get filled report out.
 *
 * DEPENDENCIES:
 * - SheetJS (xlsx.js) loaded via CDN before this module
 * - Quannex engine state (window.Quannex API)
 *
 * @module js/excel-report-generator
 * @author Deimantas Murauskas & Claude
 */

class ExcelReportGenerator {

    /**
     * Generate and download a complete Excel report.
     *
     * @param {Object} options
     * @param {Object} options.state       - from window.Quannex.getState()
     * @param {Object} options.spectral    - from window.Quannex.getSpectralAnalysis()
     * @param {Object} options.breath      - from window.Quannex.getBreathAnalysis()
     * @param {Object} options.company     - { name }
     * @param {Function} options.sensitivityFn - calculateFaceSensitivity(faceIndex, delta)
     * @param {number|string} [options.week] - Week number
     * @param {string} [options.date]       - Date string (YYYY-MM-DD)
     */
    static generate(options) {
        if (typeof XLSX === 'undefined') {
            throw new Error('SheetJS (XLSX) library not loaded.');
        }

        const { state, spectral, breath, company, sensitivityFn, week, date } = options;
        if (!state) throw new Error('No calculation state provided.');

        const wb = XLSX.utils.book_new();

        // Sheet 1: Summary (always)
        this.addSheet(wb, 'Summary', this.buildSummarySheet(state, spectral, breath, company, week, date));

        // Sheet 2: Face Energies (always)
        this.addSheet(wb, 'Face Energies', this.buildFaceEnergiesSheet(state, spectral));

        // Sheet 3: Breath Axes (if available)
        if (breath && breath.axes) {
            this.addSheet(wb, 'Breath Axes', this.buildBreathAxesSheet(breath, state));
        }

        // Sheet 4: Spectral Analysis (if available)
        if (spectral && spectral.modalAmplitudes) {
            this.addSheet(wb, 'Spectral Analysis', this.buildSpectralSheet(spectral));
        }

        // Sheet 5: Delta & Sensitivity (if spectral available)
        if (spectral && spectral.deltaVector && sensitivityFn) {
            this.addSheet(wb, 'Delta & Sensitivity', this.buildDeltaSensitivitySheet(spectral, state, sensitivityFn));
        }

        // Sheet 6: Diagnostics (always)
        this.addSheet(wb, 'Diagnostics', this.buildDiagnosticsSheet(state, spectral, breath, week, date));

        // Determine filename
        const weekLabel = week || this.extractWeek(company?.name) || '';
        const dateLabel = date || new Date().toISOString().split('T')[0];
        const filename = weekLabel
            ? `Quannex_Report_Wk${weekLabel}_${dateLabel}.xlsx`
            : `Quannex_Report_${dateLabel}.xlsx`;

        XLSX.writeFile(wb, filename);
    }

    // ─── Sheet Builders ─────────────────────────────────────────

    static buildSummarySheet(state, spectral, breath, company, week, date) {
        const coherencePct = state.globalCoherence != null
            ? (state.globalCoherence * 100).toFixed(1) + '%' : 'N/A';

        const nervousCount = state.faces
            ? state.faces.filter(f => (f.faceEnergy || 0) < 0.4).length : 0;

        const totalKPIs = state.faces
            ? state.faces.reduce((sum, f) => sum + (f.elementalKPIs?.length || 0), 0) : 0;

        const rows = [
            ['QUANNEX COHERENCE REPORT'],
            [],
            ['Company', company?.name || 'Quannex'],
            ['Week', week || this.extractWeek(company?.name) || 'N/A'],
            ['Date', date || new Date().toISOString().split('T')[0]],
            [],
            ['COHERENCE OVERVIEW'],
            ['Global Coherence', coherencePct],
            ['Health Status', this.getHealthStatus(state.globalCoherence)],
            ['Active Faces', state.faces?.length || 0],
            ['Total KPIs', totalKPIs],
            ['Nervous Endpoints (< 40%)', nervousCount],
        ];

        if (spectral) {
            rows.push([]);
            rows.push(['SPECTRAL SUMMARY']);
            if (spectral.dominantMode) {
                rows.push(['Dominant Mode', `Mode ${spectral.dominantMode.mode}: ${spectral.dominantMode.interpretation || ''}`]);
                rows.push(['Dominant Eigenvalue', this.num(spectral.dominantMode.eigenvalue, 4)]);
                rows.push(['Dominant Amplitude', this.num(spectral.dominantMode.amplitude, 4)]);
            }
            if (spectral.diagnostics?.beingActionBalance) {
                const bab = spectral.diagnostics.beingActionBalance;
                rows.push(['BAB Score', this.num(bab.percentage, 1) + '%']);
                rows.push(['BAB Interpretation', bab.interpretation || '']);
            }
            if (spectral.diagnostics?.dissonanceIndex) {
                const di = spectral.diagnostics.dissonanceIndex;
                rows.push(['Dissonance Index', this.num(di.percentage, 1) + '%']);
                rows.push(['Dissonance Interpretation', di.interpretation || '']);
            }
        }

        if (breath?.overall) {
            rows.push([]);
            rows.push(['BREATH HEALTH']);
            rows.push(['Overall Status', breath.overall.status || '']);
            rows.push(['Average Tension', this.num(breath.overall.averageTension, 3)]);
            rows.push(['Balanced Axes', breath.overall.balancedAxes || 0]);
            rows.push(['Dominant Tendency', breath.overall.dominantTendency || 'balanced']);
        }

        return { data: rows, cols: [{ wch: 30 }, { wch: 50 }] };
    }

    static buildFaceEnergiesSheet(state, spectral) {
        const header = ['Face', 'Domain', 'KPI Name', 'Raw Value', 'K_norm', 'Weight', 'E_f', 'Status', 'Delta from Target'];
        const rows = [header];

        const deltaMap = {};
        if (spectral?.deltaVector) {
            spectral.deltaVector.forEach(d => { deltaMap[d.faceId] = d.deltaValue; });
        }

        for (const face of (state.faces || [])) {
            const energy = face.faceEnergy ?? face.energy ?? null;
            const kpis = face.elementalKPIs || [];
            const primaryKPI = kpis[0];
            const delta = deltaMap[face.id];

            rows.push([
                `F${face.id}`,
                face.name || '',
                primaryKPI?.name || '',
                primaryKPI ? this.num(primaryKPI.value, 3) : '',
                primaryKPI ? this.num(primaryKPI.normalizedScore, 3) : '',
                1,
                this.num(energy, 3),
                face.status || '',
                delta != null ? this.num(delta, 4) : ''
            ]);

            // Sub-rows for additional KPIs (full 60-KPI mode)
            for (let k = 1; k < kpis.length; k++) {
                const kpi = kpis[k];
                rows.push([
                    '',
                    '',
                    kpi.name || '',
                    this.num(kpi.value, 3),
                    this.num(kpi.normalizedScore, 3),
                    '',
                    '',
                    '',
                    ''
                ]);
            }
        }

        return {
            data: rows,
            cols: [{ wch: 5 }, { wch: 22 }, { wch: 30 }, { wch: 10 }, { wch: 8 }, { wch: 7 }, { wch: 8 }, { wch: 12 }, { wch: 14 }]
        };
    }

    static buildBreathAxesSheet(breath, state) {
        const header = ['Axis', 'Projection Face', 'Reception Face', 'Archetype', 'Log-phi Score', 'E_f Proj', 'E_f Recep', 'Tension', 'Status', 'Direction'];
        const rows = [header];

        // Build face name lookup from state
        const faceNames = {};
        if (state.faces) {
            state.faces.forEach(f => { faceNames[f.id] = f.name; });
        }

        for (const axis of (breath.axes || [])) {
            rows.push([
                axis.axis || '',
                faceNames[axis.projectionFace] || `F${axis.projectionFace}`,
                faceNames[axis.receptionFace] || `F${axis.receptionFace}`,
                axis.archetype || '',
                this.num(axis.breathRatio, 3),
                this.num(axis.projectionEnergy, 3),
                this.num(axis.receptionEnergy, 3),
                this.num(axis.tension, 3),
                axis.status || '',
                axis.direction || ''
            ]);
        }

        // Summary row
        if (breath.overall) {
            rows.push([]);
            rows.push(['OVERALL BREATH HEALTH']);
            rows.push(['Status', breath.overall.status || '']);
            rows.push(['Average Tension', this.num(breath.overall.averageTension, 3)]);
            rows.push(['Breath Health %', this.num(breath.overall.breathHealthPercentage, 1) + '%']);
            rows.push(['Message', breath.overall.message || '']);
        }

        return {
            data: rows,
            cols: [{ wch: 24 }, { wch: 22 }, { wch: 22 }, { wch: 20 }, { wch: 12 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 12 }, { wch: 12 }]
        };
    }

    static buildSpectralSheet(spectral) {
        const header = ['Mode', 'Eigenvalue', 'Band', 'Amplitude', '|Amplitude|', 'Dominant?'];
        const rows = [header];

        for (const m of (spectral.modalAmplitudes || [])) {
            rows.push([
                m.mode,
                this.num(m.eigenvalue, 4),
                this.getBand(m.eigenvalue),
                this.num(m.amplitude, 4),
                this.num(Math.abs(m.amplitude), 4),
                m.mode === spectral.dominantMode?.mode ? 'YES' : ''
            ]);
        }

        return {
            data: rows,
            cols: [{ wch: 6 }, { wch: 12 }, { wch: 22 }, { wch: 12 }, { wch: 12 }, { wch: 10 }]
        };
    }

    static buildDeltaSensitivitySheet(spectral, state, sensitivityFn) {
        const rows = [];

        // Section A: Delta Vector
        rows.push(['DELTA VECTOR — Spectral Corrections']);
        rows.push(['Face', 'Domain', 'Current E_f', 'Target E_f', 'Delta', 'Action', 'Top Mode 1', 'Top Mode 2', 'Top Mode 3']);

        // Build face lookup
        const faceLookup = {};
        if (state.faces) {
            state.faces.forEach(f => { faceLookup[f.id] = f; });
        }

        // Sort by |delta| descending
        const sorted = [...(spectral.deltaVector || [])].sort((a, b) => b.absDelta - a.absDelta);

        for (const d of sorted) {
            const face = faceLookup[d.faceId];
            const energy = face ? (face.faceEnergy ?? face.energy ?? 0) : 0;
            const target = energy + d.deltaValue;

            // Top 3 mode contributions
            const topModes = (d.modeContributions || [])
                .sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution))
                .slice(0, 3);

            rows.push([
                `F${d.faceId}`,
                face?.name || '',
                this.num(energy, 3),
                this.num(target, 3),
                this.num(d.deltaValue, 4),
                d.interpretation || '',
                topModes[0] ? `M${topModes[0].mode} (${this.num(topModes[0].contribution, 3)})` : '',
                topModes[1] ? `M${topModes[1].mode} (${this.num(topModes[1].contribution, 3)})` : '',
                topModes[2] ? `M${topModes[2].mode} (${this.num(topModes[2].contribution, 3)})` : ''
            ]);
        }

        // Section B: KPI Sensitivity
        rows.push([]);
        rows.push(['KPI SENSITIVITY ANALYSIS']);
        rows.push(['Face', 'KPI', 'Element', 'Current Raw', 'Current Score', 'Sensitivity', 'Leverage', 'Target Raw', 'Target Score', 'Change']);

        for (const d of sorted) {
            const faceIndex = d.faceId - 1;
            const face = faceLookup[d.faceId];
            let sensResults = null;

            try {
                sensResults = sensitivityFn(faceIndex, d.deltaValue);
            } catch (e) {
                // Sensitivity calculation may fail for some faces
            }

            if (!sensResults || sensResults.length === 0) continue;

            for (const s of sensResults) {
                rows.push([
                    face?.name || `F${d.faceId}`,
                    s.kpiName || s.kpiId || '',
                    s.element || '',
                    this.num(s.currentRaw, 3),
                    this.num(s.currentNormalized, 3),
                    this.num(s.sensitivity, 4),
                    this.num(s.leverage, 2),
                    this.num(s.targetRaw, 3),
                    this.num(s.targetNormalized, 3),
                    this.num(s.deltaRaw, 3)
                ]);
            }
        }

        return {
            data: rows,
            cols: [{ wch: 22 }, { wch: 30 }, { wch: 8 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 10 }, { wch: 12 }, { wch: 12 }, { wch: 12 }]
        };
    }

    static buildDiagnosticsSheet(state, spectral, breath, week, date) {
        const faces = state.faces || [];
        const energies = faces.map(f => f.faceEnergy ?? f.energy ?? 0);
        const sumEnergies = energies.reduce((s, e) => s + e, 0);
        const maxPossible = faces.length; // Assuming weight=1 per face in quick mode

        // AAG computation consolidated to POC/js/core/Diagnostics.js per W1 §6.2 (2026-05-21)
        // See Lock #8.15 + CALCULATION_AUDIT_TRAIL.md §12 for the canonical formula.
        // Falls back to local computation if Diagnostics module is not loaded (defensive).
        const DiagnosticsMod = (typeof Diagnostics !== 'undefined') ? Diagnostics
            : (typeof window !== 'undefined' ? window.Diagnostics : null);
        let avgAspiration, avgActuality, aag;
        if (DiagnosticsMod) {
            const aagResult = DiagnosticsMod.getAspirationActualityGap(faces);
            avgAspiration = aagResult.eAspiration;
            avgActuality = aagResult.eActuality;
            aag = aagResult.aag;
        } else {
            // Fallback (pre-consolidation semantics preserved verbatim)
            avgAspiration = this.avgFaceEnergy(faces, [10, 11, 12]);
            avgActuality = this.avgFaceEnergy(faces, [1, 2, 3]);
            aag = avgActuality > 0 ? avgAspiration / avgActuality : null;
        }

        const rows = [
            ['QUANNEX DIAGNOSTICS'],
            [],
            ['Week', week || this.extractWeek(null) || 'N/A'],
            ['Date', date || new Date().toISOString().split('T')[0]],
            [],
            ['ENERGY TOTALS'],
            ['Sum Face Energies', this.num(sumEnergies, 3)],
            ['Max Possible', this.num(maxPossible, 1)],
            ['Global Coherence', state.globalCoherence != null ? this.num(state.globalCoherence, 4) : 'N/A'],
            [],
            ['ASPIRATION-ACTUALITY GAP'],
            ['E_Aspiration (avg F10,F11,F12)', this.num(avgAspiration, 3)],
            ['E_Actuality (avg F1,F2,F3)', this.num(avgActuality, 3)],
            ['AAG Ratio', aag != null ? this.num(aag, 3) : 'N/A'],
        ];

        if (spectral?.diagnostics) {
            const bab = spectral.diagnostics.beingActionBalance;
            const di = spectral.diagnostics.dissonanceIndex;

            rows.push([]);
            rows.push(['BEING-ACTION BALANCE']);
            if (bab) {
                rows.push(['BAB Percentage', this.num(bab.percentage, 1) + '%']);
                rows.push(['Projection Energy (avg)', this.num(bab.projectionEnergy, 3)]);
                rows.push(['Reception Energy (avg)', this.num(bab.receptionEnergy, 3)]);
                rows.push(['Interpretation', bab.interpretation || '']);
            }

            rows.push([]);
            rows.push(['DISSONANCE']);
            if (di) {
                rows.push(['Dissonance Index %', this.num(di.percentage, 1) + '%']);
                rows.push(['Total Magnitude', this.num(di.totalMagnitude, 3)]);
                rows.push(['Interpretation', di.interpretation || '']);
            }

            rows.push([]);
            rows.push(['SPECTRAL']);
            if (spectral.dominantMode) {
                rows.push(['Dominant Mode', `Mode ${spectral.dominantMode.mode}`]);
                rows.push(['Dominant Eigenvalue', this.num(spectral.dominantMode.eigenvalue, 4)]);
                rows.push(['Dominant Amplitude', this.num(spectral.dominantMode.amplitude, 4)]);
            }
        }

        if (breath?.overall) {
            rows.push([]);
            rows.push(['BREATH']);
            rows.push(['Average Tension', this.num(breath.overall.averageTension, 3)]);
            rows.push(['Dominant Tendency', breath.overall.dominantTendency || '']);
        }

        return { data: rows, cols: [{ wch: 35 }, { wch: 25 }] };
    }

    // ─── Helpers ────────────────────────────────────────────────

    static addSheet(wb, name, { data, cols }) {
        const ws = XLSX.utils.aoa_to_sheet(data);
        if (cols) ws['!cols'] = cols;
        XLSX.utils.book_append_sheet(wb, ws, name);
    }

    static num(val, decimals) {
        if (val == null || isNaN(val)) return '';
        return Number(Number(val).toFixed(decimals));
    }

    static getBand(eigenvalue) {
        if (eigenvalue < 0.01) return 'DC Offset';
        if (eigenvalue < 4) return 'Global (5-sqrt5)';
        if (eigenvalue < 6.5) return 'Regional (5)';
        return 'Fine-Grained (5+sqrt5)';
    }

    static getHealthStatus(coherence) {
        if (coherence == null) return 'Unknown';
        const pct = coherence * 100;
        if (pct >= 80) return 'Radiant';
        if (pct >= 60) return 'Healthy';
        if (pct >= 40) return 'Dimming';
        if (pct >= 25) return 'Struggling';
        return 'Critical';
    }

    static extractWeek(name) {
        if (!name) return null;
        const match = name.match(/Week\s+(\d+)/i);
        return match ? match[1] : null;
    }

    static avgFaceEnergy(faces, faceIds) {
        const vals = faceIds
            .map(id => faces.find(f => f.id === id))
            .filter(f => f)
            .map(f => f.faceEnergy ?? f.energy ?? 0);
        return vals.length > 0 ? vals.reduce((s, v) => s + v, 0) / vals.length : 0;
    }
}

// Export for browser
if (typeof window !== 'undefined') {
    window.ExcelReportGenerator = ExcelReportGenerator;
}
