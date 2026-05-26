// Public-company comparator (research §4.5).
// Match by which moats score as load-bearing in the user's profile.

import { MOATS, type MoatId } from "./moats-data";
import type { MoatVerdict } from "./scoring";

interface Comparator {
  company: string;
  moats: MoatId[]; // moats Rajaram (or the research) cites as load-bearing
  rajaramScore: string; // verbatim quote where available
  notes: string;
}

const LIBRARY: Comparator[] = [
  {
    company: "Spotify",
    moats: ["data", "workflow"],
    rajaramScore: "Data exemplar — Discover product, decade of listening behaviour.",
    notes: "Data flywheel pairs with workflow embedding in user playlists.",
  },
  {
    company: "Google",
    moats: ["data", "ecosystem", "distribution"],
    rajaramScore: "X-thread single-word Data exemplar.",
    notes: "Data + distribution (default search) + ecosystem (Android, Chrome).",
  },
  {
    company: "NetSuite",
    moats: ["workflow", "data"],
    rajaramScore: "Workflow exemplar — scored 1.0 (full point) on 20VC.",
    notes: "ERP that runs the business: deepest workflow embedding category.",
  },
  {
    company: "Veeva",
    moats: ["workflow", "regulatory", "data"],
    rajaramScore: "X-thread single-word Workflow exemplar.",
    notes: "Vertical SaaS for life sciences: workflow + regulatory compliance + data.",
  },
  {
    company: "Coinbase",
    moats: ["regulatory", "workflow", "distribution"],
    rajaramScore: "Regulatory exemplar — state-by-state MTLs + FinCEN.",
    notes: "Multi-year licensure timelines make displacement impossible.",
  },
  {
    company: "Intuit (QuickBooks)",
    moats: ["distribution", "workflow", "ecosystem"],
    rajaramScore: "Distribution exemplar — CPA network only earns QuickBooks.",
    notes: "Distribution through trained accountants + deep workflow embedding.",
  },
  {
    company: "Shopify",
    moats: ["ecosystem", "workflow", "distribution"],
    rajaramScore: "Ecosystem exemplar — hundreds of thousands of developers.",
    notes: "5-6 third-party integrations per merchant on average.",
  },
  {
    company: "Salesforce",
    moats: ["workflow", "distribution", "ecosystem"],
    rajaramScore: "Scored 3 on 20VC: workflow + distribution + ecosystem.",
    notes: "Pure-software so Scale is explicitly excluded by Rajaram.",
  },
  {
    company: "Atlassian",
    moats: ["data", "workflow", "ecosystem"],
    rajaramScore: "Scored 3 on 20VC: data + workflow + ecosystem.",
    notes: "Developer workflow data + marketplace.",
  },
  {
    company: "Monday.com",
    moats: ["workflow"],
    rajaramScore: "Scored 1 on 20VC: workflow only.",
    notes: "Rajaram's benchmark for a single-moat company at scale.",
  },
  {
    company: "Zendesk",
    moats: ["workflow"],
    rajaramScore: "Workflow scored 0.5 by Rajaram — lighter embedding.",
    notes: "Exposed to AI-agent seat erosion (Rajaram's example).",
  },
  {
    company: "DoorDash",
    moats: ["network", "data"],
    rajaramScore: "Network exemplar — liquidity, courier density, reputation.",
    notes: "Marketplace with strong asymptotic density per geography.",
  },
  {
    company: "Facebook",
    moats: ["network", "data"],
    rajaramScore: "X-thread single-word Network exemplar.",
    notes: "Personal/direct network effect (NFX taxonomy).",
  },
  {
    company: "Amazon",
    moats: ["physical-infrastructure", "scale", "ecosystem", "distribution"],
    rajaramScore: "Physical Infrastructure and Scale exemplar.",
    notes: "Warehouses + scale economics + marketplace ecosystem.",
  },
  {
    company: "TSMC",
    moats: ["physical-infrastructure", "scale", "regulatory"],
    rajaramScore: "Scale and Physical Infrastructure exemplar (semiconductor fabs).",
    notes: "Capital intensity + multi-year fab build cycles.",
  },
  {
    company: "NVIDIA",
    moats: ["scale", "ecosystem", "physical-infrastructure"],
    rajaramScore: "X-thread single-word Scale exemplar.",
    notes: "CUDA ecosystem + scale + supply-chain dominance.",
  },
  {
    company: "Toast",
    moats: ["physical-infrastructure", "workflow", "distribution"],
    rajaramScore: "Physical infrastructure example — free-but-encumbered hardware.",
    notes: "Hardware deployment creates switching costs.",
  },
  {
    company: "ServiceTitan",
    moats: ["workflow", "ecosystem"],
    rajaramScore: "Compound-or-die exemplar: 32 products feeding workflow + ecosystem.",
    notes: "Vertical AI full-stack — replaces labour budgets.",
  },
];

export interface ComparatorMatch {
  comparator: Comparator;
  overlapCount: number;
  overlapMoats: MoatId[];
}

export const findComparators = (verdicts: MoatVerdict[], limit = 3): ComparatorMatch[] => {
  const loadBearing = new Set(
    verdicts.filter((v) => v.verdict === "load-bearing").map((v) => v.moatId)
  );
  if (loadBearing.size === 0) {
    // Fall back to aspirational + load-bearing.
    const fallback = new Set(
      verdicts
        .filter((v) => v.verdict === "load-bearing" || v.verdict === "aspirational")
        .map((v) => v.moatId)
    );
    return rank(fallback, limit);
  }
  return rank(loadBearing, limit);
};

const rank = (userMoats: Set<MoatId>, limit: number): ComparatorMatch[] => {
  return LIBRARY.map((c) => {
    const overlap = c.moats.filter((m) => userMoats.has(m));
    return { comparator: c, overlapCount: overlap.length, overlapMoats: overlap };
  })
    .filter((m) => m.overlapCount > 0)
    .sort((a, b) => b.overlapCount - a.overlapCount)
    .slice(0, limit);
};

export const moatLabel = (id: MoatId): string =>
  MOATS.find((m) => m.id === id)?.shortName ?? id;
