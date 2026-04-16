"""Patch POC/CONTROL_PANEL_POC.xlsx — 5 sheets in one atomic pass.

Sentinel-row detection: finds insert points by column-A text match, NOT absolute row
numbers, so schema drift doesn't break the patch.

Idempotent: re-running detects already-applied state and exits clean no-op.
Atomic: writes to .tmp first, validates, renames.
"""

import sys
from datetime import datetime
from pathlib import Path

if sys.version_info < (3, 9):
    print("[ERROR] Python 3.9+ required.")
    sys.exit(1)

try:
    import openpyxl
    from openpyxl.styles import Font, Alignment
except ImportError:
    print("[ERROR] openpyxl not installed. Run: pip install openpyxl")
    sys.exit(1)

BASE = Path(r"C:\Users\murau\OneDrive\Stalinis kompiuteris\POC")
CP_PATH = BASE / "CONTROL_PANEL_POC.xlsx"
TMP_PATH = BASE / "CONTROL_PANEL_staging.xlsx"

DATED_NOTE = "2026-04-17: Phase 4 commitment artifact delivered (methodology + 5 worked examples). Full Songbook target May 2026."
IDEMPOTENCY_MARKER = "Phase 4 commitment artifact delivered"


def log(level: str, msg: str) -> None:
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{level}] {ts} {msg}")


def find_sentinel_row(ws, matcher) -> int:
    """Return 1-based row number of first row where column A value satisfies matcher(value). -1 if not found."""
    for r in range(1, ws.max_row + 1):
        v = ws.cell(r, 1).value
        if v is not None and matcher(str(v)):
            return r
    return -1


def insert_rows_safe(ws, sentinel: int, count: int = 1) -> None:
    """insert_rows that correctly shifts merged-cell ranges.

    openpyxl's insert_rows doesn't auto-update merged-cell ranges that lie at or below
    the insert point. This leaves phantom merges that silently reject cell writes.
    Fix: unmerge affected ranges, insert, then re-merge at shifted coordinates.
    """
    from openpyxl.utils.cell import range_boundaries, get_column_letter

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


def find_deliverable_row(ws) -> int:
    """Find the row for deliverable #7 (Proposed KPIs). Check col A for '#7' or col B for 'Proposed KPIs'."""
    for r in range(1, ws.max_row + 1):
        a = str(ws.cell(r, 1).value or "")
        b = str(ws.cell(r, 2).value or "")
        if a.strip().startswith("#7") or "Proposed KPIs" in b:
            return r
    return -1


def preflight_check() -> bool:
    """Ensure the xlsx isn't locked by Excel."""
    try:
        wb = openpyxl.load_workbook(CP_PATH, read_only=True)
        wb.close()
        return True
    except PermissionError:
        log("ERROR", f"CONTROL_PANEL_POC.xlsx is open in Excel. Close it and re-run.")
        return False
    except FileNotFoundError:
        log("ERROR", f"Not found: {CP_PATH}")
        return False


def already_patched(wb) -> bool:
    """Detect if the patch has already been applied. Check multiple sheets for
    our distinctive marker strings. Uses iter_rows to avoid ws.max_row edge cases."""
    marker_strings = ["Phase 4 Commitment Artifact", "Phase 4 commitment artifact"]
    for sheet_name in ["Session Log", "Thesis Evidence", "Dashboard"]:
        if sheet_name not in wb.sheetnames:
            continue
        ws = wb[sheet_name]
        for row in ws.iter_rows(values_only=True):
            row_text = " ".join(str(v) for v in row if v is not None)
            if any(marker in row_text for marker in marker_strings):
                return True
    return False


def patch_cen_deliverables(wb) -> str:
    ws = wb["CEN Deliverables"]
    r = find_deliverable_row(ws)
    if r < 0:
        return "FAIL: deliverable #7 row not found"
    # Col D = Status, Col H = Notes
    ws.cell(r, 4, value="IN PROGRESS")
    existing_notes = ws.cell(r, 8).value
    new_notes = f"{existing_notes}\n{DATED_NOTE}" if existing_notes else DATED_NOTE
    ws.cell(r, 8, value=new_notes)
    return f"OK (row {r}: status='IN PROGRESS'; notes appended)"


def patch_thesis_evidence(wb) -> str:
    ws = wb["Thesis Evidence"]
    sentinel = find_sentinel_row(ws, lambda v: v.strip().startswith("ACTIVE BLOCKERS"))
    if sentinel < 0:
        return "FAIL: 'ACTIVE BLOCKERS' sentinel not found"
    insert_rows_safe(ws, sentinel, 1)
    # New row goes at position `sentinel` (sentinel itself shifted down)
    ws.cell(sentinel, 1, value="Spiral Octave Songbook Phase 4 Commitment")
    ws.cell(sentinel, 2, value="SQ5 quantitative KPI embedding proof + paradigm reframe")
    ws.cell(sentinel, 3, value="2026-04-15")
    ws.cell(sentinel, 4, value="POC/deliverables/ + POC/docs/")
    ws.cell(sentinel, 5, value="Committee-reproducible")
    ws.cell(sentinel, 6, value="Methodology + 5 worked examples + spiral 9.25/10")
    ws.cell(sentinel, 7, value="See SPIRAL_OCTAVE_SONGBOOK_SPEC.md")
    return f"OK (inserted at row {sentinel}, before ACTIVE BLOCKERS)"


