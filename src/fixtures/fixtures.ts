/* eslint-disable no-empty-pattern */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { test as base } from '@playwright/test';
import { ApiController } from '../helper/api/api-helper';
import { ChambersHomePage } from '../pages/ui-tests/angular/chambers-home-page';
import { ChambersNavPage } from '../pages/ui-tests/angular/chambers-nav-page';
import { ChambersResearchTeamPage } from '../pages/ui-tests/angular/chambers-research-team-page';
import { SauceLabsLoginPage } from '../pages/ui-tests/react/login-page';
import { InventoryPage } from '../pages/ui-tests/react/inventory-page';
import { CartPage } from '../pages/ui-tests/react/cart-page';
import { CheckoutPage } from '../pages/ui-tests/react/checkout-page';

interface Fixtures {
  sauceLabsLoginPage: SauceLabsLoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  chambersHomePage: ChambersHomePage;
  chambersNavPage: ChambersNavPage;
  chambersResearchTeamPage: ChambersResearchTeamPage;
}

function getPageFiles() {
  return {
    sauceLabsLoginPage: async ({ page }, use) => {
      await use(new SauceLabsLoginPage(page));
    },
    inventoryPage: async ({ page }, use) => {
      await use(new InventoryPage(page));
    },
    cartPage: async ({ page }, use) => {
      await use(new CartPage(page));
    },
    checkoutPage: async ({ page }, use) => {
      await use(new CheckoutPage(page));
    },
    chambersHomePage: async ({ page }, use) => {
      await use(new ChambersHomePage(page));
    },
    chambersNavPage: async ({ page }, use) => {
      await use(new ChambersNavPage(page));
    },
    chambersResearchTeamPage: async ({ page }, use) => {
      await use(new ChambersResearchTeamPage(page));
    },
  };
}

type ApiFixtures = {
  apiController: ApiController;
  apiResponse: { last: any };
};

type CombinedFixtures = Fixtures & ApiFixtures;

export const test = base.extend<CombinedFixtures>({
  ...getPageFiles(),
  apiController: async ({ request, baseURL }, use) => {
    const controller = new ApiController(request, baseURL || '');
    await use(controller);
  },

  apiResponse: async ({}, use) => {
    await use({ last: null });
  },
});

export { expect, Page } from '@playwright/test';
