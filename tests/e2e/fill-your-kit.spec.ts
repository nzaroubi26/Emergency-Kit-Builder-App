import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
});

test.describe('Fill Your Kit — Essentials Path', () => {
  test('confirmation → Fill Your Kit → product cards and CTAs visible', async ({ page }) => {
    // Cover screen
    await page.goto('/');
    await page.getByText('Build My Kit').click();

    // MCQ Screen 1 — select emergency type
    await expect(page.getByRole('heading', { name: 'What type of emergency are you prepping for?' })).toBeVisible();
    await page.getByRole('checkbox', { name: 'Hurricane' }).click();
    await page.getByRole('button', { name: 'Next' }).click();

    // MCQ Screen 2 — select household option
    await expect(page.getByRole('heading', { name: 'Who will you be caring for?' })).toBeVisible();
    await page.getByRole('checkbox', { name: 'None of the Above' }).click();
    await page.getByRole('button', { name: 'Next' }).click();

    // Fork screen — choose Essentials
    await expect(page.getByRole('heading', { name: 'Choose Your Path' })).toBeVisible();
    await page.getByRole('button', { name: 'Get Essentials Kit' }).click();

    // Review & Order
    await page.getByRole('button', { name: /Get My Kit/i }).click();

    // Order Confirmation
    await expect(page.getByText('Your kit is on its way.')).toBeVisible();

    // Click "Now Let's Fill Your Kit"
    await page.getByRole('button', { name: /Fill Your Kit/i }).click();

    // Fill Your Kit screen
    await expect(page.getByRole('heading', { name: 'Fill Your Kit' })).toBeVisible();

    // At least one product card with "View on Amazon" link
    const viewLinks = page.getByRole('link', { name: /View .+ on Amazon/ });
    await expect(viewLinks.first()).toBeVisible();

    // Verify affiliate link format
    const firstHref = await viewLinks.first().getAttribute('href');
    expect(firstHref).toContain('amazon.com/dp/');
    expect(firstHref).toContain('tag=');

    // "Add All to Amazon Cart" buttons at top and bottom
    const cartButtons = page.getByRole('button', { name: /Add all displayed products to Amazon cart/i });
    await expect(cartButtons.first()).toBeVisible();
    const cartButtonCount = await cartButtons.count();
    expect(cartButtonCount).toBe(2);
  });
});
