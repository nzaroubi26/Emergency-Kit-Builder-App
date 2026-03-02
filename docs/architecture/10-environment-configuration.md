# 10. Environment Configuration

This is a static SPA — no backend, no secrets, no runtime environment variables in MVP. Vite's `import.meta.env` is used for the single deployment-time value.

```bash
# .env.example
# Copy to .env.local for local development

# Phase 2: e-commerce endpoint
# VITE_PURCHASE_URL=https://example.com/buy

# MVP: placeholder purchase URL used by 'Get My Kit' CTA
VITE_PURCHASE_URL=https://example.com/purchase
```

```typescript
// src/tokens/env.ts — typed env access; never use import.meta.env directly in components
export const ENV = {
  purchaseUrl: import.meta.env['VITE_PURCHASE_URL'] as string ?? '#',
} as const;
```

**Rules:**
- Never use `import.meta.env.VITE_*` directly in components — always import from `src/tokens/env.ts`.
- All `VITE_` prefixed values are public and bundled into the client — never put secrets here.
- In Phase 2, additional `VITE_` variables for e-commerce API endpoints are added to `.env.example` and `env.ts` only.

---
