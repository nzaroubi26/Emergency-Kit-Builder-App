# Emergency Prep Kit Builder — Frontend Architecture Document

**Prepared by:** Winston, Architect  
**Date:** 2026-03-02  
**Version:** 1.0  
**Status:** Complete — Ready for Development

---

## Table of Contents

1. Template and Framework Selection
2. Frontend Tech Stack
3. Project Structure
4. Component Standards
5. State Management
6. Data Layer
7. Routing
8. Styling Guidelines
9. Testing Requirements
10. Environment Configuration
11. Frontend Developer Standards
12. Phase 2 Extension Points

---

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2026-03-02 | 1.0 | Initial architecture document | Winston, Architect |
| 2026-03-02 | 1.1 | Vercel selected as deployment platform; rollback strategy added; analytics Phase 2 deferral added | Sarah, PO |

---

## 1. Template and Framework Selection

### Project Context

This is a **brownfield refactor** of an existing React project. The Developer Implementation Notes in the UI/UX Specification identify existing files (`SubkitTypeSelectionNew.tsx`, `SummaryPage.tsx`, `ItemQuestionnaireFlow.tsx`, `kitItems.ts`, `ImageWithFallback`) that require targeted corrections. This document defines the **target state** — all existing components must be refactored to conform to these patterns.

### Scaffold

No external starter template. The foundation is a standard **Vite + React + TypeScript** scaffold, which the existing project is assumed to already approximate. The focus is aligning the existing codebase to the patterns defined here.

### Key Framework Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Build tool | Vite 6.x | Fastest HMR; first-class TS + React + Tailwind v4 support; trivial static export to Vercel |
| Framework | React 18.x + TypeScript 5.x strict | Per PRD; `strict: true` mandatory |
| State management | Zustand 5.x | Kit state is deeply cross-cutting with computed slot values; avoids Provider nesting; Phase 2 localStorage is one middleware line |
| Routing | React Router v6.4+ | Data Router API handles `/configure/:subkitId` guards cleanly; loader-based redirects for invalid direct navigation |
| Testing | Vitest + RTL + axe-core/react | Natural Vite companion; matches spec a11y automation requirement |
| Icons | lucide-react (named imports only) | Specified in UX spec; named imports mandatory for tree-shaking |

### Existing Files — Required Corrections

| Existing File | Action | Key Changes |
|---------------|--------|-------------|
| `SubkitTypeSelectionNew.tsx` → `SubkitSelectionScreen.tsx` | Rename + refactor | Top-to-bottom fill; `>= 3` minimum; 9-category colors; SizeToggle; slot-based constraint; `opacity-45 cursor-not-allowed` disabled state |
| `SummaryPage.tsx` → `SummaryScreen.tsx` | Rename + refactor | Add `HousingUnitVisualizer readOnly={true}`; 'Get My Kit' CTA; `window.print()` replacing .txt export; remove weight/volume display |
| `ItemQuestionnaireFlow.tsx` → `ItemConfigScreen.tsx` | Rename + refactor | Remove dual volume bars; add `EmptyContainerOption`; cap quantity at 10; replace free-form Custom with category browser |
| `kitItems.ts` | Correct in place | Add 4 items + Clothing category; remove Repairs/Tools entirely; remove Starlink |
| `ImageWithFallback` | Correct in place | Fallback = category tint bg + centered category icon 32px + bottom gradient overlay |
| All files | Global | Replace all dark theme classes with light theme per Section 8 |

### Brownfield Rollback Strategy

The five files being modified carry the following risk levels:

| File | Risk Level | Reason |
|------|-----------|--------|
| `SubkitTypeSelectionNew.tsx` | High | Full slot logic rewrite |
| `ItemQuestionnaireFlow.tsx` | High | Custom subkit logic replaced |
| `SummaryPage.tsx` | Medium | Mostly additive changes |
| `kitItems.ts` | Low | Data only |
| `ImageWithFallback` | Low | Fallback rendering only |

**Strategy: Git branch per story, corrections spread across epics.**

1. **Pre-refactor tag:** Before any story begins, ensure the current working state is committed and tagged on `main` (e.g., `git tag v0-pre-refactor`). This is the unconditional restore point.

2. **Branch per story:** Each story runs on its own branch (`story/1.1-scaffolding`, `story/2.1-visualizer`, etc.). The SM agent creates the story; the Dev agent works the branch. Nothing merges to `main` until the story is marked Done by QA.

3. **Corrections spread across epics — not batched into Story 1.1.** Each existing file is corrected in the story where it is first logically required:
   - `kitItems.ts` → corrected in **Story 1.2** (data architecture)
   - `SubkitTypeSelectionNew.tsx` → corrected in **Epic 3** (subkit selection)
   - `ItemQuestionnaireFlow.tsx` → corrected in **Epic 4** (item configuration)
   - `SummaryPage.tsx` → corrected in **Epic 5** (summary page)
   - `ImageWithFallback` → corrected in **Epic 4** (first screen to render item images)

4. **Regression on a story branch:** `git checkout main` restores the last QA-approved state instantly.

5. **Nuclear option:** `git checkout v0-pre-refactor` restores the entire project to its pre-refactor state in one command if multiple merged stories produce cascading regressions.

---

## 2. Frontend Tech Stack

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

## 3. Project Structure

