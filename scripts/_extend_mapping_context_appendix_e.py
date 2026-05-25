"""
Phase A — Extend mapping-context.json with appendixEClusterName + iircAnchor fields.

Per Lock #8.39 (Naming-Convention Single-Source-of-Truth):
- Source-of-truth for CEN-Authentic Cluster Names: Appendix E §E.3.1 (lines 75-90)
  at Final Thesis/.../Appendix E - LEADING.md
- Source-of-truth for IIRC Anchor mappings: Appendix E §E.3.1 (line 71) declares
  six-plus-six canonical architecture: F1+F2+F3+F4+F6+F9 = IIRC universal capitals;
  F5+F7+F8+F10+F11+F12 = CEN-authentic polarities
- F4 IIRC = "Manufactured Capital" adapted to "Structural Capital" for CEN
- F6 IIRC = "Social and Relationship Capital" aliased to "Community Capital"
- F9 IIRC = "Natural Capital" (anchored by Cluster 6 Ecological Embedding)

CEN gets canonical Appendix E values. Other companies (apex-industries, nova-tech,
quannex, zenith-solutions) get null for appendixEClusterName (pending their own
equivalent of Appendix E) AND inherit the same IIRC anchor mapping (it's a
methodological constant from the dodecahedron's structure, not CEN-specific).

Atomic write via _staging.json + Path.replace() per Never Delete Rule.
"""
import json
from pathlib import Path
import shutil

# Per F-face number, mapped from Appendix E §E.3.1 Cluster table:
# - F1 → Cluster 1 (Three-Pillar Sustainability, anchor: Financial Capital)
# - F2 → Cluster 3 (Programs Engine, anchor: Intellectual Capital)
# - F3 → Cluster 4 (Team and Energy, anchor: Human Capital)
# - F4 → Cluster 2 (Operational Discipline, anchor: Structural Capital ≈ Manufactured)
# - F5 → Cluster 9 (Coaching Market Fit, anchor: Market Resonance — polarity)
# - F6 → Cluster 5 (Membership Belonging, anchor: Community Capital ≈ Social & Relationship)
# - F7 → Cluster 8 (Field Voice, anchor: Brand and Reputation — polarity)
# - F8 → Cluster 12 (Field-Shaping Aspiration, anchor: Core Operations — polarity)
# - F9 → Cluster 6 (Ecological Embedding, anchor: Natural Capital)
# - F10 → Cluster 7 (Conscious-Leadership Identity, anchor: Foundational Values — polarity)
# - F11 → Cluster 10 (Funding Inflow, anchor: Funding Pipeline — polarity)
# - F12 → Cluster 11 (Compliance and Continuity, anchor: Risk and Resilience — polarity)

CEN_APPENDIX_E_CLUSTER_NAMES = {
    1: "Three-Pillar Sustainability",
    2: "Programs Engine",
    3: "Team and Energy",
    4: "Operational Discipline",
    5: "Coaching Market Fit",
    6: "Membership Belonging",
    7: "Field Voice",
    8: "Field-Shaping Aspiration",
    9: "Ecological Embedding",
    10: "Conscious-Leadership Identity",
    11: "Funding Inflow",
    12: "Compliance and Continuity",
}

# IIRC anchor mapping is methodologically constant (from dodecahedron's structure),
# inherited by all companies. NOT CEN-specific.
IIRC_ANCHOR_BY_FACE = {
    1: "Financial Capital",
    2: "Intellectual Capital",
    3: "Human Capital",
    4: "Manufactured Capital (adapted to Structural Capital for CEN organisational form)",
    5: None,  # polarity, not IIRC capital
    6: "Social and Relationship Capital (aliased to Community Capital where appropriate)",
    7: None,  # polarity
    8: None,  # polarity
    9: "Natural Capital",
    10: None,  # polarity
    11: None,  # polarity
    12: None,  # polarity
}

# Six-plus-six architecture flag per face (Appendix E §E.3.1 line 71)
ARCHITECTURE_LAYER_BY_FACE = {
    1: "IIRC universal capital",
    2: "IIRC universal capital",
    3: "IIRC universal capital",
    4: "IIRC universal capital",
    5: "Organisation-authentic polarity",
    6: "IIRC universal capital",
    7: "Organisation-authentic polarity",
    8: "Organisation-authentic polarity",
    9: "IIRC universal capital",
    10: "Organisation-authentic polarity",
    11: "Organisation-authentic polarity",
    12: "Organisation-authentic polarity",
}

