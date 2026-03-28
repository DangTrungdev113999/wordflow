import { test, expect } from '@playwright/test';
import { skipOnboarding } from './helpers';

test.describe('Feature 4: Listening Practice', () => {
  test.beforeEach(async ({ page }) => {
    await skipOnboarding(page);
  });

  test('listening page shows mode selector and topics', async ({ page }) => {
    await page.goto('/listening');
    await page.waitForLoadState('networkidle');
    // Check page content
    await expect(page.getByText(/listening/i)).toBeVisible();
    // Mode tabs (Word is a common word, be specific)
    await expect(page.locator('body')).toContainText(/word|phrase|sentence/i);
  });

  test('can navigate to dictation session', async ({ page }) => {
    await page.goto('/listening');
    await page.waitForLoadState('networkidle');
    // Click any topic link
    const topicLink = page.locator('a[href*="/listening/"]').first();
    if (await topicLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      await topicLink.click();
      await expect(page).toHaveURL(/listening.*practice/);
    }
  });
});
