# Flame in Freefall — Winning Strategy

**Product:** "Ember Index" — an SI-powered dashboard that ranks NASA PSI microgravity combustion investigations against *your mission environment* and turns them into plain-language fire-safety decisions — plus a playable **Crew Safety Officer simulator** built on the same dataset.

## 1. How entries are judged

Space Apps scores five criteria. Every feature below maps to one of them:

| Criterion | What wins | Our answer |
|---|---|---|
| **Impact** | Solves a real problem for a real audience | Aerospace engineers/students pick materials & safety systems — we rank data *by their mission* (ISS, Moon base, rover, suit) |
| **Creativity** | An angle nobody else takes | **Mission-profile mode**: pick 21% O₂/14.7 psi → or Moon 30%+ O₂/10.2 psi → or suit 100% O₂/4.3 psi, and the whole dashboard re-ranks |
| **Validity** | Facts correct, data used properly | Every number cites its PSI investigation ID; "verified against PSI" disclaimer; honest gap analysis |
| **Relevance** | Actually uses the challenge resources | Built directly on PSI investigations: BASS/-II, Saffire I–III, SAME/-R, FLEX/-2, CFI, CFI-G, BRE, SPICE, SLICE, E-FIELD, DAFT/-2 |
| **Presentation** | Demo tells a story in 3 min | Scripted demo: "It's Artemis III. Your rover cabin is 30% oxygen. What does NASA's data say burns there?" |

## 2. The killer idea (say this first in the pitch)

NASA's data is scattered across dozens of investigations at *different oxygen concentrations, pressures, and flows*. Nobody tested "the Moon Base atmosphere" directly. Our dashboard is the **translator**: it maps decades of microgravity experiments onto the atmosphere you will actually fly in, ranks the evidence, and flags the gaps ("no partial-gravity data until LUCI/FM2 flies").

## 3. Feature list (build order)

### MVP — must ship (Day 1)
1. **Dataset**: hand-curated JSON of ~16 investigations. Attributes: objective, fuel(s) + geometry, O₂ range, pressure, flow, gravity level, hardware (CIR/MDCA/MSG), sensors, platform, years, fire-safety pillar (prevention/detection/suppression), PSI-ID + link. One source-of-truth file, `src/data/investigations.ts`.
2. **Mission profiles**: ISS, Lunar surface base, Pressurized rover, Spacesuit, Mars transit — each with O₂ %, pressure, gravity. Editable custom profile.
3. **Rank view**: transparent, explainable score per investigation — O₂-envelope overlap with the mission, fuel/material relevance, pillar weighting (user-adjustable sliders: prevention / detection / suppression). Show score breakdown per card, not a black box.
4. **Envelope chart**: scatter of every tested condition (O₂ % vs pressure), with mission envelopes overlaid as shaded bands. One glance = "we have data here, gaps there."
5. **Insight cards**: generated plain-language findings per investigation + global gaps (e.g. "only CFI-G reached 85% O₂, and only for gas fuels inside-out").

### Differentiators — ship if time (Day 2 morning)
6. **Simulator tab (the game — top priority of this tier)**: "You are the Crew Safety Officer." Pick mission → set atmosphere (O₂ %/pressure, real tradeoff: high O₂ cuts pre-breathe but raises flammability) → spend budget on materials/detection/suppression from the PSI-ranked catalog → event engine rolls ignition/suppression outcomes from the dataset (BASS = solid flammability limits, FLEX = suppressant effectiveness, SAME = smoke detector behavior in microgravity). SI narrates every outcome citing the investigation behind the rule. End screen grades your safety case. ~1 new component (event engine); shares all data + UI with the dashboard. Probabilities must be visibly labeled *illustrative, derived from cited limits*.
7. **Compare matrix**: heatmap of variables across investigations; filter by pillar/hardware/fuel. Hardware genealogy strip (ACME→CIR, FLEX→MDCA, SPICE duct→MSG).
8. **Ask the SI**: chat over the dataset. Next.js API route proxies to an OpenAI-compatible endpoint (your `.env` has the slot: `AI_API_KEY`). Dataset is small — stuff it whole in the system prompt, no RAG infra. **App must be fully impressive with the key absent.**
9. **Earth spin-offs section**: fine-water-mist extinguishers, smoke detection, firefighter gear (from the challenge text) — cheap Impact points.

### Cut list (do NOT build)
- User accounts, DB, file uploads of raw PSI CSVs, 3D flame animations, mobile app. None move judging scores.

## 4. Data plan (Validity is 20% of the score)

- Hand-curate the dataset from the challenge text + investigation pages on `psi.nasa.gov/physci/repo/data/investigations/PSI-XXX`.
- Team task during the hackathon: open each linked PSI page, verify/complete every attribute, note the source on each field.
- Stretch: PSI search endpoint (`/physci/repo/search?...data_type=investigation`) — probe for a JSON API to auto-pull metadata. Only if it works in <1 hour.

## 5. Stack & architecture (Next.js)

- **Next.js 15 (App Router) + TypeScript + Tailwind.** Static export (`output: 'export'`) — no server needed except the one API route for the LLM (runs fine on Vercel).
- **Charts**: Recharts (scatter, bars) — standard, fast to build.
- **Layout**: single page, tabbed sections: `Rank` (default) · `Explore` (all investigations) · `Simulator` (game) · `Compare` · `Ask SI` · `About & Sources`.
- **State**: all client-side, one React context; profiles + slider weights in `useState`. No router params needed.
- **Deploy**: Vercel (free), custom domain optional.

## 6. Timeline (hackathon day)

| Time | Task |
|---|---|
| H0–1 | Scaffold Next.js, data model, 16 investigations rough-filled |
| H1–3 | Rank view + scoring engine + mission profiles |
| H3–4 | Envelope chart (the wow visual) |
| H4–6 | Explore & detail cards, insight generation |
| H6–7 | Simulator event engine + run flow |
| H7–8 | Compare matrix; team parallel-task: PSI data verification |
| H8–9 | Ask-the-SI API route + graceful no-key mode |
| H9–10 | Polish, pitch text, demo run-through, deploy to Vercel |

If time collapses, cut Ask-the-SI first, then Compare matrix. The Simulator and the Rank view are the two things that must exist.

## 7. Risks

- **No LLM key** → app works fully without it; key is an enhancement, not a dependency. (Current `.env` key is a placeholder — get a real key before demo, or present without chat.)
- **Game physics looks made-up** → every event-engine rule carries its citation and an "illustrative" label; the SI narrates the underlying experiment. Never claim the engine is a validated model.
- **Data mistakes** → cite every field to PSI; the About page states the verification method.
- **Scope creep** → the cut list above is binding.

## 8. Demo script (3 min, Presentation = 20%)

1. Open on the Saffire flame image. "In microgravity, fire becomes a sphere. NASA has 20 years of data on this — scattered."
2. Click **Moon Base** profile. Rankings reorder live. "30% oxygen — materials burn 40% hotter for ignition. Here's the evidence, ranked."
3. Point at the envelope chart: "Every dot is a test NASA ran. The shaded band is where crews will actually live. This white gap is why LUCI must fly."
4. Switch to the **Simulator**: play the Crew Safety Officer live — pick the rover, set 30% O₂, buy suppression, let a fire start, the SI explains which experiment predicted it. (30 seconds of gameplay, pre-seeded so it demos clean.)
5. Open one investigation card → score breakdown → PSI link. "Every claim is sourced."
6. Ask the SI one question. Land the closing line: "Ember Index turns NASA's data into decisions for the next giant leap."
