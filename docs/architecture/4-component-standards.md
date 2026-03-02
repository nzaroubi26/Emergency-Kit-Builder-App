# 4. Component Standards

## Naming Conventions

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

## Component Template

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

## Component Rules

- **Named exports only** — no `export default`. Enables reliable refactoring and import tracing.
- **FC\<Props\> type** — always explicitly typed.
- **Props interface co-located** — in same file unless shared across multiple files (then in `types/`).
- **No logic in JSX** — extract conditionals and derived values to `const` above `return`.
- **Accessibility first** — all interactive elements must have `aria-label` or associated visible label. See Section 11.

---
