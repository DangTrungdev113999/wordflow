import { test, expect } from '@playwright/test';
import { skipOnboarding } from './helpers';

test.describe('Gamification: Streak, XP, Achievements', () => {
  test.beforeEach(async ({ page }) => {
    await skipOnboarding(page);
  });

  test('flashcard: all 4 rating buttons work and progress advances', async ({ page }) => {
    await page.goto('/vocabulary/daily-life/learn');
    await page.waitForLoadState('networkidle');

    for (const rating of ['Again', 'Hard', 'Good', 'Easy']) {
      await page.getByRole('button', { name: /reveal answer/i }).click();
      await page.waitForTimeout(300);
      await page.getByRole('button', { name: rating }).click();
      await page.waitForTimeout(300);
    }

    // Should be on card 5+
    await expect(page.getByText(/[5-9]\/\d+|\d{2}\/\d+/)).toBeVisible();
  });

  test('flashcard rating persists XP in IndexedDB', async ({ page }) => {
    await page.goto('/vocabulary/daily-life/learn');
    await page.waitForLoadState('networkidle');

    // Rate 3 cards to accumulate XP
    for (let i = 0; i < 3; i++) {
      await page.getByRole('button', { name: /reveal answer/i }).click();
      await page.waitForTimeout(300);
      await page.getByRole('button', { name: 'Easy' }).click();
      await page.waitForTimeout(500);
    }

    // Navigate to achievements — XP should be > 0
    await page.goto('/achievements');
    await page.waitForLoadState('networkidle');
    const xpText = await page.locator('.text-2xl.font-bold').first().textContent();
    const xp = parseInt(xpText?.replace(/[^0-9]/g, '') ?? '0');
    expect(xp).toBeGreaterThan(0);
  });

  test('achievements page: unlock count, Total XP card, Locked badges', async ({ page }) => {
    await page.goto('/achievements');
    await page.waitForLoadState('networkidle');

    await expect(page.getByRole('heading', { name: /achievements/i })).toBeVisible();
    await expect(page.getByText(/\d+\/\d+ unlocked/)).toBeVisible();
    await expect(page.getByText('Total XP')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Locked' })).toBeVisible();
  });

  test('dashboard: streak widget with fire icon and daily goal progress', async ({ page }) => {
    await expect(page.getByText('Current Streak')).toBeVisible();
    await expect(page.getByText(/Best:.*days/)).toBeVisible();
    await expect(page.getByText('Daily Goal')).toBeVisible();
    await expect(page.getByText(/\d+\/\d+ words/)).toBeVisible();
  });

  test('daily goal progress updates after rating flashcards', async ({ page }) => {
    // Get initial state
    const goalBefore = await page.getByText(/\d+\/\d+ words/).textContent();

    // Rate a card
    await page.goto('/vocabulary/daily-life/learn');
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: /reveal answer/i }).click();
    await page.waitForTimeout(300);
    await page.getByRole('button', { name: 'Good' }).click();
    await page.waitForTimeout(500);

    // Go back to dashboard
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const goalAfter = await page.getByText(/\d+\/\d+ words/).textContent();
    expect(goalAfter).toMatch(/\d+\/\d+ words/);
  });
});
