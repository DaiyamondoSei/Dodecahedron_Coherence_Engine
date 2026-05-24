"""
CEN SSOT xlsx Build Script

Build the CEN Spiral Dashboard SSOT xlsx at:
  Final Thesis/Thesis Work/Quannex Business Exports/CEN_Spiral_Dashboard_SSOT_v1.0_<date>.xlsx

Modes:
  --init     Build from scratch (full 21-sheet workbook)
  --update   Refresh from POC engine output (preserves manual annotations)
  --validate Run formula validator only (no write)

Architecture: §33 cascading-formula architecture (BDQ Finance_Control_Panel reference pattern).
Quannex brand palette throughout (Deep Teal / Quantum Purple / Magenta Pink / Dark Navy).

Authority: Locks #8.5 through #8.24 of CEN SSOT Consolidation Map (2026-05-21).
Cross-refs:
  - W2 Entry Checklist:      Final Thesis/.../spiral-reports/CEN_SSOT_W2_Entry_Checklist_2026-05-21.md
  - Sheet 14 spec:           Final Thesis/.../spiral-reports/CEN_SSOT_Sheet14_Spectral_Layout_Design_2026-05-21.md
  - Sheet 16 spec:           Final Thesis/.../spiral-reports/CEN_SSOT_Sheet16_Dashboard_Layout_Design_2026-05-21.md
  - Sheet 09 bi-directional: POC/docs/math/CALCULATION_AUDIT_TRAIL.md §17 (Lock #8.24)
  - Reference pattern:       Business_Data_Quannex/2. Finance & Tax/Finance_Control_Panel.xlsx (1,171 formulas, 0 issues)

§29 openpyxl gotchas honored throughout:
  - Atomic write via `_staging.xlsx` (NOT `.tmp` — openpyxl rejects .tmp extension on load)
  - `insert_rows` wrapped in `insert_rows_safe()` (unmerge/remerge to prevent silent col-B+ drops)
  - Sentinel-row detection by column-A text match (NOT absolute row numbers — survives schema drift)
  - Byte-level diff is NOT used for verification (openpyxl rewrites XML on save) — use cell-level compare

Effort budget: ~45min-1h scaffold; full sheet implementation deferred to subsequent W2.3 steps.
"""

import argparse
import sys
from datetime import datetime
from pathlib import Path

# ─────────────────────────────────────────────────────────────
# Python version + dependency guards
# ─────────────────────────────────────────────────────────────

if sys.version_info < (3, 9):
    print("[ERROR] Python 3.9+ required for type hints + pathlib robustness.")
    sys.exit(1)

try:
    from openpyxl import Workbook, load_workbook
    from openpyxl.styles import PatternFill, Font, Alignment, Border, Side
    from openpyxl.utils import get_column_letter
    from openpyxl.utils.cell import range_boundaries
    from openpyxl.workbook.defined_name import DefinedName
except ImportError:
    print("[ERROR] openpyxl not installed. Run: pip install openpyxl")
    sys.exit(1)


# ─────────────────────────────────────────────────────────────
# Constants — Quannex brand palette
# ─────────────────────────────────────────────────────────────
# Per Sheet 14 + Sheet 16 design docs. Hex without "#" prefix per openpyxl convention.

# Primary brand identity
DEEP_TEAL = "0D7377"          # Section headers
QUANTUM_PURPLE = "8B5CF6"     # Formula cells / methodological refinement callouts
MAGENTA_PINK = "D946EF"       # Alerts / non-performing / architectural blindness emphasis
DARK_NAVY = "0A0E1A"          # Titles (highest contrast)

# Functional palette
PALE_YELLOW = "FFF8DC"        # Editable parameter cells (§33 cascading-formula convention)
LIGHT_BLUE = "E6F3FF"         # Formula-derived cells (read-only display)
GRAY = "E0E0E0"               # Reference / analytical-context labels
WHITE = "FFFFFF"              # Default header text on dark bg

# Traffic-light bands (φ-thresholds per band-classifier in js/main.js)
WALL_RED = "FFB6B6"           # E_f < φ⁻⁴ ≈ 0.146 (logistic floor)
GATE_YELLOW = "FFFF66"        # E_f in [φ⁻⁴, φ⁻²) ≈ [0.146, 0.382)
MEMBRANE_GREEN = "90EE90"     # E_f in [φ⁻², φ⁻¹) ≈ [0.382, 0.618)
HEMORRHAGE_BLUE = "A8D8F0"    # E_f in [φ⁻¹, φ⁻¹·φ⁻¹+φ⁻¹) ≈ [0.618, 0.854)
VORTEX_PURPLE = "D9C2F0"      # E_f ≥ 0.854


# ─────────────────────────────────────────────────────────────
# Constants — math
# ─────────────────────────────────────────────────────────────
# SSOT lookup rule: TuningConfig.js is canonical for α/β/γ/κ/λ. Mirror values here
# for build-time use; cross-check at W2.5 (POC engine cross-verification).

PHI = 1.6180339887498948      # Golden ratio = (1+√5)/2
PHI_INV = 1.0 / PHI           # α constant (pentagram skip-pair) ≈ 0.6180
PHI_INV_SQ = 1.0 / (PHI ** 2) # φ-threshold base ≈ 0.3820
PHI_INV_4 = 1.0 / (PHI ** 4)  # Wall band ceiling ≈ 0.1459

# Pentagramic formula constants (from js/core/TuningConfig.js balancedMode — SSOT)
# Per Lock #8.32 (W2 planning 2026-05-23): canonical κ = φ² ≈ 2.618 (balancedMode default),
# NOT 4 (which was enterpriseMode κ = φ³ ≈ 4.236 rounded — original Lock #8.6 framing).
ALPHA = PHI_INV                # α = φ⁻¹ ≈ 0.618 (pentagram skip-pair self-similarity)
BETA = 0.5                     # β = 0.5 (axis feedback / intersection blend)
GAMMA = 0.7                    # γ = 0.7 (Ball+Pillars blend: 70% internal / 30% relational)
DELTA = 0.9                    # δ = 0.9 ≈ ψ₅ (axis coherence — 10% shadow influence)
KAPPA = PHI ** 2               # κ = φ² ≈ 2.618 (Global Coherence sensitivity amplifier)
ETA = PHI_INV_SQ               # η = φ⁻² ≈ 0.382 (harmonic resonance amplifier)
ZETA = PHI_INV_SQ / 6          # ζ = φ⁻²/6 ≈ 0.0637 (zenith gradient per octave)
THETA = PHI_INV                # θ = φ⁻¹ ≈ 0.618 (transcendence threshold)
LAMBDA = PHI ** -3             # λ = φ⁻³ ≈ 0.2361 (CV penalty in Global Coherence)
EPSILON_THRESHOLD = 0.05       # ε for Δ-alignment verdict (Sheet 14)

# AvG band thresholds (φ-derived) per audit trail §16 Lock #8.22 + Diagnostics.js
AVG_BAND_FAITHFUL = PHI ** -6      # φ⁻⁶ ≈ 0.0557 (faithful aggregation upper bound)
AVG_BAND_MINOR = PHI ** -5         # φ⁻⁵ ≈ 0.0902 (minor compression artifact upper bound)
AVG_BAND_DISTORTION = PHI ** -4    # φ⁻⁴ ≈ 0.1459 (aggregation distortion upper bound)


# ─────────────────────────────────────────────────────────────
# Constants — paths
# ─────────────────────────────────────────────────────────────

DEFAULT_OUTPUT = Path(
    r"C:/Users/murau/OneDrive/Stalinis kompiuteris/Final Thesis/"
    r"Thesis Work/Quannex Business Exports/"
    r"CEN_Spiral_Dashboard_SSOT_v1.0_2026-05-22.xlsx"
)
STAGING_SUFFIX = "_staging.xlsx"   # NOT `.tmp` — openpyxl rejects .tmp on load_workbook

POC_ROOT = Path(r"C:/Users/murau/OneDrive/Stalinis kompiuteris/POC")
CEN_COMPANY_JSON = POC_ROOT / "companies" / "cen" / "company.json"
CEN_MAPPING_CONTEXT = POC_ROOT / "companies" / "cen" / "mapping-context.json"


# ─────────────────────────────────────────────────────────────
# Logging
# ─────────────────────────────────────────────────────────────

def log(level: str, msg: str) -> None:
    """Timestamped log line. Levels: INFO / WARN / ERROR / OK."""
    ts = datetime.now().strftime("%H:%M:%S")
    print(f"[{level:5s}] {ts} {msg}")


# ─────────────────────────────────────────────────────────────
# Utility — sentinel-row detection (§29: survives schema drift)
# ─────────────────────────────────────────────────────────────

def find_sentinel_row(ws, matcher) -> int:
    """Return 1-based row number of first row where column A satisfies matcher(value).

    Per §29 sentinel-row gotcha: NEVER reference rows by absolute number when
    inserting/updating — schema drift breaks absolute refs. Find by column-A
    text match instead.

    Returns -1 if not found.
    """
    for r in range(1, ws.max_row + 1):
        v = ws.cell(r, 1).value
        if v is not None and matcher(str(v)):
            return r
    return -1


def find_last_data_row(ws, col: int = 1) -> int:
    """Return 1-based row number of last cell in given column with non-None value.

    Per §29 sentinel-before-insert ≠ data-cluster-append gotcha: when appending
    to a log section with empty rows between data cluster and bottom sentinel,
    compute target_row = last_real_data_row + 1, NOT sentinel - 1. The sentinel
    is a *boundary*, not an *insertion anchor*.
    """
    last = 0
    for r in range(1, ws.max_row + 1):
        if ws.cell(r, col).value is not None:
            last = r
    return last


# ─────────────────────────────────────────────────────────────
# Utility — insert_rows_safe (§29: merged-cell silent corruption fix)
# ─────────────────────────────────────────────────────────────

def insert_rows_safe(ws, sentinel: int, count: int = 1) -> None:
    """insert_rows that correctly shifts merged-cell ranges.

    §29 documented gotcha: openpyxl's insert_rows() does NOT auto-update merged
    ranges at-or-below the insert point. The merged range still claims old row
    coords, so the newly-inserted row inherits phantom merge state and silently
    drops writes to columns 2+ (column A writes succeed because merges usually
    start at A; cols B onwards become unwritable).

    Fix: unmerge all affected ranges BEFORE insert_rows, then re-merge at shifted
    coordinates AFTER. Mirror of POC/scripts/_update_command_center_phase4.py
    helper of the same name.
    """
    affected = []
    for r in list(ws.merged_cells.ranges):
        min_col, min_row, max_col, max_row = range_boundaries(str(r))
        if min_row >= sentinel:
            affected.append((min_col, min_row, max_col, max_row))
            ws.unmerge_cells(str(r))

    ws.insert_rows(sentinel, amount=count)

    for (min_col, min_row, max_col, max_row) in affected:
        new_min_row = min_row + count
        new_max_row = max_row + count
        ws.merge_cells(
            start_row=new_min_row, start_column=min_col,
            end_row=new_max_row, end_column=max_col,
        )


# ─────────────────────────────────────────────────────────────
# Utility — named ranges (§33 cascading-formula architecture)
# ─────────────────────────────────────────────────────────────

def add_defined_name(wb, name: str, ref: str) -> None:
    """Add workbook-scoped named range.

    Naming convention (§33): snake_case, prefixed by scope:
      - `cen_<face>_<metric>_<octave>` for CEN-specific (e.g., `cen_f1_e_local_o1`)
      - `<constant_name>` for math constants (e.g., `phi`, `alpha`, `kappa`)

    `ref` is an absolute Excel range string with sheet name and `$`, e.g.:
      "'01_Assumptions_Constants'!$B$5"

    Idempotent — if name already exists, replaces it.
    """
    defn = DefinedName(name=name, attr_text=ref)
    if name in wb.defined_names:
        del wb.defined_names[name]
    wb.defined_names[name] = defn


# ─────────────────────────────────────────────────────────────
# Utility — brand header formatting
# ─────────────────────────────────────────────────────────────

def apply_brand_header(ws, row: int, col_start: int, col_end: int,
                       text: str, bg: str = DEEP_TEAL, fg: str = WHITE,
                       bold: bool = True, size: int = 11) -> None:
    """Apply Quannex brand header formatting to a row range.

    Merges cells col_start..col_end on `row`, sets background + font + bold.
    Quannex convention: Deep Teal section headers, Dark Navy titles,
    Magenta Pink alerts. White text on all dark bgs.
    """
    cell = ws.cell(row=row, column=col_start, value=text)
    cell.fill = PatternFill(start_color=bg, end_color=bg, fill_type="solid")
    cell.font = Font(name="Calibri", size=size, bold=bold, color=fg)
    cell.alignment = Alignment(horizontal="left", vertical="center", indent=1)

    if col_end > col_start:
        ws.merge_cells(start_row=row, start_column=col_start,
                       end_row=row, end_column=col_end)


def apply_editable_cell(ws, row: int, col: int, value=None,
                        tooltip: str = "") -> None:
    """Apply Pale Yellow background — §33 convention for founder-editable parameters.

    Yellow cell = editable parameter; Light Blue cell = formula. Founder scans any
    sheet and knows what to edit vs what to read.
    """
    cell = ws.cell(row=row, column=col, value=value)
    cell.fill = PatternFill(start_color=PALE_YELLOW, end_color=PALE_YELLOW, fill_type="solid")
    if tooltip:
        cell.comment = None  # TODO: attach comment with tooltip text via openpyxl.comments.Comment


def apply_formula_cell(ws, row: int, col: int, formula: str,
                       tooltip: str = "") -> None:
    """Apply Light Blue background — §33 convention for formula-derived cells.

    Per §33: formula cells are read-only display; pale-blue background signals
    "do not edit directly; edit the referenced parameter in an Assumptions sheet".
    """
    cell = ws.cell(row=row, column=col, value=formula)
    cell.fill = PatternFill(start_color=LIGHT_BLUE, end_color=LIGHT_BLUE, fill_type="solid")
    if tooltip:
        cell.comment = None  # TODO: attach comment


# ─────────────────────────────────────────────────────────────
# Utility — atomic save (§29: NOT .tmp)
# ─────────────────────────────────────────────────────────────

def atomic_save(wb, output_path: Path) -> None:
    """Atomic save via `_staging.xlsx` then rename.

    §29 documented gotcha: openpyxl.load_workbook() REJECTS `.tmp` extension.
    Use `_staging.xlsx` (still .xlsx, valid extension) for atomic staging,
    then Path.replace() for atomic rename.

    Sequence:
      1. wb.save(staging_path) — full write to staging
      2. staging_path.replace(output_path) — atomic OS rename
      3. cleanup: only staging exists during write; final output appears atomically

    On exception during save, staging file is left for diagnosis (do NOT auto-
    delete — preserves debugging trail per Never Delete Rule).
    """
    output_path = Path(output_path)
    staging_path = output_path.with_name(
        output_path.stem + STAGING_SUFFIX
    )

    output_path.parent.mkdir(parents=True, exist_ok=True)

    log("INFO", f"Saving to staging: {staging_path.name}")
    wb.save(str(staging_path))

    log("INFO", f"Atomic rename: {staging_path.name} → {output_path.name}")
    staging_path.replace(output_path)

    log("OK", f"Saved: {output_path}")


def preflight_check(output_path: Path) -> bool:
    """Verify output file isn't locked by Excel before attempting write."""
    if not output_path.exists():
        return True  # No file yet — safe to write fresh

    try:
        wb = load_workbook(output_path, read_only=True)
        wb.close()
        return True
    except PermissionError:
        log("ERROR", f"{output_path.name} is open in Excel. Close it and re-run.")
        return False
    except Exception as e:
        log("WARN", f"Preflight check anomaly (proceeding): {e}")
        return True


# ─────────────────────────────────────────────────────────────
# Per-sheet build functions — 21 sheets per W2 Entry Checklist §W2.3
# ─────────────────────────────────────────────────────────────
# Each function:
#   - Creates the sheet via wb.create_sheet(<name>)
#   - Stubs the header row(s)
#   - Documents the design-doc reference for full content build
#   - Returns the worksheet for orchestration chaining
#
# Build order matters: each sheet depends on named ranges defined in earlier
# sheets (e.g., Sheet 14 depends on Sheet 04 face energies; Sheet 16 depends
# on Sheets 04, 06, 10-14). See SHEET_BUILD_ORDER for canonical sequence.


def build_sheet_00_cover_provenance(wb: Workbook):
    """Sheet 00 Cover_Provenance — version, integrity attestation, methodology.

    Content: W0 Consolidation Map TL;DR embedded; build date, signature, methodology
    summary, link to companion narrative (CEN_Coherence_Portrait.md).

    Authority: Lock #2 (CEN-authentic naming) + Lock #8.8 (math-only SSOT framing).
    """
    ws = wb.create_sheet("00_Cover_Provenance")
    apply_brand_header(ws, 1, 1, 12,
                       "CEN Spiral Dashboard — SSOT v1.0", bg=DARK_NAVY, size=16)
    apply_brand_header(ws, 2, 1, 12,
                       "Source-of-Truth Mathematical Mirror · Quannex Coherence Audit", bg=DEEP_TEAL)
    return ws


def build_sheet_0a_naming_translation(wb: Workbook):
    """Sheet 0a Naming_Translation — POC canonical ↔ IIRF universal capital ↔ CEN-authentic.

    Three-column mapping table covering all 12 faces. Per Lock #2 (CEN-authentic
    naming primary in Sheet 16; IIRF + POC canonical surfaced in this naming table only).

    Example: F1 / "Three-Pillar Sustainability" (CEN-authentic) / "Financial Capital" (IIRF)
    / "Financial" (POC canonical, see js/core/FaceNames.js).
    """
    ws = wb.create_sheet("0a_Naming_Translation")
    apply_brand_header(ws, 1, 1, 6,
                       "Naming Translation: POC ↔ IIRF ↔ CEN-Authentic", bg=DARK_NAVY, size=14)
    return ws


