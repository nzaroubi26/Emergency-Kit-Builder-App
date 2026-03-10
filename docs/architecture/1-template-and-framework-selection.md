# 1. Template and Framework Selection

## Project Context

This is a **Phase 2 brownfield enhancement** of the fully-delivered Phase 1 MVP. All Phase 2 extension points were pre-wired in the Phase 1 architecture: the `onSlotClick` prop, `KitItem` nullable product fields, `ENV.purchaseUrl`, and the Zustand `persist` middleware path. Phase 2 work is additive by design — no existing component interfaces change.

The five Phase 1 files that required targeted corrections (`SubkitTypeSelectionNew.tsx` → `SubkitSelectionScreen.tsx`, `SummaryPage.tsx` → `SummaryScreen.tsx`, `ItemQuestionnaireFlow.tsx` → `ItemConfigScreen.tsx`, `kitItems.ts`, `ImageWithFallback`) are confirmed complete. Phase 2 builds on the corrected, renamed files.

## Scaffold

No external starter template. Standard **Vite + React + TypeScript** scaffold. All Phase 2 code conforms to the existing project patterns without exception.

## Key Phase 2 Framework Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| localStorage persistence | Zustand `persist` middleware | One wrapper change to `kitStore.ts`; zero consumer changes; Phase 3 clear path |
| Analytics | Google Analytics 4 | Non-blocking; native e-commerce event support; free; `VITE_ANALYTICS_ID` env var |
| E2E testing | Playwright + GitHub Actions | Standard Playwright CI; native GitHub + Vercel integration |
| Partial star rendering | CSS width-clip technique | Two stacked star layers; top layer clipped to `(rating/5 * 100)%` width; no SVG path math |
| Fill my kit for me | Derived state (not stored) | Checkbox reads as checked when all items selected; calls existing `toggleItem` in loop; no new store fields |
| MobileInterstitial | Retained (deferred to Phase 3) | `MobileInterstitial.tsx` and `useResponsive.ts` remain in place; full mobile responsiveness ships in Phase 3 alongside Bazaarvoice |
| `resetKit()` + persist | `set({ ...initial })` | Zustand persist writes empty state back to localStorage automatically; no `clearStorage()` needed at call site |

## Phase 2 Modified and New Files

| File | Action | Key Changes |
|------|--------|-------------|
| `src/components/cover/CoverScreen.tsx` | **New** | Cover page at `/`; static; no store dependency; mobile-ready from day one |
| `src/components/ui/StarRating.tsx` | **New** | CSS width-clip star rendering; aria-label; brand-accent filled stars |
| `src/services/checkoutService.ts` | **New** | `initiateCheckout()` — typed `CheckoutPayload` + `CheckoutResult`; POST to `ENV.purchaseUrl` |
| `src/utils/analytics.ts` | **New** | GA4 wrapper; `Analytics.*` typed helpers; all calls silently try/catch |
| `src/store/kitStore.ts` | Modified | Wrap `create<KitStore>()` with `persist` middleware; storage key `emergency-kit-v1` |
| `src/types/kit.types.ts` | Modified | Add `rating: number \| null` and `reviewCount: number \| null` to `KitItem` |
| `src/data/kitItems.ts` | Modified | Populate `rating` and `reviewCount` on all 28 items |
| `src/router/index.tsx` | Modified | `/` → CoverScreen; `/builder` → SubkitSelectionScreen; all guards redirect to `/builder` |
| `src/router/guards.ts` | Modified | All `redirect('/')` calls updated to `redirect('/builder')` |
| `src/tokens/env.ts` | Modified | Add `analyticsId: import.meta.env['VITE_ANALYTICS_ID']` |
| `src/components/layout/AppShell.tsx` | Modified | GA4 script injection via `useEffect`; `MobileInterstitial` retained unchanged |
| `src/components/layout/MobileInterstitial.tsx` | **Unchanged** | Mobile barrier retained; full mobile responsiveness deferred to Phase 3 |
| `src/hooks/useResponsive.ts` | **Unchanged** | Retained alongside `MobileInterstitial`; deferred to Phase 3 |
| `src/components/subkit-selection/SubkitSelectionScreen.tsx` | Modified | Passes `onSlotClick` handler to `HousingUnitVisualizer` |
| `src/components/item-config/ItemConfigScreen.tsx` | Modified | Add Fill my kit for me checkbox; render `StarRating` per item |
| `src/components/item-config/CustomSubkitScreen.tsx` | Modified | Add Fill my kit for me checkbox; render `StarRating` per item |
| `src/components/summary/SummaryScreen.tsx` | Modified | CTA triggers `initiateCheckout`; loading state; dismissible error; no `StarRating` |

