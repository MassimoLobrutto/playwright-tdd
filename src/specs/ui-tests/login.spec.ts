import { test, expect } from '../../fixtures/fixtures';

test.describe('Admin Authentication @admin @uiTests @regression', () => {
  test('Successful login to Shady Meadows admin dashboard', async ({
    page,
    homepage,
    adminLoginPage,
    adminDashboardPage,
  }) => {
    await test.step('Navigate to Shady Meadows admin page', async () => {
      await page.goto('https://automationintesting.online/');
      await homepage.adminLink.click();
    });

    await test.step('Login with valid credentials', async () => {
      await adminLoginPage.loginToAdminDashboard('admin', 'password');
    });

    await test.step('Verify admin dashboard is displayed', async () => {
      await expect(adminDashboardPage.pageTitle).toBeVisible();
      await expect(page).toHaveURL(/.*admin/);
    });
  });
});