```
emergency-prep-kit/
├── public/
│   └── favicon.ico
├── src/
│   ├── main.tsx                         # Entry — React.StrictMode + RouterProvider
│   ├── App.tsx                           # RouterProvider root
│   ├── tokens/
│   │   └── design-tokens.ts             # Colors, motion — single source of truth from UX spec
│   ├── styles/
│   │   ├── globals.css                   # Tailwind v4 @import, @theme block, CSS custom properties
│   │   └── print.css                     # @media print — imported by SummaryScreen only
│   ├── types/
│   │   ├── kit.types.ts                  # KitCategory, KitItem, SubkitSelection, ItemSelection
│   │   ├── visualizer.types.ts           # SlotState, HousingUnitVisualizerProps
│   │   └── index.ts                      # Barrel export
│   ├── data/
│   │   ├── kitItems.ts                   # All subkit categories + items (corrected per spec)
│   │   └── index.ts                      # Barrel export
│   ├── utils/
│   │   ├── slotCalculations.ts           # Pure functions: calculateSlotState, calculateTotalSlots, canFitSize
│   │   └── categoryUtils.ts              # getCategoryById, getCategoryColor, getCategoryIcon
│   ├── store/
│   │   └── kitStore.ts                   # Zustand store — all kit configuration state + actions
│   ├── router/
│   │   ├── index.tsx                     # createBrowserRouter — routes + loader guards
│   │   └── guards.ts                     # Loader functions for navigation guard logic
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx              # Outlet wrapper — header + mobile interstitial
│   │   │   ├── AppHeader.tsx             # App name + StepProgressIndicator
│   │   │   ├── StepProgressIndicator.tsx # Step 1 / 2 / 3 — informational, not clickable
│   │   │   └── MobileInterstitial.tsx    # Rendered below 768px — not a route
│   │   ├── ui/
│   │   │   ├── PrimaryButton.tsx         # brand-primary CTA; aria-disabled when inactive
│   │   │   ├── SecondaryButton.tsx       # Neutral secondary actions
│   │   │   ├── ConfirmationModal.tsx     # Focus-trapped dialog; Escape = cancel only
│   │   │   └── ImageWithFallback.tsx     # Category tint bg + icon fallback (Phase 2: real images)
│   │   ├── visualizer/
│   │   │   ├── HousingUnitVisualizer.tsx  # Fully props-driven, stateless internally
│   │   │   ├── VisualizerSlot.tsx         # Single slot — all 5 visual states
│   │   │   └── SlotFullIndicator.tsx      # Amber inline indicator below visualizer
│   │   ├── subkit-selection/
│   │   │   ├── SubkitSelectionScreen.tsx  # Screen root — composes S1 components
│   │   │   ├── SubkitCard.tsx             # Category card — default/selected/disabled
│   │   │   └── SizeToggle.tsx             # [Regular][Large] inline toggle; slides in on selection
│   │   ├── item-config/
│   │   │   ├── ItemConfigScreen.tsx       # Standard subkit config screen root
│   │   │   ├── CustomSubkitScreen.tsx     # Custom subkit all-category browser
│   │   │   ├── ItemCard.tsx               # Image + toggle + quantity bar
│   │   │   ├── QuantitySelector.tsx       # [−] [n] [+] min 1, max 10
│   │   │   ├── EmptyContainerOption.tsx   # Checkbox — dims item grid on selection
│   │   │   ├── CategoryGroupHeader.tsx    # Group label in Custom browser
│   │   │   └── SubkitProgressIndicator.tsx  # Progress bar + 'Subkit N of M' label
│   │   └── summary/
│   │       ├── SummaryScreen.tsx          # Screen root — imports print.css
│   │       └── SubkitSummarySection.tsx   # Per-subkit card: color bar + items + empty badge
│   └── hooks/
│       ├── useKitStore.ts                 # Typed Zustand selector hooks
│       └── useResponsive.ts              # useMediaQuery for MobileInterstitial threshold
├── tests/
│   ├── setup.ts
│   ├── unit/
│   │   └── slotCalculations.test.ts
│   └── components/
│       ├── HousingUnitVisualizer.test.tsx
│       ├── SubkitCard.test.tsx
│       ├── ItemCard.test.tsx
│       └── QuantitySelector.test.tsx
├── index.html
├── vite.config.ts
├── vitest.config.ts
├── tailwind.config.ts
├── tsconfig.json                          # strict: true
├── .eslintrc.cjs
├── .prettierrc
└── package.json
```

---

## 4. Component Standards

### Naming Conventions

| Element | Convention | Example |
|---------|------------|--------|
| Component files | PascalCase `.tsx` | `HousingUnitVisualizer.tsx` |
| Component functions | PascalCase | `export const HousingUnitVisualizer: FC<...>` |
| Props interfaces | `{ComponentName}Props` | `HousingUnitVisualizerProps` |
| Hook files | camelCase `use` prefix | `useKitStore.ts` |
| Utility files | camelCase `.ts` | `slotCalculations.ts` |
| Type files | camelCase `.types.ts` | `kit.types.ts` |
| CSS | Tailwind utilities only — no custom class names in components | |
| Test files | Mirror source path + `.test.tsx` | `HousingUnitVisualizer.test.tsx` |

### Component Template

All components follow this pattern. No class components. No default exports.

```typescript
// src/components/domain/ComponentName.tsx
import { type FC } from 'react';

interface ComponentNameProps {
  requiredProp: string;
  optionalProp?: boolean;
  onAction?: () => void;
}

export const ComponentName: FC<ComponentNameProps> = ({
  requiredProp,
  optionalProp = false,
  onAction,
}) => {
  // Derive all computed values above the return — no logic in JSX
  const derivedValue = requiredProp.toUpperCase();

  return (
    <div className="">
      {/* Implementation */}
    </div>
  );
};
```

### Component Rules

- **Named exports only** — no `export default`. Enables reliable refactoring and import tracing.
- **FC\<Props\> type** — always explicitly typed.
- **Props interface co-located** — in same file unless shared across multiple files (then in `types/`).
- **No logic in JSX** — extract conditionals and derived values to `const` above `return`.
- **Accessibility first** — all interactive elements must have `aria-label` or associated visible label. See Section 11.

---

## 5. State Management

### Architecture Decision

**Zustand 5.x** manages all kit configuration state. It is the single source of truth for selected subkits, item selections and quantities, empty container flags, and item config navigation index.

**Critical constraint: Slot state is never stored.** It is always computed from `selectedSubkits` via pure functions in `utils/slotCalculations.ts`. Components that need slot state call `useSlotState()` which runs `calculateSlotState()` live.

### Type Definitions

```typescript
// src/types/kit.types.ts
export type SubkitSize = 'regular' | 'large';

export interface KitCategory {
  id: string;            // e.g. 'power'
  name: string;          // e.g. 'Power'
  colorBase: string;     // Hex — visualizer fills, borders
  colorTint: string;     // Hex — card selected backgrounds
  icon: string;          // lucide-react icon name
  description: string;
  sizeOptions: SubkitSize[];
}

export interface KitItem {
  id: string;            // e.g. 'power-solar-panel'
  categoryId: string;
  name: string;
  description: string;
  // Phase 2 fields — present but nullable in MVP
  productId: string | null;
  pricePlaceholder: number | null;
  imageSrc: string | null;
}

export interface SubkitSelection {
  subkitId: string;         // categoryId — unique per instance in MVP
  categoryId: string;
  size: SubkitSize;
  selectionOrder: number;   // 1-indexed; drives config sequence and slot fill order
}

export interface ItemSelection {
  itemId: string;
  subkitId: string;
  quantity: number;         // 1–10
}
```

