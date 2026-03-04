import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { SubkitSelectionScreen } from '../../src/components/subkit-selection/SubkitSelectionScreen';
import { ItemConfigScreen } from '../../src/components/item-config/ItemConfigScreen';
import { CustomSubkitScreen } from '../../src/components/item-config/CustomSubkitScreen';
import { SummaryScreen } from '../../src/components/summary/SummaryScreen';
import { useKitStore } from '../../src/store/kitStore';
import { subkitConfigGuard, customConfigGuard, summaryGuard } from '../../src/router/guards';

expect.extend(matchers);

async function renderFlow(initialEntries = ['/configure/power']) {
  const router = createMemoryRouter(
    [
      { path: '/builder', element: <SubkitSelectionScreen /> },
      { path: '/configure/custom', element: <CustomSubkitScreen />, loader: customConfigGuard },
      { path: '/configure/:subkitId', element: <ItemConfigScreen />, loader: subkitConfigGuard },
      { path: '/summary', element: <SummaryScreen />, loader: summaryGuard },
    ],
    { initialEntries }
  );
  let result: ReturnType<typeof render>;
  await act(async () => {
    result = render(<RouterProvider router={router} />);
  });
  return result!;
}

describe('Navigation and Flow', () => {
  beforeEach(() => {
    useKitStore.getState().resetKit();
    useKitStore.getState().selectSubkit('power');
    useKitStore.getState().selectSubkit('lighting');
    useKitStore.getState().selectSubkit('hygiene');
  });

  it('shows Next Subkit CTA on non-final subkit', async () => {
    await renderFlow(['/configure/power']);
    expect(screen.getByRole('button', { name: 'Next Subkit' })).toBeInTheDocument();
  });

  it('shows Review My Kit CTA on final subkit', async () => {
    await renderFlow(['/configure/hygiene']);
    expect(screen.getByRole('button', { name: 'Review My Kit' })).toBeInTheDocument();
  });

  it('navigates to next subkit on Next click', async () => {
    await renderFlow(['/configure/power']);
    const nextBtn = screen.getByRole('button', { name: 'Next Subkit' });
    await act(async () => { fireEvent.click(nextBtn); });
    await waitFor(() => {
      expect(screen.getByText(/Configure Your Lighting Subkit/i)).toBeInTheDocument();
    });
  });

  it('navigates to summary on Review My Kit click', async () => {
    await renderFlow(['/configure/hygiene']);
    const reviewBtn = screen.getByRole('button', { name: 'Review My Kit' });
    await act(async () => { fireEvent.click(reviewBtn); });
    await waitFor(() => {
      expect(screen.getByText('Review Your Kit')).toBeInTheDocument();
    });
  });

  it('back button navigates to previous subkit', async () => {
    await renderFlow(['/configure/lighting']);
    const backBtn = screen.getByRole('button', { name: 'Go back' });
    await act(async () => { fireEvent.click(backBtn); });
    await waitFor(() => {
      expect(screen.getByText(/Configure Your Power Subkit/i)).toBeInTheDocument();
    });
  });

  it('shows confirmation modal when back on first subkit', async () => {
    await renderFlow(['/configure/power']);
    const backBtn = screen.getByRole('button', { name: 'Go back' });
    fireEvent.click(backBtn);
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  });

  it('shows Back to Subkit Selection link', async () => {
    await renderFlow(['/configure/power']);
    expect(screen.getByText('Back to Subkit Selection')).toBeInTheDocument();
  });

  it('Back to Subkit Selection link opens modal', async () => {
    await renderFlow(['/configure/lighting']);
    fireEvent.click(screen.getByText('Back to Subkit Selection'));
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  });

  it('preserves item selections across navigation', async () => {
    await renderFlow(['/configure/power']);

    const firstItem = screen.getAllByRole('button', { name: /excluded/i })[0];
    fireEvent.click(firstItem);

    const nextBtn = screen.getByRole('button', { name: 'Next Subkit' });
    await act(async () => { fireEvent.click(nextBtn); });
    await waitFor(() => {
      expect(screen.getByText(/Configure Your Lighting Subkit/i)).toBeInTheDocument();
    });

    const backBtn = screen.getByRole('button', { name: 'Go back' });
    await act(async () => { fireEvent.click(backBtn); });
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /included/i })).toBeInTheDocument();
    });
  });

  it('progress indicator updates correctly', async () => {
    await renderFlow(['/configure/power']);
    expect(screen.getByText('Subkit 1 of 3')).toBeInTheDocument();
  });

  it('modal confirm navigates to subkit selection', async () => {
    await renderFlow(['/configure/power']);
    const backBtn = screen.getByRole('button', { name: 'Go back' });
    fireEvent.click(backBtn);
    const confirmBtn = screen.getByRole('button', { name: 'Go Back' });
    await act(async () => { fireEvent.click(confirmBtn); });
    await waitFor(() => {
      expect(screen.getByText(/Build Your Kit/i)).toBeInTheDocument();
    });
  });

  it('modal cancel keeps user on config screen', async () => {
    await renderFlow(['/configure/power']);
    fireEvent.click(screen.getByText('Back to Subkit Selection'));
    const cancelBtn = screen.getByRole('button', { name: 'Stay Here' });
    fireEvent.click(cancelBtn);
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next Subkit' })).toBeInTheDocument();
  });

  it('has no accessibility violations on config screen', async () => {
    const { container } = await renderFlow(['/configure/power']);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('Custom Subkit Navigation', () => {
  beforeEach(() => {
    useKitStore.getState().resetKit();
    useKitStore.getState().selectSubkit('power');
    useKitStore.getState().selectSubkit('custom');
  });

  it('shows Next Subkit or Review My Kit on custom screen', async () => {
    await renderFlow(['/configure/custom']);
    expect(screen.getByRole('button', { name: 'Review My Kit' })).toBeInTheDocument();
  });

  it('custom screen shows Back to Subkit Selection link', async () => {
    await renderFlow(['/configure/custom']);
    expect(screen.getByText('Back to Subkit Selection')).toBeInTheDocument();
  });

  it('custom screen back arrow navigates to previous subkit', async () => {
    await renderFlow(['/configure/custom']);
    const backBtn = screen.getByRole('button', { name: 'Go back' });
    await act(async () => { fireEvent.click(backBtn); });
    await waitFor(() => {
      expect(screen.getByText(/Configure Your Power Subkit/i)).toBeInTheDocument();
    });
  });

  it('custom screen back arrow on first subkit shows modal', async () => {
    useKitStore.getState().resetKit();
    useKitStore.getState().selectSubkit('custom');
    await renderFlow(['/configure/custom']);
    const backBtn = screen.getByRole('button', { name: 'Go back' });
    fireEvent.click(backBtn);
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  });

  it('navigates from standard to custom subkit via Next', async () => {
    await renderFlow(['/configure/power']);
    const nextBtn = screen.getByRole('button', { name: 'Next Subkit' });
    await act(async () => { fireEvent.click(nextBtn); });
    await waitFor(() => {
      expect(screen.getByText(/Build Your Custom Subkit/i)).toBeInTheDocument();
    });
  });

  it('has no accessibility violations on custom screen', async () => {
    const { container } = await renderFlow(['/configure/custom']);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
