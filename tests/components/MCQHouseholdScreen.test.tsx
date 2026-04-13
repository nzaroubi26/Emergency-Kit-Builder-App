import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { createMemoryRouter, RouterProvider, redirect } from 'react-router-dom';
import { MCQEmergencyTypeScreen } from '../../src/components/mcq/MCQEmergencyTypeScreen';
import { MCQHouseholdScreen } from '../../src/components/mcq/MCQHouseholdScreen';
import { useMCQStore } from '../../src/store/mcqStore';

expect.extend(matchers);

async function renderScreen(initialEntries = ['/build/household']) {
  const router = createMemoryRouter(
    [
      { path: '/build', element: <MCQEmergencyTypeScreen /> },
      { path: '/build/household', element: <MCQHouseholdScreen />, loader: () => {
        const { emergencyTypes } = useMCQStore.getState();
        if (emergencyTypes.length === 0) return redirect('/build');
        return null;
      }},
      { path: '/choose', element: <div>Fork Screen</div> },
    ],
    { initialEntries }
  );
  let result: ReturnType<typeof render>;
  await act(async () => {
    result = render(<RouterProvider router={router} />);
  });
  return result!;
}

describe('MCQHouseholdScreen', () => {
  beforeEach(() => {
    useMCQStore.getState().resetMCQ();
    // Pre-fill Q1 so guard passes
    useMCQStore.getState().setEmergencyTypes(['flood']);
  });

  it('renders all five Q2 tiles', async () => {
    await renderScreen();
    expect(screen.getByText('Kids')).toBeInTheDocument();
    expect(screen.getByText('Older Adults')).toBeInTheDocument();
    expect(screen.getByText('Person with a Disability')).toBeInTheDocument();
    expect(screen.getByText('Pets')).toBeInTheDocument();
    expect(screen.getByText('None of the Above')).toBeInTheDocument();
  });

  it('renders the question heading', async () => {
    await renderScreen();
    expect(screen.getByRole('heading', { name: 'Who will you be caring for?' })).toBeInTheDocument();
  });

  it('shows step indicator', async () => {
    await renderScreen();
    expect(screen.getByText('Step 2 of 2')).toBeInTheDocument();
  });

  it('toggles tile selection on click', async () => {
    await renderScreen();
    const kidsTile = screen.getByRole('checkbox', { name: 'Kids' });
    expect(kidsTile).toHaveAttribute('aria-checked', 'false');

    fireEvent.click(kidsTile);
    expect(kidsTile).toHaveAttribute('aria-checked', 'true');

    fireEvent.click(kidsTile);
    expect(kidsTile).toHaveAttribute('aria-checked', 'false');
  });

  it('NOTA mutex: selecting NOTA deselects all others', async () => {
    await renderScreen();
    fireEvent.click(screen.getByRole('checkbox', { name: 'Kids' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Pets' }));

    expect(screen.getByRole('checkbox', { name: 'Kids' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('checkbox', { name: 'Pets' })).toHaveAttribute('aria-checked', 'true');

    fireEvent.click(screen.getByRole('checkbox', { name: 'None of the Above' }));

    expect(screen.getByRole('checkbox', { name: 'None of the Above' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('checkbox', { name: 'Kids' })).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByRole('checkbox', { name: 'Pets' })).toHaveAttribute('aria-checked', 'false');
  });

  it('NOTA mutex: selecting other option deselects NOTA', async () => {
    await renderScreen();
    fireEvent.click(screen.getByRole('checkbox', { name: 'None of the Above' }));
    expect(screen.getByRole('checkbox', { name: 'None of the Above' })).toHaveAttribute('aria-checked', 'true');

    fireEvent.click(screen.getByRole('checkbox', { name: 'Kids' }));

    expect(screen.getByRole('checkbox', { name: 'Kids' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('checkbox', { name: 'None of the Above' })).toHaveAttribute('aria-checked', 'false');
  });

  it('Next CTA is disabled when no tiles selected', async () => {
    await renderScreen();
    const nextBtn = screen.getByRole('button', { name: 'Next' });
    expect(nextBtn).toHaveAttribute('aria-disabled', 'true');
  });

  it('Next CTA enables when a tile is selected', async () => {
    await renderScreen();
    fireEvent.click(screen.getByRole('checkbox', { name: 'Pets' }));
    const nextBtn = screen.getByRole('button', { name: 'Next' });
    expect(nextBtn).toHaveAttribute('aria-disabled', 'false');
  });

  it('Next CTA enables when NOTA is selected', async () => {
    await renderScreen();
    fireEvent.click(screen.getByRole('checkbox', { name: 'None of the Above' }));
    const nextBtn = screen.getByRole('button', { name: 'Next' });
    expect(nextBtn).toHaveAttribute('aria-disabled', 'false');
  });

  it('Next CTA saves to store and navigates to /choose', async () => {
    await renderScreen();
    fireEvent.click(screen.getByRole('checkbox', { name: 'Kids' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Pets' }));

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    });

    expect(useMCQStore.getState().householdComposition).toEqual(['kids', 'pets']);
    await waitFor(() => {
      expect(screen.getByText('Fork Screen')).toBeInTheDocument();
    });
  });

  it('pre-populates selections from store', async () => {
    useMCQStore.getState().setHouseholdComposition(['older-adults', 'pets']);
    await renderScreen();
    expect(screen.getByRole('checkbox', { name: 'Older Adults' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('checkbox', { name: 'Pets' })).toHaveAttribute('aria-checked', 'true');
  });

  it('route guard redirects to /build when Q1 is empty', async () => {
    useMCQStore.getState().resetMCQ();
    await renderScreen(['/build/household']);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'What type of emergency are you prepping for?' })).toBeInTheDocument();
    });
  });

  it('has no accessibility violations', async () => {
    const { container } = await renderScreen();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
