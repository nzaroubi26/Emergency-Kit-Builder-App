import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { SubkitSelectionScreen } from '../../src/components/subkit-selection/SubkitSelectionScreen';
import { useKitStore } from '../../src/store/kitStore';
import { initAnnouncer } from '../../src/utils/announce';

expect.extend(matchers);

vi.mock('../../src/hooks/useResponsive', () => ({
  useIsMobile: () => false,
  useIsTablet: () => false,
  useIsDesktop: () => true,
}));

function renderScreen() {
  const router = createMemoryRouter(
    [{ path: '/', element: <SubkitSelectionScreen /> }],
    { initialEntries: ['/'] }
  );
  return render(<RouterProvider router={router} />);
}

function setupAnnouncer() {
  const polite = document.createElement('div');
  polite.setAttribute('aria-live', 'polite');
  const assertive = document.createElement('div');
  assertive.setAttribute('aria-live', 'assertive');
  document.body.appendChild(polite);
  document.body.appendChild(assertive);
  initAnnouncer(polite, assertive);
  return { polite, assertive };
}

describe('Subkit-Visualizer Integration', () => {
  beforeEach(() => {
    useKitStore.getState().resetKit();
  });

  it('selecting a category fills the visualizer slot with correct color and name', () => {
    renderScreen();

    const powerButton = screen.getByRole('button', { name: /Power subkit/i });
    fireEvent.click(powerButton);

    const slot0 = screen.getByTestId('slot-0');
    expect(slot0).toHaveAttribute('aria-label', 'Slot 1: Power');
    expect(slot0.style.backgroundColor).toBe('rgb(194, 65, 12)');
  });

  it('deselecting a category clears the visualizer slot to empty', () => {
    renderScreen();

    const powerButton = screen.getByRole('button', { name: /Power subkit/i });
    fireEvent.click(powerButton);
    expect(screen.getByTestId('slot-0')).toHaveAttribute('aria-label', 'Slot 1: Power');

    fireEvent.click(powerButton);
    expect(screen.getByTestId('slot-0')).toHaveAttribute('aria-label', 'Slot 1: empty');
  });

  it('fills slots top to bottom in selection order', () => {
    renderScreen();

    fireEvent.click(screen.getByRole('button', { name: /Power subkit/i }));
    fireEvent.click(screen.getByRole('button', { name: /Lighting subkit/i }));
    fireEvent.click(screen.getByRole('button', { name: /Hygiene subkit/i }));

    expect(screen.getByTestId('slot-0')).toHaveAttribute('aria-label', 'Slot 1: Power');
    expect(screen.getByTestId('slot-1')).toHaveAttribute('aria-label', 'Slot 2: Lighting');
    expect(screen.getByTestId('slot-2')).toHaveAttribute('aria-label', 'Slot 3: Hygiene');
    expect(screen.getByTestId('slot-3')).toHaveAttribute('aria-label', 'Slot 4: empty');
  });

  it('deselecting a mid-sequence subkit shifts remaining slots up', () => {
    renderScreen();

    fireEvent.click(screen.getByRole('button', { name: /Power subkit/i }));
    fireEvent.click(screen.getByRole('button', { name: /Lighting subkit/i }));
    fireEvent.click(screen.getByRole('button', { name: /Hygiene subkit/i }));

    fireEvent.click(screen.getByRole('button', { name: /Lighting subkit, selected/i }));

    expect(screen.getByTestId('slot-0')).toHaveAttribute('aria-label', 'Slot 1: Power');
    expect(screen.getByTestId('slot-1')).toHaveAttribute('aria-label', 'Slot 2: Hygiene');
    expect(screen.getByTestId('slot-2')).toHaveAttribute('aria-label', 'Slot 3: empty');
  });

  it('large subkit fills two consecutive slots', () => {
    renderScreen();

    fireEvent.click(screen.getByRole('button', { name: /Power subkit/i }));

    const sizeGroup = screen.getByRole('radiogroup', { name: /Subkit size/i });
    const largeRadio = sizeGroup.querySelector('[aria-checked]:last-child') as HTMLElement;
    fireEvent.click(largeRadio);

    expect(screen.getByTestId('slot-0')).toHaveAttribute('aria-label', 'Slot 1: Power');
    expect(screen.getByTestId('slot-1')).toHaveAttribute('aria-label', 'Slot 2: Power');
    expect(screen.getByTestId('slot-2')).toHaveAttribute('aria-label', 'Slot 3: empty');
  });

  it('switching large to regular frees a slot', () => {
    renderScreen();

    fireEvent.click(screen.getByRole('button', { name: /Power subkit/i }));

    const sizeGroup = screen.getByRole('radiogroup', { name: /Subkit size/i });
    const largeRadio = sizeGroup.querySelector('[aria-checked]:last-child') as HTMLElement;
    fireEvent.click(largeRadio);
    expect(screen.getByTestId('slot-1')).toHaveAttribute('aria-label', 'Slot 2: Power');

    const regularRadio = sizeGroup.querySelector('[aria-checked]:first-child') as HTMLElement;
    fireEvent.click(regularRadio);
    expect(screen.getByTestId('slot-1')).toHaveAttribute('aria-label', 'Slot 2: empty');
  });

  it('card selected state always matches visualizer slot state', () => {
    renderScreen();

    const powerButton = screen.getByRole('button', { name: /Power subkit/i });

    expect(powerButton).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByTestId('slot-0')).toHaveAttribute('aria-label', 'Slot 1: empty');

    fireEvent.click(powerButton);

    const selectedPower = screen.getByRole('button', { name: /Power subkit, selected/i });
    expect(selectedPower).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByTestId('slot-0')).toHaveAttribute('aria-label', 'Slot 1: Power');
  });

  it('displays correct slot count text', () => {
    renderScreen();

    expect(screen.getByText('0 of 6 slots used')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Power subkit/i }));
    expect(screen.getByText('1 of 6 slots used')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Lighting subkit/i }));
    expect(screen.getByText('2 of 6 slots used')).toBeInTheDocument();
  });

  it('store deselectSubkit re-indexes selectionOrder', () => {
    const store = useKitStore.getState();

    act(() => store.selectSubkit('power'));
    act(() => store.selectSubkit('lighting'));
    act(() => store.selectSubkit('hygiene'));

    act(() => store.deselectSubkit('lighting'));

    const subkits = useKitStore.getState().selectedSubkits;
    expect(subkits).toHaveLength(2);
    expect(subkits[0].subkitId).toBe('power');
    expect(subkits[0].selectionOrder).toBe(1);
    expect(subkits[1].subkitId).toBe('hygiene');
    expect(subkits[1].selectionOrder).toBe(2);
  });

  it('announces subkit selection via ARIA live region', () => {
    const { polite } = setupAnnouncer();
    renderScreen();

    fireEvent.click(screen.getByRole('button', { name: /Power subkit/i }));

    return new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        expect(polite.textContent).toBe('Power added to slot 1');
        resolve();
      });
    });
  });

  it('announces subkit deselection via ARIA live region', () => {
    const { polite } = setupAnnouncer();
    renderScreen();

    fireEvent.click(screen.getByRole('button', { name: /Power subkit/i }));

    return new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        fireEvent.click(screen.getByRole('button', { name: /Power subkit, selected/i }));
        requestAnimationFrame(() => {
          expect(polite.textContent).toBe('Power removed');
          resolve();
        });
      });
    });
  });

  it('announces size change via ARIA live region', () => {
    const { polite } = setupAnnouncer();
    renderScreen();

    fireEvent.click(screen.getByRole('button', { name: /Power subkit/i }));

    return new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        const sizeGroup = screen.getByRole('radiogroup', { name: /Subkit size/i });
        const largeRadio = sizeGroup.querySelector('[aria-checked]:last-child') as HTMLElement;
        fireEvent.click(largeRadio);

        requestAnimationFrame(() => {
          expect(polite.textContent).toBe('Power changed to large');
          resolve();
        });
      });
    });
  });

  it('has no accessibility violations', async () => {
    const { container } = renderScreen();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations with selections', async () => {
    const store = useKitStore.getState();
    act(() => store.selectSubkit('power'));
    act(() => store.selectSubkit('lighting'));

    const { container } = renderScreen();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
