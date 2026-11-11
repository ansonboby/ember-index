# Ember Index

**Fire safety decisions for the next giant leap.** An SI-powered dashboard that maps
NASA's microgravity combustion research onto the atmospheres crews will actually breathe —
and lets you play Crew Safety Officer.

Built for the 2026 NASA Space Apps Challenge: *Flame in Freefall: SI-Powered Fire Safety
Insights from Microgravity Combustion Data*.

## What it does

- **Mission-profile mode** — pick ISS, Lunar-surface base (≥30% O₂, ≤10.2 psi), pressurized
  rover, spacesuit (100% O₂, 4.3 psi), Mars transit, or a custom atmosphere. Every
  investigation is re-ranked against your environment.
- **Transparent ranking engine** — scoring on oxygen–pressure envelope overlap, fuel/material
  relevance, and prevention/detection/suppression contribution. Weights are sliders; every
  card shows its own breakdown. No black box.
- **Envelope chart** — every tested condition across the dataset plotted in O₂–pressure
  space with your mission band overlaid. Where the dots stop, the data gaps begin (LUCI, FM²).
- **Investigation explorer** — objectives, fuels and geometry, test conditions, hardware
  (CIR/ACME, CIR/MDCA, MSG/SPICE duct), sensors, platform, and sources for ~16 NASA PSI
  campaigns.
- **Crew Safety Officer simulator** — a game on the same data: set your atmosphere, budget
  your countermeasures, and watch the event engine roll outcomes with every rule cited to
  its experiment (labeled illustrative — this is decision support, not CFD).
- **Ask the SI** — chat over the dataset via an OpenAI-compatible endpoint. Optional; the
  app is fully functional without any key.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

Optional LLM chat — set in `.env` (all optional, app works without):

```
AI_API_KEY=...
AI_BASE_URL=https://api.openai.com/v1/chat/completions
AI_MODEL=gpt-4o-mini
```

## Data provenance

All data comes from NASA's open **Physical Science Informatics (PSI) database**
(https://psi.nasa.gov) and the NASA Task Book. The attribute dataset is hand-curated in
`src/data/investigations.ts`; every attribute field is traceable to its PSI investigation
page, and fields not yet verified are marked `unverified` in the source. Investigations
covered: BASS, BASS-II, Saffire-I/II/III, SAME, SAME-R, FLEX, FLEX-2, CFI/CFI-G, BRE,
SPICE, SLICE, E-FIELD Flames, DAFT, DAFT-2 — with LUCI and FM² referenced as future
partial-gravity datasets.

**Honesty note:** the ranking engine and simulator rules are maps of published evidence,
clearly labeled as illustrative where they extrapolate. They are not a validated
combustion model.

## Stack

Next.js (App Router) · TypeScript · Tailwind · Recharts · static export · Vercel.

## Team

`[FILL: names + roles]`

## Acknowledgments

NASA Biological & Physical Sciences division and the PSI database team; the Space Apps
organizing team. Artemis II crew quote used for motivation: *"If you want to get
somebody's attention really quick, make the fire alarm go off in your spacecraft when
you're still about 80,000 miles from home."*
