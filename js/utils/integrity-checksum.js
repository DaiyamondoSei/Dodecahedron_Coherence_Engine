/**
 * ========================================
 * MODULE: integrity-checksum.js
 * ========================================
 *
 * Data Integrity Checksum Utility for Phase 3 File Splitting
 *
 * PURPOSE:
 * Generates checksums of critical data structures to verify
 * they remain unchanged after module splitting.
 *
 * DEPENDENCIES: None (standalone utility)
 *
 * EXPORTS (to window/global):
 * - IntegrityChecksum: Verification utility object
 *
 * ========================================
 */
(function(global) {
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
            console.log('[IntegrityChecksum] Full check results:', results);

            // Visual summary
            if (results.failed === 0) {
                console.log('%c[IntegrityChecksum] ALL CHECKS PASSED', 'color: #00ff88; font-weight: bold;');
            } else {
                console.log('%c[IntegrityChecksum] CHECKS FAILED: ' + results.failed, 'color: #ff4444; font-weight: bold;');
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

            console.log('[IntegrityChecksum] Quick check:', exists, '| All exist:', allExist);
            return allExist;
        }
    };

    // Export to global scope
    global.IntegrityChecksum = IntegrityChecksum;

    console.log('[integrity-checksum] Module loaded');

})(typeof window !== 'undefined' ? window : this);
