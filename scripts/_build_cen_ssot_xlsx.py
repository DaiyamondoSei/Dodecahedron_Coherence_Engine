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
    """Sheet 02 CEN_Raw_Inputs — 34 BSC KPIs + 4-vector face scores.

    Input layer. Per Lock #1.B: 34 KPIs are the math input; D/E/V_res_pre/V_res_post
    are analytical-context (face-level perceptions, NOT canonical math inputs per Lock #8.7).

    Two blocks:
      Block A: 34 BSC KPI table (id / label / face / octave / score / source-basis)
      Block B: 4-vector face scores (12 faces × 4 vectors = 48 cells, analytical context only)
    """
    ws = wb.create_sheet("02_CEN_Raw_Inputs")
    apply_brand_header(ws, 1, 1, 8,
                       "CEN Raw Inputs — 34 BSC KPIs + 4-Vector Context", bg=DEEP_TEAL, size=14)
    return ws


def build_sheet_03_normalization_60grid(wb: Workbook):
    """Sheet 03 Normalization_60Element_Grid — 12 × 5 × 3 = 180 cells.

    The 60-element grid per face × 3 octaves. KPI placements per v3 Procedure C
    (question-derived clustering). Silent cells zero-filled per zeroEnergy policy.

    Per Lock #8.9: per-cell normalization rationale comment (researcher choice
    documented). Per Lock #8.3: KPIs live in EXACTLY ONE structural position
    (face XOR edge XOR vertex; no 0.5-weight split).
    """
    ws = wb.create_sheet("03_Normalization_60Element_Grid")
    apply_brand_header(ws, 1, 1, 8,
                       "60-Element Grid · 12 Faces × 5 Elements × 3 Octaves", bg=DEEP_TEAL, size=14)
    return ws


def build_sheet_04_face_calculations(wb: Workbook):
    """Sheet 04 Face_Calculations — pentagramic formula per face per octave.

    Per Diagnostics.js-equivalent formula in cells:
      F_face = κ · μ · (1 − λ · CV)  applied at element/face level with pentagram weights

    Defines named ranges `cen_f<n>_e_local_<oN>` for downstream sheets (Spectral,
    Dashboard) to read. Light Blue formula cells throughout (read-only display).

    Authority: js/main.js (calculation engine) + audit trail §1-§4.
    """
    ws = wb.create_sheet("04_Face_Calculations")
    apply_brand_header(ws, 1, 1, 12,
                       "Face Calculations — Pentagramic Coherence per Face per Octave",
                       bg=DEEP_TEAL, size=14)
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
