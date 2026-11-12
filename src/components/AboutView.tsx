"use client";

import type { Investigation } from "@/data/investigations";

export default function AboutView({ investigations }: { investigations: Investigation[] }) {
  const completed = investigations.filter((i) => i.status === "completed");
  return (
    <div className="max-w-3xl space-y-5 text-sm leading-relaxed text-slate-300">
      <section className="card space-y-3">
        <h2 className="text-base font-semibold text-slate-100">What Ember Index is</h2>
        <p>
          NASA has two decades of microgravity combustion data in the{" "}
          <a className="text-sky-400 underline" href="https://psi.nasa.gov" target="_blank">Physical Science Informatics (PSI)</a>{" "}
          database — hard to find, harder to compare, hardest to interpret. Ember Index translates that
          evidence into decisions for the environments crews will actually occupy: ISS, the Lunar-surface
          base (≥30% O₂ at ≤10.2 psi), pressurized rovers, spacesuits (100% O₂ at 4.3 psi), and Mars transit.
        </p>
        <p>
          Mission-profile mode re-ranks every investigation against your chosen atmosphere with a
          transparent scoring engine: envelope overlap (40%), fire-safety pillar strength under your
          sliders (25%), curated overall relevance (20%), recency (15%). Every card shows its own
          breakdown — an auditable map of the evidence, never a black box.
        </p>
      </section>

      <section className="card space-y-3">
        <h2 className="text-base font-semibold text-slate-100">Honesty &amp; limits</h2>
        <ul className="list-disc list-inside space-y-1.5">
          <li>
            The ranking engine and simulator rules are <span className="text-amber-300">illustrative decision
            support</span> built on published results — not a validated combustion model.
          </li>
          <li>
            No partial-gravity combustion data exists in PSI yet; LUCI and FM² will provide it. We show
            those experiments as upcoming, and mark the gap rather than pretending it away.
          </li>
          <li>
            Attributes are hand-curated and <span className="text-emerald-400">verified against the PSI
            database record-by-record via its public API (Nov 2026)</span> — every completed
            investigation cites its PSI accession and DOI, its PI, and its flight hardware as listed in
            the PSI record. Test-matrix-level details (exact O₂/flow matrices) live in access-restricted
            PSI files; numeric bounds not stated in the record text remain flagged as approximate.
          </li>
        </ul>
      </section>

      <section className="card space-y-3">
        <h2 className="text-base font-semibold text-slate-100">Dataset coverage</h2>
        <p>
          {completed.length} completed investigations curated: {completed.map((i) => i.name).join(" · ")}.
          Plus LUCI and FM² as upcoming. Hardware genealogy per the challenge brief: ACME modular hardware
          in the CIR (gas fuels), MDCA droplet rack in the CIR (FLEX, FLEX-2, CFI), the SPICE fan-driven
          duct in the MSG (SPICE, SLICE, BASS, BASS-II), MSG aerosol instrumentation (SAME, SAME-R, DAFT,
          DAFT-2), and free-flight large-scale burning on Cygnus (Saffire-I/II/III).
        </p>
      </section>

      <section className="card space-y-3">
        <h2 className="text-base font-semibold text-slate-100">Sources</h2>
        <ul className="list-disc list-inside space-y-1.5">
          <li><a className="text-sky-400 underline" href="https://psi.nasa.gov" target="_blank">NASA PSI database</a></li>
          <li><a className="text-sky-400 underline" href="https://taskbook.nasa.gov" target="_blank">NASA Task Book</a></li>
          <li>NASA Space Apps 2026 challenge brief: “Flame in Freefall” (mission-environment figures, hardware genealogy, Earth spin-offs)</li>
        </ul>
        <p className="text-xs text-slate-500">
          Built for the 2026 NASA Space Apps Challenge. This is not a NASA product; all data credit to
          NASA and the contributing research teams.
        </p>
      </section>
    </div>
  );
}
