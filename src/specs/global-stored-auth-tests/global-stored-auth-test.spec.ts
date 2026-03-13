import { test, expect } from '../../fixtures/fixtures';

// Test test. below can be extended to run pre steps before it actually executes the test
// In this case before loging it will go to the site and login and store the cookies
// Then it will actually run the test below with the cookies it stored via the fixture
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
