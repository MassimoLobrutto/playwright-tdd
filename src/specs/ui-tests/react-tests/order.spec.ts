import { test, expect } from '../../../fixtures/fixtures';
import { orderWorkflow } from '../../../e2e-workflow-helpers/order-workflow-helper';
import { generateOrderData } from '../../../test-data/test-data';
import { attachTestObject, getTestObject } from '../../../helper/utils/test-data-sharing-helper';

test.describe('SauceLabs E2E Workflows', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    // Generate a new order testObject for each test
    const orderTestObject = generateOrderData();
    // Assign testobject to testInfo container and select a unique keyword for sharing across tests in the spec
    await attachTestObject(testInfo, orderTestObject, 'generated-order-data');

    await test.step('Navigate to homepage', async () => {
      await page.goto('https://www.saucedemo.com/');
    });
  });

  test('Standard user completes a successful purchase', async ({
    page,
    sauceLabsLoginPage,
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    // retrieve the generated order testObject from the testInfo container using the keyword
    const orderTestObject = getTestObject(test.info(), 'generated-order-data');

    // As playwright tdd cannot share steps like cucumber
    // We can use a helper function to execute the order workflow steps in sequence
    // With dynamic start and stop points, allowing us to reuse the same workflow for different test scenarios
    // Below runs the standard work flow until checkout page
    // Since the user wants to run tests that differ from the e2e flow in the helper
    // They can add their custom steps and either let the test end there
    // Or for example if there we tests in the e2e worflow after they could use the orderWorkflow function to execute those steps till the end
    await orderWorkflow({
      testObject: orderTestObject,
      page,
      sauceLabsLoginPage,
      inventoryPage,
      cartPage,
      checkoutPage,
    });
  });

  test('Problem user sees broken assets', async ({ sauceLabsLoginPage, inventoryPage }) => {
    await test.step('Login as problem user', async () => {
      await sauceLabsLoginPage.loginToApplication('problem_user');
    });

    await test.step('Verify broken images are visible', async () => {
      await expect(inventoryPage.brokenImage.first()).toBeVisible();
    });
  });

  test('Performance user login takes less than 6 seconds', async ({ page, sauceLabsLoginPage }) => {
    const threshold = 6;

    await test.step('Login as performance_glitch_user user', async () => {
      await sauceLabsLoginPage.loginToApplication('performance_glitch_user');
    });

    await test.step(`Measure login duration for performance_glitch_user`, async () => {
      const start = Date.now();
      await expect(page).toHaveURL(/inventory.html/);
      const duration = (Date.now() - start) / 1000;
      expect(duration, `Login took ${duration}s which exceeds ${threshold}s`).toBeLessThan(threshold);
    });
  });
});
