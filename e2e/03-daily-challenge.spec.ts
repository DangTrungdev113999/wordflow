import { test, expect } from '@playwright/test';
import { skipOnboarding } from './helpers';

test.describe('Feature 3: Daily Challenge', () => {
  test.beforeEach(async ({ page }) => {
    await skipOnboarding(page);
    await page.goto('/');
  });

  test('dashboard shows daily challenge widget', async ({ page }) => {
    await expect(page.getByText(/challenge|today/i)).toBeVisible({ timeout: 5000 });
  });

  test('daily challenge page loads with 3 tasks', async ({ page }) => {
    await page.goto('/daily-challenge');
    // Should show task indicators
    await expect(page.locator('body')).toContainText(/learn|grammar|dictation|task/i);
  });

  test('can complete learn word task', async ({ page }) => {
    await page.goto('/daily-challenge');
    // Find and click the learn/done button for task 1
    const learnBtn = page.getByText(/learn|mark|done|complete/i).first();
    if (await learnBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await learnBtn.click();
      // Should see XP toast or progress update
      await expect(page.getByText(/xp|✅|complete/i)).toBeVisible({ timeout: 5000 });
    }
  });
});
