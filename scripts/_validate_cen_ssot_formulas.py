"""
CEN SSOT xlsx Formula Validator

Validates the SSOT xlsx at:
  Final Thesis/Thesis Work/Quannex Business Exports/CEN_Spiral_Dashboard_SSOT_v1.0_<date>.xlsx

Authority: Locks #8.7 + #8.10 + #8.24 of CEN SSOT Consolidation Map.
Per W2 entry checklist Step W2.4.

Per-check authority:
  - Lock #8.7  : SSOT xlsx as canonical numeric/formula authority
  - Lock #8.10 : Named-range discipline; calculation sheets reference named ranges
                 not orphan literals
  - Lock #8.20 + #8.35 : Canonical CEN O1 regression values @ κ=φ² canonical baseline
                          (AAG=0.8851, AvG=0.1813, dominantMode=5 = regional band).
                          Lock #8.35 (2026-05-24) superseded the earlier κ=4 baseline
                          values (AAG=0.789, AvG=0.0882) from the Lock #8.20 era.
  - Lock #8.24 : Sheet 09 BiDirectional_Intervention_Map signature face-row
                 weights MUST sum to 1.0 ± 1e-6

§29 openpyxl gotchas applied:
  - data_only=False loads formulas as strings (=A1+B1)
  - data_only=True loads CACHED values (only valid if Excel last opened the file
    and saved; openpyxl itself does NOT recompute formulas)
  - Therefore: error-string scan in value-mode is reliable ONLY if the SSOT
    was opened+saved in Excel first. If cached values are missing (None),
    that's reported in load() as a soft warning, not a hard fail.
  - Byte-level diff is wrong for xlsx (XML rewrite on save). Cell-level
    iteration is the right tool — this file uses it throughout.
  - Sentinel-based discovery preferred over hardcoded row numbers (per §29);
    Sheet 09 signature rows are found by column-A text match, not row index.

Usage:
  python _validate_cen_ssot_formulas.py
  python _validate_cen_ssot_formulas.py /path/to/SSOT.xlsx
  python _validate_cen_ssot_formulas.py --check parens
  python _validate_cen_ssot_formulas.py --check o1
"""

import argparse
import re
import sys
from pathlib import Path
from openpyxl import load_workbook


# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

DEFAULT_SSOT_PATH = Path(
    r"C:/Users/murau/OneDrive/Stalinis kompiuteris/Final Thesis/"
    r"Thesis Work/Quannex Business Exports/"
    r"CEN_Spiral_Dashboard_SSOT_v1.0.xlsx"
)
# Filename undated post-W4.7 Option A (2026-05-25); kept in sync with
# _build_cen_ssot_xlsx.py:DEFAULT_OUTPUT. Both must stay aligned or validator
# fails on file-not-found. Old dated path archived under Quannex Business
# Exports/_archive/ per Never Delete Rule.

# Excel error strings that surface as cell values when formulas break
EXCEL_ERRORS = {"#REF!", "#NAME?", "#DIV/0!", "#VALUE!", "#NULL!", "#NUM!", "#N/A"}

# Float comparison tolerance — per Lock #8.24 signature-sum convention
TOLERANCE = 1e-6

# CEN canonical regression values (Lock #8.20)
# Source: js/main.js engine output for CEN client at O1 layer, validated Wk6
CEN_EXPECTED_AAG_O1 = 0.8851          # Aspiration/Actuality face-grouping ratio @ κ=φ² canonical (Lock #8.35 supersedes 0.789 from Lock #8.20 κ=4 era)
CEN_EXPECTED_AVG_O1 = 0.1813          # Apparent vs Granular gap @ κ=φ² canonical (Lock #8.35 supersedes 0.0882 from Lock #8.20 κ=4 era)
CEN_EXPECTED_DOMINANT_MODE = 5         # Regional band (face number, not eigenvalue idx)

# Named ranges expected for the O1 regression check (Lock #8.20)
# Names follow the snake_case discipline established for BDQ Finance_Control_Panel
CEN_O1_NAMED_RANGES = {
    "cen_aag_o1": CEN_EXPECTED_AAG_O1,
    "cen_avg_o1": CEN_EXPECTED_AVG_O1,
    "cen_dominant_mode": CEN_EXPECTED_DOMINANT_MODE,
}

