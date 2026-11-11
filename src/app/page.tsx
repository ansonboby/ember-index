"use client";

import { useState } from "react";
import { INVESTIGATIONS, MISSIONS, type MissionProfile } from "@/data/investigations";
import RankView from "@/components/RankView";
import ExploreView from "@/components/ExploreView";
import SimulatorView from "@/components/SimulatorView";
import CompareView from "@/components/CompareView";
import AskView from "@/components/AskView";
import AboutView from "@/components/AboutView";

const TABS = [
  { id: "rank", label: "Rank" },
  { id: "explore", label: "Explore" },
  { id: "sim", label: "Simulator" },
  { id: "compare", label: "Compare" },
  { id: "ask", label: "Ask SI" },
  { id: "about", label: "About" },
] as const;

export default function Home() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("rank");
  const [mission, setMission] = useState<MissionProfile>(MISSIONS[1]); // Moon Base by default — the hook

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16">
      <header className="pt-10 pb-6">
        <div className="flex items-baseline gap-3 flex-wrap">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-orange-400">
            Ember Index
          </h1>
          <p className="text-slate-400 text-sm md:text-base">
            Fire safety decisions for the next giant leap · NASA Space Apps 2026 ·{" "}
            <span className="text-slate-500">Flame in Freefall</span>
          </p>
        </div>
        <p className="mt-2 text-slate-500 text-sm max-w-3xl">
          Maps two decades of NASA microgravity combustion research — the PSI database — onto the
          atmospheres crews will actually breathe, ranks the evidence for prevention, detection and
          suppression, and lets you play Crew Safety Officer.
        </p>
      </header>

      <nav className="flex gap-1.5 overflow-x-auto pb-1 mb-6 border-b border-slate-800/70">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`tabbtn ${tab === t.id ? "tabbtn-active" : ""}`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "rank" && <RankView missions={MISSIONS} mission={mission} setMission={setMission} investigations={INVESTIGATIONS} />}
      {tab === "explore" && <ExploreView investigations={INVESTIGATIONS} />}
      {tab === "sim" && <SimulatorView missions={MISSIONS} />}
      {tab === "compare" && <CompareView investigations={INVESTIGATIONS} />}
      {tab === "ask" && <AskView investigations={INVESTIGATIONS} />}
      {tab === "about" && <AboutView investigations={INVESTIGATIONS} />}
    </div>
  );
}
