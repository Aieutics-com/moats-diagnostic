"use client";

interface ProgressBarProps {
  currentStep: number; // 0 = intake, 1-8 = moat claims
  totalSteps: number; // 9 for v0.1
  label: string;
}

export default function ProgressBar({ currentStep, totalSteps, label }: ProgressBarProps) {
  const pct = Math.round(((currentStep + 1) / totalSteps) * 100);
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-[var(--color-grey)]">
          {label}
        </span>
        <span className="font-[family-name:var(--font-mono)] text-xs text-[var(--color-grey)]">
          {currentStep + 1} / {totalSteps}
        </span>
      </div>
      <div className="h-1 bg-[var(--color-grey-light)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--color-orange)] transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
