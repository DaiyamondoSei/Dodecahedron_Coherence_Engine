# Documentation Template for Quannex

Use these templates when documenting files in the Quannex codebase.

---

## File Header Template (Copy and Customize)

```javascript
/**
 * ========================================
 * MODULE: [filename].js
 * ========================================
 *
 * [One-line purpose: What does this module do?]
 *
 * [2-3 sentences: Why does this module exist? What problem does it solve?]
 *
 * Date: [YYYY-MM-DD]
 *
 * DEPENDENCIES:
 * - [dependency 1] - [what it provides]
 * - [dependency 2] - [what it provides]
 *
 * EXPORTS (to window/global):
 * - [export 1]: [description]
 * - [export 2]: [description]
 *
 * ========================================
 * NOTES FOR FUTURE CLAUDE
 * ========================================
 *
 * KEY CONCEPTS:
 * 1. [Most important thing to understand about this module]
 * 2. [Second most important thing]
 * 3. [Third thing - relationships to other modules]
 *
 * GOTCHAS:
 * - [Edge case or non-obvious behavior #1]
 * - [Edge case or non-obvious behavior #2]
 *
 * USED BY: [list files that import/use this module]
 * USES: [list files this module depends on]
 *
 * ========================================
 *
 * @module [module-path]
 * @author Deimantas Butrimas & Claude
 * @version [X.Y]
 */
```

---

## Function Documentation Template

```javascript
/**
 * [One-line description of what the function does]
 *
 * [Optional: More detailed explanation, especially for complex algorithms]
 *
 * @param {Type} paramName - Description of parameter
 * @param {Object} options - Configuration options
 * @param {string} options.key - Description of option
 * @returns {Type} Description of return value
 *
 * @example
 * const result = functionName(arg1, { key: 'value' });
 * // result: { ... }
 */
function functionName(paramName, options = {}) {
  // ...
}
```

---

## Class Documentation Template

```javascript
/**
 * [One-line description of the class]
 *
 * [Paragraph explaining the purpose and philosophy of this class]
 *
 * USAGE:
 * ```javascript
 * const instance = new ClassName(config);
 * const result = instance.method();
 * ```
 *
 * @class ClassName
 */
class ClassName {
  /**
   * Create a new ClassName instance
   *
   * @param {Object} config - Configuration object
   * @param {string} config.option1 - Description
   * @param {number} config.option2 - Description
   */
  constructor(config) {
    // ...
  }
}
```

---

## PHI Constant Documentation Template

```javascript
/**
 * ========================================
 * PHI CONSTANTS - Single Source of Truth
 * ========================================
 *
 * All constants derive from the Golden Ratio (φ):
 * φ = (1 + √5) / 2 ≈ 1.618033988749895
 *
 * PHI Powers (φ^-n): Decreasing sequence toward 0
 * PSI Values (ψₙ): Complements, ψₙ = 1 - φ^-n
 */

/**
 * PHI_CONSTANT_NAME - [Human-readable description]
 *
 * Formula: [Mathematical derivation]
 * Value: [Decimal approximation]
 * Purpose: [What this constant is used for in the system]
 *
 * @type {number}
 * @constant
 */
const PHI_CONSTANT_NAME = 0.618033988749895;
```

---

## Section Separator Template

```javascript
// ========================================
// SECTION: [Section Name]
// ========================================
//
// [1-2 sentences describing what this section contains]
//
// ========================================
```

---

## IIFE Module Pattern Template

```javascript
/**
 * ========================================
 * MODULE: [filename].js
 * ========================================
 *
 * [Description]
 *
 * ========================================
 * NOTES FOR FUTURE CLAUDE
 * ========================================
 * [Notes...]
 * ========================================
 */
(function(global) {
    'use strict';

    // ========================================
    // IMPORTS
    // ========================================

    const Dependency = global.Dependency;
    if (!Dependency) {
        console.error('[module-name] Dependency not loaded!');
        return;
    }

    // ========================================
    // SECTION: Core Logic
    // ========================================

    function myFunction() {
        // ...
    }

    // ========================================
    // EXPORTS
    // ========================================

    global.myFunction = myFunction;

    console.log('[module-name] Module loaded');

})(typeof window !== 'undefined' ? window : this);
```

---

## ES Module Pattern Template

```javascript
/**
 * ========================================
 * MODULE: [filename].js
 * ========================================
 *
 * [Description]
 *
 * ========================================
 * NOTES FOR FUTURE CLAUDE
 * ========================================
 * [Notes...]
 * ========================================
 *
 * @module [module-path]
 */

// ========================================
// IMPORTS
// ========================================

import { Dependency } from './dependency.js';

// ========================================
// CONSTANTS
// ========================================

const CONFIG = Object.freeze({
  KEY: 'value'
});

// ========================================
// MAIN CLASS
// ========================================

export class MyClass {
  // ...
}

// ========================================
// HELPER FUNCTIONS
// ========================================

function helperFunction() {
  // ...
}

// ========================================
// BROWSER GLOBAL EXPORT
// ========================================

if (typeof window !== 'undefined') {
  window.MyClass = MyClass;
}

console.log('[module-name] Module loaded');
```

---

## "Notes for Future Claude" Quick Reference

When writing notes for future Claude instances, include:

1. **Core Concepts** - The 1-3 most important things to understand
2. **Data Flow** - Where data comes from, where it goes
3. **Dependencies** - What must be loaded first
4. **Gotchas** - Non-obvious behaviors, edge cases, bugs
5. **Relationships** - What uses this, what this uses
6. **Mathematical Foundations** - For PHI-based calculations
7. **State Management** - Where state lives, how it changes
8. **Event System** - What events are emitted/listened to
9. **Error Handling** - How errors are managed
10. **Testing Notes** - How to verify this works correctly

---

*Template created December 16, 2025*
*For the Quannex Sacred Geometry Organizational Coherence Engine*
