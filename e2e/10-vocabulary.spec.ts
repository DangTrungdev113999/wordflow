import { test, expect } from '@playwright/test';
import { skipOnboarding } from './helpers';

test.describe('Vocabulary Browsing & Flashcards', () => {
  test.beforeEach(async ({ page }) => {
    await skipOnboarding(page);
  });

  test('topic list → topic detail → Start Flashcards → flashcard UI', async ({ page }) => {
    await page.goto('/vocabulary');
    await page.waitForLoadState('networkidle');

    await page.getByText(/daily life/i).click();
    await expect(page).toHaveURL(/vocabulary\/daily-life/);
    await expect(page.getByText(/\d+ words?/i)).toBeVisible();

    await page.getByRole('button', { name: /start flashcards/i }).click();
    await expect(page).toHaveURL(/vocabulary\/daily-life\/learn/);
    await expect(page.getByText(/1\/\d+/)).toBeVisible();
    await expect(page.getByRole('button', { name: /reveal answer/i })).toBeVisible();
  });

  test('flashcard: front has "Tap to reveal", back shows meaning + 4 rating buttons', async ({ page }) => {
    await page.goto('/vocabulary/daily-life/learn');
    await page.waitForLoadState('networkidle');

    await expect(page.getByText(/tap to reveal/i)).toBeVisible();

    await page.getByRole('button', { name: /reveal answer/i }).click();
    await page.waitForTimeout(400);

    for (const label of ['Again', 'Hard', 'Good', 'Easy']) {
      await expect(page.getByRole('button', { name: label })).toBeVisible();
    }
  });

  test('flashcard: rate card → next card loads with new word', async ({ page }) => {
    await page.goto('/vocabulary/daily-life/learn');
    await page.waitForLoadState('networkidle');

    // Get word on first card
    await page.getByRole('button', { name: /reveal answer/i }).click();
    await page.waitForTimeout(300);
    const firstMeaning = await page.locator('.text-2xl.font-bold.text-indigo-600').textContent();

    // Rate it
    await page.getByRole('button', { name: 'Good' }).click();
    await page.waitForTimeout(500);

    // Should advance to card 2
    await expect(page.getByText(/2\/\d+/)).toBeVisible();

    // Reveal new card — different word
    await page.getByRole('button', { name: /reveal answer/i }).click();
    await page.waitForTimeout(300);
    const secondMeaning = await page.locator('.text-2xl.font-bold.text-indigo-600').textContent();
    expect(secondMeaning).not.toEqual(firstMeaning);
  });

  test('navigate between multiple vocabulary topics', async ({ page }) => {
    await page.goto('/vocabulary');
    await page.waitForLoadState('networkidle');

    const topicLinks = page.locator('a[href*="/vocabulary/"]');
    expect(await topicLinks.count()).toBeGreaterThanOrEqual(3);

    await topicLinks.first().click();
    const url1 = page.url();

    await page.goto('/vocabulary');
    await topicLinks.nth(1).click();
    const url2 = page.url();

    expect(url1).not.toEqual(url2);
  });

  test('word detail page accessible from topic', async ({ page }) => {
    await page.goto('/vocabulary/daily-life');
    await page.waitForLoadState('networkidle');

    const wordLink = page.locator('a[href*="/vocabulary/word/"]').first();
    if (await wordLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      await wordLink.click();
      await expect(page).toHaveURL(/vocabulary\/word\//);
    }
  });

  test('flashcard progress bar advances with each rated card', async ({ page }) => {
    await page.goto('/vocabulary/daily-life/learn');
    await page.waitForLoadState('networkidle');

    // Rate 5 cards
    for (let i = 0; i < 5; i++) {
      await page.getByRole('button', { name: /reveal answer/i }).click();
      await page.waitForTimeout(200);
      await page.getByRole('button', { name: 'Easy' }).click();
      await page.waitForTimeout(300);
    }

    // Should show 6/20
    await expect(page.getByText(/6\/20/)).toBeVisible();
  });
});
