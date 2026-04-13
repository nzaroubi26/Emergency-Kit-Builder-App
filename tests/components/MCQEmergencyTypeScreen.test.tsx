import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { createMemoryRouter, RouterProvider, redirect } from 'react-router-dom';
import { MCQEmergencyTypeScreen } from '../../src/components/mcq/MCQEmergencyTypeScreen';
import { MCQHouseholdScreen } from '../../src/components/mcq/MCQHouseholdScreen';
import { useMCQStore } from '../../src/store/mcqStore';

expect.extend(matchers);

async function renderScreen(initialEntries = ['/build']) {
  const router = createMemoryRouter(
    [
      { path: '/', element: <div>Cover Page</div> },
      { path: '/build', element: <MCQEmergencyTypeScreen /> },
      { path: '/build/household', element: <MCQHouseholdScreen />, loader: () => {
        const { emergencyTypes } = useMCQStore.getState();
        if (emergencyTypes.length === 0) return redirect('/build');
        return null;
      }},
    ],
    { initialEntries }
  );
  let result: ReturnType<typeof render>;
  await act(async () => {
    result = render(<RouterProvider router={router} />);
  });
  return result!;
}

describe('MCQEmergencyTypeScreen', () => {
  beforeEach(() => {
    useMCQStore.getState().resetMCQ();
  });

  it('renders all five Q1 tiles', async () => {
    await renderScreen();
    expect(screen.getByText('Flood')).toBeInTheDocument();
    expect(screen.getByText('Tornado')).toBeInTheDocument();
    expect(screen.getByText('Hurricane')).toBeInTheDocument();
    expect(screen.getByText('Tropical Storm')).toBeInTheDocument();
    expect(screen.getByText('Extreme Heat')).toBeInTheDocument();
  });

  it('renders the question heading', async () => {
    await renderScreen();
    expect(screen.getByRole('heading', { name: 'What type of emergency are you prepping for?' })).toBeInTheDocument();
  });

  it('shows step indicator', async () => {
    await renderScreen();
    expect(screen.getByText('Step 1 of 2')).toBeInTheDocument();
  });

  it('toggles tile selection on click', async () => {
    await renderScreen();
    const floodTile = screen.getByRole('checkbox', { name: 'Flood' });
    expect(floodTile).toHaveAttribute('aria-checked', 'false');

    fireEvent.click(floodTile);
    expect(floodTile).toHaveAttribute('aria-checked', 'true');

    fireEvent.click(floodTile);
    expect(floodTile).toHaveAttribute('aria-checked', 'false');
  });

  it('Extreme Heat tile is disabled and non-interactive', async () => {
    await renderScreen();
    const heatTile = screen.getByRole('checkbox', { name: 'Extreme Heat' });
    expect(heatTile).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByText('Coming Soon')).toBeInTheDocument();

    fireEvent.click(heatTile);
    expect(heatTile).toHaveAttribute('aria-checked', 'false');
  });

  it('Next CTA is disabled when no tiles selected', async () => {
    await renderScreen();
    const nextBtn = screen.getByRole('button', { name: 'Next' });
    expect(nextBtn).toHaveAttribute('aria-disabled', 'true');
  });

  it('Next CTA enables when a tile is selected', async () => {
    await renderScreen();
    fireEvent.click(screen.getByRole('checkbox', { name: 'Flood' }));
    const nextBtn = screen.getByRole('button', { name: 'Next' });
    expect(nextBtn).toHaveAttribute('aria-disabled', 'false');
  });

  it('Next CTA saves to store and navigates to /build/household', async () => {
    await renderScreen();
    fireEvent.click(screen.getByRole('checkbox', { name: 'Flood' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Tornado' }));

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    });

    expect(useMCQStore.getState().emergencyTypes).toEqual(['flood', 'tornado']);
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Who will you be caring for?' })).toBeInTheDocument();
    });
  });

  it('pre-populates selections from store', async () => {
    useMCQStore.getState().setEmergencyTypes(['hurricane']);
    await renderScreen();
    const hurricaneTile = screen.getByRole('checkbox', { name: 'Hurricane' });
    expect(hurricaneTile).toHaveAttribute('aria-checked', 'true');
  });

  it('has no accessibility violations', async () => {
    const { container } = await renderScreen();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
