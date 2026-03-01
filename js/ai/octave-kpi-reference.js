/**
 * ========================================
 * OCTAVE KPI REFERENCE - CSV Template Loader
 * ========================================
 *
 * Loads and parses the 420 KPI templates from CSV_Refrence_Models.csv
 * Provides functions for accessing KPIs by face, octave, and element
 *
 * Structure:
 * - 12 Faces × 7 Octaves × 5 Elements = 420 KPIs
 * - Each KPI has: name, question, direction, targets, rationale
 *
 * @module OctaveKPIReference
 * @version Sprint 2 - Phase 2 (Octave-Stack Architecture)
 */

// Element definitions
const ELEMENTS = ['earth', 'water', 'fire', 'air', 'ether'];
const ELEMENT_NAMES = {
    earth: 'Earth',
    water: 'Water',
    fire: 'Fire',
    air: 'Air',
    ether: 'Ether'
};

// Octave definitions
const OCTAVES = ['O1', 'O2', 'O3', 'O4', 'O5', 'O6', 'O7'];
const OCTAVE_NAMES = {
    'O1': 'Survival',
    'O2': 'Structure',
    'O3': 'Relationships',
    'O4': 'Creativity',
    'O5': 'Expression',
    'O6': 'Vision',
    'O7': 'Radiance'
};
const OCTAVE_FOCUS = {
    'O1': 'Existence',
    'O2': 'Stability',
    'O3': 'Connection',
    'O4': 'Possibility',
    'O5': 'Clarity',
    'O6': 'Direction',
    'O7': 'Service'
};

// Face definitions
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

/**
 * OctaveKPIReference - CSV-based KPI template provider
 */
class OctaveKPIReference {
    constructor() {
        this.kpiDatabase = new Map(); // Map<faceId, Map<octave, Map<element, KPI>>>
        this.loaded = false;
        this.loadPromise = null;
    }

    /**
     * Load KPI templates from CSV (lazy loading)
     */
    async load() {
        if (this.loaded) return this;
        if (this.loadPromise) return this.loadPromise;

        this.loadPromise = this._loadFromCSV();
        await this.loadPromise;
        return this;
    }

    /**
     * Internal CSV loading and parsing
     */
    async _loadFromCSV() {
        try {
            const response = await fetch('/data/CSV_Refrence_Models.csv');
            if (!response.ok) {
                Logger.warn('OctaveKPIReference', 'CSV not found, using embedded templates');
                this._loadEmbeddedTemplates();
                this.loaded = true;
                return;
            }

            const csvText = await response.text();
            this._parseCSV(csvText);
            this.loaded = true;
            Logger.info('OctaveKPIReference', `Loaded ${this.getTotalKPICount()} KPI templates from CSV`);
        } catch (error) {
            Logger.warn('OctaveKPIReference', 'Failed to load CSV, using embedded templates', error);
            this._loadEmbeddedTemplates();
            this.loaded = true;
        }
    }

