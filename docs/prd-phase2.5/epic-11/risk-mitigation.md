# Risk Mitigation

| File / Area | Risk | Mitigation |
|---|---|---|
| `kitItems.ts` — `pricePlaceholder` population | Low | Additive value update; no type change; all consumers null-safe |
| `AppShell.tsx` — new local state + `useLocation()` | Low | Additive; `useLocation()` already available via React Router |
| `AppHeader.tsx` — new prop + store read | Low | Additive; store read is read-only |
| `SummaryScreen.tsx` — CTA change | Low | Replace one handler call; remove checkout loading/error state; no store or type changes |
| `router/index.tsx` + `guards.ts` — new route | Low | Additive route entry; guard pattern matches existing guards exactly |
| CartSidebar fixed positioning | Low | `z-50` panel + `z-40` backdrop; no ancestor `overflow-hidden` constraint exists |

---
