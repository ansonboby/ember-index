# Ember Index — NASA Space Apps 2026 Final Submission Package

**Challenge:** Flame in Freefall: SI-Powered Fire Safety Insights from Microgravity Combustion Data
**Project:** Ember Index — Fire Safety Decisions for the Next Giant Leap

> ⚠️ **Before you paste anything:** every feature described below must actually exist in the pushed repo by submission day. Judges click links. Anything marked `[FILL]` is yours to complete.

---

## 0. Manual checklist (only you can do these)

- [x] Team registered on spaceappschallenge.org; "Flame in Freefall" selected as the challenge — *confirm your region's deadline*
- [x] Repo pushed to GitHub → https://github.com/ansonboby/ember-index
- [x] App deployed → https://ember-index.vercel.app
- [x] PSI verification pass (record-level: IDs, DOIs, PIs, hardware, objectives)
- [ ] Record the 3-min demo using `VIDEO-SCRIPT.md` → upload to YouTube/Vimeo (public) → paste URL into §6
- [ ] Real LLM key in `.env` (Vercel env vars) if you want Ask-the-SI live in the demo (app works without it)
- [ ] Request PSI workspace access to verify test-matrix-level O₂/flow values (access-restricted files)
- [ ] Paste §1–§8 into the project form; add team members in the platform

## 1. Project Title

```
Ember Index: Fire Safety Decisions for the Next Giant Leap
```

## 2. Summary

Short (≈270 chars — fits the tweet-length summary field):

```
Ember Index maps NASA's microgravity combustion data onto the atmospheres crews will
actually breathe — ISS, Moon base, rover, spacesuit — ranking PSI investigations for
prevention, detection & suppression, flagging data gaps, and letting you play Crew
Safety Officer.
```

Full-length (if the field allows a paragraph):

```
Fire safety in spacecraft is a prevention–detection–suppression problem, and NASA has
two decades of microgravity combustion evidence for it — scattered across dozens of
experiments run at different oxygen concentrations, pressures and flow rates. Ember
Index is an SI-powered dashboard that translates that evidence into decisions: pick the
environment you will actually fly (ISS, Lunar-surface base, pressurized rover, spacesuit,
or Mars transit) and the tool re-ranks every relevant PSI investigation against your
mission with a fully transparent, adjustable scoring engine, plots all tested conditions
on an oxygen–pressure envelope chart with your mission band overlaid, and narrates
plain-language findings and data gaps — from "no partial-gravity combustion data until
LUCI and FM2 fly" to "only CFI-G reached 85% oxygen, and only for gaseous fuels." A
playable Crew Safety Officer simulator turns the same dataset into a game: budget your
materials, detection and suppression choices against the flammability the data predicts,
and the SI explains each outcome with its source experiment. Every claim links to its
PSI investigation.
```

## 3. How We Addressed This Challenge