    /**
     * Parse the CSV content
     * Structure: Face ID column, then 7 octave sections with columns:
     * Octave, Element, Question, KPI Name, Direction, Value, Target_Min, Healthy_Min, Healthy_Max, Absolute_Max, Rationale
     */
    _parseCSV(csvText) {
        const lines = csvText.split('\n');

        // Find the header row (contains "Face (Domain)")
        let headerRowIndex = -1;
        for (let i = 0; i < Math.min(20, lines.length); i++) {
            if (lines[i].includes('Face (Domain)') || lines[i].includes('F. ID')) {
                headerRowIndex = i;
                break;
            }
        }

        if (headerRowIndex === -1) {
            Logger.warn('OctaveKPIReference', 'Could not find header row, using embedded templates');
            this._loadEmbeddedTemplates();
            return;
        }

        // Parse data rows (starting after header)
        let currentFaceId = 0;
        let currentElementIndex = 0;

        for (let i = headerRowIndex + 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line || line.startsWith(',,,')) continue;

            const values = this._parseCSVLine(line);
            if (!values || values.length < 10) continue;

            // Detect face ID from first column
            const faceCell = values[0];
            if (faceCell && faceCell.includes('F') && faceCell.match(/\(F(\d+)\)/)) {
                const match = faceCell.match(/\(F(\d+)\)/);
                if (match) {
                    currentFaceId = parseInt(match[1]);
                    currentElementIndex = 0;
                }
            }

            if (currentFaceId < 1 || currentFaceId > 12) continue;

            // Determine element from row position within face (0-4 = earth-ether)
            const element = ELEMENTS[currentElementIndex % 5];
            currentElementIndex++;

            // Parse KPIs for each octave
            // CSV structure: each octave has ~12 columns
            this._parseOctaveKPIs(currentFaceId, element, values);
        }
    }

    /**
     * Parse a CSV line handling quoted fields
     */
    _parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuotes = !inQuotes;
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
     * Parse KPIs for all octaves from a single row
     */
    _parseOctaveKPIs(faceId, element, values) {
        // Column offsets for each octave (approximate - adjust based on actual CSV)
        // O1 starts around column 1, each octave section has ~12 columns
        const octaveOffsets = {
            'O1': { name: 1, element: 2, question: 3, kpiName: 4, direction: 5, value: 6, targetMin: 7, healthyMin: 8, healthyMax: 9, rationale: 11 },
            'O2': { name: 13, element: 14, question: 15, kpiName: 16, direction: 17, targetMin: 18, healthyMin: 19, healthyMax: 20, rationale: 22 },
            'O3': { name: 24, element: 25, question: 26, kpiName: 27, direction: 28, targetMin: 29, healthyMin: 30, healthyMax: 31, rationale: 33 },
            'O4': { name: 35, element: 36, question: 37, kpiName: 38, direction: 39, targetMin: 40, healthyMin: 41, healthyMax: 42, rationale: 44 },
            'O5': { name: 46, element: 47, question: 48, kpiName: 49, direction: 50, targetMin: 51, healthyMin: 52, healthyMax: 53, rationale: 55 },
            'O6': { name: 57, element: 58, question: 59, kpiName: 60, direction: 61, targetMin: 62, healthyMin: 63, healthyMax: 64, rationale: 66 },
            'O7': { name: 68, element: 69, question: 70, kpiName: 71, direction: 72, targetMin: 73, healthyMin: 74, healthyMax: 75, rationale: 77 }
        };

        for (const octave of OCTAVES) {
            const offsets = octaveOffsets[octave];
            if (!offsets) continue;

            // Extract values with bounds checking
            const getValue = (idx) => (idx < values.length) ? values[idx] : '';

            const kpi = {
                faceId: faceId,
                faceName: FACE_NAMES[faceId],
                octave: octave,
                octaveName: OCTAVE_NAMES[octave],
                element: ELEMENT_NAMES[element],
                elementCode: element,
                label: getValue(offsets.kpiName) || `${FACE_NAMES[faceId]} ${ELEMENT_NAMES[element]} KPI`,
                question: getValue(offsets.question) || this._getDefaultQuestion(element),
                direction: getValue(offsets.direction) || '?',
                targetMin: getValue(offsets.targetMin),
                healthyMin: getValue(offsets.healthyMin),
                healthyMax: getValue(offsets.healthyMax),
                rationale: getValue(offsets.rationale) || '',
                source: 'csv_template'
            };

            // Store in database
            this._storeKPI(faceId, octave, element, kpi);
        }
    }

    /**
     * Store a KPI in the database
     */
    _storeKPI(faceId, octave, element, kpi) {
        if (!this.kpiDatabase.has(faceId)) {
            this.kpiDatabase.set(faceId, new Map());
        }
        const faceMap = this.kpiDatabase.get(faceId);

        if (!faceMap.has(octave)) {
            faceMap.set(octave, new Map());
        }
        const octaveMap = faceMap.get(octave);

        octaveMap.set(element, kpi);
    }

    /**
     * Get default question for an element
     */
    _getDefaultQuestion(element) {
        const questions = {
            earth: 'Is it grounded?',
            water: 'Is it flowing?',
            fire: 'Is it energized?',
            air: 'Is it communicated?',
            ether: 'Is it aligned?'
        };
        return questions[element] || 'How healthy is this area?';
    }

    /**
     * Load embedded templates when CSV is unavailable
     */
    _loadEmbeddedTemplates() {
        // Generate basic templates for all 420 KPIs
        for (let faceId = 1; faceId <= 12; faceId++) {
            for (const octave of OCTAVES) {
                for (const element of ELEMENTS) {
                    const kpi = {
                        faceId: faceId,
                        faceName: FACE_NAMES[faceId],
                        octave: octave,
                        octaveName: OCTAVE_NAMES[octave],
                        element: ELEMENT_NAMES[element],
                        elementCode: element,
                        label: this._generateDefaultLabel(faceId, octave, element),
                        question: this._generateDefaultQuestion(faceId, octave, element),
                        direction: '?',
                        targetMin: '0',
                        healthyMin: '0.382',
                        healthyMax: '0.764',
                        rationale: `${OCTAVE_NAMES[octave]} level ${ELEMENT_NAMES[element]} aspect of ${FACE_NAMES[faceId]}`,
                        source: 'embedded_template'
                    };
                    this._storeKPI(faceId, octave, element, kpi);
                }
            }
        }
    }

    /**
     * Generate default KPI label
     */
    _generateDefaultLabel(faceId, octave, element) {
        const prefixes = {
            'O1': 'Basic',
            'O2': 'Structured',
            'O3': 'Relational',
            'O4': 'Creative',
            'O5': 'Expressive',
            'O6': 'Visionary',
            'O7': 'Radiant'
        };

        const elementSuffix = {
            earth: 'Assets',
            water: 'Flow',
            fire: 'Energy',
            air: 'Clarity',
            ether: 'Alignment'
        };

        return `${prefixes[octave]} ${FACE_NAMES[faceId]} ${elementSuffix[element]}`;
    }

    /**
     * Generate default question based on octave and element
     */
    _generateDefaultQuestion(faceId, octave, element) {
        const octaveFocus = OCTAVE_FOCUS[octave];
        const elementQuestions = {
            earth: `At ${octave} (${octaveFocus}), what tangible ${FACE_NAMES[faceId].toLowerCase()} do we have?`,
            water: `At ${octave} (${octaveFocus}), how does ${FACE_NAMES[faceId].toLowerCase()} flow?`,
            fire: `At ${octave} (${octaveFocus}), what energizes our ${FACE_NAMES[faceId].toLowerCase()}?`,
            air: `At ${octave} (${octaveFocus}), how clearly is ${FACE_NAMES[faceId].toLowerCase()} communicated?`,
            ether: `At ${octave} (${octaveFocus}), is ${FACE_NAMES[faceId].toLowerCase()} aligned with purpose?`
        };
        return elementQuestions[element];
    }

    // ========================================
    // PUBLIC API
    // ========================================

    /**
     * Get a single KPI template
     * @param {number} faceId - Face ID (1-12)
     * @param {string} octave - Octave ('O1'-'O7')
     * @param {string} element - Element code ('earth', 'water', 'fire', 'air', 'ether')
     * @returns {Object|null} KPI template or null
     */
    getKPITemplate(faceId, octave, element) {
        const faceMap = this.kpiDatabase.get(faceId);
        if (!faceMap) return null;

        const octaveMap = faceMap.get(octave);
        if (!octaveMap) return null;

        return octaveMap.get(element) || null;
    }

    /**
     * Get all KPIs for a specific face and octave (5 elements)
     * @param {number} faceId - Face ID (1-12)
     * @param {string} octave - Octave ('O1'-'O7')
     * @returns {Array} Array of 5 KPI templates
     */
    getOctaveKPIs(faceId, octave) {
        const kpis = [];
        for (const element of ELEMENTS) {
            const kpi = this.getKPITemplate(faceId, octave, element);
            if (kpi) kpis.push(kpi);
        }
        return kpis;
    }

    /**
     * Get foundation KPIs for a face (all octaves below target)
     * @param {number} faceId - Face ID (1-12)
     * @param {string} targetOctave - Target octave ('O1'-'O7')
     * @returns {Object} Map of octave -> array of 5 KPIs
     */
    getFoundationKPIs(faceId, targetOctave) {
        const targetIndex = OCTAVES.indexOf(targetOctave);
        const foundation = {};

        for (let i = 0; i < targetIndex; i++) {
            const octave = OCTAVES[i];
            foundation[octave] = {
                name: OCTAVE_NAMES[octave],
                focus: OCTAVE_FOCUS[octave],
                kpis: this.getOctaveKPIs(faceId, octave),
                status: 'foundation'
            };
        }

        return foundation;
    }

    /**
     * Get the complete octave stack for a face
     * @param {number} faceId - Face ID (1-12)
     * @param {string} targetOctave - Target octave
     * @returns {Object} Full octave stack with foundation + target
     */
    getOctaveStack(faceId, targetOctave) {
        const foundation = this.getFoundationKPIs(faceId, targetOctave);

        // Add target octave
        foundation[targetOctave] = {
            name: OCTAVE_NAMES[targetOctave],
            focus: OCTAVE_FOCUS[targetOctave],
            kpis: this.getOctaveKPIs(faceId, targetOctave),
            status: 'target'
        };

        return foundation;
    }

    /**
     * Get all KPIs for a face (all 7 octaves × 5 elements = 35 KPIs)
     * @param {number} faceId - Face ID (1-12)
     * @returns {Array} Array of 35 KPI templates
     */
    getAllKPIsForFace(faceId) {
        const kpis = [];
        for (const octave of OCTAVES) {
            kpis.push(...this.getOctaveKPIs(faceId, octave));
        }
        return kpis;
    }

    /**
     * Get total KPI count in database
     */
    getTotalKPICount() {
        let count = 0;
        for (const faceMap of this.kpiDatabase.values()) {
            for (const octaveMap of faceMap.values()) {
                count += octaveMap.size;
            }
        }
        return count;
    }

    /**
     * Get octave information
     */
    getOctaveInfo(octave) {
        return {
            code: octave,
            name: OCTAVE_NAMES[octave],
            focus: OCTAVE_FOCUS[octave],
            index: OCTAVES.indexOf(octave)
        };
    }

    /**
     * Get face information
     */
    getFaceInfo(faceId) {
        return {
            id: faceId,
            name: FACE_NAMES[faceId]
        };
    }
}

// ========================================
// SINGLETON INSTANCE
// ========================================

let instance = null;

/**
 * Get the singleton instance of OctaveKPIReference
 * @returns {Promise<OctaveKPIReference>} Loaded instance
 */
async function getOctaveKPIReference() {
    if (!instance) {
        instance = new OctaveKPIReference();
        await instance.load();
    }
    return instance;
}

// ========================================
// EXPORTS
// ========================================

export {
    OctaveKPIReference,
    getOctaveKPIReference,
    ELEMENTS,
    ELEMENT_NAMES,
    OCTAVES,
    OCTAVE_NAMES,
    OCTAVE_FOCUS,
    FACE_NAMES
};

// Export for browser global
if (typeof window !== 'undefined') {
    window.OctaveKPIReference = OctaveKPIReference;
    window.getOctaveKPIReference = getOctaveKPIReference;
}

Logger.info('OctaveKPIReference', 'Module loaded');
