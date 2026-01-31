# Documentation Templates - Quick Reference

Use these templates when documenting files in the Quannex codebase.

---

## File Header Template

```javascript
/**
 * ========================================
 * MODULE: [filename].js
 * ========================================
 *
 * [One-line purpose: What does this module do?]
 *
 * [2-3 sentences: Why does this exist? What problem does it solve?]
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
 * 1. [Most important thing to understand]
 * 2. [Second most important thing]
 * 3. [Relationships to other modules]
 *
 * GOTCHAS:
 * - [Edge case or non-obvious behavior]
 * - [Edge case or non-obvious behavior]
 *
 * USED BY: [files that import this]
 * USES: [files this depends on]
 *
 * ========================================
 *
 * @module [module-path]
 * @author Deimantas Murauskas & Claude
 */
```

---

## Function Documentation

```javascript
/**
 * [One-line description of what the function does]
 *
 * @param {Type} paramName - Description of parameter
 * @param {Object} options - Configuration options
 * @param {string} options.key - Description of option
 * @returns {Type} Description of return value
 *
 * @example
 * const result = functionName(arg1, { key: 'value' });
 */
function functionName(paramName, options = {}) {
  // ...
}
```

---

## Class Documentation

```javascript
/**
 * [One-line description of the class]
 *
 * [Paragraph explaining the purpose and philosophy]
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

## PHI Constant Documentation

```javascript
/**
 * PHI_CONSTANT_NAME - [Human-readable description]
 *
 * Formula: [Mathematical derivation]
 * Value: [Decimal approximation]
 * Purpose: [What this constant is used for]
 *
 * @type {number}
 * @constant
 */
const PHI_CONSTANT_NAME = 0.618033988749895;
```

---

## Section Separator

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

## "Notes for Future Claude" Checklist

Include in your notes:
1. **Core Concepts** - The 1-3 most important things to understand
2. **Data Flow** - Where data comes from, where it goes
3. **Dependencies** - What must be loaded first
4. **Gotchas** - Non-obvious behaviors, edge cases
5. **Relationships** - What uses this, what this uses
6. **Mathematical Foundations** - For PHI-based calculations
7. **State Management** - Where state lives, how it changes

---

*Template created for the Quannex Sacred Geometry Organizational Coherence Engine*
