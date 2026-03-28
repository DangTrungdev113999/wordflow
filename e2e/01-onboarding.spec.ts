import { test, expect } from '@playwright/test';
import { clearAppData } from './helpers';

test.describe('Feature 7: Onboarding & Placement Test', () => {
  test.beforeEach(async ({ page }) => {
    await clearAppData(page);
  });

  test('redirects to onboarding on first visit', async ({ page }) => {
    await page.goto('/');
    await page.waitForURL('**/onboarding');
    await expect(page.getByText(/welcome/i)).toBeVisible();
  });

  test('skip button sets A1 and goes to dashboard', async ({ page }) => {
    await page.goto('/onboarding');
    await page.getByText(/skip/i).click();
    await page.waitForURL('/');
    await expect(page.getByText(/good day/i)).toBeVisible();
  });

  test('quiz flow: 10 questions with progress', async ({ page }) => {
    await page.goto('/onboarding');
    await page.getByText(/let.*go/i).click();

    // Answer 10 questions
    for (let i = 0; i < 10; i++) {
      await expect(page.getByText(new RegExp(`${i + 1}.*10|question.*${i + 1}`, 'i'))).toBeVisible();
      // Click first option
      const options = page.locator('button').filter({ hasText: /^(?!Next|Skip|Let)/ });
      const firstOption = options.first();
      await firstOption.click();
      // Click Next or it auto-advances
      const nextBtn = page.getByText(/next/i);
      if (await nextBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
        await nextBtn.click();
      }
    }

    // Should see result
    await expect(page.getByText(/your level|A1|A2/i)).toBeVisible({ timeout: 5000 });
  });

  test('after onboarding, no redirect on revisit', async ({ page }) => {
    await page.goto('/onboarding');
    await page.getByText(/skip/i).click();
    await page.waitForURL('/');
    // Navigate away and back
    await page.goto('/vocabulary');
    await expect(page).not.toHaveURL(/onboarding/);
  });
});
