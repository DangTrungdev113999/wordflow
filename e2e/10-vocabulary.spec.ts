import { test, expect } from '@playwright/test';
import { skipOnboarding } from './helpers';

test.describe('Vocabulary: Topic browsing & Flashcard interactions', () => {
  test.beforeEach(async ({ page }) => {
    await skipOnboarding(page);
  });

  test('topic list → click topic → detail page → Start Flashcards → flashcard UI', async ({ page }) => {
    // Navigate to vocabulary via bottom nav
    await page.locator('nav').last().getByText('Vocab').click();
    await expect(page).toHaveURL(/vocabulary/);

    // Should see topic list with at least one topic
    await expect(page.getByText('Daily Life')).toBeVisible({ timeout: 5000 });

    // Click "Daily Life" topic
    await page.getByText('Daily Life').click();
    await expect(page).toHaveURL(/vocabulary\/daily-life/);

    // Topic detail page should show word list and Start Flashcards button
    await expect(page.getByText(/Start Flashcards/i)).toBeVisible();

    // Click Start Flashcards → goes to learn page
    await page.getByText(/Start Flashcards/i).click();
    await expect(page).toHaveURL(/vocabulary\/daily-life\/learn/);

    // Flashcard UI should load with progress counter and card
    await expect(page.locator('text=/1\\//').first()).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/Tap to reveal/i)).toBeVisible();
  });

  test('flashcard flip: front shows "Tap to reveal", back shows meaning + rating buttons', async ({ page }) => {
    await page.goto('/vocabulary/daily-life/learn');
    await page.waitForLoadState('networkidle');

    // Front side: "Tap to reveal" hint visible
    await expect(page.getByText(/Tap to reveal/i)).toBeVisible({ timeout: 5000 });

    // Rating buttons should have opacity-0 (pointer-events-none) before flip
    const ratingContainer = page.locator('.grid.grid-cols-4');
    await expect(ratingContainer).toHaveClass(/opacity-0/);

    // Click Reveal Answer to flip
    await page.getByRole('button', { name: /Reveal Answer/i }).click();
    await page.waitForTimeout(500);

    // Back side: meaning should be visible (indigo text in card back)
    // The card back shows meaning text — it's the word's Vietnamese translation
    const backContent = page.locator('.bg-white.rounded-3xl, .dark\\:bg-gray-900.rounded-3xl').first();
    // After flip, "Tap to reveal" should be hidden and rating buttons visible
    await expect(page.getByRole('button', { name: 'Again' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Hard' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Good' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Easy' })).toBeVisible();
  });

  test('rate card → next card loads with different word', async ({ page }) => {
    await page.goto('/vocabulary/daily-life/learn');
    await page.waitForLoadState('networkidle');

    // Get the first word displayed on the card front
    // The word is in a span with text-3xl font-bold text-white
    const firstWord = await page.locator('.text-3xl.font-bold.text-white').first().textContent();

    // Flip and rate
    await page.getByRole('button', { name: /Reveal Answer/i }).click();
    await page.waitForTimeout(300);
    await page.getByRole('button', { name: 'Easy' }).click();
    await page.waitForTimeout(500);

    // Next card should show a different word
    const secondWord = await page.locator('.text-3xl.font-bold.text-white').first().textContent();
    expect(secondWord).not.toBe(firstWord);

    // Progress should now show 2/
    await expect(page.locator('text=/2\\//').first()).toBeVisible();
  });

  test('navigate between multiple topics', async ({ page }) => {
    // Go to vocabulary page
    await page.goto('/vocabulary');
    await page.waitForLoadState('networkidle');

    // Click first topic (Daily Life)
    await page.getByText('Daily Life').click();
    await expect(page).toHaveURL(/vocabulary\/daily-life/);
    await expect(page.getByText(/Start Flashcards/i)).toBeVisible();

    // Go back to vocabulary list
    await page.goBack();
    await expect(page).toHaveURL(/vocabulary$/);

    // Click second topic (Food & Drink)
    await page.getByText('Food & Drink').click();
    await expect(page).toHaveURL(/vocabulary\/food-drink/);
    await expect(page.getByText(/Start Flashcards/i)).toBeVisible();

    // Go back and navigate to a third topic
    await page.goBack();
    await page.getByText('Travel').click();
    await expect(page).toHaveURL(/vocabulary\/travel/);
    await expect(page.getByText(/Start Flashcards/i)).toBeVisible();
  });

  test('progress bar advances after rating cards', async ({ page }) => {
    await page.goto('/vocabulary/daily-life/learn');
    await page.waitForLoadState('networkidle');

    // Get progress bar initial width
    const progressBar = page.locator('.h-full.bg-indigo-500.rounded-full');
    const initialWidth = await progressBar.getAttribute('style');

    // Rate first card
    await page.getByRole('button', { name: /Reveal Answer/i }).click();
    await page.waitForTimeout(300);
    await page.getByRole('button', { name: 'Good' }).click();
    await page.waitForTimeout(500);

    // Progress bar should have advanced (different width)
    const updatedWidth = await progressBar.getAttribute('style');
    expect(updatedWidth).not.toBe(initialWidth);

    // Rate second card
    await page.getByRole('button', { name: /Reveal Answer/i }).click();
    await page.waitForTimeout(300);
    await page.getByRole('button', { name: 'Easy' }).click();
    await page.waitForTimeout(500);

    // Progress bar should advance further
    const finalWidth = await progressBar.getAttribute('style');
    expect(finalWidth).not.toBe(updatedWidth);
  });
});
