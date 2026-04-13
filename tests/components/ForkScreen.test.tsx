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

// Need to import after mocks are set up
const { ForkScreen } = await import('../../src/components/fork/ForkScreen');
const { MCQEmergencyTypeScreen } = await import('../../src/components/mcq/MCQEmergencyTypeScreen');
const { useKitStore } = await import('../../src/store/kitStore');

function forkGuardInline() {
  const { emergencyTypes, householdComposition } = useMCQStore.getState();
  if (emergencyTypes.length === 0 || householdComposition.length === 0) {
    return redirect('/build');
  }
  return null;
}

async function renderScreen(initialEntries = ['/choose']) {
  const router = createMemoryRouter(
    [
      { path: '/build', element: <MCQEmergencyTypeScreen /> },
      { path: '/build/household', element: <div>Household Screen</div> },
      { path: '/choose', element: <ForkScreen />, loader: forkGuardInline },
      { path: '/review', element: <div>Review Screen</div> },
      { path: '/builder', element: <div>Builder Screen</div> },
    ],
    { initialEntries }
  );
  let result: ReturnType<typeof render>;
  await act(async () => {
    result = render(<RouterProvider router={router} />);
  });
  return result!;
}

describe('ForkScreen', () => {
  beforeEach(() => {
    useMCQStore.getState().resetMCQ();
    useKitStore.getState().resetKit();
    useMCQStore.getState().setEmergencyTypes(['flood']);
    useMCQStore.getState().setHouseholdComposition(['kids']);
  });

  it('renders both cards with headings', async () => {
    await renderScreen();
    expect(screen.getByRole('heading', { name: 'Choose Your Path' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Get The Essentials Kit' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Build My Own Kit' })).toBeInTheDocument();
  });

  it('renders trust badge on essentials card', async () => {
    await renderScreen();
    expect(screen.getByText('Recommended for most households')).toBeInTheDocument();
  });

  it('renders bundle preview with all four subkits', async () => {
    await renderScreen();
    expect(screen.getByText('Power')).toBeInTheDocument();
    expect(screen.getByText('Cooking')).toBeInTheDocument();
    expect(screen.getByText('Medical')).toBeInTheDocument();
    expect(screen.getByText('Communications')).toBeInTheDocument();
  });

  it('renders feature list on custom card', async () => {
    await renderScreen();
    expect(screen.getByText('Choose from 9 categories')).toBeInTheDocument();
    expect(screen.getByText('Pick Regular or Large sizes')).toBeInTheDocument();
    expect(screen.getByText('Select items & quantities')).toBeInTheDocument();
  });

  it('Card 1 CTA sets kitPath essentials and navigates to /review', async () => {
    await renderScreen();
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Get The Essentials Kit' }));
    });

    expect(useMCQStore.getState().kitPath).toBe('essentials');
    expect(useKitStore.getState().selectedSubkits.length).toBeGreaterThan(0);
    await waitFor(() => {
      expect(screen.getByText('Review Screen')).toBeInTheDocument();
    });
  });

  it('Card 2 CTA sets kitPath custom and navigates to /builder', async () => {
    await renderScreen();
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Start Building' }));
    });

    expect(useMCQStore.getState().kitPath).toBe('custom');
    await waitFor(() => {
      expect(screen.getByText('Builder Screen')).toBeInTheDocument();
    });
  });

  it('has back navigation link to /build/household', async () => {
    await renderScreen();
    const backLink = screen.getByText('Back', { exact: false });
    expect(backLink.closest('a')).toHaveAttribute('href', '/build/household');
  });

  it('route guard redirects to /build when MCQ incomplete', async () => {
    useMCQStore.getState().resetMCQ();
    await renderScreen(['/choose']);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'What type of emergency are you prepping for?' })).toBeInTheDocument();
    });
  });
});
