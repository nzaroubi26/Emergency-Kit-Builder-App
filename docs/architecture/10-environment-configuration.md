# 10. Environment Configuration

```bash
# .env.example — Phase 2

# E-commerce checkout endpoint — POST receives CheckoutPayload; expects { redirectUrl } response
VITE_PURCHASE_URL=https://example.com/purchase

# Google Analytics 4 Measurement ID
# Leave empty in local development to disable analytics
VITE_ANALYTICS_ID=G-XXXXXXXXXX
```

```typescript
// src/tokens/env.ts — Phase 2
export const ENV = {
  purchaseUrl:  import.meta.env['VITE_PURCHASE_URL']  as string ?? '#',
  analyticsId:  import.meta.env['VITE_ANALYTICS_ID'] as string ?? '',
} as const;
```

**Rules (unchanged + additions):**

- Never use `import.meta.env.VITE_*` directly in components — always import from `src/tokens/env.ts`
- All `VITE_` values are public and bundled into the client — never put API secrets here
- `VITE_ANALYTICS_ID` and `VITE_PURCHASE_URL` set in Vercel dashboard for production and preview environments
- When `VITE_ANALYTICS_ID` is empty (local dev), `AppShell` skips GA4 script injection cleanly
- When `VITE_PURCHASE_URL` is the placeholder `#`, the CTA fires but the fetch immediately returns a non-2xx — the error state is displayed; kit state is preserved

---
