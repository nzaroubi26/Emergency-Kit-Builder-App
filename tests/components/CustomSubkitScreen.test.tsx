import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { CustomSubkitScreen } from '../../src/components/item-config/CustomSubkitScreen';
import { useKitStore } from '../../src/store/kitStore';
import { STANDARD_CATEGORY_IDS } from '../../src/data';
import { CATEGORIES } from '../../src/data';

expect.extend(matchers);

function renderScreen() {
  const router = createMemoryRouter(
    [{ path: '/configure/custom', element: <CustomSubkitScreen /> }],
    { initialEntries: ['/configure/custom'] }
  );
  return render(<RouterProvider router={router} />);
}

describe('CustomSubkitScreen', () => {
  beforeEach(() => {
    useKitStore.getState().resetKit();
    act(() => useKitStore.getState().selectSubkit('custom'));
    act(() => useKitStore.getState().selectSubkit('power'));
    act(() => useKitStore.getState().selectSubkit('lighting'));
  });

  it('renders heading with custom color accent', () => {
    renderScreen();
    expect(screen.getByText('Build Your Custom Subkit')).toBeInTheDocument();
  });

  it('displays items from all standard categories', () => {
    renderScreen();
    for (const catId of STANDARD_CATEGORY_IDS) {
      const cat = CATEGORIES[catId];
      if (cat) {
        const matches = screen.getAllByText(cat.name);
        expect(matches.length).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it('displays category group headers', () => {
    renderScreen();
    for (const catId of STANDARD_CATEGORY_IDS) {
      const heading = document.getElementById(`category-${catId}`);
      expect(heading).toBeTruthy();
    }
  });

  it('displays category jump navigation', () => {
    renderScreen();
    const nav = screen.getByRole('navigation', { name: /Jump to category/i });
    expect(nav).toBeInTheDocument();
    const buttons = nav.querySelectorAll('button');
    expect(buttons.length).toBe(STANDARD_CATEGORY_IDS.length);
  });

  it('includes empty container option', () => {
    renderScreen();
    expect(screen.getByText(/send an empty container/i)).toBeInTheDocument();
  });

  it('renders progress indicator', () => {
    renderScreen();
    expect(screen.getByText(/Subkit \d+ of \d+/i)).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = renderScreen();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
