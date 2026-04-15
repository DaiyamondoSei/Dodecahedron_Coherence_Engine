"""
_extract_refrence_models.py
============================
Extracts the 420-cell Octave Progression Model from the REFRENCE_MODELS sheet
of SpiralDASHBOARD-Leading_V2.xlsx into structured JSON.

Build-wave sub-agent script. READ-ONLY on source file. Do NOT modify the workbook.

Column layout (row 13 header, 0-indexed internals, 1-indexed in repr below):
  Each octave block repeats every 11 columns (for O1..O7):
    - Octave block offset 0  → col  2 (O1), 14 (O2), 25 (O3), 36 (O4), 47 (O5), 58 (O6), 69 (O7) — Octave Theme / Name
    - Octave block offset 1  → col  3, 15, 26, 37, 48, 59, 70 — Element
    - Octave block offset 2  → col  4, 16, 27, 38, 49, 60, 71 — Elemental Question
    - Octave block offset 3  → col  5, 17, 28, 39, 50, 61, 72 — KPI Name (Pillar)
    - Octave block offset 4  → col  6, 18, 29, 40, 51, 62, 73 — Direction
    - Octave block offset 5  → col  7, 19, 30, 41, 52, 63, 74 — Value (current)
    - (cols 8-12, 19-24, 30-34... → Target_Min, Healthy_Min, Healthy_Max, Absolute_Max, Rationale, Normalized — not extracted)
  Col 1 → Face name (e.g. "Financial Capital (F1)")
  Col 2 (block 0 offset 0, 0-indexed col 1) → O1 octave theme (shared across element rows)

Face rows: 14-73 (rows 1-60 in data, 12 faces × 5 elements each)
Shadow rows: 78+ (skipped)
"""

import json
import re
import openpyxl
from datetime import datetime, timezone

SOURCE_PATH = (
    r"C:\Users\murau\OneDrive\Stalinis kompiuteris\Final Thesis\Thesis Work"
    r"\Quannex Documentation & SpiralDashboard\Spiral Dashboard"
    r"\SpiralDASHBOARD-Leading_V2.xlsx"
)
OUTPUT_PATH = (
    r"C:\Users\murau\OneDrive\Stalinis kompiuteris\POC\data\json"
    r"\refrence_models_extracted.json"
)
SHEET_NAME = "REFRENCE_MODELS"

# 12 known faces in order
FACE_MAP = {
    "Financial Capital": 1,
    "Intellectual Capital": 2,
    "Human Capital": 3,
    "Structural Capital": 4,
    "Market Resonance": 5,
    "Community & Partners": 6,
    "Brand & Reputation": 7,
    "Core Operations": 8,
    "Regenerative Flow": 9,
    "Foundational Values": 10,
    "Funding Pipeline": 11,
    "Risk & Resilience": 12,
}

# Face IDs to canonical names
FACE_ID_TO_NAME = {v: k for k, v in FACE_MAP.items()}

# 7 octave definitions in order
OCTAVE_DEFS = [
    (1, "Survival",      "Existence"),
    (2, "Structure",     "Stability"),
    (3, "Relationships", "Connection"),
    (4, "Creativity",    "Possibility"),
    (5, "Expression",    "Clarity"),
    (6, "Vision",        "Direction"),
    (7, "Radiance",      "Service"),
]

# Column offsets within each octave block (0-indexed from the octave's first col)
# O1 starts at col-index 1 (col 2 in 1-based), each block is 11 cols wide
# Actually: O1 cols 2-13, O2 cols 14-24, O3 cols 25-35, O4 cols 36-46, O5 cols 47-57, O6 cols 58-68, O7 cols 69-79
# Theme/Name is at offset 0 of each block (col 2, 14, 25, 36, 47, 58, 69) — 0-indexed: 1,13,24,35,46,57,68
# But ACTUALLY from inspection:
#   O1 block: col1=face, col2=O1_theme, col3=element, col4=question, col5=kpi, col6=direction, col7=value
#   O2 block: col14=O2_theme, col15=element, col16=question, col17=kpi, col18=direction, col19=value
#   O3: col25=theme, col26=el, col27=q, col28=kpi, col29=dir, col30=val
#   O4: col36=theme, col37=el, col38=q, col39=kpi, col40=dir, col41=val
#   O5: col47=theme, col48=el, col49=q, col50=kpi, col51=dir, col52=val
#   O6: col58=theme, col59=el, col60=q, col61=kpi, col62=dir, col63=val
#   O7: col69=theme, col70=el, col71=q, col72=kpi, col73=dir, col74=val
# (all 1-based; convert to 0-based: subtract 1)
OCTAVE_COL_STARTS = [1, 13, 24, 35, 46, 57, 68]  # 0-indexed: octave theme col for O1..O7
# Within block: theme=+0, element=+1, question=+2, kpi=+3, direction=+4, value=+5

VALID_ELEMENTS = {"Earth", "Water", "Fire", "Air", "Ether"}

DIRECTION_MAP = {
    "↑": "up",
    "↓": "down",
    "band": "band",
    "Band": "band",
    "BAND": "band",
}


def clean_str(v):
    """Strip, normalize NBSP."""
    if v is None:
        return None
    s = str(v).replace("\xa0", " ").strip()
    return s if s else None


def parse_face_id(face_str):
    """Extract face ID from e.g. 'Financial Capital (F1)' -> (1, 'Financial Capital')."""
    if not face_str:
        return None, None
    # Try to match F-number in parens
    m = re.search(r"\(F(\d+)\)", face_str)
    if m:
        fid = int(m.group(1))
        name = FACE_ID_TO_NAME.get(fid)
        return fid, name
    # Fallback: match by name prefix
    for name, fid in FACE_MAP.items():
        if name.lower() in face_str.lower():
            return fid, name
    return None, None