```typescript
// src/types/visualizer.types.ts
export interface SlotState {
  status: 'empty' | 'filled';
  subkitId?: string;
  subkitName?: string;
  subkitColor?: string;    // Hex from category colorBase
  size: SubkitSize;
  isLargeStart?: boolean;  // First row of a Large block
  isLargeEnd?: boolean;    // Second row of a Large block
}

export interface HousingUnitVisualizerProps {
  slots: SlotState[];              // Always length 6; index 0 = top slot
  readOnly?: boolean;              // true on Summary Page
  onSlotClick?: (slotIndex: number) => void;  // Phase 2 — wired, dormant in MVP
}
```

### Store

```typescript
// src/store/kitStore.ts
import { create } from 'zustand';
import { calculateTotalSlots, canFitSize } from '../utils/slotCalculations';
import type { SubkitSelection, ItemSelection, SubkitSize } from '../types';

const MAX_SLOTS = 6;

interface KitStore {
  selectedSubkits: SubkitSelection[];
  itemSelections: Record<string, ItemSelection>;  // key: `${subkitId}::${itemId}`
  emptyContainers: string[];                       // subkitIds
  currentConfigIndex: number;

  selectSubkit: (categoryId: string) => void;
  deselectSubkit: (subkitId: string) => void;
  setSubkitSize: (subkitId: string, size: SubkitSize) => boolean; // false = not enough slots
  toggleItem: (subkitId: string, itemId: string) => void;
  setItemQuantity: (subkitId: string, itemId: string, qty: number) => void;
  toggleEmptyContainer: (subkitId: string) => void;
  setCurrentConfigIndex: (index: number) => void;
  resetKit: () => void;
}

const initial = {
  selectedSubkits: [] as SubkitSelection[],
  itemSelections: {} as Record<string, ItemSelection>,
  emptyContainers: [] as string[],
  currentConfigIndex: 0,
};

export const useKitStore = create<KitStore>((set, get) => ({
  ...initial,

  selectSubkit: (categoryId) => {
    const { selectedSubkits } = get();
    if (selectedSubkits.some((s) => s.categoryId === categoryId)) return;
    if (calculateTotalSlots(selectedSubkits) + 1 > MAX_SLOTS) return;
    set({
      selectedSubkits: [
        ...selectedSubkits,
        { subkitId: categoryId, categoryId, size: 'regular', selectionOrder: selectedSubkits.length + 1 },
      ],
    });
  },

  deselectSubkit: (subkitId) => {
    const { selectedSubkits, itemSelections, emptyContainers } = get();
    const filtered = selectedSubkits
      .filter((s) => s.subkitId !== subkitId)
      .map((s, i) => ({ ...s, selectionOrder: i + 1 }));
    const cleanedItems = Object.fromEntries(
      Object.entries(itemSelections).filter(([k]) => !k.startsWith(`${subkitId}::`))
    );
    set({
      selectedSubkits: filtered,
      itemSelections: cleanedItems,
      emptyContainers: emptyContainers.filter((id) => id !== subkitId),
    });
  },

  setSubkitSize: (subkitId, size) => {
    const { selectedSubkits } = get();
    if (!canFitSize(selectedSubkits, subkitId, size, MAX_SLOTS)) return false;
    set({
      selectedSubkits: selectedSubkits.map((s) =>
        s.subkitId === subkitId ? { ...s, size } : s
      ),
    });
    return true;
  },

  toggleItem: (subkitId, itemId) => {
    const { itemSelections, emptyContainers } = get();
    if (emptyContainers.includes(subkitId)) return; // blocked on empty-container subkits
    const key = `${subkitId}::${itemId}`;
    if (itemSelections[key]) {
      const { [key]: _, ...rest } = itemSelections;
      set({ itemSelections: rest });
    } else {
      set({ itemSelections: { ...itemSelections, [key]: { itemId, subkitId, quantity: 1 } } });
    }
  },

  setItemQuantity: (subkitId, itemId, qty) => {
    const { itemSelections } = get();
    const key = `${subkitId}::${itemId}`;
    if (!itemSelections[key]) return;
    set({ itemSelections: { ...itemSelections, [key]: { ...itemSelections[key], quantity: Math.max(1, Math.min(10, qty)) } } });
  },

  toggleEmptyContainer: (subkitId) => {
    const { emptyContainers, itemSelections } = get();
    if (emptyContainers.includes(subkitId)) {
      set({ emptyContainers: emptyContainers.filter((id) => id !== subkitId) });
    } else {
      const cleanedItems = Object.fromEntries(
        Object.entries(itemSelections).filter(([k]) => !k.startsWith(`${subkitId}::`))
      );
      set({ emptyContainers: [...emptyContainers, subkitId], itemSelections: cleanedItems });
    }
  },

  setCurrentConfigIndex: (index) => set({ currentConfigIndex: index }),
  resetKit: () => set({ ...initial }),
}));
```

### Selector Hooks

```typescript
// src/hooks/useKitStore.ts
import { useKitStore } from '../store/kitStore';
import { calculateSlotState, calculateTotalSlots, isSlotsAtCapacity } from '../utils/slotCalculations';

// Never call calculateSlotState directly in components — always use this hook
export const useSlotState = () =>
  useKitStore((s) => calculateSlotState(s.selectedSubkits));

export const useTotalSlotsUsed = () =>
  useKitStore((s) => calculateTotalSlots(s.selectedSubkits));

export const useIsAtCapacity = () =>
  useKitStore((s) => isSlotsAtCapacity(s.selectedSubkits));

export const useCanProceedToConfig = () =>
  useKitStore((s) => s.selectedSubkits.length >= 3);

export const useItemSelection = (subkitId: string, itemId: string) =>
  useKitStore((s) => s.itemSelections[`${subkitId}::${itemId}`]);

export const useIsEmptyContainer = (subkitId: string) =>
  useKitStore((s) => s.emptyContainers.includes(subkitId));
```

### Slot Calculation Pure Functions

These are the most safety-critical functions in the application. They live outside the store, are pure, and must achieve 100% branch coverage in tests.

