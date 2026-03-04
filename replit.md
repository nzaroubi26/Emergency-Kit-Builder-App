# Emergency Prep Kit Builder

## Overview
A standalone React SPA that lets homeowners configure a personalized emergency preparedness kit mapped to a physical modular storage unit. Built with the BMAD methodology for structured planning and development. Kit state persists to localStorage. Phase 2 adds a cover page, star ratings, "Fill my kit for me", clickable visualizer slots, e-commerce checkout, and analytics.

## Tech Stack
- **Build tool:** Vite 6.x
- **Framework:** React 18.x + TypeScript 5.x (strict mode)
- **Styling:** Tailwind CSS v4.x with CSS custom properties (`@theme` block in globals.css)
- **State management:** Zustand 5.x + persist middleware (localStorage key: `emergency-kit-v1`)
- **Routing:** React Router 6.4+ (Data Router API with `createBrowserRouter`)
- **Icons:** lucide-react (named imports only)
- **Testing:** Vitest 2.x + React Testing Library 16.x + @axe-core/react 4.x
- **E2E Testing:** Playwright (3 critical flows)
- **Analytics:** Google Analytics 4 (via `VITE_ANALYTICS_ID`)
- **Linting:** ESLint 8.x + @typescript-eslint + eslint-plugin-jsx-a11y
- **Formatting:** Prettier 3.x

## Project Structure
```
src/
├── main.tsx                    # Entry — React.StrictMode + App
├── App.tsx                     # RouterProvider root
├── tokens/
│   ├── design-tokens.ts        # Colors, motion — single source of truth
│   └── env.ts                  # Typed env access (VITE_PURCHASE_URL, VITE_ANALYTICS_ID)
├── styles/
│   ├── globals.css             # Tailwind v4 @import, @theme block, CSS custom props
│   └── print.css               # @media print — imported by SummaryScreen only
├── types/
│   ├── kit.types.ts            # KitCategory, KitItem (+ rating, reviewCount), SubkitSelection, ItemSelection, SubkitSize
│   ├── visualizer.types.ts     # SlotState, HousingUnitVisualizerProps
│   └── index.ts                # Barrel re-export
├── data/
│   ├── kitItems.ts             # CATEGORIES, ITEMS (28 items with ratings), ITEMS_BY_CATEGORY, STANDARD_CATEGORY_IDS, ITEM_ICON_OVERRIDES
│   ├── itemImages.ts
│   └── index.ts                # Barrel re-export
├── utils/
│   ├── slotCalculations.ts     # calculateTotalSlots, canFitSize, calculateSlotState, isSlotsAtCapacity
│   ├── categoryUtils.ts        # getCategoryById, getCategoryColor, getCategoryIcon
│   ├── announce.ts             # ARIA live region announcer
│   └── analytics.ts            # GA4 wrapper — Analytics.* typed helpers
├── services/
│   └── checkoutService.ts      # initiateCheckout() — typed CheckoutPayload + CheckoutResult
├── store/
│   └── kitStore.ts             # Zustand store with persist middleware
├── router/
│   ├── index.tsx               # / → CoverScreen; /builder → SubkitSelectionScreen
│   └── guards.ts               # Loader-based navigation guards (redirect to /builder)
├── components/
│   ├── cover/                  # CoverScreen (landing page at /)
│   ├── layout/                 # AppShell (+ GA4 injection), AppHeader, StepProgressIndicator, MobileInterstitial
│   ├── ui/                     # PrimaryButton, SecondaryButton, ConfirmationModal, ImageWithFallback, StarRating
│   ├── visualizer/             # HousingUnitVisualizer, VisualizerSlot (clickable slots), SlotFullIndicator
│   ├── subkit-selection/       # SubkitSelectionScreen (+ onSlotClick), SubkitCard, SizeToggle
│   ├── item-config/            # ItemConfigScreen (+ Fill my kit), CustomSubkitScreen (+ Fill my kit), ItemCard (+ StarRating), QuantitySelector
│   └── summary/                # SummaryScreen (+ checkout integration), SubkitSummarySection
└── hooks/                      # useKitStore, useResponsive
tests/
├── setup.ts                    # @testing-library/jest-dom + config
├── unit/                       # Unit tests (slotCalculations etc.)
├── components/                 # Component tests with axe assertions
└── e2e/                        # Playwright E2E tests (3 flows)
.github/workflows/
└── e2e.yml                     # GitHub Actions Playwright CI runner
```

## Key Commands
- `npm run dev` — Start dev server on port 5000
- `npm run build` — Production build to `dist/`
- `npm run test` — Run tests in watch mode
- `npm run test:run` — Run tests once
- `npm run test:coverage` — Run tests with coverage
- `npm run test:e2e` — Run Playwright E2E tests
- `npm run lint` — ESLint check
- `npm run typecheck` — TypeScript type check

## Architecture Rules
- Named exports only — no `export default`
- `FC<Props>` typed components with co-located `{ComponentName}Props` interface
- No logic in JSX — extract to `const` above return
- Dynamic category colors use inline styles (not Tailwind template literals)
- All animations use `transform` and `opacity` only (GPU-composited)
- Slot state is always computed, never stored in Zustand
- `slotCalculations.ts` requires 100% branch coverage
- Every component test must include at least one axe accessibility assertion
- No snapshot tests
- Analytics calls go through `src/utils/analytics.ts` only — never directly from components

## BMAD Documentation
- PRD Phase 1: `docs/prd/` (9 sharded files)
- PRD Phase 2: `docs/prd-phase2.md`
- Architecture Phase 1: `docs/architecture/` (15 sharded files)
- Architecture Phase 2: `docs/architecture-phase2.md`
- UI/UX Spec Phase 1: `attached_assets/front-end-spec_1772483167624.md`
- UI/UX Spec Phase 2: `docs/front-end-spec-phase2.md`
- Stories Phase 1: `docs/stories/` (21 stories across 5 epics)
- BMAD agents: `.bmad-core/agents/` (persona files for external AI chats)

## Story Progress
### Phase 1 (Complete)
- Story 1.1–1.3: Project Scaffolding, Data Architecture, App Shell: Done
- Story 2.1–2.4: Housing Unit Visualizer (all stories): Done
- Story 3.1–3.4: Subkit Selection (all stories): Done
- Story 4.1–4.5: Item Configuration (all stories): Done
- Story 5.1–5.4: Summary & Print (all stories): Done

### Phase 2 (Complete)
- Story 6.1 (localStorage Persistence): Done
- Story 6.2 (Analytics Instrumentation): Done
- Story 6.3 (Playwright E2E Suite): Done
- Story 6.4 (Cover / Landing Page): Done
- Story 7.1 (Fill My Kit for Me): Done
- Story 7.2 (Clickable Visualizer Slots): Done
- Story 8.1 (Hardcoded Star Ratings): Done
- Story 8.2 (E-commerce Checkout): Done

## Environment Variables
- `VITE_PURCHASE_URL` — Purchase API endpoint for checkout (default: `#`)
- `VITE_ANALYTICS_ID` — Google Analytics 4 measurement ID (optional)

## Route Structure
- `/` — Cover/Landing page (CoverScreen, static, no store dependency)
- `/builder` — Subkit Selection Screen (kit builder entry)
- `/configure/:subkitId` — Item Configuration Screen
- `/configure/custom` — Custom Subkit Browser
- `/summary` — Summary Page (review + checkout)
