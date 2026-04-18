---
generated: 2026-04-18
level: 2
level_name: Basic
score: 13
total: 36
stack: node-typescript-react
monorepo: false
pillars:
  style-validation: { pass: 2, total: 4 }
  testing: { pass: 2, total: 5 }
  git-hooks: { pass: 0, total: 5 }
  documentation: { pass: 3, total: 9 }
  agent-config: { pass: 0, total: 5 }
  code-quality: { pass: 2, total: 3 }
  dev-environment: { pass: 3, total: 3 }
  agentic-workflow: { pass: 1, total: 2 }
---

# Harness Readiness Report

**Project:** emergency-prep-kit (node-typescript-react)
**Level:** 2 / 5 (Basic)
**Score:** 13 / 36 criteria passing

> Report generated against the state of `claude/setup-claude-md-oF8Ac` **before** this commit installs the scaffolding. Re-run `/readiness` after committing to see the new score (projected Level 4 after this commit — see "After This Commit" below).

## Pillar Scores (before scaffolding)

```
Style & Validation    ███░░░ 2/4
Testing               ██░░░░ 2/5
Git Hooks             ░░░░░░ 0/5
Documentation         ██░░░░ 3/9
Agent Configuration   ░░░░░░ 0/5
Code Quality          ████░░ 2/3
Dev Environment       ██████ 3/3
Agentic Workflow      ███░░░ 1/2
```

## Passing

- ✓ **Linter configured** — `.eslintrc.cjs` with `@typescript-eslint` + `jsx-a11y`; `npm run lint` wired
- ✓ **Formatter configured** — `.prettierrc` (semi, singleQuote, tabWidth 2, printWidth 100)
- ✓ **Test runner configured** — Vitest 2.x (`npm run test:run`) + Playwright 1.x (`npm run test:e2e`)
- ✓ **Tests exist** — 44 test files in `tests/unit/` and `tests/components/`, plus E2E flows
- ✓ **CLAUDE.md exists** with a Commands section
- ✓ **Architecture section** present in CLAUDE.md
- ✓ **Content quality** — CLAUDE.md covers state model, routing guards, animation constraints (not generic boilerplate)
- ✓ **No hardcoded secrets** in source (only `VITE_*` names in `.env.example`)
- ✓ **Consistent code style** — prettier + eslint enforced by convention; replit.md documents it
- ✓ **`.env.example` exists** with commented `VITE_PURCHASE_URL`
- ✓ **Build/dev commands documented** — README + CLAUDE.md agree
- ✓ **Dependencies install cleanly** (package-lock.json present, no resolution errors on fresh install)
- ✓ **Agentic workflow system** — BMAD installed at `.bmad-core/` with sharded PRDs, architecture, and story files under `docs/`

## Failing

- ✗ **Lint-on-commit** — no `lint-staged`, no pre-commit hook. Lint runs only when a human types `npm run lint`.
- ✗ **No default exports rule** — convention enforced by code review only; `import/no-default-export` not in `.eslintrc.cjs`.
- ✗ **Test colocation** — tests live in `tests/` mirroring `src/`. Not strict colocation but a deliberate architectural choice. *This repo will never pass strict colocation — the rule is a poor fit here.*
- ✗ **Coverage threshold** — `vitest.config.ts` defines coverage `include`/`exclude` but no threshold. `slotCalculations.ts` "requires 100% branch coverage" per docs but isn't enforced.
- ✗ **TDD enforcement rule** — no `.claude/rules/tdd.md` or equivalent.
- ✗ **Pre-commit / pre-push hooks** — only `.sample` files in `.git/hooks/`; nothing wired.
- ✗ **Secret scanning** — no automated check.
- ✗ **File size limits mechanically enforced** — `CustomSubkitScreen.tsx` is already 317 lines and no hook would catch future 400-line files.
- ✗ **Smart test caching** — no `.test-passed` mechanism.
- ✗ **Critical Gotchas section** — CLAUDE.md had none.
- ✗ **Quality Gates section** — CLAUDE.md had none.
- ✗ **Code Review Checklist** — absent.
- ✗ **Auto-generated sections** — no `<!-- AUTO:name -->` markers in CLAUDE.md.
- ✗ **Drift detection** — no script compares CLAUDE.md vs. disk.
- ✗ **`.claude/settings.json`** — missing. Every destructive command prompts the user.
- ✗ **Allow/deny lists** — N/A without settings.
- ✗ **Path-scoped rules** — no `.claude/rules/` directory.
- ✗ **Enforcement hierarchy** — rules in CLAUDE.md prose are unbacked by mechanical enforcement.
- ✗ **Session-start validation** — no SessionStart hook, no `validate-docs.cjs --full` instruction.
- ✗ **File size violation** — `src/components/item-config/CustomSubkitScreen.tsx` = 317 lines. `ItemConfigScreen.tsx` = 285 (OK). Next largest `CartSidebar.tsx` = 269.

