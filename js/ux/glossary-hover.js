/**
 * ============================================================================
 * QUANNEX GLOSSARY HOVER SYSTEM
 * ============================================================================
 *
 * NOTES FOR FUTURE CLAUDE:
 * ============================================================================
 * This module provides hover definitions for Quannex terminology.
 * Committee members and new users can hover over unfamiliar terms
 * to get instant context without breaking their reading flow.
 *
 * USAGE:
 * Add data-glossary-term attribute to any element:
 *   <span data-glossary-term="Coherence">coherence</span>
 *   <span data-glossary-term="PHI">phi ratio</span>
 *
 * AUTO-SCAN MODE:
 * The module can also auto-detect terms in text content. Enable with:
 *   QuannexGlossary.enableAutoScan(containerSelector)
 *
 * NAVIGATION MAP:
 *   -> IMPORTS FROM:
 *      - js/ux/ux-full-vision.js -> DOCUMENT_STRUCTURE.glossary, getGlossaryTerm()
 *      - js/ux/language-register.js -> Register detection
 *
 *   -> CONSUMED BY:
 *      - All pages with technical terminology
 *      - results-summary.html (thesis report)
 *      - demo-orchestrator.html (during walkthrough)
 * ============================================================================
 *
 * @fileoverview Glossary hover definitions for Quannex terminology
 * @author Deimantas Murauskas & Claude
 * @version 1.0.0
 */

