import { test, expect } from '@playwright/test';
import { skipOnboarding } from './helpers';

test.describe('Console Error Check', () => {
  test('no console errors on main pages', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await skipOnboarding(page);

    // Visit main pages
    const routes = ['/', '/vocabulary', '/listening', '/grammar', '/achievements', '/settings', '/daily-challenge'];
    for (const route of routes) {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
    }

    // Filter out known non-critical errors (e.g., service worker, third-party)
    const criticalErrors = errors.filter(e =>
      !e.includes('service-worker') &&
      !e.includes('workbox') &&
      !e.includes('Failed to fetch')
    );

    expect(criticalErrors).toEqual([]);
  });
});
