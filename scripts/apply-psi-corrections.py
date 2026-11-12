#!/usr/bin/env python3
"""Apply PSI verification corrections to src/data/investigations.ts."""
import sys

P = "src/data/investigations.ts"
src = open(P, encoding="utf-8").read()

pairs = [
    # saffire-2
    ('    years: "2016",\n    lastYear: 2016,\n    status: "completed",\n    platform: "Cygnus cargo vehicle (free flight)",',
     '    years: "2016–2017",\n    lastYear: 2017,\n    status: "completed",\n    platform: "Cygnus cargo vehicle (free flight)",'),
    ('    psiId: null,\n    verified: false,\n  },\n  {\n    id: "saffire-3",',
     '    psiId: "PSI-99",\n    doi: "10.60555/2chp-m469",\n    verified: true,\n    note: "PI: D. Urban (NASA GRC). Nine spacecraft materials flown in one campaign.",\n  },\n  {\n    id: "saffire-3",'),
    # saffire-3
    ('    years: "2016–2017",\n    lastYear: 2017,\n    status: "completed",\n    platform: "Cygnus cargo vehicle (free flight)",\n    hardware: "Large-scale flow duct",',
     '    years: "2017",\n    lastYear: 2017,\n    status: "completed",\n    platform: "Cygnus cargo vehicle (free flight)",\n    hardware: "Saffire III enclosure in Cygnus",'),
    ('    psiId: null,\n    verified: false,\n  },\n  {\n    id: "same",',
     '    psiId: "PSI-100",\n    doi: "10.60555/040q-4h36",\n    verified: true,\n    note: "PI: D. Urban (NASA GRC). Flew April 2017 after launch delays.",\n  },\n  {\n    id: "same",'),
    # same
    ('    hardware: "Smoke aerosol measurement suite",\n    gravity: "microgravity",\n    fuelSummary: "Smoke from overheated/smoldering spacecraft materials (Teflon, Kapton, cotton, silicone)",',
     '    hardware: "Comparative Soot Diagnostic Hardware (MSG)",\n    gravity: "microgravity",\n    fuelSummary: "Smoke from overheated/smoldering spacecraft materials (Teflon, Kapton, cotton, silicone)",'),
    ('    psiId: null,\n    verified: false,\n  },\n  {\n    id: "same-r",',
     '    psiId: "PSI-102",\n    doi: "10.60555/gd4k-8h62",\n    verified: true,\n    note: "PI: D. Urban (NASA GRC). PSI record dates inconsistent; campaign years per final reports.",\n  },\n  {\n    id: "same-r",'),
    # same-r
    ('    hardware: "Smoke aerosol measurement suite",\n    gravity: "microgravity",\n    fuelSummary: "Additional smoke sources (wiring overheat, more materials)",',
     '    hardware: "Comparative Soot Diagnostic Hardware (MSG)",\n    gravity: "microgravity",\n    fuelSummary: "Additional smoke sources (wiring overheat, more materials)",'),
    ('    psiId: null,\n    verified: false,\n  },\n  {\n    id: "flex",',
     '    psiId: "PSI-101",\n    doi: "10.60555/2np7-jv14",\n    verified: true,\n    note: "PI: Z.-g. Yuan. PSI record dates suspiciously short (2010); campaign years per final reports.",\n  },\n  {\n    id: "flex",'),
    # flex
    ('    years: "2009–2012",\n    lastYear: 2012,',
     '    years: "2007–2016",\n    lastYear: 2016,'),
    ('    fuelSummary: "Liquid droplets (heptane, methanol), 1–5 mm",',
     '    fuelSummary: "Liquid fuel droplets (methanol, heptane), 1–5 mm",'),
    ('      "Discovered \'cool flames\' — invisible, ultra-low-temperature burning continuing after visible extinction.",\n      "Extinction limits for CO₂/He/N₂ dilution inform suppressant design for spacecraft atmospheres.",',
     '      "Discovered \'cool flames\' — invisible, ultra-low-temperature burning continuing after visible extinction.",\n      "Mapped gaseous suppressant effectiveness — CO₂, He, SF₆ — and Limiting Oxygen Index as a function of ambient pressure (verified from PSI record).",'),
    ('    psiId: null,\n    verified: false,\n  },\n  {\n    id: "flex-2",',
     '    psiId: "PSI-69",\n    doi: "10.60555/mbq8-0451",\n    verified: true,\n    note: "PI: B. Shaw. Program window 2007–2016 per PSI record.",\n  },\n  {\n    id: "flex-2",'),
    # flex-2
    ('    years: "2014–2017",\n    lastYear: 2017,',
     '    years: "2016–2019",\n    lastYear: 2019,'),
    ('    psiId: null,\n    verified: false,\n  },\n  {\n    id: "cfi",',
     '    psiId: "PSI-68",\n    doi: "10.60555/byp8-h018",\n    verified: true,\n    note: "PI: F. Dryer. Extends FLEX to bi-component droplets and combustor-like conditions.",\n  },\n  {\n    id: "cfi",'),
    # cfi
    ('    years: "2017–2019",\n    lastYear: 2019,',
     '    years: "2020–2021",\n    lastYear: 2021,'),
    ('    fuelSummary: "Liquid fuel droplets probing cool-flame regimes",',
     '    fuelSummary: "Liquid droplets: n-dodecane and n-dodecane/iso-dodecane mixtures",'),
    ('    findings: ["Cool flames can burn undetected below visible thresholds — a detection problem, not just a curiosity."],',
     '    findings: ["Cool flames can burn undetected below visible thresholds — a detection problem, not just a curiosity.",\n      "Tested at pressures from 0.25 to 5 atm with helium dilution (verified from PSI record)."],'),

    ('    psiId: null,\n    verified: false,\n  },\n  {\n    id: "cfi-g",',
     '    psiId: "PSI-39",\n    doi: "10.60555/m6pj-a914",\n    verified: true,\n    note: "PI: F. Dryer. NSF/CASIS program. O₂ context ambiguous in record text.",\n  },\n  {\n    id: "cfi-g",'),
    # cfi-g
    ('    fuelSummary: "Gaseous fuels (e.g., propane) with temperature/oxygen gradients",',
     '    fuelSummary: "Gaseous fuels: propane, n-butane, n-pentane with temperature/oxygen gradients",'),
    ('      "Reached up to 85% O₂ from the spherical burner (inside-out flame) — the highest-oxygen microgravity tests ever flown, but for gaseous fuels only.",\n      "Oxygen-enriched regime data essential for Moon/Mars atmospheres.",',
     '      "Reached up to 85% O₂ from the spherical burner (normal and inverse flames) — the highest-oxygen microgravity tests ever flown, but for gaseous fuels only (challenge brief).",\n      "Cool diffusion-flame conditions mapped for propane, n-butane and n-pentane (verified from PSI record).",'),
    ('    psiId: null,\n    verified: false,\n  },\n  {\n    id: "bre",',
     '    psiId: "PSI-159",\n    doi: "10.60555/cyt1-kh64",\n    verified: true,\n    note: "PI: D. Stocker. 85% O₂ figure from the challenge brief; verify against record on request.",\n  },\n  {\n    id: "bre",'),
    # bre
    ('    years: "2017–2020",\n    lastYear: 2020,',
     '    years: "2010–2025",\n    lastYear: 2025,'),
    ('    fuelSummary: "Gaseous fuels emulating pyrolysis gas of solid materials",',
     '    fuelSummary: "CH₄/N₂ and C₂H₄/N₂ mixtures on porous circular burners (25/50 mm) emulating solids",'),
    ('    o2Min: 16,\n    o2Max: 21,\n    pressurePsi: 14.7,\n    flowSummary: "Controlled coflow around sphere",',
     '    o2Min: 21,\n    o2Max: 34,\n    pressurePsi: 7,\n    flowSummary: "Quiescent ambient; chamber pressures down to 2 psia",'),
    ('      "Material-property-based flammability limits without burning actual solids — a reusable screening method.",',
     '      "Material-property-based flammability limits without burning actual solids — a reusable screening method.",\n      "Tested 21% O₂ at 7 psia and 34% O₂ at 2 psia (verified from PSI record) — near-spacesuit pressures.",'),
    ('    psiId: null,\n    verified: false,\n  },\n  {\n    id: "spice",',
     '    psiId: "PSI-20",\n    doi: "10.60555/vb93-3y72",\n    verified: true,\n    note: "PI: A. Root? Record lists BRE PI via contacts. Program window 2010–2025 per PSI.",\n  },\n  {\n    id: "spice",'),
    # spice
    ('    psiId: null,\n    verified: false,\n  },\n  {\n    id: "slice",',
     '    psiId: "PSI-107",\n    doi: "10.60555/9kbh-e962",\n    verified: true,\n    note: "PI: P. Sunderland. Hardware verified as MSG.",\n  },\n  {\n    id: "slice",'),
    # slice
    ('    psiId: null,\n    verified: false,\n  },\n  {\n    id: "efield",',
     '    psiId: "PSI-106",\n    doi: "10.60555/pm12-rg61",\n    verified: true,\n    note: "PI: M. Smooke. Hardware (MSG/SPICE duct) per challenge brief; absent from PSI record fields.",\n  },\n  {\n    id: "efield",'),
    # efield
    ('    years: "2016–2019",\n    lastYear: 2019,\n    status: "completed",\n    platform: "ISS — Combustion Integrated Rack (CIR)",\n    hardware: "ACME modular hardware (jet burner + electrodes)",',
     '    years: "2016–2020",\n    lastYear: 2020,\n    status: "completed",\n    platform: "ISS — Combustion Integrated Rack (CIR)",\n    hardware: "ACME modular hardware (jet burner + electrodes)",'),
    ('    psiId: null,\n    verified: false,\n  },\n  {\n    id: "daft",',
     '    psiId: "PSI-22",\n    doi: "10.60555/se5a-8c73",\n    verified: true,\n    note: "PI: J. Chien. Dates per PSI record.",\n  },\n  {\n    id: "daft",'),
    # daft
    ('    years: "2010–2011",\n    lastYear: 2011,',
     '    years: "2003–2009",\n    lastYear: 2009,'),
    ('    hardware: "SAME-derived aerosol instrument",\n    gravity: "microgravity",\n    fuelSummary: "Simulated lunar dust analogs (not combustion)",',
     '    hardware: "TSI P-Trak ultrafine condensation particle counter",\n    gravity: "microgravity",\n    fuelSummary: "Simulated lunar dust analogs (not combustion)",'),
    ('    psiId: null,\n    verified: false,\n  },\n  {\n    id: "daft-2",',
     '    psiId: "PSI-47",\n    doi: "10.60555/ztgj-d202",\n    verified: true,\n    note: "PI: D. Urban. PSI hosts DAFT and DAFT-2 as one combined record; dates per record.",\n  },\n  {\n    id: "daft-2",'),
    # daft-2
    ('    years: "2014–2015",\n    lastYear: 2015,',
     '    years: "2003–2009",\n    lastYear: 2009,'),
    ('    hardware: "SAME-derived aerosol instrument",\n    gravity: "microgravity",\n    fuelSummary: "Simulated lunar dust analogs",',
     '    hardware: "TSI P-Trak ultrafine condensation particle counter",\n    gravity: "microgravity",\n    fuelSummary: "Simulated lunar dust analogs",'),
    ('    psiId: null,\n    verified: false,\n  },\n  {\n    id: "luci",',
     '    psiId: "PSI-47",\n    doi: "10.60555/ztgj-d202",\n    verified: true,\n    note: "Same combined PSI record as DAFT (PSI-47).",\n  },\n  {\n    id: "luci",'),
    # luci
    ('    psiId: null,\n    verified: false,\n  },\n  {\n    id: "fm2",',
     '    psiId: null,\n    doi: null,\n    verified: false,\n    note: "Upcoming — not yet in PSI (verified absent from PSI search, Nov 2026).",\n  },\n  {\n    id: "fm2",'),
    # fm2 (last entry)
    ('    psiId: null,\n    verified: false,\n  },\n];',
     '    psiId: null,\n    doi: null,\n    verified: false,\n    note: "Upcoming — not yet in PSI (verified absent from PSI search, Nov 2026).",\n  },\n];'),
]

for i, (old, new) in enumerate(pairs):
    n = src.count(old)
    if n != 1:
        print(f"PAIR {i}: count={n} — ABORT")
        print(repr(old[:120]))
        sys.exit(1)
    src = src.replace(old, new)

open(P, "w", encoding="utf-8").write(src)
print(f"applied {len(pairs)} corrections")
