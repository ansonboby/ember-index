"use client";

import { useState } from "react";
import { MISSIONS, SIM_BUDGET, SIM_CATALOG, type MissionProfile, type SimItem } from "@/data/investigations";
import { runSim, type SimResult } from "@/lib/sim";

const KIND_STYLE: Record<SimResult["events"][number]["kind"], string> = {
  ignition: "text-orange-300",
  nearmiss: "text-emerald-300",
  alarm: "text-sky-300",
  suppression: "text-emerald-300",
  fail: "text-red-400",
};

export default function SimulatorView({ missions }: { missions: MissionProfile[] }) {
  const [mission, setMission] = useState<MissionProfile>(missions[1]);
  const [o2, setO2] = useState(missions[1].o2);
  const [picks, setPicks] = useState<string[]>(["mat-basic", "det-photo", "sup-water"]);
  const [result, setResult] = useState<SimResult | null>(null);

  const spent = picks.reduce((s, id) => s + (SIM_CATALOG.find((i) => i.id === id)?.cost ?? 0), 0);
  const canBuy = SIM_BUDGET - spent;
  const pickItems = picks.map((id) => SIM_CATALOG.find((i) => i.id === id)!).filter(Boolean);

  const toggle = (item: SimItem) => {
    setResult(null);
    if (item.type === "material") {
      setPicks((p) => [...p.filter((id) => SIM_CATALOG.find((c) => c.id === id)?.type !== "material"), item.id]);
    } else {
      setPicks((p) => {
        if (p.includes(item.id)) return p.filter((x) => x !== item.id);
        if (item.cost > canBuy) return p;
        return [...p, item.id];
      });
    }
  };

  const run = () => setResult(runSim(o2, pickItems));
  const runDemo = () => {
    setMission(missions[1]);
    setO2(missions[1].o2);
    setPicks(["mat-basic", "det-photo", "sup-water"]);
    setResult(runSim(missions[1].o2, [SIM_CATALOG[0], SIM_CATALOG[3], SIM_CATALOG[6]]));
  };

  return (
    <div className="space-y-5">
      <section className="card border-orange-700/30 bg-orange-950/10">
        <p className="text-xs text-amber-200/80">
          <span className="font-semibold uppercase tracking-wide">Illustrative simulation</span> — every
          rule below is derived from a cited NASA experiment (shown after each event). This is decision
          support for learning the tradeoffs, not a validated combustion model.
        </p>
      </section>

      <section className="card">
        <h2 className="text-sm font-semibold text-slate-300 mb-3">1 · Choose your mission</h2>
        <div className="flex flex-wrap gap-2">
          {missions.map((m) => (
            <button key={m.id} onClick={() => { setMission(m); setO2(m.o2); setResult(null); }} className={`chip ${mission.id === m.id ? "chip-active" : ""}`}>
              {m.name}
            </button>
          ))}
        </div>
        <label className="block mt-4">
          <span className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Cabin oxygen (ignition risk driver)</span>
            <span className="tabular-nums">{o2}% O₂</span>
          </span>
          <input type="range" min={21} max={100} value={o2} onChange={(e) => { setO2(Number(e.target.value)); setResult(null); }} className="w-full accent-orange-500" />
        </label>
      </section>

      <section className="card">
        <h2 className="text-sm font-semibold text-slate-300 mb-1">2 · Outfit your spacecraft</h2>
        <p className="text-xs text-slate-500 mb-3">Budget {SIM_BUDGET} pts · spent {spent} · remaining {canBuy}</p>
        <div className="grid md:grid-cols-3 gap-4">
          {(["material", "detection", "suppression"] as const).map((t) => (
            <div key={t}>
              <p className="text-[11px] uppercase tracking-wide text-slate-500 mb-2 capitalize">{t}</p>
              <div className="space-y-2">
                {SIM_CATALOG.filter((i) => i.type === t).map((item) => {
                  const active = picks.includes(item.id);
                  const affordable = item.type === "material" || active || item.cost <= canBuy;
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggle(item)}
                      disabled={!affordable}
                      className={`w-full text-left rounded-lg border p-2.5 transition-colors ${active ? "border-orange-500/60 bg-orange-500/10" : "border-slate-800 bg-slate-950/40 hover:border-slate-600"} ${affordable ? "" : "opacity-40 cursor-not-allowed"}`}
                    >
                      <span className="flex justify-between text-sm font-medium text-slate-200">
                        {item.name} <span className="text-slate-400">{item.cost}</span>
                      </span>
                      <span className="block text-[11px] text-slate-500 mt-0.5">{item.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex gap-2">
        <button onClick={run} className="px-5 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-400 text-slate-950 font-semibold text-sm transition-colors">
          Run mission ({12} days)
        </button>
        <button onClick={runDemo} className="px-5 py-2.5 rounded-lg border border-slate-700 text-slate-300 text-sm hover:border-orange-500/50 transition-colors">
          Run demo scenario
        </button>
      </div>

      {result && (
        <section className="space-y-3">
          <div className="card flex items-center gap-4">
            <span className={`text-5xl font-black ${result.uncontrolled > 0 ? "text-red-500" : "text-emerald-400"}`}>
              {result.grade}
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-200">Safety case: {result.score}/100</p>
              <p className="text-xs text-slate-500">
                {result.uncontrolled > 0
                  ? `${result.uncontrolled} uncontrolled fire(s) — the mission ends badly.`
                  : result.contained + result.smoke === 0
                    ? "No fire events in the mission window. Clean run."
                    : `${result.contained} contained fire(s), ${result.smoke} smoke exposure(s). Crew survived — barely teachable.`}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {result.events.map((e, i) => (
              <div key={i} className="card">
                <p className="text-sm">
                  <span className="text-slate-500 tabular-nums mr-2">Day {e.day}</span>
                  <span className={KIND_STYLE[e.kind]}>{e.text}</span>
                </p>
                {e.cite && <p className="cite mt-1">cites · {e.cite}</p>}
              </div>
            ))}
            {result.events.length === 0 && (
              <div className="card text-sm text-slate-400">
                12 quiet days. Either your outfitting works, or luck held — run the demo scenario to see
                the engine actually fire.
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
