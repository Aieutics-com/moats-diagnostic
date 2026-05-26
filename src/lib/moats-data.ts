// Canonical 8 Moats per Gokul Rajaram (20VC, 16 March 2026).
// Order is load-bearing — Data is moat #1 by Rajaram's own enumeration.

export type Stage = "pre-seed" | "seed" | "series-a";
export type Sector =
  | "horizontal-saas"
  | "vertical-ai"
  | "marketplace"
  | "fintech"
  | "healthtech"
  | "deeptech"
  | "consumer";
export type Mode = "founder" | "analyst";
export type Claim = "have" | "building" | "na";
export type Verdict = "load-bearing" | "aspirational" | "absent" | "na";
export type Grade = "A" | "B" | "C" | "D";

export interface GradeOption {
  grade: Grade;
  label: string;
}

export interface EvidenceQuestion {
  id: string;
  prompt: string;
  stages: Stage[];
  options: GradeOption[]; // A = strongest evidence, D = weakest
}

export type MoatId =
  | "data"
  | "workflow"
  | "regulatory"
  | "distribution"
  | "ecosystem"
  | "network"
  | "physical-infrastructure"
  | "scale";

export interface Moat {
  id: MoatId;
  index: number; // 1..8 — canonical order
  name: string;
  shortName: string;
  rajaramQuote: string;
  description: string;
  evidence: EvidenceQuestion[];
  redTeamPrompt: string;
  weights: Record<Stage, number>; // research §4.6
}

export const STAGES: { id: Stage; label: string; description: string }[] = [
  { id: "pre-seed", label: "Pre-seed", description: "Idea to first customers." },
  { id: "seed", label: "Seed", description: "PMF in progress; <50 customers." },
  { id: "series-a", label: "Series A", description: "PMF found; scaling." },
];

export const SECTORS: { id: Sector; label: string }[] = [
  { id: "horizontal-saas", label: "Horizontal B2B SaaS" },
  { id: "vertical-ai", label: "Vertical SaaS / Vertical AI" },
  { id: "marketplace", label: "Marketplace" },
  { id: "fintech", label: "Fintech" },
  { id: "healthtech", label: "Healthtech" },
  { id: "deeptech", label: "Deeptech / Hardware-AI" },
  { id: "consumer", label: "Consumer" },
];

export const MODES: { id: Mode; label: string; description: string }[] = [
  {
    id: "founder",
    label: "Founder",
    description:
      "Self-assess your own company. Educational framing; aspirational verdicts contextualised.",
  },
  {
    id: "analyst",
    label: "Analyst",
    description:
      "Assess a portfolio or pipeline company. Evidence required; comparable across companies.",
  },
];

// Standard option shape used by most questions.
const standardOpts = (a: string, b: string, c: string, d: string): GradeOption[] => [
  { grade: "A", label: a },
  { grade: "B", label: b },
  { grade: "C", label: c },
  { grade: "D", label: d },
];

