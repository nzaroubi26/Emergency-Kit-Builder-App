import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { OrderConfirmationScreen } from '../../src/components/confirmation/OrderConfirmationScreen';
import { useKitStore } from '../../src/store/kitStore';
import { useMCQStore } from '../../src/store/mcqStore';
import { confirmationGuard } from '../../src/router/guards';

async function renderConfirmation(useGuard = true) {
  const routes = [
    {
      path: '/confirmation',
      element: <OrderConfirmationScreen />,
      ...(useGuard ? { loader: confirmationGuard } : {}),
    },
    { path: '/', element: <div>Cover Page</div> },
  ];
  const router = createMemoryRouter(routes, { initialEntries: ['/confirmation'] });
  let result: ReturnType<typeof render>;
  await act(async () => {
    result = render(<RouterProvider router={router} />);
  });
  return result!;
}

function setupCustomKit() {
  useKitStore.getState().resetKit();
  useMCQStore.getState().setKitPath('custom');
  useKitStore.getState().selectSubkit('power');
  useKitStore.getState().selectSubkit('lighting');
  useKitStore.getState().selectSubkit('hygiene');
  useKitStore.getState().toggleItem('power', 'power-station');
  useKitStore.getState().setItemQuantity('power', 'power-station', 2);
  useKitStore.getState().toggleItem('power', 'power-solar');
  useKitStore.getState().toggleItem('lighting', 'light-flashlight');
}

function setupEssentials() {
  useKitStore.getState().resetKit();
  useMCQStore.getState().setKitPath('essentials');
}

describe('OrderConfirmationScreen', () => {
  describe('shared elements', () => {
    beforeEach(() => setupCustomKit());

    it('renders confirmation heading', async () => {
      await renderConfirmation();
      expect(screen.getByText(/your kit is on its way/i)).toBeInTheDocument();
    });

    it('renders "Fill Your Kit" CTA', async () => {
      await renderConfirmation();
      expect(screen.getByRole('button', { name: /fill your kit/i })).toBeInTheDocument();
    });

    it('renders Start Over button', async () => {
      await renderConfirmation();
      expect(screen.getByRole('button', { name: 'Start Over' })).toBeInTheDocument();
    });

    it('renders containers included note', async () => {
      await renderConfirmation();
      expect(screen.getByText(/containers included/i)).toBeInTheDocument();
    });
  });

  describe('essentials path', () => {
    beforeEach(() => setupEssentials());

    it('renders Essentials subheading', async () => {
      await renderConfirmation(false);
      expect(screen.getByText("Here's your Essentials Kit summary.")).toBeInTheDocument();
    });

    it('renders 4 Essentials bundle subkits', async () => {
      await renderConfirmation(false);
      expect(screen.getByText('Power')).toBeInTheDocument();
      expect(screen.getByText('Cooking')).toBeInTheDocument();
      expect(screen.getByText('Medical')).toBeInTheDocument();
      expect(screen.getByText('Communications')).toBeInTheDocument();
    });

    it('displays Essentials total as $180.00', async () => {
      await renderConfirmation(false);
      expect(screen.getByText('$180.00')).toBeInTheDocument();
    });
  });

  describe('custom path', () => {
    beforeEach(() => setupCustomKit());

    it('renders Custom subheading', async () => {
      await renderConfirmation();
      expect(screen.getByText("Here's your custom kit summary.")).toBeInTheDocument();
    });

    it('renders kit store subkits', async () => {
      await renderConfirmation();
      expect(screen.getByText('Power')).toBeInTheDocument();
      expect(screen.getByText('Lighting')).toBeInTheDocument();
      expect(screen.getByText('Hygiene')).toBeInTheDocument();
    });
  });

  describe('Fill Your Kit modal', () => {
    beforeEach(() => setupCustomKit());

    it('opens modal on CTA click', async () => {
      await renderConfirmation();
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /fill your kit/i }));
      });
      expect(screen.getByText('Coming Soon')).toBeInTheDocument();
    });

    it('closes modal via "Got It" button', async () => {
      await renderConfirmation();
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /fill your kit/i }));
      });
      expect(screen.getByText('Coming Soon')).toBeInTheDocument();
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Got It' }));
      });
      expect(screen.queryByText('Coming Soon')).not.toBeInTheDocument();
    });

    it('closes modal via Escape key', async () => {
      await renderConfirmation();
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /fill your kit/i }));
      });
      expect(screen.getByText('Coming Soon')).toBeInTheDocument();
      await act(async () => {
        fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
      });
      expect(screen.queryByText('Coming Soon')).not.toBeInTheDocument();
    });
  });

  describe('Start Over', () => {
    beforeEach(() => setupCustomKit());

    it('resets kit and MCQ stores', async () => {
      await renderConfirmation();
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Start Over' }));
      });
      await waitFor(() => {
        expect(useKitStore.getState().selectedSubkits).toHaveLength(0);
        expect(useMCQStore.getState().kitPath).toBeNull();
      });
    });

    it('navigates to / (cover page)', async () => {
      await renderConfirmation();
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Start Over' }));
      });
      await waitFor(() => {
        expect(screen.getByText('Cover Page')).toBeInTheDocument();
      });
    });
  });
});
