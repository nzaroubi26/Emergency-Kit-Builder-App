# 1. Template and Framework Selection

## Project Context

This is a **brownfield refactor** of an existing React project. The Developer Implementation Notes in the UI/UX Specification identify existing files (`SubkitTypeSelectionNew.tsx`, `SummaryPage.tsx`, `ItemQuestionnaireFlow.tsx`, `kitItems.ts`, `ImageWithFallback`) that require targeted corrections. This document defines the **target state** — all existing components must be refactored to conform to these patterns.

## Scaffold

No external starter template. The foundation is a standard **Vite + React + TypeScript** scaffold, which the existing project is assumed to already approximate. The focus is aligning the existing codebase to the patterns defined here.

## Key Framework Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Build tool | Vite 6.x | Fastest HMR; first-class TS + React + Tailwind v4 support; trivial static export to Vercel |
| Framework | React 18.x + TypeScript 5.x strict | Per PRD; `strict: true` mandatory |
| State management | Zustand 5.x | Kit state is deeply cross-cutting with computed slot values; avoids Provider nesting; Phase 2 localStorage is one middleware line |
| Routing | React Router v6.4+ | Data Router API handles `/configure/:subkitId` guards cleanly; loader-based redirects for invalid direct navigation |
| Testing | Vitest + RTL + axe-core/react | Natural Vite companion; matches spec a11y automation requirement |
| Icons | lucide-react (named imports only) | Specified in UX spec; named imports mandatory for tree-shaking |

## Existing Files — Required Corrections

| Existing File | Action | Key Changes |
|---------------|--------|-------------|
| `SubkitTypeSelectionNew.tsx` → `SubkitSelectionScreen.tsx` | Rename + refactor | Top-to-bottom fill; `>= 3` minimum; 9-category colors; SizeToggle; slot-based constraint; `opacity-45 cursor-not-allowed` disabled state |
| `SummaryPage.tsx` → `SummaryScreen.tsx` | Rename + refactor | Add `HousingUnitVisualizer readOnly={true}`; 'Get My Kit' CTA; `window.print()` replacing .txt export; remove weight/volume display |
| `ItemQuestionnaireFlow.tsx` → `ItemConfigScreen.tsx` | Rename + refactor | Remove dual volume bars; add `EmptyContainerOption`; cap quantity at 10; replace free-form Custom with category browser |
| `kitItems.ts` | Correct in place | Add 4 items + Clothing category; remove Repairs/Tools entirely; remove Starlink |
| `ImageWithFallback` | Correct in place | Fallback = category tint bg + centered category icon 32px + bottom gradient overlay |
| All files | Global | Replace all dark theme classes with light theme per Section 8 |

## Brownfield Rollback Strategy

The five files being modified carry the following risk levels:

| File | Risk Level | Reason |
|------|-----------|--------|
| `SubkitTypeSelectionNew.tsx` | High | Full slot logic rewrite |
| `ItemQuestionnaireFlow.tsx` | High | Custom subkit logic replaced |
| `SummaryPage.tsx` | Medium | Mostly additive changes |
| `kitItems.ts` | Low | Data only |
| `ImageWithFallback` | Low | Fallback rendering only |

**Strategy: Git branch per story, corrections spread across epics.**

1. **Pre-refactor tag:** Before any story begins, ensure the current working state is committed and tagged on `main` (e.g., `git tag v0-pre-refactor`). This is the unconditional restore point.

2. **Branch per story:** Each story runs on its own branch (`story/1.1-scaffolding`, `story/2.1-visualizer`, etc.). The SM agent creates the story; the Dev agent works the branch. Nothing merges to `main` until the story is marked Done by QA.

3. **Corrections spread across epics — not batched into Story 1.1.** Each existing file is corrected in the story where it is first logically required:
   - `kitItems.ts` → corrected in **Story 1.2** (data architecture)
   - `SubkitTypeSelectionNew.tsx` → corrected in **Epic 3** (subkit selection)
   - `ItemQuestionnaireFlow.tsx` → corrected in **Epic 4** (item configuration)
   - `SummaryPage.tsx` → corrected in **Epic 5** (summary page)
   - `ImageWithFallback` → corrected in **Epic 4** (first screen to render item images)

4. **Regression on a story branch:** `git checkout main` restores the last QA-approved state instantly.

5. **Nuclear option:** `git checkout v0-pre-refactor` restores the entire project to its pre-refactor state in one command if multiple merged stories produce cascading regressions.

---