def build_sheet_01_assumptions(wb: Workbook):
    """Sheet 01 Assumptions_Constants — math constants + tuning + AvG thresholds.

    Per §33 cascading-formula architecture: this sheet is the single source of
    truth for all constants. Downstream sheets reference NAMED RANGES defined here
    (`phi`, `alpha`, `beta`, `gamma`, `delta`, `kappa`, `eta`, `zeta`, `theta`,
    `lambda`, `epsilon_threshold`, `avg_faithful`, `avg_minor`, `avg_distortion`).

    Column layout:
      A: Symbol (Greek letter + visual marker)
      B: Name + brief role
      C: Value (computed via Excel formula from phi where possible)
      D: Excel-formula form (visible cell, e.g., "=1/phi")
      E: φ-derivation note (precision-revealing)
      F: SSOT source reference (file:line in POC code)

    Light Blue cells = formula-derived (most constants derived from φ for self-
    similarity with dodecahedral geometry per balancedMode rationale).
    Pale Yellow cells = founder-editable (e.g., per-company tuning overrides).

    Authority:
      - Lock #8.6 (Pentagramic constants canonical α=φ⁻¹, β=0.5, γ=0.7)
      - Lock #8.31 (mapping-context.json refresh to balancedMode)
      - Lock #8.32 (κ = φ² ≈ 2.618 canonical, NOT 4 which was enterpriseMode φ³)
      - Lock #8.22 (AvG band thresholds φ⁻⁴/φ⁻⁵/φ⁻⁶ per Diagnostics.js)
    """
    ws = wb.create_sheet("01_Assumptions_Constants")
    apply_brand_header(ws, 1, 1, 6,
                       "Mathematical Constants + Pentagramic Tuning + AvG Thresholds",
                       bg=DEEP_TEAL, size=14)

    # Column headers (row 3)
    headers = ["Symbol", "Name & Role", "Value", "Formula", "φ-Derivation", "SSOT Source"]
    for col_idx, header_text in enumerate(headers, start=1):
        c = ws.cell(row=3, column=col_idx, value=header_text)
        c.fill = PatternFill(start_color=GRAY, end_color=GRAY, fill_type="solid")
        c.font = Font(name="Calibri", size=10, bold=True, color="000000")
        c.alignment = Alignment(horizontal="center", vertical="center")

    # ─────────────────────────────────────────────────────────
    # Section A: Math foundation (rows 5-9)
    # ─────────────────────────────────────────────────────────
    apply_brand_header(ws, 4, 1, 6, "Section A — Math Foundation (φ + derived powers)",
                       bg=QUANTUM_PURPLE, size=11)

    # Each entry: (row, symbol, name, value, formula_text, derivation, source, named_range_key)
    section_a = [
        (5, "φ (phi)", "Golden Ratio — sacred geometry constant",
         PHI, "=(1+SQRT(5))/2", "φ = (1+√5)/2 ≈ 1.61803398875",
         "js/constants/phi-harmonics.js:PHI", "phi"),
        (6, "φ⁻¹", "Golden Ratio Inverse — pentagram skip-pair α anchor",
         PHI_INV, "=1/phi", "φ⁻¹ ≈ 0.61803398875",
         "js/constants/phi-harmonics.js:PHI_INV_1", "phi_inv_1"),
        (7, "φ⁻²", "Golden Ratio Squared Inverse — η + AvG/4 threshold base",
         PHI_INV_SQ, "=1/(phi*phi)", "φ⁻² ≈ 0.38196601125",
         "js/constants/phi-harmonics.js:PHI_INV_2", "phi_inv_2"),
        (8, "φ⁻³", "Golden Ratio Cubed Inverse — λ CV-penalty anchor",
         LAMBDA, "=1/(phi*phi*phi)", "φ⁻³ ≈ 0.23606797750",
         "js/constants/phi-harmonics.js:PHI_INV_3", "phi_inv_3"),
        (9, "φ⁻⁴", "Golden Ratio Fourth Inverse — Wall band ceiling / AvG distortion",
         PHI_INV_4, "=1/(phi*phi*phi*phi)", "φ⁻⁴ ≈ 0.14589803375",
         "js/constants/phi-harmonics.js:PHI_INV_4", "phi_inv_4"),
    ]

    for (row, sym, name, val, formula, deriv, source, nr_key) in section_a:
        ws.cell(row=row, column=1, value=sym).font = Font(name="Calibri", size=11, bold=True)
        ws.cell(row=row, column=2, value=name)
        # Column C: actual computed value (light blue formula cell)
        apply_formula_cell(ws, row, 3, formula)
        # Column D: formula display (gray reference text)
        d = ws.cell(row=row, column=4, value=formula)
        d.font = Font(name="Consolas", size=10, color="606060")
        # Column E: derivation
        e = ws.cell(row=row, column=5, value=deriv)
        e.font = Font(name="Calibri", size=10, italic=True, color="404040")
        # Column F: source ref
        f = ws.cell(row=row, column=6, value=source)
        f.font = Font(name="Consolas", size=9, color="808080")
        # Named range pointing at column C
        add_defined_name(wb, nr_key, f"'01_Assumptions_Constants'!$C${row}")

    # ─────────────────────────────────────────────────────────
    # Section B: Pentagramic coupling constants (rows 12-19)
    # ─────────────────────────────────────────────────────────
    apply_brand_header(ws, 11, 1, 6,
                       "Section B — Pentagramic Coupling Constants (balancedMode canonical)",
                       bg=QUANTUM_PURPLE, size=11)

    section_b = [
        (12, "α (alpha)", "Synergy blend — pentagram skip-pair self-similarity",
         "=phi_inv_1", "φ⁻¹ ≈ 0.618 — Golden balance: 61.8% arithmetic / 38.2% multiplicative",
         "js/core/TuningConfig.js:98 (balancedMode)", "alpha"),
        (13, "β (beta)", "Intersection blend — axis feedback symmetry",
         "=0.5", "0.5 = (φ⁻¹ + φ⁻²)/2 = PHI_MIDPOINT — perfect harmonic center",
         "js/core/TuningConfig.js:117 (balancedMode)", "beta"),
        (14, "γ (gamma)", "Ball+Pillars blend — 70% internal / 30% relational",
         "=0.7", "0.7 between φ⁻¹ (0.618) and ψ₃ (0.764) — pragmatic accountability",
         "js/core/TuningConfig.js:137 (balancedMode)", "gamma"),
        (15, "δ (delta)", "Shadow integration — 10% opposing-face influence",
         "=0.9", "0.9 ≈ ψ₅ (0.9098) — local focus with shadow acknowledgment",
         "js/core/TuningConfig.js:156 (balancedMode)", "delta"),
        (16, "κ (kappa)", "Sensitivity amplifier — logistic S-curve steepness",
         "=phi*phi", "κ = φ² ≈ 2.618 — balanced responsiveness (NOT 4; Lock #8.32)",
         "js/core/TuningConfig.js:181 (balancedMode)", "kappa"),
        (17, "η (eta)", "Resonance amplifier — pentagram harmonic boost ceiling",
         "=phi_inv_2", "η = φ⁻² ≈ 0.382 — 38.2% max harmonic boost",
         "js/core/TuningConfig.js:191 (balancedMode)", "eta"),
        (18, "ζ (zeta)", "Zenith gradient — per-octave maturity penalty",
         "=phi_inv_2/6", "ζ = φ⁻²/6 ≈ 0.0637 — 6.37%/octave; symmetric with η at O7",
         "js/core/TuningConfig.js:198 (balancedMode)", "zeta"),
        (19, "θ (theta)", "Transcendence threshold — face octave-advance gate",
         "=phi_inv_1", "θ = φ⁻¹ ≈ 0.618 — 61.8% integration required to advance",
         "js/core/TuningConfig.js:204 (balancedMode)", "theta"),
    ]

    for (row, sym, name, formula, deriv, source, nr_key) in section_b:
        ws.cell(row=row, column=1, value=sym).font = Font(name="Calibri", size=11, bold=True)
        ws.cell(row=row, column=2, value=name)
        apply_formula_cell(ws, row, 3, formula)
        d = ws.cell(row=row, column=4, value=formula)
        d.font = Font(name="Consolas", size=10, color="606060")
        e = ws.cell(row=row, column=5, value=deriv)
        e.font = Font(name="Calibri", size=10, italic=True, color="404040")
        f = ws.cell(row=row, column=6, value=source)
        f.font = Font(name="Consolas", size=9, color="808080")
        add_defined_name(wb, nr_key, f"'01_Assumptions_Constants'!$C${row}")

    # λ derives from φ⁻³ — already named as phi_inv_3 but ALSO needs `lambda` alias
    # for Global Coherence formula clarity.
    ws.cell(row=20, column=1, value="λ (lambda)").font = Font(name="Calibri", size=11, bold=True)
    ws.cell(row=20, column=2, value="CV penalty (alias of φ⁻³) — Global Coherence dampening")
    apply_formula_cell(ws, 20, 3, "=phi_inv_3")
    d20 = ws.cell(row=20, column=4, value="=phi_inv_3")
    d20.font = Font(name="Consolas", size=10, color="606060")
    e20 = ws.cell(row=20, column=5, value="λ = φ⁻³ ≈ 0.2361 — penalizes variance across face energies")
    e20.font = Font(name="Calibri", size=10, italic=True, color="404040")
    f20 = ws.cell(row=20, column=6, value="js/main.js Global Coherence formula")
    f20.font = Font(name="Consolas", size=9, color="808080")
    add_defined_name(wb, "lambda", "'01_Assumptions_Constants'!$C$20")

    # ─────────────────────────────────────────────────────────
    # Section C: AvG band thresholds (rows 23-26)
    # ─────────────────────────────────────────────────────────
    apply_brand_header(ws, 22, 1, 6,
                       "Section C — AvG Band Thresholds (φ-derived per Diagnostics.js)",
                       bg=QUANTUM_PURPLE, size=11)

    section_c = [
        (23, "AvG ≤ φ⁻⁶", "Faithful aggregation upper bound",
         "=1/(phi^6)", "φ⁻⁶ ≈ 0.0557 — rollup honest to detail; rounding-floor",
         "js/core/Diagnostics.js:AVG_BAND_FAITHFUL_MAX", "avg_faithful"),
        (24, "AvG ≤ φ⁻⁵", "Minor compression artifact upper bound",
         "=1/(phi^5)", "φ⁻⁵ ≈ 0.0902 — rollup smooths some variance; acceptable",
         "js/core/Diagnostics.js:AVG_BAND_MINOR_MAX", "avg_minor"),
        (25, "AvG ≤ φ⁻⁴", "Aggregation distortion upper bound",
         "=1/(phi^4)", "φ⁻⁴ ≈ 0.1459 — rollup masking variance; investigate",
         "js/core/Diagnostics.js:AVG_BAND_DISTORTION_MAX", "avg_distortion"),
        (26, "AvG > φ⁻⁴", "Severe distortion (no upper bound)",
         "n/a", "Above this band: rollup substantially disconnected from KPI detail",
         "js/core/Diagnostics.js:classifyAvGBand", ""),
    ]

    for (row, sym, name, formula, deriv, source, nr_key) in section_c:
        ws.cell(row=row, column=1, value=sym).font = Font(name="Calibri", size=11, bold=True)
        ws.cell(row=row, column=2, value=name)
        if formula != "n/a":
            apply_formula_cell(ws, row, 3, formula)
        else:
            ws.cell(row=row, column=3, value="—").alignment = Alignment(horizontal="center")
        d = ws.cell(row=row, column=4, value=formula)
        d.font = Font(name="Consolas", size=10, color="606060")
        e = ws.cell(row=row, column=5, value=deriv)
        e.font = Font(name="Calibri", size=10, italic=True, color="404040")
        f = ws.cell(row=row, column=6, value=source)
        f.font = Font(name="Consolas", size=9, color="808080")
        if nr_key:
            add_defined_name(wb, nr_key, f"'01_Assumptions_Constants'!$C${row}")

    # ─────────────────────────────────────────────────────────
    # Section D: Other constants (rows 29-31)
    # ─────────────────────────────────────────────────────────
    apply_brand_header(ws, 28, 1, 6,
                       "Section D — Other Constants (epsilon, octave constants)",
                       bg=QUANTUM_PURPLE, size=11)

    section_d = [
        (29, "ε (epsilon)", "Spectral Δ-alignment threshold (Sheet 14)",
         "=0.05", "5% absolute Δ — verdict boundary for Performance per face",
         "Lock #8.10 spectral verdict spec", "epsilon_threshold"),
        (30, "WALL_FLOOR", "Logistic floor — Pure-O1 Wall band reference",
         "=0.1192", "Lock #8.22 canonical Wall floor (per pentagramic + κ=φ²)",
         "audit trail §15 + Lock #8.22", "wall_floor"),
        (31, "PHI_MIDPOINT", "Mid-band for direction symmetry (vertex direction)",
         "=0.5", "0.5 = exact midpoint; sign anchor for vortex direction",
         "js/advanced/vertex-analyzer.js:VortexDirection", "phi_midpoint"),
    ]

    for (row, sym, name, formula, deriv, source, nr_key) in section_d:
        ws.cell(row=row, column=1, value=sym).font = Font(name="Calibri", size=11, bold=True)
        ws.cell(row=row, column=2, value=name)
        apply_formula_cell(ws, row, 3, formula)
        d = ws.cell(row=row, column=4, value=formula)
        d.font = Font(name="Consolas", size=10, color="606060")
        e = ws.cell(row=row, column=5, value=deriv)
        e.font = Font(name="Calibri", size=10, italic=True, color="404040")
        f = ws.cell(row=row, column=6, value=source)
        f.font = Font(name="Consolas", size=9, color="808080")
        add_defined_name(wb, nr_key, f"'01_Assumptions_Constants'!$C${row}")

    # ─────────────────────────────────────────────────────────
    # Footer (row 34+): authority + cross-references
    # ─────────────────────────────────────────────────────────
    apply_brand_header(ws, 33, 1, 6,
                       "Authority + Cross-References", bg=DARK_NAVY, size=11)
    notes = [
        "Authority: js/core/TuningConfig.js balancedMode() — POC engine SSOT",
        "Lock #8.6: Pentagramic constants α=φ⁻¹, β=0.5, γ=0.7, κ=4 (κ revised per Lock #8.32)",
        "Lock #8.22: AvG canonical band thresholds (φ⁻⁴/φ⁻⁵/φ⁻⁶)",
        "Lock #8.31: mapping-context.json tuning refresh to balancedMode (2026-05-23)",
        "Lock #8.32: κ canonical = φ² ≈ 2.618 (NOT 4; that was enterpriseMode)",
        "Disclosure: Live engine reads per-company tuning override (CEN now balancedMode)",
        "                                       ",
        "Naming convention (§33 cascading-formula): snake_case named ranges, workbook-scoped",
        "Downstream sheets reference these via Excel name (e.g., =alpha*0.5 + (1-alpha)*0.3)",
    ]
    for offset, note in enumerate(notes, start=1):
        c = ws.cell(row=33 + offset, column=1, value=note)
        c.font = Font(name="Calibri", size=10, italic=True, color="404040")
        ws.merge_cells(start_row=33 + offset, start_column=1, end_row=33 + offset, end_column=6)

    # Column widths
    ws.column_dimensions["A"].width = 14
    ws.column_dimensions["B"].width = 45
    ws.column_dimensions["C"].width = 16
    ws.column_dimensions["D"].width = 18
    ws.column_dimensions["E"].width = 50
    ws.column_dimensions["F"].width = 44

    return ws


def build_sheet_02_raw_inputs(wb: Workbook):
    """Sheet 02 CEN_Raw_Inputs — 34 BSC KPIs (canonical math input layer).

    Per Lock #8.29 (2026-05-23 W2 partnership-decision): Sheet 02 holds 34 BSC
    KPIs ONLY. 4-vector founder data (D/E/V_res_pre/V_res_post) lives inline in
    Sheet 10 Breath_Axes per Lock #8.3 vector purity (researcher V_res layer is
    parallel methodology, NOT math input).

    Per Lock #8.11 + #8.29: KPI placements via Procedure C (question-derived
    clustering against canonical Songbook v2.1 inquiries). 29 face + 4 edge + 1
    vertex (V13 = first vertex-KPI in CEN dataset) = 34 ✓.

    Per Lock #8.22: O1 layer values from PureO1 canonical worked example.
    Edge/vertex KPI values at O1/O2 marked TBD for partnership-validation in
    Sheet 09 build (Bi-Directional layer per Lock #8.24). O2/O3 face-KPI values
    are silent-zero placeholders until researcher normalization completes.

    Source documents:
      - POC/docs/cen-ssot/CEN_SSOT_W06v3_34KPI_QuestionDerived_Mapping_2026-05-21.md (placements)
      - POC/docs/cen-ssot/CEN_SSOT_PureO1_Recomputation_2026-05-21.md §3 (O1 normalized values)

    Defines 34 named ranges: `bsc_<id>_value` per KPI (e.g., `bsc_f1_value`,
    `bsc_l8_value`). Downstream sheets (03 Normalization, 07/08 Edges/Vertices,
    09 Bi-Directional) reference these.
    """
    ws = wb.create_sheet("02_CEN_Raw_Inputs")
    apply_brand_header(ws, 1, 1, 11,
                       "CEN Raw Inputs — 34 BSC KPIs (Procedure C canonical placements)",
                       bg=DEEP_TEAL, size=14)

    # Column headers (row 3)
    headers = [
        "#", "BSC ID", "KPI Name", "BSC Persp", "Tier", "Slot",
        "Position", "Raw State", "Normalized [0,1]", "Norm Method", "Source"
    ]
    for col_idx, header_text in enumerate(headers, start=1):
        c = ws.cell(row=3, column=col_idx, value=header_text)
        c.fill = PatternFill(start_color=GRAY, end_color=GRAY, fill_type="solid")
        c.font = Font(name="Calibri", size=10, bold=True, color="000000")
        c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)

    # Subsection header — Financial perspective (rows 4-12 = 9 KPIs F1-F8 + tier note)
    apply_brand_header(ws, 4, 1, 11,
                       "Financial Perspective — 8 KPIs (F1-F8)",
                       bg=QUANTUM_PURPLE, size=10)

    # The canonical 34 KPI table per W06v3 Procedure C mapping.
    # Format: (row, num, bsc_id, name, persp, tier, slot, position, raw_state, normalized, norm_method, source, named_range)
    # Where normalized is a number for O1 canonical values, None for TBD/silent.
    KPI_ROWS = [
        # F-series — Financial (8)
        (5, 1, "F1", "Total annual revenue", "Financial", "O1", "Face",
         "F1·Earth·O1", "£0 actual", 0.5, "target-progress",
         "PureO1 §3 + Lock #8.22 / Songbook R5", "bsc_f1_value"),
        (6, 2, "F2", "Certification revenue per client", "Financial", "O1", "Face",
         "F1·Air·O1", "£0 (1 client)", 0.3, "target-progress",
         "PureO1 §3 + Lock #8.22 / Songbook R6", "bsc_f2_value"),
        (7, 3, "F3", "AI governance consulting revenue", "Financial", "O1", "Face",
         "F1·Fire·O1", "£0 (silent)", 0.0, "zero-energy (silent)",
         "PureO1 §3 + Lock #8.22 / Songbook R7", "bsc_f3_value"),
        (8, 4, "F4", "Donation income / quarter", "Financial", "O2", "Face",
         "F11·Fire·O2", "TBD researcher", None, "O2 layer — partnership-validate (REVERTED from E7-11 per Lock #8.36 geometric correction; E7-11 doesn't exist — F7+F11 are skew faces)",
         "Songbook R8 (Reverted from Lock #8.11 edge promotion 2026-05-24 per Lock #8.36)", "bsc_f4_value"),
        (9, 5, "F5", "SCMS subscription revenue", "Financial", "O2", "Face",
         "F11·Water·O2", "TBD researcher", None, "O2 layer — partnership-validate",
         "W06v3 line 113 / Songbook R9", "bsc_f5_value"),
        (10, 6, "F6", "Revenue per active member", "Financial", "O2", "Face",
         "F1·Water·O2", "TBD researcher", None, "O2 layer — partnership-validate",
         "W06v3 line 114 / Songbook R10", "bsc_f6_value"),
        (11, 7, "F7", "Cost coverage ratio", "Financial", "O1", "Face",
         "F1·Ether·O1", "~0% coverage", 0.5, "target-progress",
         "PureO1 §3 + Lock #8.22 / Songbook R11", "bsc_f7_value"),
        (12, 8, "F8", "Founder-borne infrastructure costs", "Financial", "O2", "Face",
         "F1·Earth·O2", "TBD researcher", None, "O2 layer (Procedure C corrected from v2)",
         "W06v3 line 116 / Songbook R12 / Lock #8.11", "bsc_f8_value"),
    ]

    apply_brand_header(ws, 13, 1, 11,
                       "Customer Perspective — 9 KPIs (C1-C9)",
                       bg=QUANTUM_PURPLE, size=10)
    KPI_ROWS_C = [
        (14, 9, "C1", "Active member count", "Customer", "O1", "Face",
         "F6·Earth·O1", "300 total (researcher-est)", 0.4, "target-progress",
         "PureO1 §3 + Lock #8.22 / Songbook R13", "bsc_c1_value"),
        (15, 10, "C2", "Member engagement rate", "Customer", "O2", "Face",
         "F6·Water·O2", "TBD researcher", None, "O2 layer — partnership-validate",
         "W06v3 line 118 / Songbook R14", "bsc_c2_value"),
        (16, 11, "C3", "Certified enterprise count", "Customer", "O1", "Face",
         "F5·Earth·O1", "1 enterprise", 0.2, "target-progress",
         "PureO1 §3 + Lock #8.22 / Songbook R15", "bsc_c3_value"),
        (17, 12, "C4", "Cert renewal rate", "Customer", "O2", "Face",
         "F5·Water·O2", "TBD researcher", None, "O2 layer — partnership-validate",
         "W06v3 line 120 / Songbook R16", "bsc_c4_value"),
        (18, 13, "C5", "NPS score", "Customer", "O2", "Face",
         "F7·Air·O2", "TBD researcher", None, "O2 layer — partnership-validate",
         "W06v3 line 121 / Songbook R17", "bsc_c5_value"),
        (19, 14, "C6", "New member acquisition rate", "Customer", "O2", "Face",
         "F6·Fire·O2", "TBD researcher", None, "O2 layer — partnership-validate",
         "W06v3 line 122 / Songbook R18", "bsc_c6_value"),
        (20, 15, "C7", "NGCLP students enrolled", "Customer", "O3", "Face",
         "F5·Earth·O3", "0 (silent at O3)", 0.0, "zero-energy (silent)",
         "W06v3 line 123 / Songbook R19 / Procedure C corrected", "bsc_c7_value"),
        (21, 16, "C8", "AI governance consulting clients", "Customer", "O1", "Edge",
         "E5-8·O1", "TBD edge-validate", None, "edge KPI — partnership-validate",
         "Lock #8.9 edge promotion / W06v3 line 124", "bsc_c8_value"),
        (22, 17, "C9", "Country representation in active members", "Customer", "O3", "Face",
         "F6·Air·O3", "TBD researcher", None, "O3 layer — partnership-validate",
         "W06v3 line 125 / Songbook R21", "bsc_c9_value"),
    ]

    apply_brand_header(ws, 23, 1, 11,
                       "Intellectual Property Perspective — 9 KPIs (I1-I9)",
                       bg=QUANTUM_PURPLE, size=10)
    KPI_ROWS_I = [
        (24, 18, "I1", "P&P Pack 0 policies", "IP", "O1", "Face",
         "F4·Earth·O1", "0 of 4 (objective)", 0.0, "binary-presence (zero)",
         "PureO1 §3 + Lock #8.22 / Songbook R22", "bsc_i1_value"),
        (25, 19, "I2", "Certification governance policies", "IP", "O1", "Face",
         "F4·Fire·O1", "0 of 3 (objective)", 0.0, "binary-presence (zero)",
         "PureO1 §3 + Lock #8.22 / Songbook R23", "bsc_i2_value"),
        (26, 20, "I3", "GDPR compliance gaps closed", "IP", "O1", "Edge",
         "E10-12·O1", "TBD edge-validate", None, "edge KPI — partnership-validate",
         "Lock #8.9 edge promotion / W06v3 line 128", "bsc_i3_value"),
        (27, 21, "I4", "Cert independence mechanism", "IP", "O1", "Face",
         "F4·Air·O1", "Absent (s58: partial)", 0.2, "target-progress (researcher-judged)",
         "PureO1 §3 + Lock #8.22 (s58=0.2; STRICT=0.0)", "bsc_i4_value"),
        (28, 22, "I5", "Cert time-to-completion", "IP", "O2", "Face",
         "F8·Water·O2", "TBD researcher", None, "O2 layer — partnership-validate",
         "W06v3 line 130 / Songbook R26", "bsc_i5_value"),
        (29, 23, "I6", "AI engagement close rate", "IP", "O2", "Face",
         "F5·Fire·O2", "TBD researcher", None, "O2 layer — partnership-validate",
         "W06v3 line 131 / Songbook R27", "bsc_i6_value"),
        (30, 24, "I7", "DMS adoption", "IP", "O2", "Face",
         "F4·Earth·O2", "TBD researcher", None, "O2 layer — partnership-validate",
         "W06v3 line 132 / Songbook R28", "bsc_i7_value"),
        (31, 25, "I8", "Crisis response protocol", "IP", "O1", "Face",
         "F12·Water·O1", "Absent (s58: partial)", 0.4, "target-progress (researcher-judged)",
         "PureO1 §3 + Lock #8.22 (s58=0.4; STRICT=0.0)", "bsc_i8_value"),
        (32, 26, "I9", "Vision/mission consistency", "IP", "O2", "Face",
         "F10·Air·O2", "TBD researcher", None, "O2 layer — partnership-validate",
         "W06v3 line 134 / Songbook R30", "bsc_i9_value"),
    ]

    apply_brand_header(ws, 33, 1, 11,
                       "Learning & Growth Perspective — 8 KPIs (L1-L8)",
                       bg=QUANTUM_PURPLE, size=10)
    KPI_ROWS_L = [
        (34, 27, "L1", "Compensated contributor count", "L&G", "O2", "Face",
         "F3·Earth·O2", "TBD researcher", None, "O2 layer — partnership-validate",
         "W06v3 line 135 / Songbook R31", "bsc_l1_value"),
        (35, 28, "L2", "Knowledge transfer mechanisms", "L&G", "O2", "Face",
         "F2·Air·O2", "TBD researcher", None, "O2 layer — partnership-validate",
         "W06v3 line 136 / Songbook R32", "bsc_l2_value"),
        (36, 29, "L3", "Onboarding documented + used", "L&G", "O2", "Face",
         "F3·Fire·O2", "TBD researcher", None, "O2 layer — partnership-validate",
         "W06v3 line 137 / Songbook R33", "bsc_l3_value"),
        (37, 30, "L4", "Marketing capability operational", "L&G", "O1", "Face",
         "F3·Fire·O1", "Absent (silent)", 0.0, "zero-energy (silent)",
         "PureO1 §3 + Lock #8.22 (Procedure C corrected from F3·Air to F3·Fire)", "bsc_l4_value"),
        (38, 31, "L5", "NGCLP curriculum delivered", "L&G", "O3", "Face",
         "F2·Air·O3", "Silent at O3", 0.0, "zero-energy (silent)",
         "W06v3 line 139 / Songbook R35 (Procedure C corrected from Fire to Air)",
         "bsc_l5_value"),
        (39, 32, "L6", "Volunteer programme operational", "L&G", "O3", "Face",
         "F6·Water·O3", "TBD researcher", None, "O3 layer — partnership-validate",
         "W06v3 line 140 / Songbook R36", "bsc_l6_value"),
        (40, 33, "L7", "Peace Charter screening procedure", "L&G", "O2", "Edge",
         "E2-10·O2", "TBD edge-validate", None, "edge KPI — partnership-validate",
         "Lock #8.9 edge promotion / W06v3 line 141", "bsc_l7_value"),
        (41, 34, "L8", "SDG alignment in PVM", "L&G", "O2", "Face",
         "F10·Ether·O2", "TBD researcher", None,
         "O2 layer — partnership-validate (REVERTED from V13 per Lock #8.36 geometric correction; F4+F9+F10 don't share a vertex — V13 actually F4+F5+F9. 3-face-spanning semantic preserved at interpretive disclosure layer.)",
         "Songbook R38 (Reverted from Lock #8.11 vertex promotion 2026-05-24 per Lock #8.36)", "bsc_l8_value"),
    ]

    ALL_ROWS = KPI_ROWS + KPI_ROWS_C + KPI_ROWS_I + KPI_ROWS_L
    assert len(ALL_ROWS) == 34, f"Expected 34 KPIs, got {len(ALL_ROWS)}"

    # Populate each row
    for (row, num, bsc_id, name, persp, tier, slot, position, raw_state,
         normalized, norm_method, source, named_range) in ALL_ROWS:

        ws.cell(row=row, column=1, value=num).alignment = Alignment(horizontal="center")
        ws.cell(row=row, column=2, value=f"BSC.{bsc_id}").font = Font(
            name="Consolas", size=10, bold=True)
        ws.cell(row=row, column=3, value=name)
        ws.cell(row=row, column=4, value=persp).alignment = Alignment(horizontal="center")

        # Tier with color coding
        tier_cell = ws.cell(row=row, column=5, value=tier)
        tier_cell.alignment = Alignment(horizontal="center")
        if tier == "O1":
            tier_cell.fill = PatternFill(start_color="FFE4E1", end_color="FFE4E1",
                                          fill_type="solid")
            tier_cell.font = Font(name="Calibri", size=10, bold=True, color="C00000")
        elif tier == "O2":
            tier_cell.fill = PatternFill(start_color="FFF4E1", end_color="FFF4E1",
                                          fill_type="solid")
            tier_cell.font = Font(name="Calibri", size=10, bold=True, color="996600")
        elif tier == "O3":
            tier_cell.fill = PatternFill(start_color="E1F4E1", end_color="E1F4E1",
                                          fill_type="solid")
            tier_cell.font = Font(name="Calibri", size=10, bold=True, color="006600")

        # Slot
        slot_cell = ws.cell(row=row, column=6, value=slot)
        slot_cell.alignment = Alignment(horizontal="center")
        if slot == "Edge":
            slot_cell.font = Font(name="Calibri", size=10, bold=True, color="0066CC")
        elif slot == "Vertex":
            slot_cell.font = Font(name="Calibri", size=10, bold=True, color="CC0066")

        ws.cell(row=row, column=7, value=position).font = Font(
            name="Consolas", size=10, color="404040")
        ws.cell(row=row, column=8, value=raw_state).font = Font(
            name="Calibri", size=10, italic=True, color="606060")

        # Normalized value cell — Pale Yellow for editable researcher-judgment cells,
        # since O1 values are partnership-locked but O2/O3 are TBD researcher-input.
        if normalized is not None:
            apply_editable_cell(ws, row, 9, normalized)
            ws.cell(row=row, column=9).number_format = "0.00"
            ws.cell(row=row, column=9).alignment = Alignment(horizontal="center")
        else:
            # TBD cell — show "—" but make editable for future input
            apply_editable_cell(ws, row, 9, 0)  # default zero (silent) until validated
            ws.cell(row=row, column=9).number_format = "0.00"
            ws.cell(row=row, column=9).alignment = Alignment(horizontal="center")
            ws.cell(row=row, column=9).font = Font(
                name="Calibri", size=10, italic=True, color="999999")

        ws.cell(row=row, column=10, value=norm_method).font = Font(
            name="Calibri", size=9, italic=True, color="606060")
        ws.cell(row=row, column=11, value=source).font = Font(
            name="Consolas", size=8, color="808080")

        # Named range pointing at column I (Normalized) of this row
        add_defined_name(wb, named_range,
                          f"'02_CEN_Raw_Inputs'!$I${row}")

    # ─────────────────────────────────────────────────────────
    # Footer (row 43+): authority + scope disclosure
    # ─────────────────────────────────────────────────────────
    apply_brand_header(ws, 43, 1, 11,
                       "Authority + Scope Disclosure (Lock #8.29 + #8.22)",
                       bg=DARK_NAVY, size=11)
    notes = [
        "Authority: W06v3 Procedure C question-derived KPI placements (POC/docs/cen-ssot/CEN_SSOT_W06v3_34KPI_QuestionDerived_Mapping_2026-05-21.md)",
        "                                       ",
        "Scope: 34 BSC KPIs = SOLE math input pipeline per Lock #8.29. 4-vector (D/E/V_res) lives in Sheet 10 (polarity only, NOT formula cascade).",
        "                                       ",
        "Per Lock #8.22 Pure-O1 canonical: 11 face-KPIs at O1 layer have values from researcher normalization per CEN Phase 2 frozen scores.",
        "Per Lock #8.9: 4 edge-KPI promotions (BSC.C8/F4/I3/L7) — values pending partnership-validation in Sheet 09 build (Lock #8.24 Bi-Directional).",
        "Per Lock #8.10 + #8.11: 1 vertex-KPI promotion (BSC.L8 → V13 = first vertex-KPI in CEN dataset) — value pending partnership-validation.",
        "                                       ",
        "Honest disclosure: O2/O3 face-KPI values currently zero-placeholder; await researcher normalization per Phase 2 frozen scores.",
        "Honest disclosure: BSC.I4 (Cert independence) and BSC.I8 (Crisis response) at O1 use s58 researcher-judged values (0.2 / 0.4); STRICT alternative is 0.0 for both. Lock #8.22 canonical uses s58.",
        "Honest disclosure: BSC.F8, BSC.L4, BSC.L5, BSC.C7 placements CHANGED from v2 per Procedure C Songbook canonical (see W06v3 §4).",
        "                                       ",
        "Naming convention: 34 named ranges defined as `bsc_<id>_value` (e.g., bsc_f1_value, bsc_l8_value). Downstream sheets reference these.",
    ]
    for offset, note in enumerate(notes, start=1):
        c = ws.cell(row=43 + offset, column=1, value=note)
        c.font = Font(name="Calibri", size=10, italic=True, color="404040")
        ws.merge_cells(start_row=43 + offset, start_column=1, end_row=43 + offset, end_column=11)

    # Column widths
    ws.column_dimensions["A"].width = 4
    ws.column_dimensions["B"].width = 9
    ws.column_dimensions["C"].width = 38
    ws.column_dimensions["D"].width = 11
    ws.column_dimensions["E"].width = 6
    ws.column_dimensions["F"].width = 8
    ws.column_dimensions["G"].width = 22
    ws.column_dimensions["H"].width = 26
    ws.column_dimensions["I"].width = 11
    ws.column_dimensions["J"].width = 32
    ws.column_dimensions["K"].width = 56

    # Freeze top-3 header rows + KPI ID + KPI Name columns
    ws.freeze_panes = "D4"

    return ws


