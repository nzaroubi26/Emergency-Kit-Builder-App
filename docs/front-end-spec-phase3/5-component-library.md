# 5. Component Library

## New Component Summary

| Component | Screens | Key States |
|-----------|---------|------------|
| MCQTile | MCQ-1, MCQ-2 | Unselected, Selected, Disabled |
| MCQNotaTile | MCQ-2 | Unselected, Selected |
| MCQStepIndicator | MCQ-1, MCQ-2 | Step 1 of 2, Step 2 of 2 |
| ForkCard | F1 | Default, Hover |
| BundlePreview | F1 (Essentials card) | Static |
| KitSummaryCard | RO | Essentials variant, Custom variant |
| DeliverySection | RO | Deliver selected, Pickup selected |
| BackLink | MCQ-1, MCQ-2, F1, RO | Static |

---

## MCQTile

Reusable multi-select tile for MCQ questions. Used for all standard options on both Q1 and Q2.

```typescript
interface MCQTileProps {
  label: string;
  icon: string;             // lucide-react icon name
  selected: boolean;
  disabled?: boolean;       // default false
  disabledLabel?: string;   // e.g., "Coming Soon"
  onClick: () => void;
}
```

| State | Background | Border | Text Color | Icon Color |
|-------|-----------|--------|------------|------------|
| Unselected | `#FFFFFF` | 2px `#E5E7EB` | `#374151` | `#6B7280` |
| Selected | `#E8F5EE` | 2px `#1F4D35` | `#1F4D35` | `#1F4D35` |
| Disabled | `#F3F4F6` | 2px `#E5E7EB` | `#9CA3AF` | `#9CA3AF` |

- Dimensions: min-height 72px, `radius-md` (10px), `px-4 py-3`
- Layout: `flex items-center gap-3` — icon (24px) left, label center-left
- Selected checkmark: `brand-accent` (`#22C55E`) circle (20px) with white check, positioned absolute top-right (`top-2 right-2`)
- Disabled badge: pill right-aligned, `neutral-200` bg, `neutral-400` text, `text-caption`
- Touch target: entire tile is clickable, min 44px height
- Hover (non-disabled): `shadow-1` transition 150ms
- Cursor: `pointer` (default), `not-allowed` (disabled)

---

## MCQNotaTile

"None of the Above" tile variant. Text-only, no icon, full-width, visually distinct from standard tiles.

```typescript
interface MCQNotaTileProps {
  selected: boolean;
  onClick: () => void;
}
```

| State | Background | Border | Text Color |
|-------|-----------|--------|------------|
| Unselected | `#FFFFFF` | 2px `#E5E7EB` | `#6B7280` |
| Selected | `#F3F4F6` | 2px `#374151` | `#374151` |

- Dimensions: min-height 56px, full-width (spans grid), `radius-md` (10px), `px-4 py-3`
- Layout: `flex items-center justify-center` — label centered
- Selected checkmark: `neutral-700` (`#374151`) circle (not green) — distinct from standard tile
- Separated from main grid by `neutral-200` 1px divider with `my-4` spacing

---

## MCQStepIndicator

Lightweight "Step X of 2" text indicator for MCQ screens only. Not related to the main `StepProgressIndicator`.

```typescript
interface MCQStepIndicatorProps {
  currentStep: 1 | 2;
  totalSteps: 2;
}
```

- Text: "Step {currentStep} of {totalSteps}" — `text-caption` (12px/400), `neutral-400`
- Position: top-right of content area, same line as BackLink (flex row, justify-between)

---

## ForkCard

Presentational card for the fork screen. Both instances share the same structural shell; content is passed as children or via props.

```typescript
interface ForkCardProps {
  icon: string;              // lucide-react icon name
  heading: string;
  children: React.ReactNode; // body content (copy, badge, bundle preview, feature list)
  ctaLabel: string;
  onCtaClick: () => void;
}
```

- Card shell: white bg, 1px `neutral-200` border, `radius-lg` (16px), `shadow-1`, `p-6`
- Hover: `shadow-2`, transition 150ms standard
- Icon: 40px, `brand-primary`, `mb-4`
- Heading: `text-h2` (22px/600), `neutral-900`, `mb-2`
- CTA: `PrimaryButton`, full-width within card, `mt-6`
- Width: `flex-1` in parent flex container (equal width)

---

## BundlePreview

Static display of the Essentials bundle contents. Used inside the Essentials ForkCard.

```typescript
interface BundlePreviewProps {
  bundle: EssentialsBundleItem[]; // from essentialsConfig.ts
}
```

- Container: `neutral-50` bg, `radius-md`, `p-3`
- Each row: flex row, `gap-2`, `py-1`. Category icon (16px, category base color) + name (`text-body` 14px, `neutral-700`) + size label (`text-caption` 12px, `neutral-500`, `ml-auto`)
- Dividers: none between rows — spacing (`gap-2`) is sufficient

---

## BackLink

Consistent back navigation used on all four new screens.

```typescript
interface BackLinkProps {
  to: string;               // route path
  label?: string;           // default "Back"
}
```

- Text: `← {label}` — `text-label` (14px/500), `neutral-500`
- Hover: `neutral-700`, transition 100ms
- Position: top-left of content area, flex row with MCQStepIndicator (on MCQ screens) or standalone
- Uses React Router `<Link>` — not `window.history.back()`
- `mb-6` below before page heading

---
