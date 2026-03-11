import { render, screen, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { ItemConfigScreen } from '../../src/components/item-config/ItemConfigScreen';
import { CustomSubkitScreen } from '../../src/components/item-config/CustomSubkitScreen';
import { useKitStore } from '../../src/store/kitStore';

expect.extend(matchers);

function renderItemConfigScreen(subkitId: string) {
  const router = createMemoryRouter(
    [{ path: '/configure/:subkitId', element: <ItemConfigScreen /> }],
    { initialEntries: [`/configure/${subkitId}`] }
  );
  return render(<RouterProvider router={router} />);
}

function renderCustomSubkitScreen() {
  const router = createMemoryRouter(
    [{ path: '/configure/custom', element: <CustomSubkitScreen /> }],
    { initialEntries: ['/configure/custom'] }
  );
  return render(<RouterProvider router={router} />);
}

describe('Subkit Subtotal on ItemConfigScreen', () => {
  beforeEach(() => {
    useKitStore.getState().resetKit();
    act(() => useKitStore.getState().selectSubkit('power'));
  });

  it('renders subtotal with container-only price ($40.00) for regular size', () => {
    renderItemConfigScreen('power');
    expect(screen.getByText('Subkit Subtotal: $40.00')).toBeInTheDocument();
  });

  it('updates subtotal when an item is toggled', () => {
    renderItemConfigScreen('power');
    expect(screen.getByText('Subkit Subtotal: $40.00')).toBeInTheDocument();

    const powerBanksButton = screen.getByRole('button', { name: /Power Banks, excluded/i });
    fireEvent.click(powerBanksButton);

    expect(screen.getByText('Subkit Subtotal: $69.99')).toBeInTheDocument();
  });

  it('shows Large container price ($60.00) for a Large subkit with no items', () => {
    act(() => useKitStore.getState().setSubkitSize('power', 'large'));
    renderItemConfigScreen('power');
    expect(screen.getByText('Subkit Subtotal: $60.00')).toBeInTheDocument();
  });

  it('has no accessibility violations with subtotal displayed', async () => {
    const { container } = renderItemConfigScreen('power');
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('Subkit Subtotal on CustomSubkitScreen', () => {
  beforeEach(() => {
    useKitStore.getState().resetKit();
    act(() => useKitStore.getState().selectSubkit('custom'));
  });

  it('renders subtotal indicator', () => {
    renderCustomSubkitScreen();
    expect(screen.getByText(/Subkit Subtotal: \$/)).toBeInTheDocument();
  });

  it('shows container-only price ($40.00) for regular size with no items', () => {
    renderCustomSubkitScreen();
    expect(screen.getByText('Subkit Subtotal: $40.00')).toBeInTheDocument();
  });

  it('shows Large container price ($60.00) for a Large custom subkit', () => {
    act(() => useKitStore.getState().setSubkitSize('custom', 'large'));
    renderCustomSubkitScreen();
    expect(screen.getByText('Subkit Subtotal: $60.00')).toBeInTheDocument();
  });

  it('has no accessibility violations with subtotal displayed', async () => {
    const { container } = renderCustomSubkitScreen();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
