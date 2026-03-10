# 4. Component Standards

Unchanged from Phase 1. All Phase 2 components follow the identical naming conventions, FC<Props> pattern, named exports only, no logic in JSX, and accessibility-first rules defined in the Phase 1 architecture.

**Naming Conventions (unchanged):**

| Element | Convention | Example |
|---------|------------|---------|
| Component files | PascalCase `.tsx` | `StarRating.tsx`, `CoverScreen.tsx` |
| Component functions | PascalCase | `export const StarRating: FC<...>` |
| Props interfaces | `{ComponentName}Props` | `StarRatingProps` |
| Hook files | camelCase `use` prefix | `useKitStore.ts` |
| Utility files | camelCase `.ts` | `analytics.ts`, `checkoutService.ts` |
| Service files | camelCase `.ts` in `src/services/` | `checkoutService.ts` |
| Test files | Mirror source path + `.test.tsx` | `StarRating.test.tsx` |

---
