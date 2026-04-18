# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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
- Path aliases: `@/*` → `src/*`, `@assets/*` → `src/assets/*` (note: `vitest.config.ts` aliases `@assets` to `attached_assets/` for test fixtures — don't "fix" this mismatch).
- `lucide-react` icons: named imports only.

## Environment variables

- `VITE_PURCHASE_URL` — checkout endpoint (default `#`)
- `VITE_ANALYTICS_ID` — GA4 measurement ID (optional; analytics no-ops when unset)
- `PLAYWRIGHT_CHROMIUM_PATH` — executable path for E2E in sandboxed environments
