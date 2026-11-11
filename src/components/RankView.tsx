"use client";

import { useMemo, useState } from "react";
import type { Investigation, MissionProfile } from "@/data/investigations";
import {
  globalGaps,
  o2RangeStr,
  scoreInvestigation,
  topPillar,
  type PillarWeights,
} from "@/lib/scoring";
import EnvelopeChart from "@/components/EnvelopeChart";

const PILLAR_LABELS: Record<keyof PillarWeights, string> = {
  prevention: "Prevention",
  detection: "Detection",
  suppression: "Suppression",
};

export default function RankView({
  missions,
  mission,
  setMission,
  investigations,
}: {
  missions: MissionProfile[];
  mission: MissionProfile;
  setMission: (m: MissionProfile) => void;
  investigations: Investigation[];
}) {
  const [w, setW] = useState<PillarWeights>({ prevention: 8, detection: 5, suppression: 5 });
  const done = investigations.filter((i) => i.status === "completed");

  const ranked = useMemo(() => {
    return done
      .map((inv) => ({ inv, score: scoreInvestigation(inv, mission, w) }))
      .sort((a, b) => b.score.total - a.score.total);
  }, [done, mission, w]);

  const gaps = useMemo(() => globalGaps(investigations, mission), [investigations, mission]);

  return (
    <div className="space-y-6">
      {/* Mission selector */}
      <section className="card">
        <h2 className="text-sm font-semibold text-slate-300 mb-3">Your mission environment</h2>
        <div className="flex flex-wrap gap-2">
          {missions.map((m) => (
            <button
              key={m.id}
              onClick={() => setMission(m)}
              className={`chip ${mission.id === m.id ? "chip-active" : ""}`}
            >
              {m.name} · {m.o2}% O₂ · {m.psi} psi
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-500">{mission.note}</p>
      </section>

      {/* Money shot: tested conditions vs mission envelope */}
      <EnvelopeChart investigations={investigations} mission={mission} />

      {/* Pillar weights */}
      <section className="card">
        <h2 className="text-sm font-semibold text-slate-300 mb-3">
          What matters most for this mission?
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {(Object.keys(PILLAR_LABELS) as (keyof PillarWeights)[]).map((k) => (
            <label key={k} className="block">
              <span className="flex justify-between text-xs text-slate-400 mb-1">
                <span>{PILLAR_LABELS[k]}</span>
                <span className="tabular-nums">{w[k]}</span>
              </span>
              <input
                type="range"
                min={0}
                max={10}
                value={w[k]}
                onChange={(e) => setW({ ...w, [k]: Number(e.target.value) })}
                className="w-full accent-orange-500"
              />
            </label>
          ))}
        </div>
      </section>

      {/* Data gaps */}
      <section className="card border-amber-700/40 bg-amber-950/10">
        <h2 className="text-sm font-semibold text-amber-300 mb-2">Data gaps for this mission</h2>
        <ul className="space-y-1.5 text-sm text-amber-100/80 list-disc list-inside">
          {gaps.map((g, i) => (
            <li key={i}>{g}</li>
          ))}
        </ul>
      </section>

      {/* Ranked list */}
      <section className="space-y-2">
        {ranked.map(({ inv, score }, idx) => {
          const tp = topPillar(inv);
          const envIn =
            inv.o2Min != null && inv.o2Max != null && mission.o2 >= inv.o2Min && mission.o2 <= inv.o2Max;
          return (
            <article key={inv.id} className="card hover:border-orange-500/40 transition-colors">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-lg font-bold text-orange-400 tabular-nums w-7">
                  {idx + 1}
                </span>
                <h3 className="font-semibold text-slate-100">{inv.name}</h3>
                <span className="text-xs text-slate-500">{inv.fullName}</span>
                <span className="ml-auto text-2xl font-bold tabular-nums text-orange-300">
                  {score.total.toFixed(0)}
                </span>
              </div>

              <div className="mt-2 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-600 to-amber-400"
                  style={{ width: `${score.total}%` }}
                />
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] text-slate-400">
                <span className="px-2 py-0.5 rounded bg-slate-800/80">
                  ENV {Math.round(score.env * 100)}%
                  {envIn && <span className="text-emerald-400"> · inside envelope</span>}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800/80">Pillar {Math.round(score.pillar * 100)}%</span>
                <span className="px-2 py-0.5 rounded bg-slate-800/80">Relevance {Math.round(score.curated * 100)}%</span>
                <span className="px-2 py-0.5 rounded bg-slate-800/80">Recency {Math.round(score.recency * 100)}%</span>
                <span className="px-2 py-0.5 rounded bg-slate-800/80">{o2RangeStr(inv)}</span>
                <span className="px-2 py-0.5 rounded bg-slate-800/80 capitalize">{tp} evidence</span>
              </div>

              <p className="mt-2.5 text-sm text-slate-300">
                <span className="text-slate-500 font-medium">Why it ranks here: </span>
                {envIn ? "Tested conditions fall directly inside your mission's oxygen envelope. " :
                  score.env > 0.6 ? "Tested conditions sit near your mission's oxygen envelope. " :
                  "Tested conditions sit outside your mission's oxygen envelope, but the evidence still bounds it. "}
                Strongest contribution: <span className="capitalize text-sky-300">{tp}</span> — {inv.hardware}.
              </p>
            </article>
          );
        })}
      </section>
    </div>
  );
}
