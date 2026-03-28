import { test, expect } from '@playwright/test';
import { skipOnboarding } from './helpers';

test.describe('Navigation & Bottom Nav', () => {
  test.beforeEach(async ({ page }) => {
    await skipOnboarding(page);
  });

  test('dashboard loads with daily goal', async ({ page }) => {
    await expect(page.getByText(/daily goal/i)).toBeVisible();
  });

  test('bottom nav has 5 items including Listen', async ({ page }) => {
    // BottomNav uses: Home, Vocab, Listen, Grammar, Badges
    await expect(page.locator('nav').last().getByText('Home')).toBeVisible();
    await expect(page.locator('nav').last().getByText('Vocab')).toBeVisible();
    await expect(page.locator('nav').last().getByText('Listen')).toBeVisible();
    await expect(page.locator('nav').last().getByText('Grammar')).toBeVisible();
    await expect(page.locator('nav').last().getByText('Badges')).toBeVisible();
  });

  test('navigate to vocabulary page', async ({ page }) => {
    await page.locator('nav').last().getByText('Vocab').click();
    await expect(page).toHaveURL(/vocabulary/);
  });

  test('navigate to listening page', async ({ page }) => {
    await page.locator('nav').last().getByText('Listen').click();
    await expect(page).toHaveURL(/listening/);
  });

  test('navigate to grammar page', async ({ page }) => {
    await page.locator('nav').last().getByText('Grammar').click();
    await expect(page).toHaveURL(/grammar/);
  });
});