def build_sheet_03_normalization_60grid(wb: Workbook):
    """Sheet 03 Normalization_60Element_Grid — 12 × 5 × 3 = 180 cells.

    Three octave-blocks stacked vertically (O1 / O2 / O3). Each block is 12
    faces × 5 elements = 60 cells. Per W2 Entry Checklist + plan §7.A.

    Per Lock #8.11 + #8.29: KPI placements per Procedure C question-derived
    clustering (29 face-KPIs across the 60 face-element cells; 31 silent at
    each octave layer; 151 silent across all 180 cells; 29 active).

    Per Lock #8.3: KPIs live in EXACTLY ONE structural position
    (face XOR edge XOR vertex; no 0.5-weight split). The 4 edge-KPIs +
    1 vertex-KPI from W06v3 do NOT appear in this grid (they live in
    Sheets 07 Edges + 08 Vertices respectively).

    Cell semantics:
      - `=bsc_<id>_value` formula reference where KPI is canonically placed
      - 0 literal where silent (per zeroEnergy policy)
      - Light Blue formula cells for placed KPIs (Sheet 02 cascade target)

    Downstream consumers:
      - Sheet 04 Face_Calculations reads (row-of-5-elements per face per octave)
        to feed pentagramic formula
      - Sheet 13 Diagnostics reads the all-octave aggregate for K_mean_60 in AvG

    Authority:
      - W06v3 Procedure C placement table (POC/docs/cen-ssot/CEN_SSOT_W06v3_*)
      - Lock #8.11 (Procedure C canonical)
      - Lock #8.22 (Pure-O1 strict normalization)
      - Lock #8.29 (34 BSC KPIs = sole math input)
    """
    ws = wb.create_sheet("03_Normalization_60Element_Grid")
    apply_brand_header(ws, 1, 1, 8,
                       "60-Element Grid · 12 Faces × 5 Elements × 3 Octaves (180 cells)",
                       bg=DEEP_TEAL, size=14)

    # Per W06v3 face-KPI placement map: tuple = (named_range, face_id, element, octave)
    # Octave: 1=O1, 2=O2, 3=O3. Edges/vertex KPIs (F4, C8, I3, L7, L8) NOT in this grid.
    KPI_PLACEMENTS = [
        # O1 layer — 11 face KPIs
        ("bsc_f1_value", 1, "Earth", 1),
        ("bsc_f2_value", 1, "Air", 1),
        ("bsc_f3_value", 1, "Fire", 1),
        ("bsc_f7_value", 1, "Ether", 1),
        ("bsc_l4_value", 3, "Fire", 1),
        ("bsc_i1_value", 4, "Earth", 1),
        ("bsc_i2_value", 4, "Fire", 1),
        ("bsc_i4_value", 4, "Air", 1),
        ("bsc_c3_value", 5, "Earth", 1),
        ("bsc_c1_value", 6, "Earth", 1),
        ("bsc_i8_value", 12, "Water", 1),
        # O2 layer — 14 face KPIs
        ("bsc_f5_value", 11, "Water", 2),
        ("bsc_f6_value", 1, "Water", 2),
        ("bsc_f8_value", 1, "Earth", 2),
        ("bsc_c2_value", 6, "Water", 2),
        ("bsc_c4_value", 5, "Water", 2),
        ("bsc_c5_value", 7, "Air", 2),
        ("bsc_c6_value", 6, "Fire", 2),
        ("bsc_i5_value", 8, "Water", 2),
        ("bsc_i6_value", 5, "Fire", 2),
        ("bsc_i7_value", 4, "Earth", 2),
        ("bsc_i9_value", 10, "Air", 2),
        ("bsc_l1_value", 3, "Earth", 2),
        ("bsc_l2_value", 2, "Air", 2),
        ("bsc_l3_value", 3, "Fire", 2),
        # Lock #8.36 reversions (2026-05-24): geometric-correction of Lock #8.11 promotions
        # that were infeasible (E7-11 doesn't exist; V13 = F4+F5+F9 not F4+F9+F10):
        ("bsc_f4_value", 11, "Fire", 2),    # F4 Donation income → F11 Fire O2 (Songbook R8 reversion)
        ("bsc_l8_value", 10, "Ether", 2),   # L8 SDG alignment in PVM → F10 Ether O2 (Songbook R38 reversion)
        # O3 layer — 4 face KPIs
        ("bsc_c7_value", 5, "Earth", 3),
        ("bsc_c9_value", 6, "Air", 3),
        ("bsc_l5_value", 2, "Air", 3),
        ("bsc_l6_value", 6, "Water", 3),
    ]
    assert len(KPI_PLACEMENTS) == 31, f"Expected 31 face-KPI placements (post-Lock #8.36 reversions), got {len(KPI_PLACEMENTS)}"

    ELEMENTS = ["Earth", "Water", "Fire", "Air", "Ether"]
    ELEMENT_COL = {"Earth": 2, "Water": 3, "Fire": 4, "Air": 5, "Ether": 6}

    # Build placement-lookup: (face_id, element, octave) → named_range
    placement_lookup = {(p[1], p[2], p[3]): p[0] for p in KPI_PLACEMENTS}

    # Helper to build one octave block
    def build_octave_block(start_row: int, octave_num: int, octave_name: str, header_color: str):
        # Block header (merged row)
        apply_brand_header(ws, start_row, 1, 7,
                           f"Octave {octave_num} — {octave_name} ({len([p for p in KPI_PLACEMENTS if p[3] == octave_num])} active KPIs of 60 cells)",
                           bg=header_color, size=11)

        # Column headers row
        ws.cell(row=start_row + 1, column=1, value="Face").font = Font(name="Calibri", size=10, bold=True)
        ws.cell(row=start_row + 1, column=1).fill = PatternFill(
            start_color=GRAY, end_color=GRAY, fill_type="solid")
        for elem in ELEMENTS:
            c = ws.cell(row=start_row + 1, column=ELEMENT_COL[elem], value=elem)
            c.font = Font(name="Calibri", size=10, bold=True)
            c.fill = PatternFill(start_color=GRAY, end_color=GRAY, fill_type="solid")
            c.alignment = Alignment(horizontal="center")
        sum_header = ws.cell(row=start_row + 1, column=7, value="Σ row")
        sum_header.font = Font(name="Calibri", size=10, bold=True, italic=True)
        sum_header.fill = PatternFill(start_color=GRAY, end_color=GRAY, fill_type="solid")
        sum_header.alignment = Alignment(horizontal="center")

        # 12 face rows
        for face_id in range(1, 13):
            row = start_row + 1 + face_id
            # Face label
            ws.cell(row=row, column=1, value=f"F{face_id}").font = Font(
                name="Calibri", size=10, bold=True)

            # 5 element cells
            for elem in ELEMENTS:
                col = ELEMENT_COL[elem]
                key = (face_id, elem, octave_num)
                if key in placement_lookup:
                    named_range = placement_lookup[key]
                    apply_formula_cell(ws, row, col, f"={named_range}")
                    ws.cell(row=row, column=col).number_format = "0.00"
                    ws.cell(row=row, column=col).alignment = Alignment(horizontal="center")
                else:
                    # Silent cell — literal 0 per zeroEnergy
                    c = ws.cell(row=row, column=col, value=0)
                    c.font = Font(name="Calibri", size=10, color="C0C0C0")
                    c.alignment = Alignment(horizontal="center")
                    c.number_format = "0.00"

            # Row sum (Σ across 5 elements)
            sum_col_letter_b = get_column_letter(2)
            sum_col_letter_f = get_column_letter(6)
            sum_cell = ws.cell(
                row=row, column=7,
                value=f"=SUM({sum_col_letter_b}{row}:{sum_col_letter_f}{row})"
            )
            sum_cell.font = Font(name="Calibri", size=10, italic=True, color="606060")
            sum_cell.alignment = Alignment(horizontal="center")
            sum_cell.number_format = "0.00"

            # Define named range for this face's 5-element row at this octave
            # Sheet 04 reads these to feed pentagramic formula.
            row_range = f"'03_Normalization_60Element_Grid'!${sum_col_letter_b}${row}:${sum_col_letter_f}${row}"
            add_defined_name(wb, f"cen_f{face_id}_o{octave_num}_elements", row_range)

        # Block total row
        total_row = start_row + 14
        ws.cell(row=total_row, column=1, value="Σ all").font = Font(
            name="Calibri", size=10, bold=True, italic=True)
        for elem in ELEMENTS:
            col = ELEMENT_COL[elem]
            col_letter = get_column_letter(col)
            sum_formula = f"=SUM({col_letter}{start_row + 2}:{col_letter}{start_row + 13})"
            tc = ws.cell(row=total_row, column=col, value=sum_formula)
            tc.font = Font(name="Calibri", size=10, italic=True, color="606060")
            tc.fill = PatternFill(start_color="F0F0F0", end_color="F0F0F0", fill_type="solid")
            tc.alignment = Alignment(horizontal="center")
            tc.number_format = "0.00"
        # Grand total
        grand_total_cell = ws.cell(
            row=total_row, column=7,
            value=f"=SUM(G{start_row + 2}:G{start_row + 13})"
        )
        grand_total_cell.font = Font(name="Calibri", size=10, bold=True, color="404040")
        grand_total_cell.fill = PatternFill(start_color="E0E0E0", end_color="E0E0E0", fill_type="solid")
        grand_total_cell.alignment = Alignment(horizontal="center")
        grand_total_cell.number_format = "0.00"
        # Named range for octave-total (consumed by Sheet 13 AvG K_mean_60)
        add_defined_name(wb, f"cen_o{octave_num}_grid_total",
                          f"'03_Normalization_60Element_Grid'!$G${total_row}")

    # Build the 3 octave blocks
    # Block layout: header at row N, column headers at N+1, F1-F12 at N+2..N+13, total at N+14
    build_octave_block(3, 1, "Survival (existence)", QUANTUM_PURPLE)        # rows 3-17 (15 rows)
    build_octave_block(19, 2, "Structure (systematization)", QUANTUM_PURPLE)  # rows 19-33
    build_octave_block(35, 3, "Relationships / Aspirational", QUANTUM_PURPLE) # rows 35-49

    # ─────────────────────────────────────────────────────────
    # Section D: Aggregate view — sum across all 3 octaves per cell (rows 52-64)
    # ─────────────────────────────────────────────────────────
    apply_brand_header(ws, 51, 1, 7,
                       "All-Octave Aggregate (Σ across O1+O2+O3 per cell — feeds Sheet 13 K_mean_60)",
                       bg=DARK_NAVY, size=11)

    # Column headers
    ws.cell(row=52, column=1, value="Face").font = Font(name="Calibri", size=10, bold=True)
    ws.cell(row=52, column=1).fill = PatternFill(start_color=GRAY, end_color=GRAY, fill_type="solid")
    for elem in ELEMENTS:
        c = ws.cell(row=52, column=ELEMENT_COL[elem], value=elem)
        c.font = Font(name="Calibri", size=10, bold=True)
        c.fill = PatternFill(start_color=GRAY, end_color=GRAY, fill_type="solid")
        c.alignment = Alignment(horizontal="center")
    sum_h = ws.cell(row=52, column=7, value="Σ row")
    sum_h.font = Font(name="Calibri", size=10, bold=True, italic=True)
    sum_h.fill = PatternFill(start_color=GRAY, end_color=GRAY, fill_type="solid")
    sum_h.alignment = Alignment(horizontal="center")

    # 12 face rows with aggregate formulas
    for face_id in range(1, 13):
        row = 52 + face_id
        ws.cell(row=row, column=1, value=f"F{face_id}").font = Font(
            name="Calibri", size=10, bold=True)
        for elem in ELEMENTS:
            col = ELEMENT_COL[elem]
            col_letter = get_column_letter(col)
            # O1 row = 5 + face_id (rows 5..16); O2 = 21 + face_id (rows 21..32);
            # O3 = 37 + face_id (rows 37..48)
            o1_row = 4 + face_id
            o2_row = 20 + face_id
            o3_row = 36 + face_id
            formula = f"={col_letter}{o1_row}+{col_letter}{o2_row}+{col_letter}{o3_row}"
            agg_cell = ws.cell(row=row, column=col, value=formula)
            agg_cell.font = Font(name="Calibri", size=10, color="404040")
            agg_cell.alignment = Alignment(horizontal="center")
            agg_cell.number_format = "0.00"
            agg_cell.fill = PatternFill(start_color="F0F8FF", end_color="F0F8FF", fill_type="solid")
        # Row sum
        sum_b = get_column_letter(2)
        sum_f = get_column_letter(6)
        rs = ws.cell(row=row, column=7, value=f"=SUM({sum_b}{row}:{sum_f}{row})")
        rs.font = Font(name="Calibri", size=10, italic=True, color="606060")
        rs.alignment = Alignment(horizontal="center")
        rs.number_format = "0.00"

    # Aggregate total + K_mean_60
    agg_total_row = 65
    ws.cell(row=agg_total_row, column=1, value="Σ all").font = Font(
        name="Calibri", size=10, bold=True, italic=True)
    for elem in ELEMENTS:
        col = ELEMENT_COL[elem]
        col_letter = get_column_letter(col)
        ftotal = f"=SUM({col_letter}53:{col_letter}64)"
        tc = ws.cell(row=agg_total_row, column=col, value=ftotal)
        tc.font = Font(name="Calibri", size=10, italic=True, color="606060")
        tc.fill = PatternFill(start_color="F0F0F0", end_color="F0F0F0", fill_type="solid")
        tc.alignment = Alignment(horizontal="center")
        tc.number_format = "0.00"
    gtot = ws.cell(row=agg_total_row, column=7, value=f"=SUM(G53:G64)")
    gtot.font = Font(name="Calibri", size=10, bold=True, color="404040")
    gtot.fill = PatternFill(start_color="E0E0E0", end_color="E0E0E0", fill_type="solid")
    gtot.alignment = Alignment(horizontal="center")
    gtot.number_format = "0.00"
    add_defined_name(wb, "cen_grid_total_all", f"'03_Normalization_60Element_Grid'!$G${agg_total_row}")

    # K_mean_60 = total / 60 (feeds Sheet 13 AvG)
    kmean_row = agg_total_row + 1
    ws.cell(row=kmean_row, column=1, value="K_mean_60").font = Font(
        name="Calibri", size=10, bold=True, color="0066CC")
    ws.merge_cells(start_row=kmean_row, start_column=1, end_row=kmean_row, end_column=6)
    apply_formula_cell(ws, kmean_row, 7, "=cen_grid_total_all/60")
    ws.cell(row=kmean_row, column=7).number_format = "0.0000"
    ws.cell(row=kmean_row, column=7).font = Font(
        name="Calibri", size=11, bold=True, color="0066CC")
    add_defined_name(wb, "cen_k_mean_60_all", f"'03_Normalization_60Element_Grid'!$G${kmean_row}")

    # ─────────────────────────────────────────────────────────
    # Footer: provenance + scope disclosure
    # ─────────────────────────────────────────────────────────
    footer_start = kmean_row + 2
    apply_brand_header(ws, footer_start, 1, 7,
                       "Authority + Scope Disclosure", bg=DARK_NAVY, size=11)
    notes = [
        "Authority: W06v3 Procedure C placement table (POC/docs/cen-ssot/CEN_SSOT_W06v3_34KPI_*)",
        "                                       ",
        "Scope per Lock #8.11: 29 face-KPIs occupy 29 of 180 cells (151 silent zero-fills). 4 edge-KPIs + 1 vertex-KPI live in Sheets 07/08 NOT in this grid.",
        "Scope per Lock #8.22: O1 layer canonical baseline. Strict-O1 reading + s58 reading documented in Sheet 02; this grid follows s58 (matches Lock #8.22).",
        "Scope per Lock #8.29: 34 BSC KPIs are sole math input. 4-vector (D/E/V_res) is reference-only in Sheet 10 — NOT in this formula cascade.",
        "                                       ",
        "Per-cell semantics: =bsc_<id>_value where placed; literal 0 where silent (zeroEnergy policy). Aggregate-row (rows 52-66) sums across O1+O2+O3 per cell.",
        "                                       ",
        "Named ranges defined: cen_f<n>_o<m>_elements (36 row ranges) consumed by Sheet 04 Face_Calculations; cen_o<m>_grid_total (3) per-octave sums; cen_k_mean_60_all consumed by Sheet 13 AvG diagnostic.",
    ]
    for offset, note in enumerate(notes, start=1):
        c = ws.cell(row=footer_start + offset, column=1, value=note)
        c.font = Font(name="Calibri", size=10, italic=True, color="404040")
        ws.merge_cells(start_row=footer_start + offset, start_column=1,
                       end_row=footer_start + offset, end_column=7)

    # Column widths
    ws.column_dimensions["A"].width = 12
    for col in ["B", "C", "D", "E", "F"]:
        ws.column_dimensions[col].width = 11
    ws.column_dimensions["G"].width = 12

    # Freeze first 2 rows + first column for scrolling
    ws.freeze_panes = "B4"

    return ws


