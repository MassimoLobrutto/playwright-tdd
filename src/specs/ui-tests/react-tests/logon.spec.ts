import { test, expect } from '../../../fixtures/fixtures';

test.describe('SauceLabs Login - Scenario Outline DDT Style', () => {
  const testCases = [
    { username: 'locked_out_user', message: 'Epic sadface: Sorry, this user has been locked out.' },
    { username: 'invalid_user', message: 'Epic sadface: Username and password do not match any user in this service' },
    { username: '', message: 'Epic sadface: Username is required' },
  ];

  test.beforeEach(async ({ page }) => {
    await test.step('Navigate to the saucelabs login page', async () => {
      await page.goto('https://www.saucedemo.com/');
    });
  });

  for (const { username, message } of testCases) {
    test(`Login as "${username}" should display error: "${message}"`, async ({ sauceLabsLoginPage }) => {
      await test.step(`Attempt login with username: "${username}"`, async () => {
        await sauceLabsLoginPage.loginToApplication(username, 'secret_sauce');
      });

      await test.step(`Verify error message contains: "${message}"`, async () => {
        await expect(sauceLabsLoginPage.errorContainer).toContainText(message);
      });
    });
  }
});
