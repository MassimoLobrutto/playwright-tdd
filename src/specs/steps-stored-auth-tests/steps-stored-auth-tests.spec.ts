import { test, expect } from '../../fixtures/fixtures';
import path from 'node:path';
import fs from 'node:fs';

test.describe('Steps stored auth tests @stepStoredAuthTests @regression', () => {
  test('should verify admin dashboard sections and buttons', async ({ page }) => {
    await test.step('Inject Auth Cookies and Navigate to Admin Dashboard', async () => {
      // 1. Resolve the path to your saved auth state
      const authPath = path.resolve(__dirname, '../../.auth/booker_user.json');
      const authData = JSON.parse(fs.readFileSync(authPath, 'utf-8'));

      // 2. Manual cookie injection (Useful for testing session persistence)
      await page.context().clearCookies();
      await page.context().addCookies(authData.cookies);

      // 3. Navigate
      await page.goto('https://automationintesting.online/');
      await page.getByRole('link', { name: 'Admin', exact: true }).click();

      // 4. Verify landing
      await expect(page.getByText('Room details')).toBeVisible();
    });

    await test.step('Verify Management Sections', async () => {
      // In TDD, we can check multiple sections in one logical step
      const sections = ['Rooms', 'Report', 'Messages'];

      for (const sectionName of sections) {
        const section = page.getByRole('link', { name: sectionName });
        await expect(section).toBeVisible();
      }
    });

    await test.step('Verify Key Buttons', async () => {
      const logoutBtn = page.getByRole('button', { name: 'Logout' });
      await expect(logoutBtn).toBeVisible();
    });
  });
});
