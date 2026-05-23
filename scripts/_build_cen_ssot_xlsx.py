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
        (8, 4, "F4", "Donation income / quarter", "Financial", "O2", "Edge",
         "E7-11·O2", "TBD researcher", None, "edge KPI — partnership-validate",
         "Lock #8.9 edge promotion / W06v3 line 173", "bsc_f4_value"),
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
        (41, 34, "L8", "SDG alignment in PVM", "L&G", "O2", "Vertex",
         "V13·O2 (F4∩F9∩F10)", "TBD vertex-validate", None,
         "vertex KPI — partnership-validate (first vertex-KPI in CEN dataset)",
         "Lock #8.10 + #8.11 NEW vertex promotion / W06v3 line 142", "bsc_l8_value"),
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
        # O3 layer — 4 face KPIs
        ("bsc_c7_value", 5, "Earth", 3),
        ("bsc_c9_value", 6, "Air", 3),
        ("bsc_l5_value", 2, "Air", 3),
        ("bsc_l6_value", 6, "Water", 3),
    ]
    assert len(KPI_PLACEMENTS) == 29, f"Expected 29 face-KPI placements, got {len(KPI_PLACEMENTS)}"

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
    """Sheet 07 Edges — 30 canonical edges + 3 parallel-column formulas per Lock #8.5.

    Per edge (30 rows):
      - Edge Energy: E_e = mean of face energies at both vertices
      - Edge Tension: T_e = |E_face1 − E_face2|
      - Advanced relative: R_e = (E_face1 / E_face2) symmetric ratio

    Three formulas surfaced in parallel columns (Lock #8.5 — all three are valid
    analytical views; no single "right" formula).

    Authority: audit trail §5 (Edge dynamics) + 30-edge canonical list (s58).
    """
    ws = wb.create_sheet("07_Edges")
    apply_brand_header(ws, 1, 1, 10,
                       "Edges · 30 Canonical Edge Interfaces", bg=DEEP_TEAL, size=14)
    return ws


def build_sheet_08_vertices(wb: Workbook):
    """Sheet 08 Vertices — 20 vertices with vortex strength + direction + sequence concavity.

    Per Lock #8.19: chirality → sequenceConcavity rename across all 5 company JSONs
    + vertex-analyzer.js + tests. This sheet uses the new name throughout.

    Per vertex (20 rows):
      - Vortex Strength: 1 − CV(face_energies_at_vertex)
      - Direction: pentagonal winding signed value
      - SequenceConcavity: (f1−f2)(2f2−f1−f3)/2 (NOT rotational winding; see Lock #8.19)
      - Leverage detection: high-strength + extreme-direction flag

    Authority: audit trail §6 (Vertex dynamics) + js/advanced/vertex-analyzer.js.
    """
    ws = wb.create_sheet("08_Vertices")
    apply_brand_header(ws, 1, 1, 10,
                       "Vertices · 20 Vortex Vertices · SequenceConcavity (Lock #8.19)",
                       bg=DEEP_TEAL, size=14)
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
    """Sheet 12 Global_Coherence — κ · μ · (1 − λ · CV) of 12 face energies.

    The headline aggregate metric. Defines named range `cen_global_coherence_o1`
    (read by Sheet 16 Block B headline numbers).

    Per Lock #8.8: math-only SSOT — no narrative interpretation here (interpretation
    in companion Coherence Portrait).
    """
    ws = wb.create_sheet("12_Global_Coherence")
    apply_brand_header(ws, 1, 1, 6,
                       "Global Coherence · C = κ · μ · (1 − λ · CV)",
                       bg=DEEP_TEAL, size=14)
    return ws


def build_sheet_13_diagnostics(wb: Workbook):
    """Sheet 13 Diagnostics_AAG_AvG — canonical AAG_O1=0.789 + AvG_O1=0.0882.

    Per Lock #8.15: canonical AAG is Wk8 formula (Aspiration/Actuality face-grouping
    ratio). The Phase 2 Evidence Package "AAG" is per-vector mean coherence
    (mislabeled, rename to OVC). This sheet uses Wk8 canonical only.

    Per Lock #8.14 + Sheet 16 design: AvG_O1 = 0.0882 (border of "Aggregation
    distortion" — signals architectural blindness).

    Honest disclosure per audit trail §12 + §16.

    Defines named ranges `cen_aag_o1` and `cen_avg_o1`.
    """
    ws = wb.create_sheet("13_Diagnostics_AAG_AvG")
    apply_brand_header(ws, 1, 1, 8,
                       "Diagnostics · AAG (Wk8 canonical) + AvG (strict-O1)",
                       bg=DEEP_TEAL, size=14)
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
    apply_brand_header(ws, 1, 1, 12,
                       "Sheet 14 — Spectral Analysis", bg=DARK_NAVY, size=16)
    apply_brand_header(ws, 2, 1, 12,
                       "Laplacian eigenvalue decomposition · Modal amplitudes · "
                       "Δ vector · Performance verdict per face", bg=DEEP_TEAL)
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

    Each row maps a cell-type / section to its audit trail anchor:
      Face calculation cells → audit trail §1-§4
      Edge cells → §5
      Vertex cells → §6
      Axis cells → §7
      Octave detection → Appendix C (Foundation Principle)
      Global Coherence → §8
      AAG → §12 + §16
      Spectral Δ verdict → §13
      Bi-Directional Intervention → §17 (Lock #8.24)

    Authority: provenance discipline (every computed cell traceable to math doc).
    """
    ws = wb.create_sheet("17_Audit_Trail_Crosslinks")
    apply_brand_header(ws, 1, 1, 6,
                       "Audit Trail Crosslinks · Cell-Type → Math Doc Section",
                       bg=DEEP_TEAL, size=14)
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
