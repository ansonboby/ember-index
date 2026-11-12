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

// Scoring: BASS verified envelope is ≤21% O₂ (PSI record) → at Moon's 32%:
// dist = 11 → env = 1 − 11/25 = 0.56, × 0.85 partial-g bound = 0.476
const s = scoreInvestigation(bass, moon, { prevention: 8, detection: 5, suppression: 5 });
assert(Math.abs(s.env - 0.476) < 1e-9, `BASS env at Moon Base = 0.476 (got ${s.env})`);
assert(s.total > 0 && s.total <= 100, `BASS total in (0,100] (got ${s.total})`);

// Sorting sanity: BASS-II (curated 0.95) should rank ≥ DAFT (0.35) at Moon Base
const rank = (id: string) =>
  scoreInvestigation(INVESTIGATIONS.find((i) => i.id === id)!, moon, { prevention: 8, detection: 5, suppression: 5 }).total;
assert(rank("bass-ii") > rank("daft-2"), "BASS-II ranks above DAFT-2 for Moon Base");

// Gaps: Moon Base is partial gravity, 32% O₂ — outside every verified solid-material
// envelope (max 21% per BASS/BASS-II PSI records) → both gap statements must appear
const gaps = globalGaps(INVESTIGATIONS, moon);
assert(gaps.some((g) => g.includes("solid materials above")), "solid-material O₂ gap stated for Moon Base (verified max 21%)");
assert(gaps.some((g) => g.includes("partial-gravity")), "partial-gravity gap stated");

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
