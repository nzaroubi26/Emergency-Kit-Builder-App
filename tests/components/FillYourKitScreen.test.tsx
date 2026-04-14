import { render, screen, act, within } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { FillYourKitScreen } from '../../src/components/fill/FillYourKitScreen';
import { useKitStore } from '../../src/store/kitStore';
import { useMCQStore } from '../../src/store/mcqStore';
import { fillGuard } from '../../src/router/guards';

async function renderFill(useGuard = false) {
  const routes = [
    {
      path: '/fill',
      element: <FillYourKitScreen />,
      ...(useGuard ? { loader: fillGuard } : {}),
    },
    { path: '/', element: <div>Home Page</div> },
  ];
  const router = createMemoryRouter(routes, { initialEntries: ['/fill'] });
  let result: ReturnType<typeof render>;
  await act(async () => {
    result = render(<RouterProvider router={router} />);
  });
  return result!;
}

function setupEssentials() {
  useMCQStore.getState().resetMCQ();
  useKitStore.getState().resetKit();
  useMCQStore.getState().setKitPath('essentials');
  useMCQStore.getState().setEmergencyTypes(['hurricane']);
  useMCQStore.getState().setHouseholdComposition([]);
}

function setupCustom() {
  useMCQStore.getState().resetMCQ();
  useKitStore.getState().resetKit();
  useMCQStore.getState().setKitPath('custom');
  useMCQStore.getState().setEmergencyTypes(['flood']);
  useMCQStore.getState().setHouseholdComposition([]);
  useKitStore.getState().selectSubkit('power');
  useKitStore.getState().selectSubkit('medical');
  useKitStore.getState().selectSubkit('cooking');
}

