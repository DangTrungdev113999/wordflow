import { test, expect } from '@playwright/test';
import { skipOnboarding } from './helpers';

test.describe('Feature 2: Data Export/Import', () => {
  test.beforeEach(async ({ page }) => {
    await skipOnboarding(page);
  });

  test('settings page has data management section', async ({ page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: /data/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /export/i })).toBeVisible();
  });

  test('export triggers file download', async ({ page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /export/i }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/wordflow-backup.*\.json/);
  });

  test('settings shows placement test section', async ({ page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: /placement/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /redo/i })).toBeVisible();
  });
});
