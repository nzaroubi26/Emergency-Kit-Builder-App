# Emergency Prep Kit Builder

## Overview
A standalone React SPA that lets homeowners configure a personalized emergency preparedness kit mapped to a physical modular storage unit. Built with the BMAD methodology for structured planning and development. All state is session-based (no backend in MVP).

## Tech Stack
- **Build tool:** Vite 6.x
- **Framework:** React 18.x + TypeScript 5.x (strict mode)
- **Styling:** Tailwind CSS v4.x with CSS custom properties (`@theme` block in globals.css)
- **State management:** Zustand 5.x
- **Routing:** React Router 6.4+ (Data Router API with `createBrowserRouter`)
- **Icons:** lucide-react (named imports only)
- **Testing:** Vitest 2.x + React Testing Library 16.x + @axe-core/react 4.x
- **Linting:** ESLint 8.x + @typescript-eslint + eslint-plugin-jsx-a11y
- **Formatting:** Prettier 3.x

## Project Structure
```
src/
├── main.tsx                    # Entry — React.StrictMode + App
├── App.tsx                     # RouterProvider root
├── tokens/
│   ├── design-tokens.ts        # Colors, motion — single source of truth
│   └── env.ts                  # Typed env access (VITE_PURCHASE_URL)
├── styles/
│   ├── globals.css             # Tailwind v4 @import, @theme block, CSS custom props
│   └── print.css               # @media print — imported by SummaryScreen only
├── types/
│   ├── kit.types.ts            # KitCategory, KitItem, SubkitSelection, ItemSelection, SubkitSize
│   ├── visualizer.types.ts     # SlotState, HousingUnitVisualizerProps
│   └── index.ts                # Barrel re-export
├── data/
│   ├── kitItems.ts             # CATEGORIES, ITEMS, ITEMS_BY_CATEGORY, STANDARD_CATEGORY_IDS, ITEM_ICON_OVERRIDES
│   └── index.ts                # Barrel re-export
├── utils/
│   ├── slotCalculations.ts     # calculateTotalSlots, canFitSize, calculateSlotState, isSlotsAtCapacity (100% branch coverage)
│   ├── categoryUtils.ts        # getCategoryById, getCategoryColor, getCategoryIcon
│   └── announce.ts             # ARIA live region announcer (initAnnouncer, announcePolite, announceAssertive)
├── store/                      # Zustand store (kitStore.ts)
├── router/
│   ├── index.tsx               # createBrowserRouter routes
│   └── guards.ts               # Loader-based navigation guards
├── components/
│   ├── layout/                 # AppShell, AppHeader, StepProgressIndicator, MobileInterstitial
│   ├── ui/                     # PrimaryButton, SecondaryButton, ConfirmationModal, ImageWithFallback
│   ├── visualizer/             # HousingUnitVisualizer, VisualizerSlot
│   ├── subkit-selection/       # SubkitSelectionScreen, SubkitCard, SizeToggle
│   ├── item-config/            # ItemConfigScreen, CustomSubkitScreen, ItemCard, QuantitySelector
│   └── summary/                # SummaryScreen, SubkitSummarySection
└── hooks/                      # useKitStore, useResponsive
tests/
├── setup.ts                    # @testing-library/jest-dom + config
├── unit/                       # Unit tests (slotCalculations etc.)
└── components/                 # Component tests with axe assertions
```

## Key Commands
- `npm run dev` — Start dev server on port 5000
- `npm run build` — Production build to `dist/`
- `npm run test` — Run tests in watch mode
- `npm run test:run` — Run tests once
- `npm run test:coverage` — Run tests with coverage
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

## BMAD Documentation
- PRD: `docs/prd/` (9 sharded files)
- Architecture: `docs/architecture/` (15 sharded files)
- UI/UX Spec: `attached_assets/front-end-spec_1772483167624.md`
- Stories: `docs/stories/` (21 stories across 5 epics)
- BMAD agents: `.bmad-core/agents/` (persona files for external AI chats)

## Story Progress
- Story 1.1 (Project Scaffolding): Done
- Story 1.2 (Data Architecture & Types): Done
- Story 1.3 (Application Shell & Navigation): Done
- Stories 2.1–5.4: Draft

## Environment Variables
- `VITE_PURCHASE_URL` — Placeholder purchase URL for "Get My Kit" CTA (MVP default: `#`)
