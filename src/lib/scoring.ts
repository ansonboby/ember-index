import type { Investigation, MissionProfile, Pillar } from "../data/investigations.ts";

export interface PillarWeights {
  prevention: number;
  detection: number;
  suppression: number;
}

export interface Score {
  total: number;
  env: number; // mission-envelope overlap
  pillar: number; // user-weighted fire-safety pillar strength
  curated: number; // curated overall relevance
  recency: number; // recency of campaign
}

// Transparent scoring: every component is shown to the user on the card.
// Weights: ENV 40% · PILLAR 25% · CURATED 20% · RECENCY 15%.
export function scoreInvestigation(
  inv: Investigation,
  m: MissionProfile,
  w: PillarWeights
): Score {
  let env = 0;
  if (inv.o2Min != null && inv.o2Max != null) {
    const dist =
      m.o2 >= inv.o2Min && m.o2 <= inv.o2Max
        ? 0
        : m.o2 < inv.o2Min
          ? inv.o2Min - m.o2
          : m.o2 - inv.o2Max;
    env = Math.max(0, 1 - dist / 25); // falloff over 25 percentage points of O₂
  }
  // Microgravity data bounds partial-gravity regimes (micro + 1-g sandwich the answer).
  env *= m.gravity === "micro" || m.gravity === "earth" ? 1 : 0.85;

  const wsum = w.prevention + w.detection + w.suppression || 1;
  const pillar =
    (inv.pillarRelevance.prevention * w.prevention +
      inv.pillarRelevance.detection * w.detection +
      inv.pillarRelevance.suppression * w.suppression) /
    wsum;

  const recency = Math.min(1, Math.max(0, (inv.lastYear - 2003) / 20));
  const total = 100 * (0.4 * env + 0.25 * pillar + 0.2 * inv.curatedRelevance + 0.15 * recency);
  return { total, env, pillar, curated: inv.curatedRelevance, recency };
}

export function topPillar(inv: Investigation): Pillar {
  const p = inv.pillarRelevance;
  const entries: [Pillar, number][] = [
    ["prevention", p.prevention],
    ["detection", p.detection],
    ["suppression", p.suppression],
  ];
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0][0];
}

// Standing data gaps for the selected mission, computed from the dataset itself.
export function globalGaps(list: Investigation[], m: MissionProfile): string[] {
  const gaps: string[] = [];
  const solids = list.filter((i) => i.fuelTypes.includes("solid") && i.o2Max != null);
  const maxSolidO2 = solids.length ? Math.max(...solids.map((i) => i.o2Max!)) : 21;
  if (m.o2 > maxSolidO2) {
    gaps.push(
      `No microgravity data on solid materials above ${maxSolidO2}% O₂ — the ${m.name} atmosphere (${m.o2}%) sits outside every solid-fuel test envelope.`
    );
  }
  if (m.gravity === "partial") {
    gaps.push(
      "No partial-gravity combustion data exists in PSI yet. LUCI and FM² will fill it; for now, only microgravity and 1-g results bound the case."
    );
  }
  if (m.o2 > 21) {
    gaps.push(
      "The highest-oxygen microgravity tests ever flown are CFI-G's — up to 85% O₂, but for gaseous fuels from an inside-out spherical burner. Extrapolation to solid materials is untested."
    );
  }
  return gaps;
}

export function o2RangeStr(inv: Investigation): string {
  if (inv.o2Min == null || inv.o2Max == null) return "—";
  if (inv.o2Min === inv.o2Max) return `${inv.o2Min}% O₂`;
  return `${inv.o2Min}–${inv.o2Max}% O₂`;
}