export const MOATS: Moat[] = [
  {
    id: "data",
    index: 1,
    name: "Data Moat",
    shortName: "Data",
    rajaramQuote:
      "It truly has to be proprietary. It has to be data that nobody else has access to.",
    description:
      "Proprietary dataset that gets better with every interaction and is hard to recreate by scraping or foundation-model training.",
    evidence: [
      {
        id: "data-proprietary",
        prompt:
          "How proprietary is the dataset your product produces, relative to what a competitor could assemble from public data + foundation models?",
        stages: ["pre-seed", "seed", "series-a"],
        options: standardOpts(
          "Truly proprietary; feedback loop documented and dataset is unique",
          "Dataset exists and is unique, but the feedback loop is not yet closed",
          "Architecture supports it; dataset not yet generating",
          "We have volume but no demonstrable uniqueness"
        ),
      },
      {
        id: "data-feedback-loop",
        prompt: "How tight is the feedback loop between user actions and model behaviour?",
        stages: ["seed", "series-a"],
        options: standardOpts(
          "End-to-end loop running with measured product improvement",
          "Loop exists; improvement anecdotal not measured",
          "Loop designed but not running in production",
          "No feedback loop"
        ),
      },
      {
        id: "data-half-life",
        prompt: "How relevant is your data >12 months after collection (Rajaram's half-life test)?",
        stages: ["seed", "series-a"],
        options: standardOpts(
          "Long half-life: ERP/CRM/longitudinal records, relevant for years",
          "Medium half-life: 6-12 months",
          "Short half-life: 3-6 months",
          "Transient: <3 months (Slack-style conversational state)"
        ),
      },
      {
        id: "data-improvement",
        prompt:
          "Can you point to specific product behaviours measurably better today than 12 months ago because of accumulated data?",
        stages: ["series-a"],
        options: standardOpts(
          "Three or more concrete examples with metrics",
          "One or two examples with metrics",
          "Claimed improvements but no metrics",
          "No demonstrable improvement from accumulated data"
        ),
      },
      {
        id: "data-portability",
        prompt: "What prevents customers extracting and porting this data?",
        stages: ["series-a"],
        options: standardOpts(
          "Both contractual and technical lock-in",
          "Either contractual or technical lock-in, not both",
          "Stated intent, not enforced",
          "Nothing — data is portable on request"
        ),
      },
    ],
    redTeamPrompt:
      "What could a well-funded competitor do in 6 months to access or synthesise equivalent data?",
    weights: { "pre-seed": 1.5, seed: 2, "series-a": 2 },
  },
  {
    id: "workflow",
    index: 2,
    name: "Workflow Moat",
    shortName: "Workflow",
    rajaramQuote:
      "The deeper you're embedded in the company, running their operations, moving their money, the deeper the workflow mode is.",
    description:
      "Understanding a customer's process so deeply that the product becomes how work gets done.",
    evidence: [
      {
        id: "workflow-map",
        prompt: "How well do you understand the customer workflow you sit inside?",
        stages: ["pre-seed", "seed", "series-a"],
        options: standardOpts(
          "Full map with named upstream/downstream/adjacent steps and dependencies",
          "Partial map; key steps documented",
          "Hypothesised — not yet validated with customers",
          "Workflow not articulated"
        ),
      },
      {
        id: "workflow-roles",
        prompt: "How many user roles in a typical customer touch the product weekly?",
        stages: ["seed", "series-a"],
        options: standardOpts(
          "Four or more distinct roles weekly",
          "Two or three roles",
          "One role with multiple users",
          "Single user, single role"
        ),
      },
      {
        id: "workflow-retention",
        prompt: "What gross retention and net revenue retention have you observed?",
        stages: ["seed", "series-a"],
        options: standardOpts(
          "NRR ≥ 120%",
          "NRR 100-119%",
          "GRR ≥ 90%, NRR < 100%",
          "GRR < 90%"
        ),
      },
      {
        id: "workflow-named-in-process",
        prompt: "Do any customers' internal process documents name your product?",
        stages: ["series-a"],
        options: standardOpts(
          "Documented examples we have seen",
          "Verbal confirmation, not seen",
          "Claimed but not verified",
          "No evidence"
        ),
      },
      {
        id: "workflow-48h-test",
        prompt: "If you turned the product off for 48 hours, what would break?",
        stages: ["series-a"],
        options: standardOpts(
          "Mission-critical operations halt for the customer",
          "Significant friction; manual workarounds required",
          "Inconvenience but the customer functions",
          "Nothing breaks"
        ),
      },
    ],
    redTeamPrompt:
      "Could an agentic AI sit next to your product and siphon seats incrementally without triggering migration? (Rajaram's Zendesk-erosion argument)",
    weights: { "pre-seed": 1.5, seed: 2, "series-a": 2 },
  },
  {
    id: "regulatory",
    index: 3,
    name: "Regulatory Moat",
    shortName: "Regulatory",
    rajaramQuote:
      "Licences, capital required, multi-year procurement contracts.",
    description:
      "Willingness to navigate complexity that others avoid, turning compliance into competitive advantage.",
    evidence: [
      {
        id: "reg-licences",
        prompt:
          "Which licences, registrations, or accreditations do you hold? What is the cost and elapsed time for a competitor to obtain each?",
        stages: ["pre-seed", "seed", "series-a"],
        options: standardOpts(
          "Held with quantified competitor barrier (years and capital)",
          "In train with a stated timeline to obtain",
          "Aware of the regime; not yet pursued",
          "No regulatory engagement"
        ),
      },
      {
        id: "reg-caps",
        prompt: "Are there caps on the number of licensed operators in your jurisdictions?",
        stages: ["seed", "series-a"],
        options: standardOpts(
          "Capped regime and we hold a slot",
          "Capped regime; slot not yet held",
          "Uncapped but high effective barrier",
          "Open regime"
        ),
      },
      {
        id: "reg-roadmap",
        prompt: "Are you embedded in regulatory roadmap-setting?",
        stages: ["series-a"],
        options: standardOpts(
          "Named participant in a formal working group",
          "Regular access to regulators",
          "Applied for working-group membership",
          "No regulator-side relationship"
        ),
      },
    ],
    redTeamPrompt:
      "Could deregulation, sandbox regimes, or jurisdictional arbitrage erode this moat in 12-24 months?",
    weights: { "pre-seed": 1, seed: 1, "series-a": 1 },
  },
  {
    id: "distribution",
    index: 4,
    name: "Distribution Moat",
    shortName: "Distribution",
    rajaramQuote: "A distribution mode where you have proprietary exclusive distribution.",
    description:
      "Trust, channel access, partnerships, and smart go-to-market design that competitors cannot easily replicate.",
    evidence: [
      {
        id: "dist-channel-mix",
        prompt: "What is your current channel mix and how exclusive are the leading channels?",
        stages: ["pre-seed", "seed", "series-a"],
        options: standardOpts(
          "Exclusive channel driving >40% of logos",
          "Preferred-access channel; not formally exclusive",
          "Paid + outbound mix; no defensibility",
          "Founder-led only"
        ),
      },
      {
        id: "dist-concentration",
        prompt: "How defensible is the channel that drives most of your logos?",
        stages: ["seed", "series-a"],
        options: standardOpts(
          "Contractual exclusivity + partner economic dependency",
          "Behavioural exclusivity",
          "Dominant but contestable",
          "No channel concentration"
        ),
      },
      {
        id: "dist-cac",
        prompt: "What share of channel partners' revenue comes from your product?",
        stages: ["series-a"],
        options: standardOpts(
          "Partners derive ≥20% of their revenue from us",
          "Partners derive 5-20%",
          "Partners exist; low economic dependency",
          "No partner economics in play"
        ),
      },
    ],
    redTeamPrompt:
      "Could a well-funded competitor build a multiplayer product mechanic that displaces your distribution lock in 6-12 months?",
    weights: { "pre-seed": 0.25, seed: 0.5, "series-a": 1 },
  },
  {
    id: "ecosystem",
    index: 5,
    name: "Ecosystem Moat",
    shortName: "Ecosystem",
    rajaramQuote:
      "You can vibe-code an e-commerce hosting platform, no problem. But can you vibe-code the hundreds of thousands of developers and third parties who built all these applications on Shopify?",
    description:
      "Platform where many third parties build on and rely on you. Requires Workflow first.",
    evidence: [
      {
        id: "eco-thirdparties",
        prompt:
          "How many third parties build on or integrate with your product, and how much of their revenue depends on you?",
        stages: ["seed", "series-a"],
        options: standardOpts(
          "100+ third parties with measurable revenue dependency",
          "20-100 third parties",
          "5-20 third parties",
          "<5 third parties or all integrations built in-house"
        ),
      },
      {
        id: "eco-integrations-per-customer",
        prompt:
          "What is the average number of third-party integrations per customer (Rajaram's Shopify benchmark: 5-6)?",
        stages: ["series-a"],
        options: standardOpts(
          "5 or more integrations per customer",
          "2-4 integrations per customer",
          "1 integration",
          "No third-party integrations operational"
        ),
      },
    ],
    redTeamPrompt:
      "If you closed APIs tomorrow, would the ecosystem reorganise around an alternative within 12 months?",
    weights: { "pre-seed": 0, seed: 0.25, "series-a": 0.5 },
  },
  {
    id: "network",
    index: 6,
    name: "Network Moat",
    shortName: "Network",
    rajaramQuote:
      "AI can vibe-code the ability to access restaurants, but it can't vibe-code liquidity, courier density, reputation, history.",
    description:
      "Multi-sided liquidity, density per geography, reputation/trust accumulation. Distinguish from virality.",
    evidence: [
      {
        id: "net-nfx-type",
        prompt:
          "Which NFX sub-type describes your network, and can you quantify value per added node?",
        stages: ["pre-seed", "seed", "series-a"],
        options: standardOpts(
          "Sub-type named (direct / 2-sided / data scale) AND value-per-node quantified",
          "Sub-type named; value qualitative",
          "Network effect claimed without naming the sub-type",
          "Viral effects mislabelled as network (NFX distinguishes the two)"
        ),
      },
      {
        id: "net-density",
        prompt:
          "What share of your activity occurs in your single most geographically or topically dense cluster?",
        stages: ["seed", "series-a"],
        options: standardOpts(
          "≥40% of activity in a dense cluster",
          "20-40% in a cluster",
          "<20%; some clustering",
          "Uniformly thin distribution"
        ),
      },
      {
        id: "net-chicken-egg",
        prompt: "How is the supply/demand asymmetry handled?",
        stages: ["series-a"],
        options: standardOpts(
          "Balanced, or asymmetry is designed and working",
          "Imbalanced but explicit plan exists",
          "Hand-to-mouth liquidity",
          "No chicken-and-egg playbook"
        ),
      },
    ],
    redTeamPrompt:
      "Could multi-homing, disintermediation, or regional unbundling collapse your network within 18 months?",
    weights: { "pre-seed": 0.25, seed: 0.5, "series-a": 1 },
  },
  {
    id: "physical-infrastructure",
    index: 7,
    name: "Physical Infrastructure Moat",
    shortName: "Physical",
    rajaramQuote:
      "Wherever you have atoms, it makes for a moat that's hard to displace.",
    description:
      "Deployed hardware, warehouses, fibre, data centres, or fleet that competitors cannot replicate quickly.",
    evidence: [
      {
        id: "phys-assets",
        prompt: "What physical assets does your product depend on?",
        stages: ["pre-seed", "seed", "series-a"],
        options: standardOpts(
          "Deployed footprint at scale (devices, warehouses, fibre, fabs)",
          "Pilot deployments",
          "Capex committed but nothing deployed yet",
          "Pure software — no physical assets"
        ),
      },
      {
        id: "phys-replication",
        prompt: "What capex and time would it take a competitor to match your physical footprint?",
        stages: ["seed", "series-a"],
        options: standardOpts(
          "More than 5 years and >$100M capex",
          "2-5 years",
          "6-24 months",
          "Replicable in under 6 months"
        ),
      },
    ],
    redTeamPrompt:
      "Could robotics or automation lower the cost of building equivalent physical capacity within 24 months?",
    weights: { "pre-seed": 1, seed: 1, "series-a": 1 },
  },
  {
    id: "scale",
    index: 8,
    name: "Scale Moat",
    shortName: "Scale",
    rajaramQuote:
      "If by virtue of your scale, your costs are so low that it's hard to replicate.",
    description:
      "Unit cost decay with volume; learning-curve effects. Rajaram: pure software companies cannot achieve this moat.",
    evidence: [
      {
        id: "scale-unit-cost",
        prompt: "What measured unit-cost decay do you have per doubling of volume?",
        stages: ["series-a"],
        options: standardOpts(
          "Measured decay >20% per doubling of volume",
          "Measured decay 5-20% per doubling",
          "Claimed scale advantage; not measured",
          "No measured decay, or pure-software claim (Rajaram: cannot achieve Scale)"
        ),
      },
    ],
    redTeamPrompt:
      "Are you a pure-software company claiming Scale? Rajaram explicitly says this moat is unavailable to you — reframe via Network or Physical Infrastructure.",
    weights: { "pre-seed": 0, seed: 0, "series-a": 0.25 },
  },
];

export interface MoatResponse {
  moatId: MoatId;
  claim: Claim | null;
  rationale: string;
  evidence: Record<string, Grade>; // question id → selected grade
  redTeam: string;
}

export interface DiagnosticState {
  stage: Stage | null;
  sector: Sector | null;
  mode: Mode | null;
  responses: Record<MoatId, MoatResponse>;
}

export const initialResponses = (): Record<MoatId, MoatResponse> => {
  const r = {} as Record<MoatId, MoatResponse>;
  for (const m of MOATS) {
    r[m.id] = {
      moatId: m.id,
      claim: null,
      rationale: "",
      evidence: {},
      redTeam: "",
    };
  }
  return r;
};

export const initialState = (): DiagnosticState => ({
  stage: null,
  sector: null,
  mode: null,
  responses: initialResponses(),
});

export const stageRelevantQuestions = (moat: Moat, stage: Stage): EvidenceQuestion[] =>
  moat.evidence.filter((q) => q.stages.includes(stage));
