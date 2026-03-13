import { test, expect } from '../../../fixtures/fixtures';

test.describe('SauceLabs Login - Scenario Outline DDT Style', () => {
  // The below is the equivalent of the Examples section of a cucumber feature file
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

  // The for loop will iterate through the 'Examples' const above and slot the values in like it would
  // In a cucumber Scenario Outline feature
  for (const { username, message } of testCases) {
    test(`Login as "${username}" should display error: "${message}"`, async ({ sauceLabsLoginPage }) => {
      await test.step(`Attempt login with username: "${username}"`, async () => {
        await sauceLabsLoginPage.loginToApplication(username);
      });

      // Best practice is to has assertions in the spec, they as a rule should not be in a POM method
      await test.step(`Verify error message contains: "${message}"`, async () => {
        await expect(sauceLabsLoginPage.errorContainer).toContainText(message);
      });
    });
  }
});
