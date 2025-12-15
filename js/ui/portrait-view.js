/**
 * ========================================
 * PORTRAIT VIEW - The Organizational Gateway
 * ========================================
 *
 * A layered visualization that makes depth accessible:
 * - Layer 1: Simple radial diagram (12 faces, color-coded health)
 * - Layer 2: Elemental breakdown (5 elements per face)
 * - Layer 3: Octave stack (developmental journey)
 * - Layer 4: Full detail (links to complete ontology)
 *
 * Philosophy: "Meet people where they are, invite them deeper"
 *
 * @module PortraitView
 * @version 1.0.0
 */

// ========================================
// CONSTANTS
// ========================================

// PHI derived constants - single source: js/constants/phi-harmonics.js
const _PH = (typeof window !== 'undefined' && window.PhiHarmonics) || {};
const PHI = _PH.PHI_1 || 0.618033988749895;  // Note: This is φ^-1, the golden inverse

const FACE_NAMES = {
    1: 'Financial Capital',
    2: 'Intellectual Capital',
    3: 'Human Capital',
    4: 'Structural Capital',
    5: 'Market Resonance',
    6: 'Community & Partners',
    7: 'Brand & Reputation',
    8: 'Core Operations',
    9: 'Regenerative Flow',
    10: 'Foundational Values',
    11: 'Funding Pipeline',
    12: 'Risk & Resilience'
};

const FACE_ICONS = {
    1: '$', 2: '?', 3: '?', 4: '?',
    5: '?', 6: '?', 7: '?', 8: '?',
    9: '?', 10: '?', 11: '?', 12: '?'
};

const OCTAVE_COLORS = {
    'O1': '#ef4444', 'O2': '#f97316', 'O3': '#eab308',
    'O4': '#22c55e', 'O5': '#06b6d4', 'O6': '#6366f1', 'O7': '#a855f7'
};

const OCTAVE_NAMES = {
    'O1': 'Survival', 'O2': 'Structure', 'O3': 'Relationships',
    'O4': 'Creativity', 'O5': 'Expression', 'O6': 'Vision', 'O7': 'Radiance'
};

const ELEMENT_CONFIG = {
    earth: { symbol: '?', color: '#8b4513', name: 'Earth', quality: 'Tangible' },
    water: { symbol: '?', color: '#1e90ff', name: 'Water', quality: 'Flow' },
    fire: { symbol: '?', color: '#ff4500', name: 'Fire', quality: 'Energy' },
    air: { symbol: '?', color: '#87ceeb', name: 'Air', quality: 'Communication' },
    ether: { symbol: '?', color: '#9370db', name: 'Ether', quality: 'Purpose' }
};

// Health thresholds (PHI-based)
const HEALTH_THRESHOLDS = {
    critical: 0.382,  // PHI squared
    weak: 0.5,
    healthy: 0.618,   // PHI
    strong: 0.764,    // PHI + 0.146
    excellent: 0.854  // 1 - PHI squared
};

// ========================================
// PORTRAIT VIEW CLASS
// ========================================

