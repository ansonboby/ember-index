// One-shot assert check of the scoring + event engines. Run:
// node --experimental-strip-types scripts/selfcheck.ts
import { INVESTIGATIONS, MISSIONS, SIM_CATALOG } from "../src/data/investigations.ts";
import { scoreInvestigation, globalGaps } from "../src/lib/scoring.ts";
import { runSim } from "../src/lib/sim.ts";

const assert = (cond: boolean, msg: string) => {
  if (!cond) {
    console.error("FAIL:", msg);
    process.exit(1);
  }
  console.log("ok  -", msg);
};

const moon = MISSIONS.find((m) => m.id === "moon")!;
const bass = INVESTIGATIONS.find((i) => i.id === "bass")!;

// Scoring: BASS tested 17–50% O₂ in microgravity → inside Moon's 32% → env = 1 × 0.85 (partial-g bound)
const s = scoreInvestigation(bass, moon, { prevention: 8, detection: 5, suppression: 5 });
assert(Math.abs(s.env - 0.85) < 1e-9, `BASS env at Moon Base = 0.85 (got ${s.env})`);
assert(s.total > 0 && s.total <= 100, `BASS total in (0,100] (got ${s.total})`);

// Sorting sanity: BASS-II (curated 0.95) should rank ≥ DAFT (0.35) at Moon Base
const rank = (id: string) =>
  scoreInvestigation(INVESTIGATIONS.find((i) => i.id === id)!, moon, { prevention: 8, detection: 5, suppression: 5 }).total;
assert(rank("bass-ii") > rank("daft-2"), "BASS-II ranks above DAFT-2 for Moon Base");

// Gaps: Moon Base is partial gravity, 32% O₂ (inside BASS-II's ~55% envelope) →
// partial-g gap yes, solid-material gap no. Spacesuit (100% O₂) exceeds every solid test → gap yes.
const gaps = globalGaps(INVESTIGATIONS, moon);
assert(!gaps.some((g) => g.includes("solid materials above")), "no solid-material gap for Moon Base (BASS-II envelope covers 32%)");
assert(gaps.some((g) => g.includes("partial-gravity")), "partial-gravity gap stated");

const suit = MISSIONS.find((m) => m.id === "suit")!;
const suitGaps = globalGaps(INVESTIGATIONS, suit);
assert(suitGaps.some((g) => g.includes("solid materials above")), "solid-material O₂ gap stated for spacesuit (100%)");

// Sim engine: deterministic and sane
const picks = [SIM_CATALOG[0], SIM_CATALOG[3], SIM_CATALOG[6]]; // basic + photoelectric + water mist
const a = runSim(32, picks);
const b = runSim(32, picks);
assert(JSON.stringify(a) === JSON.stringify(b), "runSim deterministic (same seed → same result)");
assert(["A", "B", "C", "D", "F"].includes(a.grade), `grade ∈ A–F (got ${a.grade})`);
assert(a.events.length > 0, "demo pick produces events (nothing silently empty)");
const nolimit = runSim(32, [SIM_CATALOG[3], SIM_CATALOG[6]]); // no material budgeted
assert(nolimit.score <= a.score, "unprotected interior never scores higher");

console.log("\nAll engine checks passed.");
