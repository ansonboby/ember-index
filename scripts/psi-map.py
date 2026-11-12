#!/usr/bin/env python3
"""Map each Ember Index investigation to its PSI accession + verify key fields.
One-shot script; prints a mapping table for updating the dataset."""
import json, subprocess, urllib.parse, sys

ACRONYMS = [
    "Burning and Suppression of Solids",        # BASS, BASS-II
    "Spacecraft Fire Safety Demonstration",     # Saffire I/II/III
    "Smoke and Aerosol Measurement",            # SAME, SAME-R
    "Flame Extinguishment",                     # FLEX, FLEX-2
    "Cool Flames",                              # CFI, CFI-G
    "Burning Rate Emulator",                    # BRE
    "Smoke Point",                              # SPICE
    "Structure and Liftoff",                    # SLICE
    "Electric-Field",                           # E-FIELD
    "Dust and Aerosol Measurement",             # DAFT, DAFT-2
    "Lunar",                                    # LUCI
    "Flammability of Materials",                # FM2
]

def search(term):
    url = "https://psi.nasa.gov/geode-py/ws/repo/search?term=%s&source=psi&type=investigation&size=50" % urllib.parse.quote(term)
    out = subprocess.run(["curl", "-s", "-m", "30", url], capture_output=True, text=True).stdout
    try:
        return json.loads(out)["hits"]["hits"]
    except Exception:
        return []

for term in ACRONYMS:
    print("=" * 70)
    print("TERM:", term)
    for h in search(term):
        s = h["_source"]
        acc = s.get("Accession", "?")
        acr = (s.get("Acronym") or "").strip()
        title = (s.get("Title") or "")[:80]
        area = s.get("SubResearch Area", "")
        plat = s.get("Flight Platform", "")
        rel = s.get("Public Release Date")
        print(f"  {acc:8} acr={acr!r:24} platform={plat!r:12} area={area!r:24} title={title}")
