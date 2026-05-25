#!/usr/bin/env python3
"""
Phase B.1b — extract 50 Bi-Directional Influence Signatures from source markdown
+ merge into octave-kpi-spec.json.

Source: POC/docs/cen-ssot/CEN_SSOT_BiDirectional_Signatures_30Edge_20Vertex_2026-05-22.md (959 lines)

Schema added per entry:
  signature10Tuple (edges) or signature15Tuple (vertices): {faceA: {earth,water,fire,air,ether}, ...}
  signatureConfidence: "HIGH" (Sections 1-2; 5 entries) or "PROPOSED" (Sections 3-4; 45 entries)
  signatureRationale: per-face rationale text from source (verbatim)
  signatureSourceSection: which section of the source doc

Verbatim-fidelity: parses source structure directly; no paraphrasing.
"""
import json
import re
from pathlib import Path

SOURCE_PATH = Path(__file__).resolve().parent.parent / "docs" / "cen-ssot" / "CEN_SSOT_BiDirectional_Signatures_30Edge_20Vertex_2026-05-22.md"
SPEC_PATH = Path(__file__).resolve().parent.parent / "companies" / "cen" / "octave-kpi-spec.json"

# Regex to match the signature table header line + extract weights row
# Pattern: | **F<N> ...** | 0.NN | 0.NN | 0.NN | 0.NN | 0.NN | 1.00 |
SIG_ROW_RE = re.compile(
    r"^\|\s*\*\*F(\d+)[^|]*\*\*\s*\|\s*(\d+\.\d+)\s*\|\s*(\d+\.\d+)\s*\|\s*(\d+\.\d+)\s*\|\s*(\d+\.\d+)\s*\|\s*(\d+\.\d+)\s*\|\s*(\d+\.\d+)\s*\|",
    re.MULTILINE
)

# Regex for entry headers: ### E1-2 Title (...) or ### V1 Title (...)
EDGE_HEADER_RE = re.compile(r"^###\s+(E\d+-\d+)\s+(.+?)$", re.MULTILINE)
VERTEX_HEADER_RE = re.compile(r"^###\s+(V\d+)\s+(.+?)$", re.MULTILINE)

# Section markers
SECTION_RE = re.compile(r"^##\s+Section\s+(\d+)", re.MULTILINE)


