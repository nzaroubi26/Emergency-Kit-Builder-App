# 11. Sprint 2 Forward-Look Validation

These Sprint 2 concerns are **designed for but not built** in Sprint 1:

| Sprint 2 Concern | Architecture Support |
|---|---|
| MCQ to subkit surfacing | `emergencyTypes` and `householdComposition` are typed arrays in `mcqStore`, readable via `useMCQStore.getState()` from the visualizer |
| Build My Own to `/review` | `reviewGuard` checks `!kitPath` (truthy check), so `kitPath === 'custom'` passes with zero guard changes |
| `KitSummaryCard` custom path | Branch exists (`path === 'custom'`), implementation is Sprint 2 additive |
| `extreme-heat` emergency type | Add to `EmergencyType` union, add to Q1 screen options — no store/guard changes |

## MCQ Surfacing Rules (Reference — Not Sprint 1 Implementation)

**Q2 — additive elevation:**

| Household Option | Elevated Subkits |
|---|---|
| Kids | Hygiene, Medical, Comfort |
| Older Adults | Medical, Comfort |
| Disability | Medical, Comfort |
| Pets | Pets subkit |
| None | No effect |

**Q1 — ordering/weighting:**

| Emergency Type | Elevated Subkits |
|---|---|
| Flood / Hurricane | Power, Communications, Cooking |
| Tropical Storm | Power, Communications |
| Tornado | Medical, Lighting, Clothing |
| Extreme Heat | No effect (coming soon) |

"Elevate" = surfaced at top of visualizer list, visually flagged. Not pre-selected. Additive when multiple answers selected. Q2 takes visual priority over Q1 when both elevate the same subkit.

---

*Emergency Prep Kit Builder — Phase 3 Sprint 1 Architecture Brief | Version 1.0 | 2026-04-13 | Winston, Architect*
