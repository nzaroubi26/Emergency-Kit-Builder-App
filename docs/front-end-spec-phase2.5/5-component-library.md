# 5. Component Library

## Component Summary

| Component | Screens | Key States |
|-----------|---------|------------|
| HousingUnitVisualizer | S1, S3 | Empty, Filled Regular, Filled Large, Full, Read-only |
| SubkitCard | S1 | Default, Selected, Disabled |
| SizeToggle | S1 (in SubkitCard) | Regular, Large, Large-disabled |
| ItemCard | S2, S2-C | Excluded, Included |
| QuantitySelector | S2, S2-C | Inactive, Active, At-min (1), At-max (10) |
| EmptyContainerOption | S2, S2-C | Default, Selected |
| StepProgressIndicator | Header all screens | Completed, Current, Upcoming |
| SubkitProgressIndicator | S2 header | Progress bar + label |
| PrimaryButton | S1, S2, S3 | Active, Disabled |
| SecondaryButton | S2, S3 | Default, Modal-trigger variant |
| ConfirmationModal | S2, S3 | Open, Dismissed |
| SlotFullIndicator | S1 | Hidden, Visible |
| CategoryGroupHeader | S2-C, S3 custom | Static label |
| SubkitStatsStrip | S2, S2-C | Live (updates on item toggle/qty change), Empty container state |

---

## SubkitStatsStrip

**Phase 2.5 component.** Renders between the subkit heading and the item grid on `ItemConfigScreen` and `CustomSubkitScreen`. Displays estimated subkit weight (`~X.X lbs`) and live volume fill percentage with a progress bar. Purely informational — no thresholds, no warnings, no state stored in Zustand.

```typescript
interface SubkitStatsStripProps {
  weightGrams: number;          // sum of included item weights × quantities
  volumeIn3: number;            // sum of included item volumes × quantities
  containerCapacityIn3: number; // 1728 (Regular) or 3456 (Large)
  categoryColor: string;        // category base hex — used for volume bar fill
}
```

| Prop | Source |
|------|--------|
| `weightGrams` | Computed from `itemSelections` × `KitItem.weightGrams` in parent component |
| `volumeIn3` | Computed from `itemSelections` × `KitItem.volumeIn3` in parent component |
| `containerCapacityIn3` | Derived from `SubkitSelection.size` — Regular = 1,728 in³; Large = 3,456 in³ |
| `categoryColor` | Category base color hex from category color system |

**Key behaviors:**
- Weight display: `(weightGrams / 453.592).toFixed(1)` prefixed with `~`
- Volume display: `Math.round((volumeIn3 / containerCapacityIn3) * 100)` as integer; bar width clamped to `min(pct, 100)%`
- Both values react instantly to item toggles and quantity changes (derived from props, no internal state)
- Empty container state: parent passes `weightGrams=0` and `volumeIn3=0`; strip renders `~0.0 lbs` and `0% filled`
- No unit tests needed beyond the two pure calculation functions in `slotCalculations.ts`

---

## HousingUnitVisualizer

```typescript
interface HousingUnitVisualizerProps {
  slots: SlotState[];           // index 0 = top slot
  readOnly?: boolean;
  onSlotClick?: (slotIndex: number) => void;  // Phase 2 — active on SubkitSelectionScreen (Story 7.2)
}

interface SlotState {
  status: 'empty' | 'filled';
  subkitId?: string;
  subkitName?: string;
  subkitColor?: string;         // Hex from category color system
  size: 'regular' | 'large';
  isLargeStart?: boolean;
  isLargeEnd?: boolean;
}
```

- All constraint logic calculated externally; component is purely presentational
- Slot update must render within 100ms (PRD NFR2)
- Large block: both rows fill simultaneously, internal divider fades to 0

---

## SubkitCard

| State | Visual |
|-------|--------|
| Default | White, shadow-1, 3px left border in category base color |
| Selected | Category tint bg, 2px full border, selection order badge, checkmark, SizeToggle visible |
| Disabled | opacity-45, cursor-not-allowed |

**SizeToggle:** Slides in on card selection (max-height 180ms). Inline on card. Blocked Large shows amber "Not enough space" message.

---

## ItemCard

**Structure:** Image area (96px) + content area + quantity bar (when included)

```typescript
interface ItemCardProps {
  item: KitItem;
  category: KitCategory;
  included: boolean;
  quantity: number;             // 1–10
  onToggle: () => void;
  onQuantityChange: (qty: number) => void;
  imageSrc?: string;           // Phase 2
}
```

**Image placeholder (MVP):** Category tint bg + category lucide icon 32px centered + bottom gradient overlay

| State | Visual |
|-------|--------|
| Excluded | White, shadow-1, neutral-200 border; hollow circle indicator top-right |
| Included | Category base color 2px border, category tint shadow glow; solid circle + checkmark indicator |

---

## QuantitySelector

`[−]  [1]  [+]`

- Min: 1, Max: 10
- `−` disabled at 1; does not toggle item off
- `+` disabled at 10
- Container always reserves layout space — never causes layout shift

---

## EmptyContainerOption

`[Checkbox] "I already own these — send me an empty container instead"`

- Present on both standard subkit screens (S2) and the Custom subkit browser (S2-C)
- Selected: item grid dims to opacity-35, pointer-events none; inline confirmation in category base color
- Reversed: item grid re-enables; all previously set states restored
- Still counts toward 3-subkit minimum and 6-slot constraint

---

## ConfirmationModal

| Trigger | Title | Confirm | Cancel |
|---------|-------|---------|--------|
| Back to Subkit Selection | "Go back to subkit selection?" | "Go Back" | "Stay Here" |
| Start Over | "Start over?" | "Start Over" | "Keep My Kit" |

- Fade-in 180ms, scale 0.97 → 1.0
- Focus trapped within modal; returns to trigger on close
- Escape = cancel; Enter does NOT confirm
- Backdrop: `rgba(0,0,0,0.4)`

---

## SlotFullIndicator

`[Icon] Housing unit full — deselect a subkit to make room`

- Amber `#D97706` — informational tone, not error
- Inline below visualizer; fade+slide-up 200ms on appear; reverses immediately when slot freed

---
