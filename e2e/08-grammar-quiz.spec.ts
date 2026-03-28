import { test, expect } from '@playwright/test';
import { skipOnboarding } from './helpers';

/** Answer whatever exercise type is currently showing */
async function answerCurrentExercise(page: import('@playwright/test').Page) {
  await page.locator('text=/Multiple Choice|Fill in the Blank|Error Correction|Sentence Order/').waitFor({ timeout: 5000 });
  const body = await page.locator('body').textContent() ?? '';

  if (body.includes('Multiple Choice')) {
    await page.locator('button.w-full.text-left').first().click();
    await page.getByRole('button', { name: 'Check' }).click();
  } else if (body.includes('Fill in the Blank')) {
    await page.getByPlaceholder(/type your answer/i).fill('test');
    await page.getByRole('button', { name: 'Check' }).click();
  } else if (body.includes('Error Correction')) {
    await page.locator('.flex.flex-wrap.gap-2 button').first().click();
    await page.getByRole('button', { name: 'Check' }).click();
  } else if (body.includes('Sentence Order')) {
    while (true) {
      const availBtn = page.locator('.flex.flex-wrap.gap-2.min-h-\\[44px\\] button').first();
      if (await availBtn.isVisible({ timeout: 500 }).catch(() => false)) {
        await availBtn.click();
        await page.waitForTimeout(100);
      } else break;
    }
    await page.getByRole('button', { name: 'Check' }).click();
  }
}

test.describe('Grammar Quiz Flow', () => {
  test.beforeEach(async ({ page }) => {
    await skipOnboarding(page);
  });

  test('lesson page → click Start Quiz button → quiz loads', async ({ page }) => {
    await page.goto('/grammar/present-simple');
    await page.waitForLoadState('networkidle');

    // Lesson page has Start Quiz button
    await page.getByRole('button', { name: /start quiz/i }).click();
    await expect(page).toHaveURL(/grammar\/present-simple\/quiz/);
    await expect(page.getByText('Question 1 of 10')).toBeVisible();
  });

  test('MC: select → Check → green styling → Next advances question', async ({ page }) => {
    await page.goto('/grammar/present-simple/quiz');
    await page.waitForLoadState('networkidle');

    await expect(page.getByText('Multiple Choice')).toBeVisible();
    const options = page.locator('button.w-full.text-left');

    // Select "goes" (correct, index 1)
    await options.nth(1).click();
    await expect(options.nth(1)).toHaveClass(/border-indigo-500/);

    await page.getByRole('button', { name: 'Check' }).click();
    await expect(options.nth(1)).toHaveClass(/border-green-500/);
    await expect(page.getByRole('button', { name: 'Check' })).toBeHidden();

    await page.getByRole('button', { name: /Next →/ }).click();
    await page.waitForTimeout(500);
    await expect(page.getByText('Question 2 of 10')).toBeVisible();
  });

  test('fill-blank: type correct answer → ✅ Correct! + input disabled', async ({ page }) => {
    await page.goto('/grammar/present-simple/quiz');
    await page.waitForLoadState('networkidle');

    // Skip 3 MC questions
    for (let i = 0; i < 3; i++) {
      await answerCurrentExercise(page);
      await page.getByRole('button', { name: /Next →/ }).click();
      await page.waitForTimeout(500);
    }

    await expect(page.getByText('Fill in the Blank')).toBeVisible();
    const input = page.getByPlaceholder(/type your answer/i);
    await input.fill("don't play");
    await page.getByRole('button', { name: 'Check' }).click();

    await expect(page.getByText('✅ Correct!')).toBeVisible();
    await expect(input).toBeDisabled();
  });

  test('complete 10 questions → Quiz Complete! with score/XP → Retry resets', async ({ page }) => {
    test.setTimeout(60000);
    await page.goto('/grammar/present-simple/quiz');
    await page.waitForLoadState('networkidle');

    for (let q = 0; q < 10; q++) {
      await answerCurrentExercise(page);
      const nextBtn = page.getByRole('button', { name: /Next →/ });
      if (await nextBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await nextBtn.click();
        await page.waitForTimeout(500);
      }
    }

    await expect(page.getByText('Quiz Complete!')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Score')).toBeVisible();
    await expect(page.getByText('XP Earned')).toBeVisible();
    await expect(page.getByText(/✅ Correct: \d+\/10/)).toBeVisible();

    // Retry
    await page.getByRole('button', { name: /retry/i }).click();
    await expect(page.getByText('Question 1 of 10')).toBeVisible({ timeout: 3000 });
  });
});
