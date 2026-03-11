# Developer Implementation Notes

| File | Issue | Change Required |
|------|-------|------------------|
| `SubkitTypeSelectionNew.tsx` | Fills bottom-up | Change to top-to-bottom |
| `SubkitTypeSelectionNew.tsx` | Minimum check `> 0` | Change to `>= 3` with message |
| `SubkitTypeSelectionNew.tsx` | Blue/purple only colors | Replace with 9-category color system |
| `SubkitTypeSelectionNew.tsx` | No Regular/Large toggle | Add SizeToggle per PRD FR4 |
| `SubkitTypeSelectionNew.tsx` | Max = 6 count-based | Replace with slot-based constraint (Regular=1, Large=2, max 6 slots) |
| `SubkitTypeSelectionNew.tsx` | Disabled state behavioral only | Add `opacity-45 cursor-not-allowed` |
| `SummaryPage.tsx` | No visualizer | Add HousingUnitVisualizer (readOnly={true}) |
| `SummaryPage.tsx` | No purchase CTA | Add "Get My Kit" above visualizer |
| `SummaryPage.tsx` | .txt export | Replace with window.print() + @media print |
| `SummaryPage.tsx` | Weight/volume shown | Remove — Phase 2 |
| `ItemQuestionnaireFlow.tsx` | Dual volume bars shown | Remove — Phase 2 |
| `ItemQuestionnaireFlow.tsx` | No Empty Container option | Add EmptyContainerOption per PRD FR9 |
| `ItemQuestionnaireFlow.tsx` | No quantity maximum | Cap at 10 per PRD Story 4.2 AC4 |
| `ItemQuestionnaireFlow.tsx` | Custom = free-form input | Replace with cross-category browser per PRD FR13 |
| `kitItems.ts` | Missing items | Add: Feminine Hygiene Products, Ice Packs, Ponchos, Shoe Covers |
| `kitItems.ts` | No Clothing category | Add with Ponchos and Shoe Covers |
| `kitItems.ts` | Repairs/Tools present | Remove entirely |
| `kitItems.ts` | Starlink present | Remove — not in PRD scope |
| All files | Dark theme | Replace with light theme per Section 6 |
| `ImageWithFallback` | No designed fallback | Fallback = category tint bg + centered category icon |

---