def patch_codebase_inventory(wb) -> str:
    ws = wb["Codebase Inventory"]
    sentinel = find_sentinel_row(ws, lambda v: v.strip().startswith("TOTALS"))
    if sentinel < 0:
        return "FAIL: 'TOTALS:' sentinel not found"
    entries = [
        ["Songbook Generator", "scripts/", 1, "_build_songbook_phase4_commitment.py", "Healthy", "openpyxl, 7-sheet xlsx builder"],
        ["REFRENCE_MODELS Extractor", "scripts/", 1, "_extract_refrence_models.py", "Healthy", "420 cells -> JSON"],
        ["Command Center Patch", "scripts/", 1, "_update_command_center_phase4.py", "Healthy", "This script"],
        ["KPI Database Patcher", "scripts/", 1, "_patch_kpi_database_facenames.py", "Healthy", "faceName harmonization"],
        ["Songbook Spec", "docs/", 1, "SPIRAL_OCTAVE_SONGBOOK_SPEC.md", "Healthy", "Canonical methodology spec v1.0"],
    ]
    # Insert 5 blank rows before sentinel (merged-cell safe)
    insert_rows_safe(ws, sentinel, len(entries))
    # Fill them
    for i, row_data in enumerate(entries):
        for j, value in enumerate(row_data, start=1):
            ws.cell(sentinel + i, j, value=value)
    return f"OK (inserted {len(entries)} rows at {sentinel}-{sentinel+len(entries)-1}, before TOTALS:)"


def patch_session_log(wb) -> str:
    """Append session log entry at last-real-data-row + 1, NOT at sentinel - 1.

    DEBUG TRAIL (2026-04-15, POC session 29): An earlier version of this patch inserted
    right before the HOW TO USE sentinel at row 26. But the Session Log has an intentional
    16-row empty gap (rows 10-25) between the real data cluster (rows 2-9) and the HOW TO
    USE marker at row 26 — that gap is "room to grow." Inserting at row 26 left the new
    entry visually orphaned from the data cluster. User opened the sheet, saw rows 1-17,
    and thought the patch hadn't landed. Fix: find the last row containing 2026-formatted
    date in column A, insert right after it.
    """
    ws = wb["Session Log"]
    last_data_row = 1  # row 1 is header
    for r in range(2, ws.max_row + 1):
        v = str(ws.cell(r, 1).value or "").strip()
        if v.startswith("2026-") or v.startswith("2025-"):  # date patterns
            last_data_row = max(last_data_row, r)
    target_row = last_data_row + 1

    # If target_row is already a merged/occupied row (e.g. HOW TO USE dropped down), insert
    # a new row there. Otherwise write directly since it's empty.
    existing = str(ws.cell(target_row, 1).value or "").strip()
    if existing:
        insert_rows_safe(ws, target_row, 1)

    ws.cell(target_row, 1, value="2026-04-15")
    ws.cell(target_row, 2, value="420 Spiral Octave Songbook - Phase 4 Commitment Artifact")
    ws.cell(target_row, 3, value="5 artifacts: xlsx, spec, command-center patch, JSON faceName patch, spiral report. Built from REFRENCE_MODELS extraction (420 cells).")
    ws.cell(target_row, 4, value="TBD")
    ws.cell(target_row, 5, value="smoke test PASS; no JS/engine tests touched")
    ws.cell(target_row, 6, value="RADIANT 9.25/10 (12/12 faces >= 9)")
    ws.cell(target_row, 7, value="SQ5 evidence; paradigm reframe: measure-what-is -> ask-what-is-alive")
    return f"OK (written at row {target_row}, right after last real data row {last_data_row})"


def patch_dashboard(wb) -> str:
    ws = wb["Dashboard"]
    sentinel = find_sentinel_row(ws, lambda v: v.strip().startswith("OVERALL VERDICT"))
    if sentinel < 0:
        return "FAIL: 'OVERALL VERDICT' sentinel not found"
    insert_rows_safe(ws, sentinel, 1)
    ws.cell(sentinel, 1, value="Spiral Octave Songbook v1 (Phase 4 Commitment)")
    ws.cell(sentinel, 2, value="Phase 4")
    ws.cell(sentinel, 3, value="2026-04-15")
    ws.cell(sentinel, 4, value="RADIANT")
    ws.cell(sentinel, 5, value="9.25/10")
    ws.cell(sentinel, 6, value="12/12 faces >= 9/10")
    ws.cell(sentinel, 7, value="Artifact committed, May package scheduled")
    return f"OK (inserted at row {sentinel}, before OVERALL VERDICT)"


def main() -> int:
    if not preflight_check():
        return 1
    log("INFO", f"Loading {CP_PATH.name}")
    wb = openpyxl.load_workbook(CP_PATH)

    if already_patched(wb):
        log("INFO", "Patch already applied (detected 'Phase 4 Commitment' entry in Session Log). No-op; exit 0.")
        return 0

    results = {
        "3a CEN Deliverables": patch_cen_deliverables(wb),
        "3b Thesis Evidence": patch_thesis_evidence(wb),
        "3c Codebase Inventory": patch_codebase_inventory(wb),
        "3d Session Log": patch_session_log(wb),
        "3e Dashboard": patch_dashboard(wb),
    }

    for label, result in results.items():
        if result.startswith("FAIL"):
            log("ERROR", f"{label}: {result}")
            return 1
        log("INFO", f"{label}: {result}")

    log("INFO", f"Writing to temp: {TMP_PATH.name}")
    wb.save(TMP_PATH)

    # Validate temp file loads
    log("INFO", "Validating temp file...")
    try:
        vwb = openpyxl.load_workbook(TMP_PATH, read_only=True)
        assert len(vwb.sheetnames) == 7, f"Expected 7 sheets, got {len(vwb.sheetnames)}"
        vwb.close()
    except Exception as e:
        log("ERROR", f"Validation failed: {e}")
        TMP_PATH.unlink(missing_ok=True)
        return 1

    # Atomic rename
    TMP_PATH.replace(CP_PATH)
    log("INFO", f"DONE: 5 sheets patched, {CP_PATH.name} updated.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
