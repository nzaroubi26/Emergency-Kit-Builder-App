# 4. Technical Constraints and Integration Requirements

## Existing Technology Stack

| Category | Technology | Version | Sprint 1 Usage |
|---|---|---|---|
| Language | TypeScript | 5.x strict | All new code; strict: true mandatory |
| Framework | React | 18.x | 4 new screens; new MCQTile, ForkCard, KitSummaryCard components |
| Build Tool | Vite | 6.x | No new env vars |
| Styling | Tailwind CSS | v4.x | All new screens; dynamic colors via inline styles |
| State Management | Zustand | 5.x + persist | New MCQ store with sessionStorage; existing kit store unchanged |
| Routing | React Router | 6.4+ | 4 new routes with guards |
| Testing (Unit) | Vitest + RTL | 2.x / 16.x | New component tests for all 4 new screens |
| Testing (E2E) | Playwright | latest | New E2E: MCQ → Fork → Review & Order and MCQ → Fork → Visualizer |
| Deployment | Vercel | — | No new env vars; existing pipeline |

## Integration Approach

- **New routes:** 4 new routes added to the React Router config inside `AppShell` children. No existing routes modified. Route guards enforce sequential progression (see architecture Section 4).
- **MCQ store:** New separate Zustand store (`src/store/mcqStore.ts`). Shape: `{ emergencyTypes: EmergencyType[], householdComposition: HouseholdOption[], kitPath: KitPath }` plus setters and `resetMCQ`. Persisted to sessionStorage under `emergency-mcq-v1`. `kitPath` excluded from persistence via `partialize`.
- **Essentials bundle constant:** `src/data/essentialsConfig.ts` — typed constant using existing `SubkitSize` type. Not hardcoded inline in components.
- **MobileInterstitial bypass:** `MOBILE_EXEMPT_ROUTES` array in `AppShell.tsx` exempts Phase 3 routes from the existing mobile guard. These screens are mobile-first.
- **Entry point wiring:** "Build My Kit" CTA on the cover page routes to `/build` (MCQ Screen 1). This is the only change to an existing screen.

## New Files

- `src/store/mcqStore.ts` — MCQ Zustand store with sessionStorage persistence
- `src/data/essentialsConfig.ts` — `ESSENTIALS_BUNDLE` constant
- `src/components/mcq/MCQEmergencyTypeScreen.tsx` — Q1 screen at `/build`
- `src/components/mcq/MCQHouseholdScreen.tsx` — Q2 screen at `/build/household`
- `src/components/fork/ForkScreen.tsx` — Fork screen at `/choose`
- `src/components/review/ReviewOrderScreen.tsx` — Review & Order screen at `/review`
- `src/components/review/KitSummaryCard.tsx` — Dual-path kit summary component

## Modified Files

- `src/router/index.tsx` — 4 new routes + imports
- `src/router/guards.ts` — 3 new guard functions + `useMCQStore` import
- `src/components/layout/AppShell.tsx` — `MOBILE_EXEMPT_ROUTES` + conditional bypass
- `src/components/cover/CoverScreen.tsx` — CTA `to="/builder"` → `to="/build"`

## Risk Assessment

| Area | Risk | Mitigation |
|---|---|---|
| MCQ state persistence | Low | Separate store, sessionStorage, no kit store collision |
| Entry point route change | Low | Single CTA route update; existing flow untouched downstream |
| MobileInterstitial bypass | Low | Explicit exemption list; no route tree restructure |
| Essentials bundle config | Low | Config file pattern makes it easy to evolve in future sprints |
| Review & Order shell scope | Low | Prototype surface only; no real fulfillment or payment |
| "None of the Above" mutex logic | Medium | Clear spec in FR4 + Sally's spec; requires explicit test coverage |
| Route guards | Low | Three guards appended to existing guards file; extensible for Sprint 2 |

---
