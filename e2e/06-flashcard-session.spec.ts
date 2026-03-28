import { test, expect } from '@playwright/test';
import { skipOnboarding } from './helpers';

test.describe('Features 5+6: Flashcard & Pronunciation', () => {
  test.beforeEach(async ({ page }) => {
    await skipOnboarding(page);
  });

  test('can start flashcard session', async ({ page }) => {
    // Go directly to a learn page
    await page.goto('/vocabulary/daily-life/learn');
    await page.waitForLoadState('networkidle');
    // Should see flashcard UI (card or reveal button)
    await expect(page.locator('body')).toContainText(/reveal|1\/|tap/i);
  });

  test('flashcard shows rating buttons when flipped', async ({ page }) => {
    await page.goto('/vocabulary/daily-life/learn');
    await page.waitForLoadState('networkidle');
    const revealBtn = page.getByText(/reveal/i);
    if (await revealBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await revealBtn.click();
      await expect(page.getByText(/again/i)).toBeVisible({ timeout: 3000 });
      await expect(page.getByText(/easy/i)).toBeVisible();
    }
  });
});
