# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this app is

A homeowner-facing SPA for configuring a personalized emergency preparedness kit that maps 1:1 to a physical modular storage unit. The user flow: land on a cover page → pick **subkits** (sized containers: small/medium/large) → fill each subkit with **items** drawn from **categories** (water, food, first aid, light, tools, etc.) → review a summary with running weight/volume/price totals → check out via a mock e-commerce endpoint → land on an order-confirmation screen.

Core concepts (see `src/types/`):
- **`KitCategory`** — grouping of items (e.g. "Water & Hydration"); carries a color + icon used across the UI.
- **`KitItem`** — a purchasable SKU with price, weight, volume, star rating, slot footprint, and optional image/icon override. Catalog is static (`src/data/kitItems.ts`, ~28 items).
- **`SubkitSelection`** — one container the user has chosen (id + size). A kit is a list of these plus an optional "custom" subkit.
- **`SubkitSize`** — `'small' | 'medium' | 'large'`; controls total slot capacity, weight cap, and volume cap.
- **`ItemSelection`** — `{ itemId, quantity }` scoped to a subkit. Items consume slots based on `item.slotsRequired * quantity`.

Visualizer: `HousingUnitVisualizer` renders the physical unit with per-subkit slot grids. Slots are **clickable** (deep-link into that subkit's config screen) and show fill state computed from the current item selections. Key UX affordances: "Fill my kit for me" (auto-populates a subkit from a curated default), size toggle (shows whether current contents still fit when shrinking), and a sliding cart sidebar accessible from the header.

Phases shipped (per `replit.md`): Phase 1 (core builder + summary + print), Phase 2 (persistence, analytics, cover page, ratings, clickable slots, checkout), Phase 2.5 (weight/volume tracking, visualizer exterior redesign), Phase 3 (cart sidebar + order confirmation + inline pricing everywhere).

## Commands

```bash
npm run dev            # Vite dev server on port 5000 (host 0.0.0.0)
npm run build          # tsc typecheck + vite build; also copies dist/index.html → dist/200.html (SPA fallback)
npm run preview        # Preview production build
npm run lint           # ESLint over src/
npm run typecheck      # tsc --noEmit (strict mode, noUnusedLocals, noUnusedParameters)
npm run test           # Vitest watch mode
npm run test:run       # Vitest single run
npm run test:coverage  # Vitest with v8 coverage (src/utils, src/store, src/components)
npm run test:e2e       # Playwright; uses $PLAYWRIGHT_CHROMIUM_PATH if set (Nix/Replit)
```

Run a single Vitest file or test name:
```bash
npx vitest run tests/unit/slotCalculations.test.ts
npx vitest run -t "calculates slot capacity"
```

Run a single Playwright test:
```bash
npx playwright test tests/e2e/kit-builder.spec.ts -g "happy path"
```

Playwright's `webServer` config auto-starts `npm run dev` on port 5000; don't launch it yourself before running E2E.

## Architecture

**Single-page React app** backed by a Zustand store that persists to `localStorage` under key `emergency-kit-v1`. No backend — "checkout" posts to `VITE_PURCHASE_URL` via `src/services/checkoutService.ts`.

**Routing** uses React Router 6.4 Data Router (`createBrowserRouter` in `src/router/index.tsx`) with **loader-based guards** in `src/router/guards.ts` that redirect to `/builder` when the store lacks prerequisites. Routes: `/` (CoverScreen, no store dependency) → `/builder` → `/configure/:subkitId` or `/configure/custom` → `/summary` → `/confirmation`. The build copies `dist/index.html` to `dist/200.html` so static hosts serve the SPA shell for unknown paths.

**State model** — the Zustand store (`src/store/kitStore.ts`) holds raw user selections only. Derived quantities (slot occupancy, weight, volume, subtotals) are **computed on read** via pure functions in `src/utils/slotCalculations.ts` and never stored. This is a hard rule: if you find yourself adding computed state to the store, refactor to a selector/util instead. `slotCalculations.ts` requires 100% branch coverage.

**Design tokens** live in `src/tokens/design-tokens.ts` (colors, motion) and the Tailwind v4 `@theme` block in `src/styles/globals.css` — these are the single source of truth. Category colors are dynamic per item and must be applied via **inline styles**, not Tailwind template-literal class names (which Tailwind can't statically extract). Animations must use `transform` and `opacity` only (GPU-composited).

**Typed env access** goes through `src/tokens/env.ts`, never `import.meta.env` directly. Analytics (GA4) goes through `src/utils/analytics.ts` — components call `Analytics.*` helpers, never `gtag` directly. ARIA live-region announcements go through `src/utils/announce.ts`.

**BMAD methodology** — planning docs (PRD, architecture, front-end spec, stories) are sharded under `docs/` across multiple phases (Phase 1, 2, 2.5, 3, plus Sprint 2/3). `.bmad-core/core-config.yaml` is the index; `replit.md` tracks per-story completion status. When working on a story, read the matching `docs/stories/*.md` and the sharded architecture files it references.

## Coding conventions (enforced by review, not lint)

- **Named exports only** — no `export default` anywhere in `src/`.
- Components are typed `FC<Props>` with a co-located `{ComponentName}Props` interface.
- No logic in JSX — extract to `const` above the `return`.
- Every component test must include at least one `axe` accessibility assertion (via `vitest-axe`). No snapshot tests.
- Path aliases: `@/*` → `src/*`, `@assets/*` → `src/assets/*` (configured identically in `vite.config.ts` and `vitest.config.ts`).
- `lucide-react` icons: named imports only.

## Environment variables

- `VITE_PURCHASE_URL` — checkout endpoint (default `#`)
- `VITE_ANALYTICS_ID` — GA4 measurement ID (optional; analytics no-ops when unset)
- `PLAYWRIGHT_CHROMIUM_PATH` — executable path for E2E in sandboxed environments

---

## Quality Gates

| Entity | Max | Enforced by |
|---|---|---|
| Source file (`src/**/*.{ts,tsx}`) | 300 lines | `scripts/lib/check-file-sizes.cjs` (pre-commit) |
| Function | 50 lines | advisory (`.claude/rules/code-quality.md`) |
| `src/utils/slotCalculations.ts` branch coverage | 100% | review gate (not in CI yet) |
| Secret patterns in source | 0 | `scripts/lib/check-secrets.cjs` (pre-commit) |

**Preexisting violation:** `src/components/item-config/CustomSubkitScreen.tsx` is 317 lines and is excluded in `scripts/lib/check-file-sizes.cjs`. Refactor it and remove the exclude entry.

Complexity red flags (stop and refactor immediately): >5 nested if/else, >3 try/catch in one function, >10 imports, duplicated logic. See `.claude/rules/code-quality.md` (auto-loaded on `src/**`).

## Git Hooks

Hooks are source-controlled in `scripts/hooks/` and installed into `.git/hooks/` by `./scripts/install-hooks.sh` (run once after clone).

**pre-commit** (fast):
1. `node scripts/lib/check-secrets.cjs` — blocks API keys, private keys
2. `node scripts/lib/check-file-sizes.cjs` — blocks files >300 lines
3. `node scripts/lib/validate-docs.cjs` — warns if `src/`/`scripts/` changed without CLAUDE.md

**pre-push** (thorough, SHA-cached):
1. `npm run typecheck` + `npm run test:run` — skipped when `HEAD` matches `.test-passed`
2. `npm audit --audit-level=moderate` — warn-only

The `.test-passed` file caches the SHA of the last successful run and is gitignored.

## Path-scoped Rules

Rules in `.claude/rules/` auto-load based on file patterns (via `globs:` frontmatter):

| File | Applies when editing |
|---|---|
| `tdd.md` | `src/**`, `lib/**` — test-first for features, reproduction-first for bugs |
| `typescript.md` | `src/**/*.{ts,tsx,js}` — naming, imports, no default exports |
| `react.md` | `src/**/*.{tsx,jsx}` — the five rules for avoiding `useEffect` |
| `testing.md` | `tests/**`, `**/*.test.*`, `**/*.spec.*` — test patterns + review checklist |
| `code-quality.md` | `src/**`, `lib/**`, `scripts/**` — file size, complexity red flags |

## Code Review Checklist

Before marking any change complete:

- [ ] Tests written/updated (TDD for features, reproduction test for bugs)
- [ ] `npm run typecheck` clean
- [ ] `npm run lint` clean
- [ ] `npm run test:run` green
- [ ] No file over 300 lines (`find src \( -name "*.ts" -o -name "*.tsx" \) -exec wc -l {} + | awk '$1 > 300'`)
- [ ] No `export default` in `src/`
- [ ] No `useEffect` for derivable state (see `.claude/rules/react.md`)
- [ ] CLAUDE.md updated if `src/` or `scripts/` structure changed

## Critical Gotchas

Add non-obvious discoveries here as you find them (see `.claude/plugins/harness-engineering/skills/setup/references/claude-md-guide.md` for what belongs here).

- **Build copies `dist/index.html` → `dist/200.html`** as an SPA fallback for static hosts. If you rename the output dir, update the `build` script in `package.json`.
- **Playwright `webServer`** auto-starts `npm run dev` on port 5000 — don't start the dev server manually before running E2E or you'll get `EADDRINUSE`.
- **Category colors are dynamic** — always apply via inline `style={{ background: color }}`, never via Tailwind template literals (`bg-${color}-500`), which Tailwind can't statically extract.
- **Zustand store persists to `localStorage` key `emergency-kit-v1`** — bumping the schema without a migration will silently drop user state. Bump the key suffix on breaking changes.
- **`attached_assets/` is gitignored and Replit-specific.** All committed PNGs live in `src/assets/`. Both `vite.config.ts` and `vitest.config.ts` alias `@assets` there. An earlier `vitest.config.ts` pointed to `attached_assets/`, which broke tests on fresh clones — don't reintroduce that.

## Harness Engineering

This repo follows the [harness-engineering](https://github.com/jrenaldi79/harness-engineering) pattern: mechanical enforcement (hooks) backs up path-scoped rules, which back up CLAUDE.md prose. Skills are vendored at `.claude/plugins/harness-engineering/skills/`. Current readiness level: see `readiness-report.md`.
