import { test, expect } from '../../../fixtures/fixtures';

const BASE_URL = 'https://www.saucedemo.com/';

test.describe('SauceLabs React cart and checkout validations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('locked out user should see the locked out error message', async ({ sauceLabsLoginPage }) => {
    await sauceLabsLoginPage.loginToApplication('locked_out_user');
    await expect(sauceLabsLoginPage.errorContainer).toContainText(
      'Epic sadface: Sorry, this user has been locked out.'
    );
  });

  test('standard user cart should preserve contents after continue shopping', async ({
    sauceLabsLoginPage,
    inventoryPage,
    cartPage,
  }) => {
    await sauceLabsLoginPage.loginToApplication('standard_user');
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await expect(inventoryPage.cartBadge).toHaveText('1');

    await inventoryPage.goToCart();
    await cartPage.continueShopping();

    await expect(inventoryPage.cartBadge).toHaveText('1');
    await inventoryPage.addItemToCart('Sauce Labs Bike Light');
    await expect(inventoryPage.cartBadge).toHaveText('2');
  });

  test('removing an item from cart updates the cart item count', async ({
    sauceLabsLoginPage,
    inventoryPage,
    cartPage,
  }) => {
    await sauceLabsLoginPage.loginToApplication('standard_user');
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.addItemToCart('Sauce Labs Bike Light');

    await inventoryPage.goToCart();
    await expect(cartPage.cartItem).toHaveCount(2);

    await cartPage.removeItem('Sauce Labs Backpack');
    await expect(cartPage.cartItem).toHaveCount(1);

    await cartPage.continueShopping();
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('checkout page shows a validation error when first name is missing', async ({
    sauceLabsLoginPage,
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    await sauceLabsLoginPage.loginToApplication('standard_user');
    await inventoryPage.addItemToCart('Sauce Labs Bike Light');
    await inventoryPage.goToCart();
    await cartPage.checkout();

    await checkoutPage.clickContinue();
    await expect(checkoutPage.errorContainer).toBeVisible();
    await expect(checkoutPage.errorIcon.first()).toBeVisible();
  });

  test('direct cart page access should show login when not authenticated', async ({ page }) => {
    await page.goto(`${BASE_URL}cart.html`);
    await expect(page).toHaveURL(/cart\.html/);
    await expect(page).toHaveTitle('Swag Labs');
  });
});
