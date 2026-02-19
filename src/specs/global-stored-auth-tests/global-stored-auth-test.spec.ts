import { test, expect } from '../../fixtures/fixtures';

test.describe('Test Global Stored Auth @globalStoredAuthTests @regression', () => {
  test('should verify the products page title after login', async ({ page }) => {
    await test.step('Navigate to the inventory page', async () => {
      // This works because your storageState is injected via playwright.config.ts
      await page.goto('https://www.saucedemo.com/inventory.html');
    });

    await test.step('Verify the products title is visible', async () => {
      const title = page.locator('.title');
      await expect(title).toHaveText('Products');
    });
  });
});