def parse_signatures():
    """Parse source markdown into per-entry signature data."""
    if not SOURCE_PATH.exists():
        raise FileNotFoundError(f"Source not found: {SOURCE_PATH}")

    text = SOURCE_PATH.read_text(encoding="utf-8")
    lines = text.split("\n")

    # Determine section boundaries (Section 1 = pre-validated, Section 2 = HIGH detail edges,
    # Section 3 = MEDIUM edges, Section 4 = MEDIUM vertices)
    section_starts = {}
    for m in SECTION_RE.finditer(text):
        section_starts[int(m.group(1))] = m.start()

    def get_section_for_pos(pos):
        for sec_num in sorted(section_starts.keys(), reverse=True):
            if pos >= section_starts[sec_num]:
                return sec_num
        return None

    def confidence_for_section(sec):
        if sec in (1, 2):
            return "HIGH"
        return "PROPOSED"

    # Find all entry headers (edges + vertices)
    entries = []
    for m in EDGE_HEADER_RE.finditer(text):
        entry_id = m.group(1)  # e.g. "E1-2"
        title_line = m.group(2).strip()
        entries.append({"type": "edge", "id": entry_id, "title": title_line,
                       "pos": m.start(), "section": get_section_for_pos(m.start())})
    for m in VERTEX_HEADER_RE.finditer(text):
        entry_id = m.group(1)  # e.g. "V1"
        title_line = m.group(2).strip()
        entries.append({"type": "vertex", "id": entry_id, "title": title_line,
                       "pos": m.start(), "section": get_section_for_pos(m.start())})

    entries.sort(key=lambda e: e["pos"])

    # For each entry, find its signature table rows (next 2 or 3 SIG_ROW matches after header)
    results = []
    for i, entry in enumerate(entries):
        next_pos = entries[i + 1]["pos"] if i + 1 < len(entries) else len(text)
        chunk = text[entry["pos"]:next_pos]
        sig_rows = SIG_ROW_RE.findall(chunk)
        expected_rows = 3 if entry["type"] == "vertex" else 2
        if len(sig_rows) < expected_rows:
            print(f"[WARN] {entry['id']}: only {len(sig_rows)} signature rows (expected {expected_rows})")
            continue

        # Take first N rows (sometimes there are extra tables further down)
        sig_rows = sig_rows[:expected_rows]

        # Extract rationale paragraphs (look for "**Rationale F<n>:**" patterns)
        rationale = {}
        rat_re = re.compile(r"\*\*Rationale\s+F(\d+):\*\*\s+([^*\n][^\n]*(?:\n(?!\*\*|###|---)[^\n]*)*)", re.MULTILINE)
        for rm in rat_re.finditer(chunk):
            face_id = int(rm.group(1))
            rationale[face_id] = rm.group(2).strip()
        # Fallback: shared rationale paragraph "**Rationale:** ..."
        shared_rat_re = re.compile(r"\*\*Rationale:\*\*\s+([^*\n][^\n]*(?:\n(?!\*\*|###|---)[^\n]*)*)", re.MULTILINE)
        shared_rat_match = shared_rat_re.search(chunk)
        shared_rationale = shared_rat_match.group(1).strip() if shared_rat_match else None

        # Build signature dict
        signature = {}
        for row in sig_rows:
            face_id = int(row[0])
            signature[face_id] = {
                "earth": float(row[1]),
                "water": float(row[2]),
                "fire": float(row[3]),
                "air": float(row[4]),
                "ether": float(row[5]),
                "sum": float(row[6]),
            }

        results.append({
            "id": entry["id"],
            "type": entry["type"],
            "signature": signature,
            "rationale_per_face": rationale,
            "rationale_shared": shared_rationale,
            "section": entry["section"],
            "confidence": confidence_for_section(entry["section"]),
        })

    return results


