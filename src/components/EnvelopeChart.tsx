"use client";

import type { Investigation, MissionProfile } from "@/data/investigations";
import { topPillar } from "@/lib/scoring";

const PILLAR_COLOR: Record<string, string> = {
  prevention: "#38bdf8", // sky
  detection: "#a78bfa", // violet
  suppression: "#fb923c", // orange
};

const W = 860, H = 440, ML = 58, MR = 20, MT = 30, MB = 46;
const x = (o2: number) => ML + (Math.min(o2, 100) / 100) * (W - ML - MR);
const y = (psi: number) => MT + (1 - Math.min(psi, 16) / 16) * (H - MT - MB);

export default function EnvelopeChart({
  investigations,
  mission,
}: {
  investigations: Investigation[];
  mission: MissionProfile;
}) {
  const done = investigations.filter(
    (i) => i.status === "completed" && i.o2Max != null && i.pressurePsi != null
  );
  const maxSolidO2 = Math.max(
    ...investigations.filter((i) => i.fuelTypes.includes("solid") && i.o2Max != null).map((i) => i.o2Max!)
  );
  const hasGap = mission.o2 > maxSolidO2;

  return (
    <div className="card">
      <h2 className="text-sm font-semibold text-slate-300 mb-1">
        Tested-condition envelope · O₂ vs. pressure
      </h2>
      <p className="text-xs text-slate-500 mb-2">
        Each bar spans the oxygen range one investigation tested (jittered vertically for
        visibility); the crosshair is your mission. White space is missing evidence.
      </p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Oxygen-pressure envelope chart">
        {/* grid */}
        {[0, 20, 40, 60, 80, 100].map((t) => (
          <g key={t}>
            <line x1={x(t)} y1={MT} x2={x(t)} y2={H - MB} stroke="#1e293b" strokeWidth={1} />
            <text x={x(t)} y={H - MB + 18} fill="#64748b" fontSize={12} textAnchor="middle">
              {t}%
            </text>
          </g>
        ))}
        {[4.3, 10.2, 14.7].map((p) => (
          <g key={p}>
            <line x1={ML} y1={y(p)} x2={W - MR} y2={y(p)} stroke="#1e293b" strokeWidth={1} />
            <text x={ML - 8} y={y(p) + 4} fill="#64748b" fontSize={12} textAnchor="end">
              {p} psi
            </text>
          </g>
        ))}
        <text x={W / 2} y={H - 8} fill="#94a3b8" fontSize={12} textAnchor="middle">
          Oxygen concentration (%) — microgravity tests
        </text>

        {/* investigation O2-range bars */}
        {done.map((inv, i) => {
          const jitter = ((i % 7) - 3) * 6;
          const yy = y(inv.pressurePsi!) + jitter;
          const x1 = x(inv.o2Min ?? inv.o2Max!);
          const x2 = x(inv.o2Max!);
          const c = PILLAR_COLOR[topPillar(inv)];
          return (
            <g key={inv.id}>
              <line x1={x1} y1={yy} x2={x2} y2={yy} stroke={c} strokeWidth={5} opacity={0.75} strokeLinecap="round" />
              <title>{`${inv.name}: ${inv.o2Min}–${inv.o2Max}% O₂ @ ${inv.pressurePsi} psi`}</title>
            </g>
          );
        })}

        {/* mission crosshair */}
        <line x1={x(mission.o2)} y1={MT} x2={x(mission.o2)} y2={H - MB} stroke="#fbbf24" strokeWidth={1.5} strokeDasharray="5 4" />
        <line x1={ML} y1={y(mission.psi)} x2={W - MR} y2={y(mission.psi)} stroke="#fbbf24" strokeWidth={1.5} strokeDasharray="5 4" />
        <circle cx={x(mission.o2)} cy={y(mission.psi)} r={9} fill="#fbbf24" opacity={0.25} />
        <circle cx={x(mission.o2)} cy={y(mission.psi)} r={4} fill="#fbbf24" />
        <text x={x(mission.o2) + 12} y={y(mission.psi) - 10} fill="#fbbf24" fontSize={12} fontWeight={600}>
          {mission.name}
        </text>

        {/* gap callout */}
        {hasGap && (
          <g>
            <rect
              x={x(maxSolidO2)}
              y={MT}
              width={x(100) - x(maxSolidO2)}
              height={H - MT - MB}
              fill="#fbbf24"
              opacity={0.05}
            />
            <text x={(x(maxSolidO2) + x(100)) / 2} y={MT + 16} fill="#fbbf24" fontSize={12} textAnchor="middle">
              no solid-material data — LUCI / FM² territory
            </text>
          </g>
        )}
      </svg>
      <div className="mt-1 flex gap-4 text-[11px] text-slate-400">
        {Object.entries(PILLAR_COLOR).map(([k, c]) => (
          <span key={k} className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-1.5 rounded-full" style={{ background: c }} />
            {k} evidence
          </span>
        ))}
      </div>
    </div>
  );
}