def parse_direction(raw):
    """Normalize direction arrow/text to 'up'/'down'/'band'."""
    if raw is None:
        return None
    s = str(raw).strip()
    return DIRECTION_MAP.get(s, None)


def parse_value(raw):
    """Return numeric value or None."""
    if raw is None:
        return None
    if isinstance(raw, (int, float)):
        return raw
    s = str(raw).strip()
    # Skip obviously non-numeric strings
    try:
        return float(s)
    except (ValueError, TypeError):
        return None


def extract():
    wb = openpyxl.load_workbook(SOURCE_PATH, read_only=True, data_only=True)
    ws = wb[SHEET_NAME]

    cells = []
    skipped_rows = []
    total_rows_processed = 0
    populated_cell_count = 0

    # Data rows: 14 to 73 (1-based). Row 74+ contains shadow rules.
    for row_idx_1based, row in enumerate(ws.iter_rows(min_row=14, max_row=73, values_only=True), 14):
        total_rows_processed += 1
        row = list(row)  # ensure list for indexing

        # --- Face identification (col 1, 0-indexed 0) ---
        face_raw = clean_str(row[0]) if len(row) > 0 else None
        if not face_raw:
            skipped_rows.append({
                "rowIndex": row_idx_1based,
                "reason": "Empty face column (col 1)"
            })
            continue

        face_id, face_name = parse_face_id(face_raw)
        if face_id is None:
            skipped_rows.append({
                "rowIndex": row_idx_1based,
                "reason": f"Unrecognised face: {face_raw!r}"
            })
            continue

        # --- Extract each octave block ---
        for oct_def, col_start in zip(OCTAVE_DEFS, OCTAVE_COL_STARTS):
            oct_id, oct_theme_canonical, oct_focus = oct_def

            # Safe column access helper
            def col(offset):
                idx = col_start + offset
                return row[idx] if idx < len(row) else None

            theme_raw    = clean_str(col(0))   # octave theme from sheet header/data
            element_raw  = clean_str(col(1))
            question_raw = col(2)               # preserve verbatim, just strip None
            kpi_raw      = clean_str(col(3))
            direction_raw = col(4)
            value_raw    = col(5)

            # If the entire block is empty, skip silently (not counted as error)
            if all(v is None for v in [theme_raw, element_raw, question_raw, kpi_raw, direction_raw, value_raw]):
                skipped_rows.append({
                    "rowIndex": row_idx_1based,
                    "octaveId": oct_id,
                    "reason": "Entire octave block empty"
                })
                continue

            # Validate element
            if element_raw not in VALID_ELEMENTS:
                skipped_rows.append({
                    "rowIndex": row_idx_1based,
                    "octaveId": oct_id,
                    "reason": f"Invalid element value: {element_raw!r} (must be Earth/Water/Fire/Air/Ether)"
                })
                continue

            # Normalize direction
            direction = parse_direction(direction_raw)
            if direction is None and direction_raw is not None:
                # Direction present but unrecognised — still include with null direction
                direction = None
                skipped_rows.append({
                    "rowIndex": row_idx_1based,
                    "octaveId": oct_id,
                    "reason": f"Unrecognised direction: {direction_raw!r}"
                })
                # We still include the record (direction = null)

            # Octave theme: prefer the canonical name, use sheet value as override if present
            octave_theme = oct_theme_canonical  # e.g. "Survival"

            # Value
            value = parse_value(value_raw)

            # Verbatim question
            question = str(question_raw).replace("\xa0", " ").strip() if question_raw is not None else None

            populated_cell_count += 1
            cells.append({
                "faceId": face_id,
                "faceName": face_name,
                "octaveId": oct_id,
                "octaveTheme": octave_theme,
                "element": element_raw,
                "question": question,
                "kpiName": kpi_raw,
                "direction": direction,
                "value": value,
                "sourceRowIndex": row_idx_1based,
            })

    wb.close()

    output = {
        "$schema": "refrence_models_extracted/v1",
        "$source": "SpiralDASHBOARD-Leading_V2.xlsx REFRENCE_MODELS sheet",
        "$extractedAt": datetime.now(timezone.utc).isoformat(),
        "$sourceSheetDimensions": {"rows": 128, "cols": 79},
        "$populatedCellCount": populated_cell_count,
        "$totalCellTarget": 420,
        "$skippedRows": skipped_rows,
        "cells": cells,
    }

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    return output, populated_cell_count, skipped_rows


if __name__ == "__main__":
    import sys
    sys.stdout.reconfigure(encoding="utf-8")
    print("Extracting REFRENCE_MODELS 420-cell model...")
    output, populated, skipped = extract()
    print(f"Done.")
    print(f"  Populated cells extracted: {populated}")
    print(f"  Skipped row/block entries: {len(skipped)}")
    print(f"  Output: {OUTPUT_PATH}")
    if output["cells"]:
        print("\nFirst 3 cells:")
        for c in output["cells"][:3]:
            print(f"  {c}")
    # Verify JSON round-trip
    import os
    size_kb = os.path.getsize(OUTPUT_PATH) / 1024
    print(f"\nFile size: {size_kb:.1f} KB")
    with open(OUTPUT_PATH, "r", encoding="utf-8") as f:
        reloaded = json.load(f)
    print(f"JSON round-trip OK — {len(reloaded['cells'])} cells reloaded.")
    # Report any skips (first 10)
    if skipped:
        print(f"\nFirst 10 skipped entries:")
        for s in skipped[:10]:
            print(f"  {s}")
