# 9. Testing Requirements

## Strategy

Phase 1 unit and component testing strategy unchanged. Phase 2 adds:

- New component tests: `StarRating.test.tsx`
- New unit tests: `checkoutService.test.ts`
- New E2E suite: Playwright (3 flows, 2 projects)
- New CI: GitHub Actions

## Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  reporter: process.env['CI'] ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // iPhone SE mobile project deferred to Phase 3 — MobileInterstitial is retained in Phase 2
    // and would block all E2E flows on mobile viewport. Add mobile project in Phase 3
    // alongside the MobileInterstitial removal and full mobile responsiveness work.
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env['CI'],
  },
});
```

## GitHub Actions CI

```yaml
# .github/workflows/e2e.yml
name: Playwright E2E
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

Playwright runs on `push` and `pull_request` to `main`. Vitest unit tests run separately — `npm run test:run` is not part of `e2e.yml`. Add a separate `ci.yml` for Vitest if desired.

## E2E Test Flows

All three flows in a single `tests/e2e/kit-builder.spec.ts` file, tagged by describe block. Phase 2 runs `chromium` (Desktop Chrome) only — the iPhone SE project is deferred to Phase 3 when `MobileInterstitial` is removed. Adding it in Phase 2 would cause all three flows to fail against the interstitial screen:

| Flow | Key Assertions |
|------|----------------|
| Full kit configuration | Select 3 subkits → configure items → reach Summary → all subkits + items visible |
| Back-navigation state preservation | Configure 2 subkits → navigate back → both selections + sizes preserved |
| Start Over reset | Complete config → Start Over → confirm modal → store resets → 6 empty slots |

Each test clears localStorage before running (`page.evaluate(() => localStorage.clear())`) to ensure clean state.

## New Component + Unit Tests

```typescript
// tests/components/StarRating.test.tsx
describe('StarRating', () => {
  it('renders filled layer clipped to correct percentage for a given rating');
  it('outputs correct aria-label: "Rated 4.3 out of 5 based on 128 reviews"');
  it('renders review count with toLocaleString formatting');
  it('passes axe accessibility assertion');
});

// tests/unit/checkoutService.test.ts (mocking fetch)
describe('initiateCheckout', () => {
  it('returns { success: true, redirectUrl } on 200 response with redirect URL');
  it('returns { success: false, errorMessage } on non-2xx response');
  it('returns { success: false, errorMessage } on network error (fetch throws)');
});
```

## Updated package.json Scripts

```json
{
  "scripts": {
    "dev":           "vite",
    "build":         "tsc && vite build",
    "preview":       "vite preview",
    "lint":          "eslint src --ext ts,tsx",
    "typecheck":     "tsc --noEmit",
    "test":          "vitest",
    "test:run":      "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:e2e":      "playwright test"
  }
}
```

---
