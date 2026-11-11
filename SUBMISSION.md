# Ember Index — NASA Space Apps 2026 Final Submission Package

**Challenge:** Flame in Freefall: SI-Powered Fire Safety Insights from Microgravity Combustion Data
**Project:** Ember Index — Fire Safety Decisions for the Next Giant Leap

> ⚠️ **Before you paste anything:** every feature described below must actually exist in the pushed repo by submission day. Judges click links. Anything marked `[FILL]` is yours to complete.

---

## 0. Manual checklist (only you can do these)

- [ ] Team registered on spaceappschallenge.org; "Flame in Freefall" selected as the challenge
- [ ] Confirm the platform's submission window/deadline for your region
- [ ] Repo pushed to GitHub → put URL in `[REPO_URL]`
- [ ] App deployed (Vercel) → put URL in `[LIVE_URL]`
- [ ] Record the 3-min demo using `VIDEO-SCRIPT.md` → upload to YouTube/Vimeo (public) → put URL in `[VIDEO_URL]`
- [ ] Real LLM key in `.env` if you want Ask-the-SI live in the demo (app works without it)
- [ ] Data verification pass: open each PSI investigation page, confirm every attribute, fill exact PSI IDs in §5
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
  - Investigations used: BASS, BASS-II, Saffire-I, Saffire-II, Saffire-III, SAME, SAME-R,
    FLEX, FLEX-2, Cool Flames Investigation (CFI, CFI-G), Burning Rate Emulator (BRE,
    ACME), SPICE, SLICE, E-FIELD Flames (ACME), DAFT, DAFT-2; LUCI and FM² referenced as
    future partial-gravity data.
  - `[FILL: exact PSI investigation page IDs, e.g. https://psi.nasa.gov/physci/repo/data/investigations/PSI-### — one per investigation, during the verification pass]`
- **NASA Task Book** — https://taskbook.nasa.gov (project reports used to cross-check
  objectives and hardware descriptions)
- **NASA BPS data portal** — https://science.nasa.gov/biological-physical/data/
- **Challenge Resources tab** — mission-environment figures and imagery (Saffire)

## 6. References and Additional Links

| Item | URL |
|---|---|
| Project repository | `[FILL: REPO_URL]` |
| Live application | `[FILL: LIVE_URL]` |
| Demo video (≤3 min) | `[FILL: VIDEO_URL]` |
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
