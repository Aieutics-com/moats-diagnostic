"use client";

import { MOATS, type MoatResponse } from "@/lib/moats-data";
import type { MoatVerdict } from "@/lib/scoring";

interface VerdictCardProps {
  verdict: MoatVerdict;
  response: MoatResponse;
  consumerSector: boolean;
}

const verdictColor = (v: MoatVerdict["verdict"]) => {
  switch (v) {
    case "load-bearing":
      return "bg-[var(--color-green)] text-white";
    case "aspirational":
      return "bg-[var(--color-amber)] text-white";
    case "absent":
      return "bg-[var(--color-red)] text-white";
    case "na":
      return "bg-[var(--color-grey-light)] text-[var(--color-grey)]";
  }
};

const verdictLabel = (v: MoatVerdict["verdict"]) => {
  switch (v) {
    case "load-bearing":
      return "Load-bearing";
    case "aspirational":
      return "Aspirational";
    case "absent":
      return "Absent";
    case "na":
      return "N/A";
  }
};

export default function VerdictCard({ verdict, response }: VerdictCardProps) {
  const moat = MOATS.find((m) => m.id === verdict.moatId);
  if (!moat) return null;

  return (
    <div className="rounded-xl border border-[var(--color-grey-light)] bg-[var(--color-white)] p-5">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <p className="font-[family-name:var(--font-mono)] text-xs text-[var(--color-grey)] uppercase tracking-widest">
            Moat {moat.index}
          </p>
          <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold">
            {moat.name}
          </h3>
        </div>
        <span
          className={`flex-shrink-0 font-[family-name:var(--font-mono)] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${verdictColor(
            verdict.verdict
          )}`}
        >
          {verdictLabel(verdict.verdict)}
        </span>
      </div>

      {verdict.downgradeReason && (
        <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-amber)] mb-3 italic">
          {verdict.downgradeReason}
        </p>
      )}

      {response.rationale && (
        <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-foreground)] mb-3">
          <span className="font-bold">Your claim: </span>
          {response.rationale}
        </p>
      )}

      {verdict.grades.length > 0 && (
        <p className="font-[family-name:var(--font-mono)] text-xs text-[var(--color-grey)] mb-2">
          Evidence: {verdict.grades.join(" · ")} &nbsp;|&nbsp; A-share{" "}
          {Math.round(verdict.aShare * 100)}% &nbsp;|&nbsp; A+B-share{" "}
          {Math.round(verdict.abShare * 100)}%
        </p>
      )}

      {verdict.verdict === "aspirational" && (
        <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-grey)] italic">
          What would make this load-bearing: collect evidence that lifts the A-share to ≥60% on the questions you saw.
        </p>
      )}

      {verdict.verdict === "absent" && response.claim === "have" && (
        <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-red)] italic">
          Say/do gap: you claimed this moat, but the evidence does not support it.
        </p>
      )}

      {response.redTeam && (
        <details className="mt-3">
          <summary className="font-[family-name:var(--font-mono)] text-xs font-bold text-[var(--color-grey)] uppercase tracking-widest cursor-pointer">
            Red-team note
          </summary>
          <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-grey)] mt-2">
            {response.redTeam}
          </p>
        </details>
      )}
    </div>
  );
}