## Insights (things the checklist misses)

- **BMAD is doing a lot of heavy lifting** — the `docs/stories/` + sharded architecture + per-phase PRDs approach is more structured than most projects. When scoring agentic workflow, this repo is effectively at Level 5 for planning discipline. The gap is mechanical enforcement, not process.
- **`replit.md` duplicates CLAUDE.md content.** This is fine for humans but costs tokens on every Claude invocation. Consider consolidating after the harness migration is stable.
- **Conventions are strong but advisory.** Named-exports-only, no-logic-in-JSX, axe-per-component-test, inline-styles-for-dynamic-colors — all documented, none lint-enforced. A Level 4+ posture would back them with ESLint rules.
- **The `@assets` alias in `vitest.config.ts` was pointing to `attached_assets/`** (gitignored), which broke the test suite on fresh clones — 7 test files failed at import. Fixed as part of this commit; both configs now resolve `@assets` to `src/assets/`. This unmasked 4 pre-existing stale assertions in `NavigationFlow.test.tsx` and `SummaryScreen.test.tsx` — regex matched "Build Your Kit" but the heading is "Build Your Emergency Kit", and one test expected `/confirmation` navigation when Phase 3 routed `Get My Kit` to `/review`. Fixed in a follow-up commit; all 458 tests now pass.
- **Coverage config enumerates paths but sets no threshold** — easy upgrade: add `thresholds: { branches: 100 }` scoped to `src/utils/slotCalculations.ts`.

## Level Gate

Level 3 (Enforced) requires **pre-commit + pre-push hooks blocking bad commits**, **agent settings configured**, and **CLAUDE.md essential sections**. All three were blocking Level 3.

---

## After This Commit (projected)

This commit installs the scaffolding. Projected score after re-running:

```
Style & Validation    ███░░░ 2/4   (unchanged — no-default-export rule still not added)
Testing               ███░░░ 3/5   (+TDD rule file)
Git Hooks             ████░░ 4/5   (+pre-commit, +pre-push, +secret-scan, +file-size, +test-cache; lint-staged still absent)
Documentation         ██████ 7/9   (+Critical Gotchas, +Quality Gates, +Code Review Checklist)
Agent Configuration   █████░ 4/5   (+settings.json, +rules/, +enforcement hierarchy)
Code Quality          █████░ 2/3   (still 1 file >300 lines, excluded with TODO)
Dev Environment       ██████ 3/3
Agentic Workflow      █████░ 2/2   (+session-start validation via validate-docs.cjs --full)
```

**Projected Level: 4 (Automated)** — gated on refactoring `CustomSubkitScreen.tsx` below 300 lines and adding `import/no-default-export` to reach Level 5.

## Remediation — Ordered by Impact

### To Reach Level 5 (after this commit)

1. **Refactor `CustomSubkitScreen.tsx`** (317 → <300 lines) and remove it from `scripts/lib/check-file-sizes.cjs` `CONFIG.exclude`.
2. **Add `import/no-default-export`** to `.eslintrc.cjs` (`eslint-plugin-import` needs installing):
   ```js
   rules: { 'import/no-default-export': 'error' }
   ```
3. **Add coverage threshold** for `src/utils/slotCalculations.ts` in `vitest.config.ts`:
   ```ts
   coverage: { thresholds: { 'src/utils/slotCalculations.ts': { branches: 100 } } }
   ```

### Quick Wins

- Install `lint-staged` + wire to pre-commit (replaces full-project `npm run lint` with fast staged-file linting).
- Add a `posttest` script that writes `HEAD` SHA to `.test-passed` so local `npm test` invalidates the pre-push cache correctly.
- Run `node scripts/lib/validate-docs.cjs --full` in CI to fail builds on documentation drift.

### Deeper Improvements

- Full TDD enforcement via a pre-commit check that new `src/**/*.tsx` files have a matching `tests/**/*.test.tsx` in the same commit.
- SessionStart hook that runs `npm run typecheck` + `validate-docs.cjs --full` so every new Claude session starts from a verified state.
- Custom ESLint rule: "no inline Tailwind template literals for dynamic values" — prevents the category-color footgun documented in Critical Gotchas.

---

## How to Re-Run

```bash
# From Claude Code with harness-engineering skills vendored locally
/readiness
```

The YAML frontmatter at the top of this file enables delta tracking on future runs.
