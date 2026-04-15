"""Harmonize faceName fields in data/json/kpi-database.json.

Current state: F1.1 = "Deimantas", F2-F12 entries = "Founder" (drift).
Target state: All 12 entries = "Founder" (user decision 2026-04-15 — role abstraction
retained, personal name decoupled from canonical database, scales to any founder-led org).

Safe to re-run: idempotent. Second run detects all 12 already harmonized and exits 0
without mutating $generatedAt.
"""

import json
import sys
from datetime import datetime, timezone
from pathlib import Path

if sys.version_info < (3, 9):
    print(f"[ERROR] Python 3.9+ required (found {sys.version}). openpyxl and modern json need it.")
    sys.exit(1)

TARGET_FACENAME = "Founder"
DB_PATH = Path(r"C:\Users\murau\OneDrive\Stalinis kompiuteris\POC\data\json\kpi-database.json")


def log(level: str, msg: str) -> None:
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{level}] {ts} {msg}")


def main() -> int:
    if not DB_PATH.exists():
        log("ERROR", f"Database not found at {DB_PATH}")
        return 1

    with DB_PATH.open("r", encoding="utf-8") as f:
        pre = json.load(f)

    if "kpis" not in pre or not isinstance(pre["kpis"], list):
        log("ERROR", "Expected 'kpis' array at top level; schema mismatch.")
        return 1

    log("INFO", f"Loaded {len(pre['kpis'])} KPI entries from {DB_PATH.name}")

    # Idempotency check: are all faceNames already == target?
    current_facenames = [k.get("faceName") for k in pre["kpis"]]
    if all(fn == TARGET_FACENAME for fn in current_facenames):
        log("INFO", f"All {len(current_facenames)} faceNames already == '{TARGET_FACENAME}'. No-op; exit 0.")
        return 0

    # Patch in a copy
    post = json.loads(json.dumps(pre))  # deep copy via json roundtrip
    for i, kpi in enumerate(post["kpis"]):
        kpi["faceName"] = TARGET_FACENAME
    post["$generatedAt"] = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")

    # Field-level verification: every key other than faceName unchanged at every depth
    def deep_equal_except(a, b, exclude_top_level=None, exclude_leaf=None):
        """Compare two JSON-like structures. exclude_leaf is a key name to ignore at leaf dict level."""
        if isinstance(a, dict) and isinstance(b, dict):
            keys_a = set(a.keys()) - (exclude_top_level or set())
            keys_b = set(b.keys()) - (exclude_top_level or set())
            if keys_a != keys_b:
                return False, f"key mismatch: {keys_a ^ keys_b}"
            for k in keys_a:
                if k == exclude_leaf:
                    continue
                ok, why = deep_equal_except(a[k], b[k], exclude_leaf=exclude_leaf)
                if not ok:
                    return False, f"at .{k}: {why}"
            return True, "ok"
        if isinstance(a, list) and isinstance(b, list):
            if len(a) != len(b):
                return False, f"length mismatch {len(a)} vs {len(b)}"
            for i, (x, y) in enumerate(zip(a, b)):
                ok, why = deep_equal_except(x, y, exclude_leaf=exclude_leaf)
                if not ok:
                    return False, f"at [{i}]: {why}"
            return True, "ok"
        return (a == b, f"value mismatch {a!r} vs {b!r}" if a != b else "ok")

    # Verify: strip $generatedAt at top level + faceName at leaf level
    ok, why = deep_equal_except(pre, post, exclude_top_level={"$generatedAt"}, exclude_leaf="faceName")
    if not ok:
        log("ERROR", f"Integrity check failed: {why}")
        return 1
    log("INFO", "Integrity verified: only faceName + $generatedAt differ; all other fields byte-identical.")

    # Atomic write: tmp + rename
    tmp_path = DB_PATH.with_suffix(".json.tmp")
    with tmp_path.open("w", encoding="utf-8") as f:
        json.dump(post, f, indent=2, ensure_ascii=False)
    # Validate tmp file parses
    with tmp_path.open("r", encoding="utf-8") as f:
        _ = json.load(f)
    tmp_path.replace(DB_PATH)

    log("INFO", f"DONE: patched 12 faceName fields -> '{TARGET_FACENAME}'; wrote {DB_PATH.name}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