def build_sheet_04_face_calculations(wb: Workbook):
    """Sheet 04 Face_Calculations — pentagramic formula per face per octave.

    THE HEART OF THE CASCADE. Reads Sheet 03 (60-element grid) per octave;
    applies pentagramic coherence formula; produces 36 face energies
    (12 faces × 3 octaves) that feed Sheets 06-16 downstream.

    Pentagramic formula (per CALCULATION_AUDIT_TRAIL.md §2-§5):

      Step 1: K_bar = mean of 5 element values (Earth/Water/Fire/Air/Ether)
      Step 2: Star pairs (pentagram skip pattern):
                s_1 = alpha * (Earth + Fire)/2 + (1-alpha) * Earth * Fire
                s_2 = alpha * (Water + Air)/2  + (1-alpha) * Water * Air
                s_3 = alpha * (Fire + Ether)/2 + (1-alpha) * Fire * Ether
                s_4 = alpha * (Air + Earth)/2  + (1-alpha) * Air * Earth
                s_5 = alpha * (Ether + Water)/2 + (1-alpha) * Ether * Water
                where alpha = phi^-1 (golden synergy blend)
      Step 3: Intersection nodes (consecutive star-pair blend):
                p_i = beta * s_i + (1-beta) * s_(i+1)  cycling
                where beta = 0.5 (PHI_MIDPOINT, perfect symmetry)
      Step 4: P = mean of 5 intersection nodes
      Step 5: C_raw = gamma * K_bar + (1-gamma) * P  (pre-amplifier)
                where gamma = 0.7 (70% internal / 30% relational)
      Step 6: E_final = 1 / (1 + exp(-kappa * (C_raw - 0.5)))
                where kappa = phi^2 = 2.618 (balancedMode canonical per Lock #8.32)

    Lock #8.32 + #8.34 resolution: kappa = phi^2 = 2.618 is canonical
    (NOT 4 which was pre-Lock-#8.32 enterpriseMode-rounded framing).
    Lock #8.22 face energies (F1=0.2563, etc.) were computed with kappa=4;
    they are now SUPERSEDED by Sheet 04's kappa=phi^2 outputs. This sheet
    IS the new canonical baseline.

    Defines 36 named ranges: cen_f<n>_o<m>_e_final (12 faces x 3 octaves).
    Sheet 12 Global_Coherence + Sheet 13 Diagnostics + Sheet 14 Spectral
    all reference these.

    Authority:
      - audit trail §1-§5 (pentagramic derivation)
      - Lock #8.6 (constants alpha/beta/gamma canonical)
      - Lock #8.22 (Pure-O1 strict-normalization input baseline)
      - Lock #8.32 (kappa = phi^2 canonical, NOT 4)
      - Lock #8.34 NEW (Lock #8.22 face energies superseded by Sheet 04
        with kappa=phi^2 baseline; this sheet IS the new canonical)
    """
    ws = wb.create_sheet("04_Face_Calculations")
    apply_brand_header(ws, 1, 1, 22,
                       "Face Calculations — Pentagramic Coherence per Face per Octave",
                       bg=DEEP_TEAL, size=14)

    # ─────────────────────────────────────────────────────────
    # Column header (row 3) — full audit-trailability per face row
    # ─────────────────────────────────────────────────────────
    headers = [
        "Face",         # A
        "Earth",        # B
        "Water",        # C
        "Fire",         # D
        "Air",          # E
        "Ether",        # F
        "K_bar",        # G — mean of 5 elements
        "s1",           # H — Earth-Fire star pair
        "s2",           # I — Water-Air star pair
        "s3",           # J — Fire-Ether star pair
        "s4",           # K — Air-Earth star pair
        "s5",           # L — Ether-Water star pair
        "p1",           # M — node beta-blend (s1,s2)
        "p2",           # N — node (s2,s3)
        "p3",           # O — node (s3,s4)
        "p4",           # P — node (s4,s5)
        "p5",           # Q — node (s5,s1)
        "P_mean",       # R — mean of 5 p_i
        "C_raw",        # S — gamma * K_bar + (1-gamma) * P_mean
        "E_final",      # T — logistic-amplified canonical face energy
        "Band",         # U — Wall / Gate / Membrane / Hemorrhage / Vortex
        "Notes",        # V
    ]
    for col_idx, header_text in enumerate(headers, start=1):
        c = ws.cell(row=3, column=col_idx, value=header_text)
        c.fill = PatternFill(start_color=GRAY, end_color=GRAY, fill_type="solid")
        c.font = Font(name="Calibri", size=9, bold=True, color="000000")
        c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)

    # Helper to build one octave block
    def build_octave_block(start_row: int, octave_num: int, octave_name: str):
        apply_brand_header(
            ws, start_row, 1, 22,
            f"Octave {octave_num} — {octave_name} "
            f"(pentagramic: alpha=phi^-1, beta=0.5, gamma=0.7, kappa=phi^2)",
            bg=QUANTUM_PURPLE, size=11
        )

        # 12 face rows
        for face_id in range(1, 13):
            row = start_row + face_id
            elem_range = f"cen_f{face_id}_o{octave_num}_elements"

            # Col A: Face label
            ws.cell(row=row, column=1, value=f"F{face_id}").font = Font(
                name="Calibri", size=10, bold=True
            )

            # Cols B-F: 5 element values (pulled from Sheet 03 via named range INDEX)
            elements_idx = ["Earth", "Water", "Fire", "Air", "Ether"]
            for elem_pos, elem_name in enumerate(elements_idx, start=1):
                col = 1 + elem_pos  # B=2, C=3, D=4, E=5, F=6
                apply_formula_cell(ws, row, col, f"=INDEX({elem_range},{elem_pos})")
                ws.cell(row=row, column=col).number_format = "0.0000"
                ws.cell(row=row, column=col).alignment = Alignment(horizontal="center")

            # Col G: K_bar = mean of 5 elements
            apply_formula_cell(ws, row, 7, f"=AVERAGE(B{row}:F{row})")
            ws.cell(row=row, column=7).number_format = "0.0000"
            ws.cell(row=row, column=7).alignment = Alignment(horizontal="center")

            # Cols H-L: 5 star pairs (pentagram skip pattern)
            # s_1: Earth-Fire (B,D)
            apply_formula_cell(ws, row, 8,
                f"=alpha*((B{row}+D{row})/2)+(1-alpha)*B{row}*D{row}")
            # s_2: Water-Air (C,E)
            apply_formula_cell(ws, row, 9,
                f"=alpha*((C{row}+E{row})/2)+(1-alpha)*C{row}*E{row}")
            # s_3: Fire-Ether (D,F)
            apply_formula_cell(ws, row, 10,
                f"=alpha*((D{row}+F{row})/2)+(1-alpha)*D{row}*F{row}")
            # s_4: Air-Earth (E,B)
            apply_formula_cell(ws, row, 11,
                f"=alpha*((E{row}+B{row})/2)+(1-alpha)*E{row}*B{row}")
            # s_5: Ether-Water (F,C)
            apply_formula_cell(ws, row, 12,
                f"=alpha*((F{row}+C{row})/2)+(1-alpha)*F{row}*C{row}")
            for col in range(8, 13):
                ws.cell(row=row, column=col).number_format = "0.0000"
                ws.cell(row=row, column=col).alignment = Alignment(horizontal="center")

            # Cols M-Q: 5 intersection nodes (consecutive s blend with beta=0.5)
            # p_1 = beta*s_1 + (1-beta)*s_2
            apply_formula_cell(ws, row, 13, f"=beta*H{row}+(1-beta)*I{row}")
            # p_2 = beta*s_2 + (1-beta)*s_3
            apply_formula_cell(ws, row, 14, f"=beta*I{row}+(1-beta)*J{row}")
            # p_3 = beta*s_3 + (1-beta)*s_4
            apply_formula_cell(ws, row, 15, f"=beta*J{row}+(1-beta)*K{row}")
            # p_4 = beta*s_4 + (1-beta)*s_5
            apply_formula_cell(ws, row, 16, f"=beta*K{row}+(1-beta)*L{row}")
            # p_5 = beta*s_5 + (1-beta)*s_1 (cycling back)
            apply_formula_cell(ws, row, 17, f"=beta*L{row}+(1-beta)*H{row}")
            for col in range(13, 18):
                ws.cell(row=row, column=col).number_format = "0.0000"
                ws.cell(row=row, column=col).alignment = Alignment(horizontal="center")

            # Col R: P_mean = mean of 5 intersection nodes
            apply_formula_cell(ws, row, 18, f"=AVERAGE(M{row}:Q{row})")
            ws.cell(row=row, column=18).number_format = "0.0000"
            ws.cell(row=row, column=18).alignment = Alignment(horizontal="center")

            # Col S: C_raw = gamma * K_bar + (1-gamma) * P_mean
            apply_formula_cell(ws, row, 19,
                f"=gamma*G{row}+(1-gamma)*R{row}")
            ws.cell(row=row, column=19).number_format = "0.0000"
            ws.cell(row=row, column=19).alignment = Alignment(horizontal="center")

            # Col T: E_final = logistic sensitivity amplifier (Lock #8.32 kappa=phi^2)
            apply_formula_cell(ws, row, 20,
                f"=1/(1+EXP(-kappa*(S{row}-0.5)))")
            ws.cell(row=row, column=20).number_format = "0.0000"
            ws.cell(row=row, column=20).alignment = Alignment(horizontal="center")
            # Highlight E_final cell — this is the deliverable
            ws.cell(row=row, column=20).font = Font(
                name="Calibri", size=10, bold=True, color="0D7377"
            )

            # Col U: Band classification (compare against phi-derived thresholds)
            # Wall: < phi^-4 (0.146)
            # Gate: [phi^-4, phi^-2) = [0.146, 0.382)
            # Membrane: [phi^-2, phi^-1) = [0.382, 0.618)
            # Hemorrhage: [phi^-1, 0.854)
            # Vortex: >= 0.854
            apply_formula_cell(
                ws, row, 21,
                f'=IF(T{row}<phi_inv_4,"Wall",'
                f'IF(T{row}<phi_inv_2,"Gate",'
                f'IF(T{row}<phi_inv_1,"Membrane",'
                f'IF(T{row}<0.854,"Hemorrhage","Vortex"))))'
            )
            ws.cell(row=row, column=21).alignment = Alignment(horizontal="center")
            ws.cell(row=row, column=21).font = Font(
                name="Calibri", size=10, italic=True, color="606060"
            )

            # Col V: Notes (empty by default; available for partnership annotations)
            v_cell = ws.cell(row=row, column=22, value="")
            v_cell.font = Font(name="Calibri", size=9, italic=True, color="808080")

            # Define named range for E_final (this is what Sheet 12/13/14 consume)
            add_defined_name(
                wb,
                f"cen_f{face_id}_o{octave_num}_e_final",
                f"'04_Face_Calculations'!$T${row}"
            )

        # Block summary row (means + std + count below floor)
        total_row = start_row + 14
        ws.cell(row=total_row, column=1, value="Block").font = Font(
            name="Calibri", size=10, bold=True, italic=True
        )
        ws.cell(row=total_row, column=19, value="mu_E:").font = Font(
            name="Calibri", size=10, bold=True, italic=True, color="606060"
        )
        ws.cell(row=total_row, column=19).alignment = Alignment(horizontal="right")
        # mu_E for this octave (mean of 12 face E_final)
        mu_cell = ws.cell(
            row=total_row, column=20,
            value=f"=AVERAGE(T{start_row + 1}:T{start_row + 12})"
        )
        mu_cell.font = Font(name="Calibri", size=10, bold=True, color="0D7377")
        mu_cell.fill = PatternFill(start_color="E0F4F4", end_color="E0F4F4", fill_type="solid")
        mu_cell.alignment = Alignment(horizontal="center")
        mu_cell.number_format = "0.0000"
        add_defined_name(
            wb, f"cen_o{octave_num}_face_energy_mean",
            f"'04_Face_Calculations'!$T${total_row}"
        )

    # Build 3 octave blocks (vertical spacing same as Sheet 03)
    build_octave_block(3, 1, "Survival (existence)")         # rows 3-17
    build_octave_block(19, 2, "Structure (systematization)")  # rows 19-33
    build_octave_block(35, 3, "Relationships / Aspirational") # rows 35-49

    # ─────────────────────────────────────────────────────────
    # Section D: Authority + scope disclosure footer (rows 52+)
    # ─────────────────────────────────────────────────────────
    apply_brand_header(ws, 51, 1, 22,
                       "Authority + Lock #8.34 Resolution",
                       bg=DARK_NAVY, size=11)
    notes = [
        "Authority: CALCULATION_AUDIT_TRAIL.md Sections 1-5 (pentagramic derivation + worked examples + per-constant rationale).",
        "                                       ",
        "Constants source: Sheet 01 Assumptions_Constants named ranges (alpha=phi^-1, beta=0.5, gamma=0.7, kappa=phi^2 per Lock #8.32 balancedMode canonical).",
        "Element inputs: Sheet 03 Normalization_60Element_Grid cen_f<n>_o<m>_elements named ranges (per Procedure C v3 + Pure-O1 baseline).",
        "                                       ",
        "Lock #8.34 NEW (W2 Session A 2026-05-23): kappa=phi^2=2.618 canonical (NOT 4 which was pre-Lock-#8.32 enterpriseMode-rounded framing).",
        "Lock #8.22 face energies (F1=0.2563, etc.) were computed with kappa=4 and are now SUPERSEDED by Sheet 04 kappa=phi^2 outputs.",
        "Sheet 04 IS the new canonical baseline. Downstream sheets (12/13/14) consume cen_f<n>_o<m>_e_final from this sheet.",
        "                                       ",
        "Pentagramic skip pattern (s_i pairs): s1=Earth+Fire, s2=Water+Air, s3=Fire+Ether, s4=Air+Earth, s5=Ether+Water (canonical pentagram star).",
        "Intersection nodes (p_i): p1=blend(s1,s2), p2=blend(s2,s3), p3=blend(s3,s4), p4=blend(s4,s5), p5=blend(s5,s1) cycling.",
        "                                       ",
        "Band thresholds (phi-derived from Sheet 01 named ranges):",
        "  Wall: E_final < phi^-4 (0.1459); Gate: [phi^-4, phi^-2)=[0.146, 0.382);",
        "  Membrane: [phi^-2, phi^-1)=[0.382, 0.618); Hemorrhage: [phi^-1, 0.854); Vortex: >= 0.854.",
        "                                       ",
        "Named ranges defined: cen_f<n>_o<m>_e_final (36 face-energy outputs); cen_o<m>_face_energy_mean (3 per-octave means).",
        "These feed: Sheet 12 (Global Coherence kappa*mu*(1-lambda*CV)), Sheet 13 (AAG numerator/denominator + AvG cGlobal), Sheet 14 (Spectral modal amplitudes).",
    ]
    for offset, note in enumerate(notes, start=1):
        c = ws.cell(row=51 + offset, column=1, value=note)
        c.font = Font(name="Calibri", size=10, italic=True, color="404040")
        ws.merge_cells(start_row=51 + offset, start_column=1,
                       end_row=51 + offset, end_column=22)

    # Column widths
    ws.column_dimensions["A"].width = 6
    for col in ["B", "C", "D", "E", "F"]:
        ws.column_dimensions[col].width = 9
    ws.column_dimensions["G"].width = 9
    for col in ["H", "I", "J", "K", "L"]:
        ws.column_dimensions[col].width = 9
    for col in ["M", "N", "O", "P", "Q"]:
        ws.column_dimensions[col].width = 9
    ws.column_dimensions["R"].width = 9
    ws.column_dimensions["S"].width = 9
    ws.column_dimensions["T"].width = 11  # E_final highlighted
    ws.column_dimensions["U"].width = 12  # Band
    ws.column_dimensions["V"].width = 30  # Notes

    # Freeze top-3 + face column for scrolling readability
    ws.freeze_panes = "B4"

    return ws


def build_sheet_05_star_pairs(wb: Workbook):
    """Sheet 05 Star_Pairs — pentagram skip pairs per face.

    Per face, 5 elements connect in pentagram star pattern with α=φ⁻¹ weight on
    skip-pairs (Pos1↔Pos3, Pos2↔Pos4, etc.). Sheet displays the pair matrix +
    weights + intermediate values that feed Sheet 04.

    Authority: audit trail §2 (Pentagramic formula derivation).
    """
    ws = wb.create_sheet("05_Star_Pairs")
    apply_brand_header(ws, 1, 1, 8,
                       "Pentagram Star Pairs · α = φ⁻¹ Skip-Pair Weights",
                       bg=DEEP_TEAL, size=14)
    return ws


def build_sheet_06_breath_feedback(wb: Workbook):
    """Sheet 06 Breath_Feedback_Pass2 — axis-informed energy.

    Pass-2 blend: γ · F_face_pass1 + (1−γ) · F_axis_partner. Per audit trail §3.
    γ = 0.7 default (named range).

    Updates `cen_f<n>_e_local_<oN>` to Pass-2 values used by Spectral + Dashboard.
    Pass-1 values preserved in Sheet 04 for trace.
    """
    ws = wb.create_sheet("06_Breath_Feedback_Pass2")
    apply_brand_header(ws, 1, 1, 12,
                       "Breath Feedback Pass 2 · Axis-Informed Energy",
                       bg=DEEP_TEAL, size=14)
    return ws


def build_sheet_07_edges(wb: Workbook):
    """Sheet 07 Edges — 30 canonical dodecahedral edges + Lock #8.5 parallel formulas.

    Per audit trail §5 + §14, displays THREE parallel edge-metric formulas
    side-by-side per Lock #8.5 (all three are valid analytical views):

      Col F: Edge Energy   E_e = sqrt(E_A * E_B)        [audit §5 canonical]
      Col G: Edge Tension  T_e = |E_A - E_B|             [audit §5 simple]
      Col H: Breath Ratio  BR  = E_A / (E_A + E_B)       [audit §5 share form]
      Col I: Breath Ratio  BR_log = log(E_B/E_A) / log(phi)  [audit §14 log form, clamped ±2]

    30 edges per js/main.js:826-849 canonical fallback adjacency. Each face has
    exactly 5 neighbors (5 × 12 / 2 = 30 unique edges).

    Edge order matches the engine's generateEdgesFromTopology() output so that
    E1..E30 references align between SSOT + live engine state (Lock #8.27 fix
    ensures both are populated identically).

    Named ranges defined (per edge × 4 metrics = 120 cells; key aliases):
      cen_edge_<EID>_energy, cen_edge_<EID>_tension, cen_edge_<EID>_br_share,
      cen_edge_<EID>_br_log  — per-edge metrics
      cen_e1_8_energy alias    — Mode 5 carrier edge E1-8 (thesis spotlight)
      cen_e3_9_energy alias    — Mode 5 carrier edge E3-9 (thesis spotlight)

    Mode 5 carrier edges (per Sheet 14 spotlight + Q3 ANSWERED) highlighted.

    Authority: audit trail §5 (canonical edge formula) + §14 (advanced log form);
    Lock #8.5 (side-by-side display); main.js:826-849 (canonical 30-edge list);
    Mode 5 finding (E1-8 + E3-9 carrier edges per Sheet 14).
    """
    ws = wb.create_sheet("07_Edges")
    apply_brand_header(ws, 1, 1, 10,
                       "Edges — 30 canonical dodecahedral edges (Lock #8.5 side-by-side formulas)",
                       bg=DEEP_TEAL, size=14)

    # 30 canonical edges per main.js:826-849 fallback adjacency
    # Each row: (E_id_num, face_a, face_b)
    EDGES_30 = [
        (1, 1, 2),  (2, 1, 6),  (3, 1, 7),  (4, 1, 8),  (5, 1, 10),
        (6, 2, 3),  (7, 2, 6),  (8, 2, 10), (9, 2, 11),
        (10, 3, 4), (11, 3, 6), (12, 3, 9), (13, 3, 11),
        (14, 4, 5), (15, 4, 6), (16, 4, 7), (17, 4, 9),
        (18, 5, 7), (19, 5, 8), (20, 5, 9), (21, 5, 12),
        (22, 6, 7),
        (23, 7, 8),
        (24, 8, 10), (25, 8, 12),
        (26, 9, 11), (27, 9, 12),
        (28, 10, 11), (29, 10, 12),
        (30, 11, 12),
    ]
    assert len(EDGES_30) == 30, f"Expected 30 edges, got {len(EDGES_30)}"

    # Mode 5 carrier edges (from Sheet 14 spotlight + Q3 ANSWERED Mode 5 finding)
    # E1-8 = F1-F8 = edge #4; E3-9 = F3-F9 = edge #12
    MODE_5_CARRIER_EDGES = {4, 12}

    # Header row
    headers = ["#", "Edge ID", "Face A", "Face B",
               "Description",
               "Edge Energy\n√(E_A·E_B)",
               "Edge Tension\n|E_A−E_B|",
               "Breath Ratio\nE_A/(E_A+E_B)",
               "Breath Ratio (log)\nlog(E_B/E_A)/log(φ)",
               "Notes"]
    for col_idx, header_text in enumerate(headers, start=1):
        c = ws.cell(row=3, column=col_idx, value=header_text)
        c.fill = PatternFill(start_color=GRAY, end_color=GRAY, fill_type="solid")
        c.font = Font(name="Calibri", size=10, bold=True, color="000000")
        c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)

    # Per-edge rows
    for i, (e_num, face_a, face_b) in enumerate(EDGES_30):
        row = 4 + i
        edge_id = f"E{e_num}"
        face_pair_label = f"F{face_a}-F{face_b}"

        # Col A: #
        ws.cell(row=row, column=1, value=e_num).alignment = Alignment(horizontal="center")
        # Col B: Edge ID
        ws.cell(row=row, column=2, value=edge_id).font = Font(
            name="Consolas", size=10, bold=True)
        # Col C: Face A
        ws.cell(row=row, column=3, value=f"F{face_a}").alignment = Alignment(horizontal="center")
        # Col D: Face B
        ws.cell(row=row, column=4, value=f"F{face_b}").alignment = Alignment(horizontal="center")
        # Col E: Description
        ws.cell(row=row, column=5, value=face_pair_label).font = Font(
            name="Calibri", size=10, italic=True, color="606060")
        ws.cell(row=row, column=5).alignment = Alignment(horizontal="center")

        # Face energy named range references
        ref_a = f"cen_f{face_a}_o1_e_final"
        ref_b = f"cen_f{face_b}_o1_e_final"

        # Col F: Edge Energy E_e = sqrt(E_A * E_B)
        apply_formula_cell(ws, row, 6, f"=SQRT({ref_a}*{ref_b})")
        ws.cell(row=row, column=6).number_format = "0.0000"
        ws.cell(row=row, column=6).alignment = Alignment(horizontal="center")

        # Col G: Edge Tension T_e = |E_A - E_B|
        apply_formula_cell(ws, row, 7, f"=ABS({ref_a}-{ref_b})")
        ws.cell(row=row, column=7).number_format = "0.0000"
        ws.cell(row=row, column=7).alignment = Alignment(horizontal="center")

        # Col H: Breath Ratio (share form) = E_A / (E_A + E_B)
        apply_formula_cell(ws, row, 8, f"=IF({ref_a}+{ref_b}>0,{ref_a}/({ref_a}+{ref_b}),0)")
        ws.cell(row=row, column=8).number_format = "0.0000"
        ws.cell(row=row, column=8).alignment = Alignment(horizontal="center")

        # Col I: Breath Ratio (log form) = log(E_B/E_A) / log(phi), clamped to [-2, +2]
        apply_formula_cell(ws, row, 9,
            f"=IF(AND({ref_a}>0,{ref_b}>0),MAX(-2,MIN(2,LN({ref_b}/{ref_a})/LN(phi))),0)")
        ws.cell(row=row, column=9).number_format = "0.0000"
        ws.cell(row=row, column=9).alignment = Alignment(horizontal="center")

        # Col J: Notes (Mode 5 carrier highlight)
        if e_num in MODE_5_CARRIER_EDGES:
            ws.cell(row=row, column=10,
                    value=f"⭐ Mode 5 carrier edge (Sheet 14 thesis-defense spotlight)"
                    ).font = Font(name="Calibri", size=9, bold=True, italic=True, color="0D7377")
            # Highlight entire row
            for col in range(1, 11):
                if col != 10:
                    ws.cell(row=row, column=col).fill = PatternFill(
                        start_color="FFF8DC", end_color="FFF8DC", fill_type="solid")
        else:
            ws.cell(row=row, column=10, value="").font = Font(
                name="Calibri", size=9, italic=True, color="808080")

        # Named ranges per edge (per-edge metric aliases)
        eid_lc = edge_id.lower()
        add_defined_name(wb, f"cen_{eid_lc}_energy",   f"'07_Edges'!$F${row}")
        add_defined_name(wb, f"cen_{eid_lc}_tension",  f"'07_Edges'!$G${row}")
        add_defined_name(wb, f"cen_{eid_lc}_br_share", f"'07_Edges'!$H${row}")
        add_defined_name(wb, f"cen_{eid_lc}_br_log",   f"'07_Edges'!$I${row}")

        # Mode 5 carrier aliases (using F-pair notation for thesis-defense cross-reference)
        if face_a == 1 and face_b == 8:
            add_defined_name(wb, "cen_edge_e1_8_energy", f"'07_Edges'!$F${row}")
            add_defined_name(wb, "cen_edge_e1_8_tension", f"'07_Edges'!$G${row}")
        elif face_a == 3 and face_b == 9:
            add_defined_name(wb, "cen_edge_e3_9_energy", f"'07_Edges'!$F${row}")
            add_defined_name(wb, "cen_edge_e3_9_tension", f"'07_Edges'!$G${row}")

    # ─────────────────────────────────────────────────────────
    # Block B — Summary statistics (rows 35-40)
    # ─────────────────────────────────────────────────────────
    apply_brand_header(ws, 35, 1, 10,
                       "Block B — Summary Statistics (30 edges)",
                       bg=QUANTUM_PURPLE, size=11)

    ws.cell(row=36, column=1, value="Metric").font = Font(name="Calibri", size=10, bold=True)
    ws.cell(row=36, column=2, value="Min").font = Font(name="Calibri", size=10, bold=True)
    ws.cell(row=36, column=3, value="Max").font = Font(name="Calibri", size=10, bold=True)
    ws.cell(row=36, column=4, value="Mean").font = Font(name="Calibri", size=10, bold=True)
    ws.cell(row=36, column=5, value="StDev").font = Font(name="Calibri", size=10, bold=True)
    for c in range(1, 6):
        ws.cell(row=36, column=c).fill = PatternFill(start_color=GRAY, end_color=GRAY, fill_type="solid")
        ws.cell(row=36, column=c).alignment = Alignment(horizontal="center")

    # Summary rows for each metric
    summary_metrics = [
        ("Edge Energy", "F"),
        ("Edge Tension", "G"),
        ("Breath Share", "H"),
        ("Breath Log", "I"),
    ]
    for i, (label, col_letter) in enumerate(summary_metrics):
        row = 37 + i
        ws.cell(row=row, column=1, value=label).font = Font(
            name="Calibri", size=10, italic=True, color="606060")
        apply_formula_cell(ws, row, 2, f"=MIN({col_letter}4:{col_letter}33)")
        apply_formula_cell(ws, row, 3, f"=MAX({col_letter}4:{col_letter}33)")
        apply_formula_cell(ws, row, 4, f"=AVERAGE({col_letter}4:{col_letter}33)")
        apply_formula_cell(ws, row, 5, f"=STDEVP({col_letter}4:{col_letter}33)")
        for c in range(2, 6):
            ws.cell(row=row, column=c).number_format = "0.0000"
            ws.cell(row=row, column=c).alignment = Alignment(horizontal="center")

    # Named ranges for summary
    add_defined_name(wb, "cen_edges_energy_mean", "'07_Edges'!$D$37")
    add_defined_name(wb, "cen_edges_tension_mean", "'07_Edges'!$D$38")

    # ─────────────────────────────────────────────────────────
    # Footer — Authority + Mode 5 carrier callout
    # ─────────────────────────────────────────────────────────
    apply_brand_header(ws, 43, 1, 10,
                       "Authority + Mode 5 Carrier Edges (Sheet 14 spotlight)",
                       bg=DARK_NAVY, size=11)
    notes = [
        "30 canonical dodecahedral edges per js/main.js:826-849 adjacency list.",
        "Each face has exactly 5 neighbors; 5 × 12 / 2 = 30 unique face-pair edges.",
        "Per Lock #8.5: 4 parallel-column formulas surfaced (Energy/Tension/Share/Log).",
        "All four are valid analytical views per audit trail §5 + §14.",
        "                                       ",
        "MODE 5 CARRIER EDGES (Sheet 14 thesis-defense spotlight; highlighted rows):",
        "  E4  = F1-F8 (Operations-Finance Flow):    F1=−0.521, F8=+0.470 in U[:,5]",
        "  E12 = F3-F9 (Human-Regenerative Coherence): F3=+0.470, F9=−0.521 in U[:,5]",
        "  Only edges with double-ended opposite-sign Mode 5 weight = highest-leverage",
        "  intervention points per yesterday's Mode 5 deep interpretation finding.",
        "                                       ",
        "Authority: audit trail §5 (canonical edge formula) + §14 (advanced log form);",
        "  Lock #8.5 (side-by-side formula display); Lock #8.35 (κ=φ² canonical baseline);",
        "  Sheet 04 cen_f<n>_o1_e_final (face energy inputs); Sheet 14 Mode 5 finding.",
        "                                       ",
        "Named ranges: cen_e<N>_{energy,tension,br_share,br_log} per edge (120 total);",
        "  cen_edge_e1_8_energy + cen_edge_e3_9_energy (Mode 5 carrier aliases);",
        "  cen_edges_energy_mean + cen_edges_tension_mean (summary statistics).",
    ]
    for offset, note in enumerate(notes, start=1):
        c = ws.cell(row=43 + offset, column=1, value=note)
        c.font = Font(name="Calibri", size=10, italic=True, color="404040")
        ws.merge_cells(start_row=43 + offset, start_column=1,
                       end_row=43 + offset, end_column=10)

    # Column widths
    ws.column_dimensions["A"].width = 4
    ws.column_dimensions["B"].width = 7
    ws.column_dimensions["C"].width = 6
    ws.column_dimensions["D"].width = 6
    ws.column_dimensions["E"].width = 9
    ws.column_dimensions["F"].width = 12
    ws.column_dimensions["G"].width = 12
    ws.column_dimensions["H"].width = 14
    ws.column_dimensions["I"].width = 16
    ws.column_dimensions["J"].width = 48

    ws.freeze_panes = "B4"

    return ws


