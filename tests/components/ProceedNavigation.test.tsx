import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { SubkitSelectionScreen } from '../../src/components/subkit-selection/SubkitSelectionScreen';
import { ItemConfigScreen } from '../../src/components/item-config/ItemConfigScreen';
import { useKitStore } from '../../src/store/kitStore';
import { subkitConfigGuard, summaryGuard, customConfigGuard } from '../../src/router/guards';

expect.extend(matchers);

function renderWithRouter(initialEntries = ['/']) {
  const router = createMemoryRouter(
    [
      { path: '/', element: <SubkitSelectionScreen /> },
      { path: '/configure/:subkitId', element: <ItemConfigScreen />, loader: subkitConfigGuard },
    ],
    { initialEntries }
  );
  return render(<RouterProvider router={router} />);
}

describe('Proceed to Item Configuration', () => {
  beforeEach(() => {
    useKitStore.getState().resetKit();
  });

  it('shows Configure Items CTA button', () => {
    renderWithRouter();
    expect(screen.getByRole('button', { name: 'Configure Items' })).toBeInTheDocument();
  });

  it('CTA is aria-disabled when fewer than 3 subkits selected', () => {
    renderWithRouter();
    const cta = screen.getByRole('button', { name: 'Configure Items' });
    expect(cta).toHaveAttribute('aria-disabled', 'true');
  });

  it('shows minimum message when CTA is disabled', () => {
    renderWithRouter();
    expect(screen.getByText('Choose at least 3 categories to continue')).toBeInTheDocument();
  });

  it('CTA becomes enabled after 3 selections', () => {
    const store = useKitStore.getState();
    act(() => store.selectSubkit('power'));
    act(() => store.selectSubkit('lighting'));
    act(() => store.selectSubkit('hygiene'));

    renderWithRouter();
    const cta = screen.getByRole('button', { name: 'Configure Items' });
    expect(cta).toHaveAttribute('aria-disabled', 'false');
  });

  it('hides minimum message when 3+ subkits selected', () => {
    const store = useKitStore.getState();
    act(() => store.selectSubkit('power'));
    act(() => store.selectSubkit('lighting'));
    act(() => store.selectSubkit('hygiene'));

    renderWithRouter();
    expect(screen.queryByText('Choose at least 3 categories to continue')).not.toBeInTheDocument();
  });

  it('navigates to first subkit config on CTA click', async () => {
    const store = useKitStore.getState();
    act(() => store.selectSubkit('power'));
    act(() => store.selectSubkit('lighting'));
    act(() => store.selectSubkit('hygiene'));

    renderWithRouter();
    const cta = screen.getByRole('button', { name: 'Configure Items' });
    await act(async () => { fireEvent.click(cta); });

    expect(screen.getByText(/Configure Your Power Subkit/i)).toBeInTheDocument();
  });

  it('sets currentConfigIndex to 0 on navigate', async () => {
    const store = useKitStore.getState();
    act(() => store.selectSubkit('power'));
    act(() => store.selectSubkit('lighting'));
    act(() => store.selectSubkit('hygiene'));
    act(() => store.setCurrentConfigIndex(5));

    renderWithRouter();
    const cta = screen.getByRole('button', { name: 'Configure Items' });
    await act(async () => { fireEvent.click(cta); });

    expect(useKitStore.getState().currentConfigIndex).toBe(0);
  });

  it('CTA is still focusable when disabled', () => {
    renderWithRouter();
    const cta = screen.getByRole('button', { name: 'Configure Items' });
    cta.focus();
    expect(document.activeElement).toBe(cta);
  });

  it('CTA has aria-describedby linking to min message when disabled', () => {
    renderWithRouter();
    const cta = screen.getByRole('button', { name: 'Configure Items' });
    const describedBy = cta.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    const msgEl = document.getElementById(describedBy!);
    expect(msgEl).toHaveTextContent('Choose at least 3 categories to continue');
  });

  it('has no accessibility violations with CTA disabled', async () => {
    const { container } = renderWithRouter();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('Route Guards', () => {
  beforeEach(() => {
    useKitStore.getState().resetKit();
  });

  it('subkitConfigGuard redirects when subkit not selected', () => {
    const result = subkitConfigGuard({ params: { subkitId: 'power' } });
    expect(result).not.toBeNull();
  });

  it('subkitConfigGuard allows when subkit is selected', () => {
    act(() => useKitStore.getState().selectSubkit('power'));
    const result = subkitConfigGuard({ params: { subkitId: 'power' } });
    expect(result).toBeNull();
  });

  it('customConfigGuard redirects when custom not selected', () => {
    const result = customConfigGuard();
    expect(result).not.toBeNull();
  });

  it('customConfigGuard allows when custom is selected', () => {
    act(() => useKitStore.getState().selectSubkit('custom'));
    const result = customConfigGuard();
    expect(result).toBeNull();
  });

  it('summaryGuard redirects when fewer than 3 subkits', () => {
    act(() => useKitStore.getState().selectSubkit('power'));
    const result = summaryGuard();
    expect(result).not.toBeNull();
  });

  it('summaryGuard allows when 3+ subkits selected', () => {
    act(() => useKitStore.getState().selectSubkit('power'));
    act(() => useKitStore.getState().selectSubkit('lighting'));
    act(() => useKitStore.getState().selectSubkit('hygiene'));
    const result = summaryGuard();
    expect(result).toBeNull();
  });
});
