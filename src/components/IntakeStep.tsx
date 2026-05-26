"use client";

import { STAGES, SECTORS, MODES, type Stage, type Sector, type Mode } from "@/lib/moats-data";

interface IntakeStepProps {
  stage: Stage | null;
  sector: Sector | null;
  mode: Mode | null;
  onStage: (s: Stage) => void;
  onSector: (s: Sector) => void;
  onMode: (m: Mode) => void;
}

export default function IntakeStep({
  stage,
  sector,
  mode,
  onStage,
  onSector,
  onMode,
}: IntakeStepProps) {
  return (
    <div>
      <div className="mb-10">
        <p className="font-[family-name:var(--font-mono)] text-xs font-bold uppercase tracking-widest text-[var(--color-orange)] mb-2">
          Step 1 of 9 — Intake
        </p>
        <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-bold mb-2">
          Frame the company
        </h2>
        <p className="font-[family-name:var(--font-body)] text-[var(--color-grey)] text-base italic">
          Stage and sector calibrate how strictly each moat is weighed. Mode shapes the tone.
        </p>
      </div>

      {/* Stage */}
      <section className="mb-8">
        <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold mb-3">Stage</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {STAGES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onStage(s.id)}
              className={`text-left rounded-xl border p-4 transition-all cursor-pointer ${
                stage === s.id
                  ? "border-[var(--color-orange)] bg-[var(--color-orange-vsoft)]"
                  : "border-[var(--color-grey-light)] bg-[var(--color-white)] hover:border-[var(--color-foreground)]"
              }`}
            >
              <p className="font-[family-name:var(--font-heading)] text-base font-bold mb-1">
                {s.label}
              </p>
              <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-grey)]">
                {s.description}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Sector */}
      <section className="mb-8">
        <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold mb-3">Sector</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {SECTORS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onSector(s.id)}
              className={`text-left rounded-xl border px-3 py-2 transition-all cursor-pointer ${
                sector === s.id
                  ? "border-[var(--color-orange)] bg-[var(--color-orange-vsoft)]"
                  : "border-[var(--color-grey-light)] bg-[var(--color-white)] hover:border-[var(--color-foreground)]"
              }`}
            >
              <p className="font-[family-name:var(--font-body)] text-sm">{s.label}</p>
            </button>
          ))}
        </div>
        {sector === "consumer" && (
          <p className="mt-3 font-[family-name:var(--font-body)] text-sm text-[var(--color-grey)] italic">
            Note: Rajaram explicitly excludes Brand from the 8 Moats. A separate Brand overlay will be shown in your results.
          </p>
        )}
      </section>

      {/* Mode */}
      <section>
        <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold mb-3">Mode</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => onMode(m.id)}
              className={`text-left rounded-xl border p-4 transition-all cursor-pointer ${
                mode === m.id
                  ? "border-[var(--color-orange)] bg-[var(--color-orange-vsoft)]"
                  : "border-[var(--color-grey-light)] bg-[var(--color-white)] hover:border-[var(--color-foreground)]"
              }`}
            >
              <p className="font-[family-name:var(--font-heading)] text-base font-bold mb-1">
                {m.label}
              </p>
              <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-grey)]">
                {m.description}
              </p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
