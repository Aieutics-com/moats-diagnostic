"use client";

import { useMemo } from "react";
import {
  MOATS,
  SECTORS,
  type DiagnosticState,
} from "@/lib/moats-data";
import { scoreState, bandLabel, bandDescription } from "@/lib/scoring";
import { findComparators, moatLabel } from "@/lib/comparator";
import MoatRadar from "./MoatRadar";
import VerdictCard from "./VerdictCard";

interface ResultsPageProps {
  state: DiagnosticState;
  onRestart: () => void;
}

export default function ResultsPage({ state, onRestart }: ResultsPageProps) {
  const result = useMemo(() => scoreState(state), [state]);

  if (!result || !state.stage) {
    return (
      <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-grey)]">
        Cannot score: missing stage or claims.
      </p>
    );
  }

  const consumerSector = state.sector === "consumer";
  const sectorLabel = SECTORS.find((s) => s.id === state.sector)?.label ?? "—";
  const comparators = findComparators(result.moatVerdicts);
  const sayDoGap = result.moatVerdicts.some((v) => {
    const r = state.responses[v.moatId];
    return r.claim === "have" && v.verdict === "absent";
  });

  return (
    <div>
      {/* Headline */}
      <div className="mb-10 text-center">
        <p className="font-[family-name:var(--font-mono)] text-xs font-bold uppercase tracking-widest text-[var(--color-orange)] mb-2">
          Diagnostic complete
        </p>
        <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold mb-3">
          {bandLabel(result.rajaramBand)}
        </h2>
        <p className="font-[family-name:var(--font-body)] text-base text-[var(--color-grey)] max-w-xl mx-auto mb-4">
          Weighted score{" "}
          <span className="font-bold text-[var(--color-foreground)]">
            {result.rawScore.toFixed(1)}
          </span>{" "}
          across 8 moats &middot; stage {state.stage} &middot; sector {sectorLabel}
        </p>
        <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-grey)] max-w-xl mx-auto italic">
          {bandDescription(result.rajaramBand)}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
          <span className="font-[family-name:var(--font-mono)] text-xs px-3 py-1 rounded-full bg-[var(--color-green)] text-white">
            {result.composition.loadBearing} load-bearing
          </span>
          <span className="font-[family-name:var(--font-mono)] text-xs px-3 py-1 rounded-full bg-[var(--color-amber)] text-white">
            {result.composition.aspirational} aspirational
          </span>
          <span className="font-[family-name:var(--font-mono)] text-xs px-3 py-1 rounded-full bg-[var(--color-red)] text-white">
            {result.composition.absent} absent
          </span>
          {result.composition.na > 0 && (
            <span className="font-[family-name:var(--font-mono)] text-xs px-3 py-1 rounded-full bg-[var(--color-grey-light)] text-[var(--color-grey)]">
              {result.composition.na} N/A
            </span>
          )}
        </div>
      </div>

      {/* Radar */}
      <section className="mb-12">
        <MoatRadar verdicts={result.moatVerdicts} />
      </section>

      {/* Say/do gap callout */}
      {sayDoGap && (
        <section className="mb-10 rounded-xl border border-[var(--color-red)] bg-[var(--color-warm-bg)] p-5">
          <p className="font-[family-name:var(--font-mono)] text-xs font-bold uppercase tracking-widest text-[var(--color-red)] mb-2">
            Say/do gap detected
          </p>
          <p className="font-[family-name:var(--font-body)] text-sm">
            On at least one moat you claimed defensibility but the evidence does not support it. This is the canonical failure mode in moat assessment (research §5.4). See the affected verdict card{result.moatVerdicts.filter(v => v.verdict === 'absent' && state.responses[v.moatId].claim === 'have').length === 1 ? '' : 's'} below.
          </p>
        </section>
      )}

      {/* Verdict cards */}
      <section className="mb-12">
        <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold mb-4">
          Verdicts by moat
        </h3>
        <div className="space-y-4">
          {result.moatVerdicts
            .slice()
            .sort((a, b) => {
              const order = MOATS.findIndex((m) => m.id === a.moatId);
              const orderB = MOATS.findIndex((m) => m.id === b.moatId);
              return order - orderB;
            })
            .map((v) => (
              <VerdictCard
                key={v.moatId}
                verdict={v}
                response={state.responses[v.moatId]}
                consumerSector={consumerSector}
              />
            ))}
        </div>
      </section>

      {/* Comparators */}
      {comparators.length > 0 && (
        <section className="mb-12">
          <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold mb-1">
            Closest public-company comparators
          </h3>
          <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-grey)] mb-4 italic">
            Matched on overlap of load-bearing moats. A bias counter-measure (research §4.5):
            if no comparator looks remotely like your business, your claimed profile may be unrealistic.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {comparators.map(({ comparator, overlapMoats }) => (
              <div
                key={comparator.company}
                className="rounded-xl border border-[var(--color-grey-light)] bg-[var(--color-white)] p-4"
              >
                <p className="font-[family-name:var(--font-heading)] text-lg font-bold mb-2">
                  {comparator.company}
                </p>
                <p className="font-[family-name:var(--font-mono)] text-xs text-[var(--color-orange)] uppercase tracking-widest mb-2">
                  Overlap: {overlapMoats.map(moatLabel).join(" · ")}
                </p>
                <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-grey)] mb-2">
                  {comparator.notes}
                </p>
                <p className="font-[family-name:var(--font-body)] text-xs text-[var(--color-grey)] italic">
                  {comparator.rajaramScore}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Brand overlay for consumer */}
      {consumerSector && (
        <section className="mb-12 rounded-xl border border-[var(--color-orange)] bg-[var(--color-orange-vsoft)] p-5">
          <p className="font-[family-name:var(--font-mono)] text-xs font-bold uppercase tracking-widest text-[var(--color-orange)] mb-2">
            Brand overlay
          </p>
          <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold mb-2">
            Rajaram excludes Brand from the 8 Moats
          </h3>
          <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-foreground)] mb-3">
            You selected the consumer sector. Rajaram&apos;s framework systematically under-weights brand because he treats it as derivative of network or distribution effects. For consumer businesses where brand carries genuine defensibility, score it separately against the Thiel/Helmer rubric:
          </p>
          <ul className="font-[family-name:var(--font-body)] text-sm text-[var(--color-foreground)] space-y-1 list-disc pl-5">
            <li>Does customers&apos; preference for your brand carry a measurable price premium?</li>
            <li>Would customers refuse to use a functionally identical generic competitor at lower price?</li>
            <li>Has brand strength been measured (unaided recall, NPS, share-of-search) and is it growing year-over-year?</li>
            <li>Does brand investment compound: each marketing dollar lifts brand equity, not just leads?</li>
          </ul>
        </section>
      )}

      {/* Gaps overlay */}
      <section className="mb-12 rounded-xl border border-[var(--color-grey-light)] bg-[var(--color-white)] p-5">
        <p className="font-[family-name:var(--font-mono)] text-xs font-bold uppercase tracking-widest text-[var(--color-grey)] mb-2">
          Auxiliary diagnostics (Helmer)
        </p>
        <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold mb-2">
          Two defensibility mechanisms the framework does not capture
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="font-[family-name:var(--font-heading)] text-sm font-bold mb-1">Process Power</p>
            <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-grey)]">
              Operational excellence that compounds invisibly (Toyota Production System). Relevant for ops-heavy plays. Not in Rajaram&apos;s 8.
            </p>
          </div>
          <div>
            <p className="font-[family-name:var(--font-heading)] text-sm font-bold mb-1">Counter-Positioning</p>
            <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-grey)]">
              Incumbent will not respond because the response cannibalises their existing business model (Vanguard vs Fidelity). Highly relevant for AI-native challengers attacking seat-based SaaS incumbents.
            </p>
          </div>
        </div>
      </section>

      <div className="text-center">
        <button
          onClick={onRestart}
          type="button"
          className="font-[family-name:var(--font-heading)] text-sm font-bold border border-[var(--color-grey-light)] text-[var(--color-grey)] hover:border-[var(--color-foreground)] hover:text-[var(--color-foreground)] px-8 py-3 rounded-xl transition-all cursor-pointer"
        >
          Start over
        </button>
      </div>
    </div>
  );
}
