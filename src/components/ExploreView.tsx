"use client";

import { useState } from "react";
import type { Investigation, Pillar } from "@/data/investigations";
import { o2RangeStr } from "@/lib/scoring";

const PILLAR_STYLE: Record<Pillar, string> = {
  prevention: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  detection: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  suppression: "bg-orange-500/15 text-orange-300 border-orange-500/30",
};

function Pillars({ p }: { p: Pillar[] }) {
  return (
    <span className="flex gap-1.5 flex-wrap">
      {p.map((x) => (
        <span key={x} className={`px-2 py-0.5 rounded border text-[10px] uppercase tracking-wide ${PILLAR_STYLE[x]}`}>
          {x}
        </span>
      ))}
    </span>
  );
}

export default function ExploreView({ investigations }: { investigations: Investigation[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | Pillar | "upcoming">("all");

  const list = investigations.filter((i) => {
    if (filter === "all") return true;
    if (filter === "upcoming") return i.status === "upcoming";
    return i.pillarRelevance[filter] >= 0.5;
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {(["all", "prevention", "detection", "suppression", "upcoming"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`chip ${filter === f ? "chip-active" : ""}`}>
            {f === "all" ? "All investigations" : f === "upcoming" ? "Upcoming (LUCI, FM²)" : f}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {list.map((inv) => (
          <article
            key={inv.id}
            className="card cursor-pointer hover:border-orange-500/40 transition-colors"
            role="button"
            tabIndex={0}
            aria-expanded={open === inv.id}
            onClick={() => setOpen(open === inv.id ? null : inv.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setOpen(open === inv.id ? null : inv.id);
              }
            }}
          >
            <div className="flex items-baseline gap-2 flex-wrap">
              <h3 className="font-semibold text-slate-100">{inv.name}</h3>
              <span className="text-xs text-slate-500">{inv.years}</span>
              {inv.status === "upcoming" && (
                <span className="px-2 py-0.5 rounded border text-[10px] uppercase tracking-wide bg-amber-500/15 text-amber-300 border-amber-500/30">
                  no data yet
                </span>
            )}
              {inv.verified && <span className="text-[10px] text-emerald-400">verified ✓</span>}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{inv.fullName}</p>
            <p className="mt-2 text-sm text-slate-300 line-clamp-2">{inv.objective}</p>
            <div className="mt-2 flex items-center gap-2 flex-wrap text-[11px] text-slate-400">
              <Pillars p={(Object.entries(inv.pillarRelevance) as [Pillar, number][]).filter(([, v]) => v >= 0.5).map(([k]) => k)} />
              <span>{o2RangeStr(inv)}</span>
            </div>

            {open === inv.id && (
              <div className="mt-3 pt-3 border-t border-slate-800 space-y-2.5 text-sm">
                <Detail label="Objective" value={inv.objective} />
                <Detail label="Fuels" value={`${inv.fuelSummary} (${inv.fuelTypes.join(", ") || "n/a"})`} />
                <Detail label="Test conditions" value={`${o2RangeStr(inv)} · ${inv.pressurePsi ?? "—"} psi · ${inv.flowSummary} · ${inv.gravity}`} />
                <Detail label="Hardware" value={`${inv.platform} — ${inv.hardware}`} />
                {inv.sensors.length > 0 && <Detail label="Sensors" value={inv.sensors.join(", ")} />}
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-slate-500">Key findings</p>
                  <ul className="mt-1 list-disc list-inside text-slate-300 space-y-1">
                    {inv.findings.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
                {inv.note && <p className="text-xs text-amber-400/80">⚠ {inv.note}</p>}
                <p className="text-xs text-slate-500">
                  Source: NASA PSI{inv.psiId ? ` — investigation ${inv.psiId}` : " — not yet in PSI (upcoming)"}
                  {inv.psiId && (
                    <>
                      {" · "}
                      <a
                        className="text-sky-400 underline"
                        href={`https://psi.nasa.gov/physci/repo/data/investigations/${inv.psiId}`}
                        target="_blank"
                      >
                        open record
                      </a>
                    </>
                  )}
                  {inv.doi && (
                    <>
                      {" · "}
                      <a className="text-sky-400 underline" href={`https://doi.org/${inv.doi}`} target="_blank">
                        DOI {inv.doi}
                      </a>
                    </>
                  )}
                </p>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <p>
      <span className="text-[10px] uppercase tracking-wide text-slate-500 block">{label}</span>
      <span className="text-slate-300">{value}</span>
    </p>
  );
}