```typescript
// src/utils/slotCalculations.ts
import type { SubkitSelection, SubkitSize, SlotState } from '../types';
import { CATEGORIES } from '../data';

export const MAX_SLOTS = 6;

export function calculateTotalSlots(selections: SubkitSelection[]): number {
  return selections.reduce((total, s) => total + (s.size === 'large' ? 2 : 1), 0);
}

/**
 * Returns true if switching subkitId to targetSize fits within maxSlots.
 * Calculates as if the current size were replaced by targetSize.
 */
export function canFitSize(
  selections: SubkitSelection[],
  subkitId: string,
  targetSize: SubkitSize,
  maxSlots = MAX_SLOTS
): boolean {
  const hypothetical = selections.map((s) =>
    s.subkitId === subkitId ? { ...s, size: targetSize } : s
  );
  return calculateTotalSlots(hypothetical) <= maxSlots;
}

/**
 * Derives the full 6-element SlotState array for HousingUnitVisualizer.
 * ALWAYS returns exactly 6 SlotState objects.
 * Index 0 = top slot. Fills top-to-bottom in selection order.
 * Large subkits occupy two consecutive indices with isLargeStart/isLargeEnd flags.
 */
export function calculateSlotState(selections: SubkitSelection[]): SlotState[] {
  const slots: SlotState[] = Array.from({ length: 6 }, () => ({
    status: 'empty' as const,
    size: 'regular' as const,
  }));
  let i = 0;
  for (const selection of selections) {
    if (i >= 6) break;
    const category = CATEGORIES[selection.categoryId];
    if (!category) continue;
    if (selection.size === 'regular') {
      slots[i] = { status: 'filled', subkitId: selection.subkitId, subkitName: category.name, subkitColor: category.colorBase, size: 'regular' };
      i += 1;
    } else {
      slots[i]     = { status: 'filled', subkitId: selection.subkitId, subkitName: category.name, subkitColor: category.colorBase, size: 'large', isLargeStart: true };
      slots[i + 1] = { status: 'filled', subkitId: selection.subkitId, subkitName: category.name, subkitColor: category.colorBase, size: 'large', isLargeEnd: true };
      i += 2;
    }
  }
  return slots;
}

export function isSlotsAtCapacity(selections: SubkitSelection[]): boolean {
  return calculateTotalSlots(selections) >= MAX_SLOTS;
}
```

---

## 6. Data Layer

No API calls exist in this application. All data is static TypeScript imported at build time.

The following corrections from the UX Spec Developer Notes are applied in `kitItems.ts`:
- ✅ Add: Feminine Hygiene Products (Hygiene)
- ✅ Add: Ice Packs (Medical)
- ✅ Add: Clothing category with Ponchos + Shoe Covers
- ✅ Remove: Repairs/Tools category entirely
- ✅ Remove: Starlink from Communications

```typescript
// src/data/kitItems.ts
import type { KitCategory, KitItem } from '../types';

export const CATEGORIES: Record<string, KitCategory> = {
  power:          { id: 'power',          name: 'Power',          colorBase: '#C2410C', colorTint: '#FFF7ED', icon: 'Zap',              description: 'Charge devices and power essentials without the grid',          sizeOptions: ['regular', 'large'] },
  lighting:       { id: 'lighting',       name: 'Lighting',       colorBase: '#A16207', colorTint: '#FEFCE8', icon: 'Lightbulb',        description: 'Stay oriented and safe when the lights go out',               sizeOptions: ['regular', 'large'] },
  communications: { id: 'communications', name: 'Communications', colorBase: '#1D4ED8', colorTint: '#EFF6FF', icon: 'Radio',            description: 'Stay informed and in contact with your household',            sizeOptions: ['regular', 'large'] },
  hygiene:        { id: 'hygiene',        name: 'Hygiene',        colorBase: '#0F766E', colorTint: '#F0FDFA', icon: 'Droplets',         description: 'Maintain health and sanitation for your household',           sizeOptions: ['regular', 'large'] },
  cooking:        { id: 'cooking',        name: 'Cooking',        colorBase: '#15803D', colorTint: '#F0FDF4', icon: 'UtensilsCrossed',  description: 'Prepare food and purify water without utilities',             sizeOptions: ['regular', 'large'] },
  medical:        { id: 'medical',        name: 'Medical',        colorBase: '#991B1B', colorTint: '#FEF2F2', icon: 'HeartPulse',       description: 'Handle injuries and health needs during an emergency',        sizeOptions: ['regular', 'large'] },
  comfort:        { id: 'comfort',        name: 'Comfort',        colorBase: '#6D28D9', colorTint: '#F5F3FF', icon: 'Smile',            description: 'Reduce stress and maintain wellbeing during extended events', sizeOptions: ['regular', 'large'] },
  clothing:       { id: 'clothing',       name: 'Clothing',       colorBase: '#334155', colorTint: '#F8FAFC', icon: 'Shirt',            description: 'Protect against weather conditions and debris',              sizeOptions: ['regular', 'large'] },
  custom:         { id: 'custom',         name: 'Custom',         colorBase: '#3730A3', colorTint: '#EEF2FF', icon: 'Settings2',        description: 'Choose any items from across all categories',                sizeOptions: ['regular', 'large'] },
};

export const ITEMS: KitItem[] = [
  // Power
  { id: 'power-station',    categoryId: 'power',    name: 'Portable Power Station', description: 'Lithium battery for device charging',        productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'power-solar',      categoryId: 'power',    name: 'Solar Panel',            description: 'Foldable panel for off-grid charging',       productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'power-cables',     categoryId: 'power',    name: 'Charging Cables',        description: 'USB-C and USB-A multi-cable set',            productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'power-banks',      categoryId: 'power',    name: 'Power Banks',            description: 'Pocket-sized backup battery',                productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'power-batteries',  categoryId: 'power',    name: 'Batteries AA/AAA',       description: 'Standard alkaline multi-pack',               productId: null, pricePlaceholder: null, imageSrc: null },
  // Lighting
  { id: 'light-matches',    categoryId: 'lighting', name: 'Matches',                description: 'Waterproof strike-anywhere matches',         productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'light-flashlight', categoryId: 'lighting', name: 'Flashlights',            description: 'High-lumen LED flashlight',                  productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'light-lantern',    categoryId: 'lighting', name: 'Electric Lanterns',      description: 'Rechargeable 360 degree area lantern',       productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'light-headlamp',   categoryId: 'lighting', name: 'Headlamp',               description: 'Hands-free adjustable headlamp',             productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'light-candles',    categoryId: 'lighting', name: 'Candles',                description: 'Long-burn emergency candles',                productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'light-lighter',    categoryId: 'lighting', name: 'Lighter',                description: 'Windproof refillable lighter',               productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'light-string',     categoryId: 'lighting', name: 'String Lights',          description: 'Battery-powered ambient lighting',           productId: null, pricePlaceholder: null, imageSrc: null },
  // Communications — Starlink removed
  { id: 'comms-radio',      categoryId: 'communications', name: 'Hand Crank Radio',  description: 'NOAA weather + AM/FM, no power needed',      productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'comms-walkie',     categoryId: 'communications', name: 'Walkie Talkies',   description: 'Two-way communication up to 35 miles',       productId: null, pricePlaceholder: null, imageSrc: null },
  // Hygiene — Feminine Hygiene Products added
  { id: 'hygiene-dental',   categoryId: 'hygiene',  name: 'Dental Hygiene Kit',     description: 'Travel toothbrush, toothpaste, floss',       productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'hygiene-cups',     categoryId: 'hygiene',  name: 'Paper Cups',             description: 'Disposable cups for clean water use',        productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'hygiene-tp',       categoryId: 'hygiene',  name: 'Toilet Paper',           description: 'Compact emergency-use rolls',                productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'hygiene-wipes',    categoryId: 'hygiene',  name: 'Baby Wipes',             description: 'No-rinse full-body cleansing wipes',         productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'hygiene-feminine', categoryId: 'hygiene',  name: 'Feminine Hygiene Products', description: 'Assorted period care essentials',         productId: null, pricePlaceholder: null, imageSrc: null },
  // Cooking
  { id: 'cook-lifestraw',   categoryId: 'cooking',  name: 'Lifestraw',              description: 'Personal water filtration straw',            productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'cook-propane',     categoryId: 'cooking',  name: 'Propane Tank',           description: '1lb canister for camp stove',                productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'cook-stove',       categoryId: 'cooking',  name: 'Camping Stove',          description: 'Compact single-burner propane stove',        productId: null, pricePlaceholder: null, imageSrc: null },
  // Medical — Ice Packs added
  { id: 'med-first-aid',    categoryId: 'medical',  name: 'First Aid Kit',          description: 'Comprehensive 200-piece trauma kit',         productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'med-ice-packs',    categoryId: 'medical',  name: 'Ice Packs',              description: 'Instant cold compress packs',                productId: null, pricePlaceholder: null, imageSrc: null },
  // Comfort
  { id: 'comfort-fan',      categoryId: 'comfort',  name: 'Portable Fan',           description: 'Battery-powered USB desk fan',               productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'comfort-earplugs', categoryId: 'comfort',  name: 'Ear Plugs',              description: 'High-NRR foam ear plugs',                    productId: null, pricePlaceholder: null, imageSrc: null },
  // Clothing — new category; Repairs/Tools removed entirely
  { id: 'cloth-ponchos',    categoryId: 'clothing', name: 'Ponchos',                description: 'Waterproof hooded emergency ponchos',        productId: null, pricePlaceholder: null, imageSrc: null },
  { id: 'cloth-shoe-covers',categoryId: 'clothing', name: 'Shoe Covers',            description: 'Heavy-duty waterproof boot covers',          productId: null, pricePlaceholder: null, imageSrc: null },
];

/** Items grouped by categoryId — used by Custom subkit browser. */
export const ITEMS_BY_CATEGORY: Record<string, KitItem[]> = ITEMS.reduce(
  (acc, item) => ({ ...acc, [item.categoryId]: [...(acc[item.categoryId] ?? []), item] }),
  {} as Record<string, KitItem[]>
);

/** Standard category IDs in display order — excludes 'custom'. */
export const STANDARD_CATEGORY_IDS = [
  'power', 'lighting', 'communications', 'hygiene',
  'cooking', 'medical', 'comfort', 'clothing',
] as const;

/**
 * lucide-react icon names for items that need non-category icons.
 * Per UX spec Section 6 — new items for added categories.
 */
export const ITEM_ICON_OVERRIDES: Record<string, string> = {
  'hygiene-feminine':  'Droplet',
  'med-ice-packs':     'Snowflake',
  'cloth-ponchos':     'CloudRain',
  'cloth-shoe-covers': 'Footprints',
};
```

