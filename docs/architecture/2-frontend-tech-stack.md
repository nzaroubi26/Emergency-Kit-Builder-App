# 2. Frontend Tech Stack

| Category | Technology | Version | Purpose | Rationale |
|----------|------------|---------|---------|----------|
| Language | TypeScript | 5.x strict | Primary language | Strict mode enforces type safety across slot calculations, category colors, and state |
| Framework | React | 18.x | UI component tree | Per PRD |
| Build Tool | Vite | 6.x | Dev server, bundling, HMR | Fastest HMR; Tailwind v4 plugin support; static SPA output |
| Styling | Tailwind CSS | v4.x | Utility-first + CSS variable theme | Per PRD; v4 CSS-variable-native theme maps directly to design-tokens.ts |
| State Management | Zustand | 5.x | Global kit configuration state | Cross-screen state without Provider nesting; Phase 2 localStorage middleware is additive |
| Routing | React Router | 6.4+ Data Router | Client-side routing, navigation guards | Loader-based guards; handles `/configure/:subkitId` |
| Icons | lucide-react | latest | Category + UI icons | Named imports only — mandatory for tree-shaking |
| Testing | Vitest | 2.x | Unit and component tests | Native Vite integration; Jest-compatible API |
| Testing DOM | React Testing Library | 16.x | Component interaction tests | Tests user-facing behavior |
| Testing a11y | @axe-core/react | 4.x | Automated a11y checks in dev | Per UX spec requirement |
| Linting a11y | eslint-plugin-jsx-a11y | 6.x | Static ARIA enforcement | Runs in CI per spec |
| Linting | ESLint + @typescript-eslint | 8.x | Code quality | |
| Formatting | Prettier | 3.x | Code formatting | |
| Deployment | Vercel | — | Static SPA hosting | Zero-config Vite detection; React Router client-side routing handled natively (no `_redirects` file needed); preview deployments per branch; env vars set in dashboard |

---
