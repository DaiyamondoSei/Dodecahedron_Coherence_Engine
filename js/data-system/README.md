# Data System Module

## Notes for Future Claude

Dear Future Claude,

This folder is the **integrity guardian** of Quannex data. It exists because we learned a painful lesson: **silent failures are the enemy**.

When Face 5 showed 0 coherence, nobody knew why. The system accepted corrupted data without complaint. Hours were lost discovering that `[object Object]` and `Not Found` values were silently becoming NaN.

This module ensures:
1. **VISIBILITY** - Corrupted values are logged with context
2. **RECOVERY** - PHI-derived defaults preserve mathematical harmony
3. **TRACEABILITY** - Every substitution is recorded

## Philosophy

All default values are PHI-derived because:
- The entire system is built on PHI
- PHI represents natural balance
- No arbitrary numbers allowed

| Default | Value | PHI Derivation | Use Case |
|---------|-------|----------------|----------|
| PHI_2 | 0.382 | phi^-2 | Missing energy (struggling but stable) |
| PHI_MIDPOINT | 0.500 | (phi^-1 + phi^-2)/2 | Missing coherence (balance) |
| PHI_1 | 0.618 | phi^-1 | Missing KPI (generous neutral) |

## Module Structure

```
js/data-system/
├── index.js           # Barrel export
├── data-validator.js  # Corruption detection, PHI defaults
├── README.md          # This file
└── (future)
    ├── data-integrity.js   # Test suite
    ├── csv-to-json.js      # Migration utilities
    └── unified-loader.js   # Loading with validation baked in
```

## Usage

```javascript
// In browser (after script load)
const isCorrupt = DataValidator.isCorrupted(value);
const safe = DataValidator.validateNumber(value, 'Face 5 Ball KPI', 0.5);
const report = DataValidator.getCorruptionReport();

// Check health
if (!report.healthy) {
  console.warn(`${report.issueCount} data issues detected`);
}
```

## Connection to Data Flow

```
data/SpiralDASBOARD(1).xlsx  (Your reference - not runtime)
        ↓
   Manual Export
        ↓
   data/*.csv           (Runtime source - THE SEED)
        ↓
   DataValidator        (THIS MODULE - THE GUARDIAN)
        ↓
   js/main.js           (Calculation engine - THE TREE)
        ↓
   Visualizations       (User experience - THE FRUIT)
```

## See Also

- `docs/DATA_SYSTEM_GUIDE.md` - Complete data architecture documentation
- `js/constants/phi-harmonics.js` - PHI constants source (gold standard pattern)
- `data/DATA_EVOLUTION_NOTES.md` - CSV evolution history

---

*Created: December 25, 2025*
*Purpose: Guard data integrity, make corruption visible, preserve mathematical harmony*