---

## 7. Routing

### Route Configuration

```typescript
// src/router/index.tsx
import { createBrowserRouter, redirect } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { SubkitSelectionScreen } from '../components/subkit-selection/SubkitSelectionScreen';
import { ItemConfigScreen } from '../components/item-config/ItemConfigScreen';
import { CustomSubkitScreen } from '../components/item-config/CustomSubkitScreen';
import { SummaryScreen } from '../components/summary/SummaryScreen';
import { subkitConfigGuard, customConfigGuard, summaryGuard } from './guards';

export const router = createBrowserRouter([
  {
    element: <AppShell />,  // Persistent header + MobileInterstitial wrapper
    children: [
      {
        path: '/',
        element: <SubkitSelectionScreen />,
      },
      {
        // Guard: redirect to '/' if subkitId not in selectedSubkits
        path: '/configure/:subkitId',
        element: <ItemConfigScreen />,
        loader: subkitConfigGuard,
      },
      {
        // Guard: redirect to '/' if 'custom' not in selectedSubkits
        // React Router v6 Data Router automatically ranks static paths over dynamic
        // segments — no special ordering required.
        path: '/configure/custom',
        element: <CustomSubkitScreen />,
        loader: customConfigGuard,
      },
      {
        // Guard: redirect to '/' if fewer than 3 subkits selected
        path: '/summary',
        element: <SummaryScreen />,
        loader: summaryGuard,
      },
      {
        // Catch-all — unknown paths redirect to entry
        path: '*',
        loader: () => redirect('/'),
      },
    ],
  },
]);
```

```typescript
// src/router/guards.ts
// Guards use getState() — not hooks — because loaders run outside React render cycle.
import { redirect } from 'react-router-dom';
import { useKitStore } from '../store/kitStore';

export function subkitConfigGuard({ params }: { params: Record<string, string | undefined> }) {
  const { selectedSubkits } = useKitStore.getState();
  const isValid = selectedSubkits.some((s) => s.subkitId === params['subkitId']);
  return isValid ? null : redirect('/');
}

export function customConfigGuard() {
  const { selectedSubkits } = useKitStore.getState();
  const hasCustom = selectedSubkits.some((s) => s.categoryId === 'custom');
  return hasCustom ? null : redirect('/');
}

export function summaryGuard() {
  const { selectedSubkits } = useKitStore.getState();
  return selectedSubkits.length >= 3 ? null : redirect('/');
}
```

### Navigation Flow

```
/ (SubkitSelectionScreen)
└── [Configure Items — active only with >= 3 subkits]
    └── /configure/:firstSubkitId  (ItemConfigScreen)
        └── [Next Subkit] → /configure/:nextSubkitId  (repeat per subkit)
        └── [Next Subkit — if Custom selected] → /configure/custom  (CustomSubkitScreen)
        └── [Review My Kit — on final subkit] → /summary

/summary (SummaryScreen)
├── [Edit My Kit] → /  (full store state preserved)
└── [Start Over] → ConfirmationModal → resetKit() → /
```

### Screen Transition Directions

Forward transitions (`/` → `/configure/:id` → `/summary`): exit `translateX(-16px)` + fade; enter from `+16px`.
Back transitions: direction reverses. Duration: `var(--duration-screen)` (240ms). This must be implemented at the router level using a transition wrapper, not inside individual screen components.

