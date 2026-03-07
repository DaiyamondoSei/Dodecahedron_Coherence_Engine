/**
 * ========================================
 * MODULE: measurement-store.js
 * ========================================
 *
 * Manages weekly measurement snapshots for longitudinal coherence tracking.
 * Uses localStorage for persistence with JSON export/import capability.
 *
 * This is the scaffolding for a future database — structured to make
 * migration to IndexedDB, SQLite, or a cloud backend straightforward.
 *
 * Storage key: 'quannex_measurements'
 * Format: { measurements: { "wk5": {...}, "wk6": {...} }, lastUpdated: ISO }
 *
 * @module js/measurement-store
 * @author Deimantas Murauskas & Claude
 */

class MeasurementStore {

    static STORAGE_KEY = 'quannex_measurements';

    /**
     * Save a measurement snapshot.
     * @param {Object} measurement - Parsed measurement from ExcelMeasurementParser
     * @returns {string} The measurement key (e.g., "wk5")
     */
    static save(measurement) {
        const store = this.loadStore();
        const key = this.makeKey(measurement);

        store.measurements[key] = {
            ...measurement,
            savedAt: new Date().toISOString()
        };
        store.lastUpdated = new Date().toISOString();

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(store));
        return key;
    }

    /**
     * Get a specific measurement by key.
     * @param {string} key - e.g., "wk5"
     * @returns {Object|null}
     */
    static get(key) {
        const store = this.loadStore();
        return store.measurements[key] || null;
    }

    /**
     * Get all measurements sorted by week number.
     * @returns {Array<{key: string, measurement: Object}>}
     */
    static getAll() {
        const store = this.loadStore();
        return Object.entries(store.measurements)
            .map(([key, measurement]) => ({ key, measurement }))
            .sort((a, b) => {
                const weekA = a.measurement.meta?.week || 0;
                const weekB = b.measurement.meta?.week || 0;
                return weekA - weekB;
            });
    }

    /**
     * Get the most recent measurement.
     * @returns {Object|null}
     */
    static getLatest() {
        const all = this.getAll();
        return all.length > 0 ? all[all.length - 1].measurement : null;
    }

    /**
     * Delete a measurement by key.
     * @param {string} key
     */
    static delete(key) {
        const store = this.loadStore();
        delete store.measurements[key];
        store.lastUpdated = new Date().toISOString();
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(store));
    }

    /**
     * Export all measurements as a downloadable JSON file.
     */
    static exportJSON() {
        const store = this.loadStore();
        const blob = new Blob([JSON.stringify(store, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `quannex-measurements-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    /**
     * Import measurements from a JSON file, merging with existing data.
     * @param {string} jsonString - The JSON content
     * @returns {number} Number of measurements imported
     */
    static importJSON(jsonString) {
        const imported = JSON.parse(jsonString);
        const store = this.loadStore();
        let count = 0;

        const measurements = imported.measurements || imported;
        for (const [key, measurement] of Object.entries(measurements)) {
            if (measurement.meta || measurement.faces) {
                store.measurements[key] = measurement;
                count++;
            }
        }

        store.lastUpdated = new Date().toISOString();
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(store));
        return count;
    }

    /**
     * Get coherence trajectory across all weeks.
     * Returns array of { week, date, globalCoherence, faceEnergies } for charting.
     */
    static getTrajectory() {
        return this.getAll().map(({ key, measurement }) => ({
            key,
            week: measurement.meta?.week,
            date: measurement.meta?.date,
            globalCoherence: measurement.diagnostics?.globalCoherence,
            faceEnergies: measurement.faces?.map(f => ({
                faceId: f.faceId,
                domain: f.domain,
                energy: f.faceEnergy,
                normalizedScore: f.normalizedScore
            })),
            breathAxes: measurement.breathAxes?.map(a => ({
                axisId: a.axisId,
                theme: a.theme,
                score: a.score,
                edgeTension: a.edgeTension
            }))
        }));
    }

    // --- Internal ---

    static loadStore() {
        const raw = localStorage.getItem(this.STORAGE_KEY);
        if (raw) {
            return JSON.parse(raw);
        }
        return { measurements: {}, lastUpdated: null };
    }

    static makeKey(measurement) {
        const week = measurement.meta?.week;
        if (week != null) return `wk${week}`;
        const date = measurement.meta?.date || new Date().toISOString().split('T')[0];
        return `m-${date}`;
    }
}

if (typeof window !== 'undefined') {
    window.MeasurementStore = MeasurementStore;
}