describe('FillYourKitScreen', () => {
  describe('page header', () => {
    beforeEach(() => setupEssentials());

    it('renders h1 heading', async () => {
      await renderFill();
      expect(screen.getByRole('heading', { name: 'Fill Your Kit', level: 1 })).toBeInTheDocument();
    });

    it('renders subtitle', async () => {
      await renderFill();
      expect(screen.getByText(/Shop for the items to fill your emergency subkits/)).toBeInTheDocument();
    });
  });

  describe('Essentials path', () => {
    beforeEach(() => setupEssentials());

    it('shows only Essentials bundle categories (Power, Cooking, Medical, Communications)', async () => {
      await renderFill();
      expect(screen.getByText('Power')).toBeInTheDocument();
      expect(screen.getByText('Cooking')).toBeInTheDocument();
      expect(screen.getByText('Medical')).toBeInTheDocument();
      expect(screen.getByText('Communications')).toBeInTheDocument();
      expect(screen.queryByText('Lighting')).not.toBeInTheDocument();
      expect(screen.queryByText('Hygiene')).not.toBeInTheDocument();
    });
  });

  describe('Custom path', () => {
    beforeEach(() => setupCustom());

    it('shows only selected subkit categories', async () => {
      await renderFill();
      expect(screen.getByText('Power')).toBeInTheDocument();
      expect(screen.getByText('Medical')).toBeInTheDocument();
      expect(screen.getByText('Cooking')).toBeInTheDocument();
      expect(screen.queryByText('Lighting')).not.toBeInTheDocument();
      expect(screen.queryByText('Hygiene')).not.toBeInTheDocument();
    });

    it('orders categories by Flood priority: Power, Medical, Cooking', async () => {
      await renderFill();
      const buttons = screen.getAllByRole('button');
      const categoryNames = buttons.map((b) => b.textContent);
      const powerIdx = categoryNames.findIndex((t) => t?.includes('Power'));
      const medicalIdx = categoryNames.findIndex((t) => t?.includes('Medical'));
      const cookingIdx = categoryNames.findIndex((t) => t?.includes('Cooking'));
      expect(powerIdx).toBeLessThan(medicalIdx);
      expect(medicalIdx).toBeLessThan(cookingIdx);
    });
  });

  describe('Pets conditional exclusion', () => {
    it('excludes Pets category when no pets in household', async () => {
      useMCQStore.getState().resetMCQ();
      useKitStore.getState().resetKit();
      useMCQStore.getState().setKitPath('custom');
      useMCQStore.getState().setEmergencyTypes(['hurricane']);
      useMCQStore.getState().setHouseholdComposition([]);
      useKitStore.getState().selectSubkit('power');
      useKitStore.getState().selectSubkit('pets');
      await renderFill();
      expect(screen.queryByText('Pets')).not.toBeInTheDocument();
    });

    it('includes Pets category when pets in household', async () => {
      useMCQStore.getState().resetMCQ();
      useKitStore.getState().resetKit();
      useMCQStore.getState().setKitPath('custom');
      useMCQStore.getState().setEmergencyTypes(['hurricane']);
      useMCQStore.getState().setHouseholdComposition(['pets']);
      useKitStore.getState().selectSubkit('power');
      useKitStore.getState().selectSubkit('pets');
      await renderFill();
      expect(screen.getByText('Pets')).toBeInTheDocument();
    });
  });

  describe('Custom category exclusion', () => {
    it('never shows Custom category even if selected', async () => {
      useMCQStore.getState().resetMCQ();
      useKitStore.getState().resetKit();
      useMCQStore.getState().setKitPath('custom');
      useMCQStore.getState().setEmergencyTypes(['hurricane']);
      useMCQStore.getState().setHouseholdComposition([]);
      useKitStore.getState().selectSubkit('power');
      useKitStore.getState().selectSubkit('custom');
      await renderFill();
      expect(screen.queryByText('Custom')).not.toBeInTheDocument();
    });
  });

  describe('Add All to Amazon Cart CTA', () => {
    beforeEach(() => setupEssentials());

    it('renders Add All to Cart button at top and bottom', async () => {
      await renderFill();
      const buttons = screen.getAllByRole('button', { name: /Add all displayed products to Amazon cart/i });
      expect(buttons).toHaveLength(2);
    });

    it('renders disclaimer near CTA', async () => {
      await renderFill();
      const disclaimers = screen.getAllByText('Prices may vary on Amazon');
      expect(disclaimers.length).toBeGreaterThanOrEqual(1);
    });

    it('calls window.open with cart URL on click', async () => {
      const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
      await renderFill();
      const buttons = screen.getAllByRole('button', { name: /Add all displayed products to Amazon cart/i });
      buttons[0].click();
      expect(openSpy).toHaveBeenCalledOnce();
      expect(openSpy.mock.calls[0][0]).toContain('amazon.com/gp/aws/cart/add.html');
      expect(openSpy.mock.calls[0][1]).toBe('_blank');
      openSpy.mockRestore();
    });
  });

  describe('Product cards and affiliate links', () => {
    beforeEach(() => setupEssentials());

    it('renders product cards with View on Amazon links', async () => {
      await renderFill();
      const links = screen.getAllByRole('link', { name: /View .+ on Amazon/ });
      expect(links.length).toBeGreaterThan(0);
      const firstLink = links[0];
      expect(firstLink).toHaveAttribute('target', '_blank');
      expect(firstLink).toHaveAttribute('rel', 'noopener noreferrer');
      expect(firstLink.getAttribute('href')).toContain('amazon.com/dp/');
    });
  });

  describe('Kids poncho conditional filtering', () => {
    it('hides Kids Rain Poncho when no kids in household', async () => {
      useMCQStore.getState().resetMCQ();
      useKitStore.getState().resetKit();
      useMCQStore.getState().setKitPath('custom');
      useMCQStore.getState().setEmergencyTypes(['hurricane']);
      useMCQStore.getState().setHouseholdComposition([]);
      useKitStore.getState().selectSubkit('clothing');
      await renderFill();
      expect(screen.queryByText('Rain Poncho (Kids)')).not.toBeInTheDocument();
      expect(screen.getByText('Rain Poncho (Adult)')).toBeInTheDocument();
    });

    it('shows Kids Rain Poncho when kids in household', async () => {
      useMCQStore.getState().resetMCQ();
      useKitStore.getState().resetKit();
      useMCQStore.getState().setKitPath('custom');
      useMCQStore.getState().setEmergencyTypes(['hurricane']);
      useMCQStore.getState().setHouseholdComposition(['kids']);
      useKitStore.getState().selectSubkit('clothing');
      await renderFill();
      expect(screen.getByText('Rain Poncho (Kids)')).toBeInTheDocument();
      expect(screen.getByText('Rain Poncho (Adult)')).toBeInTheDocument();
    });
  });

  describe('route guard', () => {
    it('redirects to / when no kit context', async () => {
      useMCQStore.getState().resetMCQ();
      useKitStore.getState().resetKit();
      await renderFill(true);
      expect(screen.getByText('Home Page')).toBeInTheDocument();
    });

    it('passes for Essentials path with empty selectedSubkits', async () => {
      useMCQStore.getState().resetMCQ();
      useKitStore.getState().resetKit();
      useMCQStore.getState().setKitPath('essentials');
      useMCQStore.getState().setEmergencyTypes(['hurricane']);
      useMCQStore.getState().setHouseholdComposition([]);
      await renderFill(true);
      expect(screen.getByRole('heading', { name: 'Fill Your Kit' })).toBeInTheDocument();
    });

    it('passes for Custom path with selectedSubkits', async () => {
      setupCustom();
      await renderFill(true);
      expect(screen.getByRole('heading', { name: 'Fill Your Kit' })).toBeInTheDocument();
    });
  });
});