---

## 8. Styling Guidelines

### Approach

**Tailwind CSS v4 + CSS Custom Properties.** All design tokens from `design-tokens.ts` are mirrored as CSS custom properties in the `@theme` block in `globals.css`. This creates one authoritative styling pipeline:

```
design-tokens.ts  →  globals.css @theme  →  Tailwind utility classes in components
```

**Dynamic category colors** (visualizer fills, card borders, progress bar fills) must use **inline styles** — Tailwind cannot generate classes for runtime hex values:

```tsx
// Correct — dynamic color as inline style
<div style={{ backgroundColor: category.colorBase }} className="h-10 rounded-[var(--radius-md)]" />

// Wrong — Tailwind cannot generate this at runtime
<div className={`bg-[${category.colorBase}]`} />
```

**All static structural UI** (layout, spacing, neutral colors, typography sizing) uses Tailwind utility classes.

### globals.css

```css
/* src/styles/globals.css */
@import "tailwindcss";
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

@theme {
  /* Font */
  --font-sans: 'Inter', system-ui, sans-serif;

  /* Brand */
  --color-brand-primary:       #1F4D35;
  --color-brand-primary-hover: #163828;
  --color-brand-primary-light: #E8F5EE;
  --color-brand-accent:        #22C55E;

  /* Neutrals */
  --color-neutral-white: #FFFFFF;
  --color-neutral-50:    #F8F9FA;
  --color-neutral-100:   #F3F4F6;
  --color-neutral-200:   #E5E7EB;
  --color-neutral-300:   #D1D5DB;
  --color-neutral-400:   #9CA3AF;
  --color-neutral-500:   #6B7280;
  --color-neutral-700:   #374151;
  --color-neutral-900:   #111827;

  /* Semantic */
  --color-status-success: #16A34A;
  --color-status-warning: #D97706;
  --color-status-error:   #DC2626;
  --color-status-info:    #2563EB;

  /* Border radius */
  --radius-sm:   6px;
  --radius-md:   10px;
  --radius-lg:   16px;
  --radius-full: 9999px;

  /* Elevation */
  --shadow-1: 0 1px 3px rgba(0,0,0,0.08);
  --shadow-2: 0 4px 6px rgba(0,0,0,0.07);
  --shadow-3: 0 20px 25px rgba(0,0,0,0.12);

  /* Motion durations */
  --duration-instant:  0ms;
  --duration-fast:     130ms;
  --duration-default:  150ms;
  --duration-moderate: 200ms;
  --duration-standard: 220ms;
  --duration-screen:   240ms;
  --duration-reward:   360ms;

  /* Motion easings */
  --ease-standard:   cubic-bezier(0.4, 0, 0.2, 1);
  --ease-decelerate: cubic-bezier(0, 0, 0.2, 1);
  --ease-accelerate: cubic-bezier(0.4, 0, 1, 1);
  --ease-spring:     cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Global base */
:root {
  font-family: var(--font-sans);
  background-color: var(--color-neutral-50);
  color: var(--color-neutral-700);
  -webkit-font-smoothing: antialiased;
}

/* Focus indicators — per UX spec Section 7 */
:focus-visible {
  outline: 2px solid var(--color-brand-primary);
  outline-offset: 2px;
  border-radius: 4px;
}
.subkit-card:focus-visible {
  outline: 3px solid var(--color-brand-primary);
  outline-offset: 0;
}
:focus:not(:focus-visible) { outline: none; }

/* Reduced motion — hard requirement from UX spec Section 9 */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### print.css

Imported **only** in `SummaryScreen.tsx` — not global.

```css
/* src/styles/print.css */
@media print {
  header,
  .step-progress-indicator,
  .btn-get-my-kit,
  .btn-edit,
  .btn-print,
  .btn-start-over { display: none !important; }

  body { background: white; font-size: 12pt; color: #000; }

  .summary-subkit-section { page-break-inside: avoid; }

  /* No + icons in print — empty slots render as clean boxes */
  .visualizer-slot-empty::after { content: none; }
  .visualizer-slot-empty {
    background-color: #f8f9fa !important;
    border: 1px solid #e5e7eb !important;
  }
}
```

### Animation Rules

All animations use **`transform` and `opacity` only** — GPU-composited, zero layout reflow. This is the hard architectural constraint behind NFR2 (slot updates < 100ms).

```tsx
// Correct — GPU-composited properties only
style={{ opacity: filled ? 1 : 0, transition: `opacity var(--duration-standard) var(--ease-standard)` }}
style={{ transform: 'translateX(0)', transition: `transform var(--duration-screen) var(--ease-standard)` }}

// Never animate these — they cause layout reflow:
// width, height, top, left, right, bottom, padding, margin
```

**Slot fill animation detail** (Animation #1 from UX spec):
- The slot `div` transitions `background-color` over 220ms
- The name `span` inside delays its `opacity` transition by 80ms
- These are two separate CSS transitions on two separate elements — not a single combined transition

**Large block behavior** (Animation #9):
- Both rows (`isLargeStart` and `isLargeEnd`) receive the same `background-color` transition simultaneously
- The internal divider between them transitions `opacity` to 0 — both rows visually merge into one continuous block

---

## 9. Testing Requirements

### Strategy

Per PRD Technical Assumptions:
- **Unit tests:** Core logic — slot calculations, size constraints, item catalog filtering. 100% branch coverage required on `slotCalculations.ts`.
- **Component tests:** HousingUnitVisualizer, SubkitCard, ItemCard, QuantitySelector — each must include an axe accessibility assertion.
- **Manual E2E:** Full flows tested manually in MVP. Automated E2E (Playwright) deferred to Phase 2.
- **Accessibility:** `@axe-core/react` mounted in development. `eslint-plugin-jsx-a11y` runs in CI. Manual screen reader test (NVDA+Chrome or VoiceOver+Safari) required at each epic completion.

### vitest.config.ts

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/utils/**', 'src/store/**', 'src/components/**'],
      exclude: ['src/data/**', 'src/types/**', 'src/tokens/**'],
    },
  },
});
```

### Test Setup

```typescript
// tests/setup.ts
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

configure({ testIdAttribute: 'data-testid' });
```

### Slot Calculation Unit Tests (required coverage: 100% branches)

```typescript
// tests/unit/slotCalculations.test.ts
import { describe, it, expect } from 'vitest';
import { calculateTotalSlots, calculateSlotState, canFitSize, isSlotsAtCapacity } from '../../src/utils/slotCalculations';
import type { SubkitSelection } from '../../src/types';

const sel = (id: string, size: 'regular' | 'large', order: number): SubkitSelection =>
  ({ subkitId: id, categoryId: id, size, selectionOrder: order });

describe('calculateTotalSlots', () => {
  it('counts regular as 1 slot', () => expect(calculateTotalSlots([sel('power','regular',1)])).toBe(1));
  it('counts large as 2 slots',  () => expect(calculateTotalSlots([sel('power','large',1)])).toBe(2));
  it('handles mixed sizes',       () => expect(calculateTotalSlots([sel('a','large',1), sel('b','regular',2), sel('c','regular',3)])).toBe(4));
  it('returns 0 for empty',       () => expect(calculateTotalSlots([])).toBe(0));
});

describe('canFitSize', () => {
  it('blocks large when switching would exceed 6', () => {
    const s = [sel('a','large',1), sel('b','large',2), sel('c','regular',3), sel('d','regular',4)];
    expect(canFitSize(s, 'c', 'large', 6)).toBe(false);
  });
  it('allows large when slots are available', () => {
    expect(canFitSize([sel('a','regular',1)], 'a', 'large', 6)).toBe(true);
  });
  it('allows shrinking large to regular always', () => {
    const s = [sel('a','large',1), sel('b','large',2), sel('c','regular',3)];
    expect(canFitSize(s, 'a', 'regular', 6)).toBe(true);
  });
});

describe('calculateSlotState', () => {
  it('always returns exactly 6 slots', () => {
    expect(calculateSlotState([]).length).toBe(6);
    expect(calculateSlotState([sel('power','large',1), sel('medical','large',2), sel('hygiene','regular',3)]).length).toBe(6);
  });
  it('fills top-to-bottom in selection order', () => {
    const slots = calculateSlotState([sel('power','regular',1)]);
    expect(slots[0].status).toBe('filled');
    expect(slots[1].status).toBe('empty');
  });
  it('sets isLargeStart and isLargeEnd on large blocks', () => {
    const slots = calculateSlotState([sel('power','large',1)]);
    expect(slots[0].isLargeStart).toBe(true);
    expect(slots[1].isLargeEnd).toBe(true);
    expect(slots[2].status).toBe('empty');
  });
  it('all slots empty when no selections', () => {
    calculateSlotState([]).forEach((s) => expect(s.status).toBe('empty'));
  });
  it('does not exceed 6 slots even with overflow input', () => {
    const over = Array.from({length:7}, (_,i) => sel(`cat${i}`,'regular',i+1));
    const slots = calculateSlotState(over);
    expect(slots.length).toBe(6);
    expect(slots.every((s) => s.status === 'filled')).toBe(false); // last slot empty guard
  });
});

describe('isSlotsAtCapacity', () => {
  it('returns true at exactly 6 slots', () => {
    const s = Array.from({length:6}, (_,i) => sel(`cat${i}`,'regular',i+1));
    expect(isSlotsAtCapacity(s)).toBe(true);
  });
  it('returns false below 6 slots', () => {
    expect(isSlotsAtCapacity([sel('a','regular',1)])).toBe(false);
  });
});
```

### Component Test Template

```typescript
// tests/components/HousingUnitVisualizer.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HousingUnitVisualizer } from '../../src/components/visualizer/HousingUnitVisualizer';
import { calculateSlotState } from '../../src/utils/slotCalculations';

const emptySlots = calculateSlotState([]);

describe('HousingUnitVisualizer', () => {
  it('renders 6 slot containers', () => {
    const { container } = render(<HousingUnitVisualizer slots={emptySlots} />);
    expect(container.querySelectorAll('[data-testid^="slot-"]').length).toBe(6);
  });
  it('shows subkit name when slot is filled', () => {
    const slots = calculateSlotState([{ subkitId: 'power', categoryId: 'power', size: 'regular', selectionOrder: 1 }]);
    render(<HousingUnitVisualizer slots={slots} />);
    expect(screen.getByText('Power')).toBeInTheDocument();
  });
  it('hides + icons in readOnly mode', () => {
    render(<HousingUnitVisualizer slots={emptySlots} readOnly />);
    expect(screen.queryAllByRole('img', { name: /add/i }).length).toBe(0);
  });
  it('uses 44px slot height in readOnly mode', () => {
    const { container } = render(<HousingUnitVisualizer slots={emptySlots} readOnly />);
    const firstSlot = container.querySelector('[data-testid="slot-0"]') as HTMLElement;
    expect(firstSlot.style.height).toBe('44px');
  });
});
```

### Testing Best Practices

1. **`slotCalculations.ts` — 100% branch coverage is mandatory.** This is the most safety-critical code in the app; incorrect slot math produces physically invalid kit configurations.
2. **Test behavior, not implementation.** Use `getByRole`, `getByText`, `getByLabelText` — never class names or internal state.
3. **axe assertion on every component test file.** At minimum one `axe(container)` + `toHaveNoViolations()` per file.
4. **No snapshot tests.** The design system evolves; snapshots break on every style change and provide no behavioral signal.
5. **Zustand store resets between tests.** Call `useKitStore.getState().resetKit()` in `beforeEach` for any test that exercises the store.

---

## 10. Environment Configuration

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

## 11. Frontend Developer Standards

### Critical Rules — Dev Agent Must Follow

These rules exist because violations here produce bugs that are invisible at compile time but break the physical kit constraint logic at runtime.

| # | Rule | Why |
|---|------|-----|
| 1 | **Never store slot state in Zustand.** Slot state is always computed via `calculateSlotState()`. Storing it creates sync bugs. | NFR2 + slot constraint correctness |
| 2 | **Never call `calculateSlotState()` directly in components.** Always use `useSlotState()` from `src/hooks/useKitStore.ts`. | Prevents duplicated computation and ensures consistency |
| 3 | **Dynamic category colors must use inline styles.** `style={{ backgroundColor: category.colorBase }}` — never template literal Tailwind classes. | Tailwind purges unused dynamic classes at build time |
| 4 | **All animations use `transform` and `opacity` only.** Animating `width`, `height`, or positional properties breaks the 100ms slot update NFR. | NFR2 |
| 5 | **All interactive elements must have an accessible label.** Use `aria-label`, `aria-labelledby`, or visible associated `<label>`. The axe test will catch violations. | WCAG 2.1 AA |
| 6 | **The Configure Items CTA uses `aria-disabled` + `aria-describedby`, not the `disabled` attribute.** Keyboard users must be able to reach it and read the minimum message. | UX spec Section 7 |
| 7 | **Named imports only from `lucide-react`.** Never `import * as Icons from 'lucide-react'`. | Bundle size — prevents importing 1000+ icons |
| 8 | **`QuantitySelector` container always reserves its layout space.** Only `opacity` and `pointer-events` change. Never conditionally render or hide with `display:none`. | CLS prevention — UX spec Section 10 |
| 9 | **`EmptyContainerOption` is rendered on both `ItemConfigScreen` and `CustomSubkitScreen`.** The Custom subkit supports the empty container option identically to standard subkits per PRD FR9. Behavior: deselects all Custom items, dims item grid, displays inline confirmation in Custom category color (`#3730A3`), reflected on Summary Page. | PRD FR9 scope |
| 10 | **The `HousingUnitVisualizer` receives no store references.** It takes only `slots: SlotState[]`, `readOnly?`, and `onSlotClick?`. All derivation happens in the parent. | NFR6 — self-contained extensible module |

### Quick Reference

```bash
# Development
npm run dev          # Vite dev server — http://localhost:5173
npm run build        # Production build to dist/
npm run preview      # Preview production build locally

# Quality
npm run lint         # ESLint + jsx-a11y
npm run typecheck    # tsc --noEmit

# Testing
npm run test         # Vitest — watch mode
npm run test:run     # Vitest — single run (CI)
npm run test:coverage  # Coverage report
```

### Key Import Patterns

```typescript
// Types
import type { KitCategory, KitItem, SubkitSelection } from '../types';
import type { SlotState, HousingUnitVisualizerProps } from '../types';

// Data
import { CATEGORIES, ITEMS, ITEMS_BY_CATEGORY, STANDARD_CATEGORY_IDS } from '../data';

// Store
import { useKitStore } from '../store/kitStore';
import { useSlotState, useIsAtCapacity, useCanProceedToConfig } from '../hooks/useKitStore';

// Slot utils — only in tests and the store; never import directly into components
import { calculateSlotState, canFitSize } from '../utils/slotCalculations';

// Icons — named imports only
import { Zap, Radio, HeartPulse, Settings2 } from 'lucide-react';

// Env
import { ENV } from '../tokens/env';
```

### Focus Management on Screen Transitions

Per UX spec Section 7, focus must move to the main heading on every screen change:

```typescript
// Pattern to use in every screen component
import { useEffect, useRef } from 'react';

export const ItemConfigScreen: FC = () => {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);  // Runs on mount — each screen mounts fresh on navigation

  return (
    <main>
      <h1 ref={headingRef} tabIndex={-1} className="text-[var(--text-h1)] font-bold text-[var(--color-neutral-900)] outline-none">
        Configure Your Power Subkit
      </h1>
      {/* ... */}
    </main>
  );
};
```

### ARIA Live Region Setup

A single `aria-live` region for polite announcements and one for assertive announcements should be mounted in `AppShell` and populated via a shared announcement utility — not duplicated per component:

```typescript
// src/utils/announce.ts
let politeEl: HTMLElement | null = null;
let assertiveEl: HTMLElement | null = null;

export function initAnnouncer(polite: HTMLElement, assertive: HTMLElement) {
  politeEl = polite;
  assertiveEl = assertive;
}

export function announcePolite(message: string) {
  if (!politeEl) return;
  politeEl.textContent = '';
  requestAnimationFrame(() => { if (politeEl) politeEl.textContent = message; });
}

export function announceAssertive(message: string) {
  if (!assertiveEl) return;
  assertiveEl.textContent = '';
  requestAnimationFrame(() => { if (assertiveEl) assertiveEl.textContent = message; });
}
```

Call `announcePolite` / `announceAssertive` from store action side-effects or component event handlers per the ARIA announcements table in UX spec Section 7.

---

## 12. Phase 2 Extension Points

All Phase 2 features are **designed for** in this architecture without being implemented in MVP. No stubs or placeholder components are required — the extension paths are purely additive.

| Feature | Extension Path | What Changes |
|---------|---------------|-------------|
| **`onSlotClick` — clickable visualizer** | `HousingUnitVisualizer` already accepts `onSlotClick?: (slotIndex: number) => void`. Each `VisualizerSlot` has `data-slot-index` attribute. In Phase 2: pass a handler from `SubkitSelectionScreen` and add visual affordance (cursor pointer, hover state) to slots. No component rebuild required. | Handler wired, no visual affordance in MVP |
| **localStorage state persistence** | Add Zustand `persist` middleware to `kitStore.ts`. One import, one `create` wrapper change. All selectors and actions unchanged. | `import { persist } from 'zustand/middleware'` + wrap store definition |
| **Weight tracking** | Add `weightGrams` field to `KitItem` in `kitItems.ts`. Add `calculateTotalWeight()` pure function in `slotCalculations.ts`. Display in `SummaryScreen`. No state layer changes. | Data field + utility function + display component |
| **Product photography** | `KitItem.imageSrc` is already defined as `string \| null`. `ImageWithFallback` already handles `null` with the category tint fallback. In Phase 2: populate `imageSrc` in `kitItems.ts`. No component changes. | Data population only |
| **Branded product mapping + pricing** | `KitItem.productId` and `KitItem.pricePlaceholder` already defined. In Phase 2: populate fields, add price display to `ItemCard` and `SubkitSummarySection`. | Data population + display components |
| **E-commerce / checkout** | `ENV.purchaseUrl` is already consumed by the 'Get My Kit' CTA. Phase 2 replaces the static URL with a cart-building API call that receives the serialized kit state. The store's `selectedSubkits` and `itemSelections` are the payload. No routing changes. | API layer + cart serialization utility |
| **Full mobile responsive** | Tailwind breakpoint classes are already used throughout. The `MobileInterstitial` threshold is a single `useMediaQuery` hook value. In Phase 2: remove the 768px redirect, implement mobile-specific layouts per breakpoint. | Remove interstitial guard + add mobile layout variants |
| **Bazaarvoice reviews integration** | No architectural impact. Will be a new route or modal, consuming an external script. Add to `AppShell` script loading. | New route/component only |
| **Automated E2E (Playwright)** | Add `playwright` to `devDependencies`. Add `tests/e2e/` directory. No changes to application code. | Test tooling only |
| **Analytics** | User behavior tracking formally deferred. Priority metrics to instrument: kit completion rate, subkit selection frequency, item inclusion rates, Summary Page CTA conversion. Recommended tool: Plausible or Google Analytics 4. Add to `AppShell` script loading and `ENV` token file. No application logic changes required. | Script tag + env var only |

---

*Emergency Prep Kit Builder — Frontend Architecture Document | Version 1.0 | 2026-03-02 | Winston, Architect*