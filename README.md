# 8 Moats Diagnostic

[![Deploy to GitHub Pages](https://github.com/Aieutics-com/moats-diagnostic/actions/workflows/deploy.yml/badge.svg)](https://github.com/Aieutics-com/moats-diagnostic/actions/workflows/deploy.yml)


Interactive self-assessment that probes the gap between a startup's *claimed* defensibility and its *evidenced* defensibility across Gokul Rajaram's 8 Moats (20VC, 16 March 2026): data, workflow, regulatory, distribution, ecosystem, network, physical infrastructure, scale.

## Status

**v0.1** (in progress): intake (stage / sector / mode) + per-moat claim capture for all 8 moats. No evidence probes, verdicts, or radar yet.

**v0.2** (planned): evidence probes per moat (research §5.2 question banks), load-bearing / aspirational / absent verdict per moat, octagonal radar with evidence-grade rings, stage-weighted headline score, Rajaram threshold band.

**v0.3** (planned): public-company comparator, red-team prompts, Brand and Process Power / Counter-Positioning overlays, analyst mode side-by-side compare.

**v0.4** (planned): narrative-vs-evidence cross-check — founder uploads deck/one-pager, server-side LLM extracts claimed moats, tool flags the say/do gap.

## Architecture

Mirrors the [`poc-diagnostic v.1.1`](../poc-diagnostic%20v.1.1/) pattern: Next.js 16, React 19, Tailwind v4, Recharts. Static export deployable to GitHub Pages.

- `trailingSlash: true` in `next.config.ts` (mandatory for GH Pages — see workspace `diagnostic-tools.md` rule).
- Brand tokens in `src/app/globals.css` mirror the Aieutics design system at `~/Vaults/Aieutics/aieutics-vault/ip/design-system/tokens/`.
- Canonical moat data in `src/lib/moats-data.ts` — single source of truth.

## Develop

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` for the landing page, `http://localhost:3000/diagnostic/` for the wizard, or `http://localhost:3000/diagnostic-demo/` for the demo bypass route.

## References

- Research: `/Users/alexandra.n/Downloads/compass_artifact_wf-5dbbf13f-9c67-45df-a23e-c9181dc827a8_text_markdown.md`
- Plan: `/Users/alexandra.n/.claude/plans/users-alexandra-n-downloads-compass-art-rustling-patterson.md`
- Upstream skill reference: `/Users/alexandra.n/Applications/xClaude/Claude-Skills/pitch-deck-reviewer/references/tech-assessment.md`
