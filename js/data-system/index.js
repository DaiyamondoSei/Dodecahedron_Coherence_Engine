/**
 * ============================================================================
 * DATA SYSTEM - BARREL EXPORT
 * ============================================================================
 *
 * Central export point for all data-system modules.
 *
 * Usage:
 *   <script src="js/data-system/index.js"></script>
 *   // Or import individual modules as needed
 *
 * ============================================================================
 */

// In browser environment, modules self-register on window
// This file serves as documentation and future ES module entry point

if (typeof window !== 'undefined') {
  window.DataSystem = window.DataSystem || {};

  // Modules register themselves here
  // DataSystem.Validator = DataValidator (set by data-validator.js)

  console.log('📦 DataSystem barrel loaded');
}