**The problem.** NASA's microgravity combustion results live in the Physical Science
Informatics (PSI) database, and the volume makes them hard to find, harder to compare,
and hardest to interpret. BASS and BASS-II burned solid samples at one set of conditions;
Saffire-I/II/III burned large samples in free flight; FLEX and FLEX-2 burned droplets;
CFI-G pushed oxygen up to 85% for gas fuels; SAME and SAME-R flew smoke detectors; SPICE,
SLICE and BRE filled in flames and flammability limits. Each experiment tested its own
slice of parameter space. None of them tested "the Moon Base atmosphere" directly — and
that is exactly the atmosphere NASA plans to live in (≥30% oxygen at ≤10.2 psi, more than
40% richer in oxygen than Earth's).

**Our answer: mission-profile mode.** Ember Index is a translator between NASA's data and
the environments crews will actually occupy. The user picks a mission profile — ISS,
Lunar-surface base, pressurized rover, spacesuit (100% O₂ at 4.3 psi), or Mars transit —
or dials a custom atmosphere, and the entire dashboard re-ranks the PSI investigations
against that environment.

**Transparent, explainable ranking (the "SI").** The ranking engine scores each
investigation on: (1) overlap between the conditions it tested and the target mission's
oxygen–pressure envelope, (2) relevance of its fuels and materials to spacecraft
interiors, (3) its contribution to the fire-safety pillars of prevention, detection and
suppression, and (4) the recency and scale of its campaign. Every weight is a visible
slider; every card shows its own score breakdown, so the ranking is an auditable map of
the evidence — never a black box. A rule-based insight layer generates plain-language
findings and gap statements from the same attributes, and an optional LLM chat ("Ask the
SI") answers questions over the dataset; the app is fully functional without the key.

**The envelope chart.** Every tested condition across all investigations is plotted as a
dot in oxygen–pressure space, with each mission profile overlaid as a shaded band. At one
glance judges and researchers see where the evidence is dense, and where the white gaps
are — the visual argument for flying LUCI and FM².

**Play the problem: Crew Safety Officer.** The same dataset powers a simulator. You set
your mission's atmosphere (the real tradeoff: higher oxygen shortens pre-breathe for EVA
but makes everything ignite easier), then spend a budget on materials, detection and
suppression drawn from the PSI-ranked catalog. The event engine rolls ignition and
suppression outcomes from rules derived directly from the data — BASS for solid
flammability limits, FLEX for suppressant effectiveness, SAME for how smoke detectors
behave in microgravity — and each rule carries its citation and an explicit "illustrative"
label. The SI narrates what happened and which experiment predicted it. The end screen
grades your safety case.

**Beyond spacecraft.** An Earth-applications section tracks the spin-offs the challenge
brief highlights: fine-water-mist extinguishers developed for the ISS, improved smoke
detection, and firefighter protective gear.

**Audience.** Aerospace researchers and engineers (evidence ranking + envelope charts),
professors and graduate students (comparable experiment attributes), and undergraduates
(the simulator teaches the atmosphere–flammability tradeoff in one playthrough). We state
plainly on the About page: Ember Index is decision support built on published results —
not a validated combustion model.

## 4. How We Used Data and Resources

- **Primary source — NASA PSI database.** We hand-curated the attributes of every
  combustion investigation relevant to fire safety (~16 campaigns): objectives, fuels and
  sample geometry, oxygen concentration ranges, pressures, flow conditions, gravity
  levels, hardware (CIR/ACME, CIR/MDCA, MSG with the SPICE flow duct), sensor types,
  platform and years, and each investigation's fire-safety pillar. The dataset is a
  single source-of-truth module in the repo, with each attribute traced to its PSI page.
- **Verification protocol.** For every investigation we opened its PSI record and Task
  Book entries and confirmed attributes field-by-field; the About page states the method
  and any fields still marked unverified.
- **Challenge resources** (Resources tab) supplied the mission-environment assumptions
  (spacesuit 100% O₂ / 4.3 psi; Moon Base ≥30% O₂ / ≤10.2 psi) and hardware genealogy
  (ACME hardware in the CIR; MDCA; SPICE duct in the MSG).
- **PSI search API** (`/physci/repo/search`) was probed for automated metadata enrichment;
  if unavailable, curation stays manual — reliability over cleverness.

## 5. Space Agency Data Used

All data is NASA open data from the Physical Sciences division:

- **NASA Physical Science Informatics (PSI) database** — https://psi.nasa.gov
  - Investigations used (PSI accession · DOI, all verified against PSI records via its API):
    BASS (PSI-26 · 10.60555/58h4-dy80), BASS-II (PSI-25 · 10.60555/4qc4-de67),
    Saffire-I (PSI-98 · 10.60555/0t15-1z43), Saffire-II (PSI-99 · 10.60555/2chp-m469),
    Saffire-III (PSI-100 · 10.60555/040q-4h36), SAME (PSI-102 · 10.60555/gd4k-8h62),
    SAME-R (PSI-101 · 10.60555/2np7-jv14), FLEX (PSI-69 · 10.60555/mbq8-0451),
    FLEX-2 (PSI-68 · 10.60555/byp8-h018), CFI (PSI-39 · 10.60555/m6pj-a914),
    CFI-G (PSI-159 · 10.60555/cyt1-kh64), BRE (PSI-20 · 10.60555/vb93-3y72),
    SPICE (PSI-107 · 10.60555/9kbh-e962), SLICE (PSI-106 · 10.60555/pm12-rg61),
    E-FIELD Flames (PSI-22 · 10.60555/se5a-8c73), DAFT/DAFT-2 (PSI-47 · 10.60555/ztgj-d202).
  - LUCI and FM² referenced as future partial-gravity data (verified absent from PSI as of Nov 2026).
- **NASA Task Book** — https://taskbook.nasa.gov (project reports used to cross-check
  objectives and hardware descriptions)
- **NASA BPS data portal** — https://science.nasa.gov/biological-physical/data/
- **Challenge Resources tab** — mission-environment figures and imagery (Saffire)

## 6. References and Additional Links

| Item | URL |
|---|---|
| Project repository | https://github.com/ansonboby/ember-index |
| Live application | https://ember-index.vercel.app |
| Demo video (≤3 min) | `[FILL: VIDEO_URL — record using VIDEO-SCRIPT.md]` |
| Data provenance & verification method | `REPO_URL/README.md` (§ Data provenance) |
| Project strategy doc | `REPO_URL/STRATEGY.md` |

## 7. Demo Video

- Length: ≤3:00 (Space Apps requirement for Global judging), public link, captions on.
- Script, shot list and pre-seeded demo state: see `VIDEO-SCRIPT.md`.

## 8. Project Tags

`fire-safety` `combustion` `microgravity` `flammability` `PSI` `ISS` `Artemis` `Moon` `Mars` `dashboard` `SI` `open-data`

## 9. For Local Judges: Criteria Mapping

| Criterion | Where we score it |
|---|---|
| Impact | Mission-profile ranking answers real material/detection/suppression decisions; Earth spin-offs section |
| Creativity | Mission-profile mode; playable Crew Safety Officer simulator built from the same dataset |
| Validity | Every attribute cites its PSI record; illustrative game rules labeled; About page states method and limits |
| Relevance | Built directly on the investigations named in the challenge brief, plus DAFT/-2 and hardware genealogy |
| Presentation | 3-min scripted demo, pre-seeded states, envelope-chart money shot |

## 10. Team

`[FILL: names, roles, city, team registration ID]`
