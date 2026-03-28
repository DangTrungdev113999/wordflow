import { test, expect } from '@playwright/test';
import { skipOnboarding } from './helpers';

test.describe('Gamification: XP, Achievements, Streaks', () => {
  test.beforeEach(async ({ page }) => {
    await skipOnboarding(page);
  });

  test('flashcard rating buttons (Again/Hard/Good/Easy) advance progress', async ({ page }) => {
    await page.goto('/vocabulary/daily-life/learn');
    await page.waitForLoadState('networkidle');

    // Should see card front with "Tap to reveal"
    await expect(page.getByText(/Tap to reveal/i)).toBeVisible({ timeout: 5000 });

    // Note the initial progress counter
    const progressText = page.locator('text=/1\\//');
    await expect(progressText).toBeVisible();

    // Click "Reveal Answer" to flip card
    await page.getByRole('button', { name: /Reveal Answer/i }).click();
    await page.waitForTimeout(300);

    // All 4 rating buttons should be visible
    await expect(page.getByRole('button', { name: 'Again' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Hard' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Good' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Easy' })).toBeVisible();

    // Rate "Good" → should advance to next card
    await page.getByRole('button', { name: 'Good' }).click();
    await page.waitForTimeout(500);

    // Progress should show 2/
    await expect(page.locator('text=/2\\//').first()).toBeVisible({ timeout: 3000 });
  });

  test('rate multiple cards with different buttons', async ({ page }) => {
    await page.goto('/vocabulary/daily-life/learn');
    await page.waitForLoadState('networkidle');

    const ratings = ['Again', 'Hard', 'Good', 'Easy'];

    for (let i = 0; i < ratings.length; i++) {
      // Flip card
      const revealBtn = page.getByRole('button', { name: /Reveal Answer/i });
      if (await revealBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await revealBtn.click();
      } else {
        // Card might auto-show back, try clicking the card area
        await page.getByText(/Tap to reveal/i).click();
      }
      await page.waitForTimeout(300);

      // Click the rating button
      await page.getByRole('button', { name: ratings[i] }).click();
      await page.waitForTimeout(500);
    }

    // After 4 ratings, progress should show 5/
    await expect(page.locator('text=/5\\//').first()).toBeVisible({ timeout: 3000 });
  });

  test('rate cards → navigate to Achievements → XP > 0 persists', async ({ page }) => {
    await page.goto('/vocabulary/daily-life/learn');
    await page.waitForLoadState('networkidle');

    // Rate 2 cards to earn some XP
    for (let i = 0; i < 2; i++) {
      await page.getByRole('button', { name: /Reveal Answer/i }).click();
      await page.waitForTimeout(300);
      await page.getByRole('button', { name: 'Good' }).click();
      await page.waitForTimeout(500);
    }

    // Navigate to Achievements page (bottom nav is hidden on /learn pages)
    await page.goto('/achievements');
    await page.waitForLoadState('networkidle');

    // LevelProgress card shows Total XP — should be > 0
    const levelCard = page.locator('.bg-gradient-to-r');
    await expect(levelCard).toBeVisible({ timeout: 3000 });
    await expect(levelCard.getByText('Total XP')).toBeVisible();
    // XP value (text-2xl font-bold) should not be "0"
    const xpValue = levelCard.locator('.text-2xl.font-bold').first();
    const xpNum = await xpValue.textContent();
    expect(Number(xpNum?.replace(/,/g, ''))).toBeGreaterThan(0);
  });

  test('Achievements page: unlock count, Total XP card, Locked section', async ({ page }) => {
    await page.goto('/achievements');
    await page.waitForLoadState('networkidle');

    // Page heading
    await expect(page.getByRole('heading', { name: 'Achievements' })).toBeVisible();

    // Unlock counter "X/Y unlocked"
    await expect(page.getByText(/\d+\/\d+ unlocked/)).toBeVisible();

    // LevelProgress gradient card with Total XP
    const levelCard = page.locator('.bg-gradient-to-r');
    await expect(levelCard).toBeVisible();
    await expect(levelCard.getByText('Total XP')).toBeVisible();
    await expect(levelCard.getByText(/Level \d/)).toBeVisible();

    // Locked section should exist with achievements
    await expect(page.getByRole('heading', { name: 'Locked' })).toBeVisible();
  });

  test('Dashboard: streak widget + daily goal visible', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Daily Goal widget
    await expect(page.getByText('Daily Goal')).toBeVisible();
    await expect(page.getByText(/\d+\/\d+ words/)).toBeVisible();

    // Streak widget with "Current Streak" text
    await expect(page.getByText('Current Streak')).toBeVisible();
  });

  test('daily goal progress updates after rating flashcards', async ({ page }) => {
    // Check initial daily goal state
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Get initial word count text (e.g., "0/10 words")
    const goalText = page.getByText(/\d+\/\d+ words/);
    await expect(goalText).toBeVisible();
    const initialText = await goalText.textContent();

    // Go learn some flashcards
    await page.goto('/vocabulary/daily-life/learn');
    await page.waitForLoadState('networkidle');

    // Rate 3 cards as "Good" to earn XP and count words
    for (let i = 0; i < 3; i++) {
      await page.getByRole('button', { name: /Reveal Answer/i }).click();
      await page.waitForTimeout(300);
      await page.getByRole('button', { name: 'Good' }).click();
      await page.waitForTimeout(500);
    }

    // Go back to dashboard (nav hidden on fullscreen /learn page)
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Daily goal text should have updated (words count increased)
    const updatedText = await page.getByText(/\d+\/\d+ words/).textContent();
    expect(updatedText).not.toBe(initialText);
  });
});