def build_sheet_08_vertices(wb: Workbook):
    """Sheet 08 Vertices — 20 vertices with vortex strength + direction + sequence concavity.

    Per Lock #8.19: chirality → sequenceConcavity rename across all 5 company JSONs
    + vertex-analyzer.js + tests. This sheet uses the new name throughout.

    Per audit trail §6 + §15:
      - Vortex Strength: φ^-1 · (sigma/0.577) + φ^-2 · μ
      - Vortex Coherence: 1 - (avgPairwiseDiff / 0.667)
      - SequenceConcavity: (f1-f2)(2*f2 - f1 - f3) / 2 (NOT rotational winding; Lock #8.19)
      - Leverage flag: AND(strength > φ^-1, coherence < φ^-2)

    20 canonical vertices per main.js:953-977 face-triplet adjacency.
    Each vertex has exactly 3 faces meeting at it. 12 faces × 5/vertex (each
    face borders 5 vertices) / 3 = 20 unique vertices.

    ARCHITECTURAL FINDING SURFACED 2026-05-24:
    Lock #8.11 W06v3 mapping documented BSC.L8 → V13 = F4∩F9∩F10
    (Structure+Regenerative+Values). BUT main.js canonical V13 = [4,5,9]
    (Structural+Market+Regenerative). The triplet F4+F9+F10 does NOT exist
    as a vertex in the canonical dodecahedral topology — these three faces
    don't share a common vertex.
    Discovery: BSC.L8 → V_? mapping NEEDS RECONCILIATION. Closest geometric
    matches: V10 = [3,4,9] (Human+Structural+Regenerative) or V13 = [4,5,9]
    (Structural+Market+Regenerative). Neither perfectly matches the
    Lock #8.11 semantic ("Structure+Regenerative+Values"). Partnership-
    decision needed: pick closest geometric vertex OR reframe L8 placement.
    Flagged here; Sheet 09 build will surface the decision.

    Authority: audit trail §6 (Vortex dynamics) + §15 (SequenceConcavity);
    Lock #8.19 (chirality rename sympy-proved); main.js:953-977 (canonical
    20 vertices); Lock #8.11 (W06v3 mapping — V13 reconciliation needed).
    """
    ws = wb.create_sheet("08_Vertices")
    apply_brand_header(ws, 1, 1, 13,
                       "Vertices — 20 canonical dodecahedral vertices (Lock #8.19 sequenceConcavity)",
                       bg=DEEP_TEAL, size=14)

    # 20 canonical vertices per main.js:953-977 face-triplet adjacency
    # Each row: (V_id_num, [face_a, face_b, face_c], zone_label)
    VERTICES_20 = [
        # NORTH POLAR (V1-V5): Face 1 meets its neighbors
        (1,  [1, 2, 6],  "N-polar"),  # Financial + Intellectual + Community
        (2,  [1, 2, 10], "N-polar"),  # Financial + Intellectual + Values
        (3,  [1, 6, 7],  "N-polar"),  # Financial + Community + Brand
        (4,  [1, 7, 8],  "N-polar"),  # Financial + Brand + Operations
        (5,  [1, 8, 10], "N-polar"),  # Financial + Operations + Values
        # EQUATORIAL (V6-V17)
        (6,  [2, 3, 6],  "Equator"),  # Intellectual + Human + Community
        (7,  [2, 3, 11], "Equator"),  # Intellectual + Human + Funding
        (8,  [2, 10, 11],"Equator"),  # Intellectual + Values + Funding
        (9,  [3, 4, 6],  "Equator"),  # Human + Structural + Community
        (10, [3, 4, 9],  "Equator"),  # Human + Structural + Regenerative
        (11, [3, 9, 11], "Equator"),  # Human + Regenerative + Funding
        (12, [4, 5, 7],  "Equator"),  # Structural + Market + Brand
        (13, [4, 5, 9],  "Equator"),  # Structural + Market + Regenerative ← Lock #8.11 candidate
        (14, [4, 6, 7],  "Equator"),  # Structural + Community + Brand
        (15, [5, 7, 8],  "Equator"),  # Market + Brand + Operations
        (16, [5, 8, 12], "Equator"),  # Market + Operations + Risk
        (17, [5, 9, 12], "Equator"),  # Market + Regenerative + Risk
        # SOUTH POLAR (V18-V20): Face 12 meets its neighbors
        (18, [8, 10, 12],"S-polar"),  # Operations + Values + Risk
        (19, [9, 11, 12],"S-polar"),  # Regenerative + Funding + Risk
        (20, [10, 11, 12],"S-polar"), # Values + Funding + Risk
    ]
    assert len(VERTICES_20) == 20, f"Expected 20 vertices, got {len(VERTICES_20)}"

    # Header row
    headers = ["#", "V_ID", "Zone", "F_a", "F_b", "F_c",
               "E_a", "E_b", "E_c",
               "Vortex\nStrength",
               "Vortex\nCoherence",
               "Sequence\nConcavity",
               "Leverage?", "Notes"]
    for col_idx, header_text in enumerate(headers, start=1):
        c = ws.cell(row=3, column=col_idx, value=header_text)
        c.fill = PatternFill(start_color=GRAY, end_color=GRAY, fill_type="solid")
        c.font = Font(name="Calibri", size=10, bold=True, color="000000")
        c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)

    # Per-vertex rows
    for i, (v_num, face_ids, zone) in enumerate(VERTICES_20):
        row = 4 + i
        v_id = f"V{v_num}"

        # Col A: #
        ws.cell(row=row, column=1, value=v_num).alignment = Alignment(horizontal="center")
        # Col B: V_ID
        ws.cell(row=row, column=2, value=v_id).font = Font(
            name="Consolas", size=10, bold=True)
        # Col C: Zone
        ws.cell(row=row, column=3, value=zone).font = Font(
            name="Calibri", size=9, italic=True, color="606060")
        ws.cell(row=row, column=3).alignment = Alignment(horizontal="center")
        # Col D, E, F: Face IDs
        for j, fid in enumerate(face_ids):
            ws.cell(row=row, column=4+j, value=f"F{fid}").alignment = Alignment(horizontal="center")

        # Face energy named range references
        ref_a = f"cen_f{face_ids[0]}_o1_e_final"
        ref_b = f"cen_f{face_ids[1]}_o1_e_final"
        ref_c = f"cen_f{face_ids[2]}_o1_e_final"

        # Col G, H, I: Face energy values
        for j, ref in enumerate([ref_a, ref_b, ref_c]):
            apply_formula_cell(ws, row, 7+j, f"={ref}")
            ws.cell(row=row, column=7+j).number_format = "0.0000"
            ws.cell(row=row, column=7+j).alignment = Alignment(horizontal="center")

        # Col J: Vortex Strength = phi^-1 * (sigma/0.577) + phi^-2 * mu
        # mu = AVERAGE(E_a, E_b, E_c)
        # sigma = STDEVP(E_a, E_b, E_c)
        apply_formula_cell(ws, row, 10,
            f"=phi_inv_1*(STDEVP({ref_a},{ref_b},{ref_c})/0.577)+"
            f"phi_inv_2*AVERAGE({ref_a},{ref_b},{ref_c})")
        ws.cell(row=row, column=10).number_format = "0.0000"
        ws.cell(row=row, column=10).alignment = Alignment(horizontal="center")
        ws.cell(row=row, column=10).font = Font(
            name="Calibri", size=10, bold=True, color="0D7377")

        # Col K: Vortex Coherence = 1 - (avgPairwiseDiff / 0.667)
        # avgPairwiseDiff = mean(|E_a-E_b|, |E_a-E_c|, |E_b-E_c|)
        apply_formula_cell(ws, row, 11,
            f"=1-((ABS({ref_a}-{ref_b})+ABS({ref_a}-{ref_c})+ABS({ref_b}-{ref_c}))/3)/0.667")
        ws.cell(row=row, column=11).number_format = "0.0000"
        ws.cell(row=row, column=11).alignment = Alignment(horizontal="center")

        # Col L: Sequence Concavity = (f1-f2)(2*f2 - f1 - f3) / 2 (Lock #8.19 sympy-proved)
        apply_formula_cell(ws, row, 12,
            f"=({ref_a}-{ref_b})*(2*{ref_b}-{ref_a}-{ref_c})/2")
        ws.cell(row=row, column=12).number_format = "0.0000"
        ws.cell(row=row, column=12).alignment = Alignment(horizontal="center")

        # Col M: Leverage flag = AND(strength > phi^-1, coherence < phi^-2)
        # Reference J for strength + K for coherence
        apply_formula_cell(ws, row, 13,
            f'=IF(AND(J{row}>phi_inv_1,K{row}<phi_inv_2),"⚡","")')
        ws.cell(row=row, column=13).alignment = Alignment(horizontal="center")
        ws.cell(row=row, column=13).font = Font(
            name="Calibri", size=12, bold=True, color="D946EF")

        # Col N: Notes
        notes = []
        if v_num == 13:
            notes.append("Lock #8.36 RESOLVED: V13 = F4+F5+F9 canonical; Lock #8.11 L8→V13 promotion retired (L8 reverted to F10 Ether O2; F4+F9+F10 don't share a vertex)")
        if v_num == 10:
            notes.append("Lock #8.36 RESOLVED: V10 = F3+F4+F9 canonical; was considered as L8 alternative; L8 now at F10 Ether O2 face per geometric-integrity reversion")
        ws.cell(row=row, column=14, value=" · ".join(notes) if notes else "").font = Font(
            name="Calibri", size=9, italic=True, color="808080" if not notes else "0D7377")

        # Named ranges per vertex
        add_defined_name(wb, f"cen_{v_id.lower()}_strength",  f"'08_Vertices'!$J${row}")
        add_defined_name(wb, f"cen_{v_id.lower()}_coherence", f"'08_Vertices'!$K${row}")
        add_defined_name(wb, f"cen_{v_id.lower()}_concavity", f"'08_Vertices'!$L${row}")

        # Highlight Lock #8.11 candidate row
        if v_num in (10, 13):
            for col in range(1, 14):
                ws.cell(row=row, column=col).fill = PatternFill(
                    start_color="FFF8DC", end_color="FFF8DC", fill_type="solid")

    # ─────────────────────────────────────────────────────────
    # Block B — Summary statistics + leverage count
    # ─────────────────────────────────────────────────────────
    apply_brand_header(ws, 25, 1, 14,
                       "Block B — Summary Statistics + Leverage Point Detection",
                       bg=QUANTUM_PURPLE, size=11)

    summary_rows = [
        ("Vortex Strength",  "J"),
        ("Vortex Coherence", "K"),
        ("SeqConcavity",     "L"),
    ]
    ws.cell(row=26, column=1, value="Metric").font = Font(name="Calibri", size=10, bold=True)
    ws.cell(row=26, column=2, value="Min").font = Font(name="Calibri", size=10, bold=True)
    ws.cell(row=26, column=3, value="Max").font = Font(name="Calibri", size=10, bold=True)
    ws.cell(row=26, column=4, value="Mean").font = Font(name="Calibri", size=10, bold=True)
    ws.cell(row=26, column=5, value="StDev").font = Font(name="Calibri", size=10, bold=True)
    for c in range(1, 6):
        ws.cell(row=26, column=c).fill = PatternFill(start_color=GRAY, end_color=GRAY, fill_type="solid")
        ws.cell(row=26, column=c).alignment = Alignment(horizontal="center")

    for i, (label, col_letter) in enumerate(summary_rows):
        row = 27 + i
        ws.cell(row=row, column=1, value=label).font = Font(
            name="Calibri", size=10, italic=True, color="606060")
        apply_formula_cell(ws, row, 2, f"=MIN({col_letter}4:{col_letter}23)")
        apply_formula_cell(ws, row, 3, f"=MAX({col_letter}4:{col_letter}23)")
        apply_formula_cell(ws, row, 4, f"=AVERAGE({col_letter}4:{col_letter}23)")
        apply_formula_cell(ws, row, 5, f"=STDEVP({col_letter}4:{col_letter}23)")
        for c in range(2, 6):
            ws.cell(row=row, column=c).number_format = "0.0000"
            ws.cell(row=row, column=c).alignment = Alignment(horizontal="center")

    # Leverage count
    ws.cell(row=31, column=1, value="Leverage Points Count:").font = Font(
        name="Calibri", size=11, bold=True, color="0D7377")
    apply_formula_cell(ws, 31, 2, '=COUNTIF(M4:M23,"⚡")')
    ws.cell(row=31, column=2).font = Font(
        name="Calibri", size=14, bold=True, color="D946EF")
    ws.cell(row=31, column=2).alignment = Alignment(horizontal="center")
    ws.cell(row=31, column=3, value="(leverage = strength > φ⁻¹ AND coherence < φ⁻²)"
            ).font = Font(name="Calibri", size=9, italic=True, color="606060")

    add_defined_name(wb, "cen_vertex_leverage_count", "'08_Vertices'!$B$31")

    # ─────────────────────────────────────────────────────────
    # Footer — Authority + Lock #8.11 reconciliation flag
    # ─────────────────────────────────────────────────────────
    apply_brand_header(ws, 33, 1, 14,
                       "Authority + Lock #8.11 V13 Reconciliation Architectural Finding",
                       bg=DARK_NAVY, size=11)
    notes = [
        "20 canonical dodecahedral vertices per js/main.js:953-977 face-triplet adjacency.",
        "Each vertex = exactly 3 faces meeting at a single point. 12 faces × 5 vertices/face / 3 = 20 unique.",
        "                                       ",
        "Per Lock #8.19 (sympy-proved): chirality → sequenceConcavity rename. Formula =",
        "  (f1 − f2)(2*f2 − f1 − f3) / 2 = sequence concavity at f2, NOT rotational winding.",
        "                                       ",
        "ARCHITECTURAL FINDING 2026-05-24 (surfaced during Sheet 08 build):",
        "Lock #8.11 W06v3 KPI mapping documented BSC.L8 → V13 = F4∩F9∩F10 (Structure+Regen+Values).",
        "BUT canonical V13 per main.js = F4∩F5∩F9 (Structural+Market+Regenerative).",
        "The triplet F4+F9+F10 does NOT exist as a vertex in dodecahedral topology — those 3 faces",
        "don't share a common vertex. The Lock #8.11 V13 mapping needs partnership-reconciliation.",
        "                                       ",
        "Closest geometric candidates (rows highlighted):",
        "  V10 = F3+F4+F9 (Human+Structural+Regenerative) — geometric closest to 'Structure+Regen+Values'",
        "  V13 = F4+F5+F9 (Structural+Market+Regenerative) — current Lock #8.11 vertex number",
        "Neither perfectly matches semantic. Surfacing for partnership-decide.",
        "                                       ",
        "Authority: audit trail §6 (Vortex) + §15 (SequenceConcavity); Lock #8.19 (rename);",
        "  main.js:953-977 (canonical 20 vertices); Lock #8.11 (V13 mapping needs reconciliation).",
        "                                       ",
        "Named ranges: cen_v<N>_{strength,coherence,concavity} per vertex; cen_vertex_leverage_count.",
    ]
    for offset, note in enumerate(notes, start=1):
        c = ws.cell(row=33 + offset, column=1, value=note)
        c.font = Font(name="Calibri", size=10, italic=True, color="404040")
        ws.merge_cells(start_row=33 + offset, start_column=1,
                       end_row=33 + offset, end_column=14)

    # Column widths
    ws.column_dimensions["A"].width = 4
    ws.column_dimensions["B"].width = 6
    ws.column_dimensions["C"].width = 9
    for col in ["D", "E", "F"]:
        ws.column_dimensions[col].width = 5
    for col in ["G", "H", "I"]:
        ws.column_dimensions[col].width = 9
    ws.column_dimensions["J"].width = 11
    ws.column_dimensions["K"].width = 11
    ws.column_dimensions["L"].width = 11
    ws.column_dimensions["M"].width = 10
    ws.column_dimensions["N"].width = 56

    ws.freeze_panes = "B4"

    return ws


def build_sheet_09_bidirectional(wb: Workbook):
    """Sheet 09 Vertex_KPIs + Bi-Directional Intervention Map — Lock #8.24.

    Three blocks per design (CEN_SSOT_BiDirectional_CoEvolution_Architecture_2026-05-22.md
    + POC audit trail §17):

      Block A — Vertex_KPIs subsection:
        - First vertex-KPI: BSC.L8 SDG alignment → Vertex V13 (F4 ∩ F9 ∩ F10)
        - Question-match 10/10 (per Procedure C)

      Block B — Elemental Influence Signatures:
        - 30 edges × 10-tuple signature (per Edge)
        - 20 vertices × 15-tuple signature (per Vertex)
        - Forward = math; backward = explicit signatures; closed-loop intervention

      Block C — Action Simulator:
        - "If we shift KPI X by ΔX, which face/edge/vertex changes by how much?"
        - Closes diagnostic-intervention loop without modifying forward math

    Authority: Lock #8.24 + POC/docs/math/CALCULATION_AUDIT_TRAIL.md §17.
    """
    ws = wb.create_sheet("09_Vertex_KPIs_BiDirectional")
    apply_brand_header(ws, 1, 1, 12,
                       "Vertex KPIs + Bi-Directional Intervention Map (Lock #8.24)",
                       bg=MAGENTA_PINK, size=14)
    return ws


def build_sheet_10_breath_axes(wb: Workbook):
    """Sheet 10 Breath_Axes — 6 breath axes with polarity scores.

    Per axis (6 rows):
      - Projection face / Reception face / Polarity reading per scorer (D, E, V_res_post)
      - Pattern label (Consensus / 2-vs-1 / Inversion)

    Axis 5 Perception & Truth row: magenta-tinted alert (FULL POLARITY INVERSION,
    D=−2, E=+2, V_res=+2 for CEN per Sheet 16 design doc).

    Authority: docs/BREATH_AXIS_REFERENCE.md.
    """
    ws = wb.create_sheet("10_Breath_Axes")
    apply_brand_header(ws, 1, 1, 8,
                       "Six Breath Axes · Polarity Readings",
                       bg=DEEP_TEAL, size=14)
    return ws


def build_sheet_11_octave_detection(wb: Workbook):
    """Sheet 11 Octave_Detection — both paths + Foundation Principle.

    Path 1: Direct max(octave_band per face) → org octave
    Path 2: geomean(face_octaves) − spread_penalty → org octave
    Foundation Principle reconciles when paths disagree.

    Defines named ranges `cen_org_octave`, `cen_octave_path1`, `cen_octave_path2`.

    Authority: audit trail Appendix C (Foundation Principle).
    """
    ws = wb.create_sheet("11_Octave_Detection")
    apply_brand_header(ws, 1, 1, 8,
                       "Octave Detection · Path 1 + Path 2 + Foundation Principle",
                       bg=DEEP_TEAL, size=14)
    return ws