## Brownfield Rollback Strategy

The Phase 1 rollback strategy (git branch per story; `v0-pre-refactor` tag; merge to `main` only after QA approval) applies identically to Phase 2. Story branches follow `story/6.1-localstorage`, `story/6.2-analytics`, etc.

Phase 2 risk levels:

| File / Area | Risk | Reason |
|-------------|------|--------|
| `kitStore.ts` — persist middleware | Medium | Rehydration edge cases must be verified (missing key, corrupted data) |
| `router/index.tsx` — route restructure | Medium | `/` to `/builder` rename; existing bookmarks break; communicate before Epic 6 ships |
| `SummaryScreen.tsx` — checkout | Medium | New async API call; error states must not corrupt kit state |
| `KitItem` type extension | Low | Two additive nullable fields; all existing consumers unaffected |
| `AppShell.tsx` — MobileInterstitial | None | MobileInterstitial retained unchanged in Phase 2; no regression risk |
| `CoverScreen.tsx` | Low | New static screen; no store dependency |
| `StarRating.tsx` | Low | New presentational component |
| `checkoutService.ts` | Low | New isolated service module |
| `analytics.ts` | Low | New isolated utility; silently try/catch on all calls |

## Phase 2.5 Framework Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| SubkitStatsStrip derivation pattern | Parent pre-computes `weightLbs` and `volumePct`; passes as props | Consistent with Rule 13 (derived state never stored in Zustand). No internal state in the component. All conversion logic lives exclusively in `slotCalculations.ts` pure functions — single source of truth, fully testable in isolation. The UX spec's Component Library entry lists raw `weightGrams`/`volumeIn3` props; that entry is superseded by PRD Story 9.3 AC1 and the Technical Decisions table, which are the authoritative spec. |
| Visualizer exterior approach | Interior markup only — `div` elements; no SVG, no canvas, no new npm packages | `HousingUnitVisualizer` props interface (`slots`, `readOnly`, `onSlotClick`) is unchanged. The outer shell (frame, handle tab, wheel guards) lives entirely inside the component's root element and is invisible to all consumers. Both the interactive variant (SubkitSelectionScreen) and the read-only variant (SummaryScreen) render the shell identically. |
| No new npm dependencies | Zero new packages introduced in Phase 2.5 | All Phase 2.5 styling uses the existing Tailwind v4 + CSS custom properties pipeline. Dynamic category color on the volume bar fill uses inline `style={{ backgroundColor: categoryColor }}` per existing Rule 8 (Section 11) — never Tailwind arbitrary values. Asymmetric border radius on wheel guards (outer corners rounded, inner corners square) uses explicit inline `borderRadius` style if Tailwind classes cannot achieve the asymmetric result cleanly. |

## Phase 2.5 Modified and New Files

| File | Action | Key Changes |
|------|--------|-------------|
| `src/types/kit.types.ts` | Modified | Add `weightGrams: number \| null` and `volumeIn3: number \| null` to `KitItem` after `reviewCount` |
| `src/data/kitItems.ts` | Modified | Populate `weightGrams` and `volumeIn3` on all 28 items per Story 9.1 AC2 lookup table; no item has a null value for either field in Phase 2.5 |
| `src/utils/slotCalculations.ts` | Modified | Append `calculateSubkitWeightLbs` and `calculateSubkitVolumePct` after all existing exports; no existing function modified |
| `src/components/item-config/ItemConfigScreen.tsx` | Modified | Import and render `SubkitStatsStrip` between subkit heading/accent bar and item grid; derive `weightLbs` and `volumePct` inline from existing `itemSelections` store data |
| `src/components/item-config/CustomSubkitScreen.tsx` | Modified | Identical `SubkitStatsStrip` treatment; container capacity derived from the custom subkit's selected size |
| `src/components/summary/SummaryScreen.tsx` | Modified | Add kit-level stats row above `SubkitSummarySection` list; add per-subkit inline weight/volume to each `SubkitSummarySection` heading row |
| `src/components/visualizer/HousingUnitVisualizer.tsx` | Modified | Add `div.visualizer-outer-shell` wrapping existing slot grid; handle tab child `div`; two wheel guard child `div`s; exported props interface unchanged |
| `src/components/item-config/SubkitStatsStrip.tsx` | **New** | Purely presentational strip; no internal state; no store dependency; all values received as props |
| `tests/components/SubkitStatsStrip.test.tsx` | **New** | 6 test cases per Story 9.3 AC10 |
| `tests/unit/slotCalculations.test.ts` | Extended | 8 new test cases appended (4 per new function); all pre-existing test cases untouched |

---