# Sheets that perform calculation (vs. raw input / reference). Per Lock #8.10,
# these should reference named ranges instead of orphan literals.
CALCULATION_SHEETS = {
    "04_Face_Calculations",
    "05_Star_Pairs",
    "06_Breath_Feedback_Pass2",
    "07_Edges",
    "08_Vertices",
    "10_Breath_Axes",
    "11_Octave_Detection",
    "12_Global_Coherence",
    "13_Diagnostics_AAG_AvG",
    "14_Spectral_Analysis",
}

# Sheets with row-level sum invariants (Lock #8.24 family)
# NOTE: Sheet renamed 2026-05-22 from '09_BiDirectional_Intervention_Map' →
# '09_Vertex_KPIs_BiDirectional' per Lock #8.24 final naming.
SHEETS_WITH_SUM_VALIDATION = {
    "09_Vertex_KPIs_BiDirectional":
        "Per Lock #8.24, all signature face-row sums must = 1.0 ± 1e-6",
}

# Sheets to SKIP from formula-discipline checks. Reference/glossary sheets
# may contain cells starting with '=' that are prose pseudocode (e.g., Sheet
# 0a Glossary Definition column has entries like '= φ⁻¹ ≈ 0.618...' which
# look like formulas to the parser but are human-readable explanations).
FORMULA_CHECK_SKIP_SHEETS = {
    "0a_Naming_Translation",  # Glossary definitions; not actual formulas
    "00_Cover_Provenance",     # Static title + Lock #8.36 note text
    "17_Audit_Trail_Crosslinks",  # Static reference; manual cross-ref audit
    "18_Adversarial_Findings",  # W3 finding text; not calculations
    "19_Test_Coverage_Matrix",  # Static coverage map; not calculations
    "20_Cross_Workspace_Refs",  # Static reference; not calculations
}

# Regex for stripping sheet-qualified cell references from formulas before
# applying literal-detection. Matches 'Sheet Name'!A1 or 'Sheet Name'!A1:B2.
# Sheet-name fragments ('04', '06', etc.) are NOT orphan literals.
SHEET_QUALIFIED_REF_RE = re.compile(r"'[^']+'![A-Z]+\$?\d+(?::\$?[A-Z]+\$?\d+)?")

# Regex for stripping DOUBLE-QUOTED STRING LITERALS from formulas before
# applying token/literal analysis. Tokens inside CONCATENATE("...","...")
# output strings (like "C_global" in display label or "§11" in narrative
# text) are NOT references to named ranges or orphan numeric literals.
# Matches "..." with escaped quote support (doubled "" becomes ").
QUOTED_STRING_RE = re.compile(r'"(?:[^"]|"")*"')

# Regex for extracting potential named-range tokens from formula strings.
# Matches identifier-style names that are NOT Excel cell refs (e.g. A1, $B$2).
# Conservative: matches \b[a-z_][a-z0-9_]*\b which excludes leading digits +
# excludes upper-case-only patterns (which are most cell refs / sheet names).
NAMED_RANGE_TOKEN_RE = re.compile(r"\b([a-z_][a-z0-9_]{2,})\b")

# Excel function names to ignore when scanning for "potential named ranges"
# (lower-case versions; the regex already lowercased the match for comparison)
EXCEL_BUILTINS = {
    "sum", "average", "min", "max", "count", "counta", "countif", "sumif",
    "sumifs", "averageif", "averageifs", "if", "iferror", "ifna", "and", "or",
    "not", "true", "false", "vlookup", "hlookup", "index", "match", "indirect",
    "offset", "row", "column", "rows", "columns", "abs", "round", "roundup",
    "rounddown", "int", "mod", "power", "sqrt", "exp", "ln", "log", "log10",
    "sin", "cos", "tan", "asin", "acos", "atan", "atan2", "pi", "degrees",
    "radians", "concatenate", "concat", "textjoin", "len", "left", "right",
    "mid", "find", "search", "substitute", "replace", "lower", "upper",
    "proper", "trim", "value", "text", "today", "now", "date", "year",
    "month", "day", "weekday", "hour", "minute", "second", "rand", "randbetween",
    "transpose", "mmult", "sumproduct", "sumsq", "sumx2my2", "sumx2py2",
    "stdev", "var", "median", "mode", "percentile", "quartile", "rank",
    "large", "small", "frequency", "linest", "trend", "forecast", "correl",
    "covar", "slope", "intercept", "rsq",
}


