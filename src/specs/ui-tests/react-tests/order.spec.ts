import { test, expect } from '../../../fixtures/fixtures';
import { orderWorkflow } from '../../../e2e-workflow-helpers/order-workflow-helper';
import { generateOrderData } from '../../../test-data/test-data';
import { attachTestObject, getTestObject } from '../../../helper/utils/test-data-sharing-helper';

test.describe('SauceLabs E2E Workflows', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    // Generate a new order test object for each test and attach it to the test info for later retrieval
    const orderTesObject = generateOrderData();
    // Assign test object to test info for sharing across steps in the workflow
    await attachTestObject(testInfo, orderTesObject, 'generated-order-data');

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
    // retrieve the generated order test object from the test info
    const orderTestObject = getTestObject(test.info(), 'generated-order-data');

    // As playwright tdd cannot share steps like cucumber
    // We can use a helper function to execute the order workflow steps in sequence
    // With dynamic start and stop points, allowing us to reuse the same workflow for different test scenarios
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

    await test.step('Login as standard user', async () => {
      await sauceLabsLoginPage.loginToApplication('standard_user');
    });

    await test.step(`Measure login duration for performance_glitch_user`, async () => {
      const start = Date.now();
      await expect(page).toHaveURL(/inventory.html/);
      const duration = (Date.now() - start) / 1000;
      expect(duration, `Login took ${duration}s which exceeds ${threshold}s`).toBeLessThan(threshold);
    });
  });
});
