/**
 * ============================================================================
 * QUANNEX BACK NAVIGATION UTILITY
 * ============================================================================
 *
 * NOTES FOR FUTURE CLAUDE:
 * ============================================================================
 * Shared back-navigation logic extracted from calculations.html:948-966
 * and breath-analysis.html:539-557 where it was copy-pasted.
 *
 * Priority chain:
 *   1. If opened via window.opener -> close this window, focus opener
 *   2. If came from orchestrator in history -> history.back()
 *   3. Fallback -> navigate to demo-orchestrator.html
 *
 * NAVIGATION MAP:
 *   -> CONSUMED BY:
 *      - pages/calculations.html
 *      - pages/breath-analysis.html
 *      - pages/results-summary.html
 *      - pages/thesis-export.html
 *      - Any page needing a "back to orchestrator" button
 *
 * USAGE:
 *   <script src="../js/ux/back-navigation.js"></script>
 *   <button onclick="QuannexNav.back()">Back</button>
 * ============================================================================
 *
 * @fileoverview Unified back-navigation for Quannex pages
 * @author Deimantas Murauskas & Claude
 * @version 1.0.0
 */

(function (global) {
    'use strict';

    const Logger = global.Logger || { debug: () => {}, info: () => {} };

    global.QuannexNav = {
        /**
         * Navigate back to the parent page using the best available method.
         */
        back() {
            // 1. If opened via window.opener, close and focus opener
            if (window.opener && !window.opener.closed) {
                Logger.info('QuannexNav', 'Closing window, focusing opener');
                window.opener.focus();
                window.close();
                return;
            }

            // 2. If came from orchestrator, use history.back()
            if (document.referrer && document.referrer.includes('demo-orchestrator')) {
                Logger.debug('QuannexNav', 'Using history.back() to return to orchestrator');
                history.back();
                return;
            }

            // 3. Fallback: navigate directly
            // Detect if we're in pages/ subdirectory or root
            const inSubdir = window.location.pathname.includes('/pages/');
            const target = inSubdir ? '../demo-orchestrator.html' : 'demo-orchestrator.html';
            Logger.debug('QuannexNav', `Fallback navigation to ${target}`);
            window.location.href = target;
        }
    };

})(typeof window !== 'undefined' ? window : this);