# ---------------------------------------------------------------------------
# Validator
# ---------------------------------------------------------------------------

class SSOTValidator:
    """
    Stateful validator that loads the SSOT workbook once and runs checks
    in sequence. Issues accumulate on self.issues; report() emits them and
    returns exit code (0 pass, 1 fail).

    Fluent interface: each check_* method returns self so they can be chained.
    """

    def __init__(self, xlsx_path):
        self.path = Path(xlsx_path)
        self.wb_formula = None     # data_only=False; formulas as strings
        self.wb_value = None        # data_only=True; cached values from Excel
        self.issues = []
        self.warnings = []
        self.named_ranges = set()

    # ---- Loading ----------------------------------------------------------

    def load(self):
        """
        Load workbook in both modes.

        data_only=False : formulas as raw strings (=SUM(A1:A10))
        data_only=True  : cached values (None if Excel never opened+saved)

        Per §29: openpyxl does NOT recompute formulas. If wb_value cells are
        all None, the SSOT needs to be opened+saved in Excel first to populate
        the cache. We emit this as a warning, not a hard fail.
        """
        if not self.path.exists():
            raise FileNotFoundError(f"SSOT xlsx not found: {self.path}")

        self.wb_formula = load_workbook(self.path, data_only=False)
        self.wb_value = load_workbook(self.path, data_only=True)

        # Collect defined names for cross-checking
        for dn in self.wb_formula.defined_names:
            self.named_ranges.add(dn)

        if not self.named_ranges:
            self.warnings.append(
                "No named ranges defined in workbook; named-range checks "
                "will report orphan-literal issues for all formulas."
            )

        return self

    # ---- Checks -----------------------------------------------------------

    def check_balanced_parens(self):
        """
        Every formula has balanced parens.

        Counts '(' and ')' in each cell value starting with '='. Mismatches
        are usually a sign of a hand-edited formula gone wrong. Cheap check;
        catches a real class of bugs.
        """
        for sheet_name in self.wb_formula.sheetnames:
            ws = self.wb_formula[sheet_name]
            for row in ws.iter_rows():
                for cell in row:
                    if isinstance(cell.value, str) and cell.value.startswith("="):
                        opens = cell.value.count("(")
                        closes = cell.value.count(")")
                        if opens != closes:
                            self.issues.append(
                                f"Unbalanced parens in {sheet_name}!{cell.coordinate}: "
                                f"{opens}( vs {closes})"
                            )
        return self

    def check_named_range_references(self):
        """
        Every named range used in formulas exists in defined_names.

        Extracts identifier-style tokens via regex from formula strings,
        filters out Excel builtins, and verifies each remaining token is
        a defined name. Catches typos (e.g. 'cen_agg_o1' when meant 'cen_aag_o1').

        Authority: Lock #8.10 (named-range discipline).
        """
        defined_lower = {n.lower() for n in self.named_ranges}

        for sheet_name in self.wb_formula.sheetnames:
            # Skip reference/glossary sheets — they contain prose pseudocode
            # in cells starting with '=' that are not actual Excel formulas
            if sheet_name in FORMULA_CHECK_SKIP_SHEETS:
                continue
            ws = self.wb_formula[sheet_name]
            for row in ws.iter_rows():
                for cell in row:
                    if not (isinstance(cell.value, str) and cell.value.startswith("=")):
                        continue
                    formula = cell.value
                    # Strip sheet-qualified refs + double-quoted strings BEFORE
                    # tokenizing. Sheet-name fragments + string-output content
                    # (like "C_global" in CONCATENATE display labels) are NOT
                    # undefined token references.
                    cleaned = SHEET_QUALIFIED_REF_RE.sub("", formula)
                    cleaned = QUOTED_STRING_RE.sub("", cleaned)
                    tokens = NAMED_RANGE_TOKEN_RE.findall(cleaned[1:].lower())
                    for token in tokens:
                        if token in EXCEL_BUILTINS:
                            continue
                        # Skip sheet-qualified refs (Sheet!Cell) — sheet names
                        # appear here too. Conservative check: if token is the
                        # lower-cased version of a sheet name, skip.
                        if token in {s.lower() for s in self.wb_formula.sheetnames}:
                            continue
                        if token not in defined_lower:
                            # Heuristic: tokens of length >= 4 that look like
                            # snake_case identifiers are likely intended as
                            # named ranges. Shorter tokens are often false
                            # positives (e.g., function args we didn't catch).
                            if len(token) >= 4 and "_" in token:
                                self.issues.append(
                                    f"Undefined name '{token}' in {sheet_name}!"
                                    f"{cell.coordinate}: {formula}"
                                )
        return self

    def check_no_excel_errors(self):
        """
        No #REF/#NAME/#DIV/0 etc. in value-mode cells.

        Per §29 openpyxl gotcha: this is only reliable if Excel last opened
        the SSOT and saved (populating the value cache). If cache is empty,
        all cells read as None and this check is silently a no-op.
        """
        cached_value_count = 0
        for sheet_name in self.wb_value.sheetnames:
            ws = self.wb_value[sheet_name]
            for row in ws.iter_rows():
                for cell in row:
                    if cell.value is not None:
                        cached_value_count += 1
                    if isinstance(cell.value, str) and cell.value in EXCEL_ERRORS:
                        self.issues.append(
                            f"Excel error in {sheet_name}!{cell.coordinate}: {cell.value}"
                        )

        if cached_value_count == 0:
            self.warnings.append(
                "No cached values found; Excel error scan is a no-op. "
                "Open the SSOT in Excel and save to populate the value cache."
            )

        return self

    def check_signature_sums(self):
        """
        Sheet 09: per-face signature weights sum to 1.0 ± 1e-6 (Lock #8.24).

        Sheet 09 BiDirectional_Intervention_Map encodes per-face signature
        weights as rows. The invariant is that every signature face row's
        weights MUST sum to exactly 1.0 (within tolerance) — this is a
        probability-distribution discipline.

        Per §29: use sentinel-based row discovery (column-A text match), NOT
        hardcoded row numbers. The Sheet 09 schema may have rows inserted
        between authoring and validation runs.
        """
        sheet_name = "09_Vertex_KPIs_BiDirectional"
        if sheet_name not in self.wb_value.sheetnames:
            self.warnings.append(
                f"Sheet '{sheet_name}' not found; skipping signature-sum check."
            )
            return self

        ws = self.wb_value[sheet_name]

        # Find signature face rows by sentinel pattern in column A.
        # Expected pattern: "F1", "F2", ..., "F12" or similar face identifiers.
        face_row_re = re.compile(r"^F\d{1,2}$")

        for row_idx, row in enumerate(ws.iter_rows(values_only=True), start=1):
            if not row:
                continue
            col_a = row[0]
            if not isinstance(col_a, str):
                continue
            if not face_row_re.match(col_a.strip()):
                continue

            # Sum the numeric weights from columns B onward
            weights = [v for v in row[1:] if isinstance(v, (int, float))]
            if not weights:
                continue

            total = sum(weights)
            if abs(total - 1.0) > TOLERANCE:
                self.issues.append(
                    f"Sheet 09 signature row {col_a} (row {row_idx}) "
                    f"sums to {total:.9f}, expected 1.0 ± {TOLERANCE} "
                    f"(Lock #8.24 violation)"
                )

        return self

    def check_circular_references(self):
        """
        Cycle detection in formula dependency graph.

        Builds a directed graph where each formula-bearing cell points to
        the cells it references, then runs a DFS-based cycle detector.

        Conservative implementation: only handles same-sheet refs and
        Sheet!Cell qualified refs. Named-range expansion deferred — full
        graph requires resolving every defined_name to its actual range,
        which adds significant complexity. The same-sheet pass catches
        the most common circular-ref bug class.
        """
        # Cell reference regex: optional sheet qualifier + column letters + row number
        cell_ref_re = re.compile(r"(?:'?([\w\s]+)'?!)?\$?([A-Z]+)\$?(\d+)")

        # Build graph: (sheet, coord) -> set of (sheet, coord) it depends on
        graph = {}
        for sheet_name in self.wb_formula.sheetnames:
            ws = self.wb_formula[sheet_name]
            for row in ws.iter_rows():
                for cell in row:
                    if not (isinstance(cell.value, str) and cell.value.startswith("=")):
                        continue
                    node = (sheet_name, cell.coordinate)
                    deps = set()
                    for match in cell_ref_re.finditer(cell.value):
                        ref_sheet = match.group(1) or sheet_name
                        ref_col = match.group(2)
                        ref_row = match.group(3)
                        deps.add((ref_sheet, f"{ref_col}{ref_row}"))
                    graph[node] = deps

        # DFS cycle detection
        WHITE, GRAY, BLACK = 0, 1, 2
        color = {n: WHITE for n in graph}

        def has_cycle(node, path):
            if color.get(node, WHITE) == GRAY:
                # Found back-edge — cycle detected
                cycle_start = path.index(node) if node in path else 0
                cycle = path[cycle_start:] + [node]
                cycle_str = " -> ".join(f"{s}!{c}" for s, c in cycle)
                self.issues.append(f"Circular reference detected: {cycle_str}")
                return True
            if color.get(node, WHITE) == BLACK:
                return False
            color[node] = GRAY
            path.append(node)
            for dep in graph.get(node, set()):
                if dep in graph:  # only recurse into formula cells
                    if has_cycle(dep, path):
                        return True
            path.pop()
            color[node] = BLACK
            return False

        for node in list(graph.keys()):
            if color[node] == WHITE:
                has_cycle(node, [])

        return self

    def check_calculation_sheet_named_range_usage(self):
        """
        Calculation sheets should use named ranges, not orphan literals.

        Per Lock #8.10: formulas in CALCULATION_SHEETS should reference named
        ranges (snake_case identifiers) rather than embed numeric literals
        directly. Hardcoded numbers in calculation sheets violate the
        cascading-formula discipline (§33 global rule).

        Exception: ratios of small integers (e.g., /2, *3) and common
        constants (1, 0, -1) are acceptable inline.
        """
        # Detects numeric literals that are not trivial small integers
        literal_re = re.compile(r"(?<![A-Za-z_\d.])(\d+\.\d+|\d{2,})")

        defined_lower = {n.lower() for n in self.named_ranges}

        for sheet_name in CALCULATION_SHEETS:
            if sheet_name not in self.wb_formula.sheetnames:
                continue
            ws = self.wb_formula[sheet_name]
            for row in ws.iter_rows():
                for cell in row:
                    if not (isinstance(cell.value, str) and cell.value.startswith("=")):
                        continue
                    formula = cell.value
                    # Strip sheet-qualified refs + quoted strings BEFORE
                    # literal-detection. Sheet names ('04_...') contain
                    # digits that are NOT orphan literals; quoted-string
                    # content (e.g., "§11" in CONCATENATE narrative output)
                    # is NOT a numeric literal. Cross-sheet refs like
                    # 'Sheet 04'!T4 are valid Excel formulas, not Lock #8.10
                    # violations.
                    cleaned = SHEET_QUALIFIED_REF_RE.sub("", formula)
                    cleaned = QUOTED_STRING_RE.sub("", cleaned)
                    # Skip if formula uses at least one named range
                    tokens = NAMED_RANGE_TOKEN_RE.findall(cleaned[1:].lower())
                    has_named_range = any(
                        t in defined_lower and t not in EXCEL_BUILTINS
                        for t in tokens
                    )
                    if has_named_range:
                        continue
                    # Flag formulas with substantive literals + no named refs
                    # (use CLEANED formula so sheet-name digits don't trigger)
                    literals = literal_re.findall(cleaned)
                    if literals:
                        self.issues.append(
                            f"Calculation sheet {sheet_name}!{cell.coordinate} "
                            f"uses orphan literal(s) {literals} without named "
                            f"ranges (Lock #8.10): {formula}"
                        )
        return self

    def check_o1_face_energies_known_values(self):
        """
        Regression: known CEN canonical O1 values match (Lock #8.20).

        Validates that the SSOT produces the same numeric outputs as the
        js/main.js engine for the CEN client at O1 layer. Drift here is a
        red flag — either the SSOT formulas have a bug, or the engine has
        diverged from the canonical definition, or someone changed CEN's
        input KPIs without updating the regression values here.

        Expected values (Lock #8.20):
          cen_aag_o1        = 0.8851  (Aspiration/Actuality face-grouping ratio @ κ=φ²)
          cen_avg_o1        = 0.1813  (Apparent vs Granular gap @ κ=φ²)
          cen_dominant_mode = 5        (regional band)
        """
        for name, expected in CEN_O1_NAMED_RANGES.items():
            if name not in {n.lower() for n in self.named_ranges}:
                self.warnings.append(
                    f"Expected named range '{name}' not defined in SSOT; "
                    f"O1 regression skipped for this value."
                )
                continue

            # Find the actual defined_name and resolve to a value
            actual_value = self._resolve_named_range_value(name)
            if actual_value is None:
                self.warnings.append(
                    f"Named range '{name}' resolved to None (cache empty?); "
                    f"cannot regression-check against {expected}."
                )
                continue

            if not isinstance(actual_value, (int, float)):
                self.issues.append(
                    f"Named range '{name}' has non-numeric value {actual_value!r}; "
                    f"expected ~{expected}"
                )
                continue

            # Use tolerance proportional to magnitude for small expected values
            tol = max(TOLERANCE, abs(expected) * 1e-3)
            if abs(actual_value - expected) > tol:
                self.issues.append(
                    f"O1 regression FAIL: '{name}' = {actual_value} "
                    f"(expected {expected} ± {tol}; Lock #8.20)"
                )
        return self

    def check_naming_convention_single_source_of_truth(self):
        """
        Lock #8.39 — Naming-Convention Single-Source-of-Truth.

        Verifies that face names in SSOT sheets MATCH mapping-context.json
        per face. Closes the silent-default-masquerading pattern surfaced
        2026-05-25 (Sheet 16 had hardcoded customNames that drifted from
        mapping-context.json — F3 'Human Capital' duplicate, F6 'Community
        Trust' invented; Sheet 0a had 11/12 ad-hoc CEN labels not matching
        Appendix E §E.3.1 source).

        Checks:
          (1) Sheet 16 FACE_INFO_12 customName column (row 15-26, col 4)
              must match mapping-context.json customName per face_id.
          (2) Sheet 0a NAMING_TRANSLATION CEN-Authentic Cluster Name column
              (col 5 in restructured layout, rows 8-13 IIRC + 16-21 polarity)
              must match mapping-context.json appendixEClusterName per face_id.

        Source-of-truth: POC/companies/cen/mapping-context.json faces[] array.
        """
        import json as _json_validator

        # Load the canonical mapping-context.json source-of-truth
        cen_mc_path = Path(__file__).resolve().parent.parent / "companies" / "cen" / "mapping-context.json"
        if not cen_mc_path.exists():
            self.warnings.append(
                f"Lock #8.39 check skipped: mapping-context.json not found at {cen_mc_path}"
            )
            return self

        with cen_mc_path.open(encoding="utf-8") as f:
            mc_data = _json_validator.load(f)

        expected_customnames = {
            face["id"]: face.get("customName")
            for face in mc_data.get("faces", [])
        }
        expected_cluster_names = {
            face["id"]: face.get("appendixEClusterName")
            for face in mc_data.get("faces", [])
        }

        # Check 1: Sheet 16 customName column (col 4) for rows 15-26 (12 faces)
        if "16_Dashboard_View" in self.wb_formula.sheetnames:
            ws16 = self.wb_formula["16_Dashboard_View"]
            for offset in range(12):
                face_id = offset + 1
                row = 15 + offset
                actual = ws16.cell(row=row, column=4).value
                expected = expected_customnames.get(face_id)
                if expected is not None and actual != expected:
                    self.issues.append(
                        f"Lock #8.39 violation: Sheet 16 F{face_id} customName "
                        f"= {actual!r} but mapping-context.json says {expected!r}"
                    )

        # Check 2: Sheet 0a CEN-Authentic Cluster Name column (col 5) per face_id
        # Sheet 0a rows are not 1:1 with face_id due to IIRC/polarity grouping;
        # need to scan and match face_id from col 1
        if "0a_Naming_Translation" in self.wb_formula.sheetnames:
            ws0a = self.wb_formula["0a_Naming_Translation"]
            # Scan rows 8-21 for face entries (col 1 = "F<n>", col 5 = CEN cluster name)
            for row in range(8, 22):
                col1 = ws0a.cell(row=row, column=1).value
                if not (isinstance(col1, str) and col1.startswith("F")):
                    continue
                try:
                    face_id = int(col1[1:])
                except ValueError:
                    continue
                if face_id < 1 or face_id > 12:
                    continue
                actual = ws0a.cell(row=row, column=5).value
                expected = expected_cluster_names.get(face_id)
                if expected is not None and actual != expected:
                    self.issues.append(
                        f"Lock #8.39 violation: Sheet 0a F{face_id} appendixEClusterName "
                        f"= {actual!r} but mapping-context.json says {expected!r}"
                    )

        return self

    # ---- Helpers ----------------------------------------------------------

    def _resolve_named_range_value(self, name):
        """
        Resolve a named range to its cached value from wb_value.

        Returns None if the named range can't be resolved or has no cached
        value. Handles simple single-cell ranges; multi-cell ranges return
        the top-left cell value (sufficient for the O1 regression scalars).
        """
        # Find the defined_name (case-insensitive match)
        for dn_name in self.wb_value.defined_names:
            if dn_name.lower() != name.lower():
                continue
            dn = self.wb_value.defined_names[dn_name]
            try:
                for sheet_name, coord in dn.destinations:
                    ws = self.wb_value[sheet_name]
                    cell = ws[coord.split(":")[0]]  # top-left of range
                    return cell.value
            except (AttributeError, KeyError, ValueError):
                return None
        return None

    # ---- Orchestration ----------------------------------------------------

    def run_all(self):
        """Run all checks in dependency order."""
        return (self
                .load()
                .check_balanced_parens()
                .check_named_range_references()
                .check_no_excel_errors()
                .check_signature_sums()
                .check_circular_references()
                .check_calculation_sheet_named_range_usage()
                .check_o1_face_energies_known_values()
                .check_naming_convention_single_source_of_truth())

    def report(self):
        """Print issues + warnings, return exit code (0 pass, 1 fail)."""
        if self.warnings:
            print(f"⚠ {len(self.warnings)} warning(s):")
            for i, w in enumerate(self.warnings, 1):
                print(f"  W{i}. {w}")
            print()

        if not self.issues:
            sheet_count = len(self.wb_formula.sheetnames) if self.wb_formula else 0
            print(f"✓ ALL CHECKS PASSED: 0 issues across {sheet_count} sheets")
            return 0

        print(f"✗ {len(self.issues)} issue(s) found:")
        for i, issue in enumerate(self.issues, 1):
            print(f"  {i}. {issue}")
        return 1


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="Validate CEN SSOT xlsx (Locks #8.7, #8.10, #8.20, #8.24)"
    )
    parser.add_argument(
        "path", type=Path, nargs="?", default=DEFAULT_SSOT_PATH,
        help="Path to SSOT xlsx (default: latest dated CEN SSOT)"
    )
    parser.add_argument(
        "--check",
        choices=["all", "parens", "refs", "errors", "sums", "circular", "named", "o1"],
        default="all",
        help="Run a specific check (default: all)"
    )
    args = parser.parse_args()

    validator = SSOTValidator(args.path)

    if args.check == "all":
        validator.run_all()
    else:
        validator.load()
        method_map = {
            "parens": validator.check_balanced_parens,
            "refs": validator.check_named_range_references,
            "errors": validator.check_no_excel_errors,
            "sums": validator.check_signature_sums,
            "circular": validator.check_circular_references,
            "named": validator.check_calculation_sheet_named_range_usage,
            "o1": validator.check_o1_face_energies_known_values,
        }
        method_map[args.check]()

    sys.exit(validator.report())


if __name__ == "__main__":
    main()