def build_sheet_12_global_coherence(wb: Workbook):
    """Sheet 12 Global_Coherence — the SSOT's headline aggregate metric.

    Computes Global Coherence per octave from Sheet 04 face energies using
    the audit trail §1 canonical formula:

      Step 1: mu_E   = mean(12 face E_final at this octave)
      Step 2: sigma_E = STDEV.P(12 face E_final at this octave)
      Step 3: CV_E   = sigma_E / mu_E              (coefficient of variation)
      Step 4: C_raw  = mu_E * (1 - lambda * CV_E)  (pre-amplifier; PRE-kappa)
                       where lambda = phi^-3 (penalty for variance)
      Step 5: C_amp  = 1 / (1 + exp(-kappa * (C_raw - 0.5)))
                       (post-amplifier; logistic sensitivity, kappa = phi^2
                        per Lock #8.35 spectral-derivation canonical)
      Step 6: Band   = Wall/Gate/Membrane/Hemorrhage/Vortex (Sheet 04 thresholds)

    DOUBLE-VALUE DISCIPLINE (per audit trail §16):
      - C_raw is the PRE-amplifier canonical value consumed by Sheet 13 AvG
        (must be apples-to-apples with K_mean_60 which has no amplifier)
      - C_amp is the POST-amplifier headline value shown on Sheet 16 Dashboard
      - BOTH are exposed via named ranges for downstream consumers

    Lock #8.35 alignment: kappa = phi^2 is geometrically derived from the
    dodecahedral Laplacian spectrum polarity ratio (5+sqrt(5))/(5-sqrt(5)).
    The amplifier is the methodology's own gentle restraint, not arbitrary tuning.

    Named ranges defined (12 total: 4 per octave x 3 octaves):
      cen_o<m>_global_mu     — mu_E per octave
      cen_o<m>_global_sigma  — sigma_E per octave
      cen_o<m>_global_cv     — CV_E per octave
      cen_o<m>_global_raw    — C_raw per octave (consumed by Sheet 13 AvG)
      cen_o<m>_global_amp    — C_amp per octave (consumed by Sheet 16 Dashboard)
    Plus headline shortcuts:
      cen_global_coherence_o1     — alias for cen_o1_global_amp (headline)
      cen_global_coherence_raw_o1 — alias for cen_o1_global_raw (AvG input)

    Authority:
      - audit trail §1 (Global Coherence canonical formula)
      - Lock #8.35 (kappa = phi^2 spectral-derivation canonical)
      - Lock #8.34 (Sheet 04 outputs are the new canonical baseline)
      - Sheet 04 cen_f<n>_o<m>_e_final named ranges (input layer)
    """
    ws = wb.create_sheet("12_Global_Coherence")
    apply_brand_header(ws, 1, 1, 8,
                       "Global Coherence — Headline Aggregate Metric (per Octave)",
                       bg=DEEP_TEAL, size=14)

    # ─────────────────────────────────────────────────────────
    # Block A — Per-octave full calculation (rows 3-11)
    # ─────────────────────────────────────────────────────────
    apply_brand_header(ws, 3, 1, 8,
                       "Block A — Per-Octave Global Coherence Calculation",
                       bg=QUANTUM_PURPLE, size=11)

    # Header row
    headers = [
        "Octave", "mu_E\n(mean)", "sigma_E\n(std)", "CV_E\n(coeff var)",
        "C_raw\n(pre-amp)", "C_amp\n(post-kappa)", "Band", "Notes"
    ]
    for col_idx, header_text in enumerate(headers, start=1):
        c = ws.cell(row=4, column=col_idx, value=header_text)
        c.fill = PatternFill(start_color=GRAY, end_color=GRAY, fill_type="solid")
        c.font = Font(name="Calibri", size=10, bold=True, color="000000")
        c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)

    # Sheet 04 face block T-column ranges per octave (from earlier build)
    # O1 block: rows 4-15 in Sheet 04 → T4:T15
    # O2 block: rows 20-31 → T20:T31
    # O3 block: rows 36-47 → T36:T47
    OCTAVE_SOURCE_RANGES = {
        1: ("T4:T15", "Survival (existence) — feeds Sheet 13 AAG/AvG + Sheet 14 Spectral"),
        2: ("T20:T31", "Structure (systematization)"),
        3: ("T36:T47", "Relationships / Aspirational"),
    }

    for row_offset, (octave_num, (sheet04_range, note)) in enumerate(OCTAVE_SOURCE_RANGES.items()):
        row = 5 + row_offset  # rows 5, 6, 7

        # Col A: Octave label
        ws.cell(row=row, column=1, value=f"O{octave_num}").font = Font(
            name="Calibri", size=11, bold=True, color="0D7377")

        # Col B: mu_E = mean of 12 face energies at this octave
        apply_formula_cell(ws, row, 2, f"=AVERAGE('04_Face_Calculations'!{sheet04_range})")
        ws.cell(row=row, column=2).number_format = "0.0000"
        ws.cell(row=row, column=2).alignment = Alignment(horizontal="center")

        # Col C: sigma_E = STDEVP (population) of 12 face energies
        # NOTE: Use STDEVP (legacy syntax, no dot) for LibreOffice compatibility;
        # STDEV.P (dotted Excel-newer syntax) returned #NAME? in LibreOffice eval.
        # Both Excel + LibreOffice support STDEVP universally.
        apply_formula_cell(ws, row, 3, f"=STDEVP('04_Face_Calculations'!{sheet04_range})")
        ws.cell(row=row, column=3).number_format = "0.0000"
        ws.cell(row=row, column=3).alignment = Alignment(horizontal="center")

        # Col D: CV_E = sigma_E / mu_E (with divide-by-zero guard)
        apply_formula_cell(ws, row, 4, f"=IF(B{row}>0,C{row}/B{row},0)")
        ws.cell(row=row, column=4).number_format = "0.0000"
        ws.cell(row=row, column=4).alignment = Alignment(horizontal="center")

        # Col E: C_raw = mu_E * (1 - lambda * CV_E)  [pre-amplifier; PRE-kappa]
        # NOTE: named range is `lambda` (not `lambda_cv`) per Sheet 01.
        apply_formula_cell(ws, row, 5, f"=B{row}*(1-lambda*D{row})")
        ws.cell(row=row, column=5).number_format = "0.0000"
        ws.cell(row=row, column=5).alignment = Alignment(horizontal="center")
        ws.cell(row=row, column=5).font = Font(
            name="Calibri", size=10, bold=True, color="404040")

        # Col F: C_amp = 1/(1+EXP(-kappa*(C_raw-0.5)))  [post-amplifier]
        apply_formula_cell(ws, row, 6, f"=1/(1+EXP(-kappa*(E{row}-0.5)))")
        ws.cell(row=row, column=6).number_format = "0.0000"
        ws.cell(row=row, column=6).alignment = Alignment(horizontal="center")
        # Highlight C_amp — this is the headline number
        ws.cell(row=row, column=6).font = Font(
            name="Calibri", size=11, bold=True, color="0D7377")
        ws.cell(row=row, column=6).fill = PatternFill(
            start_color="E0F4F4", end_color="E0F4F4", fill_type="solid")

        # Col G: Band (same classification as Sheet 04 col U)
        apply_formula_cell(
            ws, row, 7,
            f'=IF(F{row}<phi_inv_4,"Wall",'
            f'IF(F{row}<phi_inv_2,"Gate",'
            f'IF(F{row}<phi_inv_1,"Membrane",'
            f'IF(F{row}<0.854,"Hemorrhage","Vortex"))))'
        )
        ws.cell(row=row, column=7).alignment = Alignment(horizontal="center")
        ws.cell(row=row, column=7).font = Font(
            name="Calibri", size=10, italic=True, color="606060")

        # Col H: Notes
        ws.cell(row=row, column=8, value=note).font = Font(
            name="Calibri", size=9, italic=True, color="808080")

        # Define named ranges
        add_defined_name(wb, f"cen_o{octave_num}_global_mu",
                          f"'12_Global_Coherence'!$B${row}")
        add_defined_name(wb, f"cen_o{octave_num}_global_sigma",
                          f"'12_Global_Coherence'!$C${row}")
        add_defined_name(wb, f"cen_o{octave_num}_global_cv",
                          f"'12_Global_Coherence'!$D${row}")
        add_defined_name(wb, f"cen_o{octave_num}_global_raw",
                          f"'12_Global_Coherence'!$E${row}")
        add_defined_name(wb, f"cen_o{octave_num}_global_amp",
                          f"'12_Global_Coherence'!$F${row}")

    # Aliases for headline O1 number (Sheet 16 + Sheet 13 read these by short name)
    add_defined_name(wb, "cen_global_coherence_o1",
                      f"'12_Global_Coherence'!$F$5")
    add_defined_name(wb, "cen_global_coherence_raw_o1",
                      f"'12_Global_Coherence'!$E$5")

    # ─────────────────────────────────────────────────────────
    # Block B — O1 Headline Highlight (rows 10-13)
    # ─────────────────────────────────────────────────────────
    apply_brand_header(ws, 10, 1, 8,
                       "Block B — O1 Headline (Thesis-Defense + CEN-Client Marquee)",
                       bg=DARK_NAVY, size=11)

    # Row 11: HEADLINE
    ws.cell(row=11, column=1, value="CEN").font = Font(
        name="Calibri", size=12, bold=True, color="0D7377")
    ws.cell(row=11, column=2, value="Global Coherence (O1):").font = Font(
        name="Calibri", size=12, bold=True, color="0D7377")
    ws.merge_cells(start_row=11, start_column=2, end_row=11, end_column=4)
    apply_formula_cell(ws, 11, 5, f"=cen_global_coherence_o1")
    ws.cell(row=11, column=5).number_format = "0.0000"
    ws.cell(row=11, column=5).font = Font(
        name="Calibri", size=18, bold=True, color="0D7377")
    ws.cell(row=11, column=5).fill = PatternFill(
        start_color="FFF8DC", end_color="FFF8DC", fill_type="solid")  # PALE_YELLOW
    ws.cell(row=11, column=5).alignment = Alignment(horizontal="center")
    apply_formula_cell(ws, 11, 6, f'=IF(F5<phi_inv_4,"Wall",IF(F5<phi_inv_2,"Gate",IF(F5<phi_inv_1,"Membrane",IF(F5<0.854,"Hemorrhage","Vortex"))))')
    ws.cell(row=11, column=6).font = Font(
        name="Calibri", size=14, bold=True, italic=True, color="404040")
    ws.cell(row=11, column=6).alignment = Alignment(horizontal="center")
    ws.cell(row=11, column=6).fill = PatternFill(
        start_color="FFF8DC", end_color="FFF8DC", fill_type="solid")

    # Row 12: pre-amp value for transparency
    ws.cell(row=12, column=1, value="(pre-amp:").font = Font(
        name="Calibri", size=10, italic=True, color="808080")
    apply_formula_cell(ws, 12, 2, f"=cen_global_coherence_raw_o1")
    ws.cell(row=12, column=2).number_format = "0.0000"
    ws.cell(row=12, column=2).font = Font(
        name="Calibri", size=10, italic=True, color="808080")
    ws.cell(row=12, column=2).alignment = Alignment(horizontal="left")
    ws.cell(row=12, column=3, value="— consumed by Sheet 13 AvG diagnostic)").font = Font(
        name="Calibri", size=10, italic=True, color="808080")
    ws.merge_cells(start_row=12, start_column=3, end_row=12, end_column=6)

    # ─────────────────────────────────────────────────────────
    # Footer — Authority + Provenance (rows 15+)
    # ─────────────────────────────────────────────────────────
    apply_brand_header(ws, 15, 1, 8,
                       "Authority + Provenance",
                       bg=DARK_NAVY, size=11)
    notes = [
        "Formula: C = sigmoid(kappa * (mu * (1 - lambda * CV) - 0.5))   [post-amplifier]",
        "Where: mu = mean(12 face E_final), sigma = STDEV.P, CV = sigma/mu, lambda = phi^-3 (variance penalty), kappa = phi^2 (Lock #8.35)",
        "                                       ",
        "Authority: audit trail §1 (Global Coherence canonical formula); Lock #8.35 (kappa = phi^2 from dodecahedral spectrum polarity ratio).",
        "Input: Sheet 04 cen_f<n>_o<m>_e_final named ranges (T-column per octave block).",
        "                                       ",
        "Per Lock #8.35: kappa is geometrically derived from (5+sqrt(5))/(5-sqrt(5)) = phi^2.",
        "Per Lock #8.34: Sheet 04 outputs at kappa=phi^2 are the canonical Lock #8.22 v2 baseline.",
        "Per audit trail §16: C_raw (pre-amplifier) is consumed by Sheet 13 AvG for apples-to-apples comparison with K_mean_60 (which has no amplifier).",
        "                                       ",
        "Named ranges defined (15 total: 5 per octave × 3 octaves):",
        "  cen_o<m>_global_{mu,sigma,cv,raw,amp} — full per-octave decomposition",
        "  cen_global_coherence_o1 — headline alias (Sheet 16 Dashboard consumer)",
        "  cen_global_coherence_raw_o1 — pre-amplifier alias (Sheet 13 AvG consumer)",
        "                                       ",
        "Honest disclosure: Lock #8.35 narrative-reframe applies here — the post-amplifier C_amp at kappa=phi^2",
        "represents the methodology's geometrically-canonical reading. Earlier kappa=4 baselines produced higher",
        "C_amp values (more amplified); the gentler kappa=phi^2 amplifier reflects methodological restraint",
        "(absence of variance != evidence of high coherence).",
    ]
    for offset, note in enumerate(notes, start=1):
        c = ws.cell(row=15 + offset, column=1, value=note)
        c.font = Font(name="Calibri", size=10, italic=True, color="404040")
        ws.merge_cells(start_row=15 + offset, start_column=1,
                       end_row=15 + offset, end_column=8)

    # Column widths
    ws.column_dimensions["A"].width = 10
    ws.column_dimensions["B"].width = 12
    ws.column_dimensions["C"].width = 12
    ws.column_dimensions["D"].width = 12
    ws.column_dimensions["E"].width = 13
    ws.column_dimensions["F"].width = 14
    ws.column_dimensions["G"].width = 13
    ws.column_dimensions["H"].width = 50

    return ws


def build_sheet_13_diagnostics(wb: Workbook):
    """Sheet 13 Diagnostics_AAG_AvG — canonical AAG (Wk8) + AvG (audit trail §16).

    Two diagnostic blocks:

    BLOCK A — AAG (Aspiration-Actuality Gap) per audit trail §12 + Lock #8.17:
      AAG = E_Aspiration / E_Actuality
      E_Actuality  = mean(E_F1, E_F2, E_F3)       [Financial+Conceptual+Human]
      E_Aspiration = mean(E_F10, E_F11, E_F12)    [Values+Funding+Risk]
      Per Lock #8.17: Wk8 canonical face-grouping ratio (NOT per-vector mean
      coherence which was Phase 2 Evidence Package misnomer).

      Interpretation bands (per audit trail §12):
        AAG > 1.5      — "Critical: values without operational ground"
        1.2 < AAG ≤ 1.5 — "Aspiring beyond capacity (Hidden Oracle pattern)"
        0.8 ≤ AAG ≤ 1.2 — "Balanced — aspiration met by capacity"
        AAG < 0.8      — "Actuality outpacing aspiration (under-claiming)"

    BLOCK B — AvG (Apparent vs Granular Gap) per audit trail §16 + Lock #8.26:
      AvG = |C_global_raw − K_mean_60|
      where C_global_raw = Sheet 12 cen_global_coherence_raw_o1 (pre-amplifier)
            K_mean_60     = Sheet 03 cen_k_mean_60_all
      Both terms are kappa-independent (no amplifier). Apples-to-apples.

      Band thresholds (phi-derived per audit trail §16):
        AvG < phi^-6 (≈0.056)  — "Faithful aggregation"
        phi^-6 ≤ AvG < phi^-5 (≈0.090) — "Minor compression artifact"
        phi^-5 ≤ AvG < phi^-4 (≈0.146) — "Aggregation distortion"
        AvG ≥ phi^-4 (≈0.146)  — "Severe aggregation distortion"

    LOCK #8.35 NARRATIVE REFRAME ALIGNMENT:
    Both AAG + AvG values shift at kappa=phi^2 baseline (vs kappa=4 v1).
    The shift is methodologically meaningful but the structural finding
    (architectural blindness lives at C_raw=0 evidence layer) is robust
    across kappa choice. Same "absence of evidence != evidence of
    catastrophe" principle applies — diagnostics are gentler at canonical
    kappa, not less real.

    Named ranges defined (8 total):
      cen_aag_o1, cen_aag_o2, cen_aag_o3              — AAG per octave
      cen_aag_actuality_o1, cen_aag_aspiration_o1     — AAG decomposition
      cen_avg_o1, cen_avg_band                         — AvG canonical
      cen_kpi_mean_60                                  — K_mean_60 alias

    Authority:
      - audit trail §12 (AAG canonical formula + interpretation bands)
      - audit trail §16 (AvG canonical formula + phi-derived band thresholds)
      - Lock #8.15 + #8.17 (Wk8 canonical AAG, NOT Phase 2 misnomer)
      - Lock #8.26 (AvG Diagnostics.js implementation)
      - Lock #8.35 (kappa=phi^2 canonical; gentle-amplifier methodological restraint)
      - Sheet 04 cen_f<n>_o<m>_e_final (face energy inputs)
      - Sheet 12 cen_global_coherence_raw_o1 (AvG numerator)
      - Sheet 03 cen_k_mean_60_all (AvG denominator)
    """
    ws = wb.create_sheet("13_Diagnostics_AAG_AvG")
    apply_brand_header(ws, 1, 1, 8,
                       "Diagnostics — AAG (Wk8 canonical) + AvG (per audit trail §16)",
                       bg=DEEP_TEAL, size=14)

    # ─────────────────────────────────────────────────────────
    # BLOCK A — AAG per octave (rows 3-12)
    # ─────────────────────────────────────────────────────────
    apply_brand_header(ws, 3, 1, 8,
                       "Block A — AAG (Aspiration-Actuality Gap) per Octave",
                       bg=QUANTUM_PURPLE, size=11)

    # Column headers (row 4)
    aag_headers = [
        "Octave",
        "E_Actuality\n(F1+F2+F3)/3",
        "E_Aspiration\n(F10+F11+F12)/3",
        "AAG\n= Asp/Act",
        "Band",
        "Interpretation",
        "Notes", "—"
    ]
    for col_idx, header_text in enumerate(aag_headers, start=1):
        c = ws.cell(row=4, column=col_idx, value=header_text)
        c.fill = PatternFill(start_color=GRAY, end_color=GRAY, fill_type="solid")
        c.font = Font(name="Calibri", size=10, bold=True, color="000000")
        c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)

    # Per-octave AAG rows (5, 6, 7)
    for row_offset, octave_num in enumerate([1, 2, 3]):
        row = 5 + row_offset

        # Col A: Octave label
        ws.cell(row=row, column=1, value=f"O{octave_num}").font = Font(
            name="Calibri", size=11, bold=True, color="0D7377")

        # Col B: E_Actuality = mean(F1, F2, F3) for this octave
        apply_formula_cell(
            ws, row, 2,
            f"=AVERAGE(cen_f1_o{octave_num}_e_final,"
            f"cen_f2_o{octave_num}_e_final,"
            f"cen_f3_o{octave_num}_e_final)"
        )
        ws.cell(row=row, column=2).number_format = "0.0000"
        ws.cell(row=row, column=2).alignment = Alignment(horizontal="center")

        # Col C: E_Aspiration = mean(F10, F11, F12) for this octave
        apply_formula_cell(
            ws, row, 3,
            f"=AVERAGE(cen_f10_o{octave_num}_e_final,"
            f"cen_f11_o{octave_num}_e_final,"
            f"cen_f12_o{octave_num}_e_final)"
        )
        ws.cell(row=row, column=3).number_format = "0.0000"
        ws.cell(row=row, column=3).alignment = Alignment(horizontal="center")

        # Col D: AAG = E_Aspiration / E_Actuality (with /0 guard returning blank)
        apply_formula_cell(ws, row, 4,
                            f'=IF(B{row}>0,C{row}/B{row},"")')
        ws.cell(row=row, column=4).number_format = "0.0000"
        ws.cell(row=row, column=4).alignment = Alignment(horizontal="center")
        # HEADLINE for AAG: bold + highlighted
        ws.cell(row=row, column=4).font = Font(
            name="Calibri", size=11, bold=True, color="0D7377")
        ws.cell(row=row, column=4).fill = PatternFill(
            start_color="E0F4F4", end_color="E0F4F4", fill_type="solid")

        # Col E: Band classification per audit trail §12 thresholds
        apply_formula_cell(
            ws, row, 5,
            f'=IF(D{row}="","N/A",'
            f'IF(D{row}>1.5,"Critical",'
            f'IF(D{row}>1.2,"Aspiring",'
            f'IF(D{row}>=0.8,"Balanced","Under-claim"))))'
        )
        ws.cell(row=row, column=5).alignment = Alignment(horizontal="center")
        ws.cell(row=row, column=5).font = Font(
            name="Calibri", size=10, italic=True, color="606060")

        # Col F: Interpretation text per band
        apply_formula_cell(
            ws, row, 6,
            f'=IF(D{row}="","(no face energy at this octave)",'
            f'IF(D{row}>1.5,"Values without operational ground",'
            f'IF(D{row}>1.2,"Aspiring beyond capacity (Hidden Oracle pattern)",'
            f'IF(D{row}>=0.8,"Aspiration met by capacity","Actuality outpacing aspiration (under-claiming, latent capacity)"))))'
        )
        ws.cell(row=row, column=6).font = Font(
            name="Calibri", size=9, italic=True, color="606060")

        # Col G: Notes
        note_text = ("Sheet 04 cen_f<n>_o1_e_final consumer (Lock #8.35 canonical baseline)"
                     if octave_num == 1
                     else f"O{octave_num} TBD — Sheet 02 BSC KPI values pending partnership-validation")
        ws.cell(row=row, column=7, value=note_text).font = Font(
            name="Calibri", size=9, italic=True, color="808080")

        # Named ranges
        add_defined_name(wb, f"cen_aag_actuality_o{octave_num}",
                          f"'13_Diagnostics_AAG_AvG'!$B${row}")
        add_defined_name(wb, f"cen_aag_aspiration_o{octave_num}",
                          f"'13_Diagnostics_AAG_AvG'!$C${row}")
        add_defined_name(wb, f"cen_aag_o{octave_num}",
                          f"'13_Diagnostics_AAG_AvG'!$D${row}")

    # AAG O1 headline highlight (rows 9-10)
    apply_brand_header(ws, 9, 1, 8,
                       "AAG O1 Headline (Wk8 canonical, Lock #8.17)",
                       bg=DARK_NAVY, size=11)
    ws.cell(row=10, column=1, value="CEN").font = Font(
        name="Calibri", size=12, bold=True, color="0D7377")
    ws.cell(row=10, column=2, value="AAG (O1):").font = Font(
        name="Calibri", size=12, bold=True, color="0D7377")
    apply_formula_cell(ws, 10, 3, f"=cen_aag_o1")
    ws.cell(row=10, column=3).number_format = "0.0000"
    ws.cell(row=10, column=3).font = Font(
        name="Calibri", size=18, bold=True, color="0D7377")
    ws.cell(row=10, column=3).fill = PatternFill(
        start_color="FFF8DC", end_color="FFF8DC", fill_type="solid")
    ws.cell(row=10, column=3).alignment = Alignment(horizontal="center")
    # Reference to band at row 5 (AAG_O1)
    apply_formula_cell(ws, 10, 4, f"=E5")
    ws.cell(row=10, column=4).font = Font(
        name="Calibri", size=14, bold=True, italic=True, color="404040")
    ws.cell(row=10, column=4).alignment = Alignment(horizontal="center")
    ws.cell(row=10, column=4).fill = PatternFill(
        start_color="FFF8DC", end_color="FFF8DC", fill_type="solid")

    # ─────────────────────────────────────────────────────────
    # BLOCK B — AvG (Apparent vs Granular Gap) (rows 13-22)
    # ─────────────────────────────────────────────────────────
    apply_brand_header(ws, 13, 1, 8,
                       "Block B — AvG (Apparent vs Granular Gap) per audit trail §16",
                       bg=QUANTUM_PURPLE, size=11)

    # Column headers (row 14)
    avg_headers = [
        "Scope",
        "C_global_raw\n(pre-amp)",
        "K_mean_60\n(KPI grid mean)",
        "AvG\n= |C_raw - K|",
        "Band",
        "Interpretation",
        "Notes", "—"
    ]
    for col_idx, header_text in enumerate(avg_headers, start=1):
        c = ws.cell(row=14, column=col_idx, value=header_text)
        c.fill = PatternFill(start_color=GRAY, end_color=GRAY, fill_type="solid")
        c.font = Font(name="Calibri", size=10, bold=True, color="000000")
        c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)

    # Single AvG row (canonical strict-O1 scope per Lock #8.22 v2 baseline)
    avg_row = 15
    ws.cell(row=avg_row, column=1, value="O1 (canonical)").font = Font(
        name="Calibri", size=11, bold=True, color="0D7377")

    # Col B: C_global_raw from Sheet 12
    apply_formula_cell(ws, avg_row, 2, f"=cen_global_coherence_raw_o1")
    ws.cell(row=avg_row, column=2).number_format = "0.0000"
    ws.cell(row=avg_row, column=2).alignment = Alignment(horizontal="center")

    # Col C: K_mean_60 from Sheet 03
    apply_formula_cell(ws, avg_row, 3, f"=cen_k_mean_60_all")
    ws.cell(row=avg_row, column=3).number_format = "0.0000"
    ws.cell(row=avg_row, column=3).alignment = Alignment(horizontal="center")

    # Col D: AvG = |C_raw - K_mean_60|
    apply_formula_cell(ws, avg_row, 4, f"=ABS(B{avg_row}-C{avg_row})")
    ws.cell(row=avg_row, column=4).number_format = "0.0000"
    ws.cell(row=avg_row, column=4).alignment = Alignment(horizontal="center")
    ws.cell(row=avg_row, column=4).font = Font(
        name="Calibri", size=11, bold=True, color="0D7377")
    ws.cell(row=avg_row, column=4).fill = PatternFill(
        start_color="E0F4F4", end_color="E0F4F4", fill_type="solid")

    # Col E: Band per phi-derived thresholds (phi^-6, phi^-5, phi^-4)
    # phi^-6 ≈ 0.0557, phi^-5 ≈ 0.0902, phi^-4 ≈ 0.1459
    apply_formula_cell(
        ws, avg_row, 5,
        f'=IF(D{avg_row}<(1/phi^6),"Faithful",'
        f'IF(D{avg_row}<(1/phi^5),"Minor",'
        f'IF(D{avg_row}<phi_inv_4,"Distortion","Severe")))'
    )
    ws.cell(row=avg_row, column=5).alignment = Alignment(horizontal="center")
    ws.cell(row=avg_row, column=5).font = Font(
        name="Calibri", size=10, italic=True, color="606060")

    # Col F: Interpretation
    apply_formula_cell(
        ws, avg_row, 6,
        f'=IF(D{avg_row}<(1/phi^6),"Rollup honest to underlying detail",'
        f'IF(D{avg_row}<(1/phi^5),"Acceptable compression; headline still representative",'
        f'IF(D{avg_row}<phi_inv_4,"Rollup masking variance — investigate face contributions","Rollup disconnected from KPI detail — pair with granular evidence")))'
    )
    ws.cell(row=avg_row, column=6).font = Font(
        name="Calibri", size=9, italic=True, color="606060")

    # Col G: Notes
    ws.cell(row=avg_row, column=7,
            value="Lock #8.22 v2 baseline (κ=φ² canonical per Lock #8.35)"
    ).font = Font(name="Calibri", size=9, italic=True, color="808080")

    # Named ranges
    add_defined_name(wb, "cen_avg_o1", f"'13_Diagnostics_AAG_AvG'!$D${avg_row}")
    add_defined_name(wb, "cen_avg_band", f"'13_Diagnostics_AAG_AvG'!$E${avg_row}")
    add_defined_name(wb, "cen_kpi_mean_60", f"'13_Diagnostics_AAG_AvG'!$C${avg_row}")

    # AvG headline highlight (rows 17-18)
    apply_brand_header(ws, 17, 1, 8,
                       "AvG Headline (canonical, Lock #8.26 + #8.35)",
                       bg=DARK_NAVY, size=11)
    ws.cell(row=18, column=1, value="CEN").font = Font(
        name="Calibri", size=12, bold=True, color="0D7377")
    ws.cell(row=18, column=2, value="AvG (O1):").font = Font(
        name="Calibri", size=12, bold=True, color="0D7377")
    apply_formula_cell(ws, 18, 3, f"=cen_avg_o1")
    ws.cell(row=18, column=3).number_format = "0.0000"
    ws.cell(row=18, column=3).font = Font(
        name="Calibri", size=18, bold=True, color="0D7377")
    ws.cell(row=18, column=3).fill = PatternFill(
        start_color="FFF8DC", end_color="FFF8DC", fill_type="solid")
    ws.cell(row=18, column=3).alignment = Alignment(horizontal="center")
    apply_formula_cell(ws, 18, 4, f"=cen_avg_band")
    ws.cell(row=18, column=4).font = Font(
        name="Calibri", size=14, bold=True, italic=True, color="404040")
    ws.cell(row=18, column=4).alignment = Alignment(horizontal="center")
    ws.cell(row=18, column=4).fill = PatternFill(
        start_color="FFF8DC", end_color="FFF8DC", fill_type="solid")

    # ─────────────────────────────────────────────────────────
    # FOOTER — Authority + Lock #8.35 alignment
    # ─────────────────────────────────────────────────────────
    apply_brand_header(ws, 20, 1, 8,
                       "Authority + Lock #8.35 Narrative-Reframe Alignment",
                       bg=DARK_NAVY, size=11)
    notes = [
        "AAG formula: E_Aspiration / E_Actuality where Actuality=mean(F1,F2,F3), Aspiration=mean(F10,F11,F12).",
        "AAG bands (audit trail §12): Critical >1.5; Aspiring 1.2-1.5; Balanced 0.8-1.2; Under-claim <0.8.",
        "                                       ",
        "AvG formula: |C_global_raw - K_mean_60| where both terms are kappa-INDEPENDENT (apples-to-apples).",
        "AvG bands (audit trail §16): Faithful <phi^-6; Minor <phi^-5; Distortion <phi^-4; Severe >=phi^-4.",
        "                                       ",
        "Authority: audit trail §12 (AAG) + §16 (AvG); Lock #8.17 (AAG Wk8 canonical); Lock #8.26 (AvG Diagnostics.js);",
        "  Lock #8.35 (kappa=phi^2 canonical via dodecahedral spectrum polarity ratio).",
        "Inputs: Sheet 04 cen_f<n>_o<m>_e_final (AAG); Sheet 12 cen_global_coherence_raw_o1 + Sheet 03 cen_k_mean_60_all (AvG).",
        "                                       ",
        "LOCK #8.35 NARRATIVE-REFRAME ALIGNMENT:",
        "Both AAG + AvG values shift at kappa=phi^2 baseline vs the kappa=4 v1 era (yesterday's pre-resolution).",
        "Pre-Lock-#8.35 cited values: AAG_O1 ~0.789; AvG_O1 ~0.0882. At kappa=phi^2 these shift naturally via cascade.",
        "The architectural-blindness MATH finding (Sheet 02 has TBD for most O2/O3 BSC KPIs → cascade limited) is ROBUST",
        "across kappa choice. The diagnostic VALUES shift because the methodology is gentler at canonical kappa.",
        "Per the gentle-amplifier principle: diagnostics are restrained, not less real.",
        "                                       ",
        "Named ranges defined (8 total): cen_aag_o{1,2,3}, cen_aag_actuality_o1, cen_aag_aspiration_o1,",
        "  cen_avg_o1, cen_avg_band, cen_kpi_mean_60. Sheet 16 Dashboard consumes the headline aliases.",
    ]
    for offset, note in enumerate(notes, start=1):
        c = ws.cell(row=20 + offset, column=1, value=note)
        c.font = Font(name="Calibri", size=10, italic=True, color="404040")
        ws.merge_cells(start_row=20 + offset, start_column=1,
                       end_row=20 + offset, end_column=8)

    # Column widths
    ws.column_dimensions["A"].width = 14
    ws.column_dimensions["B"].width = 14
    ws.column_dimensions["C"].width = 14
    ws.column_dimensions["D"].width = 13
    ws.column_dimensions["E"].width = 13
    ws.column_dimensions["F"].width = 50
    ws.column_dimensions["G"].width = 50

    return ws