def merge_into_spec(signatures):
    """Merge parsed signatures into octave-kpi-spec.json."""
    spec = json.loads(SPEC_PATH.read_text(encoding="utf-8"))

    sig_by_id = {s["id"]: s for s in signatures}
    edges_updated = 0
    vertices_updated = 0
    deprecated_updated = 0

    for edge in spec["edges"]:
        sig = sig_by_id.get(edge["edgeId"])
        if sig:
            face_a, face_b = edge["faceA"], edge["faceB"]
            edge["signature10Tuple"] = {
                f"F{face_a}": sig["signature"].get(face_a),
                f"F{face_b}": sig["signature"].get(face_b),
            }
            edge["signatureConfidence"] = sig["confidence"]
            rationale = {}
            for fid in (face_a, face_b):
                rationale[f"F{fid}"] = sig["rationale_per_face"].get(fid)
            edge["signatureRationale"] = rationale
            if sig["rationale_shared"]:
                edge["signatureSharedRationale"] = sig["rationale_shared"]
            edge["signatureSourceSection"] = sig["section"]
            edges_updated += 1

    for vertex in spec["vertices"]:
        sig = sig_by_id.get(vertex["vertexId"])
        if sig:
            fa, fb, fc = vertex["faceA"], vertex["faceB"], vertex["faceC"]
            vertex["signature15Tuple"] = {
                f"F{fa}": sig["signature"].get(fa),
                f"F{fb}": sig["signature"].get(fb),
                f"F{fc}": sig["signature"].get(fc),
            }
            vertex["signatureConfidence"] = sig["confidence"]
            rationale = {}
            for fid in (fa, fb, fc):
                rationale[f"F{fid}"] = sig["rationale_per_face"].get(fid)
            vertex["signatureRationale"] = rationale
            if sig["rationale_shared"]:
                vertex["signatureSharedRationale"] = sig["rationale_shared"]
            vertex["signatureSourceSection"] = sig["section"]
            vertices_updated += 1

    # Deprecated entries (E7-11 only currently)
    for dep in spec.get("deprecated_entries", []):
        sig = sig_by_id.get(dep["edgeId"])
        if sig:
            face_a, face_b = dep["faceA"], dep["faceB"]
            dep["signature10Tuple"] = {
                f"F{face_a}": sig["signature"].get(face_a),
                f"F{face_b}": sig["signature"].get(face_b),
            }
            dep["signatureConfidence"] = sig["confidence"]
            rationale = {}
            for fid in (face_a, face_b):
                rationale[f"F{fid}"] = sig["rationale_per_face"].get(fid)
            dep["signatureRationale"] = rationale
            dep["signatureSourceSection"] = sig["section"]
            deprecated_updated += 1

    # Update metadata
    high = sum(1 for s in signatures if s["confidence"] == "HIGH")
    proposed = sum(1 for s in signatures if s["confidence"] == "PROPOSED")
    spec["signatures_source_document"] = (
        "POC/docs/cen-ssot/CEN_SSOT_BiDirectional_Signatures_30Edge_20Vertex_2026-05-22.md "
        "(parsed verbatim 2026-05-25 Phase B.1b)"
    )
    spec["signatures_summary"] = {
        "total_signatures": high + proposed,
        "high_confidence_count": high,
        "proposed_count": proposed,
        "high_confidence_note": (
            "HIGH = Sections 1-2 of source (pre-validated signatures with full rationale + breath-axis "
            "cross-validation). 5 HIGH entries: E7-11 (deprecated per Lock #8.36 but signature HIGH), "
            "V13 (deprecated per Lock #8.36 but signature HIGH), E2-10, E10-12, E5-8."
        ),
        "proposed_note": (
            "PROPOSED = Sections 3-4 of source (anticipatory signatures; brief rationale; no CEN KPI). "
            "If CEN later adds a KPI at these edges/vertices, the signature predicts the intervention-"
            "distribution. Per §6.7 Honest Forward-Evolution: ratification of these = post-defense "
            "CEN partnership cycle work."
        ),
    }
    spec["phase"] = "B.1b (signatures merged from BiDirectional Signatures source markdown)"

    # Atomic save
    staging = SPEC_PATH.with_suffix(".json.staging")
    with staging.open("w", encoding="utf-8") as f:
        json.dump(spec, f, indent=2, ensure_ascii=False)
        f.write("\n")
    staging.replace(SPEC_PATH)

    return edges_updated, vertices_updated, deprecated_updated


def verify_sums(signatures):
    """Validate every signature face row sums to 1.0 (±0.01 tolerance for rounding)."""
    issues = []
    for sig in signatures:
        for face_id, weights in sig["signature"].items():
            s = weights["earth"] + weights["water"] + weights["fire"] + weights["air"] + weights["ether"]
            if abs(s - 1.0) > 0.01:
                issues.append(f"{sig['id']} F{face_id}: sum = {s:.4f} (expected 1.0)")
    return issues


def main():
    print(f"[PARSE] Reading {SOURCE_PATH.name}...")
    sigs = parse_signatures()
    print(f"[OK] Parsed {len(sigs)} signatures from source")

    # Verify sums
    sum_issues = verify_sums(sigs)
    if sum_issues:
        print(f"[WARN] Sum-validation issues:")
        for i in sum_issues:
            print(f"  {i}")
    else:
        print(f"[OK] All signature face-rows sum to 1.0")

    # Breakdown
    edges = [s for s in sigs if s["type"] == "edge"]
    vertices = [s for s in sigs if s["type"] == "vertex"]
    high = [s for s in sigs if s["confidence"] == "HIGH"]
    proposed = [s for s in sigs if s["confidence"] == "PROPOSED"]
    print(f"[STATS] {len(edges)} edges + {len(vertices)} vertices")
    print(f"[STATS] {len(high)} HIGH-confidence ({', '.join(s['id'] for s in high)})")
    print(f"[STATS] {len(proposed)} PROPOSED-confidence")

    # Merge into spec
    e_upd, v_upd, d_upd = merge_into_spec(sigs)
    print(f"[OK] Merged into {SPEC_PATH.name}: {e_upd} edges + {v_upd} vertices + {d_upd} deprecated")


if __name__ == "__main__":
    main()
