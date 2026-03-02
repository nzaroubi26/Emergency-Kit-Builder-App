# 9. Testing Requirements

## Strategy

Per PRD Technical Assumptions:
- **Unit tests:** Core logic — slot calculations, size constraints, item catalog filtering. 100% branch coverage required on `slotCalculations.ts`.
- **Component tests:** HousingUnitVisualizer, SubkitCard, ItemCard, QuantitySelector — each must include an axe accessibility assertion.
- **Manual E2E:** Full flows tested manually in MVP. Automated E2E (Playwright) deferred to Phase 2.
- **Accessibility:** `@axe-core/react` mounted in development. `eslint-plugin-jsx-a11y` runs in CI. Manual screen reader test (NVDA+Chrome or VoiceOver+Safari) required at each epic completion.

## vitest.config.ts

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

## Test Setup

```typescript
// tests/setup.ts
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

configure({ testIdAttribute: 'data-testid' });
```

## Slot Calculation Unit Tests (required coverage: 100% branches)

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

## Component Test Template

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

## Testing Best Practices

1. **`slotCalculations.ts` — 100% branch coverage is mandatory.** This is the most safety-critical code in the app; incorrect slot math produces physically invalid kit configurations.
2. **Test behavior, not implementation.** Use `getByRole`, `getByText`, `getByLabelText` — never class names or internal state.
3. **axe assertion on every component test file.** At minimum one `axe(container)` + `toHaveNoViolations()` per file.
4. **No snapshot tests.** The design system evolves; snapshots break on every style change and provide no behavioral signal.
5. **Zustand store resets between tests.** Call `useKitStore.getState().resetKit()` in `beforeEach` for any test that exercises the store.

---