(function(global) {
    'use strict';

    // ========================================================================
    // CONFIGURATION
    // ========================================================================

    const CONFIG = {
        // Hover timing
        showDelay: 400,          // ms before popup appears
        hideDelay: 200,          // ms before popup hides
        animationDuration: 150,  // ms for fade in/out

        // Positioning
        offset: { x: 0, y: 8 },  // Offset from element
        maxWidth: 300,           // Max popup width

        // Styling
        highlightTerms: true,    // Add subtle underline to terms
        showAlternatives: true   // Show register alternatives
    };

    // ========================================================================
    // GLOSSARY DATA (fallback if ux-full-vision not loaded)
    // ========================================================================

    const FALLBACK_GLOSSARY = {
        'Coherence': {
            definition: 'Mathematical measure of alignment (0-1)',
            registerAlternatives: ['Alignment score', 'Harmony index']
        },
        'Face': {
            definition: 'One of 12 domains on the dodecahedron',
            registerAlternatives: ['Domain', 'Capital type']
        },
        'Octave': {
            definition: 'Development stage (O1-O7)',
            registerAlternatives: ['Level', 'Stage', 'Tier']
        },
        'Shadow': {
            definition: 'Organizational pattern seeking attention',
            registerAlternatives: ['Attention area', 'Growth edge']
        },
        'Breath Axis': {
            definition: 'Polarity between opposing faces',
            registerAlternatives: ['Balance flow', 'Domain pair']
        },
        'Vortex': {
            definition: 'Energy convergence at vertex',
            registerAlternatives: ['Convergence point', 'Intersection']
        },
        'Vertex': {
            definition: 'Point where three faces meet',
            registerAlternatives: ['Convergence point', 'Junction']
        },
        'Edge': {
            definition: 'Boundary between two adjacent faces',
            registerAlternatives: ['Interface', 'Connection']
        },
        'Inquiry': {
            definition: 'Reflective question for deeper understanding',
            registerAlternatives: ['Prompt', 'Reflection question']
        },
        'Ritual': {
            definition: 'Structured moment of presence',
            registerAlternatives: ['Process', 'Guided reflection']
        },
        'PHI': {
            definition: 'Golden ratio: 1.618... Found throughout nature',
            registerAlternatives: ['Golden ratio', 'Phi constant']
        },
        'Dodecahedron': {
            definition: '12-faced Platonic solid representing organizational wholeness',
            registerAlternatives: ['12-face structure', 'Geometric model']
        },
        'Chirality': {
            definition: 'Spin direction of energy at a vertex (clockwise/counterclockwise)',
            registerAlternatives: ['Spin direction', 'Handedness']
        },
        'Tension': {
            definition: 'Difference in energy between connected faces',
            registerAlternatives: ['Energy difference', 'Imbalance']
        }
    };

    // ========================================================================
    // STATE
    // ========================================================================

    let popup = null;
    let currentTarget = null;
    let showTimeout = null;
    let hideTimeout = null;

    // ========================================================================
    // HELPERS
    // ========================================================================

    /**
     * Get current language register
     */
    function getRegister() {
        return global.LanguageRegister?.get?.() || 'balanced';
    }

    /**
     * Get glossary data (from ux-full-vision or fallback)
     */
    function getGlossary() {
        return global.QuannexUXFullVision?.DOCUMENT_STRUCTURE?.glossary || FALLBACK_GLOSSARY;
    }

    /**
     * Get term definition
     * @param {string} term - Term to look up
     * @returns {Object|null} Term data
     */
    function getTerm(term) {
        const glossary = getGlossary();

        // Try exact match first
        if (glossary[term]) {
            return { term, ...glossary[term] };
        }

        // Try case-insensitive match
        const lowerTerm = term.toLowerCase();
        for (const [key, value] of Object.entries(glossary)) {
            if (key.toLowerCase() === lowerTerm) {
                return { term: key, ...value };
            }
        }

        return null;
    }

    // ========================================================================
    // POPUP CREATION
    // ========================================================================

    /**
     * Create the popup element
     */
    function createPopup() {
        if (popup) return;

        popup = document.createElement('div');
        popup.id = 'quannex-glossary-popup';
        popup.setAttribute('role', 'tooltip');
        popup.setAttribute('aria-hidden', 'true');

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            #quannex-glossary-popup {
                position: fixed;
                z-index: 10001;
                max-width: ${CONFIG.maxWidth}px;
                padding: 12px 16px;
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                border: 1px solid rgba(0, 255, 204, 0.3);
                border-radius: 8px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 13px;
                line-height: 1.5;
                color: #fff;
                opacity: 0;
                visibility: hidden;
                transform: translateY(4px);
                transition: opacity ${CONFIG.animationDuration}ms ease,
                            transform ${CONFIG.animationDuration}ms ease,
                            visibility ${CONFIG.animationDuration}ms ease;
                pointer-events: none;
            }
            #quannex-glossary-popup.visible {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }
            #quannex-glossary-popup .glossary-term {
                font-weight: 600;
                color: #00ffcc;
                margin-bottom: 6px;
                font-size: 14px;
            }
            #quannex-glossary-popup .glossary-definition {
                color: rgba(255, 255, 255, 0.9);
                margin-bottom: 8px;
            }
            #quannex-glossary-popup .glossary-alternatives {
                font-size: 11px;
                color: rgba(255, 255, 255, 0.5);
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                padding-top: 8px;
                margin-top: 4px;
            }
            #quannex-glossary-popup .glossary-alternatives span {
                display: inline-block;
                background: rgba(255, 255, 255, 0.1);
                padding: 2px 6px;
                border-radius: 3px;
                margin: 2px 4px 2px 0;
            }

            /* Term highlighting */
            [data-glossary-term] {
                border-bottom: 1px dotted rgba(0, 255, 204, 0.4);
                cursor: help;
                transition: border-color 0.2s ease;
            }
            [data-glossary-term]:hover {
                border-bottom-color: #00ffcc;
            }

            /* Arrow pointer */
            #quannex-glossary-popup::before {
                content: '';
                position: absolute;
                top: -6px;
                left: 20px;
                width: 12px;
                height: 12px;
                background: #1a1a2e;
                border-left: 1px solid rgba(0, 255, 204, 0.3);
                border-top: 1px solid rgba(0, 255, 204, 0.3);
                transform: rotate(45deg);
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(popup);
    }

    /**
     * Show popup for a term
     * @param {HTMLElement} target - The element being hovered
     * @param {string} termName - The glossary term
     */
    function showPopup(target, termName) {
        const termData = getTerm(termName);
        if (!termData) return;

        createPopup();
        currentTarget = target;

        const register = getRegister();

        // Build popup content
        let html = `
            <div class="glossary-term">${termData.term}</div>
            <div class="glossary-definition">${termData.definition}</div>
        `;

        if (CONFIG.showAlternatives && termData.registerAlternatives?.length) {
            html += `
                <div class="glossary-alternatives">
                    Also called: ${termData.registerAlternatives.map(alt => `<span>${alt}</span>`).join('')}
                </div>
            `;
        }

        popup.innerHTML = html;

        // Position popup
        positionPopup(target);

        // Show with animation
        popup.classList.add('visible');
        popup.setAttribute('aria-hidden', 'false');
    }

    /**
     * Position popup relative to target element
     * @param {HTMLElement} target - Target element
     */
    function positionPopup(target) {
        const rect = target.getBoundingClientRect();
        const popupRect = popup.getBoundingClientRect();

        let left = rect.left + CONFIG.offset.x;
        let top = rect.bottom + CONFIG.offset.y;

        // Keep within viewport horizontally
        if (left + CONFIG.maxWidth > window.innerWidth - 16) {
            left = window.innerWidth - CONFIG.maxWidth - 16;
        }
        if (left < 16) {
            left = 16;
        }

        // If popup would go below viewport, show above
        if (top + 150 > window.innerHeight) {
            top = rect.top - 150 - CONFIG.offset.y;
            popup.style.setProperty('--arrow-position', 'bottom');
        }

        popup.style.left = `${left}px`;
        popup.style.top = `${top}px`;
    }

    /**
     * Hide popup
     */
    function hidePopup() {
        if (popup) {
            popup.classList.remove('visible');
            popup.setAttribute('aria-hidden', 'true');
        }
        currentTarget = null;
    }

    // ========================================================================
    // EVENT HANDLERS
    // ========================================================================

    /**
     * Handle mouse enter on glossary term
     * @param {MouseEvent} event
     */
    function handleMouseEnter(event) {
        // Guard: ensure target is an Element (not text node, etc.)
        if (!event.target || typeof event.target.closest !== 'function') return;

        const target = event.target.closest('[data-glossary-term]');
        if (!target) return;

        const term = target.dataset.glossaryTerm;
        if (!term) return;

        // Clear any pending hide
        clearTimeout(hideTimeout);

        // Show after delay
        showTimeout = setTimeout(() => {
            showPopup(target, term);
        }, CONFIG.showDelay);
    }

    /**
     * Handle mouse leave from glossary term
     * @param {MouseEvent} event
     */
    function handleMouseLeave(event) {
        // Guard: ensure target is an Element (not text node, etc.)
        if (!event.target || typeof event.target.closest !== 'function') return;

        const target = event.target.closest('[data-glossary-term]');
        if (!target) return;

        // Clear any pending show
        clearTimeout(showTimeout);

        // Hide after delay
        hideTimeout = setTimeout(() => {
            hidePopup();
        }, CONFIG.hideDelay);
    }

    // ========================================================================
    // AUTO-SCAN FEATURE
    // ========================================================================

    /**
     * Auto-wrap glossary terms in a container
     * @param {string|HTMLElement} container - Container selector or element
     */
    function autoScanTerms(container) {
        const el = typeof container === 'string'
            ? document.querySelector(container)
            : container;

        if (!el) return;

        const glossary = getGlossary();
        const terms = Object.keys(glossary);

        // Build regex pattern for all terms
        const pattern = new RegExp(`\\b(${terms.join('|')})\\b`, 'gi');

        // Walk text nodes
        const walker = document.createTreeWalker(
            el,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        const nodesToReplace = [];
        let node;

        while (node = walker.nextNode()) {
            if (pattern.test(node.textContent)) {
                nodesToReplace.push(node);
            }
            pattern.lastIndex = 0; // Reset regex
        }

        // Replace text nodes with wrapped versions
        nodesToReplace.forEach(textNode => {
            const parent = textNode.parentNode;

            // Skip if already wrapped or in a script/style
            if (parent.closest('[data-glossary-term]') ||
                parent.tagName === 'SCRIPT' ||
                parent.tagName === 'STYLE') {
                return;
            }

            const html = textNode.textContent.replace(pattern, (match) => {
                // Find the canonical term (case-sensitive key)
                const canonicalTerm = terms.find(t => t.toLowerCase() === match.toLowerCase());
                return `<span data-glossary-term="${canonicalTerm || match}">${match}</span>`;
            });

            const wrapper = document.createElement('span');
            wrapper.innerHTML = html;

            // Replace text node with wrapper contents
            while (wrapper.firstChild) {
                parent.insertBefore(wrapper.firstChild, textNode);
            }
            parent.removeChild(textNode);
        });
    }

    // ========================================================================
    // INITIALIZATION
    // ========================================================================

    function init() {
        // Delegate event listeners to document
        document.addEventListener('mouseenter', handleMouseEnter, true);
        document.addEventListener('mouseleave', handleMouseLeave, true);

        // Handle focus for accessibility
        document.addEventListener('focusin', (e) => {
            const target = e.target.closest('[data-glossary-term]');
            if (target) {
                showPopup(target, target.dataset.glossaryTerm);
            }
        });

        document.addEventListener('focusout', (e) => {
            const target = e.target.closest('[data-glossary-term]');
            if (target) {
                hidePopup();
            }
        });

        console.log('[Quannex] Glossary Hover system initialized');
    }

    // Auto-init when DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ========================================================================
    // EXPORTS
    // ========================================================================

    const QuannexGlossary = {
        // Core functions
        showPopup,
        hidePopup,
        getTerm,

        // Auto-scan
        autoScanTerms,
        enableAutoScan: autoScanTerms, // Alias

        // Configuration
        CONFIG,

        // Utilities
        getGlossary
    };

    // Browser export
    global.QuannexGlossary = QuannexGlossary;

    // CommonJS export
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = QuannexGlossary;
    }

})(typeof window !== 'undefined' ? window : this);
