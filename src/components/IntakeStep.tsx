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

function optionClasses(selected: boolean): string {
  return `w-full text-left rounded-xl border-2 p-5 transition-all duration-200 cursor-pointer ${
    selected
      ? "border-[var(--color-orange)] bg-[var(--color-orange-vsoft)]"
      : "border-[var(--color-grey-light)] bg-[var(--color-white)] hover:border-[var(--color-grey-lighter)]"
  }`;
}

function labelClasses(selected: boolean): string {
  return `font-[family-name:var(--font-heading)] text-sm font-bold mb-1 ${
    selected ? "text-[var(--color-orange)]" : "text-[var(--color-foreground)]"
  }`;
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
      <div className="mb-6">
        <h2 className="font-[family-name:var(--font-heading)] text-xl md:text-2xl font-bold mb-1">
          Frame the company
        </h2>
        <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-grey)] leading-relaxed">
          Stage and sector calibrate how strictly each moat is weighed. Mode shapes the tone.
        </p>
      </div>

      {/* Stage */}
      <section className="mb-8">
        <p className="font-[family-name:var(--font-heading)] text-xs font-bold uppercase tracking-widest text-[var(--color-orange)] mb-3">
          Stage
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {STAGES.map((s) => {
            const selected = stage === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onStage(s.id)}
                className={optionClasses(selected)}
              >
                <p className={labelClasses(selected)}>{s.label}</p>
                <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-grey)] leading-relaxed">
                  {s.description}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Sector */}
      <section className="mb-8">
        <p className="font-[family-name:var(--font-heading)] text-xs font-bold uppercase tracking-widest text-[var(--color-orange)] mb-3">
          Sector
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {SECTORS.map((s) => {
            const selected = sector === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onSector(s.id)}
                className={`w-full text-left rounded-xl border-2 px-4 py-3 transition-all duration-200 cursor-pointer ${
                  selected
                    ? "border-[var(--color-orange)] bg-[var(--color-orange-vsoft)]"
                    : "border-[var(--color-grey-light)] bg-[var(--color-white)] hover:border-[var(--color-grey-lighter)]"
                }`}
              >
                <p
                  className={`font-[family-name:var(--font-body)] text-sm ${
                    selected
                      ? "text-[var(--color-orange)] font-bold"
                      : "text-[var(--color-foreground)]"
                  }`}
                >
                  {s.label}
                </p>
              </button>
            );
          })}
        </div>
        {sector === "consumer" && (
          <p className="mt-3 font-[family-name:var(--font-body)] text-sm text-[var(--color-grey)] italic leading-relaxed">
            Note: Rajaram explicitly excludes Brand from the 8 Moats. A separate Brand overlay will be shown in your results.
          </p>
        )}
      </section>

      {/* Mode */}
      <section>
        <p className="font-[family-name:var(--font-heading)] text-xs font-bold uppercase tracking-widest text-[var(--color-orange)] mb-3">
          Mode
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {MODES.map((m) => {
            const selected = mode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => onMode(m.id)}
                className={optionClasses(selected)}
              >
                <p className={labelClasses(selected)}>{m.label}</p>
                <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-grey)] leading-relaxed">
                  {m.description}
                </p>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
