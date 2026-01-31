/**
 * ========================================
 * MODULE: integrity-checksum.js
 * ========================================
 *
 * Data Integrity Checksum Utility for Module Verification
 *
 * PURPOSE:
 * Generates checksums of critical data structures to verify
 * they remain unchanged after module splitting/refactoring.
 * Created during Phase 3 file splitting to ensure no regressions.
 *
 * DEPENDENCIES: None (standalone utility, IIFE pattern)
 *
 * EXPORTS (to window/global):
 * - IntegrityChecksum: Verification utility object
 *
 * ========================================
 * NOTES FOR FUTURE CLAUDE
 * ========================================
 *
 * 1. WHY THIS EXISTS:
 *    During Phase 3, we split large monolithic files into modules.
 *    This utility verifies that after splitting:
 *    - All required properties still exist
 *    - All required methods are still accessible
 *    - No data was lost in the refactoring
 *
 * 2. VERIFICATION TARGETS:
 *    - demoState: The main orchestrator state object
 *    - SessionManager: User session timeout handler
 *    - CrossWindowSync: BroadcastChannel wrapper for tab sync
 *    - OCTAVE_COHERENCE_THRESHOLDS: The 7-octave scoring system
 *
 * 3. TWO CHECK MODES:
 *    a) quickCheck(): Just verifies objects exist (fast)
 *    b) runFullCheck(): Verifies all properties/methods exist (thorough)
 *
 * 4. WHEN TO USE:
 *    - After major refactoring: runFullCheck()
 *    - During development: quickCheck() for sanity
 *    - In browser console: IntegrityChecksum.runFullCheck()
 *
 * 5. IIFE PATTERN:
 *    Uses (function(global) { ... })(window) pattern for:
 *    - Clean namespace (no pollution)
 *    - Works in browser and Node.js
 *    - Single export to window.IntegrityChecksum
 *
 * 6. RESULT FORMAT:
 *    runFullCheck() returns:
 *    {
 *      timestamp: ISO string,
 *      passed: number,
 *      failed: number,
 *      checks: [{ name, valid, missing?, found?, error? }]
 *    }
 *
 * 7. CONSOLE OUTPUT:
 *    - Green "ALL CHECKS PASSED" if everything OK
 *    - Red "CHECKS FAILED: N" if something missing
 *    - Detailed object logged for debugging
 *
 * 8. EXTENDING CHECKS:
 *    To add a new verification target:
 *    1. Create verifyXXX(obj) method returning { valid, missing, found }
 *    2. Add check to runFullCheck() method
 *    3. Add to quickCheck() exists object
 *
 * USED BY:
 * - Development debugging
 * - Post-refactoring verification
 * - CI/CD sanity checks (potential)
 *
 * GOTCHAS:
 * - quickCheck() returns boolean, runFullCheck() returns object
 * - Only checks existence, not correctness of values
 * - Must be loaded AFTER the modules it checks
 *
 * ========================================
 *
 * @module js/utils/integrity-checksum
 * @author Deimantas Murauskas & Claude
 * @version 1.0.0
 */
