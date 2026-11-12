#!/usr/bin/env python3
"""Fetch full PSI records (lowercase keys) and dump verification fields."""
import json, re, subprocess

IDS = {
    "bass": "PSI-26", "bass-ii": "PSI-25",
    "saffire-1": "PSI-98", "saffire-2": "PSI-99", "saffire-3": "PSI-100",
    "same": "PSI-102", "same-r": "PSI-101",
    "flex": "PSI-69", "flex-2": "PSI-68",
    "cfi": "PSI-39", "cfi-g": "PSI-159",
    "bre": "PSI-20", "spice": "PSI-107", "slice": "PSI-106",
    "efield": "PSI-22", "daft": "PSI-47", "daft-2": "PSI-47",
}

def fetch(acc):
    out = subprocess.run(["curl", "-s", "-m", "30",
        f"https://psi.nasa.gov/geode-py/ws/repo/investigations/{acc}"],
        capture_output=True, text=True).stdout
    try:
        j = json.loads(out)
        return j if isinstance(j, dict) else (j[0] if j else {})
    except Exception:
        return {}

def oxy_ctx(text):
    hits = []
    for m in re.finditer(r"[^.]{0,140}[Oo]xygen[^.]{0,140}\.", text or ""):
        hits.append(m.group(0).strip()[:280])
    return hits[:3]

for key in IDS:
    acc = IDS[key]
    r = fetch(acc)
    print("=" * 72)
    print(f"{key:10} {acc}  doi={r.get('doi','')}  pi={r.get('contacts',[{}])[0].get('lastName','')}")
    for field in ["experimentHardware", "experimentPlatform", "investigationStartDate",
                  "investigationEndDate", "spaceProgram", "researchArea", "subResearchArea", "keywords"]:
        v = r.get(field)
        if isinstance(v, list): v = "; ".join(str(x) for x in v)
        if v: print(f"  {field}: {str(v)[:110]}")
    obj = (r.get("objective") or "").replace("\n", " ")
    appr = (r.get("approach") or "").replace("\n", " ")
    print(f"  OBJECTIVE: {obj[:350]}")
    for h in oxy_ctx(obj + " " + appr):
        print(f"  O2>> {h}")
