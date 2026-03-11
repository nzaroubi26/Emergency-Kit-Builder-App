# 2. Frontend Tech Stack

| Category | Technology | Version | Purpose | Rationale |
|----------|------------|---------|---------|----------|
| Language | TypeScript | 5.x strict | Primary language | Unchanged from Phase 1 |
| Framework | React | 18.x | UI component tree | Unchanged from Phase 1 |
| Build Tool | Vite | 6.x | Dev server, bundling, HMR | Unchanged from Phase 1 |
| Styling | Tailwind CSS | v4.x | Utility-first + CSS variable theme | Unchanged from Phase 1 |
| State Management | Zustand | 5.x + persist | Global kit state + localStorage | `persist` middleware wraps existing `create()` — one file, zero consumer changes |
| Routing | React Router | 6.4+ | Client-side routing + navigation guards | `/` cover page; `/builder` kit entry |
| Icons | lucide-react | latest | Category + UI icons | Named imports only — mandatory for tree-shaking |
| Testing (unit) | Vitest + RTL + axe-core/react | 2.x / 16.x / 4.x | Unit and component tests | Unchanged from Phase 1 |
| Testing (E2E) | Playwright | latest | Automated end-to-end suite | Three critical flows; GitHub Actions CI |
| Analytics | Google Analytics 4 | — | User behavior event tracking | Non-blocking; e-commerce event support; `VITE_ANALYTICS_ID` env var |
| Linting | ESLint + @typescript-eslint + eslint-plugin-jsx-a11y | 8.x / 6.x | Code quality + a11y | Unchanged from Phase 1 |
| Formatting | Prettier | 3.x | Code formatting | Unchanged from Phase 1 |
| Deployment | Vercel | — | Static SPA hosting | Unchanged from Phase 1 |
| CI | GitHub Actions | — | Playwright E2E runner | New in Phase 2 |

---
