import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createMemoryRouter, RouterProvider, redirect } from 'react-router-dom';
import { useMCQStore } from '../../src/store/mcqStore';

// Mock the data barrel to avoid @assets import chain
vi.mock('../../src/data/index', () => ({
  CATEGORIES: {
    power: { id: 'power', name: 'Power', colorBase: '#C2410C', colorTint: '#FFF7ED', icon: 'Zap', description: '', sizeOptions: ['regular', 'large'] },
    cooking: { id: 'cooking', name: 'Cooking', colorBase: '#15803D', colorTint: '#F0FDF4', icon: 'UtensilsCrossed', description: '', sizeOptions: ['regular', 'large'] },
    medical: { id: 'medical', name: 'Medical', colorBase: '#991B1B', colorTint: '#FEF2F2', icon: 'HeartPulse', description: '', sizeOptions: ['regular', 'large'] },
    communications: { id: 'communications', name: 'Communications', colorBase: '#1D4ED8', colorTint: '#EFF6FF', icon: 'Radio', description: '', sizeOptions: ['regular', 'large'] },
  },
  ITEMS: [],
  ITEMS_BY_CATEGORY: {},
  STANDARD_CATEGORY_IDS: ['power', 'cooking', 'medical', 'communications'],
  ITEM_ICON_OVERRIDES: {},
  ITEM_IMAGES: {},
}));

const { ReviewOrderScreen } = await import('../../src/components/review/ReviewOrderScreen');
const { ForkScreen } = await import('../../src/components/fork/ForkScreen');

function reviewGuardInline() {
  const { kitPath } = useMCQStore.getState();
  if (!kitPath) return redirect('/choose');
  return null;
}

function forkGuardInline() {
  const { emergencyTypes, householdComposition } = useMCQStore.getState();
  if (emergencyTypes.length === 0 || householdComposition.length === 0) {
    return redirect('/build');
  }
  return null;
}

async function renderScreen(initialEntries = ['/review']) {
  const router = createMemoryRouter(
    [
      { path: '/build', element: <div>Build Screen</div> },
      { path: '/choose', element: <ForkScreen />, loader: forkGuardInline },
      { path: '/review', element: <ReviewOrderScreen />, loader: reviewGuardInline },
      { path: '/confirmation', element: <div>Confirmation Screen</div> },
    ],
    { initialEntries }
  );
  let result: ReturnType<typeof render>;
  await act(async () => {
    result = render(<RouterProvider router={router} />);
  });
  return result!;
}

describe('ReviewOrderScreen', () => {
  beforeEach(() => {
    useMCQStore.getState().resetMCQ();
    useMCQStore.getState().setEmergencyTypes(['flood']);
    useMCQStore.getState().setHouseholdComposition(['kids']);
    useMCQStore.getState().setKitPath('essentials');
  });

  it('renders heading and kit summary', async () => {
    await renderScreen();
    expect(screen.getByRole('heading', { name: 'Review & Order' })).toBeInTheDocument();
    expect(screen.getByText('The Essentials Kit')).toBeInTheDocument();
  });

  it('shows all four subkits in summary', async () => {
    await renderScreen();
    expect(screen.getByText('Power')).toBeInTheDocument();
    expect(screen.getByText('Cooking')).toBeInTheDocument();
    expect(screen.getByText('Medical')).toBeInTheDocument();
    expect(screen.getByText('Communications')).toBeInTheDocument();
  });

  it('shows slot count', async () => {
    await renderScreen();
    expect(screen.getByText('5 of 6 slots used')).toBeInTheDocument();
  });

  it('renders delivery section', async () => {
    await renderScreen();
    expect(screen.getByText('Delivery Options')).toBeInTheDocument();
    expect(screen.getByLabelText('Deliver to my address')).toBeInTheDocument();
  });

  it('Place Order CTA navigates to /confirmation', async () => {
    await renderScreen();
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Place Order' }));
    });
    await waitFor(() => {
      expect(screen.getByText('Confirmation Screen')).toBeInTheDocument();
    });
  });

  it('has back navigation link to /choose', async () => {
    await renderScreen();
    const backLink = screen.getByText('Back', { exact: false });
    expect(backLink.closest('a')).toHaveAttribute('href', '/choose');
  });

  it('route guard redirects to /choose when kitPath is null', async () => {
    useMCQStore.getState().resetMCQ();
    useMCQStore.getState().setEmergencyTypes(['flood']);
    useMCQStore.getState().setHouseholdComposition(['kids']);
    // kitPath is null after reset
    await renderScreen(['/review']);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Choose Your Path' })).toBeInTheDocument();
    });
  });
});
