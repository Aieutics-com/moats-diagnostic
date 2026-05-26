// Scoring per research §5.3. Deterministic; no LLM grading.

import {
  MOATS,
  type DiagnosticState,
  type Grade,
  type Moat,
  type MoatId,
  type Stage,
  type Verdict,
  stageRelevantQuestions,
} from "./moats-data";

export interface MoatVerdict {
  moatId: MoatId;
  rawVerdict: Verdict; // before prerequisite logic
  verdict: Verdict; // after prerequisite logic
  downgradeReason?: string;
  grades: Grade[]; // grades collected from stage-relevant questions
  aShare: number; // share of A grades
  abShare: number; // share of A or B grades
}

export interface ScoreResult {
  moatVerdicts: MoatVerdict[];
  rawScore: number; // sum of points × stage weight
  composition: { loadBearing: number; aspirational: number; absent: number; na: number };
  rajaramBand: "secure" | "weak" | "vulnerable" | "screwed";
}

// Verdict from evidence grades (research §5.3):
// - A on ≥60% of stage-relevant questions → load-bearing
// - A or B on ≥60% → aspirational
// - otherwise absent
// - claim=na → na (regardless of evidence)
export const deriveVerdict = (
  moat: Moat,
  stage: Stage,
  state: DiagnosticState
): MoatVerdict => {
  const response = state.responses[moat.id];

  if (response.claim === "na") {
    return {
      moatId: moat.id,
      rawVerdict: "na",
      verdict: "na",
      grades: [],
      aShare: 0,
      abShare: 0,
    };
  }

  const questions = stageRelevantQuestions(moat, stage);

  if (questions.length === 0) {
    // Stage has no questions for this moat (e.g. Scale at pre-seed).
    // Fall back to the claim: "have" = aspirational, "building" = absent, null = absent.
    const v: Verdict =
      response.claim === "have"
        ? "aspirational"
        : "absent";
    return { moatId: moat.id, rawVerdict: v, verdict: v, grades: [], aShare: 0, abShare: 0 };
  }

  // Collect grades; missing answers count as D (no evidence).
  const grades: Grade[] = questions.map((q) => response.evidence[q.id] ?? "D");
  const aCount = grades.filter((g) => g === "A").length;
  const abCount = grades.filter((g) => g === "A" || g === "B").length;
  const aShare = aCount / grades.length;
  const abShare = abCount / grades.length;

  let v: Verdict;
  if (aShare >= 0.6) v = "load-bearing";
  else if (abShare >= 0.6) v = "aspirational";
  else v = "absent";

  return { moatId: moat.id, rawVerdict: v, verdict: v, grades, aShare, abShare };
};

// Prerequisite logic (research §5.3): forced downgrades.
//   - Ecosystem cannot be load-bearing unless Workflow ≥ aspirational
//   - Scale cannot be load-bearing unless Physical Infrastructure ≥ aspirational
//     OR Network ≥ aspirational
const applyPrerequisites = (verdicts: MoatVerdict[]): MoatVerdict[] => {
  const byId = new Map(verdicts.map((v) => [v.moatId, v]));
  const meets = (id: MoatId, ...targets: Verdict[]) => {
    const v = byId.get(id);
    return v ? targets.includes(v.verdict) : false;
  };

  return verdicts.map((v) => {
    if (v.moatId === "ecosystem" && v.verdict === "load-bearing") {
      if (!meets("workflow", "load-bearing", "aspirational")) {
        return {
          ...v,
          verdict: "aspirational" as Verdict,
          downgradeReason:
            "Ecosystem downgraded: Workflow must be at least aspirational (Rajaram: platforms require workflow first).",
        };
      }
    }
    if (v.moatId === "scale" && v.verdict === "load-bearing") {
      const phys = meets("physical-infrastructure", "load-bearing", "aspirational");
      const net = meets("network", "load-bearing", "aspirational");
      if (!phys && !net) {
        return {
          ...v,
          verdict: "aspirational" as Verdict,
          downgradeReason:
            "Scale downgraded: pure software cannot achieve this moat. Requires Physical Infrastructure or Network at aspirational or above.",
        };
      }
    }
    return v;
  });
};

const verdictPoints = (v: Verdict): number => {
  switch (v) {
    case "load-bearing":
      return 1;
    case "aspirational":
      return 0.5;
    case "absent":
      return 0;
    case "na":
      return 0;
  }
};

export const scoreState = (state: DiagnosticState): ScoreResult | null => {
  if (!state.stage) return null;
  const stage = state.stage;

  const initial = MOATS.map((m) => deriveVerdict(m, stage, state));
  const verdicts = applyPrerequisites(initial);

  let rawScore = 0;
  const composition = { loadBearing: 0, aspirational: 0, absent: 0, na: 0 };
  for (const v of verdicts) {
    const moat = MOATS.find((m) => m.id === v.moatId)!;
    const weight = moat.weights[stage];
    rawScore += verdictPoints(v.verdict) * weight;
    switch (v.verdict) {
      case "load-bearing":
        composition.loadBearing += 1;
        break;
      case "aspirational":
        composition.aspirational += 1;
        break;
      case "absent":
        composition.absent += 1;
        break;
      case "na":
        composition.na += 1;
        break;
    }
  }

  // Rajaram's threshold band (20VC): ≥4 secure, 2-3 weak, ≤1 vulnerable, 0 "screwed".
  // Applied to raw weighted score.
  let rajaramBand: ScoreResult["rajaramBand"];
  if (rawScore >= 4) rajaramBand = "secure";
  else if (rawScore >= 2) rajaramBand = "weak";
  else if (rawScore > 0) rajaramBand = "vulnerable";
  else rajaramBand = "screwed";

  return { moatVerdicts: verdicts, rawScore, composition, rajaramBand };
};

export const bandLabel = (band: ScoreResult["rajaramBand"]): string => {
  switch (band) {
    case "secure":
      return "Highly durable";
    case "weak":
      return "Weak defensibility";
    case "vulnerable":
      return "Vulnerable";
    case "screwed":
      return "No defensibility";
  }
};

export const bandDescription = (band: ScoreResult["rajaramBand"]): string => {
  switch (band) {
    case "secure":
      return "Rajaram threshold: 4+ weighted points — durable defensibility likely.";
    case "weak":
      return "Rajaram threshold: 2-3 weighted points — weak moat. Strategy needed for compounding.";
    case "vulnerable":
      return "Rajaram threshold: 1 or fewer weighted points — actively vulnerable. Build defensibility or rethink.";
    case "screwed":
      return "Rajaram's own term for zero moats. Rebuild the defensibility plan from scratch.";
  }
};
