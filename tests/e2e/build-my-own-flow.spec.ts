import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
});

test.describe('Build My Own — Full Happy Path', () => {
  test('cover → MCQ → fork → builder → configure → summary → review → confirmation', async ({ page }) => {
    // Cover screen
    await page.goto('/');
    await page.getByText('Build My Kit').click();

    // MCQ Screen 1 — select emergency type
    await expect(page.getByRole('heading', { name: 'What type of emergency are you prepping for?' })).toBeVisible();
    await page.getByRole('checkbox', { name: 'Flood' }).click();
    await page.getByRole('button', { name: 'Next' }).click();

    // MCQ Screen 2 — select household option
    await expect(page.getByRole('heading', { name: 'Who will you be caring for?' })).toBeVisible();
    await page.getByRole('checkbox', { name: 'None of the Above' }).click();
    await page.getByRole('button', { name: 'Next' }).click();

    // Fork screen — choose Build My Own
    await expect(page.getByRole('heading', { name: 'Choose Your Path' })).toBeVisible();
    await page.getByRole('button', { name: 'Start Building' }).click();

    // SubkitSelectionScreen — select 3 subkits
    await expect(page.getByRole('heading', { name: 'Build Your Emergency Kit' })).toBeVisible();
    await page.getByRole('button', { name: /Power subkit/i }).click();
    await page.getByRole('button', { name: /Lighting subkit/i }).click();
    await page.getByRole('button', { name: /Medical subkit/i }).click();

    // Click "Configure Items"
    await page.getByRole('button', { name: 'Configure Items' }).click();

    // ItemConfigScreen — navigate through each subkit
    // Subkit 1: Power — click "Next Subkit"
    await page.getByRole('button', { name: /Next Subkit/i }).click();

    // Subkit 2: Lighting — click "Next Subkit"
    await page.getByRole('button', { name: /Next Subkit/i }).click();

    // Subkit 3 (last): Medical — click "Review My Kit"
    await page.getByRole('button', { name: /Review My Kit/i }).click();

    // SummaryScreen — verify summary and click "Get My Kit"
    await expect(page.getByRole('heading', { name: 'Review Your Kit' })).toBeVisible();
    await page.getByRole('button', { name: 'Get My Kit' }).click();

    // ReviewOrderScreen — verify custom path back link and summary
    await expect(page.getByRole('heading', { name: 'Review & Order' })).toBeVisible();
    await expect(page.getByText('Back to Kit Summary')).toBeVisible();
    await expect(page.getByText('Your Custom Kit')).toBeVisible();

    // Place Order → confirmation
    await page.getByRole('button', { name: 'Place Order' }).click();
    await expect(page.getByText('Your kit is on its way.')).toBeVisible();
  });
});