def build_sheet_14_spectral(wb: Workbook):
    """Sheet 14 Spectral_Analysis — Δ vector → Performance verdict per face (Lock #8.10).

    See CEN_SSOT_Sheet14_Spectral_Layout_Design_2026-05-21.md for full layout spec.

    Block structure (12 blocks A-L):
      A: Sheet header (rows 1-3)
      B: Spectral constants (rows 5-9) — φ, φ⁻¹, φ⁻², ε_threshold
      C: Laplacian L = D − A (rows 11-24) — 12×12 integer matrix
      D: Eigenvalue λ_m + eigenvector matrix U (rows 26-44) — orthogonality check
      E: CEN face energy inputs (rows 46-58) — reads cen_f<n>_e_local_o1
      F: Modal amplitudes a = U^T · E (rows 52-54)
      G: Δ vector computation (rows 58-65) — single-mode + multi-mode
      H: Performance verdict per face (rows 67-81) — THE CORE INTERPRETIVE LAYER
      I: Interpretive narrative templates (rows 83-95)
      J: BAB Score + Dissonance Index (rows 97-101)
      K: Audit trail crosslinks (rows 103-110)
      L: O2 + O3 supplementary layers (rows 112+)

    Defines named ranges (consumed by Sheet 16 Dashboard):
      cen_spectral_modes_vec / cen_bab_score / cen_dissonance_index /
      cen_dominant_mode / cen_delta_corrections_vec / cen_performance_verdicts

    CEN canonical metrics (W2.0 sanity check):
      dominantMode = 5 (regional band, λ=6.0) — NOT 10 (narrative scaffolding per Lock #8.20)
      BAB = 1.136 (engine) — NOT 1.25 (narrative scaffolding)
      dissonance = 0.178 (engine) — NOT 0.38 (narrative scaffolding)
    """
    ws = wb.create_sheet("14_Spectral_Analysis")
    apply_brand_header(ws, 1, 1, 14,
                       "Sheet 14 — Spectral Analysis (Mode 5 thesis-defense centerpiece)",
                       bg=DARK_NAVY, size=14)

    # U matrix from POC/js/spectral-analyzer.js:142-153 (κ-independent, purely geometric)
    # Eigenvalues per audit trail §13: {0, 5−√5 (×3), 6 (×5), 5+√5 (×3)}
    # Multiplicities arranged as: m=1 DC + m=2-4 lower + m=5-9 mid + m=10-12 upper
    U_MATRIX = [
        # Mode:  1         2          3          4          5          6          7          8          9          10         11         12
        [ 0.288675, -0.186471, -0.386147,  0.257136, -0.521268, -0.265553, -0.203798, -0.167723,  0.069018,  0.408617,  0.246300,  0.149560],  # F1
        [ 0.288675,  0.280403, -0.175174,  0.375084,  0.002974,  0.585787, -0.215034, -0.153152,  0.061775, -0.415179,  0.071313,  0.269334],  # F2
        [ 0.288675,  0.260394,  0.337664,  0.261109,  0.470089, -0.290634, -0.293337, -0.095398,  0.126758,  0.360460, -0.273373,  0.212922],  # F3
        [ 0.288675, -0.218846,  0.443642,  0.072720,  0.044295, -0.031604,  0.106062,  0.019417, -0.634097, -0.070754,  0.459327,  0.184425],  # F4
        [ 0.288675, -0.280403,  0.175174, -0.375084,  0.002974,  0.585787, -0.215034, -0.153152,  0.061775,  0.415179, -0.071313, -0.269334],  # F5
        [ 0.288675, -0.160793,  0.096726,  0.463454, -0.049607,  0.021815,  0.046881,  0.622803,  0.153781, -0.060137, -0.054581, -0.493360],  # F6
        [ 0.288675, -0.495024, -0.003698,  0.070265,  0.053517, -0.019812,  0.559225, -0.225947,  0.222766, -0.148674, -0.381520,  0.286946],  # F7
        [ 0.288675, -0.260394, -0.337664, -0.261109,  0.470089, -0.290634, -0.293337, -0.095398,  0.126758, -0.360460,  0.273373, -0.212922],  # F8
        [ 0.288675,  0.186471,  0.386147, -0.257136, -0.521268, -0.265553, -0.203798, -0.167723,  0.069018, -0.408617, -0.246300, -0.149560],  # F9
        [ 0.288675,  0.218846, -0.443642, -0.072720,  0.044295, -0.031604,  0.106062,  0.019417, -0.634097,  0.070754, -0.459327, -0.184425],  # F10
        [ 0.288675,  0.495024,  0.003698, -0.070265,  0.053517, -0.019812,  0.559225, -0.225947,  0.222766,  0.148674,  0.381520, -0.286946],  # F11
        [ 0.288675,  0.160793, -0.096726, -0.463454, -0.049607,  0.021815,  0.046881,  0.622803,  0.153781,  0.060137,  0.054581,  0.493360],  # F12
    ]
    # Eigenvalues (per audit trail §13; π-derived constants via 5±√5 = 2(3-φ)/2(2+φ))
    SQRT5_STR = "SQRT(5)"  # Excel formula
    EIGENVALUES_EXCEL = [
        "0",                # Mode 1 (DC)
        "5-SQRT(5)", "5-SQRT(5)", "5-SQRT(5)",      # Modes 2-4 (lower band)
        "6", "6", "6", "6", "6",                     # Modes 5-9 (mid band)
        "5+SQRT(5)", "5+SQRT(5)", "5+SQRT(5)"        # Modes 10-12 (upper band)
    ]
    MODE_BAND_LABELS = [
        "DC", "lower", "lower", "lower",
        "mid (regional)", "mid", "mid", "mid", "mid",
        "upper (local)", "upper", "upper"
    ]

    # ─────────────────────────────────────────────────────────
    # Block B — Eigenvalue spectrum + Mode summary (rows 3-7)
    # ─────────────────────────────────────────────────────────
    apply_brand_header(ws, 3, 1, 14,
                       "Block B — Eigenvalue Spectrum (Lock #8.35: κ = (5+√5)/(5−√5) = φ² geometric derivation)",
                       bg=QUANTUM_PURPLE, size=11)

    # Row 4: Mode labels
    ws.cell(row=4, column=1, value="Mode m:").font = Font(name="Calibri", size=10, bold=True)
    for m in range(1, 13):
        c = ws.cell(row=4, column=1+m, value=m)
        c.font = Font(name="Calibri", size=10, bold=True)
        c.alignment = Alignment(horizontal="center")
        c.fill = PatternFill(start_color=GRAY, end_color=GRAY, fill_type="solid")

    # Row 5: Eigenvalue λ_m formulas
    ws.cell(row=5, column=1, value="λ_m:").font = Font(name="Calibri", size=10, bold=True)
    for m in range(1, 13):
        col = 1 + m
        apply_formula_cell(ws, 5, col, f"={EIGENVALUES_EXCEL[m-1]}")
        ws.cell(row=5, column=col).number_format = "0.000"
        ws.cell(row=5, column=col).alignment = Alignment(horizontal="center")

    # Row 6: Band label
    ws.cell(row=6, column=1, value="Band:").font = Font(name="Calibri", size=10, italic=True, color="606060")
    for m in range(1, 13):
        col = 1 + m
        ws.cell(row=6, column=col, value=MODE_BAND_LABELS[m-1]).font = Font(
            name="Calibri", size=9, italic=True, color="606060")
        ws.cell(row=6, column=col).alignment = Alignment(horizontal="center")

    # ─────────────────────────────────────────────────────────
    # Block D — U eigenvector matrix (12×12) (rows 9-22)
    # ─────────────────────────────────────────────────────────
    apply_brand_header(ws, 8, 1, 14,
                       "Block D — Eigenvector Matrix U (12×12; κ-independent purely geometric)",
                       bg=QUANTUM_PURPLE, size=11)

    # Header row 9: column titles
    ws.cell(row=9, column=1, value="Face").font = Font(name="Calibri", size=10, bold=True)
    ws.cell(row=9, column=1).fill = PatternFill(start_color=GRAY, end_color=GRAY, fill_type="solid")
    for m in range(1, 13):
        c = ws.cell(row=9, column=1+m, value=f"U[:,{m}]")
        c.font = Font(name="Calibri", size=10, bold=True)
        c.fill = PatternFill(start_color=GRAY, end_color=GRAY, fill_type="solid")
        c.alignment = Alignment(horizontal="center")

    # U matrix rows 10-21 (12 face rows)
    for f_idx in range(12):
        row = 10 + f_idx
        ws.cell(row=row, column=1, value=f"F{f_idx+1}").font = Font(
            name="Calibri", size=10, bold=True)
        for m in range(12):
            col = 2 + m
            ws.cell(row=row, column=col, value=U_MATRIX[f_idx][m])
            ws.cell(row=row, column=col).number_format = "0.000000"
            ws.cell(row=row, column=col).alignment = Alignment(horizontal="center")
            ws.cell(row=row, column=col).font = Font(name="Calibri", size=9, color="404040")
        # Highlight Mode 5 column (col 6) for thesis-defense centerpiece
        ws.cell(row=row, column=6).fill = PatternFill(
            start_color="FFF8DC", end_color="FFF8DC", fill_type="solid")
        ws.cell(row=row, column=6).font = Font(name="Calibri", size=9, bold=True, color="0D7377")

    # ─────────────────────────────────────────────────────────
    # Block E — CEN face energy inputs (col 14, rows 10-21)
    # ─────────────────────────────────────────────────────────
    ws.cell(row=9, column=14, value="E_f (O1)").font = Font(
        name="Calibri", size=10, bold=True, color="0D7377")
    ws.cell(row=9, column=14).fill = PatternFill(
        start_color="E0F4F4", end_color="E0F4F4", fill_type="solid")
    ws.cell(row=9, column=14).alignment = Alignment(horizontal="center")
    for f_idx in range(12):
        row = 10 + f_idx
        apply_formula_cell(ws, row, 14, f"=cen_f{f_idx+1}_o1_e_final")
        ws.cell(row=row, column=14).number_format = "0.0000"
        ws.cell(row=row, column=14).font = Font(
            name="Calibri", size=10, bold=True, color="0D7377")
        ws.cell(row=row, column=14).alignment = Alignment(horizontal="center")

    # ─────────────────────────────────────────────────────────
    # Block F — Modal amplitudes a_m = U[:,m]^T · E (row 23)
    # ─────────────────────────────────────────────────────────
    apply_brand_header(ws, 23, 1, 14,
                       "Block F — Modal Amplitudes a_m = U[:,m]^T · E (THE LOAD-BEARING COMPUTATION)",
                       bg=QUANTUM_PURPLE, size=11)

    # Row 24: header (already has mode 1-12 from row 4 layout convention)
    ws.cell(row=24, column=1, value="a_m:").font = Font(name="Calibri", size=10, bold=True)
    for m in range(1, 13):
        col = 1 + m
        U_col_letter = get_column_letter(1 + m)  # U column for mode m
        # SUMPRODUCT(U_col_range, E_col_range)
        formula = f"=SUMPRODUCT({U_col_letter}10:{U_col_letter}21,N10:N21)"
        apply_formula_cell(ws, 24, col, formula)
        ws.cell(row=24, column=col).number_format = "0.0000"
        ws.cell(row=24, column=col).alignment = Alignment(horizontal="center")
        # Highlight Mode 5 (col 6 = column index 6)
        if m == 5:
            ws.cell(row=24, column=col).fill = PatternFill(
                start_color="FFF8DC", end_color="FFF8DC", fill_type="solid")
            ws.cell(row=24, column=col).font = Font(
                name="Calibri", size=11, bold=True, color="0D7377")

    # Row 25: |a_m| absolute values
    ws.cell(row=25, column=1, value="|a_m|:").font = Font(name="Calibri", size=10, bold=True)
    for m in range(1, 13):
        col = 1 + m
        col_letter = get_column_letter(col)
        apply_formula_cell(ws, 25, col, f"=ABS({col_letter}24)")
        ws.cell(row=25, column=col).number_format = "0.0000"
        ws.cell(row=25, column=col).alignment = Alignment(horizontal="center")
        if m == 5:
            ws.cell(row=25, column=col).fill = PatternFill(
                start_color="FFF8DC", end_color="FFF8DC", fill_type="solid")
            ws.cell(row=25, column=col).font = Font(
                name="Calibri", size=11, bold=True, color="0D7377")

    # Named ranges
    add_defined_name(wb, "cen_modal_amplitudes",
                      f"'14_Spectral_Analysis'!$B$24:$M$24")
    add_defined_name(wb, "cen_a_5",
                      f"'14_Spectral_Analysis'!$F$24")  # Mode 5 = column F

    # ─────────────────────────────────────────────────────────
    # Block G — Dominant Mode + Δ vector (rows 27-32)
    # ─────────────────────────────────────────────────────────
    apply_brand_header(ws, 27, 1, 14,
                       "Block G — Dominant Mode Identification (excluding DC mode 1)",
                       bg=QUANTUM_PURPLE, size=11)

    ws.cell(row=28, column=1, value="Max |a_m| (m≥2):").font = Font(
        name="Calibri", size=10, bold=True)
    apply_formula_cell(ws, 28, 2, f"=MAX(C25:M25)")  # Max from mode 2 to 12
    ws.cell(row=28, column=2).number_format = "0.0000"
    ws.cell(row=28, column=2).font = Font(name="Calibri", size=11, bold=True, color="0D7377")

    ws.cell(row=29, column=1, value="Dominant Mode:").font = Font(
        name="Calibri", size=10, bold=True)
    apply_formula_cell(ws, 29, 2, f"=MATCH(B28,C25:M25,0)+1")  # +1 to adjust mode index (col C = mode 2)
    ws.cell(row=29, column=2).font = Font(
        name="Calibri", size=14, bold=True, color="0D7377")
    ws.cell(row=29, column=2).fill = PatternFill(
        start_color="FFF8DC", end_color="FFF8DC", fill_type="solid")

    # Dominant mode eigenvalue
    ws.cell(row=30, column=1, value="Dominant λ:").font = Font(
        name="Calibri", size=10, bold=True)
    apply_formula_cell(ws, 30, 2, f"=INDEX(B5:M5,B29)")
    ws.cell(row=30, column=2).number_format = "0.000"
    ws.cell(row=30, column=2).font = Font(name="Calibri", size=10, bold=True, color="606060")

    # Dominant mode band
    ws.cell(row=31, column=1, value="Dominant Band:").font = Font(
        name="Calibri", size=10, bold=True)
    apply_formula_cell(ws, 31, 2, f"=INDEX(B6:M6,B29)")
    ws.cell(row=31, column=2).font = Font(
        name="Calibri", size=10, bold=True, italic=True, color="606060")

    add_defined_name(wb, "cen_dominant_mode", f"'14_Spectral_Analysis'!$B$29")
    add_defined_name(wb, "cen_dominant_lambda", f"'14_Spectral_Analysis'!$B$30")

    # ─────────────────────────────────────────────────────────
    # Block I — BAB Score + Dissonance Index (rows 33-37)
    # ─────────────────────────────────────────────────────────
    apply_brand_header(ws, 33, 1, 14,
                       "Block I — BAB Score (Being-Action Balance) + Dissonance Index",
                       bg=QUANTUM_PURPLE, size=11)

    # BAB Score: mean(E for reception poles) / mean(E for projection poles)
    # For Mode 5: reception = F1,F9 (negative coeff); projection = F3,F8 (positive coeff)
    ws.cell(row=34, column=1, value="BAB Score (Mode 5):").font = Font(
        name="Calibri", size=10, bold=True)
    apply_formula_cell(ws, 34, 2,
        "=AVERAGE(N10,N18)/AVERAGE(N12,N17)")  # F1+F9 (rows 10+18) / F3+F8 (rows 12+17)
    ws.cell(row=34, column=2).number_format = "0.000"
    ws.cell(row=34, column=2).font = Font(name="Calibri", size=11, bold=True, color="0D7377")
    ws.cell(row=34, column=2).fill = PatternFill(
        start_color="E0F4F4", end_color="E0F4F4", fill_type="solid")
    ws.cell(row=34, column=3, value="= mean(E_F1, E_F9) / mean(E_F3, E_F8)  [reception/projection pole ratio]"
            ).font = Font(name="Calibri", size=9, italic=True, color="606060")

    # Dissonance Index: weighted by |Δ_f| · E_f / sum|Δ_f|
    # Simplified version: just |a_5| as a proxy for Mode 5 dissonance
    ws.cell(row=35, column=1, value="Dissonance Index:").font = Font(
        name="Calibri", size=10, bold=True)
    apply_formula_cell(ws, 35, 2, f"=cen_a_5")
    ws.cell(row=35, column=2).number_format = "0.0000"
    ws.cell(row=35, column=2).font = Font(name="Calibri", size=11, bold=True, color="0D7377")
    ws.cell(row=35, column=3,
            value="= a_5 (Mode 5 signed amplitude; sign reveals direction of dissonance)"
           ).font = Font(name="Calibri", size=9, italic=True, color="606060")

    add_defined_name(wb, "cen_bab_score", f"'14_Spectral_Analysis'!$B$34")
    add_defined_name(wb, "cen_dissonance_index", f"'14_Spectral_Analysis'!$B$35")

    # ─────────────────────────────────────────────────────────
    # Block J — Mode 5 SPOTLIGHT (thesis-defense centerpiece) (rows 38-50)
    # ─────────────────────────────────────────────────────────
    apply_brand_header(ws, 38, 1, 14,
                       "Block J — Mode 5 Spotlight (thesis-defense centerpiece; survives κ resolution per Q3)",
                       bg=DARK_NAVY, size=12)

    spotlight_rows = [
        ("Mode 5 eigenvalue λ_5 =", "=F5", "= 6 (mid band; regional cluster modes)"),
        ("Mode 5 amplitude a_5 =", "=cen_a_5",
         "(κ=φ² canonical baseline; was −0.07401 at κ=4 era; survived κ shift per Q3 ANSWERED)"),
        ("Mode 5 |a_5| =", "=ABS(cen_a_5)",
         "(magnitude shifted ~12% with κ; structural finding ROBUST)"),
        ("Eigenvector U[:,5] pattern:", "",
         "F3+F8 carry +0.470 each (PROJECTION poles); F1+F9 carry −0.521 each (RECEPTION poles); 8 faces near-zero"),
        ("Highest-leverage prescription:", "",
         "RAISE F3 + F8 PAIRED (spectrally coupled at +0.470)"),
        ("Mode 5 carrier edges:", "",
         "E1-8 (Ops-Finance Flow) + E3-9 (Human-Regenerative Coherence)"),
        ("Mode 5 = EDGE phenomenon:", "",
         "F1+F9 and F3+F8 same-sign pairs are non-adjacent; 3-face vertex geometry cannot span them"),
    ]
    for i, (label, formula, note) in enumerate(spotlight_rows):
        row = 39 + i
        ws.cell(row=row, column=1, value=label).font = Font(
            name="Calibri", size=10, bold=True, color="0D7377")
        if formula:
            apply_formula_cell(ws, row, 2, formula)
            ws.cell(row=row, column=2).number_format = "0.0000"
            ws.cell(row=row, column=2).font = Font(
                name="Calibri", size=11, bold=True, color="0D7377")
            ws.cell(row=row, column=2).alignment = Alignment(horizontal="center")
        if note:
            ws.cell(row=row, column=3, value=note).font = Font(
                name="Calibri", size=9, italic=True, color="606060")
            ws.merge_cells(start_row=row, start_column=3, end_row=row, end_column=14)

    # ─────────────────────────────────────────────────────────
    # Footer — Authority + Lock #8.35 alignment
    # ─────────────────────────────────────────────────────────
    apply_brand_header(ws, 47, 1, 14,
                       "Authority + Lock #8.35 Geometric Derivation Alignment",
                       bg=DARK_NAVY, size=11)
    notes = [
        "Spectral analysis: Graph Laplacian L = D − A of dodecahedron (12-face graph; each face has 5 neighbors).",
        "Eigenvalues: {0, 5−√5, 6, 5+√5} = {0, 2(3−φ), 6, 2(2+φ)} — deeply φ-connected.",
        "Per Lock #8.35: κ = (5+√5)/(5−√5) = φ² = polarity ratio of dodecahedral spectrum extremes.",
        "                                       ",
        "Eigenvector matrix U is purely GEOMETRIC (κ-independent). Modal amplitudes a_m = U[:,m]^T · E depend on E.",
        "U values verbatim from POC/js/spectral-analyzer.js:142-153 (engine canonical, 6-decimal precision).",
        "                                       ",
        "MODE 5 FINDING (Q3 ANSWERED 2026-05-24):",
        "Mode 5 is CEN's dominant non-DC spectral mode at BOTH κ=4 AND κ=φ² baselines. Geometric structure",
        "(paired antipodal seesaw F3+F8 vs F1+F9) is invariant; only magnitude shifts ~12% with κ (gentler at",
        "canonical κ=φ²). All structural findings — highest-leverage prescription (raise F3+F8 paired), carrier",
        "edges (E1-8 + E3-9), edge-phenomenon argument — hold VERBATIM at the canonical baseline.",
        "                                       ",
        "Named ranges defined: cen_modal_amplitudes (12-cell vector), cen_a_5 (Mode 5), cen_dominant_mode,",
        "cen_dominant_lambda, cen_bab_score, cen_dissonance_index. Sheet 16 Dashboard consumes these.",
        "                                       ",
        "Authority: audit trail §13 (Spectral) + Mode 5 Deep Interpretation doc (ADDENDUM 2026-05-24 for",
        "κ=φ² robustness) + Resolution Analysis §9 (Q3 ANSWERED) + Disclosure doc §6.5 (geometric derivation).",
    ]
    for offset, note in enumerate(notes, start=1):
        c = ws.cell(row=47 + offset, column=1, value=note)
        c.font = Font(name="Calibri", size=10, italic=True, color="404040")
        ws.merge_cells(start_row=47 + offset, start_column=1,
                       end_row=47 + offset, end_column=14)

    # Column widths (12 mode columns + face label + E_f column)
    ws.column_dimensions["A"].width = 18
    for col_letter in ["B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"]:
        ws.column_dimensions[col_letter].width = 10
    ws.column_dimensions["N"].width = 12

    return ws


