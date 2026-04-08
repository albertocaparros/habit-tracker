import { expect, test } from '@playwright/test';

test.describe('smoke', () => {
  test('home shows title and bottom navigation', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('HabitTracker');
    const nav = page.locator('app-navigation nav');
    await expect(nav.locator('a[href="/"]')).toBeVisible();
    await expect(nav.locator('a[href="/add"]')).toBeVisible();
    await expect(nav.locator('a[href="/overview"]')).toBeVisible();
    await expect(nav.locator('a[href="/settings"]')).toBeVisible();
  });

  test('settings page loads and language select is present', async ({
    page,
  }) => {
    await page.goto('/settings');
    await expect(
      page.getByRole('heading', { name: /settings|configuración/i }),
    ).toBeVisible();
    await expect(page.getByTestId('language-select')).toBeVisible();
  });

  test('navigate from home to add habit route', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('new-habit-button').click();
    await expect(page).toHaveURL(/\/add$/);
  });
});