class PortraitView {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`[PortraitView] Container '${containerId}' not found`);
            return;
        }

        this.options = {
            size: options.size || 400,
            showLabels: options.showLabels !== false,
            interactive: options.interactive !== false,
            ...options
        };

        this.data = null;
        this.selectedFace = null;
        this.currentLayer = 1;

        this._init();
    }

    _init() {
        this.container.innerHTML = '';
        this.container.className = 'portrait-view-container';

        // Create main structure
        this._createStyles();
        this._createStructure();
    }

    _createStyles() {
        if (document.getElementById('portrait-view-styles')) return;

        const style = document.createElement('style');
        style.id = 'portrait-view-styles';
        style.textContent = `
            .portrait-view-container {
                font-family: var(--q-font-family, 'Segoe UI', sans-serif);
                color: var(--q-text-primary, white);
                width: 100%;
            }

            .portrait-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: var(--q-space-md, 12px) var(--q-space-lg, 16px);
                background: var(--q-bg-secondary, rgba(255,255,255,0.05));
                border-radius: var(--q-radius-lg, 12px) var(--q-radius-lg, 12px) 0 0;
                border-bottom: 1px solid var(--q-border, rgba(255,255,255,0.1));
            }

            .portrait-title {
                font-size: var(--q-font-size-lg, 16px);
                font-weight: 600;
            }

            .portrait-breadcrumb {
                font-size: var(--q-font-size-sm, 12px);
                color: var(--q-text-tertiary, rgba(255,255,255,0.5));
            }

            .portrait-breadcrumb span {
                cursor: pointer;
                transition: color 0.2s;
            }

            .portrait-breadcrumb span:hover {
                color: var(--q-accent-primary, #00ffcc);
            }

            .portrait-breadcrumb .active {
                color: var(--q-text-primary, white);
                font-weight: 600;
            }

            .portrait-main {
                display: flex;
                gap: var(--q-space-lg, 16px);
                padding: var(--q-space-lg, 16px);
                background: var(--q-bg-primary, rgba(0,0,0,0.3));
                min-height: 400px;
            }

            .portrait-radial {
                flex: 0 0 auto;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .portrait-detail {
                flex: 1;
                min-width: 0;
                display: flex;
                flex-direction: column;
                gap: var(--q-space-md, 12px);
            }

            .portrait-summary {
                padding: var(--q-space-md, 12px) var(--q-space-lg, 16px);
                background: var(--q-bg-secondary, rgba(255,255,255,0.05));
                border-radius: 0 0 var(--q-radius-lg, 12px) var(--q-radius-lg, 12px);
                border-top: 1px solid var(--q-border, rgba(255,255,255,0.1));
            }

            .summary-text {
                font-size: var(--q-font-size-md, 14px);
                line-height: 1.5;
                color: var(--q-text-secondary, rgba(255,255,255,0.7));
            }

            .summary-text strong {
                color: var(--q-text-primary, white);
            }

            /* Radial Diagram */
            .radial-svg {
                overflow: visible;
            }

            .face-segment {
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .face-segment:hover {
                filter: brightness(1.2);
            }

            .face-segment.selected {
                filter: brightness(1.3) drop-shadow(0 0 8px currentColor);
            }

            .face-label {
                font-size: 10px;
                fill: white;
                pointer-events: none;
                text-anchor: middle;
                dominant-baseline: middle;
            }

            .center-score {
                font-size: 24px;
                font-weight: 700;
                fill: white;
            }

            .center-label {
                font-size: 10px;
                fill: rgba(255,255,255,0.6);
            }

            /* Detail Panel */
            .detail-card {
                background: var(--q-bg-tertiary, rgba(255,255,255,0.02));
                border: 1px solid var(--q-border, rgba(255,255,255,0.1));
                border-radius: var(--q-radius-md, 8px);
                overflow: hidden;
            }

            .detail-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: var(--q-space-sm, 8px) var(--q-space-md, 12px);
                background: var(--q-bg-secondary, rgba(255,255,255,0.05));
                border-bottom: 1px solid var(--q-border, rgba(255,255,255,0.1));
            }

            .detail-title {
                font-weight: 600;
                font-size: var(--q-font-size-md, 14px);
            }

            .detail-score {
                font-size: var(--q-font-size-sm, 12px);
                padding: 2px 8px;
                border-radius: var(--q-radius-sm, 4px);
            }

            .detail-body {
                padding: var(--q-space-md, 12px);
            }

            .element-row {
                display: flex;
                align-items: center;
                gap: var(--q-space-sm, 8px);
                padding: var(--q-space-xs, 4px) 0;
            }

            .element-symbol {
                width: 24px;
                text-align: center;
                font-size: 14px;
            }

            .element-name {
                width: 60px;
                font-size: var(--q-font-size-xs, 10px);
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .element-bar-container {
                flex: 1;
                height: 8px;
                background: rgba(255,255,255,0.1);
                border-radius: 4px;
                overflow: hidden;
            }

            .element-bar {
                height: 100%;
                border-radius: 4px;
                transition: width 0.3s ease;
            }

            .element-value {
                width: 40px;
                text-align: right;
                font-size: var(--q-font-size-sm, 12px);
                font-weight: 600;
            }

            /* Octave Stack */
            .octave-stack {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }

            .octave-row {
                display: flex;
                align-items: center;
                gap: var(--q-space-sm, 8px);
                padding: 4px 8px;
                border-radius: var(--q-radius-sm, 4px);
                transition: background 0.2s;
            }

            .octave-row:hover {
                background: var(--q-bg-hover, rgba(255,255,255,0.08));
            }

            .octave-row.target {
                background: var(--q-bg-active, rgba(255,255,255,0.12));
                border-left: 3px solid currentColor;
            }

            .octave-label {
                width: 30px;
                font-size: var(--q-font-size-xs, 10px);
                font-weight: 700;
            }

            .octave-name {
                width: 80px;
                font-size: var(--q-font-size-sm, 12px);
            }

            .octave-indicator {
                flex: 1;
                height: 4px;
                background: rgba(255,255,255,0.1);
                border-radius: 2px;
                overflow: hidden;
            }

            .octave-fill {
                height: 100%;
                border-radius: 2px;
            }

            .octave-status {
                font-size: var(--q-font-size-xs, 10px);
                color: var(--q-text-tertiary, rgba(255,255,255,0.5));
            }

            /* Responsive */
            @media (max-width: 600px) {
                .portrait-main {
                    flex-direction: column;
                    align-items: center;
                }
            }
        `;
        document.head.appendChild(style);
    }

    _createStructure() {
        this.container.innerHTML = `
            <div class="portrait-header">
                <div class="portrait-title">Organizational Portrait</div>
                <div class="portrait-breadcrumb">
                    <span data-layer="1" class="active">Overview</span>
                </div>
            </div>
            <div class="portrait-main">
                <div class="portrait-radial"></div>
                <div class="portrait-detail">
                    <div class="detail-placeholder" style="
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        height: 100%;
                        color: var(--q-text-tertiary);
                        font-size: 14px;
                    ">
                        Click a face to explore
                    </div>
                </div>
            </div>
            <div class="portrait-summary">
                <div class="summary-text">
                    Analyzing organizational coherence...
                </div>
            </div>
        `;

        // Bind breadcrumb clicks
        this.container.querySelectorAll('.portrait-breadcrumb span').forEach(el => {
            el.addEventListener('click', () => {
                const layer = parseInt(el.dataset.layer);
                this._navigateToLayer(layer);
            });
        });
    }

    // ========================================
    // PUBLIC API
    // ========================================

    /**
     * Update the portrait with new data
     * @param {Object} data - Organization data with faces, kpis, octave
     */
    update(data) {
        this.data = this._normalizeData(data);
        this.selectedFace = null;
        this.currentLayer = 1;

        this._renderRadial();
        this._updateSummary();
        this._updateBreadcrumb();
        this._clearDetail();
    }

    /**
     * Select a specific face
     */
    selectFace(faceId) {
        this.selectedFace = faceId;
        this._highlightFace(faceId);
        this._renderFaceDetail(faceId);
        this._updateBreadcrumb();
    }

    // ========================================
    // DATA NORMALIZATION
    // ========================================

    _normalizeData(data) {
        const normalized = {
            faces: {},
            octave: data.octave || 'O2',
            overallCoherence: 0
        };

        // Extract face data from various formats
        if (data.faces && typeof data.faces === 'object') {
            // Object format: { faceId: { ... } }
            for (const [faceId, faceData] of Object.entries(data.faces)) {
                normalized.faces[faceId] = this._normalizeFaceData(faceId, faceData);
            }
        } else if (data.byFace && typeof data.byFace === 'object') {
            // KPI extraction format
            for (const [faceId, faceData] of Object.entries(data.byFace)) {
                normalized.faces[faceId] = this._normalizeFaceData(faceId, faceData);
            }
        } else if (Array.isArray(data.faces)) {
            // Array format
            data.faces.forEach((face, idx) => {
                const faceId = face.id || face.faceId || (idx + 1);
                normalized.faces[faceId] = this._normalizeFaceData(faceId, face);
            });
        }

        // Ensure all 12 faces exist
        for (let i = 1; i <= 12; i++) {
            if (!normalized.faces[i]) {
                normalized.faces[i] = this._normalizeFaceData(i, {});
            }
        }

        // Calculate overall coherence (geometric mean)
        const scores = Object.values(normalized.faces).map(f => f.coherence || 0.5);
        if (scores.length > 0 && scores.every(s => s > 0)) {
            normalized.overallCoherence = Math.pow(
                scores.reduce((a, b) => a * b, 1),
                1 / scores.length
            );
        }

        return normalized;
    }

    _normalizeFaceData(faceId, data) {
        const face = {
            id: parseInt(faceId),
            name: data.name || data.faceName || FACE_NAMES[faceId] || `Face ${faceId}`,
            coherence: data.coherence || data.sentiment || data.health || 0.5,
            elements: {},
            octaveStack: data.octaveStack || null,
            kpis: data.kpis || []
        };

        // Normalize elements
        const elements = ['earth', 'water', 'fire', 'air', 'ether'];
        elements.forEach(elem => {
            if (data.elements && data.elements[elem] !== undefined) {
                face.elements[elem] = data.elements[elem];
            } else if (data.kpis && Array.isArray(data.kpis)) {
                // Try to extract from KPIs
                const elemKpi = data.kpis.find(k =>
                    (k.elementCode || k.element || '').toLowerCase() === elem
                );
                face.elements[elem] = elemKpi?.value || elemKpi?.coherence || face.coherence;
            } else {
                face.elements[elem] = face.coherence;
            }
        });

        return face;
    }

    // ========================================
    // RENDERING
    // ========================================

    _renderRadial() {
        const container = this.container.querySelector('.portrait-radial');
        if (!container) return;

        const size = this.options.size;
        const centerX = size / 2;
        const centerY = size / 2;
        const outerRadius = size / 2 - 30;
        const innerRadius = outerRadius * 0.4;

        let svg = `<svg class="radial-svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`;

        // Draw face segments
        for (let i = 1; i <= 12; i++) {
            const face = this.data?.faces[i] || { coherence: 0.5 };
            const startAngle = ((i - 1) / 12) * 2 * Math.PI - Math.PI / 2;
            const endAngle = (i / 12) * 2 * Math.PI - Math.PI / 2;

            const color = this._getHealthColor(face.coherence);

            // Calculate arc points
            const x1 = centerX + innerRadius * Math.cos(startAngle);
            const y1 = centerY + innerRadius * Math.sin(startAngle);
            const x2 = centerX + outerRadius * Math.cos(startAngle);
            const y2 = centerY + outerRadius * Math.sin(startAngle);
            const x3 = centerX + outerRadius * Math.cos(endAngle);
            const y3 = centerY + outerRadius * Math.sin(endAngle);
            const x4 = centerX + innerRadius * Math.cos(endAngle);
            const y4 = centerY + innerRadius * Math.sin(endAngle);

            // Create path
            const path = `
                M ${x1} ${y1}
                L ${x2} ${y2}
                A ${outerRadius} ${outerRadius} 0 0 1 ${x3} ${y3}
                L ${x4} ${y4}
                A ${innerRadius} ${innerRadius} 0 0 0 ${x1} ${y1}
                Z
            `;

            svg += `
                <path
                    class="face-segment ${this.selectedFace === i ? 'selected' : ''}"
                    d="${path}"
                    fill="${color}"
                    stroke="rgba(0,0,0,0.3)"
                    stroke-width="1"
                    data-face="${i}"
                />
            `;

            // Add label
            if (this.options.showLabels) {
                const midAngle = (startAngle + endAngle) / 2;
                const labelRadius = (innerRadius + outerRadius) / 2;
                const lx = centerX + labelRadius * Math.cos(midAngle);
                const ly = centerY + labelRadius * Math.sin(midAngle);

                svg += `
                    <text class="face-label" x="${lx}" y="${ly}">${i}</text>
                `;
            }
        }

        // Center circle with overall score
        const overall = this.data?.overallCoherence || 0.5;
        const centerColor = this._getHealthColor(overall);
        svg += `
            <circle cx="${centerX}" cy="${centerY}" r="${innerRadius - 5}"
                    fill="rgba(0,0,0,0.6)" stroke="${centerColor}" stroke-width="2"/>
            <text class="center-score" x="${centerX}" y="${centerY - 5}"
                  text-anchor="middle">${(overall * 100).toFixed(0)}</text>
            <text class="center-label" x="${centerX}" y="${centerY + 15}"
                  text-anchor="middle">Coherence</text>
        `;

        svg += '</svg>';
        container.innerHTML = svg;

        // Bind click events
        container.querySelectorAll('.face-segment').forEach(el => {
            el.addEventListener('click', () => {
                const faceId = parseInt(el.dataset.face);
                this.selectFace(faceId);
            });
        });
    }

    _highlightFace(faceId) {
        this.container.querySelectorAll('.face-segment').forEach(el => {
            el.classList.toggle('selected', parseInt(el.dataset.face) === faceId);
        });
    }

    _renderFaceDetail(faceId) {
        const detail = this.container.querySelector('.portrait-detail');
        if (!detail) return;

        const face = this.data?.faces[faceId];
        if (!face) return;

        const healthColor = this._getHealthColor(face.coherence);
        const healthLabel = this._getHealthLabel(face.coherence);

        detail.innerHTML = `
            <div class="detail-card">
                <div class="detail-header">
                    <div class="detail-title">Face ${faceId}: ${face.name}</div>
                    <div class="detail-score" style="background: ${healthColor}33; color: ${healthColor};">
                        ${healthLabel} (${(face.coherence * 100).toFixed(0)}%)
                    </div>
                </div>
                <div class="detail-body">
                    ${this._renderElements(face)}
                </div>
            </div>

            ${this._renderOctaveStack(face)}

            ${this._renderKPIPreview(face)}
        `;
    }

    _renderElements(face) {
        const elements = ['earth', 'water', 'fire', 'air', 'ether'];

        // Count explored elements
        const exploredCount = elements.filter(elem => {
            const elemData = face.elements?.[elem];
            return elemData?.explored === true || (typeof elemData === 'number' && elemData !== 0.5);
        }).length;

        return `
            <div class="elements-section">
                <div class="elements-header" style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 11px; color: rgba(255,255,255,0.5);">
                    <span>Elemental Questions</span>
                    <span>${exploredCount}/5 explored</span>
                </div>
                ${elements.map(elem => {
                    const config = ELEMENT_CONFIG[elem];
                    const elemData = face.elements?.[elem];

                    // Determine if element is explored or unexplored
                    const isExplored = elemData?.explored === true ||
                                      (typeof elemData === 'number' && elemData !== 0.5) ||
                                      (typeof elemData === 'object' && elemData?.value !== null && elemData?.value !== 0.5);

                    // Get value - null/undefined means unexplored
                    const rawValue = typeof elemData === 'object' ? elemData?.value : elemData;
                    const value = isExplored ? (rawValue ?? 0.5) : null;
                    const width = value !== null ? Math.max(0, Math.min(100, value * 100)) : 0;

                    // Get question and KPI name if available
                    const question = elemData?.question || config.quality;
                    const kpiName = elemData?.kpiName || elemData?.label || '';

                    if (!isExplored) {
                        // Unexplored element - show as question
                        return `
                            <div class="element-row unexplored" style="opacity: 0.5;">
                                <div class="element-symbol" style="color: ${config.color}">?</div>
                                <div class="element-name" style="color: ${config.color}">${config.name.toUpperCase()}</div>
                                <div class="element-bar-container" style="position: relative;">
                                    <div class="element-question" style="font-size: 10px; color: rgba(255,255,255,0.4); font-style: italic;">
                                        ${question}
                                    </div>
                                </div>
                                <div class="element-value" style="color: rgba(255,255,255,0.3);">—</div>
                            </div>
                        `;
                    } else {
                        // Explored element - show value with KPI info
                        return `
                            <div class="element-row explored">
                                <div class="element-symbol" style="color: ${config.color}">${config.symbol}</div>
                                <div class="element-name" style="color: ${config.color}">${config.name.toUpperCase()}</div>
                                <div class="element-bar-container">
                                    <div class="element-bar" style="width: ${width}%; background: ${config.color};"></div>
                                    ${kpiName ? `<div class="element-kpi-name" style="position: absolute; top: -14px; left: 0; font-size: 9px; color: rgba(255,255,255,0.5);">${kpiName}</div>` : ''}
                                </div>
                                <div class="element-value" style="color: ${config.color}">${(value * 100).toFixed(0)}%</div>
                            </div>
                        `;
                    }
                }).join('')}
            </div>
        `;
    }

    _renderOctaveStack(face) {
        const targetOctave = this.data?.octave || 'O2';
        const octaves = ['O1', 'O2', 'O3', 'O4', 'O5', 'O6', 'O7'];
        const targetIndex = octaves.indexOf(targetOctave);

        return `
            <div class="detail-card">
                <div class="detail-header">
                    <div class="detail-title">Developmental Journey</div>
                    <div class="detail-score" style="background: ${OCTAVE_COLORS[targetOctave]}33; color: ${OCTAVE_COLORS[targetOctave]};">
                        Target: ${targetOctave}
                    </div>
                </div>
                <div class="detail-body">
                    <div class="octave-stack">
                        ${octaves.slice(0, targetIndex + 1).map((octave, idx) => {
                            const isTarget = octave === targetOctave;
                            const color = OCTAVE_COLORS[octave];
                            const name = OCTAVE_NAMES[octave];

                            // Estimate health for each octave (foundation vs target)
                            const health = isTarget ? face.coherence :
                                           (face.coherence * (0.8 + idx * 0.05)); // Foundation tends to be slightly stronger

                            const status = idx < targetIndex ? 'Foundation' : 'Target';

                            return `
                                <div class="octave-row ${isTarget ? 'target' : ''}" style="color: ${color};">
                                    <div class="octave-label">${octave}</div>
                                    <div class="octave-name">${name}</div>
                                    <div class="octave-indicator">
                                        <div class="octave-fill" style="width: ${health * 100}%; background: ${color};"></div>
                                    </div>
                                    <div class="octave-status">${status}</div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    _renderKPIPreview(face) {
        if (!face.kpis || face.kpis.length === 0) return '';

        const preview = face.kpis.slice(0, 3);

        return `
            <div class="detail-card">
                <div class="detail-header">
                    <div class="detail-title">Key Indicators</div>
                    <div class="detail-score" style="background: var(--q-bg-secondary); color: var(--q-text-secondary);">
                        ${face.kpis.length} KPIs
                    </div>
                </div>
                <div class="detail-body">
                    ${preview.map(kpi => `
                        <div style="
                            display: flex;
                            justify-content: space-between;
                            padding: 4px 0;
                            font-size: 12px;
                            border-bottom: 1px solid var(--q-border);
                        ">
                            <span style="color: var(--q-text-secondary);">${kpi.label || kpi.name}</span>
                            <span style="color: var(--q-text-primary);">${kpi.value ?? '-'} ${kpi.unit || ''}</span>
                        </div>
                    `).join('')}
                    ${face.kpis.length > 3 ? `
                        <div style="
                            padding-top: 8px;
                            font-size: 11px;
                            color: var(--q-text-tertiary);
                        ">
                            +${face.kpis.length - 3} more indicators
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    _clearDetail() {
        const detail = this.container.querySelector('.portrait-detail');
        if (detail) {
            detail.innerHTML = `
                <div class="detail-placeholder" style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    color: var(--q-text-tertiary);
                    font-size: 14px;
                ">
                    Click a face to explore its health
                </div>
            `;
        }
    }

    // ========================================
    // SUMMARY GENERATION
    // ========================================

    _updateSummary() {
        const summary = this.container.querySelector('.summary-text');
        if (!summary || !this.data) return;

        const text = this._generatePlainLanguageSummary();
        summary.innerHTML = text;
    }

    _generatePlainLanguageSummary() {
        const data = this.data;
        if (!data) return 'No data available.';

        const overall = data.overallCoherence;
        const octave = data.octave;
        const octaveName = OCTAVE_NAMES[octave];

        // Find strongest and weakest faces
        const faceScores = Object.entries(data.faces)
            .map(([id, face]) => ({ id: parseInt(id), name: face.name, score: face.coherence }))
            .sort((a, b) => b.score - a.score);

        const strongest = faceScores[0];
        const weakest = faceScores[faceScores.length - 1];

        // Count faces by health category
        const healthCounts = { critical: 0, weak: 0, healthy: 0, strong: 0 };
        faceScores.forEach(f => {
            if (f.score < HEALTH_THRESHOLDS.critical) healthCounts.critical++;
            else if (f.score < HEALTH_THRESHOLDS.weak) healthCounts.weak++;
            else if (f.score < HEALTH_THRESHOLDS.strong) healthCounts.healthy++;
            else healthCounts.strong++;
        });

        // Build narrative
        let narrative = '';

        // Overall health statement
        if (overall >= HEALTH_THRESHOLDS.strong) {
            narrative += `<strong>Strong overall coherence</strong> (${(overall * 100).toFixed(0)}%). `;
        } else if (overall >= HEALTH_THRESHOLDS.healthy) {
            narrative += `<strong>Healthy coherence</strong> (${(overall * 100).toFixed(0)}%). `;
        } else if (overall >= HEALTH_THRESHOLDS.weak) {
            narrative += `<strong>Developing coherence</strong> (${(overall * 100).toFixed(0)}%). `;
        } else {
            narrative += `<strong>Coherence needs attention</strong> (${(overall * 100).toFixed(0)}%). `;
        }

        // Octave context
        narrative += `Operating at <strong>${octave} (${octaveName})</strong> level. `;

        // Strengths and gaps
        if (strongest && weakest && strongest.id !== weakest.id) {
            narrative += `<strong>${strongest.name}</strong> is your strongest area. `;
            if (weakest.score < HEALTH_THRESHOLDS.weak) {
                narrative += `<strong>${weakest.name}</strong> may need attention. `;
            }
        }

        // Warning if critical areas exist
        if (healthCounts.critical > 0) {
            narrative += `<span style="color: var(--q-accent-warning);">`;
            narrative += `${healthCounts.critical} ${healthCounts.critical === 1 ? 'area requires' : 'areas require'} urgent attention.`;
            narrative += `</span>`;
        }

        return narrative;
    }

    // ========================================
    // NAVIGATION
    // ========================================

    _updateBreadcrumb() {
        const breadcrumb = this.container.querySelector('.portrait-breadcrumb');
        if (!breadcrumb) return;

        let html = '<span data-layer="1" class="' + (this.currentLayer === 1 ? 'active' : '') + '">Overview</span>';

        if (this.selectedFace) {
            const face = this.data?.faces[this.selectedFace];
            html += ' > ';
            html += `<span data-layer="2" class="${this.currentLayer === 2 ? 'active' : ''}">${face?.name || 'Face ' + this.selectedFace}</span>`;
        }

        breadcrumb.innerHTML = html;

        // Rebind clicks
        breadcrumb.querySelectorAll('span').forEach(el => {
            el.addEventListener('click', () => {
                const layer = parseInt(el.dataset.layer);
                this._navigateToLayer(layer);
            });
        });
    }

    _navigateToLayer(layer) {
        if (layer === 1) {
            this.selectedFace = null;
            this._highlightFace(null);
            this._clearDetail();
        }
        this.currentLayer = layer;
        this._updateBreadcrumb();
    }

    // ========================================
    // HELPERS
    // ========================================

    _getHealthColor(score) {
        if (score >= HEALTH_THRESHOLDS.strong) return '#22c55e';  // Green
        if (score >= HEALTH_THRESHOLDS.healthy) return '#84cc16'; // Lime
        if (score >= HEALTH_THRESHOLDS.weak) return '#eab308';    // Yellow
        if (score >= HEALTH_THRESHOLDS.critical) return '#f97316'; // Orange
        return '#ef4444'; // Red
    }

    _getHealthLabel(score) {
        if (score >= HEALTH_THRESHOLDS.excellent) return 'Excellent';
        if (score >= HEALTH_THRESHOLDS.strong) return 'Strong';
        if (score >= HEALTH_THRESHOLDS.healthy) return 'Healthy';
        if (score >= HEALTH_THRESHOLDS.weak) return 'Developing';
        if (score >= HEALTH_THRESHOLDS.critical) return 'Weak';
        return 'Critical';
    }
}

// ========================================
// EXPORTS
// ========================================

export { PortraitView, FACE_NAMES, OCTAVE_COLORS, OCTAVE_NAMES, ELEMENT_CONFIG };

// Export for browser global
if (typeof window !== 'undefined') {
    window.PortraitView = PortraitView;
}

console.log('[PortraitView] Module loaded');