(function (global) {
    'use strict';

    const IntegrityChecksum = {
        VERSION: '1.0.0',

        /**
         * Generate a simple hash of an object's structure
         */
        structureHash(obj) {
            if (!obj) return 'null';
            if (typeof obj !== 'object') return typeof obj;

            const keys = Object.keys(obj).sort();
            const types = keys.map(k => `${k}:${typeof obj[k]}`);
            return types.join('|');
        },

        /**
         * Verify demoState structure has all required properties
         */
        verifyDemoState(state) {
            const required = [
                'currentStep',
                'totalSteps',
                'faceConfig',
                'kpiMode',
                'kpiData',
                'coherenceResults',
                'completedSteps',
                'selectedCompanyId',
                'loadedMappingContext',
                'setupMode'
            ];
            const missing = required.filter(k => !(k in state));
            return {
                valid: missing.length === 0,
                missing,
                found: required.filter(k => k in state)
            };
        },

        /**
         * Verify SessionManager has all required methods
         */
        verifySessionManager(sm) {
            const required = ['start', 'stop', 'extendSession', 'SESSION_DURATION'];
            const missing = required.filter(k => !(k in sm));
            return {
                valid: missing.length === 0,
                missing,
                found: required.filter(k => k in sm)
            };
        },

        /**
         * Verify CrossWindowSync has all required methods
         */
        verifyCrossWindowSync(cws) {
            const required = ['init', 'broadcast', 'subscribe', 'unsubscribe', 'CHANNEL_NAME'];
            const missing = required.filter(k => !(k in cws));
            return {
                valid: missing.length === 0,
                missing,
                found: required.filter(k => k in cws)
            };
        },

        /**
         * Verify OCTAVE_COHERENCE_THRESHOLDS has all 7 octaves
         */
        verifyOctaveThresholds(thresholds) {
            const required = [1, 2, 3, 4, 5, 6, 7];
            const missing = required.filter(k => !(k in thresholds));
            return {
                valid: missing.length === 0,
                missing,
                found: required.filter(k => k in thresholds)
            };
        },

        /**
         * Run full integrity check on all critical structures
         */
        runFullCheck() {
            const results = {
                timestamp: new Date().toISOString(),
                passed: 0,
                failed: 0,
                checks: []
            };

            // Check 1: demoState
            if (typeof global.demoState !== 'undefined') {
                const check = this.verifyDemoState(global.demoState);
                results.checks.push({ name: 'demoState', ...check });
                check.valid ? results.passed++ : results.failed++;
            } else {
                results.checks.push({ name: 'demoState', valid: false, error: 'undefined' });
                results.failed++;
            }

            // Check 2: SessionManager
            if (typeof global.SessionManager !== 'undefined') {
                const check = this.verifySessionManager(global.SessionManager);
                results.checks.push({ name: 'SessionManager', ...check });
                check.valid ? results.passed++ : results.failed++;
            } else {
                results.checks.push({ name: 'SessionManager', valid: false, error: 'undefined' });
                results.failed++;
            }

            // Check 3: CrossWindowSync
            if (typeof global.CrossWindowSync !== 'undefined') {
                const check = this.verifyCrossWindowSync(global.CrossWindowSync);
                results.checks.push({ name: 'CrossWindowSync', ...check });
                check.valid ? results.passed++ : results.failed++;
            } else {
                results.checks.push({ name: 'CrossWindowSync', valid: false, error: 'undefined' });
                results.failed++;
            }

            // Check 4: OCTAVE_COHERENCE_THRESHOLDS
            if (typeof global.OCTAVE_COHERENCE_THRESHOLDS !== 'undefined') {
                const check = this.verifyOctaveThresholds(global.OCTAVE_COHERENCE_THRESHOLDS);
                results.checks.push({ name: 'OCTAVE_COHERENCE_THRESHOLDS', ...check });
                check.valid ? results.passed++ : results.failed++;
            } else {
                results.checks.push({ name: 'OCTAVE_COHERENCE_THRESHOLDS', valid: false, error: 'undefined' });
                results.failed++;
            }

            // Log results
            Logger.info('IntegrityChecksum', 'Full check results:', results);

            // Visual summary
            if (results.failed === 0) {
                Logger.info('IntegrityChecksum', 'ALL CHECKS PASSED');
            } else {
                Logger.error('IntegrityChecksum', 'CHECKS FAILED:', results.failed);
            }

            return results;
        },

        /**
         * Quick check - returns true if all critical structures exist
         */
        quickCheck() {
            const exists = {
                demoState: typeof global.demoState !== 'undefined',
                SessionManager: typeof global.SessionManager !== 'undefined',
                CrossWindowSync: typeof global.CrossWindowSync !== 'undefined',
                OCTAVE_COHERENCE_THRESHOLDS: typeof global.OCTAVE_COHERENCE_THRESHOLDS !== 'undefined'
            };

            const allExist = Object.values(exists).every(v => v);

            Logger.debug('IntegrityChecksum', 'Quick check:', exists, '| All exist:', allExist);
            return allExist;
        }
    };

    // Export to global scope
    global.IntegrityChecksum = IntegrityChecksum;

    Logger.info('IntegrityChecksum', 'Module loaded');

})(typeof window !== 'undefined' ? window : this);
