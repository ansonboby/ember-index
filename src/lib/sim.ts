// Illustrative event engine: every probability is derived from a cited NASA
// experiment and labeled as such. Not a validated combustion model.
// Pure logic (no JSX) so it can be asserted with plain node.

import { type SimItem } from "../data/investigations.ts";

export interface SimEvent {
  day: number;
  kind: "ignition" | "nearmiss" | "alarm" | "suppression" | "fail";
  text: string;
  cite?: string;
}

export interface SimResult {
  events: SimEvent[];
  grade: string;
  score: number;
  uncontrolled: number;
  contained: number;
  smoke: number;
}

function clamp(v: number, a: number, b: number) {
  return Math.min(b, Math.max(a, v));
}

// Deterministic seeded RNG — same inputs always produce the same run,
// so the demo can't embarrass us. (mulberry32)
function makeRng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function runSim(o2: number, picks: SimItem[]): SimResult {
  const r = makeRng(4242 + Math.round(o2));
  const events: SimEvent[] = [];
  const mat = picks.find((p) => p.type === "material");
  const dets = picks.filter((p) => p.type === "detection");
  const sups = picks.filter((p) => p.type === "suppression");

  let uncontrolled = 0, contained = 0, smoke = 0;
  const DAYS = 12;

  for (let day = 1; day <= DAYS && uncontrolled === 0; day++) {
    const eventChance = 0.16 + 0.004 * (o2 - 21);
    if (r() > eventChance) continue;

    const loi = mat?.loi ?? 15; // no material budgeted = unprotected interior
    const ignProb = clamp((o2 - loi) / 18 + 0.05, 0.03, 0.95);
    const flaming = r() < 0.6;

    if (r() >= ignProb) {
      events.push({
        day,
        kind: "nearmiss",
        text: `Overheat event in an equipment rack — the ${mat ? mat.name.toLowerCase() : "unprotected interior"} held.`,
        cite: "BASS/BASS-II: ignition requires O₂ above the material's flammability limit",
      });
      continue;
    }

    events.push({
      day,
      kind: "ignition",
      text: flaming
        ? "A fault ignites a furnishing — open flaming fire."
        : "An electrical fault begins smoldering — smoke, no open flame yet.",
      cite: "BASS/BASS-II: flammability limits rise sharply with O₂ concentration",
    });

    // Detection — SAME: microgravity smoke skews sub-micron; detector type matters.
    let best: SimItem | null = null;
    for (const d of dets) {
      const q = (flaming ? d.detectFlaming : d.detectSmolder) ?? 0;
      if (!best || q > ((flaming ? best.detectFlaming : best.detectSmolder) ?? 0)) best = d;
    }
    const detected = best ? r() < ((flaming ? best.detectFlaming : best.detectSmolder) ?? 0) : false;
    if (!detected) {
      uncontrolled++;
      events.push({
        day,
        kind: "fail",
        text: "No alarm. The crew finds the fire late — it grows beyond suppression.",
        cite: "SAME: smoke-particle size distribution governs detector response",
      });
      break;
    }
    const latency = best?.latencyDays ?? 3;
    events.push({
      day,
      kind: "alarm",
      text: `${best!.name} responds after ~${latency} day${latency > 1 ? "s" : ""} of fire growth.`,
      cite: "SAME/SAME-R: detector selection follows measured particle sizes",
    });

    if (!flaming) smoke++; // smoldering exposure, contained by definition once detected

    // Suppression — FLEX: richer atmospheres are harder to extinguish by dilution.
    const power = sups.length ? Math.max(...sups.map((s) => s.power ?? 0)) : 0;
    if (power === 0) {
      uncontrolled++;
      events.push({ day, kind: "fail", text: "No suppressant on board the run plan. The fire wins.", cite: "FLEX: extinction requires an agent at or above its dilution limit" });
      break;
    }
    const eff = clamp(power * (1 - 0.25 * ((o2 - 21) / 21)), 0.05, 0.98);
    if (r() < eff) {
      contained++;
      events.push({
        day: day + latency,
        kind: "suppression",
        text: `${sups[0].name} knocks the fire down. Crew safe, cabin scorched.`,
        cite: "FLEX: dilution/extinction limits; BASS N₂ suppression of solids",
      });
    } else {
      uncontrolled++;
      events.push({ day: day + latency, kind: "fail", text: "Suppression attempt fails in the oxygen-rich atmosphere.", cite: "FLEX: higher O₂ raises the concentration of agent needed" });
      break;
    }
  }

  const score = clamp(100 - 45 * uncontrolled - 10 * smoke - 6 * contained, 0, 100);
  const grade = uncontrolled > 0 ? "F" : score >= 96 ? "A" : score >= 80 ? "B" : score >= 60 ? "C" : "D";
  return { events, grade, score, uncontrolled, contained, smoke };
}
