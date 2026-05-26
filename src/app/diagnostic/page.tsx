"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MOATS,
  initialState,
  type Claim,
  type DiagnosticState,
  type Grade,
  type Mode,
  type Sector,
  type Stage,
} from "@/lib/moats-data";
import ProgressBar from "@/components/ProgressBar";
import IntakeStep from "@/components/IntakeStep";
import MoatStep from "@/components/MoatStep";
import ResultsPage from "@/components/ResultsPage";

const TOTAL_STEPS = 1 + MOATS.length; // intake + 8 moats

export default function DiagnosticPage() {
  const [state, setState] = useState<DiagnosticState>(initialState);
  const [step, setStep] = useState(0); // 0 = intake, 1..8 = moats
  const [showResults, setShowResults] = useState(false);

  const setStage = useCallback((stage: Stage) => setState((s) => ({ ...s, stage })), []);
  const setSector = useCallback((sector: Sector) => setState((s) => ({ ...s, sector })), []);
  const setMode = useCallback((mode: Mode) => setState((s) => ({ ...s, mode })), []);

  const currentMoat = step > 0 ? MOATS[step - 1] : null;

  const setClaim = useCallback(
    (claim: Claim) => {
      if (!currentMoat) return;
      setState((s) => ({
        ...s,
        responses: {
          ...s.responses,
          [currentMoat.id]: { ...s.responses[currentMoat.id], claim },
        },
      }));
    },
    [currentMoat]
  );

  const setRationale = useCallback(
    (rationale: string) => {
      if (!currentMoat) return;
      setState((s) => ({
        ...s,
        responses: {
          ...s.responses,
          [currentMoat.id]: { ...s.responses[currentMoat.id], rationale },
        },
      }));
    },
    [currentMoat]
  );

  const setEvidence = useCallback(
    (questionId: string, grade: Grade) => {
      if (!currentMoat) return;
      setState((s) => ({
        ...s,
        responses: {
          ...s.responses,
          [currentMoat.id]: {
            ...s.responses[currentMoat.id],
            evidence: { ...s.responses[currentMoat.id].evidence, [questionId]: grade },
          },
        },
      }));
    },
    [currentMoat]
  );

  const setRedTeam = useCallback(
    (redTeam: string) => {
      if (!currentMoat) return;
      setState((s) => ({
        ...s,
        responses: {
          ...s.responses,
          [currentMoat.id]: { ...s.responses[currentMoat.id], redTeam },
        },
      }));
    },
    [currentMoat]
  );

  const canAdvance = useMemo(() => {
    if (step === 0) return state.stage && state.sector && state.mode;
    if (currentMoat) return state.responses[currentMoat.id].claim !== null;
    return false;
  }, [step, state, currentMoat]);

  const isLastStep = step === TOTAL_STEPS - 1;

  const goNext = useCallback(() => {
    if (!canAdvance) return;
    if (step < TOTAL_STEPS - 1) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setShowResults(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [canAdvance, step]);

  const goBack = useCallback(() => {
    if (step > 0) {
      setStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [step]);

  const onRestart = useCallback(() => {
    setState(initialState());
    setStep(0);
    setShowResults(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const progressLabels = [
    { name: "Intake", count: 1 },
    { name: "Moats", count: MOATS.length },
  ];

  return (
    <main className="min-h-screen flex flex-col">
      <header className="px-6 py-4 md:px-12">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="hover:opacity-70 transition-opacity">
            <Image
              src="/aieutics_transparentbg_logo.png"
              alt="Aieutics"
              width={72}
              height={72}
              className="h-[4.5rem] w-auto"
            />
          </Link>
          <span className="font-[family-name:var(--font-heading)] text-xs text-[var(--color-grey)]">
            8 Moats Diagnostic
          </span>
        </div>
      </header>

      <div className="flex-1 px-6 py-8 md:px-12">
        <div className="max-w-3xl mx-auto">
          {!showResults ? (
            <>
              <div className="mb-8 no-print">
                <ProgressBar total={TOTAL_STEPS} current={step} labels={progressLabels} />
              </div>

              {step === 0 ? (
                <IntakeStep
                  stage={state.stage}
                  sector={state.sector}
                  mode={state.mode}
                  onStage={setStage}
                  onSector={setSector}
                  onMode={setMode}
                />
              ) : currentMoat && state.stage ? (
                <MoatStep
                  moat={currentMoat}
                  totalMoats={MOATS.length}
                  stage={state.stage}
                  response={state.responses[currentMoat.id]}
                  onClaim={setClaim}
                  onRationale={setRationale}
                  onEvidence={setEvidence}
                  onRedTeam={setRedTeam}
                />
              ) : null}

              <div className="flex items-center justify-between mt-10 pt-6 border-t border-[var(--color-grey-light)] no-print">
                <button
                  onClick={goBack}
                  disabled={step === 0}
                  className={`font-[family-name:var(--font-heading)] text-sm font-bold px-8 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
                    step === 0
                      ? "text-[var(--color-grey-light)] cursor-not-allowed"
                      : "border border-[var(--color-grey-light)] text-[var(--color-grey)] hover:border-[var(--color-foreground)] hover:text-[var(--color-foreground)]"
                  }`}
                >
                  Back
                </button>

                <button
                  onClick={goNext}
                  disabled={!canAdvance}
                  className={`font-[family-name:var(--font-heading)] text-sm font-bold px-10 py-3 rounded-xl transition-all duration-300 cursor-pointer ${
                    canAdvance
                      ? "bg-[var(--color-orange)] text-white shadow-[0_0_15px_rgba(255,95,31,0.2)] hover:shadow-[0_0_30px_rgba(255,95,31,0.3)] hover:scale-[1.02]"
                      : "bg-[var(--color-grey-light)] text-[var(--color-grey)] cursor-not-allowed"
                  }`}
                >
                  {isLastStep ? "See results" : step === 0 ? "Begin moat probe" : "Next moat"}
                </button>
              </div>
            </>
          ) : (
            <ResultsPage state={state} onRestart={onRestart} />
          )}
        </div>
      </div>

      <footer className="px-6 py-4 border-t border-[var(--color-grey-light)]">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-2">
          <Image
            src="/aieutics_transparentbg_logo.png"
            alt="Aieutics"
            width={20}
            height={20}
            className="h-5 w-auto opacity-40"
          />
          <p className="font-[family-name:var(--font-body)] text-xs text-[var(--color-grey)]">
            Built by{" "}
            <a
              href="https://www.aieutics.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--color-orange)] transition-colors"
            >
              Aieutics
            </a>
            . Framework after Gokul Rajaram (20VC, 16 March 2026).
          </p>
        </div>
      </footer>
    </main>
  );
}
