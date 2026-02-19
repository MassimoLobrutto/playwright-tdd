/* eslint-disable no-empty-pattern */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/stored-auth-tests/login-page';
import { Homepage } from '../pages/ui-tests/home-page';
import { AdminLoginPage } from '../pages/ui-tests/admin-login-page';
import { AdminDashboardPage } from '../pages/ui-tests/admin-dashboard-page';
import { RoomPage } from '../pages/ui-tests/room-page';
import { ApiController } from '../helper/api/api-helper';

interface Fixtures {
  loginPage: LoginPage;
  homepage: Homepage;
  adminLoginPage: AdminLoginPage;
  adminDashboardPage: AdminDashboardPage;
  roomPage: RoomPage;
  page: Page;
}

function getPageFiles() {
  return {
    loginPage: async ({ page }, use) => {
      await use(new LoginPage(page));
    },
    homepage: async ({ page }, use) => {
      await use(new Homepage(page));
    },
    adminLoginPage: async ({ page }, use) => {
      await use(new AdminLoginPage(page));
    },
    adminDashboardPage: async ({ page }, use) => {
      await use(new AdminDashboardPage(page));
    },
    roomPage: async ({ page }, use) => {
      await use(new RoomPage(page));
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
