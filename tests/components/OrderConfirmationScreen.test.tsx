import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { OrderConfirmationScreen } from '../../src/components/confirmation/OrderConfirmationScreen';
import { useKitStore } from '../../src/store/kitStore';
import { confirmationGuard } from '../../src/router/guards';
import { ITEMS } from '../../src/data';
import { calculateCartGrandTotal } from '../../src/utils/cartCalculations';

expect.extend(matchers);

async function renderConfirmation() {
  const router = createMemoryRouter(
    [
      { path: '/confirmation', element: <OrderConfirmationScreen />, loader: confirmationGuard },
      { path: '/builder', element: <div>Builder</div> },
    ],
    { initialEntries: ['/confirmation'] }
  );
  let result: ReturnType<typeof render>;
  await act(async () => {
    result = render(<RouterProvider router={router} />);
  });
  return result!;
}

function setupKit() {
  useKitStore.getState().resetKit();
  useKitStore.getState().selectSubkit('power');
  useKitStore.getState().selectSubkit('lighting');
  useKitStore.getState().selectSubkit('hygiene');
  useKitStore.getState().toggleItem('power', 'power-station');
  useKitStore.getState().setItemQuantity('power', 'power-station', 2);
  useKitStore.getState().toggleItem('power', 'power-solar');
  useKitStore.getState().toggleItem('lighting', 'light-flashlight');
}

describe('OrderConfirmationScreen', () => {
  beforeEach(() => setupKit());

  it('renders confirmation heading', async () => {
    await renderConfirmation();
    expect(screen.getByText(/your kit is on its way/i)).toBeInTheDocument();
  });

  it('renders grand total with correct formatted amount', async () => {
    await renderConfirmation();
    const { selectedSubkits, itemSelections } = useKitStore.getState();
    const expectedTotal = calculateCartGrandTotal(selectedSubkits, itemSelections, ITEMS);
    expect(screen.getByText(`$${expectedTotal.toFixed(2)}`)).toBeInTheDocument();
  });

  it('renders containers included note', async () => {
    await renderConfirmation();
    expect(screen.getByText(/containers included/i)).toBeInTheDocument();
  });

  it('renders Start Over button', async () => {
    await renderConfirmation();
    expect(screen.getByRole('button', { name: 'Start Over' })).toBeInTheDocument();
  });

  it('clicking Start Over resets kit', async () => {
    await renderConfirmation();
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Start Over' }));
    });
    await waitFor(() => {
      expect(useKitStore.getState().selectedSubkits).toHaveLength(0);
    });
  });

  it('clicking Start Over navigates to /builder', async () => {
    await renderConfirmation();
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Start Over' }));
    });
    await waitFor(() => {
      expect(screen.getByText('Builder')).toBeInTheDocument();
    });
  });

  it('has no accessibility violations', async () => {
    const { container } = await renderConfirmation();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