# Provenance metadata added at root level per company
PROVENANCE_NOTE_CEN = (
    "Lock #8.39 (Naming-Convention SSOT): appendixEClusterName values for CEN "
    "are sourced from Final Thesis/Thesis Work/Assignments/Research/Assignment "
    "Research Parts Reports - Chapters/Appendix E/Appendix E - LEADING.md "
    "§E.3.1 lines 75-90 (six-plus-six canonical architecture). iircAnchor + "
    "architectureLayer values are methodologically-constant from the "
    "dodecahedron's structure (Appendix E line 71)."
)

PROVENANCE_NOTE_OTHER = (
    "Lock #8.39 (Naming-Convention SSOT): appendixEClusterName values for this "
    "company are PENDING — no Appendix E equivalent has been authored yet for "
    "this organisation. iircAnchor + architectureLayer are inherited "
    "methodological constants from the dodecahedron's structure (per CEN's "
    "Appendix E line 71)."
)


def extend_company(company_dir: Path, company_id: str) -> dict:
    """Extend mapping-context.json for one company. Atomic write."""
    src = company_dir / "mapping-context.json"
    if not src.exists():
        return {"company_id": company_id, "status": "skipped", "reason": "no mapping-context.json"}

    data = json.loads(src.read_text(encoding="utf-8"))

    if "faces" not in data or not isinstance(data["faces"], list):
        return {"company_id": company_id, "status": "skipped", "reason": "no faces array"}

    is_cen = company_id == "cen"
    cluster_source = CEN_APPENDIX_E_CLUSTER_NAMES if is_cen else None

    # Add new fields per face
    for face in data["faces"]:
        fid = face.get("id")
        if fid is None or fid not in IIRC_ANCHOR_BY_FACE:
            continue

        # Insert appendixEClusterName (CEN canonical; null/placeholder for others)
        if is_cen:
            face["appendixEClusterName"] = cluster_source[fid]
        else:
            # Preserve existing value if present; otherwise None
            face.setdefault("appendixEClusterName", None)

        # iircAnchor + architectureLayer are methodological constants (inherited)
        face["iircAnchor"] = IIRC_ANCHOR_BY_FACE[fid]
        face["architectureLayer"] = ARCHITECTURE_LAYER_BY_FACE[fid]

    # Add provenance note at root level (idempotent)
    if "lock_8_39_naming_provenance" not in data:
        data["lock_8_39_naming_provenance"] = (
            PROVENANCE_NOTE_CEN if is_cen else PROVENANCE_NOTE_OTHER
        )

    # Atomic write via _staging.json
    staging = src.with_name(src.stem + "_staging.json")
    staging.write_text(
        json.dumps(data, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    staging.replace(src)

    return {
        "company_id": company_id,
        "status": "updated",
        "is_cen": is_cen,
        "faces_extended": len(data["faces"]),
    }


def main():
    companies_root = Path(__file__).resolve().parent.parent / "companies"
    companies = sorted(d.name for d in companies_root.iterdir() if d.is_dir())

    print(f"Found {len(companies)} companies: {companies}")
    print()

    results = []
    for company_id in companies:
        company_dir = companies_root / company_id
        result = extend_company(company_dir, company_id)
        results.append(result)
        flag = "[CEN canonical]" if result.get("is_cen") else "[null placeholder]"
        if result["status"] == "updated":
            print(f"  OK    {company_id:24s} {flag} faces_extended={result['faces_extended']}")
        else:
            print(f"  SKIP  {company_id:24s} reason={result.get('reason')}")

    print()
    print("Verification (read-back of CEN F1):")
    cen_data = json.loads((companies_root / "cen" / "mapping-context.json").read_text(encoding="utf-8"))
    f1 = next(f for f in cen_data["faces"] if f.get("id") == 1)
    print(f"  F1 baseName               = {f1.get('baseName')}")
    print(f"  F1 customName             = {f1.get('customName')}")
    print(f"  F1 appendixEClusterName   = {f1.get('appendixEClusterName')}")
    print(f"  F1 iircAnchor             = {f1.get('iircAnchor')}")
    print(f"  F1 architectureLayer      = {f1.get('architectureLayer')}")


if __name__ == "__main__":
    main()