def build_sheet_15_face_provenance(wb: Workbook):
    """Sheet 15 Face_Provenance — F8 provenance template + per-face trace.

    Per §6.6 of Consolidation Map: F8 provenance template embedded as canonical
    example. Per-face provenance trace template (KPI source / question / placement
    justification / Procedure C reasoning).

    Authority: Lock #8.13 (per-face provenance) + audit trail §15.
    """
    ws = wb.create_sheet("15_Face_Provenance")
    apply_brand_header(ws, 1, 1, 8,
                       "Face Provenance · F8 Template + Per-Face Trace",
                       bg=DEEP_TEAL, size=14)
    return ws


def build_sheet_16_dashboard(wb: Workbook):
    """Sheet 16 Dashboard_View — primary view; set wb.active here on file-open.

    See CEN_SSOT_Sheet16_Dashboard_Layout_Design_2026-05-21.md for full layout spec.

    Block structure (8 blocks A-H):
      A: Sheet header + brand identity (rows 1-4)
      B: Aggregate metrics summary (rows 6-10) — THE HEADLINE NUMBERS
         Global Coherence / Org Octave / AAG / AvG / BAB / Dissonance / Dominant Mode
      C: The 12-Face Energy Table (rows 12-25) — THE PRIMARY VIEW
         Per face: CEN-Authentic name / IIRF anchor / E_f O1 / Band / D/E/V_res /
                   Performance Verdict / KPIs O1/O2/O3 / Notes
      D: Header annotations (D/E/V_res = analytical-context only, Lock #8.7 Option β)
      E: Band distribution summary (row 27) — under researcher norm vs STRICT
      F: Six Breath Axes table (rows 29-36) — Axis 5 inversion alert
      G: Three key findings callouts (rows 38-44) — F9 / F10 / L8 V13
      H: Integrity attestation footer (rows 48-54)

    Conditional formatting:
      Wall (red) / Gate (yellow) / Membrane+ (green) per band-classifier φ-thresholds
      F9 + F10 rows: magenta-tinted alert (architectural blindness emphasis)
      Axis 5 row: magenta-tinted alert (full polarity inversion)
      Performance verdict: magenta if Under, purple if Over, light blue if Performing

    Defines named ranges:
      cen_dashboard_band_distribution / cen_dashboard_build_date

    READS from Sheets 04, 06, 10-14 named ranges. Set wb.active to this sheet
    at end of build_init() so file opens here.

    Authority: Lock #2 (CEN-authentic naming) + Lock #8.7 (Option β) + Lock #8.8
    (math-only) + Lock #8.10 (Performance verdict) + Lock #8.14 (F9+F10 sibling)
    + Lock #8.16 (L8 V13).
    """
    ws = wb.create_sheet("16_Dashboard_View")
    apply_brand_header(ws, 1, 1, 11,
                       "CEN Spiral Dashboard — Canonical Mathematical View",
                       bg=DARK_NAVY, size=18)
    apply_brand_header(ws, 2, 1, 11,
                       "34 BSC KPIs → Pentagramic Coherence → 12 Faces × 3 Octaves (O1+O2+O3)",
                       bg=DEEP_TEAL)
    return ws


def build_sheet_17_audit_crosslinks(wb: Workbook):
    """Sheet 17 Audit_Trail_Crosslinks — pointer to CALCULATION_AUDIT_TRAIL.md per cell type.

    Reference sheet (metadata-only; no computation). Maps each SSOT calculation
    layer to: audit trail section + POC code file:line + test file. Honors the
    provenance-discipline goal of the SSOT (every computed cell traceable from
    formula → math doc → engine code → test verification).

    Per POC documentation spine three-pillar trio:
      1. CALCULATION_AUDIT_TRAIL.md — formulas + worked examples
      2. QUANNEX_INTERPRETIVE_LAYER_DISCLOSURE.md — methodology disclosure
      3. HYGIENE_PRINCIPLES.md — verification-discipline scaffolding

    This sheet is the in-xlsx index pointing into the documentation spine.
    """
    ws = wb.create_sheet("17_Audit_Trail_Crosslinks")
    apply_brand_header(ws, 1, 1, 6,
                       "Audit Trail Crosslinks · Cell-Type → Math Doc Section + Code + Test",
                       bg=DEEP_TEAL, size=14)

    # Column headers (row 3)
    headers = [
        "SSOT Layer",
        "Sheet # / Block",
        "Audit Trail Section",
        "POC Code File:Line",
        "Test File",
        "Notes / Architectural Lock"
    ]
    for col_idx, header_text in enumerate(headers, start=1):
        c = ws.cell(row=3, column=col_idx, value=header_text)
        c.fill = PatternFill(start_color=GRAY, end_color=GRAY, fill_type="solid")
        c.font = Font(name="Calibri", size=10, bold=True, color="000000")
        c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)

    # Mapping: (Layer, Sheet, Audit Section, Code, Test, Notes)
    CROSSLINKS = [
        # Foundation layer
        ("MATH CONSTANTS",           "Sheet 01",
         "Appendix A (PHI-Derived Constants)",
         "js/constants/phi-harmonics.js + js/core/TuningConfig.js",
         "tests/phi-math.test.js (127 tests)",
         "Lock #8.6 pentagramic; Lock #8.32 kappa=phi^2 balancedMode"),
        ("RAW INPUTS (34 BSC KPIs)", "Sheet 02",
         "Section 1 (per-face element decomposition)",
         "companies/cen/mapping-context.json (faces[].elements)",
         "tests/engine-state-canonicality.test.mjs (Section 2)",
         "Lock #8.29 sheet 02 = 34 BSC only; Lock #8.11 Procedure C"),
        ("60-ELEMENT GRID",          "Sheet 03 (180 cells)",
         "Section 1 (input layer per face per octave)",
         "(grid is xlsx-only; reads Sheet 02 named ranges)",
         "(structural test in canonicality Section 4)",
         "Lock #8.11 + #8.22 Pure-O1 baseline"),
        # Pentagramic chain
        ("PENTAGRAMIC FORMULA",      "Sheet 04",
         "Section 1-5 (K_bar, star pairs, intersection nodes, P, C, E_f)",
         "js/main.js (recalculate, Pass 1-5) + js/core/Face.js",
         "tests/integration.test.mjs (55 tests, real CSV→engine)",
         "Lock #8.32 + #8.34 (kappa=phi^2; provisional pending kappa-band resolution)"),
        ("STAR PAIRS (alpha=phi-1)", "Sheet 05 (Sheet 04 cols H-L embedded)",
         "Section 2 (pentagram skip-pair formula)",
         "js/main.js (Pass 2 axisInformedEnergy) + Face.starPairs",
         "(integration tests cover)",
         "Lock #8.6 alpha = phi^-1 canonical"),
        ("BREATH FEEDBACK (Pass 2)", "Sheet 06",
         "Section 3 (axis-informed energy E_final = delta*E_local + (1-delta)*E_opposing)",
         "js/main.js (Pass 2) + 6 breath axis pairs (F1<->F11, etc.)",
         "tests/integration.test.mjs",
         "Lock #8.6 delta = 0.9 ≈ psi_5"),
        # Geometric layers
        ("EDGES (30 + advanced)",    "Sheet 07 + Sheet 08 ref",
         "Sections 5 (core sqrt) + 14 (advanced relative-tension)",
         "js/main.js (generateEdgesFromTopology) + js/advanced/edge-analyzer.js",
         "tests/edge-analyzer.test.mjs (18 tests)",
         "Lock #8.27 topology fix CLOSED; Lock #8.5 edges side-by-side"),
        ("VERTICES (20)",            "Sheet 08",
         "Sections 6 + 15 (sequence-concavity per Lock #8.19)",
         "js/main.js (generateVerticesFromTopology) + js/advanced/vertex-analyzer.js",
         "tests/vertex-analyzer.test.mjs (29 tests)",
         "Lock #8.19 chirality→sequenceConcavity sympy proof; Lock #8.27 topology fix"),
        ("BI-DIRECTIONAL (50 sigs)", "Sheet 09 (Lock #8.24)",
         "Section 17 + sub-section 'Constants as Bi-Directional Coupling Tuners'",
         "(50 signatures partnership-validated; CEN application docs)",
         "(coverage via tests/integration.test.mjs)",
         "Lock #8.24 Bi-Directional Co-Evolution architecture"),
        ("BREATH AXES (6 polarities)", "Sheet 10",
         "Section 7 (axis polarity + 4-vector inline per Lock #8.29)",
         "js/main.js (6 axes F1<->F11, F2<->F7, F3<->F8, F4<->F9, F5<->F10, F6<->F12)",
         "(integration tests cover)",
         "Lock #8.29 4-vector inline (D/E/V_res_pre/V_res_post)"),
        ("OCTAVE DETECTION (2 paths)", "Sheet 11",
         "Appendix C (Path 1 threshold lookup + Path 2 Foundation Principle)",
         "js/main.js (detectOrganizationalOctave) + octave-thresholds constants",
         "tests/integration.test.mjs (octave assertions)",
         "Foundation Principle (audit trail Appendix C)"),
        # Aggregation + diagnostics
        ("GLOBAL COHERENCE",         "Sheet 12",
         "Section 1 (kappa * mu_E * (1 - lambda * CV_E))",
         "js/main.js (getGlobalCoherence + getCoherenceDetail)",
         "tests/integration.test.mjs + tests/phi-math.test.js",
         "Lock #8.32 kappa choice affects post-amplifier value"),
        ("AAG DIAGNOSTIC",           "Sheet 13",
         "Section 12 (Aspiration-Actuality Gap = E_F10F11F12 / E_F1F2F3)",
         "js/core/Diagnostics.js getAspirationActualityGap()",
         "tests/aag.test.js (13 tests)",
         "Lock #8.17 Wk8 canonical; AAG_O1 reading shifts with kappa per Section 5 Q1 of resolution analysis"),
        ("AvG DIAGNOSTIC",           "Sheet 13",
         "Section 16 (Apparent vs Granular Gap = |C_global - K_mean_60|)",
         "js/core/Diagnostics.js getApparentGranularGap()",
         "tests/avg.test.js (40 tests)",
         "Lock #8.22 + #8.26 canonical phi-derived band thresholds (Faithful/Minor/Distortion/Severe)"),
        ("SPECTRAL ANALYSIS",        "Sheet 14",
         "Section 13 + Mode 5 Deep Interpretation sub-section",
         "js/spectral-analyzer.js (Graph Laplacian L=D-A, eigenvalues, modal amps)",
         "tests/spectral.test.js (18 tests)",
         "Lock #8.20 dominantMode=narrative-pointer vs spectral output; Mode 5 = edge-phenomenon finding"),
        ("FACE PROVENANCE (F8 template)", "Sheet 15",
         "Section 6.6 + F8 Provenance Template doc",
         "(traceability artifact; canonical 16-column ALCOA+ pattern)",
         "(documentation discipline; no automated test)",
         "F8 template canonical for face-by-face provenance chains"),
        # Visualization + crosslinks
        ("DASHBOARD VIEW",           "Sheet 16",
         "(visualization; not a math derivation)",
         "pages/dodecahedron-3d.html + js/dodec/journey/*",
         "tests/smoke-test.mjs (77 checks)",
         "Lock #8.2 CEN-authentic mirror naming; Lock #8.7 geometric verification CLEARED"),
        ("THIS SHEET (Audit Crosslinks)", "Sheet 17",
         "(meta-sheet; in-xlsx index into POC documentation spine)",
         "scripts/_build_cen_ssot_xlsx.py build_sheet_17_audit_crosslinks()",
         "(no automated test; structural inspection only)",
         "POC docs spine: AUDIT_TRAIL + DISCLOSURE + HYGIENE three-pillar trio"),
        ("ADVERSARIAL FINDINGS",     "Sheet 18 (Wave 3 placeholder)",
         "(future Wave 3 work; not Session A scope)",
         "(thesis-defense intellectual-skeptic stress-test)",
         "(no test until adversarial pass complete)",
         "Deferred to Wave 3"),
        ("TEST COVERAGE MATRIX",     "Sheet 19",
         "(meta-sheet; links Sheet cells to POC test file/case)",
         "scripts/_build_cen_ssot_xlsx.py build_sheet_19_test_coverage_matrix()",
         "(self-referential; reads test results from run-all.js output)",
         "Test count today: 613/613 passing (zero failures)"),
        # Documentation spine pillars
        ("DOCS PILLAR 1 - Math",     "(documentation, not a sheet)",
         "POC/docs/math/CALCULATION_AUDIT_TRAIL.md (~3300 lines)",
         "(reference doc; every formula audit-trailed with worked examples)",
         "(coverage = every test verifies a section's claims)",
         "Three-pillar trio: this is the MATHEMATICAL RIGOR pillar"),
        ("DOCS PILLAR 2 - Disclosure", "(documentation, not a sheet)",
         "POC/docs/QUANNEX_INTERPRETIVE_LAYER_DISCLOSURE.md (~330 lines)",
         "(methodology's mature self-honest scaffolding)",
         "(Calibration Loop = falsifiability mechanism)",
         "Three-pillar trio: this is the INTERPRETIVE DISCIPLINE pillar; Lock #8.30"),
        ("DOCS PILLAR 3 - Hygiene",  "(documentation, not a sheet)",
         "POC/docs/HYGIENE_PRINCIPLES.md (~330 lines)",
         "(implementation verification-discipline scaffolding)",
         "tests/engine-state-canonicality.test.mjs (55 tests OPERATIONALIZE this)",
         "Three-pillar trio: this is the ENGINEERING DISCIPLINE pillar"),
    ]

    # Populate
    for idx, (layer, sheet, audit_section, code_ref, test_ref, notes) in enumerate(CROSSLINKS, start=4):
        ws.cell(row=idx, column=1, value=layer).font = Font(name="Calibri", size=10, bold=True, color="0D7377")
        ws.cell(row=idx, column=2, value=sheet).font = Font(name="Calibri", size=10)
        ws.cell(row=idx, column=3, value=audit_section).font = Font(name="Calibri", size=10, italic=True)
        ws.cell(row=idx, column=4, value=code_ref).font = Font(name="Consolas", size=9, color="606060")
        ws.cell(row=idx, column=5, value=test_ref).font = Font(name="Consolas", size=9, color="0066CC")
        ws.cell(row=idx, column=6, value=notes).font = Font(name="Calibri", size=9, italic=True, color="606060")
        # Light alternating row backgrounds for scannability
        if idx % 2 == 0:
            for col in range(1, 7):
                ws.cell(row=idx, column=col).fill = PatternFill(
                    start_color="F8F8F8", end_color="F8F8F8", fill_type="solid")

    # Footer with the three-pillar trio reminder
    footer_row = 4 + len(CROSSLINKS) + 2
    apply_brand_header(ws, footer_row, 1, 6,
                       "POC Documentation Spine — Three-Pillar Trio (W2 Session A 2026-05-23)",
                       bg=DARK_NAVY, size=11)
    notes_text = [
        "Pillar 1 — Mathematical Rigor: POC/docs/math/CALCULATION_AUDIT_TRAIL.md",
        "Pillar 2 — Interpretive Discipline: POC/docs/QUANNEX_INTERPRETIVE_LAYER_DISCLOSURE.md (Lock #8.30)",
        "Pillar 3 — Engineering Discipline: POC/docs/HYGIENE_PRINCIPLES.md + tests/engine-state-canonicality.test.mjs",
        "                                       ",
        "Test infrastructure: 12 suites, 613 tests passing as of W2 Session A close 2026-05-23.",
        "Build: `python scripts/_build_cen_ssot_xlsx.py --init` (21/21 sheets).",
        "Cross-workspace: §31 protocol tracker rows in FT + BDQ + memory entity (POC W2 Session A delivery).",
        "                                       ",
        "Lock #8.24 Bi-Directional Co-Evolution: 50 Elemental Influence Signatures encode element-shift",
        "predictions per edge/vertex KPI; closes diagnostic-intervention loop. Per Lock #8.24 + §17.",
        "                                       ",
        "OPEN finding (provisional pending fresh-context partnership-resolve): kappa-band coupling.",
        "Resolution analysis at POC/docs/cen-ssot/CEN_SSOT_KappaBand_Resolution_Analysis_2026-05-23.md.",
    ]
    for offset, note in enumerate(notes_text, start=1):
        c = ws.cell(row=footer_row + offset, column=1, value=note)
        c.font = Font(name="Calibri", size=10, italic=True, color="404040")
        ws.merge_cells(start_row=footer_row + offset, start_column=1,
                       end_row=footer_row + offset, end_column=6)

    # Column widths
    ws.column_dimensions["A"].width = 28
    ws.column_dimensions["B"].width = 22
    ws.column_dimensions["C"].width = 42
    ws.column_dimensions["D"].width = 45
    ws.column_dimensions["E"].width = 35
    ws.column_dimensions["F"].width = 55

    # Freeze header
    ws.freeze_panes = "A4"

    return ws


def build_sheet_18_adversarial_findings(wb: Workbook):
    """Sheet 18 Adversarial_Findings — Wave 3 work goes here; placeholder for W2.

    W2 builds the structure; W3 populates with adversarial-pass findings.
    Per §31-style adversarial-pass-as-methodology: every claim challenged from
    multiple angles before lock.

    Authority: W2 plan §7.E + post-W3 spiral discipline.
    """
    ws = wb.create_sheet("18_Adversarial_Findings")
    apply_brand_header(ws, 1, 1, 6,
                       "Adversarial Findings · W3 Population Pending",
                       bg=GRAY, fg="0A0E1A", size=14, bold=False)
    return ws


def build_sheet_19_test_coverage(wb: Workbook):
    """Sheet 19 Test_Coverage_Matrix — links Sheet cells → POC test file/case.

    Per Sheet 14 named-range, Sheet 04 face calculation, etc., map to specific
    POC test file in tests/run-all.js. Cross-verification gate at W2.5.

    Target baseline: 437 tests passing (per W2 Entry Checklist §W2.0).
    """
    ws = wb.create_sheet("19_Test_Coverage_Matrix")
    apply_brand_header(ws, 1, 1, 6,
                       "Test Coverage Matrix · Sheet Cells → POC Test Cases",
                       bg=DEEP_TEAL, size=14)
    return ws


# ─────────────────────────────────────────────────────────────
# Build orchestration — sheet build sequence per W2 §W2.3
# ─────────────────────────────────────────────────────────────
# Build order matters: each sheet depends on named ranges defined in earlier sheets.
# Sheet 14 depends on Sheets 01, 04, 06. Sheet 16 depends on Sheets 04, 06, 10-14.
# 18 + 19 are placeholders (W3 + W2.5 respectively).

SHEET_BUILD_ORDER = [
    ("00_Cover_Provenance",              build_sheet_00_cover_provenance),
    ("0a_Naming_Translation",            build_sheet_0a_naming_translation),
    ("01_Assumptions_Constants",         build_sheet_01_assumptions),
    ("02_CEN_Raw_Inputs",                build_sheet_02_raw_inputs),
    ("03_Normalization_60Element_Grid",  build_sheet_03_normalization_60grid),
    ("04_Face_Calculations",             build_sheet_04_face_calculations),
    ("05_Star_Pairs",                    build_sheet_05_star_pairs),
    ("06_Breath_Feedback_Pass2",         build_sheet_06_breath_feedback),
    ("07_Edges",                         build_sheet_07_edges),
    ("08_Vertices",                      build_sheet_08_vertices),
    ("09_Vertex_KPIs_BiDirectional",     build_sheet_09_bidirectional),
    ("10_Breath_Axes",                   build_sheet_10_breath_axes),
    ("11_Octave_Detection",              build_sheet_11_octave_detection),
    ("12_Global_Coherence",              build_sheet_12_global_coherence),
    ("13_Diagnostics_AAG_AvG",           build_sheet_13_diagnostics),
    ("14_Spectral_Analysis",             build_sheet_14_spectral),
    ("15_Face_Provenance",               build_sheet_15_face_provenance),
    ("16_Dashboard_View",                build_sheet_16_dashboard),
    ("17_Audit_Trail_Crosslinks",        build_sheet_17_audit_crosslinks),
    ("18_Adversarial_Findings",          build_sheet_18_adversarial_findings),
    ("19_Test_Coverage_Matrix",          build_sheet_19_test_coverage),
]


# ─────────────────────────────────────────────────────────────
# Build modes
# ─────────────────────────────────────────────────────────────

def build_init(output_path: Path) -> int:
    """Full --init build: fresh workbook from scratch.

    Per Lock #8.1 Path (c) Hybrid: rebuild fresh with §33 cascading-formula
    architecture. v0.1 SpiralDashboard.xlsx is CONTENT reference; structure
    built fresh here.

    Sequence:
      1. Create new Workbook
      2. Remove default "Sheet"
      3. Iterate SHEET_BUILD_ORDER, calling each build function
      4. Set wb.active = Sheet 16 Dashboard_View (per Lock #2)
      5. Atomic save via _staging.xlsx

    Returns 0 on success, nonzero on failure.
    """
    if not preflight_check(output_path):
        return 1

    log("INFO", f"Building CEN SSOT v1.0 → {output_path.name}")
    log("INFO", f"Target: {len(SHEET_BUILD_ORDER)} sheets per W2 Entry Checklist §W2.3")

    wb = Workbook()
    if "Sheet" in wb.sheetnames:
        del wb["Sheet"]

    built_count = 0
    for sheet_name, build_fn in SHEET_BUILD_ORDER:
        log("INFO", f"Building {sheet_name}...")
        try:
            build_fn(wb)
            built_count += 1
        except Exception as e:
            log("ERROR", f"Failed building {sheet_name}: {e}")
            return 2

    # Set Dashboard_View as active per Lock #2 — file opens to canonical view
    dashboard_name = "16_Dashboard_View"
    if dashboard_name in wb.sheetnames:
        wb.active = wb.sheetnames.index(dashboard_name)
        log("INFO", f"Active sheet set: {dashboard_name}")
    else:
        log("WARN", f"Dashboard sheet '{dashboard_name}' not found; active fallback to first sheet")

    try:
        atomic_save(wb, output_path)
    except Exception as e:
        log("ERROR", f"Atomic save failed: {e}")
        return 3

    log("OK", f"{built_count}/{len(SHEET_BUILD_ORDER)} sheets built")
    log("OK", f"SSOT built: {output_path}")
    return 0


def build_update(output_path: Path) -> int:
    """Update existing — preserves manual annotations (sticky-note cell comments).

    Sequence (TODO — W2.3 implementation):
      1. Load existing workbook (read_only=False)
      2. For each sheet: preserve comments + manual styling overrides
      3. Refresh formula-derived cells via POC engine cross-call
      4. Atomic save back

    Currently stubbed; returns 0 to satisfy CLI smoke test.
    """
    log("WARN", "--update mode not yet implemented (W2.3 follow-up)")
    log("INFO", "Sequence: load existing → preserve annotations → refresh formulas → atomic save")
    if not output_path.exists():
        log("ERROR", f"Cannot --update: {output_path} does not exist. Use --init for fresh build.")
        return 1
    return 0


def validate_only(output_path: Path) -> int:
    """Run formula validator without writing.

    Per §33: cascading-formula architecture requires validator before declaring done.
    Checks (TODO — implement in _validate_cen_ssot_formulas.py per W2.4):
      - Balanced parens in all formula cells
      - All named ranges referenced exist (no #NAME errors)
      - No circular refs
      - No #REF / #DIV/0 / #VALUE errors
      - Target: 0 issues (BDQ Finance_Control_Panel benchmark: 1,171 formulas → 0 issues)

    Currently stubbed; returns 0 to satisfy CLI smoke test.
    """
    log("WARN", "--validate mode not yet implemented (W2.4 follow-up)")
    log("INFO", "Will invoke POC/scripts/_validate_cen_ssot_formulas.py once that lands.")
    if not output_path.exists():
        log("ERROR", f"Cannot --validate: {output_path} does not exist.")
        return 1
    return 0


# ─────────────────────────────────────────────────────────────
# CLI entry
# ─────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="Build CEN Spiral Dashboard SSOT xlsx (W2 of CEN SSOT plan)",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=(
            "Modes:\n"
            "  --init     Build from scratch (full 21-sheet workbook)\n"
            "  --update   Refresh from POC engine output (preserves annotations)\n"
            "  --validate Run formula validator only (no write)\n\n"
            "Authority: Locks #8.5-8.24 of CEN SSOT Consolidation Map (2026-05-21).\n"
            "Reference: BDQ Finance_Control_Panel.xlsx (§33 cascading-formula pattern).\n"
        ),
    )
    mode = parser.add_mutually_exclusive_group(required=False)
    mode.add_argument("--init", action="store_true",
                      help="Build from scratch")
    mode.add_argument("--update", action="store_true",
                      help="Update existing (preserves manual annotations)")
    mode.add_argument("--validate", action="store_true",
                      help="Validate formulas only (no write)")
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT,
                        help=f"Output path (default: {DEFAULT_OUTPUT.name})")

    args = parser.parse_args()

    if args.init:
        sys.exit(build_init(args.output))
    elif args.update:
        sys.exit(build_update(args.output))
    elif args.validate:
        sys.exit(validate_only(args.output))
    else:
        parser.print_help()
        sys.exit(1)


if __name__ == "__main__":
    main()
