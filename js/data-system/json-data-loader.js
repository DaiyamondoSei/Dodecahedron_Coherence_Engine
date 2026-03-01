/**
 * ============================================================================
 * JSON DATA LOADER - JSON-First Loading with CSV Fallback
 * ============================================================================
 *
 * VERSION: 2.0.0
 * CREATED: 2025-12-26 by Claude Opus 4.5
 * VERIFICATION: Pending integration test
 * COMPLEXITY: Medium
 * DATA INTEGRITY: Protected (validates JSON schema, reports pre-computed substitutions)
 *
 * ============================================================================
 * NOTES FOR FUTURE CLAUDE
 * ============================================================================
 *
 * WHAT THIS DOES:
 * ────────────────────────────────────────────────────────────────────────────
 * This module provides a JSON-first data loading strategy with graceful
 * fallback to CSV files. It's designed to work with the self-documenting
 * JSON files produced by CSVToJSONConverter.
 *
 * LOADING STRATEGY:
 * ────────────────────────────────────────────────────────────────────────────
 * 1. Try to load JSON from data/json/{type}.json
 * 2. If JSON exists and validates, use it (fastest, pre-validated)
 * 3. If JSON fails, fall back to CSV and convert on-the-fly
 * 4. Emit events to notify system of load source
 *
 * WHY JSON-FIRST?
 * ────────────────────────────────────────────────────────────────────────────
 * - Pre-computed validation = faster startup
 * - Pre-computed substitutions = no runtime corruption handling
 * - Self-documenting = inspection and debugging
 * - Schema validation = type safety
 *
 * NAVIGATION MAP:
 * ────────────────────────────────────────────────────────────────────────────
 * DEPENDS ON:
 * - CSVToJSONConverter (optional) → For CSV fallback conversion
 * - DataValidator (optional) → For CSV fallback validation
 *
 * EXPORTS:
 * - JSONDataLoader.load(type) → Load data by type
 * - JSONDataLoader.loadKPIs(companyId) → Load KPI database
 * - JSONDataLoader.loadEdges() → Load edge tensions
 * - JSONDataLoader.loadVertices() → Load vortex map
 * - JSONDataLoader.loadBreathAxes() → Load breath ratios
 *
 * USED BY:
 * - unified-data-loader.js → Primary data loading orchestrator
 *
 * EVENTS EMITTED:
 * - json-data:loaded → When JSON loads successfully
 * - json-data:fallback → When falling back to CSV
 * - json-data:error → When both JSON and CSV fail
 *
 * ============================================================================
 */

