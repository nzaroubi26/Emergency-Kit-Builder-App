import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.evaluate(() => localStorage.clear());
});

test.describe('Full configuration flow', () => {
  test('select 3 subkits, configure items, reach summary', async ({ page }) => {
    await page.goto('/builder');
    await expect(page.getByRole('heading', { name: 'Build Your Kit' })).toBeVisible();

    const cards = page.locator('[data-testid^="subkit-card-"]');
    await cards.nth(0).click();
    await cards.nth(1).click();
    await cards.nth(2).click();

    await expect(page.getByText('3 of 6 slots used')).toBeVisible();

    await page.getByRole('button', { name: 'Configure Items' }).click();
    await expect(page.getByText(/Configure Your/)).toBeVisible();

    const itemButtons = page.getByRole('button', { name: /excluded/i });
    if (await itemButtons.count() > 0) {
      await itemButtons.first().click();
    }

    await page.getByRole('button', { name: 'Next Subkit' }).click();
    await expect(page.getByText(/Configure Your/)).toBeVisible();

    await page.getByRole('button', { name: 'Next Subkit' }).click();
    await expect(page.getByText(/Configure Your/)).toBeVisible();

    await page.getByRole('button', { name: 'Review My Kit' }).click();
    await expect(page.getByRole('heading', { name: 'Review Your Kit' })).toBeVisible();
    await expect(page.getByRole('button', { name: /Get My Kit|Processing/ })).toBeVisible();
  });
});

test.describe('Back-navigation state preservation', () => {
  test('navigating back preserves selections', async ({ page }) => {
    await page.goto('/builder');

    const cards = page.locator('[data-testid^="subkit-card-"]');
    await cards.nth(0).click();
    await cards.nth(1).click();
    await cards.nth(2).click();

    await page.getByRole('button', { name: 'Configure Items' }).click();
    await expect(page.getByText(/Configure Your/)).toBeVisible();

    const itemButtons = page.getByRole('button', { name: /excluded/i });
    if (await itemButtons.count() > 0) {
      await itemButtons.first().click();
    }

    await page.getByRole('button', { name: 'Go back' }).click();

    const modal = page.getByRole('alertdialog');
    if (await modal.isVisible()) {
      await modal.getByRole('button', { name: 'Go Back' }).click();
    }

    await expect(page.getByText('3 of 6 slots used')).toBeVisible();

    const filledSlots = page.locator('[data-testid^="slot-"]').filter({ hasText: /.+/ });
    await expect(filledSlots).toHaveCount(3);
  });
});

test.describe('Start Over reset', () => {
  test('Start Over clears all state', async ({ page }) => {
    await page.goto('/builder');

    const cards = page.locator('[data-testid^="subkit-card-"]');
    await cards.nth(0).click();
    await cards.nth(1).click();
    await cards.nth(2).click();

    await page.getByRole('button', { name: 'Configure Items' }).click();
    await page.getByRole('button', { name: 'Next Subkit' }).click();
    await page.getByRole('button', { name: 'Next Subkit' }).click();
    await page.getByRole('button', { name: 'Review My Kit' }).click();

    await expect(page.getByRole('heading', { name: 'Review Your Kit' })).toBeVisible();

    await page.getByText('Start Over').click();
    await expect(page.getByRole('alertdialog')).toBeVisible();

    await page.getByRole('button', { name: 'Start Over' }).click();

    await expect(page.getByRole('heading', { name: 'Build Your Kit' })).toBeVisible();
    await expect(page.getByText('0 of 6 slots used')).toBeVisible();
  });
});
