"""Apply the Cross-Workspace Tracker Row Protocol to Thesis_Control_Panel.xlsx.

This script updates ONLY row 13 of the CEN Deliverables sheet (deliverable #7
'Proposed KPIs with methodology notes') to reflect the Phase 4 Commitment
Artifact that POC delivered on 2026-04-15.

Protocol compliance (per ~/.claude/CLAUDE.md § Cross-Workspace Tracker Row Protocol):
- File: ONLY Thesis_Control_Panel.xlsx (not any other Thesis file)
- Sheet: ONLY CEN Deliverables (the designated tracker sheet)
- Action: ONLY update status + notes cells of one existing row
- Content: ONLY about POC-originated work (the 420 Songbook)
- Provenance: Notes column explicitly names the originating workspace + session + date
- Companion: memory entity CrossWorkspaceUpdate-Phase4-420Songbook-2026-04-15 (already exists)
- Companion: mirror files in Final Thesis/Thesis Work/Quannex Business Exports/ (already exist)

Idempotent: detects if status already updated, no-ops on re-run.
Atomic: writes to staging xlsx, validates, then replaces.
"""

import sys
from datetime import datetime
from pathlib import Path

if sys.version_info < (3, 9):
    print("[ERROR] Python 3.9+ required.")
    sys.exit(1)

try:
    import openpyxl
except ImportError:
    print("[ERROR] openpyxl not installed.")
    sys.exit(1)

THESIS_CP = Path(r"C:\Users\murau\OneDrive\Stalinis kompiuteris\Final Thesis\Thesis Work\Thesis_Control_Panel.xlsx")
STAGING = THESIS_CP.parent / "Thesis_Control_Panel_staging.xlsx"

NEW_STATUS = "PHASE 4 DELIVERED"
NEW_NOTES_ADDITION = (
    "2026-04-16 (POC session 29, Cross-Workspace Tracker Row Protocol): "
    "Phase 4 Commitment Artifact delivered — methodology spec (14 sections) + "
    "5 worked BSC→420 mappings + milestone plan for May full 420 Songbook. "
    "Spiral verdict RADIANT 9.25/10. Canonical: POC/deliverables/. "
    "Mirror: Quannex Business Exports/. Memory: CrossWorkspaceUpdate-Phase4-420Songbook-2026-04-15."
)


def log(level: str, msg: str) -> None:
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{level}] {ts} {msg}")


def preflight() -> bool:
    if not THESIS_CP.exists():
        log("ERROR", f"Not found: {THESIS_CP}")
        return False
    try:
        wb = openpyxl.load_workbook(THESIS_CP, read_only=True)
        wb.close()
        return True
    except PermissionError:
        log("ERROR", "Thesis_Control_Panel.xlsx is open in Excel. Close and re-run.")
        return False


def find_deliverable_7_row(ws) -> int:
    """Find row where col A == '7' AND col B mentions 'Proposed KPIs'."""
    for r in range(1, ws.max_row + 1):
        a = str(ws.cell(r, 1).value or "").strip()
        b = str(ws.cell(r, 2).value or "")
        if a == "7" and "Proposed KPIs" in b:
            return r
    return -1


def main() -> int:
    if not preflight():
        return 1

    log("INFO", f"Loading {THESIS_CP.name}")
    wb = openpyxl.load_workbook(THESIS_CP)

    if "CEN Deliverables" not in wb.sheetnames:
        log("ERROR", "Sheet 'CEN Deliverables' not found.")
        return 1

    ws = wb["CEN Deliverables"]
    row = find_deliverable_7_row(ws)
    if row < 0:
        log("ERROR", "Could not locate deliverable #7 row (col A == '7' AND col B contains 'Proposed KPIs').")
        return 1
    log("INFO", f"Found deliverable #7 at row {row}")

    # Idempotency: detect if status already updated
    current_status = str(ws.cell(row, 3).value or "")
    if "PHASE 4 DELIVERED" in current_status:
        log("INFO", "Row 13 already marked PHASE 4 DELIVERED. Idempotent no-op; exit 0.")
        return 0

    # Protocol-narrow update: ONLY cols C (Status) and G (Notes / Thesis Relevance)
    # Based on inspection: col C = Status, col G = Notes. Do NOT touch other columns.
    log("INFO", f"Previous status (col C): {current_status!r}")
    ws.cell(row, 3, value=NEW_STATUS)

    existing_notes = ws.cell(row, 7).value
    if existing_notes:
        new_notes = f"{existing_notes}\n\n{NEW_NOTES_ADDITION}"
    else:
        new_notes = NEW_NOTES_ADDITION
    ws.cell(row, 7, value=new_notes)

    # Atomic save
    log("INFO", f"Writing to staging: {STAGING.name}")
    wb.save(STAGING)

    # Validate
    try:
        vwb = openpyxl.load_workbook(STAGING, read_only=True)
        assert "CEN Deliverables" in vwb.sheetnames
        vwb.close()
    except Exception as e:
        log("ERROR", f"Staging validation failed: {e}")
        STAGING.unlink(missing_ok=True)
        return 1

    STAGING.replace(THESIS_CP)
    log("INFO", f"DONE: Thesis_Control_Panel.xlsx row {row} updated per Cross-Workspace Tracker Row Protocol.")
    log("INFO", f"  Status: {NEW_STATUS}")
    log("INFO", f"  Notes appended with provenance: POC session 29 on 2026-04-16")
    return 0


if __name__ == "__main__":
    sys.exit(main())
