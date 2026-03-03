import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { SummaryScreen } from '../../src/components/summary/SummaryScreen';
import { SubkitSelectionScreen } from '../../src/components/subkit-selection/SubkitSelectionScreen';
import { useKitStore } from '../../src/store/kitStore';
import { summaryGuard } from '../../src/router/guards';

expect.extend(matchers);

async function renderSummary() {
  const router = createMemoryRouter(
    [
      { path: '/', element: <SubkitSelectionScreen /> },
      { path: '/summary', element: <SummaryScreen />, loader: summaryGuard },
    ],
    { initialEntries: ['/summary'] }
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

describe('SummaryScreen — Story 5.1: Kit Summary Display', () => {
  beforeEach(() => setupKit());

  it('renders the Review Your Kit heading', async () => {
    await renderSummary();
    expect(screen.getByRole('heading', { name: 'Review Your Kit' })).toBeInTheDocument();
  });

  it('shows total subkits and slots used', async () => {
    await renderSummary();
    expect(screen.getByText('3 subkits using 3 of 6 slots')).toBeInTheDocument();
  });

  it('renders all selected subkit sections in order', async () => {
    await renderSummary();
    const headings = screen.getAllByRole('heading', { level: 2 });
    const names = headings.map((h) => h.textContent);
    expect(names).toEqual(['Power', 'Lighting', 'Hygiene']);
  });

  it('displays items with quantities', async () => {
    await renderSummary();
    expect(screen.getByText('Portable Power Station')).toBeInTheDocument();
    expect(screen.getByText('×2')).toBeInTheDocument();
    expect(screen.getByText('Solar Panel')).toBeInTheDocument();
    expect(screen.getByText('Flashlights')).toBeInTheDocument();
  });

  it('shows empty container badge for empty subkits', async () => {
    useKitStore.getState().toggleEmptyContainer('hygiene');
    await renderSummary();
    expect(screen.getByText('Empty Container')).toBeInTheDocument();
  });

  it('shows size label for each subkit', async () => {
    useKitStore.getState().setSubkitSize('power', 'large');
    await renderSummary();
    expect(screen.getByText('Large Subkit')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = await renderSummary();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('SummaryScreen — Story 5.2: Housing Unit Visualizer', () => {
  beforeEach(() => setupKit());

  it('renders the housing unit visualizer', async () => {
    await renderSummary();
    expect(screen.getByRole('region', { name: /housing unit visualizer/i })).toBeInTheDocument();
  });
});

describe('SummaryScreen — Story 5.3: CTA and Purchase Intent', () => {
  beforeEach(() => setupKit());

  it('renders Get My Kit CTA', async () => {
    await renderSummary();
    expect(screen.getByRole('button', { name: 'Get My Kit' })).toBeInTheDocument();
  });

  it('opens purchase URL in new tab on Get My Kit click', async () => {
    const windowOpen = vi.spyOn(window, 'open').mockImplementation(() => null);
    await renderSummary();
    fireEvent.click(screen.getByRole('button', { name: 'Get My Kit' }));
    expect(windowOpen).toHaveBeenCalledWith('#', '_blank', 'noopener,noreferrer');
    windowOpen.mockRestore();
  });

  it('renders compelling message', async () => {
    await renderSummary();
    expect(screen.getByText(/Take the next step to protect your family/i)).toBeInTheDocument();
  });

  it('renders Edit My Kit button', async () => {
    await renderSummary();
    expect(screen.getByRole('button', { name: 'Edit My Kit' })).toBeInTheDocument();
  });

  it('Edit My Kit navigates to selection screen', async () => {
    await renderSummary();
    const editBtn = screen.getByRole('button', { name: 'Edit My Kit' });
    await act(async () => { fireEvent.click(editBtn); });
    await waitFor(() => {
      expect(screen.getByText(/Build Your Kit/i)).toBeInTheDocument();
    });
  });
});

describe('SummaryScreen — Story 5.4: Print & Start Over', () => {
  beforeEach(() => setupKit());

  it('renders Print My Kit button', async () => {
    await renderSummary();
    expect(screen.getByRole('button', { name: 'Print My Kit' })).toBeInTheDocument();
  });

  it('calls window.print on Print My Kit click', async () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {});
    await renderSummary();
    fireEvent.click(screen.getByRole('button', { name: 'Print My Kit' }));
    expect(printSpy).toHaveBeenCalledOnce();
    printSpy.mockRestore();
  });

  it('renders Start Over button', async () => {
    await renderSummary();
    expect(screen.getByText('Start Over')).toBeInTheDocument();
  });

  it('Start Over opens confirmation modal', async () => {
    await renderSummary();
    fireEvent.click(screen.getByText('Start Over'));
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    expect(screen.getByText(/Starting over will clear your entire kit configuration/i)).toBeInTheDocument();
  });

  it('Start Over confirm resets kit and navigates to selection', async () => {
    await renderSummary();
    fireEvent.click(screen.getByText('Start Over'));
    const modal = screen.getByRole('alertdialog');
    const buttons = modal.querySelectorAll('button');
    const confirmBtn = buttons[buttons.length - 1];
    await act(async () => { fireEvent.click(confirmBtn); });
    await waitFor(() => {
      expect(screen.getByText(/Build Your Kit/i)).toBeInTheDocument();
    });
    expect(useKitStore.getState().selectedSubkits).toHaveLength(0);
  });

  it('Start Over cancel dismisses modal', async () => {
    await renderSummary();
    fireEvent.click(screen.getByText('Start Over'));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Get My Kit' })).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = await renderSummary();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
