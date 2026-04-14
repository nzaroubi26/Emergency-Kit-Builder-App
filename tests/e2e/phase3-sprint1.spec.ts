import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
});

test.describe('Phase 3 Sprint 1 — Essentials Happy Path', () => {
  test('cover → MCQ-1 → MCQ-2 → fork → Review & Order → confirmation', async ({ page }) => {
    // Cover screen — click "Build My Kit"
    await page.goto('/');
    await expect(page.getByText('Build My Kit')).toBeVisible();
    await page.getByText('Build My Kit').click();

    // MCQ Screen 1 — select emergency type
    await expect(page.getByRole('heading', { name: 'What type of emergency are you prepping for?' })).toBeVisible();
    await expect(page.getByText('Step 1 of 2')).toBeVisible();
    await page.getByRole('checkbox', { name: 'Flood' }).click();
    await page.getByRole('button', { name: 'Next' }).click();

    // MCQ Screen 2 — select household option
    await expect(page.getByRole('heading', { name: 'Who will you be caring for?' })).toBeVisible();
    await expect(page.getByText('Step 2 of 2')).toBeVisible();
    await page.getByRole('checkbox', { name: 'Kids' }).click();
    await page.getByRole('button', { name: 'Next' }).click();

    // Fork screen — choose Essentials
    await expect(page.getByRole('heading', { name: 'Choose Your Path' })).toBeVisible();
    await expect(page.getByText('Recommended for most households')).toBeVisible();
    await page.getByRole('button', { name: 'Get The Essentials Kit' }).click();

    // Review & Order screen — scope to main to avoid CartSidebar duplicates
    await expect(page.getByRole('heading', { name: 'Review & Order' })).toBeVisible();
    const main = page.getByRole('main');
    await expect(main.getByText('The Essentials Kit')).toBeVisible();
    await expect(main.getByText('Power')).toBeVisible();
    await expect(main.getByText('Cooking')).toBeVisible();
    await expect(main.getByText('Medical')).toBeVisible();
    await expect(main.getByText('Communications')).toBeVisible();
    await expect(main.getByText('5 of 6 slots used')).toBeVisible();
    await expect(main.getByText('Delivery Options')).toBeVisible();

    // Place Order → confirmation
    await page.getByRole('button', { name: 'Place Order' }).click();
    await expect(page.getByText('Your kit is on its way.')).toBeVisible();
  });
});

test.describe('Phase 3 Sprint 1 — Build My Own Path', () => {
  test('cover → MCQ-1 → MCQ-2 → fork → visualizer', async ({ page }) => {
    // Cover screen — click "Build My Kit"
    await page.goto('/');
    await page.getByText('Build My Kit').click();

    // MCQ Screen 1 — select emergency type
    await expect(page.getByRole('heading', { name: 'What type of emergency are you prepping for?' })).toBeVisible();
    await page.getByRole('checkbox', { name: 'Hurricane' }).click();
    await page.getByRole('button', { name: 'Next' }).click();

    // MCQ Screen 2 — select "None of the Above"
    await expect(page.getByRole('heading', { name: 'Who will you be caring for?' })).toBeVisible();
    await page.getByRole('checkbox', { name: 'None of the Above' }).click();
    await page.getByRole('button', { name: 'Next' }).click();

    // Fork screen — choose Build My Own
    await expect(page.getByRole('heading', { name: 'Choose Your Path' })).toBeVisible();
    await page.getByRole('button', { name: 'Start Building' }).click();

    // Visualizer / SubkitSelectionScreen
    await expect(page.getByRole('heading', { name: 'Build Your Emergency Kit' })).toBeVisible();
  });
});
