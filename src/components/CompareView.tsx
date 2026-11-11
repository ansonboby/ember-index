"use client";

import { useMemo, useState } from "react";
import type { Investigation, Pillar } from "@/data/investigations";
import { o2RangeStr } from "@/lib/scoring";

// Hardware genealogy, straight from the challenge brief.
const GENEALOGY: { label: string; ids: string[] }[] = [
  { label: "CIR · ACME modular hardware (gas fuels)", ids: ["bre", "efield", "cfi-g"] },
  { label: "CIR · MDCA droplet rack (liquid droplets)", ids: ["flex", "flex-2", "cfi"] },
  { label: "MSG · SPICE fan-driven flow duct (solids + gas jets)", ids: ["spice", "slice", "bass", "bass-ii"] },
  { label: "MSG · aerosol instrumentation", ids: ["same", "same-r", "daft", "daft-2"] },
  { label: "Cygnus free flight (large-scale)", ids: ["saffire-1", "saffire-2", "saffire-3"] },
];

export default function CompareView({ investigations }: { investigations: Investigation[] }) {
  const [pillar, setPillar] = useState<Pillar | "all">("all");
  const done = useMemo(
    () =>
      investigations.filter(
        (i) => i.status === "completed" && (pillar === "all" || i.pillarRelevance[pillar] >= 0.5)
      ),
    [investigations, pillar]
  );

  return (
    <div className="space-y-5">
      <section className="card">
        <h2 className="text-sm font-semibold text-slate-300 mb-3">Hardware genealogy</h2>
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-3">
          {GENEALOGY.map((g) => (
            <div key={g.label} className="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
              <p className="text-[11px] text-slate-400 mb-2">{g.label}</p>
              <div className="flex flex-wrap gap-1.5">
                {g.ids.map((id) => {
                  const inv = investigations.find((i) => i.id === id)!;
                  return (
                    <span key={id} className="px-2 py-0.5 rounded bg-slate-800 text-[11px] text-orange-200">
                      {inv.name}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex gap-2 flex-wrap items-center">
          <h2 className="text-sm font-semibold text-slate-300 mr-2">Variable matrix</h2>
          {(["all", "prevention", "detection", "suppression"] as const).map((f) => (
            <button key={f} onClick={() => setPillar(f)} className={`chip ${pillar === f ? "chip-active" : ""}`}>
              {f}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-separate border-spacing-y-1">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wide text-slate-500">
                <th className="px-3 py-2">Investigation</th>
                <th className="px-3 py-2">O₂ range</th>
                <th className="px-3 py-2">Pressure</th>
                <th className="px-3 py-2">Fuels</th>
                <th className="px-3 py-2">Flow</th>
                <th className="px-3 py-2">Sensors</th>
              </tr>
            </thead>
            <tbody>
              {done.map((inv) => (
                <tr key={inv.id} className="bg-slate-900/60">
                  <td className="px-3 py-2 rounded-l-lg">
                    <span className="font-medium text-slate-200">{inv.name}</span>
                    <span className="block text-[11px] text-slate-500">{inv.years}</span>
                  </td>
                  <td className="px-3 py-2">
                    {inv.o2Min == null ? (
                      <span className="text-slate-600">—</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 rounded-full bg-slate-800 relative">
                          <div
                            className="absolute h-full rounded-full bg-gradient-to-r from-sky-500 to-orange-400"
                            style={{
                              left: `${inv.o2Min}%`,
                              width: `${Math.max(2, (inv.o2Max! - inv.o2Min) * 0.9)}%`,
                            }}
                          />
                        </div>
                        <span className="text-[11px] text-slate-400 whitespace-nowrap">{o2RangeStr(inv)}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2 text-slate-400">{inv.pressurePsi ?? "—"} psi</td>
                  <td className="px-3 py-2 text-slate-400 max-w-56">{inv.fuelSummary}</td>
                  <td className="px-3 py-2 text-slate-400 max-w-44">{inv.flowSummary}</td>
                  <td className="px-3 py-2 rounded-r-lg text-slate-400 max-w-44">{inv.sensors.join(", ") || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
