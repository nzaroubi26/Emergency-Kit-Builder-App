# 9. New File Inventory

## New Files

| File | Purpose |
|------|---------|
| `src/store/mcqStore.ts` | MCQ Zustand store with sessionStorage persistence |
| `src/data/essentialsConfig.ts` | `ESSENTIALS_BUNDLE` constant |
| `src/components/mcq/MCQEmergencyTypeScreen.tsx` | Q1 screen at `/build` |
| `src/components/mcq/MCQHouseholdScreen.tsx` | Q2 screen at `/build/household` |
| `src/components/fork/ForkScreen.tsx` | Fork screen at `/choose` |
| `src/components/review/ReviewOrderScreen.tsx` | Review & Order screen at `/review` |
| `src/components/review/KitSummaryCard.tsx` | Dual-path kit summary component |

## Modified Files

| File | Change |
|------|--------|
| `src/router/index.tsx` | Add 4 new routes + imports |
| `src/router/guards.ts` | Add 3 new guard functions + `useMCQStore` import |
| `src/components/layout/AppShell.tsx` | Add `MOBILE_EXEMPT_ROUTES` + conditional bypass |
| `src/components/cover/CoverScreen.tsx` | CTA `to="/builder"` changed to `to="/build"` |

---
