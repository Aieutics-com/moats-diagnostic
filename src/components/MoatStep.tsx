"use client";

import type {
  Claim,
  Grade,
  Moat,
  MoatResponse,
  Stage,
} from "@/lib/moats-data";
import { stageRelevantQuestions } from "@/lib/moats-data";

interface MoatStepProps {
  moat: Moat;
  totalMoats: number;
  stage: Stage;
  response: MoatResponse;
  onClaim: (claim: Claim) => void;
  onRationale: (text: string) => void;
  onEvidence: (questionId: string, grade: Grade) => void;
  onRedTeam: (text: string) => void;
}

const CLAIM_OPTIONS: { id: Claim; label: string; description: string }[] = [
  {
    id: "have",
    label: "We have this moat",
    description: "There is evidence it is doing strategic work today.",
  },
  {
    id: "building",
    label: "We are building it",
    description: "Architectural intent or early signs, not yet load-bearing.",
  },
  {
    id: "na",
    label: "Not applicable",
    description: "Confirmed not relevant to this business at this stage.",
  },
];

export default function MoatStep({
  moat,
  totalMoats,
  stage,
  response,
  onClaim,
  onRationale,
  onEvidence,
  onRedTeam,
}: MoatStepProps) {
  const questions = stageRelevantQuestions(moat, stage);
  const showEvidence = response.claim && response.claim !== "na";

  return (
    <div>
      {/* Heading */}
      <div className="mb-8">
        <p className="font-[family-name:var(--font-mono)] text-xs font-bold uppercase tracking-widest text-[var(--color-orange)] mb-2">
          Moat {moat.index} of {totalMoats}
        </p>
        <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-bold mb-3">
          {moat.name}
        </h2>
        <p className="font-[family-name:var(--font-body)] text-base text-[var(--color-foreground)] mb-3">
          {moat.description}
        </p>
        <blockquote className="border-l-2 border-[var(--color-orange)] pl-4 font-[family-name:var(--font-body)] text-sm text-[var(--color-grey)] italic">
          &ldquo;{moat.rajaramQuote}&rdquo;
          <span className="not-italic block mt-1 text-xs">
            — Gokul Rajaram, 20VC, 16 March 2026
          </span>
        </blockquote>
      </div>

      {/* Claim */}
      <section className="mb-8">
        <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold mb-3">
          What is your claim on this moat?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {CLAIM_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onClaim(opt.id)}
              className={`text-left rounded-xl border p-4 transition-all cursor-pointer ${
                response.claim === opt.id
                  ? "border-[var(--color-orange)] bg-[var(--color-orange-vsoft)]"
                  : "border-[var(--color-grey-light)] bg-[var(--color-white)] hover:border-[var(--color-foreground)]"
              }`}
            >
              <p className="font-[family-name:var(--font-heading)] text-base font-bold mb-1">
                {opt.label}
              </p>
              <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-grey)]">
                {opt.description}
              </p>
            </button>
          ))}
        </div>
      </section>

      {showEvidence && (
        <>
          {/* Rationale */}
          <section className="mb-8">
            <label
              htmlFor={`rationale-${moat.id}`}
              className="block font-[family-name:var(--font-heading)] text-base font-bold mb-2"
            >
              In one or two sentences, why?
            </label>
            <textarea
              id={`rationale-${moat.id}`}
              value={response.rationale}
              onChange={(e) => onRationale(e.target.value)}
              placeholder={
                response.claim === "have"
                  ? "e.g. We sit inside the daily ops of 12 clinics; their schedulers cannot work without us."
                  : "e.g. We are wiring the feedback loop now; first signal due Q3."
              }
              rows={3}
              className="w-full rounded-xl border border-[var(--color-grey-light)] bg-[var(--color-white)] p-4 font-[family-name:var(--font-body)] text-base focus:outline-none focus:border-[var(--color-orange)] resize-y"
            />
          </section>

          {/* Evidence */}
          {questions.length > 0 && (
            <section className="mb-8">
              <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold mb-1">
                Evidence
              </h3>
              <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-grey)] mb-4 italic">
                {questions.length} stage-relevant question
                {questions.length === 1 ? "" : "s"}. Pick the answer that best describes today, not next quarter.
              </p>
              <div className="space-y-5">
                {questions.map((q, qi) => (
                  <div
                    key={q.id}
                    className="rounded-xl border border-[var(--color-grey-light)] bg-[var(--color-white)] p-4"
                  >
                    <p className="font-[family-name:var(--font-body)] text-sm font-bold mb-3">
                      <span className="font-[family-name:var(--font-mono)] text-xs text-[var(--color-orange)] mr-2">
                        {String(qi + 1).padStart(2, "0")}.
                      </span>
                      {q.prompt}
                    </p>
                    <div className="space-y-2">
                      {q.options.map((opt) => {
                        const selected = response.evidence[q.id] === opt.grade;
                        return (
                          <button
                            key={opt.grade}
                            type="button"
                            onClick={() => onEvidence(q.id, opt.grade)}
                            className={`w-full text-left rounded-lg border px-3 py-2 transition-all cursor-pointer ${
                              selected
                                ? "border-[var(--color-orange)] bg-[var(--color-orange-vsoft)]"
                                : "border-[var(--color-grey-light)] bg-[var(--color-background)] hover:border-[var(--color-foreground)]"
                            }`}
                          >
                            <span className="font-[family-name:var(--font-mono)] text-xs font-bold text-[var(--color-orange)] mr-2">
                              {opt.grade}
                            </span>
                            <span className="font-[family-name:var(--font-body)] text-sm">
                              {opt.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Red team */}
          <section>
            <label
              htmlFor={`redteam-${moat.id}`}
              className="block font-[family-name:var(--font-heading)] text-base font-bold mb-2"
            >
              Red team (optional)
            </label>
            <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-grey)] mb-3 italic">
              {moat.redTeamPrompt}
            </p>
            <textarea
              id={`redteam-${moat.id}`}
              value={response.redTeam}
              onChange={(e) => onRedTeam(e.target.value)}
              placeholder="One sentence is enough."
              rows={2}
              className="w-full rounded-xl border border-[var(--color-grey-light)] bg-[var(--color-white)] p-3 font-[family-name:var(--font-body)] text-sm focus:outline-none focus:border-[var(--color-orange)] resize-y"
            />
          </section>
        </>
      )}

      {response.claim === "na" && (
        <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-grey)] italic">
          Marked not applicable. This moat will appear on your radar as &ldquo;N/A — confirmed not relevant&rdquo; rather than as a zero.
        </p>
      )}
    </div>
  );
}