(function (global) {
    'use strict';

    // ========================================================================
    // SECTION 1: CONFIGURATION
    // ========================================================================

    const VERSION = '2.0.0';

    /**
     * Path configuration (absolute paths from site root)
     */
    const PATHS = {
        json: '/data/json/',          // JSON files location
        csv: '/data/',                 // CSV files location (fallback)
        schemas: '/js/data-system/schemas/'  // JSON Schema location
    };

    /**
     * Type to filename mapping
     */
    const FILE_MAP = {
        'kpi-database': {
            json: 'kpi-database.json',
            csv: 'CSV_KPI_Database.csv',
            schema: 'kpi-database.schema.json'
        },
        'edge-tension': {
            json: 'edge-tension.json',
            csv: 'CSV_Edge_tension_Map.csv',
            schema: 'edge-tension.schema.json'
        },
        'vortex-map': {
            json: 'vortex-map.json',
            csv: 'CSV_Vortex_Map.csv',
            schema: 'vortex-map.schema.json'
        },
        'breath-ratios': {
            json: 'breath-ratios.json',
            csv: 'CSV_BREATH_RATIOS.csv',
            schema: 'breath-ratios.schema.json'
        },
        'face-models': {
            json: 'face-models.json',
            csv: 'CSV_Face_Models.csv',
            schema: 'face-models.schema.json'
        },
        'dodeca-engine': {
            json: 'dodeca-engine.json',
            csv: 'CSV_Dodeca_Engine.csv',
            schema: 'dodeca-engine.schema.json'
        },
        'system-coherence': {
            json: 'system-coherence.json',
            csv: 'CSV_System_Coherence.csv',
            schema: 'system-coherence.schema.json'
        },
        'spiral-dashboard': {
            json: 'spiral-dashboard.json',
            csv: 'CSV_SPIRAL_DASHBOARD.csv',
            schema: 'spiral-dashboard.schema.json'
        }
    };

    // ========================================================================
    // SECTION 2: CACHE MANAGEMENT
    // ========================================================================

    /**
     * In-memory cache for loaded data
     */
    const cache = new Map();

    /**
     * Cache metadata (when loaded, source type)
     */
    const cacheMeta = new Map();

    /**
     * Clear cache for a specific type
     *
     * @param {string} type - Data type to clear
     */
    function invalidateCache(type) {
        cache.delete(type);
        cacheMeta.delete(type);
        Logger.info('JSONDataLoader', `Cache invalidated for: ${type}`);
    }

    /**
     * Clear all cached data
     */
    function clearAllCache() {
        cache.clear();
        cacheMeta.clear();
        Logger.info('JSONDataLoader', 'All cache cleared');
    }

    /**
     * Get cache status
     *
     * @returns {Object} Cache statistics
     */
    function getCacheStatus() {
        const entries = [];
        for (const [type, meta] of cacheMeta) {
            entries.push({
                type,
                source: meta.source,
                loadedAt: meta.loadedAt,
                recordCount: meta.recordCount
            });
        }
        return {
            size: cache.size,
            entries
        };
    }

    // ========================================================================
    // SECTION 3: EVENT EMISSION
    // ========================================================================

    /**
     * Emit a data loading event
     *
     * @param {string} eventName - Event name
     * @param {Object} detail - Event details
     */
    function emit(eventName, detail) {
        const event = new CustomEvent(eventName, { detail });
        document.dispatchEvent(event);
    }

    // ========================================================================
    // SECTION 4: SCHEMA VALIDATION
    // ========================================================================

    /**
     * Basic schema validation (lightweight, not full JSON Schema validation)
     *
     * Validates key structural requirements without a full schema validator.
     *
     * @param {Object} data - Data to validate
     * @param {string} type - Data type
     * @returns {boolean} True if valid
     */
    function validateSchema(data, type) {
        if (!data || typeof data !== 'object') {
            Logger.warn('JSONDataLoader', `Invalid data structure for ${type}`);
            return false;
        }

        // Check for required metadata fields
        if (!data.$version) {
            Logger.warn('JSONDataLoader', `Missing $version in ${type}`);
            return false;
        }

        // Type-specific validation
        switch (type) {
            case 'kpi-database':
                if (!Array.isArray(data.kpis) || data.kpis.length !== 12) {
                    Logger.warn('JSONDataLoader', `Expected 12 KPIs, got ${data.kpis?.length}`);
                    return false;
                }
                break;

            case 'edge-tension':
                if (!Array.isArray(data.edges) || data.edges.length !== 30) {
                    Logger.warn('JSONDataLoader', `Expected 30 edges, got ${data.edges?.length}`);
                    return false;
                }
                break;

            case 'vortex-map':
                if (!Array.isArray(data.vertices) || data.vertices.length !== 20) {
                    Logger.warn('JSONDataLoader', `Expected 20 vertices, got ${data.vertices?.length}`);
                    return false;
                }
                break;

            case 'breath-ratios':
                if (!Array.isArray(data.axes) || data.axes.length !== 6) {
                    Logger.warn('JSONDataLoader', `Expected 6 axes, got ${data.axes?.length}`);
                    return false;
                }
                break;
        }

        return true;
    }

    /**
     * Check integrity report for issues
     *
     * @param {Object} data - Data with $integrityReport
     * @returns {Object} Summary of integrity status
     */
    function checkIntegrity(data) {
        const report = data.$integrityReport;

        if (!report) {
            return { hasReport: false };
        }

        return {
            hasReport: true,
            totalRecords: report.totalRecords || 0,
            substitutionCount: report.substitutionCount || 0,
            topologyValid: report.topologyValid !== false,
            anomalyCount: report.anomalies?.length || 0,
            healthy: (report.substitutionCount || 0) === 0 && report.topologyValid !== false
        };
    }

    // ========================================================================
    // SECTION 5: LOADING FUNCTIONS
    // ========================================================================

    /**
     * Load JSON file
     *
     * @param {string} type - Data type
     * @returns {Promise<Object|null>} Parsed JSON or null
     */
    async function loadJSON(type) {
        const fileInfo = FILE_MAP[type];
        if (!fileInfo) {
            throw new Error(`Unknown data type: ${type}`);
        }

        const jsonPath = PATHS.json + fileInfo.json;

        try {
            const response = await fetch(jsonPath);

            if (!response.ok) {
                Logger.debug('JSONDataLoader', `JSON not found: ${jsonPath}`);
                return null;
            }

            const data = await response.json();

            // Validate schema
            if (!validateSchema(data, type)) {
                Logger.warn('JSONDataLoader', `Schema validation failed for ${type}`);
                return null;
            }

            // Check integrity
            const integrity = checkIntegrity(data);
            if (integrity.hasReport && integrity.substitutionCount > 0) {
                Logger.info('JSONDataLoader', `${type}: ${integrity.substitutionCount} pre-computed substitutions`);
            }

            return data;

        } catch (e) {
            Logger.debug('JSONDataLoader', `Could not load JSON for ${type}: ${e.message}`);
            return null;
        }
    }

    /**
     * Load CSV and convert on-the-fly (fallback)
     *
     * @param {string} type - Data type
     * @returns {Promise<Object|null>} Converted data or null
     */
    async function loadCSVFallback(type) {
        const fileInfo = FILE_MAP[type];
        if (!fileInfo) {
            throw new Error(`Unknown data type: ${type}`);
        }

        const csvPath = PATHS.csv + fileInfo.csv;

        try {
            const response = await fetch(csvPath);

            if (!response.ok) {
                Logger.error('JSONDataLoader', `CSV not found: ${csvPath}`);
                return null;
            }

            const csvContent = await response.text();

            // Try to convert using CSVToJSONConverter if available
            if (global.CSVToJSONConverter?.convert) {
                Logger.info('JSONDataLoader', `Converting CSV on-the-fly: ${type}`);
                return global.CSVToJSONConverter.convert(type, csvContent);
            }

            // If converter not available, return raw CSV content wrapped
            Logger.warn('JSONDataLoader', 'CSVToJSONConverter not available, returning raw CSV');
            return {
                $version: '1.0.0',
                $source: fileInfo.csv,
                $fallback: true,
                rawCSV: csvContent
            };

        } catch (e) {
            Logger.error('JSONDataLoader', `CSV fallback failed for ${type}: ${e.message}`);
            return null;
        }
    }

    /**
     * Load data with JSON-first strategy and CSV fallback
     *
     * @param {string} type - Data type to load
     * @param {Object} options - Loading options
     * @param {boolean} options.forceRefresh - Bypass cache
     * @returns {Promise<Object>} Loaded data
     */
    async function load(type, options = {}) {
        const { forceRefresh = false } = options;

        // Check cache first
        if (!forceRefresh && cache.has(type)) {
            Logger.debug('JSONDataLoader', `Cache hit for: ${type}`);
            return cache.get(type);
        }

        Logger.info('JSONDataLoader', `Loading: ${type}`);

        // Try JSON first
        let data = await loadJSON(type);
        let source = 'json';

        if (data) {
            emit('json-data:loaded', { type, source: 'json' });
        } else {
            // Fall back to CSV
            Logger.info('JSONDataLoader', `Falling back to CSV for: ${type}`);
            emit('json-data:fallback', { type });

            data = await loadCSVFallback(type);
            source = 'csv';
        }

        if (!data) {
            emit('json-data:error', { type, error: 'Both JSON and CSV failed' });
            throw new Error(`Failed to load data for: ${type}`);
        }

        // Cache the result
        cache.set(type, data);
        cacheMeta.set(type, {
            source,
            loadedAt: new Date().toISOString(),
            recordCount: getRecordCount(data, type)
        });

        Logger.info('JSONDataLoader', `Loaded ${type} from ${source}`);
        return data;
    }

    /**
     * Get record count from data
     */
    function getRecordCount(data, type) {
        switch (type) {
            case 'kpi-database': return data.kpis?.length || 0;
            case 'edge-tension': return data.edges?.length || 0;
            case 'vortex-map': return data.vertices?.length || 0;
            case 'breath-ratios': return data.axes?.length || 0;
            default: return data.$integrityReport?.totalRecords || 0;
        }
    }

    // ========================================================================
    // SECTION 6: CONVENIENCE LOADERS
    // ========================================================================

    /**
     * Load KPI database
     *
     * @param {string} [companyId] - Company ID (for future multi-company support)
     * @returns {Promise<Object>} KPI database JSON
     */
    async function loadKPIs(companyId = 'default') {
        // For now, ignore companyId as we have single company
        return load('kpi-database');
    }

    /**
     * Load edge tensions
     *
     * @returns {Promise<Object>} Edge tension JSON
     */
    async function loadEdges() {
        return load('edge-tension');
    }

    /**
     * Load vortex map (vertices)
     *
     * @returns {Promise<Object>} Vortex map JSON
     */
    async function loadVertices() {
        return load('vortex-map');
    }

    /**
     * Load breath ratios
     *
     * @returns {Promise<Object>} Breath ratios JSON
     */
    async function loadBreathAxes() {
        return load('breath-ratios');
    }

    /**
     * Load all data types
     *
     * @returns {Promise<Object>} All data types
     */
    async function loadAll() {
        const types = ['kpi-database', 'edge-tension', 'vortex-map', 'breath-ratios'];
        const results = {};

        for (const type of types) {
            try {
                results[type] = await load(type);
            } catch (e) {
                Logger.error('JSONDataLoader', `Failed to load ${type}:`, e);
                results[type] = null;
            }
        }

        return results;
    }

    // ========================================================================
    // SECTION 7: DATA EXTRACTION HELPERS
    // ========================================================================

    /**
     * Extract raw data array from JSON structure
     *
     * The self-documenting JSON has metadata layers. This helper
     * extracts just the data array for compatibility with existing code.
     *
     * @param {Object} data - Full JSON structure
     * @param {string} type - Data type
     * @returns {Array} Raw data array
     */
    function extractDataArray(data, type) {
        if (!data) return [];

        switch (type) {
            case 'kpi-database': return data.kpis || [];
            case 'edge-tension': return data.edges || [];
            case 'vortex-map': return data.vertices || [];
            case 'breath-ratios': return data.axes || [];
            default:
                // For unknown types, try common array names
                return data.items || data.data || data.records || [];
        }
    }

    /**
     * Check if data was loaded from JSON (vs CSV fallback)
     *
     * @param {string} type - Data type
     * @returns {boolean} True if loaded from JSON
     */
    function wasLoadedFromJSON(type) {
        const meta = cacheMeta.get(type);
        return meta?.source === 'json';
    }

    /**
     * Get load metadata for a type
     *
     * @param {string} type - Data type
     * @returns {Object|null} Load metadata
     */
    function getLoadMeta(type) {
        return cacheMeta.get(type) || null;
    }

    // ========================================================================
    // SECTION 8: EXPORTS
    // ========================================================================

    const JSONDataLoader = {
        VERSION,

        // Configuration
        PATHS,
        FILE_MAP,

        // Core loading
        load,
        loadJSON,
        loadCSVFallback,

        // Convenience loaders
        loadKPIs,
        loadEdges,
        loadVertices,
        loadBreathAxes,
        loadAll,

        // Validation
        validateSchema,
        checkIntegrity,

        // Cache management
        invalidateCache,
        clearAllCache,
        getCacheStatus,

        // Helpers
        extractDataArray,
        wasLoadedFromJSON,
        getLoadMeta
    };

    // Export to window
    global.JSONDataLoader = JSONDataLoader;

    Logger.info('JSONDataLoader', 'JSONDataLoader v2.0.0 loaded - JSON-first with CSV fallback');

})(typeof window !== 'undefined' ? window : this);
